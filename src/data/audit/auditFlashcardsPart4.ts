/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL PAPER 3: AUDIT FLASHCARDS - PART 4 (CHAPTERS 16 TO 19)
 * Internal Audit, Due Diligence & Forensics, ESG Assurance, Professional Ethics
 */

import { Flashcard } from '../flashcards';

export const AUDIT_FLASHCARDS_PART4: Flashcard[] = [
  // =========================================================================
  // CHAPTER 16: INTERNAL AUDIT
  // =========================================================================
  {
    id: 'aud_fc_c16_01',
    subjectId: 'Audit',
    category: 'Internal Audit',
    statutoryRef: 'Section 138 & Rule 13 CAAR - Mandatory Internal Audit Thresholds',
    examImportance: 'Critical',
    question: 'State the exact statutory applicability thresholds for internal audit under Section 138 and Rule 13.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1 border border-slate-800">Class of Company</th>
              <th class="p-1 border border-slate-800">Statutory Thresholds (Preceding Financial Year)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-amber-400">Listed Company</td>
              <td class="p-1 border border-slate-800 font-bold text-white">Always Mandatory (no thresholds)</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-emerald-400">Unlisted Public Company</td>
              <td class="p-1 border border-slate-800 space-y-0.5">
                • Paid-up Capital &ge; <strong class="text-white">₹50 Crores</strong>; OR<br/>
                • Turnover &ge; <strong class="text-white">₹200 Crores</strong>; OR<br/>
                • Outstanding Loans/Borrowings from banks/PFIs &ge; <strong class="text-white">₹100 Crores</strong> at any point; OR<br/>
                • Outstanding Deposits &ge; <strong class="text-white">₹25 Crores</strong> at any point.
              </td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-sky-400">Private Company</td>
              <td class="p-1 border border-slate-800 space-y-0.5">
                • Turnover &ge; <strong class="text-white">₹200 Crores</strong>; OR<br/>
                • Outstanding Loans/Borrowings from banks/PFIs &ge; <strong class="text-white">₹100 Crores</strong> at any point.
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-[10px] text-slate-400 bg-slate-950 p-1 rounded border border-slate-850">
          Eligibility: Chartered Accountant, Cost Accountant, or such other professional as decided by the Board. Can be an internal employee or external consultant.
        </p>
      </div>
    `,
    summaryClean: "Sec 138: All listed; Unlisted public: Capital ≥50Cr, Turnover ≥200Cr, Loans ≥100Cr, Deposits ≥25Cr; Private: Turnover ≥200Cr, Loans ≥100Cr."
  },
  {
    id: 'aud_fc_c16_02',
    subjectId: 'Audit',
    category: 'Internal Audit',
    statutoryRef: 'Standards on Internal Audit (SIA) - Core Framework & Objectivity',
    examImportance: 'High',
    question: 'How do ICAI Standards on Internal Audit (SIA) safeguard the independence and objectivity of internal auditors?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Reporting Line:</strong> The Chief Internal Auditor should report functionally to the <span class="text-white font-bold underline">Audit Committee / Board</span> and administratively to the CEO/MD to ensure structural independence from operational line management.</li>
          <li><strong class="text-emerald-400">Objectivity Rule:</strong> Internal auditors must not assume operational responsibilities or direct operational management decisions (e.g. approving purchases or preparing accounts).</li>
          <li><strong class="text-sky-400">Internal Audit Charter (SIA 210):</strong> Mandatory written charter defining scope, authority, roles, and unrestricted access to records, personnel, and properties approved by Audit Committee.</li>
          <li><strong class="text-rose-400">Statutory Auditor Prohibition:</strong> The statutory auditor of a company <span class="text-white font-bold underline">CANNOT be appointed as its internal auditor</span> (prohibited by Section 144 of the Companies Act, 2013).</li>
        </ul>
      </div>
    `,
    summaryClean: "Internal auditors must report functionally to the Audit Committee, avoid operational execution, operate under an approved Charter, and cannot serve as the company's statutory auditor."
  },
  {
    id: 'aud_fc_c16_03',
    subjectId: 'Audit',
    category: 'Internal Audit',
    statutoryRef: 'COSO Internal Control Integrated Framework - 17 Principles',
    examImportance: 'High',
    question: 'Enumerate the 5 components and key principles of the COSO Internal Control Framework.',
    answerHtml: `
      <div class="space-y-1.5 font-sans text-xs text-[11px] bg-slate-900/50 p-2.5 rounded border border-slate-800">
        <div>1. <strong class="text-amber-400">Control Environment (Principles 1-5):</strong> Commitment to integrity &amp; ethics, board independence, oversight structures, attracting competent personnel, holding accountability.</div>
        <div>2. <strong class="text-emerald-400">Risk Assessment (Principles 6-9):</strong> Specifying suitable objectives, identifying &amp; analyzing enterprise risks, assessing fraud risk, identifying significant changes.</div>
        <div>3. <strong class="text-sky-400">Control Activities (Principles 10-12):</strong> Selecting controls mitigating risk, selecting general IT controls, deploying controls through policies and procedures.</div>
        <div>4. <strong class="text-violet-400">Information &amp; Communication (Principles 13-15):</strong> Using relevant quality information, internal communication, external communication.</div>
        <div>5. <strong class="text-rose-400">Monitoring Activities (Principles 16-17):</strong> Conducting ongoing/separate evaluations, evaluating &amp; communicating deficiencies to management/board.</div>
      </div>
    `,
    summaryClean: "COSO consists of 5 components housing 17 principles spanning Control Environment, Risk Assessment, Control Activities, Information/Communication, and Monitoring."
  },

  // =========================================================================
  // CHAPTER 17: DUE DILIGENCE, INVESTIGATION & FORENSIC AUDIT
  // =========================================================================
  {
    id: 'aud_fc_c17_01',
    subjectId: 'Audit',
    category: 'Due Diligence, Investigation & Forensic Audit',
    statutoryRef: 'Audit vs Due Diligence vs Investigation - Comparative Matrix',
    examImportance: 'Critical',
    question: 'Compare Statutory Audit, Due Diligence, and Investigation across Objective, Scope, and Periodicity.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1 border border-slate-800">Feature</th>
              <th class="p-1 border border-slate-800 text-amber-400">Statutory Audit</th>
              <th class="p-1 border border-slate-800 text-emerald-400">Due Diligence</th>
              <th class="p-1 border border-slate-800 text-rose-400">Investigation</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-white">Objective</td>
              <td class="p-1 border border-slate-800">Expression of opinion on true and fair view of FS.</td>
              <td class="p-1 border border-slate-800">Assisting acquirer/investor evaluate commercial viability and risks.</td>
              <td class="p-1 border border-slate-800">Establish facts regarding suspected fraud, misappropriation, or breach.</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-white">Scope</td>
              <td class="p-1 border border-slate-800">Governed by SAs and statute (Companies Act).</td>
              <td class="p-1 border border-slate-800">Agreed with engaging client (commercial focus).</td>
              <td class="p-1 border border-slate-800">Defined by terms of appointment / court order.</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-white">Attitude</td>
              <td class="p-1 border border-slate-800">Professional Skepticism (not suspicious).</td>
              <td class="p-1 border border-slate-800">Investigative &amp; critical risk appraisal.</td>
              <td class="p-1 border border-slate-800">Inquisitorial and deeply suspicious mindset.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Statutory audit gives true and fair opinion; due diligence evaluates commercial investment risks; investigation establishes legal facts behind suspected fraud or misconduct."
  },
  {
    id: 'aud_fc_c17_02',
    subjectId: 'Audit',
    category: 'Due Diligence, Investigation & Forensic Audit',
    statutoryRef: 'Forensic Audit - Benford’s Law & Exception Analysis',
    examImportance: 'High',
    question: 'How does Benford’s Law operate as a forensic audit tool to detect anomalies?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Mathematical Premise of Benford's Law:</p>
        <p class="text-[11px] text-slate-350 bg-slate-900/50 p-2 rounded border border-slate-800">
          In naturally occurring numerical datasets, the probability of the first leading digit <span class="text-white font-bold">d (1 to 9)</span> is: 
          <span class="text-emerald-400 font-bold">P(d) = log<sub>10</sub>(1 + 1/d)</span>.
        </p>
        <div class="grid grid-cols-3 gap-1.5 text-[11px]">
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Digit '1':</strong> Appears as first digit ~<span class="text-amber-300 font-bold">30.1%</span> of the time.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Digit '2':</strong> Appears as first digit ~<span class="text-amber-300 font-bold">17.6%</span> of the time.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Digit '9':</strong> Appears as first digit ~<span class="text-amber-300 font-bold">4.6%</span> of the time.
          </div>
        </div>
        <p class="text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-850">
          Forensic Application: If human fraudsters fabricate fictitious invoice numbers, vendor disbursements, or petty cash vouchers, they distribute digits uniformly or cluster numbers just below approval thresholds (e.g. ₹49,999), creating abnormal statistical spikes that violate Benford's curve.
        </p>
      </div>
    `,
    summaryClean: "Benford's Law predicts natural leading digit frequencies (digit 1 appears ~30.1% vs digit 9 ~4.6%). Statistical deviations flag fabricated invoices and threshold-avoidance fraud."
  },
  {
    id: 'aud_fc_c17_03',
    subjectId: 'Audit',
    category: 'Due Diligence, Investigation & Forensic Audit',
    statutoryRef: 'Forensic Audit - Fraud Triangle vs Fraud Diamond',
    examImportance: 'High',
    question: 'Compare the Fraud Triangle with Wolfe & Hermanson’s Fraud Diamond framework.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Fraud Triangle (Cressey):</span>
            1. <strong class="text-white">Incentive / Pressure:</strong> Personal financial distress or bonus targets.<br/>
            2. <strong class="text-white">Opportunity:</strong> Internal control gaps or lack of oversight.<br/>
            3. <strong class="text-white">Rationalization:</strong> Moral justification of dishonest acts.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Fraud Diamond (Wolfe &amp; Hermanson):</span>
            Adds the fourth critical element: <strong class="text-emerald-400">Capability</strong>.<br/>
            • Technical skills and intellect to execute and conceal the fraud.<br/>
            • Positional authority &amp; ability to coerce subordinates.<br/>
            • Stress tolerance &amp; deceit capability.
          </div>
        </div>
      </div>
    `,
    summaryClean: "The Fraud Triangle contains Incentive, Opportunity, and Rationalization; the Fraud Diamond introduces the 4th element: Capability (skills, authority, and deceit to execute)."
  },

  // =========================================================================
  // CHAPTER 18: SUSTAINABLE DEVELOPMENT GOALS (SDG) & ESG ASSURANCE
  // =========================================================================
  {
    id: 'aud_fc_c18_01',
    subjectId: 'Audit',
    category: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    statutoryRef: 'SEBI LODR & BRSR Core - Assurance Mandate on ESG Disclosures',
    examImportance: 'Critical',
    question: 'What is BRSR Core and what are the SEBI phase-in assurance mandates for listed entities?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">BRSR Core Definition:</strong> A sub-set of the Business Responsibility and Sustainability Report (BRSR), consisting of <span class="text-white font-bold">9 key ESG attributes and specific measurable KPIs</span> (e.g. GHG footprint, water consumption intensity, gender diversity, median wage ratios, vendor job creation).</li>
          <li><strong class="text-emerald-400">SEBI Assurance Mandate Phase-In:</strong>
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>FY 2023-24: Top <span class="text-white font-bold">150</span> listed entities (reasonable assurance).</li>
              <li>FY 2024-25: Top <span class="text-white font-bold">250</span> listed entities.</li>
              <li>FY 2025-26: Top <span class="text-white font-bold">500</span> listed entities.</li>
              <li>FY 2026-27: Top <span class="text-white font-bold">1000</span> listed entities.</li>
            </ul>
          </li>
          <li><strong class="text-rose-400">Assurance Provider Independence:</strong> Assurance provider must possess technical competence in ESG metrics and shall not have conflict of interest (e.g. cannot sell carbon credits to the entity).</li>
        </ul>
      </div>
    `,
    summaryClean: "BRSR Core mandates quantified KPIs on 9 ESG attributes with phased reasonable assurance for top 150 (FY24), 250 (FY25), 500 (FY26), and 1000 (FY27) listed entities."
  },
  {
    id: 'aud_fc_c18_02',
    subjectId: 'Audit',
    category: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    statutoryRef: 'ESG Assurance - Scope 1, Scope 2, and Scope 3 GHG Emissions Quantification',
    examImportance: 'High',
    question: 'Distinguish between Scope 1, Scope 2, and Scope 3 Greenhouse Gas (GHG) Emissions under the GHG Protocol.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-3 gap-1.5 text-[11px]">
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-amber-400 block">Scope 1 (Direct):</strong>
            Direct GHG emissions from sources owned or controlled by the entity (e.g. factory boilers, company-owned vehicles, on-site fuel combustion).
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-emerald-400 block">Scope 2 (Indirect - Energy):</strong>
            Indirect GHG emissions resulting from generation of <span class="text-white font-bold">purchased electricity, steam, heating, and cooling</span> consumed by the entity.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-sky-400 block">Scope 3 (Value Chain):</strong>
            All other indirect emissions in upstream and downstream value chain (e.g. purchased raw materials, business travel, product shipping, product usage and disposal).
          </div>
        </div>
      </div>
    `,
    summaryClean: "Scope 1: Direct emissions from owned assets; Scope 2: Indirect emissions from purchased electricity/heating; Scope 3: Upstream and downstream value chain emissions."
  },
  {
    id: 'aud_fc_c18_03',
    subjectId: 'Audit',
    category: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    statutoryRef: 'SSAE 3000 & Social Audit Standards (SAS)',
    examImportance: 'High',
    question: 'What is the role of SSAE 3000 and Social Audit Standards (SAS) in Social Stock Exchange (SSE) assurance?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">SSAE 3000:</strong> Standard on Sustainability Assurance Engagements issued by ICAI; provides framework for assurance engagements on non-financial sustainability information, covering engagement acceptance, planning, evidence gathering, and reporting.</li>
          <li><strong class="text-emerald-400">Social Stock Exchange (SSE) Framework:</strong> SEBI framework allowing Non-Profit Organizations (NPOs) and For-Profit Social Enterprises (FPSEs) to raise capital based on social intent and quantifiable social impact.</li>
          <li><strong class="text-sky-400">Social Audit Standards (SAS):</strong> 16 thematic standards issued by ICAI (SAS 100 to 1600) covering eradicating hunger, education, healthcare, gender equality, etc.</li>
          <li><strong class="text-violet-400">Social Auditor Eligibility:</strong> Must be an individual registered with a Self-Regulatory Organization (SRO) under ICAI, qualified via the NISM Series XXIII Social Auditors Certification Examination.</li>
        </ul>
      </div>
    `,
    summaryClean: "SSAE 3000 governs sustainability assurance; ICAI's 16 Social Audit Standards (SAS) govern Social Stock Exchange impact audits conducted by certified Social Auditors."
  },

  // =========================================================================
  // CHAPTER 19: PROFESSIONAL ETHICS & LIABILITIES OF AUDITORS
  // =========================================================================
  {
    id: 'aud_fc_c19_01',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I, Clause (1) & (2) - Fee Sharing & Partnerships',
    examImportance: 'Critical',
    question: 'With whom may a Chartered Accountant in practice share fees or profits under Clauses (1) & (2) of Part I of the First Schedule?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
          <strong class="text-amber-400 block">Clause (1) - Sharing Fees or Profits:</strong>
          A CA in practice is deemed guilty of professional misconduct if they share fees/profits with anyone <span class="text-rose-400 font-bold">OTHER THAN:</span><br/>
          • Another member of ICAI in practice;<br/>
          • A partner of the firm;<br/>
          • A member of recognized foreign professional body (e.g. CPA, ACCA) under reciprocal agreements;<br/>
          • Legal heirs of a deceased partner (as per partnership deed goodwill clause);<br/>
          • Specified professionals under <span class="text-white font-bold">Regulation 53B</span> (CS, CWA/CMA, Advocate, Architect, Actuary, Registered Valuer).
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] space-y-0.5">
          <strong class="text-emerald-400 block">Clause (2) - Accepting Share of Profits:</strong>
          Prohibits accepting or taking any part of the profits of the professional work of a person who is not a member of the Institute (with same exceptions).
        </div>
      </div>
    `,
    summaryClean: "A CA in practice may only share fees with other practicing CAs, partners, permitted foreign bodies, deceased partner legal heirs, or Regulation 53B professionals."
  },
  {
    id: 'aud_fc_c19_02',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I, Clause (6) - Solicitation of Professional Work',
    examImportance: 'Critical',
    question: 'What constitutes professional misconduct under Clause (6) regarding solicitation of clients, tenders, and website guidelines?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-850 text-[11px]">
          <li><strong class="text-rose-400">Absolute Ban on Direct/Indirect Solicitation:</strong> Circulars, advertisements, personal communications, or interviews soliciting work are strictly prohibited.</li>
          <li><strong class="text-amber-400">Tenders Exception:</strong> A member can respond to tenders/RFPs <span class="text-white font-bold underline">ONLY if minimum fee is prescribed</span> or if tender is open exclusively to CAs; cannot respond to open commercial tenders with unconstrained bidding.</li>
          <li><strong class="text-sky-400">Website Guidelines:</strong>
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>Must operate on "Pull" mode; no push notifications or pop-ups.</li>
              <li>Names of clients and fees charged <span class="text-rose-400 font-bold underline">CANNOT be displayed</span> without regulatory mandate.</li>
              <li>Format and design must be sober and dignified.</li>
            </ul>
          </li>
        </ul>
      </div>
    `,
    summaryClean: "Clause (6) bans client solicitation. Tenders are permitted only when minimum fees are prescribed; firm websites must operate strictly in pull mode without client lists."
  },
  {
    id: 'aud_fc_c19_03',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I, Clause (7) - Advertising Attainments & Visiting Cards',
    examImportance: 'High',
    question: 'What are the restrictions on using designations and advertising professional attainments under Clause (7)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Designation Restriction:</strong> Only the designation <span class="text-white font-bold">"Chartered Accountant"</span> can be used on letterheads, visiting cards, and name boards.</li>
          <li><strong class="text-rose-400">Prohibited Designations:</strong> Words like "Income Tax Consultant", "Cost Consultant", "Management Consultant", or "GST Specialist" are strictly <span class="text-rose-400 font-bold underline">PROHIBITED</span>.</li>
          <li><strong class="text-emerald-400">Degrees &amp; Recognized Titles:</strong> Degrees of recognized universities (e.g. B.Com, LL.B.) and ICAI post-qualification titles (e.g. DISA) are permitted.</li>
          <li><strong class="text-sky-400">Visiting Cards:</strong> Name of firm, partner name, address, contact numbers, email, website, and ICAI emblem (with guidelines) are permitted. QR codes directing to contact details are allowed.</li>
        </ul>
      </div>
    `,
    summaryClean: "Only 'Chartered Accountant' may be used as a professional designation; specialty titles like 'Tax Consultant' are prohibited. University degrees and DISA are permitted."
  },
  {
    id: 'aud_fc_c19_04',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I, Clause (8) - Communication with Retiring Auditor',
    examImportance: 'Critical',
    question: 'Explain the mandatory protocol and mode of communication with the previous/retiring auditor under Clause (8).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
          <div>• <strong class="text-amber-400">Mandatory Written Communication:</strong> Acceptance of an audit without <span class="text-white font-bold underline">first communicating with the previous auditor in writing</span> constitutes professional misconduct.</div>
          <div>• <strong class="text-emerald-400">Permitted Modes of Communication:</strong>
            <ul class="list-disc pl-4 mt-0.5 space-y-0.5 text-slate-350">
              <li>Registered Post Acknowledgement Due (RPAD).</li>
              <li>Speed Post with written tracking proof of delivery.</li>
              <li>Hand delivery with written acknowledgement receipt.</li>
              <li>Email to the registered email ID of the previous auditor (with proof of delivery).</li>
            </ul>
          </div>
          <div>• <strong class="text-rose-400">Timing:</strong> Communication must be sent <span class="text-white font-bold underline">BEFORE accepting the appointment</span>, not after acceptance. Waiting for reply is desirable (ordinarily 15 days), but non-receipt of reply after valid proof of delivery does not stall acceptance.</div>
        </div>
      </div>
    `,
    summaryClean: "Clause (8) mandates prior written communication with the retiring auditor via RPAD, Speed Post, hand delivery, or official email with delivery proof before acceptance."
  },
  {
    id: 'aud_fc_c19_05',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I, Clause (10) - Contingent Fees & Regulation 192',
    examImportance: 'Critical',
    question: 'When is charging fees based on percentages or contingencies permitted under Regulation 192?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Permitted Exceptions to Contingent Fee Prohibition (Regulation 192):</p>
        <ol class="list-decimal list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li>In the case of a receiver or liquidator, fees based on a percentage of the realization of assets.</li>
          <li>In the case of an auditor of a cooperative society, where fees are based on percentage of paid-up capital/working capital/turnover fixed by the Registrar of Co-operative Societies.</li>
          <li>In the case of a valuer for the purposes of direct taxes and duties, fees based on value of property.</li>
          <li>Certain non-audit services such as debt recovery consultancy or fund syndication where permitted by specific guidelines.</li>
          <li><span class="text-rose-400 font-bold underline">STRICT PROHIBITION:</span> Success-fee or contingent-fee charging for <span class="text-white font-bold">Statutory Audit, Tax Audit, or Review Engagements</span> is absolutely prohibited under all circumstances.</li>
        </ol>
      </div>
    `,
    summaryClean: "Contingent fees are prohibited except under Regulation 192 for liquidators, co-operative societies fixed by Registrar, and statutory valuations. Never allowed for statutory/tax audits."
  },
  {
    id: 'aud_fc_c19_06',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'First Schedule, Part I, Clause (11) - Other Business / Occupations & Permissions',
    examImportance: 'Critical',
    question: 'Distinguish between General Permission and Specific Permission for engaging in other businesses under Clause (11).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">General Permission (No Prior Approval Needed):</span>
            • Author of books/articles<br/>
            • Private tutoring (teaching &le; 25 hours per week)<br/>
            • Directorship in a company as Director Simpliciter (independent/non-executive)<br/>
            • Holding interest in family business without active management participation<br/>
            • Honorary office-bearer of charitable trusts/NGOs
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">Specific Permission (Prior Council Approval Mandatory):</span>
            • Full-time / part-time employment in business<br/>
            • Managing Director (MD) or Whole-Time Director (WTD)<br/>
            • Active partner in another non-CA business firm<br/>
            • Engaging in agricultural farming as primary commercial activity<br/>
            • Teaching in university/colleges exceeding 25 hours per week
          </div>
        </div>
      </div>
    `,
    summaryClean: "General permission applies to authoring, teaching ≤25 hrs/wk, and non-executive directorships; specific prior Council permission is required for MD/WTD roles and commercial business partnerships."
  },
  {
    id: 'aud_fc_c19_07',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'Second Schedule, Part I, Clause (7) - Gross Negligence in Professional Duties',
    examImportance: 'Critical',
    question: 'What acts establish "Gross Negligence" under Clause (7) of Part I of the Second Schedule?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Concept of Gross Negligence:</p>
        <p class="text-[11px] text-slate-350 bg-slate-900/50 p-2 rounded border border-slate-800">
          A member in practice is deemed guilty of professional misconduct if they <span class="text-white font-bold underline">fail to exercise due diligence, or are grossly negligent in the conduct of their professional duties</span>.
        </p>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] space-y-0.5">
          <strong class="text-amber-400 block">Judicial Precedents &amp; Failure Scenarios:</strong>
          • Signing balance sheet and audit report without verifying trial balance or bank reconciliation statements.<br/>
          • Blindly relying on management representations without checking external confirmations (debtors/creditors).<br/>
          • Certifying turnover or net worth certificates without examining underlying books of accounts.<br/>
          • Failure to check whether statutory provisions regarding depreciation or income tax were complied with.
        </div>
      </div>
    `,
    summaryClean: "Gross negligence occurs when a CA exhibits failure to exercise due care, such as certifying accounts without examining books, ignoring bank reconciliations, or omitting external confirmations."
  },
  {
    id: 'aud_fc_c19_08',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'ICAI Code of Ethics - NOCLAR Framework',
    examImportance: 'Critical',
    question: 'State the applicability and response framework for Non-Compliance with Laws and Regulations (NOCLAR).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Applicability in India:</strong> Currently applicable to audit of financial statements of <span class="text-white font-bold underline">Listed Entities</span> (and senior professional accountants in service of listed entities).</li>
          <li><strong class="text-emerald-400">Scope of Laws:</strong> Laws directly affecting determination of material amounts in FS, or compliance with which is fundamental to operating aspects, avoiding significant penalties, or continuation of business. Excludes personal misconduct unrelated to business.</li>
          <li><strong class="text-sky-400">Auditor Action Protocol:</strong>
            <ol class="list-decimal pl-4 space-y-0.5 text-slate-350">
              <li>Understand the matter and advise management/TCWG to rectify, remediate, or disclose.</li>
              <li>Evaluate the appropriateness of management's response.</li>
              <li>Determine whether further action is needed in the <span class="text-white font-bold">Public Interest</span> (including disclosure to an appropriate external authority, notwithstanding duty of confidentiality).</li>
            </ol>
          </li>
          <li><strong class="text-rose-400">Whistleblower Protection:</strong> Disclosure in good faith under NOCLAR does not constitute a breach of client confidentiality under Clause (1) of Part I of Second Schedule.</li>
        </ul>
      </div>
    `,
    summaryClean: "NOCLAR applies to listed entity audits; requires advising management to remediate non-compliance; permits disclosure to regulatory authorities in public interest overriding confidentiality."
  },
  {
    id: 'aud_fc_c19_09',
    subjectId: 'Audit',
    category: 'Professional Ethics & Liabilities of Auditors',
    statutoryRef: 'Peer Review Board vs Quality Review Board (QRB) vs NFRA',
    examImportance: 'Critical',
    question: 'Compare the mandates of Peer Review Board (ICAI), Quality Review Board (QRB), and NFRA.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1 border border-slate-800">Authority</th>
              <th class="p-1 border border-slate-800">Origin / Statute</th>
              <th class="p-1 border border-slate-800">Mandate &amp; Primary Focus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-amber-400">Peer Review Board</td>
              <td class="p-1 border border-slate-800">ICAI Council Framework</td>
              <td class="p-1 border border-slate-800">Evaluation of firm's quality control systems and compliance with Technical Standards (educative and developmental; not disciplinary). Mandatory for listed &amp; public interest firms.</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-emerald-400">Quality Review Board (QRB)</td>
              <td class="p-1 border border-slate-800">Sec 28A of CA Act, 1949</td>
              <td class="p-1 border border-slate-800">Reviews quality of services rendered by members in unlisted public/private companies not falling under NFRA jurisdiction; recommends disciplinary action to ICAI Council.</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">NFRA</td>
              <td class="p-1 border border-slate-800">Sec 132 of Companies Act, 2013</td>
              <td class="p-1 border border-slate-800">Independent statutory regulator for listed companies, large unlisted public companies (paid-up capital &ge; ₹500 Cr, turnover &ge; ₹1,000 Cr, loans &ge; ₹500 Cr), banks, insurance, electricity. Has exclusive powers of investigation, debarring auditors (6 months to 10 years), and imposing heavy penalties.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Peer Review evaluates firm QC systems developmentally; QRB monitors non-NFRA audit quality; NFRA has exclusive statutory regulatory and debarment powers over listed and large public companies."
  }
];
