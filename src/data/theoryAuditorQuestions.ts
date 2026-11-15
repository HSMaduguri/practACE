/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * READY-MADE CA FINAL THEORY & CASE SCENARIO QUESTIONS FOR THEORY AUDITOR
 * Curated high-yield statutory questions with model solutions, target coordinates, and evaluation criteria.
 */

import { SubjectId } from '../types';
import { AUDIT_PDF_THEORY_QUESTIONS } from './auditPdfTheoryQuestions';
import { THEORY_QUESTIONS_CH9_10 } from './auditTheoryQuestionsCh9_10';
import { THEORY_QUESTIONS_CH12_18 } from './auditTheoryQuestionsCh12_18';
import { AUDIT_REPORT_THEORY_QUESTIONS } from './auditReportTheoryQuestions';
import { AUDIT_ETHICS_THEORY_QUESTIONS } from './auditEthicsTheoryQuestions';
import { AUDIT_SPECIALIZED_THEORY_QUESTIONS } from './auditSpecializedTheoryQuestions';
import { AUDIT_STANDARDS_RISK_THEORY_QUESTIONS } from './auditStandardsRiskTheoryQuestions';
import { AUDIT_STANDARDS_FULL_QUESTIONS } from './auditStandardsFullQuestions';
import { AUDIT_SPECIALIZED_FULL_QUESTIONS } from './auditSpecializedFullQuestions';
import { AUDIT_ETHICS_FULL_QUESTIONS } from './auditEthicsFullQuestions';
import { FOUNDATION_INTER_THEORY_QUESTIONS } from './foundationAndInterPracticeData';

export interface KeyConcept {
  keyword: string;
  category: "Section" | "Schedule" | "Rule" | "Provision" | "Keyword" | "Standard";
  description: string;
}

export interface TheoryQuestion {
  id: string;
  subjectId: SubjectId;
  chapterName: string;
  title: string;
  difficulty: 'Moderate' | 'Advanced' | 'Mastery';
  marks: number;
  icaiExamRef?: string;
  question: string;
  keyConcepts: KeyConcept[];
  shortSuggestedAnswer: string;
  defaultRemarks: {
    efficiencyReasoning: string;
    criticalMisses: string[];
    suggestions: string[];
  };
}

export interface MatchedConcept {
  keyword: string;
  category: string;
  matched: boolean;
  comment: string;
}

export interface EvaluationResult {
  efficiencyScore: number;
  matchedConcepts: MatchedConcept[];
  efficiencyReasoning: string;
  criticalMisses: string[];
  suggestions: string[];
}

