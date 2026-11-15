/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneralQuestion } from '../../types';

export const PART3_SPECIALISED_SECTORS_MCQS: GeneralQuestion[] = [
  // =========================================================================================
  // CHAPTER 12: DIGITAL AUDITING & ASSURANCE
  // Target: 10 new MCQs (Total: 12)
  // =========================================================================================
  {
    id: 'AUD_CH12_01',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'Under the proviso to Rule 3(1) of the Companies (Accounts) Rules, 2014, for which financial year did the requirement for companies using accounting software to maintain an unalterable audit trail (edit log) become mandatory?',
    options: [
      'Financial year commencing on or after 1st April 2021',
      'Financial year commencing on or after 1st April 2022',
      'Financial year commencing on or after 1st April 2023',
      'Financial year commencing on or after 1st April 2024'
    ],
    correctOptionIndex: 2,
    explanation: 'The MCA mandated that for the financial year commencing on or after the 1st day of April 2023, every company which uses accounting software for maintaining its books of account shall use only such accounting software which has a feature of recording audit trail of each and every transaction, creating an edit log of each change made in books of account along with the date and ensuring that the audit trail cannot be disabled.'
  },
  {
    id: 'AUD_CH12_02',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'Under Rule 11(g) of the Companies (Audit and Auditors) Rules, 2014, what is the statutory auditor’s specific reporting duty regarding the accounting software audit trail?',
    options: [
      'To verify whether the software was purchased from a government-certified software vendor.',
      'To report whether the company has used accounting software with audit trail (edit log) feature throughout the year; whether it operated without being tampered with or disabled; and whether the audit trail has been preserved as per statutory requirements for record retention.',
      'To recode the software database using proprietary scripts.',
      'To certify that no hardware failures occurred during the financial year.'
    ],
    correctOptionIndex: 1,
    explanation: 'Rule 11(g) requires the auditor to report: (1) whether the company has used such accounting software which has a feature of recording audit trail (edit log) facility and the same has operated throughout the year for all transactions recorded in the software; (2) whether the audit trail feature has not been tampered with; and (3) whether the audit trail has been preserved as per statutory requirements for record retention (8 years under Section 128(5)).'
  },
  {
    id: 'AUD_CH12_03',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'Which of the following is categorized as an Information Technology General Control (ITGC) rather than an Application Control?',
    options: [
      'Three-way matching of Purchase Order, Goods Receipt Note, and Vendor Invoice.',
      'System-enforced user access administration, segregation of duties, and change management procedures in the IT environment.',
      'Automated check ensuring that customer sales credit limits cannot be exceeded without supervisor override.',
      'Range check preventing entry of payroll hours exceeding 24 hours per day.'
    ],
    correctOptionIndex: 1,
    explanation: 'ITGCs (Information Technology General Controls) are policies and procedures that relate to many applications and support the effective functioning of application controls. Examples include access security (passwords, user provisioning, segregation of duties), program change management, and data center operations. The other three options are automated application controls specific to individual transaction processing.'
  },
  {
    id: 'AUD_CH12_04',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'What is the primary operational difference between Substantive Testing using CAATs (Computer Assisted Audit Techniques) versus Traditional Manual Audit Testing?',
    options: [
      'CAATs can only be applied to paper vouchers.',
      'CAATs allow the auditor to test 100% of large populations and identify specific anomalies/outliers, whereas traditional testing relies heavily on representative sampling.',
      'CAATs eliminate the need for the auditor to apply professional skepticism.',
      'CAATs can only be used by forensic auditors and not statutory auditors.'
    ],
    correctOptionIndex: 1,
    explanation: 'CAATs and data analytics tools enable the auditor to perform analytical and detailed procedures on 100% of transaction populations (e.g., verifying every invoice, detecting gaps in sequential numbering, matching employee bank details with vendor master files) rather than inspecting limited sample selections.'
  },
  {
    id: 'AUD_CH12_05',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'In an audit of an entity using a public Cloud Service Provider (CSP) under Infrastructure as a Service (IaaS), which security domain remains the EXCLUSIVE responsibility of the client entity rather than the CSP under the Shared Responsibility Model?',
    options: [
      'Physical data center perimeter security and biometric facility access.',
      'Operating system patching, user access management, application configuration, and data encryption at rest and in transit.',
      'Server hardware replacement and redundant cooling systems.',
      'Undersea fiber cable maintenance and power substation backup.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the cloud Shared Responsibility Model: the Cloud Service Provider is responsible for the "security OF the cloud" (physical data center facilities, hardware, network infrastructure). The client entity is responsible for "security IN the cloud" (operating system security, user access controls, application data, encryption, and firewall configuration).'
  },
  {
    id: 'AUD_CH12_06',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'Which Automated Application Control is designed to ensure that data entered into a numerical field contains only valid characters within an authorized boundary?',
    options: [
      'Sequence Check',
      'Range Check / Limit Check',
      'Echo Check',
      'Completeness Check'
    ],
    correctOptionIndex: 1,
    explanation: 'A Range Check or Limit Check tests numerical data against predetermined lower and upper boundaries (e.g., an employee age field must be between 18 and 65; or a discount percentage cannot exceed 25%). Sequence checks verify numerical continuity.'
  },
  {
    id: 'AUD_CH12_07',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'What is an "Embedded Audit Module" (EAM) in Continuous Auditing?',
    options: [
      'A hardware chip physically installed on the client’s motherboards by the IT department.',
      'Specialized audit code programmed directly into the client’s operational application system to continuously capture, flag, and write transactions meeting specific risk criteria to an audit log file in real time.',
      'An external USB flash drive containing backup files.',
      'An encrypted PDF viewer used to read audit standards.'
    ],
    correctOptionIndex: 1,
    explanation: 'An Embedded Audit Module (EAM) is audit-specific code integrated into the host application system. As transactions are processed in real time, the EAM monitors transaction streams and captures transactions meeting predetermined audit criteria (e.g., transactions exceeding ₹1 Crore, off-hours postings) and writes them to a secure auditor log (System Control Audit Review File - SCARF).'
  },
  {
    id: 'AUD_CH12_08',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'If an auditor discovers that the audit trail (edit log) feature of the company’s accounting software was disabled for three weeks during the financial year, how should this be dealt with under Rule 11(g)?',
    options: [
      'It can be ignored if the company manual accounts were maintained.',
      'The auditor must modify/qualify the reporting under Rule 11(g), stating the period for which the audit trail feature was disabled and the consequential impact.',
      'The auditor must file a winding up petition under Section 271.',
      'The auditor must demand that management delete all transactions for those three weeks.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the ICAI Implementation Guide on Reporting on Audit Trail under Rule 11(g), if the audit trail feature was disabled during any period of the financial year, the auditor cannot state that the software operated throughout the year with an audit trail feature. The auditor must issue a modified/qualified report under Rule 11(g) specifying the period of disabling and exceptions identified.'
  },
  {
    id: 'AUD_CH12_09',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'What is a "Smurfing / Structuring" pattern that can be efficiently detected through Data Analytics routines during an audit of cash disbursements?',
    options: [
      'Routine salary payments made on the last working day of each month.',
      'Deliberate splitting of large transactions into multiple payments just below a mandatory threshold (e.g., multiple payments of ₹9,800 to avoid ₹10,000 cash payment disallowance under Section 40A(3) or manager approval thresholds).',
      'Foreign exchange remittances processed through authorized dealer banks.',
      'Vendor invoices processed with 2% cash discount.'
    ],
    correctOptionIndex: 1,
    explanation: 'Smurfing or structuring is the practice of breaking down a large sum of money into multiple smaller transactions to evade scrutiny, mandatory authorization limits, or statutory thresholds (such as the ₹10,000 cash threshold under Section 40A(3) of the Income Tax Act). CAAT routines can immediately identify clusters of payments just below threshold levels.'
  },
  {
    id: 'AUD_CH12_10',
    subjectId: 'Audit',
    chapterName: 'Digital Auditing & Assurance',
    questionText: 'In evaluating cybersecurity risks during a statutory audit, what is the auditor’s PRIMARY focus under SA 315 and SA 240?',
    options: [
      'To personally hack into the client’s firewalls using penetration testing tools.',
      'To evaluate whether cybersecurity vulnerabilities or breaches could lead to a material misstatement in the financial statements (e.g., unrecorded liabilities, theft of sensitive data, loss of financial records, or system downtime affecting billing).',
      'To write custom firewall rules for the client’s routers.',
      'To verify whether all employees use company-branded laptop bags.'
    ],
    correctOptionIndex: 1,
    explanation: 'The financial auditor’s focus in evaluating cybersecurity is not to act as a general network penetration tester, but to assess the risk of material misstatement arising from cyber threats: whether unauthorized access could corrupt financial data, compromise proprietary assets, create unrecorded litigation/fines, or impair going concern.'
  },

  // =========================================================================================
  // CHAPTER 13: GROUP AUDITS (SA 600, Ind AS 110, CFS)
  // Target: 10 new MCQs (Total: 11)
  // =========================================================================================
  {
    id: 'AUD_CH13_01',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'Under SA 600 "Using the Work of Another Auditor" as applicable in India, what is the statutory principle regarding the Principal Auditor’s liability for the work performed by Component Auditors?',
    options: [
      'The Principal Auditor is vicariously and jointly liable for all errors made by Component Auditors.',
      'The Principal Auditor is NOT vicariously liable for the work of the component auditor, provided the principal auditor exercised due professional care in coordinating the work and reviewing the component auditor’s report and findings.',
      'The Principal Auditor must perform 100% re-audit of all components.',
      'The Principal Auditor must obtain a personal financial guarantee from the component auditor.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 600 paragraph 3 and 12, the principal auditor can rely on the work of the other auditor, and is not responsible for the work performed by the other auditor, unless there are circumstances to put the principal auditor on suspicion. The principal auditor fulfills their duty by advising the other auditor of the use of work, issuing questionnaires, and reviewing written summaries.'
  },
  {
    id: 'AUD_CH13_02',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'When the Principal Auditor bases their opinion on Consolidated Financial Statements partly on the reports of Component Auditors, how must this be disclosed in the Principal Auditor’s Report under SA 600?',
    options: [
      'It must be reported as an adverse qualification under SA 705.',
      'The Principal Auditor shall state in their report the division of responsibility by clearly indicating the extent to which the financial statements of components audited by other auditors have been included (e.g., percentage/amount of total assets, revenue, and cash flows audited by other auditors).',
      'The names and personal PAN numbers of all component audit partners must be published in a national newspaper.',
      'No disclosure is permitted because it weakens user confidence.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 600 paragraph 14 mandates that when the principal auditor bases their opinion on the financial statements as a whole upon the work of other auditors, the auditor’s report shall state clearly the division of responsibility between the portions of the financial statements covered by the principal auditor and those covered by other auditors, indicating the amount of total assets and revenue audited by others.'
  },
  {
    id: 'AUD_CH13_03',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'Does the reference to the fact that component auditors audited certain subsidiaries, associates, or joint ventures in the Principal Auditor’s Report constitute a MODIFICATION of the opinion under SA 705?',
    options: [
      'Yes, it is always a qualified opinion.',
      'No, the reference to other auditors represents an explicit statement of the division of responsibility as contemplated by SA 600 and does NOT constitute a qualification or modification of the audit opinion.',
      'Yes, it must be treated as an adverse opinion.',
      'It is treated as a Disclaimer of Opinion.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 600 clarifies that expressing the division of responsibility by referring to the work and reports of other auditors is a standard reporting mechanism and does not, in itself, constitute a modification or qualification of the audit opinion.'
  },
  {
    id: 'AUD_CH13_04',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'Under Ind AS 110 (Consolidated Financial Statements), what is the MAXIMUM allowable time difference between the reporting date of a subsidiary and the reporting date of the parent company for consolidation purposes?',
    options: [
      'There can be no difference; the dates must be identical.',
      'The difference shall be no more than 3 months, and adjustments must be made for the effects of significant transactions or events that occur between that date and the parent’s reporting date.',
      'Up to 6 months without any adjustments.',
      'Up to 12 months provided the subsidiary is located in an OECD country.'
    ],
    correctOptionIndex: 1,
    explanation: 'Ind AS 110 paragraph B92 specifies: "The financial statements of the parent and its subsidiaries used in the preparation of the consolidated financial statements shall have the same reporting date. When the end of the reporting period of the parent is different from that of a subsidiary... the difference between the end of the reporting period of the subsidiary and that of the parent shall be no more than three months; and adjustments shall be made for the effects of significant transactions or events that occur between those dates."'
  },
  {
    id: 'AUD_CH13_05',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'In preparing Consolidated Financial Statements, what is the auditor’s duty regarding the harmonization of accounting policies across all group entities under Ind AS 110 / AS 21?',
    options: [
      'Each subsidiary is free to follow completely different accounting policies without any adjustments in consolidation.',
      'Consolidated financial statements must be prepared using uniform accounting policies for like transactions and other events in similar circumstances; if a group entity uses different policies, appropriate adjustments must be made upon consolidation.',
      'The parent company must adopt the accounting policies of its smallest foreign subsidiary.',
      'Differences in accounting policies must be reported as cash losses under CARO.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Ind AS 110 paragraph B87 and AS 21, consolidated financial statements shall be prepared using uniform accounting policies for like transactions and other events in similar circumstances. If a member of the group uses accounting policies other than those adopted in the CFS, appropriate adjustments are made to that group member’s financial statements in preparing the CFS.'
  },
  {
    id: 'AUD_CH13_06',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'What must the statutory auditor do if management includes the financial statements of a MATERIAL foreign subsidiary based purely on UNAUDITED management accounts without obtaining an audit report?',
    options: [
      'Issue an unmodified opinion with a private email to the CFO.',
      'Evaluate whether the unaudited component is material to the group financial statements, and if material and sufficient appropriate evidence cannot be obtained, qualify or disclaim the opinion under SA 705 due to scope limitation.',
      'Appoint a police inspector to audit the foreign subsidiary.',
      'Exclude the subsidiary completely from consolidation.'
    ],
    correctOptionIndex: 1,
    explanation: 'If a material component’s financial statements included in the CFS are unaudited and the principal auditor is unable to obtain sufficient appropriate audit evidence through alternative procedures, a scope limitation exists. Depending on materiality and pervasiveness, the principal auditor shall express a qualified opinion or disclaimer of opinion under SA 705.'
  },
  {
    id: 'AUD_CH13_07',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'Under Schedule III (General Instructions for Consolidated Financial Statements) to the Companies Act, 2013, what specific disclosure table must be included in the notes to CFS regarding components?',
    options: [
      'A list of employee names and blood groups for every subsidiary.',
      'A table disclosing for each subsidiary, associate, and joint venture: (1) Net Assets (amount and as % of consolidated net assets), and (2) Share in Profit or Loss (amount and as % of consolidated profit/loss).',
      'The daily share price movement of each group company.',
      'The bank account statement of the holding company’s directors.'
    ],
    correctOptionIndex: 1,
    explanation: 'Schedule III Division II (Ind AS) and Division I (AS) mandate a specific disclosure table in the CFS showing the name of each entity (parent, Indian subsidiaries, foreign subsidiaries, associates, JVs), their Net Assets as a % of consolidated net assets and amount, and Share in Profit or Loss as a % of consolidated profit or loss and amount.'
  },
  {
    id: 'AUD_CH13_08',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'Under SA 600, what procedure should the Principal Auditor perform to assess the professional competence of a Component Auditor if they are not a member of ICAI (e.g., a foreign auditor)?',
    options: [
      'Require the foreign auditor to appear for the CA Final examination.',
      'Inquire about the professional reputation, standing, and membership in recognized professional bodies of the foreign component auditor.',
      'Reject the foreign component’s accounts automatically.',
      'Refuse to sign the group audit report.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 600 paragraph 9 provides that when using the work of another auditor who is not a member of the Institute of Chartered Accountants of India, the principal auditor should consider the professional competence of the other auditor in the context of the specific assignment (e.g., checking membership in recognized foreign institutes, professional standing, and experience).'
  },
  {
    id: 'AUD_CH13_09',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'In auditing the elimination of intra-group transactions during consolidation, which of the following must be 100% eliminated under Ind AS 110?',
    options: [
      'Only trade debts older than 3 years.',
      'Intra-group balances, transactions, income, expenses, and unrealized profits resulting from intra-group transactions.',
      'External bank loans taken by subsidiaries.',
      'Dividends paid to non-controlling external shareholders.'
    ],
    correctOptionIndex: 1,
    explanation: 'Ind AS 110 paragraph B86 requires full elimination of intra-group assets and liabilities, equity, income, expenses and cash flows relating to transactions between entities of the group (profits or losses resulting from intra-group transactions that are recognized in assets, such as inventory and fixed assets, are eliminated in full).'
  },
  {
    id: 'AUD_CH13_10',
    subjectId: 'Audit',
    chapterName: 'Group Audits',
    questionText: 'Under Section 129(3) of the Companies Act, 2013, which entities MUST be included by a company having one or more subsidiaries in its Consolidated Financial Statements?',
    options: [
      'Only wholly-owned Indian subsidiaries.',
      'All subsidiaries, associate companies, and joint venture companies.',
      'Only subsidiaries listed on Indian stock exchanges.',
      'Subsidiaries whose turnover exceeds ₹100 Crores.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 129(3) of the Companies Act, 2013 provides that where a company has one or more subsidiaries, it shall prepare a consolidated financial statement of the company and of all the subsidiaries. The Explanation to Section 129(3) clarifies that the word "subsidiary" shall include associate company and joint venture.'
  },

  // =========================================================================================
  // CHAPTER 14: SPECIAL FEATURES OF AUDIT OF BANKS & NON-BANKING FINANCIAL COMPANIES
  // Target: 6 new MCQs (Total: 15)
  // =========================================================================================
  {
    id: 'AUD_CH14_01',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    questionText: 'Under RBI Prudential Norms on Income Recognition, Asset Classification and Provisioning (IRAC), what is the provision requirement for an unsecured SUB-STANDARD advance?',
    options: [
      '10%',
      '15%',
      '20% (for infrastructure) / 25% (for other advances)',
      '100%'
    ],
    correctOptionIndex: 2,
    explanation: 'Under RBI IRAC norms: Substandard assets require a general provision of 15% on the secured portion. The unsecured portion of substandard advances requires a provision of 25% (or 20% for infrastructure lending where there are certain safeguards).'
  },
  {
    id: 'AUD_CH14_02',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    questionText: 'Under RBI IRAC norms, what is the provisioning percentage on the SECURED portion of an advance classified as DOUBTFUL-2 (doubtful between 1 year and 3 years)?',
    options: [
      '25%',
      '40%',
      '50%',
      '100%'
    ],
    correctOptionIndex: 1,
    explanation: 'For Doubtful Assets, provisioning on the secured portion is: Doubtful-1 (up to 1 year) = 25%; Doubtful-2 (1 to 3 years) = 40%; Doubtful-3 (more than 3 years) = 100%. The unsecured portion is provisioned at 100% across all doubtful categories.'
  },
  {
    id: 'AUD_CH14_03',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    questionText: 'What is the definition of an account being treated as "Out of Order" in a Cash Credit / Overdraft facility under RBI master directions?',
    options: [
      'When the client forgets their internet banking password for 30 days.',
      'When the outstanding balance remains continuously in excess of the sanctioned limit / drawing power for 90 days; or where credits are insufficient to cover the interest debited during the previous 90-day period.',
      'When the borrower opens an account with another nationalized bank.',
      'When the stock audit report is delayed by 15 days.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under RBI norms, an overdraft/cash credit account is treated as "out of order" if: (a) the outstanding balance remains continuously in excess of the sanctioned limit/drawing power for 90 days; or (b) there are no credits continuously for 90 days as on the date of Balance Sheet or credits are not enough to cover the interest debited during the same period.'
  },
  {
    id: 'AUD_CH14_04',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    questionText: 'Under the Scale-Based Regulation (SBR) framework for NBFCs issued by RBI, what are the four structural regulatory layers?',
    options: [
      'Micro Layer, Small Layer, Medium Layer, Large Layer',
      'Base Layer (NBFC-BL), Middle Layer (NBFC-ML), Upper Layer (NBFC-UL), and Top Layer (NBFC-TL)',
      'Tier 1, Tier 2, Tier 3, Tier 4',
      'Class A, Class B, Class C, Class D'
    ],
    correctOptionIndex: 1,
    explanation: 'Under RBI Scale-Based Regulation (SBR) effective October 2022, NBFCs are categorized into four layers: (1) Base Layer (non-deposit taking NBFCs below ₹1000 Cr assets, P2P, AA, NOFHC); (2) Middle Layer (deposit-taking NBFCs irrespective of asset size, non-deposit NBFCs $\ge$ ₹1000 Cr, CICs, HFCs); (3) Upper Layer (top 50 NBFCs identified by scoring methodology); and (4) Top Layer (ordinarily empty, populated only if systemic risk surges).'
  },
  {
    id: 'AUD_CH14_05',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    questionText: 'Under Section 24 of the Banking Regulation Act, 1949, what is the Statutory Liquidity Ratio (SLR) and how is it verified by statutory auditors?',
    options: [
      'Cash held strictly in the central bank vault.',
      'Maintenance of assets in cash, gold, or unencumbered approved securities at an amount not less than the prescribed percentage of Net Demand and Time Liabilities (NDTL) as on alternate Fridays.',
      'Capital reserves held against bad debts.',
      'Foreign currency deposits held in Swiss banks.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 24 of the Banking Regulation Act, 1949 mandates every banking company to maintain in India in cash, gold or unencumbered approved securities an amount not less than the percentage of its Net Demand and Time Liabilities (NDTL) specified by RBI (SLR). Auditors verify the computation of NDTL and maintenance of SLR on alternate Fridays (reporting Fridays).'
  },
  {
    id: 'AUD_CH14_06',
    subjectId: 'Audit',
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    questionText: 'What is the purpose of the Long Form Audit Report (LFAR) in a Bank Branch Audit?',
    options: [
      'It is an advertising brochure highlighting the bank’s corporate social responsibility.',
      'It is a detailed diagnostic questionnaire prescribed by RBI covering advances, asset classification, internal controls, cash balances, deposits, and frauds, submitted by branch auditors to the bank management and statutory central auditors.',
      'It is a tax return filed with the Income Tax Appellate Tribunal.',
      'It is a confidential document sent exclusively to credit rating agencies.'
    ],
    correctOptionIndex: 1,
    explanation: 'The Long Form Audit Report (LFAR) is a comprehensive questionnaire prescribed by RBI that bank branch and central statutory auditors must complete. It provides qualitative and quantitative assessments of credit administration, NPA recovery, large advances, operational controls, compliance, and fraud occurrences.'
  },

  // =========================================================================================
  // CHAPTER 15: OVERVIEW OF AUDIT OF PUBLIC SECTOR UNDERTAKINGS
  // Target: 10 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH15_01',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Under Articles 148 to 151 of the Constitution of India, who appoints the Comptroller and Auditor General (C&AG) of India and how can the C&AG be removed from office?',
    options: [
      'Appointed by the Prime Minister; removed by a cabinet resolution.',
      'Appointed by the President of India by warrant under hand and seal; removed from office only in like manner and on the like grounds as a Judge of the Supreme Court.',
      'Appointed by the Finance Minister; removed at the pleasure of the President.',
      'Appointed by the Public Accounts Committee; removed after 5 years automatically.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Article 148 of the Constitution of India, the C&AG is appointed by the President by warrant under his hand and seal, and can only be removed from office in like manner and on the like grounds as a Judge of the Supreme Court (proved misbehaviour or incapacity with a special majority of Parliament).'
  },
  {
    id: 'AUD_CH15_02',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Under Section 139(5) of the Companies Act, 2013, in the case of a Government Company, who appoints the statutory auditor and within what timeline?',
    options: [
      'The Board of Directors within 30 days of incorporation.',
      'The Comptroller and Auditor General of India within a period of 180 days from the commencement of the financial year.',
      'The shareholders at the Annual General Meeting.',
      'The Central Government Ministry of Corporate Affairs within 60 days.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 139(5) of the Companies Act, 2013 provides that in the case of a Government company or any other company owned or controlled directly or indirectly by the Central Government or State Government(s), the C&AG shall, in respect of a financial year, appoint an auditor duly qualified under the Act within a period of 180 days from the commencement of the financial year.'
  },
  {
    id: 'AUD_CH15_03',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Under Section 143(6)(a) of the Companies Act, 2013, what is the right of the C&AG regarding a SUPPLEMENTARY AUDIT of a Government Company?',
    options: [
      'The C&AG must conduct a supplementary audit within 10 days of the start of the audit.',
      'The C&AG shall within 60 days from the date of receipt of the audit report have a right to conduct a supplementary audit of the financial statements by such person or persons as authorized.',
      'The C&AG has no right to conduct a supplementary audit if the statutory auditor was a top-tier audit firm.',
      'The C&AG can only conduct a supplementary audit after obtaining approval from the National Company Law Tribunal (NCLT).'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 143(6)(a) provides that the C&AG shall within 60 days from the date of receipt of the audit report have a right to conduct a supplementary audit of the financial statements of the government company by such person or persons as authorized in this behalf.'
  },
  {
    id: 'AUD_CH15_04',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Under Section 143(5) of the Companies Act, 2013, what must the statutory auditor of a Government Company submit along with the auditor’s report?',
    options: [
      'A copy of their personal income tax return.',
      'The directions issued by the C&AG, the action taken thereon, and the financial impact on the accounts or financial statements of the company.',
      'A recommendation on whether the government should privatize the enterprise.',
      'A certified list of all political donations made by the entity.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 143(5) mandates that the C&AG shall direct the manner in which accounts shall be audited and the auditor shall submit a copy of the audit report to the C&AG which shall include the directions, if any, issued by the C&AG, the action taken thereon and its impact on the accounts and financial statement of the company.'
  },
  {
    id: 'AUD_CH15_05',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'What are the "3 Es" evaluated during a PERFORMANCE AUDIT conducted by the C&AG of India?',
    options: [
      'Equity, Earnings, and Expectations',
      'Economy (minimizing resource cost), Efficiency (output-input relationship), and Effectiveness (achievement of policy objectives)',
      'Execution, Evaluation, and Enforcement',
      'Ethics, Environment, and Empowerment'
    ],
    correctOptionIndex: 1,
    explanation: 'A Performance Audit by C&AG is an objective examination of the financial and operational performance of an organization, program or function with respect to the three Es: (1) Economy (procuring resources at least cost); (2) Efficiency (maximizing output for given inputs); and (3) Effectiveness (achieving the intended outcomes and objectives).'
  },
  {
    id: 'AUD_CH15_06',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Which of the following principles forms part of the "Principles of Financial Propriety" in a Propriety Audit of public expenditure?',
    options: [
      'Expenditure should be as lavish as possible to stimulate economic growth.',
      'The expenditure should not be prima facie more than the occasion demands, and public money should not be utilized for the benefit of a particular person or community unless sanctioned by a court or recognized policy.',
      'Allowances granted to public officers should be designed as a source of personal profit.',
      'Government funds can be diverted to private charities without statutory appropriation.'
    ],
    correctOptionIndex: 1,
    explanation: 'The fundamental principles of financial propriety include: (1) The expenditure should not be prima facie more than the occasion demands; (2) An authority should exercise the same vigilance as a person of ordinary prudence in spending own money; (3) Public money should not be utilized for the benefit of a particular person/community; (4) Allowances should not be a source of profit to the recipient.'
  },
  {
    id: 'AUD_CH15_07',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'What is the role of the Committee on Public Undertakings (COPU) and the Public Accounts Committee (PAC) in relation to C&AG Audit Reports?',
    options: [
      'They draft the Accounting Standards for government companies.',
      'They are Parliamentary Committees that examine the reports of the C&AG tabled in Parliament and summon department officials to hold the executive accountable for financial irregularities and waste.',
      'They perform the field audit of defense contracts.',
      'They appoint the independent directors to PSU boards.'
    ],
    correctOptionIndex: 1,
    explanation: 'The Public Accounts Committee (PAC) and Committee on Public Undertakings (COPU) are specialized Standing Committees of Parliament that scrutinize the audit reports of the C&AG after they are laid before Parliament, examining whether public funds were spent efficiently and in accordance with Parliament’s intentions.'
  },
  {
    id: 'AUD_CH15_08',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Under Section 143(7) of the Companies Act, 2013, what power does the C&AG possess in addition to a supplementary audit?',
    options: [
      'The C&AG may, by an order, cause a test audit to be conducted of the accounts of the company, and the provisions of section 19A of the CAG’s (DPC) Act, 1971 shall apply.',
      'The C&AG can remove the Managing Director of the Government company without board approval.',
      'The C&AG can confiscate the company’s factory assets.',
      'The C&AG can cancel the GST registration of the company.'
    ],
    correctOptionIndex: 0,
    explanation: 'Section 143(7) states: "Without prejudice to the provisions of this Chapter, in respect of any company covered in sub-section (5) or sub-section (7) of section 139, the Comptroller and Auditor-General of India may, in case the company has failed to get its accounts audited, or by an order, cause a test audit to be conducted of the accounts of such company."'
  },
  {
    id: 'AUD_CH15_09',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'What constitutes a "Comprehensive Audit" of a Public Sector Enterprise?',
    options: [
      'Auditing only the travel reimbursement vouchers of employees.',
      'Evaluating the total commercial operation of the enterprise including investment decisions, project formulation, capacity utilization, cost control, pricing policies, research and development, and social objectives.',
      'Auditing only compliance with municipal property taxes.',
      'Reviewing only the statutory secretarial records under the Companies Act.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Comprehensive Audit of a PSU goes beyond traditional voucher checking to evaluate the overall efficiency of the enterprise: examining investment appraisal, project implementation timelines, cost overruns, idle capacity, maintenance standards, pricing policy, and return on capital employed.'
  },
  {
    id: 'AUD_CH15_10',
    subjectId: 'Audit',
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    questionText: 'Under the Comptroller and Auditor General’s (Duties, Powers and Conditions of Service) Act, 1971, what is the C&AG’s authority regarding access to records and information of audited government entities?',
    options: [
      'The C&AG can only inspect documents that have been published in national gazettes.',
      'The C&AG has full authority to inspect any office of accounts, require any books, papers and other documents to be sent to him, and put questions to officers in charge.',
      'The C&AG must obtain a search warrant from a Metropolitan Magistrate before entering government offices.',
      'Access to records is allowed only if the audited entity has made a profit in the prior year.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 18 of the CAG’s (DPC) Act, 1971 grants the C&AG the authority to: (a) inspect any office of accounts under the control of the Union or a State; (b) require that any books, papers and other documents which have custody of accounts be sent to him; and (c) put such questions or make such observations as he may consider necessary.'
  }
];
