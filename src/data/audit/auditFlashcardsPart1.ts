/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL PAPER 3: AUDIT FLASHCARDS - PART 1 (CHAPTERS 1 TO 6)
 * Standards on Auditing (SQC 1, SA 200 - SA 580)
 */

import { Flashcard } from '../flashcards';

export const AUDIT_FLASHCARDS_PART1: Flashcard[] = [
  // =========================================================================
  // CHAPTER 1: QUALITY CONTROL (SQC 1, SA 220)
  // =========================================================================
  {
    id: 'aud_fc_c1_01',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 - Six Elements of Quality Control',
    examImportance: 'Critical',
    question: 'Enumerate the 6 essential elements of a firm’s Quality Control System under SQC 1.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Six Elements of SQC 1 Framework:</p>
        <div class="grid grid-cols-2 gap-1.5 text-[11px]">
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">1. <strong class="text-white">Leadership Responsibilities:</strong> CEO/Managing Partner assumes ultimate accountability.</div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">2. <strong class="text-white">Ethical Requirements:</strong> Integrity, Objectivity, Due Care, Confidentiality, Independence.</div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">3. <strong class="text-white">Acceptance &amp; Continuance:</strong> Client integrity evaluated; firm competence and resources verified.</div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">4. <strong class="text-white">Human Resources:</strong> Capabilities, recruitment, continuous professional development (CPD).</div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">5. <strong class="text-white">Engagement Performance:</strong> Supervision, direction, consultation, EQCR protocol.</div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">6. <strong class="text-white">Monitoring:</strong> Ongoing evaluation and cyclical inspection of completed files.</div>
        </div>
      </div>
    `,
    summaryClean: "SQC 1 establishes 6 core elements: Leadership, Ethical requirements, Acceptance & Continuance, Human resources, Engagement performance, and Monitoring."
  },
  {
    id: 'aud_fc_c1_02',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 & SA 220 - Independence Declarations & Threats',
    examImportance: 'Critical',
    question: 'What are the annual independence requirements and five independence threat categories under SQC 1 / SA 220?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
          <strong class="text-emerald-400">Annual Written Confirmation:</strong> Firm must obtain annual written confirmation of compliance with independence policies from <span class="text-white font-bold">all personnel</span> required to be independent.
        </p>
        <p class="font-bold text-sky-400">Five Threat Categories (ICAI Code of Ethics):</p>
        <ul class="list-disc list-inside space-y-0.5 text-[11px] text-slate-350">
          <li><strong class="text-white">Self-Interest Threat:</strong> Financial or other personal interest (e.g. shares held in client).</li>
          <li><strong class="text-white">Self-Review Threat:</strong> Evaluating results of a previous judgment or service rendered by auditor.</li>
          <li><strong class="text-white">Advocacy Threat:</strong> Promoting client's position to the point objectivity is compromised.</li>
          <li><strong class="text-white">Familiarity Threat:</strong> Sympathetic relationship due to long association or close personal relation.</li>
          <li><strong class="text-white">Intimidation Threat:</strong> Deterred from acting objectively by actual or perceived threats.</li>
        </ul>
      </div>
    `,
    summaryClean: "SQC 1 mandates annual written independence confirmations. The 5 threats are Self-Interest, Self-Review, Advocacy, Familiarity, and Intimidation."
  },
  {
    id: 'aud_fc_c1_03',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 & SA 220 - Engagement Quality Control Review (EQCR)',
    examImportance: 'Critical',
    question: 'What are the mandatory applicability, timing, and cooling-off rules for an EQCR?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Applicability:</strong> Mandatory for all audits of financial statements of <span class="text-white font-bold">listed entities</span> and specified high-risk entities.</li>
          <li><strong class="text-rose-400">Report Timing:</strong> Audit report <span class="text-white font-bold underline">cannot be dated or issued</span> until completion of EQCR.</li>
          <li><strong class="text-emerald-400">Cooling-Off Period:</strong> An Engagement Partner must observe a mandatory <span class="text-white font-bold underline">2-year cooling-off period</span> before acting as EQCR on the same client.</li>
          <li><strong class="text-sky-400">Eligibility:</strong> Independent person with technical competence; not selected by engagement partner; no involvement in audit execution.</li>
        </ul>
      </div>
    `,
    summaryClean: "EQCR is mandatory for listed entity audits; report cannot be dated before review completion; requires a 2-year cooling-off before EP can act as EQCR."
  },
  {
    id: 'aud_fc_c1_04',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 & SA 230 - Audit Documentation Assembly & Custody',
    examImportance: 'Critical',
    question: 'Specify the statutory limits for assembly of audit files and retention of documentation under SQC 1.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Assembly Period:</span>
            Ordinarily not more than <span class="text-white font-bold underline">60 days</span> after the date of the auditor's report.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Retention Period:</span>
            Not shorter than <span class="text-white font-bold underline">7 years</span> from the date of the auditor's report (or group report date).
          </div>
        </div>
        <p class="text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-850">
          Ownership: Audit documentation is the exclusive property of the auditor (SA 230). Auditor may at discretion make portions available to client.
        </p>
      </div>
    `,
    summaryClean: "SQC 1 requires final audit file assembly within 60 days of the report date and retention of working papers for a minimum of 7 years."
  },
  {
    id: 'aud_fc_c1_05',
    subjectId: 'Audit',
    category: 'Quality Control',
    statutoryRef: 'SQC 1 - Monitoring & Cyclical Engagement Inspection',
    examImportance: 'High',
    question: 'How does SQC 1 mandate cyclical inspection of completed engagements under its Monitoring element?',
    answerHtml: `
      <div class="space-y-1.5 font-sans text-xs text-[11px] bg-slate-900/50 p-2.5 rounded border border-slate-800">
        <div>• <strong class="text-amber-400">Cyclical Inspection:</strong> Firm must inspect at least <span class="text-white font-bold">one completed engagement per engagement partner</span> on a cyclical basis.</div>
        <div>• <strong class="text-emerald-400">Inspection Cycle:</strong> Firm inspection cycle ordinarily does not exceed <span class="text-white font-bold">3 years</span>.</div>
        <div>• <strong class="text-sky-400">Inspector Independence:</strong> Persons involved with the engagement or EQCR of an engagement are <span class="text-white font-bold">not eligible</span> to inspect that engagement.</div>
        <div>• <strong class="text-rose-400">Evaluation:</strong> Deficiencies must be analyzed to determine whether they are systematic, repetitive, or isolated.</div>
      </div>
    `,
    summaryClean: "SQC 1 mandates cyclical inspection of at least one completed engagement per partner on a maximum 3-year cycle by independent reviewers."
  },

  // =========================================================================
  // CHAPTER 2: GENERAL AUDITING PRINCIPLES AND AUDITORS RESPONSIBILITIES
  // =========================================================================
  {
    id: 'aud_fc_c2_01',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 200 - Inherent Limitations of an Audit',
    examImportance: 'Critical',
    question: 'Why can an auditor obtain only reasonable assurance and not absolute assurance under SA 200?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Four Inherent Limitations of an Audit (SA 200):</p>
        <ul class="list-decimal list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-white">Nature of Financial Reporting:</strong> Involves management judgment, subjective decisions, and range of acceptable interpretations (e.g. accounting estimates).</li>
          <li><strong class="text-white">Nature of Audit Procedures:</strong> Management or others may not provide complete info; fraud may involve sophisticated concealment/collusion; auditor lacks legal search powers.</li>
          <li><strong class="text-white">Timeliness of Financial Reporting &amp; Cost-Benefit Balance:</strong> Impracticable for auditor to address all information that may exist or pursue every matter exhaustively.</li>
          <li><strong class="text-white">Other Specific Matters:</strong> Future events affecting going concern, non-compliance with complex laws, related party transactions.</li>
        </ul>
      </div>
    `,
    summaryClean: "Inherent limitations of financial reporting, audit procedures (no search powers, collusion), time/cost constraints, and subjective estimates preclude absolute assurance."
  },
  {
    id: 'aud_fc_c2_02',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 210 - Agreeing the Terms of Audit Engagements',
    examImportance: 'Critical',
    question: 'State the preconditions for an audit and circumstances requiring a revised engagement letter under SA 210.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
          <strong class="text-emerald-400 block mb-0.5">Two Preconditions (SA 210):</strong>
          1. Determine acceptability of Financial Reporting Framework (FRF).<br/>
          2. Obtain management acknowledgement of responsibility for FS preparation, internal controls, and unrestricted access to info and persons.
        </div>
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
          <strong class="text-amber-400 block mb-0.5">Recurring Audits - Triggers for Revised Letter:</strong>
          • Indication client misunderstands objective/scope • Revised/special terms<br/>
          • Recent change of senior management • Significant change in ownership<br/>
          • Significant change in nature or size of business • Change in legal/FRF requirements.
        </div>
      </div>
    `,
    summaryClean: "SA 210 requires acceptable FRF and management acknowledgement of core responsibilities; revised engagement letters are triggered by ownership, management, or scope changes."
  },
  {
    id: 'aud_fc_c2_03',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 240 - Fraud Triangle & Management Override of Controls',
    examImportance: 'Critical',
    question: 'What are the three fraud risk conditions (Fraud Triangle) and mandatory procedures against Management Override under SA 240?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
          <strong class="text-rose-400 block mb-0.5">Fraud Triangle (Three Conditions):</strong>
          1. <span class="text-white font-bold">Incentive/Pressure:</span> Realistic or perceived need to meet unrealistic earnings targets.<br/>
          2. <span class="text-white font-bold">Opportunity:</span> Ineffective controls, complex transactions, or dominant management.<br/>
          3. <span class="text-white font-bold">Rationalization/Attitude:</span> Justifying fraudulent behavior (e.g. "everyone does it").
        </div>
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
          <strong class="text-amber-400 block mb-0.5">Mandatory Auditor Responses to Management Override:</strong>
          • Test appropriateness of journal entries and adjustments made in preparing FS.<br/>
          • Review accounting estimates for biases and evaluate retroactive retrospective reviews.<br/>
          • Evaluate business rationale for significant transactions outside normal course of business.
        </div>
      </div>
    `,
    summaryClean: "Fraud Triangle: Incentive, Opportunity, Rationalization. Management override demands journal entry testing, estimate bias review, and unusual transaction scrutiny."
  },
  {
    id: 'aud_fc_c2_04',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'Section 143(12) & Rule 13 CAAR - Fraud Reporting Matrix',
    examImportance: 'Critical',
    question: 'State the exact two-tier reporting mechanism and deadlines for fraud under Section 143(12).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1 border border-slate-800">Category</th>
              <th class="p-1 border border-slate-800">Recipient</th>
              <th class="p-1 border border-slate-800">Statutory Timelines</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">&ge; ₹1 Crore</td>
              <td class="p-1 border border-slate-800">Central Govt (MCA)</td>
              <td class="p-1 border border-slate-800">Report to Board in <strong class="text-white">2 days</strong> (45-day reply window); forward to MCA in <strong class="text-amber-400">Form ADT-4 within 15 days</strong> of reply/expiry.</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-sky-400">&lt; ₹1 Crore</td>
              <td class="p-1 border border-slate-800">Board / Audit Committee</td>
              <td class="p-1 border border-slate-800">Report within <strong class="text-white">2 days</strong> specifying nature, approximate amount, and parties involved. Disclosed in Board's Report u/s 134(3)(ca).</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Frauds ≥ ₹1 Cr go to Central Govt in Form ADT-4 within 15 days of Board's 45-day reply period; frauds < ₹1 Cr go exclusively to Board within 2 days."
  },
  {
    id: 'aud_fc_c2_05',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 250 - Consideration of Laws and Regulations',
    examImportance: 'High',
    question: 'Distinguish between the auditor’s responsibilities for Direct vs Other Laws under SA 250.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Direct Effect Laws:</span>
            Laws having a direct effect on determination of material amounts/disclosures in FS (e.g. Tax laws, Companies Act pension rules).<br/>
            <strong class="text-white">Duty:</strong> Obtain <span class="underline">sufficient appropriate audit evidence</span> regarding compliance.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Other Laws:</span>
            Laws fundamental to operating aspects, ability to continue business, or avoid material penalties (e.g. Environmental, Labour, SEBI, FDA).<br/>
            <strong class="text-white">Duty:</strong> Perform <span class="underline">specified audit procedures</span> (Inquiry of management &amp; Inspect correspondence with regulators).
          </div>
        </div>
      </div>
    `,
    summaryClean: "Direct laws (tax, companies act) require obtaining SAAE on compliance; other laws (environmental, licensing) require limited procedures: inquiries and regulatory correspondence review."
  },
  {
    id: 'aud_fc_c2_06',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 299 - Joint Audit of Financial Statements',
    examImportance: 'High',
    question: 'What are the rules regarding division of work, joint liability, and disagreements among joint auditors under SA 299?',
    answerHtml: `
      <div class="space-y-1.5 font-sans text-xs text-[11px] bg-slate-900/50 p-2.5 rounded border border-slate-800">
        <div>• <strong class="text-amber-400">Divided Work:</strong> Each joint auditor is <span class="text-white font-bold">severally responsible</span> only for the work allocated to them as per the agreed work allocation document signed by all joint auditors.</div>
        <div>• <strong class="text-emerald-400">Undivided Work:</strong> All joint auditors are <span class="text-white font-bold">jointly and severally responsible</span> for undivided work, decisions on nature/timing/extent of common procedures, disclosure compliance under applicable FRF, and compliance with statutory audit report requirements.</div>
        <div>• <strong class="text-rose-400">Disagreement on Opinion:</strong> A joint auditor is <span class="text-white font-bold">not bound</span> by the majority opinion. The dissenting auditor must issue a separate audit report expressing their opinion with cross-reference.</div>
      </div>
    `,
    summaryClean: "Joint auditors are severally liable for allocated work, jointly and severally liable for undivided work and statutory compliance, and free to issue dissenting reports if they disagree."
  },
  {
    id: 'aud_fc_c2_07',
    subjectId: 'Audit',
    category: 'General Auditing Principles and Auditors Responsibilities',
    statutoryRef: 'SA 402 - Audit Considerations Relating to an Entity Using a Service Organization',
    examImportance: 'High',
    question: 'What are the two types of service organization reports under SA 402 and their audit significance?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Type 1 Report:</span>
            Report on the description and <strong class="text-white">design of controls</strong> at a service organization as of a specified date.<br/>
            <span class="text-slate-400">Audit value:</span> Helps user auditor understand controls; cannot provide basis for reducing assessed control risk.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Type 2 Report:</span>
            Report on the description, design <strong class="text-white">AND operating effectiveness</strong> of controls throughout a specified period.<br/>
            <span class="text-slate-400">Audit value:</span> User auditor can use as audit evidence to reduce assessed control risk.
          </div>
        </div>
      </div>
    `,
    summaryClean: "Type 1 reports cover control design at a point in time; Type 2 reports evaluate design and operating effectiveness over a period, allowing control risk reduction."
  },

  // =========================================================================
  // CHAPTER 3: AUDIT PLANNING, STRATEGY AND EXECUTION
  // =========================================================================
  {
    id: 'aud_fc_c3_01',
    subjectId: 'Audit',
    category: 'Audit Planning, Strategy and Execution',
    statutoryRef: 'SA 300 - Overall Audit Strategy vs Audit Plan',
    examImportance: 'High',
    question: 'Differentiate between Overall Audit Strategy and Audit Plan under SA 300.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 bg-slate-900/50 p-2.5 rounded border border-slate-800 text-[11px]">
          <div>• <strong class="text-amber-400">Overall Audit Strategy:</strong> Sets the <span class="text-white font-bold">Scope, Timing, and Direction</span> of the audit. Establishes resources deployed (who to assign, timing of deployment, management of resources).</div>
          <div>• <strong class="text-sky-400">Audit Plan (More Detailed):</strong> Translates strategy into operational steps. Includes the <span class="text-white font-bold">Nature, Timing and Extent (NTE)</span> of:
            <ul class="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-350">
              <li>Risk assessment procedures under SA 315.</li>
              <li>Further audit procedures (FAP) at assertion level under SA 330.</li>
              <li>Other planned audit procedures required by Standards on Auditing.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    summaryClean: "Audit Strategy determines broad scope, timing, and direction; Audit Plan details the specific NTE of risk assessment and further audit procedures."
  },
  {
    id: 'aud_fc_c3_02',
    subjectId: 'Audit',
    category: 'Audit Planning, Strategy and Execution',
    statutoryRef: 'SA 315 - Five Components of Internal Control & Significant Risks',
    examImportance: 'Critical',
    question: 'What are the five components of internal control and criteria for determining Significant Risks under SA 315?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-violet-400">Five Internal Control Components (COSO / SA 315):</p>
        <p class="text-[11px] bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
          1. Control Environment | 2. Entity's Risk Assessment Process | 3. Information System &amp; Comms | 4. Control Activities | 5. Monitoring of Controls
        </p>
        <p class="font-bold text-rose-400 pt-1">Criteria for Significant Risks (Require Special Audit Consideration):</p>
        <ul class="list-disc list-inside space-y-0.5 text-[11px] text-slate-350 bg-slate-950 p-2 rounded border border-slate-850">
          <li>Risk of fraud (SA 240 presumption: revenue recognition and management override).</li>
          <li>Related to recent significant economic, accounting or other developments.</li>
          <li>Complexity of transactions or significant non-routine transactions.</li>
          <li>Involves significant transactions with related parties or high degree of subjectivity in estimates.</li>
        </ul>
      </div>
    `,
    summaryClean: "Internal control comprises 5 components (CRIME). Significant risks involve fraud risk, complexity, high subjectivity in estimates, or major non-routine/related party deals."
  },
  {
    id: 'aud_fc_c3_03',
    subjectId: 'Audit',
    category: 'Audit Planning, Strategy and Execution',
    statutoryRef: 'SA 330 - Auditor’s Responses to Assessed Risks',
    examImportance: 'Critical',
    question: 'When are Tests of Controls mandatory, and what are the rotational testing rules under SA 330?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 bg-slate-900/50 p-2.5 rounded border border-slate-800 text-[11px]">
          <div>• <strong class="text-amber-400">Mandatory Test of Controls:</strong> Required when (1) auditor expects controls are operating effectively, OR (2) substantive procedures alone cannot provide sufficient appropriate audit evidence (e.g. highly automated paperless environment).</div>
          <div>• <strong class="text-emerald-400">Rotational Testing of Controls:</strong> Auditor may test operating effectiveness of controls on a rotational basis every <span class="text-white font-bold underline">3 years</span> (testing at least some controls in each audit).</div>
          <div>• <strong class="text-rose-400">Exception for Significant Risks:</strong> If a control mitigates a <span class="text-white font-bold">significant risk</span>, the auditor <span class="underline font-bold text-rose-300">CANNOT rely on prior year testing</span>; that control must be tested in the CURRENT period.</div>
        </div>
      </div>
    `,
    summaryClean: "Controls can be tested rotationally once every 3 years, but controls mitigating significant risks must be tested every single year without exception."
  },

  // =========================================================================
  // CHAPTER 4: MATERIALITY, RISK ASSESSMENT AND INTERNAL CONTROL
  // =========================================================================
  {
    id: 'aud_fc_c4_01',
    subjectId: 'Audit',
    category: 'Materiality, Risk Assessment and Internal Control',
    statutoryRef: 'SA 320 & SA 450 - Materiality Tiers and Misstatement Evaluation',
    examImportance: 'Critical',
    question: 'Define the three materiality levels under SA 320 & 450, and types of misstatements.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1 text-[11px] bg-slate-900/50 p-2 rounded border border-slate-800">
          <div>• <strong class="text-amber-400">Overall Materiality (SA 320):</strong> Maximum misstatement that could reasonably influence economic decisions of users of FS.</div>
          <div>• <strong class="text-emerald-400">Performance Materiality (PM):</strong> Amount set below overall materiality to reduce aggregation risk to appropriately low level.</div>
          <div>• <strong class="text-sky-400">Clearly Trivial Threshold (SA 450):</strong> Matters inconsequential in size and nature; auditor excludes them from accumulated misstatements.</div>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px]">
          <strong class="text-white">Three Types of Misstatements (SA 450):</strong><br/>
          1. <span class="text-amber-300 font-bold">Factual:</span> No doubt about existence (e.g. calculation errors).<br/>
          2. <span class="text-sky-300 font-bold">Judgmental:</span> Unreasonable accounting estimates or inappropriate policies.<br/>
          3. <span class="text-rose-300 font-bold">Projected:</span> Auditor's best estimate of misstatements in populations extrapolated from audit samples.
        </div>
      </div>
    `,
    summaryClean: "SA 320/450 establishes Overall Materiality, Performance Materiality, and Clearly Trivial thresholds; misstatements are categorized as Factual, Judgmental, or Projected."
  },
  {
    id: 'aud_fc_c4_02',
    subjectId: 'Audit',
    category: 'Materiality, Risk Assessment and Internal Control',
    statutoryRef: 'Section 143(3)(i) - Internal Financial Controls Over Financial Reporting',
    examImportance: 'Critical',
    question: 'State the private company exemption criteria for Internal Financial Controls (IFCoFR) u/s 143(3)(i).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">MCA Exemption Notification (13th June 2017):</p>
        <p class="text-[11px] text-slate-300">Reporting on IFCoFR under Section 143(3)(i) does NOT apply to a private company which:</p>
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li>Is a <span class="text-white font-bold">One Person Company (OPC)</span> or a <span class="text-white font-bold">Small Company</span> (Paid up capital &le; 4 Cr, Turnover &le; 40 Cr); OR</li>
          <li>Has turnover &lt; <span class="text-amber-400 font-bold">₹50 Crores</span> as per latest audited FS <span class="underline font-bold text-white">AND</span> aggregate borrowings from banks/FIs/bodies corporate &lt; <span class="text-amber-400 font-bold">₹25 Crores</span> at any time during the financial year.</li>
        </ul>
        <span class="text-[10px] text-emerald-400 block font-bold">Mandatory Condition: Company must have filed its annual returns (MGT-7) and financial statements (AOC-4) without default u/s 92 and 137.</span>
      </div>
    `,
    summaryClean: "Private companies are exempt from IFCoFR reporting if they are OPC/Small company OR have Turnover < ₹50 Cr and Borrowings < ₹25 Cr (with clean filing compliance)."
  },

  // =========================================================================
  // CHAPTER 5: AUDIT EVIDENCE
  // =========================================================================
  {
    id: 'aud_fc_c5_01',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 500 & SA 620 - Evaluating Management’s and Auditor’s Experts',
    examImportance: 'High',
    question: 'What must an auditor evaluate when using the work of an Expert under SA 500 / SA 620?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Competence, Capabilities &amp; Objectivity:</strong> Assess professional qualifications, license, experience, and independence/bias.</li>
          <li><strong class="text-sky-400">Obtain Understanding of Work:</strong> Scope of work, terms of engagement, and assumptions used.</li>
          <li><strong class="text-emerald-400">Evaluate Adequacy of Expert’s Work:</strong>
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>Relevance and reasonableness of findings and conclusions.</li>
              <li>Relevance and reasonableness of significant assumptions and methods.</li>
              <li>Relevance, completeness, and accuracy of source data used.</li>
            </ul>
          </li>
          <li><strong class="text-rose-400">Reference in Report:</strong> Auditor shall <span class="underline text-white font-bold">NOT refer to auditor's expert</span> in an unmodified report. If required by law or in a modified report, state that reference does not diminish auditor's responsibility.</li>
        </ul>
      </div>
    `,
    summaryClean: "Auditor must evaluate expert competence, objectivity, methods, and source data. The auditor cannot refer to an expert in an unmodified report."
  },
  {
    id: 'aud_fc_c5_02',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 501 - Specific Considerations: Physical Inventory Verification',
    examImportance: 'Critical',
    question: 'What procedures must the auditor perform when physical inventory count is conducted on a date other than balance sheet date?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Inventory Count on Non-Balance Sheet Date (SA 501):</p>
        <p class="text-[11px] text-slate-350 bg-slate-900/50 p-2 rounded border border-slate-800">
          When physical inventory counting is conducted at a date other than the balance sheet date, the auditor shall:
          <br/>1. Attend the physical inventory count on that alternate date.
          <br/>2. Perform audit procedures to obtain audit evidence about whether <span class="text-white font-bold">changes in inventory between the count date and the date of the financial statements</span> are properly recorded (Roll-forward / Roll-back procedures).
        </p>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px]">
          <strong class="text-rose-400">Impracticable Attendance:</strong> If attendance is impracticable, auditor shall perform <span class="text-white font-bold">alternative audit procedures</span> (e.g. inspecting documentation of subsequent sale of specific items). If alternative procedures fail, modify opinion u/SA 705.
        </div>
      </div>
    `,
    summaryClean: "If inventory count occurs off-balance sheet date, auditor attends the count and performs roll-forward/roll-back testing on intervening transactions."
  },
  {
    id: 'aud_fc_c5_03',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 505 - External Confirmations & Management Refusal',
    examImportance: 'Critical',
    question: 'What are the required auditor actions if management refuses to allow the auditor to send a confirmation request under SA 505?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Sequential Actions on Management Refusal (SA 505):</p>
        <ol class="list-decimal list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li>Inquire as to management’s reasons for refusal, and seek audit evidence as to their validity and reasonableness.</li>
          <li>Evaluate implications of refusal on auditor’s assessment of the relevant RMM, including fraud risk, and on NTE of other procedures.</li>
          <li>Perform <span class="text-white font-bold">alternative audit procedures</span> designed to obtain relevant and reliable audit evidence (e.g. examining subsequent cash receipts or shipping docs).</li>
          <li><span class="text-amber-400 font-bold">If refusal unreasonable or cannot obtain evidence:</span> Communicate with TCWG u/SA 260 and determine implications for audit opinion u/SA 705.</li>
        </ol>
      </div>
    `,
    summaryClean: "Management refusal requires probing reasons, evaluating fraud implications, executing alternative procedures, communicating to TCWG, and modifying opinion if unresolved."
  },
  {
    id: 'aud_fc_c5_04',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 510 - Initial Audit Engagements: Opening Balances',
    examImportance: 'High',
    question: 'What procedures must the incoming auditor perform regarding opening balances under SA 510?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li>Determine whether prior period closing balances have been <span class="text-white font-bold">correctly brought forward</span>.</li>
          <li>Determine whether opening balances reflect application of <span class="text-white font-bold">appropriate accounting policies consistently applied</span>.</li>
          <li>Review the predecessor auditor’s working papers (if permitted) or perform specific procedures:
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>For current assets/liabilities: examining collections/payments during current period.</li>
              <li>For non-current assets/liabilities: examining records, confirmations with third parties.</li>
            </ul>
          </li>
          <li><strong class="text-rose-400">Reporting:</strong> If opening balances contain misstatements affecting current period and not corrected, express <span class="text-white font-bold">Qualified or Adverse opinion</span> on current FS.</li>
        </ul>
      </div>
    `,
    summaryClean: "SA 510 requires verifying correct carry-forward, accounting policy consistency, examining predecessor workpapers, and substantive testing of opening asset/liability balances."
  },
  {
    id: 'aud_fc_c5_05',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 520 - Substantive Analytical Procedures',
    examImportance: 'High',
    question: 'What factors determine the suitability and reliability of Substantive Analytical Procedures under SA 520?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <p class="font-bold text-amber-400">1. Suitability of Analytical Procedures:</p>
          More suitable for large volumes of predictable transactions over time (e.g. payroll, rent, depreciation) rather than volatile or discretionary expenses.
        </div>
        <div class="space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <p class="font-bold text-emerald-400">2. Reliability of Data (Four Tests):</p>
          • <strong class="text-white">Source:</strong> Independent external sources more reliable than internal sources.<br/>
          • <strong class="text-white">Comparability:</strong> Broad industry data may need adjustment for company scale.<br/>
          • <strong class="text-white">Nature and Relevance:</strong> Whether budgets are prepared as realistic targets rather than aspirational goals.<br/>
          • <strong class="text-white">Controls over Preparation:</strong> Adequacy of controls over budget preparation and review.
        </div>
      </div>
    `,
    summaryClean: "SA 520 substantive analytical procedures apply best to high-volume predictable transactions; reliability depends on source independence, comparability, relevance, and preparation controls."
  },
  {
    id: 'aud_fc_c5_06',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 530 - Audit Sampling Methods & Evaluation',
    examImportance: 'High',
    question: 'Contrast Statistical vs Non-Statistical Sampling and define Tolerable Misstatement under SA 530.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Statistical Sampling:</span>
            Features random selection of sample items AND use of probability theory to evaluate sample results, including measurement of sampling risk.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Non-Statistical Sampling:</span>
            Sample approach that does not have characteristics of statistical sampling (relies purely on auditor's professional judgment).
          </div>
        </div>
        <p class="text-[11px] bg-slate-950 p-2 rounded border border-slate-850">
          <strong class="text-sky-400">Tolerable Misstatement:</strong> A monetary amount set by the auditor in respect of which the auditor seeks to obtain an appropriate level of assurance that the monetary amount set by the auditor is not exceeded by actual misstatement in the population (application of performance materiality to sampling).
        </p>
      </div>
    `,
    summaryClean: "Statistical sampling uses random selection and probability theory to quantify risk; tolerable misstatement is the application of performance materiality to a sampling procedure."
  },
  {
    id: 'aud_fc_c5_07',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 540 - Auditing Accounting Estimates & Estimation Uncertainty',
    examImportance: 'Critical',
    question: 'What procedures must the auditor perform to test Accounting Estimates and Fair Value under SA 540?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-indigo-400">Auditor's Response Approaches under SA 540:</p>
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-white">Subsequent Events:</strong> Test whether events occurring up to report date provide evidence regarding the accounting estimate.</li>
          <li><strong class="text-white">Test Management's Process:</strong>
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>Evaluate method of measurement used (appropriateness under FRF).</li>
              <li>Evaluate assumptions used (reasonable in light of industry/historical data).</li>
              <li>Test accuracy, completeness and relevance of underlying source data.</li>
            </ul>
          </li>
          <li><strong class="text-white">Develop Independent Point Estimate / Range:</strong> Develop an independent estimate to evaluate management’s point estimate.</li>
          <li><strong class="text-rose-400">Retrospective Review:</strong> Perform retrospective review of prior period accounting estimates to identify potential management bias.</li>
        </ul>
      </div>
    `,
    summaryClean: "SA 540 responses: check subsequent events, test management's assumptions and data, develop an independent range estimate, and conduct retrospective reviews for bias."
  },
  {
    id: 'aud_fc_c5_08',
    subjectId: 'Audit',
    category: 'Audit Evidence',
    statutoryRef: 'SA 550 - Related Parties & Arm’s Length Assertions',
    examImportance: 'Critical',
    question: 'How does an auditor verify management’s assertion that a related party transaction was conducted on an Arm’s Length basis?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Auditing Arm's Length Assertions (SA 550):</p>
        <p class="text-[11px] text-slate-350 bg-slate-900/50 p-2 rounded border border-slate-800">
          Management is responsible for the substantiation of an arm's length assertion. If management cannot substantiate the assertion, the auditor shall discuss with management and request its removal from the financial statements.
        </p>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px]">
          <strong class="text-white">Audit Procedures:</strong><br/>
          • Compare transaction prices with terms for identical/similar goods sold to unrelated third parties.<br/>
          • Compare terms to known market terms for similar transactions.<br/>
          • Verify engagement of external independent appraisal expert (e.g. registered valuer).<br/>
          <span class="text-rose-400 font-bold">Reporting:</span> If management refuses to remove an unsubstantiated arm’s length assertion, the auditor shall modify the audit opinion u/SA 705.
        </div>
      </div>
    `,
    summaryClean: "Management must substantiate arm's length claims with market comps or independent appraisals. Unsubstantiated claims must be removed or the audit opinion modified."
  },

  // =========================================================================
  // CHAPTER 6: COMPLETION AND REVIEW
  // =========================================================================
  {
    id: 'aud_fc_c6_01',
    subjectId: 'Audit',
    category: 'Completion and Review',
    statutoryRef: 'SA 560 - Subsequent Events Across Three Chronological Periods',
    examImportance: 'Critical',
    question: 'Outline the auditor’s duties regarding subsequent events across the three distinct time intervals under SA 560.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 text-[11px] bg-slate-900/50 p-2 rounded border border-slate-800">
          <div>• <strong class="text-emerald-400">Period 1 (Up to Date of Auditor’s Report):</strong> Active duty. Auditor <span class="text-white font-bold">must perform specific audit procedures</span> to identify all events requiring adjustment or disclosure.</div>
          <div>• <strong class="text-amber-400">Period 2 (Between Report Date &amp; FS Issue Date):</strong> Passive duty. No obligation to perform procedures. If a fact becomes known that would have caused amendment to report, discuss with management; amend report with dual dating or new report.</div>
          <div>• <strong class="text-rose-400">Period 3 (After FS Have Been Issued):</strong> Passive duty. If management amends FS, auditor issues new report with Emphasis of Matter / Other Matter; if management refuses to take steps to prevent reliance, notify TCWG and take legal action.</div>
        </div>
      </div>
    `,
    summaryClean: "Auditor has an active search duty up to the report date; afterwards, the auditor has only a passive duty to react to facts that would have modified the opinion."
  },
  {
    id: 'aud_fc_c6_02',
    subjectId: 'Audit',
    category: 'Completion and Review',
    statutoryRef: 'SA 570 - Going Concern Operating and Financial Indicators',
    examImportance: 'Critical',
    question: 'What are the key financial, operating, and other indicators of Going Concern doubt under SA 570?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-rose-400 font-bold block mb-1">Financial Indicators:</span>
            • Net liability or net current liability position<br/>
            • Fixed-term borrowings approaching maturity without realistic renewal prospects<br/>
            • Substantial operating cash losses<br/>
            • Inability to pay creditors on due dates<br/>
            • Inability to obtain financing for essential CAPEX
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Operating &amp; Other Indicators:</span>
            • Management intentions to liquidate or cease operations<br/>
            • Loss of key management without replacement<br/>
            • Loss of major market, key customer, or critical supplier<br/>
            • Non-compliance with statutory capital requirements<br/>
            • Pending catastrophic legal proceedings
          </div>
        </div>
      </div>
    `,
    summaryClean: "Going concern indicators include net liability positions, debt default, operating cash losses, loss of key management/licenses, and existential litigation."
  },
  {
    id: 'aud_fc_c6_03',
    subjectId: 'Audit',
    category: 'Completion and Review',
    statutoryRef: 'SA 580 - Written Representations Dating & Disclaimer',
    examImportance: 'Critical',
    question: 'What are the rules regarding the date of written representations, and mandatory disclaimer under SA 580?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
          <div>• <strong class="text-amber-400">Date of Written Representations:</strong> Shall be as near as practicable to, but <span class="text-white font-bold underline">NOT AFTER, the date of the auditor's report</span> on the financial statements.</div>
          <div>• <strong class="text-sky-400">Period Covered:</strong> Must cover all financial statements and period(s) referred to in the auditor's report.</div>
          <div>• <strong class="text-rose-400">Mandatory Disclaimer:</strong> The auditor <span class="text-white font-bold underline">SHALL DISCLAIM AN OPINION</span> if:
            <ul class="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-350">
              <li>Auditor concludes there is sufficient doubt about management integrity; OR</li>
              <li>Management refuses to provide the written representations regarding responsibility for FS preparation and design/maintenance of internal control.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    summaryClean: "Representation letters must be dated on or before the audit report date. Management refusal to confirm basic responsibilities mandates a Disclaimer of Opinion."
  },
  {
    id: 'aud_fc_c6_04',
    subjectId: 'Audit',
    category: 'Completion and Review',
    statutoryRef: 'SA 265 - Communicating Deficiencies in Internal Control to TCWG',
    examImportance: 'High',
    question: 'When and how must significant deficiencies in internal control be communicated under SA 265?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Written Communication:</strong> Significant deficiencies in internal control must be communicated <span class="text-white font-bold underline">in writing</span> to Those Charged With Governance (TCWG) on a timely basis.</li>
          <li><strong class="text-sky-400">To Management:</strong> Communicate in writing to appropriate level of management significant deficiencies and other deficiencies of sufficient importance to merit attention.</li>
          <li><strong class="text-emerald-400">Mandatory Inclusions in Letter:</strong>
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>A description of the deficiencies and an explanation of their potential effects.</li>
              <li>Explanation that audit purpose was to express opinion on FS, not internal control effectiveness.</li>
              <li>Statement that matters reported are limited to deficiencies identified during the audit.</li>
            </ul>
          </li>
        </ul>
      </div>
    `,
    summaryClean: "SA 265 requires written communication of significant deficiencies to TCWG, including descriptions, potential effects, and appropriate disclaimer disclaimers."
  }
];
