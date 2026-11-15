/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SubjectId,
  GoogleTask,
  FocusSession,
  FOUNDATION_SUBJECT_IDS,
  INTERMEDIATE_SUBJECT_IDS,
  FINAL_SUBJECT_IDS
} from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { CALevel, getSelectedCALevel } from '../data/curriculumLevels';
import {
  getLevelSubjectIds,
  getDefaultSubjectForLevel,
  getLevelScopedKey
} from './levelStorage';

export type StudyPhaseId = 'baseline' | 'rev1' | 'rev2' | 'rev3';
export type ABCCategory = 'A' | 'B' | 'C';
export type ChapterConfidenceLevel = 'low' | 'medium' | 'high';
export type SubjectSequencingMode = 'single_subject' | 'daily_pair' | 'group_wise' | 'consolidated';
export type MilestoneCompletionCondition = 'targets_only' | 'mock_test_required';
export type DayOfWeekKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface ExceptionalDayEntry {
  date: string; // YYYY-MM-DD
  hours: number; // 0 to 16
  reason?: string;
}

export interface ICAIChapterCatalogItem {
  subjectId: SubjectId;
  chapterName: string;
  icaiSectionCode: string;
  icaiSectionName: string;
  icaiWeightageRange: string;
  icaiWeightageMarks: number; // Relative marks out of 100
  abcCategory: ABCCategory;
  baseStudyMinutes: number; // Baseline 1st study / comprehensive read minutes
  examFocusNote: string;
}

export interface ChapterPlanInput {
  subjectId: SubjectId;
  chapterName: string;
  icaiSectionCode: string;
  icaiSectionName: string;
  icaiWeightageRange: string;
  icaiWeightageMarks: number;
  abcCategory: ABCCategory;
  confidence: ChapterConfidenceLevel;
  isSkipped: boolean;
  expectedMinutesByPhase: Record<StudyPhaseId, number>;
  isUserEditedTime: Record<StudyPhaseId, boolean>;
  actualMinutesLogged?: number;
  lastStudiedDate?: string;
}

export interface AutomatedStudyPlanConfig {
  isConfigured: boolean;
  prepStartDate: string; // YYYY-MM-DD
  examDate: string; // YYYY-MM-DD
  includeBaseline: boolean;
  plannedRevisionsCount: 1 | 2 | 3;
  plannedMocksCount: number; // 0 to 12
  sequencingMode: SubjectSequencingMode;
  subjectOrder: SubjectId[];
  dailyPairs: [SubjectId, SubjectId][];
  groupOrder: 'G1_FIRST' | 'G2_FIRST';
  activeSubjectsFilter: SubjectId[]; // Allows user to plan all 6 or a subset / single subject
  defaultCompletionCondition: MilestoneCompletionCondition;
  weeklyHoursByDay: Record<DayOfWeekKey, number>;
  exceptionalDays: ExceptionalDayEntry[]; // Max 3 per YYYY-MM
  activePhaseId: StudyPhaseId;
  completedPhases: StudyPhaseId[];
  lastGeneratedAt?: string;
  lastAmendedAt?: string;
}

export interface PhaseReviewRecord {
  phaseId: StudyPhaseId;
  reviewedAt: string;
  decision: 'continue' | 'amended';
  amendedChaptersCount: number;
  notes?: string;
}

export interface GeneratedMilestoneItem {
  id: string;
  subjectId: SubjectId | 'CUSTOM';
  customTitle?: string;
  phaseId: StudyPhaseId | 'mock';
  revisionCycle: '1st Revision' | '2nd Revision' | '3rd Revision' | 'Final Sprint' | 'Mock Exam' | 'Custom';
  targetDate: string;
  startDate: string;
  targetChapters: number;
  selectedChapters: string[];
  completedChapters: string[];
  allocatedHoursTotal: number;
  completionCondition: MilestoneCompletionCondition;
  mockTestCompleted: boolean;
  mockScoreObtained?: number;
  mockMaxMarks?: number;
  notes?: string;
}

export const STORAGE_KEY_AUTO_PLAN_CONFIG = 'practca_auto_study_plan_config_v1';
export const STORAGE_KEY_CHAPTER_PLAN_INPUTS = 'practca_chapter_plan_inputs_v1';
export const STORAGE_KEY_PHASE_REVIEW_HISTORY = 'practca_phase_review_history_v1';
export const STORAGE_KEY_CUSTOM_ABC_OVERRIDES = 'practca_custom_abc_overrides_v1';

export const IBS_DEFAULT_CHAPTERS_LIST: string[] = [
  'Financial Reporting',
  'Advanced Financial Management',
  'Auditing',
  'Direct Taxes',
  'Indirect Taxes',
  'Corporate & Economic Laws',
  'SCMPE',
  'Case Scenarios'
];

export const PHASE_LABELS: Record<StudyPhaseId, { title: string; shortLabel: string; compressionRatio: number; revisionCycleLabel: GeneratedMilestoneItem['revisionCycle']; revKey?: 'rev1' | 'rev2' | 'rev3' }> = {
  baseline: {
    title: 'Baseline Study (Comprehensive Read)',
    shortLabel: 'Baseline',
    compressionRatio: 1.0,
    revisionCycleLabel: 'Custom',
    revKey: 'rev1'
  },
  rev1: {
    title: '1st Revision (Core + Practice)',
    shortLabel: 'Revision 1',
    compressionRatio: 0.55,
    revisionCycleLabel: '1st Revision',
    revKey: 'rev1'
  },
  rev2: {
    title: '2nd Revision (ICAI RTP/MTP & High-Yield)',
    shortLabel: 'Revision 2',
    compressionRatio: 0.35,
    revisionCycleLabel: '2nd Revision',
    revKey: 'rev2'
  },
  rev3: {
    title: '3rd Revision (Rapid Statutory & Formula Recall)',
    shortLabel: 'Revision 3',
    compressionRatio: 0.20,
    revisionCycleLabel: '3rd Revision',
    revKey: 'rev3'
  }
};

export const ABC_MULTIPLIERS: Record<ABCCategory, number> = {
  A: 1.25,
  B: 1.00,
  C: 0.75
};

export const CONFIDENCE_MULTIPLIERS: Record<ChapterConfidenceLevel, { multiplier: number; label: string; desc: string }> = {
  low: { multiplier: 1.30, label: 'Low (Needs +30% Time)', desc: 'Requires full concept rebuilding & practice questions' },
  medium: { multiplier: 1.00, label: 'Medium (Standard 1.0x)', desc: 'Standard ICAI weightage-calibrated duration' },
  high: { multiplier: 0.75, label: 'High (Fast-Track -25%)', desc: 'Strong command; focus on exceptions & summary notes' }
};

export const DAYS_OF_WEEK_ORDER: DayOfWeekKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function loadCustomABCOverrides(level: CALevel = getSelectedCALevel()): Record<string, ABCCategory> {
  try {
    const raw = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_CUSTOM_ABC_OVERRIDES, level));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, ABCCategory>;
      }
    }
  } catch (e) {}
  return {};
}

export function saveCustomABCOverrides(overrides: Record<string, ABCCategory>, level: CALevel = getSelectedCALevel()): void {
  try {
    localStorage.setItem(getLevelScopedKey(STORAGE_KEY_CUSTOM_ABC_OVERRIDES, level), JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent('practca_abc_matrix_updated', { detail: { level } }));
  } catch (e) {}
}

/**
 * Authoritative ICAI Section-Wise Weightage & ABC Categorization Rules per Subject
 * (Calibrated strictly to Official ICAI Section-Wise Weightages for CA Final, May 2024 & Subsequent Exams)
 */
export function classifyChapterICAI(
  subjectId: SubjectId,
  chapterName: string,
  ignoreUserOverrides = false
): Omit<ICAIChapterCatalogItem, 'subjectId' | 'chapterName'> {
  const defaultMeta = classifyDefaultChapterICAI(subjectId, chapterName);
  if (ignoreUserOverrides) return defaultMeta;
  const overrides = loadCustomABCOverrides(getSelectedCALevel());
  const customCat = overrides[`${subjectId}::${chapterName}`];
  if (customCat === 'A' || customCat === 'B' || customCat === 'C') {
    return { ...defaultMeta, abcCategory: customCat };
  }
  return defaultMeta;
}

