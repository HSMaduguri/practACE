/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CMA_FOUNDATION_SUBJECT_IDS,
  CMA_INTERMEDIATE_SUBJECT_IDS,
  CMA_FINAL_SUBJECT_IDS,
} from '../types.ts';
import type {
  CMASubjectId,
  SubjectInfo,
  ChapterSummary,
  FormulaItem,
  StatutorySection,
  LimitRateItem,
  QuizQuestionItem,
  GeneralQuestion,
} from '../types.ts';
import { CA_CURRICULUM_LEVELS } from './curriculumLevels.ts';
import type { CALevel } from './curriculumLevels.ts';

const ALL_CMA_LEVELS: CALevel[] = ['cma_foundation', 'cma_intermediate', 'cma_final'];
export const ALL_CMA_SUBJECT_IDS: CMASubjectId[] = [
  ...CMA_FOUNDATION_SUBJECT_IDS,
  ...CMA_INTERMEDIATE_SUBJECT_IDS,
  ...CMA_FINAL_SUBJECT_IDS,
];

const TAX_LAW_SUBJECTS = new Set<CMASubjectId>([
  'CMAFoundLaw',
  'CMAInterLaw',
  'CMAInterTax',
  'CMAInterCAA',
  'CMAFinalLaw',
  'CMAFinalDT',
  'CMAFinalCMA',
  'CMAFinalIDT',
]);

const FORMULA_SUBJECTS = new Set<CMASubjectId>([
  'CMAFoundAcc',
  'CMAFoundMath',
  'CMAFoundEcon',
  'CMAInterFA',
  'CMAInterCost',
  'CMAInterOMSM',
  'CMAInterFMDA',
  'CMAInterMA',
  'CMAFinalSFM',
  'CMAFinalSCM',
  'CMAFinalCFR',
  'CMAFinalSPBV',
]);

export const CMA_SUBJECTS_METADATA: Record<CMASubjectId, SubjectInfo> = (() => {
  const map = {} as Record<CMASubjectId, SubjectInfo>;
  for (const lvl of ALL_CMA_LEVELS) {
    const levelInfo = CA_CURRICULUM_LEVELS[lvl];
    for (const spec of levelInfo.subjects) {
      const subId = spec.code as CMASubjectId;
      map[subId] = {
        id: subId,
        name: spec.name,
        fullName: spec.fullName,
        chapters: [...spec.chapters],
        hasSections: TAX_LAW_SUBJECTS.has(subId),
        hasLimits: TAX_LAW_SUBJECTS.has(subId),
        hasFormulas: FORMULA_SUBJECTS.has(subId),
        group: spec.group,
        paperNumber: spec.paperNumber,
        level: lvl,
      };
    }
  }
  return map;
})();

export const CMA_CHAPTERS_MAP: Record<CMASubjectId, string[]> = (() => {
  const map = {} as Record<CMASubjectId, string[]>;
  for (const subId of ALL_CMA_SUBJECT_IDS) {
    map[subId] = CMA_SUBJECTS_METADATA[subId]?.chapters || [];
  }
  return map;
})();

