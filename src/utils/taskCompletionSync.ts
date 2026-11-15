/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth, db } from '../lib/firebase';
import { doc as firestoreDoc, setDoc, deleteDoc } from 'firebase/firestore';
import {
  SubjectId,
  RevisionCycleKey,
  FOUNDATION_SUBJECT_IDS,
  INTERMEDIATE_SUBJECT_IDS,
  FINAL_SUBJECT_IDS
} from '../types';
import {
  SUBJECT_CHAPTERS,
  getCanonicalChapterKey,
  resolveLatestLogCompletionDate,
  computeSubjectMilestoneRevisionCount,
  getSubjectDynamicRevKeys
} from '../components/RevisionPlanner';
import {
  analyzeUserDayRationale,
  buildProtectedBlockedIntervals,
  findRealisticGapOnClock,
  fitOrderedItemsToRationaleTimeline,
  minutesToClockTime
} from './sleepPatternAnalysis';
import {
  isNonRevisionReportActivity,
  resolveTargetChapterForSubject,
  resolveActiveRevisionForChapter
} from './logSyncEngine';
import { triggerFinalRevisionConfetti } from '../components/ConfettiOverlay';
import { reconcileAllTargetSystems } from './targetReconciliationEngine';
import { useTargetSystemSync, forceRefetchTargetSystemFromFirestore } from '../hooks/useTargetSystemSync';
import { CALevel, getSelectedCALevel, getLevelForSubject } from '../data/curriculumLevels';
import {
  getLevelSubjectIds,
  getDefaultSubjectForLevel,
  getLevelScopedKey,
  getClockSlotsStorageKey,
  isClockSlotsStorageKeyForLevel,
  parseClockSlotsDateFromKey,
  getLevelFirestoreDocId,
  getDefaultExamDateForLevel,
  getUserDocExamDateField
} from './levelStorage';

const ALL_KNOWN_SUBJECT_IDS: SubjectId[] = [
  ...FOUNDATION_SUBJECT_IDS,
  ...INTERMEDIATE_SUBJECT_IDS,
  ...FINAL_SUBJECT_IDS
];

export interface EarlyCompletionSlotBackup {
  slotId: string;
  originalStartMinutes: number;
  originalEndMinutes: number;
  originalDurationMinutes: number;
  originalStartTime: string;
  originalEndTime: string;
}

export interface EarlyCompletionBackupEntry {
  taskId?: string;
  normTitle: string;
  date: string;
  originalTargetDurationMinutes: number;
  adjustedDurationMinutes: number;
  savedMinutes: number;
  clubGroupId?: string;
  originalClubTotalMinutes?: number;
  slotsBackup: EarlyCompletionSlotBackup[];
  updatedAt: string;
}

const EARLY_COMPLETION_BACKUP_KEY = 'practca_early_completion_backup';

const normalizeStr = (str: string) => (str || '').toLowerCase().trim();

export interface TaskIdentifier {
  id?: string;
  title?: string;
  cleanTitle?: string;
  chapterName?: string;
  subjectCode?: string;
  due?: string;
  taskDate?: string;
  revKey?: RevisionCycleKey;
  relevance?: 'General' | 'Revision' | 'Final Revision';
  milestoneId?: string;
  phaseId?: string;
  notes?: string;
  targetDurationMinutes?: number;
  originalTargetDurationMinutes?: number;
  duration?: number;
  allocatedMinutes?: number;
  actualMinutes?: number;
  isMockTest?: boolean;
  mockScheduledTime?: string;
  mockSeries?: string;
  _alreadyLogged?: boolean;
}

/**
 * Checks whether a task or target represents a Mock Test / Mock Exam simulation.
 * Mock Tests are strictly decoupled from Revision Report chapter revisions.
 */
export function isMockTestTask(task: any): boolean {
  if (!task) return false;
  if (task.isMockTest === true) return true;
  const idStr = `${task.id || ''} ${task.targetId || ''} ${task.taskId || ''}`;
  if (/\b(mock_task_|slot_mock_)/i.test(idStr)) return true;
  const combined = `${task.title || ''} ${task.cleanTitle || ''} ${task.notes || ''}`;
  return (
    /\bmock\s*test\b/i.test(combined) ||
    /\bmock\s*exam\b/i.test(combined) ||
    /\bicai\s*mtp\b/i.test(combined) ||
    /\bmtp\s*series\b/i.test(combined) ||
    /IS_MOCK_TEST:\s*true/i.test(combined) ||
    /MockScheduledTime:/i.test(combined)
  );
}

/**
 * Detects the owning CA subject for a chapter or task title within the active CA level (with fallback to all subjects).
 */
export function findSubjectForChapter(
  candidateText?: string,
  level: CALevel = getSelectedCALevel()
): SubjectId | undefined {
  if (!candidateText) return undefined;
  const levelSubs = getLevelSubjectIds(level);
  const validSubs: SubjectId[] = [
    ...levelSubs,
    ...ALL_KNOWN_SUBJECT_IDS.filter(s => !levelSubs.includes(s))
  ];
  
  // 1. Check embedded tag [Accounts], [AdvAcc], [AFM], [FR], etc.
  const tagMatch = candidateText.match(/\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|AFM|FR|Audit|DT|IDT|IBS)\s*\]/i);
  if (tagMatch) {
    const matched = validSubs.find(s => s.toUpperCase() === tagMatch[1].toUpperCase());
    if (matched) return matched;
  }

  // 2. Exact match against SUBJECT_CHAPTERS (prioritizing current CA level subjects)
  for (const s of validSubs) {
    const list = SUBJECT_CHAPTERS[s] || [];
    const canon = getCanonicalChapterKey(s, candidateText);
    if (list.includes(canon)) {
      return s;
    }
  }

  // 3. Substring inclusion match (minimum 5 chars)
  const clean = candidateText.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  for (const s of validSubs) {
    const list = SUBJECT_CHAPTERS[s] || [];
    for (const ch of list) {
      const chClean = ch.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
      if (chClean.length > 5 && (clean.includes(chClean) || chClean.includes(clean))) {
        return s;
      }
    }
  }

  return undefined;
}

const REGISTRY_STORAGE_KEY = 'practca_completed_targets_registry';

/**
 * Normalizes title or chapter strings by stripping emojis, subject tags, slot markers, and punctuation.
 */
export function normalizeKey(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[🔴🟡🔵🟢⚡🎯⭐✨⏱️📅📌]/g, '')
    .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/ig, '')
    .replace(/\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|AFM|FR|Audit|DT|IDT|IBS)\s*\]/ig, '')
    .replace(/\(\s*(Slot|Part)\s*\d+\s*\/\s*\d+\s*\)/ig, '')
    .replace(/^(slot\s*\d+\s*[-:]?\s*)/i, '')
    .replace(/^[\s\-\|]+|[\s\-\|]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Generates the central composite key tracking task completion:
 * key format: "[SUBJECTCODE]:::cleantitle" or "[DATE]:::[SUBJECTCODE]:::cleantitle"
 */
export function getTaskCompositeKey(cleanTitle?: string, subjectCode?: string, dateStr?: string): string {
  const clean = normalizeKey(cleanTitle);
  const sub = (subjectCode || '').trim().toUpperCase();
  if (!clean) return '';
  const base = sub ? `${sub}:::${clean}` : clean;
  return dateStr ? `${dateStr}:::${base}` : base;
}

/**
 * Resolves a single canonical chapter from candidateChapters without cross-matching
 * substring chapter names (e.g., 'Refunds' vs 'Customs Refunds', or 'Risk Management'
 * vs 'Foreign Exchange Exposure and Risk Management' / 'Interest Rate Risk Management').
 */
export function resolveExactOrBestChapterMatch(
  candidateChapters: string[] | SubjectId | string,
  searchTargets: string[] | string,
  subId?: string
): string | undefined {
  const resolvedSubId =
    subId || (typeof candidateChapters === 'string' ? candidateChapters : undefined);
  const chaptersList: string[] = Array.isArray(candidateChapters)
    ? candidateChapters
    : typeof candidateChapters === 'string'
    ? SUBJECT_CHAPTERS[candidateChapters as SubjectId] || []
    : [];
  const targetsList: string[] = Array.isArray(searchTargets)
    ? searchTargets
    : typeof searchTargets === 'string' && searchTargets.trim()
    ? [searchTargets]
    : [];

  if (!chaptersList.length || !targetsList.length) return undefined;

  const cleanTargets = targetsList.map(t => normalizeKey(t)).filter(Boolean);
  if (!cleanTargets.length) return undefined;

  // 1. Exact normalized match priority
  for (const st of cleanTargets) {
    const exact = chaptersList.find(ch => normalizeKey(ch) === st);
    if (exact) return exact;
  }

  // 2. Canonical chapter key resolution
  if (resolvedSubId) {
    for (const rawTarget of targetsList) {
      const canonical = getCanonicalChapterKey(resolvedSubId, rawTarget);
      if (canonical) {
        const canonNorm = normalizeKey(canonical);
        const matched = chaptersList.find(ch => normalizeKey(ch) === canonNorm);
        if (matched) return matched;
      }
    }
  }

  // 3. Longest-chapter-first guarded substring match (prevents 'Refunds' matching 'Customs Refunds' or 'Risk Management' matching 'Interest Rate Risk Management')
  const AMBIGUOUS_SHORT_CHAPTERS = new Set([
    'refunds',
    'risk management',
    'reporting',
    'returns',
    'registration',
    'appeals and revision',
    'miscellaneous provisions',
    'basic concepts'
  ]);

  const sortedByLengthDesc = [...chaptersList].sort((a, b) => b.length - a.length);
  for (const st of cleanTargets) {
    for (const ch of sortedByLengthDesc) {
      const chNorm = normalizeKey(ch);
      if (!chNorm) continue;
      if (chNorm === st) return ch;
      // Do not allow a short ambiguous chapter name to match a longer string or vice versa
      if (AMBIGUOUS_SHORT_CHAPTERS.has(chNorm) || AMBIGUOUS_SHORT_CHAPTERS.has(st)) {
        continue;
      }
      if (st.length >= 6 && chNorm.length >= 6 && (chNorm.includes(st) || st.includes(chNorm))) {
        return ch;
      }
    }
  }

  return undefined;
}

/**
 * Extracts the subject code from a task identifier or string
 */
export function extractSubjectCode(task: TaskIdentifier): SubjectId | undefined {
  if (task.subjectCode) {
    const s = task.subjectCode.trim().toUpperCase();
    const found = ALL_KNOWN_SUBJECT_IDS.find(v => v.toUpperCase() === s);
    if (found) return found;
  }
  const textToScan = `${task.cleanTitle || ''} ${task.title || ''}`;
  const match = textToScan.match(/\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|AFM|FR|Audit|DT|IDT|IBS)\s*\]/i);
  if (match && match[1]) {
    const s = match[1].trim().toUpperCase();
    return ALL_KNOWN_SUBJECT_IDS.find(v => v.toUpperCase() === s);
  }
  return undefined;
}

/**
 * Reads the persistent registry of completed targets
 */
export function getCompletedRegistry(level: CALevel = getSelectedCALevel()): Set<string> {
  const set = new Set<string>();
  try {
    const raw = localStorage.getItem(getLevelScopedKey(REGISTRY_STORAGE_KEY, level));
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach(k => {
          if (k && typeof k === 'string') set.add(k.toLowerCase());
        });
      }
    }
  } catch (e) {}
  return set;
}

/**
 * Saves keys to the persistent completed registry
 */
export function saveToCompletedRegistry(
  keysToAdd: string[],
  keysToRemove: string[] = [],
  level: CALevel = getSelectedCALevel()
): void {
  try {
    const set = getCompletedRegistry(level);
    keysToAdd.forEach(k => {
      if (k && typeof k === 'string') set.add(k.toLowerCase());
    });
    keysToRemove.forEach(k => {
      if (k && typeof k === 'string') set.delete(k.toLowerCase());
    });
    localStorage.setItem(getLevelScopedKey(REGISTRY_STORAGE_KEY, level), JSON.stringify(Array.from(set)));
  } catch (e) {}
}

/**
 * Explicitly registers a newly created task as active ('needsAction') across all synchronization stores.
 */
export function registerNewActiveTaskInSync(
  task: TaskIdentifier,
  selectedDate?: string,
  level: CALevel = getSelectedCALevel()
): void {
  try {
    const dateStr = selectedDate || (task.due ? task.due.split('T')[0] : task.taskDate) || new Date().toISOString().split('T')[0];
    const targetIdNorm = task.id ? task.id.trim().toLowerCase() : '';
    const titleNorm = normalizeKey(task.title);
    const cleanNorm = normalizeKey(task.cleanTitle || task.title);
    const chapNorm = normalizeKey(task.chapterName);
    const subCode = extractSubjectCode(task);
    const effectiveLevel = subCode ? getLevelForSubject(subCode) : level;

    const keysToRemove: string[] = [
      targetIdNorm,
      titleNorm,
      cleanNorm,
      chapNorm,
      getTaskCompositeKey(task.cleanTitle || task.title, subCode),
      getTaskCompositeKey(task.title, subCode),
      getTaskCompositeKey(task.chapterName, subCode),
      getTaskCompositeKey(task.cleanTitle || task.title, subCode, dateStr),
      getTaskCompositeKey(task.title, subCode, dateStr),
      getTaskCompositeKey(task.chapterName, subCode, dateStr)
    ].filter(Boolean);

    if (keysToRemove.length > 0) {
      saveToCompletedRegistry([], keysToRemove, effectiveLevel);
    }

    // Remove from deleted targets tombstone for this date so it appears in Target Duration Meter
    if (dateStr) {
      try {
        const delKey = getLevelScopedKey(`practca_deleted_targets_${dateStr}`, effectiveLevel);
        const rawDel = localStorage.getItem(delKey);
        if (rawDel) {
          const parsedDel = JSON.parse(rawDel);
          if (Array.isArray(parsedDel)) {
            const removeSet = new Set(
              [
                targetIdNorm,
                titleNorm,
                cleanNorm,
                chapNorm,
                (task.title || '').trim().toLowerCase(),
                (task.cleanTitle || '').trim().toLowerCase()
              ].filter(Boolean)
            );
            const filtered = parsedDel.filter((k: any) => !removeSet.has(String(k).toLowerCase()));
            localStorage.setItem(delKey, JSON.stringify(filtered));
          }
        }
      } catch (e) {}
    }

    // Ensure any matching slot on the selectedDate's 24h clock is 'pending' (not 'completed')
    if (dateStr) {
      try {
        const clockKey = getClockSlotsStorageKey(dateStr, effectiveLevel);
        const rawClock = localStorage.getItem(clockKey);
        if (rawClock) {
          const slots = JSON.parse(rawClock);
          if (Array.isArray(slots)) {
            let changed = false;
            const updatedSlots = slots.map((s: any) => {
              const sTitleNorm = normalizeKey(s.title);
              const sIdNorm = (s.targetId || '').trim().toLowerCase();
              const isMatch = Boolean(
                (targetIdNorm && sIdNorm && sIdNorm === targetIdNorm) ||
                (cleanNorm && sTitleNorm && sTitleNorm === cleanNorm) ||
                (titleNorm && sTitleNorm && sTitleNorm === titleNorm)
              );
              if (isMatch && s.status === 'completed') {
                changed = true;
                return { ...s, status: 'pending' };
              }
              return s;
            });
            if (changed) {
              localStorage.setItem(clockKey, JSON.stringify(updatedSlots));
            }
          }
        }
      } catch (e) {}
    }

    // Ensure any matching item in Target Flow is 'pending' (not 'completed')
    try {
      const flowKey = getLevelScopedKey('practca_target_flow', effectiveLevel);
      const rawFlow = localStorage.getItem(flowKey);
      if (rawFlow) {
        const flow = JSON.parse(rawFlow);
        if (Array.isArray(flow)) {
          let changed = false;
          const updatedFlow = flow.map((f: any) => {
            const fCleanNorm = normalizeKey(f.cleanTitle || f.title);
            const fIdNorm = (f.taskId || f.id || '').trim().toLowerCase();
            const isMatch = Boolean(
              (targetIdNorm && fIdNorm && fIdNorm === targetIdNorm) ||
              (cleanNorm && fCleanNorm && fCleanNorm === cleanNorm) ||
              (titleNorm && fCleanNorm && fCleanNorm === titleNorm)
            );
            if (isMatch && f.status === 'completed') {
              changed = true;
              return { ...f, status: 'pending', completedAt: undefined };
            }
            return f;
          });
          if (changed) {
            localStorage.setItem(flowKey, JSON.stringify(updatedFlow));
          }
        }
      }
    } catch (e) {}
  } catch (e) {
    console.warn('Error in registerNewActiveTaskInSync:', e);
  }
}

/**
 * Checks if a task is marked completed in authoritative task storage, target clock, or registry.
 */
export function isTaskCompletedInStorage(
  id?: string,
  title?: string,
  cleanTitle?: string,
  chapterName?: string,
  subjectCode?: string,
  selectedDate?: string,
  milestoneId?: string,
  level: CALevel = getSelectedCALevel()
): boolean {
  try {
    const targetIdNorm = id ? id.trim().toLowerCase() : '';
    const titleNorm = normalizeKey(title);
    const cleanNorm = normalizeKey(cleanTitle || title);
    const chapNorm = normalizeKey(chapterName);
    const msIdNorm = milestoneId ? milestoneId.trim() : '';
    const effectiveLevel = subjectCode && ALL_KNOWN_SUBJECT_IDS.some(s => s.toUpperCase() === subjectCode.trim().toUpperCase())
      ? getLevelForSubject(subjectCode.trim())
      : level;

    if (!targetIdNorm && !titleNorm && !cleanNorm && !chapNorm) {
      return false;
    }

    const cpUserKey = getLevelScopedKey('practca_roadmap_user_checkpoints', effectiveLevel);
    const localTasksKey = getLevelScopedKey('practca_local_tasks', effectiveLevel);
    const cachedTasksKey = getLevelScopedKey('practca_cached_cloud_tasks', effectiveLevel);

    // If a specific milestoneId is queried, strictly check that milestone's own completedChapters & milestone-scoped tasks
    if (msIdNorm) {
      const rawCp = localStorage.getItem(cpUserKey);
      if (rawCp) {
        const cps = JSON.parse(rawCp);
        if (Array.isArray(cps)) {
          const sortedCps = [...cps].sort((a: any, b: any) => String(a.targetDate || '').localeCompare(String(b.targetDate || '')));
          const cpIdx = sortedCps.findIndex((c: any) => c.id === msIdNorm);
          if (cpIdx !== -1) {
            const targetCp = sortedCps[cpIdx];
            const doneChaps: string[] = Array.isArray(targetCp.completedChapters) ? targetCp.completedChapters : [];
            const isChapInCpDone = doneChaps.some(ch => {
              const chNorm = normalizeKey(ch);
              return Boolean(chNorm && (chNorm === chapNorm || chNorm === cleanNorm || chNorm === titleNorm));
            });
            if (isChapInCpDone) return true;

            // Check if a task explicitly linked to this milestoneId is completed
            const rawTasks = localStorage.getItem(localTasksKey) || localStorage.getItem(cachedTasksKey);
            if (rawTasks) {
              const taskList = JSON.parse(rawTasks);
              if (Array.isArray(taskList)) {
                const msTasks = taskList.filter((t: any) => {
                  const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
                  if (tMsId) {
                    if (tMsId !== msIdNorm) return false;
                  } else {
                    return false;
                  }
                  const tCleanNorm = normalizeKey(t.cleanTitle || t.title);
                  const tChapNorm = normalizeKey(t.chapterName);
                  return Boolean(
                    (chapNorm && tChapNorm && tChapNorm === chapNorm) ||
                    (cleanNorm && tCleanNorm && tCleanNorm === cleanNorm) ||
                    (chapNorm && tCleanNorm && tCleanNorm === chapNorm)
                  );
                });
                if (msTasks.length > 0) {
                  const hasPending = msTasks.some((t: any) => t.status === 'needsAction' && !t.completed);
                  if (hasPending) return false;
                  return msTasks.some((t: any) => t.status === 'completed' || Boolean(t.completed));
                }
              }
            }
          }
        }
      }
      return false;
    }

    // 1. Check authoritative local & cached cloud tasks FIRST!
    const rawLocal = localStorage.getItem(localTasksKey);
    const rawCloud = localStorage.getItem(cachedTasksKey);
    const raw = rawLocal || rawCloud;
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        // 1a. Exact task ID match is 100% authoritative
        if (targetIdNorm && !targetIdNorm.startsWith('target_') && !targetIdNorm.startsWith('slot_')) {
          const exactIdTask = list.find((t: any) => t.id && String(t.id).trim().toLowerCase() === targetIdNorm);
          if (exactIdTask) {
            return exactIdTask.status === 'completed' || Boolean(exactIdTask.completed);
          }
        }

        // 1b. Match by normalized title / cleanTitle / chapterName
        const matchingTasks = list.filter((t: any) => {
          if (selectedDate) {
            const tDate = (t.due || t.taskDate || '').split('T')[0];
            if (tDate && tDate !== selectedDate) return false;
          }
          const tCleanNorm = normalizeKey(t.cleanTitle || t.title);
          const tTitleNorm = normalizeKey(t.title);
          const tChapNorm = normalizeKey(t.chapterName);
          const subMatches = !subjectCode || !t.subjectCode || subjectCode.toUpperCase() === String(t.subjectCode).toUpperCase();

          return Boolean(
            (targetIdNorm && t.id && String(t.id).trim().toLowerCase() === targetIdNorm) ||
            (cleanNorm && tCleanNorm && tCleanNorm === cleanNorm && subMatches) ||
            (titleNorm && tTitleNorm && tTitleNorm === titleNorm && subMatches) ||
            (titleNorm && tCleanNorm && tCleanNorm === titleNorm && subMatches) ||
            (cleanNorm && tTitleNorm && tTitleNorm === cleanNorm && subMatches) ||
            (chapNorm && tChapNorm && tChapNorm === chapNorm && subMatches) ||
            (chapNorm && (tCleanNorm === chapNorm || tTitleNorm === chapNorm) && subMatches) ||
            (tChapNorm && (cleanNorm === tChapNorm || titleNorm === tChapNorm) && subMatches)
          );
        });

        if (matchingTasks.length > 0) {
          // If any matching task on the active date is still 'needsAction', it is NOT completed
          const hasPending = matchingTasks.some((t: any) => t.status === 'needsAction' && !t.completed);
          if (hasPending) return false;
          return matchingTasks.some((t: any) => t.status === 'completed' || Boolean(t.completed));
        }

        if (!selectedDate) {
          const anyDateMatches = list.filter((t: any) => {
            const tCleanNorm = normalizeKey(t.cleanTitle || t.title);
            const tTitleNorm = normalizeKey(t.title);
            const tChapNorm = normalizeKey(t.chapterName);
            const subMatches = !subjectCode || !t.subjectCode || subjectCode.toUpperCase() === String(t.subjectCode).toUpperCase();
            return Boolean(
              (cleanNorm && tCleanNorm && tCleanNorm === cleanNorm && subMatches) ||
              (titleNorm && tTitleNorm && tTitleNorm === titleNorm && subMatches) ||
              (chapNorm && tChapNorm && tChapNorm === chapNorm && subMatches) ||
              (chapNorm && (tCleanNorm === chapNorm || tTitleNorm === chapNorm) && subMatches) ||
              (tChapNorm && (cleanNorm === tChapNorm || titleNorm === tChapNorm) && subMatches)
            );
          });
          if (anyDateMatches.length > 0) {
            const hasPending = anyDateMatches.some((t: any) => t.status === 'needsAction' && !t.completed);
            if (hasPending) return false;
            return anyDateMatches.some((t: any) => t.status === 'completed' || Boolean(t.completed));
          }
        }
      }
    }

    // 2. Check 24h target clock for the specific date (if provided)
    if (selectedDate) {
      const rawClock = localStorage.getItem(getClockSlotsStorageKey(selectedDate, effectiveLevel));
      if (rawClock) {
        const slots = JSON.parse(rawClock);
        if (Array.isArray(slots) && slots.length > 0) {
          const matchingSlots = slots.filter((s: any) => {
            const sTitleNorm = normalizeKey(s.title);
            const sIdNorm = (s.targetId || '').trim().toLowerCase();
            return Boolean(
              (targetIdNorm && sIdNorm && sIdNorm === targetIdNorm) ||
              (titleNorm && sTitleNorm && sTitleNorm === titleNorm) ||
              (cleanNorm && sTitleNorm && sTitleNorm === cleanNorm)
            );
          });
          if (matchingSlots.length > 0) {
            return matchingSlots.every((s: any) => s.status === 'completed');
          }
        }
      }
    }

    // 3. Check persistent registry only if no task record contradicted it
    const registry = getCompletedRegistry(effectiveLevel);
    if (targetIdNorm && registry.has(targetIdNorm)) return true;
    if (selectedDate) {
      const dateCompClean = getTaskCompositeKey(cleanTitle || title, subjectCode, selectedDate);
      const dateCompTitle = getTaskCompositeKey(title, subjectCode, selectedDate);
      if (dateCompClean && registry.has(dateCompClean)) return true;
      if (dateCompTitle && registry.has(dateCompTitle)) return true;
      return false;
    }

    const compositeClean = getTaskCompositeKey(cleanTitle || title, subjectCode);
    const compositeTitle = getTaskCompositeKey(title, subjectCode);
    if (compositeClean && registry.has(compositeClean)) return true;
    if (compositeTitle && registry.has(compositeTitle)) return true;

    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Returns a Set of all completed task keys for the given date (or across active stores if no date specified),
 * excluding any keys that belong to an active ('needsAction') task on that date.
 */
