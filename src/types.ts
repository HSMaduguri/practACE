/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CALevel = 'final' | 'intermediate' | 'foundation' | 'cma_final' | 'cma_intermediate' | 'cma_foundation';

export type FinalSubjectId = 'AFM' | 'FR' | 'Audit' | 'DT' | 'IDT' | 'IBS';
export type IntermediateSubjectId = 'AdvAcc' | 'CorpLaw' | 'Tax' | 'Cost' | 'AuditInter' | 'FMSM';
export type FoundationSubjectId = 'Accounts' | 'Law' | 'MathStats' | 'Econ';

export type CMAFoundationSubjectId = 'CMAFoundLaw' | 'CMAFoundAcc' | 'CMAFoundMath' | 'CMAFoundEcon';
export type CMAIntermediateSubjectId =
  | 'CMAInterLaw'
  | 'CMAInterFA'
  | 'CMAInterTax'
  | 'CMAInterCost'
  | 'CMAInterOMSM'
  | 'CMAInterCAA'
  | 'CMAInterFMDA'
  | 'CMAInterMA';
export type CMAFinalSubjectId =
  | 'CMAFinalLaw'
  | 'CMAFinalSFM'
  | 'CMAFinalDT'
  | 'CMAFinalSCM'
  | 'CMAFinalCMA'
  | 'CMAFinalCFR'
  | 'CMAFinalIDT'
  | 'CMAFinalSPBV';

export type CMASubjectId = CMAFoundationSubjectId | CMAIntermediateSubjectId | CMAFinalSubjectId;
export type SubjectId = FinalSubjectId | IntermediateSubjectId | FoundationSubjectId | CMASubjectId;

export const FINAL_SUBJECT_IDS: FinalSubjectId[] = ['FR', 'AFM', 'Audit', 'DT', 'IDT', 'IBS'];
export const INTERMEDIATE_SUBJECT_IDS: IntermediateSubjectId[] = ['AdvAcc', 'CorpLaw', 'Tax', 'Cost', 'AuditInter', 'FMSM'];
export const FOUNDATION_SUBJECT_IDS: FoundationSubjectId[] = ['Accounts', 'Law', 'MathStats', 'Econ'];

export const CMA_FOUNDATION_SUBJECT_IDS: CMAFoundationSubjectId[] = [
  'CMAFoundLaw',
  'CMAFoundAcc',
  'CMAFoundMath',
  'CMAFoundEcon',
];
export const CMA_INTERMEDIATE_SUBJECT_IDS: CMAIntermediateSubjectId[] = [
  'CMAInterLaw',
  'CMAInterFA',
  'CMAInterTax',
  'CMAInterCost',
  'CMAInterOMSM',
  'CMAInterCAA',
  'CMAInterFMDA',
  'CMAInterMA',
];
export const CMA_FINAL_SUBJECT_IDS: CMAFinalSubjectId[] = [
  'CMAFinalLaw',
  'CMAFinalSFM',
  'CMAFinalDT',
  'CMAFinalSCM',
  'CMAFinalCMA',
  'CMAFinalCFR',
  'CMAFinalIDT',
  'CMAFinalSPBV',
];