export const CMA_CHAPTER_SUMMARIES: Record<CMASubjectId, ChapterSummary[]> = (() => {
  const map = {} as Record<CMASubjectId, ChapterSummary[]>;
  for (const subId of ALL_CMA_SUBJECT_IDS) {
    const meta = CMA_SUBJECTS_METADATA[subId];
    map[subId] = (meta?.chapters || []).map((chapterName, idx) => ({
      chapterName,
      keyPrinciples: [
        {
          title: `Core ICMAI Syllabus 2022 Framework — Module ${idx + 1}`,
          description: `Covers statutory provisions, Cost Accounting Standards (CAS 1–24) / Ind AS / GACAP principles, and analytical evaluation methodology prescribed under ${meta.paperNumber} (${meta.name}).`,
          exception: 'Subject to specific statutory thresholds, notifications, and Cost Audit / Tax exemptions notified for the applicable examination term.',
          example: `Apply structured working notes, CAS/Ind AS citations, and step-wise computation tables for ${chapterName}.`,
        },
        {
          title: 'Examination Weightage & High-Yield Application',
          description: 'Emphasizes objective conceptual precision in Section A and analytical case-study / numerical problem-solving in Section B of the ICMAI examination pattern.',
          exception: 'Ensure strict reconciliation between cost records (CRA-1) and financial books where applicable.',
          example: 'Present statutory provision / formula first, followed by working table and concluding decision.',
        },
      ],
      visualBreakdown: {
        title: `${meta.paperNumber}: ${chapterName} — Revision Matrix`,
        type: 'table',
        headers: ['Pillar', 'Governing Standard / Provision', 'Key Analytical Trigger', 'Exam Requirement'],
        rows: [
          ['Conceptual Core', `${meta.paperNumber} (${meta.name})`, chapterName, 'Cite authoritative CAS / Ind AS / Statutory Section'],
          ['Numerical / Case Workings', 'ICMAI Syllabus 2022', 'Step-wise tabular computation & variance/tax analysis', 'Show explicit working notes & concluding recommendation'],
        ],
      },
    }));
  }
  return map;
})();

export const CMA_FORM_ITEMS: Record<CMASubjectId, FormulaItem[]> = (() => {
  const map = {} as Record<CMASubjectId, FormulaItem[]>;
  for (const subId of ALL_CMA_SUBJECT_IDS) {
    const meta = CMA_SUBJECTS_METADATA[subId];
    const firstChapter = meta?.chapters?.[0] || 'Core Module';
    if (FORMULA_SUBJECTS.has(subId)) {
      map[subId] = [
        {
          chapterName: firstChapter,
          formulaName: `${meta.name} — Core Analytical Efficiency & Cost-Volume-Value Equation`,
          equation: 'Contribution = Sales − Variable Cost  |  P/V Ratio = (Contribution / Sales) × 100',
          context: `Fundamental quantitative decision metric applied across ${meta.fullName}.`,
          variables: [
            { name: 'Contribution', desc: 'Surplus of revenue over variable cost available to recover fixed costs and generate profit' },
            { name: 'P/V Ratio', desc: 'Profit-Volume ratio measuring rate of contribution per unit of sales turnover' },
          ],
          workedExample: {
            scenario: 'Sales = ₹50,00,000; Variable Cost = ₹30,00,000; Fixed Cost = ₹12,00,000.',
            calculation: 'Contribution = ₹50L − ₹30L = ₹20,00,000\nP/V Ratio = (20L / 50L) × 100 = 40%\nBEP (Sales) = ₹12,00,000 / 40% = ₹30,00,000',
            output: 'P/V Ratio = 40% · BEP = ₹30,00,000',
          },
        },
      ];
    } else {
      map[subId] = [];
    }
  }
  return map;
})();