export function getCompletedTaskKeysSet(
  selectedDate?: string,
  level: CALevel = getSelectedCALevel()
): Set<string> {
  const completedKeys = new Set<string>();
  const activePendingKeys = new Set<string>();

  try {
    const rawLocal = localStorage.getItem(getLevelScopedKey('practca_local_tasks', level));
    const rawCloud = localStorage.getItem(getLevelScopedKey('practca_cached_cloud_tasks', level));
    const raw = rawLocal || rawCloud;
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((t: any) => {
          if (selectedDate) {
            const tDate = (t.due || t.taskDate || '').split('T')[0];
            if (tDate && tDate !== selectedDate) return;
          }
          const isDone = t.status === 'completed' || Boolean(t.completed);
          const keysForTask: string[] = [];
          if (t.id) keysForTask.push(String(t.id).toLowerCase());
          if (t.title) keysForTask.push(normalizeKey(t.title));
          if (t.cleanTitle) keysForTask.push(normalizeKey(t.cleanTitle));
          if (t.chapterName) keysForTask.push(normalizeKey(t.chapterName));
          if (t.cleanTitle && t.subjectCode) keysForTask.push(getTaskCompositeKey(t.cleanTitle, t.subjectCode));
          if (t.title && t.subjectCode) keysForTask.push(getTaskCompositeKey(t.title, t.subjectCode));

          if (isDone) {
            keysForTask.filter(Boolean).forEach(k => completedKeys.add(k));
          } else if (t.status === 'needsAction') {
            keysForTask.filter(Boolean).forEach(k => activePendingKeys.add(k));
          }
        });
      }
    }

    // Load from 24h target clock for selectedDate (or all clocks for this CA level if no selectedDate)
    const inspectClockKey = (key: string) => {
      const rawClock = localStorage.getItem(key);
      if (rawClock) {
        const slots = JSON.parse(rawClock);
        if (Array.isArray(slots)) {
          slots.forEach((s: any) => {
            if (s.status === 'completed') {
              if (s.targetId) completedKeys.add(String(s.targetId).toLowerCase());
              if (s.title) completedKeys.add(normalizeKey(s.title));
              if (s.title && s.subjectCode) completedKeys.add(getTaskCompositeKey(s.title, s.subjectCode));
            } else {
              if (s.targetId) activePendingKeys.add(String(s.targetId).toLowerCase());
              if (s.title) activePendingKeys.add(normalizeKey(s.title));
            }
          });
        }
      }
    };

    if (selectedDate) {
      inspectClockKey(getClockSlotsStorageKey(selectedDate, level));
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && isClockSlotsStorageKeyForLevel(key, level)) {
          inspectClockKey(key);
        }
      }
    }

    // Any key that has an active pending task on the target date must NOT be in completedKeys
    activePendingKeys.forEach(k => completedKeys.delete(k));
  } catch (e) {}
  return completedKeys;
}

/**
 * Bi-directionally synchronizes a target's duration (in minutes) across:
 * 1. `practca_task_target_durations`
 * 2. `practca_local_tasks` & `practca_cached_cloud_tasks`
 * 3. `practca_target_flow`
 * 4. `practca_24h_target_clock_${selectedDate}` (if a single slot exists for this target, resizes it)
 * 5. `practca_active_focus_task`
 */
export function syncTargetDurationAcrossSystem(params: {
  id?: string;
  title?: string;
  cleanTitle?: string;
  chapterName?: string;
  subjectCode?: string;
  targetDurationMinutes: number;
  selectedDate?: string;
  level?: CALevel;
}): void {
  try {
    const level = params.level || (params.subjectCode ? getLevelForSubject(params.subjectCode) : getSelectedCALevel());
    if (params.subjectCode && isSubjectLockedAfterFinalExam(params.subjectCode, new Date(), level)) {
      return;
    }
    const clamped = Math.max(1, Math.min(720, Math.round(params.targetDurationMinutes)));
    const idNorm = params.id ? params.id.trim() : '';
    const stripSubPrefix = (str?: string) => String(str || '').replace(/^\[[^\]]+\]\s*/, '').trim();
    const strippedTitle = stripSubPrefix(params.cleanTitle || params.title);
    const titleNorm = normalizeKey(params.title);
    const cleanNorm = normalizeKey(params.cleanTitle || params.title);
    const strippedNorm = normalizeKey(strippedTitle);
    const chapNorm = normalizeKey(params.chapterName);
    const dateStr = params.selectedDate || new Date().toISOString().split('T')[0];

    const durationsKey = getLevelScopedKey('practca_task_target_durations', level);

    // 1. Update practca_task_target_durations
    let durationsMap: Record<string, number> = {};
    try {
      const raw = localStorage.getItem(durationsKey);
      if (raw) durationsMap = JSON.parse(raw);
    } catch (e) {}

    if (idNorm) durationsMap[idNorm] = clamped;
    if (params.title) durationsMap[params.title] = clamped;
    if (params.cleanTitle) durationsMap[params.cleanTitle] = clamped;
    if (strippedTitle) durationsMap[strippedTitle] = clamped;
    if (titleNorm) durationsMap[titleNorm] = clamped;
    if (cleanNorm) durationsMap[cleanNorm] = clamped;
    if (strippedNorm) durationsMap[strippedNorm] = clamped;
    if (params.chapterName) durationsMap[params.chapterName] = clamped;
    if (chapNorm) durationsMap[chapNorm] = clamped;
    localStorage.setItem(durationsKey, JSON.stringify(durationsMap));

    // 2. Update local, cached cloud, and backup tasks + sync to Firestore if logged in
    const currentUid = auth?.currentUser?.uid;
    const syncedFirestoreTaskIds = new Set<string>();

    [
      getLevelScopedKey('practca_local_tasks', level),
      getLevelScopedKey('practca_cached_cloud_tasks', level),
      getLevelScopedKey('practca_tasks_backup', level)
    ].forEach(storageKey => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) return;
        let changed = false;
        const updated = list.map((t: any) => {
          const tDate = (t.due || t.taskDate || '').split('T')[0];
          const dateMatches = !params.selectedDate || !tDate || tDate === params.selectedDate;
          const tClean = normalizeKey(t.cleanTitle || t.title);
          const tChap = normalizeKey(t.chapterName);
          const isMatch = Boolean(
            (idNorm && t.id === idNorm) ||
            (dateMatches && cleanNorm && tClean && tClean === cleanNorm) ||
            (dateMatches && titleNorm && tClean && tClean === titleNorm) ||
            (dateMatches && strippedNorm && tClean && tClean === strippedNorm) ||
            (dateMatches && chapNorm && ((tClean && tClean === chapNorm) || (tChap && tChap === chapNorm)))
          );
          if (isMatch) {
            changed = true;
            let updatedNotes = String(t.notes || '');
            if (/TargetDurationMinutes:\s*\d+/i.test(updatedNotes)) {
              updatedNotes = updatedNotes.replace(/TargetDurationMinutes:\s*\d+/ig, `TargetDurationMinutes: ${clamped}`);
            } else if (updatedNotes.trim()) {
              updatedNotes = `${updatedNotes.trim()}\nTargetDurationMinutes: ${clamped}`;
            } else {
              updatedNotes = `TargetDurationMinutes: ${clamped}`;
            }
            const nextTask: any = {
              ...t,
              caLevel: level,
              targetDurationMinutes: clamped,
              durationMinutes: clamped,
              targetDuration: clamped,
              duration: clamped,
              notes: updatedNotes
            };
            if (t.status !== 'completed' || Number(t.targetDurationMinutes) !== clamped) {
              delete nextTask.originalTargetDurationMinutes;
              delete nextTask.earlyCompletionSavedMinutes;
            }

            if (currentUid && nextTask.id && !syncedFirestoreTaskIds.has(String(nextTask.id))) {
              syncedFirestoreTaskIds.add(String(nextTask.id));
              const sanitized = JSON.parse(JSON.stringify(nextTask));
              setDoc(firestoreDoc(db, `users/${currentUid}/tasks`, String(nextTask.id)), sanitized, { merge: true }).catch(() => {});
            }
            return nextTask;
          }
          return t;
        });
        if (changed) {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        }
      } catch (e) {}
    });

    // 3. Update Target Flow (global & date-scoped)
    [
      getLevelScopedKey('practca_target_flow', level),
      getLevelScopedKey(`practca_target_flow_${dateStr}`, level)
    ].forEach(flowKey => {
      try {
        const rawFlow = localStorage.getItem(flowKey);
        if (rawFlow) {
          const flow = JSON.parse(rawFlow);
          if (Array.isArray(flow)) {
            let changed = false;
            const updatedFlow = flow.map((f: any) => {
              const fClean = normalizeKey(f.cleanTitle || f.title);
              const isMatch = Boolean(
                (idNorm && (f.taskId === idNorm || f.id === idNorm)) ||
                (cleanNorm && fClean && fClean === cleanNorm) ||
                (titleNorm && fClean && fClean === titleNorm) ||
                (strippedNorm && fClean && fClean === strippedNorm)
              );
              if (isMatch) {
                changed = true;
                return {
                  ...f,
                  duration: clamped,
                  targetDurationMinutes: clamped
                };
              }
              return f;
            });
            if (changed) {
              localStorage.setItem(flowKey, JSON.stringify(updatedFlow));
            }
          }
        }
      } catch (e) {}
    });

    // 4. Update 24h Target Clock slot(s) for this target on dateStr
    try {
      const clockKey = getClockSlotsStorageKey(dateStr, level);
      const rawClock = localStorage.getItem(clockKey);
      if (rawClock) {
        const slots = JSON.parse(rawClock);
        if (Array.isArray(slots)) {
          const matchingIndices: number[] = [];
          slots.forEach((s: any, idx: number) => {
            const sNorm = normalizeKey(s.title);
            const sTargetId = String(s.targetId || '').trim();
            const sTargetNorm = normalizeKey(sTargetId);
            if (
              (idNorm && sTargetId === idNorm) ||
              (cleanNorm && sNorm && sNorm === cleanNorm) ||
              (titleNorm && sNorm && sNorm === titleNorm) ||
              (strippedNorm && sNorm && sNorm === strippedNorm) ||
              (strippedNorm && sTargetNorm && sTargetNorm === strippedNorm) ||
              (chapNorm && sNorm && sNorm === chapNorm)
            ) {
              matchingIndices.push(idx);
            }
          });

          if (matchingIndices.length > 0) {
            const currentSlotSum = matchingIndices.reduce(
              (acc, idx) => acc + (Number(slots[idx].durationMinutes) || 0),
              0
            );
            let remainingToAssign = clamped;
            let clockChanged = false;

            matchingIndices.forEach((slotIdx, matchPos) => {
              const slot = slots[slotIdx];
              const isLast = matchPos === matchingIndices.length - 1;
              const oldDur = Number(slot.durationMinutes) || 60;
              const desiredDur = isLast
                ? Math.max(1, remainingToAssign)
                : Math.max(1, Math.round((oldDur / Math.max(1, currentSlotSum)) * clamped));
              remainingToAssign = Math.max(1, remainingToAssign - desiredDur);

              const startM = Number(slot.startMinutes) || 0;
              const newEndMins = Math.min(1440, startM + desiredDur);
              const newDur = Math.max(1, newEndMins - startM);
              const h = Math.floor((newEndMins % 1440) / 60);
              const m = (newEndMins % 1440) % 60;
              const endTimeStr = newEndMins === 1440 ? '24:00' : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

              if (
                slot.durationMinutes !== newDur ||
                slot.totalTargetMinutes !== clamped ||
                slot.originalDurationMinutes !== undefined ||
                slot.earlySavedMinutes !== undefined
              ) {
                const nextSlot = {
                  ...slot,
                  durationMinutes: newDur,
                  endMinutes: newEndMins,
                  endTime: endTimeStr,
                  totalTargetMinutes: clamped
                };
                delete nextSlot.originalDurationMinutes;
                delete nextSlot.earlySavedMinutes;
                slots[slotIdx] = nextSlot;
                clockChanged = true;
              }
            });

            if (clockChanged) {
              localStorage.setItem(clockKey, JSON.stringify(slots));
            }
          }
        }
      }
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
      detail: { date: dateStr, taskDurations: durationsMap, removedTargetNames: [] }
    }));
    window.dispatchEvent(new Event('practca_target_clock_updated'));
    window.dispatchEvent(new Event('practca_flow_updated'));
    window.dispatchEvent(new Event('practca_tasks_updated'));
  } catch (e) {
    console.warn('Error syncing target duration across system:', e);
  }
}

export function computeTaskActualInvestedMinutes(
  task: TaskIdentifier,
  effectiveDate?: string,
  explicitActualMinutes?: number,
  level: CALevel = getSelectedCALevel()
): number {
  const explicitMins = explicitActualMinutes ?? (task as any).allocatedMinutes ?? (task as any).actualMinutes;
  if (typeof explicitMins === 'number' && explicitMins > 0) {
    return Math.max(1, Math.round(explicitMins));
  }

  const targetIdNorm = task.id ? task.id.trim().toLowerCase() : '';
  const cleanNorm = normalizeKey(task.cleanTitle || task.title);
  const titleNorm = normalizeKey(task.title);
  const chapNorm = normalizeKey(task.chapterName);

  let pomoLogsSeconds = 0;
  try {
    const rawPomoLogs = localStorage.getItem(getLevelScopedKey('practca_pomo_logs', level));
    if (rawPomoLogs) {
      const logs = JSON.parse(rawPomoLogs);
      if (Array.isArray(logs)) {
        for (const l of logs) {
          if (l.mode !== 'study') continue;
          if (effectiveDate && l.date && l.date !== effectiveDate) continue;
          const lTaskId = String(l.taskId || '').trim().toLowerCase();
          const lNoteNorm = normalizeKey(l.notes || l.title || '');
          const lChapNorm = normalizeKey(l.chapterName || '');
          const isMatch = Boolean(
            (targetIdNorm && lTaskId && lTaskId === targetIdNorm) ||
            (cleanNorm && lNoteNorm && (lNoteNorm === cleanNorm || lNoteNorm.includes(cleanNorm) || cleanNorm.includes(lNoteNorm))) ||
            (titleNorm && lNoteNorm && (lNoteNorm === titleNorm || lNoteNorm.includes(titleNorm) || titleNorm.includes(lNoteNorm))) ||
            (chapNorm && lChapNorm && lChapNorm === chapNorm)
          );
          if (isMatch) {
            pomoLogsSeconds += Number(l.durationSeconds) || 0;
          }
        }
      }
    }
  } catch (e) {}

  let focusSessionMinutes = 0;
  try {
    const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', level));
    if (rawFocus) {
      const sessions = JSON.parse(rawFocus);
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          if (effectiveDate && s.timestamp) {
            const sDate = new Date(s.timestamp);
            if (!isNaN(sDate.getTime())) {
              const sDateStr = `${sDate.getFullYear()}-${String(sDate.getMonth() + 1).padStart(2, '0')}-${String(sDate.getDate()).padStart(2, '0')}`;
              if (sDateStr !== effectiveDate) continue;
            }
          }
          const sDescNorm = normalizeKey(s.description || '');
          const sChapNorm = normalizeKey(s.chapterName || '');
          const isMatch = Boolean(
            (cleanNorm && sDescNorm && (sDescNorm === cleanNorm || sDescNorm.includes(cleanNorm) || cleanNorm.includes(sDescNorm))) ||
            (titleNorm && sDescNorm && (sDescNorm === titleNorm || sDescNorm.includes(titleNorm) || titleNorm.includes(sDescNorm))) ||
            (chapNorm && sChapNorm && sChapNorm === chapNorm)
          );
          if (isMatch) {
            focusSessionMinutes += Number(s.duration) || 0;
          }
        }
      }
    }
  } catch (e) {}

  let activeTimerSeconds = 0;
  try {
    const pomoMode = localStorage.getItem('practca_pomo_mode');
    const pomoStart = localStorage.getItem('practca_pomo_start');
    const rawAft = localStorage.getItem(getLevelScopedKey('practca_active_focus_task', level));
    if (pomoMode === 'study' && pomoStart && rawAft && !task._alreadyLogged) {
      const aft = JSON.parse(rawAft);
      const aftNorm = normalizeKey(aft.cleanTitle || aft.title || '');
      const aftChapNorm = normalizeKey(aft.chapterName || '');
      const aftIdNorm = String(aft.id || '').trim().toLowerCase();
      const isActiveMatch = Boolean(
        (targetIdNorm && aftIdNorm && aftIdNorm === targetIdNorm) ||
        (cleanNorm && aftNorm && (aftNorm === cleanNorm || aftNorm.includes(cleanNorm) || cleanNorm.includes(aftNorm))) ||
        (chapNorm && aftChapNorm && aftChapNorm === chapNorm)
      );
      if (isActiveMatch) {
        const startMs = new Date(pomoStart).getTime();
        if (!isNaN(startMs)) {
          const elapsed = Math.floor((Date.now() - startMs) / 1000);
          if (elapsed >= 60) {
            activeTimerSeconds = elapsed;
          }
        }
      }
    }
  } catch (e) {}

  let flowAllocatedMinutes = 0;
  try {
    const flowKeys = [getLevelScopedKey('practca_target_flow', level)];
    if (effectiveDate) flowKeys.push(getLevelScopedKey(`practca_target_flow_${effectiveDate}`, level));
    for (const fKey of flowKeys) {
      const rawFlow = localStorage.getItem(fKey);
      if (rawFlow) {
        const flow = JSON.parse(rawFlow);
        if (Array.isArray(flow)) {
          const matchFlow = flow.find((f: any) => {
            const fId = String(f.taskId || f.id || '').trim().toLowerCase();
            const fTitleNorm = normalizeKey(f.cleanTitle || f.title || '');
            return (targetIdNorm && fId === targetIdNorm) || (cleanNorm && fTitleNorm === cleanNorm);
          });
          if (matchFlow && Number(matchFlow.allocatedMinutes) > 0) {
            flowAllocatedMinutes = Math.max(flowAllocatedMinutes, Number(matchFlow.allocatedMinutes));
          }
        }
      }
    }
  } catch (e) {}

  const calculatedFromLogs = Math.round((pomoLogsSeconds + activeTimerSeconds) / 60) + focusSessionMinutes;
  const totalMins = Math.max(calculatedFromLogs, flowAllocatedMinutes);
  return Math.max(0, totalMins);
}

/**
 * Calculates the strict prospective restriction mark (in minutes from 00:00, 0-1440)
 * for the 24-hour target clock.
 * 
 * Rules strictly as specified:
 * 1. For past dates (< today): Restriction mark is 1440. All historical slots are strictly preserved and never retrospectively altered.
 * 2. For future dates (> today): Restriction mark is 0. The entire day is prospective.
 * 3. For today (dateStr === today):
 *    - nowMinutes = current local time in minutes (0-1440).
 *    - If there is an active running task (status === 'active' or startMinutes <= nowMinutes < endMinutes and not completed):
 *      The current task will go till its scheduled endMinutes.
 *      Restriction mark = Math.max(nowMinutes, activeSlot.endMinutes).
 *      (e.g. started at 2:00 PM, current time 4:00 PM, scheduled till 6:00 PM -> restriction mark is 6:00 PM / 1080m).
 *    - If no task is currently active/running:
 *      Restriction mark = nowMinutes.
 * 
 * Any tasks before or spanning the restriction mark MUST NEVER be disturbed by automated system changes.
 * All automated system changes (slot moving, compaction, auto-packing, pull-ups) MUST ONLY affect
 * pending tasks available post this restriction mark.
 */
