/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SubjectId,
  FINAL_SUBJECT_IDS,
  INTERMEDIATE_SUBJECT_IDS,
  FOUNDATION_SUBJECT_IDS,
  CMA_FOUNDATION_SUBJECT_IDS,
  CMA_INTERMEDIATE_SUBJECT_IDS,
  CMA_FINAL_SUBJECT_IDS,
} from '../types';
import {
  CALevel,
  CA_CURRICULUM_LEVELS,
  getSelectedCALevel,
  getActiveCALevel,
  setSelectedCALevel,
  getLevelForSubject,
  getSubjectLevel,
  getLevelConfig,
  getLevelSubjects,
  useCALevel,
  LEVEL_STORAGE_KEY,
  isValidCALevelValue,
  isFoundationLevel,
  isIntermediateLevel,
  isFinalLevel,
  getCourseFromCALevel,
  getBaseStageFromCALevel,
  resolveCALevel,
  ALL_CA_LEVELS,
} from '../data/curriculumLevels';

export type { CALevel };
export {
  CA_CURRICULUM_LEVELS,
  getSelectedCALevel,
  getActiveCALevel,
  setSelectedCALevel,
  getLevelForSubject,
  getSubjectLevel,
  getLevelConfig,
  getLevelSubjects,
  useCALevel,
  LEVEL_STORAGE_KEY,
  isValidCALevelValue,
  isFoundationLevel,
  isIntermediateLevel,
  isFinalLevel,
  getCourseFromCALevel,
  getBaseStageFromCALevel,
  resolveCALevel,
  ALL_CA_LEVELS,
};

/**
 * Returns the canonical list of SubjectIds belonging to the specified CA/CMA level.
 */
export function getLevelSubjectIds(level: CALevel = getSelectedCALevel()): SubjectId[] {
  if (level === 'foundation') return [...FOUNDATION_SUBJECT_IDS];
  if (level === 'intermediate') return [...INTERMEDIATE_SUBJECT_IDS];
  if (level === 'cma_foundation') return [...CMA_FOUNDATION_SUBJECT_IDS];
  if (level === 'cma_intermediate') return [...CMA_INTERMEDIATE_SUBJECT_IDS];
  if (level === 'cma_final') return [...CMA_FINAL_SUBJECT_IDS];
  return [...FINAL_SUBJECT_IDS];
}

export function isSubjectInLevel(
  subjectId: string | undefined | null,
  level: CALevel = getSelectedCALevel()
): boolean {
  if (!subjectId) return false;
  return getLevelSubjectIds(level).includes(subjectId as SubjectId);
}

export function getDefaultSubjectForLevel(level: CALevel = getSelectedCALevel()): SubjectId {
  if (level === 'foundation') return 'Accounts';
  if (level === 'intermediate') return 'AdvAcc';
  if (level === 'cma_foundation') return 'CMAFoundLaw';
  if (level === 'cma_intermediate') return 'CMAInterLaw';
  if (level === 'cma_final') return 'CMAFinalLaw';
  return 'FR';
}

export function normalizeCoursePreferenceForLevel(
  pref: string | undefined | null,
  level: CALevel = getSelectedCALevel()
): string {
  if (level === 'foundation' || level === 'cma_foundation') {
    return 'All 4 Papers';
  }
  if (pref === 'Group 1 Only' || pref === 'Group 2 Only' || pref === 'Both Groups') {
    return pref;
  }
  return 'Both Groups';
}

export function getLevelStorageSuffix(level: CALevel = getSelectedCALevel()): string {
  return level === 'final' ? '' : `__${level}`;
}

export function getLevelScopedKey(baseKey: string, level: CALevel = getSelectedCALevel()): string {
  if (level === 'final') return baseKey;
  return `${baseKey}__${level}`;
}

export function getSubjectScopedLocalStorageKey(
  prefix: string,
  subjectId: SubjectId
): string {
  return `${prefix}${subjectId}`;
}

export function getRevisionSubjectStorageKey(
  subjectId: SubjectId,
  _level: CALevel = getSelectedCALevel()
): string {
  return `cavault_revision_planner_${subjectId}`;
}

export function getClockSlotsStorageKey(
  dateStr: string,
  level: CALevel = getSelectedCALevel()
): string {
  if (level === 'final') return `practca_clock_slots_${dateStr}`;
  return `practca_clock_slots_${dateStr}__${level}`;
}

