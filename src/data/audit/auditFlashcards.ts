/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL PAPER 3: ADVANCED AUDITING, ASSURANCE AND PROFESSIONAL ETHICS
 * COMPREHENSIVE HIGH-YIELD FLASHCARDS FOR ALL 19 CHAPTERS
 */

import { Flashcard } from '../flashcards';
import { AUDIT_FLASHCARDS_PART1 } from './auditFlashcardsPart1';
import { AUDIT_FLASHCARDS_PART2 } from './auditFlashcardsPart2';
import { AUDIT_FLASHCARDS_PART3 } from './auditFlashcardsPart3';
import { AUDIT_FLASHCARDS_PART4 } from './auditFlashcardsPart4';
import { AUDIT_FLASHCARDS_PART5 } from './auditFlashcardsPart5';

const BASE_AUDIT_FLASHCARDS: Flashcard[] = [
  // =========================================================================
  // CHAPTER 1: QUALITY CONTROL (SQC 1, SA 220)
  // =========================================================================
  {
    id: 'aud_fc_ch1_01',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 - Six Elements of Quality Control System',
    examImportance: 'Critical',
    question: 'What are the six core elements of a firm’s system of quality control under SQC 1?',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <p class="font-bold text-amber-400">Six Core Elements of SQC 1:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-white block">1. Leadership Responsibilities</span>
            CEO/Managing Partners assume ultimate responsibility; promote quality-oriented culture over commercial profit considerations.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-white block">2. Ethical Requirements</span>
            Integrity, Objectivity, Professional Competence & Due Care, Confidentiality, Professional Behaviour; annual independence sign-offs.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-white block">3. Acceptance & Continuance</span>
            Client integrity evaluated; firm capability, competence, time and resources verified; prior auditor communicated u/Cl 8.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-white block">4. Human Resources</span>
            Capabilities, competence, commitment to ethical principles; recruitment, career development, CPD, performance appraisal.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-white block">5. Engagement Performance</span>
            Consistency in engagement quality; supervision, direction, review; consultation protocols; difference of opinion resolution.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-white block">6. Monitoring</span>
            Ongoing evaluation of quality control system; periodic inspection of completed engagements (at least 1 per partner cyclically).
          </div>
        </div>
      </div>
    `,
    summaryClean: "SQC 1 establishes 6 core elements: Leadership, Ethical requirements, Acceptance/Continuance, Human resources, Engagement performance, and Monitoring."
  },
  {
    id: 'aud_fc_ch1_02',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 & SA 220 - Engagement Quality Control Review (EQCR)',
    examImportance: 'Critical',
    question: 'What are the statutory mandates and cooling-off rules for Engagement Quality Control Reviewer (EQCR)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-sky-400">EQCR Statutory Framework:</p>
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li><span class="font-bold text-white">Mandatory Scope:</span> Mandatory for all audits of financial statements of <span class="text-amber-400 font-bold">listed entities</span> and other high-risk engagements designated by the firm.</li>
          <li><span class="font-bold text-white">Timing of Report:</span> Audit report <span class="text-rose-400 font-bold">cannot be signed/dated</span> until the EQCR is fully completed.</li>
          <li><span class="font-bold text-white">Objectivity Safeguard:</span> Reviewer must not participate in performance of engagement, make decisions for engagement team, or be subjected to other influences.</li>
          <li><span class="font-bold text-white">Cooling-off Period:</span> An Engagement Partner must observe a mandatory cooling-off period of at least <span class="text-emerald-400 font-bold">2 years</span> before acting as EQCR for the same client.</li>
          <li><span class="font-bold text-white">Resolution of Difference:</span> Report released only AFTER difference of opinion between EP and EQCR is resolved.</li>
        </ul>
      </div>
    `,
    summaryClean: "EQCR is mandatory for listed audits; report cannot be dated before review completion; requires minimum 2-year cooling-off for EP becoming EQCR."
  },
  {
    id: 'aud_fc_ch1_03',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SA 230 & SQC 1 - Documentation Assembly & Retention',
    examImportance: 'Critical',
    question: 'What are the assembly deadlines and retention mandates for audit workpapers under SA 230 and SQC 1?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-3 text-[11px]">
          <div class="p-3 border border-slate-800 bg-slate-900/50 rounded-xl">
            <span class="text-amber-400 font-bold block mb-1">⏱️ Assembly Period (SQC 1):</span>
            Complete the assembly of the final audit file on a timely basis, ordinarily not more than <span class="text-white font-bold underline">60 days</span> after the date of the auditor's report.
          </div>
          <div class="p-3 border border-slate-800 bg-slate-900/50 rounded-xl">
            <span class="text-emerald-400 font-bold block mb-1">📁 Retention Period (SQC 1):</span>
            Retain engagement documentation for a period sufficient to meet the needs of the firm, but <span class="text-white font-bold underline">not shorter than 7 years</span> from the date of the auditor's report.
          </div>
        </div>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
          <strong class="text-rose-400">Post-Assembly Modifications:</strong> No deletion or discarding of documentation of any nature before expiration of retention period. If new documentation added, document specific reasons, when and by whom made and reviewed.
        </div>
      </div>
    `,
    summaryClean: "Final audit file must be assembled within 60 days of report date and safely retained for at least 7 years without deletion."
  },

  // =========================================================================
  // CHAPTER 2: GENERAL AUDITING PRINCIPLES AND AUDITORS RESPONSIBILITIES
  // =========================================================================
  {
    id: 'aud_fc_ch2_01',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 200 - Overall Objectives of the Independent Auditor',
    examImportance: 'Critical',
    question: 'Define Audit Risk and explain the relationship between its constituent components under SA 200.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-mono text-center bg-slate-900 p-2 rounded border border-slate-800 text-amber-400 font-bold text-xs">
          Audit Risk = Risk of Material Misstatement (Inherent Risk &times; Control Risk) &times; Detection Risk
        </p>
        <div class="space-y-1.5 text-[11px] bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
          <div>• <span class="font-bold text-white">Inherent Risk (IR):</span> Susceptibility of an assertion to misstatement that could be material before consideration of any related controls.</div>
          <div>• <span class="font-bold text-white">Control Risk (CR):</span> Risk that a misstatement will not be prevented, or detected and corrected on timely basis by internal controls. (IR &amp; CR belong to entity).</div>
          <div>• <span class="font-bold text-emerald-400">Detection Risk (DR):</span> Risk that procedures performed by auditor will not detect a misstatement that exists. (Auditor controls DR; inverse relationship with RMM).</div>
        </div>
      </div>
    `,
    summaryClean: "Audit Risk = RMM (Inherent Risk × Control Risk) × Detection Risk. Auditor controls Detection Risk inversely to assessed RMM."
  },
  {
    id: 'aud_fc_ch2_02',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 210 - Preconditions for an Audit & Terms Agreement',
    examImportance: 'High',
    question: 'What are the two statutory preconditions that the auditor must establish before accepting an audit under SA 210?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-indigo-400">Two Preconditions for an Audit (SA 210):</p>
        <div class="space-y-1.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <div class="p-2 bg-slate-950 rounded border border-slate-850">
            <span class="font-bold text-amber-400 block mb-0.5">Precondition 1: Acceptable FRF</span>
            Determine whether the financial reporting framework to be applied in preparation of the financial statements is acceptable.
          </div>
          <div class="p-2 bg-slate-950 rounded border border-slate-850">
            <span class="font-bold text-emerald-400 block mb-0.5">Precondition 2: Management Acknowledgement of Premise</span>
            Obtain written agreement that management acknowledges and understands its responsibility for:
            <ul class="list-disc pl-4 mt-1 space-y-0.5 text-slate-350">
              <li>Preparation of financial statements in accordance with applicable FRF.</li>
              <li>Design, implementation and maintenance of necessary internal controls.</li>
              <li>Providing unrestricted access to all info, additional requests &amp; persons within entity.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    summaryClean: "SA 210 preconditions: Acceptable financial reporting framework + written management acknowledgement of responsibility for FS preparation, internal controls, and unrestricted access."
  },
  {
    id: 'aud_fc_ch2_03',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 240 & Section 143(12) - Fraud Reporting Duties',
    examImportance: 'Critical',
    question: 'Summarize the fraud reporting procedure and statutory deadlines under Section 143(12) of Companies Act, 2013.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1.5">
          <p class="font-bold text-rose-400">Fraud &ge; ₹1 Crore (Report to Central Govt - MCA):</p>
          <p>• <span class="font-bold text-white">Within 2 Days:</span> Report matter to Board / Audit Committee seeking reply within 45 days.</p>
          <p>• <span class="font-bold text-white">Within 15 Days:</span> On receipt of reply (or expiry of 45 days), forward report in <span class="text-amber-400 font-bold">Form ADT-4</span> to MCA with management response.</p>
          <div class="border-t border-slate-800 pt-1 text-slate-400">
            • <span class="font-bold text-sky-400">Fraud &lt; ₹1 Crore:</span> Report only to Board/Audit Committee within 2 days; Board discloses particulars in Board's Report u/s 134(3)(ca).
          </div>
        </div>
      </div>
    `,
    summaryClean: "Frauds ≥ ₹1 Cr: Report to Board within 2 days (45-day reply window), then to Central Govt in Form ADT-4 within 15 days."
  },
  {
    id: 'aud_fc_ch2_04',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 299 - Joint Audit of Financial Statements',
    examImportance: 'High',
    question: 'How are responsibilities and liabilities divided between joint auditors under SA 299?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1.5 border border-slate-800">Area of Work</th>
              <th class="p-1.5 border border-slate-800">Nature of Liability</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-amber-400">Divided Work (Identified components)</td>
              <td class="p-1.5 border border-slate-800">Each joint auditor is <span class="text-white font-bold">severally (individually) responsible</span> for their own allocated work.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-emerald-400">Undivided Work, Compliance with Laws, Common Decisions</td>
              <td class="p-1.5 border border-slate-800">All joint auditors are <span class="text-white font-bold">jointly and severally responsible</span>.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-sky-400">Disagreement on Opinion</td>
              <td class="p-1.5 border border-slate-800">No joint auditor is bound by majority; separate report can be issued expressing dissenting view with cross-reference.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Joint auditors are severally liable for allocated work, but jointly and severally liable for undivided work, common decisions, and disclosure compliance."
  },

  // =========================================================================
  // CHAPTER 3: AUDIT PLANNING, STRATEGY AND EXECUTION
  // =========================================================================
  {
    id: 'aud_fc_ch3_01',
    subjectId: 'Audit',
    category: 'Audit Planning, Strategy and Execution',
    statutoryRef: 'SA 300 - Planning an Audit of Financial Statements',
    examImportance: 'High',
    question: 'What is the distinction between Overall Audit Strategy and Audit Plan under SA 300?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-amber-400 block mb-1">Overall Audit Strategy:</span>
            Sets the <span class="text-white font-bold">Scope, Timing, and Direction</span> of the audit; guides development of detailed audit plan:
            <ul class="list-disc pl-3 mt-1 space-y-0.5 text-slate-350">
              <li>Characteristics of engagement defining scope.</li>
              <li>Reporting objectives &amp; timing of communications.</li>
              <li>Significant factors &amp; preliminary engagement activities.</li>
              <li>Nature, timing and extent of resources deployed.</li>
            </ul>
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-sky-400 block mb-1">Audit Plan (More Detailed):</span>
            Includes the <span class="text-white font-bold">Nature, Timing and Extent (NTE)</span> of:
            <ul class="list-disc pl-3 mt-1 space-y-0.5 text-slate-350">
              <li>Risk assessment procedures under SA 315.</li>
              <li>Further audit procedures (FAP) under SA 330 at assertion level.</li>
              <li>Other planned audit procedures to comply with SAs.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    summaryClean: "Audit Strategy sets the broad scope, timing, and direction; Audit Plan translates strategy into specific NTE of risk assessment and further audit procedures."
  },
  {
    id: 'aud_fc_ch3_02',
    subjectId: 'Audit',
    category: 'Audit Planning, Strategy and Execution',
    statutoryRef: 'SA 315 & SA 330 - Risk Assessment & Responses to Assessed Risks',
    examImportance: 'Critical',
    question: 'What are the five components of Internal Control under SA 315, and how does the auditor respond under SA 330?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-violet-400">Five Components of Internal Control (COSO/SA 315):</p>
        <div class="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
          <div>1. <span class="font-bold text-white">Control Environment</span></div>
          <div>2. <span class="font-bold text-white">Entity's Risk Assessment</span></div>
          <div>3. <span class="font-bold text-white">Information System &amp; Comms</span></div>
          <div>4. <span class="font-bold text-white">Control Activities</span></div>
          <div class="col-span-2">5. <span class="font-bold text-white">Monitoring of Controls</span></div>
        </div>
        <p class="font-bold text-emerald-400 mt-1">SA 330 Dual Response Framework:</p>
        <p class="text-[11px] text-slate-300">
          • <span class="font-bold text-white">Financial Statement Level:</span> Emphasize professional skepticism, assign experienced staff, incorporate unpredictability.<br/>
          • <span class="font-bold text-white">Assertion Level:</span> Perform Tests of Controls (if expecting reliance or substantive procedures alone insufficient) and mandatory substantive procedures for each material class of transactions.
        </p>
      </div>
    `,
    summaryClean: "SA 315 identifies 5 internal control components (CRIME). SA 330 responds at FS level (overall approaches) and assertion level (tests of controls & substantive procedures)."
  },

  // =========================================================================
  // CHAPTER 4: MATERIALITY, RISK ASSESSMENT AND INTERNAL CONTROL
  // =========================================================================
  {
    id: 'aud_fc_ch4_01',
    subjectId: 'Audit',
    category: 'Materiality, Risk Assessment and Internal Control',
    statutoryRef: 'SA 320 & SA 450 - Materiality and Evaluation of Misstatements',
    examImportance: 'Critical',
    question: 'Define Overall Materiality, Performance Materiality, and the Trivial Threshold under SA 320 & 450.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div>• <span class="font-bold text-amber-400">Overall Materiality (SA 320):</span> Magnitude of omission/misstatement that could reasonably influence economic decisions of users taken on basis of FS. Determined using benchmark (e.g. 5% of PBT, 1-2% of Turnover/Total Assets).</div>
          <div>• <span class="font-bold text-emerald-400">Performance Materiality (PM):</span> Amount set below overall materiality to reduce to an appropriately low level the probability that aggregate uncorrected and undetected misstatements exceed overall materiality.</div>
          <div>• <span class="font-bold text-sky-400">Clearly Trivial Threshold (SA 450):</span> Matters that are inconsequential both individually and in aggregate, whether judged by size, nature or circumstances. Auditor does not accumulate clearly trivial amounts.</div>
        </div>
      </div>
    `,
    summaryClean: "Overall Materiality influences economic decisions; Performance Materiality provides an audit safety buffer; clearly trivial items are wholly inconsequential."
  },
  {
    id: 'aud_fc_ch4_02',
    subjectId: 'Audit',
    category: 'Materiality, Risk Assessment and Internal Control',
    statutoryRef: 'Section 143(3)(i) - Internal Financial Controls Reporting (IFCoFR)',
    examImportance: 'Critical',
    question: 'Which companies are exempt from auditor reporting on Internal Financial Controls under Section 143(3)(i)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">MCA Exemption Notification for Private Companies:</p>
        <p class="text-[11px] text-slate-300">Reporting u/s 143(3)(i) does NOT apply to a private company which:</p>
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li>Is a <span class="font-bold text-white">One Person Company (OPC)</span> or a <span class="font-bold text-white">Small Company</span>; OR</li>
          <li>Has turnover &lt; <span class="font-bold text-amber-400">₹50 Crores</span> as per latest audited FS <span class="underline font-bold text-white">AND</span> aggregate borrowings from banks/financial institutions/bodies corporate &lt; <span class="font-bold text-amber-400">₹25 Crores</span> at any point of time during the financial year.</li>
        </ul>
        <span class="text-[10px] text-emerald-400 block font-bold">Condition: Exemption is available only if company has not committed default in filing Form AOC-4 or MGT-7 u/s 137 or 92.</span>
      </div>
    `,
    summaryClean: "Private companies are exempt from IFCoFR reporting if they are OPC/Small company OR have Turnover < ₹50 Cr and Borrowings < ₹25 Cr (with no filing defaults)."
  },

  // =========================================================================
  // CHAPTER 5: AUDIT EVIDENCE
  // =========================================================================
  {
    id: 'aud_fc_ch5_01',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 505 - External Confirmations',
    examImportance: 'Critical',
    question: 'Contrast Positive vs Negative External Confirmation requests, and state conditions for Negative Confirmations.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-emerald-400 block">Positive Confirmation:</span>
            Third party responds directly indicating whether they agree or disagree, or providing requested information (provides persuasive evidence).
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-rose-400 block">Negative Confirmation:</span>
            Third party responds <span class="underline font-bold">ONLY if they disagree</span> with information provided in request (less persuasive; failure to respond is not definitive proof).
          </div>
        </div>
        <p class="font-bold text-amber-400 pt-1 text-[11px]">4 Cumulative Conditions for Negative Confirmations (SA 505):</p>
        <ul class="list-decimal list-inside space-y-0.5 text-[10px] text-slate-350 bg-slate-950 p-2 rounded border border-slate-800">
          <li>Auditor assessed RMM as low and obtained audit evidence on control operating effectiveness.</li>
          <li>Population comprises a large number of small, homogeneous account balances/transactions.</li>
          <li>A very low exception rate is expected.</li>
          <li>Auditor is not aware of circumstances that would cause recipients to disregard requests.</li>
        </ul>
      </div>
    `,
    summaryClean: "Positive requests ask for reply in all cases; negative requests ask for reply only if disagreeing, permitted only when RMM is low and 4 cumulative conditions are satisfied."
  },
  {
    id: 'aud_fc_ch5_02',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 530 - Audit Sampling & Sample Selection Methods',
    examImportance: 'High',
    question: 'Differentiate between Sampling Risk vs Non-Sampling Risk, and define Anomaly under SA 530.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div>• <span class="font-bold text-amber-400">Sampling Risk:</span> Risk that the auditor's conclusion based on a sample may be different from the conclusion if the entire population were subjected to the same audit procedure (Type I: Risk of under-reliance/incorrect rejection; Type II: Risk of over-reliance/incorrect acceptance affecting audit effectiveness).</div>
          <div>• <span class="font-bold text-sky-400">Non-Sampling Risk:</span> Risk that auditor reaches an erroneous conclusion for any reason not related to sample size (e.g. use of inappropriate procedures, misinterpretation of audit evidence, failure to recognize misstatement).</div>
          <div>• <span class="font-bold text-emerald-400">Anomaly:</span> A misstatement or deviation that is demonstrably not representative of misstatements or deviations in a population. Requires high degree of certainty that matter is not representative.</div>
        </div>
      </div>
    `,
    summaryClean: "Sampling risk arises from testing less than 100% of population; non-sampling risk stems from human error or flawed procedures; anomaly is a non-representative deviation."
  },
  {
    id: 'aud_fc_ch5_03',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 550 - Related Parties',
    examImportance: 'Critical',
    question: 'What procedures must the auditor perform upon identifying an undisclosed related party transaction under SA 550?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Immediate Auditor Actions (SA 550 para 22):</p>
        <ol class="list-decimal list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li>Promptly <span class="text-white font-bold">communicate</span> the relevant information to the other members of the engagement team.</li>
          <li>Request management to identify <span class="text-white font-bold">all transactions</span> with the newly identified related parties for further evaluation.</li>
          <li>Inquire as to why the entity’s controls failed to identify or disclose the related party relationships or transactions.</li>
          <li>Perform appropriate <span class="text-white font-bold">substantive audit procedures</span> relating to such newly identified related parties.</li>
          <li>Reconsider the risk that other undisclosed related parties or significant transactions may exist, and re-evaluate fraud risk under SA 240.</li>
        </ol>
      </div>
    `,
    summaryClean: "Undisclosed related parties require instant team communication, comprehensive identification request from management, control failure inquiry, substantive testing, and fraud risk reconsideration."
  },

  // =========================================================================
  // CHAPTER 6: COMPLETION AND REVIEW
  // =========================================================================
  {
    id: 'aud_fc_ch6_01',
    subjectId: 'Audit',
    category: 'Completion and Review',
    statutoryRef: 'SA 560 & Ind AS 10 - Subsequent Events (Type 1 vs Type 2)',
    examImportance: 'Critical',
    question: 'Distinguish between Adjusting (Type 1) and Non-Adjusting (Type 2) Subsequent Events, and auditor duty across periods.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-amber-400 block">Type 1: Adjusting Events</span>
            Events that provide evidence of conditions that <span class="underline font-bold text-white">existed at balance sheet date</span>.<br/>
            <span class="text-emerald-400 font-bold">Treatment:</span> Adjust amounts in Financial Statements (e.g. customer bankruptcy confirmed post-year-end).
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-sky-400 block">Type 2: Non-Adjusting Events</span>
            Events that are indicative of conditions that <span class="underline font-bold text-white">arose after balance sheet date</span>.<br/>
            <span class="text-amber-400 font-bold">Treatment:</span> Disclose in Notes to FS; do not adjust figures (e.g. major fire loss post-year-end).
          </div>
        </div>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
          <strong class="text-white">Auditor Responsibility Periods:</strong><br/>
          • Up to Report Date: Active duty to perform specific procedures to identify events.<br/>
          • Between Report Date &amp; FS Issue Date: Passive duty; if auditor becomes aware of facts, discuss with management; amend report if needed.
        </div>
      </div>
    `,
    summaryClean: "Type 1 (existing conditions) requires balance sheet adjustment; Type 2 (post-year conditions) requires note disclosure. Active auditor search duty ceases on audit report date."
  },
  {
    id: 'aud_fc_ch6_02',
    subjectId: 'Audit',
    category: 'Completion and Review',
    statutoryRef: 'SA 580 - Written Representations',
    examImportance: 'High',
    question: 'What must the auditor do if management refuses to provide requested Written Representations under SA 580?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Sequential Actions on Management Refusal (SA 580):</p>
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li>Discuss the matter with management and re-evaluate management’s integrity.</li>
          <li>Evaluate the effect on the reliability of other representations and audit evidence in general.</li>
          <li>Determine possible effect on the opinion in the auditor's report.</li>
          <li><span class="text-rose-400 font-bold">Mandatory Disclaimer:</span> If management refuses to provide written representations regarding its basic responsibility for FS preparation and design/maintenance of internal control, the auditor <span class="text-white font-bold underline">SHALL DISCLAIM AN OPINION</span> on the financial statements.</li>
        </ul>
        <span class="text-[10px] text-amber-400 block font-bold">Note: Written representations are supporting audit evidence; they NEVER substitute other necessary audit procedures.</span>
      </div>
    `,
    summaryClean: "Written representations cannot replace other audit evidence. Refusal to provide basic representations regarding responsibility for FS mandates a Disclaimer of Opinion."
  },

  // =========================================================================
  // CHAPTER 7: REPORTING
  // =========================================================================
  {
    id: 'aud_fc_ch7_01',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'SA 701 - Key Audit Matters (KAM)',
    examImportance: 'Critical',
    question: 'What is the applicability of SA 701 and the decision funnel for selecting Key Audit Matters?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg text-[11px] space-y-1">
          <p><span class="font-bold text-emerald-400">Applicability:</span> Mandatory for audits of complete sets of general purpose financial statements of <span class="text-white font-bold">listed entities</span>, or when required by law/regulation.</p>
          <div class="border-t border-slate-800 pt-1">
            <p class="font-bold text-amber-400">Three-Step Selection Funnel:</p>
            <p>1. Matters communicated with Those Charged With Governance (TCWG).</p>
            <p>2. Matters that required significant auditor attention in performing the audit.</p>
            <p>3. Those matters that were of <span class="text-white font-bold underline">most significance</span> in the audit of the financial statements of current period = <span class="text-amber-400 font-bold">KAM</span>.</p>
          </div>
          <p class="text-rose-400 font-bold text-[10px] pt-1">Prohibition: KAM can NEVER be a substitute for modifying an opinion under SA 705, or for Going Concern reporting under SA 570.</p>
        </div>
      </div>
    `,
    summaryClean: "SA 701 applies to listed entities; filtered from TCWG communications to items of most significance; KAM never substitutes for a modified opinion or going concern disclosure."
  },
  {
    id: 'aud_fc_ch7_02',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'SA 705 (Revised) - Modifications to the Opinion',
    examImportance: 'Critical',
    question: 'State the decision matrix for choosing between Qualified, Adverse, and Disclaimer of Opinion under SA 705.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1.5 border border-slate-800">Nature of Circumstance</th>
              <th class="p-1.5 border border-slate-800 text-amber-400">Material but NOT Pervasive</th>
              <th class="p-1.5 border border-slate-800 text-rose-400">Material AND Pervasive</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Financial Statements are Materially Misstated</td>
              <td class="p-1.5 border border-slate-800 font-bold text-amber-300">Qualified Opinion ("Except for...")</td>
              <td class="p-1.5 border border-slate-800 font-bold text-rose-400">Adverse Opinion ("Do not present true &amp; fair view")</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Inability to Obtain SAAE (Scope Limitation)</td>
              <td class="p-1.5 border border-slate-800 font-bold text-amber-300">Qualified Opinion ("Except for possible effects...")</td>
              <td class="p-1.5 border border-slate-800 font-bold text-rose-500">Disclaimer of Opinion ("Do not express an opinion")</td>
            </tr>
          </tbody>
        </table>
        <p class="text-[10px] text-slate-400 pt-0.5">Pervasive effects: Not confined to specific elements, represent a substantial proportion of FS, or are fundamental to users' understanding.</p>
      </div>
    `,
    summaryClean: "Material but not pervasive = Qualified Opinion. Material and pervasive misstatement = Adverse Opinion. Material and pervasive inability to obtain evidence = Disclaimer."
  },
  {
    id: 'aud_fc_ch7_03',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'CARO 2020 - Key Critical Reporting Thresholds',
    examImportance: 'Critical',
    question: 'What are the critical numerical thresholds under CARO 2020 Clauses 3(i), 3(ii), 3(vii), 3(ix), and 3(xvii)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-amber-400 block">Clause 3(ii) - Inventory:</span>
            • Discrepancies of <span class="text-white font-bold">&ge; 10%</span> in aggregate for each class.<br/>
            • Working capital limits sanctioned &gt; <span class="text-white font-bold">₹5 Crores</span> from banks/FIs on security of current assets (reconciliation with stock statements).
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-emerald-400 block">Clause 3(vii) - Statutory Dues:</span>
            Undisputed statutory dues arrears outstanding for &gt; <span class="text-white font-bold">6 months</span> from date they became payable.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-rose-400 block">Clause 3(ix) - Loan Defaults:</span>
            Default in repayment of loans/interest to any lender; period and amount of default, whether declared wilful defaulter.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-sky-400 block">Clause 3(xvii) - Cash Losses:</span>
            Whether company has incurred cash losses in current FY and immediately preceding FY, and amount of cash loss.
          </div>
        </div>
      </div>
    `,
    summaryClean: "CARO 2020 highlights: 10% inventory discrepancy, >5Cr working capital quarterly reconciliations, >6 months undisputed statutory dues, and cash loss reporting."
  },

  // =========================================================================
  // CHAPTER 8: SPECIALISED AREAS
  // =========================================================================
  {
    id: 'aud_fc_ch8_01',
    subjectId: 'Audit',
    category: 'Specialised Areas',
    statutoryRef: 'SA 800, SA 805 & SA 810 - Specialised Standards Suite',
    examImportance: 'High',
    question: 'Distinguish between the scopes and reporting mandates of SA 800, SA 805, and SA 810.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 text-[11px] bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
          <div>• <span class="font-bold text-amber-400">SA 800 (Special Purpose Frameworks):</span> Applies to complete sets of FS prepared for specific users (e.g. tax basis, regulatory basis, contractual cash flow basis). Mandatory to include an <span class="text-white font-bold">Emphasis of Matter</span> paragraph alerting users to special purpose framework.</div>
          <div>• <span class="font-bold text-emerald-400">SA 805 (Single FS or Specific Element):</span> Applies to audit of single financial statement (e.g. Balance Sheet only) or single element (e.g. accounts receivable, inventory). If auditor expresses adverse/disclaimer on complete FS, cannot express unmodified opinion on single element of same FS in same report.</div>
          <div>• <span class="font-bold text-sky-400">SA 810 (Summary Financial Statements):</span> Applies to engagements to report on summary financial statements derived from audited FS. Auditor must determine whether summary FS are consistent, in all material respects, with audited FS or a fair summary.</div>
        </div>
      </div>
    `,
    summaryClean: "SA 800 covers special purpose frameworks (EOM mandatory); SA 805 covers single statement/elements; SA 810 evaluates consistency of summary FS derived from audited FS."
  },

  // =========================================================================
  // CHAPTER 9: RELATED SERVICES
  // =========================================================================
  {
    id: 'aud_fc_ch9_01',
    subjectId: 'Audit',
    category: 'Related Services',
    statutoryRef: 'SRS 4400 & SRS 4410 - Agreed-Upon Procedures vs Compilation',
    examImportance: 'High',
    question: 'Compare Agreed-Upon Procedures (SRS 4400) and Compilation Engagements (SRS 4410).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1.5 border border-slate-800">Feature</th>
              <th class="p-1.5 border border-slate-800 text-amber-400">SRS 4400 (Agreed-Upon Procedures)</th>
              <th class="p-1.5 border border-slate-800 text-emerald-400">SRS 4410 (Compilation)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Assurance Level</td>
              <td class="p-1.5 border border-slate-800"><span class="text-rose-400 font-bold">No Assurance</span>. Report of Factual Findings only.</td>
              <td class="p-1.5 border border-slate-800"><span class="text-rose-400 font-bold">No Assurance</span>. Assisting management in preparing FS.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Independence</td>
              <td class="p-1.5 border border-slate-800">Not strictly required; if practitioner not independent, state that fact in report.</td>
              <td class="p-1.5 border border-slate-800">Not required; practitioner must disclose lack of independence in the compilation report.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Distribution</td>
              <td class="p-1.5 border border-slate-800">Restricted to parties that agreed to procedures.</td>
              <td class="p-1.5 border border-slate-800">Not restricted unless specified in engagement.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "SRS 4400 and SRS 4410 provide zero assurance. SRS 4400 provides factual findings to restricted users; SRS 4410 assists in compiling FS without audit verification."
  },

  // =========================================================================
  // CHAPTER 10: REVIEW OF FINANCIAL INFORMATION
  // =========================================================================
  {
    id: 'aud_fc_ch10_01',
    subjectId: 'Audit',
    category: 'Review of Financial Information',
    statutoryRef: 'SRE 2400 & SRE 2410 - Standards on Review Engagements',
    examImportance: 'Critical',
    question: 'What level of assurance is provided in a Review Engagement, and what are its primary procedures under SRE 2400 / 2410?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2.5 border border-slate-800 bg-slate-900/50 rounded-lg space-y-1.5 text-[11px]">
          <p><span class="font-bold text-emerald-400">Assurance Level:</span> Provides <span class="text-white font-bold">Limited (Moderate) Assurance</span> expressed in a <span class="text-amber-400 font-bold">negative form</span> ("Nothing has come to our attention that causes us to believe that the financial statements do not give a true and fair view...").</p>
          <div class="border-t border-slate-800 pt-1">
            <span class="font-bold text-white block mb-0.5">Two Core Review Procedures:</span>
            <ul class="list-disc pl-4 space-y-0.5 text-slate-350">
              <li><span class="font-bold text-white">Inquiry:</span> Detailed discussions with management responsible for financial and accounting matters.</li>
              <li><span class="font-bold text-white">Analytical Procedures:</span> Comparing recorded amounts/ratios against expectations, budgets, prior periods.</li>
            </ul>
          </div>
          <p class="text-rose-400 text-[10px] pt-1">Auditor does NOT test accounting records through inspection, observation, confirmation, or perform test of controls unless inquiries and analytical procedures indicate potential misstatement.</p>
        </div>
      </div>
    `,
    summaryClean: "Review engagements provide moderate/negative assurance based primarily on inquiry and analytical procedures without substantive testing of underlying records."
  },

  // =========================================================================
  // CHAPTER 11: PROSPECTIVE FINANCIAL INFORMATION AND OTHER ASSURANCE SERVICES
  // =========================================================================
  {
    id: 'aud_fc_ch11_01',
    subjectId: 'Audit',
    category: 'Prospective Financial Information and Other Assurance Services',
    statutoryRef: 'SAE 3400 & SAE 3402 - Prospective Information & Service Organizations',
    examImportance: 'Critical',
    question: 'Differentiate Forecast vs Projection under SAE 3400, and Type 1 vs Type 2 reports under SAE 3402.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg text-[11px]">
          <span class="font-bold text-amber-400 block mb-0.5">SAE 3400: Forecast vs Projection:</span>
          • <span class="font-bold text-white">Forecast:</span> Based on assumptions as to future events which management <span class="text-emerald-400 font-bold">expects to take place</span> (best-estimate assumptions).<br/>
          • <span class="font-bold text-white">Projection:</span> Based on <span class="text-rose-400 font-bold">hypothetical assumptions</span> about future events and management actions (e.g. startup scenario or new plant).
        </div>
        <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg text-[11px]">
          <span class="font-bold text-sky-400 block mb-0.5">SAE 3402: Type 1 vs Type 2 Reports:</span>
          • <span class="font-bold text-white">Type 1 Report:</span> Report on description and <span class="text-amber-400 font-bold">design of controls</span> at a service organization as of a specific date (no operating effectiveness testing).<br/>
          • <span class="font-bold text-white">Type 2 Report:</span> Report on description, design <span class="text-emerald-400 font-bold">AND operating effectiveness of controls</span> throughout a specified period (user auditor can rely for control risk reduction).
        </div>
      </div>
    `,
    summaryClean: "SAE 3400: Forecast uses best-estimates, projection uses hypothetical scenarios. SAE 3402: Type 1 covers design as of a date; Type 2 covers design & operating effectiveness over a period."
  },

  // =========================================================================
  // CHAPTER 12: DIGITAL AUDITING & ASSURANCE
  // =========================================================================
  {
    id: 'aud_fc_ch12_01',
    subjectId: 'Audit',
    category: 'Digital Auditing & Assurance',
    statutoryRef: 'CAATs, GITC & Automated Control Testing',
    examImportance: 'High',
    question: 'Differentiate General IT Controls (GITCs) from Application Controls, and explain audit data analytics in audit testing.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-amber-400 block">General IT Controls (GITCs):</span>
            Policies and procedures relating to many applications that support effective functioning of application controls:
            • Access to programs and data<br/>
            • Program changes and development<br/>
            • Computer operations &amp; backups
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg">
            <span class="font-bold text-emerald-400 block">Application Controls:</span>
            Automated procedures within specific business applications to ensure complete and accurate processing:
            • Input validations &amp; checks<br/>
            • Edit checks &amp; mandatory fields<br/>
            • Automated sequence numbers
          </div>
        </div>
        <p class="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
          <strong class="text-cyan-400">Audit Data Analytics (ADA):</strong> Techniques for discovering patterns, identifying anomalies, and extracting useful information through analysis, modeling, and visualization for the purpose of planning or performing the audit (allows 100% population testing instead of sample testing).
        </p>
      </div>
    `,
    summaryClean: "GITCs provide the foundational IT operating environment; application controls enforce automated business rules; ADA enables 100% population analysis."
  },

  // =========================================================================
  // CHAPTER 13: GROUP AUDITS
  // =========================================================================
  {
    id: 'aud_fc_ch13_01',
    subjectId: 'Audit',
    category: 'Group Audits',
    statutoryRef: 'SA 600 - Using the Work of Another Auditor',
    examImportance: 'Critical',
    question: 'What is the division of responsibility between Principal Auditor and Component Auditor under SA 600?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li><span class="font-bold text-white">Right to Rely:</span> The Principal Auditor is entitled to rely on the work performed by the other auditor, provided they exercise reasonable skill and care.</li>
          <li><span class="font-bold text-amber-400">Non-Responsibility for Specific Procedures:</span> The Principal Auditor is <span class="text-white font-bold">NOT responsible</span> for the work of the other auditor, nor required to review detailed working papers of the other auditor.</li>
          <li><span class="font-bold text-emerald-400">Coordination Duties:</span> Principal Auditor must issue instructions, obtain written representations from other auditor, review questionnaire, and consider significant findings.</li>
          <li><span class="font-bold text-sky-400">Disclosure in Report:</span> The Principal Auditor’s report should clearly state the extent of components audited by other auditors (total assets, revenue, cash flows) in an Other Matter paragraph.</li>
        </ul>
      </div>
    `,
    summaryClean: "Under SA 600, Principal Auditor may rely on component auditor and is not liable for their detailed work, provided reasonable care was exercised and division of work is disclosed."
  },

  // =========================================================================
  // CHAPTER 14: SPECIAL FEATURES OF AUDIT OF BANKS & NBFCs
  // =========================================================================
  {
    id: 'aud_fc_ch14_01',
    subjectId: 'Audit',
    category: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    statutoryRef: 'RBI Master Circular on IRACP & NBFC Scale-Based Regulation',
    examImportance: 'Critical',
    question: 'Summarize RBI NPA classification criteria and provisioning rates for Standard and Non-Performing Assets.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg text-[11px] space-y-1">
          <p><span class="font-bold text-amber-400">NPA Trigger:</span> Interest or principal installment remains overdue for a period of <span class="text-white font-bold">&gt; 90 days</span> in respect of term loans; out of order for > 90 days in CC/OD.</p>
          <div class="grid grid-cols-2 gap-1.5 pt-1">
            <div class="p-1.5 bg-slate-950 rounded border border-slate-850">
              <strong class="text-white block">Standard Advances:</strong>
              • Agriculture &amp; SME: 0.25%<br/>
              • Commercial Real Estate: 1.00%<br/>
              • Other Standard: 0.40%
            </div>
            <div class="p-1.5 bg-slate-950 rounded border border-slate-850">
              <strong class="text-white block">Sub-Standard (&le; 12 mos):</strong>
              • General: 15%<br/>
              • Unsecured ab-initio: 25%
            </div>
            <div class="p-1.5 bg-slate-950 rounded border border-slate-850 col-span-2">
              <strong class="text-white block">Doubtful Category (Secured Portion):</strong>
              • D1 (&le; 1 yr): 25% | • D2 (1–3 yrs): 40% | • D3 (&gt; 3 yrs): 100%<br/>
              <span class="text-rose-400 font-bold">Unsecured portion of all Doubtful assets = 100% | Loss Assets = 100%</span>
            </div>
          </div>
        </div>
      </div>
    `,
    summaryClean: "NPA triggers at 90 days overdue. Standard advances provision 0.25%–1%; Substandard 15%/25%; Doubtful 25% (D1), 40% (D2), 100% (D3); Unsecured & Loss assets 100%."
  },

  // =========================================================================
  // CHAPTER 15: OVERVIEW OF AUDIT OF PUBLIC SECTOR UNDERTAKINGS
  // =========================================================================
  {
    id: 'aud_fc_ch15_01',
    subjectId: 'Audit',
    category: 'Overview of Audit of Public Sector Undertakings',
    statutoryRef: 'Section 139(5), 143(5), (6), (7) & Propriety Audit',
    examImportance: 'High',
    question: 'Explain the role of C&AG in Government Companies and the three pillars of Public Audit.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li><span class="font-bold text-amber-400">Appointment (Sec 139(5)):</span> C&amp;AG appoints the statutory auditor of a Government company within <span class="text-white font-bold">180 days</span> from the commencement of the financial year.</li>
          <li><span class="font-bold text-emerald-400">Supplementary Audit (Sec 143(6)):</span> C&amp;AG has the right to conduct a supplementary audit within <span class="text-white font-bold">60 days</span> from the date of receipt of the statutory auditor's report.</li>
          <li><span class="font-bold text-sky-400">Test Audit (Sec 143(7)):</span> C&amp;AG may order a test audit of the company's accounts.</li>
        </ul>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
          <strong class="text-white">Three Pillars of PSU Audit:</strong><br/>
          • <span class="font-bold text-amber-300">Financial Audit:</span> Expressing opinion on truth &amp; fairness.<br/>
          • <span class="font-bold text-emerald-300">Compliance Audit:</span> Checking compliance with statutory rules, authorities, and sanction orders.<br/>
          • <span class="font-bold text-rose-300">Performance (3E) Audit:</span> Economy, Efficiency, and Effectiveness of public funds deployment.
        </div>
      </div>
    `,
    summaryClean: "C&AG appoints statutory auditors within 180 days and can conduct supplementary audit within 60 days. PSU audits evaluate Financial, Compliance, and 3E Performance aspects."
  },

  // =========================================================================
  // CHAPTER 16: INTERNAL AUDIT
  // =========================================================================
  {
    id: 'aud_fc_ch16_01',
    subjectId: 'Audit',
    category: 'Internal Audit',
    statutoryRef: 'Section 138 & Standards on Internal Audit (SIA)',
    examImportance: 'Critical',
    question: 'What are the statutory thresholds for mandatory Internal Audit under Section 138 of Companies Act, 2013?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2.5 border border-slate-800 bg-slate-900/50 rounded-lg space-y-1.5 text-[11px]">
          <p><span class="font-bold text-emerald-400">1. Listed Companies:</span> Mandatory for <span class="text-white font-bold">ALL</span> listed companies irrespective of size.</p>
          <div class="border-t border-slate-800 pt-1">
            <span class="font-bold text-amber-400 block mb-0.5">2. Unlisted Public Companies (Preceding FY triggers any ONE):</span>
            • Paid-up Share Capital &ge; <span class="text-white font-bold">₹50 Crores</span><br/>
            • Turnover &ge; <span class="text-white font-bold">₹200 Crores</span><br/>
            • Outstanding Bank/PFI Loans &gt; <span class="text-white font-bold">₹100 Crores</span> at any point during year<br/>
            • Outstanding Public Deposits &gt; <span class="text-white font-bold">₹25 Crores</span> at any point during year
          </div>
          <div class="border-t border-slate-800 pt-1">
            <span class="font-bold text-sky-400 block mb-0.5">3. Private Companies (Preceding FY triggers any ONE):</span>
            • Turnover &ge; <span class="text-white font-bold">₹200 Crores</span><br/>
            • Outstanding Bank/PFI Loans &gt; <span class="text-white font-bold">₹100 Crores</span> at any point during year
          </div>
        </div>
      </div>
    `,
    summaryClean: "Internal Audit applies to all listed companies; unlisted public with Capital ≥ 50Cr, Turnover ≥ 200Cr, Loans > 100Cr, or Deposits > 25Cr; private companies with Turnover ≥ 200Cr or Loans > 100Cr."
  },

  // =========================================================================
  // CHAPTER 17: DUE DILIGENCE, INVESTIGATION & FORENSIC AUDIT
  // =========================================================================
  {
    id: 'aud_fc_ch17_01',
    subjectId: 'Audit',
    category: 'Due Diligence, Investigation & Forensic Audit',
    statutoryRef: 'Forensic Audit vs Statutory Audit & Benford’s Law',
    examImportance: 'High',
    question: 'Compare Statutory Audit with Forensic Audit, and explain Benford’s Law application in fraud detection.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1.5 border border-slate-800">Dimension</th>
              <th class="p-1.5 border border-slate-800 text-amber-400">Statutory Audit</th>
              <th class="p-1.5 border border-slate-800 text-rose-400">Forensic Audit</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Objective</td>
              <td class="p-1.5 border border-slate-800">Express opinion on true and fair view of FS.</td>
              <td class="p-1.5 border border-slate-800">Determine fraud, identify perpetrators, quantify loss for legal proof in court.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Techniques</td>
              <td class="p-1.5 border border-slate-800">Sampling, substantive testing, analytical reviews.</td>
              <td class="p-1.5 border border-slate-800">Deep investigation, digital forensics, interview techniques, 100% data mining.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Presumption</td>
              <td class="p-1.5 border border-slate-800">Professional skepticism (neither honest nor dishonest).</td>
              <td class="p-1.5 border border-slate-800">Investigative mindset seeking evidence admissible in court of law.</td>
            </tr>
          </tbody>
        </table>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
          <strong class="text-cyan-400">Benford’s Law:</strong> Mathematical distribution predicting frequency of leading digits in naturally occurring datasets (digit '1' appears ~30.1% of times, '9' appears ~4.6%). Deviations indicate artificial/manipulated entries.
        </div>
      </div>
    `,
    summaryClean: "Statutory audit expresses general opinion using sampling; forensic audit investigates fraud to quantify losses for court. Benford’s Law detects fabricated numbers via first-digit frequency analysis."
  },

  // =========================================================================
  // CHAPTER 18: SUSTAINABLE DEVELOPMENT GOALS (SDG) & ESG ASSURANCE
  // =========================================================================
  {
    id: 'aud_fc_ch18_01',
    subjectId: 'Audit',
    category: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    statutoryRef: 'SEBI BRSR Core & SSAE 3000 Framework',
    examImportance: 'High',
    question: 'What is the Business Responsibility and Sustainability Reporting (BRSR) Core framework mandated by SEBI?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2.5 border border-slate-800 bg-slate-900/50 rounded-lg space-y-1.5 text-[11px]">
          <p><span class="font-bold text-emerald-400">Mandate:</span> Mandatory for top <span class="text-white font-bold">1,000 listed entities</span> by market capitalization to file comprehensive BRSR as part of Annual Report.</p>
          <div class="border-t border-slate-800 pt-1">
            <span class="font-bold text-amber-400 block mb-0.5">BRSR Core (Reasonable Assurance Phase-in):</span>
            Sub-set of BRSR containing Key Performance Indicators (KPIs) across 9 ESG principles:
            • Greenhouse Gas (GHG) footprint (Scope 1 &amp; Scope 2 emissions)<br/>
            • Water consumption &amp; intensity, waste management<br/>
            • Workforce diversity, gender ratio, median wages, POSH compliance<br/>
            • Job creation in small towns, vendor payments to MSMEs
          </div>
          <p class="text-sky-400 font-bold text-[10px] pt-1">Assurance Standard: SSAE 3000 (Assurance Engagements Other Than Audits or Reviews of Historical Financial Information) provides technical framework.</p>
        </div>
      </div>
    `,
    summaryClean: "BRSR is mandatory for top 1,000 listed entities; BRSR Core focuses on measurable environmental, social, and supply chain KPIs requiring third-party assurance under SSAE 3000."
  },

  // =========================================================================
  // CHAPTER 19: PROFESSIONAL ETHICS & LIABILITIES OF AUDITORS
  // =========================================================================
  {
    id: 'aud_fc_ch19_01',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I - Clauses 1, 2, 3, 4, 5',
    examImportance: 'Critical',
    question: 'What are the restrictions on sharing fees, partnership, and profits under Clauses 1, 2, 3, and 4 of First Schedule?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <li><span class="font-bold text-amber-300">Clause (1) - Sharing Fees:</span> CA in practice cannot share fees, profits, or brokerage with anyone other than a member of ICAI, partner, retired partner, or legal heir (or members of recognized foreign professional bodies under Regulation 53B).</li>
          <li><span class="font-bold text-emerald-300">Clause (2) - Accepting Share of Profits:</span> Cannot accept any part of profits of the professional work of a lawyer, auctioneer, broker, or other agent who is not a member of the Institute.</li>
          <li><span class="font-bold text-sky-300">Clause (3) - Partnership:</span> Cannot enter into partnership with any person other than a CA in practice or a recognized qualified professional under Council Guidelines (e.g. CS, CWA, Actuary, Architect, Advocate).</li>
          <li><span class="font-bold text-rose-300">Clause (4) - Securing Work through Non-Qualified Persons:</span> Cannot secure professional business through the services of a person who is not an employee or partner.</li>
        </ul>
      </div>
    `,
    summaryClean: "First Schedule Clauses 1 to 4 restrict fee-sharing and partnerships strictly to members of the Institute or recognized professionals, prohibiting commissions or non-member arrangements."
  },
  {
    id: 'aud_fc_ch19_02',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I - Clauses 6, 7 & 8',
    examImportance: 'Critical',
    question: 'What are the strict rules on Solicitation (Cl 6), Advertising (Cl 7), and Prior Communication with Previous Auditor (Cl 8)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-[11px]">
          <div>• <span class="font-bold text-amber-400">Clause (6) - Solicitation:</span> Prohibits soliciting clients or professional work by advertisement, circular, personal interview, or any other means (Exceptions: tenders open exclusively to CAs, responding to inquiries).</div>
          <div>• <span class="font-bold text-sky-400">Clause (7) - Advertising &amp; Visiting Cards:</span> Prohibits advertising professional attainments. Visiting cards may contain only member name, firm name, address, phone, email, and designation "Chartered Accountant" (No specialization, awards, or ex-official designations).</div>
          <div>• <span class="font-bold text-emerald-400">Clause (8) - Prior Communication:</span> Mandatory to communicate in writing with the retiring/previous auditor before accepting any audit appointment. Must be sent by Registered Post AD, Speed Post, or hand-delivery with written acknowledgment.</div>
        </div>
      </div>
    `,
    summaryClean: "Clause 6 bans soliciting work; Clause 7 prohibits self-aggrandizing adverts or designations; Clause 8 makes prior written communication with retiring auditor strictly mandatory before acceptance."
  },
  {
    id: 'aud_fc_ch19_03',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I - Clauses 10, 11 & Second Schedule',
    examImportance: 'Critical',
    question: 'What does Clause 10 state regarding Contingent Fees, and what constitutes Gross Negligence under Clause 7 of Second Schedule?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg text-[11px] space-y-1">
          <span class="font-bold text-amber-400 block mb-0.5">Clause (10) - Contingent Fees:</span>
          A CA in practice cannot charge fees based on a percentage of profits or contingent upon the findings/results of such employment.
          <div class="text-[10px] text-emerald-400 pt-0.5">
            Exceptions (Regulation 192): Liquidator fees (% of assets realized), Insolvency Professional (IBC), debt recovery agent, valuing unquoted shares (% of asset value).
          </div>
        </div>
        <div class="p-2 border border-slate-800 bg-slate-900/50 rounded-lg text-[11px] space-y-1">
          <span class="font-bold text-rose-400 block mb-0.5">Second Schedule, Part I, Clause (7) - Gross Negligence:</span>
          Guilty of professional misconduct if a member does not exercise <span class="text-white font-bold underline">due diligence</span>, or is <span class="text-white font-bold underline">grossly negligent</span> in the conduct of their professional duties (e.g. failure to perform physical inventory verification without justification, certifying accounts without verifying bank balances).
        </div>
      </div>
    `,
    summaryClean: "Fees cannot be contingent on profits or results except under Regulation 192 exemptions. Failure to exercise due diligence or gross negligence is punishable under Second Schedule Clause 7."
  },
  {
    id: 'aud_fc_ch19_04',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'ICAI Code of Ethics - NOCLAR (Non-Compliance with Laws and Regulations)',
    examImportance: 'Critical',
    question: 'What is the applicability threshold and disclosure framework for NOCLAR under the ICAI Code of Ethics?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2.5 border border-slate-800 bg-slate-900/50 rounded-lg space-y-1.5 text-[11px]">
          <p><span class="font-bold text-emerald-400">Applicability:</span> Mandatory for audits of financial statements of <span class="text-white font-bold">listed entities</span> (and for senior professional accountants in service of listed entities).</p>
          <div class="border-t border-slate-800 pt-1">
            <span class="font-bold text-amber-400 block mb-0.5">Core Objective:</span>
            To guide professional accountants when encountering intentional or unintentional acts of non-compliance (or suspected non-compliance) with laws and regulations:
            • Money laundering, terrorist financing, fraud, corruption<br/>
            • Securities markets regulations, banking &amp; tax laws<br/>
            • Environmental protection and public safety
          </div>
          <div class="border-t border-slate-800 pt-1 text-[10px] text-slate-350">
            <strong class="text-white">Escalation Ladder:</strong> Discuss with management &rarr; escalate to TCWG &rarr; if no appropriate action and substantial harm to public interest, consider disclosure to external regulatory authorities (overriding client confidentiality in exceptional public interest).
          </div>
        </div>
      </div>
    `,
    summaryClean: "NOCLAR applies to listed entity audits; requires auditors discovering intentional/serious legal non-compliance to escalate internally and potentially disclose to regulators in public interest."
  }
];

export const AUDIT_ALL_CHAPTER_FLASHCARDS: Flashcard[] = [
  ...BASE_AUDIT_FLASHCARDS,
  ...AUDIT_FLASHCARDS_PART1,
  ...AUDIT_FLASHCARDS_PART2,
  ...AUDIT_FLASHCARDS_PART3,
  ...AUDIT_FLASHCARDS_PART4,
  ...AUDIT_FLASHCARDS_PART5,
];
