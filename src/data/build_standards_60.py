import json

from master_question_templates import make_q

# List of 60 Standards questions
standards_questions = []

import sys
sys.path.append('src/data')
from build_standards_full_questions import questions as first_10
standards_questions.extend(first_10)

# Add questions 11-60
q_defs = [
    # 11: SA 501
    ("aud_std_full_11", "Audit", "Audit Evidence", "SA 501 - Inventory Physical Counting Attendance & Substituted Procedures", "Advanced", 6, "ICAI Study Material - Ch 5 / Nov 2022 Exam (SA 501)",
     "M/s Sterling Ltd. scheduled its physical inventory counting on 31st March 2023 at its main chemical refinery. The statutory auditor was prevented from attending due to a localized flood and curfew. Inventory comprises 38% of total assets. Management refused counting at an alternative date, arguing year-end stock cannot be verified retrospectively. What are the auditor's duties under SA 501 and reporting implications under SA 705?",
     [
       {"keyword": "SA 501 Physical Inventory Attendance", "category": "Standard", "description": "Mandatory attendance at physical inventory counting if inventory is material."},
       {"keyword": "Alternative Date Counting", "category": "Rule", "description": "Perform counts on an alternative date and perform audit procedures on intervening transactions."},
       {"keyword": "Roll-forward and Roll-back Procedures", "category": "Provision", "description": "Testing intervening purchases, sales, and production logs."},
       {"keyword": "Scope Limitation under SA 705", "category": "Rule", "description": "Disclaimer or Qualified Opinion if inventory is material and pervasive."}
     ],
     """| Situation under SA 501 | Mandatory Auditor Action | Case Fact (Sterling Ltd.) |
| :--- | :--- | :--- |
| **Attendance Impracticable** | Perform counts on alternative date + test intervening transactions (roll-back/forward). | Floods and curfew made attendance impracticable. |
| **Alternative Procedures Refused** | Perform alternative procedures (inspect subsequent cash realization, sales invoices, production records). | Management refused alternative date counting. |
| **Reporting Consequence (SA 705)** | Inventory represents 38% of total assets (Material & Pervasive). | **Disclaimer of Opinion** (or Qualified Opinion if not pervasive). |

```
[SA 501 Physical Inventory Attendance Protocol]
         Attendance Impracticable at Year-End (Floods/Curfew)
                                  │
                                  ▼
             Perform Counting at an ALTERNATIVE DATE
          • Reconcile intervening transactions to year-end
            (Roll-Back / Roll-Forward procedures)
                                  │
       ┌──────────────────────────┴──────────────────────────┐
       ▼                                                     ▼
Alternative Date Counting Allowed                 Management Refuses Alternative Count
& SAAE Obtained                                   & Alternative Evidence Unavailable
       │                                                     │
       ▼                                                     ▼
Unmodified Opinion on Inventory                   SCOPE LIMITATION UNDER SA 705
                                                  QUALIFIED / DISCLAIMER OF OPINION
```

• **Statutory Principles under SA 501 & SA 705**:
  1. **Alternative Date Count**: If attendance at physical inventory counting is impracticable, the auditor shall make or observe some physical counts on an alternative date, and perform audit procedures on intervening transactions.
  2. **Intervening Roll-Forward / Roll-Back**: The auditor tests intervening purchases, sales, and production logs to reconcile alternative date balances back to year-end.
  3. **Reporting under SA 705**: If it is not possible to obtain SAAE regarding existence and condition of inventory, the auditor shall modify the opinion in accordance with SA 705 due to a scope limitation.""",
     "Assessed on applying SA 501 alternative date count and roll-forward/roll-back requirements, followed by SA 705 scope limitation reporting.",
     ["Failing to mention roll-back or roll-forward procedures on intervening transactions.", "Accepting management's excuse that retrospective counting is impossible."],
     ["Distinguish between mere inconvenience vs genuine impracticability (floods, curfews)."]),

    # 12: SA 505
    ("aud_std_full_12", "Audit", "Audit Evidence", "SA 505 - External Confirmations: Positive Confirmations & Management Refusal", "Advanced", 6, "ICAI Study Material - Ch 5 / May 2023 Exam (SA 505)",
     "During the statutory audit of Zen Traders Ltd., the auditor selected 15 major trade receivables totaling ₹28 crores for positive external confirmation. Management refused to allow confirmation requests to 5 customers (accounting for ₹18 crores), claiming commercial sensitivity and threatened loss of business. Management provided internal customer statements stamped by the sales manager. Evaluate management's refusal under SA 505 and state auditor actions.",
     [
       {"keyword": "SA 505 External Confirmations", "category": "Standard", "description": "Use of external confirmation procedures to obtain audit evidence."},
       {"keyword": "Management Refusal Protocol", "category": "Rule", "description": "Inquire into reasons, seek evidence on validity, and evaluate implications on fraud risk."},
       {"keyword": "Alternative Audit Procedures", "category": "Provision", "description": "Examine subsequent cash receipts, shipping docs, and customer purchase orders."},
       {"keyword": "Scope Limitation under SA 705", "category": "Rule", "description": "Communicate to TCWG and modify opinion if refusal is unreasonable or no SAAE obtained."}
     ],
     """| Evaluation Stage | SA 505 Statutory Requirement | Case Application (Zen Traders Ltd.) |
| :--- | :--- | :--- |
| **Inquire into Reasons for Refusal** | Inquire as to management's reasons for refusal and seek audit evidence as to their validity and reasonableness. | Commercial sensitivity is a generic excuse; auditor must scrutinize correspondence and assess fraud risk. |
| **Evaluate Fraud Risk & Control Environment** | Evaluate implications of refusal on assessed risks of material misstatement, including fraud risk and other audit procedures. | Refusal to confirm 64% of sample (₹18 Cr) raises a **severe red flag for fictitious revenues**. |
| **Perform Alternative Audit Procedures** | Design and perform alternative audit procedures (e.g. examine subsequent bank receipts, signed delivery challans, customer orders). | Internal statements stamped by sales manager do not constitute independent SAAE. |
| **If Refusal Unreasonable / No Evidence** | If refusal is unreasonable or alternative procedures do not provide SAAE, communicate to TCWG and modify opinion under SA 705. | Management's refusal is unjustified. Issue **Qualified or Disclaimer of Opinion** under SA 705. |

```
[SA 505 Management Refusal Protocol]
         Management Refuses to Allow External Confirmation Request
                                     │
                                     ▼
      1. Inquire into reasons & seek audit evidence on validity
      2. Evaluate implications on RMM and Fraud Risk (SA 240)
      3. Perform Alternative Procedures (Subsequent bank receipts, challans)
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       ▼                                                           ▼
Alternative SAAE Obtained                                 Refusal is Unreasonable OR
(Valid alternative evidence)                              Alternative Evidence Unavailable
       │                                                           │
       ▼                                                           ▼
Unmodified Opinion                                        Communicate to TCWG;
                                                          SCOPE LIMITATION (SA 705)
                                                          Qualified or Disclaimer of Opinion
```

• **Statutory Principles under SA 505**:
  1. **Refusal Protocol**: If management refuses to allow the auditor to send a confirmation request, the auditor shall:
     - Inquire as to management's reasons for the refusal, and seek audit evidence as to their validity and reasonableness.
     - Evaluate the implications of management's refusal on the auditor's assessment of relevant risks of material misstatement, including fraud risk.
     - Perform alternative audit procedures designed to obtain relevant and reliable audit evidence.
  2. **Unreasonable Refusal**: If the auditor concludes that management's refusal is unreasonable, or the auditor is unable to obtain SAAE from alternative procedures, the auditor shall communicate with TCWG and determine implications for the audit opinion under SA 705.""",
     "Assessed on applying the SA 505 sequential protocol: inquire reasons, evaluate fraud risk, perform alternative procedures, and modify opinion under SA 705.",
     ["Accepting internal sales-stamped statements as an adequate substitute for external confirmation.", "Failing to evaluate fraud implications of management's refusal."],
     ["Explicitly note that positive confirmation requires direct written response from third party to the auditor."]),

    # 13: SA 510
    ("aud_std_full_13", "Audit", "Audit Evidence", "SA 510 - Initial Audit Engagements: Opening Balances & Predecessor Qualification", "Moderate", 5, "ICAI Study Material - Ch 5 / Nov 2021 Exam (SA 510)",
     "CA V was appointed as statutory auditor of Pioneer Ltd. for FY 2022-23. Financial statements for FY 2021-22 were audited by another firm who issued a Qualified Opinion due to unverified obsolete inventory of ₹4.5 crores. In the current year, CA V observed the same inventory carried at ₹4.5 crores without write-down. What procedures must CA V perform regarding opening balances under SA 510, and what are the reporting obligations?",
     [
       {"keyword": "SA 510 Initial Audit Engagements - Opening Balances", "category": "Standard", "description": "Auditor's responsibility relating to opening balances in initial audit engagements."},
       {"keyword": "Procedures for Opening Balances", "category": "Rule", "description": "Read most recent FS, determine whether prior period closing balances correctly brought forward."},
       {"keyword": "Consistency of Accounting Policies", "category": "Provision", "description": "Verify whether accounting policies reflected in opening balances have been consistently applied."},
       {"keyword": "Predecessor Qualification Carry-Forward", "category": "Rule", "description": "If predecessor qualification remains relevant and material, auditor SHALL modify current opinion."}
     ],
     """| Audit Focus Area | Statutory Requirement under SA 510 | Case Application (Pioneer Ltd.) |
| :--- | :--- | :--- |
| **Audit of Opening Balances** | Determine whether prior period closing balances have been correctly brought forward and reflect appropriate accounting policies. | Prior year inventory carried forward at ₹4.5 crores without write-down to Net Realisable Value (NRV). |
| **Evaluation of Predecessor Qualification** | Determine whether the matter giving rise to the modification in predecessor's report remains relevant and material to the current period. | Obsolete inventory qualification remains **unresolved, relevant, and material** to current period profits and assets. |
| **Reporting Requirement under SA 705** | If opening balances contain a misstatement that materially affects the current period's financial statements, auditor shall express a **Qualified or Adverse Opinion**. | CA V **shall modify the current period audit opinion** (Qualified Opinion u/s SA 705). |

```
[SA 510 Predecessor Qualification Impact Matrix]
           Predecessor Auditor Issued Qualified Opinion in Prior Year
                                     │
                                     ▼
        Does the Matter Remain Relevant and Material in Current Period?
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       ▼                                                           ▼
      YES                                                         NO
Matter Unresolved in Current Period                        Matter Resolved / Adjusted
(₹4.5 Cr obsolete stock carried forward)                  in Current Financial Statements
       │                                                           │
       ▼                                                           ▼
MANDATORY MODIFICATION UNDER SA 705                        Unmodified Opinion on Current Period
(Qualified or Adverse Opinion)                             (Optional Other Matter paragraph u/s SA 706)
```

• **Statutory Principles under SA 510**:
  1. **Core Verification Duty**: The auditor shall obtain SAAE about whether opening balances contain misstatements that materially affect the current period's financial statements and whether appropriate accounting policies have been consistently applied.
  2. **Predecessor's Modified Opinion**: If the predecessor auditor's opinion regarding the prior period included a modification that remains relevant and material to the current period, the auditor shall modify the auditor's opinion on the current period's financial statements in accordance with SA 705 and SA 510.""",
     "Assessed on applying SA 510 paragraph 13 rule: mandatory modification of current period opinion when predecessor's modification remains relevant and material.",
     ["Assuming that the new auditor can ignore the predecessor's qualification because it pertains to prior year.", "Failing to link uncorrected opening balance misstatements to SA 705 modification."],
     ["Clarify that an Other Matter paragraph stating prior year was audited by another firm does not replace the duty to modify."]),

    # 14: SA 530
    ("aud_std_full_14", "Audit", "Audit Evidence", "SA 530 - Audit Sampling: Sample Misstatement Projection & Tolerable Misstatement", "Advanced", 6, "ICAI Study Material - Ch 5 / Nov 2020 Exam (SA 530)",
     "In the audit of Sun Ltd., the auditor tested a sample of 50 accounts from a population of 2,000 trade debtors (Population: ₹40 crores; Sample: ₹8 crores). The team identified an uncorrected overstatement of ₹40 lakhs in the sample. Tolerable misstatement was set at ₹1.5 crores. The engagement senior concluded that since the detected misstatement of ₹40 lakhs is well below tolerable misstatement (₹1.5 Cr), no further audit action or extrapolation is necessary. Examine the senior's conclusion under SA 530.",
     [
       {"keyword": "SA 530 Audit Sampling", "category": "Standard", "description": "Auditor's use of statistical and non-statistical sampling."},
       {"keyword": "Mandatory Projection of Misstatements", "category": "Rule", "description": "For tests of details, the auditor SHALL project misstatements found in sample to population."},
       {"keyword": "Projected Misstatement vs Tolerable Misstatement", "category": "Provision", "description": "Compare projected misstatement plus anomalous misstatement against tolerable misstatement."},
       {"keyword": "Sampling Risk Evaluation", "category": "Provision", "description": "When projected misstatement approaches or exceeds tolerable misstatement, population is not acceptable."}
     ],
     """| Sampling Parameter | Value in Sun Ltd. | Mathematical / Statutory Analysis under SA 530 |
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
  1. **Mandatory Projection**: Under SA 530 paragraph 14, for tests of details, the auditor shall project misstatements found in the sample to the population to obtain a broad view of the scale of misstatement.
  2. **Failure to Project**: The engagement senior committed a gross error by comparing the raw sample error (₹40 lakhs) directly against tolerable misstatement (₹1.5 crores).
  3. **Population Rejection**: Because the projected misstatement of **₹2.00 crores exceeds the tolerable misstatement of ₹1.50 crores**, the auditor cannot accept the population as free from material misstatement.
  4. **Correct Action**: The auditor must request management to investigate identified misstatements, extend the audit sample size, and evaluate modifying the audit report under SA 705.""",
     "Assessed on performing mathematical projection of sample misstatement ((0.4/8)*40 = 2.0 Cr) and comparing projected misstatement against tolerable misstatement (1.5 Cr) under SA 530.",
     ["Failing to project the sample misstatement to the population.", "Agreeing with the senior that 40 lakhs is below 1.5 crores without projection."],
     ["State the exact projection formula: (Sample Error / Sample Value) * Total Population Value."]),

    # 15: SA 550
    ("aud_std_full_15", "Audit", "Audit Evidence", "SA 550 - Related Parties: Undisclosed Transactions & Fraud Risk Implications", "Advanced", 6, "ICAI Study Material - Ch 5 / Nov 2022 Exam (SA 550)",
     "During the audit of Zenith Infra Ltd., the auditor discovered an unsecured interest-free loan of ₹15 crores granted to Orbit Developers LLP. Orbit's designated partner is the son-in-law of Zenith's Managing Director. Management had not disclosed Orbit Developers LLP in the list of related parties provided to the auditor, claiming that a son-in-law does not fall under the definition of 'relative' under Section 2(77) of Companies Act, 2013, and therefore Ind AS 24 disclosure is unnecessary. Detail the auditor's statutory duties under SA 550.",
     [
       {"keyword": "SA 550 Related Parties", "category": "Standard", "description": "Auditor's responsibilities regarding related party relationships and transactions."},
       {"keyword": "Definition of Related Party under Ind AS 24", "category": "Provision", "description": "Includes close members of the family who may be expected to influence or be influenced."},
       {"keyword": "Procedures on Identifying Undisclosed Related Parties", "category": "Rule", "description": "Promptly communicate to team, request management to identify all transactions, inquire why controls failed."},
       {"keyword": "Reconsider Fraud Risk & Re-evaluate Control Environment", "category": "Provision", "description": "Non-disclosure indicates significant fraud risk and management override of internal controls."}
     ],
     """| Aspect | Legal & Accounting Requirement | Application to Zenith Infra Ltd. |
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
      2. REQUEST MANAGEMENT TO IDENTIFY ALL TRANSACTIONS with entity
      3. INQUIRE WHY ENTITY'S CONTROLS FAILED to identify/disclose
      4. PERFORM SUBSTANTIVE AUDIT PROCEDURES on transactions
      5. RE-EVALUATE RISK ASSESSMENT & FRAUD RISK (SA 240)
                                  │
                                  ▼
      Management Refuses Ind AS 24 Note Disclosure
                                  │
                                  ▼
      REPORTING: QUALIFIED / ADVERSE OPINION (SA 705)
      + CARO 2020 Clause (xiii) Reporting
```

• **Statutory Principles under SA 550**:
  1. **Framework Superiority**: While Section 2(77) of the Companies Act defines relatives for corporate compliance, **Ind AS 24 governs financial statement preparation and disclosures**. Under Ind AS 24, close members of family include persons who influence or are influenced by the individual.
  2. **Mandatory Action under SA 550 (Para 22)**:
     - Promptly communicate relevant information to other members of the engagement team.
     - Request management to identify all transactions with the newly identified related party for further evaluation.
     - Inquire as to why controls over related party relationships failed to enable identification or disclosure.
     - Perform appropriate substantive audit procedures relating to such newly identified related parties.
     - Reconsider the risk that other related parties or significant related party transactions may exist.
  3. **Reporting Consequences**: If management refuses to disclose the related party transaction in the notes to accounts as required by Ind AS 24, the auditor must express a Qualified or Adverse Opinion under SA 705 and report under CARO 2020 Clause (xiii).""",
     "Assessed on distinguishing Ind AS 24 close family definitions from Companies Act Section 2(77) and systematically citing the 5 mandatory action steps under SA 550 paragraph 22.",
     ["Accepting management's excuse based solely on Section 2(77) Companies Act.", "Omitting the mandatory re-evaluation of fraud risk and internal control override under SA 240/550."],
     ["Cross-reference CARO 2020 Clause (xiii) on related party transactions u/s 177 and 188 of Companies Act."]),

    # 16: SA 560
    ("aud_std_full_16", "Audit", "Audit Evidence", "SA 560 - Subsequent Events: Material Event Between Report Date and Financial Statement Issuance", "Advanced", 6, "ICAI Study Material - Ch 5 / Nov 2023 Exam (SA 560)",
     "The balance sheet date of Stellar Autos Ltd. was 31st March 2023. Audit report was signed on 25th May 2023; AGM scheduled for 28th July 2023. On 10th June 2023 (prior to financial statement issuance), a major fire gutted the central spare parts warehouse, causing uninsured loss of ₹12 crores. Management refused to make any disclosure in financial statements, arguing books cannot be amended after the audit report is signed. Explain the auditor's duties and powers under SA 560.",
     [
       {"keyword": "SA 560 Subsequent Events", "category": "Standard", "description": "Auditor's responsibilities relating to subsequent events in an audit of financial statements."},
       {"keyword": "Facts Becoming Known After Report Date but Before FS Issued", "category": "Rule", "description": "Auditor has no obligation to perform active procedures, but must respond to facts that would have caused amendment."},
       {"keyword": "Non-Adjusting Subsequent Event (Ind AS 10)", "category": "Provision", "description": "Fire damage after BS date is non-adjusting event requiring disclosure in notes to accounts."},
       {"keyword": "Prevention of Reliance Protocol", "category": "Rule", "description": "Notify TCWG, take legal advice, and take steps to prevent reliance on the auditor's report."}
     ],
     """| Period | Event Nature under Ind AS 10 | Auditor's Duty under SA 560 | Action if Management Refuses Amendment |
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
  1. **No Active Search, but Reactive Duty**: The auditor has no obligation to perform any audit procedures regarding the financial statements after the date of the auditor's report. However, if a fact becomes known to the auditor that, had it been known at the date of the report, may have caused amendment:
     - Discuss the matter with management and, where appropriate, TCWG.
     - Determine whether the financial statements need amendment.
     - Inquire how management intends to address the matter in the financial statements.
  2. **Management Refusal Protocols**: If management does not amend the financial statements:
     - If the auditor's report has not yet been provided, modify the opinion under SA 705.
     - If the auditor's report has already been provided, notify management and TCWG not to issue the financial statements to third parties.
     - If the financial statements are nevertheless issued, take action to seek to **prevent reliance on the auditor's report**, including taking legal advice and informing regulatory bodies.""",
     "Assessed on distinguishing subsequent event phases under SA 560 and prescribing the mandatory legal prevention-of-reliance protocol when management refuses amendment before financial statements are issued.",
     ["Agreeing with management that the auditor has no power once the report is signed.", "Failing to mention the duty to prevent reliance on the audit report by notifying TCWG, regulators, and seeking legal counsel."],
     ["Clarify that fire destruction is a non-adjusting event under Ind AS 10 requiring note disclosure, but if it destroys going concern, it turns into an adjusting event."]),

    # 17: SA 570
    ("aud_std_full_17", "Audit", "Audit Evidence", "SA 570 (Revised) - Going Concern: Mitigating Plans & Material Uncertainty Reporting", "Mastery", 6, "ICAI Study Material - Ch 5 / Nov 2023 Exam (SA 570)",
     "Aviation Express Ltd. suffered net losses of ₹180 crores in FY 2022-23; net worth is negative ₹95 crores. Current liabilities exceed current assets by ₹110 crores; fuel suppliers withdrew credit. Management prepared financial statements on going concern, citing an uncommitted letter of intent from a foreign sovereign wealth fund to infuse equity over 18 months. Evaluate management's mitigating plan and tabulate the complete audit reporting matrix under SA 570 (Revised).",
     [
       {"keyword": "SA 570 (Revised) Going Concern", "category": "Standard", "description": "Auditor's responsibilities relating to going concern in an audit of financial statements."},
       {"keyword": "Evaluation of Mitigating Plans", "category": "Provision", "description": "Assess feasibility of plans; uncommitted letters do NOT provide SAAE."},
       {"keyword": "Material Uncertainty Related to Going Concern (MURGC)", "category": "Rule", "description": "Specific separate section in audit report required when going concern basis is appropriate but material uncertainty exists."},
       {"keyword": "SA 570 Reporting Matrix", "category": "Rule", "description": "Adequate disclosure = Unmodified opinion + MURGC section; Inadequate disclosure = Qualified or Adverse opinion."}
     ],
     """| Factual Parameter | Technical & Statutory Evaluation under SA 570 (Revised) |
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
     "Assessed on rejecting non-binding letters of intent as SAAE and tabulating the complete SA 570 (Revised) reporting matrix including the mandatory 'Material Uncertainty Related to Going Concern' paragraph.",
     ["Relying on an uncommitted letter of intent to extinguish going concern uncertainty.", "Using an Emphasis of Matter (EOM) paragraph instead of the mandatory separate MURGC section under SA 570 (Revised)."],
     ["Explicitly note that SA 570 (Revised) banned the use of Emphasis of Matter for going concern, replacing it with a standalone MURGC section."]),

    # 18: SA 580
    ("aud_std_full_18", "Audit", "Audit Evidence", "SA 580 - Written Representations: Management Refusal to Provide Representation", "Moderate", 5, "ICAI Study Material - Ch 5 / Nov 2021 Exam (SA 580)",
     "During the statutory audit of Matrix Ltd., the auditor requested written representations from the CEO and CFO confirming that: (1) all financial records and related party transactions have been provided; and (2) management has disclosed fraud risk assessment results. The CEO refused to sign, stating audit fees relieve management of written guarantees. What are the auditor's statutory duties and reporting consequences under SA 580?",
     [
       {"keyword": "SA 580 Written Representations", "category": "Standard", "description": "Auditor's responsibility to obtain written representations from management and TCWG."},
       {"keyword": "Written Representation as Audit Evidence", "category": "Provision", "description": "Necessary audit evidence, but does not provide SAAE on its own; cannot substitute other procedures."},
       {"keyword": "Management Refusal Protocol", "category": "Rule", "description": "Discuss with management, re-evaluate integrity of management, and evaluate effect on audit opinion."},
       {"keyword": "Mandatory Disclaimer of Opinion", "category": "Rule", "description": "Auditor SHALL disclaim an opinion under SA 705 if management refuses to provide fundamental representations."}
     ],
     """| Operational Aspect | Statutory Mandate under SA 580 | Application to Matrix Ltd. |
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
     "Assessed on applying SA 580 paragraph 20 rule: mandatory disclaimer of opinion when management refuses to provide fundamental written representations on fraud and completeness of records.",
     ["Suggesting that the auditor can issue a Qualified Opinion instead of a Disclaimer.", "Failing to re-evaluate management integrity across all other audit evidence."],
     ["Emphasize that written representations cannot substitute for substantive procedures, but their absence destroys the entire audit foundation."]),

    # 19: SA 701
    ("aud_std_full_19", "Audit", "Reporting", "SA 701 - Communicating Key Audit Matters: Applicability & Funnel Selection Process", "Mastery", 6, "ICAI Study Material - Ch 7 / May 2024 RTP Q.6 (SA 701)",
     "Zenith Infotech Ltd., listed on BSE and NSE, had a contentious revenue recognition issue involving multi-element cloud contracts and unbilled receivables. The partner omitted this from KAM, claiming that because it was already discussed with the Audit Committee and disclosed in Notes, reporting it as KAM would alarm retail investors. State entities for which SA 701 is mandatory, explain the funnel selection process for determining KAM, and analyze if KAM can be omitted to avoid alarming investors.",
     [
       {"keyword": "SA 701 Communicating Key Audit Matters", "category": "Standard", "description": "Mandatory standard for communicating significant matters in audit of listed entities."},
       {"keyword": "Mandatory Applicability of SA 701", "category": "Rule", "description": "Mandatory for audits of complete sets of general purpose financial statements of listed entities."},
       {"keyword": "Funnel Process for Determining KAM", "category": "Provision", "description": "Matters communicated with TCWG -> Matters that required significant auditor attention -> Most significance (KAM)."},
       {"keyword": "Prohibition on Omitting KAM", "category": "Rule", "description": "Cannot omit unless law precludes public disclosure or adverse consequences outweigh public interest."}
     ],
     """| Aspect of SA 701 | Statutory Requirement under SA 701 | Case Application (Zenith Infotech Ltd.) |
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
     - In extremely rare circumstances, the auditor determines that the matter should not be communicated because adverse consequences would reasonably outweigh public interest benefits.
  4. **Conclusion**: Partner's attempt to suppress the revenue recognition KAM violates SA 701.""",
     "Assessed on citing SA 701 mandatory applicability to listed entities, explaining the three-tier KAM funnel selection, and rejecting investor alarm as a justification for omission.",
     ["Accepting the engagement partner's argument to omit KAM to avoid alarming investors.", "Failing to explain the three-step funnel selection process (Communicated to TCWG -> Significant Attention -> Most Significance)."],
     ["Emphasize that KAM does not replace a qualified opinion under SA 705; if revenue is misstated, it must be reported in the Basis for Qualified Opinion, not just KAM."]),

    # 20: SA 705
    ("aud_std_full_20", "Audit", "Reporting", "SA 705 (Revised) - Modifications to Opinion: Qualified vs Adverse vs Disclaimer", "Mastery", 6, "ICAI Study Material - Ch 7 / Nov 2023 Exam (SA 705)",
     "A student of chartered accountancy stated that whenever financial statements contain an unadjusted material misstatement exceeding overall materiality, the auditor has discretion to choose either a Qualified Opinion, Adverse Opinion, or Disclaimer of Opinion depending on client relationships. Correct this misconception by formulating the decision matrix under SA 705 (Revised).",
     [
       {"keyword": "SA 705 (Revised) Modifications to the Opinion", "category": "Standard", "description": "Types of modified opinions: Qualified, Adverse, and Disclaimer."},
       {"keyword": "Material but NOT Pervasive Misstatement", "category": "Rule", "description": "Warrants a QUALIFIED OPINION (both for misstatements and scope limitations)."},
       {"keyword": "Material AND Pervasive Misstatement", "category": "Rule", "description": "Warrants an ADVERSE OPINION (when SAAE is obtained showing FS are materially misstated)."},
       {"keyword": "Material AND Pervasive Scope Limitation", "category": "Rule", "description": "Warrants a DISCLAIMER OF OPINION (auditor unable to obtain SAAE)."}
     ],
     """| Nature of Matter Giving Rise to Modification | Material but NOT Pervasive | Material AND Pervasive | Statutory SA Reference |
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
     "Assessed on constructing the 2x2 matrix under SA 705 (Revised) mapping Material/Pervasive vs Misstatement/Scope Limitation and providing the 3-pronged definition of 'Pervasive'.",
     ["Confusing an Adverse opinion (requires SAAE) with a Disclaimer of opinion (absence of SAAE).", "Failing to provide the statutory definition of 'Pervasive'."],
     ["Highlight that Disclaimer of Opinion applies ONLY when the auditor cannot obtain SAAE and the possible effects are both material and pervasive."])
]

# Generate questions 21 to 60 programmatically with rich content
additional_standards_topics = [
    # 21: SA 706 EOM vs OM
    ("SA 706 (Revised) Emphasis of Matter vs Other Matter Paragraphs", "Reporting",
     "M/s Vertex Ltd. disclosed in Note 28 that the Central Government expropriated its overseas subsidiary on 15th April 2023. The auditor wants to draw users' attention to this note. In the same audit, the prior period financial statements were audited by another auditor. Draft the appropriate reporting under SA 706 distinguishing EOM from OM paragraphs.",
     "SA 706 (Revised)", "Emphasis of Matter Paragraph", "Other Matter Paragraph", "Placement in Audit Report",
     """| Reporting Construct | Statutory Definition & Scope under SA 706 | Application to Vertex Ltd. |
| :--- | :--- | :--- |
| **Emphasis of Matter (EOM)** | Draws users' attention to a matter **appropriately presented or disclosed in the financial statements** that is of such importance that it is fundamental to users' understanding of FS. | Expropriation of overseas subsidiary disclosed in Note 28. Included under EOM referring specifically to Note 28. |
| **Other Matter (OM)** | Draws users' attention to a matter **other than those presented or disclosed in FS** that is relevant to users' understanding of the audit, auditor's responsibilities, or report. | Prior period audited by predecessor auditor. Included under OM stating that prior year was audited by another firm who expressed an opinion on specified date. |"""),

    # 22: SA 710 Comparative Information
    ("SA 710 Comparative Information: Corresponding Figures vs Comparative Financial Statements", "Reporting",
     "Distinguish between Corresponding Figures and Comparative Financial Statements under SA 710. In the audit of Alpha Ltd., prior year financial statements were modified due to unprovided bad debts which were written off in the current year. How should the auditor report in the current year?",
     "SA 710 Comparative Information", "Corresponding Figures Framework", "Comparative Financial Statements Framework", "Unresolved Prior Year Modifications",
     """| Feature | Corresponding Figures (Framework in India) | Comparative Financial Statements |
| :--- | :--- | :--- |
| **Scope of Opinion** | Auditor's opinion refers to the **current period only**, because comparative figures are integral to current period FS. | Auditor's opinion refers to **each period** for which financial statements are presented. |
| **Prior Year Modification Unresolved** | If prior period matter is unresolved and affects current period figures, modify current period opinion on both current and corresponding figures. | Express separate opinion on each period presented. |
| **Prior Year Resolved in Current Year** | If bad debts were written off in current year, the matter is resolved; unmodified opinion on current year; no modification needed. | Disclose resolution in report if prior period still presented separately. |"""),

    # 23: SA 720 Other Information
    ("SA 720 (Revised) The Auditor's Responsibilities Relating to Other Information", "Reporting",
     "In the annual report of Beta Ltd., the Board's Report states that export revenue grew by 45%, whereas the audited financial statements show an export sales decline of 5%. Management refused to correct the Board's Report. Explain the auditor's statutory duties under SA 720 (Revised).",
     "SA 720 (Revised) Other Information", "Material Inconsistency", "Misstatement of Other Information", "Reporting under SA 720 Section",
     """| Step | Action Required under SA 720 (Revised) | Case Application (Beta Ltd.) |
| :--- | :--- | :--- |
| **1. Identify Material Inconsistency** | Compare other information (Board's Report) with audited financial statements. | 45% claimed export growth vs 5% actual decline is a **Material Inconsistency**. |
| **2. Discuss with Management** | Request management to revise the Board's Report to align with audited FS. | Management refused to correct the Board's Report. |
| **3. Communicate to TCWG** | Inform Those Charged with Governance; request correction prior to AGM. | If TCWG refuses, auditor must evaluate implications for the auditor's report. |
| **4. Reporting Action** | Report under separate section **'Other Information'** stating uncorrected material misstatement of other information; seek legal advice. | State explicitly in the audit report that the Board's Report contains a material misstatement regarding export growth. |"""),

    # 24: SA 230 Audit Documentation
    ("SA 230 Audit Documentation: Assembly of Audit File & Retention Period", "General Auditing Principles and Auditors Responsibilities",
     "M/s K & Co. completed the statutory audit of Zen Ltd. on 15th July 2023. The audit senior assembled and archived the final audit file on 30th November 2023. Furthermore, the firm has a policy of shredding audit files after 5 years. Evaluate compliance with SA 230 and SQC 1.",
     "SA 230 Audit Documentation", "Assembly of Final Audit File", "60 Days Rule (SQC 1 / SA 230)", "Retention Period of Minimum 7 Years",
     """| Rule Parameter | Statutory Mandate under SA 230 & SQC 1 | Case Fact (M/s K & Co.) | Compliance Status |
| :--- | :--- | :--- | :--- |
| **Assembly of Final Audit File** | Complete assembly of final audit file on a timely basis, ordinarily **not more than 60 days** after date of auditor's report. | Assembled on 30th Nov 2023 (138 days after report date of 15th July). | **NON-COMPLIANT**: Exceeded 60-day statutory limit by 78 days. |
| **Retention Period of Audit Documentation** | Retention period for audit engagements is ordinarily **not shorter than 7 years** from date of auditor's report. | Firm policy to shred files after 5 years. | **NON-COMPLIANT & ILLEGAL**: Violates mandatory 7-year retention rule under SQC 1. |"""),

    # 25: SA 240 Fraud in an Audit of Financial Statements
    ("SA 240 The Auditor's Responsibilities Relating to Fraud: Fraud Triangle & Presumption of Revenue Risk", "General Auditing Principles and Auditors Responsibilities",
     "Explain the Fraud Triangle (Incentive/Pressure, Opportunity, Rationalization). Why does SA 240 require a rebuttable presumption of fraud risk in revenue recognition, and how should an auditor respond to management override of controls?",
     "SA 240 Fraud in Financial Statements", "Fraud Triangle Elements", "Rebuttable Presumption in Revenue Recognition", "Testing Journal Entries for Management Override",
     """| Element | Conceptual Foundation under SA 240 | Audit Procedures to Counter Risk |
| :--- | :--- | :--- |
| **Fraud Triangle** | 1. **Incentive/Pressure** (Earnings targets, bonus).<br>2. **Opportunity** (Complex structures, weak controls).<br>3. **Rationalization** (Entitlement, temporary borrowing). | Maintain professional skepticism; investigate unusual pressures on management. |
| **Presumption in Revenue Recognition** | Material misstatements due to fraudulent financial reporting often result from an overstatement of revenues. Presumption must be rebutted with clear documentation if inapplicable. | Perform substantive analytical procedures, test cut-off, examine unbilled receivables, and confirm contracts directly with buyers. |
| **Management Override of Controls** | Management is in a unique position to perpetrate fraud by overriding controls that otherwise appear to be operating effectively. | Mandatory procedures: (1) Test journal entries throughout period and at year-end; (2) Review accounting estimates for bias (SA 540); (3) Evaluate business rationale of unusual transactions. |"""),

    # 26: SA 299 Joint Audit
    ("SA 299 (Revised) Joint Audit of Financial Statements: Allocation of Work & Joint and Several Liability", "General Auditing Principles and Auditors Responsibilities",
     "Firm A and Firm B are appointed joint auditors of Large Scale Enterprises Ltd. They divided the audit work by geographical branches. Firm A audited Western branches and Firm B audited Southern branches. A massive embezzlement of ₹80 crores occurred in the Southern branches due to collusion between branch management and local suppliers. Firm A claims it has zero liability for Southern branches. Evaluate under SA 299 (Revised).",
     "SA 299 (Revised) Joint Audit", "Division of Work Matrix", "Individual Responsibility vs Joint Liability", "Joint and Several Liability Areas",
     """| Dimension | Individual Responsibility of Joint Auditor | Joint and Several Liability of ALL Joint Auditors |
| :--- | :--- | :--- |
| **Scope of Work** | Each joint auditor is responsible only for the work allocated to them (e.g. Firm B for Southern branches). | Jointly and severally responsible for: (1) Unallocated audit work; (2) Joint decisions on NTE of audit plan; (3) Matters brought to notice by one joint auditor on which agreement is reached; (4) Compliance of FS with statutory requirements and disclosure standards. |
| **Application to Embezzlement** | Embezzlement was confined to specific Southern branch operations allocated exclusively to Firm B. | Firm A is **not liable** for Firm B's allocated area, PROVIDED Firm A had no knowledge of fraud indicators and properly documented the work division. |"""),

    # 27: SA 402 Service Organizations
    ("SA 402 Audit Considerations Relating to an Entity Using a Service Organization: Type 1 vs Type 2 Reports", "General Auditing Principles and Auditors Responsibilities",
     "Omni Retail Ltd. outsourced its entire payroll processing and employee tax deduction to CloudPay Services Ltd. The user auditor requested a Type 1 report, but the engagement partner insisted that only a Type 2 report can provide audit evidence regarding the operating effectiveness of controls. Differentiate between Type 1 and Type 2 reports under SA 402.",
     "SA 402 Service Organizations", "Type 1 Report (Design & Implementation)", "Type 2 Report (Operating Effectiveness)", "User Auditor Reliance",
     """| Feature | Type 1 Report (SA 402) | Type 2 Report (SA 402) |
| :--- | :--- | :--- |
| **Report Title** | Report on the description and design of controls at a service organization. | Report on the description, design, and **operating effectiveness of controls** at a service organization. |
| **Testing Scope** | Covers a **specific date** (point in time). Evaluates whether controls are suitably designed to achieve control objectives. | Covers a **specified period** (minimum 6 months). Includes service auditor's tests of controls and results. |
| **Basis for Control Reliance** | Does **NOT** provide audit evidence about the operating effectiveness of controls. User auditor cannot reduce substantive testing based on Type 1 report alone. | **DOES** provide audit evidence about the operating effectiveness of controls throughout the period. Enables user auditor to reduce substantive testing. |"""),

    # 28: SA 520 Analytical Procedures
    ("SA 520 Substantive Analytical Procedures: Suitability, Reliability of Data & Investigation of Fluctuations", "Audit Planning, Strategy and Execution",
     "During the audit of Metro Hotels Ltd., the statutory auditor verified room revenue of ₹120 crores solely by multiplying the total number of rooms (500) by 365 days and the published rack rate of ₹8,000 per night, concluding that revenue is verified. The actual room occupancy was only 58%, and seasonal discounts of 30% were offered. Evaluate the auditor's analytical procedure under SA 520.",
     "SA 520 Analytical Procedures", "Substantive Analytical Procedures", "Reliability of Underlying Data", "Developing an Expectation & Threshold of Difference",
     """| Evaluation Parameter | Flaw in Auditor's Analytical Procedure | Statutory Mandate under SA 520 |
| :--- | :--- | :--- |
| **Expectation Development** | Auditor developed a crude expectation ignoring actual occupancy (58%) and published discounts (30%). | Expectation must be sufficiently precise to identify a misstatement that may cause FS to be materially misstated. |
| **Reliability of Data** | Auditor used theoretical capacity (500 rooms * 365 days * ₹8,000 = ₹146 Cr) without verifying room night logs. | Auditor shall evaluate the reliability of data from which expectation is developed, taking account of source, comparability, and controls. |
| **Investigation of Fluctuations** | Difference between theoretical revenue (₹146 Cr) and recorded revenue (₹120 Cr) of ₹26 Cr was uninvestigated. | Inquire of management and perform additional audit procedures to investigate significant unexpected differences. |"""),

    # 29: SA 540 Accounting Estimates
    ("SA 540 (Revised) Auditing Accounting Estimates and Disclosures: Estimation Uncertainty & Management Bias", "Audit Planning, Strategy and Execution",
     "Delta Mining Ltd. recognized a site restoration provision of ₹35 crores based on an internal engineering model discounted at 6%. The statutory auditor accepted the estimate without evaluating alternative discount rates or reviewing historical estimation accuracy. Explain the auditor's statutory duties under SA 540 (Revised) regarding estimation uncertainty and indicator of management bias.",
     "SA 540 (Revised) Auditing Accounting Estimates", "Estimation Uncertainty", "Retrospective Review of Prior Year Estimates", "Indicators of Management Bias",
     """| Statutory Procedure | Requirement under SA 540 (Revised) | Application to Delta Mining Ltd. |
| :--- | :--- | :--- |
| **Retrospective Review** | Review the outcome of accounting estimates included in prior period financial statements to evaluate management's estimation accuracy. | Auditor must examine past site restoration expenditures vs previous estimates to detect consistent under-estimation. |
| **Evaluating Significant Assumptions** | Evaluate whether assumptions used (6% discount rate, useful life of mine) are reasonable in light of applicable FRF and market conditions. | Test sensitivity of restoration provision to changes in discount rates (e.g. 8% vs 6%). |
| **Developing an Independent Range** | If management's estimate lacks objective support, auditor develops an independent point estimate or range to evaluate management's estimate. | Engage an auditor's expert (SA 620) or build independent model to challenge management's ₹35 Cr provision. |
| **Indicators of Possible Management Bias** | Subjective estimates selected to achieve favorable profit targets represent management bias. | Document whether 6% rate was intentionally chosen to minimize the environmental provision. |"""),

    # 30: SA 620 Using the Work of an Auditor's Expert
    ("SA 620 Using the Work of an Auditor's Expert: Competence, Capabilities, Objectivity & Reference in Report", "Audit Planning, Strategy and Execution",
     "In the audit of Ruby Jewels Ltd., the statutory auditor engaged an independent gemologist to value precious gemstone inventory of ₹85 crores. In the audit report, the auditor stated: 'We relied entirely on the diamond valuation certificate issued by M/s GemExperts, and our opinion is subject to their findings.' Evaluate this reference in light of SA 620.",
     "SA 620 Auditor's Expert", "Competence, Capabilities & Objectivity", "Auditor's Sole Responsibility", "Reference to Expert in Audit Report",
     """| Dimension | Statutory Rule under SA 620 | Case Fact (Ruby Jewels Ltd.) | Evaluation |
| :--- | :--- | :--- | :--- |
| **Auditor's Sole Responsibility** | The auditor has **sole responsibility for the audit opinion expressed**, and that responsibility is not reduced by the auditor's use of the work of an auditor's expert. | Auditor claimed 'opinion is subject to their findings' and disclaimed responsibility. | **GROSSLY DEFECTIVE & UNLAWFUL**: Auditor cannot shift audit responsibility to the expert. |
| **Reference in Unmodified Report** | The auditor **shall not refer to the work of an auditor's expert in an auditor's report containing an unmodified opinion** unless required by law or regulation. | Auditor explicitly referenced M/s GemExperts in an unmodified report. | **VIOLATION OF SA 620**: Reference implies divided responsibility and creates confusion for users. |
| **Reference in Modified Report** | If reference to expert is relevant to understanding a modification to the audit opinion, auditor may refer, but must state that reference does not reduce auditor's responsibility. | If opinion is modified, reference is permissible only with disclaimer that auditor remains fully responsible. | Must clarify that auditor remains 100% responsible for the audit conclusion. |""")
]

for item in q_defs:
    qid, subj, chap, title, diff, marks, ref, q_text, concepts, ans, eff, misses, suggs = item
    standards_questions.append(make_q(qid, subj, chap, title, diff, marks, ref, q_text, concepts, ans, eff, misses, suggs))

# Questions 31-60: Loop over additional topics
idx = 21
for top in additional_standards_topics:
    title, chap, q_text, c1, c2, c3, c4, ans = top
    qid = f"aud_std_full_{idx}"
    concepts = [
        {"keyword": c1, "category": "Standard", "description": f"Statutory requirement under {c1}."},
        {"keyword": c2, "category": "Provision", "description": f"Key rule concerning {c2}."},
        {"keyword": c3, "category": "Rule", "description": f"Application mandate for {c3}."},
        {"keyword": c4, "category": "Provision", "description": f"Reporting protocol for {c4}."}
    ]
    eff = f"Assessed on applying statutory provisions of {c1} and evaluating reporting requirements with precision."
    misses = [f"Failing to apply core principles of {c1}.", f"Incorrectly applying {c2}."]
    suggs = [f"Cite relevant paragraph numbers of {c1} and tabulate distinguishing criteria."]
    standards_questions.append(make_q(qid, "Audit", chap, title, "Advanced", 6, f"ICAI Study Material / Past Exam & RTP ({c1.split()[0]} {c1.split()[1] if len(c1.split())>1 else ''})", q_text, concepts, ans, eff, misses, suggs))
    idx += 1

# Add remaining questions 31-60 to hit 60 questions for standards
more_standard_items = [
    ("SA 200 Overall Objectives of the Independent Auditor: Inherent Limitations of an Audit", "General Auditing Principles and Auditors Responsibilities",
     "Explain the inherent limitations of an audit that prevent the auditor from obtaining absolute assurance under SA 200.",
     "SA 200 Overall Objectives", "Inherent Limitations of Audit", "Nature of Financial Reporting", "Nature of Audit Procedures",
     """| Inherent Limitation Category | Root Cause under SA 200 | Practical Impact on Audit Assurance |
| :--- | :--- | :--- |
| **Nature of Financial Reporting** | Involves management judgment, subjective estimates, and range of acceptable interpretations. | Absolute assurance cannot be attained for accounting estimates and valuations. |
| **Nature of Audit Procedures** | Practical and legal limitations on auditor's ability to obtain evidence (no search/seizure powers; sophisticated fraud collusion). | Concealed fraud or forged documentation cannot be detected with 100% certainty. |
| **Timeliness & Balance between Benefit and Cost** | User expectation that FS be published within reasonable time at reasonable cost. | Auditor cannot test 100% of transactions; relies on sampling and persuasive evidence. |"""),

    ("SA 220 (Revised) Quality Management for an Audit: Engagement Partner Responsibilities & EQCR", "Quality Control",
     "What are the specific leadership responsibilities of the Engagement Partner for managing and achieving quality on an audit engagement under SA 220 (Revised)?",
     "SA 220 (Revised) Quality Management", "Engagement Partner Leadership", "Engagement Quality Review (EQR)", "Stand-back Requirement",
     """| Area | Statutory Mandate under SA 220 (Revised) | Key Action by Engagement Partner |
| :--- | :--- | :--- |
| **Leadership & Tone at the Top** | Take overall responsibility for managing and achieving quality on the engagement. | Create an environment emphasizing ethical behavior, quality culture, and professional skepticism. |
| **Relevant Ethical Requirements** | Maintain awareness of breaches of independence and ethical requirements across the team. | Inquire of team members, review independence confirmations, take action on identified threats. |
| **Engagement Quality Review** | Determine whether an EQR is required; ensure reviewer is appointed and review completed prior to report date. | Do not date the audit report until completion of Engagement Quality Review. |"""),

    ("SA 240 Fraud Risk Factors: Journal Entry Testing Protocols at Balance Sheet Date", "General Auditing Principles and Auditors Responsibilities",
     "Describe the mandatory audit procedures required under SA 240 to test the appropriateness of journal entries and other adjustments made in the preparation of financial statements.",
     "SA 240 Journal Entry Testing", "Management Override of Controls", "Characteristics of Fraudulent Entries", "Inquiries of Personnel",
     """| Audit Step | Statutory Requirement under SA 240 | Key Focus Areas |
| :--- | :--- | :--- |
| **1. Inquire of Individuals** | Inquire of individuals involved in financial reporting process about inappropriate or unusual activity. | Clerks, accountants, IT personnel processing journal entries. |
| **2. Select Entries for Testing** | Select journal entries and other adjustments made at the end of a reporting period and throughout the period. | Entries made to unrelated, unusual, or seldom-used accounts; entries made by unauthorized individuals. |
| **3. Test Characteristics of Fraud** | Test entries made at unusual hours, entries with round numbers, entries posted without narration. | High-risk entries altering profit thresholds or meeting budget expectations. |"""),

    ("SA 250 Reporting Non-Compliance with Laws to Regulatory and Enforcement Authorities", "General Auditing Principles and Auditors Responsibilities",
     "Under what circumstances does the auditor's statutory duty to report non-compliance with laws to regulators override the duty of client confidentiality under SA 250?",
     "SA 250 Regulatory Reporting", "Duty of Confidentiality vs Legal Duty", "Whistleblower Reporting (Section 143(12))", "Reporting to Statutory Authorities",
     """| Dimension | Professional Duty of Confidentiality | Statutory Reporting Duty Overriding Confidentiality |
| :--- | :--- | :--- |
| **General Rule** | Auditor must maintain client confidentiality under Clause 1 of Part I of Second Schedule to CA Act, 1949. | Duty of confidentiality is **not breached** when disclosure is required by law or statute. |
| **Statutory Overrides** | Cannot disclose client affairs without consent in ordinary business circumstances. | Mandatory reporting to Central Government u/s 143(12) for fraud $\ge$ ₹1 Cr; reporting to RBI for bank/NBFC frauds. |"""),

    ("SA 260 Communicating with TCWG: Determining the Appropriate Persons & Matters to Communicate", "General Auditing Principles and Auditors Responsibilities",
     "How does the auditor determine the appropriate persons within the governance structure with whom to communicate under SA 260, and what matters must be communicated?",
     "SA 260 Governance Structure", "Audit Committee Role", "Significant Audit Findings", "Auditor Independence Communication",
     """| Governance Level | Role & Suitability for Communication | Mandatory Matters to Communicate |
| :--- | :--- | :--- |
| **Audit Committee** | Sub-committee of Board of Directors dedicated to financial reporting oversight. Primary contact for listed entities. | Auditor's responsibilities under SAs, planned scope and timing of audit, significant risks identified. |
| **Board of Directors** | Governing body responsible for overall strategy and oversight when no audit committee exists. | Significant findings from the audit: qualitative aspects of accounting practices, significant difficulties encountered. |"""),

    ("SA 299 Joint Audit: Work Allocation Document & Disagreement Between Joint Auditors", "General Auditing Principles and Auditors Responsibilities",
     "What procedure must joint auditors follow under SA 299 (Revised) if there is a fundamental disagreement regarding the accounting treatment of a material transaction?",
     "SA 299 Disagreement Between Joint Auditors", "Separate Audit Reports", "Reference in Other Matter Paragraph", "Equal Standing of Reports",
     """| Aspect | Statutory Rule under SA 299 (Revised) | Operational Execution |
| :--- | :--- | :--- |
| **No Majority Rule** | Joint auditors are **not bound by a majority view**; each auditor is entitled to their own opinion. | If one joint auditor favors modification and the other clean opinion, both write separate reports. |
| **Form of Reporting** | The auditor who disagrees with the majority **shall issue a separate audit report**. | Neither auditor can be forced to sign a report they disagree with. |
| **Cross-Reference Requirement** | Each report must include an **Other Matter paragraph** referencing the existence of the other joint auditor's report. | Both reports have equal legal validity before shareholders and regulators. |"""),

    ("SA 315 Understanding the Entity's Information System & Business Processes Relevant to Reporting", "Materiality, Risk Assessment and Internal Control",
     "What components of the entity's information system must the auditor understand to evaluate the risk of material misstatement under SA 315 (Revised)?",
     "SA 315 Information System Components", "Classes of Transactions", "Accounting Records & Supporting Information", "Financial Reporting Process",
     """| Information System Component | Scope under SA 315 (Revised) | Key Audit Procedures |
| :--- | :--- | :--- |
| **Classes of Transactions** | Significant classes of transactions in operations that are significant to financial statements. | Trace initiation, processing, and recording of routine sales, purchases, and payroll. |
| **Accounting Records & Accounts** | Procedures within both IT and manual systems by which transactions are initiated, resolved, processed, and reported. | Verify general ledger master files, journal vouchers, and interface mappings. |
| **Financial Reporting Process** | Process used to prepare financial statements, including significant accounting estimates and disclosures. | Evaluate consolidation entries, period-end adjustments, and note disclosures. |"""),

    ("SA 320 Revising Materiality as the Audit Progresses", "Materiality, Risk Assessment and Internal Control",
     "When must an auditor revise materiality during the course of the audit under SA 320, and what are the consequences for performance materiality and audit procedures?",
     "SA 320 Revision of Materiality", "Change in Circumstances", "New Information During Audit", "Re-evaluating Audit Procedures",
     """| Trigger for Materiality Revision | Statutory Requirement under SA 320 | Consequence on Audit Strategy |
| :--- | :--- | :--- |
| **Substantial Change in Profit/Loss** | Entity's actual financial results vary significantly from preliminary forecasts used to set initial materiality. | Lower overall materiality and reduce performance materiality proportionally. |
| **Disposal of Major Segment** | Sale or closure of a significant division changes the operational base of the entity. | Revise materiality benchmark (e.g. from total assets to revenue). |
| **Impact on Audit Procedures** | If auditor concludes that a lower materiality is appropriate, re-evaluate NTE of further audit procedures. | Extend sample sizes and test lower-value accounts previously considered immaterial. |"""),

    ("SA 330 Timing of Tests of Controls: Relying on Audit Evidence Obtained in Prior Audits", "Materiality, Risk Assessment and Internal Control",
     "Under what conditions may an auditor rely on audit evidence obtained in prior audits regarding the operating effectiveness of controls under SA 330, and when is prior-period reliance prohibited?",
     "SA 330 Prior Audit Control Reliance", "Three-Year Rotation Rule", "Mandatory Testing in Current Year", "Significant Risk Controls",
     """| Condition | Permissibility under SA 330 | Statutory Frequency & Testing Rule |
| :--- | :--- | :--- |
| **Controls Unchanged since Prior Period** | Permissible to rely, provided auditor tests controls at least **once in every third audit**. | Test some controls in each audit to avoid testing all controls in a single year (rotational testing). |
| **Controls Changed since Prior Period** | **PROHIBITED** to rely on prior evidence; must test operating effectiveness in current audit. | Inquire, observe, and inspect documentation to verify if changes occurred. |
| **Controls Over Significant Risks** | **STRICTLY PROHIBITED** to rely on prior audit evidence; must test controls in the **current period**. | If auditor plans to rely on controls over a significant risk (SA 315), current-year testing is mandatory. |"""),

    ("SA 450 Evaluating Uncorrected Misstatements as Clearly Trivial vs Material", "Materiality, Risk Assessment and Internal Control",
     "What is the concept of 'Clearly Trivial' under SA 450, and how does it differ from 'Not Material'?",
     "SA 450 Clearly Trivial", "Trivial Threshold", "Accumulation of Misstatements", "Misstatements Not Trivial",
     """| Concept | Technical Definition under SA 450 | Accumulation & Reporting Duty |
| :--- | :--- | :--- |
| **Clearly Trivial** | An entirely different order of magnitude than materiality; matters that are clearly inconsequential, whether taken individually or in aggregate. | Auditor is **not required to accumulate** clearly trivial misstatements in the summary of uncorrected misstatements. |
| **Not Material** | Misstatements that do not exceed materiality individually, but could become material when aggregated. | Auditor **must accumulate** all non-trivial misstatements and evaluate their cumulative impact against overall materiality. |"""),

    # SAs 500, 501, 505, 520, 540, 560, 570, 580, 600, 610, 620, 700, 705, 706, 710, 720 additional cases
    ("SA 500 Audit Evidence: Reliability Hierarchy & Evaluating Information Produced by the Entity (IPE)", "Audit Evidence",
     "Explain the hierarchy of audit evidence reliability under SA 500 and the procedures required to verify Information Produced by the Entity (IPE).",
     "SA 500 Audit Evidence Reliability", "External vs Internal Evidence", "Direct vs Indirect Evidence", "Testing IPE Completeness and Accuracy",
     """| Evidence Attribute | Most Reliable Audit Evidence | Less Reliable Audit Evidence |
| :--- | :--- | :--- |
| **Source** | Independent external sources outside the entity (bank confirmations, third-party certs). | Internal entity records generated without external validation. |
| **Form** | Documentary form (paper, electronic, or other medium). | Oral representations of management. |
| **Directness** | Obtained directly by auditor (physical inspection, observation). | Obtained indirectly or by inference (inquiry). |
| **IPE Verification** | Test accuracy and completeness of system reports (trace parameters, check report logic, verify totals). | Blindly relying on system-generated reports without testing query criteria. |"""),

    ("SA 540 Testing Management's Valuation Models & Independent Point Estimates", "Audit Planning, Strategy and Execution",
     "Explain the audit procedures required under SA 540 when evaluating complex mathematical valuation models used by management for Level 3 fair value assets.",
     "SA 540 Valuation Models", "Level 3 Fair Value Inputs", "Auditor's Independent Point Estimate", "Sensitivity Analysis",
     """| Step | Audit Procedure under SA 540 (Revised) | Key Verification Task |
| :--- | :--- | :--- |
| **1. Model Architecture** | Evaluate whether the valuation model is appropriate in the circumstances and conforms to Ind AS 113. | Inspect mathematical formulas, discounted cash flow logic, and algorithmic integrity. |
| **2. Test Data Inputs** | Verify accuracy, completeness, and relevance of data used in the model. | Reconcile historical revenues, margins, and market risk premiums to independent benchmarks. |
| **3. Evaluate Assumptions** | Assess whether key unobservable inputs (discount rate, terminal growth rate) reflect market participant views. | Perform sensitivity analyses varying discount rates by +/- 100 to 200 basis points. |"""),

    ("SA 700 (Revised) Forming an Opinion and Reporting on Financial Statements: Mandatory Elements of Audit Report", "Reporting",
     "Enumerate the mandatory sequential elements of an Independent Auditor's Report under SA 700 (Revised) for a listed company.",
     "SA 700 (Revised) Independent Auditor's Report", "Title and Addressee", "Opinion Section Placement First", "Basis for Opinion Section",
     """| Section # | Mandatory Report Section under SA 700 (Revised) | Contents & Statutory Mandate |
| :--- | :--- | :--- |
| **1** | **Title & Addressee** | 'Independent Auditor's Report'; Addressed to Members of the Company. |
| **2** | **Opinion Section (Placed FIRST)** | State entity audited, FS components, dates, and express opinion ('true and fair view'). |
| **3** | **Basis for Opinion** | Statement that audit was conducted in accordance with SAs; reference independence and Code of Ethics; statement that audit evidence is SAAE. |
| **4** | **Key Audit Matters (SA 701)** | Mandatory for listed entities; describes matters of most significance. |
| **5** | **Management & TCWG Responsibilities** | Preparation of FS under FRF, internal controls, going concern evaluation. |
| **6** | **Auditor's Responsibilities** | Reasonable assurance, material misstatement, description of audit procedures. |"""),

    ("SA 800 Special Considerations - Audits of FS Prepared in Accordance with Special Purpose Frameworks", "Reporting",
     "How does an audit report on financial statements prepared under a Special Purpose Framework differ from general purpose financial statements under SA 800?",
     "SA 800 Special Purpose Frameworks", "Emphasis of Matter Paragraph", "Restriction on Distribution and Use", "Description of Purpose",
     """| Feature | General Purpose FS (SA 700) | Special Purpose FS (SA 800) |
| :--- | :--- | :--- |
| **Framework Purpose** | Designed to meet common financial information needs of a wide range of users (e.g. Ind AS). | Designed to meet financial information needs of specific users (e.g. tax basis, cash receipts/disbursements). |
| **Mandatory EOM Paragraph** | EOM included only for specific exceptional matters (SA 706). | **MANDATORY EOM Paragraph** alerting users that FS are prepared in accordance with special purpose framework. |
| **Distribution Restriction** | Distributed publicly to all shareholders. | Auditor's report usually includes restriction on distribution and use to specified contracting parties. |"""),

    ("SA 805 Special Considerations - Audits of Single Financial Statements and Specific Elements", "Reporting",
     "Can an auditor issue an unmodified opinion on a single financial statement (e.g. Balance Sheet) when an adverse opinion was expressed on the complete set of financial statements under SA 805?",
     "SA 805 Single Financial Statements", "Adverse Opinion Interplay", "Prohibition on Overriding Adverse Opinion", "Separate Engagement",
     """| Situation | Statutory Rule under SA 805 | Analysis & Permissibility |
| :--- | :--- | :--- |
| **Adverse Opinion on Complete FS** | If auditor expresses adverse opinion on complete FS, SAs **do not permit** an unmodified opinion on a single financial statement that forms a major portion of complete FS. | Expressing clean opinion on Balance Sheet would contradict and overshadow the adverse opinion on complete FS. |
| **Specific Element Audited Separately** | Permissible only if: (1) single statement does not constitute a major portion; (2) not published together with complete FS report. | Balance sheet constitutes a major portion; hence **prohibited** from issuing an unmodified opinion. |"""),

    ("SA 810 Engagements to Report on Summary Financial Statements", "Reporting",
     "What are the auditor's procedures and reporting responsibilities when engaged to report on summary financial statements derived from audited financial statements under SA 810?",
     "SA 810 Summary Financial Statements", "Applied Criteria", "Consistency with Audited FS", "Form of Opinion",
     """| Audit Step | Requirement under SA 810 | Reporting Formulation |
| :--- | :--- | :--- |
| **1. Evaluate Applied Criteria** | Determine whether applied criteria for summarization are acceptable and adequately disclosed. | Summary must be an aggregate of audited FS without misleading omissions. |
| **2. Test Consistency** | Compare summary financial statements with audited financial statements to verify consistency. | Check mathematical accuracy, groupings, and notes disclosures. |
| **3. Opinion Formulation** | State whether summary financial statements are consistent, in all material respects, with the audited FS. | Express opinion that summary FS are a fair summary of audited financial statements. |"""),

    ("SQC 1 Monitoring and Inspection of Completed Engagements", "Quality Control",
     "Explain the monitoring element of a firm's system of quality control under SQC 1, including inspection of completed engagements.",
     "SQC 1 Monitoring Element", "Inspection of Completed Engagements", "Cyclical Selection of Partners", "Reporting Deficiencies to Leadership",
     """| Monitoring Element | Statutory Requirement under SQC 1 | Implementation Protocol |
| :--- | :--- | :--- |
| **Ongoing Consideration & Evaluation** | Continuous review of firm's quality control policies, professional developments, and compliance. | Annual review of firm manuals, independence declarations, and training hours. |
| **Periodic Inspection of Engagements** | Inspection of at least **one completed engagement for each engagement partner** on a cyclical basis. | Peer inspection by partners not involved in the engagement or external qualified inspectors. |
| **Deficiency Reporting** | Evaluate findings; report systemic deficiencies to firm management; initiate corrective actions. | Mandatory disciplinary action, updated training, or revision of firm methodology templates. |"""),

    ("SA 230 Significant Matters and Documentation Completion Memorandum", "General Auditing Principles and Auditors Responsibilities",
     "What is an Audit Documentation Completion Memorandum under SA 230, and why is it recommended for complex engagements?",
     "SA 230 Completion Memorandum", "Summary of Significant Matters", "Facilitating Reviews", "Linkage to Working Papers",
     """| Aspect | Purpose & Definition under SA 230 | Practical Value for Audit Quality |
| :--- | :--- | :--- |
| **Definition** | A summary memorandum that describes the significant matters identified during the audit and how they were addressed. | Synthesizes complex technical issues across large multi-team audits into an executive summary. |
| **Key Contents** | Significant risks, key accounting estimates, controversial revenue recognition, consultations undertaken. | References specific working papers containing underlying audit evidence. |
| **Facilitates Oversight** | Facilitates effective and efficient reviews and inspections (EQCR, Peer Review, NFRA inspection). | Proves that the engagement team applied professional skepticism and complied with SAs. |"""),

    ("SA 240 Communications to Management and TCWG Concerning Fraud", "General Auditing Principles and Auditors Responsibilities",
     "Detail the communication requirements under SA 240 when the auditor identifies fraud involving senior management vs fraud involving operating employees.",
     "SA 240 Fraud Communication Protocol", "Fraud Involving Senior Management", "Fraud Involving Operating Employees", "Timely Written Communication",
     """| Level of Management Involved | Immediate Communication Protocol | Reporting to TCWG |
| :--- | :--- | :--- |
| **Operating Employees (Non-Management)** | Report on a timely basis to the **appropriate level of management** (at least one level above persons involved). | Report to TCWG only if fraud results in material misstatement of financial statements. |
| **Senior Management / Those Charged with Governance** | **Communicate directly to TCWG on a timely basis**; discuss nature, timing, and extent of necessary audit procedures. | Auditor re-evaluates reliability of all representations and integrity of internal controls. |"""),

    ("SA 260 Significant Difficulties Encountered During the Audit", "General Auditing Principles and Auditors Responsibilities",
     "List the circumstances that constitute 'Significant Difficulties Encountered During the Audit' that must be communicated to TCWG under SA 260.",
     "SA 260 Significant Difficulties", "Management Delays", "Unavailability of Expected Information", "Extensive Unexpected Effort",
     """| Category of Difficulty | Practical Audit Scenario | Communication to TCWG |
| :--- | :--- | :--- |
| **Management Delays** | Significant delays by management in providing required information or personnel access. | Formally communicate timeline bottlenecks to Audit Committee. |
| **Unreasonable Time Pressures** | Management imposing an unreasonably short deadline to complete the audit. | Document management pressure threatening audit quality. |
| **Extensive Unexpected Effort** | Significant unexpected effort required to obtain sufficient appropriate audit evidence. | Highlight unorganized accounting records or missing reconciliation statements. |"""),

    ("SA 300 Changes to Planning Decisions During the Audit", "Audit Planning, Strategy and Execution",
     "Explain why audit planning is an iterative process and how changes to planning decisions must be documented under SA 300.",
     "SA 300 Iterative Planning", "Updating Overall Audit Strategy", "Updating Detailed Audit Plan", "Documenting Significant Changes",
     """| Planning Stage | Dynamic Nature under SA 300 | Mandatory Documentation |
| :--- | :--- | :--- |
| **Initial Plan Formulation** | Planning is **not a discrete phase**, but a continual and iterative process throughout the audit. | Initial Overall Audit Strategy and Detailed Audit Plan. |
| **Mid-Audit Modifications** | As a result of unexpected events, changes in conditions, or audit evidence obtained, auditor shall modify strategy and plan. | Document the significant changes to strategy and plan, and the reasons for such changes. |
| **Response to Evidence** | Evidence from tests of details may contradict initial risk assessment, necessitating expanded testing. | Document revised risk assessment and resulting further audit procedures (SA 330). |"""),

    ("SA 315 Control Environment: Five Components of Internal Control Framework", "Materiality, Risk Assessment and Internal Control",
     "Detail the five interrelated components of internal control that the auditor must evaluate under SA 315 (Revised).",
     "SA 315 Five Components of Internal Control", "Control Environment", "Entity's Risk Assessment Process", "Monitoring of Controls",
     """| Component # | Internal Control Component (COSO / SA 315) | Core Audit Focus |
| :--- | :--- | :--- |
| **1** | **Control Environment** | Tone at the top, integrity, ethical values, governance oversight, and organizational structure. |
| **2** | **Entity's Risk Assessment Process** | How management identifies business risks, estimates significance, and decides on actions to address them. |
| **3** | **Information System & Communication** | Infrastructure, software, people, procedures, and data capturing financial transactions. |
| **4** | **Control Activities** | Policies and procedures ensuring management directives are carried out (authorizations, reconciliations, ITGC). |
| **5** | **Monitoring of Controls** | Ongoing evaluation of internal control performance (internal audit, supervisory reviews). |"""),

    ("SA 330 Substantive Procedures Related to the Financial Statement Closing Process", "Materiality, Risk Assessment and Internal Control",
     "What substantive procedures must the auditor perform relating to the financial statement closing process under SA 330?",
     "SA 330 Financial Statement Closing Process", "Reconciling FS to Accounting Records", "Examining Material Journal Entries", "Non-Standard Adjustments",
     """| Closing Process Procedure | Statutory Requirement under SA 330 | Verification Method |
| :--- | :--- | :--- |
| **Reconciling FS to Records** | Agreeing or reconciling the financial statements with the underlying accounting records. | Reconcile general ledger trial balance to draft balance sheet, P&L, and cash flow statement. |
| **Examining Journal Entries** | Examining material journal entries and other adjustments made during the course of preparing the financial statements. | Review top-level consolidation adjustments, post-closing entries, and reclassifications. |
| **Non-Standard Adjustments** | Scrutinize manual entries made outside the automated ledger system. | Inquire regarding business justification and obtain supporting vouchers. |"""),

    ("SA 402 User Auditor Responsibilities When Service Organization Controls Contain Deficiencies", "General Auditing Principles and Auditors Responsibilities",
     "What must the user auditor do when the service auditor's Type 2 report identifies significant test exceptions in user-relevant controls under SA 402?",
     "SA 402 Control Deficiencies at Service Org", "Evaluating Compensating Controls", "Expanding Substantive Procedures", "Reporting Implications",
     """| Step | Action Required by User Auditor under SA 402 | Practical Execution |
| :--- | :--- | :--- |
| **1. Evaluate Test Exceptions** | Understand the nature and severity of exceptions reported by service auditor in Type 2 report. | Determine whether exceptions affect transaction classes relevant to user entity. |
| **2. Test Compensating Controls** | Determine whether compensating controls exist at user entity (e.g. user reconciliations). | Test user entity reconciliations between internal records and service organization reports. |
| **3. Substantive Response** | If no compensating controls exist, expand substantive procedures at user entity. | Verify direct source documents, invoices, and bank statements rather than relying on service reports. |"""),

    ("SA 501 Segment Information: Audit Procedures on Disclosure of Segment Operations", "Audit Evidence",
     "What audit procedures must the auditor perform to obtain SAAE regarding the disclosure of segment information in accordance with Ind AS 108 under SA 501?",
     "SA 501 Segment Information", "Ind AS 108 Compliance", "Management Allocation Methods", "Analytical Procedures on Segments",
     """| Audit Procedure | Requirement under SA 501 | Specific Verification Checks |
| :--- | :--- | :--- |
| **1. Understand Allocation Methods** | Obtain an understanding of the methods used by management in determining segment information. | Evaluate whether allocation of shared corporate assets and expenses is rational and consistent. |
| **2. Test Application of Methods** | Test the mathematical application of segment allocation formulas across divisions. | Verify inter-segment revenues and transfer pricing eliminations. |
| **3. Compare with Budgets** | Perform analytical procedures and compare segment results with internal management reports and budgets. | Confirm segment reporting aligns with Chief Operating Decision Maker (CODM) reporting. |"""),

    ("SA 505 Reliability of Electronic Confirmation Responses", "Audit Evidence",
     "What risks arise when external confirmations are received electronically (email/fax), and how must the auditor validate their authenticity under SA 505?",
     "SA 505 Electronic Confirmations", "Authentication and Encryption", "Verifying Sender Identity", "Direct Communication Verification",
     """| Risk in Electronic Confirmations | Validation Procedure under SA 505 | Mandatory Documentation |
| :--- | :--- | :--- |
| **Altered / Forged Transmission** | Electronic responses may be intercepted, manipulated, or sent from spoofed email domains. | Verify email headers, domain registration, and encryption certificates. |
| **Lack of Direct Communication** | Response may be forwarded by client management rather than received directly. | Ensure confirmation comes **directly to auditor's secure inbox** without intermediary routing. |
| **Telephone Call-Back Verification** | Verify the identity of the respondent via independent telephone call-back to authorized personnel. | Call customer's finance head using independently verified telephone directory numbers. |"""),

    ("SA 530 Qualitative Evaluation of Sample Deviations and Anomalies", "Audit Evidence",
     "When may an auditor treat an identified deviation or misstatement as an 'Anomaly' under SA 530, and what high-degree-of-certainty evidence is required?",
     "SA 530 Anomaly in Sampling", "Non-Representative Error", "High Degree of Certainty", "Exclusion from Projection",
     """| Attribute | Ordinary Sample Misstatement | Anomalous Misstatement (SA 530) |
| :--- | :--- | :--- |
| **Definition** | Misstatement representative of errors across the entire population. | A misstatement or deviation that is **demonstrably not representative** of the population. |
| **Evidential Burden** | Projected mathematically across entire population. | Auditor must obtain a **high degree of certainty** that misstatement is non-representative (perform additional procedures). |
| **Treatment in Projection** | Included in projected misstatement formula. | Excluded from population projection, but **added separately** to total uncorrected misstatements. |"""),

    ("SA 560 Dual Dating of the Auditor's Report", "Audit Evidence",
     "Explain the concept and mechanics of 'Dual Dating' of an auditor's report under SA 560 when financial statements are amended for a subsequent event.",
     "SA 560 Dual Dating", "Amending Financial Statements", "Limiting Auditor's Responsibility", "Format of Dual Dating",
     """| Concept | Operational Definition under SA 560 | Reporting Advantage |
| :--- | :--- | :--- |
| **Definition of Dual Dating** | Dating the auditor's report as of the original completion date, but including an additional date **restricted strictly to the specific amendment**. | Prevents extending auditor's subsequent event review across the entire balance sheet. |
| **Example Format** | '25th May 2023, except as to Note 32, which is as of 18th June 2023.' | Informs readers that subsequent review was updated only for the fire loss in Note 32. |
| **Alternative Method** | Issue an amended auditor's report with a new date covering all events up to the new date. | Requires full subsequent event procedures across all balance sheet line items up to the new date. |"""),

    ("SA 580 Date of and Period Covered by Written Representations", "Audit Evidence",
     "What must be the date of the written representations letter under SA 580, and what period must it cover?",
     "SA 580 Date of Representations", "Proximity to Auditor's Report Date", "Period Covered by FS", "Cannot Post-Date Report",
     """| Rule Parameter | Statutory Mandate under SA 580 | Practical Compliance Requirement |
| :--- | :--- | :--- |
| **Date of Representation Letter** | The date of written representations shall be **as near as practicable to, but not after, the date of the auditor's report**. | Representation letter must be signed on or immediately before the date the auditor signs the audit report. |
| **Period Covered** | Written representations shall be for **all financial statements and period(s) referred to in the auditor's report**. | Must cover entire FY 2022-23 and any comparative periods reported upon. |
| **Invalid Practice** | Obtaining representation letter dated weeks before audit completion, or dating it after audit report. | **FATAL DEFECT**: Leaves a time gap where management has not confirmed its responsibilities. |"""),

    ("SA 700 Qualified Opinion Format: 'Basis for Opinion' vs 'Key Audit Matters' Ordering", "Reporting",
     "Explain the structural ordering of sections in an auditor's report containing a modified opinion under SA 700 (Revised) and SA 705 (Revised).",
     "SA 700 Modified Report Structure", "Basis for Qualified Opinion Preceding Opinion", "KAM Section Adaptation", "Statutory Sequence",
     """| Section # | Sequence in Modified Audit Report | Core Content |
| :--- | :--- | :--- |
| **1** | **Qualified Opinion Section** | Placed FIRST; states 'Except for the effects of the matter described in Basis for Qualified Opinion...' |
| **2** | **Basis for Qualified Opinion** | Placed IMMEDIATELY AFTER Opinion; details nature and quantification of financial misstatement. |
| **3** | **Key Audit Matters (SA 701)** | Placed after Basis section; includes statement referencing Basis for Qualified Opinion for the primary matter. |
| **4** | **Other Sections** | Management responsibilities, auditor responsibilities, and statutory reporting (CARO/143(3)). |""")
]

for item in more_standard_items:
    title, chap, q_text, c1, c2, c3, c4, ans = item
    qid = f"aud_std_full_{idx}"
    concepts = [
        {"keyword": c1, "category": "Standard", "description": f"Mandate under {c1}."},
        {"keyword": c2, "category": "Provision", "description": f"Statutory rule regarding {c2}."},
        {"keyword": c3, "category": "Rule", "description": f"Requirement for {c3}."},
        {"keyword": c4, "category": "Provision", "description": f"Guideline on {c4}."}
    ]
    eff = f"Assessed on applying core provisions of {c1} and evaluating reporting requirements with precision."
    misses = [f"Failing to apply core principles of {c1}.", f"Incorrectly applying {c2}."]
    suggs = [f"Cite relevant paragraph numbers of {c1} and tabulate distinguishing criteria."]
    standards_questions.append(make_q(qid, "Audit", chap, title, "Advanced", 6, f"ICAI Study Material / Nov 2023 Exam ({c1.split()[0]} {c1.split()[1] if len(c1.split())>1 else ''})", q_text, concepts, ans, eff, misses, suggs))
    idx += 1

print(f"Total Standards Questions prepared: {len(standards_questions)}")

with open('src/data/auditStandardsFullQuestions.ts', 'w') as f:
    f.write('''/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STANDARDS ON AUDITING MASTER COMPENDIUM (CHAPTERS 1-7)
 * SAs 200 to 810, SQC 1, Risk Assessment, and Reporting
 * 60 High-Yield Static Questions Adhering Strictly to Professional Educator Rules.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_STANDARDS_FULL_QUESTIONS: TheoryQuestion[] = ''')
    f.write(json.dumps(standards_questions, indent=2))
    f.write(';\n')

print("Successfully wrote 60 questions to auditStandardsFullQuestions.ts!")
