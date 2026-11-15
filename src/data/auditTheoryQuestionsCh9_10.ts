/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL ADVANCED AUDITING, ASSURANCE & PROFESSIONAL ETHICS
 * CHAPTER 9: RELATED SERVICES (SRS 4400 & SRS 4410)
 * CHAPTER 10: REVIEW OF FINANCIAL INFORMATION (SRE 2400 & SRE 2410)
 * Complete Questions from ICAI Study Material (TYU, Integrated Cases & Test Your Knowledge)
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const THEORY_QUESTIONS_CH9_10: TheoryQuestion[] = [
  {
    id: "aud_th_ch9_tyu1",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Confirmation of Accounts Receivables under SRS 4400 (TYU 1)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Understanding 1",
    question: "A company asks you to carry out the process of confirmation of its accounts receivables having balances in excess of \u20b9 10 lacs as per its books of accounts at the close of the year. The work to be performed only involves preparing and sending confirmation requests to such parties, analysis of variations on receipt of confirmations and submission of a report in accordance with professional standards. What points have to be kept in mind for inclusion in the report specifically for such engagement?",
    keyConcepts: [
      {"keyword": "SRS 4400", "category": "Standard", "description": "Standard on Related Services 4400 governing Agreed-Upon Procedures"},
      {"keyword": "Non-Assurance Engagement", "category": "Provision", "description": "Agreed-upon procedures provide no assurance; readers assess findings themselves"},
      {"keyword": "Report of Factual Findings", "category": "Keyword", "description": "Auditor reports purely objective factual findings without audit opinion"},
      {"keyword": "Restricted Distribution", "category": "Provision", "description": "Distribution strictly limited to specified parties who agreed to procedures"},
      {"keyword": "Listing of Specific Procedures", "category": "Keyword", "description": "Detailed enumeration of procedures performed on receivables > \u20b910 lacs"},
    ],
    shortSuggestedAnswer: `### 1. Statutory Identification & Nature of Engagement
* **Applicable Framework:** The assignment is an **Agreed-Upon Procedures (AUP)** engagement governed by **SRS 4400** (*Engagements to Perform Agreed-upon Procedures Regarding Financial Information*).
* **Non-Assurance Nature:** It is a non-assurance engagement. The practitioner simply issues a report of **factual findings**; no audit opinion or review conclusion conveying assurance is expressed.

---

### 2. Mandatory Points for Inclusion in the SRS 4400 Report
| Report Element | Specific Content for Accounts Receivable Confirmation |
| :--- | :--- |
| **Title & Addressee** | Clearly titled *"Report of Factual Findings"*, addressed to the appointing authority / contracting parties. |
| **Identification of Information** | Specifically identify trade receivables with balances exceeding **₹ 10 lacs** at year-end. |
| **Statement of Agreed Procedures** | Explicit affirmation that procedures performed were those agreed-upon with the recipient. |
| **Compliance Statement** | Statement that engagement was conducted in accordance with **SRS 4400**. |
| **Stated Purpose** | Clarify the exact purpose: circularization of debtor balances > ₹ 10 lacs and analysis of response variances. |
| **Listing of Procedures** | Enumerate detailed steps: preparing & dispatching confirmation requests, tracing replies, and tabulating variations. |
| **Description of Factual Findings** | Factual statement of confirmations received, non-responses, and specific numerical discrepancies found. |
| **No Assurance Disclaimer** | Categorical statement that procedures performed do not constitute an audit or review, and **no assurance is expressed**. |
| **Additional Procedures Clause** | Note that had additional procedures, an audit, or a review been performed, other matters might have come to light. |
| **Restricted Distribution** | Explicit statement restricting distribution exclusively to parties who agreed to the procedures. |
| **Scope Limitation to Elements** | Note that the report relates only to specified debtors and **does not extend to the financial statements as a whole**. |`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluates statutory adherence to SRS 4400 reporting elements for agreed-upon procedures on trade receivables.",
      criticalMisses: ["Omission of SRS 4400 citation and non-assurance characterization.", "Failure to specify that distribution must be restricted to parties who agreed to the procedures.", "Omission of the explicit disclaimer that no audit opinion or review conclusion is expressed."],
      suggestions: ["Always tabulate the mandatory elements of an SRS 4400 report for presentation clarity.", "Emphasize that the report cannot be distributed to third parties unaware of the agreed procedures."],
    }
  },
  {
    id: "aud_th_ch9_tyu2",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Treatment of Repudiated Insurance Claim on Inventory Theft under SRS 4410 (TYU 2)",
    difficulty: "Advanced",
    marks: 5,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Understanding 2",
    question: "During the course of performing a compilation engagement in accordance with SRS 4410, it becomes known to you that the client had suffered a theft loss of \u20b9 100 lacs of its inventories over a period of time at a storage location visited infrequently. A claim was lodged by the client with the insurance company which was repudiated due to certain technical reasons relating to coverage of policy. The client has not preferred a complaint or an appeal against said repudiation. The amount is reflected under the head \"current assets\" in trial balance of the client. Discuss how you should proceed to deal with the matter.",
    keyConcepts: [
      {"keyword": "SRS 4410", "category": "Standard", "description": "Standard on Related Services 4410 Compilation Engagements"},
      {"keyword": "Materially Misstated Information", "category": "Provision", "description": "Carrying a repudiated claim as an asset misstates financial information"},
      {"keyword": "Propose Amendments", "category": "Provision", "description": "Practitioner duty to propose write-off / provisioning to management"},
      {"keyword": "Withdrawal from Engagement", "category": "Provision", "description": "Mandatory withdrawal if management refuses proposed amendments"},
      {"keyword": "Communication to TCWG", "category": "Provision", "description": "Informing Those Charged with Governance of reasons for withdrawal"},
    ],
    shortSuggestedAnswer: `### 1. Technical Evaluation under SRS 4410
* **Accounting Reality:** An insurance claim of **₹ 100 lacs** that has been formally repudiated with no appeal or complaint preferred cannot be recognized as an asset. 
* **Impact on Compiled Financials:** Retaining ₹ 100 lacs under *"Current Assets"* represents a clear non-recovery and constitutes a **loss**. Carrying it misstates the financial information and renders it **materially misleading**.

---

### 2. Procedural Action Steps for the Practitioner
\`\`\`
[Discovery of Materially Misleading Item (₹ 100L Repudiated Claim in Current Assets)]
                              │
                              ▼
        [Step 1: Propose Appropriate Amendments to Management]
         (Write-off claim to P&L or make 100% provision)
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
   [Management Accepts]               [Management Declines / Refuses]
             │                                 │
             ▼                                 ▼
   [Incorporate Adjustment &          [Step 2: Mandatory Withdrawal from Engagement]
    Issue SRS 4410 Report]                     │
                                               ▼
                                      [Step 3: Notify Management & TCWG of Reasons]
                                               │
                                               ▼
                                      [If Withdrawal Legally Not Possible:
                                       Determine Legal/Professional Responsibilities]
\`\`\`

* **Step 1 - Propose Corrections:** Bring the matter to management's attention and propose necessary amendments (writing off the ₹ 100 lacs to Profit & Loss).
* **Step 2 - Management Declines:** If management declines or does not permit the practitioner to make the proposed amendments, the practitioner **shall withdraw from the engagement**.
* **Step 3 - Communication to Governance:** On withdrawal, inform management and **Those Charged with Governance (TCWG)** of the specific reasons for withdrawing.
* **Step 4 - Legal Constraints:** If withdrawal is not legally possible, determine applicable professional and legal obligations.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests practitioner actions under SRS 4410 when confronted with misleading accounting treatments during compilation.",
      criticalMisses: ["Failure to identify that retaining a repudiated claim as current asset is a material misstatement.", "Omission of practitioner duty to formally propose amendments to management.", "Failure to cite the mandatory withdrawal rule if management declines amendments."],
      suggestions: ["Highlight the escalation sequence: Propose Amendments -> Management Refusal -> Withdrawal -> Inform TCWG.", "Cite SRS 4410 explicitly regarding misleading information in compiled financial statements."],
    }
  },
  {
    id: "aud_th_ch9_case_km",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "KM Limited Integrated Case Scenario (SRS 4410 Principles)",
    difficulty: "Mastery",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 9 Integrated Case Scenario",
    question: "KM Limited engaged a firm for compilation of financial statements under SRS 4410 for internal use for year ended 31st March, 2024. During the engagement: (1) Apparent opening balance errors were noticed where incentives receivable were swapped with other accounts, with no credit transactions during the year; (2) A team member suggested verifying all revenue figures in the trial balance to ensure completeness; (3) The team debated whether SQC 1 or SA 220 applies; (4) Unrecorded bank expenditure for a new unit in Rourkela was omitted under appropriate heads, vacillating the team; (5) Documentation was maintained. Analyze these issues under SRS 4410 and quality control standards.",
    keyConcepts: [
      {"keyword": "SRS 4410", "category": "Standard", "description": "Compilation Engagements standard"},
      {"keyword": "SQC 1 Applicability", "category": "Standard", "description": "SQC 1 applies to all engagement standards including related services"},
      {"keyword": "Integrity Principle", "category": "Provision", "description": "Disregarding known material omissions violates the fundamental ethical principle of integrity"},
      {"keyword": "No Verification Duty", "category": "Provision", "description": "Compilation does not require verifying accuracy/completeness of management data"},
      {"keyword": "Engagement File Assembly", "category": "Rule", "description": "Assembly on a timely basis after report finalization in accordance with firm limits"},
    ],
    shortSuggestedAnswer: `### Comprehensive Issue-by-Issue Analysis under SRS 4410 & SQC 1

| Issue Encountered | Statutory Analysis & Correct Professional Position |
| :--- | :--- |
| **1. Opening Balance Errors** | * Action: Bring errors to the knowledge of management.<br/>* Under SRS 4410, if records provided are incomplete or inaccurate, practitioner brings it to management’s attention and requests corrections. SA 510 applies only to audits, not compilation. |
| **2. Revenue Verification Proposal** | * The team member’s suggestion is **improper**.<br/>* A compilation engagement is a **non-assurance engagement**. It does **not** require the practitioner to verify accuracy or completeness of data or gather evidence to express an audit opinion. |
| **3. Quality Control Standard Applicability** | * **SQC 1 applies** to the firm in respect of compilation engagements.<br/>* SA 220 applies exclusively to audits of financial statements. However, because SRS 4410 is an Engagement Standard issued by ICAI, SQC 1 covers all engagement standards. |
| **4. Omission of Rourkela Expenditure** | * Omission of capital/operational expenditures makes the compiled financials **misleading**.<br/>* Disregarding known omissions violates the fundamental ethical principle of **Integrity**. The practitioner cannot be associated with misleading financial data and must propose amendments or withdraw. |
| **5. Assembly of Engagement File** | * The final engagement file should be assembled on a **timely basis** after the engagement report has been finalized in accordance with the time limits set by the firm (under SQC 1 policies). |`,
    defaultRemarks: {
      efficiencyReasoning: "Comprehensive case synthesis testing boundaries between audit procedures, compilation scope, SQC 1 applicability, and ethical mandates.",
      criticalMisses: ["Conflating compilation with audit procedures (auditor is NOT required to test revenues).", "Failing to note that SQC 1 applies to compilation while SA 220 does not.", "Missing the violation of the fundamental principle of Integrity when ignoring known omissions."],
      suggestions: ["Structure answers systematically matching each sub-issue identified in the scenario.", "Clearly distinguish between ethical principles (Integrity vs Objectivity)."],
    }
  },
  {
    id: "aud_th_ch9_tk01",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Intended Purposes of a Compilation Engagement (SRS 4410)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q1",
    question: "List out few intended purposes of a \"compilation engagement\" in accordance with SRS 4410.",
    keyConcepts: [
      {"keyword": "SRS 4410", "category": "Standard", "description": "Compilation Engagements"},
      {"keyword": "Mandatory Periodic Reporting", "category": "Provision", "description": "Compliance with periodic statutory financial reporting requirements"},
      {"keyword": "Internal Use by TCWG", "category": "Provision", "description": "Financial statements prepared for management or TCWG on entity-specific basis"},
      {"keyword": "External Contractual Reporting", "category": "Provision", "description": "Reporting to funding bodies, grant providers, or lenders under contract"},
      {"keyword": "Transactional Purposes", "category": "Provision", "description": "Supporting changes in ownership, financing, mergers, or acquisitions"},
    ],
    shortSuggestedAnswer: `### Intended Purposes of Compilation Engagements (SRS 4410)
Financial information subject to a compilation engagement under **SRS 4410** is typically required for both mandatory statutory purposes and specialized non-mandatory arrangements:

\`\`\`
                   ┌────────────────────────────────────────────────────────┐
                   │       Purposes of Compilation Engagements (SRS 4410)   │
                   └───────────────────────────┬────────────────────────────┘
                                               │
           ┌───────────────────────────────────┴───────────────────────────────────┐
           ▼                                                                       ▼
[1. Mandatory Statutory Reporting]                       [2. Non-Mandatory / Special Purposes]
 • Periodic financial reporting established               • Internal Use by Management & TCWG
   under relevant laws or regulations                     • Contractual / Grant Reporting (Lenders/Donors)
                                                          • Transactional Support (Mergers, Acquisitions, Buyouts)
\`\`\`

* **1. Mandatory Periodic Financial Reporting:** To comply with mandatory periodic financial reporting requirements established in law or regulation (e.g., small entities under simplified tax/corporate reporting regimes).
* **2. Internal Management & Governance:** For management or Those Charged with Governance (TCWG), prepared on a basis appropriate for their particular purposes (e.g., internal performance review, operational budgets).
* **3. Contractual Reporting for External Parties:** Undertaken for external parties under a contract or agreement, such as financial statements submitted to funding bodies or banks to support the grant or continuation of credit facilities.
* **4. Transactional & Structural Purposes:** To support transactions involving changes in the entity’s ownership or financing structure (e.g., mergers, amalgamations, private equity investments, or acquisitions).`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact recall of the four statutory and commercial purposes recognized under SRS 4410 for compilation.",
      criticalMisses: ["Omission of transactional purposes (mergers and acquisitions).", "Failure to distinguish mandatory periodic reporting from non-mandatory internal use."],
      suggestions: ["Use bullet points grouped into mandatory vs non-mandatory categories."],
    }
  },
  {
    id: "aud_th_ch9_tk02",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Ethical Requirements & Independence in Compilation Engagements (SRS 4410)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q2",
    question: "A Chartered Accountant is offered appointment for a compilation engagement to be performed under SRS 4410. Is he required to comply with the ethical requirements of the Code of Ethics? Discuss briefly.",
    keyConcepts: [
      {"keyword": "ICAI Code of Ethics", "category": "Standard", "description": "Fundamental ethical principles governing professional accountants"},
      {"keyword": "Five Fundamental Principles", "category": "Keyword", "description": "Integrity, Objectivity, Professional Competence & Due Care, Confidentiality, Professional Behaviour"},
      {"keyword": "Independence Exemption", "category": "Provision", "description": "Independence is NOT mandatory for compilation as it is a non-assurance engagement"},
      {"keyword": "Statutory Disclosure", "category": "Provision", "description": "If required by law/regulations, disclosure of lack of independence must be made"},
    ],
    shortSuggestedAnswer: `### 1. Mandatory Applicability of Code of Ethics
* **General Rule:** Yes. The practitioner **shall comply with relevant ethical requirements** set out in the **Code of Ethics** issued by ICAI.
* **Applicable Fundamental Principles:**
  * **Integrity:** Straightforwardness and honesty in all professional relationships.
  * **Objectivity:** Not allowing bias, conflict of interest, or undue influence to override judgments.
  * **Professional Competence & Due Care:** Maintaining professional knowledge and skill.
  * **Confidentiality:** Respecting the confidentiality of information acquired.
  * **Professional Conduct:** Complying with relevant laws and regulations.

---

### 2. Statutory Position Regarding "Independence"
* **Non-Assurance Character:** Since a compilation engagement is **not an assurance engagement**, **independence requirements do not apply** to compilation engagements under SRS 4410.
* **Exception:** If specific laws, regulations, or contract terms stipulate independence or disclosure of lack thereof, the practitioner must comply with those specific rules.`,
    defaultRemarks: {
      efficiencyReasoning: "Focuses on the crucial distinction: Code of Ethics applies fully, but Independence is NOT mandatory for non-assurance compilation.",
      criticalMisses: ["Stating that independence is mandatory for compilation engagements.", "Omitting the 5 fundamental ethical principles of the ICAI Code of Ethics."],
      suggestions: ["Explicitly state: Code of Ethics = YES; Independence = NO (unless specifically required by law)."],
    }
  },
  {
    id: "aud_th_ch9_tk03",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Related Services vs Assurance Engagements (Core Distinction)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q3",
    question: "How do \"related services\" differ from assurance engagements?",
    keyConcepts: [
      {"keyword": "Assurance Engagement", "category": "Provision", "description": "Practitioner expresses conclusion to enhance degree of confidence of intended users"},
      {"keyword": "Related Services", "category": "Standard", "description": "Non-assurance engagements governed by SRS 4400 and SRS 4410"},
      {"keyword": "Expression of Opinion", "category": "Keyword", "description": "Assurance involves opinion/conclusion; Related services convey NO assurance"},
      {"keyword": "User Assessment", "category": "Provision", "description": "Users assess procedures and findings themselves to draw their own conclusions"},
    ],
    shortSuggestedAnswer: `### Comparison: Assurance Engagements vs Related Services

| Parameter | Assurance Engagements (Audits & Reviews) | Related Services (AUP & Compilations) |
| :--- | :--- | :--- |
| **Governing Standards** | SAs (100–799), SREs (2400, 2410), SAEs (3400, 3420) | **SRS 4400** (Agreed-Upon Procedures) & **SRS 4410** (Compilations) |
| **Core Objective** | Express a conclusion designed to enhance user confidence regarding outcome against criteria. | Apply accounting expertise or carry out agreed procedures without conveying assurance. |
| **Level of Assurance** | **Reasonable** (High in Audit) or **Limited** (Moderate in Review). | **Zero / No Assurance** provided in the report. |
| **Nature of Output** | Audit Opinion (*"True & Fair View"*) or Review Conclusion (*"Negative Assurance"*). | **Report of Factual Findings** (SRS 4400) or **Compilation Report** (SRS 4410). |
| **Evidence Gathering** | Extensive procedures (Tests of Controls, Substantive testing, confirmations). | Restricted to agreed procedures (inquiry, computation) or compilation from management data. |
| **Independence** | **Strictly Mandatory** under ICAI Code of Ethics. | **Not mandatory** unless specific terms or regulations require it. |
| **User Reliance** | Users rely on practitioner’s independent opinion. | Users evaluate factual findings and **draw their own conclusions**. |`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluates conceptual clarity across the entire ICAI Engagement Standards architecture.",
      criticalMisses: ["Failing to contrast the levels of assurance (Reasonable/Limited vs None).", "Omitting governing standard series (SAs/SREs vs SRS)."],
      suggestions: ["A structured multi-column table provides the highest visual impact and clarity."],
    }
  },
  {
    id: "aud_th_ch9_tk04",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Documentation Requirements in Compilation Engagements (SRS 4410)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q4",
    question: "Discuss main documentation requirements to be taken care of by a practitioner while performing a compilation engagement under SRS 4410.",
    keyConcepts: [
      {"keyword": "SRS 4410 Documentation", "category": "Standard", "description": "Mandatory working paper documentation for compilation engagements"},
      {"keyword": "Significant Matters", "category": "Keyword", "description": "Record of significant matters arising and how they were resolved"},
      {"keyword": "Reconciliation of Records", "category": "Provision", "description": "Reconciliation between compiled financials and underlying management records"},
      {"keyword": "Final Acknowledged FS", "category": "Keyword", "description": "Copy of final compiled FS acknowledged by management / TCWG"},
      {"keyword": "Compilation Report", "category": "Keyword", "description": "Copy of final signed practitioner compilation report"},
    ],
    shortSuggestedAnswer: `### Mandatory Documentation Requirements under SRS 4410

The practitioner shall include in the engagement documentation:

\`\`\`
                       ┌────────────────────────────────────────────────────────┐
                       │       SRS 4410 Mandatory Engagement Documentation      │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
         ┌─────────────────────────┬───────────────┴───────────────┬─────────────────────────┐
         ▼                         ▼                               ▼                         ▼
[Significant Matters]     [Reconciliation Record]        [Final Compiled FS]       [Practitioner Report]
 • Professional issues     • Trace compiled figures to    • Acknowledged by         • Final signed
   arising & resolution      trial balance / ledgers        management / TCWG         compilation report
\`\`\`

* **1. Significant Matters:** A record of significant matters arising during the compilation engagement and how those matters were addressed by the practitioner.
* **2. Reconciliation Records:** A record of how the compiled financial information reconciles with the underlying records, documents, explanations, and other information provided by management.
* **3. Final Version of Compiled Information:** A copy of the final version of the compiled financial information for which management or TCWG, as appropriate, has **acknowledged their responsibility**.
* **4. Practitioner's Report:** A copy of the practitioner’s compilation report issued to the entity.
* **5. Supplementary Working Papers (Optional/Recommended):** The practitioner may also include a copy of the entity’s trial balance, summary of significant accounting records, and engagement letter.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact compliance with the documentation clauses of SRS 4410 paragraph 3.9.",
      criticalMisses: ["Omission of reconciliation record between compiled data and management records.", "Missing the requirement for management written acknowledgment on the final compiled financials."],
      suggestions: ["List the 4 mandatory elements followed by optional supplementary working papers."],
    }
  },
  {
    id: "aud_th_ch9_tk05",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Compilation Engagement Characteristics & Practitioner Approach (SRS 4410)",
    difficulty: "Advanced",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q5",
    question: "CA P has been appointed to compile the financial information of X Limited. CA P is confused whether he should apply the same procedures which are required to be applied to conduct an audit or there are some other procedures to discharge the duties under such an engagement. Define the characteristics of Compilation Engagement. What should be the approach of CA P for performing the Engagement?",
    keyConcepts: [
      {"keyword": "Characteristics of Compilation", "category": "Keyword", "description": "Application of accounting expertise without gathering audit evidence or giving assurance"},
      {"keyword": "Non-Assurance Nature", "category": "Provision", "description": "No verification of accuracy/completeness of management information"},
      {"keyword": "Understanding Business & AFRF", "category": "Provision", "description": "Practitioner obtains understanding of entity business, accounting system, and framework"},
      {"keyword": "Reading Compiled Information", "category": "Provision", "description": "Reading compiled information to check if it appears misleading or misstated"},
      {"keyword": "Management Responsibility", "category": "Keyword", "description": "Management retains ultimate responsibility for financial statements and estimates"},
    ],
    shortSuggestedAnswer: `### 1. Characteristics of a Compilation Engagement (SRS 4410)
* **Application of Accounting Expertise:** The practitioner applies accounting and financial reporting expertise (not auditing expertise) to assist management in preparing and presenting financial information.
* **No Assurance Provided:** It is **not an assurance engagement**. The practitioner does not test internal controls, perform substantive testing, or verify the accuracy or completeness of records.
* **Management Primacy:** Management retains ultimate responsibility for the financial statements, accounting policies, judgments, and internal controls.

---

### 2. Systematic Approach of CA P for Performing the Engagement
* **Phase 1: Agreeing Terms & Engagement Letter:** Agree on the terms of engagement, intended use, applicable financial reporting framework (AFRF), and management responsibilities; document in an engagement letter.
* **Phase 2: Understanding Entity & Accounting Framework:** Obtain sufficient understanding of:
  * The entity’s business and operations, including accounting system and records.
  * The applicable financial reporting framework and its industry application.
* **Phase 3: Compiling the Financial Information:** Compile financial statements using records, documents, and significant judgments provided by management. Discuss significant judgments with management.
* **Phase 4: Reading the Compiled Information:** Prior to completion, read the compiled financial statements in light of understanding of the business and AFRF to consider whether they appear appropriate and not misleading.
* **Phase 5: Dealing with Incomplete or Misleading Information:**
  * If records are incomplete/unsatisfactory: request additional or corrected information.
  * If amendments are needed (e.g., material misstatement): propose amendments.
  * If management refuses: **withdraw from the engagement** and inform TCWG.
* **Phase 6: Final Acknowledgment & Reporting:** Obtain management's written acknowledgment of responsibility for the final compiled financial information and issue the compilation report.`,
    defaultRemarks: {
      efficiencyReasoning: "Comprehensive roadmap for discharging compilation engagements without blurring lines into statutory auditing.",
      criticalMisses: ["Failing to clarify that audit procedures (sampling, vouching) must NOT be performed.", "Omitting the mandatory step of reading the compiled financials for apparent misstatements."],
      suggestions: ["Breakdown the approach into sequential phases from engagement acceptance to reporting."],
    }
  },
  {
    id: "aud_th_ch9_tk06",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "MNC Limited Compilation: Guidance to Team & SQC 1 Applicability",
    difficulty: "Advanced",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q6",
    question: "MNC Limited has engaged CA Lalit to help the company in compilation of the financial information. CA Lalit explained his team members, the scope of work and the responsibilities under this engagement. The team members have done mostly audit engagements and do not have exposure to compilation engagements. Discuss the key issues that CA Lalit should deliberate and guide his team members with respect to this engagement and the manner it differs from assurance engagements. Give your views on the applicability of SQC 1 to this engagement.",
    keyConcepts: [
      {"keyword": "SRS 4410", "category": "Standard", "description": "Compilation Engagements"},
      {"keyword": "SQC 1 Scope", "category": "Standard", "description": "SQC 1 applies to all engagement standards including SRSs"},
      {"keyword": "Non-Assurance Distinction", "category": "Provision", "description": "No testing of evidence, internal controls, or audit assertions"},
      {"keyword": "Management Responsibility", "category": "Keyword", "description": "Management acknowledges responsibility for final compiled FS"},
      {"keyword": "No Verification of Data", "category": "Provision", "description": "Practitioner compiles from management data without substantive validation"},
    ],
    shortSuggestedAnswer: `### 1. Key Issues CA Lalit Should Deliberate with Audit Team
* **Shift from Assurance to Assistance:** The team must understand that compilation is **not an audit**. No opinion or conclusion conveying assurance will be expressed.
* **Absence of Audit Procedures:** The team should **not** perform audit procedures like physical inventory verification, external bank confirmations, test of internal controls, or substantive testing.
* **Reliance on Management Data:** The practitioner compiles financial statements based on records and explanations provided by management, without verifying their accuracy or completeness.
* **Duty of Care & Professional Judgment:** Although verification is absent, the team cannot remain blind to obvious errors. They must read the compiled statements; if information appears incomplete, inaccurate, or misleading, they must request corrections or propose amendments.
* **Report Terminology:** The final output is an **SRS 4410 Compilation Report** which contains explicit negative disclaimers that no audit or review was performed.

---

### 2. Applicability of SQC 1 to Compilation Engagements
* **ICAI Mandate:** **SQC 1** (*Standard on Quality Control 1*) applies to **all Engagement Standards** issued by ICAI.
* **Inclusive Scope:** Since Standards on Related Services (SRS 4400 & SRS 4410) are an integral part of the Engagement Standards, **SQC 1 applies fully** to firm engagements under SRS 4410.
* **Partner Responsibilities:** The engagement partner must take responsibility for:
  1. The overall quality of each compilation engagement.
  2. Ensuring the engagement is performed in accordance with the firm’s quality control policies and procedures.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests practical orientation of audit staff toward compilation engagements and confirms firm-wide quality control applicability.",
      criticalMisses: ["Failure to affirm that SQC 1 applies to related services engagements.", "Not clarifying that audit staff must restrain from performing audit tests."],
      suggestions: ["Emphasize the engagement partner responsibilities under SQC 1 and SRS 4410."],
    }
  },
  {
    id: "aud_th_ch9_tk07",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Brown Enterprises Ltd: Trade Receivables Validity under SRS 4400",
    difficulty: "Advanced",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q7",
    question: "Brown Enterprises Limited has huge funds locked up in its trade receivables standing at around \u20b9 100 crores as on 31st December, 2023. The management of the company wants to evaluate the validity of the trade receivables to ensure reliability of financial reporting at the year end. The accounts department has provided a list of trade receivables to the management containing about 1000 names, their balances and contact/communication details spread in different parts of the country. The company\u2019s management has requested CA Kamna to take up this assignment and prepare a report for management in accordance with professional standards. Despite not being statutory auditor of the company, she decides to accept the above engagement. (a) By explaining the nature of engagement described above, discuss whether it was proper for her to accept such engagement. (b) While reporting, which precautions should be taken by her so that readers of the report do not misunderstand its scope?",
    keyConcepts: [
      {"keyword": "SRS 4400", "category": "Standard", "description": "Agreed-Upon Procedures regarding financial information"},
      {"keyword": "Non-Auditor Eligibility", "category": "Provision", "description": "Practitioner performing AUP need not be the statutory auditor"},
      {"keyword": "Propriety of Acceptance", "category": "Keyword", "description": "Proper to accept as SRS 4400 specifically covers evaluation of debtors"},
      {"keyword": "Reporting Precautions", "category": "Provision", "description": "Explicit disclaimer that no audit/review performed and report is restricted"},
      {"keyword": "Specific Elements Restriction", "category": "Keyword", "description": "Report relates solely to trade receivables and not financial statements as a whole"},
    ],
    shortSuggestedAnswer: `### (a) Nature of Engagement & Propriety of Acceptance
* **Nature:** This is an **Agreed-Upon Procedures (AUP)** engagement governed by **SRS 4400** (*Engagements to Perform Agreed-upon Procedures Regarding Financial Information*). The practitioner carries out procedures of an audit nature (e.g., circularization, balance comparison) agreed between the parties and issues a report of **factual findings**.
* **Propriety of Acceptance:** 
  * The term "auditor" in SRS 4400 does **not** imply that the person performing related services must be the statutory auditor of the entity.
  * An independent practitioner in public practice is fully eligible to accept an AUP assignment on specific financial statement elements (like accounts receivable).
  * **Conclusion:** It was **entirely proper** for CA Kamna to accept the engagement.

---

### (b) Reporting Precautions to Prevent Misunderstanding of Scope
To ensure readers do not misinterpret the report as an audit or assurance opinion, CA Kamna must include the following statutory safeguards:
1. **No Assurance Statement:** A clear statement that the procedures performed do **not constitute either an audit or a review** and, as such, **no assurance is expressed**.
2. **Additional Procedures Clause:** A statement that had the practitioner performed additional procedures, an audit, or a review, **other matters might have come to light** that would have been reported.
3. **Restricted Distribution:** A statement that the report is **strictly restricted to those parties** that have agreed to the procedures to be performed.
4. **Element Limitation Clause:** A statement that the report relates **only to the specified elements, accounts, or items** (trade receivables as on 31st December, 2023) and **does not extend to the entity’s financial statements taken as a whole**.`,
    defaultRemarks: {
      efficiencyReasoning: "Focuses on non-auditor capacity to undertake AUP and statutory protective clauses required under SRS 4400.",
      criticalMisses: ["Asserting incorrectly that only the statutory auditor can perform SRS 4400 engagements.", "Omitting the 4 mandatory negative disclaimers and distribution restrictions."],
      suggestions: ["Divide into explicit sub-parts (a) and (b) matching ICAI evaluation keys."],
    }
  },
  {
    id: "aud_th_ch9_tk08",
    subjectId: "Audit",
    chapterName: "Related Services",
    title: "Kings & Company Compilation: Gross Inventory Understatement & Scope Objections",
    difficulty: "Mastery",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 9 Test Your Knowledge Q8",
    question: "You have been appointed to compile the financial statements of Kings & Company (a partnership firm) for tax purposes. During the course of your work, you discover that the inventory is grossly understated, and the company has failed to apply applicable standards. On pointing out the same, the partners of Kings & Company inform you that it is outside your scope since you are not conducting an audit and the said figures duly certified by the firm should be accepted. Comment.",
    keyConcepts: [
      {"keyword": "SRS 4410", "category": "Standard", "description": "Compilation Engagements"},
      {"keyword": "Materially Misstated / Misleading", "category": "Provision", "description": "Compiled financials cannot be materially misstated or misleading"},
      {"keyword": "Propose Amendments", "category": "Provision", "description": "Duty to propose appropriate valuation and accounting adjustments"},
      {"keyword": "Withdrawal from Engagement", "category": "Provision", "description": "Mandatory withdrawal if management refuses proposed amendments"},
      {"keyword": "Professional & Legal Responsibilities", "category": "Keyword", "description": "Determining responsibilities if withdrawal is legally precluded"},
    ],
    shortSuggestedAnswer: `### 1. Statutory Analysis under SRS 4410
* **Validity of Management Contention:** The partners' contention that the practitioner must blindly accept certified figures is **fallacious and legally unsustainable**.
* **Practitioner Awareness:** While a compilation engagement does not require audit verification, if during the engagement the practitioner becomes aware that:
  1. The compiled financial statements do not adequately refer to or describe the applicable framework;
  2. Amendments are required for the financial information not to be **materially misstated**; or
  3. The compiled financial statements are **otherwise misleading**;
  the practitioner **shall propose the appropriate amendments to management**.

---

### 2. Required Course of Action
* **Step 1 - Propose Amendments:** Inform the partners that gross inventory understatement distorts profitability and tax computations. Formally propose corrections in compliance with applicable accounting principles.
* **Step 2 - Mandatory Withdrawal:** If the partners decline or do not permit the practitioner to make the proposed amendments, the practitioner **shall withdraw from the engagement** and inform management/TCWG of the reasons.
* **Step 3 - When Withdrawal Not Possible:** If withdrawal is not possible under applicable tax laws/regulations, the practitioner must determine applicable professional and legal obligations (including ethical duty not to be associated with misleading tax statements).
* **Step 4 - Responsibility Acknowledgment:** Under no circumstances can a practitioner sign a compilation report on financial statements known to be materially false or misleading.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests practitioner boundaries under SRS 4410 when management uses non-assurance status as a shield for fraudulent reporting.",
      criticalMisses: ["Accepting the client contention that compilation excuses association with false accounts.", "Failing to cite the mandatory withdrawal rule under SRS 4410."],
      suggestions: ["Emphasize that a CA can never be associated with knowingly misstated or misleading financial information."],
    }
  },
  {
    id: "aud_th_ch10_tyu1",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Review of Financial Statements under Special Purpose Framework (TYU 1)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Understanding 1",
    question: "Roma Limited has entered into a contract with Dorma Limited. There is a condition in the contract by virtue of which Roma Limited is required to get its financial statements reviewed for a year on a quarterly basis in accordance with the financial reporting provisions of the contract. Can Roma Limited get its financial statements reviewed from a professional accountant in practice?",
    keyConcepts: [
      {"keyword": "SRE 2400", "category": "Standard", "description": "Engagements to Review Historical Financial Statements"},
      {"keyword": "Special Purpose Framework", "category": "Provision", "description": "Financial statements prepared in accordance with contractual reporting provisions"},
      {"keyword": "Eligibility to Accept", "category": "Provision", "description": "Professional accountant in practice can review special purpose financial statements"},
      {"keyword": "Understanding Purpose & Users", "category": "Keyword", "description": "Practitioner obtains understanding of purpose and intended users before accepting"},
    ],
    shortSuggestedAnswer: `### 1. Statutory Provisions under SRE 2400
* **Applicability:** **SRE 2400** (*Engagements to Review Historical Financial Statements*) governs review of financial statements prepared under both **General Purpose Frameworks** and **Special Purpose Frameworks**.
* **Special Purpose Framework Definition:** Financial reporting provisions established in a commercial contract between two corporate entities constitute a *Special Purpose Framework*.

---

### 2. Legal Conclusion & Acceptance Criteria
* **Review Feasibility:** **Yes**, Roma Limited can get its quarterly financial statements reviewed by a professional accountant in practice.
* **Preconditions for Acceptance:**
  * The practitioner must determine that the financial reporting provisions of the contract are **acceptable** in view of the intended users.
  * The practitioner must obtain an understanding of the purpose for which the statements are prepared.
  * The resulting review report must include an explanatory paragraph drawing attention to the special purpose framework and cautioning that the statements may not be suitable for other purposes.`,
    defaultRemarks: {
      efficiencyReasoning: "Affirms that review engagements under SRE 2400 extend to special purpose contractual reporting frameworks.",
      criticalMisses: ["Failing to identify that contractual provisions represent a special purpose framework.", "Omission of SRE 2400 citation."],
      suggestions: ["State the direct statutory answer (Yes) first, followed by SRE 2400 preconditions."],
    }
  },
  {
    id: "aud_th_ch10_tyu2",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Course of Action on Suspecting Material Misstatements in SRE 2400 (TYU 2)",
    difficulty: "Advanced",
    marks: 5,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Understanding 2",
    question: "You are conducting a review of the financial statements of a company. It is gathered upon inquiry that there is a possibility of material misstatements in the financial statements. Discuss how you would proceed further in the matter under SRE 2400.",
    keyConcepts: [
      {"keyword": "SRE 2400", "category": "Standard", "description": "Review of Historical Financial Statements"},
      {"keyword": "Additional Procedures", "category": "Provision", "description": "Design and perform procedures to resolve doubt regarding material misstatement"},
      {"keyword": "Dual Objective of Additional Procedures", "category": "Provision", "description": "Conclude matter is NOT likely misstated OR determine it IS materially misstated"},
      {"keyword": "Scope Limitation & Modification", "category": "Provision", "description": "If unable to resolve, scope limitation exists requiring modified conclusion"},
    ],
    shortSuggestedAnswer: `### Procedural Roadmap under SRE 2400 When Misstatements Are Suspected

\`\`\`
[Practitioner Gathers That Financial Statements May Be Materially Misstated]
                                     │
                                     ▼
        [Design & Perform Additional Procedures (Inquiries / Analytics / Tests)]
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
[Outcome (a): Conclude      [Outcome (b): Determine     [Outcome (c): Evidence Still]
 Matter NOT Likely to Cause  Matter DOES Cause           Insufficient (Scope Limitation)
 Material Misstatement]      Material Misstatement]                     │
          │                          │                          ▼
          ▼                          ▼                 [Qualified Conclusion or]
[Unmodified Conclusion]    [Request Management Adjust;  [Disclaimer of Conclusion]
                            If Refused: Qualified or
                            Adverse Conclusion]
\`\`\`

* **1. Mandatory Requirement:** If the practitioner becomes aware of a matter causing belief that financial statements may be materially misstated, the practitioner **shall design and perform additional procedures**.
* **2. Nature of Additional Procedures:**
  * Extended inquiries or detailed analytical procedures on affected items.
  * Other procedures such as substantive tests of details or external confirmations.
* **3. Dual Resolution Objectives:** Procedures must be sufficient to enable the practitioner to either:
  * **(a)** Conclude that the matter is **not likely** to cause the financial statements as a whole to be materially misstated; OR
  * **(b)** Determine that the matter **does cause** the financial statements as a whole to be materially misstated.
* **4. Scope Limitation:** If the practitioner cannot reach either conclusion due to insufficient evidence, a **scope limitation** exists, requiring a **Qualified Conclusion** or **Disclaimer of Conclusion**.`,
    defaultRemarks: {
      efficiencyReasoning: "Focuses on the precise statutory mechanism of designing additional procedures and reporting consequences under SRE 2400.",
      criticalMisses: ["Failing to specify the dual objectives of additional procedures.", "Omitting the scope limitation consequence if additional evidence cannot be obtained."],
      suggestions: ["Highlight the dual resolution endpoints explicitly."],
    }
  },
  {
    id: "aud_th_ch10_tyu3",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Disaster Loss & Uninsured Plant Fire in Interim Review under SRE 2410 (TYU 3)",
    difficulty: "Advanced",
    marks: 5,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Understanding 3",
    question: "During review of the quarterly results of a company of which you are auditor, it is gathered on inquiries made that there has been a major fire in fabric processing plant of the company during the quarter. It has resulted in massive disruption in the operations of the company. Worse still, machinery and inventories of plant were uninsured due to carelessness of concerned staff leading to substantial losses. The matter has been disclosed in interim financial information appropriately. Discuss how you would proceed to deal with the same in the review report.",
    keyConcepts: [
      {"keyword": "SRE 2410", "category": "Standard", "description": "Review of Interim Financial Information Performed by Independent Auditor"},
      {"keyword": "Going Concern Uncertainty", "category": "Provision", "description": "Uninsured operational catastrophe casting significant doubt on going concern"},
      {"keyword": "Emphasis of Matter Paragraph", "category": "Provision", "description": "Mandatory EOM paragraph when material uncertainty is adequately disclosed"},
      {"keyword": "Unmodified Conclusion with EOM", "category": "Keyword", "description": "Conclusion is not modified when disclosure in interim financials is adequate"},
    ],
    shortSuggestedAnswer: `### 1. Audit Evaluation under SRE 2410
* **Disaster Impact:** A massive fire destroying uninsured core production facilities and inventories creates substantial financial loss and operational disruption.
* **Going Concern Assessment:** Such catastrophic events represent conditions that may **cast significant doubt on the entity’s ability to continue as a going concern**.
* **Adequacy of Disclosure:** The question confirms that the matter has been **appropriately disclosed** in the interim financial information by management.

---

### 2. Reporting Treatment in the Review Report
* **Emphasis of Matter (EOM) Paragraph:** Under **SRE 2410**, if a material uncertainty relating to an event or condition comes to the auditor's attention that casts significant doubt on going concern, and **adequate disclosure is made** in the interim financial information, the auditor modifies the review report by adding an **Emphasis of Matter paragraph**.
* **Non-Modification of Conclusion:** The conclusion expressed remains an **unmodified conclusion** (*"Based on our review, nothing has come to our attention..."*), but with an EOM paragraph immediately following the conclusion paragraph.
* **Content of EOM:** 
  * Draw attention to the specific Note in the interim financial information disclosing the fire disaster, loss of uninsured assets, and disruption.
  * State that these conditions indicate a material uncertainty regarding going concern.
  * Explicitly state: *"Our conclusion is not modified in respect of this matter."*`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact reporting protocol under SRE 2410 when material uncertainty is properly disclosed.",
      criticalMisses: ["Advocating for a qualified opinion despite full disclosure.", "Omission of the mandatory Emphasis of Matter paragraph requirement."],
      suggestions: ["Emphasize that adequate disclosure leads to an EOM paragraph, NOT a qualification."],
    }
  },
  {
    id: "aud_th_ch10_tyu4",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Unresolved Material Adjustment & Governance Inaction under SRE 2410 (TYU 4)",
    difficulty: "Advanced",
    marks: 5,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Understanding 4",
    question: "CA Seerat is conducting review of the quarterly financial information of a company of which she is also auditor. She believes that it is necessary to make a material adjustment to the quarterly financial information for it to be prepared, in all material respects, in accordance with the applicable financial reporting framework. She has communicated the matter to the CFO and the audit committee. However, no response was received even after waiting for a reasonable time. What are the options available to her?",
    keyConcepts: [
      {"keyword": "SRE 2410", "category": "Standard", "description": "Review of Interim Financial Information"},
      {"keyword": "Material Adjustment Departure", "category": "Provision", "description": "Departure from applicable financial reporting framework requiring adjustment"},
      {"keyword": "Modify the Review Report", "category": "Provision", "description": "Expressing Qualified or Adverse conclusion on quarterly financial results"},
      {"keyword": "Withdrawal from Engagement", "category": "Provision", "description": "Withdrawing from interim review engagement"},
      {"keyword": "Resignation from Annual Audit", "category": "Provision", "description": "Resigning from statutory appointment to audit annual financial statements"},
    ],
    shortSuggestedAnswer: `### Statutory Options under SRE 2410 Paragraph 3.8

When management and Those Charged with Governance (Audit Committee) do not respond appropriately within a reasonable period regarding a necessary material adjustment, **SRE 2410** provides the auditor with **three distinct statutory options**:

\`\`\`
                     ┌────────────────────────────────────────────────────────┐
                     │    Options Available to Auditor under SRE 2410         │
                     └───────────────────────────┬────────────────────────────┘
                                                 │
         ┌───────────────────────────────┬───────┴───────────────────────────────┐
         ▼                               ▼                                       ▼
[Option 1: Modify Review Report]    [Option 2: Withdraw from Review]     [Option 3: Resign from Annual Audit]
 • Qualified Conclusion (Material)   • Terminate interim review           • Resign from statutory annual
 • Adverse Conclusion (Pervasive)      engagement forthwith                 auditor appointment under CA 2013
\`\`\`

* **Option 1: Modify the Review Report:**
  * If the misstatement is material but not pervasive: Express a **Qualified Conclusion** (*"Based on our review, except for the effects of the matter described..."*).
  * If the misstatement is both material and pervasive: Express an **Adverse Conclusion** (*"...the interim financial information is not prepared, in all material respects, in accordance with the applicable framework"*).
* **Option 2: Withdraw from the Review Engagement:**
  * Where permissible under applicable law or regulation, withdraw from the interim review engagement and document communications.
* **Option 3: Resign from Statutory Annual Audit:**
  * Because the auditor of interim information is also the statutory auditor of annual financial statements, management's refusal to correct material financial misstatements compromises integrity. The auditor may consider **resigning from the appointment to audit the annual financial statements** in accordance with Section 140 of the Companies Act, 2013.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact recall of the three tiered remedies available to an auditor under SRE 2410 paragraph 3.8.",
      criticalMisses: ["Omitting the third remedy: resignation from the annual statutory audit appointment.", "Failing to distinguish between Qualified and Adverse modification."],
      suggestions: ["Present the three options in an explicit numbered list."],
    }
  },
  {
    id: "aud_th_ch10_case_fast",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Fast Operations Limited SEBI LODR Regulation 33 Review Report Case",
    difficulty: "Mastery",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 10 Integrated Case Scenario",
    question: "A draft review report of Fast Operations Limited, a listed entity undergoing mandatory quarterly review under Regulation 33 of SEBI (LODR) Regulations, 2015, contains blanks marked XXXX. Analyze and specify: (1) To whom the review report must be addressed; (2) The phrasing of the responsibility paragraph; (3) The applicable engagement standard to be cited; (4) The comparative scope clause comparing review with audit; and (5) The concluding negative assurance phrasing.",
    keyConcepts: [
      {"keyword": "SRE 2410", "category": "Standard", "description": "Review of Interim Financial Information by Independent Auditor"},
      {"keyword": "Regulation 33 SEBI LODR", "category": "Rule", "description": "Mandatory quarterly review of listed entity financial results"},
      {"keyword": "Addressed to Board of Directors", "category": "Provision", "description": "Interim review reports under Reg 33 are addressed to Board of Directors"},
      {"keyword": "Substantially Less in Scope", "category": "Keyword", "description": "Review is substantially less in scope than an audit conducted under SAs"},
      {"keyword": "Negative Assurance Phrasing", "category": "Keyword", "description": "Nothing has come to our attention that causes us to believe..."},
    ],
    shortSuggestedAnswer: `### Statutory Drafting Analysis for SEBI LODR Regulation 33 Review Report

| Clause / Paragraph | Exact Statutory Drafting & Professional Standard Requirement |
| :--- | :--- |
| **1. Addressee** | **To the Board of Directors of Fast Operations Limited.** (In quarterly listing reviews, reports are submitted to the Board prior to publication). |
| **2. Responsibility Para** | *"Our responsibility is to **express a conclusion** on the Statement based on our review."* (Not an opinion, not reasonable assurance). |
| **3. Engagement Standard** | **Standard on Review Engagements (SRE) 2410**, *"Review of Interim Financial Information Performed by the Independent Auditor of the Entity"*, issued by ICAI. |
| **4. Comparative Scope** | *"A review is **substantially less in scope than an audit** conducted in accordance with Standards on Auditing specified under section 143(10) of the Companies Act, 2013 and consequently does not enable us to obtain assurance that we would become aware of all significant matters that might be identified in an audit. Accordingly, we do not express an audit opinion."* |
| **5. Conclusion Phrasing** | *"Based on our review... **nothing has come to our attention that causes us to believe** that the accompanying Statement... has **not disclosed the information required to be disclosed** in terms of Regulation 33 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, as amended, including the manner in which it is to be disclosed, or that it contains any material misstatement."* |`,
    defaultRemarks: {
      efficiencyReasoning: "Comprehensive evaluation of standard review report drafting under SEBI LODR Regulation 33 and SRE 2410.",
      criticalMisses: ["Addressing report to Audit Committee or Shareholders instead of Board of Directors.", "Using audit terminology (\"opinion\") instead of \"conclusion\".", "Misstating the scope comparison sentence."],
      suggestions: ["Memorize the exact standard negative assurance formula used for listed quarterly results."],
    }
  },
  {
    id: "aud_th_ch10_tk01",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Importance of \"Inquiry\" as an Audit Procedure in Review Engagements",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q1",
    question: "Discuss why \"inquiry\" is important as an audit procedure in an engagement to review financial statements in accordance with SRE 2400.",
    keyConcepts: [
      {"keyword": "Principal Source of Evidence", "category": "Provision", "description": "Inquiry is the primary source of evidence regarding management intent"},
      {"keyword": "Management Intent & History", "category": "Keyword", "description": "Understanding past history, stated reasons, and ability to pursue course of action"},
      {"keyword": "Professional Skepticism", "category": "Keyword", "description": "Exercising skepticism when evaluating management responses"},
      {"keyword": "Updating Entity Understanding", "category": "Provision", "description": "Inquiries assist in identifying areas where material misstatements are likely to arise"},
    ],
    shortSuggestedAnswer: `### Importance of Inquiry in Review Engagements (SRE 2400)

\`\`\`
                         ┌────────────────────────────────────────────────────────┐
                         │         Role of Inquiry in Review Engagements          │
                         └───────────────────────────┬────────────────────────────┘
                                                     │
         ┌───────────────────────────┬───────────────┴───────────────┬───────────────────────────┐
         ▼                           ▼                               ▼                           ▼
[Primary Evidence of Intent]  [Corroboration of History]   [Updating Understanding]   [Risk Identification]
 • Only way to discover        • Assesses past patterns &    • Updates knowledge of     • Uncovers areas prone
   management intentions         management capability         systems & operations       to misstatements
\`\`\`

* **1. Principal Source of Evidence for Intent:** Evidence obtained through inquiry is often the principal source of evidence about management’s intent. Where formal documentary support is limited, inquiries provide vital insight.
* **2. Corroboration of Management Representations:** Inquiry enables the practitioner to understand management's past history of carrying out its stated intentions, the business rationale for decisions, and management's practical capability to execute them.
* **3. Application of Professional Skepticism:** It provides the raw inputs that the practitioner evaluates critically using professional skepticism to determine whether anything causes belief that financials are misstated.
* **4. Updating Entity Understanding:** Inquiries assist in obtaining or updating the practitioner's understanding of the entity, its operations, accounting systems, and changing environment to identify high-risk areas.
* **5. Focus Areas of Inquiry:** Inquiries address accounting estimates, related party dealings, fraud occurrences, going concern assumptions, contractual contingencies, subsequent events, and non-monetary transactions.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests theoretical appreciation of why inquiry serves as a cornerstone procedure in limited assurance engagements.",
      criticalMisses: ["Failing to identify inquiry as the principal source of evidence for management intent.", "Omitting the link between inquiry and professional skepticism."],
      suggestions: ["Mention both management intent and updating entity understanding as dual objectives."],
    }
  },
  {
    id: "aud_th_ch10_tk02",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "CA Aditya Jain: Procedures to Update Understanding for Quarterly Review (SRE 2410)",
    difficulty: "Advanced",
    marks: 5,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q2",
    question: "CA Aditya Jain is auditor of a listed company. He is also required to carry out a quarterly review of financial statements of company in terms of regulatory requirements. He is already well-versed with the business of the company and has a deep understanding of the company. Discuss any of the five procedures by which he can update his understanding of the company for carrying out quarterly review.",
    keyConcepts: [
      {"keyword": "SRE 2410", "category": "Standard", "description": "Review of Interim Financial Information by Independent Auditor"},
      {"keyword": "Prior Working Papers", "category": "Keyword", "description": "Reading documentation of prior year audit and recent interim reviews"},
      {"keyword": "Significant Risks", "category": "Keyword", "description": "Considering risks identified in prior audit including management override"},
      {"keyword": "Materiality Considerations", "category": "Keyword", "description": "Considering materiality with reference to interim financial reporting framework"},
      {"keyword": "Management Inquiries", "category": "Keyword", "description": "Inquiring about fraud risks, business changes, and internal control modifications"},
    ],
    shortSuggestedAnswer: `### Five Procedures to Update Entity Understanding (SRE 2410 Paragraph 3.3)

To update understanding of the entity, its environment, and internal controls for a quarterly review under **SRE 2410**, CA Aditya Jain should perform the following five procedures:

* **1. Reading Prior Audit & Review Documentation:** Review the working papers and documentation of the preceding year’s audit and reviews of prior interim period(s) of the current year and corresponding period of the prior year, to identify ongoing issues affecting current interim information.
* **2. Considering Prior Significant Risks:** Review significant audit risks identified during the annual audit, specifically including the **risk of management override of controls** and complex accounting estimates.
* **3. Reading Recent Financial Information:** Examine the most recent annual audited financial statements and comparable prior period interim statements to identify unusual structural variations.
* **4. Evaluating Materiality & Prior Year Misstatements:** Determine interim materiality under Ind AS 34 and review the nature of corrected material misstatements and uncorrected immaterial misstatements from prior audits.
* **5. Targeted Inquiries of Management:** Inquire of management regarding:
  * Management’s updated assessment of fraud risk;
  * Significant changes in business operations, product lines, or commercial contracts;
  * Material modifications in internal control architecture; and
  * The process used to reconcile interim data with underlying accounting ledgers.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact knowledge of SRE 2410 procedures for updating understanding in recurring reviews.",
      criticalMisses: ["Suggesting full re-audit procedures instead of updating procedures.", "Omitting prior year risk review (especially management override)."],
      suggestions: ["Enumerate exactly 5 distinct procedures with clear statutory phrasing."],
    }
  },
  {
    id: "aud_th_ch10_tk03",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Significance of \"Date of Report\" in a Review Report (SRE 2400 / 2410)",
    difficulty: "Moderate",
    marks: 4,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q3",
    question: "What is significance of \"date of report\" in a review report?",
    keyConcepts: [
      {"keyword": "Date of Review Report", "category": "Keyword", "description": "Report cannot be dated earlier than obtaining sufficient appropriate evidence"},
      {"keyword": "Completion of Financials", "category": "Provision", "description": "All component statements and explanatory notes must be prepared"},
      {"keyword": "Management Responsibility Assertion", "category": "Provision", "description": "Those with recognized authority assert they have taken responsibility for FS"},
      {"keyword": "Subsequent Events Cut-off", "category": "Provision", "description": "Informs reader that auditor considered events up to the report date"},
    ],
    shortSuggestedAnswer: `### Significance of Date of Report in a Review Engagement (SRE 2400 / SRE 2410)

The date of the review report is of paramount legal and procedural significance:

* **1. Evidence Cut-Off Benchmark:** The practitioner shall date the review report **no earlier than the date on which the practitioner has obtained sufficient appropriate evidence** as the basis for the conclusion.
* **2. Assurance of Financial Statement Completeness:** It confirms that, as of that date:
  * All statements comprising the complete or condensed financial reporting package (including accompanying notes) have been fully prepared.
* **3. Confirmation of Management Authority:** It signifies that persons with recognized authority (e.g., Board of Directors) have formally **asserted that they have taken responsibility** for those financial statements.
* **4. Demarcation of Subsequent Events Responsibility:** It marks the terminal date up to which the auditor has a responsibility to perform review procedures regarding subsequent events. The practitioner has **no obligation to perform procedures after the date of the review report**.`,
    defaultRemarks: {
      efficiencyReasoning: "Focuses on the dual legal pillars of report dating: evidence sufficiency and management assertion of responsibility.",
      criticalMisses: ["Failing to mention that report cannot predate obtaining sufficient evidence.", "Omitting the management responsibility assertion requirement."],
      suggestions: ["Cite the 4 precise statutory significances in crisp bullet points."],
    }
  },
  {
    id: "aud_th_ch10_tk04",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "CA Pankaj Chaturvedi: Subsequent Events Responsibility under SRE 2410",
    difficulty: "Advanced",
    marks: 5,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q4",
    question: "CA Pankaj Chaturvedi has issued a review report dated 28-07-2024 for the financial results of a company for quarter ending 30-06-2024. Describe his responsibility, if any, for events occurring from 01-07-2024 till date of review report in accordance with SRE 2410.",
    keyConcepts: [
      {"keyword": "SRE 2410", "category": "Standard", "description": "Review of Interim Financial Information"},
      {"keyword": "Interim Subsequent Events", "category": "Provision", "description": "Events occurring between quarter-end and date of review report"},
      {"keyword": "Inquiry Duty", "category": "Provision", "description": "Auditor must inquire whether management identified events requiring adjustment/disclosure"},
      {"keyword": "No Active Search Obligation", "category": "Keyword", "description": "Auditor is not required to perform other procedures beyond inquiry"},
      {"keyword": "Post-Report Date Facts", "category": "Provision", "description": "Rules if facts become known after report date but before FS issuance"},
    ],
    shortSuggestedAnswer: `### Auditor Responsibility for Subsequent Events under SRE 2410

* **1. Primary Obligation for the Period (01-07-2024 to 28-07-2024):**
  * Under **SRE 2410**, the auditor **shall inquire of management** whether they have identified all events occurring up to the date of the review report (28-07-2024) that may require adjustment to, or disclosure in, the interim financial information.
  * **Limited Procedure Scope:** It is **not necessary** for the auditor to perform exhaustive audit procedures (such as reviewing subsequent bank statements or vouchers) to actively search for events occurring after the balance sheet date. Inquiry of management is the primary required procedure.
* **2. Action if Material Subsequent Events are Identified:**
  * If the auditor becomes aware of events requiring adjustment or disclosure under Ind AS 10 / Ind AS 34, the auditor must request management to amend the interim statements.
  * If management refuses, the auditor must **modify the review report** (qualified or adverse conclusion).
* **3. Post-Report Date (After 28-07-2024):**
  * The auditor has **no obligation** to perform any procedures after 28-07-2024.
  * However, if facts become known prior to publication that would have caused amendment of the report, the auditor must discuss with management and take steps to prevent reliance if unamended.`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact boundaries of subsequent events responsibility in interim reviews vs annual audits.",
      criticalMisses: ["Confusing SRE 2410 inquiry requirements with full SA 560 audit procedures.", "Failing to note that active testing is not required beyond inquiry."],
      suggestions: ["State clearly that inquiry of management is mandatory, but active audit searching is not required."],
    }
  },
  {
    id: "aud_th_ch10_tk05",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Going Concern Doubt in SRE 2400 Review: Steps by Practitioner",
    difficulty: "Advanced",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q5",
    question: "A review of financial statements includes consideration of the entity\u2019s ability to continue as a going concern. If, during the performance of the review, the practitioner becomes aware of events or conditions that may cast significant doubt about the entity\u2019s ability to continue as a going concern. Enumerate the steps to be taken by the practitioner for the same.",
    keyConcepts: [
      {"keyword": "SRE 2400", "category": "Standard", "description": "Going concern consideration in review of historical FS"},
      {"keyword": "Inquire Management Plans", "category": "Provision", "description": "Inquiring about future plans, debt restructuring, asset liquidation, and feasibility"},
      {"keyword": "Evaluate Results of Inquiries", "category": "Provision", "description": "Evaluating if plans provide sufficient basis to continue going concern basis"},
      {"keyword": "Consider All Relevant Info", "category": "Keyword", "description": "Assessing responses in light of all evidence gathered during review"},
      {"keyword": "Reporting Implications", "category": "Provision", "description": "Emphasis of Matter if disclosed; Qualified or Adverse if undisclosed"},
    ],
    shortSuggestedAnswer: `### Statutory Steps under SRE 2400 for Going Concern Uncertainty

When events or conditions cast significant doubt on going concern, the practitioner shall follow these sequential steps:

\`\`\`
[Step 1: Inquire of Management Regarding Future Action Plans & Feasibility]
                                     │
                                     ▼
[Step 2: Evaluate Responses - Is Going Concern Basis Appropriate? Is FS Misstated?]
                                     │
                                     ▼
[Step 3: Consider Responses Against All Information Known from Review]
                                     │
                                     ▼
[Step 4: Evaluate Adequacy of Financial Statement Disclosures]
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          ▼                                                     ▼
[Adequate Disclosure in Notes]                          [Inadequate / Omitted Disclosure]
          │                                                     │
          ▼                                                     ▼
[Unmodified Conclusion +                                [Modified Conclusion:
 Emphasis of Matter (EOM) Paragraph]                     Qualified or Adverse Conclusion]
\`\`\`

* **Step 1 - Inquire of Management:** Inquire regarding plans for future actions affecting going concern (e.g., plans to liquidate assets, borrow funds, restructure debt, delay expenditures, or raise equity), the **feasibility of those plans**, and whether management believes the outcome will improve conditions.
* **Step 2 - Evaluate Inquiries:** Evaluate whether management's responses provide a sufficient basis to:
  * Continue presenting financial statements on the going concern basis; or
  * Conclude whether the financial statements are materially misstated or otherwise misleading.
* **Step 3 - Synthesize with All Knowledge:** Consider management’s explanations in light of all other relevant information obtained during the review.
* **Step 4 - Formulate Reporting Conclusion:**
  * **Adequately Disclosed:** If material uncertainty exists but is fully disclosed, add an **Emphasis of Matter paragraph** (conclusion is unmodified).
  * **Inadequately Disclosed / Inappropriate Basis:** If disclosure is inadequate or going concern basis is invalid, express a **Qualified Conclusion** or **Adverse Conclusion** as appropriate.`,
    defaultRemarks: {
      efficiencyReasoning: "Comprehensive breakdown of going concern evaluation steps under SRE 2400.",
      criticalMisses: ["Omitting the inquiry into the feasibility of management plans.", "Failing to explain the reporting split between adequate disclosure (EOM) and inadequate disclosure (Modification)."],
      suggestions: ["Use the sequential 4-step structure."],
    }
  },
  {
    id: "aud_th_ch10_tk06",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "GAK Limited: Continuous Losses, Defaults & Material Uncertainty under SRE 2410",
    difficulty: "Mastery",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q6",
    question: "GAK Limited has compiled the interim financial information, as per the Listing agreement requirements, and submitted it to the auditors for their review. CA Reena has been assigned on the engagement to review the interim financial information of GAK Limited. Based on the inquiries and other review procedures carried out, CA Reena assessed that GAK Limited has been facing continuous working capital shortages. No financial institutions or banks are ready to lend additional funding limits to GAK Limited, since the company has been continuously incurring losses for over 3 years and the company has defaulted payment of loan instalments & interest over the last one year and operations have been curtailed significantly. Under such circumstances CA Reena, who is doing the review for the first time, noted that GAK Limited has not disclosed any information in the interim financial information relating to material uncertainties. Given the situation, please advise CA Reena, what kind of review report is required to be issued? If, GAK Limited has disclosed information relating to material uncertainty, can CA Reena give a clean report? Discuss.",
    keyConcepts: [
      {"keyword": "SRE 2410", "category": "Standard", "description": "Review of Interim Financial Information by Independent Auditor"},
      {"keyword": "Material Uncertainty on Going Concern", "category": "Provision", "description": "Working capital crisis, recurring losses, debt defaults indicate severe going concern doubt"},
      {"keyword": "Qualified or Adverse Conclusion", "category": "Provision", "description": "Mandatory modification when material uncertainty is NOT disclosed in interim FS"},
      {"keyword": "Emphasis of Matter Paragraph", "category": "Provision", "description": "If disclosed, report is modified by adding an EOM paragraph; clean unmodified conclusion cannot be given without EOM"},
    ],
    shortSuggestedAnswer: `### 1. Assessment of Circumstances under SRE 2410
* **Critical Going Concern Indicators:** Continuous working capital shortages, denial of credit lines, 3-year recurring operating losses, defaults on loan principal & interest, and curtailed operations constitute conclusive indicators casting **significant doubt on the entity’s ability to continue as a going concern**.

---

### 2. Situation A: GAK Limited Has NOT Disclosed Material Uncertainty
* **Statutory Rule:** As per **SRE 2410**, if a material uncertainty casting significant doubt on going concern is **not adequately disclosed** in the interim financial information, the auditor **shall express a Qualified Conclusion or Adverse Conclusion**, as appropriate.
* **Content of Report:** The report must include specific reference to the fact that such material uncertainty exists and explain the omission in a Basis for Modification paragraph.

---

### 3. Situation B: GAK Limited HAS Disclosed Material Uncertainty
* **Can a Clean (Unmodified) Report Be Given?**
  * **No**, a completely standard clean report without any modification cannot be issued.
  * **Required Reporting:** If adequate disclosure is made in the notes to the interim financial information, the auditor modifies the review report by **adding an Emphasis of Matter (EOM) paragraph**.
  * **Conclusion Status:** While the substantive conclusion remains unmodified (*"Based on our review, nothing has come to our attention..."*), the review report itself is **modified by the inclusion of the EOM paragraph** highlighting the continued material uncertainty.`,
    defaultRemarks: {
      efficiencyReasoning: "Evaluates critical discernment: adequate disclosure does NOT permit a silent clean report; it mandates an Emphasis of Matter paragraph.",
      criticalMisses: ["Stating that disclosure allows a standard clean report without an EOM paragraph.", "Failing to prescribe Qualified or Adverse conclusion when disclosure is missing."],
      suggestions: ["Clearly address both sub-scenarios: Non-disclosure vs Adequate disclosure."],
    }
  },
  {
    id: "aud_th_ch10_tk07",
    subjectId: "Audit",
    chapterName: "Review of Financial Information",
    title: "Core Procedures & Mandatory Scope Disclaimer Statements in SRE 2400",
    difficulty: "Advanced",
    marks: 6,
    icaiExamRef: "ICAI SM - Chapter 10 Test Your Knowledge Q7",
    question: "In a review engagement performed under SRE 2400, practitioner relies mainly on certain procedures. Naming such procedures, discuss the importance of these procedures in a review engagement. Practitioner\u2019s report containing outcome of review engagement in form of \"conclusion\" also contains a description of a review of financial statements and its limitations. Which statements in this respect are to be included in the practitioner\u2019s report in accordance with SRE 2400?",
    keyConcepts: [
      {"keyword": "SRE 2400", "category": "Standard", "description": "Review of Historical Financial Statements"},
      {"keyword": "Inquiry & Analytical Procedures", "category": "Provision", "description": "Two primary evidence-gathering procedures in a review"},
      {"keyword": "Limited Assurance Statement", "category": "Keyword", "description": "Statement that review is a limited assurance engagement"},
      {"keyword": "Substantially Less than Audit", "category": "Keyword", "description": "Procedures are substantially less than an audit conducted under SAs"},
      {"keyword": "No Audit Opinion Expressed", "category": "Keyword", "description": "Explicit disclaimer that no audit opinion is expressed"},
    ],
    shortSuggestedAnswer: `### 1. Core Procedures in SRE 2400 & Their Importance
The practitioner relies primarily on two procedures:
* **(a) Inquiry:** Seeking information from management and internal personnel.
  * *Importance:* Serves as the principal source of evidence regarding management intent, estimates, commitments, fraud risks, and updates the practitioner's understanding of the entity.
* **(b) Analytical Procedures:** Designing comparisons, ratio analysis, and trend evaluations against expected values.
  * *Importance:* Identifies inconsistencies, unusual variances, and unrecorded transactions, providing corroborative evidence across line items.

---

### 2. Mandatory Statements Describing Review & Limitations in the Report
Under **SRE 2400 Paragraph 2.4(g)**, the practitioner’s report must contain a section describing the review and its limitations with the following **three verbatim statutory statements**:

1. **Nature of Engagement:** A statement that *"a review engagement under this SRE is a **limited assurance engagement**"*;
2. **Procedures Performed:** A statement that *"the practitioner performs procedures, **primarily consisting of making inquiries of management and others within the entity, as appropriate, and applying analytical procedures**, and evaluates the evidence obtained"*; and
3. **Substantial Scope Limitation & No Opinion Disclaimer:** A statement that *"the procedures performed in a review are **substantially less than those performed in an audit conducted in accordance with Standards on Auditing (SAs)**, and, accordingly, the practitioner **does not express an audit opinion on the financial statements**."*`,
    defaultRemarks: {
      efficiencyReasoning: "Tests exact knowledge of the two primary review procedures and the three mandatory statutory limitation disclaimers in SRE 2400.",
      criticalMisses: ["Failing to quote the 3 statutory disclaimer statements in the review report.", "Omitting analytical procedures as the co-equal partner of inquiry."],
      suggestions: ["Present the three statements clearly numbered matching SRE 2400 paragraph 2.4(g)."],
    }
  }
];
