/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { exportToPdfEngine } from '../utils/pdfExporter';
import {
  SubjectId,
  FOUNDATION_SUBJECT_IDS,
  INTERMEDIATE_SUBJECT_IDS,
  FINAL_SUBJECT_IDS,
  CMA_FOUNDATION_SUBJECT_IDS,
  CMA_INTERMEDIATE_SUBJECT_IDS,
  CMA_FINAL_SUBJECT_IDS,
} from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { CMA_CHAPTERS_MAP } from '../data/cmaSyllabusData';
import {
  CALevel,
  CA_CURRICULUM_LEVELS,
  getSelectedCALevel,
  getLevelForSubject,
  useCALevel
} from '../data/curriculumLevels';
import {
  getLevelSubjectIds,
  getDefaultSubjectForLevel,
  getLevelScopedKey,
  getLevelFirestoreDocId
} from '../utils/levelStorage';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  CheckSquare, 
  Square, 
  Hourglass, 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Settings, 
  Download, 
  Undo2,
  BookmarkCheck,
  Award,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Clock,
  PlusCircle,
  X,
  Edit2,
  GripVertical,
  BarChart3,
  FileText,
  ListTodo,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  MinusCircle,
  MoreHorizontal,
  Check,
  SlidersHorizontal,
  Lock
} from 'lucide-react';
import { MonthlyTimeReportModal } from './MonthlyTimeReportModal';
import { ModalPortal } from './ModalPortal';
import { deleteLinkedLogEverywhere, deduplicateRevisionLogs } from '../utils/logSyncEngine';
import { formatStaticDuration } from '../utils/timeFormat';
import {
  getPostExamLockedSubjectsMap,
  isSubjectLockedAfterFinalExam
} from '../utils/taskCompletionSync';
import {
  resolveNextExamSprintInfo,
  isLmrModeCurrentlyOn,
  syncActiveSubjectFreshLmrBoard,
  applySmartLmrSprintAllocationToStorage
} from './LmrSprintBoard';

interface ScheduledSession {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: SubjectId;
  chapterName: string;
  cycleKey: 'rev1' | 'rev2' | 'rev3' | 'rev1.5';
  notes?: string;
}

const getSystemLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const ALL_KNOWN_SUBJECT_IDS: SubjectId[] = [
  ...FOUNDATION_SUBJECT_IDS,
  ...INTERMEDIATE_SUBJECT_IDS,
  ...FINAL_SUBJECT_IDS,
  ...CMA_FOUNDATION_SUBJECT_IDS,
  ...CMA_INTERMEDIATE_SUBJECT_IDS,
  ...CMA_FINAL_SUBJECT_IDS,
];

export const SUBJECT_CHAPTERS: Record<SubjectId, string[]> = {
  // CA Foundation (4 Papers)
  Accounts: CA_CURRICULUM_LEVELS.foundation.subjects.find(s => s.code === 'Accounts')?.chapters || [],
  Law: CA_CURRICULUM_LEVELS.foundation.subjects.find(s => s.code === 'Law')?.chapters || [],
  MathStats: CA_CURRICULUM_LEVELS.foundation.subjects.find(s => s.code === 'MathStats')?.chapters || [],
  Econ: CA_CURRICULUM_LEVELS.foundation.subjects.find(s => s.code === 'Econ')?.chapters || [],
  // CA Intermediate (6 Papers)
  AdvAcc: CA_CURRICULUM_LEVELS.intermediate.subjects.find(s => s.code === 'AdvAcc')?.chapters || [],
  CorpLaw: CA_CURRICULUM_LEVELS.intermediate.subjects.find(s => s.code === 'CorpLaw')?.chapters || [],
  Tax: CA_CURRICULUM_LEVELS.intermediate.subjects.find(s => s.code === 'Tax')?.chapters || [],
  Cost: CA_CURRICULUM_LEVELS.intermediate.subjects.find(s => s.code === 'Cost')?.chapters || [],
  AuditInter: CA_CURRICULUM_LEVELS.intermediate.subjects.find(s => s.code === 'AuditInter')?.chapters || [],
  FMSM: CA_CURRICULUM_LEVELS.intermediate.subjects.find(s => s.code === 'FMSM')?.chapters || [],
  // CA Final (6 Papers)
  AFM: [
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
  FR: [
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
  Audit: [
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
    'Financial Reporting',
    'Advanced Financial Management',
    'Auditing',
    'Direct Taxes',
    'Indirect Taxes',
    'Corporate & Economic Laws',
    'SCMPE',
    'Case Scenarios'
  ],
  ...CMA_CHAPTERS_MAP,
};

export const getCanonicalChapterKey = (subId: string, chapterKey: string): string => {
  if (!chapterKey) return chapterKey;
  const trimmed = chapterKey.trim();
  const normSub = ALL_KNOWN_SUBJECT_IDS.find(s => s.toUpperCase() === (subId || '').toUpperCase()) as SubjectId;

  // Clean tags: [FR], [AFM], [Accounts], [CMAInterLaw], etc., and common task prefixes/suffixes
  const cleanTrimmed = trimmed
    .replace(/^\[(?:AFM|FR|AUDIT|DT|IDT|IBS|ACCOUNTS|LAW|MATHSTATS|ECON|ADVACC|CORPLAW|TAX|COST|AUDITINTER|FMSM|CMA[A-Z0-9]+)\]\s*/i, '')
    .replace(/^(?:STUDY|REVISE|READ|PRACTICE|DO)\s*[:\-–]?\s*/i, '')
    .replace(/\s+(?:PRACTICE|QUESTIONS|REVISION|TEST|SESSION|PREP)$/i, '')
    .trim();

  // 0. Exact official chapter name match takes highest priority so distinct chapters of the same subject
  // (e.g., 'Refunds' vs 'Customs Refunds', or 'Risk Management' vs 'Interest Rate Risk Management') never collide
  if (normSub && SUBJECT_CHAPTERS[normSub]) {
    const officialList = SUBJECT_CHAPTERS[normSub];
    const exactRaw = officialList.find(ch => ch.toLowerCase() === trimmed.toLowerCase());
    if (exactRaw) return exactRaw;
    const exactClean = officialList.find(ch => ch.toLowerCase() === cleanTrimmed.toLowerCase());
    if (exactClean) return exactClean;
  }

  if (normSub === 'FR') {
    const frChapters = SUBJECT_CHAPTERS['FR'] || [];
    // 1. Direct Ind AS number matching (require explicit Ind AS / AS prefix or exact bare number)
    const indAsMatch = cleanTrimmed.match(/\b(?:IND\s*AS|IND-AS|AS)\s*(\d{1,3})\b/i) || cleanTrimmed.match(/^(\d{1,3})$/);
    if (indAsMatch) {
      const num = indAsMatch[1];
      const found = frChapters.find(ch => {
        const m = ch.match(/\b(?:IND\s*AS|IND-AS|AS)\s*(\d{1,3})\b/i);
        return m && m[1] === num;
      });
      if (found) return found;
    }
    if (/financial instruments/i.test(cleanTrimmed)) return 'Financial Instruments';
    if (/business combination/i.test(cleanTrimmed)) return 'Ind AS 103 Business Combination';
    if (/consolidation/i.test(cleanTrimmed)) return 'Consolidation';
    if (/jv|associates/i.test(cleanTrimmed)) return 'JV & Associates';
    if (/analysis of fs/i.test(cleanTrimmed)) return 'Analysis of FS';
    if (/conceptual framework/i.test(cleanTrimmed)) return 'Conceptual Framework';
  }

  if (normSub === 'AFM') {
    if (/capital budgeting/i.test(cleanTrimmed)) return 'Advanced Capital Budgeting Decisions';
    if (/forex|foreign exchange/i.test(cleanTrimmed)) return 'Foreign Exchange Exposure and Risk Management';
    if (/portfolio/i.test(cleanTrimmed)) return 'Portfolio Management';
    if (/security valuation/i.test(cleanTrimmed)) return 'Security Valuation';
    if (/security analysis/i.test(cleanTrimmed)) return 'Security Analysis';
    if (/derivative/i.test(cleanTrimmed)) return 'Derivatives Analysis and Valuation';
    if (/mutual fund/i.test(cleanTrimmed)) return 'Mutual Funds';
    if (/business valuation/i.test(cleanTrimmed)) return 'Business Valuation';
    if (/merger|acquisition|corporate restructuring/i.test(cleanTrimmed)) return 'Mergers, Acquisitions and Corporate Restructuring';
    if (/interest rate/i.test(cleanTrimmed)) return 'Interest Rate Risk Management';
    if (/international financial/i.test(cleanTrimmed)) return 'International Financial Management';
    if (/startup/i.test(cleanTrimmed)) return 'Startup Finance';
    if (/securitiz/i.test(cleanTrimmed)) return 'Securitization';
    if (/risk management/i.test(cleanTrimmed)) return 'Risk Management';
    if (/financial policy/i.test(cleanTrimmed)) return 'Financial Policy and Corporate Strategy';
  }

  if (normSub === 'DT') {
    if (/basic concepts/i.test(trimmed)) return 'Basic Concepts';
    if (/exempt income|incomes which do not form part/i.test(trimmed)) return 'Incomes which do not form part of Total Income';
    if (/pgbp|profits and gains/i.test(trimmed)) return 'Profits and Gains of Business or Profession';
    if (/capital gains/i.test(trimmed)) return 'Capital Gains';
    if (/other sources|ifos/i.test(trimmed)) return 'Income from Other Sources';
    if (/other persons|clubbing/i.test(trimmed)) return 'Income of Other Persons included in Assessee\'s Total Income';
    if (/set.?off|carry forward|aggregation/i.test(trimmed)) return 'Aggregation of Income, Set Off or Carry Forward of Losses';
    if (/deductions from gross|chapter vi-a/i.test(trimmed)) return 'Deductions from Gross Total Income';
    if (/various entities|miscellaneous entities|partnership|corporate entities/i.test(trimmed)) return 'Assessment of Various Entities';
    if (/trusts|institutions|political parties/i.test(trimmed)) return 'Assessment of Trusts and Institutions, Political Parties and Other Special Entities';
    if (/tax planning|tax avoidance|gaar/i.test(trimmed)) return 'Tax Planning, Tax Avoidance and Tax Evasion';
    if (/digital transactions|equalisation/i.test(trimmed)) return 'Taxation of Digital Transactions';
    if (/deduction.*collection|tds|tcs|recovery of tax|advance tax/i.test(trimmed)) return 'Deduction, Collection and Recovery of Tax';
    if (/income tax authorities/i.test(trimmed)) return 'Income Tax Authorities';
    if (/assessment procedure/i.test(trimmed)) return 'Assessment Procedure';
    if (/appeals and revision|settlement of cases/i.test(trimmed)) return 'Appeals and Revision';
    if (/dispute resolution/i.test(trimmed)) return 'Dispute Resolution';
    if (/miscellaneous provisions/i.test(trimmed)) return 'Miscellaneous Provisions';
    if (/unethical tax practices|penalties.*offences/i.test(trimmed)) return 'Provisions to Counteract Unethical Tax Practices';
    if (/tax audit/i.test(trimmed)) return 'Tax Audit and Ethical Compliances';
    if (/non.?resident/i.test(trimmed)) return 'Non Resident Taxation';
    if (/double taxation relief|dtaa/i.test(trimmed)) return 'Double Taxation Relief';
    if (/advance ruling/i.test(trimmed)) return 'Advance Rulings';
    if (/transfer pricing/i.test(trimmed)) return 'Transfer Pricing';
    if (/beps/i.test(trimmed)) return 'Fundamentals Of Beps';
    if (/tax treaties/i.test(trimmed)) return 'Application And Interpretation Of Tax Treaties';
    if (/model tax convention/i.test(trimmed)) return 'Overview Of Model Tax Conventions';
    if (/latest developments/i.test(trimmed)) return 'Latest Developments In International Taxation';
  }
  if (normSub === 'IDT') {
    if (trimmed === 'Customs Refund' || trimmed === 'Customs refund') return 'Customs Refunds';
    if (/supply under gst.*reverse charge/i.test(trimmed)) return 'Supply under GST';
    if (/place.*time.*valuation/i.test(trimmed)) return 'Place of Supply';
    if (/input tax credit.*apportionment/i.test(trimmed)) return 'Input Tax Credit';
    if (/registration.*tax invoice.*credit note/i.test(trimmed)) return 'Registration';
    if (/e-way bill.*accounts.*records/i.test(trimmed)) return 'Accounts and Records; E-way Bill';
    if (/payment of taxes.*electronic ledgers/i.test(trimmed)) return 'Payment of Tax';
    if (/returns.*assessment.*audit/i.test(trimmed)) return 'Returns';
    if (/gst refund.*export of services/i.test(trimmed)) return 'Refunds';
    if (/inspection.*search.*seizure/i.test(trimmed)) return 'Inspection, Search, Seizure and Arrest';
    if (/demand assessments.*recovery.*penalties/i.test(trimmed)) return 'Demands and Recovery';
    if (/appeals.*revisionary.*advance ruling/i.test(trimmed)) return 'Appeals and Revision';
    if (/customs importation.*warehousing.*valuation/i.test(trimmed)) return 'Importation and Exportation of Goods';
    if (/customs duty rates.*exemptions.*foreign trade/i.test(trimmed)) return 'Levy of and Exemptions from Customs Duty';
  }
  if (normSub === 'Audit') {
    if (/quality control/i.test(trimmed)) return 'Quality Control';
    if (/general auditing principles/i.test(trimmed)) return 'General Auditing Principles and Auditors Responsibilities';
    if (/audit planning/i.test(trimmed) || /audit strategy/i.test(trimmed) || /planning.*execution/i.test(trimmed)) return 'Audit Planning, Strategy and Execution';
    if (/materiality/i.test(trimmed) || /risk assessment/i.test(trimmed)) return 'Materiality, Risk Assessment and Internal Control';
    if (/audit evidence/i.test(trimmed)) return 'Audit Evidence';
    if (/completion/i.test(trimmed)) return 'Completion and Review';
    if (/^reporting$/i.test(trimmed) || /caro/i.test(trimmed) || /reporting frameworks/i.test(trimmed)) return 'Reporting';
    if (/speciali[sz]ed/i.test(trimmed)) return 'Specialised Areas';
    if (/related services/i.test(trimmed)) return 'Related Services';
    if (/review of financial/i.test(trimmed)) return 'Review of Financial Information';
    if (/prospective/i.test(trimmed)) return 'Prospective Financial Information and Other Assurance Services';
    if (!/digital\s*study\s*block/i.test(trimmed) && (/digital\s*auditing|automated/i.test(trimmed) || /^digital$/i.test(cleanTrimmed))) return 'Digital Auditing & Assurance';
    if (/group audit/i.test(trimmed)) return 'Group Audits';
    if (/bank|nbfc/i.test(trimmed)) return 'Special Features of Audit of Banks & Non-Banking Financial Companies';
    if (/public sector|psu|insurance/i.test(trimmed)) return 'Overview of Audit of Public Sector Undertakings';
    if (/internal audit/i.test(trimmed)) return 'Internal Audit';
    if (/due diligence|forensic/i.test(trimmed)) return 'Due Diligence, Investigation & Forensic Audit';
    if (/sustainable|esg|sdg/i.test(trimmed)) return 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance';
    if (/ethics/i.test(trimmed)) return 'Professional Ethics & Liabilities of Auditors';
  }
  if (normSub === 'IBS') {
    if (/financial reporting|\bfr\b/i.test(cleanTrimmed)) return 'Financial Reporting';
    if (/advanced financial management|\bafm\b|valuation|mergers/i.test(cleanTrimmed)) return 'Advanced Financial Management';
    if (/auditing|\baudit\b/i.test(cleanTrimmed)) return 'Auditing';
    if (/direct tax|\bdt\b|international tax/i.test(cleanTrimmed)) return 'Direct Taxes';
    if (/indirect tax|\bidt\b|gst|customs|ftp/i.test(cleanTrimmed)) return 'Indirect Taxes';
    if (/corporate.*economic.*law|fema|insolvency|\blaw\b/i.test(cleanTrimmed)) return 'Corporate & Economic Laws';
    if (/scmpe|strategic cost/i.test(cleanTrimmed)) return 'SCMPE';
    if (/case scenario|case study|multi-?disciplinary/i.test(cleanTrimmed)) return 'Case Scenarios';
  }
  // Generic fallback: match against official SUBJECT_CHAPTERS list case-insensitively
  if (normSub && SUBJECT_CHAPTERS[normSub]) {
    const list = SUBJECT_CHAPTERS[normSub];
    const directMatch = list.find(ch => ch.toLowerCase() === trimmed.toLowerCase());
    if (directMatch) return directMatch;

    const directCleanMatch = list.find(ch => ch.toLowerCase() === cleanTrimmed.toLowerCase());
    if (directCleanMatch) return directCleanMatch;

    // Partial inclusion match — sort longest chapter names first and guard short ambiguous names
    const cleanLower = cleanTrimmed.toLowerCase();
    const ambiguousShort = new Set(['refunds', 'risk management', 'reporting', 'returns', 'registration']);
    const sortedList = [...list].sort((a, b) => b.length - a.length);
    const partialMatch = sortedList.find(ch => {
      const chLow = ch.toLowerCase();
      if (chLow === cleanLower) return true;
      if (ambiguousShort.has(chLow) || ambiguousShort.has(cleanLower)) return false;
      return chLow.includes(cleanLower) || (cleanLower.length > 5 && cleanLower.includes(chLow));
    });
    if (partialMatch) return partialMatch;
  }
  return chapterKey;
};

export interface ChapterRevisionState {
  completed: boolean;
  hours: string;
  completedAt?: string;
  isManualDateOverride?: boolean;
  skipped?: boolean;
  manualSkip?: boolean;
  plannedMinutes?: number;
  partiallyDone?: boolean;
  statusTag?: 'completed' | 'partially_done' | 'skipped';
}

export interface RevisionPlannerSubjectData {
  subjectId: SubjectId;
  revisionsCount: number;
  chapters: Record<string, Record<string, ChapterRevisionState>>;
}

interface RevisionPlannerProps {
  activeSubjectIdProp?: SubjectId;
  onActiveSubjectChangeProp?: (id: SubjectId) => void;
  onGoToClock?: () => void;
  onGoToTasks?: () => void;
}

export const toIsoLocalDate = (dateOrTimestamp?: string | null): string | null => {
  if (!dateOrTimestamp) return null;
  const trimmed = String(dateOrTimestamp).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (e) {}
  return null;
};

/**
 * Extracts the latest study log date (YYYY-MM-DD) for a given (subjectId, chapterName, revKey).
 * Checks `practca_revision_planner_logs` first, then `practca_focus_sessions` as secondary source,
 * and falls back to `fallbackDateStr` or today's date only if no logs exist.
 */
export const resolveLatestLogCompletionDate = (
  subjectId: SubjectId | string,
  chapterName: string,
  revKey: string,
  logsOverride?: any[],
  fallbackDateStr?: string
): string => {
  const normSub = String(subjectId || '').trim().toUpperCase();
  const canonicalChapter = getCanonicalChapterKey(normSub, chapterName);
  const subLevel = getLevelForSubject(normSub) || getSelectedCALevel();

  // 1. Primary source: Revision Planner logs (`practca_revision_planner_logs`)
  let revLogs: any[] = [];
  if (Array.isArray(logsOverride)) {
    revLogs = logsOverride;
  } else {
    try {
      const raw = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs', subLevel));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) revLogs = parsed;
      }
    } catch (e) {}
  }

  const matchingRevLogs = revLogs.filter(l => {
    if (!l || String(l.subjectId || '').trim().toUpperCase() !== normSub) return false;
    const logCanon = getCanonicalChapterKey(normSub, l.chapterName || '');
    if (logCanon !== canonicalChapter) return false;
    const lKey = String(l.revKey || l.revisionNumber || '').trim();
    return lKey === revKey;
  });

  if (matchingRevLogs.length > 0) {
    const sorted = [...matchingRevLogs].sort((a, b) => {
      const tA = new Date(a.timestamp || 0).getTime() || 0;
      const tB = new Date(b.timestamp || 0).getTime() || 0;
      return tB - tA;
    });
    const latestIso = toIsoLocalDate(sorted[0]?.timestamp);
    if (latestIso) return latestIso;
  }

  // 2. Secondary source: Focus Sessions (`practca_focus_sessions`)
  try {
    const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', subLevel));
    if (rawFocus) {
      const focusList = JSON.parse(rawFocus);
      if (Array.isArray(focusList)) {
        const matchingFocus = focusList.filter(s => {
          if (!s || (s.sessionType && s.sessionType !== 'work')) return false;
          if (String(s.subjectId || '').trim().toUpperCase() !== normSub) return false;
          const sChap = getCanonicalChapterKey(normSub, s.chapterName || s.description || '');
          if (sChap !== canonicalChapter) return false;
          if (s.revKey) return s.revKey === revKey;
          if (revKey === 'baseline' && s.relevance === 'General') return true;
          if (revKey === 'rev1.5' && s.relevance === 'Final Revision') return true;
          if (revKey === 'rev1' && (!s.relevance || s.relevance === 'Revision')) return true;
          return false;
        });
        if (matchingFocus.length > 0) {
          const sortedFocus = [...matchingFocus].sort((a, b) => {
            const tA = new Date(a.timestamp || 0).getTime() || 0;
            const tB = new Date(b.timestamp || 0).getTime() || 0;
            return tB - tA;
          });
          const latestFocusIso = toIsoLocalDate(sortedFocus[0]?.timestamp);
          if (latestFocusIso) return latestFocusIso;
        }
      }
    }
  } catch (e) {}

  return toIsoLocalDate(fallbackDateStr) || getSystemLocalDateString();
};

export const getSubjectDynamicRevKeys = (revisionsCount: number): string[] => {
  const safeCount = Math.max(1, Math.min(10, Math.round(revisionsCount || 1)));
  return Array.from({ length: safeCount }, (_, idx) => `rev${idx + 1}`);
};

export const getSubjectAllStageKeys = (revisionsCount: number): string[] => {
  return ['baseline', ...getSubjectDynamicRevKeys(revisionsCount), 'rev1.5'];
};

export const getStageVisualMeta = (stageKey: string) => {
  const neutralStageTheme = {
    textColor: 'text-slate-200',
    barBg: 'bg-emerald-500',
    headerBorderBg: 'border-slate-800 bg-slate-900/70 text-slate-200',
    subHeaderColor: 'border-slate-800 text-slate-400',
    pillActive: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    filterStyle: 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200',
    drawerCard: 'border-slate-800 bg-slate-900/40',
    modalBadge: 'bg-slate-800 text-slate-300 border-slate-700',
    pdfColors: { accent: '#10b981', bg: '#f8fafc', border: '#cbd5e1' },
    containerStyle: {
      leftBorder: 'border-l border-l-slate-800/80',
      doneBox: 'border-emerald-500/30 bg-emerald-950/20',
      pendingBox: 'border-slate-800/70 bg-slate-900/30 hover:border-slate-700/80',
      tagText: 'text-slate-400'
    }
  };

  if (stageKey === 'baseline') {
    return {
      key: 'baseline',
      short: 'BL',
      label: 'Baseline',
      headerTitle: 'Baseline',
      statusHeader: 'Status',
      hrsHeader: 'Hrs',
      ...neutralStageTheme
    };
  }

  if (stageKey === 'rev1.5') {
    return {
      key: 'rev1.5',
      short: '1.5D',
      label: '1.5D Boost',
      headerTitle: '1.5D Boost',
      statusHeader: 'Status',
      hrsHeader: 'Hrs',
      ...neutralStageTheme
    };
  }

  const revNum = Math.max(1, parseInt(stageKey.replace(/^rev/i, ''), 10) || 1);
  return {
    key: `rev${revNum}`,
    short: `R${revNum}`,
    label: `Revision ${revNum}`,
    headerTitle: `Revision ${revNum}`,
    statusHeader: `Status`,
    hrsHeader: `Hrs`,
    ...neutralStageTheme
  };
};

/**
 * Computes the whole-subject revision column count (R1..RN, min 1) based on the number of times
 * targets/chapters of that subject are added to non-1.5D Roadmap Milestones, while preserving
 * any higher revision column that already has completed status or study hours/logs.
 */
export const computeSubjectMilestoneRevisionCount = (
  subjectId: SubjectId,
  subjectChaptersState?: Record<string, Record<string, ChapterRevisionState>>,
  logsOverride?: any[]
): number => {
  const officialChapters = SUBJECT_CHAPTERS[subjectId] || [];
  const subLevel = getLevelForSubject(subjectId) || getSelectedCALevel();
  const chapterMilestoneAppearances: Record<string, number> = {};
  officialChapters.forEach(ch => {
    chapterMilestoneAppearances[ch] = 0;
  });

  // 1. Count chapter appearances across Roadmap Milestones (`practca_roadmap_user_checkpoints`)
  try {
    const rawCp =
      localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints', subLevel)) ||
      localStorage.getItem(getLevelScopedKey('practca_roadmap_checkpoints_v3', subLevel));
    if (rawCp) {
      const checkpoints = JSON.parse(rawCp);
      if (Array.isArray(checkpoints)) {
        checkpoints.forEach((cp: any) => {
          if (!cp) return;
          const cycleStr = String(cp.revisionCycle || '');
          const titleStr = String(cp.customTitle || '');
          // Ignore Mock Exam, Baseline Study, and 1.5-Day Final Sprint milestones (since Baseline & 1.5D have their own fixed columns)
          if (
            /mock\s*exam/i.test(cycleStr) ||
            /baseline/i.test(cycleStr) ||
            /\b(1\.5|final\s*sprint|final\s*boost|final\s*revision)\b/i.test(cycleStr) ||
            /\b(1\.5\s*day|1\.5d|final\s*boost)\b/i.test(titleStr)
          ) {
            return;
          }

          const cpSub = String(cp.subjectId || '').trim().toUpperCase();
          if (cpSub === subjectId.toUpperCase()) {
            const selected = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
              ? cp.selectedChapters
              : officialChapters;
            const seenInThisMilestone = new Set<string>();
            selected.forEach((rawCh: string) => {
              const canon = getCanonicalChapterKey(subjectId, rawCh);
              if (officialChapters.includes(canon)) {
                seenInThisMilestone.add(canon);
              }
            });
            if (seenInThisMilestone.size === 0) {
              officialChapters.forEach(ch => {
                chapterMilestoneAppearances[ch] = (chapterMilestoneAppearances[ch] || 0) + 1;
              });
            } else {
              seenInThisMilestone.forEach(ch => {
                chapterMilestoneAppearances[ch] = (chapterMilestoneAppearances[ch] || 0) + 1;
              });
            }
          } else if (cpSub === 'CUSTOM' && Array.isArray(cp.selectedChapters)) {
            const seenInCustom = new Set<string>();
            cp.selectedChapters.forEach((rawCh: string) => {
              const bMatch = String(rawCh).match(/^\[\s*(AFM|FR|Audit|DT|IDT|IBS|Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|CMA[A-Za-z0-9]+)\s*\]/i);
              if (bMatch && bMatch[1].toUpperCase() === subjectId.toUpperCase()) {
                const canon = getCanonicalChapterKey(subjectId, rawCh);
                if (officialChapters.includes(canon)) {
                  seenInCustom.add(canon);
                }
              }
            });
            seenInCustom.forEach(ch => {
              chapterMilestoneAppearances[ch] = (chapterMilestoneAppearances[ch] || 0) + 1;
            });
          }
        });
      }
    }
  } catch (e) {}

  // 2. Also check tasks added to milestones in `practca_local_tasks` / `practca_cached_cloud_tasks`
  let maxFromMilestoneTasks = 0;
  try {
    const rawTasks =
      localStorage.getItem(getLevelScopedKey('practca_local_tasks', subLevel)) ||
      localStorage.getItem(getLevelScopedKey('practca_cached_cloud_tasks', subLevel));
    if (rawTasks) {
      const taskList = JSON.parse(rawTasks);
      if (Array.isArray(taskList)) {
        const chapterDistinctMilestones: Record<string, Set<string>> = {};
        taskList.forEach((t: any) => {
          if (!t) return;
          let tSub = String(t.subjectCode || '').trim().toUpperCase();
          if (!tSub && typeof t.title === 'string') {
            const m = t.title.match(/\[\s*(AFM|FR|Audit|DT|IDT|IBS|Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|CMA[A-Za-z0-9]+)\s*\]/i);
            if (m) tSub = m[1].toUpperCase();
          }
          if (tSub !== subjectId.toUpperCase()) return;

          // Check explicit revKey on task (e.g. rev2, rev3, rev4)
          if (typeof t.revKey === 'string' && /^rev(\d+)$/i.test(t.revKey)) {
            const rNum = parseInt(t.revKey.replace(/^rev/i, ''), 10);
            if (!isNaN(rNum) && rNum > maxFromMilestoneTasks) {
              maxFromMilestoneTasks = rNum;
            }
          }

          // Check milestoneId linkage
          const msId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
          if (msId && t.relevance !== 'General' && t.relevance !== 'Final Revision' && t.revKey !== 'baseline' && t.revKey !== 'rev1.5') {
            const rawChap = t.chapterName || t.cleanTitle || t.title || '';
            const canon = getCanonicalChapterKey(subjectId, rawChap);
            if (officialChapters.includes(canon)) {
              if (!chapterDistinctMilestones[canon]) chapterDistinctMilestones[canon] = new Set();
              chapterDistinctMilestones[canon].add(msId);
            }
          }
        });
        Object.values(chapterDistinctMilestones).forEach(set => {
          if (set.size > maxFromMilestoneTasks) {
            maxFromMilestoneTasks = set.size;
          }
        });
      }
    }
  } catch (e) {}

  // 3. Preserve any higher revision cycle (revN) that already has actual completion or logged hours
  let maxPopulatedRevNum = 0;
  if (subjectChaptersState) {
    Object.values(subjectChaptersState).forEach(chapCycles => {
      if (!chapCycles || typeof chapCycles !== 'object') return;
      Object.entries(chapCycles).forEach(([rk, st]) => {
        const m = rk.match(/^rev(\d+)$/i);
        if (m && st && (st.completed || (parseFloat(st.hours || '0') || 0) > 0)) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > maxPopulatedRevNum) {
            maxPopulatedRevNum = n;
          }
        }
      });
    });
  }

  let logsToCheck: any[] = [];
  if (Array.isArray(logsOverride)) {
    logsToCheck = logsOverride;
  } else {
    try {
      const rawLogs = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs', subLevel));
      if (rawLogs) {
        const parsed = JSON.parse(rawLogs);
        if (Array.isArray(parsed)) logsToCheck = parsed;
      }
    } catch (e) {}
  }

  logsToCheck.forEach(l => {
    if (!l || String(l.subjectId || '').toUpperCase() !== subjectId.toUpperCase()) return;
    const m = String(l.revKey || '').match(/^rev(\d+)$/i);
    if (m && (l.durationMinutes || 0) > 0) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n > maxPopulatedRevNum) {
        maxPopulatedRevNum = n;
      }
    }
  });

  const maxFromCheckpoints = Math.max(0, ...Object.values(chapterMilestoneAppearances));
  
  // Check if an explicit revision count was set via user delete/reset
  let explicitCount: number | null = null;
  try {
    const rawExp = typeof window !== 'undefined' ? localStorage.getItem(getLevelScopedKey(`practca_revision_count_${subjectId}`, subLevel)) : null;
    if (rawExp) {
      const parsed = parseInt(rawExp, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        explicitCount = parsed;
      }
    }
  } catch (e) {}

  if (explicitCount !== null) {
    return Math.min(10, Math.max(explicitCount, maxPopulatedRevNum));
  }

  const computed = Math.max(1, maxFromCheckpoints, maxFromMilestoneTasks, maxPopulatedRevNum);
  return Math.min(10, computed);
};