function classifyDefaultChapterICAI(subjectId: SubjectId, chapterName: string): Omit<ICAIChapterCatalogItem, 'subjectId' | 'chapterName'> {
  const ch = chapterName.toLowerCase();

  // =========================================================================
  // PAPER 1: FINANCIAL REPORTING (100 Marks | Sections I to VIII)
  // =========================================================================
  if (subjectId === 'FR') {
    // Section V (10% - 15% | ~13 Marks): Accounting and Reporting of Financial Instruments
    if (ch.includes('financial instruments')) {
      return {
        icaiSectionCode: 'Sec V',
        icaiSectionName: 'Accounting & Reporting of Financial Instruments (Ind AS 32, 109, 107)',
        icaiWeightageRange: '10% - 15%',
        icaiWeightageMarks: 13,
        abcCategory: 'A',
        baseStudyMinutes: 450,
        examFocusNote: 'Amortised cost, compound instruments, ECL impairment, derivatives & hedge accounting (10%–15% dedicated section).'
      };
    }

    // Section II (5% - 10% | ~8 Marks): Income Statement — Ind AS 115 Revenue
    if (ch.includes('115')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Income Statement: Revenue from Contracts with Customers (Ind AS 115)',
        icaiWeightageRange: '5% - 10%',
        icaiWeightageMarks: 8,
        abcCategory: 'A',
        baseStudyMinutes: 320,
        examFocusNote: '5-step revenue model, variable consideration, contract modifications & service concessions (5%–10% dedicated section).'
      };
    }

    // Section VI (10% - 20% | ~15 Marks): Accounting for Group (Ind AS 103, 110, 111, 27, 28, 112)
    if (ch.includes('consolidation')) {
      return {
        icaiSectionCode: 'Sec VI',
        icaiSectionName: 'Accounting for Group: Consolidated Financial Statements (Ind AS 110, 27, 112)',
        icaiWeightageRange: '10% - 20%',
        icaiWeightageMarks: 7.5,
        abcCategory: 'A',
        baseStudyMinutes: 310,
        examFocusNote: 'Chain holding, step acquisition, loss of control, NCI & uniform accounting policies.'
      };
    }
    if (ch.includes('103') || ch.includes('business combination')) {
      return {
        icaiSectionCode: 'Sec VI',
        icaiSectionName: 'Accounting for Group: Business Combinations (Ind AS 103)',
        icaiWeightageRange: '10% - 20%',
        icaiWeightageMarks: 5.5,
        abcCategory: 'A',
        baseStudyMinutes: 250,
        examFocusNote: 'Purchase consideration, contingent consideration, reverse acquisition & common control.'
      };
    }
    if (ch.includes('jv & associates')) {
      return {
        icaiSectionCode: 'Sec VI',
        icaiSectionName: 'Accounting for Group: Associates & Joint Arrangements (Ind AS 28, 111)',
        icaiWeightageRange: '10% - 20%',
        icaiWeightageMarks: 2,
        abcCategory: 'B',
        baseStudyMinutes: 120,
        examFocusNote: 'Equity method, upstream/downstream elimination & joint operations vs joint ventures.'
      };
    }

    // Section III (15% - 25% | ~20.5 Marks): Assets and Liabilities in Financial Statements
    if (ch.includes('116')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Leases (Ind AS 116)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 5,
        abcCategory: 'A',
        baseStudyMinutes: 230,
        examFocusNote: 'ROU asset & lease liability, lease modifications, sale & leaseback, sub-leases.'
      };
    }
    if (ch.includes('36')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Impairment of Assets (Ind AS 36)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 3,
        abcCategory: 'A',
        baseStudyMinutes: 165,
        examFocusNote: 'VIU vs FVLCD, CGU impairment, goodwill & corporate asset allocation, reversal.'
      };
    }
    if (ch.includes('16')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Property, Plant & Equipment (Ind AS 16)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 2,
        abcCategory: 'A',
        baseStudyMinutes: 130,
        examFocusNote: 'Decommissioning liability, component accounting, revaluation & bearer plants.'
      };
    }
    if (ch.includes('19')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Employee Benefits (Ind AS 19)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 2,
        abcCategory: 'A',
        baseStudyMinutes: 130,
        examFocusNote: 'Defined benefit obligation, plan assets, net interest, past service cost & OCI remeasurement.'
      };
    }
    if (ch.includes('38')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Intangible Assets (Ind AS 38)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 2,
        abcCategory: 'B',
        baseStudyMinutes: 120,
        examFocusNote: 'Research vs development phase capitalization, in-process R&D & amortization.'
      };
    }
    if (ch.includes('37')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Provisions & Contingencies (Ind AS 37)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 105,
        examFocusNote: 'Onerous contracts, restructuring provisions, warranties & contingent assets.'
      };
    }
    if (ch.includes('ind as 2 ') || ch.endsWith('ind as 2') || ch.includes('inventories')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Inventories (Ind AS 2)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 100,
        examFocusNote: 'NRV write-down of raw materials, joint/by-products & deferred settlement terms.'
      };
    }
    if (ch.includes('23')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Borrowing Costs (Ind AS 23)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 100,
        examFocusNote: 'Specific vs general borrowings capitalization rate, suspension & exchange differences.'
      };
    }
    if (ch.includes('105')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Non-Current Assets Held for Sale (Ind AS 105)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 1,
        abcCategory: 'B',
        baseStudyMinutes: 95,
        examFocusNote: 'Held for sale criteria, disposal groups, FVLCTS impairment & ceasing classification.'
      };
    }
    if (ch.includes('40')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Assets & Liabilities: Investment Property (Ind AS 40)',
        icaiWeightageRange: '15% - 25%',
        icaiWeightageMarks: 1,
        abcCategory: 'C',
        baseStudyMinutes: 80,
        examFocusNote: 'Dual-use property, ancillary services, cost model & transfers to/from inventory/PPE.'
      };
    }

    // Section IV (15% - 20% | ~17.5 Marks): Items Impacting FS, Disclosures & Other Ind AS
    if (ch.includes('102')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Other Ind AS: Share-Based Payment (Ind AS 102)',
        icaiWeightageRange: '15% - 20%',
        icaiWeightageMarks: 4.5,
        abcCategory: 'A',
        baseStudyMinutes: 200,
        examFocusNote: 'ESOP vs SAR, market vs non-market vesting conditions, modifications & group SBP.'
      };
    }
    if (ch.includes('12')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Items Impacting FS: Income Taxes (Ind AS 12)',
        icaiWeightageRange: '15% - 20%',
        icaiWeightageMarks: 3.5,
        abcCategory: 'A',
        baseStudyMinutes: 175,
        examFocusNote: 'Tax base vs carrying amount, DTA/DTL temporary differences, unused tax losses & CFS.'
      };
    }
    if (ch.includes('21')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Items Impacting FS: Changes in Foreign Exchange Rates (Ind AS 21)',
        icaiWeightageRange: '15% - 20%',
        icaiWeightageMarks: 2.5,
        abcCategory: 'B',
        baseStudyMinutes: 135,
        examFocusNote: 'Functional currency determination, monetary vs non-monetary items & foreign operation translation.'
      };
    }
    if (ch.includes('33')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Disclosures in FS: Earnings Per Share (Ind AS 33)',
        icaiWeightageRange: '15% - 20%',
        icaiWeightageMarks: 2.5,
        abcCategory: 'B',
        baseStudyMinutes: 135,
        examFocusNote: 'Rights issue bonus element, diluted EPS ranking of potential equity shares & contingent shares.'
      };
    }
    if (ch.includes('108')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Disclosures in FS: Operating Segments (Ind AS 108)',
        icaiWeightageRange: '15% - 20%',
        icaiWeightageMarks: 1.5,
        abcCategory: 'C',
        baseStudyMinutes: 90,
        examFocusNote: 'CODM, 10% quantitative thresholds, 75% external revenue test & entity-wide disclosures.'
      };
    }
    if (ch.includes('20') || ch.includes('24') || ch.includes('41')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Disclosures & Other Ind AS (Ind AS 20, 24, 41)',
        icaiWeightageRange: '15% - 20%',
        icaiWeightageMarks: 1,
        abcCategory: 'C',
        baseStudyMinutes: 80,
        examFocusNote: 'Govt grant repayment, related party disclosures & biological assets at FVLCTS.'
      };
    }

    // Section VII (5% - 10% | ~7 Marks): First-time Adoption & Analysis of Financial Statements
    if (ch.includes('101') || ch.includes('analysis of fs')) {
      return {
        icaiSectionCode: 'Sec VII',
        icaiSectionName: 'First-Time Adoption (Ind AS 101) & Analysis of Financial Statements',
        icaiWeightageRange: '5% - 10%',
        icaiWeightageMarks: 3.5,
        abcCategory: 'B',
        baseStudyMinutes: 145,
        examFocusNote: 'Mandatory exceptions vs optional exemptions on transition date & FS case analysis.'
      };
    }

    // Section VIII (5% - 10% | ~6.5 Marks): Ethics & Technology in Accounting
    if (ch.includes('ethical duty') || ch.includes('accounting & tech')) {
      return {
        icaiSectionCode: 'Sec VIII',
        icaiSectionName: 'Professional & Ethical Duty of a CA and Accounting & Technology',
        icaiWeightageRange: '5% - 10%',
        icaiWeightageMarks: ch.includes('ethical') ? 3.5 : 3,
        abcCategory: ch.includes('ethical') ? 'B' : 'C',
        baseStudyMinutes: ch.includes('ethical') ? 140 : 110,
        examFocusNote: 'Compulsory ethical case study on financial reporting pressure & ERP/Cloud/AI automation.'
      };
    }

    // Section I (10% - 15% | ~12.5 Marks): Introduction, Conceptual Framework, Presentation & Measurement
    return {
      icaiSectionCode: 'Sec I',
      icaiSectionName: 'Conceptual Framework, Presentation & Measurement (Ind AS 1, 7, 8, 10, 34, 113)',
      icaiWeightageRange: '10% - 15%',
      icaiWeightageMarks: ch.includes('ind as 1 ') || ch.includes('ind as 7') ? 2 : 1.5,
      abcCategory: ch.includes('ind as 1 ') || ch.includes('ind as 7') || ch.includes('113') ? 'B' : 'C',
      baseStudyMinutes: ch.includes('ind as 1 ') || ch.includes('ind as 7') || ch.includes('113') ? 115 : 85,
      examFocusNote: 'Current/non-current covenant breach, cash flows, fair value hierarchy & adjusting events.'
    };
  }

  // =========================================================================
  // PAPER 2: ADVANCED FINANCIAL MANAGEMENT (100 Marks | Sections I to VI)
  // =========================================================================
  if (subjectId === 'AFM') {
    // Section I (8% - 15% | ~12 Marks): Financial Policy, Risk Management & Advanced Capital Budgeting
    if (ch.includes('capital budgeting')) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Advanced Capital Budgeting Decisions',
        icaiWeightageRange: '8% - 15%',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 240,
        examFocusNote: 'Inflation in NPV, RADR vs Certainty Equivalent, sensitivity/scenario analysis & replacement decisions.'
      };
    }
    if (ch.includes('financial policy') || (ch.includes('risk management') && !ch.includes('foreign') && !ch.includes('interest'))) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Financial Policy, Corporate Strategy & Risk Management',
        icaiWeightageRange: '8% - 15%',
        icaiWeightageMarks: 3,
        abcCategory: 'C',
        baseStudyMinutes: 105,
        examFocusNote: 'Sustainable growth rate, Value at Risk (VaR) & strategic financial decision-making.'
      };
    }

    // Section II (20% - 30% | ~25 Marks): Security Analysis, Security Valuation & Portfolio Management
    if (ch.includes('security valuation')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Security Valuation (Equity, Preference & Fixed Income)',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 10,
        abcCategory: 'A',
        baseStudyMinutes: 330,
        examFocusNote: 'Multi-stage dividend discount, YTM, Macaulay/Modified duration, convexity & bond immunization.'
      };
    }
    if (ch.includes('portfolio')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Portfolio Management',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 9,
        abcCategory: 'A',
        baseStudyMinutes: 310,
        examFocusNote: 'Markowitz minimum variance, CAPM, Sharpe Single Index Model, APT & portfolio rebalancing.'
      };
    }
    if (ch.includes('security analysis')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Security Analysis (Fundamental & Technical Analysis)',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 6,
        abcCategory: 'B',
        baseStudyMinutes: 185,
        examFocusNote: 'EMA/RSI technical indicators, Efficient Market Hypothesis (EMH) & run test.'
      };
    }

    // Section III (20% - 30% | ~25 Marks): Securitization, Mutual Funds & Derivatives Analysis
    if (ch.includes('derivatives')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Derivatives Analysis and Valuation',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 13,
        abcCategory: 'A',
        baseStudyMinutes: 390,
        examFocusNote: 'Stock/index futures hedging, Binomial & Black-Scholes option pricing, Option Greeks & credit derivatives.'
      };
    }
    if (ch.includes('mutual funds')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Mutual Funds',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 8,
        abcCategory: 'A',
        baseStudyMinutes: 250,
        examFocusNote: 'NAV computation, dividend reinvestment vs bonus plan, Sharpe/Treynor/Jensen alpha & expense ratio.'
      };
    }
    if (ch.includes('securitization')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Securitization',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 4,
        abcCategory: 'C',
        baseStudyMinutes: 115,
        examFocusNote: 'SPV structure, Pass Through Certificates (PTCs), stripping & securitization pricing.'
      };
    }

    // Section IV (20% - 25% | ~22.5 Marks): Forex, International Financial Management & Interest Rate Risk
    if (ch.includes('foreign exchange')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Foreign Exchange Exposure and Risk Management',
        icaiWeightageRange: '20% - 25%',
        icaiWeightageMarks: 10,
        abcCategory: 'A',
        baseStudyMinutes: 350,
        examFocusNote: 'Cross rates, IRP/PPP, forward contract fate (cancellation/extension/early delivery), money market hedge & Nostro.'
      };
    }
    if (ch.includes('interest rate risk')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Interest Rate Risk Management',
        icaiWeightageRange: '20% - 25%',
        icaiWeightageMarks: 6.5,
        abcCategory: 'B',
        baseStudyMinutes: 210,
        examFocusNote: 'Forward Rate Agreements (FRA), Interest Rate Futures, Interest Rate Swaps, Caps, Floors & Collars.'
      };
    }
    if (ch.includes('international financial')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'International Financial Management',
        icaiWeightageRange: '20% - 25%',
        icaiWeightageMarks: 6,
        abcCategory: 'B',
        baseStudyMinutes: 195,
        examFocusNote: 'Home vs Foreign currency NPV, Adjusted Present Value (APV), GDR/ADR & international working capital.'
      };
    }

    // Section V (10% - 15% | ~12 Marks): Business Valuation & Mergers, Acquisitions and Restructuring
    if (ch.includes('business valuation')) {
      return {
        icaiSectionCode: 'Sec V',
        icaiSectionName: 'Business Valuation',
        icaiWeightageRange: '10% - 15%',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 240,
        examFocusNote: 'FCFF/FCFE, Economic Value Added (EVA), Market Value Added (MVA), relative multiples & Chop-Shop.'
      };
    }
    if (ch.includes('mergers')) {
      return {
        icaiSectionCode: 'Sec V',
        icaiSectionName: 'Mergers, Acquisitions and Corporate Restructuring',
        icaiWeightageRange: '10% - 15%',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 250,
        examFocusNote: 'Swap ratio, EPS/MPS accretion-dilution, min/max exchange ratio, free float & demerger valuation.'
      };
    }

    // Section VI (2% - 5% | ~3.5 Marks): Startup Finance
    return {
      icaiSectionCode: 'Sec VI',
      icaiSectionName: 'Startup Finance',
      icaiWeightageRange: '2% - 5%',
      icaiWeightageMarks: 3.5,
      abcCategory: 'C',
      baseStudyMinutes: 110,
      examFocusNote: 'Pitch deck, Venture Capital method, bootstrapping, angel investors, unicorns & succession planning.'
    };
  }

  // =========================================================================
  // PAPER 3: ADVANCED AUDITING, ASSURANCE AND PROFESSIONAL ETHICS (100 Marks | Sec I to V)
  // =========================================================================
  if (subjectId === 'Audit') {
    // Section V (17% - 24% | ~20.5 Marks): Professional Ethics & Liabilities of Auditors
    if (ch.includes('professional ethics')) {
      return {
        icaiSectionCode: 'Sec V',
        icaiSectionName: 'Professional Ethics & Liabilities of Auditors',
        icaiWeightageRange: '17% - 24%',
        icaiWeightageMarks: 20.5,
        abcCategory: 'A',
        baseStudyMinutes: 460,
        examFocusNote: 'First & Second Schedule clauses, Council Guidelines 2008, NOCLAR, ESB & Independence (17%–24% dedicated section).'
      };
    }

    // Section II (3% - 6% | ~4.5 Marks): Digital Auditing & Assurance
    if (ch.includes('digital auditing')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Digital Auditing & Assurance',
        icaiWeightageRange: '3% - 6%',
        icaiWeightageMarks: 4.5,
        abcCategory: 'B',
        baseStudyMinutes: 160,
        examFocusNote: 'Cyber security risks, RPA/AI/Blockchain audit considerations, IT general controls & Next-Gen audit.'
      };
    }

    // Section IV (3% - 6% | ~4.5 Marks): SDG & ESG Assurance
    if (ch.includes('sustainable development') || ch.includes('esg')) {
      return {
        icaiSectionCode: 'Sec IV',
        icaiSectionName: 'Sustainable Development Goals (SDG) & ESG Assurance',
        icaiWeightageRange: '3% - 6%',
        icaiWeightageMarks: 4.5,
        abcCategory: 'B',
        baseStudyMinutes: 155,
        examFocusNote: 'BRSR 9 Principles, BRSR Core reasonable assurance, SSAE 3000 & Integrated Reporting.'
      };
    }

    // Section III (17% - 24% | ~20.5 Marks across Chapters 13–17): Group, Bank/NBFC, PSU, Internal & Forensic Audit
    if (ch.includes('banks')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Special Features of Audit of Banks & NBFCs',
        icaiWeightageRange: '17% - 24%',
        icaiWeightageMarks: 5,
        abcCategory: 'A',
        baseStudyMinutes: 200,
        examFocusNote: 'IRAC norms, NPA provisioning, LFAR, drawing power vs sanction limit, NBFC SBR 4 layers & NBFC CARO.'
      };
    }
    if (ch.includes('group audits')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Group Audits (SA 600 & CFS Audit)',
        icaiWeightageRange: '17% - 24%',
        icaiWeightageMarks: 4.5,
        abcCategory: 'A',
        baseStudyMinutes: 180,
        examFocusNote: 'SA 600 Using Work of Another Auditor, permanent vs current consolidation adjustments & Sec 129(3).'
      };
    }
    if (ch.includes('due diligence')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'Due Diligence, Investigation & Forensic Audit',
        icaiWeightageRange: '17% - 24%',
        icaiWeightageMarks: 4,
        abcCategory: 'A',
        baseStudyMinutes: 175,
        examFocusNote: 'Financial due diligence hidden liabilities, Sec 210–213 investigation & Forensic Accounting red flags.'
      };
    }
    if (ch.includes('public sector') || ch.includes('internal audit')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'PSU Audit & Internal Audit (SA 610)',
        icaiWeightageRange: '17% - 24%',
        icaiWeightageMarks: 3.5,
        abcCategory: 'B',
        baseStudyMinutes: 145,
        examFocusNote: 'C&AG Directions u/s 143(5), Propriety & 3Es Performance Audit, Sec 138 & SA 610 Direct Assistance.'
      };
    }

    // Section I (45% - 55% | ~50 Marks across Chapters 1–11): Engagement & Quality Control Standards (SAs, SREs, SAEs, SRSs)
    if (ch.includes('reporting')) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Engagement Standards: Audit Reporting (SA 700–720 & CARO 2020)',
        icaiWeightageRange: '45% - 55%',
        icaiWeightageMarks: 7,
        abcCategory: 'A',
        baseStudyMinutes: 270,
        examFocusNote: 'SA 700, SA 701 KAM, SA 705 Modifications, SA 706 EOM/OM, SA 720 & all 21 Clauses of CARO 2020.'
      };
    }
    if (ch.includes('general auditing') || ch.includes('planning') || ch.includes('materiality')) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Engagement Standards: Principles, Planning & Risk Assessment (SA 200–450)',
        icaiWeightageRange: '45% - 55%',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 225,
        examFocusNote: 'SA 240 Fraud, SA 250 Laws, SA 260/265, SA 299 Joint Audit, SA 300/315/320/330 & SA 402 SOC Reports.'
      };
    }
    if (ch.includes('quality control') || ch.includes('audit evidence')) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Engagement Standards: Quality Control (SQC 1/SA 220) & Evidence (SA 500–580)',
        icaiWeightageRange: '45% - 55%',
        icaiWeightageMarks: 5,
        abcCategory: 'A',
        baseStudyMinutes: 200,
        examFocusNote: 'SQC 1/SA 220 EQCR, SA 501 Inventory/Litigation, SA 505 Confirmations, SA 530, SA 540 & SA 550 RPT.'
      };
    }
    if (ch.includes('completion')) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Engagement Standards: Completion & Review (SA 560, 570, 580)',
        icaiWeightageRange: '45% - 55%',
        icaiWeightageMarks: 4,
        abcCategory: 'A',
        baseStudyMinutes: 175,
        examFocusNote: 'SA 560 Subsequent Events (Facts before/after issue), SA 570 Going Concern & SA 580 Written Representations.'
      };
    }
    if (ch.includes('specialised areas') || ch.includes('prospective financial')) {
      return {
        icaiSectionCode: 'Sec I',
        icaiSectionName: 'Engagement Standards: SA 800–810 & SAE 3400–3420',
        icaiWeightageRange: '45% - 55%',
        icaiWeightageMarks: 3,
        abcCategory: ch.includes('specialised') ? 'B' : 'C',
        baseStudyMinutes: ch.includes('specialised') ? 130 : 115,
        examFocusNote: 'SA 800 Special Purpose, SA 805 Single FS, SA 810 Summary FS, SAE 3400 PFI, SAE 3402 & SAE 3420 Pro Forma.'
      };
    }
    return {
      icaiSectionCode: 'Sec I',
      icaiSectionName: 'Engagement Standards: Related Services (SRS 4400/4410) & Review (SRE 2400/2410)',
      icaiWeightageRange: '45% - 55%',
      icaiWeightageMarks: 2.5,
      abcCategory: 'C',
      baseStudyMinutes: 105,
      examFocusNote: 'SRS 4400 Agreed-Upon Procedures, SRS 4410 Compilation & SRE 2400/2410 Limited Assurance.'
    };
  }

  // =========================================================================
  // PAPER 4: DIRECT TAX LAWS & INTERNATIONAL TAXATION (100 Marks | Sec I, II, III)
  // =========================================================================
  if (subjectId === 'DT') {
    // Section I(i) (20% - 23% | ~22 Marks): Comprehensive Computation of Income-Tax Liabilities
    if (ch.includes('profits and gains')) {
      return {
        icaiSectionCode: 'Sec I(i)',
        icaiSectionName: 'Computation of Total Income: Profits & Gains of Business or Profession (PGBP)',
        icaiWeightageRange: '20% - 23%',
        icaiWeightageMarks: 8,
        abcCategory: 'A',
        baseStudyMinutes: 350,
        examFocusNote: 'Compulsory Q1 (14M) PGBP computation, Sec 32/35/36/37/40(a)/40A/43B(h) MSME & ICDS adjustments.'
      };
    }
    if (ch.includes('various entities')) {
      return {
        icaiSectionCode: 'Sec I(i)',
        icaiSectionName: 'Computation under Alternative Tax Regimes: Assessment of Various Entities',
        icaiWeightageRange: '20% - 23%',
        icaiWeightageMarks: 5,
        abcCategory: 'A',
        baseStudyMinutes: 240,
        examFocusNote: 'Sec 115JB MAT vs Sec 115BAA/115BAB/115BAC/115BAD/115BAE, Partnership Sec 40(b)/9B/45(4), Buyback & Tonnage Tax.'
      };
    }
    if (ch.includes('capital gains')) {
      return {
        icaiSectionCode: 'Sec I(i)',
        icaiSectionName: 'Computation of Total Income: Capital Gains',
        icaiWeightageRange: '20% - 23%',
        icaiWeightageMarks: 3.5,
        abcCategory: 'A',
        baseStudyMinutes: 195,
        examFocusNote: 'Sec 50B Slump Sale, Sec 45(4)/9B firm reconstitution, Sec 50C/43CA, Sec 112A/111A & Sec 54 exemptions.'
      };
    }
    if (ch.includes('set off') || ch.includes('deductions from gross')) {
      return {
        icaiSectionCode: 'Sec I(i)',
        icaiSectionName: 'Computation of Total Income: Set-Off of Losses & Chapter VI-A Deductions',
        icaiWeightageRange: '20% - 23%',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 120,
        examFocusNote: 'Sec 72A amalgamation losses, Sec 79 change in shareholding, Sec 80JJAA, Sec 80M & Sec 10AA SEZ.'
      };
    }
    if (ch.includes('other sources')) {
      return {
        icaiSectionCode: 'Sec I(i)',
        icaiSectionName: 'Computation of Total Income: Income from Other Sources',
        icaiWeightageRange: '20% - 23%',
        icaiWeightageMarks: 1,
        abcCategory: 'C',
        baseStudyMinutes: 90,
        examFocusNote: 'Sec 56(2)(x) gifts/immovable property, Sec 2(22)(e) deemed dividend & Sec 56(2)(xii) specified unit sums.'
      };
    }
    if (ch.includes('basic concepts') || ch.includes('do not form part') || ch.includes('other persons')) {
      return {
        icaiSectionCode: 'Sec I(i)',
        icaiSectionName: 'Basic Concepts, Exempt Incomes & Clubbing of Income',
        icaiWeightageRange: '20% - 23%',
        icaiWeightageMarks: 0.5,
        abcCategory: 'C',
        baseStudyMinutes: 75,
        examFocusNote: 'Surcharge & marginal relief, Sec 60–64 clubbing provisions & agricultural income integration.'
      };
    }

    // Section I(ii), (iii), (iv) (20% - 22% | ~21 Marks): Special Entities, Anti-Avoidance & Digital Transactions
    if (ch.includes('trusts')) {
      return {
        icaiSectionCode: 'Sec I(ii)',
        icaiSectionName: 'Special Entities: Trusts & Institutions, Political Parties, Securitisation Trusts, REIT/InvIT/AIF',
        icaiWeightageRange: '20% - 22%',
        icaiWeightageMarks: 8.5,
        abcCategory: 'A',
        baseStudyMinutes: 270,
        examFocusNote: 'Sec 11–13 Charitable Trusts (85% application, corpus/loan rules), Sec 115TD Exit Tax & REIT/InvIT/AIF pass-through.'
      };
    }
    if (ch.includes('tax planning')) {
      return {
        icaiSectionCode: 'Sec I(iii)',
        icaiSectionName: 'Anti-Avoidance Provisions: Tax Planning, Tax Avoidance & GAAR',
        icaiWeightageRange: '20% - 22%',
        icaiWeightageMarks: 6.5,
        abcCategory: 'A',
        baseStudyMinutes: 210,
        examFocusNote: 'Chapter X-A GAAR (Sec 95–102 Impermissible Avoidance Arrangement), Sec 94 dividend/bonus stripping & thin cap.'
      };
    }
    if (ch.includes('digital transactions')) {
      return {
        icaiSectionCode: 'Sec I(iv)',
        icaiSectionName: 'Taxation of Digital Transactions (VDA Sec 115BBH/194S, Equalisation Levy & E-Commerce)',
        icaiWeightageRange: '20% - 22%',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 190,
        examFocusNote: 'Sec 115BBH Virtual Digital Assets (30% tax, no set-off), Sec 194S TDS, Sec 194-O E-commerce & Equalisation Levy.'
      };
    }

    // Section II (20% - 30% | ~25 Marks): Tax Administration and Appellate Mechanism
    if (ch.includes('deduction, collection')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Tax Administration: Deduction, Collection and Recovery of Tax (TDS & TCS)',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 7,
        abcCategory: 'A',
        baseStudyMinutes: 260,
        examFocusNote: 'Sec 194C/194H/194I/194J/194N/194-O/194Q/194R/194S/194BA, Sec 195 NR TDS & Sec 206C(1G)/(1H) TCS.'
      };
    }
    if (ch.includes('assessment procedure')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Tax Administration: Return Filing & Assessment Procedure',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 4.5,
        abcCategory: 'B',
        baseStudyMinutes: 190,
        examFocusNote: 'Sec 139(8A) Updated Return, Sec 143(3)/144B Faceless Assessment, Sec 147/148/148A Reassessment & Search Block Assessment.'
      };
    }
    if (ch.includes('unethical')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Tax Administration: Penalties, Offences, Prosecution & Black Money Act',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 3.5,
        abcCategory: 'B',
        baseStudyMinutes: 155,
        examFocusNote: 'Sec 270A under-reporting vs misreporting, Sec 270AA immunity, Sec 269SS/269ST/269T & Black Money Act.'
      };
    }
    if (ch.includes('appeals')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Appellate Mechanism: Appeals and Revision',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 3,
        abcCategory: 'B',
        baseStudyMinutes: 145,
        examFocusNote: 'JCIT(A)/CIT(A), ITAT powers & rectification u/s 254(2), High Court/Supreme Court & Sec 263/264 Revision.'
      };
    }
    if (ch.includes('tax audit')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Tax Audit (Sec 44AB / Form 3CD) and Ethical Compliances',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 3,
        abcCategory: 'B',
        baseStudyMinutes: 145,
        examFocusNote: 'Sec 44AB threshold limits (1 Cr / 10 Cr), Form 3CD critical reporting clauses & ethical responsibility.'
      };
    }
    if (ch.includes('dispute')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Appellate Mechanism: Dispute Resolution Committee (Sec 245MA)',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 2,
        abcCategory: 'B',
        baseStudyMinutes: 115,
        examFocusNote: 'DRC eligibility conditions (returned income <= 50L, variation <= 10L), disqualifications & penalty waiver.'
      };
    }
    if (ch.includes('authorities') || ch.includes('miscellaneous')) {
      return {
        icaiSectionCode: 'Sec II',
        icaiSectionName: 'Tax Administration: Income Tax Authorities (Search & Seizure) & Misc Provisions',
        icaiWeightageRange: '20% - 30%',
        icaiWeightageMarks: 1,
        abcCategory: 'C',
        baseStudyMinutes: 85,
        examFocusNote: 'Sec 132 Search & Seizure powers, Sec 133A Survey, Sec 281B provisional attachment & Sec 282 service of notice.'
      };
    }

    // Section III (30% - 35% | ~32 Marks): International Taxation
    if (ch.includes('transfer pricing')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'International Taxation: Transfer Pricing & Anti-Avoidance',
        icaiWeightageRange: '30% - 35%',
        icaiWeightageMarks: 9,
        abcCategory: 'A',
        baseStudyMinutes: 320,
        examFocusNote: 'Sec 92A Associated Enterprises, 6 ALP Methods, Range Concept, APA, Safe Harbour, Sec 92CE Secondary Adj & Sec 94B.'
      };
    }
    if (ch.includes('non resident')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'International Taxation: Non-Resident Taxation',
        icaiWeightageRange: '30% - 35%',
        icaiWeightageMarks: 9,
        abcCategory: 'A',
        baseStudyMinutes: 320,
        examFocusNote: 'Sec 6(1A)/POEM, Sec 9(1)(i)–(vii) Business Connection/Royalty/FTS, Sec 44B–44BBB Presumptive NR, Sec 115A & Chapter XII-A.'
      };
    }
    if (ch.includes('double taxation')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'International Taxation: Double Taxation Relief (Sec 90, 90A, 91)',
        icaiWeightageRange: '30% - 35%',
        icaiWeightageMarks: 4.5,
        abcCategory: 'B',
        baseStudyMinutes: 180,
        examFocusNote: 'Bilateral relief u/s 90, Unilateral relief u/s 91, Rule 128 Foreign Tax Credit & TRC/Form 10F.'
      };
    }
    if (ch.includes('advance rulings')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'International Taxation: Advance Rulings (Board for Advance Rulings)',
        icaiWeightageRange: '30% - 35%',
        icaiWeightageMarks: 2.5,
        abcCategory: 'B',
        baseStudyMinutes: 120,
        examFocusNote: 'BAR applicant categories u/s 245N, rejection bars u/s 245R(2) & High Court appeal u/s 245W.'
      };
    }
    if (ch.includes('model tax') || ch.includes('beps') || ch.includes('interpretation of tax treaties')) {
      return {
        icaiSectionCode: 'Sec III',
        icaiSectionName: 'International Taxation: Tax Treaties, OECD/UN Models & BEPS Action Plans',
        icaiWeightageRange: '30% - 35%',
        icaiWeightageMarks: 2,
        abcCategory: 'B',
        baseStudyMinutes: 115,
        examFocusNote: 'OECD vs UN Model Articles 4/5/7/12/13, Vienna Convention, MLI PPT/LOB & BEPS Pillar 1 & Pillar 2 GloBE.'
      };
    }
    return {
      icaiSectionCode: 'Sec III',
      icaiSectionName: 'International Taxation: Latest Developments in International Taxation',
      icaiWeightageRange: '30% - 35%',
      icaiWeightageMarks: 1,
      abcCategory: 'C',
      baseStudyMinutes: 85,
      examFocusNote: 'Pillar One Amount A/B, Pillar Two 15% Global Minimum Tax (IIR, UTPR, QDMTT) & Subject to Tax Rule (STTR).'
    };
  }

  // =========================================================================
  // PAPER 5: INDIRECT TAX LAWS (100 Marks: Part I GST = 80M | Part II Customs & FTP = 20M)
  // =========================================================================
  if (subjectId === 'IDT') {
    // Part I — GST Section I (45% - 65% of 80M = 36–52 Marks | ~44 Marks): Levy, Time, Value, POS, ITC & Exemptions
    if (ch.includes('input tax credit')) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Input Tax Credit (Sec 16–21)',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 11,
        abcCategory: 'A',
        baseStudyMinutes: 350,
        examFocusNote: 'Compulsory Q1 (14M) ITC computation, Sec 16(2), Sec 17(5) blocked credits, Rule 42/43 reversals, Rule 86B & ISD.'
      };
    }
    if (ch.includes('place of supply')) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Place of Supply (IGST Sec 10–14)',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 6.5,
        abcCategory: 'A',
        baseStudyMinutes: 230,
        examFocusNote: 'Bill-to-Ship-to Sec 10(1)(b), immovable property/events/transport Sec 12, cross-border POS Sec 13 & OIDAR.'
      };
    }
    if (ch.includes('value of supply')) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Value of Supply (Sec 15 & Rules 27–35)',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 210,
        examFocusNote: 'Sec 15(2) inclusions (subsidies, interest, taxes), discounts Sec 15(3), Rule 27–31, Rule 31A/31B/31C & Pure Agent.'
      };
    }
    if (ch.includes('exemptions from gst') || (ch.includes('exemptions') && !ch.includes('customs'))) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Exemptions from GST (NN 12/2017-CT(R))',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 210,
        examFocusNote: 'Healthcare, education, agriculture, GTA/passenger transport, banking/financial, legal, Govt & renting exemptions.'
      };
    }
    if (ch.includes('supply under gst')) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Supply under GST (Sec 7, 8 & Sch I–III)',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 5,
        abcCategory: 'A',
        baseStudyMinutes: 180,
        examFocusNote: 'Sec 7(1)(a)/(aa)/(b)/(c), Schedule I without consideration, Schedule II classification, Schedule III & Composite vs Mixed.'
      };
    }
    if (ch.includes('charge of gst')) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Charge of GST & Composition Levy (Sec 9, 10)',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 5,
        abcCategory: 'A',
        baseStudyMinutes: 180,
        examFocusNote: 'Sec 9(3) Reverse Charge notifications (GTA, Advocate, Director, Sponsorship, Renting), Sec 9(5) ECO & Sec 10 Composition.'
      };
    }
    if (ch.includes('time of supply')) {
      return {
        icaiSectionCode: 'Part I - Sec I',
        icaiSectionName: 'GST Sec I (45%–65% of 80M): Time of Supply (Sec 12, 13, 14)',
        icaiWeightageRange: '36 - 52 Marks',
        icaiWeightageMarks: 4.5,
        abcCategory: 'A',
        baseStudyMinutes: 160,
        examFocusNote: 'Forward vs Reverse charge TOS for goods (Sec 12) & services (Sec 13), vouchers, continuous supply & change in rate (Sec 14).'
      };
    }

    // Part I — GST Section II (10% - 30% of 80M = 8–24 Marks | ~16 Marks): Registration, Invoice, Returns, Payment, Refund, Job Work, ECO
    if (ch.includes('refunds') && !ch.includes('customs')) {
      return {
        icaiSectionCode: 'Part I - Sec II',
        icaiSectionName: 'GST Sec II (10%–30% of 80M): Refunds & Zero-Rated Supply (Sec 54–58, IGST Sec 16)',
        icaiWeightageRange: '8 - 24 Marks',
        icaiWeightageMarks: 3.5,
        abcCategory: 'A',
        baseStudyMinutes: 165,
        examFocusNote: 'Rule 89(4) Zero-rated LUT refund formula, Rule 89(5) Inverted duty structure formula, Rule 96 IGST refund & unjust enrichment.'
      };
    }
    if (ch.includes('registration') || ch.includes('tax invoice') || ch.includes('accounts and records') || ch.includes('payment of tax')) {
      return {
        icaiSectionCode: 'Part I - Sec II',
        icaiSectionName: 'GST Sec II (10%–30% of 80M): Registration, Invoice, E-Way Bill & Payment of Tax',
        icaiWeightageRange: '8 - 24 Marks',
        icaiWeightageMarks: 2,
        abcCategory: 'B',
        baseStudyMinutes: 120,
        examFocusNote: 'Sec 22–30 Registration, E-Invoicing (5 Cr limit), Rule 138 E-Way Bill validity & Sec 50(1) net cash interest.'
      };
    }
    if (ch.includes('import and export under gst')) {
      return {
        icaiSectionCode: 'Part I - Sec II',
        icaiSectionName: 'GST Sec II (10%–30% of 80M): Import and Export under GST',
        icaiWeightageRange: '8 - 24 Marks',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 110,
        examFocusNote: 'Import of services with/without consideration, OIDAR imports, Zero-rated supplies (SEZ/Export) & Merchant exports.'
      };
    }
    if (ch.includes('returns') || ch.includes('liability to pay')) {
      return {
        icaiSectionCode: 'Part I - Sec II',
        icaiSectionName: 'GST Sec II (10%–30% of 80M): Returns & Liability to Pay in Certain Cases (Sec 85–94)',
        icaiWeightageRange: '8 - 24 Marks',
        icaiWeightageMarks: 1,
        abcCategory: 'B',
        baseStudyMinutes: 100,
        examFocusNote: 'GSTR-1/3B/9, QRMP scheme, Sec 85 transfer of business joint & several liability, Sec 88 liquidation & Sec 89 directors.'
      };
    }
    if (ch.includes('job work') || ch.includes('electronic commerce')) {
      return {
        icaiSectionCode: 'Part I - Sec II',
        icaiSectionName: 'GST Sec II (10%–30% of 80M): Job Work (Sec 143) & E-Commerce TCS (Sec 52)',
        icaiWeightageRange: '8 - 24 Marks',
        icaiWeightageMarks: 0.5,
        abcCategory: 'C',
        baseStudyMinutes: 75,
        examFocusNote: 'Sec 143 Job work 1-year (inputs) / 3-year (capital goods) return limits & Sec 52 TCS @ 0.5% on net taxable supplies.'
      };
    }

    // Part I — GST Section III (0% - 5% of 80M = 0–4 Marks | ~2.5 Marks): Assessment, Audit, Inspection & Misc
    if (ch.includes('inspection, search')) {
      return {
        icaiSectionCode: 'Part I - Sec III',
        icaiSectionName: 'GST Sec III (0%–5% of 80M): Inspection, Search, Seizure and Arrest (Sec 67–72)',
        icaiWeightageRange: '0 - 4 Marks',
        icaiWeightageMarks: 1,
        abcCategory: 'B',
        baseStudyMinutes: 100,
        examFocusNote: 'Sec 67 inspection/search authorization by JC+, provisional release of seized goods & Sec 69 arrest thresholds.'
      };
    }
    if (ch.includes('assessment and audit') || ch.includes('miscellaneous')) {
      return {
        icaiSectionCode: 'Part I - Sec III',
        icaiSectionName: 'GST Sec III (0%–5% of 80M): Assessment, Audit (Sec 59–66) & Misc Provisions',
        icaiWeightageRange: '0 - 4 Marks',
        icaiWeightageMarks: ch.includes('assessment') ? 1 : 0.5,
        abcCategory: 'C',
        baseStudyMinutes: ch.includes('assessment') ? 85 : 75,
        examFocusNote: 'Sec 60 Provisional Assessment, Sec 62 Best Judgment, Sec 65/66 Audit, Anti-profiteering & Deemed Exports.'
      };
    }

    // Part I — GST Section IV (15% - 30% of 80M = 12–24 Marks | ~17.5 Marks): Demands, Offences, Appeals & Advance Ruling
    if (ch.includes('demands and recovery')) {
      return {
        icaiSectionCode: 'Part I - Sec IV',
        icaiSectionName: 'GST Sec IV (15%–30% of 80M): Demands and Recovery (Sec 73, 74, 74A–84)',
        icaiWeightageRange: '12 - 24 Marks',
        icaiWeightageMarks: 6,
        abcCategory: 'A',
        baseStudyMinutes: 200,
        examFocusNote: 'Sec 73/74/74A SCN & order time limits, penalty waiver tiers (before SCN/30d/60d of order), Sec 75 & Sec 79 recovery.'
      };
    }
    if (ch.includes('offences and penalties')) {
      return {
        icaiSectionCode: 'Part I - Sec IV',
        icaiSectionName: 'GST Sec IV (15%–30% of 80M): Offences, Penalties & Detention (Sec 122–138)',
        icaiWeightageRange: '12 - 24 Marks',
        icaiWeightageMarks: 4.5,
        abcCategory: 'B',
        baseStudyMinutes: 155,
        examFocusNote: 'Sec 122(1)/(1A) fake invoicing penalties, Sec 129 detention in transit (200% penalty) & Sec 132 prosecution.'
      };
    }
    if (ch.includes('appeals and revision')) {
      return {
        icaiSectionCode: 'Part I - Sec IV',
        icaiSectionName: 'GST Sec IV (15%–30% of 80M): Appeals and Revision (Sec 107–121)',
        icaiWeightageRange: '12 - 24 Marks',
        icaiWeightageMarks: 4,
        abcCategory: 'B',
        baseStudyMinutes: 145,
        examFocusNote: 'Appellate Authority (10% pre-deposit) & GSTAT (additional 10% pre-deposit), Sec 108 Revision & non-appealable orders.'
      };
    }
    if (ch.includes('advance ruling')) {
      return {
        icaiSectionCode: 'Part I - Sec IV',
        icaiSectionName: 'GST Sec IV (15%–30% of 80M): Advance Ruling (Sec 95–106)',
        icaiWeightageRange: '12 - 24 Marks',
        icaiWeightageMarks: 3,
        abcCategory: 'B',
        baseStudyMinutes: 115,
        examFocusNote: 'Sec 97(2) questions eligible for AAR, binding applicability u/s 103, appeal to AAAR & void ab initio ruling.'
      };
    }

    // Part II — Customs Section I (40% - 65% of 20M = 8–13 Marks | ~10.5 Marks): Levy, Types of Duty, Classification & Valuation
    if (ch.includes('valuation under the customs')) {
      return {
        icaiSectionCode: 'Part II - Sec I',
        icaiSectionName: 'Customs Sec I (40%–65% of 20M): Valuation under the Customs Act, 1962',
        icaiWeightageRange: '8 - 13 Marks',
        icaiWeightageMarks: 4.5,
        abcCategory: 'A',
        baseStudyMinutes: 195,
        examFocusNote: 'Compulsory Customs Valuation numerical: Sec 14, Rule 10(1) commissions/assists/royalties, Rule 10(2) freight (20% FOB cap) & relevant exchange rate.'
      };
    }
    if (ch.includes('levy of and exemptions from customs')) {
      return {
        icaiSectionCode: 'Part II - Sec I',
        icaiSectionName: 'Customs Sec I (40%–65% of 20M): Levy of and Exemptions from Customs Duty',
        icaiWeightageRange: '8 - 13 Marks',
        icaiWeightageMarks: 2.5,
        abcCategory: 'A',
        baseStudyMinutes: 145,
        examFocusNote: 'Sec 13 pilferage vs Sec 22 abatement vs Sec 23 remission/relinquishment, Sec 20 re-importation & IGCR Rules.'
      };
    }
    if (ch.includes('types of duty')) {
      return {
        icaiSectionCode: 'Part II - Sec I',
        icaiSectionName: 'Customs Sec I (40%–65% of 20M): Types of Customs Duty',
        icaiWeightageRange: '8 - 13 Marks',
        icaiWeightageMarks: 2,
        abcCategory: 'A',
        baseStudyMinutes: 130,
        examFocusNote: 'BCD, SWS @ 10%, AIDC, Sec 3(7) IGST on imports, Sec 3(9) GST Compensation Cess, Anti-Dumping, CVD & Safeguard Duty.'
      };
    }
    if (ch.includes('classification')) {
      return {
        icaiSectionCode: 'Part II - Sec I',
        icaiSectionName: 'Customs Sec I (40%–65% of 20M): Classification of Imported and Export Goods',
        icaiWeightageRange: '8 - 13 Marks',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 100,
        examFocusNote: '6 General Rules for Interpretation (GRI 1–6), essential character, akin rule, Section/Chapter notes & Project Imports.'
      };
    }

    // Part II — Customs Section II (20% - 45% of 20M = 4–9 Marks | ~5.5 Marks): Import/Export Procedures, Baggage, Warehousing, Drawback & Refund
    if (ch.includes('importation and exportation')) {
      return {
        icaiSectionCode: 'Part II - Sec II',
        icaiSectionName: 'Customs Sec II (20%–45% of 20M): Import/Export Procedures, Transit & Baggage Rules',
        icaiWeightageRange: '4 - 9 Marks',
        icaiWeightageMarks: 2.5,
        abcCategory: 'B',
        baseStudyMinutes: 135,
        examFocusNote: 'Sec 15/16 relevant date for duty rate, Bill of Entry, Transit vs Transhipment & Baggage Rules 2016 (Rs. 50,000 GFA + Laptop + Jewellery).'
      };
    }
    if (ch.includes('warehousing') || ch.includes('customs refunds')) {
      return {
        icaiSectionCode: 'Part II - Sec II',
        icaiSectionName: 'Customs Sec II (20%–45% of 20M): Warehousing (Sec 57–73A) & Duty Drawback/Refunds (Sec 27, 74, 75)',
        icaiWeightageRange: '4 - 9 Marks',
        icaiWeightageMarks: 1.5,
        abcCategory: 'B',
        baseStudyMinutes: 100,
        examFocusNote: 'Sec 61 warehousing period & 15% interest beyond 90 days, Sec 65 MOOWR, Sec 27 refund & Sec 74/75 Duty Drawback.'
      };
    }

    // Part II — Customs Section II & III (10% - 20% of 20M + Export Promotion | ~4 Marks): Foreign Trade Policy
    return {
      icaiSectionCode: 'Part II - Sec II & III',
      icaiSectionName: 'Customs Sec II & III (FTP 2023): Foreign Trade Policy & Export Promotion Schemes',
      icaiWeightageRange: '4 - 6 Marks',
      icaiWeightageMarks: 4,
      abcCategory: 'B',
      baseStudyMinutes: 150,
      examFocusNote: 'Advance Authorization (15% min value addition), DFIA, EPCG (0% duty, 6X EO in 6 yrs), RODTEP, EOU/STP & Status Holders.'
    };
  }

  // =========================================================================
  // CA INTERMEDIATE SUBJECTS (Papers 1 to 6)
  // =========================================================================
  if (subjectId === 'AdvAcc') {
    if (ch.includes('consolidated') || ch.includes('amalgamation') || ch.includes('financial statements of companies')) {
      return {
        icaiSectionCode: 'Mod III',
        icaiSectionName: 'Company Accounts, Amalgamation, Reconstruction & CFS',
        icaiWeightageRange: '30% - 35%',
        icaiWeightageMarks: 12,
        abcCategory: 'A',
        baseStudyMinutes: 300,
        examFocusNote: 'AS 14 Amalgamation, Internal Reconstruction, Schedule III Company Final Accounts & AS 21/23/27 CFS.'
      };
    }
    if (ch.includes('accounting standards') || ch.includes('branches') || ch.includes('buy back')) {
      return {
        icaiSectionCode: 'Mod II',
        icaiSectionName: 'Application of Accounting Standards & Special Transactions',
        icaiWeightageRange: '55% - 65%',
        icaiWeightageMarks: 15,
        abcCategory: 'A',
        baseStudyMinutes: 340,
        examFocusNote: 'AS 2, 10, 11, 12, 13, 16, 19, 20, 22, 26, 28, 29 case-based numericals, Sec 68 Buy-Back & Foreign Branches.'
      };
    }
    return {
      icaiSectionCode: 'Mod I',
      icaiSectionName: 'Framework for Preparation and Presentation of Financial Statements',
      icaiWeightageRange: '5% - 10%',
      icaiWeightageMarks: 6,
      abcCategory: 'B',
      baseStudyMinutes: 150,
      examFocusNote: 'Fundamental accounting assumptions, qualitative characteristics & capital maintenance.'
    };
  }

  if (subjectId === 'CorpLaw') {
    if (ch.includes('share capital') || ch.includes('management and administration') || ch.includes('accounts of companies') || ch.includes('prospectus') || ch.includes('dividend')) {
      return {
        icaiSectionCode: 'Part I - Core',
        icaiSectionName: 'The Companies Act, 2013 (Sec 1 to 148)',
        icaiWeightageRange: '55% - 65%',
        icaiWeightageMarks: 10,
        abcCategory: 'A',
        baseStudyMinutes: 220,
        examFocusNote: 'Share capital & debentures, AGM/EGM quorum & resolutions, dividend declaration, accounts & statutory audit.'
      };
    }
    if (ch.includes('limited liability partnership') || ch.includes('incorporation') || ch.includes('deposits') || ch.includes('charges')) {
      return {
        icaiSectionCode: 'Part I - Allied',
        icaiSectionName: 'Companies Act (Incorporation, Deposits, Charges) & LLP Act, 2008',
        icaiWeightageRange: '20% - 25%',
        icaiWeightageMarks: 8,
        abcCategory: 'B',
        baseStudyMinutes: 170,
        examFocusNote: 'Sec 73–76 Deposits, Sec 77–87 Charges, Foreign Companies & LLP Act partner liability/filings.'
      };
    }
    return {
      icaiSectionCode: 'Part II',
      icaiSectionName: 'Other Laws (General Clauses Act, 1897 & Interpretation of Statutes)',
      icaiWeightageRange: '15% - 20%',
      icaiWeightageMarks: 7,
      abcCategory: 'B',
      baseStudyMinutes: 150,
      examFocusNote: 'Literal, Mischief & Harmonious construction rules, internal/external aids & General Clauses definitions.'
    };
  }

  if (subjectId === 'Tax') {
    if (ch.includes('profits and gains') || ch.includes('total income') || ch.includes('salaries') || ch.includes('capital gains') || ch.includes('input tax credit') || ch.includes('value of supply')) {
      return {
        icaiSectionCode: 'Sec A & B Core',
        icaiSectionName: 'Core Income Tax Heads, Total Income (Sec 115BAC) & GST ITC/Valuation',
        icaiWeightageRange: '55% - 65%',
        icaiWeightageMarks: 9,
        abcCategory: 'A',
        baseStudyMinutes: 240,
        examFocusNote: 'Default regime u/s 115BAC vs old regime, PGBP/Salary/Capital Gains & GST ITC blocked credits/tax liability.'
      };
    }
    return {
      icaiSectionCode: 'Sec A & B Allied',
      icaiSectionName: 'Residential Status, Deductions, TDS/TCS, GST Supply, Registration & Returns',
      icaiWeightageRange: '35% - 45%',
      icaiWeightageMarks: 5,
      abcCategory: 'B',
      baseStudyMinutes: 150,
      examFocusNote: 'House property, clubbing/set-off, Chapter VI-A, TDS/Advance Tax & GST Time/Place of Supply, Registration & E-Invoicing.'
    };
  }

  if (subjectId === 'Cost') {
    if (ch.includes('marginal') || ch.includes('standard') || ch.includes('activity based') || ch.includes('process') || ch.includes('service') || ch.includes('overheads')) {
      return {
        icaiSectionCode: 'Core Costing',
        icaiSectionName: 'Marginal, Standard, ABC, Process, Service & Overhead Costing',
        icaiWeightageRange: '55% - 65%',
        icaiWeightageMarks: 9,
        abcCategory: 'A',
        baseStudyMinutes: 230,
        examFocusNote: 'CVP/BEP decision-making, Material/Labour/Overhead variances, Equivalent production & Service cost units.'
      };
    }
    return {
      icaiSectionCode: 'Foundational Costing',
      icaiSectionName: 'Material, Employee, Cost Sheet, Reconciliation, Contract & Budgetary Control',
      icaiWeightageRange: '35% - 45%',
      icaiWeightageMarks: 6,
      abcCategory: 'B',
      baseStudyMinutes: 165,
      examFocusNote: 'EOQ & stock levels, Halsey/Rowan bonus plans, Cost Sheet format, Joint/By-products & Flexible budgets.'
    };
  }

  if (subjectId === 'AuditInter') {
    if (ch.includes('items of financial statements') || ch.includes('audit report') || ch.includes('audit evidence') || ch.includes('risk assessment')) {
      return {
        icaiSectionCode: 'Core Auditing',
        icaiSectionName: 'Risk Assessment, Audit Evidence, Items of FS & Audit Report (CARO 2020)',
        icaiWeightageRange: '50% - 60%',
        icaiWeightageMarks: 11,
        abcCategory: 'A',
        baseStudyMinutes: 230,
        examFocusNote: 'Assertions for FS items, SA 500/501/505/520, SA 700/705/706, CARO 2020 & Internal Control.'
      };
    }
    return {
      icaiSectionCode: 'Standards & Entities',
      icaiSectionName: 'Audit Planning, Documentation, Completion, Bank/Entity Audit & Ethics',
      icaiWeightageRange: '40% - 50%',
      icaiWeightageMarks: 8,
      abcCategory: 'B',
      baseStudyMinutes: 170,
      examFocusNote: 'SA 200/210/220/230/300, SA 560/570/580, Bank NPA & advances audit, Co-op/Govt audit & SQC 1.'
    };
  }

  if (subjectId === 'FMSM') {
    if (ch.includes('cost of capital') || ch.includes('capital structure') || ch.includes('capital budgeting') || ch.includes('working capital') || ch.includes('ratios') || ch.includes('strategic analysis') || ch.includes('strategic choices')) {
      return {
        icaiSectionCode: 'FM & SM Core',
        icaiSectionName: 'WACC, Capital Structure, Capital Budgeting, Working Capital & Strategic Analysis/Choices',
        icaiWeightageRange: '60% - 70%',
        icaiWeightageMarks: 10,
        abcCategory: 'A',
        baseStudyMinutes: 220,
        examFocusNote: 'WACC/EBIT-EPS indifference, NPV/IRR capital budgeting, operating cycle & Porter/BCG/Ansoff strategic models.'
      };
    }
    return {
      icaiSectionCode: 'FM & SM Allied',
      icaiSectionName: 'Scope of FM, Leverages, Dividend Decisions & Strategy Implementation',
      icaiWeightageRange: '30% - 40%',
      icaiWeightageMarks: 7,
      abcCategory: 'B',
      baseStudyMinutes: 155,
      examFocusNote: 'DOL/DFL/DCL leverages, Walter & Gordon dividend models, McKinsey 7S & Balanced Scorecard.'
    };
  }

  // =========================================================================
  // CA FOUNDATION SUBJECTS (Papers 1 to 4)
  // =========================================================================
  if (subjectId === 'Accounts') {
    if (ch.includes('final accounts') || ch.includes('partnership') || ch.includes('company accounts') || ch.includes('not-for-profit') || ch.includes('incomplete records')) {
      return {
        icaiSectionCode: 'Core Financial',
        icaiSectionName: 'Final Accounts, NPO, Single Entry, Partnership & Company Accounts',
        icaiWeightageRange: '55% - 65%',
        icaiWeightageMarks: 12,
        abcCategory: 'A',
        baseStudyMinutes: 240,
        examFocusNote: 'Sole proprietor adjustments, NPO Income & Expenditure, Partnership admission/retirement/dissolution & Share forfeiture/re-issue.'
      };
    }
    return {
      icaiSectionCode: 'Accounting Process',
      icaiSectionName: 'Theoretical Framework, BRS, Inventories, Depreciation & Bills of Exchange',
      icaiWeightageRange: '35% - 45%',
      icaiWeightageMarks: 7,
      abcCategory: 'B',
      baseStudyMinutes: 165,
      examFocusNote: 'Rectification of errors, Bank Reconciliation, FIFO/Weighted Average inventory, SLM/WDV depreciation & Bills of Exchange.'
    };
  }

  if (subjectId === 'Law') {
    if (ch.includes('contract act') || ch.includes('companies act') || ch.includes('sale of goods')) {
      return {
        icaiSectionCode: 'Core Mercantile',
        icaiSectionName: 'Indian Contract Act 1872, Sale of Goods Act 1930 & Companies Act 2013',
        icaiWeightageRange: '65% - 75%',
        icaiWeightageMarks: 10,
        abcCategory: 'A',
        baseStudyMinutes: 210,
        examFocusNote: 'Offer/Acceptance/Consideration/Breach/Indemnity/Bailment/Agency, Caveat Emptor & Unpaid Seller, Doctrine of Ultra Vires/Indoor Management.'
      };
    }
    return {
      icaiSectionCode: 'Allied Business Laws',
      icaiSectionName: 'Indian Partnership Act 1932, LLP Act 2008, Negotiable Instruments Act 1881 & Regulatory Framework',
      icaiWeightageRange: '25% - 35%',
      icaiWeightageMarks: 7,
      abcCategory: 'B',
      baseStudyMinutes: 155,
      examFocusNote: 'Minor admitted to partnership benefits, Implied Authority, LLP features & Sec 138 Dishonour of Cheque.'
    };
  }

  if (subjectId === 'MathStats') {
    if (ch.includes('mathematics of finance') || ch.includes('central tendency') || ch.includes('probability') || ch.includes('theoretical distributions') || ch.includes('correlation') || ch.includes('direction') || ch.includes('number series')) {
      return {
        icaiSectionCode: 'High-Yield QA',
        icaiSectionName: 'Time Value of Money, Logical Reasoning, Central Tendency/Dispersion, Probability & Correlation',
        icaiWeightageRange: '60% - 70%',
        icaiWeightageMarks: 8,
        abcCategory: 'A',
        baseStudyMinutes: 195,
        examFocusNote: 'Compound interest/Annuity/NPV, 20-mark Logical Reasoning drills, Mean/SD/CV, Bayes Theorem, Binomial/Poisson/Normal & Regression.'
      };
    }
    return {
      icaiSectionCode: 'Core Math & Index',
      icaiSectionName: 'Ratio/Indices/Log, Equations, Permutations & Combinations, AP/GP, Calculus & Index Numbers',
      icaiWeightageRange: '30% - 40%',
      icaiWeightageMarks: 5,
      abcCategory: 'B',
      baseStudyMinutes: 140,
      examFocusNote: 'Quadratic/cubic roots, nPr/nCr, AP/GP sum formulas, Fisher Ideal Index time/factor reversal tests.'
    };
  }

  if (subjectId === 'Econ') {
    if (ch.includes('demand and supply') || ch.includes('production and cost') || ch.includes('price determination') || ch.includes('national income') || ch.includes('money market')) {
      return {
        icaiSectionCode: 'Core Micro & Macro',
        icaiSectionName: 'Demand/Supply Elasticity, Production/Cost, Market Structures, National Income & Monetary Policy',
        icaiWeightageRange: '55% - 65%',
        icaiWeightageMarks: 12,
        abcCategory: 'A',
        baseStudyMinutes: 200,
        examFocusNote: 'Price/Income/Cross elasticity, Law of Variable Proportions, Perfect Competition/Monopoly/Oligopoly, GDP/NNP & RBI repo/CRR/SLR.'
      };
    }
    return {
      icaiSectionCode: 'Macro & Indian Econ',
      icaiSectionName: 'Business Economics Intro, Consumer Behaviour, Public Finance, International Trade & Indian Economy',
      icaiWeightageRange: '35% - 45%',
      icaiWeightageMarks: 8,
      abcCategory: 'B',
      baseStudyMinutes: 150,
      examFocusNote: 'Indifference curve properties, Fiscal deficit/multiplier, Comparative Advantage, BoP & LPG 1991 reforms.'
    };
  }

  // =========================================================================
  // PAPER 6: INTEGRATED BUSINESS SOLUTIONS (100 Marks | Multi-Disciplinary Case Studies)
  // =========================================================================
  if (ch.includes('case scenarios') || ch.includes('financial reporting') || ch.includes('direct taxes') || ch.includes('advanced financial management')) {
    return {
      icaiSectionCode: 'Case Module I',
      icaiSectionName: 'Core Multi-Disciplinary Pillars & Case Scenarios (FR, AFM, DT, Case Scenarios)',
      icaiWeightageRange: '55% - 65%',
      icaiWeightageMarks: ch.includes('case scenarios') ? 20 : 14,
      abcCategory: 'A',
      baseStudyMinutes: ch.includes('case scenarios') ? 240 : 180,
      examFocusNote: '25-Mark integrated case studies combining Ind AS adjustments, financial valuation, direct tax impact & multi-disciplinary case scenarios.'
    };
  }
  return {
    icaiSectionCode: 'Case Module II',
    icaiSectionName: 'Allied Multi-Disciplinary Pillars (Auditing, Indirect Taxes, Corporate & Economic Laws, SCMPE)',
    icaiWeightageRange: '35% - 45%',
    icaiWeightageMarks: 11,
    abcCategory: 'B',
    baseStudyMinutes: 150,
    examFocusNote: 'Cross-referencing statutory index, GST/Customs, CARO/Ethics, Corporate & Economic Laws (SPOM Set A) & SCMPE (SPOM Set B).'
  };
}

