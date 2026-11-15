/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubjectId, RevisionCycleKey } from '../types';
import {
  SUBJECT_CHAPTERS,
  getCanonicalChapterKey
} from '../components/RevisionPlanner';
import {
  analyzeUserDayRationale,
  findRealisticGapOnClock,
  minutesToClockTime
} from './sleepPatternAnalysis';
import {
  normalizeKey,
  isMockTestTask,
  findSubjectForChapter,
  isTaskCompletedInStorage,
  resolveExactOrBestChapterMatch
} from './taskCompletionSync';
import { CALevel, getSelectedCALevel } from '../data/curriculumLevels';
import {
  getLevelScopedKey,
  getClockSlotsStorageKey,
  getDefaultSubjectForLevel
} from './levelStorage';

export interface ReconcileOptions {
  source?: 'clock' | 'metrics' | 'tasks' | 'flow' | 'logs' | 'milestones' | 'revision' | 'manual_audit';
  preferClockDuration?: boolean;
  dispatchEvents?: boolean;
  level?: CALevel;
}

export interface ReconciledTargetAuditRow {
  id: string;
  normKey: string;
  title: string;
  cleanTitle: string;
  subjectCode: SubjectId;
  chapterName?: string;
  relevance: 'General' | 'Revision' | 'Final Revision';
  clubGroupId?: string;
  isCompleted: boolean;
  clockPlannedMinutes: number;
  metricsPlannedMinutes: number;
  flowPlannedMinutes: number;
  dailyTargetPlannedMinutes: number;
  actualLoggedMinutes: number;
  earlySavedMinutes: number;
  originalPlannedMinutes: number;
  clockSlotCount: number;
  clockTimeRange: string;
  inSequenceFlow: boolean;
  flowPosition?: number;
  milestoneLinked: boolean;
  milestoneSynced: boolean;
  revisionReportLinked: boolean;
  revisionReportSynced: boolean;
  isParityIntact: boolean;
}

export interface PillarSyncStatus {
  id: 'clock' | 'metrics' | 'flow' | 'milestones' | 'daily_targets' | 'revision_report' | 'log_system';
  name: string;
  shortLabel: string;
  isSynced: boolean;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  statusDetail: string;
}

export interface SystemReconciliationReport {
  selectedDate: string;
  timestamp: string;
  isFullySynced: boolean;
  discrepanciesFixedCount: number;
  summary: {
    clockPlannedMinutes: number;
    metricsPlannedMinutes: number;
    flowPlannedMinutes: number;
    dailyTargetsPlannedMinutes: number;
    logsActualStudyMinutes: number;
    metricsAllocatedMinutes: number;
    flowAllocatedMinutes: number;
    revisionReportTodayMinutes: number;
    totalTargetsCount: number;
    completedTargetsCount: number;
    activeMilestonesCount: number;
    syncedMilestonesCount: number;
    totalEarlySavedMinutes: number;
  };
  pillars: PillarSyncStatus[];
  targets: ReconciledTargetAuditRow[];
}

let isEngineRunning = false;

function parseClockTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const clean = String(timeStr).trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const parts = clean.replace(/[A-Z\s]/g, '').split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  let h = parts[0];
  const m = parts[1];
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return Math.max(0, Math.min(1439, h * 60 + m));
}

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function formatMinsCompact(mins: number): string {
  const safe = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

/**
 * Computes deduplicated study logs for `selectedDate` from `practca_pomo_logs` and `practca_focus_sessions`,
 * plus any active running study session if `selectedDate` is today.
 */
export function getReconciledStudyLogsForDate(
  selectedDate: string,
  level: CALevel = getSelectedCALevel()
): {
  totalStudyMinutes: number;
  logs: Array<{
    id: string;
    subjectId?: SubjectId;
    chapterName?: string;
    notes: string;
    taskId?: string;
    durationMinutes: number;
    startMinutes: number | null;
    endMinutes: number | null;
  }>;
} {
  const unifiedLogs: Array<{
    id: string;
    subjectId?: SubjectId;
    chapterName?: string;
    notes: string;
    taskId?: string;
    durationMinutes: number;
    startMinutes: number | null;
    endMinutes: number | null;
  }> = [];
  const seenIds = new Set<string>();
  const seenSignatures = new Set<string>();

  try {
    const rawPomo = localStorage.getItem(getLevelScopedKey('practca_pomo_logs', level));
    if (rawPomo) {
      const pomoList = JSON.parse(rawPomo);
      if (Array.isArray(pomoList)) {
        pomoList.forEach((l: any) => {
          if (!l || l.mode !== 'study') return;
          const lDate = l.date || (l.timestamp ? String(l.timestamp).slice(0, 10) : '');
          if (lDate !== selectedDate) return;
          const durSecs = Number(l.durationSeconds) || (Number(l.durationMinutes) || 0) * 60;
          if (durSecs <= 0) return;
          const durMins = Math.max(1, Math.round(durSecs / 60));
          const id = String(l.id || '');
          const sig = `${l.subjectId || ''}|${(l.chapterName || '').toLowerCase()}|${(l.notes || '').toLowerCase()}|${l.startTime || ''}|${durMins}`;
          if ((id && seenIds.has(id)) || seenSignatures.has(sig)) return;
          if (id) seenIds.add(id);
          seenSignatures.add(sig);

          const startM = parseClockTimeToMinutes(l.startTime);
          const endM = parseClockTimeToMinutes(l.endTime) ?? (startM !== null ? Math.min(1440, startM + durMins) : null);

          unifiedLogs.push({
            id: id || `pomo_${unifiedLogs.length}`,
            subjectId: l.subjectId as SubjectId | undefined,
            chapterName: l.chapterName,
            notes: String(l.notes || ''),
            taskId: l.taskId,
            durationMinutes: durMins,
            startMinutes: startM,
            endMinutes: endM
          });
        });
      }
    }
  } catch (e) {}

  try {
    const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', level));
    if (rawFocus) {
      const focusList = JSON.parse(rawFocus);
      if (Array.isArray(focusList)) {
        focusList.forEach((fs: any) => {
          if (!fs || (fs.sessionType && fs.sessionType !== 'work')) return;
          const fsDate = fs.timestamp ? String(fs.timestamp).slice(0, 10) : '';
          if (fsDate !== selectedDate) return;
          const durMins = Math.max(0, Math.round(Number(fs.duration) || 0));
          if (durMins <= 0) return;
          const id = String(fs.id || '');
          const baseId = id.replace(/(?:_split_|-split-)\d+$/, '');
          const desc = String(fs.description || '').toLowerCase();
          if (id && (seenIds.has(id) || seenIds.has(baseId))) return;
          const alreadyMatched = unifiedLogs.some(
            ul =>
              (ul.id && (ul.id === id || ul.id.replace(/(?:_split_|-split-)\d+$/, '') === baseId)) ||
              (desc && ul.notes.toLowerCase() === desc && Math.abs(ul.durationMinutes - durMins) <= 2)
          );
          if (alreadyMatched) return;
          if (id) seenIds.add(id);

          let endM: number | null = null;
          let startM: number | null = null;
          if (fs.timestamp) {
            const dt = new Date(fs.timestamp);
            if (!isNaN(dt.getTime())) {
              endM = dt.getHours() * 60 + dt.getMinutes();
              startM = Math.max(0, endM - durMins);
            }
          }

          unifiedLogs.push({
            id: id || `focus_${unifiedLogs.length}`,
            subjectId: fs.subjectId as SubjectId | undefined,
            chapterName: fs.chapterName,
            notes: String(fs.description || ''),
            taskId: fs.taskId,
            durationMinutes: durMins,
            startMinutes: startM,
            endMinutes: endM
          });
        });
      }
    }
  } catch (e) {}

  const totalStudyMinutes = unifiedLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  return { totalStudyMinutes, logs: unifiedLogs };
}

/**
 * Computes allocated study minutes and log time window for a specific target from the reconciled study log ledger.
 */
function computeTargetAllocatedFromLogs(
  target: {
    id?: string;
    title?: string;
    cleanTitle?: string;
    chapterName?: string;
    subjectCode?: string;
  },
  studyLogs: Array<{
    id: string;
    subjectId?: SubjectId;
    chapterName?: string;
    notes: string;
    taskId?: string;
    durationMinutes: number;
    startMinutes: number | null;
    endMinutes: number | null;
  }>
): {
  allocatedMinutes: number;
  earliestStartMinutes: number | null;
  latestEndMinutes: number | null;
} {
  const clean = (target.cleanTitle || target.title || '').trim().toLowerCase();
  const bareTitle = clean.replace(/^[🔴🟡🔵\s]*(\[[^\]]+\]\s*)*/g, '').trim().toLowerCase();
  const chap = (target.chapterName || '').trim().toLowerCase();
  const id = (target.id || '').trim();
  const sub = (target.subjectCode || '').trim().toUpperCase();

  let totalMins = 0;
  let earliestStart: number | null = null;
  let latestEnd: number | null = null;

  for (const log of studyLogs) {
    const logTaskId = (log.taskId || '').trim();
    const logChapter = (log.chapterName || '').trim().toLowerCase();
    const note = (log.notes || '').toLowerCase();
    const logSub = (log.subjectId || '').trim().toUpperCase();

    let matched = false;
    if (id && logTaskId && id === logTaskId) {
      matched = true;
    } else if (chap && logChapter && chap === logChapter && (!logSub || !sub || logSub === sub)) {
      matched = true;
    } else if (
      (clean && (note.includes(clean) || clean.includes(note))) ||
      (bareTitle && bareTitle.length > 2 && (note.includes(bareTitle) || bareTitle.includes(note))) ||
      (chap && chap.length > 2 && note.includes(chap)) ||
      (id && note.includes(id.toLowerCase()))
    ) {
      matched = true;
    }

    if (matched) {
      totalMins += log.durationMinutes;
      if (log.startMinutes !== null) {
        earliestStart = earliestStart === null ? log.startMinutes : Math.min(earliestStart, log.startMinutes);
      }
      if (log.endMinutes !== null) {
        latestEnd = latestEnd === null ? log.endMinutes : Math.max(latestEnd, log.endMinutes);
      }
    }
  }

  return {
    allocatedMinutes: totalMins,
    earliestStartMinutes: earliestStart,
    latestEndMinutes: latestEnd
  };
}

