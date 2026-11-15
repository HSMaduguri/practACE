import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Flag, Target, CheckCircle2, Clock, Sparkles, Plus, 
  Trash2, AlertTriangle, TrendingUp, Award, Zap, BookOpen, Layers, 
  Check, ArrowRight, CheckSquare, Square, X, PanelRightClose, 
  PanelRightOpen, RefreshCw, Compass, MapPin, ChevronRight, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubjectId, GoogleTask } from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { getLevelSubjectIds } from '../data/curriculumLevels';
import { useCALevel, getLevelScopedKey } from '../utils/levelStorage';
import { ModalPortal } from './ModalPortal';
import { auth, db } from '../lib/firebase';
import { doc as firestoreDoc, setDoc } from 'firebase/firestore';
import { syncTaskCompletionAcrossAllLinks, useTargetSystemSync } from '../utils/taskCompletionSync';

export interface SubjectRevisionPlan {
  subjectId: SubjectId;
  targetDate: string; // YYYY-MM-DD specified date to complete this subject's revision
  notes?: string;
  targetChapters?: number;
  completedChapters?: string[]; // chapter names marked completed for this revision
}

export interface RevisionPhase {
  id: string;
  title: string;
  revisionType: '1st Revision' | '2nd Revision' | '3rd Revision' | 'Final Sprint' | 'Custom';
  startDate: string;
  targetEndDate: string;
  subjectPlans: Partial<Record<SubjectId, SubjectRevisionPlan>>;
}

interface PreparationRoadmapViewProps {
  tasks: GoogleTask[];
  onOpenAddTargetModal: (subject?: SubjectId, chapter?: string) => void;
  onSelectDate: (date: string) => void;
  onNavigateToDailyView: () => void;
  onNavigateToWeeklyView?: () => void;
  onToggleTaskCompleted?: (task: GoogleTask) => void;
}

