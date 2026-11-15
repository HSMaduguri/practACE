/**
 * Unified Bidirectional Log Synchronization Engine
 * Handles synchronization between Grind Clock (practca_pomo_logs, focusSessions),
 * Revision Planner (practca_revision_planner_logs, per-subject chapters),
 * and 24-Hour Target Clock.
 */

import { SubjectId, RevisionCycleKey } from '../types';
import { 
  getCanonicalChapterKey, 
  SUBJECT_CHAPTERS, 
  computeSubjectMilestoneRevisionCount,
  resolveLatestLogCompletionDate,
  getSubjectDynamicRevKeys
} from '../components/RevisionPlanner';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { resolveNextExamSprintInfo, isLmrModeCurrentlyOn } from '../components/LmrSprintBoard';
import { reconcileAllTargetSystems } from './targetReconciliationEngine';
import { getSelectedCALevel, getLevelForSubject } from '../data/curriculumLevels';
import { getLevelScopedKey, getLevelFirestoreDocId, getDefaultSubjectForLevel } from './levelStorage';

export interface UnifiedStudyLogInput {
  id?: string;
  subjectId: SubjectId;
  chapterName?: string;
  durationMinutes: number;
  timestamp?: string; // ISO string
  notes?: string;
  taskTitle?: string;
  revKey?: RevisionCycleKey;
  relevance?: 'General' | 'Revision' | 'Final Revision';
  markRevisionCompleted?: boolean;
}

export interface SanitizedPomoLog {
  id: string;
  date?: string;
  mode: 'study' | 'break' | 'sleep' | 'routine';
  startTime: string;
  endTime: string;
  durationSeconds: number;
  subjectId?: SubjectId;
  notes?: string;
  chapterName?: string;
  taskCompleted?: boolean;
  completed?: boolean;
  status?: string;
}

/**
 * Deduplicate session logs by ID, exact fingerprint, or fuzzy timestamp window
 */
export const deduplicateSessionLogs = (logsList: any[]): any[] => {
  if (!Array.isArray(logsList)) return [];
  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  const cleaned: any[] = [];

  for (const log of logsList) {
    if (!log) continue;
    const id = log.id || `log_${Math.random()}`;
    if (seenIds.has(id)) continue;

    const dateStr = log.date || '';
    const mode = log.mode || '';
    const sub = log.subjectId || '';
    const start = (log.startTime || '').trim();
    const end = (log.endTime || '').trim();
    const durSecs = Math.round((log.durationSeconds || 0) / 10) * 10;
    const notes = (log.notes || '').trim().toLowerCase();

    // Fingerprints for identical or duplicate events
    const fpExact = `${dateStr}|${mode}|${sub}|${start}|${end}`;
    const fpFuzzy = `${dateStr}|${mode}|${sub}|${start}|${durSecs}|${notes.substring(0, 24)}`;

    if ((start && end && seenFingerprints.has(fpExact)) || (start && durSecs > 0 && seenFingerprints.has(fpFuzzy))) {
      continue;
    }

    seenIds.add(id);
    if (start && end) seenFingerprints.add(fpExact);
    if (start && durSecs > 0) seenFingerprints.add(fpFuzzy);
    cleaned.push(log);
  }

  return cleaned;
};

/**
 * Detects whether a task or study session is a non-Revision-Report activity
 * (such as a Digital Study Block, Mock Test, MCQ Practice, or generic non-chapter session)
 * that must NOT show a revision marking toggle or update Revision Report chapter completion.
 */