export function getSubjectChaptersForPlanner(subId: SubjectId): string[] {
  const chaps = SUBJECTS_METADATA[subId]?.chapters || [];
  if (chaps.length > 0) return chaps;
  if (subId === 'IBS') return IBS_DEFAULT_CHAPTERS_LIST;
  return [];
}

/**
 * Generates the complete ICAI Chapter Weightage & ABC Catalog across all papers of the active CA Level
 */
export function buildFullICAIChapterCatalog(level: CALevel = getSelectedCALevel()): ICAIChapterCatalogItem[] {
  const subjects: SubjectId[] = getLevelSubjectIds(level);
  const items: ICAIChapterCatalogItem[] = [];

  subjects.forEach(subId => {
    const chapters = getSubjectChaptersForPlanner(subId);
    chapters.forEach(chapterName => {
      const meta = classifyChapterICAI(subId, chapterName);
      items.push({
        subjectId: subId,
        chapterName,
        ...meta
      });
    });
  });

  return items;
}

/**
 * Computes the ICAI-calibrated expected minutes for a single chapter in a given study phase.
 * Formula:
 * ExpectedMins = BaseStudyMinutes * ABCMultiplier * PhaseCompressionRatio * ConfidenceMultiplier * RetentionDecayFactor
 * Rounded to nearest 15 minutes (minimum 30 mins if not skipped).
 */
