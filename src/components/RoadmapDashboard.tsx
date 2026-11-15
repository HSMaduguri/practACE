import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Flag, Target, CheckCircle2, Clock, Sparkles, Plus, 
  Trash2, AlertTriangle, TrendingUp, Award, Zap, BookOpen, Layers, 
  Check, ArrowRight, CheckSquare, Square, X, PanelRightClose, 
  PanelRightOpen, Compass, MapPin, ChevronLeft, ChevronRight, Edit3,
  CalendarDays, ListTodo, Star, Play, Trophy, Rocket, Hourglass,
  Maximize2, Minimize2, Search, Sliders, FileText,
  RotateCcw, Lock, Palette
} from 'lucide-react';
import { SubjectId, GoogleTask } from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { getLevelSubjectIds, getLevelConfig } from '../data/curriculumLevels';
import {
  useCALevel,
  getLevelScopedKey,
  getClockSlotsStorageKey,
  getFirestoreRoadmapDocId,
  getFirestoreAutoStudyPlanDocId,
  getFirestoreRevisionDocId,
  getFirestoreTasksCollectionName
} from '../utils/levelStorage';
import { ModalPortal } from './ModalPortal';
import { auth, db } from '../lib/firebase';
import { doc as firestoreDoc, getDoc, setDoc } from 'firebase/firestore';
import {
  useTargetSystemSync,
  syncTaskCompletionAcrossAllLinks,
  isTaskCompletedInStorage,
  resolveExactOrBestChapterMatch,
  normalizeKey,
  getTaskCompositeKey,
  saveToCompletedRegistry,
  autoCompleteFinalExamMilestonesAfter5PM,
  getPostExamLockedSubjectsMap,
  isSubjectLockedAfterFinalExam,
  toggleFinalSprintMilestoneCompletion
} from '../utils/taskCompletionSync';
import { ConfettiOverlay, triggerFinalRevisionConfetti } from './ConfettiOverlay';
import { getCanonicalChapterKey, SUBJECT_CHAPTERS } from './RevisionPlanner';
import { TargetClockSlot } from './Target24HourClock';
import { isLmrModeCurrentlyOn, resolveActiveExamSchedule } from './LmrSprintBoard';
import AutomatedStudyPlannerWorkbench from './AutomatedStudyPlannerWorkbench';
import {
  StudyPhaseId,
  MilestoneCompletionCondition,
  AutomatedStudyPlanConfig,
  ChapterPlanInput,
  GeneratedMilestoneItem,
  PhaseReviewRecord,
  PHASE_LABELS,
  getDefaultAutomatedPlanConfig,
  loadOrInitializeChapterPlanInputs,
  getPlannedPhasesList,
  STORAGE_KEY_AUTO_PLAN_CONFIG,
  STORAGE_KEY_CHAPTER_PLAN_INPUTS
} from '../utils/automatedStudyPlannerEngine';

const IBS_DEFAULT_CHAPTERS = [
  'Financial Reporting',
  'Advanced Financial Management',
  'Auditing',
  'Direct Taxes',
  'Indirect Taxes',
  'Corporate & Economic Laws',
  'SCMPE',
  'Case Scenarios'
];

export function getMilestoneSubjectChapters(subId: SubjectId): string[] {
  const chaps = SUBJECTS_METADATA[subId]?.chapters || [];
  if (chaps.length > 0) return chaps;
  if (subId === 'IBS') return IBS_DEFAULT_CHAPTERS;
  return [];
}

export interface UserCheckpoint {
  id: string;
  subjectId: SubjectId | 'CUSTOM';
  customTitle?: string;
  phaseId?: StudyPhaseId | 'mock';
  revisionCycle: 'Baseline Study' | '1st Revision' | '2nd Revision' | '3rd Revision' | 'Final Sprint' | 'Mock Exam' | 'Custom';
  startDate?: string;
  targetDate: string; // YYYY-MM-DD
  targetChapters?: number;
  selectedChapters?: string[];
  selectedSubjectChapters?: { subjectId: SubjectId; chapter: string }[];
  completedChapters?: string[];
  completed?: boolean;
  allocatedHoursTotal?: number;
  completionCondition?: MilestoneCompletionCondition;
  mockTestCompleted?: boolean;
  mockScoreObtained?: number;
  mockMaxMarks?: number;
  notes?: string;
}

interface RoadmapDashboardProps {
  tasks: GoogleTask[];
  onOpenAddTargetModal: (subject?: SubjectId, chapter?: string) => void;
  onSelectDate: (date: string) => void;
  onNavigateToDailyView: () => void;
  onNavigateToWeeklyView?: () => void;
  onToggleTaskCompleted?: (task: GoogleTask, forceExecute?: boolean, targetStatus?: 'completed' | 'needsAction') => void;
  onQuickSelectMilestone?: (checkpoint: UserCheckpoint) => void;
  onApplyGeneratedTasks?: (mergedTasks: GoogleTask[]) => void;
}

