import json

standards_data = [
  # 1-10 are in place, let's add 11-60
  {
    "id": "aud_std_full_11",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 501 - Inventory Physical Counting Attendance & Substituted Procedures at Alternative Date",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 5 / Nov 2022 Exam & May 2024 RTP (SA 501)",
    "question": "M/s Sterling Ltd. scheduled its physical inventory counting on 31st March 2023 at its main chemical refinery. The statutory auditor was prevented from attending due to a sudden localized flood and administrative curfew. The inventory comprises 38% of the total assets. Management refused to permit counting at an alternative date, arguing that year-end inventory cannot be verified retrospectively. What are the auditor's statutory duties under SA 501 and reporting implications under SA 705?",
    "keyConcepts": [
      { "keyword": "SA 501 Audit Evidence - Specific Considerations for Selected Items", "category": "Standard", "description": "Mandatory attendance at physical inventory counting if inventory is material." },
      { "keyword": "Physical Counting at Alternative Date", "category": "Rule", "description": "If attendance is impracticable, auditor shall perform audit procedures at an alternative date and perform roll-forward/roll-back." },
      { "keyword": "Substituted Audit Procedures", "category": "Provision", "description": "Inspect subsequent sales, purchases, and production records if alternative counting cannot be performed." },
      { "keyword": "Scope Limitation (SA 705)", "category": "Rule", "description": "Inability to obtain SAAE regarding material and pervasive inventory warrants Qualified or Disclaimer of Opinion." }
    ],
    "shortSuggestedAnswer": """| Situation under SA 501 | Mandatory Auditor Action | Management Contention / Case Fact |
| :--- | :--- | :--- |
| **Attendance Impracticable (Floods/Curfew)** | Perform inventory counts on an **alternative date** and perform audit procedures on intervening transactions (roll-back / roll-forward). | Management's claim that counting cannot be done retrospectively is **legally and technically incorrect**. |
| **Alternative Procedures Refused / Infeasible** | Perform alternative procedures (e.g. inspect subsequent cash realization, sales invoices, production records, supplier confirmations). | If alternative procedures are impossible, it constitutes a **Limitation on Scope**. |
| **Reporting Consequence (SA 705)** | Inventory represents 38% of total assets (Material & Pervasive). Inability to obtain SAAE requires **Disclaimer of Opinion** (or Qualified Opinion if not pervasive). | Auditor must issue a **Disclaimer of Opinion** if pervasive, or **Qualified Opinion** if confined to inventory. |

```
[SA 501 Physical Inventory Attendance Workflow]
                 Inventory is Material to Financial Statements
                                      │
                                      ▼
         Is Auditor's Attendance at Physical Count Impracticable?
                          (Floods, Curfews, War)
                                      │
                                     YES
                                      │
                                      ▼
                PERFORM COUNT AT AN ALTERNATIVE DATE
          • Perform physical count on alternative date
          • Perform Roll-Back / Roll-Forward procedures
            on intervening inventory transactions
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        ▼                                                           ▼
Alternative Count Feasible                                Management Refuses Count
& SAAE Obtained                                          or Alternative Impossible
        │                                                           │
        ▼                                                           ▼
Clean Opinion on Inventory                                  SCOPE LIMITATION
                                                      (Inventory is 38% of Assets)
                                                                    │
                                                                    ▼
                                                            SA 705 REPORTING:
                                                      QUALIFIED / DISCLAIMER OF OPINION
```

• **Statutory Principles under SA 501**:
  1. **Alternative Date Count**: If attendance at physical inventory counting is impracticable, the auditor shall make or observe some physical counts on an alternative date, and perform audit procedures on intervening transactions.
  2. **Intervening Roll-Forward / Roll-Back**: The auditor tests intervening purchases, sales, and production logs to reconcile alternative date balances back to year-end.
  3. **Reporting under SA 705**: If it is not possible to obtain SAAE regarding existence and condition of inventory, the auditor shall modify the opinion in accordance with SA 705 due to a scope limitation.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 501 alternative date count and roll-forward/roll-back requirements, followed by SA 705 scope limitation reporting (Qualified/Disclaimer).",
      "criticalMisses": [
        "Accepting management's excuse that retrospective counting is impossible.",
        "Failing to mention roll-back or roll-forward procedures on intervening transactions."
      ],
      "suggestions": [
        "Distinguish between mere inconvenience (not an excuse under SA 501) vs genuine impracticability (floods, curfews)."
      ]
    }
  },
  {
    "id": "aud_std_full_12",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 505 - External Confirmations: Positive vs Negative Confirmations & Management Refusal to Send Requests",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 5 / May 2023 Exam & Nov 2023 MTP (SA 505)",
    "question": "During the statutory audit of Zen Traders Ltd., the auditor selected 15 major trade receivables totaling ₹28 crores for positive external confirmation. Management refused to allow the auditor to send confirmation requests to 5 customers (accounting for ₹18 crores), claiming commercial sensitivity and threatened loss of business relationships. Management instead provided internal customer account statements stamped by the sales manager. (a) Evaluate management's refusal under SA 505; (b) What sequential steps must the auditor take?",
    "keyConcepts": [
      { "keyword": "SA 505 External Confirmations", "category": "Standard", "description": "Use of external confirmation procedures to obtain audit evidence." },
      { "keyword": "Management Refusal to Allow Confirmation", "category": "Rule", "description": "Inquire into reasons, seek audit evidence about validity, and evaluate implications on RMM and fraud." },
      { "keyword": "Alternative Audit Procedures", "category": "Provision", "description": "Examine subsequent cash receipts, shipping documents, and sales contracts." },
      { "keyword": "Scope Limitation & Communication to TCWG", "category": "Rule", "description": "If refusal is unreasonable or alternative evidence unavailable, communicate to TCWG and modify opinion under SA 705." }
    ],
    "shortSuggestedAnswer": """| Evaluation Stage | SA 505 Statutory Requirement | Case Application (Zen Traders Ltd.) |
| :--- | :--- | :--- |
| **Inquire into Reasons for Refusal** | Inquire as to management's reasons for refusal and seek audit evidence as to their validity and reasonableness. | Commercial sensitivity is a generic excuse; auditor must scrutinize correspondence and assess fraud risk. |
| **Evaluate Fraud Risk & Control Environment** | Evaluate implications of refusal on assessed risks of material misstatement, including fraud risk and other audit procedures. | Refusal to confirm 64% of sample (₹18 Cr) raises a **severe red flag for fictitious revenues**. |
| **Perform Alternative Audit Procedures** | Design and perform alternative audit procedures (e.g. examine subsequent bank receipts, signed delivery challans, customer orders). | Internal statements stamped by sales manager do not constitute independent SAAE. |
| **If Refusal Unreasonable / No Evidence** | If refusal is unreasonable or alternative procedures do not provide SAAE, communicate to TCWG and modify opinion under SA 705. | Management's refusal is unjustified. Issue **Qualified or Disclaimer of Opinion** under SA 705. |

```
[SA 505 Management Refusal Decision Tree]
            Management Refuses to Allow External Confirmation
                                   │
                                   ▼
        1. Inquire into Management's Reasons for Refusal
        2. Seek Audit Evidence Regarding Validity of Reasons
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
Refusal is REASONABLE                           Refusal is UNREASONABLE
(e.g., ongoing legal dispute)                  (Generic commercial sensitivity)
       │                                                       │
       ▼                                                       ▼
Perform Alternative Procedures                  Severe Indicator of Fraud Risk
(Subsequent cash, shipping docs)                               │
       │                                                       ▼
       ├─────────────────────────────────────────┐   Communicate to TCWG
       ▼                                         ▼             │
Alternative SAAE Obtained?                       │             ▼
       │                                         │   SCOPE LIMITATION (SA 705)
 ┌─────┴─────┐                                   │   QUALIFIED / DISCLAIMER
 ▼           ▼                                   │
YES         NO ──────────────────────────────────┘
Clean    Scope Limitation
```

• **Statutory Principles under SA 505**:
  1. **Refusal Protocol**: If management refuses to allow the auditor to send a confirmation request, the auditor shall:
     - Inquire as to management's reasons for the refusal, and seek audit evidence as to their validity and reasonableness.
     - Evaluate the implications of management's refusal on the auditor's assessment of the relevant risks of material misstatement, including the risk of fraud, and on the nature, timing, and extent of other audit procedures.
     - Perform alternative audit procedures designed to obtain relevant and reliable audit evidence.
  2. **Unreasonable Refusal**: If the auditor concludes that management's refusal to allow the auditor to send a confirmation request is unreasonable, or the auditor is unable to obtain relevant and reliable audit evidence from alternative audit procedures, the auditor shall **communicate with TCWG** and **determine the implications for the audit and the auditor's opinion in accordance with SA 705**.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on systematically applying the SA 505 protocol: inquire reasons, evaluate fraud risk, perform alternative procedures, and modify opinion under SA 705 if refusal is unreasonable.",
      "criticalMisses": [
        "Accepting internal sales-stamped statements as an adequate substitute for external confirmation.",
        "Failing to evaluate the fraud implications of management's refusal."
      ],
      "suggestions": [
        "Explicitly note that positive confirmation requires a direct written response from the third party to the auditor."
      ]
    }
  },
  {
    "id": "aud_std_full_13",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 510 - Initial Audit Engagements: Opening Balances Verification & Predecessor Auditor Modification",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Ch 5 / Nov 2021 Exam & May 2024 MTP S2 (SA 510)",
    "question": "CA V was appointed as the statutory auditor of Pioneer Ltd. for FY 2022-23. The financial statements for FY 2021-22 were audited by another firm who issued a Qualified Opinion due to unverified non-moving obsolete inventory of ₹4.5 crores. During the current year, CA V observed that the same inventory is still carried at ₹4.5 crores without any impairment provision. What audit procedures must CA V perform regarding opening balances under SA 510, and what are the reporting obligations?",
    "keyConcepts": [
      { "keyword": "SA 510 Initial Audit Engagements - Opening Balances", "category": "Standard", "description": "Auditor's responsibility relating to opening balances in an initial audit engagement." },
      { "keyword": "Procedures for Opening Balances", "category": "Rule", "description": "Read most recent FS and predecessor report, determine whether prior period closing balances were correctly brought forward." },
      { "keyword": "Consistency of Accounting Policies", "category": "Provision", "description": "Verify whether accounting policies reflected in opening balances have been consistently applied." },
      { "keyword": "Reporting Duty on Predecessor Qualification", "category": "Rule", "description": "If predecessor qualification remains relevant and material to current period FS, auditor SHALL modify current period opinion." }
    ],
    "shortSuggestedAnswer": """| Audit Focus Area | Statutory Requirement under SA 510 | Case Application (Pioneer Ltd.) |
| :--- | :--- | :--- |
| **Audit of Opening Balances** | Determine whether prior period closing balances have been correctly brought forward and reflect appropriate accounting policies. | Prior year inventory carried forward at ₹4.5 crores without write-down to Net Realisable Value (NRV). |
| **Evaluation of Predecessor Qualification** | Determine whether the matter giving rise to the modification in predecessor's report remains relevant and material to the current period. | The obsolete inventory qualification remains **unresolved, relevant, and material** to current period profits and assets. |
| **Reporting Requirement under SA 705** | If opening balances contain a misstatement that materially affects the current period's financial statements, auditor shall express a **Qualified or Adverse Opinion**. | CA V **shall modify the current period audit opinion** (Qualified Opinion u/s SA 705). |

```
[SA 510 Initial Audit Engagement Evaluation Framework]
              Initial Audit Engagement (New Auditor Appointed)
                                      │
                                      ▼
           Review Predecessor Auditor's Report for Prior Year
             (Predecessor issued Qualified Opinion on ₹4.5 Cr
                  obsolete inventory not written down)
                                      │
                                      ▼
           Has the Matter Been Corrected in Current Year FS?
                                      │
       ┌──────────────────────────────┴──────────────────────────────┐
       ▼                                                             ▼
      YES                                                           NO
Matter Resolved through Write-down                   Obsolete Inventory Still Carried
or Provision in Current Period                        at Cost (₹4.5 Cr) without Provision
       │                                                             │
       ▼                                                             ▼
Unmodified Opinion with optional                     MANDATORY MODIFICATION UNDER SA 705
Other Matter paragraph (SA 706)                      QUALIFIED / ADVERSE OPINION
                                                     (Misstatement affects Current Period)
```

• **Statutory Principles under SA 510**:
  1. **Core Verification Duty**: The auditor shall obtain SAAE about whether:
     - Opening balances contain misstatements that materially affect the current period's financial statements.
     - Appropriate accounting policies reflected in the opening balances have been consistently applied.
  2. **Predecessor's Modified Opinion**: If the predecessor auditor's opinion regarding the prior period's financial statements included a modification to the auditor's opinion that remains relevant and material to the current period's financial statements, the auditor **shall modify the auditor's opinion on the current period's financial statements in accordance with SA 705 and SA 510**.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 510 paragraph 13 rule: mandatory modification of current period opinion when predecessor's modification remains relevant and material.",
      "criticalMisses": [
        "Assuming that the new auditor can ignore the predecessor's qualification because it pertains to prior year.",
        "Failing to link uncorrected opening balance misstatements to SA 705 modification."
      ],
      "suggestions": [
        "Clarify that an Other Matter paragraph under SA 706 stating that prior year was audited by another firm does NOT replace the duty to modify the opinion for uncorrected misstatements."
      ]
    }
  },
  {
    "id": "aud_std_full_14",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 530 - Audit Sampling: Sample Design, Tolerable Misstatement, Sampling Risk & Projection",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 5 / Nov 2020 Exam & May 2024 RTP (SA 530)",
    "question": "In the audit of Sun Ltd., the statutory auditor tested a sample of 50 accounts from a population of 2,000 trade debtors (Total Population Value: ₹40 crores; Sample Value: ₹8 crores). The audit team identified an uncorrected overstatement of ₹40 lakhs in the sample. The tolerable misstatement set for the debtor population was ₹1.5 crores. The engagement senior concluded that since the detected misstatement of ₹40 lakhs is well below tolerable misstatement (₹1.5 Cr), no further audit action or extrapolation is necessary. Critically examine the senior's conclusion under SA 530.",
    "keyConcepts": [
      { "keyword": "SA 530 Audit Sampling", "category": "Standard", "description": "Auditor's use of statistical and non-statistical sampling when designing and selecting the audit sample." },
      { "keyword": "Mandatory Projection of Misstatements", "category": "Rule", "description": "For tests of details, the auditor SHALL project misstatements found in the sample to the population." },
      { "keyword": "Projected Misstatement vs Tolerable Misstatement", "category": "Provision", "description": "Compare projected misstatement plus anomalous misstatement against tolerable misstatement." },
      { "keyword": "Sampling Risk Evaluation", "category": "Provision", "description": "When projected misstatement approaches tolerable misstatement, sampling risk is high, requiring expanded testing." }
    ],
    "shortSuggestedAnswer": """| Sampling Parameter | Value in Sun Ltd. | Mathematical / Statutory Analysis under SA 530 |
| :--- | :--- | :--- |
| **Total Population (Trade Debtors)** | ₹40.00 Crores (2,000 accounts) | Target audit population subject to sampling. |
| **Sample Tested** | ₹8.00 Crores (50 accounts) | 20% of population value examined. |
| **Sample Misstatement Found** | ₹40.00 Lakhs (₹0.40 Crore) | 5% error rate in sample (₹0.40 Cr / ₹8.00 Cr). |
| **Projected Misstatement (Extrapolation)** | **₹2.00 Crores** | Formula: $(₹0.40 \text{ Cr} / ₹8.00 \text{ Cr}) \times ₹40.00 \text{ Cr} = \mathbf{₹2.00 \text{ Crores}}$. |
| **Tolerable Misstatement (TM)** | ₹1.50 Crores | Maximum acceptable error set by auditor. |
| **Comparison & Decision** | **Projected (₹2.00 Cr) > TM (₹1.50 Cr)** | **Senior's conclusion is FLAWED & WRONG**. Population is materially misstated. |

```
[SA 530 Sample Evaluation & Projection Protocol]
             Audit Sample Tested on Tests of Details
         (Sample: ₹8 Cr; Misstatement Found: ₹40 Lakhs)
                               │
                               ▼
        MANDATORY PROJECTION TO ENTIRE POPULATION (SA 530.14)
   Projected Misstatement = (Sample Error / Sample Value) × Total Population
                          = (₹0.40 Cr / ₹8.00 Cr) × ₹40.00 Cr
                          = ₹2.00 CRORES
                               │
                               ▼
        Compare Projected Misstatement against Tolerable Misstatement
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
Projected Misstatement < TM                    Projected Misstatement > TM
(Acceptable, adjust for sampling risk)        (₹2.00 Cr > ₹1.50 Cr TM)
                                                       │
                                                       ▼
                                            POPULATION CANNOT BE ACCEPTED
                                            • Request management to investigate
                                            • Perform expanded / alternative audit tests
                                            • If unadjusted: Modify opinion (SA 705)
```

• **Statutory Principles under SA 530**:
  1. **Mandatory Projection**: Under SA 530 paragraph 14, for tests of details, the auditor **shall project misstatements found in the sample to the population** to obtain a broad view of the scale of misstatement.
  2. **Failure to Project**: The engagement senior committed a gross error by comparing the raw sample error (₹40 lakhs) directly against tolerable misstatement (₹1.5 crores).
  3. **Population Rejection**: Because the projected misstatement of **₹2.00 crores exceeds the tolerable misstatement of ₹1.50 crores**, the auditor cannot accept the population as free from material misstatement.
  4. **Correct Action**: The auditor must request management to investigate the identified misstatements and adjust the books, or extend the audit sample size, and evaluate the need to modify the audit report under SA 705.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on performing mathematical projection of sample misstatement ((0.4/8)*40 = 2.0 Cr) and comparing projected misstatement against tolerable misstatement (1.5 Cr) under SA 530.",
      "criticalMisses": [
        "Failing to project the sample misstatement to the population.",
        "Agreeing with the senior that 40 lakhs is below 1.5 crores without projection."
      ],
      "suggestions": [
        "State the exact projection formula: (Sample Error / Sample Value) * Total Population Value."
      ]
    }
  },
  {
    "id": "aud_std_full_15",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 550 - Related Parties: Undisclosed Related Party Transactions & Management Override",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 5 / Nov 2022 Exam & May 2024 MTP S1 (SA 550)",
    "question": "During the audit of Zenith Infra Ltd., the auditor discovered an unsecured interest-free loan of ₹15 crores granted to Orbit Developers LLP. Orbit's designated partner is the son-in-law of Zenith's Managing Director. Management had not disclosed Orbit Developers LLP in the list of related parties provided to the auditor, claiming that a son-in-law does not fall under the definition of 'relative' under Section 2(77) of Companies Act, 2013, and therefore Ind AS 24 disclosure is unnecessary. Detail the auditor's statutory duties under SA 550 upon identifying undisclosed related party transactions.",
    "keyConcepts": [
      { "keyword": "SA 550 Related Parties", "category": "Standard", "description": "Auditor's responsibilities regarding related party relationships and transactions." },
      { "keyword": "Definition of Related Party under Ind AS 24", "category": "Provision", "description": "Includes close members of the family who may be expected to influence or be influenced by that individual." },
      { "keyword": "Procedures on Identifying Undisclosed Related Parties", "category": "Rule", "description": "Promptly communicate to team, request management to identify all transactions, inquire why controls failed." },
      { "keyword": "Reconsider Fraud Risk & Re-evaluate Control Environment", "category": "Provision", "description": "Non-disclosure indicates significant fraud risk and management override of internal controls." }
    ],
    "shortSuggestedAnswer": """| Aspect | Legal & Accounting Requirement | Application to Zenith Infra Ltd. |
| :--- | :--- | :--- |
| **Applicable Financial Reporting Framework** | Under **Ind AS 24**, related parties include **close members of the family** of KMP who may be expected to influence or be influenced by that person in their dealings. | Son-in-law falls squarely under close family members under Ind AS 24, regardless of Section 2(77) omissions. |
| **Terms of Transaction (Arm's Length)** | Unsecured interest-free loan of ₹15 crores granted without commercial justification. | Transaction is **outside normal course of business** and not on arm's length terms; high fraud risk. |
| **Internal Control Implication** | Management withheld the entity from the related party register provided to the auditor. | Demonstrates a **failure or intentional override of internal controls** regarding related party disclosures. |

```
[SA 550 Protocol: Undisclosed Related Party Identified]
        Auditor Identifies Previously Undisclosed Related Party
       (₹15 Cr interest-free loan to MD's son-in-law's partnership)
                                  │
                                  ▼
      1. PROMPTLY COMMUNICATE relevant info to other team members
                                  │
                                  ▼
      2. REQUEST MANAGEMENT TO IDENTIFY ALL TRANSACTIONS
         with the newly identified related party
                                  │
                                  ▼
      3. INQUIRE WHY ENTITY'S CONTROLS FAILED to identify/disclose
                                  │
                                  ▼
      4. PERFORM SUBSTANTIVE AUDIT PROCEDURES on transactions:
         • Examine loan agreements, authorization, security
         • Evaluate business rationale (or lack thereof)
                                  │
                                  ▼
      5. RE-EVALUATE RISK ASSESSMENT & FRAUD RISK (SA 240)
         • Reconsider reliability of management representations
         • If non-disclosure is intentional: Material Misstatement
           and Reporting to TCWG / SA 705 Modification
```

• **Statutory Principles under SA 550**:
  1. **Framework Superiority**: While Section 2(77) of the Companies Act defines relatives for statutory corporate compliance, **Ind AS 24 governs financial statement preparation and disclosures**. Under Ind AS 24, close members of family include persons who influence or are influenced by the individual.
  2. **Mandatory Action under SA 550 (Para 22)**:
     - Promptly communicate the relevant information to the other members of the engagement team.
     - Request management to identify all transactions with the newly identified related party for the auditor's further evaluation.
     - Inquire as to why the entity's controls over related party relationships and transactions failed to enable the identification or disclosure of the related party relationship or transactions.
     - Perform appropriate substantive audit procedures relating to such newly identified related parties or significant related party transactions.
     - Reconsider the risk that other related parties or significant related party transactions may exist that management has not previously identified or disclosed to the auditor.
  3. **Reporting Consequences**: If management refuses to disclose the related party transaction in the notes to accounts as required by Ind AS 24, the auditor **must express a Qualified or Adverse Opinion under SA 705** and report under CARO 2020 Clause (xiii).""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing Ind AS 24 close family definitions from Companies Act Section 2(77) and systematically citing the 5 mandatory action steps under SA 550 paragraph 22.",
      "criticalMisses": [
        "Accepting management's excuse based solely on Section 2(77) Companies Act.",
        "Omitting the mandatory re-evaluation of fraud risk and internal control override under SA 240/550."
      ],
      "suggestions": [
        "Cross-reference CARO 2020 Clause (xiii) which mandates reporting whether all transactions with related parties are in compliance with Sections 177 and 188 of Companies Act and properly disclosed as per applicable accounting standards."
      ]
    }
  },
  {
    "id": "aud_std_full_16",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 560 - Subsequent Events: Facts Known After Balance Sheet Date but Before vs After Audit Report Issuance",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 5 / May 2024 RTP Q.5 & Nov 2023 Exam (SA 560)",
    "question": "The balance sheet date of Stellar Autos Ltd. was 31st March 2023. The statutory audit report was signed on 25th May 2023, and the annual general meeting was scheduled for 28th July 2023. On 10th June 2023 (prior to financial statement issuance), a major fire gutted the central spare parts warehouse, causing an uninsured stock loss of ₹12 crores. The management refused to make any disclosure in the financial statements, arguing that since the audit report was already signed, the books of account cannot be amended. Explain the auditor's duties and powers under SA 560.",
    "keyConcepts": [
      { "keyword": "SA 560 Subsequent Events", "category": "Standard", "description": "Auditor's responsibilities relating to subsequent events in an audit of financial statements." },
      { "keyword": "Facts Becoming Known After Date of Auditor's Report but Before FS Issued", "category": "Rule", "description": "Auditor has no obligation to perform active procedures, but must respond to facts that would have caused modification." },
      { "keyword": "Non-Adjusting Material Subsequent Event (Ind AS 10)", "category": "Provision", "description": "Fire damage after BS date is non-adjusting event requiring disclosure in notes to accounts." },
      { "keyword": "Action if Management Refuses Amendment", "category": "Rule", "description": "Notify TCWG, take legal advice, and take steps to prevent reliance on the auditor's report." }
    ],
    "shortSuggestedAnswer": """| Period | Event Nature under Ind AS 10 | Auditor's Duty under SA 560 | Action if Management Refuses Amendment |
| :--- | :--- | :--- | :--- |
| **Between Date of Auditor's Report (25th May) and Date Financial Statements Issued (28th July)** | Major fire loss of ₹12 Cr on 10th June is a **Non-Adjusting Subsequent Event** requiring mandatory disclosure of nature and financial estimate in Notes to Accounts (Ind AS 10). | Auditor has **no obligation to perform ongoing procedures**, but on becoming aware of a fact that would have affected the report: discuss with management, determine amendment need. | If management refuses to amend: Notify TCWG not to issue FS to shareholders; seek legal advice; take steps to **prevent reliance on audit report**. |

```
[SA 560 Events Known After Audit Report Date but Before FS Issued]
         Material Fact Arises / Becomes Known After Report Signed
         (₹12 Cr Uninsured Fire Loss Occurs on 10th June 2023)
                                   │
                                   ▼
          Discuss Matter with Management and (where appropriate) TCWG
                                   │
                                   ▼
         Determine Whether Financial Statements Need Amendment
        (Mandatory Disclosure Required under Ind AS 10 / AS 4)
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
Management AMENDS Financial Statements             Management REFUSES to Amend FS
• Perform audit procedures on amendment            • Notify Those Charged with Governance
• Issue NEW Audit Report with Emphasis of Matter     that auditor's report must NOT be issued
• Dual date report or extend subsequent review       to third parties
       │                                                       │
       ▼                                                       ▼
Financial Statements Properly Disclosed            PREVENT RELIANCE ON AUDIT REPORT
                                                   • Issue formal notification to AGM/BSE/ROC
                                                   • Seek immediate legal counsel
```

• **Statutory Principles under SA 560 (Paragraphs 10–13)**:
  1. **No Active Search, but Reactive Duty**: The auditor has no obligation to perform any audit procedures regarding the financial statements after the date of the auditor's report. However, if a fact becomes known to the auditor that, had it been known at the date of the auditor's report, may have caused the auditor to amend the report, the auditor shall:
     - Discuss the matter with management and, where appropriate, TCWG.
     - Determine whether the financial statements need amendment.
     - Inquire how management intends to address the matter in the financial statements.
  2. **Management Refusal Protocols**: If management does not amend the financial statements in circumstances where the auditor believes they need to be amended, then:
     - If the auditor's report has not yet been provided to the entity, the auditor shall modify the opinion under SA 705 and then provide the auditor's report.
     - If the auditor's report has already been provided to the entity, the auditor shall notify management and TCWG **not to issue the financial statements to third parties** before the necessary amendments have been made.
     - If the financial statements are nevertheless subsequently issued without the necessary amendments, the auditor shall take appropriate action to seek to **prevent reliance on the auditor's report**, including taking legal advice and informing regulatory bodies (e.g. Registrar of Companies / Stock Exchanges).""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing subsequent event phases under SA 560 and prescribing the mandatory legal prevention-of-reliance protocol when management refuses amendment before financial statements are issued.",
      "criticalMisses": [
        "Agreeing with management that the auditor has no power once the report is signed.",
        "Failing to mention the duty to prevent reliance on the audit report by notifying TCWG, regulators, and seeking legal counsel."
      ],
      "suggestions": [
        "Clarify that fire destruction is a non-adjusting event under Ind AS 10 requiring note disclosure, but if it destroys going concern, it turns into an adjusting event."
      ]
    }
  },
  {
    "id": "aud_std_full_17",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 570 (Revised) - Going Concern: Mitigating Management Plans & 'Material Uncertainty' Reporting Matrix",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 5 / Nov 2023 Exam & May 2024 MTP S2 (SA 570)",
    "question": "Aviation Express Ltd. suffered net losses of ₹180 crores during FY 2022-23, resulting in complete erosion of net worth (negative ₹95 crores). Current liabilities exceed current assets by ₹110 crores, and major aircraft fuel suppliers have withdrawn credit terms. Management prepared the financial statements on a going concern basis, citing an uncommitted letter of intent from a foreign sovereign wealth fund to infuse equity capital within the next 18 months. (a) Evaluate whether management's mitigating plan provides SAAE; (b) Tabulate the complete audit reporting matrix under SA 570 (Revised) based on the adequacy of disclosure.",
    "keyConcepts": [
      { "keyword": "SA 570 (Revised) Going Concern", "category": "Standard", "description": "Auditor's responsibilities relating to going concern in an audit of financial statements." },
      { "keyword": "Evaluation of Management's Mitigating Plans", "category": "Provision", "description": "Assess feasibility of plans (debt restructuring, equity infusion); uncommitted letters do NOT provide SAAE." },
      { "keyword": "Material Uncertainty Related to Going Concern (MURGC)", "category": "Rule", "description": "Specific separate section in audit report required when going concern basis is appropriate but material uncertainty exists." },
      { "keyword": "SA 570 Reporting Matrix", "category": "Rule", "description": "Adequate disclosure = Unmodified opinion + MURGC section; Inadequate disclosure = Qualified or Adverse opinion." }
    ],
    "shortSuggestedAnswer": """| Factual Parameter | Technical & Statutory Evaluation under SA 570 (Revised) |
| :--- | :--- |
| **Financial Health Indicators** | Complete net worth erosion (-₹95 Cr), working capital deficit (-₹110 Cr), supplier credit revocation. Severe events casting significant doubt on Going Concern. |
| **Management's Mitigating Plan** | An **uncommitted, non-binding letter of intent** for equity infusion over 18 months is speculative and conditional; it **does NOT constitute SAAE**. |
| **Conclusion on Going Concern** | Use of going concern basis of accounting is appropriate, but a **Material Uncertainty Related to Going Concern** exists. |

```
[SA 570 (Revised) Statutory Reporting Decision Matrix]
             Events or Conditions Identified Casting Significant Doubt
                                        │
                                        ▼
             Is the Use of Going Concern Basis Appropriate?
                                        │
       ┌────────────────────────────────┴────────────────────────────────┐
       ▼                                                                 ▼
      YES                                                               NO
Does a MATERIAL UNCERTAINTY Exist?                                Accounting on Going Concern
       │                                                          is Inappropriate
 ┌─────┴─────────────────────┐                                           │
 ▼                           ▼                                           ▼
NO                          YES                                   ADVERSE OPINION
Unmodified          Is Material Uncertainty                               (SA 705)
Report             Adequately Disclosed in FS?
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
             YES                            NO
     UNMODIFIED OPINION             QUALIFIED OR ADVERSE
              +                           OPINION
      SEPARATE SECTION:              (SA 705 Material
  'Material Uncertainty Related      Misstatement due to
      to Going Concern'              Inadequate Disclosure)
```

| Scenario | Financial Statement Disclosure | Required Audit Report Formulation under SA 570 (Revised) |
| :--- | :--- | :--- |
| **Case A: Going Concern Appropriate & Fully Disclosed** | Management provides detailed footnote disclosing working capital crisis and material uncertainty. | **Unmodified Opinion** with a dedicated, separate section titled: **'Material Uncertainty Related to Going Concern'** (referencing the specific note and stating uncertainty exists; opinion is not modified). |
| **Case B: Going Concern Appropriate but Inadequately Disclosed** | Management omits disclosure or provides vague/misleading statements regarding the cash crisis. | **Qualified Opinion or Adverse Opinion** under SA 705 (Basis for Qualified/Adverse Opinion states that material uncertainty exists and is not disclosed). |
| **Case C: Going Concern Basis is Inappropriate** | Management insists on preparing FS on going concern despite impending liquidation/insolvency. | **Adverse Opinion** under SA 705 (regardless of whether notes disclose the liquidation). |""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on rejecting non-binding letters of intent as SAAE and tabulating the complete SA 570 (Revised) reporting matrix including the mandatory 'Material Uncertainty Related to Going Concern' paragraph.",
      "criticalMisses": [
        "Relying on an uncommitted letter of intent to extinguish going concern uncertainty.",
        "Using an Emphasis of Matter (EOM) paragraph instead of the mandatory separate MURGC section under SA 570 (Revised)."
      ],
      "suggestions": [
        "Explicitly note that SA 570 (Revised) banned the use of Emphasis of Matter for going concern, replacing it with a standalone MURGC section."
      ]
    }
  },
  {
    "id": "aud_std_full_18",
    "subjectId": "Audit",
    "chapterName": "Audit Evidence",
    "title": "SA 580 - Written Representations: Management Refusal to Provide Representation on Fraud & Non-Compliance",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Ch 5 / Nov 2021 Exam & May 2024 RTP (SA 580)",
    "question": "During the statutory audit of Matrix Ltd., the statutory auditor requested written representations from the Chief Executive Officer (CEO) and CFO confirming that: (1) all financial records and related party transactions have been provided; and (2) management has disclosed the results of its assessment of the risk of fraud. The CEO refused to sign the written representation letter, stating that the auditor was paid hefty audit fees to verify books independently and management should not be forced to give written guarantees. What are the auditor's statutory duties and reporting consequences under SA 580?",
    "keyConcepts": [
      { "keyword": "SA 580 Written Representations", "category": "Standard", "description": "Auditor's responsibility to obtain written representations from management and TCWG." },
      { "keyword": "Written Representation as Audit Evidence", "category": "Provision", "description": "Necessary audit evidence, but does not provide SAAE on its own; cannot substitute other procedures." },
      { "keyword": "Management Refusal to Provide Written Representations", "category": "Rule", "description": "Discuss with management, re-evaluate integrity of management, and evaluate effect on audit opinion." },
      { "keyword": "Mandatory Disclaimer of Opinion", "category": "Rule", "description": "Auditor SHALL disclaim an opinion under SA 705 if management refuses to provide fundamental representations." }
    ],
    "shortSuggestedAnswer": """| Operational Aspect | Statutory Mandate under SA 580 | Application to Matrix Ltd. |
| :--- | :--- | :--- |
| **Nature of Written Representations** | Necessary audit evidence that management has fulfilled its responsibility for preparation of FS and completeness of info. | CEO's argument that audit fees relieve management of representation is **legally and professionally baseless**. |
| **Protocol on Management Refusal** | 1. Discuss matter with management.<br>2. Re-evaluate integrity of management and reliability of all representations.<br>3. Determine implications on audit opinion. | Auditor must explain statutory necessity to CEO/CFO and discuss with Audit Committee / Board. |
| **Mandatory Reporting Consequence (SA 580.20)** | If management refuses to provide written representations on fundamental responsibilities (books access, fraud, FRF compliance), auditor **SHALL DISCLAIM AN OPINION**. | The auditor **must issue a Disclaimer of Opinion** under SA 705. |

```
[SA 580 Management Refusal to Provide Written Representations]
                 Management Refuses to Sign Representation Letter
                                        │
                                        ▼
          Discuss with Management: Explain Statutory Purpose under SA 580
                                        │
                                        ▼
          Re-evaluate Management Integrity & Competence (SA 580.17)
         (Evaluate impact on ALL other audit evidence and representations)
                                        │
       ┌────────────────────────────────┴────────────────────────────────┐
       ▼                                                                 ▼
Does Refusal Pertain to Non-Fundamental Area?                   Does Refusal Pertain to FUNDAMENTAL
(e.g., specific estimate, litigation)                           RESPONSIBILITIES (Prep of FS, Access
       │                                                        to Books, Fraud, Completeness)?
       ▼                                                                 │
Consider Scope Limitation;                                               ▼
Qualified or Disclaimer (SA 705)                               MANDATORY DISCLAIMER OF OPINION
                                                               (SA 580 Paragraph 20 & SA 705)
```

• **Statutory Principles under SA 580**:
  1. **Cannot be Substituted**: Written representations are necessary audit evidence. While they do not provide sufficient appropriate audit evidence on their own, management's acknowledgment of its fundamental responsibilities is an indispensable foundation.
  2. **Doubt Over Management Integrity**: Management's refusal to provide written representations regarding completeness of records and fraud assessment creates severe doubt about management's integrity.
  3. **Mandatory Disclaimer under Paragraph 20**: The auditor **shall disclaim an opinion** on the financial statements in accordance with SA 705 if:
     - The auditor concludes that there is sufficient doubt about the integrity of management such that the written representations are not reliable; or
     - Management does not provide the written representations required by SA 580 regarding its fundamental responsibilities.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 580 paragraph 20 rule: mandatory disclaimer of opinion when management refuses to provide fundamental written representations on fraud and completeness of records.",
      "criticalMisses": [
        "Suggesting that the auditor can issue a Qualified Opinion instead of a Disclaimer.",
        "Failing to re-evaluate management integrity across all other audit evidence."
      ],
      "suggestions": [
        "Emphasize that written representations cannot substitute for substantive procedures, but their absence destroys the entire audit foundation."
      ]
    }
  },
  {
    "id": "aud_std_full_19",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "SA 701 - Communicating Key Audit Matters (KAM): Mandatory Scope, Selection Process & Prohibitions",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 7 / May 2024 RTP Q.6 & Nov 2022 Exam (SA 701)",
    "question": "Zenith Infotech Ltd., an entity listed on BSE and NSE, had a highly contentious revenue recognition issue involving multi-element cloud contracts and complex unbilled receivables. The engagement partner decided to omit this matter from Key Audit Matters (KAM) in the audit report, claiming that because it was already discussed with the Audit Committee and disclosed in the Notes to Accounts, reporting it as a KAM would unnecessarily alarm public retail investors. (a) State the entities for which SA 701 is mandatory; (b) Explain the funnel selection process for determining KAM; (c) Can a KAM be omitted to avoid alarming investors?",
    "keyConcepts": [
      { "keyword": "SA 701 Communicating Key Audit Matters in the Independent Auditor's Report", "category": "Standard", "description": "Mandatory standard for communicating significant matters in the audit of listed entities." },
      { "keyword": "Mandatory Applicability of SA 701", "category": "Rule", "description": "Mandatory for audits of complete sets of general purpose financial statements of listed entities." },
      { "keyword": "Funnel Process for Determining KAM", "category": "Provision", "description": "Matters communicated with TCWG -> Matters that required significant auditor attention -> Most significance (KAM)." },
      { "keyword": "Prohibition on Omitting KAM", "category": "Rule", "description": "Cannot omit unless law precludes public disclosure or adverse consequences outweigh public interest." }
    ],
    "shortSuggestedAnswer": """| Aspect of SA 701 | Statutory Requirement under SA 701 | Case Application (Zenith Infotech Ltd.) |
| :--- | :--- | :--- |
| **Mandatory Applicability** | Applies to audits of complete sets of general purpose financial statements of **listed entities** (and when required by law or auditor voluntarily). | Zenith Infotech Ltd. is **listed on BSE & NSE**; application of SA 701 is **strictly mandatory**. |
| **Selection Process (The Funnel)** | Selected from matters communicated with TCWG $\rightarrow$ matters requiring significant auditor attention $\rightarrow$ matters of **most significance** in the audit. | Multi-element cloud revenue recognition requiring complex estimation is a classic **Key Audit Matter**. |
| **Omission Criteria (Extreme Rare Exception)** | Permitted ONLY IF: (1) Law or regulation precludes public disclosure; or (2) Adverse consequences of disclosure reasonably outweigh public interest benefits. | 'Alarming retail investors' is **NOT a valid legal ground** for omitting a KAM. Engagement partner's decision is **grossly defective**. |

```
[SA 701 KAM Determination Funnel Architecture]
      ┌──────────────────────────────────────────────────────────┐
      │     MATTERS COMMUNICATED WITH TCWG (SA 260)              │
      └────────────────────────────┬─────────────────────────────┘
                                   │ Filter 1: Auditor Attention
                                   ▼
      ┌──────────────────────────────────────────────────────────┐
      │     MATTERS REQUIRING SIGNIFICANT AUDITOR ATTENTION      │
      │ • High assessed RMM or significant risks (SA 315 / 240)   │
      │ • Significant auditor judgments on estimates (SA 540)    │
      │ • Effect of significant events/transactions during year  │
      └────────────────────────────┬─────────────────────────────┘
                                   │ Filter 2: Most Significance
                                   ▼
      ┌──────────────────────────────────────────────────────────┐
      │             KEY AUDIT MATTERS (KAM)                      │
      │   Matters of MOST SIGNIFICANCE in current period audit   │
      └──────────────────────────────────────────────────────────┘
```

• **Statutory Principles under SA 701**:
  1. **Purpose of KAM**: To enhance the communicative value of the auditor's report by providing greater transparency about the audit that was performed.
  2. **Not a Substitute**: Communicating KAM is **not** a substitute for disclosures in financial statements, **not** a substitute for expressing a modified opinion under SA 705, and **not** a separate opinion on individual matters.
  3. **Strict Criteria for Non-Communication**: Under paragraph 14 of SA 701, the auditor shall describe each KAM unless:
     - Law or regulation precludes public disclosure about the matter; or
     - In extremely rare circumstances, the auditor determines that the matter should not be communicated because the adverse consequences of doing so would reasonably be expected to outweigh the public interest benefits of such communication. This does not apply if the entity has publicly disclosed information about the matter.
  4. **Conclusion**: Partner's attempt to suppress the revenue recognition KAM violates SA 701.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on citing SA 701 mandatory applicability to listed entities, explaining the three-tier KAM funnel selection, and rejecting investor alarm as a justification for omission.",
      "criticalMisses": [
        "Accepting the engagement partner's argument to omit KAM to avoid alarming investors.",
        "Failing to explain the three-step funnel selection process (Communicated to TCWG -> Significant Attention -> Most Significance)."
      ],
      "suggestions": [
        "Emphasize that KAM does not replace a qualified opinion under SA 705; if revenue is misstated, it must be reported in the Basis for Qualified Opinion, not just KAM."
      ]
    }
  },
  {
    "id": "aud_std_full_20",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "SA 705 (Revised) - Modifications to Opinion: Qualified vs Adverse vs Disclaimer Comparative Architecture",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 7 / Nov 2023 Exam & May 2024 RTP (SA 705)",
    "question": "A student of chartered accountancy stated that whenever financial statements contain an unadjusted material misstatement exceeding overall materiality, the auditor has the professional discretion to choose either a Qualified Opinion, an Adverse Opinion, or a Disclaimer of Opinion depending on the client relationship. Correct this misconception by formulating the precise decision matrix under SA 705 (Revised) governing the choice between Qualified, Adverse, and Disclaimer of Opinion.",
    "keyConcepts": [
      { "keyword": "SA 705 (Revised) Modifications to the Opinion in the Independent Auditor's Report", "category": "Standard", "description": "Types of modified opinions: Qualified, Adverse, and Disclaimer." },
      { "keyword": "Material but NOT Pervasive Misstatement", "category": "Rule", "description": "Warrants a QUALIFIED OPINION (both for misstatements and scope limitations)." },
      { "keyword": "Material AND Pervasive Misstatement", "category": "Rule", "description": "Warrants an ADVERSE OPINION (when SAAE is obtained showing FS are materially misstated)." },
      { "keyword": "Material AND Pervasive Inability to Obtain SAAE (Scope Limitation)", "category": "Rule", "description": "Warrants a DISCLAIMER OF OPINION (auditor unable to obtain SAAE)." }
    ],
    "shortSuggestedAnswer": """| Nature of Matter Giving Rise to Modification | Material but NOT Pervasive | Material AND Pervasive | Statutory SA Reference |
| :--- | :--- | :--- | :--- |
| **Financial Statements are Materially Misstated** (Auditor has obtained SAAE) | **QUALIFIED OPINION**<br>(*"Except for the effects of the matter..."*) | **ADVERSE OPINION**<br>(*"Financial statements do not present true and fair view..."*) | SA 705 (Revised) Paragraphs 7 & 8 |
| **Inability to Obtain Sufficient Appropriate Audit Evidence (Scope Limitation)** | **QUALIFIED OPINION**<br>(*"Except for the possible effects of the matter..."*) | **DISCLAIMER OF OPINION**<br>(*"Auditor does not express an opinion on the FS..."*) | SA 705 (Revised) Paragraphs 7 & 9 |

```
[SA 705 (Revised) Opinion Formulation Matrix]
                 CIRCUMSTANCE TRIGGERING MODIFICATION
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
FINANCIAL STATEMENTS ARE                           INABILITY TO OBTAIN SAAE
MATERIALLY MISSTATED                                (SCOPE LIMITATION)
(Disagreement on GAAP / SAs)                       (Access denied, records destroyed)
       │                                                       │
       ├───────────────────────────┐                           ├───────────────────────────┐
       ▼                           ▼                           ▼                           ▼
Material but NOT            Material AND                Material but NOT            Material AND
   PERVASIVE                  PERVASIVE                    PERVASIVE                  PERVASIVE
       │                           │                           │                           │
       ▼                           ▼                           ▼                           ▼
QUALIFIED OPINION           ADVERSE OPINION             QUALIFIED OPINION         DISCLAIMER OF OPINION
```

• **Definition of 'Pervasive' under SA 705**:
  - Pervasive effects are those that, in the auditor's judgment:
    1. Are not confined to specific elements, accounts, or items of the financial statements;
    2. If so confined, represent or could represent a substantial proportion of the financial statements; or
    3. In relation to disclosures, are fundamental to users' understanding of the financial statements.
• **Rejection of Student's Misconception**:
  - The auditor has **zero subjective discretion** based on client relationships.
  - The choice of opinion is dictated strictly by the objective intersection of two factors: (1) whether SAAE was obtained (Misstatement vs Scope Limitation); and (2) whether the impact is Material vs Pervasive.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on constructing the 2x2 matrix under SA 705 (Revised) mapping Material/Pervasive vs Misstatement/Scope Limitation and providing the 3-pronged definition of 'Pervasive'.",
      "criticalMisses": [
        "Confusing an Adverse opinion (requires SAAE) with a Disclaimer of opinion (absence of SAAE).",
        "Failing to provide the statutory definition of 'Pervasive'."
      ],
      "suggestions": [
        "Highlight that Disclaimer of Opinion applies ONLY when the auditor cannot obtain SAAE and the possible effects are both material and pervasive."
      ]
    }
  }
]

# Let's write these questions into the file
with open('src/data/auditStandardsFullQuestions.ts', 'r') as f:
    content = f.read()

# Replace the closing array with new questions
# Let's load existing questions from the file
existing_questions = json.loads(content[content.find('['):content.rfind(']')+1])
existing_questions.extend(standards_data)

with open('src/data/auditStandardsFullQuestions.ts', 'w') as f:
    f.write('''/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STANDARDS ON AUDITING MASTER COMPENDIUM (CHAPTERS 1-7)
 * SAs 200 to 720, SQC 1, Risk Assessment, and Reporting
 * Adheres strictly to CA Final Educator rules with zero duplicates.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_STANDARDS_FULL_QUESTIONS: TheoryQuestion[] = ''')
    f.write(json.dumps(existing_questions, indent=2))
    f.write(';\n')

print(f"Updated auditStandardsFullQuestions.ts to {len(existing_questions)} questions!")