const SUBJECT_COLORS: Record<SubjectId, { 
  bg: string; 
  text: string; 
  border: string; 
  bar: string; 
  glow: string; 
  badge: string; 
  hex: string;
  tagBg: string;
}> = {
  Accounts: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    bar: 'bg-purple-500',
    glow: 'rgba(168, 85, 247, 0.4)',
    badge: 'bg-purple-950/70 text-purple-300 border-purple-800',
    hex: '#a855f7',
    tagBg: 'bg-purple-900/60'
  },
  Law: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    bar: 'bg-sky-500',
    glow: 'rgba(14, 165, 233, 0.4)',
    badge: 'bg-sky-950/70 text-sky-300 border-sky-800',
    hex: '#0ea5e9',
    tagBg: 'bg-sky-900/60'
  },
  MathStats: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bar: 'bg-amber-500',
    glow: 'rgba(245, 158, 11, 0.4)',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-800',
    hex: '#f59e0b',
    tagBg: 'bg-amber-900/60'
  },
  Econ: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bar: 'bg-emerald-500',
    glow: 'rgba(16, 185, 129, 0.4)',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
    hex: '#10b981',
    tagBg: 'bg-emerald-900/60'
  },
  AdvAcc: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/40',
    bar: 'bg-purple-500',
    glow: 'rgba(168, 85, 247, 0.4)',
    badge: 'bg-purple-950/70 text-purple-300 border-purple-800',
    hex: '#a855f7',
    tagBg: 'bg-purple-900/60'
  },
  CorpLaw: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/40',
    bar: 'bg-sky-500',
    glow: 'rgba(14, 165, 233, 0.4)',
    badge: 'bg-sky-950/70 text-sky-300 border-sky-800',
    hex: '#0ea5e9',
    tagBg: 'bg-sky-900/60'
  },
  Tax: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bar: 'bg-emerald-500',
    glow: 'rgba(16, 185, 129, 0.4)',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
    hex: '#10b981',
    tagBg: 'bg-emerald-900/60'
  },
  Cost: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    bar: 'bg-amber-500',
    glow: 'rgba(245, 158, 11, 0.4)',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-800',
    hex: '#f59e0b',
    tagBg: 'bg-amber-900/60'
  },
  AuditInter: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/40',
    bar: 'bg-pink-500',
    glow: 'rgba(236, 72, 153, 0.4)',
    badge: 'bg-pink-950/70 text-pink-300 border-pink-800',
    hex: '#ec4899',
    tagBg: 'bg-pink-900/60'
  },
  FMSM: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/40',
    bar: 'bg-indigo-500',
    glow: 'rgba(99, 102, 241, 0.4)',
    badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800',
    hex: '#6366f1',
    tagBg: 'bg-indigo-900/60'
  },
  FR: { 
    bg: 'bg-purple-500/10', 
    text: 'text-purple-400', 
    border: 'border-purple-500/40', 
    bar: 'bg-purple-500', 
    glow: 'rgba(168, 85, 247, 0.4)',
    badge: 'bg-purple-950/70 text-purple-300 border-purple-800',
    hex: '#a855f7',
    tagBg: 'bg-purple-900/60'
  },
  AFM: { 
    bg: 'bg-sky-500/10', 
    text: 'text-sky-400', 
    border: 'border-sky-500/40', 
    bar: 'bg-sky-500', 
    glow: 'rgba(14, 165, 233, 0.4)',
    badge: 'bg-sky-950/70 text-sky-300 border-sky-800',
    hex: '#0ea5e9',
    tagBg: 'bg-sky-900/60'
  },
  Audit: { 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400', 
    border: 'border-amber-500/40', 
    bar: 'bg-amber-500', 
    glow: 'rgba(245, 158, 11, 0.4)',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-800',
    hex: '#f59e0b',
    tagBg: 'bg-amber-900/60'
  },
  DT: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/40', 
    bar: 'bg-emerald-500', 
    glow: 'rgba(16, 185, 129, 0.4)',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
    hex: '#10b981',
    tagBg: 'bg-emerald-900/60'
  },
  IDT: { 
    bg: 'bg-pink-500/10', 
    text: 'text-pink-400', 
    border: 'border-pink-500/40', 
    bar: 'bg-pink-500', 
    glow: 'rgba(236, 72, 153, 0.4)',
    badge: 'bg-pink-950/70 text-pink-300 border-pink-800',
    hex: '#ec4899',
    tagBg: 'bg-pink-900/60'
  },
  IBS: { 
    bg: 'bg-indigo-500/10', 
    text: 'text-indigo-400', 
    border: 'border-indigo-500/40', 
    bar: 'bg-indigo-500', 
    glow: 'rgba(99, 102, 241, 0.4)',
    badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800',
    hex: '#6366f1',
    tagBg: 'bg-indigo-900/60'
  },
  // CMA Foundation (4 Papers)
  CMAFoundLaw: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/40', bar: 'bg-purple-500', glow: 'rgba(168, 85, 247, 0.4)', badge: 'bg-purple-950/70 text-purple-300 border-purple-800', hex: '#a855f7', tagBg: 'bg-purple-900/60' },
  CMAFoundAcc: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/40', bar: 'bg-sky-500', glow: 'rgba(14, 165, 233, 0.4)', badge: 'bg-sky-950/70 text-sky-300 border-sky-800', hex: '#0ea5e9', tagBg: 'bg-sky-900/60' },
  CMAFoundMath: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', bar: 'bg-amber-500', glow: 'rgba(245, 158, 11, 0.4)', badge: 'bg-amber-950/70 text-amber-300 border-amber-800', hex: '#f59e0b', tagBg: 'bg-amber-900/60' },
  CMAFoundEcon: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.4)', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800', hex: '#10b981', tagBg: 'bg-emerald-900/60' },
  // CMA Intermediate (4+4 = 8 Papers)
  CMAInterLaw: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/40', bar: 'bg-purple-500', glow: 'rgba(168, 85, 247, 0.4)', badge: 'bg-purple-950/70 text-purple-300 border-purple-800', hex: '#a855f7', tagBg: 'bg-purple-900/60' },
  CMAInterFA: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/40', bar: 'bg-sky-500', glow: 'rgba(14, 165, 233, 0.4)', badge: 'bg-sky-950/70 text-sky-300 border-sky-800', hex: '#0ea5e9', tagBg: 'bg-sky-900/60' },
  CMAInterTax: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', bar: 'bg-amber-500', glow: 'rgba(245, 158, 11, 0.4)', badge: 'bg-amber-950/70 text-amber-300 border-amber-800', hex: '#f59e0b', tagBg: 'bg-amber-900/60' },
  CMAInterCost: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.4)', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800', hex: '#10b981', tagBg: 'bg-emerald-900/60' },
  CMAInterOMSM: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/40', bar: 'bg-pink-500', glow: 'rgba(236, 72, 153, 0.4)', badge: 'bg-pink-950/70 text-pink-300 border-pink-800', hex: '#ec4899', tagBg: 'bg-pink-900/60' },
  CMAInterCAA: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/40', bar: 'bg-indigo-500', glow: 'rgba(99, 102, 241, 0.4)', badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800', hex: '#6366f1', tagBg: 'bg-indigo-900/60' },
  CMAInterFMDA: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/40', bar: 'bg-sky-500', glow: 'rgba(14, 165, 233, 0.4)', badge: 'bg-sky-950/70 text-sky-300 border-sky-800', hex: '#0ea5e9', tagBg: 'bg-sky-900/60' },
  CMAInterMA: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.4)', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800', hex: '#10b981', tagBg: 'bg-emerald-900/60' },
  // CMA Final (4+4 = 8 Papers)
  CMAFinalLaw: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/40', bar: 'bg-purple-500', glow: 'rgba(168, 85, 247, 0.4)', badge: 'bg-purple-950/70 text-purple-300 border-purple-800', hex: '#a855f7', tagBg: 'bg-purple-900/60' },
  CMAFinalSFM: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/40', bar: 'bg-sky-500', glow: 'rgba(14, 165, 233, 0.4)', badge: 'bg-sky-950/70 text-sky-300 border-sky-800', hex: '#0ea5e9', tagBg: 'bg-sky-900/60' },
  CMAFinalDT: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', bar: 'bg-amber-500', glow: 'rgba(245, 158, 11, 0.4)', badge: 'bg-amber-950/70 text-amber-300 border-amber-800', hex: '#f59e0b', tagBg: 'bg-amber-900/60' },
  CMAFinalSCM: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.4)', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800', hex: '#10b981', tagBg: 'bg-emerald-900/60' },
  CMAFinalCMA: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/40', bar: 'bg-pink-500', glow: 'rgba(236, 72, 153, 0.4)', badge: 'bg-pink-950/70 text-pink-300 border-pink-800', hex: '#ec4899', tagBg: 'bg-pink-900/60' },
  CMAFinalCFR: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/40', bar: 'bg-indigo-500', glow: 'rgba(99, 102, 241, 0.4)', badge: 'bg-indigo-950/70 text-indigo-300 border-indigo-800', hex: '#6366f1', tagBg: 'bg-indigo-900/60' },
  CMAFinalIDT: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', bar: 'bg-amber-500', glow: 'rgba(245, 158, 11, 0.4)', badge: 'bg-amber-950/70 text-amber-300 border-amber-800', hex: '#f59e0b', tagBg: 'bg-amber-900/60' },
  CMAFinalSPBV: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.4)', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800', hex: '#10b981', tagBg: 'bg-emerald-900/60' },
};

const SUBJECT_FULL_NAMES: Record<SubjectId, string> = {
  Accounts: 'Accounting',
  Law: 'Business Laws',
  MathStats: 'Quantitative Aptitude',
  Econ: 'Business Economics',
  AdvAcc: 'Advanced Accounting',
  CorpLaw: 'Corporate & Other Laws',
  Tax: 'Taxation (DT & GST)',
  Cost: 'Cost & Management Accounting',
  AuditInter: 'Auditing & Ethics',
  FMSM: 'Financial & Strategic Management',
  FR: 'Financial Reporting',
  AFM: 'Advanced Financial Management',
  Audit: 'Auditing & Professional Ethics',
  DT: 'Direct Tax & International Tax',
  IDT: 'Indirect Tax Laws (GST & Customs)',
  IBS: 'Integrated Business Solutions',
  CMAFoundLaw: 'Business Laws & Business Communication',
  CMAFoundAcc: 'Financial & Cost Accounting',
  CMAFoundMath: 'Business Mathematics & Statistics',
  CMAFoundEcon: 'Business Economics & Management',
  CMAInterLaw: 'Business Laws & Ethics',
  CMAInterFA: 'Financial Accounting',
  CMAInterTax: 'Direct & Indirect Taxation',
  CMAInterCost: 'Cost Accounting',
  CMAInterOMSM: 'Operations Mgmt & Strategic Mgmt',
  CMAInterCAA: 'Corporate Accounting & Auditing',
  CMAInterFMDA: 'Financial Mgmt & Business Data Analytics',
  CMAInterMA: 'Management Accounting',
  CMAFinalLaw: 'Corporate & Economic Laws',
  CMAFinalSFM: 'Strategic Financial Management',
  CMAFinalDT: 'Direct Tax Laws & International Taxation',
  CMAFinalSCM: 'Strategic Cost Management',
  CMAFinalCMA: 'Cost & Management Audit',
  CMAFinalCFR: 'Corporate Financial Reporting',
  CMAFinalIDT: 'Indirect Tax Laws & Practice',
  CMAFinalSPBV: 'Strategic Performance Mgmt & Business Valuation'
};