export function getProspectiveRestrictionMark(
  slots: Array<{ startMinutes: number; endMinutes: number; status?: string; id?: string; title?: string }>,
  dateStr?: string,
  activeFocusTaskIdentifier?: string
): number {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (dateStr && dateStr < todayStr) {
    return 1440;
  }
  if (dateStr && dateStr > todayStr) {
    return 0;
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Find running slot across nowMinutes or explicitly active
  const activeSlot = slots.find(s => {
    const sStart = Number(s.startMinutes) || 0;
    const sEnd = Number(s.endMinutes) || 0;
    if (s.status === 'completed') return false;

    const isExplicitActive = s.status === 'active';
    const isMatchingActiveTask = Boolean(
      activeFocusTaskIdentifier &&
      (s.id === activeFocusTaskIdentifier ||
       (s as any).targetId === activeFocusTaskIdentifier ||
       normalizeKey(s.title) === normalizeKey(activeFocusTaskIdentifier))
    );
    const isRunningAcrossNow = sStart <= nowMinutes && sEnd > nowMinutes;
    return (isExplicitActive || isMatchingActiveTask || isRunningAcrossNow) && sEnd > nowMinutes;
  });

  if (activeSlot) {
    const activeEnd = Number(activeSlot.endMinutes) || nowMinutes;
    return Math.min(1440, Math.max(nowMinutes, activeEnd));
  }

  return Math.min(1440, nowMinutes);
}

export interface RoutineBlockadeInterval {
  start: number;
  end: number;
  label?: string;
  category?: string;
}

/**
 * Smart Slot Splitter:
 * If a chapter block conflicts with a routine blockade (Breakfast, Lunch, Dinner, Fresh Up, Sleep),
 * automatically splits the chapter into two segments:
 * - Part 1: before the blockade (startMinutes -> blockade.start)
 * - Part 2: after the blockade (blockade.end -> blockade.end + remaining duration)
 * Maintaining the original total study duration for the chapter (dur1 + dur2 === originalDuration).
 * Ensures zero time overlapping between targets.
 */
export function smartSplitSlotAroundBlockades<T extends {
  id?: string;
  title: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  totalTargetMinutes?: number;
  slotNumber?: number;
  totalSlots?: number;
  status?: string;
  isMockTest?: boolean;
  startTime?: string;
  endTime?: string;
  [key: string]: any;
}>(
  slot: T,
  blockades: RoutineBlockadeInterval[],
  options?: {
    minSegmentMinutes?: number;
    depth?: number;
  }
): T[] {
  // If slot is completed, mock test, or already split, return intact
  if (slot.status === 'completed' || slot.isMockTest) {
    return [slot];
  }
  const depth = options?.depth ?? 0;
  if (depth >= 2) {
    return [slot];
  }

  const origDur = Number(slot.totalTargetMinutes) || Number(slot.durationMinutes) || Math.max(1, slot.endMinutes - slot.startMinutes);
  const minSeg = options?.minSegmentMinutes ?? 5;
  const sortedBlocks = [...blockades]
    .filter(b => b.end > b.start)
    .sort((a, b) => a.start - b.start);

  const cleanTitle = (slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
  const baseId = String(slot.id || `slot_${Date.now()}`).replace(/_p\d+$/, '');

  let curStart = Math.min(1435, Math.max(0, Number(slot.startMinutes) || 0));
  let curDur = Math.max(1, Number(slot.durationMinutes) || origDur);
  let curEnd = Math.min(1440, curStart + curDur);

  // Find the first routine blockade that conflicts with this slot
  const conflictBlock = sortedBlocks.find(blk =>
    Math.max(curStart, blk.start) < Math.min(curEnd, blk.end) && blk.end <= 1440
  );

  if (!conflictBlock) {
    return [slot];
  }

  const spaceBefore = conflictBlock.start - curStart;

  // If there is viable space before the blockade (>= minSeg) and remaining study time (>= minSeg)
  if (spaceBefore >= minSeg && (curDur - spaceBefore) >= minSeg) {
    const part1Dur = spaceBefore;
    const part1End = conflictBlock.start;
    const part1: T = {
      ...slot,
      id: `${baseId}_p1`,
      title: `${cleanTitle} (Part 1/2)`,
      slotNumber: 1,
      totalSlots: 2,
      totalTargetMinutes: origDur,
      startMinutes: curStart,
      endMinutes: part1End,
      durationMinutes: part1Dur,
      startTime: minutesToClockTime(curStart),
      endTime: minutesToClockTime(part1End % 1440)
    };

    const part2Start = conflictBlock.end;
    const part2Dur = Math.max(1, curDur - part1Dur); // Maintaining exact original total duration!
    const part2End = Math.min(1440, part2Start + part2Dur);
    const part2: T = {
      ...slot,
      id: `${baseId}_p2`,
      title: `${cleanTitle} (Part 2/2)`,
      slotNumber: 2,
      totalSlots: 2,
      totalTargetMinutes: origDur,
      startMinutes: part2Start,
      endMinutes: part2End,
      durationMinutes: Math.max(1, part2End - part2Start),
      startTime: minutesToClockTime(part2Start),
      endTime: minutesToClockTime(part2End % 1440)
    };

    return [part1, part2];
  }

  // If space before is smaller than minSeg (e.g. starts inside or within 0-4m of blockade),
  // shift the entire slot to start immediately post-blockade, maintaining full duration
  const shiftedStart = conflictBlock.end;
  const shiftedEnd = Math.min(1440, shiftedStart + curDur);
  const shiftedSlot: T = {
    ...slot,
    startMinutes: shiftedStart,
    endMinutes: shiftedEnd,
    durationMinutes: Math.max(1, shiftedEnd - shiftedStart),
    startTime: minutesToClockTime(shiftedStart),
    endTime: minutesToClockTime(shiftedEnd % 1440)
  };

  return [shiftedSlot];
}

/**
 * Applies the Smart Slot Splitter across a collection of slots for a target date:
 * - Keeps frozen/past/running slots completely intact.
 * - For prospective slots conflicting with routine blockades (Meals/Sleep/Fresh Up),
 *   splits them into Part 1 before and Part 2 after the blockade, preserving total study minutes.
 * - Enforces zero time overlapping between targets.
 */
export function applySmartSlotSplitter<T extends {
  id?: string;
  title: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  totalTargetMinutes?: number;
  slotNumber?: number;
  totalSlots?: number;
  status?: string;
  isMockTest?: boolean;
  startTime?: string;
  endTime?: string;
  [key: string]: any;
}>(
  slots: T[],
  targetDate: string,
  options?: {
    activeFocusTaskId?: string;
    minSegmentMinutes?: number;
  }
): T[] {
  if (slots.length === 0) return [];
  const rationale = analyzeUserDayRationale(targetDate);
  const protectedBlocks = buildProtectedBlockedIntervals(rationale, [], true, true);
  const restrictionMark = getProspectiveRestrictionMark(slots, targetDate, options?.activeFocusTaskId);

  // System auto-slotting / smart-splitting freezes completed targets AND past/currently-running targets
  const frozenSlots = slots
    .filter(s => {
      const sStart = Number(s.startMinutes) || 0;
      const sEnd = Number(s.endMinutes) || 0;
      return (
        s.status === 'completed' ||
        sEnd <= restrictionMark ||
        (sStart <= restrictionMark && sEnd > restrictionMark)
      );
    })
    .sort((a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0));
  const frozenIds = new Set(frozenSlots.map(s => String(s.id || '')));

  const uncompletedSlots = slots.filter(s => !frozenIds.has(String(s.id || '')) && s.status !== 'completed');
  if (uncompletedSlots.length === 0) return [...frozenSlots];

  const sortedUncompleted = [...uncompletedSlots].sort((a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0));

  let cursorEnd = restrictionMark;
  const splitUncompleted: T[] = [];

  const stepAroundFrozen = (desiredStart: number, duration: number): number => {
    let s = desiredStart;
    for (const f of frozenSlots) {
      const fStart = Number(f.startMinutes) || 0;
      const fEnd = Number(f.endMinutes) || 0;
      if (Math.max(s, fStart) < Math.min(s + duration, fEnd)) {
        s = Math.max(s, fEnd);
      }
    }
    return s;
  };

  for (const slot of sortedUncompleted) {
    let dur = Math.max(1, Number(slot.durationMinutes) || 30);
    let startM = Math.max(restrictionMark, cursorEnd, Number(slot.startMinutes) ?? cursorEnd);
    startM = stepAroundFrozen(startM, dur);
    let endM = Math.min(1440, startM + dur);

    const slotToProcess: T = {
      ...slot,
      startMinutes: startM,
      endMinutes: endM,
      durationMinutes: Math.max(1, endM - startM),
      startTime: minutesToClockTime(startM),
      endTime: minutesToClockTime(endM % 1440)
    };

    const segments = smartSplitSlotAroundBlockades(slotToProcess, protectedBlocks, {
      minSegmentMinutes: options?.minSegmentMinutes ?? 5
    });

    for (const seg of segments) {
      let segDur = Math.max(1, seg.durationMinutes);
      let segStart = Math.max(restrictionMark, cursorEnd, seg.startMinutes);
      segStart = stepAroundFrozen(segStart, segDur);
      let segEnd = Math.min(1440, segStart + segDur);

      splitUncompleted.push({
        ...seg,
        startMinutes: segStart,
        endMinutes: segEnd,
        durationMinutes: Math.max(1, segEnd - segStart),
        startTime: minutesToClockTime(segStart),
        endTime: minutesToClockTime(segEnd % 1440)
      });

      cursorEnd = segEnd;
    }
  }

  const combined = [...frozenSlots, ...splitUncompleted].sort(
    (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
  );

  return combined;
}

/**
 * Validation function that wraps 24-hour clock updates:
 * 1. When the system is performing auto-slotting (no `allowManualSlotId` and `!isManualUserChange`),
 *    it checks the current time (`restrictionMark`), freezes completed and past/running slots,
 *    and makes exclusively prospective changes forward from current time.
 * 2. When the user makes their own manual changes (`allowManualSlotId` or `isManualUserChange`),
 *    the user is allowed to make any changes within the 24-hour frame (00:00–24:00), including
 *    targets that were marked completed already or are in the past.
 * 3. Whenever the system moves other tasks, it applies Smart Splitting around routine breaks/blockades
 *    and preserves the single flow sequence of targets with zero overlap.
 */
export function ensureProspectiveSchedule<T extends {
  id?: string;
  title: string;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  status?: string;
  isMockTest?: boolean;
  totalTargetMinutes?: number;
  slotNumber?: number;
  totalSlots?: number;
  startTime?: string;
  endTime?: string;
  [key: string]: any;
}>(
  originalSlots: T[],
  candidateUpdatedSlots: T[],
  targetDate: string,
  options?: {
    activeFocusTaskId?: string;
    autoSplitRoutineBlockades?: boolean;
    dateNow?: Date;
    allowManualSlotId?: string;
    autoRipple?: boolean;
    isManualUserChange?: boolean;
  }
): T[] {
  const manualSlotId = options?.allowManualSlotId ? String(options.allowManualSlotId) : null;
  const isManualFullReorder = manualSlotId === '__manual_reorder__';
  const isManualUserChange = Boolean(options?.isManualUserChange || manualSlotId);
  const shouldRipple = options?.autoRipple !== false;

  const now = options?.dateNow || new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isToday = targetDate === todayStr;
  const isPastDate = Boolean(targetDate && targetDate < todayStr);

  // Pure system auto-slotting on a past date must leave original schedule untouched
  if (!isManualUserChange && isPastDate) {
    return [...originalSlots];
  }

  // If user manually adjusted a single target with autoRipple disabled, or performed a full manual sequence reorder, preserve exact candidate positions
  if ((manualSlotId && !shouldRipple) || isManualFullReorder) {
    return [...candidateUpdatedSlots].sort(
      (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
    );
  }

  const restrictionMark = isToday
    ? getProspectiveRestrictionMark(originalSlots, targetDate, options?.activeFocusTaskId)
    : 0;

  const rationale = analyzeUserDayRationale(targetDate);
  const protectedBlocks = buildProtectedBlockedIntervals(rationale, [], true, true);
  const shouldSmartSplit = options?.autoSplitRoutineBlockades !== false;

  const candidateById = new Map<string, T>();
  for (const c of candidateUpdatedSlots) {
    if (c.id) {
      candidateById.set(String(c.id), c);
    }
  }

  // 1. Determine locked slots:
  // - If the user manually edited/moved `manualSlotId`, lock `manualSlotId` at the user's chosen 24h time (even if completed or in the past).
  // - Freeze all other completed slots and (on today) past/running slots (`<= restrictionMark`) so system auto-slotting/rippling only moves prospective tasks.
  const lockedSlots: T[] = [];
  const lockedSlotIds = new Set<string>();

  if (manualSlotId && candidateById.has(manualSlotId)) {
    const manualCand = candidateById.get(manualSlotId)!;
    const mStart = Math.max(0, Math.min(1439, Number(manualCand.startMinutes) || 0));
    const mDur = Math.max(1, Number(manualCand.durationMinutes) || Math.max(1, (Number(manualCand.endMinutes) || 0) - mStart));
    const mEnd = Math.min(1440, mStart + mDur);
    lockedSlots.push({
      ...manualCand,
      startMinutes: mStart,
      endMinutes: mEnd,
      durationMinutes: Math.max(1, mEnd - mStart),
      startTime: minutesToClockTime(mStart),
      endTime: mEnd >= 1440 ? '24:00' : minutesToClockTime(mEnd % 1440)
    });
    lockedSlotIds.add(manualSlotId);
  }

  for (const orig of originalSlots) {
    const origId = String(orig.id || '');
    if (!origId || lockedSlotIds.has(origId)) continue;
    const cand = candidateById.get(origId);
    if (!cand) {
      // Slot was explicitly deleted, split into _p1/_p2, or vacated upon completion
      continue;
    }
    const oStart = Number(orig.startMinutes) || 0;
    const oEnd = Number(orig.endMinutes) || 0;
    const isCompleted = orig.status === 'completed' && cand.status === 'completed';
    const isPastOrRunningOnToday = isToday && (oEnd <= restrictionMark || (oStart <= restrictionMark && oEnd > restrictionMark));

    if (isCompleted || isPastOrRunningOnToday) {
      lockedSlots.push({
        ...orig,
        status: cand.status ?? orig.status
      });
      lockedSlotIds.add(origId);
    }
  }

  // Also lock any newly completed slots in candidateUpdatedSlots
  for (const cand of candidateUpdatedSlots) {
    const candId = String(cand.id || '');
    if (candId && lockedSlotIds.has(candId)) continue;
    if (cand.status === 'completed') {
      lockedSlots.push({ ...cand });
      if (candId) lockedSlotIds.add(candId);
    }
  }

  const sortedLockedSlots = [...lockedSlots].sort(
    (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
  );

  // 2. Gather prospective uncompleted adjustable slots while preserving their candidate sequence
  const adjustableCandidates: T[] = [];
  for (const cand of candidateUpdatedSlots) {
    const candId = String(cand.id || '');
    if (candId && lockedSlotIds.has(candId)) continue;
    if (cand.status === 'completed') continue;

    const cStart = Math.max(0, Math.min(1439, Number(cand.startMinutes) || 0));
    const cDur = Math.max(1, Number(cand.durationMinutes) || Math.max(1, (Number(cand.endMinutes) || 0) - cStart));
    const cEnd = Math.min(1440, cStart + cDur);

    adjustableCandidates.push({
      ...cand,
      startMinutes: cStart,
      endMinutes: cEnd,
      durationMinutes: Math.max(1, cEnd - cStart),
      startTime: minutesToClockTime(cStart),
      endTime: cEnd >= 1440 ? '24:00' : minutesToClockTime(cEnd % 1440)
    });
  }

  const stepAroundLocked = (desiredStart: number, duration: number): number => {
    let s = desiredStart;
    for (const locked of sortedLockedSlots) {
      const lStart = Number(locked.startMinutes) || 0;
      const lEnd = Number(locked.endMinutes) || 0;
      if (Math.max(s, lStart) < Math.min(s + duration, lEnd)) {
        s = Math.max(s, lEnd);
      }
    }
    return s;
  };

  // 3. Enforce prospective slotting (`>= restrictionMark` on today), zero overlap, and smart splitting around breaks
  const sortedAdjustable = [...adjustableCandidates].sort(
    (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
  );

  let timelineCursor = isToday ? restrictionMark : 0;
  const finalAdjustable: T[] = [];

  for (const cand of sortedAdjustable) {
    let dur = Math.max(1, Number(cand.durationMinutes) || 30);
    let startM = Math.max(timelineCursor, Number(cand.startMinutes) || 0);
    const wasMovedBySystem = startM !== (Number(cand.startMinutes) || 0) || !isManualUserChange;

    startM = stepAroundLocked(startM, dur);
    let endM = Math.min(1440, startM + dur);
    if (startM >= 1440) {
      startM = Math.max(0, 1440 - dur);
      endM = 1440;
    }

    const candidateToPlace: T = {
      ...cand,
      startMinutes: startM,
      endMinutes: endM,
      durationMinutes: Math.max(1, endM - startM),
      startTime: minutesToClockTime(startM),
      endTime: endM >= 1440 ? '24:00' : minutesToClockTime(endM % 1440)
    };

    const alreadySplitPart = /\(Part\s*\d+\/\d+\)/i.test(String(candidateToPlace.title || ''));
    if (shouldSmartSplit && wasMovedBySystem && !candidateToPlace.isMockTest && !alreadySplitPart) {
      const splitSegments = smartSplitSlotAroundBlockades(candidateToPlace, protectedBlocks, {
        minSegmentMinutes: 15
      });
      for (const seg of splitSegments) {
        let segDur = Math.max(1, Number(seg.durationMinutes) || 15);
        let segStart = Math.max(timelineCursor, Number(seg.startMinutes) || timelineCursor);
        segStart = stepAroundLocked(segStart, segDur);
        let segEnd = Math.min(1440, segStart + segDur);
        if (segStart >= 1440) {
          segStart = Math.max(0, 1440 - segDur);
          segEnd = 1440;
        }
        finalAdjustable.push({
          ...seg,
          startMinutes: segStart,
          endMinutes: segEnd,
          durationMinutes: Math.max(1, segEnd - segStart),
          startTime: minutesToClockTime(segStart),
          endTime: segEnd >= 1440 ? '24:00' : minutesToClockTime(segEnd % 1440)
        });
        timelineCursor = segEnd;
      }
    } else {
      finalAdjustable.push(candidateToPlace);
      timelineCursor = endM;
    }
  }

  const finalSchedule = [...sortedLockedSlots, ...finalAdjustable].sort(
    (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
  );

  return finalSchedule;
}

function cascadeClockSlotsForDate(allSlots: any[], prioritySlotIds: Set<string>, dateStr?: string): any[] {
  if (allSlots.length <= 1) return allSlots;
  const rationale = analyzeUserDayRationale(dateStr);
  const protectedBlocks = buildProtectedBlockedIntervals(rationale, [], true, true);
  const restrictionMark = dateStr ? getProspectiveRestrictionMark(allSlots, dateStr) : 0;

  // Freeze completed slots and past/running slots during system auto-slotting (unless explicitly in prioritySlotIds)
  const frozenSlots = allSlots
    .filter(s => {
      const sId = String(s.id || '');
      if (prioritySlotIds.has(sId)) return true;
      const sStart = Number(s.startMinutes) || 0;
      const sEnd = Number(s.endMinutes) || 0;
      return (
        s.status === 'completed' ||
        sEnd <= restrictionMark ||
        (sStart <= restrictionMark && sEnd > restrictionMark)
      );
    })
    .sort((a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0));
  const frozenIds = new Set(frozenSlots.map(s => String(s.id || '')));

  const uncompletedSlots = allSlots.filter(s => !frozenIds.has(String(s.id || '')) && s.status !== 'completed');
  if (uncompletedSlots.length === 0) return allSlots;

  const sorted = [...uncompletedSlots].sort((a, b) => {
    const aPrio = prioritySlotIds.has(String(a.id || ''));
    const bPrio = prioritySlotIds.has(String(b.id || ''));
    if (aPrio && !bPrio && a.startMinutes === b.startMinutes) return -1;
    if (bPrio && !aPrio && a.startMinutes === b.startMinutes) return 1;
    return (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0);
  });

  const stepAroundFrozen = (desiredStart: number, duration: number): number => {
    let s = desiredStart;
    for (const f of frozenSlots) {
      const fStart = Number(f.startMinutes) || 0;
      const fEnd = Number(f.endMinutes) || 0;
      if (Math.max(s, fStart) < Math.min(s + duration, fEnd)) {
        s = Math.max(s, fEnd);
      }
    }
    return s;
  };

  let cursorEnd = restrictionMark;
  const cascadedProspective: any[] = [];
  for (const slot of sorted) {
    let dur = Math.max(1, Number(slot.durationMinutes) || 30);
    let startM = Math.max(restrictionMark, cursorEnd, Number(slot.startMinutes) ?? cursorEnd);
    startM = stepAroundFrozen(startM, dur);

    // Avoid trampling over Breakfast, Lunch, Dinner, or Sleep; split if viable
    let splitApplied = false;
    if (!slot.isMockTest && slot.status !== 'completed') {
      for (const blk of protectedBlocks) {
        if (Math.max(startM, blk.start) < Math.min(startM + dur, blk.end) && blk.end <= 1440) {
          const spaceBefore = blk.start - startM;
          if (spaceBefore >= 20 && (dur - spaceBefore) >= 15) {
            const origDur = Number(slot.totalTargetMinutes) || dur;
            const baseId = String(slot.id || '').replace(/_p\d+$/, '');
            const cleanTitle = (slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();

            const part1End = blk.start;
            cascadedProspective.push({
              ...slot,
              id: `${baseId}_p1`,
              title: `${cleanTitle} (Part 1/2)`,
              slotNumber: 1,
              totalSlots: 2,
              totalTargetMinutes: origDur,
              startMinutes: startM,
              endMinutes: part1End,
              durationMinutes: part1End - startM,
              startTime: minutesToClockTime(startM),
              endTime: minutesToClockTime(part1End % 1440)
            });

            const part2Dur = dur - spaceBefore;
            const part2Start = stepAroundFrozen(blk.end, part2Dur);
            const part2End = Math.min(1440, part2Start + part2Dur);
            cascadedProspective.push({
              ...slot,
              id: `${baseId}_p2`,
              title: `${cleanTitle} (Part 2/2)`,
              slotNumber: 2,
              totalSlots: 2,
              totalTargetMinutes: origDur,
              startMinutes: part2Start,
              endMinutes: part2End,
              durationMinutes: Math.max(1, part2End - part2Start),
              startTime: minutesToClockTime(part2Start),
              endTime: minutesToClockTime(part2End % 1440)
            });

            cursorEnd = part2End;
            splitApplied = true;
            break;
          } else {
            startM = stepAroundFrozen(blk.end, dur);
          }
        }
      }
    }

    if (!splitApplied) {
      const endM = Math.min(1440, startM + dur);
      dur = Math.max(1, endM - startM);
      cascadedProspective.push({
        ...slot,
        startMinutes: startM,
        endMinutes: endM,
        durationMinutes: dur,
        startTime: minutesToClockTime(startM),
        endTime: minutesToClockTime(endM % 1440)
      });
      cursorEnd = endM;
    }
  }

  const cascadedSchedule = [...frozenSlots, ...cascadedProspective].sort((a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0));
  return ensureProspectiveSchedule(allSlots, cascadedSchedule, dateStr || '');
}

export async function syncTaskCompletionAcrossAllLinks(
  task: TaskIdentifier,
  isCompleted: boolean,
  options?: {
    completionDate?: string;
    selectedDate?: string;
    revKey?: RevisionCycleKey;
    milestoneId?: string;
    phaseId?: string;
    skipped?: boolean;
    alreadyLogged?: boolean;
    actualMinutes?: number;
    level?: CALevel;
  }
): Promise<void> {
  const activeLevel = options?.level || getSelectedCALevel();
  const completionIso = isCompleted ? (options?.completionDate || new Date().toISOString()) : undefined;
  const newStatus = isCompleted ? 'completed' : 'needsAction';
  const effectiveDate = options?.selectedDate || (task.due ? task.due.split('T')[0] : task.taskDate);
  const parsedNotesMilestoneId = typeof task.notes === 'string'
    ? task.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim()
    : undefined;
  const explicitMilestoneId = options?.milestoneId || task.milestoneId || parsedNotesMilestoneId;

  const targetIdNorm = task.id ? task.id.trim().toLowerCase() : '';
  const titleNorm = normalizeKey(task.title);
  const cleanNorm = normalizeKey(task.cleanTitle || task.title);
  const chapNorm = normalizeKey(task.chapterName);
  const subCode = extractSubjectCode(task);

  if (subCode && isSubjectLockedAfterFinalExam(subCode, new Date(), activeLevel)) {
    return;
  }

  const compositeClean = getTaskCompositeKey(task.cleanTitle || task.title, subCode);
  const compositeTitle = getTaskCompositeKey(task.title, subCode);
  const compositeChap = getTaskCompositeKey(task.chapterName, subCode);
  const dateCompositeClean = effectiveDate ? getTaskCompositeKey(task.cleanTitle || task.title, subCode, effectiveDate) : '';
  const dateCompositeTitle = effectiveDate ? getTaskCompositeKey(task.title, subCode, effectiveDate) : '';

  const dateCompositeChap = effectiveDate ? getTaskCompositeKey(task.chapterName, subCode, effectiveDate) : '';
  const genericCompClean = getTaskCompositeKey(task.cleanTitle || task.title, undefined);
  const genericCompChap = getTaskCompositeKey(task.chapterName, undefined);

  const keysToUpdate: string[] = [
    compositeClean,
    compositeTitle,
    compositeChap,
    dateCompositeClean,
    dateCompositeTitle,
    dateCompositeChap,
    genericCompClean,
    genericCompChap,
    targetIdNorm,
    titleNorm,
    cleanNorm,
    chapNorm
  ].filter(Boolean);

  if (isCompleted) {
    saveToCompletedRegistry(keysToUpdate, [], activeLevel);
  } else {
    saveToCompletedRegistry([], keysToUpdate, activeLevel);
  }

  // Record or clear exact ISO completion timestamp for Timed Practice 3-hour cut-off buffer evaluation
  try {
    const resolvedSub = subCode || findSubjectForChapter(task.chapterName || task.cleanTitle || task.title, activeLevel);
    if (resolvedSub) {
      const matchedChap =
        resolveTargetChapterForSubject(
          resolvedSub,
          task.chapterName,
          task.cleanTitle || task.title,
          task.notes
        ) ||
        task.chapterName;
      if (matchedChap) {
        const canonChap = getCanonicalChapterKey(resolvedSub, matchedChap) || matchedChap;
        const normCanon = normalizeKey(canonChap);
        if (normCanon) {
          const tsStorageKey = getLevelScopedKey('practca_chapter_completion_timestamps', activeLevel);
          const rawTsMap = localStorage.getItem(tsStorageKey);
          const tsMap: Record<string, string> = rawTsMap ? JSON.parse(rawTsMap) || {} : {};
          if (isCompleted && !options?.skipped) {
            const isoTs = completionIso || new Date().toISOString();
            tsMap[`${resolvedSub}:::${normCanon}`] = tsMap[`${resolvedSub}:::${normCanon}`] || isoTs;
            if (explicitMilestoneId) {
              tsMap[`${explicitMilestoneId}:::${resolvedSub}:::${normCanon}`] =
                tsMap[`${explicitMilestoneId}:::${resolvedSub}:::${normCanon}`] || isoTs;
            }
          } else if (!isCompleted) {
            delete tsMap[`${resolvedSub}:::${normCanon}`];
            if (explicitMilestoneId) {
              delete tsMap[`${explicitMilestoneId}:::${resolvedSub}:::${normCanon}`];
            }
          }
          localStorage.setItem(tsStorageKey, JSON.stringify(tsMap));
        }
      }
    }
  } catch {}

  const checkMatch = (
    tId?: string,
    tTitle?: string,
    tClean?: string,
    tChap?: string,
    tSub?: string,
    tDate?: string
  ): boolean => {
    const idMatches = Boolean(targetIdNorm && tId && tId.trim().toLowerCase() === targetIdNorm);
    if (idMatches) return true;

    // If both have dates and they are on different dates, do not cross-contaminate other dates' tasks
    if (effectiveDate && tDate) {
      const normTDate = tDate.split('T')[0];
      if (normTDate && normTDate !== effectiveDate) {
        return false;
      }
    }

    const normTTitle = normalizeKey(tTitle);
    const normTClean = normalizeKey(tClean || tTitle);
    const normTChap = normalizeKey(tChap);

    const titleMatches = Boolean(titleNorm && normTTitle && normTTitle === titleNorm);
    const cleanMatches = Boolean(cleanNorm && normTClean && normTClean === cleanNorm);
    const crossTitleClean = Boolean(titleNorm && normTClean && normTClean === titleNorm);
    const crossCleanTitle = Boolean(cleanNorm && normTTitle && normTTitle === cleanNorm);
    const chapMatches = Boolean(
      (chapNorm && normTChap && normTChap === chapNorm) ||
      (chapNorm && (normTClean === chapNorm || normTTitle === chapNorm)) ||
      (normTChap && (cleanNorm === normTChap || titleNorm === normTChap))
    );

    if (subCode && tSub && subCode.toUpperCase() !== tSub.toUpperCase()) {
      return false;
    }

    return titleMatches || cleanMatches || crossTitleClean || crossCleanTitle || chapMatches;
  };

  // 0. Early Completion Slot & Duration Adjustment OR Undo Completion Restoration
  const scopedEarlyBackupKey = getLevelScopedKey(EARLY_COMPLETION_BACKUP_KEY, activeLevel);
  const scopedDurationsKey = getLevelScopedKey('practca_task_target_durations', activeLevel);
  const scopedLocalTasksKey = getLevelScopedKey('practca_local_tasks', activeLevel);
  const scopedCloudTasksKey = getLevelScopedKey('practca_cached_cloud_tasks', activeLevel);
  const scopedBackupTasksKey = getLevelScopedKey('practca_tasks_backup', activeLevel);

  const backupKey = `${effectiveDate || 'global'}::${cleanNorm || titleNorm || targetIdNorm}`;
  let backupMap: Record<string, EarlyCompletionBackupEntry> = {};
  try {
    const rawBackup = localStorage.getItem(scopedEarlyBackupKey);
    if (rawBackup) backupMap = JSON.parse(rawBackup) || {};
  } catch (e) {}

  let durationsMap: Record<string, number> = {};
  try {
    const rawDurations = localStorage.getItem(scopedDurationsKey);
    if (rawDurations) durationsMap = JSON.parse(rawDurations) || {};
  } catch (e) {}

  // Determine actual achieved minutes when completing
  const actualAchievedMinutes = isCompleted
    ? computeTaskActualInvestedMinutes(task, effectiveDate, options?.actualMinutes)
    : 0;

  // Inspect existing scheduled duration from task store or 24h clock
  let detectedScheduledMinutes = 0;
  let detectedClubGroupId: string | undefined = undefined;
  let detectedOriginalClubTotal: number | undefined = undefined;
  try {
    const rawLocal = localStorage.getItem(scopedLocalTasksKey) || localStorage.getItem(scopedCloudTasksKey);
    if (rawLocal) {
      const parsedLocal = JSON.parse(rawLocal);
      if (Array.isArray(parsedLocal)) {
        const foundTask = parsedLocal.find((t: any) =>
          checkMatch(t.id, t.title, t.cleanTitle, t.chapterName, t.subjectCode, t.due || t.taskDate)
        );
        if (foundTask) {
          detectedClubGroupId = foundTask.clubGroupId || (foundTask.notes || '').match(/ClubGroupId:\s*([^|\n\r]+)/i)?.[1]?.trim();
          detectedOriginalClubTotal = Number(foundTask.originalClubTotalMinutes || foundTask.clubTotalMinutes) || undefined;
          detectedScheduledMinutes =
            Number(foundTask.originalTargetDurationMinutes) ||
            Number(foundTask.targetDurationMinutes) ||
            Number(foundTask.duration) ||
            0;
        }
      }
    }
  } catch (e) {}

  if (!detectedScheduledMinutes) {
    detectedScheduledMinutes =
      Number(task.originalTargetDurationMinutes) ||
      Number(task.targetDurationMinutes) ||
      Number(task.duration) ||
      (task.id ? durationsMap[task.id] : 0) ||
      (task.cleanTitle ? durationsMap[task.cleanTitle] : 0) ||
      (task.title ? durationsMap[task.title] : 0) ||
      (cleanNorm ? durationsMap[cleanNorm] : 0) ||
      0;
  }

  if (!detectedScheduledMinutes && effectiveDate) {
    try {
      const rawClockForDate = localStorage.getItem(getClockSlotsStorageKey(effectiveDate, activeLevel));
      if (rawClockForDate) {
        const slotsForDate = JSON.parse(rawClockForDate);
        if (Array.isArray(slotsForDate)) {
          const matchingSlots = slotsForDate.filter((s: any) => {
            const isClubBatchSlot = String(s.id || '').includes('_club_') || /^batch\s*\d*\s*\(/i.test(String(s.title || ''));
            if (isClubBatchSlot) return false;
            return checkMatch(s.targetId, s.title, s.title, s.chapterName, s.subjectCode, effectiveDate);
          });
          if (matchingSlots.length > 0) {
            detectedScheduledMinutes = matchingSlots.reduce(
              (sum: number, s: any) => sum + (Number(s.originalDurationMinutes || s.durationMinutes) || 0),
              0
            );
          }
        }
      }
    } catch (e) {}
  }

  // Preserve planned duration from 24-hour target clock slots on completion without shrinking to actual achieved minutes
  const isEarlyCompletion = false;
  const earlySavedMinutes = 0;

  // Lookup existing backup entry if undoing completion
  const existingBackupEntry: EarlyCompletionBackupEntry | undefined =
    backupMap[backupKey] ||
    Object.values(backupMap).find(b =>
      (!effectiveDate || b.date === effectiveDate) &&
      ((targetIdNorm && b.taskId && b.taskId.toLowerCase() === targetIdNorm) ||
       (cleanNorm && b.normTitle === cleanNorm))
    );

  // 1. Synchronize in local & cloud task stores (including Early Completion duration update or Undo duration restoration)
  const matchedTaskIds = new Set<string>();
  if (task.id && !task.id.startsWith('target_') && !task.id.startsWith('active_focus_task_')) {
    matchedTaskIds.add(task.id);
  }

  let restoredDurationOnUndo = existingBackupEntry?.originalTargetDurationMinutes || 0;

  try {
    [scopedLocalTasksKey, scopedCloudTasksKey].forEach(storageKey => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          let hasUpdated = false;
          let affectedClubGroupId: string | undefined = detectedClubGroupId || existingBackupEntry?.clubGroupId;
          let clubDeltaMinutes = 0;

          let updated = list.map((t: any) => {
            if (checkMatch(t.id, t.title, t.cleanTitle, t.chapterName, t.subjectCode, t.due || t.taskDate)) {
              hasUpdated = true;
              if (t.id) matchedTaskIds.add(t.id);
              const tClubId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^|\n\r]+)/i)?.[1]?.trim();
              if (tClubId) affectedClubGroupId = tClubId;

              let cleanNotes = t.notes || '';
              if (isCompleted) {
                cleanNotes = cleanNotes.replace(/STATUS:\s*UNACHIEVED/gi, '').trim();
              }

              const taskOrigDur = Number(t.originalTargetDurationMinutes) || Number(t.targetDurationMinutes) || Number(t.targetDuration) || Number(t.duration) || detectedScheduledMinutes;
              const isTaskMetWithinDuration = false;

              if (isCompleted && isTaskMetWithinDuration) {
                const origDur = taskOrigDur;
                clubDeltaMinutes = actualAchievedMinutes - origDur;
                cleanNotes = cleanNotes
                  .replace(/TargetDurationMinutes:\s*\d+/gi, `TargetDurationMinutes: ${actualAchievedMinsOrDefault(actualAchievedMinutes)}`)
                  .trim();
                if (!/TargetDurationMinutes:/i.test(cleanNotes)) {
                  cleanNotes = cleanNotes
                    ? `${cleanNotes}\nTargetDurationMinutes: ${actualAchievedMinutes}`
                    : `TargetDurationMinutes: ${actualAchievedMinutes}`;
                }
                return {
                  ...t,
                  status: newStatus,
                  notes: cleanNotes,
                  completed: completionIso || undefined,
                  originalTargetDurationMinutes: origDur,
                  earlyCompletionSavedMinutes: Math.max(0, origDur - actualAchievedMinutes),
                  targetDurationMinutes: actualAchievedMinutes,
                  targetDuration: actualAchievedMinutes,
                  durationMinutes: actualAchievedMinutes,
                  duration: actualAchievedMinutes,
                  clubAllocationBasis: tClubId ? 'custom_adjusted' : t.clubAllocationBasis
                };
              } else if (!isCompleted) {
                const origDur =
                  Number(t.originalTargetDurationMinutes) ||
                  existingBackupEntry?.originalTargetDurationMinutes ||
                  0;
                if (origDur > 0) {
                  restoredDurationOnUndo = origDur;
                  const currentDur = t.targetDurationMinutes !== undefined
                    ? Number(t.targetDurationMinutes)
                    : t.duration !== undefined
                      ? Number(t.duration)
                      : origDur;
                  clubDeltaMinutes = origDur - currentDur;
                  cleanNotes = cleanNotes
                    .replace(/TargetDurationMinutes:\s*\d+/gi, `TargetDurationMinutes: ${origDur}`)
                    .trim();
                  const {
                    originalTargetDurationMinutes: _otd,
                    earlyCompletionSavedMinutes: _ecs,
                    ...restTask
                  } = t;
                  return {
                    ...restTask,
                    status: newStatus,
                    notes: cleanNotes,
                    completed: undefined,
                    targetDurationMinutes: origDur,
                    targetDuration: origDur,
                    durationMinutes: origDur,
                    duration: origDur
                  };
                }
              }

              return {
                ...t,
                status: newStatus,
                notes: cleanNotes,
                completed: completionIso || undefined
              };
            }
            return t;
          });

          // If the task belongs to a clubbed batch and its duration changed via completion within target or undo,
          // update clubTotalMinutes to the sum of peers WITHOUT enlarging any peer's individual targetDurationMinutes!
          if (affectedClubGroupId && clubDeltaMinutes !== 0) {
            const groupPeers = updated.filter((p: any) => {
              const pClubId = p.clubGroupId || (p.notes || '').match(/ClubGroupId:\s*([^|\n\r]+)/i)?.[1]?.trim();
              return pClubId === affectedClubGroupId && p.status !== 'unachieved';
            });
            if (groupPeers.length > 0) {
              const newClubSum = groupPeers.reduce(
                (acc: number, p: any) => {
                  const pDur = p.targetDurationMinutes !== undefined
                    ? Number(p.targetDurationMinutes)
                    : p.duration !== undefined
                      ? Number(p.duration)
                      : 30;
                  return acc + Math.max(0, isNaN(pDur) ? 30 : pDur);
                },
                0
              );
              const anyPeerStillEarlyAdjusted = groupPeers.some(
                (p: any) => Number(p.earlyCompletionSavedMinutes) > 0 || p.status === 'completed'
              );
              updated = updated.map((p: any) => {
                const pClubId = p.clubGroupId || (p.notes || '').match(/ClubGroupId:\s*([^|\n\r]+)/i)?.[1]?.trim();
                if (pClubId !== affectedClubGroupId) return p;
                const origClubTot = Number(p.originalClubTotalMinutes) || Number(p.clubTotalMinutes) || newClubSum;
                const updatedNotes = (p.notes || '').replace(
                  /ClubTotalMinutes:\s*\d+/gi,
                  `ClubTotalMinutes: ${newClubSum}`
                );
                if (anyPeerStillEarlyAdjusted) {
                  return {
                    ...p,
                    originalClubTotalMinutes: origClubTot,
                    clubTotalMinutes: newClubSum,
                    clubAllocationBasis: 'custom_adjusted',
                    notes: updatedNotes
                  };
                } else {
                  const { originalClubTotalMinutes: _oct, ...restPeer } = p;
                  return {
                    ...restPeer,
                    clubTotalMinutes: origClubTot,
                    notes: (p.notes || '').replace(
                      /ClubTotalMinutes:\s*\d+/gi,
                      `ClubTotalMinutes: ${origClubTot}`
                    )
                  };
                }
              });
            }
          }

          if (!hasUpdated && isCompleted && (task.id || task.title || task.cleanTitle)) {
            const alreadyExists = updated.some((t: any) => {
              const tDate = (t.due || t.taskDate || '').split('T')[0];
              if (effectiveDate && tDate && tDate !== effectiveDate) return false;
              const nTitle = normalizeKey(t.title);
              const nClean = normalizeKey(t.cleanTitle || t.title);
              return (titleNorm && nTitle === titleNorm) || (cleanNorm && nClean === cleanNorm);
            });
            if (!alreadyExists) {
              const generatedId = task.id || `task_${Date.now()}`;
              matchedTaskIds.add(generatedId);
              const baseNotes = task.notes || '';
              const finalNotes = explicitMilestoneId && !/MilestoneId:/i.test(baseNotes)
                ? `${baseNotes ? `${baseNotes}\n` : ''}MilestoneId: ${explicitMilestoneId}`
                : baseNotes;
              updated.unshift({
                id: generatedId,
                title: task.title || task.cleanTitle || 'Target',
                cleanTitle: task.cleanTitle || task.title || 'Target',
                subjectCode: subCode || getDefaultSubjectForLevel(activeLevel),
                chapterName: task.chapterName,
                milestoneId: explicitMilestoneId,
                revKey: options?.revKey || task.revKey,
                phaseId: options?.phaseId || task.phaseId,
                notes: finalNotes || undefined,
                status: 'completed',
                completed: completionIso,
                due: effectiveDate ? `${effectiveDate}T12:00:00.000Z` : new Date().toISOString(),
                created: new Date().toISOString(),
                ...(isEarlyCompletion
                  ? {
                      originalTargetDurationMinutes: detectedScheduledMinutes,
                      earlyCompletionSavedMinutes: earlySavedMinutes,
                      targetDurationMinutes: actualAchievedMinutes,
                      duration: actualAchievedMinutes
                    }
                  : {})
              });
            }
          }

          localStorage.setItem(storageKey, JSON.stringify(updated));
          if (storageKey === scopedLocalTasksKey) {
            localStorage.setItem(scopedBackupTasksKey, JSON.stringify(updated));
          }
        }
      }
    });

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user' && matchedTaskIds.size > 0) {
      await Promise.all(
        Array.from(matchedTaskIds).map(async (tId) => {
          try {
            const docRef = firestoreDoc(db, 'users', currentUser.uid, 'tasks', tId);
            await setDoc(docRef, {
              status: newStatus,
              completed: completionIso || null,
              caLevel: activeLevel
            }, { merge: true });
          } catch (err) {
            console.warn(`Could not sync task ${tId} completion to Firestore:`, err);
          }
        })
      );
    }
  } catch (e) {
    console.error('Error syncing task stores:', e);
  }

  // 2. Synchronize in Target Flow (practca_target_flow & date-scoped flow)
  try {
    const flowKeys = [getLevelScopedKey('practca_target_flow', activeLevel)];
    if (effectiveDate) flowKeys.push(getLevelScopedKey(`practca_target_flow_${effectiveDate}`, activeLevel));
    flowKeys.forEach(fKey => {
      const rawFlow = localStorage.getItem(fKey);
      if (!rawFlow) return;
      const flow = JSON.parse(rawFlow);
      if (!Array.isArray(flow)) return;
      let changed = false;
      const updatedFlow = flow.map((f: any) => {
        if (checkMatch(f.taskId || f.id, f.title, f.cleanTitle, f.chapterName, f.subjectCode, f.dueDate)) {
          changed = true;
          if (isCompleted && isEarlyCompletion) {
            const origF = Number(f.originalDurationMinutes || f.targetDurationMinutes || f.duration) || detectedScheduledMinutes;
            return {
              ...f,
              status: 'completed' as const,
              completedAt: completionIso,
              originalDurationMinutes: origF,
              duration: actualAchievedMinutes,
              targetDurationMinutes: actualAchievedMinutes,
              allocatedMinutes: actualAchievedMinutes
            };
          } else if (!isCompleted && (restoredDurationOnUndo > 0 || f.originalDurationMinutes)) {
            const restoreF = Number(f.originalDurationMinutes) || restoredDurationOnUndo;
            const { originalDurationMinutes: _od, ...restF } = f;
            return {
              ...restF,
              status: 'pending' as const,
              completedAt: undefined,
              duration: restoreF,
              targetDurationMinutes: restoreF
            };
          }
          return {
            ...f,
            status: isCompleted ? ('completed' as const) : ('pending' as const),
            completedAt: completionIso
          };
        }
        return f;
      });
      if (changed) {
        localStorage.setItem(fKey, JSON.stringify(updatedFlow));
      }
    });
  } catch (e) {
    console.error('Error syncing target flow:', e);
  }

  // 3. Synchronize 24-Hour Target Clocks (including Early Completion slot adjustment & Undo restoration to older slot)
  const slotsBackupList: EarlyCompletionSlotBackup[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && isClockSlotsStorageKeyForLevel(key, activeLevel)) {
        const clockDate = parseClockSlotsDateFromKey(key, activeLevel);
        if (effectiveDate && clockDate !== effectiveDate) continue;
        const rawClock = localStorage.getItem(key);
        if (rawClock) {
          const slots = JSON.parse(rawClock);
          if (Array.isArray(slots)) {
            let changed = false;
            const now = new Date();
            const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const isPast = clockDate < todayStr;

            // Strictly skip retrospective alterations on past dates
            if (isPast) continue;

            const matchingIndices: number[] = [];
            slots.forEach((s: any, idx: number) => {
              const isClubBatchSlot = String(s.id || '').includes('_club_') || /^batch\s*\d*\s*\(/i.test(String(s.title || ''));
              if (isClubBatchSlot) return;
              if (checkMatch(s.targetId, s.title, s.title, s.chapterName, s.subjectCode, clockDate)) {
                matchingIndices.push(idx);
              }
            });

            if (matchingIndices.length > 0 || !isCompleted) {
              changed = true;
              const restoredSlotIds = new Set<string>();

              let intermediateSlots: any[] = [];

              if (isCompleted) {
                slots.forEach((s: any, idx: number) => {
                  const isMatch = matchingIndices.includes(idx);
                  if (!isMatch) {
                    intermediateSlots.push(s);
                    return;
                  }
                  intermediateSlots.push({
                    ...s,
                    status: 'completed' as const
                  });
                });
              } else {
                // Undoing completion: restore target prospectively after the restriction mark
                const backupSlot = existingBackupEntry?.slotsBackup?.find(b =>
                  b.slotId && slots.some((s: any) => String(s.id || '') === b.slotId)
                );
                const restoredDur = Number(backupSlot?.originalDurationMinutes ?? restoredDurationOnUndo ?? 60);

                const existingMatch = slots.find((s: any, idx: number) => matchingIndices.includes(idx));
                if (existingMatch) {
                  intermediateSlots = slots.map((s: any, idx: number) => {
                    if (matchingIndices.includes(idx)) {
                      restoredSlotIds.add(String(s.id || ''));
                      const { originalStartMinutes: _osm, originalEndMinutes: _oem, originalDurationMinutes: _odm, earlySavedMinutes: _esm, ...rest } = s;
                      return {
                        ...rest,
                        status: 'pending' as const
                      };
                    }
                    return s;
                  });
                } else {
                  // Slot had moved upon completion, add it back prospectively after restrictionMark
                  const boundary = getProspectiveRestrictionMark(slots, clockDate);
                  const gap = findRealisticGapOnClock(slots, restoredDur, boundary, boundary, clockDate);
                  const restoredSlotId = `slot_restored_${Date.now()}`;
                  restoredSlotIds.add(restoredSlotId);
                  intermediateSlots = [
                    ...slots,
                    {
                      id: restoredSlotId,
                      targetId: task.id || task.cleanTitle || task.title,
                      title: task.cleanTitle || task.title,
                      chapterName: task.chapterName,
                      subjectCode: (task.subjectCode || getDefaultSubjectForLevel(activeLevel)) as SubjectId,
                      relevance: (task.relevance || 'Revision') as any,
                      startTime: minutesToClockTime(gap.startMinutes),
                      endTime: minutesToClockTime(gap.endMinutes % 1440),
                      startMinutes: gap.startMinutes,
                      endMinutes: gap.endMinutes,
                      durationMinutes: Math.max(1, gap.endMinutes - gap.startMinutes),
                      status: 'pending' as const
                    }
                  ];
                }
              }

              // All automated system adjustments must be prospective to restriction mark
              // and must not disturb past or currently running tasks
              const updatedSlots = cascadeClockSlotsForDate(intermediateSlots, restoredSlotIds, clockDate);

              if (changed) {
                localStorage.setItem(key, JSON.stringify(updatedSlots));
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error syncing 24h target clocks:', e);
  }

  // Persist or clean up EarlyCompletionBackupEntry & practca_task_target_durations
  try {
    const durationTargetKeys = [
      task.id,
      task.cleanTitle,
      task.title,
      cleanNorm,
      titleNorm,
      ...Array.from(matchedTaskIds)
    ].filter((k): k is string => Boolean(k && k.trim().length > 0));

    if (isCompleted && isEarlyCompletion) {
      durationTargetKeys.forEach(k => {
        durationsMap[k] = actualAchievedMinutes;
      });
      localStorage.setItem(scopedDurationsKey, JSON.stringify(durationsMap));

      backupMap[backupKey] = {
        taskId: task.id || Array.from(matchedTaskIds)[0],
        normTitle: cleanNorm || titleNorm,
        date: effectiveDate || '',
        originalTargetDurationMinutes: detectedScheduledMinutes,
        adjustedDurationMinutes: actualAchievedMinutes,
        savedMinutes: earlySavedMinutes,
        clubGroupId: detectedClubGroupId,
        originalClubTotalMinutes: detectedOriginalClubTotal,
        slotsBackup: slotsBackupList,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(scopedEarlyBackupKey, JSON.stringify(backupMap));

      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: {
          date: effectiveDate,
          taskDurations: durationsMap,
          removedTargetNames: [],
          earlyCompletionAdjusted: true,
          savedMinutes: earlySavedMinutes
        }
      }));
    } else if (!isCompleted && restoredDurationOnUndo > 0) {
      durationTargetKeys.forEach(k => {
        durationsMap[k] = restoredDurationOnUndo;
      });
      localStorage.setItem(scopedDurationsKey, JSON.stringify(durationsMap));

      delete backupMap[backupKey];
      Object.keys(backupMap).forEach(k => {
        const b = backupMap[k];
        if (
          (!effectiveDate || b.date === effectiveDate) &&
          ((targetIdNorm && b.taskId && b.taskId.toLowerCase() === targetIdNorm) ||
           (cleanNorm && b.normTitle === cleanNorm))
        ) {
          delete backupMap[k];
        }
      });
      localStorage.setItem(scopedEarlyBackupKey, JSON.stringify(backupMap));

      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: {
          date: effectiveDate,
          taskDurations: durationsMap,
          removedTargetNames: [],
          undoCompletionRestored: true,
          restoredMinutes: restoredDurationOnUndo
        }
      }));
    }
  } catch (e) {}

  // 4. Synchronize Active Focus Task
  try {
    const scopedAftKey = getLevelScopedKey('practca_active_focus_task', activeLevel);
    const rawAft = localStorage.getItem(scopedAftKey);
    if (rawAft) {
      const aft = JSON.parse(rawAft);
      if (checkMatch((aft as any).id, aft.title, (aft as any).cleanTitle, (aft as any).chapterName, (aft as any).subjectCode)) {
        if (isCompleted) {
          localStorage.removeItem(scopedAftKey);
        } else {
          aft.completed = false;
          if (restoredDurationOnUndo > 0) {
            aft.targetDurationMinutes = restoredDurationOnUndo;
          }
          localStorage.setItem(scopedAftKey, JSON.stringify(aft));
        }
      }
    }
  } catch (e) {}

  // 5. Synchronize RevisionPlanner chapters & revision logs (+ persist to Firestore)
  // Strictly skip Revision Report synchronization for Mock Tests, MCQ Practice, Digital Study Blocks, and non-Revision-Report items!
  if (!isMockTestTask(task) && !isNonRevisionReportActivity(task) && (task as any).revKey !== 'none' && (options?.revKey as any) !== 'none') {
    try {
      const detectedSub = subCode || findSubjectForChapter(task.chapterName || task.cleanTitle || task.title, activeLevel);
      const subToSync: SubjectId[] = detectedSub ? [detectedSub] : [];
      const currentUser = auth.currentUser;
      const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');

      const searchTargets = [chapNorm, cleanNorm, titleNorm].filter(s => s && s.length > 0);

      if (searchTargets.length > 0) {
      for (const subId of subToSync) {
        const localKey = getLevelScopedKey(`practca_revision_planner_${subId}`, activeLevel);
        const stored = localStorage.getItem(localKey);
        const parsed = stored ? JSON.parse(stored) : { revisionsCount: 3, chapters: {} };
        const chaptersObj = parsed.chapters || {};
        const matchedChapter: string | undefined = resolveTargetChapterForSubject(
          subId,
          task.chapterName,
          task.cleanTitle || task.title,
          task.notes
        ) || undefined;

        if (matchedChapter) {
          const dynamicRevsCount = computeSubjectMilestoneRevisionCount(subId, chaptersObj);
          const dynamicRevKeys = getSubjectDynamicRevKeys(dynamicRevsCount);
          const allStageKeys = ['baseline', ...dynamicRevKeys, 'rev1.5'];

          const defaultStageMap: Record<string, { completed: boolean; hours: string; completedAt?: string; isManualDateOverride?: boolean }> = {};
          allStageKeys.forEach(sk => {
            defaultStageMap[sk] = { completed: false, hours: '' };
          });

          const currentCycles = {
            ...defaultStageMap,
            ...(chaptersObj[matchedChapter] || {})
          };

          const resolvedActiveRev = resolveActiveRevisionForChapter(subId, matchedChapter, {
            revKey: options?.revKey || task.revKey,
            relevance: task.relevance,
            title: task.cleanTitle || task.title,
            notes: task.notes,
            milestoneId: options?.milestoneId || task.milestoneId,
            chaptersStateOverride: {
              ...chaptersObj,
              [matchedChapter]: currentCycles
            }
          });

          let cycleUpdated: string | null = resolvedActiveRev.key;

          const fallbackDate = effectiveDate || new Date().toISOString().split('T')[0];

          if (isCompleted) {
            if (!cycleUpdated) {
              cycleUpdated = resolvedActiveRev.key || dynamicRevKeys[dynamicRevKeys.length - 1] || 'rev1';
            }

            // Mark any uncompleted prior cycles before cycleUpdated in dynamicRevKeys as skipped
            const targetRevIndex = dynamicRevKeys.indexOf(cycleUpdated);
            if (targetRevIndex > 0) {
              for (let i = 0; i < targetRevIndex; i++) {
                const priorRk = dynamicRevKeys[i];
                const priorState = currentCycles[priorRk];
                if (!priorState?.completed) {
                  currentCycles[priorRk] = {
                    ...priorState,
                    completed: false,
                    skipped: true,
                    statusTag: 'skipped',
                    hours: priorState?.hours || '0'
                  };
                }
              }
            }

            const resolvedCompletionDate = resolveLatestLogCompletionDate(
              subId,
              matchedChapter,
              cycleUpdated,
              undefined,
              fallbackDate
            );

            const existingState = currentCycles[cycleUpdated] || { completed: false, hours: '' };
            const existingHoursNum = parseFloat(existingState.hours || '0') || 0;

            // Check actual logged study time across revision logs, focus sessions, and pomo logs
            let loggedMinutesForChapter = 0;
            try {
              const rawRevLogs = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs', activeLevel));
              const revLogs: any[] = rawRevLogs ? JSON.parse(rawRevLogs) : [];
              for (const l of revLogs) {
                if (
                  l.subjectId === subId &&
                  getCanonicalChapterKey(subId, l.chapterName) === matchedChapter &&
                  (!cycleUpdated || l.revKey === cycleUpdated || l.revisionNumber === cycleUpdated)
                ) {
                  loggedMinutesForChapter += Number(l.durationMinutes) || (parseFloat(l.hours || '0') * 60) || 0;
                }
              }
            } catch (e) {}

            try {
              const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', activeLevel));
              const focusSessions: any[] = rawFocus ? JSON.parse(rawFocus) : [];
              const normTargetTitle = normalizeStr(task.cleanTitle || task.title || '');
              const normChap = normalizeStr(matchedChapter);
              for (const s of focusSessions) {
                const sDesc = normalizeStr(s.description || '');
                const sChap = normalizeStr(s.chapterName || '');
                if ((normChap && sChap === normChap) || (normTargetTitle && sDesc && (sDesc.includes(normTargetTitle) || normTargetTitle.includes(sDesc)))) {
                  loggedMinutesForChapter += Number(s.duration) || 0;
                }
              }
            } catch (e) {}

            const hasExistingTime = existingHoursNum > 0 || loggedMinutesForChapter > 0;
            const isSkippedRequest = Boolean(options?.skipped);
            const isLmrOrExplicitRev =
              cycleUpdated === 'baseline' ||
              /^rev\d+$/.test(cycleUpdated || '') ||
              cycleUpdated === 'rev1.5' ||
              task.revKey === 'rev1.5' ||
              task.relevance === 'Final Revision' ||
              options?.revKey === 'rev1.5';

            // Toggle Revision Report stage to completed when there is actual study time logged, resolved baseline/rev cycle, or Milestone Closure skip
            if (hasExistingTime || isSkippedRequest || isLmrOrExplicitRev) {
              const isSkipped = isSkippedRequest && !hasExistingTime;
              const isPartiallyDone = isSkippedRequest && hasExistingTime;
              const resolvedHoursStr = existingHoursNum > 0
                ? existingState.hours
                : loggedMinutesForChapter > 0
                  ? (loggedMinutesForChapter / 60).toFixed(1)
                  : isSkipped
                    ? '0'
                    : (existingState.hours || '');

              currentCycles[cycleUpdated] = {
                ...existingState,
                completed: true,
                skipped: isSkipped,
                partiallyDone: isPartiallyDone || (!isSkipped && existingState.partiallyDone),
                statusTag: isSkipped ? 'skipped' : (isPartiallyDone ? 'partially_done' : 'completed'),
                hours: resolvedHoursStr,
                completedAt: resolvedCompletionDate
              };
            }
          } else {
            if (cycleUpdated && currentCycles[cycleUpdated]) {
              const existingH = parseFloat(currentCycles[cycleUpdated]?.hours || '0') || 0;
              currentCycles[cycleUpdated] = {
                ...currentCycles[cycleUpdated],
                completed: false,
                completedAt: null,
                isManualDateOverride: false,
                skipped: false,
                partiallyDone: existingH > 0,
                statusTag: existingH > 0 ? 'partially_done' : null
              };
            } else {
              const searchOrder = ['rev1.5', ...[...dynamicRevKeys].reverse(), 'baseline'];
              for (const rk of searchOrder) {
                if (currentCycles[rk]?.completed || currentCycles[rk]?.statusTag === 'completed') {
                  const existingH = parseFloat(currentCycles[rk]?.hours || '0') || 0;
                  currentCycles[rk] = {
                    ...currentCycles[rk],
                    completed: false,
                    completedAt: null,
                    isManualDateOverride: false,
                    skipped: false,
                    partiallyDone: existingH > 0,
                    statusTag: existingH > 0 ? 'partially_done' : null
                  };
                  cycleUpdated = rk;
                  break;
                }
              }
            }
          }

          const finalRevisionsCount = computeSubjectMilestoneRevisionCount(subId, {
            ...chaptersObj,
            [matchedChapter]: currentCycles
          });

          chaptersObj[matchedChapter] = currentCycles;
          parsed.chapters = chaptersObj;
          parsed.revisionsCount = finalRevisionsCount;
          localStorage.setItem(localKey, JSON.stringify(parsed));

          if (isRealUser && currentUser) {
            try {
              const revDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subId, activeLevel));
              await setDoc(revDocRef, {
                subjectId: subId,
                caLevel: activeLevel,
                revisionsCount: finalRevisionsCount,
                chapters: chaptersObj,
                updatedAt: new Date().toISOString()
              }, { merge: true });
            } catch (err) {
              console.warn(`Could not sync RevisionPlanner ${subId} to Firestore:`, err);
            }
          }

          // Clean up synthetic revlog_ entries on uncomplete; never fabricate fake 60-minute logs when time is 0
          try {
            if (!isCompleted && cycleUpdated) {
              const scopedRevLogsKey = getLevelScopedKey('practca_revision_planner_logs', activeLevel);
              const rawLogs = localStorage.getItem(scopedRevLogsKey);
              const logsList: any[] = rawLogs ? JSON.parse(rawLogs) : [];
              const filtered = logsList.filter(l =>
                !(
                  l.subjectId === subId &&
                  l.chapterName === matchedChapter &&
                  (l.revKey === cycleUpdated || l.revisionNumber === cycleUpdated) &&
                  String(l.id || '').startsWith('revlog_')
                )
              );
              localStorage.setItem(scopedRevLogsKey, JSON.stringify(filtered));
            }
          } catch (logErr) {
            console.warn('Could not sync revision planner logs:', logErr);
          }
        }
      }
    }
    } catch (revErr) {
      console.error('Error syncing RevisionPlanner:', revErr);
    }
  }

  // 5b. Synchronize Roadmap & Milestone Checkpoints (practca_roadmap_user_checkpoints & practca_prep_roadmap_revisions_v2) + Firestore
  try {
    const searchTargets = [chapNorm, cleanNorm, titleNorm].filter(s => s && s.length > 0);
    const currentUser = auth.currentUser;
    const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');

    const scopedCheckpointsKey = getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel);
    const scopedCheckpointsV3Key = getLevelScopedKey('practca_roadmap_checkpoints_v3', activeLevel);
    const scopedMasterDatesKey = getLevelScopedKey('practca_roadmap_master_dates', activeLevel);
    const scopedExamDateKey = getLevelScopedKey('practca_exam_date', activeLevel);
    const rawCheckpoints = localStorage.getItem(scopedCheckpointsKey);
    if (rawCheckpoints && searchTargets.length > 0) {
      const parsedCheckpoints = JSON.parse(rawCheckpoints);
      if (Array.isArray(parsedCheckpoints)) {
        let cpChanged = false;

        // Sort checkpoints chronologically to determine which single milestone should receive this chapter completion
        const sortedByDate = [...parsedCheckpoints].sort((a: any, b: any) =>
          String(a.targetDate || '').localeCompare(String(b.targetDate || ''))
        );

        let targetCpIdToUpdate: string | null = explicitMilestoneId || null;

        const rawSearchTargets = [task.chapterName, task.cleanTitle, task.title].filter((s): s is string => Boolean(s && s.trim().length > 0));
        const effectiveTargets = rawSearchTargets.length > 0 ? rawSearchTargets : searchTargets;

        if (!targetCpIdToUpdate) {
          // Find all checkpoints that match the subject and contain the exact resolved chapter
          const matchingCps = sortedByDate.filter((cp: any) => {
            if (subCode && cp.subjectId && cp.subjectId !== 'CUSTOM' && String(cp.subjectId).toUpperCase() !== subCode.toUpperCase()) {
              return false;
            }
            const candidateChapters: string[] = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
              ? cp.selectedChapters
              : (cp.subjectId && cp.subjectId !== 'CUSTOM' ? (SUBJECT_CHAPTERS[cp.subjectId as SubjectId] || []) : []);
            return Boolean(resolveExactOrBestChapterMatch(candidateChapters, effectiveTargets, cp.subjectId || subCode));
          });

          if (matchingCps.length === 1) {
            targetCpIdToUpdate = matchingCps[0].id;
          } else if (matchingCps.length > 1) {
            if (effectiveDate) {
              for (let i = 0; i < matchingCps.length; i++) {
                const cp = matchingCps[i];
                if (i === 0) {
                  const windowStart = cp.startDate || '0000-01-01';
                  if (effectiveDate >= windowStart && effectiveDate <= cp.targetDate) {
                    targetCpIdToUpdate = cp.id;
                    break;
                  }
                } else {
                  const prevTargetDate = matchingCps[i - 1].targetDate || '';
                  if (prevTargetDate && effectiveDate > prevTargetDate && effectiveDate <= cp.targetDate) {
                    targetCpIdToUpdate = cp.id;
                    break;
                  }
                }
              }
            }
            if (!targetCpIdToUpdate) {
              if (isCompleted) {
                const firstIncomplete = matchingCps.find((cp: any) => {
                  const candidateChapters: string[] = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
                    ? cp.selectedChapters
                    : (cp.subjectId && cp.subjectId !== 'CUSTOM' ? (SUBJECT_CHAPTERS[cp.subjectId as SubjectId] || []) : []);
                  const matchedChap = resolveExactOrBestChapterMatch(candidateChapters, effectiveTargets, cp.subjectId || subCode);
                  const doneSet = new Set<string>(Array.isArray(cp.completedChapters) ? cp.completedChapters : []);
                  return matchedChap ? !doneSet.has(matchedChap) : false;
                });
                targetCpIdToUpdate = firstIncomplete ? firstIncomplete.id : matchingCps[0].id;
              } else {
                const reversed = [...matchingCps].reverse();
                const lastCompleted = reversed.find((cp: any) => {
                  const candidateChapters: string[] = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
                    ? cp.selectedChapters
                    : (cp.subjectId && cp.subjectId !== 'CUSTOM' ? (SUBJECT_CHAPTERS[cp.subjectId as SubjectId] || []) : []);
                  const matchedChap = resolveExactOrBestChapterMatch(candidateChapters, effectiveTargets, cp.subjectId || subCode);
                  const doneSet = new Set<string>(Array.isArray(cp.completedChapters) ? cp.completedChapters : []);
                  return matchedChap ? doneSet.has(matchedChap) : false;
                });
                targetCpIdToUpdate = lastCompleted ? lastCompleted.id : matchingCps[0].id;
              }
            }
          }
        }

        const updatedCheckpoints = parsedCheckpoints.map((cp: any) => {
          const isTargetCp = Boolean(targetCpIdToUpdate && cp.id === targetCpIdToUpdate);
          if (!isTargetCp && (isCompleted || explicitMilestoneId)) {
            return cp;
          }
          if (subCode && cp.subjectId && cp.subjectId !== 'CUSTOM' && String(cp.subjectId).toUpperCase() !== subCode.toUpperCase()) {
            return cp;
          }
          const candidateChapters: string[] = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
            ? cp.selectedChapters
            : (cp.subjectId && cp.subjectId !== 'CUSTOM' ? (SUBJECT_CHAPTERS[cp.subjectId as SubjectId] || []) : []);

          const matchedChap = resolveExactOrBestChapterMatch(candidateChapters, effectiveTargets, cp.subjectId || subCode);

          if (!matchedChap) return cp;

          const completedSet = new Set<string>(Array.isArray(cp.completedChapters) ? cp.completedChapters : []);
          let nextCompleted = cp.completed;
          let nextMockTestCompleted = cp.mockTestCompleted;

          if (isCompleted && isTargetCp && !completedSet.has(matchedChap)) {
            completedSet.add(matchedChap);
            cpChanged = true;
          } else if (!isCompleted && completedSet.has(matchedChap)) {
            completedSet.delete(matchedChap);
            cpChanged = true;
            nextCompleted = undefined;
            nextMockTestCompleted = false;
          }

          return {
            ...cp,
            completedChapters: Array.from(completedSet),
            completed: nextCompleted,
            mockTestCompleted: nextMockTestCompleted
          };
        });

        if (cpChanged) {
          localStorage.setItem(scopedCheckpointsKey, JSON.stringify(updatedCheckpoints));
          localStorage.setItem(scopedCheckpointsV3Key, JSON.stringify(updatedCheckpoints));
          if (isRealUser && currentUser) {
            try {
              const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('roadmap', activeLevel));
              const datesRaw = localStorage.getItem(scopedMasterDatesKey);
              const dates = datesRaw ? JSON.parse(datesRaw) : {};
              await setDoc(roadmapDocRef, {
                caLevel: activeLevel,
                checkpoints: updatedCheckpoints,
                prepStartDate: dates.prepStartDate || new Date().toISOString().split('T')[0],
                examDate: dates.examDate || localStorage.getItem(scopedExamDateKey) || getDefaultExamDateForLevel(activeLevel),
                updatedAt: new Date().toISOString()
              }, { merge: true });
            } catch (err) {
              console.warn('Could not sync roadmap checkpoints to Firestore:', err);
            }
          }
        }

        // Check if the completed task is linked to a Final Revision / Final Sprint milestone
        if (isCompleted) {
          const matchedCp = updatedCheckpoints.find((cp: any) =>
            (targetCpIdToUpdate && cp.id === targetCpIdToUpdate) ||
            (explicitMilestoneId && cp.id === explicitMilestoneId)
          );
          if (matchedCp) {
            const cpCycle = String(matchedCp.revisionCycle || '');
            const cpTitle = String(matchedCp.customTitle || '');
            const cpId = String(matchedCp.id || '');
            if (
              cpCycle === 'Final Sprint' ||
              cpId.startsWith('cp_final_sprint_') ||
              /final\s*revision|final\s*sprint|1\.5[-\s]*day|1\.5\s*sprint/i.test(`${cpCycle} ${cpTitle}`)
            ) {
              triggerFinalRevisionConfetti({
                taskTitle: task.cleanTitle || task.title || task.chapterName,
                subjectCode: subCode || (matchedCp.subjectId !== 'CUSTOM' ? matchedCp.subjectId : undefined),
                milestoneTitle: matchedCp.customTitle || `${matchedCp.subjectId} Final Revision`
              });
            }
          }
        }
      }
    }

    const scopedPrepRevisionsKey = getLevelScopedKey('practca_prep_roadmap_revisions_v2', activeLevel);
    const rawPrepRevisions = localStorage.getItem(scopedPrepRevisionsKey);
    if (rawPrepRevisions && searchTargets.length > 0) {
      const parsedRevisions = JSON.parse(rawPrepRevisions);
      if (Array.isArray(parsedRevisions)) {
        let revChanged = false;
        const targetSubs: SubjectId[] = subCode ? [subCode] : getLevelSubjectIds(activeLevel);
        const explicitPhaseId = options?.phaseId || task.phaseId || (
          (options?.revKey || task.revKey) === 'rev1' ? 'rev_1' :
          (options?.revKey || task.revKey) === 'rev2' ? 'rev_2' :
          (options?.revKey || task.revKey) === 'rev3' ? 'rev_3' : undefined
        );
        const rawSearchTargets = [task.chapterName, task.cleanTitle, task.title].filter((s): s is string => Boolean(s && s.trim().length > 0));
        const effectiveTargets = rawSearchTargets.length > 0 ? rawSearchTargets : searchTargets;

        targetSubs.forEach(sId => {
          const chList = SUBJECT_CHAPTERS[sId] || [];
          const matchedChap = resolveExactOrBestChapterMatch(chList, effectiveTargets, sId);
          if (!matchedChap) return;

          // Find which single revision phase should be updated for this subject & chapter
          let phaseIdxToUpdate = -1;
          if (explicitPhaseId) {
            phaseIdxToUpdate = parsedRevisions.findIndex((p: any) => p.id === explicitPhaseId);
          }
          if (phaseIdxToUpdate === -1) {
            if (isCompleted) {
              phaseIdxToUpdate = parsedRevisions.findIndex((p: any) => {
                const plan = p?.subjectPlans?.[sId];
                if (!plan) return false;
                const doneSet = new Set<string>(Array.isArray(plan.completedChapters) ? plan.completedChapters : []);
                return !doneSet.has(matchedChap);
              });
            } else {
              for (let idx = parsedRevisions.length - 1; idx >= 0; idx--) {
                const plan = parsedRevisions[idx]?.subjectPlans?.[sId];
                if (plan && Array.isArray(plan.completedChapters) && plan.completedChapters.includes(matchedChap)) {
                  phaseIdxToUpdate = idx;
                  break;
                }
              }
            }
          }

          if (phaseIdxToUpdate !== -1 && parsedRevisions[phaseIdxToUpdate]?.subjectPlans?.[sId]) {
            const phase = parsedRevisions[phaseIdxToUpdate];
            const plan = phase.subjectPlans[sId];
            const doneSet = new Set<string>(Array.isArray(plan.completedChapters) ? plan.completedChapters : []);
            if (isCompleted && !doneSet.has(matchedChap)) {
              doneSet.add(matchedChap);
              revChanged = true;
              parsedRevisions[phaseIdxToUpdate] = {
                ...phase,
                subjectPlans: {
                  ...phase.subjectPlans,
                  [sId]: { ...plan, completedChapters: Array.from(doneSet) }
                }
              };
            } else if (!isCompleted && doneSet.has(matchedChap)) {
              doneSet.delete(matchedChap);
              revChanged = true;
              parsedRevisions[phaseIdxToUpdate] = {
                ...phase,
                subjectPlans: {
                  ...phase.subjectPlans,
                  [sId]: { ...plan, completedChapters: Array.from(doneSet) }
                }
              };
            }
          }
        });

        if (revChanged) {
          localStorage.setItem(scopedPrepRevisionsKey, JSON.stringify(parsedRevisions));
          if (isRealUser && currentUser) {
            try {
              const prepRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('prep_roadmap_v2', activeLevel));
              await setDoc(prepRef, {
                caLevel: activeLevel,
                revisions: parsedRevisions,
                updatedAt: new Date().toISOString()
              }, { merge: true });
            } catch (err) {}
          }
        }
      }
    }
  } catch (roadmapErr) {
    console.warn('Error syncing Roadmap & Milestone states:', roadmapErr);
  }

  // 6. Synchronize Grind Clock logs (practca_pomo_logs)
  try {
    const scopedPomoLogsKey = getLevelScopedKey('practca_pomo_logs', activeLevel);
    const rawPomoLogs = localStorage.getItem(scopedPomoLogsKey);
    if (rawPomoLogs) {
      const logs = JSON.parse(rawPomoLogs);
      if (Array.isArray(logs)) {
        let changed = false;
        const updatedPomoLogs = logs.map((log: any) => {
          if (effectiveDate && log.date && log.date !== effectiveDate) {
            return log;
          }
          const logNote = (log.notes || '').toLowerCase();
          const logTitle = ((log as any).title || '').toLowerCase();
          const logChap = ((log as any).chapterName || '').toLowerCase();
          const logTaskId = (log as any).taskId;

          const isMatchingLog = Boolean(
            (targetIdNorm && logTaskId && logTaskId.trim().toLowerCase() === targetIdNorm) ||
            (cleanNorm && (logNote.includes(cleanNorm) || logTitle.includes(cleanNorm))) ||
            (titleNorm && (logNote.includes(titleNorm) || logTitle.includes(titleNorm))) ||
            (chapNorm && (logChap.includes(chapNorm) || logNote.includes(chapNorm)))
          );

          if (isMatchingLog) {
            changed = true;
            return {
              ...log,
              taskCompleted: isCompleted,
              completed: isCompleted,
              status: isCompleted ? 'completed' : 'in-progress'
            };
          }
          return log;
        });

        if (changed) {
          localStorage.setItem(scopedPomoLogsKey, JSON.stringify(updatedPomoLogs));
        }
      }
    }
  } catch (pomoErr) {
    console.error('Error syncing Grind Clock logs:', pomoErr);
  }

  // 7. Trigger Confetti if this completed task is a 'Final Revision' milestone task
  if (isCompleted) {
    const taskIdStr = String(task.id || '');
    const taskRel = String(task.relevance || '');
    const taskRevKey = String(options?.revKey || task.revKey || '');
    const taskPhaseId = String(options?.phaseId || task.phaseId || '');
    const combinedText = `${task.title || ''} ${task.cleanTitle || ''} ${task.notes || ''} ${explicitMilestoneId || ''}`;
    const isFinalRevisionTask =
      taskRel === 'Final Revision' ||
      taskRevKey === 'rev1.5' ||
      taskPhaseId === 'final_sprint' ||
      taskPhaseId === 'rev1.5' ||
      taskIdStr.startsWith('local-task-finalsprint-') ||
      /cp_final_sprint_|final\s*revision|final\s*sprint|1\.5[-\s]*day\s*final/i.test(combinedText);

    if (isFinalRevisionTask) {
      triggerFinalRevisionConfetti({
        taskTitle: task.cleanTitle || task.title || task.chapterName,
        subjectCode: subCode
      });
    }
  }

  // 8. Reconcile all 7 target systems for the effective date before firing global events
  try {
    reconcileAllTargetSystems(effectiveDate || new Date().toISOString().split('T')[0], {
      source: 'tasks',
      dispatchEvents: false
    });
  } catch (recErr) {
    console.warn('Error running targetReconciliationEngine:', recErr);
  }

  // 9. Fire Global Events and trigger unified Firestore re-fetch
  window.dispatchEvent(new CustomEvent('practca_task_completion_changed', {
    detail: { task, isCompleted, selectedDate: effectiveDate }
  }));
  window.dispatchEvent(new Event('practca_tasks_updated'));
  window.dispatchEvent(new Event('practca_target_clock_updated'));
  window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
  window.dispatchEvent(new Event('practca_flow_updated'));
  window.dispatchEvent(new Event('practca_pomo_logs_update'));
  window.dispatchEvent(new Event('practca_revision_update'));
  window.dispatchEvent(new Event('storage'));

  try {
    await forceRefetchTargetSystemFromFirestore({
      selectedDate: effectiveDate,
      bypassThrottle: true
    });
  } catch (refetchErr) {
    console.warn('Error forcing unified target system Firestore re-fetch:', refetchErr);
  }
}