export function isNonRevisionReportActivity(input: {
  title?: string;
  cleanTitle?: string;
  chapterName?: string;
  notes?: string;
  description?: string;
  isMockTest?: boolean;
  isMcq?: boolean;
  studySubMode?: string;
}): boolean {
  if (!input) return false;
  if (input.isMockTest || input.isMcq || input.studySubMode === 'mcq') return true;

  const primaryTexts = [input.title, input.cleanTitle, input.chapterName]
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    .map(t => t.trim());

  const allTexts = [...primaryTexts, input.notes, input.description]
    .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    .map(t => t.trim());

  for (const text of allTexts) {
    // 1. Mock Tests / Test Papers
    if (/\[mock\s*test/i.test(text) || /\bmock\s*test\b/i.test(text) || /\bmock\s*exam\b/i.test(text) || /\bfull\s*syllabus\s*test\b/i.test(text)) {
      return true;
    }
    // 2. MCQ Practice / Drills
    if (/\[mcq\s*practice\]/i.test(text) || /\bmcq\s*practice\b/i.test(text) || /\bmcq\s*drill\b/i.test(text) || /\bmcq\s*session\b/i.test(text) || /^mcq\s*[:\-–]/i.test(text)) {
      return true;
    }
  }

  for (const text of primaryTexts) {
    const cleaned = text
      .replace(/ClubGroupId:\s*[^\s]+/gi, '')
      .replace(/MilestoneId:\s*[^\s]+/gi, '')
      .replace(/\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|AFM|FR|Audit|DT|IDT|IBS)\s*\]/gi, '')
      .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/gi, '')
      .replace(/\[\s*(?:R\d+|1\.5D|BL|G)\s*\]/gi, '')
      .replace(/[🔴🟡🔵🟢⚡🎯⭐✨⏱️📅📌]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (/digital\s*study\s*block/i.test(cleaned)) {
      return true;
    }
    if (/^(?:study\s*block|focus\s*block|pomodoro\s*block|general\s*study|general|general\s*\/\s*entire\s*subject|comprehensive\s*subject\s*revision|subject\s*revision|general\s*revision|free\s*study|unstructured\s*study|self\s*study|study\s*session|focus\s*session)$/i.test(cleaned)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves a target chapter name strictly to an official Revision Report chapter of the given subject.
 * Returns null if the activity is a Digital Study Block, Mock Test, MCQ Practice, or not listed in the Revision Report.
 */
export function resolveTargetChapterForSubject(
  subjectId: SubjectId,
  chapterName?: string,
  taskTitle?: string,
  notes?: string
): string | null {
  if (!subjectId) return null;
  if (isNonRevisionReportActivity({ chapterName, title: taskTitle, notes })) {
    return null;
  }

  const officialList = SUBJECT_CHAPTERS[subjectId] || [];
  if (officialList.length === 0) return null;

  const subLevel = getLevelForSubject(subjectId);
  // Verify against stored Revision Report chapters for this subject if initialized
  let reportChapterSet: Set<string> | null = null;
  try {
    const storedRaw = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subjectId}`, subLevel));
    if (storedRaw) {
      const parsed = JSON.parse(storedRaw);
      if (parsed && parsed.chapters && typeof parsed.chapters === 'object') {
        const keys = Object.keys(parsed.chapters);
        if (keys.length > 0) {
          reportChapterSet = new Set(keys.map(k => getCanonicalChapterKey(subjectId, k)));
        }
      }
    }
  } catch (e) {}

  const isListedInRevisionReport = (ch: string): boolean => {
    if (!officialList.includes(ch)) return false;
    if (reportChapterSet && reportChapterSet.size > 0) {
      return reportChapterSet.has(ch) || officialList.includes(ch);
    }
    return true;
  };

  // Clean candidate text from metadata tags, emojis, and task action prefixes
  const sanitize = (raw?: string): string => {
    if (!raw) return '';
    return raw
      .replace(/ClubGroupId:\s*[^\s]+/gi, '')
      .replace(/MilestoneId:\s*[^\s]+/gi, '')
      .replace(/\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|AFM|FR|Audit|DT|IDT|IBS)\s*\]/gi, '')
      .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/gi, '')
      .replace(/\[\s*(?:R\d+|1\.5D|BL|G)\s*\]/gi, '')
      .replace(/[🔴🟡🔵🟢⚡🎯⭐✨⏱️📅📌]/g, '')
      .replace(/^(?:STUDY|REVISE|READ|DO)\s*[:\-–]?\s*/gi, '')
      .replace(/\s+(?:REVISION|SESSION|PREP)$/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const primaryCandidates = [
    sanitize(chapterName),
    sanitize(taskTitle)
  ].filter(c => c.length > 0 && !isNonRevisionReportActivity({ title: c, chapterName: c }));

  const fallbackNotesCandidate = primaryCandidates.length === 0 ? sanitize(notes) : '';
  const candidates = [
    ...primaryCandidates,
    ...(fallbackNotesCandidate && !isNonRevisionReportActivity({ title: fallbackNotesCandidate }) ? [fallbackNotesCandidate] : [])
  ];

  // 1. Exact case-insensitive match against official Revision Report chapters
  for (const cand of candidates) {
    const candLower = cand.toLowerCase();
    const exactMatch = officialList.find(ch => ch.toLowerCase() === candLower);
    if (exactMatch && isListedInRevisionReport(exactMatch)) {
      return exactMatch;
    }
  }

  // 2. Canonical chapter key resolution (with strict guard against bare numbers or "Digital Study Block")
  for (const cand of candidates) {
    if (/^\d+$/.test(cand)) continue;
    const canon = getCanonicalChapterKey(subjectId, cand);
    if (canon && canon !== cand && isListedInRevisionReport(canon)) {
      return canon;
    }
    if (canon && officialList.includes(canon) && isListedInRevisionReport(canon)) {
      return canon;
    }
  }

  // 3. Full chapter name contained within candidate title (sorted longest chapter name first)
  const sortedOfficial = [...officialList].sort((a, b) => b.length - a.length);
  for (const cand of candidates) {
    const candLower = cand.toLowerCase();
    if (candLower.length >= 6) {
      const containedMatch = sortedOfficial.find(ch => {
        const chLower = ch.toLowerCase();
        return candLower.includes(chLower) && isListedInRevisionReport(ch);
      });
      if (containedMatch) return containedMatch;
    }
  }

  return null;
}

export interface ResolvedActiveRevisionInfo {
  key: string;
  label: string;
  badge: string;
  dynamicRevKeys: string[];
  allDone: boolean;
  skippedPriorRevs: string[];
}

/**
 * Resolves the active revision cycle for a Revision Report chapter using the exact same rules
 * as the Revision Report logging system, including advancing past skipped revision lines
 * and identifying prior incomplete revision lines that are skipped when targeting a later revision.
 */
export function resolveActiveRevisionForChapter(
  subjectId: SubjectId,
  chapterName: string,
  options?: {
    revKey?: string;
    relevance?: string;
    title?: string;
    notes?: string;
    milestoneId?: string;
    chaptersStateOverride?: Record<string, any>;
  }
): ResolvedActiveRevisionInfo {
  const canonicalChapter = resolveTargetChapterForSubject(subjectId, chapterName, options?.title, options?.notes)
    || getCanonicalChapterKey(subjectId, chapterName);

  let chapters: Record<string, Record<string, any>> = options?.chaptersStateOverride || {};
  if (!options?.chaptersStateOverride) {
    try {
      const subLevel = getLevelForSubject(subjectId);
      const stored = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subjectId}`, subLevel));
      if (stored) {
        const parsed = JSON.parse(stored);
        chapters = parsed?.chapters || {};
      }
    } catch (e) {}
  }

  const dynamicRevsCount = computeSubjectMilestoneRevisionCount(subjectId, chapters as any);
  const dynamicRevKeys = getSubjectDynamicRevKeys(dynamicRevsCount);
  const chData = chapters[canonicalChapter] || chapters[chapterName] || {};

  const formatRevInfo = (targetKey: string, allDoneFlag = false): ResolvedActiveRevisionInfo => {
    const targetIdx = dynamicRevKeys.indexOf(targetKey);
    const skippedPriorRevs: string[] = [];
    if (targetIdx > 0) {
      for (let i = 0; i < targetIdx; i++) {
        const priorRk = dynamicRevKeys[i];
        if (!chData?.[priorRk]?.completed) {
          skippedPriorRevs.push(priorRk);
        }
      }
    }

    if (targetKey === 'baseline') {
      return { key: 'baseline', label: 'General Study (Baseline)', badge: 'G', dynamicRevKeys, allDone: allDoneFlag, skippedPriorRevs };
    }
    if (targetKey === 'rev1.5') {
      return { key: 'rev1.5', label: '1.5 Day Peak Revision', badge: '1.5D', dynamicRevKeys, allDone: allDoneFlag, skippedPriorRevs };
    }
    const revMatch = targetKey.match(/^rev(\d+)$/);
    if (revMatch) {
      const num = parseInt(revMatch[1], 10);
      const ordinal = num === 1 ? '1st' : num === 2 ? '2nd' : num === 3 ? '3rd' : `${num}th`;
      return { key: targetKey, label: `${ordinal} Revision (R${num})`, badge: `R${num}`, dynamicRevKeys, allDone: allDoneFlag, skippedPriorRevs };
    }
    return { key: 'rev1', label: '1st Revision (R1)', badge: 'R1', dynamicRevKeys, allDone: allDoneFlag, skippedPriorRevs };
  };

  // 1. Check explicit revKey if valid
  let candidateKey = options?.revKey && options.revKey !== 'none' && options.revKey !== 'skip' ? options.revKey : undefined;

  // 2. Check explicit title/notes tags or relevance
  if (!candidateKey) {
    const titleUpper = `${options?.title || ''} ${options?.notes || ''}`.toUpperCase();
    if (options?.relevance === 'Final Revision' || /\b(FINAL REVISION|1\.5\s*DAY|1\.5D|R1\.5|REV\s*1\.5)\b/.test(titleUpper)) {
      candidateKey = 'rev1.5';
    } else if (/\b(BASELINE|BL\s*STUDY)\b/.test(titleUpper)) {
      candidateKey = 'baseline';
    } else {
      const explicitRev = titleUpper.match(/\b(?:R|REV|REVISION)\s*(\d+)\b/);
      if (explicitRev) {
        candidateKey = `rev${parseInt(explicitRev[1], 10)}`;
      }
    }
  }

  // 3. Check linked milestone checkpoint revisionCycle if milestoneId is present
  if (!candidateKey && options?.milestoneId) {
    try {
      const subLevel = getLevelForSubject(subjectId);
      const rawMs = localStorage.getItem(getLevelScopedKey('practca_study_milestones', subLevel));
      if (rawMs) {
        const msList = JSON.parse(rawMs);
        if (Array.isArray(msList)) {
          const foundCp = msList.find((m: any) => m && m.id === options.milestoneId);
          if (foundCp?.revisionCycle) {
            candidateKey = foundCp.revisionCycle;
          }
        }
      }
    } catch (e) {}
  }

  // 4. General relevance strictly maps to Baseline Study in Revision Report
  if (!candidateKey && options?.relevance === 'General') {
    candidateKey = 'baseline';
  }

  // 5. Determine active revision from Revision Report logging rules:
  // Find the highest milestone revision index across the subject that has actual activity (completed, hours > 0, partially_done, or skipped)
  let subjectActiveRevIdx = 0;
  for (let i = dynamicRevKeys.length - 1; i >= 0; i--) {
    const rk = dynamicRevKeys[i];
    const hasSubjectActivityAtRk = Object.values(chapters).some((cObj: any) => {
      const st = cObj?.[rk];
      if (!st) return false;
      return Boolean(st.completed || st.skipped || st.statusTag === 'skipped' || st.statusTag === 'partially_done' || (parseFloat(st.hours || '0') || 0) > 0);
    });
    if (hasSubjectActivityAtRk) {
      subjectActiveRevIdx = i;
      break;
    }
  }

  if (candidateKey && dynamicRevKeys.includes(candidateKey)) {
    // If this specific revision line was skipped and moved to the next one, advance to the next non-skipped revision
    let idx = dynamicRevKeys.indexOf(candidateKey);
    while (idx < dynamicRevKeys.length - 1 && (chData?.[dynamicRevKeys[idx]]?.skipped || chData?.[dynamicRevKeys[idx]]?.statusTag === 'skipped')) {
      idx++;
    }
    return formatRevInfo(dynamicRevKeys[idx], Boolean(chData?.[dynamicRevKeys[idx]]?.completed));
  }

  if (candidateKey === 'baseline' || candidateKey === 'rev1.5') {
    return formatRevInfo(candidateKey, Boolean(chData?.[candidateKey]?.completed));
  }

  // Default Revision Report resolution:
  // Start from the subject's active revision set (e.g., if AFM is on R3, start at R3 so manually completed chapters log to R3 and mark R2 as skipped),
  // and if the chapter's revision at that line is already completed or skipped, advance to the next available revision line.
  for (let i = subjectActiveRevIdx; i < dynamicRevKeys.length; i++) {
    const rk = dynamicRevKeys[i];
    const st = chData?.[rk];
    const isDone = Boolean(st?.completed);
    const isSkipped = Boolean(st?.skipped || st?.statusTag === 'skipped');
    if (!isDone && !isSkipped) {
      return formatRevInfo(rk, false);
    }
  }

  // If all milestone revisions from subjectActiveRevIdx onwards were skipped or done, check if any earlier non-skipped revision is still open
  for (let i = 0; i < subjectActiveRevIdx; i++) {
    const rk = dynamicRevKeys[i];
    const st = chData?.[rk];
    const isDone = Boolean(st?.completed);
    const isSkipped = Boolean(st?.skipped || st?.statusTag === 'skipped');
    if (!isDone && !isSkipped) {
      return formatRevInfo(rk, false);
    }
  }

  // Finally check 1.5 Day revision
  if (!chData?.['rev1.5']?.completed) {
    return formatRevInfo('rev1.5', false);
  }

  const fallbackLatestKey = dynamicRevKeys[subjectActiveRevIdx] || dynamicRevKeys[dynamicRevKeys.length - 1] || 'rev1';
  return formatRevInfo(fallbackLatestKey, true);
}

