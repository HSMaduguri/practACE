/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  CALevel,
  SubjectId,
  SUBJECT_NAMES,
  GoogleTask,
  ScheduledPracticePreference,
  ScheduledPracticeSlotConfig,
  TriggeredPracticeHistoryEntry,
  PendingSnoozedPracticeNotification,
  PracticeTimeBudgetMode,
  SelectedPracticeQuestion,
  ScheduledPracticeSessionRecord
} from '../types';
import { READY_THEORY_QUESTIONS, TheoryQuestion } from '../data/theoryAuditorQuestions';
import { QUIZ_QUESTIONS } from '../data/questions';
import {
  INITIAL_PAST_PAPER_QUESTION_BANK,
  ExtractedPastPaperQuestion
} from '../data/pastPapersQuestionBank';
import { SUBJECTS_METADATA } from '../data/syllabus';
import {
  resolveExactOrBestChapterMatch,
  normalizeKey,
  isTaskCompletedInStorage
} from './taskCompletionSync';
import { getSelectedCALevel } from '../data/curriculumLevels';
import { getLevelSubjectIds, getLevelScopedKey } from './levelStorage';
import { getCanonicalChapterKey } from '../components/RevisionPlanner';

export const STORAGE_KEY_SCHEDULED_PRACTICE_PREF = 'practca_scheduled_practice_preference';
export const STORAGE_KEY_LEGACY_PRACTICE_EMAIL_PREF = 'practca_practice_email_preference';
export const STORAGE_KEY_SCHEDULED_PRACTICE_LOGS = 'practca_scheduled_practice_logs';
export const STORAGE_KEY_CHAPTER_COMPLETION_TIMESTAMPS = 'practca_chapter_completion_timestamps';

/**
 * Minimum elapsed duration (3 hours) between chapter target completion
 * and the scheduled execution timestamp (Target Cut-Off Buffer).
 */
export const TIMED_PRACTICE_CUTOFF_BUFFER_MS = 3 * 60 * 60 * 1000;

export const MAX_DAILY_EXECUTION_SLOTS = 2;

export const SNOOZE_INTERVAL_OPTIONS_MINUTES = [5, 10, 15, 30, 60] as const;

export const DEFAULT_PRACTICE_SLOTS: ScheduledPracticeSlotConfig[] = [
  { id: 'slot_1', time: '14:00', enabled: true },
  { id: 'slot_2', time: '20:00', enabled: false }
];