const BASE_STORAGE_KEY_CONFIG = 'practca_prep_roadmap_config_v2';
const BASE_STORAGE_KEY_REVISIONS = 'practca_prep_roadmap_revisions_v2';

export default function PreparationRoadmapView({
  tasks,
  onOpenAddTargetModal,
  onSelectDate,
  onNavigateToDailyView,
  onNavigateToWeeklyView,
  onToggleTaskCompleted
}: PreparationRoadmapViewProps) {
  const caLevel = useCALevel();
  const DEFAULT_SUBJECTS = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);
  const STORAGE_KEY_CONFIG = getLevelScopedKey(BASE_STORAGE_KEY_CONFIG, caLevel);
  const STORAGE_KEY_REVISIONS = getLevelScopedKey(BASE_STORAGE_KEY_REVISIONS, caLevel);

  // 1. Master Preparation Dates (Start -> Exam)
  const [prepStartDate, setPrepStartDate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.prepStartDate) return parsed.prepStartDate;
      }
    } catch (e) {}
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });

  const [examDate, setExamDate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.examDate) return parsed.examDate;
      }
    } catch (e) {}
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  });

  // 2. Revisions State (1st Revision, 2nd Revision, 3rd Revision)
  const [revisions, setRevisions] = useState<RevisionPhase[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REVISIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    const today = new Date();
    const addDays = (base: Date, days: number) => {
      const d = new Date(base);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const rev1Plans: Partial<Record<SubjectId, SubjectRevisionPlan>> = {};
    const rev2Plans: Partial<Record<SubjectId, SubjectRevisionPlan>> = {};
    const rev3Plans: Partial<Record<SubjectId, SubjectRevisionPlan>> = {};
    DEFAULT_SUBJECTS.forEach((subId, idx) => {
      const chapsCount = SUBJECTS_METADATA[subId]?.chapters?.length || 15;
      rev1Plans[subId] = { subjectId: subId, targetDate: addDays(today, (idx + 1) * 11), targetChapters: chapsCount, completedChapters: [] };
      rev2Plans[subId] = { subjectId: subId, targetDate: addDays(today, 65 + (idx + 1) * 4), targetChapters: chapsCount, completedChapters: [] };
      rev3Plans[subId] = { subjectId: subId, targetDate: addDays(today, 88 + (idx + 1) * 2), targetChapters: chapsCount, completedChapters: [] };
    });

    return [
      {
        id: 'rev_1',
        title: '1st Revision',
        revisionType: '1st Revision',
        startDate: prepStartDate,
        targetEndDate: addDays(today, 65),
        subjectPlans: rev1Plans
      },
      {
        id: 'rev_2',
        title: '2nd Revision',
        revisionType: '2nd Revision',
        startDate: addDays(today, 66),
        targetEndDate: addDays(today, 88),
        subjectPlans: rev2Plans
      },
      {
        id: 'rev_3',
        title: '3rd Revision',
        revisionType: '3rd Revision',
        startDate: addDays(today, 89),
        targetEndDate: addDays(today, 100),
        subjectPlans: rev3Plans
      }
    ];
  });

  const [activeRevisionId, setActiveRevisionId] = useState<string>(() => revisions[0]?.id || 'rev_1');
  
  // Selected checkpoint for Inspection Modal / Overlay (null means full map view)
  const [inspectCheckpointSubId, setInspectCheckpointSubId] = useState<SubjectId | null>(null);
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>('');

  // Sideline Daily Tasks Drawer state
  const [isSidelineOpen, setIsSidelineOpen] = useState<boolean>(false);
  const [sidelineDate, setSidelineDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Add Custom Revision Modal state
  const [showAddRevisionModal, setShowAddRevisionModal] = useState<boolean>(false);
  const [newRevTitle, setNewRevTitle] = useState<string>('');
  const [newRevEndDate, setNewRevEndDate] = useState<string>('');

  // Unified Target System Synchronization Hook
  const { syncVersion, roadmapRevisions } = useTargetSystemSync();

  useEffect(() => {
    if (Array.isArray(roadmapRevisions) && roadmapRevisions.length > 0) {
      setRevisions(prev => {
        if (JSON.stringify(prev) === JSON.stringify(roadmapRevisions)) return prev;
        return roadmapRevisions;
      });
    }
  }, [roadmapRevisions, syncVersion]);

  // Persist revisions & config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVISIONS, JSON.stringify(revisions));
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const ref = firestoreDoc(db, 'users', uid, 'planner_settings', 'roadmap_revisions');
        setDoc(ref, {
          revisions,
          prepStartDate,
          examDate,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
      }
    } catch (e) {}
  }, [revisions, prepStartDate, examDate]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify({ prepStartDate, examDate }));
    } catch (e) {}
  }, [prepStartDate, examDate]);

  // Overall Preparation Timeline Metrics
  const timelineMetrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(prepStartDate);
    start.setHours(0, 0, 0, 0);

    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    const totalDays = Math.max(1, Math.round((exam.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const daysElapsed = Math.max(0, Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.round((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const percentElapsed = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

    return { totalDays, daysElapsed, daysRemaining, percentElapsed };
  }, [prepStartDate, examDate]);

  const currentRevision = useMemo(() => {
    return revisions.find(r => r.id === activeRevisionId) || revisions[0];
  }, [revisions, activeRevisionId]);

  // Analytics per subject checkpoint
  const subjectAnalytics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result: Record<SubjectId, {
      subjectId: SubjectId;
      fullName: string;
      checkpointNum: number;
      targetDate: string;
      daysRemaining: number;
      isOverdue: boolean;
      totalChapters: number;
      completedChapters: string[];
      completedChaptersCount: number;
      fillPercentage: number;
      connectedTasks: GoogleTask[];
      completedTasksCount: number;
      studyPoints: number;
      statusVerdict: 'filled' | 'on_track' | 'pace_alert' | 'behind';
    }> = {} as any;

    DEFAULT_SUBJECTS.forEach((subId, index) => {
      const subMeta = SUBJECTS_METADATA[subId];
      const allChapters = subMeta?.chapters || [];
      const plan = currentRevision?.subjectPlans?.[subId] || {
        subjectId: subId,
        targetDate: examDate,
        completedChapters: []
      };

      const activeRevKey = currentRevision?.revisionType === '1st Revision'
        ? 'rev1'
        : currentRevision?.revisionType === '2nd Revision'
          ? 'rev2'
          : (currentRevision?.revisionType === '3rd Revision' || currentRevision?.revisionType === 'Final Sprint')
            ? 'rev3'
            : undefined;
      const revStartDate = currentRevision?.startDate || prepStartDate;
      const revEndDate = plan.targetDate || currentRevision?.targetEndDate || examDate;

      const subjectTasks = tasks.filter(t => {
        if (t.subjectCode !== subId) return false;
        if (t.revKey && activeRevKey) {
          return t.revKey === activeRevKey;
        }
        if (revisions.length > 1) {
          const tDate = (t.due || t.taskDate || '').split('T')[0];
          if (tDate && (tDate < revStartDate || tDate > revEndDate)) {
            return false;
          }
        }
        return true;
      });
      const completedTasks = subjectTasks.filter(t => t.status === 'completed' || Boolean(t.completed));

      const manuallyCheckedChapters = new Set<string>(plan.completedChapters || []);
      
      completedTasks.forEach(t => {
        if (t.chapterName && allChapters.includes(t.chapterName)) {
          manuallyCheckedChapters.add(t.chapterName);
        } else {
          const lowerTitle = (t.cleanTitle || t.title || '').toLowerCase();
          const matched = allChapters.find(ch => lowerTitle.includes(ch.toLowerCase().slice(0, 15)));
          if (matched) {
            manuallyCheckedChapters.add(matched);
          }
        }
      });

      const completedChaptersList: string[] = Array.from(manuallyCheckedChapters);
      const completedChaptersCount = completedChaptersList.length;
      const totalChapters = allChapters.length || 15;
      const fillPercentage = Math.min(100, Math.round((completedChaptersCount / totalChapters) * 100));

      let studyPoints = 0;
      completedTasks.forEach(t => {
        const dur = t.targetDurationMinutes || t.duration || 45;
        const isFinalRev = t.relevance === 'Final Revision';
        studyPoints += 100 + (isFinalRev ? 50 : 25) + Math.min(50, Math.round(dur / 2));
      });

      const targetDate = plan.targetDate || examDate;
      const targetObj = new Date(targetDate);
      targetObj.setHours(0, 0, 0, 0);
      const daysRemaining = Math.round((targetObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isOverdue = daysRemaining < 0 && fillPercentage < 100;

      let statusVerdict: 'filled' | 'on_track' | 'pace_alert' | 'behind' = 'on_track';
      if (fillPercentage >= 100) {
        statusVerdict = 'filled';
      } else if (isOverdue) {
        statusVerdict = 'behind';
      } else if (daysRemaining <= 5 && fillPercentage < 60) {
        statusVerdict = 'pace_alert';
      } else {
        statusVerdict = 'on_track';
      }

      result[subId] = {
        subjectId: subId,
        fullName: SUBJECT_FULL_NAMES[subId],
        checkpointNum: index + 1,
        targetDate,
        daysRemaining,
        isOverdue,
        totalChapters,
        completedChapters: completedChaptersList,
        completedChaptersCount,
        fillPercentage,
        connectedTasks: subjectTasks,
        completedTasksCount: completedTasks.length,
        studyPoints,
        statusVerdict
      };
    });

    return result;
  }, [tasks, currentRevision, examDate]);

  // Overall Map Fill %
  const overallRevisionFill = useMemo(() => {
    const list = Object.values(subjectAnalytics) as Array<{ fillPercentage: number }>;
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.fillPercentage, 0);
    return Math.round(sum / list.length);
  }, [subjectAnalytics]);

  const totalPrepStudyPoints = useMemo(() => {
    const list = Object.values(subjectAnalytics) as Array<{ studyPoints: number }>;
    return list.reduce((acc, curr) => acc + curr.studyPoints, 0);
  }, [subjectAnalytics]);

  // Handlers for date changes
  const handleUpdateSubjectTargetDate = (subId: SubjectId, newDateStr: string) => {
    if (!newDateStr || !currentRevision) return;
    setRevisions(prev => prev.map(rev => {
      if (rev.id === currentRevision.id) {
        return {
          ...rev,
          subjectPlans: {
            ...rev.subjectPlans,
            [subId]: {
              ...(rev.subjectPlans[subId] || { subjectId: subId, completedChapters: [] }),
              targetDate: newDateStr
            }
          }
        };
      }
      return rev;
    }));
  };

  const handleShiftSubjectDate = (subId: SubjectId, daysToAdd: number) => {
    const current = subjectAnalytics[subId]?.targetDate || new Date().toISOString().split('T')[0];
    const d = new Date(current);
    d.setDate(d.getDate() + daysToAdd);
    handleUpdateSubjectTargetDate(subId, d.toISOString().split('T')[0]);
  };

  const handleToggleChapter = (subId: SubjectId, chapterName: string) => {
    if (!currentRevision) return;
    setRevisions(prev => prev.map(rev => {
      if (rev.id === currentRevision.id) {
        const plan = rev.subjectPlans[subId] || { subjectId: subId, targetDate: examDate, completedChapters: [] };
        const existingChapters = new Set<string>(plan.completedChapters || []);
        const isNowDone = !existingChapters.has(chapterName);
        if (existingChapters.has(chapterName)) {
          existingChapters.delete(chapterName);
        } else {
          existingChapters.add(chapterName);
        }
        const targetRevKey: 'rev1' | 'rev2' | 'rev3' | undefined =
          rev.revisionType === '1st Revision'
            ? 'rev1'
            : rev.revisionType === '2nd Revision'
              ? 'rev2'
              : (rev.revisionType === '3rd Revision' || rev.revisionType === 'Final Sprint')
                ? 'rev3'
                : undefined;
        setTimeout(() => {
          syncTaskCompletionAcrossAllLinks(
            {
              title: chapterName,
              cleanTitle: chapterName,
              subjectCode: subId,
              chapterName,
              due: plan.targetDate,
              taskDate: plan.targetDate,
              revKey: targetRevKey,
              phaseId: rev.id
            },
            isNowDone,
            {
              selectedDate: plan.targetDate,
              phaseId: rev.id
            }
          );
        }, 0);
        return {
          ...rev,
          subjectPlans: {
            ...rev.subjectPlans,
            [subId]: {
              ...plan,
              completedChapters: Array.from(existingChapters)
            }
          }
        };
      }
      return rev;
    }));
  };

  const handleAutoDistributeSequentialDates = () => {
    if (!currentRevision) return;
    const start = new Date(prepStartDate);
    const end = new Date(currentRevision.targetEndDate || examDate);
    const totalSpanMs = Math.max(1, end.getTime() - start.getTime());
    const stepMs = totalSpanMs / DEFAULT_SUBJECTS.length;

    setRevisions(prev => prev.map(rev => {
      if (rev.id === currentRevision.id) {
        const updatedPlans = { ...rev.subjectPlans };
        DEFAULT_SUBJECTS.forEach((subId, idx) => {
          const targetMs = start.getTime() + stepMs * (idx + 1);
          const targetDateStr = new Date(targetMs).toISOString().split('T')[0];
          updatedPlans[subId] = {
            ...(updatedPlans[subId] || { subjectId: subId, completedChapters: [] }),
            targetDate: targetDateStr
          };
        });
        return {
          ...rev,
          subjectPlans: updatedPlans
        };
      }
      return rev;
    }));
  };

  const handleCreateCustomRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevTitle.trim()) return;

    const today = new Date();
    const addDays = (base: Date, days: number) => {
      const d = new Date(base);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    const newRevId = `rev_${Date.now()}`;
    const targetEnd = newRevEndDate || examDate;

    const initialPlans: Partial<Record<SubjectId, SubjectRevisionPlan>> = {};
    DEFAULT_SUBJECTS.forEach((subId, idx) => {
      initialPlans[subId] = { subjectId: subId, targetDate: addDays(today, (idx + 1) * 10), completedChapters: [] };
    });

    const newRevision: RevisionPhase = {
      id: newRevId,
      title: newRevTitle.trim(),
      revisionType: 'Custom',
      startDate: today.toISOString().split('T')[0],
      targetEndDate: targetEnd,
      subjectPlans: initialPlans
    };

    setRevisions(prev => [...prev, newRevision]);
    setActiveRevisionId(newRevId);
    setShowAddRevisionModal(false);
    setNewRevTitle('');
  };

  const sidelineTasks = useMemo(() => {
    return tasks.filter(t => {
      const tDate = t.due ? t.due.split('T')[0] : (t as any).taskDate;
      return tDate === sidelineDate;
    });
  }, [tasks, sidelineDate]);

  // Compute active checkpoint subject currently being inspected
  const activeInspectData = inspectCheckpointSubId ? subjectAnalytics[inspectCheckpointSubId] : null;
  const inspectSubMeta = inspectCheckpointSubId ? SUBJECTS_METADATA[inspectCheckpointSubId] : null;
  const filteredInspectChapters = useMemo(() => {
    if (!inspectSubMeta) return [];
    if (!chapterSearchQuery.trim()) return inspectSubMeta.chapters;
    return inspectSubMeta.chapters.filter(ch => ch.toLowerCase().includes(chapterSearchQuery.toLowerCase()));
  }, [inspectSubMeta, chapterSearchQuery]);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] max-h-[880px] w-full flex flex-col bg-[#070913] border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl select-none font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FIXED TOP COMMAND STRIP: REVISIONS & TIMELINE COORDINATES
          ───────────────────────────────────────────────────────────── */}
      <div className="min-h-14 py-2 bg-[#0a0d1b] border-b border-slate-800 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2.5 shrink-0 relative z-20">
        
        {/* Left: Revision Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 mr-1 text-[11px] font-mono font-black text-amber-400 uppercase tracking-wider">
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Map Phase:</span>
          </div>

          {revisions.map((rev) => {
            const isActive = activeRevisionId === rev.id;
            return (
              <button
                key={rev.id}
                type="button"
                onClick={() => setActiveRevisionId(rev.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <span>{rev.title.split(':')[0]}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowAddRevisionModal(true)}
            className="p-1 px-2 rounded-xl text-xs font-mono font-bold bg-slate-900 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-slate-800 transition shrink-0 cursor-pointer flex items-center gap-0.5"
            title="Add another revision phase"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Center: Quick Coordinates (Start -> Target Date) */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] bg-slate-950/80 border border-slate-800/80 px-3 py-1 rounded-xl">
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-cyan-400" />
            <span>Start:</span>
            <strong className="text-slate-200">{prepStartDate}</strong>
          </span>
          <ArrowRight className="h-3 w-3 text-slate-600" />
          <span className="text-slate-400 flex items-center gap-1">
            <Flag className="h-3 w-3 text-amber-400" />
            <span>Exam:</span>
            <strong className="text-amber-300">{examDate}</strong>
          </span>
          <span className="text-[10px] text-slate-500 font-bold ml-1">
            ({timelineMetrics.daysRemaining}d left)
          </span>
        </div>

        {/* Right: Map Metrics & Sideline Toggle */}
        <div className="flex items-center gap-2">
          {/* Map Progress Fill Pill */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 border border-amber-500/30 px-2.5 py-1 rounded-xl">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-mono font-black text-amber-300">
              {overallRevisionFill}% <span className="font-normal text-slate-400 hidden sm:inline">Filled</span>
            </span>
          </div>

          {/* Auto-distribute button */}
          <button
            type="button"
            onClick={handleAutoDistributeSequentialDates}
            className="p-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10.5px] font-mono text-slate-300 hover:text-white rounded-xl transition cursor-pointer hidden lg:flex items-center gap-1"
            title="Auto-sequence dates evenly for all checkpoints"
          >
            <RefreshCw className="h-3 w-3 text-indigo-400" />
            <span>Auto-Sequence</span>
          </button>

          {/* Sideline Daily Board Toggle */}
          <button
            type="button"
            onClick={() => setIsSidelineOpen(prev => !prev)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isSidelineOpen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
            title="Toggle Sideline Study Planner"
          >
            {isSidelineOpen ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Sideline Board</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. THE MASTER TREASURE ROADMAP CANVAS (FIXED SCREEN, NO SCROLL!)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-radial from-[#0d132b] via-[#090d1f] to-[#050711] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        
        {/* Ambient Roadmap Atmospheric Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-600/20 rounded-full blur-3xl" />
        </div>

        {/* Winding Highway SVG Road Canvas Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="30%" stopColor="#0ea5e9" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dual Serpentine Highway Path connecting Node 0 -> CP1 -> CP2 -> CP3 -> Curve Down -> CP4 -> CP5 -> CP6 -> Exam */}
          {/* Base Asphalt Track */}
          <path
            d="M 100 95 H 90% Q 98% 95 98% 50% Q 98% 85% 90% 85% H 100"
            fill="none"
            stroke="#161f38"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Centerline Lane Dash */}
          <path
            d="M 100 95 H 90% Q 98% 95 98% 50% Q 98% 85% 90% 85% H 100"
            fill="none"
            stroke="#2d3b66"
            strokeWidth="2"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
          {/* Glowing Filled Progress Trail */}
          <path
            d="M 100 95 H 90% Q 98% 95 98% 50% Q 98% 85% 90% 85% H 100"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="2000"
            strokeDashoffset={2000 - (2000 * (Math.max(8, overallRevisionFill) / 100))}
            className="transition-all duration-1000 ease-out"
            filter="url(#glow)"
          />
        </svg>

        {/* ── ROW 1: START KICKOFF ➔ CHECKPOINT 1 (FR) ➔ CHECKPOINT 2 (AFM) ➔ CHECKPOINT 3 (AUDIT) ── */}
        <div className="relative z-10 grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-center">
          
          {/* Node 0: Preparation Kickoff */}
          <div className="p-3 sm:p-4 rounded-2xl bg-[#0b0e1e]/90 border border-slate-700/80 shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] group hover:border-slate-500 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase bg-slate-800 text-slate-300">
                Kickoff
              </span>
              <span className="text-xl">🚩</span>
            </div>
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs sm:text-sm font-black text-white font-mono">Day 1 Kickoff</h4>
              <p className="text-[10px] text-slate-400">Curriculum Groundwork</p>
            </div>
            <div className="pt-1.5 border-t border-slate-800">
              <span className="text-[9px] font-mono uppercase text-slate-500 block">Start Date:</span>
              <input
                type="date"
                value={prepStartDate}
                onChange={(e) => e.target.value && setPrepStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 text-slate-200 text-[10px] font-mono rounded px-1.5 py-0.5 focus:outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Checkpoint 1: FR */}
          {(() => {
            const subId = 'FR';
            const data = subjectAnalytics[subId];
            const colors = SUBJECT_COLORS[subId];
            const isComplete = data.fillPercentage >= 100;

            return (
              <div 
                onClick={() => setInspectCheckpointSubId(subId)}
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] cursor-pointer group hover:scale-[1.03] ${
                  isComplete ? 'bg-[#0e1628]/95 border-emerald-500/60 shadow-emerald-500/10' : `bg-[#0b0e1e]/95 ${colors.border}`
                }`}
                style={{ boxShadow: isComplete ? '0 0 20px rgba(16, 185, 129, 0.2)' : `0 0 15px ${colors.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border}`}>
                    CP 1 • {subId}
                  </span>
                  {isComplete ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>
                  ) : data.isOverdue ? (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">!</span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{data.daysRemaining}d</span>
                  )}
                </div>

                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate font-sans group-hover:text-amber-300 transition">
                    Financial Reporting
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{data.completedChaptersCount}/{data.totalChapters} Chaps</span>
                    <strong className={isComplete ? 'text-emerald-400' : colors.text}>{data.fillPercentage}%</strong>
                  </div>
                  {/* Fill progress bar */}
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : colors.bar}`}
                      style={{ width: `${data.fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Finish: <strong className="text-slate-200">{data.targetDate}</strong></span>
                  <span className="text-amber-400 underline">Inspect ➔</span>
                </div>
              </div>
            );
          })()}

          {/* Checkpoint 2: AFM */}
          {(() => {
            const subId = 'AFM';
            const data = subjectAnalytics[subId];
            const colors = SUBJECT_COLORS[subId];
            const isComplete = data.fillPercentage >= 100;

            return (
              <div 
                onClick={() => setInspectCheckpointSubId(subId)}
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] cursor-pointer group hover:scale-[1.03] ${
                  isComplete ? 'bg-[#0e1628]/95 border-emerald-500/60 shadow-emerald-500/10' : `bg-[#0b0e1e]/95 ${colors.border}`
                }`}
                style={{ boxShadow: isComplete ? '0 0 20px rgba(16, 185, 129, 0.2)' : `0 0 15px ${colors.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border}`}>
                    CP 2 • {subId}
                  </span>
                  {isComplete ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>
                  ) : data.isOverdue ? (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">!</span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{data.daysRemaining}d</span>
                  )}
                </div>

                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate font-sans group-hover:text-amber-300 transition">
                    Adv Financial Mgmt
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{data.completedChaptersCount}/{data.totalChapters} Chaps</span>
                    <strong className={isComplete ? 'text-emerald-400' : colors.text}>{data.fillPercentage}%</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : colors.bar}`}
                      style={{ width: `${data.fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Finish: <strong className="text-slate-200">{data.targetDate}</strong></span>
                  <span className="text-amber-400 underline">Inspect ➔</span>
                </div>
              </div>
            );
          })()}

          {/* Checkpoint 3: Audit */}
          {(() => {
            const subId = 'Audit';
            const data = subjectAnalytics[subId];
            const colors = SUBJECT_COLORS[subId];
            const isComplete = data.fillPercentage >= 100;

            return (
              <div 
                onClick={() => setInspectCheckpointSubId(subId)}
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] cursor-pointer group hover:scale-[1.03] ${
                  isComplete ? 'bg-[#0e1628]/95 border-emerald-500/60 shadow-emerald-500/10' : `bg-[#0b0e1e]/95 ${colors.border}`
                }`}
                style={{ boxShadow: isComplete ? '0 0 20px rgba(16, 185, 129, 0.2)' : `0 0 15px ${colors.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border}`}>
                    CP 3 • {subId}
                  </span>
                  {isComplete ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>
                  ) : data.isOverdue ? (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">!</span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{data.daysRemaining}d</span>
                  )}
                </div>

                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate font-sans group-hover:text-amber-300 transition">
                    Auditing & Ethics
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{data.completedChaptersCount}/{data.totalChapters} Chaps</span>
                    <strong className={isComplete ? 'text-emerald-400' : colors.text}>{data.fillPercentage}%</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : colors.bar}`}
                      style={{ width: `${data.fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Finish: <strong className="text-slate-200">{data.targetDate}</strong></span>
                  <span className="text-amber-400 underline">Inspect ➔</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── ROADWAY MID-ZONE INDICATOR: Real-time progress milestone bar ── */}
        <div className="relative z-10 flex items-center justify-between px-6 py-1 bg-slate-950/70 border border-slate-800/60 rounded-2xl backdrop-blur-xs font-mono text-[10.5px]">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider">Highway Turn ➔ Paper 4, 5 & 6</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Master all 6 checkpoints sequentially to complete this revision phase</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span>Points Earned:</span>
            <strong className="text-amber-300 font-black">{totalPrepStudyPoints.toLocaleString()} pts</strong>
          </div>
        </div>

        {/* ── ROW 2: DESTINATION 🏆 ◀ CHECKPOINT 6 (IBS) ◀ CHECKPOINT 5 (IDT) ◀ CHECKPOINT 4 (DT) ── */}
        <div className="relative z-10 grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-center">
          
          {/* Final Goal: CA Final Exam Day */}
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-tr from-[#1b1706] to-[#2c2005] border-2 border-yellow-400/50 shadow-2xl flex flex-col justify-between h-[150px] sm:h-[165px] group hover:scale-[1.03] transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase bg-amber-500 text-slate-950">
                Destination
              </span>
              <span className="text-2xl animate-bounce">🏆</span>
            </div>
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs sm:text-sm font-black text-amber-300 font-mono">CA Final Exam Day</h4>
              <p className="text-[10px] text-amber-200/80">ICAI Convocation Glory</p>
            </div>
            <div className="pt-1.5 border-t border-amber-500/30">
              <span className="text-[9px] font-mono uppercase text-amber-400/80 block">Exam Date:</span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => e.target.value && setExamDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-amber-500/40 text-amber-200 text-[10px] font-mono rounded px-1.5 py-0.5 focus:outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Checkpoint 6: IBS */}
          {(() => {
            const subId = 'IBS';
            const data = subjectAnalytics[subId];
            const colors = SUBJECT_COLORS[subId];
            const isComplete = data.fillPercentage >= 100;

            return (
              <div 
                onClick={() => setInspectCheckpointSubId(subId)}
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] cursor-pointer group hover:scale-[1.03] ${
                  isComplete ? 'bg-[#0e1628]/95 border-emerald-500/60 shadow-emerald-500/10' : `bg-[#0b0e1e]/95 ${colors.border}`
                }`}
                style={{ boxShadow: isComplete ? '0 0 20px rgba(16, 185, 129, 0.2)' : `0 0 15px ${colors.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border}`}>
                    CP 6 • {subId}
                  </span>
                  {isComplete ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>
                  ) : data.isOverdue ? (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">!</span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{data.daysRemaining}d</span>
                  )}
                </div>

                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate font-sans group-hover:text-amber-300 transition">
                    Int. Business Solutions
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{data.completedChaptersCount}/{data.totalChapters} Chaps</span>
                    <strong className={isComplete ? 'text-emerald-400' : colors.text}>{data.fillPercentage}%</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : colors.bar}`}
                      style={{ width: `${data.fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Finish: <strong className="text-slate-200">{data.targetDate}</strong></span>
                  <span className="text-amber-400 underline">Inspect ➔</span>
                </div>
              </div>
            );
          })()}

          {/* Checkpoint 5: IDT */}
          {(() => {
            const subId = 'IDT';
            const data = subjectAnalytics[subId];
            const colors = SUBJECT_COLORS[subId];
            const isComplete = data.fillPercentage >= 100;

            return (
              <div 
                onClick={() => setInspectCheckpointSubId(subId)}
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] cursor-pointer group hover:scale-[1.03] ${
                  isComplete ? 'bg-[#0e1628]/95 border-emerald-500/60 shadow-emerald-500/10' : `bg-[#0b0e1e]/95 ${colors.border}`
                }`}
                style={{ boxShadow: isComplete ? '0 0 20px rgba(16, 185, 129, 0.2)' : `0 0 15px ${colors.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border}`}>
                    CP 5 • {subId}
                  </span>
                  {isComplete ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>
                  ) : data.isOverdue ? (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">!</span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{data.daysRemaining}d</span>
                  )}
                </div>

                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate font-sans group-hover:text-amber-300 transition">
                    Indirect Tax Laws
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{data.completedChaptersCount}/{data.totalChapters} Chaps</span>
                    <strong className={isComplete ? 'text-emerald-400' : colors.text}>{data.fillPercentage}%</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : colors.bar}`}
                      style={{ width: `${data.fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Finish: <strong className="text-slate-200">{data.targetDate}</strong></span>
                  <span className="text-amber-400 underline">Inspect ➔</span>
                </div>
              </div>
            );
          })()}

          {/* Checkpoint 4: DT */}
          {(() => {
            const subId = 'DT';
            const data = subjectAnalytics[subId];
            const colors = SUBJECT_COLORS[subId];
            const isComplete = data.fillPercentage >= 100;

            return (
              <div 
                onClick={() => setInspectCheckpointSubId(subId)}
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-xl backdrop-blur-md flex flex-col justify-between h-[150px] sm:h-[165px] cursor-pointer group hover:scale-[1.03] ${
                  isComplete ? 'bg-[#0e1628]/95 border-emerald-500/60 shadow-emerald-500/10' : `bg-[#0b0e1e]/95 ${colors.border}`
                }`}
                style={{ boxShadow: isComplete ? '0 0 20px rgba(16, 185, 129, 0.2)' : `0 0 15px ${colors.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border}`}>
                    CP 4 • {subId}
                  </span>
                  {isComplete ? (
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">✓</span>
                  ) : data.isOverdue ? (
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">!</span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">{data.daysRemaining}d</span>
                  )}
                </div>

                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs sm:text-sm font-black text-white truncate font-sans group-hover:text-amber-300 transition">
                    Direct Tax & Int'l Tax
                  </h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{data.completedChaptersCount}/{data.totalChapters} Chaps</span>
                    <strong className={isComplete ? 'text-emerald-400' : colors.text}>{data.fillPercentage}%</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : colors.bar}`}
                      style={{ width: `${data.fillPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                  <span>Finish: <strong className="text-slate-200">{data.targetDate}</strong></span>
                  <span className="text-amber-400 underline">Inspect ➔</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CHECKPOINT INSPECTION POPUP MODAL (NO SCROLLING THE MAP!)
          Allows adjusting target date, checking chapters, adding targets
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {inspectCheckpointSubId && activeInspectData && inspectSubMeta && (
          <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setInspectCheckpointSubId(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-[#0c1024] border border-slate-850 text-white rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl z-10 flex flex-col overflow-hidden"
            >
              {/* Inspector Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0a0d1b]">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${SUBJECT_COLORS[inspectCheckpointSubId].bg} ${SUBJECT_COLORS[inspectCheckpointSubId].text} ${SUBJECT_COLORS[inspectCheckpointSubId].border}`}>
                    Checkpoint {activeInspectData.checkpointNum} • {inspectCheckpointSubId}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white font-sans">
                      {SUBJECT_FULL_NAMES[inspectCheckpointSubId]}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {activeInspectData.completedChaptersCount} of {activeInspectData.totalChapters} chapters completed ({activeInspectData.fillPercentage}% filled)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectCheckpointSubId(null)}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Inspector Controls Strip: Date Changer & Quick Actions */}
              <div className="p-4 bg-slate-950/90 border-b border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                    Target Date:
                  </span>
                  <input
                    type="date"
                    value={activeInspectData.targetDate}
                    onChange={(e) => handleUpdateSubjectTargetDate(inspectCheckpointSubId, e.target.value)}
                    className="bg-slate-900 border border-slate-750 focus:border-cyan-400 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-200 focus:outline-hidden transition cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleShiftSubjectDate(inspectCheckpointSubId, 3)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 rounded cursor-pointer"
                    >
                      +3d
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShiftSubjectDate(inspectCheckpointSubId, 7)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 rounded cursor-pointer"
                    >
                      +7d
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onOpenAddTargetModal(inspectCheckpointSubId);
                    setInspectCheckpointSubId(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Daily Target</span>
                </button>
              </div>

              {/* Inspector Content: Search & Chapters Checklist */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={`Search ${inspectSubMeta.chapters.length} syllabus chapters...`}
                      value={chapterSearchQuery}
                      onChange={(e) => setChapterSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    Click chapter to toggle completion
                  </span>
                </div>

                <div className="space-y-1.5">
                  {filteredInspectChapters.map((chapterName, idx) => {
                    const isDone = activeInspectData.completedChapters.includes(chapterName);
                    return (
                      <div
                        key={`${chapterName}_${idx}`}
                        className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2.5 ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                            : 'bg-slate-950/60 border-slate-850 hover:border-slate-750 text-slate-300'
                        }`}
                      >
                        <div 
                          onClick={() => handleToggleChapter(inspectCheckpointSubId, chapterName)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                        >
                          <div className={`shrink-0 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isDone ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                          </div>
                          <span className={`text-xs truncate font-sans ${isDone ? 'line-through text-slate-400 font-normal' : 'font-medium text-white'}`}>
                            {chapterName}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onOpenAddTargetModal(inspectCheckpointSubId, chapterName);
                            setInspectCheckpointSubId(null);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                          title="Add target for this chapter"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Footer */}
              <div className="p-3 bg-[#0a0d1b] border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Checkpoint {activeInspectData.checkpointNum} will illuminate automatically as chapters are marked done.</span>
                <button
                  type="button"
                  onClick={() => setInspectCheckpointSubId(null)}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
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
          4. SIDELINE DAILY TARGETS DRAWER DOCK (SLIDE-OVER ON DEMAND)
          Does not push or scroll the master map!
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSidelineOpen && (
          <motion.div
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-14 right-0 bottom-0 w-80 bg-[#090c1c]/95 border-l border-slate-800 shadow-2xl backdrop-blur-md z-30 p-4 flex flex-col justify-between"
          >
            <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Sideline Daily Board</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidelineOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Date navigation */}
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(sidelineDate);
                    d.setDate(d.getDate() - 1);
                    setSidelineDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded hover:bg-slate-800 cursor-pointer"
                >
                  ◀
                </button>
                <input
                  type="date"
                  value={sidelineDate}
                  onChange={(e) => setSidelineDate(e.target.value)}
                  className="bg-transparent text-slate-200 font-bold focus:outline-hidden text-center cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(sidelineDate);
                    d.setDate(d.getDate() + 1);
                    setSidelineDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-1.5 py-0.5 bg-slate-900 text-slate-300 rounded hover:bg-slate-800 cursor-pointer"
                >
                  ▶
                </button>
              </div>

              {/* Tasks list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {sidelineTasks.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs font-mono space-y-1">
                    <p>No goals logged on this date.</p>
                    <button
                      type="button"
                      onClick={() => onOpenAddTargetModal()}
                      className="text-cyan-400 underline font-bold"
                    >
                      + Add One Now
                    </button>
                  </div>
                ) : (
                  sidelineTasks.map((t, idx) => {
                    const isDone = t.status === 'completed' || Boolean(t.completed);
                    const subId = (t.subjectCode as SubjectId) || 'FR';
                    const colors = SUBJECT_COLORS[subId] || SUBJECT_COLORS['FR'];

                    return (
                      <div
                        key={`${t.id || 'task'}_side_${idx}`}
                        className={`p-2.5 rounded-xl border transition space-y-1 ${
                          isDone 
                            ? 'bg-slate-950/80 border-emerald-500/25 opacity-70' 
                            : 'bg-slate-950 border-slate-850 hover:border-slate-750'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            {onToggleTaskCompleted && (
                              <button
                                type="button"
                                onClick={() => onToggleTaskCompleted(t)}
                                className={`shrink-0 transition cursor-pointer ${
                                  isDone ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                  <div className="h-3 w-3 rounded-full border border-slate-500" />
                                )}
                              </button>
                            )}
                            <span className={`text-xs font-sans truncate ${isDone ? 'line-through text-slate-400' : 'text-white font-medium'}`}>
                              {t.cleanTitle || t.title}
                            </span>
                          </div>

                          <span className={`px-1 py-0.2 rounded text-[8px] font-mono font-black border ${colors.bg} ${colors.text} ${colors.border} shrink-0`}>
                            {subId}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-850 space-y-2">
              <button
                type="button"
                onClick={() => onOpenAddTargetModal()}
                className="w-full py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Target</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToDailyView}
                className="w-full py-1 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
              >
                Expand Full Daily Board
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          5. MODAL: ADD CUSTOM REVISION PHASE
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddRevisionModal && (
          <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setShowAddRevisionModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#0c1024] border border-slate-800 text-white rounded-3xl p-5 max-w-md w-full shadow-2xl z-10 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <h3 className="text-sm font-black uppercase text-white font-mono">Add Revision Phase</h3>
                <button type="button" onClick={() => setShowAddRevisionModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateCustomRevision} className="space-y-3 font-mono text-left">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Revision Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4th Revision: RTPs & ICAI Mock Papers"
                    value={newRevTitle}
                    onChange={(e) => setNewRevTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target End Date:</label>
                  <input
                    type="date"
                    required
                    value={newRevEndDate}
                    onChange={(e) => setNewRevEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-850">
                  <button type="button" onClick={() => setShowAddRevisionModal(false)} className="px-3 py-1 bg-slate-900 text-slate-400 rounded-xl text-xs">Cancel</button>
                  <button type="submit" className="px-3.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl cursor-pointer">Create Phase</button>
                </div>
              </form>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
}