export default function RevisionPlanner({ activeSubjectIdProp, onActiveSubjectChangeProp, onGoToClock, onGoToTasks }: RevisionPlannerProps = {}) {
  const caLevel = useCALevel();
  const levelSubjects = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);
  const levelShortName = CA_CURRICULUM_LEVELS[caLevel]?.shortName || 'CA Final';

  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId>(() => {
    const curLevel = getSelectedCALevel();
    const curSubs = getLevelSubjectIds(curLevel);
    if (activeSubjectIdProp && curSubs.includes(activeSubjectIdProp)) return activeSubjectIdProp;
    const stored = localStorage.getItem(getLevelScopedKey('practca_last_selected_subject', curLevel)) as SubjectId;
    if (stored && curSubs.includes(stored)) return stored;
    return getDefaultSubjectForLevel(curLevel);
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Keep activeSubjectId in sync with activeSubjectIdProp or CA level switches
  useEffect(() => {
    if (activeSubjectIdProp && levelSubjects.includes(activeSubjectIdProp) && activeSubjectIdProp !== activeSubjectId) {
      setActiveSubjectId(activeSubjectIdProp);
      return;
    }
    if (!levelSubjects.includes(activeSubjectId)) {
      const stored = localStorage.getItem(getLevelScopedKey('practca_last_selected_subject', caLevel)) as SubjectId;
      const fallback = (stored && levelSubjects.includes(stored)) ? stored : getDefaultSubjectForLevel(caLevel);
      setActiveSubjectId(fallback);
      if (onActiveSubjectChangeProp) {
        onActiveSubjectChangeProp(fallback);
      }
    }
  }, [activeSubjectIdProp, caLevel, levelSubjects]);

  // Handle active subject change helper
  const handleActiveSubjectChange = (newSubId: SubjectId) => {
    setActiveSubjectId(newSubId);
    localStorage.setItem(getLevelScopedKey('practca_last_selected_subject', caLevel), newSubId);
    if (onActiveSubjectChangeProp) {
      onActiveSubjectChangeProp(newSubId);
    }
  };

  const createEmptySubjectState = (subjectId: SubjectId, revCount: number = 3) => {
    const empty: Record<string, Record<string, ChapterRevisionState>> = {};
    const chaptersList = SUBJECT_CHAPTERS[subjectId] || [];
    const stageKeys = getSubjectAllStageKeys(Math.max(3, revCount));
    chaptersList.forEach(chapter => {
      const chObj: Record<string, ChapterRevisionState> = {};
      stageKeys.forEach(k => {
        chObj[k] = { completed: false, hours: '' };
      });
      empty[chapter] = chObj;
    });
    return empty;
  };

  const createEmptyAllSubjectsState = () => {
    const all = {} as Record<SubjectId, Record<string, Record<string, ChapterRevisionState>>>;
    ALL_KNOWN_SUBJECT_IDS.forEach(subId => {
      all[subId] = createEmptySubjectState(subId);
    });
    return all;
  };

  const [chaptersState, setChaptersState] = useState<Record<SubjectId, Record<string, Record<string, ChapterRevisionState>>>>(() => {
    return createEmptyAllSubjectsState();
  });

  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(getSystemLocalDateString());

  // Form states
  const [formSubject, setFormSubject] = useState<SubjectId>(() => getDefaultSubjectForLevel(getSelectedCALevel()));
  const [formChapter, setFormChapter] = useState<string>(() => (SUBJECT_CHAPTERS[getDefaultSubjectForLevel(getSelectedCALevel())] || [])[0] || '');
  const [formCycle, setFormCycle] = useState<'rev1' | 'rev2' | 'rev3' | 'rev1.5'>('rev1');
  const [formNotes, setFormNotes] = useState<string>('');

  // Sync form subject and initial chapter select options when activeSubjectId changes
  useEffect(() => {
    setFormSubject(activeSubjectId);
    const list = SUBJECT_CHAPTERS[activeSubjectId] || [];
    setFormChapter(list[0] || '');
  }, [activeSubjectId]);

  // Extended features: linked logs and confirmation dialogs
  interface RevisionLog {
    id: string;
    subjectId: SubjectId;
    chapterName: string;
    revKey: string;
    durationMinutes: number;
    timestamp: string;
    taskTitle?: string;
  }

  const [revisionLogs, setRevisionLogs] = useState<RevisionLog[]>([]);
  const [selectedChapterForLogs, setSelectedChapterForLogs] = useState<string | null>(null);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [logToDelete, setLogToDelete] = useState<RevisionLog | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);
  
  // Drag and drop state for logs
  const [draggedLogId, setDraggedLogId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Restriction modal state
  const [showRestrictionModal, setShowRestrictionModal] = useState<boolean>(false);
  const [restrictionInfo, setRestrictionInfo] = useState<{ chapter: string; revKey: string; revLabel: string } | null>(null);
  
  // Real-time tab sync and expand/collapse states
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const isInternalUpdateRef = useRef<boolean>(false);
  const hasInitialLoadedRef = useRef<boolean>(false);

  // Chapter & Revision Cycle filter and isolated cell update indicator
  const [selectedRevisionFilter, setSelectedRevisionFilter] = useState<string>('ALL');
  const [chapterSearchTerm, setChapterSearchTerm] = useState<string>('');
  const [lastUpdatedMilestoneCell, setLastUpdatedMilestoneCell] = useState<{
    subjectId: SubjectId;
    chapter: string;
    chapterIndex: number;
    revKey: string;
    completed: boolean;
  } | null>(null);

  // Interactive status menu and header popover states
  const [activeCellMenu, setActiveCellMenu] = useState<{ chapter: string; revKey: string } | null>(null);
  const [openHeaderMenuKey, setOpenHeaderMenuKey] = useState<string | null>(null);

  // Column filters & Sort config
  const [columnFilters, setColumnFilters] = useState<Record<string, 'all' | 'completed' | 'partially_done' | 'skipped' | 'pending' | 'has_hours'>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: 'default', direction: 'asc' });

  // Confirmation Dialog state for reset & delete
  interface ActionConfirmModal {
    isOpen: boolean;
    type: 'reset_column' | 'delete_revision';
    title: string;
    description: string;
    scopeText?: string;
    stageKey?: string;
    stageLabel?: string;
    revNumberToDelete?: number;
    targetChapters: string[];
    statusTag?: 'completed' | 'partially_done' | 'skipped' | 'none';
  }
  const [actionConfirmModal, setActionConfirmModal] = useState<ActionConfirmModal | null>(null);

  // Management prompt dialog states
  const [showManageModal, setShowManageModal] = useState<'reset' | 'delete' | null>(null);
  const [manageSelectedStage, setManageSelectedStage] = useState<string>('baseline');
  const [manageScope, setManageScope] = useState<'selected' | 'all'>('all');
  const [manageRevNumber, setManageRevNumber] = useState<number>(1);
  const [manageStatusTag, setManageStatusTag] = useState<'completed' | 'partially_done' | 'skipped' | 'none'>('completed');

  // Dismiss menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-popover-menu="true"]')) {
        setOpenHeaderMenuKey(null);
        setActiveCellMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute dynamic whole-subject revision counts (R1..RN) for all subjects based on milestone appearances
  const subjectRevisionsCountMap = useMemo<Record<SubjectId, number>>(() => {
    const map = {} as Record<SubjectId, number>;
    ALL_KNOWN_SUBJECT_IDS.forEach(sub => {
      map[sub] = computeSubjectMilestoneRevisionCount(sub, chaptersState[sub], revisionLogs);
    });
    return map;
  }, [chaptersState, revisionLogs, reloadTrigger, caLevel]);

  const activeRevisionsCount = subjectRevisionsCountMap[activeSubjectId] || 1;
  const activeDynamicRevKeys = useMemo(() => getSubjectDynamicRevKeys(activeRevisionsCount), [activeRevisionsCount]);
  const activeAllStageKeys = useMemo(() => getSubjectAllStageKeys(activeRevisionsCount), [activeRevisionsCount]);

  // Post-Exam & 1.5-Day Sprint Milestone Lock State per subject
  const postExamLockMap = useMemo(() => {
    return getPostExamLockedSubjectsMap(new Date(), caLevel);
  }, [reloadTrigger, chaptersState, revisionLogs, caLevel]);

  const activeSubjectLockInfo = postExamLockMap[activeSubjectId];
  const isActiveSubjectLocked = Boolean(activeSubjectLockInfo?.isLocked);

  // Reset filters when switching active subject
  useEffect(() => {
    setSelectedRevisionFilter('ALL');
    setChapterSearchTerm('');
    setColumnFilters({});
    setSortConfig({ key: 'default', direction: 'asc' });
    setOpenHeaderMenuKey(null);
    setActiveCellMenu(null);
    setShowManageModal(null);
    setActionConfirmModal(null);
  }, [activeSubjectId]);

  const DEFAULT_SUBJECT_HOURLY_TARGETS: Record<SubjectId, number> = {
    Accounts: 100,
    Law: 80,
    MathStats: 80,
    Econ: 60,
    AdvAcc: 110,
    CorpLaw: 85,
    Tax: 110,
    Cost: 95,
    AuditInter: 80,
    FMSM: 90,
    FR: 120,
    AFM: 100,
    Audit: 80,
    DT: 120,
    IDT: 100,
    IBS: 80,
    CMAFoundLaw: 80,
    CMAFoundAcc: 100,
    CMAFoundMath: 85,
    CMAFoundEcon: 75,
    CMAInterLaw: 85,
    CMAInterFA: 110,
    CMAInterTax: 110,
    CMAInterCost: 100,
    CMAInterOMSM: 85,
    CMAInterCAA: 95,
    CMAInterFMDA: 95,
    CMAInterMA: 95,
    CMAFinalLaw: 85,
    CMAFinalSFM: 105,
    CMAFinalDT: 115,
    CMAFinalSCM: 105,
    CMAFinalCMA: 90,
    CMAFinalCFR: 115,
    CMAFinalIDT: 100,
    CMAFinalSPBV: 95,
  };

  // Report modals & Subject Hourly Targets state
  const [showMonthlyTimeReportModal, setShowMonthlyTimeReportModal] = useState<boolean>(false);
  const [showReportMenuModal, setShowReportMenuModal] = useState<boolean>(false);
  const [subjectHourlyTargets, setSubjectHourlyTargets] = useState<Record<SubjectId, number>>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_subject_hourly_targets', getSelectedCALevel()));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_SUBJECT_HOURLY_TARGETS,
            ...parsed
          };
        }
      }
    } catch (e) {}
    return { ...DEFAULT_SUBJECT_HOURLY_TARGETS };
  });
  const [showSubjectTargetModal, setShowSubjectTargetModal] = useState(false);
  const [tempModalTargets, setTempModalTargets] = useState<Record<SubjectId, number>>(() => subjectHourlyTargets);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_subject_hourly_targets', caLevel));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setSubjectHourlyTargets({ ...DEFAULT_SUBJECT_HOURLY_TARGETS, ...parsed });
          return;
        }
      }
    } catch (e) {}
    setSubjectHourlyTargets({ ...DEFAULT_SUBJECT_HOURLY_TARGETS });
  }, [caLevel]);

  const handleSaveSubjectTargets = (newTargets: Record<SubjectId, number>) => {
    setSubjectHourlyTargets(newTargets);
    try {
      localStorage.setItem(getLevelScopedKey('practca_subject_hourly_targets', caLevel), JSON.stringify(newTargets));
      window.dispatchEvent(new Event('practca_subject_targets_updated'));
    } catch (e) {}
    setShowSubjectTargetModal(false);
  };

  const toInputDateValue = (dateStr?: string | null): string => {
    if (!dateStr) return getSystemLocalDateString();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {}
    return getSystemLocalDateString();
  };

  const formatDisplayDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        return dateObj.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      const dateObj = new Date(dateStr);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (e) {}
    return null;
  };

  // Helper to format log time periods (date and time interval)
  const formatLogTimePeriod = (timestamp: string, durationMinutes: number) => {
    const endTime = new Date(timestamp);
    const startTime = new Date(endTime.getTime() - durationMinutes * 60 * 1000);
    
    const dateStr = endTime.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const startStr = startTime.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const endStr = endTime.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return {
      date: dateStr,
      timeRange: `${startStr} - ${endStr}`
    };
  };

  // Helper to determine latest log ISO date (YYYY-MM-DD) for a chapter & revision/baseline stage
  const getLatestLogIsoDateForRevision = (chapterName: string, revKey: string, subId: SubjectId = activeSubjectId): string | null => {
    const canonical = getCanonicalChapterKey(subId, chapterName);
    const logs = revisionLogs.filter(
      l => l.subjectId === subId && 
           getCanonicalChapterKey(l.subjectId, l.chapterName) === canonical && 
           l.revKey === revKey
    );
    if (logs.length > 0) {
      const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return toIsoLocalDate(sorted[0].timestamp);
    }
    return null;
  };

  // Helper to determine last completion/revision formatted date based on the latest log
  const getLatestLogDateForRevision = (chapterName: string, revKey: string) => {
    const iso = getLatestLogIsoDateForRevision(chapterName, revKey, activeSubjectId);
    return iso ? formatDisplayDate(iso) : null;
  };

  // Listen to cross-tab storage, roadmap checkpoint updates, and local custom sync events to stay 100% updated in real-time
  useEffect(() => {
    const handleSync = () => {
      if (isInternalUpdateRef.current) {
        return;
      }
      setReloadTrigger(prev => prev + 1);
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('practca_revision_update', handleSync);
    window.addEventListener('practca_revision_planner_updated', handleSync);
    window.addEventListener('practca_task_completion_changed', handleSync);
    window.addEventListener('practca_roadmap_checkpoints_updated', handleSync);
    window.addEventListener('practca_roadmap_updated', handleSync);
    window.addEventListener('practca_target_system_synced', handleSync);
    window.addEventListener('practca_exam_date_updated', handleSync);
    window.addEventListener('practca_subject_exam_dates_updated', handleSync);
    window.addEventListener('practca_lmr_mode_changed', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('practca_revision_update', handleSync);
      window.removeEventListener('practca_revision_planner_updated', handleSync);
      window.removeEventListener('practca_task_completion_changed', handleSync);
      window.removeEventListener('practca_roadmap_checkpoints_updated', handleSync);
      window.removeEventListener('practca_roadmap_updated', handleSync);
      window.removeEventListener('practca_target_system_synced', handleSync);
      window.removeEventListener('practca_exam_date_updated', handleSync);
      window.removeEventListener('practca_subject_exam_dates_updated', handleSync);
      window.removeEventListener('practca_lmr_mode_changed', handleSync);
    };
  }, []);

  const dispatchInternalRevisionUpdate = () => {
    isInternalUpdateRef.current = true;
    window.dispatchEvent(new Event('practca_revision_update'));
    window.setTimeout(() => {
      isInternalUpdateRef.current = false;
    }, 50);
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
    });
    return unsubscribe;
  }, []);

  // Helper to deep-clone a chapter's revision & baseline milestone states so no two chapters share references
  const mergeChapterCycleStateIsolated = (
    targetChapObj: Record<string, ChapterRevisionState>,
    incomingChapObj: Record<string, any> | undefined,
    preferIncomingCompletion: boolean
  ) => {
    if (!incomingChapObj || typeof incomingChapObj !== 'object') return;
    const keysToMerge = Array.from(new Set(['baseline', 'rev1', 'rev2', 'rev3', 'rev1.5', ...Object.keys(incomingChapObj)]));
    keysToMerge.forEach(rk => {
      const inc = incomingChapObj[rk];
      if (inc && typeof inc === 'object') {
        const existing = targetChapObj[rk] || { completed: false, hours: '' };
        const incHours = typeof inc.hours === 'string' ? inc.hours : (inc.hours ? String(inc.hours) : '');
        const existingHoursNum = parseFloat(existing.hours || '0') || 0;
        const incHoursNum = parseFloat(incHours || '0') || 0;
        const effectiveHoursNum = incHoursNum >= existingHoursNum && incHours !== '' ? incHoursNum : existingHoursNum;
        const effectiveHoursStr = incHoursNum >= existingHoursNum && incHours !== '' ? incHours : (existing.hours || incHours || '');

        const hasTime = effectiveHoursNum > 0;
        const isSkippedCandidate = Boolean(inc.skipped || existing.skipped);
        const isPartiallyDoneCandidate = Boolean(inc.partiallyDone || existing.partiallyDone || (isSkippedCandidate && hasTime));

        const isCompletedMerged = preferIncomingCompletion ? Boolean(inc.completed) : Boolean(existing.completed || inc.completed);
        const rawStatusTag = inc.statusTag !== undefined ? inc.statusTag : existing.statusTag;
        const resolvedStatusTag = isCompletedMerged
          ? (rawStatusTag || 'completed')
          : (rawStatusTag === 'completed' ? (isPartiallyDoneCandidate ? 'partially_done' : undefined) : (rawStatusTag || undefined));

        targetChapObj[rk] = {
          ...existing,
          ...inc,
          completed: isCompletedMerged,
          hours: (isSkippedCandidate && !hasTime) ? '0' : effectiveHoursStr,
          completedAt: isCompletedMerged ? (inc.completedAt || existing.completedAt) : undefined,
          isManualDateOverride: isCompletedMerged ? Boolean(inc.isManualDateOverride || existing.isManualDateOverride) : false,
          skipped: isSkippedCandidate && !hasTime,
          manualSkip: Boolean((inc.manualSkip ?? existing.manualSkip) && isSkippedCandidate && !hasTime),
          partiallyDone: isPartiallyDoneCandidate,
          statusTag: resolvedStatusTag
        };
      }
    });
  };

  // Fetch / Sync revision data for ALL subjects at once
  useEffect(() => {
    let active = true;
    if (!hasInitialLoadedRef.current) {
      setLoading(true);
    }
    let loadedLogs: RevisionLog[] = [];
    const scopedSessionsKey = getLevelScopedKey('practca_revision_planner_scheduled_sessions', caLevel);
    const scopedLogsKey = getLevelScopedKey('practca_revision_planner_logs', caLevel);

    async function loadAllData() {
      const lmrOn = isLmrModeCurrentlyOn();
      const activeSprintInfo = lmrOn ? resolveNextExamSprintInfo() : null;
      const activeSprintSub = activeSprintInfo ? activeSprintInfo.subjectId : null;
      if (lmrOn && activeSprintSub) {
        const prevInternal = isInternalUpdateRef.current;
        isInternalUpdateRef.current = true;
        try {
          syncActiveSubjectFreshLmrBoard(activeSprintSub, activeSprintInfo?.examDateStr);
        } finally {
          isInternalUpdateRef.current = prevInternal;
        }
      }

      const subjectIds: SubjectId[] = levelSubjects;
      const loadedChapters = createEmptyAllSubjectsState();
      let loadedSessions: ScheduledSession[] = [];

      if (currentUser) {
        try {
          const promises = subjectIds.map(async (subId) => {
            const baseState = createEmptySubjectState(subId);
            const docRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subId, caLevel));
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.chapters) {
                Object.keys(data.chapters).forEach(chapterKey => {
                  const canonicalKey = getCanonicalChapterKey(subId, chapterKey);
                  if (baseState[canonicalKey]) {
                    mergeChapterCycleStateIsolated(baseState[canonicalKey], data.chapters[chapterKey], true);
                  }
                });
              }
            }

            // Merge local storage state if present (local storage is authoritative for fresh LMR rev1.5 state)
            const stored =
              localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subId}`, caLevel)) ||
              (caLevel === 'final' ? localStorage.getItem(`cavault_revision_planner_${subId}`) : null);
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                if (parsed.chapters) {
                  Object.keys(parsed.chapters).forEach(chapterKey => {
                    const canonicalKey = getCanonicalChapterKey(subId, chapterKey);
                    if (baseState[canonicalKey]) {
                      mergeChapterCycleStateIsolated(baseState[canonicalKey], parsed.chapters[chapterKey], true);
                      if (lmrOn && parsed.chapters[chapterKey]?.['rev1.5']) {
                        const localRev15 = parsed.chapters[chapterKey]['rev1.5'];
                        baseState[canonicalKey]['rev1.5'] = {
                          ...localRev15,
                          completed: Boolean(localRev15.completed),
                          hours: localRev15.hours || '',
                          completedAt: localRev15.completedAt,
                          isManualDateOverride: Boolean(localRev15.isManualDateOverride),
                          skipped: Boolean(localRev15.skipped),
                          partiallyDone: Boolean(localRev15.partiallyDone),
                          statusTag: localRev15.statusTag
                        };
                      }
                    }
                  });
                }
              } catch (e) {
                console.error("Error merging local revision planner:", e);
              }
            }

            loadedChapters[subId] = baseState;
          });

          // Also fetch scheduled sessions
          const sessionsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('scheduledSessions', caLevel));
          const sessionsSnap = await getDoc(sessionsRef);
          if (sessionsSnap.exists()) {
            loadedSessions = sessionsSnap.data().sessions || [];
          } else {
            const stored = localStorage.getItem(scopedSessionsKey);
            if (stored) {
              loadedSessions = JSON.parse(stored);
            }
          }

          // Fetch logs (prefer local logs for rev1.5 when LMR is active so cleared logs don't bounce back)
          const storedLocalLogs = localStorage.getItem(scopedLogsKey);
          if (lmrOn && storedLocalLogs) {
            loadedLogs = JSON.parse(storedLocalLogs);
          } else {
            const logsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', caLevel));
            const logsSnap = await getDoc(logsRef);
            if (logsSnap.exists()) {
              loadedLogs = logsSnap.data().logs || [];
            } else if (storedLocalLogs) {
              loadedLogs = JSON.parse(storedLocalLogs);
            }
          }

          await Promise.all(promises);
        } catch (error) {
          console.warn("Firestore sync deferred, using local backup:", error);
          loadedSessions = loadAllLocalData(loadedChapters);
        }
      } else {
        loadedSessions = loadAllLocalData(loadedChapters);
      }

      if (active) {
        const cleanedLogs = deduplicateRevisionLogs(loadedLogs).filter((l: any) => {
          if (!lmrOn || !activeSprintSub) return true;
          const isRev15 = l.revKey === 'rev1.5' || l.revisionNumber === 'rev1.5';
          if (!isRev15) return true;
          return String(l.subjectId || '').toUpperCase() === activeSprintSub.toUpperCase();
        });

        // Auto-reconcile chapter hours with deduplicated logs to heal any historical duplicate or inflated hours
        subjectIds.forEach(subId => {
          const subChapState = loadedChapters[subId];
          if (!subChapState) return;
          const officialList = SUBJECT_CHAPTERS[subId] || [];

          officialList.forEach(canonicalChapter => {
            const chapObj = subChapState[canonicalChapter];
            if (!chapObj) return;

            // If LMR mode is active and this subject is NOT the active LMR subject, its rev1.5 entry must be nil
            if (lmrOn && activeSprintSub && subId !== activeSprintSub) {
              chapObj['rev1.5'] = {
                completed: false,
                hours: ''
              };
            }

            Object.keys(chapObj).forEach(revKey => {
              if (lmrOn && activeSprintSub && subId !== activeSprintSub && revKey === 'rev1.5') {
                return;
              }
              const matchingLogs = cleanedLogs.filter(l => 
                l.subjectId === subId && 
                getCanonicalChapterKey(subId, l.chapterName) === canonicalChapter && 
                (l.revKey === revKey || l.revisionNumber === revKey)
              );
              if (matchingLogs.length > 0) {
                const totalMins = matchingLogs.reduce((acc, l) => acc + (Number(l.durationMinutes) || 0), 0);
                const trueHours = totalMins > 0 ? parseFloat((totalMins / 60).toFixed(2)).toString() : '';
                chapObj[revKey].hours = trueHours;
              }
            });
          });
        });

        if (cleanedLogs.length !== loadedLogs.length) {
          localStorage.setItem(scopedLogsKey, JSON.stringify(cleanedLogs));
        }

        setChaptersState(loadedChapters);
        setScheduledSessions(loadedSessions);
        setRevisionLogs(cleanedLogs);
        hasInitialLoadedRef.current = true;
        setLoading(false);
      }
    }

    function loadAllLocalData(lcChapters: any): ScheduledSession[] {
      const subjectIds: SubjectId[] = levelSubjects;
      let localSessions: ScheduledSession[] = [];
      subjectIds.forEach(subId => {
        try {
          const stored =
            localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subId}`, caLevel)) ||
            (caLevel === 'final' ? localStorage.getItem(`cavault_revision_planner_${subId}`) : null);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.chapters) {
              const baseState = createEmptySubjectState(subId);
              Object.keys(parsed.chapters).forEach(chapterKey => {
                const canonicalKey = getCanonicalChapterKey(subId, chapterKey);
                if (baseState[canonicalKey]) {
                  mergeChapterCycleStateIsolated(baseState[canonicalKey], parsed.chapters[chapterKey], true);
                }
              });
              lcChapters[subId] = baseState;
            }
          }
        } catch (err) {
          console.error("Error reading offline revision planner data:", err);
        }
      });

      try {
        const stored = localStorage.getItem(scopedSessionsKey);
        if (stored) {
          localSessions = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Error reading offline scheduled sessions:", e);
      }

      try {
        const stored = localStorage.getItem(scopedLogsKey);
        if (stored) {
          loadedLogs = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Error reading offline revision planner logs:", e);
      }

      return localSessions;
    }

    loadAllData();

    return () => {
      active = false;
    };
  }, [currentUser, reloadTrigger, caLevel, levelSubjects]);

  // Save changes helper (always updates LocalStorage synchronously AND syncs Firestore when authenticated)
  const saveState = async (
    subjectId: SubjectId,
    updatedChapters: Record<string, Record<string, ChapterRevisionState>>
  ) => {
    const revCountForSub = computeSubjectMilestoneRevisionCount(subjectId, updatedChapters, revisionLogs);
    const subLevel = getLevelForSubject(subjectId) || caLevel;
    try {
      const localKey = getLevelScopedKey(`practca_revision_planner_${subjectId}`, subLevel);
      localStorage.setItem(localKey, JSON.stringify({
        revisionsCount: revCountForSub,
        chapters: updatedChapters,
        updatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.error("Local storage error for revision planner: ", err);
    }

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subjectId, subLevel));
        await setDoc(docRef, {
          subjectId: subjectId,
          caLevel: subLevel,
          revisionsCount: revCountForSub,
          chapters: updatedChapters,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firestore sync error for revision planner: ", err);
      }
    }
  };

  const handleSaveLogs = async (newLogs: RevisionLog[]) => {
    setRevisionLogs(newLogs);
    localStorage.setItem(getLevelScopedKey('practca_revision_planner_logs', caLevel), JSON.stringify(newLogs));
    
    if (currentUser) {
      try {
        const logsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', caLevel));
        await setDoc(logsRef, { caLevel, logs: newLogs, updatedAt: new Date().toISOString() });
      } catch (error) {
        console.error("Error saving revision planner logs to Firestore:", error);
      }
    }
    dispatchInternalRevisionUpdate();
  };

  const handleDeleteLog = async (log: RevisionLog) => {
    if (isSubjectLockedAfterFinalExam(log.subjectId)) return;
    const updatedLogs = revisionLogs.filter(l => l.id !== log.id);
    
    const subjectId = log.subjectId;
    const chapterName = getCanonicalChapterKey(subjectId, log.chapterName);
    const revKey = log.revKey;
    
    const activeSubjectChapters = { ...(chaptersState[subjectId] || {}) };
    const currentChapState = activeSubjectChapters[chapterName]?.[revKey] || { completed: false, hours: '' };
    
    const currentHours = parseFloat(currentChapState.hours || '0') || 0;
    const subtractedHours = log.durationMinutes / 60;
    const newHoursVal = Math.max(0, currentHours - subtractedHours);
    
    const formattedHours = newHoursVal > 0 ? parseFloat(newHoursVal.toFixed(2)).toString() : '';
    const remainingLogsForStage = updatedLogs.filter(
      l => l.subjectId === subjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapterName && l.revKey === revKey
    );
    const stillHasTime = newHoursVal > 0 || remainingLogsForStage.length > 0;
    const shouldStayCompleted = currentChapState.completed && (stillHasTime || Boolean(currentChapState.skipped));

    // Recompute latest log completion date if still completed and not manually overridden
    const nextCompletedAt = shouldStayCompleted
      ? (!currentChapState.isManualDateOverride
          ? resolveLatestLogCompletionDate(subjectId, chapterName, revKey, updatedLogs, currentChapState.completedAt)
          : currentChapState.completedAt)
      : undefined;
    
    const nextChaptersState = {
      ...chaptersState,
      [subjectId]: {
        ...activeSubjectChapters,
        [chapterName]: {
          ...activeSubjectChapters[chapterName],
          [revKey]: {
            ...currentChapState,
            completed: shouldStayCompleted,
            hours: formattedHours,
            completedAt: nextCompletedAt
          }
        }
      }
    };
    
    setChaptersState(nextChaptersState);
    await saveState(subjectId, nextChaptersState[subjectId]);
    await handleSaveLogs(updatedLogs);

    // Bidirectionally delete linked record across Grind Clock, focus sessions & Cloud
    await deleteLinkedLogEverywhere({
      logId: log.id,
      subjectId,
      chapterName,
      durationMinutes: log.durationMinutes,
      timestamp: log.timestamp,
      revKey
    });
    
    setShowDeleteConfirm(false);
    setLogToDelete(null);
    dispatchInternalRevisionUpdate();
  };

  const handleMoveLog = async (
    logId: string, 
    targetRevKey: string, 
    chapterName: string, 
    subjectId: SubjectId
  ) => {
    if (isSubjectLockedAfterFinalExam(subjectId)) return;
    const log = revisionLogs.find(l => l.id === logId);
    if (!log) return;
    if (log.revKey === targetRevKey) return; // Already in target column

    const oldRevKey = log.revKey;
    const updatedLogs = revisionLogs.map(l => l.id === logId ? { ...l, revKey: targetRevKey } : l);

    const activeSubjectChapters = { ...(chaptersState[subjectId] || {}) };
    const oldState = activeSubjectChapters[chapterName]?.[oldRevKey] || { completed: false, hours: '' };
    const newState = activeSubjectChapters[chapterName]?.[targetRevKey] || { completed: false, hours: '' };

    const hoursDelta = log.durationMinutes / 60;

    // Deduct hours from old revision key if hours are set
    const oldHoursNum = Math.max(0, (parseFloat(oldState.hours || '0') || 0) - hoursDelta);
    const formattedOldHours = oldHoursNum > 0 ? parseFloat(oldHoursNum.toFixed(2)).toString() : '';
    const remainingOldLogs = updatedLogs.filter(
      l => l.subjectId === subjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapterName && l.revKey === oldRevKey
    );
    const oldStillHasTime = oldHoursNum > 0 || remainingOldLogs.length > 0;
    const oldShouldStayCompleted = oldState.completed && (oldStillHasTime || Boolean(oldState.skipped));

    // Add hours to target revision key
    const newHoursNum = (parseFloat(newState.hours || '0') || 0) + hoursDelta;
    const formattedNewHours = parseFloat(newHoursNum.toFixed(2)).toString();

    const updatedOldCompletedAt = oldShouldStayCompleted
      ? (!oldState.isManualDateOverride
          ? resolveLatestLogCompletionDate(subjectId, chapterName, oldRevKey, updatedLogs, oldState.completedAt)
          : oldState.completedAt)
      : undefined;

    const updatedNewCompletedAt = (newState.completed && !newState.isManualDateOverride)
      ? resolveLatestLogCompletionDate(subjectId, chapterName, targetRevKey, updatedLogs, newState.completedAt)
      : newState.completedAt;

    const nextChaptersState = {
      ...chaptersState,
      [subjectId]: {
        ...activeSubjectChapters,
        [chapterName]: {
          ...activeSubjectChapters[chapterName],
          [oldRevKey]: {
            ...oldState,
            completed: oldShouldStayCompleted,
            hours: formattedOldHours,
            completedAt: updatedOldCompletedAt
          },
          [targetRevKey]: {
            ...newState,
            hours: formattedNewHours,
            completedAt: updatedNewCompletedAt
          }
        }
      }
    };

    setChaptersState(nextChaptersState);
    await saveState(subjectId, nextChaptersState[subjectId]);
    await handleSaveLogs(updatedLogs);
    dispatchInternalRevisionUpdate();
  };

  const handleSaveSessions = async (newSessions: ScheduledSession[]) => {
    setScheduledSessions(newSessions);
    localStorage.setItem(getLevelScopedKey('practca_revision_planner_scheduled_sessions', caLevel), JSON.stringify(newSessions));
    
    if (currentUser) {
      try {
        const sessionsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('scheduledSessions', caLevel));
        await setDoc(sessionsRef, { caLevel, sessions: newSessions, updatedAt: new Date().toISOString() });
      } catch (error) {
        console.error("Error saving scheduled sessions to Firestore:", error);
      }
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const targetSession = scheduledSessions.find(s => s.id === sessionId);
    if (targetSession && isSubjectLockedAfterFinalExam(targetSession.subjectId)) return;
    const updated = scheduledSessions.filter(s => s.id !== sessionId);
    await handleSaveSessions(updated);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChapter || isSubjectLockedAfterFinalExam(formSubject)) return;

    const newSession: ScheduledSession = {
      id: `schedule-${Date.now()}`,
      date: selectedCalendarDate,
      subjectId: formSubject,
      chapterName: formChapter,
      cycleKey: formCycle,
      notes: formNotes.trim() || undefined
    };

    const updated = [...scheduledSessions, newSession];
    await handleSaveSessions(updated);
    setFormNotes('');
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Align to Monday

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr: dStr });
    }
    return days;
  };

  const handleToggleCompleted = (subjectId: SubjectId, chapter: string, revKey: string) => {
    if (isSubjectLockedAfterFinalExam(subjectId)) return;
    const activeSubjectChapters = chaptersState[subjectId] || {};
    const currentState = activeSubjectChapters[chapter]?.[revKey] || { completed: false, hours: '' };
    const nextCompleted = !currentState.completed;

    // Restriction check: Cannot mark completed if 0 logs AND 0 hours
    const chapterLogs = revisionLogs.filter(
      l => l.subjectId === subjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapter && l.revKey === revKey
    );
    const loggedMins = chapterLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
    const loggedHoursVal = loggedMins > 0 ? parseFloat((loggedMins / 60).toFixed(2)) : 0;
    const currentHoursVal = parseFloat(currentState.hours || '0') || 0;
    const combinedHoursVal = Math.max(currentHoursVal, loggedHoursVal);

    if (nextCompleted) {
      if (currentHoursVal <= 0 && chapterLogs.length === 0) {
        const stageMeta = getStageVisualMeta(revKey);
        setRestrictionInfo({
          chapter,
          revKey,
          revLabel: stageMeta.label
        });
        setShowRestrictionModal(true);
        return;
      }
    }

    const nextHours = combinedHoursVal > 0 
      ? parseFloat(combinedHoursVal.toFixed(2)).toString() 
      : currentState.hours;

    // Extract latest log date for this (subjectId, chapter, revKey) when marking completed
    const latestLogCompletionDate = resolveLatestLogCompletionDate(
      subjectId,
      chapter,
      revKey,
      revisionLogs,
      currentState.isManualDateOverride ? currentState.completedAt : undefined
    );

    const nextCompletedAt = nextCompleted 
      ? toInputDateValue(latestLogCompletionDate) 
      : undefined;

    const updatedChapterRevs: Record<string, ChapterRevisionState> = {
      ...(activeSubjectChapters[chapter] || {}),
      [revKey]: {
        ...currentState,
        completed: nextCompleted,
        skipped: nextCompleted ? false : currentState.skipped,
        manualSkip: nextCompleted ? false : (currentState as any).manualSkip,
        statusTag: nextCompleted ? 'completed' : (currentState.statusTag === 'completed' ? undefined : currentState.statusTag),
        hours: nextHours,
        completedAt: nextCompletedAt,
        isManualDateOverride: nextCompleted ? currentState.isManualDateOverride : false
      }
    };

    if (nextCompleted) {
      const dynamicRevsCount = computeSubjectMilestoneRevisionCount(subjectId, activeSubjectChapters);
      const dynamicRevKeys = getSubjectDynamicRevKeys(dynamicRevsCount);
      const targetRevIdx = dynamicRevKeys.indexOf(revKey);
      if (targetRevIdx > 0) {
        for (let i = 0; i < targetRevIdx; i++) {
          const priorRk = dynamicRevKeys[i];
          const priorSt = updatedChapterRevs[priorRk];
          if (!priorSt?.completed) {
            updatedChapterRevs[priorRk] = {
              ...(priorSt || { completed: false, hours: '' }),
              completed: false,
              skipped: true,
              statusTag: 'skipped',
              hours: priorSt?.hours || '0'
            };
          }
        }
      }
    }

    const nextChaptersState = {
      ...chaptersState,
      [subjectId]: {
        ...activeSubjectChapters,
        [chapter]: updatedChapterRevs
      }
    };

    setChaptersState(nextChaptersState);
    saveState(subjectId, nextChaptersState[subjectId]);
    const chapIdx = (SUBJECT_CHAPTERS[subjectId] || []).indexOf(chapter);
    setLastUpdatedMilestoneCell({
      subjectId,
      chapter,
      chapterIndex: chapIdx >= 0 ? chapIdx + 1 : 1,
      revKey,
      completed: nextCompleted
    });
    dispatchInternalRevisionUpdate();
  };

  const handleDateChange = (subjectId: SubjectId, chapter: string, revKey: string, newDate: string) => {
    if (isSubjectLockedAfterFinalExam(subjectId)) return;
    const activeSubjectChapters = chaptersState[subjectId] || {};
    const currentState = activeSubjectChapters[chapter]?.[revKey] || { completed: false, hours: '' };

    const nextChaptersState = {
      ...chaptersState,
      [subjectId]: {
        ...activeSubjectChapters,
        [chapter]: {
          ...activeSubjectChapters[chapter],
          [revKey]: {
            ...currentState,
            completedAt: toInputDateValue(newDate),
            isManualDateOverride: true
          }
        }
      }
    };

    setChaptersState(nextChaptersState);
    saveState(subjectId, nextChaptersState[subjectId]);
    dispatchInternalRevisionUpdate();
  };

  const handleHoursChange = (subjectId: SubjectId, chapter: string, revKey: string, val: string) => {
    if (isSubjectLockedAfterFinalExam(subjectId)) return;
    const cleanVal = val.replace(/[^0-9.]/g, '');
    
    const activeSubjectChapters = chaptersState[subjectId] || {};
    const currentEntry = activeSubjectChapters[chapter]?.[revKey] || { completed: false, hours: '' };
    const numHours = parseFloat(cleanVal) || 0;
    const isNowPartiallyDone = currentEntry.skipped && numHours > 0;

    const nextChaptersState = {
      ...chaptersState,
      [subjectId]: {
        ...activeSubjectChapters,
        [chapter]: {
          ...activeSubjectChapters[chapter],
          [revKey]: {
            ...currentEntry,
            hours: cleanVal,
            skipped: isNowPartiallyDone ? false : currentEntry.skipped,
            partiallyDone: isNowPartiallyDone ? true : currentEntry.partiallyDone
          }
        }
      }
    };

    setChaptersState(nextChaptersState);

    // Save synchronously to LocalStorage immediately on every keystroke to completely avoid loss
    try {
      const localKey = getLevelScopedKey(`practca_revision_planner_${subjectId}`, caLevel);
      localStorage.setItem(localKey, JSON.stringify({
        revisionsCount: subjectRevisionsCountMap[subjectId] || 1,
        chapters: nextChaptersState[subjectId]
      }));
    } catch (err) {
      console.error("Local storage sync error: ", err);
    }
    dispatchInternalRevisionUpdate();
  };

  const handleHoursBlur = (subjectId: SubjectId, chapter: string, revKey: string) => {
    if (isSubjectLockedAfterFinalExam(subjectId)) return;
    // If editing rev1.5 hours manually in Revision Report, also keep practca_revision_planner_logs in sync
    if (revKey === 'rev1.5') {
      const canonical = getCanonicalChapterKey(subjectId, chapter) || chapter;
      const hoursVal = parseFloat(chaptersState[subjectId]?.[chapter]?.['rev1.5']?.hours || '0') || 0;
      const minsVal = Math.max(0, Math.round(hoursVal * 60));
      const filteredLogs = revisionLogs.filter((l) => {
        const isRev15 = l.revKey === 'rev1.5' || (l as any).revisionNumber === 'rev1.5';
        if (!isRev15) return true;
        if (l.subjectId !== subjectId) return true;
        return getCanonicalChapterKey(subjectId, l.chapterName) !== canonical;
      });
      if (minsVal > 0) {
        filteredLogs.push({
          id: `revlog_lmr_manual_${subjectId}_${Date.now()}`,
          subjectId,
          chapterName: canonical,
          revKey: 'rev1.5',
          durationMinutes: minsVal,
          timestamp: new Date().toISOString(),
          taskTitle: `[${subjectId}] ${canonical} (1.5D LMR Manual Entry)`
        });
      }
      handleSaveLogs(filteredLogs);
    }
    // Save state explicitly on blur to keep Firestore synchronized
    saveState(subjectId, chaptersState[subjectId]);
    dispatchInternalRevisionUpdate();
  };

  const handleResetPlanner = () => {
    if (isSubjectLockedAfterFinalExam(activeSubjectId)) return;
    setShowResetConfirm(true);
  };

  const executeResetPlanner = () => {
    if (isSubjectLockedAfterFinalExam(activeSubjectId)) return;
    const reset = createEmptySubjectState(activeSubjectId, activeRevisionsCount);
    const nextChaptersState = {
      ...chaptersState,
      [activeSubjectId]: reset
    };
    setChaptersState(nextChaptersState);
    saveState(activeSubjectId, reset);
    setShowResetConfirm(false);
    dispatchInternalRevisionUpdate();
  };

  // Single cell status update (Done, Partial, Skip, None)
  const handleSetCellStatus = async (
    chapterName: string,
    revKey: string,
    tag: 'completed' | 'partially_done' | 'skipped' | 'none'
  ) => {
    if (isSubjectLockedAfterFinalExam(activeSubjectId)) return;
    const activeSubjectChapters = chaptersState[activeSubjectId] || {};
    const cur = activeSubjectChapters[chapterName]?.[revKey] || { completed: false, hours: '' };

    let updatedCell: any;
    if (tag === 'completed') {
      const latestLogCompletionDate = resolveLatestLogCompletionDate(
        activeSubjectId,
        chapterName,
        revKey,
        revisionLogs,
        cur.completedAt
      );
      updatedCell = {
        ...cur,
        completed: true,
        partiallyDone: false,
        skipped: false,
        manualSkip: false,
        statusTag: 'completed',
        completedAt: cur.completedAt || toInputDateValue(latestLogCompletionDate)
      };
    } else if (tag === 'partially_done') {
      updatedCell = {
        ...cur,
        completed: false,
        partiallyDone: true,
        skipped: false,
        manualSkip: false,
        statusTag: 'partially_done'
      };
    } else if (tag === 'skipped') {
      updatedCell = {
        ...cur,
        completed: false,
        partiallyDone: false,
        skipped: true,
        manualSkip: revKey === 'rev1.5',
        statusTag: 'skipped',
        hours: cur.hours || '0'
      };
    } else {
      updatedCell = {
        ...cur,
        completed: false,
        partiallyDone: false,
        skipped: false,
        manualSkip: false,
        statusTag: undefined
      };
    }

    const updatedChapterCellMap: Record<string, ChapterRevisionState> = {
      ...(activeSubjectChapters[chapterName] || {}),
      [revKey]: updatedCell
    };

    if (tag === 'completed') {
      const dynamicRevsCount = computeSubjectMilestoneRevisionCount(activeSubjectId, activeSubjectChapters);
      const dynamicRevKeys = getSubjectDynamicRevKeys(dynamicRevsCount);
      const targetRevIdx = dynamicRevKeys.indexOf(revKey);
      if (targetRevIdx > 0) {
        for (let i = 0; i < targetRevIdx; i++) {
          const priorRk = dynamicRevKeys[i];
          const priorSt = updatedChapterCellMap[priorRk];
          if (!priorSt?.completed) {
            updatedChapterCellMap[priorRk] = {
              ...(priorSt || { completed: false, hours: '' }),
              completed: false,
              skipped: true,
              statusTag: 'skipped',
              hours: priorSt?.hours || '0'
            };
          }
        }
      }
    }

    const nextChaptersState = {
      ...chaptersState,
      [activeSubjectId]: {
        ...activeSubjectChapters,
        [chapterName]: updatedChapterCellMap
      }
    };

    setChaptersState(nextChaptersState);
    await saveState(activeSubjectId, nextChaptersState[activeSubjectId]);
    if (revKey === 'rev1.5') {
      try {
        applySmartLmrSprintAllocationToStorage(activeSubjectId, {
          preserveCompletedPlannedMinutes: true,
          rebalanceFromNow: true,
          level: caLevel
        });
      } catch {}
    }
    dispatchInternalRevisionUpdate();
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
  };

  // Execution engine: Reset Column (Baseline, 1.5D Boost, R1..RN, or All Stages)
  const executeResetColumn = async (stageKey: string, targetChapters: string[]) => {
    if (isSubjectLockedAfterFinalExam(activeSubjectId)) return;
    const currentSubjectChapters = chaptersState[activeSubjectId] || {};
    const nextChapters = { ...currentSubjectChapters };

    targetChapters.forEach(chap => {
      const chapObj = { ...(nextChapters[chap] || {}) };
      if (stageKey === 'ALL_STAGES') {
        activeAllStageKeys.forEach(sKey => {
          chapObj[sKey] = {
            completed: false,
            hours: '',
            completedAt: undefined,
            isManualDateOverride: false,
            skipped: false,
            partiallyDone: false,
            statusTag: undefined
          };
        });
      } else {
        chapObj[stageKey] = {
          completed: false,
          hours: '',
          completedAt: undefined,
          isManualDateOverride: false,
          skipped: false,
          partiallyDone: false,
          statusTag: undefined
        };
      }
      nextChapters[chap] = chapObj;
    });

    // Remove matching study logs so hours don't bounce back from old logs
    const canonTargets = new Set(targetChapters.map(c => getCanonicalChapterKey(activeSubjectId, c)));
    const updatedLogs = revisionLogs.filter(l => {
      if (l.subjectId !== activeSubjectId) return true;
      const lCanon = getCanonicalChapterKey(activeSubjectId, l.chapterName);
      if (!canonTargets.has(lCanon)) return true;
      if (stageKey === 'ALL_STAGES') return false;
      return l.revKey !== stageKey && l.revisionNumber !== stageKey;
    });

    const nextAllState = {
      ...chaptersState,
      [activeSubjectId]: nextChapters
    };
    setChaptersState(nextAllState);
    setRevisionLogs(updatedLogs);
    localStorage.setItem(getLevelScopedKey('practca_revision_planner_logs', caLevel), JSON.stringify(updatedLogs));

    await saveState(activeSubjectId, nextChapters);

    if (currentUser) {
      try {
        const logsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', caLevel));
        await setDoc(logsRef, { caLevel, logs: updatedLogs, updatedAt: new Date().toISOString() });
      } catch (e) {}
    }

    dispatchInternalRevisionUpdate();
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_study_logs_updated'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
  };

  // Execution engine: Delete Complete Revision Round (e.g. Erase R2, shift R3 -> R2)
  const executeDeleteRevisionRound = async (revNumberToDelete: number) => {
    if (isSubjectLockedAfterFinalExam(activeSubjectId)) return;
    const currentCount = subjectRevisionsCountMap[activeSubjectId] || 1;
    const currentSubjectChapters = chaptersState[activeSubjectId] || {};
    const nextChapters = { ...currentSubjectChapters };
    const officialChapters = SUBJECT_CHAPTERS[activeSubjectId] || [];

    // 1. Shift chapter revision states: R3 -> R2, R4 -> R3, etc.
    officialChapters.forEach(chap => {
      const chapObj = { ...(nextChapters[chap] || {}) };
      for (let r = revNumberToDelete; r < currentCount; r++) {
        const nextKey = `rev${r + 1}`;
        const curKey = `rev${r}`;
        chapObj[curKey] = chapObj[nextKey] ? { ...chapObj[nextKey] } : { completed: false, hours: '' };
      }
      delete chapObj[`rev${currentCount}`];
      nextChapters[chap] = chapObj;
    });

    const newRevCount = Math.max(1, currentCount - 1);

    // 2. Shift / delete revision logs
    const targetRevKeyToDelete = `rev${revNumberToDelete}`;
    const updatedLogs = revisionLogs
      .filter(l => !(l.subjectId === activeSubjectId && (l.revKey === targetRevKeyToDelete || l.revisionNumber === targetRevKeyToDelete)))
      .map(l => {
        if (l.subjectId === activeSubjectId) {
          const m = String(l.revKey || l.revisionNumber || '').match(/^rev(\d+)$/i);
          if (m) {
            const rNum = parseInt(m[1], 10);
            if (rNum > revNumberToDelete) {
              const shiftedKey = `rev${rNum - 1}`;
              return {
                ...l,
                revKey: shiftedKey,
                revisionNumber: shiftedKey
              };
            }
          }
        }
        return l;
      });

    // 3. Shift / delete Roadmap Checkpoints in LocalStorage
    try {
      [
        getLevelScopedKey('practca_roadmap_user_checkpoints', caLevel),
        getLevelScopedKey('practca_roadmap_checkpoints_v3', caLevel)
      ].forEach(cpKey => {
        const raw = localStorage.getItem(cpKey);
        if (raw) {
          const checkpoints = JSON.parse(raw);
          if (Array.isArray(checkpoints)) {
            const shiftedCheckpoints = checkpoints
              .filter((cp: any) => {
                if (String(cp.subjectId || '').trim().toUpperCase() === activeSubjectId.toUpperCase()) {
                  const cStr = String(cp.revisionCycle || '');
                  if (cStr === `rev${revNumberToDelete}` || cStr.toLowerCase() === `revision ${revNumberToDelete}`) {
                    return false;
                  }
                }
                return true;
              })
              .map((cp: any) => {
                if (String(cp.subjectId || '').trim().toUpperCase() === activeSubjectId.toUpperCase()) {
                  const cStr = String(cp.revisionCycle || '');
                  const m = cStr.match(/^rev(\d+)$/i);
                  if (m) {
                    const rNum = parseInt(m[1], 10);
                    if (rNum > revNumberToDelete) {
                      return {
                        ...cp,
                        revisionCycle: `rev${rNum - 1}`,
                        customTitle: cp.customTitle ? cp.customTitle.replace(new RegExp(`R${rNum}\\b`, 'g'), `R${rNum - 1}`) : cp.customTitle
                      };
                    }
                  }
                }
                return cp;
              });
            localStorage.setItem(cpKey, JSON.stringify(shiftedCheckpoints));
          }
        }
      });
    } catch (e) {}

    // 4. Shift / delete tasks
    try {
      [
        getLevelScopedKey('practca_local_tasks', caLevel),
        getLevelScopedKey('practca_cached_cloud_tasks', caLevel)
      ].forEach(tKey => {
        const raw = localStorage.getItem(tKey);
        if (raw) {
          const tasks = JSON.parse(raw);
          if (Array.isArray(tasks)) {
            const shiftedTasks = tasks.map((t: any) => {
              let tSub = String(t.subjectCode || '').trim().toUpperCase();
              if (!tSub && typeof t.title === 'string') {
                const m = t.title.match(/\[\s*(AFM|FR|Audit|DT|IDT|IBS|Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|CMA[A-Za-z0-9]+)\s*\]/i);
                if (m) tSub = m[1].toUpperCase();
              }
              if (tSub === activeSubjectId.toUpperCase()) {
                if (t.revKey === `rev${revNumberToDelete}`) {
                  return { ...t, revKey: undefined };
                }
                const m = String(t.revKey || '').match(/^rev(\d+)$/i);
                if (m) {
                  const rNum = parseInt(m[1], 10);
                  if (rNum > revNumberToDelete) {
                    const newRevKey = `rev${rNum - 1}`;
                    return {
                      ...t,
                      revKey: newRevKey,
                      notes: typeof t.notes === 'string' ? t.notes.replace(new RegExp(`Revision:\\s*R${rNum}\\b`, 'gi'), `Revision: R${rNum - 1}`) : t.notes
                    };
                  }
                }
              }
              return t;
            });
            localStorage.setItem(tKey, JSON.stringify(shiftedTasks));
          }
        }
      });
    } catch (e) {}

    // 5. Explicitly persist new revision count
    localStorage.setItem(getLevelScopedKey(`practca_revision_count_${activeSubjectId}`, caLevel), String(newRevCount));

    // 6. Update local state
    const nextAllState = {
      ...chaptersState,
      [activeSubjectId]: nextChapters
    };
    setChaptersState(nextAllState);
    setRevisionLogs(updatedLogs);
    localStorage.setItem(getLevelScopedKey('practca_revision_planner_logs', caLevel), JSON.stringify(updatedLogs));

    // 7. Save to Firestore & LocalStorage
    try {
      const localKey = getLevelScopedKey(`practca_revision_planner_${activeSubjectId}`, caLevel);
      localStorage.setItem(localKey, JSON.stringify({
        revisionsCount: newRevCount,
        chapters: nextChapters,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {}

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(activeSubjectId, caLevel));
        await setDoc(docRef, {
          subjectId: activeSubjectId,
          caLevel,
          revisionsCount: newRevCount,
          chapters: nextChapters,
          updatedAt: new Date().toISOString()
        });
        const logsRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('logs', caLevel));
        await setDoc(logsRef, { caLevel, logs: updatedLogs, updatedAt: new Date().toISOString() });
      } catch (e) {}
    }

    dispatchInternalRevisionUpdate();
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
    window.dispatchEvent(new Event('practca_study_logs_updated'));
    window.dispatchEvent(new Event('practca_tasks_updated'));
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new Event('practca_target_system_synced'));
  };

  // Execution engine: Batch Status Tag
  const executeBatchStatusTag = async (
    stageKey: string,
    targetChapters: string[],
    tag: 'completed' | 'partially_done' | 'skipped' | 'none'
  ) => {
    if (isSubjectLockedAfterFinalExam(activeSubjectId)) return;
    const activeSubjectChapters = chaptersState[activeSubjectId] || {};
    const nextSubjectChapters = { ...activeSubjectChapters };

    targetChapters.forEach(chapterName => {
      const cur = nextSubjectChapters[chapterName]?.[stageKey] || { completed: false, hours: '' };
      let updatedCell: any;
      if (tag === 'completed') {
        const latestLogCompletionDate = resolveLatestLogCompletionDate(
          activeSubjectId,
          chapterName,
          stageKey,
          revisionLogs,
          cur.completedAt
        );
        updatedCell = {
          ...cur,
          completed: true,
          partiallyDone: false,
          skipped: false,
          manualSkip: false,
          statusTag: 'completed',
          completedAt: cur.completedAt || toInputDateValue(latestLogCompletionDate)
        };
      } else if (tag === 'partially_done') {
        updatedCell = {
          ...cur,
          completed: false,
          partiallyDone: true,
          skipped: false,
          manualSkip: false,
          statusTag: 'partially_done'
        };
      } else if (tag === 'skipped') {
        updatedCell = {
          ...cur,
          completed: false,
          partiallyDone: false,
          skipped: true,
          manualSkip: stageKey === 'rev1.5',
          statusTag: 'skipped',
          hours: cur.hours || '0'
        };
      } else {
        updatedCell = {
          ...cur,
          completed: false,
          partiallyDone: false,
          skipped: false,
          manualSkip: false,
          statusTag: undefined
        };
      }

      nextSubjectChapters[chapterName] = {
        ...(nextSubjectChapters[chapterName] || {}),
        [stageKey]: updatedCell
      };
    });

    const nextChaptersState = {
      ...chaptersState,
      [activeSubjectId]: nextSubjectChapters
    };

    setChaptersState(nextChaptersState);
    await saveState(activeSubjectId, nextSubjectChapters);
    if (stageKey === 'rev1.5') {
      try {
        applySmartLmrSprintAllocationToStorage(activeSubjectId, {
          preserveCompletedPlannedMinutes: true,
          rebalanceFromNow: true,
          level: caLevel
        });
      } catch {}
    }
    dispatchInternalRevisionUpdate();
    window.dispatchEvent(new Event('practca_revision_planner_updated'));
  };

  // Uniform neutral slate accent style for chapter rows
  const CHAPTER_ROW_ACCENTS = [
    {
      leftBorder: 'border-l-2 border-l-slate-800',
      badge: 'bg-slate-800/80 text-slate-300 border-slate-700/80'
    }
  ];

  // Filtered chapters list for the active subject with header column filters and sorting
  const filteredSubjectChapters = useMemo(() => {
    const allChapters = SUBJECT_CHAPTERS[activeSubjectId] || [];
    const activeSubState = chaptersState[activeSubjectId] || {};
    const q = chapterSearchTerm.trim().toLowerCase();

    let list = allChapters
      .map((name, globalIndex) => ({ name, globalIndex }))
      .filter(({ name, globalIndex }) => {
        if (q) {
          const codeStr = `ch${String(globalIndex + 1).padStart(2, '0')}`;
          if (!name.toLowerCase().includes(q) && !codeStr.includes(q)) {
            return false;
          }
        }
        const st = activeSubState[name] || {};
        if (selectedRevisionFilter === 'BL_PENDING') return !st['baseline']?.completed;
        if (selectedRevisionFilter === 'BOOST_PENDING') return !st['rev1.5']?.completed;
        if (selectedRevisionFilter === 'CORE_DONE') {
          return activeDynamicRevKeys.every(rk => Boolean(st[rk]?.completed));
        }
        if (selectedRevisionFilter.endsWith('_PENDING')) {
          const rk = selectedRevisionFilter.replace('_PENDING', '').toLowerCase();
          if (rk.startsWith('r')) {
            const fullKey = `rev${rk.slice(1)}`;
            return !st[fullKey]?.completed;
          }
        }

        // Apply column-specific filters
        for (const [colKey, filterType] of Object.entries(columnFilters)) {
          if (!filterType || filterType === 'all') continue;
          const cell = st[colKey];
          const hrVal = parseFloat(cell?.hours || '0') || 0;
          const isDone = Boolean(cell?.completed || cell?.statusTag === 'completed');
          const isPart = Boolean(
            !isDone &&
            (cell?.partiallyDone ||
              cell?.statusTag === 'partially_done' ||
              (cell?.skipped && hrVal > 0) ||
              (!cell?.skipped && cell?.statusTag !== 'skipped' && cell?.statusTag !== 'none' && hrVal > 0))
          );
          const isSkip = Boolean(!isDone && !isPart && (cell?.skipped || cell?.statusTag === 'skipped'));

          if (filterType === 'completed' && !isDone) return false;
          if (filterType === 'partially_done' && !isPart) return false;
          if (filterType === 'skipped' && !isSkip) return false;
          if (filterType === 'pending' && (isDone || isPart || isSkip)) return false;
          if (filterType === 'has_hours' && hrVal <= 0) return false;
        }

        return true;
      });

    // Apply sorting
    if (sortConfig.key === 'chapter') {
      if (sortConfig.direction === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortConfig.direction === 'name_desc') {
        list.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortConfig.direction === 'hours_desc') {
        list.sort((a, b) => {
          const hA = activeAllStageKeys.reduce((s, k) => s + (parseFloat(activeSubState[a.name]?.[k]?.hours || '0') || 0), 0);
          const hB = activeAllStageKeys.reduce((s, k) => s + (parseFloat(activeSubState[b.name]?.[k]?.hours || '0') || 0), 0);
          return hB - hA;
        });
      } else if (sortConfig.direction === 'hours_asc') {
        list.sort((a, b) => {
          const hA = activeAllStageKeys.reduce((s, k) => s + (parseFloat(activeSubState[a.name]?.[k]?.hours || '0') || 0), 0);
          const hB = activeAllStageKeys.reduce((s, k) => s + (parseFloat(activeSubState[b.name]?.[k]?.hours || '0') || 0), 0);
          return hA - hB;
        });
      } else if (sortConfig.direction === 'completed_desc') {
        list.sort((a, b) => {
          const cA = activeAllStageKeys.filter(k => activeSubState[a.name]?.[k]?.completed).length;
          const cB = activeAllStageKeys.filter(k => activeSubState[b.name]?.[k]?.completed).length;
          return cB - cA;
        });
      }
    } else if (sortConfig.key && sortConfig.key !== 'default') {
      const sKey = sortConfig.key;
      if (sortConfig.direction === 'hours_desc') {
        list.sort((a, b) => {
          const hA = parseFloat(activeSubState[a.name]?.[sKey]?.hours || '0') || 0;
          const hB = parseFloat(activeSubState[b.name]?.[sKey]?.hours || '0') || 0;
          return hB - hA;
        });
      } else if (sortConfig.direction === 'hours_asc') {
        list.sort((a, b) => {
          const hA = parseFloat(activeSubState[a.name]?.[sKey]?.hours || '0') || 0;
          const hB = parseFloat(activeSubState[b.name]?.[sKey]?.hours || '0') || 0;
          return hA - hB;
        });
      } else if (sortConfig.direction === 'date_desc') {
        list.sort((a, b) => {
          const dA = activeSubState[a.name]?.[sKey]?.completedAt || '';
          const dB = activeSubState[b.name]?.[sKey]?.completedAt || '';
          return dB.localeCompare(dA);
        });
      } else if (sortConfig.direction === 'date_asc') {
        list.sort((a, b) => {
          const dA = activeSubState[a.name]?.[sKey]?.completedAt || '';
          const dB = activeSubState[b.name]?.[sKey]?.completedAt || '';
          return dA.localeCompare(dB);
        });
      }
    }

    return list;
  }, [activeSubjectId, chaptersState, selectedRevisionFilter, chapterSearchTerm, activeDynamicRevKeys, columnFilters, sortConfig, activeAllStageKeys]);

  // Compute stats on-the-fly inside memo
  const stats = useMemo(() => {
    const activeChaptersList = SUBJECT_CHAPTERS[activeSubjectId];
    const totalChaptersCount = activeChaptersList.length;
    
    const targetRevsKeys = activeAllStageKeys;

    const totalCheckboxesCount = totalChaptersCount * targetRevsKeys.length;
    let completedCheckboxesCount = 0;
    let totalHoursSpent = 0;

    // Stage-specific aggregations (baseline, rev1..revN, rev1.5)
    const revAggr: Record<string, { completed: number; hours: number }> = {};
    targetRevsKeys.forEach(k => {
      revAggr[k] = { completed: 0, hours: 0 };
    });

    const activeChaptersState = chaptersState[activeSubjectId] || {};

    activeChaptersList.forEach(chapter => {
      targetRevsKeys.forEach(key => {
        const item = activeChaptersState[chapter]?.[key];
        const chapterLogs = revisionLogs.filter(
          l => l.subjectId === activeSubjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapter && l.revKey === key
        );
        const loggedMins = chapterLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
        const loggedHrs = loggedMins > 0 ? loggedMins / 60 : 0;
        const storedHrs = item ? (parseFloat(item.hours) || 0) : 0;
        const hrVal = Math.max(storedHrs, loggedHrs);
        const isSkipped = Boolean(item?.skipped && hrVal <= 0);
        const effectiveHrVal = isSkipped ? 0 : hrVal;

        const isDone = Boolean(item && (item.completed || item.statusTag === 'completed'));
        if (isDone) {
          completedCheckboxesCount++;
          revAggr[key].completed++;
        }
        if (effectiveHrVal > 0) {
          totalHoursSpent += effectiveHrVal;
          revAggr[key].hours += effectiveHrVal;
        }
      });
    });

    const completionRate = totalCheckboxesCount > 0 
      ? Math.round((completedCheckboxesCount / totalCheckboxesCount) * 100) 
      : 0;

    return {
      totalChaptersCount,
      totalCheckboxesCount,
      completedCheckboxesCount,
      totalHoursSpent,
      completionRate,
      revAggr
    };
  }, [chaptersState, activeSubjectId, revisionLogs, activeAllStageKeys]);

  const getSubjectStats = (subId: SubjectId) => {
    const chaptersList = SUBJECT_CHAPTERS[subId] || [];
    const totalChaptersCount = chaptersList.length;
    const subRevCount = subjectRevisionsCountMap[subId] || 1;
    const targetRevsKeys = getSubjectAllStageKeys(subRevCount);
    
    const revCounts: Record<string, number> = {};
    targetRevsKeys.forEach(k => {
      revCounts[k] = 0;
    });
    
    const subChaptersState = chaptersState[subId] || {};
    
    chaptersList.forEach(chapter => {
      targetRevsKeys.forEach(key => {
        if (subChaptersState[chapter]?.[key]?.completed) {
          revCounts[key]++;
        }
      });
    });
    
    const totalCheckboxes = totalChaptersCount * targetRevsKeys.length;
    let completedCheckboxesCount = 0;
    targetRevsKeys.forEach(key => {
      completedCheckboxesCount += revCounts[key];
    });
    
    const overallPct = totalCheckboxes > 0 ? Math.round((completedCheckboxesCount / totalCheckboxes) * 100) : 0;
    
    const revPcts = targetRevsKeys.reduce((acc, key) => {
      acc[key] = totalChaptersCount > 0 ? Math.round((revCounts[key] / totalChaptersCount) * 100) : 0;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalChaptersCount,
      subRevCount,
      targetRevsKeys,
      revCounts,
      revPcts,
      overallPct
    };
  };

  const handleExportPdf = () => {
    const subjectFullName = SUBJECTS_METADATA[activeSubjectId]?.fullName || activeSubjectId;
    const targetRevKeys = activeAllStageKeys;

    // Beautiful KPI Dashboard block with modern styled cards
    const statsBlock = `
      <div style="display: flex; gap: 15px; margin-bottom: 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Card 1: Subject Target -->
        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          <div style="font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 6px;">Subject Name</div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">${subjectFullName}</div>
          <div style="font-size: 10px; color: #64748b; font-weight: 500;">Baseline + ${activeRevisionsCount} Revision${activeRevisionsCount !== 1 ? 's' : ''} + 1.5D Boost</div>
        </div>
        
        <!-- Card 2: Overall Progress -->
        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          <div style="font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 4px;">Stage Completion</div>
          <div style="font-size: 20px; font-weight: 900; color: #4f46e5; line-height: 1.2;">${stats.completionRate}%</div>
          <div style="width: 80%; background-color: #cbd5e1; border-radius: 10px; height: 6px; margin: 6px auto; overflow: hidden;">
            <div style="width: ${stats.completionRate}%; background: linear-gradient(90deg, #06b6d4, #4f46e5, #a855f7); height: 100%;"></div>
          </div>
          <div style="font-size: 9.5px; color: #475569; font-weight: 600;">${stats.completedCheckboxesCount} / ${stats.totalCheckboxesCount} Milestones Completed</div>
        </div>

        <!-- Card 3: Accrued Study Hours -->
        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
          <div style="font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 4px;">Accrued Study Time</div>
          <div style="font-size: 20px; font-weight: 900; color: #10b981; line-height: 1.2;">${stats.totalHoursSpent.toFixed(1)} <span style="font-size: 11px; font-weight: bold; color: #475569;">hrs</span></div>
          <div style="width: 80%; background-color: #cbd5e1; border-radius: 10px; height: 6px; margin: 6px auto; overflow: hidden; opacity: 0;"></div>
          <div style="font-size: 9.5px; color: #475569; font-weight: 600;">Baseline + Revisions + 1.5D Focus Logs</div>
        </div>
      </div>

      <!-- Horizontal summary breakdown of individual cycles -->
      <div style="display: flex; gap: 10px; margin-bottom: 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${targetRevKeys.map(key => {
          const meta = getStageVisualMeta(key);
          const count = stats.revAggr[key]?.completed || 0;
          const hours = stats.revAggr[key]?.hours || 0;
          const total = stats.totalChaptersCount;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return `
            <div style="flex: 1; background: ${meta.pdfColors.bg}; border: 1px solid ${meta.pdfColors.border}; border-radius: 8px; padding: 10px; text-align: left;">
              <div style="font-size: 8px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.05em;">${meta.label}</div>
              <div style="display: flex; align-items: baseline; justify-content: space-between; margin-top: 4px;">
                <span style="font-size: 12px; font-weight: 800; color: ${meta.pdfColors.accent};">${count}/${total} <span style="font-size: 8px; font-weight: bold; color: #64748b;">(${pct}%)</span></span>
                <span style="font-size: 9.5px; font-weight: 700; color: #334155;">${formatStaticDuration(hours * 60, 'minutes')}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    const headersRow1 = targetRevKeys.map(key => {
      const meta = getStageVisualMeta(key);
      return `<th colspan="2" style="background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; padding: 8px; text-transform: uppercase; font-size: 9.5px; font-weight: 800; text-align: center; width: 110px;">${meta.label}</th>`;
    }).join('');

    const headersRow2 = targetRevKeys.map(() => {
      return `
        <th style="background-color: #f8fafc; color: #475569; border: 1px solid #cbd5e1; padding: 5px; font-size: 8.5px; font-weight: 700; text-align: center;">Done</th>
        <th style="background-color: #f8fafc; color: #475569; border: 1px solid #cbd5e1; padding: 5px; font-size: 8.5px; font-weight: 700; text-align: center;">Time</th>
      `;
    }).join('');

    const chaptersList = SUBJECT_CHAPTERS[activeSubjectId];
    const tableRows = chaptersList.map((chapterName, idx) => {
      const activeChaptersState = chaptersState[activeSubjectId] || {};
      const completedMainRevisions = activeDynamicRevKeys.filter(rk => activeChaptersState[chapterName]?.[rk]?.completed).length;

      let totalChapterHours = 0;
      targetRevKeys.forEach(key => {
        const item = activeChaptersState[chapterName]?.[key];
        const chapterLogs = revisionLogs.filter(
          l => l.subjectId === activeSubjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapterName && l.revKey === key
        );
        const loggedMins = chapterLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
        const loggedHrs = loggedMins > 0 ? loggedMins / 60 : 0;
        const storedHrs = item ? (parseFloat(item.hours) || 0) : 0;
        totalChapterHours += Math.max(storedHrs, loggedHrs);
      });

      const indexCell = `<td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 11px; background-color: #f8fafc; color: #64748b; font-weight: bold; width: 35px;">${idx + 1}</td>`;
      const nameCell = `<td style="border: 1px solid #cbd5e1; padding: 8px; font-size: 11px; font-weight: 600; color: #0f172a; text-align: left;">${chapterName}</td>`;
      
      const progressDots = activeDynamicRevKeys.map((rk) => {
        const isDone = activeChaptersState[chapterName]?.[rk]?.completed;
        const meta = getStageVisualMeta(rk);
        return `
          <div style="
            width: 14px; 
            height: 6px; 
            border-radius: 3px; 
            background-color: ${isDone ? meta.pdfColors.accent : '#e2e8f0'};
            margin-right: 3px;
            display: inline-block;
          "></div>
        `;
      }).join('');

      const progressBarCell = `
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 110px; background-color: #fbfbfe;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
            <div style="display: inline-flex;">${progressDots}</div>
            <span style="font-size: 10px; font-weight: bold; font-family: monospace; color: #475569;">
              ${completedMainRevisions}/${activeRevisionsCount}
            </span>
          </div>
        </td>
      `;

      const hoursCell = `
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-size: 11px; font-weight: bold; color: #10b981; width: 85px; background-color: #fbfdfa;">
          ${totalChapterHours > 0 ? `${totalChapterHours.toFixed(1)} hrs` : '<span style="color: #cbd5e1;">-</span>'}
        </td>
      `;
      
      const revCells = targetRevKeys.map(key => {
        const item = activeChaptersState[chapterName]?.[key] || { completed: false, hours: '' };
        const chapterLogs = revisionLogs.filter(
          l => l.subjectId === activeSubjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapterName && l.revKey === key
        );
        const loggedMins = chapterLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
        const loggedHrs = loggedMins > 0 ? loggedMins / 60 : 0;
        const storedHrs = parseFloat(item.hours || '0') || 0;
        const effHrs = Math.max(storedHrs, loggedHrs);

        const latestIso = getLatestLogIsoDateForRevision(chapterName, key, activeSubjectId);
        const effectiveDateStr = item.isManualDateOverride
          ? (item.completedAt || latestIso)
          : (latestIso || item.completedAt);

        const tick = item.completed
          ? `<div style="color: #10b981; font-weight: 900; font-size: 11px;">✔</div>${effectiveDateStr ? `<div style="font-size: 7.5px; color: #64748b; font-family: monospace;">${effectiveDateStr}</div>` : ''}`
          : '<span style="color: #cbd5e1;">-</span>';
        const hoursText = effHrs > 0 ? `${effHrs.toFixed(1)} hrs` : '-';
        return `
          <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-size: 10px; width: 50px;">${tick}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-size: 10px; font-weight: 500; width: 55px; color: #475569;">${hoursText}</td>
        `;
      }).join('');

      return `<tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">${indexCell}${nameCell}${progressBarCell}${hoursCell}${revCells}</tr>`;
    }).join('');

    exportToPdfEngine(`${activeSubjectId}_Revision_Planner`, statsBlock + `<table class="planner-table"><thead><tr><th rowspan="2" style="background-color: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; padding: 8px; text-transform: uppercase; font-size: 9.5px; font-weight: 900; width: 35px; text-align: center;">#</th><th rowspan="2" style="background-color: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; padding: 8px; text-transform: uppercase; font-size: 9.5px; font-weight: 900; text-align: left;">Chapter Syllabus Structure</th><th rowspan="2" style="background-color: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; padding: 8px; text-transform: uppercase; font-size: 9.5px; font-weight: 900; width: 110px; text-align: center;">Progress (${activeRevisionsCount} Rev${activeRevisionsCount !== 1 ? 's' : ''})</th><th rowspan="2" style="background-color: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; padding: 8px; text-transform: uppercase; font-size: 9.5px; font-weight: 900; width: 85px; text-align: center;">Total Hours</th>${headersRow1}</tr><tr>${headersRow2}</tr></thead><tbody>${tableRows}</tbody></table>`);
  };

  return (
    <div className="space-y-3 w-full max-w-full animate-fadeIn">
      
      {/* Compact Header & Subject Switcher Bar (Locked & Scroll-Diminished) */}
      <div className="locked-internal-header">
        <div className="locked-internal-header-card px-5 py-5 sm:px-7 sm:py-6 rounded-2xl bg-gradient-to-r from-[#0b2338] via-[#102c46] to-[#142740] border border-cyan-400/55 ring-1 ring-white/[0.06] space-y-4 relative overflow-hidden">
          {/* Top Luminous Emerald-Cyan-Amber Hairline */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 opacity-90 pointer-events-none" />
          <div className="absolute -top-10 right-16 w-48 h-20 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400/30 to-cyan-500/15 border border-emerald-300/60 shadow-[0_0_14px_rgba(16,185,129,0.28)] flex items-center justify-center shrink-0">
                <BookmarkCheck className="h-5 w-5 text-emerald-300 shrink-0" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2 drop-shadow-xs">
                <span>Revision Report</span>
              </h2>
              <div className="h-5 w-px bg-slate-700 hidden sm:block" />
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/18 border border-cyan-400/45 text-cyan-200 font-extrabold shadow-2xs">
                  {activeSubjectId} · {stats.totalChaptersCount} Ch
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/18 border border-emerald-400/45 text-emerald-200 font-extrabold tabular-nums shadow-2xs">
                  {stats.completionRate}% Completed ({stats.completedCheckboxesCount}/{stats.totalCheckboxesCount})
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/18 border border-amber-400/45 text-amber-200 font-extrabold tabular-nums shadow-2xs">
                  {stats.totalHoursSpent.toFixed(1)}h / {subjectHourlyTargets[activeSubjectId] || 100}h Target
                </span>
                {currentUser && (
                  <span className="header-diminish-hide text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-400/35 px-2.5 py-1 rounded-md font-bold">
                    ● Cloud Synced
                  </span>
                )}
              </div>
            </div>

            <div className="header-diminish-mobile-hide grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 w-full lg:w-auto shrink-0">
              <button
                onClick={() => {
                  setTempModalTargets({ ...subjectHourlyTargets });
                  setShowSubjectTargetModal(true);
                }}
                className="header-diminish-btn w-full sm:w-auto px-2.5 py-2 sm:py-1.5 bg-amber-500/18 hover:bg-amber-500/28 border border-amber-400/50 text-amber-200 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                title="Set Subject-Wise Hourly Study Targets"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>Set Hourly Targets</span>
              </button>
              {onGoToTasks && (
                <button
                  onClick={onGoToTasks}
                  className="header-diminish-btn w-full sm:w-auto px-2.5 py-2 sm:py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/45 text-emerald-200 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Switch to Study Planner"
                >
                  <ListTodo className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                  <span>Study Planner</span>
                </button>
              )}
              {onGoToClock && (
                <button
                  onClick={onGoToClock}
                  className="header-diminish-btn w-full sm:w-auto px-2.5 py-2 sm:py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/45 text-cyan-200 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Switch to Focus Timer"
                >
                  <Clock className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
                  <span>Focus Timer</span>
                </button>
              )}
              <button
                onClick={() => setShowMonthlyTimeReportModal(true)}
                className="header-diminish-btn w-full sm:w-auto px-2.5 py-2 sm:py-1.5 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/45 text-violet-200 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                title="Day-wise report of study time, desk break, routines, sleep & idle time in hours"
              >
                <BarChart3 className="h-3.5 w-3.5 text-violet-300 shrink-0" />
                <span>Monthly Report</span>
              </button>
              <button
                onClick={() => setShowReportMenuModal(true)}
                className="header-diminish-btn w-full sm:w-auto px-2.5 py-2 sm:py-1.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/45 text-sky-200 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                title="Download Reports (Revision Progress or Monthly Time Ledger)"
              >
                <Download className="h-3.5 w-3.5 text-sky-300 shrink-0" />
                <span>Export</span>
              </button>
              {!isActiveSubjectLocked && (
                <button
                  onClick={handleResetPlanner}
                  className="header-diminish-btn w-full sm:w-auto px-2.5 py-2 sm:py-1.5 bg-rose-500/12 hover:bg-rose-500/25 border border-rose-400/35 hover:border-rose-400/60 text-rose-200 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                  title="Reset Active Subject Report"
                >
                  <Undo2 className="h-3.5 w-3.5 text-rose-300 shrink-0" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Slim Subject Selector Strip */}
          <div className={`relative z-10 header-diminish-row grid ${levelSubjects.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-6'} gap-1.5 pt-2 border-t border-slate-700/70`}>
            {levelSubjects.map((subId, subIdx) => {
              const isActive = activeSubjectId === subId;
              const chaptersCount = (SUBJECT_CHAPTERS[subId] || []).length;
              const subStats = getSubjectStats(subId);
              const isSubLocked = Boolean(postExamLockMap[subId]?.isLocked);
              const paletteCycle = [
                {
                  active: 'bg-gradient-to-r from-cyan-500/35 to-sky-500/25 border-cyan-300 text-white shadow-[0_0_12px_rgba(6,182,212,0.28)]',
                  idle: 'bg-[#071626]/90 border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/15 hover:border-cyan-400/60',
                  bar: 'bg-cyan-400',
                },
                {
                  active: 'bg-gradient-to-r from-violet-500/35 to-purple-500/25 border-violet-300 text-white shadow-[0_0_12px_rgba(139,92,246,0.28)]',
                  idle: 'bg-[#071626]/90 border-violet-500/30 text-violet-100 hover:bg-violet-500/15 hover:border-violet-400/60',
                  bar: 'bg-violet-400',
                },
                {
                  active: 'bg-gradient-to-r from-emerald-500/35 to-teal-500/25 border-emerald-300 text-white shadow-[0_0_12px_rgba(16,185,129,0.28)]',
                  idle: 'bg-[#071626]/90 border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/15 hover:border-emerald-400/60',
                  bar: 'bg-emerald-400',
                },
                {
                  active: 'bg-gradient-to-r from-orange-500/35 to-amber-500/25 border-orange-300 text-white shadow-[0_0_12px_rgba(249,115,22,0.28)]',
                  idle: 'bg-[#071626]/90 border-orange-500/30 text-orange-100 hover:bg-orange-500/15 hover:border-orange-400/60',
                  bar: 'bg-orange-400',
                },
                {
                  active: 'bg-gradient-to-r from-pink-500/35 to-rose-500/25 border-pink-300 text-white shadow-[0_0_12px_rgba(236,72,153,0.28)]',
                  idle: 'bg-[#071626]/90 border-pink-500/30 text-pink-100 hover:bg-pink-500/15 hover:border-pink-400/60',
                  bar: 'bg-pink-400',
                },
                {
                  active: 'bg-gradient-to-r from-amber-500/35 to-yellow-500/25 border-amber-300 text-white shadow-[0_0_12px_rgba(245,158,11,0.28)]',
                  idle: 'bg-[#071626]/90 border-amber-500/30 text-amber-100 hover:bg-amber-500/15 hover:border-amber-400/60',
                  bar: 'bg-amber-400',
                },
              ];
              const subAccent = paletteCycle[subIdx % paletteCycle.length];
              return (
                <button
                  key={subId}
                  onClick={() => handleActiveSubjectChange(subId)}
                  className={`header-diminish-btn px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isActive
                      ? isSubLocked
                        ? 'bg-amber-950/50 border-amber-400 text-white shadow-xs'
                        : subAccent.active
                      : isSubLocked
                        ? 'bg-slate-950/80 border-amber-500/35 text-slate-300 hover:bg-slate-900'
                        : subAccent.idle
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <div className="flex items-center gap-1">
                      {isSubLocked && <Lock className="h-3 w-3 text-amber-400 shrink-0" />}
                      <span className={`text-xs font-black ${isActive ? 'text-white' : 'text-slate-100'}`}>{subId}</span>
                      <span className="text-[10px] font-mono text-slate-300/80">{chaptersCount}ch</span>
                    </div>
                    <span className={`text-[10px] font-mono font-extrabold tabular-nums ${
                      isSubLocked ? 'text-amber-300' : subStats.overallPct > 0 ? 'text-emerald-300' : 'text-slate-400'
                    }`}>
                      {isSubLocked ? 'Locked' : `${subStats.overallPct}%`}
                    </span>
                  </div>
                  <div className="header-diminish-hide w-full bg-slate-950/90 h-1 rounded-full overflow-hidden">
                    <div
                      className={`${isSubLocked ? 'bg-amber-400' : subAccent.bar} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${subStats.overallPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Post-Exam & 1.5-Day Sprint Completed Read-Only Lock Banner */}
      {isActiveSubjectLocked && (
        <div className="px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 text-amber-200">
            <Lock className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-300 font-mono uppercase tracking-wider">
                Final Exam &amp; 1.5-Day Sprint Completed — Read-Only Report ({activeSubjectId})
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-[10px] font-bold uppercase shrink-0 self-start sm:self-center">
            Read-Only Mode
          </span>
        </div>
      )}

      {/* Compact Filter & Search Toolbar */}
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/40 border border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'ALL', label: `All (${stats.totalChaptersCount})` },
            { id: 'BL_PENDING', label: `BL Pending (${stats.totalChaptersCount - (stats.revAggr['baseline']?.completed || 0)})` },
            ...activeDynamicRevKeys.map(rk => {
              const meta = getStageVisualMeta(rk);
              return {
                id: `${meta.short}_PENDING`,
                label: `${meta.short} Pending (${stats.totalChaptersCount - (stats.revAggr[rk]?.completed || 0)})`
              };
            }),
            { id: 'BOOST_PENDING', label: `1.5D Pending (${stats.totalChaptersCount - (stats.revAggr['rev1.5']?.completed || 0)})` },
            { id: 'CORE_DONE', label: `Revisions Done` }
          ].map(f => {
            const isSelected = selectedRevisionFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedRevisionFilter(f.id)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-mono font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            );
          })}

          {lastUpdatedMilestoneCell && lastUpdatedMilestoneCell.subjectId === activeSubjectId && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2 py-0.5 rounded ml-1">
              ✓ CH{String(lastUpdatedMilestoneCell.chapterIndex).padStart(2, '0')}·{getStageVisualMeta(lastUpdatedMilestoneCell.revKey).short} {lastUpdatedMilestoneCell.completed ? 'Done' : 'Pending'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isActiveSubjectLocked && (
            <>
              {/* Reset Column Action */}
              <button
                type="button"
                onClick={() => {
                  setManageScope('all');
                  setShowManageModal('reset');
                }}
                className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Reset Baseline, Revision, or 1.5D Boost study column"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                <span>Reset Column...</span>
              </button>

              {/* Delete Revision Round Action */}
              <button
                type="button"
                onClick={() => {
                  setManageRevNumber(1);
                  setShowManageModal('delete');
                }}
                className="px-2.5 py-1 rounded-lg border border-rose-900/50 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Completely erase a revision round (e.g. R2) and shift subsequent revisions (R3 -> R2)"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>Delete Revision Round...</span>
              </button>
            </>
          )}

          <div className="relative w-full sm:w-56 shrink-0">
            <input
              type="text"
              value={chapterSearchTerm}
              onChange={(e) => setChapterSearchTerm(e.target.value)}
              placeholder={`Filter ${activeSubjectId} chapters...`}
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 font-sans focus:outline-hidden"
            />
            {chapterSearchTerm && (
              <button
                type="button"
                onClick={() => setChapterSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active column filter badges (shown only when filters are active) */}
      {Object.entries(columnFilters).some(([_, f]) => f && f !== 'all') && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs font-mono flex-wrap">
          <span className="text-[10px] text-slate-500">Filtered columns:</span>
          {Object.entries(columnFilters).map(([k, f]) => {
            if (!f || f === 'all') return null;
            const meta = getStageVisualMeta(k);
            return (
              <span key={k} className="inline-flex items-center gap-1 text-[9.5px] bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                <span>{meta.short}: {f}</span>
                <button
                  type="button"
                  onClick={() => setColumnFilters(prev => ({ ...prev, [k]: 'all' }))}
                  className="hover:text-white cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </span>
            );
          })}
          <button
            type="button"
            onClick={() => setColumnFilters({})}
            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer ml-1"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* The Chapters Table Grid — Unified Single Column per Stage, All Columns Visible */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-2.5">
            <div className="h-6 w-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium text-slate-400">Loading revision report...</p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800">
                  <th className="py-2.5 px-3 text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider w-[34%] lg:w-[36%] border-r border-slate-800/90">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate">Chapter ({filteredSubjectChapters.length}/{stats.totalChaptersCount})</span>
                        
                        <div className="relative shrink-0" data-popover-menu="true">
                          <button
                            type="button"
                            onClick={() => setOpenHeaderMenuKey(openHeaderMenuKey === 'chapter' ? null : 'chapter')}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              sortConfig.key === 'chapter' && sortConfig.direction !== 'default'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                            }`}
                            title="Sort Chapter list"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </button>

                          {openHeaderMenuKey === 'chapter' && (
                            <div className="absolute left-0 top-full mt-1.5 z-40 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-2 w-52 text-slate-200 text-left font-sans space-y-1" data-popover-menu="true">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                                Sort Chapters
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSortConfig({ key: 'chapter', direction: 'default' });
                                  setOpenHeaderMenuKey(null);
                                }}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                  sortConfig.key === 'chapter' && sortConfig.direction === 'default' ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <span>Default Index (01 → N)</span>
                                {sortConfig.key === 'chapter' && sortConfig.direction === 'default' && <Check className="h-3 w-3 text-emerald-400" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSortConfig({ key: 'chapter', direction: 'name_asc' });
                                  setOpenHeaderMenuKey(null);
                                }}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                  sortConfig.key === 'chapter' && sortConfig.direction === 'name_asc' ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <span>Name (A → Z)</span>
                                {sortConfig.key === 'chapter' && sortConfig.direction === 'name_asc' && <Check className="h-3 w-3 text-emerald-400" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSortConfig({ key: 'chapter', direction: 'name_desc' });
                                  setOpenHeaderMenuKey(null);
                                }}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                  sortConfig.key === 'chapter' && sortConfig.direction === 'name_desc' ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <span>Name (Z → A)</span>
                                {sortConfig.key === 'chapter' && sortConfig.direction === 'name_desc' && <Check className="h-3 w-3 text-emerald-400" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSortConfig({ key: 'chapter', direction: 'hours_desc' });
                                  setOpenHeaderMenuKey(null);
                                }}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                  sortConfig.key === 'chapter' && sortConfig.direction === 'hours_desc' ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <span>Total Hrs (High → Low)</span>
                                {sortConfig.key === 'chapter' && sortConfig.direction === 'hours_desc' && <Check className="h-3 w-3 text-emerald-400" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSortConfig({ key: 'chapter', direction: 'completed_desc' });
                                  setOpenHeaderMenuKey(null);
                                }}
                                className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                  sortConfig.key === 'chapter' && sortConfig.direction === 'completed_desc' ? 'bg-emerald-950/60 text-emerald-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <span>Most Completed First</span>
                                {sortConfig.key === 'chapter' && sortConfig.direction === 'completed_desc' && <Check className="h-3 w-3 text-emerald-400" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-normal text-slate-500 shrink-0">Total Hrs</span>
                    </div>
                  </th>
                  
                  {activeAllStageKeys.map(stageKey => {
                    const meta = getStageVisualMeta(stageKey);
                    const completed = stats.revAggr[stageKey]?.completed || 0;
                    const hours = stats.revAggr[stageKey]?.hours || 0;
                    const pct = stats.totalChaptersCount > 0 ? Math.round((completed / stats.totalChaptersCount) * 100) : 0;
                    const isColumnFiltered = Boolean(columnFilters[stageKey] && columnFilters[stageKey] !== 'all');

                    return (
                      <th
                        key={`header_stage_${stageKey}`}
                        className="py-2 px-2.5 text-left border-r last:border-r-0 border-slate-800/80 font-mono"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight truncate">
                              {meta.headerTitle}
                            </span>
                            <div className="flex items-center gap-1">
                              {/* Header Filter & Sort Popover Button */}
                              <div className="relative shrink-0" data-popover-menu="true">
                                <button
                                  type="button"
                                  onClick={() => setOpenHeaderMenuKey(openHeaderMenuKey === stageKey ? null : stageKey)}
                                  className={`p-0.5 rounded transition-colors cursor-pointer ${
                                    isColumnFiltered
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                  }`}
                                  title={`Filter & Actions for ${meta.headerTitle}`}
                                >
                                  <Filter className="h-3 w-3" />
                                </button>

                                {openHeaderMenuKey === stageKey && (
                                  <div className="absolute right-0 top-full mt-1.5 z-40 bg-slate-950 border border-slate-700/90 rounded-xl shadow-2xl p-2.5 w-56 text-slate-200 text-left font-sans space-y-2" data-popover-menu="true">
                                    <div>
                                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                        Filter {meta.short} Status
                                      </span>
                                      <div className="space-y-0.5">
                                        {[
                                          { id: 'all', label: 'All Chapters' },
                                          { id: 'completed', label: '✓ Completed Only' },
                                          { id: 'partially_done', label: '◐ Partially Done Only' },
                                          { id: 'skipped', label: '⊘ Skipped Only' },
                                          { id: 'pending', label: '○ Incomplete Only' },
                                          { id: 'has_hours', label: 'Logged Hours (> 0h)' }
                                        ].map(f => (
                                          <button
                                            key={f.id}
                                            type="button"
                                            onClick={() => {
                                              setColumnFilters(prev => ({ ...prev, [stageKey]: f.id as any }));
                                              setOpenHeaderMenuKey(null);
                                            }}
                                            className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                              (columnFilters[stageKey] || 'all') === f.id
                                                ? 'bg-emerald-950/60 text-emerald-300 font-semibold'
                                                : 'hover:bg-slate-900 text-slate-300'
                                            }`}
                                          >
                                            <span>{f.label}</span>
                                            {(columnFilters[stageKey] || 'all') === f.id && <Check className="h-3 w-3 text-emerald-400" />}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="border-t border-slate-800 pt-1.5">
                                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                        Sort by {meta.short}
                                      </span>
                                      <div className="space-y-0.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSortConfig({ key: stageKey, direction: 'hours_desc' });
                                            setOpenHeaderMenuKey(null);
                                          }}
                                          className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                            sortConfig.key === stageKey && sortConfig.direction === 'hours_desc'
                                              ? 'bg-emerald-950/60 text-emerald-300 font-semibold'
                                              : 'hover:bg-slate-900 text-slate-300'
                                          }`}
                                        >
                                          <span>Hours (High → Low)</span>
                                          {sortConfig.key === stageKey && sortConfig.direction === 'hours_desc' && <Check className="h-3 w-3 text-emerald-400" />}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSortConfig({ key: stageKey, direction: 'date_desc' });
                                            setOpenHeaderMenuKey(null);
                                          }}
                                          className={`w-full text-left px-2 py-1 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                                            sortConfig.key === stageKey && sortConfig.direction === 'date_desc'
                                              ? 'bg-emerald-950/60 text-emerald-300 font-semibold'
                                              : 'hover:bg-slate-900 text-slate-300'
                                          }`}
                                        >
                                          <span>Date (Newest First)</span>
                                          {sortConfig.key === stageKey && sortConfig.direction === 'date_desc' && <Check className="h-3 w-3 text-emerald-400" />}
                                        </button>
                                      </div>
                                    </div>

                                    {!isActiveSubjectLocked && (
                                      <div className="border-t border-slate-800 pt-1.5 space-y-1">
                                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                          Column Actions
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenHeaderMenuKey(null);
                                            setManageSelectedStage(stageKey);
                                            setShowManageModal('reset');
                                          }}
                                          className="w-full text-left px-2 py-1 rounded text-xs text-amber-300 hover:bg-amber-950/40 flex items-center gap-1.5 transition cursor-pointer"
                                        >
                                          <RotateCcw className="h-3.5 w-3.5" />
                                          <span>Reset {meta.headerTitle}...</span>
                                        </button>
                                        {stageKey.startsWith('rev') && stageKey !== 'rev1.5' && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenHeaderMenuKey(null);
                                              const rNum = parseInt(stageKey.replace(/^rev/i, ''), 10) || 1;
                                              setManageRevNumber(rNum);
                                              setShowManageModal('delete');
                                            }}
                                            className="w-full text-left px-2 py-1 rounded text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-1.5 transition cursor-pointer"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>Delete {meta.short} & Shift...</span>
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <span className={`text-[10px] font-bold tabular-nums ${
                                completed > 0 ? 'text-emerald-400' : 'text-slate-500'
                              }`}>
                                {completed}/{stats.totalChaptersCount}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 tabular-nums">
                            <span>{hours.toFixed(1)}h</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-800/60">
                {filteredSubjectChapters.length === 0 ? (
                  <tr>
                    <td colSpan={1 + activeAllStageKeys.length} className="py-10 text-center text-xs font-mono text-slate-400">
                      No chapters match the current filter.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRevisionFilter('ALL');
                          setChapterSearchTerm('');
                          setColumnFilters({});
                          setSortConfig({ key: 'default', direction: 'asc' });
                        }}
                        className="text-emerald-400 underline cursor-pointer ml-1"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredSubjectChapters.map(({ name: chapterName, globalIndex: idx }) => {
                    const chCode = `CH${String(idx + 1).padStart(2, '0')}`;
                    const shortNum = String(idx + 1).padStart(2, '0');
                    const uniqueChapterScope = `${activeSubjectId}·${chCode}`;

                    // Unified single-column cell per revision stage
                    const renderRevColumn = (
                      revKey: string,
                      cycleShortTag: string
                    ) => {
                      const cellState = chaptersState[activeSubjectId]?.[chapterName]?.[revKey] || { completed: false, hours: '' };
                      const latestLogIso = getLatestLogIsoDateForRevision(chapterName, revKey, activeSubjectId);
                      
                      // Always prioritize the latest study log date unless the user explicitly set a manual override
                      const effectiveCompletionIso = cellState.isManualDateOverride
                        ? (cellState.completedAt || latestLogIso)
                        : (latestLogIso || cellState.completedAt);

                      const rawDateValue = toInputDateValue(effectiveCompletionIso);
                      const displayDateText = formatDisplayDate(effectiveCompletionIso) || formatDisplayDate(getSystemLocalDateString());
                      const isEditingThisDate = editingDateKey === `${chapterName}-${revKey}`;

                      const chapterLogsForRev = revisionLogs.filter(
                        l => l.subjectId === activeSubjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapterName && l.revKey === revKey
                      );
                      const revLoggedMins = chapterLogsForRev.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
                      const revLoggedHours = revLoggedMins > 0 ? parseFloat((revLoggedMins / 60).toFixed(2)) : 0;
                      const storedHoursVal = parseFloat(cellState.hours || '0') || 0;
                      const effectiveHoursVal = Math.max(storedHoursVal, revLoggedHours);

                      const hasTimeForStage = revLoggedHours > 0 || storedHoursVal > 0 || chapterLogsForRev.length > 0;
                      const isCompletedStatus = Boolean(cellState.completed || cellState.statusTag === 'completed');
                      const isPartiallyDone = Boolean(
                        !isCompletedStatus &&
                        (cellState.partiallyDone ||
                          cellState.statusTag === 'partially_done' ||
                          (cellState.skipped && effectiveHoursVal > 0) ||
                          (!cellState.skipped && cellState.statusTag !== 'skipped' && cellState.statusTag !== 'none' && hasTimeForStage))
                      );
                      const isSkipped = Boolean(!isCompletedStatus && !isPartiallyDone && (cellState.skipped || cellState.statusTag === 'skipped'));

                      const displayHoursValue = isSkipped 
                        ? '0' 
                        : (cellState.hours || (effectiveHoursVal > 0 ? parseFloat(effectiveHoursVal.toFixed(2)).toString() : ''));
                      const isJustUpdated =
                        lastUpdatedMilestoneCell?.subjectId === activeSubjectId &&
                        lastUpdatedMilestoneCell?.chapter === chapterName &&
                        lastUpdatedMilestoneCell?.revKey === revKey;

                      const uniqueMilestoneCode = `${chCode}·${cycleShortTag}`;

                      return (
                        <td
                          key={`${chapterName}_col_${revKey}`}
                          className={`py-1.5 px-2 align-middle border-r last:border-r-0 border-slate-800/70 transition-colors ${
                            isCompletedStatus
                              ? 'bg-emerald-950/20'
                              : isPartiallyDone
                                ? 'bg-amber-950/20'
                                : isSkipped
                                  ? 'bg-rose-950/20'
                                  : hasTimeForStage
                                    ? 'bg-slate-800/20'
                                    : ''
                          }`}
                        >
                          <div
                            className={`px-2 py-1.5 rounded-lg border transition-all flex flex-col gap-1 min-h-[58px] ${
                              isCompletedStatus
                                ? 'border-emerald-500/45 bg-emerald-500/15 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)]'
                                : isPartiallyDone
                                  ? 'border-amber-500/45 bg-amber-500/15 shadow-[inset_0_0_12px_rgba(245,158,11,0.08)]'
                                  : isSkipped
                                    ? 'border-rose-500/40 bg-rose-500/15 shadow-[inset_0_0_12px_rgba(244,63,94,0.08)]'
                                    : hasTimeForStage
                                      ? 'border-slate-700/80 bg-slate-900/60'
                                      : 'border-slate-800/60 bg-slate-950/40 hover:border-slate-700/70'
                            } ${isJustUpdated ? 'ring-1 ring-emerald-400/70' : ''}`}
                          >
                            {/* Top Row: Completion Toggle + Hours Input */}
                            <div className="flex items-center justify-between gap-1.5">
                              {hasTimeForStage || isCompletedStatus || isPartiallyDone || isSkipped ? (
                                <button
                                  type="button"
                                  disabled={isActiveSubjectLocked}
                                  onClick={() => !isActiveSubjectLocked && handleToggleCompleted(activeSubjectId, chapterName, revKey)}
                                  className={`p-0.5 rounded transition-colors focus:outline-hidden shrink-0 flex items-center gap-1 ${
                                    isActiveSubjectLocked ? 'cursor-not-allowed opacity-85' : 'hover:bg-slate-800/80 cursor-pointer'
                                  }`}
                                  title={
                                    isActiveSubjectLocked
                                      ? `${activeSubjectId} Revision Report is locked (Read-Only)`
                                      : `${activeSubjectId} ${uniqueMilestoneCode} (${chapterName}) — ${isCompletedStatus ? 'Mark Incomplete' : 'Mark Completed'}`
                                  }
                                >
                                  {isCompletedStatus ? (
                                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                                  ) : isPartiallyDone ? (
                                    <span className="h-3.5 w-3.5 m-[1px] rounded-[3px] bg-amber-400 border border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.45)] inline-block shrink-0" />
                                  ) : isSkipped ? (
                                    <span className="h-3.5 w-3.5 m-[1px] rounded-[3px] bg-rose-400/40 border border-rose-400/80 inline-block shrink-0" />
                                  ) : (
                                    <Square className="h-4 w-4 text-slate-400 hover:text-slate-200" />
                                  )}
                                </button>
                              ) : (
                                <span
                                  className="p-0.5 text-slate-700 select-none shrink-0 flex items-center"
                                  title="Log study hours first or use status tag to mark this stage"
                                >
                                  <Square className="h-4 w-4 text-slate-800" />
                                </span>
                              )}

                              <div className="flex items-center gap-0.5 min-w-0">
                                <input
                                  type="text"
                                  maxLength={5}
                                  readOnly={isActiveSubjectLocked}
                                  disabled={isActiveSubjectLocked}
                                  value={displayHoursValue}
                                  placeholder="0.0"
                                  onBlur={() => !isActiveSubjectLocked && handleHoursBlur(activeSubjectId, chapterName, revKey)}
                                  onChange={(e) => !isActiveSubjectLocked && handleHoursChange(activeSubjectId, chapterName, revKey, e.target.value)}
                                  className={`w-12 border text-[11px] text-center font-mono font-semibold tabular-nums py-0.5 px-1 rounded focus:outline-hidden transition-colors ${
                                    isActiveSubjectLocked ? 'cursor-not-allowed opacity-85 ' : ''
                                  }${
                                    isCompletedStatus
                                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 focus:border-emerald-400'
                                      : isPartiallyDone
                                        ? 'bg-amber-950/70 border-amber-500/45 text-amber-200 focus:border-amber-400'
                                        : isSkipped
                                          ? 'bg-rose-950/70 border-rose-500/40 text-rose-300 focus:border-rose-400'
                                          : hasTimeForStage
                                            ? 'bg-slate-950/90 border-slate-700 text-slate-200 focus:border-slate-500'
                                            : 'bg-slate-950/90 border-slate-800/80 text-slate-400 placeholder-slate-700 focus:border-slate-600'
                                  }`}
                                  title={
                                    isActiveSubjectLocked
                                      ? 'Revision Report locked (Read-Only)'
                                      : revLoggedHours > 0
                                        ? `Auto-calculated from ${chapterLogsForRev.length} study logs (${revLoggedHours} hrs)`
                                        : `Enter study hours for ${uniqueMilestoneCode}`
                                  }
                                />
                                <span className="text-[9px] font-mono text-slate-500 select-none">h</span>
                              </div>
                            </div>

                            {/* Bottom Row: Completion Date or Status + Status Tag Pill */}
                            <div className="flex items-center justify-between gap-1 min-h-[16px]">
                              {/* Left side: Date / Status string */}
                              <div className="min-w-0 flex-1 flex items-center">
                                {isCompletedStatus ? (
                                  isEditingThisDate && !isActiveSubjectLocked ? (
                                    <input
                                      type="date"
                                      value={rawDateValue}
                                      onChange={(e) => handleDateChange(activeSubjectId, chapterName, revKey, e.target.value)}
                                      onBlur={() => setEditingDateKey(null)}
                                      autoFocus
                                      className="text-[9px] font-mono tabular-nums bg-slate-950 border border-emerald-500/50 text-emerald-300 rounded px-1 py-0 focus:outline-hidden w-full text-center cursor-pointer"
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={isActiveSubjectLocked}
                                      onClick={() => !isActiveSubjectLocked && setEditingDateKey(`${chapterName}-${revKey}`)}
                                      className={`text-[9.5px] font-mono tabular-nums text-emerald-400/90 font-medium truncate select-none ${
                                        isActiveSubjectLocked ? 'cursor-default' : 'hover:text-emerald-300 cursor-pointer'
                                      }`}
                                      title={
                                        isActiveSubjectLocked
                                          ? 'Revision Report locked (Read-Only)'
                                          : latestLogIso && !cellState.isManualDateOverride
                                            ? `Extracted from latest study log (${latestLogIso}) · Click to override`
                                            : 'Click to edit completion date'
                                      }
                                    >
                                      {displayDateText}
                                    </button>
                                  )
                                ) : isPartiallyDone ? (
                                  <span className="text-[9px] font-mono text-amber-300/90 font-medium truncate select-none">
                                    {latestLogIso ? formatDisplayDate(latestLogIso) : 'Partly done'}
                                  </span>
                                ) : isSkipped ? (
                                  <span className="text-[9px] font-mono text-rose-300/90 font-medium truncate select-none">
                                    Skipped
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono text-slate-500 truncate select-none">
                                    {latestLogIso ? formatDisplayDate(latestLogIso) : hasTimeForStage ? 'In progress' : '—'}
                                  </span>
                                )}
                              </div>

                              {/* Right side: Clickable Status Tag Badge */}
                              <div className="relative shrink-0" data-popover-menu="true">
                                {isCompletedStatus ? (
                                  <button
                                    type="button"
                                    disabled={isActiveSubjectLocked}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isActiveSubjectLocked) return;
                                      setActiveCellMenu(activeCellMenu?.chapter === chapterName && activeCellMenu?.revKey === revKey ? null : { chapter: chapterName, revKey });
                                    }}
                                    className={`px-1 py-0.2 rounded text-[8.5px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 transition-colors shrink-0 flex items-center gap-0.5 ${
                                      isActiveSubjectLocked ? 'cursor-default' : 'hover:bg-emerald-900/60 cursor-pointer'
                                    }`}
                                    title={isActiveSubjectLocked ? 'Status: Completed (Locked)' : 'Status: Completed (✓). Click to change'}
                                  >
                                    <span>✓</span>
                                    <span>Done</span>
                                  </button>
                                ) : isPartiallyDone ? (
                                  <button
                                    type="button"
                                    disabled={isActiveSubjectLocked}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isActiveSubjectLocked) return;
                                      setActiveCellMenu(activeCellMenu?.chapter === chapterName && activeCellMenu?.revKey === revKey ? null : { chapter: chapterName, revKey });
                                    }}
                                    className={`px-1 py-0.2 rounded text-[8.5px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 transition-colors shrink-0 flex items-center gap-0.5 ${
                                      isActiveSubjectLocked ? 'cursor-default' : 'hover:bg-amber-900/60 cursor-pointer'
                                    }`}
                                    title={isActiveSubjectLocked ? 'Status: Partially Done (Locked)' : 'Status: Partially Done (◐). Click to change'}
                                  >
                                    <span>◐</span>
                                    <span>Part</span>
                                  </button>
                                ) : isSkipped ? (
                                  <button
                                    type="button"
                                    disabled={isActiveSubjectLocked}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isActiveSubjectLocked) return;
                                      setActiveCellMenu(activeCellMenu?.chapter === chapterName && activeCellMenu?.revKey === revKey ? null : { chapter: chapterName, revKey });
                                    }}
                                    className={`px-1 py-0.2 rounded text-[8.5px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 transition-colors shrink-0 flex items-center gap-0.5 ${
                                      isActiveSubjectLocked ? 'cursor-default' : 'hover:bg-rose-900/60 cursor-pointer'
                                    }`}
                                    title={isActiveSubjectLocked ? 'Status: Skipped (Locked)' : 'Status: Skipped (⊘). Click to change'}
                                  >
                                    <span>⊘</span>
                                    <span>Skip</span>
                                  </button>
                                ) : !isActiveSubjectLocked ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveCellMenu(activeCellMenu?.chapter === chapterName && activeCellMenu?.revKey === revKey ? null : { chapter: chapterName, revKey });
                                    }}
                                    className="px-1 py-0.2 rounded text-[8.5px] font-mono text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer"
                                    title="Click to set status (Done, Partial, Skip)"
                                  >
                                    +tag
                                  </button>
                                ) : null}

                                {/* Cell Status Popover */}
                                {!isActiveSubjectLocked && activeCellMenu?.chapter === chapterName && activeCellMenu?.revKey === revKey && (
                                  <div 
                                    className="absolute right-0 bottom-full mb-1 z-30 bg-slate-950 border border-slate-700 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 min-w-[115px] text-left"
                                    data-popover-menu="true"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSetCellStatus(chapterName, revKey, 'completed');
                                        setActiveCellMenu(null);
                                      }}
                                      className="px-2 py-1 rounded hover:bg-emerald-950/60 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <span>✓</span>
                                      <span>Completed</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSetCellStatus(chapterName, revKey, 'partially_done');
                                        setActiveCellMenu(null);
                                      }}
                                      className="px-2 py-1 rounded hover:bg-amber-950/60 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <span>◐</span>
                                      <span>Partially Done</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSetCellStatus(chapterName, revKey, 'skipped');
                                        setActiveCellMenu(null);
                                      }}
                                      className="px-2 py-1 rounded hover:bg-rose-950/60 text-[10px] font-mono font-bold text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <span>⊘</span>
                                      <span>Skipped</span>
                                    </button>
                                    <div className="h-px bg-slate-800 my-0.5" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleSetCellStatus(chapterName, revKey, 'none');
                                        setActiveCellMenu(null);
                                      }}
                                      className="px-2 py-1 rounded hover:bg-rose-950/40 text-[10px] font-mono text-slate-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                      <span>✕</span>
                                      <span>Clear Status</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    };

                    const allStagesDone = activeAllStageKeys.every(
                      rk => Boolean(chaptersState[activeSubjectId]?.[chapterName]?.[rk]?.completed)
                    );

                    const isExpanded = !!expandedChapters[chapterName];
                    const chapterLogs = revisionLogs.filter(
                      l => l.subjectId === activeSubjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === chapterName
                    );

                    // Calculate total chapter hours across all stages (Baseline + Revisions + 1.5D Boost)
                    const totalChapterHours = activeAllStageKeys.reduce((sumHrs, sKey) => {
                      const cState = chaptersState[activeSubjectId]?.[chapterName]?.[sKey];
                      const sLogs = chapterLogs.filter(l => l.revKey === sKey);
                      const lMins = sLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
                      const lHrs = lMins > 0 ? lMins / 60 : 0;
                      const stHrs = cState ? (parseFloat(cState.hours || '0') || 0) : 0;
                      if (cState?.skipped && Math.max(stHrs, lHrs) <= 0) return sumHrs;
                      return sumHrs + Math.max(stHrs, lHrs);
                    }, 0);

                    return (
                      <React.Fragment key={`${activeSubjectId}_${chapterName}`}>
                        <tr 
                          className={`transition-colors font-sans group ${
                            isExpanded
                              ? 'bg-slate-800/40'
                              : allStagesDone
                                ? 'bg-emerald-950/10 hover:bg-emerald-950/20'
                                : idx % 2 === 0
                                  ? 'bg-slate-900/20 hover:bg-slate-800/30'
                                  : 'bg-transparent hover:bg-slate-800/30'
                          }`}
                        >
                          {/* Compact Chapter Column */}
                          <td className="py-2 px-3 align-middle border-r border-slate-800/80">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedChapters(prev => ({
                                      ...prev,
                                      [chapterName]: !prev[chapterName]
                                    }));
                                  }}
                                  className="p-0.5 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-200 transition cursor-pointer shrink-0"
                                  title={isExpanded ? "Collapse Chapter Study Logs" : "Expand Chapter Study Logs"}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>

                                <span
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 tabular-nums ${
                                    allStagesDone
                                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                                      : 'bg-slate-800/80 text-slate-400 border-slate-700/70'
                                  }`}
                                >
                                  {shortNum}
                                </span>

                                <span
                                  onClick={() => {
                                    setExpandedChapters(prev => ({
                                      ...prev,
                                      [chapterName]: !prev[chapterName]
                                    }));
                                  }}
                                  className="text-xs font-semibold text-slate-100 hover:text-white cursor-pointer select-none leading-snug line-clamp-2"
                                  title={`${chapterName} — Click to toggle study logs`}
                                >
                                  {chapterName}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {chapterLogs.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExpandedChapters(prev => ({
                                        ...prev,
                                        [chapterName]: !prev[chapterName]
                                      }));
                                    }}
                                    className="text-[10px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded cursor-pointer tabular-nums"
                                    title="View or reallocate study logs"
                                  >
                                    {chapterLogs.length} log{chapterLogs.length !== 1 ? 's' : ''}
                                  </button>
                                )}
                                <span
                                  className={`text-[10.5px] font-mono font-bold px-1.5 py-0.5 rounded border tabular-nums ${
                                    totalChapterHours > 0
                                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/25'
                                      : 'bg-slate-900/60 text-slate-500 border-slate-800/80'
                                  }`}
                                >
                                  {totalChapterHours > 0 ? `${parseFloat(totalChapterHours.toFixed(1))}h` : '0h'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Render Baseline + Dynamic R1..RN + Fixed 1.5D Stage Cells */}
                          {activeAllStageKeys.map(stageKey => {
                            const meta = getStageVisualMeta(stageKey);
                            return renderRevColumn(stageKey, meta.short);
                          })}
                        </tr>

                        {/* Expandable row showing separate level logs inline with Drag & Drop aligned 1:1 with stage columns */}
                        {isExpanded && (
                          <tr className="bg-slate-950/90 border-t border-b border-slate-800/90">
                            {/* First cell aligned with Chapter column */}
                            <td className="py-2 px-3 align-top border-r border-slate-800/80">
                              <div className="px-2.5 py-2 rounded-lg border border-slate-800/80 bg-slate-900/50 space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-mono font-bold text-slate-200">
                                    {uniqueChapterScope} · Study Logs
                                  </span>
                                  <span className="text-[9.5px] font-mono tabular-nums text-emerald-400 font-semibold">
                                    {chapterLogs.length} total log{chapterLogs.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Stage log cells aligned 1:1 with Baseline, Revision 1..N, and 1.5D Boost columns */}
                            {activeAllStageKeys.map((stageKey) => {
                              const meta = getStageVisualMeta(stageKey);
                              const levelLogs = chapterLogs.filter(l => l.revKey === stageKey);
                              const cState = chaptersState[activeSubjectId]?.[chapterName]?.[stageKey];
                              const stHrs = cState ? (parseFloat(cState.hours || '0') || 0) : 0;
                              const isDone = Boolean(cState?.completed || cState?.statusTag === 'completed');
                              const isPart = Boolean(
                                !isDone &&
                                (cState?.partiallyDone ||
                                  cState?.statusTag === 'partially_done' ||
                                  (cState?.skipped && (stHrs > 0 || levelLogs.length > 0)) ||
                                  (!cState?.skipped && cState?.statusTag !== 'skipped' && cState?.statusTag !== 'none' && (stHrs > 0 || levelLogs.length > 0)))
                              );
                              const isSkip = Boolean(!isDone && !isPart && (cState?.skipped || cState?.statusTag === 'skipped'));
                              const colKey = `${chapterName}-${stageKey}`;
                              const isDragOverThis = dragOverColumn === colKey;

                              return (
                                <td
                                  key={`${chapterName}_logs_${stageKey}`}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                    if (dragOverColumn !== colKey) setDragOverColumn(colKey);
                                  }}
                                  onDragLeave={() => {
                                    if (dragOverColumn === colKey) setDragOverColumn(null);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOverColumn(null);
                                    const logId = e.dataTransfer.getData('text/plain') || draggedLogId;
                                    if (logId) {
                                      handleMoveLog(logId, stageKey, chapterName, activeSubjectId);
                                    }
                                  }}
                                  className={`py-2 px-2 align-top border-r last:border-r-0 border-slate-800/70 transition-colors ${
                                    isDragOverThis
                                      ? 'bg-emerald-950/25'
                                      : isDone
                                        ? 'bg-emerald-950/15'
                                        : isPart
                                          ? 'bg-amber-950/15'
                                          : isSkip
                                            ? 'bg-rose-950/15'
                                            : ''
                                  }`}
                                >
                                  <div
                                    className={`px-2 py-1.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 min-h-[76px] ${
                                      isDragOverThis
                                        ? 'border-emerald-500 bg-emerald-950/30'
                                        : isDone
                                          ? 'border-emerald-500/35 bg-emerald-500/10'
                                          : isPart
                                            ? 'border-amber-500/35 bg-amber-500/10'
                                            : isSkip
                                              ? 'border-rose-500/35 bg-rose-500/10'
                                              : 'border-slate-800/80 bg-slate-900/40'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 mb-1.5 gap-1">
                                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300 truncate">
                                          {meta.short} Logs
                                        </span>
                                        <span className="text-[9px] font-mono tabular-nums text-slate-400 font-semibold shrink-0">
                                          {levelLogs.length}
                                        </span>
                                      </div>

                                      {levelLogs.length === 0 ? (
                                        <div
                                          className={`text-[9px] italic py-3 text-center font-mono border border-dashed rounded transition-colors ${
                                            isDragOverThis
                                              ? 'border-emerald-500/60 text-emerald-300 bg-emerald-500/10'
                                              : 'border-slate-800/80 text-slate-600'
                                          }`}
                                        >
                                          {isDragOverThis ? 'Drop here' : 'No logs'}
                                        </div>
                                      ) : (
                                        <div className="space-y-1 max-h-[140px] overflow-y-auto pr-0.5 scrollbar-thin">
                                          {levelLogs.map((log) => {
                                            const formatted = formatLogTimePeriod(log.timestamp, log.durationMinutes);
                                            return (
                                              <div
                                                key={log.id}
                                                draggable={!isActiveSubjectLocked}
                                                onDragStart={(e) => {
                                                  if (isActiveSubjectLocked) {
                                                    e.preventDefault();
                                                    return;
                                                  }
                                                  e.dataTransfer.setData('text/plain', log.id);
                                                  e.dataTransfer.effectAllowed = 'move';
                                                  setDraggedLogId(log.id);
                                                }}
                                                onDragEnd={() => {
                                                  setDraggedLogId(null);
                                                  setDragOverColumn(null);
                                                }}
                                                className={`px-1.5 py-1 bg-slate-950/90 border border-slate-800 rounded flex items-center justify-between gap-1 text-[9px] font-mono text-slate-300 transition-all ${
                                                  isActiveSubjectLocked ? 'cursor-default' : 'hover:border-slate-700 cursor-grab active:cursor-grabbing'
                                                } ${
                                                  draggedLogId === log.id ? 'opacity-40 border-dashed border-emerald-400' : ''
                                                }`}
                                                title={
                                                  isActiveSubjectLocked
                                                    ? `${formatted.date} (${formatted.timeRange}) — Locked (Read-Only)`
                                                    : `${formatted.date} (${formatted.timeRange}) — Drag to move log to another stage`
                                                }
                                              >
                                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                                  {!isActiveSubjectLocked && <GripVertical className="h-3 w-3 text-slate-600 shrink-0" />}
                                                  <div className="min-w-0 flex-1 text-left">
                                                    <p className="text-slate-200 font-semibold text-[9px] leading-tight truncate">
                                                      {formatted.date}
                                                    </p>
                                                    <p className="text-slate-500 text-[8px] leading-tight truncate">
                                                      {formatted.timeRange}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                  <span className="font-bold text-emerald-400 text-[9px] tabular-nums">
                                                    {formatStaticDuration(log.durationMinutes, 'minutes')}
                                                  </span>
                                                  {!isActiveSubjectLocked && (
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setLogToDelete(log);
                                                        setShowDeleteConfirm(true);
                                                      }}
                                                      className="p-0.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                                      title="Delete log"
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>

                                    <div className="text-[8.5px] font-mono text-slate-500 border-t border-slate-800/70 pt-1 flex items-center justify-between">
                                      <span className="truncate">{chCode}·{meta.short}</span>
                                      <span
                                        className={
                                          isDone
                                            ? 'text-emerald-400 font-semibold'
                                            : isPart
                                              ? 'text-amber-300 font-semibold'
                                              : isSkip
                                                ? 'text-rose-300 font-semibold'
                                                : 'text-slate-500'
                                        }
                                      >
                                        {isDone ? '✓ Done' : isPart ? '◐ Part' : isSkip ? '⊘ Skip' : 'Pending'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Study Logs Modal */}
      {showLogsModal && selectedChapterForLogs && (
        <ModalPortal>
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">{activeSubjectId} Revision Logs</span>
                <h3 className="text-sm font-black text-white leading-tight">{selectedChapterForLogs}</h3>
              </div>
              <button 
                onClick={() => {
                  setShowLogsModal(false);
                  setSelectedChapterForLogs(null);
                }}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[50vh]">
              {(() => {
                const logs = revisionLogs.filter(l => l.subjectId === activeSubjectId && getCanonicalChapterKey(l.subjectId, l.chapterName) === selectedChapterForLogs);
                if (logs.length === 0) {
                  return (
                    <div className="text-center py-8 px-4 space-y-2.5">
                      <Clock className="h-8 w-8 text-slate-600 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                        No focus sessions have been allocated to this chapter yet.
                      </p>
                    </div>
                  );
                }

                return logs.map((log) => {
                  const stageMeta = getStageVisualMeta(log.revKey);

                  return (
                    <div key={log.id} className="p-3.5 bg-slate-950/60 border border-slate-850/80 rounded-lg flex items-start justify-between gap-3 group hover:border-slate-800 transition-all">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 border rounded ${stageMeta.modalBadge}`}>
                            {stageMeta.label}
                          </span>
                          <span className="text-xs font-black text-white font-mono tabular-nums shrink-0">
                            {formatStaticDuration(log.durationMinutes, 'minutes')}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-medium text-slate-300 leading-normal line-clamp-2">
                            {log.taskTitle || 'Linked study focus block'}
                          </p>
                          <p className="text-[9.5px] text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLogToDelete(log);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all shrink-0 cursor-pointer"
                        title="Delete this study log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950/50 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => {
                  setShowLogsModal(false);
                  setSelectedChapterForLogs(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && logToDelete && (
        <ModalPortal>
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-3xl text-center">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-white">Delete Study Log?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete this log of <strong>{formatStaticDuration(logToDelete.durationMinutes, 'minutes')}</strong>?
              </p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                This will subtract <strong>{formatStaticDuration(logToDelete.durationMinutes, 'minutes')}</strong> from the chapter's revision count. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLogToDelete(null);
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLog(logToDelete)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-lg shadow-sm shadow-rose-600/10 transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Comprehensive Action Confirmation Modal (for Column Reset & Revision Delete) */}
      {actionConfirmModal && actionConfirmModal.isOpen && (
        <ModalPortal>
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-[80] p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-3xl text-center">
              <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto border ${
                actionConfirmModal.type === 'delete_revision'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {actionConfirmModal.type === 'delete_revision' ? (
                  <Trash2 className="h-7 w-7" />
                ) : (
                  <AlertTriangle className="h-7 w-7" />
                )}
              </div>

              <div className="space-y-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                  actionConfirmModal.type === 'delete_revision'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  Confirmation Required
                </span>

                <h3 className="text-base font-black text-white">
                  {actionConfirmModal.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {actionConfirmModal.description}
                </p>

                {actionConfirmModal.scopeText && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                    <span className="text-slate-500">Scope: </span>
                    <strong className="text-white">{actionConfirmModal.scopeText}</strong>
                  </div>
                )}

                <p className="text-[10.5px] font-mono text-rose-400/90 bg-rose-950/20 border border-rose-900/40 p-2 rounded-lg leading-relaxed">
                  ⚠️ This action is permanent and completely irreversible.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActionConfirmModal(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const onConf = actionConfirmModal.onConfirm;
                    setActionConfirmModal(null);
                    await onConf();
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg transition cursor-pointer ${
                    actionConfirmModal.type === 'delete_revision'
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  }`}
                >
                  Confirm & Execute
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Management Modal Hub (Reset Column, Delete Revision Round, Batch Tag) */}
      {showManageModal && (
        <ModalPortal>
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-[75] p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200 relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${
                    showManageModal === 'delete'
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      : showManageModal === 'reset'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {showManageModal === 'delete' ? (
                      <Trash2 className="h-5 w-5" />
                    ) : showManageModal === 'reset' ? (
                      <RotateCcw className="h-5 w-5" />
                    ) : (
                      <BookmarkCheck className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {showManageModal === 'delete'
                        ? 'Delete Revision Round'
                        : showManageModal === 'reset'
                          ? 'Reset Column Progress'
                          : 'Batch Tag Status'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Subject: <strong className="text-slate-200">{activeSubjectId}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManageModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Reset Column Flow */}
              {showManageModal === 'reset' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      1. Select Column to Reset
                    </label>
                    <select
                      value={manageSelectedStage}
                      onChange={(e) => setManageSelectedStage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-slate-500"
                    >
                      <option value="baseline">Baseline Study</option>
                      {activeDynamicRevKeys.map(rk => {
                        const meta = getStageVisualMeta(rk);
                        return <option key={rk} value={rk}>{meta.label} ({meta.short})</option>;
                      })}
                      <option value="rev1.5">1.5D Boost Study</option>
                      <option value="ALL_STAGES">All Columns (Full Subject Reset)</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">RESET TARGET</span>
                    <span>All {stats.totalChaptersCount} chapters of <strong>{activeSubjectId}</strong> will be reset for this column.</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const stageLabel = manageSelectedStage === 'ALL_STAGES'
                          ? 'All Stages (Full Reset)'
                          : getStageVisualMeta(manageSelectedStage).label;
                        
                        const targetChaps = (SUBJECT_CHAPTERS[activeSubjectId] || []);

                        setShowManageModal(null);
                        setActionConfirmModal({
                          isOpen: true,
                          type: 'reset_column',
                          title: `Confirm Reset: ${stageLabel}`,
                          description: `Are you sure you want to completely reset the "${stageLabel}" column for ${activeSubjectId}? All completion checkmarks, study hours, tags, and study logs for these chapters will be wiped out.`,
                          scopeText: `All ${targetChaps.length} chapters in ${activeSubjectId}`,
                          targetChapters: targetChaps,
                          stageKey: manageSelectedStage,
                          onConfirm: () => executeResetColumn(manageSelectedStage, targetChaps)
                        });
                      }}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-amber-600/20"
                    >
                      Proceed to Confirmation
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Revision Round Flow */}
              {showManageModal === 'delete' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      1. Select Revision Round to Permanently Erase
                    </label>
                    <div className="space-y-1.5 font-mono text-xs">
                      {activeDynamicRevKeys.map(rk => {
                        const rNum = parseInt(rk.replace(/^rev/i, ''), 10) || 1;
                        const meta = getStageVisualMeta(rk);
                        const isSelected = manageRevNumber === rNum;
                        return (
                          <button
                            key={rk}
                            type="button"
                            onClick={() => setManageRevNumber(rNum)}
                            className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-white">{meta.label} ({meta.short})</span>
                              <span className="text-[10px] text-slate-500 ml-2">
                                {stats.revAggr[rk]?.completed || 0}/{stats.totalChaptersCount} done
                              </span>
                            </div>
                            {isSelected && <Check className="h-4 w-4 text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Shift Preview */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                    <div className="font-mono text-slate-300 font-semibold">Shift & Renumber Preview:</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      • <strong>R{manageRevNumber}</strong> will be erased from the report completely.
                    </p>
                    {manageRevNumber < activeRevisionsCount && (
                      <p className="text-[11px] text-emerald-400 leading-relaxed font-mono">
                        • <strong>R{manageRevNumber + 1}</strong> will automatically shift into R{manageRevNumber}'s position!
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      • Total revisions for <strong>{activeSubjectId}</strong> will reduce from <strong>{activeRevisionsCount}</strong> to <strong>{Math.max(1, activeRevisionsCount - 1)}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      • Future revisions will sequentially append as the next round.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetRev = manageRevNumber;
                        const meta = getStageVisualMeta(`rev${targetRev}`);
                        setShowManageModal(null);
                        setActionConfirmModal({
                          isOpen: true,
                          type: 'delete_revision',
                          title: `Confirm Delete: ${meta.label} (${meta.short})`,
                          description: `Are you sure you want to delete ${meta.label} for ${activeSubjectId}? This revision will be completely erased from the report. Subsequent revisions (e.g. R${targetRev + 1} → R${targetRev}) will shift down into its place, and total revisions for ${activeSubjectId} will become ${Math.max(1, activeRevisionsCount - 1)}.`,
                          scopeText: `Subject: ${activeSubjectId} · Deleting Revision ${targetRev}`,
                          targetChapters: SUBJECT_CHAPTERS[activeSubjectId] || [],
                          revNumberToDelete: targetRev,
                          onConfirm: () => executeDeleteRevisionRound(targetRev)
                        });
                      }}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-rose-600/20"
                    >
                      Proceed to Delete Confirmation
                    </button>
                  </div>
                </div>
              )}


            </div>
          </div>
        </ModalPortal>
      )}

      {/* Legacy Reset All Confirmation Popup */}
      {showResetConfirm && (
        <ModalPortal>
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-900 border border-slate-850 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-3xl text-center">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-white">Reset Revision Report?</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Are you sure you want to reset all revision records for <strong className="text-white">{activeSubjectId}</strong>?
              </p>
              <p className="text-[10px] text-slate-450 leading-relaxed font-mono">
                This will wipe out all completion checkboxes, manual edits, and logs for the active subject. This action is completely irreversible.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeResetPlanner}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-lg shadow-sm shadow-rose-600/10 transition cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Completion Restriction Popup Modal */}
      {showRestrictionModal && restrictionInfo && (
        <ModalPortal>
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-[70] p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Completion Restriction
              </span>
              <h3 className="text-base font-black text-white pt-1">
                Logged Time Required
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                No study logs recorded for <strong className="text-amber-300">{restrictionInfo.chapter}</strong> (<strong className="text-white">{restrictionInfo.revLabel}</strong>).
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowRestrictionModal(false);
                  setRestrictionInfo(null);
                }}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Report Selection Hub Modal */}
      {showReportMenuModal && (
        <ModalPortal>
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-[70] p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-slate-200 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-display text-white">
                    Select Academic Report
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowReportMenuModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Revision Progress PDF */}
              <button
                onClick={() => {
                  setShowReportMenuModal(false);
                  handleExportPdf();
                }}
                className="w-full text-left p-4 rounded-xl bg-slate-950 hover:bg-slate-850/80 border border-slate-800 hover:border-indigo-500/40 transition group cursor-pointer flex items-start gap-3.5 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm group-hover:text-indigo-300 transition-colors">
                      CA Final Revision Progress Report
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                      PDF
                    </span>
                  </div>
                </div>
              </button>

              {/* Option 2: Monthly 24-Hour Time Ledger Report */}
              <button
                onClick={() => {
                  setShowReportMenuModal(false);
                  setShowMonthlyTimeReportModal(true);
                }}
                className="w-full text-left p-4 rounded-xl bg-slate-950 hover:bg-slate-850/80 border border-slate-800 hover:border-amber-500/40 transition group cursor-pointer flex items-center gap-3.5 shadow-xs"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                      Monthly 24-Hour Time Ledger Report
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                      Unit: Hours · PDF
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowReportMenuModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Monthly 24h Time Ledger Modal */}
      {showMonthlyTimeReportModal && (
        <MonthlyTimeReportModal
          onClose={() => setShowMonthlyTimeReportModal(false)}
        />
      )}

      {/* Configure Subject Hourly Targets Modal */}
      {showSubjectTargetModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn font-sans">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-5 shadow-2xl text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-amber-400" />
                  <h3 className="font-display font-bold text-white text-base">
                    Configure Subject Hourly Targets
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubjectTargetModal(false)}
                  className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
                  Quick Target Bundles
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...tempModalTargets };
                      levelSubjects.forEach(s => { next[s] = DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100; });
                      setTempModalTargets(next);
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-slate-200 block text-[11px]">ICAI Standard</span>
                    <span className="text-[10px] text-amber-400">
                      {levelSubjects.reduce((acc, s) => acc + (DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100), 0)} hrs total
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...tempModalTargets };
                      levelSubjects.forEach(s => { next[s] = Math.round((DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100) * 1.3); });
                      setTempModalTargets(next);
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-slate-200 block text-[11px]">Ranker Sprint</span>
                    <span className="text-[10px] text-amber-400">
                      {levelSubjects.reduce((acc, s) => acc + Math.round((DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100) * 1.3), 0)} hrs total
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...tempModalTargets };
                      levelSubjects.forEach(s => { next[s] = Math.round((DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100) * 0.6); });
                      setTempModalTargets(next);
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-slate-200 block text-[11px]">60-Day Sprint</span>
                    <span className="text-[10px] text-amber-400">
                      {levelSubjects.reduce((acc, s) => acc + Math.round((DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100) * 0.6), 0)} hrs total
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...tempModalTargets };
                      levelSubjects.forEach(s => { next[s] = Math.round((DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100) * 0.4); });
                      setTempModalTargets(next);
                    }}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-slate-200 block text-[11px]">Express Track</span>
                    <span className="text-[10px] text-amber-400">
                      {levelSubjects.reduce((acc, s) => acc + Math.round((DEFAULT_SUBJECT_HOURLY_TARGETS[s] || 100) * 0.4), 0)} hrs total
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {levelSubjects.map((subId) => {
                  const targetVal = tempModalTargets[subId] || DEFAULT_SUBJECT_HOURLY_TARGETS[subId] || 100;
                  const meta = SUBJECTS_METADATA[subId];
                  const subColor = meta?.colorCode || '#00D2FF';
                  return (
                    <div
                      key={subId}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: subColor }}
                        />
                        <div>
                          <span className="font-bold text-white text-xs block">{subId}</span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                            {meta?.fullName || subId}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <input
                          type="range"
                          min="20"
                          max="300"
                          step="5"
                          value={targetVal}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setTempModalTargets((prev) => ({ ...prev, [subId]: val }));
                          }}
                          className="w-28 sm:w-36 h-1.5 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-amber-400"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="5"
                            max="500"
                            value={targetVal}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 5;
                              setTempModalTargets((prev) => ({ ...prev, [subId]: val }));
                            }}
                            className="w-14 px-1.5 py-0.5 text-center bg-slate-900 border border-slate-700 rounded text-xs font-bold text-amber-400 outline-none focus:border-amber-400 tabular-nums"
                          />
                          <span className="text-[10px] text-slate-400">hrs</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs font-mono p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Total Curriculum Target:</span>
                <span className="font-black text-amber-400 text-sm font-sans tabular-nums">
                  {levelSubjects.reduce((a: number, s: SubjectId) => a + (Number(tempModalTargets[s] ?? DEFAULT_SUBJECT_HOURLY_TARGETS[s]) || 0), 0)} Hours
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSubjectTargetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSubjectTargets(tempModalTargets)}
                  className="px-5 py-2 rounded-xl bg-cav-accent text-slate-950 font-black text-xs font-sans hover:brightness-110 transition cursor-pointer shadow-md"
                >
                  Save All Targets
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