export function getLocalTodayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentCalendarMonthKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getLocalCurrentHHMM(now: Date = new Date()): string {
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function parseHHMMToMinutesOfDay(hhmm?: string): number | null {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm.trim())) return null;
  const [hh, mm] = hhmm.trim().split(':').map(Number);
  if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function buildLocalDateForHHMM(dateStr: string, hhmm: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  return new Date(y || 2026, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

export function computeAllocatedPracticeSeconds(
  question: Pick<SelectedPracticeQuestion, 'marks'>,
  mode: PracticeTimeBudgetMode = 'icai_standard'
): number {
  if (mode === 'rapid_5m') return 5 * 60;
  if (mode === 'deep_15m') return 15 * 60;
  const recommendedMinutes = Math.max(8, Math.round((question.marks || 5) * 1.8));
  return recommendedMinutes * 60;
}

export function formatDurationMMSS(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function normalizeScheduledSlots(
  slots?: ScheduledPracticeSlotConfig[] | null,
  legacyTime?: string
): ScheduledPracticeSlotConfig[] {
  const fallbackSlot1Time =
    legacyTime && /^\d{2}:\d{2}$/.test(legacyTime.trim()) ? legacyTime.trim() : '14:00';
  if (!Array.isArray(slots) || slots.length === 0) {
    return [
      { id: 'slot_1', time: fallbackSlot1Time, enabled: true },
      { id: 'slot_2', time: '20:00', enabled: false }
    ];
  }
  const slot1 = slots.find((s) => s?.id === 'slot_1') || slots[0];
  const slot2 = slots.find((s) => s?.id === 'slot_2') || slots[1];
  const normalized: ScheduledPracticeSlotConfig[] = [
    {
      id: 'slot_1' as const,
      time:
        slot1?.time && /^\d{2}:\d{2}$/.test(slot1.time.trim())
          ? slot1.time.trim()
          : fallbackSlot1Time,
      enabled: typeof slot1?.enabled === 'boolean' ? slot1.enabled : true
    },
    {
      id: 'slot_2' as const,
      time:
        slot2?.time && /^\d{2}:\d{2}$/.test(slot2.time.trim())
          ? slot2.time.trim()
          : '20:00',
      enabled: typeof slot2?.enabled === 'boolean' ? slot2.enabled : false
    }
  ];
  return normalized.slice(0, MAX_DAILY_EXECUTION_SLOTS);
}

/**
 * Resolves the unique identifier for the user's currently registered exam attempt
 * to enforce the Question Uniqueness Constraint (no question repeat within an attempt).
 */
export function resolveCurrentRegisteredAttemptKey(
  level: CALevel = getSelectedCALevel(),
  currentUser?: any
): string {
  try {
    const isCleared =
      localStorage.getItem(getLevelScopedKey('practca_exam_attempt_cleared', level)) === 'true';
    if (isCleared) {
      return `${level}::unregistered_default`;
    }
    const storedExamDate =
      localStorage.getItem(getLevelScopedKey('practca_exam_date', level)) ||
      currentUser?.examDate ||
      '2026-11-01';
    return `${level}::${String(storedExamDate).trim() || 'default'}`;
  } catch {
    return `${level}::default`;
  }
}

/**
 * Records exact ISO completion timestamp for a subject+chapter (and optional milestoneId)
 * so the 3-hour Target Cut-Off Buffer evaluates accurately across manual and auto completions.
 */
export function recordChapterCompletionTimestamp(
  subjectId: SubjectId,
  chapterName: string,
  milestoneId?: string,
  completedAtIso?: string,
  level: CALevel = getSelectedCALevel()
): void {
  if (typeof window === 'undefined' || !subjectId || !chapterName) return;
  try {
    const storageKey = getLevelScopedKey(STORAGE_KEY_CHAPTER_COMPLETION_TIMESTAMPS, level);
    const raw = localStorage.getItem(storageKey);
    const map: Record<string, string> = raw ? JSON.parse(raw) || {} : {};
    const canon = getCanonicalChapterKey(subjectId, chapterName) || chapterName;
    const norm = normalizeKey(canon);
    const iso = completedAtIso || new Date().toISOString();

    if (norm) {
      map[`${subjectId}:::${norm}`] = iso;
      if (milestoneId) {
        map[`${milestoneId}:::${subjectId}:::${norm}`] = iso;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {}
}

export function clearChapterCompletionTimestamp(
  subjectId: SubjectId,
  chapterName: string,
  milestoneId?: string,
  level: CALevel = getSelectedCALevel()
): void {
  if (typeof window === 'undefined' || !subjectId || !chapterName) return;
  try {
    const storageKey = getLevelScopedKey(STORAGE_KEY_CHAPTER_COMPLETION_TIMESTAMPS, level);
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const map: Record<string, string> = JSON.parse(raw) || {};
    const canon = getCanonicalChapterKey(subjectId, chapterName) || chapterName;
    const norm = normalizeKey(canon);
    if (norm) {
      delete map[`${subjectId}:::${norm}`];
      if (milestoneId) {
        delete map[`${milestoneId}:::${subjectId}:::${norm}`];
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {}
}

/**
 * ============================================================================
 * STEP 1: USER SCHEDULED PRACTICE PREFERENCE (2 SLOTS + CONSTRAINTS STATE)
 * ============================================================================
 */
export function loadUserPracticeTimePreference(
  currentUser?: any,
  level: CALevel = getSelectedCALevel()
): ScheduledPracticePreference {
  let storedPref: any = {};
  try {
    const scopedKey = getLevelScopedKey(STORAGE_KEY_SCHEDULED_PRACTICE_PREF, level);
    const raw =
      localStorage.getItem(scopedKey) ||
      (level === 'final' ? localStorage.getItem(STORAGE_KEY_LEGACY_PRACTICE_EMAIL_PREF) : null);
    if (raw) {
      storedPref = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse scheduled practice preference from storage:', e);
  }

  const cloudLevelPref = currentUser?.scheduledPracticeByLevel?.[level];
  const fallbackUser = level === 'final' ? currentUser : undefined;

  const preferred_practice_time =
    storedPref.preferred_practice_time ||
    cloudLevelPref?.preferred_practice_time ||
    fallbackUser?.preferred_practice_time ||
    '14:00';

  const rawSlots =
    storedPref.scheduled_slots ||
    cloudLevelPref?.scheduled_slots ||
    undefined;
  const scheduled_slots = normalizeScheduledSlots(rawSlots, preferred_practice_time);

  const scheduled_practice_enabled =
    typeof storedPref.scheduled_practice_enabled === 'boolean'
      ? storedPref.scheduled_practice_enabled
      : typeof cloudLevelPref?.scheduled_practice_enabled === 'boolean'
      ? cloudLevelPref.scheduled_practice_enabled
      : typeof fallbackUser?.scheduled_practice_enabled === 'boolean'
      ? fallbackUser.scheduled_practice_enabled
      : true;

  const snooze_default_minutes = Number(
    storedPref.snooze_default_minutes ?? cloudLevelPref?.snooze_default_minutes ?? 15
  ) || 15;

  const triggered_slots_by_date: Record<string, string[]> =
    storedPref.triggered_slots_by_date ||
    cloudLevelPref?.triggered_slots_by_date ||
    {};

  const last_practice_screen_date =
    storedPref.last_practice_screen_date !== undefined
      ? storedPref.last_practice_screen_date || undefined
      : cloudLevelPref?.last_practice_screen_date ||
        fallbackUser?.last_practice_screen_date ||
        undefined;

  const practiced_question_ids: string[] = Array.isArray(storedPref.practiced_question_ids)
    ? storedPref.practiced_question_ids
    : Array.isArray(cloudLevelPref?.practiced_question_ids)
    ? cloudLevelPref.practiced_question_ids
    : Array.isArray(fallbackUser?.practiced_question_ids)
    ? fallbackUser.practiced_question_ids
    : [];

  const practiced_question_ids_by_attempt: Record<string, string[]> =
    storedPref.practiced_question_ids_by_attempt ||
    cloudLevelPref?.practiced_question_ids_by_attempt ||
    {};

  const chapter_trigger_history: TriggeredPracticeHistoryEntry[] = Array.isArray(
    storedPref.chapter_trigger_history
  )
    ? storedPref.chapter_trigger_history
    : Array.isArray(cloudLevelPref?.chapter_trigger_history)
    ? cloudLevelPref.chapter_trigger_history
    : [];

  const pending_snooze: PendingSnoozedPracticeNotification | null =
    storedPref.pending_snooze !== undefined
      ? storedPref.pending_snooze
      : cloudLevelPref?.pending_snooze ?? null;

  const time_budget_mode: PracticeTimeBudgetMode =
    storedPref.time_budget_mode ||
    cloudLevelPref?.time_budget_mode ||
    fallbackUser?.time_budget_mode ||
    'icai_standard';

  return {
    preferred_practice_time: scheduled_slots[0]?.time || preferred_practice_time,
    scheduled_practice_enabled,
    scheduled_slots,
    snooze_default_minutes,
    triggered_slots_by_date,
    last_practice_screen_date,
    practiced_question_ids,
    practiced_question_ids_by_attempt,
    chapter_trigger_history,
    pending_snooze,
    time_budget_mode
  };
}

export async function saveUserPracticeTimePreference(
  preferenceUpdates: Partial<ScheduledPracticePreference>,
  currentUser?: any,
  onUpdateProfile?: (updatedUser: any) => void,
  level: CALevel = getSelectedCALevel()
): Promise<ScheduledPracticePreference> {
  const existing = loadUserPracticeTimePreference(currentUser, level);

  const nextSlots = normalizeScheduledSlots(
    preferenceUpdates.scheduled_slots ?? existing.scheduled_slots,
    preferenceUpdates.preferred_practice_time ?? existing.preferred_practice_time
  );

  // If scheduled slots changed in profile settings, clear today's triggered run flags so edited slots re-arm
  const slotsChanged =
    preferenceUpdates.scheduled_slots !== undefined &&
    JSON.stringify(nextSlots) !== JSON.stringify(existing.scheduled_slots);

  const todayStr = getLocalTodayDateString();
  const baseTriggeredMap = { ...(existing.triggered_slots_by_date || {}) };
  if (slotsChanged) {
    delete baseTriggeredMap[todayStr];
  }
  const mergedTriggeredMap =
    preferenceUpdates.triggered_slots_by_date !== undefined
      ? preferenceUpdates.triggered_slots_by_date
      : baseTriggeredMap;

  // Keep only last 14 days in triggered_slots_by_date to keep document size minimal
  const prunedTriggeredMap: Record<string, string[]> = {};
  Object.keys(mergedTriggeredMap)
    .sort()
    .slice(-14)
    .forEach((k) => {
      if (Array.isArray(mergedTriggeredMap[k])) {
        prunedTriggeredMap[k] = Array.from(new Set(mergedTriggeredMap[k]));
      }
    });

  const boundedPracticedIds = (
    preferenceUpdates.practiced_question_ids ??
    existing.practiced_question_ids ??
    []
  ).slice(-450);

  const boundedHistory = (
    preferenceUpdates.chapter_trigger_history ??
    existing.chapter_trigger_history ??
    []
  ).slice(-250);

  const nextPreferredTime = nextSlots[0]?.time || preferenceUpdates.preferred_practice_time || '14:00';

  const resolvedLastDate =
    preferenceUpdates.last_practice_screen_date !== undefined
      ? preferenceUpdates.last_practice_screen_date || undefined
      : slotsChanged
      ? undefined
      : existing.last_practice_screen_date;

  const mergedPref: ScheduledPracticePreference = {
    preferred_practice_time: nextPreferredTime,
    scheduled_practice_enabled:
      preferenceUpdates.scheduled_practice_enabled ?? existing.scheduled_practice_enabled ?? true,
    scheduled_slots: nextSlots,
    snooze_default_minutes:
      preferenceUpdates.snooze_default_minutes ?? existing.snooze_default_minutes ?? 15,
    triggered_slots_by_date: prunedTriggeredMap,
    last_practice_screen_date: resolvedLastDate,
    practiced_question_ids: boundedPracticedIds,
    practiced_question_ids_by_attempt:
      preferenceUpdates.practiced_question_ids_by_attempt ??
      existing.practiced_question_ids_by_attempt ??
      {},
    chapter_trigger_history: boundedHistory,
    pending_snooze:
      preferenceUpdates.pending_snooze !== undefined
        ? preferenceUpdates.pending_snooze
        : existing.pending_snooze ?? null,
    time_budget_mode:
      preferenceUpdates.time_budget_mode ?? existing.time_budget_mode ?? 'icai_standard'
  };

  try {
    localStorage.setItem(
      getLevelScopedKey(STORAGE_KEY_SCHEDULED_PRACTICE_PREF, level),
      JSON.stringify(mergedPref)
    );
  } catch (e) {
    console.warn('Could not write scheduled practice preference to localStorage:', e);
  }

  const isRealCloudUser =
    currentUser &&
    !currentUser.isGuest &&
    currentUser.uid &&
    currentUser.uid !== 'guest_user' &&
    auth.currentUser;

  const levelPrefPayload = {
    ...mergedPref,
    last_practice_screen_date: mergedPref.last_practice_screen_date || ''
  };

  if (currentUser) {
    const nextByLevel = {
      ...(currentUser.scheduledPracticeByLevel || {}),
      [level]: levelPrefPayload
    };
    const updatedUser = {
      ...currentUser,
      ...(level === 'final'
        ? {
            preferred_practice_time: mergedPref.preferred_practice_time,
            scheduled_practice_enabled: mergedPref.scheduled_practice_enabled,
            last_practice_screen_date: mergedPref.last_practice_screen_date || '',
            practiced_question_ids: mergedPref.practiced_question_ids || [],
            time_budget_mode: mergedPref.time_budget_mode || 'icai_standard'
          }
        : {}),
      scheduledPracticeByLevel: nextByLevel
    };
    try {
      if (currentUser.isGuest || currentUser.uid === 'guest_user') {
        localStorage.setItem('practca_guest_profile', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem('practca_custom_user', JSON.stringify(updatedUser));
      }
    } catch {}
    onUpdateProfile?.(updatedUser);
  } else {
    try {
      const savedGuestRaw = localStorage.getItem('practca_guest_profile');
      const savedGuest = savedGuestRaw ? JSON.parse(savedGuestRaw) : {};
      const nextByLevel = {
        ...(savedGuest.scheduledPracticeByLevel || {}),
        [level]: levelPrefPayload
      };
      localStorage.setItem(
        'practca_guest_profile',
        JSON.stringify({
          ...savedGuest,
          scheduledPracticeByLevel: nextByLevel
        })
      );
    } catch {}
  }

  if (isRealCloudUser) {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const firestorePayload: Record<string, any> = {
        scheduledPracticeByLevel: {
          [level]: levelPrefPayload
        },
        ...(level === 'final'
          ? {
              preferred_practice_time: mergedPref.preferred_practice_time,
              scheduled_practice_enabled: mergedPref.scheduled_practice_enabled,
              last_practice_screen_date: mergedPref.last_practice_screen_date || '',
              practiced_question_ids: mergedPref.practiced_question_ids || [],
              time_budget_mode: mergedPref.time_budget_mode || 'icai_standard'
            }
          : {}),
        updatedAt: new Date().toISOString()
      };
      await setDoc(userDocRef, firestorePayload, { merge: true });
    } catch (err) {
      console.warn('Could not sync scheduled practice preference to Firestore:', err);
    }
  }

  window.dispatchEvent(new Event('practca_scheduled_practice_pref_updated'));
  return mergedPref;
}

/**
 * ============================================================================
 * STEP 2: ACTIVE MILESTONE RESOLUTION & 3-HOUR TARGET CUT-OFF EVALUATION
 * ============================================================================
 */
export interface ActiveMilestoneChapterTarget {
  subjectId: SubjectId;
  chapterName: string;
}

export interface ActiveMilestoneContext {
  id: string;
  title: string;
  subjectId: SubjectId | 'CUSTOM';
  subjectLabel: string;
  revisionCycle: string;
  startDate?: string;
  targetDate: string;
  subjectIds: SubjectId[];
  chapters: ActiveMilestoneChapterTarget[];
  completedChaptersList: string[];
}

export interface ChapterCutoffEvaluationItem {
  subjectId: SubjectId;
  chapterName: string;
  isCompleted: boolean;
  completedAtIso?: string;
  completedAtMs?: number;
  meetsCutoffBuffer: boolean; // Completed >= 3 hours before scheduled execution timestamp
  minutesRemainingForCutoff: number;
  blockedBySameMilestone: boolean;
  blockedBySameMonth: boolean;
  hasAvailableModerateQuestion: boolean;
  availableModerateQuestion?: SelectedPracticeQuestion;
  matchedTaskTitles: string[];
}

export interface TimedPracticeEligibilityResult {
  activeMilestone: ActiveMilestoneContext | null;
  attemptKey: string;
  monthKey: string;
  scheduledExecMs: number;
  cutoffBoundaryMs: number;
  evaluatedChapters: ChapterCutoffEvaluationItem[];
  completedInMilestoneCount: number;
  cutoffReadyChapters: ChapterCutoffEvaluationItem[];
  waitingCutoffChapters: ChapterCutoffEvaluationItem[];
  eligibleCandidates: ChapterCutoffEvaluationItem[];
  selectedCandidate: ChapterCutoffEvaluationItem | null;
  blockingReason: string | null;
}

export function loadUserDailyTasksFromStorage(level: CALevel = getSelectedCALevel()): GoogleTask[] {
  try {
    const raw = localStorage.getItem(getLevelScopedKey('practca_local_tasks', level));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load tasks from storage:', e);
  }
  return [];
}

function matchChapterForSubject(subjectId: SubjectId, rawText?: string): string | undefined {
  if (!rawText || !rawText.trim()) return undefined;
  const chapters = SUBJECTS_METADATA[subjectId]?.chapters || [];
  if (!chapters.length) return undefined;
  return resolveExactOrBestChapterMatch(chapters, [rawText], subjectId);
}

/**
 * Resolves content strictly from the currently active milestone.
 * Priority:
 * 1) Active window milestone: !completed && (!startDate || startDate <= today) && targetDate >= today
 * 2) Earliest upcoming milestone: !completed && targetDate >= today
 * 3) Earliest incomplete milestone: !completed
 */
export function resolveActiveMilestoneContext(
  todayDateStr: string = getLocalTodayDateString(),
  level: CALevel = getSelectedCALevel()
): ActiveMilestoneContext | null {
  const validSubjectIds = new Set<SubjectId>(getLevelSubjectIds(level));

  let checkpoints: any[] = [];
  try {
    const rawPrimary = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints', level));
    const rawBackup = localStorage.getItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', level));
    const parsedPrimary = rawPrimary ? JSON.parse(rawPrimary) : null;
    const parsedBackup = rawBackup ? JSON.parse(rawBackup) : null;
    if (Array.isArray(parsedPrimary) && parsedPrimary.length > 0) {
      checkpoints = parsedPrimary;
    } else if (Array.isArray(parsedBackup) && parsedBackup.length > 0) {
      checkpoints = parsedBackup;
    }
  } catch (e) {
    console.warn('Failed to load roadmap milestones:', e);
  }

  const incomplete = checkpoints.filter((cp) => cp && !cp.completed);
  if (incomplete.length === 0) return null;

  const isRunningToday = (cp: any) => {
    const start = String(cp.startDate || '').trim();
    const target = String(cp.targetDate || '').trim();
    const afterStart = !start || start <= todayDateStr;
    const beforeEnd = !target || target >= todayDateStr;
    return afterStart && beforeEnd;
  };

  const sortAsc = (a: any, b: any) => {
    const aStart = String(a.startDate || a.targetDate || '');
    const bStart = String(b.startDate || b.targetDate || '');
    if (aStart !== bStart) return aStart.localeCompare(bStart);
    return String(a.targetDate || '').localeCompare(String(b.targetDate || ''));
  };

  const running = incomplete.filter(isRunningToday).sort(sortAsc);
  const upcoming = incomplete
    .filter((cp) => !cp.targetDate || cp.targetDate >= todayDateStr)
    .sort(sortAsc);
  const activeCp = running[0] || upcoming[0] || [...incomplete].sort(sortAsc)[0];
  if (!activeCp) return null;

  const chapters: ActiveMilestoneChapterTarget[] = [];
  const subjectSet = new Set<SubjectId>();
  const seenKey = new Set<string>();

  const pushTarget = (subId: SubjectId, rawChap: string) => {
    if (!validSubjectIds.has(subId) || !rawChap) return;
    const resolved = matchChapterForSubject(subId, rawChap) || getCanonicalChapterKey(subId, rawChap) || rawChap;
    const k = `${subId}:::${normalizeKey(resolved)}`;
    if (!seenKey.has(k)) {
      seenKey.add(k);
      subjectSet.add(subId);
      chapters.push({ subjectId: subId, chapterName: resolved });
    }
  };

  if (activeCp.subjectId === 'CUSTOM' && Array.isArray(activeCp.selectedSubjectChapters)) {
    for (const item of activeCp.selectedSubjectChapters) {
      if (item?.subjectId && item?.chapter) {
        pushTarget(item.subjectId as SubjectId, item.chapter);
      }
    }
  } else if (activeCp.subjectId && validSubjectIds.has(activeCp.subjectId as SubjectId)) {
    const subId = activeCp.subjectId as SubjectId;
    subjectSet.add(subId);
    const list =
      Array.isArray(activeCp.selectedChapters) && activeCp.selectedChapters.length > 0
        ? activeCp.selectedChapters
        : SUBJECTS_METADATA[subId]?.chapters || [];
    for (const ch of list) {
      pushTarget(subId, ch);
    }
  }

  const subjectIds = Array.from(subjectSet);
  const subjectLabel =
    activeCp.subjectId === 'CUSTOM'
      ? subjectIds.map((s) => s).join(', ') || 'Custom Milestone'
      : SUBJECT_NAMES[activeCp.subjectId as SubjectId] || String(activeCp.subjectId);

  const title =
    activeCp.customTitle ||
    `${activeCp.subjectId === 'CUSTOM' ? 'Combined' : activeCp.subjectId} · ${activeCp.revisionCycle || 'Study Milestone'}`;

  return {
    id: String(activeCp.id || `ms_${activeCp.subjectId}_${activeCp.targetDate || todayDateStr}`),
    title,
    subjectId: activeCp.subjectId,
    subjectLabel,
    revisionCycle: activeCp.revisionCycle || 'Baseline Study',
    startDate: activeCp.startDate,
    targetDate: activeCp.targetDate || todayDateStr,
    subjectIds,
    chapters,
    completedChaptersList: Array.isArray(activeCp.completedChapters) ? activeCp.completedChapters : []
  };
}

function parseTimestampToMs(rawTs: any, fallbackDateLogs?: { tsMs: number }[]): number | null {
  if (rawTs === undefined || rawTs === null || rawTs === '') return null;
  if (typeof rawTs === 'number' && !isNaN(rawTs)) return rawTs;
  const str = String(rawTs).trim();
  if (!str) return null;

  // Full ISO timestamp with explicit time component
  if (/T\d{2}:\d{2}/.test(str)) {
    const parsed = Date.parse(str);
    return isNaN(parsed) ? null : parsed;
  }

  // Date-only "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const todayStr = getLocalTodayDateString();
    // If we have exact log timestamps for this chapter on or before this date, prefer exact log timestamp
    if (fallbackDateLogs && fallbackDateLogs.length > 0) {
      return fallbackDateLogs[fallbackDateLogs.length - 1].tsMs;
    }
    // Completed on an earlier calendar day: construct local 18:00 timestamp of that prior day
    if (str < todayStr) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, (m || 1) - 1, d || 1, 18, 0, 0, 0).getTime();
    }
    // Completed today with date-only string and zero time logs -> cannot verify >= 3h cutoff yet
    return null;
  }

  const parsed = Date.parse(str);
  return isNaN(parsed) ? null : parsed;
}

function doesChapterMatch(
  questionSubject: SubjectId,
  questionChapter: string,
  targetSubject: SubjectId,
  targetChapter: string
): boolean {
  if (questionSubject !== targetSubject) return false;
  const normQ = normalizeKey(questionChapter);
  const normT = normalizeKey(targetChapter);
  if (!normQ || !normT) return false;
  return normQ === normT || normQ.includes(normT) || normT.includes(normQ);
}

/**
 * ============================================================================
 * STEP 3: QUESTION BANK QUERY (STRICTLY DIFFICULTY = MODERATE & ATTEMPT UNIQUE)
 * ============================================================================
 */
function convertTheoryQuestionToSelected(q: TheoryQuestion): SelectedPracticeQuestion {
  return {
    id: q.id,
    subjectId: q.subjectId,
    subjectName: SUBJECT_NAMES[q.subjectId] || q.subjectId,
    chapterName: q.chapterName,
    title: q.title,
    difficulty: q.difficulty,
    marks: q.marks,
    icaiExamRef: q.icaiExamRef || 'ICAI Theory Bank',
    question: q.question,
    keyConcepts: q.keyConcepts.map((kc) => ({
      keyword: kc.keyword,
      category: kc.category,
      description: kc.description
    })),
    shortSuggestedAnswer: q.shortSuggestedAnswer
  };
}

function getPastPaperDifficulty(pp: ExtractedPastPaperQuestion): 'Moderate' | 'Advanced' | 'Mastery' {
  // Curated past paper exam questions up to 10 marks represent standard Moderate exam practice;
  // full 14-25 mark integrated cases represent Mastery/Advanced.
  if (pp.marks >= 14) return 'Mastery';
  if (pp.marks >= 11) return 'Advanced';
  return 'Moderate';
}

function convertPastPaperToSelected(pp: ExtractedPastPaperQuestion): SelectedPracticeQuestion {
  const questionBody = [
    ...(pp.questionText || []),
    pp.questionTable
      ? `\n${pp.questionTable.headers.join(' | ')}\n${pp.questionTable.rows
          .map((r) => r.join(' | '))
          .join('\n')}`
      : ''
  ]
    .filter(Boolean)
    .join('\n\n');

  const keyConcepts = [
    ...(pp.suggestedAnswer?.provisionOrStandard || []).map((p, idx) => ({
      keyword: `Provision ${idx + 1}`,
      category: 'Provision',
      description: p
    })),
    ...(pp.suggestedAnswer?.analysisAndWorkings || []).slice(0, 3).map((a, idx) => ({
      keyword: `Working ${idx + 1}`,
      category: 'Keyword',
      description: a
    }))
  ];

  return {
    id: `pp_${pp.id}`,
    subjectId: pp.subjectCode,
    subjectName: SUBJECT_NAMES[pp.subjectCode] || pp.subjectCode,
    chapterName: pp.chapterName,
    title: `${pp.topicTag || pp.chapterName} (${pp.questionNumber})`,
    difficulty: getPastPaperDifficulty(pp),
    marks: pp.marks || 6,
    icaiExamRef: `${pp.attemptLabel} ${pp.questionNumber}`,
    question: questionBody,
    keyConcepts:
      keyConcepts.length > 0
        ? keyConcepts
        : [
            {
              keyword: 'Conclusion',
              category: 'Provision',
              description: pp.suggestedAnswer?.conclusion || 'Refer to statutory provisions.'
            }
          ],
    shortSuggestedAnswer:
      pp.suggestedAnswer?.conclusion ||
      pp.suggestedAnswer?.provisionOrStandard?.[0] ||
      'Refer to ICAI suggested answer workings.'
  };
}

/**
 * Queries the Question Bank strictly for `Difficulty = Moderate` items belonging
 * to `(subjectId, chapterName)` that have NOT yet been issued within `attemptIssuedSet`.
 */
export function queryModerateQuestionForChapter(
  subjectId: SubjectId,
  chapterName: string,
  attemptIssuedQuestionIds: Set<string>
): SelectedPracticeQuestion | null {
  const moderateTheoryPool = READY_THEORY_QUESTIONS.filter(
    (q) =>
      q.difficulty === 'Moderate' &&
      !attemptIssuedQuestionIds.has(q.id) &&
      doesChapterMatch(q.subjectId, q.chapterName, subjectId, chapterName)
  ).map(convertTheoryQuestionToSelected);

  if (moderateTheoryPool.length > 0) {
    return moderateTheoryPool[0];
  }

  const moderatePastPapersPool = INITIAL_PAST_PAPER_QUESTION_BANK.filter(
    (pp) =>
      pp.subjectCode === subjectId &&
      getPastPaperDifficulty(pp) === 'Moderate' &&
      !attemptIssuedQuestionIds.has(`pp_${pp.id}`) &&
      doesChapterMatch(pp.subjectCode, pp.chapterName, subjectId, chapterName)
  ).map(convertPastPaperToSelected);

  if (moderatePastPapersPool.length > 0) {
    return moderatePastPapersPool[0];
  }

  const moderateQuizMcqPool: SelectedPracticeQuestion[] = [];
  for (const item of QUIZ_QUESTIONS[subjectId] || []) {
    if (
      item.type === 'general' &&
      !attemptIssuedQuestionIds.has(`mcq_${item.data.id}`) &&
      doesChapterMatch(item.data.subjectId, item.data.chapterName, subjectId, chapterName)
    ) {
      moderateQuizMcqPool.push({
        id: `mcq_${item.data.id}`,
        subjectId: item.data.subjectId,
        subjectName: SUBJECT_NAMES[item.data.subjectId] || item.data.subjectId,
        chapterName: item.data.chapterName,
        title: `${item.data.chapterName} — Moderate Concept Check`,
        difficulty: 'Moderate',
        marks: 4,
        icaiExamRef: 'ICAI Moderate Question Bank',
        question: `${item.data.questionText}\n\nOptions:\n${item.data.options
          .map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`)
          .join('\n')}`,
        keyConcepts: [
          {
            keyword: item.data.options[item.data.correctOptionIndex] || 'Correct Provision',
            category: 'Provision',
            description: item.data.explanation
          }
        ],
        shortSuggestedAnswer: item.data.explanation
      });
    }
  }

  if (moderateQuizMcqPool.length > 0) {
    return moderateQuizMcqPool[0];
  }

  // Secondary check: subject-scoped Moderate past-paper/theory item if chapter naming differs slightly in IBS/case banks
  const fallbackSubjectPastPaper = INITIAL_PAST_PAPER_QUESTION_BANK.filter(
    (pp) =>
      pp.subjectCode === subjectId &&
      getPastPaperDifficulty(pp) === 'Moderate' &&
      !attemptIssuedQuestionIds.has(`pp_${pp.id}`)
  );
  if (fallbackSubjectPastPaper.length > 0 && subjectId === 'IBS') {
    return convertPastPaperToSelected(fallbackSubjectPastPaper[0]);
  }

  return null;
}

/**
 * Resolves completed chapter targets strictly within the active milestone,
 * evaluating the 3-hour cut-off buffer, same-milestone prior runs,
 * calendar-month chapter frequency constraint, and single-attempt Moderate Question uniqueness.
 */
export function evaluateTimedPracticeEligibility(params?: {
  currentUser?: any;
  tasks?: GoogleTask[];
  scheduledExecMs?: number;
  level?: CALevel;
}): TimedPracticeEligibilityResult {
  const level = params?.level || getSelectedCALevel();
  const execMs = params?.scheduledExecMs ?? Date.now();
  const execDate = new Date(execMs);
  const todayStr = getLocalTodayDateString(execDate);
  const monthKey = getCurrentCalendarMonthKey(execDate);
  const cutoffBoundaryMs = execMs - TIMED_PRACTICE_CUTOFF_BUFFER_MS;
  const attemptKey = resolveCurrentRegisteredAttemptKey(level, params?.currentUser);
  const pref = loadUserPracticeTimePreference(params?.currentUser, level);

  const activeMilestone = resolveActiveMilestoneContext(todayStr, level);
  if (!activeMilestone) {
    return {
      activeMilestone: null,
      attemptKey,
      monthKey,
      scheduledExecMs: execMs,
      cutoffBoundaryMs,
      evaluatedChapters: [],
      completedInMilestoneCount: 0,
      cutoffReadyChapters: [],
      waitingCutoffChapters: [],
      eligibleCandidates: [],
      selectedCandidate: null,
      blockingReason: 'No active study milestone found. Create or activate a milestone in Roadmap Dashboard.'
    };
  }

  const allTasks =
    Array.isArray(params?.tasks) && params!.tasks.length > 0
      ? params!.tasks
      : loadUserDailyTasksFromStorage(level);

  // Load completion timestamp registry, target flow, revision logs, and revision planner per subject
  let timestampRegistry: Record<string, string> = {};
  try {
    const rawTs = localStorage.getItem(
      getLevelScopedKey(STORAGE_KEY_CHAPTER_COMPLETION_TIMESTAMPS, level)
    );
    if (rawTs) timestampRegistry = JSON.parse(rawTs) || {};
  } catch {}

  const flowItems: any[] = [];
  try {
    const rawFlow = localStorage.getItem(getLevelScopedKey('practca_target_flow', level));
    if (rawFlow) {
      const p = JSON.parse(rawFlow);
      if (Array.isArray(p)) flowItems.push(...p);
    }
    const rawTodayFlow = localStorage.getItem(
      getLevelScopedKey(`practca_target_flow_${todayStr}`, level)
    );
    if (rawTodayFlow) {
      const p = JSON.parse(rawTodayFlow);
      if (Array.isArray(p)) flowItems.push(...p);
    }
  } catch {}

  const revLogsBySubChapter: Record<string, { tsMs: number }[]> = {};
  try {
    const rawRevLogs = localStorage.getItem(
      getLevelScopedKey('practca_revision_planner_logs', level)
    );
    if (rawRevLogs) {
      const parsedLogs = JSON.parse(rawRevLogs);
      if (Array.isArray(parsedLogs)) {
        parsedLogs.forEach((l: any) => {
          if (!l?.subjectId || !l?.chapterName || !l?.timestamp) return;
          const tsMs = Date.parse(l.timestamp);
          if (isNaN(tsMs)) return;
          const canon =
            getCanonicalChapterKey(l.subjectId, l.chapterName) || l.chapterName;
          const k = `${l.subjectId}:::${normalizeKey(canon)}`;
          if (!revLogsBySubChapter[k]) revLogsBySubChapter[k] = [];
          revLogsBySubChapter[k].push({ tsMs });
        });
        Object.values(revLogsBySubChapter).forEach((arr) =>
          arr.sort((a, b) => a.tsMs - b.tsMs)
        );
      }
    }
  } catch {}

  const revPlannerBySubject: Record<string, Record<string, any>> = {};
  for (const subId of activeMilestone.subjectIds) {
    try {
      const rawRev = localStorage.getItem(
        getLevelScopedKey(`practca_revision_planner_${subId}`, level)
      );
      if (rawRev) {
        const parsed = JSON.parse(rawRev);
        revPlannerBySubject[subId] = parsed?.chapters || {};
      }
    } catch {}
  }

  let preferredRevStageKey = 'baseline';
  if (/1st/i.test(activeMilestone.revisionCycle)) preferredRevStageKey = 'rev1';
  else if (/2nd/i.test(activeMilestone.revisionCycle)) preferredRevStageKey = 'rev2';
  else if (/3rd/i.test(activeMilestone.revisionCycle)) preferredRevStageKey = 'rev3';
  else if (/final|1\.5/i.test(activeMilestone.revisionCycle)) preferredRevStageKey = 'rev1.5';

  // Triggered history for constraints
  const history = pref.chapter_trigger_history || [];
  const sameMilestoneChapterSet = new Set<string>(
    history
      .filter((h) => h.milestoneId === activeMilestone.id)
      .map((h) => `${h.subjectId}:::${normalizeKey(h.chapterName)}`)
  );
  const sameMonthChapterSet = new Set<string>(
    history
      .filter((h) => h.monthKey === monthKey)
      .map((h) => `${h.subjectId}:::${normalizeKey(h.chapterName)}`)
  );

  // Also include currently stored logs from the same milestone/month in case preference missed one
  const sessionLogs = loadScheduledPracticeLogs(level);
  for (const log of sessionLogs) {
    if (log.status === 'dismissed' || log.status === 'snoozed') continue;
    const chSub = log.question?.subjectId;
    const chName = log.question?.chapterName;
    if (!chSub || !chName) continue;
    const ck = `${chSub}:::${normalizeKey(chName)}`;
    if (log.milestoneId && log.milestoneId === activeMilestone.id) {
      sameMilestoneChapterSet.add(ck);
    }
    const logMonth = log.monthKey || (log.scheduledDate ? log.scheduledDate.slice(0, 7) : '');
    if (logMonth === monthKey) {
      sameMonthChapterSet.add(ck);
    }
  }

  // Question Uniqueness Set across the single registered attempt
  const attemptIssuedIds = new Set<string>([
    ...(pref.practiced_question_ids_by_attempt?.[attemptKey] || []),
    ...(!pref.practiced_question_ids_by_attempt ? pref.practiced_question_ids || [] : [])
  ]);

  const evaluatedChapters: ChapterCutoffEvaluationItem[] = [];

  for (const target of activeMilestone.chapters) {
    const subId = target.subjectId;
    const canon = getCanonicalChapterKey(subId, target.chapterName) || target.chapterName;
    const normCanon = normalizeKey(canon);
    const chapterKey = `${subId}:::${normCanon}`;
    const logsForChapter = revLogsBySubChapter[chapterKey] || [];

    const candidateTimestampsMs: number[] = [];
    const matchedTaskTitles: string[] = [];
    let isMarkedCompleted = false;

    // A) Explicit milestone completedChapters array
    const isInMilestoneDone = activeMilestone.completedChaptersList.some((c) => {
      const cResolved = matchChapterForSubject(subId, c) || getCanonicalChapterKey(subId, c) || c;
      return normalizeKey(cResolved) === normCanon;
    });
    if (isInMilestoneDone) {
      isMarkedCompleted = true;
    }

    // B) Timestamp registry
    const regTsMs = parseTimestampToMs(
      timestampRegistry[`${activeMilestone.id}:::${chapterKey}`] || timestampRegistry[chapterKey]
    );
    if (regTsMs !== null) {
      candidateTimestampsMs.push(regTsMs);
    }

    // C) Daily tasks (practca_local_tasks) scoped to milestone/subject/chapter
    for (const t of allTasks) {
      if (!t) continue;
      if (t.subjectCode && t.subjectCode.toUpperCase() !== subId.toUpperCase()) continue;
      const tMilestoneId =
        t.milestoneId ||
        (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
      if (tMilestoneId && tMilestoneId !== activeMilestone.id) continue;

      const tMatched =
        matchChapterForSubject(subId, t.chapterName) ||
        matchChapterForSubject(subId, t.cleanTitle) ||
        matchChapterForSubject(subId, t.title);
      if (!tMatched || normalizeKey(tMatched) !== normCanon) continue;

      const tDate = t.taskDate || (t.due ? t.due.split('T')[0] : '');
      const tDone =
        t.status === 'completed' ||
        Boolean((t as any).completed) ||
        isTaskCompletedInStorage(
          t.id,
          t.title,
          t.cleanTitle,
          t.chapterName,
          t.subjectCode,
          tDate,
          t.milestoneId,
          level
        );

      if (tDone) {
        isMarkedCompleted = true;
        matchedTaskTitles.push(t.cleanTitle || t.title || canon);
        const ms = parseTimestampToMs((t as any).completed, logsForChapter);
        if (ms !== null) candidateTimestampsMs.push(ms);
      }
    }

    // D) Target Flow items
    for (const f of flowItems) {
      if (!f || f.status !== 'completed') continue;
      if (f.subjectCode && String(f.subjectCode).toUpperCase() !== subId.toUpperCase()) continue;
      const fMatched =
        matchChapterForSubject(subId, f.chapterName) ||
        matchChapterForSubject(subId, f.cleanTitle) ||
        matchChapterForSubject(subId, f.title);
      if (!fMatched || normalizeKey(fMatched) !== normCanon) continue;

      isMarkedCompleted = true;
      const ms = parseTimestampToMs(f.completedAt, logsForChapter);
      if (ms !== null) candidateTimestampsMs.push(ms);
    }

    // E) Revision Planner completion state
    const revEntry =
      revPlannerBySubject[subId]?.[canon] || revPlannerBySubject[subId]?.[target.chapterName];
    if (revEntry) {
      const stageData = revEntry[preferredRevStageKey];
      if (stageData?.completed && !stageData?.skipped) {
        isMarkedCompleted = true;
        const ms = parseTimestampToMs(stageData.completedAt, logsForChapter);
        if (ms !== null) candidateTimestampsMs.push(ms);
      }
    }

    if (!isMarkedCompleted) {
      evaluatedChapters.push({
        subjectId: subId,
        chapterName: canon,
        isCompleted: false,
        meetsCutoffBuffer: false,
        minutesRemainingForCutoff: 180,
        blockedBySameMilestone: false,
        blockedBySameMonth: false,
        hasAvailableModerateQuestion: false,
        matchedTaskTitles: []
      });
      continue;
    }

    // Earliest verified completion timestamp for this chapter target
    const resolvedCompletedMs =
      candidateTimestampsMs.length > 0 ? Math.min(...candidateTimestampsMs) : null;
    const completedAtIso =
      resolvedCompletedMs !== null ? new Date(resolvedCompletedMs).toISOString() : undefined;

    const meetsCutoffBuffer =
      resolvedCompletedMs !== null && resolvedCompletedMs <= cutoffBoundaryMs;
    const minutesRemainingForCutoff =
      resolvedCompletedMs !== null
        ? Math.max(0, Math.ceil((resolvedCompletedMs - cutoffBoundaryMs) / 60000))
        : 180;

    const blockedBySameMilestone = sameMilestoneChapterSet.has(chapterKey);
    const blockedBySameMonth = sameMonthChapterSet.has(chapterKey);

    const moderateQuestion = queryModerateQuestionForChapter(
      subId,
      canon,
      attemptIssuedIds
    );

    evaluatedChapters.push({
      subjectId: subId,
      chapterName: canon,
      isCompleted: true,
      completedAtIso,
      completedAtMs: resolvedCompletedMs ?? undefined,
      meetsCutoffBuffer,
      minutesRemainingForCutoff,
      blockedBySameMilestone,
      blockedBySameMonth,
      hasAvailableModerateQuestion: Boolean(moderateQuestion),
      availableModerateQuestion: moderateQuestion || undefined,
      matchedTaskTitles: Array.from(new Set(matchedTaskTitles))
    });
  }

  const completedInMilestone = evaluatedChapters.filter((c) => c.isCompleted);
  const cutoffReadyChapters = completedInMilestone.filter((c) => c.meetsCutoffBuffer);
  const waitingCutoffChapters = completedInMilestone.filter((c) => !c.meetsCutoffBuffer);

  const eligibleCandidates = cutoffReadyChapters
    .filter(
      (c) =>
        !c.blockedBySameMilestone &&
        !c.blockedBySameMonth &&
        c.hasAvailableModerateQuestion &&
        c.availableModerateQuestion
    )
    .sort((a, b) => (a.completedAtMs || 0) - (b.completedAtMs || 0));

  const selectedCandidate = eligibleCandidates[0] || null;

  let blockingReason: string | null = null;
  if (!selectedCandidate) {
    if (completedInMilestone.length === 0) {
      blockingReason = `No completed chapters found in active milestone "${activeMilestone.title}" (${activeMilestone.subjectLabel}).`;
    } else if (cutoffReadyChapters.length === 0) {
      const minWait = Math.min(
        ...waitingCutoffChapters.map((w) => w.minutesRemainingForCutoff)
      );
      blockingReason = `${completedInMilestone.length} chapter(s) completed, waiting for the 3-hour cut-off buffer (~${minWait}m remaining).`;
    } else if (
      cutoffReadyChapters.every((c) => c.blockedBySameMilestone || c.blockedBySameMonth)
    ) {
      blockingReason = `All cut-off ready chapters were already triggered in this milestone or within ${monthKey}.`;
    } else {
      blockingReason = `No un-issued Moderate difficulty question remaining in Question Bank for eligible chapters in attempt ${attemptKey}.`;
    }
  }

  return {
    activeMilestone,
    attemptKey,
    monthKey,
    scheduledExecMs: execMs,
    cutoffBoundaryMs,
    evaluatedChapters,
    completedInMilestoneCount: completedInMilestone.length,
    cutoffReadyChapters,
    waitingCutoffChapters,
    eligibleCandidates,
    selectedCandidate,
    blockingReason
  };
}

/**
 * ============================================================================
 * STEP 4: SESSION LOGS, SNOOZE, NOTIFICATION PREPARATION & LAUNCHER
 * ============================================================================
 */
export function loadScheduledPracticeLogs(
  level: CALevel = getSelectedCALevel()
): ScheduledPracticeSessionRecord[] {
  try {
    const raw = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_SCHEDULED_PRACTICE_LOGS, level));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function upsertScheduledPracticeLog(
  record: ScheduledPracticeSessionRecord,
  level: CALevel = getSelectedCALevel()
): void {
  try {
    const existing = loadScheduledPracticeLogs(level);
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 50);
    localStorage.setItem(
      getLevelScopedKey(STORAGE_KEY_SCHEDULED_PRACTICE_LOGS, level),
      JSON.stringify(updated)
    );
    window.dispatchEvent(new Event('practca_scheduled_practice_logs_updated'));
  } catch (e) {
    console.warn('Failed to save scheduled practice session log:', e);
  }
}

export function prepareTimedPracticeNotificationSession(params: {
  currentUser?: any;
  tasks?: GoogleTask[];
  triggerType: 'scheduled' | 'manual_practice';
  slotId?: 'slot_1' | 'slot_2' | 'manual';
  slotTime?: string;
  scheduledExecMs?: number;
  level?: CALevel;
}): {
  session: ScheduledPracticeSessionRecord | null;
  eligibility: TimedPracticeEligibilityResult;
} {
  const level = params.level || getSelectedCALevel();
  const execMs = params.scheduledExecMs ?? Date.now();
  const execDate = new Date(execMs);
  const todayStr = getLocalTodayDateString(execDate);
  const pref = loadUserPracticeTimePreference(params.currentUser, level);

  const eligibility = evaluateTimedPracticeEligibility({
    currentUser: params.currentUser,
    tasks: params.tasks,
    scheduledExecMs: execMs,
    level
  });

  if (
    !eligibility.activeMilestone ||
    !eligibility.selectedCandidate ||
    !eligibility.selectedCandidate.availableModerateQuestion
  ) {
    return { session: null, eligibility };
  }

  const cand = eligibility.selectedCandidate;
  const question = cand.availableModerateQuestion!;
  const allocatedSeconds = computeAllocatedPracticeSeconds(question, pref.time_budget_mode);

  const session: ScheduledPracticeSessionRecord = {
    id: `pq_tp_${Date.now()}`,
    triggeredAt: new Date().toISOString(),
    scheduledDate: todayStr,
    preferredTime: params.slotTime || getLocalCurrentHHMM(execDate),
    slotId: params.slotId || 'manual',
    milestoneId: eligibility.activeMilestone.id,
    milestoneTitle: eligibility.activeMilestone.title,
    attemptKey: eligibility.attemptKey,
    monthKey: eligibility.monthKey,
    chapterCompletedAt: cand.completedAtIso,
    triggerType: params.triggerType,
    sourceType: 'active_milestone_completed_target',
    matchedTaskTitles: cand.matchedTaskTitles,
    matchedChapters: [{ subjectId: cand.subjectId, chapterName: cand.chapterName }],
    question,
    allocatedSeconds,
    elapsedSeconds: 0,
    status: 'active'
  };

  return { session, eligibility };
}

/**
 * Starts the Timed Practice session (invoked when clicking "Start Timed Practice" on popup
 * or launching manually): records milestone, calendar-month chapter lock, and attempt question lock.
 */
export async function startTimedPracticeSession(
  session: ScheduledPracticeSessionRecord,
  currentUser?: any,
  onUpdateProfile?: (updatedUser: any) => void,
  level: CALevel = getSelectedCALevel()
): Promise<ScheduledPracticeSessionRecord> {
  const pref = loadUserPracticeTimePreference(currentUser, level);
  const attemptKey =
    session.attemptKey || resolveCurrentRegisteredAttemptKey(level, currentUser);
  const monthKey =
    session.monthKey ||
    (session.scheduledDate ? session.scheduledDate.slice(0, 7) : getCurrentCalendarMonthKey());

  const existingAttemptMap = { ...(pref.practiced_question_ids_by_attempt || {}) };
  const attemptIds = Array.from(
    new Set([...(existingAttemptMap[attemptKey] || []), session.question.id])
  );
  existingAttemptMap[attemptKey] = attemptIds;

  const flatPracticed = Array.from(
    new Set([...(pref.practiced_question_ids || []), session.question.id])
  );

  const nextHistoryEntry: TriggeredPracticeHistoryEntry = {
    sessionId: session.id,
    milestoneId: session.milestoneId || 'active_milestone',
    milestoneTitle: session.milestoneTitle,
    subjectId: session.question.subjectId,
    chapterName: session.question.chapterName,
    questionId: session.question.id,
    monthKey,
    attemptKey,
    slotId: session.slotId,
    triggeredAt: new Date().toISOString()
  };

  const nextHistory = [
    nextHistoryEntry,
    ...(pref.chapter_trigger_history || []).filter((h) => h.sessionId !== session.id)
  ];

  const activeSession: ScheduledPracticeSessionRecord = {
    ...session,
    status: 'active',
    triggeredAt: session.triggeredAt || new Date().toISOString()
  };

  upsertScheduledPracticeLog(activeSession, level);

  await saveUserPracticeTimePreference(
    {
      practiced_question_ids: flatPracticed,
      practiced_question_ids_by_attempt: existingAttemptMap,
      chapter_trigger_history: nextHistory,
      pending_snooze: null,
      last_practice_screen_date:
        session.triggerType === 'scheduled'
          ? session.scheduledDate
          : pref.last_practice_screen_date
    },
    currentUser,
    onUpdateProfile,
    level
  );

  return activeSession;
}

/**
 * Defers the Timed Practice pop-up notification for the requested interval (`snoozeMinutes`).
 */
export async function snoozeTimedPracticeNotification(
  session: ScheduledPracticeSessionRecord,
  snoozeMinutes: number,
  currentUser?: any,
  onUpdateProfile?: (updatedUser: any) => void,
  level: CALevel = getSelectedCALevel()
): Promise<PendingSnoozedPracticeNotification> {
  const safeMins = Math.max(1, Math.min(240, Math.round(snoozeMinutes || 15)));
  const now = new Date();
  const snoozeUntil = new Date(now.getTime() + safeMins * 60 * 1000).toISOString();
  const snoozedSession: ScheduledPracticeSessionRecord = {
    ...session,
    status: 'snoozed'
  };
  upsertScheduledPracticeLog(snoozedSession, level);

  const pendingSnooze: PendingSnoozedPracticeNotification = {
    session: snoozedSession,
    snoozedAt: now.toISOString(),
    snoozeUntil,
    snoozeMinutes: safeMins,
    slotId: session.slotId || 'manual',
    dateStr: session.scheduledDate || getLocalTodayDateString(now)
  };

  await saveUserPracticeTimePreference(
    {
      snooze_default_minutes: safeMins,
      pending_snooze: pendingSnooze
    },
    currentUser,
    onUpdateProfile,
    level
  );

  return pendingSnooze;
}

export async function dismissTimedPracticeNotification(
  session: ScheduledPracticeSessionRecord,
  currentUser?: any,
  onUpdateProfile?: (updatedUser: any) => void,
  level: CALevel = getSelectedCALevel()
): Promise<void> {
  upsertScheduledPracticeLog({ ...session, status: 'dismissed' }, level);
  await saveUserPracticeTimePreference(
    { pending_snooze: null },
    currentUser,
    onUpdateProfile,
    level
  );
}

/**
 * Direct launcher implementing the exact Timed Practice Mechanism rules.
 * Throws descriptive error if no eligible completed chapter meets the 3h cut-off buffer & constraints.
 */
export async function launchOnScreenPracticeSession(params: {
  currentUser?: any;
  tasks?: GoogleTask[];
  triggerType: 'scheduled' | 'manual_practice';
  onUpdateProfile?: (updatedUser: any) => void;
  level?: CALevel;
}): Promise<ScheduledPracticeSessionRecord> {
  const level = params.level || getSelectedCALevel();
  const { session, eligibility } = prepareTimedPracticeNotificationSession({
    currentUser: params.currentUser,
    tasks: params.tasks,
    triggerType: params.triggerType,
    slotId: 'manual',
    level
  });

  if (!session) {
    throw new Error(
      eligibility.blockingReason ||
        'No eligible completed chapter in the active milestone has met the 3-hour cut-off buffer and Moderate Question Bank uniqueness criteria.'
    );
  }

  return await startTimedPracticeSession(
    session,
    params.currentUser,
    params.onUpdateProfile,
    level
  );
}

/**
 * ============================================================================
 * STEP 5: BACKGROUND SCHEDULER (UP TO 2 DAILY SLOTS + 3H CUTOFF + SNOOZE POPUP)
 * ============================================================================
 */
let isTriggerInFlight = false;

export async function checkAndTriggerScheduledPractice(context: {
  currentUser?: any;
  tasks?: GoogleTask[];
  onUpdateProfile?: (updatedUser: any) => void;
  onTriggerSession?: (record: ScheduledPracticeSessionRecord) => void;
  onNotifySession?: (
    record: ScheduledPracticeSessionRecord,
    meta?: { isSnoozeResume?: boolean; snoozeMinutes?: number }
  ) => void;
}): Promise<ScheduledPracticeSessionRecord | null> {
  if (isTriggerInFlight) return null;

  const level = getSelectedCALevel();
  const pref = loadUserPracticeTimePreference(context.currentUser, level);
  if (!pref.scheduled_practice_enabled) {
    return null;
  }

  const now = new Date();
  const nowMs = now.getTime();
  const nowMinsOfDay = now.getHours() * 60 + now.getMinutes();
  const todayStr = getLocalTodayDateString(now);

  try {
    isTriggerInFlight = true;

    // 1. Check pending snoozed notification expiry first
    if (pref.pending_snooze && pref.pending_snooze.session) {
      const snoozeUntilMs = Date.parse(pref.pending_snooze.snoozeUntil);
      if (!isNaN(snoozeUntilMs) && nowMs >= snoozeUntilMs) {
        const snoozedSession: ScheduledPracticeSessionRecord = {
          ...pref.pending_snooze.session,
          status: 'active',
          triggeredAt: new Date().toISOString()
        };
        const snoozeMins = pref.pending_snooze.snoozeMinutes;

        await saveUserPracticeTimePreference(
          { pending_snooze: null },
          context.currentUser,
          context.onUpdateProfile,
          level
        );

        if (context.onNotifySession) {
          context.onNotifySession(snoozedSession, {
            isSnoozeResume: true,
            snoozeMinutes: snoozeMins
          });
        } else {
          context.onTriggerSession?.(snoozedSession);
        }
        return snoozedSession;
      }
    }

    // 2. Evaluate up to 2 configured daily execution slots
    const slots = normalizeScheduledSlots(pref.scheduled_slots, pref.preferred_practice_time).slice(
      0,
      MAX_DAILY_EXECUTION_SLOTS
    );
    const ranToday = new Set<string>(pref.triggered_slots_by_date?.[todayStr] || []);

    for (const slot of slots) {
      if (!slot.enabled) continue;
      if (ranToday.has(slot.id)) continue;

      const slotMins = parseHHMMToMinutesOfDay(slot.time);
      if (slotMins === null) continue;

      // Trigger at scheduled execution timestamp (0..2 min window for timer interval jitter)
      const diffMins = nowMinsOfDay - slotMins;
      if (diffMins < 0 || diffMins > 2) continue;

      const slotExecDate = buildLocalDateForHHMM(todayStr, slot.time);
      const nextTriggeredMap = {
        ...(pref.triggered_slots_by_date || {}),
        [todayStr]: Array.from(new Set([...ranToday, slot.id]))
      };

      // Mark slot evaluated today first so it does not repeat within the 2-minute trigger window
      await saveUserPracticeTimePreference(
        {
          triggered_slots_by_date: nextTriggeredMap,
          last_practice_screen_date: todayStr
        },
        context.currentUser,
        context.onUpdateProfile,
        level
      );

      const { session } = prepareTimedPracticeNotificationSession({
        currentUser: context.currentUser,
        tasks: context.tasks,
        triggerType: 'scheduled',
        slotId: slot.id,
        slotTime: slot.time,
        scheduledExecMs: slotExecDate.getTime(),
        level
      });

      if (session) {
        if (context.onNotifySession) {
          context.onNotifySession(session, { isSnoozeResume: false });
        } else {
          const started = await startTimedPracticeSession(
            session,
            context.currentUser,
            context.onUpdateProfile,
            level
          );
          context.onTriggerSession?.(started);
        }
        return session;
      }
      return null;
    }

    return null;
  } finally {
    isTriggerInFlight = false;
  }
}

export function startScheduledPracticeScheduler(
  getContext: () => {
    currentUser?: any;
    tasks?: GoogleTask[];
    onUpdateProfile?: (updatedUser: any) => void;
    onTriggerSession?: (record: ScheduledPracticeSessionRecord) => void;
    onNotifySession?: (
      record: ScheduledPracticeSessionRecord,
      meta?: { isSnoozeResume?: boolean; snoozeMinutes?: number }
    ) => void;
  }
): () => void {
  const executeCheck = () => {
    const ctx = getContext();
    checkAndTriggerScheduledPractice(ctx).catch((err) =>
      console.warn('Scheduled timed practice check error:', err)
    );
  };

  executeCheck();
  const intervalId = window.setInterval(executeCheck, 15 * 1000);

  return () => {
    window.clearInterval(intervalId);
  };
}