const BASE_THEORY_QUESTIONS: TheoryQuestion[] = [
  // =========================================================================
  // AUDITING - CHAPTER 1: QUALITY CONTROL (SQC 1, SA 220)
  // =========================================================================
  {
    id: 'aud_th_01',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    title: 'Engagement Quality Control Review & Working Paper Retention (SQC 1 / SA 220)',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / RTP Nov 2024',
    question: `A prominent CA firm was appointed as statutory auditor of a listed entity. During the audit, the engagement partner issued the audit report on March 31, 2026, without waiting for the completion of the Engagement Quality Control Review (EQCR). The partner contended that since the draft report had already been discussed with TCWG, EQCR was merely a procedural formality that could be completed after report issuance. Furthermore, the firm has a documented policy to retain working paper documentation for a period of 5 years from the date of the audit report.

Evaluate whether the engagement partner's contention and the firm's documentation retention policy comply with SQC 1 and SA 220.`,
    keyConcepts: [
      { keyword: 'SQC 1', category: 'Standard', description: 'Standard on Quality Control 1 for firms performing audits and reviews.' },
      { keyword: 'SA 220', category: 'Standard', description: 'Quality Control for an Audit of Financial Statements.' },
      { keyword: 'EQCR completion prior to report dating', category: 'Provision', description: 'Mandate that the audit report shall not be dated until the completion of the engagement quality control review.' },
      { keyword: 'Listed entities mandatory EQCR', category: 'Provision', description: 'Mandatory requirement of EQCR for all audits of financial statements of listed entities.' },
      { keyword: '7 years retention period', category: 'Rule', description: 'SQC 1 mandate that assembly of audit files must be within 60 days and retention period must not be shorter than 7 years.' }
    ],
    shortSuggestedAnswer: `1. Engagement Quality Control Review (EQCR) Timing:
- Under SQC 1 and SA 220, for audits of listed entities, an Engagement Quality Control Review is mandatory.
- The engagement partner shall NOT date or issue the auditor's report until the completion of the EQCR.
- Discussion with TCWG does not waive this requirement. Therefore, issuing the audit report prior to EQCR completion constitutes a direct professional violation of SQC 1 and SA 220.

2. Audit Documentation Retention Period:
- SQC 1 mandates that the retention period for audit engagements ordinarily is not shorter than 7 years from the date of the auditor's report (or group auditor's report).
- The firm's policy of retaining documentation for only 5 years violates SQC 1.
- Furthermore, under SQC 1, audit file assembly must be completed within 60 days of the report date.`,
    defaultRemarks: {
      efficiencyReasoning: "The candidate's response has been evaluated on whether SQC 1 / SA 220 mandates regarding pre-report EQCR completion and the statutory 7-year documentation retention threshold were identified.",
      criticalMisses: [
        "Explicit citation of SQC 1 / SA 220 pre-report signoff requirement.",
        "Statutory 7-year minimum documentation retention period (violating the 5-year firm policy)."
      ],
      suggestions: [
        "Always cite SQC 1 alongside SA 220 when addressing firm-level quality control policies.",
        "Mention the 60-day audit file assembly deadline under SQC 1 for completeness."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 2: GENERAL PRINCIPLES & AUDITOR'S RESPONSIBILITIES
  // =========================================================================
  {
    id: 'aud_th_02',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    title: 'Statutory Reporting of Fraud under Section 143(12) & Form ADT-4 vs CARO 2020',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Past Exam May 2023 / MTP M24',
    question: `During the course of the statutory audit of Bharat Infra Ltd., the auditor discovered an invoice inflation fraud amounting to ₹1.25 Crores committed by senior management officers. The management pleaded that since the entire amount was recovered subsequent to year-end and recorded properly in the books, no reporting is required under the Companies Act, 2013 or CARO 2020.

Examine the statutory duties and procedural timelines of the auditor under Section 143(12) of the Companies Act, 2013, Rule 13 of Companies (Audit and Auditors) Rules, 2014, and Clause 3(xi) of CARO 2020.`,
    keyConcepts: [
      { keyword: 'Section 143(12)', category: 'Section', description: 'Mandatory reporting of fraud involving ₹1 Crore or more to Central Government.' },
      { keyword: 'Rule 13 of CAAR 2014', category: 'Rule', description: 'Procedural steps and timelines for reporting fraud to Board/Audit Committee and Central Government.' },
      { keyword: '₹1 Crore Threshold', category: 'Provision', description: 'Monetary threshold triggering Central Government reporting.' },
      { keyword: 'Form ADT-4', category: 'Provision', description: 'Prescribed form for reporting fraud to Ministry of Corporate Affairs / Central Government.' },
      { keyword: '45 Days / 15 Days Timelines', category: 'Rule', description: 'Report to Board/Audit Committee within 2 days seeking reply in 45 days; forward to CG within 15 days.' },
      { keyword: 'Clause 3(xi) of CARO 2020', category: 'Provision', description: 'Reporting of fraud by or on the company, Form ADT-4 filing, and whistle-blower complaints.' }
    ],
    shortSuggestedAnswer: `1. Duty under Section 143(12) & Rule 13:
- The fraud amount is ₹1.25 Crores, which meets the statutory threshold of ₹1 Crore or more.
- Subsequent recovery of the defrauded amount does NOT exonerate the auditor from statutory reporting under Section 143(12).
- Procedural Steps & Timelines:
  a. Report to Board / Audit Committee within 2 days of knowledge, seeking reply within 45 days.
  b. On receipt of reply (or on expiry of 45 days if no reply), forward report in Form ADT-4 to the Central Government (MCA) within 15 days.

2. Reporting under CARO 2020 Clause 3(xi):
- Clause 3(xi)(a): Report whether any fraud by the company or any fraud on the company has been noticed or reported during the year, nature and amount involved.
- Clause 3(xi)(b): Report whether Form ADT-4 has been filed by the auditors with the Central Government.
- Clause 3(xi)(c): Report whether whistle-blower complaints were considered.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluation focuses on whether the student applied the ₹1 Crore threshold under Section 143(12), the Form ADT-4 submission procedure, and the multi-subclause reporting under CARO 2020 Clause 3(xi).",
      criticalMisses: [
        "Mention of Form ADT-4 to Central Government within 15 days.",
        "Clarification that subsequent recovery does not eliminate reporting liability under Section 143(12)."
      ],
      suggestions: [
        "Always break down Rule 13 into the 2-day notice, 45-day response window, and 15-day forwarding deadline.",
        "Cite Clause 3(xi)(a) and (b) of CARO 2020 explicitly."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 3: AUDIT PLANNING, STRATEGY AND EXECUTION
  // =========================================================================
  {
    id: 'aud_th_03',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    title: 'Audit Strategy vs Audit Plan & SA 540 Accounting Estimates Uncertainty',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / SA 300 & SA 540',
    question: `State the key differences between the Overall Audit Strategy and the Detailed Audit Plan under SA 300. Explain how the auditor should evaluate High Estimation Uncertainty and indicators of possible Management Bias when auditing fair value estimates under SA 540 (Revised).`,
    keyConcepts: [
      { keyword: 'SA 300', category: 'Standard', description: 'Planning an Audit of Financial Statements.' },
      { keyword: 'Overall Audit Strategy', category: 'Provision', description: 'Sets the scope, timing, and direction of the audit and guides development of audit plan.' },
      { keyword: 'Detailed Audit Plan', category: 'Provision', description: 'Operationalizes strategy: NTE of Risk Assessment Procedures and Further Audit Procedures.' },
      { keyword: 'SA 540 (Revised)', category: 'Standard', description: 'Auditing Accounting Estimates and Related Disclosures.' },
      { keyword: 'Estimation Uncertainty', category: 'Keyword', description: 'Susceptibility of an accounting estimate to an inherent lack of precision in its measurement.' },
      { keyword: 'Management Bias Indicators', category: 'Keyword', description: 'Subjective assumptions, changes in methods without economic justification.' }
    ],
    shortSuggestedAnswer: `1. Overall Audit Strategy vs Detailed Audit Plan (SA 300):
- Overall Audit Strategy sets the scope, timing, and direction of the audit, determining resource allocation (e.g. specialized skills, team experience, timing of reviews).
- Detailed Audit Plan is more operational and includes the nature, timing, and extent (NTE) of:
  a. Risk Assessment Procedures (SA 315).
  b. Further Audit Procedures at the assertion level (SA 330: Tests of Controls & Substantive Procedures).
  c. Other planned procedures required to comply with SAs.
- Strategy and Plan are interdependent and iteratively updated throughout the engagement.

2. SA 540 (Revised) Estimation Uncertainty & Management Bias:
- High Estimation Uncertainty: Estimates subject to high uncertainty (unquoted complex derivatives, warranty provisions) give rise to Significant Risks. The auditor must test control design, evaluate data/assumptions, or develop an independent point estimate/range.
- Management Bias Indicators: The auditor evaluates whether management selectively chose assumptions to hit financial targets, altered valuation methodologies without justification, or selected optimistic estimates.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on distinction between scope/timing/direction (Strategy) vs NTE of RAP/FAP (Plan), and SA 540 audit responses to estimation uncertainty and bias.",
      criticalMisses: [
        "NTE of Risk Assessment Procedures & Further Audit Procedures in the Audit Plan.",
        "Connecting high estimation uncertainty with significant risks under SA 540."
      ],
      suggestions: [
        "Highlight that planning is a continuous and iterative process under SA 300.",
        "Specify the 3 approaches under SA 540 (test management process, develop point estimate/range, review subsequent events)."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 4: RISK ASSESSMENT & INTERNAL CONTROL
  // =========================================================================
  {
    id: 'aud_th_04',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    title: 'Significant Risks under SA 315 & Performance Materiality under SA 320',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI RTP May 2024 / Past Exam',
    question: `Define 'Significant Risk' under SA 315 (Revised) and discuss the factors the auditor must consider in identifying significant risks. Furthermore, explain the concept of 'Performance Materiality' under SA 320 and why it is always set lower than Financial Statement Materiality.`,
    keyConcepts: [
      { keyword: 'SA 315 (Revised)', category: 'Standard', description: 'Identifying and Assessing the Risks of Material Misstatement.' },
      { keyword: 'Significant Risk', category: 'Provision', description: 'An identified and assessed risk of material misstatement that requires special audit consideration.' },
      { keyword: 'Exclusion of identified controls', category: 'Keyword', description: 'Auditor excludes effects of controls when determining if a risk is significant.' },
      { keyword: 'SA 320', category: 'Standard', description: 'Materiality in Planning and Performing an Audit.' },
      { keyword: 'Performance Materiality', category: 'Provision', description: 'Amount set below overall materiality to reduce probability of undetected misstatements exceeding overall materiality.' },
      { keyword: 'Aggregation Risk', category: 'Keyword', description: 'The risk that the aggregate of uncorrected and undetected misstatements exceeds materiality for the FS as a whole.' }
    ],
    shortSuggestedAnswer: `1. Significant Risk under SA 315 (Revised):
- Definition: An identified and assessed risk of material misstatement that, in the auditor's judgment, requires special audit consideration.
- In determining whether a risk is significant, the auditor excludes the effect of identified controls.
- Indicative Factors:
  a. Risk of fraud (presumed in revenue recognition under SA 240).
  b. Significant economic, accounting, or regulatory developments.
  c. Complexity of transactions and high subjectivity.
  d. Significant transactions with related parties outside normal course of business.
  e. Unusual transactions outside normal business operations.

2. Performance Materiality under SA 320:
- Definition: The amount set by the auditor at less than materiality for the financial statements as a whole to reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds materiality for the financial statements as a whole.
- Purpose: Addresses "aggregation risk". Individual misstatements below overall materiality could cumulatively exceed it. Setting performance materiality creates a buffer.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on the exact definitions of Significant Risk and Performance Materiality, the exclusion of controls criterion, and the explanation of aggregation risk.",
      criticalMisses: [
        "The rule that identified controls are excluded when assessing significant risk.",
        "The aggregation risk explanation for performance materiality."
      ],
      suggestions: [
        "Remember that significant risks mandate testing of controls in the current year if the auditor plans to rely on them.",
        "Link performance materiality directly to the buffer against undetected misstatements."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 5: AUDIT EVIDENCE
  // =========================================================================
  {
    id: 'aud_th_05',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    title: 'External Confirmations (SA 505) - Management Refusal & Going Concern (SA 570)',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI RTP Nov 2023 / Past Exam',
    question: `During the statutory audit of Zen Automobiles Ltd., the auditor sought to send external confirmation requests to major trade debtors under SA 505. Management strictly refused to permit the auditor to send confirmations, claiming that customers were sensitive and might cancel ongoing contracts. 

In addition, the company has suffered continuous operating losses and negative operating cash flows, but has secured a letter of support from its parent company. 

State:
(a) The auditor's procedure and reporting implications regarding management's refusal under SA 505.
(b) The auditor's evaluation of the Letter of Support and reporting duties under SA 570 (Revised) if material uncertainty exists.`,
    keyConcepts: [
      { keyword: 'SA 505', category: 'Standard', description: 'External Confirmations.' },
      { keyword: 'Management Refusal Response', category: 'Provision', description: 'Inquire reasons, seek evidence of validity, assess fraud risk, perform alternative procedures.' },
      { keyword: 'Alternative Audit Procedures', category: 'Keyword', description: 'Examine subsequent cash receipts, shipping docs, sales contracts.' },
      { keyword: 'Scope Limitation u/s SA 705', category: 'Standard', description: 'Qualified or Disclaimer of Opinion if refusal is unreasonable and alternative evidence unavailable.' },
      { keyword: 'SA 570 (Revised)', category: 'Standard', description: 'Going Concern.' },
      { keyword: 'Letter of Support Evaluation', category: 'Keyword', description: 'Evaluate legal enforceability and parent entity financial capacity to fulfill support.' },
      { keyword: 'MURGC Section', category: 'Provision', description: 'Separate Material Uncertainty Related to Going Concern section in audit report.' }
    ],
    shortSuggestedAnswer: `Part (a) - Management Refusal under SA 505:
1. Inquire into reasons for refusal and seek audit evidence as to validity and reasonableness.
2. Evaluate implications of refusal on auditor's assessment of relevant RMM, including fraud risk, and on NTE of other procedures.
3. Perform alternative audit procedures (e.g. examining subsequent collections, dispatch notes, sales orders).
4. If refusal is unreasonable OR auditor cannot obtain evidence via alternative procedures:
   - Communicate with TCWG under SA 260.
   - Determine implications for audit opinion: issue Qualified Opinion or Disclaimer of Opinion under SA 705 due to limitation on scope.

Part (b) - Going Concern Evaluation under SA 570:
1. Letter of Support from Parent: Auditor must assess:
   - Financial capacity of parent to fulfill obligations (review parent FS, credit rating).
   - Legal enforceability of the commitment (intent alone is insufficient).
2. Reporting Implications:
   - If material uncertainty exists but is adequately disclosed: Issue Unmodified Opinion with a separate section headed "Material Uncertainty Related to Going Concern" (MURGC). (Not a KAM).
   - If disclosure is inadequate: Issue Qualified or Adverse Opinion under SA 705.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on the sequential 4-step protocol under SA 505 for management refusal and the SA 570 dual tests for letters of support plus the MURGC reporting mechanism.",
      criticalMisses: [
        "Testing parent company financial capability and legal enforceability of support letter.",
        "Unmodified opinion + separate MURGC section when uncertainty is adequately disclosed."
      ],
      suggestions: [
        "Always clarify that MURGC is distinct from Key Audit Matters (KAM) under SA 701.",
        "Mention that subsequent cash receipts constitute primary alternative evidence for trade receivables."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 7: REPORTING
  // =========================================================================
  {
    id: 'aud_th_07',
    subjectId: 'Audit',
    chapterName: 'Reporting',
    title: 'Key Audit Matters (SA 701) vs Emphasis of Matter (SA 706) vs Modified Opinions (SA 705)',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / RTP Nov 2024',
    question: `Differentiate between Key Audit Matters (KAM) under SA 701 and Emphasis of Matter (EOM) paragraphs under SA 706. In what circumstances can a matter that is significant to the audit NOT be reported as a Key Audit Matter?`,
    keyConcepts: [
      { keyword: 'SA 701', category: 'Standard', description: 'Communicating Key Audit Matters in the Independent Auditor\'s Report.' },
      { keyword: 'SA 706', category: 'Standard', description: 'Emphasis of Matter Paragraphs and Other Matter Paragraphs.' },
      { keyword: 'Matter communicated with TCWG', category: 'Keyword', description: 'KAM is selected from matters communicated with Those Charged with Governance.' },
      { keyword: 'Auditor\'s Professional Judgment', category: 'Keyword', description: 'Matters of most significance in the audit of financial statements of the current period.' },
      { keyword: 'EOM Fundamental to User Understanding', category: 'Provision', description: 'EOM draws attention to matter presented/disclosed in FS fundamental to user understanding.' },
      { keyword: 'Prohibition from KAM', category: 'Provision', description: 'Matter leading to modified opinion (SA 705) or MURGC (SA 570) reported in respective sections, not KAM; or public interest adverse consequences.' }
    ],
    shortSuggestedAnswer: `1. Distinction between SA 701 (KAM) and SA 706 (EOM):
- Origin & Scope:
  - KAM (SA 701): Selected from matters communicated with TCWG; those of "most significance" in the audit of the current period. Applies mandatorily to listed entities.
  - EOM (SA 706): Draws attention to a matter properly presented or disclosed in the FS that is "fundamental to users' understanding" of the FS (e.g. exceptional litigation outcome, early adoption of a new accounting standard).
- Relationship: A matter determined to be a KAM cannot be presented as an EOM paragraph.

2. Circumstances when a significant matter is NOT reported as KAM:
- Law or regulation precludes public disclosure about the matter.
- In extremely rare circumstances, the auditor determines that the adverse consequences of communicating would reasonably be expected to outweigh public interest benefits.
- Matters giving rise to a Modified Opinion (SA 705) or Material Uncertainty Related to Going Concern (SA 570) are reported in their own dedicated sections and are NOT included in the KAM section.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on clear demarcation between KAM (most significance to audit) and EOM (fundamental to user understanding), and exclusion rules (modified opinions, MURGC, adverse consequence test).",
      criticalMisses: [
        "Matters resulting in SA 705 modifications or SA 570 MURGC cannot be reported in KAM.",
        "Adverse consequences outweighing public interest exception."
      ],
      suggestions: [
        "State explicitly that KAM is mandatory for listed entities.",
        "Emphasize that EOM applies only to matters already properly presented or disclosed in the FS."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 8: SPECIALISED AREAS (CARO 2020)
  // =========================================================================
  {
    id: 'aud_th_08',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    title: 'CARO 2020 - Title Deeds (Clause 3(i)), Working Capital Reconciliation (Clause 3(ii)), and Solvency (Clause 3(xix))',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Past Exam Nov 2023 / CARO 2020 Master Guide',
    question: `Explain the reporting requirements of the statutory auditor under the following clauses of CARO 2020:
(a) Clause 3(i)(c) - Immovable properties where title deeds are not held in the name of the company.
(b) Clause 3(ii)(b) - Sanction of working capital limits exceeding ₹5 Crores and quarterly return reconciliation.
(c) Clause 3(xix) - Financial ratios, ageing and realization of financial assets, and capability to meet liabilities falling due within one year.`,
    keyConcepts: [
      { keyword: 'Clause 3(i)(c) of CARO 2020', category: 'Rule', description: 'Reporting details of title deeds of immovable properties not held in company name in tabular format.' },
      { keyword: 'Clause 3(ii)(b) of CARO 2020', category: 'Rule', description: 'Working capital limits > ₹5 Crores against security of current assets; quarterly returns reconciliation with books.' },
      { keyword: '₹5 Crores Working Capital Limit', category: 'Provision', description: 'Monetary threshold for working capital quarterly return reporting.' },
      { keyword: 'Clause 3(xix) of CARO 2020', category: 'Rule', description: 'Material uncertainty regarding capability of company to meet liabilities existing at balance sheet date falling due within 1 year.' },
      { keyword: '1 Year Solvency Horizon', category: 'Provision', description: 'Assessment horizon of 1 year from balance sheet date.' }
    ],
    shortSuggestedAnswer: `(a) CARO Clause 3(i)(c) - Title Deeds of Immovable Property:
- Auditor must report whether the title deeds of all immovable properties (other than properties where company is lessee and lease agreements are duly executed) disclosed in FS are held in company name.
- If not, provide details in specified tabular format: Description of property, Gross carrying value, Held in name of, Whether promoter/director/relative/employee, Period held, Reason for not being held in name (e.g. dispute).

(b) CARO Clause 3(ii)(b) - Working Capital Limits > ₹5 Crores:
- Applies if company has been sanctioned working capital limits in excess of ₹5 Crores, in aggregate, from banks or financial institutions on the basis of security of current assets.
- Auditor must report whether quarterly returns or statements filed by company with banks/FIs are in agreement with the books of account. If not, give details of material discrepancies.

(c) CARO Clause 3(xix) - Capability to Meet Liabilities Falling Due within 1 Year:
- Auditor must report on whether, on the basis of:
  1. Financial ratios, ageing and expected dates of realization of financial assets and payment of financial liabilities.
  2. Other information accompanying the financial statements and auditor's knowledge of Board and management plans.
  No material uncertainty exists as of the date of the audit report that the company is capable of meeting its liabilities existing at the balance sheet date as and when they fall due within a period of 1 year from balance sheet date.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on technical precision across CARO 2020 clauses: tabular format for title deeds, ₹5 Crore working capital quarterly reconciliation, and 1-year liability realization test.",
      criticalMisses: [
        "The ₹5 Crore sanction threshold from banks/FIs on security of current assets.",
        "The 1-year time horizon from balance sheet date for Clause 3(xix)."
      ],
      suggestions: [
        "Mention that Clause 3(xix) is an opinion as of the date of the audit report regarding conditions at the balance sheet date.",
        "Specify that lease agreements duly executed are excluded from Clause 3(i)(c) title deed table."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 14: BANK & NBFC AUDITS
  // =========================================================================
  {
    id: 'aud_th_14',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    title: 'RBI IRAC Norms, NPA Classification & Scale Based Regulation (SBR) for NBFCs',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / RBI Master Directions',
    question: `Explain the Prudential Norms on Income Recognition, Asset Classification and Provisioning (IRAC) pertaining to Advances in Banks. What are the four layers introduced under RBI's Scale Based Regulation (SBR) framework for NBFCs?`,
    keyConcepts: [
      { keyword: 'IRAC Norms', category: 'Rule', description: 'Income Recognition and Asset Classification guidelines issued by Reserve Bank of India.' },
      { keyword: '90 Days Overdue Norm', category: 'Provision', description: 'Interest/installment overdue for > 90 days triggers NPA.' },
      { keyword: 'Sub-standard, Doubtful, Loss Assets', category: 'Provision', description: 'Sub-standard (≤ 12 months), Doubtful (> 12 months), Loss (uncollectible/identified loss).' },
      { keyword: 'Scale Based Regulation (SBR)', category: 'Rule', description: 'RBI regulatory structure for NBFCs based on size, activity, and systemic risk.' },
      { keyword: 'Base, Middle, Upper, Top Layers', category: 'Provision', description: 'Four tiers of SBR: Base Layer (NBFC-BL), Middle Layer (NBFC-ML), Upper Layer (NBFC-UL), Top Layer (NBFC-TL).' }
    ],
    shortSuggestedAnswer: `1. RBI IRAC Norms for Bank Advances:
- Non-Performing Asset (NPA) Criteria:
  a. Term Loan: Interest and/or installment of principal remains overdue for a period of more than 90 days.
  b. CC/OD: Account remains 'out of order' (outstanding balance exceeds sanctioned limit/drawing power, or no credits for 90 days, or credits insufficient to cover interest).
  c. Agricultural Advance: Overdue for 2 crop seasons (short duration crops) or 1 crop season (long duration crops).
- Asset Classification Tiers:
  - Standard Asset: Not an NPA.
  - Sub-standard Asset: Remains NPA for a period ≤ 12 months (provision: 15% secured, 25% unsecured).
  - Doubtful Asset: Exceeds 12 months as sub-standard (D1: up to 1 yr, D2: 1-3 yrs, D3: > 3 yrs).
  - Loss Asset: Identified by bank, internal/external auditors, or RBI inspection as uncollectible (100% provision).

2. Scale Based Regulation (SBR) for NBFCs:
- Base Layer (NBFC-BL): Non-deposit taking NBFCs below asset size of ₹1,000 Crores, peer-to-peer lending, account aggregators, type I NBFC-ND.
- Middle Layer (NBFC-ML): Deposit taking NBFCs (NBFC-D) irrespective of size, non-deposit taking NBFCs with asset size ≥ ₹1,000 Crores, HFCs, CICs, IFCs, IDFs.
- Upper Layer (NBFC-UL): NBFCs specifically identified by RBI based on scoring methodology (top 25 to 30 NBFCs by systemic risk).
- Top Layer (NBFC-TL): Ideationally empty; populated only if RBI perceives extreme systemic risk in specific Upper Layer NBFCs.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on accurate 90-day overdue threshold, 4-stage asset classification, and the 4 SBR regulatory tiers for NBFCs.",
      criticalMisses: [
        "90-day overdue rule and out-of-order definition for CC/OD accounts.",
        "The four SBR layers: Base, Middle, Upper, and Top Layer."
      ],
      suggestions: [
        "Include the provisioning percentages (15% for sub-standard, 100% for loss assets) for bonus marks.",
        "State that Top Layer is ordinarily empty until populated by RBI intervention."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 16: INTERNAL AUDIT
  // =========================================================================
  {
    id: 'aud_th_16',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    title: 'Mandatory Applicability Thresholds for Internal Audit under Section 138',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'ICAI Study Material / Section 138 & Rule 13',
    question: `State the statutory classes of companies and numerical thresholds that mandate the appointment of an Internal Auditor under Section 138 of the Companies Act, 2013 read with Rule 13 of Companies (Accounts) Rules, 2014. Who is eligible to be appointed as an internal auditor?`,
    keyConcepts: [
      { keyword: 'Section 138 of Companies Act, 2013', category: 'Section', description: 'Internal Audit statutory mandate.' },
      { keyword: 'Rule 13 of Companies (Accounts) Rules', category: 'Rule', description: 'Prescribed classes and threshold criteria for mandatory internal audit.' },
      { keyword: 'Listed Company - Every', category: 'Provision', description: 'Mandatory for every listed company.' },
      { keyword: 'Unlisted Public Company: 25 / 50 / 100 / 200 Rule', category: 'Rule', description: 'Deposits ≥ ₹25 Cr, Paid-up Capital ≥ ₹50 Cr, Borrowings ≥ ₹100 Cr, Turnover ≥ ₹200 Cr.' },
      { keyword: 'Private Company: 100 / 200 Rule', category: 'Rule', description: 'Loans/Borrowings ≥ ₹100 Cr or Turnover ≥ ₹200 Cr.' },
      { keyword: 'Eligible Appointees', category: 'Provision', description: 'Chartered Accountant, Cost Accountant, or other professional decided by Board; may or may not be an employee.' }
    ],
    shortSuggestedAnswer: `1. Mandatory Applicability Thresholds (Section 138 & Rule 13):
- Listed Companies: Every listed company is mandatorily required to appoint an internal auditor.
- Unlisted Public Companies (during the preceding financial year):
  a. Deposits: Outstanding deposits of ₹25 Crores or more at any point of time.
  b. Paid-up Share Capital: ₹50 Crores or more.
  c. Borrowings: Outstanding loans or borrowings from banks or public financial institutions exceeding ₹100 Crores at any point of time.
  d. Turnover: ₹200 Crores or more.
  (Mnemonic: 25 - 50 - 100 - 200)
- Private Companies (during the preceding financial year):
  a. Borrowings: Outstanding loans or borrowings from banks/PFIs exceeding ₹100 Crores at any point of time.
  b. Turnover: ₹200 Crores or more.
  (Mnemonic: 100 - 200)

2. Eligibility of Internal Auditor:
- May be a Chartered Accountant (in practice or not), Cost Accountant, or such other professional as decided by the Board.
- The internal auditor may or may not be an employee of the company.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on exact numerical thresholds for unlisted public companies (25/50/100/200) and private companies (100/200), plus eligibility criteria under Section 138.",
      criticalMisses: [
        "Outstanding loans/borrowings threshold exceeding ₹100 Crores at any point of time.",
        "Clarification that internal auditor may or may not be an employee."
      ],
      suggestions: [
        "Always state that thresholds are tested against the preceding financial year.",
        "Point out that deposits and borrowings are tested 'at any point of time during the preceding financial year'."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 19: PROFESSIONAL ETHICS
  // =========================================================================
  {
    id: 'aud_th_19',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    title: 'Prior Communication (Clause 8, Part I, First Schedule) & Council Guidelines on 20-Company Audit Limit',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Past Exam May 2023 / Ethical Standards Board',
    question: `CA. Aryan was approached to accept the statutory audit of QuickLogistics Ltd. in place of CA. Bimal. CA. Aryan sent a letter via simple registered post to CA. Bimal informing him of his appointment and accepted the position two days later without awaiting acknowledgment. CA. Bimal filed a complaint with ICAI alleging professional misconduct under Clause 8, Part I of the First Schedule. Furthermore, CA. Aryan already holds statutory audits of 18 companies (comprising 12 private companies with paid-up capital of ₹50 Lakhs each, 4 public companies, and 2 dormant companies).

Examine:
(a) Whether CA. Aryan is guilty of professional misconduct under Clause 8.
(b) The ceiling on the number of company audits under Section 141(3)(g) and Council General Guidelines.`,
    keyConcepts: [
      { keyword: 'Clause 8, Part I, First Schedule', category: 'Rule', description: 'Accepting appointment as auditor without first communicating with previous auditor in writing.' },
      { keyword: 'RPAD / Written Acknowledgment', category: 'Provision', description: 'Communication must be via RPAD or hand delivery with written receipt or verified UDI email.' },
      { keyword: 'Reasonable Time to Respond', category: 'Keyword', description: 'Auditor must wait for reasonable time or reply before accepting appointment.' },
      { keyword: 'Section 141(3)(g)', category: 'Section', description: 'Ceiling limit of 20 company audits per partner.' },
      { keyword: 'Exempt Companies from 20-Audit Limit', category: 'Rule', description: 'OPC, Dormant, Small companies, and Private companies having paid-up capital < ₹100 Crores.' }
    ],
    shortSuggestedAnswer: `Part (a) - Clause 8, Part I, First Schedule (Professional Misconduct):
- Under Clause 8 of Part I of the First Schedule to the Chartered Accountants Act, 1949, a member in practice is guilty of misconduct if he accepts a position as auditor previously held by another CA without first communicating with him in writing.
- Mode of Communication: The communication must be sent by Registered Post Acknowledgement Due (RPAD), hand delivery with written acknowledgment, or secure electronic communication.
- Reasonable Time: The incoming auditor must wait a reasonable time for a response before accepting appointment to ascertain professional or other reasons why appointment should not be accepted (e.g. non-payment of undisputed audit fees).
- Conclusion: CA. Aryan accepted the appointment without waiting for acknowledgment and without ensuring proof of delivery. He is guilty of professional misconduct under Clause 8.

Part (b) - 20-Company Audit Ceiling Limit:
- Under Section 141(3)(g) of Companies Act, 2013 and ICAI Council Guidelines:
  - A partner can hold maximum 20 company audits.
  - The following companies are EXCLUDED from the 20-company limit:
    1. One Person Companies (OPCs).
    2. Dormant Companies.
    3. Small Companies.
    4. Private Limited Companies having paid-up capital less than ₹100 Crores (provided no default in filing financial statements or annual returns).
- Application:
  - 12 private companies (capital ₹50 Lakhs) are excluded (< ₹100 Cr).
  - 2 dormant companies are excluded.
  - Only 4 public companies count towards the limit.
  - CA. Aryan currently holds only 4 effective audits against the 20-audit limit; hence he is well within the ceiling limit.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on Clause 8 proof of delivery and response wait-time requirements, and accurate application of the Section 141(3)(g) 20-company audit limit exclusion rules.",
      criticalMisses: [
        "RPAD / acknowledgment requirement and waiting reasonable time under Clause 8.",
        "Exclusion of private companies with paid-up capital < ₹100 Crores from the 20-audit ceiling."
      ],
      suggestions: [
        "Clarify that communication must be prior to acceptance, not merely prior to commencement of audit.",
        "List all 4 exclusions under Section 141(3)(g): OPC, Dormant, Small, and Private < ₹100 Cr."
      ]
    }
  },

  // =========================================================================
  // DIRECT TAX (DT) - CHAPTER: TRANSFER PRICING / PGBP / CORPORATE TAX
  // =========================================================================
  {
    id: 'dt_th_01',
    subjectId: 'DT',
    chapterName: 'PGBP [Chapter 3]',
    title: 'Secondary Adjustments under Section 92CE & Repatriation Timelines',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Study Material / RTP Nov 2024',
    question: `Examine the conditions under Section 92CE of the Income-tax Act, 1961 that mandate Secondary Adjustments. What is the statutory time limit for repatriation of excess money into India, and what are the tax implications if the excess money is not repatriated within the prescribed period?`,
    keyConcepts: [
      { keyword: 'Section 92CE', category: 'Section', description: 'Secondary adjustment in certain cases of transfer pricing.' },
      { keyword: '₹1 Crore Primary Adjustment Threshold', category: 'Provision', description: 'Mandatory applicability only if primary adjustment exceeds ₹1 Crore.' },
      { keyword: '90 Days Repatriation Timeline', category: 'Rule', description: 'Excess money must be repatriated within 90 days from the relevant date.' },
      { keyword: 'Deemed Advance & Imputed Interest', category: 'Keyword', description: 'Excess money treated as advance bearing interest (MCLR + 3.25% or LIBOR/SOFR + 3%).' },
      { keyword: '20.9664% Additional Tax Option', category: 'Rule', description: 'One-time tax of 18% + 12% surcharge + 4% cess on excess money in lieu of interest.' }
    ],
    shortSuggestedAnswer: `1. Applicability of Section 92CE (Secondary Adjustment):
- Mandatory where a primary adjustment to transfer price is made:
  a. Suo motu by the assessee in return of income.
  b. Made by AO and accepted by the assessee.
  c. Determined under Advance Pricing Agreement (APA).
  d. Made as per Safe Harbour Rules.
  e. Arising out of Mutual Agreement Procedure (MAP).
- Monetary Threshold: Secondary adjustment is NOT required if the primary adjustment made in any AY does NOT exceed ₹1 Crore.

2. Repatriation Timeline:
- The excess money available with the Associated Enterprise (AE) must be repatriated into India within 90 days from the relevant date (e.g. date of filing return, date of APA, date of assessment order).

3. Tax Consequences of Non-Repatriation:
- Deemed Advance & Imputed Interest:
  - If not repatriated within 90 days, the excess money is deemed to be an advance made by the Indian company to the AE, and interest is imputed perpetually:
    * In INR transactions: 1-year SBI MCLR as on April 1 + 3.25%.
    * In foreign currency transactions: 6-month LIBOR/SOFR + 3.00%.
- Additional One-Time Tax Option:
  - Assessee has an option to pay additional tax @ 20.9664% (18% tax + 12% surcharge + 4% cess) on the un-repatriated amount.
  - Once this tax is paid, no further interest is imputed, and no credit is allowed for this tax.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on the ₹1 Crore threshold, the 90-day repatriation window, and the dual mechanisms: deemed advance interest calculation and the 20.9664% optional tax.",
      criticalMisses: [
        "The ₹1 Crore primary adjustment exemption threshold.",
        "The 20.9664% tax rate (18% + 12% surcharge + 4% cess)."
      ],
      suggestions: [
        "Specify the 90-day clock start dates (date of return filing for suo motu, date of order for AO adjustments).",
        "Clarify that no foreign tax credit or deduction is allowed for the 20.9664% additional tax."
      ]
    }
  },
  {
    id: 'dt_th_02',
    subjectId: 'DT',
    chapterName: 'Basic Concepts',
    title: 'TDS on Purchase u/s 194Q vs TCS on Sale u/s 206C(1H) Priority Hierarchy',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI RTP May 2024 / Past Exam',
    question: `Explain the statutory interplay and priority hierarchy between TDS on purchase of goods under Section 194Q and TCS on sale of goods under Section 206C(1H). If both buyer and seller have a turnover exceeding ₹10 Crores in the preceding financial year and the transaction value exceeds ₹50 Lakhs, who is liable to deduct or collect tax?`,
    keyConcepts: [
      { keyword: 'Section 194Q', category: 'Section', description: 'TDS on payment of certain sum for purchase of goods.' },
      { keyword: 'Section 206C(1H)', category: 'Section', description: 'TCS on receipt of sale consideration for goods.' },
      { keyword: 'Turnover > ₹10 Crores in Preceding FY', category: 'Provision', description: 'Threshold turnover of buyer/seller in preceding financial year.' },
      { keyword: '₹50 Lakhs Value Threshold', category: 'Provision', description: 'Transaction threshold triggering TDS/TCS on excess amount.' },
      { keyword: '0.1% Rate', category: 'Rule', description: 'Standard tax rate on amount exceeding ₹50 Lakhs.' },
      { keyword: 'Section 194Q Prevails Hierarchy Rule', category: 'Provision', description: 'TDS u/s 194Q takes absolute priority over TCS u/s 206C(1H).' }
    ],
    shortSuggestedAnswer: `1. Section 194Q (Buyer TDS) Parameters:
- Trigger: Buyer whose total sales/turnover/gross receipts exceed ₹10 Crores in the preceding FY.
- Threshold: Purchase of goods from a resident seller exceeding ₹50 Lakhs in a financial year.
- Rate: 0.1% of purchase value exceeding ₹50 Lakhs (5% if seller fails to furnish PAN).
- Timing: At the time of credit of such sum to seller's account or payment by any mode, whichever is earlier.

2. Section 206C(1H) (Seller TCS) Parameters:
- Trigger: Seller whose turnover exceeds ₹10 Crores in the preceding FY.
- Threshold: Receipt of consideration for sale of goods exceeding ₹50 Lakhs in a FY from a buyer.
- Rate: 0.1% of receipt exceeding ₹50 Lakhs (1% if buyer fails to furnish PAN).
- Timing: At the time of receipt of amount.

3. Priority Hierarchy Rule:
- Section 206C(1H) explicitly provides that TCS shall NOT apply if the buyer is liable to deduct tax at source under any other provision of the Act and has deducted such amount.
- Therefore, where both buyer and seller meet the ₹10 Crore turnover threshold and transaction exceeds ₹50 Lakhs:
  - Section 194Q TAKES PRECEDENCE over Section 206C(1H).
  - The buyer must deduct TDS @ 0.1% u/s 194Q.
  - The seller shall NOT collect TCS u/s 206C(1H).`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on accurate criteria for both sections (preceding FY turnover > ₹10 Cr, transaction > ₹50L, 0.1% rate) and the statutory priority rule making 194Q supreme.",
      criticalMisses: [
        "The explicit priority rule: if buyer is liable to deduct TDS u/s 194Q, seller cannot collect TCS u/s 206C(1H).",
        "Higher TDS rate without PAN (5% u/s 194Q vs 1% u/s 206C(1H))."
      ],
      suggestions: [
        "Mention that Section 194Q triggers on credit or payment, whereas 206C(1H) triggers only on receipt.",
        "Emphasize that the ₹10 Crore turnover is checked for the preceding financial year."
      ]
    }
  },

  // =========================================================================
  // INDIRECT TAX (IDT) - CHAPTER: INPUT TAX CREDIT / E-WAY BILL / CUSTOMS
  // =========================================================================
  {
    id: 'idt_th_01',
    subjectId: 'IDT',
    chapterName: 'Input Tax Credit',
    title: 'Blocked Input Tax Credit under Section 17(5) of CGST Act, 2017',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Past Exam / RTP Nov 2024',
    question: `Explain the statutory provisions regarding blocked Input Tax Credit (ITC) under Section 17(5) of the CGST Act, 2017 in respect of:
(a) Motor vehicles for transportation of persons.
(b) Works contract services and goods/services used for construction of immovable property.
(c) Corporate Social Responsibility (CSR) expenditure under Clause (fa).
(d) Goods lost, stolen, destroyed, written off, or disposed of by way of gift or free samples.`,
    keyConcepts: [
      { keyword: 'Section 17(5) of CGST Act', category: 'Section', description: 'Blocked input tax credit notwithstanding anything contained in Section 16(1).' },
      { keyword: 'Clause (a) Motor Vehicles ≤ 13 Seating Capacity', category: 'Rule', description: 'Blocked unless used for taxable supply of vehicles, passenger transport, or driving training.' },
      { keyword: 'Clause (c) & (d) Immovable Property Construction', category: 'Rule', description: 'Blocked when capitalized to immovable property; allowed for plant & machinery.' },
      { keyword: 'Clause (fa) CSR Expenditure', category: 'Rule', description: 'Statutory bar on ITC on goods/services used for CSR obligations under Section 135 of Companies Act.' },
      { keyword: 'Clause (h) Lost, Stolen, Gift, Free Samples', category: 'Rule', description: 'Mandatory reversal/ineligibility of ITC on lost, stolen, destroyed, or gifted goods.' }
    ],
    shortSuggestedAnswer: `(a) Clause 17(5)(a) - Motor Vehicles:
- ITC is blocked on motor vehicles for transportation of persons having approved seating capacity of ≤ 13 persons (including driver).
- Exceptions (ITC is ELIGIBLE): When used for:
  1. Further supply of such motor vehicles.
  2. Transportation of passengers.
  3. Imparting training on driving such motor vehicles.
- Vehicles with seating capacity > 13 persons are eligible for ITC if used for business.

(b) Clause 17(5)(c) & (d) - Works Contract & Construction:
- Blocked on works contract services supplied for construction of an immovable property (other than plant and machinery) except where it is an input service for further supply of works contract service.
- Blocked on goods or services received by a taxable person for construction of an immovable property (other than plant or machinery) on his own account, even when used in the course or furtherance of business, to the extent capitalized to the immovable property.

(c) Clause 17(5)(fa) - CSR Expenditure:
- Newly inserted clause specifically blocks ITC on goods or services or both received by a taxable person, which are used or intended to be used for activities relating to his obligations under Section 135 of the Companies Act, 2013 (CSR).

(d) Clause 17(5)(h) - Lost, Stolen, or Gifted Goods:
- ITC is blocked on goods lost, stolen, destroyed, written off, or disposed of by way of gift or free samples.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on precision across all 4 sub-clauses of Section 17(5): the ≤13 seat rule for motor vehicles, the capitalization test for construction, the CSR statutory bar under clause (fa), and clause (h) reversals.",
      criticalMisses: [
        "Plant and Machinery exception for works contract and construction.",
        "Specific citation of Clause (fa) for CSR expenditure."
      ],
      suggestions: [
        "Highlight that construction is blocked only to the extent capitalized to the asset value.",
        "State the 3 exceptions for motor vehicles clearly (further supply, passenger transport, driving training)."
      ]
    }
  },
  {
    id: 'idt_th_02',
    subjectId: 'IDT',
    chapterName: 'Accounts and Records; E-way Bill',
    title: 'Rule 138 E-Way Bill Generation Thresholds & Validity Rules',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'ICAI Study Material / CGST Rules',
    question: `State the circumstances under Rule 138 of the CGST Rules, 2017 where an E-Way Bill is mandatorily required to be generated even if the consignment value does NOT exceed ₹50,000. What is the validity period of an E-Way Bill for general cargo versus Over Dimensional Cargo (ODC)?`,
    keyConcepts: [
      { keyword: 'Rule 138 of CGST Rules', category: 'Rule', description: 'Information to be furnished prior to commencement of movement of goods and generation of e-way bill.' },
      { keyword: '₹50,000 Consignment Value Threshold', category: 'Provision', description: 'General threshold for mandatory e-way bill generation.' },
      { keyword: 'Mandatory E-Way Bill without threshold', category: 'Rule', description: 'Inter-state movement by principal to job-worker and inter-state transport of handicraft goods by exempt dealers.' },
      { keyword: '200 km per day (Normal Cargo)', category: 'Rule', description: 'Validity is 1 day up to 200 km and 1 additional day for every 200 km or part thereof.' },
      { keyword: '20 km per day (ODC / Multimodal Ship)', category: 'Rule', description: 'Validity is 1 day up to 20 km and 1 additional day for every 20 km or part thereof.' }
    ],
    shortSuggestedAnswer: `1. Mandatory E-Way Bill regardless of Consignment Value (even if ≤ ₹50,000):
- Inter-state movement of goods by a Principal to a Job-Worker: Where goods are sent by a principal located in one State/UT to a job-worker located in any other State/UT.
- Inter-state transport of Handicraft Goods: Movement of handicraft goods by a person who has been exempted from obtaining registration under Section 24.

2. E-Way Bill Validity Rules:
- General Cargo / Normal Movement:
  - Up to 200 km: 1 day.
  - For every 200 km or part thereof thereafter: 1 additional day.
- Over Dimensional Cargo (ODC) or Multimodal shipment involving transport by ship:
  - Up to 20 km: 1 day.
  - For every 20 km or part thereof thereafter: 1 additional day.

3. Extension: Validity can be extended within 8 hours before or 8 hours after expiry of the validity period.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on the two exceptions to the ₹50,000 limit (job work and handicrafts) and the exact distance validity metrics (200 km/day normal vs 20 km/day ODC).",
      criticalMisses: [
        "Inter-state job work movement as an exception to the monetary threshold.",
        "The 200 km per day standard rule (updated from the older 100 km rule)."
      ],
      suggestions: [
        "Mention the 8-hour window before/after expiry for validity extension.",
        "Clarify that consignment value includes GST taxes but excludes exempt goods value."
      ]
    }
  },

  // =========================================================================
  // FINANCIAL REPORTING (FR) - IND AS 115 / IND AS 116 / IND AS 109
  // =========================================================================
  {
    id: 'fr_th_01',
    subjectId: 'FR',
    chapterName: 'Ind AS 115 Revenue',
    title: 'Five-Step Revenue Recognition Model & Principal vs Agent Assessment (Ind AS 115)',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Study Material / RTP Nov 2024',
    question: `Explain the Five-Step Model for revenue recognition under Ind AS 115 'Revenue from Contracts with Customers'. How does an entity assess whether it is acting as a Principal or as an Agent, and what are the respective presentation consequences in the Statement of Profit and Loss?`,
    keyConcepts: [
      { keyword: 'Ind AS 115', category: 'Standard', description: 'Revenue from Contracts with Customers.' },
      { keyword: 'Step 1: Identify Contract', category: 'Provision', description: 'Approved, commercial substance, enforceable rights, probable collection.' },
      { keyword: 'Step 2: Identify Performance Obligations', category: 'Provision', description: 'Distinct goods or services promised to the customer.' },
      { keyword: 'Step 3: Determine Transaction Price', category: 'Provision', description: 'Amount expected to be entitled, adjusted for variable consideration and financing.' },
      { keyword: 'Step 4: Allocate Transaction Price', category: 'Provision', description: 'Allocation based on relative stand-alone selling prices (SSP).' },
      { keyword: 'Step 5: Recognize Revenue on Control Transfer', category: 'Provision', description: 'Over time or at a point in time when performance obligation is satisfied.' },
      { keyword: 'Principal vs Agent Control Test', category: 'Keyword', description: 'Principal controls good/service before transfer (gross revenue); Agent arranges supply (net commission).' }
    ],
    shortSuggestedAnswer: `1. Ind AS 115 Five-Step Sequential Model:
- Step 1: Identify the contract(s) with a customer: Parties have approved contract, rights & payment terms can be identified, contract has commercial substance, collection of consideration is probable.
- Step 2: Identify the performance obligations (PO) in the contract: Evaluate distinct promises to transfer goods or services (capable of being distinct + distinct within the context of the contract).
- Step 3: Determine the transaction price: Fixed price adjusted for variable consideration (subject to constraint), significant financing component, non-cash consideration, consideration payable to customer.
- Step 4: Allocate the transaction price to the performance obligations: Allocate based on relative Stand-Alone Selling Prices (SSP) of each distinct PO.
- Step 5: Recognize revenue when (or as) the entity satisfies a performance obligation: Upon transfer of control of promised goods or services (either over time or at a point in time).

2. Principal vs Agent Assessment:
- Core Criterion: An entity is a Principal if it CONTROLS the specified good or service before it is transferred to the customer.
- Indicators of Principal:
  a. Primary responsibility for fulfilling the promise.
  b. Inventory risk before or after transfer.
  c. Discretion in establishing prices.
- Presentation Consequence:
  - Principal recognizes revenue on a GROSS basis (gross amount of consideration expected).
  - Agent recognizes revenue on a NET basis (net fee or commission retained for arranging).`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on complete 5 steps with accurate standard terminology (performance obligations, relative SSP allocation, control transfer) and the control-based Principal vs Agent test.",
      criticalMisses: [
        "Relative stand-alone selling price (SSP) allocation basis in Step 4.",
        "Control of goods/services before transfer as the decisive Principal test."
      ],
      suggestions: [
        "List the 3 primary indicators of acting as a principal (primary responsibility, inventory risk, pricing discretion).",
        "Clarify that revenue is recognized when control passes, not necessarily when risks and rewards pass."
      ]
    }
  },
  {
    id: 'fr_th_02',
    subjectId: 'FR',
    chapterName: 'Ind AS 116 Leases',
    title: 'Single Lessee Accounting Model, ROU Asset Measurement & Exemptions (Ind AS 116)',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / Ind AS 116 Master Guide',
    question: `Explain the Single Lessee Accounting Model under Ind AS 116. How are the Lease Liability and Right-of-Use (ROU) Asset initially measured at commencement date? What are the two optional recognition exemptions available to lessees?`,
    keyConcepts: [
      { keyword: 'Ind AS 116', category: 'Standard', description: 'Leases.' },
      { keyword: 'Single Lessee Model', category: 'Provision', description: 'Eliminates distinction between operating and finance leases for lessees; all leases on balance sheet.' },
      { keyword: 'Lease Liability Initial Measurement', category: 'Rule', description: 'Present value of unpaid lease payments discounted using interest rate implicit in lease or incremental borrowing rate.' },
      { keyword: 'ROU Asset Initial Measurement', category: 'Rule', description: 'Initial lease liability + initial direct costs + prepaid payments + dismantling costs - lease incentives.' },
      { keyword: 'Short-term Lease Exemption (≤ 12 months)', category: 'Provision', description: 'Lease term ≤ 12 months with no purchase option; expense on straight-line basis.' },
      { keyword: 'Low-value Asset Exemption (~ $5,000)', category: 'Provision', description: 'Underlying asset when new is low value (e.g. laptops, tablets, office furniture).' }
    ],
    shortSuggestedAnswer: `1. Single Lessee Model:
- Ind AS 116 abolishes the dual classification (operating vs finance lease) for lessees.
- All leases (subject to exemptions) must be recognized on the balance sheet as a Right-of-Use (ROU) Asset and a corresponding Lease Liability.

2. Initial Measurement at Commencement Date:
- Lease Liability:
  - Present value of lease payments not paid at commencement date.
  - Discounted using the Interest Rate Implicit in the Lease (if readily determinable); otherwise using the lessee's Incremental Borrowing Rate (IBR).
  - Includes fixed payments, in-substance fixed payments, variable lease payments linked to an index/rate, amounts expected under residual value guarantees, exercise price of purchase option (if reasonably certain).
- Right-of-Use (ROU) Asset:
  - Initial measurement of Lease Liability, PLUS:
  - Lease payments made at or before commencement date (less lease incentives received), PLUS:
  - Initial direct costs incurred by lessee, PLUS:
  - Estimated dismantling, removal, and site restoration costs.

3. Optional Recognition Exemptions:
- Short-term Leases: Leases with lease term of ≤ 12 months containing no purchase option (elected by class of underlying asset).
- Leases of Low-value Assets: Underlying asset when brand new is of low value (~$5,000 e.g. PCs, office furniture) (elected on lease-by-lease basis).
- Under both exemptions, lease payments are recognized as an expense on a straight-line basis over lease term.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on initial measurement formula for both Lease Liability (PV of payments discounted at implicit rate/IBR) and ROU Asset, plus the two statutory exemptions.",
      criticalMisses: [
        "Inclusion of initial direct costs and dismantling/restoration costs in ROU Asset.",
        "Short-term lease definition: ≤ 12 months with NO purchase option."
      ],
      suggestions: [
        "Mention that short-term exemption is elected by asset class, whereas low-value is lease-by-lease.",
        "Specify that under exemptions, expense is recognized straight-line over lease term."
      ]
    }
  },

  // =========================================================================
  // ADVANCED FINANCIAL MANAGEMENT (AFM)
  // =========================================================================
  {
    id: 'afm_th_01',
    subjectId: 'AFM',
    chapterName: 'Derivatives Analysis and Valuation',
    title: 'Put-Call Parity Theory, Arbitrage Relationships & Black-Scholes Inputs',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / AFM Master Formulae',
    question: `State the Put-Call Parity equation for European options. Explain how an arbitrage opportunity is exploited if Put-Call Parity is violated. List the five key input parameters required by the Black-Scholes Option Pricing Model (BSOPM).`,
    keyConcepts: [
      { keyword: 'Put-Call Parity Equation', category: 'Standard', description: 'C + PV(X) = P + S or C + X*e^(-rt) = P + S for European options.' },
      { keyword: 'Synthetic Long / Short Positions', category: 'Keyword', description: 'Creating identical payoff profiles through option and underlying combinations.' },
      { keyword: 'Arbitrage Mechanism', category: 'Provision', description: 'Sell overpriced side and buy underpriced side to lock in riskless profit.' },
      { keyword: '5 Black-Scholes Inputs', category: 'Rule', description: 'Current Stock Price (S), Strike Price (X), Risk-free Rate (r), Time to Expiration (t), Volatility (σ).' }
    ],
    shortSuggestedAnswer: `1. Put-Call Parity Equation (European Options):
- Formula: C + PV(X) = P + S
  Where:
  - C = Current price of European Call option
  - PV(X) = Present value of Strike Price [X * e^(-rt) in continuous compounding, or X / (1+r)^t]
  - P = Current price of European Put option
  - S = Current Spot price of the underlying asset

2. Arbitrage Opportunities on Violation:
- Case 1: If C + PV(X) > P + S (Call is overpriced relative to Put):
  - Action: SELL Call + BORROW PV(X) (short bond) and BUY Put + BUY Stock.
  - Riskless arbitrage profit locked in immediately.
- Case 2: If C + PV(X) < P + S (Put is overpriced relative to Call):
  - Action: BUY Call + LEND PV(X) (buy bond) and SELL Put + SHORT SELL Stock.

3. Five Inputs to Black-Scholes Option Pricing Model:
  1. Current Spot Price of the underlying stock (S).
  2. Strike / Exercise Price of the option (X).
  3. Time to expiration in years (t).
  4. Continuously compounded risk-free interest rate (r).
  5. Volatility (Standard Deviation) of stock returns (σ).`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on the exact Put-Call Parity formula, the buy-underpriced / sell-overpriced arbitrage mechanics, and all 5 Black-Scholes inputs.",
      criticalMisses: [
        "Explicit Put-Call Parity equation C + PV(X) = P + S.",
        "Listing all 5 variables: S, X, t, r, and σ (volatility)."
      ],
      suggestions: [
        "Emphasize that Put-Call Parity strictly applies to European options without intermediate dividends.",
        "Note that volatility (σ) is the only unobservable market parameter in Black-Scholes."
      ]
    }
  },

  // =========================================================================
  // INTEGRATED BUSINESS SOLUTIONS (IBS)
  // =========================================================================
  {
    id: 'ibs_th_01',
    subjectId: 'IBS',
    chapterName: 'General Advanced Core Concepts',
    title: 'Slump Sale (Section 50B) vs Demerger (Section 2(19AA)) Multi-Disciplinary Restructuring',
    difficulty: 'Mastery',
    marks: 10,
    icaiExamRef: 'ICAI IBS Case Study Series / RTP 2024',
    question: `A conglomerate plans to hive off its retail business undertaking. Management is evaluating whether to structure the transaction as a Slump Sale under Section 50B of the Income-tax Act, 1961 or as a Scheme of Demerger under Section 2(19AA) read with Section 232 of the Companies Act, 2013.

Synthesize the legal, direct tax, and GST implications of both options, with particular emphasis on:
(a) Tax-neutrality conditions under Section 47.
(b) Computation of capital gains and Rule 11UAE FMV in Slump Sale.
(c) GST liability on the transfer of a going concern.`,
    keyConcepts: [
      { keyword: 'Section 50B', category: 'Section', description: 'Special provision for computation of capital gains in case of slump sale.' },
      { keyword: 'Rule 11UAE', category: 'Rule', description: 'Computation of Fair Market Value of Capital Assets in case of slump sale.' },
      { keyword: 'Section 2(19AA) Demerger', category: 'Section', description: 'Transfer of one or more undertakings pursuant to Sections 230-232 of Companies Act.' },
      { keyword: 'Section 47(vib) Tax Neutrality', category: 'Provision', description: 'Exemption from capital gains in demerger of an Indian company.' },
      { keyword: 'GST Notification 12/2017 Going Concern', category: 'Rule', description: 'Services by way of transfer of a going concern, as a whole or an independent part thereof, is NIL rated / EXEMPT.' }
    ],
    shortSuggestedAnswer: `1. Slump Sale under Section 50B:
- Direct Tax:
  - Transfer of one or more undertakings for a lump sum consideration without values being assigned to individual assets and liabilities.
  - Capital Gains = Deemed Full Value of Consideration (computed under Rule 11UAE: higher of FMV1 or FMV2) MINUS Net Worth of the undertaking.
  - No indexation benefit is available even if the undertaking is held for > 36 months.
  - Gains are treated as Long-Term if the undertaking is held for > 36 months; otherwise Short-Term.
- GST:
  - Transfer of a business as a going concern (whole or independent part) is exempt from GST under Notification No. 12/2017-Central Tax (Rate), Serial No. 2. No GST is payable on slump sale.

2. Demerger under Section 2(19AA) & Companies Act:
- Direct Tax Neutrality:
  - Transfer of undertaking must comply with Section 2(19AA): all property/liabilities transferred at book values, on a going-concern basis, and shares issued to shareholders on proportionate basis.
  - Under Section 47(vib), transfer of capital asset by demerged company to resulting Indian company is EXEMPT from capital gains.
  - Under Section 47(vid), issue of shares by resulting company to shareholders of demerged company is EXEMPT in the hands of shareholders.
- Companies Act:
  - Requires NCLT approval under Sections 230-232, approval of shareholders and creditors.
- GST:
  - Exempt as transfer of a going concern under Notification 12/2017.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on multi-disciplinary synthesis across Section 50B (Rule 11UAE, Net Worth, no indexation), Section 2(19AA) / 47(vib) tax neutrality, and the GST Notification 12/2017 going concern exemption.",
      criticalMisses: [
        "Rule 11UAE for full value of consideration under Section 50B.",
        "Section 47(vib) and 47(vid) tax neutrality conditions for demerger.",
        "GST Notification 12/2017 going concern exemption."
      ],
      suggestions: [
        "Contrast that consideration in a demerger flows directly to shareholders (shares), whereas in a slump sale it flows to the company (cash/shares).",
        "Mention that NCLT sanction is mandatory for demergers under Sections 230-232."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 6: COMPLETION AND REVIEW
  // =========================================================================
  {
    id: 'aud_th_06',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    title: 'Subsequent Events (SA 560) - Type 1 vs Type 2 Events & Management Inaction',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Past Exam / SA 560 Master Guide',
    question: `Alpha Limited's financial year ended on March 31, 2026. The financial statements were approved by the Board of Directors on May 15, 2026. On May 25, 2026, before the issuance of the auditor's report, a major trade receivable who owed ₹85 Lakhs (accounting for 15% of total receivables) went into liquidation due to a deteriorating financial condition that had existed since January 2026. On June 5, 2026, a massive fire destroyed an uninsured warehouse causing inventory loss of ₹1.1 Crores. 

Management refuses to amend the financial statements for the receivable or the inventory loss, arguing that both events occurred after the balance sheet date.

Examine:
(a) The classification of these two events under Ind AS 10 and SA 560.
(b) The auditor's statutory duties and reporting consequences under SA 560 and SA 705.`,
    keyConcepts: [
      { keyword: 'SA 560', category: 'Standard', description: 'Subsequent Events.' },
      { keyword: 'Ind AS 10', category: 'Standard', description: 'Events After the Reporting Period.' },
      { keyword: 'Type 1 Adjusting Event', category: 'Provision', description: 'Conditions existed at balance sheet date; requires adjustment in numbers.' },
      { keyword: 'Type 2 Non-adjusting Event', category: 'Provision', description: 'Conditions arose subsequent to balance sheet date; requires disclosure only.' },
      { keyword: 'Auditor Action on Management Refusal', category: 'Keyword', description: 'Issue Modified Opinion (Qualified/Adverse) under SA 705 if material.' }
    ],
    shortSuggestedAnswer: `1. Event Classification under Ind AS 10 and SA 560:
- Liquidation of Trade Receivable (₹85 Lakhs):
  - Deteriorating financial condition existed as on March 31, 2026.
  - Classification: Adjusting Event (Type 1 Subsequent Event).
  - Treatment: Management is mandatorily required to adjust the financial statements by creating an allowance / writing off the receivable.
- Warehouse Fire Loss (₹1.1 Crores):
  - The fire occurred on June 5, 2026, representing a condition that arose after the reporting date.
  - Classification: Non-adjusting Event (Type 2 Subsequent Event).
  - Treatment: Does not require numerical adjustment of financial statements, but requires full disclosure in the Notes to Accounts due to materiality.

2. Auditor's Reporting Duties (SA 560 & SA 705):
- If management refuses to amend the financial statements:
  - For the unadjusted ₹85 Lakhs bad debt (material misstatement of profit and assets):
    * The auditor must evaluate materiality and pervasiveness under SA 705.
    * If material but not pervasive: Issue a Qualified Opinion.
    * If material and pervasive: Issue an Adverse Opinion.
  - For non-disclosure of the ₹1.1 Crore fire loss:
    * Failure to disclose a material non-adjusting event also constitutes a disclosure misstatement requiring qualification under SA 705.
- The auditor must communicate these issues with TCWG under SA 260 before issuing the modified report.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on proper classification of debtor liquidation as Adjusting (Type 1) and fire loss as Non-adjusting (Type 2), and the SA 705 modification duties on management refusal.",
      criticalMisses: [
        "Debtor condition existed at balance sheet date making it an Adjusting Event.",
        "Fire occurred after balance sheet date making it a Non-adjusting Event requiring disclosure.",
        "Issuance of Qualified or Adverse Opinion under SA 705."
      ],
      suggestions: [
        "Cite Ind AS 10 together with SA 560 for full marks.",
        "Distinguish between material vs pervasive impacts on the opinion type."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 9: RELATED SERVICES (SRS 4400 / SRS 4410)
  // =========================================================================
  {
    id: 'aud_th_09',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    title: 'Agreed-Upon Procedures (SRS 4400) vs Compilation Engagements (SRS 4410)',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / Related Services Standards',
    question: `Differentiate between an Engagement to Perform Agreed-Upon Procedures (SRS 4400) and a Compilation Engagement (SRS 4410). Discuss the nature of assurance provided, report format, and distribution restrictions in both engagements.`,
    keyConcepts: [
      { keyword: 'SRS 4400 (Revised)', category: 'Standard', description: 'Engagements to Perform Agreed-upon Procedures Regarding Financial Information.' },
      { keyword: 'SRS 4410 (Revised)', category: 'Standard', description: 'Compilation Engagements.' },
      { keyword: 'No Assurance Expressed', category: 'Provision', description: 'Neither AUP nor compilation provides any assurance (audit or review).' },
      { keyword: 'Report of Factual Findings', category: 'Keyword', description: 'AUP auditor reports factual findings without opinion; users draw own conclusions.' },
      { keyword: 'Distribution Restriction', category: 'Rule', description: 'AUP report is strictly restricted to parties that have agreed to the procedures.' }
    ],
    shortSuggestedAnswer: `1. Objective & Nature:
- SRS 4400 (Agreed-Upon Procedures):
  - Practitioner performs procedures of an audit nature to which the practitioner, the entity, and any appropriate third parties have agreed.
  - Deliverable: Report of Factual Findings. No opinion or assurance is expressed.
  - Users assess the factual findings themselves and draw their own conclusions.
- SRS 4410 (Compilation Engagements):
  - Practitioner uses accounting and financial reporting expertise (as opposed to auditing expertise) to assist management with the preparation and presentation of financial information.
  - Deliverable: Practitioner's Compilation Report.

2. Level of Assurance:
- SRS 4400: Zero assurance (no audit or review assurance).
- SRS 4410: Zero assurance. The practitioner does not test the accuracy or completeness of the information provided.

3. Restriction on Distribution:
- SRS 4400: The report is strictly restricted to those parties that have agreed to the procedures, as others unaware of reasons might misinterpret the results.
- SRS 4410: General distribution is permitted unless specifically agreed otherwise.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on explicit recognition that both SRS 4400 and SRS 4410 offer zero assurance, the factual findings nature of SRS 4400, and its strict distribution restriction.",
      criticalMisses: [
        "SRS 4400 produces a Report of Factual Findings without any assurance.",
        "Restriction of SRS 4400 report exclusively to agreed parties."
      ],
      suggestions: [
        "Contrast that SRS 4410 requires accounting expertise, whereas SRS 4400 involves audit-nature procedures.",
        "State clearly that independence is not mandatory under SRS 4410 unless required by law/code, but must be disclosed."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 10: REVIEW OF FINANCIAL INFORMATION (SRE 2400 / 2410)
  // =========================================================================
  {
    id: 'aud_th_10',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    title: 'Review Engagements (SRE 2400 vs SRE 2410) & Negative Assurance Wording',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / SRE Series',
    question: `Compare the scope, applicability, and reporting structure of SRE 2400 (Revised) and SRE 2410. What is the standard conclusion wording used in a review report, and why is it referred to as 'Negative Assurance'?`,
    keyConcepts: [
      { keyword: 'SRE 2400 (Revised)', category: 'Standard', description: 'Engagements to Review Historical Financial Statements (by non-statutory auditor).' },
      { keyword: 'SRE 2410', category: 'Standard', description: 'Review of Interim Financial Information Performed by the Independent Auditor of the Entity.' },
      { keyword: 'Limited Assurance', category: 'Provision', description: 'Reviews provide limited (moderate) assurance, lower than reasonable assurance of an audit.' },
      { keyword: 'Inquiry and Analytical Procedures', category: 'Keyword', description: 'Primary procedures in a review; tests of controls and substantive tests are not performed.' },
      { keyword: 'Negative Assurance Wording', category: 'Provision', description: 'Nothing has come to our attention that causes us to believe FS are not prepared in all material respects...' }
    ],
    shortSuggestedAnswer: `1. SRE 2400 vs SRE 2410 Comparison:
- Applicability:
  - SRE 2400: Applies when a practitioner who is NOT the statutory auditor of the entity undertakes an engagement to review historical financial statements.
  - SRE 2410: Applies specifically when the statutory auditor of the entity undertakes a review of interim financial information (e.g. quarterly listed company results).
- Procedures Employed:
  - In both standards, procedures are primarily restricted to making Inquiries of management and applying Analytical Procedures.
  - Substantive testing, physical verification, and internal control testing are NOT performed unless inconsistencies arise.

2. Limited Assurance & Negative Assurance Wording:
- Level of Assurance: A review provides Limited (or Moderate) Assurance, which is substantially less than the Reasonable Assurance provided by a statutory audit.
- Standard Conclusion Wording:
  "Based on our review, nothing has come to our attention that causes us to believe that the accompanying financial statements do not present fairly, in all material respects (or do not give a true and fair view) in accordance with the applicable financial reporting framework."
- Why 'Negative Assurance': It is phrased negatively because the practitioner states that no contrary evidence came to notice, rather than positively asserting that the financial statements are true and fair.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on distinguishing SRE 2400 (non-auditor) from SRE 2410 (statutory auditor), the reliance on inquiries and analytics, and the exact negative assurance conclusion phrasing.",
      criticalMisses: [
        "SRE 2410 is specifically performed by the entity's independent statutory auditor.",
        "Exact negative phrasing: 'nothing has come to our attention...'"
      ],
      suggestions: [
        "Mention that quarterly reviews under SEBI LODR Regulation 33 are conducted under SRE 2410.",
        "Emphasize that internal control testing is not required in a standard review engagement."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 11: PROSPECTIVE FINANCIAL INFORMATION (SAE 3400)
  // =========================================================================
  {
    id: 'aud_th_11',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    title: 'Forecast vs Projection & Mandatory Disclaimers under SAE 3400',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / SAE 3400',
    question: `Differentiate between a 'Forecast' and a 'Projection' under SAE 3400. Explain why the auditor is prohibited from expressing an opinion on whether the results shown in the prospective financial information will actually be achieved, and state the mandatory disclaimer clause.`,
    keyConcepts: [
      { keyword: 'SAE 3400', category: 'Standard', description: 'The Examination of Prospective Financial Information.' },
      { keyword: 'Forecast', category: 'Provision', description: 'PFI prepared on the basis of best-estimate assumptions regarding future events.' },
      { keyword: 'Projection', category: 'Provision', description: 'PFI prepared on hypothetical assumptions or mix of best-estimate and hypothetical.' },
      { keyword: 'Prohibition on Outcome Assurance', category: 'Rule', description: 'Auditor cannot give assurance that actual results will match prospective results.' },
      { keyword: 'Mandatory Disclaimer Clause', category: 'Keyword', description: 'Actual results are likely to be different from PFI because events and circumstances frequently do not occur as expected.' }
    ],
    shortSuggestedAnswer: `1. Forecast vs Projection (SAE 3400):
- Forecast: Prospective financial information prepared on the basis of assumptions as to future events which management expects to take place and the actions management expects to take as of the date the information is prepared (Best-Estimate Assumptions).
- Projection: Prospective financial information prepared on the basis of:
  a. Hypothetical assumptions about future events and management actions that are not necessarily expected to take place (e.g. startup scenario or what-if analysis); or
  b. A mixture of best-estimate and hypothetical assumptions.

2. Prohibition on Outcome Assurance:
- The auditor does not express an opinion on whether the actual results shown in the prospective financial information will be achieved.
- Reason: Prospective results are based on events and circumstances that have not yet occurred and may not occur. Unanticipated events and circumstances frequently occur, and actual results will vary.

3. Mandatory Disclaimer Clause in Report:
- The auditor's report must include a clear statement that:
  "Actual results are likely to be different from the prospective financial information since anticipated events frequently do not occur as expected and the variation may be material. Consequently, we do not express an opinion as to whether the actual results will be achieved."`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on best-estimate (Forecast) vs hypothetical (Projection) distinction, justification for prohibiting outcome assurance, and the exact mandatory disclaimer wording.",
      criticalMisses: [
        "Forecast is based on best-estimate assumptions; Projection includes hypothetical assumptions.",
        "The mandatory disclaimer that actual results frequently differ from prospective results."
      ],
      suggestions: [
        "State that the practitioner expresses moderate assurance on reasonableness of assumptions.",
        "Note that projections are generally restricted in distribution (e.g. for lenders/investors only)."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 12: DIGITAL AUDITING & ASSURANCE
  // =========================================================================
  {
    id: 'aud_th_12',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    title: 'General IT Controls (GITCs) vs Application Controls & CAATs in Fraud Detection',
    difficulty: 'Moderate',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / Digital Auditing Module',
    question: `In an automated ERP environment, distinguish between General Information Technology Controls (GITCs) and Automated Application Controls. Give two examples of each. Explain how Computer Assisted Audit Techniques (CAATs) assist the statutory auditor in identifying unauthorized journal entries and override of controls.`,
    keyConcepts: [
      { keyword: 'General IT Controls (GITCs)', category: 'Provision', description: 'Policies and procedures relating to many applications; support effective functioning of application controls.' },
      { keyword: 'Application Controls', category: 'Provision', description: 'Automated procedures within software applications to ensure completeness, accuracy, and validity of transactions.' },
      { keyword: 'Access Security & Program Change', category: 'Keyword', description: 'Key domains of GITC: access to programs/data, program changes, computer operations.' },
      { keyword: 'Input / Processing Controls', category: 'Keyword', description: 'Field checks, sequence checks, limit checks, automated three-way matching.' },
      { keyword: 'CAATs & Data Analytics', category: 'Standard', description: 'Use of audit software to query 100% of journal entry populations to detect anomalies, round sums, backdated entries.' }
    ],
    shortSuggestedAnswer: `1. General IT Controls (GITCs) vs Automated Application Controls:
- General IT Controls (GITCs):
  - Definition: Policies and procedures that apply to all or many applications and support the effective functioning of application controls by helping to ensure the continued proper operation of information systems.
  - Key Domains: (1) Access to Programs and Data (user access management, password policies), (2) Program Change (testing, authorization of updates), (3) Program Development, (4) Computer Operations (job scheduling, backup/recovery).
  - Examples: Multi-factor authentication to ERP database; segregation of developer rights from production environment.
- Automated Application Controls:
  - Definition: Specific automated procedures embedded within individual software applications that ensure the completeness, accuracy, authorization, and validity of transaction processing.
  - Examples: Automated three-way matching (Purchase Order, Goods Receipt Note, and Supplier Invoice); limit/range validation checks preventing invoice amounts exceeding credit limits.

2. Role of CAATs in Detecting Fraud & Management Override:
- Full Population Testing: CAATs allow analysis of 100% of journal entries rather than traditional sampling.
- Anomaly Detection Queries:
  a. Identifying journal entries posted outside normal business hours, on weekends, or on public holidays.
  b. Flagging entries made by unauthorized or high-level users without segregation of duties.
  c. Screening for round sums (e.g. ₹50,00,000) or amounts just below authorization thresholds.
  d. Detecting backdated entries or entries with blank descriptions.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on proper definitions and domains of GITCs vs Application Controls, concrete examples of each, and specific CAATs routines for auditing journal entries.",
      criticalMisses: [
        "GITCs overarching umbrella role supporting application controls.",
        "Testing 100% journal populations for round sums, weekend entries, and threshold gaming."
      ],
      suggestions: [
        "Mention that deficiency in GITCs impairs reliance on automated application controls.",
        "Reference three-way matching as the canonical application control example."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 13: GROUP AUDITS (SA 600)
  // =========================================================================
  {
    id: 'aud_th_13',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    title: 'Principal Auditor vs Component Auditor Responsibilities under SA 600',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / SA 600 Master Guide',
    question: `Explain the duties and rights of the Principal Auditor when using the work of another auditor (Component Auditor) under SA 600. If the component auditor's report contains a qualification, how should the principal auditor deal with it in the group audit report?`,
    keyConcepts: [
      { keyword: 'SA 600', category: 'Standard', description: 'Using the Work of Another Auditor.' },
      { keyword: 'Principal Auditor Rights & Duties', category: 'Provision', description: 'Assess professional competence, coordinate communication, review questionnaire/summary of procedures.' },
      { keyword: 'Division of Responsibility', category: 'Keyword', description: 'Principal auditor can rely on component auditor without repeating audit of component; report indicates division.' },
      { keyword: 'Component Auditor Qualification Impact', category: 'Rule', description: 'Evaluate materiality to the group; modify group report if material to group financial statements.' }
    ],
    shortSuggestedAnswer: `1. Principal Auditor's Duties under SA 600:
- Evaluate Professional Competence: Ensure component auditor has adequate professional competence, independence, and technical capabilities (unless a fellow ICAI member, where competence is presumed).
- Communication & Coordination: Advise the component auditor of the use that will be made of their work, ethical requirements, financial reporting framework, and group reporting deadlines.
- Review Procedures:
  - Issue written audit questionnaires and checklists to the component auditor.
  - Review a written summary of the other auditor's procedures and findings.
  - Discuss audit findings with the component auditor and management of the component where necessary.
- Division of Responsibility: Under Indian SA 600, the principal auditor is entitled to rely on the work of the component auditor and does not conduct detailed testing of the component. The principal auditor's report clearly discloses the division of responsibility by stating the total assets, revenues, and cash flows audited by other auditors.

2. Treatment of Modified Component Report:
- The principal auditor must evaluate the component auditor's modification in relation to the GROUP financial statements.
- Test of Group Materiality:
  - If the matter is MATERIAL to the group financial statements: The principal auditor MUST modify the group audit report (Qualified or Adverse Opinion under SA 705).
  - If the matter is IMMATERIAL in the context of the group financial statements as a whole: The principal auditor need NOT modify the group audit opinion.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on division of responsibility disclosure, communication questionnaires, and the group materiality evaluation rule for component qualifications.",
      criticalMisses: [
        "Division of responsibility statement in the principal auditor's report.",
        "Evaluating component qualification against GROUP financial statements materiality."
      ],
      suggestions: [
        "Contrast Indian SA 600 (division of responsibility) with international ISA 600 (sole responsibility).",
        "Specify that presumption of competence applies to fellow ICAI members."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 15: PSU AUDIT
  // =========================================================================
  {
    id: 'aud_th_15',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    title: 'Role of C&AG, Supplementary Audit u/s 143(6) & Propriety Audit Principles',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / PSU Audit Module',
    question: `Discuss the statutory role of the Comptroller and Auditor General of India (C&AG) in the audit of Government Companies under Section 143(5), 143(6), and 143(7) of the Companies Act, 2013. Explain the concept of 'Propriety Audit' and its key elements.`,
    keyConcepts: [
      { keyword: 'Section 143(5) of Companies Act, 2013', category: 'Section', description: 'C&AG appoints statutory auditor and directs the manner in which accounts shall be audited.' },
      { keyword: 'Section 143(6) Supplementary Audit', category: 'Section', description: 'C&AG has the right to conduct supplementary audit within 60 days of receipt of audit report.' },
      { keyword: '60 Days Supplementary Timeline', category: 'Provision', description: 'Statutory 60-day window for C&AG supplementary audit.' },
      { keyword: 'Section 143(7) Test Audit', category: 'Section', description: 'C&AG can order test audit of the accounts of a government company.' },
      { keyword: 'Propriety Audit Principles', category: 'Keyword', description: 'Audit beyond legal compliance to test public interest, financial prudence, wastefulness, and ethical propriety.' }
    ],
    shortSuggestedAnswer: `1. Role of C&AG in Government Companies (Section 143):
- Appointment & Directions (Section 143(5)): The C&AG appoints the statutory auditor of a Government Company and directs the manner in which accounts are audited. The auditor must submit a copy of the audit report to the C&AG, including directions issued and action taken.
- Supplementary Audit (Section 143(6)): The C&AG has the statutory right to conduct a supplementary audit within 60 days from the date of receipt of the statutory audit report, and comment upon or supplement such report. Any C&AG comments must be placed before the AGM alongside the audit report.
- Test Audit (Section 143(7)): The C&AG may order a test audit of the accounts of the company under the DPC Act, 1971.

2. Concept & Elements of Propriety Audit:
- Concept: Propriety audit goes beyond mere vouchers and legal regularity to assess whether public funds have been spent with wisdom, economy, and financial prudence, ensuring no wastage or personal aggrandizement.
- Key Elements of Propriety:
  a. Prudence: Expenditure should not be prima facie more than the occasion demands.
  b. Authority: Every public officer should exercise the same vigilance as a person of ordinary prudence would exercise over his own money.
  c. Conflict of Interest: Authority should not sanction expenditure directly or indirectly to its own advantage.
  d. Public Interest: Public funds should not be utilized for the benefit of a particular person or community unless supported by recognized policy or law.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on exact citations of Section 143(5), (6) with 60-day limit, and (7), plus the four cannons of financial propriety.",
      criticalMisses: [
        "The 60-day statutory window for C&AG supplementary audit under Section 143(6).",
        "The cannons of financial propriety (ordinary prudence, no personal advantage)."
      ],
      suggestions: [
        "State that C&AG comments are placed before the AGM alongside the audit report.",
        "Clarify that propriety audit is distinctive to PSU/Government expenditure audits."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 17: DUE DILIGENCE, INVESTIGATION & FORENSIC
  // =========================================================================
  {
    id: 'aud_th_17',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    title: 'Audit vs Due Diligence vs Investigation & Forensic Evidence Standards',
    difficulty: 'Mastery',
    marks: 8,
    icaiExamRef: 'ICAI Study Material / Forensic Audit Module',
    question: `Differentiate between Statutory Audit, Due Diligence, and Investigation across: Objective, Scope, Approach, and Period Covered. Explain the three components of the 'Fraud Triangle' and state three key red flags indicative of financial statement manipulation in a forensic audit.`,
    keyConcepts: [
      { keyword: 'Statutory Audit vs Due Diligence vs Investigation', category: 'Provision', description: 'Comprehensive comparison matrix across legal mandate, scope, testing depth.' },
      { keyword: 'Pre-determined Scope vs Specific Mandate', category: 'Keyword', description: 'Audit has statutory scope; Due diligence assesses valuation/risks; Investigation uncovers specific suspect facts.' },
      { keyword: 'Fraud Triangle Components', category: 'Standard', description: 'Incentive/Pressure, Opportunity, Rationalization/Attitude.' },
      { keyword: 'Forensic Red Flags', category: 'Keyword', description: 'Unusual journal entries, off-balance sheet SPVs, complex related party dealings, inventory discrepancies.' }
    ],
    shortSuggestedAnswer: `1. Comparative Matrix:
| Parameter | Statutory Audit | Due Diligence | Investigation |
| :--- | :--- | :--- | :--- |
| Objective | Form independent opinion on true & fair view of FS | Assess financial health, hidden liabilities, and valuation for prospective buyer/investor | Uncover facts regarding suspect fraud, misappropriation, or legal dispute |
| Scope | Determined by statute (Companies Act / SAs) | Agreed by contract based on investor risk focus | Specific terms of reference focused on suspected area |
| Approach | Test-checking, sampling, and materiality threshold | In-depth historical trend analysis & risk review | 100% verification, exhaustive forensic examination, zero materiality |
| Period | Strictly defined financial year (12 months) | Multi-year review (typically 3 to 5 years + projected) | Indefinite; covers entire period of suspect activity |

2. The Fraud Triangle:
  1. Incentive / Pressure: Financial difficulties, pressure to meet market/bank targets, personal greed.
  2. Opportunity: Ineffective internal controls, override by senior management, lack of audit trail.
  3. Rationalization / Attitude: Justifying unethical conduct ("company owes me", "temporary borrowing").

3. Forensic Red Flags:
  - Rapid revenue growth coupled with negative operating cash flows.
  - Complex transactions with related parties having no evident commercial rationale.
  - Significant round-trip transactions just before balance sheet date.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on systematic comparative matrix (Audit vs DD vs Investigation), all 3 elements of the Fraud Triangle, and forensic red flags.",
      criticalMisses: [
        "Comparative dimensions: objective, scope, approach, and period covered.",
        "The three elements of the Fraud Triangle: Pressure, Opportunity, Rationalization."
      ],
      suggestions: [
        "Emphasize that investigation operates without materiality thresholds.",
        "Note that forensic evidence must meet courtroom standards under the Indian Evidence Act."
      ]
    }
  },

  // =========================================================================
  // AUDITING - CHAPTER 18: SDG & ESG ASSURANCE
  // =========================================================================
  {
    id: 'aud_th_18',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    title: 'BRSR Core Attributes, SEBI Mandate & Reasonable vs Limited ESG Assurance',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / SEBI BRSR Circulars',
    question: `Explain SEBI's mandate for Business Responsibility and Sustainability Reporting (BRSR) Core. What are the key ESG attributes covered under BRSR Core? Differentiate between Reasonable Assurance and Limited Assurance in the context of ESG assurance engagements.`,
    keyConcepts: [
      { keyword: 'BRSR Core', category: 'Standard', description: 'SEBI framework for mandatory ESG assurance of top listed companies.' },
      { keyword: 'Top 1000 Listed Entities', category: 'Provision', description: 'Applicability threshold for BRSR reporting under SEBI LODR.' },
      { keyword: '9 Key KPI Attributes', category: 'Rule', description: 'GHG emissions, water usage, waste management, employee gender diversity, safety, payment to MSMEs.' },
      { keyword: 'Reasonable vs Limited ESG Assurance', category: 'Provision', description: 'Reasonable (high assurance, positive opinion) vs Limited (moderate assurance, negative conclusion).' },
      { keyword: 'Assurance Provider Independence', category: 'Rule', description: 'Assurance provider shall not have conflict of interest or sell consulting services to entity.' }
    ],
    shortSuggestedAnswer: `1. SEBI BRSR Core Mandate:
- SEBI introduced BRSR Core as a sub-set of the wider BRSR framework for the top 1000 listed entities by market capitalization.
- Mandates reasonable/limited assurance on BRSR Core KPIs for top listed entities on a phased timeline.
- Key Attributes Covered under BRSR Core:
  a. Greenhouse Gas (GHG) Footprint (Scope 1 and Scope 2 emissions, intensity).
  b. Water Consumption & Discharge (intensity per rupee of turnover).
  c. Waste Generation & Management (hazardous and non-hazardous waste recovery rates).
  d. Energy Consumption (renewable vs non-renewable mix).
  e. Employee Well-being and Safety (fatalities, lost-time injury frequency rate).
  f. Gender Diversity (percentage of women in workforce and Board).
  g. Fair Wages and Gross Wages to MSMEs.
  h. Openness of Business (percentage of procurement from MSMEs, tier-2 suppliers).

2. Reasonable vs Limited ESG Assurance:
- Limited Assurance:
  - Procedures: Primarily inquiries, analytical reviews, and testing of high-level calculation methodologies.
  - Conclusion: Expressed in Negative Form ("Nothing has come to our attention that causes us to believe...").
  - Lower level of confidence; narrower scope of evidence collection.
- Reasonable Assurance:
  - Procedures: Extensive verification, walkthroughs of sensor/metering data, site visits, testing of internal controls over sustainability reporting.
  - Conclusion: Expressed in Positive Form ("In our opinion, the BRSR Core disclosures are prepared, in all material respects...").
  - High level of assurance, comparable to a financial statement audit.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on SEBI BRSR Core scope (top listed entities), coverage of core KPIs (GHG, water, MSME payments, diversity), and positive vs negative assurance differentiation.",
      criticalMisses: [
        "BRSR Core specific KPIs (GHG footprint, water intensity, MSME payments).",
        "Positive (reasonable) vs Negative (limited) assurance conclusion forms."
      ],
      suggestions: [
        "Cite SSAE 3000 as the assurance standard framework for non-financial assurance.",
        "Mention that the assurance provider must ensure strict independence from consulting services."
      ]
    }
  },

  // =========================================================================
  // DIRECT TAX - CAPITAL GAINS
  // =========================================================================
  {
    id: 'dt_th_03',
    subjectId: 'DT',
    chapterName: 'Capital Gains [Chapter 4]',
    title: 'Stamp Duty Valuation u/s 50C (110% Tolerance Band) & Exemption u/s 54EC',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'ICAI Study Material / RTP Nov 2024',
    question: `Explain the operation of Section 50C of the Income-tax Act, 1961 regarding transfer of land or building or both. Discuss the 110% safe harbour tolerance band and the reference to Departmental Valuation Officer (DVO). Outline the conditions for claiming exemption under Section 54EC.`,
    keyConcepts: [
      { keyword: 'Section 50C', category: 'Section', description: 'Deemed full value of consideration in case of land or building.' },
      { keyword: '110% Safe Harbour Tolerance Band', category: 'Rule', description: 'Stamp duty value adopted only if it exceeds 110% of declared consideration.' },
      { keyword: 'Agreement Date vs Registration Date SDV', category: 'Provision', description: 'Agreement date SDV taken if consideration paid by banking channel before agreement date.' },
      { keyword: 'Reference to DVO u/s 50C(2)', category: 'Provision', description: 'AO may refer to DVO if assessee claims SDV exceeds fair market value and has not disputed SDV in appeal.' },
      { keyword: 'Section 54EC Conditions & ₹50 Lakhs Cap', category: 'Section', description: 'Investment in specified bonds (NHAI/REC/PFC/IRFC) within 6 months; max cap ₹50 Lakhs; lock-in 5 years.' }
    ],
    shortSuggestedAnswer: `1. Section 50C Provisions (Land or Building):
- Deemed Consideration: Where consideration received or accruing on transfer of land/building is less than the Stamp Duty Value (SDV) assessed or assessable by state stamp authority, the SDV is deemed to be the Full Value of Consideration (FVOC).
- 110% Safe Harbour Tolerance Band:
  - If SDV does NOT exceed 110% of actual consideration, the actual declared consideration is accepted as the FVOC.
- Date of Agreement vs Date of Registration:
  - SDV on date of agreement can be adopted IF amount of consideration (or part) was received by way of account payee cheque, bank draft, ECS, or prescribed electronic mode on or before the date of agreement.
- Reference to DVO (Section 50C(2)):
  - Assessee can object before AO that SDV exceeds FMV, provided SDV has not been disputed in any appeal/revision before stamp authority.
  - If DVO value < SDV: DVO value becomes deemed FVOC.
  - If DVO value > SDV: SDV remains deemed FVOC (DVO cannot enhance consideration).

2. Section 54EC Exemption:
- Asset Transferred: Long-term capital asset being land or building or both.
- Eligible Investment: Bonds of NHAI, REC, PFC, or IRFC redeemable after 5 years.
- Time Limit: Within 6 months from the date of transfer.
- Maximum Cap: Maximum deduction is ₹50 Lakhs in a financial year (cumulative cap across years for same transfer).
- Lock-in: 5 years. Transfer or loan against bonds triggers withdrawal of exemption.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on 110% safe harbour calculation, electronic payment on agreement date rule, DVO cap rule, and 54EC 6-month/₹50L/5-year parameters.",
      criticalMisses: [
        "110% safe harbour band under Section 50C.",
        "DVO valuation cannot exceed Stamp Duty Value.",
        "Section 54EC ₹50 Lakhs ceiling and 5-year lock-in."
      ],
      suggestions: [
        "State that 54EC applies exclusively to land or building (not other LTCAs).",
        "Specify that electronic payment before agreement date is mandatory to lock agreement date SDV."
      ]
    }
  },

  // =========================================================================
  // INDIRECT TAX - SUPPLY UNDER GST
  // =========================================================================
  {
    id: 'idt_th_04',
    subjectId: 'IDT',
    chapterName: 'Supply under GST',
    title: 'Schedule I Transactions without Consideration & Employer-Employee Gifts Threshold',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'ICAI Study Material / Section 7(1)(c)',
    question: `Enumerate the activities specified in Schedule I of the CGST Act, 2017 that are treated as 'Supply' even when made without consideration under Section 7(1)(c). State the specific monetary threshold and conditions governing gifts by an employer to an employee.`,
    keyConcepts: [
      { keyword: 'Section 7(1)(c) of CGST Act', category: 'Section', description: 'Activities specified in Schedule I treated as supply without consideration.' },
      { keyword: 'Schedule I Entries', category: 'Schedule', description: 'Permanent disposal of business assets on which ITC availed, supply between related/distinct persons, principal-agent, import of services.' },
      { keyword: 'Permanent Disposal of Business Assets with ITC', category: 'Provision', description: 'Mandatory condition that ITC must have been availed on such assets.' },
      { keyword: 'Related Persons / Distinct Persons', category: 'Provision', description: 'Supply between distinct persons (Section 25) in course or furtherance of business.' },
      { keyword: '₹50,000 Employer-Employee Gift Exemption', category: 'Rule', description: 'Gifts not exceeding ₹50,000 in value in a financial year by employer to employee not treated as supply.' }
    ],
    shortSuggestedAnswer: `1. Schedule I Activities Treated as Supply without Consideration:
- Para 1: Permanent transfer or disposal of business assets where input tax credit has been availed on such assets. (If no ITC was availed, transfer without consideration is NOT a supply).
- Para 2: Supply of goods or services or both between related persons or between distinct persons (as specified in Section 25(4) or 25(5)), when made in the course or furtherance of business.
  - Exception: Gifts not exceeding ₹50,000 in value in a financial year by an employer to an employee shall NOT be treated as supply.
  - If gift value exceeds ₹50,000, the ENTIRE value becomes taxable as supply.
- Para 3: Supply of goods:
  a. By a principal to his agent where agent undertakes to supply goods on behalf of principal; or
  b. By an agent to his principal where agent undertakes to receive goods on behalf of principal.
- Para 4: Import of services by a person from a related person or from any of his other establishments outside India, in the course or furtherance of business.

2. Employer-Employee Gifts Threshold Summary:
- Threshold: ₹50,000 per employee per financial year.
- Gifts up to ₹50,000: Exempt / Not treated as supply.
- Gifts exceeding ₹50,000: Full amount subject to GST.
- Services provided in terms of employment contract (perquisites/salary) are covered under Schedule III (neither goods nor services).`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluated on listing all 4 paras of Schedule I, the condition of ITC availment for Para 1, and the ₹50,000 per employee per FY gift threshold.",
      criticalMisses: [
        "ITC availment condition for permanent transfer of business assets.",
        "The ₹50,000 limit for employer-to-employee gifts.",
        "Distinction between employment contract perquisites (Schedule III) and gifts (Schedule I)."
      ],
      suggestions: [
        "State that distinct persons arise under Section 25 due to separate GSTIN registrations under the same PAN.",
        "Mention that gifts > ₹50,000 are taxed on the entire value, not merely the excess."
      ]
    }
  }
];

const ALL_RAW_QUESTIONS: TheoryQuestion[] = [
  ...BASE_THEORY_QUESTIONS,
  ...AUDIT_PDF_THEORY_QUESTIONS,
  ...THEORY_QUESTIONS_CH9_10,
  ...THEORY_QUESTIONS_CH12_18,
  ...AUDIT_REPORT_THEORY_QUESTIONS,
  ...AUDIT_ETHICS_THEORY_QUESTIONS,
  ...AUDIT_SPECIALIZED_THEORY_QUESTIONS,
  ...AUDIT_STANDARDS_RISK_THEORY_QUESTIONS,
  ...AUDIT_STANDARDS_FULL_QUESTIONS,
  ...AUDIT_SPECIALIZED_FULL_QUESTIONS,
  ...AUDIT_ETHICS_FULL_QUESTIONS,
  ...FOUNDATION_INTER_THEORY_QUESTIONS
];

// Strict deduplication by question ID and title
export const READY_THEORY_QUESTIONS: TheoryQuestion[] = Array.from(
  new Map(ALL_RAW_QUESTIONS.map(q => [q.id, q])).values()
);

// Helper functions for retrieval and filtering
export function getTheoryQuestionsBySubject(subjectId: SubjectId): TheoryQuestion[] {
  return READY_THEORY_QUESTIONS.filter(q => q.subjectId === subjectId);
}

export function getTheoryQuestionsByChapter(subjectId: SubjectId, chapterName: string): TheoryQuestion[] {
  if (chapterName === 'All' || !chapterName) {
    return getTheoryQuestionsBySubject(subjectId);
  }
  return READY_THEORY_QUESTIONS.filter(
    q => q.subjectId === subjectId && q.chapterName.toLowerCase().includes(chapterName.toLowerCase())
  );
}

export function getTheoryQuestionById(id: string): TheoryQuestion | undefined {
  return READY_THEORY_QUESTIONS.find(q => q.id === id);
}

/**
 * Offline / Instant Client-Side Statutory Evaluator
 * Tests the student's submitted text against key concepts and keywords with fuzzy matching,
 * producing realistic ICAI-standard scoring and targeted statutory commentary.
 */
export function evaluateAnswerOffline(question: TheoryQuestion, userAnswer: string): EvaluationResult {
  const normalizedAnswer = userAnswer.toLowerCase();
  
  let matchCount = 0;
  const matchedConcepts: MatchedConcept[] = question.keyConcepts.map(concept => {
    // Break keyword into key search tokens
    const rawTokens = concept.keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
    
    // Check if whole keyword or significant subset of tokens are present
    const cleanKeyword = concept.keyword.toLowerCase();
    const hasDirectMatch = normalizedAnswer.includes(cleanKeyword);
    const tokenMatches = rawTokens.filter(token => normalizedAnswer.includes(token));
    const tokenRatio = rawTokens.length > 0 ? tokenMatches.length / rawTokens.length : 0;

    const matched = hasDirectMatch || tokenRatio >= 0.6;
    if (matched) matchCount++;

    return {
      keyword: concept.keyword,
      category: concept.category,
      matched,
      comment: matched
        ? `Accurately identified and captured the core statutory principle for ${concept.keyword}.`
        : `Omitted or insufficiently developed ${concept.keyword} (${concept.description}).`
    };
  });

  const totalConcepts = question.keyConcepts.length;
  // Compute efficiency score
  const rawRatio = totalConcepts > 0 ? matchCount / totalConcepts : 0;
  // Scale between 20 and 100 based on length + matches
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  const lengthFactor = Math.min(1, wordCount / 40);
  const efficiencyScore = Math.round(rawRatio * 85 * lengthFactor + (matchCount > 0 ? 15 : 0));

  // Determine critical misses
  const missedConcepts = matchedConcepts.filter(m => !m.matched);
  const criticalMisses = missedConcepts.length > 0
    ? missedConcepts.slice(0, 3).map(m => `Omission of ${m.category} '${m.keyword}': Ensure you cite and analyze this statutory coordinate.`)
    : [];

  // Suggestions
  const suggestions = missedConcepts.length > 0
    ? [
        `Anchor your answer with specific statutory citations: ${missedConcepts.map(m => m.keyword).join(', ')}.`,
        "Structure answers into: (1) Relevant Legal Provision, (2) Case Facts Analysis, and (3) Clear Statutory Conclusion.",
        "Under ICAI evaluation, examiners award marks for statutory keywords, sub-sections, and numerical thresholds."
      ]
    : [
        "Outstanding statutory accuracy! All core coordinates, sections, and thresholds were captured.",
        "To maximize presentation marks, highlight key phrases in your concluding paragraph.",
        "Ensure procedural timelines and filing forms (e.g. Form ADT-4 / e-Way bill validity) are clearly numbered."
      ];

  const efficiencyReasoning = efficiencyScore >= 75
    ? `Strong statutory retention demonstrated. Your answer accurately identified ${matchCount} out of ${totalConcepts} required key concepts, provisions, and legal coordinates. Your legal reasoning directly addresses the core ICAI exam coordinates.`
    : efficiencyScore >= 45
    ? `Moderate statutory retention. You captured ${matchCount} out of ${totalConcepts} core concepts, but missed key statutory references and technical phrasing necessary for high marks in CA Final examinations.`
    : `Preliminary understanding detected (${matchCount} of ${totalConcepts} concepts found). The answer lacks essential statutory citations, numerical thresholds, or procedural rules required by the ICAI evaluation scheme. Review the suggested answer below to reinforce your memory.`;

  return {
    efficiencyScore,
    matchedConcepts,
    efficiencyReasoning,
    criticalMisses: criticalMisses.length > 0 ? criticalMisses : question.defaultRemarks.criticalMisses,
    suggestions: suggestions.length > 0 ? suggestions : question.defaultRemarks.suggestions
  };
}
