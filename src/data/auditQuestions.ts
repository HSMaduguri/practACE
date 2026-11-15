import { QuizQuestionItem, GeneralQuestion, CaseScenario } from '../types';
import { PART1_STANDARDS_MCQS } from './audit/part1Standards';
import { PART2_REPORTING_ASSURANCE_MCQS } from './audit/part2ReportingAssurance';
import { PART3_SPECIALISED_SECTORS_MCQS } from './audit/part3SpecialisedSectors';
import { PART4_INTERNAL_ETHICS_ESG_MCQS } from './audit/part4InternalEthicsESG';

const NEW_AUDIT_ITEMS: QuizQuestionItem[] = [
  ...PART1_STANDARDS_MCQS,
  ...PART2_REPORTING_ASSURANCE_MCQS,
  ...PART3_SPECIALISED_SECTORS_MCQS,
  ...PART4_INTERNAL_ETHICS_ESG_MCQS
].map(q => ({
  type: 'general' as const,
  data: q
}));

export const AUDIT_QUIZ_QUESTIONS: QuizQuestionItem[] = [
  // 1. Quality Control
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_01',
      subjectId: 'Audit',
      chapterName: 'Quality Control',
      questionText: 'Under SQC 1 and SA 220, what is the mandatory requirement regarding the dating of the auditor\'s report when an Engagement Quality Control Review (EQCR) is conducted for a listed entity?',
      options: [
        'The auditor\'s report may be dated before the completion of EQCR if the Engagement Partner has orally briefed the reviewer.',
        'The auditor\'s report shall not be dated until the completion of the Engagement Quality Control Review.',
        'The auditor\'s report must be dated on the exact same date as the acceptance of the engagement letter.',
        'EQCR review can be completed up to 60 days following the date of the auditor\'s report during file assembly.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 220 paragraph 19 and SQC 1, for audits of financial statements of listed entities, the engagement partner shall not date the auditor’s report until the completion of the engagement quality control review.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_02',
      subjectId: 'Audit',
      chapterName: 'Quality Control',
      questionText: 'Under SQC 1, what is the statutory time limit for the assembly of the final audit file after the date of the auditor\'s report, and what is the minimum retention period?',
      options: [
        'Assembly within 30 days; retention for not less than 5 years.',
        'Assembly ordinarily not more than 60 days; retention for not less than 7 years from the report date.',
        'Assembly within 90 days; retention for not less than 8 years as per Companies Act.',
        'Assembly within 45 days; retention for not less than 10 years.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SQC 1, an appropriate time limit within which to complete the assembly of the final audit file is ordinarily not more than 60 days after the date of the auditor’s report. The retention period is ordinarily not less than 7 years from the date of the auditor’s report.'
    } as GeneralQuestion
  },

  // 2. General Auditing Principles
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_03',
      subjectId: 'Audit',
      chapterName: 'General Auditing Principles and Auditors Responsibilities',
      questionText: 'If management imposes a limitation on the scope of the auditor\'s work in the terms of a proposed audit engagement such that the auditor believes the limitation will result in the auditor disclaiming an opinion on the financial statements, how shall the auditor respond under SA 210?',
      options: [
        'Accept the engagement and issue an immediate disclaimer of opinion on day one.',
        'Accept the engagement with a higher performance materiality to bypass the restriction.',
        'The auditor shall not accept such a limited engagement as an audit engagement, unless required by law to do so.',
        'Accept the engagement only after obtaining written concurrence from the Registrar of Companies.'
      ],
      correctOptionIndex: 2,
      explanation: 'Under SA 210 "Agreeing the Terms of Audit Engagements", if management or TCWG impose a limitation on scope before acceptance such that the auditor would disclaim an opinion, the auditor shall not accept such an engagement unless required by law.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_04',
      subjectId: 'Audit',
      chapterName: 'General Auditing Principles and Auditors Responsibilities',
      questionText: 'Under SA 240, which of the following areas carries an explicit rebuttable presumption of risk of material misstatement due to fraud across all audit engagements?',
      options: [
        'Valuation of property, plant, and equipment',
        'Recognition of revenue',
        'Classification of deferred tax liabilities',
        'Recording of bank charges and reconciliation items'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 240, when identifying and assessing the risks of material misstatement due to fraud, the auditor shall, based on a presumption that there are risks of fraud in revenue recognition, evaluate which types of revenue, revenue transactions or assertions give rise to such risks.'
    } as GeneralQuestion
  },

  // 3. Planning & Using Work of Others
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_05',
      subjectId: 'Audit',
      chapterName: 'Audit Planning, Strategy and Execution',
      questionText: 'Under SA 610 (Revised), in which of the following areas is the external auditor strictly prohibited from using internal auditors to provide direct assistance?',
      options: [
        'Attending routine physical inventory counting at minor branch depots.',
        'Checking mathematical accuracy of depreciation schedules prepared by management.',
        'Matters involving significant judgment or higher assessed risks of material misstatement.',
        'Inspecting dates on vendor delivery challans.'
      ],
      correctOptionIndex: 2,
      explanation: 'Under SA 610 (Revised), the external auditor shall not use internal auditors to provide direct assistance to perform procedures that involve making significant judgments in the audit or relate to higher assessed risks of material misstatement.'
    } as GeneralQuestion
  },

  // 4. Materiality & Risk Assessment
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_06',
      subjectId: 'Audit',
      chapterName: 'Materiality, Risk Assessment and Internal Control',
      questionText: 'According to SA 320, what is the primary objective of determining "Performance Materiality"?',
      options: [
        'To determine the maximum fee the auditor can bill for testing out-of-scope transactions.',
        'To reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds materiality for the financial statements as a whole.',
        'To set the threshold below which misstatements are deemed clearly trivial and ignored completely.',
        'To specify the statutory penalty payable by management under Section 447.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 320 paragraph 9, performance materiality means the amount or amounts set by the auditor at less than materiality for the financial statements as a whole to reduce to an appropriately low level the probability that the aggregate of uncorrected and undetected misstatements exceeds materiality for the financial statements as a whole.'
    } as GeneralQuestion
  },

  // 5. Audit Evidence
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_07',
      subjectId: 'Audit',
      chapterName: 'Audit Evidence',
      questionText: 'Under SA 505, negative confirmation requests may be used as the sole substantive procedure to address an assessed risk of material misstatement ONLY when which combination of conditions is satisfied?',
      options: [
        'Assessed RMM is high, population has small number of large balances, and high exception rate is expected.',
        'Assessed RMM is low, large number of small homogeneous balances, very low exception rate expected, and auditor has no reason to believe recipients will disregard requests.',
        'Whenever management specifically requests negative confirmations in the engagement letter.',
        'Only in initial audit engagements governed by SA 510.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 505, negative confirmations can provide sufficient appropriate audit evidence as a sole substantive procedure only if all four conditions are met: (1) Low assessed RMM & controls tested, (2) Large number of small, homogeneous balances, (3) Very low exception rate expected, and (4) Auditor is not aware of circumstances causing disregard.'
    } as GeneralQuestion
  },

  // 6. Completion & Review
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_08',
      subjectId: 'Audit',
      chapterName: 'Completion and Review',
      questionText: 'Under SA 570 (Revised), if the auditor concludes that management\'s use of the going concern basis of accounting is appropriate, but a material uncertainty exists AND adequate disclosure about this uncertainty is made in the financial statements, what opinion shall the auditor express?',
      options: [
        'Adverse opinion due to the presence of material uncertainty.',
        'Qualified opinion citing scope limitation.',
        'Unmodified opinion, and the auditor shall include a separate section titled "Material Uncertainty Related to Going Concern".',
        'Disclaimer of opinion, withdrawing from communicating Key Audit Matters under SA 701.'
      ],
      correctOptionIndex: 2,
      explanation: 'Under SA 570 (Revised) paragraph 22, if adequate disclosure about the material uncertainty is made in the financial statements, the auditor shall express an unmodified opinion and the auditor’s report shall include a separate section under the heading "Material Uncertainty Related to Going Concern".'
    } as GeneralQuestion
  },

  // 7. Reporting & CARO 2020 & Sec 143
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_09',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under Section 143(12) of the Companies Act, 2013 read with Rule 13, an auditor who detects an offense of fraud involving an amount of ₹1 Crore or above committed against the company by its officers or employees must report the matter to the Central Government within what statutory timeline?',
      options: [
        'Report to Board/Audit Committee within 2 days; on receipt of reply within 45 days, forward report with reply and comments to Central Govt within 15 days in Form ADT-4.',
        'Report directly to Central Government in Form ADT-4 within 7 days, bypassing the Board.',
        'Wait until the annual general meeting and include the fraud details in the CARO report only.',
        'Report to the Registrar of Companies within 30 days of the end of the financial year.'
      ],
      correctOptionIndex: 0,
      explanation: 'Section 143(12) read with Rule 13 of CAAR prescribes: (1) Report to Board/Audit Committee within 2 days of knowledge seeking reply within 45 days; (2) On receipt of reply or expiry of 45 days, forward the report along with reply and comments to Central Govt within 15 days in Form ADT-4.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_10',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under CARO 2020 Clause (ii)(b), reporting is mandatory if the company has been sanctioned working capital limits from banks or financial institutions on the basis of security of current assets in excess of what monetary threshold?',
      options: [
        '₹1 Crore',
        '₹5 Crores',
        '₹10 Crores',
        '₹25 Crores'
      ],
      correctOptionIndex: 1,
      explanation: 'Under Clause (ii)(b) of CARO 2020, the auditor must report whether during any point of time of the year, the company has been sanctioned working capital limits in excess of ₹5 Crores, in aggregate, from banks or financial institutions on the basis of security of current assets, and whether quarterly returns/statements filed agree with books.'
    } as GeneralQuestion
  },

  // 8. Specialised Areas
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_11',
      subjectId: 'Audit',
      chapterName: 'Specialised Areas',
      questionText: 'Under SA 805 (Revised), if the auditor expresses an adverse opinion or disclaims an opinion on the complete set of financial statements of an entity, what is the rule regarding expressing an unmodified opinion on a single financial statement of that same set?',
      options: [
        'The auditor may express an unmodified opinion on a single financial statement in the same audit report without restriction.',
        'The auditor shall not express an unmodified opinion on a single financial statement of that complete set in the same report, as it would contradict the adverse opinion or disclaimer.',
        'An unmodified opinion is mandatory if the single statement represents at least 10% of total revenue.',
        'The auditor must seek prior clearance from the Quality Review Board.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 805 (Revised) paragraph 15, if the auditor concludes that it is necessary to express an adverse opinion or disclaim an opinion on the entity’s complete set of financial statements, the auditor shall not express an unmodified opinion on a single financial statement that forms part of those financial statements.'
    } as GeneralQuestion
  },

  // 9. Related Services
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_12',
      subjectId: 'Audit',
      chapterName: 'Related Services',
      questionText: 'In an engagement to perform agreed-upon procedures under SRS 4400, what type of assurance is provided by the practitioner in his report?',
      options: [
        'Reasonable assurance similar to a statutory audit',
        'Limited negative assurance similar to a review',
        'No assurance is expressed; the report is strictly restricted to factual findings of agreed procedures',
        'Absolute assurance on the arithmetic accuracy of calculations'
      ],
      correctOptionIndex: 2,
      explanation: 'Under SRS 4400 "Engagements to Perform Agreed-Upon Procedures Regarding Financial Information", the objective is to carry out procedures of an audit nature to which the auditor and entity have agreed and report on factual findings. No assurance is expressed.'
    } as GeneralQuestion
  },

  // 10. Prospective Financial Information
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_13',
      subjectId: 'Audit',
      chapterName: 'Prospective Financial Information and Other Assurance Services',
      questionText: 'Under SAE 3400 and Clause (3) of Part I of the Second Schedule to the Chartered Accountants Act, 1949, how must a Chartered Accountant report on prospective financial information?',
      options: [
        'The CA must guarantee the mathematical certainty of the forecasted profits.',
        'The CA provides moderate assurance on the reasonableness of assumptions and must clearly state that he does not vouch for the accuracy or achievability of the forecast.',
        'The CA must certify that the future earnings will be attained within a 5% margin of error.',
        'The CA cannot sign any prospective statement under any circumstances.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SAE 3400, the practitioner obtains moderate assurance that assumptions provide a reasonable basis and reports that he does not vouch for achievability. Under Clause (3) Part I Second Schedule, a member is guilty of misconduct if he permits his name to be used in a manner which may lead to the belief that he vouches for the accuracy of forecasts.'
    } as GeneralQuestion
  },

  // 11. Bank Audit
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_14',
      subjectId: 'Audit',
      chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
      questionText: 'In a bank audit, if a borrower\'s drawing power is calculated on the basis of stock statements, what is the maximum age of the stock statement beyond which the drawing power calculation becomes invalid and the account must be treated as irregular under RBI guidelines?',
      options: [
        'Not older than 30 days',
        'Not older than 45 days',
        'Not older than 3 months',
        'Not older than 180 days'
      ],
      correctOptionIndex: 2,
      explanation: 'Under Master Circular on Prudential Norms on Income Recognition, Asset Classification and Provisioning (IRACP), stock statements relied upon by banks for determining Drawing Power should not be older than 3 months. A working capital account where stock statements are older than 3 months is deemed irregular.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_15',
      subjectId: 'Audit',
      chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
      questionText: 'Under RBI\'s Scale Based Regulation (SBR) framework for NBFCs, what is the minimum Capital to Risk-Weighted Assets Ratio (CRAR) required to be maintained by all applicable NBFCs in Middle, Upper, and applicable layers?',
      options: [
        'Minimum 9% with Tier 1 at 7%',
        'Minimum 12% with Tier 1 at 8%',
        'Minimum 15% with Tier 1 capital not less than 10%',
        'Minimum 20% with Tier 1 capital not less than 15%'
      ],
      correctOptionIndex: 2,
      explanation: 'Under RBI Master Directions on SBR, NBFCs are required to maintain a minimum Capital to Risk-Weighted Assets Ratio (CRAR) of 15% on an ongoing basis, with minimum Tier 1 capital of 10% (12% for NBFCs primarily lending against gold jewellery).'
    } as GeneralQuestion
  },

  // 12. Public Sector Undertakings (PSUs)
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_16',
      subjectId: 'Audit',
      chapterName: 'Overview of Audit of Public Sector Undertakings',
      questionText: 'In the audit of Public Sector Undertakings, a Performance Audit examines whether programs, activities, or entities are operating in accordance with the principles of the "3Es". What are the 3Es?',
      options: [
        'Eligibility, Ethics, and Equity',
        'Economy, Efficiency, and Effectiveness',
        'Execution, Evaluation, and Enforcement',
        'Expediency, Evidence, and Excellence'
      ],
      correctOptionIndex: 1,
      explanation: 'Performance auditing in PSUs focuses on the 3Es: (1) Economy (minimizing cost of resources), (2) Efficiency (optimizing input-output relationship), and (3) Effectiveness (achieving intended policy objectives and goals).'
    } as GeneralQuestion
  },

  // 13. Internal Audit
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_17',
      subjectId: 'Audit',
      chapterName: 'Internal Audit',
      questionText: 'Under Section 138 of the Companies Act, 2013 read with Rule 13 of Companies (Accounts) Rules, which of the following unlisted public companies is MANDATORILY required to appoint an internal auditor for the financial year 2025-26?',
      options: [
        'Zenith Ltd. having paid-up capital of ₹25 Cr and turnover of ₹120 Cr with bank loans of ₹40 Cr during preceding FY.',
        'Apex Ltd. having paid-up capital of ₹40 Cr, turnover of ₹180 Cr, but outstanding bank borrowings exceeding ₹100 Crores at any point during preceding FY.',
        'Delta Ltd. having deposits of ₹15 Crores and turnover of ₹90 Crores during preceding FY.',
        'Omega Ltd. having turnover of ₹150 Crores and borrowings of ₹80 Crores during preceding FY.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under Section 138, an unlisted public company must appoint an internal auditor if during the preceding FY: Capital ≥ ₹50 Cr, OR Turnover ≥ ₹200 Cr, OR Outstanding loans/borrowings from banks/PFIs > ₹100 Cr at any point, OR Outstanding deposits > ₹25 Cr at any point. Apex Ltd. triggered the borrowing threshold (> ₹100 Cr).'
    } as GeneralQuestion
  },

  // 14. Due Diligence & Forensic Audit
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_18',
      subjectId: 'Audit',
      chapterName: 'Due Diligence, Investigation & Forensic Audit',
      questionText: 'In Forensic Accounting, the "Fraud Diamond" theory expands Donald Cressey\'s traditional Fraud Triangle by adding which fourth critical dimension?',
      options: [
        'Collusion with third parties',
        'Capability (personal traits and abilities to commit and conceal fraud)',
        'Technological complexity of accounting software',
        'Economic inflation in the market'
      ],
      correctOptionIndex: 1,
      explanation: 'The Fraud Diamond (introduced by Wolfe and Hermanson) adds "Capability" to the three elements of the Fraud Triangle (Incentive/Pressure, Opportunity, Rationalization). Capability refers to the individual’s technical skills, authority, intelligence, and stress tolerance needed to exploit opportunities.'
    } as GeneralQuestion
  },

  // 15. ESG & BRSR
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_19',
      subjectId: 'Audit',
      chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
      questionText: 'Under SEBI regulations, the Business Responsibility and Sustainability Report (BRSR) is structured around nine core principles derived from the National Guidelines on Responsible Business Conduct (NGRBC). Which of the following is correct regarding BRSR disclosures?',
      options: [
        'BRSR is completely voluntary for all listed entities in India.',
        'Disclosures are divided into Essential Indicators (mandatory reporting) and Leadership Indicators (aspirational/voluntary reporting).',
        'BRSR applies only to banking companies governed by the Reserve Bank of India.',
        'BRSR covers only financial capital and completely ignores natural and human capitals.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SEBI circulars, BRSR disclosures under Section C (Principle-wise Performance) are categorized into: (1) Essential Indicators (mandatory for top 1,000 listed entities by market capitalization), and (2) Leadership Indicators (voluntary for entities aspiring to higher sustainability standards).'
    } as GeneralQuestion
  },

  // 16. Professional Ethics
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_20',
      subjectId: 'Audit',
      chapterName: 'Professional Ethics & Liabilities of Auditors',
      questionText: 'CA Rakesh is offered appointment as statutory auditor of a private limited company where his brother holds 2% equity shares and is employed as the Chief Financial Officer (CFO). Under Section 141(3)(f) of Companies Act, 2013 and the Code of Ethics, is CA Rakesh eligible to accept the appointment?',
      options: [
        'Yes, because brother holds less than 5% equity shares.',
        'No, because under Section 141(3)(f), a person whose relative is a director or is in the employment of the company as a director or key managerial personnel is disqualified.',
        'Yes, provided Rakesh charges fees on a contingent basis under Regulation 192.',
        'Yes, if Rakesh takes approval from the Peer Review Board.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under Section 141(3)(f) of the Companies Act, 2013, a person whose relative is a director or is in the employment of the company as a director or Key Managerial Personnel (CFO is KMP u/s 2(51)) is disqualified from being appointed as statutory auditor.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_21',
      subjectId: 'Audit',
      chapterName: 'Professional Ethics & Liabilities of Auditors',
      questionText: 'Under Chapter VI of Council General Guidelines, 2008, what is the maximum number of tax audit assignments under Section 44AB of the Income-tax Act, 1961 that a member of the Institute in practice or a partner of a firm can accept in a financial year?',
      options: [
        '30 tax audits per partner',
        '45 tax audits per partner',
        '60 tax audits per partner',
        '100 tax audits per partner'
      ],
      correctOptionIndex: 2,
      explanation: 'Under Chapter VI of the Council General Guidelines, 2008, a member of the Institute in practice shall not accept in a financial year more than 60 tax audit assignments under Section 44AB. (Audits under 44AD, 44ADA, and 44AE are excluded).'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_22',
      subjectId: 'Audit',
      chapterName: 'Professional Ethics & Liabilities of Auditors',
      questionText: 'Under the Code of Ethics, what is the threshold for mandatory applicability of NOCLAR (Responding to Non-Compliance with Laws and Regulations) in India for professional accountants in public practice performing an audit?',
      options: [
        'Audit of all private and public companies without exception.',
        'Audit of entities listed on recognized stock exchanges in India having net worth of ₹250 Crores or more.',
        'Audit of companies with turnover exceeding ₹1,000 Crores only.',
        'Audit of banking companies only.'
      ],
      correctOptionIndex: 1,
      explanation: 'Section 360 of the revised Code of Ethics on NOCLAR is applicable to audit engagements of entities listed on recognized stock exchanges in India having net worth of ₹250 Crores or more.'
    } as GeneralQuestion
  },

  // 17. Digital Auditing & Assurance
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_23',
      subjectId: 'Audit',
      chapterName: 'Digital Auditing & Assurance',
      questionText: 'Under Rule 3(1) of the Companies (Accounts) Rules, 2014 and Rule 11(g) of the Companies (Audit and Auditors) Rules, 2014, what is the mandatory statutory requirement regarding accounting software and the auditor\'s reporting thereon?',
      options: [
        'The software must record an audit trail of each and every transaction, creating an edit log of each change made with date and timestamp, and ensuring the audit trail feature cannot be disabled.',
        'The software is only required to record an audit trail for sales and purchase entries exceeding ₹50,000.',
        'The audit trail feature is optional for unlisted companies having turnover below ₹100 Crores.',
        'The auditor is only required to comment on the audit trail if a material fraud is detected during the financial year.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under proviso to Rule 3(1) of Companies (Accounts) Rules, 2014, companies must use accounting software with a feature of recording audit trail (edit log) of each transaction, creating an edit log of each change with dates, ensuring it cannot be disabled. Under Rule 11(g) of CAAR, the auditor must explicitly report whether the company operated such software throughout the year without disabling it, and whether the audit trail has been preserved.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_24',
      subjectId: 'Audit',
      chapterName: 'Digital Auditing & Assurance',
      questionText: 'In auditing an entity with computerized accounting and ERP environments, which of the following is categorized as an Information Technology General Control (ITGC) rather than an Automated Application Control?',
      options: [
        'Three-way automated matching of purchase order, goods received note (GRN), and vendor invoice.',
        'Programmed validation check rejecting any customer order exceeding the approved credit limit.',
        'User access management procedures governing password complexity, segregation of duties, and authorization of privileged system accounts.',
        'Automated calculation of depreciation based on predefined asset master data and useful life formulas.'
      ],
      correctOptionIndex: 2,
      explanation: 'IT General Controls (ITGC) are policies and procedures that relate to many applications and support the effective functioning of application controls (e.g., access security, program change management, and computer operations). Three-way matching, credit checks, and automated depreciation calculations are specific Automated Application Controls embedded within individual business applications.'
    } as GeneralQuestion
  },

  // 18. Group Audits
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_25',
      subjectId: 'Audit',
      chapterName: 'Group Audits',
      questionText: 'Under SA 600 "Using the Work of Another Auditor", when the principal auditor relies upon the financial statements of a component audited by another auditor (component auditor), what is the legal and professional position regarding the principal auditor\'s responsibility in India?',
      options: [
        'The principal auditor assumes full and undivided legal responsibility for the financial statements of the components, even if audited by another chartered accountant.',
        'The principal auditor is entitled to rely on the work of the component auditor unless there is cause for suspicion, and must clearly disclose the division of responsibility in the auditor\'s report stating the extent to which financial information of components audited by others is included.',
        'The principal auditor must re-perform at least 50% of the substantive tests conducted by the component auditor before signing the group report.',
        'The principal auditor is strictly prohibited from mentioning the component auditor or the division of responsibility under any circumstances.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 600, in India the principal auditor does not assume responsibility for the work performed by other auditors. The principal auditor should clearly indicate in his report the division of responsibility between the portions of financial statements covered by the principal auditor and other auditors by stating the extent of assets, revenues, and cash flows audited by other auditors.'
    } as GeneralQuestion
  },

  // 19. Review of Financial Information
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_26',
      subjectId: 'Audit',
      chapterName: 'Review of Financial Information',
      questionText: 'Under SRE 2400 (Revised) "Engagements to Review Historical Financial Statements", what are the primary procedures the practitioner performs, and what form of assurance is communicated in the review report?',
      options: [
        'Extensive test of internal controls; expresses reasonable positive assurance that the statements give a true and fair view.',
        'Primarily inquiry and analytical procedures; expresses limited (negative) assurance that nothing has come to the practitioner\'s attention causing him to believe the financial statements are materially misstated.',
        'Physical verification of assets and circularization of external confirmations; expresses absolute assurance.',
        'Detailed forensic scrutiny of all cash vouchers; expresses no assurance.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SRE 2400 (Revised), a review engagement consists primarily of making inquiries of management and others within the entity, applying analytical procedures, and evaluating the evidence obtained. The practitioner expresses limited assurance (negative assurance form), stating that nothing has come to attention to indicate the financial statements do not give a true and fair view in accordance with the applicable financial reporting framework.'
    } as GeneralQuestion
  },

  // 20. Joint Audit & Responsibilities
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_27',
      subjectId: 'Audit',
      chapterName: 'General Auditing Principles and Auditors Responsibilities',
      questionText: 'Under SA 299 (Revised) "Joint Audit of Financial Statements", if the joint auditors disagree with respect to the opinion or any matter to be included in the audit report, how shall the audit reporting be handled?',
      options: [
        'The opinion of the majority joint auditors shall prevail and bind all dissenting joint auditors without exception.',
        'The dissenting auditor must immediately resign and refer the matter to the Institute\'s Disciplinary Directorate.',
        'The joint auditors are not bound by the views of the majority; each dissenting joint auditor is entitled to express his own opinion through a separate audit report.',
        'The joint auditors must refer the dispute to the Registrar of Companies whose ruling will determine the final report.'
      ],
      correctOptionIndex: 2,
      explanation: 'Under SA 299 (Revised) paragraph 12, where the joint auditors are in disagreement with regard to any matter to be included in the report, each one of them shall express his own opinion through a separate report. A joint auditor is not bound by the views of the majority of the joint auditors.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_28',
      subjectId: 'Audit',
      chapterName: 'General Auditing Principles and Auditors Responsibilities',
      questionText: 'Under SA 260 (Revised) "Communication with Those Charged with Governance", which of the following matters is the auditor MANDATORILY required to communicate in writing in the case of listed entities?',
      options: [
        'Day-to-day administrative schedules of junior article assistants.',
        'All written representations requested from management regarding trivial estimates.',
        'A written statement that the engagement team and others in the firm have complied with relevant ethical requirements regarding independence, and all relationships that may bear on independence.',
        'Draft copies of vendor purchase orders reviewed during interim testing.'
      ],
      correctOptionIndex: 2,
      explanation: 'Under SA 260 (Revised) paragraph 17, in the case of listed entities, the auditor shall communicate with those charged with governance in writing: (a) A statement that the engagement team and others have complied with relevant ethical requirements regarding independence; and (b) All relationships and other matters between the firm and entity that may reasonably be thought to bear on independence.'
    } as GeneralQuestion
  },

  // 21. Audit Strategy & Planning
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_29',
      subjectId: 'Audit',
      chapterName: 'Audit Planning, Strategy and Execution',
      questionText: 'According to SA 300 "Planning an Audit of Financial Statements", what is the relationship between the Overall Audit Strategy and the Detailed Audit Plan?',
      options: [
        'The audit plan is prepared first, and the audit strategy is drafted only after physical verification of inventory is concluded.',
        'The overall audit strategy sets the scope, timing, and direction of the audit, and guides the development of the more detailed audit plan (which includes the nature, timing, and extent of specific audit procedures).',
        'The audit strategy and audit plan are mutually exclusive documents prepared by two different independent engagement partners.',
        'The audit strategy cannot be modified or updated once approved by the engagement partner at the commencement of the engagement.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 300, the establishment of the overall audit strategy sets the scope, timing, and direction of the audit, and guides the development of the audit plan. The audit plan is more detailed than the overall audit strategy and includes the nature, timing, and extent of audit procedures to be performed by engagement team members.'
    } as GeneralQuestion
  },

  // 22. Responses to Assessed Risks & Misstatements
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_30',
      subjectId: 'Audit',
      chapterName: 'Materiality, Risk Assessment and Internal Control',
      questionText: 'Under SA 330 "The Auditor\'s Responses to Assessed Risks", when is the auditor specifically required to perform Tests of Controls (TOC)?',
      options: [
        'Only when the client is an unlisted private company.',
        'When the auditor\'s assessment of risks of material misstatement includes an expectation that controls are operating effectively, OR when substantive procedures alone cannot provide sufficient appropriate audit evidence at the assertion level.',
        'Tests of controls are completely optional in all engagements where sample size for substantive testing exceeds 100 items.',
        'Only when ordered in writing by the Comptroller and Auditor General of India.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 330 paragraph 8, the auditor shall design and perform tests of controls if: (a) The auditor\'s assessment of risks of material misstatement at the assertion level includes an expectation that controls are operating effectively; or (b) Substantive procedures alone cannot provide sufficient appropriate audit evidence at the assertion level (e.g. in highly automated environments where evidence exists only in electronic form).'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_31',
      subjectId: 'Audit',
      chapterName: 'Materiality, Risk Assessment and Internal Control',
      questionText: 'Under SA 450 "Evaluation of Misstatements Identified During the Audit", what is the auditor\'s duty regarding misstatements accumulated during the audit?',
      options: [
        'The auditor must accumulate all misstatements identified during the audit, other than those that are clearly trivial.',
        'The auditor can ignore all misstatements that are individually below performance materiality without accumulating them.',
        'All misstatements regardless of size must be directly reported to the Ministry of Corporate Affairs in Form ADT-4.',
        'The auditor must adjust the client\'s ledger balances personally using his own journal entries.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under SA 450 paragraph 5, the auditor shall accumulate misstatements identified during the audit, other than those that are clearly trivial. Misstatements that are clearly trivial are of a wholly different (lower) magnitude than materiality and will have no consequences on the financial statements.'
    } as GeneralQuestion
  },

  // 23. Special Evidence Considerations (SA 501, 540, 550)
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_32',
      subjectId: 'Audit',
      chapterName: 'Audit Evidence',
      questionText: 'Under SA 501 "Audit Evidence - Specific Considerations for Selected Items", if attendance at physical inventory counting is impracticable due to unforeseen circumstances (e.g., severe flood or inaccessible warehouse), what is the auditor\'s statutory obligation?',
      options: [
        'Immediately issue an adverse audit report on the complete financial statements.',
        'Perform alternative audit procedures (e.g., inspect documentation of subsequent sale of specific inventory items acquired prior to physical count) to obtain sufficient appropriate audit evidence; if not possible, modify the opinion under SA 705.',
        'Rely entirely on the management representation letter without performing any alternative audit procedures.',
        'Compulsorily postpone the AGM by six months by issuing an executive order.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 501 paragraph 7, if attendance at physical inventory counting is impracticable, the auditor shall perform alternative audit procedures to obtain sufficient appropriate audit evidence regarding the existence and condition of inventory. If it is not possible to do so, the auditor shall modify the opinion in the auditor’s report in accordance with SA 705.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_33',
      subjectId: 'Audit',
      chapterName: 'Audit Evidence',
      questionText: 'Under SA 540 (Revised) "Auditing Accounting Estimates and Related Disclosures", which of the following procedures is required to identify indicators of possible management bias?',
      options: [
        'Reviewing the outcome of accounting estimates included in the prior period financial statements (retrospective review).',
        'Appointing an undercover private investigator to interrogate the finance directors.',
        'Assuming that every accounting estimate is intentionally fraudulent under Section 447.',
        'Disclaiming an opinion on any financial statement that contains fair value estimates.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under SA 540 (Revised) paragraph 14, the auditor shall review the outcome of previous accounting estimates, or, where applicable, their subsequent re-estimation to assist in identifying and assessing the risks of material misstatement in the current period, and to evaluate whether there are indicators of possible management bias.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_34',
      subjectId: 'Audit',
      chapterName: 'Audit Evidence',
      questionText: 'Under SA 550 "Related Parties", if the auditor identifies significant related party transactions outside the entity\'s normal course of business, what must the auditor specifically evaluate?',
      options: [
        'Whether the business rationale of the transactions suggests that they may have been entered into to engage in fraudulent financial reporting or to conceal misappropriation of assets.',
        'Whether the transactions have been published in a national English daily newspaper.',
        'Whether the transactions can be converted into sovereign bonds with 0% risk weight.',
        'Whether the related party is willing to reimburse the auditor\'s out-of-pocket travel expenses.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under SA 550 paragraph 23, for identified significant related party transactions outside the entity’s normal course of business, the auditor shall evaluate whether the business rationale (or lack thereof) of the transactions suggests that they may have been entered into to engage in fraudulent financial reporting or to conceal misappropriation of assets, and whether terms are consistent with management explanations.'
    } as GeneralQuestion
  },

  // 24. Subsequent Events & Representations
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_35',
      subjectId: 'Audit',
      chapterName: 'Completion and Review',
      questionText: 'Under SA 560 "Subsequent Events", what is the difference between the auditor\'s duty before the date of the auditor\'s report vs after the financial statements have been issued?',
      options: [
        'The auditor has an active duty to perform procedures to identify subsequent events up to the date of the auditor\'s report; after the financial statements are issued, the auditor has no obligation to perform any procedures regarding such financial statements (passive duty).',
        'The auditor has no duty at all before the report date, but must monitor the company continuously for 7 years after issuance.',
        'The auditor must inspect daily bank statements forever, even after resigning.',
        'Management ceases to be responsible for financial statements once the auditor signs the report.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under SA 560, the auditor has an active obligation to perform audit procedures designed to obtain sufficient appropriate audit evidence that all events occurring up to the date of the auditor’s report requiring adjustment or disclosure have been identified. After financial statements are issued, the auditor has no obligation to perform any audit procedures regarding such statements (passive duty; action is only required if a new fact becomes known that would have caused amendment had it been known at the report date).'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_36',
      subjectId: 'Audit',
      chapterName: 'Completion and Review',
      questionText: 'Under SA 580 "Written Representations", if management refuses to provide written representations acknowledging its responsibility for the preparation of financial statements and the completeness of information provided to the auditor, what opinion shall the auditor express?',
      options: [
        'Issue an unmodified report with an Emphasis of Matter paragraph.',
        'The auditor shall disclaim an opinion on the financial statements in accordance with SA 705 (Revised).',
        'Issue a qualified opinion stating that management was busy.',
        'Accept an oral representation from the office receptionist instead.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 580 paragraph 19, the auditor shall disclaim an opinion on the financial statements in accordance with SA 705 (Revised) if the auditor concludes that there is sufficient doubt about the integrity of management such that the written representations regarding management’s responsibilities are not reliable, or if management refuses to provide those fundamental written representations.'
    } as GeneralQuestion
  },

  // 25. KAM, EOM & OM Reporting
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_37',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under SA 701 "Communicating Key Audit Matters in the Independent Auditor\'s Report", which of the following is correct regarding the scope and nature of Key Audit Matters (KAM)?',
      options: [
        'KAM is mandatory for audits of complete sets of general purpose financial statements of listed entities and is a substitute for the auditor expressing a modified opinion under SA 705.',
        'KAM are those matters that, in the auditor\'s professional judgment, were of most significance in the audit of financial statements of the current period, selected from matters communicated with TCWG; communicating KAM is NOT a substitute for expressing a modified opinion.',
        'KAM can be used to disclose uncorrected material misstatements without qualifying the report.',
        'KAM applies exclusively to non-profit charitable trusts and societies.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 701, Key Audit Matters are selected from matters communicated with TCWG that required significant auditor attention. Communicating KAM in the auditor’s report is NOT a substitute for disclosures in financial statements, NOT a substitute for expressing a modified opinion under SA 705, and NOT a separate opinion on individual matters.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_38',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under SA 706 (Revised), what is the distinction between an Emphasis of Matter (EOM) paragraph and an Other Matter (OM) paragraph?',
      options: [
        'EOM refers to a matter appropriately presented or disclosed in the financial statements that is fundamental to users\' understanding; OM refers to a matter other than those presented or disclosed in the financial statements relevant to users\' understanding of the audit, auditor\'s responsibilities, or auditor\'s report.',
        'EOM modifies the auditor\'s opinion, whereas OM does not.',
        'OM refers to accounting errors exceeding 10% of profit, while EOM refers to tax evasion.',
        'EOM is prohibited in audits of listed companies under SEBI rules.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under SA 706 (Revised), Emphasis of Matter refers to a matter appropriately presented or disclosed in the financial statements that, in the auditor’s judgment, is of such importance that it is fundamental to users’ understanding. Other Matter refers to a matter other than those presented or disclosed in the financial statements that is relevant to users’ understanding of the audit, the auditor’s responsibilities or the auditor’s report. Neither paragraph modifies the audit opinion.'
    } as GeneralQuestion
  },

  // 26. Companies Act Statutory Requirements (Rotation, Removal)
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_39',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under Section 139(2) of the Companies Act, 2013 read with Rule 5 of Companies (Audit and Auditors) Rules, 2014, which of the following classes of companies is exempt from the mandatory rotation of statutory auditors?',
      options: [
        'All unlisted public companies having paid-up share capital of ₹10 Crores or more.',
        'All private limited companies having paid-up share capital of ₹50 Crores or more.',
        'One Person Companies (OPC) and Small Companies.',
        'Companies having public borrowings from banks/financial institutions of ₹50 Crores or more.'
      ],
      correctOptionIndex: 2,
      explanation: 'Under Section 139(2) read with Rule 5 of Companies (Audit and Auditors) Rules, 2014, the rules of mandatory auditor rotation do not apply to One Person Companies (OPC) and Small Companies (as defined under Section 2(85)). All listed entities, unlisted public companies with capital ≥ ₹10 Cr, private companies with capital ≥ ₹50 Cr, and companies with borrowings ≥ ₹50 Cr are subject to rotation.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_40',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under Section 140(1) of the Companies Act, 2013, an auditor appointed under Section 139 may be removed from his office before the expiry of his term only by complying with which statutory procedure?',
      options: [
        'An ordinary resolution passed in a Board meeting without any government approval.',
        'A special resolution passed by the company after obtaining the prior approval of the Central Government (MCA) by making an application in Form ADT-2 within 30 days of the Board resolution.',
        'A letter of termination signed by the Managing Director giving 7 days notice.',
        'A suo-moto order passed by the Institute of Chartered Accountants of India.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under Section 140(1) read with Rule 7 of CAAR, 2014, the auditor may be removed before expiry of his term only by: (1) Passing a Board resolution; (2) Applying to the Central Government in Form ADT-2 within 30 days of the Board resolution; (3) On receiving approval, passing a special resolution at a general meeting within 60 days of receipt of approval; and (4) Giving reasonable opportunity of being heard to the auditor.'
    } as GeneralQuestion
  },

  // 27. CARO 2020 (Willful Defaulters & Solvency)
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_41',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under CARO 2020 Clause (ix)(b), what specific reporting is required regarding willful defaulters?',
      options: [
        'Whether the company has been declared a willful defaulter by any bank or financial institution or other lender.',
        'Whether any director was ever late in paying personal credit card bills.',
        'Reporting is required only if the unpaid amount exceeds ₹100 Crores.',
        'Willful default reporting is restricted solely to public sector undertakings.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under Clause (ix)(b) of CARO 2020, the auditor is required to report whether the company is a declared willful defaulter by any bank or financial institution or other lender, and if so, provide the details thereof.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_42',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      questionText: 'Under CARO 2020 Clause (xix), how does the auditor evaluate and report on the company\'s capability of meeting its liabilities?',
      options: [
        'The auditor must guarantee that the company will remain profitable for the next 10 years.',
        'On the basis of financial ratios, ageing and expected dates of realization of financial assets and payment of financial liabilities, other information accompanying the financial statements, and auditor\'s knowledge of Board and management plans, whether the auditor is of the opinion that no material uncertainty exists that the company is capable of meeting its liabilities existing at balance sheet date as and when they fall due within a period of one year from the balance sheet date.',
        'By verifying if the company possesses at least ₹10 Crores in physical gold.',
        'By certifying that current assets equal exactly twice current liabilities at all times.'
      ],
      correctOptionIndex: 1,
      explanation: 'Clause (xix) of CARO 2020 requires the auditor to report whether, on the basis of financial ratios, ageing and expected dates of realization of financial assets and payment of financial liabilities, other information accompanying financial statements, and knowledge of Board and management plans, no material uncertainty exists that the company is capable of meeting liabilities existing at balance sheet date as and when they fall due within one year.'
    } as GeneralQuestion
  },

  // 28. Summary Statements & Pro Forma Information
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_43',
      subjectId: 'Audit',
      chapterName: 'Specialised Areas',
      questionText: 'Under SA 810 "Engagements to Report on Summary Financial Statements", what is the requirement when the auditor\'s report on the audited financial statements contains an adverse opinion or a disclaimer of opinion?',
      options: [
        'The auditor can still express an unmodified opinion on the summary financial statements.',
        'The auditor\'s report on the summary financial statements shall state that the summary financial statements are not consistent with the audited financial statements, or the auditor shall not issue a report on summary financial statements.',
        'The auditor must convert the summary financial statements into prospective financial statements.',
        'The auditor must issue an Emphasis of Matter paragraph and charge double fees.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SA 810 paragraph 19, when the auditor’s report on the audited financial statements contains an adverse opinion or a disclaimer of opinion, the auditor’s report on the summary financial statements shall state that the audited financial statements contain an adverse opinion or disclaimer, describe the basis, and state that as a result, it is inappropriate to express an opinion on the summary financial statements.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_44',
      subjectId: 'Audit',
      chapterName: 'Prospective Financial Information and Other Assurance Services',
      questionText: 'Under SAE 3420 "Assurance Engagements to Report on the Compilation of Pro Forma Financial Information Included in a Prospectus", what is the objective of the practitioner\'s reasonable assurance engagement?',
      options: [
        'To certify that the future profits projected in the prospectus will definitely be realized.',
        'To obtain reasonable assurance about whether the pro forma financial information has been compiled, in all material respects, by the responsible party on the basis of the applicable criteria.',
        'To underwrite the complete public issue of shares.',
        'To guarantee the accuracy of historical books of the acquired target company.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under SAE 3420, the practitioner’s objective is to obtain reasonable assurance about whether the pro forma financial information has been compiled, in all material respects, by the responsible party on the basis of the applicable criteria, including whether pro forma adjustments give appropriate effect to the specified transaction.'
    } as GeneralQuestion
  },

  // 29. Banking & NBFC Norms (Agri Loans & LCR)
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_45',
      subjectId: 'Audit',
      chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
      questionText: 'Under RBI Prudential Norms on Agricultural Advances, when does a loan granted for agricultural purposes become a Non-Performing Asset (NPA)?',
      options: [
        'If interest remains overdue for 90 days from the date of disbursal.',
        'For short duration crop loans: if installment of principal or interest remains overdue for two crop seasons; For long duration crop loans: if installment of principal or interest remains overdue for one crop season.',
        'Whenever rainfall in the district is 10% below normal.',
        'Only when the farmer files an insolvency application in the High Court.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under RBI Master Circular on IRACP norms for agricultural advances: (1) A loan granted for short duration crops will be treated as NPA if the installment of principal or interest remains overdue for two crop seasons; (2) A loan granted for long duration crops (crops with crop season longer than 1 year) will be treated as NPA if overdue for one crop season.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_46',
      subjectId: 'Audit',
      chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
      questionText: 'Under RBI\'s regulatory framework for Non-Banking Financial Companies (NBFCs), which category of NBFCs is required to maintain a minimum Liquidity Coverage Ratio (LCR) with High Quality Liquid Assets (HQLA)?',
      options: [
        'All NBFCs having total assets of ₹50 Lakhs.',
        'All deposit-taking NBFCs (irrespective of asset size) and non-deposit taking NBFCs with asset size of ₹5,000 Crores and above.',
        'Only Core Investment Companies (CICs) with zero public funds.',
        'No NBFC in India is required to maintain LCR.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under RBI guidelines, all deposit-taking NBFCs (regardless of asset size) and all non-deposit taking NBFCs with asset size of ₹5,000 Crores and above are required to maintain a Liquidity Coverage Ratio (LCR) by holding a stock of unencumbered High Quality Liquid Assets (HQLA) to withstand potential 30-day liquidity stress.'
    } as GeneralQuestion
  },

  // 30. PSU & Internal Audit Principles
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_47',
      subjectId: 'Audit',
      chapterName: 'Overview of Audit of Public Sector Undertakings',
      questionText: 'In the audit of Public Sector Undertakings conducted under the auspices of C&AG, what is the fundamental focus of a "Propriety Audit"?',
      options: [
        'Merely checking mathematical addition of columns in cash books.',
        'Examining whether public funds have been spent with wisdom, faithfulness, economy, and whether the expenditure is not prima facie more than the occasion demands, beyond strict technical legal compliance.',
        'Verifying whether GST returns were submitted before the 20th of the following month.',
        'Auditing only the private expenditures of union ministers.'
      ],
      correctOptionIndex: 1,
      explanation: 'Propriety audit goes beyond statutory and voucher auditing to examine whether transactions conform to established principles of financial propriety: (1) Expenditure should not be prima facie more than the occasion demands; (2) Authority should exercise same vigilance as an ordinary person; (3) No authority should pass an order directly or indirectly to its own advantage; (4) Funds should not be utilized for benefit of a particular person/section.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_48',
      subjectId: 'Audit',
      chapterName: 'Internal Audit',
      questionText: 'Under the Standards on Internal Audit (SIAs) issued by ICAI, what is the primary distinction between the objective of Internal Audit and External Statutory Audit?',
      options: [
        'Internal audit is an independent, objective assurance and consulting activity designed to add value, evaluate governance, risk management, and internal controls; whereas statutory audit is focused on providing an independent opinion on the true and fair view of historical financial statements.',
        'Internal audit reports are published in the annual report for the general public, whereas statutory audit reports are secret documents.',
        'Internal auditors are not allowed to examine books of account or journal vouchers.',
        'Statutory auditors are subordinates of the internal auditors.'
      ],
      correctOptionIndex: 0,
      explanation: 'Under the Framework for Standards on Internal Audit, internal audit is an independent management function that provides objective assurance and consulting services to evaluate governance, risk management, and internal control structures. Statutory audit is an external statutory obligation under the Companies Act to report to shareholders on whether financial statements reflect a true and fair view.'
    } as GeneralQuestion
  },

  // 31. Forensic vs Statutory & Ethical Standards
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_49',
      subjectId: 'Audit',
      chapterName: 'Due Diligence, Investigation & Forensic Audit',
      questionText: 'In conducting a Forensic Audit as compared to a Statutory Audit, how does the concept of "Materiality" apply?',
      options: [
        'Forensic audit uses a higher materiality threshold of 10% of gross turnover to avoid testing minor matters.',
        'In a forensic audit, there is generally no concept of materiality; even a fraudulent transaction of ₹1,000 is investigated because it demonstrates intent, breach of trust, method of operation, and failure of internal integrity.',
        'Forensic audit and statutory audit use the exact same performance materiality computed under SA 320.',
        'Materiality in forensic audit is determined solely by the local police inspector.'
      ],
      correctOptionIndex: 1,
      explanation: 'In a Forensic Audit/Investigation, the concept of materiality does not apply in the manner it does in a financial statement audit under SA 320. A fraud or diversion of small amounts can reveal systematic patterns, employee collusion, or weaknesses that lead to massive undetected defalcations. Focus is on substance, intent, and legal admissibility under the Indian Evidence Act.'
    } as GeneralQuestion
  },
  {
    type: 'general',
    data: {
      id: 'AUD_MCQ_50',
      subjectId: 'Audit',
      chapterName: 'Professional Ethics & Liabilities of Auditors',
      questionText: 'Under Clause (7) of Part I of the Second Schedule to the Chartered Accountants Act, 1949, when is a member in practice held guilty of professional misconduct?',
      options: [
        'If he fails to invite attention to any material departure from the generally accepted procedure of audit applicable to the circumstances.',
        'If he does not exercise due diligence, or is grossly negligent in the conduct of his professional duties.',
        'If he engages in any business other than accountancy without permission.',
        'If he prints his firm logo on a greeting card.'
      ],
      correctOptionIndex: 1,
      explanation: 'Under Clause (7) of Part I of the Second Schedule to the CA Act, 1949, a member in practice is guilty of professional misconduct if he "does not exercise due diligence, or is grossly negligent in the conduct of his professional duties". Clause (8) applies if he fails to obtain sufficient information to warrant the expression of an opinion; Clause (9) applies if he fails to invite attention to material departure from accepted audit procedures.'
    } as GeneralQuestion
  },

  // Case Scenarios
  {
    type: 'case',
    data: {
      id: 'AUD_CS_01',
      subjectId: 'Audit',
      chapterName: 'Reporting',
      scenarioTitle: 'Statutory Audit and CARO 2020 Compliance of Horizon Infra Ltd.',
      scenarioText: 'Horizon Infra Ltd. is a mid-sized engineering and procurement company with a paid-up share capital of ₹15 Crores, total revenue of ₹120 Crores, and working capital credit facilities of ₹18 Crores sanctioned against hypothecation of current assets by a consortium of nationalized banks.\n\nDuring the statutory audit for FY 2025-26, the audit team observes the following matters:\n1. On March 12, 2026, the internal vigilance team detected a fraudulent diversion of funds of ₹1.45 Crores executed by the Senior Accounts Manager in collusion with an unapproved vendor. The matter was placed before the Audit Committee on March 15, 2026.\n2. The company filed quarterly statements of book debts and inventory with the lead bank. The quarterly return for the quarter ended December 31, 2025, showed current assets of ₹42 Crores, whereas the audited books of account reflected current assets of only ₹34 Crores, showing an unexplained difference of ₹8 Crores.\n3. The company granted an unsecured loan of ₹2.50 Crores to an entity in which one of the directors was interested. The loan has been overdue for repayment of principal for 110 days, and no legal or recovery steps have been initiated.\n4. Physical verification of construction steel stock was carried out by management at year-end. A discrepancy of 12% in aggregate was discovered between physical inventory and stock registers.',
      subQuestions: [
        {
          id: 'AUD_CS_1_1',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Reporting',
          questionText: 'Regarding the detected fraud of ₹1.45 Crores, what is the statutory duty of the auditor under Section 143(12) of Companies Act, 2013 read with Rule 13?',
          options: [
            'Since management already reported it to the Audit Committee, the auditor has no reporting obligation.',
            'The auditor must report the fraud to the Central Government (MCA) in Form ADT-4 within 15 days of receiving the Audit Committee’s reply (or after 45 days if no reply received), as the amount involved is ₹1 Crore or more.',
            'The auditor should only disclose the fraud in the Board’s Report under Section 134 without notifying MCA.',
            'The auditor must issue an immediate disclaimer of opinion and resign within 24 hours.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under Section 143(12) and Rule 13 of CAAR, when fraud involving ₹1 Crore or above is noticed, the auditor must report to the Board/Audit Committee within 2 days, and forward the report with reply and comments to Central Govt within 15 days in Form ADT-4.'
        },
        {
          id: 'AUD_CS_1_2',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Reporting',
          questionText: 'Under CARO 2020 Clause (ii)(b), how must the auditor report the discrepancy of ₹8 Crores between the quarterly statements submitted to banks and the books of account?',
          options: [
            'No reporting is required under CARO because sanctioned limits are below ₹25 Crores.',
            'Reporting is mandatory because sanctioned working capital limits exceed ₹5 Crores on security of current assets; the auditor must state whether quarterly returns agree with books and report the ₹8 Crore difference.',
            'Only oral communication to the branch bank manager is sufficient.',
            'Report under Clause (ix) as default in repayment of borrowings.'
          ],
          correctOptionIndex: 1,
          explanation: 'Clause (ii)(b) of CARO 2020 requires reporting where working capital limits sanctioned exceed ₹5 Crores on the security of current assets, detailing whether quarterly statements submitted agree with books of accounts.'
        },
        {
          id: 'AUD_CS_1_3',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Reporting',
          questionText: 'Under CARO 2020 Clause (iii)(d), what reporting is triggered by the unsecured loan of ₹2.50 Crores overdue for 110 days?',
          options: [
            'No reporting because overdue period is less than 180 days.',
            'The auditor must report that the overdue amount exceeds 90 days, specify the total amount overdue (₹2.50 Cr), and report whether reasonable steps have been taken by the company for recovery.',
            'The auditor must classify the company as an unregistered NBFC immediately.',
            'The loan must be compulsorily written off in the auditor\'s report.'
          ],
          correctOptionIndex: 1,
          explanation: 'Clause (iii)(d) of CARO 2020 specifies that if the amount is overdue for more than 90 days, the auditor must state the amount overdue and whether reasonable steps have been taken by the company for recovery of the principal and interest.'
        },
        {
          id: 'AUD_CS_1_4',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Reporting',
          questionText: 'Under CARO 2020 Clause (ii)(a), does the 12% discrepancy in steel inventory require specific reporting?',
          options: [
            'No, because discrepancies up to 15% are deemed normal in engineering companies.',
            'Yes, because discrepancies of 10% or more in aggregate for each class of inventory noticed on physical verification must be specifically reported, including whether properly dealt with in books.',
            'Reporting is only required if discrepancy exceeds ₹50 Lakhs.',
            'Reporting is required only under CARO Clause (xvii) as a cash loss.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under Clause (ii)(a) of CARO 2020, if discrepancies of 10% or more in the aggregate for each class of inventory were noticed during physical verification by management, the auditor must report the same and whether they have been properly dealt with in the books of account.'
        },
        {
          id: 'AUD_CS_1_5',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Reporting',
          questionText: 'If management refuses to adjust the ₹8 Crore unrecorded inventory discrepancy and the ₹1.45 Crore vendor diversion in the financial statements, and the auditor concludes the effect is material but not pervasive, how does this impact the Independent Auditor\'s Report under SA 705 and SA 701?',
          options: [
            'Issue an Unmodified Opinion and disclose the matters solely within the Emphasis of Matter paragraph under SA 706.',
            'Issue a Qualified Opinion under SA 705 ("Except for"), describe the quantification in the Basis for Qualified Opinion section, and do not repeat the matter in the Key Audit Matters section except by reference.',
            'Issue a Disclaimer of Opinion and omit the Key Audit Matters section automatically.',
            'Issue an Adverse Opinion and report the matter under Other Matter paragraph.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under SA 705 (Revised), when misstatements are material but not pervasive to the financial statements, the auditor shall express a Qualified Opinion and describe the financial effects in the Basis for Qualified Opinion section. Under SA 701, matters giving rise to a modified opinion in accordance with SA 705 are by their nature Key Audit Matters, but they shall not be described in the KAM section; instead, a reference to the Basis for Qualified Opinion section is made.'
        }
      ]
    } as CaseScenario
  },

  {
    type: 'case',
    data: {
      id: 'AUD_CS_02',
      subjectId: 'Audit',
      chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
      scenarioTitle: 'Statutory Branch Audit and NPA Classification of Vardhman Bank',
      scenarioText: 'CA Priya is conducting the statutory branch audit of Commercial Branch of Vardhman Bank Ltd. for the year ended March 31, 2026. During the audit of advances, CA Priya analyzes the following borrowal accounts:\n\n1. Account M/s Shrestha Textiles (Working Capital Cash Credit Limit ₹400 Lakhs): Stock statement for October 2025 was submitted on November 5, 2025. No subsequent stock statements have been submitted. The account has been continuously operating at ₹395 Lakhs.\n2. Account M/s Bright Solar (Term Loan): Sanctioned against Central Government guarantee. Principal and interest overdue for 105 days as on March 31, 2026. The guarantee has not been repudiated by the Central Government.\n3. Account M/s Deccan Agro (Term Loan): Sanctioned against State Government guarantee. Principal and interest overdue for 98 days as on March 31, 2026.\n4. Account M/s Apex Motors (Doubtful Asset): Sub-standard for 18 months. Outstanding balance is ₹80 Lakhs. Value of realizable primary and collateral security is ₹50 Lakhs.',
      subQuestions: [
        {
          id: 'AUD_CS_2_1',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
          questionText: 'How should the account of M/s Shrestha Textiles be classified as on March 31, 2026 regarding Drawing Power validity?',
          options: [
            'Standard asset with full DP available because the limit was reviewed within 12 months.',
            'The drawing power is invalid because stock statements are older than 3 months; the account is deemed irregular and, if uncorrected for over 90 days, must be classified as NPA.',
            'The bank manager has discretionary power to extend stock statement validity up to 180 days.',
            'Stock statements are only required for agricultural advances.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under RBI Master Circular on IRACP, stock statements should not be older than 3 months. An account where stock statements are older than 3 months is treated as irregular. If irregular status continues for 90 days, it must be downgraded to NPA.'
        },
        {
          id: 'AUD_CS_2_2',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
          questionText: 'What is the asset classification of M/s Bright Solar (Central Govt guaranteed) vs M/s Deccan Agro (State Govt guaranteed)?',
          options: [
            'Both must be classified as NPA because overdue period exceeds 90 days.',
            'Both remain Standard assets because all government guarantees enjoy total immunity from NPA classification.',
            'Bright Solar remains Standard (for asset classification purpose) until Central Govt repudiates guarantee, but interest cannot be recognized; Deccan Agro is NPA because State Govt guarantees do not enjoy this exemption.',
            'Bright Solar is classified as Loss asset immediately.'
          ],
          correctOptionIndex: 2,
          explanation: 'Advances guaranteed by the Central Government are not classified as NPA for provisioning/classification purposes until the Central Government repudiates its guarantee when invoked (though interest cannot be recognized as income). State Government guaranteed advances become NPA if overdue for more than 90 days.'
        },
        {
          id: 'AUD_CS_2_3',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
          questionText: 'For M/s Apex Motors (Sub-standard for 18 months; outstanding ₹80 Lakhs, security ₹50 Lakhs), what is the asset category and total provision required under RBI norms?',
          options: [
            'Sub-standard asset; provision @ 15% on ₹80L = ₹12 Lakhs.',
            'Doubtful Category 1 (up to 1 year); provision = (25% of ₹50L = 12.5L) + (100% of ₹30L = 30L) = ₹42.5 Lakhs.',
            'Doubtful Category 2 (1 to 3 years); provision = (40% of ₹50L = 20L) + (100% of ₹30L = 30L) = ₹50 Lakhs.',
            'Loss asset; provision @ 100% on ₹80L = ₹80 Lakhs.'
          ],
          correctOptionIndex: 1,
          explanation: 'An asset remains sub-standard for 12 months. Beyond 12 months, it enters Doubtful-1 (D1) for the next 12 months (months 12 to 24). At 18 months, it is in D1: Secured portion (₹50L) requires 25% = ₹12.5L; Unsecured portion (₹30L) requires 100% = ₹30L. Total provision = ₹42.5 Lakhs.'
        },
        {
          id: 'AUD_CS_2_4',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
          questionText: 'Under RBI guidelines, within what time limit must the consolidated Long Form Audit Report (LFAR) be submitted to the Audit Committee of the Board and forwarded to RBI?',
          options: [
            'Within 15 days from balance sheet date',
            'Within 30 days of completion of audit',
            'Within 60 days of submission by branch auditors / audit completion',
            'At the subsequent Annual General Meeting'
          ],
          correctOptionIndex: 2,
          explanation: 'Under RBI circulars, the consolidated LFAR of the bank, along with comments of the bank management, should be placed before the Audit Committee of the Board (ACB) and forwarded to the Reserve Bank of India within 60 days.'
        },
        {
          id: 'AUD_CS_2_5',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
          questionText: 'Suppose M/s Shrestha Textiles also holds an Export Packing Credit facility of ₹150 Lakhs with the same branch which is serviced regularly on time. Once its Cash Credit account (₹400 Lakhs) is classified as NPA, how must the Export Packing Credit facility be classified?',
          options: [
            'Export Packing Credit remains Standard since it is an export-oriented facility with zero overdue.',
            'NPA classification is borrower-wise and not facility-wise; therefore, both the Cash Credit account and the Export Packing Credit facility of M/s Shrestha Textiles must be classified as NPA.',
            'Only 50% of the Export Packing Credit is treated as Sub-standard.',
            'It is classified as Special Mention Account (SMA-2) for 180 days.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under RBI Prudential Norms on Income Recognition, Asset Classification and Provisioning (IRACP), asset classification is strictly borrower-wise and not facility-wise. If one credit facility of a borrower becomes NPA, all other credit facilities granted to that same borrower by the bank must also be treated as NPA.'
        }
      ]
    } as CaseScenario
  },

  {
    type: 'case',
    data: {
      id: 'AUD_CS_03',
      subjectId: 'Audit',
      chapterName: 'Professional Ethics & Liabilities of Auditors',
      scenarioTitle: 'Ethical Compliance and Code of Conduct Scenarios in CA Practice',
      scenarioText: 'CA Vikram is a practicing Chartered Accountant and sole proprietor of M/s Vikram & Co. The following situations arise during the year:\n\n1. CA Vikram accepted the statutory audit of QuickLoans Ltd., a non-banking financial company. He failed to send any written communication to the retiring auditor, CA Sharma, claiming that since the appointment was made at an AGM with 100% shareholder votes, communication was unnecessary.\n2. CA Vikram opened a branch office in a neighboring industrial town 42 km from his main office municipal limits. He visits this branch once a week and has not placed any other member in independent charge of this branch.\n3. CA Vikram accepted an assignment to value shares of a private entity for a merger, where his fee was agreed as 2% of the final enterprise valuation arrived at.\n4. QuickLoans Ltd. delayed paying statutory audit fees of ₹3,00,000 for the prior financial year. CA Vikram retained the company’s statutory minute books and original share certificates, exercising a "right of lien" until full payment.',
      subQuestions: [
        {
          id: 'AUD_CS_3_1',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Professional Ethics & Liabilities of Auditors',
          questionText: 'Regarding failure to communicate with the retiring auditor CA Sharma, is CA Vikram guilty of professional misconduct?',
          options: [
            'No, because unanimous appointment at AGM overrides communication requirements.',
            'Yes, guilty under Clause (8) of Part I of the First Schedule to the Chartered Accountants Act, 1949 for accepting audit without prior written communication with the retiring auditor.',
            'No, written communication is only required for listed entities.',
            'Guilty only under the Second Schedule.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under Clause (8) of Part I of the First Schedule to the CA Act, 1949, a member in practice is guilty of professional misconduct if he accepts a position as auditor previously held by another member without first communicating with him in writing.'
        },
        {
          id: 'AUD_CS_3_2',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Professional Ethics & Liabilities of Auditors',
          questionText: 'Is CA Vikram permitted under Section 27 of the CA Act, 1949 to maintain the branch office at 42 km without a separate member in charge?',
          options: [
            'No, every office regardless of distance must have a separate member residing in that town.',
            'Yes, under the Council General Guidelines exemption to Section 27, a second office situated within 50 km from municipal limits of the main office is exempt from the requirement of a separate member in charge.',
            'Yes, provided the branch office does not put up any signboard.',
            'No, because the limit is strictly 25 km.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under Section 27 and Council Guidelines, a member or firm is permitted to open a second office without a separate member in charge if the second office is situated within 50 km from the municipal limits of the city in which the main office is situated.'
        },
        {
          id: 'AUD_CS_3_3',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Professional Ethics & Liabilities of Auditors',
          questionText: 'Regarding the share valuation assignment where fees were fixed as 2% of enterprise value, what is the ethical validity under Regulation 192?',
          options: [
            'Valid, because valuation is not a statutory audit.',
            'Guilty of misconduct under Clause (10) of Part I of the First Schedule for charging fees based on a percentage of profits or contingent on results, unless covered by specific exceptions in Regulation 192.',
            'Valid, because percentage fees are permitted up to 5%.',
            'Valid only if enterprise value exceeds ₹100 Crores.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under Clause (10) of Part I of the First Schedule and Regulation 192 of CA Regulations, 1988, a member in practice cannot charge or accept fees based on a percentage of profits or contingent upon the findings. Valuation services do not qualify for percentage-based contingent fee exceptions.'
        },
        {
          id: 'AUD_CS_3_4',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Professional Ethics & Liabilities of Auditors',
          questionText: 'Can CA Vikram exercise a right of lien over the client’s statutory minute books and original share certificates for non-payment of audit fees?',
          options: [
            'Yes, under Section 171 of the Indian Contract Act, CAs have a general banker\'s lien over all documents.',
            'No, under decisions of the Ethical Standards Board (ESB) and Section 128 of the Companies Act, an auditor cannot exercise lien over books of accounts and records of a client for non-payment of fees.',
            'Yes, but only for up to 90 days.',
            'Yes, provided he gives 15 days advance notice to ROC.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under repeated rulings of the Ethical Standards Board (ESB) of ICAI and Section 128 of the Companies Act, 2013, an auditor cannot exercise a right of lien on the books of account and documents of a client for non-payment of professional fees.'
        },
        {
          id: 'AUD_CS_3_5',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Professional Ethics & Liabilities of Auditors',
          questionText: 'During the same financial year, CA Vikram signed 60 Tax Audit reports under Section 44AB(a)/(b) of the Income-tax Act, 1961, and additionally signed 8 Tax Audit reports under Section 44AD/44ADA presumptive taxation provisions. Has he violated the Council General Guidelines, 2008?',
          options: [
            'Yes, he exceeded the total ceiling of 60 tax audits by 8 audits and is guilty under Clause (1) of Part II of the Second Schedule.',
            'No, because audits conducted under Section 44AD, 44ADA, and 44AE are explicitly excluded from the ceiling limit of 60 tax audit assignments per partner/proprietor.',
            'Yes, because a sole proprietor is only allowed 30 tax audits per financial year.',
            'No, because there is no ceiling on tax audits under the CA Act, 1949.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under Chapter VI of Council General Guidelines, 2008, a member in practice can conduct a maximum of 60 tax audit assignments u/s 44AB per financial year. However, audits of accounts under Section 44AD, 44ADA, and 44AE (presumptive taxation schemes) are specifically excluded from this limit of 60.'
        }
      ]
    } as CaseScenario
  },

  {
    type: 'case',
    data: {
      id: 'AUD_CS_04',
      subjectId: 'Audit',
      chapterName: 'Group Audits',
      scenarioTitle: 'Group Audit (SA 600), Going Concern (SA 570) & Related Parties (SA 550) of Apex Global Holdings',
      scenarioText: 'M/s Rao & Associates are the Principal Statutory Auditors of Apex Global Holdings Ltd. (a listed parent company) for FY 2025-26. The consolidated financial statements include three subsidiaries:\n\n1. Subsidiary Alpha Ltd. (audited by component auditor M/s Mehta & Co.): Accounts for 28% of Group Revenue and 35% of Group Assets. M/s Mehta & Co. issued a Qualified Opinion on Alpha Ltd. due to non-provisioning of doubtful trade receivables of ₹18 Crores (Group Materiality is ₹10 Crores).\n2. Subsidiary Beta Ltd.: Faced severe regulatory revocation of its manufacturing license in February 2026. Beta Ltd.’s net worth has turned negative, and ₹45 Crores of term debt defaults on May 15, 2026 without any refinancing commitment. Management has adequately disclosed the facts in Note 38 to the Consolidated Financial Statements.\n3. During the audit of the Parent Company, the team discovered an undisclosed supply arrangement where ₹14 Crores of specialized spares were purchased at 40% above prevailing market rates from Zenith Enterprises, a partnership firm controlled by the spouse of Apex Global’s Chief Financial Officer.\n4. Management of Apex Global Holdings Ltd. refused to allow the engagement team to send external confirmation requests (SA 505) to its top 5 overseas debtors (representing ₹22 Crores) citing "commercial sensitivity during ongoing contract renegotiations".',
      subQuestions: [
        {
          id: 'AUD_CS_4_1',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Group Audits',
          questionText: 'Under SA 600 ("Using the Work of Another Auditor") and Schedule III/Companies Act provisions, how must M/s Rao & Associates deal with the ₹18 Crore unprovided doubtful receivables in Subsidiary Alpha Ltd.?',
          options: [
            'Ignore the qualification in the Consolidated Auditor\'s Report since M/s Mehta & Co. is solely responsible for Alpha Ltd.',
            'Since the ₹18 Crore misstatement exceeds Group Materiality (₹10 Crores), the Principal Auditor must evaluate its material effect on the Consolidated Financial Statements and modify the Consolidated Auditor\'s Report under SA 705, while clearly indicating the division of responsibility.',
            'Deduct ₹18 Crores from the audit fees of M/s Mehta & Co.',
            'Re-audit 100% of Alpha Ltd.\'s books personally before signing.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under SA 600 and ICAI Guidance Note on Audit of Consolidated Financial Statements, the principal auditor must consider significant findings of the component auditor. Where the component’s qualification is material to the group (₹18 Cr > ₹10 Cr Group Materiality), the principal auditor must modify the opinion on the Consolidated Financial Statements.'
        },
        {
          id: 'AUD_CS_4_2',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Completion and Review',
          questionText: 'Regarding the license revocation and debt default in Subsidiary Beta Ltd. where adequate disclosure is made in Note 38, what reporting action is required under SA 570 (Revised) if the Going Concern basis for the Group remains appropriate but a material uncertainty exists?',
          options: [
            'Include a separate section headed "Material Uncertainty Related to Going Concern" drawing attention to Note 38, and state that the auditor\'s opinion is not modified in respect of this matter.',
            'Express an Adverse Opinion on the entire Consolidated Financial Statements immediately.',
            'Include the disclosure only in the Other Information section under SA 720.',
            'Omit any reference in the audit report since Note 38 already discloses the matter.'
          ],
          correctOptionIndex: 0,
          explanation: 'Under SA 570 (Revised) Para 22, when the going concern basis is appropriate but a material uncertainty exists and adequate disclosure is made in the financial statements, the auditor shall express an unmodified opinion on that point and include a separate section under the heading "Material Uncertainty Related to Going Concern" drawing attention to the note.'
        },
        {
          id: 'AUD_CS_4_3',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Audit Evidence',
          questionText: 'Under SA 550 ("Related Parties"), how must the auditor treat the newly identified ₹14 Crore purchase arrangement with Zenith Enterprises (controlled by the CFO\'s spouse) at 40% above market rates?',
          options: [
            'Treat it as a routine normal course transaction requiring no further audit procedures.',
            'Promptly communicate the newly identified related party to the engagement team, evaluate why internal controls failed to identify/disclose it, treat the non-arm\'s length significant transaction outside normal course as a significant risk, and evaluate fraud risk indicators under SA 240.',
            'Only obtain an oral assurance from the CFO that the quality of spares was superior.',
            'Report it exclusively in the Secretarial Audit Report.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under SA 550 Para 22-24, if the auditor identifies arrangements or information that suggests the existence of related party relationships or transactions that management has not previously identified or disclosed, the auditor shall promptly communicate this to the engagement team, request management to identify all transactions with that party, inquire why controls failed, and evaluate implications for fraud under SA 240.'
        },
        {
          id: 'AUD_CS_4_4',
          type: 'case_sub',
          subjectId: 'Audit',
          chapterName: 'Audit Evidence',
          questionText: 'Regarding management\'s refusal to allow external confirmations to the top 5 overseas debtors (₹22 Crores) citing "commercial sensitivity", what is the mandatory procedure under SA 505?',
          options: [
            'Accept management\'s refusal without further work since it is a business decision.',
            'Inquire into the validity and reasonableness of management\'s refusal, evaluate the implications on the assessment of RMM (including risk of fraud), and perform alternative audit procedures; if refusal is unreasonable or alternative procedures cannot provide sufficient appropriate evidence, communicate with TCWG and modify the opinion under SA 705.',
            'Immediately resign from the statutory audit without communicating with TCWG.',
            'Send confirmations secretly without management\'s permission.'
          ],
          correctOptionIndex: 1,
          explanation: 'Under SA 505 Para 8-9, if management refuses to allow the auditor to send a confirmation request, the auditor shall inquire as to management’s reasons and seek audit evidence as to their validity and reasonableness, evaluate implications on RMM/fraud, and perform alternative audit procedures. If management’s refusal is unreasonable or alternative procedures do not yield sufficient appropriate audit evidence, the auditor shall communicate with TCWG and determine the implications for the audit opinion under SA 705.'
        }
      ]
    } as CaseScenario
  },
  ...NEW_AUDIT_ITEMS
];