const SUBJECT_THEMES: Record<SubjectId | 'CUSTOM', { 
  color: string;
  badge: string;
  ring: string;
  text: string;
  bgGrad: string;
}> = {
  Accounts: {
    color: '#a855f7',
    badge: 'bg-purple-950 text-purple-300 border-purple-600',
    ring: 'ring-purple-500/50',
    text: 'text-purple-300',
    bgGrad: 'from-purple-500 to-indigo-600'
  },
  Law: {
    color: '#0ea5e9',
    badge: 'bg-sky-950 text-sky-300 border-sky-600',
    ring: 'ring-sky-500/50',
    text: 'text-sky-300',
    bgGrad: 'from-sky-500 to-blue-600'
  },
  MathStats: {
    color: '#f59e0b',
    badge: 'bg-amber-950 text-amber-300 border-amber-600',
    ring: 'ring-amber-500/50',
    text: 'text-amber-300',
    bgGrad: 'from-amber-500 to-orange-600'
  },
  Econ: {
    color: '#10b981',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-600',
    ring: 'ring-emerald-500/50',
    text: 'text-emerald-300',
    bgGrad: 'from-emerald-500 to-teal-600'
  },
  AdvAcc: {
    color: '#a855f7',
    badge: 'bg-purple-950 text-purple-300 border-purple-600',
    ring: 'ring-purple-500/50',
    text: 'text-purple-300',
    bgGrad: 'from-purple-500 to-indigo-600'
  },
  CorpLaw: {
    color: '#0ea5e9',
    badge: 'bg-sky-950 text-sky-300 border-sky-600',
    ring: 'ring-sky-500/50',
    text: 'text-sky-300',
    bgGrad: 'from-sky-500 to-blue-600'
  },
  Tax: {
    color: '#10b981',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-600',
    ring: 'ring-emerald-500/50',
    text: 'text-emerald-300',
    bgGrad: 'from-emerald-500 to-teal-600'
  },
  Cost: {
    color: '#f59e0b',
    badge: 'bg-amber-950 text-amber-300 border-amber-600',
    ring: 'ring-amber-500/50',
    text: 'text-amber-300',
    bgGrad: 'from-amber-500 to-orange-600'
  },
  AuditInter: {
    color: '#ec4899',
    badge: 'bg-pink-950 text-pink-300 border-pink-600',
    ring: 'ring-pink-500/50',
    text: 'text-pink-300',
    bgGrad: 'from-pink-500 to-rose-600'
  },
  FMSM: {
    color: '#6366f1',
    badge: 'bg-indigo-950 text-indigo-300 border-indigo-600',
    ring: 'ring-indigo-500/50',
    text: 'text-indigo-300',
    bgGrad: 'from-indigo-500 to-violet-600'
  },
  FR: { 
    color: '#a855f7',
    badge: 'bg-purple-950 text-purple-300 border-purple-600',
    ring: 'ring-purple-500/50',
    text: 'text-purple-300',
    bgGrad: 'from-purple-500 to-indigo-600'
  },
  AFM: { 
    color: '#0ea5e9',
    badge: 'bg-sky-950 text-sky-300 border-sky-600',
    ring: 'ring-sky-500/50',
    text: 'text-sky-300',
    bgGrad: 'from-sky-500 to-blue-600'
  },
  Audit: { 
    color: '#f59e0b',
    badge: 'bg-amber-950 text-amber-300 border-amber-600',
    ring: 'ring-amber-500/50',
    text: 'text-amber-300',
    bgGrad: 'from-amber-500 to-orange-600'
  },
  DT: { 
    color: '#10b981',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-600',
    ring: 'ring-emerald-500/50',
    text: 'text-emerald-300',
    bgGrad: 'from-emerald-500 to-teal-600'
  },
  IDT: { 
    color: '#ec4899',
    badge: 'bg-pink-950 text-pink-300 border-pink-600',
    ring: 'ring-pink-500/50',
    text: 'text-pink-300',
    bgGrad: 'from-pink-500 to-rose-600'
  },
  IBS: { 
    color: '#6366f1',
    badge: 'bg-indigo-950 text-indigo-300 border-indigo-600',
    ring: 'ring-indigo-500/50',
    text: 'text-indigo-300',
    bgGrad: 'from-indigo-500 to-violet-600'
  },
  // CMA Foundation (4 Papers)
  CMAFoundLaw: { color: '#a855f7', badge: 'bg-purple-950 text-purple-300 border-purple-600', ring: 'ring-purple-500/50', text: 'text-purple-300', bgGrad: 'from-purple-500 to-indigo-600' },
  CMAFoundAcc: { color: '#0ea5e9', badge: 'bg-sky-950 text-sky-300 border-sky-600', ring: 'ring-sky-500/50', text: 'text-sky-300', bgGrad: 'from-sky-500 to-blue-600' },
  CMAFoundMath: { color: '#f59e0b', badge: 'bg-amber-950 text-amber-300 border-amber-600', ring: 'ring-amber-500/50', text: 'text-amber-300', bgGrad: 'from-amber-500 to-orange-600' },
  CMAFoundEcon: { color: '#10b981', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600', ring: 'ring-emerald-500/50', text: 'text-emerald-300', bgGrad: 'from-emerald-500 to-teal-600' },
  // CMA Intermediate (4+4 = 8 Papers)
  CMAInterLaw: { color: '#a855f7', badge: 'bg-purple-950 text-purple-300 border-purple-600', ring: 'ring-purple-500/50', text: 'text-purple-300', bgGrad: 'from-purple-500 to-indigo-600' },
  CMAInterFA: { color: '#0ea5e9', badge: 'bg-sky-950 text-sky-300 border-sky-600', ring: 'ring-sky-500/50', text: 'text-sky-300', bgGrad: 'from-sky-500 to-blue-600' },
  CMAInterTax: { color: '#f59e0b', badge: 'bg-amber-950 text-amber-300 border-amber-600', ring: 'ring-amber-500/50', text: 'text-amber-300', bgGrad: 'from-amber-500 to-orange-600' },
  CMAInterCost: { color: '#10b981', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600', ring: 'ring-emerald-500/50', text: 'text-emerald-300', bgGrad: 'from-emerald-500 to-teal-600' },
  CMAInterOMSM: { color: '#ec4899', badge: 'bg-pink-950 text-pink-300 border-pink-600', ring: 'ring-pink-500/50', text: 'text-pink-300', bgGrad: 'from-pink-500 to-rose-600' },
  CMAInterCAA: { color: '#6366f1', badge: 'bg-indigo-950 text-indigo-300 border-indigo-600', ring: 'ring-indigo-500/50', text: 'text-indigo-300', bgGrad: 'from-indigo-500 to-violet-600' },
  CMAInterFMDA: { color: '#0ea5e9', badge: 'bg-sky-950 text-sky-300 border-sky-600', ring: 'ring-sky-500/50', text: 'text-sky-300', bgGrad: 'from-sky-500 to-blue-600' },
  CMAInterMA: { color: '#10b981', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600', ring: 'ring-emerald-500/50', text: 'text-emerald-300', bgGrad: 'from-emerald-500 to-teal-600' },
  // CMA Final (4+4 = 8 Papers)
  CMAFinalLaw: { color: '#a855f7', badge: 'bg-purple-950 text-purple-300 border-purple-600', ring: 'ring-purple-500/50', text: 'text-purple-300', bgGrad: 'from-purple-500 to-indigo-600' },
  CMAFinalSFM: { color: '#0ea5e9', badge: 'bg-sky-950 text-sky-300 border-sky-600', ring: 'ring-sky-500/50', text: 'text-sky-300', bgGrad: 'from-sky-500 to-blue-600' },
  CMAFinalDT: { color: '#f59e0b', badge: 'bg-amber-950 text-amber-300 border-amber-600', ring: 'ring-amber-500/50', text: 'text-amber-300', bgGrad: 'from-amber-500 to-orange-600' },
  CMAFinalSCM: { color: '#10b981', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600', ring: 'ring-emerald-500/50', text: 'text-emerald-300', bgGrad: 'from-emerald-500 to-teal-600' },
  CMAFinalCMA: { color: '#ec4899', badge: 'bg-pink-950 text-pink-300 border-pink-600', ring: 'ring-pink-500/50', text: 'text-pink-300', bgGrad: 'from-pink-500 to-rose-600' },
  CMAFinalCFR: { color: '#6366f1', badge: 'bg-indigo-950 text-indigo-300 border-indigo-600', ring: 'ring-indigo-500/50', text: 'text-indigo-300', bgGrad: 'from-indigo-500 to-violet-600' },
  CMAFinalIDT: { color: '#f59e0b', badge: 'bg-amber-950 text-amber-300 border-amber-600', ring: 'ring-amber-500/50', text: 'text-amber-300', bgGrad: 'from-amber-500 to-orange-600' },
  CMAFinalSPBV: { color: '#10b981', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600', ring: 'ring-emerald-500/50', text: 'text-emerald-300', bgGrad: 'from-emerald-500 to-teal-600' },
  CUSTOM: {
    color: '#14b8a6',
    badge: 'bg-teal-950 text-teal-300 border-teal-600',
    ring: 'ring-teal-500/50',
    text: 'text-teal-300',
    bgGrad: 'from-teal-500 to-emerald-600'
  }
};

const SUBJECT_FULL_NAMES: Record<SubjectId, string> = {
  Accounts: 'Accounting (Paper 1)',
  Law: 'Business Laws (Paper 2)',
  MathStats: 'Quantitative Aptitude (Paper 3)',
  Econ: 'Business Economics (Paper 4)',
  AdvAcc: 'Advanced Accounting (Paper 1)',
  CorpLaw: 'Corporate & Other Laws (Paper 2)',
  Tax: 'Taxation — DT & GST (Paper 3)',
  Cost: 'Cost & Management Accounting (Paper 4)',
  AuditInter: 'Auditing & Ethics (Paper 5)',
  FMSM: 'Financial & Strategic Mgmt (Paper 6)',
  FR: 'Financial Reporting (Paper 1)',
  AFM: 'Advanced Financial Management (Paper 2)',
  Audit: 'Auditing & Professional Ethics (Paper 3)',
  DT: 'Direct Tax & International Tax (Paper 4)',
  IDT: 'Indirect Tax Laws (Paper 5)',
  IBS: 'Integrated Business Solutions (Paper 6)',
  CMAFoundLaw: 'Business Laws & Business Communication (Paper 1)',
  CMAFoundAcc: 'Financial & Cost Accounting (Paper 2)',
  CMAFoundMath: 'Business Mathematics & Statistics (Paper 3)',
  CMAFoundEcon: 'Business Economics & Management (Paper 4)',
  CMAInterLaw: 'Business Laws & Ethics (Paper 5)',
  CMAInterFA: 'Financial Accounting (Paper 6)',
  CMAInterTax: 'Direct & Indirect Taxation (Paper 7)',
  CMAInterCost: 'Cost Accounting (Paper 8)',
  CMAInterOMSM: 'Operations Mgmt & Strategic Mgmt (Paper 9)',
  CMAInterCAA: 'Corporate Accounting & Auditing (Paper 10)',
  CMAInterFMDA: 'Financial Mgmt & Business Data Analytics (Paper 11)',
  CMAInterMA: 'Management Accounting (Paper 12)',
  CMAFinalLaw: 'Corporate & Economic Laws (Paper 13)',
  CMAFinalSFM: 'Strategic Financial Management (Paper 14)',
  CMAFinalDT: 'Direct Tax Laws & International Taxation (Paper 15)',
  CMAFinalSCM: 'Strategic Cost Management (Paper 16)',
  CMAFinalCMA: 'Cost & Management Audit (Paper 17)',
  CMAFinalCFR: 'Corporate Financial Reporting (Paper 18)',
  CMAFinalIDT: 'Indirect Tax Laws & Practice (Paper 19)',
  CMAFinalSPBV: 'Strategic Performance Mgmt & Business Valuation (Paper 20)'
};

const BASE_STORAGE_KEY_CHECKPOINTS = 'practca_roadmap_user_checkpoints';
const BASE_STORAGE_KEY_DATES = 'practca_roadmap_master_dates';
const BASE_STORAGE_KEY_EXAM_DATE = 'practca_exam_date';

interface SegmentReport {
  id: string;
  fromLabel: string;
  toLabel: string;
  fromDate: string;
  toDate: string;
  checkpoint?: UserCheckpoint;
  days: {
    dateStr: string;
    dayNum: number;
    hasCompleted: boolean;
    hasTasks: boolean;
    tasksCount: number;
    completedCount: number;
    topics: string[];
    isToday: boolean;
    isPast: boolean;
  }[];
}

interface MapNodePosition {
  type: 'start' | 'checkpoint' | 'end';
  id: string;
  label: string;
  subLabel: string;
  dateStr: string;
  idx?: number;
  checkpoint?: UserCheckpoint;
  x: number;
  y: number;
  row: number;
}

interface SelectedDotDetail {
  dateStr: string;
  dayNum: number;
  segmentIndex: number;
  fromLabel: string;
  toLabel: string;
  fromDate: string;
  toDate: string;
  topics: string[];
  completedCount: number;
  tasksCount: number;
  isToday: boolean;
  isPast: boolean;
  hasCompleted: boolean;
  segmentCompletedDays: number;
  segmentTotalDays: number;
  segmentDays: SegmentReport['days'];
}

export default function RoadmapDashboard({
  tasks,
  onOpenAddTargetModal,
  onSelectDate,
  onNavigateToDailyView,
  onNavigateToWeeklyView,
  onToggleTaskCompleted,
  onQuickSelectMilestone,
  onApplyGeneratedTasks
}: RoadmapDashboardProps) {
  const caLevel = useCALevel();
  const levelSubjects = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);
  const levelShortName = getLevelConfig(caLevel).shortName;
  const STORAGE_KEY_CHECKPOINTS = getLevelScopedKey(BASE_STORAGE_KEY_CHECKPOINTS, caLevel);
  const STORAGE_KEY_DATES = getLevelScopedKey(BASE_STORAGE_KEY_DATES, caLevel);
  const STORAGE_KEY_EXAM_DATE = getLevelScopedKey(BASE_STORAGE_KEY_EXAM_DATE, caLevel);

  const [quickSelectedCpId, setQuickSelectedCpId] = useState<string | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<
    'route_map' | 'tabular_ledger' | 'auto_planner' | 'icai_matrix'
  >('route_map');
  const [planApplyBanner, setPlanApplyBanner] = useState<string | null>(null);
  const [milestoneToDelete, setMilestoneToDelete] = useState<UserCheckpoint | null>(null);
  const [undoBannerInfo, setUndoBannerInfo] = useState<{
    message: string;
    action?: {
      label: string;
      checkpointId: string;
      chapterName: string;
    } | null;
  } | null>(null);

  useEffect(() => {
    if (!undoBannerInfo) return;
    const timer = setTimeout(() => {
      setUndoBannerInfo(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [undoBannerInfo]);

  const [, setForceUpdate] = useState<number>(0);

  const handleTriggerQuickSelect = (cp: UserCheckpoint) => {
    if (onQuickSelectMilestone) {
      onQuickSelectMilestone(cp);
    } else {
      window.dispatchEvent(new CustomEvent('practca_quick_select_milestone', { detail: { checkpoint: cp } }));
    }
    setQuickSelectedCpId(cp.id);
    setTimeout(() => {
      setQuickSelectedCpId(prev => (prev === cp.id ? null : prev));
    }, 2200);
  };
  // Master Start Date
  const [prepStartDate, setPrepStartDate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.prepStartDate) return parsed.prepStartDate;
      }
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
  });

  // Master Exam Date - Synchronized with App's global exam countdown
  const [examDate, setExamDate] = useState<string>(() => {
    try {
      const globalExam = localStorage.getItem(STORAGE_KEY_EXAM_DATE);
      if (globalExam) return globalExam;
      const stored = localStorage.getItem(STORAGE_KEY_DATES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.examDate) return parsed.examDate;
      }
    } catch (e) {}
    return '2026-11-01'; // Default Nov 1, 2026 CA Exam
  });

  // Automated Study Plan Configuration & Chapter Inputs
  const [autoPlanConfig, setAutoPlanConfig] = useState<AutomatedStudyPlanConfig>(() =>
    getDefaultAutomatedPlanConfig(prepStartDate, examDate, caLevel)
  );
  const [chapterPlanInputs, setChapterPlanInputs] = useState<ChapterPlanInput[]>(() =>
    loadOrInitializeChapterPlanInputs(caLevel)
  );

  // Sync prepStartDate and examDate into autoPlanConfig
  useEffect(() => {
    setAutoPlanConfig(prev => ({
      ...prev,
      prepStartDate,
      examDate
    }));
  }, [prepStartDate, examDate]);

  useEffect(() => {
    const syncChapterInputs = () => {
      setChapterPlanInputs(loadOrInitializeChapterPlanInputs(caLevel));
    };
    window.addEventListener('practca_abc_matrix_updated', syncChapterInputs);
    return () => window.removeEventListener('practca_abc_matrix_updated', syncChapterInputs);
  }, [caLevel]);

  // Live Exam Countdown Calculation
  const examCountdown = useMemo(() => {
    try {
      const targetTime = new Date(examDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetTime - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      return { days, hours, isPast: diff === 0 };
    } catch (e) {
      return { days: 0, hours: 0, isPast: true };
    }
  }, [examDate]);

  // Helper to disintegrate duplicate/overlapping same-subject milestones & strip leaked completions
  const disintegrateAndSanitizeSameSubjectMilestones = (
    rawList: UserCheckpoint[],
    options?: { forcePartitionSameCycle?: boolean; stripLeakedCompletions?: boolean }
  ): { updated: UserCheckpoint[]; changed: boolean } => {
    if (!Array.isArray(rawList) || rawList.length <= 1) {
      return { updated: Array.isArray(rawList) ? rawList : [], changed: false };
    }

    let changed = false;
    const cloned: UserCheckpoint[] = rawList.map(cp => ({
      ...cp,
      selectedChapters: Array.isArray(cp.selectedChapters) ? [...cp.selectedChapters] : undefined,
      completedChapters: Array.isArray(cp.completedChapters) ? [...cp.completedChapters] : []
    }));

    // Group non-custom milestones by subjectId sorted chronologically
    const bySub = new Map<string, UserCheckpoint[]>();
    cloned.forEach(cp => {
      if (!cp.subjectId || cp.subjectId === 'CUSTOM') return;
      const key = cp.subjectId;
      if (!bySub.has(key)) bySub.set(key, []);
      bySub.get(key)!.push(cp);
    });

    bySub.forEach((subGroup, subKey) => {
      if (subGroup.length <= 1) return;
      subGroup.sort((a, b) => String(a.targetDate || '').localeCompare(String(b.targetDate || '')));
      const fullSubChaps = getMilestoneSubjectChapters(subKey as SubjectId);
      if (fullSubChaps.length === 0) return;

      // 1. Group by revisionCycle (excluding Mock Exam) to disintegrate duplicate full-subject milestones in the same cycle
      const byCycle = new Map<string, UserCheckpoint[]>();
      subGroup.forEach(cp => {
        if (cp.revisionCycle === 'Mock Exam') return;
        const cKey = cp.revisionCycle || '1st Revision';
        if (!byCycle.has(cKey)) byCycle.set(cKey, []);
        byCycle.get(cKey)!.push(cp);
      });

      byCycle.forEach((cycleGroup) => {
        if (cycleGroup.length <= 1) return;

        const allHaveFullSyllabus = cycleGroup.every(cp => {
          const chaps = (cp.selectedChapters && cp.selectedChapters.length > 0) ? cp.selectedChapters : fullSubChaps;
          return chaps.length >= fullSubChaps.length;
        });

        if (allHaveFullSyllabus || options?.forcePartitionSameCycle) {
          // Partition fullSubChaps into K sequential non-overlapping chunks across cycleGroup
          const k = cycleGroup.length;
          const chunkSize = Math.ceil(fullSubChaps.length / k);
          cycleGroup.forEach((cp, idx) => {
            const slice = fullSubChaps.slice(idx * chunkSize, (idx + 1) * chunkSize);
            if (slice.length > 0) {
              const prevSelected = cp.selectedChapters || [];
              if (JSON.stringify(prevSelected) !== JSON.stringify(slice)) {
                cp.selectedChapters = slice;
                cp.targetChapters = slice.length;
                if (!cp.customTitle || cp.customTitle === subKey || cp.customTitle === SUBJECT_FULL_NAMES[subKey as SubjectId]) {
                  cp.customTitle = `${subKey} • Part ${idx + 1}/${k}`;
                }
                changed = true;
              }
              const allowedSet = new Set(slice);
              const filteredDone = (cp.completedChapters || []).filter(ch => allowedSet.has(ch));
              if (filteredDone.length !== (cp.completedChapters || []).length) {
                cp.completedChapters = filteredDone;
                changed = true;
              }
            }
          });
        } else {
          // If earlier milestones in the same cycle have specific chapters selected, remove those chapters from subsequent full-syllabus milestones in the same cycle
          const allocatedSoFar = new Set<string>();
          cycleGroup.forEach((cp, idx) => {
            const chaps = (cp.selectedChapters && cp.selectedChapters.length > 0) ? cp.selectedChapters : fullSubChaps;
            if (idx > 0 && chaps.length >= fullSubChaps.length && allocatedSoFar.size > 0 && allocatedSoFar.size < fullSubChaps.length) {
              const remaining = fullSubChaps.filter(ch => !allocatedSoFar.has(ch));
              if (remaining.length > 0) {
                cp.selectedChapters = remaining;
                cp.targetChapters = remaining.length;
                const allowedSet = new Set(remaining);
                cp.completedChapters = (cp.completedChapters || []).filter(ch => allowedSet.has(ch));
                changed = true;
              }
            }
            (cp.selectedChapters || fullSubChaps).forEach(ch => allocatedSoFar.add(ch));
          });
        }
      });

      // 2. Strip leaked completions on subsequent milestones of the same subject
      if (options?.stripLeakedCompletions) {
        for (let i = 1; i < subGroup.length; i++) {
          const currCp = subGroup[i];
          const prevCp = subGroup[i - 1];
          const currDone = currCp.completedChapters || [];
          if (currDone.length === 0) continue;

          // Collect all chapters marked done in any earlier milestone of the same subject
          const earlierDoneSet = new Set<string>();
          for (let j = 0; j < i; j++) {
            (subGroup[j].completedChapters || []).forEach(ch => earlierDoneSet.add(ch));
          }

          if (earlierDoneSet.size > 0) {
            const filteredCurrDone = currDone.filter(ch => {
              if (!earlierDoneSet.has(ch)) return true;
              // Keep only if there is an explicitly completed task for currCp.id or completed strictly within currCp's date window
              const hasExplicitTaskForCurr = tasks.some(t => {
                const isDone = t.status === 'completed' || Boolean(t.completed);
                if (!isDone) return false;
                const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
                if (tMsId) return tMsId === currCp.id && (t.chapterName === ch || t.cleanTitle === ch);
                const tDate = (t.due || t.taskDate || '').split('T')[0];
                return Boolean(
                  tDate &&
                  tDate > prevCp.targetDate &&
                  tDate <= currCp.targetDate &&
                  t.subjectCode === currCp.subjectId &&
                  (t.chapterName === ch || t.cleanTitle === ch)
                );
              });
              return hasExplicitTaskForCurr;
            });

            if (filteredCurrDone.length !== currDone.length) {
              currCp.completedChapters = filteredCurrDone;
              changed = true;
            }
          }
        }
      }
    });

    return { updated: cloned, changed };
  };

  // User Checkpoints: Initially EMPTY (User adds checkpoints themselves or generates via Auto-Plan!)
  const [checkpoints, setCheckpoints] = useState<UserCheckpoint[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHECKPOINTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const migKey = getLevelScopedKey('practca_milestone_disintegration_v2_clean', caLevel);
          const migDone = localStorage.getItem(migKey) === 'true';
          const { updated, changed } = disintegrateAndSanitizeSameSubjectMilestones(parsed, {
            forcePartitionSameCycle: false,
            stripLeakedCompletions: !migDone
          });
          if (!migDone) {
            localStorage.setItem(migKey, 'true');
          }
          if (changed) {
            localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updated));
          }
          return updated;
        }
      }
    } catch (e) {}
    return [];
  });

  // Modals & Panels State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAllCheckpointsModal, setShowAllCheckpointsModal] = useState<boolean>(false);
  const [selectedMilestoneDot, setSelectedMilestoneDot] = useState<SelectedDotDetail | null>(null);
  const [isExpandedViewOpen, setIsExpandedViewOpen] = useState<boolean>(false);
  // Action confirmation modal when milestone test completed but targets pending
  const [milestoneTestPendingModal, setMilestoneTestPendingModal] = useState<{
    checkpoint: UserCheckpoint;
    pendingTasks: any[];
    pendingChapters: string[];
  } | null>(null);

  // Time slot scheduling modal when Mock Test criteria is opted
  const [mockSlotScheduleModal, setMockSlotScheduleModal] = useState<{
    checkpoint: UserCheckpoint;
    dateStr: string;
    startTime: string;
    endTime: string;
    title: string;
  } | null>(null);

  // Close expanded view on Escape key & listen for external trigger
  useEffect(() => {
    const handleOpenExpanded = () => setIsExpandedViewOpen(true);
    window.addEventListener('practca_open_roadmap_expanded', handleOpenExpanded);
    return () => window.removeEventListener('practca_open_roadmap_expanded', handleOpenExpanded);
  }, []);

  const examScheduleInfo = useMemo(() => {
    return resolveActiveExamSchedule(examDate);
  }, [examDate, checkpoints]);

  useEffect(() => {
    if (!isExpandedViewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpandedViewOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpandedViewOpen]);

  const [newSubject, setNewSubject] = useState<SubjectId | 'CUSTOM'>(() => levelSubjects[0] || 'FR');
  const [newCustomTitle, setNewCustomTitle] = useState<string>('');
  const [newCycle, setNewCycle] = useState<UserCheckpoint['revisionCycle']>('1st Revision');
  const [newStartDate, setNewStartDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [newTargetDate, setNewTargetDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [newNotes, setNewNotes] = useState<string>('');
  const [newCompletionCondition, setNewCompletionCondition] = useState<MilestoneCompletionCondition>('targets_only');
  const [newSelectedChapters, setNewSelectedChapters] = useState<string[]>(() => getMilestoneSubjectChapters(levelSubjects[0] || 'FR'));
  const [newCustomSubjectTab, setNewCustomSubjectTab] = useState<SubjectId>(() => levelSubjects[0] || 'FR');
  const [newChapterSearch, setNewChapterSearch] = useState<string>('');
  const [isEditingCheckpointChapters, setIsEditingCheckpointChapters] = useState<boolean>(false);
  const [editChapterSearch, setEditChapterSearch] = useState<string>('');

  // Reload level-scoped roadmap data when CA level switches
  useEffect(() => {
    isApplyingExternalSyncRef.current = true;
    const defaultSub = levelSubjects[0] || 'FR';
    setNewSubject(defaultSub);
    setNewCustomSubjectTab(defaultSub);
    setNewSelectedChapters(getMilestoneSubjectChapters(defaultSub));
    setSelectedCheckpoint(null);
    setExpandedSegment(null);

    let nextStart = new Date().toISOString().split('T')[0];
    let nextExam = '2026-11-01';
    try {
      const storedDates = localStorage.getItem(STORAGE_KEY_DATES);
      if (storedDates) {
        const parsed = JSON.parse(storedDates);
        if (parsed.prepStartDate) nextStart = parsed.prepStartDate;
        if (parsed.examDate) nextExam = parsed.examDate;
      }
      const globalExam = localStorage.getItem(STORAGE_KEY_EXAM_DATE);
      if (globalExam) nextExam = globalExam;
    } catch {}
    setPrepStartDate(nextStart);
    setExamDate(nextExam);

    try {
      const storedCp = localStorage.getItem(STORAGE_KEY_CHECKPOINTS);
      const parsedCp = storedCp ? JSON.parse(storedCp) : [];
      setCheckpoints(Array.isArray(parsedCp) ? parsedCp : []);
    } catch {
      setCheckpoints([]);
    }

    setAutoPlanConfig(getDefaultAutomatedPlanConfig(nextStart, nextExam, caLevel));
    setChapterPlanInputs(loadOrInitializeChapterPlanInputs(caLevel));
    setIsLmrMode(isLmrModeCurrentlyOn(caLevel));

    setTimeout(() => {
      isApplyingExternalSyncRef.current = false;
    }, 60);
  }, [caLevel, STORAGE_KEY_CHECKPOINTS, STORAGE_KEY_DATES, STORAGE_KEY_EXAM_DATE, levelSubjects]);

  // Compute remaining unallocated chapters for a subject + revisionCycle to support automatic milestone disintegration
  const getUnallocatedChaptersForSubjectCycle = (sub: SubjectId, cycle: UserCheckpoint['revisionCycle']): string[] => {
    const allChaps = getMilestoneSubjectChapters(sub);
    const existingSameSubCycle = checkpoints.filter(cp => cp.subjectId === sub && cp.revisionCycle === cycle);
    if (existingSameSubCycle.length === 0) return allChaps;
    const allocated = new Set<string>();
    existingSameSubCycle.forEach(cp => {
      (cp.selectedChapters || []).forEach(ch => allocated.add(ch));
    });
    const remaining = allChaps.filter(ch => !allocated.has(ch));
    return remaining.length > 0 ? remaining : allChaps;
  };

  // Update default selected chapters when subject changes in Add Checkpoint modal
  const handleSubjectChangeInModal = (sub: SubjectId | 'CUSTOM', cycleOverride?: UserCheckpoint['revisionCycle']) => {
    const effectiveCycle = cycleOverride || newCycle;
    setNewSubject(sub);
    setNewChapterSearch('');
    if (sub !== 'CUSTOM') {
      setNewSelectedChapters(getUnallocatedChaptersForSubjectCycle(sub, effectiveCycle));
    } else {
      setNewSelectedChapters([]);
    }
  };

  // Expand & Inspect drawer for segment day-by-day
  const [expandedSegment, setExpandedSegment] = useState<SegmentReport | null>(null);

  // Selected Checkpoint for inspection & editing
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<UserCheckpoint | null>(null);

  // Tooltip for small date dots
  const [hoveredDot, setHoveredDot] = useState<{
    x: number;
    y: number;
    dateStr: string;
    topics: string[];
    completedCount: number;
    totalCount: number;
  } | null>(null);

  // Sideline Daily Board
  const [isSidelineOpen, setIsSidelineOpen] = useState<boolean>(false);
  const [sidelineDate, setSidelineDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const hasInitialScrolledRef = useRef<boolean>(false);

  const isApplyingExternalSyncRef = useRef<boolean>(false);
  const isInternalDispatchRef = useRef<boolean>(false);
  const { syncVersion } = useTargetSystemSync({
    onSyncComplete: (snapshot) => {
      if (isInternalDispatchRef.current) return;
      if (Array.isArray(snapshot.roadmapCheckpoints)) {
        isApplyingExternalSyncRef.current = true;
        setCheckpoints(prev => {
          if (JSON.stringify(prev) === JSON.stringify(snapshot.roadmapCheckpoints)) return prev;
          return snapshot.roadmapCheckpoints;
        });
        setSelectedCheckpoint(prev => {
          if (!prev) return null;
          const found = snapshot.roadmapCheckpoints.find((c: any) => c.id === prev.id);
          if (!found || JSON.stringify(prev) === JSON.stringify(found)) return prev;
          return found;
        });
        setTimeout(() => { isApplyingExternalSyncRef.current = false; }, 50);
      }
      if (snapshot.roadmapDates) {
        if (snapshot.roadmapDates.prepStartDate) {
          setPrepStartDate(prev => prev === snapshot.roadmapDates!.prepStartDate ? prev : snapshot.roadmapDates!.prepStartDate!);
        }
        if (snapshot.roadmapDates.examDate) {
          setExamDate(prev => prev === snapshot.roadmapDates!.examDate ? prev : snapshot.roadmapDates!.examDate!);
        }
      }
    }
  });

  // Initial fetch of Roadmap checkpoints, dates & autoStudyPlan from Firestore if authenticated
  useEffect(() => {
    let active = true;
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      getDoc(roadmapDocRef).then((snap) => {
        if (!active || !snap.exists()) return;
        const data = snap.data();
        isApplyingExternalSyncRef.current = true;
        if (Array.isArray(data.checkpoints)) {
          const { updated } = disintegrateAndSanitizeSameSubjectMilestones(data.checkpoints, {
            forcePartitionSameCycle: false,
            stripLeakedCompletions: true
          });
          setCheckpoints(prev => JSON.stringify(prev) === JSON.stringify(updated) ? prev : updated);
          localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updated));
        }
        if (data.prepStartDate) setPrepStartDate(prev => prev === data.prepStartDate ? prev : data.prepStartDate);
        if (data.examDate) setExamDate(prev => prev === data.examDate ? prev : data.examDate);
        if (data.subjectFinalExamDates && typeof data.subjectFinalExamDates === 'object') {
          localStorage.setItem(getLevelScopedKey('practca_subject_final_exam_dates', caLevel), JSON.stringify(data.subjectFinalExamDates));
          window.dispatchEvent(new CustomEvent('practca_subject_exam_dates_updated', { detail: data.subjectFinalExamDates }));
        }
        setTimeout(() => { isApplyingExternalSyncRef.current = false; }, 50);
      }).catch(() => {});

      const autoPlanDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreAutoStudyPlanDocId(caLevel));
      getDoc(autoPlanDocRef).then((snap) => {
        if (!active || !snap.exists()) return;
        const data = snap.data();
        if (data.config) {
          setAutoPlanConfig(prev => JSON.stringify(prev) === JSON.stringify(data.config) ? prev : data.config);
          localStorage.setItem(getLevelScopedKey(STORAGE_KEY_AUTO_PLAN_CONFIG, caLevel), JSON.stringify(data.config));
        }
        if (Array.isArray(data.chapterInputs)) {
          setChapterPlanInputs(prev => JSON.stringify(prev) === JSON.stringify(data.chapterInputs) ? prev : data.chapterInputs);
          localStorage.setItem(getLevelScopedKey(STORAGE_KEY_CHAPTER_PLAN_INPUTS, caLevel), JSON.stringify(data.chapterInputs));
        }
      }).catch(() => {});
    }
    return () => { active = false; };
  }, [caLevel, STORAGE_KEY_CHECKPOINTS]);

  // Helper: Compute 1 day prior to a YYYY-MM-DD date string for 1.5-Day Sprint start window
  const getOneDayBeforeDateStr = (dateStr: string): string => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      dt.setDate(dt.getDate() - 1);
      const yr = dt.getFullYear();
      const mn = String(dt.getMonth() + 1).padStart(2, '0');
      const dy = String(dt.getDate()).padStart(2, '0');
      return `${yr}-${mn}-${dy}`;
    } catch {
      return dateStr;
    }
  };

  const is15DaySprintCheckpoint = (
    cp: Pick<UserCheckpoint, 'revisionCycle' | 'customTitle'> | null | undefined
  ): boolean => {
    if (!cp) return false;
    const cyc = String(cp.revisionCycle || '').toLowerCase();
    const title = String(cp.customTitle || '').toLowerCase();
    return (
      cyc === 'final sprint' ||
      cyc.includes('1.5') ||
      title.includes('1.5 day') ||
      title.includes('1.5-day') ||
      title.includes('1.5 sprint') ||
      title.includes('final sprint')
    );
  };

  // When a 1.5-Day Final Sprint milestone is scheduled on or after the Exam Start Date (`examDate`),
  // it is for the Final Exam of that subject and its targetDate (last day) IS that subject's Final Exam date.
  const isSubjectFinalExamSprint = (
    cp: Pick<UserCheckpoint, 'revisionCycle' | 'customTitle' | 'targetDate'> | null | undefined,
    examStartStr: string = examDate
  ): boolean => {
    if (!cp || !cp.targetDate) return false;
    return is15DaySprintCheckpoint(cp) && cp.targetDate >= examStartStr;
  };

  // Persist master dates & sync global exam start date
  useEffect(() => {
    try {
      const nextDatesStr = JSON.stringify({ prepStartDate, examDate });
      const prevDatesStr = localStorage.getItem(STORAGE_KEY_DATES);
      const prevExamStr = localStorage.getItem(STORAGE_KEY_EXAM_DATE);
      const changed = prevDatesStr !== nextDatesStr || prevExamStr !== examDate;

      localStorage.setItem(STORAGE_KEY_DATES, nextDatesStr);
      localStorage.setItem(STORAGE_KEY_EXAM_DATE, examDate);

      if (changed && !isApplyingExternalSyncRef.current) {
        isInternalDispatchRef.current = true;
        try {
          window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new CustomEvent('practca_exam_date_updated', { detail: examDate }));
        } finally {
          isInternalDispatchRef.current = false;
        }
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
          const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
          setDoc(roadmapDocRef, {
            prepStartDate,
            examDate,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      }
    } catch (e) {}
  }, [prepStartDate, examDate, caLevel, STORAGE_KEY_DATES, STORAGE_KEY_EXAM_DATE]);

  useEffect(() => {
    try {
      const nextCpStr = JSON.stringify(checkpoints);
      const prevCpStr = localStorage.getItem(STORAGE_KEY_CHECKPOINTS);
      const changed = prevCpStr !== nextCpStr;

      localStorage.setItem(STORAGE_KEY_CHECKPOINTS, nextCpStr);

      // Persist subject-wise Final Exam dates derived from Study Planner's 1.5-Day Final Sprint milestones
      const sprintExamCheckpoints = checkpoints.filter(
        cp => cp.subjectId && cp.subjectId !== 'CUSTOM' && isSubjectFinalExamSprint(cp, examDate)
      );
      const subExamDatesKey = getLevelScopedKey('practca_subject_final_exam_dates', caLevel);
      let subjectFinalExamMap: Record<string, string> = {};
      if (sprintExamCheckpoints.length > 0) {
        sprintExamCheckpoints.forEach(cp => {
          subjectFinalExamMap[String(cp.subjectId)] = cp.targetDate;
        });
        localStorage.setItem(subExamDatesKey, JSON.stringify(subjectFinalExamMap));
      } else {
        try {
          const existingRaw = localStorage.getItem(subExamDatesKey);
          if (existingRaw) {
            const parsedExisting = JSON.parse(existingRaw);
            if (parsedExisting && typeof parsedExisting === 'object') {
              subjectFinalExamMap = { ...parsedExisting };
            }
          }
        } catch {}
      }

      if (changed && !isApplyingExternalSyncRef.current) {
        isInternalDispatchRef.current = true;
        try {
          window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
          window.dispatchEvent(new CustomEvent('practca_subject_exam_dates_updated', { detail: subjectFinalExamMap }));
          window.dispatchEvent(new Event('storage'));
        } finally {
          isInternalDispatchRef.current = false;
        }
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
          const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
          setDoc(roadmapDocRef, {
            checkpoints,
            prepStartDate,
            examDate,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      }
    } catch (e) {}
  }, [checkpoints, examDate, caLevel, STORAGE_KEY_CHECKPOINTS]);

  // Real-time synchronization when milestones or task completions update externally
  useEffect(() => {
    const handleCheckpointsExternalUpdate = () => {
      if (isApplyingExternalSyncRef.current || isInternalDispatchRef.current) return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY_CHECKPOINTS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setCheckpoints(prev => {
              if (JSON.stringify(prev) === raw) return prev;
              return parsed;
            });
            setSelectedCheckpoint(prev => {
              if (!prev) return null;
              const found = parsed.find((c: any) => c.id === prev.id);
              if (!found || JSON.stringify(prev) === JSON.stringify(found)) return prev;
              return found;
            });
          }
        }
      } catch (e) {}
    };
    window.addEventListener('practca_roadmap_checkpoints_updated', handleCheckpointsExternalUpdate);
    window.addEventListener('practca_task_completion_changed', handleCheckpointsExternalUpdate);
    return () => {
      window.removeEventListener('practca_roadmap_checkpoints_updated', handleCheckpointsExternalUpdate);
      window.removeEventListener('practca_task_completion_changed', handleCheckpointsExternalUpdate);
    };
  }, [STORAGE_KEY_CHECKPOINTS]);

  // Auto-mark Final Exam Date milestones as complete on the exam date after 5:00 PM
  useEffect(() => {
    autoCompleteFinalExamMilestonesAfter5PM();
    const timer = window.setInterval(() => {
      autoCompleteFinalExamMilestonesAfter5PM();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [checkpoints.length, examDate]);

  // Track 1.5-Day LDR Mode so Exam Planner transforms into a dedicated system-calculated 1.5-Day Sprint Planner
  const [isLmrMode, setIsLmrMode] = useState<boolean>(() => isLmrModeCurrentlyOn(caLevel));
  useEffect(() => {
    const syncLmrState = () => {
      const latestExam = localStorage.getItem(STORAGE_KEY_EXAM_DATE);
      if (latestExam && /^\d{4}-\d{2}-\d{2}$/.test(latestExam)) {
        setExamDate(prev => (prev === latestExam ? prev : latestExam));
      }
      setIsLmrMode(isLmrModeCurrentlyOn(caLevel));
    };
    syncLmrState();
    window.addEventListener('practca_lmr_preference_updated', syncLmrState);
    window.addEventListener('practca_lmr_mode_changed', syncLmrState);
    window.addEventListener('practca_exam_date_updated', syncLmrState);
    window.addEventListener('practca_subject_exam_dates_updated', syncLmrState);
    window.addEventListener('practca_roadmap_checkpoints_updated', syncLmrState);
    window.addEventListener('storage', syncLmrState);
    return () => {
      window.removeEventListener('practca_lmr_preference_updated', syncLmrState);
      window.removeEventListener('practca_lmr_mode_changed', syncLmrState);
      window.removeEventListener('practca_exam_date_updated', syncLmrState);
      window.removeEventListener('practca_subject_exam_dates_updated', syncLmrState);
      window.removeEventListener('practca_roadmap_checkpoints_updated', syncLmrState);
      window.removeEventListener('storage', syncLmrState);
    };
  }, [caLevel, STORAGE_KEY_EXAM_DATE]);

  useEffect(() => {
    if (isLmrMode) {
      if (
        activeWorkspaceTab === 'auto_planner' ||
        activeWorkspaceTab === 'icai_matrix'
      ) {
        setActiveWorkspaceTab('route_map');
      }
      if (isSidelineOpen) {
        setIsSidelineOpen(false);
      }
      if (showAddModal) {
        setShowAddModal(false);
      }
    }
  }, [isLmrMode, activeWorkspaceTab, isSidelineOpen, showAddModal]);

  // Chronologically sorted checkpoints (in 1.5-Day LDR mode, strictly show the ICAI 1.5-Day Final Exam Sprints)
  const sortedCheckpoints = useMemo(() => {
    if (isLmrMode) {
      const schedule = resolveActiveExamSchedule(examDate, new Date(), caLevel);
      const sprintBySub = new Map<SubjectId, UserCheckpoint>();
      checkpoints.forEach(cp => {
        if (is15DaySprintCheckpoint(cp) && cp.subjectId !== 'CUSTOM') {
          sprintBySub.set(cp.subjectId as SubjectId, cp);
        }
      });

      const lmrCheckpoints: UserCheckpoint[] = schedule.orderedExams.map((exam) => {
        const existing = sprintBySub.get(exam.subjectId);
        const computedStart = exam.sprintStartDateStr || existing?.startDate || exam.dateStr;
        const subChaps = getMilestoneSubjectChapters(exam.subjectId);
        return {
          id: existing?.id || `cp_final_sprint_${exam.subjectId}`,
          subjectId: exam.subjectId,
          customTitle: existing?.customTitle || `${exam.subjectId} 1.5-Day Final Exam Sprint`,
          phaseId: existing?.phaseId,
          revisionCycle: 'Final Sprint',
          startDate: computedStart,
          targetDate: existing?.targetDate || exam.dateStr,
          targetChapters: existing?.targetChapters || subChaps.length,
          selectedChapters: (existing?.selectedChapters && existing.selectedChapters.length > 0) ? existing.selectedChapters : subChaps,
          completedChapters: existing?.completedChapters || [],
          completed: Boolean(existing?.completed || isSubjectLockedAfterFinalExam(exam.subjectId)),
          allocatedHoursTotal: existing?.allocatedHoursTotal || 16,
          completionCondition: 'targets_only',
          notes: existing?.notes || `System-Calculated 1.5-Day LDR Sprint for Paper ${exam.paperNumber} (${exam.fullName})`
        };
      });

      return lmrCheckpoints.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
    }
    return [...checkpoints].sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  }, [checkpoints, isLmrMode, examDate]);

  // Tasks indexed by target date
  const tasksByDate = useMemo(() => {
    const map = new Map<string, GoogleTask[]>();
    tasks.forEach(t => {
      const d = t.taskDate || (t.due ? t.due.split('T')[0] : '');
      if (!d) return;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(t);
    });
    return map;
  }, [tasks]);

  // Checkpoint statistics & completion percentages (incorporating Mock Test Gate condition)
  const checkpointStats = useMemo(() => {
    const map = new Map<string, {
      fillPercentage: number;
      chaptersFillPercentage: number;
      completedChaptersCount: number;
      totalChapters: number;
      daysRemaining: number;
      isOverdue: boolean;
      awaitingMockTest: boolean;
      status: 'completed' | 'awaiting_mock' | 'on_track' | 'pace_alert' | 'overdue';
      completedList: string[];
      pendingList: string[];
    }>();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group sortedCheckpoints by subjectId to enforce strict chronological windows when multiple milestones exist for the same subject
    const sameSubjectCheckpointsMap = new Map<string, UserCheckpoint[]>();
    sortedCheckpoints.forEach(cp => {
      const subKey = String(cp.subjectId || 'CUSTOM').toUpperCase();
      if (!sameSubjectCheckpointsMap.has(subKey)) sameSubjectCheckpointsMap.set(subKey, []);
      sameSubjectCheckpointsMap.get(subKey)!.push(cp);
    });

    sortedCheckpoints.forEach(cp => {
      const isSub = cp.subjectId !== 'CUSTOM';
      const subKey = String(cp.subjectId || 'CUSTOM').toUpperCase();
      const sameSubjectList = sameSubjectCheckpointsMap.get(subKey) || [cp];
      const cpChronoIndex = sameSubjectList.findIndex(item => item.id === cp.id);
      const hasMultipleSameSubject = sameSubjectList.length > 1;
      const prevSameSubjectTargetDate = cpChronoIndex > 0
        ? String(sameSubjectList[cpChronoIndex - 1]?.targetDate || '')
        : '';

      const defaultSubChapters = isSub ? getMilestoneSubjectChapters(cp.subjectId as SubjectId) : [];
      const activeMilestoneChapters = (cp.selectedChapters && cp.selectedChapters.length > 0)
        ? cp.selectedChapters
        : defaultSubChapters;
      const totalChapters = activeMilestoneChapters.length > 0
        ? activeMilestoneChapters.length
        : (cp.targetChapters || (defaultSubChapters.length > 0 ? defaultSubChapters.length : 10));
      
      const manuallyDone = new Set<string>();
      const cpCompletedSet = new Set((cp.completedChapters || []).map(c => normalizeKey(c)));
      (cp.completedChapters || []).forEach(ch => {
        const matched = activeMilestoneChapters.find(mc => {
          if (mc === ch) return true;
          const mcNorm = normalizeKey(mc);
          const chNorm = normalizeKey(ch);
          return mcNorm && chNorm && mcNorm === chNorm;
        });
        if (matched) {
          manuallyDone.add(matched);
        } else if (activeMilestoneChapters.length === 0) {
          manuallyDone.add(ch);
        }
      });

      // Active pending tasks that contradict completion (from daily board, 24h clock, or target meters)
      // Only considered if the chapter was NOT explicitly completed in this milestone
      const activePendingChapters = new Set<string>();
      tasks.forEach(t => {
        if (isSub && t.subjectCode && t.subjectCode !== cp.subjectId) return;
        if (t.status === 'needsAction' && !t.completed) {
          const tMilestoneId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
          const searchCandidates = [t.chapterName, t.cleanTitle, t.title].filter((s): s is string => Boolean(s && s.trim().length > 0));
          if (searchCandidates.length > 0) {
            const matched = resolveExactOrBestChapterMatch(
              activeMilestoneChapters,
              searchCandidates,
              isSub ? cp.subjectId : undefined
            );
            if (matched) {
              const matchedNorm = normalizeKey(matched);
              if (!cpCompletedSet.has(matchedNorm)) {
                if (tMilestoneId === cp.id || !tMilestoneId) {
                  activePendingChapters.add(matched);
                }
              }
            }
          }
        }
      });

      // Strictly scope relevantTasks to this milestoneId or this milestone's isolated chronological window
      const relevantTasks = tasks.filter(t => {
        if (isSub && t.subjectCode !== cp.subjectId) {
          return false;
        }
        const tMilestoneId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
        if (tMilestoneId) {
          return tMilestoneId === cp.id;
        }
        if (hasMultipleSameSubject) {
          const tDate = (t.due || t.taskDate || '').split('T')[0];
          if (!tDate) return false;
          if (cpChronoIndex === 0) {
            if (tDate > cp.targetDate) return false;
          } else {
            const windowStart = cp.startDate || prevSameSubjectTargetDate;
            if (!windowStart || tDate <= prevSameSubjectTargetDate || tDate > cp.targetDate) {
              return false;
            }
          }
        }
        return true;
      });

      const completedTasks = relevantTasks.filter(t => t.status === 'completed' || Boolean(t.completed));
      completedTasks.forEach(t => {
        const tMilestoneId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
        const searchCandidates = [t.chapterName, t.cleanTitle, t.title].filter((s): s is string => Boolean(s && s.trim().length > 0));
        if (searchCandidates.length > 0) {
          const matched = resolveExactOrBestChapterMatch(
            activeMilestoneChapters,
            searchCandidates,
            isSub ? cp.subjectId : undefined
          );
          if (matched) {
            if (tMilestoneId === cp.id || cpCompletedSet.has(normalizeKey(matched))) {
              manuallyDone.add(matched);
            }
          }
        }
      });

      // Check milestone-scoped completion in storage (passing cp.id so earlier milestones NEVER leak into subsequent milestones)
      activeMilestoneChapters.forEach(ch => {
        const subToCheck = isSub ? (cp.subjectId as SubjectId) : undefined;
        if (isTaskCompletedInStorage(undefined, ch, ch, ch, subToCheck, undefined, cp.id)) {
          manuallyDone.add(ch);
        }
      });

      // When inspecting a 1.5-Day Final Sprint milestone, also sync live rev1.5 completion from RevisionPlanner / LMR Sprint Board
      if (isSub && is15DaySprintCheckpoint(cp)) {
        try {
          const revRaw = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${cp.subjectId}`, caLevel));
          if (revRaw) {
            const revParsed = JSON.parse(revRaw);
            const revChaps = revParsed?.chapters || revParsed;
            if (revChaps && typeof revChaps === 'object') {
              activeMilestoneChapters.forEach(ch => {
                const canonKey = getCanonicalChapterKey(cp.subjectId as SubjectId, ch);
                const rec = revChaps[canonKey] || revChaps[ch];
                if (rec?.revisions?.['rev1.5']?.completed) {
                  manuallyDone.add(ch);
                }
              });
            }
          }
        } catch (e) {}
      }

      // Active pending tasks on daily dashboard, 24-hr clock, or target meters strictly override
      // ambient storage detections, but NEVER overwrite explicit user completions in cp.completedChapters!
      activePendingChapters.forEach(ch => {
        const chNorm = normalizeKey(ch);
        if (!cpCompletedSet.has(chNorm)) {
          manuallyDone.delete(ch);
        }
      });

      const completedList = activeMilestoneChapters.length > 0
        ? activeMilestoneChapters.filter(ch => manuallyDone.has(ch))
        : Array.from(manuallyDone);
      const completedChaptersCount = completedList.length;
      const chaptersFillPercentage = totalChapters > 0 
        ? Math.min(100, Math.round((completedChaptersCount / totalChapters) * 100))
        : (completedTasks.length > 0 ? 100 : 0);

      const requiresMock = cp.completionCondition === 'mock_test_required';
      const isMockDone = Boolean(cp.mockTestCompleted);

      let fillPercentage = chaptersFillPercentage;
      let awaitingMockTest = false;

      if (cp.completed) {
        fillPercentage = 100;
        awaitingMockTest = false;
      } else if (requiresMock) {
        if (chaptersFillPercentage >= 100 && !isMockDone) {
          fillPercentage = 95;
          awaitingMockTest = true;
        } else if (chaptersFillPercentage >= 100 && isMockDone) {
          fillPercentage = 100;
        }
      }

      const targetObj = new Date(cp.targetDate);
      targetObj.setHours(0, 0, 0, 0);
      const daysRemaining = Math.round((targetObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isOverdue = daysRemaining < 0 && fillPercentage < 100;

      let status: 'completed' | 'awaiting_mock' | 'on_track' | 'pace_alert' | 'overdue' = 'on_track';
      if (fillPercentage >= 100) {
        status = 'completed';
      } else if (awaitingMockTest) {
        status = 'awaiting_mock';
      } else if (isOverdue) {
        status = 'overdue';
      } else if (daysRemaining <= 4 && fillPercentage < 60) {
        status = 'pace_alert';
      }

      const pendingList = activeMilestoneChapters.filter(ch => !manuallyDone.has(ch));

      map.set(cp.id, {
        fillPercentage,
        chaptersFillPercentage,
        completedChaptersCount,
        totalChapters,
        daysRemaining,
        isOverdue,
        awaitingMockTest,
        status,
        completedList,
        pendingList
      });
    });

    return map;
  }, [sortedCheckpoints, tasks, syncVersion]);

  // Identify NEXT upcoming checkpoint to prominently display on top
  const nextUpcomingCheckpoint = useMemo(() => {
    if (sortedCheckpoints.length === 0) return null;
    for (const cp of sortedCheckpoints) {
      const stats = checkpointStats.get(cp.id);
      if (!stats || stats.fillPercentage < 100) {
        return {
          checkpoint: cp,
          stats
        };
      }
    }
    return null;
  }, [sortedCheckpoints, checkpointStats]);

  // Compute current active phase completion percentage to trigger Post-Phase Review & Amendment Gate
  const activePhaseSummary = useMemo(() => {
    const activePhase = autoPlanConfig.activePhaseId || 'rev1';
    const phaseCheckpoints = sortedCheckpoints.filter(cp => cp.phaseId === activePhase);
    if (phaseCheckpoints.length === 0) {
      return {
        phaseId: activePhase,
        label: PHASE_LABELS[activePhase]?.title || '1st Revision',
        completedCount: 0,
        totalCount: 0,
        percent: 0,
        isReadyForPhaseGate: false
      };
    }
    let done = 0;
    let sumPct = 0;
    phaseCheckpoints.forEach(cp => {
      const st = checkpointStats.get(cp.id);
      if (st) {
        sumPct += st.fillPercentage;
        if (st.fillPercentage >= 100) done++;
      }
    });
    const percent = Math.round(sumPct / phaseCheckpoints.length);
    return {
      phaseId: activePhase,
      label: PHASE_LABELS[activePhase]?.title || '1st Revision',
      completedCount: done,
      totalCount: phaseCheckpoints.length,
      percent,
      isReadyForPhaseGate: done === phaseCheckpoints.length && phaseCheckpoints.length > 0
    };
  }, [autoPlanConfig.activePhaseId, sortedCheckpoints, checkpointStats]);

  // Compute segments between consecutive milestones
  const segments = useMemo((): SegmentReport[] => {
    const list: SegmentReport[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    const buildDaysBetween = (startStr: string, endStr: string) => {
      const result = [];
      const cur = new Date(startStr);
      cur.setDate(cur.getDate() + 1);
      const end = new Date(endStr);
      end.setHours(0, 0, 0, 0);

      while (cur.getTime() <= end.getTime()) {
        const dStr = cur.toISOString().split('T')[0];
        const dayTasks = tasksByDate.get(dStr) || [];
        const completed = dayTasks.filter(t => t.status === 'completed' || Boolean(t.completed));
        const topics = Array.from(new Set(dayTasks.map(t => t.cleanTitle || t.title).filter(Boolean)));

        result.push({
          dateStr: dStr,
          dayNum: cur.getDate(),
          hasCompleted: completed.length > 0,
          hasTasks: dayTasks.length > 0,
          tasksCount: dayTasks.length,
          completedCount: completed.length,
          topics,
          isToday: dStr === todayStr,
          isPast: dStr < todayStr
        });
        cur.setDate(cur.getDate() + 1);
      }
      return result;
    };

    if (sortedCheckpoints.length === 0) {
      list.push({
        id: 'seg_initial',
        fromLabel: 'Kickoff',
        toLabel: 'CA Final Exam',
        fromDate: prepStartDate,
        toDate: examDate,
        days: buildDaysBetween(prepStartDate, examDate)
      });
      return list;
    }

    let prevDate = prepStartDate;
    let prevLabel = 'Kickoff';

    sortedCheckpoints.forEach((cp, idx) => {
      const label = cp.customTitle || (cp.subjectId !== 'CUSTOM' ? cp.subjectId : `Checkpoint #${idx + 1}`);
      list.push({
        id: `seg_${idx}`,
        fromLabel: prevLabel,
        toLabel: label,
        fromDate: prevDate,
        toDate: cp.targetDate,
        checkpoint: cp,
        days: buildDaysBetween(prevDate, cp.targetDate)
      });
      prevDate = cp.targetDate;
      prevLabel = label;
    });

    if (prevDate < examDate) {
      list.push({
        id: `seg_final`,
        fromLabel: prevLabel,
        toLabel: 'CA Final Exam',
        fromDate: prevDate,
        toDate: examDate,
        days: buildDaysBetween(prevDate, examDate)
      });
    }

    return list;
  }, [prepStartDate, examDate, sortedCheckpoints, tasksByDate]);

  // Overall active trail completion percent
  const overallFlowPercent = useMemo(() => {
    let totalDays = 0;
    let completedDays = 0;
    segments.forEach(seg => {
      totalDays += seg.days.length;
      completedDays += seg.days.filter(d => d.hasCompleted).length;
    });
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  }, [segments]);

  const routeContainerRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────────
  // SCROLLABLE ROUTE CHECKPOINTS LAYOUT (3 NODES PER ROW SERPENTINE)
  // - Fixed Start Point and End Point are anchored outside this canvas
  // - Focus screen displays the current point and next 6 to 8 points (rows 0, 1, 2)
  // - Additional points (points 9+) flow below the border and can be scrolled up
  // ─────────────────────────────────────────────────────────────────
  const mapNodes = useMemo((): MapNodePosition[] => {
    if (sortedCheckpoints.length === 0) return [];

    return sortedCheckpoints.map((cp, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const isEvenRow = row % 2 === 0;
      // Even row: Left to Right (180, 470, 760)
      // Odd row: Right to Left (760, 470, 180)
      const x = isEvenRow ? 180 + col * 290 : 760 - col * 290;
      const y = 85 + row * 150;

      return {
        type: 'checkpoint' as const,
        id: cp.id,
        checkpoint: cp,
        idx: idx + 1,
        label: cp.customTitle || (cp.subjectId !== 'CUSTOM' ? cp.subjectId : `CP #${idx + 1}`),
        subLabel: cp.targetDate,
        dateStr: cp.targetDate,
        x,
        y,
        row
      };
    });
  }, [sortedCheckpoints]);

  const totalRows = Math.max(1, Math.ceil(mapNodes.length / 3));
  const svgCanvasHeight = Math.max(500, totalRows * 150 + 40);
  const svgCanvasWidth = 940;

  // Earliest uncompleted checkpoint index
  const activeCheckpointIndex = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    for (let i = 0; i < sortedCheckpoints.length; i++) {
      const cp = sortedCheckpoints[i];
      const stats = checkpointStats.get(cp.id);
      if (!stats || stats.fillPercentage < 100) {
        return i;
      }
    }
    return Math.max(0, sortedCheckpoints.length - 1);
  }, [sortedCheckpoints, checkpointStats]);

  // Construct SVG paths connecting all milestones with completion fill ratios
  const pathSegmentsData = useMemo(() => {
    if (mapNodes.length < 2) return [];

    const result: {
      fromIndex: number;
      toIndex: number;
      d: string;
      completionRatio: number;
      isFullyCompleted: boolean;
      dots: {
        x: number;
        y: number;
        t: number;
        dayData?: SegmentReport['days'][0];
      }[];
    }[] = [];

    for (let i = 0; i < mapNodes.length - 1; i++) {
      const curr = mapNodes[i];
      const next = mapNodes[i + 1];
      const seg = segments[i + 1] || segments[i];

      let d = '';
      if (curr.row === next.row) {
        // Standard, rock-solid straight horizontal track between milestones
        d = `M ${curr.x} ${curr.y} L ${next.x} ${next.y}`;
      } else {
        // Clean, standard semicircle connecting the ends of adjacent rows
        const isRightSide = curr.x > 500;
        const turnRadius = 60;
        const cx = isRightSide ? curr.x + turnRadius : curr.x - turnRadius;
        d = `M ${curr.x} ${curr.y} C ${cx} ${curr.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
      }

      // Compute completion ratio for this segment
      const totalDays = seg?.days.length || 1;
      const completedDaysCount = seg?.days.filter(d => d.hasCompleted).length || 0;
      const completionRatio = Math.min(1, completedDaysCount / totalDays);
      const isFullyCompleted = completionRatio >= 1;

      // Stepping dots along the track between milestones:
      // Directly equal to the number of days between each milestone.
      // If time length is greater than 10 days, each dot equals 2 days.
      const dotCount = totalDays <= 10 ? totalDays : Math.ceil(totalDays / 2);
      const dots = [];

      for (let k = 1; k <= dotCount; k++) {
        const t = k / (dotCount + 1);
        let dotX = curr.x + (next.x - curr.x) * t;
        let dotY = curr.y;
        
        if (curr.row !== next.row) {
          const isRightSide = curr.x > 500;
          const turnRadius = 60;
          const outward = isRightSide ? turnRadius : -turnRadius;
          dotX = curr.x + Math.sin(t * Math.PI) * outward;
          dotY = curr.y + (next.y - curr.y) * t;
        }

        let dayData;
        if (totalDays <= 10) {
          // 1 dot = 1 day (directly equal to the number of days)
          const dayIdx = Math.min(totalDays - 1, k - 1);
          dayData = seg?.days?.[dayIdx];
        } else {
          // 1 dot = 2 days (whenever the time length is greater than 10 days)
          const baseDayIdx = (k - 1) * 2;
          const dayA = seg?.days?.[baseDayIdx];
          const dayB = seg?.days?.[baseDayIdx + 1];
          if (dayA && dayB) {
            dayData = {
              dateStr: `${dayA.dateStr} – ${dayB.dateStr}`,
              dayNum: dayA.dayNum,
              hasCompleted: Boolean(dayA.hasCompleted || dayB.hasCompleted),
              hasTasks: Boolean(dayA.hasTasks || dayB.hasTasks),
              tasksCount: (dayA.tasksCount || 0) + (dayB.tasksCount || 0),
              completedCount: (dayA.completedCount || 0) + (dayB.completedCount || 0),
              topics: Array.from(new Set([...(dayA.topics || []), ...(dayB.topics || [])])),
              isToday: Boolean(dayA.isToday || dayB.isToday),
              isPast: Boolean(dayA.isPast && dayB.isPast)
            };
          } else {
            dayData = dayA || dayB;
          }
        }

        dots.push({
          x: dotX,
          y: dotY,
          t,
          dayData
        });
      }

      result.push({
        fromIndex: i,
        toIndex: i + 1,
        d,
        completionRatio,
        isFullyCompleted,
        dots
      });
    }

    return result;
  }, [mapNodes, segments]);

  // Player's current static navigator position along the trail (static icon, no bouncing)
  const playerPosition = useMemo(() => {
    if (mapNodes.length === 0) return null;
    return mapNodes[activeCheckpointIndex] || mapNodes[0];
  }, [mapNodes, activeCheckpointIndex]);

  // Initial focus on current milestone row without continuous animated scroll movement
  useEffect(() => {
    if (!hasInitialScrolledRef.current && routeContainerRef.current && mapNodes.length > 0) {
      const activeRow = Math.floor(activeCheckpointIndex / 3);
      if (activeRow > 0) {
        routeContainerRef.current.scrollTo({
          top: Math.max(0, activeRow * 150 - 30),
          behavior: 'auto'
        });
        hasInitialScrolledRef.current = true;
      }
    }
  }, [activeCheckpointIndex, mapNodes.length]);

  const allocateMilestoneChaptersAcrossDays = (cp: UserCheckpoint) => {
    try {
      const startStr = (cp.startDate && cp.startDate <= cp.targetDate) ? cp.startDate : cp.targetDate;
      const endStr = cp.targetDate >= startStr ? cp.targetDate : startStr;
      if (!startStr || !endStr) return;

      const parseYmdLocal = (ymd: string): Date => {
        const [y, m, d] = ymd.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
      };
      const fmtYmdLocal = (dt: Date): string =>
        `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

      const dayList: string[] = [];
      const cur = parseYmdLocal(startStr);
      const endDt = parseYmdLocal(endStr);
      let guard = 0;
      while (cur.getTime() <= endDt.getTime() && guard < 366) {
        dayList.push(fmtYmdLocal(cur));
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
      if (dayList.length === 0) dayList.push(endStr);

      const rawChapters = (cp.selectedChapters && cp.selectedChapters.length > 0)
        ? cp.selectedChapters
        : (cp.subjectId !== 'CUSTOM' ? getMilestoneSubjectChapters(cp.subjectId as SubjectId) : []);
      if (rawChapters.length === 0) return;

      const cycleStr = String(cp.revisionCycle || '').toLowerCase();
      const relevance: 'General' | 'Revision' | 'Final Revision' =
        /final|1\.5/.test(cycleStr) ? 'Final Revision'
        : (/baseline|mock/.test(cycleStr) ? 'General' : 'Revision');
      const revKey: string | undefined =
        /1st/.test(cycleStr) ? 'rev1'
        : /2nd/.test(cycleStr) ? 'rev2'
        : /3rd/.test(cycleStr) ? 'rev3'
        : (/final|1\.5/.test(cycleStr) ? 'rev1.5'
        : (/baseline/.test(cycleStr) ? 'baseline' : undefined));
      const emoji = relevance === 'Final Revision' ? '🔴' : relevance === 'General' ? '🔵' : '🟡';
      const defaultListId = localStorage.getItem('practca_selected_list_id') || 'local-default';

      ['practca_local_tasks', 'practca_cached_cloud_tasks'].forEach((baseStoreKey) => {
        const storeKey = getLevelScopedKey(baseStoreKey, caLevel);
        const raw = localStorage.getItem(storeKey);
        const existing: any[] = raw ? (JSON.parse(raw) || []) : [];
        if (!Array.isArray(existing)) return;

        // Remove previous unfinished auto-allocated tasks for this milestone when re-distributing
        const kept = existing.filter((t: any) => {
          const isAutoMs = String(t.id || '').startsWith(`ms_alloc_${cp.id}_`);
          if (!isAutoMs) return true;
          return t.status === 'completed' || Boolean(t.completed);
        });

        const existingKeysByDay = new Set<string>();
        kept.forEach((t: any) => {
          const dStr = t.due ? String(t.due).split('T')[0] : '';
          const tSub = String(t.subjectCode || '').toUpperCase();
          const tChap = normalizeKey(t.chapterName || t.cleanTitle || t.title || '');
          if (dStr && tChap) existingKeysByDay.add(`${dStr}_${tSub}_${tChap}`);
        });

        const addedTasks: any[] = [];
        rawChapters.forEach((rawChap, idx) => {
          const bracketMatch = rawChap.match(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*(.+)$/i);
          const subCode: SubjectId = bracketMatch
            ? (bracketMatch[1] as SubjectId)
            : (cp.subjectId !== 'CUSTOM' ? (cp.subjectId as SubjectId) : (levelSubjects[0] || 'FR'));
          const cleanChap = (bracketMatch ? bracketMatch[2] : rawChap).trim();
          const dayIdx = Math.min(dayList.length - 1, Math.floor((idx * dayList.length) / rawChapters.length));
          const assignedDate = dayList[dayIdx];
          const dedupeKey = `${assignedDate}_${String(subCode).toUpperCase()}_${normalizeKey(cleanChap)}`;
          if (existingKeysByDay.has(dedupeKey)) return;
          existingKeysByDay.add(dedupeKey);

          const fullTitle = `${emoji} [${relevance}] [${subCode}] ${cleanChap}`;
          const notesStr = [
            `MilestoneId: ${cp.id}`,
            `Relevance: ${relevance}`,
            `Subject: ${subCode}`,
            `Chapter: ${cleanChap}`,
            revKey ? `RevisionCycle: ${revKey}` : ''
          ].filter(Boolean).join('\n');

          addedTasks.push({
            id: `ms_alloc_${cp.id}_${assignedDate}_${idx}`,
            title: fullTitle,
            cleanTitle: cleanChap,
            notes: notesStr,
            due: `${assignedDate}T09:00:00.000Z`,
            status: 'needsAction',
            listId: defaultListId,
            subjectCode: subCode,
            chapterName: cleanChap,
            relevance,
            ...(revKey ? { revKey } : {}),
            milestoneId: cp.id,
            created: new Date().toISOString()
          });
        });

        const merged = [...addedTasks, ...kept];
        localStorage.setItem(storeKey, JSON.stringify(merged));
      });

      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Could not distribute milestone targets across days:', err);
    }
  };

  // Checkpoint handlers
  const handleAddCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject !== 'CUSTOM' && isSubjectLockedAfterFinalExam(newSubject)) {
      return;
    }
    const isSub = newSubject !== 'CUSTOM';
    const subTitle = isSub ? (newCustomTitle.trim() || undefined) : (newCustomTitle.trim() || 'Custom Milestone');
    const fallbackChaps = isSub ? getMilestoneSubjectChapters(newSubject as SubjectId) : [];
    const finalSelectedChapters = newSelectedChapters.length > 0 ? newSelectedChapters : fallbackChaps;
    const chapsCount = finalSelectedChapters.length > 0 ? finalSelectedChapters.length : 10;

    const is15Sprint = is15DaySprintCheckpoint({ revisionCycle: newCycle, customTitle: subTitle });
    // Enforce minimum 1-day duration: targetDate >= startDate
    const rawStart = newStartDate || new Date().toISOString().split('T')[0];
    const resolvedTargetDate = newTargetDate && newTargetDate >= rawStart ? newTargetDate : rawStart;
    const resolvedStartDate = is15Sprint
      ? (rawStart <= resolvedTargetDate ? rawStart : getOneDayBeforeDateStr(resolvedTargetDate))
      : rawStart;
    const isFinalExamPaperSprint = isSubjectFinalExamSprint(
      { revisionCycle: newCycle, customTitle: subTitle, targetDate: resolvedTargetDate },
      examDate
    );

    const newCp: UserCheckpoint = {
      id: `cp_${Date.now()}`,
      subjectId: newSubject,
      customTitle: subTitle,
      revisionCycle: newCycle,
      startDate: resolvedStartDate,
      targetDate: resolvedTargetDate,
      targetChapters: chapsCount,
      selectedChapters: finalSelectedChapters,
      completedChapters: [],
      completionCondition: newCompletionCondition,
      notes: newNotes.trim()
    };

    setCheckpoints(prev => [...prev, newCp]);
    // Distribute milestone targets across [resolvedStartDate .. resolvedTargetDate] into Daily Schedule & Weekly Plan
    allocateMilestoneChaptersAcrossDays(newCp);
    setShowAddModal(false);
    setNewNotes('');
    setNewCustomTitle('');
    setNewChapterSearch('');

    if (isFinalExamPaperSprint) {
      const sub = newSubject !== 'CUSTOM' ? newSubject : 'CA Final';
      setMockSlotScheduleModal({
        checkpoint: newCp,
        dateStr: resolvedTargetDate,
        startTime: '14:00',
        endTime: '17:00',
        title: `🏆 [${sub}] CA Final Exam Paper (2:00 PM – 5:00 PM)`
      });
    } else if (newCompletionCondition === 'mock_test_required') {
      const sub = newSubject !== 'CUSTOM' ? newSubject : 'CA';
      setMockSlotScheduleModal({
        checkpoint: newCp,
        dateStr: resolvedTargetDate,
        startTime: '14:00',
        endTime: '17:00',
        title: `[${sub}] Mock Test Paper (${newCycle || 'ICAI Exam Condition'})`
      });
    }
  };

  const handleToggleCheckpointTargetChapter = (checkpointId: string, chapterName: string) => {
    const existingCp = checkpoints.find(c => c.id === checkpointId);
    if (existingCp && existingCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(existingCp.subjectId)) return;
    let matchedUpdatedCp: UserCheckpoint | null = null;
    const next = checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        const isSub = cp.subjectId !== 'CUSTOM';
        const baseList = (cp.selectedChapters !== undefined)
          ? cp.selectedChapters
          : (isSub ? getMilestoneSubjectChapters(cp.subjectId as SubjectId) : []);
        const set = new Set(baseList);
        if (set.has(chapterName)) {
          set.delete(chapterName);
        } else {
          set.add(chapterName);
        }
        const updatedList = Array.from(set);
        const updatedCp: UserCheckpoint = {
          ...cp,
          selectedChapters: updatedList,
          targetChapters: updatedList.length
        };
        matchedUpdatedCp = updatedCp;
        return updatedCp;
      }
      return cp;
    });

    setCheckpoints(next);
    if (selectedCheckpoint?.id === checkpointId && matchedUpdatedCp) {
      setSelectedCheckpoint(matchedUpdatedCp);
    }
    try {
      localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(next));
    } catch (e) {}
  };

  const handleDeleteCheckpoint = async (id: string) => {
    const cpToDelete = checkpoints.find(cp => cp.id === id);
    if (cpToDelete && cpToDelete.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cpToDelete.subjectId)) return;
    isApplyingExternalSyncRef.current = true;
    const updated = checkpoints.filter(cp => cp.id !== id);

    // 1. Immediately record in deleted IDs blacklist to prevent resurrection
    try {
      const delIdsKey = getLevelScopedKey('practca_deleted_milestone_ids', caLevel);
      const existingDeletedRaw = localStorage.getItem(delIdsKey);
      const deletedIds = existingDeletedRaw ? JSON.parse(existingDeletedRaw) : [];
      if (Array.isArray(deletedIds) && !deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem(delIdsKey, JSON.stringify(deletedIds.slice(-200)));
      }
    } catch (e) {}

    // 2. Immediately persist to localStorage FIRST
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updated));

    // 3. Immediately update state
    setCheckpoints(updated);
    if (selectedCheckpoint?.id === id) setSelectedCheckpoint(null);
    if (expandedSegment?.checkpoint?.id === id) setExpandedSegment(null);
    if (milestoneToDelete?.id === id) setMilestoneToDelete(null);

    // 4. Immediately sync to Firestore so cloud sync does not resurrect it
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      try {
        const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
        await setDoc(roadmapDocRef, {
          checkpoints: updated,
          prepStartDate,
          examDate,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to delete milestone from Firestore:', err);
      }
    }

    // 5. Clean up milestoneId references from local/cached tasks to ensure a clean slate
    try {
      ['practca_local_tasks', 'practca_cached_cloud_tasks'].forEach(baseStoreKey => {
        const storeKey = getLevelScopedKey(baseStoreKey, caLevel);
        const raw = localStorage.getItem(storeKey);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            let changed = false;
            const updatedTasks = list.map((t: any) => {
              const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
              if (tMsId === id) {
                changed = true;
                const cleanedNotes = typeof t.notes === 'string'
                  ? t.notes.replace(/MilestoneId:\s*[^\n\r]+/gi, '').trim()
                  : t.notes;
                return {
                  ...t,
                  milestoneId: undefined,
                  notes: cleanedNotes || undefined
                };
              }
              return t;
            });
            if (changed) {
              localStorage.setItem(storeKey, JSON.stringify(updatedTasks));
            }
          }
        }
      });
    } catch (e) {
      console.warn('Error unlinking deleted milestone tasks:', e);
    }

    // 6. Dispatch events safely
    window.dispatchEvent(new Event('practca_tasks_updated'));
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      isApplyingExternalSyncRef.current = false;
    }, 400);

    const title = cpToDelete?.customTitle || cpToDelete?.subjectId || 'Milestone';
    setPlanApplyBanner(`🗑️ Milestone "${title}" deleted successfully.`);
    setTimeout(() => setPlanApplyBanner(null), 4000);
  };

  const handleUpdateCheckpointDate = (id: string, dateStr: string) => {
    if (!dateStr) return;
    const targetCp = checkpoints.find(c => c.id === id);
    if (targetCp && targetCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(targetCp.subjectId)) return;
    const clampedTarget = targetCp?.startDate && dateStr < targetCp.startDate ? targetCp.startDate : dateStr;
    let updatedCpForAlloc: UserCheckpoint | null = null;
    const updated = checkpoints.map(cp => {
      if (cp.id === id) {
        const nextCp = { ...cp, targetDate: clampedTarget };
        updatedCpForAlloc = nextCp;
        return nextCp;
      }
      return cp;
    });
    setCheckpoints(updated);
    if (selectedCheckpoint?.id === id) {
      setSelectedCheckpoint(prev => prev ? { ...prev, targetDate: clampedTarget } : null);
    }
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updated));
    if (updatedCpForAlloc) {
      allocateMilestoneChaptersAcrossDays(updatedCpForAlloc);
    }
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
  };

  const handleUpdateCheckpointStartDate = (id: string, dateStr: string) => {
    if (!dateStr) return;
    const targetCp = checkpoints.find(c => c.id === id);
    if (targetCp && targetCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(targetCp.subjectId)) return;
    let updatedCpForAlloc: UserCheckpoint | null = null;
    const updated = checkpoints.map(cp => {
      if (cp.id === id) {
        const clampedTarget = cp.targetDate < dateStr ? dateStr : cp.targetDate;
        const nextCp = { ...cp, startDate: dateStr, targetDate: clampedTarget };
        updatedCpForAlloc = nextCp;
        return nextCp;
      }
      return cp;
    });
    setCheckpoints(updated);
    if (selectedCheckpoint?.id === id) {
      setSelectedCheckpoint(prev => prev ? { ...prev, startDate: dateStr, targetDate: prev.targetDate < dateStr ? dateStr : prev.targetDate } : null);
    }
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updated));
    if (updatedCpForAlloc) {
      allocateMilestoneChaptersAcrossDays(updatedCpForAlloc);
    }
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
  };

  const handleShiftDate = (id: string, days: number) => {
    const cp = checkpoints.find(c => c.id === id);
    if (!cp || (cp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cp.subjectId))) return;
    const d = new Date(cp.targetDate);
    d.setDate(d.getDate() + days);
    handleUpdateCheckpointDate(id, d.toISOString().split('T')[0]);
  };

  const handleShiftStartDate = (id: string, days: number) => {
    const cp = checkpoints.find(c => c.id === id);
    if (!cp || (cp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cp.subjectId))) return;
    const baseDateStr = cp.startDate || cp.targetDate;
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + days);
    handleUpdateCheckpointStartDate(id, d.toISOString().split('T')[0]);
  };

  // Dedicated, robust handler to undo a completed chapter target in a milestone
  const handleUndoChapter = async (checkpointId: string, chapterName: string) => {
    const existingCp = checkpoints.find(c => c.id === checkpointId);
    if (existingCp && existingCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(existingCp.subjectId)) return;
    isApplyingExternalSyncRef.current = true;
    const bracketMatch = chapterName.match(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*(.+)$/);
    const cleanChapterName = bracketMatch ? bracketMatch[2].trim() : chapterName;
    const normClean = normalizeKey(cleanChapterName);

    const targetCp = checkpoints.find(c => c.id === checkpointId);
    let targetSubId: SubjectId | undefined = undefined;
    let targetRevKey: 'rev1' | 'rev2' | 'rev3' | 'rev1.5' = 'rev1';

    if (targetCp) {
      if (targetCp.subjectId !== 'CUSTOM') {
        targetSubId = targetCp.subjectId as SubjectId;
      } else if (bracketMatch) {
        targetSubId = bracketMatch[1] as SubjectId;
      }
      if (/1st/i.test(targetCp.revisionCycle)) targetRevKey = 'rev1';
      else if (/2nd/i.test(targetCp.revisionCycle)) targetRevKey = 'rev2';
      else if (/3rd/i.test(targetCp.revisionCycle)) targetRevKey = 'rev3';
      else if (/final|1\.5/i.test(targetCp.revisionCycle)) targetRevKey = 'rev1.5';
    }

    if (!targetSubId) {
      for (const [sId, chaps] of Object.entries(SUBJECT_CHAPTERS)) {
        if ((chaps as string[]).some(c => normalizeKey(c) === normClean)) {
          targetSubId = sId as SubjectId;
          break;
        }
      }
    }

    const updatedCheckpoints = checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        const filtered = (cp.completedChapters || []).filter(c => {
          const cClean = c.replace(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*/i, '').trim();
          return normalizeKey(cClean) !== normClean && c !== chapterName;
        });
        const updatedCp = {
          ...cp,
          completedChapters: filtered,
          completed: undefined, // Re-open milestone if it was marked complete
          mockTestCompleted: false
        };
        if (selectedCheckpoint?.id === checkpointId) {
          setSelectedCheckpoint(updatedCp);
        }
        return updatedCp;
      }
      return cp;
    });

    setCheckpoints(updatedCheckpoints);
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    localStorage.setItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel), JSON.stringify(updatedCheckpoints));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      setDoc(roadmapDocRef, {
        checkpoints: updatedCheckpoints,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    // 1. Update task stores so tasks are restored to needsAction
    try {
      ['practca_local_tasks', 'practca_cached_cloud_tasks'].forEach(baseStoreKey => {
        const storeKey = getLevelScopedKey(baseStoreKey, caLevel);
        const raw = localStorage.getItem(storeKey);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            let changed = false;
            const updatedTasks = list.map((t: any) => {
              const tClean = normalizeKey(t.cleanTitle || t.title);
              const tChap = normalizeKey(t.chapterName);
              const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
              const matchBySearch = resolveExactOrBestChapterMatch(
                [cleanChapterName, chapterName],
                [t.chapterName, t.cleanTitle, t.title],
                targetSubId
              );
              const isMatch = (tMsId === checkpointId || !tMsId) &&
                (tClean === normClean || tChap === normClean || Boolean(matchBySearch));
              if (isMatch && (t.status === 'completed' || t.completed)) {
                changed = true;
                const cleanNotes = (t.notes || '').replace(/\[Completed Post-Test Assessment\]/gi, '').trim();
                return {
                  ...t,
                  status: 'needsAction',
                  notes: cleanNotes || undefined,
                  completed: undefined
                };
              }
              return t;
            });
            if (changed) {
              localStorage.setItem(storeKey, JSON.stringify(updatedTasks));
            }
          }
        }
      });
    } catch (e) {}

    // 2. Clear completed registry for task completion sync
    const compositeClean = getTaskCompositeKey(cleanChapterName, targetSubId);
    const compositeChap = getTaskCompositeKey(chapterName, targetSubId);
    saveToCompletedRegistry([], [
      cleanChapterName,
      chapterName,
      compositeClean,
      compositeChap,
      normClean,
      `${checkpointId}_${cleanChapterName}`,
      `${checkpointId}_${normClean}`
    ]);

    // 3. Directly update Revision Planner local storage AND Firestore for this subject & chapter!
    if (targetSubId) {
      const localRevKey = getLevelScopedKey(`practca_revision_planner_${targetSubId}`, caLevel);
      try {
        const stored = localStorage.getItem(localRevKey);
        const parsed = stored ? JSON.parse(stored) : { revisionsCount: 3, chapters: {} };
        const chaptersObj = parsed.chapters || {};
        const canon = getCanonicalChapterKey(targetSubId, cleanChapterName);

        const currentEntry = chaptersObj[canon] || chaptersObj[cleanChapterName] || {};
        const currentRevState = currentEntry[targetRevKey] || { completed: false, hours: '' };
        const existingHoursNum = parseFloat(currentRevState.hours || '0') || 0;

        chaptersObj[canon] = {
          ...currentEntry,
          [targetRevKey]: {
            ...currentRevState,
            completed: false,
            completedAt: undefined,
            isManualDateOverride: false,
            skipped: false,
            partiallyDone: existingHoursNum > 0
          }
        };

        parsed.chapters = chaptersObj;
        localStorage.setItem(localRevKey, JSON.stringify(parsed));

        if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
          const revDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRevisionDocId(targetSubId, caLevel));
          setDoc(revDocRef, {
            subjectId: targetSubId,
            revisionsCount: parsed.revisionsCount || 3,
            chapters: chaptersObj,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      } catch (e) {
        console.warn('Error updating revision planner during chapter undo:', e);
      }
    }

    if (onToggleTaskCompleted) {
      const matching = tasks.find(t => {
        const tClean = normalizeKey(t.cleanTitle || t.title);
        const tChap = normalizeKey(t.chapterName);
        const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
        const matchBySearch = resolveExactOrBestChapterMatch(
          [cleanChapterName, chapterName],
          [t.chapterName, t.cleanTitle, t.title],
          targetSubId
        );
        return (tMsId === checkpointId || !tMsId) && (tClean === normClean || tChap === normClean || Boolean(matchBySearch));
      });
      if (matching) {
        onToggleTaskCompleted(matching, true, 'needsAction');
      }
    }

    await syncTaskCompletionAcrossAllLinks(
      {
        title: cleanChapterName,
        cleanTitle: cleanChapterName,
        chapterName: cleanChapterName,
        subjectCode: targetSubId,
        milestoneId: checkpointId,
        revKey: targetRevKey
      },
      false,
      { milestoneId: checkpointId, revKey: targetRevKey }
    );

    setForceUpdate(v => v + 1);
    setTimeout(() => {
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_task_completion_changed'));
      window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
      window.dispatchEvent(new Event('practca_revision_planner_updated'));
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('storage'));
      isApplyingExternalSyncRef.current = false;
    }, 60);

    setUndoBannerInfo({
      message: `↩️ Undone: "${cleanChapterName}" restored to pending targets.`,
      action: null
    });
    setPlanApplyBanner(`↩️ Undone: "${cleanChapterName}" is now active in this milestone.`);
    setTimeout(() => setPlanApplyBanner(null), 4000);
  };

  // One-click handler to undo ALL completed chapters in a milestone
  const handleUndoAllChapters = async (checkpointId: string) => {
    const targetCp = checkpoints.find(c => c.id === checkpointId);
    if (!targetCp || (targetCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(targetCp.subjectId))) return;
    isApplyingExternalSyncRef.current = true;

    const completedToUndo = [...(targetCp.completedChapters || [])];
    if (completedToUndo.length === 0) return;

    let targetRevKey: 'rev1' | 'rev2' | 'rev3' | 'rev1.5' = 'rev1';
    if (/1st/i.test(targetCp.revisionCycle)) targetRevKey = 'rev1';
    else if (/2nd/i.test(targetCp.revisionCycle)) targetRevKey = 'rev2';
    else if (/3rd/i.test(targetCp.revisionCycle)) targetRevKey = 'rev3';
    else if (/final|1\.5/i.test(targetCp.revisionCycle)) targetRevKey = 'rev1.5';

    const updatedCheckpoints = checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        const updatedCp = {
          ...cp,
          completedChapters: [],
          completed: undefined,
          mockTestCompleted: false
        };
        if (selectedCheckpoint?.id === checkpointId) {
          setSelectedCheckpoint(updatedCp);
        }
        return updatedCp;
      }
      return cp;
    });

    setCheckpoints(updatedCheckpoints);
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    localStorage.setItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel), JSON.stringify(updatedCheckpoints));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      setDoc(roadmapDocRef, {
        checkpoints: updatedCheckpoints,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    try {
      ['practca_local_tasks', 'practca_cached_cloud_tasks'].forEach(baseStoreKey => {
        const storeKey = getLevelScopedKey(baseStoreKey, caLevel);
        const raw = localStorage.getItem(storeKey);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            let changed = false;
            const updatedTasks = list.map((t: any) => {
              const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
              if (tMsId === checkpointId && (t.status === 'completed' || t.completed)) {
                changed = true;
                const cleanNotes = (t.notes || '').replace(/\[Completed Post-Test Assessment\]/gi, '').trim();
                return {
                  ...t,
                  status: 'needsAction',
                  notes: cleanNotes || undefined,
                  completed: undefined
                };
              }
              return t;
            });
            if (changed) {
              localStorage.setItem(storeKey, JSON.stringify(updatedTasks));
            }
          }
        }
      });
    } catch (e) {}

    const keysToRemove: string[] = [];
    completedToUndo.forEach(ch => {
      const clean = ch.replace(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*/i, '').trim();
      keysToRemove.push(ch, clean, normalizeKey(clean), `${checkpointId}_${clean}`, `${checkpointId}_${normalizeKey(clean)}`);
    });
    saveToCompletedRegistry([], keysToRemove);

    // Group chapters by subject and update Revision Planner
    const chaptersBySub: Partial<Record<SubjectId, string[]>> = {};
    completedToUndo.forEach(ch => {
      const bMatch = ch.match(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*(.+)$/);
      let sId: SubjectId | undefined = targetCp.subjectId !== 'CUSTOM' ? (targetCp.subjectId as SubjectId) : undefined;
      if (!sId && bMatch) sId = bMatch[1] as SubjectId;
      const clean = bMatch ? bMatch[2].trim() : ch;
      if (!sId) {
        for (const [sub, chaps] of Object.entries(SUBJECT_CHAPTERS)) {
          if ((chaps as string[]).some(c => normalizeKey(c) === normalizeKey(clean))) {
            sId = sub as SubjectId;
            break;
          }
        }
      }
      if (sId) {
        if (!chaptersBySub[sId]) chaptersBySub[sId] = [];
        chaptersBySub[sId]!.push(clean);
      }
    });

    for (const [sId, chapsList] of Object.entries(chaptersBySub)) {
      const subId = sId as SubjectId;
      const localRevKey = getLevelScopedKey(`practca_revision_planner_${subId}`, caLevel);
      try {
        const stored = localStorage.getItem(localRevKey);
        const parsed = stored ? JSON.parse(stored) : { revisionsCount: 3, chapters: {} };
        const chaptersObj = parsed.chapters || {};

        chapsList.forEach(cln => {
          const canon = getCanonicalChapterKey(subId, cln);
          const currentEntry = chaptersObj[canon] || chaptersObj[cln] || {};
          const currentRevState = currentEntry[targetRevKey] || { completed: false, hours: '' };
          const existingHoursNum = parseFloat(currentRevState.hours || '0') || 0;

          chaptersObj[canon] = {
            ...currentEntry,
            [targetRevKey]: {
              ...currentRevState,
              completed: false,
              completedAt: undefined,
              isManualDateOverride: false,
              skipped: false,
              partiallyDone: existingHoursNum > 0
            }
          };
        });

        parsed.chapters = chaptersObj;
        localStorage.setItem(localRevKey, JSON.stringify(parsed));

        if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
          const revDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRevisionDocId(subId, caLevel));
          setDoc(revDocRef, {
            subjectId: subId,
            revisionsCount: parsed.revisionsCount || 3,
            chapters: chaptersObj,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      } catch (e) {
        console.warn('Error resetting revision planner in undo all:', e);
      }
    }

    for (const ch of completedToUndo) {
      const bMatch = ch.match(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*(.+)$/);
      const clean = bMatch ? bMatch[2].trim() : ch;
      let sId = targetCp.subjectId !== 'CUSTOM' ? (targetCp.subjectId as SubjectId) : undefined;
      if (!sId && bMatch) sId = bMatch[1] as SubjectId;
      try {
        await syncTaskCompletionAcrossAllLinks(
          {
            title: clean,
            cleanTitle: clean,
            chapterName: clean,
            subjectCode: sId,
            milestoneId: checkpointId,
            revKey: targetRevKey
          },
          false,
          { milestoneId: checkpointId, revKey: targetRevKey }
        );
      } catch (e) {}
    }

    setForceUpdate(v => v + 1);
    setTimeout(() => {
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_task_completion_changed'));
      window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
      window.dispatchEvent(new Event('practca_revision_planner_updated'));
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('storage'));
      isApplyingExternalSyncRef.current = false;
    }, 60);

    setUndoBannerInfo({
      message: `↩️ All ${completedToUndo.length} targets restored to pending in "${targetCp.customTitle || targetCp.subjectId}".`,
      action: null
    });
    setPlanApplyBanner(`↩️ All targets in this milestone are now active/pending.`);
    setTimeout(() => setPlanApplyBanner(null), 4000);
  };

  const handleToggleChapter = async (checkpointId: string, chapterName: string) => {
    const targetCp = checkpoints.find(c => c.id === checkpointId);
    if (!targetCp || (targetCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(targetCp.subjectId))) {
      return;
    }
    isApplyingExternalSyncRef.current = true;
    // Determine current completion state accurately from checkpoint or liveStats
    const currentStats = checkpointStats.get(checkpointId);

    const bracketMatch = chapterName.match(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*(.+)$/);
    const cleanChapterName = bracketMatch ? bracketMatch[2].trim() : chapterName;
    const chapNorm = normalizeKey(chapterName);
    const cleanNorm = normalizeKey(cleanChapterName);

    const isCurrentlyDone = Boolean(
      (targetCp.completedChapters || []).some(ch => {
        const cNorm = normalizeKey(ch);
        return cNorm === chapNorm || cNorm === cleanNorm;
      }) ||
      (currentStats?.completedList && currentStats.completedList.some(ch => {
        const cNorm = normalizeKey(ch);
        return cNorm === chapNorm || cNorm === cleanNorm;
      }))
    );

    // If currently done, delegate directly to the robust handleUndoChapter method!
    if (isCurrentlyDone) {
      handleUndoChapter(checkpointId, chapterName);
      return;
    }

    let targetSubId: SubjectId | undefined = undefined;
    if (targetCp.subjectId !== 'CUSTOM') {
      targetSubId = targetCp.subjectId as SubjectId;
    } else if (bracketMatch) {
      targetSubId = bracketMatch[1] as SubjectId;
    } else {
      for (const [sub, chaps] of Object.entries(SUBJECT_CHAPTERS)) {
        if ((chaps as string[]).some(c => normalizeKey(c) === cleanNorm)) {
          targetSubId = sub as SubjectId;
          break;
        }
      }
    }

    let targetRevKey: 'rev1' | 'rev2' | 'rev3' | 'rev1.5' = 'rev1';
    if (/1st/i.test(targetCp.revisionCycle)) targetRevKey = 'rev1';
    else if (/2nd/i.test(targetCp.revisionCycle)) targetRevKey = 'rev2';
    else if (/3rd/i.test(targetCp.revisionCycle)) targetRevKey = 'rev3';
    else if (/final|1\.5/i.test(targetCp.revisionCycle)) targetRevKey = 'rev1.5';

    const targetDateStr = targetCp.targetDate;
    const targetPhaseId = targetCp.phaseId;

    const defaultSubChapters = targetSubId ? getMilestoneSubjectChapters(targetSubId) : [];
    const activeMilestoneChapters = (targetCp.selectedChapters && targetCp.selectedChapters.length > 0)
      ? targetCp.selectedChapters
      : defaultSubChapters;

    const set = new Set<string>(targetCp.completedChapters || []);
    set.add(chapterName);

    const isAllDone = activeMilestoneChapters.length > 0 && activeMilestoneChapters.every(ch => {
      const chN = normalizeKey(ch);
      return Array.from(set).some((sc: string) => normalizeKey(sc) === chN);
    });

    const requiresMock = targetCp.completionCondition === 'mock_test_required';
    const isMockDone = Boolean(targetCp.mockTestCompleted);

    let nextCompleted = targetCp.completed;
    if (isAllDone) {
      if (!requiresMock || isMockDone) {
        nextCompleted = true;
      }
    }

    const updatedCheckpoints = checkpoints.map(cp => {
      if (cp.id === checkpointId) {
        const updatedCp: UserCheckpoint = {
          ...cp,
          completedChapters: Array.from(set),
          completed: nextCompleted
        };
        if (selectedCheckpoint?.id === checkpointId) {
          setSelectedCheckpoint(updatedCp);
        }
        return updatedCp;
      }
      return cp;
    });

    setCheckpoints(updatedCheckpoints);
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    localStorage.setItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel), JSON.stringify(updatedCheckpoints));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      const datesRaw = localStorage.getItem(STORAGE_KEY_DATES);
      const dates = datesRaw ? JSON.parse(datesRaw) : {};
      setDoc(roadmapDocRef, {
        checkpoints: updatedCheckpoints,
        prepStartDate: dates.prepStartDate || prepStartDate,
        examDate: dates.examDate || examDate,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    // Direct Revision Planner update
    if (targetSubId) {
      const subId = targetSubId;
      const localRevKey = getLevelScopedKey(`practca_revision_planner_${subId}`, caLevel);
      try {
        const stored = localStorage.getItem(localRevKey);
        const parsed = stored ? JSON.parse(stored) : { revisionsCount: 3, chapters: {} };
        const chaptersObj = parsed.chapters || {};
        const canon = getCanonicalChapterKey(subId, cleanChapterName);
        const currentEntry = chaptersObj[canon] || chaptersObj[cleanChapterName] || {};
        const currentRevState = currentEntry[targetRevKey] || { completed: false, hours: '' };
        const existingHoursNum = parseFloat(currentRevState.hours || '0') || 0;

        chaptersObj[canon] = {
          ...currentEntry,
          [targetRevKey]: {
            ...currentRevState,
            completed: true,
            completedAt: targetDateStr || new Date().toISOString().split('T')[0],
            isManualDateOverride: false,
            skipped: false,
            hours: existingHoursNum > 0 ? (currentRevState.hours || '1.0') : '1.0'
          }
        };

        parsed.chapters = chaptersObj;
        localStorage.setItem(localRevKey, JSON.stringify(parsed));

        if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
          const revDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRevisionDocId(subId, caLevel));
          setDoc(revDocRef, {
            subjectId: subId,
            revisionsCount: parsed.revisionsCount || 3,
            chapters: chaptersObj,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      } catch (e) {
        console.warn('Error updating revision planner in handleToggleChapter:', e);
      }
    }

    // Update local task stores
    try {
      ['practca_local_tasks', 'practca_cached_cloud_tasks'].forEach(baseStoreKey => {
        const storeKey = getLevelScopedKey(baseStoreKey, caLevel);
        const raw = localStorage.getItem(storeKey);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            let changed = false;
            const updated = list.map((t: any) => {
              const tSub = t.subjectCode;
              const subMatches = !targetSubId || !tSub || String(tSub).toUpperCase() === targetSubId.toUpperCase();
              const tClean = normalizeKey(t.cleanTitle || t.title);
              const tChap = normalizeKey(t.chapterName);
              const isMatch = subMatches && (tClean === cleanNorm || tChap === cleanNorm || tClean === chapNorm || tChap === chapNorm);
              if (isMatch) {
                changed = true;
                return {
                  ...t,
                  status: 'completed',
                  completed: new Date().toISOString()
                };
              }
              return t;
            });
            if (changed) {
              localStorage.setItem(storeKey, JSON.stringify(updated));
            }
          }
        }
      });
    } catch (e) {}

    try {
      await syncTaskCompletionAcrossAllLinks(
        {
          title: cleanChapterName,
          cleanTitle: cleanChapterName,
          chapterName: cleanChapterName,
          subjectCode: targetSubId,
          due: targetDateStr,
          taskDate: targetDateStr,
          milestoneId: checkpointId,
          revKey: targetRevKey,
          phaseId: targetPhaseId
        },
        true,
        {
          selectedDate: targetDateStr,
          milestoneId: checkpointId,
          phaseId: targetPhaseId,
          revKey: targetRevKey
        }
      );
    } catch (e) {}

    if (onToggleTaskCompleted) {
      const matchingTask = tasks.find(t => {
        const tClean = (t.cleanTitle || t.title || '').trim().toLowerCase();
        const tChap = (t.chapterName || '').trim().toLowerCase();
        const cClean = cleanChapterName.trim().toLowerCase();
        const subMatches = !targetSubId || !t.subjectCode || String(t.subjectCode).toUpperCase() === targetSubId.toUpperCase();
        return subMatches && (tClean === cClean || tChap === cClean);
      });
      if (matchingTask) {
        onToggleTaskCompleted(matchingTask, true, 'completed');
      }
    }

    setForceUpdate(v => v + 1);
    setTimeout(() => {
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_task_completion_changed'));
      window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
      window.dispatchEvent(new Event('practca_revision_planner_updated'));
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('storage'));
      isApplyingExternalSyncRef.current = false;
    }, 60);

    if (targetCp && is15DaySprintCheckpoint(targetCp)) {
      triggerFinalRevisionConfetti({
        taskTitle: cleanChapterName,
        subjectCode: targetSubId,
        milestoneTitle: targetCp.customTitle || `${targetSubId || ''} Final Revision`
      });
    }

    setUndoBannerInfo({
      message: `✓ Completed: "${cleanChapterName}"`,
      action: {
        label: 'Undo Target',
        checkpointId,
        chapterName
      }
    });
    setPlanApplyBanner(`✓ Completed: "${cleanChapterName}" in milestone.`);
    setTimeout(() => {
      setPlanApplyBanner(prev => prev?.includes(cleanChapterName) ? null : prev);
    }, 4500);
  };

  // Disintegrate a single milestone into N sequential sub-milestones (Part 1..N) with non-overlapping chapters
  const handleSplitMilestoneIntoParts = (checkpointId: string, numParts: number) => {
    const targetCp = checkpoints.find(c => c.id === checkpointId);
    if (!targetCp || numParts < 2) return;

    const isSub = targetCp.subjectId !== 'CUSTOM';
    const fullChaps = (targetCp.selectedChapters && targetCp.selectedChapters.length > 0)
      ? targetCp.selectedChapters
      : (isSub ? getMilestoneSubjectChapters(targetCp.subjectId as SubjectId) : []);

    if (fullChaps.length < numParts) return;

    // Determine start date for spacing target dates across parts
    const cpIdx = sortedCheckpoints.findIndex(c => c.id === checkpointId);
    const startStr = targetCp.startDate || (cpIdx > 0 ? sortedCheckpoints[cpIdx - 1].targetDate : prepStartDate);
    const startMs = new Date(`${startStr}T00:00:00`).getTime();
    const endMs = new Date(`${targetCp.targetDate}T00:00:00`).getTime();
    const spanMs = Math.max(numParts * 86400000, endMs - startMs);

    const chunkSize = Math.ceil(fullChaps.length / numParts);
    const existingDoneSet = new Set(targetCp.completedChapters || []);
    const baseTitle = (targetCp.customTitle || (isSub ? targetCp.subjectId : 'Milestone')).replace(/\s*•\s*Part\s*\d+\/\d+/i, '').trim();

    const newParts: UserCheckpoint[] = [];
    for (let p = 0; p < numParts; p++) {
      const slice = fullChaps.slice(p * chunkSize, (p + 1) * chunkSize);
      if (slice.length === 0) continue;
      const partStartMs = startMs + Math.round((spanMs * p) / numParts);
      const partEndMs = p === numParts - 1 ? Math.max(endMs, startMs + spanMs) : startMs + Math.round((spanMs * (p + 1)) / numParts);
      const partStartStr = new Date(partStartMs).toISOString().split('T')[0];
      const partEndStr = new Date(partEndMs).toISOString().split('T')[0];
      const partDone = slice.filter(ch => existingDoneSet.has(ch));

      newParts.push({
        ...targetCp,
        id: p === 0 ? targetCp.id : `cp_split_${targetCp.id}_p${p + 1}_${Date.now()}`,
        customTitle: `${baseTitle} • Part ${p + 1}/${numParts}`,
        startDate: partStartStr,
        targetDate: partEndStr,
        selectedChapters: slice,
        targetChapters: slice.length,
        completedChapters: partDone,
        allocatedHoursTotal: targetCp.allocatedHoursTotal
          ? Number(((targetCp.allocatedHoursTotal * slice.length) / fullChaps.length).toFixed(1))
          : undefined
      });
    }

    setCheckpoints(prev => {
      const next = prev.flatMap(c => (c.id === checkpointId ? newParts : [c]));
      return next;
    });
    if (selectedCheckpoint?.id === checkpointId && newParts.length > 0) {
      setSelectedCheckpoint(newParts[0]);
    }
    setPlanApplyBanner(`Disintegrated "${baseTitle}" into ${newParts.length} isolated part-milestones with non-overlapping chapters.`);
    setTimeout(() => setPlanApplyBanner(null), 5000);
  };

  // Disintegrate & isolate all same-subject milestones across the roadmap
  const handleDisintegrateAllSameSubjectMilestones = () => {
    const { updated, changed } = disintegrateAndSanitizeSameSubjectMilestones(checkpoints, {
      forcePartitionSameCycle: true,
      stripLeakedCompletions: true
    });
    if (changed) {
      setCheckpoints(updated);
      if (selectedCheckpoint) {
        const refreshed = updated.find(c => c.id === selectedCheckpoint.id);
        if (refreshed) setSelectedCheckpoint(refreshed);
      }
      setPlanApplyBanner('Same-subject milestones disintegrated into isolated chapter scopes & independent completion states.');
      setTimeout(() => setPlanApplyBanner(null), 5000);
    } else {
      setPlanApplyBanner('All milestones are already isolated with independent chapter completion tracking.');
      setTimeout(() => setPlanApplyBanner(null), 4000);
    }
  };

  const handleUpdateMilestoneCondition = (checkpointId: string, condition: MilestoneCompletionCondition) => {
    const existingCp = checkpoints.find(c => c.id === checkpointId);
    if (existingCp && existingCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(existingCp.subjectId)) return;
    let targetCp: UserCheckpoint | undefined;
    const stats = checkpointStats.get(checkpointId);
    const isChaptersAllDone = stats ? (stats.completedChaptersCount >= stats.totalChapters && stats.totalChapters > 0) : false;

    const updatedCheckpoints = checkpoints.map(cp => {
      if (cp.id !== checkpointId) return cp;
      targetCp = cp;
      let nextCompleted = cp.completed;
      if (condition === 'targets_only' && isChaptersAllDone) {
        nextCompleted = true;
      } else if (condition === 'mock_test_required' && !cp.mockTestCompleted) {
        nextCompleted = undefined;
      }
      const updated = { ...cp, completionCondition: condition, completed: nextCompleted };
      if (selectedCheckpoint?.id === checkpointId) {
        setSelectedCheckpoint(updated);
      }
      return updated;
    });

    setCheckpoints(updatedCheckpoints);
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    localStorage.setItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel), JSON.stringify(updatedCheckpoints));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      setDoc(roadmapDocRef, {
        checkpoints: updatedCheckpoints,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    if (condition === 'mock_test_required') {
      const cp = targetCp || checkpoints.find(c => c.id === checkpointId);
      if (cp) {
        const sub = cp.subjectId !== 'CUSTOM' ? cp.subjectId : 'CA';
        setMockSlotScheduleModal({
          checkpoint: cp,
          dateStr: cp.targetDate,
          startTime: '14:00',
          endTime: '17:00',
          title: `[${sub}] Mock Test Paper (${cp.revisionCycle || 'ICAI Exam Condition'})`
        });
      }
    }
  };

  const handleConfirmMockTestClockSlot = (customStart?: string, customEnd?: string) => {
    if (!mockSlotScheduleModal) return;
    const { checkpoint, dateStr, title } = mockSlotScheduleModal;
    const startTime = customStart || mockSlotScheduleModal.startTime || '14:00';
    const endTime = customEnd || mockSlotScheduleModal.endTime || '17:00';

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = (startH || 14) * 60 + (startM || 0);
    const endMinutes = (endH || 17) * 60 + (endM || 0);
    const durationMinutes = Math.max(15, endMinutes - startMinutes);

    const sub = checkpoint.subjectId !== 'CUSTOM' ? (checkpoint.subjectId as SubjectId) : (levelSubjects[0] || 'FR');
    const newSlot: TargetClockSlot = {
      id: `slot_mock_${checkpoint.id}_${Date.now()}`,
      targetId: `mock_test_${checkpoint.id}`,
      title: title || `[${sub}] Mock Test Paper (ICAI Exam Slot 2:00 PM - 5:00 PM)`,
      chapterName: 'ICAI Mock Test Paper',
      subjectCode: sub,
      relevance: 'Final Revision',
      startTime,
      endTime,
      startMinutes,
      endMinutes,
      durationMinutes,
      status: 'pending'
    };

    const clockStorageKey = getClockSlotsStorageKey(dateStr, caLevel);
    try {
      const raw = localStorage.getItem(clockStorageKey);
      const existingSlots: any[] = raw ? JSON.parse(raw) : [];
      const filtered = existingSlots.filter(s => s.targetId !== `mock_test_${checkpoint.id}` && s.id !== `slot_mock_${checkpoint.id}`);
      filtered.push(newSlot);
      filtered.sort((a, b) => (a.startMinutes || 0) - (b.startMinutes || 0));
      localStorage.setItem(clockStorageKey, JSON.stringify(filtered));

      window.dispatchEvent(new Event('practca_24h_clock_updated'));
      window.dispatchEvent(new Event('practca_target_system_synced'));
      window.dispatchEvent(new Event('storage'));

      setPlanApplyBanner(`🎯 Scheduled 3-Hour ICAI Mock Test slot (${startTime} - ${endTime}) on ${dateStr} in 24-Hour Clock!`);
      setTimeout(() => setPlanApplyBanner(null), 5000);
    } catch (e) {
      console.error('Failed to add mock test slot to 24h clock:', e);
    }

    setMockSlotScheduleModal(null);
  };

  const handleUpdateMockTestStatus = (checkpointId: string, completed: boolean, score?: number) => {
    const existingCp = checkpoints.find(c => c.id === checkpointId);
    if (existingCp && existingCp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(existingCp.subjectId)) return;
    let targetCp: UserCheckpoint | undefined;
    const stats = checkpointStats.get(checkpointId);
    const isChaptersAllDone = stats ? (stats.completedChaptersCount >= stats.totalChapters && stats.totalChapters > 0) : false;

    const updatedCheckpoints = checkpoints.map(cp => {
      if (cp.id !== checkpointId) return cp;
      targetCp = cp;
      const updated = {
        ...cp,
        mockTestCompleted: completed,
        mockScoreObtained: score,
        mockMaxMarks: cp.mockMaxMarks || 100,
        completed: (completed && isChaptersAllDone) ? true : (completed ? cp.completed : undefined)
      };
      if (selectedCheckpoint?.id === checkpointId) {
        setSelectedCheckpoint(updated);
      }
      return updated;
    });

    setCheckpoints(updatedCheckpoints);
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    localStorage.setItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel), JSON.stringify(updatedCheckpoints));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      setDoc(roadmapDocRef, {
        checkpoints: updatedCheckpoints,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    // If milestone test was marked completed (completed === true), check for pending targets & prompt immediately
    if (completed) {
      const currentCp = targetCp || checkpoints.find(c => c.id === checkpointId);
      if (currentCp) {
        const stats = checkpointStats.get(checkpointId);
        const pendingChapters = stats?.pendingList || [];

        // Find tasks linked to this milestone
        const relevantTasks = (tasks || []).filter(t => {
          if (t.milestoneId && t.milestoneId === checkpointId) return true;
          if (typeof t.notes === 'string' && t.notes.includes(checkpointId)) return true;
          if (t.subjectCode === currentCp.subjectId) {
            const titleMatches = pendingChapters.some(ch =>
              (t.chapterName && t.chapterName.toLowerCase().includes(ch.toLowerCase())) ||
              (t.cleanTitle && t.cleanTitle.toLowerCase().includes(ch.toLowerCase())) ||
              (t.title && t.title.toLowerCase().includes(ch.toLowerCase()))
            );
            if (titleMatches) return true;
          }
          return false;
        });

        const pendingTasks = relevantTasks.filter(t => t.status !== 'completed' && !t.completed);

        if (pendingTasks.length > 0 || pendingChapters.length > 0) {
          setMilestoneTestPendingModal({
            checkpoint: { ...currentCp, mockTestCompleted: true, mockScoreObtained: score },
            pendingTasks,
            pendingChapters
          });
        }
      }
    }
  };

  // Action 1: Close Pending Targets (Mark Completed with Post-Test Note, Skipped in Revision Planner, and Milestone Achieved)
  const handleClosePendingMilestoneTargets = async () => {
    if (!milestoneTestPendingModal) return;
    const { checkpoint, pendingTasks, pendingChapters } = milestoneTestPendingModal;
    const POST_TEST_NOTE = '[Completed Post-Test Assessment]';

    // 1. Mark all pending tasks as completed with note
    const updatedTasks = (tasks || []).map(t => {
      const isTarget = pendingTasks.some(pt => pt.id === t.id);
      if (isTarget) {
        const cleanNotes = (t.notes || '').trim();
        const newNotes = cleanNotes ? `${cleanNotes}\n${POST_TEST_NOTE}` : POST_TEST_NOTE;
        return {
          ...t,
          status: 'completed' as const,
          completed: new Date().toISOString(),
          notes: newNotes
        };
      }
      return t;
    });

    // 2. Mark milestone chapters as completed in checkpoint and mark milestone achieved
    const isSub = checkpoint.subjectId !== 'CUSTOM';
    const allMilestoneChaps = (checkpoint.selectedChapters && checkpoint.selectedChapters.length > 0)
      ? checkpoint.selectedChapters
      : (isSub ? getMilestoneSubjectChapters(checkpoint.subjectId as SubjectId) : pendingChapters);

    const updatedCheckpoints = checkpoints.map(cp => {
      if (cp.id !== checkpoint.id) return cp;
      const existingCompleted = cp.completedChapters || [];
      const mergedCompleted = Array.from(new Set([...existingCompleted, ...allMilestoneChaps, ...pendingChapters]));
      return {
        ...cp,
        completedChapters: mergedCompleted,
        mockTestCompleted: true,
        completed: true
      };
    });
    setCheckpoints(updatedCheckpoints);
    if (selectedCheckpoint?.id === checkpoint.id) {
      setSelectedCheckpoint({
        ...checkpoint,
        completedChapters: Array.from(new Set([...(checkpoint.completedChapters || []), ...allMilestoneChaps, ...pendingChapters])),
        mockTestCompleted: true,
        completed: true
      });
    }

    // 3. Mark respective revision in RevisionPlanner as skipped & completed
    if (isSub) {
      const subId = checkpoint.subjectId as SubjectId;
      const revStorageKey = getLevelScopedKey(`practca_revision_planner_${subId}`, caLevel);
      try {
        const stored = localStorage.getItem(revStorageKey);
        const parsed = stored ? JSON.parse(stored) : { revisionsCount: 3, chapters: {} };
        const chaptersObj = parsed.chapters || {};

        let targetRevKey = 'rev1';
        if (/2nd/i.test(checkpoint.revisionCycle)) targetRevKey = 'rev2';
        else if (/3rd/i.test(checkpoint.revisionCycle)) targetRevKey = 'rev3';
        else if (/final|1\.5/i.test(checkpoint.revisionCycle)) targetRevKey = 'rev1.5';

        const completionDate = checkpoint.targetDate || new Date().toISOString().split('T')[0];
        const chaptersToMark = Array.from(new Set([...pendingChapters, ...allMilestoneChaps]));

        chaptersToMark.forEach(ch => {
          const canon = getCanonicalChapterKey(subId, ch);
          const currentChap = chaptersObj[canon] || chaptersObj[ch] || {};
          const currentCycleState = currentChap[targetRevKey] || {};
          const existingHoursNum = parseFloat(currentCycleState.hours || '0') || 0;
          const hasExistingTime = existingHoursNum > 0;

          chaptersObj[canon] = {
            ...currentChap,
            [targetRevKey]: {
              ...currentCycleState,
              completed: true,
              skipped: !hasExistingTime,
              partiallyDone: hasExistingTime,
              hours: hasExistingTime ? (currentCycleState.hours || '0.0') : '0',
              completedAt: completionDate
            }
          };
        });

        parsed.chapters = chaptersObj;
        localStorage.setItem(revStorageKey, JSON.stringify(parsed));

        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
          const revDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRevisionDocId(subId, caLevel));
          setDoc(revDocRef, {
            subjectId: subId,
            revisionsCount: parsed.revisionsCount || 3,
            chapters: chaptersObj,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }
      } catch (e) {
        console.warn('Could not update revision report for skipped items:', e);
      }
    }

    // 4. Save tasks & checkpoints to localStorage and Firestore
    localStorage.setItem(getLevelScopedKey('practca_local_tasks', caLevel), JSON.stringify(updatedTasks));
    localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks', caLevel), JSON.stringify(updatedTasks));
    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    localStorage.setItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel), JSON.stringify(updatedCheckpoints));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getFirestoreRoadmapDocId(caLevel));
      setDoc(roadmapDocRef, {
        checkpoints: updatedCheckpoints,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }

    // 5. Synchronize across links (with skipped: true)
    for (const pt of pendingTasks) {
      try {
        await syncTaskCompletionAcrossAllLinks(
          { id: pt.id, title: pt.title, chapterName: pt.chapterName, subjectCode: pt.subjectCode, notes: POST_TEST_NOTE },
          true,
          { milestoneId: checkpoint.id, selectedDate: checkpoint.targetDate, skipped: true }
        );
      } catch (e) {}
    }

    if (onApplyGeneratedTasks) {
      onApplyGeneratedTasks(updatedTasks);
    }

    window.dispatchEvent(new Event('practca_tasks_updated'));
    window.dispatchEvent(new Event('practca_task_completion_changed'));
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
    window.dispatchEvent(new Event('storage'));

    const closedCount = pendingTasks.length > 0 ? pendingTasks.length : pendingChapters.length;
    setPlanApplyBanner(`✅ Milestone Test closed: marked ${closedCount} targets done (logged in Revision Report) & Milestone achieved!`);
    setTimeout(() => setPlanApplyBanner(null), 5000);
    setMilestoneTestPendingModal(null);
  };

  // Action 2: Spread Over Upcoming Study Days (Fill today to capacity, then spread)
  const handleSpreadPendingMilestoneTargets = async () => {
    if (!milestoneTestPendingModal) return;
    const { checkpoint, pendingTasks, pendingChapters } = milestoneTestPendingModal;

    const today = new Date().toISOString().split('T')[0];
    const MAX_DAILY_CAPACITY = 3;
    const todayActiveCount = (tasks || []).filter(t => (t.due || t.taskDate)?.split('T')[0] === today && t.status !== 'completed').length;
    const availableSlotsToday = Math.max(0, MAX_DAILY_CAPACITY - todayActiveCount);

    let targetsToSchedule: any[] = [...pendingTasks];

    // If there are chapters without task items, create task items for them
    const pendingChapsWithoutTasks = pendingChapters.filter(ch => 
      !pendingTasks.some(pt => (pt.chapterName && pt.chapterName.toLowerCase() === ch.toLowerCase()) || (pt.title && pt.title.toLowerCase().includes(ch.toLowerCase())))
    );

    pendingChapsWithoutTasks.forEach((ch, idx) => {
      targetsToSchedule.push({
        id: `m-task-${checkpoint.id}-${Date.now()}-${idx}`,
        title: `${ch}`,
        cleanTitle: ch,
        chapterName: ch,
        subjectCode: checkpoint.subjectId === 'CUSTOM' ? 'AFM' : checkpoint.subjectId,
        milestoneId: checkpoint.id,
        status: 'needsAction'
      });
    });

    const todaySlotted = targetsToSchedule.slice(0, availableSlotsToday);
    const overflow = targetsToSchedule.slice(availableSlotsToday);

    const taskToNewDate: Record<string, string> = {};
    todaySlotted.forEach(t => {
      taskToNewDate[t.id] = today;
    });

    if (overflow.length > 0) {
      const baseD = new Date();
      const futureDates: string[] = [];
      for (let i = 1; i <= 7; i++) {
        const nextD = new Date(baseD.getTime() + i * 24 * 60 * 60 * 1000);
        const y = nextD.getFullYear();
        const m = String(nextD.getMonth() + 1).padStart(2, '0');
        const d = String(nextD.getDate()).padStart(2, '0');
        futureDates.push(`${y}-${m}-${d}`);
      }
      overflow.forEach((t, idx) => {
        const dayIdx = Math.floor(idx / 2) % futureDates.length;
        taskToNewDate[t.id] = futureDates[dayIdx];
      });
    }

    let updatedTasks = [...(tasks || [])];
    targetsToSchedule.forEach(t => {
      const newD = taskToNewDate[t.id] || today;
      const existingIdx = updatedTasks.findIndex(existing => existing.id === t.id);
      if (existingIdx !== -1) {
        updatedTasks[existingIdx] = {
          ...updatedTasks[existingIdx],
          due: `${newD}T12:00:00.000Z`,
          taskDate: newD
        };
      } else {
        updatedTasks.push({
          ...t,
          due: `${newD}T12:00:00.000Z`,
          taskDate: newD
        });
      }
    });

    localStorage.setItem(getLevelScopedKey('practca_local_tasks', caLevel), JSON.stringify(updatedTasks));
    localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks', caLevel), JSON.stringify(updatedTasks));

    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
      targetsToSchedule.forEach(t => {
        const newD = taskToNewDate[t.id] || today;
        const docRef = firestoreDoc(db, 'users', currentUser.uid, getFirestoreTasksCollectionName(caLevel), t.id);
        setDoc(docRef, {
          ...t,
          due: `${newD}T12:00:00.000Z`,
          taskDate: newD,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
      });
    }

    if (onApplyGeneratedTasks) {
      onApplyGeneratedTasks(updatedTasks);
    }

    window.dispatchEvent(new Event('practca_tasks_updated'));
    window.dispatchEvent(new Event('practca_target_system_sync'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
    window.dispatchEvent(new Event('storage'));

    setPlanApplyBanner(`⚡ Rescheduled ${targetsToSchedule.length} pending targets: filled today's capacity (${todaySlotted.length}) and spread ${overflow.length} across upcoming study blocks.`);
    setTimeout(() => setPlanApplyBanner(null), 4000);
    setMilestoneTestPendingModal(null);
  };

  // ─────────────────────────────────────────────────────────────
  // MILESTONE CALENDAR VIEW STATE & SPAN RESOLUTION ENGINE
  // ─────────────────────────────────────────────────────────────
  const [calendarMonthDate, setCalendarMonthDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarColorMode, setCalendarColorMode] = useState<'subject' | 'status'>('subject');
  const [hoveredMilestoneId, setHoveredMilestoneId] = useState<string | null>(null);
  const hasAutoSyncedCalendarMonthRef = useRef<boolean>(false);

  // Resolve effective [startDate, targetDate] window for every milestone
  const milestoneSpans = useMemo(() => {
    const addOneDayStr = (ymd: string): string => {
      try {
        const [y, m, d] = ymd.split('-').map(Number);
        const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
        dt.setDate(dt.getDate() + 1);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
      } catch {
        return ymd;
      }
    };

    return sortedCheckpoints.map((cp, idx) => {
      const targetStr = cp.targetDate;
      let startStr = cp.startDate && cp.startDate <= targetStr ? cp.startDate : '';
      if (!startStr) {
        if (idx > 0) {
          const prevTarget = sortedCheckpoints[idx - 1].targetDate;
          const nextDayAfterPrev = addOneDayStr(prevTarget);
          startStr = nextDayAfterPrev <= targetStr ? nextDayAfterPrev : targetStr;
        } else {
          startStr = prepStartDate && prepStartDate <= targetStr ? prepStartDate : targetStr;
        }
      }
      return {
        checkpoint: cp,
        index: idx + 1,
        effectiveStart: startStr,
        effectiveEnd: targetStr
      };
    });
  }, [sortedCheckpoints, prepStartDate]);

  // Automatically jump initial calendar month to first active/upcoming milestone month if current month has none
  useEffect(() => {
    if (hasAutoSyncedCalendarMonthRef.current || milestoneSpans.length === 0) return;
    const now = new Date();
    const currentYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const hasInCurrentMonth = milestoneSpans.some(
      ms => ms.effectiveStart.slice(0, 7) <= currentYm && ms.effectiveEnd.slice(0, 7) >= currentYm
    );
    if (!hasInCurrentMonth) {
      const targetCp = nextUpcomingCheckpoint?.checkpoint || milestoneSpans[0].checkpoint;
      if (targetCp?.targetDate) {
        const [y, m] = targetCp.targetDate.split('-').map(Number);
        if (y && m) {
          setCalendarMonthDate(new Date(y, m - 1, 1));
        }
      }
    }
    hasAutoSyncedCalendarMonthRef.current = true;
  }, [milestoneSpans, nextUpcomingCheckpoint]);

  // Distinct months that contain milestones for 1-click quick jump
  const milestoneMonthsList = useMemo(() => {
    const map = new Map<string, { ym: string; year: number; monthIdx: number; label: string; count: number }>();
    const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    milestoneSpans.forEach(ms => {
      const startYm = ms.effectiveStart.slice(0, 7);
      const endYm = ms.effectiveEnd.slice(0, 7);
      const [sy, sm] = startYm.split('-').map(Number);
      const [ey, em] = endYm.split('-').map(Number);
      if (!sy || !sm || !ey || !em) return;
      const cur = new Date(sy, sm - 1, 1);
      const endDt = new Date(ey, em - 1, 1);
      let guard = 0;
      while (cur.getTime() <= endDt.getTime() && guard < 36) {
        const y = cur.getFullYear();
        const mIdx = cur.getMonth();
        const ymKey = `${y}-${String(mIdx + 1).padStart(2, '0')}`;
        const existing = map.get(ymKey);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(ymKey, {
            ym: ymKey,
            year: y,
            monthIdx: mIdx,
            label: `${monthNamesShort[mIdx]} '${String(y).slice(-2)}`,
            count: 1
          });
        }
        cur.setMonth(cur.getMonth() + 1);
        guard++;
      }
    });
    return Array.from(map.values()).sort((a, b) => a.ym.localeCompare(b.ym));
  }, [milestoneSpans]);

  // Clean, human-readable Subject Name helper (zero internal code jargon)
  const getCleanSubjectName = (subId: SubjectId | 'CUSTOM', customTitle?: string): string => {
    if (subId === 'CUSTOM') {
      return customTitle?.trim() || 'Custom Study Milestone';
    }
    const rawFull = SUBJECT_FULL_NAMES[subId] || String(subId);
    const strippedPaper = rawFull.replace(/\s*\(Paper\s*\d+\)/i, '').trim();
    const conciseMap: Partial<Record<SubjectId, string>> = {
      FR: 'Financial Reporting',
      AFM: 'Adv. Financial Mgmt',
      Audit: 'Auditing & Ethics',
      DT: 'Direct & Intl. Tax',
      IDT: 'Indirect Tax Laws',
      IBS: 'Integrated Business Solutions',
      Accounts: 'Accounting',
      Law: 'Business Laws',
      MathStats: 'Quantitative Aptitude',
      Econ: 'Business Economics',
      AdvAcc: 'Advanced Accounting',
      CorpLaw: 'Corporate & Other Laws',
      Tax: 'Taxation (DT & GST)',
      Cost: 'Cost & Mgmt Accounting',
      AuditInter: 'Auditing & Ethics',
      FMSM: 'Financial & Strategic Mgmt',
      CMAFoundLaw: 'Business Laws & Comm.',
      CMAFoundAcc: 'Financial & Cost Accounting',
      CMAFoundMath: 'Business Math & Stats',
      CMAFoundEcon: 'Business Economics & Mgmt',
      CMAInterLaw: 'Business Laws & Ethics',
      CMAInterFA: 'Financial Accounting',
      CMAInterTax: 'Direct & Indirect Tax',
      CMAInterCost: 'Cost Accounting',
      CMAInterOMSM: 'Operations & Strategic Mgmt',
      CMAInterCAA: 'Corp. Accounting & Audit',
      CMAInterFMDA: 'Financial Mgmt & Analytics',
      CMAInterMA: 'Management Accounting',
      CMAFinalLaw: 'Corporate & Economic Laws',
      CMAFinalSFM: 'Strategic Financial Mgmt',
      CMAFinalDT: 'Direct & International Tax',
      CMAFinalSCM: 'Strategic Cost Mgmt',
      CMAFinalCMA: 'Cost & Management Audit',
      CMAFinalCFR: 'Corp. Financial Reporting',
      CMAFinalIDT: 'Indirect Tax Laws & Practice',
      CMAFinalSPBV: 'Strategic Perf. & Valuation'
    };
    const cleanSub = conciseMap[subId] || strippedPaper;
    if (customTitle && customTitle.trim()) {
      const cleanedCustom = customTitle
        .replace(new RegExp(`^${subId}\\b\\s*[•\\-:]?\\s*`, 'i'), '')
        .replace(/1\.5-Day\s+Final\s+Exam\s+Sprint/i, '')
        .trim();
      if (cleanedCustom && cleanedCustom.toLowerCase() !== cleanSub.toLowerCase()) {
        return `${cleanSub} • ${cleanedCustom}`;
      }
    }
    return cleanSub;
  };

  // Clean cycle label without technical jargon
  const getCleanCycleLabel = (cp: UserCheckpoint): string => {
    if (isSubjectFinalExamSprint(cp, examDate) || is15DaySprintCheckpoint(cp)) {
      return 'Final Exam Prep';
    }
    const cyc = String(cp.revisionCycle || '').trim();
    if (!cyc || cyc === 'Custom') return 'Study Target';
    return cyc;
  };

  // Resolve visual color palette for a milestone in Subject or Status color mode (with frosted glass tokens)
  const resolveMilestoneVisualStyle = (cp: UserCheckpoint) => {
    const stats = checkpointStats.get(cp.id);
    const isDone = Boolean(stats && stats.fillPercentage >= 100) || Boolean(cp.completed);
    const isOverdue = Boolean(stats?.isOverdue && !isDone);
    const isFinalExam = isSubjectFinalExamSprint(cp, examDate);
    const theme = SUBJECT_THEMES[cp.subjectId] || SUBJECT_THEMES.CUSTOM;
    const cleanName = getCleanSubjectName(cp.subjectId, cp.customTitle);

    if (calendarColorMode === 'status') {
      if (isDone) {
        return {
          hex: '#10b981',
          label: cleanName,
          spanBg: 'rgba(16, 185, 129, 0.22)',
          cellTint: 'rgba(16, 185, 129, 0.10)',
          targetBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.42), rgba(5, 150, 105, 0.68))',
          border: 'rgba(52, 211, 153, 0.65)',
          text: '#ecfdf5',
          subText: '#a7f3d0'
        };
      }
      if (isOverdue) {
        return {
          hex: '#f43f5e',
          label: cleanName,
          spanBg: 'rgba(244, 63, 94, 0.22)',
          cellTint: 'rgba(244, 63, 94, 0.10)',
          targetBg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.42), rgba(190, 18, 60, 0.68))',
          border: 'rgba(251, 113, 133, 0.65)',
          text: '#fff1f2',
          subText: '#fecdd3'
        };
      }
      if (isFinalExam) {
        return {
          hex: '#f59e0b',
          label: cleanName,
          spanBg: 'rgba(245, 158, 11, 0.24)',
          cellTint: 'rgba(245, 158, 11, 0.11)',
          targetBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.45), rgba(180, 83, 9, 0.72))',
          border: 'rgba(251, 191, 36, 0.75)',
          text: '#fffbeb',
          subText: '#fde68a'
        };
      }
      return {
        hex: '#38bdf8',
        label: cleanName,
        spanBg: 'rgba(56, 189, 248, 0.20)',
        cellTint: 'rgba(56, 189, 248, 0.09)',
        targetBg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.38), rgba(3, 105, 161, 0.68))',
        border: 'rgba(56, 189, 248, 0.65)',
        text: '#f0f9ff',
        subText: '#bae6fd'
      };
    }

    // Subject Color Mode ('subject') — Frosted Glass Translucent Gradients
    const baseHex = theme.color || '#a855f7';
    return {
      hex: baseHex,
      label: cleanName,
      spanBg: `${baseHex}33`, // ~20% frosted tint
      cellTint: `${baseHex}18`, // ~9.5% cell glass wash
      targetBg: `linear-gradient(135deg, ${baseHex}66, ${baseHex}99)`,
      border: isDone ? '#34d399' : isOverdue ? '#fb7185' : `${baseHex}B3`,
      text: '#ffffff',
      subText: '#e2e8f0'
    };
  };

  // Open Add Milestone Modal pre-populated with a clicked calendar date
  const handleOpenAddMilestoneForDate = (dateStr: string) => {
    if (isLmrMode) return;
    setNewStartDate(dateStr);
    setNewTargetDate(dateStr);
    setShowAddModal(true);
  };

  // Render the interactive Milestone Calendar View (used in both main workspace & expanded full-screen modal)
  const renderMilestoneCalendarView = (isExpandedModal: boolean = false) => {
    const viewYear = calendarMonthDate.getFullYear();
    const viewMonth = calendarMonthDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYm = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];

    // Map scheduled subject exam dates so specific exam names appear cleanly on exam days
    const scheduledExamsByDate = new Map<string, { subjectId: SubjectId; fullName: string; paperNumber: number }[]>();
    if (examScheduleInfo.hasScheduledExam && Array.isArray(examScheduleInfo.orderedExams)) {
      examScheduleInfo.orderedExams.forEach(ex => {
        if (!ex.dateStr) return;
        const cleanExName = getCleanSubjectName(ex.subjectId);
        const list = scheduledExamsByDate.get(ex.dateStr) || [];
        list.push({
          subjectId: ex.subjectId,
          fullName: cleanExName,
          paperNumber: ex.paperNumber
        });
        scheduledExamsByDate.set(ex.dateStr, list);
      });
    }

    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDayOfMonth.getDay(); // 0 (Sun) .. 6 (Sat)
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

    const calendarCells: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isPrepStart: boolean;
      isExamDate: boolean;
    }[] = [];

    for (let i = 0; i < totalCells; i++) {
      const cellDate = new Date(viewYear, viewMonth, 1 - startWeekday + i, 12, 0, 0);
      const y = cellDate.getFullYear();
      const m = String(cellDate.getMonth() + 1).padStart(2, '0');
      const d = String(cellDate.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${d}`;
      calendarCells.push({
        dateStr: dStr,
        dayNumber: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === viewMonth,
        isToday: dStr === todayStr,
        isPrepStart: dStr === prepStartDate,
        isExamDate: examScheduleInfo.hasScheduledExam && dStr === examDate
      });
    }

    // Active milestones overlapping this viewed month
    const monthMilestones = milestoneSpans.filter(ms => {
      const firstGridDate = calendarCells[0]?.dateStr || `${currentYm}-01`;
      const lastGridDate = calendarCells[calendarCells.length - 1]?.dateStr || `${currentYm}-31`;
      return ms.effectiveStart <= lastGridDate && ms.effectiveEnd >= firstGridDate;
    });

    // Unique subjects present in checkpoints for legend
    const uniqueSubjectsInPlan: (SubjectId | 'CUSTOM')[] = Array.from(
      new Set<SubjectId | 'CUSTOM'>(sortedCheckpoints.map(cp => cp.subjectId))
    );

    return (
      <div className="relative flex flex-col h-full w-full space-y-2.5 text-left">
        {/* Ambient Frosted Glass Backlight Orbs */}
        <div className="pointer-events-none absolute -top-12 left-1/4 w-72 h-40 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 right-10 w-80 h-48 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-4 left-10 w-64 h-36 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Calendar Top Control Bar — Glassmorphic Header */}
        <div className="relative z-10 bg-white/[0.04] backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.14)] rounded-2xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Left: Month/Year Navigation + Today + Milestone Month Quick-Jump Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md border border-white/[0.10] rounded-xl p-0.5 shadow-inner">
              <button
                type="button"
                onClick={() => setCalendarMonthDate(new Date(viewYear, viewMonth - 1, 1))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3.5 py-0.5 min-w-[148px] text-center font-sans font-extrabold text-xs sm:text-sm text-white tracking-wide tabular-nums">
                {monthNames[viewMonth]} {viewYear}
              </div>
              <button
                type="button"
                onClick={() => setCalendarMonthDate(new Date(viewYear, viewMonth + 1, 1))}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
              }}
              className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] backdrop-blur-md border border-white/[0.12] text-amber-300 text-xs font-semibold transition cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
            >
              Today
            </button>

            {/* Quick-Jump Month Pills for Months with Milestones */}
            {milestoneMonthsList.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-white/[0.10]">
                <span className="text-[11px] font-medium text-slate-400 mr-0.5">Months:</span>
                {milestoneMonthsList.slice(0, 6).map(mItem => {
                  const isActiveMonth = mItem.ym === currentYm;
                  return (
                    <button
                      key={mItem.ym}
                      type="button"
                      onClick={() => setCalendarMonthDate(new Date(mItem.year, mItem.monthIdx, 1))}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer flex items-center gap-1.5 tabular-nums backdrop-blur-md ${
                        isActiveMonth
                          ? 'bg-amber-400/90 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] font-bold'
                          : 'bg-white/[0.04] text-slate-200 border-white/[0.08] hover:border-white/[0.20] hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span>{mItem.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-mono ${
                        isActiveMonth ? 'bg-slate-950/80 text-amber-300' : 'bg-white/[0.10] text-amber-300'
                      }`}>
                        {mItem.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Highlight Color Mode Switcher (Subject vs Status) + Add Action */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-md border border-white/[0.10] p-0.5 rounded-xl text-[11px]">
              <span className="px-2 py-0.5 text-slate-300 flex items-center gap-1 font-medium">
                <Palette className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Color By:</span>
              </span>
              <button
                type="button"
                onClick={() => setCalendarColorMode('subject')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  calendarColorMode === 'subject'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Subject
              </button>
              <button
                type="button"
                onClick={() => setCalendarColorMode('status')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  calendarColorMode === 'status'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                Status
              </button>
            </div>

            {!isLmrMode && (
              <button
                type="button"
                onClick={() => handleOpenAddMilestoneForDate(todayStr)}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]"
                title="Click any date on the calendar to add or edit a milestone"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Subject & Status Legend Bar — Frosted Glass Strip */}
        <div className="relative z-10 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] rounded-xl px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 text-[11px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold mr-1">Subjects:</span>
            {calendarColorMode === 'subject' ? (
              uniqueSubjectsInPlan.length > 0 ? (
                uniqueSubjectsInPlan.map(subId => {
                  const th = SUBJECT_THEMES[subId] || SUBJECT_THEMES.CUSTOM;
                  const cleanSubName = getCleanSubjectName(subId);
                  return (
                    <span
                      key={`leg_${subId}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.10] text-slate-100 font-medium"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: th.color }}
                      />
                      <span>{cleanSubName}</span>
                    </span>
                  );
                })
              ) : (
                <span className="text-slate-300">Click any date below to schedule your first Subject Milestone or Exam target.</span>
              )
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-emerald-200 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Completed</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-sky-200 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>In Progress</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-amber-200 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Final Exam</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/[0.10] text-rose-200 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Overdue</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-xs bg-indigo-400/35 border border-indigo-300/60 inline-block" />
              <span>Preparation Days</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flag className="h-3 w-3 text-amber-400 fill-amber-400" />
              <strong className="text-white font-semibold">Completion / Exam Day</strong>
            </span>
          </div>
        </div>

        {/* 7-Column Frosted Glass Calendar Grid Container */}
        <div className="relative z-10 flex-1 min-h-0 flex flex-col bg-white/[0.025] backdrop-blur-2xl border border-white/[0.10] shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.12)] rounded-2xl overflow-hidden">
          {/* Weekday Header Row */}
          <div className="grid grid-cols-7 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.09] shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-300">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
              <div
                key={dayName}
                className={`py-2 px-2.5 text-center ${idx < 6 ? 'border-r border-white/[0.06]' : ''} ${
                  idx === 0 ? 'text-rose-300/90' : ''
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div
            className={`flex-1 grid grid-cols-7 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 ${
              calendarCells.length > 35 ? 'grid-rows-6' : 'grid-rows-5'
            }`}
          >
            {calendarCells.map((cell) => {
              // Find all milestones covering this date cell
              const coveringMilestones = milestoneSpans.filter(
                ms => ms.effectiveStart <= cell.dateStr && cell.dateStr <= ms.effectiveEnd
              );
              // Milestones specifically targeting this exact date as their completion targetDate
              const targetedMilestones = coveringMilestones.filter(
                ms => ms.effectiveEnd === cell.dateStr
              );
              const scheduledExamsToday = scheduledExamsByDate.get(cell.dateStr) || [];
              const primaryMs = targetedMilestones[0] || coveringMilestones[0] || null;
              const primaryStyle = primaryMs ? resolveMilestoneVisualStyle(primaryMs.checkpoint) : null;
              const isHoveredSpan = coveringMilestones.some(ms => ms.checkpoint.id === hoveredMilestoneId);
              const dayTasks = tasksByDate.get(cell.dateStr) || [];
              const completedDayTasksCount = dayTasks.filter(t => t.status === 'completed' || Boolean(t.completed)).length;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => {
                    if (primaryMs) {
                      setSelectedCheckpoint(primaryMs.checkpoint);
                    } else if (!isLmrMode) {
                      handleOpenAddMilestoneForDate(cell.dateStr);
                    }
                  }}
                  onMouseEnter={() => {
                    if (primaryMs) setHoveredMilestoneId(primaryMs.checkpoint.id);
                  }}
                  onMouseLeave={() => {
                    if (hoveredMilestoneId) setHoveredMilestoneId(null);
                  }}
                  style={{
                    backgroundColor: targetedMilestones.length > 0 && primaryStyle
                      ? `${primaryStyle.hex}26`
                      : coveringMilestones.length > 0 && primaryStyle
                        ? primaryStyle.cellTint
                        : undefined,
                    boxShadow: targetedMilestones.length > 0 && primaryStyle
                      ? `inset 0 0 0 1.5px ${primaryStyle.border}, inset 0 1px 12px ${primaryStyle.hex}33`
                      : isHoveredSpan && primaryStyle
                        ? `inset 0 0 0 1px ${primaryStyle.border}`
                        : undefined
                  }}
                  className={`group relative flex flex-col justify-between p-1.5 sm:p-2 border-b border-r border-white/[0.07] backdrop-blur-md transition-all duration-150 cursor-pointer ${
                    isExpandedModal ? 'min-h-[104px]' : 'min-h-[84px] sm:min-h-[96px]'
                  } ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-950/55 opacity-50 hover:opacity-85'
                      : 'bg-white/[0.015] hover:bg-white/[0.06]'
                  } ${
                    cell.isToday ? 'ring-1 ring-inset ring-amber-400/90 bg-amber-500/[0.06]' : ''
                  }`}
                >
                  {/* Top Row of Day Cell: Date Number + Clean Milestone/Exam Status Pills + Quick Add '+' */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span
                        className={`text-xs font-mono font-black tabular-nums px-1.5 py-0.5 rounded-lg transition ${
                          cell.isToday
                            ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                            : targetedMilestones.length > 0
                              ? 'bg-white/20 text-white backdrop-blur-xs shadow-xs'
                              : cell.isCurrentMonth
                                ? 'text-slate-200'
                                : 'text-slate-500'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {cell.isToday && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-200 border border-amber-400/40 backdrop-blur-xs">
                          Today
                        </span>
                      )}

                      {cell.isExamDate && scheduledExamsToday.length === 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 shadow-xs">
                          🏆 Exams Begin
                        </span>
                      )}

                      {cell.isPrepStart && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 backdrop-blur-xs">
                          🚀 Prep Start
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Clean Daily Study Topics Pill */}
                      {dayTasks.length > 0 && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMilestoneDot({
                              dateStr: cell.dateStr,
                              dayNum: cell.dayNumber,
                              segmentIndex: 0,
                              fromLabel: primaryMs ? getCleanSubjectName(primaryMs.checkpoint.subjectId, primaryMs.checkpoint.customTitle) : 'Daily Study',
                              toLabel: primaryMs ? getCleanCycleLabel(primaryMs.checkpoint) : 'Study Topics',
                              fromDate: primaryMs ? primaryMs.effectiveStart : cell.dateStr,
                              toDate: primaryMs ? primaryMs.effectiveEnd : cell.dateStr,
                              topics: dayTasks.map(t => t.cleanTitle || t.title).filter(Boolean),
                              completedCount: completedDayTasksCount,
                              tasksCount: dayTasks.length,
                              isToday: cell.isToday,
                              isPast: cell.dateStr < todayStr,
                              hasCompleted: completedDayTasksCount > 0,
                              segmentCompletedDays: completedDayTasksCount > 0 ? 1 : 0,
                              segmentTotalDays: 1,
                              segmentDays: [{
                                dateStr: cell.dateStr,
                                dayNum: cell.dayNumber,
                                hasCompleted: completedDayTasksCount > 0,
                                hasTasks: dayTasks.length > 0,
                                tasksCount: dayTasks.length,
                                completedCount: completedDayTasksCount,
                                topics: dayTasks.map(t => t.cleanTitle || t.title).filter(Boolean),
                                isToday: cell.isToday,
                                isPast: cell.dateStr < todayStr
                              }]
                            });
                          }}
                          className={`text-[9.5px] font-medium px-1.5 py-0.2 rounded-md border tabular-nums backdrop-blur-md transition ${
                            completedDayTasksCount === dayTasks.length
                              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                              : 'bg-white/[0.06] text-slate-200 border-white/[0.12] hover:border-cyan-400/60'
                          }`}
                          title={`${completedDayTasksCount} of ${dayTasks.length} study topics completed on ${cell.dateStr} (Click to view topics)`}
                        >
                          {completedDayTasksCount === dayTasks.length
                            ? `✓ ${dayTasks.length} Done`
                            : `${completedDayTasksCount}/${dayTasks.length} Topics`}
                        </span>
                      )}

                      {/* Quick Add Milestone Button on Hover */}
                      {!isLmrMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddMilestoneForDate(cell.dateStr);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md bg-white/[0.08] hover:bg-amber-400 text-slate-200 hover:text-slate-950 border border-white/[0.15] backdrop-blur-md transition cursor-pointer"
                          title={`Add milestone on ${cell.dateStr}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Milestone Roadmap Cards & Specific Subject / Exam Completion Labels */}
                  <div className="space-y-1 mt-1.5">
                    {/* Dedicated Exam Day Label if an official paper exam is scheduled on this date and not already rendered as a target checkpoint */}
                    {scheduledExamsToday
                      .filter(ex => !targetedMilestones.some(ms => ms.checkpoint.subjectId === ex.subjectId))
                      .map(ex => (
                        <div
                          key={`sched_exam_${ex.subjectId}_${cell.dateStr}`}
                          className="px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/40 to-orange-500/40 backdrop-blur-md border border-amber-300/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] text-[10px] text-amber-100 flex items-center justify-between gap-1"
                        >
                          <span className="font-bold truncate">
                            🏆 Exam: {ex.fullName}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-slate-950/60 text-amber-300 shrink-0">
                            Paper {ex.paperNumber}
                          </span>
                        </div>
                      ))}

                    {coveringMilestones.slice(0, 3).map(ms => {
                      const cp = ms.checkpoint;
                      const style = resolveMilestoneVisualStyle(cp);
                      const stats = checkpointStats.get(cp.id);
                      const isStartDay = cell.dateStr === ms.effectiveStart;
                      const isTargetDay = cell.dateStr === ms.effectiveEnd;
                      const isDone = Boolean(stats && stats.fillPercentage >= 100) || Boolean(cp.completed);
                      const isFinalSprint = isSubjectFinalExamSprint(cp, examDate);
                      const isMockExam = cp.revisionCycle === 'Mock Exam';
                      const cleanSubjectName = getCleanSubjectName(cp.subjectId, cp.customTitle);
                      const cleanCycle = getCleanCycleLabel(cp);

                      if (isTargetDay) {
                        // SPECIFIC COMPLETION / EXAM MILESTONE CARD ON TARGET DATE
                        const actionVerb = isFinalSprint
                          ? 'Final Exam'
                          : isMockExam
                            ? 'Mock Exam'
                            : isDone
                              ? 'Completed'
                              : 'Complete';

                        return (
                          <div
                            key={`cal_ms_${cp.id}_${cell.dateStr}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCheckpoint(cp);
                            }}
                            style={{
                              background: style.targetBg,
                              borderColor: style.border
                            }}
                            className="px-2 py-1.5 rounded-xl border backdrop-blur-xl shadow-[0_4px_14px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.28)] flex flex-col gap-0.5 text-white transition transform group-hover:scale-[1.01]"
                            title={`${actionVerb}: ${cleanSubjectName} (${cleanCycle}) • ${stats?.completedChaptersCount || 0}/${stats?.totalChapters || cp.targetChapters || 0} Chapters (${stats?.fillPercentage || 0}%) — Click to Edit Milestone`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1 truncate">
                                {isDone ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-200 shrink-0" />
                                ) : isFinalSprint ? (
                                  <Trophy className="h-3 w-3 text-amber-200 shrink-0" />
                                ) : (
                                  <Flag className="h-3 w-3 text-white fill-white shrink-0" />
                                )}
                                <span className="text-[9px] uppercase tracking-wider font-extrabold text-white/90 truncate">
                                  {actionVerb}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/55 backdrop-blur-xs text-[9px] font-mono font-bold tabular-nums shrink-0 border border-white/15">
                                {isDone ? '✓ 100%' : `${stats?.fillPercentage || 0}%`}
                              </span>
                            </div>

                            <div className="text-[10.5px] sm:text-[11px] font-bold text-white leading-tight truncate">
                              {cleanSubjectName}
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-white/80 font-medium pt-0.5">
                              <span className="truncate">{cleanCycle}</span>
                              {stats && (
                                <span className="font-mono tabular-nums shrink-0">
                                  {stats.completedChaptersCount}/{stats.totalChapters} Ch
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // FROSTED GLASS ROADMAP TRACK BAR FOR START OR INTERMEDIATE STUDY DAYS
                      return (
                        <div
                          key={`cal_ms_${cp.id}_${cell.dateStr}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCheckpoint(cp);
                          }}
                          style={{
                            backgroundColor: style.spanBg,
                            borderColor: style.border,
                            color: style.text
                          }}
                          className={`px-2 py-1 text-[10px] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] flex items-center justify-between gap-1.5 truncate transition ${
                            isStartDay
                              ? 'rounded-l-xl border-l-2 border-y border-r-0 font-bold'
                              : 'rounded-none border-y border-x-0 font-medium opacity-95'
                          }`}
                          title={`${cleanSubjectName} (${cleanCycle}) • ${ms.effectiveStart} to ${ms.effectiveEnd} • Click to Edit Milestone`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            {isStartDay && (
                              <span className="px-1 py-0.2 rounded bg-white/15 text-[8.5px] font-bold uppercase tracking-wide shrink-0">
                                Start
                              </span>
                            )}
                            <span className="truncate font-semibold">{cleanSubjectName}</span>
                          </div>
                          <span className="hidden xl:inline text-[9px] opacity-80 shrink-0">
                            {cleanCycle}
                          </span>
                        </div>
                      );
                    })}

                    {coveringMilestones.length > 3 && (
                      <div className="text-[9.5px] font-semibold text-amber-200 px-1.5 py-0.5 rounded bg-white/[0.06] backdrop-blur-xs">
                        +{coveringMilestones.length - 3} more in roadmap
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Roadmap Summary Strip for Currently Viewed Month — Frosted Glass */}
        {monthMilestones.length > 0 && (
          <div className="relative z-10 bg-white/[0.035] backdrop-blur-2xl border border-white/[0.10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] rounded-2xl px-3.5 py-2 flex items-center gap-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 shrink-0 text-xs">
            <span className="text-[11px] font-bold text-slate-300 shrink-0">
              {monthNames[viewMonth]} Roadmap ({monthMilestones.length}):
            </span>
            <div className="flex items-center gap-2">
              {monthMilestones.map(ms => {
                const cp = ms.checkpoint;
                const style = resolveMilestoneVisualStyle(cp);
                const stats = checkpointStats.get(cp.id);
                const isDone = Boolean(stats && stats.fillPercentage >= 100) || Boolean(cp.completed);
                const isFinalSprint = isSubjectFinalExamSprint(cp, examDate);
                const cleanName = getCleanSubjectName(cp.subjectId, cp.customTitle);
                const cleanCycle = getCleanCycleLabel(cp);
                return (
                  <button
                    key={`strip_${cp.id}`}
                    type="button"
                    onClick={() => setSelectedCheckpoint(cp)}
                    onMouseEnter={() => setHoveredMilestoneId(cp.id)}
                    onMouseLeave={() => setHoveredMilestoneId(null)}
                    style={{
                      borderColor: style.border,
                      backgroundColor: style.spanBg
                    }}
                    className="px-3 py-1 rounded-xl border backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] text-[11px] font-semibold text-white flex items-center gap-2 shrink-0 cursor-pointer hover:brightness-110 transition tabular-nums"
                    title="Click to Edit Milestone"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: style.hex }}
                    />
                    <span className="font-bold">{isFinalSprint ? `🏆 ${cleanName} Exam` : cleanName}</span>
                    <span className="text-slate-300 text-[10px]">
                      • {cleanCycle} (by <strong className="text-amber-200">{ms.effectiveEnd.slice(5)}</strong>)
                    </span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-mono font-bold ${
                      isDone ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-950/60 text-amber-300'
                    }`}>
                      {isDone ? '✓ Done' : `${stats?.fillPercentage || 0}%`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`w-full flex flex-col relative select-none bg-[#060916]/90 backdrop-blur-2xl text-white font-sans ${
        activeWorkspaceTab === 'route_map'
          ? 'h-[calc(100vh-118px)] min-h-[560px] overflow-hidden rounded-2xl border border-white/[0.12] ring-1 ring-white/[0.06] shadow-[0_24px_64px_rgba(0,0,0,0.65)]'
          : 'rounded-t-2xl rounded-b-none border-t border-x border-b-0 border-white/[0.12]'
      }`}
    >
      <ConfettiOverlay />
      
      {/* ─────────────────────────────────────────────────────────────
          1. OPTIMIZED HIGH-YIELD TOP CONTROL BAR (FROSTED GLASS)
          ───────────────────────────────────────────────────────────── */}
      {/* Tier 1: Main Modes & Action Buttons */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border-b border-white/[0.10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] rounded-t-2xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 relative z-30 font-mono text-xs">
        {/* Left: Mode Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-xl border border-white/[0.10] p-0.5 rounded-xl shadow-inner">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('route_map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer flex items-center gap-1.5 transition ${
                activeWorkspaceTab === 'route_map'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_2px_12px_rgba(251,191,36,0.35)]'
                  : 'bg-transparent text-slate-300 border-transparent hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{isLmrMode ? 'Exam Sprint Calendar' : 'Roadmap Calendar'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('tabular_ledger')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer flex items-center gap-1.5 transition ${
                activeWorkspaceTab === 'tabular_ledger'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_2px_12px_rgba(251,191,36,0.35)]'
                  : 'bg-transparent text-slate-300 border-transparent hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{isLmrMode ? 'Exam Sprint List' : 'Milestone Ledger'}</span>
            </button>

            {!isLmrMode && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceTab('auto_planner')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border cursor-pointer flex items-center gap-1.5 backdrop-blur-md transition ${
                    activeWorkspaceTab === 'auto_planner'
                      ? 'bg-emerald-400/25 text-emerald-200 border-emerald-300/50 shadow-[0_0_14px_rgba(52,211,153,0.25)]'
                      : 'bg-white/[0.03] text-emerald-300 border-white/10 hover:bg-emerald-500/15 hover:border-emerald-400/30'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Auto Planner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWorkspaceTab('icai_matrix')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer flex items-center gap-1.5 backdrop-blur-md transition ${
                    activeWorkspaceTab === 'icai_matrix'
                      ? 'bg-amber-400/25 text-amber-200 border-amber-300/50 shadow-[0_0_14px_rgba(251,191,36,0.25)]'
                      : 'bg-white/[0.03] text-slate-200 border-white/10 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Weightage Matrix</span>
                </button>
              </>
            )}
          </div>

          {isLmrMode && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 backdrop-blur-md border border-amber-400/35 text-amber-200 text-[10.5px] font-mono font-bold flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-amber-400 shrink-0" />
              <span>1.5-Day Exam Sprint Mode</span>
            </span>
          )}

        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5">
          {isLmrMode ? (
            <span
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] backdrop-blur-md border border-emerald-400/35 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5"
              title="Exam dates and sprint windows are locked in 1.5-Day Exam Sprint mode"
            >
              <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>Exam Schedule Active</span>
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('practca_open_final_exam_dates_modal'))}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] backdrop-blur-md border border-white/[0.12] text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center gap-1 transition cursor-pointer"
                title="Configure Exam Dates and auto-add 1.5-Day Pre-Exam Sprints"
              >
                <Calendar className="h-3 w-3 text-amber-300" />
                <span>Exam Dates</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-mono font-black flex items-center gap-1 transition cursor-pointer shadow-[0_2px_12px_rgba(251,191,36,0.3)]"
                title="Add Subject Completion or Mock Exam Milestone"
              >
                <Plus className="h-3 w-3 stroke-[3]" />
                <span>+ Add Milestone</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsExpandedViewOpen(true)}
            className="px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] backdrop-blur-md text-slate-200 hover:text-white border border-white/[0.12] text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer"
            title="Open expanded full-screen view"
          >
            <Maximize2 className="h-3 w-3 text-amber-400" />
            <span>Expand</span>
          </button>

          {!isLmrMode && (
            <button
              type="button"
              onClick={() => setIsSidelineOpen(prev => !prev)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer border backdrop-blur-md ${
                isSidelineOpen
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40'
                  : 'bg-white/[0.05] text-slate-300 border-white/[0.12] hover:text-white hover:bg-white/[0.10]'
              }`}
              title="Toggle Sideline Study Planner"
            >
              {isSidelineOpen ? <PanelRightClose className="h-3 w-3" /> : <PanelRightOpen className="h-3 w-3" />}
              <span>Sideline</span>
            </button>
          )}
        </div>
      </div>

      {/* Tier 2: Unified Milestone Intelligence, Phase, Next Goal & Timeline Strip */}
      <div className="bg-white/[0.025] backdrop-blur-xl border-b border-white/[0.08] px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 relative z-20 font-mono text-xs">
        {/* Left: Checkpoints count, Phase & Prep Start */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <button
            type="button"
            onClick={() => setShowAllCheckpointsModal(true)}
            className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] backdrop-blur-md text-slate-200 border border-white/[0.12] text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:border-amber-400/40 transition"
            title={isLmrMode ? "Inspect 1.5-Day Final Exam Sprints" : "Click to view, edit, delete and add milestones"}
          >
            <Flag className="h-3 w-3 text-amber-400" />
            <span>{isLmrMode ? `${sortedCheckpoints.length} Exam Sprints` : `${checkpoints.length} Milestones`}</span>
            <span className="text-[9.5px] text-amber-300 underline">{isLmrMode ? 'View ▾' : 'Manage ▾'}</span>
          </button>

          {isLmrMode ? (
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 backdrop-blur-md border border-amber-400/30 text-amber-200 font-bold">
              ⚡ Mode: <strong className="text-white">Final Exam Sprint</strong>
            </span>
          ) : (
            <>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.10] text-slate-300">
                Stage: <strong className="text-amber-300">{activePhaseSummary.label}</strong> ({activePhaseSummary.percent}%)
              </span>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.10] text-slate-300 text-[10.5px]">
                <span>Start Date:</span>
                <input
                  type="date"
                  value={prepStartDate}
                  onChange={(e) => setPrepStartDate(e.target.value)}
                  className="bg-transparent text-emerald-300 border-none font-bold text-[10px] focus:outline-none cursor-pointer p-0"
                  title="Change preparation start date"
                />
              </div>
            </>
          )}
        </div>

        {/* Center: Next Goal (Clean Subject Name + Completion Countdown) */}
        {nextUpcomingCheckpoint ? (
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedCheckpoint(nextUpcomingCheckpoint.checkpoint)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 backdrop-blur-md border border-emerald-400/40 text-emerald-200 hover:border-emerald-300 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] transition"
              title="Click to inspect or update this upcoming milestone"
            >
              <span className="font-bold text-emerald-300">🎯 Next Target:</span>
              <span className="text-white font-bold">
                {getCleanSubjectName(
                  nextUpcomingCheckpoint.checkpoint.subjectId,
                  nextUpcomingCheckpoint.checkpoint.customTitle
                )}
              </span>
              <span className="text-amber-300 font-bold">
                in {nextUpcomingCheckpoint.stats?.daysRemaining}d
              </span>
              <span className="text-slate-300 text-[10px]">
                ({nextUpcomingCheckpoint.stats?.completedChaptersCount}/{nextUpcomingCheckpoint.stats?.totalChapters} Ch)
              </span>
            </button>
            {!isLmrMode && (
              <button
                type="button"
                onClick={() => {
                  const cpToAlloc = nextUpcomingCheckpoint.checkpoint;
                  onNavigateToDailyView();
                  setTimeout(() => {
                    window.dispatchEvent(
                      new CustomEvent('practca_open_milestone_autobatch', {
                        detail: { checkpoint: cpToAlloc }
                      })
                    );
                  }, 80);
                }}
                className="px-2 py-0.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[9.5px] cursor-pointer shadow-xs"
                title="Allocate this milestone's chapters across daily study blocks"
              >
                Allocate
              </button>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>All subject milestones completed! Ready for Final Exams!</span>
          </div>
        )}

        {/* Right: Exam Date & Countdown */}
        <div className="flex items-center gap-1.5 font-mono text-[10.5px]">
          {!examScheduleInfo.hasScheduledExam ? (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('practca_open_final_exam_dates_modal'))}
              className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.10] backdrop-blur-md border border-white/[0.12] px-2.5 py-0.5 rounded-lg text-slate-200 hover:text-white cursor-pointer transition"
              title="No Scheduled Exam — Click to configure exam dates"
            >
              <Calendar className="h-3 w-3 text-amber-300 shrink-0" />
              <span className="font-bold">Set Exam Dates</span>
            </button>
          ) : isLmrMode ? (
            <div
              className="flex items-center gap-1 bg-amber-500/15 backdrop-blur-md border border-amber-400/35 px-2.5 py-0.5 rounded-lg text-amber-200"
              title="Final Exam schedule is active"
            >
              <Lock className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="font-black text-amber-200">
                {examCountdown.days}d {examCountdown.hours}h
              </span>
              <span className="text-slate-300 text-[9.5px]">Exams Start:</span>
              <span className="text-amber-300 font-bold text-[10px]">{examDate}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('practca_open_final_exam_dates_modal'))}
              className="flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 backdrop-blur-md border border-amber-400/35 px-2.5 py-0.5 rounded-lg text-amber-200 cursor-pointer transition"
              title="Click to configure Final Exam Dates"
            >
              <Hourglass className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="font-black text-amber-200">
                {examCountdown.days}d {examCountdown.hours}h
              </span>
              <span className="text-slate-300 text-[9.5px]">Exams Start:</span>
              <span className="text-amber-300 font-bold text-[10px] underline">{examDate}</span>
            </button>
          )}
        </div>
      </div>

      {planApplyBanner && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono text-emerald-200 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{planApplyBanner}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToDailyView}
              className="px-2.5 py-1 rounded bg-emerald-400 text-slate-950 font-black text-[10.5px] cursor-pointer"
            >
              View Study Planner →
            </button>
            <button
              type="button"
              onClick={() => setPlanApplyBanner(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2B. AUTOMATED STUDY PLANNER WORKBENCH OR POST-PHASE AMENDMENT WORKBENCH
          ───────────────────────────────────────────────────────────── */}
      {(activeWorkspaceTab === 'auto_planner' || activeWorkspaceTab === 'icai_matrix') && (
        <div key={activeWorkspaceTab} className="w-full flex flex-col pt-2 sm:pt-3 px-2 sm:px-3 pb-0 bg-gradient-to-br from-[#070b19] via-[#0a1024] to-[#060913]">
          <AutomatedStudyPlannerWorkbench
            initialMode={
              activeWorkspaceTab === 'icai_matrix' ? 'icai_matrix' : 'setup'
            }
            config={autoPlanConfig}
            chapterInputs={chapterPlanInputs}
            existingTasks={tasks}
            existingCheckpoints={checkpoints as GeneratedMilestoneItem[]}
            onUpdateChapterInputs={(updatedInputs) => setChapterPlanInputs(updatedInputs)}
            onClose={() => setActiveWorkspaceTab('route_map')}
            onContinueExistingPlan={(updatedConfig) => {
              setAutoPlanConfig(updatedConfig);
              setPlanApplyBanner(`Phase Review Completed: Continuing with existing plan into ${PHASE_LABELS[updatedConfig.activePhaseId]?.title || updatedConfig.activePhaseId}.`);
              setActiveWorkspaceTab('tabular_ledger');
            }}
            onSaveAndApplyPlan={(newConfig, newInputs, generatedMilestones, mergedTasks) => {
              setAutoPlanConfig(newConfig);
              setChapterPlanInputs(newInputs);
              setPrepStartDate(newConfig.prepStartDate);
              setExamDate(newConfig.examDate);

              const mappedCheckpoints: UserCheckpoint[] = generatedMilestones.map(m => ({
                id: m.id,
                subjectId: m.subjectId,
                customTitle: m.customTitle,
                revisionCycle: m.revisionCycle,
                phaseId: m.phaseId,
                startDate: m.startDate,
                targetDate: m.targetDate,
                targetChapters: m.targetChapters,
                selectedChapters: m.selectedChapters,
                completedChapters: m.completedChapters,
                notes: m.notes,
                allocatedHours: m.allocatedHoursTotal,
                allocatedHoursTotal: m.allocatedHoursTotal,
                completionCondition: m.completionCondition,
                mockTestCompleted: m.mockTestCompleted,
                mockScoreObtained: m.mockScoreObtained,
                mockMaxMarks: m.mockMaxMarks
              }));

              setCheckpoints(mappedCheckpoints);

              if (onApplyGeneratedTasks) {
                onApplyGeneratedTasks(mergedTasks);
              }
              setPlanApplyBanner(
                `Automated ICAI Study Plan Applied: ${mappedCheckpoints.length} Milestones & ${mergedTasks.length} Daily Study Targets allocated.`
              );
              setActiveWorkspaceTab('tabular_ledger');
            }}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2C. STATIC TABULAR MILESTONE LEDGER & MOCK TEST GATE TABLE
          ───────────────────────────────────────────────────────────── */}
      {activeWorkspaceTab === 'tabular_ledger' && (
        <div className="w-full pt-3 sm:pt-4 px-3 sm:px-4 pb-2 bg-[#070916] space-y-3">
          <div className="bg-[#0b0f22] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span>
                  {isLmrMode
                    ? '1.5-Day LDR Final Exam Sprint Ledger (System Auto-Calculated)'
                    : 'Milestone & Mock Gate Ledger'}
                </span>
              </h3>
            </div>
            {!isLmrMode && (
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceTab('auto_planner')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  <Sliders className="h-3 w-3" />
                  <span>Auto Planner</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#0b0f22] border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Phase / Cycle</th>
                    <th className="py-2.5 px-3">Paper / Milestone</th>
                    <th className="py-2.5 px-3 text-center">Date Window</th>
                    <th className="py-2.5 px-3 text-center">ICAI Budget</th>
                    <th className="py-2.5 px-3 text-center">Chapters Done</th>
                    {!isLmrMode && (
                      <>
                        <th className="py-2.5 px-3 text-center">Milestone Condition</th>
                        <th className="py-2.5 px-3 text-center">Mock Test Status & Score (Optional)</th>
                      </>
                    )}
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {sortedCheckpoints.map((cp, idx) => {
                    const st = checkpointStats.get(cp.id);
                    const condition = cp.completionCondition || 'targets_only';
                    const isMockRequired = condition === 'mock_test_required';
                    return (
                      <tr key={cp.id} className="bg-slate-900/40 hover:bg-slate-900/80">
                        <td className="py-2.5 px-3 text-slate-500 font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 text-[10px] font-bold">
                              {cp.revisionCycle}
                            </span>
                            {isSubjectFinalExamSprint(cp, examDate) && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[9px] font-black">
                                🏆 {cp.subjectId !== 'CUSTOM' ? cp.subjectId : 'FINAL'} EXAM
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${SUBJECT_THEMES[cp.subjectId].badge}`}>
                              {cp.subjectId}
                            </span>
                            <div>
                              <div className="font-sans font-bold text-white text-xs">
                                {cp.customTitle || SUBJECT_FULL_NAMES[cp.subjectId]}
                              </div>
                              {isSubjectFinalExamSprint(cp, examDate) && (
                                <div className="text-[10px] text-amber-300 font-bold">
                                  🏆 {cp.subjectId !== 'CUSTOM' ? cp.subjectId : 'Subject'} Final Exam on {cp.targetDate}
                                </div>
                              )}
                              {cp.notes && (
                                <div className="font-sans text-[10px] text-slate-400 truncate max-w-xs">
                                  {cp.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center text-[11px] text-slate-300">
                          <div>
                            {cp.startDate ? `${cp.startDate} ➔ ` : ''}<strong className="text-white">{cp.targetDate}</strong>
                          </div>
                          {isSubjectFinalExamSprint(cp, examDate) && (
                            <div className="text-[9.5px] text-amber-400 font-bold mt-0.5">
                              Exam Day: {cp.targetDate}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-300">
                          {cp.allocatedHours || cp.allocatedHoursTotal ? `${cp.allocatedHours || cp.allocatedHoursTotal}h` : '16h'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-bold ${st?.fillPercentage === 100 ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {st?.completedChaptersCount || 0}/{st?.totalChapters || cp.targetChapters} ({st?.fillPercentage || 0}%)
                          </span>
                        </td>
                        {!isLmrMode && (
                          <>
                            <td className="py-2.5 px-3 text-center">
                              <select
                                value={condition}
                                onChange={(e) => handleUpdateMilestoneCondition(cp.id, e.target.value as MilestoneCompletionCondition)}
                                className={`bg-slate-950 border rounded px-2 py-1 text-[10.5px] font-bold cursor-pointer ${
                                  isMockRequired
                                    ? 'border-cyan-500/40 text-cyan-300'
                                    : 'border-slate-800 text-slate-300'
                                }`}
                              >
                                <option value="targets_only">Targets Achieved Only</option>
                                <option value="mock_test_required">Targets + Mock Test Gate</option>
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {isMockRequired ? (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateMockTestStatus(cp.id, !cp.mockTestCompleted, cp.mockScoreObtained)}
                                    className={`px-2 py-1 rounded border text-[10px] font-bold cursor-pointer flex items-center gap-1 ${
                                      cp.mockTestCompleted
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                        : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                    }`}
                                  >
                                    {cp.mockTestCompleted ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                                    <span>{cp.mockTestCompleted ? 'Mock Done' : 'Mark Mock Done'}</span>
                                  </button>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      placeholder="Score"
                                      value={cp.mockScoreObtained ?? ''}
                                      onChange={(e) => {
                                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                                        handleUpdateMockTestStatus(cp.id, Boolean(cp.mockTestCompleted || val !== undefined), val);
                                      }}
                                      className="w-14 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-[11px] font-bold text-white"
                                      title="Optional Mock Test Score out of 100"
                                    />
                                    <span className="text-[10px] text-slate-500">/100</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500">Not Required</span>
                              )}
                            </td>
                          </>
                        )}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {cp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cp.subjectId) ? (
                              <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                <span>Exam & Sprint Locked</span>
                              </span>
                            ) : (
                              <>
                                {is15DaySprintCheckpoint(cp) && cp.subjectId !== 'CUSTOM' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      toggleFinalSprintMilestoneCompletion(cp.subjectId as SubjectId, !cp.completed);
                                      try {
                                        const refreshed = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKPOINTS) || '[]');
                                        if (Array.isArray(refreshed)) setCheckpoints(refreshed);
                                      } catch (e) {}
                                    }}
                                    className={`px-2 py-1 rounded text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                      cp.completed
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                                    }`}
                                    title="Mark 1.5-Day Final Sprint Milestone Complete"
                                  >
                                    {cp.completed ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                                    <span>{cp.completed ? '1.5D Done' : 'Mark 1.5D Done'}</span>
                                  </button>
                                )}
                                {!isLmrMode && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onNavigateToDailyView();
                                      setTimeout(() => {
                                        window.dispatchEvent(
                                          new CustomEvent('practca_open_milestone_autobatch', {
                                            detail: { checkpoint: cp }
                                          })
                                        );
                                      }, 80);
                                    }}
                                    className="px-2.5 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold cursor-pointer transition"
                                    title="Trace to Daily Dashboard and allocate this milestone's targets across days"
                                  >
                                    📅 Allocate Days
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedCheckpoint(cp)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10.5px] font-bold cursor-pointer"
                            >
                              Inspect
                            </button>
                            {!isLmrMode && !(cp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cp.subjectId)) && (
                              <button
                                type="button"
                                onClick={() => setMilestoneToDelete(cp)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition cursor-pointer"
                                title="Delete checkpoint"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SCROLLABLE ROUTE FOCUS SCREEN
          "show the current point and next 6 to 8 points on the focus screen
          and the rest shall be moved to below the border can be scrolled up to see the route."
          ───────────────────────────────────────────────────────────── */}
      {activeWorkspaceTab === 'route_map' && (
        <div
          ref={routeContainerRef}
          className="flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden bg-[#070916] p-2 sm:p-3.5 select-none scrollbar-thin scrollbar-thumb-slate-700 flex flex-col"
        >
          {renderMilestoneCalendarView(false)}
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────
          MODAL A: MILESTONE DOT DETAIL POPOVER / MODAL
          "Add click handlers to the roadmap milestone dots so that when
          a user selects one, an expandable detail view (like a popover or
          modal) opens, displaying the progress report or covered topics
          for that specific date range."
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedMilestoneDot && (
          <ModalPortal triggerKey={selectedMilestoneDot.dateStr}>
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-[#0c1024] border border-slate-800 text-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[88vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center font-bold">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                        Date Progress Report: {selectedMilestoneDot.dateStr}
                      </h3>
                      {selectedMilestoneDot.isToday && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Segment: <strong className="text-slate-200">{selectedMilestoneDot.fromLabel}</strong> ➔ <strong className="text-slate-200">{selectedMilestoneDot.toLabel}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMilestoneDot(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Summary Card for this Milestone Dot */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-850 flex items-center justify-between gap-3 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    Daily Progress Status
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-mono font-bold ${selectedMilestoneDot.hasCompleted ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {selectedMilestoneDot.completedCount} of {selectedMilestoneDot.tasksCount} Topics Completed
                    </span>
                    {selectedMilestoneDot.hasCompleted && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        ✓ Goal Achieved
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    Segment Fill
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    {selectedMilestoneDot.segmentCompletedDays}/{selectedMilestoneDot.segmentTotalDays} Days ({Math.round((selectedMilestoneDot.segmentCompletedDays / Math.max(1, selectedMilestoneDot.segmentTotalDays)) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Tasks & Topics logged on this Date */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
                  <span>Topics & Tasks for {selectedMilestoneDot.dateStr}</span>
                  <span className="text-cyan-400">
                    {tasksByDate.get(selectedMilestoneDot.dateStr)?.length || 0} scheduled
                  </span>
                </div>

                {(!tasksByDate.get(selectedMilestoneDot.dateStr) || tasksByDate.get(selectedMilestoneDot.dateStr)!.length === 0) ? (
                  <div className="p-5 text-center bg-slate-950/50 rounded-2xl border border-slate-850 text-slate-400 font-mono text-xs space-y-2">
                    <p>No study tasks logged yet for this date.</p>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDate(selectedMilestoneDot.dateStr);
                        onOpenAddTargetModal();
                        setSelectedMilestoneDot(null);
                      }}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Target for this Date</span>
                    </button>
                  </div>
                ) : (
                  tasksByDate.get(selectedMilestoneDot.dateStr)!.map((t, idx) => {
                    const isDone = t.status === 'completed' || Boolean(t.completed);
                    return (
                      <div
                        key={`${t.id || 'dot_task'}_${idx}`}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                            : 'bg-slate-950/60 border-slate-850 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {onToggleTaskCompleted ? (
                            <button
                              type="button"
                              onClick={() => onToggleTaskCompleted(t)}
                              className="text-slate-500 hover:text-emerald-400 cursor-pointer shrink-0"
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-500" />
                              )}
                            </button>
                          ) : (
                            <div className="h-3.5 w-3.5 rounded-full border border-slate-600 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className={`text-xs block truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-100 font-medium'}`}>
                              {t.cleanTitle || t.title}
                            </span>
                            {t.chapterName && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                Chapter: {t.chapterName}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 shrink-0">
                          {t.subjectCode || 'CA Final'}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Segment Surrounding Context Accordion */}
                <div className="pt-2 border-t border-slate-850">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
                    Other Dates in this Segment ({selectedMilestoneDot.fromDate} to {selectedMilestoneDot.toDate}):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {selectedMilestoneDot.segmentDays.slice(0, 9).map((d) => (
                      <div
                        key={d.dateStr}
                        onClick={() => {
                          setSelectedMilestoneDot(prev => prev ? {
                            ...prev,
                            dateStr: d.dateStr,
                            dayNum: d.dayNum,
                            topics: d.topics,
                            completedCount: d.completedCount,
                            tasksCount: d.tasksCount,
                            isToday: d.isToday,
                            isPast: d.isPast,
                            hasCompleted: d.hasCompleted
                          } : null);
                        }}
                        className={`p-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-between cursor-pointer transition ${
                          d.dateStr === selectedMilestoneDot.dateStr
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                            : d.hasCompleted
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{d.dateStr.slice(5)}</span>
                        <span>{d.hasCompleted ? '✓' : d.tasksCount > 0 ? `${d.completedCount}/${d.tasksCount}` : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between shrink-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDate(selectedMilestoneDot.dateStr);
                      onOpenAddTargetModal();
                      setSelectedMilestoneDot(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ Add Target for Date</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDate(selectedMilestoneDot.dateStr);
                      onNavigateToDailyView();
                      setSelectedMilestoneDot(null);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-cyan-500/30 rounded-xl"
                  >
                    Open Daily Board
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMilestoneDot(null)}
                  className="px-3 py-1.5 bg-slate-900 text-slate-300 hover:text-white rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          CONFIRM DELETE MILESTONE MODAL
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {milestoneToDelete && (
          <ModalPortal>
            <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-[#0e1122] border border-rose-500/40 text-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative"
              >
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">
                      Confirm Deletion
                    </span>
                    <h3 className="text-base font-black text-white">
                      Delete Milestone?
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Are you sure you want to delete this checkpoint from your roadmap?
                    </p>
                  </div>
                </div>

                {/* Milestone Detail Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-black border ${SUBJECT_THEMES[milestoneToDelete.subjectId]?.badge || 'bg-slate-800 text-slate-300'}`}>
                      {milestoneToDelete.subjectId}
                    </span>
                    <span className="text-sm font-bold text-white truncate">
                      {milestoneToDelete.customTitle || (milestoneToDelete.subjectId !== 'CUSTOM' ? SUBJECT_FULL_NAMES[milestoneToDelete.subjectId] : 'Milestone')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-slate-850">
                    <span>Cycle: <strong className="text-amber-300">{milestoneToDelete.revisionCycle}</strong></span>
                    <span>Target Date: <strong className="text-white">{milestoneToDelete.targetDate}</strong></span>
                  </div>
                  {milestoneToDelete.selectedChapters && milestoneToDelete.selectedChapters.length > 0 && (
                    <div className="text-[10.5px] font-mono text-slate-400">
                      Targets: <strong className="text-cyan-300">{milestoneToDelete.selectedChapters.length} chapters</strong>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200/90 leading-relaxed font-sans">
                  💡 <strong>Note:</strong> Unlinks any daily tasks associated with this milestone. Any study hours already logged for these chapters will remain safe in your revision ledger.
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setMilestoneToDelete(null)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-800 cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const id = milestoneToDelete.id;
                      setMilestoneToDelete(null);
                      await handleDeleteCheckpoint(id);
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-500/20 cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Yes, Delete Milestone</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL B: POP-UP TO SHOW ALL CHECKPOINTS WITH DATES, EDIT/DELETE & ADD
          "where you show the number of check point tapping on it give a
          pop up to show all check points with dates and option to edit/
          delete and add new check points"
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAllCheckpointsModal && (
          <ModalPortal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-[#0c1024] border border-slate-800 text-white rounded-3xl p-5 sm:p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[88vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center font-bold">
                    <Flag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                      {isLmrMode ? `1.5-Day LDR Exam Sprints (${sortedCheckpoints.length})` : `Master Roadmap Checkpoints (${checkpoints.length})`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!isLmrMode && (
                    <>
                      <button
                        type="button"
                        onClick={handleDisintegrateAllSameSubjectMilestones}
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/35 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Partition overlapping chapters across same-subject milestones and isolate completion states"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        <span>⚡ Disintegrate Same-Subject Milestones</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAllCheckpointsModal(false);
                          setShowAddModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-black flex items-center gap-1 transition cursor-pointer shadow-md"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[3]" />
                        <span>+ Add New Checkpoint</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAllCheckpointsModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Checkpoints List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {sortedCheckpoints.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-850 text-slate-400 font-mono text-xs space-y-3">
                    <p>No checkpoints added yet. Build your personal sequence of milestones!</p>
                    {!isLmrMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAllCheckpointsModal(false);
                          setShowAddModal(true);
                        }}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs font-mono inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>Create Checkpoint 1</span>
                      </button>
                    )}
                  </div>
                ) : (
                  sortedCheckpoints.map((cp, idx) => {
                    const stats = checkpointStats.get(cp.id);
                    const theme = SUBJECT_THEMES[cp.subjectId] || SUBJECT_THEMES['FR'];
                    const isDone = stats && stats.fillPercentage >= 100;
                    return (
                      <div
                        key={cp.id}
                        className={`p-3.5 rounded-2xl border transition space-y-2 ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30' 
                            : stats?.isOverdue
                              ? 'bg-rose-950/20 border-rose-500/30'
                              : 'bg-slate-950/70 border-slate-850'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-xs font-mono font-bold text-slate-500">
                              #{idx + 1}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-mono font-black border ${theme.badge}`}>
                              {cp.subjectId}
                            </span>
                            <div className="truncate">
                              <h4 className="text-xs font-bold text-white truncate">
                                {cp.customTitle || (cp.subjectId !== 'CUSTOM' ? SUBJECT_FULL_NAMES[cp.subjectId] : 'Milestone')}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Cycle: <strong className="text-amber-300">{cp.revisionCycle}</strong> • {stats?.completedChaptersCount}/{stats?.totalChapters} chapters done ({stats?.fillPercentage}%)
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
                            {cp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cp.subjectId) ? (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                <span>Exam & Sprint Locked</span>
                              </span>
                            ) : (
                              <>
                                {is15DaySprintCheckpoint(cp) && cp.subjectId !== 'CUSTOM' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      toggleFinalSprintMilestoneCompletion(cp.subjectId as SubjectId, !cp.completed);
                                      try {
                                        const refreshed = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKPOINTS) || '[]');
                                        if (Array.isArray(refreshed)) setCheckpoints(refreshed);
                                      } catch (e) {}
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 border ${
                                      cp.completed
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                                    }`}
                                    title="Mark 1.5-Day Final Sprint Milestone Complete"
                                  >
                                    {cp.completed ? <CheckSquare className="h-3 w-3 shrink-0" /> : <Square className="h-3 w-3 shrink-0" />}
                                    <span>{cp.completed ? '1.5D Done' : 'Mark 1.5D Done'}</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleTriggerQuickSelect(cp)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 border ${
                                    quickSelectedCpId === cp.id
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : 'bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border-amber-400/35'
                                  }`}
                                  title="Quick-Select all underlying chapters of this milestone as today's active tasks"
                                >
                                  <Zap className="h-3 w-3 shrink-0" />
                                  <span>{quickSelectedCpId === cp.id ? '✓ Quick-Selected!' : 'Quick-Select'}</span>
                                </button>

                                {!isLmrMode && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowAllCheckpointsModal(false);
                                      onNavigateToDailyView();
                                      setTimeout(() => {
                                        window.dispatchEvent(new CustomEvent('practca_open_milestone_autobatch', { detail: { checkpoint: cp } }));
                                      }, 50);
                                    }}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs transition cursor-pointer flex items-center gap-1"
                                    title="Auto-allocate this milestone's targets across upcoming days based on time spent, importance, and 7-day average study time"
                                  >
                                    <Zap className="h-3 w-3 fill-current" />
                                    <span>Allocate Days</span>
                                  </button>
                                )}
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setShowAllCheckpointsModal(false);
                                setSelectedCheckpoint(cp);
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] cursor-pointer"
                            >
                              Inspect Checklist
                            </button>

                            {!isLmrMode && !(cp.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(cp.subjectId)) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMilestoneToDelete(cp);
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition cursor-pointer"
                                title="Delete checkpoint"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inline Date Editor */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-850/60 font-mono text-[10.5px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Target Date:</span>
                            {is15DaySprintCheckpoint(cp) || isLmrMode ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
                                🏆 {cp.targetDate} (Final Exam Date)
                              </span>
                            ) : (
                              <input
                                type="date"
                                value={cp.targetDate}
                                onChange={(e) => handleUpdateCheckpointDate(cp.id, e.target.value)}
                                className="bg-slate-900 border border-slate-750 text-white rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
                              />
                            )}
                            {stats?.daysRemaining !== undefined && (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                stats.daysRemaining < 0 
                                  ? 'bg-rose-500/20 text-rose-300' 
                                  : stats.daysRemaining <= 4 
                                    ? 'bg-amber-500/20 text-amber-300' 
                                    : 'bg-slate-800 text-slate-300'
                              }`}>
                                {stats.daysRemaining < 0 
                                  ? `${Math.abs(stats.daysRemaining)}d overdue` 
                                  : `${stats.daysRemaining}d left`}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {isLmrMode ? (
                              <span className="px-2 py-0.5 bg-slate-900 text-emerald-300 rounded border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                                <Lock className="h-2.5 w-2.5" />
                                <span>System Calculated</span>
                              </span>
                            ) : is15DaySprintCheckpoint(cp) ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAllCheckpointsModal(false);
                                  window.dispatchEvent(new CustomEvent('practca_open_final_exam_dates_modal'));
                                }}
                                className="px-2 py-0.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 rounded border border-amber-400/40 text-[10px] font-bold cursor-pointer"
                                title="1.5-Day Sprints are controlled via Final Exam Dates (Papers 1–6)"
                              >
                                🏆 Edit via Exam Dates
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleShiftDate(cp.id, 1)}
                                  className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded border border-slate-800 text-[10px]"
                                  title="Postpone by 1 day"
                                >
                                  +1d
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShiftDate(cp.id, 3)}
                                  className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded border border-slate-800 text-[10px]"
                                  title="Postpone by 3 days"
                                >
                                  +3d
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShiftDate(cp.id, 7)}
                                  className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded border border-slate-800 text-[10px]"
                                  title="Postpone by 7 days"
                                >
                                  +7d
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between shrink-0 font-mono text-xs">
                {!isLmrMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllCheckpointsModal(false);
                      setShowAddModal(true);
                    }}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    <span>+ Add Another Checkpoint</span>
                  </button>
                ) : (
                  <span className="text-[10.5px] text-slate-400">
                    🔒 All 6 Paper 1.5-Day Sprints are locked and system-calculated.
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setShowAllCheckpointsModal(false)}
                  className="px-3.5 py-1.5 bg-slate-900 text-slate-300 hover:text-white rounded-xl"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL C: CHECKPOINT INSPECTION CARD (PENDING & COMPLETED BREAKDOWN)
          "also when the check point is tapped show what are pending
          and what are completed with respect to it."
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCheckpoint && (
          <ModalPortal>
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-[#0c1024] border border-slate-800 text-white rounded-3xl p-5 max-w-3xl w-full shadow-2xl space-y-4 max-h-[88vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black border ${SUBJECT_THEMES[selectedCheckpoint.subjectId].badge}`}>
                    {selectedCheckpoint.subjectId}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white font-sans">
                      {selectedCheckpoint.customTitle || (selectedCheckpoint.subjectId !== 'CUSTOM' ? SUBJECT_FULL_NAMES[selectedCheckpoint.subjectId] : 'Milestone')}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Cycle: <strong className="text-amber-300">{selectedCheckpoint.revisionCycle}</strong> • Start: <strong className="text-slate-200">{selectedCheckpoint.startDate || '—'}</strong> • Target: <strong className="text-slate-200">{selectedCheckpoint.targetDate}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedCheckpoint.subjectId !== 'CUSTOM' && isSubjectLockedAfterFinalExam(selectedCheckpoint.subjectId) ? (
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10.5px] font-mono font-bold inline-flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      <span>Final Exam & 1.5D Sprint Completed — Read-Only</span>
                    </span>
                  ) : (
                    <>
                      {is15DaySprintCheckpoint(selectedCheckpoint) && selectedCheckpoint.subjectId !== 'CUSTOM' && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !selectedCheckpoint.completed;
                            toggleFinalSprintMilestoneCompletion(selectedCheckpoint.subjectId as SubjectId, nextState);
                            try {
                              const refreshed = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKPOINTS) || '[]');
                              if (Array.isArray(refreshed)) {
                                setCheckpoints(refreshed);
                                const found = refreshed.find((c: UserCheckpoint) => c.id === selectedCheckpoint.id);
                                if (found) setSelectedCheckpoint(found);
                              }
                            } catch (e) {}
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border transition cursor-pointer flex items-center gap-1 ${
                            selectedCheckpoint.completed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                          }`}
                          title="Mark 1.5-Day Final Sprint Milestone Complete"
                        >
                          {selectedCheckpoint.completed ? <CheckSquare className="h-3 w-3 shrink-0" /> : <Square className="h-3 w-3 shrink-0" />}
                          <span>{selectedCheckpoint.completed ? '1.5D Milestone Done' : 'Mark 1.5D Complete'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTriggerQuickSelect(selectedCheckpoint)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border transition cursor-pointer flex items-center gap-1 ${
                          quickSelectedCpId === selectedCheckpoint.id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400'
                        }`}
                        title="Quick-Select all underlying chapters as today's active tasks"
                      >
                        <Zap className="h-3 w-3 shrink-0" />
                        <span>{quickSelectedCpId === selectedCheckpoint.id ? '✓ Added to Today!' : 'Quick-Select All Chapters'}</span>
                      </button>
                      {!isLmrMode && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const cpToOpen = selectedCheckpoint;
                              setSelectedCheckpoint(null);
                              onNavigateToDailyView();
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent('practca_open_milestone_autobatch', { detail: { checkpoint: cpToOpen } }));
                              }, 50);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/40 transition cursor-pointer flex items-center gap-1"
                            title="Auto-allocate this milestone's targets across upcoming days based on chapter time spent, importance, and 7-day average study time"
                          >
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>Allocate Days</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingCheckpointChapters(prev => !prev);
                              setEditChapterSearch('');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer flex items-center gap-1 ${
                              isEditingCheckpointChapters
                                ? 'bg-amber-400 text-slate-950 border-amber-400'
                                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>{isEditingCheckpointChapters ? 'Done Editing Chapters' : 'Edit Milestone Chapters'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMilestoneToDelete(selectedCheckpoint);
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition cursor-pointer"
                            title="Delete checkpoint"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingCheckpointChapters(false);
                      setSelectedCheckpoint(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Start Date & Target Date Setters + Fixed Horizon Span */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-850 space-y-2.5 shrink-0">
                {is15DaySprintCheckpoint(selectedCheckpoint) || isLmrMode ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <div className="text-amber-300 font-black flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      <span>
                        System-Calculated 1.5-Day Final Exam Sprint ({selectedCheckpoint.startDate} ➔ {selectedCheckpoint.targetDate})
                      </span>
                    </div>
                    {isLmrMode ? (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/35 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Exam Dates Locked</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCheckpoint(null);
                          window.dispatchEvent(new CustomEvent('practca_open_final_exam_dates_modal'));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-200 font-mono font-black text-xs cursor-pointer transition flex items-center gap-1.5"
                      >
                        <Trophy className="h-3.5 w-3.5 text-amber-400" />
                        <span>Edit Final Exam Dates</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mb-1">Milestone Start Date (Fixed):</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          value={selectedCheckpoint.startDate || selectedCheckpoint.targetDate}
                          onChange={(e) => handleUpdateCheckpointStartDate(selectedCheckpoint.id, e.target.value)}
                          className="bg-slate-900 border border-slate-750 text-white rounded px-2 py-0.5 text-xs font-mono focus:outline-none flex-1"
                        />
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleShiftStartDate(selectedCheckpoint.id, -1)}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono cursor-pointer"
                            title="Shift start date by -1 day"
                          >
                            -1d
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShiftStartDate(selectedCheckpoint.id, 1)}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono cursor-pointer"
                            title="Shift start date by +1 day"
                          >
                            +1d
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block mb-1">
                        Milestone Target Date (Fixed End):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="date"
                          value={selectedCheckpoint.targetDate}
                          onChange={(e) => handleUpdateCheckpointDate(selectedCheckpoint.id, e.target.value)}
                          className="bg-slate-900 border border-slate-750 text-white rounded px-2 py-0.5 text-xs font-mono focus:outline-none flex-1"
                        />
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleShiftDate(selectedCheckpoint.id, -1)}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono cursor-pointer"
                            title="Shift target date by -1 day"
                          >
                            -1d
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShiftDate(selectedCheckpoint.id, 1)}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono cursor-pointer"
                            title="Shift target date by +1 day"
                          >
                            +1d
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShiftDate(selectedCheckpoint.id, 7)}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono cursor-pointer"
                            title="Shift target date by +7 days"
                          >
                            +7d
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-850/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">🔒 Fixed Horizon:</span>
                    <span>
                      {(() => {
                        const sStr = selectedCheckpoint.startDate || selectedCheckpoint.targetDate;
                        const tStr = selectedCheckpoint.targetDate || sStr;
                        const sMs = new Date(`${sStr}T00:00:00`).getTime();
                        const tMs = new Date(`${tStr}T00:00:00`).getTime();
                        const spanDays = Math.max(1, Math.round((tMs - sMs) / (1000 * 60 * 60 * 24)) + 1);
                        return `${spanDays} Total Days (${sStr} to ${tStr})`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone Completion Condition & Mock Test Score Gate */}
              {!isLmrMode && (
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-850 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Completion Gate:</span>
                    <select
                      value={selectedCheckpoint.completionCondition || 'targets_only'}
                      onChange={(e) => handleUpdateMilestoneCondition(selectedCheckpoint.id, e.target.value as MilestoneCompletionCondition)}
                      className="bg-slate-900 border border-slate-750 text-cyan-300 rounded px-2 py-1 text-xs font-bold cursor-pointer"
                    >
                      <option value="targets_only">Targets Achieved Only</option>
                      <option value="mock_test_required">Targets + Mock Test Gate</option>
                    </select>
                  </div>

                  {selectedCheckpoint.completionCondition === 'mock_test_required' ? (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateMockTestStatus(selectedCheckpoint.id, !selectedCheckpoint.mockTestCompleted, selectedCheckpoint.mockScoreObtained)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer flex items-center gap-1.5 ${
                          selectedCheckpoint.mockTestCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        {selectedCheckpoint.mockTestCompleted ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                        <span>{selectedCheckpoint.mockTestCompleted ? 'Mock Test Completed' : 'Mark Mock Test Done'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Score (Optional):</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="e.g. 64"
                          value={selectedCheckpoint.mockScoreObtained ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? undefined : Number(e.target.value);
                            handleUpdateMockTestStatus(selectedCheckpoint.id, Boolean(selectedCheckpoint.mockTestCompleted || val !== undefined), val);
                          }}
                          className="w-16 bg-slate-900 border border-slate-750 rounded px-2 py-0.5 text-xs font-bold text-white text-center"
                        />
                        <span className="text-[10px] text-slate-500">/ 100</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10.5px] font-sans text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>Targets Only</span>
                    </div>
                  )}

                  {/* Milestone Disintegration Actions (Split into Parts or Isolate Same-Subject Scope) */}
                  <div className="w-full pt-2 mt-1 border-t border-slate-850/80 flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
                    <span className="text-slate-400 font-bold flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Disintegrate Milestone Chapters:</span>
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[2, 3, 4].map(parts => (
                        <button
                          key={parts}
                          type="button"
                          onClick={() => handleSplitMilestoneIntoParts(selectedCheckpoint.id, parts)}
                          className="px-2 py-0.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/35 font-bold cursor-pointer transition"
                          title={`Split this milestone into ${parts} sequential part-milestones with non-overlapping chapters`}
                        >
                          Split into {parts} Parts
                        </button>
                      ))}
                      {checkpoints.filter(c => c.subjectId === selectedCheckpoint.subjectId && c.subjectId !== 'CUSTOM').length > 1 && (
                        <button
                          type="button"
                          onClick={handleDisintegrateAllSameSubjectMilestones}
                          className="px-2 py-0.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 font-bold cursor-pointer transition"
                          title="Automatically partition chapters across all milestones of this subject and isolate completion states"
                        >
                          ⚡ Isolate {selectedCheckpoint.subjectId} Milestones
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comprehensive Pending & Completed Chapters Breakdown */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {/* Instant Actionable Undo Banner */}
                {undoBannerInfo && (
                  <div className="p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-between gap-3 text-xs font-mono text-indigo-200 shadow-lg animate-fadeIn shrink-0">
                    <div className="flex items-center gap-2 truncate">
                      <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span className="font-bold truncate">{undoBannerInfo.message}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {undoBannerInfo.action && (
                        <button
                          type="button"
                          onClick={() => {
                            const act = undoBannerInfo.action;
                            setUndoBannerInfo(null);
                            if (act) {
                              handleUndoChapter(act.checkpointId, act.chapterName);
                            }
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1 shadow-md transition active:scale-95"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>{undoBannerInfo.action.label}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setUndoBannerInfo(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {(() => {
                  const isSub = selectedCheckpoint.subjectId !== 'CUSTOM';
                  const fullSubjectChapters = isSub
                    ? getMilestoneSubjectChapters(selectedCheckpoint.subjectId as SubjectId)
                    : levelSubjects.flatMap(s =>
                        getMilestoneSubjectChapters(s).map(c => `[${s}] ${c}`)
                      );
                  const milestoneChapters = (selectedCheckpoint.selectedChapters && selectedCheckpoint.selectedChapters.length > 0)
                    ? selectedCheckpoint.selectedChapters
                    : fullSubjectChapters;
                  const liveStatsForSelected = checkpointStats.get(selectedCheckpoint.id);
                  const doneSet = new Set<string>(liveStatsForSelected ? liveStatsForSelected.completedList : (selectedCheckpoint.completedChapters || []));
                  const doneNormSet = new Set<string>(Array.from(doneSet).map((c: string) => normalizeKey(c)));
                  const isChapterDone = (c: string) => doneSet.has(c) || doneNormSet.has(normalizeKey(c));
                  const pendingChapters = milestoneChapters.filter(ch => !isChapterDone(ch));
                  const completedChapters = milestoneChapters.filter(ch => isChapterDone(ch));

                  if (isEditingCheckpointChapters) {
                    const filteredForEdit = fullSubjectChapters.filter(ch =>
                      !editChapterSearch.trim() || ch.toLowerCase().includes(editChapterSearch.toLowerCase())
                    );
                    const selectedSet = new Set(milestoneChapters);
                    const isAllSelected = fullSubjectChapters.length > 0 && fullSubjectChapters.every(ch => selectedSet.has(ch));
                    return (
                      <div className="space-y-3 bg-slate-950/60 border border-amber-500/30 rounded-2xl p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold font-mono uppercase text-amber-300">
                              Select Chapters Included in this Milestone ({milestoneChapters.length} / {fullSubjectChapters.length})
                            </h4>
                            <p className="text-[10.5px] text-slate-400">
                              These chapters will appear directly under Active Milestone when adding daily targets.
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            {isAllSelected ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedCp = {
                                    ...selectedCheckpoint,
                                    selectedChapters: [],
                                    targetChapters: 0
                                  };
                                  setCheckpoints(prev => {
                                    const next = prev.map(c => c.id === selectedCheckpoint.id ? updatedCp : c);
                                    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(next));
                                    return next;
                                  });
                                  setSelectedCheckpoint(updatedCp);
                                }}
                                className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer flex items-center gap-1 font-bold transition"
                                title="Unselect all chapters to clear selection"
                              >
                                <Square className="h-3 w-3" />
                                <span>Unselect All (0)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedCp = {
                                    ...selectedCheckpoint,
                                    selectedChapters: fullSubjectChapters,
                                    targetChapters: fullSubjectChapters.length
                                  };
                                  setCheckpoints(prev => {
                                    const next = prev.map(c => c.id === selectedCheckpoint.id ? updatedCp : c);
                                    localStorage.setItem(STORAGE_KEY_CHECKPOINTS, JSON.stringify(next));
                                    return next;
                                  });
                                  setSelectedCheckpoint(updatedCp);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer flex items-center gap-1 font-bold transition"
                                title="Select all chapters for this milestone"
                              >
                                <CheckSquare className="h-3 w-3" />
                                <span>Select All ({fullSubjectChapters.length})</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="relative">
                          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2" />
                          <input
                            type="text"
                            placeholder="Filter syllabus chapters..."
                            value={editChapterSearch}
                            onChange={(e) => setEditChapterSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
                          {filteredForEdit.map((ch, idx) => {
                            const isIncluded = selectedSet.has(ch);
                            return (
                              <div
                                key={`edit_ch_${idx}`}
                                onClick={() => handleToggleCheckpointTargetChapter(selectedCheckpoint.id, ch)}
                                className={`p-2 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition ${
                                  isIncluded
                                    ? 'bg-amber-500/15 border-amber-400/50 text-white'
                                    : 'bg-slate-900/50 border-slate-850 text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {isIncluded ? (
                                  <CheckSquare className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                ) : (
                                  <Square className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{ch}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* PENDING SECTION */}
                      <div className="space-y-1.5">
                        <div className="text-[10.5px] font-mono uppercase text-amber-400 font-bold flex items-center justify-between">
                          <span>⏳ Pending Chapters ({pendingChapters.length})</span>
                          <span className="text-[9px] text-slate-400 font-normal">Click to mark done</span>
                        </div>

                        {pendingChapters.length === 0 ? (
                          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>All milestone chapters completed!</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                            {pendingChapters.map((ch, idx) => {
                              const bracketMatch = ch.match(/^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\]\s*(.+)$/);
                              const subForChap = bracketMatch ? (bracketMatch[1] as SubjectId) : (selectedCheckpoint.subjectId !== 'CUSTOM' ? selectedCheckpoint.subjectId : (levelSubjects[0] || 'FR'));
                              const cleanChap = bracketMatch ? bracketMatch[2] : ch;
                              return (
                                <div
                                  key={`pending_${ch}_${idx}`}
                                  onClick={() => handleToggleChapter(selectedCheckpoint.id, ch)}
                                  className="p-2.5 rounded-xl border border-slate-850 bg-slate-950/60 hover:border-slate-700 text-slate-200 text-xs flex items-center justify-between gap-2 cursor-pointer transition"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <Square className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                    <span className="truncate font-medium">{ch}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenAddTargetModal(subForChap, cleanChap);
                                    }}
                                    className="text-[9.5px] font-mono text-cyan-400 hover:underline shrink-0 ml-2"
                                  >
                                    + Add Target
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* COMPLETED SECTION */}
                      <div className="space-y-1.5">
                        <div className="text-[10.5px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckSquare className="h-3.5 w-3.5" />
                            <span>Completed Chapters ({completedChapters.length})</span>
                          </span>
                          {completedChapters.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleUndoAllChapters(selectedCheckpoint.id)}
                              className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[9.5px] font-mono font-bold cursor-pointer transition flex items-center gap-1"
                              title="Undo all completed chapters and restore them as pending"
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              <span>Undo All ({completedChapters.length})</span>
                            </button>
                          )}
                        </div>

                        {completedChapters.length === 0 ? (
                          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-slate-500 text-xs font-mono">
                            No chapters completed yet. Start studying and checking them off!
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                            {completedChapters.map((ch, idx) => (
                              <div
                                key={`completed_${ch}_${idx}`}
                                className="p-2 rounded-xl border border-emerald-500/25 bg-emerald-950/20 text-emerald-200 text-xs flex items-center justify-between gap-2 transition hover:border-emerald-500/40"
                              >
                                <div
                                  onClick={() => handleUndoChapter(selectedCheckpoint.id, ch)}
                                  className="flex items-center gap-2 truncate cursor-pointer flex-1"
                                  title="Click to undo this target"
                                >
                                  <CheckSquare className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  <span className="truncate line-through text-slate-400">{ch}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[9.5px] font-mono text-emerald-400 font-bold hidden sm:inline">
                                    Done ✓
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUndoChapter(selectedCheckpoint.id, ch);
                                    }}
                                    className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/35 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                                    title="Undo completed status and restore as pending target"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    <span>Undo</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between shrink-0 font-mono text-xs">
                {!isLmrMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCheckpoint.subjectId !== 'CUSTOM') {
                        onOpenAddTargetModal(selectedCheckpoint.subjectId);
                      } else {
                        onOpenAddTargetModal();
                      }
                    }}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ Add Daily Target</span>
                  </button>
                ) : (
                  <span className="text-[10.5px] text-slate-400">
                    🔒 System-calculated 1.5-Day LDR Sprint checklist.
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCheckpointChapters(false);
                    setSelectedCheckpoint(null);
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 text-slate-300 hover:text-white rounded-xl"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL D: ADD CHECKPOINT MODAL (LANDSCAPE 2-COLUMN WITH CHAPTER SELECTION)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <ModalPortal>
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-[#0c1024] border border-slate-800 text-white rounded-3xl p-5 sm:p-6 max-w-4xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400">
                    <Star className="h-5 w-5 fill-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white font-mono">
                      Define Milestone / Checkpoint & Target Chapters
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddCheckpoint} className="flex-1 overflow-y-auto pr-1 space-y-4 font-mono text-left">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Left Column: Milestone Details (5 cols) */}
                  <div className="md:col-span-5 space-y-3.5">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        1. Select Subject / Paper:
                      </label>
                      <select
                        value={newSubject}
                        onChange={(e) => handleSubjectChangeInModal(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans cursor-pointer"
                      >
                        {levelSubjects.map(subId => (
                          <option key={subId} value={subId} disabled={isSubjectLockedAfterFinalExam(subId)}>
                            {subId} - {SUBJECT_FULL_NAMES[subId]}{isSubjectLockedAfterFinalExam(subId) ? ' (🔒 Locked)' : ''}
                          </option>
                        ))}
                        <option value="CUSTOM">★ Multi-Subject / Custom Milestone</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        2. Milestone Title {newSubject !== 'CUSTOM' ? '(Optional)' : '(Required)'}:
                      </label>
                      <input
                        type="text"
                        required={newSubject === 'CUSTOM'}
                        placeholder={newSubject !== 'CUSTOM' ? `e.g. ${newSubject} Core Standards & Valuation` : 'e.g. Group 1 Core Chapters Sprint'}
                        value={newCustomTitle}
                        onChange={(e) => setNewCustomTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          3. Study / Revision Cycle:
                        </label>
                        <select
                          value={newCycle === 'Final Sprint' ? '1st Revision' : newCycle}
                          onChange={(e) => {
                            const nextCyc = e.target.value as UserCheckpoint['revisionCycle'];
                            setNewCycle(nextCyc);
                            if (newSubject !== 'CUSTOM') {
                              setNewSelectedChapters(getUnallocatedChaptersForSubjectCycle(newSubject, nextCyc));
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono cursor-pointer"
                        >
                          <option value="Baseline Study">Baseline Study</option>
                          <option value="1st Revision">1st Revision</option>
                          <option value="2nd Revision">2nd Revision</option>
                          <option value="3rd Revision">3rd Revision</option>
                          <option value="Mock Exam">Mock Exam</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          4. Start Date (Fixed):
                        </label>
                        <input
                          type="date"
                          required
                          value={newStartDate}
                          max={newTargetDate || undefined}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewStartDate(val);
                            if (val && newTargetDate && newTargetDate < val) {
                              setNewTargetDate(val);
                            }
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          5. Target Date (Min 1 Day):
                        </label>
                        <input
                          type="date"
                          required
                          min={newStartDate || undefined}
                          value={newTargetDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTargetDate(val && newStartDate && val < newStartDate ? newStartDate : val);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-[10.5px] font-sans text-amber-200">
                      <span>
                        <strong>Note:</strong> 1.5-Day Final Sprints are auto-added via your Final Exam Dates (Papers 1–6).
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          window.dispatchEvent(new CustomEvent('practca_open_final_exam_dates_modal'));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-mono font-black text-[10px] shrink-0 cursor-pointer hover:bg-amber-300 transition"
                      >
                        🏆 Set Exam Dates
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        6. Completion Criteria:
                      </label>
                      <select
                        value={newCompletionCondition}
                        onChange={(e) => setNewCompletionCondition(e.target.value as MilestoneCompletionCondition)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer font-mono"
                      >
                        <option value="targets_only">Option 1: Targets Achieved Only (No Mock Test)</option>
                        <option value="mock_test_required">Option 2: Mock Test + Target Completion Gate</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        7. Notes / Scope (Optional):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Focus on RTP/MTP questions alongside chapters..."
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-[11px] font-sans text-amber-200">
                      <div className="font-bold font-mono text-amber-300 flex items-center justify-between">
                        <span>🎯 Selected Milestone Scope</span>
                        <span>{newSelectedChapters.length} Chapters</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Target Chapters Multi-Selector (7 cols) */}
                  <div className="md:col-span-7 flex flex-col bg-slate-950/70 border border-slate-850 rounded-2xl p-3.5 space-y-2.5">
                    {(() => {
                      const activeSubForList: SubjectId = newSubject !== 'CUSTOM' ? newSubject : newCustomSubjectTab;
                      const rawChapters = getMilestoneSubjectChapters(activeSubForList);
                      const formattedChapters = newSubject === 'CUSTOM'
                        ? rawChapters.map(c => `[${activeSubForList}] ${c}`)
                        : rawChapters;
                      const filteredChapters = formattedChapters.filter(ch =>
                        !newChapterSearch.trim() || ch.toLowerCase().includes(newChapterSearch.toLowerCase())
                      );
                      const selectedSet = new Set(newSelectedChapters);

                      return (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-[10px] text-amber-400 uppercase font-bold">
                              Select Chapters to Achieve ({newSelectedChapters.length} Selected):
                            </label>
                            <div className="flex items-center gap-1.5 text-[10px] flex-wrap">
                              {newSubject !== 'CUSTOM' && checkpoints.some(cp => cp.subjectId === newSubject && cp.revisionCycle === newCycle) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewSelectedChapters(getUnallocatedChaptersForSubjectCycle(newSubject, newCycle));
                                  }}
                                  className="px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/35 cursor-pointer font-bold"
                                  title="Select only chapters not yet assigned to earlier milestones of this subject in this cycle"
                                >
                                  ⚡ Select Unallocated Only ({getUnallocatedChaptersForSubjectCycle(newSubject, newCycle).length})
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const combined = Array.from(new Set([...newSelectedChapters, ...formattedChapters]));
                                  setNewSelectedChapters(combined);
                                }}
                                className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 cursor-pointer font-bold"
                              >
                                Select All {newSubject === 'CUSTOM' ? activeSubForList : ''}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (newSubject === 'CUSTOM') {
                                    setNewSelectedChapters(prev => prev.filter(c => !c.startsWith(`[${activeSubForList}] `)));
                                  } else {
                                    setNewSelectedChapters([]);
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                              >
                                Clear
                              </button>
                            </div>
                          </div>

                          {/* Subject Tabs if CUSTOM milestone */}
                          {newSubject === 'CUSTOM' && (
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              {levelSubjects.map(sub => {
                                const countInSub = newSelectedChapters.filter(c => c.startsWith(`[${sub}] `)).length;
                                return (
                                  <button
                                    key={sub}
                                    type="button"
                                    onClick={() => setNewCustomSubjectTab(sub)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer flex items-center gap-1 ${
                                      newCustomSubjectTab === sub
                                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    <span>{sub}</span>
                                    {countInSub > 0 && (
                                      <span className={`px-1 rounded text-[9px] ${newCustomSubjectTab === sub ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                        {countInSub}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Search input */}
                          <div className="relative">
                            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2" />
                            <input
                              type="text"
                              placeholder={`Search ${activeSubForList} chapters...`}
                              value={newChapterSearch}
                              onChange={(e) => setNewChapterSearch(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                            />
                          </div>

                          {/* Chapter Checkboxes List */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                            {filteredChapters.map((chap, i) => {
                              const isChecked = selectedSet.has(chap);
                              return (
                                <button
                                  key={`${chap}_${i}`}
                                  type="button"
                                  onClick={() => {
                                    setNewSelectedChapters(prev =>
                                      prev.includes(chap)
                                        ? prev.filter(c => c !== chap)
                                        : [...prev, chap]
                                    );
                                  }}
                                  className={`p-2 rounded-xl border text-left text-[11px] font-sans flex items-center gap-2 transition cursor-pointer ${
                                    isChecked
                                      ? 'bg-amber-500/15 border-amber-400/50 text-white font-semibold'
                                      : 'bg-slate-900/50 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750'
                                  }`}
                                >
                                  {isChecked ? (
                                    <CheckSquare className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                  ) : (
                                    <Square className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                                  )}
                                  <span className="truncate">{chap}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono rounded-xl transition cursor-pointer shadow-md"
                  >
                    Save Milestone & {newSelectedChapters.length || 'All'} Chapters
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL E: EXPAND FLOW SEGMENT (DAY-BY-DAY LIST)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {expandedSegment && (
          <ModalPortal>
          <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-[#0c1024] border border-slate-800 text-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[88vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center font-bold">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider">
                      Topics Covered Between Checkpoints
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {expandedSegment.fromLabel} ({expandedSegment.fromDate}) ➔ {expandedSegment.toLabel} ({expandedSegment.toDate})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedSegment(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Day-by-Day Topics Feed */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1 flex items-center justify-between">
                  <span>Day-by-Day Journey ({expandedSegment.days.length} Days)</span>
                  <span className="text-amber-400">
                    {expandedSegment.days.filter(d => d.hasCompleted).length} days completed
                  </span>
                </div>

                {expandedSegment.days.length === 0 ? (
                  <div className="p-6 text-center bg-slate-950/50 rounded-2xl border border-slate-850 text-slate-500 font-mono text-xs">
                    No intermediate days in this segment window.
                  </div>
                ) : (
                  expandedSegment.days.map((day) => (
                    <div
                      key={day.dateStr}
                      className={`p-3 rounded-2xl border transition space-y-1.5 ${
                        day.hasCompleted 
                          ? 'bg-slate-950/90 border-emerald-500/30' 
                          : day.isToday 
                            ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-400/20' 
                            : 'bg-slate-950/50 border-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            day.hasCompleted ? 'bg-emerald-400' : day.isToday ? 'bg-amber-400' : 'bg-slate-700'
                          }`} />
                          <strong className="text-white">{day.dateStr}</strong>
                          {day.isToday && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8.5px] font-bold">
                              Today
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold ${day.hasCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {day.completedCount} / {day.tasksCount} topics completed
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectDate(day.dateStr);
                              onOpenAddTargetModal();
                              setExpandedSegment(null);
                            }}
                            className="text-[9.5px] text-cyan-400 hover:underline"
                          >
                            + Add Target
                          </button>
                        </div>
                      </div>

                      {/* Topics List */}
                      {day.topics.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {day.topics.map((tp, idx) => (
                            <span 
                              key={`${day.dateStr}_${idx}`}
                              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-sans"
                            >
                              • {tp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-500 italic">
                          No study topics logged for this date.
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between shrink-0 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAddTargetModal();
                    setExpandedSegment(null);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer flex items-center gap-1 shadow-md"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Add Study Target</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSegment(null)}
                  className="px-3.5 py-1.5 bg-slate-900 text-slate-300 hover:text-white rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL F: SIDELINE DAILY BOARD
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSidelineOpen && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="absolute top-13 bottom-0 right-0 w-80 bg-[#090c1a]/95 border-l border-slate-800 p-4 shadow-2xl backdrop-blur-md z-40 flex flex-col justify-between"
          >
            <div className="space-y-3 overflow-hidden flex flex-col flex-1">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Sideline Study Planner</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidelineOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <PanelRightClose className="h-4 w-4" />
                </button>
              </div>

              {/* Date Switcher */}
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px] font-mono">
                <span className="text-slate-400">Date:</span>
                <input
                  type="date"
                  value={sidelineDate}
                  onChange={(e) => setSidelineDate(e.target.value)}
                  className="bg-slate-900 text-white rounded px-1.5 py-0.5 text-[10px]"
                />
              </div>

              {/* Milestones Quick-Select Strip in Sideline Daily Planner */}
              {sortedCheckpoints.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-2 space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between text-[9.5px] font-mono text-amber-300 uppercase font-bold">
                    <span>Milestones • Quick-Select</span>
                    <span className="text-slate-500">{sortedCheckpoints.length}</span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-0.5">
                    {sortedCheckpoints.map((cp) => (
                      <div
                        key={`side_ms_${cp.id}`}
                        className="flex items-center justify-between gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-mono"
                      >
                        <div className="truncate flex items-center gap-1.5">
                          <span className="text-amber-400 font-black">{cp.subjectId}</span>
                          <span className="text-slate-300 truncate">
                            {cp.customTitle || cp.revisionCycle}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTriggerQuickSelect(cp)}
                          className={`px-2 py-0.5 rounded text-[9px] font-black shrink-0 cursor-pointer transition flex items-center gap-0.5 ${
                            quickSelectedCpId === cp.id
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                          }`}
                          title="Quick-Select all underlying chapters as today's active tasks"
                        >
                          <Zap className="h-2.5 w-2.5" />
                          <span>{quickSelectedCpId === cp.id ? 'Added ✓' : 'Quick-Select'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Targets for {sidelineDate} ({tasksByDate.get(sidelineDate)?.length || 0}):
                </div>
                {(!tasksByDate.get(sidelineDate) || tasksByDate.get(sidelineDate)!.length === 0) ? (
                  <div className="p-4 text-center text-xs font-mono text-slate-500">
                    No targets for this date.
                  </div>
                ) : (
                  tasksByDate.get(sidelineDate)!.map((t, i) => {
                    const isDone = t.status === 'completed' || Boolean(t.completed);
                    return (
                      <div 
                        key={`${t.id || 'sideline'}_${i}`}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {onToggleTaskCompleted && (
                            <button
                              type="button"
                              onClick={() => onToggleTaskCompleted(t)}
                              className="text-slate-500 hover:text-emerald-400 cursor-pointer"
                            >
                              {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-3 w-3 rounded-full border border-slate-500" />}
                            </button>
                          )}
                          <span className={`truncate text-[11px] ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {t.cleanTitle || t.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {t.subjectCode || 'FR'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sideline Actions */}
            <div className="pt-3 border-t border-slate-850 space-y-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAddTargetModal()}
                className="w-full py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Daily Target</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToDailyView}
                className="w-full py-1 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-[10px] cursor-pointer"
              >
                Open Full Daily Board
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          EXPANDED FULL-SCREEN ROADMAP MODAL
          "expanded view option for the road map in the planner ."
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isExpandedViewOpen && (
          <ModalPortal>
          <div 
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[90] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsExpandedViewOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#0a0d1f] border border-amber-500/40 rounded-2xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl relative space-y-4 max-h-[94vh] flex flex-col text-left my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 flex items-center justify-center font-bold text-sm">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
                      <span>Milestone Preparation Calendar • Expanded View</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Interactive Calendar
                      </span>
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-mono">
                      Full Date-Span & Target Milestone Highlights • {checkpoints.length} Checkpoint{checkpoints.length === 1 ? '' : 's'} • {examScheduleInfo.hasScheduledExam ? `${examCountdown.days}d ${examCountdown.hours}h to Exam` : 'No Scheduled Exam'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isLmrMode && (
                    <button
                      type="button"
                      onClick={() => setShowAddModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs font-mono transition cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[3]" />
                      <span>+ Add Checkpoint</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsExpandedViewOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Expanded Calendar Canvas */}
              <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[#070916] p-3 rounded-xl border border-slate-850 select-none scrollbar-thin scrollbar-thumb-slate-700 min-h-[520px] flex flex-col">
                {renderMilestoneCalendarView(true)}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 shrink-0 text-xs font-mono">
                <span className="text-slate-400">
                  Click any highlighted milestone span to Edit/Inspect, or click any date cell to Add a new Milestone.
                </span>
                <button
                  type="button"
                  onClick={() => setIsExpandedViewOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-750 rounded-xl font-bold transition cursor-pointer"
                >
                  Close Expanded View
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>
      {/* ─────────────────────────────────────────────────────────────
          MILESTONE TEST COMPLETED — PENDING TARGETS ACTION CONFIRMATION MODAL
          Immediately prompts student when test is completed but tasks/chapters are pending:
          1. Close Pending Targets (Mark completed with post-test note)
          2. Spread Over Upcoming Study Days (Fill today to capacity, then spread)
          3. Keep As-Is
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {milestoneTestPendingModal && (
          <ModalPortal>
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-[#0b0e1e] border border-amber-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-left relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                          {milestoneTestPendingModal.checkpoint.subjectId} • {milestoneTestPendingModal.checkpoint.revisionCycle}
                        </span>
                        {milestoneTestPendingModal.checkpoint.mockScoreObtained !== undefined && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                            Score: {milestoneTestPendingModal.checkpoint.mockScoreObtained}/100
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-white font-display mt-1">
                        Milestone Test Completed — Pending Targets Detected
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        You have completed the test for <strong className="text-amber-200">{milestoneTestPendingModal.checkpoint.customTitle || `${milestoneTestPendingModal.checkpoint.subjectId} ${milestoneTestPendingModal.checkpoint.revisionCycle}`}</strong>, but there are still 
                        <strong className="text-amber-300 font-mono ml-1">
                          {milestoneTestPendingModal.pendingTasks.length > 0 
                            ? `${milestoneTestPendingModal.pendingTasks.length} pending task(s)` 
                            : `${milestoneTestPendingModal.pendingChapters.length} pending target chapter(s)`}
                        </strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMilestoneTestPendingModal(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Detected Pending Targets Preview */}
                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-wider">
                    Pending Targets in this Milestone:
                  </span>
                  <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                    {milestoneTestPendingModal.pendingTasks.length > 0 ? (
                      milestoneTestPendingModal.pendingTasks.map((t, idx) => (
                        <div key={t.id || idx} className="text-xs text-slate-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{t.cleanTitle || t.title}</span>
                          {t.chapterName && <span className="text-[10px] text-slate-500 truncate">({t.chapterName})</span>}
                        </div>
                      ))
                    ) : (
                      milestoneTestPendingModal.pendingChapters.map((ch, idx) => (
                        <div key={idx} className="text-xs text-slate-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{ch}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Options Call-to-Actions */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleClosePendingMilestoneTargets}
                    className="w-full p-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-black text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Close Pending Targets</span>
                      </div>
                      <p className="text-[11px] text-emerald-950 font-semibold mt-0.5">
                        Mark all pending targets completed with note "[Completed Post-Test Assessment]"
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-950" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSpreadPendingMilestoneTargets}
                    className="w-full p-3.5 bg-slate-900 hover:bg-slate-850 border border-amber-500/40 hover:border-amber-400 text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-black text-sm text-amber-300">
                        <Calendar className="h-4 w-4 text-amber-400" />
                        <span>Spread Over Upcoming Study Days</span>
                      </div>
                      <p className="text-[11px] text-slate-350 font-medium mt-0.5">
                        Fill today's block up to capacity (3 tasks), then spread remaining tasks evenly across next study blocks
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-amber-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMilestoneTestPendingModal(null)}
                    className="w-full py-2.5 text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    Keep Pending Targets As-Is (Decide Later)
                  </button>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>
      {/* ─────────────────────────────────────────────────────────────
          MILESTONE MOCK TEST — SCHEDULE 24-HOUR TARGET CLOCK SLOT MODAL
          Prompts student with standard 3-hour ICAI exam slot (2:00 PM - 5:00 PM)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mockSlotScheduleModal && (
          <ModalPortal>
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none font-mono">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-[#0b0e20] border-2 border-cyan-500/40 text-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.18)] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        Schedule Mock Test in 24-Hr Clock
                      </h3>
                      <p className="text-[10.5px] text-slate-400">
                        ICAI Standard 3-Hour Exam Slot (2:00 PM – 5:00 PM)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMockSlotScheduleModal(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Milestone:</span>
                      <span className="text-amber-300 font-bold">
                        {mockSlotScheduleModal.checkpoint.customTitle || mockSlotScheduleModal.checkpoint.subjectId} ({mockSlotScheduleModal.checkpoint.revisionCycle})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Exam Target Date:</span>
                      <span className="text-white font-bold">{mockSlotScheduleModal.dateStr}</span>
                    </div>
                  </div>

                  {/* Standard ICAI Slot Preset Banner */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black">
                          ICAI EXAM PROTOCOL
                        </span>
                        <span className="text-xs font-bold text-white">2:00 PM – 5:00 PM (180 mins)</span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans">
                      Aligns with official ICAI examination timing. A designated 3-hour mock slot will be pinned to your 24-Hour Target Clock on <strong>{mockSlotScheduleModal.dateStr}</strong>.
                    </p>
                  </div>

                  {/* Customizable Time Range Inputs */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        Start Time (ICAI 2:00 PM):
                      </label>
                      <input
                        type="time"
                        value={mockSlotScheduleModal.startTime}
                        onChange={(e) => setMockSlotScheduleModal(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        End Time (ICAI 5:00 PM):
                      </label>
                      <input
                        type="time"
                        value={mockSlotScheduleModal.endTime}
                        onChange={(e) => setMockSlotScheduleModal(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMockSlotScheduleModal(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer transition"
                  >
                    Skip Slot Scheduling
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmMockTestClockSlot(mockSlotScheduleModal.startTime, mockSlotScheduleModal.endTime)}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-500/20 cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Add to 24-Hour Clock</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
}