/**
 * Returns the local hour (24-hour clock) at which a CA paper concludes on exam day:
 * - Foundation Paper 3 (MathStats) & Paper 4 (Econ): 16 (4:00 PM — 2-hour MCQ paper, 2:00 PM to 4:00 PM)
 * - Final Paper 6 (IBS): 18 (6:00 PM — 4-hour open-book case study paper, 2:00 PM to 6:00 PM)
 * - All other papers across Foundation, Intermediate & Final: 17 (5:00 PM — standard 3-hour paper, 2:00 PM to 5:00 PM)
 */
export function getExamConclusionHourForSubject(subjectId?: string | null): number {
  const norm = normalizeCaSubjectId(subjectId);
  if (norm === 'IBS') return 18;
  if (norm === 'MathStats' || norm === 'Econ') return 16;
  return 17;
}

/**
 * Automatically marks Final Exam Date milestones and all their sprint chapters as complete
 * when the current local time is on the exam date at/after conclusion hour (4:00 PM, 5:00 PM, or 6:00 PM)
 * or on any date after the exam date.
 */
export function autoCompleteFinalExamMilestonesAfter5PM(level?: CALevel): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const activeLevel = level || getSelectedCALevel();
    const levelSubIds = getLevelSubjectIds(activeLevel);
    const now = new Date();
    const yr = now.getFullYear();
    const mn = String(now.getMonth() + 1).padStart(2, '0');
    const dy = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yr}-${mn}-${dy}`;
    const currentHour = now.getHours();

    const scopedSubjectExamDatesKey = getLevelScopedKey('practca_subject_final_exam_dates', activeLevel);
    const scopedCheckpointsKey = getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel);
    const scopedCheckpointsV3Key = getLevelScopedKey('practca_roadmap_checkpoints_v3', activeLevel);
    const scopedExamDateKey = getLevelScopedKey('practca_exam_date', activeLevel);
    const scopedMasterDatesKey = getLevelScopedKey('practca_roadmap_master_dates', activeLevel);
    const scopedLocalTasksKey = getLevelScopedKey('practca_local_tasks', activeLevel);

    let subjectExamDates: Record<string, string> = {};
    try {
      const rawSubjectDates = localStorage.getItem(scopedSubjectExamDatesKey);
      if (rawSubjectDates) {
        const parsed = JSON.parse(rawSubjectDates);
        if (parsed && typeof parsed === 'object') {
          subjectExamDates = parsed;
        }
      }
    } catch {
      // ignore
    }

    const rawCheckpoints = localStorage.getItem(scopedCheckpointsKey);
    let parsedCheckpoints: any[] = [];
    if (rawCheckpoints) {
      try {
        const parsed = JSON.parse(rawCheckpoints);
        if (Array.isArray(parsed)) {
          parsedCheckpoints = parsed;
        }
      } catch {
        // ignore
      }
    }

    // Ensure every subject configured in practca_subject_final_exam_dates has a Final Sprint milestone entry
    levelSubIds.forEach((subId) => {
      const configuredDate = subjectExamDates[subId];
      if (!configuredDate || !/^\d{4}-\d{2}-\d{2}$/.test(configuredDate.trim())) return;
      const hasExistingSprint = parsedCheckpoints.some((cp: any) => {
        if (!cp) return false;
        const cpSub = normalizeCaSubjectId(cp.subjectId);
        if (cpSub !== subId) return false;
        const cpId = String(cp.id || '');
        const cpCycle = String(cp.revisionCycle || '');
        const cpTitle = String(cp.customTitle || '');
        return (
          cpId.startsWith('cp_final_sprint_') ||
          cpCycle === 'Final Sprint' ||
          /1\.5[-\s]*day|final\s*sprint/i.test(`${cpCycle} ${cpTitle}`)
        );
      });
      if (!hasExistingSprint) {
        const chaps = SUBJECT_CHAPTERS[subId] || [];
        const cleanTarget = configuredDate.trim();
        const isFirstPaper = subId === 'FR' || subId === 'AdvAcc' || subId === 'Accounts';
        const priorDates = Object.entries(subjectExamDates)
          .filter(([k, d]) => k !== subId && typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && d < cleanTarget)
          .map(([, d]) => d.trim())
          .sort();
        const shiftDate = (dStr: string, offsetDays: number) => {
          const [sy, sm, sd] = dStr.split('-').map(Number);
          const dt = new Date(sy, (sm || 1) - 1, (sd || 1) + offsetDays);
          return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        };
        const computedStartDate =
          !isFirstPaper && priorDates.length > 0
            ? priorDates[priorDates.length - 1]
            : shiftDate(cleanTarget, isFirstPaper ? -4 : -2);

        parsedCheckpoints.push({
          id: `cp_final_sprint_${subId}`,
          subjectId: subId,
          customTitle: `${subId} — 1.5-Day Final Sprint`,
          revisionCycle: 'Final Sprint',
          startDate: computedStartDate,
          targetDate: cleanTarget,
          targetChapters: chaps.length,
          selectedChapters: [...chaps],
          completedChapters: [],
          completed: false,
          completionCondition: 'targets_only'
        });
      }
    });

    if (parsedCheckpoints.length === 0) return false;

    const masterExamDate =
      localStorage.getItem(scopedExamDateKey) ||
      (() => {
        try {
          const d = JSON.parse(localStorage.getItem(scopedMasterDatesKey) || '{}');
          return d.examDate;
        } catch {
          return null;
        }
      })() ||
      getDefaultExamDateForLevel(activeLevel);

    let anyMilestoneAutoCompleted = false;
    let lastCompletedSubject: string | undefined;
    let lastCompletedTitle: string | undefined;
    let lastCompletedConclusionHour = 17;

    const updatedCheckpoints = parsedCheckpoints.map((cp: any) => {
      if (!cp || !cp.targetDate) return cp;
      const cpId = String(cp.id || '');
      const cpCycle = String(cp.revisionCycle || '');
      const cpTitle = String(cp.customTitle || '');
      const normSub =
        normalizeCaSubjectId(cp.subjectId) ||
        normalizeCaSubjectId(cpId.replace(/^cp_final_sprint_/i, '')) ||
        findSubjectForChapter(cpTitle, activeLevel);
      const subId = normSub || (cp.subjectId && cp.subjectId !== 'CUSTOM' ? String(cp.subjectId) : '');
      const storedExamDateForSub = subId ? subjectExamDates[subId] : undefined;

      const isFinalExamMilestone =
        cpId.startsWith('cp_final_sprint_') ||
        (storedExamDateForSub && cp.targetDate === storedExamDateForSub) ||
        ((cpCycle === 'Final Sprint' ||
          /final\s*sprint|final\s*exam|1\.5[-\s]*day|1\.5\s*sprint/i.test(`${cpCycle} ${cpTitle}`)) &&
          cp.targetDate >= masterExamDate);

      if (!isFinalExamMilestone) return cp;

      const examDateStr = String(storedExamDateForSub || cp.targetDate).trim();
      const conclusionHour = getExamConclusionHourForSubject(subId);
      const isAfterConclusion = currentHour >= conclusionHour;
      const shouldAutoComplete =
        todayStr > examDateStr || (todayStr === examDateStr && isAfterConclusion);

      if (!shouldAutoComplete) return cp;

      const allChapters: string[] =
        Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
          ? cp.selectedChapters
          : subId && SUBJECT_CHAPTERS[subId as SubjectId]
            ? SUBJECT_CHAPTERS[subId as SubjectId]
            : [];

      const existingCompleted: string[] = Array.isArray(cp.completedChapters) ? cp.completedChapters : [];

      // Always mark the final exam slot on the 24h target clock for that exam date as completed after conclusion hour
      try {
        const clockKey = getClockSlotsStorageKey(examDateStr, activeLevel);
        const rawClock = localStorage.getItem(clockKey);
        if (rawClock) {
          const slots = JSON.parse(rawClock);
          if (Array.isArray(slots)) {
            let clockUpdated = false;
            const nextSlots = slots.map((s: any) => {
              if (
                s.status !== 'completed' &&
                (s.isFinalExamSlot ||
                  String(s.id || '').startsWith(`slot_final_exam_${subId}`) ||
                  s.milestoneId === cp.id)
              ) {
                clockUpdated = true;
                return { ...s, status: 'completed' };
              }
              return s;
            });
            if (clockUpdated) {
              localStorage.setItem(clockKey, JSON.stringify(nextSlots));
            }
          }
        }
      } catch {
        // ignore clock errors
      }

      const areAllSprintChaptersCompleted =
        allChapters.length === 0 || existingCompleted.length >= allChapters.length;

      if (Boolean(cp.completed) && areAllSprintChaptersCompleted) {
        return cp;
      }

      // Synchronize all sprint chapters for this subject in Revision Report (rev1.5), LMR Sprint Board, and Local Tasks
      if (normSub) {
        try {
          const revStorageKey = getLevelScopedKey(`practca_revision_planner_${normSub}`, activeLevel);
          const rawRev = localStorage.getItem(revStorageKey);
          const parsedRev = rawRev ? JSON.parse(rawRev) : { subjectId: normSub, chapters: {} };
          if (!parsedRev.chapters || typeof parsedRev.chapters !== 'object') {
            parsedRev.chapters = {};
          }
          const completedAtIso = new Date().toISOString();
          allChapters.forEach((chapName) => {
            if (!parsedRev.chapters[chapName]) {
              parsedRev.chapters[chapName] = {};
            }
            const prevRev15 = parsedRev.chapters[chapName]['rev1.5'] || {};
            parsedRev.chapters[chapName]['rev1.5'] = {
              ...prevRev15,
              completed: true,
              statusTag: 'completed',
              completedAt: prevRev15.completedAt || completedAtIso,
              targetDate: prevRev15.targetDate || examDateStr
            };
          });
          localStorage.setItem(revStorageKey, JSON.stringify(parsedRev));
        } catch {
          // ignore revision planner sync error
        }

        try {
          const lmrStorageKey = getLevelScopedKey(`practca_lmr_sprint_v1_${normSub}`, activeLevel);
          const rawLmr = localStorage.getItem(lmrStorageKey);
          if (rawLmr) {
            const parsedLmr = JSON.parse(rawLmr);
            if (parsedLmr && typeof parsedLmr === 'object') {
              if (!parsedLmr.chapters || typeof parsedLmr.chapters !== 'object') {
                parsedLmr.chapters = {};
              }
              allChapters.forEach((chapName) => {
                const prevChap = parsedLmr.chapters[chapName] || {};
                parsedLmr.chapters[chapName] = {
                  ...prevChap,
                  status: 'completed'
                };
              });
              localStorage.setItem(lmrStorageKey, JSON.stringify(parsedLmr));
            }
          }
        } catch {
          // ignore LMR sprint storage error
        }

        try {
          const rawLocalTasks = localStorage.getItem(scopedLocalTasksKey);
          if (rawLocalTasks) {
            const parsedTasks = JSON.parse(rawLocalTasks);
            if (Array.isArray(parsedTasks)) {
              let tasksUpdated = false;
              const nextTasks = parsedTasks.map((t: any) => {
                if (!t) return t;
                const tId = String(t.id || '');
                const tMsId = String(t.milestoneId || '');
                const isMatchingSprintTask =
                  tMsId === cpId ||
                  tId.startsWith(`local-task-finalsprint-${normSub}-`);
                if (isMatchingSprintTask && (t.status !== 'completed' || !t.completed)) {
                  tasksUpdated = true;
                  return {
                    ...t,
                    status: 'completed',
                    completed: true
                  };
                }
                return t;
              });
              if (tasksUpdated) {
                localStorage.setItem(scopedLocalTasksKey, JSON.stringify(nextTasks));
              }
            }
          }
        } catch {
          // ignore local tasks sync error
        }
      }

      anyMilestoneAutoCompleted = true;
      lastCompletedSubject = subId || undefined;
      lastCompletedTitle = cp.customTitle || (subId ? `${subId} Final Exam Milestone` : 'Final Exam Milestone');
      lastCompletedConclusionHour = conclusionHour;

      return {
        ...cp,
        targetDate: examDateStr,
        selectedChapters: allChapters,
        completedChapters: [...allChapters],
        completed: true,
        mockTestCompleted: true
      };
    });

    if (anyMilestoneAutoCompleted) {
      localStorage.setItem(scopedCheckpointsKey, JSON.stringify(updatedCheckpoints));
      localStorage.setItem(scopedCheckpointsV3Key, JSON.stringify(updatedCheckpoints));

      const currentUser = auth.currentUser;
      const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');
      if (isRealUser && currentUser) {
        try {
          const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('roadmap', activeLevel));
          const datesRaw = localStorage.getItem(scopedMasterDatesKey);
          const dates = datesRaw ? JSON.parse(datesRaw) : {};
          setDoc(
            roadmapDocRef,
            {
              caLevel: activeLevel,
              checkpoints: updatedCheckpoints,
              prepStartDate: dates.prepStartDate || todayStr,
              examDate: dates.examDate || masterExamDate,
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          ).catch(() => {});
        } catch {
          // ignore
        }
      }

      window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
      window.dispatchEvent(new Event('practca_revision_planner_updated'));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new Event('storage'));

      const timeLabel = lastCompletedConclusionHour === 18
        ? '6:00 PM'
        : lastCompletedConclusionHour === 16
          ? '4:00 PM'
          : '5:00 PM';
      triggerFinalRevisionConfetti({
        subjectCode: lastCompletedSubject,
        milestoneTitle: `${lastCompletedTitle || 'Final Exam'} auto-marked Completed (Post ${timeLabel} Exam Conclusion)`,
        isExamAutoComplete: true
      });
    }

    return anyMilestoneAutoCompleted;
  } catch (e) {
    console.warn('Error in autoCompleteFinalExamMilestonesAfter5PM:', e);
    return false;
  }
}

export interface PostExamSubjectLockStatus {
  subjectId: SubjectId;
  isLocked: boolean;
  examDateStr: string;
  isExamDateCompleted: boolean;
  isFinalSprintMilestoneCompleted: boolean;
  milestoneId?: string;
  milestoneTitle?: string;
}

function normalizeCaSubjectId(raw?: string | null): SubjectId | null {
  if (!raw) return null;
  const trimmed = String(raw).trim().toUpperCase();
  const matched = ALL_KNOWN_SUBJECT_IDS.find(id => id.toUpperCase() === trimmed);
  return matched || null;
}

/**
 * Evaluates which subjects are locked after their Final Exam has completed AND
 * their 1.5-Day Final Sprint milestone has been marked complete.
 */
export function getPostExamLockedSubjectsMap(
  now: Date = new Date(),
  level?: CALevel
): Record<SubjectId, PostExamSubjectLockStatus> {
  const activeLevel = level || getSelectedCALevel();
  const levelSubjects = getLevelSubjectIds(activeLevel);
  const defaultMap = {} as Record<SubjectId, PostExamSubjectLockStatus>;
  ALL_KNOWN_SUBJECT_IDS.forEach((subId) => {
    defaultMap[subId] = {
      subjectId: subId,
      isLocked: false,
      examDateStr: '',
      isExamDateCompleted: false,
      isFinalSprintMilestoneCompleted: false
    };
  });

  if (typeof window === 'undefined') return defaultMap;

  try {
    const yr = now.getFullYear();
    const mn = String(now.getMonth() + 1).padStart(2, '0');
    const dy = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yr}-${mn}-${dy}`;
    const currentHour = now.getHours();

    const scopedExamDateKey = getLevelScopedKey('practca_exam_date', activeLevel);
    const scopedMasterDatesKey = getLevelScopedKey('practca_roadmap_master_dates', activeLevel);
    const scopedSubjectExamDatesKey = getLevelScopedKey('practca_subject_final_exam_dates', activeLevel);
    const scopedCheckpointsKey = getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel);
    const scopedCheckpointsV3Key = getLevelScopedKey('practca_roadmap_checkpoints_v3', activeLevel);

    const masterExamDate =
      localStorage.getItem(scopedExamDateKey) ||
      (() => {
        try {
          const d = JSON.parse(localStorage.getItem(scopedMasterDatesKey) || '{}');
          return d.examDate;
        } catch {
          return null;
        }
      })() ||
      '';
    const isFutureMasterAttempt = Boolean(
      masterExamDate && /^\d{4}-\d{2}-\d{2}$/.test(masterExamDate) && masterExamDate > todayStr
    );

    let subjectExamDates: Partial<Record<SubjectId, string>> = {};
    try {
      const rawSubjectDates = localStorage.getItem(scopedSubjectExamDatesKey);
      if (rawSubjectDates) {
        const parsed = JSON.parse(rawSubjectDates);
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach((k) => {
            const normSub = normalizeCaSubjectId(k);
            const val = String(parsed[k] || '').trim();
            if (normSub && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
              if (!isFutureMasterAttempt || val >= masterExamDate) {
                subjectExamDates[normSub] = val;
              }
            }
          });
        }
      }
    } catch {
      // ignore
    }

    let checkpoints: any[] = [];
    try {
      const rawCheckpoints =
        localStorage.getItem(scopedCheckpointsKey) ||
        localStorage.getItem(scopedCheckpointsV3Key);
      if (rawCheckpoints) {
        const parsed = JSON.parse(rawCheckpoints);
        if (Array.isArray(parsed)) {
          checkpoints = parsed;
        }
      }
    } catch {
      // ignore
    }

    levelSubjects.forEach((subId) => {
      // Find the 1.5-Day Final Sprint milestone for this subject
      const finalSprintCheckpoint = checkpoints.find((cp: any) => {
        if (!cp) return false;
        const cpSub = normalizeCaSubjectId(cp.subjectId);
        if (cpSub !== subId) return false;
        const cpId = String(cp.id || '');
        const cpCycle = String(cp.revisionCycle || '');
        const cpTitle = String(cp.customTitle || '');
        const isFinalSprint =
          cpId.startsWith('cp_final_sprint_') ||
          cpCycle === 'Final Sprint' ||
          /1\.5[-\s]*day|final\s*sprint/i.test(`${cpCycle} ${cpTitle}`);
        if (!isFinalSprint) return false;
        const tDate = typeof cp.targetDate === 'string' ? cp.targetDate.trim() : '';
        if (isFutureMasterAttempt && tDate && tDate < masterExamDate) return false;
        return true;
      });

      const cpTargetDate =
        finalSprintCheckpoint &&
        typeof finalSprintCheckpoint.targetDate === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(finalSprintCheckpoint.targetDate.trim())
          ? finalSprintCheckpoint.targetDate.trim()
          : '';

      const examDateStr = cpTargetDate || subjectExamDates[subId] || '';
      const conclusionHour = getExamConclusionHourForSubject(subId);
      const isAfterSubjectConclusion = currentHour >= conclusionHour;

      const isExamDateCompleted = Boolean(
        examDateStr &&
          /^\d{4}-\d{2}-\d{2}$/.test(examDateStr) &&
          (todayStr > examDateStr || (todayStr === examDateStr && isAfterSubjectConclusion))
      );

      // Check whether the 1.5-Day Final Sprint milestone for this subject is marked complete
      let isFinalSprintMilestoneCompleted = isExamDateCompleted;
      if (finalSprintCheckpoint && !isFinalSprintMilestoneCompleted) {
        const selectedChaps: string[] =
          Array.isArray(finalSprintCheckpoint.selectedChapters) &&
          finalSprintCheckpoint.selectedChapters.length > 0
            ? finalSprintCheckpoint.selectedChapters
            : SUBJECT_CHAPTERS[subId] || [];
        const completedChaps: string[] = Array.isArray(finalSprintCheckpoint.completedChapters)
          ? finalSprintCheckpoint.completedChapters
          : [];
        const allCheckpointChapsDone =
          selectedChaps.length > 0 && completedChaps.length >= selectedChaps.length;

        // Also check if all chapters in Revision Report `rev1.5` for this subject are marked completed
        let allRev15ChaptersDone = false;
        try {
          const rawRev = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subId}`, activeLevel));
          if (rawRev) {
            const parsedRev = JSON.parse(rawRev);
            const chapsObj = parsedRev?.chapters || {};
            const officialList = SUBJECT_CHAPTERS[subId] || [];
            if (officialList.length > 0) {
              allRev15ChaptersDone = officialList.every((cName) =>
                Boolean(chapsObj[cName]?.['rev1.5']?.completed || chapsObj[cName]?.['rev1.5']?.statusTag === 'completed')
              );
            }
          }
        } catch {
          // ignore
        }

        isFinalSprintMilestoneCompleted = Boolean(
          finalSprintCheckpoint.completed || allCheckpointChapsDone || allRev15ChaptersDone
        );
      }

      const isLocked = Boolean(isExamDateCompleted && isFinalSprintMilestoneCompleted);

      defaultMap[subId] = {
        subjectId: subId,
        isLocked,
        examDateStr,
        isExamDateCompleted,
        isFinalSprintMilestoneCompleted,
        milestoneId: finalSprintCheckpoint?.id,
        milestoneTitle:
          finalSprintCheckpoint?.customTitle ||
          `${subId} — 1.5-Day Final Sprint`
      };
    });

    // Keep per-paper locks ONLY while another scheduled paper in the cycle is still upcoming.
    // Once the last scheduled exam in the cycle finishes, unlock everything locked till now.
    const scheduledSubjects = levelSubjects.filter((s) => Boolean(defaultMap[s].examDateStr));
    const allScheduledExamsDone =
      scheduledSubjects.length > 0 &&
      scheduledSubjects.every((s) => defaultMap[s].isLocked);

    if (allScheduledExamsDone) {
      levelSubjects.forEach((s) => {
        defaultMap[s].isLocked = false;
      });
    }

    return defaultMap;
  } catch (e) {
    console.warn('Error computing post-exam locked subjects:', e);
    return defaultMap;
  }
}

export function isSubjectLockedAfterFinalExam(
  subjectId?: string | null,
  now: Date = new Date(),
  level?: CALevel
): boolean {
  const norm = normalizeCaSubjectId(subjectId);
  if (!norm) return false;
  const effectiveLevel = level || getLevelForSubject(norm) || getSelectedCALevel();
  return Boolean(getPostExamLockedSubjectsMap(now, effectiveLevel)[norm]?.isLocked);
}

export function getFirstUnlockedSubject(
  preferred?: SubjectId | string | null,
  fallback?: SubjectId,
  level?: CALevel
): SubjectId {
  const activeLevel = level || getSelectedCALevel();
  const levelSubjects = getLevelSubjectIds(activeLevel);
  const effectiveFallback = fallback || getDefaultSubjectForLevel(activeLevel);
  const map = getPostExamLockedSubjectsMap(new Date(), activeLevel);
  const normPref = normalizeCaSubjectId(preferred);
  if (normPref && levelSubjects.includes(normPref) && !map[normPref]?.isLocked) {
    return normPref;
  }
  const firstUnlocked = levelSubjects.find((s) => !map[s]?.isLocked);
  return firstUnlocked || (normPref && levelSubjects.includes(normPref) ? normPref : effectiveFallback);
}

/**
 * Marks or unmarks a subject's 1.5-Day Final Sprint milestone as complete.
 * Note: Once a subject is Post-Exam Locked (both exam date completed AND milestone completed),
 * it cannot be unlocked.
 */
export function toggleFinalSprintMilestoneCompletion(
  subjectId: SubjectId,
  forceCompleted?: boolean,
  level?: CALevel
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const activeLevel = level || getLevelForSubject(subjectId) || getSelectedCALevel();
    const lockMap = getPostExamLockedSubjectsMap(new Date(), activeLevel);
    if (lockMap[subjectId]?.isLocked && forceCompleted === false) {
      // Cannot unlock once post-exam locked
      return true;
    }

    const scopedCheckpointsKey = getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel);
    const scopedCheckpointsV3Key = getLevelScopedKey('practca_roadmap_checkpoints_v3', activeLevel);
    const scopedSubjectExamDatesKey = getLevelScopedKey('practca_subject_final_exam_dates', activeLevel);
    const scopedExamDateKey = getLevelScopedKey('practca_exam_date', activeLevel);

    const rawCps = localStorage.getItem(scopedCheckpointsKey);
    const cps: any[] = rawCps ? JSON.parse(rawCps) : [];
    const officialChapters = SUBJECT_CHAPTERS[subjectId] || [];

    let found = false;
    let nextCompletedState = Boolean(forceCompleted ?? true);

    const updatedCps = cps.map((cp: any) => {
      if (!cp) return cp;
      const cpSub = normalizeCaSubjectId(cp.subjectId);
      const cpId = String(cp.id || '');
      const cpCycle = String(cp.revisionCycle || '');
      const cpTitle = String(cp.customTitle || '');
      const isFinalSprint =
        cpSub === subjectId &&
        (cpId.startsWith('cp_final_sprint_') ||
          cpCycle === 'Final Sprint' ||
          /1\.5[-\s]*day|final\s*sprint/i.test(`${cpCycle} ${cpTitle}`));

      if (!isFinalSprint) return cp;
      found = true;
      nextCompletedState =
        typeof forceCompleted === 'boolean' ? forceCompleted : !Boolean(cp.completed);

      const selChaps =
        Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
          ? cp.selectedChapters
          : officialChapters;

      return {
        ...cp,
        completed: nextCompletedState,
        completedChapters: nextCompletedState ? [...selChaps] : []
      };
    });

    if (!found) {
      // If no checkpoint existed yet, create one using the stored exam date if available
      let examDateStr = '';
      try {
        const rawDates = localStorage.getItem(scopedSubjectExamDatesKey);
        if (rawDates) {
          const parsedDates = JSON.parse(rawDates);
          examDateStr = parsedDates?.[subjectId] || '';
        }
      } catch {}
      if (!examDateStr) {
        examDateStr = localStorage.getItem(scopedExamDateKey) || new Date().toISOString().split('T')[0];
      }
      updatedCps.push({
        id: `cp_final_sprint_${subjectId}`,
        subjectId,
        customTitle: `${subjectId} — 1.5-Day Final Sprint`,
        revisionCycle: 'Final Sprint',
        startDate: examDateStr,
        targetDate: examDateStr,
        targetChapters: officialChapters.length,
        selectedChapters: [...officialChapters],
        completedChapters: nextCompletedState ? [...officialChapters] : [],
        completed: nextCompletedState,
        completionCondition: 'targets_only'
      });
    }

    localStorage.setItem(scopedCheckpointsKey, JSON.stringify(updatedCps));
    localStorage.setItem(scopedCheckpointsV3Key, JSON.stringify(updatedCps));

    const currentUser = auth.currentUser;
    const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');
    if (isRealUser && currentUser) {
      try {
        const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('roadmap', activeLevel));
        setDoc(
          roadmapDocRef,
          {
            caLevel: activeLevel,
            checkpoints: updatedCps,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch(() => {});
      } catch {}
    }

    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
    window.dispatchEvent(new Event('storage'));

    return nextCompletedState;
  } catch (e) {
    console.warn('Error toggling Final Sprint milestone completion:', e);
    return false;
  }
}

const POST_EXAM_NORMAL_CLEANUP_SIG_KEY = 'practca_post_exam_normal_cleanup_sig';

function resolveAnyTaskDateStr(t: any): string {
  if (!t) return '';
  const raw =
    t.taskDate ||
    t.scheduledDate ||
    t.date ||
    (t.due ? String(t.due).split('T')[0] : '') ||
    '';
  const sliced = String(raw || '').trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(sliced) ? sliced : '';
}

function isCompletedTaskLog(t: any): boolean {
  if (!t) return false;
  return t.status === 'completed' || Boolean(t.completed);
}

/**
 * Dismisses all old pending and missed tasks once the last exam finishes,
 * while strictly preserving completed task logs (and any future tasks scheduled
 * strictly after the concluded exam cycle). Guarded per scheduleSignature so new
 * post-exam tasks created afterward remain untouched.
 */
export function dismissPendingAndMissedTasksPostExam(
  scheduleSignature: string,
  cycleEndDateStr?: string,
  now: Date = new Date(),
  level?: CALevel
): string[] {
  if (typeof window === 'undefined' || !scheduleSignature) return [];
  try {
    const activeLevel = level || getSelectedCALevel();
    const scopedCleanupSigKey = getLevelScopedKey(POST_EXAM_NORMAL_CLEANUP_SIG_KEY, activeLevel);
    const alreadyCleanedSig = localStorage.getItem(scopedCleanupSigKey);
    if (alreadyCleanedSig === scheduleSignature) {
      return [];
    }

    const yr = now.getFullYear();
    const mn = String(now.getMonth() + 1).padStart(2, '0');
    const dy = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yr}-${mn}-${dy}`;
    const cutoffDate =
      cycleEndDateStr && /^\d{4}-\d{2}-\d{2}$/.test(cycleEndDateStr) && cycleEndDateStr > todayStr
        ? cycleEndDateStr
        : todayStr;

    const dismissedIds = new Set<string>();
    const shouldKeepTask = (t: any): boolean => {
      if (!t) return false;
      if (isCompletedTaskLog(t)) return true;

      const notesStr = String(t.notes || '');
      const isMissed =
        t.status === 'unachieved' ||
        t.status === 'rescheduled' ||
        /STATUS:\s*UNACHIEVED/i.test(notesStr);
      if (isMissed) {
        if (t.id) dismissedIds.add(String(t.id));
        return false;
      }

      const tDate = resolveAnyTaskDateStr(t);
      if (tDate && tDate > cutoffDate) {
        return true;
      }

      if (t.id) dismissedIds.add(String(t.id));
      return false;
    };

    let storageModified = false;
    const scopedLocalTasksKey = getLevelScopedKey('practca_local_tasks', activeLevel);
    const taskStorageKeys = [
      scopedLocalTasksKey,
      getLevelScopedKey('practca_cached_cloud_tasks', activeLevel),
      getLevelScopedKey('practca_tasks_backup', activeLevel)
    ];
    let hasLocalTasksKey = false;

    taskStorageKeys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        if (key === scopedLocalTasksKey) hasLocalTasksKey = true;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const filtered = parsed.filter(shouldKeepTask);
        if (filtered.length !== parsed.length) {
          localStorage.setItem(key, JSON.stringify(filtered));
          storageModified = true;
        }
      } catch {}
    });

    if (!hasLocalTasksKey) {
      try {
        localStorage.setItem(scopedLocalTasksKey, JSON.stringify([]));
        storageModified = true;
      } catch {}
    }

    // Clear incomplete/missed items from 24-Hour Target Flow queue (keep completed entries)
    try {
      const scopedFlowKey = getLevelScopedKey('practca_target_flow', activeLevel);
      const rawFlow = localStorage.getItem(scopedFlowKey);
      if (rawFlow) {
        const parsedFlow = JSON.parse(rawFlow);
        if (Array.isArray(parsedFlow)) {
          const filteredFlow = parsedFlow.filter((item: any) => isCompletedTaskLog(item));
          if (filteredFlow.length !== parsedFlow.length) {
            localStorage.setItem(scopedFlowKey, JSON.stringify(filteredFlow));
            storageModified = true;
          }
        }
      }
    } catch {}

    // Clear incomplete/missed slots on 24-Hour Target Clocks up to cutoffDate (keep completed slots)
    try {
      const clockKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && isClockSlotsStorageKeyForLevel(k, activeLevel)) {
          clockKeys.push(k);
        }
      }
      clockKeys.forEach((clockKey) => {
        try {
          const clockDate = parseClockSlotsDateFromKey(clockKey, activeLevel).trim();
          if (clockDate && clockDate > cutoffDate) return;
          const rawClock = localStorage.getItem(clockKey);
          if (!rawClock) return;
          const parsedClock = JSON.parse(rawClock);
          if (!Array.isArray(parsedClock)) return;
          const filteredClock = parsedClock.filter((slot: any) => {
            if (!slot) return false;
            return isCompletedTaskLog(slot);
          });
          if (filteredClock.length !== parsedClock.length) {
            localStorage.setItem(clockKey, JSON.stringify(filteredClock));
            storageModified = true;
          }
        } catch {}
      });
    } catch {}

    // Clear linked active focus target if it belongs to a dismissed/non-completed task
    let clearedFocusTask = false;
    try {
      const scopedFocusTaskKey = getLevelScopedKey('practca_active_focus_task', activeLevel);
      const rawFocusTask = localStorage.getItem(scopedFocusTaskKey);
      if (rawFocusTask) {
        const parsedFocus = JSON.parse(rawFocusTask);
        const focusCompleted = isCompletedTaskLog(parsedFocus);
        const focusDate = parsedFocus?.dueDate ? String(parsedFocus.dueDate).slice(0, 10) : '';
        const shouldClearFocus =
          !focusCompleted &&
          (dismissedIds.has(String(parsedFocus?.id || '')) || !focusDate || focusDate <= cutoffDate);
        if (shouldClearFocus) {
          localStorage.removeItem(scopedFocusTaskKey);
          clearedFocusTask = true;
          storageModified = true;
        }
      }
    } catch {}

    localStorage.setItem(scopedCleanupSigKey, scheduleSignature);

    const dismissedArray = Array.from(dismissedIds);

    try {
      const currentUser = auth?.currentUser;
      if (currentUser && !currentUser.isAnonymous && dismissedArray.length > 0) {
        dismissedArray.forEach((taskId) => {
          deleteDoc(firestoreDoc(db, 'users', currentUser.uid, 'tasks', taskId)).catch(() => {});
        });
      }
    } catch {}

    if (storageModified) {
      try {
        window.dispatchEvent(new Event('practca_tasks_updated'));
        window.dispatchEvent(new Event('practca_target_flow_updated'));
        window.dispatchEvent(new Event('practca_target_clock_updated'));
        window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
        window.dispatchEvent(new Event('practca_revision_planner_updated'));
        window.dispatchEvent(new Event('practca_target_system_synced'));
        if (clearedFocusTask) {
          window.dispatchEvent(new Event('practca_active_focus_task_cleared'));
        }
        window.dispatchEvent(new Event('storage'));
      } catch {}
    }

    return dismissedArray;
  } catch (e) {
    console.warn('Error in dismissPendingAndMissedTasksPostExam:', e);
    return [];
  }
}

