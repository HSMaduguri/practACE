/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneralQuestion } from '../../types';

export const PART1_STANDARDS_MCQS: GeneralQuestion[] = [
  // ==========================================
  // CHAPTER 1: QUALITY CONTROL (SQC 1 & SA 220)
  // Target: 10 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH1_01',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Under SQC 1, what is the mandatory retention period for engagement documentation (audit working papers) from the date of the auditor’s report (or group auditor’s report, whichever is later)?',
    options: [
      '5 years',
      '7 years',
      '8 years',
      '10 years'
    ],
    correctOptionIndex: 1,
    explanation: 'SQC 1 paragraph 83 and SA 230 explicitly mandate that the retention period for audit engagements ordinarily is no shorter than 7 years from the date of the auditor’s report (or group auditor’s report, whichever is later). Note that while Section 128(5) of the Companies Act, 2013 prescribes 8 years for the company’s books of account, audit working papers must be retained by the audit firm for at least 7 years under SQC 1.'
  },
  {
    id: 'AUD_CH1_02',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Under SQC 1 and SA 230, what is the standard time limit for the assembly of the final audit file after the date of the auditor’s report?',
    options: [
      'Not more than 30 days after the date of the auditor’s report',
      'Not more than 45 days after the date of the auditor’s report',
      'Not more than 60 days after the date of the auditor’s report',
      'Not more than 90 days after the date of the auditor’s report'
    ],
    correctOptionIndex: 2,
    explanation: 'SQC 1 paragraph 75 and SA 230 state that an appropriate time limit within which to complete the assembly of the final audit file is ordinarily not more than 60 days after the date of the auditor’s report. The assembly process is administrative and does not involve the performance of new audit procedures or the drawing of new conclusions.'
  },
  {
    id: 'AUD_CH1_03',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Which of the following is an eligibility condition for an Engagement Quality Control Reviewer (EQCR) under SQC 1 and SA 220 (Revised)?',
    options: [
      'The EQCR must be selected by the Engagement Partner from the core engagement team.',
      'The EQCR can participate in the execution of the engagement to expedite the completion.',
      'The EQCR must maintain objectivity and cannot be selected by the engagement partner nor participate in the performance of the engagement.',
      'The EQCR must always be an external independent practitioner from outside the firm.'
    ],
    correctOptionIndex: 2,
    explanation: 'Under SQC 1 and SA 220, to maintain objectivity, the Engagement Quality Control Reviewer must not be selected by the engagement partner, cannot participate in the execution of the engagement during the period of review, cannot make decisions for the engagement team, and must not be subject to other considerations that would compromise objectivity.'
  },
  {
    id: 'AUD_CH1_04',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Under the ICAI Code of Ethics and SQC 1, in the audit of listed entities, what is the mandatory rotation requirement for the Key Audit Partner (Engagement Partner) regarding the maximum engagement period and the subsequent cooling-off period?',
    options: [
      'Engagement period of 5 years; Cooling-off period of 2 years',
      'Engagement period of 7 years; Cooling-off period of 2 years',
      'Engagement period of 7 years; Cooling-off period of 5 years',
      'Engagement period of 10 years; Cooling-off period of 3 years'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the ICAI Code of Ethics (aligned with IESBA provisions on Long Association of Personnel with an Audit Client), the Engagement Partner shall not act in that capacity for more than 7 cumulative years, followed by a mandatory cooling-off period of ordinarily 2 years (or 3/5 years depending on jurisdictional revisions for specific listed entities, with the foundational ICAI baseline being 7 years on and 2-3 years cooling).'
  },
  {
    id: 'AUD_CH1_05',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Under SQC 1, what is the requirement regarding monitoring of the firm’s quality control policies and procedures?',
    options: [
      'Inspection of all completed client engagements must be performed annually.',
      'Inspection of at least one completed engagement for each engagement partner is conducted on a cyclical basis.',
      'Monitoring is required only when an external regulatory inspection (such as NFRA or QRB) is notified.',
      'Monitoring is solely the responsibility of the Engagement Quality Control Reviewer on active engagements.'
    ],
    correctOptionIndex: 1,
    explanation: 'SQC 1 paragraph 86 requires that the firm’s inspection of a selection of completed engagements is ordinarily performed on a cyclical basis. Engagements selected include at least one engagement for each engagement partner over an inspection cycle determined by the firm.'
  },
  {
    id: 'AUD_CH1_06',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'If a difference of opinion arises between the Engagement Partner and the Engagement Quality Control Reviewer, what does SQC 1 specify regarding the release of the auditor’s report?',
    options: [
      'The Engagement Partner may issue the report immediately with an Emphasis of Matter disclosure.',
      'The report shall not be issued until the difference of opinion is resolved following the firm’s established procedures.',
      'The matter is automatically escalated to the Institute of Chartered Accountants of India within 7 days.',
      'The majority view of the engagement team prevails and the report is dated on that day.'
    ],
    correctOptionIndex: 1,
    explanation: 'SQC 1 paragraph 68 explicitly mandates that the report shall not be released until any difference of opinion within the engagement team, with those consulted, or between the engagement partner and the engagement quality control reviewer, is resolved in accordance with the firm’s established policies and procedures.'
  },
  {
    id: 'AUD_CH1_07',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Which element is NOT one of the six core elements of a firm’s system of quality control as enumerated in SQC 1?',
    options: [
      'Leadership responsibilities for quality within the firm',
      'Ethical requirements and Independence',
      'Mandatory corporate profitability and partner remuneration distribution',
      'Human resources, Engagement performance, and Monitoring'
    ],
    correctOptionIndex: 2,
    explanation: 'SQC 1 paragraph 6 outlines the six core elements: (1) Leadership responsibilities for quality within the firm, (2) Ethical requirements, (3) Acceptance and continuance of client relationships and specific engagements, (4) Human resources, (5) Engagement performance, and (6) Monitoring. Remuneration distribution is an internal commercial matter and not an SQC 1 element.'
  },
  {
    id: 'AUD_CH1_08',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Under SA 220 (Revised), who bears ultimate responsibility for the overall quality on each audit engagement to which that partner is assigned?',
    options: [
      'The Managing Partner of the audit firm',
      'The Engagement Quality Control Reviewer (EQCR)',
      'The Engagement Partner',
      'The Firm’s Chief Risk Officer'
    ],
    correctOptionIndex: 2,
    explanation: 'SA 220 (Revised) paragraph 12 explicitly establishes that the Engagement Partner shall take overall responsibility for the overall quality on each audit engagement to which that partner is assigned, reinforcing the principle of personal accountability.'
  },
  {
    id: 'AUD_CH1_09',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Under SQC 1, at least how often must the firm obtain written confirmation of compliance with its policies and procedures on independence from all firm personnel required to be independent?',
    options: [
      'Semi-annually (every 6 months)',
      'At least annually',
      'Prior to each quarterly statutory audit board meeting',
      'Once every three years during peer review'
    ],
    correctOptionIndex: 1,
    explanation: 'SQC 1 paragraph 27 states that at least annually, the firm should obtain written confirmation of compliance with its policies and procedures on independence from all firm personnel required to be independent by relevant ethical requirements.'
  },
  {
    id: 'AUD_CH1_10',
    subjectId: 'Audit',
    chapterName: 'Quality Control',
    questionText: 'Following the assembly of the final audit file, an auditor discovers a need to make changes to existing audit documentation or add new audit documentation. Under SA 230, which condition must be met?',
    options: [
      'The auditor cannot add or modify any documentation under any circumstances post-assembly.',
      'The auditor must document the specific reasons, when and by whom they were made and reviewed, regardless of whether changes are administrative or new.',
      'The auditor may replace original workpapers without noting changes if the conclusions remain unchanged.',
      'The auditor must obtain written prior consent from the Registrar of Companies (ROC).'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 230 paragraph 16 requires that if the auditor finds it necessary to modify existing audit documentation or add new audit documentation after the assembly of the final audit file has been completed, the auditor shall document the specific reasons for making them, and when and by whom they were made and reviewed.'
  },

  // ==========================================================================================
  // CHAPTER 2: GENERAL AUDITING PRINCIPLES AND AUDITORS RESPONSIBILITIES (SA 200, 210, 240, 250, 299, 402)
  // Target: 8 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH2_01',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'According to SA 200, "Audit Risk" is a function of which of the following components?',
    options: [
      'Business Risk and Operational Risk',
      'Risk of Material Misstatement (Inherent Risk × Control Risk) and Detection Risk',
      'Financial Risk, Liquidity Risk, and Reputational Risk',
      'Inherent Risk and Sampling Risk only'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 200, Audit Risk = Risk of Material Misstatement (RMM) × Detection Risk (DR). RMM exists at the entity level and consists of two components: Inherent Risk (IR) and Control Risk (CR). Thus, Audit Risk = IR × CR × DR.'
  },
  {
    id: 'AUD_CH2_02',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'Under SA 210, what are the two core preconditions for an audit that the auditor must establish before accepting an engagement?',
    options: [
      'That the client has achieved a credit rating above investment grade and paid an advance fee retainer.',
      'Determining whether the financial reporting framework is acceptable and obtaining agreement of management on its fundamental responsibilities.',
      'Obtaining no-objection certificates from all previous lenders and prospective bankers.',
      'Confirming that the entity’s internal audit function reports directly to the Comptroller & Auditor General.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 210 paragraph 6 specifies that the auditor shall determine whether the financial reporting framework to be applied in the preparation of the financial statements is acceptable; and obtain the agreement of management that it acknowledges and understands its responsibility (preconditions for an audit).'
  },
  {
    id: 'AUD_CH2_03',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'Under SA 210, if management requests a change in the terms of the audit engagement to a lower level of assurance (e.g., from an audit to a review) without reasonable justification, what must the auditor do if unable to agree?',
    options: [
      'Accept the change but charge full statutory audit fees.',
      'Withdraw from the engagement where possible under applicable law and determine whether there is any obligation to report to TCWG or regulators.',
      'Issue an unmodified compilation report under SRS 4410.',
      'Appoint a joint auditor to share the liability under SA 299.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 210 paragraph 17 requires that if the auditor is unable to agree to a change of terms of the audit engagement and is not permitted by management to continue the original audit engagement, the auditor shall withdraw from the audit engagement where possible under applicable law and determine whether there is any obligation to report the circumstances to TCWG, owners or regulatory authorities.'
  },
  {
    id: 'AUD_CH2_04',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'Under SA 240, what are the three mandatory audit procedures to address the risk of management override of controls across all audit engagements?',
    options: [
      'Physical verification of all cash, sending 100% bank confirmations, and attending board meetings.',
      'Testing journal entries and adjustments, reviewing accounting estimates for biases, and evaluating business rationale for significant unusual transactions.',
      'Engaging forensic handwriting experts, reviewing telephone call records, and verifying employee background checks.',
      'Performing 100% cut-off testing, reviewing income tax returns, and testing depreciation recalculations.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 240 paragraph 32 explicitly prescribes three mandatory procedures for management override of controls: (1) Test the appropriateness of journal entries recorded in the general ledger and other adjustments; (2) Review accounting estimates for biases and evaluate whether circumstances representing a risk of material misstatement due to fraud exist; and (3) For significant transactions outside the normal course of business, evaluate whether the business rationale suggests fraud.'
  },
  {
    id: 'AUD_CH2_05',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'Under SA 250, what is the auditor’s responsibility regarding laws and regulations that do not have a direct effect on the determination of amounts in financial statements, but may fundamental to operating aspects (e.g., environmental laws, operating licenses)?',
    options: [
      'The auditor has no responsibility whatsoever for non-financial laws.',
      'The auditor’s responsibility is limited to undertaking specified audit procedures to help identify non-compliance (inquiring of management and inspecting correspondence with licensing authorities).',
      'The auditor must obtain 100% legal compliance audit certificates from senior advocates.',
      'The auditor must audit the environmental records with the same depth as revenue records.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 250 paragraph 15 states that for other laws and regulations that do not have a direct effect on financial statements, the auditor’s responsibility is limited to undertaking specified audit procedures to help identify non-compliance that may have a material effect on the financial statements, namely: (a) Inquiring of management; and (b) Inspecting correspondence with relevant licensing or regulatory authorities.'
  },
  {
    id: 'AUD_CH2_06',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'Under SA 299 (Revised), in which of the following areas are Joint Auditors JOINTLY AND SEVERALLY liable?',
    options: [
      'In respect of audit work specifically divided among them and recorded in the allocation work allocation document.',
      'In respect of matters brought to the notice of all joint auditors by one of them and on which there has been an agreement.',
      'In respect of the internal control testing performed solely by the junior joint auditor on their assigned branch.',
      'In respect of individual audit working papers archived in the sole custody of a specific joint audit firm.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 299 (Revised) paragraph 11 provides that all joint auditors shall be jointly and severally responsible for: (a) audit work which is not divided; (b) decisions taken by all joint auditors under common discussion regarding nature, timing or extent of audit procedures; (c) matters brought to the notice of all joint auditors by any one of them and on which there is agreement; (d) verifying that financial statements comply with statutory requirements; and (e) presentation and disclosure requirements.'
  },
  {
    id: 'AUD_CH2_07',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'Under SA 402, what is the difference between a Type 1 report and a Type 2 report issued by a service auditor?',
    options: [
      'Type 1 covers internal audit, whereas Type 2 covers external statutory audit.',
      'Type 1 reports on the description and design of controls at a specific date; Type 2 reports on description, design AND operating effectiveness of controls throughout a specified period.',
      'Type 1 reports are public documents, whereas Type 2 reports are confidential to tax authorities.',
      'Type 1 covers cloud security, while Type 2 covers physical security of data centers.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 402, a Type 1 report comprises a description of the service organization’s system and the suitability of design of controls at a specified date. A Type 2 report includes the description, suitability of design, PLUS the operating effectiveness of controls throughout a specified period (minimum 6 months).'
  },
  {
    id: 'AUD_CH2_08',
    subjectId: 'Audit',
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    questionText: 'If a user auditor uses a service auditor’s report (Type 1 or Type 2) to obtain audit evidence, how should the service auditor be referenced in an unmodified user auditor’s report?',
    options: [
      'The user auditor must name the service auditor in the Basis for Opinion section.',
      'The user auditor shall NOT refer to the work of a service auditor in an audit report containing an unmodified opinion, unless required by law.',
      'The user auditor must divide audit responsibility with the service auditor in an Other Matter paragraph.',
      'The user auditor must attach a copy of the Type 2 SOC report as an annexure to the audit report.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 402 paragraph 21 states that the user auditor shall not refer to the work of a service auditor in the user auditor’s report containing an unmodified opinion unless required by law or regulation. If such reference is required by law, the report shall indicate that the reference does not diminish the user auditor’s sole responsibility for the audit opinion.'
  },

  // ==========================================================================================
  // CHAPTER 3: AUDIT PLANNING, STRATEGY AND EXECUTION (SA 300, SA 315)
  // Target: 10 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH3_01',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'What is the relationship between the Overall Audit Strategy and the Detailed Audit Plan under SA 300?',
    options: [
      'The audit plan is prepared first, and the overall strategy is formulated after audit execution.',
      'The overall audit strategy sets the scope, timing, and direction of the audit, and guides the development of the more detailed audit plan.',
      'The audit strategy and audit plan are identical documents with no procedural distinction.',
      'The audit plan is prepared by the client management and reviewed by the auditor.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 300 paragraph 7-8 establishes that the overall audit strategy sets the scope, timing and direction of the audit, and guides the development of the audit plan. The audit plan is more detailed than the strategy and includes the nature, timing and extent of audit procedures to be performed.'
  },
  {
    id: 'AUD_CH3_02',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Under SA 300, which of the following is an auditor required to perform as part of preliminary engagement activities at the beginning of the current audit engagement?',
    options: [
      'Issuing draft qualified audit opinions to lenders.',
      'Performing procedures regarding the continuance of the client relationship, evaluating compliance with ethical requirements (including independence), and establishing an understanding of the terms of engagement.',
      'Finalizing the sampling size for physical inventory verification.',
      'Conducting an exit conference with Those Charged with Governance.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 300 paragraph 6 mandates preliminary engagement activities: (a) performing procedures required by SA 220 regarding the continuance of the client relationship; (b) evaluating compliance with relevant ethical requirements, including independence; and (c) establishing an understanding of the terms of the engagement as required by SA 210.'
  },
  {
    id: 'AUD_CH3_03',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Under SA 315, what are the five interrelated components of Internal Control that the auditor must understand?',
    options: [
      'Assets, Liabilities, Income, Expenses, and Equity',
      'Control Environment, Entity’s Risk Assessment Process, Information System, Control Activities, and Monitoring of Controls',
      'Statutory Audit, Internal Audit, Cost Audit, Tax Audit, and Secretarial Audit',
      'Board of Directors, Audit Committee, Managing Director, CFO, and Company Secretary'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 315 Appendix 1 defines the five components of internal control: (1) Control environment, (2) The entity’s risk assessment process, (3) The information system, including the related business processes, relevant to financial reporting, and communication, (4) Control activities relevant to the audit, and (5) Monitoring of controls.'
  },
  {
    id: 'AUD_CH3_04',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Under SA 315, what is the primary purpose of performing "Walkthrough Tests"?',
    options: [
      'To verify the physical speed of warehouse employees.',
      'To confirm the auditor’s understanding of the flow of transactions and to verify the design and implementation of internal controls.',
      'To mathematically calculate the depreciation charge on plant and machinery.',
      'To provide substantive audit evidence for 100% of journal entries.'
    ],
    correctOptionIndex: 1,
    explanation: 'Walkthrough tests involve tracing a few transactions through the entire financial reporting system from origination to reporting in financial statements. Their primary purpose is to confirm the auditor’s understanding of the system, determine whether controls have been implemented as designed, and identify points where misstatements could occur.'
  },
  {
    id: 'AUD_CH3_05',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Which of the following matters is treated as a "Significant Risk" under SA 315, requiring mandatory special audit consideration?',
    options: [
      'Routine, non-complex transactions processed through automated billing systems with low transaction value.',
      'Significant transactions with related parties outside the normal course of business.',
      'Standard recurring monthly payroll processing.',
      'Prepaid insurance amortization calculated on a straight-line basis.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 315 paragraph 28, significant risks include: risk of fraud; significant economic, accounting or other developments; complexity of transactions; significant transactions with related parties; degree of subjectivity in measurement of financial information; and significant transactions outside the normal course of business.'
  },
  {
    id: 'AUD_CH3_06',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Under SA 300, is the audit plan fixed and rigid, or can it be updated and changed during the course of the audit?',
    options: [
      'It is strictly fixed once approved by the engagement partner and cannot be modified under any circumstances.',
      'It shall be updated and changed as necessary during the course of the audit as unexpected events or changed conditions occur.',
      'It can only be modified if the client’s board of directors passes a special resolution.',
      'It can only be modified with prior written approval from the Institute of Chartered Accountants of India.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 300 paragraph 10 states that the auditor shall update and change the overall audit strategy and the audit plan as necessary during the course of the audit as a result of unexpected events, changes in conditions, or audit evidence obtained from the results of audit procedures.'
  },
  {
    id: 'AUD_CH3_07',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Which assertion about classes of transactions and events for the period under audit relates to whether amounts and other data have been recorded appropriately under SA 315?',
    options: [
      'Completeness',
      'Accuracy',
      'Cut-off',
      'Classification'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 315, assertions for classes of transactions include: Occurrence (transactions have occurred and pertain to entity), Completeness (all transactions that should be recorded are recorded), Accuracy (amounts and other data recorded appropriately), Cut-off (recorded in correct period), and Classification (recorded in proper accounts).'
  },
  {
    id: 'AUD_CH3_08',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'In auditing an entity with multiple business locations, what factor does the auditor evaluate in determining the extent of audit procedures at branch locations under SA 300?',
    options: [
      'The geographical distance and scenic convenience for the audit team.',
      'The materiality of the location, risk of material misstatement at the location, and effectiveness of central internal controls.',
      'The number of local holidays observed by the municipal council.',
      'The presence of competing audit firms in that district.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 300 and SA 600, location selection is determined by risk assessment: materiality of the component, assessed risk of material misstatement, business complexity, decentralization of operations, and effectiveness of entity-wide internal controls.'
  },
  {
    id: 'AUD_CH3_09',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Under SA 315, the auditor’s assessment of the "Control Environment" includes evaluating which of the following elements?',
    options: [
      'Communication and enforcement of integrity and ethical values, commitment to competence, and participation by Those Charged with Governance.',
      'The price-to-earnings ratio of competing entities in the capital market.',
      'The statutory tax depreciation schedule under Section 32 of the Income Tax Act.',
      'The maximum loan tenure permitted by commercial banks.'
    ],
    correctOptionIndex: 0,
    explanation: 'Under SA 315, the control environment encompasses: (a) Communication and enforcement of integrity and ethical values; (b) Commitment to competence; (c) Participation by TCWG; (d) Management’s philosophy and operating style; (e) Organizational structure; (f) Assignment of authority and responsibility; and (g) Human resource policies.'
  },
  {
    id: 'AUD_CH3_10',
    subjectId: 'Audit',
    chapterName: 'Audit Planning, Strategy and Execution',
    questionText: 'Under SA 300, what documentation is required regarding the audit strategy and audit plan?',
    options: [
      'Only oral tape recordings of the planning discussion.',
      'The overall audit strategy, the audit plan, and any significant changes made during the audit engagement to the strategy or plan, and the reasons for such changes.',
      'A signed memorandum from the company’s CFO certifying the strategy.',
      'No formal documentation is required if the audit team members have worked on the client for more than 3 years.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 300 paragraph 12 requires the auditor to document: (a) The overall audit strategy; (b) The audit plan; and (c) Any significant changes made during the audit engagement to the overall audit strategy or the audit plan, and the reasons for such changes.'
  },

  // =========================================================================================================
  // CHAPTER 4: MATERIALITY, RISK ASSESSMENT AND INTERNAL CONTROL (SA 320, SA 330, SA 450, IFCoFR)
  // Target: 9 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH4_01',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'What is the specific objective of establishing "Performance Materiality" under SA 320?',
    options: [
      'To evaluate the commercial performance and executive bonus of the Chief Executive Officer.',
      'To reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds materiality for the financial statements as a whole.',
      'To define the minimum billing rate per hour for senior audit engagement managers.',
      'To identify the statutory threshold for reporting fraud to the Central Government under Section 143(12).'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 320 paragraph 9 defines Performance Materiality as the amount or amounts set by the auditor at less than materiality for the financial statements as a whole to reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds materiality for the financial statements as a whole.'
  },
  {
    id: 'AUD_CH4_02',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under SA 320, if during the audit the auditor discovers information that would have caused them to determine a different initial materiality amount, what must the auditor do?',
    options: [
      'Ignore the new information until the subsequent year’s audit.',
      'Revise materiality for the financial statements as a whole (and performance materiality) and re-evaluate the nature, timing, and extent of further audit procedures.',
      'Immediately issue a disclaimer of opinion.',
      'Inform the Securities and Exchange Board of India (SEBI) within 24 hours.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 320 paragraph 12-13 states that the auditor shall revise materiality for the financial statements as a whole (and, if applicable, materiality level for particular classes of transactions) in the event of becoming aware of information during the audit that would have caused the auditor to have determined a different amount initially.'
  },
  {
    id: 'AUD_CH4_03',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under SA 330, if an auditor plans to rely on internal controls that have NOT changed since they were last tested in a prior audit, what is the MAXIMUM time interval permitted before retesting their operating effectiveness?',
    options: [
      'Every year without exception.',
      'At least once in every two audits.',
      'At least once in every three audits, testing some controls at each audit.',
      'Once in every five audits.'
    ],
    correctOptionIndex: 2,
    explanation: 'SA 330 paragraph 14(b) establishes that if the auditor plans to rely on controls over which there have been no changes since they were last tested, the auditor shall test the operating effectiveness of such controls at least once in every three audits, and shall test some controls at each audit to avoid testing all controls in a single audit period.'
  },
  {
    id: 'AUD_CH4_04',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under SA 330, if the auditor determines that an assessed risk of material misstatement at the assertion level is a SIGNIFICANT RISK, and plans to rely on controls over that significant risk, when must those controls be tested?',
    options: [
      'The controls can be relied upon based on prior year testing if tested within the last 3 years.',
      'The auditor shall test the operating effectiveness of those controls in the CURRENT PERIOD.',
      'The auditor does not need to test controls if substantive testing is performed.',
      'The controls can be certified by the entity’s internal auditor without statutory testing.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 330 paragraph 15 explicitly mandates: "When the auditor plans to rely on controls over a risk the auditor has determined to be a significant risk, the auditor shall test the operating effectiveness of those controls in the current period." Reliance on prior period testing is strictly prohibited for significant risks.'
  },
  {
    id: 'AUD_CH4_05',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under SA 450, what is the definition and treatment of "Clearly Trivial" misstatements?',
    options: [
      'Misstatements that are less than 50% of overall materiality, which must be compiled in an annexure.',
      'Matters that are clearly inconsequential, whether taken individually or in aggregate and whether judged by any criteria of size, nature or circumstances; the auditor does not need to accumulate them.',
      'Misstatements related to petty cash vouchers that need to be reported to the Board under Section 134.',
      'Any misstatement below ₹10 Lakhs in a listed company.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 450 paragraph A2 clarifies that "clearly trivial" is not another word for "not material". Matters that are clearly trivial will be of a wholly different (lower) order of magnitude than materiality, and will be matters that are clearly inconsequential, whether taken individually or in the aggregate. The auditor may designate an amount below which misstatements are clearly trivial and do not need to be accumulated.'
  },
  {
    id: 'AUD_CH4_06',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under Section 143(3)(i) of the Companies Act, 2013 and the MCA Notification dated 13th June 2017, which Private Limited Companies are EXEMPT from reporting on Internal Financial Controls over Financial Reporting (IFCoFR)?',
    options: [
      'All private companies regardless of turnover or borrowings.',
      'A private company which is a One Person Company (OPC) or Small Company, OR has turnover less than ₹50 Crores as per latest audited FS AND aggregate borrowings from banks/FIs/bodies corporate less than ₹25 Crores at any point during the FY.',
      'A private company having turnover less than ₹100 Crores and borrowings less than ₹50 Crores.',
      'Only private companies registered as non-profit Section 8 entities.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under MCA Notification dated 13th June 2017, Section 143(3)(i) reporting on IFCoFR does not apply to a private company which: (a) is a One Person Company or Small Company; OR (b) has turnover less than ₹50 Crores as per latest audited financial statements AND aggregate borrowings from banks or financial institutions or anybody corporate at any point of time during the financial year less than ₹25 Crores.'
  },
  {
    id: 'AUD_CH4_07',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'In evaluating Internal Financial Controls over Financial Reporting, what is the distinction between a "Deficiency in Design" and a "Deficiency in Operation"?',
    options: [
      'Design deficiency is caused by computer software; operational deficiency is caused by manual clerks.',
      'A design deficiency exists when a control necessary to meet the control objective is missing or not properly designed; an operating deficiency exists when a properly designed control does not operate as designed or the person performing it lacks authority/competence.',
      'Design deficiency affects balance sheet items; operational deficiency affects profit and loss items.',
      'Design deficiency occurs in the second half of the year; operational deficiency occurs in the first half.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the ICAI Guidance Note on Audit of Internal Financial Controls Over Financial Reporting, a deficiency in design exists when a control necessary to meet the control objective is missing or an existing control is not properly designed. A deficiency in operation exists when a properly designed control does not operate as designed, or when the person performing the control does not possess the necessary authority or competence.'
  },
  {
    id: 'AUD_CH4_08',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under SA 330, irrespectve of the assessed risks of material misstatement, what is the auditor’s mandatory responsibility regarding substantive procedures?',
    options: [
      'The auditor can dispense with substantive procedures entirely if IT controls have a 100% pass rate.',
      'The auditor shall design and perform substantive procedures for each material class of transactions, account balance, and disclosure.',
      'Substantive procedures are mandatory only for related party balances.',
      'Substantive procedures are mandatory only if internal control testing reveals a material weakness.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 330 paragraph 18 establishes a fundamental rule: "Irrespective of the assessed risks of material misstatement, the auditor shall design and perform substantive procedures for each material class of transactions, account balance, and disclosure." This reflects the inherent limitations of internal controls.'
  },
  {
    id: 'AUD_CH4_09',
    subjectId: 'Audit',
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    questionText: 'Under SA 450, if management refuses to correct some or all of the misstatements communicated by the auditor, what steps must the auditor take before issuing the report?',
    options: [
      'File an FIR with the economic offences wing.',
      'Understand management’s reasons for not making corrections, re-assess materiality, determine whether uncorrected misstatements are material (individually or in aggregate), and communicate with TCWG requesting correction.',
      'Automatically issue an adverse opinion without communicating with TCWG.',
      'Adjust the financial statements unilaterally in the auditor’s office.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 450 paragraphs 7-12 require that if management refuses to correct misstatements, the auditor shall obtain an understanding of management’s reasons, re-assess materiality under SA 320, communicate uncorrected misstatements and their effect to TCWG requesting correction, and determine the impact on the auditor’s opinion under SA 705.'
  },

  // ====================================================================================================
  // CHAPTER 5: AUDIT EVIDENCE (SA 500, SA 501, SA 505, SA 510, SA 520, SA 530, SA 540, SA 550)
  // Target: 8 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH5_01',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 500, which of the following generalizations regarding the reliability of audit evidence is mathematically and procedurally TRUE?',
    options: [
      'Oral representations from management are more reliable than bank confirmation letters.',
      'Audit evidence obtained directly by the auditor is more reliable than audit evidence obtained indirectly or by inference; and documentary evidence is more reliable than oral evidence.',
      'Photocopied documents obtained internally have higher reliability than original external contracts.',
      'Evidence obtained from an entity with ineffective internal controls is more reliable than from one with effective controls.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 500 paragraph A31 outlines the hierarchy of reliability: (1) Evidence obtained from independent external sources is more reliable; (2) Evidence generated internally is more reliable when related controls are effective; (3) Evidence obtained directly by the auditor is more reliable than that obtained indirectly; (4) Documentary evidence is more reliable than oral evidence; (5) Original documents are more reliable than photocopies/faxes.'
  },
  {
    id: 'AUD_CH5_02',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 505, which of the following conditions MUST ALL BE MET for an auditor to use NEGATIVE confirmation requests as the sole substantive audit procedure?',
    options: [
      'The accounts are in dispute and legal litigation is active.',
      'RMM is assessed as low and controls are operating; population consists of a large number of small, homogeneous balances; very low exception rate is expected; and the auditor is not aware of circumstances that would cause recipients to disregard requests.',
      'The client management has signed an indemnity bond covering 100% of bad debts.',
      'The confirmations are sent via registered speed post to public sector undertakings.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 505 paragraph 15 states that negative confirmation requests provide less persuasive audit evidence than positive confirmations. The auditor shall not use negative confirmation requests as the sole substantive procedure unless ALL FOUR conditions are present: (a) RMM is low and operating effectiveness of controls confirmed; (b) Large number of small, homogeneous balances; (c) Very low exception rate expected; and (d) No reason to believe recipients would disregard requests.'
  },
  {
    id: 'AUD_CH5_03',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 505, if management refuses to allow the auditor to send external confirmation requests, what must the auditor do?',
    options: [
      'Immediately agree to management’s request and accept management representation letters.',
      'Inquire into management’s reasons, evaluate implications on RMM and fraud risk, perform alternative audit procedures; and if refusal is unreasonable or evidence cannot be obtained, determine impact on audit opinion under SA 705.',
      'Lodge a formal grievance with the Ministry of Corporate Affairs within 48 hours.',
      'Subcontract the confirmation verification to the internal audit team.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 505 paragraph 8-9 specifies that if management refuses to allow confirmation, the auditor shall: (a) Inquire as to management’s reasons and seek audit evidence as to their validity and reasonableness; (b) Evaluate implications on assessment of RMM including fraud risk; (c) Perform alternative audit procedures. If refusal is unreasonable or the auditor cannot obtain evidence through alternative procedures, the auditor shall communicate with TCWG and determine the effect on the opinion under SA 705.'
  },
  {
    id: 'AUD_CH5_04',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'In an initial audit engagement under SA 510, if the prior period financial statements were audited by a predecessor auditor and contained a modified opinion, what must the current incoming auditor do?',
    options: [
      'The current auditor must re-issue the prior year audit report under joint signature.',
      'The current auditor shall evaluate the effect of the matter giving rise to the modification in assessing the RMM in the current period’s financial statements in accordance with SA 315.',
      'The current auditor must automatically qualify the current year’s audit report.',
      'The current auditor must sue the predecessor auditor under the Second Schedule.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 510 paragraph 10 states: "If the prior period financial statements were audited by a predecessor auditor and there was a modification to the opinion, the auditor shall evaluate the effect of the matter giving rise to the modification in assessing the risks of material misstatement in the current period’s financial statements in accordance with SA 315."'
  },
  {
    id: 'AUD_CH5_05',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 520, when designing and performing Substantive Analytical Procedures, what is the auditor required to do regarding the "Acceptable Difference"?',
    options: [
      'Set the acceptable difference at 10% of total assets.',
      'Determine the amount of any difference of recorded amounts from expected values that can be accepted without further investigation, which shall not exceed performance materiality.',
      'Accept any variance provided management provides an oral confirmation.',
      'Ignore all variances that are lower than the statutory tax threshold.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 520 paragraph 5(d) mandates that the auditor shall determine the amount of any difference of recorded amounts from expected values that can be accepted without further investigation as required by paragraph 7 (which must be influenced by materiality and consistency with the desired level of assurance).'
  },
  {
    id: 'AUD_CH5_06',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 530, what is "Sampling Risk" and how does Type II error (Risk of Incorrect Acceptance) affect the audit?',
    options: [
      'It affects audit efficiency because the auditor performs more work than necessary.',
      'It affects audit effectiveness and is more likely to lead to an erroneous audit opinion because the auditor concludes that a material misstatement does not exist when in fact it does.',
      'It leads to an automatic penalty from the National Financial Reporting Authority (NFRA).',
      'It is an error arising strictly from the use of non-statistical random number tables.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 530 paragraph A11 defines Sampling Risk. In substantive testing, the risk of incorrect acceptance (Type II error) is the risk that the sample supports the conclusion that recorded amounts are not materially misstated when in fact they are. This affects audit effectiveness and is more serious because it leads to an inappropriate audit opinion.'
  },
  {
    id: 'AUD_CH5_07',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 540 (Revised), what is a "Retrospective Review" of accounting estimates and why is it conducted?',
    options: [
      'Re-auditing the financial statements of the last 10 years to revise past income tax payments.',
      'Reviewing the outcome of accounting estimates included in prior period financial statements to obtain information regarding the effectiveness of management’s prior period estimation process and audit evidence regarding possible management bias.',
      'Hiring a forensic investigator to interview retired management personnel.',
      'Recalculating the historical cost of land acquired at the inception of the company.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 540 (Revised) paragraph 14 requires the auditor to review the outcome of previous accounting estimates or their subsequent re-estimation to assist in identifying and assessing the RMM in the current period, evaluate the effectiveness of management’s estimation process, and detect possible management bias.'
  },
  {
    id: 'AUD_CH5_08',
    subjectId: 'Audit',
    chapterName: 'Audit Evidence',
    questionText: 'Under SA 550, if the auditor identifies related party transactions that are SIGNIFICANT AND OUTSIDE THE NORMAL COURSE OF BUSINESS, which procedure must the auditor perform?',
    options: [
      'Report the company to the Central Vigilance Commission immediately.',
      'Inspect underlying contracts/agreements to evaluate business rationale, determine if terms are consistent with management explanations, and verify whether transactions have been appropriately authorized and disclosed under Ind AS 24 / AS 18.',
      'Refuse to sign the audit report until the transaction is cancelled by the board.',
      'Assume fraud has occurred and issue an adverse opinion automatically.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 550 paragraph 23 requires that for identified significant related party transactions outside the normal course of business, the auditor shall inspect underlying contracts/agreements to evaluate whether: (a) business rationale suggests fraud; (b) terms are consistent with management’s explanations; and (c) transactions have been appropriately accounted for and disclosed in accordance with the applicable financial reporting framework.'
  },

  // =========================================================================================
  // CHAPTER 6: COMPLETION AND REVIEW (SA 560, SA 570, SA 580)
  // Target: 9 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH6_01',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 560, what is the auditor’s active duty regarding Subsequent Events occurring between the date of the financial statements and the date of the auditor’s report?',
    options: [
      'The auditor has no duty to perform any procedures after the balance sheet date.',
      'The auditor shall perform audit procedures designed to obtain sufficient appropriate evidence that all events up to the date of the auditor’s report that require adjustment or disclosure have been identified.',
      'The auditor’s duty is limited only to reading newspaper reports about the entity.',
      'The auditor must obtain a court decree validating all asset values.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 560 paragraph 6 specifies that the auditor shall perform audit procedures designed to obtain sufficient appropriate audit evidence that all events occurring between the date of the financial statements and the date of the auditor’s report that require adjustment of, or disclosure in, the financial statements have been identified (Active Duty period).'
  },
  {
    id: 'AUD_CH6_02',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under Ind AS 10 / AS 4 and SA 560, which of the following post-balance sheet events is an ADJUSTING EVENT for a balance sheet dated 31st March 2024?',
    options: [
      'A major fire in the factory warehouse on 15th April 2024 destroying inventory worth ₹5 Crores.',
      'Bankruptcy of a major customer on 10th April 2024 who was experiencing severe financial distress prior to 31st March 2024.',
      'Decline in market value of equity investments occurring between 31st March and the date of approval of financial statements.',
      'Announcement of a plan to discontinue a major product line on 2nd May 2024.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Ind AS 10 and AS 4, adjusting events provide evidence of conditions that existed at the end of the reporting period. The insolvency of a customer that occurs after the reporting period usually confirms that the customer was in credit distress at the reporting period date, requiring adjustment to trade receivables. Fire and market price changes are non-adjusting events.'
  },
  {
    id: 'AUD_CH6_03',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 570 (Revised), what is the minimum assessment period that management must consider when assessing the entity’s ability to continue as a Going Concern?',
    options: [
      '6 months from the date of the balance sheet.',
      'At least 12 months from the date of the financial statements.',
      'At least 3 years from the date of the audit report.',
      'Until the expiry of the current Board of Directors’ tenure.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 570 (Revised) paragraph 13 states that the auditor shall evaluate management’s assessment of the entity’s ability to continue as a going concern. In evaluating management’s assessment, the auditor shall evaluate whether the assessment includes a period of at least 12 months from the date of the financial statements.'
  },
  {
    id: 'AUD_CH6_04',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 570 (Revised), if adequate disclosure about a material uncertainty related to going concern IS made in the financial statements, how should the auditor report?',
    options: [
      'Issue an Adverse Opinion under SA 705.',
      'Issue an unmodified opinion and include a separate section under the heading "Material Uncertainty Related to Going Concern".',
      'Issue a Disclaimer of Opinion under SA 705.',
      'Report the matter exclusively in the Key Audit Matters (KAM) section without any separate going concern heading.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 570 (Revised) paragraph 22 states that if adequate disclosure about the material uncertainty is made in the financial statements, the auditor shall express an unmodified opinion and the auditor’s report shall include a separate section under the heading "Material Uncertainty Related to Going Concern" (MURGC).'
  },
  {
    id: 'AUD_CH6_05',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 570 (Revised) and SA 701, can a matter giving rise to a "Material Uncertainty Related to Going Concern" be reported in the Key Audit Matters (KAM) section?',
    options: [
      'Yes, it must always be duplicated in the KAM section with full details.',
      'No, matters giving rise to a material uncertainty related to going concern are by definition not reported in the Key Audit Matters section; they are reported in the dedicated MURGC section.',
      'It can only be reported in KAM if the Audit Committee gives written authorization.',
      'It must be reported under the Emphasis of Matter paragraph instead of MURGC.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 701 paragraph 15 explicitly prohibits communicating a matter giving rise to a modified opinion under SA 705, or a material uncertainty related to going concern under SA 570, in the Key Audit Matters section. These have specific dedicated sections in the audit report.'
  },
  {
    id: 'AUD_CH6_06',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 580, what should be the DATE of Written Representations?',
    options: [
      'The date of the commencement of the statutory audit field work.',
      'The date of the balance sheet.',
      'As near as practicable to, but not after, the date of the auditor’s report on the financial statements.',
      'Within 30 days after the Annual General Meeting (AGM).'
    ],
    correctOptionIndex: 2,
    explanation: 'SA 580 paragraph 14 requires that the date of the written representations shall be as near as practicable to, but not after, the date of the auditor’s report on the financial statements. The representations shall be for all financial statements and period(s) referred to in the auditor’s report.'
  },
  {
    id: 'AUD_CH6_07',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 580, can Written Representations by management be used as a SUBSTITUTE for other audit evidence that the auditor expects to be reasonably available?',
    options: [
      'Yes, written representations are conclusive primary evidence on all legal matters.',
      'No, written representations provide necessary audit evidence, but they do not provide sufficient appropriate audit evidence on their own about any of the matters with which they deal, nor do they substitute other available evidence.',
      'Yes, but only for valuation of intangible assets.',
      'Yes, if the representations are given under the official seal of the Managing Director.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 580 paragraph 4 and A1 explicitly state that although written representations provide necessary audit evidence, they do not provide sufficient appropriate audit evidence on their own about any of the matters with which they deal. They cannot be a substitute for other audit procedures.'
  },
  {
    id: 'AUD_CH6_08',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'Under SA 520, what is the mandatory requirement regarding Analytical Procedures at the FINAL COMPLETION STAGE of the audit?',
    options: [
      'Analytical procedures are optional and can be skipped if time is short.',
      'The auditor shall design and perform analytical procedures near the end of the audit that assist the auditor when forming an overall conclusion as to whether the financial statements are consistent with the auditor’s understanding of the entity.',
      'Analytical procedures at completion stage are performed solely to recalculate statutory corporate tax.',
      'Analytical procedures must be performed by the client’s internal audit head.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 520 paragraph 6 states: "The auditor shall design and perform analytical procedures near the end of the audit that assist the auditor when forming an overall conclusion as to whether the financial statements are consistent with the auditor’s understanding of the entity." This is a mandatory standard procedure.'
  },
  {
    id: 'AUD_CH6_09',
    subjectId: 'Audit',
    chapterName: 'Completion and Review',
    questionText: 'What constitutes an "Unmodified Opinion with Dual Dating" under SA 560 when facts become known to the auditor after the date of the auditor’s report but before the financial statements are issued?',
    options: [
      'Dating the report with both Gregorian and Hindu calendar dates.',
      'Amending the audit report to include an additional date restricted to a subsequent amendment/event, thereby retaining the original date for all other matters.',
      'Signing the audit report twice in two different ink colors.',
      'Having two different audit partners sign the same report on two consecutive weeks.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SA 560 paragraph 12, when management amends the financial statements for a subsequent event and the auditor restricts procedures to that amendment, the auditor may dual date the report (e.g., "August 15, 2024, except as to Note Y, which is as of August 25, 2024"). This indicates that audit procedures on subsequent events were restricted solely to that specific amendment.'
  }
];