export const SUBJECT_COLORS: Record<SubjectId, { text: string; bg: string; border: string; glow: string; colorCode: string }> = {
  // CA Final (3 + 3 + SPOM)
  AFM: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  FR: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  Audit: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  DT: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  IDT: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  IBS: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
  // CA Intermediate (3 + 3)
  AdvAcc: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CorpLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  Tax: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  Cost: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  AuditInter: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  FMSM: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
  // CA Foundation (4)
  Accounts: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  Law: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  MathStats: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  Econ: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  // CMA Foundation (4 Papers: P1 - P4)
  CMAFoundLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAFoundAcc: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAFoundMath: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  CMAFoundEcon: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  // CMA Intermediate (4 + 4 Papers: P5 - P12)
  CMAInterLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAInterFA: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAInterTax: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  CMAInterCost: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  CMAInterOMSM: { text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', border: 'border-[#38BDF8]/20', glow: 'shadow-[#38BDF8]/10', colorCode: '#38BDF8' },
  CMAInterCAA: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  CMAInterFMDA: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
  CMAInterMA: { text: 'text-[#F472B6]', bg: 'bg-[#F472B6]/10', border: 'border-[#F472B6]/20', glow: 'shadow-[#F472B6]/10', colorCode: '#F472B6' },
  // CMA Final (4 + 4 Papers: P13 - P20)
  CMAFinalLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAFinalSFM: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  CMAFinalDT: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  CMAFinalSCM: { text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', border: 'border-[#38BDF8]/20', glow: 'shadow-[#38BDF8]/10', colorCode: '#38BDF8' },
  CMAFinalCMA: { text: 'text-[#F472B6]', bg: 'bg-[#F472B6]/10', border: 'border-[#F472B6]/20', glow: 'shadow-[#F472B6]/10', colorCode: '#F472B6' },
  CMAFinalCFR: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAFinalIDT: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  CMAFinalSPBV: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
};

export const SUBJECT_NAMES: Record<SubjectId, string> = {
  // CA Final
  AFM: 'Advanced Financial Management',
  FR: 'Financial Reporting',
  Audit: 'Auditing & Professional Ethics',
  DT: 'Direct Tax Laws',
  IDT: 'Indirect Tax Laws',
  IBS: 'Integrated Business Solutions',
  // CA Intermediate
  AdvAcc: 'Advanced Accounting',
  CorpLaw: 'Corporate and Other Laws',
  Tax: 'Taxation (Direct Tax & GST)',
  Cost: 'Cost and Management Accounting',
  AuditInter: 'Auditing and Ethics',
  FMSM: 'Financial Management & Strategic Management',
  // CA Foundation
  Accounts: 'Accounting',
  Law: 'Business Laws',
  MathStats: 'Quantitative Aptitude (Maths, LR & Stats)',
  Econ: 'Business Economics',
  // CMA Foundation (4 Papers)
  CMAFoundLaw: 'Fundamentals of Business Laws and Business Communication',
  CMAFoundAcc: 'Fundamentals of Financial and Cost Accounting',
  CMAFoundMath: 'Fundamentals of Business Mathematics and Statistics',
  CMAFoundEcon: 'Fundamentals of Business Economics and Management',
  // CMA Intermediate (4 + 4 Papers)
  CMAInterLaw: 'Business Laws and Ethics',
  CMAInterFA: 'Financial Accounting',
  CMAInterTax: 'Direct and Indirect Taxation',
  CMAInterCost: 'Cost Accounting',
  CMAInterOMSM: 'Operations Management and Strategic Management',
  CMAInterCAA: 'Corporate Accounting and Auditing',
  CMAInterFMDA: 'Financial Management and Business Data Analytics',
  CMAInterMA: 'Management Accounting',
  // CMA Final (4 + 4 Papers)
  CMAFinalLaw: 'Corporate and Economic Laws',
  CMAFinalSFM: 'Strategic Financial Management',
  CMAFinalDT: 'Direct Tax Laws and International Taxation',
  CMAFinalSCM: 'Strategic Cost Management',
  CMAFinalCMA: 'Cost and Management Audit',
  CMAFinalCFR: 'Corporate Financial Reporting',
  CMAFinalIDT: 'Indirect Tax Laws and Practice',
  CMAFinalSPBV: 'Strategic Performance Management and Business Valuation',
};

export interface BookmarkedSection {
  subjectId: SubjectId;
  number: string;
  heading: string;
  purpose: string;
}

export interface BookmarkedQuestion {
  questionId: string;
  subjectId: SubjectId;
  attempt: string;
  attemptLabel: string;
  questionNumber: string;
  marks: number;
  chapterName: string;
  topicTag: string;
  questionPreview: string;
  savedAt: string;
}

export type RevisionCycleKey = 'baseline' | 'rev1' | 'rev2' | 'rev3' | 'rev4' | 'rev5' | 'rev6' | 'rev1.5' | string;

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed' | 'unachieved';
  completed?: string;
  position?: number;
  priority?: 'High' | 'Medium' | 'Low';
  relevance?: 'General' | 'Revision' | 'Final Revision';
  subjectCode?: string;
  cleanTitle?: string;
  chapterName?: string;
  listId?: string;
  targetDurationMinutes?: number;
  duration?: number;
  taskDate?: string;
  revKey?: RevisionCycleKey;
  milestoneId?: string;
  phaseId?: string;
  activityType?: 'study' | 'mcq' | 'mock';
  skipRevisionSync?: boolean;
  clubGroupId?: string;
  clubTotalMinutes?: number;
  clubOrder?: number;
  clubAllocationBasis?: 'prior_logs' | 'best_judgment' | 'custom_adjusted';
  clubPriorLoggedMinutes?: number;
  caLevel?: CALevel;
}

export type SubjectTabId = 'blueprint' | 'references' | 'sections' | 'limits' | 'quiz' | 'theory' | 'formulas' | 'standards';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  fullName: string;
  chapters: string[];
  hasSections: boolean;
  hasLimits: boolean;
  hasFormulas?: boolean;
  hasStandards?: boolean;
  group?: 'Group I' | 'Group II' | 'Unified';
  paperNumber?: string;
  level?: CALevel;
}

export interface ChapterSummary {
  chapterName: string;
  keyPrinciples: {
    title: string;
    description: string; // concise exam-focused
    exception?: string; // statutory exceptions if any
    example?: string; // worked example if essential
  }[];
  visualBreakdown?: {
    title: string;
    type: 'flow' | 'table' | 'hierarchy';
    content?: string; // Markdown description, ascii graph or clean structure
    headers?: string[];
    rows?: string[][];
  };
}

export interface FormulaItem {
  chapterName: string;
  formulaName: string;
  equation: string;
  context: string; // One line context
  variables: { name: string; desc: string }[];
  workedExample?: {
    scenario: string;
    calculation: string;
    output: string;
  };
}

export interface RevisionVideoReference {
  id: string;
  subjectId: SubjectId;
  chapterName: string;
  facultyName: string;
  videoTitle: string;
  youtubeUrl: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  duration: string;
  tags?: string[];
  description?: string;
}

export interface StatutorySubsection {
  number: string;
  heading: string;
  purpose: string;
}

export interface StatutorySection {
  number: string;
  heading: string;
  purpose: string;
  subsections?: StatutorySubsection[];
}

export interface LimitRateItem {
  item: string;
  limitRate: string;
  remarks: string;
}

// Quiz structures
export type QuestionType = 'general' | 'case_sub';

export interface BaseQuestion {
  id: string;
  subjectId: SubjectId;
  chapterName: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number; // 0 to 3
  explanation: string;
}

export interface GeneralQuestion extends BaseQuestion {
  type?: 'general';
}

export interface CaseSubQuestion extends BaseQuestion {
  type?: 'case_sub';
}

export interface CaseScenario {
  id: string;
  subjectId: SubjectId;
  chapterName: string;
  scenarioTitle: string;
  scenarioText: string;
  subQuestions: CaseSubQuestion[];
}

// Unified Quiz Question type wrapper
export type QuizQuestionItem = 
  | { type: 'general'; data: GeneralQuestion }
  | { type: 'case'; data: CaseScenario };

// LocalStorage Tracking for Performance Dashboard
export interface PracticeAttempt {
  questionId: string;
  subjectId: SubjectId;
  chapterName: string;
  isCorrect: boolean;
  timestamp: string; // ISO String
}

export interface TestAttempt {
  id: string;
  subjectId: SubjectId;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  answers: { [questionId: string]: number }; // questionId -> selectedIndex
}

export interface FocusSession {
  id: string;
  duration: number; // in minutes
  subjectId: SubjectId;
  timestamp: string; // ISO String
  description?: string;
  sessionType?: 'work' | 'break' | 'routine';
  chapterName?: string;
  relevance?: 'General' | 'Revision' | 'Final Revision';
  revKey?: RevisionCycleKey;
}

export interface FlowTargetItem {
  id: string;
  taskId: string;
  title: string;
  cleanTitle?: string;
  subjectCode: SubjectId;
  chapterName?: string;
  relevance?: 'General' | 'Revision' | 'Final Revision';
  revKey?: RevisionCycleKey;
  dueDate?: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  completedAt?: string;
  allocatedMinutes?: number;
  duration?: number;
  targetDurationMinutes?: number;
  activityType?: 'study' | 'mcq' | 'mock';
  skipRevisionSync?: boolean;
  clubGroupId?: string;
  clubTotalMinutes?: number;
  clubOrder?: number;
  clubAllocationBasis?: 'prior_logs' | 'best_judgment' | 'custom_adjusted';
  clubPriorLoggedMinutes?: number;
}

// Flashcard Self-Assessed Confidence Rating Types
export type ConfidenceRatingValue = 1 | 2 | 3 | 4 | 5;

export interface FlashcardRating {
  cardId: string;
  subjectId: SubjectId;
  rating: ConfidenceRatingValue;
  conceptTitle?: string;
  category?: string;
  statutoryRef?: string;
  updatedAt: string;
}

export type PracticeTimeBudgetMode = 'icai_standard' | 'rapid_5m' | 'deep_15m';

// Scheduled On-Screen Timed Practice Mechanism Types
export interface ScheduledPracticeSlotConfig {
  id: 'slot_1' | 'slot_2';
  time: string; // HH:mm in 24-hour format (e.g., "13:00", "20:00")
  enabled: boolean;
}

export interface TriggeredPracticeHistoryEntry {
  sessionId: string;
  milestoneId: string;
  milestoneTitle?: string;
  subjectId: SubjectId;
  chapterName: string;
  questionId: string;
  monthKey: string; // YYYY-MM
  attemptKey: string;
  slotId?: 'slot_1' | 'slot_2' | 'manual';
  triggeredAt: string; // ISO timestamp
}

export interface PendingSnoozedPracticeNotification {
  session: ScheduledPracticeSessionRecord;
  snoozedAt: string; // ISO timestamp
  snoozeUntil: string; // ISO timestamp
  snoozeMinutes: number;
  slotId?: 'slot_1' | 'slot_2' | 'manual';
  dateStr: string; // YYYY-MM-DD
}

export interface ScheduledPracticePreference {
  preferred_practice_time: string; // Legacy / Slot 1 HH:mm
  scheduled_practice_enabled: boolean;
  scheduled_slots?: ScheduledPracticeSlotConfig[]; // Up to 2 execution slots per day
  snooze_default_minutes?: number;
  triggered_slots_by_date?: Record<string, string[]>; // { "YYYY-MM-DD": ["slot_1", "slot_2"] }
  last_practice_screen_date?: string; // YYYY-MM-DD
  practiced_question_ids?: string[]; // Deduplication across current attempt
  practiced_question_ids_by_attempt?: Record<string, string[]>;
  chapter_trigger_history?: TriggeredPracticeHistoryEntry[];
  pending_snooze?: PendingSnoozedPracticeNotification | null;
  time_budget_mode?: PracticeTimeBudgetMode;
}

export interface PracticeQuestionKeyConcept {
  keyword: string;
  category: 'Section' | 'Schedule' | 'Rule' | 'Provision' | 'Keyword' | string;
  description: string;
}

export interface SelectedPracticeQuestion {
  id: string;
  subjectId: SubjectId;
  subjectName: string;
  chapterName: string;
  title: string;
  difficulty: 'Moderate' | 'Advanced' | 'Mastery';
  marks: number;
  icaiExamRef: string;
  question: string;
  keyConcepts: PracticeQuestionKeyConcept[];
  shortSuggestedAnswer: string;
}

export interface ScheduledPracticeSessionRecord {
  id: string;
  triggeredAt: string; // ISO timestamp
  scheduledDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:mm
  slotId?: 'slot_1' | 'slot_2' | 'manual';
  milestoneId?: string;
  milestoneTitle?: string;
  attemptKey?: string;
  monthKey?: string;
  chapterCompletedAt?: string; // ISO timestamp of completed chapter target
  triggerType: 'scheduled' | 'manual_practice';
  sourceType: 'active_milestone_completed_target' | 'completed_tasks' | 'active_milestones' | 'syllabus_fallback';
  matchedTaskTitles: string[];
  matchedChapters: { subjectId: SubjectId; chapterName: string }[];
  question: SelectedPracticeQuestion;
  allocatedSeconds: number;
  elapsedSeconds: number;
  status: 'active' | 'completed' | 'dismissed' | 'snoozed';
  completedAt?: string;
  draftAnswer?: string;
  selfAssessedMastered?: boolean;
}




