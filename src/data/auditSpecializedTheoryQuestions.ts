/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SPECIALIZED AUDITS (BANK AUDIT, NBFC, GROUP AUDIT, INTERNAL AUDIT & PSU AUDIT)
 * Curated from Comprehensive Question Bank (CA Ram Harsha 2024 Edition)
 * Zero duplicate questions; adhering strictly to CA Final Educator guidelines.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_SPECIALIZED_THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    "id": "aud_bank_npa_01",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Bank Advances - Government Guaranteed Advances: Central vs State Government Guarantees (RBI Prudential Norms)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Q.2 & May 2024 RTP Q.7 (Audit of Banks)",
    "question": "In the statutory branch audit of a nationalized bank, the branch manager classified the following two overdue loan accounts as 'Standard Assets': (a) Advance of \u20b950 crores guaranteed by Central Government, where interest has remained overdue for 180 days; (b) Advance of \u20b930 crores guaranteed by State Government, where interest has remained overdue for 120 days. State whether the classification made by the branch manager is in accordance with RBI Prudential Norms on Income Recognition, Asset Classification and Provisioning (IRACP).",
    "keyConcepts": [
      {
        "keyword": "Central Government Guaranteed Advances",
        "category": "Rule",
        "description": "Advances guaranteed by Central Govt not treated as NPA for asset classification until guarantee is repudiated."
      },
      {
        "keyword": "Income Recognition on Central Govt Advances",
        "category": "Provision",
        "description": "Income recognition stops when interest is overdue > 90 days; income recognized only on cash realization."
      },
      {
        "keyword": "State Government Guaranteed Advances",
        "category": "Rule",
        "description": "State Govt guarantee benefit conditional; advances become NPA if interest/principal remains overdue > 90 days."
      },
      {
        "keyword": "Overdue Period Threshold 90 Days",
        "category": "Rule",
        "description": "Prudential benchmark for out-of-order / overdue classification in commercial banks."
      }
    ],
    "shortSuggestedAnswer": "| Guarantee Type | Overdue Period | Asset Classification Status | Income Recognition Treatment |\n| :--- | :--- | :--- | :--- |\n| **(a) Central Government Guarantee** (\u20b950 Cr) | 180 Days (> 90 Days) | **Classified as STANDARD Asset** (Unless guarantee repudiated by Govt) | **Income MUST NOT be recognized** on accrual basis; recognized only on realization. |\n| **(b) State Government Guarantee** (\u20b930 Cr) | 120 Days (> 90 Days) | **MUST be Classified as NPA (Sub-standard)** (Guarantee does not protect from NPA beyond 90 days) | **Income derecognized / reversed**; recognized only on realization. |\n\n```\n[RBI Asset Classification: Government Guaranteed Advances]\n              Advance Guaranteed by Government\n                              \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                             \u25bc\nCentral Government Guarantee                  State Government Guarantee\n       \u2502                                             \u2502\n       \u251c\u2500\u2500 Repudiated by Central Govt?               \u251c\u2500\u2500 Overdue for > 90 Days?\n       \u2502   \u251c\u2500\u2500 YES \u2500\u2500\u25ba Classify as NPA               \u2502   \u251c\u2500\u2500 YES \u2500\u2500\u25ba Classify as NPA\n       \u2502   \u2514\u2500\u2500 NO  \u2500\u2500\u25ba STANDARD ASSET                \u2502   \u2502           (Sub-standard)\n       \u2502               (Interest overdue > 90d:      \u2502   \u2514\u2500\u2500 NO  \u2500\u2500\u25ba Standard Asset\n       \u2502                Do NOT recognize income)     \u2502\n```\n\n\u2022 **Statutory Principles under RBI Master Circular on IRACP**:\n  1. **Central Government Guaranteed Advances**:\n     - *Asset Classification*: Advances where Central Government guarantee is available are **NOT treated as NPA** for classification purposes, even if overdue for more than 90 days, provided the Central Government has not repudiated the guarantee.\n     - *Income Recognition*: The exemption applies *only* to asset classification. If interest is overdue for more than 90 days, income **cannot be recognized on accrual basis** and must be reversed or recognized only upon actual realization.\n  2. **State Government Guaranteed Advances**:\n     - The exemption from NPA classification does **NOT** apply to State Government guaranteed advances if the advance is overdue for more than 90 days.\n     - Advance (b) is overdue for 120 days (> 90 days); hence it **must be downgraded to Non-Performing Asset (Sub-standard)**.\n  3. **Conclusion**:\n     - (a) Branch manager is **correct** for asset classification (Standard), but must not recognize interest income.\n     - (b) Branch manager is **incorrect**; account must be classified as NPA.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing between Central Government guarantees (exempt from NPA until repudiated, but income reversed) and State Government guarantees (become NPA once overdue beyond 90 days).",
      "criticalMisses": [
        "Treating State Government guarantees identical to Central Government guarantees.",
        "Failing to point out that income recognition on Central Govt guarantees stops even while asset remains standard."
      ],
      "suggestions": [
        "Structure into a clean comparative table highlighting asset classification vs income recognition."
      ]
    }
  },
  {
    "id": "aud_nbfc_5050_02",
    "subjectId": "Audit",
    "chapterName": "Special Features of Audit of Banks & Non-Banking Financial Companies",
    "title": "NBFC Principal Business Criteria (50-50 Test) - Financial Assets & Income Thresholds (Sudarshan Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Illustration 1 & 2 (NBFC Registration under Section 45-IA)",
    "question": "The Balance Sheet and Profit & Loss statement of Sudarshan Ltd. for FY 2021-22 reveal: Total Assets: \u20b9100 crores (consisting of PPE \u20b935 crores, Inventories \u20b912 crores, Investment in Bonds/Shares \u20b942 crores, Loans and Advances \u20b911 crores). Total Gross Income: \u20b915 crores (consisting of Manufacturing Sales \u20b96.5 crores, Interest Income on Loans \u20b94.5 crores, Dividend and Profit on Sale of Shares \u20b94.0 crores). Examine whether the company falls within the definition of a Non-Banking Financial Company (NBFC) under RBI regulations (apply the Principal Business Criteria).",
    "keyConcepts": [
      {
        "keyword": "Principal Business Criteria (50-50 Test)",
        "category": "Rule",
        "description": "RBI test where financial assets > 50% of total assets AND income from financial assets > 50% of gross income."
      },
      {
        "keyword": "Financial Assets Calculation",
        "category": "Provision",
        "description": "Sum of investments in shares/bonds, loans and advances, bills discounted, and financial instruments."
      },
      {
        "keyword": "Financial Income Calculation",
        "category": "Provision",
        "description": "Sum of interest income, dividends, brokerage, and profit on sale of financial assets."
      },
      {
        "keyword": "Section 45-IA Mandatory Registration",
        "category": "Section",
        "description": "Mandatory requirement for companies qualifying under 50-50 test to obtain CoR from RBI."
      }
    ],
    "shortSuggestedAnswer": "| Test Component | Total Magnitude | Financial Component Amount | Percentage of Financial Component | RBI Threshold Requirement | Result |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **1. Asset Test** | Total Assets: **\u20b9100 Cr** | Investments (\u20b942 Cr) + Loans (\u20b911 Cr) = **\u20b953 Cr** | **53.00%** | Must exceed **50% of Total Assets** | **TEST PASSED** (53% > 50%) |\n| **2. Income Test** | Gross Income: **\u20b915 Cr** | Interest (\u20b94.5 Cr) + Dividends (\u20b94.0 Cr) = **\u20b98.5 Cr** | **56.67%** | Must exceed **50% of Gross Income** | **TEST PASSED** (56.67% > 50%) |\n\n```\n[NBFC Principal Business Criteria (50-50 Test)]\n                     Sudarshan Ltd. Financial Data\n                                   \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                                       \u25bc\nTotal Assets = \u20b9100 Crores                              Total Income = \u20b915 Crores\n\u2022 Non-Financial: \u20b947 Cr (PPE + Inv)                     \u2022 Non-Financial: \u20b96.5 Cr (Sales)\n\u2022 Financial: \u20b953 Cr (Investments + Loans)               \u2022 Financial: \u20b98.5 Cr (Interest + Div)\n       \u2502                                                       \u2502\n       \u25bc                                                       \u25bc\nFinancial Assets Ratio = 53%                            Financial Income Ratio = 56.67%\n       \u2502                                                       \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                                   \u25bc\n             Both Ratios Exceed 50% (50-50 Test Satisfied)\n                                   \u25bc\n      Company qualifies as NBFC; MUST register u/s 45-IA with RBI\n```\n\n\u2022 **Statutory Principles under RBI Guidelines**:\n  1. **The 50-50 Principle**: A company will be treated as an NBFC if its financial assets are **more than 50% of total assets** AND its income from financial assets is **more than 50% of gross income**.\n  2. **Evaluation for Sudarshan Ltd**:\n     - *Financial Assets Ratio*: (\u20b942 Cr + \u20b911 Cr) / \u20b9100 Cr = **53% (> 50%)**.\n     - *Financial Income Ratio*: (\u20b94.5 Cr + \u20b94.0 Cr) / \u20b915 Cr = **56.67% (> 50%)**.\n  3. **Conclusion**:\n     - Sudarshan Ltd. satisfies both legs of the Principal Business Criteria.\n     - The company qualifies as an NBFC and must obtain a **Certificate of Registration (CoR)** from the Reserve Bank of India under Section 45-IA of the RBI Act, 1934.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying the two-fold 50-50 Principal Business Criteria with exact percentage computations, establishing mandatory registration under Section 45-IA.",
      "criticalMisses": [
        "Computing only the asset test and omitting the income test.",
        "Failing to cite Section 45-IA of the RBI Act, 1934."
      ],
      "suggestions": [
        "Always present both tests in a structured mathematical format showing the numerator and denominator."
      ]
    }
  },
  {
    "id": "aud_group_defacto_03",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Group Audit - De Facto Control with 10% Voting Power under Ind AS 110 (A Ltd & B Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Practical Q.1 (Consolidated Financial Statements under Ind AS 110)",
    "question": "A Ltd. holds a 10% voting interest in B Ltd. The remaining 90% voting rights are held by thousands of widely dispersed individual shareholders, none of whom holds more than 1% or has any agreement to act in concert. In past shareholders' meetings, only 18% of total voting shares have ever participated. The management of A Ltd. has systematically appointed the majority of the board of directors and controls the relevant activities of B Ltd. The management of A Ltd. asserts that it is not required to consolidate B Ltd. because its equity holding is only 10% (< 50%). Examine whether A Ltd. is required to prepare Consolidated Financial Statements under Ind AS 110 and the Companies Act, 2013.",
    "keyConcepts": [
      {
        "keyword": "Ind AS 110 Consolidated Financial Statements",
        "category": "Standard",
        "description": "Standard governing preparation of consolidated financial statements based on control."
      },
      {
        "keyword": "De Facto Control Concept",
        "category": "Provision",
        "description": "An investor can have control even without holding majority voting rights, considering voting patterns and dispersion."
      },
      {
        "keyword": "Three Elements of Control",
        "category": "Rule",
        "description": "1. Power over investee, 2. Exposure/rights to variable returns, 3. Ability to use power to affect returns."
      },
      {
        "keyword": "Section 129(3) Companies Act, 2013",
        "category": "Section",
        "description": "Mandatory preparation of Consolidated Financial Statements for entities having one or more subsidiaries."
      }
    ],
    "shortSuggestedAnswer": "| Control Criteria (Ind AS 110) | Statutory Requirement | Case Facts (A Ltd & B Ltd) | Evaluation |\n| :--- | :--- | :--- | :--- |\n| **1. Power over Investee** | Existing rights that give current ability to direct relevant activities | A Ltd unilaterally appoints majority of Board; only 18% vote in meetings | **Present** (De Facto Control established) |\n| **2. Exposure to Variable Returns** | Right to receive dividends and capital fluctuations | 10% equity holding gives variable returns | **Present** |\n| **3. Link between Power & Returns** | Ability to use power to affect investor's returns | Directs relevant operational and financing activities | **Present** |\n\n```\n[Ind AS 110 Control Assessment: De Facto Control]\n                 Investor Voting Share = 10%\n                             \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                           \u25bc\nRemaining 90% Held by Single Large Holder   Remaining 90% Widely Dispersed (<1% each)\nInvestor lacks power                        Only 18% votes cast in historic AGMs\n                             \u2502\n                             \u25bc\n              10% holding gives Practical Ability\n              to Direct Relevant Activities\n                             \u2502\n                             \u25bc\n              DE FACTO CONTROL ESTABLISHED\n              Consolidation MANDATORY under Ind AS 110\n```\n\n\u2022 **Statutory Principles under Ind AS 110 & Section 129(3)**:\n  1. **Definition of Control**: Under Ind AS 110, control does not solely depend on majority shareholding (> 50%). An investor controls an investee when it has power over the investee, exposure to variable returns, and the ability to affect those returns through its power.\n  2. **De Facto Control Analysis**:\n     - B Ltd.'s remaining shares are widely dispersed among thousands of holders (< 1% each).\n     - At typical general meetings, total voter turnout is only 18%. A Ltd.\u2019s 10% holding represents a clear majority of the votes cast (10 / 18 = 55.5%).\n     - A Ltd. has consistently exercised the power to appoint the majority of the board and manage operations.\n  3. **Conclusion**:\n     - A Ltd. exercises **de facto control** over B Ltd.\n     - Management's contention is **flawed**. B Ltd. is a subsidiary under Ind AS 110 and Section 2(87). A Ltd. **must consolidate B Ltd.** in its Consolidated Financial Statements under Section 129(3).",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying the concept of de facto control under Ind AS 110, demonstrating that 10% voting share constitutes control when voter dispersion and historic attendance prove unilateral power.",
      "criticalMisses": [
        "Accepting the 10% equity defense without evaluating voter dispersion.",
        "Omitting the three statutory elements of control under Ind AS 110."
      ],
      "suggestions": [
        "Explain that Section 129(3) of the Companies Act follows the accounting standard definition of control."
      ]
    }
  },
  {
    "id": "aud_internal_sec138_04",
    "subjectId": "Audit",
    "chapterName": "Internal Audit",
    "title": "Internal Audit Applicability Thresholds - Section 138 & Rule 13 of Companies (Accounts) Rules, 2014",
    "difficulty": "Moderate",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 11 / Illustration 1 & TYK Q.2 (Section 138)",
    "question": "State the statutory applicability criteria for appointing an Internal Auditor under Section 138 of the Companies Act, 2013 read with Rule 13 of the Companies (Accounts) Rules, 2014. Also evaluate whether the following companies must appoint an internal auditor for FY 2022-23: (a) JKT Pvt. Ltd. (Paid-up capital \u20b945 crores, Turnover \u20b9180 crores, Outstanding bank loans throughout the year \u20b995 crores, Outstanding deposits \u20b915 crores); (b) AADI Ltd., an unlisted public company (Paid-up capital \u20b948 crores, Turnover \u20b9190 crores, Outstanding bank borrowings \u20b9110 crores at year-end, Deposits Nil).",
    "keyConcepts": [
      {
        "keyword": "Section 138 Internal Audit",
        "category": "Section",
        "description": "Statutory mandate for specified classes of companies to appoint an internal auditor."
      },
      {
        "keyword": "Rule 13 Companies Accounts Rules",
        "category": "Rule",
        "description": "Rules establishing quantitative thresholds for listed, unlisted public, and private companies."
      },
      {
        "keyword": "Private Company Thresholds",
        "category": "Rule",
        "description": "Private Co: Turnover >= \u20b9200 Cr OR Loans/Borrowings from Banks/FIs exceeding \u20b9100 Cr at any point."
      },
      {
        "keyword": "Unlisted Public Company Thresholds (4 Criteria)",
        "category": "Rule",
        "description": "Deposits >= \u20b925 Cr; Capital >= \u20b950 Cr; Loans/Borrowings > \u20b9100 Cr at any point; Turnover >= \u20b9200 Cr."
      }
    ],
    "shortSuggestedAnswer": "| Class of Company | Statutory Parameter (Rule 13) | Applicable Threshold (Preceding FY) |\n| :--- | :--- | :--- |\n| **Listed Company** | Every Listed Company | **Mandatory** for ALL listed companies |\n| **Unlisted Public Company** | 1. Outstanding Deposits<br>2. Paid-up Share Capital<br>3. Outstanding Loans/Borrowings from Banks/FIs<br>4. Turnover | **>= \u20b925 Crores** at any point<br>**>= \u20b950 Crores** at end of FY<br>**> \u20b9100 Crores** at any point<br>**>= \u20b9200 Crores** during FY |\n| **Private Company** | 1. Turnover<br>2. Outstanding Loans/Borrowings from Banks/FIs | **>= \u20b9200 Crores** during FY<br>**> \u20b9100 Crores** at any point |\n\n```\n[Internal Audit Applicability Decision Tree (Section 138 / Rule 13)]\n                         Entity Structure\n                                \u2502\n        \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n        \u25bc                       \u25bc                       \u25bc\n  Listed Company      Unlisted Public Company    Private Company\n    (MANDATORY           Check 4 Criteria:       Check 2 Criteria:\n    in all cases)        \u2022 Deposits >= 25 Cr     \u2022 Turnover >= 200 Cr\n                         \u2022 Capital >= 50 Cr      \u2022 Loans/Borrowings > 100 Cr\n                         \u2022 Loans > 100 Cr\n                         \u2022 Turnover >= 200 Cr\n```\n\n\u2022 **Application to Given Cases**:\n  1. **(a) JKT Pvt. Ltd. (Private Company)**:\n     - Turnover = \u20b9180 Cr (< \u20b9200 Cr limit).\n     - Loans/Borrowings = \u20b995 Cr (<= \u20b9100 Cr limit).\n     - Outstanding deposits criteria does *not* apply to private companies under Rule 13.\n     - **Verdict**: JKT Pvt. Ltd. is **NOT REQUIRED** to appoint an internal auditor.\n  2. **(b) AADI Ltd. (Unlisted Public Company)**:\n     - Paid-up capital = \u20b948 Cr (< \u20b950 Cr limit); Turnover = \u20b9190 Cr (< \u20b9200 Cr limit).\n     - Outstanding bank borrowings = **\u20b9110 Cr**, which exceeds the statutory threshold of **\u20b9100 crores**.\n     - **Verdict**: AADI Ltd. is **MANDATORILY REQUIRED** to appoint an internal auditor under Section 138.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on setting out the exact Rule 13 thresholds for unlisted public companies (25/50/100/200) and private companies (200/100), with accurate application to both companies.",
      "criticalMisses": [
        "Applying the deposits threshold to a private company.",
        "Failing to note that bank borrowings > \u20b9100 crore triggers applicability for unlisted public companies."
      ],
      "suggestions": [
        "Memorize the mnemonic '25-50-100-200' for unlisted public companies (Deposits, Capital, Loans, Turnover)."
      ]
    }
  },
  {
    "id": "aud_psu_3es_05",
    "subjectId": "Audit",
    "chapterName": "Overview of Audit of Public Sector Undertakings",
    "title": "Performance Audit of PSUs by C&AG - The 3Es (Economy, Efficiency, Effectiveness) Framework",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / PYQ Q.4 & May 2024 RTP Q.8 (Audit of PSUs)",
    "question": "Performance audit conducted by the Comptroller and Auditor General of India (C&AG) is an objective and systematic examination of evidence to assess whether government programs, activities, or organizations are operating in accordance with the principles of Economy, Efficiency, and Effectiveness (the 3Es). Define and distinguish the 3Es with practical audit examples in the context of Public Sector Undertakings (PSUs).",
    "keyConcepts": [
      {
        "keyword": "Performance Audit by C&AG",
        "category": "Provision",
        "description": "Independent assessment of the extent to which an entity operates with economy, efficiency and effectiveness."
      },
      {
        "keyword": "Economy (Spending Less)",
        "category": "Keyword",
        "description": "Minimizing the cost of resources acquired or used, having regard to appropriate quality."
      },
      {
        "keyword": "Efficiency (Spending Well)",
        "category": "Keyword",
        "description": "Maximizing output produced from a given input, or minimizing input for a given level of output."
      },
      {
        "keyword": "Effectiveness (Spending Wisely)",
        "category": "Keyword",
        "description": "Assessing whether objectives of program/organization were actually achieved and policy impacts delivered."
      }
    ],
    "shortSuggestedAnswer": "| The 3Es Dimension | Core Audit Definition | Key Focus Question | Practical PSU Audit Example |\n| :--- | :--- | :--- | :--- |\n| **1. Economy** | Minimising the cost of resources employed for an activity, having regard to appropriate quality. | *'Are resources acquired at the lowest possible cost for the required quality?'* | Procuring power equipment via competitive global bidding vs costly negotiated purchase without justification. |\n| **2. Efficiency** | The relationship between output of goods/services and resources (inputs) used to produce them. | *'Are inputs yielding the maximum possible output?'* | Assessing power plant plant load factor (PLF), transmission heat losses, and idle labour hours. |\n| **3. Effectiveness** | The extent to which intended objectives or desired results are achieved. | *'Did the public program achieve its policy objectives?'* | Checking if a rural electrification scheme actually provided 24-hour power to designated electrified villages. |\n\n```\n[The C&AG 3Es Performance Audit Continuum]\n        INPUTS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba PROCESS / ACTIVITIES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba OUTPUTS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba OUTCOMES / IMPACT\n          \u2502                                                       \u2502                          \u2502\n          \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba ECONOMY                           \u2502                          \u2502\n                                (Cost of Inputs)                  \u2502                          \u2502\n                                                                  \u25bc                          \u2502\n                                                              EFFICIENCY                     \u2502\n                                                          (Input-to-Output Ratio)            \u25bc\n                                                                                       EFFECTIVENESS\n                                                                                   (Achievement of Goals)\n```\n\n\u2022 **Key Distinctions in Performance Audit Practice**:\n  1. **Economy vs Efficiency**: Economy focuses on inputs (buying raw materials cheaply without sacrificing grade); efficiency focuses on throughput and productivity (converting raw materials into maximum units with minimum scrap).\n  2. **Efficiency vs Effectiveness**: An entity can be highly efficient in producing goods that fail to achieve their intended public purpose. Effectiveness assesses the final social or policy impact relative to targets set by Parliament or the Legislature.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on defining each of the 3Es clearly with the input-output-outcome model and providing concrete practical audit examples for PSUs.",
      "criticalMisses": [
        "Confusing efficiency with effectiveness.",
        "Failing to provide concrete operational examples in a PSU context."
      ],
      "suggestions": [
        "Use the formula: Economy = Spending Less; Efficiency = Spending Well; Effectiveness = Spending Wisely."
      ]
    }
  },
  {
    "id": "aud_bank_npa_sale_06",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Sale of Non-Performing Financial Assets to Securitisation / Asset Reconstruction Companies (SC/ARC)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / PYQ Nov 2019 (Audit of Banks - Sale of NPAs)",
    "question": "LUD Bank sold a stressed non-performing asset (DEF Ltd., outstanding book balance \u20b9100 crores, provisions held \u20b930 crores) to an Asset Reconstruction Company (ARC) for a cash consideration of \u20b980 crores. The bank management credited the excess recovery over net book value (\u20b910 crores) directly to the Profit and Loss Account as fee/other income. What are the audit procedures and accounting requirements under RBI guidelines governing sale of NPAs to Securitisation Companies / ARCs?",
    "keyConcepts": [
      {
        "keyword": "Sale of NPAs to SC/ARC",
        "category": "Provision",
        "description": "RBI guidelines governing transfer of stressed financial assets to asset reconstruction companies."
      },
      {
        "keyword": "Net Book Value (NBV) Calculation",
        "category": "Provision",
        "description": "NBV = Gross Book Balance minus Provisions held (\u20b9100 Cr - \u20b930 Cr = \u20b970 Cr)."
      },
      {
        "keyword": "Prohibition on P&L Credit for Excess Recovery",
        "category": "Rule",
        "description": "Excess of sale value over NBV cannot be credited to P&L; must be credited to Capital Reserve or Provision for Security Receipts."
      },
      {
        "keyword": "Shortfall Treatment",
        "category": "Rule",
        "description": "Any shortfall of sale price compared to NBV must be charged immediately to Profit & Loss Account."
      }
    ],
    "shortSuggestedAnswer": "| Financial Component | Calculation / Valuation | Regulatory Accounting Rule (RBI) |\n| :--- | :--- | :--- |\n| **Gross Outstanding Balance** | \u20b9100 Crores | Carried in loan ledger |\n| **Existing Provisions Held** | \u20b930 Crores | Deducted to determine Net Book Value |\n| **Net Book Value (NBV)** | \u20b9100 Cr - \u20b930 Cr = **\u20b970 Crores** | Unrecovered principal at risk |\n| **Sale Consideration Received** | **\u20b980 Crores** (Cash) | Received from ARC |\n| **Surplus / Excess Realisation** | \u20b980 Cr - \u20b970 Cr = **\u20b910 Crores** | **STRICTLY BARRED from P&L Credit** |\n\n```\n[Accounting for Sale of Stressed Assets to ARC (RBI Norms)]\n            Sale Consideration vs Net Book Value (NBV)\n                                \u2502\n        \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n        \u25bc                                               \u25bc\nSale Value < Net Book Value                     Sale Value > Net Book Value\n(Shortfall / Loss)                              (Surplus / Excess Recovery)\n        \u2502                                               \u2502\n        \u25bc                                               \u25bc\nCharge Shortfall IMMEDIATELY                    CANNOT be credited to P&L!\nto Profit & Loss Account                        Must be credited to CAPITAL RESERVE\n(or amortize if RBI permits)                    or utilized to meet SR shortfalls\n```\n\n\u2022 **Statutory Principles under RBI Guidelines**:\n  1. **Accounting Treatment for Surplus**:\n     - When an NPA is sold to an SC/ARC at a price higher than its Net Book Value (NBV), **the excess provision / surplus CANNOT be recognized in the Profit and Loss Account as income**.\n     - The bank must credit the surplus to a **Capital Reserve Account** or utilize it to meet shortfalls on other security receipts.\n  2. **Audit Procedures**:\n     - Verify board-approved policy for sale of stressed assets.\n     - Ensure assets sold have remained NPA for the minimum required period.\n     - Verify computation of NBV: \u20b9100 Cr - \u20b930 Cr = \u20b970 Cr.\n     - Since consideration was \u20b980 Cr, verify that the surplus of \u20b910 Cr was credited to Capital Reserve and **not to P&L**.\n  3. **Conclusion**: Management\u2019s action of crediting \u20b910 crores to P&L as fee/other income is **violative of RBI guidelines**; the auditor must insist on reversal or **qualify the audit report**.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on computing Net Book Value accurately, enforcing the strict RBI rule barring crediting surplus to P&L, and mandating credit to Capital Reserve.",
      "criticalMisses": [
        "Permitting credit of surplus recovery to the Profit and Loss Account.",
        "Failing to compute Net Book Value (Gross minus existing provisions)."
      ],
      "suggestions": [
        "Contrast treatment of surplus (Capital Reserve) with treatment of shortfall (immediate P&L charge)."
      ]
    }
  },
  {
    "id": "aud_group_sa600_07",
    "subjectId": "Audit",
    "chapterName": "Group Audits",
    "title": "Using Work of Component Auditors - Principal Auditor Rights, Working Paper Access & Reporting under SA 600",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / May 2024 MTP S2 Q.10 & PYQ (SA 600 & SA 706)",
    "question": "CA. Naveen is the statutory auditor of Parent Co. Ltd., which has 12 subsidiaries across India and abroad. The financial statements of 4 domestic subsidiaries and 2 foreign subsidiaries were audited by other audit firms (component auditors). CA. Naveen demanded access to the complete working paper files and detailed audit documentation from the component auditors. The component auditors declined, stating that working papers are their private property under SA 230 and SQC 1. CA. Naveen threatens to disclaim his audit opinion on the consolidated financial statements on grounds of scope limitation. Evaluate the rights and duties of the principal auditor under SA 600 and the validity of the component auditors' refusal.",
    "keyConcepts": [
      {
        "keyword": "SA 600 Using the Work of Another Auditor",
        "category": "Standard",
        "description": "Standard governing relationship and procedures when principal auditor uses work of other auditors."
      },
      {
        "keyword": "Ownership of Working Papers (SA 230 / SQC 1)",
        "category": "Provision",
        "description": "Working papers are the property of the auditor who prepares them; principal auditor has no statutory right of access."
      },
      {
        "keyword": "Principal Auditor Coordination Procedures",
        "category": "Provision",
        "description": "Principal auditor issues questionnaires, discusses procedures, and reviews written summaries, not working papers."
      },
      {
        "keyword": "Reporting Division of Responsibility (Other Matter)",
        "category": "Rule",
        "description": "Principal auditor discloses reliance on component auditors in Other Matter paragraph; disclaimer not justified."
      }
    ],
    "shortSuggestedAnswer": "| Issue in Dispute | Statutory Principle (SA 600, SA 230 & SQC 1) | Legal Evaluation |\n| :--- | :--- | :--- |\n| **Demand for Working Papers** | Working papers are the property of the component auditor; no right of direct inspection | **Component auditors are RIGHT** to refuse access |\n| **Principal Auditor Procedures** | Coordination via questionnaires, checklists, conference, and written reports | CA Naveen exceeded his authority under SA 600 |\n| **Threat of Disclaimer** | Scope limitation does not arise if component reports and questionnaires are supplied | **Threat of Disclaimer is UNJUSTIFIED & IMPROPER** |\n\n```\n[Principal Auditor vs Component Auditor Working Relationship (SA 600)]\n               Principal Auditor (Parent Co.)\n                             \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                           \u25bc\nPROHIBITED DEMAND:                          PERMISSIBLE SA 600 PROCEDURES:\n\u2022 Demand complete working papers            \u2022 Send audit questionnaires & checklists\n\u2022 Re-audit component files                  \u2022 Discuss audit procedures performed\n  (Violates SA 230 & SQC 1 property rights) \u2022 Review written summary of findings\n                             \u2502\n                             \u25bc\n              Disclose Division of Responsibility\n              under \"Other Matter Paragraph\" (SA 706)\n```\n\n\u2022 **Statutory Principles**:\n  1. **Working Paper Ownership**: Under SA 230 and SQC 1, audit documentation is the exclusive property of the auditor who created it. The principal auditor has no statutory or legal right to inspect the working papers of another independent statutory auditor.\n  2. **Permissible Procedures under SA 600**: The principal auditor may require the component auditor to complete questionnaires, confirm compliance with independence/accounting frameworks, and discuss significant findings.\n  3. **Division of Responsibility**:\n     - The principal auditor is entitled to rely on the work of the component auditor.\n     - The principal auditor discloses the division of responsibility in the auditor's report under an **Other Matter (OM) Paragraph** stating the extent of assets and revenues audited by other auditors.\n  4. **Conclusion**:\n     - The component auditors' refusal is **entirely valid**.\n     - CA Naveen cannot disclaim an opinion solely because he was not given working paper access.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on affirming the component auditor's property rights in working papers under SA 230/SQC 1, outlining permissible SA 600 coordination procedures, and rejecting the principal auditor's threat of disclaimer.",
      "criticalMisses": [
        "Asserting that the principal auditor has an absolute right to demand working papers.",
        "Supporting a disclaimer of opinion when component audit reports are available."
      ],
      "suggestions": [
        "Cite the Other Matter reporting mechanism under SA 706 read with SA 600 for division of responsibility."
      ]
    }
  }
];