export function isClockSlotsStorageKeyForLevel(
  key: string,
  level: CALevel = getSelectedCALevel()
): boolean {
  if (!key.startsWith('practca_clock_slots_')) return false;
  if (level === 'final') {
    return !key.includes('__');
  }
  return key.endsWith(`__${level}`);
}

export function extractDateFromClockSlotsKey(
  key: string,
  level: CALevel = getSelectedCALevel()
): string | null {
  if (!isClockSlotsStorageKeyForLevel(key, level)) return null;
  let datePart = key.replace('practca_clock_slots_', '');
  if (level !== 'final') {
    datePart = datePart.replace(new RegExp(`__${level}$`), '');
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : null;
}

export const parseClockSlotsDateFromKey = extractDateFromClockSlotsKey;

export function getLevelFirestoreDocId(
  baseDocId: string,
  level: CALevel = getSelectedCALevel()
): string {
  if (level === 'final') return baseDocId;
  return `${baseDocId}_${level}`;
}

export function getFirestoreRevisionDocId(
  subjectId: SubjectId,
  level: CALevel = getSelectedCALevel()
): string {
  return level === 'final' ? subjectId : `${subjectId}__${level}`;
}

export function getFirestoreRevisionLogsDocId(
  level: CALevel = getSelectedCALevel()
): string {
  return level === 'final' ? 'logs' : `logs__${level}`;
}

export function getFirestoreRoadmapDocId(
  level: CALevel = getSelectedCALevel()
): string {
  return getLevelFirestoreDocId('roadmap', level);
}

export function getFirestoreAutoStudyPlanDocId(
  level: CALevel = getSelectedCALevel()
): string {
  return getLevelFirestoreDocId('auto_study_plan_v1', level);
}

export function getFirestoreTasksCollectionName(
  level: CALevel = getSelectedCALevel()
): string {
  return level === 'final' ? 'tasks' : `tasks_${level}`;
}

export function getRevisionPlannerFirestoreDocId(
  subjectIdOrLevel: SubjectId | 'logs' | string,
  level: CALevel = getSelectedCALevel()
): string {
  if (subjectIdOrLevel === 'logs') {
    return level === 'final' ? 'logs' : `logs_${level}`;
  }
  if (isValidCALevelValue(subjectIdOrLevel)) {
    return subjectIdOrLevel === 'final' ? 'logs' : `logs_${subjectIdOrLevel}`;
  }
  return String(subjectIdOrLevel);
}

export function getFirestoreSubcollectionName(
  baseName:
    | 'focusSessions'
    | 'practiceAttempts'
    | 'bookmarkedSections'
    | 'bookmarkedQuestions'
    | 'flashcardRatings',
  level: CALevel = getSelectedCALevel()
): string {
  if (level === 'final') return baseName;
  return `${baseName}_${level}`;
}

export function getUserDocExamDateField(level: CALevel = getSelectedCALevel()): string {
  if (level === 'final') return 'examDate';
  return `examDate_${level}`;
}

export function getUserDocDailyGoalField(level: CALevel = getSelectedCALevel()): string {
  if (level === 'final') return 'dailyGoalMinutes';
  return `dailyGoalMinutes_${level}`;
}

export interface AttemptOptionItem {
  date: string;
  label: string;
  shortLabel: string;
  month: number;
  year: number;
}

export function getAllowedAttemptMonthsForLevel(level: CALevel = getSelectedCALevel()): number[] {
  if (level.startsWith('cma_')) {
    return [6, 12]; // ICMAI conducts CMA Foundation, Intermediate & Final exams in June and December
  }
  if (level === 'foundation' || level === 'intermediate') {
    return [1, 5, 9]; // ICAI conducts CA Foundation & Intermediate exams in Jan, May, and Sep
  }
  return [5, 11]; // CA Final attempts in May and Nov
}

const CA_CANDIDATE_ATTEMPTS: AttemptOptionItem[] = [
  { date: '2026-05-02', label: 'May 2026 Attempt', shortLabel: 'May 2026', month: 5, year: 2026 },
  { date: '2026-09-10', label: 'Sep 2026 Attempt', shortLabel: 'Sep 2026', month: 9, year: 2026 },
  { date: '2026-11-02', label: 'Nov 2026 Attempt', shortLabel: 'Nov 2026', month: 11, year: 2026 },
  { date: '2027-01-10', label: 'Jan 2027 Attempt', shortLabel: 'Jan 2027', month: 1, year: 2027 },
  { date: '2027-05-02', label: 'May 2027 Attempt', shortLabel: 'May 2027', month: 5, year: 2027 },
  { date: '2027-09-10', label: 'Sep 2027 Attempt', shortLabel: 'Sep 2027', month: 9, year: 2027 },
  { date: '2027-11-02', label: 'Nov 2027 Attempt', shortLabel: 'Nov 2027', month: 11, year: 2027 },
  { date: '2028-01-10', label: 'Jan 2028 Attempt', shortLabel: 'Jan 2028', month: 1, year: 2028 },
  { date: '2028-05-02', label: 'May 2028 Attempt', shortLabel: 'May 2028', month: 5, year: 2028 },
  { date: '2028-09-10', label: 'Sep 2028 Attempt', shortLabel: 'Sep 2028', month: 9, year: 2028 },
  { date: '2028-11-02', label: 'Nov 2028 Attempt', shortLabel: 'Nov 2028', month: 11, year: 2028 },
];

const CMA_CANDIDATE_ATTEMPTS: AttemptOptionItem[] = [
  { date: '2026-06-11', label: 'June 2026 Attempt', shortLabel: 'June 2026', month: 6, year: 2026 },
  { date: '2026-12-10', label: 'Dec 2026 Attempt', shortLabel: 'Dec 2026', month: 12, year: 2026 },
  { date: '2027-06-11', label: 'June 2027 Attempt', shortLabel: 'June 2027', month: 6, year: 2027 },
  { date: '2027-12-10', label: 'Dec 2027 Attempt', shortLabel: 'Dec 2027', month: 12, year: 2027 },
  { date: '2028-06-11', label: 'June 2028 Attempt', shortLabel: 'June 2028', month: 6, year: 2028 },
  { date: '2028-12-10', label: 'Dec 2028 Attempt', shortLabel: 'Dec 2028', month: 12, year: 2028 },
];

export function getAttemptsForLevel(
  level: CALevel = getSelectedCALevel(),
  customCurrentExamDate?: string
): AttemptOptionItem[] {
  const allowedMonths = new Set(getAllowedAttemptMonthsForLevel(level));
  const pool = level.startsWith('cma_') ? CMA_CANDIDATE_ATTEMPTS : CA_CANDIDATE_ATTEMPTS;
  const filtered = pool.filter((a) => allowedMonths.has(a.month));

  if (
    customCurrentExamDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(customCurrentExamDate) &&
    !filtered.some((a) => a.date === customCurrentExamDate)
  ) {
    const [yStr, mStr] = customCurrentExamDate.split('-');
    const yr = Number(yStr);
    const mn = Number(mStr);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const mName = monthNames[(mn || 1) - 1] || 'Exam';
    return [
      {
        date: customCurrentExamDate,
        label: `${mName} ${yr} (${customCurrentExamDate})`,
        shortLabel: `${mName} ${yr}`,
        month: mn,
        year: yr,
      },
      ...filtered,
    ];
  }

  return filtered;
}

export function isAttemptDateValidForLevel(
  dateStr: string | undefined | null,
  level: CALevel = getSelectedCALevel()
): boolean {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const parts = dateStr.split('-');
  const month = Number(parts[1]);
  const allowedMonths = getAllowedAttemptMonthsForLevel(level);
  return allowedMonths.includes(month);
}

export function getDefaultAttemptDateForLevel(level: CALevel = getSelectedCALevel()): string {
  const attempts = getAttemptsForLevel(level);
  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = attempts.find((a) => a.date >= todayStr);
  if (upcoming) return upcoming.date;
  return attempts[0]?.date || (level.startsWith('cma_') ? '2026-06-11' : '2026-05-02');
}

export function getDefaultExamDateForLevel(level: CALevel = getSelectedCALevel()): string {
  return getDefaultAttemptDateForLevel(level);
}

export function switchWorkspaceCALevel(nextLevel: CALevel): void {
  setSelectedCALevel(nextLevel);
  try {
    window.dispatchEvent(new CustomEvent('practca_ca_level_changed', { detail: { level: nextLevel } }));
  } catch {}
}