/**
 * Activates a future / next attempt schedule: persists the new examDate, clears stale
 * concluded paper dates and past Final Sprint checkpoints from earlier cycles, and emits sync events.
 */
export function activateNextExamAttemptSchedule(newExamDate: string, level?: CALevel): void {
  if (typeof window === 'undefined' || !newExamDate || !/^\d{4}-\d{2}-\d{2}$/.test(newExamDate)) {
    return;
  }
  try {
    const activeLevel = level || getSelectedCALevel();
    const now = new Date();
    const yr = now.getFullYear();
    const mn = String(now.getMonth() + 1).padStart(2, '0');
    const dy = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yr}-${mn}-${dy}`;

    const scopedExamDateKey = getLevelScopedKey('practca_exam_date', activeLevel);
    const scopedAttemptClearedKey = getLevelScopedKey('practca_exam_attempt_cleared', activeLevel);
    const scopedMasterDatesKey = getLevelScopedKey('practca_roadmap_master_dates', activeLevel);
    const scopedSubjectExamDatesKey = getLevelScopedKey('practca_subject_final_exam_dates', activeLevel);
    const scopedRevertedSigKey = getLevelScopedKey('practca_post_exam_regular_mode_reverted_sig', activeLevel);

    localStorage.removeItem(scopedAttemptClearedKey);
    localStorage.setItem(scopedExamDateKey, newExamDate);
    try {
      const rawMaster = localStorage.getItem(scopedMasterDatesKey);
      const parsedMaster = rawMaster ? JSON.parse(rawMaster) : {};
      localStorage.setItem(
        scopedMasterDatesKey,
        JSON.stringify({
          ...(parsedMaster && typeof parsedMaster === 'object' ? parsedMaster : {}),
          examDate: newExamDate
        })
      );
    } catch {}

    let updatedDatesMap: Record<string, string> = {};
    try {
      const rawDates = localStorage.getItem(scopedSubjectExamDatesKey);
      if (rawDates) {
        const parsed = JSON.parse(rawDates);
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach((k) => {
            const val = String(parsed[k] || '').trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(val) && val >= newExamDate) {
              updatedDatesMap[k] = val;
            }
          });
          localStorage.setItem(scopedSubjectExamDatesKey, JSON.stringify(updatedDatesMap));
        }
      }
    } catch {}

    const checkpointKeys = [
      getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel),
      getLevelScopedKey('practca_roadmap_checkpoints_v3', activeLevel)
    ];
    let syncedCheckpoints: any[] | null = null;
    checkpointKeys.forEach((key) => {
      try {
        const rawCps = localStorage.getItem(key);
        if (!rawCps) return;
        const parsed = JSON.parse(rawCps);
        if (!Array.isArray(parsed)) return;
        const filtered = parsed.filter((cp: any) => {
          if (!cp) return false;
          const isFinalSprint =
            cp.revisionCycle === 'Final Sprint' ||
            String(cp.id || '').startsWith('cp_final_sprint_') ||
            /1\.5[-\s]*day|final\s*sprint/i.test(String(cp.customTitle || ''));
          if (!isFinalSprint) return true;
          const tDate = typeof cp.targetDate === 'string' ? cp.targetDate.trim() : '';
          return Boolean(tDate && tDate >= newExamDate && tDate >= todayStr);
        });
        if (filtered.length !== parsed.length) {
          localStorage.setItem(key, JSON.stringify(filtered));
          syncedCheckpoints = filtered;
        }
      } catch {}
    });

    if (newExamDate >= todayStr) {
      localStorage.removeItem(scopedRevertedSigKey);
    }

    const currentUser = auth?.currentUser;
    const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');
    if (isRealUser && currentUser) {
      try {
        const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('roadmap', activeLevel));
        const payload: Record<string, any> = {
          caLevel: activeLevel,
          examDate: newExamDate,
          subjectFinalExamDates: updatedDatesMap,
          updatedAt: new Date().toISOString()
        };
        if (syncedCheckpoints) {
          payload.checkpoints = syncedCheckpoints;
        }
        setDoc(roadmapDocRef, payload, { merge: true }).catch(() => {});

        if (activeLevel === 'final') {
          const userDocRef = firestoreDoc(db, 'users', currentUser.uid);
          setDoc(userDocRef, { examDate: newExamDate }, { merge: true }).catch(() => {});
        }
      } catch {}
    }

    window.dispatchEvent(new Event('practca_exam_date_updated'));
    window.dispatchEvent(new CustomEvent('practca_subject_exam_dates_updated', { detail: updatedDatesMap }));
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_lmr_mode_changed'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Error activating next exam attempt schedule:', e);
  }
}

/**
 * Clears the currently selected exam attempt & paper exam dates for the active CA level
 * so the Exam Countdown resets cleanly to "No Scheduled Exam".
 */
export function clearExamAttemptSchedule(level?: CALevel): void {
  if (typeof window === 'undefined') return;
  try {
    const activeLevel = level || getSelectedCALevel();
    const scopedAttemptClearedKey = getLevelScopedKey('practca_exam_attempt_cleared', activeLevel);
    const scopedExamDateKey = getLevelScopedKey('practca_exam_date', activeLevel);
    const scopedMasterDatesKey = getLevelScopedKey('practca_roadmap_master_dates', activeLevel);
    const scopedSubjectExamDatesKey = getLevelScopedKey('practca_subject_final_exam_dates', activeLevel);
    const scopedRevertedSigKey = getLevelScopedKey('practca_post_exam_regular_mode_reverted_sig', activeLevel);

    localStorage.setItem(scopedAttemptClearedKey, 'true');
    localStorage.removeItem(scopedExamDateKey);
    localStorage.removeItem(scopedSubjectExamDatesKey);
    localStorage.removeItem(scopedRevertedSigKey);

    try {
      const rawMaster = localStorage.getItem(scopedMasterDatesKey);
      const parsedMaster = rawMaster ? JSON.parse(rawMaster) : {};
      localStorage.setItem(
        scopedMasterDatesKey,
        JSON.stringify({
          ...(parsedMaster && typeof parsedMaster === 'object' ? parsedMaster : {}),
          examDate: ''
        })
      );
    } catch {}

    const currentUser = auth?.currentUser;
    const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');
    if (isRealUser && currentUser) {
      try {
        const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('roadmap', activeLevel));
        setDoc(
          roadmapDocRef,
          {
            caLevel: activeLevel,
            examDate: '',
            subjectFinalExamDates: {},
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch(() => {});

        const userDocRef = firestoreDoc(db, 'users', currentUser.uid);
        const examField = getUserDocExamDateField(activeLevel);
        setDoc(userDocRef, { [examField]: '' }, { merge: true }).catch(() => {});
      } catch {}
    }

    window.dispatchEvent(new Event('practca_exam_date_updated'));
    window.dispatchEvent(new CustomEvent('practca_subject_exam_dates_updated', { detail: {} }));
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_lmr_mode_changed'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Error clearing exam attempt schedule:', e);
  }
}

/**
 * Returns true if the task/item represents a generic / comprehensive study block
 * (e.g., "Comprehensive Study Block", "Comprehensive Subject Revision", "Digital Study Block",
 * "General / Entire Subject") rather than an actual syllabus chapter or scheduled Mock Test.
 */
export function isComprehensiveStudyBlockTask(task: any): boolean {
  if (!task || typeof task !== 'object') return false;
  if (task.isMockTest) return false;

  const stripTags = (val: any): string =>
    String(val || '')
      .replace(/[🔴🟡🔵📝⚡✅🎯]/g, '')
      .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/gi, '')
      .replace(/\[\s*[A-Za-z]+\s*\]/g, '')
      .replace(/^[\s\-|•:]+|[\s\-|•:]+$/g, '')
      .trim();

  const rawTitle = String(task.title || '').trim();
  const rawClean = String(task.cleanTitle || '').trim();
  const rawChap = String(task.chapterName || '').trim();

  const candidates = [stripTags(rawClean), stripTags(rawTitle), stripTags(rawChap)].filter(Boolean);
  const genericBlockPattern =
    /^(?:comprehensive\s*(?:study\s*block|subject\s*revision|revision\s*block|revision|study)|(?:digital|linked)?\s*study\s*block|general\s*\/\s*entire\s*subject|entire\s*subject|general\s*study|general\s*revision|subject\s*revision|focus\s*block|pomodoro\s*block)$/i;

  if (candidates.some((c) => genericBlockPattern.test(c))) {
    return true;
  }

  const combined = `${rawTitle} ${rawClean} ${rawChap}`;
  if (/\bcomprehensive\s+study\s+block\b/i.test(combined)) {
    return true;
  }

  return false;
}

export function actualAchievedMinsOrDefault(mins: number): number {
  return Math.max(0, Math.round(mins || 0));
}

/**
 * Reconciles Target Metrics and the 24-Hour Target Clock for `selectedDate`.
 * Guarantees:
 * 1. Every target present in Target Metrics (`trackedTasks`) is slotted on the 24-Hour Target Clock (`practca_24h_target_clock_${selectedDate}`).
 * 2. Any target whose authoritative duration in Target Metrics changed (via batching, inline duration edit, early completion, or undo restoration)
 *    has its 24-Hour Target Clock slot duration reconciled so Total Target Metrics Duration === 24-Hour Target Clock Planned Duration.
 */
let isReconcilingTargetClock = false;

export function reconcileTargetMetricsAndClockForDate(
  selectedDate: string,
  trackedTasksInput?: any[],
  level?: CALevel
): {
  reconciled: boolean;
  addedSlotsCount: number;
  adjustedSlotsCount: number;
  totalClockMinutes: number;
  totalSavedEarlyMinutes: number;
} {
  if (!selectedDate || isReconcilingTargetClock) {
    return { reconciled: false, addedSlotsCount: 0, adjustedSlotsCount: 0, totalClockMinutes: 0, totalSavedEarlyMinutes: 0 };
  }

  const activeLevel = level || getSelectedCALevel();
  const nowCheck = new Date();
  const todayCheckStr = `${nowCheck.getFullYear()}-${String(nowCheck.getMonth() + 1).padStart(2, '0')}-${String(nowCheck.getDate()).padStart(2, '0')}`;
  if (selectedDate < todayCheckStr) {
    return { reconciled: false, addedSlotsCount: 0, adjustedSlotsCount: 0, totalClockMinutes: 0, totalSavedEarlyMinutes: 0 };
  }

  isReconcilingTargetClock = true;
  try {
  const clockKey = getClockSlotsStorageKey(selectedDate, activeLevel);
  let currentSlots: any[] = [];
  let prunedAutoSlots = false;
  try {
    const raw = localStorage.getItem(clockKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        currentSlots = parsed.filter((s: any) => {
          const sid = String(s?.id || '').trim();
          const isAutoReconciled = sid.startsWith('slot_reconciled_') || sid.startsWith('slot_autobatch_ms_');
          if (isAutoReconciled) prunedAutoSlots = true;
          return !isAutoReconciled;
        });
      }
    }
  } catch (e) {}

  const isTodayDate = selectedDate === todayCheckStr;
  const currentRestrictionMark = isTodayDate ? getProspectiveRestrictionMark(currentSlots, selectedDate) : 0;

  const deletedTargetsSet = new Set<string>();
  try {
    const rawDel = localStorage.getItem(getLevelScopedKey(`practca_deleted_targets_${selectedDate}`, activeLevel));
    if (rawDel) {
      const arr = JSON.parse(rawDel);
      if (Array.isArray(arr)) {
        arr.forEach((k: any) => {
          if (k) deletedTargetsSet.add(String(k).toLowerCase());
        });
      }
    }
  } catch (e) {}

  let tasksForDate: any[] = [];
  if (Array.isArray(trackedTasksInput)) {
    tasksForDate = trackedTasksInput;
  } else {
    try {
      const rawTasks =
        localStorage.getItem(getLevelScopedKey('practca_local_tasks', activeLevel)) ||
        localStorage.getItem(getLevelScopedKey('practca_cached_cloud_tasks', activeLevel));
      if (rawTasks) {
        const allTasks = JSON.parse(rawTasks);
        if (Array.isArray(allTasks)) {
          tasksForDate = allTasks.filter((t: any) => {
            if (!t || t.status === 'unachieved') return false;
            const dStr = t.taskDate || (t.due ? String(t.due).split('T')[0] : '');
            return dStr === selectedDate;
          });
        }
      }
    } catch (e) {}
  }

  let durationsMap: Record<string, number> = {};
  try {
    const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations', activeLevel));
    if (rawDur) durationsMap = JSON.parse(rawDur) || {};
  } catch (e) {}

  let changed = prunedAutoSlots;
  let addedSlotsCount = 0;
  let adjustedSlotsCount = 0;
  const updatedSlots = [...currentSlots];
  const unslottedItems: Array<{
    task: any;
    targetId: string;
    title: string;
    chapterName?: string;
    subjectCode: SubjectId;
    relevance: 'General' | 'Revision' | 'Final Revision';
    durationMinutes: number;
    isCompleted: boolean;
    isMockTest: boolean;
    mockScheduledTime?: string;
    mockSeries?: string;
  }> = [];

  const findEarliestNonOverlappingWindow = (
    existing: any[],
    durMins: number,
    preferStart: number,
    minAllowedStart: number = 0
  ): { startMinutes: number; endMinutes: number } => {
    return findRealisticGapOnClock(
      existing.map((s: any) => ({
        startMinutes: Number(s.startMinutes) || 0,
        endMinutes: Number(s.endMinutes) || 0
      })),
      durMins,
      preferStart,
      minAllowedStart,
      selectedDate
    );
  };

  tasksForDate.forEach((t: any) => {
    const rawCleanTitle = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
    const cleanTitle = rawCleanTitle || String(t.cleanTitle || t.title || '').trim();
    const normTitle = normalizeKey(cleanTitle);
    const idStr = String(t.id || '').trim();
    if (!normTitle && !idStr) return;
    if (
      (idStr && deletedTargetsSet.has(idStr.toLowerCase())) ||
      (normTitle && deletedTargetsSet.has(normTitle)) ||
      (cleanTitle && deletedTargetsSet.has(cleanTitle.toLowerCase()))
    ) {
      return;
    }

    const isTaskDone = Boolean(
      t.isCompleted ||
      t.status === 'completed' ||
      Boolean(t.completed) ||
      isTaskCompletedInStorage(idStr, t.title, cleanTitle, t.chapterName, t.subjectCode, selectedDate, undefined, activeLevel)
    );

    const rawExpectedDuration =
      t.targetDuration ??
      t.targetDurationMinutes ??
      (idStr ? durationsMap[idStr] : undefined) ??
      (cleanTitle ? durationsMap[cleanTitle] : undefined) ??
      (normTitle ? durationsMap[normTitle] : undefined) ??
      t.duration;

    const isZeroCompletedTarget =
      isTaskDone &&
      (rawExpectedDuration === 0 || (Number(t.allocatedMinutes) === 0 && Number(t.earlyCompletionSavedMinutes) > 0));

    const expectedDuration = isZeroCompletedTarget
      ? 0
      : Math.max(
          1,
          Math.round(Number(rawExpectedDuration ?? 60) || 60)
        );

    const matchingSlotIndices: number[] = [];
    const tChapNorm = normalizeKey(t.chapterName || '');
    updatedSlots.forEach((s: any, idx: number) => {
      const isClubBatchSlot = String(s.id || '').includes('_club_') || /^batch\s*\d*\s*\(/i.test(String(s.title || ''));
      if (isClubBatchSlot && t.clubGroupId) {
        if (String(s.id || '').includes(String(t.clubGroupId))) {
          matchingSlotIndices.push(idx);
        }
        return;
      }
      if (isClubBatchSlot) return;
      const sCleanTitle = String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const sNorm = normalizeKey(sCleanTitle);
      const sRawNorm = normalizeKey(s.title || '');
      const sTargetId = String(s.targetId || '').trim();
      const sChapNorm = normalizeKey(s.chapterName || '');
      if (
        (idStr && sTargetId && sTargetId === idStr) ||
        (normTitle && ((sNorm && sNorm === normTitle) || (sRawNorm && sRawNorm === normTitle))) ||
        (cleanTitle && sTargetId && sTargetId === cleanTitle) ||
        (tChapNorm && sChapNorm && tChapNorm === sChapNorm && (!t.subjectCode || !s.subjectCode || t.subjectCode === s.subjectCode))
      ) {
        matchingSlotIndices.push(idx);
      }
    });

    if (matchingSlotIndices.length === 0) {
      // Do NOT auto-slot unslotted targets onto the 24-Hour Plan Clock; slotting is strictly user-initiated.
      return;
    } else {
      // Skip resizing multi-chapter batch slots from a single sub-target
      const hasClubBatchSlot = matchingSlotIndices.some(idx => {
        const s = updatedSlots[idx];
        return String(s?.id || '').includes('_club_') || /^batch\s*\d*\s*\(/i.test(String(s?.title || ''));
      });
      if (hasClubBatchSlot) {
        return;
      }

      // If completed with 0m expectedDuration, remove the slot(s) so Clock Planned === 0m === Target Metrics Planned
      if (isTaskDone && expectedDuration === 0) {
        [...matchingSlotIndices].sort((a, b) => b - a).forEach(sIdx => {
          updatedSlots.splice(sIdx, 1);
          changed = true;
          adjustedSlotsCount++;
        });
        return;
      }

      const alreadyReconciledToExpected = matchingSlotIndices.some(idx => {
        const s = updatedSlots[idx];
        return Number(s?.totalTargetMinutes) === expectedDuration && Number(s?.endMinutes) >= 1440;
      });

      // Check if existing slot(s) duration or status needs reconciliation with Target Metrics
      const currentSlotSum = matchingSlotIndices.reduce(
        (acc, idx) => acc + (Number(updatedSlots[idx]?.durationMinutes) || 0),
        0
      );
      const hasExplicitTargetDuration = Boolean(
        t.clubGroupId ||
        t.earlyCompletionSavedMinutes !== undefined ||
        t.originalTargetDurationMinutes !== undefined ||
        t.targetDuration !== undefined ||
        t.targetDurationMinutes !== undefined ||
        (idStr && durationsMap[idStr] !== undefined) ||
        (cleanTitle && durationsMap[cleanTitle] !== undefined) ||
        (normTitle && durationsMap[normTitle] !== undefined)
      );

      if (hasExplicitTargetDuration && currentSlotSum !== expectedDuration && !alreadyReconciledToExpected) {
        let remainingToAssign = expectedDuration;
        matchingSlotIndices.forEach((slotIdx, matchPos) => {
          const slot = updatedSlots[slotIdx];
          if (!slot) return;
          const isLast = matchPos === matchingSlotIndices.length - 1;
          const oldDur = Number(slot.durationMinutes) || 60;
          const newDur = expectedDuration === 0
            ? 0
            : isLast
              ? Math.max(1, remainingToAssign)
              : Math.max(1, Math.round((oldDur / Math.max(1, currentSlotSum)) * expectedDuration));
          remainingToAssign = expectedDuration === 0 ? 0 : Math.max(1, remainingToAssign - newDur);
          const startM = Number(slot.startMinutes) || 540;
          const endM = Math.min(1440, startM + newDur);
          const effectiveDur = expectedDuration === 0 ? 0 : Math.max(1, endM - startM);

          const nextSlot: any = {
            ...slot,
            durationMinutes: effectiveDur,
            totalTargetMinutes: expectedDuration,
            endMinutes: endM,
            endTime: minutesToClockTime(endM % 1440),
            status: isTaskDone ? 'completed' : (slot.status === 'active' ? 'active' : 'pending'),
          };
          if (isTaskDone && (t.originalTargetDurationMinutes || slot.originalDurationMinutes) && (t.earlyCompletionSavedMinutes || slot.earlySavedMinutes)) {
            nextSlot.originalDurationMinutes = slot.originalDurationMinutes ?? t.originalTargetDurationMinutes;
            nextSlot.originalStartMinutes = slot.originalStartMinutes ?? startM;
            nextSlot.originalEndMinutes = slot.originalEndMinutes ?? Math.min(1440, startM + Number(nextSlot.originalDurationMinutes));
            nextSlot.originalStartTime = slot.originalStartTime ?? minutesToClockTime(startM);
            nextSlot.originalEndTime = slot.originalEndTime ?? minutesToClockTime(Math.min(1440, startM + Number(nextSlot.originalDurationMinutes)) % 1440);
            nextSlot.earlySavedMinutes = Number(t.earlyCompletionSavedMinutes ?? slot.earlySavedMinutes);
          } else if (!isTaskDone) {
            delete nextSlot.originalDurationMinutes;
            delete nextSlot.earlySavedMinutes;
          }
          if (
            slot.durationMinutes !== nextSlot.durationMinutes ||
            slot.endMinutes !== nextSlot.endMinutes ||
            slot.status !== nextSlot.status ||
            slot.totalTargetMinutes !== nextSlot.totalTargetMinutes
          ) {
            updatedSlots[slotIdx] = nextSlot;
            changed = true;
            adjustedSlotsCount++;
          }
        });
      } else {
        // Ensure completion status is synced
        matchingSlotIndices.forEach(slotIdx => {
          const slot = updatedSlots[slotIdx];
          const expectedStatus = isTaskDone ? 'completed' : (slot.status === 'active' ? 'active' : 'pending');
          if (slot.status !== expectedStatus) {
            updatedSlots[slotIdx] = { ...slot, status: expectedStatus };
            changed = true;
          }
        });
      }
    }
  });

  if (unslottedItems.length > 0) {
    const rationale = analyzeUserDayRationale(selectedDate);
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayStr;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const prospectiveMark = getProspectiveRestrictionMark(updatedSlots, selectedDate);
    const minTodayStart = isToday ? Math.max(Math.min(1425, Math.ceil(nowMinutes / 5) * 5), prospectiveMark) : 0;

    // Calculate max available free time on the 24h clock from minTodayStart to 1440
    const getRemainingFreeClockMinutes = (slotsList: any[], minStart: number): number => {
      const sorted = [...slotsList]
        .map(s => ({
          start: Math.max(minStart, Number(s.startMinutes) || 0),
          end: Math.min(1440, Number(s.endMinutes) || 0)
        }))
        .filter(s => s.end > s.start)
        .sort((a, b) => a.start - b.start);
      let occupied = 0;
      let curEnd = minStart;
      for (const seg of sorted) {
        const s = Math.max(curEnd, seg.start);
        if (seg.end > s) {
          occupied += seg.end - s;
          curEnd = seg.end;
        }
      }
      return Math.max(0, (1440 - minStart) - occupied);
    };

    const remainingFreeAtStart = getRemainingFreeClockMinutes(updatedSlots, minTodayStart);
    if (remainingFreeAtStart > 0) {
      // Cap each unslotted item's duration to the max available time on the clock so default duration never exceeds available clock capacity
      const cappedUnslottedItems = unslottedItems.map(item => {
        if (item.isCompleted && item.durationMinutes === 0) {
          return { ...item, durationMinutes: 0 };
        }
        const maxFree = getRemainingFreeClockMinutes(updatedSlots, minTodayStart);
        const allocDur = maxFree > 0 ? Math.min(item.durationMinutes, maxFree) : item.durationMinutes;
        return { ...item, durationMinutes: Math.max(1, allocDur), originalRequestedMinutes: item.durationMinutes };
      });

      const lastExistingEnd = updatedSlots.length > 0
        ? Math.max(...updatedSlots.map((s: any) => Number(s.endMinutes) || 0))
        : 0;
      const anchorStart = Math.max(
        rationale.estimatedStudyStartMinutes,
        minTodayStart,
        !isToday && lastExistingEnd > 0 && lastExistingEnd < 1380 ? lastExistingEnd : 0
      );

      const fixedBusy = updatedSlots.map((s: any) => ({
        start: Number(s.startMinutes) || 0,
        end: Number(s.endMinutes) || 0
      }));

      const { placedItems, unplacedItems } = fitOrderedItemsToRationaleTimeline(
        cappedUnslottedItems,
        rationale,
        anchorStart,
        fixedBusy,
        {
          enforceStudyBreakRule: true,
          minTransitionGap: 5,
          protectSleepWindow: true
        }
      );

      placedItems.forEach(({ item, startMinutes, endMinutes, durationMinutes, splitInfo }, pIdx) => {
        const safeStart = isToday ? Math.max(minTodayStart, startMinutes) : startMinutes;
        const isZeroDone = Boolean(item.isCompleted && item.durationMinutes === 0);
        const safeEnd = isZeroDone ? safeStart : Math.min(1440, safeStart + durationMinutes);
        const actualAllocated = isZeroDone ? 0 : Math.max(1, safeEnd - safeStart);

        let slotId = `slot_reconciled_${Date.now()}_${pIdx}_${Math.random().toString(36).slice(2, 6)}`;
        let slotTitle = item.title;
        let slotNum = (item as any).slotNumber;
        let totalSlotsNum = (item as any).totalSlots;
        let totalTargetMins = (item as any).originalRequestedMinutes || (item as any).totalTargetMinutes || item.durationMinutes;

        if (splitInfo) {
          slotId = `slot_reconciled_${Date.now()}_${pIdx}_p${splitInfo.partNumber}_${Math.random().toString(36).slice(2, 6)}`;
          const cleanTitle = (item.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
          slotTitle = `${cleanTitle} (Part ${splitInfo.partNumber}/${splitInfo.totalParts})`;
          slotNum = splitInfo.partNumber;
          totalSlotsNum = splitInfo.totalParts;
          totalTargetMins = (item as any).originalRequestedMinutes || splitInfo.originalDurationMinutes;
        }

        updatedSlots.push({
          id: slotId,
          targetId: item.targetId,
          title: slotTitle,
          chapterName: item.chapterName,
          subjectCode: item.subjectCode,
          relevance: item.relevance,
          isMockTest: item.isMockTest || undefined,
          mockScheduledTime: item.mockScheduledTime,
          mockSeries: item.mockSeries,
          startTime: minutesToClockTime(safeStart),
          endTime: minutesToClockTime(safeEnd % 1440),
          startMinutes: safeStart,
          endMinutes: safeEnd,
          durationMinutes: actualAllocated,
          slotNumber: slotNum,
          totalSlots: totalSlotsNum,
          totalTargetMinutes: totalTargetMins,
          status: item.isCompleted ? 'completed' : 'pending'
        });
        addedSlotsCount++;
        changed = true;
      });

      // Guarantee slotting within max available gap on the 24h clock if free space remains
      unplacedItems.forEach((item, uIdx) => {
        const maxFree = getRemainingFreeClockMinutes(updatedSlots, minTodayStart);
        if (maxFree <= 0) return;
        const desiredDur = Math.min(item.durationMinutes, maxFree);
        const gap = findEarliestNonOverlappingWindow(
          updatedSlots,
          desiredDur,
          Math.max(rationale.estimatedStudyStartMinutes, minTodayStart),
          minTodayStart
        );
        if (gap.endMinutes <= gap.startMinutes) return;
        const actualDur = Math.max(1, gap.endMinutes - gap.startMinutes);
        updatedSlots.push({
          id: `slot_reconciled_ovf_${Date.now()}_${uIdx}_${Math.random().toString(36).slice(2, 6)}`,
          targetId: item.targetId,
          title: item.title,
          chapterName: item.chapterName,
          subjectCode: item.subjectCode,
          relevance: item.relevance,
          isMockTest: item.isMockTest || undefined,
          mockScheduledTime: item.mockScheduledTime,
          mockSeries: item.mockSeries,
          startTime: minutesToClockTime(gap.startMinutes),
          endTime: minutesToClockTime(gap.endMinutes % 1440),
          startMinutes: gap.startMinutes,
          endMinutes: gap.endMinutes,
          durationMinutes: actualDur,
          totalTargetMinutes: (item as any).originalRequestedMinutes || item.durationMinutes,
          status: item.isCompleted ? 'completed' : 'pending'
        });
        addedSlotsCount++;
        changed = true;
      });
    }
  }

  updatedSlots.sort((a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0));

  const seenSlotIds = new Set<string>();
  updatedSlots.forEach((s, idx) => {
    let sid = String(s.id || `slot_${Date.now()}_${idx}`);
    if (seenSlotIds.has(sid)) {
      sid = `${sid}_${idx}_${Math.random().toString(36).slice(2, 6)}`;
      s.id = sid;
      changed = true;
    } else if (!s.id) {
      s.id = sid;
      changed = true;
    }
    seenSlotIds.add(sid);
  });

  const validatedSlots = changed
    ? ensureProspectiveSchedule(currentSlots, updatedSlots, selectedDate)
    : currentSlots;

  const areSlotsEquivalent = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const s1 = a[i];
      const s2 = b[i];
      if (
        String(s1.targetId || '') !== String(s2.targetId || '') ||
        String(s1.title || '') !== String(s2.title || '') ||
        Number(s1.startMinutes || 0) !== Number(s2.startMinutes || 0) ||
        Number(s1.endMinutes || 0) !== Number(s2.endMinutes || 0) ||
        Number(s1.durationMinutes || 0) !== Number(s2.durationMinutes || 0) ||
        String(s1.status || 'pending') !== String(s2.status || 'pending')
      ) {
        return false;
      }
    }
    return true;
  };

  const actuallyChanged = changed && !areSlotsEquivalent(currentSlots, validatedSlots);
  const finalSlotsToUse = actuallyChanged ? validatedSlots : currentSlots;

  if (actuallyChanged) {
    try {
      localStorage.setItem(clockKey, JSON.stringify(validatedSlots));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
    } catch (e) {}
  }

  const totalClockMinutes = finalSlotsToUse.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
  const totalSavedEarlyMinutes = finalSlotsToUse.reduce(
    (acc, s) => acc + (Number(s.earlySavedMinutes) || Math.max(0, (Number(s.originalDurationMinutes) || 0) - (Number(s.durationMinutes) || 0))),
    0
  );

  return {
    reconciled: actuallyChanged,
    addedSlotsCount: actuallyChanged ? addedSlotsCount : 0,
    adjustedSlotsCount: actuallyChanged ? adjustedSlotsCount : 0,
    totalClockMinutes,
    totalSavedEarlyMinutes
  };
  } finally {
    isReconcilingTargetClock = false;
  }
}

/**
 * Pulls up / repacks pending 24-Hour Target Clock slots into time freed by early completions,
 * while keeping completed and currently active slots locked in their achieved positions.
 */
export function repackPendingClockSlotsIntoFreedTime(selectedDate: string, level?: CALevel): {
  repackedCount: number;
  earliestPendingStartTime: string | null;
} {
  if (!selectedDate) return { repackedCount: 0, earliestPendingStartTime: null };
  const activeLevel = level || getSelectedCALevel();
  const clockKey = getClockSlotsStorageKey(selectedDate, activeLevel);
  let currentSlots: any[] = [];
  try {
    const raw = localStorage.getItem(clockKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) currentSlots = parsed;
    }
  } catch (e) {}

  if (currentSlots.length === 0) return { repackedCount: 0, earliestPendingStartTime: null };

  const restrictionMark = getProspectiveRestrictionMark(currentSlots, selectedDate);

  // Freeze ONLY completed slots during auto-correct repacking
  const frozenSlots = currentSlots.filter(s => s.status === 'completed');
  const frozenIds = new Set(frozenSlots.map(s => String(s.id || '')));

  // All uncompleted slots can be repacked
  const pendingSlots = currentSlots.filter(s =>
    !frozenIds.has(String(s.id || '')) && s.status !== 'completed'
  );

  if (pendingSlots.length === 0) return { repackedCount: 0, earliestPendingStartTime: null };

  const rationale = analyzeUserDayRationale(selectedDate, activeLevel);
  const anchorStart = Math.max(restrictionMark, rationale.estimatedStudyStartMinutes);

  const fixedBusy = frozenSlots.map(s => ({
    start: Number(s.startMinutes) || 0,
    end: Number(s.endMinutes) || 0
  }));

  const { placedItems, unplacedItems } = fitOrderedItemsToRationaleTimeline(
    pendingSlots,
    rationale,
    anchorStart,
    fixedBusy,
    {
      enforceStudyBreakRule: true,
      minTransitionGap: 5,
      protectSleepWindow: true
    }
  );

  const repackedPending: any[] = placedItems.map(({ item, startMinutes, endMinutes, durationMinutes, splitInfo }) => {
    let slotId = item.id;
    let slotTitle = item.title;
    let slotNum = item.slotNumber;
    let totalSlotsNum = item.totalSlots;
    let totalTargetMins = item.totalTargetMinutes || item.durationMinutes;

    if (splitInfo) {
      const baseId = item.id.replace(/_p\d+$/, '');
      slotId = `${baseId}_p${splitInfo.partNumber}`;
      const cleanTitle = (item.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      slotTitle = `${cleanTitle} (Part ${splitInfo.partNumber}/${splitInfo.totalParts})`;
      slotNum = splitInfo.partNumber;
      totalSlotsNum = splitInfo.totalParts;
      totalTargetMins = splitInfo.originalDurationMinutes;
    }

    return {
      ...item,
      id: slotId,
      title: slotTitle,
      slotNumber: slotNum,
      totalSlots: totalSlotsNum,
      totalTargetMinutes: totalTargetMins,
      startMinutes,
      endMinutes,
      durationMinutes,
      startTime: minutesToClockTime(startMinutes),
      endTime: minutesToClockTime(endMinutes % 1440)
    };
  });

  let fallbackCursor = repackedPending.length > 0
    ? Math.max(restrictionMark, repackedPending[repackedPending.length - 1].endMinutes)
    : anchorStart;
  unplacedItems.forEach(item => {
    const dur = Math.max(1, Number(item.durationMinutes) || 45);
    const gap = findRealisticGapOnClock(
      [...frozenSlots, ...repackedPending],
      dur,
      fallbackCursor,
      restrictionMark,
      selectedDate
    );
    repackedPending.push({
      ...item,
      startMinutes: gap.startMinutes,
      endMinutes: gap.endMinutes,
      durationMinutes: Math.max(1, gap.endMinutes - gap.startMinutes),
      startTime: minutesToClockTime(gap.startMinutes),
      endTime: minutesToClockTime(gap.endMinutes % 1440)
    });
    fallbackCursor = gap.endMinutes;
  });

  const candidateFinalSlots = [...frozenSlots, ...repackedPending].sort(
    (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
  );
  const finalSlots = ensureProspectiveSchedule(currentSlots, candidateFinalSlots, selectedDate);

  localStorage.setItem(clockKey, JSON.stringify(finalSlots));
  window.dispatchEvent(new Event('practca_target_clock_updated'));
  window.dispatchEvent(new Event('practca_flow_updated'));

  return {
    repackedCount: repackedPending.length,
    earliestPendingStartTime: repackedPending.length > 0 ? repackedPending[0].startTime : null
  };
}

export { useTargetSystemSync, forceRefetchTargetSystemFromFirestore };