export const CMA_STATUTORY_SECTIONS: Partial<Record<CMASubjectId, StatutorySection[]>> = {
  CMAFoundLaw: [
    {
      number: 'Sec 10 (ICA)',
      heading: 'What agreements are contracts',
      purpose: 'Defines essential elements of a valid contract: free consent, competency of parties, lawful consideration, and lawful object.',
      subsections: [
        { number: 'Sec 10(1)', heading: 'Essential validity conditions', purpose: 'All agreements are contracts if made by free consent of parties competent to contract, for a lawful consideration and with a lawful object.' },
      ],
    },
  ],
  CMAInterLaw: [
    {
      number: 'Sec 148 (Co. Act)',
      heading: 'Central Government to specify audit of items of cost in respect of certain companies',
      purpose: 'Empowers Central Government to mandate maintenance of cost records (CRA-1) and Cost Audit (CRA-2/CRA-3/CRA-4) conducted by a practicing Cost Accountant.',
      subsections: [
        { number: 'Sec 148(1)', heading: 'Maintenance of Cost Records (Form CRA-1)', purpose: 'Mandates specified class of companies engaged in production of goods or provision of services to maintain cost records.' },
        { number: 'Sec 148(2)-(3)', heading: 'Cost Audit by Cost Accountant in Practice', purpose: 'Audit of cost records shall be conducted by a Cost Accountant appointed by the Board on remuneration determined by members.' },
      ],
    },
  ],
  CMAFinalCMA: [
    {
      number: 'Rule 3 & 4 (CCRA 2014)',
      heading: 'Companies (Cost Records and Audit) Rules, 2014 — Thresholds',
      purpose: 'Prescribes turnover thresholds for Regulated (Table A) and Non-Regulated (Table B) sectors for Cost Records (≥ ₹35 Cr) and Cost Audit.',
      subsections: [
        { number: 'Rule 3', heading: 'Cost Records Applicability (≥ ₹35 Crore)', purpose: 'Applicable if aggregate turnover from all products and services during immediately preceding FY is ₹35 Crore or more.' },
        { number: 'Rule 4(1)', heading: 'Regulated Sectors Cost Audit', purpose: 'Overall turnover ≥ ₹50 Crore AND aggregate turnover of individual product/service for which cost records are required ≥ ₹25 Crore.' },
        { number: 'Rule 4(2)', heading: 'Non-Regulated Sectors Cost Audit', purpose: 'Overall turnover ≥ ₹100 Crore AND aggregate turnover of individual product/service for which cost records are required ≥ ₹35 Crore.' },
      ],
    },
  ],
};

export const CMA_LIMITS_RATES: Partial<Record<CMASubjectId, LimitRateItem[]>> = {
  CMAFinalCMA: [
    { item: 'Cost Records Applicability (Rule 3 CCRA 2014)', limitRate: 'Overall Turnover ≥ ₹35 Crore', remarks: 'Applies to both Regulated (Table A) and Non-Regulated (Table B) sectors based on preceding FY turnover.' },
    { item: 'Cost Audit — Regulated Sector (Rule 4(1) CCRA 2014)', limitRate: 'Overall ≥ ₹50 Cr & Product ≥ ₹25 Cr', remarks: 'Both overall turnover and covered product/service turnover thresholds must be met.' },
    { item: 'Cost Audit — Non-Regulated Sector (Rule 4(2) CCRA 2014)', limitRate: 'Overall ≥ ₹100 Cr & Product ≥ ₹35 Cr', remarks: 'Exempt if export revenue in forex > 75% of total revenue or operating from SEZ.' },
    { item: 'Cost Auditor Appointment Timeline (Rule 6(1))', limitRate: 'Within 180 Days of FY commencement', remarks: 'Intimate Central Government in Form CRA-2 within 30 days of Board meeting or 180 days of FY start, whichever is earlier.' },
  ],
};

export const CMA_QUIZ_QUESTIONS: Record<CMASubjectId, QuizQuestionItem[]> = (() => {
  const map = {} as Record<CMASubjectId, QuizQuestionItem[]>;
  for (const subId of ALL_CMA_SUBJECT_IDS) {
    const meta = CMA_SUBJECTS_METADATA[subId];
    const firstChapter = meta?.chapters?.[0] || 'Core Module';
    map[subId] = [
      {
        type: 'general',
        data: {
          id: `${subId}_Q_01`,
          subjectId: subId,
          chapterName: firstChapter,
          questionText: `Under ICMAI Syllabus 2022 for ${meta.fullName}, which of the following best represents the primary statutory/analytical compliance requirement in "${firstChapter}"?`,
          options: [
            'Adherence to prescribed Cost Accounting Standards (CAS 1–24), Ind AS / AS, and statutory provisions with structured working notes',
            'Informal estimation without documentary trail or reconciliation',
            'Selective application of principles only to profitable product lines',
            'Exemption from disclosure of material assumptions and variances',
          ],
          correctOptionIndex: 0,
          explanation: `For ${meta.fullName} (${meta.paperNumber}), ICMAI Syllabus 2022 mandates strict compliance with applicable Cost Accounting Standards (CAS), Financial Reporting Standards (AS/Ind AS), and statutory rules with transparent working notes.`,
        } as GeneralQuestion,
      },
    ];
  }
  return map;
})();