/**
 * Deduplicate Revision Planner logs
 */
export const deduplicateRevisionLogs = (logsList: any[]): any[] => {
  if (!Array.isArray(logsList)) return [];
  const seenIds = new Set<string>();
  const seenExact = new Set<string>();
  const cleaned: any[] = [];

  for (const l of logsList) {
    if (!l) continue;
    const id = l.id || `rev_log_${Math.random()}`;
    if (seenIds.has(id)) continue;

    const sub = String(l.subjectId || '').trim().toUpperCase();
    const chap = getCanonicalChapterKey(sub as SubjectId, String(l.chapterName || '').trim()).toLowerCase();
    const rev = String(l.revKey || l.revisionNumber || '').trim().toLowerCase();
    const dur = Math.round(Number(l.durationMinutes || 0));
    const tsDate = (l.timestamp || l.date || '').substring(0, 16); // up to minute

    const exactKey = `${sub}|${chap}|${rev}|${dur}|${tsDate}`;
    if (seenExact.has(exactKey)) continue;

    seenIds.add(id);
    seenExact.add(exactKey);
    cleaned.push(l);
  }

  return cleaned;
};

/**
 * Automatically syncs a study session from Grind Clock into Revision Planner
 */
export async function syncStudySessionToRevisionPlanner(input: UnifiedStudyLogInput): Promise<void> {
  try {
    const subjectId = input.subjectId;
    if (!subjectId) return;

    // Skip non-Revision-Report activities (Digital Study Blocks, Mock Tests, MCQ Practice, etc.)
    if (isNonRevisionReportActivity({
      chapterName: input.chapterName,
      title: input.taskTitle,
      notes: input.notes
    })) {
      return;
    }

    const timestamp = input.timestamp || new Date().toISOString();
    const durationMinutes = Math.max(1, Math.round(input.durationMinutes));

    // Resolve chapter name strictly against official chapters
    const canonicalChapter = resolveTargetChapterForSubject(
      subjectId,
      input.chapterName,
      input.taskTitle,
      input.notes
    );

    // If no valid chapter is matched for this subject, do NOT dump into Chapter 1!
    if (!canonicalChapter) {
      console.info(`[syncStudySession] No specific chapter matched for subject ${subjectId}; skipping chapter hours inflation.`);
      return;
    }

    const subLevel = getLevelForSubject(subjectId);
    // Load subject chapters
    const localKey = getLevelScopedKey(`practca_revision_planner_${subjectId}`, subLevel);
    let chapters: Record<string, Record<string, any>> = {};
    const currentUser = auth.currentUser;
    const isRealUser = currentUser && currentUser.uid !== 'guest_user';

    if (isRealUser) {
      try {
        const subRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subjectId, subLevel));
        const subSnap = await getDoc(subRef);
        if (subSnap.exists()) {
          chapters = subSnap.data().chapters || {};
        } else {
          const stored = localStorage.getItem(localKey);
          if (stored) chapters = JSON.parse(stored).chapters || {};
        }
      } catch (e) {
        const stored = localStorage.getItem(localKey);
        if (stored) chapters = JSON.parse(stored).chapters || {};
      }
    } else {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        try {
          chapters = JSON.parse(stored).chapters || {};
        } catch (e) {}
      }
    }

    const dynamicRevsCount = computeSubjectMilestoneRevisionCount(subjectId, chapters as any);
    const dynamicRevKeys = getSubjectDynamicRevKeys(dynamicRevsCount);
    const allStageKeys = ['baseline', ...dynamicRevKeys, 'rev1.5'];

    // Ensure canonical chapter object exists
    if (!chapters[canonicalChapter]) {
      chapters[canonicalChapter] = {};
    }
    allStageKeys.forEach(sk => {
      if (!chapters[canonicalChapter][sk]) {
        chapters[canonicalChapter][sk] = { completed: false, hours: '' };
      }
    });

    // Resolve active target revision key using the unified Revision Report resolution engine
    const resolvedRev = resolveActiveRevisionForChapter(subjectId, canonicalChapter, {
      revKey: input.revKey,
      relevance: input.relevance,
      title: input.taskTitle,
      notes: input.notes,
      chaptersStateOverride: chapters
    });
    const targetRevKey = resolvedRev.key;

    // When targeting 1.5-Day LMR (rev1.5), only the currently active exam subject may record LMR logs;
    // all other subjects must remain nil for rev1.5
    if (targetRevKey === 'rev1.5') {
      try {
        if (isLmrModeCurrentlyOn()) {
          const activeSprint = resolveNextExamSprintInfo();
          if (activeSprint.subjectId.toUpperCase() !== subjectId.toUpperCase()) {
            return;
          }
        }
      } catch {}
    }

    // When targeting a milestone revision (e.g. rev3), mark all prior incomplete revisions as skipped
    const targetRevIndex = dynamicRevKeys.indexOf(targetRevKey);
    if (targetRevIndex > 0) {
      for (let i = 0; i < targetRevIndex; i++) {
        const priorRk = dynamicRevKeys[i];
        const priorState = chapters[canonicalChapter]?.[priorRk];
        if (!priorState?.completed) {
          chapters[canonicalChapter][priorRk] = {
            ...priorState,
            completed: false,
            skipped: true,
            statusTag: 'skipped',
            hours: priorState?.hours || '0'
          };
        }
      }
    }

    // Load revision logs
    let logs: any[] = [];
    const revLogsKey = getLevelScopedKey('practca_revision_planner_logs', subLevel);
    const logsLocal = localStorage.getItem(revLogsKey);
    if (logsLocal) {
      try {
        logs = JSON.parse(logsLocal);
      } catch (e) {}
    }

    const logId = input.id || `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    // Check if log already exists by id or fingerprint
    const existingIndex = logs.findIndex(l => 
      l.id === logId || 
      (l.subjectId === subjectId && 
       getCanonicalChapterKey(subjectId, l.chapterName) === canonicalChapter && 
       l.revKey === targetRevKey && 
       l.timestamp === timestamp && 
       Math.abs(Number(l.durationMinutes || 0) - durationMinutes) <= 0.1)
    );

    const newLogItem = {
      id: logId,
      subjectId,
      chapterName: canonicalChapter,
      revKey: targetRevKey,
      durationMinutes,
      timestamp,
      taskTitle: input.taskTitle || input.notes || `Study: ${canonicalChapter}`
    };

    if (existingIndex >= 0) {
      logs[existingIndex] = newLogItem;
    } else {
      logs.push(newLogItem);
    }

    const deduplicatedLogs = deduplicateRevisionLogs(logs);

    // Calculate idempotent chapter milestone hours strictly from deduplicated logs
    const cycleLogs = deduplicatedLogs.filter(l => 
      l.subjectId === subjectId &&
      getCanonicalChapterKey(subjectId, l.chapterName) === canonicalChapter &&
      l.revKey === targetRevKey
    );
    const logMinutes = cycleLogs.reduce((acc, l) => acc + (Number(l.durationMinutes) || 0), 0);
    const logHours = logMinutes > 0 ? parseFloat((logMinutes / 60).toFixed(2)) : 0;

    const existingHoursNum = parseFloat(chapters[canonicalChapter][targetRevKey]?.hours || '0') || 0;
    const effectiveHours = logHours > 0 ? logHours : existingHoursNum;
    const formattedHours = effectiveHours > 0 ? parseFloat(effectiveHours.toFixed(2)).toString() : (chapters[canonicalChapter][targetRevKey]?.hours || '');

    const willBeCompleted = input.markRevisionCompleted ? true : (chapters[canonicalChapter][targetRevKey]?.completed || false);
    const latestLogDate = willBeCompleted
      ? (chapters[canonicalChapter][targetRevKey]?.isManualDateOverride && chapters[canonicalChapter][targetRevKey]?.completedAt
          ? chapters[canonicalChapter][targetRevKey]?.completedAt
          : resolveLatestLogCompletionDate(subjectId, canonicalChapter, targetRevKey, deduplicatedLogs, timestamp))
      : chapters[canonicalChapter][targetRevKey]?.completedAt;

    chapters[canonicalChapter][targetRevKey] = {
      ...chapters[canonicalChapter][targetRevKey],
      hours: formattedHours,
      completed: willBeCompleted,
      skipped: false,
      statusTag: willBeCompleted ? 'completed' : (effectiveHours > 0 ? 'partially_done' : chapters[canonicalChapter][targetRevKey]?.statusTag),
      completedAt: latestLogDate
    };

    const finalRevisionsCount = computeSubjectMilestoneRevisionCount(subjectId, chapters as any, deduplicatedLogs);

    // Persist to localStorage
    localStorage.setItem(localKey, JSON.stringify({
      revisionsCount: finalRevisionsCount,
      chapters
    }));
    localStorage.setItem(revLogsKey, JSON.stringify(deduplicatedLogs));

    // Persist to Firestore if user logged in
    if (isRealUser) {
      try {
        const subRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subjectId, subLevel));
        await setDoc(subRef, {
          subjectId,
          caLevel: subLevel,
          revisionsCount: finalRevisionsCount,
          chapters,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        const logsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', subLevel));
        await setDoc(logsRef, {
          caLevel: subLevel,
          logs: deduplicatedLogs,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Firestore sync error in syncStudySessionToRevisionPlanner:", err);
      }
    }

    try {
      const sessionDate = timestamp ? String(timestamp).slice(0, 10) : new Date().toISOString().slice(0, 10);
      reconcileAllTargetSystems(sessionDate, { source: 'logs', dispatchEvents: true });
    } catch (recErr) {
      // ignore
    }

    window.dispatchEvent(new Event('practca_revision_update'));
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Error in syncStudySessionToRevisionPlanner:", error);
  }
}

/**
 * Bidirectionally deletes a log across all stores:
 * 1. practca_pomo_logs
 * 2. practca_focus_sessions (and Firestore users/{uid}/focusSessions/{id})
 * 3. practca_sleep_sessions
 * 4. practca_revision_planner_logs (and Firestore users/{uid}/revisionPlanner/logs)
 * 5. Recalculates hours and completion dates for Revision Planner chapters
 */
export async function deleteLinkedLogEverywhere(params: {
  logId: string;
  subjectId?: SubjectId;
  chapterName?: string;
  durationMinutes?: number;
  timestamp?: string;
  revKey?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  mode?: string;
}): Promise<void> {
  const { logId } = params;
  if (!logId) return;

  const baseLogId = logId.replace(/(?:_split_|-split-)\d+$/, '');
  const currentUser = auth.currentUser;
  const isRealUser = currentUser && currentUser.uid !== 'guest_user';

  const level = params.subjectId ? getLevelForSubject(params.subjectId) : getSelectedCALevel();
  const pomoKey = getLevelScopedKey('practca_pomo_logs', level);
  const focusKey = getLevelScopedKey('practca_focus_sessions', level);
  const sleepKey = getLevelScopedKey('practca_sleep_sessions', level);
  const revLogsKey = getLevelScopedKey('practca_revision_planner_logs', level);

  // 1. Purge from practca_pomo_logs
  try {
    const rawPomo = localStorage.getItem(pomoKey);
    if (rawPomo) {
      const parsedPomo = JSON.parse(rawPomo);
      if (Array.isArray(parsedPomo)) {
        const filteredPomo = parsedPomo.filter((l: any) => {
          if (!l) return false;
          if (l.id === logId || l.id === baseLogId) return false;
          if (typeof l.id === 'string' && (l.id.startsWith(`${baseLogId}_split_`) || l.id.startsWith(`${baseLogId}-split-`))) {
            return false;
          }
          // Fallback match by exact date + mode + startTime + endTime if duplicate entry existed
          if (
            params.date &&
            params.startTime &&
            params.mode &&
            l.date === params.date &&
            l.mode === params.mode &&
            l.startTime === params.startTime &&
            (!params.endTime || l.endTime === params.endTime)
          ) {
            return false;
          }
          return true;
        });
        localStorage.setItem(pomoKey, JSON.stringify(filteredPomo));
      }
    }
  } catch (e) {
    console.error("Error purging log from practca_pomo_logs:", e);
  }

  // 2. Purge from practca_focus_sessions & Cloud
  try {
    const rawFocus = localStorage.getItem(focusKey);
    const deletedFocusIds = new Set<string>([logId, baseLogId]);
    if (rawFocus) {
      const parsedFocus = JSON.parse(rawFocus);
      if (Array.isArray(parsedFocus)) {
        const filteredFocus = parsedFocus.filter((s: any) => {
          if (!s) return false;
          if (s.id === logId || s.id === baseLogId) {
            deletedFocusIds.add(s.id);
            return false;
          }
          return true;
        });
        localStorage.setItem(focusKey, JSON.stringify(filteredFocus));
      }
    }
    if (isRealUser) {
      deletedFocusIds.forEach(fId => {
        const docRef = doc(db, 'users', currentUser.uid, 'focusSessions', fId);
        deleteDoc(docRef).catch(() => {});
      });
    }
  } catch (e) {
    console.error("Error purging log from practca_focus_sessions:", e);
  }

  // 3. Purge from practca_sleep_sessions if sleep mode or matching ID
  try {
    const rawSleep = localStorage.getItem(sleepKey) || (level === 'final' ? null : localStorage.getItem('practca_sleep_sessions'));
    if (rawSleep) {
      const parsedSleep = JSON.parse(rawSleep);
      if (Array.isArray(parsedSleep)) {
        const filteredSleep = parsedSleep.filter((s: any) => {
          if (!s) return false;
          if (s.id === logId || s.id === baseLogId) return false;
          return true;
        });
        if (filteredSleep.length !== parsedSleep.length) {
          localStorage.setItem(sleepKey, JSON.stringify(filteredSleep));
        }
      }
    }
  } catch (e) {
    console.error("Error purging log from practca_sleep_sessions:", e);
  }

  // 4. Purge from practca_revision_planner_logs & update chapter hours
  try {
    const rawRevLogs = localStorage.getItem(revLogsKey);
    let revLogs: any[] = [];
    if (rawRevLogs) {
      try {
        revLogs = JSON.parse(rawRevLogs);
      } catch (e) {}
    }

    // Find target log in revision logs if not fully provided
    const targetRevLog = revLogs.find((l: any) => l.id === logId || l.id === baseLogId);
    const subId: SubjectId | undefined = params.subjectId || targetRevLog?.subjectId;
    const chapName = params.chapterName || targetRevLog?.chapterName;
    const revKey = params.revKey || targetRevLog?.revKey;
    const durMins = params.durationMinutes || targetRevLog?.durationMinutes || 0;

    const filteredRevLogs = revLogs.filter((l: any) => l.id !== logId && l.id !== baseLogId);
    localStorage.setItem(revLogsKey, JSON.stringify(filteredRevLogs));

    if (isRealUser) {
      try {
        const logsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', level));
        setDoc(logsRef, { caLevel: level, logs: filteredRevLogs, updatedAt: new Date().toISOString() });
      } catch (e) {}
    }

    // Deduct chapter hours & recompute latest log completion date if subject & chapter are known
    if (subId && chapName && revKey) {
      const subLevel = getLevelForSubject(subId);
      const canonicalChapter = getCanonicalChapterKey(subId, chapName);
      const localKey = getLevelScopedKey(`practca_revision_planner_${subId}`, subLevel);
      const storedSub = localStorage.getItem(localKey);
      if (storedSub) {
        try {
          const parsedSub = JSON.parse(storedSub);
          const chapters = parsedSub.chapters || {};
          if (chapters[canonicalChapter] && chapters[canonicalChapter][revKey]) {
            const remainingCycleLogs = filteredRevLogs.filter((l: any) =>
              l.subjectId === subId &&
              getCanonicalChapterKey(subId, l.chapterName) === canonicalChapter &&
              l.revKey === revKey
            );
            const remainingMins = remainingCycleLogs.reduce((acc: number, l: any) => acc + (Number(l.durationMinutes) || 0), 0);
            const remainingLogHours = remainingMins > 0 ? parseFloat((remainingMins / 60).toFixed(2)) : 0;
            const currentHours = parseFloat(chapters[canonicalChapter][revKey].hours || '0') || 0;
            const subtractedHours = durMins / 60;
            const fallbackHours = Math.max(0, currentHours - subtractedHours);
            const effectiveHours = remainingLogHours > 0 ? remainingLogHours : (remainingCycleLogs.length === 0 ? 0 : fallbackHours);
            const formattedHours = effectiveHours > 0 ? parseFloat(effectiveHours.toFixed(2)).toString() : '';

            const currentCompleted = chapters[canonicalChapter][revKey].completed;
            const isManualOverride = chapters[canonicalChapter][revKey].isManualDateOverride;
            const nextCompletedAt = (currentCompleted && !isManualOverride)
              ? resolveLatestLogCompletionDate(subId, canonicalChapter, revKey, filteredRevLogs, chapters[canonicalChapter][revKey].completedAt)
              : chapters[canonicalChapter][revKey].completedAt;

            chapters[canonicalChapter][revKey] = {
              ...chapters[canonicalChapter][revKey],
              hours: formattedHours,
              completedAt: nextCompletedAt
            };

            const finalRevisionsCount = computeSubjectMilestoneRevisionCount(subId, chapters, filteredRevLogs);
            localStorage.setItem(localKey, JSON.stringify({
              revisionsCount: finalRevisionsCount,
              chapters
            }));

            if (isRealUser) {
              const subRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subId, subLevel));
              setDoc(subRef, {
                subjectId: subId,
                caLevel: subLevel,
                revisionsCount: finalRevisionsCount,
                chapters,
                updatedAt: new Date().toISOString()
              }, { merge: true }).catch(() => {});
            }
          }
        } catch (e) {
          console.error("Error recalculating subject chapter hours on delete:", e);
        }
      }
    }
  } catch (e) {
    console.error("Error purging log from practca_revision_planner_logs:", e);
  }

  // 5. Reconcile target allocations & Sequence Flow for affected date
  try {
    const affectedDate = params.date || (params.timestamp ? String(params.timestamp).slice(0, 10) : new Date().toISOString().slice(0, 10));
    reconcileAllTargetSystems(affectedDate, { source: 'logs', dispatchEvents: true });
  } catch (recErr) {
    // ignore
  }

  // 6. Notify all components
  window.dispatchEvent(new Event('practca_pomo_logs_update'));
  window.dispatchEvent(new Event('practca_revision_update'));
  window.dispatchEvent(new Event('storage'));
}

export interface UpdateLinkedLogParams {
  logId: string;
  oldLog?: {
    date?: string;
    mode?: 'study' | 'break' | 'sleep' | 'routine';
    startTime?: string;
    endTime?: string;
    durationSeconds?: number;
    subjectId?: SubjectId;
    chapterName?: string;
    notes?: string;
    revKey?: string;
  };
  newLog: {
    id: string;
    date: string;
    mode: 'study' | 'break' | 'sleep' | 'routine';
    startTime: string;
    endTime: string;
    startIso: string;
    endIso: string;
    durationSeconds: number;
    durationMinutes: number;
    subjectId?: SubjectId;
    chapterName?: string;
    notes?: string;
    revKey?: RevisionCycleKey;
    feeling?: string;
  };
}

/**
 * Bidirectionally updates an existing log across all stores:
 * 1. practca_pomo_logs
 * 2. practca_focus_sessions (and Firestore users/{uid}/focusSessions/{id})
 * 3. practca_sleep_sessions
 * 4. practca_revision_planner_logs & chapter hours in Revision Planner
 */
export async function updateLinkedLogEverywhere(params: UpdateLinkedLogParams): Promise<void> {
  const { logId, oldLog, newLog } = params;
  if (!logId) return;

  const baseLogId = logId.replace(/(?:_split_|-split-)\d+$/, '');
  const currentUser = auth.currentUser;
  const isRealUser = currentUser && currentUser.uid !== 'guest_user';

  const activeSubForLevel = newLog.subjectId || oldLog?.subjectId;
  const level = activeSubForLevel ? getLevelForSubject(activeSubForLevel) : getSelectedCALevel();
  const pomoKey = getLevelScopedKey('practca_pomo_logs', level);
  const focusKey = getLevelScopedKey('practca_focus_sessions', level);
  const sleepKey = getLevelScopedKey('practca_sleep_sessions', level);
  const revLogsKey = getLevelScopedKey('practca_revision_planner_logs', level);

  // 1. Update in practca_pomo_logs
  try {
    const rawPomo = localStorage.getItem(pomoKey);
    const parsedPomo = rawPomo ? JSON.parse(rawPomo) : [];
    if (Array.isArray(parsedPomo)) {
      let foundInPomo = false;
      const updatedPomo = parsedPomo.map((l: any) => {
        if (!l) return l;
        const isMatch =
          l.id === logId ||
          l.id === baseLogId ||
          (oldLog &&
            l.date === oldLog.date &&
            l.mode === oldLog.mode &&
            l.startTime === oldLog.startTime &&
            l.endTime === oldLog.endTime);

        if (isMatch && !foundInPomo) {
          foundInPomo = true;
          return {
            ...l,
            id: newLog.id || logId,
            date: newLog.date,
            mode: newLog.mode,
            startTime: newLog.startTime,
            endTime: newLog.endTime,
            durationSeconds: newLog.durationSeconds,
            subjectId: newLog.mode === 'study' ? newLog.subjectId : undefined,
            chapterName: newLog.mode === 'study' ? newLog.chapterName : undefined,
            notes: newLog.notes
          };
        }
        return l;
      });

      if (!foundInPomo) {
        updatedPomo.unshift({
          id: newLog.id || logId,
          date: newLog.date,
          mode: newLog.mode,
          startTime: newLog.startTime,
          endTime: newLog.endTime,
          durationSeconds: newLog.durationSeconds,
          subjectId: newLog.mode === 'study' ? newLog.subjectId : undefined,
          chapterName: newLog.mode === 'study' ? newLog.chapterName : undefined,
          notes: newLog.notes
        });
      }

      localStorage.setItem(pomoKey, JSON.stringify(updatedPomo));
    }
  } catch (e) {
    console.error("Error updating log in practca_pomo_logs:", e);
  }

  // 2. Update practca_focus_sessions & Cloud
  try {
    const rawFocus = localStorage.getItem(focusKey);
    const parsedFocus: any[] = rawFocus ? JSON.parse(rawFocus) : [];
    const oldDurationMins = oldLog?.durationSeconds ? Math.round(oldLog.durationSeconds / 60) : 0;

    if (newLog.mode === 'sleep') {
      // If changed to sleep, remove from focusSessions if it was there
      const filtered = parsedFocus.filter(s => s && s.id !== logId && s.id !== baseLogId);
      if (filtered.length !== parsedFocus.length) {
        localStorage.setItem(focusKey, JSON.stringify(filtered));
      }
      if (isRealUser) {
        deleteDoc(doc(db, 'users', currentUser.uid, 'focusSessions', logId)).catch(() => {});
        if (baseLogId !== logId) {
          deleteDoc(doc(db, 'users', currentUser.uid, 'focusSessions', baseLogId)).catch(() => {});
        }
      }
    } else {
      const targetSessionType: 'work' | 'break' | 'routine' =
        newLog.mode === 'study' ? 'work' : newLog.mode === 'routine' ? 'routine' : 'break';
      const defaultSub = getDefaultSubjectForLevel(level);
      const targetSub: SubjectId =
        newLog.mode === 'study'
          ? (newLog.subjectId || defaultSub)
          : defaultSub;

      let matchedFocusId: string | null = null;
      const updatedFocus = parsedFocus.map(s => {
        if (!s) return s;
        const isDirectId = s.id === logId || s.id === baseLogId;
        const sDate = s.timestamp ? s.timestamp.slice(0, 10) : '';
        const isFuzzyMatch =
          !matchedFocusId &&
          oldLog &&
          sDate === oldLog.date &&
          Math.abs((s.duration || 0) - oldDurationMins) <= 2 &&
          ((oldLog.mode === 'study' && s.sessionType === 'work') ||
            (oldLog.mode === 'routine' && s.sessionType === 'routine') ||
            (oldLog.mode === 'break' && s.sessionType === 'break'));

        if (isDirectId || isFuzzyMatch) {
          matchedFocusId = s.id;
          return {
            ...s,
            duration: newLog.durationMinutes,
            subjectId: targetSub,
            description: newLog.notes,
            sessionType: targetSessionType,
            timestamp: newLog.endIso,
            chapterName: newLog.mode === 'study' ? newLog.chapterName : undefined
          };
        }
        return s;
      });

      const finalFocusId = matchedFocusId || baseLogId;
      if (!matchedFocusId) {
        updatedFocus.push({
          id: finalFocusId,
          duration: newLog.durationMinutes,
          subjectId: targetSub,
          description: newLog.notes,
          sessionType: targetSessionType,
          timestamp: newLog.endIso,
          chapterName: newLog.mode === 'study' ? newLog.chapterName : undefined
        });
      }

      localStorage.setItem(focusKey, JSON.stringify(updatedFocus));

      if (isRealUser) {
        const docRef = doc(db, 'users', currentUser.uid, 'focusSessions', finalFocusId);
        const payload: Record<string, any> = {
          id: finalFocusId,
          duration: newLog.durationMinutes,
          subjectId: targetSub,
          caLevel: level,
          description: newLog.notes || '',
          sessionType: targetSessionType,
          timestamp: newLog.endIso
        };
        if (newLog.mode === 'study' && newLog.chapterName) {
          payload.chapterName = newLog.chapterName;
        }
        setDoc(docRef, payload, { merge: true }).catch(() => {});
      }
    }
  } catch (e) {
    console.error("Error updating log in practca_focus_sessions:", e);
  }

  // 3. Update practca_sleep_sessions
  try {
    const rawSleep = localStorage.getItem(sleepKey) || (level === 'final' ? null : localStorage.getItem('practca_sleep_sessions'));
    const parsedSleep: any[] = rawSleep ? JSON.parse(rawSleep) : [];
    if (newLog.mode === 'sleep') {
      let foundSleep = false;
      const oldDurMins = oldLog?.durationSeconds ? Math.round(oldLog.durationSeconds / 60) : 0;
      const updatedSleep = parsedSleep.map(s => {
        if (!s) return s;
        const sStartDate = s.startTime ? s.startTime.slice(0, 10) : '';
        const sEndDate = s.endTime ? s.endTime.slice(0, 10) : '';
        const isMatch =
          s.id === logId ||
          s.id === baseLogId ||
          (!foundSleep &&
            oldLog &&
            (sStartDate === oldLog.date || sEndDate === oldLog.date) &&
            Math.abs((s.duration || 0) - oldDurMins) <= 5);
        if (isMatch && !foundSleep) {
          foundSleep = true;
          return {
            ...s,
            startTime: newLog.startIso,
            endTime: newLog.endIso,
            duration: newLog.durationMinutes,
            feeling: newLog.feeling || newLog.notes || s.feeling
          };
        }
        return s;
      });
      if (!foundSleep) {
        updatedSleep.unshift({
          id: baseLogId,
          startTime: newLog.startIso,
          endTime: newLog.endIso,
          duration: newLog.durationMinutes,
          feeling: newLog.feeling || newLog.notes || 'Sleep Rest'
        });
      }
      localStorage.setItem(sleepKey, JSON.stringify(updatedSleep));
    } else if (oldLog?.mode === 'sleep') {
      const filteredSleep = parsedSleep.filter(s => s && s.id !== logId && s.id !== baseLogId);
      localStorage.setItem(sleepKey, JSON.stringify(filteredSleep));
    }
  } catch (e) {
    console.error("Error updating practca_sleep_sessions:", e);
  }

  // 4. Update practca_revision_planner_logs & recalculate chapter hours
  try {
    const rawRevLogs = localStorage.getItem(revLogsKey);
    let revLogs: any[] = rawRevLogs ? JSON.parse(rawRevLogs) : [];
    if (!Array.isArray(revLogs)) revLogs = [];

    const existingRevLog = revLogs.find((l: any) => l && (l.id === logId || l.id === baseLogId));
    const oldSubId: SubjectId | undefined = oldLog?.subjectId || existingRevLog?.subjectId;
    const oldChapRaw: string | undefined = oldLog?.chapterName || existingRevLog?.chapterName;
    const oldRevKey: string | undefined = oldLog?.revKey || existingRevLog?.revKey;

    if (newLog.mode !== 'study') {
      // If no longer a study log, remove from revision planner logs and recalculate old chapter
      if (existingRevLog) {
        const filteredRevLogs = revLogs.filter((l: any) => l && l.id !== logId && l.id !== baseLogId);
        localStorage.setItem(revLogsKey, JSON.stringify(filteredRevLogs));
        if (isRealUser) {
          setDoc(doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', level)), {
            caLevel: level,
            logs: filteredRevLogs,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        }
        if (oldSubId && oldChapRaw && oldRevKey) {
          await recalculateSubjectChapterHours(oldSubId, oldChapRaw, oldRevKey, filteredRevLogs);
        }
      }
    } else if (newLog.subjectId) {
      const resolvedNewChap =
        resolveTargetChapterForSubject(newLog.subjectId, newLog.chapterName, newLog.notes, newLog.notes) ||
        (existingRevLog && existingRevLog.subjectId === newLog.subjectId ? existingRevLog.chapterName : null);

      const targetRevKey = (newLog.revKey || existingRevLog?.revKey || 'rev1') as RevisionCycleKey;

      if (existingRevLog && resolvedNewChap) {
        const canonicalNewChap = getCanonicalChapterKey(newLog.subjectId, resolvedNewChap);
        const updatedRevLogs = revLogs.map((l: any) => {
          if (l && (l.id === logId || l.id === baseLogId)) {
            return {
              ...l,
              subjectId: newLog.subjectId,
              chapterName: canonicalNewChap,
              revKey: targetRevKey,
              durationMinutes: newLog.durationMinutes,
              timestamp: newLog.endIso,
              taskTitle: newLog.notes || l.taskTitle || `Study: ${canonicalNewChap}`
            };
          }
          return l;
        });
        localStorage.setItem(revLogsKey, JSON.stringify(updatedRevLogs));
        if (isRealUser) {
          setDoc(doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', level)), {
            caLevel: level,
            logs: updatedRevLogs,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        }

        // If subject, chapter, or revKey changed, recalculate old bucket first
        if (
          oldSubId &&
          oldChapRaw &&
          oldRevKey &&
          (oldSubId !== newLog.subjectId ||
            getCanonicalChapterKey(oldSubId, oldChapRaw) !== canonicalNewChap ||
            oldRevKey !== targetRevKey)
        ) {
          await recalculateSubjectChapterHours(oldSubId, oldChapRaw, oldRevKey, updatedRevLogs);
        }

        // Recalculate new bucket
        await recalculateSubjectChapterHours(newLog.subjectId, canonicalNewChap, targetRevKey, updatedRevLogs);
      } else if (resolvedNewChap) {
        // Sync as study session to Revision Planner
        await syncStudySessionToRevisionPlanner({
          id: baseLogId,
          subjectId: newLog.subjectId,
          chapterName: resolvedNewChap,
          durationMinutes: newLog.durationMinutes,
          timestamp: newLog.endIso,
          notes: newLog.notes,
          taskTitle: newLog.notes,
          revKey: targetRevKey
        });
      }
    }
  } catch (e) {
    console.error("Error updating revision planner logs:", e);
  }

  // 5. Reconcile target allocations & Sequence Flow for affected date(s)
  try {
    if (oldLog?.date && oldLog.date !== newLog.date) {
      reconcileAllTargetSystems(oldLog.date, { source: 'logs', dispatchEvents: true });
    }
    if (newLog.date) {
      reconcileAllTargetSystems(newLog.date, { source: 'logs', dispatchEvents: true });
    }
  } catch (recErr) {
    // ignore
  }

  // 6. Notify all components
  window.dispatchEvent(new Event('practca_pomo_logs_update'));
  window.dispatchEvent(new Event('practca_revision_update'));
  window.dispatchEvent(new Event('storage'));
}

async function recalculateSubjectChapterHours(
  subId: SubjectId,
  chapName: string,
  revKey: string,
  allRevLogs: any[]
): Promise<void> {
  try {
    const subLevel = getLevelForSubject(subId);
    const canonicalChapter = getCanonicalChapterKey(subId, chapName);
    const localKey = getLevelScopedKey(`practca_revision_planner_${subId}`, subLevel);
    const storedSub = localStorage.getItem(localKey);
    if (!storedSub) return;

    const parsedSub = JSON.parse(storedSub);
    const chapters = parsedSub.chapters || {};
    if (!chapters[canonicalChapter]) {
      chapters[canonicalChapter] = {};
    }
    if (!chapters[canonicalChapter][revKey]) {
      chapters[canonicalChapter][revKey] = { completed: false, hours: '' };
    }

    const cycleLogs = allRevLogs.filter(
      (l: any) =>
        l &&
        l.subjectId === subId &&
        getCanonicalChapterKey(subId, l.chapterName) === canonicalChapter &&
        l.revKey === revKey
    );
    const totalMins = cycleLogs.reduce((acc: number, l: any) => acc + (Number(l.durationMinutes) || 0), 0);
    const totalHours = totalMins > 0 ? parseFloat((totalMins / 60).toFixed(2)) : 0;
    const formattedHours = totalHours > 0 ? totalHours.toString() : '';

    const currentCompleted = chapters[canonicalChapter][revKey].completed;
    const isManualOverride = chapters[canonicalChapter][revKey].isManualDateOverride;
    const nextCompletedAt =
      currentCompleted && !isManualOverride
        ? resolveLatestLogCompletionDate(
            subId,
            canonicalChapter,
            revKey,
            allRevLogs,
            chapters[canonicalChapter][revKey].completedAt
          )
        : chapters[canonicalChapter][revKey].completedAt;

    chapters[canonicalChapter][revKey] = {
      ...chapters[canonicalChapter][revKey],
      hours: formattedHours,
      completedAt: nextCompletedAt
    };

    const finalRevisionsCount = computeSubjectMilestoneRevisionCount(subId, chapters, allRevLogs);
    localStorage.setItem(
      localKey,
      JSON.stringify({
        revisionsCount: finalRevisionsCount,
        chapters
      })
    );

    const currentUser = auth.currentUser;
    const isRealUser = currentUser && currentUser.uid !== 'guest_user';
    if (isRealUser) {
      const subRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subId, subLevel));
      await setDoc(
        subRef,
        {
          subjectId: subId,
          caLevel: subLevel,
          revisionsCount: finalRevisionsCount,
          chapters,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    }
  } catch (e) {
    console.error("Error in recalculateSubjectChapterHours:", e);
  }
}

