/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  RefreshCw, 
  FolderPlus, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Loader2, 
  ListTodo, 
  ExternalLink,
  BookOpen,
  PlusCircle,
  Clock,
  LogOut,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Mail,
  Edit,
  GripVertical,
  Search,
  RotateCcw,
  X,
  Target,
  Award,
  Layers,
  List,
  Milestone,
  Compass,
  Flag,
  TrendingUp,
  CheckCheck,
  ArrowRight,
  Maximize2,
  Zap,
  CheckSquare,
  Square,
  FileText,
  MoreVertical,
  Lock
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, GoogleAuthProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc as firestoreDoc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import TasksSummaryBoard from './TasksSummaryBoard';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { SubjectId } from '../types';
import { useCALevel, getLevelConfig, getLevelSubjectIds } from '../data/curriculumLevels';
import { getLevelScopedKey, getClockSlotsStorageKey, getRevisionSubjectStorageKey } from '../utils/levelStorage';
import { getCanonicalChapterKey, computeSubjectMilestoneRevisionCount, getSubjectDynamicRevKeys, SUBJECT_CHAPTERS as OFFICIAL_REVISION_CHAPTERS } from './RevisionPlanner';
import RoadmapDashboard, { UserCheckpoint, getMilestoneSubjectChapters } from './RoadmapDashboard';
import { syncTaskCompletionAcrossAllLinks, normalizeKey, useTargetSystemSync, isMockTestTask, isSubjectLockedAfterFinalExam, getFirstUnlockedSubject } from '../utils/taskCompletionSync';
import {
  isNonRevisionReportActivity,
  resolveTargetChapterForSubject,
  resolveActiveRevisionForChapter
} from '../utils/logSyncEngine';
import { ModalPortal } from './ModalPortal';
import { formatMinutes, formatStaticDuration } from '../utils/timeFormat';
import {
  analyzeUserSleepPattern,
  analyzeUserDayRationale,
  findRealisticGapOnClock,
  fitOrderedItemsToRationaleTimeline
} from '../utils/sleepPatternAnalysis';
import { BatchEditorModal } from './BatchEditorModal';
import TaskImportModal, { NormalizedTemplateTask } from './TaskImportModal';
import FinalExamDatesModal from './FinalExamDatesModal';
import {
  isLmrModeCurrentlyOn,
  is15DayLmrTask,
  isTaskEligibleInActiveLmrSprint,
  getSprintAllowedSubjects,
  lapseNon15DayTasksWhenLmrActive
} from './LmrSprintBoard';
import { FileJson, Trophy } from 'lucide-react';
import {
  allocateProportionateClubDurations,
  rescaleClubSubTargetsToNewTotal,
  rebalanceClubSubTargetsWithinLimit,
  roundToNearest15MinSlab,
  getRecommendedChapterSlabMinutes,
  ClubAllocationBasis
} from '../utils/clubbingAllocation';

const SUBJECT_CHAPTERS: Record<string, string[]> = {
  FR: [
    'General / Entire Subject',
    'Applicability of IND AS',
    'Ind AS 16 Property Plant & Equipment',
    'Ind AS 40 Investment Property',
    'Ind AS 38 Intangible Assets',
    'Ind AS 36 Impairment of Assets',
    'Ind AS 105 Non Current Assets Held For Sale',
    'Ind AS 23 Borrowing Costs',
    'Ind AS 2 Inventories',
    'Ind AS 41 Agriculture',
    'Ind AS 20 Accounting for Govt Grants',
    'Ind AS 113 Fair Value Measurement',
    'Ind AS 102 Share Based Payment',
    'Ind AS 116 Leases',
    'IND AS 37 Provisions, Contingent',
    'Ind AS 108 Operating Segments',
    'Analysis of FS',
    'Ind AS 19 Employee Benefits',
    'Financial Instruments',
    'Ind AS 33 Earnings Per Share',
    'Ind AS 34 Interim Financial Reporting',
    'Ind AS 1 Presentation of FS',
    'Ind AS 10 Events After the Reporting',
    'Ind AS 8 Acc Policies Errors',
    'Ind AS 7 Statement of Cash Flows',
    'Ind AS 12 Income Taxes',
    'Ind AS 103 Business Combination',
    'Consolidation',
    'JV & Associates',
    'Ind AS 24 Related Party Disclosures',
    'Ind AS 21 Forex',
    'Ind AS 115 Revenue',
    'Ind AS 101 First Time Adoption',
    'Conceptual Framework',
    'Professional and Ethical Duty of CA',
    'Accounting & Tech'
  ],
  AFM: [
    'General / Entire Subject',
    'Financial Policy and Corporate Strategy',
    'Risk Management',
    'Advanced Capital Budgeting Decisions',
    'Security Analysis',
    'Security Valuation',
    'Portfolio Management',
    'Securitization',
    'Mutual Funds',
    'Derivatives Analysis and Valuation',
    'Foreign Exchange Exposure and Risk Management',
    'International Financial Management',
    'Interest Rate Risk Management',
    'Business Valuation',
    'Mergers, Acquisitions and Corporate Restructuring',
    'Startup Finance'
  ],
  Audit: [
    'General / Entire Subject',
    'Quality Control',
    'General Auditing Principles and Auditors Responsibilities',
    'Audit Planning, Strategy and Execution',
    'Materiality, Risk Assessment and Internal Control',
    'Audit Evidence',
    'Completion and Review',
    'Reporting',
    'Specialised Areas',
    'Related Services',
    'Review of Financial Information',
    'Prospective Financial Information and Other Assurance Services',
    'Digital Auditing & Assurance',
    'Group Audits',
    'Special Features of Audit of Banks & Non-Banking Financial Companies',
    'Overview of Audit of Public Sector Undertakings',
    'Internal Audit',
    'Due Diligence, Investigation & Forensic Audit',
    'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    'Professional Ethics & Liabilities of Auditors'
  ],
  DT: [
    'General / Entire Subject',
    'Basic Concepts',
    'Incomes which do not form part of Total Income',
    'Profits and Gains of Business or Profession',
    'Capital Gains',
    'Income from Other Sources',
    'Income of Other Persons included in Assessee\'s Total Income',
    'Aggregation of Income, Set Off or Carry Forward of Losses',
    'Deductions from Gross Total Income',
    'Assessment of Various Entities',
    'Assessment of Trusts and Institutions, Political Parties and Other Special Entities',
    'Tax Planning, Tax Avoidance and Tax Evasion',
    'Taxation of Digital Transactions',
    'Deduction, Collection and Recovery of Tax',
    'Income Tax Authorities',
    'Assessment Procedure',
    'Appeals and Revision',
    'Dispute Resolution',
    'Miscellaneous Provisions',
    'Provisions to Counteract Unethical Tax Practices',
    'Tax Audit and Ethical Compliances',
    'Non Resident Taxation',
    'Double Taxation Relief',
    'Advance Rulings',
    'Transfer Pricing',
    'Fundamentals Of Beps',
    'Application And Interpretation Of Tax Treaties',
    'Overview Of Model Tax Conventions',
    'Latest Developments In International Taxation'
  ],
  IDT: [
    'General / Entire Subject',
    'Supply under GST',
    'Charge of GST',
    'Place of Supply',
    'Exemptions from GST',
    'Time of Supply',
    'Value of Supply',
    'Input Tax Credit',
    'Registration',
    'Tax Invoice, Credit & Debit Notes',
    'Accounts and Records; E-way Bill',
    'Payment of Tax',
    'Electronic Commerce Transactions',
    'Returns',
    'Import and Export under GST',
    'Refunds',
    'Job Work',
    'Assessment and Audit',
    'Inspection, Search, Seizure and Arrest',
    'Demands and Recovery',
    'Liability to Pay in Certain Cases',
    'Offences and Penalties',
    'Appeals and Revision',
    'Advance Ruling',
    'Miscellaneous Provisions',
    'Levy of and Exemptions from Customs Duty',
    'Types of Duty',
    'Classification of Imported and Export Goods',
    'Valuation under the Customs Act, 1962',
    'Importation and Exportation of Goods',
    'Warehousing',
    'Customs Refunds',
    'Foreign Trade Policy'
  ],
  IBS: [
    'General / Entire Subject',
    'Financial Reporting',
    'Advanced Financial Management',
    'Auditing',
    'Direct Taxes',
    'Indirect Taxes',
    'Corporate & Economic Laws',
    'SCMPE',
    'Case Scenarios'
  ],
  ...Object.fromEntries(
    Object.entries(OFFICIAL_REVISION_CHAPTERS).map(([k, chs]) => [
      k,
      ['General / Entire Subject', ...chs],
    ])
  ),
};

const SUBJECT_COLORS: Record<SubjectId, { text: string; bg: string; border: string; glow: string; colorCode: string }> = {
  Accounts: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  Law: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  MathStats: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  Econ: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  AdvAcc: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CorpLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  Tax: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  Cost: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  AuditInter: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  FMSM: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
  AFM: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  FR: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  Audit: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  DT: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  IDT: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  IBS: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
  // CMA Foundation (4 Papers)
  CMAFoundLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAFoundAcc: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAFoundMath: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  CMAFoundEcon: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  // CMA Intermediate (4+4 = 8 Papers)
  CMAInterLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAInterFA: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAInterTax: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  CMAInterCost: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  CMAInterOMSM: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  CMAInterCAA: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' },
  CMAInterFMDA: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAInterMA: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  // CMA Final (4+4 = 8 Papers)
  CMAFinalLaw: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAFinalSFM: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/10', border: 'border-[#FF3366]/20', glow: 'shadow-[#FF3366]/10', colorCode: '#FF3366' },
  CMAFinalDT: { text: 'text-[#FF9F1C]', bg: 'bg-[#FF9F1C]/10', border: 'border-[#FF9F1C]/20', glow: 'shadow-[#FF9F1C]/10', colorCode: '#FF9F1C' },
  CMAFinalSCM: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  CMAFinalCMA: { text: 'text-[#9D4EDD]', bg: 'bg-[#9D4EDD]/10', border: 'border-[#9D4EDD]/20', glow: 'shadow-[#9D4EDD]/10', colorCode: '#9D4EDD' },
  CMAFinalCFR: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/10', border: 'border-[#00D2FF]/20', glow: 'shadow-[#00D2FF]/10', colorCode: '#00D2FF' },
  CMAFinalIDT: { text: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20', glow: 'shadow-[#10B981]/10', colorCode: '#10B981' },
  CMAFinalSPBV: { text: 'text-[#FFD166]', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20', glow: 'shadow-[#FFD166]/10', colorCode: '#FFD166' }
};

const SUBJECT_NAMES: Record<SubjectId, string> = {
  Accounts: 'Accounting',
  Law: 'Business Laws',
  MathStats: 'Quantitative Aptitude',
  Econ: 'Business Economics',
  AdvAcc: 'Advanced Accounting',
  CorpLaw: 'Corporate and Other Laws',
  Tax: 'Taxation (Income-tax & GST)',
  Cost: 'Cost and Management Accounting',
  AuditInter: 'Auditing and Ethics',
  FMSM: 'Financial & Strategic Management',
  AFM: 'Advanced Financial Management',
  FR: 'Financial Reporting',
  Audit: 'Auditing & Professional Ethics',
  DT: 'Direct Tax Laws',
  IDT: 'Indirect Tax Laws',
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed' | 'unachieved';
  completed?: string;
  priority?: 'High' | 'Medium' | 'Low';
  relevance?: 'General' | 'Revision' | 'Final Revision';
  subjectCode?: string;
  cleanTitle?: string;
  chapterName?: string;
  listId?: string;
  milestoneId?: string;
  taskDate?: string;
  revKey?: 'rev1' | 'rev1.5' | 'rev2' | 'rev3';
  phaseId?: string;
  position?: number;
  targetDurationMinutes?: number;
  originalTargetDurationMinutes?: number;
  earlyCompletionSavedMinutes?: number;
  duration?: number;
  clubGroupId?: string;
  clubTotalMinutes?: number;
  clubOrder?: number;
}

export function getSystemLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function cleanTaskNotes(notes: string | undefined): string {
  if (!notes) return '';
  return notes
    .split('\n')
    .filter(line => {
      const u = line.trim().toUpperCase();
      return (
        !u.startsWith('PRIORITY:') &&
        !u.startsWith('SUBJECT:') &&
        !u.startsWith('STATUS:') &&
        !u.startsWith('RELEVANCE:') &&
        !u.startsWith('CHAPTER:') &&
        !u.startsWith('CLUBGROUPID:') &&
        !u.startsWith('CLUBTOTALMINUTES:') &&
        !u.startsWith('CLUBORDER:') &&
        !u.startsWith('CLUBALLOCATIONBASIS:') &&
        !u.startsWith('CLUBPRIORLOGGEDMINUTES:') &&
        !u.startsWith('TARGETDURATIONMINUTES:') &&
        !u.startsWith('TARGET:') &&
        !u.startsWith('MILESTONE:') &&
        !u.startsWith('MILESTONEID:') &&
        !u.startsWith('IMPORTANCE:') &&
        !u.startsWith('IS_MOCK_TEST:') &&
        !u.startsWith('MOCKSCHEDULEDTIME:') &&
        !u.startsWith('MOCKSERIES:') &&
        !u.startsWith('READINGSTART:') &&
        !u.startsWith('REVKEY:') &&
        !u.startsWith('PHASEID:') &&
        !u.startsWith('ACTIVITYTYPE:') &&
        !u.startsWith('3-HOUR FULL SYLLABUS ICAI MOCK TEST PAPER') &&
        !u.startsWith('[COMPLETED POST-TEST ASSESSMENT]') &&
        !(u.startsWith('ICAI ') && u.includes('• CAT ') && u.includes('• CONFIDENCE:'))
      );
    })
    .map(line => line.replace(/^Focus Notes:\s*/i, ''))
    .join('\n')
    .trim();
}

interface SearchableChapterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const SearchableChapterSelect: React.FC<SearchableChapterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select Chapter'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-400 rounded-xl px-2.5 py-2 text-xs text-left text-white flex items-center justify-between font-semibold cursor-pointer transition-colors shadow-xs"
      >
        <span className="truncate pr-2 font-medium">{value || placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#0e1120] border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-2 flex flex-col gap-2 backdrop-blur-md"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapter name..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsOpen(false);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option === value;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors font-medium cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/25 text-[#00f3ff] font-bold border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">{option}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#00f3ff] shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-500 font-medium">
                  No matching chapters found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TasksPlannerProps {
  onStartFocusForTask?: (subjectCode: string, title: string, durationMinutes?: number, chapterName?: string, relevance?: 'General' | 'Revision' | 'Final Revision', dueDate?: string, revKey?: 'rev1' | 'rev2' | 'rev3' | 'rev1.5', taskId?: string, isUntimedOpen?: boolean) => void;
  activeFocusTask?: { id?: string; subjectCode: string; title: string; cleanTitle?: string; chapterName?: string; relevance?: 'General' | 'Revision' | 'Final Revision'; completed?: boolean; dueDate?: string; revKey?: 'rev1' | 'rev2' | 'rev3' | 'rev1.5'; targetDurationMinutes?: number; isUntimedOpen?: boolean } | null;
  onClearActiveFocusTask?: () => void;
  onCompleteLinkedTask?: (task: GoogleTask) => Promise<void> | void;
  onGoToClock?: () => void;
  onGoToRevisionReport?: () => void;
}

export default function TasksPlanner({ 
  onStartFocusForTask,
  activeFocusTask,
  onClearActiveFocusTask,
  onCompleteLinkedTask,
  onGoToClock,
  onGoToRevisionReport
}: TasksPlannerProps = {}) {
  const caLevel = useCALevel();
  const levelConfig = useMemo(() => getLevelConfig(caLevel), [caLevel]);
  const levelSubjectIds = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);
  const defaultSubjectId: SubjectId = levelSubjectIds[0] || 'FR';
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [token, setToken] = useState<string | null>(auth.currentUser ? 'firestore-enabled' : null);
  const [loading, setLoading] = useState<boolean>(false);
  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_local_task_lists')) || localStorage.getItem('cavault_local_task_lists');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [selectedListId, setSelectedListId] = useState<string>(() => {
    return localStorage.getItem(getLevelScopedKey('practca_selected_list_id')) || '';
  });

  useEffect(() => {
    if (selectedListId) {
      localStorage.setItem(getLevelScopedKey('practca_selected_list_id'), selectedListId);
    }
  }, [selectedListId, caLevel]);
  const [tasks, setTasks] = useState<GoogleTask[]>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_local_tasks')) || localStorage.getItem('cavault_local_tasks');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'Synced' | 'Saving...' | 'Sync Error'>('Synced');

  const triggerLocalSaveStatus = () => {
    setSyncStatus('Saving...');
    const timer = setTimeout(() => {
      setSyncStatus('Synced');
    }, 450);
    return timer;
  };

  // Day-wise target date selection state (defaults to today in local timezone)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return getSystemLocalDateString();
  });

  // Sorting & Filtering State
  const [sortBy, setSortBy] = useState<'urgency' | 'subject' | 'alphabetical' | 'manual'>('manual');
  const [filterSubject, setFilterSubject] = useState<'ALL' | SubjectId>('ALL');
  const [viewFormat, setViewFormat] = useState<'daily' | 'weekly' | 'roadmap' | 'all-pending' | 'all-missed'>('roadmap');
  
  // Preparation Roadmap & Revision Slabs State
  const [roadmapPrepStartDate, setRoadmapPrepStartDate] = useState<string>(() => {
    return localStorage.getItem('practca_roadmap_start_date') || '2026-06-01';
  });
  const [roadmapExamDate, setRoadmapExamDate] = useState<string>(() => {
    return localStorage.getItem('practca_roadmap_exam_date') || '2026-11-01';
  });
  const [selectedRoadmapSlabId, setSelectedRoadmapSlabId] = useState<string>('slab-1');
  const [roadmapSlabDeadlines, setRoadmapSlabDeadlines] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('practca_roadmap_slab_deadlines');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'slab-1': '2026-08-31',
      'slab-2': '2026-10-10',
      'slab-3': '2026-10-28'
    };
  });
  const [roadmapSubjectDeadlines, setRoadmapSubjectDeadlines] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('practca_roadmap_subject_deadlines');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });
  const [customCheckpoints, setCustomCheckpoints] = useState<Array<{ id: string; title: string; date: string; completed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem('practca_roadmap_custom_checkpoints');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'cp-1', title: 'ICAI Mock Test Paper (MTP) Series 1', date: '2026-10-15', completed: false },
      { id: 'cp-2', title: 'ICAI Mock Test Paper (MTP) Series 2', date: '2026-10-25', completed: false }
    ];
  });
  const [newCustomCheckpointTitle, setNewCustomCheckpointTitle] = useState<string>('');
  const [newCustomCheckpointDate, setNewCustomCheckpointDate] = useState<string>('2026-10-20');
  const [showAddCustomCheckpoint, setShowAddCustomCheckpoint] = useState<boolean>(false);
  const [groupDailyBySubject, setGroupDailyBySubject] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('practca_daily_group_by_subject');
      return stored !== null ? JSON.parse(stored) : true;
    } catch (e) {
      return true;
    }
  });
  const [dailyLayoutMode, setDailyLayoutMode] = useState<'subjects' | 'kanban' | 'list'>(() => {
    try {
      const storedMode = localStorage.getItem('practca_daily_layout_mode_v1');
      if (storedMode === 'subjects' || storedMode === 'kanban' || storedMode === 'list') {
        return storedMode;
      }
      const storedGroup = localStorage.getItem('practca_daily_group_by_subject');
      if (storedGroup !== null) {
        return JSON.parse(storedGroup) ? 'subjects' : 'list';
      }
    } catch (e) {}
    return 'subjects';
  });
  const [collapsedSubjectChecklists, setCollapsedSubjectChecklists] = useState<Record<string, boolean>>({});
  const [expandedSubjectCompleted, setExpandedSubjectCompleted] = useState<Record<string, boolean>>({});
  const [pendingSearchQuery, setPendingSearchQuery] = useState<string>('');
  const [pendingSubjectFilter, setPendingSubjectFilter] = useState<'ALL' | SubjectId>('ALL');
  const [missedSearchQuery, setMissedSearchQuery] = useState<string>('');
  const [missedSubjectFilter, setMissedSubjectFilter] = useState<'ALL' | SubjectId>('ALL');
  const [activeSyllabusSubject, setActiveSyllabusSubject] = useState<SubjectId>(() => levelSubjectIds[0] || 'FR');
  const [addedChapterKey, setAddedChapterKey] = useState<string | null>(null);

  // Form State
  const [showAddTargetModal, setShowAddTargetModal] = useState<boolean>(false);
  const [showImportTemplateModal, setShowImportTemplateModal] = useState<boolean>(false);
  const [targetSourceMode, setTargetSourceMode] = useState<'milestone' | 'other' | 'mock_test'>('milestone');
  const [plannerMockExamTime, setPlannerMockExamTime] = useState<string>('14:00');
  const [plannerMockSeries, setPlannerMockSeries] = useState<string>('ICAI MTP Series 1');
  const [roadmapCheckpoints, setRoadmapCheckpoints] = useState<UserCheckpoint[]>(() => {
    try {
      const saved = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints'));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [milestoneChapterSearch, setMilestoneChapterSearch] = useState<string>('');
  const [addTargetTab, setAddTargetTab] = useState<'syllabus' | 'custom'>('syllabus');
  const [syllabusSearchQuery, setSyllabusSearchQuery] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskNotes, setNewTaskNotes] = useState<string>('');
  const [newTaskSubject, setNewTaskSubject] = useState<string>(() => levelSubjectIds[0] || 'FR');
  const [newTaskChapter, setNewTaskChapter] = useState<string>('General / Entire Subject');
  const [newTaskRelevance, setNewTaskRelevance] = useState<'General' | 'Revision' | 'Final Revision'>('Revision');
  const [newListName, setNewListName] = useState<string>('');
  const [showAddListForm, setShowAddListForm] = useState<boolean>(false);

  useEffect(() => {
    if (!levelSubjectIds.includes(activeSyllabusSubject)) {
      setActiveSyllabusSubject(levelSubjectIds[0] || 'FR');
    }
    if (!levelSubjectIds.includes(newTaskSubject as SubjectId)) {
      setNewTaskSubject(levelSubjectIds[0] || 'FR');
    }
    if (filterSubject !== 'ALL' && !levelSubjectIds.includes(filterSubject)) {
      setFilterSubject('ALL');
    }
    try {
      const savedCp = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints'));
      setRoadmapCheckpoints(savedCp ? JSON.parse(savedCp) : []);
    } catch {
      setRoadmapCheckpoints([]);
    }
  }, [caLevel, levelSubjectIds]);

  // Quick-Select Milestone & Auto-Batch (90-Minute & Custom Multi-Day Milestone Study Blocks) State
  const [quickSelectMilestoneFeedback, setQuickSelectMilestoneFeedback] = useState<Record<string, string>>({});
  const [autoBatchBannerMsg, setAutoBatchBannerMsg] = useState<string | null>(null);
  const [showAutoBatchStudio, setShowAutoBatchStudio] = useState<boolean>(false);
  const [autoBatchStudioMode, setAutoBatchStudioMode] = useState<'milestone_multiday' | 'single_day'>('milestone_multiday');
  const [autoBatchStartTime, setAutoBatchStartTime] = useState<string>('06:00'); // Manual HH:MM start time (default 06:00)
  const [autoBatchBreakGap, setAutoBatchBreakGap] = useState<number>(15); // 15m buffer between blocks
  const [autoBatchFillMode, setAutoBatchFillMode] = useState<'balanced_groups' | 'fill_remaining_clock'>('balanced_groups');
  const [hideWorkloadTopRibbon, setHideWorkloadTopRibbon] = useState<boolean>(true);
  const [showScratchChapterPool, setShowScratchChapterPool] = useState<boolean>(false);
  const [scratchPoolFilter, setScratchPoolFilter] = useState<'unassigned' | 'all'>('unassigned');
  const [scratchPoolSearch, setScratchPoolSearch] = useState<string>('');
  const [milestoneUniformRelevance, setMilestoneUniformRelevance] = useState<'General' | 'Revision' | 'Final Revision' | null>(null);
  const [modalBatchChapters, setModalBatchChapters] = useState<{ subjectCode: SubjectId; chapterName: string }[]>([]);
  const [targetClockSlotsForDay, setTargetClockSlotsForDay] = useState<any[]>([]);
  const [showDailyAnalyticsDrawer, setShowDailyAnalyticsDrawer] = useState<boolean>(false);

  // Multi-Step Undo Stack for Batch Allocations, Quick Loads, and Daily Target Additions
  const [plannerUndoStack, setPlannerUndoStack] = useState<Array<{
    id: string;
    label: string;
    timestamp: number;
    previousTasks: GoogleTask[];
    previousClockSlotsByDate: Record<string, any[]>;
    previousDurationsMap: Record<string, number>;
    previousTargetFlow: any[] | null;
  }>>(() => {
    try {
      const saved = localStorage.getItem('practca_planner_undo_stack_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 15);
      }
    } catch (e) {}
    return [];
  });

  // Canonical chapter identity helper (prevents duplicate chapters on the same calendar date)
  const getTaskCanonicalChapterIdentity = (subjectCode: string, rawChapterOrTitle: string): string => {
    const sub = (subjectCode || 'FR').trim().toUpperCase();
    const cleaned = (rawChapterOrTitle || '')
      .replace(/[🔴🟡🔵]/g, '')
      .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/ig, '')
      .replace(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/ig, '')
      .replace(/^[\s\-\|]+|[\s\-\|]+$/g, '')
      .replace(/^(Study|Revise)\s+/i, '')
      .trim();

    if (!cleaned || cleaned === 'General / Entire Subject' || cleaned === 'Comprehensive Subject Revision') {
      return `${sub}::__general__::${cleaned.toLowerCase()}`;
    }

    // Strip ": custom note" suffix if title starts with a known syllabus chapter for this subject
    const subjectChapters = SUBJECT_CHAPTERS[subjectCode as SubjectId] || SUBJECT_CHAPTERS[sub as SubjectId] || [];
    let matchedBaseChap = cleaned;
    const colonIdx = cleaned.indexOf(':');
    if (colonIdx > 0) {
      const prefix = cleaned.slice(0, colonIdx).trim();
      if (subjectChapters.some(ch => ch.toLowerCase() === prefix.toLowerCase())) {
        matchedBaseChap = prefix;
      }
    }

    const canon = getCanonicalChapterKey(subjectCode || sub, matchedBaseChap) || matchedBaseChap;
    return `${sub}::${canon.trim().toLowerCase()}`;
  };

  // Extract subject + canonical chapter key from an existing GoogleTask
  const extractTaskCanonicalIdentity = (t: GoogleTask): string => {
    let sub = t.subjectCode || '';
    if (!sub) {
      const subLine = (t.notes || '').split('\n').find(l => l.trim().toUpperCase().startsWith('SUBJECT:'));
      if (subLine) sub = subLine.split(':')[1]?.trim() || '';
    }
    if (!sub) {
      const bMatch = (t.title || '').match(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/i);
      if (bMatch) sub = bMatch[1];
    }
    sub = (sub || 'IDT').toUpperCase();

    let chap = t.chapterName || '';
    if (!chap) {
      const chapMatch = (t.notes || '').match(/Chapter:\s*([^\n\r]+)/i);
      if (chapMatch && chapMatch[1]) chap = chapMatch[1].trim();
    }
    if (!chap) {
      chap = t.cleanTitle || t.title || '';
    }
    return getTaskCanonicalChapterIdentity(sub, chap);
  };

  // Check if a chapter is already scheduled on `dateStr` (active or completed on that day)
  const isChapterAlreadyOnDate = (
    subjectCode: string,
    chapterOrTitle: string,
    dateStr: string,
    taskList: GoogleTask[] = tasks,
    excludeTaskId?: string
  ): boolean => {
    const targetIdentity = getTaskCanonicalChapterIdentity(subjectCode, chapterOrTitle);
    // Allow multiple distinct custom/general tasks only if they are not a specific syllabus chapter
    if (targetIdentity.includes('::__general__::')) {
      return false;
    }
    const targetDay = (dateStr || selectedDate || getSystemLocalDateString()).split('T')[0];

    return taskList.some(t => {
      if (excludeTaskId && t.id === excludeTaskId) return false;
      const notesUpper = (t.notes || '').toUpperCase();
      if (t.status === ('unachieved' as any) || notesUpper.includes('STATUS: UNACHIEVED')) return false;
      const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
      if (tDate !== targetDay) return false;
      return extractTaskCanonicalIdentity(t) === targetIdentity;
    });
  };

  // Memoized Set of canonical chapter keys already scheduled on `selectedDate` for O(1) UI lookup
  const scheduledChapterKeysOnSelectedDate = React.useMemo(() => {
    const set = new Set<string>();
    const targetDay = (selectedDate || getSystemLocalDateString()).split('T')[0];
    tasks.forEach(t => {
      const notesUpper = (t.notes || '').toUpperCase();
      if (t.status === ('unachieved' as any) || notesUpper.includes('STATUS: UNACHIEVED')) return;
      const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
      if (tDate === targetDay) {
        set.add(extractTaskCanonicalIdentity(t));
      }
    });
    return set;
  }, [tasks, selectedDate]);

  // Push a pre-mutation snapshot onto the Multi-Step Undo Stack
  const pushPlannerUndoSnapshot = (label: string, affectedDates: string[] = [selectedDate]) => {
    try {
      const uniqueDates = Array.from(new Set([selectedDate, ...affectedDates].filter(Boolean).map(d => d.split('T')[0])));
      const previousClockSlotsByDate: Record<string, any[]> = {};
      uniqueDates.forEach(dStr => {
        try {
          const rawClock = localStorage.getItem(`practca_24h_target_clock_${dStr}`);
          previousClockSlotsByDate[dStr] = rawClock ? JSON.parse(rawClock) : [];
        } catch (e) {
          previousClockSlotsByDate[dStr] = [];
        }
      });

      let previousDurationsMap: Record<string, number> = {};
      try {
        const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
        if (rawDur) previousDurationsMap = JSON.parse(rawDur);
      } catch (e) {}

      let previousTargetFlow: any[] | null = null;
      try {
        const rawFlow = localStorage.getItem(getLevelScopedKey('practca_target_flow'));
        if (rawFlow) previousTargetFlow = JSON.parse(rawFlow);
      } catch (e) {}

      const snapshotEntry = {
        id: `undo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        label,
        timestamp: Date.now(),
        previousTasks: JSON.parse(JSON.stringify(tasks)) as GoogleTask[],
        previousClockSlotsByDate,
        previousDurationsMap,
        previousTargetFlow
      };

      setPlannerUndoStack(prev => {
        const next = [snapshotEntry, ...prev].slice(0, 15);
        try {
          localStorage.setItem('practca_planner_undo_stack_v1', JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    } catch (e) {
      console.error('Failed to capture undo snapshot:', e);
    }
  };

  // Undo the most recent planner batch allocation or target action
  const handleUndoLastPlannerAction = async () => {
    if (plannerUndoStack.length === 0) return;
    const [latest, ...remaining] = plannerUndoStack;

    const currentTasksSnapshot = [...tasks];
    const restoredTasks = latest.previousTasks || [];

    // 1. Update Undo Stack State
    setPlannerUndoStack(remaining);
    try {
      localStorage.setItem('practca_planner_undo_stack_v1', JSON.stringify(remaining));
    } catch (e) {}

    // 2. Restore Tasks in State & LocalStorage
    triggerLocalSaveStatus();
    setTasks(restoredTasks);
    setSelectedTaskIds([]);
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(restoredTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(restoredTasks));
    } catch (e) {}

    // 3. Restore 24h Target Clock Slots across all affected dates
    if (latest.previousClockSlotsByDate) {
      Object.entries(latest.previousClockSlotsByDate).forEach(([dStr, slots]) => {
        try {
          localStorage.setItem(`practca_24h_target_clock_${dStr}`, JSON.stringify(slots || []));
          if (dStr === selectedDate) {
            setTargetClockSlotsForDay(slots || []);
          }
        } catch (e) {}
      });
    }

    // 4. Restore Target Durations & Flow
    if (latest.previousDurationsMap) {
      try {
        localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(latest.previousDurationsMap));
      } catch (e) {}
    }
    if (latest.previousTargetFlow !== null && latest.previousTargetFlow !== undefined) {
      try {
        localStorage.setItem(getLevelScopedKey('practca_target_flow'), JSON.stringify(latest.previousTargetFlow));
      } catch (e) {}
    }

    // 5. Sync Firestore if in Cloud Mode
    if (!isLocalMode && user) {
      try {
        const restoredMap = new Map(restoredTasks.map(t => [t.id, t]));
        const currentMap = new Map(currentTasksSnapshot.map(t => [t.id, t]));

        // Delete tasks that were created in the undone action
        const toDeleteIds = currentTasksSnapshot.filter(t => !restoredMap.has(t.id)).map(t => t.id);
        // Upsert tasks that were deleted or modified in the undone action
        const toUpsert = restoredTasks.filter(t => {
          const curr = currentMap.get(t.id);
          return !curr || JSON.stringify(curr) !== JSON.stringify(t);
        });

        await Promise.all([
          ...toDeleteIds.map(id => deleteDoc(firestoreDoc(db, 'users', user.uid, 'tasks', id)).catch(() => {})),
          ...toUpsert.map(t => setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), t).catch(() => {}))
        ]);
      } catch (e) {
        console.error('Error syncing undo to Firestore:', e);
      }
    }

    // 6. Dispatch synchronization events
    try {
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new Event('practca_flow_updated'));
    } catch (e) {}

    setAutoBatchBannerMsg(`↩ Undid: ${latest.label}`);
    setTimeout(() => setAutoBatchBannerMsg(null), 4500);
  };

  // Upcoming Milestone Multi-Day Auto-Allocation & Custom Time-Batching State
  const [milestoneAllocStartDate, setMilestoneAllocStartDate] = useState<string>(() => getSystemLocalDateString());
  const [milestoneCustomDaysOverride, setMilestoneCustomDaysOverride] = useState<number | null>(null);
  const [milestoneCustomDailyStudyMins, setMilestoneCustomDailyStudyMins] = useState<number | null>(null);
  const [milestoneBatchBlockSize, setMilestoneBatchBlockSize] = useState<'exact_chapter_time' | 45 | 60 | 90 | 120>(90);
  const [milestoneSortStrategy, setMilestoneSortStrategy] = useState<'importance_and_least_spent' | 'importance_only' | 'least_spent_first' | 'syllabus_order'>('importance_and_least_spent');
  const [milestonePacingMode, setMilestonePacingMode] = useState<'achieve_by_deadline' | 'strict_daily_avg'>('achieve_by_deadline');
  const [showChapterCustomizerTable, setShowChapterCustomizerTable] = useState<boolean>(false);
  const [allocatorViewTab, setAllocatorViewTab] = useState<'visual_days' | 'chapter_table'>('visual_days');
  const [allocatorChapterSearch, setAllocatorChapterSearch] = useState<string>('');
  const [tracedFromRoadmap, setTracedFromRoadmap] = useState<boolean>(false);
  const [selectedWorkloadDayFilter, setSelectedWorkloadDayFilter] = useState<string | 'ALL'>('ALL');
  const [chapterCustomConfig, setChapterCustomConfig] = useState<Record<string, {
    importance?: 'High' | 'Medium' | 'Low';
    relevance?: 'General' | 'Revision' | 'Final Revision';
    timeNeededMins?: number;
    assignedDate?: string;
    clubGroupId?: string;
    clubTotalMinutes?: number;
    clubOrder?: number;
    clubAllocationBasis?: ClubAllocationBasis;
    clubPriorLoggedMinutes?: number;
  }>>(() => {
    try {
      const saved = localStorage.getItem('practca_chapter_custom_batch_config_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Multi-Select Target Clubbing State (Daily Target List & Milestone Day Cards)
  const [showClubTargetsBar, setShowClubTargetsBar] = useState<boolean>(false);
  const [clubHoursInput, setClubHoursInput] = useState<number>(3);
  const [clubMinutesInput, setClubMinutesInput] = useState<number>(0);
  const [selectedMilestoneDayChapterKeys, setSelectedMilestoneDayChapterKeys] = useState<Record<string, string[]>>({});
  const [milestoneDayClubDurationMins, setMilestoneDayClubDurationMins] = useState<Record<string, number>>({});
  const [activeBatchInspector, setActiveBatchInspector] = useState<{
    source: 'daily_planner' | 'milestone_day';
    clubGroupId: string;
    batchNumber?: number;
    dateStr?: string;
  } | null>(null);

  const updateChapterCustomConfig = (
    chapterKey: string,
    patch: {
      importance?: 'High' | 'Medium' | 'Low';
      relevance?: 'General' | 'Revision' | 'Final Revision' | undefined;
      timeNeededMins?: number;
      assignedDate?: string | undefined;
      clubGroupId?: string | undefined;
      clubTotalMinutes?: number | undefined;
      clubOrder?: number | undefined;
      clubAllocationBasis?: ClubAllocationBasis | undefined;
      clubPriorLoggedMinutes?: number | undefined;
    }
  ) => {
    setChapterCustomConfig(prev => {
      const existing = prev[chapterKey] || {};
      const updatedEntry = { ...existing, ...patch };
      if (patch.assignedDate === undefined && 'assignedDate' in patch) {
        delete updatedEntry.assignedDate;
      }
      if (patch.relevance === undefined && 'relevance' in patch) {
        delete updatedEntry.relevance;
      }
      if (patch.clubGroupId === undefined && 'clubGroupId' in patch) {
        delete updatedEntry.clubGroupId;
        delete updatedEntry.clubTotalMinutes;
        delete updatedEntry.clubOrder;
        delete updatedEntry.clubAllocationBasis;
        delete updatedEntry.clubPriorLoggedMinutes;
      }
      const next = { ...prev, [chapterKey]: updatedEntry };
      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Proportionately club chapters on a Milestone Day Card in 15-minute slabs and maintain sum(timeNeededMins) === clubTotalMinutes
  const handleClubMilestoneDayChapters = (dayChapsToClub: any[], totalClubMinutes: number, dateStr: string) => {
    if (!dayChapsToClub || dayChapsToClub.length < 2) return;
    const validTotal = roundToNearest15MinSlab(totalClubMinutes, dayChapsToClub.length * 15);
    const newGroupId = `ms_club_${Date.now()}`;
    const allocations = allocateProportionateClubDurations(
      dayChapsToClub.map(ch => ({
        id: ch.configKey,
        subjectCode: ch.subjectCode,
        chapterName: ch.chapterName,
        title: ch.chapterName,
        relevance: ch.relevance === 'Final Revision' ? 'final_revision' : ch.relevance === 'General' ? 'general' : 'revision',
        currentTargetMinutes: ch.timeNeededMins
      })),
      validTotal
    );

    const allocMap = new Map(allocations.map(a => [a.id, a]));
    setChapterCustomConfig(prev => {
      const next = { ...prev };
      dayChapsToClub.forEach((ch, idx) => {
        const alloc = allocMap.get(ch.configKey);
        const propMins = alloc ? alloc.allocatedMinutes : roundToNearest15MinSlab(validTotal / dayChapsToClub.length, 15);
        next[ch.configKey] = {
          ...(next[ch.configKey] || {}),
          timeNeededMins: propMins,
          clubGroupId: newGroupId,
          clubTotalMinutes: validTotal,
          clubOrder: idx,
          clubAllocationBasis: alloc?.basis || 'best_judgment',
          clubPriorLoggedMinutes: alloc?.priorLoggedMinutes || ch.spentMins || 0
        };
      });
      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setSelectedMilestoneDayChapterKeys(prev => ({
      ...prev,
      [dateStr]: []
    }));
  };

  // Adjust a single chapter's duration inside a Milestone Day Card; if part of a batch, rebalance peer sub-targets within fixed clubTotalMinutes
  const handleAdjustMilestoneChapterTime = (ch: any, newSubMins: number, dayChapters: any[]) => {
    const validSubMins = Math.max(1, Math.min(720, Math.round(Number(newSubMins) || 1)));
    if (!ch.clubGroupId) {
      updateChapterCustomConfig(ch.configKey, { timeNeededMins: validSubMins });
      return;
    }

    const peers = dayChapters.filter(p => p.clubGroupId === ch.clubGroupId);
    const currentSum = peers.reduce((acc, p) => acc + (Number(p.timeNeededMins) || 15), 0);
    const fixedClubTotal = Math.max(peers.length, Number(ch.clubTotalMinutes) || currentSum);
    const rebalanced = rebalanceClubSubTargetsWithinLimit(
      peers.map(p => ({
        id: p.configKey,
        currentMinutes: Number(p.timeNeededMins) || 15,
        basis: p.clubAllocationBasis,
        priorLoggedMinutes: p.clubPriorLoggedMinutes
      })),
      ch.configKey,
      validSubMins,
      fixedClubTotal
    );
    const rebalancedMap = new Map(rebalanced.map(r => [r.id, r]));

    setChapterCustomConfig(prev => {
      const next = { ...prev };
      peers.forEach(p => {
        const rItem = rebalancedMap.get(p.configKey);
        const subMins = rItem ? rItem.allocatedMinutes : p.timeNeededMins;
        next[p.configKey] = {
          ...(next[p.configKey] || {}),
          timeNeededMins: subMins,
          clubGroupId: ch.clubGroupId,
          clubTotalMinutes: fixedClubTotal,
          clubAllocationBasis: 'custom_adjusted'
        };
      });
      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Adjust total duration of an entire batch on a Milestone Day Card (proportionately rescales peer sub-targets)
  const handleUpdateMilestoneClubTotalDuration = (clubGroupId: string, newTotal: number, dayChapters: any[]) => {
    const peers = dayChapters.filter(p => p.clubGroupId === clubGroupId);
    if (peers.length === 0) return;
    const validTotal = Math.max(peers.length, Math.min(720, Math.round(Number(newTotal) || peers.length * 45)));
    const rescaled = rescaleClubSubTargetsToNewTotal(
      peers.map(p => ({
        id: p.configKey,
        currentMinutes: Number(p.timeNeededMins) || 15,
        basis: p.clubAllocationBasis,
        priorLoggedMinutes: p.clubPriorLoggedMinutes
      })),
      validTotal
    );
    const rescaledMap = new Map(rescaled.map(r => [r.id, r]));

    setChapterCustomConfig(prev => {
      const next = { ...prev };
      peers.forEach(p => {
        const rItem = rescaledMap.get(p.configKey);
        const subMins = rItem ? rItem.allocatedMinutes : Math.round(validTotal / peers.length);
        next[p.configKey] = {
          ...(next[p.configKey] || {}),
          timeNeededMins: subMins,
          clubGroupId,
          clubTotalMinutes: validTotal,
          clubAllocationBasis: rItem?.basis || 'custom_adjusted'
        };
      });
      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Reset all sub-targets in a Milestone club to equal / proportionate split
  const handleResetMilestoneClubEqualSplit = (clubGroupId: string, dayChapters: any[]) => {
    const peers = dayChapters.filter(p => p.clubGroupId === clubGroupId);
    if (peers.length === 0) return;
    const total = peers[0].clubTotalMinutes || peers.reduce((a, p) => a + p.timeNeededMins, 0);
    const derived = allocateProportionateClubDurations(
      peers.map(p => ({
        id: p.configKey,
        subjectCode: p.subjectCode,
        chapterName: p.chapterName,
        title: p.chapterName,
        relevance: p.relevance === 'Final Revision' ? 'final_revision' : p.relevance === 'General' ? 'general' : 'revision'
      })),
      total
    );
    const dMap = new Map(derived.map(d => [d.id, d]));
    setChapterCustomConfig(prev => {
      const next = { ...prev };
      peers.forEach(p => {
        const d = dMap.get(p.configKey);
        next[p.configKey] = {
          ...(next[p.configKey] || {}),
          timeNeededMins: d ? d.allocatedMinutes : Math.round(total / peers.length),
          clubGroupId,
          clubTotalMinutes: total,
          clubAllocationBasis: d?.basis || 'best_judgment'
        };
      });
      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Add another unbatched chapter from the same milestone day into an existing batch
  const handleAddChapterToMilestoneClub = (clubGroupId: string, targetChapter: any, dayChapters: any[]) => {
    const existingPeers = dayChapters.filter(p => p.clubGroupId === clubGroupId);
    const currentTotal = existingPeers[0]?.clubTotalMinutes || existingPeers.reduce((a, p) => a + p.timeNeededMins, 0) || 180;
    const allMembers = [...existingPeers, targetChapter];
    const derived = allocateProportionateClubDurations(
      allMembers.map(p => ({
        id: p.configKey,
        subjectCode: p.subjectCode,
        chapterName: p.chapterName,
        title: p.chapterName,
        relevance: p.relevance === 'Final Revision' ? 'final_revision' : p.relevance === 'General' ? 'general' : 'revision'
      })),
      currentTotal
    );
    const dMap = new Map(derived.map(d => [d.id, d]));
    setChapterCustomConfig(prev => {
      const next = { ...prev };
      allMembers.forEach((p, idx) => {
        const d = dMap.get(p.configKey);
        next[p.configKey] = {
          ...(next[p.configKey] || {}),
          timeNeededMins: d ? d.allocatedMinutes : Math.round(currentTotal / allMembers.length),
          clubGroupId,
          clubTotalMinutes: currentTotal,
          clubOrder: idx,
          clubAllocationBasis: d?.basis || 'best_judgment'
        };
      });
      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Remove a chapter from a Milestone Day club and rebalance clubTotalMinutes for the remaining peers
  const handleRemoveMilestoneChapterFromClub = (ch: any, dayChapters: any[]) => {
    if (!ch.clubGroupId) return;
    const remainingPeers = dayChapters.filter(p => p.clubGroupId === ch.clubGroupId && p.configKey !== ch.configKey);

    setChapterCustomConfig(prev => {
      const next = { ...prev };
      const targetEntry = { ...(next[ch.configKey] || {}) };
      delete targetEntry.clubGroupId;
      delete targetEntry.clubTotalMinutes;
      delete targetEntry.clubOrder;
      delete targetEntry.clubAllocationBasis;
      delete targetEntry.clubPriorLoggedMinutes;
      next[ch.configKey] = targetEntry;

      if (remainingPeers.length === 1) {
        // Unclub the last remaining chapter since a club requires >= 2 chapters
        const sole = remainingPeers[0];
        const soleEntry = { ...(next[sole.configKey] || {}) };
        delete soleEntry.clubGroupId;
        delete soleEntry.clubTotalMinutes;
        delete soleEntry.clubOrder;
        delete soleEntry.clubAllocationBasis;
        delete soleEntry.clubPriorLoggedMinutes;
        next[sole.configKey] = soleEntry;
      } else if (remainingPeers.length >= 2) {
        const newRemainingTotal = remainingPeers.reduce((acc, p) => acc + p.timeNeededMins, 0);
        remainingPeers.forEach((p, idx) => {
          next[p.configKey] = {
            ...(next[p.configKey] || {}),
            clubTotalMinutes: newRemainingTotal,
            clubOrder: idx
          };
        });
      }

      try {
        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Sync roadmap checkpoints & daily planner tasks in real time via Unified Target System Synchronization Hook
  const {
    syncVersion: targetSystemSyncVersion,
    tasks: syncedTargetSystemTasks,
    roadmapCheckpoints: syncedRoadmapCheckpoints
  } = useTargetSystemSync(selectedDate);

  useEffect(() => {
    if (Array.isArray(syncedRoadmapCheckpoints)) {
      setRoadmapCheckpoints(prev => {
        if (JSON.stringify(prev) === JSON.stringify(syncedRoadmapCheckpoints)) return prev;
        return syncedRoadmapCheckpoints;
      });
    }
  }, [syncedRoadmapCheckpoints, targetSystemSyncVersion]);

  useEffect(() => {
    if (Array.isArray(syncedTargetSystemTasks) && syncedTargetSystemTasks.length > 0) {
      setTasks(prev => {
        if (JSON.stringify(prev) === JSON.stringify(syncedTargetSystemTasks)) return prev;
        return syncedTargetSystemTasks;
      });
    }
  }, [syncedTargetSystemTasks, targetSystemSyncVersion]);

  const [showFinalExamDatesModal, setShowFinalExamDatesModal] = useState(false);

  useEffect(() => {
    const handleOpenExamModal = () => setShowFinalExamDatesModal(true);
    window.addEventListener('practca_open_final_exam_dates_modal', handleOpenExamModal);
    return () => window.removeEventListener('practca_open_final_exam_dates_modal', handleOpenExamModal);
  }, []);

  useEffect(() => {
    const syncCheckpoints = () => {
      try {
        const saved = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints'));
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setRoadmapCheckpoints(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
            return;
          }
        }
      } catch (e) {}
      setRoadmapCheckpoints(prev => prev.length === 0 ? prev : []);
    };
    window.addEventListener('practca_roadmap_checkpoints_updated', syncCheckpoints);
    window.addEventListener('practca_target_system_synced', syncCheckpoints);
    window.addEventListener('storage', syncCheckpoints);
    return () => {
      window.removeEventListener('practca_roadmap_checkpoints_updated', syncCheckpoints);
      window.removeEventListener('practca_target_system_synced', syncCheckpoints);
      window.removeEventListener('storage', syncCheckpoints);
    };
  }, []);

  // Helper: Read the master Final Exam Date (`practca_exam_date` or `practca_roadmap_master_dates`)
  const getMasterFinalExamDate = (): string => {
    try {
      const directExam = localStorage.getItem('practca_exam_date');
      if (directExam && /^\d{4}-\d{2}-\d{2}$/.test(directExam)) return directExam;
      const masterRaw = localStorage.getItem('practca_roadmap_master_dates');
      if (masterRaw) {
        const parsed = JSON.parse(masterRaw);
        if (parsed?.examDate && /^\d{4}-\d{2}-\d{2}$/.test(parsed.examDate)) {
          return parsed.examDate;
        }
      }
    } catch {}
    return '2026-11-01';
  };

  const getOneDayBeforeExamDate = (dateStr: string): string => {
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

  // Determine active (uncompleted) milestones and keep selectedMilestoneId valid
  // Do not include completed milestones in milestone dropdowns
  const sortedRoadmapCheckpoints = React.useMemo(() => {
    return [...roadmapCheckpoints]
      .filter((cp: any) => {
        if (cp.completed === true || cp.status === 'completed') return false;
        const isSub = cp.subjectId !== 'CUSTOM';
        const chaps = (cp.selectedChapters && cp.selectedChapters.length > 0)
          ? cp.selectedChapters
          : (isSub ? getMilestoneSubjectChapters(cp.subjectId as SubjectId) : []);
        const doneSet = new Set(cp.completedChapters || []);
        if (chaps.length > 0 && chaps.every((ch: string) => doneSet.has(ch))) {
          return false;
        }
        return true;
      })
      .map((cp: UserCheckpoint) => {
        const cyc = String(cp.revisionCycle || '').toLowerCase();
        const title = String(cp.customTitle || '').toLowerCase();
        const is15Sprint =
          cyc.includes('final') ||
          cyc.includes('1.5') ||
          title.includes('1.5 day') ||
          title.includes('1.5-day') ||
          title.includes('1.5 sprint') ||
          title.includes('final revision') ||
          title.includes('final sprint');
        if (is15Sprint && cp.targetDate) {
          const validStart =
            cp.startDate && cp.startDate <= cp.targetDate
              ? cp.startDate
              : getOneDayBeforeExamDate(cp.targetDate);
          return {
            ...cp,
            startDate: validStart
          };
        }
        return cp;
      })
      .sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  }, [roadmapCheckpoints]);

  const activeMilestoneCheckpoint = React.useMemo(() => {
    if (sortedRoadmapCheckpoints.length === 0) return null;
    if (selectedMilestoneId) {
      const found = sortedRoadmapCheckpoints.find(c => c.id === selectedMilestoneId);
      if (found) return found;
    }
    return sortedRoadmapCheckpoints[0];
  }, [sortedRoadmapCheckpoints, selectedMilestoneId]);

  const handleOpenAddStudyTargetModal = React.useCallback((overrideDate?: string) => {
    const todayStr = getSystemLocalDateString();
    const candidateDate = (overrideDate || selectedDate || todayStr).split('T')[0];
    const clampedDate = candidateDate >= todayStr ? candidateDate : todayStr;
    if (clampedDate !== selectedDate) {
      setSelectedDate(clampedDate);
    }

    if (sortedRoadmapCheckpoints.length > 0) {
      setTargetSourceMode('milestone');
      if (activeMilestoneCheckpoint && activeMilestoneCheckpoint.subjectId !== 'CUSTOM') {
        const sub = activeMilestoneCheckpoint.subjectId;
        setNewTaskSubject(sub);
        setActiveSyllabusSubject(sub);
        const cpChaps = (activeMilestoneCheckpoint.selectedChapters && activeMilestoneCheckpoint.selectedChapters.length > 0)
          ? activeMilestoneCheckpoint.selectedChapters
          : getMilestoneSubjectChapters(sub);
        const doneSet = new Set(activeMilestoneCheckpoint.completedChapters || []);
        const firstPending = cpChaps.find(c => !doneSet.has(c)) || cpChaps[0];
        if (firstPending) setNewTaskChapter(firstPending);
      }
    } else {
      setTargetSourceMode('other');
    }
    setAddTargetTab('syllabus');
    setShowAddTargetModal(true);
  }, [sortedRoadmapCheckpoints, activeMilestoneCheckpoint, selectedDate]);

  useEffect(() => {
    const checkAndOpenAddTarget = () => {
      try {
        if (sessionStorage.getItem('practca_open_add_study_target_modal') === 'true') {
          const requestedDate = sessionStorage.getItem('practca_open_add_study_target_date') || undefined;
          sessionStorage.removeItem('practca_open_add_study_target_modal');
          sessionStorage.removeItem('practca_open_add_study_target_date');
          setViewFormat('daily');
          handleOpenAddStudyTargetModal(requestedDate);
        }
      } catch (e) {}
    };
    checkAndOpenAddTarget();

    const onExternalTrigger = (e: any) => {
      let requestedDate: string | undefined = e?.detail?.date;
      try {
        if (!requestedDate) {
          requestedDate = sessionStorage.getItem('practca_open_add_study_target_date') || undefined;
        }
        sessionStorage.removeItem('practca_open_add_study_target_modal');
        sessionStorage.removeItem('practca_open_add_study_target_date');
      } catch (err) {}
      setViewFormat('daily');
      handleOpenAddStudyTargetModal(requestedDate);
    };
    window.addEventListener('practca_open_add_study_target_modal', onExternalTrigger as EventListener);
    return () => {
      window.removeEventListener('practca_open_add_study_target_modal', onExternalTrigger as EventListener);
    };
  }, [handleOpenAddStudyTargetModal]);

  // Synchronize and permanently lock milestoneAllocStartDate to active milestone's fixed startDate
  useEffect(() => {
    if (!activeMilestoneCheckpoint) return;
    if (activeMilestoneCheckpoint.startDate) {
      if (milestoneAllocStartDate !== activeMilestoneCheckpoint.startDate) {
        setMilestoneAllocStartDate(activeMilestoneCheckpoint.startDate);
      }
    } else {
      const fixedStart = getSystemLocalDateString();
      if (milestoneAllocStartDate !== fixedStart) {
        setMilestoneAllocStartDate(fixedStart);
      }
      let changed = false;
      const next = roadmapCheckpoints.map(c => {
        if (c.id === activeMilestoneCheckpoint.id && !c.startDate) {
          changed = true;
          return { ...c, startDate: fixedStart };
        }
        return c;
      });
      if (changed) {
        setRoadmapCheckpoints(next);
        try {
          localStorage.setItem(getLevelScopedKey('practca_roadmap_user_checkpoints'), JSON.stringify(next));
          window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
        } catch (e) {}
      }
    }
  }, [activeMilestoneCheckpoint?.id, activeMilestoneCheckpoint?.startDate, roadmapCheckpoints, milestoneAllocStartDate]);

  // Confirmations dialog state (re-architected to avoid storing non-clonable functions/closures in state)
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    description: string;
    type: 'create' | 'complete' | 'delete' | 'unachieved' | 'reschedule' | 'provision_local' | 'provision_cloud' | 'bulk_delete';
    targetId?: string;
    extraData?: any;
  } | null>(null);

  // Revision Planner Confirmation Modal State
  const [revisionConfirmModal, setRevisionConfirmModal] = useState<{
    isOpen: boolean;
    task: any;
    taskTitle: string;
    subjectCode: string;
    chapterName: string;
    selectedMilestone: string;
    activeMilestoneKey: string;
    activeMilestoneLabel: string;
    activeMilestoneBadge: string;
    dynamicRevKeys: string[];
    skippedPriorRevs: string[];
    allDone: boolean;
  } | null>(null);

  // Task Completion Celebration Modal State
  const [taskCelebration, setTaskCelebration] = useState<{
    active: boolean;
    durationMins: number;
    subjectId: SubjectId;
    taskTitle: string;
    chapterName?: string;
    relevance?: string;
    totalTaskMins?: number;
  } | null>(null);

  // Post-completion runtime celebration modal suppressed per user preference

  const matchTaskToChapter = (task: any): { subjectCode: string; chapterName: string; isRevisionTask: boolean } | null => {
    if (!task || isMockTestTask(task) || isNonRevisionReportActivity(task)) return null;
    const validSubs: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
    const rawSub = (task.subjectCode || 'IDT').toString().trim();
    const normSub: SubjectId = validSubs.find(s => s.toUpperCase() === rawSub.toUpperCase()) || 'IDT';
    const officialChapters = OFFICIAL_REVISION_CHAPTERS[normSub] || [];

    const titleStr = (task.cleanTitle || task.title || '').trim();
    const notesStr = (task.notes || '').trim();

    let explicitChapterFromNotes: string | undefined = undefined;
    if (notesStr.startsWith('Chapter: ')) {
      const lineEnd = notesStr.indexOf('\n');
      explicitChapterFromNotes = lineEnd !== -1 ? notesStr.substring(9, lineEnd).trim() : notesStr.substring(9).trim();
    } else if (notesStr.includes('Chapter: ')) {
      const after = notesStr.substring(notesStr.indexOf('Chapter: ') + 9).trim();
      const lineEnd = after.indexOf('\n');
      explicitChapterFromNotes = lineEnd !== -1 ? after.substring(0, lineEnd).trim() : after;
    }

    const resolved = resolveTargetChapterForSubject(
      normSub,
      task.chapterName || explicitChapterFromNotes,
      titleStr,
      undefined
    );

    if (resolved && officialChapters.includes(resolved)) {
      return { subjectCode: normSub, chapterName: resolved, isRevisionTask: true };
    }

    return null;
  };

  const getActiveRevisionMilestone = (subCode: string, chapName: string, taskContext?: any) => {
    try {
      const rawSub = (subCode || 'AFM').toString().trim();
      const validSubs: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
      const normSub: SubjectId = validSubs.find(s => s.toUpperCase() === rawSub.toUpperCase()) || 'AFM';

      const resolved = resolveActiveRevisionForChapter(normSub, chapName, {
        revKey: taskContext?.revKey,
        relevance: taskContext?.relevance,
        title: taskContext?.cleanTitle || taskContext?.title,
        notes: taskContext?.notes,
        milestoneId: taskContext?.milestoneId
      });

      return {
        key: resolved.key as any,
        label: resolved.label,
        badge: resolved.badge,
        dynamicRevKeys: resolved.dynamicRevKeys,
        skippedPriorRevs: resolved.skippedPriorRevs,
        allDone: resolved.allDone
      };
    } catch (e) {
      return {
        key: 'rev1' as const,
        label: '1st Revision (R1)',
        badge: 'R1',
        dynamicRevKeys: ['rev1', 'rev2', 'rev3'],
        skippedPriorRevs: [],
        allDone: false
      };
    }
  };

  const syncRevisionPlannerState = (subjectCode: string, chapterName: string, milestoneKey: string) => {
    try {
      if (!milestoneKey || milestoneKey === 'none') return;
      const rawSub = (subjectCode || 'AFM').toString().trim();
      const validSubs: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
      const normSub: SubjectId = validSubs.find(s => s.toUpperCase() === rawSub.toUpperCase()) || 'AFM';
      const officialChapters = OFFICIAL_REVISION_CHAPTERS[normSub] || [];

      const resolvedChap = resolveTargetChapterForSubject(normSub, chapterName);
      if (!resolvedChap || !officialChapters.includes(resolvedChap)) {
        return;
      }

      const storageKey = `practca_revision_planner_${normSub}`;
      const stored = localStorage.getItem(storageKey);
      let parsed = stored ? JSON.parse(stored) : {};
      let chapters = parsed.chapters || (parsed && typeof parsed === 'object' && !parsed.revisionsCount ? parsed : {});

      const chapState = chapters[resolvedChap] || chapters[chapterName] || {};
      const currentMilestoneState = chapState[milestoneKey] || { completed: false, hours: '' };
      const dateStr = new Date().toISOString().split('T')[0];

      // Mark any prior uncompleted milestone revisions before milestoneKey as skipped
      const dynamicCount = computeSubjectMilestoneRevisionCount(normSub, chapters);
      const dynamicKeys = getSubjectDynamicRevKeys(dynamicCount);
      const targetIdx = dynamicKeys.indexOf(milestoneKey as string);
      const priorSkipped: Record<string, any> = {};
      if (targetIdx > 0) {
        for (let i = 0; i < targetIdx; i++) {
          const priorRk = dynamicKeys[i];
          const priorSt = chapState[priorRk];
          if (!priorSt?.completed) {
            priorSkipped[priorRk] = {
              ...priorSt,
              completed: false,
              skipped: true,
              statusTag: 'skipped',
              hours: priorSt?.hours || '0'
            };
          }
        }
      }

      chapters[resolvedChap] = {
        ...chapState,
        ...priorSkipped,
        [milestoneKey]: {
          ...currentMilestoneState,
          completed: true,
          skipped: false,
          statusTag: 'completed',
          date: dateStr,
          completedAt: dateStr,
          confidence: currentMilestoneState.confidence || 'good'
        }
      };

      const finalPayload = {
        revisionsCount: Math.max(parsed.revisionsCount || 1, dynamicCount),
        chapters
      };

      localStorage.setItem(storageKey, JSON.stringify(finalPayload));
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Error syncing revision planner from TasksPlanner:", e);
    }
  };

  // Moving to another day custom state
  const [rescheduleTask, setRescheduleTask] = useState<any | null>(null);
  const [rescheduleTargetDate, setRescheduleTargetDate] = useState<string>('');

  // Editing target task state
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const [editingTaskNotes, setEditingTaskNotes] = useState<string>('');
  const [editingTaskSubject, setEditingTaskSubject] = useState<string>('IDT');
  const [editingTaskChapter, setEditingTaskChapter] = useState<string>('General / Entire Subject');
  const [editingTaskRelevance, setEditingTaskRelevance] = useState<'General' | 'Revision' | 'Final Revision'>('Revision');

  // Custom task focus timer duration states
  const [taskToFocus, setTaskToFocus] = useState<any | null>(null);
  const [focusDurationInput, setFocusDurationInput] = useState<number>(25);

  // Drag-and-drop state for task reordering
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dropPlacement, setDropPlacement] = useState<'top' | 'bottom' | null>(null);

  // UI Accordion & Tab states for space-optimized sections
  const [completedCollapsed, setCompletedCollapsed] = useState<boolean>(true);
  const [missedCollapsed, setMissedCollapsed] = useState<boolean>(true);
  const [activeChartTab, setActiveChartTab] = useState<'progress' | 'subject' | 'relevance'>('progress');

  // Consolidated row action menu state (active row taskId with open dropdown)
  const [activeRowMenuTaskId, setActiveRowMenuTaskId] = useState<string | null>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('[data-row-menu-container]')) {
        setActiveRowMenuTaskId(null);
      }
    };
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveRowMenuTaskId(null);
    };
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, []);

  const startEditingTask = (task: any) => {
    setEditingTask(task);
    
    // Parse Chapter from task.chapterName or notes if present
    let parsedChapter = task.chapterName || '';
    const notesStr = task.notes || '';
    if (!parsedChapter) {
      const chapMatch = notesStr.match(/Chapter:\s*([^\n\r]+)/i);
      if (chapMatch && chapMatch[1]) {
        parsedChapter = chapMatch[1].trim();
      }
    }
    if (!parsedChapter) {
      const matched = matchTaskToChapter(task);
      if (matched?.chapterName) {
        parsedChapter = matched.chapterName;
      }
    }
    if (!parsedChapter) {
      parsedChapter = 'General / Entire Subject';
    }
    setEditingTaskChapter(parsedChapter);

    setEditingTaskTitle('');
    setEditingTaskNotes(cleanTaskNotes(task.notes));
    setEditingTaskSubject(task.subjectCode || 'IDT');
    setEditingTaskRelevance(task.relevance || 'Revision');
  };

  const handleSaveEditedTask = async () => {
    if (!editingTask) return;

    const rel = editingTaskRelevance;
    const subCode = editingTaskSubject;
    const selectedChapter = editingTaskChapter;
    
    let title = selectedChapter && selectedChapter !== 'General / Entire Subject'
      ? selectedChapter
      : 'Comprehensive Subject Revision';

    const preservedMetaLines = (editingTask.notes || '')
      .split('\n')
      .filter((line: string) => {
        const u = line.trim().toUpperCase();
        return (
          u.startsWith('TARGETDURATIONMINUTES:') ||
          u.startsWith('CLUBGROUPID:') ||
          u.startsWith('CLUBTOTALMINUTES:') ||
          u.startsWith('CLUBORDER:') ||
          u.startsWith('CLUBALLOCATIONBASIS:') ||
          u.startsWith('CLUBPRIORLOGGEDMINUTES:') ||
          u.startsWith('MILESTONE:') ||
          u.startsWith('MILESTONEID:') ||
          u.startsWith('IMPORTANCE:')
        );
      });

    const metaHeaderLines = [
      `Relevance: ${rel}`,
      `Subject: ${subCode}`,
      ...(selectedChapter && selectedChapter !== 'General / Entire Subject' ? [`Chapter: ${selectedChapter}`] : []),
      ...(editingTask.status === 'unachieved' ? ['STATUS: UNACHIEVED'] : []),
      ...preservedMetaLines
    ];

    const manualNoteText = editingTaskNotes.trim();
    const updatedNotes = manualNoteText
      ? `${metaHeaderLines.join('\n')}\n\n${manualNoteText}`
      : metaHeaderLines.join('\n');

    const emoji = rel === 'Final Revision' ? '🔴' : rel === 'General' ? '🔵' : '🟡';
    const fullTitle = `${emoji} [${rel}] [${subCode}] ${title}`;

    const updatedTask: GoogleTask = {
      ...editingTask,
      title: fullTitle,
      cleanTitle: title,
      subjectCode: subCode as SubjectId,
      chapterName: selectedChapter && selectedChapter !== 'General / Entire Subject' ? selectedChapter : undefined,
      relevance: rel,
      notes: updatedNotes,
    };

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => t.id === editingTask.id ? updatedTask : t);
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      setEditingTask(null);
      return;
    }

    if (!user) return;
    setSyncStatus('Saving...');
    setLoading(true);
    setErrorMsg(null);
    const pathTask = `users/${user.uid}/tasks/${editingTask.id}`;
    
    // Strict schema compliance for Firestore (omit undefined properties so setDoc never throws)
    const cleanTaskToWrite: GoogleTask = {
      id: editingTask.id,
      title: fullTitle,
      notes: updatedNotes,
      status: editingTask.status || 'needsAction',
      listId: editingTask.listId || selectedListId || 'cloud-default',
      ...(editingTask.due ? { due: editingTask.due } : {}),
      ...(editingTask.completed ? { completed: String(editingTask.completed) } : {}),
      ...(editingTask.priority ? { priority: editingTask.priority } : {}),
      ...(editingTask.subjectCode ? { subjectCode: editingTask.subjectCode } : {})
    };

    // WRITE-THROUGH CACHE: instantly update state and local storage before async database call
    setTasks(prev => {
      const updated = prev.map(t => t.id === editingTask.id ? cleanTaskToWrite : t);
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
      return updated;
    });

    try {
      await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', editingTask.id), cleanTaskToWrite);
      setEditingTask(null);
      setSyncStatus('Synced');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not update cloud target.');
      setSyncStatus('Sync Error');
      // Rollback on failure
      setTasks(prev => {
        const rolledBack = prev.map(t => t.id === editingTask.id ? editingTask : t);
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
        return rolledBack;
      });
    } finally {
      setLoading(false);
    }
  };

  // Inline editing of study notes
  const [inlineNotesTaskId, setInlineNotesTaskId] = useState<string | null>(null);
  const [inlineNotesValue, setInlineNotesValue] = useState<string>('');

  // Selection states for bulk actions
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Automatically reset selections when calendar date or goal board shifts
  useEffect(() => {
    setSelectedTaskIds([]);
  }, [selectedDate, selectedListId]);

  const handleSaveInlineNotes = async (task: any, newNotesText: string) => {
    const rel = task.relevance || 'Revision';
    const subCode = task.subjectCode || 'IDT';
    const emoji = rel === 'Final Revision' ? '🔴' : rel === 'General' ? '🔵' : '🟡';
    const cleanTitleText = task.cleanTitle || task.title;
    const fullTitle = `${emoji} [${rel}] [${subCode}] ${cleanTitleText}`;

    const preservedMetaLines = (task.notes || '')
      .split('\n')
      .filter((line: string) => {
        const u = line.trim().toUpperCase();
        return (
          u.startsWith('CHAPTER:') ||
          u.startsWith('TARGETDURATIONMINUTES:') ||
          u.startsWith('CLUBGROUPID:') ||
          u.startsWith('CLUBTOTALMINUTES:') ||
          u.startsWith('CLUBORDER:') ||
          u.startsWith('CLUBALLOCATIONBASIS:') ||
          u.startsWith('CLUBPRIORLOGGEDMINUTES:') ||
          u.startsWith('MILESTONE:') ||
          u.startsWith('MILESTONEID:') ||
          u.startsWith('IMPORTANCE:')
        );
      });

    const headerLines = [
      `Relevance: ${rel}`,
      `Subject: ${subCode}`,
      ...(task.status === 'unachieved' ? ['STATUS: UNACHIEVED'] : []),
      ...preservedMetaLines
    ];
    const trimmedManual = newNotesText.trim();
    const fullNotes = trimmedManual
      ? `${headerLines.join('\n')}\n\n${trimmedManual}`
      : headerLines.join('\n');

    const updatedTask: GoogleTask = {
      ...task,
      title: fullTitle,
      notes: fullNotes,
    };

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      setInlineNotesTaskId(null);
      return;
    }

    // Strict schema compliance for Firestore (omit undefined properties so setDoc never throws)
    const cleanTaskToWrite: GoogleTask = {
      id: task.id,
      title: fullTitle,
      notes: fullNotes,
      status: task.status || 'needsAction',
      listId: task.listId || selectedListId || 'cloud-default',
      ...(task.due ? { due: task.due } : {}),
      ...(task.completed ? { completed: String(task.completed) } : {}),
      ...(task.priority ? { priority: task.priority } : {}),
      ...(task.subjectCode ? { subjectCode: task.subjectCode } : {})
    };

    // WRITE-THROUGH CACHE: instantly update state and local storage before async database call
    setTasks(prev => {
      const updated = prev.map(t => t.id === task.id ? cleanTaskToWrite : t);
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
      return updated;
    });

    if (!user) return;
    setSyncStatus('Saving...');
    setLoading(true);
    setErrorMsg(null);
    try {
      await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', task.id), cleanTaskToWrite);
      setInlineNotesTaskId(null);
      setSyncStatus('Synced');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not update study notes.');
      setSyncStatus('Sync Error');
      // Rollback on failure
      setTasks(prev => {
        const rolledBack = prev.map(t => t.id === task.id ? task : t);
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
        return rolledBack;
      });
    } finally {
      setLoading(false);
    }
  };

  // Forced strictly to local offline mode to remove cloud sync options
  const isLocalMode = true;
  const setIsLocalMode = (_val: boolean) => {};

  const loadLocalLists = () => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_local_task_lists')) || localStorage.getItem('cavault_local_task_lists');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTaskLists(parsed);
        if (parsed.length > 0) {
          if (!parsed.some((l: any) => l.id === selectedListId)) {
            setSelectedListId(parsed[0].id);
          }
        } else {
          const defaults = [{ id: 'local-default', title: '🎓 Local practACE Board Goals' }];
          localStorage.setItem(getLevelScopedKey('practca_local_task_lists'), JSON.stringify(defaults));
          setTaskLists(defaults);
          setSelectedListId('local-default');
        }
      } else {
        const defaults = [{ id: 'local-default', title: '🎓 Local practACE Board Goals' }];
        localStorage.setItem(getLevelScopedKey('practca_local_task_lists'), JSON.stringify(defaults));
        setTaskLists(defaults);
        setSelectedListId('local-default');
      }
    } catch (e) {
      console.error("Error loading local task lists:", e);
    }
  };

  const loadLocalTasks = () => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_local_tasks')) || localStorage.getItem('cavault_local_tasks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTasks(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
        }
      } else if (localStorage.getItem('practca_post_exam_normal_cleanup_sig')) {
        localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify([]));
        setTasks([]);
      } else {
        const todayStr = getSystemLocalDateString();
        const defaultTasks: GoogleTask[] = [
          {
            id: 'local-task-1',
            title: '🔴 [High] [IDT] Revise Input Tax Credit (Section 16)',
            notes: 'Priority: High\nSubject: IDT',
            status: 'needsAction',
            due: todayStr,
            listId: 'local-default'
          },
          {
            id: 'local-task-2',
            title: '🟡 [Medium] [DT] Revise PGBP Core Charging Tree (Section 28 & 30)',
            notes: 'Priority: Medium\nSubject: DT',
            status: 'needsAction',
            due: todayStr,
            listId: 'local-default'
          },
          {
            id: 'local-task-3',
            title: '🔵 [Low] [IDT] Study Place of Supply statutory limits',
            notes: 'Priority: Low\nSubject: IDT',
            status: 'completed',
            completed: new Date().toISOString(),
            due: todayStr,
            listId: 'local-default'
          }
        ];
        localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(defaultTasks));
        setTasks(prev => JSON.stringify(prev) === JSON.stringify(defaultTasks) ? prev : defaultTasks);
      }
    } catch (e) {
      console.error("Error loading local tasks:", e);
    }
  };

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  // Sync mode and fetch correct lists
  useEffect(() => {
    if (isLocalMode) {
      loadLocalLists();
      loadLocalTasks();
    } else if (user) {
      loadTaskLists();
    }
  }, [isLocalMode, user?.uid, caLevel]);

  const [durationsSyncTick, setDurationsSyncTick] = useState<number>(0);

  // Real-time synchronization when tasks are updated across other views (e.g. Target Duration Meter / Grind Clock)
  useEffect(() => {
    const handleSyncTasks = () => {
      loadLocalTasks();
      setDurationsSyncTick(t => t + 1);
    };
    window.addEventListener('storage', handleSyncTasks);
    window.addEventListener('practca_tasks_updated', handleSyncTasks);
    window.addEventListener('practca_target_clock_durations_updated', handleSyncTasks);
    window.addEventListener('practca_active_task_duration_adjusted', handleSyncTasks);
    window.addEventListener('practca_task_target_durations_update', handleSyncTasks);
    return () => {
      window.removeEventListener('storage', handleSyncTasks);
      window.removeEventListener('practca_tasks_updated', handleSyncTasks);
      window.removeEventListener('practca_target_clock_durations_updated', handleSyncTasks);
      window.removeEventListener('practca_active_task_duration_adjusted', handleSyncTasks);
      window.removeEventListener('practca_task_target_durations_update', handleSyncTasks);
    };
  }, []);

  // Handle ESC key for Modals & Ctrl+Z / Cmd+Z for Multi-Step Planner Undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAddTargetModal) setShowAddTargetModal(false);
        if (showAutoBatchStudio) setShowAutoBatchStudio(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) {
          return;
        }
        if (plannerUndoStack.length > 0 && !showAddTargetModal) {
          e.preventDefault();
          handleUndoLastPlannerAction();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddTargetModal, showAutoBatchStudio, plannerUndoStack, tasks, selectedDate]);



  // Fetch tasks with real-time sync for all lists
  useEffect(() => {
    if (isLocalMode) {
      // Offline mode tasks are managed in local state array 'tasks' directly
      return;
    }
    if (!user) return;

    setLoading(true);
    setErrorMsg(null);
    const pathTasks = `users/${user.uid}/tasks`;
    const colRef = collection(db, 'users', user.uid, 'tasks');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const allTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GoogleTask[];

      setTasks(allTasks);
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(allTasks));
      setLoading(false);
    }, (error) => {
      console.error("Error with tasks live sync:", error);
      handleFirestoreError(error, OperationType.GET, pathTasks);
      setErrorMsg('Could not fetch cloud goal checklists in real-time.');
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid, isLocalMode]);

  const triggerGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setIsLocalMode(false);
      setToken("firestore-enabled");
      localStorage.setItem('practca_use_local_mode', 'false');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google Sign-In authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setToken(null);
      setUser(null);
      setTasks([]);
      setTaskLists(prev => []);
      setSelectedListId('');
      setIsLocalMode(true);
      localStorage.setItem('practca_use_local_mode', 'true');
    } catch (err) {
      setErrorMsg('Failed to sign out cleanly.');
    } finally {
      setLoading(false);
    }
  };

  const loadTaskLists = async () => {
    if (isLocalMode) {
      loadLocalLists();
      return;
    }
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    const pathLists = `users/${user.uid}/taskLists`;
    try {
      // Fetch from Firestore collection users/{user.uid}/taskLists
      const colRef = collection(db, 'users', user.uid, 'taskLists');
      let snapshot;
      try {
        snapshot = await getDocs(colRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, pathLists);
      }
      let lists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GoogleTaskList[];

      if (lists.length === 0) {
        // Seed a default list
        const defaultList: GoogleTaskList = {
          id: 'cloud-default',
          title: '🎓 practACE Board Goals'
        };
        const pathDefault = `users/${user.uid}/taskLists/cloud-default`;
        try {
          await setDoc(firestoreDoc(db, 'users', user.uid, 'taskLists', 'cloud-default'), defaultList);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, pathDefault);
        }
        lists = [defaultList];
      }

      setTaskLists(lists);
      localStorage.setItem('practca_cached_cloud_task_lists', JSON.stringify(lists));
      if (lists.length > 0) {
        if (!selectedListId || !lists.some((l) => l.id === selectedListId)) {
          setSelectedListId(lists[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load study boards from Firestore');
    } finally {
      setLoading(false);
    }
  };

  const loadTasksForList = async (listId: string) => {
    if (isLocalMode) {
      loadLocalTasks();
      return;
    }
    if (!user || !listId) return;
    setLoading(true);
    setErrorMsg(null);
    const pathTasks = `users/${user.uid}/tasks`;
    try {
      const colRef = collection(db, 'users', user.uid, 'tasks');
      let snapshot;
      try {
        snapshot = await getDocs(colRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, pathTasks);
      }
      const allTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GoogleTask[];

      setTasks(allTasks);
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(allTasks));
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not fetch cloud goal checklists.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTaskList = async () => {
    const trimmed = newListName.trim();
    if (!trimmed) return;

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const newListObj: GoogleTaskList = {
        id: `local-list-${Date.now()}`,
        title: trimmed
      };
      const updatedLists = [newListObj, ...taskLists];
      setTaskLists(updatedLists);
      localStorage.setItem(getLevelScopedKey('practca_local_task_lists'), JSON.stringify(updatedLists));
      setSelectedListId(newListObj.id);
      setNewListName('');
      setShowAddListForm(false);
      return;
    }

    if (!user) return;
    setSyncStatus('Saving...');
    setLoading(true);
    setErrorMsg(null);
    const newListId = `cloud-list-${Date.now()}`;
    const pathList = `users/${user.uid}/taskLists/${newListId}`;
    try {
      const newListObj: GoogleTaskList = {
        id: newListId,
        title: trimmed
      };
      try {
        await setDoc(firestoreDoc(db, 'users', user.uid, 'taskLists', newListId), newListObj);
        setSyncStatus('Synced');
      } catch (error) {
        setSyncStatus('Sync Error');
        handleFirestoreError(error, OperationType.WRITE, pathList);
      }
      setTaskLists(prev => [newListObj, ...prev]);
      setSelectedListId(newListId);
      setNewListName('');
      setShowAddListForm(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to create board in cloud storage.');
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const executeCreateTask = async (
    title: string, 
    notes: string, 
    dueRaw: string, 
    relevance: 'General' | 'Revision' | 'Final Revision', 
    subjectCode: string
  ) => {
    if (subjectCode && isSubjectLockedAfterFinalExam(subjectCode)) {
      setAutoBatchBannerMsg(
        `🔒 [${subjectCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    const todayStr = getSystemLocalDateString();
    const targetDayStr = (dueRaw || selectedDate || todayStr).split('T')[0];
    if (targetDayStr < todayStr) {
      setAutoBatchBannerMsg(
        `⚠️ Target date (${targetDayStr}) cannot be older than Today (${todayStr}).`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }

    // Extract explicit chapter name from notes if present, otherwise use title
    let checkChap = title;
    const chapMatch = (notes || '').match(/Chapter:\s*([^\n\r]+)/i);
    if (chapMatch && chapMatch[1]) {
      checkChap = chapMatch[1].trim();
    }

    // Strict Per-Day Duplicate Chapter Guard: prevent adding the same chapter more than once on a single day
    if (isChapterAlreadyOnDate(subjectCode, checkChap, targetDayStr, tasks)) {
      setAutoBatchBannerMsg(
        `⚠️ [${subjectCode}] "${checkChap}" is already scheduled on ${getFriendlyDateLabel(targetDayStr)} (${targetDayStr}). A chapter cannot be added more than once in a single day.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }

    pushPlannerUndoSnapshot(`Added [${subjectCode}] ${checkChap.slice(0, 30)}`, [targetDayStr]);

    const emoji = relevance === 'Final Revision' ? '🔴' : relevance === 'General' ? '🔵' : '🟡';
    const fullTitle = `${emoji} [${relevance}] [${subjectCode}] ${title}`;
    const initialSlabMins = getRecommendedChapterSlabMinutes(subjectCode, checkChap, title, relevance);
    const fullNotes = `Relevance: ${relevance}\nSubject: ${subjectCode}\nTargetDurationMinutes: ${initialSlabMins}\n\n${notes}`.trim();
    
    if (isLocalMode) {
      triggerLocalSaveStatus();
      const newTaskObj: GoogleTask = {
        id: `local-task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: fullTitle,
        notes: fullNotes,
        due: `${targetDayStr}T09:00:00.000Z`,
        status: 'needsAction',
        listId: selectedListId,
        subjectCode: subjectCode as SubjectId,
        chapterName: checkChap,
        targetDurationMinutes: initialSlabMins
      };

      const updatedTasks = [newTaskObj, ...tasks];
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));

      setNewTaskTitle('');
      setNewTaskNotes('');
      return;
    }

    if (!user || !selectedListId) return;
    setSyncStatus('Saving...');
    setLoading(true);
    setErrorMsg(null);
    const taskId = `cloud-task-${Date.now()}`;
    const pathTask = `users/${user.uid}/tasks/${taskId}`;
    const newTaskObj: GoogleTask = {
      id: taskId,
      title: fullTitle,
      notes: fullNotes,
      due: `${targetDayStr}T09:00:00.000Z`,
      status: 'needsAction',
      listId: selectedListId,
      subjectCode: subjectCode as SubjectId,
      chapterName: checkChap,
      targetDurationMinutes: initialSlabMins
    };

    // WRITE-THROUGH CACHE: instantly update state and localStorage
    setTasks(prev => {
      if (prev.some(t => t.id === newTaskObj.id)) return prev;
      const updated = [newTaskObj, ...prev];
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
      return updated;
    });

    try {
      try {
        await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', taskId), newTaskObj);
        setSyncStatus('Synced');
      } catch (error) {
        setSyncStatus('Sync Error');
        handleFirestoreError(error, OperationType.WRITE, pathTask);
        // Rollback on failure
        setTasks(prev => {
          const rolledBack = prev.filter(t => t.id !== taskId);
          localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
          return rolledBack;
        });
        throw error;
      }
      
      setNewTaskTitle('');
      setNewTaskNotes('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not write cloud target.');
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  // Safe companion execution routines (clutter-free, serializable state)
  const executeToggleTaskCompleted = async (task: GoogleTask, nextStatus: 'completed' | 'needsAction') => {
    if (task.subjectCode && isSubjectLockedAfterFinalExam(task.subjectCode)) {
      setAutoBatchBannerMsg(
        `🔒 [${task.subjectCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    let newNotes = task.notes || '';
    newNotes = newNotes.replace(/STATUS:\s*UNACHIEVED/gi, '').trim();

    let celebrationInvestedMins = 0;
    if (nextStatus === 'completed') {
      const taskTitle = (task.cleanTitle || task.title || '').trim().toLowerCase();
      const pomoMode = localStorage.getItem('practca_pomo_mode');
      const isTimerOnTask = pomoMode === 'study' && Boolean(activeFocusTask && (
        (activeFocusTask.title && task.title && activeFocusTask.title.toLowerCase() === task.title.toLowerCase()) ||
        (activeFocusTask.chapterName && task.chapterName && activeFocusTask.chapterName === task.chapterName)
      ));
      if (onCompleteLinkedTask && isTimerOnTask) {
        try {
          await onCompleteLinkedTask(task);
        } catch (e) {
          console.error("Error in onCompleteLinkedTask:", e);
        }
      }
      if (activeFocusTask && onClearActiveFocusTask) {
        const activeTitle = (activeFocusTask.title || '').trim().toLowerCase();
        const activeChap = (activeFocusTask.chapterName || '').trim().toLowerCase();
        if (
          (activeTitle && taskTitle && (activeTitle === taskTitle || taskTitle.includes(activeTitle) || activeTitle.includes(taskTitle))) ||
          (activeChap && taskTitle.includes(activeChap))
        ) {
          onClearActiveFocusTask();
        }
      }
      try {
        const cached = localStorage.getItem('practca_last_study_session');
        if (cached) {
          const parsed = JSON.parse(cached);
          const pTitle = (parsed.title || '').trim().toLowerCase();
          const pChap = (parsed.chapterName || '').trim().toLowerCase();
          if (
            (pTitle && taskTitle && (pTitle === taskTitle || taskTitle.includes(pTitle) || pTitle.includes(taskTitle))) ||
            (pChap && taskTitle.includes(pChap))
          ) {
            localStorage.removeItem('practca_last_study_session');
          }
        }
      } catch (e) {}

      // Calculate time spent on this task for celebration animation
      let elapsedSecs = 0;
      const pomoStartStr = localStorage.getItem('practca_pomo_start');
      if (pomoMode === 'study' && pomoStartStr) {
        const d = new Date(pomoStartStr);
        if (!isNaN(d.getTime())) {
          elapsedSecs = Math.floor((Date.now() - d.getTime()) / 1000);
        }
      }
      const activeMins = elapsedSecs >= 2 ? Math.max(1, Math.round(elapsedSecs / 60)) : 0;

      let allSessions: any[] = [];
      try {
        const rawSessions = localStorage.getItem('practca_focus_sessions');
        if (rawSessions) allSessions = JSON.parse(rawSessions);
      } catch (e) {}

      const tClean = (task.cleanTitle || task.title || '').trim().toLowerCase();
      const tChap = (task.chapterName || '').trim().toLowerCase();

      const prevInvested = allSessions
        .filter((s: any) => {
          const sDesc = (s.description || '').toLowerCase();
          const sChap = (s.chapterName || '').toLowerCase();
          return (tClean && (sDesc.includes(tClean) || tClean.includes(sDesc))) || (tChap && sChap === tChap);
        })
        .reduce((acc: number, curr: any) => acc + (curr.duration || 0), 0);

      const totalMins = prevInvested + activeMins;
      celebrationInvestedMins = totalMins;
    }

    // Synchronize completion status across ALL links (24h clock, Target Flow, registry, etc.)
    const parsedTaskMilestoneId = task.milestoneId || (typeof newNotes === 'string' && newNotes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim()) || undefined;
    const taskAllocatedMins = Math.max(
      celebrationInvestedMins,
      Number((task as any).allocatedMinutes) || 0,
      Number((task as any).actualMinutes) || 0
    );
    await syncTaskCompletionAcrossAllLinks(
      {
        id: task.id,
        title: task.title,
        cleanTitle: task.cleanTitle || task.title,
        chapterName: task.chapterName,
        subjectCode: task.subjectCode,
        due: task.due,
        taskDate: task.taskDate,
        milestoneId: parsedTaskMilestoneId,
        revKey: task.revKey,
        phaseId: task.phaseId,
        targetDurationMinutes: task.originalTargetDurationMinutes || task.targetDurationMinutes || task.duration,
        allocatedMinutes: taskAllocatedMins,
        notes: newNotes
      },
      nextStatus === 'completed',
      {
        selectedDate: task.due ? task.due.split('T')[0] : undefined,
        milestoneId: parsedTaskMilestoneId,
        phaseId: task.phaseId,
        actualMinutes: taskAllocatedMins
      }
    );

    // Read reconciled duration & early-completion fields written by syncTaskCompletionAcrossAllLinks
    const syncedFromStorageMap = new Map<string, any>();
    try {
      const latestRaw = localStorage.getItem(getLevelScopedKey('practca_local_tasks'));
      if (latestRaw) {
        const parsedLatest = JSON.parse(latestRaw);
        if (Array.isArray(parsedLatest)) {
          parsedLatest.forEach((lt: any) => {
            if (lt && lt.id) syncedFromStorageMap.set(lt.id, lt);
          });
        }
      }
    } catch (e) {}

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        const syncedPeer = syncedFromStorageMap.get(t.id);
        if (t.id === task.id) {
          return {
            ...t,
            ...(syncedPeer ? {
              targetDurationMinutes: syncedPeer.targetDurationMinutes,
              duration: syncedPeer.duration,
              originalTargetDurationMinutes: syncedPeer.originalTargetDurationMinutes,
              earlyCompletionSavedMinutes: syncedPeer.earlyCompletionSavedMinutes,
              clubTotalMinutes: syncedPeer.clubTotalMinutes,
              originalClubTotalMinutes: syncedPeer.originalClubTotalMinutes
            } : {}),
            status: nextStatus,
            notes: syncedPeer?.notes || newNotes,
            completed: nextStatus === 'completed' ? new Date().toISOString() : undefined
          };
        }
        if (syncedPeer && t.clubGroupId && t.clubGroupId === task.clubGroupId) {
          return {
            ...t,
            clubTotalMinutes: syncedPeer.clubTotalMinutes,
            originalClubTotalMinutes: syncedPeer.originalClubTotalMinutes,
            notes: syncedPeer.notes || t.notes
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      return;
    }
    if (!user) return;
    setSyncStatus('Saving...');
    setLoading(true);
    setErrorMsg(null);
    try {
      const syncedSelf = syncedFromStorageMap.get(task.id);
      // Strict schema compliance for Firestore (omit undefined properties so setDoc never throws)
      const cleanTaskToWrite: GoogleTask = {
        id: task.id,
        title: task.title,
        notes: syncedSelf?.notes || newNotes,
        status: nextStatus,
        listId: task.listId || selectedListId || 'cloud-default',
        ...(task.due ? { due: task.due } : {}),
        ...(nextStatus === 'completed' ? { completed: new Date().toISOString() } : {}),
        ...(task.priority ? { priority: task.priority } : {}),
        ...(task.subjectCode ? { subjectCode: task.subjectCode } : {})
      };

      // WRITE-THROUGH CACHE: update local state and local storage instantly before async database call
      setTasks(prev => {
        const updated = prev.map(t => {
          const syncedPeer = syncedFromStorageMap.get(t.id);
          if (t.id === task.id) {
            return {
              ...t,
              ...cleanTaskToWrite,
              ...(syncedPeer ? {
                targetDurationMinutes: syncedPeer.targetDurationMinutes,
                duration: syncedPeer.duration,
                originalTargetDurationMinutes: syncedPeer.originalTargetDurationMinutes,
                earlyCompletionSavedMinutes: syncedPeer.earlyCompletionSavedMinutes,
                clubTotalMinutes: syncedPeer.clubTotalMinutes,
                originalClubTotalMinutes: syncedPeer.originalClubTotalMinutes
              } : {})
            };
          }
          return t;
        });
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
        return updated;
      });

      const pathToggle = `users/${user.uid}/tasks/${task.id}`;
      try {
        await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', task.id), cleanTaskToWrite);
        setSyncStatus('Synced');
      } catch (error) {
        setSyncStatus('Sync Error');
        handleFirestoreError(error, OperationType.WRITE, pathToggle);
        // Rollback on failure
        setTasks(prev => {
          const rolledBack = prev.map(t => t.id === task.id ? task : t);
          localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
          return rolledBack;
        });
        throw error;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to update task state.');
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteTask = async (taskId: string) => {
    const originalTask = tasks.find(t => t.id === taskId);
    if (originalTask?.subjectCode && isSubjectLockedAfterFinalExam(originalTask.subjectCode)) {
      setAutoBatchBannerMsg(
        `🔒 [${originalTask.subjectCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    if (originalTask) {
      const tDate = originalTask.due ? originalTask.due.split('T')[0] : selectedDate;
      pushPlannerUndoSnapshot(`Deleted "${(originalTask.cleanTitle || originalTask.title || 'Target').slice(0, 28)}"`, [tDate]);
    }
    if (originalTask && activeFocusTask && onClearActiveFocusTask) {
      const taskTitle = originalTask.cleanTitle || originalTask.title;
      if (activeFocusTask.title === taskTitle) {
        onClearActiveFocusTask();
      }
    }

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      return;
    }
    if (!user) return;
    setSyncStatus('Saving...');
    setLoading(true);
    setErrorMsg(null);
    const pathDelete = `users/${user.uid}/tasks/${taskId}`;
    try {
      // WRITE-THROUGH CACHE: delete instantly from state and local storage
      setTasks(prev => {
        const updated = prev.filter(t => t.id !== taskId);
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
        return updated;
      });

      try {
        await deleteDoc(firestoreDoc(db, 'users', user.uid, 'tasks', taskId));
        setSyncStatus('Synced');
      } catch (error) {
        setSyncStatus('Sync Error');
        handleFirestoreError(error, OperationType.DELETE, pathDelete);
        // Rollback on failure
        if (originalTask) {
          setTasks(prev => {
            const rolledBack = [originalTask, ...prev];
            localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
            return rolledBack;
          });
        }
        throw error;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not delete the task. Try again.');
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const executeMarkUnachieved = async (task: any) => {
    const tDate = task?.due ? task.due.split('T')[0] : selectedDate;
    pushPlannerUndoSnapshot(`Marked "${(task?.cleanTitle || task?.title || 'Target').slice(0, 26)}" Missed`, [tDate]);

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            status: 'unachieved' as any,
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
    } else {
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      const pathUnachieved = `users/${user.uid}/tasks/${task.id}`;
      try {
        const rawNotes = task.notes || '';
        const cleanedNotes = cleanTaskNotes(rawNotes);
        const rel = task.relevance || 'Revision';
        const updatedNotes = `Relevance: ${rel}\nSubject: ${task.subjectCode}\nSTATUS: UNACHIEVED\n\n${cleanedNotes}`.trim();

        const cleanTaskToWrite: GoogleTask = {
          id: task.id,
          title: task.title,
          notes: updatedNotes,
          status: 'completed',
          completed: new Date().toISOString(),
          listId: task.listId || selectedListId || 'cloud-default',
          ...(task.due ? { due: task.due } : {}),
          ...(task.priority ? { priority: task.priority } : {}),
          ...(task.subjectCode ? { subjectCode: task.subjectCode } : {})
        };

        // WRITE-THROUGH CACHE: instantly update state and local storage
        setTasks(prev => {
          const updated = prev.map(t => t.id === task.id ? cleanTaskToWrite : t);
          localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
          return updated;
        });

        try {
          await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', task.id), cleanTaskToWrite);
          setSyncStatus('Synced');
        } catch (error) {
          setSyncStatus('Sync Error');
          handleFirestoreError(error, OperationType.WRITE, pathUnachieved);
          // Rollback on failure
          setTasks(prev => {
            const rolledBack = prev.map(t => t.id === task.id ? task : t);
            localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
            return rolledBack;
          });
          throw error;
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Failed to flag task as unachieved.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const executeMoveToCustomDate = async (task: any, targetDateStr: string) => {
    if (!targetDateStr) return;
    if (task?.subjectCode && isSubjectLockedAfterFinalExam(task.subjectCode)) {
      setAutoBatchBannerMsg(
        `🔒 [${task.subjectCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }

    const cleanTargetDay = targetDateStr.split('T')[0];
    const chapOrTitle = task.chapterName || task.cleanTitle || task.title || '';
    if (isChapterAlreadyOnDate(task.subjectCode || 'IDT', chapOrTitle, cleanTargetDay, tasks, task.id)) {
      setAutoBatchBannerMsg(
        `⚠️ [${task.subjectCode || 'IDT'}] "${chapOrTitle}" is already scheduled on ${getFriendlyDateLabel(cleanTargetDay)} (${cleanTargetDay}). Cannot schedule duplicate chapter on the same day.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }

    pushPlannerUndoSnapshot(`Moved "${(task.cleanTitle || task.title || 'Target').slice(0, 24)}" to ${cleanTargetDay}`, [selectedDate, cleanTargetDay]);
    
    // 1. If in local mode
    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            status: 'unachieved' as any,
          };
        }
        return t;
      });

      const rel = task.relevance || 'Revision';
      const subjectCode = task.subjectCode;
      const emoji = rel === 'Final Revision' ? '🔴' : rel === 'General' ? '🔵' : '🟡';
      const fullTitle = `${emoji} [${rel}] [${subjectCode}] ${task.cleanTitle}`;
      
      const rawNotes = task.notes || '';
      const cleanedNotes = cleanTaskNotes(rawNotes);
      const fullNotes = `Relevance: ${rel}\nSubject: ${subjectCode}\n\n${cleanedNotes}`.trim();

      const newTaskObj: GoogleTask = {
        id: `local-task-${Date.now()}`,
        title: fullTitle,
        notes: fullNotes,
        due: targetDateStr, // Target for the user-selected custom date
        status: 'needsAction',
        listId: selectedListId
      };

      const finalTasks = [...updatedTasks, newTaskObj];
      setTasks(finalTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(finalTasks));
    } else {
      // Cloud mode
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      try {
        const rawNotes = task.notes || '';
        const cleanedNotes = cleanTaskNotes(rawNotes);
        const rel = task.relevance || 'Revision';
        const updatedNotes = `Relevance: ${rel}\nSubject: ${task.subjectCode}\nSTATUS: UNACHIEVED\n\n${cleanedNotes}`.trim();

        const oldTaskUpdated: GoogleTask = {
          id: task.id,
          title: task.title,
          notes: updatedNotes,
          status: 'completed',
          completed: new Date().toISOString(),
          listId: task.listId || selectedListId || 'cloud-default',
          ...(task.due ? { due: task.due } : {}),
          ...(task.priority ? { priority: task.priority } : {}),
          ...(task.subjectCode ? { subjectCode: task.subjectCode } : {})
        };

        const emoji = rel === 'Final Revision' ? '🔴' : rel === 'General' ? '🔵' : '🟡';
        const fullTitle = `${emoji} [${rel}] [${task.subjectCode}] ${task.cleanTitle}`;
        const fullNotes = `Relevance: ${rel}\nSubject: ${task.subjectCode}\n\n${cleanedNotes}`.trim();

        const newTaskId = `cloud-task-${Date.now()}`;
        const newTaskObj: GoogleTask = {
          id: newTaskId,
          title: fullTitle,
          notes: fullNotes,
          due: targetDateStr,
          status: 'needsAction',
          listId: selectedListId || 'cloud-default'
        };

        // WRITE-THROUGH CACHE: instantly update local state and localStorage
        setTasks(prev => {
          const updatedList = prev.map(t => t.id === task.id ? oldTaskUpdated : t);
          const finalTasks = updatedList.some(t => t.id === newTaskObj.id) ? updatedList : [...updatedList, newTaskObj];
          localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(finalTasks));
          return finalTasks;
        });

        // Patch existing
        const pathOld = `users/${user.uid}/tasks/${task.id}`;
        try {
          await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', task.id), oldTaskUpdated);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, pathOld);
          // Rollback on failure
          setTasks(prev => {
            const rolledBack = prev.filter(t => t.id !== newTaskId).map(t => t.id === task.id ? task : t);
            localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
            return rolledBack;
          });
          throw error;
        }

        // Create new
        const pathNew = `users/${user.uid}/tasks/${newTaskId}`;
        try {
          await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', newTaskId), newTaskObj);
          setSyncStatus('Synced');
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, pathNew);
          // Rollback on failure
          setTasks(prev => {
            const rolledBack = prev.filter(t => t.id !== newTaskId).map(t => t.id === task.id ? task : t);
            localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(rolledBack));
            return rolledBack;
          });
          throw error;
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to reschedule cloud task.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmModalExecute = async () => {
    if (!confirmModal) return;
    const { type, extraData } = confirmModal;
    setConfirmModal(null);

    if (type === 'create') {
      if (extraData?.action === 'addNewTask') {
        executeCreateTask(newTaskTitle, newTaskNotes, selectedDate, newTaskRelevance, newTaskSubject);
      } else if (extraData?.action === 'rescheduleSingle') {
        const { task, targetDateStr } = extraData;
        setRescheduleTask(null);
        await executeMoveToCustomDate(task, targetDateStr);
      }
    } else if (type === 'complete') {
      const { task, nextStatus } = extraData;
      await executeToggleTaskCompleted(task, nextStatus);
    } else if (type === 'delete') {
      const { taskId } = extraData;
      await executeDeleteTask(taskId);
    } else if (type === 'bulk_delete') {
      const { taskIds } = extraData;
      await executeBulkDelete(taskIds);
    } else if (type === 'unachieved') {
      const { task } = extraData;
      await executeMarkUnachieved(task);
    } else if (type === 'provision_local') {
      // Local mode list already provisioned in click handler, this dialog was informational confirmation
    } else if (type === 'provision_cloud') {
      // Cloud mode list already provisioned in click handler, this dialog was informational confirmation
    }
  };

  // Safe validation wrap
  const handleAddNewTask = () => {
    const todayStr = getSystemLocalDateString();
    const targetDayCheck = (selectedDate || todayStr).split('T')[0];
    if (targetDayCheck < todayStr) {
      setAutoBatchBannerMsg(`⚠️ Target date (${targetDayCheck}) cannot be older than Today (${todayStr}).`);
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    if (newTaskSubject && isSubjectLockedAfterFinalExam(newTaskSubject)) {
      setAutoBatchBannerMsg(
        `🔒 [${newTaskSubject}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    if (targetSourceMode === 'mock_test') {
      const targetDayStr = targetDayCheck;
      const [hStr, mStr] = (plannerMockExamTime || '14:00').split(':');
      const examStartMins = Math.max(15, (parseInt(hStr, 10) || 14) * 60 + (parseInt(mStr, 10) || 0));
      const readingStartMins = Math.max(0, examStartMins - 15);
      const examEndMins = Math.min(24 * 60 - 1, examStartMins + 180);
      const toHHMM = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
      const to12Hr = (mins: number) => {
        const h24 = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        const ampm = h24 >= 12 ? 'PM' : 'AM';
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
      };
      const readingStartHHMM = toHHMM(readingStartMins);
      const examEndHHMM = toHHMM(examEndMins);
      const exam12HrLabel = to12Hr(examStartMins);
      const cleanMockTitle = `[${newTaskSubject}] Mock Test: ${plannerMockSeries} (Exam at ${exam12HrLabel})`;
      const fullMockTitle = `🔵 [General] ${cleanMockTitle}`;
      const mockTaskId = `mock-task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const mockNotes = `IS_MOCK_TEST: true\nMockScheduledTime: ${plannerMockExamTime}\nMockSeries: ${plannerMockSeries}\nRelevance: General\nSubject: ${newTaskSubject}\nTargetDurationMinutes: 195\nReadingStart: ${readingStartHHMM}`;

      const newMockTaskObj: any = {
        id: mockTaskId,
        title: fullMockTitle,
        cleanTitle: cleanMockTitle,
        notes: mockNotes,
        due: `${targetDayStr}T${plannerMockExamTime}:00.000Z`,
        status: 'needsAction',
        listId: selectedListId || 'local-default',
        subjectCode: newTaskSubject as SubjectId,
        relevance: 'General',
        isMockTest: true,
        mockScheduledTime: plannerMockExamTime,
        mockSeries: plannerMockSeries,
        targetDurationMinutes: 195
      };

      const updatedTasks = [newMockTaskObj, ...tasks];
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));

      try {
        const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
        const durMap = rawDur ? JSON.parse(rawDur) : {};
        durMap[mockTaskId] = 195;
        durMap[cleanMockTitle] = 195;
        durMap[fullMockTitle] = 195;
        localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durMap));
      } catch (e) {}

      // Do NOT auto-slot onto the 24-Hour Plan Clock; slotting is strictly user-initiated on the 24-Hour Plan Clock.

      window.dispatchEvent(new CustomEvent('practca_tasks_updated', { detail: { task: newMockTaskObj } }));
      window.dispatchEvent(new Event('storage'));
      setShowAddTargetModal(false);
      return;
    }

    const selectedChapter = newTaskChapter;
    let titleToUse = newTaskTitle.trim();
    
    if (!titleToUse) {
      if (selectedChapter && selectedChapter !== 'General / Entire Subject') {
        titleToUse = selectedChapter;
      } else {
        titleToUse = 'Comprehensive Subject Revision';
      }
    } else {
      if (selectedChapter && selectedChapter !== 'General / Entire Subject') {
        titleToUse = `${selectedChapter}: ${titleToUse}`;
      }
    }
    
    const manualStudyNotes = newTaskNotes.trim();
    let notesToUse = '';
    if (selectedChapter && selectedChapter !== 'General / Entire Subject') {
      notesToUse = `Chapter: ${selectedChapter}`;
    }
    if (manualStudyNotes) {
      notesToUse = notesToUse ? `${notesToUse}\n\n${manualStudyNotes}` : manualStudyNotes;
    }

    executeCreateTask(titleToUse, notesToUse, selectedDate, newTaskRelevance, newTaskSubject);
    
    // Reset form states
    setNewTaskTitle('');
    setNewTaskNotes('');
    setShowAddTargetModal(false);
  };

  // Import predefined or custom JSON task schedule (e.g., 'Revision Schedule')
  const handleImportTemplateSchedule = async (
    normalizedTasks: NormalizedTemplateTask[],
    options: {
      createNewBoard: boolean;
      newBoardTitle: string;
      skipDuplicates: boolean;
    }
  ): Promise<{ importedCount: number; skippedCount: number; boardTitle: string }> => {
    let targetListId = selectedListId || taskLists[0]?.id || (isLocalMode ? 'local-default' : 'cloud-default');
    let activeBoardTitle =
      taskLists.find(l => l.id === targetListId)?.title || 'Default Goal Board';

    if (options.createNewBoard && options.newBoardTitle.trim()) {
      const cleanBoardTitle = options.newBoardTitle.trim();
      const newBoardId = `${isLocalMode ? 'local' : 'cloud'}-list-${Date.now()}`;
      const newBoardObj: GoogleTaskList = {
        id: newBoardId,
        title: cleanBoardTitle,
        updated: new Date().toISOString()
      };
      const updatedLists = [...taskLists, newBoardObj];
      setTaskLists(updatedLists);
      setSelectedListId(newBoardId);
      targetListId = newBoardId;
      activeBoardTitle = cleanBoardTitle;
      try {
        localStorage.setItem(getLevelScopedKey('practca_local_task_lists'), JSON.stringify(updatedLists));
        localStorage.setItem('practca_selected_list_id', newBoardId);
      } catch (e) {}

      if (!isLocalMode && user) {
        try {
          await setDoc(firestoreDoc(db, 'users', user.uid, 'taskLists', newBoardId), newBoardObj);
        } catch (e) {}
      }
    }

    const affectedDates = Array.from(new Set(normalizedTasks.map(t => t.taskDate)));
    pushPlannerUndoSnapshot(
      `Imported "${options.newBoardTitle || 'Revision Schedule'}" (${normalizedTasks.length} targets)`,
      affectedDates.length > 0 ? affectedDates : [selectedDate]
    );

    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    const newlyCreatedTasks: GoogleTask[] = [];
    let skippedCount = 0;
    const workingTasks = [...tasks];

    normalizedTasks.forEach((item, idx) => {
      const chapOrTitle = item.chapterName || item.cleanTitle || item.title;
      if (
        options.skipDuplicates &&
        isChapterAlreadyOnDate(item.subjectCode, chapOrTitle, item.taskDate, [...workingTasks, ...newlyCreatedTasks])
      ) {
        skippedCount++;
        return;
      }

      const emoji = item.relevance === 'Final Revision' ? '🔴' : item.relevance === 'General' ? '🔵' : '🟡';
      const fullTitle = `${emoji} [${item.relevance}] [${item.subjectCode}] ${item.cleanTitle}`;
      const taskId = `${isLocalMode ? 'local' : 'cloud'}-task-${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`;

      const hasDuration = item.targetDurationMinutes > 0;
      const noteLines = [
        `Relevance: ${item.relevance}`,
        `Subject: ${item.subjectCode}`,
        `Priority: ${item.priority}`,
        ...(item.chapterName ? [`Chapter: ${item.chapterName}`] : []),
        ...(item.revKey ? [`RevKey: ${item.revKey}`] : []),
        ...(hasDuration ? [`TargetDurationMinutes: ${item.targetDurationMinutes}`] : []),
        ...(item.notes ? ['', item.notes] : [])
      ];
      const fullNotes = noteLines.join('\n').trim();

      const newTaskObj: GoogleTask = {
        id: taskId,
        title: fullTitle,
        cleanTitle: item.cleanTitle,
        chapterName: item.chapterName || item.cleanTitle,
        subjectCode: item.subjectCode,
        relevance: item.relevance,
        revKey: item.revKey,
        priority: item.priority,
        notes: fullNotes,
        due: `${item.taskDate}T09:00:00.000Z`,
        taskDate: item.taskDate,
        status: 'needsAction',
        listId: targetListId,
        ...(hasDuration
          ? {
              targetDurationMinutes: item.targetDurationMinutes,
              duration: item.targetDurationMinutes
            }
          : {})
      };

      if (hasDuration) {
        durationsMap[taskId] = item.targetDurationMinutes;
        durationsMap[item.cleanTitle] = item.targetDurationMinutes;
        durationsMap[normalizeKey(item.cleanTitle)] = item.targetDurationMinutes;
        if (item.chapterName) {
          durationsMap[item.chapterName] = item.targetDurationMinutes;
          durationsMap[normalizeKey(item.chapterName)] = item.targetDurationMinutes;
        }
      }

      newlyCreatedTasks.push(newTaskObj);
    });

    if (newlyCreatedTasks.length > 0) {
      const updatedAllTasks = [...newlyCreatedTasks, ...tasks];
      setTasks(updatedAllTasks);
      triggerLocalSaveStatus();

      try {
        localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedAllTasks));
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedAllTasks));
        localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedAllTasks));
        localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
        window.dispatchEvent(new Event('practca_tasks_updated'));
      } catch (e) {}

      if (!isLocalMode && user) {
        try {
          await Promise.all(
            newlyCreatedTasks.map(nt =>
              setDoc(
                firestoreDoc(db, 'users', user.uid, 'tasks', nt.id),
                {
                  id: nt.id,
                  title: nt.title,
                  notes: nt.notes,
                  due: nt.due,
                  status: nt.status,
                  listId: nt.listId || targetListId,
                  priority: nt.priority,
                  subjectCode: nt.subjectCode
                }
              ).catch(() => {})
            )
          );
          setSyncStatus('Synced');
        } catch (e) {}
      }

      if (affectedDates.length > 0 && !affectedDates.includes(selectedDate)) {
        setSelectedDate(affectedDates[0]);
      }
      if (viewFormat === 'roadmap') {
        setViewFormat('daily');
      }

      setAutoBatchBannerMsg(
        `✅ Imported ${newlyCreatedTasks.length} target${newlyCreatedTasks.length === 1 ? '' : 's'} into "${activeBoardTitle}"${
          skippedCount > 0 ? ` (${skippedCount} duplicate${skippedCount === 1 ? '' : 's'} skipped)` : ''
        }.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
    }

    return {
      importedCount: newlyCreatedTasks.length,
      skippedCount,
      boardTitle: activeBoardTitle
    };
  };

  const handleToggleTaskCompleted = async (
    task: GoogleTask, 
    forceExecute: boolean = false,
    targetStatus?: 'completed' | 'needsAction'
  ) => {
    if (task.subjectCode && isSubjectLockedAfterFinalExam(task.subjectCode)) {
      setAutoBatchBannerMsg(
        `🔒 [${task.subjectCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    const isMissed = task.status === 'unachieved';
    const isCurrentlyCompleted = task.status === 'completed' || Boolean(task.completed);
    // If targetStatus is explicitly provided, respect it; otherwise calculate toggle transition
    const nextStatus = targetStatus !== undefined
      ? targetStatus
      : (isCurrentlyCompleted ? 'needsAction' : isMissed ? 'needsAction' : 'completed');
    
    const isGoingToBeCompleted = nextStatus === 'completed';

    // Helper to check if this task has any actual logged or active study time (> 0m)
    const getTaskLoggedStudyMinutes = (t: GoogleTask): number => {
      let mins = 0;
      const tClean = (t.cleanTitle || t.title || '').trim().toLowerCase();
      const tChap = (t.chapterName || '').trim().toLowerCase();

      try {
        const rawSessions = localStorage.getItem('practca_focus_sessions');
        const sessions: any[] = rawSessions ? JSON.parse(rawSessions) : [];
        for (const s of sessions) {
          const sDesc = (s.description || '').toLowerCase();
          const sChap = (s.chapterName || '').toLowerCase();
          if ((tClean && (sDesc.includes(tClean) || tClean.includes(sDesc))) || (tChap && sChap === tChap)) {
            mins += Number(s.duration) || 0;
          }
        }
      } catch (e) {}

      try {
        const rawRevLogs = localStorage.getItem('practca_revision_planner_logs');
        const revLogs: any[] = rawRevLogs ? JSON.parse(rawRevLogs) : [];
        for (const l of revLogs) {
          const lChap = (l.chapterName || '').toLowerCase();
          const lTitle = (l.taskTitle || '').toLowerCase();
          if ((tChap && lChap === tChap) || (tClean && lTitle && (lTitle.includes(tClean) || tClean.includes(lTitle)))) {
            mins += Number(l.durationMinutes) || (parseFloat(l.hours || '0') * 60) || 0;
          }
        }
      } catch (e) {}

      try {
        const activeMode = localStorage.getItem('practca_pomo_active_mode');
        const rawBlockStart = localStorage.getItem('practca_pomo_block_start');
        const rawActiveFocus = localStorage.getItem('practca_active_focus_task');
        if (activeMode === 'study' && rawBlockStart && rawActiveFocus) {
          const aft = JSON.parse(rawActiveFocus);
          const aftTitle = (aft.title || '').trim().toLowerCase();
          const aftChap = (aft.chapterName || '').trim().toLowerCase();
          const isLinked = (tClean && aftTitle && (aftTitle === tClean || aftTitle.includes(tClean) || tClean.includes(aftTitle))) ||
                           (tChap && aftChap && aftChap === tChap);
          if (isLinked) {
            const d = new Date(rawBlockStart);
            if (!isNaN(d.getTime())) {
              const elapsedSecs = Math.floor((Date.now() - d.getTime()) / 1000);
              if (elapsedSecs >= 60) mins += Math.max(1, Math.round(elapsedSecs / 60));
            }
          }
        }
      } catch (e) {}

      return mins;
    };

    await executeToggleTaskCompleted(task, nextStatus);
  };


  const handleToggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const executeBulkDelete = async (taskIdsToDelete: string[]) => {
    setLoading(true);
    setSyncStatus('Saving...');
    setErrorMsg(null);
    pushPlannerUndoSnapshot(`Deleted ${taskIdsToDelete.length} selected targets`, [selectedDate]);

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.filter(t => !taskIdsToDelete.includes(t.id));
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      setSelectedTaskIds([]);
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const updatedTasks = tasks.filter(t => !taskIdsToDelete.includes(t.id));
      // WRITE-THROUGH CACHE
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));

      const promises = taskIdsToDelete.map(id => 
        deleteDoc(firestoreDoc(db, 'users', user.uid, 'tasks', id))
      );
      await Promise.all(promises);
      setSyncStatus('Synced');
      setSelectedTaskIds([]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to delete selected tasks from the cloud.');
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedTaskIds.length === 0) return;
    setConfirmModal({
      show: true,
      title: `Delete ${selectedTaskIds.length} Targets Permanently?`,
      description: `Are you absolutely sure you want to permanently delete the ${selectedTaskIds.length} selected targets? This will wipe their records completely and cannot be undone.`,
      type: 'bulk_delete',
      extraData: { taskIds: selectedTaskIds }
    });
  };

  const handleBulkComplete = async () => {
    if (selectedTaskIds.length === 0) return;
    setLoading(true);
    setSyncStatus('Saving...');
    setErrorMsg(null);

    const taskIdsToComplete = [...selectedTaskIds];
    const tasksToComplete = tasks.filter(t => taskIdsToComplete.includes(t.id));
    pushPlannerUndoSnapshot(`Completed ${taskIdsToComplete.length} targets`, [selectedDate]);

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        if (taskIdsToComplete.includes(t.id)) {
          let newNotes = t.notes || '';
          newNotes = newNotes.replace(/STATUS:\s*UNACHIEVED/gi, '').trim();
          return {
            ...t,
            status: 'completed' as const,
            notes: newNotes,
            completed: new Date().toISOString()
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));

      // Synchronize each bulk completed task across all links (RevisionPlanner, Grind Clock, 24h Clock, Flow)
      tasksToComplete.forEach(t => {
        syncTaskCompletionAcrossAllLinks(
          {
            id: t.id,
            title: t.title,
            cleanTitle: t.cleanTitle || t.title,
            chapterName: t.chapterName,
            subjectCode: t.subjectCode
          },
          true,
          { selectedDate: t.due ? t.due.split('T')[0] : undefined }
        );
      });

      setSelectedTaskIds([]);
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Create clean tasks to write
      const updatedTasksMap = new Map<string, GoogleTask>();
      const cleanTasksToWrite = tasks.map(t => {
        if (taskIdsToComplete.includes(t.id)) {
          let newNotes = t.notes || '';
          newNotes = newNotes.replace(/STATUS:\s*UNACHIEVED/gi, '').trim();
          const cleanT: GoogleTask = {
            id: t.id,
            title: t.title,
            notes: newNotes,
            status: 'completed',
            completed: new Date().toISOString(),
            listId: t.listId || selectedListId || 'cloud-default',
            ...(t.due ? { due: t.due } : {}),
            ...(t.priority ? { priority: t.priority } : {}),
            ...(t.subjectCode ? { subjectCode: t.subjectCode } : {})
          };
          updatedTasksMap.set(t.id, cleanT);
          return cleanT;
        }
        return t;
      });

      // Update state and local storage instantly (write-through cache)
      setTasks(cleanTasksToWrite);
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(cleanTasksToWrite));

      // Synchronize each bulk completed task across all links (RevisionPlanner, Grind Clock, 24h Clock, Flow)
      tasksToComplete.forEach(t => {
        syncTaskCompletionAcrossAllLinks(
          {
            id: t.id,
            title: t.title,
            cleanTitle: t.cleanTitle || t.title,
            chapterName: t.chapterName,
            subjectCode: t.subjectCode
          },
          true,
          { selectedDate: t.due ? t.due.split('T')[0] : undefined }
        );
      });

      // Async write to Firestore in parallel
      const promises = tasksToComplete.map(async (t) => {
        const cleanT = updatedTasksMap.get(t.id);
        if (cleanT) {
          await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), cleanT);
        }
      });
      await Promise.all(promises);
      setSyncStatus('Synced');
      setSelectedTaskIds([]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to mark selected tasks complete in the cloud.');
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId: string, title: string) => {
    if (!isLocalMode && !user) return;

    setConfirmModal({
      show: true,
      title: 'Delete Task Permanently?',
      description: `Are you absolutely sure you want to permanently delete "${title}"? This will wipe the record completely and cannot be undone.`,
      type: 'delete',
      extraData: { taskId }
    });
  };

  // Convert a target into "Unachieved" status for accurate daily logs
  const handleMarkUnachieved = async (task: any) => {
    await executeMarkUnachieved(task);
  };

  // Rearrange task order on the selected date
  const handleMoveTaskOrder = (task: GoogleTask, direction: 'up' | 'down') => {
    // Switch to manual mode so rearrange results are active and visible
    if (sortBy !== 'manual') {
      setSortBy('manual');
    }

    const currentList = [...sortedActiveTasks];
    const currentIndex = currentList.findIndex(t => t.id === task.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const targetTask = currentList[targetIndex];

    const updatedPositions: Record<string, number> = {};
    currentList.forEach((t, i) => {
      updatedPositions[t.id] = i * 10;
    });

    const temp = updatedPositions[task.id];
    updatedPositions[task.id] = updatedPositions[targetTask.id];
    updatedPositions[targetTask.id] = temp;

    setTasks(prevTasks => {
      const updated = prevTasks.map(t => {
        if (updatedPositions[t.id] !== undefined) {
          return { ...t, position: updatedPositions[t.id] };
        }
        return t;
      });

      if (isLocalMode) {
        triggerLocalSaveStatus();
        localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updated));
      } else {
        triggerLocalSaveStatus();
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
        localStorage.setItem('practca_google_tasks_positions', JSON.stringify(
          updated.reduce((acc, t) => {
            if (t.position !== undefined) acc[t.id] = t.position;
            return acc;
          }, {} as Record<string, number>)
        ));
      }
      return updated;
    });
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    setDragOverTaskId(null);
    setDropPlacement(null);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTaskId && draggedTaskId !== taskId) {
      setDragOverTaskId(taskId);
      const rect = e.currentTarget.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      if (offset < rect.height / 2) {
        setDropPlacement('top');
      } else {
        setDropPlacement('bottom');
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    setDropPlacement(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    const placement = dropPlacement;
    
    setDraggedTaskId(null);
    setDragOverTaskId(null);
    setDropPlacement(null);

    if (!draggedId || draggedId === targetId) return;

    // Switch to manual mode so rearrange results are active and visible
    if (sortBy !== 'manual') {
      setSortBy('manual');
    }

    const currentList = [...sortedActiveTasks];
    const draggedIndex = currentList.findIndex(t => t.id === draggedId);
    if (draggedIndex === -1) return;

    const [removed] = currentList.splice(draggedIndex, 1);
    
    let newTargetIndex = currentList.findIndex(t => t.id === targetId);
    if (newTargetIndex === -1) return;
    
    if (placement === 'bottom') {
      newTargetIndex += 1;
    }
    
    currentList.splice(newTargetIndex, 0, removed);

    // Re-calculate positions
    const updatedPositions: Record<string, number> = {};
    currentList.forEach((t, i) => {
      updatedPositions[t.id] = i * 10;
    });

    setTasks(prevTasks => {
      const updated = prevTasks.map(t => {
        if (updatedPositions[t.id] !== undefined) {
          return { ...t, position: updatedPositions[t.id] };
        }
        return t;
      });

      if (isLocalMode) {
        triggerLocalSaveStatus();
        localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updated));
      } else {
        triggerLocalSaveStatus();
        localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updated));
        localStorage.setItem('practca_google_tasks_positions', JSON.stringify(
          updated.reduce((acc, t) => {
            if (t.position !== undefined) acc[t.id] = t.position;
            return acc;
          }, {} as Record<string, number>)
        ));
      }
      return updated;
    });

    // If authenticated in Cloud Mode, update positions in Firestore
    if (!isLocalMode && user?.uid) {
      try {
        currentList.forEach(t => {
          if (updatedPositions[t.id] !== undefined) {
            setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), { position: updatedPositions[t.id] }, { merge: true }).catch(() => {});
          }
        });
      } catch (err) {
        console.error("Error updating task positions in Firestore:", err);
      }
    }
  };

  // Reschedule/Move a target to custom date while keeping current day's record as Unachieved
  const handleMoveToCustomDate = (task: any, targetDateStr: string) => {
    if (!targetDateStr) return;

    setConfirmModal({
      show: true,
      title: 'Move Target to Another Day?',
      description: `This marks today's goal as "Unachieved" (to keep today's stats at realistic <100% rate) and schedules a copy for ${getFriendlyDateLabel(targetDateStr)} (${targetDateStr}).`,
      type: 'create',
      extraData: { action: 'rescheduleSingle', task, targetDateStr }
    });
  };

  const handleAutoProvisionStudyTracker = async () => {
    if (isLocalMode) {
      const newListTitle = '🎓 Local practACE Board Goals';
      if (taskLists.some(l => l.title === newListTitle)) {
        const found = taskLists.find(l => l.title === newListTitle);
        if (found) setSelectedListId(found.id);
        return;
      }
      const newListObj: GoogleTaskList = {
        id: `local-list-auto`,
        title: newListTitle
      };
      const updatedLists = [newListObj, ...taskLists];
      setTaskLists(updatedLists);
      localStorage.setItem(getLevelScopedKey('practca_local_task_lists'), JSON.stringify(updatedLists));
      setSelectedListId(newListObj.id);
      setConfirmModal({
        show: true,
        title: 'Board List Created Locally!',
        description: 'A local offline Board named "🎓 Local practACE Board Goals" is successfully provisioned and set as active list.',
        type: 'provision_local'
      });
      return;
    }
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);
    const newListId = `cloud-list-auto`;
    const pathList = `users/${user.uid}/taskLists/${newListId}`;
    try {
      const newListObj: GoogleTaskList = {
        id: newListId,
        title: '🎓 practACE Board Goals'
      };
      try {
        await setDoc(firestoreDoc(db, 'users', user.uid, 'taskLists', newListId), newListObj);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, pathList);
      }
      setTaskLists(prev => [newListObj, ...prev]);
      setSelectedListId(newListId);
      setConfirmModal({
        show: true,
        title: 'Board List Created!',
        description: 'A tailored study board named "🎓 practACE Board Goals" is successfully provisioned in the cloud under your email address.',
        type: 'provision_cloud'
      });
    } catch (err) {
      setErrorMsg('Failed to auto-provision tracker list.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddChapterGoal = async (chapterName: string, subCode: string) => {
    if (subCode && isSubjectLockedAfterFinalExam(subCode)) {
      setAutoBatchBannerMsg(
        `🔒 [${subCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    if (!selectedListId) {
      setErrorMsg("Please select or create an active goal board first.");
      return;
    }
    const title = chapterName === 'General / Entire Subject' ? 'Comprehensive Subject Revision' : chapterName;
    const notes = chapterName === 'General / Entire Subject' ? '' : `Chapter: ${chapterName}`;
    
    const key = `${subCode}-${chapterName}`;
    setAddedChapterKey(key);
    setTimeout(() => {
      setAddedChapterKey(null);
    }, 1550);

    await executeCreateTask(title, notes, selectedDate, 'Revision', subCode);
  };

  // Load and sync 24-Hour Target Clock slots for `selectedDate`
  useEffect(() => {
    const loadDayClockSlots = () => {
      try {
        const raw = localStorage.getItem(`practca_24h_target_clock_${selectedDate}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setTargetClockSlotsForDay(parsed.sort((a: any, b: any) => (a.startMinutes || 0) - (b.startMinutes || 0)));
            return;
          }
        }
      } catch (e) {}
      setTargetClockSlotsForDay([]);
    };

    loadDayClockSlots();
    window.addEventListener('practca_target_clock_updated', loadDayClockSlots);
    window.addEventListener('practca_target_clock_durations_updated', loadDayClockSlots);
    window.addEventListener('practca_active_task_duration_adjusted', loadDayClockSlots);
    window.addEventListener('storage', loadDayClockSlots);
    return () => {
      window.removeEventListener('practca_target_clock_updated', loadDayClockSlots);
      window.removeEventListener('practca_target_clock_durations_updated', loadDayClockSlots);
      window.removeEventListener('practca_active_task_duration_adjusted', loadDayClockSlots);
      window.removeEventListener('storage', loadDayClockSlots);
    };
  }, [selectedDate]);

  const minutesToHHMM = (mins: number): string => {
    const clamped = ((Math.round(mins) % 1440) + 1440) % 1440;
    const h = Math.floor(clamped / 60);
    const m = clamped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const parseStartTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || typeof timeStr !== 'string') return 360;
    const parts = timeStr.split(':');
    const h = parseInt(parts[0] || '6', 10);
    const m = parseInt(parts[1] || '0', 10);
    if (isNaN(h) || isNaN(m)) return 360;
    return Math.max(0, Math.min(1380, h * 60 + m));
  };

  const isFinalSprintOr15DayMilestone = (cp: UserCheckpoint | null | undefined): boolean => {
    if (!cp) return false;
    const cycle = String(cp.revisionCycle || '').toLowerCase();
    const title = String(cp.customTitle || '').toLowerCase();
    return (
      cycle.includes('final') ||
      cycle.includes('1.5') ||
      title.includes('1.5 day') ||
      title.includes('final revision') ||
      title.includes('final sprint')
    );
  };

  // Helper: Extract all underlying chapters from a milestone checkpoint
  const extractMilestoneUnderlyingChapters = (cp: UserCheckpoint): { subjectCode: SubjectId; chapterName: string }[] => {
    const isSub = cp.subjectId !== 'CUSTOM';
    const rawChapters = (cp.selectedChapters && cp.selectedChapters.length > 0)
      ? cp.selectedChapters
      : (isSub ? getMilestoneSubjectChapters(cp.subjectId as SubjectId) : []);
    const doneSet = new Set(cp.completedChapters || []);

    const pendingRaw = rawChapters.filter(ch => !doneSet.has(ch));
    const chaptersToUse = pendingRaw.length > 0 ? pendingRaw : rawChapters;

    return chaptersToUse.map(rawChap => {
      const bracketMatch = rawChap.match(/^\[([A-Za-z]+)\]\s*(.+)$/);
      const subCode: SubjectId = bracketMatch
        ? (bracketMatch[1] as SubjectId)
        : (cp.subjectId !== 'CUSTOM' ? (cp.subjectId as SubjectId) : 'FR');
      const cleanName = (bracketMatch ? bracketMatch[2] : rawChap).trim();
      return { subjectCode: subCode, chapterName: cleanName };
    }).filter(item => item.chapterName && item.chapterName !== 'General / Entire Subject');
  };

  // QUICK-SELECT ALL UNDERLYING CHAPTERS OF A MILESTONE AS TODAY'S ACTIVE TASKS
  const handleQuickSelectMilestoneChapters = async (
    cp: UserCheckpoint,
    alsoAutoBatch90m: boolean = false
  ) => {
    const targetListId = selectedListId || (taskLists[0]?.id ?? 'local-default');
    if (!selectedListId && taskLists.length > 0) {
      setSelectedListId(taskLists[0].id);
    }

    const underlying = extractMilestoneUnderlyingChapters(cp);
    if (underlying.length === 0) {
      setErrorMsg('This milestone has no underlying chapters to quick-select.');
      return;
    }

    const relevance: 'General' | 'Revision' | 'Final Revision' =
      isFinalSprintOr15DayMilestone(cp) ? 'Final Revision' : 'Revision';
    const emoji = relevance === 'Final Revision' ? '🔴' : '🟡';

    const newTasksToInsert: GoogleTask[] = [];
    const seenInBatch = new Set<string>();
    let skippedDuplicates = 0;
    const baseTime = Date.now();

    underlying.forEach((item, idx) => {
      const canonId = getTaskCanonicalChapterIdentity(item.subjectCode, item.chapterName);
      if (seenInBatch.has(canonId) || isChapterAlreadyOnDate(item.subjectCode, item.chapterName, selectedDate, tasks)) {
        skippedDuplicates++;
        return; // Already scheduled on `selectedDate` or duplicate in batch
      }
      seenInBatch.add(canonId);

      const fullTitle = `${emoji} [${relevance}] [${item.subjectCode}] ${item.chapterName}`;
      const initialSlabMins = getRecommendedChapterSlabMinutes(item.subjectCode, item.chapterName, item.chapterName, relevance);
      const fullNotes = `Relevance: ${relevance}\nSubject: ${item.subjectCode}\nChapter: ${item.chapterName}\nMilestone: ${cp.customTitle || cp.subjectId}\nMilestoneId: ${cp.id}\nTargetDurationMinutes: ${initialSlabMins}`;
      newTasksToInsert.push({
        id: `local-task-${baseTime}-${idx}`,
        title: fullTitle,
        notes: fullNotes,
        due: selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString(),
        status: 'needsAction',
        listId: targetListId,
        subjectCode: item.subjectCode,
        chapterName: item.chapterName,
        milestoneId: cp.id,
        targetDurationMinutes: initialSlabMins
      });
    });

    if (newTasksToInsert.length > 0) {
      pushPlannerUndoSnapshot(
        `Quick-Loaded ${newTasksToInsert.length} chapters (${cp.customTitle || cp.subjectId})`,
        [selectedDate]
      );
    }

    const combinedTasks = [...newTasksToInsert, ...tasks];
    if (newTasksToInsert.length > 0) {
      triggerLocalSaveStatus();
      setTasks(combinedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(combinedTasks));
      window.dispatchEvent(new Event('practca_tasks_updated'));
    }

    // Select all tasks belonging to this milestone so user can also immediately act on or auto-batch them
    const milestoneCanonSet = new Set(underlying.map(u => getTaskCanonicalChapterIdentity(u.subjectCode, u.chapterName)));
    const matchingTaskIds = combinedTasks
      .filter(t => {
        const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
        if (tDate !== selectedDate || t.status === 'completed') return false;
        return milestoneCanonSet.has(extractTaskCanonicalIdentity(t));
      })
      .map(t => t.id);

    setSelectedTaskIds(matchingTaskIds);

    const feedbackLabel = newTasksToInsert.length > 0
      ? `✓ Added ${newTasksToInsert.length}${skippedDuplicates > 0 ? ` (${skippedDuplicates} dup skipped)` : ''}!`
      : `✓ All ${underlying.length} already on ${getFriendlyDateLabel(selectedDate)}`;

    setQuickSelectMilestoneFeedback(prev => ({ ...prev, [cp.id]: feedbackLabel }));
    setTimeout(() => {
      setQuickSelectMilestoneFeedback(prev => {
        const copy = { ...prev };
        delete copy[cp.id];
        return copy;
      });
    }, 3500);

    if (alsoAutoBatch90m) {
      handleAutoBatchChaptersInto90MinClock(
        underlying.map((u, idx) => ({
          id: newTasksToInsert[idx]?.id || `ms_${u.subjectCode}_${idx}`,
          title: u.chapterName,
          cleanTitle: u.chapterName,
          chapterName: u.chapterName,
          subjectCode: u.subjectCode,
          relevance
        }))
      );
    } else {
      setAutoBatchBannerMsg(
        newTasksToInsert.length > 0
          ? `⚡ Quick-Selected ${newTasksToInsert.length} chapters from "${cp.customTitle || cp.subjectId}" into ${getFriendlyDateLabel(selectedDate)}${skippedDuplicates > 0 ? ` (${skippedDuplicates} already-scheduled duplicate${skippedDuplicates === 1 ? '' : 's'} skipped)` : ''}!`
          : `ℹ️ All ${underlying.length} chapters from "${cp.customTitle || cp.subjectId}" are already scheduled on ${getFriendlyDateLabel(selectedDate)} (duplicate add prevented).`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 5000);
    }
  };

  // Listen for Quick-Select or Milestone Multi-Day Auto-Batch events triggered from RoadmapDashboard
  useEffect(() => {
    const onExternalQuickSelect = (e: any) => {
      const cp = e?.detail?.checkpoint as UserCheckpoint | undefined;
      if (cp) {
        handleQuickSelectMilestoneChapters(cp, false);
      }
    };
    const onExternalOpenMilestoneAutoBatch = (e: any) => {
      const cp = e?.detail?.checkpoint as UserCheckpoint | undefined;
      if (cp) {
        setSelectedMilestoneId(cp.id);
        setSelectedWorkloadDayFilter('ALL');
        setViewFormat('daily');
        setAutoBatchStudioMode('milestone_multiday');
        setAllocatorViewTab('visual_days');
        setHideWorkloadTopRibbon(true);
        setShowAutoBatchStudio(true);
        setTracedFromRoadmap(true);
      }
    };
    window.addEventListener('practca_quick_select_milestone', onExternalQuickSelect as EventListener);
    window.addEventListener('practca_open_milestone_autobatch', onExternalOpenMilestoneAutoBatch as EventListener);
    return () => {
      window.removeEventListener('practca_quick_select_milestone', onExternalQuickSelect as EventListener);
      window.removeEventListener('practca_open_milestone_autobatch', onExternalOpenMilestoneAutoBatch as EventListener);
    };
  }, [tasks, selectedDate, selectedListId]);

  // Helper: Determine default ICAI ABC importance level for a chapter
  const getDefaultChapterImportance = (subCode: SubjectId, chapterName: string): 'High' | 'Medium' | 'Low' => {
    const lower = chapterName.toLowerCase();
    const highKeywords = [
      'financial instruments', 'consolidation', 'business combination', 'ind as 115', 'revenue',
      'ind as 116', 'leases', 'ind as 12', 'income taxes', 'ind as 19', 'employee benefits',
      'ind as 36', 'impairment', 'ind as 102', 'share based', 'ind as 33', 'earnings per share',
      'analysis of fs', 'capital budgeting', 'security valuation', 'portfolio management',
      'derivatives', 'foreign exchange', 'forex', 'business valuation', 'mergers', 'interest rate risk',
      'quality control', 'professional ethics', 'audit evidence', 'reporting', 'group audits',
      'banks', 'due diligence', 'materiality', 'profits and gains', 'pgbp', 'capital gains',
      'various entities', 'trusts', 'non resident', 'transfer pricing', 'deduction, collection',
      'assessment procedure', 'appeals', 'supply under gst', 'place, time', 'place of supply',
      'value of supply', 'input tax credit', 'itc', 'refund', 'demand', 'valuation under the customs',
      'integrated case scenario'
    ];
    const lowKeywords = [
      'applicability of ind as', 'conceptual framework', 'ethical duty', 'accounting & tech',
      'ind as 10 ', 'events after', 'ind as 24', 'related party', 'startup finance', 'securitization',
      'related services', 'review of financial', 'basic concepts', 'do not form part',
      'model tax', 'latest developments', 'electronic commerce', 'job work', 'warehousing'
    ];
    if (highKeywords.some(k => lower.includes(k))) return 'High';
    if (lowKeywords.some(k => lower.includes(k))) return 'Low';
    return 'Medium';
  };

  // Compute Historical Time Spent per Chapter & Last 1 Week (7-Day) Average Study Time
  const milestoneStudyAnalytics = React.useMemo(() => {
    const spentByChapterMap: Record<string, number> = {};
    let last7DaysTotalMins = 0;
    const activeDaysSet = new Set<string>();

    const now = new Date();
    const sevenDaysAgoMs = now.getTime() - 7 * 24 * 60 * 60 * 1000;

    // 1. Scan Focus Sessions (`practca_focus_sessions`)
    try {
      const rawFocus = localStorage.getItem('practca_focus_sessions');
      if (rawFocus) {
        const focusList = JSON.parse(rawFocus);
        if (Array.isArray(focusList)) {
          focusList.forEach((sess: any) => {
            const dur = Number(sess.duration) || 0;
            if (dur <= 0) return;
            const ts = sess.timestamp ? new Date(sess.timestamp).getTime() : 0;
            if (ts >= sevenDaysAgoMs && ts <= now.getTime() + 86400000) {
              last7DaysTotalMins += dur;
              const dStr = new Date(sess.timestamp).toISOString().split('T')[0];
              activeDaysSet.add(dStr);
            }
            const sub = (sess.subjectId || 'FR') as SubjectId;
            const rawChap = sess.chapterName || sess.taskTitle || '';
            if (rawChap) {
              const canon = getCanonicalChapterKey(sub, rawChap);
              const k1 = `${sub}::${canon.toLowerCase()}`;
              const k2 = `${sub}::${rawChap.trim().toLowerCase()}`;
              spentByChapterMap[k1] = (spentByChapterMap[k1] || 0) + dur;
              if (k2 !== k1) spentByChapterMap[k2] = (spentByChapterMap[k2] || 0) + dur;
            }
          });
        }
      }
    } catch (e) {}

    // 2. Scan Revision Planner Logs (`practca_revision_planner_logs`)
    try {
      const rawRevLogs = localStorage.getItem('practca_revision_planner_logs');
      if (rawRevLogs) {
        const revLogs = JSON.parse(rawRevLogs);
        if (Array.isArray(revLogs)) {
          revLogs.forEach((log: any) => {
            const dur = Number(log.durationMinutes) || 0;
            if (dur <= 0) return;
            const ts = log.timestamp ? new Date(log.timestamp).getTime() : 0;
            // If focus sessions didn't already capture this timestamp, include in 7-day check if last7DaysTotalMins is 0
            if (last7DaysTotalMins === 0 && ts >= sevenDaysAgoMs && ts <= now.getTime() + 86400000) {
              last7DaysTotalMins += dur;
              const dStr = new Date(log.timestamp).toISOString().split('T')[0];
              activeDaysSet.add(dStr);
            }
            const sub = (log.subjectId || 'FR') as SubjectId;
            const rawChap = log.chapterName || '';
            if (rawChap) {
              const canon = getCanonicalChapterKey(sub, rawChap);
              const k1 = `${sub}::${canon.toLowerCase()}`;
              // Take max of focus vs revision logs or add if not present
              spentByChapterMap[k1] = Math.max(spentByChapterMap[k1] || 0, dur);
            }
          });
        }
      }
    } catch (e) {}

    // 3. Also check per-subject revision planner hours (`practca_revision_planner_${subId}`)
    levelSubjectIds.forEach(subId => {
      try {
        const rawSub = localStorage.getItem(`practca_revision_planner_${subId}`);
        if (rawSub) {
          const parsed = JSON.parse(rawSub);
          const chaps = parsed?.chapters || {};
          Object.keys(chaps).forEach(chName => {
            const cObj = chaps[chName] || {};
            let totalHrs = 0;
            ['rev1', 'rev2', 'rev3', 'rev1.5'].forEach(rk => {
              const h = parseFloat(cObj[rk]?.hours || '0');
              if (!isNaN(h) && h > 0) totalHrs += h;
            });
            if (totalHrs > 0) {
              const mins = Math.round(totalHrs * 60);
              const canon = getCanonicalChapterKey(subId, chName);
              const k = `${subId}::${canon.toLowerCase()}`;
              spentByChapterMap[k] = Math.max(spentByChapterMap[k] || 0, mins);
            }
          });
        }
      } catch (e) {}
    });

    const fallbackDailyGoal = (() => {
      try {
        const g = parseInt(localStorage.getItem('practca_daily_goal') || '270', 10);
        return !isNaN(g) && g >= 60 ? g : 270;
      } catch (e) {
        return 270;
      }
    })();

    // Average study time over the last 7 days (or fallback to daily goal if no sessions logged in last 7 days)
    const rolling7DayAvgMins = last7DaysTotalMins > 0
      ? Math.max(60, Math.round(last7DaysTotalMins / 7))
      : fallbackDailyGoal;

    const activeDayAvgMins = activeDaysSet.size > 0
      ? Math.max(60, Math.round(last7DaysTotalMins / activeDaysSet.size))
      : fallbackDailyGoal;

    return {
      spentByChapterMap,
      last7DaysTotalMins,
      last7DaysActiveDays: activeDaysSet.size,
      rolling7DayAvgMins,
      activeDayAvgMins,
      fallbackDailyGoal
    };
  }, [tasks, showAutoBatchStudio, selectedMilestoneId]);

  // Compute the Smart Multi-Day Auto-Allocation & Custom Time-Batch Plan for the Active Milestone
  const milestoneAutoAllocationPlan = React.useMemo(() => {
    const cp = activeMilestoneCheckpoint;
    if (!cp) return null;

    const underlying = extractMilestoneUnderlyingChapters(cp);
    const is15SprintCp = isFinalSprintOr15DayMilestone(cp);
    const masterExamDate = getMasterFinalExamDate();

    // Preserve the milestone's own targetDate. When a 1.5-Day Sprint is on or after the exam start date (`masterExamDate`),
    // it is for the Final Exam of that subject and `targetStr` IS that subject's Final Exam date (e.g. 2 Nov for FR).
    const targetStr = cp.targetDate || cp.startDate || milestoneAllocStartDate || getSystemLocalDateString();
    const rawStartStr = cp.startDate || milestoneAllocStartDate || getSystemLocalDateString();
    const startStr = is15SprintCp
      ? (rawStartStr <= targetStr ? rawStartStr : getOneDayBeforeExamDate(targetStr))
      : rawStartStr;
    const isSubjectFinalExam = is15SprintCp && targetStr >= masterExamDate;

    // Calculate calendar days between startStr and targetStr (inclusive)
    const startDateObj = new Date(`${startStr}T00:00:00`);
    const targetDateObj = new Date(`${targetStr}T00:00:00`);
    const rawDiffDays = Math.round((targetDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const calculatedDaysUntilMilestone = Math.max(1, rawDiffDays);
    const numDays = milestoneCustomDaysOverride !== null && milestoneCustomDaysOverride >= 1
      ? Math.min(60, milestoneCustomDaysOverride)
      : Math.min(60, calculatedDaysUntilMilestone);

    // Build array of date strings for the milestone horizon (for 1.5-Day Sprint, ensure the last day is targetStr = Subject Final Exam Date)
    const allocationDates: string[] = [];
    if (is15SprintCp && milestoneCustomDaysOverride !== null && milestoneCustomDaysOverride >= 1) {
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(targetDateObj);
        d.setDate(targetDateObj.getDate() - i);
        const yr = d.getFullYear();
        const mn = String(d.getMonth() + 1).padStart(2, '0');
        const dy = String(d.getDate()).padStart(2, '0');
        allocationDates.push(`${yr}-${mn}-${dy}`);
      }
    } else {
      for (let i = 0; i < numDays; i++) {
        const d = new Date(startDateObj);
        d.setDate(startDateObj.getDate() + i);
        const yr = d.getFullYear();
        const mn = String(d.getMonth() + 1).padStart(2, '0');
        const dy = String(d.getDate()).padStart(2, '0');
        allocationDates.push(`${yr}-${mn}-${dy}`);
      }
    }

    // Revision cycle multiplier for default time needed
    const isFinal15DayRev = isFinalSprintOr15DayMilestone(cp) || milestoneUniformRelevance === 'Final Revision';
    const cycleMultiplier =
      cp.revisionCycle === '1st Revision'
        ? 1.25
        : cp.revisionCycle === '3rd Revision' || cp.revisionCycle === 'Final Sprint' || isFinal15DayRev
          ? 0.75
          : 1.0;

    // Uniform baseline relevance across all chapters in the milestone:
    // - If the milestone is Final Revision (1.5 Day Revision) or set to Final Revision, ALL chapters are strictly on 'Final Revision' (F) — impossible to mix F and R.
    // - Otherwise, all chapters maintain the same uniform relevance (default 'Revision', or user's selected uniform G/R) unless individually overridden.
    const defaultUniformRelevance: 'General' | 'Revision' | 'Final Revision' = isFinal15DayRev
      ? 'Final Revision'
      : milestoneUniformRelevance || 'Revision';

    // Enrich each chapter with Time Spent, Importance, Relevance, and Recommended/Customized Time Needed
    const enrichedChapters = underlying.map((item, idx) => {
      const configKey = `${item.subjectCode}::${item.chapterName}`;
      const custom = chapterCustomConfig[configKey] || {};
      const canon = getCanonicalChapterKey(item.subjectCode, item.chapterName);
      const spentMins =
        milestoneStudyAnalytics.spentByChapterMap[`${item.subjectCode}::${canon.toLowerCase()}`] ||
        milestoneStudyAnalytics.spentByChapterMap[`${item.subjectCode}::${item.chapterName.toLowerCase()}`] ||
        0;

      const defaultImp = getDefaultChapterImportance(item.subjectCode, item.chapterName);
      const importance: 'High' | 'Medium' | 'Low' = custom.importance || defaultImp;

      // Enforce 1.5-day Final Revision rule: if Final Revision is active, every chapter target is strictly 'Final Revision' (no F/R mixing)
      const relevance: 'General' | 'Revision' | 'Final Revision' = isFinal15DayRev
        ? 'Final Revision'
        : (custom.relevance || defaultUniformRelevance);

      // Base time needed from importance + cycle multiplier + past time spent adjustment (strict 15-minute slabs)
      const baseByImp = importance === 'High' ? 120 : importance === 'Medium' ? 90 : 60;
      let autoRecommendedMins = roundToNearest15MinSlab(baseByImp * cycleMultiplier, 30);
      if (spentMins === 0) {
        autoRecommendedMins += 15; // Untouched chapter gets +15m extra focus buffer
      } else if (spentMins >= baseByImp * 1.5) {
        autoRecommendedMins = Math.max(30, autoRecommendedMins - 15); // Strong familiarity already built
      }

      const timeNeededMins = custom.timeNeededMins !== undefined
        ? (custom.clubAllocationBasis === 'custom_adjusted'
            ? Math.max(1, Number(custom.timeNeededMins) || 90)
            : roundToNearest15MinSlab(Number(custom.timeNeededMins) || 90, 15))
        : autoRecommendedMins;

      const isUnassigned = custom.assignedDate === 'UNASSIGNED';

      return {
        index: idx,
        configKey,
        subjectCode: item.subjectCode,
        chapterName: item.chapterName,
        spentMins,
        importance,
        relevance,
        autoRecommendedMins,
        timeNeededMins,
        isCustomTime: custom.timeNeededMins !== undefined,
        isCustomImportance: custom.importance !== undefined,
        isCustomRelevance: !isFinal15DayRev && custom.relevance !== undefined,
        isUnassigned,
        manualAssignedDate:
          !isUnassigned && custom.assignedDate && allocationDates.includes(custom.assignedDate)
            ? custom.assignedDate
            : undefined,
        clubGroupId: isUnassigned ? undefined : custom.clubGroupId,
        clubTotalMinutes: isUnassigned ? undefined : custom.clubTotalMinutes,
        clubOrder: isUnassigned ? undefined : custom.clubOrder,
        clubAllocationBasis: isUnassigned ? undefined : custom.clubAllocationBasis,
        clubPriorLoggedMinutes: isUnassigned ? undefined : custom.clubPriorLoggedMinutes
      };
    });

    // Ensure every batch in enrichedChapters strictly sums to its clubTotalMinutes (and uses 15m slabs unless custom_adjusted)
    const msClubGroups = new Map<string, typeof enrichedChapters>();
    enrichedChapters.forEach(ch => {
      if (ch.clubGroupId) {
        if (!msClubGroups.has(ch.clubGroupId)) msClubGroups.set(ch.clubGroupId, []);
        msClubGroups.get(ch.clubGroupId)!.push(ch);
      }
    });
    msClubGroups.forEach(peers => {
      if (peers.length < 2) return;
      const rawTotal = peers[0].clubTotalMinutes || peers.reduce((a, p) => a + p.timeNeededMins, 0);
      const currentSum = peers.reduce((a, p) => a + p.timeNeededMins, 0);
      const hasCustom = peers.some(p => p.clubAllocationBasis === 'custom_adjusted');
      const hasNonSlab = peers.some(p => p.timeNeededMins % 15 !== 0);
      if (currentSum !== rawTotal || (!hasCustom && hasNonSlab)) {
        const targetTotal = hasCustom ? rawTotal : roundToNearest15MinSlab(rawTotal, peers.length * 15);
        const derived = allocateProportionateClubDurations(
          peers.map(p => ({
            id: p.configKey,
            subjectCode: p.subjectCode,
            chapterName: p.chapterName,
            title: p.chapterName,
            relevance: p.relevance === 'Final Revision' ? 'final_revision' : p.relevance === 'General' ? 'general' : 'revision'
          })),
          targetTotal
        );
        const dMap = new Map(derived.map(d => [d.id, d.allocatedMinutes]));
        peers.forEach(p => {
          p.timeNeededMins = dMap.get(p.configKey) ?? p.timeNeededMins;
          p.clubTotalMinutes = targetTotal;
        });
      }
    });

    // Sort chapters according to selected strategy for auto-allocation
    const impWeight = { High: 3, Medium: 2, Low: 1 };
    const sortedForAllocation = [...enrichedChapters].sort((a, b) => {
      if (milestoneSortStrategy === 'importance_and_least_spent') {
        const diffImp = impWeight[b.importance] - impWeight[a.importance];
        if (diffImp !== 0) return diffImp;
        if (a.spentMins !== b.spentMins) return a.spentMins - b.spentMins; // Least time spent first
        return a.index - b.index;
      }
      if (milestoneSortStrategy === 'importance_only') {
        const diffImp = impWeight[b.importance] - impWeight[a.importance];
        if (diffImp !== 0) return diffImp;
        return a.index - b.index;
      }
      if (milestoneSortStrategy === 'least_spent_first') {
        if (a.spentMins !== b.spentMins) return a.spentMins - b.spentMins;
        const diffImp = impWeight[b.importance] - impWeight[a.importance];
        if (diffImp !== 0) return diffImp;
        return a.index - b.index;
      }
      return a.index - b.index;
    });

    const totalTimeNeededMins = enrichedChapters.reduce((acc, c) => acc + c.timeNeededMins, 0);
    const baseDailyStudyMins = milestoneCustomDailyStudyMins !== null
      ? Math.max(45, milestoneCustomDailyStudyMins)
      : milestoneStudyAnalytics.rolling7DayAvgMins;

    // Effective daily target capacity:
    // - For a 1.5-Day Final Sprint (`is15SprintCp` with >= 2 days), the last day (`targetStr`) is a 0.5-day morning sprint before the 2:00 PM exam,
    //   so effective total study days = `(numDays - 0.5)`.
    const effectiveStudyDaysWeight = is15SprintCp && numDays >= 2 ? Math.max(1, numDays - 0.5) : Math.max(1, numDays);
    const minRequiredPerDayToFinish = Math.ceil(totalTimeNeededMins / effectiveStudyDaysWeight);
    const effectiveDailyCapMins = milestonePacingMode === 'achieve_by_deadline'
      ? Math.max(minRequiredPerDayToFinish, Math.min(baseDailyStudyMins, Math.round(minRequiredPerDayToFinish * 1.15)))
      : baseDailyStudyMins;

    const getCapForAllocationDay = (dStr: string): number => {
      if (is15SprintCp && numDays >= 2 && dStr === targetStr) {
        return Math.max(90, Math.round(effectiveDailyCapMins * 0.55));
      }
      return effectiveDailyCapMins;
    };

    // Allocate chapters across `allocationDates`
    const dayBuckets: Record<string, typeof enrichedChapters> = {};
    const dayLoadMins: Record<string, number> = {};
    allocationDates.forEach(d => {
      dayBuckets[d] = [];
      dayLoadMins[d] = 0;
    });

    // First place manually assigned chapters
    sortedForAllocation.forEach(ch => {
      if (ch.isUnassigned) return;
      if (ch.manualAssignedDate && dayBuckets[ch.manualAssignedDate]) {
        dayBuckets[ch.manualAssignedDate].push(ch);
        dayLoadMins[ch.manualAssignedDate] += ch.timeNeededMins;
      }
    });

    // Then auto-allocate remaining chapters sequentially across days respecting daily capacity
    let dayCursor = 0;
    sortedForAllocation.forEach(ch => {
      if (ch.isUnassigned || ch.manualAssignedDate) return;

      if (milestonePacingMode === 'achieve_by_deadline') {
        // Advance cursor if current day already has >=1 chapter and adding this chapter exceeds day's effective cap
        while (
          dayCursor < allocationDates.length - 1 &&
          dayBuckets[allocationDates[dayCursor]].length > 0 &&
          dayLoadMins[allocationDates[dayCursor]] + Math.round(ch.timeNeededMins * 0.55) > getCapForAllocationDay(allocationDates[dayCursor])
        ) {
          dayCursor++;
        }
        const targetDateKey = allocationDates[dayCursor];
        dayBuckets[targetDateKey].push(ch);
        dayLoadMins[targetDateKey] += ch.timeNeededMins;
      } else {
        // Strict daily avg study time mode: find first day with room <= day's cap, else lightest day
        let chosenDate = allocationDates[dayCursor];
        while (
          dayCursor < allocationDates.length - 1 &&
          dayBuckets[allocationDates[dayCursor]].length > 0 &&
          dayLoadMins[allocationDates[dayCursor]] + ch.timeNeededMins > getCapForAllocationDay(allocationDates[dayCursor])
        ) {
          dayCursor++;
          chosenDate = allocationDates[dayCursor];
        }
        dayBuckets[chosenDate].push(ch);
        dayLoadMins[chosenDate] += ch.timeNeededMins;
      }
    });

    // Map back assignedDate onto each chapter
    const assignedDateByConfigKey: Record<string, string> = {};
    allocationDates.forEach(d => {
      dayBuckets[d].forEach(c => {
        assignedDateByConfigKey[c.configKey] = d;
      });
    });

    const parsedStartMins = parseStartTimeToMinutes(autoBatchStartTime);
    const todayStr = getSystemLocalDateString();
    const now = new Date();
    const currentNowMins = Math.ceil((now.getHours() * 60 + now.getMinutes() + 10) / 15) * 15;

    // Build Day-by-Day Batched Clock Blocks Preview based on `milestoneBatchBlockSize`,
    // routing around each day's analyzed Sleep, Breakfast, Lunch, Dinner & Routine blocks!
    const daySchedules = allocationDates.map((dateStr, dIdx) => {
      const chapsForDay = dayBuckets[dateStr] || [];
      const totalMinsForDay = dayLoadMins[dateStr] || 0;
      const dayRationale = analyzeUserDayRationale(dateStr);
      const dayStartMins = Math.max(parsedStartMins, dayRationale.estimatedStudyStartMinutes);
      const anchorStartMins = dateStr === todayStr ? Math.max(dayStartMins, currentNowMins) : dayStartMins;
      const breakGap = autoBatchBreakGap;

      // 1. Construct raw batch items before fitting them into the day's habit/meal/sleep timeline
      const rawBatches: {
        batchTitle: string;
        chapterNames: string[];
        subjectCode: SubjectId;
        subjectsInBatch: SubjectId[];
        durationMinutes: number;
        relevance: 'General' | 'Revision' | 'Final Revision';
        chapters: typeof enrichedChapters;
      }[] = [];

      if (milestoneBatchBlockSize === 'exact_chapter_time') {
        chapsForDay.forEach(ch => {
          const dur = Math.max(15, ch.timeNeededMins);
          const rel: 'General' | 'Revision' | 'Final Revision' = isFinal15DayRev
            ? 'Final Revision'
            : ch.relevance;
          rawBatches.push({
            batchTitle: ch.chapterName,
            chapterNames: [ch.chapterName],
            subjectCode: ch.subjectCode,
            subjectsInBatch: [ch.subjectCode],
            durationMinutes: dur,
            relevance: rel,
            chapters: [ch]
          });
        });
      } else {
        const targetBlockSize = Number(milestoneBatchBlockSize) || 90;
        let currentGroup: typeof enrichedChapters = [];
        let currentGroupMins = 0;

        const flushGroup = (group: typeof enrichedChapters, durMins: number, partLabel?: string) => {
          if (group.length === 0) return;
          const primary = group[0];
          const uniqueSubs = Array.from(new Set(group.map(g => g.subjectCode)));
          const rel: 'General' | 'Revision' | 'Final Revision' = isFinal15DayRev
            ? 'Final Revision'
            : group.some(g => g.relevance === 'Final Revision')
              ? 'Final Revision'
              : group.every(g => g.relevance === 'General')
                ? 'General'
                : primary.relevance || defaultUniformRelevance;

          const finalDur = Math.max(15, durMins);
          const title = group.length === 1
            ? `${primary.chapterName}${partLabel ? ` (${partLabel})` : ''}`
            : `Batch (${group.length} Ch): ${group.map(g => g.chapterName).join(' + ')}`;

          rawBatches.push({
            batchTitle: title,
            chapterNames: group.map(g => g.chapterName),
            subjectCode: primary.subjectCode,
            subjectsInBatch: uniqueSubs,
            durationMinutes: finalDur,
            relevance: rel,
            chapters: group
          });
        };

        chapsForDay.forEach(ch => {
          if (ch.timeNeededMins >= targetBlockSize * 1.5) {
            if (currentGroup.length > 0) {
              flushGroup(currentGroup, currentGroupMins);
              currentGroup = [];
              currentGroupMins = 0;
            }
            let rem = ch.timeNeededMins;
            let part = 1;
            const totalParts = Math.ceil(rem / targetBlockSize);
            while (rem > 0) {
              const chunk = rem >= targetBlockSize * 1.25 ? targetBlockSize : rem;
              flushGroup([ch], chunk, totalParts > 1 ? `Part ${part}/${totalParts}` : undefined);
              rem -= chunk;
              part++;
            }
          } else if (currentGroupMins + ch.timeNeededMins <= targetBlockSize * 1.25) {
            currentGroup.push(ch);
            currentGroupMins += ch.timeNeededMins;
            if (currentGroupMins >= targetBlockSize * 0.85) {
              flushGroup(currentGroup, currentGroupMins);
              currentGroup = [];
              currentGroupMins = 0;
            }
          } else {
            flushGroup(currentGroup, currentGroupMins);
            currentGroup = [ch];
            currentGroupMins = ch.timeNeededMins;
          }
        });

        if (currentGroup.length > 0) {
          flushGroup(currentGroup, currentGroupMins);
        }
      }

      // 2. Fit rawBatches around Sleep, Breakfast, Lunch, Dinner & Routine intervals
      // If this day is the Subject Final Exam Target Day (`isSubjectFinalExam && dateStr === targetStr`),
      // block 1:30 PM – 5:30 PM (810 – 1050 mins) for the ICAI Final Exam (2:00 PM – 5:00 PM) so morning revision finishes before the exam!
      const isFinalExamTargetDay = isSubjectFinalExam && dateStr === targetStr;
      const previewBusyIntervals = isFinalExamTargetDay ? [{ start: 810, end: 1050 }] : [];
      const fitted = fitOrderedItemsToRationaleTimeline(
        rawBatches,
        dayRationale,
        anchorStartMins,
        previewBusyIntervals,
        {
          enforceStudyBreakRule: true,
          minTransitionGap: breakGap,
          protectSleepWindow: true
        }
      );

      const batches: {
        batchTitle: string;
        chapterNames: string[];
        subjectCode: SubjectId;
        subjectsInBatch: SubjectId[];
        durationMinutes: number;
        startMinutes: number;
        endMinutes: number;
        startTime: string;
        endTime: string;
        relevance: 'General' | 'Revision' | 'Final Revision';
        chapters: typeof enrichedChapters;
      }[] = fitted.placedItems.map(({ item, startMinutes: startM, endMinutes: endM, durationMinutes: actualDur }) => ({
        ...item,
        durationMinutes: actualDur,
        startMinutes: startM,
        endMinutes: endM,
        startTime: minutesToHHMM(startM % 1440),
        endTime: minutesToHHMM(endM % 1440)
      }));

      // Place any remaining overflow batches into realistic non-meal, non-sleep gaps
      let ovfCursor = batches.length > 0 ? batches[batches.length - 1].endMinutes : anchorStartMins;
      fitted.unplacedItems.forEach(item => {
        const gap = findRealisticGapOnClock(
          batches,
          item.durationMinutes,
          ovfCursor,
          dateStr === todayStr ? currentNowMins : 0,
          dateStr
        );
        const actualDur = Math.max(15, gap.endMinutes - gap.startMinutes);
        batches.push({
          ...item,
          durationMinutes: actualDur,
          startMinutes: gap.startMinutes,
          endMinutes: gap.endMinutes,
          startTime: minutesToHHMM(gap.startMinutes % 1440),
          endTime: minutesToHHMM(gap.endMinutes % 1440)
        });
        ovfCursor = gap.endMinutes;
      });

      batches.sort((a, b) => a.startMinutes - b.startMinutes);

      return {
        dayNumber: dIdx + 1,
        dateStr,
        isFinalExamTargetDay,
        dayCapMins: getCapForAllocationDay(dateStr),
        chapters: chapsForDay,
        totalMinsForDay,
        batches
      };
    });

    const mappedEnrichedChapters = enrichedChapters.map(c => ({
      ...c,
      assignedDate: c.isUnassigned
        ? 'UNASSIGNED'
        : (assignedDateByConfigKey[c.configKey] || allocationDates[0])
    }));
    const unassignedChapters = mappedEnrichedChapters.filter(c => c.assignedDate === 'UNASSIGNED');
    const allocatedChapters = mappedEnrichedChapters.filter(c => c.assignedDate !== 'UNASSIGNED');
    const allocatedTimeNeededMins = allocatedChapters.reduce((acc, c) => acc + c.timeNeededMins, 0);

    return {
      checkpoint: cp,
      isFinal15DayRev,
      isSubjectFinalExam,
      defaultUniformRelevance,
      calculatedDaysUntilMilestone,
      numDays,
      allocationDates,
      enrichedChapters: mappedEnrichedChapters,
      unassignedChapters,
      allocatedChapters,
      allocatedTimeNeededMins,
      totalTimeNeededMins,
      baseDailyStudyMins,
      effectiveDailyCapMins,
      dailyTargetCapMins: effectiveDailyCapMins,
      daySchedules
    };
  }, [
    activeMilestoneCheckpoint,
    milestoneAllocStartDate,
    milestoneCustomDaysOverride,
    milestoneCustomDailyStudyMins,
    milestoneBatchBlockSize,
    milestoneSortStrategy,
    milestonePacingMode,
    milestoneUniformRelevance,
    chapterCustomConfig,
    milestoneStudyAnalytics,
    autoBatchStartTime,
    autoBatchBreakGap
  ]);

  // Execute Multi-Day Milestone Auto-Allocation & Custom Time-Batching across all days
  const handleExecuteMilestoneMultiDayAutoBatch = async () => {
    if (!milestoneAutoAllocationPlan) {
      setErrorMsg('No active milestone found to auto-allocate.');
      return;
    }

    const { checkpoint: cp, isFinal15DayRev, defaultUniformRelevance, daySchedules, enrichedChapters, numDays, totalTimeNeededMins } = milestoneAutoAllocationPlan;
    if (enrichedChapters.length === 0) {
      setErrorMsg('This milestone has no pending chapters to allocate.');
      return;
    }

    const targetListId = selectedListId || (taskLists[0]?.id ?? 'local-default');
    if (!selectedListId && taskLists.length > 0) {
      setSelectedListId(taskLists[0].id);
    }

    // Capture Multi-Step Undo Snapshot across all affected dates before mutating tasks or 24h clock
    pushPlannerUndoSnapshot(
      `Multi-Day Allocation: ${enrichedChapters.length} ch (${cp.customTitle || cp.subjectId}) across ${numDays}d`,
      daySchedules.map(d => d.dateStr)
    );

    // 1. Update / Insert Daily Planner Tasks across each allocated day (with strict per-day duplicate chapter prevention)
    let updatedTasks = [...tasks];
    const baseTime = Date.now();
    let createdOrMovedCount = 0;
    let skippedSameDayDuplicates = 0;

    // Load durations map to store each chapter's customized timeNeededMins
    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    daySchedules.forEach((daySched, dIdx) => {
      const dateStr = daySched.dateStr;
      const seenCanonOnDay = new Set<string>();

      daySched.chapters.forEach((ch, cIdx) => {
        const chapCanonId = getTaskCanonicalChapterIdentity(ch.subjectCode, ch.chapterName);
        if (seenCanonOnDay.has(chapCanonId)) {
          skippedSameDayDuplicates++;
          return;
        }
        seenCanonOnDay.add(chapCanonId);

        const relevance: 'General' | 'Revision' | 'Final Revision' = isFinal15DayRev
          ? 'Final Revision'
          : (ch.relevance || defaultUniformRelevance);
        const emoji = relevance === 'Final Revision' ? '🔴' : relevance === 'General' ? '🔵' : '🟡';
        const fullTitle = `${emoji} [${relevance}] [${ch.subjectCode}] ${ch.chapterName}`;
        const clubMetaLines = ch.clubGroupId && ch.clubTotalMinutes
          ? `\nClubGroupId: ${ch.clubGroupId}\nClubTotalMinutes: ${ch.clubTotalMinutes}\nClubOrder: ${ch.clubOrder ?? cIdx}\nClubAllocationBasis: ${ch.clubAllocationBasis || (ch.spentMins > 0 ? 'prior_logs' : 'best_judgment')}\nClubPriorLoggedMinutes: ${ch.clubPriorLoggedMinutes ?? ch.spentMins ?? 0}`
          : '';
        // Each sub-target in a club stores its own proportionate duration `ch.timeNeededMins` while `ch.clubTotalMinutes` holds the batch total
        const effectiveTargetDur = ch.timeNeededMins;
        const fullNotes = `Relevance: ${relevance}\nSubject: ${ch.subjectCode}\nChapter: ${ch.chapterName}\nImportance: ${ch.importance}\nTargetDurationMinutes: ${effectiveTargetDur}\nMilestone: ${cp.customTitle || cp.subjectId}\nMilestoneId: ${cp.id}${clubMetaLines}`;

        // 1a. Check if the same canonical chapter is ALREADY scheduled on `dateStr` (completed or active)
        const sameDayExistingIdx = updatedTasks.findIndex(t => {
          const notesUpper = (t.notes || '').toUpperCase();
          if (t.status === ('unachieved' as any) || notesUpper.includes('STATUS: UNACHIEVED')) return false;
          const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
          if (tDate !== dateStr) return false;
          return extractTaskCanonicalIdentity(t) === chapCanonId;
        });

        if (sameDayExistingIdx !== -1 && updatedTasks[sameDayExistingIdx].status === 'completed') {
          // Already completed on this exact day — do not add a duplicate
          skippedSameDayDuplicates++;
          return;
        }

        // 1b. Otherwise check if an uncompleted task for this chapter in this milestone exists on another day (to move it to `dateStr`)
        const existingIdx = sameDayExistingIdx !== -1
          ? sameDayExistingIdx
          : updatedTasks.findIndex(t => {
              if (t.status === 'completed') return false;
              const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
              if (tMsId && tMsId !== cp.id) return false;
              return extractTaskCanonicalIdentity(t) === chapCanonId;
            });

        let taskId = `local-task-ms-${baseTime}-${dIdx}-${cIdx}`;
        if (existingIdx !== -1) {
          taskId = updatedTasks[existingIdx].id;
          updatedTasks[existingIdx] = {
            ...updatedTasks[existingIdx],
            title: fullTitle,
            notes: fullNotes,
            due: new Date(`${dateStr}T09:00:00`).toISOString(),
            status: 'needsAction',
            subjectCode: ch.subjectCode,
            chapterName: ch.chapterName,
            milestoneId: cp.id,
            relevance,
            targetDurationMinutes: effectiveTargetDur,
            clubGroupId: ch.clubGroupId,
            clubTotalMinutes: ch.clubTotalMinutes,
            clubOrder: ch.clubOrder ?? cIdx,
            clubAllocationBasis: ch.clubGroupId ? (ch.clubAllocationBasis || (ch.spentMins > 0 ? 'prior_logs' : 'best_judgment')) : undefined,
            clubPriorLoggedMinutes: ch.clubGroupId ? (ch.clubPriorLoggedMinutes ?? ch.spentMins ?? 0) : undefined
          };
        } else {
          updatedTasks.unshift({
            id: taskId,
            title: fullTitle,
            notes: fullNotes,
            due: new Date(`${dateStr}T09:00:00`).toISOString(),
            status: 'needsAction',
            listId: targetListId,
            subjectCode: ch.subjectCode,
            chapterName: ch.chapterName,
            milestoneId: cp.id,
            relevance,
            targetDurationMinutes: effectiveTargetDur,
            clubGroupId: ch.clubGroupId,
            clubTotalMinutes: ch.clubTotalMinutes,
            clubOrder: ch.clubOrder ?? cIdx,
            clubAllocationBasis: ch.clubGroupId ? (ch.clubAllocationBasis || (ch.spentMins > 0 ? 'prior_logs' : 'best_judgment')) : undefined,
            clubPriorLoggedMinutes: ch.clubGroupId ? (ch.clubPriorLoggedMinutes ?? ch.spentMins ?? 0) : undefined
          });
        }
        createdOrMovedCount++;

        // Record customized proportionate duration in `practca_task_target_durations`
        durationsMap[taskId] = effectiveTargetDur;
        durationsMap[ch.chapterName] = effectiveTargetDur;
        durationsMap[normalizeKey(ch.chapterName)] = effectiveTargetDur;
      });

      // Deduplicate any accidental same-day duplicate tasks for `dateStr` in `updatedTasks`
      const dayCanonSeen = new Set<string>();
      updatedTasks = updatedTasks.filter(t => {
        const notesUpper = (t.notes || '').toUpperCase();
        if (t.status === ('unachieved' as any) || notesUpper.includes('STATUS: UNACHIEVED')) return true;
        const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
        if (tDate !== dateStr) return true;
        const cid = extractTaskCanonicalIdentity(t);
        if (cid.includes('::__general__::')) return true;
        if (dayCanonSeen.has(cid)) return false;
        dayCanonSeen.add(cid);
        return true;
      });

      // Do NOT auto-slot allocated milestone targets onto the 24-Hour Plan Clock; slotting is strictly user-initiated.
      daySched.batches.forEach((b: any) => {
        durationsMap[b.batchTitle] = b.durationMinutes;
        durationsMap[normalizeKey(b.batchTitle)] = b.durationMinutes;
      });
    });

    // Save tasks and durations
    triggerLocalSaveStatus();
    setTasks(updatedTasks);
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: durationsMap, removedTargetNames: [] }
      }));
      window.dispatchEvent(new Event('practca_flow_updated'));
    } catch (e) {}

    const activeDaysScheduled = daySchedules.filter(d => d.chapters.length > 0).length;
    const totalBatchesCount = daySchedules.reduce((acc, d) => acc + d.batches.length, 0);
    const totalHrsStr = (totalTimeNeededMins / 60).toFixed(1).replace(/\.0$/, '');

    setAutoBatchBannerMsg(
      `🎯 Auto-Allocated ${createdOrMovedCount} chapters (${totalHrsStr}h total) from "${cp.customTitle || cp.subjectId}" across ${activeDaysScheduled}/${numDays} days into ${totalBatchesCount} study batches${skippedSameDayDuplicates > 0 ? ` (${skippedSameDayDuplicates} same-day dup skipped)` : ''}! Click Undo anytime to revert.`
    );
    setShowAutoBatchStudio(false);
    setTimeout(() => {
      const el = document.getElementById('daily-target-list-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    setTimeout(() => setAutoBatchBannerMsg(null), 7000);
  };

  // Shift a chapter's assigned date by -1 or +1 day within the active milestone allocation horizon
  const handleShiftChapterDay = (configKey: string, currentAssignedDate: string, deltaDays: -1 | 1) => {
    if (!milestoneAutoAllocationPlan) return;
    const dates = milestoneAutoAllocationPlan.allocationDates;
    const idx = dates.indexOf(currentAssignedDate);
    if (idx === -1) return;
    const nextIdx = Math.max(0, Math.min(dates.length - 1, idx + deltaDays));
    if (nextIdx !== idx) {
      updateChapterCustomConfig(configKey, { assignedDate: dates[nextIdx] });
    }
  };

  // Balance all milestone chapters evenly across the selected number of days based on timeNeededMins
  const handleBalanceMilestoneLoadEvenly = () => {
    if (!milestoneAutoAllocationPlan) return;
    const { allocationDates, enrichedChapters } = milestoneAutoAllocationPlan;
    if (allocationDates.length === 0 || enrichedChapters.length === 0) return;

    const dayLoads = allocationDates.map(d => ({ dateStr: d, mins: 0, count: 0 }));
    const nextConfig = { ...chapterCustomConfig };

    // Sort chapters descending by duration so largest chapters are distributed first across days
    const sortedByDuration = [...enrichedChapters].sort((a, b) => b.timeNeededMins - a.timeNeededMins);
    sortedByDuration.forEach((ch) => {
      // Pick the day with the lowest total minutes (tie-break by fewest chapters, then earliest date)
      dayLoads.sort((a, b) => (a.mins !== b.mins ? a.mins - b.mins : a.count !== b.count ? a.count - b.count : a.dateStr.localeCompare(b.dateStr)));
      const targetDay = dayLoads[0];
      targetDay.mins += ch.timeNeededMins;
      targetDay.count += 1;
      nextConfig[ch.configKey] = {
        ...(nextConfig[ch.configKey] || {}),
        assignedDate: targetDay.dateStr
      };
    });

    setChapterCustomConfig(nextConfig);
    try {
      localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(nextConfig));
    } catch (e) {}
    setAutoBatchBannerMsg(`⚖️ Balanced ${enrichedChapters.length} chapters evenly across ${allocationDates.length} days!`);
    setTimeout(() => setAutoBatchBannerMsg(null), 4000);
  };

  // Reset all Day Cards in the active Milestone Allocator to blank (0 chapters on every day) so user can assign chapters from scratch
  const handleResetMilestoneDaysToBlank = () => {
    if (!milestoneAutoAllocationPlan) return;
    const { enrichedChapters } = milestoneAutoAllocationPlan;
    const nextConfig = { ...chapterCustomConfig };
    enrichedChapters.forEach(ch => {
      const existing = { ...(nextConfig[ch.configKey] || {}) };
      delete existing.clubGroupId;
      delete existing.clubTotalMinutes;
      delete existing.clubOrder;
      delete existing.clubAllocationBasis;
      delete existing.clubPriorLoggedMinutes;
      existing.assignedDate = 'UNASSIGNED';
      nextConfig[ch.configKey] = existing;
    });
    setChapterCustomConfig(nextConfig);
    setSelectedMilestoneDayChapterKeys({});
    setShowScratchChapterPool(true);
    setScratchPoolFilter('unassigned');
    try {
      localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(nextConfig));
    } catch (e) {}
    setAutoBatchBannerMsg(`🧹 Reset all ${enrichedChapters.length} chapters to Blank — pick chapters from the Subject Chapters list below to add them to any day from scratch!`);
    setTimeout(() => setAutoBatchBannerMsg(null), 4500);
  };

  // Restore default smart quick auto-allocation across days for all chapters in the active milestone
  const handleRestoreMilestoneQuickAllocation = () => {
    if (!milestoneAutoAllocationPlan) return;
    const { enrichedChapters } = milestoneAutoAllocationPlan;
    const nextConfig = { ...chapterCustomConfig };
    enrichedChapters.forEach(ch => {
      if (nextConfig[ch.configKey]) {
        const copy = { ...nextConfig[ch.configKey] };
        delete copy.assignedDate;
        nextConfig[ch.configKey] = copy;
      }
    });
    setChapterCustomConfig(nextConfig);
    try {
      localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(nextConfig));
    } catch (e) {}
    setAutoBatchBannerMsg(`⚡ Restored smart quick auto-allocation across ${milestoneAutoAllocationPlan.numDays} days!`);
    setTimeout(() => setAutoBatchBannerMsg(null), 4000);
  };

  // Unassign a single chapter from a Day Card back to the Unassigned Subject Chapters pool
  const handleUnassignMilestoneChapterFromDay = (ch: any, dayChapters: any[]) => {
    if (ch.clubGroupId) {
      handleRemoveMilestoneChapterFromClub(ch, dayChapters);
    }
    updateChapterCustomConfig(ch.configKey, {
      assignedDate: 'UNASSIGNED',
      clubGroupId: undefined,
      clubTotalMinutes: undefined,
      clubOrder: undefined,
      clubAllocationBasis: undefined,
      clubPriorLoggedMinutes: undefined
    });
    setShowScratchChapterPool(true);
  };

  // Assign a chapter from the Subject Chapters pool (or another day) to a specific Day Card
  const handleAssignMilestoneChapterToDay = (configKey: string, targetDateStr: string) => {
    if (!targetDateStr) return;
    updateChapterCustomConfig(configKey, {
      assignedDate: targetDateStr,
      clubGroupId: undefined,
      clubTotalMinutes: undefined,
      clubOrder: undefined,
      clubAllocationBasis: undefined,
      clubPriorLoggedMinutes: undefined
    });
  };

  // Allocate a single specific day's schedule from the Milestone Plan into that day's Daily Checklist & 24h Clock
  const handleAllocateSingleDayFromMilestone = (daySched: any) => {
    if (!milestoneAutoAllocationPlan || !daySched) return;
    const { checkpoint: cp, isFinal15DayRev, defaultUniformRelevance } = milestoneAutoAllocationPlan;
    const dateStr = daySched.dateStr;
    if (!daySched.chapters || daySched.chapters.length === 0) {
      setSelectedDate(dateStr);
      return;
    }

    const targetListId = selectedListId || (taskLists[0]?.id ?? 'local-default');
    if (!selectedListId && taskLists.length > 0) {
      setSelectedListId(taskLists[0].id);
    }

    // Push snapshot onto Multi-Step Undo Stack before mutating
    pushPlannerUndoSnapshot(
      `Allocated Day ${daySched.dayNumber} (${dateStr}) — ${daySched.chapters.length} ch`,
      [dateStr, selectedDate]
    );

    let updatedTasks = [...tasks];
    const baseTime = Date.now();
    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    const seenCanonOnDay = new Set<string>();
    let skippedSameDayDuplicates = 0;

    daySched.chapters.forEach((ch: any, cIdx: number) => {
      const chapCanonId = getTaskCanonicalChapterIdentity(ch.subjectCode, ch.chapterName);
      if (seenCanonOnDay.has(chapCanonId)) {
        skippedSameDayDuplicates++;
        return;
      }
      seenCanonOnDay.add(chapCanonId);

      const relevance: 'General' | 'Revision' | 'Final Revision' = isFinal15DayRev
        ? 'Final Revision'
        : (ch.relevance || defaultUniformRelevance);
      const emoji = relevance === 'Final Revision' ? '🔴' : relevance === 'General' ? '🔵' : '🟡';
      const fullTitle = `${emoji} [${relevance}] [${ch.subjectCode}] ${ch.chapterName}`;
      const clubMetaLines = ch.clubGroupId && ch.clubTotalMinutes
        ? `\nClubGroupId: ${ch.clubGroupId}\nClubTotalMinutes: ${ch.clubTotalMinutes}\nClubOrder: ${ch.clubOrder ?? cIdx}\nClubAllocationBasis: ${ch.clubAllocationBasis || (ch.spentMins > 0 ? 'prior_logs' : 'best_judgment')}\nClubPriorLoggedMinutes: ${ch.clubPriorLoggedMinutes ?? ch.spentMins ?? 0}`
        : '';
      const effectiveTargetDur = ch.timeNeededMins;
      const fullNotes = `Relevance: ${relevance}\nSubject: ${ch.subjectCode}\nChapter: ${ch.chapterName}\nImportance: ${ch.importance}\nTargetDurationMinutes: ${effectiveTargetDur}\nMilestone: ${cp.customTitle || cp.subjectId}\nMilestoneId: ${cp.id}${clubMetaLines}`;

      const sameDayExistingIdx = updatedTasks.findIndex(t => {
        const notesUpper = (t.notes || '').toUpperCase();
        if (t.status === ('unachieved' as any) || notesUpper.includes('STATUS: UNACHIEVED')) return false;
        const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
        if (tDate !== dateStr) return false;
        return extractTaskCanonicalIdentity(t) === chapCanonId;
      });

      if (sameDayExistingIdx !== -1 && updatedTasks[sameDayExistingIdx].status === 'completed') {
        skippedSameDayDuplicates++;
        return;
      }

      const existingIdx = sameDayExistingIdx !== -1
        ? sameDayExistingIdx
        : updatedTasks.findIndex(t => {
            if (t.status === 'completed') return false;
            const tMsId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
            if (tMsId && tMsId !== cp.id) return false;
            return extractTaskCanonicalIdentity(t) === chapCanonId;
          });

      let taskId = `local-task-ms-${baseTime}-single-${cIdx}`;
      if (existingIdx !== -1) {
        taskId = updatedTasks[existingIdx].id;
        updatedTasks[existingIdx] = {
          ...updatedTasks[existingIdx],
          title: fullTitle,
          notes: fullNotes,
          due: new Date(`${dateStr}T09:00:00`).toISOString(),
          status: 'needsAction',
          subjectCode: ch.subjectCode,
          chapterName: ch.chapterName,
          milestoneId: cp.id,
          relevance,
          targetDurationMinutes: effectiveTargetDur,
          clubGroupId: ch.clubGroupId,
          clubTotalMinutes: ch.clubTotalMinutes,
          clubOrder: ch.clubOrder ?? cIdx,
          clubAllocationBasis: ch.clubGroupId ? (ch.clubAllocationBasis || (ch.spentMins > 0 ? 'prior_logs' : 'best_judgment')) : undefined,
          clubPriorLoggedMinutes: ch.clubGroupId ? (ch.clubPriorLoggedMinutes ?? ch.spentMins ?? 0) : undefined
        };
      } else {
        updatedTasks.unshift({
          id: taskId,
          title: fullTitle,
          notes: fullNotes,
          due: new Date(`${dateStr}T09:00:00`).toISOString(),
          status: 'needsAction',
          listId: targetListId,
          subjectCode: ch.subjectCode,
          chapterName: ch.chapterName,
          milestoneId: cp.id,
          relevance,
          targetDurationMinutes: effectiveTargetDur,
          clubGroupId: ch.clubGroupId,
          clubTotalMinutes: ch.clubTotalMinutes,
          clubOrder: ch.clubOrder ?? cIdx,
          clubAllocationBasis: ch.clubGroupId ? (ch.clubAllocationBasis || (ch.spentMins > 0 ? 'prior_logs' : 'best_judgment')) : undefined,
          clubPriorLoggedMinutes: ch.clubGroupId ? (ch.clubPriorLoggedMinutes ?? ch.spentMins ?? 0) : undefined
        });
      }
      durationsMap[taskId] = effectiveTargetDur;
      durationsMap[ch.chapterName] = effectiveTargetDur;
      durationsMap[normalizeKey(ch.chapterName)] = effectiveTargetDur;
    });

    // Deduplicate any accidental same-day duplicate tasks for `dateStr`
    const dayCanonSeen = new Set<string>();
    updatedTasks = updatedTasks.filter(t => {
      const notesUpper = (t.notes || '').toUpperCase();
      if (t.status === ('unachieved' as any) || notesUpper.includes('STATUS: UNACHIEVED')) return true;
      const tDate = t.due ? t.due.split('T')[0] : getSystemLocalDateString();
      if (tDate !== dateStr) return true;
      const cid = extractTaskCanonicalIdentity(t);
      if (cid.includes('::__general__::')) return true;
      if (dayCanonSeen.has(cid)) return false;
      dayCanonSeen.add(cid);
      return true;
    });

    // Do NOT auto-slot allocated milestone targets onto the 24-Hour Plan Clock; slotting is strictly user-initiated.
    (daySched.batches || []).forEach((b: any) => {
      durationsMap[b.batchTitle] = b.durationMinutes;
      durationsMap[normalizeKey(b.batchTitle)] = b.durationMinutes;
    });

    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
      setTasks(updatedTasks);
      setSelectedDate(dateStr);
      triggerLocalSaveStatus();
      window.dispatchEvent(new Event('practca_tasks_updated'));
    } catch (e) {}

    setAutoBatchBannerMsg(
      `✓ Allocated Day ${daySched.dayNumber} (${dateStr}): ${daySched.chapters.length} chapters scheduled to Daily Target Board${skippedSameDayDuplicates > 0 ? ` (${skippedSameDayDuplicates} dup skipped)` : ''}!`
    );
    setShowAutoBatchStudio(false);
    setTimeout(() => {
      const el = document.getElementById('daily-target-list-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    setTimeout(() => setAutoBatchBannerMsg(null), 5000);
  };

  // AUTO-BATCH ENGINE: Groups selected chapters into balanced 90-minute study blocks to fill remaining time in the 24-hour target clock
  const handleAutoBatchChaptersInto90MinClock = (
    customSourceItems?: {
      id?: string;
      title: string;
      cleanTitle?: string;
      chapterName?: string;
      subjectCode: SubjectId;
      relevance?: 'General' | 'Revision' | 'Final Revision';
    }[],
    replaceExistingAutoBatches: boolean = true
  ) => {
    const BLOCK_DURATION = 90; // 90-minute study blocks
    const BREAK_GAP = autoBatchBreakGap; // Default 15-minute break buffer between blocks

    // 1. Determine chapters to batch
    let chaptersToBatch: {
      id: string;
      title: string;
      cleanTitle: string;
      chapterName: string;
      subjectCode: SubjectId;
      relevance: 'General' | 'Revision' | 'Final Revision';
    }[] = [];

    if (customSourceItems && customSourceItems.length > 0) {
      chaptersToBatch = customSourceItems.map((item, i) => ({
        id: item.id || `batch_ch_${Date.now()}_${i}`,
        title: item.cleanTitle || item.title,
        cleanTitle: item.cleanTitle || item.title,
        chapterName: item.chapterName || item.cleanTitle || item.title,
        subjectCode: (item.subjectCode || 'FR') as SubjectId,
        relevance: item.relevance || 'Revision'
      }));
    } else if (selectedTaskIds.length > 0) {
      const selectedObjs = sortedActiveTasks.filter(t => selectedTaskIds.includes(t.id));
      chaptersToBatch = selectedObjs.map(t => ({
        id: t.id,
        title: t.cleanTitle || t.title,
        cleanTitle: t.cleanTitle || t.title,
        chapterName: t.chapterName || t.cleanTitle || t.title,
        subjectCode: (t.subjectCode || 'FR') as SubjectId,
        relevance: (t.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision'
      }));
    } else {
      chaptersToBatch = sortedActiveTasks.map(t => ({
        id: t.id,
        title: t.cleanTitle || t.title,
        cleanTitle: t.cleanTitle || t.title,
        chapterName: t.chapterName || t.cleanTitle || t.title,
        subjectCode: (t.subjectCode || 'FR') as SubjectId,
        relevance: (t.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision'
      }));
    }

    // Deduplicate chaptersToBatch by canonical chapter identity for this day
    const batchSeenCanon = new Set<string>();
    chaptersToBatch = chaptersToBatch.filter(c => {
      const cid = getTaskCanonicalChapterIdentity(c.subjectCode, c.chapterName);
      if (batchSeenCanon.has(cid)) return false;
      batchSeenCanon.add(cid);
      return true;
    });

    if (chaptersToBatch.length === 0) {
      setErrorMsg('Please select or add chapters first to Auto-Batch into 90-minute study blocks.');
      return;
    }

    pushPlannerUndoSnapshot(`Auto-Batched ${chaptersToBatch.length} ch into 90m Clock`, [selectedDate]);

    // 2. Load existing 24-hour target clock slots for `selectedDate`
    const clockStorageKey = `practca_24h_target_clock_${selectedDate}`;
    let existingSlots: any[] = [];
    try {
      const raw = localStorage.getItem(clockStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existingSlots = replaceExistingAutoBatches
            ? parsed.filter((s: any) => !String(s.id || '').startsWith('slot_autobatch_'))
            : parsed;
        }
      }
    } catch (e) {}

    const sortedExisting = [...existingSlots].sort((a, b) => (a.startMinutes || 0) - (b.startMinutes || 0));

    // 3. Find all available 90-minute study block windows respecting the user's analyzed sleep, breakfast, lunch, dinner & routine pattern
    const sleepAnalysis = analyzeUserDayRationale(selectedDate);
    const todayStr = getSystemLocalDateString();
    const now = new Date();
    const defaultStartMins = parseStartTimeToMinutes(autoBatchStartTime);
    const wakingStartMins = Math.max(defaultStartMins, sleepAnalysis.estimatedStudyStartMinutes, sleepAnalysis.sleepEndMinutes);
    const currentRoundedMins = selectedDate === todayStr
      ? Math.max(wakingStartMins, Math.ceil((now.getHours() * 60 + now.getMinutes() + 10) / 15) * 15)
      : wakingStartMins;

    // Bedtime limit strictly bounds the search window, so sleep hours are left blank
    const bedtimeLimit = sleepAnalysis.sleepStartMinutes;

    if (selectedDate === todayStr && currentRoundedMins >= bedtimeLimit) {
      setErrorMsg(`Current time is within or past your analyzed bedtime (${sleepAnalysis.sleepStartTimeStr}). Auto-batch protects your sleep time and leaves it blank.`);
      return;
    }

    // Collect busy intervals: existing slots + user's analyzed sleep, breakfast, lunch, dinner & routine intervals
    const busyCheckIntervals: { start: number; end: number }[] = [];
    for (const s of sortedExisting) {
      busyCheckIntervals.push({ start: Number(s.startMinutes) || 0, end: Number(s.endMinutes) || 0 });
    }
    for (const sInt of sleepAnalysis.sleepIntervals) {
      busyCheckIntervals.push({ start: sInt.start, end: sInt.end });
    }
    for (const rInt of sleepAnalysis.routineIntervals) {
      busyCheckIntervals.push({ start: rInt.start, end: rInt.end });
    }
    busyCheckIntervals.sort((a, b) => a.start - b.start);

    const searchWindows = selectedDate === todayStr
      ? [
          { start: currentRoundedMins, end: bedtimeLimit }
        ]
      : [
          { start: wakingStartMins, end: bedtimeLimit }
        ];

    let free90MinWindows: { startMinutes: number; endMinutes: number }[] = [];

    for (const win of searchWindows) {
      if (win.start >= win.end) continue;
      const candidateBlocks: { startMinutes: number; endMinutes: number }[] = [];
      let cursor = win.start;

      for (const s of busyCheckIntervals) {
        const sStart = Number(s.start) || 0;
        const sEnd = Number(s.end) || 0;
        if (sEnd <= cursor) continue;
        if (sStart > cursor) {
          let gapCursor = cursor;
          while (gapCursor + BLOCK_DURATION <= Math.min(sStart, win.end)) {
            candidateBlocks.push({
              startMinutes: gapCursor,
              endMinutes: gapCursor + BLOCK_DURATION
            });
            gapCursor += BLOCK_DURATION + BREAK_GAP;
          }
        }
        cursor = Math.max(cursor, sEnd + BREAK_GAP);
      }

      while (cursor + BLOCK_DURATION <= win.end) {
        candidateBlocks.push({
          startMinutes: cursor,
          endMinutes: cursor + BLOCK_DURATION
        });
        cursor += BLOCK_DURATION + BREAK_GAP;
      }

      if (candidateBlocks.length > 0) {
        free90MinWindows = candidateBlocks;
        break;
      }
    }

    if (free90MinWindows.length === 0) {
      setErrorMsg(`No remaining 90-minute free window found before bedtime (${sleepAnalysis.sleepStartTimeStr}). Your sleep schedule (${sleepAnalysis.sleepStartTimeStr} – ${sleepAnalysis.sleepEndTimeStr}) is preserved blank.`);
      return;
    }

    // 4. Balanced 90-minute block grouping
    // - In 'balanced_groups' mode: if chapters <= free90MinWindows, each chapter (or balanced pair) gets a 90m block; if chapters > free90MinWindows, all chapters are balanced evenly across all remaining 90m blocks.
    // - In 'fill_remaining_clock' mode: uses all remaining 90m blocks in the waking day and distributes the selected chapters cyclically/evenly across them to fill the remaining 24h clock time.
    const numChapters = chaptersToBatch.length;
    const numBlocksToCreate = autoBatchFillMode === 'fill_remaining_clock'
      ? Math.min(free90MinWindows.length, Math.max(numChapters, Math.min(free90MinWindows.length, 8)))
      : Math.min(free90MinWindows.length, Math.max(1, numChapters));

    const chosenWindows = free90MinWindows.slice(0, numBlocksToCreate);
    const buckets: typeof chaptersToBatch[] = Array.from({ length: numBlocksToCreate }, () => []);

    if (numChapters >= numBlocksToCreate) {
      // Distribute `numChapters` evenly across `numBlocksToCreate` 90-minute blocks
      chaptersToBatch.forEach((chap, idx) => {
        const bIdx = Math.floor((idx * numBlocksToCreate) / numChapters);
        buckets[Math.min(numBlocksToCreate - 1, bIdx)].push(chap);
      });
    } else {
      // Fewer chapters than blocks (e.g. fill_remaining_clock mode): assign balanced 90-minute blocks cycling through chapters
      chosenWindows.forEach((_, blockIdx) => {
        const chap = chaptersToBatch[blockIdx % numChapters];
        buckets[blockIdx].push(chap);
      });
    }

    const generatedSlots = chosenWindows.map((win, idx) => {
      const group = buckets[idx];
      const primary = group[0];
      const uniqueSubjects = Array.from(new Set(group.map(g => g.subjectCode)));
      const slotTitle = group.length === 1
        ? primary.cleanTitle
        : `Batch ${idx + 1} (${group.length} Ch): ${group.map(g => g.cleanTitle).join(' + ')}`;
      const slotChapter = group.map(g => g.chapterName).join(' + ');

      return {
        id: `slot_autobatch_${Date.now()}_${idx}`,
        targetId: primary.id,
        title: slotTitle,
        chapterName: slotChapter,
        subjectCode: primary.subjectCode,
         subjectsInBatch: uniqueSubjects,
        batchSize: group.length,
        relevance: primary.relevance,
        startTime: minutesToHHMM(win.startMinutes),
        endTime: minutesToHHMM(win.endMinutes),
        startMinutes: win.startMinutes,
        endMinutes: win.endMinutes,
        durationMinutes: BLOCK_DURATION,
        status: 'pending' as const
      };
    });

    const updatedClockSlots = [...sortedExisting, ...generatedSlots].sort(
      (a, b) => (a.startMinutes || 0) - (b.startMinutes || 0)
    );

    // 5. Persist to 24-hour target clock storage, update task target durations, and sync Target Flow
    try {
      localStorage.setItem(clockStorageKey, JSON.stringify(updatedClockSlots));
      setTargetClockSlotsForDay(updatedClockSlots);

      // Update task target durations map
      let durationsMap: Record<string, number> = {};
      try {
        const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
        if (rawDur) durationsMap = JSON.parse(rawDur);
      } catch (e) {}

      // Allocate 90 mins per block in 15-minute slabs summing to 90m (never odd-number allotments)
      generatedSlots.forEach((slot, idx) => {
        const group = buckets[idx];
        const slabAllocs = allocateProportionateClubDurations(
          group.map((ch: any) => ({
            id: ch.id,
            subjectCode: ch.subjectCode,
            chapterName: ch.chapterName || ch.cleanTitle || ch.title,
            title: ch.cleanTitle || ch.title,
            relevance: ch.relevance === 'Final Revision' ? 'final_revision' : ch.relevance === 'General' ? 'general' : 'revision'
          })),
          BLOCK_DURATION
        );
        const slabMap = new Map(slabAllocs.map(a => [a.id, a.allocatedMinutes]));
        durationsMap[slot.title] = (durationsMap[slot.title] || 0) + BLOCK_DURATION;
        durationsMap[normalizeKey(slot.title)] = (durationsMap[normalizeKey(slot.title)] || 0) + BLOCK_DURATION;
        group.forEach((ch: any) => {
          const perChapMins = slabMap.get(ch.id) ?? roundToNearest15MinSlab(BLOCK_DURATION / Math.max(1, group.length), 15);
          durationsMap[ch.id] = perChapMins;
          durationsMap[ch.cleanTitle] = perChapMins;
          durationsMap[normalizeKey(ch.cleanTitle)] = perChapMins;
        });
      });

      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));

      // Also sync `practca_target_flow` so the Grind Clock Target Flow has these 90-minute blocks ready
      const flowSequence = updatedClockSlots.map((slot: any, index: number) => ({
        id: `flow_${normalizeKey(slot.title) || slot.targetId || index}`,
        taskId: slot.targetId,
        title: slot.title,
        cleanTitle: slot.title,
        chapterName: slot.chapterName,
        subjectCode: slot.subjectCode,
        duration: slot.durationMinutes || 90,
        targetDurationMinutes: slot.durationMinutes || 90,
        allocatedMinutes: 0,
        relevance: slot.relevance || 'Revision',
        dueDate: `${selectedDate}T${slot.startTime || '09:00'}:00.000Z`,
        status: slot.status === 'completed' ? 'completed' : 'pending'
      }));
      localStorage.setItem(getLevelScopedKey('practca_target_flow'), JSON.stringify(flowSequence));

      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: durationsMap, removedTargetNames: [] }
      }));
      window.dispatchEvent(new Event('practca_flow_updated'));
    } catch (e) {
      console.error('Error saving Auto-Batch 90m blocks:', e);
    }

    const totalScheduledMins = generatedSlots.length * BLOCK_DURATION;
    const hrs = (totalScheduledMins / 60).toFixed(1).replace(/\.0$/, '');
    setAutoBatchBannerMsg(
      `⚡ Auto-Batched ${chaptersToBatch.length} chapter${chaptersToBatch.length === 1 ? '' : 's'} into ${generatedSlots.length} balanced 90-minute study block${generatedSlots.length === 1 ? '' : 's'} (${hrs} hrs total) on the 24-Hour Target Clock (preserving sleep ${sleepAnalysis.sleepStartTimeStr}–${sleepAnalysis.sleepEndTimeStr} blank)!`
    );
    setShowAutoBatchStudio(true);
    setTimeout(() => setAutoBatchBannerMsg(null), 6000);
  };

  // Clear only auto-batched 90m slots for `selectedDate`
  const handleClearAutoBatchedSlots = () => {
    const clockStorageKey = `practca_24h_target_clock_${selectedDate}`;
    const remaining = targetClockSlotsForDay.filter(s => !String(s.id || '').startsWith('slot_autobatch_'));
    setTargetClockSlotsForDay(remaining);
    try {
      localStorage.setItem(clockStorageKey, JSON.stringify(remaining));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new Event('practca_flow_updated'));
    } catch (e) {}
    setAutoBatchBannerMsg('Cleared auto-batched 90-minute blocks from the 24-Hour Target Clock.');
    setTimeout(() => setAutoBatchBannerMsg(null), 3500);
  };

  // Automatically lapse non-1.5-day pending and missed tasks whenever 1.5-Day LMR mode is active
  const [lmrActiveFlag, setLmrActiveFlag] = useState<boolean>(() => isLmrModeCurrentlyOn());
  useEffect(() => {
    const syncLmrState = () => {
      const active = isLmrModeCurrentlyOn();
      setLmrActiveFlag(active);
      if (active) {
        lapseNon15DayTasksWhenLmrActive();
        setTasks((prev) => prev.filter((t: any) => isTaskEligibleInActiveLmrSprint(t)));
      } else {
        loadLocalTasks();
      }
      setDurationsSyncTick(t => t + 1);
    };
    syncLmrState();
    window.addEventListener('practca_lmr_preference_updated', syncLmrState);
    window.addEventListener('practca_lmr_mode_changed', syncLmrState);
    window.addEventListener('practca_exam_date_updated', syncLmrState);
    window.addEventListener('practca_roadmap_checkpoints_updated', syncLmrState);
    window.addEventListener('storage', syncLmrState);
    return () => {
      window.removeEventListener('practca_lmr_preference_updated', syncLmrState);
      window.removeEventListener('practca_lmr_mode_changed', syncLmrState);
      window.removeEventListener('practca_exam_date_updated', syncLmrState);
      window.removeEventListener('practca_roadmap_checkpoints_updated', syncLmrState);
      window.removeEventListener('storage', syncLmrState);
    };
  }, []);

  useEffect(() => {
    if (lmrActiveFlag) {
      if (viewFormat === 'all-pending' || viewFormat === 'all-missed') {
        setViewFormat('roadmap');
      }
      if (showAutoBatchStudio) {
        setShowAutoBatchStudio(false);
      }
      if (showFinalExamDatesModal) {
        setShowFinalExamDatesModal(false);
      }
      if (showImportTemplateModal) {
        setShowImportTemplateModal(false);
      }
    }
  }, [lmrActiveFlag, viewFormat, showAutoBatchStudio, showFinalExamDatesModal, showImportTemplateModal]);

  // Google Task priority and subject metadata parser mapping helper (using useMemo to avoid recalculation)
  const mappedTasks = React.useMemo(() => {
    const baseTasks = lmrActiveFlag
      ? tasks.filter((t: any) => isTaskEligibleInActiveLmrSprint(t))
      : tasks;

    const listFilteredTasks = selectedListId
      ? baseTasks.filter(t => !t.listId || t.listId === selectedListId || t.listId === 'local-default' || selectedListId === 'local-default')
      : baseTasks;

    // Load custom positions for Cloud Mode
    let cloudPositions: Record<string, number> = {};
    if (!isLocalMode) {
      try {
        const saved = localStorage.getItem('practca_google_tasks_positions');
        if (saved) {
          cloudPositions = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to parse custom positions:", e);
      }
    }

    const subjects: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];

    return listFilteredTasks.map(t => {
      let relevance: 'General' | 'Revision' | 'Final Revision' = 'Revision';
      let subjectCode: SubjectId = 'IDT';
      let cleanTitle = t.title;

      const titleUpper = t.title.toUpperCase();
      const notesUpper = (t.notes || '').toUpperCase();

      // 1. Relevance/Priority Determination (Line-by-line first, then bracketMatch, then fallbacks)
      let parsedRelevance: 'General' | 'Revision' | 'Final Revision' | undefined = undefined;
      const relevanceLine = (t.notes || '')
        .split('\n')
        .find(line => {
          const u = line.trim().toUpperCase();
          return u.startsWith('RELEVANCE:') || u.startsWith('PRIORITY:');
        });
      
      if (relevanceLine) {
        const val = relevanceLine.split(':')[1]?.trim().toUpperCase();
        if (val === 'GENERAL' || val === 'LOW') parsedRelevance = 'General';
        else if (val === 'REVISION' || val === 'MEDIUM') parsedRelevance = 'Revision';
        else if (val === 'FINAL REVISION' || val === 'HIGH') parsedRelevance = 'Final Revision';
      }

      if (!parsedRelevance) {
        const relevanceBracketMatch = t.title.match(/\[\s*(General|Revision|Final Revision|High|Medium|Low)\s*\]/i);
        if (relevanceBracketMatch) {
          const val = relevanceBracketMatch[1].toUpperCase();
          if (val === 'GENERAL' || val === 'LOW') parsedRelevance = 'General';
          else if (val === 'REVISION' || val === 'MEDIUM') parsedRelevance = 'Revision';
          else if (val === 'FINAL REVISION' || val === 'HIGH') parsedRelevance = 'Final Revision';
        }
      }

      if (!parsedRelevance) {
        if (titleUpper.includes('[FINAL REVISION]') || titleUpper.includes('[HIGH]') || titleUpper.includes('🔴') || notesUpper.includes('RELEVANCE: FINAL REVISION') || notesUpper.includes('PRIORITY: HIGH') || notesUpper.includes('[HIGH]')) {
          parsedRelevance = 'Final Revision';
        } else if (titleUpper.includes('[GENERAL]') || titleUpper.includes('[LOW]') || titleUpper.includes('🔵') || notesUpper.includes('RELEVANCE: GENERAL') || notesUpper.includes('PRIORITY: LOW') || notesUpper.includes('[LOW]')) {
          parsedRelevance = 'General';
        } else {
          parsedRelevance = 'Revision';
        }
      }
      relevance = parsedRelevance || 'Revision';

      // 2. Subject Determination (Line-by-line "Subject:" first, then bracketMatch, then keyword fallbacks)
      let parsedSubject: SubjectId | undefined = undefined;
      const subjectLine = (t.notes || '')
        .split('\n')
        .find(line => line.trim().toUpperCase().startsWith('SUBJECT:'));
      
      if (subjectLine) {
        const val = subjectLine.split(':')[1]?.trim().toUpperCase();
        const found = subjects.find(s => s.toUpperCase() === val);
        if (found) {
          parsedSubject = found;
        }
      }

      if (!parsedSubject) {
        const bracketMatch = t.title.match(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/i);
        if (bracketMatch) {
          const val = bracketMatch[1].toUpperCase();
          const found = subjects.find(s => s.toUpperCase() === val);
          if (found) {
            parsedSubject = found;
          }
        }
      }

      if (!parsedSubject) {
        const frKeywords = ['FR:', 'FINANCIAL REPORTING', 'IND AS', 'CONSOLIDATION', 'AMALGAMATION', 'ASSET RECONCILIATION'];
        const afmKeywords = ['AFM:', 'ADVANCED FINANCIAL MANAGEMENT', 'DERIVATIVES', 'PORTFOLIO', 'MUTUAL FUNDS', 'FOREX', 'VALUATION'];
        const auditKeywords = ['AUDIT:', 'AUDITING', 'SA ', 'STANDARDS ON AUDITING', 'PROFESSIONAL ETHICS', 'PEER REVIEW'];
        const ibsKeywords = ['IBS:', 'INTEGRATED BUSINESS SOLUTIONS', 'CASE STUDY', 'MULTIPLY DISCIPLINES'];
        const dtKeywords = ['PGBP', 'ASSESSMENT OF COMPANIES', 'INTERNATIONAL TAXATION', 'TRANSFER PRICING', 'DOUBLE TAXATION', 'DT:'];
        
        if (frKeywords.some(kw => titleUpper.includes(kw))) {
          parsedSubject = 'FR';
        } else if (afmKeywords.some(kw => titleUpper.includes(kw))) {
          parsedSubject = 'AFM';
        } else if (auditKeywords.some(kw => titleUpper.includes(kw))) {
          parsedSubject = 'Audit';
        } else if (ibsKeywords.some(kw => titleUpper.includes(kw))) {
          parsedSubject = 'IBS';
        } else if (dtKeywords.some(kw => titleUpper.includes(kw))) {
          parsedSubject = 'DT';
        }
      }
      subjectCode = parsedSubject || 'IDT';

      // Robust Title cleanup (strip all bracket metadata, status emojis, and clean leftover spaces/hyphens)
      cleanTitle = t.title
        .replace(/[🔴🟡🔵]/g, '')
        .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/ig, '')
        .replace(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/ig, '')
        .replace(/^[\s\-\|]+|[\s\-\|]+$/g, '')
        .trim();

      if (!cleanTitle) {
        cleanTitle = t.title;
      }

      // Support custom UN-ACHIEVED status designation
      let parsedStatus = t.status;
      if (notesUpper.includes('STATUS: UNACHIEVED')) {
        parsedStatus = 'unachieved';
      }

      // Parse absolute date
      let taskDate = t.due 
        ? t.due.split('T')[0] 
        : getSystemLocalDateString();

      // Retrieve cached position for Cloud Mode
      let position = t.position;
      if (!isLocalMode && cloudPositions[t.id] !== undefined) {
        position = cloudPositions[t.id];
      }

      const parsedMilestoneId = t.milestoneId || (t.notes || '').match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim() || undefined;
      const parsedChapterName = t.chapterName || (t.notes || '').match(/Chapter:\s*([^\n\r]+)/i)?.[1]?.trim() || cleanTitle;
      const parsedClubGroupId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r]+)/i)?.[1]?.trim() || undefined;
      const rawClubMins = t.clubTotalMinutes !== undefined
        ? Number(t.clubTotalMinutes)
        : Number((t.notes || '').match(/ClubTotalMinutes:\s*(\d+)/i)?.[1] || 0);
      const parsedClubTotalMinutes = rawClubMins > 0 ? rawClubMins : undefined;
      const rawClubOrder = t.clubOrder !== undefined
        ? Number(t.clubOrder)
        : Number((t.notes || '').match(/ClubOrder:\s*(\d+)/i)?.[1] || 0);
      const parsedClubOrder = !isNaN(rawClubOrder) ? rawClubOrder : undefined;
      let fallbackDurMap: Record<string, number> = {};
      try {
        const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
        if (rawDur) fallbackDurMap = JSON.parse(rawDur);
      } catch (e) {}
      const normCleanForDur = normalizeKey(cleanTitle);
      const isTaskCompleted = parsedStatus === 'completed';
      const isExplicitZeroDur =
        isTaskCompleted && (
          t.targetDurationMinutes === 0 ||
          t.duration === 0 ||
          (t.id && fallbackDurMap[t.id] === 0) ||
          (cleanTitle && fallbackDurMap[cleanTitle] === 0) ||
          (normCleanForDur && fallbackDurMap[normCleanForDur] === 0) ||
          /\bTargetDurationMinutes:\s*0\b/i.test(t.notes || '')
        );
      const rawTargetDur = isExplicitZeroDur
        ? 0
        : Number(fallbackDurMap[t.id]) > 0
          ? Number(fallbackDurMap[t.id])
          : Number(t.targetDurationMinutes) > 0
            ? Number(t.targetDurationMinutes)
            : Number((t.notes || '').match(/TargetDurationMinutes:\s*(\d+)/i)?.[1] || 0) ||
              Number(fallbackDurMap[cleanTitle]) ||
              Number(fallbackDurMap[normCleanForDur]) ||
              Number(t.duration) ||
              0;
      const parsedTargetDurationMinutes = isExplicitZeroDur ? 0 : (rawTargetDur > 0 ? rawTargetDur : undefined);

      return {
        ...t,
        status: parsedStatus,
        priority: t.priority, // fallback
        relevance,
        subjectCode,
        cleanTitle,
        chapterName: parsedChapterName,
        milestoneId: parsedMilestoneId,
        clubGroupId: parsedClubGroupId,
        clubTotalMinutes: parsedClubTotalMinutes,
        clubOrder: parsedClubOrder,
        targetDurationMinutes: parsedTargetDurationMinutes,
        taskDate,
        position
      };
    });
  }, [tasks, isLocalMode, selectedListId, lmrActiveFlag, durationsSyncTick]);

  // Selected Date Filters
  const selectedDayTasks = React.useMemo(() => {
    return mappedTasks.filter(t => t.taskDate === selectedDate);
  }, [mappedTasks, selectedDate]);

  const selectedDayActive = React.useMemo(() => {
    return selectedDayTasks.filter(t => t.status === 'needsAction');
  }, [selectedDayTasks]);

  const selectedDayCompleted = React.useMemo(() => {
    return selectedDayTasks.filter(t => t.status === 'completed');
  }, [selectedDayTasks]);

  const selectedDayUnachieved = React.useMemo(() => {
    if (lmrActiveFlag) return [];
    return selectedDayTasks.filter(t => t.status === 'unachieved');
  }, [selectedDayTasks, lmrActiveFlag]);

  // Sub filtration by Subject (IDT/DT) for the day's tasks
  const filteredActiveTasks = React.useMemo(() => {
    return selectedDayActive.filter(t => {
      if (filterSubject === 'ALL') return true;
      return t.subjectCode === filterSubject;
    });
  }, [selectedDayActive, filterSubject]);

  const selectedDayCompletedTasks = React.useMemo(() => {
    return selectedDayCompleted.filter(t => {
      if (filterSubject === 'ALL') return true;
      return t.subjectCode === filterSubject;
    });
  }, [selectedDayCompleted, filterSubject]);

  const selectedDayUnachievedTasks = React.useMemo(() => {
    if (lmrActiveFlag) return [];
    return selectedDayUnachieved.filter(t => {
      if (filterSubject === 'ALL') return true;
      return t.subjectCode === filterSubject;
    });
  }, [selectedDayUnachieved, filterSubject, lmrActiveFlag]);

  // Overdue Active Tasks checker (any pending goals before today — closed when 1.5-Day Sprint Mode is ON)
  const overduePendingTasks = React.useMemo(() => {
    if (lmrActiveFlag) return [];
    const today = getSystemLocalDateString();
    return mappedTasks.filter(t => t.status === 'needsAction' && t.taskDate < today);
  }, [mappedTasks, lmrActiveFlag]);

  // All Pending Tasks across entire planner (closed when 1.5-Day Sprint Mode is ON)
  const allPendingTasks = React.useMemo(() => {
    if (lmrActiveFlag) return [];
    const today = getSystemLocalDateString();
    return mappedTasks.filter(t => 
      t.taskDate <= today && 
      (t.status === 'needsAction' || t.status === 'inProcess') && 
      !t.completed
    );
  }, [mappedTasks, lmrActiveFlag]);

  // All Missed / Unachieved Tasks across entire planner (closed when 1.5-Day Sprint Mode is ON)
  const allMissedTasks = React.useMemo(() => {
    if (lmrActiveFlag) return [];
    return mappedTasks.filter(t => 
      t.status === 'unachieved' || 
      t.status === 'rescheduled'
    );
  }, [mappedTasks, lmrActiveFlag]);

  // Direct Reschedule to Target Date (updates task date to targetDateStr and sets status to needsAction)
  const handleDirectRescheduleTask = async (task: any, targetDateStr: string) => {
    if (!targetDateStr) return;
    const rawNotes = task.notes || '';
    const cleanedNotes = rawNotes.replace(/STATUS:\s*UNACHIEVED\n?/gi, '').trim();

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            due: targetDateStr,
            status: 'needsAction' as any,
            notes: cleanedNotes,
            completed: undefined
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
    } else {
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      try {
        const taskDocRef = firestoreDoc(db, 'users', user.uid, 'tasks', task.id);
        await setDoc(taskDocRef, {
          due: targetDateStr,
          status: 'needsAction',
          notes: cleanedNotes,
          completed: null
        }, { merge: true });
        setSyncStatus('Synced');
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Failed to reschedule target.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  // ⚡ 1-Click Intelligent Capacity-Aware Auto-Reschedule:
  // Fills today's open blocks up to study capacity (3 tasks), then rolls remaining overflow tasks onto the next available study days
  const handleCapacityAwareAutoReschedule = async () => {
    if (overduePendingTasks.length === 0) return;
    const today = getSystemLocalDateString();

    // 1. Calculate today's existing active load and capacity limit (optimal 3-4 tasks / day)
    const todayActiveCount = tasks.filter(t => (t.due || t.taskDate)?.split('T')[0] === today && t.status === 'needsAction').length;
    const MAX_DAILY_CAPACITY = 3;
    const availableSlotsToday = Math.max(0, MAX_DAILY_CAPACITY - todayActiveCount);

    // 2. Partition overdue tasks into today's quota vs overflow
    const todaySlottedTasks = overduePendingTasks.slice(0, availableSlotsToday);
    const overflowTasks = overduePendingTasks.slice(availableSlotsToday);

    // 3. Generate future open study days for overflow tasks (tomorrow, day+2, day+3, etc.)
    const taskToNewDate: Record<string, string> = {};
    todaySlottedTasks.forEach(t => {
      taskToNewDate[t.id] = today;
    });

    if (overflowTasks.length > 0) {
      const baseD = new Date();
      const futureDates: string[] = [];
      for (let i = 1; i <= 6; i++) {
        const nextD = new Date(baseD.getTime() + i * 24 * 60 * 60 * 1000);
        const y = nextD.getFullYear();
        const m = String(nextD.getMonth() + 1).padStart(2, '0');
        const d = String(nextD.getDate()).padStart(2, '0');
        futureDates.push(`${y}-${m}-${d}`);
      }

      overflowTasks.forEach((t, idx) => {
        const targetDay = futureDates[idx % futureDates.length];
        taskToNewDate[t.id] = targetDay;
      });
    }

    const affectedDates = Array.from(new Set([today, ...Object.values(taskToNewDate), ...overduePendingTasks.map(t => t.taskDate)]));
    pushPlannerUndoSnapshot(
      `Auto-Rescheduled ${overduePendingTasks.length} tasks (${todaySlottedTasks.length} today, ${overflowTasks.length} upcoming blocks)`,
      affectedDates
    );

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        const newDate = taskToNewDate[t.id];
        if (newDate) {
          return {
            ...t,
            due: newDate,
            taskDate: newDate
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_system_sync'));
    } else {
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      try {
        for (const [tId, newDate] of Object.entries(taskToNewDate)) {
          const taskDocRef = firestoreDoc(db, 'users', user.uid, 'tasks', tId);
          await setDoc(taskDocRef, { due: newDate, taskDate: newDate }, { merge: true });
        }
        setSyncStatus('Synced');
        window.dispatchEvent(new Event('practca_tasks_updated'));
      } catch (err) {
        setErrorMsg('Failed to auto-reschedule overdue tasks.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  // ⚡ 1-Click Roll Forward to Today: Batch migrate all uncompleted tasks from earlier dates
  const handleRollForwardToToday = async () => {
    if (overduePendingTasks.length === 0) return;
    const today = getSystemLocalDateString();
    const affectedDates = Array.from(new Set([today, ...overduePendingTasks.map(t => t.taskDate)]));
    pushPlannerUndoSnapshot(`Rolled Forward ${overduePendingTasks.length} backlog targets to ${today}`, affectedDates);

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        const matched = mappedTasks.find(mt => mt.id === t.id);
        if (matched && matched.status === 'needsAction' && matched.taskDate < today) {
          if (isChapterAlreadyOnDate(matched.subjectCode, matched.cleanTitle, today, tasks, t.id)) {
            return t;
          }
          return {
            ...t,
            due: today,
            taskDate: today
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_system_sync'));
    } else {
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      try {
        for (const t of overduePendingTasks) {
          const taskDocRef = firestoreDoc(db, 'users', user.uid, 'tasks', t.id);
          await setDoc(taskDocRef, { due: today, taskDate: today }, { merge: true });
        }
        setSyncStatus('Synced');
        window.dispatchEvent(new Event('practca_tasks_updated'));
      } catch (err) {
        setErrorMsg('Failed to roll forward overdue backlog tasks.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  // ⚡ 1-Click Smart Spread: Intelligently balance pending backlog across upcoming study days
  const handleSmartSpreadOverdue = async () => {
    if (overduePendingTasks.length === 0) return;
    const today = getSystemLocalDateString();
    const todayTasksCount = tasks.filter(t => (t.due || t.taskDate)?.split('T')[0] === today && t.status === 'needsAction').length;
    const startOffset = todayTasksCount >= 3 ? 1 : 0;
    
    const targetDates: string[] = [];
    const baseD = new Date();
    for (let i = startOffset; i < startOffset + 5; i++) {
      const nextD = new Date(baseD.getTime() + i * 24 * 60 * 60 * 1000);
      const y = nextD.getFullYear();
      const m = String(nextD.getMonth() + 1).padStart(2, '0');
      const d = String(nextD.getDate()).padStart(2, '0');
      targetDates.push(`${y}-${m}-${d}`);
    }

    const affectedDates = Array.from(new Set([...targetDates, ...overduePendingTasks.map(t => t.taskDate)]));
    pushPlannerUndoSnapshot(`Smart Spread ${overduePendingTasks.length} backlog targets across ${targetDates.length} days`, affectedDates);

    const taskToNewDate: Record<string, string> = {};
    overduePendingTasks.forEach((t, idx) => {
      const targetDate = targetDates[idx % targetDates.length];
      taskToNewDate[t.id] = targetDate;
    });

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const updatedTasks = tasks.map(t => {
        const newDate = taskToNewDate[t.id];
        if (newDate) {
          return { ...t, due: newDate, taskDate: newDate };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_system_sync'));
    } else {
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      try {
        for (const [tId, newDate] of Object.entries(taskToNewDate)) {
          const taskDocRef = firestoreDoc(db, 'users', user.uid, 'tasks', tId);
          await setDoc(taskDocRef, { due: newDate, taskDate: newDate }, { merge: true });
        }
        setSyncStatus('Synced');
        window.dispatchEvent(new Event('practca_tasks_updated'));
      } catch (err) {
        setErrorMsg('Failed to spread overdue tasks.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  // ⚡ 1-Click Batch Complete Selected Day: Auto-completes all remaining tasks for the active day
  const handleBatchCompleteSelectedDay = async () => {
    const pendingOnDay = selectedDayTasks.filter(t => t.status === 'needsAction');
    if (pendingOnDay.length === 0) return;
    pushPlannerUndoSnapshot(`Batch completed ${pendingOnDay.length} targets on ${selectedDate}`, [selectedDate]);

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const completionIso = new Date().toISOString();
      const updatedTasks = tasks.map(t => {
        const match = pendingOnDay.find(pt => pt.id === t.id);
        if (match) {
          return {
            ...t,
            status: 'completed' as const,
            completed: completionIso
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      
      for (const pt of pendingOnDay) {
        await syncTaskCompletionAcrossAllLinks(pt, true, { selectedDate });
      }
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_system_sync'));
    } else {
      for (const pt of pendingOnDay) {
        await executeToggleTaskCompleted(pt, 'completed');
      }
    }
  };

  // Mass Reschedule All Missed Targets to Today
  const handleRescheduleAllMissedToToday = async () => {
    const today = getSystemLocalDateString();
    const targetsToMove = allMissedTasks;
    if (targetsToMove.length === 0) return;

    if (isLocalMode) {
      triggerLocalSaveStatus();
      const targetIds = new Set(targetsToMove.map(t => t.id));
      const updatedTasks = tasks.map(t => {
        if (targetIds.has(t.id)) {
          const rawNotes = t.notes || '';
          const cleaned = rawNotes.replace(/STATUS:\s*UNACHIEVED\n?/gi, '').trim();
          return {
            ...t,
            due: today,
            status: 'needsAction' as any,
            notes: cleaned,
            completed: undefined
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
    } else {
      if (!user) return;
      setSyncStatus('Saving...');
      setLoading(true);
      setErrorMsg(null);
      try {
        for (const t of targetsToMove) {
          const rawNotes = t.notes || '';
          const cleaned = rawNotes.replace(/STATUS:\s*UNACHIEVED\n?/gi, '').trim();
          const taskDocRef = firestoreDoc(db, 'users', user.uid, 'tasks', t.id);
          await setDoc(taskDocRef, {
            due: today,
            status: 'needsAction',
            notes: cleaned,
            completed: null
          }, { merge: true });
        }
        setSyncStatus('Synced');
      } catch (err: any) {
        console.error(err);
        setErrorMsg('Failed to mass-reschedule missed targets.');
        setSyncStatus('Sync Error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate master stats mathematically for the selected day
  const totalCount = selectedDayTasks.length;
  const completedCount = selectedDayCompleted.length;
  const pendingCount = selectedDayActive.length;
  const unachievedCount = selectedDayUnachieved.length;
  // If there are unachieved tasks, they stay in total and represent missed targets, so completion rate remains realistic!
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Relevance weights for sorting
  const relevanceWeights = { 
    'Final Revision': 3, 'Revision': 2, 'General': 1,
    'High': 3, 'Medium': 2, 'Low': 1 // compatibility
  };

  // Sort logic for active tasks
  const sortedActiveTasks = React.useMemo(() => {
    return [...filteredActiveTasks].sort((a, b) => {
      const aRel = a.relevance || a.priority || 'Revision';
      const bRel = b.relevance || b.priority || 'Revision';
      if (sortBy === 'manual') {
        const posA = a.position !== undefined ? a.position : 0;
        const posB = b.position !== undefined ? b.position : 0;
        if (posA !== posB) return posA - posB;
        // fallback to relevance
        const diff = relevanceWeights[bRel] - relevanceWeights[aRel];
        if (diff !== 0) return diff;
        return (a.cleanTitle || a.title).localeCompare(b.cleanTitle || b.title);
      }
      if (sortBy === 'urgency') {
        const diff = relevanceWeights[bRel] - relevanceWeights[aRel];
        if (diff !== 0) return diff;
        return (a.cleanTitle || a.title).localeCompare(b.cleanTitle || b.title);
      }
      if (sortBy === 'subject') {
        const diff = (a.subjectCode || '').localeCompare(b.subjectCode || '');
        if (diff !== 0) return diff;
        return relevanceWeights[bRel] - relevanceWeights[aRel];
      }
      if (sortBy === 'alphabetical') {
        return (a.cleanTitle || a.title).localeCompare(b.cleanTitle || b.title);
      }
      return 0;
    });
  }, [filteredActiveTasks, sortBy]);

  // Recharts structures strictly for the selected active study day
  const priorityChartData = React.useMemo(() => {
    const categories: ('General' | 'Revision' | 'Final Revision')[] = ['General', 'Revision', 'Final Revision'];
    return categories.map(c => {
      const match = selectedDayTasks.filter(t => (t.relevance || (t.priority === 'High' ? 'Final Revision' : t.priority === 'Low' ? 'General' : 'Revision')) === c);
      const label = c === 'General' ? '🔵 G' : c === 'Revision' ? '🟡 R' : '🔴 L';
      return {
        priority: label, // keep key as priority for Recharts backward compatibility
        relevance: label,
        Active: match.filter(t => t.status === 'needsAction').length,
        Completed: match.filter(t => t.status === 'completed').length,
        Unachieved: match.filter(t => t.status === 'unachieved').length,
      };
    });
  }, [selectedDayTasks]);

  const subjectChartData = React.useMemo(() => {
    const subjects = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
    return subjects.map(s => {
      const match = selectedDayTasks.filter(t => t.subjectCode === s);
      return {
        subject: s,
        Active: match.filter(t => t.status === 'needsAction').length,
        Completed: match.filter(t => t.status === 'completed').length,
        Unachieved: match.filter(t => t.status === 'unachieved').length,
      };
    });
  }, [selectedDayTasks]);

  // Group daily tasks by subject dynamically into dedicated checklists
  const subjectChecklistGroups = React.useMemo(() => {
    const groups: {
      subjectCode: string;
      subjectName: string;
      activeTasks: GoogleTask[];
      completedTasks: GoogleTask[];
      colorInfo: { text: string; bg: string; border: string; glow: string; colorCode: string };
      completionRate: number;
    }[] = [];
    const standardSubjects: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];

    // Collect all subjects that have active or completed tasks for this day
    const presentSubjects = new Set<string>();
    sortedActiveTasks.forEach(t => presentSubjects.add(t.subjectCode || 'IDT'));
    selectedDayCompletedTasks.forEach(t => presentSubjects.add(t.subjectCode || 'IDT'));

    let subjectKeys: string[] = [];
    if (filterSubject !== 'ALL') {
      subjectKeys = [filterSubject];
    } else {
      subjectKeys = [
        ...standardSubjects.filter(s => presentSubjects.has(s)),
        ...Array.from(presentSubjects).filter(s => !standardSubjects.includes(s as SubjectId))
      ];
    }

    subjectKeys.forEach(subKey => {
      const subActive = sortedActiveTasks.filter(t => (t.subjectCode || 'IDT') === subKey);
      const subCompleted = selectedDayCompletedTasks.filter(t => (t.subjectCode || 'IDT') === subKey);

      if (subActive.length > 0 || subCompleted.length > 0 || filterSubject !== 'ALL') {
        const colorInfo = SUBJECT_COLORS[subKey as SubjectId] || {
          text: 'text-indigo-400',
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/20',
          glow: 'shadow-indigo-500/10',
          colorCode: '#6366f1'
        };
        const total = subActive.length + subCompleted.length;
        const rate = total > 0 ? Math.round((subCompleted.length / total) * 100) : 0;

        groups.push({
          subjectCode: subKey,
          subjectName: SUBJECT_NAMES[subKey as SubjectId] || subKey,
          activeTasks: subActive,
          completedTasks: subCompleted,
          colorInfo,
          completionRate: rate
        });
      }
    });

    return groups;
  }, [sortedActiveTasks, selectedDayCompletedTasks, filterSubject]);

  const unusedSubjects = React.useMemo(() => {
    const standardSubjects: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
    const activeSubjectSet = new Set(subjectChecklistGroups.map(g => g.subjectCode));
    return standardSubjects.filter(s => !activeSubjectSet.has(s));
  }, [subjectChecklistGroups]);

  const toggleSubjectCollapse = (subjectCode: string) => {
    setCollapsedSubjectChecklists(prev => ({
      ...prev,
      [subjectCode]: !prev[subjectCode]
    }));
  };

  const toggleSubjectCompletedExpanded = (subjectCode: string) => {
    setExpandedSubjectCompleted(prev => ({
      ...prev,
      [subjectCode]: !prev[subjectCode]
    }));
  };

  const handleToggleSelectSubjectTasks = (subjectTasks: GoogleTask[]) => {
    const ids = subjectTasks.map(t => t.id);
    const allSelected = ids.length > 0 && ids.every(id => selectedTaskIds.includes(id));
    if (allSelected) {
      setSelectedTaskIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedTaskIds(prev => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleQuickAddForSubject = (sub: string, chapter?: string) => {
    if (sub && isSubjectLockedAfterFinalExam(sub)) {
      setAutoBatchBannerMsg(
        `🔒 [${sub}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`
      );
      setTimeout(() => setAutoBatchBannerMsg(null), 4500);
      return;
    }
    setNewTaskSubject(sub);
    setActiveSyllabusSubject(sub as SubjectId);
    setNewTaskTitle('');
    setNewTaskNotes('');
    if (chapter) {
      setNewTaskChapter(chapter);
      setTargetSourceMode('other');
      setAddTargetTab('custom');
    } else {
      const chaps = SUBJECT_CHAPTERS[sub] || [];
      if (chaps.length > 0) {
        setNewTaskChapter(chaps[0]);
      } else {
        setNewTaskChapter('General / Entire Subject');
      }
      const activeCp = activeMilestoneCheckpoint || sortedRoadmapCheckpoints[0];
      const isMilestoneSubject = activeCp && activeCp.subjectId !== 'CUSTOM' && activeCp.subjectId === sub;
      if (sortedRoadmapCheckpoints.length > 0 && isMilestoneSubject) {
        setTargetSourceMode('milestone');
      } else {
        setTargetSourceMode('other');
      }
    }
    setShowAddTargetModal(true);
  };

  // Sequential Batch 1, Batch 2, ..., Batch N mapping for distinct clubGroupIds on the selected day
  const dailyClubBatchNumberMap = React.useMemo(() => {
    const map = new Map<string, number>();
    let counter = 1;
    selectedDayTasks.forEach(t => {
      const cId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
      if (cId && !map.has(cId)) {
        map.set(cId, counter++);
      }
    });
    return map;
  }, [selectedDayTasks]);

  // Helper to sync updated task durations directly into 24-hour target clock slots for the active date
  const syncClockSlotsForTasks = (dateStr: string, updatedTasksList: any[], affectedTaskIds: Set<string>) => {
    try {
      const clockKey = `practca_24h_target_clock_${dateStr}`;
      const rawClock = localStorage.getItem(clockKey);
      if (!rawClock) return;
      const parsedClock = JSON.parse(rawClock);
      if (!Array.isArray(parsedClock)) return;

      const affectedTasks = updatedTasksList.filter(t => affectedTaskIds.has(t.id));
      if (affectedTasks.length === 0) return;

      let clockChanged = false;
      const updatedSlots = parsedClock.map((slot: any) => {
        const slotNorm = normalizeKey(slot.title || slot.chapter || '');
        const matchedTask = affectedTasks.find(t => {
          const tNorm = normalizeKey(t.cleanTitle || t.title || '');
          return (
            slot.id === t.id ||
            slot.taskId === t.id ||
            (Array.isArray(slot.sourceTaskIds) && slot.sourceTaskIds.includes(t.id)) ||
            (slotNorm && tNorm && slotNorm === tNorm)
          );
        });
        if (!matchedTask) return slot;

        // If slot represents a multi-target batch, sum the updated club members
        if (Array.isArray(slot.sourceTaskIds) && slot.sourceTaskIds.length > 1) {
          const batchSum = updatedTasksList
            .filter(ut => slot.sourceTaskIds.includes(ut.id))
            .reduce((acc, ut) => acc + (Number(ut.targetDurationMinutes) || 0), 0);
          if (batchSum > 0) {
            clockChanged = true;
            const nextSlot = { ...slot, durationMinutes: batchSum, totalTargetMinutes: batchSum };
            delete nextSlot.originalDurationMinutes;
            delete nextSlot.earlySavedMinutes;
            return nextSlot;
          }
          return slot;
        }

        const nextMins = Number(matchedTask.targetDurationMinutes) || Number(matchedTask.duration) || 0;
        if (nextMins <= 0) return slot;
        clockChanged = true;
        const nextSlot: any = {
          ...slot,
          durationMinutes: nextMins,
          totalTargetMinutes: nextMins
        };
        delete nextSlot.originalDurationMinutes;
        delete nextSlot.earlySavedMinutes;
        if (typeof slot.startMinutes === 'number') {
          const newEnd = (slot.startMinutes + nextMins) % 1440;
          nextSlot.endMinutes = newEnd;
          const eh = Math.floor(newEnd / 60);
          const em = newEnd % 60;
          nextSlot.endTime = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
        }
        return nextSlot;
      });

      if (clockChanged) {
        localStorage.setItem(clockKey, JSON.stringify(updatedSlots));
      }
    } catch (e) {}
  };

  // Update an individual unbatched task's duration (with 1-minute precision)
  const handleUpdateSingleTaskDuration = async (taskId: string, newMins: number) => {
    const validMins = Math.max(1, Math.min(720, Math.round(Number(newMins) || 1)));
    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    let updatedTaskObj: any = null;
    const updatedTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      const strippedNotes = (t.notes || '')
        .split('\n')
        .filter(line => !line.trim().toUpperCase().startsWith('TARGETDURATIONMINUTES:'))
        .join('\n')
        .trim();
      const updatedNotes = `${strippedNotes}\nTargetDurationMinutes: ${validMins}`.trim();
      durationsMap[t.id] = validMins;
      if (t.cleanTitle || t.title) {
        durationsMap[t.cleanTitle || t.title] = validMins;
        durationsMap[normalizeKey(t.cleanTitle || t.title)] = validMins;
      }
      const nextTask = {
        ...t,
        notes: updatedNotes,
        targetDurationMinutes: validMins,
        duration: validMins
      };
      delete nextTask.originalTargetDurationMinutes;
      delete nextTask.earlyCompletionSavedMinutes;
      updatedTaskObj = nextTask;
      return nextTask;
    });

    setTasks(updatedTasks);
    triggerLocalSaveStatus();
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
      if (updatedTaskObj) {
        const aftRaw = localStorage.getItem('practca_active_focus_task');
        if (aftRaw) {
          const aftParsed = JSON.parse(aftRaw);
          if (
            aftParsed &&
            (aftParsed.id === taskId ||
              normalizeKey(aftParsed.cleanTitle || aftParsed.title || '') ===
                normalizeKey(updatedTaskObj.cleanTitle || updatedTaskObj.title || ''))
          ) {
            aftParsed.targetDurationMinutes = validMins;
            localStorage.setItem('practca_active_focus_task', JSON.stringify(aftParsed));
            window.dispatchEvent(new CustomEvent('practca_active_task_duration_adjusted', {
              detail: {
                taskTitle: aftParsed.title,
                activeFocusTask: aftParsed,
                newTotalMinutes: validMins,
                date: selectedDate
              }
            }));
          }
        }
      }
      syncClockSlotsForTasks(selectedDate, updatedTasks, new Set([taskId]));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_task_target_durations_update'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: durationsMap, removedTargetNames: [] }
      }));
    } catch (e) {}

    if (!isLocalMode && user && updatedTaskObj) {
      try {
        await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', taskId), updatedTaskObj).catch(() => {});
      } catch (e) {}
    }
  };

  // Cycle milestone revision cycle strictly for Revision Report chapters
  const handleCycleTaskMilestone = async (task: any) => {
    const match = matchTaskToChapter(task);
    if (!match) return;
    const sub = (match.subjectCode || task.subjectCode || 'IDT') as SubjectId;
    const parsedChName = match.chapterName;

    const activeRevInfo = getActiveRevisionMilestone(sub, parsedChName, task);
    const cycleSequence = [...(activeRevInfo.dynamicRevKeys || ['rev1', 'rev2', 'rev3']), 'rev1.5'];

    let currentKey = task.revKey;
    if (!currentKey) {
      if (task.relevance === 'Final Revision') {
        currentKey = 'rev1.5';
      } else {
        currentKey = activeRevInfo.key || 'rev1';
      }
    }

    const curIdx = cycleSequence.indexOf(currentKey);
    const nextRevKey = cycleSequence[(curIdx + 1) % cycleSequence.length] || 'rev1';
    const nextRelevance: 'General' | 'Revision' | 'Final Revision' = nextRevKey === 'rev1.5' ? 'Final Revision' : 'Revision';

    const nextMilestoneId = task.milestoneId || (activeMilestoneCheckpoint?.id || undefined);

    const updatedTasks = tasks.map(t => {
      if (t.id !== task.id) return t;
      const strippedNotes = (t.notes || '')
        .split('\n')
        .filter(l => !l.toUpperCase().startsWith('REVKEY:') && !l.toUpperCase().startsWith('MILESTONEID:'))
        .join('\n')
        .trim();
      const updatedNotes = `${strippedNotes}${nextMilestoneId ? `\nMilestoneId: ${nextMilestoneId}` : ''}\nRevKey: ${nextRevKey}`.trim();
      return {
        ...t,
        notes: updatedNotes,
        relevance: nextRelevance,
        revKey: nextRevKey as any,
        milestoneId: nextMilestoneId
      };
    });

    setTasks(updatedTasks);
    triggerLocalSaveStatus();
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('practca_tasks_updated'));
    } catch (e) {}

    // Only mark completed in Revision Planner if the task itself is already completed
    if (task.status === 'completed') {
      syncRevisionPlannerState(sub, parsedChName, nextRevKey);
    }
  };

  // Launch Focus mode / Grind Clock timer for a task
  const handleStartFocusForTaskRow = (task: any) => {
    if (task.subjectCode && isSubjectLockedAfterFinalExam(task.subjectCode)) {
      setErrorMsg(`🔒 [${task.subjectCode}] Final Exam & 1.5-Day Sprint are completed. This subject is locked.`);
      return;
    }
    if (task.status === 'completed') {
      setErrorMsg("⚠️ Task is completed and cannot be linked unless restored back from completion.");
      return;
    }
    if (onStartFocusForTask) {
      let parsedChName: string | undefined = undefined;
      const notesStr = task.notes || '';
      if (notesStr.includes('Chapter: ')) {
        const after = notesStr.substring(notesStr.indexOf('Chapter: ') + 9).trim();
        const lineEnd = after.indexOf('\n');
        parsedChName = lineEnd !== -1 ? after.substring(0, lineEnd).trim() : after;
      }
      if (!parsedChName) {
        const match = matchTaskToChapter(task);
        parsedChName = match?.chapterName;
      }
      const sub = (task.subjectCode || 'IDT') as SubjectId;
      let detectedRevKey: 'rev1' | 'rev2' | 'rev3' | 'rev1.5' | undefined = undefined;
      const combined = `${task.title} ${notesStr}`.toUpperCase();
      if (task.relevance === 'Final Revision' || combined.match(/\b(FINAL REVISION|1\.5\s*DAY|1\.5D|R1\.5|REV\s*1\.5|REVISION\s*1\.5)\b/)) {
        detectedRevKey = 'rev1.5';
      } else if (combined.match(/\b(R3|REV\s*3|REVISION\s*3)\b/)) {
        detectedRevKey = 'rev3';
      } else if (combined.match(/\b(R2|REV\s*2|REVISION\s*2)\b/)) {
        detectedRevKey = 'rev2';
      } else if (combined.match(/\b(R1|REV\s*1|REVISION\s*1)\b/)) {
        detectedRevKey = 'rev1';
      } else if (parsedChName) {
        const milestone = getActiveRevisionMilestone(sub, parsedChName);
        detectedRevKey = milestone?.key;
      }

      let durationsMap: Record<string, number> = {};
      try {
        const rawTgt = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
        if (rawTgt) durationsMap = JSON.parse(rawTgt);
      } catch (e) {}

      // Prioritize the individual task's own allocated duration FIRST over clubTotalMinutes
      let taskTargetMins =
        Number((task as any).targetDurationMinutes) ||
        Number((task as any).duration) ||
        Number(durationsMap[task.id]) ||
        Number(durationsMap[task.cleanTitle || task.title]) ||
        Number(durationsMap[normalizeKey(task.cleanTitle || task.title)]) ||
        0;

      // If part of a clubbed batch, populate Target Flow for the batch with each peer's individual duration
      if (task.clubGroupId) {
        const allClubPeers = mappedTasks
          .filter(t => t.clubGroupId === task.clubGroupId && t.status !== 'unachieved')
          .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));
        const batchPeers = allClubPeers.length > 0
          ? allClubPeers
          : selectedDayTasks
              .filter(t => t.clubGroupId === task.clubGroupId && t.status !== 'unachieved')
              .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));
        const clubTotalMins =
          Number((task as any).clubTotalMinutes) ||
          batchPeers.reduce((acc, p) => acc + (Number(p.targetDurationMinutes) || 45), 0) ||
          180;
        if (!taskTargetMins || (batchPeers.length > 1 && taskTargetMins === clubTotalMins)) {
          taskTargetMins = Math.max(15, Math.round(clubTotalMins / Math.max(1, batchPeers.length)));
        }
        if (batchPeers.length > 0) {
          const flowSeq = batchPeers.map((pt, idx) => {
            const rawPeerMins = Number(pt.targetDurationMinutes) || Number(pt.duration) || Number(durationsMap[pt.id]) || 0;
            const peerMins = pt.id === task.id
              ? taskTargetMins
              : (rawPeerMins > 0 && !(batchPeers.length > 1 && rawPeerMins === clubTotalMins)
                  ? rawPeerMins
                  : Math.max(15, Math.round(clubTotalMins / batchPeers.length)));
            if (pt.id) durationsMap[pt.id] = peerMins;
            const ptClean = pt.cleanTitle || pt.title;
            if (ptClean) {
              durationsMap[ptClean] = peerMins;
              durationsMap[normalizeKey(ptClean)] = peerMins;
            }
            return {
              id: `flow_${pt.id}_${idx}`,
              taskId: pt.id,
              title: pt.cleanTitle || pt.title,
              cleanTitle: pt.cleanTitle || pt.title,
              subjectCode: (pt.subjectCode || sub) as SubjectId,
              chapterName: pt.chapterName || pt.cleanTitle || pt.title,
              relevance: (pt.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision',
              revKey: pt.revKey,
              dueDate: pt.due || `${task.taskDate || selectedDate}T09:00:00.000Z`,
              status: pt.status === 'completed'
                ? ('completed' as const)
                : pt.id === task.id
                  ? ('active' as const)
                  : ('pending' as const),
              duration: peerMins,
              targetDurationMinutes: peerMins,
              clubGroupId: task.clubGroupId,
              clubTotalMinutes: clubTotalMins,
              clubOrder: idx
            };
          });
          try {
            localStorage.setItem(getLevelScopedKey('practca_target_flow'), JSON.stringify(flowSeq));
            localStorage.setItem('practca_flow_active', 'true');
            window.dispatchEvent(new Event('practca_flow_updated'));
            window.dispatchEvent(new Event('practca_target_flow_updated'));
          } catch (e) {}
        }
      }

      taskTargetMins = taskTargetMins || 45;
      try {
        if (task.id) durationsMap[task.id] = taskTargetMins;
        const cleanT = task.cleanTitle || task.title;
        if (cleanT) {
          durationsMap[cleanT] = taskTargetMins;
          durationsMap[normalizeKey(cleanT)] = taskTargetMins;
        }
        localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
        window.dispatchEvent(new Event('practca_task_target_durations_update'));
      } catch (e) {}

      onStartFocusForTask(
        sub,
        task.cleanTitle || task.title,
        taskTargetMins,
        parsedChName,
        task.relevance,
        task.due || `${task.taskDate || selectedDate}T09:00:00.000Z`,
        detectedRevKey,
        task.id
      );
    }
  };

  const getTaskCompletionVisualStatus = (task: any): 'completed' | 'partially_done' | 'skipped' | 'pending' => {
    if (!task) return 'pending';
    if (task.status === 'completed') return 'completed';
    if (task.status === 'unachieved') return 'skipped';

    const notesUpper = String(task.notes || '').toUpperCase();
    if ((task as any).partiallyDone || notesUpper.includes('STATUS: PARTIAL')) {
      return 'partially_done';
    }
    if ((task as any).skipped || notesUpper.includes('STATUS: SKIPPED')) {
      return 'skipped';
    }

    const match = matchTaskToChapter(task);
    if (match && match.chapterName) {
      const sub = (match.subjectCode || task.subjectCode || 'IDT') as SubjectId;
      const activeRev = getActiveRevisionMilestone(sub, match.chapterName, task);
      const revKey = task.revKey || activeRev?.key || 'rev1';
      try {
        const raw = localStorage.getItem(`practca_revision_planner_${sub}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const chapters = parsed.chapters || parsed || {};
          const cell = chapters[match.chapterName]?.[revKey];
          if (cell) {
            const hrVal = parseFloat(cell.hours || '0') || 0;
            if (cell.completed || cell.statusTag === 'completed') return 'completed';
            if (
              cell.partiallyDone ||
              cell.statusTag === 'partially_done' ||
              (cell.skipped && hrVal > 0) ||
              (!cell.skipped && cell.statusTag !== 'skipped' && cell.statusTag !== 'none' && hrVal > 0)
            ) {
              return 'partially_done';
            }
            if (cell.skipped || cell.statusTag === 'skipped') return 'skipped';
          }
        }
      } catch (e) {}
    }

    return 'pending';
  };

  const renderTaskItem = (task: any, isGrouped: boolean = false, idx?: number) => {
    const isDragged = draggedTaskId === task.id;
    const isDragOver = dragOverTaskId === task.id;
    const cleanedNoteText = cleanTaskNotes(task.notes);
    const isEditingNote = inlineNotesTaskId === task.id;
    const batchNum = task.clubGroupId ? dailyClubBatchNumberMap.get(task.clubGroupId) : undefined;
    const currentTaskMins = task.status === 'completed' && task.targetDurationMinutes === 0
      ? 0
      : (Number(task.targetDurationMinutes) || Number(task.duration) || 45);

    // Resolve chapter & active milestone information ONLY if task matches an official Revision Report chapter
    const match = matchTaskToChapter(task);
    const parsedChName = match?.chapterName;
    const sub = (match?.subjectCode || task.subjectCode || 'IDT') as SubjectId;

    let milestoneBadge: string | null = null;
    if (match && parsedChName) {
      const activeRev = getActiveRevisionMilestone(sub, parsedChName, task);
      milestoneBadge = activeRev?.badge || 'R1';
    }

    const visualStatus = getTaskCompletionVisualStatus(task);
    const isPartlyCompleted = visualStatus === 'partially_done';
    const isSkippedStatus = visualStatus === 'skipped';

    const linkedRoadmapCheckpoint = task.milestoneId
      ? roadmapCheckpoints.find(c => c.id === task.milestoneId)
      : (activeMilestoneCheckpoint && (activeMilestoneCheckpoint.subjectId === sub || activeMilestoneCheckpoint.subjectId === 'CUSTOM') ? activeMilestoneCheckpoint : null);

    return (
      <motion.div
        key={`${task.id || 'task'}_active_${idx !== undefined ? idx : ''}`}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        draggable
        onDragStart={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('input, textarea, button, select, [data-no-drag]')) {
            e.preventDefault();
            return;
          }
          handleDragStart(e, task.id);
        }}
        onDragOver={(e) => handleDragOver(e, task.id)}
        onDragLeave={() => {
          if (dragOverTaskId === task.id) {
            setDragOverTaskId(null);
            setDropPlacement(null);
          }
        }}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, task.id)}
        className={`group relative px-3 py-2 rounded-xl border transition-all duration-150 cursor-default select-none
          ${isPartlyCompleted
            ? 'bg-amber-500/15 hover:bg-amber-500/20 border-amber-500/45 shadow-[inset_0_0_12px_rgba(245,158,11,0.08)]'
            : isSkippedStatus
              ? 'bg-rose-500/15 hover:bg-rose-500/20 border-rose-500/40 shadow-[inset_0_0_12px_rgba(244,63,94,0.08)]'
              : 'bg-slate-950 hover:bg-slate-900/80'}
          ${isDragged ? 'opacity-40 scale-[0.99] border-dashed border-indigo-500/70 bg-indigo-950/30' : ''}
          ${isDragOver ? 'border-[#00f3ff]/70 bg-slate-900/70 shadow-[0_0_14px_rgba(0,243,255,0.15)]' : ''}
          ${!isDragged && !isDragOver && !isPartlyCompleted && !isSkippedStatus ? (milestoneBadge === '1.5D' ? 'border-rose-500/25' : 'border-slate-850 hover:border-slate-700') : ''}`}
      >
        {/* Drop insertion line indicator */}
        {isDragOver && dropPlacement === 'top' && (
          <div className="absolute -top-1.5 left-2 right-2 h-1 bg-[#00f3ff] rounded-full shadow-[0_0_10px_#00f3ff] pointer-events-none z-20 flex items-center justify-between">
            <div className="h-2 w-2 rounded-full bg-[#00f3ff] -ml-1 ring-2 ring-slate-950" />
            <div className="h-2 w-2 rounded-full bg-[#00f3ff] -mr-1 ring-2 ring-slate-950" />
          </div>
        )}
        {isDragOver && dropPlacement === 'bottom' && (
          <div className="absolute -bottom-1.5 left-2 right-2 h-1 bg-[#00f3ff] rounded-full shadow-[0_0_10px_#00f3ff] pointer-events-none z-20 flex items-center justify-between">
            <div className="h-2 w-2 rounded-full bg-[#00f3ff] -ml-1 ring-2 ring-slate-950" />
            <div className="h-2 w-2 rounded-full bg-[#00f3ff] -mr-1 ring-2 ring-slate-950" />
          </div>
        )}

        {/* Single-Line Compact Row */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Left Side: Drag Handle + Checkbox + Complete + Subject + Milestone Trigger + Batch + Title */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div 
              className="text-slate-600 group-hover:text-slate-400 hover:!text-[#00f3ff] cursor-grab active:cursor-grabbing p-0.5 -ml-1 shrink-0 select-none transition-colors rounded"
              title="Drag to reorder study priority"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </div>

            <input
              type="checkbox"
              checked={selectedTaskIds.includes(task.id)}
              onChange={() => handleToggleTaskSelection(task.id)}
              className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-400 focus:ring-offset-slate-950 cursor-pointer transition shrink-0"
              title="Select target for bulk actions"
            />

            <button
              onClick={() => handleToggleTaskCompleted(task)}
              className="text-slate-500 hover:text-emerald-400 shrink-0 transition cursor-pointer flex items-center"
              title={isPartlyCompleted ? "Partly Completed — Click to Mark Completed" : "Mark Completed"}
            >
              {isPartlyCompleted ? (
                <span className="h-3.5 w-3.5 m-[1px] rounded-[3px] bg-amber-400 border border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.45)] inline-block shrink-0" />
              ) : isSkippedStatus ? (
                <span className="h-3.5 w-3.5 m-[1px] rounded-[3px] bg-rose-400/40 border border-rose-400/80 inline-block shrink-0" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </button>

            {!isGrouped && (
              <span 
                onClick={(e) => { e.stopPropagation(); startEditingTask(task); }}
                className="text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-[#00f3ff] text-slate-300 rounded font-mono select-none leading-none cursor-pointer transition-colors shrink-0"
                title="Click to edit subject"
              >
                {task.subjectCode}
              </span>
            )}

            {/* Intuitive Milestone Trigger Badge — Strictly shown ONLY for chapters listed in the Revision Report */}
            {match && milestoneBadge && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCycleTaskMilestone(task);
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold leading-none cursor-pointer transition-all flex items-center gap-1 shrink-0 shadow-2xs ${
                  milestoneBadge === '1.5D'
                    ? 'bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300'
                    : milestoneBadge === 'R3'
                      ? 'bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-300'
                      : milestoneBadge === 'R2'
                        ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300'
                        : milestoneBadge === 'G'
                          ? 'bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300'
                          : 'bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/35 text-indigo-300'
                }`}
                title={`Milestone Revision: ${milestoneBadge} (Click to switch milestone cycle)`}
              >
                <Flag className="h-2.5 w-2.5 opacity-80" />
                <span>{milestoneBadge}</span>
                {linkedRoadmapCheckpoint && (
                  <span className="text-[8px] opacity-60 font-normal">#{linkedRoadmapCheckpoint.revisionCycle || 'MS'}</span>
                )}
              </button>
            )}

            {batchNum !== undefined && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBatchInspector({
                    source: 'daily_planner',
                    clubGroupId: task.clubGroupId,
                    batchNumber: batchNum,
                    dateStr: selectedDate,
                  });
                }}
                className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white text-[9px] font-mono font-black shrink-0 leading-none cursor-pointer transition flex items-center gap-1 shadow-xs"
                title={`Click to open Batch ${batchNum} Editor & Inspector`}
              >
                <Layers className="h-2.5 w-2.5" />
                <span>Batch {batchNum}</span>
              </button>
            )}

            <p
              onClick={() => startEditingTask(task)}
              className="text-xs font-bold text-white tracking-tight truncate font-sans flex-1 cursor-pointer hover:text-[#00f3ff] transition-colors"
              title={task.cleanTitle}
            >
              {task.cleanTitle}
            </p>

            {cleanedNoteText && !isEditingNote && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setInlineNotesTaskId(task.id);
                  setInlineNotesValue(cleanedNoteText);
                }}
                className="px-1.5 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 text-[9px] font-mono font-bold shrink-0 cursor-pointer transition max-w-[140px] truncate"
                title={`Note: ${cleanedNoteText} (Click to edit)`}
              >
                📝 {cleanedNoteText}
              </button>
            )}
          </div>

          {/* Right Side: Flexible Time Adjuster + Primary Focus CTA + Consolidated Action Menu */}
          <div className="flex items-center gap-1.5 shrink-0" data-row-menu-container>
            {!task.clubGroupId && (
              <div
                data-no-drag
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-1 py-0.5 gap-0.5 font-mono text-[9.5px]"
                title="Adjust planned time by ±15m, ±1m, or type exact minutes"
              >
                <button
                  type="button"
                  onClick={() => handleUpdateSingleTaskDuration(task.id, Math.max(1, currentTaskMins - 15))}
                  className="text-slate-400 hover:text-white font-bold px-1 cursor-pointer"
                  title="-15m"
                >
                  -15
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSingleTaskDuration(task.id, Math.max(1, currentTaskMins - 1))}
                  className="text-slate-400 hover:text-cyan-300 font-bold px-0.5 cursor-pointer"
                  title="-1m"
                >
                  -1
                </button>
                <input
                  type="number"
                  min={1}
                  max={720}
                  step={1}
                  value={currentTaskMins}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) {
                      handleUpdateSingleTaskDuration(task.id, val);
                    }
                  }}
                  className="w-9 bg-slate-950/80 border border-slate-800 rounded text-center text-amber-300 font-black text-[9.5px] focus:outline-none focus:border-cyan-400"
                  title="Type exact minutes"
                />
                <span className="text-[8.5px] text-slate-400">m</span>
                <button
                  type="button"
                  onClick={() => handleUpdateSingleTaskDuration(task.id, Math.min(720, currentTaskMins + 1))}
                  className="text-slate-400 hover:text-cyan-300 font-bold px-0.5 cursor-pointer"
                  title="+1m"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateSingleTaskDuration(task.id, Math.min(720, currentTaskMins + 15))}
                  className="text-slate-400 hover:text-white font-bold px-1 cursor-pointer"
                  title="+15m"
                >
                  +15
                </button>
              </div>
            )}

            {/* Primary Action: 1-Click Focus button */}
            <button
              onClick={() => handleStartFocusForTaskRow(task)}
              className="px-2.5 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-lg text-[9.5px] font-black transition cursor-pointer flex items-center gap-1 font-sans shrink-0 shadow-xs"
              title="Link to Focus Timer & track time for this task"
            >
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>Focus</span>
            </button>

            {/* Consolidated Action Menu (⋯ / MoreVertical) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveRowMenuTaskId(activeRowMenuTaskId === task.id ? null : task.id);
                }}
                className={`h-7 w-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  activeRowMenuTaskId === task.id
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
                }`}
                title="Target Actions & Options"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>

              {/* Consolidated Dropdown Menu */}
              {activeRowMenuTaskId === task.id && (
                <div
                  data-row-menu-dropdown
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-slate-950/98 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn backdrop-blur-md font-sans text-xs"
                >
                  {/* Task Mini Header */}
                  <div className="px-2 py-1 border-b border-slate-850 mb-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="font-extrabold uppercase text-slate-200">{task.subjectCode}</span>
                    {match && milestoneBadge && (
                      <span className="text-amber-400 font-bold">{milestoneBadge} Cycle</span>
                    )}
                  </div>

                  {/* 1. Cycle Milestone Revision (Strictly only for Revision Report chapters) */}
                  {match && milestoneBadge && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCycleTaskMilestone(task);
                        setActiveRowMenuTaskId(null);
                      }}
                      className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-slate-900 text-slate-200 hover:text-amber-300 flex items-center gap-2 transition cursor-pointer text-xs"
                    >
                      <Flag className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="flex-1 font-medium">Cycle Milestone ({milestoneBadge})</span>
                    </button>
                  )}

                  {/* 2. Edit Target Details */}
                  <button
                    type="button"
                    onClick={() => {
                      startEditingTask(task);
                      setActiveRowMenuTaskId(null);
                    }}
                    className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-slate-900 text-slate-200 hover:text-[#00f3ff] flex items-center gap-2 transition cursor-pointer text-xs"
                  >
                    <Edit className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="flex-1 font-medium">Edit Details</span>
                  </button>

                  {/* 3. Move / Reschedule Target Date */}
                  <button
                    type="button"
                    onClick={() => {
                      setRescheduleTask(task);
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      const yr = d.getFullYear();
                      const mn = String(d.getMonth() + 1).padStart(2, '0');
                      const dy = String(d.getDate()).padStart(2, '0');
                      setRescheduleTargetDate(`${yr}-${mn}-${dy}`);
                      setActiveRowMenuTaskId(null);
                    }}
                    className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-slate-900 text-slate-200 hover:text-indigo-300 flex items-center gap-2 transition cursor-pointer text-xs"
                  >
                    <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="flex-1 font-medium">Reschedule Date</span>
                  </button>

                  {/* 4. Add / Edit Note */}
                  <button
                    type="button"
                    onClick={() => {
                      setInlineNotesTaskId(isEditingNote ? null : task.id);
                      setInlineNotesValue(cleanedNoteText || '');
                      setActiveRowMenuTaskId(null);
                    }}
                    className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-slate-900 text-slate-200 hover:text-amber-300 flex items-center gap-2 transition cursor-pointer text-xs"
                  >
                    <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="flex-1 font-medium">{cleanedNoteText ? 'Edit Study Note' : 'Add Study Note'}</span>
                  </button>

                  {/* Move Up / Move Down Priority Row */}
                  <div className="my-1 border-t border-slate-850" />
                  <div className="grid grid-cols-2 gap-1 px-1">
                    <button
                      type="button"
                      onClick={() => handleMoveTaskOrder(task, 'up')}
                      className="px-2 py-1 text-center rounded-md bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-indigo-300 flex items-center justify-center gap-1 transition cursor-pointer text-[10.5px] font-mono"
                      title="Move Up in Priority"
                    >
                      <ChevronUp className="h-3 w-3 text-indigo-400" />
                      <span>Move Up</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveTaskOrder(task, 'down')}
                      className="px-2 py-1 text-center rounded-md bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-indigo-300 flex items-center justify-center gap-1 transition cursor-pointer text-[10.5px] font-mono"
                      title="Move Down in Priority"
                    >
                      <ChevronDown className="h-3 w-3 text-indigo-400" />
                      <span>Move Down</span>
                    </button>
                  </div>

                  <div className="my-1 border-t border-slate-850" />

                  {/* 5. Mark as Missed */}
                  <button
                    type="button"
                    onClick={() => {
                      handleMarkUnachieved(task);
                      setActiveRowMenuTaskId(null);
                    }}
                    className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-rose-950/30 text-rose-300 hover:text-rose-200 flex items-center gap-2 transition cursor-pointer text-xs"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span className="flex-1 font-medium">Mark as Missed</span>
                  </button>

                  {/* 6. Delete Permanently */}
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteTask(task.id, task.title);
                      setActiveRowMenuTaskId(null);
                    }}
                    className="w-full px-2 py-1.5 text-left rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 flex items-center gap-2 transition cursor-pointer text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="flex-1 font-medium">Delete Permanently</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inline Study Note Editor Drawer (only shown when actively editing note) */}
        {isEditingNote && (
          <div className="mt-2 pt-2 border-t border-slate-900 space-y-1.5" onClick={(e) => e.stopPropagation()}>
            <textarea
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 focus:border-[#00f3ff] rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-hidden font-sans resize-y"
              placeholder="Jot down quick reminders, statutory thresholds, formulas, or rules..."
              value={inlineNotesValue}
              onChange={(e) => setInlineNotesValue(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => setInlineNotesTaskId(null)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveInlineNotes(task, inlineNotesValue)}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // Multi-Select Target Clubbing Handlers (Same-Subject Restriction Enforced)
  const selectedActiveObjects = React.useMemo(() => {
    return sortedActiveTasks.filter(t => selectedTaskIds.includes(t.id));
  }, [sortedActiveTasks, selectedTaskIds]);

  const selectedUniqueSubjects = React.useMemo(() => {
    return Array.from(new Set(selectedActiveObjects.map(t => t.subjectCode || 'IDT')));
  }, [selectedActiveObjects]);

  const canClubSelectedTasks = selectedActiveObjects.length >= 2 && selectedUniqueSubjects.length === 1;

  // Live preview of proportionate allocation for the selected tasks before confirming clubbing
  const clubbingPreviewAllocations = React.useMemo(() => {
    if (!canClubSelectedTasks) return [];
    const previewTotalMins = Math.max(15, (Number(clubHoursInput) || 0) * 60 + (Number(clubMinutesInput) || 0));
    return allocateProportionateClubDurations(
      selectedActiveObjects.map(t => ({
        id: t.id,
        subjectCode: t.subjectCode,
        chapterName: t.chapterName || t.cleanTitle || t.title,
        title: t.cleanTitle || t.title,
        relevance: t.relevance === 'Final Revision' ? 'final_revision' : t.relevance === 'General' ? 'general' : 'revision',
        currentTargetMinutes: t.targetDurationMinutes
      })),
      previewTotalMins
    );
  }, [canClubSelectedTasks, selectedActiveObjects, clubHoursInput, clubMinutesInput]);

  const handleClubSelectedTasks = async (customTotalMins?: number) => {
    if (selectedActiveObjects.length < 2) {
      setErrorMsg('Please select at least 2 targets to club into a single time frame.');
      return;
    }
    if (selectedUniqueSubjects.length > 1) {
      setErrorMsg('Only chapters from the same subject can be clubbed into a single time frame.');
      return;
    }

    const totalMins = customTotalMins !== undefined
      ? Math.max(15, customTotalMins)
      : Math.max(15, (Number(clubHoursInput) || 0) * 60 + (Number(clubMinutesInput) || 0));

    const clubGroupId = `club_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const selectedSet = new Set<string>(selectedActiveObjects.map(t => t.id));
    const subjectCode = selectedActiveObjects[0].subjectCode || 'IDT';

    // Allocate proportionate durations across the selected sub-targets based on prior study logs or CA Final best judgment
    const proportionateAllocations = allocateProportionateClubDurations(
      selectedActiveObjects.map(t => ({
        id: t.id,
        subjectCode: t.subjectCode,
        chapterName: t.chapterName || t.cleanTitle || t.title,
        title: t.cleanTitle || t.title,
        relevance: t.relevance === 'Final Revision' ? 'final_revision' : t.relevance === 'General' ? 'general' : 'revision',
        currentTargetMinutes: t.targetDurationMinutes
      })),
      totalMins
    );
    const allocById = new Map(proportionateAllocations.map(a => [a.id, a]));
    const orderById = new Map(selectedActiveObjects.map((t, idx) => [t.id, idx]));

    pushPlannerUndoSnapshot(
      `Clubbed ${selectedActiveObjects.length} [${subjectCode}] targets into ${formatMinutes(totalMins)}`,
      [selectedDate]
    );

    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    const updatedTasks = tasks.map(t => {
      if (!selectedSet.has(t.id)) return t;
      const orderIdx = orderById.get(t.id) ?? 0;
      const alloc = allocById.get(t.id);
      const subTargetMins = alloc ? alloc.allocatedMinutes : Math.max(5, Math.round(totalMins / selectedActiveObjects.length));
      const basis = alloc?.basis || 'best_judgment';
      const priorMins = alloc?.priorLoggedMinutes || 0;

      const strippedNotes = (t.notes || '')
        .split('\n')
        .filter(line => {
          const u = line.trim().toUpperCase();
          return (
            !u.startsWith('CLUBGROUPID:') &&
            !u.startsWith('CLUBTOTALMINUTES:') &&
            !u.startsWith('CLUBORDER:') &&
            !u.startsWith('CLUBALLOCATIONBASIS:') &&
            !u.startsWith('CLUBPRIORLOGGEDMINUTES:') &&
            !u.startsWith('TARGETDURATIONMINUTES:')
          );
        })
        .join('\n')
        .trim();

      const updatedNotes = `${strippedNotes}\nTargetDurationMinutes: ${subTargetMins}\nClubGroupId: ${clubGroupId}\nClubTotalMinutes: ${totalMins}\nClubOrder: ${orderIdx}\nClubAllocationBasis: ${basis}\nClubPriorLoggedMinutes: ${priorMins}`.trim();
      durationsMap[t.id] = subTargetMins;
      if (t.cleanTitle || t.title) {
        durationsMap[t.cleanTitle || t.title] = subTargetMins;
        durationsMap[normalizeKey(t.cleanTitle || t.title)] = subTargetMins;
      }

      const nextTask: any = {
        ...t,
        notes: updatedNotes,
        targetDurationMinutes: subTargetMins,
        duration: subTargetMins,
        clubGroupId,
        clubTotalMinutes: totalMins,
        clubOrder: orderIdx,
        clubAllocationBasis: basis,
        clubPriorLoggedMinutes: priorMins
      };
      delete nextTask.originalTargetDurationMinutes;
      delete nextTask.earlyCompletionSavedMinutes;
      return nextTask;
    });

    setTasks(updatedTasks);
    triggerLocalSaveStatus();
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));

      // Also save group metadata in practca_clubbed_groups_v1
      const rawGroups = localStorage.getItem('practca_clubbed_groups_v1');
      const groupsMap = rawGroups ? JSON.parse(rawGroups) : {};
      groupsMap[clubGroupId] = {
        clubGroupId,
        subjectCode,
        totalMinutes: totalMins,
        dateStr: selectedDate,
        taskIds: selectedActiveObjects.map(t => t.id),
        allocations: proportionateAllocations,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('practca_clubbed_groups_v1', JSON.stringify(groupsMap));

      syncClockSlotsForTasks(selectedDate, updatedTasks, selectedSet);
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: durationsMap, removedTargetNames: [] }
      }));
    } catch (e) {}

    if (!isLocalMode && user) {
      try {
        const toSync = updatedTasks.filter(t => selectedSet.has(t.id));
        await Promise.all(
          toSync.map(t => setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), t).catch(() => {}))
        );
      } catch (e) {}
    }

    setSelectedTaskIds([]);
    setShowClubTargetsBar(false);
    setAutoBatchBannerMsg(
      `✅ Batch created (${selectedActiveObjects.length} [${subjectCode}] targets • ${formatMinutes(totalMins)}: ${proportionateAllocations.map(a => formatMinutes(a.allocatedMinutes)).join(' + ')})`
    );
    setTimeout(() => setAutoBatchBannerMsg(null), 4500);
  };

  // Rescale all individual sub-target durations proportionately when the whole batch's total time is changed
  const handleUpdateClubGroupDuration = async (clubGroupId: string, newTotalMins: number) => {
    const clubMembers = tasks
      .filter(t => {
        const tClubId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
        return tClubId === clubGroupId;
      })
      .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));

    if (clubMembers.length === 0) return;
    const validMins = Math.max(clubMembers.length, Math.min(720, Math.round(Number(newTotalMins) || clubMembers.length)));

    // Check if existing sub-targets had legacy identical total durations; if so, re-derive proportionate weights
    const currentSum = clubMembers.reduce((acc, m) => acc + (Number(m.targetDurationMinutes) || 0), 0);
    const allEqualToClubTotal =
      clubMembers.length > 1 &&
      clubMembers.every(m => m.targetDurationMinutes && m.targetDurationMinutes === m.clubTotalMinutes);

    const rescaled = allEqualToClubTotal || currentSum <= 0
      ? allocateProportionateClubDurations(
          clubMembers.map(m => ({
            id: m.id,
            subjectCode: m.subjectCode,
            chapterName: m.chapterName || m.cleanTitle || m.title,
            title: m.cleanTitle || m.title,
            relevance: m.relevance === 'Final Revision' ? 'final_revision' : m.relevance === 'General' ? 'general' : 'revision',
            currentTargetMinutes: undefined
          })),
          validMins
        )
      : rescaleClubSubTargetsToNewTotal(
          clubMembers.map(m => ({
            id: m.id,
            currentMinutes: Number(m.targetDurationMinutes) || Math.round(validMins / clubMembers.length),
            basis: m.clubAllocationBasis,
            priorLoggedMinutes: m.clubPriorLoggedMinutes
          })),
          validMins
        );

    const rescaledById = new Map(rescaled.map(r => [r.id, r]));

    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    const affectedIds = new Set<string>();
    const updatedTasks = tasks.map(t => {
      const tClubId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
      if (tClubId !== clubGroupId) return t;
      affectedIds.add(t.id);
      const rItem = rescaledById.get(t.id);
      const subTargetMins = rItem ? rItem.allocatedMinutes : Math.max(1, Math.round(validMins / clubMembers.length));

      const strippedNotes = (t.notes || '')
        .split('\n')
        .filter(line => {
          const u = line.trim().toUpperCase();
          return !u.startsWith('CLUBTOTALMINUTES:') && !u.startsWith('TARGETDURATIONMINUTES:');
        })
        .join('\n')
        .trim();
      const updatedNotes = `${strippedNotes}\nTargetDurationMinutes: ${subTargetMins}\nClubTotalMinutes: ${validMins}`.trim();
      durationsMap[t.id] = subTargetMins;
      if (t.cleanTitle || t.title) {
        durationsMap[t.cleanTitle || t.title] = subTargetMins;
        durationsMap[normalizeKey(t.cleanTitle || t.title)] = subTargetMins;
      }
      const nextTask: any = {
        ...t,
        notes: updatedNotes,
        targetDurationMinutes: subTargetMins,
        duration: subTargetMins,
        clubTotalMinutes: validMins
      };
      delete nextTask.originalTargetDurationMinutes;
      delete nextTask.earlyCompletionSavedMinutes;
      return nextTask;
    });

    setTasks(updatedTasks);
    triggerLocalSaveStatus();
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
      const rawGroups = localStorage.getItem('practca_clubbed_groups_v1');
      if (rawGroups) {
        const groupsMap = JSON.parse(rawGroups);
        if (groupsMap[clubGroupId]) {
          groupsMap[clubGroupId].totalMinutes = validMins;
          groupsMap[clubGroupId].allocations = rescaled;
          localStorage.setItem('practca_clubbed_groups_v1', JSON.stringify(groupsMap));
        }
      }
      syncClockSlotsForTasks(selectedDate, updatedTasks, affectedIds);
      const aftRaw = localStorage.getItem('practca_active_focus_task');
      if (aftRaw) {
        const aftParsed = JSON.parse(aftRaw);
        const matchedMember = updatedTasks.find(ut =>
          affectedIds.has(ut.id) &&
          (aftParsed?.id === ut.id ||
            normalizeKey(aftParsed?.cleanTitle || aftParsed?.title || '') ===
              normalizeKey(ut.cleanTitle || ut.title || ''))
        );
        if (matchedMember && matchedMember.targetDurationMinutes) {
          aftParsed.targetDurationMinutes = matchedMember.targetDurationMinutes;
          localStorage.setItem('practca_active_focus_task', JSON.stringify(aftParsed));
          window.dispatchEvent(new CustomEvent('practca_active_task_duration_adjusted', {
            detail: {
              taskTitle: aftParsed.title,
              activeFocusTask: aftParsed,
              newTotalMinutes: matchedMember.targetDurationMinutes,
              date: selectedDate
            }
          }));
        }
      }
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_task_target_durations_update'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: durationsMap, removedTargetNames: [] }
      }));
    } catch (e) {}

    if (!isLocalMode && user && affectedIds.size > 0) {
      try {
        const toSync = updatedTasks.filter(t => affectedIds.has(t.id));
        await Promise.all(
          toSync.map(t => setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), t).catch(() => {}))
        );
      } catch (e) {}
    }
  };

  // Update a single sub-target's duration inside a batch AND rebalance peer sub-targets so sum(t_i) === T_club stays strictly within the batch limit
  const handleUpdateSubTargetInClubDuration = async (taskId: string, clubGroupId: string, newSubTargetMins: number) => {
    const validSubMins = Math.max(1, Math.min(720, Math.round(Number(newSubTargetMins) || 1)));
    const clubMembers = tasks
      .filter(t => {
        const tClubId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
        return tClubId === clubGroupId && t.status !== 'unachieved';
      })
      .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));

    if (clubMembers.length === 0) return;

    const currentSum = clubMembers.reduce((acc, m) => acc + (Number(m.targetDurationMinutes) || 15), 0);
    let fixedClubTotalMins = Math.max(
      clubMembers.length,
      Number(clubMembers[0].clubTotalMinutes) || currentSum || 180
    );

    if (clubMembers.length === 1) {
      fixedClubTotalMins = validSubMins;
    } else if (validSubMins + (clubMembers.length - 1) * 5 > fixedClubTotalMins) {
      fixedClubTotalMins = validSubMins + clubMembers.filter(m => m.id !== taskId).reduce((acc, m) => acc + Math.max(5, Number(m.targetDurationMinutes) || 15), 0);
    }

    // Ensure every peer has a valid proportionate baseline before rebalancing within fixedClubTotalMins
    const allEqualToClubTotal =
      clubMembers.length > 1 &&
      clubMembers.every(m => !m.targetDurationMinutes || m.targetDurationMinutes === m.clubTotalMinutes);

    const baselineAllocMap = new Map<string, number>();
    if (allEqualToClubTotal) {
      const derived = allocateProportionateClubDurations(
        clubMembers.map(m => ({
          id: m.id,
          subjectCode: m.subjectCode,
          chapterName: m.chapterName || m.cleanTitle || m.title,
          title: m.cleanTitle || m.title,
          relevance: m.relevance === 'Final Revision' ? 'final_revision' : m.relevance === 'General' ? 'general' : 'revision'
        })),
        fixedClubTotalMins
      );
      derived.forEach(d => baselineAllocMap.set(d.id, d.allocatedMinutes));
    } else {
      clubMembers.forEach(m => {
        baselineAllocMap.set(
          m.id,
          Math.max(1, Number(m.targetDurationMinutes) || Math.round(fixedClubTotalMins / clubMembers.length))
        );
      });
    }

    const rebalanced = rebalanceClubSubTargetsWithinLimit(
      clubMembers.map(m => ({
        id: m.id,
        currentMinutes: baselineAllocMap.get(m.id) ?? 15,
        basis: m.clubAllocationBasis,
        priorLoggedMinutes: m.clubPriorLoggedMinutes
      })),
      taskId,
      validSubMins,
      fixedClubTotalMins
    );
    const rebalancedMap = new Map(rebalanced.map(r => [r.id, r]));

    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch (e) {}

    const affectedIds = new Set<string>();
    const updatedTasks = tasks.map(t => {
      const tClubId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
      if (tClubId !== clubGroupId) return t;
      affectedIds.add(t.id);
      const rItem = rebalancedMap.get(t.id);
      const subMins = rItem ? rItem.allocatedMinutes : (baselineAllocMap.get(t.id) ?? 15);
      const basis: ClubAllocationBasis = rItem?.basis || (t.id === taskId ? 'custom_adjusted' : (t.clubAllocationBasis || 'best_judgment'));

      const strippedNotes = (t.notes || '')
        .split('\n')
        .filter(line => {
          const u = line.trim().toUpperCase();
          return (
            !u.startsWith('CLUBTOTALMINUTES:') &&
            !u.startsWith('TARGETDURATIONMINUTES:') &&
            !u.startsWith('CLUBALLOCATIONBASIS:')
          );
        })
        .join('\n')
        .trim();
      const updatedNotes = `${strippedNotes}\nTargetDurationMinutes: ${subMins}\nClubTotalMinutes: ${fixedClubTotalMins}\nClubAllocationBasis: ${basis}`.trim();

      durationsMap[t.id] = subMins;
      if (t.cleanTitle || t.title) {
        durationsMap[t.cleanTitle || t.title] = subMins;
        durationsMap[normalizeKey(t.cleanTitle || t.title)] = subMins;
      }

      const nextTask: any = {
        ...t,
        notes: updatedNotes,
        targetDurationMinutes: subMins,
        duration: subMins,
        clubTotalMinutes: fixedClubTotalMins,
        clubAllocationBasis: basis
      };
      delete nextTask.originalTargetDurationMinutes;
      delete nextTask.earlyCompletionSavedMinutes;
      return nextTask;
    });

    setTasks(updatedTasks);
    triggerLocalSaveStatus();
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
      const rawGroups = localStorage.getItem('practca_clubbed_groups_v1');
      if (rawGroups) {
        const groupsMap = JSON.parse(rawGroups);
        if (groupsMap[clubGroupId]) {
          groupsMap[clubGroupId].totalMinutes = fixedClubTotalMins;
          localStorage.setItem('practca_clubbed_groups_v1', JSON.stringify(groupsMap));
        }
      }
      syncClockSlotsForTasks(selectedDate, updatedTasks, affectedIds);
      const aftRaw = localStorage.getItem('practca_active_focus_task');
      if (aftRaw) {
        const aftParsed = JSON.parse(aftRaw);
        const matchedMember = updatedTasks.find(ut =>
          affectedIds.has(ut.id) &&
          (aftParsed?.id === ut.id ||
            normalizeKey(aftParsed?.cleanTitle || aftParsed?.title || '') ===
              normalizeKey(ut.cleanTitle || ut.title || ''))
        );
        if (matchedMember && matchedMember.targetDurationMinutes) {
          aftParsed.targetDurationMinutes = matchedMember.targetDurationMinutes;
          localStorage.setItem('practca_active_focus_task', JSON.stringify(aftParsed));
          window.dispatchEvent(new CustomEvent('practca_active_task_duration_adjusted', {
            detail: {
              taskTitle: aftParsed.title,
              activeFocusTask: aftParsed,
              newTotalMinutes: matchedMember.targetDurationMinutes,
              date: selectedDate
            }
          }));
        }
      }
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_task_target_durations_update'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: durationsMap, removedTargetNames: [] }
      }));
    } catch (e) {}

    if (!isLocalMode && user && affectedIds.size > 0) {
      try {
        const toSync = updatedTasks.filter(t => affectedIds.has(t.id));
        await Promise.all(
          toSync.map(t => setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), t).catch(() => {}))
        );
      } catch (e) {}
    }
  };


  const handleUnclubGroup = async (clubGroupId: string) => {
    pushPlannerUndoSnapshot('Unclubbed target batch back to individual targets', [selectedDate]);
    const affectedIds = new Set<string>();
    const updatedTasks = tasks.map(t => {
      const tClubId = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r]+)/i)?.[1]?.trim();
      if (tClubId !== clubGroupId) return t;
      affectedIds.add(t.id);
      const strippedNotes = (t.notes || '')
        .split('\n')
        .filter(line => {
          const u = line.trim().toUpperCase();
          return (
            !u.startsWith('CLUBGROUPID:') &&
            !u.startsWith('CLUBTOTALMINUTES:') &&
            !u.startsWith('CLUBORDER:') &&
            !u.startsWith('CLUBALLOCATIONBASIS:') &&
            !u.startsWith('CLUBPRIORLOGGEDMINUTES:')
          );
        })
        .join('\n')
        .trim();
      const copy = { ...t, notes: strippedNotes };
      delete copy.clubGroupId;
      delete copy.clubTotalMinutes;
      delete copy.clubOrder;
      delete copy.clubAllocationBasis;
      delete copy.clubPriorLoggedMinutes;
      return copy;
    });

    setTasks(updatedTasks);
    triggerLocalSaveStatus();
    try {
      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
      localStorage.setItem('practca_tasks_backup', JSON.stringify(updatedTasks));
      const rawGroups = localStorage.getItem('practca_clubbed_groups_v1');
      if (rawGroups) {
        const groupsMap = JSON.parse(rawGroups);
        delete groupsMap[clubGroupId];
        localStorage.setItem('practca_clubbed_groups_v1', JSON.stringify(groupsMap));
      }
      window.dispatchEvent(new Event('practca_tasks_updated'));
    } catch (e) {}

    if (!isLocalMode && user && affectedIds.size > 0) {
      try {
        const toSync = updatedTasks.filter(t => affectedIds.has(t.id));
        await Promise.all(
          toSync.map(t => setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), t).catch(() => {}))
        );
      } catch (e) {}
    }

    setAutoBatchBannerMsg('🔓 Unclubbed batch into individual targets (each retaining its proportionate duration).');
    setTimeout(() => setAutoBatchBannerMsg(null), 3500);
  };

  const handleStartClubbedBatchFlow = (groupTasks: any[], clubTotalMinutes: number) => {
    if (!groupTasks || groupTasks.length === 0) return;
    const sortedGroup = [...groupTasks].sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));
    const firstActiveIdx = sortedGroup.findIndex(t => t.status !== 'completed');
    const startIdx = firstActiveIdx !== -1 ? firstActiveIdx : 0;
    const primaryTask = sortedGroup[startIdx];
    const clubGroupId = primaryTask.clubGroupId || `club_${Date.now()}`;

    // Ensure proportionate sub-target durations sum to clubTotalMinutes
    const sumSubMins = sortedGroup.reduce((acc, t) => acc + (Number(t.targetDurationMinutes) || 0), 0);
    const fallbackAllocations =
      sumSubMins !== clubTotalMinutes
        ? allocateProportionateClubDurations(
            sortedGroup.map(t => ({
              id: t.id,
              subjectCode: t.subjectCode,
              chapterName: t.chapterName || t.cleanTitle || t.title,
              title: t.cleanTitle || t.title,
              relevance: t.relevance === 'Final Revision' ? 'final_revision' : t.relevance === 'General' ? 'general' : 'revision'
            })),
            clubTotalMinutes
          )
        : null;
    const fallbackMap = fallbackAllocations ? new Map(fallbackAllocations.map(a => [a.id, a.allocatedMinutes])) : null;

    const flowSequence = sortedGroup.map((t, idx) => {
      const sub = (t.subjectCode || 'IDT') as SubjectId;
      const chap = t.chapterName || matchTaskToChapter(t)?.chapterName || t.cleanTitle || t.title;
      const subTargetMins = fallbackMap
        ? (fallbackMap.get(t.id) ?? Math.round(clubTotalMinutes / sortedGroup.length))
        : (Number(t.targetDurationMinutes) || Math.round(clubTotalMinutes / sortedGroup.length));
      return {
        id: `flow_${t.id}_${idx}`,
        taskId: t.id,
        title: t.cleanTitle || t.title,
        cleanTitle: t.cleanTitle || t.title,
        subjectCode: sub,
        chapterName: chap,
        relevance: (t.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision',
        revKey: t.revKey,
        dueDate: t.due || `${selectedDate}T09:00:00.000Z`,
        status: t.status === 'completed'
          ? ('completed' as const)
          : idx === startIdx
            ? ('active' as const)
            : ('pending' as const),
        duration: subTargetMins,
        targetDurationMinutes: subTargetMins,
        clubGroupId,
        clubTotalMinutes,
        clubOrder: idx,
        clubAllocationBasis: t.clubAllocationBasis,
        clubPriorLoggedMinutes: t.clubPriorLoggedMinutes
      };
    });

    try {
      const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
      const durMap = rawDur ? JSON.parse(rawDur) : {};
      flowSequence.forEach(fs => {
        if (fs.taskId) durMap[fs.taskId] = fs.targetDurationMinutes;
        if (fs.cleanTitle) {
          durMap[fs.cleanTitle] = fs.targetDurationMinutes;
          durMap[normalizeKey(fs.cleanTitle)] = fs.targetDurationMinutes;
        }
      });
      localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durMap));
      localStorage.setItem(getLevelScopedKey('practca_target_flow'), JSON.stringify(flowSequence));
      localStorage.setItem('practca_flow_active', 'true');
      localStorage.setItem('practca_pomo_mode', 'study');
      localStorage.setItem('practca_pomo_start', new Date().toISOString());
      window.dispatchEvent(new Event('practca_task_target_durations_update'));
      window.dispatchEvent(new Event('practca_flow_updated'));
      window.dispatchEvent(new Event('practca_target_flow_updated'));
    } catch (e) {}

    if (onStartFocusForTask) {
      const sub = (primaryTask.subjectCode || 'IDT') as SubjectId;
      const chap = primaryTask.chapterName || matchTaskToChapter(primaryTask)?.chapterName || primaryTask.cleanTitle || primaryTask.title;
      const primarySubMins = flowSequence[startIdx]?.targetDurationMinutes || Math.round(clubTotalMinutes / sortedGroup.length);
      onStartFocusForTask(
        sub,
        primaryTask.cleanTitle || primaryTask.title,
        primarySubMins,
        chap,
        primaryTask.relevance,
        primaryTask.due,
        primaryTask.revKey,
        primaryTask.id
      );
    }
  };

  const renderTaskListWithClubbedGroups = (taskList: any[], isGroupedBySubject: boolean = false) => {
    const renderedClubIds = new Set<string>();
    const elements: React.ReactNode[] = [];
    let fallbackBatchSeq = 1;

    taskList.forEach((task, idx) => {
      if (!task.clubGroupId) {
        elements.push(renderTaskItem(task, isGroupedBySubject, idx));
        return;
      }

      if (renderedClubIds.has(task.clubGroupId)) return;
      renderedClubIds.add(task.clubGroupId);

      const batchNumber = dailyClubBatchNumberMap.get(task.clubGroupId) ?? fallbackBatchSeq++;

      // Gather all tasks in this clubGroupId from selectedDayTasks (including completed ones so user sees full batch progress)
      const allInClub = selectedDayTasks
        .filter(t => t.clubGroupId === task.clubGroupId && t.status !== 'unachieved')
        .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));
      const activeInClub = taskList
        .filter(t => t.clubGroupId === task.clubGroupId)
        .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));

      // Compute proportionate sub-target breakdown in 15-minute slabs if legacy tasks had identical or non-slab best-judgmental durations
      const rawClubTotal = task.clubTotalMinutes || task.targetDurationMinutes || 180;
      const hasCustomSubTarget = allInClub.some(t => t.clubAllocationBasis === 'custom_adjusted');
      const hasOddNonSlabBestJudgment =
        !hasCustomSubTarget &&
        rawClubTotal >= allInClub.length * 15 &&
        rawClubTotal % 15 === 0 &&
        allInClub.some(t => (Number(t.targetDurationMinutes) || 0) % 15 !== 0);
      const currentSubSum = allInClub.reduce((acc, t) => acc + (Number(t.targetDurationMinutes) || 0), 0);
      const needsAutoSlabNormalization =
        !hasCustomSubTarget &&
        allInClub.length > 1 &&
        (allInClub.every(t => !t.targetDurationMinutes || t.targetDurationMinutes === rawClubTotal) ||
          hasOddNonSlabBestJudgment ||
          currentSubSum !== rawClubTotal);
      const derivedAllocations = needsAutoSlabNormalization
        ? allocateProportionateClubDurations(
            allInClub.map(t => ({
              id: t.id,
              subjectCode: t.subjectCode,
              chapterName: t.chapterName || t.cleanTitle || t.title,
              title: t.cleanTitle || t.title,
              relevance: t.relevance === 'Final Revision' ? 'final_revision' : t.relevance === 'General' ? 'general' : 'revision'
            })),
            rawClubTotal
          )
        : null;
      const derivedMap = derivedAllocations ? new Map(derivedAllocations.map(a => [a.id, a])) : null;

      // Exact batch total is maintained within rawClubTotal
      const clubTotalMins = rawClubTotal;

      const subCode = (task.subjectCode || 'IDT') as SubjectId;
      const subColors = SUBJECT_COLORS[subCode] || SUBJECT_COLORS.IDT;
      const doneInClubCount = allInClub.filter(t => t.status === 'completed').length;
      const isBatchPartlyCompleted = doneInClubCount > 0 && doneInClubCount < allInClub.length;
      const allClubSelected = activeInClub.length > 0 && activeInClub.every(t => selectedTaskIds.includes(t.id));

      elements.push(
        <motion.div
          key={`club_group_${task.clubGroupId}`}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className={`rounded-2xl border-2 shadow-lg overflow-hidden my-1.5 ${
            isBatchPartlyCompleted
              ? 'bg-amber-500/15 border-amber-500/45'
              : 'bg-gradient-to-br from-indigo-950/35 via-slate-950 to-cyan-950/25 border-cyan-500/35'
          }`}
        >
          {/* Batch Header */}
          <div className={`px-3.5 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 ${
            isBatchPartlyCompleted
              ? 'bg-amber-950/40 border-amber-500/35'
              : 'bg-slate-900/90 border-cyan-500/25'
          }`}>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="checkbox"
                checked={allClubSelected}
                onChange={() => {
                  const ids = activeInClub.map(t => t.id);
                  if (allClubSelected) {
                    setSelectedTaskIds(prev => prev.filter(id => !ids.includes(id)));
                  } else {
                    setSelectedTaskIds(prev => Array.from(new Set([...prev, ...ids])));
                  }
                }}
                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-400 cursor-pointer shrink-0"
                title={`Select all chapters in Batch ${batchNumber}`}
              />
              {isBatchPartlyCompleted && (
                <span
                  className="h-3.5 w-3.5 rounded-[3px] bg-amber-400 border border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.45)] inline-block shrink-0"
                  title="Batch partly completed"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveBatchInspector({
                    source: 'daily_planner',
                    clubGroupId: task.clubGroupId,
                    batchNumber: batchNumber,
                    dateStr: selectedDate,
                  });
                }}
                className="px-2 py-0.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/45 hover:border-cyan-300 text-cyan-200 hover:text-white font-mono text-[10px] font-black uppercase tracking-wider cursor-pointer transition flex items-center gap-1 shadow-xs"
                title={`Click to open Batch ${batchNumber} Editor & Inspector`}
              >
                <Layers className="h-3 w-3" />
                <span>Batch {batchNumber}</span>
              </button>
              <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-black border ${subColors.bg} ${subColors.text} ${subColors.border}`}>
                {subCode}
              </span>
              <span className="text-[10px] font-mono text-slate-300 font-bold">
                {allInClub.length} Chapters • {formatMinutes(clubTotalMins)}
              </span>
              {doneInClubCount > 0 && (
                <span className={`px-2 py-0.5 rounded-md font-mono text-[9.5px] font-bold border ${
                  isBatchPartlyCompleted
                    ? 'bg-amber-500/20 border-amber-500/45 text-amber-200'
                    : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                }`}>
                  {doneInClubCount}/{allInClub.length} {isBatchPartlyCompleted ? 'Partly Done' : 'Done'}
                </span>
              )}
            </div>

            {/* Right: Flexible Batch Duration Control (±15m, ±1m, Direct Minute Input) + Start Batch Flow + Unbatch */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center bg-slate-950 border border-amber-500/35 rounded-lg px-1.5 py-0.5 gap-1 font-mono text-[10px]" title="Adjust Batch Total by ±15m, ±1m, or type exact minutes (proportionately rescales sub-targets)">
                <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => handleUpdateClubGroupDuration(task.clubGroupId, Math.max(allInClub.length, clubTotalMins - 15))}
                  className="text-slate-400 hover:text-white font-black px-1 cursor-pointer"
                  title="-15m batch total"
                >
                  -15
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateClubGroupDuration(task.clubGroupId, Math.max(allInClub.length, clubTotalMins - 1))}
                  className="text-slate-400 hover:text-cyan-300 font-black px-0.5 cursor-pointer"
                  title="-1m batch total"
                >
                  -1
                </button>
                <input
                  type="number"
                  min={allInClub.length}
                  max={720}
                  step={1}
                  value={clubTotalMins}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= allInClub.length) {
                      handleUpdateClubGroupDuration(task.clubGroupId, val);
                    }
                  }}
                  className="w-11 bg-slate-900 border border-slate-800 rounded text-center text-amber-300 font-black text-[10px] focus:outline-none focus:border-amber-400"
                  title="Type exact batch total minutes"
                />
                <span className="text-[9px] text-slate-400">m ({formatMinutes(clubTotalMins)})</span>
                <button
                  type="button"
                  onClick={() => handleUpdateClubGroupDuration(task.clubGroupId, Math.min(720, clubTotalMins + 1))}
                  className="text-slate-400 hover:text-cyan-300 font-black px-0.5 cursor-pointer"
                  title="+1m batch total"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateClubGroupDuration(task.clubGroupId, Math.min(720, clubTotalMins + 15))}
                  className="text-slate-400 hover:text-white font-black px-1 cursor-pointer"
                  title="+15m batch total"
                >
                  +15
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleStartClubbedBatchFlow(allInClub, clubTotalMins)}
                className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-mono font-black text-[10px] uppercase rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm"
                title={`Start Batch ${batchNumber} on the Focus Timer with automatic Target Flow progression`}
              >
                <Zap className="h-3 w-3 fill-slate-950" />
                <span>Start Batch {batchNumber}</span>
              </button>

              <button
                type="button"
                onClick={() => handleUnclubGroup(task.clubGroupId)}
                className="px-2 py-1 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/35 rounded-lg text-[9.5px] font-mono font-bold transition cursor-pointer"
                title="Unbatch these chapters back into individual targets"
              >
                Unbatch
              </button>
            </div>
          </div>

          {/* Sub-targets inside Batch {batchNumber} */}
          <div className="p-2.5 space-y-2 bg-slate-950/50">
            {activeInClub.map((subTask, sIdx) => {
              const derived = derivedMap?.get(subTask.id);
              const subMins = derived
                ? derived.allocatedMinutes
                : (Number(subTask.targetDurationMinutes) || Math.round(clubTotalMins / Math.max(1, allInClub.length)));
              const sharePct = clubTotalMins > 0 ? Math.round((subMins / clubTotalMins) * 100) : 0;

              return (
                <div key={`${subTask.id || 'sub'}_${sIdx}`} className="rounded-xl bg-slate-900/45 border border-slate-850/90 p-1.5 space-y-1">
                  <div className="flex items-center justify-between gap-2 px-2 py-0.5 text-[9.5px] font-mono flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveBatchInspector({
                            source: 'daily_planner',
                            clubGroupId: task.clubGroupId,
                            batchNumber: batchNumber,
                            dateStr: selectedDate,
                          });
                        }}
                        className="px-1.5 py-0.2 rounded bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-black cursor-pointer transition flex items-center gap-0.5"
                        title={`Click to open Batch ${batchNumber} Editor & Inspector`}
                      >
                        <Layers className="h-2.5 w-2.5" />
                        <span>Batch {batchNumber} • #{sIdx + 1}</span>
                      </button>
                      <span className="text-slate-300 font-bold">
                        <strong className="text-amber-300">{formatMinutes(subMins)}</strong> ({sharePct}% of {formatMinutes(clubTotalMins)})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-md px-1.5 py-0.5" title="Adjust sub-target planned time by ±15m, ±1m, or type exact minutes (automatically updates Batch total)">
                      <button
                        type="button"
                        onClick={() => handleUpdateSubTargetInClubDuration(subTask.id, task.clubGroupId, Math.max(1, subMins - 15))}
                        className="text-slate-400 hover:text-white font-black px-1 cursor-pointer"
                        title="-15m"
                      >
                        -15
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSubTargetInClubDuration(subTask.id, task.clubGroupId, Math.max(1, subMins - 1))}
                        className="text-slate-400 hover:text-cyan-300 font-black px-0.5 cursor-pointer"
                        title="-1m"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={720}
                        step={1}
                        value={subMins}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            handleUpdateSubTargetInClubDuration(subTask.id, task.clubGroupId, val);
                          }
                        }}
                        className="w-10 bg-slate-900 border border-slate-800 rounded text-center text-amber-300 font-black text-[9.5px] focus:outline-none focus:border-cyan-400"
                        title="Type exact sub-target minutes"
                      />
                      <span className="text-[8.5px] text-slate-400">m</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateSubTargetInClubDuration(subTask.id, task.clubGroupId, Math.min(720, subMins + 1))}
                        className="text-slate-400 hover:text-cyan-300 font-black px-0.5 cursor-pointer"
                        title="+1m"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSubTargetInClubDuration(subTask.id, task.clubGroupId, Math.min(720, subMins + 15))}
                        className="text-slate-400 hover:text-white font-black px-1 cursor-pointer"
                        title="+15m"
                      >
                        +15
                      </button>
                    </div>
                  </div>

                  <div className="min-w-0">
                    {renderTaskItem(subTask, isGroupedBySubject, sIdx)}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      );
    });

    return elements;
  };

  const renderCompletedTaskItem = (task: any, showSubjectBadge: boolean = true, idx?: number) => {
    const match = matchTaskToChapter(task);
    const parsedChName = match?.chapterName;
    const sub = (match?.subjectCode || task.subjectCode || 'IDT') as SubjectId;

    let milestoneBadge: string | null = null;
    if (match && parsedChName) {
      const activeRev = getActiveRevisionMilestone(sub, parsedChName, task);
      milestoneBadge = activeRev?.badge || 'R1';
    }

    return (
      <motion.div
        key={`${task.id || 'task'}_comp_${idx !== undefined ? idx : ''}`}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)] flex items-center justify-between gap-3 text-xs text-emerald-100/90"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <input
            type="checkbox"
            checked={selectedTaskIds.includes(task.id)}
            onChange={() => handleToggleTaskSelection(task.id)}
            className="h-3.5 w-3.5 rounded border-emerald-500/40 bg-emerald-950/70 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-slate-950 cursor-pointer transition mr-0.5 shrink-0"
            title="Select target for bulk actions"
          />
          <button
            onClick={() => handleToggleTaskCompleted(task)}
            className="text-emerald-400 hover:text-emerald-200 shrink-0 transition cursor-pointer animate-scaleUp"
            title="Reopen Task back to Active"
          >
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          </button>
          {showSubjectBadge && (
            <span className="text-[9px] font-extrabold text-emerald-200 bg-emerald-950/70 px-1.5 py-0.5 border border-emerald-500/35 rounded font-mono uppercase shrink-0">
              {task.subjectCode}
            </span>
          )}
          {match && milestoneBadge && (
            <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 border border-emerald-500/35 rounded font-mono shrink-0 flex items-center gap-0.5">
              <Flag className="h-2.5 w-2.5 opacity-80" />
              {milestoneBadge}
            </span>
          )}
          <span className="line-through text-[11.5px] truncate text-emerald-200/80 font-sans font-bold flex-1">
            {task.cleanTitle}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleToggleTaskCompleted(task)}
            className="px-2 py-0.5 text-[10px] font-semibold text-emerald-200 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/35 rounded transition cursor-pointer"
            title="Reopen Task back to Active"
          >
            Reopen
          </button>
          <button
            onClick={() => handleDeleteTask(task.id, task.title)}
            className="p-1 text-emerald-300/70 hover:text-rose-400 rounded hover:bg-slate-900 transition cursor-pointer"
            title="Wipe permanently"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Monday-to-Sunday weekly view days array relative to the active selectedDate
  const currentWeekDays = React.useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const current = new Date(year, month - 1, day);
      
      let dayOfWeek = current.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      // Shift so Mon is 0, Sun is 6
      let mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      const monday = new Date(current);
      monday.setDate(current.getDate() + mondayDiff);
      
      const weekdays = [];
      const todayString = getSystemLocalDateString();
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const yr = d.getFullYear();
        const mn = String(d.getMonth() + 1).padStart(2, '0');
        const dy = String(d.getDate()).padStart(2, '0');
        
        const formattedDate = `${yr}-${mn}-${dy}`;
        const dayLongName = d.toLocaleDateString(undefined, { weekday: 'long' });
        const dayShortName = d.toLocaleDateString(undefined, { weekday: 'short' });
        
        // Filter tasks for this particular day of the week
        const dayTasks = mappedTasks.filter(t => t.taskDate === formattedDate);
        const dayActive = dayTasks.filter(t => t.status === 'needsAction');
        const dayCompleted = dayTasks.filter(t => t.status === 'completed');
        const dayUnachieved = dayTasks.filter(t => t.status === 'unachieved');
        
        weekdays.push({
          dateStr: formattedDate,
          dayName: dayLongName,
          dayShort: dayShortName,
          dayNum: d.getDate(),
          monthLabel: d.toLocaleDateString(undefined, { month: 'short' }),
          isToday: formattedDate === todayString,
          isSelected: formattedDate === selectedDate,
          tasks: dayTasks,
          activeCount: dayActive.length,
          completedCount: dayCompleted.length,
          unachievedCount: dayUnachieved.length,
          totalCount: dayTasks.length,
          completionPercent: dayTasks.length > 0 ? Math.round((dayCompleted.length / dayTasks.length) * 100) : 0
        });
      }
      return weekdays;
    } catch (err) {
      console.error("Error building weekly viewpoint:", err);
      return [];
    }
  }, [mappedTasks, selectedDate]);

  // Aggregate stats for the current Monday-to-Sunday week
  const weeklyStats = React.useMemo(() => {
    let total = 0;
    let completed = 0;
    let active = 0;
    let unachieved = 0;
    
    currentWeekDays.forEach(day => {
      total += day.totalCount;
      completed += day.completedCount;
      active += day.activeCount;
      unachieved += day.unachievedCount;
    });
    
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    let label = "";
    if (currentWeekDays.length === 7) {
      const first = currentWeekDays[0];
      const last = currentWeekDays[6];
      label = `${first.monthLabel} ${first.dayNum} – ${last.monthLabel} ${last.dayNum}, ${new Date(first.dateStr).getFullYear()}`;
    }
    
    return {
      total,
      completed,
      active,
      unachieved,
      rate,
      label
    };
  }, [currentWeekDays]);

  // Helpful string conversion
  const getFriendlyDateLabel = (dateStr: string) => {
    const today = getSystemLocalDateString();
    
    const d = new Date();
    
    const yesterdayObj = new Date(d);
    yesterdayObj.setDate(d.getDate() - 1);
    const yesterdayY = yesterdayObj.getFullYear();
    const yesterdayM = String(yesterdayObj.getMonth() + 1).padStart(2, '0');
    const yesterdayD = String(yesterdayObj.getDate()).padStart(2, '0');
    const yesterday = `${yesterdayY}-${yesterdayM}-${yesterdayD}`;
    
    const tomorrowObj = new Date(d);
    tomorrowObj.setDate(d.getDate() + 1);
    const tomorrowY = tomorrowObj.getFullYear();
    const tomorrowM = String(tomorrowObj.getMonth() + 1).padStart(2, '0');
    const tomorrowD = String(tomorrowObj.getDate()).padStart(2, '0');
    const tomorrow = `${tomorrowY}-${tomorrowM}-${tomorrowD}`;
    
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    if (dateStr === tomorrow) return 'Tomorrow';
    
    return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div id="tasks-planner-container" className="font-sans">
      {/* Dynamic confirm modal */}
      {confirmModal?.show && (
        <ModalPortal triggerKey={confirmModal.title}>
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scaleUp">
            <div className="flex gap-3 items-start">
              <div className={`p-2.5 rounded-lg shrink-0 ${confirmModal.type === 'delete' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                {confirmModal.type === 'delete' ? <Trash2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white">{confirmModal.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{confirmModal.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3.5 mt-6 border-t border-slate-800/80 pt-4">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModalExecute}
                className="px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white"
              >
                Proceed Action
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Main Layout Wrapper (isolates modals from spacing and overflow-hidden) */}
      <div className={viewFormat === 'roadmap' ? 'flex flex-col gap-1.5 w-full max-w-full' : 'space-y-3 w-full max-w-full'}>
      {/* Unified Header & Segmented Command Bar (Locked & Scroll-Diminished) */}
      <div className={viewFormat === 'roadmap' ? 'shrink-0 pt-[2px]' : 'locked-internal-header'}>
      <div className={`locked-internal-header-card rounded-2xl bg-gradient-to-r from-[#0c2338] via-[#112c46] to-[#162840] border border-emerald-400/55 ring-1 ring-white/[0.06] text-white relative font-sans ${viewFormat === 'roadmap' ? 'px-5 py-4.5 sm:px-6 sm:py-5 shrink-0 overflow-visible' : 'px-5 py-5 sm:px-7 sm:py-6 overflow-hidden space-y-3.5'}`}>
        {/* Top Luminous Emerald-Amber-Cyan Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400 via-amber-400 to-cyan-400 opacity-90 pointer-events-none rounded-t-2xl" />

        {/* Row 1: 3 Core Pillar View Tabs & Unified Segmented Command Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 relative z-10 ${viewFormat === 'roadmap' ? 'pb-0' : 'border-b border-slate-700/75 pb-3.5'}`}>
          {/* Left: Main Heading + 3 Core Pillar View Switcher Tabs (Roadmap | Schedule [Daily/Weekly] | Backlog [Pending/Missed]) */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 pr-1">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/30 to-teal-500/15 border border-emerald-300/60 shadow-[0_0_14px_rgba(16,185,129,0.28)] flex items-center justify-center shrink-0">
                <ListTodo className="h-5 w-5 text-emerald-200 shrink-0" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight drop-shadow-xs">
                Study Planner
              </h1>
            </div>
            <div className="flex bg-[#061322]/90 border border-slate-700/80 p-1 rounded-xl max-w-full gap-1.5 flex-wrap items-center font-mono shadow-inner">
              {/* Pillar 1: Roadmap */}
              <button
                type="button"
                onClick={() => setViewFormat('roadmap')}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  viewFormat === 'roadmap'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                }`}
                title={lmrActiveFlag ? "1.5-Day LDR Exam Sprint Route" : "Master Preparation Roadmap"}
              >
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                <span>{lmrActiveFlag ? '1.5D Exam Route' : 'Roadmap'}</span>
              </button>

              {/* Pillar 2: Schedule (Daily | Weekly) */}
              <div
                className={`flex items-center rounded-lg p-0.5 transition-all ${
                  viewFormat === 'daily' || viewFormat === 'weekly'
                    ? 'bg-slate-800/90 border border-slate-700/80'
                    : 'hover:bg-slate-900/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewFormat('daily')}
                  className={`py-0.5 px-2.5 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    viewFormat === 'daily'
                      ? 'bg-slate-100 text-slate-950 font-black shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={lmrActiveFlag ? "1.5-Day Daily Sprint Checklist" : "Schedule — Daily Execution View"}
                >
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{lmrActiveFlag ? '1.5D Daily' : 'Schedule: Daily'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat('weekly')}
                  className={`py-0.5 px-2 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    viewFormat === 'weekly'
                      ? 'bg-slate-100 text-slate-950 font-black shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={lmrActiveFlag ? "1.5-Day Sprint Schedule" : "Schedule — Weekly Mon–Sun Overview"}
                >
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>Weekly</span>
                </button>
              </div>

              {/* Pillar 3: Backlog (Pending | Missed) */}
              {!lmrActiveFlag && (
                <div
                  className={`flex items-center rounded-lg p-0.5 transition-all ${
                    viewFormat === 'all-pending' || viewFormat === 'all-missed'
                      ? 'bg-slate-800/90 border border-slate-700/80'
                      : 'hover:bg-slate-900/80'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setViewFormat('all-pending')}
                    className={`py-0.5 px-2 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer whitespace-nowrap tabular-nums ${
                      viewFormat === 'all-pending'
                        ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                        : 'text-slate-400 hover:text-amber-300'
                    }`}
                    title="Backlog — All Pending & Overdue Study Targets"
                  >
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>Backlog: Pending ({allPendingTasks.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewFormat('all-missed')}
                    className={`py-0.5 px-2 rounded-md text-[10.5px] font-bold flex items-center gap-1 transition-all duration-150 cursor-pointer whitespace-nowrap tabular-nums ${
                      viewFormat === 'all-missed'
                        ? 'bg-rose-500 text-white font-black shadow-2xs'
                        : 'text-slate-400 hover:text-rose-400'
                    }`}
                    title="Backlog — All Missed & Unachieved Study Targets"
                  >
                    <ListTodo className="h-3 w-3 shrink-0" />
                    <span>Missed ({allMissedTasks.length})</span>
                  </button>
                </div>
              )}
            </div>

            <span className="text-[10px] font-mono text-slate-500 hidden 2xl:inline">
              {isLocalMode ? 'Offline Mode' : 'Cloud Synced'}
            </span>
          </div>

          {/* Right: Single Unified Segmented Command Bar */}
          <div className="flex flex-wrap items-center gap-1.5">
            {lmrActiveFlag ? (
              <span
                className="h-8 px-3 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
                title="1.5-Day LDR Mode is active: Exam dates, sprint windows, and chapter allocations are system-calculated"
              >
                <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>1.5-Day LDR Mode • System Calculated</span>
              </span>
            ) : (
              <>
                {/* Segment Group 1: Target Creation & Quick Subject Add */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 gap-1">
                  <button
                    type="button"
                    onClick={handleOpenAddStudyTargetModal}
                    className="h-7 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg shadow-2xs transition-all duration-150 cursor-pointer flex items-center gap-1 shrink-0"
                    title="Add a new study target or chapter"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Add Target</span>
                  </button>

                  {viewFormat !== 'roadmap' && (
                    <div className="hidden sm:flex items-center gap-0.5 pr-1">
                      {levelSubjectIds.map(subId => {
                        const col = SUBJECT_COLORS[subId];
                        return (
                          <button
                            key={subId}
                            type="button"
                            onClick={() => handleQuickAddForSubject(subId)}
                            className={`h-6 px-1.5 rounded-md border text-[9.5px] font-mono font-bold transition cursor-pointer hover:opacity-90 flex items-center justify-center ${
                              col?.bg || 'bg-slate-900'
                            } ${col?.text || 'text-white'} ${col?.border || 'border-slate-800'}`}
                            title={`Quick add target for ${subId}`}
                          >
                            +{subId}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Segment Group 2: Milestone Allocator & 24h Clock Studio */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 gap-1 font-mono">
                  {viewFormat !== 'roadmap' && (
                    sortedRoadmapCheckpoints.length > 0 && activeMilestoneCheckpoint ? (
                      <div className="flex items-center gap-1 pl-1.5 pr-1 border-r border-slate-800 h-7">
                        <Flag className="h-3 w-3 text-amber-400 shrink-0" />
                        <select
                          value={activeMilestoneCheckpoint.id}
                          onChange={(e) => setSelectedMilestoneId(e.target.value)}
                          className="bg-transparent text-[11px] font-bold text-amber-300 focus:outline-hidden cursor-pointer max-w-[130px] truncate"
                          title="Select Active Milestone for Allocation"
                        >
                          {sortedRoadmapCheckpoints.map((cp, idx) => (
                            <option key={cp.id} value={cp.id} className="bg-slate-950 text-white">
                              #{idx + 1} {cp.subjectId !== 'CUSTOM' ? cp.subjectId : cp.customTitle || 'Custom'} ({cp.revisionCycle}) • {cp.targetDate}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMilestoneId(activeMilestoneCheckpoint.id);
                            setMilestoneCustomDaysOverride(null);
                            setSelectedWorkloadDayFilter('ALL');
                            setAutoBatchStudioMode('milestone_multiday');
                            setAllocatorViewTab('visual_days');
                            setHideWorkloadTopRibbon(true);
                            setShowAutoBatchStudio(true);
                          }}
                          className="h-6 px-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10.5px] cursor-pointer transition flex items-center gap-1"
                          title="Open Milestone Workload & Multiday Target Allocator"
                        >
                          <Zap className="h-3 w-3 fill-current" />
                          <span>Allocate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSelectMilestoneChapters(activeMilestoneCheckpoint, false)}
                          className="h-6 px-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-bold text-[9.5px] cursor-pointer transition"
                          title="Load pending milestone chapters into today's checklist"
                        >
                          <span>{quickSelectMilestoneFeedback[activeMilestoneCheckpoint.id] || 'Load Today'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setViewFormat('roadmap')}
                        className="h-7 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10.5px] font-bold cursor-pointer transition flex items-center gap-1"
                        title="Create or select a milestone in Roadmap"
                      >
                        <Flag className="h-3 w-3 text-amber-400" />
                        <span>+ Milestone</span>
                      </button>
                    )
                  )}

                  {/* 24-Hour Clock & Studio Trigger */}
                  <div className="flex items-center h-7">
                    <button
                      type="button"
                      onClick={onGoToClock || (() => { setAutoBatchStudioMode('single_day'); setShowAutoBatchStudio(true); })}
                      className="px-2 h-full rounded-lg hover:bg-cyan-500/15 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      title="View / Schedule 24-Hour Target Clock"
                    >
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span>24h Clock</span>
                      <span className="px-1 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded text-[9px] font-bold tabular-nums">
                        {targetClockSlotsForDay.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoBatchStudioMode('single_day');
                        setShowAutoBatchStudio(true);
                      }}
                      className="px-2 h-full rounded-r-lg hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-200 text-[10px] font-bold transition cursor-pointer border-l border-slate-800"
                      title="Open 24-Hour Block Studio"
                    >
                      Studio
                    </button>
                  </div>
                </div>

                {/* Segment Group 3: Goal Board, Setup & Reports */}
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 gap-1 font-mono">
                  {viewFormat !== 'roadmap' && (
                    <div className="flex items-center gap-1 px-2 border-r border-slate-800 h-7">
                      <span className="text-[9px] font-bold uppercase text-slate-500">Board:</span>
                      <select
                        value={selectedListId}
                        onChange={(e) => setSelectedListId(e.target.value)}
                        className="bg-transparent text-[10.5px] font-bold text-slate-200 focus:outline-hidden cursor-pointer max-w-[115px] truncate"
                        title="Active Goal Board"
                      >
                        {taskLists.map(list => (
                          <option key={list.id} value={list.id} className="bg-slate-950 text-slate-100">
                            {list.title}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowAddListForm(prev => !prev)}
                        className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Create New Goal Board"
                      >
                        <FolderPlus className="h-3 w-3 text-indigo-400" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowFinalExamDatesModal(true)}
                    className="h-7 px-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-[10.5px] transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                    title="Enter CA Final Exam Dates (Papers 1–6) to auto-add 1.5-Day Sprints"
                  >
                    <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>Exam Dates</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImportTemplateModal(true)}
                    className="h-7 px-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-200 hover:text-white font-bold text-[10.5px] transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                    title="Import or Export Study Schedule (PDF)"
                  >
                    <FileText className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span>PDF Schedule</span>
                  </button>

                  {onGoToRevisionReport && (
                    <button
                      type="button"
                      onClick={onGoToRevisionReport}
                      className="h-7 px-2 rounded-lg hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-[10.5px] transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                      title="Open Revision Report"
                    >
                      <FileText className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="hidden md:inline">Report</span>
                    </button>
                  )}

                  {plannerUndoStack.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoLastPlannerAction}
                      className="h-7 px-2 rounded-lg text-[10.5px] font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/35 flex items-center gap-1 transition cursor-pointer"
                      title={`Undo last action: ${plannerUndoStack[0].label} (Ctrl+Z)`}
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Undo ({plannerUndoStack.length})</span>
                    </button>
                  )}
                </div>
              </>
            )}

            {lmrActiveFlag && (
              <div className="flex items-center bg-slate-950 border border-cyan-500/40 rounded-lg h-8 p-0.5 font-mono">
                <button
                  type="button"
                  onClick={onGoToClock || (() => { setAutoBatchStudioMode('single_day'); setShowAutoBatchStudio(true); })}
                  className="px-2.5 h-full rounded hover:bg-cyan-500/15 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="View / Schedule 24-Hour Target Clock"
                >
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>24h Clock</span>
                  <span className="px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded text-[9.5px] font-bold tabular-nums">
                    {targetClockSlotsForDay.length}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inline New Goal Board Form (Only shown when toggled) */}
        {showAddListForm && viewFormat !== 'roadmap' && (
          <div className="pt-1 pb-1 border-b border-slate-800/80 flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="New Goal Board Name (e.g. CA Final IDT Targets)..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="flex-1 min-w-[200px] bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400"
            />
            <button
              type="button"
              onClick={handleCreateTaskList}
              disabled={!newListName.trim()}
              className="px-2.5 py-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg text-xs disabled:opacity-50 cursor-pointer"
            >
              Create Board
            </button>
            <button
              type="button"
              onClick={() => setShowAddListForm(false)}
              className="px-2 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Row 2: Temporal Date Navigator & Workspace Mode Controls (Shown for Schedule / Backlog views) */}
        {viewFormat !== 'roadmap' && (
          <div className="header-diminish-row flex flex-wrap items-center justify-between gap-2 relative z-10 pt-0.5">
            {/* Left Side: Temporal Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const [yr, mn, dy] = selectedDate.split('-').map(Number);
                    const prev = new Date(yr, mn - 1, dy);
                    prev.setDate(prev.getDate() - (viewFormat === 'weekly' ? 7 : 1));
                    const prevYr = prev.getFullYear();
                    const prevMn = String(prev.getMonth() + 1).padStart(2, '0');
                    const prevDy = String(prev.getDate()).padStart(2, '0');
                    setSelectedDate(`${prevYr}-${prevMn}-${prevDy}`);
                  }}
                  className="px-2 py-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold"
                  title={viewFormat === 'weekly' ? "Previous Week" : "Previous Day"}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(getSystemLocalDateString())}
                  className="px-2.5 py-0.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white text-[10px] font-bold tracking-tight transition cursor-pointer font-mono"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const [yr, mn, dy] = selectedDate.split('-').map(Number);
                    const next = new Date(yr, mn - 1, dy);
                    next.setDate(next.getDate() + (viewFormat === 'weekly' ? 7 : 1));
                    const nextYr = next.getFullYear();
                    const nextMn = String(next.getMonth() + 1).padStart(2, '0');
                    const nextDy = String(next.getDate()).padStart(2, '0');
                    setSelectedDate(`${nextYr}-${nextMn}-${nextDy}`);
                  }}
                  className="px-2 py-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold"
                  title={viewFormat === 'weekly' ? "Next Week" : "Next Day"}
                >
                  →
                </button>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-100 truncate">
                  {viewFormat === 'weekly'
                    ? (weeklyStats.label || 'Weekly Overview')
                    : getFriendlyDateLabel(selectedDate)}
                </span>
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-lg text-[10.5px] text-slate-300 px-2 py-0.5 focus:outline-hidden cursor-pointer font-mono shrink-0"
                title="Jump directly to date"
              />
            </div>

            {/* Right Side: Workspace Canvas Mode Switcher (Subjects | Kanban | List) & Analytics */}
            <div className="flex items-center gap-2 flex-wrap">
              {viewFormat === 'daily' && (
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setDailyLayoutMode('subjects');
                      setGroupDailyBySubject(true);
                      try {
                        localStorage.setItem('practca_daily_layout_mode_v1', 'subjects');
                        localStorage.setItem('practca_daily_group_by_subject', 'true');
                      } catch (e) {}
                    }}
                    className={`px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 transition cursor-pointer ${
                      dailyLayoutMode === 'subjects'
                        ? 'bg-indigo-500 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Subject-Grouped Accordion Cards with Inline Chapter Progress Bars"
                  >
                    <Layers className="h-3 w-3" />
                    <span>Subjects</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDailyLayoutMode('kanban');
                      try {
                        localStorage.setItem('practca_daily_layout_mode_v1', 'kanban');
                      } catch (e) {}
                    }}
                    className={`px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 transition cursor-pointer ${
                      dailyLayoutMode === 'kanban'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Compact Kanban Board by Status (Pending, In Progress, Done)"
                  >
                    <Target className="h-3 w-3" />
                    <span>Kanban</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDailyLayoutMode('list');
                      setGroupDailyBySubject(false);
                      try {
                        localStorage.setItem('practca_daily_layout_mode_v1', 'list');
                        localStorage.setItem('practca_daily_group_by_subject', 'false');
                      } catch (e) {}
                    }}
                    className={`px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 transition cursor-pointer ${
                      dailyLayoutMode === 'list'
                        ? 'bg-slate-800 text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Unified Priority Stream & Batch Clubbing List"
                  >
                    <List className="h-3 w-3" />
                    <span>Unified List</span>
                  </button>
                </div>
              )}

              {viewFormat === 'daily' && selectedDayTasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeChartTab === 'progress') setActiveChartTab('subject');
                    setShowDailyAnalyticsDrawer(prev => !prev);
                  }}
                  className={`h-6 px-2 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer flex items-center gap-1 ${
                    showDailyAnalyticsDrawer
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                  }`}
                  title="Toggle Daily Study Analytics Chart"
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Charts</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* COMPACT TASKS SUMMARY BAR (Only shown for non-roadmap views) */}
      {viewFormat !== 'roadmap' && (
        <TasksSummaryBoard
          tasks={mappedTasks}
          onViewPending={() => setViewFormat('all-pending')}
          onViewMissed={() => setViewFormat('all-missed')}
        />
      )}

      {loading && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-indigo-400 justify-center font-mono text-[11px] uppercase tracking-wider animate-pulse font-bold">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
          <span>{isLocalMode ? "Processing local request..." : "Syncing with Cloud storage..."}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex gap-2.5 items-center">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <div className="text-xs font-semibold">{errorMsg}</div>
        </div>
      )}

      {/* SINGLE CONSOLIDATED BACKLOG RESCHEDULE BAR */}
      {!lmrActiveFlag && overduePendingTasks.length > 0 && (
        <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-xs text-amber-200">
              {overduePendingTasks.length} Overdue Target{overduePendingTasks.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Roll forward to today or balance across upcoming study days.
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCapacityAwareAutoReschedule}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
              title="Auto-reschedule: fills today's capacity (up to 3) and spreads remainder"
            >
              <Zap className="h-3 w-3 fill-slate-950 text-slate-950" />
              <span>Auto-Reschedule</span>
            </button>

            <button
              type="button"
              onClick={handleRollForwardToToday}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 font-bold text-[11px] rounded-lg transition cursor-pointer"
              title="Move all overdue backlog targets to today's date"
            >
              <span>All to Today</span>
            </button>

            <button
              type="button"
              onClick={handleSmartSpreadOverdue}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/30 font-bold text-[11px] rounded-lg transition cursor-pointer flex items-center gap-1"
              title="Spread overdue tasks across upcoming study days"
            >
              <Calendar className="h-3 w-3 text-amber-400" />
              <span>Spread</span>
            </button>
          </div>
        </div>
      )}

        <div className={viewFormat === 'roadmap' ? 'w-full flex flex-col' : 'space-y-3'}>
          {viewFormat === 'daily' ? (
            <div className="space-y-3">
              {/* FULL-WIDTH MAIN WORKSPACE */}
              <div className="space-y-3">
              
              {/* Optional Collapsible Study Analytics Card */}
              {selectedDayTasks.length > 0 && showDailyAnalyticsDrawer && (
                <motion.div 
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm font-sans relative overflow-hidden"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-wider">
                        Daily Breakdown Charts
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex bg-slate-950 border border-slate-800 p-0.5 rounded-lg shrink-0">
                        {[
                          { id: 'subject', label: 'By Subject' },
                          { id: 'relevance', label: 'By Relevance' }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveChartTab(tab.id as any)}
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                              (activeChartTab === tab.id || (activeChartTab === 'progress' && tab.id === 'subject'))
                                ? 'bg-indigo-500 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDailyAnalyticsDrawer(false)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                        title="Hide Charts"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="h-[130px] w-full relative">
                    {(activeChartTab === 'subject' || activeChartTab === 'progress') && (
                      <div className="h-full w-full animate-fadeIn">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={subjectChartData} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                            <XAxis dataKey="subject" stroke="#7880a0" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis stroke="#7880a0" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0e1120', borderColor: '#1e2440', borderRadius: '6px', fontSize: '10px' }} 
                              itemStyle={{ color: '#e8eaf6' }}
                            />
                            <Bar dataKey="Active" fill="#6366f1" radius={[2, 2, 0, 0]} name="Pending" />
                            <Bar dataKey="Completed" fill="#10b981" radius={[2, 2, 0, 0]} name="Done" />
                            <Bar dataKey="Unachieved" fill="#ef4444" radius={[2, 2, 0, 0]} name="Missed" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {activeChartTab === 'relevance' && (
                      <div className="h-full w-full animate-fadeIn">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={priorityChartData} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                            <XAxis dataKey="priority" stroke="#7880a0" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis stroke="#7880a0" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0e1120', borderColor: '#1e2440', borderRadius: '6px', fontSize: '10px' }} 
                              itemStyle={{ color: '#e8eaf6' }}
                            />
                            <Bar dataKey="Active" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Pending" />
                            <Bar dataKey="Completed" fill="#10b981" radius={[2, 2, 0, 0]} name="Done" />
                            <Bar dataKey="Unachieved" fill="#ef4444" radius={[2, 2, 0, 0]} name="Missed" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Day's Active Checklist panel */}
              <motion.div 
                className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Live Toast Banner for Quick-Select, Auto-Batch & Undo */}
                {autoBatchBannerMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{autoBatchBannerMsg}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {onGoToClock && (
                        <button
                          type="button"
                          onClick={onGoToClock}
                          className="px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 font-black text-[10px] hover:bg-cyan-400 cursor-pointer transition"
                        >
                          View 24h Clock →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setAutoBatchBannerMsg(null)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {selectedTaskIds.length > 0 && (
                  <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-2 rounded-xl gap-3 flex-wrap animate-scaleUp">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={sortedActiveTasks.length > 0 && sortedActiveTasks.every(t => selectedTaskIds.includes(t.id))}
                        onChange={() => {
                          const allSelected = sortedActiveTasks.length > 0 && sortedActiveTasks.every(t => selectedTaskIds.includes(t.id));
                          if (allSelected) {
                            const activeIds = sortedActiveTasks.map(t => t.id);
                            setSelectedTaskIds(prev => prev.filter(id => !activeIds.includes(id)));
                          } else {
                            const activeIds = sortedActiveTasks.map(t => t.id);
                            setSelectedTaskIds(prev => {
                              const otherIds = prev.filter(id => !activeIds.includes(id));
                              return [...otherIds, ...activeIds];
                            });
                          }
                        }}
                        className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-400 focus:ring-offset-slate-900 cursor-pointer"
                      />
                      <span className="text-xs font-black text-indigo-300 font-mono">
                        {selectedTaskIds.length} SELECTED
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedTaskIds.length >= 2 && (
                        canClubSelectedTasks ? (
                          <button
                            type="button"
                            onClick={() => {
                              const defaultTotal = selectedActiveObjects.reduce((acc, t) => acc + (t.targetDurationMinutes || 60), 0);
                              const clamped = Math.min(600, roundToNearest15MinSlab(defaultTotal, selectedActiveObjects.length * 15));
                              setClubHoursInput(Math.floor(clamped / 60));
                              setClubMinutesInput(clamped % 60);
                              setShowClubTargetsBar(prev => !prev);
                            }}
                            className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer"
                            title="Club selected same-subject chapters into a single unified planned time frame"
                          >
                            <Layers className="h-3 w-3" />
                            <span>Club ({selectedTaskIds.length})</span>
                          </button>
                        ) : (
                          <span
                            className="px-2 py-1 bg-slate-900/90 border border-amber-500/35 text-amber-300 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1"
                            title="Clubbing is restricted to chapters from the same subject only"
                          >
                            <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                            <span>Same-subject required to club ({selectedUniqueSubjects.join(', ')})</span>
                          </span>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => handleAutoBatchChaptersInto90MinClock(undefined, false)}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer"
                        title="Group selected chapters into balanced 90-minute study blocks in the 24-hour target clock"
                      >
                        <Zap className="h-3 w-3" />
                        <span>Auto-Batch 90m</span>
                      </button>
                      <button
                        onClick={handleBulkComplete}
                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer"
                        title="Mark Selected as Complete"
                      >
                        <Check className="h-3 w-3" />
                        <span>Complete</span>
                      </button>
                      <button
                        onClick={handleBulkDeleteClick}
                        className="px-2.5 py-1 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-lg text-[11px] flex items-center gap-1 transition cursor-pointer"
                        title="Delete Selected Tasks"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTaskIds([]);
                          setShowClubTargetsBar(false);
                        }}
                        className="px-2 py-1 text-slate-400 hover:text-slate-200 text-[11px] font-semibold transition cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Inline Batch Time Frame Configurator Bar */}
                    {showClubTargetsBar && canClubSelectedTasks && (
                      <div className="w-full pt-2 mt-1 border-t border-indigo-500/30 space-y-2 font-mono">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10.5px] font-black text-cyan-300 uppercase flex items-center gap-1">
                              <Layers className="h-3 w-3 text-cyan-400" />
                              <span>Batch {selectedActiveObjects.length} [{selectedUniqueSubjects[0]}] Chapters:</span>
                            </span>
                            <div className="flex items-center gap-1">
                              {[90, 120, 180, 240, 300].map(presetMins => {
                                const isPresetActive = (clubHoursInput * 60 + clubMinutesInput) === presetMins;
                                return (
                                  <button
                                    key={presetMins}
                                    type="button"
                                    onClick={() => {
                                      setClubHoursInput(Math.floor(presetMins / 60));
                                      setClubMinutesInput(presetMins % 60);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-black border transition cursor-pointer ${
                                      isPresetActive
                                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-cyan-500/40'
                                    }`}
                                  >
                                    {formatMinutes(presetMins)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-1.5 py-1 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  const next = Math.max(selectedActiveObjects.length, clubHoursInput * 60 + clubMinutesInput - 15);
                                  setClubHoursInput(Math.floor(next / 60));
                                  setClubMinutesInput(next % 60);
                                }}
                                className="w-5 h-5 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 flex items-center justify-center transition cursor-pointer shrink-0"
                                title="Decrease Batch Duration (-15m)"
                              >
                                <ChevronDown className="h-3 w-3 stroke-[2.5]" />
                              </button>
                              <input
                                type="number"
                                min={0}
                                max={16}
                                value={clubHoursInput}
                                onChange={(e) => setClubHoursInput(Math.max(0, Math.min(16, parseInt(e.target.value, 10) || 0)))}
                                className="w-9 bg-slate-900 border border-slate-800 rounded text-amber-300 font-black text-center focus:outline-hidden"
                              />
                              <span className="text-[9.5px] text-slate-400 font-bold">h</span>
                              <input
                                type="number"
                                min={0}
                                max={59}
                                step={1}
                                value={clubMinutesInput}
                                onChange={(e) => setClubMinutesInput(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
                                className="w-9 bg-slate-900 border border-slate-800 rounded text-amber-300 font-black text-center focus:outline-hidden"
                              />
                              <span className="text-[9.5px] text-slate-400 font-bold">m</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = Math.min(720, clubHoursInput * 60 + clubMinutesInput + 15);
                                  setClubHoursInput(Math.floor(next / 60));
                                  setClubMinutesInput(next % 60);
                                }}
                                className="w-5 h-5 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 flex items-center justify-center transition cursor-pointer shrink-0"
                                title="Increase Batch Duration (+15m)"
                              >
                                <ChevronUp className="h-3 w-3 stroke-[2.5]" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleClubSelectedTasks()}
                              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <Check className="h-3 w-3 stroke-[3]" />
                              <span>Confirm ({formatMinutes(Math.max(selectedActiveObjects.length, clubHoursInput * 60 + clubMinutesInput))})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowClubTargetsBar(false)}
                              className="px-1.5 py-1 text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        {clubbingPreviewAllocations.length > 0 && (
                          <div className="p-2 rounded-lg bg-slate-950/80 border border-cyan-500/25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                            {selectedActiveObjects.map((t, idx) => {
                              const alloc = clubbingPreviewAllocations[idx];
                              if (!alloc) return null;
                              return (
                                <div
                                  key={`${t.id || 'sel'}_${idx}`}
                                  className="px-2 py-1 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 text-[10px]"
                                >
                                  <span className="text-white font-bold truncate" title={t.cleanTitle || t.title}>
                                    #{idx + 1} {t.cleanTitle || t.title}
                                  </span>
                                  <span className="text-amber-300 font-black shrink-0">
                                    {formatMinutes(alloc.allocatedMinutes)} ({alloc.sharePercent}%)
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* WORKLOAD & TARGET ALLOCATOR POP-UP MODAL */}
                {(() => {
                  const totalPlannedMins = targetClockSlotsForDay.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
                  const remainingClockMins = Math.max(0, 1440 - totalPlannedMins);
                  const selectedOrActiveCount = selectedTaskIds.length > 0 ? selectedTaskIds.length : sortedActiveTasks.length;
                  const hasMilestone = sortedRoadmapCheckpoints.length > 0 && !!milestoneAutoAllocationPlan;

                  if (!showAutoBatchStudio && !tracedFromRoadmap) {
                    return null;
                  }

                  const avgDailyHrs = Number((milestoneStudyAnalytics.rolling7DayAvgMins / 60).toFixed(1));
                  const filteredFineTuneChapters = milestoneAutoAllocationPlan
                    ? milestoneAutoAllocationPlan.enrichedChapters.filter(ch => {
                        if (!allocatorChapterSearch.trim()) return true;
                        const q = allocatorChapterSearch.toLowerCase();
                        return (
                          ch.chapterName.toLowerCase().includes(q) ||
                          ch.subjectCode.toLowerCase().includes(q) ||
                          ch.importance.toLowerCase().includes(q)
                        );
                      })
                    : [];

                  const visibleDaySchedules = milestoneAutoAllocationPlan
                    ? selectedWorkloadDayFilter === 'ALL'
                      ? milestoneAutoAllocationPlan.daySchedules
                      : milestoneAutoAllocationPlan.daySchedules.filter(d => d.dateStr === selectedWorkloadDayFilter)
                    : [];

                  return (
                    <>
                      {tracedFromRoadmap && (
                        <div className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between gap-3 text-xs font-mono">
                          <div className="flex items-center gap-2.5 text-amber-200 truncate">
                            <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[10px] shrink-0">
                              MILESTONE READY
                            </span>
                            <span className="truncate text-slate-300">
                              Milestone selected. Click <strong className="text-amber-300 font-bold">Allocate</strong> to distribute targets across days or load into today.
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (activeMilestoneCheckpoint) {
                                  setSelectedMilestoneId(activeMilestoneCheckpoint.id);
                                  setMilestoneCustomDaysOverride(null);
                                  setSelectedWorkloadDayFilter('ALL');
                                  setAutoBatchStudioMode('milestone_multiday');
                                  setAllocatorViewTab('visual_days');
                                  setHideWorkloadTopRibbon(true);
                                  setShowAutoBatchStudio(true);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition flex items-center gap-1 shadow-xs"
                            >
                              <Zap className="h-3 w-3 fill-current" />
                              <span>Allocate</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewFormat('roadmap')}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs cursor-pointer transition"
                            >
                              ← Roadmap
                            </button>
                            <button
                              type="button"
                              onClick={() => setTracedFromRoadmap(false)}
                              className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-md hover:bg-slate-800 transition"
                              title="Dismiss notice"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* DEDICATED DAILY WORKLOAD & TARGET ALLOCATOR POP-UP MODAL */}
                      <AnimatePresence>
                        {showAutoBatchStudio && (
                          <ModalPortal triggerKey={`workload_popup_${selectedMilestoneId}_${autoBatchStudioMode}`}>
                            <div
                              className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none"
                              onClick={(e) => {
                                if (e.target === e.currentTarget) setShowAutoBatchStudio(false);
                              }}
                            >
                              <motion.div
                                initial={{ scale: 0.96, opacity: 0, y: 12 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.96, opacity: 0, y: 12 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="relative bg-[#090D16] border border-slate-800 text-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono tabular-nums"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Traced-from-Milestones Breadcrumb Strip inside Modal */}
                                {tracedFromRoadmap && (
                                  <div className="px-5 py-2.5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between gap-2 text-xs shrink-0">
                                    <div className="flex items-center gap-2 text-amber-200 flex-wrap">
                                      <span className="px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[10px]">
                                        TRACED FROM MILESTONE
                                      </span>
                                      <span className="text-slate-300">
                                        Review daily capacity bars and day cards below, then click <strong className="text-amber-300">Allocate</strong> to populate your Daily Target List.
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowAutoBatchStudio(false);
                                          setViewFormat('roadmap');
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs cursor-pointer transition"
                                      >
                                        ← Back to Milestones
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setTracedFromRoadmap(false)}
                                        className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-md hover:bg-slate-800 transition"
                                        title="Dismiss notice"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Sticky Modal Header */}
                                <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border-b border-slate-800 shrink-0">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 shrink-0">
                                      <Flag className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-sm sm:text-base font-black text-white tracking-tight font-sans">
                                          Milestone Workload & Target Allocator
                                        </h3>
                                        <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                                          7d Study Avg: {avgDailyHrs}h/day
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                                        Multi-day capacity visualizer, 1-click horizon presets, and day-by-day chapter balancing
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    {plannerUndoStack.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={handleUndoLastPlannerAction}
                                        className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/40 text-[10.5px] font-mono font-black flex items-center gap-1.5 cursor-pointer transition"
                                        title={`Undo last action: ${plannerUndoStack[0].label}`}
                                      >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        <span>Undo ({plannerUndoStack.length})</span>
                                      </button>
                                    )}
                                    {autoBatchStudioMode === 'milestone_multiday' && hasMilestone && milestoneAutoAllocationPlan && (
                                      <button
                                        type="button"
                                        onClick={() => setHideWorkloadTopRibbon(prev => !prev)}
                                        className={`px-3 py-1.5 rounded-xl font-mono font-black text-[10.5px] border transition cursor-pointer flex items-center gap-1.5 ${
                                          hideWorkloadTopRibbon
                                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                                            : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                                        }`}
                                        title={hideWorkloadTopRibbon ? 'Show Top Configuration Ribbon & Capacity Bars' : 'Hide Top Ribbon to focus on Day Cards Only'}
                                      >
                                        <span>{hideWorkloadTopRibbon ? '▼ Show Options' : '▲ Day Cards Only'}</span>
                                      </button>
                                    )}

                                    {/* Mode Switcher */}
                                    <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl text-[10.5px]">
                                      <button
                                        type="button"
                                        onClick={() => setAutoBatchStudioMode('milestone_multiday')}
                                        className={`px-3 py-1 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                                          autoBatchStudioMode === 'milestone_multiday'
                                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                      >
                                        <Calendar className="h-3 w-3" />
                                        <span>Allocate by Days</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAutoBatchStudioMode('single_day')}
                                        className={`px-3 py-1 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                                          autoBatchStudioMode === 'single_day'
                                            ? 'bg-cyan-400 text-slate-950 shadow-xs'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                      >
                                        <Clock className="h-3 w-3" />
                                        <span>Today's Clock ({targetClockSlotsForDay.length})</span>
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => setShowAutoBatchStudio(false)}
                                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition"
                                      title="Close Pop-Up (Esc)"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Scrollable Modal Body */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
                                  {autoBatchStudioMode === 'milestone_multiday' ? (
                                    !hasMilestone || !milestoneAutoAllocationPlan ? (
                                      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                                        <p className="text-sm text-slate-200 font-bold font-sans">
                                          No Upcoming Uncompleted Milestone Found
                                        </p>
                                        <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                                          Create an active milestone in the Roadmap with your target chapters and due date, then open this pop-up to allocate targets across days.
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowAutoBatchStudio(false);
                                            setViewFormat('roadmap');
                                          }}
                                          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                                        >
                                          <Compass className="h-3.5 w-3.5" />
                                          <span>Open Milestones Roadmap</span>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        {/* TOP RIBBON (Can be hidden by user to view Day Cards only) */}
                                        {!hideWorkloadTopRibbon && (
                                          <>
                                            {/* STEP 0: Milestone Selector Bar (Excludes Completed Milestones) */}
                                            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                              <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
                                                <span className="text-[10px] font-mono font-black uppercase text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                                                  <Flag className="h-3 w-3 text-amber-400" />
                                                  <span>Active Milestone</span>
                                                </span>
                                                <select
                                                  value={milestoneAutoAllocationPlan.checkpoint.id}
                                                  onChange={(e) => {
                                                    setSelectedMilestoneId(e.target.value);
                                                    setMilestoneCustomDaysOverride(null);
                                                    setSelectedWorkloadDayFilter('ALL');
                                                  }}
                                                  className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer flex-1 min-w-[220px]"
                                                >
                                                  {sortedRoadmapCheckpoints.map((cpItem, idx) => (
                                                    <option key={cpItem.id} value={cpItem.id} className="bg-slate-950 text-white">
                                                      #{idx + 1} • {cpItem.subjectId !== 'CUSTOM' ? cpItem.subjectId : cpItem.customTitle || 'Custom'} ({cpItem.revisionCycle}) — Due {cpItem.targetDate}
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>

                                              <div className="flex items-center gap-2 text-xs font-mono shrink-0 flex-wrap">
                                                {milestoneAutoAllocationPlan.isSubjectFinalExam ? (
                                                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 font-black text-[10.5px]">
                                                    🏆 {milestoneAutoAllocationPlan.checkpoint.subjectId !== 'CUSTOM' ? milestoneAutoAllocationPlan.checkpoint.subjectId : 'Subject'} Final Exam: {milestoneAutoAllocationPlan.checkpoint.targetDate}
                                                  </div>
                                                ) : milestoneAutoAllocationPlan.isFinal15DayRev ? (
                                                  <div className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-[10.5px]">
                                                    🔴 1.5d Final Revision Locked (All Targets = F)
                                                  </div>
                                                ) : null}
                                                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                                                  Targets: <strong className="text-emerald-400 font-bold tabular-nums">{milestoneAutoAllocationPlan.enrichedChapters.length} ch</strong>
                                                </div>
                                                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                                                  Total Est: <strong className="text-amber-300 font-bold tabular-nums">{formatMinutes(milestoneAutoAllocationPlan.totalTimeNeededMins)}</strong>
                                                </div>
                                                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                                                  {milestoneAutoAllocationPlan.isSubjectFinalExam ? 'Exam Date:' : 'Due:'}{' '}
                                                  <strong className="text-cyan-300 font-bold tabular-nums">{milestoneAutoAllocationPlan.checkpoint.targetDate}</strong>
                                                </div>
                                              </div>
                                            </div>

                                            {/* STEP 1–3: EASY-ACCESS 1-CLICK OPTIONS DOCK (3 Clean Cards) */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 font-mono">
                                              {/* CARD 1: NUMBER OF DAYS & START DATE */}
                                              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                                                <div className="space-y-2">
                                                  <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider">
                                                      1. Number of Days
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 tabular-nums">
                                                      ~{(milestoneAutoAllocationPlan.enrichedChapters.length / Math.max(1, milestoneAutoAllocationPlan.numDays)).toFixed(1)} ch/day
                                                    </span>
                                                  </div>

                                                  {/* 1-Click Day Horizon Pills */}
                                                  <div className="flex items-center gap-1 flex-wrap">
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setMilestoneCustomDaysOverride(null);
                                                        setSelectedWorkloadDayFilter('ALL');
                                                      }}
                                                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer ${
                                                        milestoneCustomDaysOverride === null
                                                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-xs'
                                                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                                      }`}
                                                      title="Match exact days until milestone due date"
                                                    >
                                                      Due ({milestoneAutoAllocationPlan.calculatedDaysUntilMilestone}d)
                                                    </button>
                                                    {[2, 3, 5, 7, 10, 14].map(dPreset => {
                                                      const isActive =
                                                        milestoneCustomDaysOverride === dPreset ||
                                                        (milestoneCustomDaysOverride === null && milestoneAutoAllocationPlan.numDays === dPreset);
                                                      return (
                                                        <button
                                                          key={dPreset}
                                                          type="button"
                                                          onClick={() => {
                                                            setMilestoneCustomDaysOverride(dPreset);
                                                            setSelectedWorkloadDayFilter('ALL');
                                                          }}
                                                          className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer ${
                                                            isActive
                                                              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 font-black'
                                                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                          }`}
                                                        >
                                                          {dPreset}d
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>

                                                {/* Custom Stepper + Start Date */}
                                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                                                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setMilestoneCustomDaysOverride(Math.max(1, milestoneAutoAllocationPlan.numDays - 1));
                                                        setSelectedWorkloadDayFilter('ALL');
                                                      }}
                                                      className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-black text-xs cursor-pointer"
                                                      title="Decrease days"
                                                    >
                                                      −
                                                    </button>
                                                    <span className="px-2 text-xs font-black text-cyan-300 tabular-nums">
                                                      {milestoneAutoAllocationPlan.numDays} {milestoneAutoAllocationPlan.numDays === 1 ? 'Day' : 'Days'}
                                                    </span>
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setMilestoneCustomDaysOverride(Math.min(60, milestoneAutoAllocationPlan.numDays + 1));
                                                        setSelectedWorkloadDayFilter('ALL');
                                                      }}
                                                      className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-black text-xs cursor-pointer"
                                                      title="Increase days"
                                                    >
                                                      +
                                                    </button>
                                                  </div>

                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-[10px] text-slate-400">Start (Fixed):</span>
                                                    <input
                                                      type="date"
                                                      value={milestoneAllocStartDate}
                                                      onChange={(e) => {
                                                        if (e.target.value) {
                                                          const newStart = e.target.value;
                                                          setMilestoneAllocStartDate(newStart);
                                                          setSelectedWorkloadDayFilter('ALL');
                                                          if (activeMilestoneCheckpoint) {
                                                            const next = roadmapCheckpoints.map(c =>
                                                              c.id === activeMilestoneCheckpoint.id ? { ...c, startDate: newStart } : c
                                                            );
                                                            setRoadmapCheckpoints(next);
                                                            try {
                                                              localStorage.setItem(getLevelScopedKey('practca_roadmap_user_checkpoints'), JSON.stringify(next));
                                                              window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
                                                            } catch (err) {}
                                                          }
                                                        }
                                                      }}
                                                      className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 text-[10.5px] font-bold focus:outline-none focus:border-cyan-400"
                                                      title="Milestone Start Date stays fixed and does not change as days pass unless edited here"
                                                    />
                                                  </div>
                                                </div>
                                              </div>

                                              {/* CARD 2: DAILY STUDY PACE & UNIFORM RELEVANCE (G / R / F) */}
                                              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                                                <div className="space-y-2">
                                                  <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                                                      2. Daily Target & Relevance
                                                    </span>
                                                    <span className="text-[10.5px] text-emerald-300 font-bold tabular-nums">
                                                      {formatMinutes(milestoneAutoAllocationPlan.baseDailyStudyMins)} / day
                                                    </span>
                                                  </div>

                                                  {/* 1-Click Daily Hours Presets */}
                                                  <div className="flex items-center gap-1 flex-wrap">
                                                    <button
                                                      type="button"
                                                      onClick={() => setMilestoneCustomDailyStudyMins(null)}
                                                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer ${
                                                        milestoneCustomDailyStudyMins === null
                                                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-xs'
                                                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                                      }`}
                                                      title="Use your rolling 7-day study average"
                                                    >
                                                      7d Avg ({avgDailyHrs}h)
                                                    </button>
                                                    {[
                                                      { label: '3h', mins: 180 },
                                                      { label: '4.5h', mins: 270 },
                                                      { label: '6h', mins: 360 },
                                                      { label: '8h', mins: 480 },
                                                      { label: '10h', mins: 600 }
                                                    ].map(hPreset => {
                                                      const isActive = milestoneCustomDailyStudyMins === hPreset.mins;
                                                      return (
                                                        <button
                                                          key={hPreset.mins}
                                                          type="button"
                                                          onClick={() => setMilestoneCustomDailyStudyMins(hPreset.mins)}
                                                          className={`px-2 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer ${
                                                            isActive
                                                              ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400 font-black'
                                                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                          }`}
                                                        >
                                                          {hPreset.label}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>

                                                {/* Uniform Relevance (G / R / F) Balance Selector */}
                                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                                                  <span className="text-[10px] text-slate-400" title="Maintain uniform relevance across all allocated chapters">
                                                    All Chapters:
                                                  </span>
                                                  {isFinalSprintOr15DayMilestone(milestoneAutoAllocationPlan.checkpoint) ? (
                                                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black">
                                                      🔴 Locked to F (1.5d Final Rev)
                                                    </span>
                                                  ) : (
                                                    <div className="flex bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-[10px] gap-0.5">
                                                      {([
                                                        { val: 'General', short: 'G (General)', activeCls: 'bg-sky-500/25 text-sky-200 border border-sky-400/50' },
                                                        { val: 'Revision', short: 'R (Revision)', activeCls: 'bg-amber-500/25 text-amber-200 border border-amber-400/50' },
                                                        { val: 'Final Revision', short: 'F (1.5d Final)', activeCls: 'bg-rose-500/25 text-rose-200 border border-rose-400/50' }
                                                      ] as const).map(rOpt => {
                                                        const isSelectedRel = milestoneAutoAllocationPlan.defaultUniformRelevance === rOpt.val;
                                                        return (
                                                          <button
                                                            key={rOpt.val}
                                                            type="button"
                                                            onClick={() => {
                                                              setMilestoneUniformRelevance(rOpt.val);
                                                              setChapterCustomConfig(prev => {
                                                                const next = { ...prev };
                                                                Object.keys(next).forEach(k => {
                                                                  if (next[k]?.relevance) {
                                                                    const copy = { ...next[k] };
                                                                    delete copy.relevance;
                                                                    next[k] = copy;
                                                                  }
                                                                });
                                                                try {
                                                                  localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
                                                                } catch (e) {}
                                                                return next;
                                                              });
                                                            }}
                                                            className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                                                              isSelectedRel ? rOpt.activeCls : 'text-slate-400 hover:text-white'
                                                            }`}
                                                            title={`Set all chapter targets uniformly to ${rOpt.val}`}
                                                          >
                                                            {rOpt.short}
                                                          </button>
                                                        );
                                                      })}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {/* CARD 3: PRIORITY STRATEGY, BLOCK SIZE & MANUAL START TIME */}
                                              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                                                <div className="space-y-2">
                                                  <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider block">
                                                    3. Priority Order & Start Window
                                                  </span>

                                                  {/* 1-Click Priority Order Pills */}
                                                  <div className="grid grid-cols-2 gap-1">
                                                    {[
                                                      { id: 'importance_and_least_spent', label: '★ Priority + Untouched' },
                                                      { id: 'importance_only', label: '🔥 High Priority (A→C)' },
                                                      { id: 'least_spent_first', label: '⏱ Least Time Spent' },
                                                      { id: 'syllabus_order', label: '📖 Syllabus Sequence' }
                                                    ].map(strat => (
                                                      <button
                                                        key={strat.id}
                                                        type="button"
                                                        onClick={() => setMilestoneSortStrategy(strat.id as any)}
                                                        className={`px-2 py-1 rounded-lg text-[9.5px] font-bold border text-left truncate transition cursor-pointer ${
                                                          milestoneSortStrategy === strat.id
                                                            ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400 font-black'
                                                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                        }`}
                                                      >
                                                        {strat.label}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>

                                                {/* Clock Block Size & Manual Start Time Input */}
                                                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80 flex-wrap">
                                                  <div className="flex items-center gap-1">
                                                    {[
                                                      { val: 'exact_chapter_time', label: 'Exact' },
                                                      { val: 60, label: '60m' },
                                                      { val: 90, label: '90m' },
                                                      { val: 120, label: '120m' }
                                                    ].map(blk => (
                                                      <button
                                                        key={String(blk.val)}
                                                        type="button"
                                                        onClick={() => setMilestoneBatchBlockSize(blk.val as any)}
                                                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border transition cursor-pointer ${
                                                          milestoneBatchBlockSize === blk.val
                                                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-black'
                                                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                                        }`}
                                                        title="24h Clock block batching mode"
                                                      >
                                                        {blk.label}
                                                      </button>
                                                    ))}
                                                  </div>

                                                  <div className="flex items-center gap-1 text-[10px]">
                                                    <span className="text-slate-400">Start:</span>
                                                    <input
                                                      type="time"
                                                      value={autoBatchStartTime}
                                                      onChange={(e) => {
                                                        if (e.target.value) setAutoBatchStartTime(e.target.value);
                                                      }}
                                                      className="bg-slate-950 border border-slate-800 focus:border-amber-400 text-amber-300 rounded px-1.5 py-0.5 font-bold cursor-pointer focus:outline-none"
                                                      title="Choose exact manual start time for daily study blocks"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* INTERACTIVE DAILY WORKLOAD CAPACITY BARS STRIP */}
                                            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span className="text-white font-black uppercase tracking-wider text-[11px]">
                                                    Interactive Daily Capacity ({milestoneAutoAllocationPlan.numDays} Days)
                                                  </span>
                                                  <span className="text-slate-400 text-[10.5px]">
                                                    — Click any day bar to focus its Day Card
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10.5px]">
                                                  <span className="flex items-center gap-1 text-emerald-300">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> ≤100% Cap
                                                  </span>
                                                  <span className="flex items-center gap-1 text-amber-300">
                                                    <span className="h-2 w-2 rounded-full bg-amber-400" /> 101–115%
                                                  </span>
                                                  <span className="flex items-center gap-1 text-rose-300">
                                                    <span className="h-2 w-2 rounded-full bg-rose-500" /> &gt;115% Overloaded
                                                  </span>
                                                  <span className="text-slate-400 pl-1 border-l border-slate-800">
                                                    Cap: <strong className="text-emerald-300 tabular-nums">{formatMinutes(milestoneAutoAllocationPlan.dailyTargetCapMins)}</strong>
                                                  </span>
                                                </div>
                                              </div>

                                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                                                {milestoneAutoAllocationPlan.daySchedules.map((dSched) => {
                                                  const rawPct = Math.round(
                                                    (dSched.totalMinsForDay / Math.max(60, milestoneAutoAllocationPlan.dailyTargetCapMins)) * 100
                                                  );
                                                  const capRatio = Math.min(100, rawPct);
                                                  const isOverloaded = rawPct > 115;
                                                  const isNearCap = rawPct > 100 && rawPct <= 115;
                                                  const isFocused = selectedWorkloadDayFilter === dSched.dateStr;

                                                  const barColor =
                                                    dSched.chapters.length === 0
                                                      ? 'bg-slate-700'
                                                      : isOverloaded
                                                        ? 'bg-rose-500'
                                                        : isNearCap
                                                          ? 'bg-amber-400'
                                                          : 'bg-emerald-400';

                                                  const textColor =
                                                    dSched.chapters.length === 0
                                                      ? 'text-slate-500'
                                                      : isOverloaded
                                                        ? 'text-rose-300 font-black'
                                                        : isNearCap
                                                          ? 'text-amber-300 font-bold'
                                                          : 'text-emerald-300 font-bold';

                                                  return (
                                                    <button
                                                      key={dSched.dateStr}
                                                      type="button"
                                                      onClick={() => {
                                                        setSelectedDate(dSched.dateStr);
                                                        setSelectedWorkloadDayFilter(prev =>
                                                          prev === dSched.dateStr ? 'ALL' : dSched.dateStr
                                                        );
                                                      }}
                                                      className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                                                        isFocused
                                                          ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400/40 shadow-sm'
                                                          : 'bg-slate-950/90 border-slate-850 hover:border-slate-700'
                                                      }`}
                                                      title={`Day ${dSched.dayNumber} (${dSched.dateStr}): ${dSched.chapters.length} chapters, ${formatMinutes(dSched.totalMinsForDay)} (${rawPct}% of daily cap). Click to filter Day Card.`}
                                                    >
                                                      <div className="flex items-center justify-between text-[10px] mb-1">
                                                        <span className="font-black text-amber-300">Day {dSched.dayNumber}</span>
                                                        <span className="text-slate-400">{dSched.dateStr.slice(5)}</span>
                                                      </div>
                                                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-1.5 border border-slate-850">
                                                        <div
                                                          className={`h-full rounded-full transition-all ${barColor}`}
                                                          style={{ width: `${dSched.chapters.length === 0 ? 6 : Math.max(12, capRatio)}%` }}
                                                        />
                                                      </div>
                                                      <div className="flex items-center justify-between text-[9.5px]">
                                                        <span className="text-slate-300 font-bold tabular-nums">{dSched.chapters.length} ch</span>
                                                        <span className={`${textColor} tabular-nums`}>
                                                          {formatMinutes(dSched.totalMinsForDay)} ({rawPct}%)
                                                        </span>
                                                      </div>
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          </>
                                        )}

                                        {/* STEP 4: COHESIVE VISUALIZATION TOOLBAR */}
                                        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/95 border border-slate-800 p-2.5 rounded-2xl text-[11px] font-mono">
                                          {/* Left: View Tabs Segmented Control + Filter Escape */}
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                              <button
                                                type="button"
                                                onClick={() => setAllocatorViewTab('visual_days')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                                                  allocatorViewTab === 'visual_days'
                                                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                              >
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>Day Cards ({visibleDaySchedules.length}/{milestoneAutoAllocationPlan.numDays}d)</span>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setAllocatorViewTab('chapter_table')}
                                                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                                                  allocatorViewTab === 'chapter_table'
                                                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                              >
                                                <List className="h-3.5 w-3.5" />
                                                <span>Fine-Tune Chapters ({milestoneAutoAllocationPlan.enrichedChapters.length})</span>
                                              </button>
                                            </div>

                                            {selectedWorkloadDayFilter !== 'ALL' && (
                                              <button
                                                type="button"
                                                onClick={() => setSelectedWorkloadDayFilter('ALL')}
                                                className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/35 font-bold cursor-pointer hover:bg-amber-500/25 transition text-[10.5px] flex items-center gap-1"
                                                title="Clear day filter to view all days"
                                              >
                                                <span>Show All {milestoneAutoAllocationPlan.numDays} Days</span>
                                                <X className="h-3 w-3" />
                                              </button>
                                            )}
                                          </div>

                                          {/* Right: Cohesive Action Toolbar */}
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            {/* Ribbon Visibility Toggle */}
                                            <button
                                              type="button"
                                              onClick={() => setHideWorkloadTopRibbon(prev => !prev)}
                                              className="h-8 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 font-bold cursor-pointer transition flex items-center gap-1 text-[10.5px]"
                                              title={hideWorkloadTopRibbon ? 'Expand top configuration options' : 'Collapse top configuration options'}
                                            >
                                              <span>{hideWorkloadTopRibbon ? '▼ Show Options' : '▲ Hide Options'}</span>
                                            </button>

                                            {/* Subject Chapters Pool Drawer Toggle */}
                                            <button
                                              type="button"
                                              onClick={() => setShowScratchChapterPool(prev => !prev)}
                                              className={`h-8 px-2.5 rounded-xl border font-bold cursor-pointer transition flex items-center gap-1.5 text-[10.5px] ${
                                                showScratchChapterPool || milestoneAutoAllocationPlan.unassignedChapters.length > 0
                                                  ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/40'
                                                  : 'bg-slate-950 hover:bg-slate-850 text-cyan-300 border-slate-800'
                                              }`}
                                              title="Open full list of subject chapters to manually add chapters to specific days from scratch"
                                            >
                                              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                                              <span>
                                                Chapters Pool
                                                {milestoneAutoAllocationPlan.unassignedChapters.length > 0 && (
                                                  <span className="ml-1 px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-black text-[9px]">
                                                    {milestoneAutoAllocationPlan.unassignedChapters.length} unassigned
                                                  </span>
                                                )}
                                              </span>
                                            </button>

                                            {/* Workload Balancer */}
                                            <button
                                              type="button"
                                              onClick={handleBalanceMilestoneLoadEvenly}
                                              className="h-8 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-emerald-300 border border-slate-800 hover:border-emerald-500/40 font-bold cursor-pointer transition flex items-center gap-1.5 text-[10.5px]"
                                              title="Automatically redistribute chapters so every day has an even study workload"
                                            >
                                              <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
                                              <span>Balance Evenly</span>
                                            </button>

                                            {/* Quick Auto-Allocate (when unassigned exist) */}
                                            {milestoneAutoAllocationPlan.unassignedChapters.length > 0 && (
                                              <button
                                                type="button"
                                                onClick={handleRestoreMilestoneQuickAllocation}
                                                className="h-8 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer transition flex items-center gap-1 text-[10.5px] shadow-xs"
                                                title="Restore default quick auto-allocation for all chapters across days"
                                              >
                                                <Zap className="h-3.5 w-3.5 fill-current" />
                                                <span>Auto-Allocate All</span>
                                              </button>
                                            )}

                                            {/* Reset Days to Blank */}
                                            <button
                                              type="button"
                                              onClick={handleResetMilestoneDaysToBlank}
                                              className="h-8 px-2.5 rounded-xl bg-slate-950 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 font-bold cursor-pointer transition flex items-center gap-1.5 text-[10.5px]"
                                              title="Clear all chapters from all Day Cards so you can allocate chapters to days from scratch"
                                            >
                                              <RotateCcw className="h-3 w-3" />
                                              <span>Reset Days</span>
                                            </button>

                                            {/* Reset Overrides */}
                                            {Object.keys(chapterCustomConfig).length > 0 && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setChapterCustomConfig({});
                                                  try {
                                                    localStorage.removeItem('practca_chapter_custom_batch_config_v1');
                                                  } catch (e) {}
                                                }}
                                                className="h-8 px-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition text-[10.5px]"
                                                title="Reset manual day shifts and time overrides back to smart defaults"
                                              >
                                                Reset Overrides
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        {/* SUBJECT CHAPTERS POOL DRAWER (FOR ADDING CHAPTERS TO DAYS FROM SCRATCH) */}
                                        {(showScratchChapterPool || milestoneAutoAllocationPlan.unassignedChapters.length > 0) && (
                                          <div className="p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/35 space-y-2.5 font-mono">
                                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase">
                                                  {milestoneAutoAllocationPlan.checkpoint.subjectId} Chapters Pool
                                                </span>
                                                <span className="text-[11px] font-bold text-white">
                                                  Add Chapters to Any Day from Scratch
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                  ({milestoneAutoAllocationPlan.unassignedChapters.length} Unassigned • {milestoneAutoAllocationPlan.allocatedChapters.length}/{milestoneAutoAllocationPlan.enrichedChapters.length} Scheduled on Days)
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-2 flex-wrap">
                                                <div className="flex bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-[9.5px]">
                                                  <button
                                                    type="button"
                                                    onClick={() => setScratchPoolFilter('unassigned')}
                                                    className={`px-2 py-0.5 rounded font-black cursor-pointer transition ${
                                                      scratchPoolFilter === 'unassigned'
                                                        ? 'bg-cyan-500 text-slate-950'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                                  >
                                                    Unassigned ({milestoneAutoAllocationPlan.unassignedChapters.length})
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => setScratchPoolFilter('all')}
                                                    className={`px-2 py-0.5 rounded font-black cursor-pointer transition ${
                                                      scratchPoolFilter === 'all'
                                                        ? 'bg-cyan-500 text-slate-950'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                                  >
                                                    All Subject Chapters ({milestoneAutoAllocationPlan.enrichedChapters.length})
                                                  </button>
                                                </div>

                                                <input
                                                  type="text"
                                                  value={scratchPoolSearch}
                                                  onChange={(e) => setScratchPoolSearch(e.target.value)}
                                                  placeholder="Filter chapters..."
                                                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-[10px] focus:outline-none focus:border-cyan-400 w-36 sm:w-44"
                                                />

                                                {milestoneAutoAllocationPlan.unassignedChapters.length === 0 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => setShowScratchChapterPool(false)}
                                                    className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[10px] cursor-pointer"
                                                  >
                                                    Hide Pool ✕
                                                  </button>
                                                )}
                                              </div>
                                            </div>

                                            {(() => {
                                              const basePool =
                                                scratchPoolFilter === 'unassigned' && milestoneAutoAllocationPlan.unassignedChapters.length > 0
                                                  ? milestoneAutoAllocationPlan.unassignedChapters
                                                  : milestoneAutoAllocationPlan.enrichedChapters;
                                              const q = scratchPoolSearch.trim().toLowerCase();
                                              const filteredPool = q
                                                ? basePool.filter(
                                                    c =>
                                                      c.chapterName.toLowerCase().includes(q) ||
                                                      c.subjectCode.toLowerCase().includes(q)
                                                  )
                                                : basePool;

                                              if (filteredPool.length === 0) {
                                                return (
                                                  <div className="py-3 text-center text-[10.5px] text-slate-400">
                                                    No chapters match your filter. Switch to <strong>All Subject Chapters</strong> or clear search.
                                                  </div>
                                                );
                                              }

                                              return (
                                                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                                                  {filteredPool.map((ch) => {
                                                    const subCol = SUBJECT_COLORS[ch.subjectCode] || SUBJECT_COLORS.FR;
                                                    const assignedDayIdx =
                                                      ch.assignedDate && ch.assignedDate !== 'UNASSIGNED'
                                                        ? milestoneAutoAllocationPlan.allocationDates.indexOf(ch.assignedDate)
                                                        : -1;
                                                    return (
                                                      <div
                                                        key={`pool_${ch.configKey}`}
                                                        className="px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-slate-850 flex flex-wrap items-center justify-between gap-2 text-[10px]"
                                                      >
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border shrink-0 ${subCol.bg} ${subCol.text} ${subCol.border}`}>
                                                            {ch.subjectCode}
                                                          </span>
                                                          <span className="text-white font-bold truncate" title={ch.chapterName}>
                                                            {ch.chapterName}
                                                          </span>
                                                          <span className="text-amber-300 font-black text-[9.5px] shrink-0">
                                                            ({formatMinutes(ch.timeNeededMins)})
                                                          </span>
                                                          {assignedDayIdx >= 0 ? (
                                                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[8.5px] font-black shrink-0">
                                                              Day {assignedDayIdx + 1}
                                                            </span>
                                                          ) : (
                                                            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[8.5px] font-bold shrink-0">
                                                              Unassigned
                                                            </span>
                                                          )}
                                                        </div>

                                                        <div className="flex items-center gap-1 flex-wrap shrink-0">
                                                          <span className="text-[9px] text-slate-400 mr-0.5">Add to:</span>
                                                          {milestoneAutoAllocationPlan.allocationDates.slice(0, 8).map((dStr, dIdx) => {
                                                            const isAssignedHere = ch.assignedDate === dStr;
                                                            return (
                                                              <button
                                                                key={dStr}
                                                                type="button"
                                                                onClick={() => handleAssignMilestoneChapterToDay(ch.configKey, dStr)}
                                                                className={`px-2 py-0.5 rounded text-[9px] font-black border transition cursor-pointer ${
                                                                  isAssignedHere
                                                                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                                                                    : 'bg-slate-900 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border-cyan-500/30'
                                                                }`}
                                                                title={`Assign "${ch.chapterName}" to Day ${dIdx + 1} (${dStr})`}
                                                              >
                                                                {isAssignedHere ? `✓ Day ${dIdx + 1}` : `+ Day ${dIdx + 1}`}
                                                              </button>
                                                            );
                                                          })}
                                                          {milestoneAutoAllocationPlan.allocationDates.length > 8 && (
                                                            <select
                                                              value={ch.assignedDate === 'UNASSIGNED' ? '' : ch.assignedDate}
                                                              onChange={(e) => {
                                                                if (e.target.value) {
                                                                  handleAssignMilestoneChapterToDay(ch.configKey, e.target.value);
                                                                }
                                                              }}
                                                              className="bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded px-1.5 py-0.5 text-[9px] font-bold cursor-pointer"
                                                            >
                                                              <option value="">More Days...</option>
                                                              {milestoneAutoAllocationPlan.allocationDates.map((dStr, dIdx) => (
                                                                <option key={dStr} value={dStr}>
                                                                  Day {dIdx + 1} ({dStr.slice(5)})
                                                                </option>
                                                              ))}
                                                            </select>
                                                          )}
                                                          {assignedDayIdx >= 0 && (
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                handleUnassignMilestoneChapterFromDay(
                                                                  ch,
                                                                  milestoneAutoAllocationPlan.daySchedules[assignedDayIdx]?.chapters || []
                                                                )
                                                              }
                                                              className="px-1.5 py-0.5 rounded bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[9px] font-bold cursor-pointer"
                                                              title="Remove from assigned day back to Unassigned"
                                                            >
                                                              × Blank
                                                            </button>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        )}

                                        {/* VIEW TAB 1: DAY CARDS GRID WITH QUICK CHAPTER SHIFT */}
                                        {allocatorViewTab === 'visual_days' ? (
                                          <div className={`grid grid-cols-1 ${visibleDaySchedules.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-3 ${hideWorkloadTopRibbon ? 'max-h-[68vh]' : 'max-h-[380px]'} overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800`}>
                                            {visibleDaySchedules.map((daySched) => {
                                              const dayIdx = daySched.dayNumber - 1;
                                              const isSelectedDay = daySched.dateStr === selectedDate;
                                              const totalDaysCount = milestoneAutoAllocationPlan.daySchedules.length;
                                              const availableChaptersToAddOnThisDay = milestoneAutoAllocationPlan.enrichedChapters.filter(
                                                c => c.assignedDate !== daySched.dateStr
                                              );

                                              return (
                                                <div
                                                  key={daySched.dateStr}
                                                  className={`p-3.5 rounded-xl border transition space-y-2.5 font-mono flex flex-col justify-between ${
                                                    isSelectedDay
                                                      ? 'bg-indigo-950/30 border-indigo-400/60 shadow-md'
                                                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                                                  }`}
                                                >
                                                  <div className="space-y-2.5">
                                                    {/* Day Card Header with 1-Click Single-Day Allocate Button */}
                                                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                                                      <div
                                                        onClick={() => setSelectedDate(daySched.dateStr)}
                                                        className="flex items-center gap-2 cursor-pointer"
                                                      >
                                                        <span className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                                                          Day {daySched.dayNumber}
                                                        </span>
                                                        <div>
                                                          <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="text-xs font-bold text-white">
                                                              {getFriendlyDateLabel(daySched.dateStr)} ({daySched.dateStr.slice(5)})
                                                            </span>
                                                            {daySched.isFinalExamTargetDay && (
                                                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[8.5px] font-black">
                                                                🏆 {milestoneAutoAllocationPlan.checkpoint.subjectId !== 'CUSTOM' ? milestoneAutoAllocationPlan.checkpoint.subjectId : 'FINAL'} EXAM DAY (2–5 PM)
                                                              </span>
                                                            )}
                                                          </div>
                                                          <span className="text-[9.5px] text-slate-400 block">
                                                            {daySched.chapters.length} {daySched.chapters.length === 1 ? 'chapter' : 'chapters'} • {formatMinutes(daySched.totalMinsForDay)} planned
                                                            {daySched.isFinalExamTargetDay ? ' • 0.5d Morning Sprint before Exam' : ''}
                                                          </span>
                                                        </div>
                                                      </div>

                                                      {daySched.chapters.length > 0 && (
                                                        <button
                                                          type="button"
                                                          onClick={() => handleAllocateSingleDayFromMilestone(daySched)}
                                                          className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-[9.5px] font-black cursor-pointer transition shrink-0"
                                                          title={`Allocate only Day ${daySched.dayNumber}'s ${daySched.chapters.length} chapters to ${daySched.dateStr}`}
                                                        >
                                                          Allocate Day {daySched.dayNumber}
                                                        </button>
                                                      )}
                                                    </div>

                                                    {/* Chapters Assigned to This Day (with Relevance G/R/F badge, 1-click ◀ ▶ Day Shift & Time Stepper) */}
                                                    {daySched.chapters.length === 0 ? (
                                                      <div className="py-3 px-3 text-center text-[10.5px] text-slate-400 bg-slate-950/50 rounded-lg border border-dashed border-slate-800 space-y-2">
                                                        <div className="italic text-slate-500">
                                                          Blank Day Card — No chapters assigned to Day {daySched.dayNumber} yet.
                                                        </div>
                                                        {availableChaptersToAddOnThisDay.length > 0 && (
                                                          <div className="flex items-center justify-center">
                                                            <select
                                                              value=""
                                                              onChange={(e) => {
                                                                if (e.target.value) {
                                                                  handleAssignMilestoneChapterToDay(e.target.value, daySched.dateStr);
                                                                }
                                                              }}
                                                              className="bg-slate-900 border border-cyan-500/40 text-cyan-300 rounded-lg px-2.5 py-1 text-[10px] font-bold cursor-pointer focus:outline-none focus:border-cyan-400 max-w-full"
                                                            >
                                                              <option value="">
                                                                + Add Chapter to Day {daySched.dayNumber} ({milestoneAutoAllocationPlan.unassignedChapters.length > 0 ? `${milestoneAutoAllocationPlan.unassignedChapters.length} Unassigned` : `${availableChaptersToAddOnThisDay.length} Available`})...
                                                              </option>
                                                              {availableChaptersToAddOnThisDay.map(c => {
                                                                const cDayIdx = c.assignedDate !== 'UNASSIGNED'
                                                                  ? milestoneAutoAllocationPlan.allocationDates.indexOf(c.assignedDate)
                                                                  : -1;
                                                                return (
                                                                  <option key={c.configKey} value={c.configKey}>
                                                                    [{c.subjectCode}] {c.chapterName} ({formatMinutes(c.timeNeededMins)}){cDayIdx >= 0 ? ` — Move from Day ${cDayIdx + 1}` : ' — Unassigned'}
                                                                  </option>
                                                                );
                                                              })}
                                                            </select>
                                                          </div>
                                                        )}
                                                      </div>
                                                    ) : (
                                                      <div className="space-y-1.5">
                                                        {/* Day-Level Multi-Select Batching Bar inside Milestone Allocator */}
                                                        {(() => {
                                                          const daySelectedKeys = selectedMilestoneDayChapterKeys[daySched.dateStr] || [];
                                                          const daySelectedChaps = daySched.chapters.filter(c => daySelectedKeys.includes(c.configKey));
                                                          const daySelectedSubjects = Array.from(new Set(daySelectedChaps.map(c => c.subjectCode)));
                                                          const canClubDaySelection = daySelectedChaps.length >= 2 && daySelectedSubjects.length === 1;
                                                          const currentClubMins = milestoneDayClubDurationMins[daySched.dateStr] || 180;

                                                          if (daySelectedChaps.length === 0) return null;
                                                          return (
                                                            <div className="p-2 rounded-lg bg-cyan-950/35 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-2 text-[9.5px]">
                                                              <div className="flex items-center gap-1.5">
                                                                <Layers className="h-3 w-3 text-cyan-400 shrink-0" />
                                                                <span className="font-black text-cyan-200">
                                                                  {daySelectedChaps.length} Selected on Day {daySched.dayNumber}
                                                                </span>
                                                              </div>
                                                              {canClubDaySelection ? (
                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                  <div className="flex items-center bg-slate-950 border border-cyan-500/35 rounded px-1.5 py-0.5 gap-1">
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        setMilestoneDayClubDurationMins(prev => ({
                                                                          ...prev,
                                                                          [daySched.dateStr]: Math.max(daySelectedChaps.length, currentClubMins - 15)
                                                                        }))
                                                                      }
                                                                      className="text-slate-400 hover:text-white font-black px-0.5 cursor-pointer"
                                                                      title="-15m"
                                                                    >
                                                                      -15
                                                                    </button>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        setMilestoneDayClubDurationMins(prev => ({
                                                                          ...prev,
                                                                          [daySched.dateStr]: Math.max(daySelectedChaps.length, currentClubMins - 1)
                                                                        }))
                                                                      }
                                                                      className="text-slate-400 hover:text-cyan-300 font-black px-0.5 cursor-pointer"
                                                                      title="-1m"
                                                                    >
                                                                      -1
                                                                    </button>
                                                                    <input
                                                                      type="number"
                                                                      min={daySelectedChaps.length}
                                                                      max={720}
                                                                      step={1}
                                                                      value={currentClubMins}
                                                                      onChange={(e) => {
                                                                        const val = parseInt(e.target.value, 10);
                                                                        if (!isNaN(val) && val >= daySelectedChaps.length) {
                                                                          setMilestoneDayClubDurationMins(prev => ({
                                                                            ...prev,
                                                                            [daySched.dateStr]: Math.min(720, val)
                                                                          }));
                                                                        }
                                                                      }}
                                                                      className="w-10 bg-slate-900 border border-slate-800 rounded text-center text-amber-300 font-black text-[9.5px] focus:outline-none focus:border-cyan-400"
                                                                      title="Type exact batch minutes"
                                                                    />
                                                                    <span className="text-slate-400 text-[8.5px]">m ({formatMinutes(currentClubMins)})</span>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        setMilestoneDayClubDurationMins(prev => ({
                                                                          ...prev,
                                                                          [daySched.dateStr]: Math.min(720, currentClubMins + 1)
                                                                        }))
                                                                      }
                                                                      className="text-slate-400 hover:text-cyan-300 font-black px-0.5 cursor-pointer"
                                                                      title="+1m"
                                                                    >
                                                                      +1
                                                                    </button>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        setMilestoneDayClubDurationMins(prev => ({
                                                                          ...prev,
                                                                          [daySched.dateStr]: Math.min(720, currentClubMins + 15)
                                                                        }))
                                                                      }
                                                                      className="text-slate-400 hover:text-white font-black px-0.5 cursor-pointer"
                                                                      title="+15m"
                                                                    >
                                                                      +15
                                                                    </button>
                                                                  </div>
                                                                  <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                      handleClubMilestoneDayChapters(
                                                                        daySelectedChaps,
                                                                        currentClubMins,
                                                                        daySched.dateStr
                                                                      )
                                                                    }
                                                                    className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black cursor-pointer transition"
                                                                  >
                                                                    Create Batch ({formatMinutes(currentClubMins)})
                                                                  </button>
                                                                </div>
                                                              ) : (
                                                                <span className="text-amber-300 font-bold">
                                                                  {daySelectedChaps.length < 2
                                                                    ? 'Select 1+ more same-subject chapter to batch'
                                                                    : 'Same subject required to batch'}
                                                                </span>
                                                              )}
                                                            </div>
                                                          );
                                                        })()}

                                                        {(() => {
                                                          const dayBatchMap = new Map<string, number>();
                                                          let bCounter = 1;
                                                          daySched.chapters.forEach(c => {
                                                            if (c.clubGroupId && !dayBatchMap.has(c.clubGroupId)) {
                                                              dayBatchMap.set(c.clubGroupId, bCounter++);
                                                            }
                                                          });

                                                          return daySched.chapters.map((ch) => {
                                                            const subCol = SUBJECT_COLORS[ch.subjectCode] || SUBJECT_COLORS.FR;
                                                            const relBadge =
                                                              ch.relevance === 'Final Revision'
                                                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                                                : ch.relevance === 'General'
                                                                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                                                            const relCode =
                                                              ch.relevance === 'Final Revision' ? 'F' : ch.relevance === 'General' ? 'G' : 'R';
                                                            const isChapSelectedForDayClub = (selectedMilestoneDayChapterKeys[daySched.dateStr] || []).includes(ch.configKey);
                                                            const batchNum = ch.clubGroupId ? dayBatchMap.get(ch.clubGroupId) : undefined;

                                                            return (
                                                              <div
                                                                key={ch.configKey}
                                                                className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between gap-2 text-[10px] ${
                                                                  ch.clubGroupId
                                                                    ? 'bg-cyan-950/25 border-cyan-500/40'
                                                                    : 'bg-slate-950/90 border-slate-850'
                                                                }`}
                                                              >
                                                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                                  <input
                                                                    type="checkbox"
                                                                    checked={isChapSelectedForDayClub}
                                                                    onChange={() => {
                                                                      setSelectedMilestoneDayChapterKeys(prev => {
                                                                        const curr = prev[daySched.dateStr] || [];
                                                                        const next = curr.includes(ch.configKey)
                                                                          ? curr.filter(k => k !== ch.configKey)
                                                                          : [...curr, ch.configKey];
                                                                        return { ...prev, [daySched.dateStr]: next };
                                                                      });
                                                                    }}
                                                                    className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer shrink-0"
                                                                    title="Select chapter to batch on this day"
                                                                  />
                                                                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border shrink-0 ${subCol.bg} ${subCol.text} ${subCol.border}`}>
                                                                    {ch.subjectCode}
                                                                  </span>
                                                                  <button
                                                                    type="button"
                                                                    disabled={milestoneAutoAllocationPlan.isFinal15DayRev}
                                                                    onClick={() => {
                                                                      if (milestoneAutoAllocationPlan.isFinal15DayRev) return;
                                                                      const nextRel: 'General' | 'Revision' | 'Final Revision' =
                                                                        ch.relevance === 'General'
                                                                          ? 'Revision'
                                                                          : ch.relevance === 'Revision'
                                                                            ? 'Final Revision'
                                                                            : 'General';
                                                                      updateChapterCustomConfig(ch.configKey, { relevance: nextRel });
                                                                    }}
                                                                    className={`px-1.5 py-0.5 rounded border text-[8.5px] font-black shrink-0 ${
                                                                      milestoneAutoAllocationPlan.isFinal15DayRev ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                                                                    } ${relBadge}`}
                                                                    title={
                                                                      milestoneAutoAllocationPlan.isFinal15DayRev
                                                                        ? '1.5-Day Final Revision: Locked to Final Revision (F)'
                                                                        : `Relevance: ${ch.relevance} (${relCode}) — Click to customize G / R / F`
                                                                    }
                                                                  >
                                                                    {relCode}
                                                                  </button>
                                                                  {batchNum !== undefined && (
                                                                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-[8.5px] font-black shrink-0 flex items-center gap-1 transition shadow-xs">
                                                                      <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                          setActiveBatchInspector({
                                                                            source: "milestone_day",
                                                                            clubGroupId: ch.clubGroupId,
                                                                            batchNumber: batchNum,
                                                                            dateStr: daySched.dateStr
                                                                          });
                                                                        }}
                                                                        className="hover:text-white cursor-pointer transition flex items-center gap-0.5"
                                                                        title={`Click to open Batch ${batchNum} Editor for Day ${daySched.dayNumber}`}
                                                                      >
                                                                        <Layers className="h-2 w-2" />
                                                                        <span>Batch {batchNum}</span>
                                                                      </button>
                                                                      <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveMilestoneChapterFromClub(ch, daySched.chapters)}
                                                                        className="text-rose-300 hover:text-white ml-0.5 cursor-pointer"
                                                                        title={`Remove from Batch ${batchNum}`}
                                                                      >
                                                                        ×
                                                                      </button>
                                                                    </span>
                                                                  )}
                                                                  <span className="text-slate-200 font-bold truncate" title={ch.chapterName}>
                                                                    {ch.chapterName}
                                                                  </span>
                                                                </div>

                                                                {/* Flexible Per-Minute / ±15m / Direct Input Time Needed & Day Quick Shift Controls */}
                                                                <div className="flex items-center gap-1 shrink-0">
                                                                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded px-1 py-0.5 gap-0.5">
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleAdjustMilestoneChapterTime(
                                                                          ch,
                                                                          Math.max(1, ch.timeNeededMins - 15),
                                                                          daySched.chapters
                                                                        )
                                                                      }
                                                                      className="text-slate-400 hover:text-white font-bold px-0.5 cursor-pointer text-[9px]"
                                                                      title="-15m"
                                                                    >
                                                                      -15
                                                                    </button>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleAdjustMilestoneChapterTime(
                                                                          ch,
                                                                          Math.max(1, ch.timeNeededMins - 1),
                                                                          daySched.chapters
                                                                        )
                                                                      }
                                                                      className="text-slate-400 hover:text-cyan-300 font-bold px-0.5 cursor-pointer text-[9px]"
                                                                      title="-1m"
                                                                    >
                                                                      -1
                                                                    </button>
                                                                    <input
                                                                      type="number"
                                                                      min={1}
                                                                      max={720}
                                                                      step={1}
                                                                      value={ch.timeNeededMins}
                                                                      onChange={(e) => {
                                                                        const val = parseInt(e.target.value, 10);
                                                                        if (!isNaN(val) && val >= 1) {
                                                                          handleAdjustMilestoneChapterTime(ch, val, daySched.chapters);
                                                                        }
                                                                      }}
                                                                      className="w-9 bg-slate-950 border border-slate-800 rounded text-center text-amber-300 font-black text-[9.5px] focus:outline-none focus:border-cyan-400"
                                                                      title="Type exact minutes"
                                                                    />
                                                                    <span className="text-[8.5px] text-slate-400">m</span>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleAdjustMilestoneChapterTime(
                                                                          ch,
                                                                          Math.min(720, ch.timeNeededMins + 1),
                                                                          daySched.chapters
                                                                        )
                                                                      }
                                                                      className="text-slate-400 hover:text-cyan-300 font-bold px-0.5 cursor-pointer text-[9px]"
                                                                      title="+1m"
                                                                    >
                                                                      +1
                                                                    </button>
                                                                    <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleAdjustMilestoneChapterTime(
                                                                          ch,
                                                                          Math.min(720, ch.timeNeededMins + 15),
                                                                          daySched.chapters
                                                                        )
                                                                      }
                                                                      className="text-slate-400 hover:text-white font-bold px-0.5 cursor-pointer text-[9px]"
                                                                      title="+15m"
                                                                    >
                                                                      +15
                                                                    </button>
                                                                  </div>

                                                                  {totalDaysCount > 1 && (
                                                                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded overflow-hidden">
                                                                      <button
                                                                        type="button"
                                                                        disabled={dayIdx === 0}
                                                                        onClick={() => handleShiftChapterDay(ch.configKey, daySched.dateStr, -1)}
                                                                        className="px-1.5 py-0.5 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 cursor-pointer text-[9px] font-black"
                                                                        title="Move chapter to previous day"
                                                                      >
                                                                        ◀
                                                                      </button>
                                                                      <button
                                                                        type="button"
                                                                        disabled={dayIdx === totalDaysCount - 1}
                                                                        onClick={() => handleShiftChapterDay(ch.configKey, daySched.dateStr, 1)}
                                                                        className="px-1.5 py-0.5 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 cursor-pointer text-[9px] font-black"
                                                                        title="Move chapter to next day"
                                                                      >
                                                                        ▶
                                                                      </button>
                                                                    </div>
                                                                  )}
                                                                  <button
                                                                    type="button"
                                                                    onClick={() => handleUnassignMilestoneChapterFromDay(ch, daySched.chapters)}
                                                                    className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/35 cursor-pointer text-[9px] font-black"
                                                                    title="Remove chapter from this day (move back to Unassigned Subject Chapters)"
                                                                  >
                                                                    ×
                                                                  </button>
                                                                </div>
                                                              </div>
                                                            );
                                                          });
                                                        })()}

                                                        {/* Quick + Add Another Chapter to This Day Card */}
                                                        {availableChaptersToAddOnThisDay.length > 0 && (
                                                          <div className="pt-1">
                                                            <select
                                                              value=""
                                                              onChange={(e) => {
                                                                if (e.target.value) {
                                                                  handleAssignMilestoneChapterToDay(e.target.value, daySched.dateStr);
                                                                }
                                                              }}
                                                              className="w-full bg-slate-950/90 hover:bg-slate-900 border border-dashed border-slate-800 hover:border-cyan-500/40 text-cyan-300 rounded-lg px-2 py-1 text-[9.5px] font-bold cursor-pointer focus:outline-none focus:border-cyan-400"
                                                            >
                                                              <option value="">
                                                                + Add Chapter to Day {daySched.dayNumber} ({milestoneAutoAllocationPlan.unassignedChapters.length > 0 ? `${milestoneAutoAllocationPlan.unassignedChapters.length} Unassigned` : `${availableChaptersToAddOnThisDay.length} Available`})...
                                                              </option>
                                                              {availableChaptersToAddOnThisDay.map(c => {
                                                                const cDayIdx = c.assignedDate !== 'UNASSIGNED'
                                                                  ? milestoneAutoAllocationPlan.allocationDates.indexOf(c.assignedDate)
                                                                  : -1;
                                                                return (
                                                                  <option key={c.configKey} value={c.configKey}>
                                                                    [{c.subjectCode}] {c.chapterName} ({formatMinutes(c.timeNeededMins)}){cDayIdx >= 0 ? ` — Move from Day ${cDayIdx + 1}` : ' — Unassigned'}
                                                                  </option>
                                                                );
                                                              })}
                                                            </select>
                                                          </div>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>

                                                  {/* Compact Scheduled Clock Slots Footer */}
                                                  {daySched.batches.length > 0 && (
                                                    <div className="pt-2 border-t border-slate-850/80 flex items-center justify-between gap-2 text-[9px] text-slate-400">
                                                      <span>24h Clock Slots:</span>
                                                      <div className="flex items-center gap-1 flex-wrap justify-end">
                                                        {daySched.batches.map((b, bIdx) => (
                                                          <span
                                                            key={bIdx}
                                                            className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold"
                                                            title={b.batchTitle}
                                                          >
                                                            {b.startTime}–{b.endTime}
                                                          </span>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          /* VIEW TAB 2: FINE-TUNE CHAPTERS TABLE (Search + Bulk Set + Relevance + Day Dropdown) */
                                          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden font-mono">
                                            <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                                              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                                <input
                                                  type="text"
                                                  value={allocatorChapterSearch}
                                                  onChange={(e) => setAllocatorChapterSearch(e.target.value)}
                                                  placeholder="Search chapter or subject..."
                                                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-[10.5px] focus:outline-none focus:border-indigo-400 w-full max-w-xs"
                                                />
                                              </div>
                                              <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-slate-400 text-[9.5px]">Bulk Set All Chapters Time:</span>
                                                {[45, 60, 90, 120].map(presetMins => (
                                                  <button
                                                    key={presetMins}
                                                    type="button"
                                                    onClick={() => {
                                                      const next = { ...chapterCustomConfig };
                                                      milestoneAutoAllocationPlan.enrichedChapters.forEach(c => {
                                                        next[c.configKey] = {
                                                          ...(next[c.configKey] || {}),
                                                          timeNeededMins: presetMins
                                                        };
                                                      });
                                                      setChapterCustomConfig(next);
                                                      try {
                                                        localStorage.setItem('practca_chapter_custom_batch_config_v1', JSON.stringify(next));
                                                      } catch (e) {}
                                                    }}
                                                    className="px-2 py-0.5 rounded bg-slate-950 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-slate-800 text-[9.5px] font-bold cursor-pointer"
                                                  >
                                                    {presetMins}m
                                                  </button>
                                                ))}
                                              </div>
                                            </div>

                                            <div className={`${hideWorkloadTopRibbon ? 'max-h-[60vh]' : 'max-h-72'} overflow-y-auto divide-y divide-slate-850/70 pr-1 scrollbar-thin scrollbar-thumb-slate-800`}>
                                              {filteredFineTuneChapters.map((ch) => {
                                                const relColors =
                                                  ch.relevance === 'Final Revision'
                                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                                    : ch.relevance === 'General'
                                                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                                                const subCol = SUBJECT_COLORS[ch.subjectCode] || SUBJECT_COLORS.FR;

                                                return (
                                                  <div
                                                    key={ch.configKey}
                                                    className="px-3 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs hover:bg-slate-900/80 transition"
                                                  >
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border shrink-0 ${subCol.bg} ${subCol.text} ${subCol.border}`}>
                                                        {ch.subjectCode}
                                                      </span>
                                                      <div className="min-w-0 flex-1">
                                                        <div className="text-white font-bold truncate text-[11px]" title={ch.chapterName}>
                                                          {ch.chapterName}
                                                        </div>
                                                        <div className="text-[9.5px] text-slate-400">
                                                          Past Study Time:{' '}
                                                          <strong className={ch.spentMins > 0 ? 'text-emerald-300' : 'text-slate-500'}>
                                                            {ch.spentMins > 0 ? formatMinutes(ch.spentMins) : '0m (Untouched)'}
                                                          </strong>
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                                      <button
                                                        type="button"
                                                        disabled={milestoneAutoAllocationPlan.isFinal15DayRev}
                                                        onClick={() => {
                                                          if (milestoneAutoAllocationPlan.isFinal15DayRev) return;
                                                          const nextRel: 'General' | 'Revision' | 'Final Revision' =
                                                            ch.relevance === 'General'
                                                              ? 'Revision'
                                                              : ch.relevance === 'Revision'
                                                                ? 'Final Revision'
                                                                : 'General';
                                                          updateChapterCustomConfig(ch.configKey, { relevance: nextRel });
                                                        }}
                                                        className={`px-2 py-0.5 rounded-lg border text-[9.5px] font-black transition ${
                                                          milestoneAutoAllocationPlan.isFinal15DayRev ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                                                        } ${relColors}`}
                                                        title={
                                                          milestoneAutoAllocationPlan.isFinal15DayRev
                                                            ? 'Locked to Final Revision (1.5d Revision)'
                                                            : 'Click to change chapter relevance (G / R / F)'
                                                        }
                                                      >
                                                        {ch.relevance === 'Final Revision' ? '🔴 Final (F)' : ch.relevance === 'General' ? '🔵 General (G)' : '🟡 Revision (R)'}
                                                      </button>

                                                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            handleAdjustMilestoneChapterTime(
                                                              ch,
                                                              Math.max(1, ch.timeNeededMins - 15),
                                                              milestoneAutoAllocationPlan.enrichedChapters.filter(p => p.assignedDate === ch.assignedDate)
                                                            )
                                                          }
                                                          className="px-1.5 py-0.5 text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-bold cursor-pointer"
                                                          title="-15m"
                                                        >
                                                          -15
                                                        </button>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            handleAdjustMilestoneChapterTime(
                                                              ch,
                                                              Math.max(1, ch.timeNeededMins - 1),
                                                              milestoneAutoAllocationPlan.enrichedChapters.filter(p => p.assignedDate === ch.assignedDate)
                                                            )
                                                          }
                                                          className="px-1 py-0.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 text-[10px] font-bold cursor-pointer"
                                                          title="-1m"
                                                        >
                                                          -1
                                                        </button>
                                                        <input
                                                          type="number"
                                                          min={1}
                                                          max={720}
                                                          step={1}
                                                          value={ch.timeNeededMins}
                                                          onChange={(e) => {
                                                            const val = parseInt(e.target.value, 10);
                                                            if (!isNaN(val) && val >= 1) {
                                                              handleAdjustMilestoneChapterTime(
                                                                ch,
                                                                val,
                                                                milestoneAutoAllocationPlan.enrichedChapters.filter(p => p.assignedDate === ch.assignedDate)
                                                              );
                                                            }
                                                          }}
                                                          className="w-11 bg-transparent text-center text-amber-300 font-black text-[10.5px] focus:outline-none"
                                                          title="Type exact minutes"
                                                        />
                                                        <span className="text-[9px] text-slate-500 pr-1">m</span>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            handleAdjustMilestoneChapterTime(
                                                              ch,
                                                              Math.min(720, ch.timeNeededMins + 1),
                                                              milestoneAutoAllocationPlan.enrichedChapters.filter(p => p.assignedDate === ch.assignedDate)
                                                            )
                                                          }
                                                          className="px-1 py-0.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 text-[10px] font-bold cursor-pointer"
                                                          title="+1m"
                                                        >
                                                          +1
                                                        </button>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            handleAdjustMilestoneChapterTime(
                                                              ch,
                                                              Math.min(720, ch.timeNeededMins + 15),
                                                              milestoneAutoAllocationPlan.enrichedChapters.filter(p => p.assignedDate === ch.assignedDate)
                                                            )
                                                          }
                                                          className="px-1.5 py-0.5 text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-bold cursor-pointer"
                                                          title="+15m"
                                                        >
                                                          +15
                                                        </button>
                                                      </div>

                                                      <select
                                                        value={ch.assignedDate}
                                                        onChange={(e) =>
                                                          updateChapterCustomConfig(ch.configKey, {
                                                            assignedDate: e.target.value,
                                                            clubGroupId: undefined,
                                                            clubTotalMinutes: undefined,
                                                            clubOrder: undefined,
                                                            clubAllocationBasis: undefined,
                                                            clubPriorLoggedMinutes: undefined
                                                          })
                                                        }
                                                        className="bg-slate-950 border border-slate-800 text-cyan-300 rounded-lg px-2 py-1 text-[10px] font-bold cursor-pointer"
                                                      >
                                                        <option value="UNASSIGNED">— Unassigned (Blank) —</option>
                                                        {milestoneAutoAllocationPlan.allocationDates.map((dStr, idx) => (
                                                          <option key={dStr} value={dStr}>
                                                            Day {idx + 1} ({dStr.slice(5)})
                                                          </option>
                                                        ))}
                                                      </select>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    /* MODE B: SINGLE-DAY 90-MINUTE AUTO-BATCH ENGINE (FOR SELECTED DATE) */
                                    <div className="space-y-3">
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-[10.5px] font-mono text-slate-300">
                                          Single-Day Auto-Batch groups {selectedTaskIds.length > 0 ? `your ${selectedTaskIds.length} selected chapters` : `all ${sortedActiveTasks.length} active chapters`} on <strong>{selectedDate}</strong> into balanced 90-minute study blocks ({formatMinutes(remainingClockMins)} free on clock).
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleAutoBatchChaptersInto90MinClock(undefined, true)}
                                          disabled={selectedOrActiveCount === 0}
                                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-40 text-slate-950 font-mono font-black text-xs flex items-center gap-1.5 cursor-pointer transition shadow-sm"
                                        >
                                          <Zap className="h-3.5 w-3.5" />
                                          <span>
                                            {selectedTaskIds.length > 0
                                              ? `⚡ Auto-Batch Selected (${selectedTaskIds.length}) into 90m Blocks`
                                              : `⚡ Auto-Batch Active (${sortedActiveTasks.length}) into 90m Blocks`}
                                          </span>
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10.5px] font-mono">
                                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                                          <span className="text-slate-400 font-bold">Start Window:</span>
                                          <input
                                            type="time"
                                            value={autoBatchStartTime}
                                            onChange={(e) => {
                                              if (e.target.value) setAutoBatchStartTime(e.target.value);
                                            }}
                                            className="bg-slate-950 border border-slate-750 focus:border-amber-400 text-amber-300 rounded-lg px-2 py-0.5 text-[10.5px] font-bold focus:outline-none cursor-pointer"
                                            title="Select manual start time for daily study blocks"
                                          />
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                                          <span className="text-slate-400 font-bold">Break Buffer:</span>
                                          <select
                                            value={autoBatchBreakGap}
                                            onChange={(e) => setAutoBatchBreakGap(Number(e.target.value))}
                                            className="bg-slate-950 border border-slate-750 text-cyan-300 rounded-lg px-2 py-0.5 text-[10.5px] font-bold"
                                          >
                                            <option value={0}>0m (Back-to-Back)</option>
                                            <option value={15}>15m Break Buffer</option>
                                            <option value={30}>30m Break Buffer</option>
                                          </select>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                                          <span className="text-slate-400 font-bold">Distribution:</span>
                                          <select
                                            value={autoBatchFillMode}
                                            onChange={(e) => setAutoBatchFillMode(e.target.value as any)}
                                            className="bg-slate-950 border border-slate-750 text-indigo-300 rounded-lg px-2 py-0.5 text-[10.5px] font-bold"
                                          >
                                            <option value="balanced_groups">Balanced 90m per Group</option>
                                            <option value="fill_remaining_clock">Fill All Remaining Day</option>
                                          </select>
                                        </div>
                                      </div>

                                      {targetClockSlotsForDay.length > 0 ? (
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between text-[10px] font-mono">
                                            <span className="text-slate-400 uppercase font-bold">
                                              Scheduled 24-Hour Clock Blocks for {selectedDate} ({targetClockSlotsForDay.length}):
                                            </span>
                                            <div className="flex items-center gap-2">
                                              {targetClockSlotsForDay.some(s => String(s.id || '').startsWith('slot_autobatch_')) && (
                                                <button
                                                  type="button"
                                                  onClick={handleClearAutoBatchedSlots}
                                                  className="text-rose-400 hover:underline cursor-pointer"
                                                >
                                                  Clear Auto-Batched Blocks
                                                </button>
                                              )}
                                              {onGoToClock && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setShowAutoBatchStudio(false);
                                                    onGoToClock();
                                                  }}
                                                  className="text-cyan-400 hover:underline font-bold cursor-pointer"
                                                >
                                                  Open 24h Target Clock →
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                                            {targetClockSlotsForDay.map((slot, sIdx) => {
                                              const subCol = SUBJECT_COLORS[slot.subjectCode as SubjectId] || SUBJECT_COLORS.FR;
                                              return (
                                                <div
                                                  key={slot.id || `slot_prev_${sIdx}`}
                                                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs font-mono"
                                                >
                                                  <div className="flex items-center gap-2 truncate">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border shrink-0 ${subCol.bg} ${subCol.text} ${subCol.border}`}>
                                                      {slot.subjectCode}
                                                    </span>
                                                    <div className="truncate">
                                                      <div className="text-white font-bold truncate text-[11px]" title={slot.title}>
                                                        {slot.title}
                                                      </div>
                                                      <div className="text-[9.5px] text-amber-300 font-bold">
                                                        {slot.startTime} – {slot.endTime} • {formatMinutes(slot.durationMinutes)}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 shrink-0">
                                                    {formatMinutes(slot.durationMinutes || 90)} Block
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 text-center text-[11px] text-slate-400 font-mono">
                                          No blocks scheduled on the 24-hour target clock for {selectedDate} yet. Click <strong className="text-amber-300">⚡ Auto-Batch</strong> above to generate balanced study blocks!
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Sticky Modal Footer */}
                                {autoBatchStudioMode === 'milestone_multiday' && hasMilestone && milestoneAutoAllocationPlan && (
                                  <div className="px-5 py-3.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                                    <div className="text-xs font-mono text-slate-300">
                                      Ready to allocate <strong className="text-white font-bold tabular-nums">{milestoneAutoAllocationPlan.allocatedChapters.length}/{milestoneAutoAllocationPlan.enrichedChapters.length} chapters</strong> across{' '}
                                      <strong className="text-cyan-300 font-bold tabular-nums">{milestoneAutoAllocationPlan.numDays} days</strong> ({(milestoneAutoAllocationPlan.allocatedTimeNeededMins / 60).toFixed(1).replace(/\.0$/, '')}h study time{milestoneAutoAllocationPlan.unassignedChapters.length > 0 ? ` • ${milestoneAutoAllocationPlan.unassignedChapters.length} unassigned` : ''}).
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        type="button"
                                        onClick={() => setShowAutoBatchStudio(false)}
                                        className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono font-bold text-xs cursor-pointer transition"
                                      >
                                        Close
                                      </button>
                                      <button
                                        type="button"
                                        disabled={milestoneAutoAllocationPlan.allocatedChapters.length === 0}
                                        onClick={handleExecuteMilestoneMultiDayAutoBatch}
                                        className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-300 hover:text-white border border-cyan-500/35 font-mono font-bold text-xs cursor-pointer transition flex items-center gap-1.5"
                                      >
                                        <span>Allocate All Days ({milestoneAutoAllocationPlan.numDays} Days)</span>
                                      </button>
                                      <button
                                        type="button"
                                        disabled={milestoneAutoAllocationPlan.allocatedChapters.length === 0}
                                        onClick={handleExecuteMilestoneMultiDayAutoBatch}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-mono font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-lg shadow-amber-500/10 active:scale-[0.99]"
                                      >
                                        <Zap className="h-4 w-4 fill-current" />
                                        <span>
                                          Allocate All Days ({milestoneAutoAllocationPlan.allocatedChapters.length} Targets • {milestoneAutoAllocationPlan.numDays} Days)
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </div>
                          </ModalPortal>
                        )}
                      </AnimatePresence>
                    </>
                  );
                })()}

                {/* Integrated Visual 24-Hour Timeline Strip */}
                {(() => {
                  const parseHhMmToMins = (hhmm?: string, fallbackMins: number = 360): number => {
                    if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) return fallbackMins;
                    const [h, m] = hhmm.split(':').map(Number);
                    if (isNaN(h) || isNaN(m)) return fallbackMins;
                    return Math.max(0, Math.min(1439, h * 60 + m));
                  };

                  // Build visual timeline blocks from 24h clock slots, or preview blocks from today's active/completed tasks
                  const hasClockSlots = targetClockSlotsForDay.length > 0;
                  let cursorMins = parseHhMmToMins(autoBatchStartTime, 360);
                  const previewGap = Math.max(5, Number(autoBatchBreakGap) || 15);

                  const timelineBlocks = hasClockSlots
                    ? targetClockSlotsForDay.map((slot, idx) => {
                        const startMins =
                          typeof slot.startMinutes === 'number'
                            ? slot.startMinutes
                            : parseHhMmToMins(slot.startTime, 360 + idx * 90);
                        const durMins = Math.max(15, Number(slot.durationMinutes) || Number(slot.totalTargetMinutes) || 60);
                        const sub = (slot.subjectCode || 'IDT') as SubjectId;
                        return {
                          id: slot.id || `slot_${idx}`,
                          title: slot.title || slot.chapter || `${sub} Study Block`,
                          subjectCode: sub,
                          startMins,
                          durMins,
                          startTime: slot.startTime || `${String(Math.floor(startMins / 60)).padStart(2, '0')}:${String(startMins % 60).padStart(2, '0')}`,
                          endTime: slot.endTime || `${String(Math.floor(((startMins + durMins) % 1440) / 60)).padStart(2, '0')}:${String((startMins + durMins) % 60).padStart(2, '0')}`,
                          isPreview: false,
                        };
                      })
                    : [...sortedActiveTasks, ...selectedDayCompletedTasks].slice(0, 12).map((t, idx) => {
                        const durMins = Math.max(20, Number(t.targetDurationMinutes) || Number(t.duration) || 45);
                        const startMins = Math.min(1410, cursorMins);
                        cursorMins = Math.min(1435, startMins + durMins + previewGap);
                        const endMins = Math.min(1440, startMins + durMins);
                        const sub = (t.subjectCode || 'IDT') as SubjectId;
                        return {
                          id: t.id || `prev_${idx}`,
                          title: t.cleanTitle || t.title || `${sub} Target`,
                          subjectCode: sub,
                          startMins,
                          durMins,
                          startTime: `${String(Math.floor(startMins / 60)).padStart(2, '0')}:${String(startMins % 60).padStart(2, '0')}`,
                          endTime: `${String(Math.floor((endMins % 1440) / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`,
                          isPreview: true,
                        };
                      });

                  const totalStripMins = timelineBlocks.reduce((acc, b) => acc + b.durMins, 0);
                  const now = new Date();
                  const isTodaySelected = selectedDate === getSystemLocalDateString();
                  const currentDayMins = now.getHours() * 60 + now.getMinutes();
                  const currentMarkerPct = (currentDayMins / 1440) * 100;

                  const subBarColorMap: Record<string, string> = {
                    FR: 'bg-sky-500/85 border-sky-300/60 text-slate-950',
                    AFM: 'bg-emerald-500/85 border-emerald-300/60 text-slate-950',
                    Audit: 'bg-amber-400/90 border-amber-200/70 text-slate-950',
                    DT: 'bg-rose-500/85 border-rose-300/60 text-white',
                    IDT: 'bg-indigo-500/85 border-indigo-300/60 text-white',
                    IBS: 'bg-cyan-400/90 border-cyan-200/70 text-slate-950',
                  };

                  return (
                    <div className="bg-slate-950/90 rounded-xl border border-slate-800/90 p-2.5 space-y-2 font-mono">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 font-black flex items-center gap-1">
                            <Clock className="h-3 w-3 text-cyan-400" />
                            <span>24H TIMELINE STRIP</span>
                          </span>
                          <span className="text-slate-300 font-bold tabular-nums">
                            {hasClockSlots ? (
                              <>
                                <strong className="text-cyan-300">{targetClockSlotsForDay.length} Clock Blocks</strong> • {formatMinutes(totalStripMins)} Scheduled
                              </>
                            ) : timelineBlocks.length > 0 ? (
                              <>
                                <strong className="text-amber-300">Preview Mode</strong> • {timelineBlocks.length} Targets ({formatMinutes(totalStripMins)}) — Click Auto-Batch to lock into 24h Clock
                              </>
                            ) : (
                              <span className="text-slate-500">No blocks scheduled for {getFriendlyDateLabel(selectedDate)}</span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {!lmrActiveFlag && sortedActiveTasks.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleAutoBatchChaptersInto90MinClock(undefined, false)}
                              className="px-2 py-0.5 rounded-md bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 text-amber-300 font-bold text-[9.5px] flex items-center gap-1 transition cursor-pointer"
                              title="Auto-Batch today's active chapters into balanced 90-minute study blocks on the 24h Clock"
                            >
                              <Zap className="h-2.5 w-2.5 text-amber-400" />
                              <span>Auto-Batch 90m</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setAutoBatchStudioMode('single_day');
                              setShowAutoBatchStudio(true);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white font-bold text-[9.5px] transition cursor-pointer"
                            title="Open 24-Hour Clock Block Studio"
                          >
                            Open 24h Studio →
                          </button>
                        </div>
                      </div>

                      {/* 24-Hour Visual Track (00:00 to 24:00) */}
                      <div className="relative h-7 w-full rounded-lg bg-slate-900/95 border border-slate-800 overflow-hidden select-none">
                        {/* Hour Grid Ticks */}
                        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hr) => (
                          <div
                            key={hr}
                            style={{ left: `${(hr / 24) * 100}%` }}
                            className="absolute top-0 bottom-0 border-l border-slate-800/70 pointer-events-none flex items-end pb-0.5 pl-1"
                          >
                            {hr < 24 && (
                              <span className="text-[8px] text-slate-500 font-bold tabular-nums leading-none">
                                {String(hr).padStart(2, '0')}:00
                              </span>
                            )}
                          </div>
                        ))}

                        {/* Plotted Study Blocks */}
                        {timelineBlocks.map((blk) => {
                          const leftPct = Math.max(0, Math.min(98, (blk.startMins / 1440) * 100));
                          const widthPct = Math.max(2.2, Math.min(100 - leftPct, (blk.durMins / 1440) * 100));
                          const colorCls = subBarColorMap[blk.subjectCode] || subBarColorMap.IDT;

                          return (
                            <button
                              key={blk.id}
                              type="button"
                              onClick={() => {
                                setAutoBatchStudioMode('single_day');
                                setShowAutoBatchStudio(true);
                              }}
                              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                              className={`absolute top-1 bottom-3 rounded border px-1 flex items-center gap-1 overflow-hidden transition hover:brightness-110 cursor-pointer shadow-xs ${colorCls} ${
                                blk.isPreview ? 'opacity-75 border-dashed' : ''
                              }`}
                              title={`[${blk.subjectCode}] ${blk.title} • ${blk.startTime}–${blk.endTime} (${formatMinutes(blk.durMins)})${blk.isPreview ? ' [Preview — Click to open 24h Studio]' : ''}`}
                            >
                              <span className="text-[8.5px] font-black tracking-tighter truncate">
                                {blk.subjectCode}
                              </span>
                              {widthPct >= 6 && (
                                <span className="text-[8px] font-bold truncate opacity-90">
                                  {blk.title}
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {/* Live Current Time Indicator Needle */}
                        {isTodaySelected && (
                          <div
                            style={{ left: `${currentMarkerPct}%` }}
                            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 shadow-[0_0_6px_#fb7185] z-10 pointer-events-none"
                            title={`Current Time: ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Unified Checklist Toolbar: Layout, Subject Filter, Sort & Quick Actions */}
                <div id="daily-target-list-anchor" className="bg-slate-950/90 rounded-xl border border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2.5">
                  {/* Left: Target Count + 3-Way Execution Canvas Toggle */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-100">Execution Canvas</span>
                      <span className="text-[10.5px] font-mono font-bold text-amber-400 tabular-nums">
                        ({sortedActiveTasks.length} pending · {selectedDayCompletedTasks.length} done)
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800 font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setDailyLayoutMode('subjects');
                          setGroupDailyBySubject(true);
                          try {
                            localStorage.setItem('practca_daily_layout_mode_v1', 'subjects');
                            localStorage.setItem('practca_daily_group_by_subject', 'true');
                          } catch (e) {}
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition cursor-pointer flex items-center gap-1 ${
                          dailyLayoutMode === 'subjects'
                            ? 'bg-indigo-500 text-white shadow-2xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Group targets into subject accordion cards with inline chapter progress bars"
                      >
                        <Layers className="h-3 w-3" />
                        <span>Subjects</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDailyLayoutMode('kanban');
                          try {
                            localStorage.setItem('practca_daily_layout_mode_v1', 'kanban');
                          } catch (e) {}
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition cursor-pointer flex items-center gap-1 ${
                          dailyLayoutMode === 'kanban'
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-2xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Compact Kanban columns by status (Pending, In Progress, Done)"
                      >
                        <Target className="h-3 w-3" />
                        <span>Kanban</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDailyLayoutMode('list');
                          setGroupDailyBySubject(false);
                          try {
                            localStorage.setItem('practca_daily_layout_mode_v1', 'list');
                            localStorage.setItem('practca_daily_group_by_subject', 'false');
                          } catch (e) {}
                        }}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition cursor-pointer flex items-center gap-1 ${
                          dailyLayoutMode === 'list'
                            ? 'bg-slate-800 text-white shadow-2xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="View all targets in a single unified priority list"
                      >
                        <List className="h-3 w-3" />
                        <span>Unified</span>
                      </button>
                    </div>

                    {dailyLayoutMode === 'subjects' && subjectChecklistGroups.length > 1 && (
                      <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-400">
                        <button
                          type="button"
                          onClick={() => setCollapsedSubjectChecklists({})}
                          className="hover:text-white transition cursor-pointer px-1"
                        >
                          Expand All
                        </button>
                        <span className="text-slate-700">·</span>
                        <button
                          type="button"
                          onClick={() => {
                            const all: Record<string, boolean> = {};
                            subjectChecklistGroups.forEach(g => { all[g.subjectCode] = true; });
                            setCollapsedSubjectChecklists(all);
                          }}
                          className="hover:text-white transition cursor-pointer px-1"
                        >
                          Collapse All
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Center: Subject Filter & Sort */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex-wrap gap-0.5 font-mono">
                      {(() => {
                        const sprintAllowed = lmrActiveFlag ? getSprintAllowedSubjects() : null;
                        const allOpts: { value: string; label: string }[] = [
                          { value: 'ALL', label: 'All' },
                          { value: 'FR', label: 'FR' },
                          { value: 'AFM', label: 'AFM' },
                          { value: 'Audit', label: 'Audit' },
                          { value: 'DT', label: 'DT' },
                          { value: 'IDT', label: 'IDT' },
                          { value: 'IBS', label: 'IBS' }
                        ];
                        const visibleOpts = sprintAllowed
                          ? allOpts.filter(
                              (o) =>
                                o.value === 'ALL' ||
                                sprintAllowed.allowedSet.has(o.value as SubjectId)
                            )
                          : allOpts;
                        return visibleOpts.map((subOpt) => (
                          <button
                            key={subOpt.value}
                            onClick={() => setFilterSubject(subOpt.value as any)}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition cursor-pointer ${
                              filterSubject === subOpt.value
                                ? 'bg-slate-700 text-white font-black'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {subOpt.label}
                            {sprintAllowed && subOpt.value === sprintAllowed.activeSubject ? ' ★' : ''}
                          </button>
                        ));
                      })()}
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:border-slate-600 cursor-pointer"
                      title="Sort active targets"
                    >
                      <option value="manual" className="bg-slate-950 text-slate-200">Sort: Priority</option>
                      <option value="urgency" className="bg-slate-950 text-slate-200">Sort: Relevance</option>
                      <option value="subject" className="bg-slate-950 text-slate-200">Sort: Subject</option>
                      <option value="alphabetical" className="bg-slate-950 text-slate-200">Sort: Name</option>
                    </select>
                  </div>

                  {/* Right: Key Actions — Batch, Complete Day & Sync */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {!lmrActiveFlag && sortedActiveTasks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAutoBatchChaptersInto90MinClock(undefined, false)}
                        className="h-7 px-2.5 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 text-amber-300 rounded-lg text-[10.5px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Auto-Batch today's active chapters into balanced 90-minute study blocks in the 24-hour target clock"
                      >
                        <Zap className="h-3 w-3 text-amber-400" />
                        <span>Auto-Batch 90m</span>
                      </button>
                    )}

                    {selectedDayTasks.filter(t => t.status === 'needsAction').length > 0 && (
                      <button
                        type="button"
                        onClick={handleBatchCompleteSelectedDay}
                        className="h-7 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10.5px] font-mono font-bold cursor-pointer transition flex items-center gap-1"
                        title="Complete all remaining tasks for today"
                      >
                        <CheckCheck className="h-3 w-3 text-emerald-400" />
                        <span>Complete Day</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => selectedListId && loadTasksForList(selectedListId)}
                      className="h-7 px-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-white rounded-lg text-[10.5px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                      title="Sync and refresh targets"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {sortedActiveTasks.length === 0 && selectedDayCompletedTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 space-y-1.5">
                    <div className="h-8 w-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-300">No targets scheduled for {getFriendlyDateLabel(selectedDate)}</p>
                  </div>
                ) : dailyLayoutMode === 'kanban' ? (
                  /* MODE 2: COMPACT KANBAN COLUMNS BY STATUS (Pending | In Progress / On Clock | Done) */
                  (() => {
                    const clockTaskIds = new Set<string>();
                    const clockTitlesNorm = new Set<string>();
                    targetClockSlotsForDay.forEach((slot) => {
                      if (slot.taskId) clockTaskIds.add(String(slot.taskId));
                      if (slot.id) clockTaskIds.add(String(slot.id));
                      if (Array.isArray(slot.sourceTaskIds)) {
                        slot.sourceTaskIds.forEach((id: any) => clockTaskIds.add(String(id)));
                      }
                      if (slot.title) clockTitlesNorm.add(normalizeKey(slot.title));
                    });

                    const isTaskInProgressOrOnClock = (t: any): boolean => {
                      const vis = getTaskCompletionVisualStatus(t);
                      if (vis === 'partially_done') return true;
                      if (t.clubGroupId) return true;
                      if (clockTaskIds.has(t.id)) return true;
                      const tNorm = normalizeKey(t.cleanTitle || t.title || '');
                      if (tNorm && clockTitlesNorm.has(tNorm)) return true;
                      return false;
                    };

                    const kanbanPending = sortedActiveTasks.filter((t) => !isTaskInProgressOrOnClock(t));
                    const kanbanInProgress = sortedActiveTasks.filter((t) => isTaskInProgressOrOnClock(t));
                    const kanbanCompleted = selectedDayCompletedTasks.filter(
                      (t) => filterSubject === 'ALL' || (t.subjectCode || 'IDT') === filterSubject
                    );

                    const renderKanbanCard = (task: any, colType: 'pending' | 'in_progress' | 'done') => {
                      const subCode = (task.subjectCode || 'IDT') as SubjectId;
                      const subCol = SUBJECT_COLORS[subCode] || SUBJECT_COLORS.IDT;
                      const mins = Number(task.targetDurationMinutes) || Number(task.duration) || 45;
                      const match = matchTaskToChapter(task);
                      const activeRev = match?.chapterName ? getActiveRevisionMilestone(subCode, match.chapterName, task) : null;
                      const milestoneBadge = activeRev?.badge || null;
                      const batchNum = task.clubGroupId ? dailyClubBatchNumberMap.get(task.clubGroupId) : undefined;
                      const isSelected = selectedTaskIds.includes(task.id);

                      return (
                        <div
                          key={`kb_${colType}_${task.id}`}
                          className={`p-2.5 rounded-xl border transition-all space-y-2 ${
                            colType === 'done'
                              ? 'bg-emerald-950/20 border-emerald-500/35'
                              : colType === 'in_progress'
                              ? 'bg-cyan-950/20 border-cyan-500/35 shadow-xs'
                              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleTaskSelection(task.id)}
                                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-indigo-500 cursor-pointer shrink-0"
                                title="Select target for batch clubbing or bulk actions"
                              />
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-black border ${subCol.bg} ${subCol.text} ${subCol.border}`}>
                                {subCode}
                              </span>
                              {milestoneBadge && (
                                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-amber-500/15 border border-amber-500/35 text-amber-300">
                                  {milestoneBadge}
                                </span>
                              )}
                              {batchNum !== undefined && (
                                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-black bg-cyan-500/20 border border-cyan-500/40 text-cyan-200">
                                  Batch {batchNum}
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] font-mono font-bold text-amber-300 tabular-nums shrink-0">
                              {formatMinutes(mins)}
                            </span>
                          </div>

                          <p
                            onClick={() => startEditingTask(task)}
                            className={`text-xs font-bold leading-snug cursor-pointer transition-colors ${
                              colType === 'done'
                                ? 'line-through text-emerald-200/80'
                                : 'text-slate-100 hover:text-cyan-300'
                            }`}
                            title="Click to edit target details"
                          >
                            {task.cleanTitle || task.title}
                          </p>

                          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80 font-mono text-[9.5px]">
                            {colType !== 'done' ? (
                              <>
                                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded px-1 py-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSingleTaskDuration(task.id, Math.max(15, mins - 15))}
                                    className="text-slate-400 hover:text-white font-bold px-1 cursor-pointer"
                                    title="-15m"
                                  >
                                    -15
                                  </button>
                                  <span className="text-slate-300 tabular-nums">{mins}m</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSingleTaskDuration(task.id, Math.min(720, mins + 15))}
                                    className="text-slate-400 hover:text-white font-bold px-1 cursor-pointer"
                                    title="+15m"
                                  >
                                    +15
                                  </button>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartFocusForTaskRow(task)}
                                    className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/40 text-cyan-200 font-black cursor-pointer transition flex items-center gap-1"
                                    title="Start Focus on Focus Timer"
                                  >
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>Focus</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleTaskCompleted(task)}
                                    className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-300 font-black cursor-pointer transition"
                                    title="Mark Completed"
                                  >
                                    ✓ Done
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-emerald-400 font-bold">✓ Achieved</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleTaskCompleted(task)}
                                    className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
                                  >
                                    Reopen
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTask(task.id, task.title)}
                                    className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                                    title="Delete permanently"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Column 1: Pending */}
                        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 space-y-2.5 flex flex-col">
                          <div className="flex items-center justify-between px-1 pb-1.5 border-b border-slate-800 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-400" />
                              <span className="text-xs font-black text-slate-200 uppercase">Pending Queue</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold tabular-nums">
                              {kanbanPending.length}
                            </span>
                          </div>
                          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-0.5">
                            {kanbanPending.length === 0 ? (
                              <div className="py-8 text-center text-[11px] text-slate-500 font-mono border border-dashed border-slate-800/80 rounded-lg">
                                No unbatched pending targets
                              </div>
                            ) : (
                              kanbanPending.map((t) => renderKanbanCard(t, 'pending'))
                            )}
                          </div>
                        </div>

                        {/* Column 2: In Progress / On Clock */}
                        <div className="rounded-xl bg-slate-950/80 border border-cyan-500/25 p-2.5 space-y-2.5 flex flex-col">
                          <div className="flex items-center justify-between px-1 pb-1.5 border-b border-slate-800 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                              <span className="text-xs font-black text-cyan-200 uppercase">In Progress / Clock</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold tabular-nums">
                              {kanbanInProgress.length}
                            </span>
                          </div>
                          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-0.5">
                            {kanbanInProgress.length === 0 ? (
                              <div className="py-8 px-3 text-center text-[11px] text-slate-500 font-mono border border-dashed border-slate-800/80 rounded-lg space-y-1.5">
                                <p>No targets batched or on 24h Clock yet</p>
                                {!lmrActiveFlag && kanbanPending.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleAutoBatchChaptersInto90MinClock(undefined, false)}
                                    className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 text-[10px] font-bold cursor-pointer"
                                  >
                                    ⚡ Auto-Batch to Clock
                                  </button>
                                )}
                              </div>
                            ) : (
                              kanbanInProgress.map((t) => renderKanbanCard(t, 'in_progress'))
                            )}
                          </div>
                        </div>

                        {/* Column 3: Completed */}
                        <div className="rounded-xl bg-slate-950/80 border border-emerald-500/25 p-2.5 space-y-2.5 flex flex-col">
                          <div className="flex items-center justify-between px-1 pb-1.5 border-b border-slate-800 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                              <span className="text-xs font-black text-emerald-200 uppercase">Completed</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tabular-nums">
                              {kanbanCompleted.length}
                            </span>
                          </div>
                          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-0.5">
                            {kanbanCompleted.length === 0 ? (
                              <div className="py-8 text-center text-[11px] text-slate-500 font-mono border border-dashed border-slate-800/80 rounded-lg">
                                No completed targets yet today
                              </div>
                            ) : (
                              kanbanCompleted.map((t) => renderKanbanCard(t, 'done'))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : dailyLayoutMode === 'subjects' ? (
                  /* MODE 1: SUBJECT-GROUPED ACCORDION CARDS WITH INLINE CHAPTER PROGRESS BARS */
                  <div className="space-y-3">
                    {subjectChecklistGroups.map(group => {
                      const isCollapsed = collapsedSubjectChecklists[group.subjectCode] ?? false;
                      const allSubjectActiveSelected = group.activeTasks.length > 0 && group.activeTasks.every(t => selectedTaskIds.includes(t.id));
                      const isCompletedExpanded = expandedSubjectCompleted[group.subjectCode] ?? false;
                      const plannedMins = [...group.activeTasks, ...group.completedTasks].reduce(
                        (acc, t) => acc + (Number(t.targetDurationMinutes) || Number(t.duration) || 45),
                        0
                      );
                      const completedMins = group.completedTasks.reduce(
                        (acc, t) => acc + (Number(t.targetDurationMinutes) || Number(t.duration) || 45),
                        0
                      );

                      return (
                        <div
                          key={group.subjectCode}
                          className="rounded-xl bg-slate-950/75 border border-slate-800/90 overflow-hidden shadow-2xs"
                        >
                          {/* Subject Accordion Header with Inline Chapter Progress Bar */}
                          <div className="px-3.5 py-2.5 bg-slate-900/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 flex-wrap min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => toggleSubjectCollapse(group.subjectCode)}
                                className="flex items-center gap-2 text-left cursor-pointer group"
                              >
                                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black font-mono border ${group.colorInfo.text} ${group.colorInfo.bg} ${group.colorInfo.border}`}>
                                  {group.subjectCode}
                                </span>
                                <h3 className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-white tracking-tight truncate">
                                  {group.subjectName}
                                </h3>
                              </button>

                              {/* Inline Chapter Progress Bar */}
                              <div className="flex items-center gap-2 pl-2 border-l border-slate-800 font-mono text-[10.5px] tabular-nums">
                                <div className="w-24 sm:w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                                    style={{ width: `${group.completionRate}%` }}
                                  />
                                </div>
                                <span className="font-black text-emerald-400">
                                  {group.completionRate}%
                                </span>
                                <span className="text-slate-400">
                                  ({group.completedTasks.length}/{group.activeTasks.length + group.completedTasks.length} ch • {formatMinutes(completedMins)}/{formatMinutes(plannedMins)})
                                </span>
                              </div>
                            </div>

                            {/* Subject-specific Quick Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {group.activeTasks.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectSubjectTasks(group.activeTasks)}
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded text-[10px] font-mono font-semibold transition cursor-pointer"
                                  title={allSubjectActiveSelected ? "Deselect all targets in this subject" : "Select all targets in this subject for bulk actions"}
                                >
                                  {allSubjectActiveSelected ? 'Deselect All' : 'Select All'}
                                </button>
                              )}

                              {!lmrActiveFlag && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddForSubject(group.subjectCode)}
                                  className="px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1"
                                  title={`Add a new study target for ${group.subjectCode}`}
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => toggleSubjectCollapse(group.subjectCode)}
                                className="p-1 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition cursor-pointer"
                                title={isCollapsed ? "Expand subject accordion" : "Collapse subject accordion"}
                              >
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Subject Accordion Body */}
                          {!isCollapsed && (
                            <div className="p-2.5 space-y-2">
                              {group.activeTasks.length === 0 ? (
                                <div className="px-3 py-2 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    <span>All <strong className="text-slate-200">{group.subjectName}</strong> targets completed for today.</span>
                                  </div>
                                  {!lmrActiveFlag && (
                                    <button
                                      type="button"
                                      onClick={() => handleQuickAddForSubject(group.subjectCode)}
                                      className="text-[10px] text-emerald-400 hover:underline font-mono font-bold cursor-pointer"
                                    >
                                      + Add target
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <AnimatePresence initial={false}>
                                  {renderTaskListWithClubbedGroups(group.activeTasks, true)}
                                </AnimatePresence>
                              )}

                              {/* Inline Subject Completed Chapters Toggle */}
                              {group.completedTasks.length > 0 && (
                                <div className="pt-1.5 border-t border-slate-800/60">
                                  <button
                                    type="button"
                                    onClick={() => toggleSubjectCompletedExpanded(group.subjectCode)}
                                    className="text-[10px] font-mono font-bold text-emerald-400/90 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span>
                                      {isCompletedExpanded ? 'Hide' : 'Show'} {group.completedTasks.length} Completed {group.subjectCode} Target{group.completedTasks.length !== 1 ? 's' : ''}
                                    </span>
                                  </button>
                                  {isCompletedExpanded && (
                                    <div className="space-y-1.5 mt-2">
                                      {group.completedTasks.map((task, idx) => renderCompletedTaskItem(task, false, idx))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* MODE 3: UNIFIED STREAM / FLAT LIST */
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {renderTaskListWithClubbedGroups(sortedActiveTasks, false)}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>

              {/* Single Unified Completed Targets Drawer */}
              {selectedDayCompletedTasks.length > 0 && (
                <div className="p-3 bg-slate-900/50 border border-slate-800/90 rounded-xl space-y-2.5 font-sans">
                  <button
                    onClick={() => setCompletedCollapsed(!completedCollapsed)}
                    className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-300">Completed Targets</span>
                      <span className="text-[10.5px] text-emerald-400 font-bold font-mono tabular-nums">
                        ({selectedDayCompletedTasks.length})
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${completedCollapsed ? 'rotate-180' : ''}`} />
                  </button>

                  {!completedCollapsed && (
                    <div className="space-y-2 pt-1 animate-slideUp">
                      <AnimatePresence initial={false}>
                        {selectedDayCompletedTasks.map((task, idx) => renderCompletedTaskItem(task, true, idx))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

              {/* Unachieved Targets Segment of the Day */}
              {selectedDayUnachievedTasks.length > 0 && (
                <div className="p-3 bg-rose-950/10 border border-rose-500/20 rounded-xl space-y-2.5 font-sans">
                  <button
                    onClick={() => setMissedCollapsed(!missedCollapsed)}
                    className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400" />
                      <span className="text-xs font-bold text-rose-300">Missed Targets</span>
                      <span className="text-[10.5px] text-rose-400 font-bold font-mono tabular-nums">
                        ({selectedDayUnachievedTasks.length})
                      </span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-rose-400 transition-transform duration-200 ${missedCollapsed ? 'rotate-180' : ''}`} />
                  </button>

                  {!missedCollapsed && (
                    <div className="space-y-2 pt-1 animate-slideUp">
                      <AnimatePresence initial={false}>
                        {selectedDayUnachievedTasks.map((task, idx) => (
                          <motion.div
                            key={`${task.id || 'unach'}_${idx}`}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 shadow-[inset_0_0_12px_rgba(244,63,94,0.08)] flex items-center justify-between gap-3 text-xs text-rose-100"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={selectedTaskIds.includes(task.id)}
                                onChange={() => handleToggleTaskSelection(task.id)}
                                className="h-3.5 w-3.5 rounded border-rose-500/40 bg-rose-950/70 text-rose-500 focus:ring-rose-400 focus:ring-offset-slate-950 cursor-pointer transition shrink-0"
                                title="Select target for bulk actions"
                              />
                              <span
                                className="h-3.5 w-3.5 rounded-[3px] bg-rose-400/40 border border-rose-400/80 inline-block shrink-0"
                                title="Skipped / Missed target"
                              />
                              <span className="text-[9px] font-bold text-rose-200 bg-rose-950/70 px-1.5 py-0.5 border border-rose-500/35 rounded font-mono uppercase shrink-0">
                                {task.subjectCode}
                              </span>
                              <span className="text-[9px] font-bold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 border border-rose-500/35 rounded font-mono shrink-0 flex items-center gap-0.5">
                                <Flag className="h-2.5 w-2.5 opacity-80" />
                                {task.revKey === 'rev1.5' || task.relevance === 'Final Revision' ? '1.5D' : task.revKey === 'rev3' ? 'R3' : task.revKey === 'rev2' ? 'R2' : 'R1'}
                              </span>
                              <span className="text-xs font-semibold text-rose-200/85 line-through decoration-rose-400/70 truncate">
                                {task.cleanTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleToggleTaskCompleted(task)}
                                className="px-2 py-0.5 text-[10px] bg-rose-950/80 hover:bg-rose-900 border border-rose-500/35 text-rose-200 hover:text-white rounded font-semibold transition cursor-pointer"
                                title="Re-open this missed target back to active study list"
                              >
                                Re-open
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id, task.title)}
                                className="p-1 text-rose-300/70 hover:text-rose-200 rounded hover:bg-rose-950/60 transition cursor-pointer"
                                title="Delete record permanently"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
          ) : viewFormat === 'weekly' ? (
        /* WEEKLY VIEWPOINT MODULE (Row-wise Mon-Sun layout) */
        <div className="space-y-3 animate-fadeIn">
          {/* Columnar rows - Row-wise styling for days */}
          <div className="flex flex-col gap-3">
            {currentWeekDays.map((day) => {
              const hasTasks = day.totalCount > 0;
              
              return (
                <div
                  key={day.dateStr}
                  className={`rounded-2xl p-4 md:p-5 border-2 transition duration-200 ${
                    day.isSelected 
                      ? 'bg-gradient-to-r from-slate-900 to-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-500/5' 
                      : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Left side: Day Metadata and Completed Progress Meter */}
                    <div className="md:w-64 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-805/70 pb-4 md:pb-0 pr-0 md:pr-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5 leading-none font-display">
                            <span>{day.dayName}</span>
                            {day.isToday && (
                              <span className="text-[8px] uppercase tracking-wider font-extrabold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.5 rounded leading-none shrink-0 animate-pulse">
                                TODAY
                              </span>
                            )}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-bold font-mono uppercase block select-none">
                            {day.monthLabel} {day.dayNum}
                          </span>
                        </div>

                        {/* Status Count Summary Tags */}
                        {hasTasks && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 rounded-md font-mono font-bold">
                              ✓ {day.completedCount} Achieved
                            </span>
                            <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/15 rounded-md font-mono font-bold">
                              ✦ {day.activeCount} Pending
                            </span>
                            {day.unachievedCount > 0 && (
                              <span className="text-[9px] px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/15 rounded-md font-mono font-bold">
                                ✗ {day.unachievedCount} Missed
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Completed Meter Beside the day detail row */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-mono">
                          <span className="font-bold text-slate-400 uppercase tracking-tight">
                            Completed Meter
                          </span>
                          <span className="font-black text-indigo-400">
                            {day.completionPercent}%
                          </span>
                        </div>
                        
                        {/* Progress Bar Track */}
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0 relative border border-slate-850">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${day.completionPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Day Manage Action Button */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedDate(day.dateStr);
                            setViewFormat('daily');
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition cursor-pointer flex-1 text-center justify-center flex items-center gap-1.5 ${
                            day.isSelected
                              ? 'bg-indigo-500 text-white border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                              : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title="View and focus on this target day in Daily Board"
                        >
                          {day.isSelected ? "↳ Current Daily Board" : "📅 Formulate Targets"}
                        </button>
                      </div>
                    </div>

                    {/* Right side: Row targets view */}
                    <div className="flex-1 min-w-0">
                      {!hasTasks ? (
                        <div className="h-full flex flex-col justify-center items-center py-6 text-center bg-slate-950/20 border border-dashed border-slate-850 rounded-xl px-4 min-h-[100px]">
                          <p className="text-xs text-slate-500 font-semibold italic">No Targets Planned for {day.dayName}</p>
                          <button
                            onClick={() => {
                              setSelectedDate(day.dateStr);
                              setViewFormat('daily');
                            }}
                            className="text-[10px] uppercase font-black text-indigo-400 hover:text-indigo-300 transition duration-150 mt-2.5 inline-flex items-center gap-1.5 font-mono hover:underline cursor-pointer"
                          >
                            + Set target for this day
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {day.tasks.map((task, idx) => {
                            const wkVisualStatus = getTaskCompletionVisualStatus(task);
                            const isCompleted = task.status === 'completed' || wkVisualStatus === 'completed';
                            const isMissed = task.status === 'unachieved' || wkVisualStatus === 'skipped';
                            const isPartiallyDone = !isCompleted && !isMissed && wkVisualStatus === 'partially_done';
                            const isHigh = task.relevance === 'Final Revision' || task.priority === 'High';
                            const isLow = task.relevance === 'General' || task.priority === 'Low';
                            
                            const pillStyle = isHigh 
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-455' 
                              : isLow 
                                ? 'bg-sky-505/10 border-sky-505/20 text-sky-455' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-455';
                            
                            return (
                              <div 
                                key={`${task.id || 'wk_task'}_${day.dateStr}_${idx}`}
                                className={`p-3.5 rounded-xl border transition duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                  isCompleted 
                                    ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)]' 
                                    : isPartiallyDone
                                      ? 'bg-amber-500/15 border-amber-500/45 shadow-[inset_0_0_12px_rgba(245,158,11,0.08)]'
                                      : isMissed 
                                        ? 'bg-rose-500/15 border-rose-500/40 shadow-[inset_0_0_12px_rgba(244,63,94,0.08)]' 
                                        : 'bg-slate-950/50 border border-slate-850 hover:border-slate-800'
                                }`}
                              >
                                <div className="flex items-start gap-3 min-w-0 flex-1">
                                  <button
                                    onClick={() => handleToggleTaskCompleted(task)}
                                    className="text-slate-500 hover:text-indigo-400 shrink-0 mt-1 cursor-pointer flex items-center"
                                    title={isCompleted ? "Reopen Target" : isPartiallyDone ? "Partly Completed — Click to Achieve Target" : "Achieve Target"}
                                  >
                                    {isCompleted ? (
                                      <CheckSquare className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                                    ) : isPartiallyDone ? (
                                      <span className="h-4 w-4 rounded-[4px] bg-amber-400 border border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.45)] inline-block shrink-0" />
                                    ) : isMissed ? (
                                      <span className="h-4 w-4 rounded-[4px] bg-rose-400/40 border border-rose-400/80 inline-block shrink-0" />
                                    ) : (
                                      <Square className="h-4.5 w-4.5 text-slate-600 hover:text-indigo-400 shrink-0" />
                                    )}
                                  </button>
 
                                  <div className="min-w-0 flex-1 leading-normal">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                      <span 
                                        onClick={(e) => { e.stopPropagation(); startEditingTask(task); }}
                                        className="text-[8px] font-black uppercase tracking-wider font-mono border border-slate-800 hover:border-slate-700 hover:text-[#00f3ff] text-slate-355 bg-slate-900 px-1.5 py-0.5 rounded shrink-0 cursor-pointer transition-colors"
                                        title="Click to edit subject"
                                      >
                                        {task.subjectCode}
                                      </span>
                                      <span 
                                        onClick={(e) => { e.stopPropagation(); startEditingTask(task); }}
                                        className={`text-[7.5px] font-bold px-1.5 rounded font-mono shrink-0 uppercase border cursor-pointer hover:opacity-80 transition-opacity ${pillStyle}`}
                                        title="Click to edit relevance/priority"
                                      >
                                        {isHigh ? 'L' : isLow ? 'G' : 'R'}
                                      </span>
                                      
                                      {/* Marking Status Tags */}
                                      {isCompleted ? (
                                        <span className="text-[8px] py-0.5 px-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 rounded-md font-bold font-mono">
                                          ✓ Achieved (Complied)
                                        </span>
                                      ) : isPartiallyDone ? (
                                        <span className="text-[8px] py-0.5 px-2 bg-amber-500/20 text-amber-200 border border-amber-500/40 rounded-md font-bold font-mono">
                                          ◐ Partly Completed
                                        </span>
                                      ) : isMissed ? (
                                        <span className="text-[8px] py-0.5 px-2 bg-rose-500/20 text-rose-300 border border-rose-500/35 rounded-md font-bold font-mono">
                                          ✗ Skipped / Missed
                                        </span>
                                      ) : (
                                        <span className="text-[8px] py-0.5 px-2 bg-amber-500/10 text-amber-400 border border-amber-500/15 rounded-md font-bold font-mono">
                                          ✦ Pending (Active)
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-start gap-1.5 group mt-1">
                                      <p className={`font-extrabold break-words font-sans text-sm tracking-tight text-slate-100 flex-1 ${isCompleted ? 'line-through text-emerald-200/80 font-normal' : ''}`}>
                                        {task.cleanTitle || task.title}
                                      </p>
                                      {!isCompleted && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); startEditingTask(task); }}
                                          className="text-slate-500 hover:text-[#00f3ff] hover:bg-slate-900 transition p-1 rounded-md cursor-pointer shrink-0 mt-0.5"
                                          title="Edit target details (subject, goal, notes, relevance)"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                    {/* Study Notes Inline section */}
                                    <div className="mt-2 pt-2 border-t border-slate-950/40">
                                      {inlineNotesTaskId === task.id ? (
                                        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                                          <textarea
                                            rows={2}
                                            className="w-full bg-slate-950 border border-slate-800 focus:border-[#00f3ff] rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-hidden font-sans resize-y"
                                            placeholder="Jot down quick reminders, statutory thresholds, formulas, or rules..."
                                            value={inlineNotesValue}
                                            onChange={(e) => setInlineNotesValue(e.target.value)}
                                            autoFocus
                                          />
                                          <div className="flex justify-end gap-1.5">
                                            <button
                                              onClick={() => setInlineNotesTaskId(null)}
                                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold transition cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={() => handleSaveInlineNotes(task, inlineNotesValue)}
                                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition cursor-pointer"
                                            >
                                              Save Notes
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="group/notes flex items-start justify-between gap-2">
                                          {cleanTaskNotes(task.notes) ? (
                                            <div 
                                              onClick={() => {
                                                setInlineNotesTaskId(task.id);
                                                setInlineNotesValue(cleanTaskNotes(task.notes));
                                              }}
                                              className="text-[11px] text-slate-300 bg-slate-950/30 border border-slate-900/50 hover:border-slate-800 p-2 rounded-lg leading-relaxed flex-1 cursor-pointer transition-colors"
                                              title="Click to edit study note"
                                            >
                                              <div className="text-[9px] font-black tracking-wider text-indigo-400 font-mono uppercase mb-0.5">Study Notes:</div>
                                              <div className="whitespace-pre-wrap">{cleanTaskNotes(task.notes)}</div>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setInlineNotesTaskId(task.id);
                                                setInlineNotesValue('');
                                              }}
                                              className="text-[10px] font-bold text-slate-500 hover:text-[#00f3ff] hover:bg-slate-955/30 border border-transparent hover:border-slate-900/50 px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                                            >
                                              <PlusCircle className="h-3.5 w-3.5" />
                                              <span>Add Study Note</span>
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Target Management buttons inside vertical layout */}
                                <div className="flex items-center gap-1.5 shrink-0 sm:self-center bg-slate-900 border border-slate-850 p-1.5 rounded-xl">
                                  {/* Fast Toggle Action button */}
                                  <button
                                    onClick={() => handleToggleTaskCompleted(task)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                                      isCompleted 
                                        ? 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white'
                                        : 'bg-emerald-500/10 hover:bg-emerald-505 border border-emerald-500/15 hover:border-emerald-500 text-emerald-400 hover:text-white'
                                    }`}
                                  >
                                    {isCompleted ? "Reopen" : "Achieve"}
                                  </button>

                                  {/* Mark Delay option */}
                                  {!isCompleted && !isMissed && (
                                    <button
                                      onClick={() => handleMarkUnachieved(task)}
                                      className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/15 hover:border-rose-500 text-rose-455 hover:text-white rounded-lg text-[10px] font-black transition cursor-pointer"
                                      title="Mark as Delayed / Missed"
                                    >
                                      Delay
                                    </button>
                                  )}

                                  {/* Reschedule Button */}
                                  <button
                                    onClick={() => {
                                      setRescheduleTask(task);
                                      setRescheduleTargetDate(day.dateStr);
                                    }}
                                    className="px-2.5 py-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg text-[10px] font-black transition cursor-pointer border border-slate-800"
                                    title="Reschedule to another day"
                                  >
                                    Reschedule
                                  </button>

                                  <div className="h-4 w-[1px] bg-slate-800 mx-0.5"></div>

                                  {/* Target Deletion option */}
                                  <button
                                    onClick={() => handleDeleteTask(task.id, task.cleanTitle || task.title)}
                                    className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                                    title="Remove Target Permanently"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewFormat === 'all-pending' ? (
        <div className="space-y-6">
          {/* All Pending Hub Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 border border-amber-500/30 text-white space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span>All Pending Study Targets</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs rounded-full">
                      {allPendingTasks.length} Total
                    </span>
                  </h2>
                </div>
              </div>

              {/* Mass Reschedule Action */}
              {overduePendingTasks.length > 0 && (
                <button
                  onClick={async () => {
                    const today = getSystemLocalDateString();
                    if (isLocalMode) {
                      triggerLocalSaveStatus();
                      const updatedTasks = tasks.map(t => {
                        const matched = mappedTasks.find(mt => mt.id === t.id);
                        if (matched && matched.status === 'needsAction' && matched.taskDate < today) {
                          return { ...t, due: today };
                        }
                        return t;
                      });
                      setTasks(updatedTasks);
                      localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updatedTasks));
                    } else {
                      if (!user) return;
                      setSyncStatus('Saving...');
                      setLoading(true);
                      try {
                        for (const t of overduePendingTasks) {
                          await setDoc(firestoreDoc(db, 'users', user.uid, 'tasks', t.id), { due: today }, { merge: true });
                        }
                        setSyncStatus('Synced');
                      } catch (err) {
                        setErrorMsg('Failed to mass-reschedule overdue tasks.');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reschedule {overduePendingTasks.length} Overdue to Today</span>
                </button>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search pending tasks by topic, notes, or chapter..."
                  value={pendingSearchQuery}
                  onChange={(e) => setPendingSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
                />
                {pendingSearchQuery && (
                  <button
                    onClick={() => setPendingSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-bold font-mono">Subject:</span>
                <select
                  value={pendingSubjectFilter}
                  onChange={(e) => setPendingSubjectFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-amber-300 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer flex-1 sm:flex-initial"
                >
                  <option value="ALL">All Subjects</option>
                  {levelSubjectIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pending Tasks List Render */}
          {(() => {
            const today = getSystemLocalDateString();
            const filteredPending = allPendingTasks.filter(t => {
              if (pendingSubjectFilter !== 'ALL' && t.subjectCode !== pendingSubjectFilter) return false;
              if (pendingSearchQuery.trim()) {
                const q = pendingSearchQuery.toLowerCase();
                const title = (t.cleanTitle || t.title || '').toLowerCase();
                const notes = (t.notes || '').toLowerCase();
                return title.includes(q) || notes.includes(q);
              }
              return true;
            });

            const overdueList = filteredPending.filter(t => t.taskDate < today);
            const todayList = filteredPending.filter(t => t.taskDate === today);

            if (filteredPending.length === 0) {
              return (
                <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto opacity-80" />
                  <h3 className="text-sm font-bold text-slate-200">No Pending Study Targets Found</h3>
                </div>
              );
            }

            const renderTaskCard = (task: any, isOverdue: boolean = false, idx?: number, section?: string) => {
              const subjectColors: Record<string, string> = { AFM: '#38bdf8', FR: '#a855f7', Audit: '#f59e0b', DT: '#10b981', IDT: '#ec4899', IBS: '#6366f1' };
              const color = subjectColors[task.subjectCode] || '#a855f7';

              return (
                <div 
                  key={`${task.id || 'card'}_${section || ''}_${idx !== undefined ? idx : ''}`}
                  className={`p-4 rounded-xl bg-slate-900 border transition-all duration-200 space-y-3 ${
                    isOverdue 
                      ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="text-[10px] font-black px-2 py-0.5 rounded font-mono border"
                          style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
                        >
                          {task.subjectCode}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {task.relevance}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          isOverdue ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          📅 {getFriendlyDateLabel(task.taskDate)} ({task.taskDate})
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white leading-snug">
                        {task.cleanTitle}
                      </h4>
                      {cleanTaskNotes(task.notes) && (
                        <p className="text-xs text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800 leading-relaxed font-sans">
                          <span className="text-[9px] font-mono font-bold text-indigo-400 block uppercase mb-0.5">Study Note:</span>
                          {cleanTaskNotes(task.notes)}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap bg-slate-950/80 p-1.5 border border-slate-800 rounded-xl">
                      <button
                        onClick={() => handleDirectRescheduleTask(task, today)}
                        className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg text-[10px] font-black transition cursor-pointer border border-amber-500/30 flex items-center gap-1"
                        title="Reschedule this task to Today"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>To Today</span>
                      </button>
                      <button
                        onClick={() => {
                          setRescheduleTask(task);
                          setRescheduleTargetDate(task.taskDate);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-extrabold transition cursor-pointer border border-slate-700"
                        title="Reschedule to custom date"
                      >
                        <span>Pick Date</span>
                      </button>
                      <button
                        onClick={() => handleToggleTaskCompleted(task)}
                        className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-[10px] font-black transition cursor-pointer border border-emerald-500/30"
                        title="Mark as achieved/completed"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleMarkUnachieved(task)}
                        className="px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg text-[10px] font-black transition cursor-pointer border border-rose-500/30"
                        title="Flag as unachieved/missed"
                      >
                        Missed
                      </button>
                      {(onStartFocusForTask || onGoToClock) && (
                        <button
                          onClick={() => handleStartFocusForTaskRow(task)}
                          className="p-1.5 bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] rounded-lg transition cursor-pointer border border-[#00f3ff]/30"
                          title="Start Focus on Focus Timer"
                        >
                          <Clock className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id, task.cleanTitle)}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-6">
                {/* Section 1: Overdue Targets */}
                {overdueList.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Overdue Targets ({overdueList.length})</span>
                    </div>
                    <div className="space-y-2.5">
                      {overdueList.map((task, idx) => renderTaskCard(task, true, idx, 'overdue'))}
                    </div>
                  </div>
                )}

                {/* Section 2: Today's Active Targets */}
                {todayList.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                      <Clock className="h-4 w-4" />
                      <span>Today's Active Targets ({todayList.length})</span>
                    </div>
                    <div className="space-y-2.5">
                      {todayList.map((task, idx) => renderTaskCard(task, false, idx, 'today'))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      ) : viewFormat === 'all-missed' ? (
        <div className="space-y-6">
          {/* All Missed Hub Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-950 border border-rose-500/30 text-white space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
                  <ListTodo className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    <span>All Missed & Unachieved Study Targets</span>
                    <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs rounded-full">
                      {allMissedTasks.length} Total
                    </span>
                  </h2>
                </div>
              </div>

              {/* Mass Action to Reschedule Missed */}
              {allMissedTasks.length > 0 && (
                <button
                  onClick={handleRescheduleAllMissedToToday}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reschedule All {allMissedTasks.length} Missed to Today</span>
                </button>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search missed tasks by title or study note..."
                  value={missedSearchQuery}
                  onChange={(e) => setMissedSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
                />
                {missedSearchQuery && (
                  <button
                    onClick={() => setMissedSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-bold font-mono">Subject:</span>
                <select
                  value={missedSubjectFilter}
                  onChange={(e) => setMissedSubjectFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-rose-300 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 cursor-pointer flex-1 sm:flex-initial"
                >
                  <option value="ALL">All Subjects</option>
                  {levelSubjectIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Missed Tasks List Render */}
          {(() => {
            const today = getSystemLocalDateString();
            const filteredMissed = allMissedTasks.filter(t => {
              if (missedSubjectFilter !== 'ALL' && t.subjectCode !== missedSubjectFilter) return false;
              if (missedSearchQuery.trim()) {
                const q = missedSearchQuery.toLowerCase();
                const title = (t.cleanTitle || t.title || '').toLowerCase();
                const notes = (t.notes || '').toLowerCase();
                return title.includes(q) || notes.includes(q);
              }
              return true;
            });

            if (filteredMissed.length === 0) {
              return (
                <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto opacity-80" />
                  <h3 className="text-sm font-bold text-slate-200">Zero Missed Study Goals</h3>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {filteredMissed.map((task, idx) => {
                  const subjectColors: Record<string, string> = { AFM: '#38bdf8', FR: '#a855f7', Audit: '#f59e0b', DT: '#10b981', IDT: '#ec4899', IBS: '#6366f1' };
                  const color = subjectColors[task.subjectCode] || '#a855f7';

                  return (
                    <div 
                      key={`${task.id || 'missed'}_${idx}`}
                      className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50 transition-all duration-200 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span 
                              className="text-[10px] font-black px-2 py-0.5 rounded font-mono border"
                              style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}15` }}
                            >
                              {task.subjectCode}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                              {task.relevance}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              Original Target: {getFriendlyDateLabel(task.taskDate)} ({task.taskDate})
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white leading-snug">
                            {task.cleanTitle}
                          </h4>
                          {cleanTaskNotes(task.notes) && (
                            <p className="text-xs text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800 leading-relaxed font-sans">
                              <span className="text-[9px] font-mono font-bold text-rose-400 block uppercase mb-0.5">Study Note:</span>
                              {cleanTaskNotes(task.notes)}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap bg-slate-950/80 p-1.5 border border-slate-800 rounded-xl">
                          <button
                            onClick={() => handleDirectRescheduleTask(task, today)}
                            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Re-activate task and move to Today's planner"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Reschedule to Today</span>
                          </button>
                          <button
                            onClick={() => {
                              setRescheduleTask(task);
                              setRescheduleTargetDate(today);
                            }}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-extrabold transition cursor-pointer border border-slate-700"
                            title="Reschedule to custom date"
                          >
                            <span>Pick Date</span>
                          </button>
                          <button
                            onClick={() => handleToggleTaskCompleted(task)}
                            className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg text-[10px] font-black transition cursor-pointer border border-emerald-500/30"
                            title="Mark as completed"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id, task.cleanTitle)}
                            className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                            title="Delete task permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      ) : viewFormat === 'roadmap' ? (
        <RoadmapDashboard
          tasks={tasks}
          onOpenAddTargetModal={(subId, chapter) => handleQuickAddForSubject(subId || 'FR', chapter)}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setViewFormat('daily');
          }}
          onNavigateToDailyView={() => setViewFormat('daily')}
          onNavigateToWeeklyView={() => setViewFormat('weekly')}
          onToggleTaskCompleted={(task, forceExecute, targetStatus) => handleToggleTaskCompleted(task as any, forceExecute, targetStatus)}
          onQuickSelectMilestone={(cp) => {
            handleQuickSelectMilestoneChapters(cp, false);
            setViewFormat('daily');
          }}
          onApplyGeneratedTasks={(mergedTasks) => {
            const listIdToUse = selectedListId || 'local-default';
            const normalizedMerged = mergedTasks.map(gt => ({
              ...gt,
              listId: gt.listId || listIdToUse
            }));
            setTasks(normalizedMerged);
            localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(normalizedMerged));
            triggerLocalSaveStatus();
            window.dispatchEvent(new Event('practca_target_system_sync'));
          }}
        />
      ) : null}
    </div>
      </div>

      {/* Reschedule custom date dialog modal */}
      {rescheduleTask && (
        <ModalPortal triggerKey={rescheduleTask.id}>
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-scaleUp">
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>Reschedule Daily Target</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Choose a specific date to move <strong className="text-slate-200">"{rescheduleTask.cleanTitle}"</strong>. Today's log is preserved as "Missed" for honest progress metrics.
            </p>
            
            <div className="mt-4 space-y-2">
              <label className="text-[10px] text-slate-500 font-mono tracking-wider font-extrabold uppercase">SELECT TARGET DATE</label>
              <input
                type="date"
                value={rescheduleTargetDate || getSystemLocalDateString()}
                onChange={(e) => setRescheduleTargetDate(e.target.value)}
                min={getSystemLocalDateString()}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white p-3 focus:outline-none cursor-pointer font-bold font-mono"
              />
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {[
                  { label: 'Today', days: 0 },
                  { label: 'Tomorrow', days: 1 },
                  { label: 'In 2 days', days: 2 },
                  { label: 'In 3 days', days: 3 },
                  { label: 'Next Week', days: 7 }
                ].map((preset) => {
                  const d = new Date();
                  d.setDate(d.getDate() + preset.days);
                  const yr = d.getFullYear();
                  const mn = String(d.getMonth() + 1).padStart(2, '0');
                  const dy = String(d.getDate()).padStart(2, '0');
                  const presetDateStr = `${yr}-${mn}-${dy}`;
                  const isSelected = rescheduleTargetDate === presetDateStr;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setRescheduleTargetDate(presetDateStr)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg transition font-extrabold font-sans cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-500/20 border border-indigo-500 text-indigo-300 font-black' 
                          : 'bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.days === 0 ? 'Today' : `+ ${preset.label}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 border-t border-slate-800/85 pt-4">
              <button
                onClick={() => setRescheduleTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMoveToCustomDate(rescheduleTask, rescheduleTargetDate)}
                disabled={!rescheduleTargetDate}
                className="px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-40"
              >
                Reschedule Target
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Edit custom target dialog modal */}
      {editingTask && (
        <ModalPortal triggerKey={editingTask.id}>
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scaleUp">
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Edit className="h-4.5 w-4.5 text-[#00f3ff]" />
              <span>Edit Study Target Details</span>
            </h3>
            
            <div className="mt-4 space-y-4">
              {/* Subject & Chapter Selection */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider font-extrabold uppercase">SUBJECT CODE</label>
                  <select
                    value={editingTaskSubject}
                    onChange={(e) => {
                      const sub = e.target.value;
                      setEditingTaskSubject(sub);
                      const chaps = SUBJECT_CHAPTERS[sub] || [];
                      if (chaps.length > 0) {
                        setEditingTaskChapter(chaps[0]);
                      } else {
                        setEditingTaskChapter('General / Entire Subject');
                      }
                    }}
                    className="w-full bg-slate-955 border border-slate-800 focus:border-indigo-400 rounded-xl px-2.5 py-2.5 text-xs text-[#00f3ff] focus:outline-hidden cursor-pointer font-bold"
                  >
                    {levelSubjectIds.map(id => (
                      <option key={id} value={id} style={{ color: '#00f3ff', backgroundColor: '#0e1120' }} className="text-[#00f3ff] bg-[#0e1120]">{id}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-mono tracking-wider font-extrabold uppercase">SYLLABUS CHAPTER</label>
                  <SearchableChapterSelect
                    value={editingTaskChapter}
                    onChange={(val) => setEditingTaskChapter(val)}
                    options={SUBJECT_CHAPTERS[editingTaskSubject] || ['General / Entire Subject']}
                  />
                </div>
              </div>

              {/* Study Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-extrabold uppercase">STUDY NOTES (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="Add manual study note for this target (optional)..."
                  value={editingTaskNotes}
                  onChange={(e) => setEditingTaskNotes(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 focus:border-indigo-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden font-semibold"
                />
              </div>

              {/* Relevance Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono tracking-wider font-extrabold uppercase">RELEVANCE LEVEL</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'General', label: '🔵 General', activeClass: 'bg-sky-500/15 border-sky-500/50 text-sky-450 font-extrabold' },
                    { value: 'Revision', label: '🟡 Revision', activeClass: 'bg-amber-500/15 border-amber-500/50 text-amber-400 font-extrabold' },
                    { value: 'Final Revision', label: '🔴 Final Revision', activeClass: 'bg-rose-500/15 border-rose-500/50 text-rose-455 font-extrabold' }
                  ].map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setEditingTaskRelevance(p.value as any)}
                      className={`py-1.5 px-1 border rounded-lg text-center text-xs transition cursor-pointer ${
                        editingTaskRelevance === p.value
                          ? p.activeClass
                          : 'bg-slate-955 border-slate-850 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 border-t border-slate-800/85 pt-4">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedTask}
                className="px-4 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Revision Planner Completion Confirmation Modal */}
      <AnimatePresence>
        {revisionConfirmModal && revisionConfirmModal.isOpen && (
          <ModalPortal triggerKey={revisionConfirmModal.taskTitle}>
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[145] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c101d] border border-indigo-500/30 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(99,102,241,0.15)] space-y-5 text-left relative"
            >
              <button 
                type="button"
                onClick={() => setRevisionConfirmModal(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 p-1.5 rounded-full hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-slate-850 pb-4">
                <div className="p-3 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-2xl shrink-0">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase font-mono tracking-wider">
                    Confirm Revision Report Sync
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Task Completed</span>
                  <p className="text-xs font-extrabold text-slate-200 mt-0.5">{revisionConfirmModal.taskTitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-850">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Subject & Chapter</span>
                    <p className="text-[11px] font-extrabold text-indigo-300 truncate mt-0.5">
                      [{revisionConfirmModal.subjectCode}] {revisionConfirmModal.chapterName}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block">Detected Active Milestone</span>
                    <div className="mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black font-mono border ${
                        revisionConfirmModal.activeMilestoneKey === 'rev1'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : revisionConfirmModal.activeMilestoneKey === 'rev2'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                      }`}>
                        {revisionConfirmModal.activeMilestoneBadge} • {revisionConfirmModal.activeMilestoneLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                  Choose Action:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(revisionConfirmModal.dynamicRevKeys && revisionConfirmModal.dynamicRevKeys.length > 0
                    ? revisionConfirmModal.dynamicRevKeys
                    : ['rev1', 'rev2', 'rev3']
                  ).map((rKey) => {
                    const revNum = parseInt(rKey.replace(/^rev/i, ''), 10) || 1;
                    const badge = rKey === 'rev1.5' ? '1.5D' : rKey === 'baseline' ? 'G' : `R${revNum}`;
                    const label = rKey === 'rev1.5' ? '1.5 Day Peak' : rKey === 'baseline' ? 'Baseline' : `Revision ${revNum}`;
                    const isSelected = revisionConfirmModal.selectedMilestone === rKey;
                    const isDefaultActive = revisionConfirmModal.activeMilestoneKey === rKey;
                    const isPriorSkipped = (revisionConfirmModal.skippedPriorRevs || []).includes(rKey);

                    return (
                      <button
                        key={rKey}
                        type="button"
                        onClick={() => setRevisionConfirmModal(prev => prev ? { ...prev, selectedMilestone: rKey } : null)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 shadow-md' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                          </div>
                          <div>
                            <span className="text-[11px] font-bold font-mono">{badge}</span>
                            <span className="text-[10px] text-slate-400 ml-1.5">({label})</span>
                          </div>
                        </div>
                        {isDefaultActive ? (
                          <span className="text-[8px] font-mono uppercase bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-bold">Active</span>
                        ) : isPriorSkipped ? (
                          <span className="text-[8px] font-mono uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Skipped</span>
                        ) : null}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setRevisionConfirmModal(prev => prev ? { ...prev, selectedMilestone: 'none' } : null)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      revisionConfirmModal.selectedMilestone === 'none'
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        revisionConfirmModal.selectedMilestone === 'none' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                      }`}>
                        {revisionConfirmModal.selectedMilestone === 'none' && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold font-mono text-cyan-300">Skip Revision</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">(Already Done)</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold">Task Only</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={async () => {
                    const { task, subjectCode, chapterName, selectedMilestone } = revisionConfirmModal;
                    // 1. ALLOCATE LOGS FIRST: toggle task with selected milestone so linked logs are recorded to it
                    const taskWithMilestone = {
                      ...task,
                      chapterName: chapterName || task.chapterName,
                      subjectCode: subjectCode || task.subjectCode,
                      revKey: selectedMilestone !== 'none' ? selectedMilestone : 'none'
                    };
                    await handleToggleTaskCompleted(taskWithMilestone, true, 'completed');

                    // 2. MARK COMPLETION SECOND: only after time log allocation is executed, mark milestone completed
                    if (selectedMilestone !== 'none') {
                      syncRevisionPlannerState(subjectCode, chapterName, selectedMilestone);
                    }
                    setRevisionConfirmModal(null);
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {revisionConfirmModal.selectedMilestone !== 'none' 
                      ? `Confirm & Mark ${revisionConfirmModal.selectedMilestone.toUpperCase()} Complete`
                      : 'Complete Task (Skip Revision)'
                    }
                  </span>
                </button>

                {/* Direct 1-Click Skip Revision Option if a milestone was currently highlighted */}
                {revisionConfirmModal.selectedMilestone !== 'none' && (
                  <button
                    type="button"
                    onClick={async () => {
                      const { task } = revisionConfirmModal;
                      await handleToggleTaskCompleted({ ...task, revKey: 'none' }, true, 'completed');
                      setRevisionConfirmModal(null);
                    }}
                    className="w-full sm:w-auto py-2.5 px-3 bg-slate-900 hover:bg-slate-850 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Mark task completed without updating Revision Report"
                  >
                    <Circle className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Skip Revision</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setRevisionConfirmModal(null)}
                  className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* Task Completion Celebration Overlay */}
      <AnimatePresence>
        {taskCelebration && taskCelebration.active && (
          <ModalPortal triggerKey={taskCelebration.taskTitle}>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            {/* Particle Sparks animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 28 }).map((_, i) => {
                const angle = (i / 28) * 360;
                const distance = 140 + (i % 5) * 45;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;
                const colors = ['#10B981', '#00D2FF', '#FFD166', '#9D4EDD', '#FF3366', '#34D399'];
                const randomColor = colors[i % colors.length];

                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.2 }}
                    animate={{ 
                      x: [0, x, x * 1.2], 
                      y: [0, y, y * 1.2 + 20], 
                      opacity: [0, 1, 0],
                      scale: [0.2, 1.4, 0.4],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2.2 + (i % 4) * 0.4,
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: (i % 3) * 0.3
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${6 + (i % 5)}px`,
                      height: `${6 + (i % 5)}px`,
                      borderRadius: i % 2 === 0 ? '50%' : '2px',
                      backgroundColor: randomColor,
                      boxShadow: `0 0 14px ${randomColor}cc`
                    }}
                  />
                );
              })}
            </div>

            {/* Celebration Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative bg-gradient-to-b from-[#0a1224] to-[#040812] border border-emerald-500/30 text-white rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-[0_0_80px_rgba(16,185,129,0.25)] text-center space-y-5"
            >
              {/* Close Icon button */}
              <button
                type="button"
                onClick={() => setTaskCelebration(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Animated Icon Ring */}
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                />
                <CheckCircle2 className="h-9 w-9 text-emerald-400 relative z-10 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl font-mono font-black uppercase tracking-wider text-white">
                  🎯 Task Completed!
                </h2>
              </div>

              {/* Task Details Box */}
              <div className="bg-[#070c18] border border-emerald-500/25 p-3.5 rounded-2xl text-left space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono uppercase text-emerald-400 font-extrabold flex items-center gap-1">
                    <Target className="h-3 w-3 text-emerald-400" />
                    Target Milestone
                  </span>
                  {taskCelebration.relevance && (
                    <span className="px-2 py-0.5 text-[8.5px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded">
                      {taskCelebration.relevance}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-100 line-clamp-2">
                  {taskCelebration.taskTitle}
                </p>
                {taskCelebration.chapterName && (
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    Chapter: {taskCelebration.chapterName}
                  </p>
                )}
              </div>

              {/* Stats pill with Animated Time Spent */}
              <div className="bg-[#050812] border border-slate-800/80 p-4 rounded-2xl flex flex-col items-center justify-center gap-1">
                {taskCelebration.subjectId && (
                  <span className={`text-[10px] font-mono font-black border px-2 py-0.5 rounded-md ${SUBJECT_COLORS[taskCelebration.subjectId]?.text} ${SUBJECT_COLORS[taskCelebration.subjectId]?.bg} ${SUBJECT_COLORS[taskCelebration.subjectId]?.border} uppercase`}>
                    {taskCelebration.subjectId} - {SUBJECT_NAMES[taskCelebration.subjectId]}
                  </span>
                )}
                
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                  className="text-2xl font-mono font-black text-emerald-400 mt-1 flex items-center gap-1.5"
                >
                  <Clock className="h-5 w-5 text-emerald-400" />
                  <span>+{formatMinutes(taskCelebration.durationMins)} spent</span>
                </motion.div>

                {taskCelebration.totalTaskMins && taskCelebration.totalTaskMins > taskCelebration.durationMins && (
                  <div className="text-[10.5px] font-mono text-amber-400 font-bold mt-0.5">
                    Total Focus Invested: {formatMinutes(taskCelebration.totalTaskMins)}
                  </div>
                )}

                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold mt-1">
                  Logged into CA Final Academic Ledger
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setTaskCelebration(null)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-sans font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 hover:from-emerald-400 hover:to-teal-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-slate-950" />
                <span>Continue</span>
              </button>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* Unified Add Study Target Pop-up Modal (Landscape 2-Column Layout with Active Milestone + Other Option) */}
      <AnimatePresence>
        {showAddTargetModal && (
          <ModalPortal triggerKey={`${newTaskSubject}_${newTaskChapter}`}>
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0"
              onClick={() => setShowAddTargetModal(false)}
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative bg-slate-900 border border-slate-750 text-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Compact Landscape Modal Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-[#00f3ff]">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-tight flex flex-wrap items-center gap-2">
                      <span>Add Daily Study Target</span>
                      <span className="text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                        {getFriendlyDateLabel(selectedDate)}
                      </span>
                      <input
                        type="date"
                        min={getSystemLocalDateString()}
                        value={selectedDate < getSystemLocalDateString() ? getSystemLocalDateString() : selectedDate}
                        onChange={(e) => {
                          const todayStr = getSystemLocalDateString();
                          const nextVal = e.target.value;
                          if (nextVal) {
                            setSelectedDate(nextVal < todayStr ? todayStr : nextVal);
                          }
                        }}
                        className="bg-slate-900 border border-indigo-500/40 rounded-lg px-2 py-0.5 text-[11px] font-mono font-bold text-indigo-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
                        title="Target date cannot be older than Today"
                      />
                    </h3>
                  </div>
                </div>

                {/* Primary Source Switcher: Active Milestone vs Other (Out of Milestone / Bonus Topic) */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTargetSourceMode('milestone')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        targetSourceMode === 'milestone'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-xs'
                          : 'text-amber-300 hover:text-white'
                      }`}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      <span>Active Milestone</span>
                      {sortedRoadmapCheckpoints.length > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          targetSourceMode === 'milestone' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {sortedRoadmapCheckpoints.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetSourceMode('other')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        targetSourceMode === 'other'
                          ? 'bg-indigo-500 text-white font-black shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Other (Bonus / All Topics)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetSourceMode('mock_test')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        targetSourceMode === 'mock_test'
                          ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-xs'
                          : 'text-cyan-300 hover:text-white'
                      }`}
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>Mock Test (Exam)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddTargetModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Landscape 2-Column Body */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* LEFT COLUMN (7 Cols): Milestone Chapter Picker OR Main Target Addition Block */}
                  <div className="lg:col-span-7 bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-3.5">
                    {targetSourceMode === 'mock_test' ? (
                      (() => {
                        const [hStr, mStr] = (plannerMockExamTime || '14:00').split(':');
                        const examMins = Math.max(20, (parseInt(hStr, 10) || 14) * 60 + (parseInt(mStr, 10) || 0));
                        const readingMins = examMins - 15;
                        const intimationMins = examMins - 20;
                        const endMins = examMins + 180;
                        const fmt12 = (m: number) => {
                          const h24 = Math.floor(m / 60) % 24;
                          const min = m % 60;
                          const ap = h24 >= 12 ? 'PM' : 'AM';
                          const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
                          return `${h12}:${String(min).padStart(2, '0')} ${ap}`;
                        };
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-cyan-400" />
                                <span className="text-xs font-black uppercase font-mono text-cyan-300">
                                  Schedule ICAI Mock Test Task (15m Reading + 3h Exam)
                                </span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                                Decoupled from Revision Report
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                                1. Select CA Final Paper:
                              </label>
                              <div className="grid grid-cols-6 gap-1.5">
                                {levelSubjectIds.map(sub => {
                                  const isLocked = isSubjectLockedAfterFinalExam(sub);
                                  return (
                                    <button
                                      key={sub}
                                      type="button"
                                      disabled={isLocked}
                                      onClick={() => {
                                        if (!isLocked) setNewTaskSubject(sub);
                                      }}
                                      className={`py-2 px-1 rounded-xl text-center font-mono font-bold text-xs border transition ${
                                        isLocked
                                          ? 'bg-slate-950 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-60'
                                          : newTaskSubject === sub
                                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm cursor-pointer'
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white cursor-pointer'
                                      }`}
                                      title={isLocked ? `${sub} Final Exam & 1.5D Sprint Completed (Locked)` : sub}
                                    >
                                      {sub}{isLocked ? ' 🔒' : ''}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                                2. Mock Test Series:
                              </label>
                              <select
                                value={plannerMockSeries}
                                onChange={(e) => setPlannerMockSeries(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white cursor-pointer"
                              >
                                <option value="ICAI MTP Series 1">ICAI Mock Test Paper (MTP) Series 1</option>
                                <option value="ICAI MTP Series 2">ICAI Mock Test Paper (MTP) Series 2</option>
                                <option value="Past Exam Question Paper (May 2026 / Nov 2025)">Past Exam Question Paper (Full Simulation)</option>
                                <option value="Full Syllabus Diagnostic Self-Assessment">Full Syllabus Diagnostic Self-Assessment</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono uppercase font-bold text-slate-400">
                                  3. Scheduled Exam Time (X) — Choose Any Time:
                                </label>
                                <span className="text-[10px] font-mono text-cyan-300 font-bold">
                                  Study/Reading starts at X - 15m ({fmt12(readingMins)})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  type="time"
                                  value={plannerMockExamTime}
                                  onChange={(e) => setPlannerMockExamTime(e.target.value || '14:00')}
                                  className="bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-sm font-mono font-black text-white cursor-pointer"
                                />
                                {['09:00', '10:00', '14:00', '16:00', '18:00', '20:00'].map(preset => {
                                  const [ph, pm] = preset.split(':').map(Number);
                                  const pMins = ph * 60 + pm;
                                  return (
                                    <button
                                      key={preset}
                                      type="button"
                                      onClick={() => setPlannerMockExamTime(preset)}
                                      className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer transition ${
                                        plannerMockExamTime === preset
                                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                      }`}
                                    >
                                      {fmt12(pMins)}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                              <div className="p-2 rounded-lg bg-slate-950/90 border border-slate-800">
                                <span className="text-[9px] font-mono uppercase text-amber-400 font-bold block">5m Reminder (X-20m)</span>
                                <span className="text-xs font-mono font-black text-white">{fmt12(intimationMins)}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-950/90 border border-amber-500/30">
                                <span className="text-[9px] font-mono uppercase text-amber-300 font-bold block">15m Reading (X-15m)</span>
                                <span className="text-xs font-mono font-black text-white">{fmt12(readingMins)}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-950/90 border border-cyan-500/30">
                                <span className="text-[9px] font-mono uppercase text-cyan-300 font-bold block">3h Exam (X)</span>
                                <span className="text-xs font-mono font-black text-white">{fmt12(examMins)}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-950/90 border border-emerald-500/30">
                                <span className="text-[9px] font-mono uppercase text-emerald-300 font-bold block">Exam Ends (X+3h)</span>
                                <span className="text-xs font-mono font-black text-white">{fmt12(endMins)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : targetSourceMode === 'milestone' ? (
                      sortedRoadmapCheckpoints.length === 0 ? (
                        <div className="p-6 text-center space-y-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
                          <Flag className="h-8 w-8 text-amber-400 mx-auto opacity-80" />
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white">No Active Milestones Defined Yet</h4>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddTargetModal(false);
                                setViewFormat('roadmap');
                              }}
                              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono cursor-pointer transition shadow-md"
                            >
                              Go to Roadmap & Define Milestone
                            </button>
                            <button
                              type="button"
                              onClick={() => setTargetSourceMode('other')}
                              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs font-mono cursor-pointer transition shadow-md"
                            >
                              ➕ Other (Browse All Syllabus Topics)
                            </button>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const cp = activeMilestoneCheckpoint!;
                          const isSub = cp.subjectId !== 'CUSTOM';
                          const cpChapters = (cp.selectedChapters && cp.selectedChapters.length > 0)
                            ? cp.selectedChapters
                            : (isSub ? getMilestoneSubjectChapters(cp.subjectId as SubjectId) : []);
                          const doneSet = new Set(cp.completedChapters || []);
                          const filteredMilestoneChapters = cpChapters.filter(ch =>
                            !milestoneChapterSearch.trim() || ch.toLowerCase().includes(milestoneChapterSearch.toLowerCase())
                          );
                          const pendingMilestoneChapters = filteredMilestoneChapters.filter(ch => !doneSet.has(ch));
                          const completedMilestoneChapters = filteredMilestoneChapters.filter(ch => doneSet.has(ch));
                          const orderedChapters = [...pendingMilestoneChapters, ...completedMilestoneChapters];

                          return (
                            <div className="space-y-3">
                              {/* Active Milestone Header & Selector */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                  <span className="px-2 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 font-mono font-black text-[10px] shrink-0 flex items-center gap-1">
                                    <Flag className="h-3 w-3 text-amber-400" />
                                    <span>Active Milestone</span>
                                  </span>
                                  <select
                                    value={cp.id}
                                    onChange={(e) => {
                                      const nextId = e.target.value;
                                      setSelectedMilestoneId(nextId);
                                      const found = sortedRoadmapCheckpoints.find(c => c.id === nextId);
                                      if (found && found.subjectId !== 'CUSTOM') {
                                        setNewTaskSubject(found.subjectId);
                                        setActiveSyllabusSubject(found.subjectId);
                                        const chList = (found.selectedChapters && found.selectedChapters.length > 0)
                                          ? found.selectedChapters
                                          : getMilestoneSubjectChapters(found.subjectId);
                                        if (chList.length > 0) setNewTaskChapter(chList[0]);
                                      }
                                    }}
                                    className="bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer flex-1 truncate"
                                  >
                                    {sortedRoadmapCheckpoints.map((item, i) => (
                                      <option key={item.id} value={item.id} className="bg-slate-950 text-white">
                                        #{i + 1} • {item.subjectId !== 'CUSTOM' ? item.subjectId : item.customTitle || 'Custom'} ({item.revisionCycle}) — Due {item.targetDate}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10.5px] font-mono text-emerald-300 font-bold tabular-nums">
                                    {pendingMilestoneChapters.length} Pending / {cpChapters.length} Total
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickSelectMilestoneChapters(cp, false)}
                                    className="h-7 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                                    title="Quick-Select all underlying chapters of this milestone as today's active tasks"
                                  >
                                    <Zap className="h-3 w-3 fill-current" />
                                    <span>{quickSelectMilestoneFeedback[cp.id] || `Quick-Select All (${pendingMilestoneChapters.length || cpChapters.length})`}</span>
                                  </button>
                                </div>
                              </div>

                              {/* All Milestones Quick-Select Bar inside Modal */}
                              {sortedRoadmapCheckpoints.length > 1 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {sortedRoadmapCheckpoints.map((mItem, mIdx) => {
                                    const mChaps = extractMilestoneUnderlyingChapters(mItem);
                                    const isCurrent = mItem.id === cp.id;
                                    return (
                                      <div
                                        key={`modal_ms_bar_${mItem.id}`}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10.5px] font-mono shrink-0 ${
                                          isCurrent
                                            ? 'bg-amber-500/15 border-amber-400/50 text-white'
                                            : 'bg-slate-900 border-slate-800 text-slate-300'
                                        }`}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => setSelectedMilestoneId(mItem.id)}
                                          className="font-bold hover:text-amber-300 cursor-pointer"
                                        >
                                          #{mIdx + 1} {mItem.subjectId !== 'CUSTOM' ? mItem.subjectId : mItem.customTitle || 'Custom'} ({mChaps.length})
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleQuickSelectMilestoneChapters(mItem, false)}
                                          className="px-1.5 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[9.5px] cursor-pointer flex items-center gap-0.5"
                                          title="Quick-Select all underlying chapters of this milestone as today's active tasks"
                                        >
                                          <Zap className="h-2.5 w-2.5 fill-current" />
                                          <span>Quick-Select</span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Search within Active Milestone + Quick "Other" button */}
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    type="text"
                                    placeholder={`Filter ${cp.subjectId !== 'CUSTOM' ? cp.subjectId : 'milestone'} chapters...`}
                                    value={milestoneChapterSearch}
                                    onChange={(e) => setMilestoneChapterSearch(e.target.value)}
                                    className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden"
                                  />
                                  {milestoneChapterSearch && (
                                    <button
                                      type="button"
                                      onClick={() => setMilestoneChapterSearch('')}
                                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setTargetSourceMode('other')}
                                  className="h-8 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold shrink-0 cursor-pointer transition flex items-center gap-1.5"
                                  title="Add a bonus topic outside the active milestone"
                                >
                                  <Plus className="h-3.5 w-3.5 text-amber-400" />
                                  <span>Other Topics</span>
                                </button>
                              </div>

                              {/* Milestone Chapters Grid (2 columns in landscape) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                                {orderedChapters.map((rawChap, idx) => {
                                  const bracketMatch = rawChap.match(/^\[([A-Za-z]+)\]\s*(.+)$/);
                                  const chapSub: SubjectId = bracketMatch
                                    ? (bracketMatch[1] as SubjectId)
                                    : (cp.subjectId !== 'CUSTOM' ? cp.subjectId : 'FR');
                                  const cleanChapName = bracketMatch ? bracketMatch[2] : rawChap;
                                  const isSelected = newTaskSubject === chapSub && newTaskChapter === cleanChapName;
                                  const isDoneInMilestone = doneSet.has(rawChap);
                                  const isQuickAdded = addedChapterKey === `${chapSub}-${cleanChapName}`;
                                  const isAlreadyOnSelectedDay = scheduledChapterKeysOnSelectedDate.has(
                                    getTaskCanonicalChapterIdentity(chapSub, cleanChapName)
                                  );

                                  return (
                                    <div
                                      key={`ms_chap_${idx}`}
                                      onClick={() => {
                                        setNewTaskSubject(chapSub);
                                        setActiveSyllabusSubject(chapSub);
                                        setNewTaskChapter(cleanChapName);
                                      }}
                                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer text-xs ${
                                        isAlreadyOnSelectedDay
                                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                                          : isSelected
                                            ? 'bg-amber-500/15 border-amber-400 text-white font-bold shadow-sm'
                                            : isDoneInMilestone
                                              ? 'bg-slate-900/40 border-slate-850 text-slate-500 hover:text-slate-300'
                                              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate flex-1">
                                        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-amber-300 shrink-0">
                                          {chapSub}
                                        </span>
                                        <span className={`truncate ${isDoneInMilestone ? 'line-through' : ''}`}>
                                          {cleanChapName}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        disabled={isAlreadyOnSelectedDay}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isAlreadyOnSelectedDay) return;
                                          handleQuickAddChapterGoal(cleanChapName, chapSub);
                                        }}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 transition ${
                                          isAlreadyOnSelectedDay
                                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-not-allowed opacity-80'
                                            : isQuickAdded
                                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-pointer'
                                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer font-black shadow-xs'
                                        }`}
                                        title={
                                          isAlreadyOnSelectedDay
                                            ? `Already scheduled on ${getFriendlyDateLabel(selectedDate)} (1 chapter/day limit)`
                                            : '1-Click Add to Daily Board'
                                        }
                                      >
                                        {isAlreadyOnSelectedDay ? '✓ On Day' : isQuickAdded ? '✓ Added' : '+ Add'}
                                      </button>
                                    </div>
                                  );
                                })}

                                {/* Explicit "Other" Option Card inside Milestone List for Out-of-Milestone / Bonus Topics */}
                                <button
                                  type="button"
                                  onClick={() => setTargetSourceMode('other')}
                                  className="p-2.5 rounded-xl border border-dashed border-indigo-500/50 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-between gap-2 cursor-pointer transition sm:col-span-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                                    <span>Other — Add Bonus / Out-of-Milestone Topic from Full Syllabus</span>
                                  </div>
                                  <span className="text-[10px] font-mono underline shrink-0">Open Main Block →</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()
                      )
                    ) : (
                      /* MAIN TARGET ADDITION BLOCK ("OTHER" / OUT-OF-MILESTONE / FULL SYLLABUS) */
                      <div className="space-y-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-850">
                          <span className="text-[11px] font-mono uppercase font-black text-indigo-300 flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                            <span>ICAI Full Curriculum Chapters (Bonus / Any Topic)</span>
                          </span>

                          {sortedRoadmapCheckpoints.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setTargetSourceMode('milestone')}
                              className="text-[10.5px] font-mono text-amber-300 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Flag className="h-3 w-3" />
                              <span>← Back to Active Milestone</span>
                            </button>
                          )}
                        </div>

                        {/* Subject Switcher Pills */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1.5">
                            Select Subject (All Syllabus / Bonus Topic)
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {levelSubjectIds.map(subId => {
                              const isActive = newTaskSubject === subId;
                              const isLocked = isSubjectLockedAfterFinalExam(subId);
                              const col = SUBJECT_COLORS[subId];
                              return (
                                <button
                                  key={subId}
                                  type="button"
                                  disabled={isLocked}
                                  onClick={() => {
                                    if (isLocked) return;
                                    setActiveSyllabusSubject(subId);
                                    setNewTaskSubject(subId);
                                    const chaps = SUBJECT_CHAPTERS[subId] || [];
                                    if (chaps.length > 0) setNewTaskChapter(chaps[0]);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                                    isLocked
                                      ? 'bg-slate-950 text-slate-600 border border-slate-800/60 cursor-not-allowed opacity-60'
                                      : isActive
                                        ? `${col?.bg || 'bg-indigo-500/20'} ${col?.text || 'text-indigo-300'} border ${col?.border || 'border-indigo-500/40'} shadow-sm cursor-pointer`
                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 cursor-pointer'
                                  }`}
                                  title={isLocked ? `${subId} Final Exam & 1.5D Sprint Completed (Locked)` : subId}
                                >
                                  {isLocked ? (
                                    <Lock className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col?.colorCode || '#6366f1' }}></span>
                                  )}
                                  <span>{subId}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Search Bar (in place of dropdown) + Scrollable Chapter List */}
                        <div className="space-y-2.5">
                          <div className="relative">
                            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              placeholder={`Search ${newTaskSubject} chapters to find and add...`}
                              value={syllabusSearchQuery}
                              onChange={(e) => setSyllabusSearchQuery(e.target.value)}
                              className="w-full pl-8 pr-8 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden"
                            />
                            {syllabusSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setSyllabusSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                            {(SUBJECT_CHAPTERS[newTaskSubject] || [])
                              .filter(c => c !== 'General / Entire Subject')
                              .filter(chap => chap.toLowerCase().includes(syllabusSearchQuery.toLowerCase()))
                              .map((chap, idx) => {
                                const isAdded = addedChapterKey === `${newTaskSubject}-${chap}`;
                                const isSelected = newTaskChapter === chap;
                                const isAlreadyOnSelectedDay = scheduledChapterKeysOnSelectedDate.has(
                                  getTaskCanonicalChapterIdentity(newTaskSubject, chap)
                                );
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => setNewTaskChapter(chap)}
                                    className={`p-2.5 rounded-xl border text-left transition-all flex justify-between items-center gap-2 group cursor-pointer w-full text-xs ${
                                      isAlreadyOnSelectedDay
                                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                                        : isSelected
                                          ? 'bg-indigo-500/15 border-indigo-400 text-white font-bold'
                                          : isAdded
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                                            : 'bg-slate-900 border-slate-850 hover:border-slate-700 text-slate-300'
                                    }`}
                                  >
                                    <span className="font-medium tracking-tight truncate flex-1">
                                      {idx + 1}. {chap}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isAlreadyOnSelectedDay) return;
                                        handleQuickAddChapterGoal(chap, newTaskSubject);
                                      }}
                                      disabled={!selectedListId || isAlreadyOnSelectedDay}
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all shrink-0 ${
                                        isAlreadyOnSelectedDay
                                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-not-allowed opacity-80'
                                          : 'text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500 hover:text-white cursor-pointer'
                                      }`}
                                      title={
                                        isAlreadyOnSelectedDay
                                          ? `Already scheduled on ${getFriendlyDateLabel(selectedDate)} (1 chapter/day limit)`
                                          : 'Add chapter to daily checklist'
                                      }
                                    >
                                      {isAlreadyOnSelectedDay ? '✓ On Day' : isAdded ? '✓ Added!' : '+ Ingest'}
                                    </button>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN (5 Cols): Selected Topic, Relevance, Preview & Submit */}
                  {(() => {
                    const isSelectedTopicAlreadyOnDay =
                      Boolean(newTaskChapter) &&
                      newTaskChapter !== 'General / Entire Subject' &&
                      scheduledChapterKeysOnSelectedDate.has(getTaskCanonicalChapterIdentity(newTaskSubject, newTaskChapter));

                    return (
                      <div className="lg:col-span-5 bg-slate-950/60 border border-slate-850 rounded-2xl p-4 space-y-3.5 flex flex-col justify-between">
                        <div className="space-y-3.5">
                          {/* Currently Selected Subject & Chapter Pill */}
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                                Selected Topic
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                {newTaskSubject}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white truncate">
                              {newTaskChapter}
                            </div>
                            {isSelectedTopicAlreadyOnDay && (
                              <div className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg flex items-center gap-1.5">
                                <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                                <span>Already scheduled on {getFriendlyDateLabel(selectedDate)} (1/day limit)</span>
                              </div>
                            )}
                          </div>

                          {/* Relevance Level */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 block">Relevance Level</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { value: 'General', label: '🔵 General', activeClass: 'bg-sky-500/15 border-sky-500/50 text-sky-400 font-extrabold' },
                                { value: 'Revision', label: '🟡 Revision', activeClass: 'bg-amber-500/15 border-amber-500/50 text-amber-400 font-extrabold' },
                                { value: 'Final Revision', label: '🔴 Final Rev', activeClass: 'bg-rose-500/15 border-rose-500/50 text-rose-400 font-extrabold' }
                              ].map(p => (
                                <button
                                  key={p.value}
                                  type="button"
                                  onClick={() => setNewTaskRelevance(p.value as any)}
                                  className={`py-2 px-1.5 border rounded-xl text-center text-[11px] transition cursor-pointer ${
                                    newTaskRelevance === p.value
                                      ? p.activeClass
                                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                  }`}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Study Notes (Optional - Manual Only) */}
                          {targetSourceMode !== 'mock_test' && (
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-slate-400 block">
                                Study Notes <span className="text-[10px] font-mono text-slate-500 font-normal">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={newTaskNotes}
                                onChange={(e) => setNewTaskNotes(e.target.value)}
                                placeholder="Add manual study note for this target (optional)..."
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden font-sans"
                              />
                            </div>
                          )}

                          {/* Scheduled Day */}
                          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                              <span>Scheduled: {getFriendlyDateLabel(selectedDate)}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{selectedDate}</span>
                          </div>

                          {/* Quick Auto-Batch 90m Option inside Add Target Modal */}
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-black uppercase text-amber-300 flex items-center gap-1">
                                <Zap className="h-3.5 w-3.5 text-amber-400" />
                                <span>Auto-Batch into 90m Clock Blocks</span>
                              </span>
                              <span className="text-[9.5px] font-mono text-slate-400">
                                {modalBatchChapters.length} queued
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                disabled={isSelectedTopicAlreadyOnDay}
                                onClick={() => {
                                  if (!newTaskChapter || newTaskChapter === 'General / Entire Subject' || isSelectedTopicAlreadyOnDay) return;
                                  const exists = modalBatchChapters.some(
                                    c => c.subjectCode === newTaskSubject && c.chapterName === newTaskChapter
                                  );
                                  if (!exists) {
                                    setModalBatchChapters(prev => [
                                      ...prev,
                                      { subjectCode: newTaskSubject as SubjectId, chapterName: newTaskChapter }
                                    ]);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold cursor-pointer"
                              >
                                + Queue "{newTaskChapter.slice(0, 22)}{newTaskChapter.length > 22 ? '…' : ''}"
                              </button>

                              {modalBatchChapters.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    modalBatchChapters.forEach(ch => {
                                      handleQuickAddChapterGoal(ch.chapterName, ch.subjectCode);
                                    });
                                    handleAutoBatchChaptersInto90MinClock(
                                      modalBatchChapters.map((ch, idx) => ({
                                        id: `modal_batch_${Date.now()}_${idx}`,
                                        title: ch.chapterName,
                                        cleanTitle: ch.chapterName,
                                        chapterName: ch.chapterName,
                                        subjectCode: ch.subjectCode,
                                        relevance: newTaskRelevance
                                      })),
                                      false
                                    );
                                    setModalBatchChapters([]);
                                    setShowAddTargetModal(false);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-[10px] cursor-pointer flex items-center gap-1"
                                >
                                  <Zap className="h-3 w-3" />
                                  <span>Ingest & Auto-Batch ({modalBatchChapters.length}) into 90m Blocks</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-850">
                          <button
                            type="button"
                            onClick={() => setShowAddTargetModal(false)}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer border border-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddNewTask}
                            disabled={targetSourceMode !== 'mock_test' && (!selectedListId || !newTaskChapter || isSelectedTopicAlreadyOnDay)}
                            className={`flex-1 py-2.5 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                              targetSourceMode === 'mock_test'
                                ? 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-cyan-500/20'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/20'
                            }`}
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>
                              {targetSourceMode === 'mock_test'
                                ? `Schedule [${newTaskSubject}] Mock Test (${plannerMockExamTime})`
                                : isSelectedTopicAlreadyOnDay
                                  ? 'Already Scheduled Today'
                                  : 'Add Target to Daily Checklist'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* BATCH EDITOR & INSPECTOR MODAL */}
      {activeBatchInspector && (() => {
        if (activeBatchInspector.source === 'milestone_day') {
          const daySched = milestoneAutoAllocationPlan?.daySchedules.find(d =>
            (activeBatchInspector.dateStr && d.dateStr === activeBatchInspector.dateStr) ||
            (activeBatchInspector.dayNumber && d.dayNumber === activeBatchInspector.dayNumber) ||
            d.chapters.some(c => c.clubGroupId === activeBatchInspector.clubGroupId)
          );
          const dayChapters = daySched?.chapters || [];
          const batchMembers = dayChapters.filter(c => c.clubGroupId === activeBatchInspector.clubGroupId);
          if (batchMembers.length === 0) return null;
          const primary = batchMembers[0];
          const batchTotal = primary.clubTotalMinutes || batchMembers.reduce((a, b) => a + b.timeNeededMins, 0);
          const subCode = primary.subjectCode;
          const unbatchedOnDay = dayChapters
            .filter(c => !c.clubGroupId && c.subjectCode === subCode)
            .map(c => ({
              id: c.configKey,
              title: c.chapterName,
              chapterName: c.chapterName,
              subjectCode: c.subjectCode
            }));

          return (
            <BatchEditorModal
              isOpen={true}
              onClose={() => setActiveBatchInspector(null)}
              batchNumber={activeBatchInspector.batchNumber || 1}
              clubGroupId={activeBatchInspector.clubGroupId}
              subjectCode={subCode}
              totalMinutes={batchTotal}
              items={batchMembers.map(m => ({
                id: m.configKey,
                title: m.chapterName,
                chapterName: m.chapterName,
                subjectCode: m.subjectCode,
                relevance: m.relevance,
                allocatedMinutes: m.timeNeededMins
              }))}
              availableChaptersToAdd={unbatchedOnDay}
              onUpdateTotalMinutes={(newTotal) => {
                handleUpdateMilestoneClubTotalDuration(activeBatchInspector.clubGroupId, newTotal, dayChapters);
              }}
              onUpdateItemMinutes={(itemId, newMins) => {
                const targetCh = batchMembers.find(m => m.configKey === itemId);
                if (targetCh) {
                  handleAdjustMilestoneChapterTime(targetCh, newMins, dayChapters);
                }
              }}
              onResetEqualSplit={() => {
                handleResetMilestoneClubEqualSplit(activeBatchInspector.clubGroupId, dayChapters);
              }}
              onRemoveItemFromBatch={(itemId) => {
                const targetCh = batchMembers.find(m => m.configKey === itemId);
                if (targetCh) {
                  handleRemoveMilestoneChapterFromClub(targetCh, dayChapters);
                }
              }}
              onAddItemToBatch={(item) => {
                const targetCh = dayChapters.find(c => c.configKey === item.id);
                if (targetCh) {
                  handleAddChapterToMilestoneClub(activeBatchInspector.clubGroupId, targetCh, dayChapters);
                }
              }}
              onUnbatchAll={() => {
                batchMembers.forEach(m => {
                  handleRemoveMilestoneChapterFromClub(m, dayChapters);
                });
              }}
            />
          );
        } else {
          // source === 'daily_planner'
          let batchMembers = selectedDayTasks
            .filter(t => {
              const tClub = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
              return tClub === activeBatchInspector.clubGroupId && t.status !== 'unachieved';
            })
            .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));
          if (batchMembers.length === 0) {
            batchMembers = tasks
              .filter(t => {
                const tClub = t.clubGroupId || (t.notes || '').match(/ClubGroupId:\s*([^\n\r|]+)/i)?.[1]?.trim();
                return tClub === activeBatchInspector.clubGroupId && t.status !== 'unachieved';
              })
              .sort((a, b) => (a.clubOrder ?? 0) - (b.clubOrder ?? 0));
          }
          if (batchMembers.length === 0) return null;
          const primary = batchMembers[0];
          const batchTotal = primary.clubTotalMinutes || batchMembers.reduce((a, b) => a + (Number(b.targetDurationMinutes) || 45), 0);
          const subCode = primary.subjectCode || 'IDT';
          const unbatchedOnDay = selectedDayTasks
            .filter(t => !t.clubGroupId && t.subjectCode === subCode && t.status !== 'unachieved')
            .map(t => ({
              id: t.id,
              title: t.cleanTitle || t.title,
              chapterName: t.chapterName || t.cleanTitle || t.title,
              subjectCode: t.subjectCode || subCode
            }));

          return (
            <BatchEditorModal
              isOpen={true}
              onClose={() => setActiveBatchInspector(null)}
              batchNumber={activeBatchInspector.batchNumber || 1}
              clubGroupId={activeBatchInspector.clubGroupId}
              subjectCode={subCode}
              totalMinutes={batchTotal}
              items={batchMembers.map(m => ({
                id: m.id,
                title: m.cleanTitle || m.title,
                chapterName: m.chapterName,
                subjectCode: m.subjectCode || subCode,
                relevance: m.relevance,
                allocatedMinutes: Number(m.targetDurationMinutes) || Math.round(batchTotal / batchMembers.length),
                isCompleted: m.status === 'completed'
              }))}
              availableChaptersToAdd={unbatchedOnDay}
              onUpdateTotalMinutes={(newTotal) => {
                handleUpdateClubGroupDuration(activeBatchInspector.clubGroupId, newTotal);
              }}
              onUpdateItemMinutes={(itemId, newMins) => {
                handleUpdateSubTargetInClubDuration(itemId, activeBatchInspector.clubGroupId, newMins);
              }}
              onResetEqualSplit={async () => {
                const derived = allocateProportionateClubDurations(
                  batchMembers.map(m => ({
                    id: m.id,
                    subjectCode: m.subjectCode,
                    chapterName: m.chapterName || m.cleanTitle || m.title,
                    title: m.cleanTitle || m.title,
                    relevance: m.relevance === 'Final Revision' ? 'final_revision' : m.relevance === 'General' ? 'general' : 'revision'
                  })),
                  batchTotal
                );
                const dMap = new Map(derived.map(d => [d.id, d.allocatedMinutes]));
                let durationsMap: Record<string, number> = {};
                try {
                  const rawDur = localStorage.getItem(getLevelScopedKey('practca_task_target_durations'));
                  if (rawDur) durationsMap = JSON.parse(rawDur);
                } catch (e) {}
                const updated = tasks.map(t => {
                  if (t.clubGroupId === activeBatchInspector.clubGroupId) {
                    const subM = dMap.get(t.id) ?? Math.round(batchTotal / batchMembers.length);
                    durationsMap[t.id] = subM;
                    return {
                      ...t,
                      targetDurationMinutes: subM,
                      clubTotalMinutes: batchTotal,
                      clubAllocationBasis: 'best_judgment' as const
                    };
                  }
                  return t;
                });
                setTasks(updated);
                try {
                  localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updated));
                  localStorage.setItem(getLevelScopedKey('practca_task_target_durations'), JSON.stringify(durationsMap));
                  window.dispatchEvent(new Event('practca_tasks_updated'));
                } catch (e) {}
              }}
              onRemoveItemFromBatch={(itemId) => {
                const remaining = batchMembers.filter(m => m.id !== itemId);
                if (remaining.length <= 1) {
                  handleUnclubGroup(activeBatchInspector.clubGroupId);
                } else {
                  const newRemTotal = remaining.reduce((a, b) => a + (Number(b.targetDurationMinutes) || 45), 0);
                  const updated = tasks.map(t => {
                    if (t.id === itemId) {
                      const copy = { ...t };
                      delete copy.clubGroupId;
                      delete copy.clubTotalMinutes;
                      delete copy.clubOrder;
                      delete copy.clubAllocationBasis;
                      delete copy.clubPriorLoggedMinutes;
                      return copy;
                    }
                    if (t.clubGroupId === activeBatchInspector.clubGroupId) {
                      return { ...t, clubTotalMinutes: newRemTotal };
                    }
                    return t;
                  });
                  setTasks(updated);
                  try {
                    localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updated));
                    window.dispatchEvent(new Event('practca_tasks_updated'));
                  } catch (e) {}
                }
              }}
              onAddItemToBatch={(item) => {
                const targetTask = tasks.find(t => t.id === item.id);
                if (!targetTask) return;
                const newOrder = batchMembers.length;
                const updated = tasks.map(t => {
                  if (t.id === item.id) {
                    return {
                      ...t,
                      clubGroupId: activeBatchInspector.clubGroupId,
                      clubTotalMinutes: batchTotal,
                      clubOrder: newOrder,
                      clubAllocationBasis: 'best_judgment' as const
                    };
                  }
                  return t;
                });
                setTasks(updated);
                try {
                  localStorage.setItem(getLevelScopedKey('practca_local_tasks'), JSON.stringify(updated));
                  window.dispatchEvent(new Event('practca_tasks_updated'));
                } catch (e) {}
              }}
              onUnbatchAll={() => {
                handleUnclubGroup(activeBatchInspector.clubGroupId);
              }}
              onStartBatchFlow={() => {
                handleStartClubbedBatchFlow(batchMembers, batchTotal);
              }}
            />
          );
        }
      })()}

      {/* Import Predefined Task List / Fillable PDF, Excel XML & JSON Schedule Template Modal */}
      <TaskImportModal
        isOpen={showImportTemplateModal}
        onClose={() => setShowImportTemplateModal(false)}
        defaultAnchorDate={selectedDate}
        currentBoardName={
          taskLists.find(l => l.id === selectedListId)?.title ||
          taskLists[0]?.title ||
          'Default Goal Board'
        }
        onImportTasks={handleImportTemplateSchedule}
      />

      {/* CA Final Exam Dates (Papers 1–6) & Auto 1.5-Day Sprint Generator Modal */}
      <FinalExamDatesModal
        isOpen={showFinalExamDatesModal}
        onClose={() => setShowFinalExamDatesModal(false)}
        onSaved={(summaryMsg) => {
          try {
            const rawTasks = localStorage.getItem(getLevelScopedKey('practca_local_tasks'));
            if (rawTasks) {
              const parsed = JSON.parse(rawTasks);
              if (Array.isArray(parsed)) setTasks(parsed);
            }
            const rawCp = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints'));
            if (rawCp) {
              const parsedCp = JSON.parse(rawCp);
              if (Array.isArray(parsedCp)) setRoadmapCheckpoints(parsedCp);
            }
          } catch {}
          setAutoBatchBannerMsg(summaryMsg);
          setTimeout(() => setAutoBatchBannerMsg(null), 7000);
        }}
      />
    </div>
  );
}
