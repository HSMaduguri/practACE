import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  CheckCircle2,
  Play,
  Filter,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Lock,
  Pencil,
  GripVertical,
  Sparkles,
  SkipForward,
  RotateCcw,
  Plus
} from 'lucide-react';
import { SubjectId, FocusSession, RevisionCycleKey, CALevel } from '../types';
import { auth, db } from '../lib/firebase';
import { doc as firestoreDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { SUBJECT_CHAPTERS, getCanonicalChapterKey } from './RevisionPlanner';
import { ModalPortal } from './ModalPortal';
import { formatRunningTime, formatStaticDuration } from '../utils/timeFormat';
import {
  normalizeKey,
  getPostExamLockedSubjectsMap,
  isSubjectLockedAfterFinalExam,
  toggleFinalSprintMilestoneCompletion,
  getExamConclusionHourForSubject,
  isComprehensiveStudyBlockTask
} from '../utils/taskCompletionSync';
import { classifyChapterICAI, ABCCategory } from '../utils/automatedStudyPlannerEngine';
import {
  getActiveCALevel,
  getLevelScopedKey,
  getLevelSubjectIds,
  getSubjectLevel,
  getFirestoreRevisionDocId,
  getFirestoreRevisionLogsDocId,
  isClockSlotsStorageKeyForLevel,
  parseClockSlotsDateFromKey,
  getDefaultAttemptDateForLevel
} from '../utils/levelStorage';

export type LmrChapterStatus = 'not_started' | 'in_progress' | 'completed';
export type LmrSortOption = 'cognitive_flow' | 'syllabus' | 'custom' | 'status' | 'actual_desc' | 'planned_desc';
export type LmrCognitivePhaseId = 'day1_eve' | 'gap_am_peak' | 'gap_pm_eve' | 'exam_am_recall';

export type LmrDynamicRebalancePriorityLevel =
  | 'standard'
  | 'level1_extension'
  | 'level2_uniform_reduction'
  | 'level3_category_floors'
  | 'level3_absolute_floors'
  | 'coverage_trimmed';

export interface LmrSprintBudgetSummary {
  grossWindowMinutes: number; // Gross mins from Start Time (FR: -4d 06:00 AM, Others: Prev Exam 7:00 PM) to 9:30 AM Exam Day
  minSleepMinutes: number; // Strictly 6h (360m) per day transition
  minRoutineMinutes: number; // Strictly 1h (60m) Start Day + 1h (60m) Exam Day + 2h (120m) per full study day
  netAvailableMinutes: number; // Total Available Time (ending 9:30 AM Exam Day)
  flexExtensionMinutes: number; // +3 Flexible Hours (+180m extending 9:30 AM -> 12:30 PM)
  maxAvailableMinutes: number; // Total Available Time + 3 Flexible Hours (1530m standard 1.5d / 4230m FR)
  sprintStartDateStr: string;
  sprintStartTimeLabel: string;
  standardEndTimeLabel: string;
  maxFlexEndTimeLabel: string;
  dayTransitions: number;
  fullStudyDays: number;
}

export interface LmrSmartChapterPlanItem {
  chapterName: string;
  canonicalKey: string;
  syllabusIndex: number;
  sequenceOrder: number;
  cognitivePhaseId: LmrCognitivePhaseId;
  cognitivePhaseRank: number;
  windowTagShort: string;
  windowTagFull: string;
  icaiSectionCode: string;
  icaiSectionName: string;
  icaiWeightageRange: string;
  abcCategory: ABCCategory;
  weightageMarks: number;
  baseStudyMinutes: number;
  historicalBaselineMinutes: number; // Average completion time from Revision Report logs (or calibrated fallback)
  revisionAverageMinutes: number; // Strict arithmetic average across Revision cycles (rev1..revN), excluding baseline & rev1.5
  normalizedWeight: number; // Normalized ABC + historical weight (Sum of active weights === 1.0)
  baselinePlannedMinutes: number; // Original proportional time assignment (normalizedWeight * Total Available Time)
  needMultiplier: number;
  priorRevisionsCompleted: number;
  compositeScore: number;
  plannedMinutes: number;
  isSkipped: boolean;
  manualSkip: boolean;
  priorityLevelApplied?: LmrDynamicRebalancePriorityLevel;
}

export interface NextExamSprintInfo {
  subjectId: SubjectId;
  paperNumber: number;
  paperName: string;
  subjectName: string;
  paperLabel: string;
  examDateStr: string;
  sprintStartDateStr: string;
  isWithinSprintWindow: boolean;
  isExamToday: boolean;
  hoursUntilExamEnd: number;
}

export const PAPER_META: Record<SubjectId, { number: number; name: string; shortLabel: string }> = {
  // CA Foundation (Papers 1–4)
  Accounts: {
    number: 1,
    name: 'Accounting',
    shortLabel: 'Paper 1 • Accounts'
  },
  Law: {
    number: 2,
    name: 'Business Laws',
    shortLabel: 'Paper 2 • Law'
  },
  MathStats: {
    number: 3,
    name: 'Quantitative Aptitude (Maths, LR & Stats)',
    shortLabel: 'Paper 3 • MathStats'
  },
  Econ: {
    number: 4,
    name: 'Business Economics',
    shortLabel: 'Paper 4 • Econ'
  },
  // CA Intermediate (Papers 1–6)
  AdvAcc: {
    number: 1,
    name: 'Advanced Accounting',
    shortLabel: 'Paper 1 • AdvAcc'
  },
  CorpLaw: {
    number: 2,
    name: 'Corporate and Other Laws',
    shortLabel: 'Paper 2 • CorpLaw'
  },
  Tax: {
    number: 3,
    name: 'Taxation (Income-tax & GST)',
    shortLabel: 'Paper 3 • Tax'
  },
  Cost: {
    number: 4,
    name: 'Cost and Management Accounting',
    shortLabel: 'Paper 4 • Cost'
  },
  AuditInter: {
    number: 5,
    name: 'Auditing and Ethics',
    shortLabel: 'Paper 5 • AuditInter'
  },
  FMSM: {
    number: 6,
    name: 'Financial & Strategic Management',
    shortLabel: 'Paper 6 • FMSM'
  },
  // CA Final (Papers 1–6)
  FR: {
    number: 1,
    name: 'Financial Reporting',
    shortLabel: 'Paper 1 • FR'
  },
  AFM: {
    number: 2,
    name: 'Advanced Financial Management',
    shortLabel: 'Paper 2 • AFM'
  },
  Audit: {
    number: 3,
    name: 'Advanced Auditing & Professional Ethics',
    shortLabel: 'Paper 3 • Audit'
  },
  DT: {
    number: 4,
    name: 'Direct Tax Laws & International Taxation',
    shortLabel: 'Paper 4 • DT'
  },
  IDT: {
    number: 5,
    name: 'Indirect Tax Laws (GST & Customs)',
    shortLabel: 'Paper 5 • IDT'
  },
  IBS: {
    number: 6,
    name: 'Integrated Business Solutions',
    shortLabel: 'Paper 6 • IBS'
  },
  // CMA Foundation (Papers 1–4)
  CMAFoundLaw: {
    number: 1,
    name: 'Fundamentals of Business Laws and Business Communication',
    shortLabel: 'Paper 1 • CMAFoundLaw'
  },
  CMAFoundAcc: {
    number: 2,
    name: 'Fundamentals of Financial and Cost Accounting',
    shortLabel: 'Paper 2 • CMAFoundAcc'
  },
  CMAFoundMath: {
    number: 3,
    name: 'Fundamentals of Business Mathematics and Statistics',
    shortLabel: 'Paper 3 • CMAFoundMath'
  },
  CMAFoundEcon: {
    number: 4,
    name: 'Fundamentals of Business Economics and Management',
    shortLabel: 'Paper 4 • CMAFoundEcon'
  },
  // CMA Intermediate (Papers 5–12)
  CMAInterLaw: {
    number: 5,
    name: 'Business Laws and Ethics',
    shortLabel: 'Paper 5 • CMAInterLaw'
  },
  CMAInterFA: {
    number: 6,
    name: 'Financial Accounting',
    shortLabel: 'Paper 6 • CMAInterFA'
  },
  CMAInterTax: {
    number: 7,
    name: 'Direct and Indirect Taxation',
    shortLabel: 'Paper 7 • CMAInterTax'
  },
  CMAInterCost: {
    number: 8,
    name: 'Cost Accounting',
    shortLabel: 'Paper 8 • CMAInterCost'
  },
  CMAInterOMSM: {
    number: 9,
    name: 'Operations Management and Strategic Management',
    shortLabel: 'Paper 9 • CMAInterOMSM'
  },
  CMAInterCAA: {
    number: 10,
    name: 'Corporate Accounting and Auditing',
    shortLabel: 'Paper 10 • CMAInterCAA'
  },
  CMAInterFMDA: {
    number: 11,
    name: 'Financial Management and Business Data Analytics',
    shortLabel: 'Paper 11 • CMAInterFMDA'
  },
  CMAInterMA: {
    number: 12,
    name: 'Management Accounting',
    shortLabel: 'Paper 12 • CMAInterMA'
  },
  // CMA Final (Papers 13–20)
  CMAFinalLaw: {
    number: 13,
    name: 'Corporate and Economic Laws',
    shortLabel: 'Paper 13 • CMAFinalLaw'
  },
  CMAFinalSFM: {
    number: 14,
    name: 'Strategic Financial Management',
    shortLabel: 'Paper 14 • CMAFinalSFM'
  },
  CMAFinalDT: {
    number: 15,
    name: 'Direct Tax Laws and International Taxation',
    shortLabel: 'Paper 15 • CMAFinalDT'
  },
  CMAFinalSCM: {
    number: 16,
    name: 'Strategic Cost Management',
    shortLabel: 'Paper 16 • CMAFinalSCM'
  },
  CMAFinalCMA: {
    number: 17,
    name: 'Cost and Management Audit',
    shortLabel: 'Paper 17 • CMAFinalCMA'
  },
  CMAFinalCFR: {
    number: 18,
    name: 'Corporate Financial Reporting',
    shortLabel: 'Paper 18 • CMAFinalCFR'
  },
  CMAFinalIDT: {
    number: 19,
    name: 'Indirect Tax Laws and Practice',
    shortLabel: 'Paper 19 • CMAFinalIDT'
  },
  CMAFinalSPBV: {
    number: 20,
    name: 'Strategic Performance Management and Business Valuation',
    shortLabel: 'Paper 20 • CMAFinalSPBV'
  }
};

export function normalizeSubjectId(raw?: string, level?: CALevel): SubjectId | null {
  if (!raw) return null;
  const upper = String(raw).trim().toUpperCase();
  if (upper === 'ACCOUNTS') return 'Accounts';
  if (upper === 'LAW') return 'Law';
  if (upper === 'MATHSTATS' || upper === 'QA') return 'MathStats';
  if (upper === 'ECON') return 'Econ';
  if (upper === 'ADVACC') return 'AdvAcc';
  if (upper === 'CORPLAW') return 'CorpLaw';
  if (upper === 'TAX') return 'Tax';
  if (upper === 'COST') return 'Cost';
  if (upper === 'AUDITINTER') return 'AuditInter';
  if (upper === 'FMSM') return 'FMSM';
  if (upper === 'FR') return 'FR';
  if (upper === 'AFM') return 'AFM';
  if (upper === 'AUDIT') {
    const activeLevel = level || getActiveCALevel();
    return activeLevel === 'intermediate' ? 'AuditInter' : 'Audit';
  }
  if (upper === 'DT') return 'DT';
  if (upper === 'IDT') return 'IDT';
  if (upper === 'IBS') return 'IBS';
  // CMA Subjects
  const cmaIds: SubjectId[] = [
    'CMAFoundLaw', 'CMAFoundAcc', 'CMAFoundMath', 'CMAFoundEcon',
    'CMAInterLaw', 'CMAInterFA', 'CMAInterTax', 'CMAInterCost',
    'CMAInterOMSM', 'CMAInterCAA', 'CMAInterFMDA', 'CMAInterMA',
    'CMAFinalLaw', 'CMAFinalSFM', 'CMAFinalDT', 'CMAFinalSCM',
    'CMAFinalCMA', 'CMAFinalCFR', 'CMAFinalIDT', 'CMAFinalSPBV'
  ];
  const matchedCma = cmaIds.find(id => id.toUpperCase() === upper);
  if (matchedCma) return matchedCma;
  return null;
}

function getLocalDateStr(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysToDateString(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const dt = new Date(y, m - 1, d + days);
  return getLocalDateStr(dt);
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatExamDateShort(dStr: string): string {
  if (!dStr || !/^\d{4}-\d{2}-\d{2}$/.test(dStr)) return '';
  const [, m, d] = dStr.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${SHORT_MONTHS[(m || 1) - 1] || ''}`;
}

export interface OrderedExamPaperItem {
  subjectId: SubjectId;
  paperNumber: number;
  fullName: string;
  dateStr: string;
  sprintStartDateStr: string;
  formattedDate: string;
  diffDays: number;
  hasMilestoneDate: boolean;
  isConcluded: boolean;
}

/**
 * Single source of truth that resolves the Next Exam List (`orderedExams`) and Next Active Exam (`nextExam`)
 * strictly from the Exam Dates configured in Study Planner (`practca_subject_final_exam_dates` and Final Sprint milestones).
 */
export function resolveActiveExamSchedule(
  baseExamDateOverride?: string,
  now: Date = new Date(),
  level?: CALevel
): {
  hasScheduledExam: boolean;
  areExamsStarted: boolean;
  orderedExams: OrderedExamPaperItem[];
  nextExam: OrderedExamPaperItem;
  areAllScheduledExamsConcluded: boolean;
  scheduleSignature: string;
  latestExamDateStr: string;
} {
  const activeLevel = level || getActiveCALevel();
  const levelSequentialSubjects = getLevelSubjectIds(activeLevel);
  const levelSubjectSet = new Set<SubjectId>(levelSequentialSubjects);
  const todayStr = getLocalDateStr(now);
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const isAttemptCleared = Boolean(
    localStorage.getItem(getLevelScopedKey('practca_exam_attempt_cleared', activeLevel)) === 'true' ||
      baseExamDateOverride === ''
  );
  if (isAttemptCleared) {
    const fallbackSub = levelSequentialSubjects[0];
    return {
      hasScheduledExam: false,
      areExamsStarted: false,
      orderedExams: [],
      nextExam: {
        subjectId: fallbackSub,
        paperNumber: PAPER_META[fallbackSub].number,
        fullName: PAPER_META[fallbackSub].name,
        dateStr: todayStr,
        sprintStartDateStr: todayStr,
        formattedDate: '',
        diffDays: 0,
        hasMilestoneDate: false,
        isConcluded: true
      },
      areAllScheduledExamsConcluded: false,
      scheduleSignature: '',
      latestExamDateStr: ''
    };
  }
  const baseExamDate =
    baseExamDateOverride ||
    localStorage.getItem(getLevelScopedKey('practca_exam_date', activeLevel)) ||
    getDefaultAttemptDateForLevel(activeLevel);
  const isFutureMasterAttempt = Boolean(
    baseExamDate && /^\d{4}-\d{2}-\d{2}$/.test(baseExamDate) && baseExamDate > todayStr
  );

  // 1. Read Exam Dates saved in Study Planner (`practca_subject_final_exam_dates`)
  const studyPlannerExamDates: Partial<Record<SubjectId, string>> = {};
  const sprintStartDatesMap: Partial<Record<SubjectId, string>> = {};
  const completedSprintSubjects = new Set<SubjectId>();

  try {
    const rawDates = localStorage.getItem(
      getLevelScopedKey('practca_subject_final_exam_dates', activeLevel)
    );
    if (rawDates) {
      const parsed = JSON.parse(rawDates);
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach((k) => {
          const sub = normalizeSubjectId(k, activeLevel);
          const val = parsed[k];
          if (sub && levelSubjectSet.has(sub) && typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
            if (!isFutureMasterAttempt || val >= baseExamDate) {
              studyPlannerExamDates[sub] = val;
            }
          }
        });
      }
    }
  } catch (e) {}

  // 2. Also check Final Sprint exam checkpoints in Study Planner (`practca_roadmap_user_checkpoints`)
  try {
    const rawCps = localStorage.getItem(
      getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel)
    );
    if (rawCps) {
      const parsed = JSON.parse(rawCps);
      if (Array.isArray(parsed)) {
        parsed.forEach((cp: any) => {
          const sub = normalizeSubjectId(cp?.subjectId, activeLevel);
          if (
            !sub ||
            !levelSubjectSet.has(sub) ||
            typeof cp?.targetDate !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(cp.targetDate)
          ) {
            return;
          }
          const isFinalSprint = Boolean(
            cp.revisionCycle === 'Final Sprint' ||
              String(cp.id || '').startsWith('cp_final_sprint_') ||
              String(cp.customTitle || '').toLowerCase().includes('1.5-day') ||
              String(cp.customTitle || '').toLowerCase().includes('1.5 day') ||
              String(cp.customTitle || '').toLowerCase().includes('final sprint')
          );
          if (!isFinalSprint) return;
          if (isFutureMasterAttempt && cp.targetDate < baseExamDate) return;

          if (!studyPlannerExamDates[sub]) {
            studyPlannerExamDates[sub] = cp.targetDate;
          }
          if (typeof cp.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cp.startDate)) {
            sprintStartDatesMap[sub] = cp.startDate;
          }
          if (cp.completed && todayStr >= cp.targetDate) {
            completedSprintSubjects.add(sub);
          }
        });
      }
    }
  } catch (e) {}

  // 3. Determine the Next Exam List strictly from the subjects configured in Study Planner's Exam Dates
  const configuredSubjects = levelSequentialSubjects.filter((subId) =>
    Boolean(studyPlannerExamDates[subId] && /^\d{4}-\d{2}-\d{2}$/.test(studyPlannerExamDates[subId]!))
  );

  // If the user has configured Exam Dates in Study Planner, use that exact list; otherwise fallback to all level ICAI papers
  const candidateSubjects: SubjectId[] =
    configuredSubjects.length > 0 ? configuredSubjects : [...levelSequentialSubjects];

  const [ty, tm, td] = todayStr.split('-').map(Number);
  const todayMidnight = new Date(ty, (tm || 1) - 1, td || 1).getTime();

  const buildPaperItem = (subId: SubjectId): OrderedExamPaperItem => {
    const idx = levelSequentialSubjects.indexOf(subId);
    const hasExamDate = Boolean(studyPlannerExamDates[subId]);
    const dateStr = hasExamDate
      ? studyPlannerExamDates[subId]!
      : addDaysToDateString(baseExamDate, Math.max(0, idx) * 2);

    const resolvedStart = resolveSprintStartDateForSubject(
      subId,
      dateStr,
      studyPlannerExamDates,
      activeLevel
    );
    const legacyDefaultStart = addDaysToDateString(dateStr, -1);
    const savedStart = sprintStartDatesMap[subId];
    // Override stale legacy "-1 day" defaults so FR starts 5 days prior and AFM–IBS start on prev exam day
    const sprintStartDateStr =
      savedStart && savedStart !== legacyDefaultStart && savedStart <= dateStr
        ? savedStart
        : resolvedStart;

    const [ey, em, ed] = dateStr.split('-').map(Number);
    const examMidnight = new Date(ey, (em || 1) - 1, ed || 1).getTime();
    const diffDays = Math.round((examMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
    const conclusionHour = getExamConclusionHourForSubject(subId);
    const isPastConclusion = todayStr > dateStr || (todayStr === dateStr && currentHour >= conclusionHour);
    const isLockedPostExam = isSubjectLockedAfterFinalExam(subId, now, activeLevel);
    const isConcluded = Boolean(
      isPastConclusion || isLockedPostExam || (completedSprintSubjects.has(subId) && isPastConclusion)
    );

    return {
      subjectId: subId,
      paperNumber: PAPER_META[subId].number,
      fullName: PAPER_META[subId].name,
      dateStr,
      sprintStartDateStr,
      formattedDate: formatExamDateShort(dateStr),
      diffDays,
      hasMilestoneDate: hasExamDate,
      isConcluded
    };
  };

  const orderedExams = candidateSubjects
    .map(buildPaperItem)
    .sort((a, b) => {
      const cmp = a.dateStr.localeCompare(b.dateStr);
      if (cmp !== 0) return cmp;
      return a.paperNumber - b.paperNumber;
    });

  const nextExam =
    orderedExams.find((e) => !e.isConcluded) ||
    orderedExams[orderedExams.length - 1] ||
    orderedExams[0];

  const earliestDate = orderedExams.length > 0 ? orderedExams[0].dateStr : baseExamDate;
  const earliestSprintStartDate =
    orderedExams.length > 0 ? orderedExams[0].sprintStartDateStr : addDaysToDateString(earliestDate, -4);
  const latestDate = orderedExams.length > 0 ? orderedExams[orderedExams.length - 1].dateStr : baseExamDate;

  const areAllScheduledExamsConcluded = Boolean(
    orderedExams.length > 0 &&
      orderedExams.every((e) => e.isConcluded) &&
      (configuredSubjects.length > 0 || completedSprintSubjects.size > 0 || todayStr >= latestDate)
  );

  const hasScheduledExam = !areAllScheduledExamsConcluded;

  const areExamsStarted = Boolean(
    hasScheduledExam &&
      (configuredSubjects.length > 0 ||
        todayStr >= earliestSprintStartDate ||
        todayStr >= baseExamDate)
  );

  const scheduleSignature = orderedExams
    .map((e) => `${e.subjectId}:${e.dateStr}`)
    .join('|');

  return {
    hasScheduledExam,
    areExamsStarted,
    orderedExams,
    nextExam,
    areAllScheduledExamsConcluded,
    scheduleSignature,
    latestExamDateStr: latestDate
  };
}

/**
 * Resolves the currently active/upcoming exam paper and 1.5-Day Final Sprint schedule
 * directly synced with the Next Active Milestone.
 */
export function resolveNextExamSprintInfo(now: Date = new Date(), level?: CALevel): NextExamSprintInfo {
  const activeLevel = level || getActiveCALevel();
  const todayStr = getLocalDateStr(now);
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentMinutesOfDay = now.getHours() * 60 + now.getMinutes();
  const { hasScheduledExam, areAllScheduledExamsConcluded, nextExam } = resolveActiveExamSchedule(
    undefined,
    now,
    activeLevel
  );
  const conclusionHour = getExamConclusionHourForSubject(nextExam.subjectId);
  const startBoundary = resolveSprintStartBoundaryForSubject(
    nextExam.subjectId,
    nextExam.dateStr,
    undefined,
    activeLevel
  );
  const hasReachedSprintStartMoment =
    todayStr > nextExam.sprintStartDateStr ||
    (todayStr === nextExam.sprintStartDateStr &&
      (nextExam.sprintStartDateStr < startBoundary.startDateStr ||
        currentMinutesOfDay >= startBoundary.startMinutesOfDay));

  const isWithinSprintWindow =
    hasScheduledExam &&
    !areAllScheduledExamsConcluded &&
    !nextExam.isConcluded &&
    hasReachedSprintStartMoment &&
    (todayStr < nextExam.dateStr || (todayStr === nextExam.dateStr && currentHour < conclusionHour));

  const isExamToday = todayStr === nextExam.dateStr;

  const [ey, em, ed] = nextExam.dateStr.split('-').map(Number);
  const examEndConclusion = new Date(ey, (em || 1) - 1, ed || 1, conclusionHour, 0, 0, 0);
  const hoursUntilExamEnd = Math.max(
    0,
    Math.round(((examEndConclusion.getTime() - now.getTime()) / (1000 * 3600)) * 10) / 10
  );

  return {
    subjectId: nextExam.subjectId,
    paperNumber: nextExam.paperNumber,
    paperName: nextExam.fullName,
    subjectName: nextExam.fullName,
    paperLabel: PAPER_META[nextExam.subjectId].shortLabel,
    examDateStr: nextExam.dateStr,
    sprintStartDateStr: nextExam.sprintStartDateStr,
    isWithinSprintWindow,
    isExamToday,
    hoursUntilExamEnd
  };
}

export function getLmrSprintWindowSignature(sprintInfo: Pick<NextExamSprintInfo, 'subjectId' | 'examDateStr'>): string {
  return `${sprintInfo.subjectId}_${sprintInfo.examDateStr}`;
}

/**
 * Checks whether 1.5-Day LMR Mode is currently turned on.
 * Turning ON is strictly auto-triggered during the active LMR sprint window;
 * outside the sprint window it is always OFF, and inside a sprint window it stays ON
 * unless the student manually turned it OFF for that sprint window.
 */
export function isLmrModeCurrentlyOn(level?: CALevel, now: Date = new Date()): boolean {
  try {
    const activeLevel = level || getActiveCALevel();
    const sprintInfo = resolveNextExamSprintInfo(now, activeLevel);
    if (!sprintInfo.isWithinSprintWindow) {
      return false;
    }
    const sprintSig = getLmrSprintWindowSignature(sprintInfo);
    const manualOffSigKey = getLevelScopedKey('practca_lmr_manual_off_sig', activeLevel);
    if (localStorage.getItem(manualOffSigKey) === sprintSig) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Allows the student to manually turn OFF LMR Mode during an active LMR sprint.
 * LMR Mode can only be turned OFF manually; turning ON is exclusively auto-triggered in LMR sprint time.
 */
export function turnOffLmrModeManually(level?: CALevel, now: Date = new Date()): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const activeLevel = level || getActiveCALevel();
    if (!isLmrModeCurrentlyOn(activeLevel, now)) {
      return false;
    }
    const sprintInfo = resolveNextExamSprintInfo(now, activeLevel);
    const sprintSig = getLmrSprintWindowSignature(sprintInfo);
    localStorage.setItem(getLevelScopedKey('practca_lmr_manual_off_sig', activeLevel), sprintSig);
    localStorage.setItem(getLevelScopedKey('practca_lmr_mode_disabled', activeLevel), 'true');
    localStorage.setItem(getLevelScopedKey('practca_lmr_mode_active', activeLevel), 'false');

    window.dispatchEvent(new Event('practca_lmr_preference_updated'));
    window.dispatchEvent(new Event('practca_lmr_mode_changed'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch {
    return false;
  }
}

/**
 * Synchronizes LMR Mode auto-activation when entering LMR sprint time
 * and automatic reversion to Regular Mode once outside sprint time.
 */
export function syncLmrAutoTriggerForActiveWindow(
  now: Date = new Date(),
  level?: CALevel
): {
  isActive: boolean;
  justAutoActivated: boolean;
  justAutoDeactivated: boolean;
  sprintInfo: NextExamSprintInfo;
} {
  const activeLevel = level || getActiveCALevel();
  const sprintInfo = resolveNextExamSprintInfo(now, activeLevel);
  if (typeof window === 'undefined') {
    return { isActive: false, justAutoActivated: false, justAutoDeactivated: false, sprintInfo };
  }

  try {
    const disabledKey = getLevelScopedKey('practca_lmr_mode_disabled', activeLevel);
    const activeKey = getLevelScopedKey('practca_lmr_mode_active', activeLevel);
    const manualOffSigKey = getLevelScopedKey('practca_lmr_manual_off_sig', activeLevel);
    const autoTriggeredSigKey = getLevelScopedKey('practca_lmr_auto_triggered_sig', activeLevel);

    if (sprintInfo.isWithinSprintWindow) {
      const sprintSig = getLmrSprintWindowSignature(sprintInfo);
      const isManuallyOffForThisSprint = localStorage.getItem(manualOffSigKey) === sprintSig;

      if (isManuallyOffForThisSprint) {
        if (localStorage.getItem(activeKey) !== 'false' || localStorage.getItem(disabledKey) !== 'true') {
          localStorage.setItem(activeKey, 'false');
          localStorage.setItem(disabledKey, 'true');
          window.dispatchEvent(new Event('practca_lmr_preference_updated'));
          window.dispatchEvent(new Event('practca_lmr_mode_changed'));
        }
        return { isActive: false, justAutoActivated: false, justAutoDeactivated: false, sprintInfo };
      }

      const wasAlreadyActiveForSprint =
        localStorage.getItem(activeKey) === 'true' &&
        localStorage.getItem(disabledKey) !== 'true' &&
        localStorage.getItem(autoTriggeredSigKey) === sprintSig;

      if (!wasAlreadyActiveForSprint) {
        localStorage.setItem(activeKey, 'true');
        localStorage.setItem(disabledKey, 'false');
        localStorage.setItem(autoTriggeredSigKey, sprintSig);
        localStorage.setItem('practca_lmr_selected_subject', sprintInfo.subjectId);

        window.dispatchEvent(new Event('practca_lmr_preference_updated'));
        window.dispatchEvent(new Event('practca_lmr_mode_changed'));
        window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
        window.dispatchEvent(new Event('practca_revision_planner_updated'));
        window.dispatchEvent(new Event('practca_target_system_synced'));
        window.dispatchEvent(new Event('storage'));

        const popupSeenKey = getLevelScopedKey(`practca_lmr_popup_seen_${sprintSig}`, activeLevel);
        if (localStorage.getItem(popupSeenKey) !== 'true') {
          window.dispatchEvent(new Event('practca_trigger_lmr_activation_popup'));
        }
        return { isActive: true, justAutoActivated: true, justAutoDeactivated: false, sprintInfo };
      }

      return { isActive: true, justAutoActivated: false, justAutoDeactivated: false, sprintInfo };
    }

    // Outside LMR sprint time: ensure LMR Mode is OFF
    const wasActiveBefore = localStorage.getItem(activeKey) === 'true';
    if (wasActiveBefore) {
      localStorage.setItem(activeKey, 'false');
      localStorage.setItem(disabledKey, 'true');
      window.dispatchEvent(new Event('practca_lmr_preference_updated'));
      window.dispatchEvent(new Event('practca_lmr_mode_changed'));
      window.dispatchEvent(new Event('practca_target_system_synced'));
      window.dispatchEvent(new Event('storage'));
      return { isActive: false, justAutoActivated: false, justAutoDeactivated: true, sprintInfo };
    }
    return { isActive: false, justAutoActivated: false, justAutoDeactivated: false, sprintInfo };
  } catch {
    return { isActive: false, justAutoActivated: false, justAutoDeactivated: false, sprintInfo };
  }
}

/**
 * Identifies whether a task belongs to 1.5-Day LMR / Final Revision (`rev1.5`).
 * Note: Regular tasks with `priority: 'High'` are NOT treated as 1.5-Day Sprint tasks unless
 * they explicitly carry Final Revision / 1.5-Day / LMR / rev1.5 markers.
 */
export function is15DayLmrTask(t: any): boolean {
  if (!t) return false;
  if (t.revKey === 'rev1.5') return true;
  if (t.relevance === 'Final Revision') return true;
  const idStr = String(t.id || '');
  const milestoneIdStr = String(t.milestoneId || '');
  if (idStr.startsWith('local-task-finalsprint-') || milestoneIdStr.startsWith('cp_final_sprint_')) {
    return true;
  }
  const combinedText = `${t.title || ''} ${t.cleanTitle || ''} ${t.notes || ''}`;
  if (
    /\b(final\s*revision|final\s*sprint|1\.5\s*day|1\.5-day|1\.5d|rev\s*1\.5|r1\.5|lmr)\b/i.test(
      combinedText
    )
  ) {
    return true;
  }
  if (/(RELEVANCE:\s*FINAL\s*REVISION|REVKEY:\s*REV1\.5)/i.test(t.notes || '')) {
    return true;
  }
  return false;
}

export function resolveLmrTaskSubjectCode(t: any, level?: CALevel): SubjectId {
  const activeLevel = level || getActiveCALevel();
  const levelSubjects = getLevelSubjectIds(activeLevel);
  const allSubjects: SubjectId[] = [
    ...levelSubjects,
    'Accounts',
    'Law',
    'MathStats',
    'Econ',
    'AdvAcc',
    'CorpLaw',
    'Tax',
    'Cost',
    'AuditInter',
    'FMSM',
    'FR',
    'AFM',
    'Audit',
    'DT',
    'IDT',
    'IBS'
  ];
  const direct = String(t?.subjectCode || t?.subject || '').trim();
  if (direct) {
    const foundInLevel = levelSubjects.find((s) => s.toUpperCase() === direct.toUpperCase());
    if (foundInLevel) return foundInLevel;
    const foundDirect = allSubjects.find((s) => s.toUpperCase() === direct.toUpperCase());
    if (foundDirect) return foundDirect;
  }
  const notesStr = String(t?.notes || '');
  const subMatch = notesStr.match(
    /Subject:\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)/i
  );
  if (subMatch) {
    const found = allSubjects.find((s) => s.toUpperCase() === subMatch[1].toUpperCase());
    if (found) return found;
  }
  const titleStr = String(t?.title || t?.cleanTitle || '');
  const bracketMatch = titleStr.match(
    /\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS|CMA[A-Za-z0-9]+)\s*\]/i
  );
  if (bracketMatch) {
    const found = allSubjects.find((s) => s.toUpperCase() === bracketMatch[1].toUpperCase());
    if (found) return found;
  }
  const upper = titleStr.toUpperCase();
  if (activeLevel === 'foundation') {
    if (/\b(ACCOUNTS|ACCOUNTING|DEPRECIATION|PARTNERSHIP|BRS)\b/.test(upper)) return 'Accounts';
    if (/\b(LAW|CONTRACT|PARTNERSHIP\s*ACT|SALE\s*OF\s*GOODS|LLP|COMPANIES\s*ACT)\b/.test(upper)) return 'Law';
    if (/\b(MATH|STATS|STATISTICS|LOGICAL\s*REASONING|TIME\s*VALUE|PROBABILITY)\b/.test(upper)) return 'MathStats';
    if (/\b(ECON|ECONOMICS|MACRO|DEMAND|SUPPLY|NATIONAL\s*INCOME)\b/.test(upper)) return 'Econ';
    return levelSubjects[0] || 'Accounts';
  }
  if (activeLevel === 'cma_foundation') {
    if (/\b(LAW|CONTRACT|SALE\s*OF\s*GOODS|NEGOTIABLE|COMMUNICATION)\b/.test(upper)) return 'CMAFoundLaw';
    if (/\b(ACCOUNTING|COST|FINAL\s*ACCOUNTS|CONSIGNMENT)\b/.test(upper)) return 'CMAFoundAcc';
    if (/\b(MATH|STATS|STATISTICS|ALGEBRA|CALCULUS|PROBABILITY)\b/.test(upper)) return 'CMAFoundMath';
    if (/\b(ECON|ECONOMICS|MANAGEMENT|DEMAND|SUPPLY)\b/.test(upper)) return 'CMAFoundEcon';
    return levelSubjects[0] || 'CMAFoundLaw';
  }
  if (activeLevel === 'intermediate') {
    if (/\b(ADVACC|ADVANCED\s*ACCOUNTING|AMALGAMATION|BRANCH|AS\s*\d+)\b/.test(upper)) return 'AdvAcc';
    if (/\b(CORPLAW|CORPORATE\s*LAW|COMPANIES\s*ACT|FEMA|LLP)\b/.test(upper)) return 'CorpLaw';
    if (/\b(TAX|INCOME\s*TAX|GST|TDS|ITC)\b/.test(upper)) return 'Tax';
    if (/\b(COST|COSTING|MARGINAL|STANDARD\s*COSTING|OVERHEADS|BUDGET)\b/.test(upper)) return 'Cost';
    if (/\b(AUDIT|AUDITING|ETHICS)\b/.test(upper)) return 'AuditInter';
    if (/\b(FMSM|FINANCIAL\s*MANAGEMENT|STRATEGIC\s*MANAGEMENT|CAPITAL\s*BUDGETING|WACC)\b/.test(upper)) return 'FMSM';
    return levelSubjects[0] || 'AdvAcc';
  }
  if (activeLevel === 'cma_intermediate') {
    if (/\b(LAW|ETHICS|FACTORIES|GRATUITY)\b/.test(upper)) return 'CMAInterLaw';
    if (/\b(FINANCIAL\s*ACCOUNTING|PARTNERSHIP|BRANCH|LEASE)\b/.test(upper)) return 'CMAInterFA';
    if (/\b(TAX|INCOME\s*TAX|GST|CUSTOMS)\b/.test(upper)) return 'CMAInterTax';
    if (/\b(COST\s*ACCOUNTING|CAS|OVERHEADS)\b/.test(upper)) return 'CMAInterCost';
    if (/\b(OPERATIONS|OMSM|STRATEGIC|PERT|CPM)\b/.test(upper)) return 'CMAInterOMSM';
    if (/\b(CORPORATE\s*ACCOUNTING|AUDITING|CARO)\b/.test(upper)) return 'CMAInterCAA';
    if (/\b(FMDA|FINANCIAL\s*MANAGEMENT|DATA\s*ANALYTICS|WACC)\b/.test(upper)) return 'CMAInterFMDA';
    if (/\b(MANAGEMENT\s*ACCOUNTING|ABC|TRANSFER\s*PRICING)\b/.test(upper)) return 'CMAInterMA';
    return levelSubjects[0] || 'CMAInterLaw';
  }
  if (activeLevel === 'cma_final') {
    if (/\b(LAW|IBC|SEBI|COMPETITION|FEMA)\b/.test(upper)) return 'CMAFinalLaw';
    if (/\b(SFM|STRATEGIC\s*FINANCIAL|DERIVATIVES|PORTFOLIO)\b/.test(upper)) return 'CMAFinalSFM';
    if (/\b(DT|DIRECT\s*TAX|INTERNATIONAL\s*TAX|TRANSFER\s*PRICING)\b/.test(upper)) return 'CMAFinalDT';
    if (/\b(SCM|STRATEGIC\s*COST|LINEAR\s*PROGRAMMING|TARGET\s*COSTING)\b/.test(upper)) return 'CMAFinalSCM';
    if (/\b(COST.*AUDIT|MANAGEMENT\s*AUDIT|CRA)\b/.test(upper)) return 'CMAFinalCMA';
    if (/\b(CFR|CORPORATE\s*FINANCIAL\s*REPORTING|IND\s*AS|CONSOLIDATION)\b/.test(upper)) return 'CMAFinalCFR';
    if (/\b(IDT|INDIRECT\s*TAX|GST|CUSTOMS|FTP)\b/.test(upper)) return 'CMAFinalIDT';
    if (/\b(SPBV|PERFORMANCE\s*MANAGEMENT|BUSINESS\s*VALUATION|EVA|ALTMAN)\b/.test(upper)) return 'CMAFinalSPBV';
    return levelSubjects[0] || 'CMAFinalLaw';
  }
  if (/\b(FR|IND\s*AS|CONSOLIDATION|FINANCIAL\s*REPORTING)\b/.test(upper)) return 'FR';
  if (/\b(AFM|DERIVATIVES|FOREX|PORTFOLIO|VALUATION)\b/.test(upper)) return 'AFM';
  if (/\b(AUDIT|AUDITING|STANDARDS\s*ON\s*AUDITING|PROFESSIONAL\s*ETHICS)\b/.test(upper)) return 'Audit';
  if (/\b(DT|PGBP|INTERNATIONAL\s*TAX|TRANSFER\s*PRICING)\b/.test(upper)) return 'DT';
  if (/\b(IBS|CASE\s*STUDY|INTEGRATED\s*BUSINESS)\b/.test(upper)) return 'IBS';
  return 'IDT';
}

export function resolveLmrTaskDateStr(t: any, fallbackTodayStr?: string): string {
  if (!t) return '';
  const raw =
    t.taskDate ||
    t.scheduledDate ||
    t.date ||
    (t.due ? String(t.due).split('T')[0] : '') ||
    fallbackTodayStr ||
    '';
  const sliced = String(raw || '').trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(sliced) ? sliced : '';
}

/**
 * Returns the currently active sprint subject and remaining (unconcluded) exam subjects.
 */
export function getSprintAllowedSubjects(now: Date = new Date(), level?: CALevel): {
  activeSubject: SubjectId;
  remainingSubjects: SubjectId[];
  allowedSet: Set<SubjectId>;
  nextExamDateStr: string;
  todayStr: string;
} {
  const activeLevel = level || getActiveCALevel();
  const sched = resolveActiveExamSchedule(undefined, now, activeLevel);
  const activeSubject = sched.nextExam.subjectId;
  const unconcluded = sched.orderedExams
    .filter((e) => !e.isConcluded)
    .map((e) => e.subjectId);
  const remainingSubjects = unconcluded.length > 0
    ? Array.from(new Set<SubjectId>([activeSubject, ...unconcluded]))
    : [activeSubject];
  return {
    activeSubject,
    remainingSubjects,
    allowedSet: new Set<SubjectId>(remainingSubjects),
    nextExamDateStr: sched.nextExam.dateStr,
    todayStr: getLocalDateStr(now)
  };
}

/**
 * Determines whether a task is allowed to remain when 1.5-Day Sprint Mode is ON:
 * - Completed tasks are preserved for historical logs.
 * - All missed / unachieved / rescheduled tasks immediately lapse.
 * - All old pending tasks (scheduled before today) or non-1.5-Day tasks immediately lapse.
 * - Only 1.5-Day Sprint targets belonging to the Active Subject (for the current sprint window)
 *   or Remaining Unconcluded Subjects (for their upcoming sprint windows) remain available.
 */
export function isTaskEligibleInActiveLmrSprint(t: any, now: Date = new Date(), level?: CALevel): boolean {
  if (!t) return false;
  const activeLevel = level || getActiveCALevel();
  const isCompleted = t.status === 'completed' || Boolean(t.completed);
  if (isCompleted) return true;

  const notesStr = String(t.notes || '');
  const isMissed =
    t.status === 'unachieved' ||
    t.status === 'rescheduled' ||
    /STATUS:\s*UNACHIEVED/i.test(notesStr);
  if (isMissed) return false;

  if (!is15DayLmrTask(t)) return false;

  const { activeSubject, allowedSet, nextExamDateStr, todayStr } = getSprintAllowedSubjects(now, activeLevel);
  const tDate = resolveLmrTaskDateStr(t, todayStr);

  // Any incomplete task from before today (old pending / overdue) lapses immediately
  if (tDate && tDate < todayStr) return false;

  const subCode = resolveLmrTaskSubjectCode(t, activeLevel);
  // Concluded subjects are never available
  if (!allowedSet.has(subCode)) return false;

  // During the active subject's sprint window (up to nextExamDateStr), only the active subject's targets are active;
  // future sprint dates (> nextExamDateStr) allow the remaining unconcluded subjects.
  if (!tDate || tDate <= nextExamDateStr) {
    return subCode === activeSubject;
  }
  return allowedSet.has(subCode);
}

/**
 * When 1.5-Day LMR Mode is turned on, automatically lapses (closes & removes) all old pending tasks,
 * all missed/unachieved tasks, all non-1.5-day tasks, and any incomplete tasks for concluded subjects.
 * Preserves completed history and valid 1.5-Day Sprint targets for the active & remaining subjects.
 */
export function lapseNon15DayTasksWhenLmrActive(level?: CALevel): string[] {
  const activeLevel = level || getActiveCALevel();
  if (!isLmrModeCurrentlyOn(activeLevel)) return [];

  const now = new Date();
  const { todayStr } = getSprintAllowedSubjects(now, activeLevel);
  const lapsedIds = new Set<string>();
  const shouldKeepTask = (t: any): boolean => {
    if (!t) return false;
    if (isTaskEligibleInActiveLmrSprint(t, now, activeLevel)) return true;
    if (t.id) lapsedIds.add(String(t.id));
    return false;
  };

  let storageModified = false;
  const taskStorageKeys = [
    getLevelScopedKey('practca_local_tasks', activeLevel),
    getLevelScopedKey('practca_cached_cloud_tasks', activeLevel),
    getLevelScopedKey('practca_tasks_backup', activeLevel)
  ];

  taskStorageKeys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const filtered = parsed.filter(shouldKeepTask);
      if (filtered.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(filtered));
        storageModified = true;
      }
    } catch {}
  });

  // Also lapse non-eligible pending/missed items from the 24-Hour Target Flow queue
  try {
    const flowKey = getLevelScopedKey('practca_target_flow', activeLevel);
    const rawFlow = localStorage.getItem(flowKey);
    if (rawFlow) {
      const parsedFlow = JSON.parse(rawFlow);
      if (Array.isArray(parsedFlow)) {
        const filteredFlow = parsedFlow.filter((item: any) => {
          if (!item) return false;
          if (item.completed || item.status === 'completed') return true;
          return isTaskEligibleInActiveLmrSprint(item, now, activeLevel);
        });
        if (filteredFlow.length !== parsedFlow.length) {
          localStorage.setItem(flowKey, JSON.stringify(filteredFlow));
          storageModified = true;
        }
      }
    }
  } catch {}

  // Clean up any lapsed or past incomplete slots from 24-Hour Target Clocks for this level
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !isClockSlotsStorageKeyForLevel(key, activeLevel)) continue;
      const clockDate = parseClockSlotsDateFromKey(key, activeLevel) || '';
      const rawClock = localStorage.getItem(key);
      if (!rawClock) continue;
      const parsedClock = JSON.parse(rawClock);
      if (!Array.isArray(parsedClock)) continue;
      const filteredClock = parsedClock.filter((slot: any) => {
        if (!slot) return false;
        if (slot.completed || slot.status === 'completed') return true;
        if (clockDate && clockDate < todayStr) return false;
        if (slot.taskId && lapsedIds.has(String(slot.taskId))) return false;
        return isTaskEligibleInActiveLmrSprint(
          { ...slot, taskDate: clockDate || todayStr },
          now,
          activeLevel
        );
      });
      if (filteredClock.length !== parsedClock.length) {
        localStorage.setItem(key, JSON.stringify(filteredClock));
        storageModified = true;
      }
    }
  } catch {}

  const lapsedArray = Array.from(lapsedIds);

  // Sync deletion to Firestore if user is authenticated
  try {
    const currentUser = auth?.currentUser;
    if (currentUser && !currentUser.isAnonymous && lapsedArray.length > 0) {
      lapsedArray.forEach((taskId) => {
        deleteDoc(firestoreDoc(db, 'users', currentUser.uid, 'tasks', taskId)).catch(() => {});
      });
    }
  } catch {}

  if (storageModified) {
    try {
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_flow_updated'));
    } catch {}
  }

  return lapsedArray;
}

export const LMR_GROSS_SPRINT_WINDOW_MINUTES = 2310; // 38.5 hours: 7:00 PM (Prev Exam Day) -> 9:30 AM (Exam Day)
export const LMR_FLEX_EXTENSION_MINUTES = 180; // +3 Flexible Hours extending 9:30 AM -> 12:30 PM on Exam Day
export const LMR_STANDARD_END_MINUTES_OF_DAY = 9 * 60 + 30; // 09:30 AM (570 mins from midnight)
export const LMR_MAX_FLEX_END_MINUTES_OF_DAY = 12 * 60 + 30; // 12:30 PM (750 mins from midnight)
export const LMR_SUBSEQUENT_START_MINUTES_OF_DAY = 19 * 60; // 7:00 PM (1140 mins from midnight)
export const LMR_FIRST_PAPER_START_MINUTES_OF_DAY = 6 * 60; // 06:00 AM (360 mins from midnight)
export const LMR_EXAM_MORNING_BUFFER_MINUTES = 180; // 3 flexible hours from 9:30 AM to 12:30 PM on Exam Day
export const LMR_SLEEP_PER_NIGHT_MINUTES = 360; // Strictly 6 hours sleep time per day transition
export const LMR_FULL_DAY_ROUTINE_MINUTES = 120; // Strictly 2 hours routine allowance on full study days
export const LMR_PARTIAL_DAY_ROUTINE_MINUTES = 60; // Strictly 1 hour routine allowance on Start Day and Exam Day
export const LMR_MIN_CHAPTER_FLOOR_MINUTES = 5; // Minimum practical revision block when squeezing to absolute Category C floor (10%-15%)

const COGNITIVE_PHASE_META: Record<
  LmrCognitivePhaseId,
  { rank: number; shortTag: string; fullTag: string }
> = {
  day1_eve: {
    rank: 1,
    shortTag: 'Start Window · 7:00 PM+',
    fullTag: 'Sprint Start Window (7:00 PM Prev Exam / FR 5-Day Start · 1h Routine) · Momentum Builder'
  },
  gap_am_peak: {
    rank: 2,
    shortTag: 'Peak AM · 6:00 AM–1:30 PM',
    fullTag: 'Full Study Day Morning Peak (6:00 AM – 1:30 PM) · Heavy Analytical & Category A Flagships'
  },
  gap_pm_eve: {
    rank: 3,
    shortTag: 'Full Day PM · 2:30 PM–12:00 AM',
    fullTag: 'Afternoon & Evening (2:30 PM – 12:00 AM) · Core Application & Pre-Exam Completion'
  },
  exam_am_recall: {
    rank: 4,
    shortTag: 'Exam AM · 7:00–9:30 AM',
    fullTag: 'Exam Day Morning (6:00 AM – 9:30 AM Standard / Flex up to 12:30 PM · 1h Routine) · Quick-Recall'
  }
};

function loadConfiguredExamDatesMap(level?: CALevel): Partial<Record<SubjectId, string>> {
  const activeLevel = level || getActiveCALevel();
  const levelSubjectSet = new Set<SubjectId>(getLevelSubjectIds(activeLevel));
  const result: Partial<Record<SubjectId, string>> = {};
  if (typeof window === 'undefined') return result;

  try {
    const rawDates = localStorage.getItem(
      getLevelScopedKey('practca_subject_final_exam_dates', activeLevel)
    );
    if (rawDates) {
      const parsed = JSON.parse(rawDates);
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach((k) => {
          const sub = normalizeSubjectId(k, activeLevel);
          const val = parsed[k];
          if (sub && levelSubjectSet.has(sub) && typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
            result[sub] = val;
          }
        });
      }
    }
  } catch {}

  try {
    const rawCps = localStorage.getItem(
      getLevelScopedKey('practca_roadmap_user_checkpoints', activeLevel)
    );
    if (rawCps) {
      const parsed = JSON.parse(rawCps);
      if (Array.isArray(parsed)) {
        parsed.forEach((cp: any) => {
          const sub = normalizeSubjectId(cp?.subjectId, activeLevel);
          if (
            !sub ||
            !levelSubjectSet.has(sub) ||
            typeof cp?.targetDate !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(cp.targetDate)
          ) {
            return;
          }
          const isFinalSprint = Boolean(
            cp.revisionCycle === 'Final Sprint' ||
              String(cp.id || '').startsWith('cp_final_sprint_') ||
              /1\.5[-\s]*day|final\s*sprint/i.test(String(cp.customTitle || ''))
          );
          if (isFinalSprint && !result[sub]) {
            result[sub] = cp.targetDate;
          }
        });
      }
    }
  } catch {}

  return result;
}

/**
 * 2.1 Start Time Configuration:
 * - FR (and Paper 1 when first in sequence): 5 days prior to Exam Date (inclusive 5-day window, e.g. Nov 2 -> Oct 29 at 06:00 AM).
 * - AFM, Audit, DT, IDT, IBS (subsequent papers): 7:00 PM on the day of the previous exam
 *   (uses closest preceding exam date if configured, or examDate - 2 days fallback).
 */
export function resolveSprintStartBoundaryForSubject(
  subjectId: SubjectId,
  examDateStr: string,
  allExamDatesMap?: Partial<Record<string, string>>,
  level?: CALevel
): {
  startDateStr: string;
  startMinutesOfDay: number;
  startTimeLabel: string;
  isFirstPaperFiveDayWindow: boolean;
} {
  const activeLevel = level || getSubjectLevel(subjectId);
  const effectiveMap = allExamDatesMap && Object.keys(allExamDatesMap).length > 0
    ? allExamDatesMap
    : loadConfiguredExamDatesMap(activeLevel);

  const isExplicitFirstPaper =
    subjectId === 'FR' || subjectId === 'AdvAcc' || subjectId === 'Accounts';

  if (examDateStr && /^\d{4}-\d{2}-\d{2}$/.test(examDateStr)) {
    const priorDates: string[] = [];
    Object.entries(effectiveMap).forEach(([k, d]) => {
      const normSub = normalizeSubjectId(k, activeLevel);
      if (!normSub || normSub === subjectId) return;
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && d < examDateStr) {
        priorDates.push(d);
      }
    });

    if (priorDates.length > 0 && !isExplicitFirstPaper) {
      priorDates.sort();
      return {
        startDateStr: priorDates[priorDates.length - 1],
        startMinutesOfDay: LMR_SUBSEQUENT_START_MINUTES_OF_DAY, // 19:00 (7:00 PM)
        startTimeLabel: '07:00 PM',
        isFirstPaperFiveDayWindow: false
      };
    }

    if (isExplicitFirstPaper) {
      return {
        startDateStr: addDaysToDateString(examDateStr, -4), // Inclusive 5-day span (Nov 2 -> Oct 29)
        startMinutesOfDay: LMR_FIRST_PAPER_START_MINUTES_OF_DAY, // 06:00 AM
        startTimeLabel: '06:00 AM',
        isFirstPaperFiveDayWindow: true
      };
    }

    // Subsequent paper (AFM, Audit, DT, IDT, IBS) when prior paper date wasn't entered individually:
    // standard ICAI alternate-day gap puts previous exam at examDate - 2 days at 7:00 PM
    return {
      startDateStr: addDaysToDateString(examDateStr, -2),
      startMinutesOfDay: LMR_SUBSEQUENT_START_MINUTES_OF_DAY,
      startTimeLabel: '07:00 PM',
      isFirstPaperFiveDayWindow: false
    };
  }

  return {
    startDateStr: examDateStr || getLocalDateStr(new Date()),
    startMinutesOfDay: LMR_SUBSEQUENT_START_MINUTES_OF_DAY,
    startTimeLabel: '07:00 PM',
    isFirstPaperFiveDayWindow: false
  };
}

export function resolveSprintStartDateForSubject(
  subjectId: SubjectId,
  examDateStr: string,
  allExamDatesMap?: Partial<Record<string, string>>,
  level?: CALevel
): string {
  return resolveSprintStartBoundaryForSubject(subjectId, examDateStr, allExamDatesMap, level).startDateStr;
}

/**
 * 3.1 Available Time Metrics:
 * Calculates exact Total Available Time (Start Time -> 9:30 AM Exam Date) minus:
 * - 6 hours (360m) sleep time per day transition
 * - 1 hour (60m) routine allowance on Start Day and Exam Day
 * - 2 hours (120m) routine allowance on each full study day strictly between Start Day and Exam Day
 * Max Available Time = Total Available Time + 3 Flexible Hours (+180m up to 12:30 PM on Exam Day).
 */
export function calculateLmrSprintBudgetForSubject(
  subjectId?: SubjectId,
  examDateStr?: string,
  allExamDatesMap?: Partial<Record<string, string>>,
  level?: CALevel
): LmrSprintBudgetSummary {
  const activeLevel = level || (subjectId ? getSubjectLevel(subjectId) : getActiveCALevel());
  const effectiveSub: SubjectId = subjectId || getLevelSubjectIds(activeLevel)[1] || 'AFM';
  const effectiveMap =
    allExamDatesMap && Object.keys(allExamDatesMap).length > 0
      ? allExamDatesMap
      : loadConfiguredExamDatesMap(activeLevel);
  const resolvedExamDate =
    examDateStr && /^\d{4}-\d{2}-\d{2}$/.test(examDateStr)
      ? examDateStr
      : effectiveMap[effectiveSub] || addDaysToDateString(getLocalDateStr(new Date()), 2);

  const boundary = resolveSprintStartBoundaryForSubject(
    effectiveSub,
    resolvedExamDate,
    effectiveMap,
    activeLevel
  );

  const [sy, sm, sd] = boundary.startDateStr.split('-').map(Number);
  const [ey, em, ed] = resolvedExamDate.split('-').map(Number);

  const startMidnightMs = new Date(sy, (sm || 1) - 1, sd || 1, 0, 0, 0, 0).getTime();
  const examMidnightMs = new Date(ey, (em || 1) - 1, ed || 1, 0, 0, 0, 0).getTime();

  const dayTransitions = Math.max(1, Math.round((examMidnightMs - startMidnightMs) / (1000 * 60 * 60 * 24)));
  const fullStudyDays = Math.max(0, dayTransitions - 1);

  const startDateTimeMs = startMidnightMs + boundary.startMinutesOfDay * 60000;
  const standardEndDateTimeMs = examMidnightMs + LMR_STANDARD_END_MINUTES_OF_DAY * 60000; // 9:30 AM Exam Day

  const grossWindowMinutes = Math.max(
    60,
    Math.round((standardEndDateTimeMs - startDateTimeMs) / 60000)
  );
  const minSleepMinutes = LMR_SLEEP_PER_NIGHT_MINUTES * dayTransitions; // 6h per day transition
  const minRoutineMinutes =
    LMR_PARTIAL_DAY_ROUTINE_MINUTES * 2 + LMR_FULL_DAY_ROUTINE_MINUTES * fullStudyDays; // 1h Start + 1h Exam + 2h/full day
  const netAvailableMinutes = Math.max(60, grossWindowMinutes - minSleepMinutes - minRoutineMinutes);
  const flexExtensionMinutes = LMR_FLEX_EXTENSION_MINUTES; // +3 flexible hours (180m -> 12:30 PM)
  const maxAvailableMinutes = netAvailableMinutes + flexExtensionMinutes;

  return {
    grossWindowMinutes,
    minSleepMinutes,
    minRoutineMinutes,
    netAvailableMinutes,
    flexExtensionMinutes,
    maxAvailableMinutes,
    sprintStartDateStr: boundary.startDateStr,
    sprintStartTimeLabel: boundary.startTimeLabel,
    standardEndTimeLabel: '09:30 AM',
    maxFlexEndTimeLabel: '12:30 PM',
    dayTransitions,
    fullStudyDays
  };
}

export function calculateLmrSprintBudgetFromHistory(
  subjectId?: SubjectId,
  examDateStr?: string,
  level?: CALevel
): LmrSprintBudgetSummary {
  return calculateLmrSprintBudgetForSubject(subjectId, examDateStr, undefined, level);
}

/**
 * Computes exact remaining net study minutes from `now` across awake study blocks:
 * - Standard Window: Start Time -> 9:30 AM Exam Date (`remainingStudyMinutes`)
 * - Flex Window: 9:30 AM -> 12:30 PM Exam Date (`remainingFlexMinutes`)
 * - Max Window: Start Time -> 12:30 PM Exam Date (`remainingMaxStudyMinutes`)
 */
export function calculateRemainingSprintStudyMinutesFromNow(
  examDateStr?: string,
  subjectId?: SubjectId,
  allExamDatesMap?: Partial<Record<string, string>>,
  level?: CALevel
): {
  isWithinLiveWindow: boolean;
  remainingStudyMinutes: number;
  remainingFlexMinutes: number;
  remainingMaxStudyMinutes: number;
  nowSprintRelMinutes: number | null;
} {
  const budget = calculateLmrSprintBudgetForSubject(subjectId, examDateStr, allExamDatesMap, level);
  const activeLevel = level || (subjectId ? getSubjectLevel(subjectId) : getActiveCALevel());
  const effectiveSub: SubjectId = subjectId || getLevelSubjectIds(activeLevel)[1] || 'AFM';
  const effectiveMap =
    allExamDatesMap && Object.keys(allExamDatesMap).length > 0
      ? allExamDatesMap
      : loadConfiguredExamDatesMap(activeLevel);
  const resolvedExamDate =
    examDateStr && /^\d{4}-\d{2}-\d{2}$/.test(examDateStr)
      ? examDateStr
      : effectiveMap[effectiveSub] || addDaysToDateString(getLocalDateStr(new Date()), 2);

  if (resolvedExamDate && /^\d{4}-\d{2}-\d{2}$/.test(resolvedExamDate)) {
    const boundary = resolveSprintStartBoundaryForSubject(
      effectiveSub,
      resolvedExamDate,
      effectiveMap,
      activeLevel
    );
    const [sy, sm, sd] = boundary.startDateStr.split('-').map(Number);
    const startMidnightMs = new Date(sy, (sm || 1) - 1, sd || 1, 0, 0, 0, 0).getTime();
    const nowRelMins = Math.round((Date.now() - startMidnightMs) / 60000);

    const startRelMin = boundary.startMinutesOfDay; // 1140 (7:00 PM) or 360 (6:00 AM)
    const examStdEndRelMin = budget.dayTransitions * 1440 + LMR_STANDARD_END_MINUTES_OF_DAY; // 9:30 AM Exam Day
    const examMaxEndRelMin = budget.dayTransitions * 1440 + LMR_MAX_FLEX_END_MINUTES_OF_DAY; // 12:30 PM Exam Day

    // Build non-overlapping study intervals matching Section 3.1 exact deductions:
    // - Start Day: first 60m reserved for routine, rest until midnight is study
    // - Full Study Days (1..dayTransitions-1): 00:00–06:00 Sleep (360m), 06:00–07:00 Routine (60m),
    //   07:00–13:30 AM Study (390m), 13:30–14:30 Midday Routine (60m), 14:30–24:00 PM/Eve Study (570m) -> 960m/day
    // - Exam Day: 00:00–06:00 Sleep (360m), 06:00–07:00 Routine (60m), 07:00–09:30 Study (150m), Flex 09:30–12:30 (+180m)
    const standardStudyBlocks: Array<[number, number]> = [];
    const startStudyBegin = Math.min(1440, startRelMin + LMR_PARTIAL_DAY_ROUTINE_MINUTES);
    if (startStudyBegin < 1440) {
      standardStudyBlocks.push([startStudyBegin, 1440]);
    }
    for (let dayIdx = 1; dayIdx < budget.dayTransitions; dayIdx++) {
      const dayBase = dayIdx * 1440;
      standardStudyBlocks.push([dayBase + 420, dayBase + 810]); // 07:00 AM – 01:30 PM (390m)
      standardStudyBlocks.push([dayBase + 870, dayBase + 1440]); // 02:30 PM – 12:00 AM (570m)
    }
    const examDayBase = budget.dayTransitions * 1440;
    standardStudyBlocks.push([examDayBase + 420, examStdEndRelMin]); // 07:00 AM – 09:30 AM (150m)
    const flexBlock: [number, number] = [examStdEndRelMin, examMaxEndRelMin]; // 09:30 AM – 12:30 PM (180m)

    if (nowRelMins >= startRelMin && nowRelMins < examMaxEndRelMin) {
      let remStd = 0;
      for (const [bStart, bEnd] of standardStudyBlocks) {
        if (bEnd > nowRelMins) {
          remStd += Math.max(0, bEnd - Math.max(bStart, nowRelMins));
        }
      }
      const remFlex =
        flexBlock[1] > nowRelMins
          ? Math.max(0, flexBlock[1] - Math.max(flexBlock[0], nowRelMins))
          : 0;

      return {
        isWithinLiveWindow: true,
        remainingStudyMinutes: Math.max(0, Math.round(remStd)),
        remainingFlexMinutes: Math.max(0, Math.round(remFlex)),
        remainingMaxStudyMinutes: Math.max(0, Math.round(remStd + remFlex)),
        nowSprintRelMinutes: nowRelMins
      };
    }
  }

  return {
    isWithinLiveWindow: false,
    remainingStudyMinutes: budget.netAvailableMinutes,
    remainingFlexMinutes: budget.flexExtensionMinutes,
    remainingMaxStudyMinutes: budget.maxAvailableMinutes,
    nowSprintRelMinutes: null
  };
}

/**
 * Classifies a chapter into the best-suited cognitive time window across the sprint:
 * 1. `day1_eve`: Start Window momentum builder
 * 2. `gap_am_peak`: Morning Peak (heavyweight Category A analytical/numerical core)
 * 3. `gap_pm_eve`: Core application & Category A/B completion before Exam Day
 * 4. `exam_am_recall`: Compact Category C / quick-recall topics for Exam Morning (up to 9:30 AM)
 */
export function classifyChapterCognitivePhase(
  subjectId: SubjectId,
  chapterName: string,
  abcCategory: ABCCategory,
  baseStudyMinutes: number
): LmrCognitivePhaseId {
  const ch = chapterName.toLowerCase();

  const isDay1EveningMomentum =
    (subjectId === 'Accounts' &&
      (ch.includes('bank reconciliation') ||
        ch.includes('inventories') ||
        ch.includes('depreciation') ||
        ch.includes('bills of exchange'))) ||
    (subjectId === 'Law' &&
      (ch.includes('partnership') ||
        ch.includes('llp') ||
        ch.includes('negotiable'))) ||
    (subjectId === 'MathStats' &&
      (ch.includes('time value') ||
        ch.includes('logical') ||
        ch.includes('central tendency'))) ||
    (subjectId === 'Econ' &&
      (ch.includes('demand') ||
        ch.includes('price determination') ||
        ch.includes('money market'))) ||
    (subjectId === 'AdvAcc' &&
      (ch.includes('buyback') ||
        ch.includes('internal reconstruction') ||
        ch.includes('investment') ||
        ch.includes('branch'))) ||
    (subjectId === 'CorpLaw' &&
      (ch.includes('dividend') ||
        ch.includes('deposits') ||
        ch.includes('charges') ||
        ch.includes('llp'))) ||
    (subjectId === 'Tax' &&
      (ch.includes('residential') ||
        ch.includes('house property') ||
        ch.includes('supply under gst') ||
        ch.includes('time & value'))) ||
    (subjectId === 'Cost' &&
      (ch.includes('material') ||
        ch.includes('employee') ||
        ch.includes('cost sheet') ||
        ch.includes('marginal'))) ||
    (subjectId === 'AuditInter' &&
      (ch.includes('nature, objective') ||
        ch.includes('audit strategy') ||
        ch.includes('audit documentation') ||
        ch.includes('ethics'))) ||
    (subjectId === 'FMSM' &&
      (ch.includes('financing decisions') ||
        ch.includes('ratio') ||
        ch.includes('dividend') ||
        ch.includes('strategic analysis'))) ||
    (subjectId === 'FR' &&
      (ch.includes('ind as 16') ||
        ch.includes('ind as 38') ||
        ch.includes('ind as 40') ||
        ch.includes('ind as 23') ||
        ch.includes('ind as 2 ') ||
        ch.endsWith('ind as 2') ||
        ch.includes('ind as 105') ||
        ch.includes('analysis of fs'))) ||
    (subjectId === 'AFM' &&
      (ch.includes('mutual funds') ||
        ch.includes('startup finance') ||
        ch.includes('securitization') ||
        (ch.includes('risk management') && !ch.includes('foreign') && !ch.includes('interest')) ||
        ch.includes('financial policy'))) ||
    (subjectId === 'Audit' &&
      (ch.includes('quality control') ||
        ch.includes('audit planning') ||
        ch.includes('materiality') ||
        ch.includes('internal audit'))) ||
    (subjectId === 'DT' &&
      (ch.includes('basic concepts') ||
        ch.includes('capital gains') ||
        ch.includes('other sources') ||
        ch.includes('other persons') ||
        ch.includes('set off'))) ||
    (subjectId === 'IDT' &&
      (ch.includes('supply under gst') ||
        ch.includes('charge of gst') ||
        ch.includes('time of supply') ||
        ch.includes('value of supply') ||
        ch.includes('registration'))) ||
    (subjectId === 'IBS' && (ch.includes('financial reporting') || ch.includes('auditing')));

  if (isDay1EveningMomentum) {
    return 'day1_eve';
  }

  if (abcCategory === 'A') {
    return baseStudyMinutes >= 210 ? 'gap_am_peak' : 'gap_pm_eve';
  }

  const isSmallQuickRecallCandidate =
    abcCategory === 'C' ||
    (abcCategory === 'B' &&
      baseStudyMinutes <= 160 &&
      (ch.includes('penalties') ||
        ch.includes('offences') ||
        ch.includes('miscellaneous') ||
        ch.includes('model tax') ||
        ch.includes('base erosion') ||
        ch.includes('applicability of ind as') ||
        ch.includes('conceptual framework') ||
        ch.includes('accounting & tech') ||
        ch.includes('events after') ||
        ch.includes('acc policies') ||
        ch.includes('interim financial') ||
        ch.includes('agriculture') ||
        ch.includes('govt grants') ||
        ch.includes('digital auditing') ||
        ch.includes('sustainable development') ||
        ch.includes('warehousing') ||
        ch.includes('advance ruling') ||
        ch.includes('accounts and records') ||
        ch.includes('job work') ||
        ch.includes('electronic commerce') ||
        ch.includes('scmpe') ||
        ch.includes('corporate & economic laws')));

  if (isSmallQuickRecallCandidate) {
    return 'exam_am_recall';
  }

  return 'gap_pm_eve';
}

/**
 * Computes the strict arithmetic average completion time (in minutes) across Revision cycles (`rev1`..`revN`),
 * reading from `practca_revision_planner_logs` and `practca_revision_planner_${subjectId}` hours while strictly
 * excluding `baseline` (General 1st Study) and `rev1.5`. Falls back to calibrated ICAI revision pace
 * (`baseStudyMinutes * 0.35`) when no Revision cycle logs exist yet.
 */
function resolveRevisionAverageMinutesForChapter(
  chapRevEntry: Record<string, any>,
  cycleLogMinutesMap: Record<string, number>,
  icaiBaseStudyMinutes: number
): number {
  const revCycleKeys = ['rev1', 'rev2', 'rev3', 'rev4', 'rev5'];
  const revisionSampleMinutes: number[] = [];

  const allCycleKeys = new Set<string>([
    ...revCycleKeys,
    ...Object.keys(chapRevEntry || {}),
    ...Object.keys(cycleLogMinutesMap || {})
  ]);
  allCycleKeys.forEach((cKey) => {
    if (!/^rev\d+$/i.test(cKey)) return; // Strictly Revision cycles (rev1..revN); never baseline or rev1.5
    const fromLog = Math.max(0, Number(cycleLogMinutesMap?.[cKey]) || 0);
    const revCell = chapRevEntry?.[cKey];
    const revCellHrs =
      revCell && revCell.hours !== '' && !isNaN(Number(revCell.hours))
        ? Math.max(0, Math.round(Number(revCell.hours) * 60))
        : 0;
    const effMins = Math.max(fromLog, revCellHrs);
    if (effMins > 0) {
      revisionSampleMinutes.push(effMins);
    }
  });

  if (revisionSampleMinutes.length > 0) {
    const avg =
      revisionSampleMinutes.reduce((sum, val) => sum + val, 0) / revisionSampleMinutes.length;
    return Math.max(15, Math.round(avg));
  }

  return Math.max(20, Math.round((icaiBaseStudyMinutes * 0.35) / 5) * 5);
}

/**
 * Retrieves historical average completion time (in minutes) for a chapter from Revision Report logs
 * (`practca_revision_planner_logs` across revision cycles + `practca_revision_planner_${subjectId}` hours).
 * For Category C, strictly uses `revisionAverageMinutes` (never the `baseline` stage).
 * For Categories A/B without revision logs yet, falls back to scaled Baseline (General) log (~45%) or `baseStudyMinutes * 0.35`.
 */
function resolveHistoricalBaselineMinutesForChapter(
  abcCategory: ABCCategory,
  chapRevEntry: Record<string, any>,
  cycleLogMinutesMap: Record<string, number>,
  icaiBaseStudyMinutes: number,
  precomputedRevisionAvgMinutes?: number
): number {
  const revAvg =
    precomputedRevisionAvgMinutes ??
    resolveRevisionAverageMinutesForChapter(chapRevEntry, cycleLogMinutesMap, icaiBaseStudyMinutes);

  const hasAnyLoggedRevisionCycle = Array.from(
    new Set<string>([
      'rev1',
      'rev2',
      'rev3',
      'rev4',
      'rev5',
      ...Object.keys(chapRevEntry || {}),
      ...Object.keys(cycleLogMinutesMap || {})
    ])
  ).some((cKey) => {
    if (!/^rev\d+$/i.test(cKey)) return false;
    const fromLog = Math.max(0, Number(cycleLogMinutesMap?.[cKey]) || 0);
    const revCell = chapRevEntry?.[cKey];
    const revCellHrs =
      revCell && revCell.hours !== '' && !isNaN(Number(revCell.hours))
        ? Math.max(0, Math.round(Number(revCell.hours) * 60))
        : 0;
    return Math.max(fromLog, revCellHrs) > 0;
  });

  if (hasAnyLoggedRevisionCycle || abcCategory === 'C') {
    return revAvg;
  }

  // Fallback for Categories A/B only: scaled Baseline (General) log (~45%) if no revisions exist yet
  const baseFromLog = Math.max(0, Number(cycleLogMinutesMap?.baseline) || 0);
  const baseCell = chapRevEntry?.baseline;
  const baseCellHrs =
    baseCell && baseCell.hours !== '' && !isNaN(Number(baseCell.hours))
      ? Math.max(0, Math.round(Number(baseCell.hours) * 60))
      : 0;
  const effBaselineMins = Math.max(baseFromLog, baseCellHrs);
  if (effBaselineMins > 0) {
    return Math.max(20, Math.round(effBaselineMins * 0.45));
  }

  return revAvg;
}

/**
 * Comparator ordering targets strictly using ABC Category Analysis (`A` -> `B` -> `C`),
 * ordered within each category by ICAI priority/marks and historical baseline descending.
 */
function compareChaptersByHighYieldPriority(
  a: Pick<LmrSmartChapterPlanItem, 'abcCategory' | 'compositeScore' | 'weightageMarks' | 'historicalBaselineMinutes' | 'baseStudyMinutes' | 'syllabusIndex'>,
  b: Pick<LmrSmartChapterPlanItem, 'abcCategory' | 'compositeScore' | 'weightageMarks' | 'historicalBaselineMinutes' | 'baseStudyMinutes' | 'syllabusIndex'>
): number {
  const catRank: Record<ABCCategory, number> = { A: 1, B: 2, C: 3 };
  if (catRank[a.abcCategory] !== catRank[b.abcCategory]) {
    return catRank[a.abcCategory] - catRank[b.abcCategory];
  }
  if (b.compositeScore !== a.compositeScore) {
    return b.compositeScore - a.compositeScore;
  }
  if (b.weightageMarks !== a.weightageMarks) {
    return b.weightageMarks - a.weightageMarks;
  }
  if (b.historicalBaselineMinutes !== a.historicalBaselineMinutes) {
    return b.historicalBaselineMinutes - a.historicalBaselineMinutes;
  }
  if (b.baseStudyMinutes !== a.baseStudyMinutes) {
    return b.baseStudyMinutes - a.baseStudyMinutes;
  }
  return a.syllabusIndex - b.syllabusIndex;
}

/**
 * Distributes `totalMinutes` across items strictly in proportion to `weights[i]`
 * (sum of normalized weights = 1.0), optionally rounding to 5-minute slabs with largest-remainder delta correction.
 */
function distributeMinutesByWeights(
  weights: number[],
  totalMinutes: number,
  minPerItem: number[],
  stepMinutes: 1 | 5 = 5
): number[] {
  const n = weights.length;
  if (n === 0) return [];

  const targetTotal = Math.max(0, Math.round(totalMinutes));
  const minSum = minPerItem.reduce((acc, m) => acc + m, 0);
  if (targetTotal <= minSum) {
    // Strictly allocate proportionally above 0 respecting floors as far as targetTotal allows
    const out = [...minPerItem];
    let excess = minSum - targetTotal;
    if (excess > 0) {
      // Compress proportionally if floor sum slightly exceeds budget
      const ratio = minSum > 0 ? targetTotal / minSum : 0;
      const scaled = out.map((m) => Math.max(0, Math.floor(m * ratio)));
      let rem = targetTotal - scaled.reduce((a, b) => a + b, 0);
      let idx = 0;
      while (rem > 0 && idx < n * 4) {
        scaled[idx % n] += 1;
        rem--;
        idx++;
      }
      return scaled;
    }
    return out;
  }

  const totalWeight = weights.reduce((acc, w) => acc + Math.max(0, w), 0);
  const normWeights = weights.map((w) => (totalWeight > 0 ? Math.max(0, w) / totalWeight : 1 / n));

  // Initial proportional targets clamped to per-item minimums
  const ideal = normWeights.map((w, i) => Math.max(minPerItem[i], w * targetTotal));

  if (stepMinutes === 5) {
    // Snap to 5m slabs while ensuring exact sum matches targetTotal (rounded to 5m if needed)
    const snappedTarget = Math.round(targetTotal / 5) * 5;
    const minSlabs = minPerItem.map((m) => Math.ceil(m / 5) * 5);
    const minSlabSum = minSlabs.reduce((a, b) => a + b, 0);
    if (snappedTarget >= minSlabSum) {
      const assigned = ideal.map((val, i) =>
        Math.max(minSlabs[i], Math.floor(val / 5) * 5)
      );
      let currentSum = assigned.reduce((a, b) => a + b, 0);
      const remainders = ideal.map((val, i) => ({
        i,
        rem: val - assigned[i],
        w: normWeights[i]
      }));

      if (currentSum < snappedTarget) {
        remainders.sort((a, b) => b.rem - a.rem || b.w - a.w);
        let guard = 0;
        while (currentSum < snappedTarget && guard < 1000) {
          for (const r of remainders) {
            if (currentSum >= snappedTarget) break;
            assigned[r.i] += 5;
            currentSum += 5;
          }
          guard++;
        }
      } else if (currentSum > snappedTarget) {
        remainders.sort((a, b) => a.rem - b.rem || a.w - b.w);
        let guard = 0;
        while (currentSum > snappedTarget && guard < 1000) {
          let trimmed = false;
          for (const r of remainders) {
            if (currentSum <= snappedTarget) break;
            if (assigned[r.i] - 5 >= minSlabs[r.i]) {
              assigned[r.i] -= 5;
              currentSum -= 5;
              trimmed = true;
            }
          }
          if (!trimmed) break;
          guard++;
        }
      }
      return assigned;
    }
  }

  // Exact 1-minute largest-remainder allocation respecting minimums
  const assigned = ideal.map((val, i) => Math.max(minPerItem[i], Math.floor(val)));
  let currentSum = assigned.reduce((a, b) => a + b, 0);
  const remainders = ideal.map((val, i) => ({ i, rem: val - assigned[i], w: normWeights[i] }));

  if (currentSum < targetTotal) {
    remainders.sort((a, b) => b.rem - a.rem || b.w - a.w);
    let guard = 0;
    while (currentSum < targetTotal && guard < 2000) {
      for (const r of remainders) {
        if (currentSum >= targetTotal) break;
        assigned[r.i] += 1;
        currentSum += 1;
      }
      guard++;
    }
  } else if (currentSum > targetTotal) {
    remainders.sort((a, b) => a.rem - b.rem || a.w - b.w);
    let guard = 0;
    while (currentSum > targetTotal && guard < 2000) {
      let trimmed = false;
      for (const r of remainders) {
        if (currentSum <= targetTotal) break;
        if (assigned[r.i] > minPerItem[r.i]) {
          assigned[r.i] -= 1;
          currentSum -= 1;
          trimmed = true;
        }
      }
      if (!trimmed) break;
      guard++;
    }
  }
  return assigned;
}

/**
 * Computes baseline normalized weights (sum === 1.0) and original proportional time assignment
 * (normalizedWeight * Total Available Time) across all non-skipped active items.
 */
function assignNormalizedWeightsAndBaselineTimes(
  activeItems: LmrSmartChapterPlanItem[],
  totalAvailableMinutes: number
): void {
  if (activeItems.length === 0) return;

  const rawWeights = activeItems.map((item) => {
    const catFactor = item.abcCategory === 'A' ? 1.35 : item.abcCategory === 'B' ? 1.0 : 0.7;
    const histMins = Math.max(15, item.historicalBaselineMinutes);
    return histMins * catFactor * item.needMultiplier;
  });

  const weightSum = rawWeights.reduce((acc, w) => acc + w, 0);
  activeItems.forEach((item, idx) => {
    item.normalizedWeight = weightSum > 0 ? rawWeights[idx] / weightSum : 1 / activeItems.length;
  });

  const minFloors = activeItems.map((item) =>
    item.abcCategory === 'A' ? 20 : item.abcCategory === 'B' ? 15 : 10
  );
  const assigned = distributeMinutesByWeights(
    activeItems.map((i) => i.normalizedWeight),
    totalAvailableMinutes,
    minFloors,
    5
  );

  activeItems.forEach((item, idx) => {
    item.baselinePlannedMinutes = assigned[idx];
    item.plannedMinutes = assigned[idx];
    item.priorityLevelApplied = 'standard';
  });
}

/**
 * 4. Dynamic Re-Balancing & Flexible Time Rules + 5. System Constraints & User Overrides:
 * When real-time completion delays reduce remaining available time relative to planned targets:
 * - Priority Level 1 (Extension): Extend target completion time dynamically up to 12:30 PM (`remainingMaxAvailable`)
 *   while preserving 100% of original chapter weights & times.
 * - Priority Level 2 (Uniform Reduction): If Max Available Time (12:30 PM limit) is breached, apply equal
 *   proportionate time reduction across remaining chapters based on historical averages / normalized weights.
 * - Priority Level 3 (Category Minimum Floor Limits):
 *   - Category A Floor: >= 60% (absolute lower limit: 40%) of original allocated time.
 *   - Category B Floor: >= 30% (absolute lower limit: 20%) of original allocated time.
 *   - Category C Floor: Allocate remaining balance, min threshold 25% (absolute lower limit: 10%–15%) of average of revisions.
 * - Coverage Optimization Constraint: Minimize total skipped chapters; maximize coverage prior to dropping targets.
 * - Manual User Overrides: Skipped chapters remain 0m and excluded from redistribution.
 */
function applyDynamicRebalancingWithSequentialPriorities(
  incompleteItems: LmrSmartChapterPlanItem[],
  remainingStandardAvailableMinutes: number,
  remainingMaxAvailableMinutes: number,
  actualMinutesMap: Record<string, number>,
  totalOriginalAvailableMinutes: number
): void {
  const manualSkipped = incompleteItems.filter((i) => i.manualSkip);
  manualSkipped.forEach((i) => {
    i.isSkipped = true;
    i.plannedMinutes = 0;
    i.normalizedWeight = 0;
  });

  const activeItems = incompleteItems.filter((i) => !i.manualSkip);
  if (activeItems.length === 0) return;

  // Re-normalize weights across remaining unskipped active chapters (Sum = 1.0)
  const rawW = activeItems.map((i) => {
    const catFactor = i.abcCategory === 'A' ? 1.35 : i.abcCategory === 'B' ? 1.0 : 0.7;
    return Math.max(15, i.historicalBaselineMinutes) * catFactor * i.needMultiplier;
  });
  const sumW = rawW.reduce((a, b) => a + b, 0);
  activeItems.forEach((item, idx) => {
    item.normalizedWeight = sumW > 0 ? rawW[idx] / sumW : 1 / activeItems.length;
  });

  const getSpent = (item: LmrSmartChapterPlanItem): number =>
    Math.max(0, Math.round(actualMinutesMap[item.canonicalKey] ?? actualMinutesMap[item.chapterName] ?? 0));

  const remNeededPerItem = activeItems.map((item) => {
    const spent = getSpent(item);
    const orig = Math.max(LMR_MIN_CHAPTER_FLOOR_MINUTES, item.baselinePlannedMinutes || 30);
    return Math.max(spent > 0 ? 5 : LMR_MIN_CHAPTER_FLOOR_MINUTES, orig - spent);
  });

  const totalRemNeeded = remNeededPerItem.reduce((a, b) => a + b, 0);
  const stdBudget = Math.max(0, Math.round(remainingStandardAvailableMinutes));
  const maxBudget = Math.max(stdBudget, Math.round(remainingMaxAvailableMinutes));

  // Case 0: Fits within Standard 9:30 AM End Time (includes surplus freed from Manual User Skips)
  if (totalRemNeeded <= stdBudget) {
    const hasManualSkips = manualSkipped.length > 0;
    if (hasManualSkips && stdBudget > totalRemNeeded) {
      // Exclude manually skipped chapters and redistribute freed time across remaining active items proportionately
      const targetPool = Math.min(totalOriginalAvailableMinutes, stdBudget);
      const distributed = distributeMinutesByWeights(
        activeItems.map((i) => i.normalizedWeight),
        targetPool,
        remNeededPerItem,
        5
      );
      activeItems.forEach((item, idx) => {
        item.isSkipped = false;
        item.plannedMinutes = getSpent(item) + distributed[idx];
        item.priorityLevelApplied = 'standard';
      });
    } else {
      activeItems.forEach((item, idx) => {
        item.isSkipped = false;
        item.plannedMinutes = getSpent(item) + remNeededPerItem[idx];
        item.priorityLevelApplied = 'standard';
      });
    }
    return;
  }

  // Priority Level 1 (Extension):
  // Dynamically extend target end time up to 12:30 PM (Max Available Time) while preserving 100% of original chapter weights & times
  if (totalRemNeeded <= maxBudget) {
    activeItems.forEach((item, idx) => {
      item.isSkipped = false;
      item.plannedMinutes = getSpent(item) + remNeededPerItem[idx];
      item.priorityLevelApplied = 'level1_extension';
    });
    return;
  }

  // Max Available Time (12:30 PM) is breached -> Tier Floor Helpers
  const computeStandardRemFloor = (item: LmrSmartChapterPlanItem): number => {
    const spent = getSpent(item);
    const orig = Math.max(10, item.baselinePlannedMinutes);
    const revAvg = Math.max(10, item.revisionAverageMinutes);
    const pctTotalFloor =
      item.abcCategory === 'A'
        ? Math.ceil(orig * 0.6) // Cat A >= 60% of original allocated time
        : item.abcCategory === 'B'
        ? Math.ceil(orig * 0.3) // Cat B >= 30% of original allocated time
        : Math.ceil(revAvg * 0.25); // Cat C >= 25% of average of revisions
    return Math.max(LMR_MIN_CHAPTER_FLOOR_MINUTES, pctTotalFloor - spent);
  };

  const computeAbsoluteRemFloor = (item: LmrSmartChapterPlanItem): number => {
    const spent = getSpent(item);
    const orig = Math.max(10, item.baselinePlannedMinutes);
    const revAvg = Math.max(10, item.revisionAverageMinutes);
    const pctTotalFloor =
      item.abcCategory === 'A'
        ? Math.max(LMR_MIN_CHAPTER_FLOOR_MINUTES, Math.ceil(orig * 0.4)) // Cat A abs >= 40%
        : item.abcCategory === 'B'
        ? Math.max(LMR_MIN_CHAPTER_FLOOR_MINUTES, Math.ceil(orig * 0.2)) // Cat B abs >= 20%
        : Math.max(
            LMR_MIN_CHAPTER_FLOOR_MINUTES,
            Math.min(Math.ceil(revAvg * 0.15), Math.max(Math.ceil(revAvg * 0.1), Math.round(revAvg * 0.12)))
          ); // Cat C abs 10%–15% of average of revisions (12% midpoint clamped within 10%-15%)
    return Math.max(LMR_MIN_CHAPTER_FLOOR_MINUTES, pctTotalFloor - spent);
  };

  const stdRemFloors = activeItems.map(computeStandardRemFloor);

  // Priority Level 2 (Uniform Reduction):
  // Apply equal proportionate reduction across remaining chapters based on historical averages/weights
  const scaleFactor = maxBudget / Math.max(1, totalRemNeeded);
  const uniformScaled = distributeMinutesByWeights(
    activeItems.map((i, idx) => Math.max(1, remNeededPerItem[idx] * (i.historicalBaselineMinutes / Math.max(15, i.baselinePlannedMinutes)))),
    maxBudget,
    activeItems.map(() => LMR_MIN_CHAPTER_FLOOR_MINUTES),
    1
  );
  // Blend strictly proportionate uniform reduction factor on remNeeded
  const uniformDirect = distributeMinutesByWeights(
    remNeededPerItem,
    maxBudget,
    activeItems.map(() => LMR_MIN_CHAPTER_FLOOR_MINUTES),
    1
  );
  const isUniformCompliantWithStdFloors = uniformDirect.every(
    (mins, idx) => mins >= stdRemFloors[idx]
  );

  if (scaleFactor > 0 && isUniformCompliantWithStdFloors && uniformScaled.length === activeItems.length) {
    activeItems.forEach((item, idx) => {
      item.isSkipped = false;
      item.plannedMinutes = getSpent(item) + uniformDirect[idx];
      item.priorityLevelApplied = 'level2_uniform_reduction';
    });
    return;
  }

  // Priority Level 3 (Category Minimum Floor Limits):
  // Step 3A: Standard Category Floors (Cat A 60% orig, Cat B 30% orig, Cat C 25% of average of revisions)
  const sumStdFloors = stdRemFloors.reduce((a, b) => a + b, 0);
  if (sumStdFloors <= maxBudget) {
    const remainingBalance = maxBudget - sumStdFloors;
    // Allocate remaining balance weighted by Cat C remaining capacity & chapter weights without exceeding original remNeeded
    const capWeights = activeItems.map((item, idx) => {
      const headroom = Math.max(0, remNeededPerItem[idx] - stdRemFloors[idx]);
      if (headroom <= 0) return 0;
      const catBoost = item.abcCategory === 'C' ? 1.15 : item.abcCategory === 'B' ? 1.0 : 1.05;
      return headroom * catBoost * Math.max(0.01, item.normalizedWeight);
    });
    const extraMins =
      remainingBalance > 0
        ? distributeMinutesByWeights(capWeights, remainingBalance, activeItems.map(() => 0), 1)
        : activeItems.map(() => 0);

    activeItems.forEach((item, idx) => {
      item.isSkipped = false;
      item.plannedMinutes = getSpent(item) + stdRemFloors[idx] + (extraMins[idx] || 0);
      item.priorityLevelApplied = 'level3_category_floors';
    });
    return;
  }

  // Step 3B: Absolute Lower Limit Floors (Cat A 40% orig, Cat B 20% orig, Cat C 10%-15% of average of revisions)
  const absRemFloors = activeItems.map(computeAbsoluteRemFloor);
  const sumAbsFloors = absRemFloors.reduce((a, b) => a + b, 0);

  if (sumAbsFloors <= maxBudget) {
    // Lock absolute lower limits, then distribute balance protecting Cat A (up to 60%) -> Cat B (up to 30%) -> Cat C (up to 25%)
    const assignedRem = [...absRemFloors];
    let balance = maxBudget - sumAbsFloors;

    const addUpToTier = (targetFilter: (item: LmrSmartChapterPlanItem) => boolean, targetCeil: number[]) => {
      if (balance <= 0) return;
      const needArr = activeItems.map((item, idx) =>
        targetFilter(item) ? Math.max(0, targetCeil[idx] - assignedRem[idx]) : 0
      );
      const needTotal = needArr.reduce((a, b) => a + b, 0);
      if (needTotal <= 0) return;
      const grant = Math.min(balance, needTotal);
      const extras = distributeMinutesByWeights(needArr, grant, activeItems.map(() => 0), 1);
      for (let i = 0; i < activeItems.length; i++) {
        assignedRem[i] += extras[i] || 0;
      }
      balance -= extras.reduce((a, b) => a + b, 0);
    };

    addUpToTier((i) => i.abcCategory === 'A', stdRemFloors);
    addUpToTier((i) => i.abcCategory === 'B', stdRemFloors);
    addUpToTier((i) => i.abcCategory === 'C', stdRemFloors);

    activeItems.forEach((item, idx) => {
      item.isSkipped = false;
      item.plannedMinutes = getSpent(item) + assignedRem[idx];
      item.priorityLevelApplied = 'level3_absolute_floors';
    });
    return;
  }

  // 5. Coverage Optimization Constraint:
  // Maximize total chapter coverage and drop the minimum possible count of lowest-priority targets
  // (only unstarted lowest-weight Category C tail first, then Category B if needed) until sum(absFloors of kept) <= maxBudget
  const dropPriorityCandidates = activeItems
    .map((item, idx) => ({ item, idx, spent: getSpent(item), absFloor: absRemFloors[idx] }))
    .filter((entry) => entry.spent === 0)
    .sort((a, b) => {
      const catDropRank: Record<ABCCategory, number> = { C: 0, B: 1, A: 2 };
      if (catDropRank[a.item.abcCategory] !== catDropRank[b.item.abcCategory]) {
        return catDropRank[a.item.abcCategory] - catDropRank[b.item.abcCategory];
      }
      return a.item.normalizedWeight - b.item.normalizedWeight || a.item.weightageMarks - b.item.weightageMarks;
    });

  const droppedIndices = new Set<number>();
  let currentFloorSum = sumAbsFloors;

  for (const cand of dropPriorityCandidates) {
    if (currentFloorSum <= maxBudget) break;
    // Never drop Category A chapters unless mathematically unable to fund any other target
    if (cand.item.abcCategory === 'A' && currentFloorSum > maxBudget && droppedIndices.size < dropPriorityCandidates.length - 1) {
      // Allow dropping bottom Cat A only if all Cat C & Cat B unstarted have already been dropped
    }
    droppedIndices.add(cand.idx);
    currentFloorSum -= cand.absFloor;
  }

  const keptEntries = activeItems
    .map((item, idx) => ({ item, idx, floor: absRemFloors[idx] }))
    .filter((e) => !droppedIndices.has(e.idx));

  activeItems.forEach((item, idx) => {
    if (droppedIndices.has(idx)) {
      item.isSkipped = true;
      item.plannedMinutes = 0;
      item.normalizedWeight = 0;
      item.priorityLevelApplied = 'coverage_trimmed';
    }
  });

  if (keptEntries.length > 0) {
    const keptFloorSum = keptEntries.reduce((a, e) => a + e.floor, 0);
    const surplus = Math.max(0, maxBudget - keptFloorSum);
    const keptWeights = keptEntries.map((e) => e.item.normalizedWeight);
    const assignedKept = distributeMinutesByWeights(
      keptWeights,
      keptFloorSum + surplus,
      keptEntries.map((e) => Math.min(e.floor, Math.max(LMR_MIN_CHAPTER_FLOOR_MINUTES, Math.floor((maxBudget * e.floor) / Math.max(1, keptFloorSum))))),
      1
    );
    keptEntries.forEach((entry, kIdx) => {
      entry.item.isSkipped = false;
      entry.item.plannedMinutes = getSpent(entry.item) + (assignedKept[kIdx] || 0);
      entry.item.priorityLevelApplied = droppedIndices.size > 0 ? 'coverage_trimmed' : 'level3_absolute_floors';
    });
  }
}

/**
 * Computes the complete Smart 1.5-Day Sprint Plan for `subjectId` using the practACE - 1.5 Sprint Algorithm:
 * - Start/End boundaries: FR 5 days prior (06:00 AM), subsequent papers 7:00 PM prev exam -> 9:30 AM standard / 12:30 PM max flex (+3h)
 * - Exact Total Available Time minus 6h sleep/transition and 1h/2h/1h routine
 * - Sorts chapters by ABC Category Analysis (`A` -> `B` -> `C`)
 * - Retrieves historical average completion time from Revision Report logs
 * - Computes normalized weights (Sum = 1.0) and assigns `normalizedWeight * Total Available Time`
 */
export function computeSmartLmrSprintPlanForSubject(
  subjectId: SubjectId,
  overrideSkippedMap?: Record<string, boolean>,
  level?: CALevel,
  examDateStrOverride?: string,
  allExamDatesMapOverride?: Partial<Record<string, string>>
): {
  budget: LmrSprintBudgetSummary;
  orderedPlan: LmrSmartChapterPlanItem[];
  byChapterMap: Record<string, LmrSmartChapterPlanItem>;
} {
  const activeLevel = level || getSubjectLevel(subjectId);
  const budget = calculateLmrSprintBudgetForSubject(
    subjectId,
    examDateStrOverride,
    allExamDatesMapOverride,
    activeLevel
  );
  const officialChapters = SUBJECT_CHAPTERS[subjectId] || [];

  let revChaptersObj: Record<string, any> = {};
  const cycleMinutesByChapter: Record<string, Record<string, number>> = {};

  if (typeof window !== 'undefined') {
    try {
      const rawRev = localStorage.getItem(
        getLevelScopedKey(`practca_revision_planner_${subjectId}`, activeLevel)
      );
      if (rawRev) {
        const parsed = JSON.parse(rawRev);
        if (parsed && typeof parsed.chapters === 'object' && parsed.chapters) {
          revChaptersObj = parsed.chapters;
        }
      }
    } catch {}

    try {
      const rawRevLogs = localStorage.getItem(
        getLevelScopedKey('practca_revision_planner_logs', activeLevel)
      );
      if (rawRevLogs) {
        const parsedLogs = JSON.parse(rawRevLogs);
        if (Array.isArray(parsedLogs)) {
          parsedLogs.forEach((l: any) => {
            if (!l || String(l.subjectId || '').toUpperCase() !== subjectId.toUpperCase()) return;
            const cKey = getCanonicalChapterKey(subjectId, l.chapterName || '') || l.chapterName;
            const rKey = String(l.revKey || l.revisionNumber || 'rev1');
            if (cKey) {
              if (!cycleMinutesByChapter[cKey]) cycleMinutesByChapter[cKey] = {};
              cycleMinutesByChapter[cKey][rKey] =
                (cycleMinutesByChapter[cKey][rKey] || 0) + (Number(l.durationMinutes) || 0);
            }
          });
        }
      }
    } catch {}
  }

  const rawItems: LmrSmartChapterPlanItem[] = officialChapters.map((chapterName, idx) => {
    const canonicalKey = getCanonicalChapterKey(subjectId, chapterName) || chapterName;
    const icaiMeta = classifyChapterICAI(subjectId, chapterName);
    const chapRevEntry = revChaptersObj[canonicalKey] || revChaptersObj[chapterName] || {};
    const rev15Entry = chapRevEntry['rev1.5'] || {};

    const isManualOverrideProvided =
      overrideSkippedMap &&
      (typeof overrideSkippedMap[chapterName] === 'boolean' ||
        typeof overrideSkippedMap[canonicalKey] === 'boolean');

    const manualSkip = isManualOverrideProvided
      ? Boolean(overrideSkippedMap![chapterName] ?? overrideSkippedMap![canonicalKey])
      : Boolean(rev15Entry.manualSkip && rev15Entry.skipped);

    const chapCycleLogMap =
      cycleMinutesByChapter[canonicalKey] || cycleMinutesByChapter[chapterName] || {};
    const revisionAverageMinutes = resolveRevisionAverageMinutesForChapter(
      chapRevEntry,
      chapCycleLogMap,
      icaiMeta.baseStudyMinutes
    );
    const historicalBaselineMinutes = resolveHistoricalBaselineMinutesForChapter(
      icaiMeta.abcCategory,
      chapRevEntry,
      chapCycleLogMap,
      icaiMeta.baseStudyMinutes,
      revisionAverageMinutes
    );

    // Count prior completed revisions (rev1, rev2, rev3) for subtle tie-breaking boost
    let priorRevisionsCompleted = 0;
    (['rev1', 'rev2', 'rev3'] as const).forEach((rKey) => {
      const rData = chapRevEntry[rKey];
      if (rData && (rData.completed || rData.statusTag === 'completed' || Number(rData.hours) > 0)) {
        priorRevisionsCompleted++;
      }
    });

    const needMultiplier =
      priorRevisionsCompleted === 0
        ? 1.15
        : priorRevisionsCompleted === 1
        ? 1.05
        : priorRevisionsCompleted === 2
        ? 1.0
        : 0.94;

    const categoryMultiplier =
      icaiMeta.abcCategory === 'A' ? 1.35 : icaiMeta.abcCategory === 'B' ? 1.0 : 0.7;

    const sectionMarksShare = Math.max(0.5, icaiMeta.icaiWeightageMarks);
    const compositeScore =
      (sectionMarksShare * 0.55 + (historicalBaselineMinutes / 20) * 0.45) *
      categoryMultiplier *
      needMultiplier *
      100;

    const cognitivePhaseId = classifyChapterCognitivePhase(
      subjectId,
      chapterName,
      icaiMeta.abcCategory,
      icaiMeta.baseStudyMinutes
    );
    const phaseMeta = COGNITIVE_PHASE_META[cognitivePhaseId];

    return {
      chapterName,
      canonicalKey,
      syllabusIndex: idx + 1,
      sequenceOrder: idx + 1,
      cognitivePhaseId,
      cognitivePhaseRank: phaseMeta.rank,
      windowTagShort: phaseMeta.shortTag,
      windowTagFull: phaseMeta.fullTag,
      icaiSectionCode: icaiMeta.icaiSectionCode,
      icaiSectionName: icaiMeta.icaiSectionName,
      icaiWeightageRange: icaiMeta.icaiWeightageRange,
      abcCategory: icaiMeta.abcCategory,
      weightageMarks: icaiMeta.icaiWeightageMarks,
      baseStudyMinutes: icaiMeta.baseStudyMinutes,
      historicalBaselineMinutes,
      revisionAverageMinutes,
      normalizedWeight: 0,
      baselinePlannedMinutes: manualSkip ? 0 : LMR_MIN_CHAPTER_FLOOR_MINUTES,
      needMultiplier,
      priorRevisionsCompleted,
      compositeScore,
      plannedMinutes: manualSkip ? 0 : LMR_MIN_CHAPTER_FLOOR_MINUTES,
      isSkipped: manualSkip,
      manualSkip,
      priorityLevelApplied: 'standard'
    };
  });

  // Sort strictly using ABC Category Analysis (A -> B -> C) & descending priority
  const sequenced = [...rawItems].sort(compareChaptersByHighYieldPriority);
  sequenced.forEach((item, idx) => {
    item.sequenceOrder = idx + 1;
  });

  // Compute normalized weights (Sum = 1.0) & proportionate baseline assignment across active chapters
  const activeItems = sequenced.filter((item) => !item.manualSkip);
  if (activeItems.length > 0) {
    assignNormalizedWeightsAndBaselineTimes(activeItems, budget.netAvailableMinutes);
  }

  // Keep Exam Day Morning focused on top recall candidates fitting within the pre-9:30 AM exam morning window
  const activeExamAmCandidates = sequenced
    .filter((i) => !i.isSkipped && i.cognitivePhaseId === 'exam_am_recall')
    .sort((a, b) => a.plannedMinutes - b.plannedMinutes || a.compositeScore - b.compositeScore);
  let examAmAcc = 0;
  const keptExamAmNames = new Set<string>();
  for (const cand of activeExamAmCandidates) {
    if (examAmAcc + cand.plannedMinutes <= 150 && keptExamAmNames.size < 3) {
      keptExamAmNames.add(cand.chapterName);
      examAmAcc += cand.plannedMinutes;
    }
  }
  sequenced.forEach((item) => {
    if (item.cognitivePhaseId === 'exam_am_recall' && !item.isSkipped && !keptExamAmNames.has(item.chapterName)) {
      item.cognitivePhaseId = 'gap_pm_eve';
      item.cognitivePhaseRank = COGNITIVE_PHASE_META.gap_pm_eve.rank;
      item.windowTagShort = COGNITIVE_PHASE_META.gap_pm_eve.shortTag;
      item.windowTagFull = COGNITIVE_PHASE_META.gap_pm_eve.fullTag;
    }
  });

  const byChapterMap: Record<string, LmrSmartChapterPlanItem> = {};
  sequenced.forEach((item) => {
    byChapterMap[item.chapterName] = item;
    byChapterMap[item.canonicalKey] = item;
  });

  return {
    budget,
    orderedPlan: sequenced,
    byChapterMap
  };
}

/**
 * Persists and dynamically rebalances the Smart 1.5-Day Sprint Plan into
 * `practca_revision_planner_${subjectId}`, `practca_task_target_durations`, and `practca_local_tasks`.
 */
export function applySmartLmrSprintAllocationToStorage(
  subjectId: SubjectId,
  options?: {
    overrideSkippedMap?: Record<string, boolean>;
    preserveCompletedPlannedMinutes?: boolean;
    rebalanceFromNow?: boolean;
    examDateStr?: string;
    allExamDatesMap?: Partial<Record<string, string>>;
    liveActualMinutesByChapter?: Record<string, number>;
    level?: CALevel;
  }
): {
  budget: LmrSprintBudgetSummary;
  orderedPlan: LmrSmartChapterPlanItem[];
  byChapterMap: Record<string, LmrSmartChapterPlanItem>;
} {
  const activeLevel = options?.level || getSubjectLevel(subjectId);
  const plan = computeSmartLmrSprintPlanForSubject(
    subjectId,
    options?.overrideSkippedMap,
    activeLevel,
    options?.examDateStr,
    options?.allExamDatesMap
  );
  if (typeof window === 'undefined') return plan;

  try {
    const localKey = getLevelScopedKey(`practca_revision_planner_${subjectId}`, activeLevel);
    const rawRev = localStorage.getItem(localKey);
    const parsedRev = rawRev ? JSON.parse(rawRev) : { revisionsCount: 3, chapters: {} };
    const chaptersObj: Record<string, any> =
      parsedRev && typeof parsedRev.chapters === 'object' && parsedRev.chapters
        ? { ...parsedRev.chapters }
        : {};

    const rev15LoggedByChapter: Record<string, number> = {};
    try {
      const rawLogs = localStorage.getItem(
        getLevelScopedKey('practca_revision_planner_logs', activeLevel)
      );
      if (rawLogs) {
        const parsedLogs = JSON.parse(rawLogs);
        if (Array.isArray(parsedLogs)) {
          parsedLogs.forEach((l: any) => {
            if (!l || String(l.subjectId || '').toUpperCase() !== subjectId.toUpperCase()) return;
            if (l.revKey !== 'rev1.5' && l.revisionNumber !== 'rev1.5') return;
            const cKey = getCanonicalChapterKey(subjectId, l.chapterName || '') || l.chapterName;
            if (cKey) {
              rev15LoggedByChapter[cKey] =
                (rev15LoggedByChapter[cKey] || 0) + (Number(l.durationMinutes) || 0);
            }
          });
        }
      }
    } catch {}

    const liveWindowCheck = calculateRemainingSprintStudyMinutesFromNow(
      options?.examDateStr,
      subjectId,
      options?.allExamDatesMap,
      activeLevel
    );

    const hasAnyManualSkip = plan.orderedPlan.some((i) => i.manualSkip);
    const shouldRunDynamicAllocation =
      Boolean(options?.preserveCompletedPlannedMinutes) ||
      Boolean(options?.rebalanceFromNow) ||
      Boolean(options?.overrideSkippedMap) ||
      hasAnyManualSkip ||
      liveWindowCheck.isWithinLiveWindow;

    if (shouldRunDynamicAllocation) {
      let completedConsumedMinutes = 0;
      let inProgressSpentMinutes = 0;
      const incompleteCandidates: LmrSmartChapterPlanItem[] = [];
      const actualMinutesMap: Record<string, number> = {};

      plan.orderedPlan.forEach((item) => {
        const existingRev15 =
          chaptersObj[item.canonicalKey]?.['rev1.5'] ||
          chaptersObj[item.chapterName]?.['rev1.5'] ||
          {};
        const isComp = Boolean(existingRev15.completed || existingRev15.statusTag === 'completed');

        const storedHoursNum = parseFloat(String(existingRev15.hours || '0'));
        const storedMins = !isNaN(storedHoursNum) && storedHoursNum > 0 ? Math.round(storedHoursNum * 60) : 0;
        const loggedMins = Math.round(
          rev15LoggedByChapter[item.canonicalKey] || rev15LoggedByChapter[item.chapterName] || 0
        );
        const liveMins = Math.round(
          options?.liveActualMinutesByChapter?.[item.canonicalKey] ??
            options?.liveActualMinutesByChapter?.[item.chapterName] ??
            0
        );
        const chapActualMins = Math.max(storedMins, loggedMins, liveMins);
        actualMinutesMap[item.canonicalKey] = chapActualMins;
        actualMinutesMap[item.chapterName] = chapActualMins;

        if (existingRev15.baselinePlannedMinutes && Number(existingRev15.baselinePlannedMinutes) > 0) {
          item.baselinePlannedMinutes = Math.round(Number(existingRev15.baselinePlannedMinutes));
        }

        if (isComp) {
          item.isSkipped = false;
          item.manualSkip = false;
          const keptMins =
            Number(existingRev15.plannedMinutes) >= LMR_MIN_CHAPTER_FLOOR_MINUTES
              ? Number(existingRev15.plannedMinutes)
              : item.plannedMinutes;
          item.plannedMinutes = keptMins;
          completedConsumedMinutes += chapActualMins > 0 ? chapActualMins : keptMins;
        } else {
          if (chapActualMins > 0) {
            inProgressSpentMinutes += chapActualMins;
            item.isSkipped = false;
            item.manualSkip = false;
          }
          incompleteCandidates.push(item);
        }
      });

      if (incompleteCandidates.length > 0) {
        const remStdBudget = liveWindowCheck.isWithinLiveWindow
          ? liveWindowCheck.remainingStudyMinutes
          : Math.max(0, plan.budget.netAvailableMinutes - completedConsumedMinutes - inProgressSpentMinutes);

        const remFlexMinutes = liveWindowCheck.isWithinLiveWindow
          ? liveWindowCheck.remainingFlexMinutes
          : plan.budget.flexExtensionMinutes;

        const remMaxBudget = remStdBudget + remFlexMinutes;

        applyDynamicRebalancingWithSequentialPriorities(
          incompleteCandidates,
          remStdBudget,
          remMaxBudget,
          actualMinutesMap,
          plan.budget.netAvailableMinutes
        );
      }
    }

    const durationsKey = getLevelScopedKey('practca_task_target_durations', activeLevel);
    const rawDurations = localStorage.getItem(durationsKey);
    const durationsMap: Record<string, number> = rawDurations ? JSON.parse(rawDurations) : {};

    plan.orderedPlan.forEach((item) => {
      const existingChap = chaptersObj[item.canonicalKey] || chaptersObj[item.chapterName] || {};
      const existingRev15 = existingChap['rev1.5'] || { completed: false, hours: '' };

      const isManualSkipConfirmed = Boolean(
        options?.overrideSkippedMap &&
          (typeof options.overrideSkippedMap[item.chapterName] === 'boolean' ||
            typeof options.overrideSkippedMap[item.canonicalKey] === 'boolean')
      );
      const effectiveManualSkip = isManualSkipConfirmed ? item.manualSkip : Boolean(existingRev15.manualSkip && item.isSkipped);

      chaptersObj[item.canonicalKey] = {
        ...existingChap,
        'rev1.5': {
          ...existingRev15,
          skipped: item.isSkipped,
          manualSkip: effectiveManualSkip,
          statusTag: item.isSkipped
            ? 'skipped'
            : existingRev15.completed
            ? 'completed'
            : existingRev15.statusTag === 'skipped'
            ? undefined
            : existingRev15.statusTag,
          plannedMinutes: item.plannedMinutes,
          baselinePlannedMinutes: item.baselinePlannedMinutes,
          historicalBaselineMinutes: item.historicalBaselineMinutes,
          revisionAverageMinutes: item.revisionAverageMinutes,
          normalizedWeight: Number(item.normalizedWeight.toFixed(4)),
          priorityLevelApplied: item.priorityLevelApplied,
          cognitivePhaseId: item.cognitivePhaseId,
          windowTagShort: item.windowTagShort,
          sequenceOrder: item.sequenceOrder,
          abcCategory: item.abcCategory,
          weightageMarks: item.weightageMarks,
          icaiSectionCode: item.icaiSectionCode,
          icaiSectionName: item.icaiSectionName,
          icaiWeightageRange: item.icaiWeightageRange
        }
      };

      const normChap = normalizeKey(item.chapterName);
      const lmrKey = `lmr_${subjectId}_${normChap}`;
      if (item.plannedMinutes > 0) {
        durationsMap[lmrKey] = item.plannedMinutes;
        durationsMap[item.chapterName] = item.plannedMinutes;
        if (normChap) durationsMap[normChap] = item.plannedMinutes;
      } else {
        delete durationsMap[lmrKey];
      }
    });

    localStorage.setItem(
      localKey,
      JSON.stringify({
        ...parsedRev,
        revisionsCount: parsedRev?.revisionsCount || 3,
        chapters: chaptersObj,
        updatedAt: new Date().toISOString()
      })
    );
    localStorage.setItem(durationsKey, JSON.stringify(durationsMap));

    // Also update any matching 1.5-Day Sprint tasks in practca_local_tasks
    const localTasksKey = getLevelScopedKey('practca_local_tasks', activeLevel);
    const rawTasks = localStorage.getItem(localTasksKey);
    if (rawTasks) {
      const parsedTasks = JSON.parse(rawTasks);
      if (Array.isArray(parsedTasks)) {
        let tasksChanged = false;
        const nextTasks = parsedTasks.map((t: any) => {
          if (!t || String(t.subjectCode || '').toUpperCase() !== subjectId.toUpperCase()) return t;
          if (t.revKey !== 'rev1.5' && t.relevance !== 'Final Revision') return t;
          const cKey =
            getCanonicalChapterKey(subjectId, t.chapterName || t.cleanTitle || t.title || '') || '';
          const matchItem = plan.byChapterMap[cKey] || plan.byChapterMap[t.chapterName || ''];
          if (!matchItem) return t;
          if (t.targetDurationMinutes !== matchItem.plannedMinutes) {
            tasksChanged = true;
            return {
              ...t,
              targetDurationMinutes: matchItem.plannedMinutes
            };
          }
          return t;
        });
        if (tasksChanged) {
          localStorage.setItem(localTasksKey, JSON.stringify(nextTasks));
        }
      }
    }

    localStorage.setItem(
      getLevelScopedKey(`practca_lmr_smart_plan_applied_v10_${subjectId}`, activeLevel),
      'true'
    );
    localStorage.setItem(
      getLevelScopedKey(`practca_lmr_smart_plan_applied_v9_${subjectId}`, activeLevel),
      'true'
    );
  } catch {}

  return plan;
}

/**
 * Manual User Override helper: Allows toggling a chapter's skipped state and immediately
 * redistributes freed time & weights across active unskipped chapters.
 */
export function toggleLmrChapterManualSkip(
  subjectId: SubjectId,
  chapterName: string,
  forceSkip?: boolean,
  examDateStr?: string,
  level?: CALevel
) {
  const activeLevel = level || getSubjectLevel(subjectId);
  const canonicalKey = getCanonicalChapterKey(subjectId, chapterName) || chapterName;
  let currentlySkipped = false;
  try {
    const rawRev = localStorage.getItem(
      getLevelScopedKey(`practca_revision_planner_${subjectId}`, activeLevel)
    );
    if (rawRev) {
      const parsed = JSON.parse(rawRev);
      const cell = parsed?.chapters?.[canonicalKey]?.['rev1.5'] || parsed?.chapters?.[chapterName]?.['rev1.5'];
      currentlySkipped = Boolean(cell?.skipped);
    }
  } catch {}
  const nextSkip = typeof forceSkip === 'boolean' ? forceSkip : !currentlySkipped;
  const plan = applySmartLmrSprintAllocationToStorage(subjectId, {
    overrideSkippedMap: { [canonicalKey]: nextSkip, [chapterName]: nextSkip },
    preserveCompletedPlannedMinutes: true,
    rebalanceFromNow: true,
    examDateStr,
    level: activeLevel
  });
  try {
    window.dispatchEvent(new Event('practca_revision_update'));
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_tasks_updated'));
  } catch {}
  return plan;
}

/**
 * Ensures that:
 * 1. Whenever a subject goes active in 1.5-Day LMR mode, a fresh 1.5-Day revision board is initialized
 *    for that active subject with every chapter marked as pending (`completed: false, hours: ''`),
 *    and its practACE 1.5-Day Sprint Plan (FR 5-day prior / AFM-IBS prev exam 7:00 PM -> 9:30 AM std / 12:30 PM max flex,
 *    ABC normalized weights from historical revision baseline, and Priority 1-3 rebalancing) is populated.
 * 2. For all other non-active subjects in the active CA level,
 *    their 1.5-Day LMR log (`rev1.5`) and `rev1.5` state are strictly nil.
 */
export function syncActiveSubjectFreshLmrBoard(
  activeSubjectOverride?: SubjectId,
  examDateStrOverride?: string,
  level?: CALevel
): boolean {
  const activeLevel =
    level || (activeSubjectOverride ? getSubjectLevel(activeSubjectOverride) : getActiveCALevel());
  if (!isLmrModeCurrentlyOn(activeLevel)) return false;

  const sprint = resolveNextExamSprintInfo(new Date(), activeLevel);
  const activeSubject: SubjectId = activeSubjectOverride || sprint.subjectId;
  const examDateStr: string = examDateStrOverride || sprint.examDateStr;
  const lockMap = getPostExamLockedSubjectsMap(new Date(), activeLevel);
  const levelSequentialSubjects = getLevelSubjectIds(activeLevel);

  // Never reset or alter a post-exam locked subject or one whose 1.5-Day Sprint milestone is already marked complete
  if (lockMap[activeSubject]?.isLocked || lockMap[activeSubject]?.isFinalSprintMilestoneCompleted) {
    return false;
  }

  const sessionInitKey = getLevelScopedKey('practca_lmr_active_subject_init_v3', activeLevel);
  const expectedToken = `${activeSubject}_${examDateStr}`;

  let isNewlyActivatedSubject = false;
  try {
    if (localStorage.getItem(sessionInitKey) !== expectedToken) {
      isNewlyActivatedSubject = true;
      localStorage.setItem(sessionInitKey, expectedToken);
    }
  } catch {}

  let anyModified = false;
  const modifiedSubjects = new Set<SubjectId>();

  const smartPlanAppliedKey = getLevelScopedKey(
    `practca_lmr_smart_plan_applied_v10_${activeSubject}`,
    activeLevel
  );
  const needsSmartPlanInit =
    isNewlyActivatedSubject || localStorage.getItem(smartPlanAppliedKey) !== 'true';

  // 1. If the active subject just went active, initialize a fresh 1.5-day revision board (all chapters pending)
  if (isNewlyActivatedSubject) {
    try {
      const localKey = getLevelScopedKey(`practca_revision_planner_${activeSubject}`, activeLevel);
      const raw = localStorage.getItem(localKey);
      const parsed = raw ? JSON.parse(raw) : { revisionsCount: 3, chapters: {} };
      const chaptersObj: Record<string, any> =
        parsed && typeof parsed.chapters === 'object' && parsed.chapters ? { ...parsed.chapters } : {};
      const officialList = SUBJECT_CHAPTERS[activeSubject] || [];

      officialList.forEach((chapName) => {
        const existingChap = chaptersObj[chapName] || {};
        const prevPlanned = existingChap['rev1.5']?.plannedMinutes;
        chaptersObj[chapName] = {
          ...existingChap,
          'rev1.5': {
            completed: false,
            hours: '',
            skipped: false,
            manualSkip: false,
            ...(prevPlanned ? { plannedMinutes: prevPlanned } : {})
          }
        };
      });

      Object.keys(chaptersObj).forEach((k) => {
        if (!officialList.includes(k) && chaptersObj[k]?.['rev1.5']) {
          const prevPlanned = chaptersObj[k]?.['rev1.5']?.plannedMinutes;
          chaptersObj[k] = {
            ...chaptersObj[k],
            'rev1.5': {
              completed: false,
              hours: '',
              skipped: false,
              manualSkip: false,
              ...(prevPlanned ? { plannedMinutes: prevPlanned } : {})
            }
          };
        }
      });

      localStorage.setItem(
        localKey,
        JSON.stringify({
          ...parsed,
          revisionsCount: parsed?.revisionsCount || 3,
          chapters: chaptersObj,
          updatedAt: new Date().toISOString()
        })
      );
      localStorage.removeItem(
        getLevelScopedKey(`practca_lmr_last_run_map_${activeSubject}`, activeLevel)
      );
      modifiedSubjects.add(activeSubject);
      anyModified = true;
    } catch {}
  }

  // Apply the Smart 1.5-Day Sprint Plan using practACE 1.5 Sprint Algorithm
  if (needsSmartPlanInit) {
    applySmartLmrSprintAllocationToStorage(activeSubject, {
      preserveCompletedPlannedMinutes: !isNewlyActivatedSubject,
      rebalanceFromNow: !isNewlyActivatedSubject,
      examDateStr,
      level: activeLevel
    });
    modifiedSubjects.add(activeSubject);
    anyModified = true;
  }

  // 2. For future non-active subjects that are NOT post-exam locked and NOT milestone-completed, keep LMR (`rev1.5`) state clean
  levelSequentialSubjects.forEach((subId) => {
    if (subId === activeSubject) return;
    if (
      lockMap[subId]?.isLocked ||
      lockMap[subId]?.isFinalSprintMilestoneCompleted ||
      lockMap[subId]?.isExamDateCompleted
    ) {
      return;
    }
    try {
      localStorage.removeItem(getLevelScopedKey(`practca_lmr_last_run_map_${subId}`, activeLevel));
      const localKey = getLevelScopedKey(`practca_revision_planner_${subId}`, activeLevel);
      const raw = localStorage.getItem(localKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.chapters !== 'object' || !parsed.chapters) return;

      let subChanged = false;
      const chaptersObj = { ...parsed.chapters };
      Object.keys(chaptersObj).forEach((chapKey) => {
        const rev15 = chaptersObj[chapKey]?.['rev1.5'];
        if (
          rev15 &&
          (rev15.completed ||
            (rev15.hours && rev15.hours !== '') ||
            rev15.skipped ||
            rev15.partiallyDone ||
            rev15.statusTag)
        ) {
          subChanged = true;
          chaptersObj[chapKey] = {
            ...chaptersObj[chapKey],
            'rev1.5': {
              completed: false,
              hours: ''
            }
          };
        }
      });

      if (subChanged) {
        localStorage.setItem(
          localKey,
          JSON.stringify({
            ...parsed,
            chapters: chaptersObj,
            updatedAt: new Date().toISOString()
          })
        );
        modifiedSubjects.add(subId);
        anyModified = true;
      }
    } catch {}
  });

  // 3. Clean `practca_revision_planner_logs` only for unlocked, uncompleted future subjects
  let updatedLogsList: any[] | null = null;
  try {
    const logsStorageKey = getLevelScopedKey('practca_revision_planner_logs', activeLevel);
    const rawLogs = localStorage.getItem(logsStorageKey);
    if (rawLogs) {
      const parsedLogs = JSON.parse(rawLogs);
      if (Array.isArray(parsedLogs)) {
        const filteredLogs = parsedLogs.filter((l: any) => {
          if (!l) return false;
          const isRev15 = l.revKey === 'rev1.5' || l.revisionNumber === 'rev1.5';
          if (!isRev15) return true;
          const logSub = normalizeSubjectId(l.subjectId, activeLevel);
          const subLockInfo = logSub ? lockMap[logSub] : undefined;
          if (
            subLockInfo?.isLocked ||
            subLockInfo?.isFinalSprintMilestoneCompleted ||
            subLockInfo?.isExamDateCompleted
          ) {
            return true; // Always preserve logs for completed/locked exam subjects
          }
          if (!logSub || logSub.toUpperCase() !== activeSubject.toUpperCase()) {
            return false;
          }
          if (isNewlyActivatedSubject) {
            return false;
          }
          return true;
        });
        if (filteredLogs.length !== parsedLogs.length) {
          localStorage.setItem(logsStorageKey, JSON.stringify(filteredLogs));
          updatedLogsList = filteredLogs;
          anyModified = true;
        }
      }
    }
  } catch {}

  // 4. Sync to Firestore if signed in
  try {
    const currentUser = auth?.currentUser;
    if (currentUser && !currentUser.isAnonymous && anyModified) {
      modifiedSubjects.forEach((subId) => {
        try {
          const raw = localStorage.getItem(
            getLevelScopedKey(`practca_revision_planner_${subId}`, activeLevel)
          );
          if (raw) {
            const parsed = JSON.parse(raw);
            setDoc(
              firestoreDoc(
                db,
                'users',
                currentUser.uid,
                'revisionPlanner',
                getFirestoreRevisionDocId(subId, activeLevel)
              ),
              {
                subjectId: subId,
                caLevel: activeLevel,
                revisionsCount: parsed.revisionsCount || 3,
                chapters: parsed.chapters || {},
                updatedAt: new Date().toISOString()
              },
              { merge: true }
            ).catch(() => {});
          }
        } catch {}
      });
      if (updatedLogsList !== null) {
        setDoc(
          firestoreDoc(
            db,
            'users',
            currentUser.uid,
            'revisionPlanner',
            getFirestoreRevisionLogsDocId(activeLevel)
          ),
          {
            caLevel: activeLevel,
            logs: updatedLogsList,
            updatedAt: new Date().toISOString()
          }
        ).catch(() => {});
      }
    }
  } catch {}

  if (anyModified) {
    try {
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('practca_revision_planner_updated'));
    } catch {}
  }

  return anyModified;
}

interface LmrActivationOverlayProps {
  isOpen: boolean;
  sprintInfo: NextExamSprintInfo;
  onActivateLmr: () => void;
}

export const LmrActivationOverlay: React.FC<LmrActivationOverlayProps> = ({
  isOpen,
  sprintInfo,
  onActivateLmr
}) => {
  if (!isOpen) return null;

  const meta = PAPER_META[sprintInfo.subjectId];
  const totalChapters = (SUBJECT_CHAPTERS[sprintInfo.subjectId] || []).length;

  return (
    <ModalPortal priorityOffset={2500}>
      <AnimatePresence>
        <div className="fixed inset-0 z-[9500] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.16)_0%,rgba(245,158,11,0.08)_40%,transparent_75%)] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-gradient-to-b from-[#13091c] via-[#0c0f1d] to-[#070913] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-[0_0_90px_rgba(245,158,11,0.28)] text-center space-y-5 my-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-black uppercase tracking-widest">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Mandatory 1.5-Day Final Examination Sprint</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans uppercase">
                LMR Mode Turning On
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Active Paper:{' '}
                <strong className="text-amber-300 font-bold">
                  {meta.shortLabel} — {sprintInfo.paperName}
                </strong>{' '}
                ({totalChapters} Chapters • Synced with 1.5 Revision Report).
              </p>
            </div>

            <div className="bg-slate-950/85 border border-amber-500/35 rounded-2xl p-4 text-left text-xs text-slate-300">
              <div className="flex items-center justify-between font-mono">
                <span className="text-amber-300 font-black">{meta.shortLabel}</span>
                <span className="text-emerald-300 font-bold">Exam Date: {sprintInfo.examDateStr}</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onActivateLmr}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4 fill-slate-950" />
                <span>Proceed to 1.5-Day LMR Sprint ({sprintInfo.subjectId})</span>
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </ModalPortal>
  );
};

export type LmrSprintTimingMode = 'T' | 'O';
const LMR_TIMING_MODE_STORAGE_KEY = 'practca_lmr_sprint_mode';

export function getLmrSprintTimingMode(level?: CALevel): LmrSprintTimingMode {
  try {
    const activeLevel = level || getActiveCALevel();
    const raw = localStorage.getItem(getLevelScopedKey(LMR_TIMING_MODE_STORAGE_KEY, activeLevel));
    return raw === 'O' ? 'O' : 'T';
  } catch {
    return 'T';
  }
}

export function setLmrSprintTimingMode(mode: LmrSprintTimingMode, level?: CALevel): void {
  try {
    const activeLevel = level || getActiveCALevel();
    localStorage.setItem(getLevelScopedKey(LMR_TIMING_MODE_STORAGE_KEY, activeLevel), mode);
    window.dispatchEvent(new CustomEvent('practca_lmr_timing_mode_updated', { detail: { mode } }));
  } catch {}
}

export interface TargetBoardTaskItem {
  id: string;
  taskKey?: string;
  title: string;
  cleanTitle?: string;
  subjectCode?: SubjectId | string;
  chapterName?: string;
  relevance?: 'General' | 'Revision' | 'Final Revision';
  revKey?: RevisionCycleKey;
  status?: string;
  due?: string;
  taskDate?: string;
  isCompleted?: boolean;
  isCurrentGrind?: boolean;
  isCurrentlyLinked?: boolean;
  targetDuration?: number;
  clockAllocatedMinutes?: number;
  totalActualSeconds?: number;
  allocatedMinutes?: number;
  hasClockSlots?: boolean;
  clockSlotCount?: number;
  clockSlotStartLabel?: string;
  isMockTest?: boolean;
  sequenceOrder?: number;
}

interface LmrSprintBoardProps {
  sprintInfo: NextExamSprintInfo;
  allRevisionChaptersState: Record<SubjectId, Record<string, any>>;
  focusSessions: FocusSession[];
  sessionLogs: any[];
  localTasks?: any[];
  taskTargetDurations: Record<string, number>;
  activeMode: string;
  modeSeconds: number;
  blockStartTime?: Date | null;
  activeFocusTask: {
    id?: string;
    taskId?: string;
    subjectCode: string;
    title: string;
    cleanTitle?: string;
    chapterName?: string;
    relevance?: 'General' | 'Revision' | 'Final Revision';
    completed?: boolean;
    dueDate?: string;
    revKey?: RevisionCycleKey;
  } | null;
  sessionNotesOnClock?: string;
  selectedClockDate?: string;
  targetBoardTasks?: TargetBoardTaskItem[];
  onAddTask?: () => void;
  onStartTaskFocus?: (task: any) => void;
  onToggleTaskComplete?: (task: any) => void;
  onToggleChapterComplete: (subjectId: SubjectId, chapterName: string, forceCompletedState: boolean) => Promise<void> | void;
  onUpdateChapterPlannedDuration: (subjectId: SubjectId, chapterName: string, minutes: number) => void;
  onUpdateChapterActualDuration?: (subjectId: SubjectId, chapterName: string, actualMinutes: number) => void;
  onStartChapterGrind: (subjectId: SubjectId, chapterName: string, plannedMinutes: number) => void;
}

export const LmrSprintBoard: React.FC<LmrSprintBoardProps> = ({
  selectedClockDate,
  targetBoardTasks = [],
  onAddTask,
  onStartTaskFocus,
  onToggleTaskComplete
}) => {
  // Timed ('T') vs Open/Untimed ('O') switch state
  const [timingMode, setTimingMode] = useState<LmrSprintTimingMode>(() => getLmrSprintTimingMode());

  useEffect(() => {
    const syncTimingMode = () => {
      setTimingMode(getLmrSprintTimingMode());
    };
    window.addEventListener('storage', syncTimingMode);
    window.addEventListener('practca_lmr_timing_mode_updated', syncTimingMode);
    return () => {
      window.removeEventListener('storage', syncTimingMode);
      window.removeEventListener('practca_lmr_timing_mode_updated', syncTimingMode);
    };
  }, []);

  const [selectedStatuses, setSelectedStatuses] = useState<Set<LmrChapterStatus>>(
    () => new Set(['not_started', 'in_progress', 'completed'])
  );
  const [sortBy, setSortBy] = useState<'schedule' | 'status' | 'actual_desc' | 'planned_desc'>('schedule');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);

  const listScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const [scrollMetrics, setScrollMetrics] = useState<{
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }>({ scrollTop: 0, scrollHeight: 1, clientHeight: 1 });
  const [isDraggingScrollThumb, setIsDraggingScrollThumb] = useState<boolean>(false);

  const handleToggleTimingMode = () => {
    const nextMode: LmrSprintTimingMode = timingMode === 'T' ? 'O' : 'T';
    setTimingMode(nextMode);
    setLmrSprintTimingMode(nextMode);
    if (nextMode === 'O' && (sortBy === 'actual_desc' || sortBy === 'planned_desc')) {
      setSortBy('schedule');
    }
  };

  const toggleStatusFilter = (status: LmrChapterStatus) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        if (next.size === 1) {
          return new Set(['not_started', 'in_progress', 'completed']);
        }
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const resetAllFilters = () => {
    setSelectedStatuses(new Set(['not_started', 'in_progress', 'completed']));
    setSortBy('schedule');
  };

  const boardRows = useMemo(() => {
    return (targetBoardTasks || [])
      .filter((t) => !isComprehensiveStudyBlockTask(t))
      .map((t, index) => {
      const isCompleted = Boolean(t.isCompleted || t.status === 'completed');
      const totalActualSeconds = Math.max(
        0,
        Number(t.totalActualSeconds ?? ((t.allocatedMinutes || 0) * 60)) || 0
      );
      const actualMinutes = Math.floor(totalActualSeconds / 60);
      const isCurrentlyGrinding = Boolean(t.isCurrentGrind);
      const isCurrentlyLinked = Boolean(t.isCurrentlyLinked);
      const plannedMinutes = timingMode === 'O' ? 0 : Math.max(0, Number(t.clockAllocatedMinutes ?? t.targetDuration ?? 0) || 0);

      const status: LmrChapterStatus = isCompleted
        ? 'completed'
        : totalActualSeconds > 0 || isCurrentlyGrinding
        ? 'in_progress'
        : 'not_started';

      return {
        index,
        id: t.id || `board_task_${index}`,
        displayTitle: t.cleanTitle || t.title || 'Target',
        subjectCode: (t.subjectCode || '') as string,
        chapterName: t.chapterName,
        relevance: t.relevance,
        status,
        isCompleted,
        isCurrentlyGrinding,
        isCurrentlyLinked,
        plannedMinutes,
        totalActualSeconds,
        actualMinutes,
        hasClockSlots: Boolean(t.hasClockSlots),
        clockSlotStartLabel: t.clockSlotStartLabel || '--',
        sequenceOrder: Number(t.sequenceOrder ?? index + 1),
        rawTask: t
      };
    });
  }, [targetBoardTasks, timingMode]);

  const statusCounts = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let totalPlannedMinutes = 0;
    boardRows.forEach((r) => {
      totalPlannedMinutes += r.plannedMinutes;
      if (r.status === 'completed') completed++;
      else if (r.status === 'in_progress') inProgress++;
      else notStarted++;
    });
    return { completed, inProgress, notStarted, totalPlannedMinutes, total: boardRows.length };
  }, [boardRows]);

  const displayedRows = useMemo(() => {
    const filtered = boardRows.filter(
      (row) => row.isCurrentlyGrinding || selectedStatuses.has(row.status)
    );
    const sorted = [...filtered];

    if (sortBy === 'status') {
      const rank: Record<LmrChapterStatus, number> = {
        in_progress: 0,
        not_started: 1,
        completed: 2
      };
      sorted.sort((a, b) => rank[a.status] - rank[b.status] || a.sequenceOrder - b.sequenceOrder || a.index - b.index);
    } else if (sortBy === 'actual_desc' && timingMode === 'T') {
      sorted.sort((a, b) => b.totalActualSeconds - a.totalActualSeconds || a.index - b.index);
    } else if (sortBy === 'planned_desc' && timingMode === 'T') {
      sorted.sort((a, b) => b.plannedMinutes - a.plannedMinutes || a.index - b.index);
    } else {
      sorted.sort((a, b) => a.sequenceOrder - b.sequenceOrder || a.index - b.index);
    }

    const incompleteActive = sorted.filter((r) => !r.isCompleted);
    const completedOrdered = sorted.filter((r) => r.isCompleted);
    const finalOrdered = [...incompleteActive, ...completedOrdered];

    // Pin currently running target at top
    const runningIdx = finalOrdered.findIndex((r) => r.isCurrentlyGrinding);
    if (runningIdx > 0) {
      const [runningItem] = finalOrdered.splice(runningIdx, 1);
      finalOrdered.unshift(runningItem);
    }

    return finalOrdered;
  }, [boardRows, selectedStatuses, sortBy, timingMode]);

  const updateScrollMetrics = () => {
    const el = listScrollContainerRef.current;
    if (!el) return;
    setScrollMetrics({
      scrollTop: el.scrollTop,
      scrollHeight: Math.max(1, el.scrollHeight),
      clientHeight: Math.max(1, el.clientHeight)
    });
  };

  useEffect(() => {
    const el = listScrollContainerRef.current;
    if (!el) return;
    updateScrollMetrics();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateScrollMetrics) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', updateScrollMetrics);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateScrollMetrics);
    };
  }, [displayedRows.length]);

  useEffect(() => {
    if (!isDraggingScrollThumb) return;

    const handlePointerMove = (e: MouseEvent) => {
      const track = scrollTrackRef.current;
      const container = listScrollContainerRef.current;
      if (!track || !container) return;
      const rect = track.getBoundingClientRect();
      if (rect.height <= 0) return;
      const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      container.scrollTop = ratio * maxScroll;
    };

    const handlePointerUp = () => {
      setIsDraggingScrollThumb(false);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isDraggingScrollThumb]);

  const maxScrollTop = Math.max(0, scrollMetrics.scrollHeight - scrollMetrics.clientHeight);
  const isListScrollable = maxScrollTop > 4;
  const canScrollUp = scrollMetrics.scrollTop > 4;
  const canScrollDown = scrollMetrics.scrollTop < maxScrollTop - 4;
  const thumbHeightPercent = isListScrollable
    ? Math.max(14, Math.min(100, (scrollMetrics.clientHeight / scrollMetrics.scrollHeight) * 100))
    : 100;
  const thumbTopPercent = isListScrollable
    ? ((scrollMetrics.scrollTop / maxScrollTop) * (100 - thumbHeightPercent))
    : 0;

  const handleScrollByStep = (deltaY: number) => {
    if (!listScrollContainerRef.current) return;
    listScrollContainerRef.current.scrollBy({ top: deltaY, behavior: 'smooth' });
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = scrollTrackRef.current;
    const container = listScrollContainerRef.current;
    if (!track || !container) return;
    const rect = track.getBoundingClientRect();
    if (rect.height <= 0) return;
    const clickRatio = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
    container.scrollTo({ top: clickRatio * maxScroll, behavior: 'smooth' });
  };

  const activeFilterCount = selectedStatuses.size < 3 ? selectedStatuses.size : 0;

  return (
    <div
      id="lmr-sprint-board"
      className="bg-gradient-to-br from-[#11192e]/85 via-[#0a1020]/90 to-[#060a14]/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.12)] text-left flex flex-col gap-3 h-full flex-1 min-h-[500px] lg:min-h-0 relative overflow-hidden"
    >
      {/* Luminous Glass Highlights & Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: T/O Corner + Target Board Title + Filter Corner + Active Date Sub-bar + Status Counts */}
      <div className="relative z-30 space-y-2 border-b border-white/[0.08] pb-2.5 shrink-0">
        <div className="relative z-40 grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
          {/* Left Corner: T (Timed) / O (Open Untimed) Switch */}
          <div className="flex items-center justify-start justify-self-start">
            <button
              type="button"
              role="switch"
              aria-checked={timingMode === 'T'}
              onClick={handleToggleTimingMode}
              className="h-8 w-[56px] p-0.5 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.1] hover:border-white/[0.2] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] inline-flex items-center justify-between font-mono text-[10px] font-black select-none cursor-pointer transition shrink-0"
              title={
                timingMode === 'T'
                  ? 'Timed Mode (T): Planned time sums slotted durations from the 24-Hour Target Clock (Click for O - Open Untimed)'
                  : 'Open Mode (O): Untimed tasks — planned time is 0m and accumulated time logs directly (Click for T - Timed)'
              }
            >
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0 ${
                  timingMode === 'T'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : 'text-slate-500'
                }`}
              >
                T
              </span>
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all shrink-0 ${
                  timingMode === 'O'
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-500'
                }`}
              >
                O
              </span>
            </button>
          </div>

          {/* Center Title */}
          <div className="flex items-center justify-center justify-self-center gap-1.5 text-center min-w-0">
            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-mono leading-tight truncate">
              Target Board
            </h2>
          </div>

          {/* Right Corner: Simple + Add Task Icon Button & Filter Dropdown Button */}
          <div className="relative z-50 flex items-center justify-end justify-self-end gap-1.5 shrink-0">
            {onAddTask && (
              <button
                type="button"
                onClick={onAddTask}
                className="h-8 w-8 rounded-lg bg-violet-500/20 hover:bg-violet-500/35 border border-violet-400/45 text-violet-200 hover:text-white inline-flex items-center justify-center transition cursor-pointer shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                title="Add Study Task"
                aria-label="Add Study Task"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              className={`h-8 px-2.5 rounded-lg border backdrop-blur-md text-[10px] font-mono font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition whitespace-nowrap shrink-0 ${
                activeFilterCount > 0 || sortBy !== 'schedule'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-slate-200 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
              }`}
              title="Filter or sort daily targets"
            >
              <Filter className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl bg-[#0a1020] backdrop-blur-2xl border border-amber-400/30 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.92)] z-[100] space-y-2.5 font-mono text-[10px] text-left">
                <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                  <span className="font-black uppercase text-amber-400">Filter & Sort</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFilterDropdown(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Status:</span>
                  {(
                    [
                      { id: 'not_started', label: `Not Started (${statusCounts.notStarted})` },
                      { id: 'in_progress', label: `In Progress (${statusCounts.inProgress})` },
                      { id: 'completed', label: `Completed (${statusCounts.completed})` }
                    ] as { id: LmrChapterStatus; label: string }[]
                  ).map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-900 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.has(st.id)}
                        onChange={() => toggleStatusFilter(st.id)}
                        className="rounded accent-amber-500 cursor-pointer"
                      />
                      <span className="text-slate-200 font-bold">{st.label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-1 border-t border-slate-850 pt-2">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Sort By:</span>
                  {(
                    [
                      { id: 'schedule' as const, label: '24h Clock & Schedule Order' },
                      { id: 'status' as const, label: 'Status (In Progress First)' },
                      ...(timingMode === 'T'
                        ? [
                            { id: 'actual_desc' as const, label: 'Accumulated Time (High → Low)' },
                            { id: 'planned_desc' as const, label: 'Planned Time (High → Low)' }
                          ]
                        : [])
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg transition cursor-pointer flex items-center justify-between ${
                        sortBy === opt.id
                          ? 'bg-amber-500/20 text-amber-300 font-black'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check className="h-3 w-3 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Active Date Daily Schedule Sub-Bar */}
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.035] backdrop-blur-md border border-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <h3 className="text-xs font-extrabold text-slate-100 leading-snug truncate">
            Daily Schedule{selectedClockDate ? ` • ${selectedClockDate}` : ''}
          </h3>
          {timingMode === 'T' && (
            <span className="font-mono text-[10px] font-bold text-cyan-300 shrink-0 tabular-nums">
              {formatStaticDuration(statusCounts.totalPlannedMinutes, 'minutes')} planned
            </span>
          )}
        </div>

        {/* Row 3: Total Completed, In Progress, Not Started */}
        <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
          <div className="h-8 px-3 rounded-xl bg-emerald-500/[0.12] backdrop-blur-md border border-emerald-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-between gap-1.5 whitespace-nowrap">
            <span className="text-emerald-200 font-bold truncate">Completed</span>
            <span className="text-emerald-400 font-black text-xs tabular-nums shrink-0">{statusCounts.completed}</span>
          </div>
          <div className="h-8 px-3 rounded-xl bg-amber-500/[0.12] backdrop-blur-md border border-amber-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-between gap-1.5 whitespace-nowrap">
            <span className="text-amber-200 font-bold truncate">In Progress</span>
            <span className="text-amber-400 font-black text-xs tabular-nums shrink-0">{statusCounts.inProgress}</span>
          </div>
          <div className="h-8 px-3 rounded-xl bg-white/[0.035] backdrop-blur-md border border-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between gap-1.5 whitespace-nowrap">
            <span className="text-slate-300 font-bold truncate">Not Started</span>
            <span className="text-white font-black text-xs tabular-nums shrink-0">{statusCounts.notStarted}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Daily Targets List + Custom Precision Scroll Rail */}
      <div className="relative z-10 flex-1 min-h-[380px] lg:min-h-0 flex items-stretch gap-1 overflow-hidden">
        <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
          {canScrollUp && (
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-[#0b1222] to-transparent z-10" />
          )}

          <div
            ref={listScrollContainerRef}
            onScroll={updateScrollMetrics}
            className="flex-1 min-h-0 overflow-y-auto lmr-no-native-scroll space-y-1.5 pr-0.5"
          >
            {displayedRows.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center space-y-2 my-4">
                <p className="text-xs text-slate-400">
                  {boardRows.length === 0
                    ? `No targets on Daily Schedule for ${selectedClockDate || 'this date'}. Click + Add Task to add a target.`
                    : 'No targets match the selected filter.'}
                </p>
                {boardRows.length > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/35 text-[10px] font-mono font-bold cursor-pointer"
                  >
                    Show All Targets
                  </button>
                )}
              </div>
            ) : (
              displayedRows.map((row) => {
                const rowFillPercent = row.isCompleted
                  ? 100
                  : row.plannedMinutes > 0
                  ? Math.min(100, Math.round((row.totalActualSeconds / (row.plannedMinutes * 60)) * 100))
                  : row.totalActualSeconds > 0
                  ? 100
                  : 0;

                const actualDisplay = row.isCurrentlyGrinding
                  ? formatRunningTime(row.totalActualSeconds)
                  : row.totalActualSeconds > 0 && row.totalActualSeconds < 60
                  ? `${row.totalActualSeconds}s`
                  : formatStaticDuration(row.actualMinutes, 'minutes').replace(/\s+/g, '');

                const plannedDisplay = formatStaticDuration(row.plannedMinutes, 'minutes').replace(/\s+/g, '');

                return (
                  <div key={row.id} className="flex items-stretch gap-1">
                    {/* Left Timeline Guideline Strip */}
                    {timingMode === 'T' && (
                      <div
                        className="w-[34px] shrink-0 relative flex flex-col items-end justify-center pr-1.5 select-none"
                        title={
                          row.isCompleted
                            ? `Completed (${actualDisplay} logged)`
                            : row.hasClockSlots
                            ? `24h Clock Slotted: ${row.clockSlotStartLabel}`
                            : 'Not yet slotted on 24-Hour Target Clock'
                        }
                      >
                        <div className="absolute right-[1px] top-0 bottom-0 w-[2px] rounded-full overflow-hidden bg-slate-800/90">
                          {rowFillPercent > 0 && (
                            <div
                              className={`w-full transition-all duration-300 rounded-full ${
                                row.isCompleted || rowFillPercent >= 100
                                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                                  : row.isCurrentlyGrinding
                                  ? 'bg-emerald-400'
                                  : 'bg-amber-400'
                              }`}
                              style={{ height: `${rowFillPercent}%` }}
                            />
                          )}
                        </div>
                        <div
                          className={`absolute right-[-0.5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors ${
                            row.isCompleted || rowFillPercent >= 100
                              ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]'
                              : row.isCurrentlyGrinding
                              ? 'bg-emerald-400'
                              : rowFillPercent > 0
                              ? 'bg-amber-400'
                              : 'bg-slate-600'
                          }`}
                        />
                        <span
                          className={`font-mono text-[8px] tabular-nums leading-none tracking-tighter ${
                            row.isCompleted || rowFillPercent >= 100
                              ? 'text-emerald-400 font-bold'
                              : row.isCurrentlyGrinding
                              ? 'text-emerald-300 font-bold'
                              : rowFillPercent > 0
                              ? 'text-amber-300 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {row.isCompleted ? 'Done' : row.clockSlotStartLabel}
                        </span>
                      </div>
                    )}

                    {/* Target Card */}
                    <div
                      className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl border backdrop-blur-md transition flex items-center justify-between gap-2 ${
                        row.isCurrentlyGrinding
                          ? 'bg-amber-500/15 border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.12),inset_0_1px_0_rgba(255,255,255,0.12)]'
                          : row.isCompleted
                          ? 'bg-emerald-500/[0.08] border-emerald-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                          : row.status === 'in_progress'
                          ? 'bg-amber-500/[0.09] border-amber-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.055] hover:border-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                      }`}
                    >
                      {/* Left: Completion Checkbox + Title & Subject */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          type="button"
                          aria-checked={row.isCompleted}
                          role="checkbox"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTaskComplete?.(row.rawTask);
                          }}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 cursor-pointer ${
                            row.isCompleted
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 hover:bg-emerald-400'
                              : row.status === 'in_progress'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-900 border-slate-700 text-transparent hover:border-amber-400'
                          }`}
                          title={row.isCompleted ? 'Completed (Click to undo)' : 'Mark Completed'}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {row.subjectCode && (
                              <span className="font-mono text-[9.5px] font-black text-amber-300 shrink-0">
                                {row.subjectCode}
                              </span>
                            )}
                            <span
                              className={`text-xs font-medium leading-snug break-words select-none min-w-0 truncate ${
                                row.isCompleted
                                  ? 'text-emerald-300'
                                  : row.status === 'in_progress'
                                  ? 'text-amber-200'
                                  : 'text-slate-100'
                              }`}
                              title={row.displayTitle}
                            >
                              {row.displayTitle}
                            </span>
                          </div>
                          {row.relevance && (
                            <span className="text-[9px] font-mono text-slate-400 block leading-tight truncate">
                              {row.relevance === 'General'
                                ? 'Baseline'
                                : row.relevance === 'Final Revision'
                                ? 'LMR / Final Revision'
                                : 'Revision'}
                              {row.chapterName && row.chapterName !== row.displayTitle ? ` · ${row.chapterName}` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Planned / Accumulated Time + Focus/Grind/Live/Done Action */}
                      <div className="flex items-center justify-end gap-1.5 shrink-0">
                        {timingMode === 'T' && (
                          <div
                            className="h-7 min-w-[92px] px-2 bg-slate-950/60 backdrop-blur-md border border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] rounded-lg flex items-center justify-center gap-1 font-mono text-[9.5px] tracking-tighter whitespace-nowrap shrink-0"
                            title="Planned Time (24h Clock Total) / Accumulated Time"
                          >
                            <span className="text-amber-300 font-bold tabular-nums">{plannedDisplay}</span>
                            <span className="text-slate-600 select-none">/</span>
                            <span
                              className={`font-bold tabular-nums ${
                                row.isCurrentlyGrinding
                                  ? 'text-emerald-300'
                                  : row.totalActualSeconds > 0
                                  ? 'text-cyan-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {actualDisplay}
                            </span>
                          </div>
                        )}

                        {row.isCompleted ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTaskComplete?.(row.rawTask);
                            }}
                            className="h-7 w-[58px] rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-mono text-[9.5px] font-black uppercase inline-flex items-center justify-center gap-0.5 select-none shrink-0 cursor-pointer transition"
                            title="Completed (Click to reopen)"
                          >
                            <Check className="h-2.5 w-2.5 text-emerald-400 stroke-[3] shrink-0" />
                            <span>Done</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStartTaskFocus?.(row.rawTask)}
                            className={`h-7 w-[58px] rounded-lg font-mono text-[9.5px] font-black uppercase transition inline-flex items-center justify-center gap-0.5 cursor-pointer shrink-0 ${
                              row.isCurrentlyGrinding
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            }`}
                            title={
                              row.isCurrentlyGrinding
                                ? `Currently running in Target Slot`
                                : row.status === 'in_progress' || row.isCurrentlyLinked
                                ? `Resume ${row.displayTitle}`
                                : `Link ${row.displayTitle} to Target Slot and start Study`
                            }
                          >
                            <Play
                              className={`h-2.5 w-2.5 shrink-0 ${
                                row.isCurrentlyGrinding ? 'text-emerald-300 animate-pulse' : 'fill-slate-950'
                              }`}
                            />
                            <span>
                              {row.isCurrentlyGrinding
                                ? 'Live'
                                : row.status === 'in_progress' || row.isCurrentlyLinked
                                ? 'Grind'
                                : 'Focus'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {canScrollDown && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-[#060a14] to-transparent z-10" />
          )}
        </div>

        {/* Custom Precision Scroll Rail & Stepper Controls */}
        {isListScrollable && (
          <div
            className="w-5 shrink-0 flex flex-col items-center justify-between py-0.5 select-none bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-0.5"
            aria-label="Target list scroll controller"
          >
            <button
              type="button"
              onClick={() => handleScrollByStep(-180)}
              disabled={!canScrollUp}
              className={`w-4 h-4 rounded-lg flex items-center justify-center transition ${
                canScrollUp
                  ? 'text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 cursor-pointer'
                  : 'text-slate-700 cursor-not-allowed'
              }`}
              title="Scroll Up"
            >
              <ChevronUp className="h-3 w-3 stroke-[2.5]" />
            </button>

            <div
              ref={scrollTrackRef}
              onClick={handleTrackClick}
              onMouseDown={(e) => {
                e.preventDefault();
                handleTrackClick(e);
                setIsDraggingScrollThumb(true);
              }}
              className="relative flex-1 w-2 my-1 rounded-full bg-slate-900/95 border border-slate-800/90 cursor-pointer overflow-hidden"
              title="Click or drag to scroll targets"
            >
              <div
                style={{
                  height: `${thumbHeightPercent}%`,
                  top: `${thumbTopPercent}%`
                }}
                className={`absolute left-0 right-0 rounded-full transition-colors ${
                  isDraggingScrollThumb
                    ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                    : 'bg-gradient-to-b from-amber-400/85 via-amber-500/85 to-orange-500/85 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.45)]'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => handleScrollByStep(180)}
              disabled={!canScrollDown}
              className={`w-4 h-4 rounded-lg flex items-center justify-center transition ${
                canScrollDown
                  ? 'text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 cursor-pointer'
                  : 'text-slate-700 cursor-not-allowed'
              }`}
              title="Scroll Down"
            >
              <ChevronDown className="h-3 w-3 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

