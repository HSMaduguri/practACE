/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL PAPER 3: AUDIT FLASHCARDS - PART 3 (CHAPTERS 12 TO 15)
 * Digital Auditing, Group Audits, Bank & NBFC Audit, PSU Audits
 */

import { Flashcard } from '../flashcards';

export const AUDIT_FLASHCARDS_PART3: Flashcard[] = [
  // =========================================================================
  // CHAPTER 12: DIGITAL AUDITING & ASSURANCE
  // =========================================================================
  {
    id: 'aud_fc_c12_01',
    subjectId: 'Audit',
    category: 'Digital Auditing & Assurance',
    statutoryRef: 'Digital Auditing - GITC vs Application Controls',
    examImportance: 'Critical',
    question: 'Compare General IT Controls (GITCs) and Automated Application Controls.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-amber-400 font-bold block mb-1">General IT Controls (GITCs):</span>
            Policies and practices that apply to <strong class="text-white">all or many systems/applications</strong> and support their effective functioning.<br/>
            • <strong class="text-white">4 Core Domains:</strong>
            <ul class="list-disc pl-3 text-slate-350 mt-0.5 space-y-0.5">
              <li>Access Security (user auth, passwords, segregation of duties)</li>
              <li>Change Management (testing, approval, promotion to prod)</li>
              <li>Data Center &amp; Network Operations (backups, job scheduling)</li>
              <li>Program Development (acquisition, implementation)</li>
            </ul>
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900 rounded">
            <span class="text-emerald-400 font-bold block mb-1">Application Controls:</span>
            Automated procedures that operate at a <strong class="text-white">business process/transaction level</strong> within a specific software application.<br/>
            • <strong class="text-white">Examples:</strong>
            <ul class="list-disc pl-3 text-slate-350 mt-0.5 space-y-0.5">
              <li>Input validations (format checks, mandatory fields)</li>
              <li>Processing limits &amp; tolerance checks</li>
              <li>Three-way matching (PO, GRN, Vendor Invoice)</li>
              <li>Master data configuration &amp; calculation rules</li>
            </ul>
          </div>
        </div>
        <p class="text-[10px] text-slate-400 bg-slate-950 p-1 rounded border border-slate-850">
          Interdependence: If GITCs are ineffective, the auditor cannot rely on automated application controls without testing them substantively on an individual transaction basis.
        </p>
      </div>
    `,
    summaryClean: "GITCs govern security, changes, operations, and development across systems; Application controls validate inputs, calculations, and matching within specific software."
  },
  {
    id: 'aud_fc_c12_02',
    subjectId: 'Audit',
    category: 'Digital Auditing & Assurance',
    statutoryRef: 'Digital Auditing - Computer-Assisted Audit Techniques (CAATs)',
    examImportance: 'High',
    question: 'Describe the main CAAT approaches: Test Data, Parallel Simulation, and Embedded Audit Modules.',
    answerHtml: `
      <div class="space-y-1.5 font-sans text-xs text-[11px] bg-slate-900/50 p-2.5 rounded border border-slate-800">
        <div>• <strong class="text-amber-400">Test Data Approach:</strong> Auditor inputs dummy transactions (with known errors and valid data) into the client’s live or test system to verify whether the application’s controls correctly accept or reject them.</div>
        <div>• <strong class="text-emerald-400">Parallel Simulation:</strong> Auditor writes an independent program (or uses generalized audit software) to simulate the client’s application processing logic, processes real client data through both, and compares output files to identify discrepancies.</div>
        <div>• <strong class="text-sky-400">Embedded Audit Module (EAM) / Continuous Auditing:</strong> Audit routines embedded directly within the client’s production software to capture transactions matching specific criteria (e.g. transactions > ₹10 Lakhs or unusual hours) in real-time into an audit log file.</div>
      </div>
    `,
    summaryClean: "Test data inputs dummy transactions; parallel simulation re-runs actual data through independent software; embedded audit modules monitor live transactions continuously."
  },
  {
    id: 'aud_fc_c12_03',
    subjectId: 'Audit',
    category: 'Digital Auditing & Assurance',
    statutoryRef: 'Digital Auditing - Audit Data Analytics (ADA) & Emerging Tech',
    examImportance: 'High',
    question: 'How do Audit Data Analytics (ADA) and Emerging Technologies transform audit testing from sample-based to 100% testing?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">100% Population Testing:</strong> In place of sampling, ADA enables testing entire transaction populations for patterns, outliers, duplicate invoice numbers, round sums, and non-business day postings.</li>
          <li><strong class="text-emerald-400">Three-Way Matching Automation:</strong> Algorithmic matching of 100% of Purchase Orders, Goods Received Notes, and Vendor Invoices, instantly identifying quantity, price, or tax deviations.</li>
          <li><strong class="text-sky-400">Process Mining:</strong> Analyzing system event logs to reconstruct the true end-to-end execution of business processes (Procure-to-Pay, Order-to-Cash), revealing segregation of duties violations and control bypasses.</li>
          <li><strong class="text-violet-400">AI &amp; Machine Learning:</strong> NLP for automated contract analysis (lease extraction u/Ind AS 116), predictive modeling of credit loss provisions, and automated anomaly classification.</li>
        </ul>
      </div>
    `,
    summaryClean: "ADA enables 100% population analysis, automated 3-way matching, process mining to uncover control bypasses, and AI-driven document scrutiny."
  },

  // =========================================================================
  // CHAPTER 13: GROUP AUDITS (SA 600)
  // =========================================================================
  {
    id: 'aud_fc_c13_01',
    subjectId: 'Audit',
    category: 'Group Audits',
    statutoryRef: 'SA 600 - Using the Work of Another Auditor',
    examImportance: 'Critical',
    question: 'What are the rights, duties, and reporting disclosures of a Principal Auditor regarding Component Auditors under SA 600?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <div>• <strong class="text-amber-400">Professional Competence:</strong> Principal auditor should consider professional competence of other auditor if not an ICAI member.</div>
          <div>• <strong class="text-emerald-400">Coordination &amp; Questionnaires:</strong> Issue written questionnaires regarding independence, compliance with statutory requirements, and significant findings.</div>
          <div>• <strong class="text-sky-400">Reliance &amp; Division of Responsibility:</strong> Principal auditor is entitled to rely on the work of the component auditor unless there is reason to doubt.</div>
          <div>• <strong class="text-rose-400">Reporting Disclosures:</strong> The principal auditor’s report shall state clearly the <span class="text-white font-bold underline">division of responsibility</span>, specifying the extent to which the financial statements of components audited by other auditors have been included (Total assets, total revenues, net cash flows).</div>
        </div>
      </div>
    `,
    summaryClean: "SA 600 allows reliance on component auditors; the principal auditor coordinates via questionnaires and must state the division of responsibility in the audit report."
  },
  {
    id: 'aud_fc_c13_02',
    subjectId: 'Audit',
    category: 'Group Audits',
    statutoryRef: 'Group Audits - Component Materiality & Consolidation Adjustments',
    examImportance: 'High',
    question: 'What is Component Materiality and what procedures must the group auditor perform on Consolidation Adjustments?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
          <strong class="text-amber-400 block">Component Materiality:</strong>
          • Materiality for a component must be set <span class="text-white font-bold underline">LOWER than group materiality</span> to address aggregation risk (risk that uncorrected/undetected misstatements in components exceed group materiality).<br/>
          • Different components may have different component materiality levels based on size and risk.
        </div>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] space-y-1">
          <strong class="text-emerald-400 block">Consolidation Adjustments Auditing:</strong>
          • Verify elimination of 100% intra-group balances, transactions, and unrealized profits.<br/>
          • Verify uniform accounting policies (Ind AS 110: restatement if component uses different policies).<br/>
          • Verify determination of Goodwill / Capital Reserve on acquisition date.<br/>
          • Verify Non-Controlling Interest (NCI) calculation and foreign currency translation reserve (FCTR) entries.
        </div>
      </div>
    `,
    summaryClean: "Component materiality is set lower than group materiality to manage aggregation risk; consolidation procedures verify intra-group eliminations, uniform accounting, Goodwill, and NCI."
  },

  // =========================================================================
  // CHAPTER 14: SPECIAL FEATURES OF AUDIT OF BANKS & NBFCs
  // =========================================================================
  {
    id: 'aud_fc_c14_01',
    subjectId: 'Audit',
    category: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    statutoryRef: 'RBI IRACP Norms - Non-Performing Asset (NPA) Classification Criteria',
    examImportance: 'Critical',
    question: 'State the exact NPA classification criteria for Term Loans, CC/OD accounts, Bills, and Agricultural Advances under RBI IRACP norms.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1.5 border border-slate-800">Facility Type</th>
              <th class="p-1.5 border border-slate-800">NPA Trigger Condition</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-amber-400">Term Loan</td>
              <td class="p-1.5 border border-slate-800">Interest and/or installment of principal remains overdue for &gt; <strong class="text-white">90 days</strong>.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-emerald-400">Cash Credit / Overdraft</td>
              <td class="p-1.5 border border-slate-800">Account remains <strong class="text-white">"Out of Order"</strong> (Outstanding balance &gt; sanctioned limit/DP continuously for 90 days, OR credits insufficient to cover interest debited in previous 90 days).</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-sky-400">Bills Purchased / Discounted</td>
              <td class="p-1.5 border border-slate-800">Remains overdue for a period of &gt; <strong class="text-white">90 days</strong>.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-rose-400">Agricultural Advances</td>
              <td class="p-1.5 border border-slate-800">• Short duration crop loans: Overdue for <strong class="text-white">2 crop seasons</strong>.<br/>• Long duration crop loans: Overdue for <strong class="text-white">1 crop season</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "IRACP triggers: 90 days overdue for term loans and bills; Out of Order for CC/OD; 2 crop seasons for short duration and 1 crop season for long duration agri crops."
  },
  {
    id: 'aud_fc_c14_02',
    subjectId: 'Audit',
    category: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    statutoryRef: 'RBI IRACP Norms - Asset Classification & Provisioning Percentages',
    examImportance: 'Critical',
    question: 'State the four asset classification categories and their exact provisioning percentages for banks.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900 text-white">
              <th class="p-1 border border-slate-800">Category</th>
              <th class="p-1 border border-slate-800">Duration</th>
              <th class="p-1 border border-slate-800">Provision % (Secured)</th>
              <th class="p-1 border border-slate-800">Provision % (Unsecured)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-emerald-400">Standard</td>
              <td class="p-1 border border-slate-800">Performing</td>
              <td class="p-1 border border-slate-800" colspan="2">Agri/SME: 0.25% | Commercial Real Estate (CRE): 1.00% | Housing (Teaser): 2.00% | Other: 0.40%</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-amber-400">Sub-Standard</td>
              <td class="p-1 border border-slate-800">&le; 12 months as NPA</td>
              <td class="p-1 border border-slate-800 font-bold text-white">15%</td>
              <td class="p-1 border border-slate-800 font-bold text-amber-300">25% (Ab initio: 20%)</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">Doubtful (D1)</td>
              <td class="p-1 border border-slate-800">Up to 1 year</td>
              <td class="p-1 border border-slate-800 font-bold text-white">25%</td>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">100%</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">Doubtful (D2)</td>
              <td class="p-1 border border-slate-800">1 to 3 years</td>
              <td class="p-1 border border-slate-800 font-bold text-white">40%</td>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">100%</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">Doubtful (D3)</td>
              <td class="p-1 border border-slate-800">&gt; 3 years</td>
              <td class="p-1 border border-slate-800 font-bold text-white">100%</td>
              <td class="p-1 border border-slate-800 font-bold text-rose-400">100%</td>
            </tr>
            <tr>
              <td class="p-1 border border-slate-800 font-bold text-rose-600">Loss Asset</td>
              <td class="p-1 border border-slate-800">Uncollectible / Identified</td>
              <td class="p-1 border border-slate-800 font-bold text-rose-600" colspan="2">100% (or written off entirely)</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Substandard: 15% (secured) / 25% (unsecured). Doubtful: D1 = 25%, D2 = 40%, D3 = 100% on secured portion; 100% on unsecured portion. Loss assets: 100%."
  },
  {
    id: 'aud_fc_c14_03',
    subjectId: 'Audit',
    category: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    statutoryRef: 'Bank Audit - Long Form Audit Report (LFAR)',
    examImportance: 'High',
    question: 'What is the purpose, structure, and submission timeline of the Long Form Audit Report (LFAR)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Statutory Purpose:</strong> Detailed questionnaire prescribed by RBI designed to give in-depth qualitative and quantitative feedback on bank operations, internal controls, advances, and asset classification.</li>
          <li><strong class="text-emerald-400">Dual Structure:</strong> Separate questionnaires exist for:
            <ul class="list-circle pl-4 space-y-0.5 text-slate-350">
              <li>Bank Branch Auditors (covering cash, operations, advances, deposits, frauds, housekeeping).</li>
              <li>Statutory Central Auditors (SCAs) (covering macro compliance, capital adequacy, Treasury operations, IT systems).</li>
            </ul>
          </li>
          <li><strong class="text-sky-400">Submission Timeline:</strong> LFAR for branches must be submitted to the Controlling Authority / SCAs within the schedule prescribed by the bank, ordinarily on or before <span class="text-white font-bold underline">April 30th / May 15th</span>.</li>
          <li><strong class="text-rose-400">Independent Quality:</strong> Auditor must write explicit comments rather than vague one-word answers like "Yes/No/Verified".</li>
        </ul>
      </div>
    `,
    summaryClean: "LFAR is a structured RBI questionnaire for branches and central auditors providing qualitative assessment of advances and controls, submitted by designated deadlines."
  },
  {
    id: 'aud_fc_c14_04',
    subjectId: 'Audit',
    category: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    statutoryRef: 'RBI Master Directions - NBFC Scale-Based Regulation (SBR)',
    examImportance: 'Critical',
    question: 'Outline the four layers of NBFCs under the RBI Scale-Based Regulation (SBR) framework.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-2 gap-1.5 text-[11px]">
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-emerald-400 block">1. Base Layer (NBFC-BL):</strong>
            Non-deposit taking NBFCs below asset size of <span class="text-white font-bold">₹1,000 Crores</span>, plus Type I NBFCs, NOFHC, peer-to-peer lending platforms (NBFC-P2P), and account aggregators.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-amber-400 block">2. Middle Layer (NBFC-ML):</strong>
            All deposit-taking NBFCs (NBFC-D) irrespective of asset size; non-deposit taking NBFCs with asset size &ge; <span class="text-white font-bold">₹1,000 Crores</span>; Primary Dealers, Core Investment Companies (CICs), and HFCs.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-rose-400 block">3. Upper Layer (NBFC-UL):</strong>
            Top 10 NBFCs identified by RBI based on scoring methodology (size, interconnectedness, complexity) subject to bank-like prudential regulation.
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-violet-400 block">4. Top Layer (NBFC-TL):</strong>
            Ordinarily empty; populated if RBI determines that an Upper Layer NBFC exhibits extreme systemic risk spillover.
          </div>
        </div>
      </div>
    `,
    summaryClean: "RBI SBR framework comprises 4 layers: Base Layer (< ₹1,000 Cr), Middle Layer (≥ ₹1,000 Cr & all deposit-taking), Upper Layer (Top 10 systemic NBFCs), and Top Layer."
  },

  // =========================================================================
  // CHAPTER 15: OVERVIEW OF AUDIT OF PUBLIC SECTOR UNDERTAKINGS
  // =========================================================================
  {
    id: 'aud_fc_c15_01',
    subjectId: 'Audit',
    category: 'Overview of Audit of Public Sector Undertakings',
    statutoryRef: 'Companies Act Sec 139(5), 139(7), 143(6), 143(7) - Role of C&AG',
    examImportance: 'Critical',
    question: 'What are the C&AG’s statutory powers regarding appointment, supplementary audit, and test audit of Government Companies?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <ul class="list-disc list-inside space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px]">
          <li><strong class="text-amber-400">Appointment (Sec 139(5)):</strong> C&amp;AG appoints the statutory auditor within <span class="text-white font-bold underline">180 days</span> from the commencement of the financial year.</li>
          <li><strong class="text-sky-400">First Auditor (Sec 139(7)):</strong> Appointed by C&amp;AG within <span class="text-white font-bold underline">60 days</span> of registration; failing which Board appoints within next 30 days, failing which members in EGM within 60 days.</li>
          <li><strong class="text-emerald-400">Supplementary Audit (Sec 143(6)):</strong> C&amp;AG has the right to conduct a supplementary audit within <span class="text-white font-bold underline">60 days</span> of receiving the statutory auditor’s report, and comment upon or supplement the report.</li>
          <li><strong class="text-rose-400">Test Audit (Sec 143(7)):</strong> C&amp;AG may by order cause a test audit to be conducted of the accounts of the government company under the CAG (DPC) Act 1971.</li>
        </ul>
      </div>
    `,
    summaryClean: "C&AG appoints statutory auditors within 180 days of FY commencement, has 60 days to conduct a supplementary audit u/s 143(6), and can order test audits u/s 143(7)."
  },
  {
    id: 'aud_fc_c15_02',
    subjectId: 'Audit',
    category: 'Overview of Audit of Public Sector Undertakings',
    statutoryRef: 'PSU Audit - Propriety Audit & Comprehensive Audit',
    examImportance: 'High',
    question: 'Define Propriety Audit and enumerate the fundamental principles of public financial propriety.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Propriety Audit Concept:</p>
        <p class="text-[11px] text-slate-350 bg-slate-900/50 p-2 rounded border border-slate-800">
          Scrutiny of government expenditure beyond legal regularity to examine whether the expenditure was <span class="text-white font-bold">prudent, justified, economical, and served public interest</span> rather than personal enrichment.
        </p>
        <div class="p-2 bg-slate-950 rounded border border-slate-850 text-[11px] space-y-0.5">
          <strong class="text-emerald-400 block">Canons of Financial Propriety:</strong>
          1. Expenditure should not be prima facie more than the occasion demands; public officer must exercise the same vigilance as a person of ordinary prudence in spending own money.<br/>
          2. Authority should not sanction expenditure directly or indirectly to its own advantage.<br/>
          3. Public funds must not be utilized for the benefit of a particular person or section of the community unless justified by public policy.<br/>
          4. Allowances (e.g. traveling allowance) should not become a source of profit.
        </div>
      </div>
    `,
    summaryClean: "Propriety audit evaluates financial prudence, economy, and public interest adherence using the canons of financial propriety (vigilance of an ordinary prudent person spending own money)."
  },
  {
    id: 'aud_fc_c15_03',
    subjectId: 'Audit',
    category: 'Overview of Audit of Public Sector Undertakings',
    statutoryRef: 'PSU Audit - Performance Audit (Three Es)',
    examImportance: 'Critical',
    question: 'Define the Three Es (Economy, Efficiency, and Effectiveness) in a C&AG Performance Audit.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <div class="grid grid-cols-3 gap-1.5 text-[11px]">
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-amber-400 block">1. Economy:</strong>
            Minimizing the cost of resources (inputs) employed for an activity, having regard to appropriate quality.<br/>
            <span class="text-slate-400">"Spending less."</span>
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-emerald-400 block">2. Efficiency:</strong>
            Maximizing the relationship between inputs and outputs (e.g. producing maximum output with given resources, or minimum input for target output).<br/>
            <span class="text-slate-400">"Spending well."</span>
          </div>
          <div class="p-1.5 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-sky-400 block">3. Effectiveness:</strong>
            Extent to which objectives and goals of the program/policy are achieved compared with intended impacts.<br/>
            <span class="text-slate-400">"Spending wisely."</span>
          </div>
        </div>
      </div>
    `,
    summaryClean: "Performance audit assesses Economy (spending less / minimizing input costs), Efficiency (spending well / optimal input-output ratio), and Effectiveness (spending wisely / achieving goals)."
  }
];