/**
 * Master Bi-Directional Reconciliation Engine across all 7 pillars:
 * 1. 24-Hour Target Clock (`practca_24h_target_clock_${selectedDate}`)
 * 2. Target Metrics (`practca_task_target_durations` & task `targetDurationMinutes`)
 * 3. Sequence Flow (`practca_target_flow`)
 * 4. Milestones (`practca_roadmap_user_checkpoints`)
 * 5. Daily Targets (`practca_local_tasks` & `practca_cached_cloud_tasks`)
 * 6. Revision Report (`practca_revision_planner_${subjectId}` & `practca_revision_planner_logs`)
 * 7. Session Log System (`practca_pomo_logs` & `practca_focus_sessions`)
 */
export function reconcileAllTargetSystems(
  selectedDate: string,
  options: ReconcileOptions = {}
): SystemReconciliationReport {
  const effectiveDate = selectedDate || getTodayDateString();
  const level = options.level || getSelectedCALevel();
  const defaultSub = getDefaultSubjectForLevel(level);
  const preferClockDuration = Boolean(options.preferClockDuration || options.source === 'clock');
  const shouldDispatch = options.dispatchEvents !== false;

  if (isEngineRunning) {
    return buildAuditReportOnly(effectiveDate, 0, level);
  }

  isEngineRunning = true;
  let discrepanciesFixedCount = 0;

  try {
    const todayStr = getTodayDateString();
    const isPastDate = effectiveDate < todayStr;
    const isToday = effectiveDate === todayStr;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const deletedKey = getLevelScopedKey(`practca_deleted_targets_${effectiveDate}`, level);
    const localTasksKey = getLevelScopedKey('practca_local_tasks', level);
    const cachedTasksKey = getLevelScopedKey('practca_cached_cloud_tasks', level);
    const durationsKey = getLevelScopedKey('practca_task_target_durations', level);
    const clockKey = getClockSlotsStorageKey(effectiveDate, level);
    const flowKey = getLevelScopedKey('practca_target_flow', level);

    // 1. Load Tombstones (`practca_deleted_targets_${effectiveDate}`)
    const deletedTargetsSet = new Set<string>();
    try {
      const rawDel = localStorage.getItem(deletedKey);
      if (rawDel) {
        const arr = JSON.parse(rawDel);
        if (Array.isArray(arr)) {
          arr.forEach((k: any) => {
            if (k) deletedTargetsSet.add(String(k).toLowerCase().trim());
          });
        }
      }
    } catch (e) {}

    // 2. Load Reconciled Study Logs for `effectiveDate`
    const { logs: studyLogs } = getReconciledStudyLogsForDate(effectiveDate, level);

    // 3. Load Daily Tasks, Durations Map, 24H Clock Slots, and Sequence Flow for active level
    let allLocalTasks: any[] = [];
    try {
      const rawTasks = localStorage.getItem(localTasksKey) || localStorage.getItem(cachedTasksKey);
      if (rawTasks) {
        const parsed = JSON.parse(rawTasks);
        if (Array.isArray(parsed)) allLocalTasks = parsed;
      }
    } catch (e) {}

    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(durationsKey);
      if (rawDur) {
        const parsed = JSON.parse(rawDur);
        if (parsed && typeof parsed === 'object') durationsMap = { ...parsed };
      }
    } catch (e) {}

    let clockSlots: any[] = [];
    try {
      const rawClock = localStorage.getItem(clockKey);
      if (rawClock) {
        const parsed = JSON.parse(rawClock);
        if (Array.isArray(parsed)) clockSlots = [...parsed];
      }
    } catch (e) {}

    let flowTargets: any[] = [];
    try {
      const rawFlow = localStorage.getItem(flowKey);
      if (rawFlow) {
        const parsed = JSON.parse(rawFlow);
        if (Array.isArray(parsed)) flowTargets = [...parsed];
      }
    } catch (e) {}

    let tasksChanged = false;
    let durationsChanged = false;
    let clockChanged = false;
    let flowChanged = false;

    // 4. Prune deleted tombstones and any previously auto-generated slots from 24H Clock Slots & Sequence Flow
    const filteredClockSlots = clockSlots.filter((s: any) => {
      if (!s) return false;
      const rawSlotId = String(s.id || '').trim();
      if (rawSlotId.startsWith('slot_reconciled_') || rawSlotId.startsWith('slot_autobatch_ms_')) {
        clockChanged = true;
        discrepanciesFixedCount++;
        return false;
      }
      const sClean = String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const sNorm = normalizeKey(sClean);
      const sId = String(s.targetId || '').trim().toLowerCase();
      if (
        (sId && deletedTargetsSet.has(sId)) ||
        (sNorm && deletedTargetsSet.has(sNorm)) ||
        (sClean && deletedTargetsSet.has(sClean.toLowerCase()))
      ) {
        clockChanged = true;
        discrepanciesFixedCount++;
        return false;
      }
      return true;
    });
    clockSlots = filteredClockSlots;

    // 5. Collect all active/completed tasks for `effectiveDate`
    const dateTaskIndices: number[] = [];
    const seenTaskNorms = new Set<string>();

    allLocalTasks.forEach((t: any, idx: number) => {
      if (!t || t.status === 'unachieved') return;
      const tDate = t.taskDate || (t.due ? String(t.due).split('T')[0] : '');
      if (tDate !== effectiveDate) return;

      const cleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const normTitle = normalizeKey(cleanTitle);
      const idKey = String(t.id || '').trim().toLowerCase();

      if (
        (idKey && deletedTargetsSet.has(idKey)) ||
        (normTitle && deletedTargetsSet.has(normTitle)) ||
        (cleanTitle && deletedTargetsSet.has(cleanTitle.toLowerCase()))
      ) {
        return;
      }

      const dedupeKey = normTitle || idKey;
      if (dedupeKey && !seenTaskNorms.has(dedupeKey)) {
        seenTaskNorms.add(dedupeKey);
        if (idKey) seenTaskNorms.add(idKey);
        dateTaskIndices.push(idx);
      }
    });

    // If a slot exists on the 24H Target Clock for `effectiveDate` (non-club batch) that is missing from `practca_local_tasks`,
    // promote it into `allLocalTasks` so Daily Targets, Target Metrics, and 24H Clock share the exact same target set!
    const groupedOrphanClockSlots = new Map<string, any[]>();
    clockSlots.forEach((s: any) => {
      const isClubBatchSlot =
        String(s.id || '').includes('_club_') ||
        Number(s.batchSize) > 1 ||
        /^batch\s*\d*\s*\(/i.test(String(s.title || '').trim());
      if (isClubBatchSlot) return;

      const sClean = String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const sNorm = normalizeKey(sClean);
      const sId = String(s.targetId || '').trim().toLowerCase();
      if (!sNorm) return;

      // Check if matches any existing task for this date
      const matchesExistingTask = dateTaskIndices.some(tIdx => {
        const t = allLocalTasks[tIdx];
        const tClean = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const tNorm = normalizeKey(tClean);
        const tId = String(t.id || '').trim().toLowerCase();
        const tChapNorm = normalizeKey(t.chapterName || '');
        const sChapNorm = normalizeKey(s.chapterName || '');
        return (
          (sId && tId && sId === tId) ||
          (sNorm && tNorm && sNorm === tNorm) ||
          (tChapNorm && sChapNorm && tChapNorm === sChapNorm && (!t.subjectCode || !s.subjectCode || t.subjectCode === s.subjectCode))
        );
      });

      if (!matchesExistingTask) {
        if (!groupedOrphanClockSlots.has(sNorm)) {
          groupedOrphanClockSlots.set(sNorm, []);
        }
        groupedOrphanClockSlots.get(sNorm)!.push(s);
      }
    });

    groupedOrphanClockSlots.forEach((slotsForOrphan, sNorm) => {
      const first = slotsForOrphan[0];
      const sClean = String(first.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim() || first.title;
      const sumDur = slotsForOrphan.reduce((acc, cur) => acc + (Number(cur.durationMinutes) || 0), 0);
      const allDone = slotsForOrphan.every(cur => cur.status === 'completed') ||
        isTaskCompletedInStorage(first.targetId, sClean, sClean, first.chapterName, first.subjectCode, effectiveDate, undefined, level);
      const slotIsMock = Boolean(first.isMockTest || isMockTestTask(first));
      const newTask = {
        id: first.targetId || `target_${sNorm}`,
        title: sClean,
        cleanTitle: sClean,
        subjectCode: (first.subjectCode || findSubjectForChapter(sClean, level) || defaultSub) as SubjectId,
        chapterName: slotIsMock ? undefined : (first.chapterName || sClean),
        relevance: slotIsMock ? 'General' : (first.relevance || 'Revision'),
        isMockTest: slotIsMock,
        mockScheduledTime: first.mockScheduledTime,
        mockSeries: first.mockSeries,
        status: allDone ? 'completed' : 'needsAction',
        completed: allDone,
        taskDate: effectiveDate,
        due: `${effectiveDate}T${first.mockScheduledTime || first.startTime || '09:00'}:00.000Z`,
        targetDurationMinutes: Math.max(1, sumDur),
        duration: Math.max(1, sumDur),
        originalTargetDurationMinutes: first.originalDurationMinutes,
        earlyCompletionSavedMinutes: first.earlySavedMinutes
      };
      allLocalTasks.push(newTask);
      dateTaskIndices.push(allLocalTasks.length - 1);
      seenTaskNorms.add(sNorm);
      tasksChanged = true;
      discrepanciesFixedCount++;
    });

    // 6. Reconcile Clubbed Groups (`clubGroupId`) and Individual Targets
    const clubGroupsMap = new Map<string, number[]>();
    const nonClubTaskIndices: number[] = [];

    dateTaskIndices.forEach(tIdx => {
      const t = allLocalTasks[tIdx];
      if (t.clubGroupId) {
        const cg = String(t.clubGroupId);
        if (!clubGroupsMap.has(cg)) clubGroupsMap.set(cg, []);
        clubGroupsMap.get(cg)!.push(tIdx);
      } else {
        nonClubTaskIndices.push(tIdx);
      }
    });

    // Helper to find matching non-club clock slots for a task
    const findMatchingSlotIndicesForTask = (t: any, slotsArr: any[]): number[] => {
      const cleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const normTitle = normalizeKey(cleanTitle);
      const idStr = String(t.id || '').trim();
      const tChapNorm = normalizeKey(t.chapterName || '');
      const indices: number[] = [];

      slotsArr.forEach((s: any, sIdx: number) => {
        if (!s) return;
        const isClubBatchSlot =
          String(s.id || '').includes('_club_') ||
          Number(s.batchSize) > 1 ||
          /^batch\s*\d*\s*\(/i.test(String(s.title || '').trim());
        if (isClubBatchSlot) return;

        const sClean = String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const sNorm = normalizeKey(sClean);
        const sRawNorm = normalizeKey(s.title || '');
        const sTargetId = String(s.targetId || '').trim();
        const sChapNorm = normalizeKey(s.chapterName || '');

        if (
          (idStr && sTargetId && idStr === sTargetId) ||
          (normTitle && ((sNorm && sNorm === normTitle) || (sRawNorm && sRawNorm === normTitle))) ||
          (cleanTitle && sTargetId && cleanTitle === sTargetId) ||
          (tChapNorm && sChapNorm && tChapNorm === sChapNorm && (!t.subjectCode || !s.subjectCode || t.subjectCode === s.subjectCode))
        ) {
          indices.push(sIdx);
        }
      });
      return indices;
    };

    // 6A. Process Clubbed Groups (`clubGroupId`)
    clubGroupsMap.forEach((peerTaskIndices, clubGroupId) => {
      // Find any `_club_` slot on `clockSlots` for this `clubGroupId`
      const clubSlotIndices: number[] = [];
      clockSlots.forEach((s: any, sIdx: number) => {
        if (!s) return;
        if (
          String(s.id || '').includes(clubGroupId) ||
          String(s.targetId || '').includes(clubGroupId) ||
          String(s.clubGroupId || '') === clubGroupId
        ) {
          clubSlotIndices.push(sIdx);
        }
      });

      const currentClubClockSum = clubSlotIndices.reduce(
        (acc, sIdx) => acc + (Number(clockSlots[sIdx]?.durationMinutes) || 0),
        0
      );

      // Compute each peer's status, allocatedMinutes, and reconciled targetDuration
      let peerSumDuration = 0;
      let allPeersDone = true;

      peerTaskIndices.forEach(tIdx => {
        const t = allLocalTasks[tIdx];
        const cleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const normTitle = normalizeKey(cleanTitle);
        const idStr = String(t.id || '').trim();
        const isDone = Boolean(
          t.status === 'completed' ||
          t.completed ||
          isTaskCompletedInStorage(idStr, t.title, cleanTitle, t.chapterName, t.subjectCode, effectiveDate, undefined, level)
        );
        if (!isDone) allPeersDone = false;

        const { allocatedMinutes } = computeTargetAllocatedFromLogs(t, studyLogs);
        const rawBase = Number(
          t.originalTargetDurationMinutes ||
          t.targetDurationMinutes ||
          (idStr ? durationsMap[idStr] : undefined) ||
          (cleanTitle ? durationsMap[cleanTitle] : undefined) ||
          (normTitle ? durationsMap[normTitle] : undefined) ||
          t.duration ||
          Math.round((Number(t.clubTotalMinutes) || 180) / Math.max(1, peerTaskIndices.length))
        );
        const baseDur = Math.max(1, rawBase);
        const isMetWithin = isDone && allocatedMinutes >= 0 && allocatedMinutes <= baseDur;
        const reconciledDur = isMetWithin ? allocatedMinutes : baseDur;
        const earlySaved = isMetWithin ? Math.max(0, baseDur - allocatedMinutes) : 0;

        peerSumDuration += reconciledDur;

        if (
          t.targetDurationMinutes !== reconciledDur ||
          t.allocatedMinutes !== allocatedMinutes ||
          Boolean(t.completed) !== isDone ||
          (isDone && t.status !== 'completed')
        ) {
          allLocalTasks[tIdx] = {
            ...t,
            status: isDone ? 'completed' : (t.status === 'completed' ? 'needsAction' : (t.status || 'needsAction')),
            completed: isDone,
            targetDurationMinutes: reconciledDur,
            duration: reconciledDur,
            allocatedMinutes,
            originalTargetDurationMinutes: isDone ? baseDur : undefined,
            earlyCompletionSavedMinutes: isDone ? earlySaved : undefined
          };
          tasksChanged = true;
          discrepanciesFixedCount++;
        }

        if (idStr && durationsMap[idStr] !== reconciledDur) {
          durationsMap[idStr] = reconciledDur;
          durationsChanged = true;
        }
        if (cleanTitle && durationsMap[cleanTitle] !== reconciledDur) {
          durationsMap[cleanTitle] = reconciledDur;
          durationsChanged = true;
        }
        if (normTitle && durationsMap[normTitle] !== reconciledDur) {
          durationsMap[normTitle] = reconciledDur;
          durationsChanged = true;
        }
      });

      // Sync `_club_` slot on 24H Clock with `peerSumDuration`
      if (clubSlotIndices.length > 0) {
        if (peerSumDuration === 0) {
          // Remove zero-duration completed batch slots in reverse index order
          [...clubSlotIndices].sort((a, b) => b - a).forEach(sIdx => {
            clockSlots.splice(sIdx, 1);
          });
          clockChanged = true;
          discrepanciesFixedCount++;
        } else if (currentClubClockSum !== peerSumDuration && !isPastDate) {
          let rem = peerSumDuration;
          clubSlotIndices.forEach((sIdx, pos) => {
            const slot = clockSlots[sIdx];
            const isLast = pos === clubSlotIndices.length - 1;
            const oldDur = Number(slot.durationMinutes) || 60;
            const newDur = isLast
              ? Math.max(1, rem)
              : Math.max(1, Math.round((oldDur / Math.max(1, currentClubClockSum)) * peerSumDuration));
            rem = Math.max(1, rem - newDur);
            const startM = Number(slot.startMinutes) || 540;
            const endM = Math.min(1440, startM + newDur);
            const effectiveDur = Math.max(1, endM - startM);
            clockSlots[sIdx] = {
              ...slot,
              durationMinutes: effectiveDur,
              totalTargetMinutes: peerSumDuration,
              endMinutes: endM,
              endTime: minutesToClockTime(endM % 1440),
              status: allPeersDone ? 'completed' : (slot.status === 'active' ? 'active' : 'pending')
            };
          });
          clockChanged = true;
          discrepanciesFixedCount++;
        } else {
          clubSlotIndices.forEach(sIdx => {
            const slot = clockSlots[sIdx];
            const expectedStatus = allPeersDone ? 'completed' : (slot.status === 'active' ? 'active' : 'pending');
            if (slot.status !== expectedStatus) {
              clockSlots[sIdx] = { ...slot, status: expectedStatus };
              clockChanged = true;
              discrepanciesFixedCount++;
            }
          });
        }
      }
      // Do NOT auto-slot unslotted clubbed groups onto the 24-Hour Plan Clock; slotting is strictly user-initiated.
    });

    // 6B. Process Individual (Non-Clubbed) Targets for 1:1 Parity
    nonClubTaskIndices.forEach(tIdx => {
      const t = allLocalTasks[tIdx];
      const cleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const normTitle = normalizeKey(cleanTitle);
      const idStr = String(t.id || '').trim();

      const matchingSlotIndices = findMatchingSlotIndicesForTask(t, clockSlots);
      const clockSlotSum = matchingSlotIndices.reduce(
        (acc, sIdx) => acc + (Number(clockSlots[sIdx]?.durationMinutes) || 0),
        0
      );
      const slotOriginalSum = matchingSlotIndices.reduce(
        (acc, sIdx) => acc + (Number(clockSlots[sIdx]?.originalDurationMinutes) || 0),
        0
      );
      const allSlotsMarkedDone =
        matchingSlotIndices.length > 0 &&
        matchingSlotIndices.every(sIdx => clockSlots[sIdx]?.status === 'completed');

      const isDone = Boolean(
        t.status === 'completed' ||
        t.completed ||
        allSlotsMarkedDone ||
        isTaskCompletedInStorage(idStr, t.title, cleanTitle, t.chapterName, t.subjectCode, effectiveDate, undefined, level)
      );

      const { allocatedMinutes, earliestStartMinutes } = computeTargetAllocatedFromLogs(t, studyLogs);

      // Resolve authoritative baseScheduledDuration
      let baseScheduledDuration: number;
      if (preferClockDuration && matchingSlotIndices.length > 0 && clockSlotSum > 0 && !isDone) {
        baseScheduledDuration = clockSlotSum;
      } else {
        const candidateBase =
          (isDone && (Number(t.originalTargetDurationMinutes) > 0 || slotOriginalSum > 0)
            ? (Number(t.originalTargetDurationMinutes) || slotOriginalSum)
            : undefined) ??
          t.targetDurationMinutes ??
          (idStr ? durationsMap[idStr] : undefined) ??
          (cleanTitle ? durationsMap[cleanTitle] : undefined) ??
          (normTitle ? durationsMap[normTitle] : undefined) ??
          (matchingSlotIndices.length > 0 && clockSlotSum > 0 ? clockSlotSum : undefined) ??
          t.duration ??
          60;
        baseScheduledDuration = Math.max(1, Math.round(Number(candidateBase) || 60));
      }

      // Apply Core Target Completion Rule:
      // - If completed & 0 <= allocatedMinutes <= baseScheduledDuration -> planned = allocatedMinutes
      // - If completed & allocatedMinutes > baseScheduledDuration -> planned = baseScheduledDuration
      // - If incomplete -> planned = baseScheduledDuration
      const isMetWithinTarget = isDone && allocatedMinutes >= 0 && allocatedMinutes <= baseScheduledDuration;
      let finalTargetDuration = isMetWithinTarget ? allocatedMinutes : baseScheduledDuration;
      const earlySavedMinutes = isMetWithinTarget ? Math.max(0, baseScheduledDuration - allocatedMinutes) : 0;

      // Now synchronize 24H Target Clock slots with `finalTargetDuration`!
      if (finalTargetDuration === 0) {
        // Completed with 0m logged: remove any slots on the 24H Clock so Clock Planned === 0m === Target Metrics Planned
        if (matchingSlotIndices.length > 0 && !isPastDate) {
          [...matchingSlotIndices].sort((a, b) => b - a).forEach(sIdx => {
            clockSlots.splice(sIdx, 1);
          });
          clockChanged = true;
          discrepanciesFixedCount++;
        }
      } else {
        // finalTargetDuration > 0
        if (matchingSlotIndices.length > 0) {
          if (clockSlotSum !== finalTargetDuration && !isPastDate) {
            let remainingToAssign = finalTargetDuration;
            let actualAssignedSum = 0;

            matchingSlotIndices.forEach((sIdx, pos) => {
              const slot = clockSlots[sIdx];
              const isLast = pos === matchingSlotIndices.length - 1;
              const oldDur = Number(slot.durationMinutes) || 60;
              const desiredDur = isLast
                ? Math.max(1, remainingToAssign)
                : Math.max(1, Math.round((oldDur / Math.max(1, clockSlotSum)) * finalTargetDuration));
              remainingToAssign = Math.max(1, remainingToAssign - desiredDur);

              let startM = Number(slot.startMinutes) || 540;
              // If completed early and slot was in the future, anchor at actual study start or before nowMinutes
              if (isDone && isToday && startM > nowMinutes) {
                startM = earliestStartMinutes !== null
                  ? earliestStartMinutes
                  : Math.max(0, nowMinutes - desiredDur);
              }
              // Ensure startM + desiredDur fits before 1440 if possible
              if (startM + desiredDur > 1440 && !isDone) {
                startM = Math.max(isToday ? Math.min(nowMinutes, startM) : 0, 1440 - desiredDur);
              }
              const endM = Math.min(1440, startM + desiredDur);
              const effectiveDur = Math.max(1, endM - startM);
              actualAssignedSum += effectiveDur;

              clockSlots[sIdx] = {
                ...slot,
                startMinutes: startM,
                endMinutes: endM,
                startTime: minutesToClockTime(startM),
                endTime: minutesToClockTime(endM % 1440),
                durationMinutes: effectiveDur,
                totalTargetMinutes: finalTargetDuration,
                status: isDone ? 'completed' : (slot.status === 'active' ? 'active' : 'pending'),
                ...(isDone && earlySavedMinutes > 0
                  ? {
                      originalDurationMinutes: baseScheduledDuration,
                      earlySavedMinutes
                    }
                  : {})
              };
            });

            // If midnight clamping restricted the total assigned clock duration, align `finalTargetDuration` to `actualAssignedSum`
            if (actualAssignedSum > 0 && actualAssignedSum !== finalTargetDuration) {
              finalTargetDuration = actualAssignedSum;
            }
            clockChanged = true;
            discrepanciesFixedCount++;
          } else {
            // Ensure slot completion status matches
            matchingSlotIndices.forEach(sIdx => {
              const slot = clockSlots[sIdx];
              const expectedStatus = isDone ? 'completed' : (slot.status === 'active' ? 'active' : 'pending');
              if (slot.status !== expectedStatus) {
                clockSlots[sIdx] = { ...slot, status: expectedStatus };
                clockChanged = true;
                discrepanciesFixedCount++;
              }
            });
          }
        }
        // Do NOT auto-slot unslotted targets onto the 24-Hour Plan Clock; slotting is strictly user-initiated.
      }

      // Write back to `allLocalTasks[tIdx]` and `durationsMap`
      if (
        t.targetDurationMinutes !== finalTargetDuration ||
        t.duration !== finalTargetDuration ||
        t.allocatedMinutes !== allocatedMinutes ||
        Boolean(t.completed) !== isDone ||
        (isDone && t.status !== 'completed') ||
        (!isDone && t.status === 'completed')
      ) {
        allLocalTasks[tIdx] = {
          ...t,
          status: isDone ? 'completed' : 'needsAction',
          completed: isDone,
          targetDurationMinutes: finalTargetDuration,
          duration: finalTargetDuration,
          allocatedMinutes,
          originalTargetDurationMinutes: isDone ? baseScheduledDuration : undefined,
          earlyCompletionSavedMinutes: isDone ? earlySavedMinutes : undefined
        };
        tasksChanged = true;
        discrepanciesFixedCount++;
      }

      if (idStr && durationsMap[idStr] !== finalTargetDuration) {
        durationsMap[idStr] = finalTargetDuration;
        durationsChanged = true;
      }
      if (cleanTitle && durationsMap[cleanTitle] !== finalTargetDuration) {
        durationsMap[cleanTitle] = finalTargetDuration;
        durationsChanged = true;
      }
      if (normTitle && durationsMap[normTitle] !== finalTargetDuration) {
        durationsMap[normTitle] = finalTargetDuration;
        durationsChanged = true;
      }
    });

    // Sort clock slots chronologically
    clockSlots.sort((a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0));

    // 7. Reconcile Sequence Flow (`practca_target_flow`)
    // Preserve user order from existing `flowTargets` while ensuring every target for `effectiveDate` has accurate
    // `duration`, `targetDurationMinutes`, `allocatedMinutes`, and `status`.
    const existingFlowOrder = new Map<string, number>();
    const existingFlowStatus = new Map<string, string>();
    flowTargets.forEach((ft: any, idx: number) => {
      if (!ft) return;
      const ftClean = String(ft.cleanTitle || ft.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const ftNorm = normalizeKey(ftClean);
      const ftTaskId = String(ft.taskId || ft.id || '').trim();
      if (ftNorm && !existingFlowOrder.has(ftNorm)) {
        existingFlowOrder.set(ftNorm, idx);
        if (ft.status) existingFlowStatus.set(ftNorm, ft.status);
      }
      if (ftTaskId && !existingFlowOrder.has(ftTaskId)) {
        existingFlowOrder.set(ftTaskId, idx);
        if (ft.status) existingFlowStatus.set(ftTaskId, ft.status);
      }
    });

    // Keep flow items from other dates untouched, and rebuild `effectiveDate`'s flow items from reconciled tasks
    const otherDateFlowItems = flowTargets.filter((ft: any) => {
      if (!ft || !ft.dueDate) return false;
      const ftDate = String(ft.dueDate).split('T')[0];
      return ftDate && ftDate !== effectiveDate;
    });

    const reconciledDateFlowItems: any[] = [];
    dateTaskIndices.forEach(tIdx => {
      const t = allLocalTasks[tIdx];
      const cleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const normTitle = normalizeKey(cleanTitle);
      const idStr = String(t.id || '').trim();
      const isDone = Boolean(t.status === 'completed' || t.completed);
      const plannedDur = Number(t.targetDurationMinutes ?? t.duration ?? 60);

      // Zero-duration completed targets don't occupy planned flow time
      if (isDone && plannedDur === 0) return;

      const matchingSlots = findMatchingSlotIndicesForTask(t, clockSlots).map(i => clockSlots[i]);
      const earliestSlotStart = matchingSlots.length > 0
        ? Math.min(...matchingSlots.map(s => Number(s.startMinutes) || 540))
        : 540;
      const startTimeStr = minutesToClockTime(earliestSlotStart);
      const prevStatus = existingFlowStatus.get(normTitle) || existingFlowStatus.get(idStr);
      const anySlotActive = matchingSlots.some(s => s.status === 'active');

      reconciledDateFlowItems.push({
        id: `flow_${normTitle || idStr}`,
        taskId: idStr || cleanTitle,
        title: cleanTitle,
        cleanTitle,
        chapterName: t.chapterName,
        subjectCode: (t.subjectCode || defaultSub) as SubjectId,
        duration: plannedDur,
        targetDurationMinutes: plannedDur,
        allocatedMinutes: Number(t.allocatedMinutes) || 0,
        relevance: t.relevance || 'Revision',
        dueDate: `${effectiveDate}T${startTimeStr}:00.000Z`,
        status: isDone ? 'completed' : (anySlotActive || prevStatus === 'active' ? 'active' : 'pending'),
        _orderIdx: existingFlowOrder.get(normTitle) ?? existingFlowOrder.get(idStr) ?? (1000 + earliestSlotStart)
      });
    });

    reconciledDateFlowItems.sort((a, b) => a._orderIdx - b._orderIdx);
    const cleanedDateFlowItems = reconciledDateFlowItems.map(({ _orderIdx, ...rest }) => rest);
    const nextFlowTargets = [...otherDateFlowItems, ...cleanedDateFlowItems];

    if (JSON.stringify(flowTargets) !== JSON.stringify(nextFlowTargets)) {
      flowTargets = nextFlowTargets;
      flowChanged = true;
      discrepanciesFixedCount++;
    }

    // 8. Reconcile Milestones (`practca_roadmap_user_checkpoints`) with completed tasks on `effectiveDate`
    const cpUserKey = getLevelScopedKey('practca_roadmap_user_checkpoints', level);
    const cpV3Key = getLevelScopedKey('practca_roadmap_checkpoints_v3', level);
    try {
      const rawCp = localStorage.getItem(cpUserKey);
      if (rawCp) {
        const checkpoints = JSON.parse(rawCp);
        if (Array.isArray(checkpoints)) {
          let cpChanged = false;
          const updatedCp = checkpoints.map((cp: any) => {
            if (!cp || cp.subjectId === 'CUSTOM') return cp;
            const subId = cp.subjectId as SubjectId;
            const cpChapters: string[] = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
              ? cp.selectedChapters
              : (SUBJECT_CHAPTERS[subId] || []);
            const completedSet = new Set<string>(Array.isArray(cp.completedChapters) ? cp.completedChapters : []);

            dateTaskIndices.forEach(tIdx => {
              const t = allLocalTasks[tIdx];
              if (!t || t.subjectCode !== subId || isMockTestTask(t)) return;
              const isDone = Boolean(t.status === 'completed' || t.completed);
              if (!isDone) return;
              const matchedChap = resolveExactOrBestChapterMatch(
                cpChapters,
                [t.chapterName, t.cleanTitle, t.title].filter(Boolean),
                subId
              );
              if (matchedChap && !completedSet.has(matchedChap)) {
                completedSet.add(matchedChap);
                cpChanged = true;
                discrepanciesFixedCount++;
              }
            });

            if (!cpChanged) return cp;
            return {
              ...cp,
              completedChapters: Array.from(completedSet)
            };
          });

          if (cpChanged) {
            localStorage.setItem(cpUserKey, JSON.stringify(updatedCp));
            localStorage.setItem(cpV3Key, JSON.stringify(updatedCp));
            if (shouldDispatch) {
              window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
            }
          }
        }
      }
    } catch (e) {}

    // 9. Persist updated stores to localStorage
    if (tasksChanged) {
      try {
        localStorage.setItem(localTasksKey, JSON.stringify(allLocalTasks));
        localStorage.setItem(cachedTasksKey, JSON.stringify(allLocalTasks));
      } catch (e) {}
    }

    if (durationsChanged) {
      try {
        localStorage.setItem(durationsKey, JSON.stringify(durationsMap));
      } catch (e) {}
    }

    if (clockChanged) {
      try {
        localStorage.setItem(clockKey, JSON.stringify(clockSlots));
      } catch (e) {}
    }

    if (flowChanged) {
      try {
        localStorage.setItem(flowKey, JSON.stringify(flowTargets));
      } catch (e) {}
    }

    // Dispatch notifications if any store was reconciled
    if (shouldDispatch && (tasksChanged || durationsChanged || clockChanged || flowChanged)) {
      if (clockChanged) {
        window.dispatchEvent(new Event('practca_target_clock_updated'));
      }
      if (durationsChanged) {
        window.dispatchEvent(
          new CustomEvent('practca_target_clock_durations_updated', {
            detail: { date: effectiveDate, taskDurations: durationsMap }
          })
        );
      }
      if (flowChanged) {
        window.dispatchEvent(new Event('practca_flow_updated'));
      }
      if (tasksChanged) {
        window.dispatchEvent(new CustomEvent('practca_tasks_updated', { detail: { reconciled: true, date: effectiveDate } }));
      }
    }

    return buildAuditReportOnly(effectiveDate, discrepanciesFixedCount, level);
  } finally {
    isEngineRunning = false;
  }
}

/**
 * Generates a read-only audit snapshot across all 7 pillars for `selectedDate`.
 */
export function getSystemReconciliationReport(
  selectedDate: string,
  level: CALevel = getSelectedCALevel()
): SystemReconciliationReport {
  return buildAuditReportOnly(selectedDate || getTodayDateString(), 0, level);
}

function buildAuditReportOnly(
  selectedDate: string,
  discrepanciesFixedCount: number,
  level: CALevel = getSelectedCALevel()
): SystemReconciliationReport {
  const effectiveDate = selectedDate || getTodayDateString();
  const defaultSub = getDefaultSubjectForLevel(level);

  // 1. Tombstones
  const deletedTargetsSet = new Set<string>();
  try {
    const rawDel = localStorage.getItem(getLevelScopedKey(`practca_deleted_targets_${effectiveDate}`, level));
    if (rawDel) {
      const arr = JSON.parse(rawDel);
      if (Array.isArray(arr)) {
        arr.forEach((k: any) => {
          if (k) deletedTargetsSet.add(String(k).toLowerCase().trim());
        });
      }
    }
  } catch (e) {}

  // 2. Study Logs
  const { totalStudyMinutes: logsActualStudyMinutes, logs: studyLogs } = getReconciledStudyLogsForDate(effectiveDate, level);

  // 3. Tasks, Durations, Clock Slots, Flow, Checkpoints, Revision Report
  let dateTasks: any[] = [];
  try {
    const rawTasks =
      localStorage.getItem(getLevelScopedKey('practca_local_tasks', level)) ||
      localStorage.getItem(getLevelScopedKey('practca_cached_cloud_tasks', level));
    if (rawTasks) {
      const parsed = JSON.parse(rawTasks);
      if (Array.isArray(parsed)) {
        const seen = new Set<string>();
        parsed.forEach((t: any) => {
          if (!t || t.status === 'unachieved') return;
          const tDate = t.taskDate || (t.due ? String(t.due).split('T')[0] : '');
          if (tDate !== effectiveDate) return;
          const clean = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
          const norm = normalizeKey(clean);
          const id = String(t.id || '').trim().toLowerCase();
          if (
            (id && deletedTargetsSet.has(id)) ||
            (norm && deletedTargetsSet.has(norm)) ||
            (clean && deletedTargetsSet.has(clean.toLowerCase()))
          ) {
            return;
          }
          const k = norm || id;
          if (k && !seen.has(k)) {
            seen.add(k);
            if (id) seen.add(id);
            dateTasks.push(t);
          }
        });
      }
    }
  } catch (e) {}

  let durationsMap: Record<string, number> = {};
  try {
    const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations', level));
    if (rawDur) durationsMap = JSON.parse(rawDur) || {};
  } catch (e) {}

  let clockSlots: any[] = [];
  try {
    const rawClock = localStorage.getItem(getClockSlotsStorageKey(effectiveDate, level));
    if (rawClock) {
      const parsed = JSON.parse(rawClock);
      if (Array.isArray(parsed)) {
        clockSlots = parsed.filter((s: any) => {
          const sid = String(s?.id || '').trim();
          return !sid.startsWith('slot_reconciled_') && !sid.startsWith('slot_autobatch_ms_');
        });
      }
    }
  } catch (e) {}

  let flowTargets: any[] = [];
  try {
    const rawFlow = localStorage.getItem(getLevelScopedKey('practca_target_flow', level));
    if (rawFlow) {
      const parsed = JSON.parse(rawFlow);
      if (Array.isArray(parsed)) {
        flowTargets = parsed.filter((ft: any) => {
          if (!ft) return false;
          if (!ft.dueDate) return true;
          return String(ft.dueDate).split('T')[0] === effectiveDate;
        });
      }
    }
  } catch (e) {}

  let checkpoints: any[] = [];
  try {
    const rawCp = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints', level));
    if (rawCp) {
      const parsed = JSON.parse(rawCp);
      if (Array.isArray(parsed)) checkpoints = parsed;
    }
  } catch (e) {}

  let revLogsTodayMinutes = 0;
  try {
    const rawRevLogs = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs', level));
    if (rawRevLogs) {
      const parsed = JSON.parse(rawRevLogs);
      if (Array.isArray(parsed)) {
        parsed.forEach((rl: any) => {
          if (!rl) return;
          const rDate = rl.timestamp ? String(rl.timestamp).slice(0, 10) : '';
          if (rDate === effectiveDate) {
            revLogsTodayMinutes += Number(rl.durationMinutes) || 0;
          }
        });
      }
    }
  } catch (e) {}

  // Build per-target audit rows
  const auditRows: ReconciledTargetAuditRow[] = dateTasks.map((t: any) => {
    const cleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
    const normKey = normalizeKey(cleanTitle);
    const idStr = String(t.id || '').trim();
    const subCode = (t.subjectCode || defaultSub) as SubjectId;
    const tChapNorm = normalizeKey(t.chapterName || '');
    const isCompleted = Boolean(
      t.status === 'completed' ||
      t.completed ||
      isTaskCompletedInStorage(idStr, t.title, cleanTitle, t.chapterName, subCode, effectiveDate, undefined, level)
    );

    const { allocatedMinutes } = computeTargetAllocatedFromLogs(t, studyLogs);

    // Matching clock slots
    const matchingSlots = clockSlots.filter((s: any) => {
      if (!s) return false;
      const isClubBatchSlot =
        String(s.id || '').includes('_club_') ||
        Number(s.batchSize) > 1 ||
        /^batch\s*\d*\s*\(/i.test(String(s.title || '').trim());
      if (isClubBatchSlot) {
        return Boolean(t.clubGroupId && (String(s.id || '').includes(t.clubGroupId) || String(s.clubGroupId || '') === t.clubGroupId));
      }
      const sClean = String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const sNorm = normalizeKey(sClean);
      const sTargetId = String(s.targetId || '').trim();
      const sChapNorm = normalizeKey(s.chapterName || '');
      return (
        (idStr && sTargetId && idStr === sTargetId) ||
        (normKey && sNorm && normKey === sNorm) ||
        (tChapNorm && sChapNorm && tChapNorm === sChapNorm && (!s.subjectCode || s.subjectCode === subCode))
      );
    });

    const rawTaskDur = Number(
      t.targetDurationMinutes ??
      (idStr ? durationsMap[idStr] : undefined) ??
      (cleanTitle ? durationsMap[cleanTitle] : undefined) ??
      (normKey ? durationsMap[normKey] : undefined) ??
      t.duration ??
      60
    );
    const originalPlannedMinutes = Number(t.originalTargetDurationMinutes || rawTaskDur || 60);
    const isMetWithin = isCompleted && allocatedMinutes >= 0 && allocatedMinutes <= originalPlannedMinutes;
    const metricsPlannedMinutes = isMetWithin ? allocatedMinutes : rawTaskDur;
    const earlySavedMinutes = isMetWithin ? Math.max(0, originalPlannedMinutes - allocatedMinutes) : Number(t.earlyCompletionSavedMinutes || 0);

    // If part of a club batch slot, its share of the clock slot is its `metricsPlannedMinutes` when batch sum matches
    let clockPlannedMinutes = matchingSlots.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    if (t.clubGroupId && matchingSlots.some(s => String(s.id || '').includes('_club_') || Number(s.batchSize) > 1)) {
      const peers = dateTasks.filter(p => p.clubGroupId === t.clubGroupId);
      const peerSum = peers.reduce((acc, p) => acc + (Number(p.targetDurationMinutes) || 0), 0);
      if (peerSum === clockPlannedMinutes) {
        clockPlannedMinutes = metricsPlannedMinutes;
      }
    }

    const clockTimeRange = matchingSlots.length > 0
      ? matchingSlots.map(s => `${s.startTime || minutesToClockTime(s.startMinutes || 0)}–${s.endTime || minutesToClockTime((s.endMinutes || 0) % 1440)}`).join(', ')
      : isCompleted && metricsPlannedMinutes === 0
      ? 'Completed (0m)'
      : 'Unslotted';

    // Flow match
    const flowIdx = flowTargets.findIndex((ft: any) => {
      const ftClean = String(ft.cleanTitle || ft.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      return (
        (idStr && (ft.taskId === idStr || ft.id === idStr)) ||
        (normKey && normalizeKey(ftClean) === normKey)
      );
    });
    const flowItem = flowIdx !== -1 ? flowTargets[flowIdx] : null;
    const flowPlannedMinutes = flowItem ? Number(flowItem.targetDurationMinutes ?? flowItem.duration ?? metricsPlannedMinutes) : (isCompleted && metricsPlannedMinutes === 0 ? 0 : metricsPlannedMinutes);

    // Milestone link check
    const matchingMilestones = checkpoints.filter(cp => cp && cp.subjectId === subCode);
    const milestoneLinked = matchingMilestones.length > 0 && !isMockTestTask(t);
    const milestoneSynced = !milestoneLinked || !isCompleted || matchingMilestones.some(cp => {
      const doneChaps: string[] = Array.isArray(cp.completedChapters) ? cp.completedChapters : [];
      return Boolean(resolveExactOrBestChapterMatch(doneChaps, [t.chapterName, cleanTitle].filter(Boolean), subCode));
    });

    // Revision Report link check
    const revisionReportLinked = !isMockTestTask(t) && Boolean(t.chapterName || cleanTitle);
    let revisionReportSynced = true;
    if (revisionReportLinked && isCompleted) {
      try {
        const rawSubRev = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subCode}`, level));
        if (rawSubRev) {
          const parsedRev = JSON.parse(rawSubRev);
          const chaptersObj = parsedRev?.chapters || {};
          const canonChap = getCanonicalChapterKey(subCode, t.chapterName || cleanTitle);
          const chapData = chaptersObj[canonChap];
          if (chapData) {
            revisionReportSynced = Object.values(chapData).some((st: any) => st && (st.completed || parseFloat(st.hours || '0') > 0));
          }
        }
      } catch (e) {}
    }

    const isParityIntact =
      clockPlannedMinutes === metricsPlannedMinutes &&
      flowPlannedMinutes === metricsPlannedMinutes &&
      milestoneSynced;

    return {
      id: idStr || `target_${normKey}`,
      normKey,
      title: t.title || cleanTitle,
      cleanTitle,
      subjectCode: subCode,
      chapterName: t.chapterName,
      relevance: (t.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision',
      clubGroupId: t.clubGroupId,
      isCompleted,
      clockPlannedMinutes,
      metricsPlannedMinutes,
      flowPlannedMinutes,
      dailyTargetPlannedMinutes: metricsPlannedMinutes,
      actualLoggedMinutes: allocatedMinutes,
      earlySavedMinutes,
      originalPlannedMinutes,
      clockSlotCount: matchingSlots.length,
      clockTimeRange,
      inSequenceFlow: flowIdx !== -1 || (isCompleted && metricsPlannedMinutes === 0),
      flowPosition: flowIdx !== -1 ? flowIdx + 1 : undefined,
      milestoneLinked,
      milestoneSynced,
      revisionReportLinked,
      revisionReportSynced,
      isParityIntact
    };
  });

  const clockPlannedMinutes = clockSlots.reduce((acc, s) => acc + (Number(s?.durationMinutes) || 0), 0);
  const metricsPlannedMinutes = auditRows.reduce((acc, r) => acc + r.metricsPlannedMinutes, 0);
  const flowPlannedMinutes = flowTargets.reduce((acc, f) => acc + (Number(f?.targetDurationMinutes ?? f?.duration) || 0), 0);
  const dailyTargetsPlannedMinutes = auditRows.reduce((acc, r) => acc + r.dailyTargetPlannedMinutes, 0);
  const metricsAllocatedMinutes = auditRows.reduce((acc, r) => acc + r.actualLoggedMinutes, 0);
  const flowAllocatedMinutes = flowTargets.reduce((acc, f) => acc + (Number(f?.allocatedMinutes) || 0), 0);
  const totalEarlySavedMinutes = auditRows.reduce((acc, r) => acc + r.earlySavedMinutes, 0);

  const completedTargetsCount = auditRows.filter(r => r.isCompleted).length;
  const activeMilestonesCount = checkpoints.filter(cp => !cp.completed).length;
  const syncedMilestonesCount = checkpoints.length;

  const isClockAndMetricsEqual = clockPlannedMinutes === metricsPlannedMinutes;
  const isFlowEqual = flowPlannedMinutes === metricsPlannedMinutes;
  const allRowsIntact = auditRows.every(r => r.isParityIntact);
  const isFullySynced = isClockAndMetricsEqual && isFlowEqual && allRowsIntact;

  const pillars: PillarSyncStatus[] = [
    {
      id: 'clock',
      name: '24-Hour Target Clock',
      shortLabel: '24H Clock',
      isSynced: isClockAndMetricsEqual,
      primaryMetricLabel: 'Planned Slots Total',
      primaryMetricValue: `${formatMinsCompact(clockPlannedMinutes)} (${clockPlannedMinutes}m)`,
      secondaryMetricLabel: 'Active Time Blocks',
      secondaryMetricValue: `${clockSlots.length} slot${clockSlots.length === 1 ? '' : 's'}`,
      statusDetail: isClockAndMetricsEqual ? '100% matched with Target Board' : 'Reconciling slot duration'
    },
    {
      id: 'metrics',
      name: 'Target Board',
      shortLabel: 'Target Board',
      isSynced: isClockAndMetricsEqual,
      primaryMetricLabel: 'Total Planned Time',
      primaryMetricValue: `${formatMinsCompact(metricsPlannedMinutes)} (${metricsPlannedMinutes}m)`,
      secondaryMetricLabel: 'Target Elapsed Time',
      secondaryMetricValue: `${formatMinsCompact(metricsAllocatedMinutes)} (${metricsAllocatedMinutes}m)`,
      statusDetail: isClockAndMetricsEqual ? '1:1 parity with 24H Clock & Flow' : 'Syncing target durations'
    },
    {
      id: 'flow',
      name: 'Sequence Flow',
      shortLabel: 'Sequence Flow',
      isSynced: isFlowEqual,
      primaryMetricLabel: 'Sequence Planned',
      primaryMetricValue: `${formatMinsCompact(flowPlannedMinutes)} (${flowPlannedMinutes}m)`,
      secondaryMetricLabel: 'Queued Targets',
      secondaryMetricValue: `${flowTargets.length} step${flowTargets.length === 1 ? '' : 's'}`,
      statusDetail: isFlowEqual ? 'Sequence order & durations synced' : 'Updating sequence queue'
    },
    {
      id: 'daily_targets',
      name: 'Study Planner',
      shortLabel: 'Study Planner',
      isSynced: dailyTargetsPlannedMinutes === metricsPlannedMinutes,
      primaryMetricLabel: 'Scheduled Tasks',
      primaryMetricValue: `${completedTargetsCount}/${auditRows.length} Done`,
      secondaryMetricLabel: 'Planned Allocation',
      secondaryMetricValue: `${formatMinsCompact(dailyTargetsPlannedMinutes)} (${dailyTargetsPlannedMinutes}m)`,
      statusDetail: 'Bi-directionally linked with Clock & Metrics'
    },
    {
      id: 'milestones',
      name: 'Study Milestones',
      shortLabel: 'Milestones',
      isSynced: auditRows.every(r => r.milestoneSynced),
      primaryMetricLabel: 'Active Checkpoints',
      primaryMetricValue: `${activeMilestonesCount} Active`,
      secondaryMetricLabel: 'Chapter Sync',
      secondaryMetricValue: auditRows.every(r => r.milestoneSynced) ? '100% Synced' : 'Reconciling',
      statusDetail: 'Auto-updates chapter progress on completion'
    },
    {
      id: 'revision_report',
      name: 'Revision Report',
      shortLabel: 'Revision Report',
      isSynced: auditRows.every(r => r.revisionReportSynced),
      primaryMetricLabel: 'Logged Revision Time',
      primaryMetricValue: `${formatMinsCompact(revLogsTodayMinutes || logsActualStudyMinutes)}`,
      secondaryMetricLabel: 'Stage Ledger',
      secondaryMetricValue: 'Rev 1 / 2 / 3 Linked',
      statusDetail: 'Synced with session logs & chapter completions'
    },
    {
      id: 'log_system',
      name: 'Session Log System',
      shortLabel: 'Log System',
      isSynced: true,
      primaryMetricLabel: 'Total Study Logged',
      primaryMetricValue: `${formatMinsCompact(logsActualStudyMinutes)} (${logsActualStudyMinutes}m)`,
      secondaryMetricLabel: 'Study Sessions',
      secondaryMetricValue: `${studyLogs.length} session${studyLogs.length === 1 ? '' : 's'}`,
      statusDetail: 'Deduplicated across Pomo & Focus ledgers'
    }
  ];

  return {
    selectedDate: effectiveDate,
    timestamp: new Date().toISOString(),
    isFullySynced,
    discrepanciesFixedCount,
    summary: {
      clockPlannedMinutes,
      metricsPlannedMinutes,
      flowPlannedMinutes,
      dailyTargetsPlannedMinutes,
      logsActualStudyMinutes,
      metricsAllocatedMinutes,
      flowAllocatedMinutes,
      revisionReportTodayMinutes: revLogsTodayMinutes || logsActualStudyMinutes,
      totalTargetsCount: auditRows.length,
      completedTargetsCount,
      activeMilestonesCount,
      syncedMilestonesCount,
      totalEarlySavedMinutes
    },
    pillars,
    targets: auditRows
  };
}