export function computeFormulaExpectedMinutes(
  baseStudyMinutes: number,
  abcCategory: ABCCategory,
  phaseId: StudyPhaseId,
  confidence: ChapterConfidenceLevel,
  isSkipped: boolean,
  lastStudiedDate?: string
): number {
  if (isSkipped) return 0;
  const abcMult = ABC_MULTIPLIERS[abcCategory] || 1.0;
  const phaseComp = PHASE_LABELS[phaseId]?.compressionRatio || 0.55;
  const confMult = CONFIDENCE_MULTIPLIERS[confidence]?.multiplier || 1.0;

  let retentionFactor = 1.0;
  if (lastStudiedDate && phaseId !== 'baseline') {
    const daysSince = Math.floor((Date.now() - new Date(lastStudiedDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 21) {
      retentionFactor = 1.10; // +10% refresh allocation for decayed chapters
    }
  }

  const raw = baseStudyMinutes * abcMult * phaseComp * confMult * retentionFactor;
  const rounded = Math.round(raw / 15) * 15;
  return Math.max(30, rounded);
}

/**
 * Reads actual study minutes logged and last studied date per chapter from localStorage focus sessions
 */
export function getActualStudyMetricsByChapter(level: CALevel = getSelectedCALevel()): Map<string, { minutes: number; lastDate: string }> {
  const map = new Map<string, { minutes: number; lastDate: string }>();
  try {
    const rawSessions = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', level));
    if (rawSessions) {
      const sessions: FocusSession[] = JSON.parse(rawSessions);
      if (Array.isArray(sessions)) {
        sessions.forEach(s => {
          if (s.sessionType && s.sessionType !== 'work') return;
          if (!s.subjectId || !s.chapterName) return;
          const key = `${s.subjectId}::${s.chapterName}`;
          const prev = map.get(key) || { minutes: 0, lastDate: '' };
          const sDate = s.timestamp ? s.timestamp.split('T')[0] : '';
          map.set(key, {
            minutes: prev.minutes + (Number(s.duration) || 0),
            lastDate: sDate > prev.lastDate ? sDate : prev.lastDate
          });
        });
      }
    }
  } catch (e) {}
  return map;
}

/**
 * Builds or hydrates the full list of ChapterPlanInput items for the active CA level's subjects
 */
export function loadOrInitializeChapterPlanInputs(level: CALevel = getSelectedCALevel()): ChapterPlanInput[] {
  const catalog = buildFullICAIChapterCatalog(level);
  const actualMetrics = getActualStudyMetricsByChapter(level);

  let storedMap = new Map<string, ChapterPlanInput>();
  try {
    const raw = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_CHAPTER_PLAN_INPUTS, level));
    if (raw) {
      const parsed: ChapterPlanInput[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(item => {
          storedMap.set(`${item.subjectId}::${item.chapterName}`, item);
        });
      }
    }
  } catch (e) {}

  const customABCOverrides = loadCustomABCOverrides(level);

  return catalog.map(cat => {
    const key = `${cat.subjectId}::${cat.chapterName}`;
    const existing = storedMap.get(key);
    const actual = actualMetrics.get(key);

    const abcCategory: ABCCategory = customABCOverrides[key] || existing?.abcCategory || cat.abcCategory;
    const confidence: ChapterConfidenceLevel = existing?.confidence || 'medium';
    const isSkipped: boolean = Boolean(existing?.isSkipped);
    const isUserEditedTime: Record<StudyPhaseId, boolean> = existing?.isUserEditedTime || {
      baseline: false,
      rev1: false,
      rev2: false,
      rev3: false
    };

    const phases: StudyPhaseId[] = ['baseline', 'rev1', 'rev2', 'rev3'];
    const expectedMinutesByPhase: Record<StudyPhaseId, number> = {
      baseline: 0,
      rev1: 0,
      rev2: 0,
      rev3: 0
    };

    phases.forEach(pId => {
      if (isSkipped) {
        expectedMinutesByPhase[pId] = 0;
      } else if (isUserEditedTime[pId] && existing?.expectedMinutesByPhase?.[pId] !== undefined) {
        expectedMinutesByPhase[pId] = existing.expectedMinutesByPhase[pId];
      } else {
        expectedMinutesByPhase[pId] = computeFormulaExpectedMinutes(
          cat.baseStudyMinutes,
          abcCategory,
          pId,
          confidence,
          isSkipped,
          actual?.lastDate
        );
      }
    });

    return {
      subjectId: cat.subjectId,
      chapterName: cat.chapterName,
      icaiSectionCode: cat.icaiSectionCode,
      icaiSectionName: cat.icaiSectionName,
      icaiWeightageRange: cat.icaiWeightageRange,
      icaiWeightageMarks: cat.icaiWeightageMarks,
      abcCategory,
      confidence,
      isSkipped,
      expectedMinutesByPhase,
      isUserEditedTime,
      actualMinutesLogged: actual?.minutes || 0,
      lastStudiedDate: actual?.lastDate
    };
  });
}

