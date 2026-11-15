/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STANDARDS ON AUDITING & RISK ASSESSMENT (SAs 210-580, SQC 1 & SAE 3400)
 * Curated from Comprehensive Question Bank (CA Ram Harsha 2024 Edition)
 * Zero duplicate questions; adhering strictly to CA Final Educator guidelines.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_STANDARDS_RISK_THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    "id": "aud_sa501_paddy_01",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 501 - Physical Inventory Counting Impracticable & Alternative Procedures (Tasty Foods Ltd / Open Paddy Heaps)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Standards / May 2024 MTP S1 Q.1 (SA 501)",
    "question": "Tasty Foods Ltd. is engaged in milling and export of basmati rice. At year-end, physical inventory of paddy and rice stored in massive vertical silos and outdoor open heaps across 4 sprawling processing yards stands at \u20b985 crores (representing 65% of total current assets). The statutory auditor was unable to attend the physical inventory count on 31st March due to an unprecedented regional flash flood that damaged connecting bridges. Management refuses to facilitate a re-count on an alternative date, claiming physical counting is now impossible and requests an unmodified report based on book records. What are the auditor's duties and reporting consequences under SA 501 and SA 705?",
    "keyConcepts": [
      {
        "keyword": "SA 501 Audit Evidence - Specific Considerations",
        "category": "Standard",
        "description": "Standard governing attendance at physical inventory counting to obtain SAAE regarding existence and condition."
      },
      {
        "keyword": "Attendance Impracticable (Paragraph 7)",
        "category": "Provision",
        "description": "If attendance is impracticable, auditor shall perform alternative audit procedures (e.g. inspecting subsequent sale)."
      },
      {
        "keyword": "Alternative Procedures Infeasible / Denied",
        "category": "Rule",
        "description": "If not possible to obtain SAAE through alternative procedures, auditor must modify opinion under SA 705."
      },
      {
        "keyword": "Evaluation of Pervasiveness (Qualified vs Disclaimer)",
        "category": "Rule",
        "description": "Inventory constitutes 65% of current assets; pervasive limitation warrants a Disclaimer of Opinion."
      }
    ],
    "shortSuggestedAnswer": "| Situation Aspect | Statutory Mandate under SA 501 | Case Application (Tasty Foods Ltd) |\n| :--- | :--- | :--- |\n| **Attendance at Year-End Count** | Mandated unless impracticable | Impracticable due to flash floods destroying access routes |\n| **Recount on Alternative Date** | Mandate to perform count on alternative date and audit intervening transactions | **Refused by management**; no recount permitted |\n| **Alternative Audit Procedures** | Inspect subsequent sales, vendor delivery challans, processing conversion ratios | Inadequate to substantiate \u20b985 Cr bulk open-heap inventory |\n| **Impact on Audit Opinion** | Modification required under SA 705 | Inventory = **65% of Current Assets** (Material & Pervasive) |\n| **Required Opinion** | **Disclaimer of Opinion** (or Qualified if not pervasive) | **DISCLAIMER OF OPINION** under SA 705 |\n\n```\n[SA 501 Inventory Verification Protocol]\nAuditor Unable to Attend Year-End Physical Inventory Count\n                        \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                 \u25bc\nUnforeseen Circumstances           General Impracticability\n(Flash Floods / Bridge Collapse)    (Dangerous location / access cutoff)\n       \u2502                                 \u2502\n       \u25bc                                 \u25bc\nPerform Count on ALTERNATIVE DATE  Perform ALTERNATIVE PROCEDURES\n(Audit intervening transactions)   (Subsequent sales, gate passes)\n       \u2502                                 \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                        \u25bc\n    Management Refuses Recount AND\n    Alternative Procedures Fail to Yield SAAE\n                        \u2502\n                        \u25bc\n         MODIFICATION UNDER SA 705\n  (Disclaimer of Opinion due to Pervasiveness)\n```\n\n\u2022 **Statutory Principles under SA 501 & SA 705**:\n  1. **Physical Verification Duty**: Under SA 501, if inventory is material to financial statements, the auditor shall obtain SAAE regarding existence and condition by attending physical inventory count, unless impracticable.\n  2. **Impracticability & Alternative Dates**: Where attendance is unforeseen (e.g. flash floods), the auditor shall make or observe some physical counts on an alternative date, and perform audit procedures on intervening transactions.\n  3. **Refusal of Management & Inability to Obtain SAAE**:\n     - Management refused an alternative date count.\n     - Book records alone cannot provide SAAE for open-heap agricultural commodities prone to spoilage, shrinkage, and quality downgrades.\n  4. **Reporting Consequence**:\n     - Inventory represents 65% of current assets (\u20b985 Cr), which is both material and pervasive to the financial statements.\n     - The auditor **cannot issue an unmodified report** and must express a **DISCLAIMER OF OPINION** under SA 705.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 501 provisions on attendance impracticability, alternative date counting, and concluding with a Disclaimer of Opinion under SA 705 due to pervasiveness.",
      "criticalMisses": [
        "Issuing an unmodified opinion based on book records.",
        "Failing to evaluate the pervasiveness of 65% current assets leading to Disclaimer."
      ],
      "suggestions": [
        "Explain why book records are insufficient evidence for physical commodities like paddy silos and open heaps."
      ]
    }
  },
  {
    "id": "aud_sa540_spectrum_02",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 540 - Accounting Estimates & High Estimation Uncertainty: Telecom Spectrum Fees Provision (GSB Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Standards / Q.1 SA 540 & May 2024 RTP Q.7",
    "question": "GSB Ltd., a major telecom operator, is engaged in complex ongoing litigation with the Department of Telecommunications (DoT) regarding definition of Adjusted Gross Revenue (AGR) and spectrum usage charges. Management recognized a provision of \u20b92,500 crores based on an internal legal interpretation, whereas the DoT claim stands at \u20b97,800 crores. What audit procedures must the statutory auditor perform under SA 540 (Revised) to evaluate this accounting estimate involving high estimation uncertainty?",
    "keyConcepts": [
      {
        "keyword": "SA 540 (Revised) Accounting Estimates",
        "category": "Standard",
        "description": "Auditing Accounting Estimates and Related Disclosures."
      },
      {
        "keyword": "High Estimation Uncertainty",
        "category": "Provision",
        "description": "Estimates with high sensitivity to assumptions, complex models, or unresolved litigation outcomes."
      },
      {
        "keyword": "Subsequent Events Review",
        "category": "Provision",
        "description": "Reviewing events occurring up to the date of the auditor's report (e.g. court rulings, interim orders)."
      },
      {
        "keyword": "Independent Estimate / Auditor's Point Estimate",
        "category": "Rule",
        "description": "Developing an independent point estimate or range to evaluate management's point estimate."
      }
    ],
    "shortSuggestedAnswer": "| Audit Objective (SA 540) | Specific Audit Verification Procedures for GSB Ltd. |\n| :--- | :--- |\n| **1. Understand Management's Process** | Inquire into methods, assumptions, models, and data used by management to compute the \u20b92,500 Cr provision. |\n| **2. Review of Subsequent Events** | Inspect court proceedings, Supreme Court interim directions, and DoT demand notices issued up to the report date. |\n| **3. Test Method of Measurement** | Evaluate whether the measurement method complies with Ind AS 37 (Provisions, Contingent Liabilities and Assets). |\n| **4. External Legal Expert Evidence** | Obtain direct written confirmations from the external senior legal counsels representing the company in the AGR dispute. |\n| **5. Auditor's Independent Range** | Develop an independent auditor's point estimate or range to evaluate management\u2019s estimate. |\n| **6. Disclosures on Estimation Uncertainty** | Ensure financial statements disclose the significant assumptions, sensitivity analysis, and high estimation uncertainty. |\n\n```\n[Auditor's Evaluation of High Estimation Uncertainty under SA 540]\n              Identify Significant Accounting Estimate\n         (Telecom Spectrum AGR Provision: \u20b92,500 Cr vs \u20b97,800 Cr)\n                              \u2502\n                              \u25bc\n        Assess Estimation Uncertainty & Risk of Material Misstatement\n                              \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                      \u25bc                      \u25bc\nTest Subsequent Events   Test Management Assumptions  Develop Auditor's\n(Court judgments,        & Models (Ind AS 37)         Independent Range\n DoT demand revisions)   (Consult Legal Experts)      (Point Estimate)\n       \u2502                      \u2502                      \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                              \u25bc\n          Evaluate Adequacy of Financial Statement Disclosures\n        (Range of outcomes, sensitivity analysis, Key Audit Matter)\n```\n\n\u2022 **Statutory Principles under SA 540 (Revised)**:\n  1. **Identify Significant Risk**: An estimate dependent on ongoing complex regulatory litigation has high estimation uncertainty, automatically triggering significant risk.\n  2. **Evaluate Management's Expert / Assumptions**: Review whether internal legal interpretations reflect objective jurisprudence or management bias. Obtain independent legal opinions.\n  3. **Disclosures**: If estimation uncertainty cannot be eliminated, verify that the notes transparently describe the underlying dispute, the financial exposure (\u20b97,800 Cr), and the sensitivity of the \u20b92,500 Cr provision.\n  4. **Key Audit Matter**: Consider communicating this issue as a **Key Audit Matter (KAM)** under SA 701.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 540 (Revised) procedures for high estimation uncertainty: testing assumptions, consulting independent legal counsel, developing auditor ranges, and verifying Ind AS 37 disclosures.",
      "criticalMisses": [
        "Relying solely on management's representation without independent legal confirmation.",
        "Failing to mention sensitivity analysis and estimation uncertainty disclosures."
      ],
      "suggestions": [
        "Always highlight that high estimation uncertainty issues are prime candidates for Key Audit Matters (SA 701)."
      ]
    }
  },
  {
    "id": "aud_sqc1_retention_03",
    "subjectId": "Audit",
    "chapterName": "Quality Control",
    "title": "SQC 1 & SA 230 - Audit Documentation: Assembly of Final File (60 Days) & Minimum Retention Period (7 Years)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Standards / May 2024 MTP S1 Q.4 (SQC 1 & SA 230)",
    "question": "M/s TPX & Co., a firm of Chartered Accountants, completed the statutory audit of Zenon Ltd. for FY 2021-22 and issued their audit report on 28th June 2022. The audit partner instructed the team to archive the electronic and physical audit files within 120 days from the report date and decided to retain the working papers for 5 years in line with the client's internal record retention policy. Examine the propriety of the partner's instructions in light of SQC 1 and SA 230.",
    "keyConcepts": [
      {
        "keyword": "SQC 1 Quality Control for Firms",
        "category": "Standard",
        "description": "Standard on Quality Control governing firm-level quality control policies and documentation."
      },
      {
        "keyword": "60-Day File Assembly Limit",
        "category": "Rule",
        "description": "Assembly of final audit file must be completed not more than 60 days after the date of the auditor's report."
      },
      {
        "keyword": "Minimum 7-Year Retention Period",
        "category": "Rule",
        "description": "Retention period for audit engagements is no shorter than seven years from the date of the auditor's report."
      },
      {
        "keyword": "SA 230 Audit Documentation",
        "category": "Standard",
        "description": "Standard governing auditor's responsibility to prepare and maintain audit documentation."
      }
    ],
    "shortSuggestedAnswer": "| Operational Parameter | Partner's Instruction | Statutory Rule (SQC 1 & SA 230) | Evaluation & Legality |\n| :--- | :--- | :--- | :--- |\n| **File Assembly Period** | 120 Days from report date | Not more than **60 DAYS** after report date | **DEFECTIVE / NON-COMPLIANT** (Exceeds limit by 60 days) |\n| **Retention of Working Papers** | 5 Years (client policy) | No shorter than **7 YEARS** from report date | **DEFECTIVE / NON-COMPLIANT** (Deficit of 2 years) |\n\n```\n[SQC 1 & SA 230 Audit Documentation Timeframes]\nAudit Report Signed & Issued (Day 0)\n                 \u2502\n                 \u25bc\n     Within MAXIMUM 60 DAYS:\n  Complete Assembly of Final Audit File\n  (Purely administrative; no new tests added)\n                 \u2502\n                 \u25bc\n     Retain Working Paper Files for\n     NO SHORTER THAN 7 YEARS\n     from the Date of Auditor's Report\n```\n\n\u2022 **Statutory Principles under SQC 1 and SA 230**:\n  1. **Assembly of Final Audit File**:\n     - Under SQC 1 and SA 230, the firm must establish policies for the timely assembly of audit files.\n     - The prescribed time limit within which to complete the assembly of the final audit file is **ordinarily not more than 60 days** after the date of the auditor\u2019s report.\n     - An instruction allowing 120 days directly breaches SQC 1.\n  2. **Retention Period**:\n     - Under SQC 1, the retention period for audit engagements is **no shorter than seven (7) years** from the date of the auditor\u2019s report (or group auditor's report).\n     - Client internal policies or shorter tax records rules cannot supersede the mandatory 7-year regulatory requirement.\n  3. **Conclusion**:\n     - Both instructions given by the partner are **improper and violative of SQC 1 and SA 230**.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying the strict statutory limits under SQC 1: 60 days for file assembly and minimum 7 years for document retention.",
      "criticalMisses": [
        "Confusing the 60-day assembly limit with retention.",
        "Accepting the client's 5-year retention policy over the mandatory 7-year SQC 1 rule."
      ],
      "suggestions": [
        "State clearly that file assembly is an administrative process that does not involve performing new audit procedures."
      ]
    }
  },
  {
    "id": "aud_sae3400_pfi_04",
    "subjectId": "Audit",
    "chapterName": "Prospective Financial Information and Other Assurance Services",
    "title": "SAE 3400 - Examination of Prospective Financial Information: Forecast vs Projection & Assurance Level",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Standards / May 2024 MTP S2 Q.17 (SAE 3400)",
    "question": "A client requests a Chartered Accountant to examine and report on Prospective Financial Information (PFI) to be submitted to a commercial bank for securing project finance for a new synthetic diamond plant. (a) Distinguish between a 'Forecast' and a 'Projection' under SAE 3400 with practical illustrations; (b) What type of assurance is expressed by the practitioner in an engagement to examine PFI, and why is positive reasonable assurance prohibited?",
    "keyConcepts": [
      {
        "keyword": "SAE 3400 Prospective Financial Information",
        "category": "Standard",
        "description": "Standard on Assurance Engagements governing the examination of prospective financial information."
      },
      {
        "keyword": "Forecast (Best-Estimate Assumptions)",
        "category": "Provision",
        "description": "PFI prepared on the basis of assumptions as to future events which management expects to take place."
      },
      {
        "keyword": "Projection (Hypothetical Assumptions)",
        "category": "Provision",
        "description": "PFI prepared on the basis of hypothetical assumptions about future events and management actions ('what-if')."
      },
      {
        "keyword": "Negative Assurance (Moderate Level)",
        "category": "Rule",
        "description": "Practitioner provides only negative assurance; positive assurance prohibited due to uncertain future events."
      }
    ],
    "shortSuggestedAnswer": "| Dimension | Forecast (SAE 3400) | Projection (SAE 3400) |\n| :--- | :--- | :--- |\n| **Underlying Assumptions** | Based on **Best-Estimate Assumptions** (events management expects to occur). | Based on **Hypothetical Assumptions** ('what-if' scenarios not necessarily expected). |\n| **Purpose** | To reflect anticipated future financial position based on current realistic trajectory. | To illustrate possible consequences of hypothetical future actions/events. |\n| **Practical Illustration** | Budgeted cash flows for next 12 months assuming continuation of current orders and known inflation. | Projected revenue assuming government provides an unannounced 25% production subsidy. |\n\n```\n[Prospective Financial Information Assurance Level (SAE 3400)]\n                     Examination of PFI\n                             \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                           \u25bc\nNEGATIVE ASSURANCE (Moderate Level)         POSITIVE ASSURANCE (High Level)\n\u2022 \"Nothing has come to our attention        \u2022 \"Financials show a true and fair view\n   causing us to believe assumptions           of future operations\"\n   do not provide reasonable basis\"                \u2502\n       \u2502                                           \u25bc\n       \u25bc                                  STRICTLY PROHIBITED\nPERMITTED & MANDATED                      (Future cannot be verified with\nunder SAE 3400                             certainty; unreasonable reliance)\n```\n\n\u2022 **Assurance Framework under SAE 3400**:\n  1. **Nature of Assurance**: The practitioner provides a **moderate level of assurance**, expressed in the form of **Negative Assurance**.\n  2. **Wording of Opinion**: *'Based on our examination of the evidence supporting the assumptions, nothing has come to our attention which causes us to believe that these assumptions do not provide a reasonable basis for the 'forecast/projection'.' *\n  3. **Why Positive Assurance is Prohibited**:\n     - PFI relates to events and actions that have not yet occurred and may not occur.\n     - Even if evidence is available supporting assumptions, such evidence is itself future-oriented and speculative.\n     - An auditor cannot express an opinion as to whether the results shown in the prospective financial information will actually be achieved.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on clearly distinguishing Forecast (best-estimate) from Projection (hypothetical) with practical examples, and explaining why SAE 3400 mandates negative assurance and prohibits positive reasonable assurance.",
      "criticalMisses": [
        "Confusing Forecast with Projection.",
        "Suggesting that an auditor can give a positive true-and-fair opinion on future projections."
      ],
      "suggestions": [
        "Remember: Forecast = What management EXPECTS; Projection = What MIGHT happen under hypothetical assumptions."
      ]
    }
  },
  {
    "id": "aud_sa240_override_05",
    "subjectId": "Audit",
    "chapterName": "General Auditing Principles and Auditors Responsibilities",
    "title": "SA 240 - Management Override of Controls & Testing Journal Entries at Year-End (Quick Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Standards / Q.1 SA 240 & May 2024 RTP Q.2",
    "question": "During the statutory audit of Quick Ltd. for FY 2021-22, the auditor identified that the company met its earnings target for the year only due to several large, manual journal entries passed during the closing weekend of March 31. Management argues that standard internal controls over sales and purchases are robust, and journal entries are normal accounting adjustments. What audit procedures are mandatorily required under SA 240 to respond to the risk of management override of controls?",
    "keyConcepts": [
      {
        "keyword": "SA 240 The Auditor's Responsibilities Relating to Fraud",
        "category": "Standard",
        "description": "Standard governing detection and response to fraud risks, particularly management override."
      },
      {
        "keyword": "Management Override of Controls",
        "category": "Provision",
        "description": "A pervasive fraud risk present in all entities that requires mandatory testing procedures."
      },
      {
        "keyword": "Testing Journal Entries (Paragraph 32)",
        "category": "Rule",
        "description": "Mandatory testing of appropriateness of journal entries recorded in general ledger and other adjustments."
      },
      {
        "keyword": "Review of Accounting Estimates for Bias",
        "category": "Rule",
        "description": "Reviewing estimates and retrospective review of prior period management judgments."
      }
    ],
    "shortSuggestedAnswer": "| Risk Area (SA 240) | Mandatory Audit Procedures to Address Management Override |\n| :--- | :--- |\n| **1. Journal Entries & Other Adjustments** | \u2022 Inquire of individuals involved in financial reporting regarding inappropriate or unusual activity.<br>\u2022 Select journal entries made at the **end of the reporting period** (closing weekend manual entries).<br>\u2022 Focus on entries made to unrelated, unusual, or seldom-used accounts.<br>\u2022 Examine entries made by individuals who do not normally make journal entries. |\n| **2. Accounting Estimates** | \u2022 Evaluate whether judgments and decisions made by management in making estimates indicate **management bias**.<br>\u2022 Perform a **retrospective review** of management judgments reflected in prior period estimates. |\n| **3. Significant Unusual Transactions** | \u2022 For significant transactions outside the normal course of business, evaluate whether the business rationale suggests fraudulent financial reporting or asset misappropriation. |\n\n```\n[SA 240 Mandatory Response to Management Override of Controls]\n             Pervasive Risk: Management Override of Controls\n                                   \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                           \u25bc                           \u25bc\nTest Journal Entries         Review Accounting Estimates  Examine Unusual Transactions\n\u2022 Year-end closing entries   \u2022 Evaluate bias in current   \u2022 Outside normal course\n\u2022 Unusual accounts             period estimates           \u2022 Evaluate commercial\n\u2022 Non-standard timings       \u2022 Perform retrospective        rationale / substance\n\u2022 Post-closing adjustments     review of prior estimates\n```\n\n\u2022 **Statutory Analysis**:\n  - Management override of controls is an inherent risk of fraud present in all entities regardless of control effectiveness.\n  - The auditor **must not accept** management's justification that robust routine controls negate the need to test manual journal entries.\n  - The auditor must test the business rationale, source documentation, authorization, and underlying calculations of the year-end closing entries passed on March 31.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on articulating the 3 mandatory procedures under SA 240 Paragraph 32: journal entry testing, review of accounting estimates for bias, and scrutiny of significant unusual transactions.",
      "criticalMisses": [
        "Accepting the client's argument that routine controls prevent override.",
        "Failing to detail specific criteria for journal entry selection (end of period, unusual accounts)."
      ],
      "suggestions": [
        "State explicitly that SA 240 treats management override of controls as a mandatory significant fraud risk across all audits."
      ]
    }
  }
];
