/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL PAPER 3: AUDIT FLASHCARDS - PART 2 (CHAPTERS 7 TO 11)
 * Audit Reporting, CARO 2020, Specialised Areas & Assurance Services
 */

import { Flashcard } from '../flashcards';

export const AUDIT_FLASHCARDS_PART2: Flashcard[] = [
  // =========================================================================
  // CHAPTER 7: REPORTING (SA 700, 701, 705, 706, 720 & CARO 2020)
  // =========================================================================
  {
    id: 'aud_fc_c7_01',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'SA 700 (Revised) - Audit Report Layout & Structure',
    examImportance: 'Critical',
    question: 'What is the mandatory sequential order of sections in an Independent Auditor’s Report under SA 700 (Revised)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Standard Sequential Structure (SA 700):</p>
        <ol class="list-decimal list-inside space-y-0.5 text-[11px] bg-slate-900/50 p-2 rounded border border-slate-800 text-slate-300">
          <li><strong class="text-white">Title:</strong> "Independent Auditor's Report"</li>
          <li><strong class="text-white">Addressee:</strong> (e.g. Members/Shareholders of the Company)</li>
          <li><strong class="text-emerald-400">Opinion Section:</strong> Explicit identification of statements audited and clear opinion.</li>
          <li><strong class="text-emerald-400">Basis for Opinion Section:</strong> Mentions compliance with SAs, ethical responsibilities, and sufficiency of evidence.</li>
          <li><strong class="text-rose-400">Material Uncertainty Related to Going Concern:</strong> (If applicable u/SA 570)</li>
          <li><strong class="text-amber-400">Key Audit Matters (KAM):</strong> (Mandatory for listed entities u/SA 701)</li>
          <li><strong class="text-sky-400">Responsibilities of Management &amp; TCWG</strong></li>
          <li><strong class="text-sky-400">Auditor's Responsibilities for the Audit of the Financial Statements</strong></li>
          <li><strong class="text-violet-400">Other Reporting Responsibilities:</strong> (Sec 143(3), CARO 2020, Rule 11 CAAR)</li>
        </ol>
      </div>
    `,
    summaryClean: "SA 700 orders reports: Opinion first, then Basis for Opinion, Going Concern, KAM, Management Responsibilities, Auditor Responsibilities, and Other Legal Requirements."
  },
  {
    id: 'aud_fc_c7_02',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'SA 701 - Key Audit Matters (KAM) Framework',
    examImportance: 'Critical',
    question: 'How are Key Audit Matters determined, and in what circumstances is KAM communication prohibited?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
          <strong class="text-amber-400 block">Determination of KAM (Three-Step Funnel):</strong>
          1. Matters communicated with TCWG &rarr;<br/>
          2. Matters that required significant auditor attention (high RMM, significant estimates, significant transactions) &rarr;<br/>
          3. Matters of <span class="text-white font-bold underline">most significance</span> in the audit of current period FS = KAM.
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] space-y-1">
          <strong class="text-rose-400 block">Prohibition / Circumstances when KAM is NOT Communicated:</strong>
          • Law or regulation precludes public disclosure about the matter.<br/>
          • In extremely rare cases, auditor determines adverse consequences of communicating matter would reasonably outweigh public interest benefits.<br/>
          • <span class="text-white font-bold">Disclaimer of Opinion:</span> Communicating KAM is strictly PROHIBITED when auditor disclaims an opinion u/SA 705.
        </div>
      </div>
    `,
    summaryClean: "KAM represents matters of most significance communicated to TCWG; communicating KAM is prohibited when disclaiming an opinion or if law precludes disclosure."
  },
  {
    id: 'aud_fc_c7_03',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'SA 705 - Types of Modified Opinions Decision Matrix',
    examImportance: 'Critical',
    question: 'Outline the criteria for issuing a Qualified Opinion, Adverse Opinion, or Disclaimer of Opinion under SA 705.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1 border border-slate-800">Nature of Matter</th>
              <th class="p-1 border border-slate-800 text-amber-400">Material but NOT Pervasive</th>
              <th class="p-1 border border-slate-800 text-rose-400">Material AND Pervasive</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-white">FS are Materially Misstated</td>
              <td class="p-1 border border-slate-800 font-bold text-amber-300">Qualified Opinion ("Except for...")</td>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">Adverse Opinion ("Do not give a true and fair view")</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-white">Inability to Obtain SAAE (Scope Limitation)</td>
              <td class="p-1 border border-slate-800 font-bold text-amber-300">Qualified Opinion ("Except for possible effects...")</td>
              <td class="p-1 border border-slate-800 font-bold text-rose-500">Disclaimer of Opinion ("Do not express an opinion")</td>
            </tr>
          </tbody>
        </table>
        <p class="text-[10px] text-slate-400 bg-slate-950 p-1 rounded border border-slate-850">
          Pervasive effects: (a) Not confined to specific elements, (b) Represent substantial proportion of FS, or (c) Fundamental to user understanding.
        </p>
      </div>
    `,
    summaryClean: "Material but not pervasive = Qualified. Material and pervasive misstatement = Adverse. Material and pervasive limitation on evidence = Disclaimer."
  },
  {
    id: 'aud_fc_c7_04',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'SA 706 - Emphasis of Matter (EOM) vs Other Matter (OM)',
    examImportance: 'Critical',
    question: 'Compare Emphasis of Matter (EOM) and Other Matter (OM) Paragraphs under SA 706.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Emphasis of Matter (EOM):</span>
            Refers to a matter <span class="text-white font-bold underline">appropriately presented or disclosed in FS</span> that, in auditor’s judgment, is of such importance that it is fundamental to users' understanding.<br/>
            • E.g. Major catastrophe, exceptional litigation, early adoption of new standard.<br/>
            • <strong class="text-emerald-400">Does not modify the opinion.</strong>
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-sky-400 font-bold block mb-1">Other Matter (OM):</span>
            Refers to a matter <span class="text-white font-bold underline">other than those presented or disclosed in FS</span> that is relevant to users' understanding of audit, auditor’s responsibilities, or report.<br/>
            • E.g. Prior period FS audited by another auditor, restriction on report distribution, reporting on two FRFs.
          </div>
        </div>
      </div>
    `,
    summaryClean: "EOM highlights fundamental matters already disclosed in the financial statements; OM explains external matters relevant to understanding the audit or report."
  },
  {
    id: 'aud_fc_c7_05',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'CARO 2020 - Critical Clauses 3(i) to 3(v)',
    examImportance: 'Critical',
    question: 'State the reporting requirements under CARO 2020 for Fixed Assets, Inventory, and Loans to Entities.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Clause 3(i) - PPE &amp; Intangibles:</strong> Proper records; physical verification at reasonable intervals; title deeds of all immovable properties held in company name (if not, specify details); whether proceedings initiated for holding <span class="text-white font-bold">Benami property</span>.</li>
          <li><strong class="text-emerald-400">Clause 3(ii) - Inventory:</strong> Coverage &amp; procedure of physical verification; discrepancies &ge; <span class="text-white font-bold">10%</span> in aggregate for each class; sanctioned working capital limits &gt; <span class="text-white font-bold">₹5 Crores</span> on security of current assets and reconciliation with quarterly returns/statements.</li>
          <li><strong class="text-sky-400">Clause 3(iii) - Investments &amp; Loans:</strong> Loans/advances given, guarantees, investments made; whether terms prejudicial; overdue &gt; 90 days (reasonable steps taken); renewals/extensions of overdue loans.</li>
        </ul>
      </div>
    `,
    summaryClean: "CARO 2020 mandates reporting on Benami properties, title deeds, 10% inventory count discrepancies, > ₹5 Cr quarterly working capital reconciliations, and loan renewals."
  },
  {
    id: 'aud_fc_c7_06',
    subjectId: 'Audit',
    category: 'Reporting',
    statutoryRef: 'CARO 2020 - Critical Clauses 3(vii), 3(ix), 3(xi), 3(xvii), 3(xix)',
    examImportance: 'Critical',
    question: 'What are the reporting triggers under CARO 2020 for Statutory Dues, Borrowing Defaults, Frauds, Cash Losses, and Financial Viability?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-rose-400 block">3(vii) Statutory Dues:</strong>
            Undisputed arrears outstanding for &gt; <span class="text-white font-bold">6 months</span> from date payable; disputed dues with forum details.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-rose-400 block">3(ix) Loan Defaults:</strong>
            Default in repayment of loans/interest to any lender; whether declared <span class="text-white font-bold">wilful defaulter</span> by any bank/FI.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-amber-400 block">3(xi) Fraud Reporting:</strong>
            Any fraud by or on company; whether Form ADT-4 filed u/s 143(12); whistleblower complaints received during year.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-amber-400 block">3(xvii) Cash Losses:</strong>
            Amount of cash losses incurred in current financial year AND immediately preceding financial year.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded col-span-2">
            <strong class="text-emerald-400 block">3(xix) Viability (Meeting Liabilities within 1 Year):</strong>
            Whether auditor is of opinion that no material uncertainty exists that company is capable of meeting liabilities existing at balance sheet date as and when they fall due within a period of <span class="text-white font-bold">1 year</span>.
          </div>
        </div>
      </div>
    `,
    summaryClean: "CARO triggers: >6 month statutory dues, loan defaults and wilful defaulter tags, ADT-4 fraud reports, cash loss amounts, and 1-year liability viability."
  },

  // =========================================================================
  // CHAPTER 8: SPECIALISED AREAS (SA 800, 805, 810)
  // =========================================================================
  {
    id: 'aud_fc_c8_01',
    subjectId: 'Audit',
    category: 'Specialised Areas',
    statutoryRef: 'SA 800 - Special Purpose Financial Reporting Frameworks',
    examImportance: 'High',
    question: 'What are the key auditor obligations and mandatory report paragraphs when auditing under SA 800?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Definition:</strong> Financial statements prepared in accordance with a financial reporting framework designed to meet the financial information needs of <span class="text-white font-bold">specific users</span> (e.g. tax basis, contract cash flow basis, regulatory basis).</li>
          <li><strong class="text-emerald-400">Acceptance:</strong> Determine whether the framework is acceptable and understand the purpose for which FS are prepared.</li>
          <li><strong class="text-rose-400">Mandatory EOM Paragraph:</strong> Auditor's report <span class="text-white font-bold underline">MUST include an Emphasis of Matter paragraph</span> alerting users that the financial statements are prepared in accordance with a special purpose framework and that, as a result, they may not be suitable for another purpose.</li>
          <li><strong class="text-sky-400">Restriction on Distribution:</strong> Auditor may consider restricting distribution or use to the specified intended users.</li>
        </ul>
      </div>
    `,
    summaryClean: "SA 800 covers special purpose frameworks and mandates an Emphasis of Matter paragraph alerting users that the financial statements may not be suitable for another purpose."
  },
  {
    id: 'aud_fc_c8_02',
    subjectId: 'Audit',
    category: 'Specialised Areas',
    statutoryRef: 'SA 805 - Single Financial Statement or Specific Element Audits',
    examImportance: 'High',
    question: 'Explain the interplay between an audit of complete financial statements and an audit of a single financial statement under SA 805.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
          <div>• <strong class="text-amber-400">Independent Acceptance:</strong> SA 805 applies even if the auditor is not engaged to audit the complete set of financial statements.</div>
          <div>• <strong class="text-rose-400">Adverse or Disclaimer Restriction:</strong> If the auditor expresses an <span class="text-white font-bold">adverse opinion or disclaims an opinion</span> on the complete set of FS:
            <ul class="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-350">
              <li>Auditor <span class="text-rose-400 font-bold underline">SHALL NOT express an unmodified opinion</span> on a single financial statement of that same set in the SAME auditor's report (doing so contradicts the adverse/disclaimer).</li>
              <li>An unmodified opinion on a specific element may only be expressed in a separate report if that element does not constitute a major portion of the complete FS.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    summaryClean: "Under SA 805, an unmodified opinion on a single statement cannot be included in the same report where the complete financial statements received an Adverse or Disclaimer of Opinion."
  },
  {
    id: 'aud_fc_c8_03',
    subjectId: 'Audit',
    category: 'Specialised Areas',
    statutoryRef: 'SA 810 - Engagements to Report on Summary Financial Statements',
    examImportance: 'High',
    question: 'What are the criteria for accepting and reporting on Summary Financial Statements under SA 810?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Auditor Eligibility:</strong> The auditor shall accept an engagement to report on summary financial statements <span class="text-white font-bold underline">ONLY if the auditor has been engaged to conduct an audit of the financial statements</span> from which the summary statements are derived.</li>
          <li><strong class="text-emerald-400">Core Evaluation:</strong> Evaluate whether summary FS adequately disclose their summarized nature, identify the audited FS, and are consistent with audited FS.</li>
          <li><strong class="text-sky-400">Form of Opinion:</strong> Express whether summary FS are a <span class="text-white font-bold">fair summary</span> of, or <span class="text-white font-bold">consistent in all material respects</span> with, the audited financial statements.</li>
          <li><strong class="text-rose-400">Carry-Forward of Modifications:</strong> If audited FS contained a modified opinion (e.g. qualified/adverse), summary report must state that fact and describe the modification.</li>
        </ul>
      </div>
    `,
    summaryClean: "SA 810 engagements can only be accepted by the auditor of the underlying financial statements; opinion confirms whether the summary is consistent with or a fair summary of the audited FS."
  },

  // =========================================================================
  // CHAPTER 9: RELATED SERVICES (SRS 4400, 4410)
  // =========================================================================
  {
    id: 'aud_fc_c9_01',
    subjectId: 'Audit',
    category: 'Related Services',
    statutoryRef: 'SRS 4400 (Revised) - Agreed-Upon Procedures Engagements',
    examImportance: 'High',
    question: 'State the level of assurance, independence rules, and reporting principles for Agreed-Upon Procedures under SRS 4400.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <div>• <strong class="text-rose-400">Zero Assurance:</strong> Practitioner expresses <span class="text-white font-bold underline">NO assurance</span>. The report consists strictly of a <span class="text-amber-400 font-bold">Report of Factual Findings</span> of the agreed procedures performed.</div>
          <div>• <strong class="text-sky-400">Independence:</strong> Independence is not required by SRS 4400; however, if the practitioner is not independent, that fact must be explicitly stated in the report.</div>
          <div>• <strong class="text-emerald-400">Users Draw Conclusions:</strong> The engaging party and intended users evaluate the factual findings themselves and draw their own conclusions from the practitioner's work.</div>
          <div>• <strong class="text-amber-400">Restricted Distribution:</strong> Distribution of report is restricted to parties that agreed to the procedures to avoid misinterpretation by uninformed third parties.</div>
        </div>
      </div>
    `,
    summaryClean: "SRS 4400 provides zero assurance; reports factual findings to parties who agreed on procedures; independence is not mandatory but lack thereof must be stated."
  },
  {
    id: 'aud_fc_c9_02',
    subjectId: 'Audit',
    category: 'Related Services',
    statutoryRef: 'SRS 4410 (Revised) - Compilation Engagements',
    examImportance: 'High',
    question: 'What are the practitioner’s duties and report requirements in a Compilation Engagement under SRS 4410?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Core Objective:</strong> Apply accounting and financial reporting expertise to assist management in the preparation and presentation of financial information without undertaking to obtain any assurance.</li>
          <li><strong class="text-rose-400">No Assurance:</strong> Practitioner does <span class="text-white font-bold">NOT verify accuracy or completeness</span> of info provided by management; no audit or review opinion expressed.</li>
          <li><strong class="text-emerald-400">Responsibility of Management:</strong> Management retains ultimate responsibility for FS and underlying records.</li>
          <li><strong class="text-sky-400">Independence Disclosure:</strong> Independence is not required. If practitioner is not independent, this fact must be disclosed in the compilation report.</li>
        </ul>
      </div>
    `,
    summaryClean: "SRS 4410 assists management in preparing financial information using accounting expertise with zero assurance; non-independence must be disclosed in the report."
  },

  // =========================================================================
  // CHAPTER 10: REVIEW OF FINANCIAL INFORMATION (SRE 2400, 2410)
  // =========================================================================
  {
    id: 'aud_fc_c10_01',
    subjectId: 'Audit',
    category: 'Review of Financial Information',
    statutoryRef: 'SRE 2400 (Revised) - Review of Historical Financial Statements',
    examImportance: 'Critical',
    question: 'What level of assurance is provided under SRE 2400, and how does its scope differ from an audit?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1.5 bg-slate-900/50 p-2.5 rounded border border-slate-800 text-[11px]">
          <div>• <strong class="text-emerald-400">Assurance Level:</strong> <span class="text-white font-bold">Limited (Moderate) Assurance</span>. Expressed in a negative form ("Nothing has come to our attention that causes us to believe that these financial statements do not give a true and fair view...").</div>
          <div>• <strong class="text-amber-400">Core Procedures:</strong> Primarily consists of making <span class="text-white font-bold">Inquiries</span> of management and applying <span class="text-white font-bold">Analytical Procedures</span>.</div>
          <div>• <strong class="text-rose-400">Procedures NOT Performed:</strong> Does NOT ordinarily include testing accounting records through inspection, observation, confirmation, or testing internal controls.</div>
        </div>
      </div>
    `,
    summaryClean: "SRE 2400 provides limited assurance expressed negatively, relying primarily on inquiries and analytical procedures without substantive testing of accounting records."
  },
  {
    id: 'aud_fc_c10_02',
    subjectId: 'Audit',
    category: 'Review of Financial Information',
    statutoryRef: 'SRE 2410 - Review of Interim Financial Information by Independent Auditor',
    examImportance: 'Critical',
    question: 'What are the specific requirements for an auditor conducting an Interim Review under SRE 2410?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Pre-requisite:</strong> SRE 2410 applies <span class="text-white font-bold underline">ONLY to the entity’s independent statutory auditor</span> (an external accountant who is not the statutory auditor uses SRE 2400).</li>
          <li><strong class="text-emerald-400">Updating Knowledge:</strong> Auditor updates their understanding of the entity and its environment, including internal controls, from the preceding annual audit.</li>
          <li><strong class="text-sky-400">Procedures:</strong> Inquiries regarding significant changes in internal control; analytical procedures comparing interim periods with prior periods and budgets; reading minutes of meetings.</li>
          <li><strong class="text-rose-400">Departure from FRF:</strong> If interim information departs materially from applicable FRF, express a <span class="text-white font-bold">Qualified or Adverse review conclusion</span>.</li>
        </ul>
      </div>
    `,
    summaryClean: "SRE 2410 applies solely to the entity's statutory auditor reviewing interim financial statements, updating prior audit knowledge and issuing a limited assurance conclusion."
  },

  // =========================================================================
  // CHAPTER 11: PROSPECTIVE FINANCIAL INFORMATION & OTHER ASSURANCE (SAE 3400, 3402, 3420)
  // =========================================================================
  {
    id: 'aud_fc_c11_01',
    subjectId: 'Audit',
    category: 'Prospective Financial Information and Other Assurance Services',
    statutoryRef: 'SAE 3400 - The Examination of Prospective Financial Information',
    examImportance: 'Critical',
    question: 'Distinguish Forecast vs Projection under SAE 3400, and state mandatory report disclaimers.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Forecast:</span>
            PFI prepared on the basis of assumptions as to future events which management <strong class="text-white">expects to take place</strong> and actions management expects to take (<span class="underline">best-estimate assumptions</span>).
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Projection:</span>
            PFI prepared on the basis of <strong class="text-white">hypothetical assumptions</strong> about future events/actions (e.g. startup scenario or what-if analysis) or a mix of best-estimates and hypothetical assumptions.
          </div>
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] space-y-0.5">
          <strong class="text-rose-400 block">Mandatory Report Disclaimers:</strong>
          • Practitioner provides <span class="text-white font-bold">negative assurance</span> on whether assumptions provide a reasonable basis.<br/>
          • Explicit disclaimer stating that <span class="text-white font-bold underline">actual results are likely to be different from PFI</span> since anticipated events frequently do not occur as expected.
        </div>
      </div>
    `,
    summaryClean: "Forecasts use best-estimates; projections use hypothetical scenarios. SAE 3400 reports provide negative assurance on assumptions and an explicit disclaimer on actual realization."
  },
  {
    id: 'aud_fc_c11_02',
    subjectId: 'Audit',
    category: 'Prospective Financial Information and Other Assurance Services',
    statutoryRef: 'SAE 3402 - Assurance Reports on Controls at a Service Organization',
    examImportance: 'High',
    question: 'Compare Type 1 and Type 2 Assurance Reports under SAE 3402.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1.5 border border-slate-800">Aspect</th>
              <th class="p-1.5 border border-slate-800 text-amber-400">Type 1 Report</th>
              <th class="p-1.5 border border-slate-800 text-emerald-400">Type 2 Report</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Scope of Opinion</td>
              <td class="p-1.5 border border-slate-800">Fair presentation of description and <strong class="text-white">suitability of design</strong> of controls.</td>
              <td class="p-1.5 border border-slate-800">Fair presentation, design suitability <strong class="text-emerald-400">AND operating effectiveness</strong> of controls.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Time Horizon</td>
              <td class="p-1.5 border border-slate-800">As of a <strong class="text-white">specific date</strong> (point in time).</td>
              <td class="p-1.5 border border-slate-800">Throughout a <strong class="text-white">specified period</strong> (minimum 6 months).</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">User Auditor Reliance</td>
              <td class="p-1.5 border border-slate-800">Assists in understanding controls; <span class="text-rose-400">cannot support reduced control risk</span>.</td>
              <td class="p-1.5 border border-slate-800"><span class="text-emerald-400">Can be used as audit evidence</span> to reduce assessed control risk.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Type 1 covers control design at a single date; Type 2 covers design and operating effectiveness over a period, allowing the user auditor to reduce assessed control risk."
  },
  {
    id: 'aud_fc_c11_03',
    subjectId: 'Audit',
    category: 'Prospective Financial Information and Other Assurance Services',
    statutoryRef: 'SAE 3420 - Compilation of Pro Forma Financial Information in a Prospectus',
    examImportance: 'High',
    question: 'What is the objective and reporting opinion in a Pro Forma assurance engagement under SAE 3420?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Objective of Pro Forma Information:</strong> Illustrates the impact of a significant event or transaction (e.g. major acquisition, divestment, merger) on unadjusted financial information as if the event had occurred at an earlier date.</li>
          <li><strong class="text-emerald-400">Practitioner’s Objective:</strong> Obtain reasonable assurance about whether the pro forma financial information has been <span class="text-white font-bold underline">compiled, in all material respects, by the responsible party on the basis of the applicable criteria</span>.</li>
          <li><strong class="text-sky-400">Procedures:</strong> Verify unadjusted source figures from audited/reviewed FS; evaluate whether pro forma adjustments are directly attributable and factually supportable.</li>
          <li><strong class="text-rose-400">Limit of Opinion:</strong> Practitioner does <span class="text-white font-bold">NOT audit or review the underlying historical or prospective information</span>; opinion addresses solely the compilation process.</li>
        </ul>
      </div>
    `,
    summaryClean: "SAE 3420 evaluates whether pro forma financial information in a prospectus is compiled properly on the basis of applicable criteria without auditing the underlying historical source data."
  }
];