function getDefaultPairsForLevel(level: CALevel): [SubjectId, SubjectId][] {
  if (level === 'foundation') {
    return [['Accounts', 'Law'], ['MathStats', 'Econ']];
  }
  if (level === 'cma_foundation') {
    return [['CMAFoundLaw', 'CMAFoundAcc'], ['CMAFoundMath', 'CMAFoundEcon']];
  }
  if (level === 'intermediate') {
    return [['AdvAcc', 'CorpLaw'], ['Tax', 'Cost'], ['AuditInter', 'FMSM']];
  }
  if (level === 'cma_intermediate') {
    return [
      ['CMAInterLaw', 'CMAInterFA'],
      ['CMAInterTax', 'CMAInterCost'],
      ['CMAInterOMSM', 'CMAInterCAA'],
      ['CMAInterFMDA', 'CMAInterMA'],
    ];
  }
  if (level === 'cma_final') {
    return [
      ['CMAFinalLaw', 'CMAFinalSFM'],
      ['CMAFinalDT', 'CMAFinalSCM'],
      ['CMAFinalCMA', 'CMAFinalCFR'],
      ['CMAFinalIDT', 'CMAFinalSPBV'],
    ];
  }
  return [['FR', 'Audit'], ['AFM', 'DT'], ['IDT', 'IBS']];
}

