/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneralQuestion } from '../../types';

export const PART2_REPORTING_ASSURANCE_MCQS: GeneralQuestion[] = [
  // =========================================================================================
  // CHAPTER 7: REPORTING (SA 700, SA 701, SA 705, SA 706, SA 720, CARO 2020, Sec 143)
  // Target: Additional MCQs for complete coverage
  // =========================================================================================
  {
    id: 'AUD_CH7_01',
    subjectId: 'Audit',
    chapterName: 'Reporting',
    questionText: 'Under CARO 2020 Clause (i)(c), what specific verification is the statutory auditor required to report regarding title deeds of immovable properties?',
    options: [
      'Whether the property was acquired from a registered real estate broker.',
      'Whether the title deeds of all the immovable properties (other than properties where the company is the lessee and the lease agreements are duly executed in favour of the lessee) disclosed in the financial statements are held in the name of the company.',
      'Whether the property has municipal clearance for commercial construction.',
      'Whether the property is insured against earthquakes and riots.'
    ],
    correctOptionIndex: 1,
    explanation: 'CARO 2020 Clause (i)(c) requires the auditor to state whether the title deeds of all the immovable properties (other than leaseholds duly executed) disclosed in the financial statements are held in the name of the company. If not, the auditor shall provide specified details including description of property, gross carrying value, held in name of, whether promoter/director/relative, and reason for not being held in company name.'
  },
  {
    id: 'AUD_CH7_02',
    subjectId: 'Audit',
    chapterName: 'Reporting',
    questionText: 'Under CARO 2020 Clause (ii)(b), what is the threshold of working capital limits sanctioned from banks or financial institutions on the basis of security of current assets that triggers quarterly statement reconciliation reporting?',
    options: [
      'In excess of ₹1 Crore',
      'In excess of ₹5 Crores',
      'In excess of ₹10 Crores',
      'In excess of ₹25 Crores'
    ],
    correctOptionIndex: 1,
    explanation: 'CARO 2020 Clause (ii)(b) specifies that whether during any point of time of the year, the company has been sanctioned working capital limits in excess of ₹5 Crores, in aggregate, from banks or financial institutions on the basis of security of current assets; the auditor must report whether quarterly returns or statements filed by the company with such banks/FIs are in agreement with the books of account.'
  },
  {
    id: 'AUD_CH7_03',
    subjectId: 'Audit',
    chapterName: 'Reporting',
    questionText: 'Under CARO 2020 Clause (xvii), what is the statutory reporting requirement concerning cash losses?',
    options: [
      'Reporting cash losses only if the company has defaulted on bank borrowings.',
      'Whether the company has incurred cash losses in the financial year and in the immediately preceding financial year, and if so, the amount of cash losses.',
      'Reporting cash losses only if the accumulated losses exceed 50% of net worth.',
      'Reporting petty cash embezzlement above ₹50,000.'
    ],
    correctOptionIndex: 1,
    explanation: 'CARO 2020 Clause (xvii) mandates reporting on: "whether the company has incurred cash losses in the financial year and in the immediately preceding financial year, and if so, state the amount of cash losses."'
  },
  {
    id: 'AUD_CH7_04',
    subjectId: 'Audit',
    chapterName: 'Reporting',
    questionText: 'Under SA 720 (Revised), what constitutes "Other Information"?',
    options: [
      'Confidential board meeting minutes provided under seal.',
      'Financial or non-financial information (other than financial statements and the auditor’s report thereon) included in an entity’s annual report.',
      'The personal income tax returns of the independent directors.',
      'Competitor analysis prepared by external market research agencies.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 720 (Revised) paragraph 12 defines "Other Information" as financial or non-financial information (other than financial statements and the auditor’s report thereon) included in an entity’s annual report (e.g., Director’s Report, Management Discussion and Analysis, Corporate Governance Report).'
  },
  {
    id: 'AUD_CH7_05',
    subjectId: 'Audit',
    chapterName: 'Reporting',
    questionText: 'Under Section 143(11) of the Companies Act, 2013, which of the following classes of companies is EXEMPT from the applicability of CARO 2020?',
    options: [
      'All unlisted public companies.',
      'Banking company, Insurance company, Section 8 company, One Person Company (OPC), and Small Company.',
      'Companies listed on the SME exchange of BSE or NSE.',
      'Private companies having paid-up capital and reserves of ₹10 Crores.'
    ],
    correctOptionIndex: 1,
    explanation: 'CARO 2020 Paragraph 1(2) explicitly exempts: (i) a banking company; (ii) an insurance company; (iii) a company licensed to operate under section 8; (iv) a One Person Company and Small Company; and (v) private limited companies meeting specific thresholds (paid-up capital + reserves $\le$ ₹1 Cr, borrowings $\le$ ₹1 Cr, total revenue $\le$ ₹10 Cr).'
  },

  // =========================================================================================
  // CHAPTER 8: SPECIALISED AREAS (SA 800, SA 805, SA 810)
  // Target: 10 new MCQs (Total: 12)
  // =========================================================================================
  {
    id: 'AUD_CH8_01',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 800, what is a "Special Purpose Framework"?',
    options: [
      'A financial reporting framework designed to meet the common financial information needs of a wide range of public users.',
      'A financial reporting framework designed to meet the financial information needs of specific users (e.g., tax basis, cash receipts and disbursements basis, regulatory reporting basis, or contractual basis).',
      'The framework prescribed by the International Accounting Standards Board (IASB) for multinational listings.',
      'The internal budget allocation framework used by the cost accounting department.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 800 paragraph 6(a) defines a special purpose framework as a financial reporting framework designed to meet the financial information needs of specific users. Examples include tax-basis accounting, cash receipts and disbursements basis, provisions of a contract, or regulatory reporting provisions.'
  },
  {
    id: 'AUD_CH8_02',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 800, what mandatory paragraph must the auditor include in the auditor’s report on special purpose financial statements to alert users?',
    options: [
      'A disclaimer of opinion.',
      'An Emphasis of Matter paragraph alerting users that the financial statements are prepared in accordance with a special purpose framework and that, as a result, the financial statements may not be suitable for another purpose.',
      'A Key Audit Matters section explaining general accounting policies.',
      'A qualification regarding the non-compliance with General Purpose Frameworks.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 800 paragraph 14 requires that the auditor’s report on special purpose financial statements shall include an Emphasis of Matter paragraph alerting users of the auditor’s report that the financial statements are prepared in accordance with a special purpose framework and that, as a result, the financial statements may not be suitable for another purpose.'
  },
  {
    id: 'AUD_CH8_03',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 805, what is the scope of an audit of a single financial statement or a specific element, account, or item of a financial statement?',
    options: [
      'The auditor can perform a superficial high-level inquiry without applying SAs.',
      'The auditor shall apply all SAs relevant to the audit, adapting them as necessary in the circumstances of the engagement.',
      'The auditor must audit all other un-contracted balance sheet items as well.',
      'The engagement is governed by SRS 4400 and not by auditing standards.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 805 paragraph 5 and 7 mandate that the auditor shall apply all SAs relevant to the audit, adapting them as necessary in the circumstances of the engagement. Even though only a single statement (e.g., balance sheet) or specific element (e.g., schedule of accounts receivable) is being audited, the full rigour of SAs applies.'
  },
  {
    id: 'AUD_CH8_04',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 805, if the auditor expresses an ADVERSE OPINION or a DISCLAIMER OF OPINION on the complete set of financial statements as a whole, what is the rule regarding expressing an unmodified opinion on a SINGLE financial statement of the same entity?',
    options: [
      'The auditor can issue an unmodified opinion on the single financial statement anytime without restriction.',
      'The auditor shall not express an unmodified opinion on a single financial statement of the same entity when an adverse opinion or disclaimer of opinion has been expressed on the complete set, unless permitted by law and published separately from the complete set.',
      'The auditor can issue the unmodified opinion provided an advance fee is paid.',
      'The auditor can issue an unmodified opinion if the single statement represents less than 50% of net worth.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 805 paragraph 15 states that if the auditor considers it necessary to express an adverse opinion or disclaim an opinion on the entity’s complete set of financial statements as a whole, the auditor’s report on the complete set precludes an unmodified opinion on a single financial statement, because such an unmodified opinion would contradict the adverse opinion or disclaimer on the complete set.'
  },
  {
    id: 'AUD_CH8_05',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 805, can an auditor express an unmodified opinion on a SPECIFIC ELEMENT of a financial statement when an adverse opinion or disclaimer has been expressed on the complete set of financial statements?',
    options: [
      'Never under any circumstances.',
      'Yes, only if that specific element does not constitute a major portion of the complete set, the opinion is not published together with the auditor’s report containing adverse/disclaimer, and the element does not relate to the matter causing modification.',
      'Yes, automatically if requested by the bank.',
      'Yes, but only if the element is Cash and Cash Equivalents.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 805 paragraph 15-16 states that the auditor may express an unmodified opinion on a specific element provided: (a) that opinion is not published together with the auditor’s report containing the adverse opinion or disclaimer; and (b) the specific element does not constitute a major portion of the complete set of financial statements.'
  },
  {
    id: 'AUD_CH8_06',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 810, who is eligible to accept an engagement to report on SUMMARY FINANCIAL STATEMENTS derived from financial statements?',
    options: [
      'Any independent Chartered Accountant in practice, regardless of whether they audited the original financial statements.',
      'Only the auditor who was engaged to conduct the audit of the financial statements from which the summary financial statements are derived.',
      'The internal auditor of the reporting entity.',
      'A forensic auditor appointed by the lenders.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 810 paragraph 5 explicitly states: "The auditor shall accept an engagement to report on summary financial statements in accordance with this SA only when the auditor has been engaged to conduct an audit in accordance with SAs of the financial statements from which the summary financial statements are derived."'
  },
  {
    id: 'AUD_CH8_07',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 810, what is the nature of the auditor’s opinion on summary financial statements when applied criteria are met?',
    options: [
      'A statement that the summary financial statements give a true and fair view in accordance with AS/Ind AS.',
      'An opinion whether the summary financial statements are consistent, in all material respects, with the audited financial statements, in accordance with the applied criteria.',
      'A disclaimer of opinion because full notes are not included.',
      'A negative assurance review statement under SRE 2400.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 810 paragraph 9 provides that when the auditor concludes that an unmodified opinion on the summary financial statements is appropriate, the opinion shall state that the summary financial statements are consistent, in all material respects, with the audited financial statements, in accordance with [the applied criteria].'
  },
  {
    id: 'AUD_CH8_08',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 810, if the auditor’s report on the audited financial statements contained a QUALIFIED OPINION, Emphasis of Matter, or Material Uncertainty Related to Going Concern, how must this be reflected in the report on the summary financial statements?',
    options: [
      'The auditor must omit all references to prior qualifications to keep the summary concise.',
      'The auditor’s report on the summary financial statements shall state that the report on the audited financial statements contains a qualified opinion/EOM/MURGC and describe the basis for that modification/paragraph.',
      'The auditor must issue an adverse opinion on the summary financial statements.',
      'The auditor must refuse to issue a report on the summary financial statements.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 810 paragraph 15-16 mandates that when the report on audited financial statements contains a qualified opinion, EOM paragraph, or MURGC section, the auditor’s report on summary financial statements shall: (a) State that fact; (b) Describe the basis for the qualified opinion/matter; and (c) Describe the effect thereof on the summary financial statements.'
  },
  {
    id: 'AUD_CH8_09',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'If the auditor’s report on the audited financial statements contains an ADVERSE OPINION or a DISCLAIMER OF OPINION, what opinion does SA 810 require on the summary financial statements derived therefrom?',
    options: [
      'An unmodified opinion if the mathematical transcription is accurate.',
      'The auditor’s report on summary financial statements shall state that the report on audited financial statements contains an adverse opinion/disclaimer, and shall indicate that it is inappropriate to express an opinion on the summary financial statements.',
      'A qualified opinion citing clerical variance.',
      'A limited review conclusion under SRE 2400.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 810 paragraph 17 specifies that when the auditor’s report on audited financial statements contains an adverse opinion or a disclaimer of opinion, the auditor’s report on summary financial statements shall state that fact, explain the basis, and indicate that as a result, it is inappropriate to express an opinion on the summary financial statements.'
  },
  {
    id: 'AUD_CH8_10',
    subjectId: 'Audit',
    chapterName: 'Specialised Areas',
    questionText: 'Under SA 805, in an audit of an account balance (such as Accounts Receivable), what is the auditor’s responsibility regarding related accounts?',
    options: [
      'The auditor can audit accounts receivable completely in isolation without considering sales or cash collections.',
      'The auditor shall consider whether other related accounts (e.g., sales revenue, allowance for credit losses, cash receipts) need to be audited to obtain sufficient appropriate evidence about the specific element.',
      'The auditor must audit 100% of all company balance sheet items.',
      'The auditor must issue a joint audit report with the tax auditor.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 805 paragraph 12 notes that many financial statement items are interrelated (e.g., sales and receivables, inventory and payables). In an audit of a specific element, the auditor is often required to examine interrelated items and transactions to obtain sufficient appropriate audit evidence about the specified element.'
  },

  // =========================================================================================
  // CHAPTER 9: RELATED SERVICES (SRS 4400, SRS 4410)
  // Target: 10 new MCQs (Total: 11)
  // =========================================================================================
  {
    id: 'AUD_CH9_01',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Under SRS 4400 (Revised), what is the primary objective of an Agreed-Upon Procedures (AUP) engagement?',
    options: [
      'To provide high reasonable assurance on the financial viability of an entity.',
      'To carry out procedures of an audit nature to which the practitioner and the entity and any appropriate third parties have agreed and to report on factual findings without expressing any assurance.',
      'To certify that no fraud has occurred in the organization.',
      'To compile financial statements from raw trial balance data.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRS 4400 (Revised) establishes that the objective of an agreed-upon procedures engagement is for the practitioner to perform procedures that have been agreed upon by the practitioner and the engaging party, and to communicate the factual findings. No assurance is expressed. Users evaluate the findings and draw their own conclusions.'
  },
  {
    id: 'AUD_CH9_02',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Under SRS 4400 (Revised), what level of assurance is expressed by the practitioner in an Agreed-Upon Procedures Report?',
    options: [
      'Reasonable assurance',
      'Limited / Moderate negative assurance',
      'No assurance is expressed; only factual findings are reported',
      'Absolute statutory assurance'
    ],
    correctOptionIndex: 2,
    explanation: 'In an AUP engagement under SRS 4400, the practitioner provides a report of the factual findings of agreed-upon procedures; NO assurance is expressed. The users of the report assess for themselves the procedures and findings reported by the practitioner and draw their own conclusions from the practitioner’s work.'
  },
  {
    id: 'AUD_CH9_03',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Under SRS 4400 (Revised), is the practitioner required to be INDEPENDENT of the entity?',
    options: [
      'Independence is strictly mandatory in all AUP engagements with no exceptions.',
      'The practitioner is not required to be independent unless the terms of engagement or applicable law/regulation require compliance with independence requirements; however, ethical principles of integrity and objectivity apply.',
      'Independence is only required if the client is a listed public company.',
      'The practitioner must hold equity shares in the client to ensure alignment of interests.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SRS 4400 (Revised), independence is not a prerequisite for an agreed-upon procedures engagement unless the practitioner is required to comply with independence requirements by the terms of engagement, law, or regulation. However, if the practitioner is not independent, a statement to that effect shall be included in the report.'
  },
  {
    id: 'AUD_CH9_04',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Which of the following terms in an engagement letter would be INAPPROPRIATE for an Agreed-Upon Procedures engagement under SRS 4400 because it implies subjective judgment or assurance?',
    options: [
      '"Reconcile total purchases in the purchase register with general ledger ledger account 401."',
      '"Inspect 25 sample vendor invoices above ₹1,00,000 for authorized purchase order attachments."',
      '"Perform a complete review to certify that internal controls are fully adequate and error-free."',
      '"Confirm the arithmetic accuracy of the depreciation schedule."'
    ],
    correctOptionIndex: 2,
    explanation: 'SRS 4400 prohibits using vague or subjective terms like "certify completeness", "review adequacy", or "guarantee reliability" because AUP involves specific, objectively determinable procedures. The term "certify that internal controls are fully adequate and error-free" implies assurance and subjective evaluation.'
  },
  {
    id: 'AUD_CH9_05',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Under SRS 4410 (Revised), what is the core objective of a "Compilation Engagement"?',
    options: [
      'To provide positive reasonable assurance that the financial statements are prepared in accordance with GAAP.',
      'To apply accounting and financial reporting expertise to assist management in the preparation and presentation of financial information without undertaking to obtain or express any assurance thereon.',
      'To verify that tax returns comply with Section 44AB of the Income Tax Act.',
      'To issue a limited review report under SRE 2400.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRS 4410 (Revised) paragraph 5 states that the practitioner’s objective in a compilation engagement is to apply accounting and financial reporting expertise to assist management in the preparation and presentation of financial information in accordance with an applicable financial reporting framework, without undertaking to obtain or express any assurance.'
  },
  {
    id: 'AUD_CH9_06',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Under SRS 4410 (Revised), is the practitioner required to verify the accuracy or completeness of the information provided by management for compilation?',
    options: [
      'Yes, the practitioner must perform 100% substantive audit testing.',
      'No, a compilation engagement is not an assurance engagement; the practitioner is not required to verify the accuracy or completeness of information provided by management, nor to gather evidence to express an audit opinion or review conclusion.',
      'Yes, but only for bank account reconciliations.',
      'Yes, by sending positive confirmation letters under SA 505.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRS 4410 paragraph 6 clarifies that a compilation engagement does not require the practitioner to verify the accuracy or completeness of the information provided by management, or to gather evidence to express an audit opinion or a review conclusion. The practitioner assists management with compilation based on data supplied.'
  },
  {
    id: 'AUD_CH9_07',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'If during a compilation engagement under SRS 4410, the practitioner becomes aware that the records or explanations provided by management are incomplete, inaccurate, or otherwise unsatisfactory, what must the practitioner do?',
    options: [
      'Ignore the issue since it is a non-assurance compilation engagement.',
      'Request that management provide additional or corrected information; and if management refuses, withdraw from the engagement and inform management of the reasons.',
      'Complete the compilation and file a criminal complaint with the Serious Fraud Investigation Office (SFIO).',
      'Issue a qualified audit report under SA 705.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRS 4410 paragraph 33 states that if the practitioner becomes aware that the records, documents, explanations or other information are incomplete, inaccurate, or otherwise unsatisfactory, the practitioner shall propose appropriate amendments. If management refuses, the practitioner shall withdraw from the engagement.'
  },
  {
    id: 'AUD_CH9_08',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'What statement MUST be included in the Practitioner’s Compilation Report under SRS 4410 regarding assurance?',
    options: [
      'A statement that the financial information gives a true and fair view.',
      'A statement that since the compilation engagement is not an assurance engagement, the practitioner does not express an audit opinion or a review conclusion.',
      'A statement that the report is endorsed by the Comptroller & Auditor General.',
      'A statement that the internal controls of the entity are satisfactory.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRS 4410 paragraph 40 explicitly requires the compilation report to state that: (a) the practitioner has compiled the financial information based on information provided by management; (b) management is responsible; and (c) since a compilation is not an assurance engagement, the practitioner does not express an audit opinion or a review conclusion.'
  },
  {
    id: 'AUD_CH9_09',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Which of the following compares correctly the levels of assurance across Engagements under the ICAI Standards Framework?',
    options: [
      'Audit: Absolute; Review: None; Agreed-Upon Procedures: Limited; Compilation: Reasonable',
      'Audit: Reasonable Assurance; Review: Limited / Moderate Assurance; Agreed-Upon Procedures: No Assurance; Compilation: No Assurance',
      'Audit: High; Review: High; Agreed-Upon Procedures: Moderate; Compilation: Absolute',
      'Audit: Limited; Review: Reasonable; Agreed-Upon Procedures: None; Compilation: None'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the ICAI Standards Framework: Audits (SAs) provide Reasonable Assurance (high, but not absolute); Reviews (SREs) provide Limited/Moderate Assurance; Agreed-Upon Procedures (SRS 4400) provide NO assurance (factual findings only); Compilation (SRS 4410) provides NO assurance (accounting compilation assistance only).'
  },
  {
    id: 'AUD_CH9_10',
    subjectId: 'Audit',
    chapterName: 'Related Services',
    questionText: 'Under SRS 4400, to whom is the distribution of the Agreed-Upon Procedures Report ordinarily restricted?',
    options: [
      'It must be published in the public domain and filed on the stock exchange website.',
      'It is restricted to those parties that have agreed to the procedures to be performed, since others, unaware of the reasons for the procedures, may misinterpret the results.',
      'It can only be shared with the statutory income tax assessing officer.',
      'It is restricted solely to the internal audit staff of the entity.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRS 4400 paragraph 18 states that the report of factual findings is to be restricted to those parties that have agreed to the procedures to be performed since others, unaware of the reasons for the procedures, may misinterpret the results.'
  },

  // =========================================================================================
  // CHAPTER 10: REVIEW OF FINANCIAL INFORMATION (SRE 2400, SRE 2410)
  // Target: 10 new MCQs (Total: 11)
  // =========================================================================================
  {
    id: 'AUD_CH10_01',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'What is the primary difference in practitioner applicability between SRE 2400 (Revised) and SRE 2410?',
    options: [
      'SRE 2400 applies to listed entities, while SRE 2410 applies to unlisted entities.',
      'SRE 2400 applies when a practitioner who is NOT the statutory auditor reviews historical financial statements; SRE 2410 applies when the entity’s STATUTORY INDEPENDENT AUDITOR performs a review of interim financial information.',
      'SRE 2400 is for prospective information, while SRE 2410 is for historical information.',
      'SRE 2400 is issued by ICAI, while SRE 2410 is issued by the Reserve Bank of India.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2400 (Revised) applies to engagements to review historical financial statements when performed by a practitioner who is not the statutory auditor of the entity. SRE 2410 specifically applies to reviews of interim financial information performed by the independent statutory auditor of the entity (e.g., quarterly reviews under SEBI LODR Regulation 33).'
  },
  {
    id: 'AUD_CH10_02',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'What form of assurance conclusion is expressed in a standard review report under SRE 2400 (Revised) and SRE 2410?',
    options: [
      'Positive reasonable assurance ("In our opinion, the financial statements give a true and fair view...")',
      'Negative limited assurance ("Based on our review, nothing has come to our attention that causes us to believe that the financial statements do not present fairly / give a true and fair view...")',
      'Factual findings with no conclusion expressed.',
      'Certification of 100% mathematical accuracy.'
    ],
    correctOptionIndex: 1,
    explanation: 'In a review engagement, the practitioner expresses limited/moderate assurance in a negative form: "Based on our review, nothing has come to our attention that causes us to believe that these interim/historical financial statements do not give a true and fair view..."'
  },
  {
    id: 'AUD_CH10_03',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'Under SRE 2410, what are the two PRIMARY audit procedures performed to obtain limited assurance on interim financial information?',
    options: [
      '100% physical inventory counting and sending third-party debtor confirmations.',
      'Making inquiries of management and others, and applying analytical procedures.',
      'Engaging forensic handwriting experts and testing cash registers.',
      'Performing walkthrough tests of every computerized accounting terminal.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2410 paragraph 15 states that a review of interim financial information consists of making inquiries, primarily of persons responsible for financial and accounting matters, and applying analytical and other review procedures. A review ordinarily does not require tests of the accounting records or corroborating evidence through physical inspection or external confirmation.'
  },
  {
    id: 'AUD_CH10_04',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'Under SRE 2410, why is the statutory auditor able to perform a review of interim financial information with a more limited scope than an outside practitioner?',
    options: [
      'Because statutory auditors are exempt from ethical guidelines.',
      'Because the statutory auditor has already acquired an ongoing understanding of the entity and its environment, including its internal control, through the annual audit engagement.',
      'Because interim reviews do not require any working papers under SA 230.',
      'Because SEBI permits statutory auditors to rely on unaudited Excel spreadsheets.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2410 paragraph 10-12 highlights that the auditor of an entity has an ongoing relationship with the entity. The understanding of the entity and its environment, including its internal control, obtained in the audit of annual financial statements, is fundamental to conducting a review of interim financial information efficiently.'
  },
  {
    id: 'AUD_CH10_05',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'Under SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, what is the deadline for a listed entity to submit its quarterly financial results accompanied by a Limited Review Report to the stock exchanges?',
    options: [
      'Within 30 days of the end of the quarter.',
      'Within 45 days of the end of the quarter (or 60 days for the last quarter if audited).',
      'Within 60 days of the end of every quarter.',
      'Within 90 days from the close of the financial year.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Regulation 33 of SEBI LODR Regulations, 2015, the listed entity shall submit quarterly and year-to-date standalone financial results to the stock exchange within 45 days of the end of each quarter (other than the last quarter), accompanied by a Limited Review Report. For the last quarter, audited results can be submitted within 60 days.'
  },
  {
    id: 'AUD_CH10_06',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'If during a review under SRE 2410, the auditor becomes aware of a matter that causes the auditor to believe the interim financial information is materially misstated, what must the auditor do?',
    options: [
      'Immediately resign and report to the police.',
      'Make additional inquiries or perform other procedures to enable the auditor to conclude whether a material modification must be made to the interim financial information.',
      'Issue an unmodified review report and wait for the annual audit to adjust.',
      'Charge triple review fees.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2410 paragraph 22 requires that if a matter comes to the auditor’s attention that causes the auditor to question whether the interim financial information requires material modification, the auditor shall make additional inquiries or perform other procedures to enable the auditor to express a conclusion.'
  },
  {
    id: 'AUD_CH10_07',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'If interim financial information contains a material departure from the applicable financial reporting framework (Ind AS 34) and management refuses to correct it, what conclusion should the auditor express under SRE 2410?',
    options: [
      'An unmodified review conclusion.',
      'A Qualified Conclusion ("Except for the effects...") or an Adverse Conclusion (if the matter is pervasive to the interim financial information).',
      'A Disclaimer of Conclusion.',
      'A Compilation Certificate under SRS 4410.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2410 paragraphs 34-36 provide that if the interim financial information contains a departure from the applicable framework, the auditor shall express a Qualified Conclusion or an Adverse Conclusion (when the effect of the departure is so pervasive that the auditor concludes a qualified conclusion is inadequate to disclose the misleading nature).'
  },
  {
    id: 'AUD_CH10_08',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'Under SRE 2410, what conclusion should the auditor express if there is a severe limitation on the scope of the review such that the auditor is unable to complete the review?',
    options: [
      'Adverse Conclusion',
      'Disclaimer of Conclusion',
      'Qualified Conclusion',
      'Emphasis of Matter without modification'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2410 paragraph 38 states that when the auditor is unable to complete the review due to a limitation on scope, the auditor shall express a Disclaimer of Conclusion ("We do not express a conclusion on the interim financial information").'
  },
  {
    id: 'AUD_CH10_09',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'Under SRE 2400 (Revised), is an engagement partner required to perform an Engagement Quality Control Review (EQCR)?',
    options: [
      'EQCR is strictly forbidden in review engagements.',
      'For reviews of financial statements of listed entities or engagements meeting the firm’s criteria, the engagement partner shall ensure that an engagement quality control reviewer is appointed and the review is completed before issuing the report.',
      'EQCR is only required if the client pays more than ₹1 Crore in review fees.',
      'EQCR is required only if the practitioner expresses an adverse conclusion.'
    ],
    correctOptionIndex: 1,
    explanation: 'SRE 2400 (Revised) paragraph 27 requires that for engagements that meet the firm’s criteria for an EQCR, the engagement partner shall: (a) determine that an EQCR has been appointed; (b) discuss significant matters arising during the review; and (c) not release the review report until the completion of the EQCR.'
  },
  {
    id: 'AUD_CH10_10',
    subjectId: 'Audit',
    chapterName: 'Review of Financial Information',
    questionText: 'Which Indian Accounting Standard governs the preparation and presentation of Interim Financial Information reviewed under SRE 2410?',
    options: [
      'Ind AS 1',
      'Ind AS 34 (Interim Financial Reporting) / AS 25',
      'Ind AS 115',
      'Ind AS 108'
    ],
    correctOptionIndex: 1,
    explanation: 'Interim financial information reviewed under SRE 2410 is prepared in accordance with Ind AS 34 "Interim Financial Reporting" (or AS 25 under AS framework), which prescribes minimum contents including condensed balance sheet, condensed statement of profit and loss, condensed cash flows, and selected explanatory notes.'
  },

  // ===============================================================================================================
  // CHAPTER 11: PROSPECTIVE FINANCIAL INFORMATION AND OTHER ASSURANCE SERVICES (SAE 3400, SAE 3402, SAE 3420)
  // Target: 10 new MCQs (Total: 12)
  // ===============================================================================================================
  {
    id: 'AUD_CH11_01',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3400, what is the critical conceptual distinction between a "Forecast" and a "Projection"?',
    options: [
      'A forecast covers 1 year, while a projection covers 5 years.',
      'A forecast is prospective financial information prepared on the basis of assumptions as to future events which management expects to take place (best-estimate assumptions); whereas a projection is based on hypothetical assumptions about future events or uncommitted management actions.',
      'A forecast is prepared by statutory auditors; a projection is prepared by investment bankers.',
      'A forecast is prepared on a cash basis; a projection is prepared on an accrual basis.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3400 paragraph 3 defines: A "forecast" means prospective financial information prepared on the basis of assumptions as to future events which management expects to take place and the actions management expects to take (best-estimate assumptions). A "projection" means prospective financial information prepared on the basis of hypothetical assumptions or a mixture of best-estimate and hypothetical assumptions.'
  },
  {
    id: 'AUD_CH11_02',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3400, can the auditor express an opinion as to whether the prospective results will actually be ACHIEVED?',
    options: [
      'Yes, the auditor provides reasonable assurance that the forecasted profit will be achieved.',
      'No, the auditor can NOT express an opinion as to whether the results shown in the prospective financial information will be achieved, because evidence supporting future assumptions is speculative and events frequently do not occur as expected.',
      'Yes, provided a sensitivity analysis is included.',
      'Yes, if the client provides a corporate guarantee.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3400 paragraph 8 explicitly provides that in an engagement to examine prospective financial information, the auditor cannot obtain sufficient evidence to express an opinion as to whether the results will be achieved. The auditor’s report must state that the auditor does not express an opinion on whether the results will be achieved.'
  },
  {
    id: 'AUD_CH11_03',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'What level and form of assurance is expressed by the auditor regarding the reasonableness of assumptions under SAE 3400?',
    options: [
      'Absolute assurance',
      'Moderate / Negative assurance ("nothing has come to our attention to cause us to believe that these assumptions do not provide a reasonable basis for the prospective financial information")',
      'No assurance of any kind',
      'Full statutory opinion under Section 143(3)'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SAE 3400 paragraph 9, the auditor provides a moderate level of assurance (negative assurance) on the reasonableness of management’s assumptions: stating whether anything has come to the auditor’s attention which causes the auditor to believe that the assumptions do not provide a reasonable basis for the forecast/projection.'
  },
  {
    id: 'AUD_CH11_04',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under Clause (3) of Part I of the Second Schedule to the Chartered Accountants Act, 1949, when is a CA in practice held guilty of professional misconduct in relation to future earnings?',
    options: [
      'If the CA prepares a tax computation for the client.',
      'If the CA permits their name or the name of their firm to be used in connection with an estimate of earnings contingent upon future transactions in a manner which may lead to the belief that the CA vouches for the accuracy of the forecast.',
      'If the CA conducts an audit of a start-up company.',
      'If the CA advises the client on working capital management.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Clause (3) of Part I of the Second Schedule to the CA Act, 1949, a CA in practice is deemed guilty of professional misconduct if they permit their name to be used in connection with an estimate of earnings contingent upon future transactions in a manner which may lead to the belief that they vouch for the accuracy of the forecast. (Compliance with SAE 3400 is a defense).'
  },
  {
    id: 'AUD_CH11_05',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3402, what is the key difference between a "Type 1 Report" and a "Type 2 Report" on controls at a service organization?',
    options: [
      'Type 1 is issued for private entities; Type 2 is issued for listed entities.',
      'Type 1 reports on the description and design suitability of controls at a specific point in time; Type 2 reports on description, design suitability AND the operating effectiveness of controls throughout a specified period.',
      'Type 1 is prepared by the user auditor; Type 2 is prepared by the service auditor.',
      'Type 1 is valid for 5 years; Type 2 is valid for 1 month.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SAE 3402 paragraph 8, a Type 1 report conveys assurance on the description and design suitability of the service organization’s system at a specified date. A Type 2 report includes assurance on description and design, PLUS testing of the operating effectiveness of controls throughout a specified period (ordinarily at least 6 months).'
  },
  {
    id: 'AUD_CH11_06',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3420, what is the practitioner’s objective when reporting on the compilation of PRO FORMA financial information included in a prospectus?',
    options: [
      'To verify the market capitalization targets of the upcoming IPO.',
      'To obtain reasonable assurance about whether the pro forma financial information has been compiled, in all material respects, by the responsible party on the basis of the applicable criteria.',
      'To guarantee that investors will earn a positive return on equity.',
      'To audit the prospective cash flows of the acquired subsidiary.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3420 paragraph 6 states that the practitioner’s objective is to obtain reasonable assurance about whether the pro forma financial information has been compiled, in all material respects, by the responsible party on the basis of the applicable criteria (i.e. whether pro forma adjustments are factually supportable and properly applied).'
  },
  {
    id: 'AUD_CH11_07',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3420, what is the purpose of Pro Forma Financial Information in a prospectus?',
    options: [
      'To replace the historical audited financial statements completely.',
      'To illustrate the impact of a significant event or transaction (e.g., an acquisition or merger) on unadjusted historical financial information as if the event had occurred or the transaction had been undertaken at an earlier date.',
      'To forecast the next 5 years’ dividend payouts.',
      'To provide a tax avoidance roadmap for incoming shareholders.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3420 paragraph 4 states that the purpose of pro forma financial information included in a prospectus is solely to illustrate the impact of a significant event or transaction on unadjusted financial information of the entity as if the event had occurred or transaction had been undertaken at an earlier date selected for purposes of the illustration.'
  },
  {
    id: 'AUD_CH11_08',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3400, which of the following MUST be explicitly stated in the auditor’s report on prospective financial information?',
    options: [
      'A statement that the client’s board of directors has indemnified the auditor against all future losses.',
      'A cautionary statement that actual results are likely to be different from the prospective financial information since anticipated events frequently do not occur as expected.',
      'A certification that the projected EBITDA will be achieved within 2% tolerance.',
      'A declaration that the auditor has invested in the client’s shares.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3400 paragraph 19 requires the report to contain a statement that actual results are likely to be different from the prospective financial information since anticipated events frequently do not occur as expected and the variation may be material.'
  },
  {
    id: 'AUD_CH11_09',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3400, when an auditor believes that the presentation and disclosure of prospective financial information is not adequate, or one or more significant assumptions are unrealistic, what must the auditor do?',
    options: [
      'Issue an unmodified report with a private note to the CFO.',
      'Express a qualified or adverse opinion, or withdraw from the engagement if the assumptions are unrealistic.',
      'Substitute their own personal financial assumptions into the model.',
      'Request the Registrar of Companies to re-calculate the figures.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3400 paragraphs 21-23 state that when the presentation/disclosure is not adequate or the auditor believes one or more significant assumptions do not provide a reasonable basis, the auditor shall express a qualified or adverse opinion, or withdraw from the engagement when appropriate.'
  },
  {
    id: 'AUD_CH11_10',
    subjectId: 'Audit',
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    questionText: 'Under SAE 3402, what is the role of "Complementary User Entity Controls" (CUECs)?',
    options: [
      'Controls implemented by the Reserve Bank of India to monitor payment gateways.',
      'Controls that the service organization assumes, in the design of its service, will be implemented by user entities, and which, if necessary to achieve control objectives, are identified in the description of the service system.',
      'Controls managed solely by external cybersecurity insurance providers.',
      'Controls implemented by the income tax department during assessment.'
    ],
    correctOptionIndex: 1,
    explanation: 'SAE 3402 defines Complementary User Entity Controls as controls that the service organization assumes, in the design of its service, will be implemented by user entities, and which, if necessary to achieve the stated control objectives, are identified in the description of the system.'
  }
];
