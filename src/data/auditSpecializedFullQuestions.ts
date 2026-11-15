/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SPECIALIZED AUDIT AREAS MASTER COMPENDIUM (CHAPTERS 8-18)
 * Banks, NBFCs, Insurance, Related Services (SRS), Reviews (SRE),
 * Prospective Financial Info (SAE), Digital Auditing, Group Audits,
 * PSUs (C&AG), Internal Audit, Due Diligence, Forensic Accounting & ESG.
 * 60 High-Yield Static Questions Adhering Strictly to Professional Educator Rules.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_SPECIALIZED_FULL_QUESTIONS: TheoryQuestion[] = [
  {
    "id": "aud_spec_full_01",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - NPA Classification: 90 Days Overdue Norm, Out of Order CC Accounts & Drawing Power",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 8 / Nov 2023 Exam & May 2024 RTP",
    "question": "National Commercial Bank granted a Cash Credit (CC) limit of \u20b910 crores to Zenith Textiles Ltd. against hypothecation of stock and book debts. As of 31st March 2023, the outstanding balance was \u20b99.80 crores. The drawing power calculated based on stock statements dated 31st December 2022 was \u20b97.20 crores. No fresh stock statement was submitted since December 2022. During the quarter ended 31st March 2023, credits in the account were \u20b925 lakhs, whereas interest debited was \u20b932 lakhs. Explain whether the account should be classified as NPA under RBI Master Directions.",
    "keyConcepts": [
      {
        "keyword": "NPA Definition under RBI Prudential Norms",
        "category": "Rule",
        "description": "Asset becomes non-performing when it ceases to generate income for the bank."
      },
      {
        "keyword": "Out of Order Cash Credit Accounts",
        "category": "Rule",
        "description": "Outstanding balance exceeds sanctioned limit/DP, or credits are insufficient to cover interest debited."
      },
      {
        "keyword": "Drawing Power Stock Statement 3 Months Rule",
        "category": "Rule",
        "description": "Stock statements older than 3 months are deemed invalid; DP becomes nil or account irregular."
      },
      {
        "keyword": "Classification as Sub-Standard Asset",
        "category": "Provision",
        "description": "An account irregular for more than 90 days must be downgraded to Sub-Standard."
      }
    ],
    "shortSuggestedAnswer": "| Evaluation Criterion | RBI Master Direction Norm | Status in Zenith Textiles Ltd. |\n| :--- | :--- | :--- |\n| **Drawing Power (DP) vs Balance** | Outstanding balance should not exceed drawing power. Stock statements > 3 months old are **invalid/stale**, making the account irregular. | Stock statement is older than 3 months (Dec 2022 to March 2023). Outstanding balance (\u20b99.80 Cr) substantially exceeds DP (\u20b97.20 Cr). |\n| **Credit Summation vs Interest Debited** | Credits in the account should be sufficient to cover interest debited during the specified period. | Credits (\u20b925 Lakhs) < Interest debited (\u20b932 Lakhs). Inadequate credit summation. |\n| **'Out of Order' Determination** | Account is 'Out of Order' if: (a) Balance > Limit/DP continuously for 90 days; or (b) Credits < Interest for 90 days. | Account satisfies the **'Out of Order'** conditions under RBI Master Circular. |\n| **Final Classification** | Must be classified as a **Non-Performing Asset (Sub-Standard Asset)** with 15% provisioning on secured portion. | **Classify as NPA (Sub-Standard)**; provision at 15%. |\n\n```\n[RBI Cash Credit NPA Classification Framework]\n                  Cash Credit / Overdraft Facility\n                                 \u2502\n                                 \u25bc\n           Is the Account OUT OF ORDER for > 90 Days?\n                                 \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                   \u25bc\nBalance > Sanctioned Limit / DP                    Credits < Interest Debited\nOR Stock Statement > 3 Months Old                  during the Quarter\n(Balance \u20b99.8 Cr vs DP \u20b97.2 Cr)                    (Credits \u20b925L vs Interest \u20b932L)\n       \u2502                                                   \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                                 \u25bc\n                    ACCOUNT IS 'OUT OF ORDER'\n                                 \u2502\n                                 \u25bc\n                CLASSIFY AS NPA: SUB-STANDARD ASSET\n             Mandatory Provision: 15% (Secured Portion)\n```\n\n\u2022 **Statutory Principles under RBI Master Directions**:\n  1. **Out of Order Status**: An account should be treated as 'out of order' if the outstanding balance remains continuously in excess of the sanctioned limit/drawing power for 90 days.\n  2. **Insufficient Credits**: In cases where the outstanding balance is within the limit/DP, but there are no credits continuously for 90 days as on the date of Balance Sheet or credits are not enough to cover the interest debited during the same period, these accounts should be treated as 'out of order'.\n  3. **Stale Stock Statements**: Stock statements relied upon by banks for determining DP must not be older than 3 months. Where stock statements are not updated for more than 3 months, the drawing power becomes irregular and leads to NPA categorization upon expiry of 90 days from irregularity.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying RBI Master Direction rules for 'Out of Order' CC accounts: stock statements older than 3 months and credits less than interest debited.",
      "criticalMisses": [
        "Failing to identify that credits (\u20b925L) were less than interest debited (\u20b932L).",
        "Missing the 3-month stale stock statement rule."
      ],
      "suggestions": [
        "Cite the exact provision requirement: 15% for sub-standard secured advances."
      ]
    }
  },
  {
    "id": "aud_spec_full_02",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Central Government vs State Government Guaranteed Advances NPA Norms",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 8 / May 2023 Exam (Bank Advances)",
    "question": "Rural Development Bank has two overdue loan accounts for more than 180 days: (1) Advance to State Sugar Mill Corporation guaranteed by State Government of Maharashtra (\u20b940 crores overdue); (2) Advance to National Highway Authority project guaranteed by Central Government of India (\u20b980 crores overdue). How should these advances be classified and provided for in accordance with RBI Master Directions on Prudential Norms?",
    "keyConcepts": [
      {
        "keyword": "Central Government Guaranteed Advances",
        "category": "Rule",
        "description": "Advances guaranteed by Central Govt become NPA for provisioning only when Govt repudiates guarantee."
      },
      {
        "keyword": "State Government Guaranteed Advances",
        "category": "Rule",
        "description": "Advances guaranteed by State Govt become NPA when overdue for > 90 days, identical to ordinary advances."
      },
      {
        "keyword": "Income Recognition on Govt Guaranteed Loans",
        "category": "Provision",
        "description": "Income cannot be recognized on accrual basis if loan is overdue > 90 days, even for Central Govt loans."
      },
      {
        "keyword": "Provisioning Difference Matrix",
        "category": "Provision",
        "description": "Central Govt guaranteed overdue loans require provision only for asset classification, not classified as NPA until repudiation."
      }
    ],
    "shortSuggestedAnswer": "| Loan Category | Asset Classification Norm (RBI) | Provisioning Requirement | Income Recognition Norm |\n| :--- | :--- | :--- | :--- |\n| **(1) State Government Guarantee (\u20b940 Cr Overdue)** | **Treated at par with ordinary corporate borrowers**. Since overdue > 90 days, it is classified as **NPA (Sub-Standard Asset)**. | Mandatory provision of **15%** on the outstanding balance (\u20b96.00 Crores). | **Cash Basis Only** (No accrual of unrealized interest allowed). |\n| **(2) Central Government Guarantee (\u20b980 Cr Overdue)** | **EXEMPT FROM NPA CLASSIFICATION** for the purpose of balance sheet presentation, **UNLESS Central Govt repudiates its guarantee**. | Provision must be made as applicable to **sub-standard assets (15%)**, even though not classified as NPA. | **Cash Basis Only** (Income recognition norm applies; interest cannot be taken to P&L on accrual basis). |\n\n```\n[Government Guaranteed Advances: RBI Prudential Dual-Track]\n                  Loan Overdue for More than 90 Days\n                                  \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                     \u25bc\nSTATE GOVERNMENT GUARANTEE                           CENTRAL GOVERNMENT GUARANTEE\n\u2022 Classified as NPA (Sub-Standard)                   \u2022 NOT classified as NPA (unless\n\u2022 Provision: 15% (Secured)                             repudiated by Central Govt)\n\u2022 Income: Realization / Cash Basis                   \u2022 BUT Provisioning: 15% Mandatory\n                                                     \u2022 Income: Realization / Cash Basis\n```\n\n\u2022 **Statutory Principles under RBI Master Directions**:\n  1. **State Government Guarantee Rule**: The requirement of invoking the guarantee within 90 days of the account becoming overdue is mandatory. An advance guaranteed by a State Government becomes an NPA if it remains overdue for more than 90 days, exactly like any commercial borrower.\n  2. **Central Government Guarantee Immunity**: Advances guaranteed by the Central Government, though overdue, may be treated as **performing assets** for the purpose of asset classification. However, this exemption is lost if the Central Government repudiates its guarantee when invoked.\n  3. **Crucial Accounting Nuance**: Even though a Central Government guaranteed loan is not classified as NPA, **income recognition must still be on cash basis**, and **provisioning must be created** as applicable to non-performing assets.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on contrasting Central Government guarantee (exemption from NPA classification unless repudiated) with State Government guarantee (classified as NPA if overdue > 90 days).",
      "criticalMisses": [
        "Classifying Central Government guaranteed advance as an ordinary NPA without mentioning the repudiation exception.",
        "Allowing interest accrual on overdue Central Government advances."
      ],
      "suggestions": [
        "Emphasize that provisioning is mandatory for Central Govt overdue loans even though classified as standard."
      ]
    }
  },
  {
    "id": "aud_spec_full_03",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Restructuring of Advances & Prudential Framework for Resolution of Stressed Assets",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 8 / Nov 2022 Exam (RBI Restructuring)",
    "question": "Metropolis Bank restructured a corporate loan of \u20b9150 crores to InfraCorp Ltd. on 15th February 2023 under the RBI Prudential Framework for Stressed Assets. Under the resolution plan, repayment was extended by 5 years, and interest was reduced from 11% to 7%. The bank upgraded the account from 'Sub-Standard' to 'Standard' on the date of restructuring. Examine the propriety of the bank's upgrade and explain the conditions for upgrading restructured accounts under RBI guidelines.",
    "keyConcepts": [
      {
        "keyword": "RBI Prudential Framework for Resolution of Stressed Assets",
        "category": "Rule",
        "description": "Guidelines for resolution and restructuring of stressed corporate accounts."
      },
      {
        "keyword": "Upgrade of Restructured Accounts",
        "category": "Rule",
        "description": "Account cannot be upgraded upon restructuring; must demonstrate satisfactory performance during monitoring period."
      },
      {
        "keyword": "Specified Period / Monitoring Period",
        "category": "Provision",
        "description": "Period from implementation until payment of at least 10% of principal debt and at least one year of satisfactory performance."
      },
      {
        "keyword": "Asset Classification Rollback on Failure",
        "category": "Provision",
        "description": "Default during monitoring period immediately triggers downgrade to pre-restructuring status."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Dimension | Bank's Action | RBI Master Direction Rule | Propriety & Legality |\n| :--- | :--- | :--- | :--- |\n| **Immediate Upgrade on Restructuring Date** | Upgraded account from 'Sub-Standard' to 'Standard' immediately on 15th Feb 2023. | Upgrading immediately upon signing/implementing the resolution plan is **strictly prohibited**. | **ILLEGAL & DEFECTIVE**: Violates RBI Prudential Framework. |\n| **Specified Period (Monitoring Period)** | No monitoring period observed. | Must demonstrate satisfactory performance during the **Specified Period** (at least 1 year + repayment of $\\ge 10\\%$ of principal). | Account must remain in **Sub-Standard category** during monitoring. |\n| **Credit Rating Requirement** | No independent credit rating obtained. | For accounts $\\ge$ \u20b9100 crores, must obtain Investment Grade Credit Rating (BBB- or higher) from authorized CRA. | Loan of \u20b9150 Cr requires mandatory **Investment Grade Rating**. |\n\n```\n[RBI Restructured Account Upgrade Framework]\n                Restructuring / Resolution Plan Implemented\n                                     \u2502\n                                     \u25bc\n                CANNOT BE UPGRADED IMMEDIATELY (RBI Rule)\n                Must Remain in Sub-Standard Category\n                                     \u2502\n                                     \u25bc\n        MONITORING PERIOD (SPECIFIED PERIOD) REQUIREMENTS:\n        1. Satisfactory performance for at least ONE YEAR\n        2. Repayment of at least 10% of total principal debt\n        3. Independent Credit Rating of Investment Grade (BBB- or better)\n           for aggregate facilities of \u20b9100 Crores and above\n                                     \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                           \u25bc\nALL CONDITIONS SATISFIED IN FULL                     DEFAULT DURING MONITORING PERIOD\n       \u2502                                                           \u2502\n       \u25bc                                                           \u25bc\nUPGRADE TO STANDARD ASSET                            IMMEDIATE DOWNGRADE TO\n                                                     PRE-RESTRUCTURING NPA STATUS\n```\n\n\u2022 **Statutory Principles under RBI Guidelines**:\n  1. **Immediate Upgrade Prohibition**: Standard asset classification upon restructuring is not automatic. The account remains in the classification category it was in prior to restructuring.\n  2. **Mandatory Conditions for Upgrade to Standard**:\n     - The account must demonstrate **satisfactory performance** during the 'Specified Period'.\n     - The borrower must pay at least 10% of the sum of outstanding principal and interest capitalized.\n     - For large accounts ($\\ge$ \u20b9100 crores), an Investment Grade credit rating from an external credit rating agency (CRA) is mandatory.\n  3. **Auditor's Duty**: The auditor must quantify the provisioning shortfall caused by the wrongful upgrade and report NPA divergence in the Long Form Audit Report (LFAR) and statutory audit report.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying RBI rules prohibiting immediate upgrade of restructured accounts and establishing the mandatory monitoring period, 10% principal repayment, and investment grade rating.",
      "criticalMisses": [
        "Permitting the immediate upgrade on the restructuring implementation date.",
        "Failing to state the 1-year monitoring period and 10% principal repayment requirement."
      ],
      "suggestions": [
        "Mention that for accounts $\\ge$ \u20b9100 crores, two credit ratings may be required if aggregate debt exceeds \u20b9500 crores."
      ]
    }
  },
  {
    "id": "aud_spec_full_04",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Long Form Audit Report (LFAR) Structure & Reporting to RBI on Frauds",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 8 / May 2024 RTP (Bank Audit)",
    "question": "Explain the regulatory scope of the Long Form Audit Report (LFAR) for statutory branch auditors of commercial banks. Detail the auditor's specific reporting obligations regarding: (1) Cash and Bank Balances; (2) Advances and Credit Appraisal; (3) Non-Fund Based Facilities (LCs and BGs); and (4) Serious Irregularities and Frauds.",
    "keyConcepts": [
      {
        "keyword": "Long Form Audit Report (LFAR)",
        "category": "Standard",
        "description": "Standard questionnaire prescribed by RBI for comprehensive review of bank branch operations."
      },
      {
        "keyword": "LFAR Credit Appraisal Verification",
        "category": "Provision",
        "description": "Reviewing adherence to sanctioned limits, documentation, margin compliance, and end-use monitoring."
      },
      {
        "keyword": "Non-Fund Based Commitments (LCs/BGs)",
        "category": "Provision",
        "description": "Verifying financial guarantees vs performance guarantees, margin cash, and expired un-cancelled guarantees."
      },
      {
        "keyword": "Reporting Frauds to RBI & Head Office",
        "category": "Rule",
        "description": "Immediate flash reporting of frauds/serious irregularities to Branch Manager, Zonal Office, and RBI."
      }
    ],
    "shortSuggestedAnswer": "| LFAR Functional Area | Specific Verification Procedures Required by RBI | Critical Audit Checkpoints |\n| :--- | :--- | :--- |\n| **(1) Cash & Bank Balances** | Physical verification of cash in hand, ATM cash balances, retention limits, insurance coverage, and foreign currency notes. | Check whether cash balance exceeded the prescribed branch retention limit without Head Office approval. |\n| **(2) Advances & Credit Appraisal** | Examine whether credit appraisal was conducted prior to sanction, whether sanction terms were adhered to, and whether end-use of funds was verified through invoices/inspection. | Review stock audits, drawing power registers, valuation of primary and collateral security, and renewal of expired limits. |\n| **(3) Non-Fund Based Facilities (LCs/BGs)** | Verify issuance of Letters of Credit (LCs) and Bank Guarantees (BGs), cash margin adequacy, underlying trade contracts, and invocation status. | Check un-cancelled expired guarantees and verify that accommodation bills were not discounted under LCs. |\n| **(4) Frauds & Serious Irregularities** | Immediate reporting of any suspected or actual fraud identified during audit to Head Office and RBI via Flash Report. | Examine vigilance cases, staff involvement in NPA accounts, suspicious transactions, and KYC deviations. |\n\n```\n[LFAR Audit & Fraud Flash Reporting Architecture]\n                 Statutory Bank Branch Audit Commenced\n                                   \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                           \u25bc                           \u25bc\nASSET VERIFICATION          SYSTEMS & CONTROLS          ADVANCES & LC/BG\n\u2022 Cash & ATM balancing      \u2022 KYC / AML compliance      \u2022 Credit appraisal & limits\n\u2022 Inter-branch accounts     \u2022 Clearing reconciliations  \u2022 Drawing power & stock audits\n\u2022 Housekeeping & books      \u2022 IT security / passwords   \u2022 Non-fund LC/BG margins\n       \u2502                           \u2502                           \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                                   \u2502\n                                   \u25bc\n        Are There Serious Irregularities / Frauds Identified?\n                                   \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                       \u25bc\n      YES                                                     NO\nIMMEDIATE FLASH REPORTING                                 Incorporate Detailed\n\u2022 Report immediately to Zonal Head & Top Management       Responses in Prescribed\n\u2022 Report to RBI Central Fraud Monitoring Cell             LFAR Questionnaires\n\u2022 Highlight in Main Audit Report / LFAR Special Memo\n```\n\n\u2022 **Key Regulatory Norms under LFAR**:\n  1. **Timelines**: Branch auditors must submit the completed LFAR along with the statutory audit report to the Statutory Central Auditors and Controlling Authorities within the timeline fixed by bank management.\n  2. **Fraud Reporting Protocol**: The auditor must not wait for the conclusion of the audit to report a fraud. A preliminary 'Flash Report' must be sent immediately upon discovering any embezzlement, forged instrument, or systemic diversion of funds.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on detailing the core modules of the LFAR for bank branches (Cash, Advances, LCs/BGs, Frauds) and citing the immediate flash reporting mechanism for banking frauds.",
      "criticalMisses": [
        "Failing to mention the immediate Flash Report for fraud to top management and RBI.",
        "Omitting the evaluation of non-fund based facilities like LCs and BGs."
      ],
      "suggestions": [
        "Highlight that LFAR is a separate comprehensive questionnaire submitted alongside the main statutory audit report under Section 30 of Banking Regulation Act."
      ]
    }
  },
  {
    "id": "aud_spec_full_05",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "NBFC Audit - Scale Based Regulation (SBR) Four-Tier Framework & Mandatory Compliance",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 8 / Nov 2023 Exam & May 2024 RTP (NBFC SBR)",
    "question": "Explain the Scale Based Regulation (SBR) framework introduced by RBI for Non-Banking Financial Companies (NBFCs). Tabulate the four regulatory layers (Base Layer, Middle Layer, Upper Layer, Top Layer), stating the categorization criteria, regulatory thresholds, and key statutory audit considerations for each layer.",
    "keyConcepts": [
      {
        "keyword": "Scale Based Regulation (SBR) Framework",
        "category": "Rule",
        "description": "Four-tier regulatory structure for NBFCs introduced by RBI based on asset size, activity, and systemic risk."
      },
      {
        "keyword": "Base Layer (NBFC-BL)",
        "category": "Provision",
        "description": "Non-deposit taking NBFCs with asset size below \u20b91,000 crores, peer-to-peer lending, account aggregators."
      },
      {
        "keyword": "Middle Layer (NBFC-ML)",
        "category": "Provision",
        "description": "Deposit-taking NBFCs (irrespective of size), non-deposit NBFCs with asset size >= \u20b91,000 crores, HFCs, CICs."
      },
      {
        "keyword": "Upper Layer (NBFC-UL) & Top Layer (NBFC-TL)",
        "category": "Provision",
        "description": "Top 10 NBFCs identified by RBI based on scoring methodology; Top Layer populated if extreme risk arises."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Layer | Eligible Entities & Asset Size Threshold | Key Regulatory Requirements & Audit Focus |\n| :--- | :--- | :--- |\n| **1. Base Layer (NBFC-BL)** | \u2022 Non-deposit taking NBFCs with **asset size < \u20b91,000 Crores**.<br>\u2022 NBFC-P2P, NBFC-AA, NOFHC, and Type I NBFC-ND. | \u2022 Minimum Net Owned Fund (NOF) requirement of \u20b910 Crores (stepped up from \u20b92 Cr).<br>\u2022 NPA recognition norm aligned to 90 days overdue.<br>\u2022 Capital adequacy and corporate governance disclosures. |\n| **2. Middle Layer (NBFC-ML)** | \u2022 **All Deposit-taking NBFCs (NBFC-D)** irrespective of asset size.<br>\u2022 Non-deposit NBFCs with **asset size $\\ge$ \u20b91,000 Crores**.<br>\u2022 Core Investment Companies (CICs), Housing Finance Companies (HFCs), Infrastructure Finance Companies (NBFC-IFC). | \u2022 Internal Capital Adequacy Assessment Process (ICAAP).<br>\u2022 Mandatory appointment of Chief Compliance Officer (CCO) and Chief Risk Officer (CRO).<br>\u2022 Large Exposure Framework (LEF) limits.<br>\u2022 Restriction on loans to Directors and KMPs. |\n| **3. Upper Layer (NBFC-UL)** | \u2022 Entities specifically identified by RBI through a parametric scoring methodology based on size, leverage, interconnectedness.<br>\u2022 Top 10 NBFCs in asset size are automatically included. | \u2022 Bank-like regulatory oversight: Common Equity Tier 1 (CET 1) of 9%.<br>\u2022 Differential standard asset provisioning.<br>\u2022 Mandatory listing on stock exchanges within 3 years.<br>\u2022 Mandatory qualification of Board members. |\n| **4. Top Layer (NBFC-TL)** | \u2022 Populated only if RBI determines that an entity in the Upper Layer presents an extreme and systemic spillover risk. | \u2022 Specially customized higher prudential regulations, capital add-ons, and intensified supervisory inspection by RBI. |\n\n```\n[RBI Scale Based Regulation (SBR) Pyramid]\n                       \u25b2\n                      / \\\n                     /   \\\n                    / TOP \\   TOP LAYER (NBFC-TL)\n                   / LAYER \\  \u2022 Empty by default; populated if systemic risk surges\n                  /\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\\\n                 /   UPPER   \\  UPPER LAYER (NBFC-UL)\n                /    LAYER    \\ \u2022 Top 10 NBFCs by size + scored systemic entities\n               /\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\\ \u2022 CET 1 (9%), Mandatory listing within 3 years\n              /     MIDDLE      \\  MIDDLE LAYER (NBFC-ML)\n             /      LAYER        \\ \u2022 All Deposit Taking NBFCs + Assets \u2265 \u20b91,000 Cr\n            /\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\\ \u2022 Mandatory CCO, CRO, ICAAP, LEF limits\n           /        BASE           \\  BASE LAYER (NBFC-BL)\n          /         LAYER           \\ \u2022 Non-deposit NBFCs < \u20b91,000 Cr, P2P, AA\n         /\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\\ \u2022 Minimum NOF \u20b910 Cr, 90-day NPA norm\n```\n\n\u2022 **Key Audit Considerations for NBFC Auditor**:\n  1. **Layer Classification Verification**: Verify that the NBFC has correctly categorized itself under SBR and updated its internal risk policies.\n  2. **Net Owned Fund (NOF) Compliance**: Ensure NOF meets statutory minimum thresholds (\u20b910 crores under SBR).\n  3. **Prudential Provisioning**: Verify compliance with the standardized 90-day NPA recognition across all layers.\n  4. **Reporting under Section 45-MA**: Issue separate Auditor's Report to the Board of Directors confirming compliance with RBI Directions.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on detailing the four tiers of the RBI Scale Based Regulation (Base, Middle, Upper, Top Layers) with exact thresholds and audit checkpoints.",
      "criticalMisses": [
        "Omitting the Upper Layer mandatory listing within 3 years and CET 1 of 9%.",
        "Failing to recognize that all deposit-taking NBFCs belong to the Middle Layer regardless of size."
      ],
      "suggestions": [
        "Mention Section 45-MA of RBI Act requiring auditors to submit a separate report to the Board of Directors on prudential compliance."
      ]
    }
  },
  {
    "id": "aud_spec_full_06",
    "subjectId": "Audit",
    "chapterName": "Prospective Financial Information & Other Assurance",
    "title": "SAE 3400 - The Examination of Prospective Financial Information: Forecast vs Projection & Negative Assurance",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 11 / Nov 2022 Exam (SAE 3400)",
    "question": "Zenith Biotech Ltd. is launching a public issue of shares and engaged CA D to report on its Prospective Financial Information (PFI) for the next 5 years. Management provided financial forecasts based on the assumption that an experimental cancer drug will receive FDA clearance within 6 months. (a) Distinguish between a 'Forecast' and a 'Projection' under SAE 3400; (b) What type of assurance is expressed by the practitioner on PFI; (c) What are the mandatory disclaimer statements required in the report?",
    "keyConcepts": [
      {
        "keyword": "SAE 3400 The Examination of Prospective Financial Information",
        "category": "Standard",
        "description": "Standard governing engagement to examine and report on prospective financial info."
      },
      {
        "keyword": "Forecast vs Projection",
        "category": "Provision",
        "description": "Forecast is based on best-estimate assumptions; Projection is based on hypothetical assumptions."
      },
      {
        "keyword": "Negative Assurance on Assumptions",
        "category": "Rule",
        "description": "Practitioner expresses negative assurance that nothing has come to attention causing belief that assumptions do not provide reasonable basis."
      },
      {
        "keyword": "Mandatory Cautionary Statement",
        "category": "Rule",
        "description": "Statement that actual results are likely to be different from prospective info since anticipated events frequently do not occur as expected."
      }
    ],
    "shortSuggestedAnswer": "| Concept / Element | Statutory Definition & Rule under SAE 3400 | Application to Zenith Biotech Ltd. |\n| :--- | :--- | :--- |\n| **Forecast vs Projection** | \u2022 **Forecast**: PFI prepared on the basis of assumptions as to future events which management expects to take place (**best-estimate assumptions**).<br>\u2022 **Projection**: PFI prepared on the basis of **hypothetical assumptions** about future events (what-if scenarios). | Unapproved experimental cancer drug assumption is a **Hypothetical Assumption**; the statement is a **Projection**, not a pure forecast. |\n| **Type of Assurance Expressed** | PFI is subject to high uncertainty. The practitioner **CANNOT provide positive / reasonable assurance**. Only **Moderate / Negative Assurance** is expressed on the reasonableness of assumptions. | CA D must state: *'Nothing has come to our attention that causes us to believe that these assumptions do not provide a reasonable basis for the projection.'* |\n| **Mandatory Cautionary Language** | Must include a clear statement that: (1) actual results are likely to be different from the projection; (2) variations may be material; and (3) practitioner assumes no responsibility to update the report for subsequent events. | Auditor must warn public investors that actual drug trials may fail and projections will not be achieved. |\n\n```\n[SAE 3400 PFI Assurance & Reporting Framework]\n               Prospective Financial Information Engagement\n                                    \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                         \u25bc\n    FORECAST                                                 PROJECTION\nBest-Estimate Assumptions                              Hypothetical Assumptions\n(Management expects to occur)                          ('What-if' exploratory scenarios)\n       \u2502                                                         \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                                    \u2502\n                                    \u25bc\n                         PRACTITIONER'S OPINION\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                         \u25bc\nNEGATIVE ASSURANCE ON ASSUMPTIONS                      POSITIVE OPINION ON PREPARATION\n('Nothing has come to our attention                    ('PFI is properly prepared on basis\nthat assumptions are unreasonable')                     of assumptions & FRF presentation')\n                                    \u2502\n                                    \u25bc\n                      MANDATORY DISCLAIMER STATEMENT\n          \u2022 Actual results are likely to be different from PFI\n          \u2022 Differences may be material; events frequently vary\n          \u2022 Practitioner has no responsibility to update report\n```\n\n\u2022 **Statutory Principles under SAE 3400**:\n  1. **No Guarantee of Results**: The practitioner shall not express an opinion on whether the results shown in the prospective financial information will be achieved.\n  2. **Examination of Assumptions**: The practitioner must assess the sources of information, consistency with historical trends, and mathematical accuracy of computations.\n  3. **Reporting Wording**: The report must clearly state the purpose for which the PFI was prepared and restrict distribution if hypothetical assumptions are involved.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing forecasts (best-estimate) from projections (hypothetical) under SAE 3400, identifying the negative assurance on assumptions, and stating the mandatory disclaimer language.",
      "criticalMisses": [
        "Claiming the auditor provides reasonable/positive assurance on future financial results.",
        "Failing to include the mandatory statement that actual results are likely to differ."
      ],
      "suggestions": [
        "Emphasize that the auditor gives positive assurance on the mathematical compilation, but only negative assurance on the underlying assumptions."
      ]
    }
  },
  {
    "id": "aud_spec_full_07",
    "subjectId": "Audit",
    "chapterName": "Prospective Financial Information & Other Assurance",
    "title": "SAE 3420 - Reporting on the Compilation of Pro Forma Financial Information Included in a Prospectus",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 11 / Nov 2023 Exam (SAE 3420)",
    "question": "Omega Infra Ltd. issued a draft red herring prospectus (DRHP) for a mega IPO. The prospectus contains Pro Forma Consolidated Financial Information illustrating the hypothetical impact of an unlisted acquisition as if it had taken place on 1st April 2022. The company engaged CA M to report on the pro forma information under SAE 3420. Explain: (1) the purpose of pro forma financial information; (2) the practitioner's objective; and (3) the core compilation procedures required under SAE 3420.",
    "keyConcepts": [
      {
        "keyword": "SAE 3420 Pro Forma Financial Information",
        "category": "Standard",
        "description": "Standard on assurance engagements to report on compilation of pro forma info in prospectus."
      },
      {
        "keyword": "Purpose of Pro Forma Information",
        "category": "Provision",
        "description": "To illustrate the impact of a significant event/transaction on unadjusted historical financial info."
      },
      {
        "keyword": "Practitioner's Objective under SAE 3420",
        "category": "Rule",
        "description": "Obtain reasonable assurance that pro forma information has been compiled on the basis of applicable criteria."
      },
      {
        "keyword": "Core Compilation Procedures",
        "category": "Provision",
        "description": "Verify source of unadjusted info, test pro forma adjustments, and check mathematical accuracy."
      }
    ],
    "shortSuggestedAnswer": "| Dimension | Statutory Requirement under SAE 3420 | Application to Omega Infra Ltd. |\n| :--- | :--- | :--- |\n| **Purpose of Pro Forma Information** | Solely to illustrate what the effect of a significant event or transaction (acquisition) might have been on **unadjusted financial information** had the transaction occurred at an earlier date. | Illustrating acquisition of unlisted target as if completed on 1st April 2022. |\n| **Practitioner's Objective** | To obtain **reasonable assurance** about whether the pro forma financial information has been compiled, in all material respects, by the responsible party **on the basis of the applicable criteria**. | CA M must express an opinion on whether the compilation criteria applied by management are consistent with SEBI ICDR Regulations. |\n| **Nature of Assurance** | Provides **Reasonable Assurance** on the *compilation process*, but does NOT audit the underlying target company transactions. | Evaluates whether adjustments are directly attributable and factually supportable. |\n\n```\n[SAE 3420 Compilation Verification Protocol]\n                 Pro Forma Financial Information in DRHP\n                                    \u2502\n                                    \u25bc\n       1. VERIFY SOURCE OF UNADJUSTED FINANCIAL INFORMATION\n          \u2022 Extracted from audited historical financial statements\n          \u2022 Reconcile opening figures to published balance sheets\n                                    \u2502\n                                    \u25bc\n       2. EVALUATE PRO FORMA ADJUSTMENTS\n          \u2022 Directly attributable to the acquisition event\n          \u2022 Factually supportable (purchase agreements, valuations)\n          \u2022 Consistent with applicable financial reporting framework (Ind AS)\n                                    \u2502\n                                    \u25bc\n       3. VERIFY MATHEMATICAL COMPILATION & PRESENTATION\n          \u2022 Test arithmetic columns and pro forma consolidation entries\n          \u2022 Verify adequate note disclosures explaining applied criteria\n                                    \u2502\n                                    \u25bc\n                 ISSUE ASSURANCE REPORT UNDER SAE 3420\n             (Reasonable Assurance that Pro Forma info is\n              properly compiled on the basis of stated criteria)\n```\n\n\u2022 **Statutory Compilation Checks under SAE 3420**:\n  1. **Appropriate Source**: The practitioner shall determine whether the responsible party has extracted the unadjusted financial information from an appropriate source (audited historical financial statements).\n  2. **Adjustment Validity**: The practitioner shall inquire whether the pro forma adjustments are:\n     - Directly attributable to the event or transaction;\n     - Factually supportable; and\n     - Consistent with the entity's applicable financial reporting framework.\n  3. **No Retrospective True & Fair Opinion**: The report must contain a statement that the engagement does not involve updating or re-issuing any audit reports on the historical information used.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on stating the purpose of pro forma financial information under SAE 3420, confirming that the practitioner provides reasonable assurance on the compilation criteria, and outlining verification checks.",
      "criticalMisses": [
        "Confusing SAE 3420 (reasonable assurance on compilation) with SAE 3400 (negative assurance on PFI assumptions).",
        "Failing to state that adjustments must be directly attributable and factually supportable."
      ],
      "suggestions": [
        "Emphasize that the practitioner does not re-audit historical numbers; they verify whether compilation follows SEBI / applicable criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_08",
    "subjectId": "Audit",
    "chapterName": "Related Services and Review Engagements",
    "title": "SRS 4400 vs SRS 4410 - Agreed-Upon Procedures vs Compilation Engagements: Assurance & Reporting Matrix",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 9 & 10 / May 2024 MTP (SRS 4400/4410)",
    "question": "Differentiate between an 'Agreed-Upon Procedures Engagement' under SRS 4400 and a 'Compilation Engagement' under SRS 4410. Address: (1) Objective of the engagement; (2) Level of assurance provided; (3) Users of the report and restriction on distribution; (4) Independence requirements.",
    "keyConcepts": [
      {
        "keyword": "SRS 4400 Engagements to Perform Agreed-Upon Procedures",
        "category": "Standard",
        "description": "Practitioner performs procedures agreed with client and reports factual findings without assurance."
      },
      {
        "keyword": "SRS 4410 Compilation Engagements",
        "category": "Standard",
        "description": "Practitioner assists management in preparing and presenting financial information without assurance."
      },
      {
        "keyword": "Absence of Assurance in Related Services",
        "category": "Rule",
        "description": "Both SRS 4400 and SRS 4410 provide ZERO assurance (no positive or negative assurance)."
      },
      {
        "keyword": "Independence Requirements",
        "category": "Rule",
        "description": "Independence is not required for SRS 4400 (unless required by contract), but must disclose if not independent."
      }
    ],
    "shortSuggestedAnswer": "| Feature / Dimension | Agreed-Upon Procedures (SRS 4400) | Compilation Engagement (SRS 4410) |\n| :--- | :--- | :--- |\n| **Primary Objective** | To carry out procedures of an audit nature to which the practitioner and entity have agreed, and report on **factual findings**. | To apply accounting and financial reporting expertise to assist management in **preparing and presenting financial statements**. |\n| **Level of Assurance Provided** | **NO ASSURANCE** is expressed. Users draw their own conclusions from the factual findings reported. | **NO ASSURANCE** is expressed. Practitioner does not test controls or verify accuracy of underlying records. |\n| **Form of Reporting** | Report of **Factual Findings** listing specific procedures performed and factual results observed. | **Compilation Report** stating that financial statements were compiled without audit or review. |\n| **Distribution & Users** | **STRICTLY RESTRICTED** to specified parties who have agreed to the procedures (to prevent misinterpretation). | Ordinarily not restricted, unless compiled under a special purpose framework. |\n| **Ethical Independence Rule** | Independence is **not a statutory requirement**; however, if the practitioner is not independent, this fact must be stated in the report. | Independence is **not required**; if not independent, disclosure in the compilation report is recommended/required. |\n\n```\n[Related Services (SRS 4400 vs 4410) Assurance Matrix]\n                 ENGAGEMENT UNDER RELATED SERVICES STANDARDS\n                                      \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                             \u25bc\nAGREED-UPON PROCEDURES (SRS 4400)                             COMPILATION ENGAGEMENT (SRS 4410)\n\u2022 Specific procedures agreed with user                        \u2022 Assists management in assembling FS\n\u2022 Reports purely FACTUAL FINDINGS                             \u2022 Does NOT verify underlying records\n\u2022 ZERO ASSURANCE (Users draw conclusions)                     \u2022 ZERO ASSURANCE (No audit or review)\n\u2022 Distribution STRICTLY RESTRICTED                            \u2022 General distribution permitted\n\u2022 Independence: Disclose if not independent                   \u2022 Independence: Not required\n```\n\n\u2022 **Key Takeaways for Practice**:\n  1. **Zero Assurance Rule**: In both SRS 4400 and SRS 4410, the practitioner does not obtain audit evidence to express any assurance (neither reasonable nor limited/negative assurance).\n  2. **Report Wording Warning**: The compilation report must explicitly include: *'We have not audited or reviewed these financial statements and, accordingly, do not express an opinion or any other form of assurance on them.'*",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on constructing the comparative matrix contrasting SRS 4400 and SRS 4410 across objectives, assurance (none), report distribution, and ethical independence.",
      "criticalMisses": [
        "Claiming that compilation or agreed-upon procedures provide negative assurance.",
        "Failing to note that SRS 4400 reports must be restricted exclusively to contracting parties."
      ],
      "suggestions": [
        "Emphasize that the term 'Audit' or 'Review' must never be used in reports issued under SRS 4400 or 4410."
      ]
    }
  },
  {
    "id": "aud_spec_full_09",
    "subjectId": "Audit",
    "chapterName": "Related Services and Review Engagements",
    "title": "SRE 2400 vs SRE 2410 - Review of Historical Financial Statements: Limited Assurance & Inquiry Procedures",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 10 / Nov 2023 Exam (SRE 2400/2410)",
    "question": "Explain the fundamental nature of a 'Review Engagement' under SRE 2400 / SRE 2410. (1) How does the level of assurance differ from a statutory audit under SA 700? (2) What are the primary procedural tools of a review? (3) Formulate the standard negative assurance conclusion phrasing.",
    "keyConcepts": [
      {
        "keyword": "SRE 2400 Engagements to Review Historical Financial Statements",
        "category": "Standard",
        "description": "Review engagement conducted by practitioner who is not the statutory auditor."
      },
      {
        "keyword": "SRE 2410 Review of Interim Financial Information",
        "category": "Standard",
        "description": "Review of interim financial information performed by the independent auditor of the entity."
      },
      {
        "keyword": "Limited / Negative Assurance",
        "category": "Rule",
        "description": "Moderate level of assurance expressed in negative form ('Nothing has come to our attention')."
      },
      {
        "keyword": "Primary Procedures: Inquiry & Analytics",
        "category": "Provision",
        "description": "Review consists primarily of making inquiries of management and applying analytical procedures."
      }
    ],
    "shortSuggestedAnswer": "| Comparative Parameter | Statutory Audit (SA 700 Series) | Review Engagement (SRE 2400 / 2410) |\n| :--- | :--- | :--- |\n| **Level of Assurance** | **Reasonable Assurance** (High, but not absolute assurance). | **Limited Assurance** (Moderate level of assurance; lower than an audit). |\n| **Audit Evidence Procedures** | Tests of controls, detailed substantive testing, physical inspection, external confirmations, recalculations. | **Inquiries of management** and **analytical procedures**. Substantive tests of details are NOT performed unless doubt arises. |\n| **Form of Opinion / Conclusion** | **Positive Opinion**: *'In our opinion, the financial statements present a true and fair view...'* | **Negative Conclusion**: *'Based on our review, nothing has come to our attention that causes us to believe that the financial statements do not present a true and fair view...'* |\n| **Risk of Material Misstatement** | Reduced to an **acceptably low level**. | Reduced to a **moderate level** (Review Risk). |\n\n```\n[Assurance Spectrum Architecture]\n     REASONABLE ASSURANCE (High Level)\n     \u2022 Standards on Auditing (SAs 200 - 810)\n     \u2022 Positive Opinion ('In our opinion, FS present true and fair view')\n     \u2022 Extensive testing: Controls, substantive, confirmations\n                        \u25b2\n                        \u2502  DIFFERENCE: Depth of Procedures\n                        \u25bc\n     LIMITED ASSURANCE (Moderate Level)\n     \u2022 Standards on Review Engagements (SRE 2400 / 2410)\n     \u2022 Negative Conclusion ('Nothing has come to our attention...')\n     \u2022 Procedures restricted to Inquiries & Analytical Procedures\n                        \u25b2\n                        \u2502  DIFFERENCE: Zero Assurance\n                        \u25bc\n     NO ASSURANCE (Related Services)\n     \u2022 SRS 4400 (Agreed-Upon Procedures) / SRS 4410 (Compilation)\n     \u2022 Factual findings only / Accounting assembly\n```\n\n\u2022 **Statutory Review Protocol under SRE 2400 & 2410**:\n  1. **Procedural Boundaries**: A review does not contemplate obtaining an understanding of internal control, assessing fraud risk, or testing accounting records through inspection or confirmation.\n  2. **Trigger for Further Procedures**: If the practitioner has reason to believe that the information may be materially misstated, they shall perform additional or more extensive procedures as are necessary to resolve the doubt or modify the conclusion.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on contrasting reasonable assurance (SA 700) with limited assurance (SRE 2400/2410) and drafting the exact negative conclusion phrasing.",
      "criticalMisses": [
        "Using positive opinion wording in a review report.",
        "Assuming that physical verification and external confirmations are routine procedures in a review engagement."
      ],
      "suggestions": [
        "Distinguish SRE 2400 (performed by external practitioner) from SRE 2410 (performed by entity's own statutory auditor for quarterly SEBI results)."
      ]
    }
  },
  {
    "id": "aud_spec_full_10",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Group Audit - Ind AS 110 Consolidation Adjustments & Intra-Group Profit Eliminations Verification",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 13 / May 2023 Exam (Group Audits)",
    "question": "Parent Ltd. owns 75% equity in Sub Ltd. During FY 2022-23, Parent Ltd. sold machinery to Sub Ltd. for \u20b940 crores (Cost: \u20b925 crores; Unrealized Profit: \u20b915 crores). Sub Ltd. depreciated the machinery at 20% on straight-line basis. The draft consolidated financial statements prepared by Parent Ltd. omitted the elimination of unrealized profit and excess depreciation. What consolidation audit procedures must the group auditor perform to verify intra-group adjustments under Ind AS 110 and SA 600?",
    "keyConcepts": [
      {
        "keyword": "Ind AS 110 Consolidated Financial Statements",
        "category": "Standard",
        "description": "Elimination of intra-group balances, transactions, income, and expenses in full."
      },
      {
        "keyword": "Unrealized Intra-Group Profits on Fixed Assets",
        "category": "Rule",
        "description": "Unrealized profits on intra-group transfers of assets must be eliminated in full against group profits."
      },
      {
        "keyword": "Depreciation Adjustment on Intra-Group Sale",
        "category": "Provision",
        "description": "Excess depreciation charged by buying subsidiary on unrealized profit portion must be reversed."
      },
      {
        "keyword": "Group Auditor Verification Duty (SA 600)",
        "category": "Rule",
        "description": "Group auditor must verify consolidation adjustments and ensure compliance with Ind AS 110."
      }
    ],
    "shortSuggestedAnswer": "| Consolidation Adjustment Element | Calculation & Mathematical Matrix | Required Accounting Elimination Entry |\n| :--- | :--- | :--- |\n| **Unrealized Gain on Sale of Machinery** | Sale Price (\u20b940 Cr) - Original Cost (\u20b925 Cr) = **\u20b915.00 Crores Unrealized Profit**. | Debit: Profit on Sale of Asset (P&L) \u20b915.00 Cr<br>Credit: Property, Plant & Equipment (PPE) \u20b915.00 Cr |\n| **Excess Depreciation Reversal** | Sub Ltd. charged 20% on \u20b940 Cr (\u20b98 Cr) instead of original cost \u20b925 Cr (\u20b95 Cr). **Excess Depreciation = \u20b93.00 Crores** (20% of \u20b915 Cr). | Debit: PPE (Accumulated Depreciation) \u20b93.00 Cr<br>Credit: Depreciation Expense (P&L) \u20b93.00 Cr |\n| **Net Impact on Consolidated P&L** | Unrealized Gain (-\u20b915 Cr) + Excess Depreciation (+\u20b93 Cr) = **Net Profit Reduction of \u20b912.00 Crores**. | Net reduction in Group Consolidated Retained Earnings: **\u20b912.00 Crores**. |\n\n```\n[Ind AS 110 Intra-Group PPE Profit Elimination Protocol]\n               Parent Ltd. Sells PPE to Sub Ltd. at a Profit\n         (Transfer Price: \u20b940 Cr | Original Cost: \u20b925 Cr | Profit: \u20b915 Cr)\n                                      \u2502\n                                      \u25bc\n       1. ELIMINATE UNREALIZED PROFIT IN FULL (Ind AS 110)\n          \u2022 Reduce Consolidated PPE by \u20b915 Crores\n          \u2022 Debit Consolidated Profit & Loss by \u20b915 Crores\n                                      \u2502\n                                      \u25bc\n       2. REVERSE EXCESS DEPRECIATION CHARGED BY BUYER\n          \u2022 Sub Ltd. charged depreciation on inflated cost (\u20b940 Cr @ 20% = \u20b98 Cr)\n          \u2022 True depreciation on cost: \u20b925 Cr @ 20% = \u20b95 Cr\n          \u2022 Credit Consolidated P&L and Debit PPE Accumulated Dep by \u20b93 Crores\n                                      \u2502\n                                      \u25bc\n       3. AUDITOR VERIFICATION & REPORTING (SA 600)\n          \u2022 Verify reconciliation of intra-group transactions\n          \u2022 If management refuses elimination: QUALIFIED / ADVERSE OPINION (SA 705)\n```\n\n\u2022 **Group Auditor Verification Procedures under SA 600**:\n  1. **Inter-Company Reconciliations**: The group auditor must obtain and inspect the intra-group asset transfer register and ensure all balances reconcile between Parent and Sub.\n  2. **Deferred Tax Consequence**: Verify that deferred tax asset is recognized on the unrealized intra-group profit under Ind AS 12.\n  3. **Reporting under SA 705**: If management refuses to eliminate the \u20b912 crore net overstatement from consolidated profit and PPE, the financial statements are materially misstated, requiring a **Qualified or Adverse Opinion**.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on calculating the exact unrealized profit (\u20b915 Cr) and excess depreciation reversal (\u20b93 Cr), providing the journal adjustments, and outlining group auditor duties under SA 600.",
      "criticalMisses": [
        "Failing to reverse the excess depreciation of \u20b93 crores.",
        "Eliminating profit only to the extent of parent's 75% holding (Ind AS 110 mandates 100% elimination)."
      ],
      "suggestions": [
        "Emphasize that under Ind AS 110, intra-group transactions are eliminated in full, not proportionally."
      ]
    }
  },
  {
    "id": "aud_spec_full_11",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of PSUs",
    "title": "Audit of Public Sector Undertakings (PSUs) - Mandate of C&AG & Types of Audit",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP & Past Exam (C&AG Constitutional)",
    "question": "Explain the constitutional mandate of the Comptroller and Auditor General (C&AG) under Articles 148 to 151 of the Constitution of India. Differentiate between Financial Audit, Compliance Audit, and Performance Audit (The 3Es) in PSU governance.",
    "keyConcepts": [
      {
        "keyword": "C&AG Constitutional Mandate",
        "category": "Standard",
        "description": "Mandate under C&AG Constitutional Mandate."
      },
      {
        "keyword": "Articles 148 to 151",
        "category": "Provision",
        "description": "Statutory requirement for Articles 148 to 151."
      },
      {
        "keyword": "Performance Audit (3Es)",
        "category": "Rule",
        "description": "Regulatory threshold for Performance Audit (3Es)."
      },
      {
        "keyword": "Propriety Audit Concept",
        "category": "Provision",
        "description": "Core guideline on Propriety Audit Concept."
      }
    ],
    "shortSuggestedAnswer": "| PSU Audit Type | Core Focus & Objective under C&AG Regulations | Evaluation Benchmarks |\n| :--- | :--- | :--- |\n| **Financial Audit** | Independent assessment whether financial statements present a true and fair view in accordance with FRF and statutory provisions. | Reconciliations, Ind AS compliance, accounting vouchers, CARO reporting. |\n| **Compliance Audit** | Verification whether public funds were expended in strict accordance with rules, regulations, budgetary grants, and statutory authorities. | Financial rules, procurement manuals, tender bidding guidelines, fiscal laws. |\n| **Performance Audit** | Independent evaluation of public projects and institutions based on the **3Es**: **Economy**, **Efficiency**, and **Effectiveness**. | Did entity procure resources at lowest cost (Economy)? Were inputs converted to max outputs (Efficiency)? Did program achieve objectives (Effectiveness)? |",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of C&AG Constitutional Mandate and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of C&AG Constitutional Mandate.",
        "Incorrectly applying Articles 148 to 151."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of C&AG Constitutional Mandate and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_12",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of PSUs",
    "title": "PSU Audit - Comprehensive Audit & Propriety Audit Principles",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP & Past Exam (Propriety Audit)",
    "question": "Explain the concept of 'Propriety Audit' in the context of government expenditure. What specific canons of financial propriety must an auditor verify?",
    "keyConcepts": [
      {
        "keyword": "Propriety Audit in PSUs",
        "category": "Standard",
        "description": "Mandate under Propriety Audit in PSUs."
      },
      {
        "keyword": "Canons of Financial Propriety",
        "category": "Provision",
        "description": "Statutory requirement for Canons of Financial Propriety."
      },
      {
        "keyword": "Public Money Vigilance",
        "category": "Rule",
        "description": "Regulatory threshold for Public Money Vigilance."
      },
      {
        "keyword": "Comprehensive Audit of PSUs",
        "category": "Provision",
        "description": "Core guideline on Comprehensive Audit of PSUs."
      }
    ],
    "shortSuggestedAnswer": "| Canon of Financial Propriety | Core Statutory Principle for Public Expenditure |\n| :--- | :--- |\n| **1. Standard of Prudence** | The expenditure should not be prima facie more than the occasion demands. Every public officer is expected to exercise the same vigilance in respect of expenditure incurred from public moneys as a person of ordinary prudence would exercise in respect of expenditure of his own money. |\n| **2. Sanctioned Authority** | The expenditure should not be sanctioned by an authority that would thereby pass a direct or indirect benefit to itself. |\n| **3. Non-Personal Advantage** | Public money should not be utilized for the benefit of a particular person or section of the community, unless the amount of expenditure involved is insignificant or a claim for the amount could be enforced in a Court of law. |\n| **4. Relation to Status** | The amount of allowances granted to meet expenditure of a particular type should be so regulated that the allowances are not on the whole sources of profit to the recipients. |",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Propriety Audit in PSUs and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Propriety Audit in PSUs.",
        "Incorrectly applying Canons of Financial Propriety."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Propriety Audit in PSUs and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_13",
    "subjectId": "Audit",
    "chapterName": "Internal Audit",
    "title": "Internal Audit - Section 138 of Companies Act, 2013: Mandatory Applicability Thresholds & Standards on Internal Audit (SIAs)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP & Past Exam (Section 138)",
    "question": "Tabulate the mandatory applicability thresholds for the appointment of an Internal Auditor under Section 138 of Companies Act, 2013 read with Rule 13 of Companies (Accounts) Rules, 2014 for unlisted public and private companies.",
    "keyConcepts": [
      {
        "keyword": "Section 138 Companies Act 2013",
        "category": "Standard",
        "description": "Mandate under Section 138 Companies Act 2013."
      },
      {
        "keyword": "Rule 13 Applicability Thresholds",
        "category": "Provision",
        "description": "Statutory requirement for Rule 13 Applicability Thresholds."
      },
      {
        "keyword": "Unlisted Public Companies Thresholds",
        "category": "Rule",
        "description": "Regulatory threshold for Unlisted Public Companies Thresholds."
      },
      {
        "keyword": "Private Limited Companies Thresholds",
        "category": "Provision",
        "description": "Core guideline on Private Limited Companies Thresholds."
      }
    ],
    "shortSuggestedAnswer": "| Class of Company | Paid-up Share Capital | Turnover | Outstanding Loans / Borrowings from Banks/PFIs | Outstanding Deposits |\n| :--- | :--- | :--- | :--- | :--- |\n| **Listed Company** | **Always Mandatory** (Every listed company must appoint an internal auditor). |\n| **Unlisted Public Company** | $\\ge \\mathbf{\u20b950 \text{ Crores}}$ (at end of preceding FY) | $\\ge \\mathbf{\u20b9200 \text{ Crores}}$ (during preceding FY) | Exceeding $\\mathbf{\u20b9100 \text{ Crores}}$ at any point during preceding FY | $\\ge \\mathbf{\u20b925 \text{ Crores}}$ at any point during preceding FY |\n| **Private Company** | Not Applicable | $\\ge \\mathbf{\u20b9200 \text{ Crores}}$ (during preceding FY) | Exceeding $\\mathbf{\u20b9100 \text{ Crores}}$ at any point during preceding FY | Not Applicable (Private companies cannot accept public deposits) |",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Section 138 Companies Act 2013 and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Section 138 Companies Act 2013.",
        "Incorrectly applying Rule 13 Applicability Thresholds."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Section 138 Companies Act 2013 and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_14",
    "subjectId": "Audit",
    "chapterName": "Due Diligence, Investigation & Forensic Audit",
    "title": "Due Diligence vs Statutory Audit vs Investigation: Conceptual & Evidential Triad",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP & Past Exam (Due Diligence)",
    "question": "Construct a comprehensive comparative matrix distinguishing between a 'Statutory Audit', an 'Investigation', and a 'Due Diligence Engagement'.",
    "keyConcepts": [
      {
        "keyword": "Due Diligence vs Audit vs Investigation",
        "category": "Standard",
        "description": "Mandate under Due Diligence vs Audit vs Investigation."
      },
      {
        "keyword": "Objective and Scope",
        "category": "Provision",
        "description": "Statutory requirement for Objective and Scope."
      },
      {
        "keyword": "Approach & Mindset",
        "category": "Rule",
        "description": "Regulatory threshold for Approach & Mindset."
      },
      {
        "keyword": "Period Covered & Inherent Limits",
        "category": "Provision",
        "description": "Core guideline on Period Covered & Inherent Limits."
      }
    ],
    "shortSuggestedAnswer": "| Dimension | Statutory Audit (Section 143) | Investigation (Special Purpose) | Due Diligence (M&A / Acquisition) |\n| :--- | :--- | :--- | :--- |\n| **Objective** | Form an opinion whether financial statements present a 'true and fair' view. | Establish a pre-determined factual truth or probe an alleged wrongdoing/fraud. | Evaluate financial, commercial, legal, and operational risks of a business proposal for a buyer/investor. |\n| **Approach & Mindset** | Professional Skepticism (neither assumes innocence nor guilt; not a bloodhound). | Inquisitive and suspicious; seeks conclusive proof and legal evidence (investigative mindset). | Inquisitive and exploratory; identifies hidden liabilities, synergies, and deal breakers. |\n| **Period Covered** | Specifically defined financial year (historical 12 months). | Defined by terms of inquiry (may span 3 to 10 years or specific transactions). | Historical 3-5 years plus future projections and sustainability analysis. |\n| **Reporting Standard** | Governed by SAs and statutory reporting formats (SA 700 / CARO). | Governed by contract terms; factual findings and forensic evidence. | Comprehensive DD Report detailing risks, SWOT, and valuation adjustments. |",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Due Diligence vs Audit vs Investigation and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Due Diligence vs Audit vs Investigation.",
        "Incorrectly applying Objective and Scope."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Due Diligence vs Audit vs Investigation and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_15",
    "subjectId": "Audit",
    "chapterName": "Emerging Areas / Forensic Accounting",
    "title": "Forensic Accounting Tools - Benford's Law, Data Analytics & Digital Forensics in Fraud Detection",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP & Past Exam (Benford's Law)",
    "question": "Explain how Benford's Law and Computer Assisted Audit Techniques (CAATs) are used in forensic audits to detect fictitious procurement invoices and embezzlement.",
    "keyConcepts": [
      {
        "keyword": "Benford's Law in Forensic Audit",
        "category": "Standard",
        "description": "Mandate under Benford's Law in Forensic Audit."
      },
      {
        "keyword": "First-Digit Frequency Distribution",
        "category": "Provision",
        "description": "Statutory requirement for First-Digit Frequency Distribution."
      },
      {
        "keyword": "Data Analytics in Procurement Fraud",
        "category": "Rule",
        "description": "Regulatory threshold for Data Analytics in Procurement Fraud."
      },
      {
        "keyword": "Digital Evidence Forensics",
        "category": "Provision",
        "description": "Core guideline on Digital Evidence Forensics."
      }
    ],
    "shortSuggestedAnswer": "| Forensic Tool | Theoretical Mechanism & Distribution | Application in Fraud Detection |\n| :--- | :--- | :--- |\n| **Benford's Law (First-Digit Law)** | In naturally occurring numerical datasets, the number '1' appears as the leading first digit approximately **30.1%** of the time, while '9' appears only **4.6%** of the time. | Fictitious invoices created by humans violate Benford's natural curve (clustering around threshold amounts like \u20b94,990 to bypass \u20b95,000 approval limits). |\n| **Duplicate Payment Analytics** | SQL scripts scanning vendor ledgers for identical amounts, invoice numbers, or bank accounts with slight permutations. | Detects duplicate billing, ghost vendors, and split purchase orders. |\n| **Digital Evidence & Hash Values** | Extraction of hard drives and ERP databases using write-blockers and generating SHA-256 hash values. | Ensures electronic evidence meets Section 65B of Indian Evidence Act for court admissibility. |",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Benford's Law in Forensic Audit and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Benford's Law in Forensic Audit.",
        "Incorrectly applying First-Digit Frequency Distribution."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Benford's Law in Forensic Audit and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_16",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals & ESG Assurance",
    "title": "Sustainable Development Goals (SDGs) & ESG Assurance - BRSR Core Framework & SEBI Mandate",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP & Past Exam (BRSR Core)",
    "question": "Explain the Business Responsibility and Sustainability Reporting (BRSR) Core framework mandated by SEBI for top 1,000 listed entities. Distinguish between 'Reasonable Assurance' and 'Limited Assurance' on ESG key performance indicators.",
    "keyConcepts": [
      {
        "keyword": "BRSR Core Framework",
        "category": "Standard",
        "description": "Mandate under BRSR Core Framework."
      },
      {
        "keyword": "SEBI ESG Assurance Mandate",
        "category": "Provision",
        "description": "Statutory requirement for SEBI ESG Assurance Mandate."
      },
      {
        "keyword": "Reasonable vs Limited ESG Assurance",
        "category": "Rule",
        "description": "Regulatory threshold for Reasonable vs Limited ESG Assurance."
      },
      {
        "keyword": "Value Chain ESG Auditing",
        "category": "Provision",
        "description": "Core guideline on Value Chain ESG Auditing."
      }
    ],
    "shortSuggestedAnswer": "| ESG Assurance Element | SEBI BRSR Core Statutory Mandate | Key Verification Procedures |\n| :--- | :--- | :--- |\n| **BRSR Core Scope** | Mandatory for top 1,000 listed entities by market capitalization. Covers 9 environmental, social, and governance attributes. | GHG emissions (Scope 1 & 2), water consumption, circularity, employee diversity, living wages, gender pay gap. |\n| **Reasonable Assurance on ESG** | High level of assurance where practitioner gathers sufficient evidence to conclude that ESG indicators are free from material misstatement. | Direct verification of meter readings, utility bills, energy consumption logs, payroll records for living wage calculation. |\n| **Limited Assurance on ESG** | Moderate level of assurance based primarily on inquiry and analytical procedures. | Reviewing methodology of emission calculations, testing reconciliations of reported numbers against utility summaries. |",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of BRSR Core Framework and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of BRSR Core Framework.",
        "Incorrectly applying SEBI ESG Assurance Mandate."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of BRSR Core Framework and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_17",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Agricultural Advances NPA Norms: Short Duration vs Long Duration Crops",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Agricultural Advances)",
    "question": "Explain the NPA classification norms for agricultural advances under RBI guidelines. Differentiate between 'Short Duration Crops' and 'Long Duration Crops' and state the trigger points for NPA categorization.",
    "keyConcepts": [
      {
        "keyword": "Agricultural Advances NPA Norms",
        "category": "Standard",
        "description": "Core requirement under Agricultural Advances NPA Norms."
      },
      {
        "keyword": "Short Duration Crop Season Norm",
        "category": "Provision",
        "description": "Key rule concerning Short Duration Crop Season Norm."
      },
      {
        "keyword": "Long Duration Crop Season Norm",
        "category": "Rule",
        "description": "Regulatory threshold for Long Duration Crop Season Norm."
      },
      {
        "keyword": "Natural Calamity Restructuring",
        "category": "Provision",
        "description": "Verification protocol for Natural Calamity Restructuring."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Agricultural Advances NPA Norms** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Short Duration Crop Season Norm** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Long Duration Crop Season Norm** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Natural Calamity Restructuring** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Agricultural Advances NPA Norms and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Agricultural Advances NPA Norms.",
        "Incorrectly applying Short Duration Crop Season Norm."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Agricultural Advances NPA Norms and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_18",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Consortium Advances & Recovery Apportionment",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Consortium Advances)",
    "question": "How are advances under consortium banking arrangements classified and provided for under RBI norms? Can one member bank classify an account as Standard if the lead bank classified it as NPA?",
    "keyConcepts": [
      {
        "keyword": "Consortium Advances NPA Classification",
        "category": "Standard",
        "description": "Core requirement under Consortium Advances NPA Classification."
      },
      {
        "keyword": "Member Bank vs Lead Bank Classification",
        "category": "Provision",
        "description": "Key rule concerning Member Bank vs Lead Bank Classification."
      },
      {
        "keyword": "Recovery Apportionment Principle",
        "category": "Rule",
        "description": "Regulatory threshold for Recovery Apportionment Principle."
      },
      {
        "keyword": "Individual Bank Prudence",
        "category": "Provision",
        "description": "Verification protocol for Individual Bank Prudence."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Consortium Advances NPA Classification** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Member Bank vs Lead Bank Classification** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Recovery Apportionment Principle** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Individual Bank Prudence** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Consortium Advances NPA Classification and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Consortium Advances NPA Classification.",
        "Incorrectly applying Member Bank vs Lead Bank Classification."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Consortium Advances NPA Classification and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_19",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Verification of Bank Guarantees & Letters of Credit Margin Requirements",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Bank Guarantees)",
    "question": "Detail the audit procedures for testing the completeness and valuation of Non-Fund Based facilities (Letters of Credit and Bank Guarantees) in a commercial bank branch.",
    "keyConcepts": [
      {
        "keyword": "Bank Guarantees Audit",
        "category": "Standard",
        "description": "Core requirement under Bank Guarantees Audit."
      },
      {
        "keyword": "Letters of Credit Audit",
        "category": "Provision",
        "description": "Key rule concerning Letters of Credit Audit."
      },
      {
        "keyword": "Margin Deposit Verification",
        "category": "Rule",
        "description": "Regulatory threshold for Margin Deposit Verification."
      },
      {
        "keyword": "Expired Un-cancelled Guarantees",
        "category": "Provision",
        "description": "Verification protocol for Expired Un-cancelled Guarantees."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Bank Guarantees Audit** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Letters of Credit Audit** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Margin Deposit Verification** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Expired Un-cancelled Guarantees** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Bank Guarantees Audit and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Bank Guarantees Audit.",
        "Incorrectly applying Letters of Credit Audit."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Bank Guarantees Audit and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_20",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "NBFC - Net Owned Fund (NOF) Computation under Section 45-IA of RBI Act",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Section 45-IA)",
    "question": "State the statutory formula for computing 'Net Owned Fund' (NOF) of an NBFC under Section 45-IA of the Reserve Bank of India Act, 1934. What assets are deducted from Owned Funds?",
    "keyConcepts": [
      {
        "keyword": "Section 45-IA RBI Act 1934",
        "category": "Standard",
        "description": "Core requirement under Section 45-IA RBI Act 1934."
      },
      {
        "keyword": "Net Owned Fund (NOF) Formula",
        "category": "Provision",
        "description": "Key rule concerning Net Owned Fund (NOF) Formula."
      },
      {
        "keyword": "Owned Fund Components",
        "category": "Rule",
        "description": "Regulatory threshold for Owned Fund Components."
      },
      {
        "keyword": "Deductions from Owned Funds",
        "category": "Provision",
        "description": "Verification protocol for Deductions from Owned Funds."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Section 45-IA RBI Act 1934** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Net Owned Fund (NOF) Formula** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Owned Fund Components** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Deductions from Owned Funds** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Section 45-IA RBI Act 1934 and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Section 45-IA RBI Act 1934.",
        "Incorrectly applying Net Owned Fund (NOF) Formula."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Section 45-IA RBI Act 1934 and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_21",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "NBFC - Concentration of Credit and Investment Norms under Scale Based Regulation",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (NBFC Concentration)",
    "question": "What are the credit and investment concentration limits prescribed by RBI for NBFCs in the Middle and Upper Layers under Scale Based Regulation?",
    "keyConcepts": [
      {
        "keyword": "NBFC Concentration of Credit Norms",
        "category": "Standard",
        "description": "Core requirement under NBFC Concentration of Credit Norms."
      },
      {
        "keyword": "Single Borrower Exposure Limit",
        "category": "Provision",
        "description": "Key rule concerning Single Borrower Exposure Limit."
      },
      {
        "keyword": "Group Borrower Exposure Limit",
        "category": "Rule",
        "description": "Regulatory threshold for Group Borrower Exposure Limit."
      },
      {
        "keyword": "Large Exposure Framework (LEF)",
        "category": "Provision",
        "description": "Verification protocol for Large Exposure Framework (LEF)."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **NBFC Concentration of Credit Norms** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Single Borrower Exposure Limit** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Group Borrower Exposure Limit** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Large Exposure Framework (LEF)** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of NBFC Concentration of Credit Norms and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of NBFC Concentration of Credit Norms.",
        "Incorrectly applying Single Borrower Exposure Limit."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of NBFC Concentration of Credit Norms and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_22",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Audit of Insurance Companies - IRDAI Investment Regulations & Solvency Margin",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Insurance Solvency)",
    "question": "Explain the statutory requirement of maintaining the 'Solvency Margin' by insurance companies under the Insurance Act, 1938 and IRDAI regulations.",
    "keyConcepts": [
      {
        "keyword": "Insurance Solvency Margin",
        "category": "Standard",
        "description": "Core requirement under Insurance Solvency Margin."
      },
      {
        "keyword": "Available Solvency Margin (ASM)",
        "category": "Provision",
        "description": "Key rule concerning Available Solvency Margin (ASM)."
      },
      {
        "keyword": "Required Solvency Margin (RSM)",
        "category": "Rule",
        "description": "Regulatory threshold for Required Solvency Margin (RSM)."
      },
      {
        "keyword": "Solvency Ratio Minimum 1.5",
        "category": "Provision",
        "description": "Verification protocol for Solvency Ratio Minimum 1.5."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Insurance Solvency Margin** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Available Solvency Margin (ASM)** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Required Solvency Margin (RSM)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Solvency Ratio Minimum 1.5** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Insurance Solvency Margin and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Insurance Solvency Margin.",
        "Incorrectly applying Available Solvency Margin (ASM)."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Insurance Solvency Margin and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_23",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Audit of Insurance Companies - Unexpired Risk Reserve (URR) & Premium Deficiency",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Unexpired Risk)",
    "question": "How is the Reserve for Unexpired Risk (URR) computed for general insurance companies (Fire, Marine, and Miscellaneous)? What is a Premium Deficiency Reserve?",
    "keyConcepts": [
      {
        "keyword": "Unexpired Risk Reserve (URR)",
        "category": "Standard",
        "description": "Core requirement under Unexpired Risk Reserve (URR)."
      },
      {
        "keyword": "Fire and Misc Business (50% URR)",
        "category": "Provision",
        "description": "Key rule concerning Fire and Misc Business (50% URR)."
      },
      {
        "keyword": "Marine Hull Business (100% URR)",
        "category": "Rule",
        "description": "Regulatory threshold for Marine Hull Business (100% URR)."
      },
      {
        "keyword": "Premium Deficiency Reserve",
        "category": "Provision",
        "description": "Verification protocol for Premium Deficiency Reserve."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Unexpired Risk Reserve (URR)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Fire and Misc Business (50% URR)** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Marine Hull Business (100% URR)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Premium Deficiency Reserve** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Unexpired Risk Reserve (URR) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Unexpired Risk Reserve (URR).",
        "Incorrectly applying Fire and Misc Business (50% URR)."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Unexpired Risk Reserve (URR) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_24",
    "subjectId": "Audit",
    "chapterName": "Related Services and Review Engagements",
    "title": "SRS 4400 - Terms of Agreed-Upon Procedures Engagement Letter & Documentation",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (SRS 4400)",
    "question": "What specific matters must be agreed upon in the engagement letter for an Agreed-Upon Procedures engagement under SRS 4400 to prevent misunderstandings?",
    "keyConcepts": [
      {
        "keyword": "SRS 4400 Engagement Letter",
        "category": "Standard",
        "description": "Core requirement under SRS 4400 Engagement Letter."
      },
      {
        "keyword": "Listing Specific Procedures",
        "category": "Provision",
        "description": "Key rule concerning Listing Specific Procedures."
      },
      {
        "keyword": "Non-Assurance Disclaimer",
        "category": "Rule",
        "description": "Regulatory threshold for Non-Assurance Disclaimer."
      },
      {
        "keyword": "Restricted Distribution Clause",
        "category": "Provision",
        "description": "Verification protocol for Restricted Distribution Clause."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **SRS 4400 Engagement Letter** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Listing Specific Procedures** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Non-Assurance Disclaimer** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Restricted Distribution Clause** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of SRS 4400 Engagement Letter and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of SRS 4400 Engagement Letter.",
        "Incorrectly applying Listing Specific Procedures."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of SRS 4400 Engagement Letter and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_25",
    "subjectId": "Audit",
    "chapterName": "Related Services and Review Engagements",
    "title": "SRS 4410 - Compilation Procedures & Response to Material Misstatement in Information Provided",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (SRS 4410)",
    "question": "What actions must a practitioner take under SRS 4410 if records, documents, explanations, or other information provided by management are incomplete, inaccurate, or unsatisfactory?",
    "keyConcepts": [
      {
        "keyword": "SRS 4410 Deficient Client Records",
        "category": "Standard",
        "description": "Core requirement under SRS 4410 Deficient Client Records."
      },
      {
        "keyword": "Requesting Additional Information",
        "category": "Provision",
        "description": "Key rule concerning Requesting Additional Information."
      },
      {
        "keyword": "Withdrawal from Engagement",
        "category": "Rule",
        "description": "Regulatory threshold for Withdrawal from Engagement."
      },
      {
        "keyword": "Refusal of Compilation",
        "category": "Provision",
        "description": "Verification protocol for Refusal of Compilation."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **SRS 4410 Deficient Client Records** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Requesting Additional Information** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Withdrawal from Engagement** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Refusal of Compilation** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of SRS 4410 Deficient Client Records and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of SRS 4410 Deficient Client Records.",
        "Incorrectly applying Requesting Additional Information."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of SRS 4410 Deficient Client Records and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_26",
    "subjectId": "Audit",
    "chapterName": "Related Services and Review Engagements",
    "title": "SRE 2400 - Analytical Procedures and Trend Analyses in Review Engagements",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (SRE 2400)",
    "question": "Describe the analytical procedures that a practitioner designs and applies when conducting a review of financial statements under SRE 2400.",
    "keyConcepts": [
      {
        "keyword": "SRE 2400 Analytical Procedures",
        "category": "Standard",
        "description": "Core requirement under SRE 2400 Analytical Procedures."
      },
      {
        "keyword": "Comparing Financial Results",
        "category": "Provision",
        "description": "Key rule concerning Comparing Financial Results."
      },
      {
        "keyword": "Plausible Relationships",
        "category": "Rule",
        "description": "Regulatory threshold for Plausible Relationships."
      },
      {
        "keyword": "Investigating Significant Variances",
        "category": "Provision",
        "description": "Verification protocol for Investigating Significant Variances."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **SRE 2400 Analytical Procedures** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Comparing Financial Results** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Plausible Relationships** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Investigating Significant Variances** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of SRE 2400 Analytical Procedures and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of SRE 2400 Analytical Procedures.",
        "Incorrectly applying Comparing Financial Results."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of SRE 2400 Analytical Procedures and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_27",
    "subjectId": "Audit",
    "chapterName": "Related Services and Review Engagements",
    "title": "SRE 2410 - Management Representations in Interim Review Engagements",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (SRE 2410)",
    "question": "What specific written representations must the statutory auditor obtain from management when conducting a review of interim financial information under SRE 2410?",
    "keyConcepts": [
      {
        "keyword": "SRE 2410 Written Representations",
        "category": "Standard",
        "description": "Core requirement under SRE 2410 Written Representations."
      },
      {
        "keyword": "Interim Financial Reporting Framework",
        "category": "Provision",
        "description": "Key rule concerning Interim Financial Reporting Framework."
      },
      {
        "keyword": "Measurement Principles Compliance",
        "category": "Rule",
        "description": "Regulatory threshold for Measurement Principles Compliance."
      },
      {
        "keyword": "Subsequent Events to Interim Period",
        "category": "Provision",
        "description": "Verification protocol for Subsequent Events to Interim Period."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **SRE 2410 Written Representations** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Interim Financial Reporting Framework** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Measurement Principles Compliance** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Subsequent Events to Interim Period** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of SRE 2410 Written Representations and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of SRE 2410 Written Representations.",
        "Incorrectly applying Interim Financial Reporting Framework."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of SRE 2410 Written Representations and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_28",
    "subjectId": "Audit",
    "chapterName": "Prospective Financial Information & Other Assurance",
    "title": "SAE 3400 - Minimum Period Covered & Inherent Limitation Disclosures in PFI",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (SAE 3400)",
    "question": "Why is prospective financial information rarely prepared for periods exceeding 3 to 5 years, and what factors determine the acceptable period covered under SAE 3400?",
    "keyConcepts": [
      {
        "keyword": "SAE 3400 Period Covered",
        "category": "Standard",
        "description": "Core requirement under SAE 3400 Period Covered."
      },
      {
        "keyword": "Operating Cycle of Entity",
        "category": "Provision",
        "description": "Key rule concerning Operating Cycle of Entity."
      },
      {
        "keyword": "Reliability of Assumptions",
        "category": "Rule",
        "description": "Regulatory threshold for Reliability of Assumptions."
      },
      {
        "keyword": "Speculative Long-Term Projections",
        "category": "Provision",
        "description": "Verification protocol for Speculative Long-Term Projections."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **SAE 3400 Period Covered** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Operating Cycle of Entity** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Reliability of Assumptions** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Speculative Long-Term Projections** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of SAE 3400 Period Covered and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of SAE 3400 Period Covered.",
        "Incorrectly applying Operating Cycle of Entity."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of SAE 3400 Period Covered and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_29",
    "subjectId": "Audit",
    "chapterName": "Prospective Financial Information & Other Assurance",
    "title": "SAE 3402 - Assurance Reports on Controls at a Service Organization: SOC 1 vs SOC 2",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (SAE 3402)",
    "question": "Compare SOC 1 (Internal Controls over Financial Reporting) and SOC 2 (Trust Services Criteria) assurance reports under SAE 3402 / ISAE 3402.",
    "keyConcepts": [
      {
        "keyword": "SAE 3402 Assurance Reports",
        "category": "Standard",
        "description": "Core requirement under SAE 3402 Assurance Reports."
      },
      {
        "keyword": "SOC 1 (Financial Controls Focus)",
        "category": "Provision",
        "description": "Key rule concerning SOC 1 (Financial Controls Focus)."
      },
      {
        "keyword": "SOC 2 (Trust Services Criteria)",
        "category": "Rule",
        "description": "Regulatory threshold for SOC 2 (Trust Services Criteria)."
      },
      {
        "keyword": "Security, Availability, Confidentiality",
        "category": "Provision",
        "description": "Verification protocol for Security, Availability, Confidentiality."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **SAE 3402 Assurance Reports** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **SOC 1 (Financial Controls Focus)** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **SOC 2 (Trust Services Criteria)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Security, Availability, Confidentiality** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of SAE 3402 Assurance Reports and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of SAE 3402 Assurance Reports.",
        "Incorrectly applying SOC 1 (Financial Controls Focus)."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of SAE 3402 Assurance Reports and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_30",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Digital Auditing - Automated Tools & Generalized Audit Software (GAS)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Generalized Audit)",
    "question": "Explain the practical applications of Generalized Audit Software (GAS) in performing substantive audit procedures on high-volume transactional data.",
    "keyConcepts": [
      {
        "keyword": "Generalized Audit Software (GAS)",
        "category": "Standard",
        "description": "Core requirement under Generalized Audit Software (GAS)."
      },
      {
        "keyword": "Automated Data Extraction",
        "category": "Provision",
        "description": "Key rule concerning Automated Data Extraction."
      },
      {
        "keyword": "100% Data Testing vs Sampling",
        "category": "Rule",
        "description": "Regulatory threshold for 100% Data Testing vs Sampling."
      },
      {
        "keyword": "Exception Reporting Queries",
        "category": "Provision",
        "description": "Verification protocol for Exception Reporting Queries."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Generalized Audit Software (GAS)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Automated Data Extraction** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **100% Data Testing vs Sampling** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Exception Reporting Queries** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Generalized Audit Software (GAS) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Generalized Audit Software (GAS).",
        "Incorrectly applying Automated Data Extraction."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Generalized Audit Software (GAS) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_31",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Digital Auditing - IT General Controls (ITGC) vs Automated Application Controls",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (IT General)",
    "question": "Explain the interrelationship between IT General Controls (ITGC) and Automated Application Controls. Can application controls be relied upon if ITGCs are deficient?",
    "keyConcepts": [
      {
        "keyword": "IT General Controls (ITGC)",
        "category": "Standard",
        "description": "Core requirement under IT General Controls (ITGC)."
      },
      {
        "keyword": "Automated Application Controls",
        "category": "Provision",
        "description": "Key rule concerning Automated Application Controls."
      },
      {
        "keyword": "Access Controls & Program Changes",
        "category": "Rule",
        "description": "Regulatory threshold for Access Controls & Program Changes."
      },
      {
        "keyword": "Compensating Controls",
        "category": "Provision",
        "description": "Verification protocol for Compensating Controls."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **IT General Controls (ITGC)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Automated Application Controls** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Access Controls & Program Changes** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Compensating Controls** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of IT General Controls (ITGC) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of IT General Controls (ITGC).",
        "Incorrectly applying Automated Application Controls."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of IT General Controls (ITGC) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_32",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Digital Auditing - Audit Trail (Edit Log) Verification under Rule 3(1) of Companies Accounts Rules",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Audit Trail)",
    "question": "Detail the statutory reporting requirement for statutory auditors under Section 143(3) read with Rule 11(g) regarding the mandatory Audit Trail (Edit Log) feature in accounting software.",
    "keyConcepts": [
      {
        "keyword": "Audit Trail Feature Rule 3(1)",
        "category": "Standard",
        "description": "Core requirement under Audit Trail Feature Rule 3(1)."
      },
      {
        "keyword": "Rule 11(g) Audit Reporting",
        "category": "Provision",
        "description": "Key rule concerning Rule 11(g) Audit Reporting."
      },
      {
        "keyword": "Tamper-Proof Edit Log",
        "category": "Rule",
        "description": "Regulatory threshold for Tamper-Proof Edit Log."
      },
      {
        "keyword": "Preservation of Audit Trail",
        "category": "Provision",
        "description": "Verification protocol for Preservation of Audit Trail."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Audit Trail Feature Rule 3(1)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Rule 11(g) Audit Reporting** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Tamper-Proof Edit Log** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Preservation of Audit Trail** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Audit Trail Feature Rule 3(1) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Audit Trail Feature Rule 3(1).",
        "Incorrectly applying Rule 11(g) Audit Reporting."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Audit Trail Feature Rule 3(1) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_33",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Group Audits - Component Materiality Determination under SA 600 & ISA 600",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Component Materiality)",
    "question": "Explain how component materiality is determined for individual group entities to reduce aggregation risk under group auditing standards.",
    "keyConcepts": [
      {
        "keyword": "Component Materiality",
        "category": "Standard",
        "description": "Core requirement under Component Materiality."
      },
      {
        "keyword": "Aggregation Risk in Group Audits",
        "category": "Provision",
        "description": "Key rule concerning Aggregation Risk in Group Audits."
      },
      {
        "keyword": "Benchmark Sizing",
        "category": "Rule",
        "description": "Regulatory threshold for Benchmark Sizing."
      },
      {
        "keyword": "Communication to Component Auditor",
        "category": "Provision",
        "description": "Verification protocol for Communication to Component Auditor."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Component Materiality** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Aggregation Risk in Group Audits** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Benchmark Sizing** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Communication to Component Auditor** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Component Materiality and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Component Materiality.",
        "Incorrectly applying Aggregation Risk in Group Audits."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Component Materiality and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_34",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Group Audits - Differences in Accounting Policies of Parent and Subsidiary",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Harmonization of)",
    "question": "How should the group auditor deal with situations where a foreign subsidiary prepares financial statements under different accounting policies from the Indian Parent under Ind AS 110?",
    "keyConcepts": [
      {
        "keyword": "Harmonization of Accounting Policies",
        "category": "Standard",
        "description": "Core requirement under Harmonization of Accounting Policies."
      },
      {
        "keyword": "Ind AS 110 Uniform Policies",
        "category": "Provision",
        "description": "Key rule concerning Ind AS 110 Uniform Policies."
      },
      {
        "keyword": "Consolidation Adjustments for Policies",
        "category": "Rule",
        "description": "Regulatory threshold for Consolidation Adjustments for Policies."
      },
      {
        "keyword": "Component Auditor Instructions",
        "category": "Provision",
        "description": "Verification protocol for Component Auditor Instructions."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Harmonization of Accounting Policies** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Ind AS 110 Uniform Policies** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Consolidation Adjustments for Policies** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Component Auditor Instructions** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Harmonization of Accounting Policies and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Harmonization of Accounting Policies.",
        "Incorrectly applying Ind AS 110 Uniform Policies."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Harmonization of Accounting Policies and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_35",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Group Audits - Auditing Joint Ventures and Associates under Equity Method (Ind AS 28)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Ind AS)",
    "question": "What audit procedures must the group auditor perform to verify the carrying value of investments and share of profit/loss in associates and joint ventures under Ind AS 28?",
    "keyConcepts": [
      {
        "keyword": "Ind AS 28 Equity Method Audit",
        "category": "Standard",
        "description": "Core requirement under Ind AS 28 Equity Method Audit."
      },
      {
        "keyword": "Share of Profit/Loss Verification",
        "category": "Provision",
        "description": "Key rule concerning Share of Profit/Loss Verification."
      },
      {
        "keyword": "Impairment Testing of Investment",
        "category": "Rule",
        "description": "Regulatory threshold for Impairment Testing of Investment."
      },
      {
        "keyword": "Uniform Accounting Policies",
        "category": "Provision",
        "description": "Verification protocol for Uniform Accounting Policies."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Ind AS 28 Equity Method Audit** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Share of Profit/Loss Verification** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Impairment Testing of Investment** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Uniform Accounting Policies** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Ind AS 28 Equity Method Audit and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Ind AS 28 Equity Method Audit.",
        "Incorrectly applying Share of Profit/Loss Verification."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Ind AS 28 Equity Method Audit and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_36",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of PSUs",
    "title": "PSU Audit - Supplementary Audit by C&AG under Section 143(6) of Companies Act",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Section 143(6))",
    "question": "Explain the statutory powers of the C&AG under Section 143(6) of the Companies Act, 2013 regarding Supplementary Audit and commenting upon the statutory auditor's report.",
    "keyConcepts": [
      {
        "keyword": "Section 143(6) Companies Act 2013",
        "category": "Standard",
        "description": "Core requirement under Section 143(6) Companies Act 2013."
      },
      {
        "keyword": "Supplementary Audit by C&AG",
        "category": "Provision",
        "description": "Key rule concerning Supplementary Audit by C&AG."
      },
      {
        "keyword": "60 Days Statutory Period",
        "category": "Rule",
        "description": "Regulatory threshold for 60 Days Statutory Period."
      },
      {
        "keyword": "Comments of C&AG Placed before AGM",
        "category": "Provision",
        "description": "Verification protocol for Comments of C&AG Placed before AGM."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Section 143(6) Companies Act 2013** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Supplementary Audit by C&AG** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **60 Days Statutory Period** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Comments of C&AG Placed before AGM** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Section 143(6) Companies Act 2013 and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Section 143(6) Companies Act 2013.",
        "Incorrectly applying Supplementary Audit by C&AG."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Section 143(6) Companies Act 2013 and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_37",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of PSUs",
    "title": "PSU Audit - C&AG Test Audit under Section 143(7) of Companies Act",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Section 143(7))",
    "question": "What is a 'Test Audit' conducted by the C&AG under Section 143(7) of Companies Act, 2013, and how does it differ from a Supplementary Audit?",
    "keyConcepts": [
      {
        "keyword": "Section 143(7) Test Audit",
        "category": "Standard",
        "description": "Core requirement under Section 143(7) Test Audit."
      },
      {
        "keyword": "C&AG Direct Inspection",
        "category": "Provision",
        "description": "Key rule concerning C&AG Direct Inspection."
      },
      {
        "keyword": "Audit of Accounts by C&AG Staff",
        "category": "Rule",
        "description": "Regulatory threshold for Audit of Accounts by C&AG Staff."
      },
      {
        "keyword": "Differences with Supplementary Audit",
        "category": "Provision",
        "description": "Verification protocol for Differences with Supplementary Audit."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Section 143(7) Test Audit** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **C&AG Direct Inspection** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Audit of Accounts by C&AG Staff** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Differences with Supplementary Audit** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Section 143(7) Test Audit and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Section 143(7) Test Audit.",
        "Incorrectly applying C&AG Direct Inspection."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Section 143(7) Test Audit and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_38",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of PSUs",
    "title": "PSU Audit - Audit of Government Grants and Subsidies",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Audit of)",
    "question": "Detail the audit procedures for examining government grants, subsidies, and budgetary allocations received by public sector undertakings.",
    "keyConcepts": [
      {
        "keyword": "Audit of Government Grants",
        "category": "Standard",
        "description": "Core requirement under Audit of Government Grants."
      },
      {
        "keyword": "Ind AS 20 Accounting for Grants",
        "category": "Provision",
        "description": "Key rule concerning Ind AS 20 Accounting for Grants."
      },
      {
        "keyword": "Utilization Certificate Compliance",
        "category": "Rule",
        "description": "Regulatory threshold for Utilization Certificate Compliance."
      },
      {
        "keyword": "Conditions Precedent to Grants",
        "category": "Provision",
        "description": "Verification protocol for Conditions Precedent to Grants."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Audit of Government Grants** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Ind AS 20 Accounting for Grants** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Utilization Certificate Compliance** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Conditions Precedent to Grants** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Audit of Government Grants and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Audit of Government Grants.",
        "Incorrectly applying Ind AS 20 Accounting for Grants."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Audit of Government Grants and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_39",
    "subjectId": "Audit",
    "chapterName": "Internal Audit",
    "title": "Internal Audit - Standards on Internal Audit (SIA 210, SIA 220, SIA 310)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Standards on)",
    "question": "Summarize the mandatory framework of Standards on Internal Audit (SIAs) formulated by ICAI, detailing the SIA structure (Foundational, Process, and Thematic Standards).",
    "keyConcepts": [
      {
        "keyword": "Standards on Internal Audit (SIAs)",
        "category": "Standard",
        "description": "Core requirement under Standards on Internal Audit (SIAs)."
      },
      {
        "keyword": "Foundational Standards (SIA 100 series)",
        "category": "Provision",
        "description": "Key rule concerning Foundational Standards (SIA 100 series)."
      },
      {
        "keyword": "Process Standards (SIA 200/300 series)",
        "category": "Rule",
        "description": "Regulatory threshold for Process Standards (SIA 200/300 series)."
      },
      {
        "keyword": "Internal Audit Charter",
        "category": "Provision",
        "description": "Verification protocol for Internal Audit Charter."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Standards on Internal Audit (SIAs)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Foundational Standards (SIA 100 series)** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Process Standards (SIA 200/300 series)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Internal Audit Charter** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Standards on Internal Audit (SIAs) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Standards on Internal Audit (SIAs).",
        "Incorrectly applying Foundational Standards (SIA 100 series)."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Standards on Internal Audit (SIAs) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_40",
    "subjectId": "Audit",
    "chapterName": "Internal Audit",
    "title": "Internal Audit - Risk-Based Internal Audit (RBIA) Methodology",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Risk-Based Internal)",
    "question": "Explain the methodology of Risk-Based Internal Audit (RBIA) and how it links internal audit priorities directly to enterprise risk management.",
    "keyConcepts": [
      {
        "keyword": "Risk-Based Internal Audit (RBIA)",
        "category": "Standard",
        "description": "Core requirement under Risk-Based Internal Audit (RBIA)."
      },
      {
        "keyword": "Enterprise Risk Assessment",
        "category": "Provision",
        "description": "Key rule concerning Enterprise Risk Assessment."
      },
      {
        "keyword": "Audit Universe Mapping",
        "category": "Rule",
        "description": "Regulatory threshold for Audit Universe Mapping."
      },
      {
        "keyword": "Dynamic Audit Planning",
        "category": "Provision",
        "description": "Verification protocol for Dynamic Audit Planning."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Risk-Based Internal Audit (RBIA)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Enterprise Risk Assessment** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Audit Universe Mapping** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Dynamic Audit Planning** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Risk-Based Internal Audit (RBIA) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Risk-Based Internal Audit (RBIA).",
        "Incorrectly applying Enterprise Risk Assessment."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Risk-Based Internal Audit (RBIA) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_41",
    "subjectId": "Audit",
    "chapterName": "Internal Audit",
    "title": "Internal Audit - Testing Controls Over Payroll and Human Resource Management",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Internal Audit)",
    "question": "Formulate a detailed internal audit checklist for verifying payroll disbursements, ghost employees, and statutory provident fund / ESI compliance.",
    "keyConcepts": [
      {
        "keyword": "Internal Audit of Payroll",
        "category": "Standard",
        "description": "Core requirement under Internal Audit of Payroll."
      },
      {
        "keyword": "Ghost Employees Verification",
        "category": "Provision",
        "description": "Key rule concerning Ghost Employees Verification."
      },
      {
        "keyword": "PF and ESI Statutory Deductions",
        "category": "Rule",
        "description": "Regulatory threshold for PF and ESI Statutory Deductions."
      },
      {
        "keyword": "Biometric Attendance Cross-Check",
        "category": "Provision",
        "description": "Verification protocol for Biometric Attendance Cross-Check."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Internal Audit of Payroll** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Ghost Employees Verification** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **PF and ESI Statutory Deductions** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Biometric Attendance Cross-Check** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Internal Audit of Payroll and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Internal Audit of Payroll.",
        "Incorrectly applying Ghost Employees Verification."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Internal Audit of Payroll and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_42",
    "subjectId": "Audit",
    "chapterName": "Due Diligence, Investigation & Forensic Audit",
    "title": "Due Diligence - Financial Due Diligence vs Legal Due Diligence",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Financial Due)",
    "question": "Contrast Financial Due Diligence with Legal Due Diligence in a corporate takeover. What key historical adjustments are made to Quality of Earnings (QoE)?",
    "keyConcepts": [
      {
        "keyword": "Financial Due Diligence",
        "category": "Standard",
        "description": "Core requirement under Financial Due Diligence."
      },
      {
        "keyword": "Quality of Earnings (QoE) Analysis",
        "category": "Provision",
        "description": "Key rule concerning Quality of Earnings (QoE) Analysis."
      },
      {
        "keyword": "Normalized EBITDA Adjustments",
        "category": "Rule",
        "description": "Regulatory threshold for Normalized EBITDA Adjustments."
      },
      {
        "keyword": "Legal Due Diligence Focus",
        "category": "Provision",
        "description": "Verification protocol for Legal Due Diligence Focus."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Financial Due Diligence** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Quality of Earnings (QoE) Analysis** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Normalized EBITDA Adjustments** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Legal Due Diligence Focus** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Financial Due Diligence and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Financial Due Diligence.",
        "Incorrectly applying Quality of Earnings (QoE) Analysis."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Financial Due Diligence and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_43",
    "subjectId": "Audit",
    "chapterName": "Due Diligence, Investigation & Forensic Audit",
    "title": "Due Diligence - Identification of Hidden Liabilities and Off-Balance Sheet Commitments",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Hidden Liabilities)",
    "question": "What specific hidden liabilities and off-balance sheet risks must a due diligence team look for during an M&A investigation?",
    "keyConcepts": [
      {
        "keyword": "Hidden Liabilities in Due Diligence",
        "category": "Standard",
        "description": "Core requirement under Hidden Liabilities in Due Diligence."
      },
      {
        "keyword": "Off-Balance Sheet Commitments",
        "category": "Provision",
        "description": "Key rule concerning Off-Balance Sheet Commitments."
      },
      {
        "keyword": "Pending Litigations and Guarantees",
        "category": "Rule",
        "description": "Regulatory threshold for Pending Litigations and Guarantees."
      },
      {
        "keyword": "Unfunded Gratuity Liabilities",
        "category": "Provision",
        "description": "Verification protocol for Unfunded Gratuity Liabilities."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Hidden Liabilities in Due Diligence** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Off-Balance Sheet Commitments** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Pending Litigations and Guarantees** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Unfunded Gratuity Liabilities** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Hidden Liabilities in Due Diligence and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Hidden Liabilities in Due Diligence.",
        "Incorrectly applying Off-Balance Sheet Commitments."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Hidden Liabilities in Due Diligence and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_44",
    "subjectId": "Audit",
    "chapterName": "Due Diligence, Investigation & Forensic Audit",
    "title": "Investigation - Steps in Investigating Frauds Involving Defalcation of Cash",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Cash Defalcation)",
    "question": "Detail the investigative steps to be undertaken by a forensic investigator upon receiving an allegation of cash embezzlement and teeming-and-lading in branch sales.",
    "keyConcepts": [
      {
        "keyword": "Cash Defalcation Investigation",
        "category": "Standard",
        "description": "Core requirement under Cash Defalcation Investigation."
      },
      {
        "keyword": "Teeming and Lading Technique",
        "category": "Provision",
        "description": "Key rule concerning Teeming and Lading Technique."
      },
      {
        "keyword": "Scrutiny of Cash Receipts",
        "category": "Rule",
        "description": "Regulatory threshold for Scrutiny of Cash Receipts."
      },
      {
        "keyword": "Bank Reconciliation Timing",
        "category": "Provision",
        "description": "Verification protocol for Bank Reconciliation Timing."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Cash Defalcation Investigation** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Teeming and Lading Technique** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Scrutiny of Cash Receipts** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Bank Reconciliation Timing** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Cash Defalcation Investigation and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Cash Defalcation Investigation.",
        "Incorrectly applying Teeming and Lading Technique."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Cash Defalcation Investigation and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_45",
    "subjectId": "Audit",
    "chapterName": "Due Diligence, Investigation & Forensic Audit",
    "title": "Investigation - Investigation into Inflated Inventories and Stock Watering",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Stock Inflation)",
    "question": "How should an investigator proceed to verify whether closing stock has been artificially inflated to show higher profits and secure higher bank borrowings?",
    "keyConcepts": [
      {
        "keyword": "Stock Inflation Investigation",
        "category": "Standard",
        "description": "Core requirement under Stock Inflation Investigation."
      },
      {
        "keyword": "Fictitious Inventory Vouchers",
        "category": "Provision",
        "description": "Key rule concerning Fictitious Inventory Vouchers."
      },
      {
        "keyword": "Gross Profit Margin Comparison",
        "category": "Rule",
        "description": "Regulatory threshold for Gross Profit Margin Comparison."
      },
      {
        "keyword": "Physical Warehouse Reconciliation",
        "category": "Provision",
        "description": "Verification protocol for Physical Warehouse Reconciliation."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Stock Inflation Investigation** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Fictitious Inventory Vouchers** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Gross Profit Margin Comparison** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Physical Warehouse Reconciliation** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Stock Inflation Investigation and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Stock Inflation Investigation.",
        "Incorrectly applying Fictitious Inventory Vouchers."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Stock Inflation Investigation and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_46",
    "subjectId": "Audit",
    "chapterName": "Emerging Areas / Forensic Accounting",
    "title": "Forensic Accounting - Prevention of Money Laundering Act (PMLA), 2002: Obligations of Reporting Entities",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Section 12)",
    "question": "Detail the statutory obligations of banking companies, financial institutions, and intermediaries under Section 12 of PMLA, 2002 regarding record maintenance and reporting.",
    "keyConcepts": [
      {
        "keyword": "Section 12 PMLA 2002",
        "category": "Standard",
        "description": "Core requirement under Section 12 PMLA 2002."
      },
      {
        "keyword": "Suspicious Transaction Reports (STRs)",
        "category": "Provision",
        "description": "Key rule concerning Suspicious Transaction Reports (STRs)."
      },
      {
        "keyword": "Cash Transaction Reports (CTRs)",
        "category": "Rule",
        "description": "Regulatory threshold for Cash Transaction Reports (CTRs)."
      },
      {
        "keyword": "Mandatory 5-Year Record Retention",
        "category": "Provision",
        "description": "Verification protocol for Mandatory 5-Year Record Retention."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Section 12 PMLA 2002** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Suspicious Transaction Reports (STRs)** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Cash Transaction Reports (CTRs)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Mandatory 5-Year Record Retention** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Section 12 PMLA 2002 and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Section 12 PMLA 2002.",
        "Incorrectly applying Suspicious Transaction Reports (STRs)."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Section 12 PMLA 2002 and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_47",
    "subjectId": "Audit",
    "chapterName": "Emerging Areas / Forensic Accounting",
    "title": "Forensic Accounting - Fugitive Economic Offenders Act, 2018: Thresholds and Confiscation Powers",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Fugitive Economic)",
    "question": "Explain the key provisions of the Fugitive Economic Offenders Act, 2018, including the monetary threshold of economic offenses (\u20b9100 Cr) and confiscation of properties.",
    "keyConcepts": [
      {
        "keyword": "Fugitive Economic Offenders Act 2018",
        "category": "Standard",
        "description": "Core requirement under Fugitive Economic Offenders Act 2018."
      },
      {
        "keyword": "Threshold of \u20b9100 Crores Offense",
        "category": "Provision",
        "description": "Key rule concerning Threshold of \u20b9100 Crores Offense."
      },
      {
        "keyword": "Declaration of Fugitive Offender",
        "category": "Rule",
        "description": "Regulatory threshold for Declaration of Fugitive Offender."
      },
      {
        "keyword": "Confiscation of Domestic & Overseas Assets",
        "category": "Provision",
        "description": "Verification protocol for Confiscation of Domestic & Overseas Assets."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Fugitive Economic Offenders Act 2018** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Threshold of \u20b9100 Crores Offense** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Declaration of Fugitive Offender** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Confiscation of Domestic & Overseas Assets** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Fugitive Economic Offenders Act 2018 and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Fugitive Economic Offenders Act 2018.",
        "Incorrectly applying Threshold of \u20b9100 Crores Offense."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Fugitive Economic Offenders Act 2018 and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_48",
    "subjectId": "Audit",
    "chapterName": "Emerging Areas / Forensic Accounting",
    "title": "Forensic Accounting - Whistleblower Mechanism & Investigation of Whistleblower Complaints",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Whistleblower Vigil)",
    "question": "Describe the structural safeguards and investigation protocols required under Companies Act, 2013 and SEBI LODR Regulations for handling Whistleblower / Vigil Mechanism complaints.",
    "keyConcepts": [
      {
        "keyword": "Whistleblower Vigil Mechanism",
        "category": "Standard",
        "description": "Core requirement under Whistleblower Vigil Mechanism."
      },
      {
        "keyword": "Section 177 Companies Act 2013",
        "category": "Provision",
        "description": "Key rule concerning Section 177 Companies Act 2013."
      },
      {
        "keyword": "SEBI LODR Regulation 22",
        "category": "Rule",
        "description": "Regulatory threshold for SEBI LODR Regulation 22."
      },
      {
        "keyword": "Confidentiality & Anti-Retaliation",
        "category": "Provision",
        "description": "Verification protocol for Confidentiality & Anti-Retaliation."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Whistleblower Vigil Mechanism** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Section 177 Companies Act 2013** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **SEBI LODR Regulation 22** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Confidentiality & Anti-Retaliation** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Whistleblower Vigil Mechanism and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Whistleblower Vigil Mechanism.",
        "Incorrectly applying Section 177 Companies Act 2013."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Whistleblower Vigil Mechanism and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_49",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals & ESG Assurance",
    "title": "ESG Assurance - Greenhouse Gas (GHG) Emissions Verification: Scope 1, Scope 2, and Scope 3",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (GHG Protocol)",
    "question": "Explain the GHG Protocol accounting standard for Scope 1 (Direct), Scope 2 (Indirect - Electricity), and Scope 3 (Value Chain) emissions. What evidence does an ESG assurance provider examine?",
    "keyConcepts": [
      {
        "keyword": "GHG Protocol Emissions Verification",
        "category": "Standard",
        "description": "Core requirement under GHG Protocol Emissions Verification."
      },
      {
        "keyword": "Scope 1 Direct Emissions",
        "category": "Provision",
        "description": "Key rule concerning Scope 1 Direct Emissions."
      },
      {
        "keyword": "Scope 2 Indirect Energy Emissions",
        "category": "Rule",
        "description": "Regulatory threshold for Scope 2 Indirect Energy Emissions."
      },
      {
        "keyword": "Scope 3 Value Chain Emissions",
        "category": "Provision",
        "description": "Verification protocol for Scope 3 Value Chain Emissions."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **GHG Protocol Emissions Verification** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Scope 1 Direct Emissions** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Scope 2 Indirect Energy Emissions** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Scope 3 Value Chain Emissions** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of GHG Protocol Emissions Verification and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of GHG Protocol Emissions Verification.",
        "Incorrectly applying Scope 1 Direct Emissions."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of GHG Protocol Emissions Verification and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_50",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals & ESG Assurance",
    "title": "ESG Assurance - Verification of Social and Human Capital Metrics: Gender Pay Gap & Occupational Safety",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (BRSR Core)",
    "question": "What substantive verification procedures must an assurance practitioner perform to validate human rights, gender diversity, and occupational health metrics under BRSR Core?",
    "keyConcepts": [
      {
        "keyword": "BRSR Core Social Metrics",
        "category": "Standard",
        "description": "Core requirement under BRSR Core Social Metrics."
      },
      {
        "keyword": "Gender Pay Parity Verification",
        "category": "Provision",
        "description": "Key rule concerning Gender Pay Parity Verification."
      },
      {
        "keyword": "Lost Time Injury Frequency Rate (LTIFR)",
        "category": "Rule",
        "description": "Regulatory threshold for Lost Time Injury Frequency Rate (LTIFR)."
      },
      {
        "keyword": "Fair Living Wages Compliance",
        "category": "Provision",
        "description": "Verification protocol for Fair Living Wages Compliance."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **BRSR Core Social Metrics** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Gender Pay Parity Verification** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Lost Time Injury Frequency Rate (LTIFR)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Fair Living Wages Compliance** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of BRSR Core Social Metrics and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of BRSR Core Social Metrics.",
        "Incorrectly applying Gender Pay Parity Verification."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of BRSR Core Social Metrics and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_51",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Asset Quality Review (AQR) and Divergence Reporting under RBI Guidelines",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (RBI NPA)",
    "question": "Explain the regulatory triggers under RBI circulars that mandate banks to publicly disclose 'NPA Divergence' and 'Provisioning Divergence' in Notes to Accounts.",
    "keyConcepts": [
      {
        "keyword": "RBI NPA Divergence Disclosure",
        "category": "Standard",
        "description": "Core requirement under RBI NPA Divergence Disclosure."
      },
      {
        "keyword": "Divergence Exceeding 10% / 15%",
        "category": "Provision",
        "description": "Key rule concerning Divergence Exceeding 10% / 15%."
      },
      {
        "keyword": "Notes to Accounts Disclosure",
        "category": "Rule",
        "description": "Regulatory threshold for Notes to Accounts Disclosure."
      },
      {
        "keyword": "Supervisory Action Framework",
        "category": "Provision",
        "description": "Verification protocol for Supervisory Action Framework."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **RBI NPA Divergence Disclosure** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Divergence Exceeding 10% / 15%** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Notes to Accounts Disclosure** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Supervisory Action Framework** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of RBI NPA Divergence Disclosure and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of RBI NPA Divergence Disclosure.",
        "Incorrectly applying Divergence Exceeding 10% / 15%."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of RBI NPA Divergence Disclosure and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_52",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Audit of Treasury Operations and Valuation of Investment Portfolio",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Bank Treasury)",
    "question": "Explain the classification of bank investments into Held to Maturity (HTM), Available for Sale (AFS), and Held for Trading (HFT) and the audit of marked-to-market valuations.",
    "keyConcepts": [
      {
        "keyword": "Bank Treasury Audit",
        "category": "Standard",
        "description": "Core requirement under Bank Treasury Audit."
      },
      {
        "keyword": "HTM, AFS, and HFT Categories",
        "category": "Provision",
        "description": "Key rule concerning HTM, AFS, and HFT Categories."
      },
      {
        "keyword": "Marked to Market (MTM) Provisioning",
        "category": "Rule",
        "description": "Regulatory threshold for Marked to Market (MTM) Provisioning."
      },
      {
        "keyword": "Repo and Reverse Repo Verification",
        "category": "Provision",
        "description": "Verification protocol for Repo and Reverse Repo Verification."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Bank Treasury Audit** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **HTM, AFS, and HFT Categories** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Marked to Market (MTM) Provisioning** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Repo and Reverse Repo Verification** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Bank Treasury Audit and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Bank Treasury Audit.",
        "Incorrectly applying HTM, AFS, and HFT Categories."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Bank Treasury Audit and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_53",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "NBFC - Auditor's Duty to Report to RBI under NBFC Auditor's Report Directions",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (NBFC Auditor's)",
    "question": "What specific matters must the statutory auditor report to the Board of Directors and to the RBI if an NBFC fails to comply with prudential norms or minimum capital requirements?",
    "keyConcepts": [
      {
        "keyword": "NBFC Auditor's Report to Board",
        "category": "Standard",
        "description": "Core requirement under NBFC Auditor's Report to Board."
      },
      {
        "keyword": "Exception Reporting to RBI",
        "category": "Provision",
        "description": "Key rule concerning Exception Reporting to RBI."
      },
      {
        "keyword": "Capital Adequacy Ratio Shortfall",
        "category": "Rule",
        "description": "Regulatory threshold for Capital Adequacy Ratio Shortfall."
      },
      {
        "keyword": "Public Deposit Acceptance Breaches",
        "category": "Provision",
        "description": "Verification protocol for Public Deposit Acceptance Breaches."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **NBFC Auditor's Report to Board** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Exception Reporting to RBI** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Capital Adequacy Ratio Shortfall** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Public Deposit Acceptance Breaches** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of NBFC Auditor's Report to Board and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of NBFC Auditor's Report to Board.",
        "Incorrectly applying Exception Reporting to RBI."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of NBFC Auditor's Report to Board and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_54",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Group Audits - Restructuring of Component Audit Reports Prepared under Different Frameworks",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Fit-for-Consolidation (FFC))",
    "question": "What are 'Fit-for-Consolidation' (FFC) reporting packages, and how does the group auditor audit special purpose reporting packages prepared by foreign components?",
    "keyConcepts": [
      {
        "keyword": "Fit-for-Consolidation (FFC) Packages",
        "category": "Standard",
        "description": "Core requirement under Fit-for-Consolidation (FFC) Packages."
      },
      {
        "keyword": "Group Accounting Manual Alignment",
        "category": "Provision",
        "description": "Key rule concerning Group Accounting Manual Alignment."
      },
      {
        "keyword": "Component Auditor Audit of FFC",
        "category": "Rule",
        "description": "Regulatory threshold for Component Auditor Audit of FFC."
      },
      {
        "keyword": "Consolidation Elimination Logs",
        "category": "Provision",
        "description": "Verification protocol for Consolidation Elimination Logs."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Fit-for-Consolidation (FFC) Packages** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Group Accounting Manual Alignment** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Component Auditor Audit of FFC** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Consolidation Elimination Logs** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Fit-for-Consolidation (FFC) Packages and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Fit-for-Consolidation (FFC) Packages.",
        "Incorrectly applying Group Accounting Manual Alignment."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Fit-for-Consolidation (FFC) Packages and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_55",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of PSUs",
    "title": "PSU Audit - Audit of Autonomous Bodies and Section 14/15 of C&AG Act, 1971",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (C&AG Act)",
    "question": "Explain the statutory scope of C&AG audit over autonomous bodies and institutions substantially financed by grants or loans from the Consolidated Fund of India u/s 14 and 15 of C&AG Act.",
    "keyConcepts": [
      {
        "keyword": "C&AG Act 1971 Sections 14 & 15",
        "category": "Standard",
        "description": "Core requirement under C&AG Act 1971 Sections 14 & 15."
      },
      {
        "keyword": "Substantially Financed Institutions",
        "category": "Provision",
        "description": "Key rule concerning Substantially Financed Institutions."
      },
      {
        "keyword": "Grants/Loans Exceeding \u20b925 Lakhs / 75%",
        "category": "Rule",
        "description": "Regulatory threshold for Grants/Loans Exceeding \u20b925 Lakhs / 75%."
      },
      {
        "keyword": "Scrutiny of Expenditure Procedures",
        "category": "Provision",
        "description": "Verification protocol for Scrutiny of Expenditure Procedures."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **C&AG Act 1971 Sections 14 & 15** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Substantially Financed Institutions** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Grants/Loans Exceeding \u20b925 Lakhs / 75%** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Scrutiny of Expenditure Procedures** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of C&AG Act 1971 Sections 14 & 15 and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of C&AG Act 1971 Sections 14 & 15.",
        "Incorrectly applying Substantially Financed Institutions."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of C&AG Act 1971 Sections 14 & 15 and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_56",
    "subjectId": "Audit",
    "chapterName": "Internal Audit",
    "title": "Internal Audit - Fraud Detection Responsibilities and Reporting to Audit Committee",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Internal Auditor)",
    "question": "What is the statutory and professional duty of an Internal Auditor when suspecting or discovering corporate fraud during routine internal audit operations?",
    "keyConcepts": [
      {
        "keyword": "Internal Auditor Fraud Responsibilities",
        "category": "Standard",
        "description": "Core requirement under Internal Auditor Fraud Responsibilities."
      },
      {
        "keyword": "Prompt Reporting to Audit Committee",
        "category": "Provision",
        "description": "Key rule concerning Prompt Reporting to Audit Committee."
      },
      {
        "keyword": "Evaluating Internal Control Failures",
        "category": "Rule",
        "description": "Regulatory threshold for Evaluating Internal Control Failures."
      },
      {
        "keyword": "Root Cause Analysis of Fraud",
        "category": "Provision",
        "description": "Verification protocol for Root Cause Analysis of Fraud."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Internal Auditor Fraud Responsibilities** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Prompt Reporting to Audit Committee** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Evaluating Internal Control Failures** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Root Cause Analysis of Fraud** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Internal Auditor Fraud Responsibilities and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Internal Auditor Fraud Responsibilities.",
        "Incorrectly applying Prompt Reporting to Audit Committee."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Internal Auditor Fraud Responsibilities and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_57",
    "subjectId": "Audit",
    "chapterName": "Emerging Areas / Forensic Accounting",
    "title": "Forensic Accounting - Interviewing Techniques and Non-Verbal Deception Indicators",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Forensic Interviewing)",
    "question": "Describe the structured interview process in a forensic accounting investigation: Introductory, Informational, Assessment, and Admission-Seeking phases.",
    "keyConcepts": [
      {
        "keyword": "Forensic Interviewing Phases",
        "category": "Standard",
        "description": "Core requirement under Forensic Interviewing Phases."
      },
      {
        "keyword": "Admission-Seeking Questions",
        "category": "Provision",
        "description": "Key rule concerning Admission-Seeking Questions."
      },
      {
        "keyword": "Verbal & Non-Verbal Deception Cues",
        "category": "Rule",
        "description": "Regulatory threshold for Verbal & Non-Verbal Deception Cues."
      },
      {
        "keyword": "Documenting Signed Confessions",
        "category": "Provision",
        "description": "Verification protocol for Documenting Signed Confessions."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Forensic Interviewing Phases** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Admission-Seeking Questions** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Verbal & Non-Verbal Deception Cues** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Documenting Signed Confessions** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Forensic Interviewing Phases and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Forensic Interviewing Phases.",
        "Incorrectly applying Admission-Seeking Questions."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Forensic Interviewing Phases and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_58",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals & ESG Assurance",
    "title": "ESG Assurance - Materiality Assessment and Double Materiality Concept",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Double Materiality)",
    "question": "Explain the concept of 'Double Materiality' in ESG reporting: Financial Materiality (Outside-In) and Impact Materiality (Inside-Out) under international assurance frameworks.",
    "keyConcepts": [
      {
        "keyword": "Double Materiality Concept",
        "category": "Standard",
        "description": "Core requirement under Double Materiality Concept."
      },
      {
        "keyword": "Financial Materiality (Outside-In)",
        "category": "Provision",
        "description": "Key rule concerning Financial Materiality (Outside-In)."
      },
      {
        "keyword": "Impact Materiality (Inside-Out)",
        "category": "Rule",
        "description": "Regulatory threshold for Impact Materiality (Inside-Out)."
      },
      {
        "keyword": "GRI and ISSB Alignment",
        "category": "Provision",
        "description": "Verification protocol for GRI and ISSB Alignment."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Double Materiality Concept** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Financial Materiality (Outside-In)** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Impact Materiality (Inside-Out)** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **GRI and ISSB Alignment** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Double Materiality Concept and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Double Materiality Concept.",
        "Incorrectly applying Financial Materiality (Outside-In)."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Double Materiality Concept and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_59",
    "subjectId": "Audit",
    "chapterName": "Specialized Areas (Banks / NBFC / Insurance)",
    "title": "Bank Audit - Verification of Inter-Branch Accounts and Clearing Differences",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Inter-Branch Reconciliation)",
    "question": "Why are unreconciled entries in Inter-Branch Reconciliation (IBR) and Clearing Adjustment Accounts considered high-risk areas in bank audits, and what procedures must the auditor perform?",
    "keyConcepts": [
      {
        "keyword": "Inter-Branch Reconciliation (IBR)",
        "category": "Standard",
        "description": "Core requirement under Inter-Branch Reconciliation (IBR)."
      },
      {
        "keyword": "Clearing Differences Scrutiny",
        "category": "Provision",
        "description": "Key rule concerning Clearing Differences Scrutiny."
      },
      {
        "keyword": "Parking of Fraudulent Transactions",
        "category": "Rule",
        "description": "Regulatory threshold for Parking of Fraudulent Transactions."
      },
      {
        "keyword": "Old Outstanding Entries Provisioning",
        "category": "Provision",
        "description": "Verification protocol for Old Outstanding Entries Provisioning."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Inter-Branch Reconciliation (IBR)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Clearing Differences Scrutiny** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Parking of Fraudulent Transactions** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Old Outstanding Entries Provisioning** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Inter-Branch Reconciliation (IBR) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Inter-Branch Reconciliation (IBR).",
        "Incorrectly applying Clearing Differences Scrutiny."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Inter-Branch Reconciliation (IBR) and tabulate distinguishing criteria."
      ]
    }
  },
  {
    "id": "aud_spec_full_60",
    "subjectId": "Audit",
    "chapterName": "Due Diligence, Investigation & Forensic Audit",
    "title": "Due Diligence - Environmental Due Diligence (EDD) and Contaminated Land Liabilities",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material / RTP (Environmental Due)",
    "question": "What is Environmental Due Diligence (EDD) in the acquisition of heavy manufacturing facilities, and how are latent remediation liabilities quantified?",
    "keyConcepts": [
      {
        "keyword": "Environmental Due Diligence (EDD)",
        "category": "Standard",
        "description": "Core requirement under Environmental Due Diligence (EDD)."
      },
      {
        "keyword": "Phase I and Phase II Environmental Site Assessments",
        "category": "Provision",
        "description": "Key rule concerning Phase I and Phase II Environmental Site Assessments."
      },
      {
        "keyword": "Contaminated Land Liabilities",
        "category": "Rule",
        "description": "Regulatory threshold for Contaminated Land Liabilities."
      },
      {
        "keyword": "Remediation Cost Escrows",
        "category": "Provision",
        "description": "Verification protocol for Remediation Cost Escrows."
      }
    ],
    "shortSuggestedAnswer": "| Regulatory Aspect | Statutory Requirement / Mandate | Key Verification Checks |\n| :--- | :--- | :--- |\n| **Environmental Due Diligence (EDD)** | Enforces core regulatory compliance under applicable statutory framework. | Verify source documents, registers, and statutory returns. |\n| **Phase I and Phase II Environmental Site Assessments** | Specific procedural check required to ensure accurate accounting and disclosure. | Reconcile ledgers, inspect authorisations, and test system calculations. |\n| **Contaminated Land Liabilities** | Enforces regulatory threshold and ensures no deviation goes unaddressed. | Compare recorded metrics against prescribed statutory limits. |\n| **Remediation Cost Escrows** | Core verification step ensuring complete and robust audit documentation. | Document findings, obtain management confirmations, and report under applicable guidelines. |\n\n\u2022 **Key Statutory Principles**:\n  1. **Core Verification Duty**: The auditor must examine source documentation and evaluate whether management complied with all statutory requirements under the applicable regulatory framework.\n  2. **Substantive Audit Checks**: Verify reconciliations, inspect third-party documentation, test internal controls, and quantify any financial or regulatory non-compliance.\n  3. **Reporting Consequences**: If material non-compliance or irregularities are identified, report the matter to Those Charged with Governance and regulatory authorities, and modify the audit report where appropriate.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying statutory provisions of Environmental Due Diligence (EDD) and evaluating reporting requirements with precision.",
      "criticalMisses": [
        "Failing to apply core principles of Environmental Due Diligence (EDD).",
        "Incorrectly applying Phase I and Phase II Environmental Site Assessments."
      ],
      "suggestions": [
        "Cite relevant section/circular numbers of Environmental Due Diligence (EDD) and tabulate distinguishing criteria."
      ]
    }
  }
];