export function getDefaultAutomatedPlanConfig(
  prepStartDate: string,
  examDate: string,
  level: CALevel = getSelectedCALevel()
): AutomatedStudyPlanConfig {
  const levelSubjects = getLevelSubjectIds(level);
  const defaultPairs = getDefaultPairsForLevel(level);

  try {
    const raw = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_AUTO_PLAN_CONFIG, level));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const validOrder = Array.isArray(parsed.subjectOrder)
          ? parsed.subjectOrder.filter((s: SubjectId) => levelSubjects.includes(s))
          : [];
        const validFilter = Array.isArray(parsed.activeSubjectsFilter)
          ? parsed.activeSubjectsFilter.filter((s: SubjectId) => levelSubjects.includes(s))
          : [];
        return {
          isConfigured: Boolean(parsed.isConfigured),
          prepStartDate: parsed.prepStartDate || prepStartDate,
          examDate: parsed.examDate || examDate,
          includeBaseline: parsed.includeBaseline !== undefined ? Boolean(parsed.includeBaseline) : false,
          plannedRevisionsCount: (parsed.plannedRevisionsCount as 1 | 2 | 3) || 2,
          plannedMocksCount: parsed.plannedMocksCount !== undefined ? Number(parsed.plannedMocksCount) : levelSubjects.length,
          sequencingMode: parsed.sequencingMode || 'single_subject',
          subjectOrder: validOrder.length === levelSubjects.length ? validOrder : [...levelSubjects],
          dailyPairs: Array.isArray(parsed.dailyPairs) && parsed.dailyPairs.length === defaultPairs.length
            ? parsed.dailyPairs
            : defaultPairs,
          groupOrder: parsed.groupOrder || 'G1_FIRST',
          activeSubjectsFilter: validFilter.length > 0 ? validFilter : [...levelSubjects],
          defaultCompletionCondition: parsed.defaultCompletionCondition || 'targets_only',
          weeklyHoursByDay: parsed.weeklyHoursByDay || {
            Mon: 8,
            Tue: 8,
            Wed: 8,
            Thu: 8,
            Fri: 8,
            Sat: 10,
            Sun: 10
          },
          exceptionalDays: Array.isArray(parsed.exceptionalDays) ? parsed.exceptionalDays : [],
          activePhaseId: parsed.activePhaseId || 'rev1',
          completedPhases: Array.isArray(parsed.completedPhases) ? parsed.completedPhases : [],
          lastGeneratedAt: parsed.lastGeneratedAt,
          lastAmendedAt: parsed.lastAmendedAt
        };
      }
    }
  } catch (e) {}

  return {
    isConfigured: false,
    prepStartDate,
    examDate,
    includeBaseline: false,
    plannedRevisionsCount: 2,
    plannedMocksCount: levelSubjects.length,
    sequencingMode: 'single_subject',
    subjectOrder: [...levelSubjects],
    dailyPairs: defaultPairs,
    groupOrder: 'G1_FIRST',
    activeSubjectsFilter: [...levelSubjects],
    defaultCompletionCondition: 'targets_only',
    weeklyHoursByDay: {
      Mon: 8,
      Tue: 8,
      Wed: 8,
      Thu: 8,
      Fri: 8,
      Sat: 10,
      Sun: 10
    },
    exceptionalDays: [],
    activePhaseId: 'rev1',
    completedPhases: []
  };
}

/**
 * Validates that adding or updating an exceptional day does not exceed 3 exceptional days in the same YYYY-MM month.
 */
export function validateExceptionalDayLimit(
  existingList: ExceptionalDayEntry[],
  candidateDate: string
): { valid: boolean; countInMonth: number; monthKey: string; message?: string } {
  const monthKey = candidateDate.slice(0, 7); // YYYY-MM
  const filteredSameMonth = existingList.filter(item => item.date.slice(0, 7) === monthKey && item.date !== candidateDate);
  if (filteredSameMonth.length >= 3) {
    return {
      valid: false,
      countInMonth: filteredSameMonth.length,
      monthKey,
      message: `Maximum 3 exceptional days allowed per calendar month (${monthKey} already has 3 dates).`
    };
  }
  return {
    valid: true,
    countInMonth: filteredSameMonth.length + 1,
    monthKey
  };
}

/**
 * Returns the planned study capacity in minutes for any calendar date YYYY-MM-DD
 */
export function getDailyCapacityMinutesForDate(dateStr: string, config: AutomatedStudyPlanConfig): number {
  const ex = config.exceptionalDays.find(d => d.date === dateStr);
  if (ex) {
    return Math.max(0, Math.round(ex.hours * 60));
  }
  const d = new Date(`${dateStr}T00:00:00`);
  const dayIdx = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const mapIdxToKey: DayOfWeekKey[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const key = mapIdxToKey[dayIdx] || 'Mon';
  const hrs = config.weeklyHoursByDay[key] ?? 8;
  return Math.max(0, Math.round(hrs * 60));
}

/**
 * Returns ordered list of active phases based on config (e.g. ['baseline', 'rev1', 'rev2'])
 */
export function getPlannedPhasesList(config: AutomatedStudyPlanConfig): StudyPhaseId[] {
  const phases: StudyPhaseId[] = [];
  if (config.includeBaseline) {
    phases.push('baseline');
  }
  if (config.plannedRevisionsCount >= 1) phases.push('rev1');
  if (config.plannedRevisionsCount >= 2) phases.push('rev2');
  if (config.plannedRevisionsCount >= 3) phases.push('rev3');
  return phases;
}

/**
 * Computes total available study hours between startFromDate and examDate vs total required hours across phases
 */
export function computeCalendarVsRequiredSummary(
  config: AutomatedStudyPlanConfig,
  chapterInputs: ChapterPlanInput[],
  startFromDate?: string,
  phasesToInclude?: StudyPhaseId[],
  _level?: CALevel
): {
  totalCalendarDays: number;
  activeStudyDays: number;
  totalAvailableMinutes: number;
  totalRequiredMinutes: number;
  phaseBreakdown: { phaseId: StudyPhaseId; label: string; requiredMinutes: number; chaptersCount: number }[];
  subjectBreakdown: Record<SubjectId, { requiredMinutes: number; activeChapters: number; skippedChapters: number }>;
  utilizationPercent: number;
} {
  const effectiveStart = startFromDate || config.prepStartDate;
  const phases = phasesToInclude || getPlannedPhasesList(config);
  const activeSubjectsSet = new Set(config.activeSubjectsFilter);

  let totalCalendarDays = 0;
  let activeStudyDays = 0;
  let totalAvailableMinutes = 0;

  const cur = new Date(`${effectiveStart}T00:00:00`);
  const end = new Date(`${config.examDate}T00:00:00`);

  while (cur.getTime() <= end.getTime()) {
    const dStr = cur.toISOString().split('T')[0];
    const cap = getDailyCapacityMinutesForDate(dStr, config);
    totalCalendarDays++;
    if (cap > 0) activeStudyDays++;
    totalAvailableMinutes += cap;
    cur.setDate(cur.getDate() + 1);
  }

  // Reserve 180 mins per planned Mock Test
  const mockReservedMinutes = Math.max(0, config.plannedMocksCount) * 180;

  const phaseBreakdown = phases.map(pId => {
    let req = 0;
    let count = 0;
    chapterInputs.forEach(ch => {
      if (!activeSubjectsSet.has(ch.subjectId)) return;
      if (ch.isSkipped) return;
      req += ch.expectedMinutesByPhase[pId] || 0;
      count++;
    });
    return {
      phaseId: pId,
      label: PHASE_LABELS[pId].shortLabel,
      requiredMinutes: req,
      chaptersCount: count
    };
  });

  const subjectBreakdown = {} as Record<SubjectId, { requiredMinutes: number; activeChapters: number; skippedChapters: number }>;
  ([...FOUNDATION_SUBJECT_IDS, ...INTERMEDIATE_SUBJECT_IDS, ...FINAL_SUBJECT_IDS] as SubjectId[]).forEach(subId => {
    subjectBreakdown[subId] = { requiredMinutes: 0, activeChapters: 0, skippedChapters: 0 };
  });

  chapterInputs.forEach(ch => {
    if (!activeSubjectsSet.has(ch.subjectId)) return;
    if (!subjectBreakdown[ch.subjectId]) {
      subjectBreakdown[ch.subjectId] = { requiredMinutes: 0, activeChapters: 0, skippedChapters: 0 };
    }
    if (ch.isSkipped) {
      subjectBreakdown[ch.subjectId].skippedChapters++;
    } else {
      subjectBreakdown[ch.subjectId].activeChapters++;
      phases.forEach(pId => {
        subjectBreakdown[ch.subjectId].requiredMinutes += ch.expectedMinutesByPhase[pId] || 0;
      });
    }
  });

  const totalRequiredMinutes = phaseBreakdown.reduce((acc, p) => acc + p.requiredMinutes, 0) + mockReservedMinutes;
  const utilizationPercent = totalAvailableMinutes > 0
    ? Math.round((totalRequiredMinutes / totalAvailableMinutes) * 100)
    : 100;

  return {
    totalCalendarDays,
    activeStudyDays,
    totalAvailableMinutes,
    totalRequiredMinutes,
    phaseBreakdown,
    subjectBreakdown,
    utilizationPercent
  };
}

/**
 * Generates the complete automated schedule:
 * 1. Checkpoints (`GeneratedMilestoneItem[]`) for all subjects across all planned phases + Mock Test checkpoints
 * 2. Daily Tasks (`GoogleTask[]`) mapped date-by-date respecting weekly & exceptional day capacities
 * 3. RevisionPhase[] for `PreparationRoadmapView` compatibility
 */
export function generateAutomatedRoadmapAndDailySchedule(
  config: AutomatedStudyPlanConfig,
  chapterInputs: ChapterPlanInput[],
  existingTasks: GoogleTask[],
  existingCheckpoints: GeneratedMilestoneItem[],
  options?: {
    startFromDate?: string;
    phasesToGenerate?: StudyPhaseId[];
    preserveCompletedBeforeStart?: boolean;
  }
): {
  checkpoints: GeneratedMilestoneItem[];
  generatedTasks: GoogleTask[];
  mergedTasks: GoogleTask[];
} {
  const startStr = options?.startFromDate || config.prepStartDate;
  const phases = options?.phasesToGenerate || getPlannedPhasesList(config);
  const activeSubjects = config.subjectOrder.filter(s => config.activeSubjectsFilter.includes(s));

  // Build ordered list of available calendar days with capacity
  const calendarDays: { dateStr: string; capacityMins: number; remainingMins: number }[] = [];
  const curDate = new Date(`${startStr}T00:00:00`);
  const endDate = new Date(`${config.examDate}T00:00:00`);

  while (curDate.getTime() <= endDate.getTime()) {
    const dStr = curDate.toISOString().split('T')[0];
    const cap = getDailyCapacityMinutesForDate(dStr, config);
    calendarDays.push({
      dateStr: dStr,
      capacityMins: cap,
      remainingMins: cap
    });
    curDate.setDate(curDate.getDate() + 1);
  }

  if (calendarDays.length === 0) {
    calendarDays.push({
      dateStr: startStr,
      capacityMins: 480,
      remainingMins: 480
    });
  }

  // Sort chapters within a subject by ICAI Priority: Category A -> B -> C, then Low Confidence -> Medium -> High
  const sortChaptersByICAIYield = (list: ChapterPlanInput[]) => {
    const abcRank: Record<ABCCategory, number> = { A: 1, B: 2, C: 3 };
    const confRank: Record<ChapterConfidenceLevel, number> = { low: 1, medium: 2, high: 3 };
    return [...list].sort((a, b) => {
      if (abcRank[a.abcCategory] !== abcRank[b.abcCategory]) {
        return abcRank[a.abcCategory] - abcRank[b.abcCategory];
      }
      if (confRank[a.confidence] !== confRank[b.confidence]) {
        return confRank[a.confidence] - confRank[b.confidence];
      }
      return b.icaiWeightageMarks - a.icaiWeightageMarks;
    });
  };

  // Determine total required minutes vs total available minutes so we can scale daily packing proportionally if needed
  const totalAvailMins = calendarDays.reduce((acc, d) => acc + d.capacityMins, 0);
  let totalReqMins = Math.max(0, config.plannedMocksCount) * 180;
  phases.forEach(pId => {
    chapterInputs.forEach(ch => {
      if (!activeSubjects.includes(ch.subjectId) || ch.isSkipped) return;
      totalReqMins += ch.expectedMinutesByPhase[pId] || 0;
    });
  });

  // If total required exceeds available capacity, scale effective daily capacity so all phases fit before Exam Date
  const packingFactor = totalAvailMins > 0 && totalReqMins > totalAvailMins
    ? totalReqMins / totalAvailMins
    : 1.0;

  if (packingFactor > 1.0) {
    calendarDays.forEach(d => {
      if (d.capacityMins > 0) {
        d.remainingMins = Math.ceil(d.capacityMins * packingFactor);
      }
    });
  }

  const newCheckpoints: GeneratedMilestoneItem[] = [];
  const generatedTasks: GoogleTask[] = [];
  let dayCursor = 0;

  const advanceCursorIfDepleted = () => {
    while (dayCursor < calendarDays.length - 1 && calendarDays[dayCursor].remainingMins <= 15) {
      dayCursor++;
    }
  };

  const allocateChapterTask = (
    ch: ChapterPlanInput,
    phaseId: StudyPhaseId,
    durationMins: number,
    milestoneId: string,
    preferredDayIdx?: number
  ): string => {
    let targetIdx = preferredDayIdx !== undefined ? preferredDayIdx : dayCursor;
    while (targetIdx < calendarDays.length - 1 && calendarDays[targetIdx].remainingMins <= 15) {
      targetIdx++;
    }
    const dayObj = calendarDays[Math.min(targetIdx, calendarDays.length - 1)];
    dayObj.remainingMins = Math.max(0, dayObj.remainingMins - durationMins);
    if (preferredDayIdx === undefined) {
      dayCursor = targetIdx;
      advanceCursorIfDepleted();
    }

    const phaseMeta = PHASE_LABELS[phaseId];
    const relevance: GoogleTask['relevance'] =
      phaseId === 'baseline' ? 'General' : phaseId === 'rev3' ? 'Final Revision' : 'Revision';

    const taskId = `auto_task_${phaseId}_${ch.subjectId}_${generatedTasks.length}_${Date.now()}`;
    generatedTasks.push({
      id: taskId,
      title: `[${ch.subjectId}] ${ch.chapterName} (${phaseMeta.shortLabel})`,
      cleanTitle: ch.chapterName,
      chapterName: ch.chapterName,
      subjectCode: ch.subjectId,
      due: dayObj.dateStr,
      taskDate: dayObj.dateStr,
      status: 'needsAction',
      priority: ch.abcCategory === 'A' ? 'High' : ch.abcCategory === 'B' ? 'Medium' : 'Low',
      relevance,
      revKey: phaseMeta.revKey,
      milestoneId,
      phaseId,
      targetDurationMinutes: durationMins,
      duration: durationMins,
      activityType: 'study',
      notes: `Relevance: ${relevance}\nSubject: ${ch.subjectId}\nChapter: ${ch.chapterName}\nTargetDurationMinutes: ${durationMins}`
    });

    return dayObj.dateStr;
  };

  // Determine ordered subject list based on sequencing mode
  const getOrderedSubjectsForPhase = (): SubjectId[] => {
    if (config.sequencingMode === 'group_wise') {
      const level = getSelectedCALevel();
      if (level === 'foundation') {
        const g1: SubjectId[] = ['Accounts', 'Law'];
        const g2: SubjectId[] = ['MathStats', 'Econ'];
        const ordered = config.groupOrder === 'G1_FIRST' ? [...g1, ...g2] : [...g2, ...g1];
        return ordered.filter(s => activeSubjects.includes(s));
      }
      if (level === 'cma_foundation') {
        const g1: SubjectId[] = ['CMAFoundLaw', 'CMAFoundAcc'];
        const g2: SubjectId[] = ['CMAFoundMath', 'CMAFoundEcon'];
        const ordered = config.groupOrder === 'G1_FIRST' ? [...g1, ...g2] : [...g2, ...g1];
        return ordered.filter(s => activeSubjects.includes(s));
      }
      if (level === 'intermediate') {
        const g1: SubjectId[] = ['AdvAcc', 'CorpLaw', 'Tax'];
        const g2: SubjectId[] = ['Cost', 'AuditInter', 'FMSM'];
        const ordered = config.groupOrder === 'G1_FIRST' ? [...g1, ...g2] : [...g2, ...g1];
        return ordered.filter(s => activeSubjects.includes(s));
      }
      if (level === 'cma_intermediate') {
        const g1: SubjectId[] = ['CMAInterLaw', 'CMAInterFA', 'CMAInterTax', 'CMAInterCost'];
        const g2: SubjectId[] = ['CMAInterOMSM', 'CMAInterCAA', 'CMAInterFMDA', 'CMAInterMA'];
        const ordered = config.groupOrder === 'G1_FIRST' ? [...g1, ...g2] : [...g2, ...g1];
        return ordered.filter(s => activeSubjects.includes(s));
      }
      if (level === 'cma_final') {
        const g1: SubjectId[] = ['CMAFinalLaw', 'CMAFinalSFM', 'CMAFinalDT', 'CMAFinalSCM'];
        const g2: SubjectId[] = ['CMAFinalCMA', 'CMAFinalCFR', 'CMAFinalIDT', 'CMAFinalSPBV'];
        const ordered = config.groupOrder === 'G1_FIRST' ? [...g1, ...g2] : [...g2, ...g1];
        return ordered.filter(s => activeSubjects.includes(s));
      }
      const g1: SubjectId[] = ['FR', 'AFM', 'Audit'];
      const g2: SubjectId[] = ['DT', 'IDT', 'IBS'];
      const ordered = config.groupOrder === 'G1_FIRST' ? [...g1, ...g2] : [...g2, ...g1];
      return ordered.filter(s => activeSubjects.includes(s));
    }
    return activeSubjects;
  };

  const mocksPerPhase = phases.length > 0 ? Math.floor(config.plannedMocksCount / phases.length) : 0;
  let mocksScheduledSoFar = 0;

  phases.forEach((phaseId, phaseIdx) => {
    const phaseMeta = PHASE_LABELS[phaseId];
    const orderedSubjects = getOrderedSubjectsForPhase();

    if (config.sequencingMode === 'daily_pair' && orderedSubjects.length >= 2) {
      // Pair subjects 2 at a time (e.g. Pair 1, Pair 2, Pair 3)
      const pairs: SubjectId[][] = [];
      const used = new Set<SubjectId>();
      config.dailyPairs.forEach(([s1, s2]) => {
        const validPair = [s1, s2].filter(s => orderedSubjects.includes(s) && !used.has(s));
        if (validPair.length > 0) {
          validPair.forEach(s => used.add(s));
          pairs.push(validPair);
        }
      });
      orderedSubjects.forEach(s => {
        if (!used.has(s)) pairs.push([s]);
      });

      pairs.forEach(pairSubs => {
        const pairStartStr = calendarDays[Math.min(dayCursor, calendarDays.length - 1)].dateStr;
        const queues = pairSubs.map(subId => ({
          subId,
          milestoneId: `cp_auto_${phaseId}_${subId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          chapters: sortChaptersByICAIYield(
            chapterInputs.filter(c => c.subjectId === subId && !c.isSkipped && (c.expectedMinutesByPhase[phaseId] || 0) > 0)
          ),
          lastDate: pairStartStr,
          totalMins: 0
        }));

        // Interleave chapters across the paired subjects day by day
        let hasRemaining = true;
        let turn = 0;
        while (hasRemaining) {
          hasRemaining = false;
          for (let qIdx = 0; qIdx < queues.length; qIdx++) {
            const q = queues[(turn + qIdx) % queues.length];
            if (q.chapters.length > 0) {
              hasRemaining = true;
              const ch = q.chapters.shift()!;
              const mins = ch.expectedMinutesByPhase[phaseId] || 60;
              q.totalMins += mins;
              q.lastDate = allocateChapterTask(ch, phaseId, mins, q.milestoneId);
            }
          }
          turn++;
        }

        // Create milestone for each subject in the pair
        queues.forEach(q => {
          const subChaps = chapterInputs
            .filter(c => c.subjectId === q.subId && !c.isSkipped)
            .map(c => c.chapterName);
          if (subChaps.length === 0) return;

          newCheckpoints.push({
            id: q.milestoneId,
            subjectId: q.subId,
            customTitle: `${q.subId} • ${phaseMeta.shortLabel}`,
            phaseId,
            revisionCycle: phaseMeta.revisionCycleLabel,
            startDate: pairStartStr,
            targetDate: q.lastDate,
            targetChapters: subChaps.length,
            selectedChapters: subChaps,
            completedChapters: [],
            allocatedHoursTotal: Number((q.totalMins / 60).toFixed(1)),
            completionCondition: config.defaultCompletionCondition,
            mockTestCompleted: false,
            notes: `Auto-scheduled via Daily Pairing (${pairSubs.join(' + ')}) • ICAI ABC Weighted`
          });
        });
      });
    } else if (config.sequencingMode === 'consolidated') {
      // Consolidated Multi-Subject Mix: Schedule Category A across all active subjects, then Category B, then Category C
      const phaseStartStr = calendarDays[Math.min(dayCursor, calendarDays.length - 1)].dateStr;
      const allPhaseChaps = sortChaptersByICAIYield(
        chapterInputs.filter(c => orderedSubjects.includes(c.subjectId) && !c.isSkipped && (c.expectedMinutesByPhase[phaseId] || 0) > 0)
      );

      const subjectCompletionDates: Record<string, { lastDate: string; totalMins: number; milestoneId: string }> = {};
      orderedSubjects.forEach(s => {
        subjectCompletionDates[s] = {
          lastDate: phaseStartStr,
          totalMins: 0,
          milestoneId: `cp_auto_${phaseId}_${s}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
        };
      });

      allPhaseChaps.forEach(ch => {
        const mins = ch.expectedMinutesByPhase[phaseId] || 60;
        const mId = subjectCompletionDates[ch.subjectId].milestoneId;
        const dStr = allocateChapterTask(ch, phaseId, mins, mId);
        subjectCompletionDates[ch.subjectId].lastDate = dStr;
        subjectCompletionDates[ch.subjectId].totalMins += mins;
      });

      orderedSubjects.forEach(subId => {
        const subChaps = chapterInputs
          .filter(c => c.subjectId === subId && !c.isSkipped)
          .map(c => c.chapterName);
        if (subChaps.length === 0) return;

        newCheckpoints.push({
          id: subjectCompletionDates[subId].milestoneId,
          subjectId: subId,
          customTitle: `${subId} • ${phaseMeta.shortLabel} (Consolidated)`,
          phaseId,
          revisionCycle: phaseMeta.revisionCycleLabel,
          startDate: phaseStartStr,
          targetDate: subjectCompletionDates[subId].lastDate,
          targetChapters: subChaps.length,
          selectedChapters: subChaps,
          completedChapters: [],
          allocatedHoursTotal: Number((subjectCompletionDates[subId].totalMins / 60).toFixed(1)),
          completionCondition: config.defaultCompletionCondition,
          mockTestCompleted: false,
          notes: `Consolidated ABC Priority Schedule • Cat A & Low Confidence Front-Loaded`
        });
      });
    } else {
      // Single-Subject Sequential or Group-Wise Sequential
      orderedSubjects.forEach(subId => {
        const subStartStr = calendarDays[Math.min(dayCursor, calendarDays.length - 1)].dateStr;
        const subChaps = sortChaptersByICAIYield(
          chapterInputs.filter(c => c.subjectId === subId && !c.isSkipped && (c.expectedMinutesByPhase[phaseId] || 0) > 0)
        );
        if (subChaps.length === 0) return;

        const milestoneId = `cp_auto_${phaseId}_${subId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        let lastDate = subStartStr;
        let totalMins = 0;

        subChaps.forEach(ch => {
          const mins = ch.expectedMinutesByPhase[phaseId] || 60;
          totalMins += mins;
          lastDate = allocateChapterTask(ch, phaseId, mins, milestoneId);
        });

        newCheckpoints.push({
          id: milestoneId,
          subjectId: subId,
          customTitle: `${subId} • ${phaseMeta.shortLabel}`,
          phaseId,
          revisionCycle: phaseMeta.revisionCycleLabel,
          startDate: subStartStr,
          targetDate: lastDate,
          targetChapters: subChaps.length,
          selectedChapters: subChaps.map(c => c.chapterName),
          completedChapters: [],
          allocatedHoursTotal: Number((totalMins / 60).toFixed(1)),
          completionCondition: config.defaultCompletionCondition,
          mockTestCompleted: false,
          notes: `ICAI Weightage & ABC Calibrated (${(totalMins / 60).toFixed(1)}h allocated)`
        });
      });
    }

    // Schedule Mock Test Papers at the end of this phase if configured
    const mocksForThisPhase =
      phaseIdx === phases.length - 1
        ? Math.max(0, config.plannedMocksCount - mocksScheduledSoFar)
        : mocksPerPhase;

    for (let m = 0; m < mocksForThisPhase; m++) {
      mocksScheduledSoFar++;
      const mockSub = orderedSubjects[(mocksScheduledSoFar - 1) % orderedSubjects.length] || getDefaultSubjectForLevel(getSelectedCALevel());
      const targetIdx = Math.min(dayCursor, calendarDays.length - 1);
      const mockDate = calendarDays[targetIdx].dateStr;
      calendarDays[targetIdx].remainingMins = Math.max(0, calendarDays[targetIdx].remainingMins - 180);
      advanceCursorIfDepleted();

      const mockTitle = `ICAI Mock Test Paper #${mocksScheduledSoFar} (${mockSub} - 100 Marks)`;
      newCheckpoints.push({
        id: `cp_auto_mock_${mocksScheduledSoFar}_${Date.now()}`,
        subjectId: mockSub,
        customTitle: mockTitle,
        phaseId: 'mock',
        revisionCycle: 'Mock Exam',
        startDate: mockDate,
        targetDate: mockDate,
        targetChapters: getSubjectChaptersForPlanner(mockSub).length,
        selectedChapters: getSubjectChaptersForPlanner(mockSub),
        completedChapters: [],
        allocatedHoursTotal: 3,
        completionCondition: 'mock_test_required',
        mockTestCompleted: false,
        mockMaxMarks: 100,
        notes: `3-Hour Exam Condition Mock Test Paper #${mocksScheduledSoFar}`
      });

      generatedTasks.push({
        id: `auto_mock_task_${mocksScheduledSoFar}_${Date.now()}`,
        title: `[${mockSub}] ${mockTitle}`,
        cleanTitle: mockTitle,
        chapterName: getSubjectChaptersForPlanner(mockSub)[0] || 'Full Syllabus Mock Test',
        subjectCode: mockSub,
        due: mockDate,
        taskDate: mockDate,
        status: 'needsAction',
        priority: 'High',
        relevance: 'Final Revision',
        targetDurationMinutes: 180,
        duration: 180,
        activityType: 'mock',
        notes: `IS_MOCK_TEST: true\nRelevance: Final Revision\nSubject: ${mockSub}\nTargetDurationMinutes: 180`
      });
    }
  });

  // Merge tasks & checkpoints:
  // If amending from a specific date, preserve completed tasks and checkpoints prior to startStr
  const preservedCheckpoints = options?.preserveCompletedBeforeStart
    ? existingCheckpoints.filter(cp => cp.targetDate < startStr || (cp.phaseId && !phases.includes(cp.phaseId as StudyPhaseId) && cp.phaseId !== 'mock'))
    : [];

  const preservedTasks = existingTasks.filter(t => {
    const tDate = t.taskDate || (t.due ? t.due.split('T')[0] : '');
    const isAutoTask = t.id.startsWith('auto_task_') || t.id.startsWith('auto_mock_task_');
    if (options?.preserveCompletedBeforeStart) {
      if (t.status === 'completed' || Boolean(t.completed)) return true;
      if (tDate && tDate < startStr) return true;
      return !isAutoTask;
    }
    return !isAutoTask;
  });

  return {
    checkpoints: [...preservedCheckpoints, ...newCheckpoints].sort((a, b) => a.targetDate.localeCompare(b.targetDate)),
    generatedTasks,
    mergedTasks: [...preservedTasks, ...generatedTasks]
  };
}
