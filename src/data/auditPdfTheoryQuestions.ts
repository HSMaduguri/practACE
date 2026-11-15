/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ICAI STUDY MATERIAL EXHAUSTIVE THEORY QUESTIONS
 * Chapters 8, 9, 10, 12, and 18
 * Test Your Understanding (TYU) and Theoretical / Case Questions
 */

import type { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_PDF_THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    "id": "aud_th_8_tyu1",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Prudential Norms for Gold Loans - LTV Ratio & Bullet Repayment Facility",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Test Your Understanding 1",
    "question": "A public sector bank branch has granted loans against pledge of gold ornaments and jewellery to individuals. State the RBI guidelines regarding Loan to Value (LTV) ratio, bullet repayment limits, maximum tenor, and interest servicing for gold loans for non-agricultural purposes.",
    "keyConcepts": [
      {
        "keyword": "Loan to Value (LTV) Ratio",
        "category": "Rule",
        "description": "Maximum LTV ratio of 75% for loans against pledge of gold jewellery."
      },
      {
        "keyword": "Bullet Repayment Scheme Limit",
        "category": "Rule",
        "description": "Permitted up to \u20b94.00 Lakhs (revised threshold) with maximum tenor of 12 months."
      },
      {
        "keyword": "Interest Servicing & Valuation",
        "category": "Provision",
        "description": "Interest charged at monthly rests but serviced along with principal at maturity in bullet repayment."
      },
      {
        "keyword": "NPA Classification on Default",
        "category": "Standard",
        "description": "Account treated as NPA if not repaid within 90 days from the due date of 12-month maturity."
      }
    ],
    "shortSuggestedAnswer": "\u2022 RBI Prudential Guidelines on Gold Loans (Non-Agricultural Purposes):\n\n  1. Loan to Value (LTV) Ratio:\n     - The LTV ratio shall not exceed 75% of the value of gold ornaments and jewellery pledged.\n     - Value is determined based on the average closing price of 22-carat gold for the preceding 30 days quoted by IBJA (India Bullion and Jewellers Association).\n\n  2. Bullet Repayment Scheme:\n     - Permissible ceiling: Banks are permitted to grant loans against gold jewellery under bullet repayment up to \u20b94.00 Lakhs.\n     - Tenor: The maximum period of the loan shall not exceed 12 months from the date of sanction.\n\n  3. Interest Servicing & Accrual:\n     - Interest is calculated at monthly rests, but both principal and interest are repayable in a single bullet payment at maturity.\n     - For LTV calculation, accrued interest throughout the tenor must be factored in so that Total Exposure (Principal + Accrued Interest) does not breach 75% LTV at any point.\n\n  4. Asset Classification / NPA Trigger:\n     - Under bullet repayment, the account will be classified as Non-Performing Asset (NPA) if not fully repaid within 90 days from the scheduled due date (i.e. 12 months + 90 days).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on exact RBI regulatory limits: 75% LTV, \u20b94.00 lakh ceiling for bullet repayment, 12-month maximum tenor, and 90-day overdue NPA trigger.",
      "criticalMisses": [
        "Stating incorrect LTV (e.g. 50% or 60%).",
        "Omitting the \u20b94 lakh bullet repayment ceiling.",
        "Failing to explain interest servicing within LTV."
      ],
      "suggestions": [
        "Mention IBJA 30-day average price benchmark for valuation."
      ]
    }
  },
  {
    "id": "aud_th_8_tyu2",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Restructuring of Advances - Asset Downgrade & Conditions for Standard Asset Upgrade",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Test Your Understanding 2",
    "question": "Explain the prudential norms regarding asset classification of an advance upon restructuring by a bank. Under what conditions can a restructured account be upgraded to 'Standard' category under the RBI Prudential Framework?",
    "keyConcepts": [
      {
        "keyword": "Restructuring Definition",
        "category": "Provision",
        "description": "Modifying terms of an advance due to financial difficulty of the borrower involving economic sacrifice."
      },
      {
        "keyword": "Immediate Downgrade Rule",
        "category": "Rule",
        "description": "Upon restructuring, a standard advance is immediately downgraded to Sub-standard asset."
      },
      {
        "keyword": "Specified Period",
        "category": "Rule",
        "description": "Period from implementation date until 10% of total dues are paid and at least 1 year from commencement of first payment."
      },
      {
        "keyword": "Satisfactory Performance",
        "category": "Provision",
        "description": "No overdue payment exceeding 30 days during the specified period."
      },
      {
        "keyword": "Upgrade Preconditions",
        "category": "Standard",
        "description": "Satisfactory performance during the entire specified period + minimum investment grade rating."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Prudential Classification upon Restructuring:\n  1. Immediate Downgrade:\n     - Upon restructuring, any Standard asset is IMMEDIATELY DOWNGRADED to Sub-Standard asset.\n     - An NPA account retains its existing classification (Sub-standard, Doubtful) and may deteriorate further if aging criteria are met.\n\n\u2022 Strict Conditions for Upgrade to 'Standard' Category:\n  1. Completion of 'Specified Period':\n     - The account must demonstrate \"Satisfactory Performance\" throughout the entire \"Specified Period\".\n     - Specified Period means: The period from implementation of Resolution Plan up to the date by which at least 10% of the sum of outstanding principal debt as per RP is repaid, subject to a minimum of 1 year from the commencement of the first payment of interest or principal (whichever is later).\n  2. Satisfactory Performance Benchmark:\n     - The borrower must not have any overdue in payment of interest and/or principal exceeding 30 days at any time during the specified period.\n  3. Credit Rating Requirement (for large exposures >= \u20b9100 crore):\n     - The borrower\u2019s debt must achieve an investment grade credit rating (BBB- or better) from at least one recognized External Credit Assessment Institution (ECAI).",
    "defaultRemarks": {
      "efficiencyReasoning": "Must cite immediate downgrade upon restructuring, define the Specified Period (1 year minimum + 10% repayment), and list the upgrade conditions.",
      "criticalMisses": [
        "Claiming standard status is retained without downgrade.",
        "Omitting the definition of 'Specified Period' (1 year + 10% repayment)."
      ],
      "suggestions": [
        "Mention the 30-day overdue cap for satisfactory performance."
      ]
    }
  },
  {
    "id": "aud_th_8_tyu3",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Specified Period Computation & 10% Debt Repayment Test in Restructured Accounts",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Test Your Understanding 3",
    "question": "Star Bank restructured a term loan of \u20b950 Crore on October 1, 2023. The repayment schedule provided a moratorium of 6 months, with the first quarterly installment of \u20b92.5 Crore falling due on June 30, 2024. The borrower paid all quarterly installments on their due dates.\\n(a) What is the 'Specified Period' for this restructured advance?\\n(b) Can the branch upgrade this account to 'Standard' on October 1, 2024 (one year from restructuring date)?",
    "keyConcepts": [
      {
        "keyword": "Specified Period Dual Condition",
        "category": "Rule",
        "description": "1 year from commencement of first payment AND repayment of at least 10% of total debt dues."
      },
      {
        "keyword": "Moratorium Impact",
        "category": "Provision",
        "description": "1-year clock starts from first payment due date (June 30, 2024), NOT from date of restructuring."
      },
      {
        "keyword": "10% Repayment Computation",
        "category": "Rule",
        "description": "10% of \u20b950 Crore = \u20b95 Crore required to be repaid."
      },
      {
        "keyword": "Upgrade Eligibility Date",
        "category": "Standard",
        "description": "Account cannot be upgraded on October 1, 2024; earliest upgrade date is June 30, 2025."
      }
    ],
    "shortSuggestedAnswer": "\u2022 (a) Determination of 'Specified Period':\n  1. Statutory Definition:\n     - Under RBI Prudential Framework for Resolution of Stressed Assets, Specified Period means the period from date of implementation until BOTH conditions are met:\n       \u2022 Condition 1: At least 10% of the sum of outstanding principal debt (as per restructured package) is paid. Here, 10% of \u20b950 Crore = \u20b95 Crore.\n       \u2022 Condition 2: A minimum of one year has elapsed from the commencement of the FIRST payment of interest or principal (whichever is later) on the restructured advance.\n  2. Application to Star Bank:\n     - First installment fell due on: June 30, 2024.\n     - 10% debt repayment (\u20b95 Crore): Satisfied upon payment of 2nd installment of \u20b92.5 Crore on September 30, 2024.\n     - One-year minimum clock: Runs from June 30, 2024 to JUNE 30, 2025.\n     - Therefore, the Specified Period ends on JUNE 30, 2025 (when both conditions are fulfilled).\n\n\u2022 (b) Evaluation of Proposed Upgrade on October 1, 2024:\n  - NO, the branch CANNOT upgrade the account to 'Standard' on October 1, 2024.\n  - Reason: Although 1 year has elapsed since the restructuring date (Oct 1, 2023), the 1-year clock from the commencement of the FIRST payment (June 30, 2024) has NOT elapsed.\n  - The account must remain Sub-standard until June 30, 2025, provided performance continues to be satisfactory (no payment overdue > 30 days).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on calculating the exact Specified Period (clock starts from 1st payment, not restructuring date) and concluding that upgrade on Oct 1, 2024 is strictly impermissible.",
      "criticalMisses": [
        "Starting the 1-year clock from Oct 1, 2023 instead of June 30, 2024.",
        "Permitting upgrade on Oct 1, 2024."
      ],
      "suggestions": [
        "Explicitly state both prongs: 10% repayment (\u20b95 Cr) AND 1 full year from 1st payment date."
      ]
    }
  },
  {
    "id": "aud_th_8_tyu4",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Projects under Implementation - DCCO Deferment Norms for Infrastructure & Non-Infrastructure",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Test Your Understanding 4",
    "question": "A bank financed a highway toll project (Infrastructure) and a cement manufacturing plant (Non-infrastructure). Both projects suffered execution delays. State the permissible period of deferment of the Date of Commencement of Commercial Operations (DCCO) without downgrading the accounts to NPA under RBI guidelines.",
    "keyConcepts": [
      {
        "keyword": "DCCO Deferment Norms",
        "category": "Rule",
        "description": "Deferment of DCCO allowed without treating loan as restructured/NPA if within prescribed time caps."
      },
      {
        "keyword": "Infrastructure Projects DCCO",
        "category": "Rule",
        "description": "Up to 2 years beyond original DCCO for reasons beyond promoter control; additional 1 year for court/arbitration."
      },
      {
        "keyword": "Non-Infrastructure Projects DCCO",
        "category": "Rule",
        "description": "Up to 1 year beyond original DCCO for reasons beyond promoter control."
      },
      {
        "keyword": "Promoter Sacrifice & Viability",
        "category": "Provision",
        "description": "Project must remain viable and interest during construction must be serviced."
      }
    ],
    "shortSuggestedAnswer": "\u2022 RBI Prudential Norms on DCCO Deferment:\n\n  1. Infrastructure Sector Projects (Highway Toll Project):\n     - Reasons Beyond Control of Promoters: Deferment of DCCO is permitted up to a MAXIMUM OF 2 YEARS beyond the original DCCO without downgrade to NPA.\n     - Court Cases / Arbitration Delays: An ADDITIONAL deferment of up to 1 YEAR (total 3 years) is permissible if delay is caused by litigation or arbitration.\n     - Other Business Reasons: Up to 1 year beyond original DCCO.\n\n  2. Non-Infrastructure Sector Projects (Cement Manufacturing Plant):\n     - Reasons Beyond Control of Promoters: Deferment of DCCO is permitted up to a MAXIMUM OF 1 YEAR beyond the original DCCO without downgrade to NPA.\n     - Other Business Reasons: Maximum up to 6 months beyond original DCCO.\n\n  3. Mandatory Conditions for Retaining Standard Asset Classification:\n     - The project viability must be reassessed and found economically viable.\n     - Debt-Equity ratio and Debt Service Coverage Ratio (DSCR) must be acceptable.\n     - The restructuring application must be formally approved before the original DCCO expires.\n     - Additional provisioning of 5% is required on the standard exposure during the extended DCCO period.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on precise threshold bifurcation: 2 years (plus 1 year litigation) for Infrastructure vs 1 year (or 6 months) for Non-infrastructure, plus mandatory 5% provisioning.",
      "criticalMisses": [
        "Mixing up limits (1 year for infra, 2 years for non-infra).",
        "Omission of the 5% additional provisioning requirement."
      ],
      "suggestions": [
        "State that application for DCCO revision must be submitted before expiry of original DCCO."
      ]
    }
  },
  {
    "id": "aud_th_8_tyu5",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Drawing Power (DP) Calculation - Stock Audit Report Aging & 90-Day Overdue Rule",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Test Your Understanding 5",
    "question": "During the audit of a branch of a commercial bank, the auditor noticed the following in a Cash Credit (CC) account having a sanctioned limit of \u20b910 Crore:\\n\u2022 Latest stock statement available on record was 4 months old.\\n\u2022 Stock audit report was 15 months old.\\n\u2022 Outstanding balance has been continuously \u20b99.8 Crore for the past 120 days.\\nAnalyze whether the account should be classified as NPA and state the duties of the auditor.",
    "keyConcepts": [
      {
        "keyword": "Stale Stock Statement (3 Months)",
        "category": "Rule",
        "description": "Stock statements older than 3 months are deemed invalid and Drawing Power becomes NIL."
      },
      {
        "keyword": "Stock Audit Frequency (Annual)",
        "category": "Provision",
        "description": "Stock audit required annually for large limits (usually >= \u20b95 Crore); 15 months indicates internal control lapse."
      },
      {
        "keyword": "Drawing Power Nil Implication",
        "category": "Rule",
        "description": "When DP becomes NIL, the entire outstanding balance becomes an excess/irregularity."
      },
      {
        "keyword": "NPA Classification (90 Days Out of Order)",
        "category": "Standard",
        "description": "Outstanding exceeding DP continuously for more than 90 days causes the account to become NPA."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Technical & Regulatory Analysis under RBI Master Circular on IRAC Norms:\n\n  1. Validity of Stock Statement (3-Month Rule):\n     - RBI guidelines mandate that stock statements should not be older than 3 months.\n     - Stock statements older than 3 months (here 4 months old) are STALE and deemed invalid.\n     - Consequence: The Drawing Power (DP) of the borrower is deemed to be NIL.\n\n  2. Annual Stock Audit Non-Compliance:\n     - For large working capital limits (exceeding \u20b95 Crore), stock audit by an external CA/cost accountant is mandatory annually.\n     - Stock audit being 15 months old represents a severe internal control failure and breach of sanction terms.\n\n  3. Asset Classification (NPA Trigger):\n     - Since DP is deemed NIL due to stale stock statement, the entire outstanding balance of \u20b99.8 Crore represents an excess over DP.\n     - Under RBI norms, an account is classified as NPA if the outstanding balance remains continuously in excess of the sanctioned limit/Drawing Power for MORE THAN 90 DAYS.\n     - Here, the account has been continuously irregular for 120 days (> 90 days).\n     - CONCLUSION: The account MUST BE CLASSIFIED AS NON-PERFORMING ASSET (NPA - Sub-Standard).\n\n  4. Auditor's Action & Reporting:\n     - Issue a Memorandum of Changes (MOC) downgrading the account to Sub-Standard.\n     - Ensure required provisioning (minimum 15% on total secured exposure).\n     - Report the breakdown in stock monitoring in the Long Form Audit Report (LFAR).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying the 3-month stale stock rule leading to NIL DP, applying the 90-day continuous irregularity test, and issuing an MOC for NPA classification.",
      "criticalMisses": [
        "Failing to recognize that stock statements > 3 months make DP NIL.",
        "Concluding the account is Standard because it is within sanctioned limit of \u20b910 Cr."
      ],
      "suggestions": [
        "Explicitly mention Memorandum of Changes (MOC) and LFAR reporting."
      ]
    }
  },
  {
    "id": "aud_th_8_q1",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Prudential Norms for Agricultural Advances - Short Duration vs Long Duration Crops",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 1",
    "question": "State the prudential norms governing the classification of agricultural advances as Non-Performing Assets (NPAs). How are Short Duration Crops differentiated from Long Duration Crops?",
    "keyConcepts": [
      {
        "keyword": "Agricultural Advances NPA Norms",
        "category": "Rule",
        "description": "NPA classification linked to crop seasons rather than the standard 90-day rule."
      },
      {
        "keyword": "Short Duration Crops",
        "category": "Rule",
        "description": "Crop season up to 1 year; NPA if installment/interest unpaid for TWO crop seasons beyond due date."
      },
      {
        "keyword": "Long Duration Crops",
        "category": "Rule",
        "description": "Crop season longer than 1 year; NPA if installment/interest unpaid for ONE crop season beyond due date."
      },
      {
        "keyword": "SLBC Determination",
        "category": "Provision",
        "description": "State Level Bankers\u2019 Committee (SLBC) determines crop season length for each crop in the State."
      },
      {
        "keyword": "Natural Calamities Restructuring",
        "category": "Provision",
        "description": "Restructuring of agricultural loans due to drought/floods without immediate downgrade to NPA."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Prudential Norms for Agricultural Advances:\n  - Normal 90-day NPA rule does NOT apply to agricultural advances. Classification is determined based on CROP SEASONS.\n\n\u2022 Classification Criteria:\n  1. Short Duration Crops:\n     - Definition: Crops with a crop season up to 1 year (e.g. paddy, wheat, pulses, sugarcane in certain regions).\n     - NPA Trigger: The loan installment or interest remains unpaid for TWO CROP SEASONS beyond the due date.\n\n  2. Long Duration Crops:\n     - Definition: Crops with a crop season longer than 1 year (e.g. tea, coffee, rubber, sugarcane in certain regions).\n     - NPA Trigger: The loan installment or interest remains unpaid for ONE CROP SEASON beyond the due date.\n\n\u2022 Key Regulatory Guidelines:\n  - Determination of Crop Season: The duration of the crop season for each crop is determined by the State Level Bankers\u2019 Committee (SLBC) in each State.\n  - Natural Calamities Relief: When agricultural loans are restructured due to natural calamities (drought, flood), banks may convert short-term loans into term loans or reschedule repayments without automatically downgrading the accounts to NPA, subject to RBI Master Directions.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must differentiate short duration (2 crop seasons) from long duration (1 crop season) and mention the role of the SLBC.",
      "criticalMisses": [
        "Applying the 90-day commercial advance rule to agricultural loans.",
        "Inverting crop season rules (e.g. 1 season for short, 2 for long)."
      ],
      "suggestions": [
        "Mention SLBC role in notifying crop seasons."
      ]
    }
  },
  {
    "id": "aud_th_8_q2",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Three Stages in the Audit & Verification of Advances in Commercial Banks",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 2",
    "question": "Advances generally constitute the major asset of a banking company. Describe the three distinct stages an auditor should follow while auditing and verifying bank advances.",
    "keyConcepts": [
      {
        "keyword": "Three Stages of Audit of Advances",
        "category": "Keyword",
        "description": "Evaluation of Internal Controls, Substantive Testing of Sanctions/Disbursements, and Review of Operations/Asset Classification."
      },
      {
        "keyword": "Stage 1: Internal Control Evaluation",
        "category": "Provision",
        "description": "Assessing credit appraisal mechanisms, delegation of powers, margin adequacy, and collateral verification."
      },
      {
        "keyword": "Stage 2: Substantive Verification",
        "category": "Provision",
        "description": "Checking loan agreements, mortgage deeds, charge registration with CERSAI/ROC, and end-use of funds."
      },
      {
        "keyword": "Stage 3: Review of Operations & IRAC",
        "category": "Standard",
        "description": "Monitoring account turnover, drawing power calculations, stock statements, and applying IRAC NPA norms."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Three Distinct Stages in Audit of Bank Advances:\n\n  1. Stage 1: Evaluation of Internal Controls over Advances:\n     - Examine credit policy, credit appraisal standards, and credit rating mechanisms.\n     - Verify that sanctioning authorities acted within their delegated lending powers.\n     - Review post-disbursement supervision controls: stock statement submission, periodic inspection of units, and insurance coverage.\n\n  2. Stage 2: Substantive Testing of Sanction, Documentation & Disbursement:\n     - Verify compliance with sanction terms (margin, interest rate, repayment schedule).\n     - Inspect legal validity and enforceability of loan documentation (demand promissory notes, hypothecation deeds, mortgages).\n     - Verify registration of charges with the Registrar of Companies (ROC - Form CHG-1) and CERSAI.\n     - Ensure disbursement was made directly to suppliers/vendors to prevent fund diversion.\n\n  3. Stage 3: Review of Operations & Asset Classification (IRAC Compliance):\n     - Examine account activity to ensure credits match business turnover.\n     - Verify calculation of Drawing Power based on valid stock statements (< 3 months old).\n     - Apply RBI Income Recognition and Asset Classification (IRAC) norms to identify Non-Performing Assets (NPAs).\n     - Verify calculation of required provisioning on standard, sub-standard, doubtful, and loss assets.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on structuring the audit into the 3 recognized stages: Internal Controls -> Substantive Verification -> Operational Review & IRAC Classification.",
      "criticalMisses": [
        "Unstructured list of audit points without stage classification.",
        "Omitting CERSAI/ROC charge verification."
      ],
      "suggestions": [
        "Highlight verification of end-use of funds under substantive testing."
      ]
    }
  },
  {
    "id": "aud_th_8_q3",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Asset Classification in Consortium & Multiple Banking Arrangements",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 3",
    "question": "Explain the prudential rules governing asset classification and recovery in Consortium Advances and Multiple Banking Arrangements. Can a bank treat an advance as Standard if another consortium member has classified it as NPA?",
    "keyConcepts": [
      {
        "keyword": "Consortium Advances",
        "category": "Keyword",
        "description": "Joint financing of a large borrower by multiple banks under a single consortium agreement."
      },
      {
        "keyword": "Individual Bank Recovery Rule",
        "category": "Rule",
        "description": "Asset classification is determined based on the record of recovery of EACH individual bank."
      },
      {
        "keyword": "Discrepancy in Classification",
        "category": "Provision",
        "description": "An account can be Standard in Bank A and NPA in Bank B depending on individual servicing."
      },
      {
        "keyword": "Lead Bank Remittance Rule",
        "category": "Rule",
        "description": "If borrower remits funds to Lead Bank but Lead Bank delays transmission, member bank cannot classify as NPA if funds are with Lead Bank."
      },
      {
        "keyword": "Information Sharing Mandate",
        "category": "Rule",
        "description": "Mandatory sharing of quarterly credit information among all consortium/multiple banking lenders."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Prudential Rules in Consortium & Multiple Banking Arrangements:\n\n  1. Individual Bank Record of Recovery Governs Classification:\n     - Asset classification of advances granted under consortium or multiple banking arrangements is determined SOLELY based on the record of recovery of the INDIVIDUAL member bank.\n     - Therefore, YES: It is legally possible for an advance to be classified as 'Standard' by one bank, while another consortium member has classified it as 'NPA'.\n\n  2. Exception Regarding Lead Bank Remittances:\n     - Where the borrower has deposited required interest and installments with the Lead Bank in time, but the Lead Bank has failed to remit the member bank's share, the member bank SHALL NOT treat the account as NPA.\n     - The member bank can treat the debt as serviced, provided confirmed evidence of deposit with Lead Bank is verified.\n\n  3. Mandatory Information Sharing (RBI Mandate):\n     - Banks participating in consortium or multiple banking arrangements must exchange quarterly credit information, stock audit reports, and borrower conduct reports.\n     - If a member bank learns that an account has become NPA in another bank due to fraud or diversion of funds, it must review the account critically and re-evaluate classification.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must explicitly affirm that classification depends on each bank's individual recovery record, cite the Lead Bank transmission exception, and mention information sharing.",
      "criticalMisses": [
        "Asserting that NPA status in one bank automatically makes it NPA across all banks.",
        "Omitting the Lead Bank remittance exception."
      ],
      "suggestions": [
        "Cite the relevant RBI Master Circular provisions on Consortium Advances."
      ]
    }
  },
  {
    "id": "aud_th_8_q4",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Audit of Non-Fund Based Facilities (Letters of Credit & Bank Guarantees)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 4",
    "question": "Describe the auditor's approach and substantive procedures for verifying Non-Fund Based Facilities, specifically Letters of Credit (LCs) and Bank Guarantees (BGs).",
    "keyConcepts": [
      {
        "keyword": "Non-Fund Based Facilities",
        "category": "Keyword",
        "description": "Contingent commitments (LCs and BGs) that convert into fund-based liabilities upon default."
      },
      {
        "keyword": "Appraisal & Sanction Verification",
        "category": "Provision",
        "description": "Verifying sanction within delegated authority, financial viability, and underlying business transaction."
      },
      {
        "keyword": "Cash Margin & Collateral",
        "category": "Rule",
        "description": "Verifying stipulated cash margin maintained in term deposits and lien marked in system."
      },
      {
        "keyword": "Devolvement & Invocation Procedures",
        "category": "Rule",
        "description": "Devolved LCs and invoked BGs must be immediately debited to forced loans and subjected to 90-day NPA test."
      },
      {
        "keyword": "Contingent Liability Disclosures",
        "category": "Standard",
        "description": "Verification of outstanding guarantee/LC register against general ledger and Schedule 12 disclosures."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Substantive Audit Procedures for Non-Fund Based Facilities:\n\n  1. Verification of Sanction & Underlying Contract:\n     - Verify that non-fund limits (LCs/BGs) are sanctioned by authorities within their delegated lending powers.\n     - Ensure LCs are opened only for genuine trade transactions of the borrower and not for financing accommodation bills.\n     - Verify that financial guarantees are issued strictly within RBI exposure caps.\n\n  2. Margin & Collateral Security Verification:\n     - Check that stipulated cash margins (e.g. 10% to 25%) are collected and held in fixed deposits with an explicit lien marked in the core banking system.\n     - Ensure counter-guarantees from borrowers and personal guarantees of promoters are executed.\n\n  3. Verification of Registers & Expired Guarantees:\n     - Reconcile the subsidiary LC and Guarantee registers with the General Ledger contingent liability balances (Schedule 12).\n     - Verify whether expired guarantees have been formally reversed or claim periods have lapsed.\n\n  4. Audit of Devolved LCs & Invoked Guarantees:\n     - Scrutinize whether any LC devolved or BG was invoked during the year.\n     - Check that payment was immediately made to the beneficiary by creating a \"Forced Loan / Advance Against Devolved LC\".\n     - Ensure such devolved accounts are tested for recovery; if unpaid after 90 days, the entire customer exposure must be classified as NPA.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on covering appraisal/sanction, margin verification/lien marking, GL reconciliation under Schedule 12, and audit of devolved/invoked liabilities.",
      "criticalMisses": [
        "Failing to mention devolved LCs and forced loans.",
        "Omitting cash margin verification and lien marking."
      ],
      "suggestions": [
        "Link devolved liabilities to borrower's overall NPA classification."
      ]
    }
  },
  {
    "id": "aud_th_8_q5",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Audit of Statutory Liquidity Ratio (SLR) & Cash Reserve Ratio (CRR) Compliance",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 5",
    "question": "Explain the statutory provisions and auditor\u2019s verification procedures for Cash Reserve Ratio (CRR) under Section 42 of RBI Act, 1934, and Statutory Liquidity Ratio (SLR) under Section 24 of Banking Regulation Act, 1949.",
    "keyConcepts": [
      {
        "keyword": "CRR under Section 42, RBI Act",
        "category": "Section",
        "description": "Maintenance of minimum cash balances with RBI as a percentage of Net Demand and Time Liabilities (NDTL)."
      },
      {
        "keyword": "SLR under Section 24, BR Act",
        "category": "Section",
        "description": "Maintenance of specified percentage of NDTL in approved securities, gold, or unencumbered cash balances."
      },
      {
        "keyword": "Net Demand and Time Liabilities (NDTL)",
        "category": "Keyword",
        "description": "Computation of demand and time liabilities with reference to alternate Friday reporting dates."
      },
      {
        "keyword": "Penal Interest for Default",
        "category": "Rule",
        "description": "Penal interest charged by RBI for shortfall in daily or fortnightly CRR/SLR maintenance."
      },
      {
        "keyword": "Auditor Certification",
        "category": "Standard",
        "description": "Central Statutory Auditor certification of 12 reporting alternate Fridays during the year."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Statutory Provisions & Auditor Verification:\n\n  1. Cash Reserve Ratio (CRR - Section 42 of RBI Act, 1934):\n     - Every scheduled commercial bank must maintain a minimum percentage of its Net Demand and Time Liabilities (NDTL) as cash balance with the RBI.\n     - Maintenance is on an average fortnightly basis, with a daily minimum maintenance requirement (presently 90% of required CRR).\n     - Shortfall attracts penal interest from RBI under Section 42(3) of the RBI Act.\n\n  2. Statutory Liquidity Ratio (SLR - Section 24 of BR Act, 1949):\n     - Banks must maintain a specified percentage (e.g. 18%) of their NDTL in the form of liquid assets: cash, gold, or unencumbered approved securities (Treasury bills, Central/State government securities).\n     - Must be maintained on a daily basis at the close of business.\n\n  3. Verification Procedures by Central Statutory Auditors:\n     - Verify the accuracy of NDTL computations prepared by the bank with reference to branch returns and treasury data for reporting alternate Fridays.\n     - Ensure proper exclusions (e.g. inter-bank deposits, capital funds) and inclusions (margin deposits, cash certificates) in NDTL.\n     - Verify valuation of SLR securities in accordance with RBI prudential norms (HTM, AFS, HFT portfolios).\n     - Test whether daily SLR/CRR was maintained on all days during the audit period, especially 12 sample alternate Fridays selected for detailed certification.\n     - Inquire whether any shortfall occurred and examine penal interest payments or notices from the RBI.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires clear distinction between CRR (Sec 42, RBI Act) and SLR (Sec 24, BR Act), definition of NDTL, and central auditor verification procedures.",
      "criticalMisses": [
        "Confusing Section 42 of RBI Act with Section 24 of BR Act.",
        "Omitting NDTL computation rules."
      ],
      "suggestions": [
        "Mention the 12 alternate Fridays audit sampling convention."
      ]
    }
  },
  {
    "id": "aud_th_8_q6",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Provisioning Requirements on NPAs - Sub-standard, Doubtful, and Loss Assets",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 6",
    "question": "Enumerate the provisioning percentages required to be maintained by commercial banks on Non-Performing Assets under RBI Prudential Norms across Sub-standard, Doubtful, and Loss categories.",
    "keyConcepts": [
      {
        "keyword": "Sub-standard Asset Provisioning",
        "category": "Rule",
        "description": "15% on secured exposure; 25% on unsecured exposure (20% for infrastructure loans)."
      },
      {
        "keyword": "Doubtful Category 1 (D1 - Up to 1 year)",
        "category": "Rule",
        "description": "25% on secured portion + 100% on unsecured portion."
      },
      {
        "keyword": "Doubtful Category 2 (D2 - 1 to 3 years)",
        "category": "Rule",
        "description": "40% on secured portion + 100% on unsecured portion."
      },
      {
        "keyword": "Doubtful Category 3 (D3 - More than 3 years)",
        "category": "Rule",
        "description": "100% on both secured and unsecured portions."
      },
      {
        "keyword": "Loss Asset Provisioning",
        "category": "Rule",
        "description": "100% provision or complete write-off in books."
      }
    ],
    "shortSuggestedAnswer": "\u2022 RBI Mandatory Provisioning Rates on NPAs:\n\n  1. Sub-Standard Assets (NPA <= 12 Months):\n     - Secured Exposure: 15% on total outstanding balance.\n     - Unsecured 'Ab-initio' Exposure: 25% on total outstanding balance (20% in case of infrastructure loan accounts).\n\n  2. Doubtful Assets (Remained Sub-standard for > 12 Months):\n     - Unsecured Portion: 100% provision on the unsecured portion across all doubtful categories.\n     - Secured Portion:\n       \u2022 Category D1 (Doubtful up to 1 year): 25% on the secured portion.\n       \u2022 Category D2 (Doubtful > 1 year and up to 3 years): 40% on the secured portion.\n       \u2022 Category D3 (Doubtful > 3 years): 100% on the secured portion.\n\n  3. Loss Assets:\n     - Definition: Asset identified as loss by bank, internal/external auditor, or RBI inspectors, but not written off.\n     - Provision: 100% of the entire outstanding balance must be provided for, or the asset written off completely.\n\n\u2022 Note on Realizable Value of Security:\n  - Security must be valued by approved valuers at least once every 3 years. If security erosion exceeds 50%, account moves straight to Doubtful; if erosion > 90%, account moves straight to Loss asset.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on exact numerical accuracy across Sub-standard (15%/25%), D1 (25%/100%), D2 (40%/100%), D3 (100%), and Loss (100%).",
      "criticalMisses": [
        "Incorrect provisioning percentages (e.g. swapping D1 and D2).",
        "Omitting 100% unsecured provision in doubtful category."
      ],
      "suggestions": [
        "Mention the 3-year valuation rule and severe security erosion triggers."
      ]
    }
  },
  {
    "id": "aud_th_8_q7",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Long Form Audit Report (LFAR) - Purpose, Structure, and Reporting Responsibilities",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 7",
    "question": "Explain the purpose and statutory nature of the Long Form Audit Report (LFAR). Discuss the respective responsibilities of Branch Statutory Auditors and Central Statutory Auditors in relation to LFAR.",
    "keyConcepts": [
      {
        "keyword": "Long Form Audit Report (LFAR)",
        "category": "Keyword",
        "description": "Detailed structured questionnaire prescribed by RBI to identify internal control deficiencies and risks."
      },
      {
        "keyword": "Branch Statutory Auditor Responsibility",
        "category": "Provision",
        "description": "Complete LFAR questionnaire for the branch covering cash, advances, deposits, housekeeping, and fraud."
      },
      {
        "keyword": "Central Statutory Auditor Responsibility",
        "category": "Provision",
        "description": "Synthesize branch LFARs, complete Head Office LFAR, and submit consolidated report to Board/RBI."
      },
      {
        "keyword": "Submission Deadlines",
        "category": "Rule",
        "description": "Mandatory submission to bank management and RBI within prescribed regulatory timelines."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Purpose & Nature of LFAR:\n  - LFAR is a comprehensive, structured questionnaire designed by the Reserve Bank of India (RBI).\n  - Unlike the statutory audit report which expresses an audit opinion on true and fair view, the LFAR is a management report that provides granular diagnostic feedback on internal controls, credit monitoring, compliance, and operational deficiencies.\n\n\u2022 Respective Responsibilities:\n  1. Branch Statutory Auditor (SBA):\n     - The SBA must answer every question in the Branch LFAR questionnaire objectively, supported by instances and specific account numbers.\n     - Key focus areas: Cash and physical security, verification of advances, classification of NPAs, adequacy of stock statements, housekeeping (suspense and clearing accounts), and internal control lapses.\n     - SBA must submit the completed LFAR along with the statutory audit report to the Head Office and Central Statutory Auditors.\n\n  2. Central Statutory Auditor (CSA):\n     - Complete the Head Office LFAR covering treasury operations, investments, capital adequacy, macro credit governance, and IT systems.\n     - Review, analyze, and synthesize significant observations reported in all Branch LFARs.\n     - Prepare and issue an Executive Summary / Consolidated LFAR for the bank as a whole, submitted to the Audit Committee of the Board (ACB) and the RBI.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must differentiate LFAR from statutory report and detail the dual roles of Branch Auditors (branch LFAR) vs Central Auditors (consolidation and Head Office LFAR).",
      "criticalMisses": [
        "Treating LFAR as an audit opinion rather than a diagnostic management questionnaire.",
        "Omitting the Central Auditor's consolidation duty."
      ],
      "suggestions": [
        "Mention submission to the Audit Committee of the Board (ACB)."
      ]
    }
  },
  {
    "id": "aud_th_8_q8",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Basel III Capital Adequacy Framework - CRAR Components & Capital Conservation Buffer",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 8",
    "question": "Under the Basel III framework implemented by RBI, what are the components of Capital Funds (Tier 1 and Tier 2) for computing the Capital to Risk-Weighted Assets Ratio (CRAR)? What is the Capital Conservation Buffer (CCB) requirement?",
    "keyConcepts": [
      {
        "keyword": "Capital to Risk-Weighted Assets Ratio (CRAR)",
        "category": "Rule",
        "description": "Minimum 9% total capital ratio for commercial banks in India (higher than Basel 8% baseline)."
      },
      {
        "keyword": "Common Equity Tier 1 (CET1)",
        "category": "Provision",
        "description": "Paid-up equity capital, share premium, statutory reserves, free reserves, minus regulatory deductions."
      },
      {
        "keyword": "Additional Tier 1 (AT1)",
        "category": "Provision",
        "description": "Perpetual non-cumulative preference shares (PNCPS) and perpetual debt instruments (PDI)."
      },
      {
        "keyword": "Tier 2 Capital (Gone-Concern Capital)",
        "category": "Provision",
        "description": "General provisions, revaluation reserves (at discount), hybrid debt instruments, subordinated term debt."
      },
      {
        "keyword": "Capital Conservation Buffer (CCB)",
        "category": "Rule",
        "description": "2.5% composed of CET1, making total minimum capital requirement 11.5%."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Basel III Capital Adequacy Framework in India (RBI Master Circular):\n\n  1. Minimum Regulatory Capital Ratio (CRAR):\n     - Minimum Total CRAR: 9.0% of total risk-weighted assets (RWA) (vs 8% Basel minimum).\n     - Minimum Common Equity Tier 1 (CET1): 5.5% of RWA.\n     - Minimum Tier 1 Capital: 7.0% of RWA.\n\n  2. Components of Tier 1 Capital (Going-Concern Capital):\n     - Common Equity Tier 1 (CET1):\n       \u2022 Paid-up common equity shares;\n       \u2022 Share premium resulting from equity issuance;\n       \u2022 Statutory reserves and free reserves;\n       \u2022 Less: Regulatory deductions (goodwill, deferred tax assets, intangible assets, cumulative losses).\n     - Additional Tier 1 (AT1):\n       \u2022 Perpetual Non-Cumulative Preference Shares (PNCPS);\n       \u2022 Perpetual Debt Instruments (PDI) with loss-absorption write-down/conversion features.\n\n  3. Components of Tier 2 Capital (Gone-Concern Capital):\n     - General Provisions and Loss Reserves (capped at 1.25% of credit risk-weighted assets);\n     - Revaluation Reserves (discounted by 55%);\n     - Subordinated Debt instruments with a minimum original maturity of 5 years.\n     - Cap: Tier 2 capital is limited to a maximum of 100% of Tier 1 capital.\n\n  4. Capital Conservation Buffer (CCB):\n     - Mandatory additional buffer of 2.5% comprised exclusively of CET1 capital.\n     - Total Capital Requirement = 9% (Base CRAR) + 2.5% (CCB) = 11.50% of Risk-Weighted Assets.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on numerical precision: 9% Base CRAR + 2.5% CCB = 11.5%, with detailed breakdown into CET1, AT1, and Tier 2 capital.",
      "criticalMisses": [
        "Stating 8% CRAR instead of RBI's mandated 9%.",
        "Omitting the 2.5% CCB requirement."
      ],
      "suggestions": [
        "Mention the 55% haircut applied to revaluation reserves."
      ]
    }
  },
  {
    "id": "aud_th_8_q9",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Inland Letter of Credit (ILC) Devolvement & Liability Crystallization",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 9",
    "question": "An Inland Letter of Credit (ILC) of \u20b92 Crore issued by a branch devolved during the financial year. The borrower was unable to fund the payment, and the branch met the payment by creating a forced debit. Discuss the accounting, provisioning, and reporting obligations of the auditor.",
    "keyConcepts": [
      {
        "keyword": "LC Devolvement",
        "category": "Keyword",
        "description": "When the applicant fails to pay the bill drawn under LC on due date and the issuing bank honors commitment."
      },
      {
        "keyword": "Accounting Treatment",
        "category": "Provision",
        "description": "Contingent liability extinguished; forced advance / overdraft created immediately in borrower's name."
      },
      {
        "keyword": "Asset Classification & 90-Day Rule",
        "category": "Rule",
        "description": "If devolved amount remains unpaid after 90 days, the entire customer credit facility becomes NPA."
      },
      {
        "keyword": "LFAR & MOC Reporting",
        "category": "Standard",
        "description": "Report devolvement in LFAR; issue MOC if account was incorrectly maintained as standard."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Audit Analysis of Devolved Inland Letter of Credit:\n\n  1. Immediate Accounting Treatment:\n     - Upon devolvement, the bank must immediately honor its commitment to the negotiating/beneficiary bank.\n     - The contingent liability recorded under Schedule 12 is extinguished.\n     - The payment must be debited to the customer\u2019s account by creating a funded advance: \"Advances Against Devolved LCs\" or \"Forced Debit / Overdraft\".\n     - The bank MUST NOT park the payment in suspense or sundry clearing accounts.\n\n  2. Asset Classification (IRAC Norms):\n     - Under RBI norms, if a devolved LC balance is not reimbursed by the borrower within 90 days from the date of payment/devolvement, the account becomes an NPA.\n     - Borrower-Wise Classification Principle: Under RBI norms, asset classification is borrower-wise and not facility-wise.\n     - Therefore, if the devolved LC account becomes NPA, ALL OTHER credit facilities (CC, Term Loans, Export Credit) granted to the borrower will also automatically become NPA.\n\n  3. Auditor's Action & Reporting:\n     - Check the age of the forced debit. If > 90 days, verify that the branch has downgraded all accounts of the borrower to NPA.\n     - Verify calculation of required provisioning (minimum 15%).\n     - If not downgraded by the branch, issue a Memorandum of Changes (MOC).\n     - Report details of devolved LCs and recovery status in the Branch LFAR.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must explain immediate creation of forced advance, enforce the borrower-wise NPA rule upon 90-day expiry, and state MOC/LFAR reporting duties.",
      "criticalMisses": [
        "Failing to mention the borrower-wise classification principle.",
        "Allowing devolved LCs to be parked in suspense accounts."
      ],
      "suggestions": [
        "Highlight that contingent liability is converted into a funded exposure."
      ]
    }
  },
  {
    "id": "aud_th_8_q10",
    "subjectId": "Audit",
    "chapterName": "Audit of Banks",
    "title": "Classification and Reporting of Frauds in Commercial Banks to RBI (Form FMR-1)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 8 / Theoretical Question 10",
    "question": "Detail the statutory framework for classification and reporting of Frauds in Commercial Banks as per RBI Master Directions. What are the specific reporting timelines and forms (e.g. Form FMR-1)?",
    "keyConcepts": [
      {
        "keyword": "RBI Master Directions on Frauds",
        "category": "Rule",
        "description": "Mandatory classification, investigation, and reporting of frauds to RBI and law enforcement."
      },
      {
        "keyword": "Classification Categories",
        "category": "Keyword",
        "description": "Misappropriation, fraudulent encashment, unauthorized credit facilities, fraudulent forex transactions, cyber fraud."
      },
      {
        "keyword": "Form FMR-1 Reporting",
        "category": "Rule",
        "description": "Fraud Monitoring Return (FMR-1) submitted to RBI Central Fraud Registry within 3 weeks of detection."
      },
      {
        "keyword": "100% Provisioning Requirement",
        "category": "Rule",
        "description": "Full 100% provision required over 4 quarters for fraud accounts, or upfront 100% in same quarter."
      },
      {
        "keyword": "Reporting to Police / CBI",
        "category": "Rule",
        "description": "Mandatory filing of complaints with State Police (State CID) or CBI (Anti-Corruption Branch / BS&FC)."
      }
    ],
    "shortSuggestedAnswer": "\u2022 RBI Master Directions on Classification & Reporting of Frauds:\n\n  1. Classification of Frauds (7 Prescribed Categories):\n     - (a) Misappropriation and criminal breach of trust;\n     - (b) Fraudulent encashment through forged instruments / manipulation of books;\n     - (c) Unauthorized credit facilities extended for reward or illegal gratification;\n     - (d) Negligence and cash shortages;\n     - (e) Cheating and forgery;\n     - (f) Fraudulent foreign exchange transactions;\n     - (g) Any other type of fraud not coming under the above heads (including cyber frauds).\n\n  2. Reporting Mechanism to RBI (Form FMR-1):\n     - Banks must report all fraud cases involving \u20b91 Lakh and above through the online Central Fraud Monitoring Cell (CFMC) portal in Form FMR-1.\n     - Reporting Timeline: Within 3 WEEKS from the date of detection of fraud.\n     - For large value frauds (\u20b91 Crore and above), flash reports must be sent within 48 hours to RBI.\n\n  3. Mandatory Provisioning Norms for Fraud Accounts:\n     - The entire amount involved in the fraud must be provided for 100% immediately.\n     - Banks are permitted to spread the provisioning over a period not exceeding FOUR QUARTERS, commencing from the quarter in which fraud occurred, provided 25% minimum is provided each quarter.\n\n  4. Reporting to Law Enforcement Agencies:\n     - Fraud up to \u20b93 Crore: State Police / State CID.\n     - Fraud from \u20b93 Crore to \u20b950 Crore: Central Bureau of Investigation (CBI) - Anti-Corruption Branch.\n     - Fraud above \u20b950 Crore: CBI - Banking Security & Fraud Cell (BS&FC).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on Form FMR-1 reporting within 3 weeks, 100% provisioning rules (over 4 quarters), and reporting thresholds to Police/CBI.",
      "criticalMisses": [
        "Omitting Form FMR-1 and the 3-week timeline.",
        "Failing to mention the 100% fraud provisioning requirement."
      ],
      "suggestions": [
        "Include reporting thresholds to Police vs CBI."
      ]
    }
  },
  {
    "id": "aud_th_09_tyu1",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4400 - Reporting on Agreed-Upon Procedures for Accounts Receivable Confirmation",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Test Your Understanding 1",
    "question": "A company asks you to carry out the process of confirmation of its accounts receivables having balances in excess of \u20b9 10 lacs as per its books of accounts at the close of the year. The work to be performed only involves preparing and sending confirmation requests to such parties, analysis of variations on receipt of confirmations and submission of a report in accordance with professional standards. What points have to be kept in mind for inclusion in the report specifically for such engagement?",
    "keyConcepts": [
      {
        "keyword": "SRS 4400",
        "category": "Standard",
        "description": "Engagements to Perform Agreed-upon Procedures Regarding Financial Information."
      },
      {
        "keyword": "Non-Assurance Engagement",
        "category": "Provision",
        "description": "Explicit statement that procedures do not constitute an audit or review, and no assurance is expressed."
      },
      {
        "keyword": "Agreed-Upon Procedures",
        "category": "Keyword",
        "description": "Statement that procedures performed were those agreed-upon with recipient."
      },
      {
        "keyword": "Report of Factual Findings",
        "category": "Keyword",
        "description": "Description of factual findings with sufficient details of errors and exceptions."
      },
      {
        "keyword": "Restricted Distribution",
        "category": "Rule",
        "description": "Statement that report is restricted to parties that agreed to procedures."
      },
      {
        "keyword": "Additional Procedures Caveat",
        "category": "Provision",
        "description": "Statement that had additional procedures, audit, or review been performed, other matters might have come to light."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Nature of Engagement:\n  - Governed by SRS 4400 \"Engagements to Perform Agreed-upon Procedures Regarding Financial Information\".\n  - It is a non-assurance engagement where the practitioner issues a report of factual findings without expressing an audit opinion or review conclusion.\n\n\u2022 Mandatory Specific Reporting Points:\n  1. Title & Addressee: Clearly identified as Report of Factual Findings, addressed to appointing authority.\n  2. Identification of Subject Matter: Accounts receivables balances exceeding \u20b9 10 lacs as per books at year-end.\n  3. Stated Scope & Standard: Statement that procedures were agreed-upon with recipient and performed per SRS 4400.\n  4. Specific Listing of Procedures: Details of sending requests, receiving responses, and analyzing variances.\n  5. Description of Factual Findings: Listing of discrepancies, variations, and unconfirmed balances with details of errors.\n  6. Disclaimer of Assurance: Explicit statement that procedures performed do not constitute an audit or review and NO assurance is expressed.\n  7. Additional Procedures Caveat: Statement that had additional procedures, an audit, or a review been performed, other matters might have come to light.\n  8. Restriction on Distribution: Explicit statement restricting distribution strictly to parties that agreed to the procedures.\n  9. Non-Extension Statement: Statement that report relates only to specified debtors and does not extend to the financial statements as a whole.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires identification of assignment as AUP under SRS 4400, citing report of factual findings, no-assurance disclaimer, and restricted distribution clause.",
      "criticalMisses": [
        "Failure to specify SRS 4400 governance.",
        "Omission of no-assurance disclaimer.",
        "Omission of restricted distribution clause."
      ],
      "suggestions": [
        "Structure the 9 mandatory reporting elements in crisp numbered bullets.",
        "Highlight the additional procedures caveat."
      ]
    }
  },
  {
    "id": "aud_th_09_tyu2",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Accounting Treatment of Repudiated Insurance Claim & Practitioner Action",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Test Your Understanding 2",
    "question": "During the course of performing a compilation engagement in accordance with SRS 4410, it becomes known to you that the client had suffered a theft loss of \u20b9 100 lacs of its inventories over a period of time at a storage location visited infrequently. A claim was lodged by the client with the insurance company which was repudiated due to certain technical reasons relating to coverage of policy. The client has not preferred a complaint or an appeal against said repudiation. The amount is reflected under the head \u201ccurrent assets\u201d in trial balance of the client. Discuss how you should proceed to deal with the matter?",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "Material Misstatement",
        "category": "Provision",
        "description": "Carrying repudiated claim without appeal as asset is an unrecorded loss resulting in material misstatement."
      },
      {
        "keyword": "Propose Amendments",
        "category": "Rule",
        "description": "Practitioner must propose appropriate amendments to management to write off the loss."
      },
      {
        "keyword": "Withdrawal Mandate",
        "category": "Rule",
        "description": "If management refuses/declines proposed amendments, practitioner shall withdraw from engagement."
      },
      {
        "keyword": "Inform TCWG",
        "category": "Provision",
        "description": "Inform management and TCWG of reasons for withdrawal."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Accounting Evaluation:\n  - A repudiated insurance claim of \u20b9 100 lacs with no legal appeal preferred represents an irrecoverable loss.\n  - Retaining it under \"Current Assets\" violates the applicable financial reporting framework, resulting in material misstatement.\n\n\u2022 Procedural Action under SRS 4410:\n  1. Propose Accounting Amendments:\n     - Practitioner must bring the matter to management's attention and propose writing off the loss in the profit/loss statement.\n  2. Action upon Management Acceptance:\n     - If management agrees, compile the amended financial information correctly.\n  3. Action upon Management Refusal:\n     - If management refuses to make proposed amendments, the compiled financial statements remain materially misleading.\n     - Practitioner SHALL WITHDRAW from the compilation engagement.\n     - Inform management and Those Charged with Governance (TCWG) of the reasons for withdrawal.\n  4. Non-Possibility of Withdrawal:\n     - If withdrawal is legally or practically not possible, determine professional and legal responsibilities under applicable laws.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying repudiated claim as irrecoverable loss, mandatory amendment proposal, and duty to withdraw if management refuses.",
      "criticalMisses": [
        "Failure to recognize that repudiated claim cannot remain an asset.",
        "Omission of mandatory withdrawal rule under SRS 4410 upon management refusal."
      ],
      "suggestions": [
        "State the sequential ladder: Propose amendments -> If rejected, Withdraw -> Inform TCWG."
      ]
    }
  },
  {
    "id": "aud_th_09_case",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "Integrated Case Scenario - KM Limited: Compilation Engagement Scope, SQC 1 & Ethical Dilemmas",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Integrated Case Scenario",
    "question": "KM Limited engaged your firm for compilation of financial statements under SRS 4410 for internal use for the year ended 31st March, 2024. During the engagement:\\n[1] Apparent errors were noticed in opening balances of government incentive receivables swapped with other accounts, with no credit transactions during the year.\\n[2] An audit team member suggested verifying revenue figures in the trial balance to ensure completeness.\\n[3] The team member suggested adhering to quality control standards like SQC 1.\\n[4] Figures relating to expenditure on a new Rourkela unit incurred from a local bank account were completely omitted under appropriate heads, vacillating whether practitioner must act.\\n[5] Documentation was maintained and final engagement file assembly is discussed.\\n\\nEvaluate each of the 5 matters in light of SRS 4410 and SQC 1.",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "SQC 1 Applicability",
        "category": "Standard",
        "description": "SQC 1 applies to all engagement standards including compilation engagements."
      },
      {
        "keyword": "No Verification Duty",
        "category": "Provision",
        "description": "Practitioner is not required to verify accuracy or completeness of records provided."
      },
      {
        "keyword": "Integrity Principle Violation",
        "category": "Keyword",
        "description": "Disregarding known misleading omissions violates the fundamental principle of integrity."
      },
      {
        "keyword": "Assembly of File",
        "category": "Rule",
        "description": "Final engagement file must be assembled on a timely basis per firm policies under SQC 1."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Matter [1] - Opening Balance Swapping Errors:\n  - Bring noticed errors to the knowledge of management and request corrected records.\n  - Compilation does not involve SA 510 procedures, but known errors cannot be disregarded.\n\n\u2022 Matter [2] - Revenue Verification Suggestion:\n  - Team member's suggestion is INCORRECT.\n  - Under SRS 4410, a compilation engagement does NOT require practitioner to verify accuracy or completeness of information provided by management.\n\n\u2022 Matter [3] - Quality Control Standards:\n  - Team member's suggestion is CORRECT.\n  - SQC 1 applies universally to all engagement standards issued by ICAI, including compilation engagements under SRS 4410 (SA 220 applies only to audits).\n\n\u2022 Matter [4] - Omission of Rourkela Unit Expenditure:\n  - Disregarding known omissions would render compiled statements misleading.\n  - Violates the fundamental ethical principle of INTEGRITY (Code of Ethics). Practitioner must propose amendments; if declined, withdraw.\n\n\u2022 Matter [5] - Assembly of Final Engagement File:\n  - Per SQC 1, the final engagement file must be assembled on a timely basis after report finalization in accordance with firm policy time limits (ordinarily not exceeding 60 days).",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires comprehensive analysis across all 5 sub-issues: absence of verification obligation, universal applicability of SQC 1, integrity threat from misleading omissions, and SQC 1 assembly rules.",
      "criticalMisses": [
        "Confusing compilation with audit verification.",
        "Failing to cite SQC 1 applicability to SRS 4410.",
        "Failing to cite violation of the fundamental ethical principle of Integrity."
      ],
      "suggestions": [
        "Structure response using the five clear scenario sub-headings."
      ]
    }
  },
  {
    "id": "aud_th_09_q1",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Intended Purposes of Compilation Engagements",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 1",
    "question": "List out the intended purposes for which financial information subject to a \u201ccompilation engagement\u201d may be required by an entity under SRS 4410.",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "Mandatory Periodic Reporting",
        "category": "Provision",
        "description": "Compliance with periodic statutory financial reporting requirements in law or regulation."
      },
      {
        "keyword": "Internal Use by TCWG",
        "category": "Keyword",
        "description": "Preparation on entity-specific basis for management or governance internal decision making."
      },
      {
        "keyword": "External Contractual Reporting",
        "category": "Provision",
        "description": "Periodic financial reporting for funding bodies, lenders, or grant providers under contract."
      },
      {
        "keyword": "Transactional Purposes",
        "category": "Keyword",
        "description": "Supporting changes in ownership, financing structure, mergers, or acquisitions."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Classification of Intended Purposes under SRS 4410:\n  1. Mandatory Statutory Reporting:\n     - Compliance with mandatory periodic financial reporting requirements established under relevant laws or regulations.\n  2. Internal Management & Governance Use:\n     - For management or Those Charged with Governance (TCWG), prepared on a basis appropriate for their particular internal purposes (budgeting, monitoring, cost control).\n  3. External Contractual & Grant Requirements:\n     - Periodic financial reporting undertaken for external third parties under a contract or agreement (e.g. data provided to funding bodies/governments to support grant continuation, bank loan covenants).\n  4. Transactional & Structural Purposes:\n     - Supporting business transactions involving changes to ownership or capital structure (e.g. mergers, acquisitions, restructuring, sale of business units).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying statutory, internal management, contractual grant, and transactional M&A purposes.",
      "criticalMisses": [
        "Omission of transactional/M&A purpose.",
        "Omission of contract/grant funding compliance purpose."
      ],
      "suggestions": [
        "Present the 4 distinct intended purposes in numbered bullet points."
      ]
    }
  },
  {
    "id": "aud_th_09_q2",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Compliance with Ethical Requirements and Independence Rules",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 2",
    "question": "A Chartered Accountant is offered appointment for a compilation engagement to be performed under SRS 4410. Is he required to comply with the ethical requirements of the Code of Ethics? Discuss briefly, with special focus on independence requirements.",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "Code of Ethics Compliance",
        "category": "Standard",
        "description": "Practitioner must comply with relevant ethical requirements issued by ICAI."
      },
      {
        "keyword": "Fundamental Principles",
        "category": "Keyword",
        "description": "Integrity, Objectivity, Professional Competence & Due Care, Confidentiality, Professional Behaviour."
      },
      {
        "keyword": "Independence Exemption",
        "category": "Provision",
        "description": "Independence is NOT required for compilation engagements as they are non-assurance."
      },
      {
        "keyword": "Disclosure of Non-Independence",
        "category": "Rule",
        "description": "If laws/regulations specify requirements or if practitioner is not independent, disclosure may be warranted."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Mandatory Compliance with Code of Ethics:\n  - YES. The practitioner SHALL comply with relevant ethical requirements of the ICAI Code of Ethics.\n  - Threats to compliance with fundamental principles must be identified and addressed:\n    \u2022 Integrity\n    \u2022 Objectivity\n    \u2022 Professional Competence and Due Care\n    \u2022 Confidentiality\n    \u2022 Professional Conduct\n\n\u2022 Statutory Position on Independence:\n  - Non-Assurance Character: Because a compilation engagement is a non-assurance service, independence is NOT a mandatory requirement under SRS 4410.\n  - Regulatory Exceptions: Laws or regulations may specify independence rules or disclosure requirements for specific compiled reports.\n  - Reporting Impact: Where independence is not maintained, this fact does not disqualify appointment unless forbidden by law, but relevant disclosures may be required.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must affirm that Code of Ethics applies fully, but distinguish that Independence is not required due to non-assurance nature.",
      "criticalMisses": [
        "Stating that independence is mandatory for compilation.",
        "Failing to list fundamental ethical principles (integrity, objectivity, etc.)."
      ],
      "suggestions": [
        "Contrast independence requirement in assurance vs non-assurance engagements."
      ]
    }
  },
  {
    "id": "aud_th_09_q3",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "Distinction between Related Services and Assurance Engagements",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 3",
    "question": "How do \u201crelated services\u201d differ from assurance engagements? Highlight the core parameters of difference.",
    "keyConcepts": [
      {
        "keyword": "Related Services",
        "category": "Standard",
        "description": "Non-assurance engagements governed by SRS 4400 and SRS 4410."
      },
      {
        "keyword": "Assurance Engagement Definition",
        "category": "Standard",
        "description": "Practitioner expresses a conclusion to enhance confidence of users other than responsible party."
      },
      {
        "keyword": "Level of Assurance",
        "category": "Provision",
        "description": "Zero assurance in related services vs Reasonable/Limited assurance in audits/reviews."
      },
      {
        "keyword": "Procedures Performed",
        "category": "Keyword",
        "description": "Audit tests vs factual procedures or accounting compilation assistance."
      },
      {
        "keyword": "Report Output",
        "category": "Keyword",
        "description": "Factual findings/Compilation report vs Audit Opinion/Review Conclusion."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Comparative Matrix - Assurance vs Related Services:\n\n| Parameter | Assurance Engagements (Audit / Review) | Related Services (SRS 4400 / SRS 4410) |\n|---|---|---|\n| 1. Definition & Objective | Practitioner expresses conclusion to enhance user confidence against criteria | Practitioner provides non-assurance services (factual findings or compilation) |\n| 2. Level of Assurance | Reasonable (Audit - SA) or Limited (Review - SRE) | ZERO Assurance (No opinion or conclusion expressed) |\n| 3. Primary Standards | Standards on Auditing (SAs) / SREs (2400/2410) | Standards on Related Services (SRS 4400 / SRS 4410) |\n| 4. Verification Duty | Verifies truth & fairness or absence of material misstatement | Does NOT verify accuracy or completeness of management records |\n| 5. Independence | Strictly Mandatory | NOT required (unless terms/law specifically mandate) |\n| 6. Deliverable Output | Independent Auditor's Report / Review Report | Report of Factual Findings / Compilation Report |\n| 7. User Reliance | Users rely directly on auditor's opinion/conclusion | Users assess procedures & findings themselves or rely on management |",
    "defaultRemarks": {
      "efficiencyReasoning": "Tabular comparison across objective, assurance level, standards, verification duty, independence, and deliverable format.",
      "criticalMisses": [
        "Omission of zero assurance vs reasonable/limited assurance distinction.",
        "Omission of independence difference."
      ],
      "suggestions": [
        "Use structured comparative table for full presentation marks."
      ]
    }
  },
  {
    "id": "aud_th_09_q4",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Mandatory Documentation Requirements for Compilation Engagements",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 4",
    "question": "Discuss the main documentation requirements to be taken care of by a practitioner while performing a compilation engagement under SRS 4410.",
    "keyConcepts": [
      {
        "keyword": "SRS 4410 Documentation",
        "category": "Standard",
        "description": "Mandatory items to be included in compilation engagement documentation under Para 3.9."
      },
      {
        "keyword": "Significant Matters",
        "category": "Provision",
        "description": "Significant matters arising during engagement and how practitioner addressed them."
      },
      {
        "keyword": "Reconciliation Record",
        "category": "Keyword",
        "description": "Record of how compiled financial info reconciles with underlying records/documents provided."
      },
      {
        "keyword": "Final Acknowledged Version",
        "category": "Rule",
        "description": "Copy of final compiled financial information acknowledged by management/TCWG and report."
      },
      {
        "keyword": "Optional Working Papers",
        "category": "Provision",
        "description": "Trial balance, summary of accounting records, and other source info used."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Mandatory Documentation Elements under SRS 4410 (Para 3.9):\n  1. Significant Matters & Resolution:\n     - Document all significant matters arising during compilation and how those matters were addressed by the practitioner (e.g. resolving queries, treatment of complex estimates).\n  2. Reconciliation Record:\n     - A record of how the compiled financial information reconciles with the underlying records, documents, explanations, and other information provided by management.\n  3. Acknowledged Final Version & Report:\n     - A copy of the final version of the compiled financial information for which management or TCWG has acknowledged their formal responsibility.\n     - A copy of the practitioner's final issued compilation report.\n\n\u2022 Additional Permissible Working Papers:\n  - Copy of the entity's trial balance.\n  - Summary of significant accounting records, schedules, or adjustments used during compilation.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires citation of the 3 mandatory documentation requirements under Para 3.9 of SRS 4410.",
      "criticalMisses": [
        "Omission of reconciliation record with underlying management records.",
        "Omission of management acknowledgement copy."
      ],
      "suggestions": [
        "State that SQC 1 quality control documentation rules also apply."
      ]
    }
  },
  {
    "id": "aud_th_09_q5",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Characteristics of Compilation Engagement and Practitioner\u2019s Approach",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 5",
    "question": "CA P has been appointed to compile the financial information of X Limited. CA P is confused whether he should apply the same procedures which are required to be applied to conduct an audit or there are some other procedures to discharge the duties under such an engagement. Define the characteristics of Compilation Engagement. What should be the approach of CA P for performing the Engagement?",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "Characteristics of Compilation",
        "category": "Provision",
        "description": "Applying accounting expertise, non-assurance, no audit testing, management retains responsibility."
      },
      {
        "keyword": "Practitioner Approach",
        "category": "Keyword",
        "description": "Obtain understanding of business/FRF, compile records, discuss significant judgments, read compiled info."
      },
      {
        "keyword": "Handling Inaccuracies",
        "category": "Rule",
        "description": "If info incomplete/inaccurate, request correction; withdraw if management refuses."
      },
      {
        "keyword": "Management Acknowledgement",
        "category": "Provision",
        "description": "Obtain written acknowledgement of responsibility for final compiled financial information."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Characteristics of Compilation Engagement:\n  - Accounting Expertise: Practitioner applies accounting and financial reporting expertise (not auditing expertise) to assist management in preparing financial statements.\n  - Non-Assurance Nature: No audit opinion or review conclusion is expressed; zero assurance.\n  - No Evidence Gathering: Practitioner is not required to verify accuracy or completeness of records, evaluate internal controls, or gather audit evidence.\n  - Management Responsibility: Management retains sole responsibility for the financial information, internal controls, and accounting judgments.\n\n\u2022 Approach of CA P for Performing Engagement (SRS 4410):\n  1. Understand Business & FRF: Obtain sufficient understanding of the entity\u2019s business, operations, accounting records, and applicable financial reporting framework.\n  2. Compile Information: Compile statements using records, documents, and explanations provided by management.\n  3. Discuss Significant Judgments: Discuss significant judgments assisted by CA P with management/TCWG.\n  4. Read Compiled Information: Read the compiled statements in light of understanding of entity and FRF to detect if info appears materially misstated or misleading.\n  5. Dealing with Unsatisfactory Information: If aware of inaccuracies/omissions, request corrected info. If management declines, withdraw from engagement.\n  6. Final Acknowledgement: Obtain written acknowledgement from management accepting responsibility for final compiled statements.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must delineate characteristics (non-assurance, accounting skill) and sequential approach (understand -> compile -> discuss -> read -> address inaccuracies -> acknowledge).",
      "criticalMisses": [
        "Confusing audit procedures with compilation procedures.",
        "Failing to mention reading the compiled info for obvious misstatements."
      ],
      "suggestions": [
        "Clarify that CA P must NOT perform test of controls or substantive testing."
      ]
    }
  },
  {
    "id": "aud_th_09_q6",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Guidance to Team, Differences from Assurance, and Applicability of SQC 1",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 6",
    "question": "MNC Limited has engaged CA Lalit to help the company in compilation of the financial information. CA Lalit explained his team members, the scope of work and the responsibilities under this engagement. The team members have done mostly audit engagements and do not have exposure to compilation engagements. Discuss the key issues that CA Lalit should deliberate and guide his team members with respect to this engagement and the manner it differs from assurance engagements. Give your views on the applicability of SQC 1 to this engagement.",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "SQC 1 Applicability",
        "category": "Standard",
        "description": "SQC 1 applies to all engagement standards including SRS 4410."
      },
      {
        "keyword": "Non-Assurance Distinction",
        "category": "Provision",
        "description": "Compilation conveys zero assurance; no audit testing or control evaluations."
      },
      {
        "keyword": "Management Primacy",
        "category": "Keyword",
        "description": "Management retains ultimate responsibility for financial statements and estimates."
      },
      {
        "keyword": "Reading Compiled Information",
        "category": "Rule",
        "description": "Practitioner reads statements to check whether they appear misleading."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Key Issues for Deliberation with Team Members:\n  1. Scope & Objective: Role is to assist management in preparing financial statements using accounting expertise, not to express an opinion or conclusion.\n  2. No Audit Testing: Team members must NOT perform test of controls, substantive tests, physical verifications, or third-party confirmations.\n  3. Management Responsibility: Remind team that management is responsible for financial statements, internal controls, records completeness, and accounting estimates.\n  4. Reading Compiled Statements: The team must read the final compiled info to ensure it adequately refers to the FRF and is not materially misleading.\n  5. Action on Inconsistencies: If incomplete or inaccurate information is identified, bring it to management's attention; if uncorrected, firm must withdraw.\n\n\u2022 Differences from Assurance Engagements:\n  - Assurance engagements enhance user confidence via audit opinion (reasonable) or review conclusion (limited).\n  - Compilation conveys ZERO assurance; the compilation report explicitly disclaims audit opinion and review conclusion.\n\n\u2022 Applicability of SQC 1:\n  - SQC 1 applies to ALL engagement standards issued by ICAI.\n  - Since SRS 4410 is an Engagement Standard under Related Services, SQC 1 is 100% applicable to the firm for compilation engagements. Engagement partner retains ultimate responsibility for quality.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on team guidance points (no audit testing, management primacy), difference from assurance, and unequivocal confirmation of SQC 1 applicability.",
      "criticalMisses": [
        "Failing to confirm SQC 1 applicability to compilation.",
        "Not warning team members against performing audit testing."
      ],
      "suggestions": [
        "Emphasize that SA 220 does not apply, but SQC 1 applies to the entire firm."
      ]
    }
  },
  {
    "id": "aud_th_09_q7",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4400 - Acceptance of AUP by Non-Auditor & Reporting Precautions",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 7",
    "question": "Brown Enterprises Limited has huge funds locked up in its trade receivables standing at around \u20b9 100 crores as on 31st December, 2023. The management of the company wants to evaluate the validity of the trade receivables to ensure reliability of financial reporting at the year end. The accounts department has provided a list of trade receivables to the management containing about 1000 names, their balances and contact/communication details spread in different parts of the country. The company\u2019s management has requested CA Kamna to take up this assignment and prepare a report for management in accordance with professional standards. Despite not being statutory auditor of the company, she decides to accept the above engagement.\\n(a) By explaining the nature of engagement described above, discuss whether it was proper for her to accept such engagement.\\n(b) While reporting, which precautions should be taken by her so that readers of the report do not misunderstand its scope?",
    "keyConcepts": [
      {
        "keyword": "SRS 4400",
        "category": "Standard",
        "description": "Engagements to Perform Agreed-upon Procedures Regarding Financial Information."
      },
      {
        "keyword": "Non-Auditor Acceptance",
        "category": "Rule",
        "description": "A person performing related services need not necessarily be the auditor of the entity."
      },
      {
        "keyword": "Factual Findings Report",
        "category": "Keyword",
        "description": "Auditor reports factual findings from specific agreed procedures on debtors."
      },
      {
        "keyword": "Reporting Precautions",
        "category": "Provision",
        "description": "No assurance statement, additional procedures caveat, restricted distribution, non-extension to FS as a whole."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Part (a) - Nature of Engagement & Propriety of Acceptance:\n  1. Nature: The engagement involves performing specific agreed procedures on trade receivables (e.g. balance confirmation, ledger comparison) and reporting factual findings under SRS 4400 (\"Agreed-Upon Procedures\").\n  2. Propriety of Acceptance:\n     - Acceptance is COMPLETELY PROPER.\n     - SRS 4400 explicitly clarifies that \"a person performing related services need not necessarily be the auditor of the entity\u2019s financial statements.\"\n     - Therefore, CA Kamna can validly accept the engagement even though she is not the statutory auditor.\n\n\u2022 Part (b) - Mandatory Reporting Precautions to Avoid Misunderstanding:\n  1. Statement of No Audit/Review: Explicit statement that the procedures performed do NOT constitute either an audit or a review and, as such, NO assurance is expressed.\n  2. Additional Procedures Caveat: Explicit statement that had the auditor performed additional procedures, an audit, or a review, other matters might have come to light that would have been reported.\n  3. Restriction of Distribution: Clear statement that the report is strictly restricted to those parties that have agreed to the procedures to be performed.\n  4. Specific Scope Limitation: Statement that the report relates only to the specified elements (trade receivables balances) and does NOT extend to the entity\u2019s financial statements taken as a whole.",
    "defaultRemarks": {
      "efficiencyReasoning": "Two-fold requirement: (a) justify acceptance by non-statutory auditor citing SRS 4400, (b) list the 4 mandatory scope precautions in the report.",
      "criticalMisses": [
        "Claiming a non-auditor cannot accept an AUP engagement.",
        "Omission of the 4 specific report caveat statements."
      ],
      "suggestions": [
        "Cite the exact phrasing for the no-assurance and additional procedures caveats."
      ]
    }
  },
  {
    "id": "aud_th_09_q8",
    "subjectId": "Audit",
    "chapterName": "Related Services",
    "title": "SRS 4410 - Understated Inventory, Client Obstruction, and Practitioner Withdrawal",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 9 / Theoretical Question 8",
    "question": "You have been appointed to compile the financial statements of Kings & Company (a partnership firm) for tax purposes. During the course of your work, you discover that the inventory is grossly understated, and the company has failed to apply applicable standards. On pointing out the same, the partners of Kings & Company inform you that it is outside your scope since you are not conducting an audit and the said figures duly certified by the firm should be accepted. Comment.",
    "keyConcepts": [
      {
        "keyword": "SRS 4410",
        "category": "Standard",
        "description": "Compilation Engagements."
      },
      {
        "keyword": "Misleading Financial Information",
        "category": "Provision",
        "description": "Practitioner cannot be associated with financial information that is materially misstated or misleading."
      },
      {
        "keyword": "Propose Amendments",
        "category": "Rule",
        "description": "Practitioner must propose appropriate inventory valuation amendments to management."
      },
      {
        "keyword": "Duty to Withdraw",
        "category": "Rule",
        "description": "If management declines amendments, practitioner SHALL withdraw from engagement."
      },
      {
        "keyword": "Code of Ethics Integrity",
        "category": "Standard",
        "description": "Associating with knowingly false/misleading statements violates the fundamental principle of Integrity."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Statutory Evaluation under SRS 4410 & Code of Ethics:\n  - While a compilation engagement does not require testing or audit verification, the practitioner CANNOT ignore known material misstatements.\n  - Grossly understating inventory violates applicable accounting standards and makes the compiled financial statements misleading.\n  - The partners' contention that the practitioner must blindly accept certified figures is legally UNTENABLE.\n\n\u2022 Mandatory Procedural Steps:\n  1. Propose Amendments:\n     - As per SRS 4410, if the practitioner becomes aware that compiled financial information is materially misstated or misleading, the practitioner SHALL propose appropriate amendments to management.\n  2. Action upon Client Refusal:\n     - If the partners decline or do not permit the practitioner to make the proposed amendments, the practitioner SHALL WITHDRAW from the compilation engagement.\n     - Inform the partners/management of the specific reasons for withdrawing.\n  3. Ethical Mandate (Integrity):\n     - Disregarding the gross understatement would violate the fundamental principle of Integrity under the ICAI Code of Ethics (knowingly being associated with materially false/misleading information).\n  4. If Withdrawal is Not Possible:\n     - If withdrawal is legally impossible, determine applicable legal and professional obligations.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must reject the client's contention, cite SRS 4410 amendment proposal requirement, and explain the mandatory withdrawal rule and Code of Ethics integrity mandate.",
      "criticalMisses": [
        "Accepting the client's contention that compilation requires blind acceptance.",
        "Failing to prescribe withdrawal upon client refusal."
      ],
      "suggestions": [
        "Link SRS 4410 with the fundamental ethical principle of Integrity."
      ]
    }
  },
  {
    "id": "aud_th_10_tyu1",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2400 - Review of Financial Statements Prepared under Special Purpose Framework",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Test Your Understanding 1",
    "question": "Roma Limited has entered into a contract with Dorma Limited. There is a condition in the contract by virtue of which Roma Limited is required to get its financial statements reviewed for a year on a quarterly basis in accordance with the financial reporting provisions of the contract. Can Roma Limited get its financial statements reviewed from a professional accountant in practice?",
    "keyConcepts": [
      {
        "keyword": "SRE 2400 (Revised)",
        "category": "Standard",
        "description": "Engagements to Review Historical Financial Statements."
      },
      {
        "keyword": "Special Purpose Framework",
        "category": "Provision",
        "description": "Financial statements prepared in accordance with financial reporting provisions of a contract."
      },
      {
        "keyword": "Preconditions for Acceptance",
        "category": "Rule",
        "description": "Practitioner determines acceptability of framework and understanding of purpose/users."
      },
      {
        "keyword": "Review Feasibility",
        "category": "Keyword",
        "description": "A practitioner in practice can review special purpose financial statements."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Evaluation under SRE 2400 (Revised):\n  - YES. Roma Limited can validly get its financial statements reviewed by a professional accountant in practice.\n\n\u2022 Key Regulatory Conditions & Reporting Requirements:\n  1. Special Purpose Framework Recognition:\n     - Financial statements prepared per financial reporting provisions of a contract constitute \"Special Purpose Financial Statements\".\n     - SRE 2400 explicitly permits review of financial statements prepared using either general purpose or special purpose frameworks.\n  2. Acceptance Preconditions:\n     - Prior to acceptance, practitioner must determine whether the contract's financial reporting framework is acceptable.\n     - Practitioner must obtain an understanding of the purpose for which statements are prepared and intended users.\n  3. Reporting Requirement:\n     - The practitioner's review report must include an explanatory paragraph (or Emphasis of Matter) describing the purpose and drawing attention of readers that statements are prepared under a special purpose framework and may not be suitable for other purposes.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must affirm feasibility under SRE 2400, categorize the contract framework as special purpose, and state the explanatory disclosure rule.",
      "criticalMisses": [
        "Stating that SRE 2400 only applies to general purpose financial statements.",
        "Omission of special purpose framework disclosure requirement."
      ],
      "suggestions": [
        "Mention the required Emphasis of Matter / explanatory paragraph."
      ]
    }
  },
  {
    "id": "aud_th_10_tyu2",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2400 - Practitioner Action upon Identifying Possibility of Material Misstatement",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Test Your Understanding 2",
    "question": "You are conducting a review of the financial statements of a company. It is gathered upon inquiry that there is a possibility of material misstatements in the financial statements. Discuss how you would proceed further in the matter under SRE 2400.",
    "keyConcepts": [
      {
        "keyword": "SRE 2400 (Revised)",
        "category": "Standard",
        "description": "Engagements to Review Historical Financial Statements."
      },
      {
        "keyword": "Additional Procedures",
        "category": "Provision",
        "description": "Practitioner must design and perform additional procedures when aware of potential material misstatement."
      },
      {
        "keyword": "Objective of Additional Procedures",
        "category": "Keyword",
        "description": "To conclude matter is NOT likely to cause material misstatement OR determine that it DOES cause material misstatement."
      },
      {
        "keyword": "Nature of Additional Procedures",
        "category": "Keyword",
        "description": "Inquiries in greater detail, analytical tests, substantive test of details, or external confirmations."
      },
      {
        "keyword": "Scope Limitation",
        "category": "Rule",
        "description": "If unable to conclude after additional procedures, a scope limitation exists requiring modified conclusion."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Mandatory Action Protocol under SRE 2400 (Revised):\n  1. Trigger for Additional Procedures:\n     - When the practitioner becomes aware of a matter causing belief that financial statements may be materially misstated, practitioner SHALL design and perform additional procedures.\n  2. Dual Objective of Additional Procedures:\n     - (a) Conclude that the matter(s) is NOT likely to cause the financial statements as a whole to be materially misstated; OR\n     - (b) Determine that the matter(s) DOES cause the financial statements as a whole to be materially misstated.\n  3. Nature of Additional Procedures:\n     - Additional inquiry or analytical procedures focused in greater detail on affected accounts.\n     - Other procedures, such as substantive test of details or external confirmations (e.g. verifying subsequent collections for past-due debtors).\n  4. Subsequent Evaluation:\n     - If outcome (a): Issue unmodified conclusion.\n     - If outcome (b): Request management correction; if refused, express Qualified or Adverse conclusion.\n     - If unable to reach either (a) or (b): A scope limitation exists; practitioner must express a Qualified conclusion or Disclaim a conclusion.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must delineate the dual objective of additional procedures, list sample procedures, and trace the decision tree through resolution or scope limitation.",
      "criticalMisses": [
        "Failing to mention the dual objective under SRE 2400.",
        "Omitting the consequence of unresolved scope limitations."
      ],
      "suggestions": [
        "Illustrate with an example like overdue debtors requiring substantive test of details."
      ]
    }
  },
  {
    "id": "aud_th_10_tyu3",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2410 - Reporting on Uninsured Disaster Losses & Going Concern Uncertainty",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Test Your Understanding 3",
    "question": "During review of the quarterly results of a company of which you are auditor, it is gathered on inquiries made that there has been a major fire in fabric processing plant of the company during the quarter. It has resulted in massive disruption in the operations of the company. Worse still, machinery and inventories of plant were uninsured due to carelessness of concerned staff leading to substantial losses. The matter has been disclosed in interim financial information appropriately. Discuss how you would proceed to deal with the same in the review report under SRE 2410.",
    "keyConcepts": [
      {
        "keyword": "SRE 2410",
        "category": "Standard",
        "description": "Review of Interim Financial Information Performed by the Independent Auditor of the Entity."
      },
      {
        "keyword": "Going Concern Uncertainty",
        "category": "Provision",
        "description": "Uninsured disaster causing massive disruption may cast significant doubt on going concern."
      },
      {
        "keyword": "Adequate Disclosure",
        "category": "Provision",
        "description": "Entity has appropriately disclosed the fire, uninsured losses, and operational disruption in notes."
      },
      {
        "keyword": "Emphasis of Matter Paragraph",
        "category": "Rule",
        "description": "Auditor modifies review report by adding an Emphasis of Matter paragraph highlighting the uncertainty."
      },
      {
        "keyword": "Clean Conclusion Preserved",
        "category": "Keyword",
        "description": "Conclusion is not qualified when adequate disclosure is made in interim financial information."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Factual & Technical Analysis:\n  - Major fire causing operational disruption combined with substantial uninsured losses creates significant doubt regarding going concern.\n  - Management has appropriately disclosed the disaster, losses, and implications in interim financial information notes.\n\n\u2022 Reporting Treatment under SRE 2410:\n  1. Evaluation of Disclosure:\n     - Under SRE 2410, when a material uncertainty exists regarding going concern and ADEQUATE DISCLOSURE is made in the interim financial information, the auditor modifies the review report by adding an EMPHASIS OF MATTER (EoM) paragraph.\n  2. Structure of Review Report:\n     - The conclusion expressed by the auditor remains UNMODIFIED (not qualified).\n     - An Emphasis of Matter paragraph is inserted immediately following the conclusion paragraph.\n     - The EoM paragraph draws attention to the specific note disclosing the fire loss, lack of insurance, and operational disruption, highlighting the material uncertainty.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must distinguish between adequate disclosure (warranting Emphasis of Matter) vs inadequate disclosure (warranting Qualified/Adverse conclusion).",
      "criticalMisses": [
        "Calling for a qualified conclusion despite adequate disclosure.",
        "Failing to cite SRE 2410 going concern rules."
      ],
      "suggestions": [
        "Explicitly affirm that the conclusion is unmodified but report is modified via EoM."
      ]
    }
  },
  {
    "id": "aud_th_10_tyu4",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2410 - Options Available upon Management and Audit Committee Inaction on Material Misstatement",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Test Your Understanding 4",
    "question": "CA Seerat is conducting review of the quarterly financial information of a company of which she is also auditor. She believes that it is necessary to make a material adjustment to the quarterly financial information for it to be prepared, in all material respects, in accordance with the applicable financial reporting framework. She has communicated the matter to the CFO and the audit committee. However, no response was received even after waiting for a reasonable time. What are the options available to her under SRE 2410?",
    "keyConcepts": [
      {
        "keyword": "SRE 2410",
        "category": "Standard",
        "description": "Review of Interim Financial Information Performed by the Independent Auditor."
      },
      {
        "keyword": "Unadjusted Material Misstatement",
        "category": "Provision",
        "description": "Management and TCWG failure to make necessary material adjustment."
      },
      {
        "keyword": "Modify Review Report",
        "category": "Rule",
        "description": "Express a Qualified or Adverse conclusion describing the departure and financial effects."
      },
      {
        "keyword": "Withdrawal from Engagement",
        "category": "Rule",
        "description": "Consider withdrawing from the interim review engagement."
      },
      {
        "keyword": "Resignation from Statutory Audit",
        "category": "Rule",
        "description": "Consider resigning from the appointment to audit the annual financial statements."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Statutory Protocol under SRE 2410:\n  - When the auditor believes a material adjustment is necessary and Those Charged with Governance (Audit Committee) do not respond appropriately within a reasonable time, CA Seerat must evaluate her legal and reporting recourse.\n\n\u2022 Three Specific Options Available to CA Seerat:\n  1. Option 1: Modify the Review Report:\n     - Issue a Modified Review Report with a Qualified Conclusion (\"Except for...\") or an Adverse Conclusion (if material and pervasive).\n     - The report must describe the nature of the departure and, if practicable, quantify the financial effects on the interim financial information.\n  2. Option 2: Withdraw from the Review Engagement:\n     - Consider the possibility of withdrawing from the interim review engagement prior to report issuance.\n  3. Option 3: Resign from the Annual Statutory Audit Appointment:\n     - SRE 2410 explicitly provides that the auditor should consider the possibility of RESIGNING FROM THE APPOINTMENT TO AUDIT THE ANNUAL FINANCIAL STATEMENTS of the entity.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires identification of all three distinct statutory options under SRE 2410 Para 3.8: Modify report, Withdraw from review, and Resign from annual audit.",
      "criticalMisses": [
        "Omission of option to resign from the annual statutory audit.",
        "Failure to mention Qualified vs Adverse conclusion."
      ],
      "suggestions": [
        "State that CA Seerat must document all communications with CFO and Audit Committee."
      ]
    }
  },
  {
    "id": "aud_th_10_case",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "Integrated Case Scenario - Fast Operations Limited: Review Report under SEBI LODR Reg 33 & SRE 2410",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Integrated Case Scenario",
    "question": "Fast Operations Limited, a listed company, is finalizing its interim review report for the quarter and six months ended September 30, 2024, pursuant to Regulation 33 of SEBI (LODR) Regulations, 2015. Analyze the required draft report text and answer:\\n[1] Who is the statutory addressee of the review report?\\n[2] How should the auditor's responsibility sentence begin under paragraph 2?\\n[3] Which specific engagement standard must be stated in paragraph 3?\\n[4] What is the precise statutory phrasing comparing review scope with an audit?\\n[5] What is the standard negative assurance conclusion sentence under paragraph 4?",
    "keyConcepts": [
      {
        "keyword": "SEBI LODR Regulation 33",
        "category": "Rule",
        "description": "Mandatory quarterly review requirement for listed entities."
      },
      {
        "keyword": "Addressee Board of Directors",
        "category": "Rule",
        "description": "Review report of listed company under Reg 33 is addressed to Board of Directors."
      },
      {
        "keyword": "Responsibility to Express Conclusion",
        "category": "Provision",
        "description": "Auditor responsibility is to express a conclusion, not an opinion."
      },
      {
        "keyword": "SRE 2410 Mandate",
        "category": "Standard",
        "description": "Review of Interim Financial Information Performed by the Independent Auditor."
      },
      {
        "keyword": "Substantially Less in Scope",
        "category": "Keyword",
        "description": "Review is substantially less in scope than an audit conducted per SAs."
      },
      {
        "keyword": "Negative Assurance Phrasing",
        "category": "Provision",
        "description": "Nothing has come to our attention that causes us to believe Statement has not disclosed required info or contains material misstatement."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Analysis of Draft Review Report under SRE 2410 & SEBI LODR Reg 33:\n\n  1. Addressee of Report:\n     - Addressed to the \"Board of Directors\" of Fast Operations Limited.\n\n  2. Responsibility Statement (Para 2):\n     - \"Our responsibility is to express a conclusion on the Statement based on our review.\" (Not an opinion, and not reasonable assurance).\n\n  3. Engagement Standard Reference (Para 3):\n     - Standard on Review Engagements (SRE) 2410, \"Review of Interim Financial Information Performed by the Independent Auditor of the Entity\".\n\n  4. Scope Comparison Phrasing (Para 3):\n     - \"A review is substantially less in scope than an audit conducted in accordance with Standards on Auditing specified under section 143(10) of the Companies Act, 2013 and consequently does not enable us to obtain assurance that we would become aware of all significant matters that might be identified in an audit. Accordingly, we do not express an audit opinion.\"\n\n  5. Concluding Negative Assurance Phrasing (Para 4):\n     - \"Based on our review conducted as stated above, nothing has come to our attention that causes us to believe that the accompanying Statement, prepared in accordance with the recognition and measurement principles laid down in the aforesaid Indian Accounting Standard (Ind AS 34) and other accounting principles generally accepted in India, has not disclosed the information required to be disclosed in terms of Regulation 33 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, as amended, including the manner in which it is to be disclosed, or that it contains any material misstatement.\"",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires exact knowledge of the ICAI/SEBI prescribed format of independent auditor's review report for listed company quarterly results.",
      "criticalMisses": [
        "Confusing 'conclusion' with 'opinion'.",
        "Selecting SRE 2400 instead of SRE 2410.",
        "Incorrect negative assurance wording under Reg 33."
      ],
      "suggestions": [
        "Memorize the precise SEBI Regulation 33 negative assurance boilerplate."
      ]
    }
  },
  {
    "id": "aud_th_10_q1",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2400 / SRE 2410 - Why \"Inquiry\" is a Critical Audit Procedure in Review Engagements",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 1",
    "question": "Discuss why \u201cinquiry\u201d is important as an audit procedure in an engagement to review financial statements.",
    "keyConcepts": [
      {
        "keyword": "Inquiry as Principal Source",
        "category": "Keyword",
        "description": "Inquiry is often the principal source of evidence regarding management intent."
      },
      {
        "keyword": "Evaluating Management Responses",
        "category": "Provision",
        "description": "Understanding past history of intentions and ability to pursue stated courses of action."
      },
      {
        "keyword": "Professional Skepticism",
        "category": "Standard",
        "description": "Applying professional skepticism to determine if matters cause belief of material misstatement."
      },
      {
        "keyword": "Updating Understanding",
        "category": "Provision",
        "description": "Inquiries assist in updating knowledge of entity to identify where misstatements are likely."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Importance of \"Inquiry\" in Review Engagements:\n  1. Principal Source for Management Intent:\n     - Evidence obtained through inquiry is often the principal source of evidence about management intent, accounting estimates, and future commitments.\n  2. Corroboration of Stated Intentions:\n     - When documentary evidence of intent is limited, understanding management\u2019s past track record, stated rationale, and financial ability provides essential corroborative context.\n  3. Foundation for Professional Skepticism:\n     - Inquiries enable practitioner to apply professional skepticism in critically evaluating responses, inconsistencies, and potential management bias.\n  4. Updating Understanding of Entity & Environment:\n     - Conducting inquiries assists the auditor in obtaining and updating understanding of the entity's internal controls and operating environment.\n  5. Identifying High-Risk Areas:\n     - Inquiries directly assist in identifying accounts, transactions, or contingencies where material misstatements are most likely to arise.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must explain inquiry's role as principal evidence of intent, application of skepticism, and identification of misstatement risks.",
      "criticalMisses": [
        "Treating inquiry as mere casual conversation.",
        "Omission of professional skepticism in evaluating management responses."
      ],
      "suggestions": [
        "List specific areas of inquiry: estimates, related parties, fraud, going concern."
      ]
    }
  },
  {
    "id": "aud_th_10_q2",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2410 - Five Procedures to Update Understanding of Entity for Quarterly Review",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 2",
    "question": "CA Aditya Jain is auditor of a listed company. He is also required to carry out a quarterly review of financial statements of company in terms of regulatory requirements. He is already well-versed with the business of the company and has a deep understanding of the company. Discuss any of the five procedures by which he can update his understanding of the company for carrying out quarterly review under SRE 2410.",
    "keyConcepts": [
      {
        "keyword": "SRE 2410",
        "category": "Standard",
        "description": "Review of Interim Financial Information Performed by the Independent Auditor."
      },
      {
        "keyword": "Preceding Audit Documentation",
        "category": "Keyword",
        "description": "Reading prior year audit workpapers and recent interim reviews."
      },
      {
        "keyword": "Significant Risks Re-assessment",
        "category": "Provision",
        "description": "Considering significant risks including risk of management override of controls."
      },
      {
        "keyword": "Internal Audit Reports",
        "category": "Provision",
        "description": "Considering results of internal audits and actions taken by management."
      },
      {
        "keyword": "Management Inquiries",
        "category": "Keyword",
        "description": "Inquiring about fraud risks, business model changes, and internal control modifications."
      },
      {
        "keyword": "Materiality Considerations",
        "category": "Rule",
        "description": "Considering materiality with reference to applicable FRF for interim info."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Five Procedures to Update Understanding under SRE 2410 (Para 3.3):\n  1. Reading Prior Workpapers & Documentation:\n     - Read the documentation of the preceding year\u2019s audit and reviews of prior interim periods to identify recurring accounting issues or adjustments.\n  2. Reviewing Prior Significant Risks:\n     - Consider significant risks identified during the annual audit, specifically the risk of management override of controls.\n  3. Reading Recent Financial Information:\n     - Read the most recent annual financial statements and comparable prior interim period statements.\n  4. Considering Internal Audit Findings:\n     - Review the reports and findings of internal audits conducted during the interim period and examine subsequent actions taken by management.\n  5. Inquiries Regarding Fraud & Control Changes:\n     - Inquire of management regarding:\n       \u2022 Results of management\u2019s fraud risk assessment;\n       \u2022 Changes in business activities or operations;\n       \u2022 Significant changes in internal control and their potential impact on interim reporting.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on listing 5 exact procedures from SRE 2410 Para 3.3 for updating understanding of the entity.",
      "criticalMisses": [
        "Generic answers without specific reference to interim audit review procedures.",
        "Omission of management override of controls consideration."
      ],
      "suggestions": [
        "Present in concise numbered points."
      ]
    }
  },
  {
    "id": "aud_th_10_q3",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2400 / SRE 2410 - Significance of \"Date of Report\" in a Review Report",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 3",
    "question": "What is the significance of \u201cdate of report\u201d in a review report under SRE 2400 / SRE 2410?",
    "keyConcepts": [
      {
        "keyword": "Date of Review Report",
        "category": "Standard",
        "description": "Report date must be no earlier than date on which sufficient appropriate evidence was obtained."
      },
      {
        "keyword": "Completion of Statements",
        "category": "Provision",
        "description": "Satisfied that all statements comprising financial statements including notes have been prepared."
      },
      {
        "keyword": "Management Responsibility Assertion",
        "category": "Provision",
        "description": "Those with recognized authority have asserted responsibility for financial statements."
      },
      {
        "keyword": "Subsequent Events Boundary",
        "category": "Rule",
        "description": "Auditor has duty to consider events up to the report date; no obligation for active procedures after report date."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Significance of Date of Report in a Review Engagement:\n  1. Evidence Cut-Off Benchmark:\n     - The practitioner SHALL date the report no earlier than the date on which sufficient appropriate evidence was obtained as the basis for the conclusion.\n  2. Verification of Preparation Completeness:\n     - Date establishes that all statements comprising financial statements (including related notes) have been completely prepared.\n  3. Formal Assertion of Responsibility:\n     - Confirms that those with recognized authority (e.g. Board of Directors/Management) have formally asserted that they have taken responsibility for those financial statements.\n  4. Boundary of Auditor Responsibility:\n     - Establishes the exact cut-off date up to which the practitioner is responsible for considering events and transactions affecting financial statements. Auditor has no active obligation to perform review procedures after this date.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must explain the dual significance: evidence benchmark and management responsibility assertion date.",
      "criticalMisses": [
        "Failing to mention management's assertion of responsibility.",
        "Omission of evidence cut-off principle."
      ],
      "suggestions": [
        "Link report date to subsequent events obligations."
      ]
    }
  },
  {
    "id": "aud_th_10_q4",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2410 - Auditor\u2019s Responsibility for Subsequent Events Occurring up to Report Date",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 4",
    "question": "CA Pankaj Chaturvedi has issued a review report dated 28-07-2024 for the financial results of a company for quarter ending 30-06-2024. Describe his responsibility, if any, for events occurring from 01-07-2024 till date of review report in accordance with SRE 2410.",
    "keyConcepts": [
      {
        "keyword": "SRE 2410",
        "category": "Standard",
        "description": "Review of Interim Financial Information Performed by the Independent Auditor."
      },
      {
        "keyword": "Subsequent Events Inquiry",
        "category": "Provision",
        "description": "Auditor must inquire whether management has identified all events up to report date requiring adjustment/disclosure."
      },
      {
        "keyword": "No Active Search Duty",
        "category": "Rule",
        "description": "Auditor is not required to perform extensive procedures to identify events occurring after review period other than inquiry."
      },
      {
        "keyword": "Written Representation",
        "category": "Provision",
        "description": "Management representation confirming all subsequent events up to report date have been disclosed."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Auditor Responsibility under SRE 2410:\n  1. Mandatory Inquiry Obligation:\n     - The auditor should inquire of management whether management has identified all events occurring up to the date of review report (28-07-2024) that may require adjustment to or disclosure in the interim financial information.\n  2. Scope of Procedures:\n     - SRE 2410 explicitly provides that it is NOT necessary for the auditor to perform elaborate audit-nature procedures to search for subsequent events occurring after balance sheet date.\n     - Responsibility is primarily discharged through:\n       \u2022 Inquiries of management responsible for financial and accounting matters;\n       \u2022 Reading available minutes of meetings of shareholders and TCWG held between 01-07-2024 and 28-07-2024;\n       \u2022 Reading subsequent interim management accounts.\n  3. Written Representation Requirement:\n     - Obtain written representation from management that all events occurring subsequent to 30-06-2024 and requiring adjustment or disclosure have been duly adjusted or disclosed.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying inquiry as the primary procedure and clarifying that exhaustive audit search procedures are not required in an interim review.",
      "criticalMisses": [
        "Applying full SA 560 audit procedures instead of SRE 2410 interim review inquiry rules.",
        "Omission of management written representation."
      ],
      "suggestions": [
        "Differentiate between events occurring up to report date vs events discovered after report date."
      ]
    }
  },
  {
    "id": "aud_th_10_q5",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2400 / SRE 2410 - Steps to be Taken upon Doubt Regarding Going Concern",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 5",
    "question": "A review of financial statements includes consideration of the entity\u2019s ability to continue as a going concern. If, during the performance of the review, the practitioner becomes aware of events or conditions that may cast significant doubt about the entity\u2019s ability to continue as a going concern, enumerate the steps to be taken by the practitioner under SRE 2400 / SRE 2410.",
    "keyConcepts": [
      {
        "keyword": "Going Concern Inquiries",
        "category": "Provision",
        "description": "Inquire of management regarding plans for future actions and feasibility."
      },
      {
        "keyword": "Evaluation of Management Plans",
        "category": "Keyword",
        "description": "Evaluate whether outcome of plans will improve situation (liquidation, debt restructuring, capital)."
      },
      {
        "keyword": "Corroboration Not Required",
        "category": "Rule",
        "description": "Under SRE 2410, not ordinarily necessary to corroborate feasibility of management plans."
      },
      {
        "keyword": "Adequacy of Disclosure",
        "category": "Provision",
        "description": "Assess adequacy of going concern disclosures in financial statements."
      },
      {
        "keyword": "Reporting Impact",
        "category": "Standard",
        "description": "Emphasis of Matter if adequately disclosed; Qualified/Adverse if inadequately disclosed."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Mandatory Steps when Going Concern Doubt Arises:\n  1. Inquiry into Management\u2019s Future Plans:\n     - Inquire of management as to its plans for future action (e.g. plans to liquidate assets, borrow money, restructure debt, reduce/delay expenditure, or raise additional capital).\n     - Inquire about feasibility of those plans and whether management believes the outcome will improve the entity\u2019s situation.\n  2. Evaluation of Inquiry Responses:\n     - Evaluate whether management\u2019s responses provide a sufficient basis to continue preparing statements on going concern basis.\n     - Note: In an interim review under SRE 2410, it is not ordinarily necessary for auditor to independently corroborate feasibility of management's plans.\n  3. Assessment of Financial Statement Disclosures:\n     - Determine whether adequate disclosure of the material uncertainty has been made in notes to the financial statements.\n  4. Reporting Determination:\n     - If Adequately Disclosed: Express an unmodified conclusion and add an EMPHASIS OF MATTER paragraph highlighting the material uncertainty.\n     - If Inadequately Disclosed: Express a QUALIFIED or ADVERSE conclusion, stating specific reference to the material uncertainty.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires clear enumeration: Inquiry on plans -> Evaluate feasibility belief -> Assess disclosure -> Formulate reporting (EoM vs Qualified/Adverse).",
      "criticalMisses": [
        "Failing to address the reporting outcomes (EoM vs Modified).",
        "Omission of inquiry regarding management's future recovery plans."
      ],
      "suggestions": [
        "Mention that SRE 2410 does not require corroboration of management plan feasibility."
      ]
    }
  },
  {
    "id": "aud_th_10_q6",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2410 - Reporting on Working Capital Deficits, Loan Defaults & Material Uncertainty (GAK Limited)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 6",
    "question": "GAK Limited has compiled interim financial information and submitted it to the auditors. CA Reena noted that GAK Limited has been facing continuous working capital shortages, banks are unwilling to extend limits due to continuous 3-year losses, loan installments and interest have been defaulted for the last one year, and operations are severely curtailed.\\nUnder such circumstances, CA Reena noted that GAK Limited has NOT disclosed any information in the interim financial information relating to material uncertainties.\\n(a) Advise CA Reena on what kind of review report is required to be issued.\\n(b) If GAK Limited has disclosed information relating to material uncertainty, can CA Reena give a clean report? Discuss under SRE 2410.",
    "keyConcepts": [
      {
        "keyword": "SRE 2410",
        "category": "Standard",
        "description": "Review of Interim Financial Information Performed by the Independent Auditor."
      },
      {
        "keyword": "Material Uncertainty Regarding Going Concern",
        "category": "Provision",
        "description": "Loan defaults, working capital shortage, and curtailed operations constitute material uncertainty."
      },
      {
        "keyword": "Inadequate Disclosure - Modified Conclusion",
        "category": "Rule",
        "description": "If material uncertainty is not disclosed, express a Qualified or Adverse conclusion."
      },
      {
        "keyword": "Adequate Disclosure - Emphasis of Matter",
        "category": "Rule",
        "description": "If material uncertainty is disclosed, express an unmodified conclusion with Emphasis of Matter paragraph."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Part (a) - When GAK Limited has NOT Disclosed Material Uncertainties:\n  1. Material Uncertainty Exists: Continuous losses for 3 years, loan defaults, bank refusal for credit, and curtailed operations cast significant doubt on going concern.\n  2. Failure to Disclose:\n     - Under SRE 2410, if a material uncertainty that casts significant doubt about the entity's ability to continue as a going concern is NOT adequately disclosed, the auditor SHALL express a QUALIFIED or ADVERSE conclusion, as appropriate.\n     - Review report must specifically describe existence of material uncertainty and quantify financial effects if practicable.\n\n\u2022 Part (b) - When GAK Limited HAS Disclosed Material Uncertainties:\n  1. Unmodified Conclusion with Modification of Report:\n     - If adequate disclosure is made in interim financial information, CA Reena CANNOT give a standard clean report without modification.\n     - CA Reena must issue an UNMODIFIED conclusion accompanied by an EMPHASIS OF MATTER (EoM) paragraph.\n  2. Contents of Emphasis of Matter Paragraph:\n     - The EoM paragraph will explicitly draw attention to the relevant note disclosing loan defaults, losses, and material uncertainty relating to going concern.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on providing exact dual reporting answers: (a) Qualified/Adverse for non-disclosure, (b) Unmodified with Emphasis of Matter for adequate disclosure.",
      "criticalMisses": [
        "Confusing clean report with unmodified conclusion (ignoring mandatory EoM).",
        "Failing to specify Qualified or Adverse conclusion when disclosure is missing."
      ],
      "suggestions": [
        "Note that a report containing an Emphasis of Matter is not considered a 'clean' unmodified report in vernacular terms, though conclusion is unmodified."
      ]
    }
  },
  {
    "id": "aud_th_10_q7",
    "subjectId": "Audit",
    "chapterName": "Review of Financial Information",
    "title": "SRE 2400 - Primary Procedures & Mandatory Statements Describing Review Limitations in Report",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 10 / Theoretical Question 7",
    "question": "In a review engagement performed under SRE 2400, practitioner relies mainly on certain procedures. Naming such procedures, discuss the importance of these procedures in a review engagement.\\nPractitioner\u2019s report containing outcome of review engagement in form of \u201cconclusion\u201d also contains a description of a review of financial statements and its limitations. Which statements in this respect are to be included in the practitioner\u2019s report in accordance with SRE 2400?",
    "keyConcepts": [
      {
        "keyword": "SRE 2400 (Revised)",
        "category": "Standard",
        "description": "Engagements to Review Historical Financial Statements."
      },
      {
        "keyword": "Inquiry and Analytical Procedures",
        "category": "Keyword",
        "description": "Primary procedures relied upon to obtain limited assurance."
      },
      {
        "keyword": "Mandatory Limitation Statements",
        "category": "Rule",
        "description": "3 specific statements required under Para 2.4(g) describing the nature and limitations of review."
      },
      {
        "keyword": "Substantially Less in Scope than Audit",
        "category": "Provision",
        "description": "Procedures substantially less than audit conducted under SAs; no audit opinion expressed."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Primary Procedures Relied Upon under SRE 2400:\n  1. Inquiry Procedures:\n     - Seeking explanations from management and personnel regarding accounting policies, estimates, fraud, related parties, and going concern.\n     - Importance: Serves as the principal source of evidence regarding management intent and changes in business operations.\n  2. Analytical Procedures:\n     - Analyzing financial trends, ratios, and relationships to detect abnormal fluctuations and inconsistencies.\n     - Importance: Pinpoints areas where material misstatements are likely and provides corroborative evidence for inquiries.\n\n\u2022 Three Mandatory Statements Describing Review & Its Limitations in Review Report (Para 2.4(g)):\n  1. Limited Assurance Statement:\n     - A review engagement under this SRE is a limited assurance engagement;\n  2. Nature of Procedures Statement:\n     - The practitioner performs procedures, primarily consisting of making inquiries of management and others within the entity, as appropriate, and applying analytical procedures, and evaluates the evidence obtained; and\n  3. Contrast with Audit & Disclaimer of Audit Opinion:\n     - The procedures performed in a review are substantially less than those performed in an audit conducted in accordance with Standards on Auditing (SAs), and, accordingly, the practitioner does NOT express an audit opinion on the financial statements.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires discussion of Inquiry and Analytical procedures plus exact citation of the three mandatory limitation statements from SRE 2400 report format.",
      "criticalMisses": [
        "Omission of the three mandatory report limitation statements.",
        "Superficial explanation of analytical procedures."
      ],
      "suggestions": [
        "Quote the three limitation sub-clauses verbatim or close to ICAI standard wording."
      ]
    }
  },
  {
    "id": "aud_th_12_tyu1",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Cyber Risk as a Business & Financial Statement Risk (Sukanya's Scenario)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Test Your Understanding 1",
    "question": "Sukanya feels that \u201ccyber risk\u201d is an IT risk which should be taken care of by the IT department of the company. She does not see its link to financial statements or internal financial controls. Is she right? Give reasons.",
    "keyConcepts": [
      {
        "keyword": "Cyber Risk as Business Risk",
        "category": "Keyword",
        "description": "Cyber risk is not merely an IT issue but an enterprise-wide operational and financial risk."
      },
      {
        "keyword": "Impact on Financial Reporting",
        "category": "Provision",
        "description": "Compromise of accounting databases, unauthorized ledger alterations, and ransomware extortion."
      },
      {
        "keyword": "Internal Financial Controls (ICFR)",
        "category": "Rule",
        "description": "Weak IT security impairs General IT Controls (GITCs) and effectiveness of ICFR under Section 143(3)(i)."
      },
      {
        "keyword": "Contingent Liabilities & Provisions",
        "category": "Provision",
        "description": "Litigation, regulatory penalties (GDPR/DPDP Act), and business interruption losses."
      },
      {
        "keyword": "Going Concern Implications",
        "category": "Standard",
        "description": "Severe operational freeze or intellectual property theft threatening viability under SA 570."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Evaluation of Statement:\n  - Sukanya is INCORRECT. Cyber risk is not an isolated IT issue; it is a critical business risk with direct, severe impacts on financial statements and Internal Financial Controls (IFC).\n\n\u2022 Core Financial & Audit Linkages:\n  1. Integrity of Accounting Data & Records:\n     - Cyber attacks (e.g. ransomware, unauthorized access) can compromise ledger data, delete financial logs, or introduce fraudulent accounting entries directly affecting balance sheet accuracy.\n  2. Impairment of Internal Financial Controls over Financial Reporting (ICFR):\n     - Weak cybersecurity breaches General IT Controls (GITCs), rendering automated controls, user access management, and segregation of duties (SoD) ineffective under Section 143(3)(i).\n  3. Direct Financial Losses & Unrecorded Liabilities:\n     - Direct theft of funds via compromised payment gateways, extortion payments, forensic investigation costs, and system restoration outlays.\n  4. Statutory Fines & Legal Liabilities:\n     - Massive regulatory penalties under data protection laws (e.g. Digital Personal Data Protection Act, 2023, GDPR) and customer lawsuits requiring disclosure/provisions under Ind AS 37 / AS 29.\n  5. Going Concern Threats (SA 570):\n     - Catastrophic cyber breaches can paralyze critical business operations, destroy trade secrets, and cause reputational collapse threatening going concern.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must firmly refute the premise and establish cyber risk's direct impact on data integrity, ICFR/GITCs, contingent liabilities, and going concern.",
      "criticalMisses": [
        "Agreeing with Sukanya.",
        "Failing to connect cyber risk to ICFR / Section 143(3)(i).",
        "Omission of regulatory liabilities and data integrity risks."
      ],
      "suggestions": [
        "Mention specific statutory hooks: Section 143(3)(i), DPDP Act 2023, and SA 570."
      ]
    }
  },
  {
    "id": "aud_th_12_tyu2",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "CAATs / Data Analytics - 8 Practical Situations of Audit Tests (CA Y's Scenario)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Test Your Understanding 2",
    "question": "CA Y wants to use Computer Assisted Auditing Techniques (CAATs) to test data. Mention any 8 situations of tests that can be performed using CAATs.",
    "keyConcepts": [
      {
        "keyword": "CAATs Situations",
        "category": "Keyword",
        "description": "Application of Computer Assisted Auditing Techniques across 100% data populations."
      },
      {
        "keyword": "Exception Analysis",
        "category": "Keyword",
        "description": "Identifying negative balances, credit balances in debtors, debit balances in creditors."
      },
      {
        "keyword": "Sequence & Gaps",
        "category": "Keyword",
        "description": "Detecting missing voucher numbers, duplicated invoice sequences, check number skips."
      },
      {
        "keyword": "Duplicate Payments",
        "category": "Keyword",
        "description": "Extracting duplicate vendor invoices based on same vendor, date, and invoice amount."
      },
      {
        "keyword": "Recalculation & Aging",
        "category": "Keyword",
        "description": "Automated recalculation of depreciation, interest accruals, and debtor aging schedules."
      },
      {
        "keyword": "Limit Violations & Cut-off",
        "category": "Keyword",
        "description": "Transactions exceeding authorized credit limits and post-year-end entries."
      }
    ],
    "shortSuggestedAnswer": "\u2022 8 Practical Audit Tests Performed using CAATs:\n  1. Identification of Duplicate Transactions:\n     - Running query scripts to identify duplicate vendor invoices, duplicate payroll payments, or identical refund checks matching same vendor code, date, and amount.\n  2. Sequence & Completeness Testing (Gap Analysis):\n     - Testing numerical continuity of sales invoices, purchase orders, goods receipt notes (GRN), and payment vouchers to detect missing numbers or unrecorded transactions.\n  3. Analysis of Negative & Anomalous Balances:\n     - Extracting abnormal balances such as negative inventory quantities, credit balances in trade receivables, or debit balances in accounts payable.\n  4. Recalculation & Re-computation:\n     - Automated independent recalculation of complex math across 100% data: depreciation amortizations, interest calculations on loans, tax deductions (TDS), and foreign exchange restatements.\n  5. Aging Analysis of Receivables & Inventory:\n     - Automated generation and verification of accounts receivable aging buckets (e.g. > 180 days, > 3 years) and slow-moving/obsolete inventory items.\n  6. Authorization Limit Violations:\n     - Extracting transactions where approval limits or credit limits were bypassed, or orders approved by unauthorized personnel.\n  7. Stratification & Sample Selection:\n     - Stratifying transactions by monetary value, risk category, or location, and selecting statistically valid random samples.\n  8. Cut-off Testing:\n     - Querying sales, purchases, inventory movements, and returns recorded 5-10 days immediately before and after the financial year-end to verify proper accounting cut-off.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must clearly list 8 distinct practical tests performed via CAATs (duplicates, gap analysis, negative balances, re-computation, aging, limits, stratification, cut-off).",
      "criticalMisses": [
        "Providing fewer than 8 tests.",
        "Vague generic statements instead of specific audit tests."
      ],
      "suggestions": [
        "Group into substantive testing, control testing, and analytical procedures."
      ]
    }
  },
  {
    "id": "aud_th_12_tyu3",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Robotic Process Automation (RPA) in Hiring Process - Steps & 8 Benefits",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Test Your Understanding 3",
    "question": "A company is considering deploying Robotic Process Automation (RPA) in its hiring process. State the tentative steps involved and describe any 8 benefits of implementing RPA.",
    "keyConcepts": [
      {
        "keyword": "Robotic Process Automation (RPA)",
        "category": "Keyword",
        "description": "Software robots automating rule-based, repetitive manual tasks without human intervention."
      },
      {
        "keyword": "RPA Hiring Steps",
        "category": "Provision",
        "description": "Resume parsing, applicant screening, interview scheduling, offer letter generation, onboarding background checks."
      },
      {
        "keyword": "8 Benefits of RPA",
        "category": "Keyword",
        "description": "Zero manual errors, 24/7 availability, speed/efficiency, cost reduction, audit trail, scalability, compliance, employee satisfaction."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Tentative Steps in RPA Deployment for Hiring:\n  1. Application Intake & Parsing: Bot extracts candidate details from emails, job portals, and uploaded resumes.\n  2. Rule-Based Screening: Bot filters applicants against predefined criteria (qualifications, experience, skill keywords).\n  3. Automated Communication: Bot issues acknowledgement emails and sends assessment test links.\n  4. Interview Scheduling: Bot syncs candidate availability with interviewer calendar slots and issues calendar invites.\n  5. Documentation & Verification: Bot triggers automated background checks, collects identity proofs, and flags discrepancies.\n  6. Offer Generation & Onboarding: Bot populates standard offer letter templates and initiates IT asset provisioning.\n\n\u2022 8 Tangible Benefits of Implementing RPA:\n  1. Elimination of Human Errors: Bots execute rule-based logic identically every time, eliminating transcription and data-entry errors.\n  2. 24/7/365 Operational Availability: Bots operate continuously without fatigue, sick leave, or holiday interruptions.\n  3. Accelerated Processing Speed: Reduces cycle times from days to minutes, expediting hiring turnarounds.\n  4. Substantial Cost Reduction: Lowers operational overhead by automating high-volume routine administrative labor.\n  5. Complete Audit Trail & Logging: Every single transaction step, timestamp, and decision rule is digitally logged, facilitating audit scrutiny.\n  6. Infinite Scalability: System effortlessly handles seasonal surges in applications without hiring temporary HR staff.\n  7. Regulatory & Policy Compliance: Strictly enforces organizational hiring policies, quota rules, and documentation standards.\n  8. Enhanced Strategic Focus: Frees up HR professionals from mundane data-entry to focus on high-value human interviews and culture fit.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires two distinct parts: logical flow of RPA hiring steps and enumeration of 8 distinct enterprise benefits.",
      "criticalMisses": [
        "Failing to outline the hiring process steps.",
        "Listing fewer than 8 distinct benefits."
      ],
      "suggestions": [
        "Emphasize the automated audit trail benefit as highly relevant to audit assurance."
      ]
    }
  },
  {
    "id": "aud_th_12_q1",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Digital Auditing - Advantages and Challenges for the Auditor",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 1",
    "question": "Discuss the advantages and challenges of \u201cauditing digitally\u201d for a professional accountant.",
    "keyConcepts": [
      {
        "keyword": "Digital Auditing Advantages",
        "category": "Keyword",
        "description": "100% population testing, automated anomaly detection, speed, enhanced audit quality, visual dashboards."
      },
      {
        "keyword": "Digital Auditing Challenges",
        "category": "Keyword",
        "description": "Data privacy/security risks, complex ERP interfaces, lack of standardized data, audit team reskilling, black-box algorithms."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Advantages of Auditing Digitally:\n  1. 100% Data Testing vs Sampling: Eliminates sampling risk by analyzing entire populations of millions of transactions instantly.\n  2. Enhanced Anomaly & Fraud Detection: Advanced analytics pinpoint complex fraud patterns, outliers, and segregation of duty violations.\n  3. Increased Audit Speed & Efficiency: Routine calculation and extraction tasks are automated, allowing auditors to focus on professional judgment.\n  4. Real-Time & Continuous Auditing: Shift from retrospective year-end verification to ongoing, continuous assurance.\n  5. Powerful Data Visualization: Interactive dashboards communicate risk profiles clearly to management and audit committees.\n\n\u2022 Challenges of Auditing Digitally:\n  1. Data Integrity & Cleansing Hurdle: Inconsistent formats, incomplete records, and corrupt source data require extensive cleansing time.\n  2. Data Confidentiality & Cyber Risks: Handling sensitive client data exposes audit firms to cyber breaches and privacy law liabilities.\n  3. Black-Box Complexities in AI/Algorithms: Lack of algorithmic transparency makes it difficult to validate decision logic and model bias.\n  4. High Technology Investment Costs: Significant capital expenditure required for specialized audit software, infrastructure, and licenses.\n  5. Skills & Reskilling Deficit: Traditional audit staff require extensive training in data science, SQL, Python, and ERP architectures.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on balanced coverage of both operational advantages (100% population testing, speed) and modern challenges (cyber risk, skill gap, black-box AI).",
      "criticalMisses": [
        "Discussing only advantages while omitting challenges.",
        "Generic IT statements rather than audit-specific advantages."
      ],
      "suggestions": [
        "Contrast 100% population testing with classical audit sampling."
      ]
    }
  },
  {
    "id": "aud_th_12_q2",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Stages in Understanding the IT Environment & Key Auditor Considerations",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 2",
    "question": "State the stages in understanding the IT environment of an entity. What are the key considerations for an auditor while gaining this understanding?",
    "keyConcepts": [
      {
        "keyword": "3 Stages in IT Understanding",
        "category": "Keyword",
        "description": "Understand the IT Environment -> Identify IT Applications and Dependencies -> Assess IT Risks and Controls."
      },
      {
        "keyword": "Key Considerations",
        "category": "Provision",
        "description": "Complexity of IT architecture, degree of automated controls, data flows, use of cloud/third-party service organizations, volume of digital transactions."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Three Systematic Stages in Understanding IT Environment:\n  1. Stage 1 - Understand the IT Environment:\n     - Understand entity\u2019s IT infrastructure, organizational IT governance, network architecture, operating systems, and databases.\n  2. Stage 2 - Identify IT Applications & Dependencies:\n     - Identify specific in-scope financial business applications (e.g. ERP, billing, payroll), interfaces, and system-generated reports.\n  3. Stage 3 - Assess IT Risks & Controls:\n     - Identify risks arising from IT (unauthorized changes, security vulnerabilities) and evaluate General IT Controls (GITCs) and Automated Application Controls.\n\n\u2022 Key Auditor Considerations while Gaining Understanding:\n  - Complexity of IT Structure: Whether the entity uses off-the-shelf software or highly customized ERP systems.\n  - Extent of Automated Processing: Degree to which routine transactions are processed automatically without manual intervention.\n  - Cloud Computing & Service Organizations: Reliance on third-party cloud providers (SaaS/IaaS) requiring SOC 1 / SAE 3402 reports.\n  - Data Interfacing & Migration: Existence of manual or automated bridges between disparate sub-systems.\n  - IT Governance & Policies: Tone at the top, IT organizational chart, security certifications (ISO 27001), and change management rigor.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must detail the 3 sequential stages and articulate key evaluation considerations for the auditor.",
      "criticalMisses": [
        "Omission of the 3 structured stages.",
        "Ignoring third-party service organizations / SOC reports."
      ],
      "suggestions": [
        "Align stages with SA 315 (Revised) requirements for understanding the IT environment."
      ]
    }
  },
  {
    "id": "aud_th_12_q3",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Types of IT Dependencies Relevant to the Auditor",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 3",
    "question": "Describe the different types of IT dependencies that an auditor encounters while evaluating automated accounting systems.",
    "keyConcepts": [
      {
        "keyword": "IT Dependencies",
        "category": "Keyword",
        "description": "Areas where financial reporting relies on the effective operation of IT systems."
      },
      {
        "keyword": "Automated Application Controls",
        "category": "Provision",
        "description": "System-enforced validations such as 3-way match, credit limit blocks, input checks."
      },
      {
        "keyword": "System-Generated Reports (IPE)",
        "category": "Keyword",
        "description": "Information Produced by the Entity used as audit evidence (debtor aging, inventory listings)."
      },
      {
        "keyword": "Automated Calculations",
        "category": "Provision",
        "description": "Automated interest accruals, depreciation runs, tax computations, currency revaluations."
      },
      {
        "keyword": "Security & Segregation of Duties",
        "category": "Rule",
        "description": "User access permissions preventing incompatible duties and unauthorized changes."
      },
      {
        "keyword": "Automated Interfaces",
        "category": "Keyword",
        "description": "Data transmission scripts and API pipelines transferring data between disparate systems."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Core Types of IT Dependencies:\n  1. Automated Application Controls:\n     - Configured automated rules within applications that prevent or detect misstatements (e.g. mandatory automated 3-way matching of PO, GRN, and Vendor Invoice; automated credit-limit blocking).\n  2. System-Generated Reports (Information Produced by Entity - IPE):\n     - Reports extracted from systems used by management for controls or relied upon by auditors as audit evidence (e.g. debtor aging reports, inventory valuation listings, payroll registers). Completeness and accuracy depend on IT.\n  3. Automated Calculations & Algorithms:\n     - Automated complex mathematical computations executed by system logic without human intervention (e.g. automated straight-line depreciation runs, foreign exchange revaluations, EIR amortization).\n  4. System Security & Segregation of Duties (SoD):\n     - Access controls and role permissions configured in ERPs ensuring users cannot perform conflicting functions (e.g. initiating and approving vendor payments).\n  5. Automated Interfaces & Bridges:\n     - System scripts, middleware, or APIs that transfer financial data automatically between different systems (e.g. POS system to central ERP ledger).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on naming and explaining the 5 fundamental IT dependencies (automated controls, IPE reports, calculations, SoD/security, interfaces).",
      "criticalMisses": [
        "Failing to explain IPE (System-Generated Reports).",
        "Omitting automated interfaces."
      ],
      "suggestions": [
        "Provide concrete accounting examples for each dependency type."
      ]
    }
  },
  {
    "id": "aud_th_12_q4",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Cyber Risks - Nature, Anatomy, and Specific Forms of Attack Vectors",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 4",
    "question": "Explain the concept of \u201ccyber risk\u201d. Discuss its various forms and vectors including Malware, DoS, Phishing varieties, Spoofing, Insider Threats, DNS Tunneling, and IoT vulnerabilities.",
    "keyConcepts": [
      {
        "keyword": "Cyber Risk Definition",
        "category": "Keyword",
        "description": "Risk of financial loss, operational disruption, or reputational damage from unauthorized access/attack on digital assets."
      },
      {
        "keyword": "Malware & Ransomware",
        "category": "Keyword",
        "description": "Malicious software encrypting data or creating backdoors."
      },
      {
        "keyword": "Denial of Service (DoS/DDoS)",
        "category": "Keyword",
        "description": "Flooding network servers with fake requests to paralyze business availability."
      },
      {
        "keyword": "Phishing Variants",
        "category": "Keyword",
        "description": "Spear phishing (targeted), Whaling (C-suite), Smishing (SMS), Vishing (voice call)."
      },
      {
        "keyword": "Spoofing & Man-in-the-Middle",
        "category": "Keyword",
        "description": "Impersonating trusted IP addresses or communication nodes to intercept funds."
      },
      {
        "keyword": "Insider Threats & DNS Tunneling",
        "category": "Keyword",
        "description": "Malicious internal employees and exfiltrating data disguised in DNS queries."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Definition of Cyber Risk:\n  - Cyber risk refers to the probability of exposure, financial loss, operational paralysis, or reputational damage resulting from cyber attacks, unauthorized access, data breaches, or system failures within an entity's digital ecosystem.\n\n\u2022 Core Attack Forms & Vectors:\n  1. Malware & Ransomware: Malicious code (trojans, viruses, worms) designed to damage systems or encrypt sensitive databases, extorting ransom payments for decryption keys.\n  2. Denial of Service (DoS / DDoS): Overwhelming company servers or network pipelines with millions of artificial traffic requests, crashing public sites and paralyzing e-commerce operations.\n  3. Phishing Varieties:\n     \u2022 Standard Phishing: Fraudulent mass emails tricking staff into disclosing login credentials.\n     \u2022 Spear Phishing: Highly personalized fraudulent emails targeted at specific employees.\n     \u2022 Whaling: Targeted attacks directed specifically at senior executives (CEO/CFO).\n     \u2022 Smishing & Vishing: Attacks executed via SMS text messages or voice telephone calls.\n  4. Spoofing: Forging IP addresses, domain names, or email headers to disguise as a trusted business partner or executive to divert wire payments.\n  5. Insider Threats: Current or former employees abusing authorized system access to exfiltrate proprietary data, steal funds, or sabotage databases.\n  6. DNS Tunneling: Advanced cyber technique routing non-DNS data through DNS port 53 to bypass firewalls and stealthily exfiltrate sensitive customer/financial data.\n  7. Internet of Things (IoT) Exploits: Breaching unsecured smart connected hardware (smart meters, industrial sensors) to gain entry into core corporate accounting networks.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires comprehensive explanation of cyber risk concept followed by precise technical delineation of the 7 specified attack vectors.",
      "criticalMisses": [
        "Failing to distinguish spear phishing from whaling.",
        "Omission of DNS Tunneling or IoT exploits."
      ],
      "suggestions": [
        "Structure each attack vector with a definition and audit consequence."
      ]
    }
  },
  {
    "id": "aud_th_12_q5",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Cybersecurity Framework - Core Functions (Identify, Protect, Detect, Respond, Recover)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 5",
    "question": "Describe the core functions of a recognized Cybersecurity Framework (such as NIST) that assist an entity in managing cybersecurity risks.",
    "keyConcepts": [
      {
        "keyword": "NIST Cybersecurity Framework",
        "category": "Standard",
        "description": "Five concurrent, continuous core functions for managing cybersecurity risks."
      },
      {
        "keyword": "Identify",
        "category": "Keyword",
        "description": "Develop organizational understanding to manage cybersecurity risk to systems, assets, data, and capabilities."
      },
      {
        "keyword": "Protect",
        "category": "Keyword",
        "description": "Develop and implement appropriate safeguards to ensure delivery of critical infrastructure services."
      },
      {
        "keyword": "Detect",
        "category": "Keyword",
        "description": "Develop and implement appropriate activities to identify occurrence of a cybersecurity event."
      },
      {
        "keyword": "Respond",
        "category": "Keyword",
        "description": "Develop and implement appropriate activities to take action regarding a detected cybersecurity incident."
      },
      {
        "keyword": "Recover",
        "category": "Keyword",
        "description": "Develop and implement appropriate activities to maintain plans for resilience and restore impaired services."
      }
    ],
    "shortSuggestedAnswer": "\u2022 The Five Core Functions of Cybersecurity Framework:\n\n  1. Identify (Asset & Risk Mapping):\n     - Understand the business context, critical digital assets, data inventory, and cybersecurity risks.\n     - Activities: Asset management, risk assessment, governance policies, supply chain risk management.\n\n  2. Protect (Defensive Safeguards):\n     - Deploy safeguards to contain or prevent the impact of potential cybersecurity events.\n     - Activities: Access control (MFA, least privilege), data security encryption, employee security awareness training, patch management.\n\n  3. Detect (Continuous Monitoring & Identification):\n     - Implement mechanisms to discover cyber events promptly.\n     - Activities: Intrusion detection systems (IDS/IPS), continuous network security monitoring, anomaly detection, Security Operations Center (SOC).\n\n  4. Respond (Incident Containment & Action):\n     - Execute actionable procedures once a cybersecurity event is detected.\n     - Activities: Incident response planning, containment of affected systems, root-cause forensic analysis, legal and regulatory notifications.\n\n  5. Recover (Restoration & Resilience):\n     - Execute plans to restore capabilities and services impaired by a cybersecurity incident.\n     - Activities: Disaster recovery execution, business continuity management, restoring from clean immutable backups, post-incident reviews.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on accurately naming and detailing all 5 NIST core functions: Identify, Protect, Detect, Respond, Recover.",
      "criticalMisses": [
        "Omitting any of the 5 functions.",
        "Confusing Detect with Respond."
      ],
      "suggestions": [
        "Present as a continuous risk-management lifecycle."
      ]
    }
  },
  {
    "id": "aud_th_12_q6",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Data Analytics in Audit - Meaning, Tools, and Applied Techniques",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 6",
    "question": "Explain the concept of \u201cData Analytics\u201d in the context of financial auditing. Mention various techniques and software tools used by modern auditors.",
    "keyConcepts": [
      {
        "keyword": "Audit Data Analytics (ADA)",
        "category": "Keyword",
        "description": "Science and art of discovering and analyzing patterns, identifying anomalies, and extracting useful information from audit data."
      },
      {
        "keyword": "Descriptive & Diagnostic Analytics",
        "category": "Keyword",
        "description": "Examining historical data to understand what happened and why."
      },
      {
        "keyword": "Predictive & Prescriptive Analytics",
        "category": "Keyword",
        "description": "Forecasting expected balances and recommending optimal testing paths."
      },
      {
        "keyword": "Software Tools",
        "category": "Keyword",
        "description": "ACL, IDEA, Alteryx, Power BI, Tableau, CaseWare, Python, SQL."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Concept of Audit Data Analytics (ADA):\n  - ADA is the application of data science, algorithmic querying, and statistical analysis to transform raw client datasets into high-quality audit evidence.\n  - It enables auditors to analyze 100% of transaction populations, unmask hidden relationships, and detect subtle anomalies that manual sampling cannot reveal.\n\n\u2022 Four Core Analytics Techniques in Auditing:\n  1. Descriptive Analytics: Summarizing past accounting transactions (e.g. ledger profiling, summary of sales by product line).\n  2. Diagnostic Analytics: Investigating root causes of anomalies (e.g. drill-down analysis of unapproved journal entries passed on weekends).\n  3. Predictive Analytics: Building statistical models based on historical trends to forecast benchmark balances (e.g. regression analysis on revenue).\n  4. Prescriptive Analytics: Suggesting specific audit procedures or risk responses based on automated risk scoring.\n\n\u2022 Common Specialized Tools Used by Modern Auditors:\n  - Specialized Audit Extraction Tools: ACL (Galvanize), IDEA (CaseWare).\n  - Data Wrangling & ETL Tools: Alteryx, Microsoft Power Query, KNIME.\n  - Data Visualization & Dashboarding: Microsoft Power BI, Tableau, Qlik Sense.\n  - Programming & Scripting Languages: Python (Pandas/NumPy), R, Structured Query Language (SQL).",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires definition of ADA, classification of analytics techniques (descriptive/diagnostic/predictive/prescriptive), and listing industry-standard tools.",
      "criticalMisses": [
        "Vague definition without mentioning 100% population analysis.",
        "Failure to name specific audit tools like ACL, IDEA, or Power BI."
      ],
      "suggestions": [
        "Highlight the shift from sample testing to full population profiling."
      ]
    }
  },
  {
    "id": "aud_th_12_q7",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Three Automated Tools (IoT, AI, Blockchain/RPA) - Risks and Audit Considerations",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 7",
    "question": "Select any three automated emerging tools/technologies used in modern business environments (e.g. IoT, Artificial Intelligence, Blockchain, RPA). Discuss their operational risks and key audit considerations for each.",
    "keyConcepts": [
      {
        "keyword": "Internet of Things (IoT)",
        "category": "Keyword",
        "description": "Sensors and devices generating real-time data directly fed into ERPs."
      },
      {
        "keyword": "Artificial Intelligence / Machine Learning",
        "category": "Keyword",
        "description": "Self-learning algorithms making autonomous accounting decisions."
      },
      {
        "keyword": "Robotic Process Automation (RPA)",
        "category": "Keyword",
        "description": "Software bots executing high-volume repetitive tasks."
      },
      {
        "keyword": "Audit Considerations",
        "category": "Provision",
        "description": "Validating sensor calibration, testing algorithmic bias/explainability, and reviewing bot change controls."
      }
    ],
    "shortSuggestedAnswer": "\u2022 1. Internet of Things (IoT):\n  - Operational Risks: Sensor malfunction, uncalibrated readings, physical tampering, cyber interception over unencrypted wireless protocols.\n  - Audit Considerations:\n    \u2022 Test physical controls and digital authentication of IoT devices;\n    \u2022 Verify automated data transmission pipelines from sensors to ERP general ledger;\n    \u2022 Perform substantive physical counts to validate sensor-generated inventory quantities.\n\n\u2022 2. Artificial Intelligence (AI) & Machine Learning (ML):\n  - Operational Risks: \"Black-box\" lack of algorithmic explainability, training data bias leading to flawed credit ratings or provisions, concept drift over time.\n  - Audit Considerations:\n    \u2022 Inquire into governance frameworks around AI model development and approval;\n    \u2022 Test data integrity of training datasets used by the algorithm;\n    \u2022 Evaluate whether management periodically monitors model drift and back-tests predictive outputs against actual outcomes.\n\n\u2022 3. Robotic Process Automation (RPA):\n  - Operational Risks: Hardcoded bot logic errors replicated across millions of transactions, unmonitored script updates, bot credential abuse.\n  - Audit Considerations:\n    \u2022 Audit General IT Controls over bot script change management and testing;\n    \u2022 Review segregation of duties and access permissions assigned to bot IDs;\n    \u2022 Test bot exception handling logs to ensure rejected items are promptly reviewed by human supervisors.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on structured breakdown of 3 technologies covering description, specific operational risks, and precise audit testing responses.",
      "criticalMisses": [
        "Covering fewer than three technologies.",
        "Omitting audit considerations."
      ],
      "suggestions": [
        "Contrast RPA rule-based logic with AI probabilistic logic."
      ]
    }
  },
  {
    "id": "aud_th_12_q8",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Technological Risks of Digital Systems & Corresponding Control Considerations",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 8",
    "question": "What are the primary technological risks inherent in digital accounting systems? What control considerations should be evaluated by the auditor to mitigate these risks?",
    "keyConcepts": [
      {
        "keyword": "Technological Risks",
        "category": "Keyword",
        "description": "Unauthorized access, unauthorized program changes, failure to make necessary updates, manual override, data loss."
      },
      {
        "keyword": "General IT Controls (GITCs)",
        "category": "Standard",
        "description": "Manage Access, Manage Program Changes, Manage Operations."
      },
      {
        "keyword": "Control Considerations",
        "category": "Provision",
        "description": "Multi-Factor Authentication (MFA), role-based access, segregation of duties, change testing/signoff, immutable backups."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Primary Technological Risks:\n  1. Unauthorized Data & System Access: Risk of unauthorized modifications to accounting masters, customer balances, or fraudulent payment disbursement.\n  2. Unauthorized Program Changes: Developers moving code directly into production environments without testing or user sign-off.\n  3. Failure to Implement Necessary Patches/Updates: Systems remaining exposed to zero-day vulnerabilities and cyber exploits.\n  4. Manual System Overrides: Privileged super-users bypassing automated application controls to force entries.\n  5. Inadequate Backups & Data Loss: Corruption or loss of financial logs without tested disaster recovery capabilities.\n\n\u2022 Auditor Control Considerations:\n  1. Logical Access Controls:\n     - Enforce Multi-Factor Authentication (MFA), principle of least privilege, periodic user access recertification, and strict segregation of duties (SoD).\n  2. Change Management Rigor:\n     - Formal approval, segregation between development and production environments, mandatory peer review, and user acceptance testing (UAT) sign-offs.\n  3. IT Operations & Incident Monitoring:\n     - Automated batch job scheduling logs, continuous monitoring of failed backup jobs, and real-time security alerting.\n  4. Business Continuity & Disaster Recovery:\n     - Testing frequency of disaster recovery failovers and verifying offsite immutable backups.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires clear pairing of technological risks with specific GITC control mitigating actions.",
      "criticalMisses": [
        "Generic IT statements lacking audit control terminology.",
        "Failing to mention change management or privileged access."
      ],
      "suggestions": [
        "Organize under GITC pillars: Access, Changes, Operations."
      ]
    }
  },
  {
    "id": "aud_th_12_q9",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Emerging Technologies for Next Generation Audit & Their Inherent Risks",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 9",
    "question": "Discuss emerging technologies that are shaping \u201cNext Generation Audit\u201d (e.g. Drones, Augmented Reality / Virtual Reality, Metaverse, Smart Contracts / Blockchain) and describe the risks associated with their deployment.",
    "keyConcepts": [
      {
        "keyword": "Next Generation Audit Technologies",
        "category": "Keyword",
        "description": "Drones for physical inspection, AR/VR for remote walkthroughs, Metaverse virtual audits, Blockchain smart contracts."
      },
      {
        "keyword": "Drones",
        "category": "Keyword",
        "description": "Aerial volumetric measurement of mine pits, timber yards, crop fields."
      },
      {
        "keyword": "AR / VR",
        "category": "Keyword",
        "description": "Remote inventory observation and asset inspection in hazardous locations."
      },
      {
        "keyword": "Blockchain / Smart Contracts",
        "category": "Keyword",
        "description": "Automated ledger execution and triple-entry bookkeeping."
      },
      {
        "keyword": "Associated Risks",
        "category": "Provision",
        "description": "Regulatory airspace restrictions, sensor calibration drift, virtual identity spoofing, code immutability bugs."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Next Generation Audit Technologies & Associated Risks:\n\n  1. Drones (Unmanned Aerial Vehicles - UAVs):\n     - Audit Use: Aerial photogrammetry and LiDAR scanning for physical inventory inspection of large-scale stockpiles (mining coal heaps, timber yards, infrastructure projects).\n     - Associated Risks: Drone sensor calibration drift, airspace regulatory bans, weather limitations, risk of image manipulation without cryptographic timestamping.\n\n  2. Augmented Reality (AR) & Virtual Reality (VR):\n     - Audit Use: Immersive remote walkthroughs of factories, remote inspection of machinery tags, and virtual guided plant tours without physical travel.\n     - Associated Risks: Limited sensory verification (cannot touch or smell defects), digital feed tampering/lag, technical failure of headsets in remote locations.\n\n  3. Metaverse Virtual Collaboration:\n     - Audit Use: Collaborative digital twin environments where global audit teams inspect 3D digital replicas of production facilities and hold virtual audit committee meetings.\n     - Associated Risks: Digital avatar spoofing, lack of jurisdiction/regulatory frameworks, virtual data security breaches.\n\n  4. Smart Contracts & Private Blockchains:\n     - Audit Use: Self-executing digital contracts on distributed ledgers that automate transaction settlement and recording (triple-entry accounting).\n     - Associated Risks: Code vulnerabilities in smart contracts (DAO-type exploits), immutability preventing error reversal, 51% consensus attacks, off-chain data oracle tampering.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must present futuristic audit tools (drones, AR/VR, Metaverse, Blockchain) and specify realistic operational and evidence-reliability risks.",
      "criticalMisses": [
        "Describing technology without explaining audit application.",
        "Omitting associated audit risks."
      ],
      "suggestions": [
        "Cite inventory verification under SA 501 for drones."
      ]
    }
  },
  {
    "id": "aud_th_12_q10",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Remote Auditing - Planning, Security, and Feasibility Considerations (CA Kabir)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 10",
    "question": "CA Kabir is planning to conduct a remote audit of a technology company spread across five overseas locations. What critical factors must he evaluate regarding feasibility, data security, confidentiality, and risk assessment prior to executing the remote audit?",
    "keyConcepts": [
      {
        "keyword": "Remote Auditing",
        "category": "Keyword",
        "description": "Conducting audit procedures away from physical client premises using ICT tools."
      },
      {
        "keyword": "Feasibility & Infrastructure",
        "category": "Provision",
        "description": "Bandwidth stability, cloud repository accessibility, digital document availability."
      },
      {
        "keyword": "Confidentiality & Data Protection",
        "category": "Rule",
        "description": "Encrypted channels (VPN), secure file transfer protocols (SFTP), adherence to cross-border data privacy laws."
      },
      {
        "keyword": "Risk Assessment & Fraud Skepticism",
        "category": "Standard",
        "description": "Increased risk of electronic document manipulation and lack of direct observation."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Critical Factors for CA Kabir's Remote Audit Evaluation:\n\n  1. Feasibility & Technology Infrastructure:\n     - Availability of reliable, high-speed internet bandwidth across all 5 overseas locations.\n     - Availability of enterprise cloud platforms for seamless digital workpaper sharing.\n     - Degree of digitization: Whether accounting records, contracts, and vouchers are 100% digital or paper-based.\n\n  2. Confidentiality & Data Security Protocols:\n     - Mandatory transmission of audit evidence over Virtual Private Networks (VPN) and Secure File Transfer Protocols (SFTP) with end-to-end encryption.\n     - Strict adherence to cross-border data transfer regulations and local privacy laws (e.g. GDPR, DPDP Act).\n     - Multi-factor authentication on all audit portals and secure destruction of local cache files after audit completion.\n\n  3. Heightened Risk Assessment & Skepticism over Electronic Evidence:\n     - Enhanced risk of electronic document fabrication or alteration (PDF editing, digital signature forgery).\n     - Requirement to perform independent external corroborations (direct bank API feeds, independent customer portal verifications).\n\n  4. Alternate Procedures for Physical Assets:\n     - Establishing protocols for remote inventory observation via high-definition live video feeds, geolocation-tagged photos, or engaging local secondary auditors.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on feasibility analysis, data encryption/cross-border privacy rules, skepticism towards electronic evidence, and inventory observation workarounds.",
      "criticalMisses": [
        "Ignoring cross-border data privacy regulations.",
        "Failing to mention risks of electronic document fabrication."
      ],
      "suggestions": [
        "Reference SA 500 requirements regarding the reliability of electronic audit evidence."
      ]
    }
  },
  {
    "id": "aud_th_12_q11",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Blockchain Technology - Common Risks and Probable Audit Implications",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 11",
    "question": "What are the common technological and governance risks associated with Blockchain systems, and what are their probable implications for the statutory auditor?",
    "keyConcepts": [
      {
        "keyword": "Blockchain Risks",
        "category": "Keyword",
        "description": "Private key management, smart contract bugs, consensus protocol vulnerabilities, oracle integrity, immutability."
      },
      {
        "keyword": "Private Key Loss/Theft",
        "category": "Keyword",
        "description": "Loss of private key results in permanent loss of digital assets; compromised key allows irrevocable theft."
      },
      {
        "keyword": "Smart Contract Vulnerabilities",
        "category": "Keyword",
        "description": "Flawed code logic executing unauthorized transfers automatically."
      },
      {
        "keyword": "Oracle Problem",
        "category": "Keyword",
        "description": "Inaccurate off-chain real-world data fed into the blockchain."
      },
      {
        "keyword": "Audit Implications",
        "category": "Provision",
        "description": "Shift from verifying ledger records to auditing smart contract code, cryptographic key custodianship, and consensus rules."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Common Blockchain Risks:\n  1. Private Key Management Risks: If cryptographic private keys are stolen or misplaced, the entity permanently loses access to underlying assets with zero recovery recourse.\n  2. Smart Contract Coding Vulnerabilities: Bugs, logic errors, or re-entrancy loopholes in immutable smart contract code can be exploited by hackers to drain liquidity pools.\n  3. The \"Oracle Problem\": Blockchain cannot verify off-chain real-world truth. If external data feeds (Oracles) provide falsified exchange rates or shipment statuses, the blockchain processes incorrect transactions flawlessly.\n  4. Regulatory & Legal Jurisdictional Uncertainty: Dispersed peer nodes across multiple countries create ambiguities regarding governing law and asset ownership.\n\n\u2022 Probable Audit Implications:\n  1. Blockchain Entry Does Not Equal Substantive Audit Proof: A recorded transaction on a blockchain proves consensus occurred, but does NOT prove whether the transaction was genuine, arms-length, or legally valid (management intent and economic substance still require SA 500 testing).\n  2. Audit of Code & Custodianship: Auditors must evaluate smart contract source code audits, Hardware Security Module (HSM) key storage, and multi-signature authorization controls.\n  3. Valuation & Classification Challenges: Auditing digital assets requires specialized procedures for valuation volatility, impairment testing, and rights and obligations assertions under Ind AS 109 / Ind AS 38.",
    "defaultRemarks": {
      "efficiencyReasoning": "Must explain technical blockchain risks (keys, smart contracts, oracles) and their audit implications (blockchain entry is not conclusive proof of business reality).",
      "criticalMisses": [
        "Assuming blockchain eliminates the need for financial auditing.",
        "Failing to explain the oracle risk."
      ],
      "suggestions": [
        "Emphasize that an immutable transaction can still be a fraudulent or unauthorized transaction."
      ]
    }
  },
  {
    "id": "aud_th_12_q12",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "IT Dependencies: System-Generated Reports and Automated Interfaces",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 12",
    "question": "Explain how IT dependencies arise from \u201cSystem-Generated Reports\u201d and \u201cAutomated Interfaces\u201d. Why are they critical in evaluating internal controls over financial reporting?",
    "keyConcepts": [
      {
        "keyword": "System-Generated Reports (IPE)",
        "category": "Keyword",
        "description": "Reports extracted from ERP databases used by management to execute manual controls or relied upon by auditors."
      },
      {
        "keyword": "Automated Interfaces",
        "category": "Keyword",
        "description": "Automated connections transmitting data between different sub-systems."
      },
      {
        "keyword": "Completeness & Accuracy Risks",
        "category": "Provision",
        "description": "Unchecked reports lead to flawed management reviews; corrupted interfaces drop batches or duplicate entries."
      },
      {
        "keyword": "ICFR Dependency",
        "category": "Rule",
        "description": "If underlying IT report or interface is untested, the management control relying on it is deemed ineffective."
      }
    ],
    "shortSuggestedAnswer": "\u2022 1. System-Generated Reports (Information Produced by Entity - IPE):\n  - How Dependency Arises:\n    \u2022 Management relies on computer-generated reports (e.g. debtor aging report, stock valuation summary, unbilled revenue register) to perform key manual monitoring and review controls.\n    \u2022 Auditors rely on these reports as substantive audit evidence.\n  - Why Critical for ICFR:\n    \u2022 If the underlying query logic, report parameters, or database tables are corrupted or untethered by General IT Controls (GITCs), the report output is incomplete or inaccurate.\n    \u2022 A management review control, even if meticulously signed off by the CFO, is legally DEFICIENT if the underlying report data was unverified.\n\n\u2022 2. Automated Interfaces:\n  - How Dependency Arises:\n    \u2022 Modern enterprises operate disparate software suites (e.g. Front-end POS or billing system interfaced with Back-end SAP ERP ledger).\n    \u2022 Automated scripts, middleware, or APIs transfer batched or real-time transactional records across platforms.\n  - Why Critical for ICFR:\n    \u2022 Interface failures lead to dropped transaction batches, duplicate entries, data truncation, or unmapped account codes.\n    \u2022 Auditors must test interface reconciliation controls (checksums, record counts, error queues) to ensure data integrity during transmission.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on explaining origin and ICFR criticality for both IPE reports and automated interfaces.",
      "criticalMisses": [
        "Failing to link report accuracy to management control validity.",
        "Omitting interface error queues / reconciliation controls."
      ],
      "suggestions": [
        "Use the term 'Information Produced by the Entity (IPE)' as per international practice."
      ]
    }
  },
  {
    "id": "aud_th_12_q13",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Internet of Things (IoT) Modernization - Components, Benefits, and Audit Strategy (Mr. Karan)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 13",
    "question": "Mr. Karan, CIO of a logistics and warehousing conglomerate, is modernizing operations using IoT (RFID tags, GPS tracking, temperature sensors). Outline the core architecture components, operational benefits, technology risks, and the auditor's testing strategy.",
    "keyConcepts": [
      {
        "keyword": "IoT Architecture",
        "category": "Keyword",
        "description": "Perception layer (sensors/RFID), Network layer (cellular/Wi-Fi), Edge/Cloud processing layer."
      },
      {
        "keyword": "Operational Benefits",
        "category": "Keyword",
        "description": "Real-time asset tracking, automated inventory counting, cold-chain spoilage prevention."
      },
      {
        "keyword": "Technology Risks",
        "category": "Keyword",
        "description": "Sensor failure, transmission packet loss, battery death, unencrypted wireless eavesdropping."
      },
      {
        "keyword": "Audit Strategy",
        "category": "Provision",
        "description": "Test device calibration, verify ERP ingestion middleware, inspect exception logs, perform physical sample validation."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Core Architecture Components:\n  1. Perception / Device Layer: Physical sensors, RFID tags, GPS trackers, temperature logging monitors attached to assets.\n  2. Network / Transmission Layer: Wireless gateways (Wi-Fi, 5G, LoRaWAN) transmitting telemetry data to cloud servers.\n  3. Processing / Application Layer: Middleware software parsing sensor data and updating ERP inventory/logistics ledgers in real-time.\n\n\u2022 Operational Benefits:\n  - Automated continuous stock tracking without manual barcode scanning.\n  - Instant temperature anomaly alerts preventing pharmaceutical or perishable food spoilage.\n  - Optimized fleet routes and accurate automated delivery confirmations.\n\n\u2022 Inherent Technology Risks:\n  - Sensor drift or hardware malfunction outputting erroneous inventory quantities.\n  - Data packet loss or latency during transmission leading to unrecorded stock movements.\n  - Security vulnerabilities: Hackers intercepting sensor transmissions to falsify delivery timestamps.\n\n\u2022 Auditor's Testing Strategy:\n  1. Test Physical & Logical Device Controls: Inspect maintenance logs and calibration certifications for IoT hardware.\n  2. Audit Automated Ingestion Controls: Verify that telemetry data flowing into SAP/Oracle is validated via automated checksums and boundary limits.\n  3. Physical Inspection (SA 501): Conduct independent physical sample counts of tagged inventory to corroborate IoT digital dashboard readings.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires complete four-part answer: components, benefits, risks, and auditor's testing response.",
      "criticalMisses": [
        "Omitting sensor calibration testing.",
        "Failing to connect IoT data to ERP accounting ledgers."
      ],
      "suggestions": [
        "Cite SA 501 for physical inventory verification."
      ]
    }
  },
  {
    "id": "aud_th_12_q14",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Technological Risks & Control Deficiencies at Gravity Ltd (Mr. Ravi's Case)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 14",
    "question": "Gravity Ltd implemented an integrated cloud ERP. Mr. Ravi, internal audit manager, observed that developers have administrative access to production databases, changes are deployed without user sign-offs, and batch processing errors are cleared manually by operators without supervisor reviews. Analyze the technological risks and prescribe essential control remediations.",
    "keyConcepts": [
      {
        "keyword": "Access Management Deficiency",
        "category": "Rule",
        "description": "Developers having production admin access violates segregation of environments."
      },
      {
        "keyword": "Change Management Deficiency",
        "category": "Rule",
        "description": "Deploying changes without UAT or sign-off risks corrupting system logic."
      },
      {
        "keyword": "IT Operations Deficiency",
        "category": "Rule",
        "description": "Unsupervised manual clearing of batch errors allows fraudulent data alteration."
      },
      {
        "keyword": "Control Remediations",
        "category": "Provision",
        "description": "Segregate Dev/Prod, implement automated change approvals, enforce independent log reviews."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Analysis of Deficiencies & Technological Risks:\n  1. Developer Access to Production (Manage Access):\n     - Risk: Developers can directly alter live financial tables, inject backdoors, or tamper with customer balances without leaving an audit trail. Complete breakdown of Segregation of Duties (SoD).\n  2. Deployments without Sign-offs (Manage Changes):\n     - Risk: Untested code updates can break automated application controls (e.g. disable mandatory credit checks), corrupt calculations, or cause system outages.\n  3. Unsupervised Manual Batch Error Clearing (Manage Operations):\n     - Risk: Operators can arbitrarily delete dropped invoice records or force unauthorized ledger entries without detection.\n\n\u2022 Prescribed Control Remediations:\n  1. Strict Segregation of Environments:\n     - Revoke all developer and administrator write-access to the live production database immediately. Enforce principle of least privilege and use privileged access management (PAM) solutions.\n  2. Formal Change Management Workflow:\n     - Implement mandatory staging in a separate UAT (User Acceptance Testing) environment. Require dual sign-off from business process owners before code release.\n  3. Supervised Error Handling & Logging:\n     - Restrict manual batch overrides; mandate automated error queue ticketing requiring independent finance supervisor review and sign-off for any rejected transaction clearing.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying all 3 distinct GITC breakdowns (Access, Changes, Operations) and prescribing standard enterprise remediation controls.",
      "criticalMisses": [
        "Failing to categorize risks under standard GITC domains.",
        "Omitting remediation for developer access to production."
      ],
      "suggestions": [
        "State that these findings represent material weaknesses in ICFR under Section 143(3)(i)."
      ]
    }
  },
  {
    "id": "aud_th_12_q15",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Remote Auditing - Conceptual Definition, Advantages, and Inherent Limitations",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 15",
    "question": "Define \u201cRemote Auditing\u201d. What are its key advantages and disadvantages in statutory audit engagements?",
    "keyConcepts": [
      {
        "keyword": "Remote Auditing Definition",
        "category": "Keyword",
        "description": "Execution of audit procedures offsite using information and communication technologies (ICT)."
      },
      {
        "keyword": "Remote Audit Advantages",
        "category": "Keyword",
        "description": "Travel cost elimination, access to global specialists, flexible scheduling, rapid electronic document retrieval."
      },
      {
        "keyword": "Remote Audit Disadvantages",
        "category": "Keyword",
        "description": "Lack of direct observation of body language/culture, electronic document manipulation risks, security leaks, virtual walkthrough limits."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Definition of Remote Auditing:\n  - Remote auditing refers to the process of obtaining sufficient appropriate audit evidence without physical presence at the auditee's site, leveraging Information and Communication Technologies (ICT) such as cloud document repositories, screen sharing, video conferencing, data analytics tools, and remote drone/camera feeds.\n\n\u2022 Key Advantages:\n  1. Significant Cost & Time Savings: Eliminates travel expenses, accommodation costs, and transit downtime for audit teams.\n  2. Access to Specialized Global Expertise: Allows technical experts (valuation, IT, tax specialists) to participate seamlessly in meetings worldwide.\n  3. Flexible Scheduling & Efficiency: Dynamic file access across time zones accelerates query resolution.\n  4. Reduced Workplace Disruption: Eliminates physical conference room crowding and logistical burdens for the client.\n\n\u2022 Key Disadvantages & Limitations:\n  1. Diminished Professional Skepticism: Absence of in-person face-to-face contact makes it difficult to read body language, observe workplace atmosphere, or detect management coercion.\n  2. Electronic Document Tampering Risks: Higher vulnerability to forged, edited, or manipulated electronic PDF documents.\n  3. Ineffective Observation of Physical Assets: Remote video feeds can be curated or restricted by management, limiting independent physical inventory inspection (SA 501).\n  4. Network & Security Vulnerabilities: Transmission of proprietary files over home or public networks exposes clients to cyber interception.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires precise definition and balanced contrast of cost/efficiency advantages versus skepticism and document forgery disadvantages.",
      "criticalMisses": [
        "Omitting the limitation on physical asset observation.",
        "Failing to mention risks of electronic document manipulation."
      ],
      "suggestions": [
        "Contrast remote observation with standard SA 501 physical verification."
      ]
    }
  },
  {
    "id": "aud_th_12_q16",
    "subjectId": "Audit",
    "chapterName": "Digital Auditing & Assurance",
    "title": "Understanding the IT Environment in an FMCG Multinational (MNC Limited)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 12 / Theoretical Question 16",
    "question": "MNC Limited is a nationwide FMCG conglomerate with 20 manufacturing plants, 50 warehouses, 5,000 distributors, and automated ERP links. As statutory auditor, outline the key functional areas you must investigate to obtain a comprehensive understanding of the entity's IT environment.",
    "keyConcepts": [
      {
        "keyword": "IT Infrastructure & Architecture",
        "category": "Keyword",
        "description": "Central ERP servers, cloud platforms, network links between plants and warehouses."
      },
      {
        "keyword": "Automated Business Cycles",
        "category": "Keyword",
        "description": "Order-to-Cash (O2C), Procure-to-Pay (P2P), and Inventory tracking automation."
      },
      {
        "keyword": "Interface Architecture",
        "category": "Keyword",
        "description": "B2B distributor portals and third-party logistics (3PL) automated data feeds."
      },
      {
        "keyword": "General IT Controls (GITCs)",
        "category": "Standard",
        "description": "User access governance, patch deployment, disaster recovery capabilities."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Key Functional Areas to Investigate:\n  1. Enterprise IT Architecture & Infrastructure:\n     - Mapping core ERP instances (e.g. SAP S/4HANA), database management systems, cloud hosting infrastructure, and WAN connectivity connecting 20 plants and 50 warehouses.\n  2. Order-to-Cash (O2C) Automated Application Controls:\n     - Investigating automated distributor order processing, electronic credit limit controls, automatic pricing and GST calculations, and automated electronic invoicing generation.\n  3. Procure-to-Pay (P2P) & Inventory Management Systems:\n     - Automated raw material procurement triggers, automated 3-way matching (PO, GRN, Vendor Bill), and real-time inventory tracking across distributed warehouses.\n  4. External Interfaces & Distributor Portals:\n     - Data security and batch reconciliation protocols governing API connections with 5,000 distributor portals and third-party logistics (3PL) systems.\n  5. General IT Controls (GITC) Governance:\n     - Formal evaluation of user provisioning and role administration (ensuring segregation of duties between sales and dispatch), change management workflows for custom code, and backup failover testing.\n  6. Cybersecurity & Business Continuity Planning:\n     - Assessing endpoint detection and response (EDR), firewall architectures, incident management history, and Disaster Recovery (DR) testing for high-volume billing continuity.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must address high-volume FMCG operational realities: distributed architecture, O2C/P2P automation, distributor interfaces, and GITC governance.",
      "criticalMisses": [
        "Generic IT statements without tailoring to FMCG distributed warehousing/distributor network.",
        "Omission of automated interfaces."
      ],
      "suggestions": [
        "Structure around the three core audit stages: Infrastructure, Core Business Cycles, and GITCs."
      ]
    }
  },
  {
    "id": "aud_th_18_tyu1",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Sustainability Reporting Definition & Multi-Stakeholder Benefits under GRI Framework",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Test Your Understanding 1",
    "question": "What is meant by \u201cSustainability Reporting\u201d? What are the expected benefits to an organization and its diverse stakeholders from adopting sustainability reporting frameworks like GRI?",
    "keyConcepts": [
      {
        "keyword": "Sustainability Reporting Definition",
        "category": "Keyword",
        "description": "Practice of measuring, disclosing, and being accountable to internal and external stakeholders for organizational performance towards sustainable development."
      },
      {
        "keyword": "Triple Bottom Line",
        "category": "Keyword",
        "description": "Economic, Environmental, and Social impacts (People, Planet, Profit)."
      },
      {
        "keyword": "Internal Enterprise Benefits",
        "category": "Provision",
        "description": "Enhanced risk management, operational cost savings through resource efficiency, talent retention, innovation."
      },
      {
        "keyword": "External Stakeholder Benefits",
        "category": "Provision",
        "description": "Enhanced transparency, lower cost of capital, investor trust, community goodwill, regulatory compliance."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Definition of Sustainability Reporting:\n  - Sustainability reporting is the formal practice by an organization of measuring, publicly disclosing, and being accountable to internal and external stakeholders for its performance towards the goal of sustainable development.\n  - It captures an entity's impacts across the \"Triple Bottom Line\" \u2014 Economic prosperity, Environmental stewardship, and Social equity.\n\n\u2022 Tangible Benefits of Sustainability Reporting:\n  1. Internal Enterprise Benefits:\n     - Identification of Emerging Risks & Opportunities: Illuminates resource scarcity, supply chain vulnerabilities, and regulatory shifts before they impact the bottom line.\n     - Operational Cost Savings: Drives energy conservation, waste minimization, and material recycling efficiencies.\n     - Enhanced Employee Morale & Talent Attraction: Attracts top-tier talent seeking purpose-driven employers.\n     - Long-Term Strategic Resilience: Aligns organizational strategy with global sustainability mega-trends.\n  2. External Stakeholder Benefits:\n     - Lower Cost of Capital & Access to Green Funding: ESG-compliant entities attract dedicated ESG mutual funds, green bonds, and sustainability-linked loans at favorable interest rates.\n     - Investor Trust & Brand Reputation: Mitigates risks of greenwashing through verified, standardized disclosures.\n     - Constructive Regulatory Engagement: Ensures proactive alignment with evolving mandates like SEBI BRSR and EU CSRD.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on clear definition (measuring, disclosing, accountability across triple bottom line) and structured bifurcation of internal vs external stakeholder benefits.",
      "criticalMisses": [
        "Failing to mention the triple bottom line (Economic, Environmental, Social).",
        "Omitting green capital and investor access benefits."
      ],
      "suggestions": [
        "Cite GRI (Global Reporting Initiative) as the pioneer standard setter."
      ]
    }
  },
  {
    "id": "aud_th_18_tyu2",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Integrated Reporting <IR> - Classification of Capitals at Trustworthy Industries",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Test Your Understanding 2",
    "question": "Trustworthy Industries highlighted two achievements in its annual report:\\n(a) Launched an innovative, user-friendly digital mobile application for customers with patented payment security software.\\n(b) Successfully provided primary healthcare and clean drinking water to 50,000 villagers in remote communities surrounding its main chemical plant.\\n\\nClassify each achievement under the relevant \u201cCapital\u201d of the International <IR> Framework and explain the underlying rationale.",
    "keyConcepts": [
      {
        "keyword": "International <IR> Framework",
        "category": "Standard",
        "description": "Framework articulating value creation across the Six Capitals."
      },
      {
        "keyword": "Intellectual Capital",
        "category": "Keyword",
        "description": "Organizational knowledge-based intangibles: software, patents, copyrights, licenses, systems, and protocols."
      },
      {
        "keyword": "Social and Relationship Capital",
        "category": "Keyword",
        "description": "Relationships within and between communities, stakeholder networks, brand trust, and social license to operate."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Classification under the International <IR> Framework:\n\n  1. Achievement (a) - Innovative Mobile App with Patented Security:\n     - Classification: INTELLECTUAL CAPITAL.\n     - Underlying Rationale:\n       \u2022 Intellectual capital includes organizational, knowledge-based intangibles such as intellectual property (patents, copyrights, trademarks), software applications, proprietary systems, algorithms, and digital procedures.\n       \u2022 A patented software application developed to optimize customer interface and cybersecurity directly enhances the company\u2019s intellectual asset base.\n\n  2. Achievement (b) - Healthcare & Clean Drinking Water for 50,000 Villagers:\n     - Classification: SOCIAL AND RELATIONSHIP CAPITAL.\n     - Underlying Rationale:\n       \u2022 Social and relationship capital encompasses the relationships within and between communities, stakeholder groups, networks, and the shared values and trust established with local populations.\n       \u2022 Investing in community health and essential drinking water infrastructure builds community goodwill, reinforces the entity's \"social license to operate\", and mitigates potential local stakeholder conflict.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires correct classification of (a) as Intellectual Capital and (b) as Social and Relationship Capital, backed by specific <IR> definitional rationale.",
      "criticalMisses": [
        "Misclassifying mobile app as Human Capital.",
        "Misclassifying village CSR as Human Capital instead of Social & Relationship Capital."
      ],
      "suggestions": [
        "Define the concept of 'Social License to Operate' for community CSR."
      ]
    }
  },
  {
    "id": "aud_th_18_case_q1",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Agrochemical Case Study [Q1] - BRSR Regulatory Mandate for Top 1000 Listed Entities",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Agrochemical Sector Case Study - Part 1",
    "question": "Explain the regulatory reporting framework governing Business Responsibility and Sustainability Reporting (BRSR) for the top 1000 listed entities in India under SEBI (LODR) Regulations, 2015. Detail the transition timeline and the structural division between Essential and Leadership indicators.",
    "keyConcepts": [
      {
        "keyword": "SEBI LODR Regulation 34(2)(f)",
        "category": "Rule",
        "description": "Mandatory inclusion of BRSR in annual reports of top 1000 listed entities by market capitalization."
      },
      {
        "keyword": "Transition Timeline",
        "category": "Rule",
        "description": "Voluntary for FY 2021-22; Mandatory from FY 2022-23 onwards."
      },
      {
        "keyword": "Essential Indicators (Mandatory)",
        "category": "Keyword",
        "description": "Baseline KPIs that every entity must report covering environmental metrics, workforce diversity, health & safety."
      },
      {
        "keyword": "Leadership Indicators (Voluntary)",
        "category": "Keyword",
        "description": "Aspirational metrics demonstrating higher sustainability maturity, life-cycle assessments, and supply chain ESG."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Regulatory Mandate under SEBI:\n  - Pursuant to Regulation 34(2)(f) of the SEBI (LODR) Regulations, 2015, the top 1,000 listed entities (determined by market capitalization as on 31st March of every financial year) are MANDATORILY required to include a Business Responsibility and Sustainability Report (BRSR) in their Annual Reports.\n\n\u2022 Transition Timeline:\n  - Financial Year 2021-22: Voluntary basis (to allow entities to establish reporting infrastructure).\n  - Financial Year 2022-23 onwards: STRICTLY MANDATORY for top 1000 listed companies.\n\n\u2022 Structural Division of Performance Indicators:\n  1. Essential Indicators (Mandatory for All In-Scope Entities):\n     - Baseline regulatory disclosures that the entity MUST disclose.\n     - Encompasses environmental data (Scope 1 and 2 GHG emissions, water withdrawal, hazardous waste), employee training hours, gender diversity, safety incidents, and customer complaints.\n  2. Leadership Indicators (Aspirational / Advanced):\n     - Disclosures that entities are encouraged to report to demonstrate advanced sustainability leadership.\n     - Covers Scope 3 emissions across supply chains, Life Cycle Assessments (LCA) of products, biodiversity conservation programs, and sustainable sourcing percentages.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on citing Regulation 34(2)(f), exact top 1000 threshold, FY 2022-23 mandatory effective date, and difference between Essential and Leadership indicators.",
      "criticalMisses": [
        "Failing to cite SEBI LODR Regulation 34(2)(f).",
        "Omitting the Essential vs Leadership indicator classification."
      ],
      "suggestions": [
        "State that market capitalization is benchmarked as on 31st March."
      ]
    }
  },
  {
    "id": "aud_th_18_case_q2",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Agrochemical Case Study [Q2] - Corporate Sustainability Adaptation by Company A",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Agrochemical Sector Case Study - Part 2",
    "question": "In the agrochemical sector case study, analyze the proactive strategic and operational steps taken by Company A to absorb stringent regulatory shifts (such as government bans on hazardous red/yellow label pesticides) in comparison to non-compliant competitors.",
    "keyConcepts": [
      {
        "keyword": "Regulatory Absorption Strategy",
        "category": "Keyword",
        "description": "Proactive product portfolio phase-out and R&D transition to bio-pesticides (green/blue labels)."
      },
      {
        "keyword": "Supply Chain Barcoding",
        "category": "Provision",
        "description": "Implementing QR/barcode serialization to prevent counterfeiting and ensure traceability."
      },
      {
        "keyword": "Worker Safety & Effluent Treatment",
        "category": "Provision",
        "description": "Zero Liquid Discharge (ZLD) plants and automated robotic chemical handling."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Strategic & Operational Steps Taken by Company A:\n\n  1. Proactive Product Portfolio Transformation:\n     - Anticipating government bans on extremely hazardous chemicals, Company A proactively phased out toxic red-label and yellow-label organophosphate pesticides.\n     - Heavy R&D investment in green-label and blue-label bio-pesticides, organic formulations, and botanical extracts with lower ecological toxicity.\n\n  2. Anti-Counterfeiting & End-to-End Serialization:\n     - Deployed unique QR codes and 2D barcoding on all packaging linked to a central cloud registry, preventing counterfeit substandard pesticides and ensuring supply chain traceability.\n\n  3. Environmental Management & Zero Liquid Discharge (ZLD):\n     - Upgraded manufacturing facilities with Zero Liquid Discharge (ZLD) effluent treatment systems, recycling 95%+ of industrial wastewater back into cooling towers.\n\n  4. Occupational Health & Farmer Stewardship:\n     - Automated high-risk chemical synthesis to eliminate direct human operator exposure.\n     - Conducted nationwide farmer training programs on safe spraying protocols and personal protective equipment (PPE) usage.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires specific case study points: phase-out of hazardous red/yellow labels, R&D in green alternatives, QR serialization, and ZLD effluent treatment.",
      "criticalMisses": [
        "Generic environmental points without agrochemical industry context.",
        "Omitting product portfolio reformulation."
      ],
      "suggestions": [
        "Highlight the transition from reactive compliance to proactive competitive advantage."
      ]
    }
  },
  {
    "id": "aud_th_18_case_q3",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Agrochemical Case Study [Q3] - Statutory Auditor Considerations (SA 250, SA 570 & Investigations)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Agrochemical Sector Case Study - Part 3",
    "question": "In the context of the agrochemical sector scenario, evaluate the statutory auditor's duties and reporting responsibilities regarding:\\n(a) Environmental non-compliance, regulatory bans, and CBI/CIB investigations under SA 250.\\n(b) Operational paralysis and license cancellations affecting Going Concern under SA 570 for Company B.",
    "keyConcepts": [
      {
        "keyword": "SA 250 Consideration of Laws and Regulations",
        "category": "Standard",
        "description": "Auditor responsibility to obtain audit evidence regarding compliance with environmental and chemical licensing laws."
      },
      {
        "keyword": "Reporting of Non-Compliance",
        "category": "Rule",
        "description": "Communicate to TCWG; evaluate financial statement provisions/contingencies; reporting under CARO Clause 3(vii)."
      },
      {
        "keyword": "SA 570 Going Concern Threat",
        "category": "Standard",
        "description": "Cancellation of key product licenses, plant closure orders, and massive environmental fines casting doubt on viability."
      },
      {
        "keyword": "Audit Opinion Impact",
        "category": "Provision",
        "description": "Adverse/Qualified opinion or Disclaimer if books seized and going concern assumption is inappropriate."
      }
    ],
    "shortSuggestedAnswer": "\u2022 (a) Auditor Responsibilities under SA 250 (Laws & Regulations) & CIB Investigations:\n  1. Obtaining Evidence of Compliance:\n     - Environmental legislation (Environment Protection Act, Insecticides Act) fundamentally governs agrochemical manufacturing licenses.\n     - Auditor must obtain audit evidence regarding compliance with environmental discharge norms and Central Insecticides Board (CIB) registration conditions.\n  2. Dealing with Investigations & Violations (Company B):\n     - Review show-cause notices, raid reports, and confiscation orders issued by regulatory agencies.\n     - Inquire of management and legal counsel regarding potential fines, criminal liabilities, and mandatory environmental remediation costs.\n     - Verify adequate provisioning for penalties under Ind AS 37 and evaluate disclosure in notes.\n     - Report statutory non-compliances under CARO 2020 Clause 3(vii) / 3(xi) if fraud or default is involved.\n\n\u2022 (b) Auditor Responsibilities under SA 570 (Going Concern) for Company B:\n  1. Identification of Significant Doubt:\n     - Severe events: regulatory product bans on 70%+ of Company B's portfolio, factory sealing by pollution control boards, and seizure of accounting records cast significant doubt on going concern.\n  2. Mitigating Plans Evaluation:\n     - Inquire if management has viable alternative products or court stay orders. If no feasible recovery plan exists, the going concern basis of accounting is INAPPROPRIATE.\n  3. Audit Reporting Impact:\n     - If financial statements are prepared on a going concern basis despite being inappropriate: Express an ADVERSE OPINION under SA 705.\n     - If books and records are seized and auditor cannot obtain sufficient appropriate evidence: Express a DISCLAIMER OF OPINION.",
    "defaultRemarks": {
      "efficiencyReasoning": "Comprehensive evaluation requiring simultaneous application of SA 250 (environmental laws), SA 570 (going concern assessment), and SA 705 (Adverse/Disclaimer audit opinion).",
      "criticalMisses": [
        "Failing to cite SA 250 and SA 570.",
        "Not concluding on the type of modified audit opinion (Adverse/Disclaimer)."
      ],
      "suggestions": [
        "Explicitly connect regulatory factory closures to the going concern basis of accounting."
      ]
    }
  },
  {
    "id": "aud_th_18_q1",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Mandatory Applicability of BRSR as per SEBI Circulars and Criteria",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 1",
    "question": "State the mandatory applicability provisions of Business Responsibility and Sustainability Reporting (BRSR) as prescribed by the Securities and Exchange Board of India (SEBI).",
    "keyConcepts": [
      {
        "keyword": "SEBI BRSR Circular",
        "category": "Rule",
        "description": "Circular dated May 10, 2021 making BRSR mandatory for top 1000 listed entities from FY 2022-23."
      },
      {
        "keyword": "Benchmark Metric",
        "category": "Rule",
        "description": "Top 1000 listed entities based on market capitalization as on 31st March."
      },
      {
        "keyword": "Annual Report Inclusion",
        "category": "Provision",
        "description": "BRSR must form an integral part of the Annual Report under Regulation 34(2)(f) of LODR."
      },
      {
        "keyword": "Voluntary Adoption",
        "category": "Provision",
        "description": "Entities beyond top 1000 can voluntarily adopt BRSR to attract ESG capital."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Statutory Provisions of BRSR Applicability under SEBI:\n\n  1. Benchmark Criterion:\n     - Applicability is determined based on MARKET CAPITALIZATION calculated as on 31st March of each financial year.\n     - Covers the TOP 1,000 listed entities on Indian stock exchanges (BSE / NSE).\n\n  2. Effective Transition Dates:\n     - FY 2021-22: Voluntary reporting permitted to establish systems.\n     - FY 2022-23 Onwards: STRICTLY MANDATORY for all top 1,000 listed entities.\n\n  3. Placement within Annual Report:\n     - As mandated by Regulation 34(2)(f) of SEBI (LODR) Regulations, 2015, the BRSR must form a distinct, integral part of the entity's Annual Report submitted to stock exchanges and shareholders.\n\n  4. Voluntary Permissibility for Other Entities:\n     - Listed entities outside the top 1000, unlisted companies, and SMEs can voluntarily adopt the BRSR format to communicate sustainability credentials to global investors and supply chain partners.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on citing top 1000 market cap threshold, FY 2022-23 mandatory date, and Regulation 34(2)(f) placement rules.",
      "criticalMisses": [
        "Stating net worth or turnover instead of market capitalization.",
        "Incorrect effective financial year."
      ],
      "suggestions": [
        "Clarify that market cap is measured as of 31st March."
      ]
    }
  },
  {
    "id": "aud_th_18_q2",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Nine Principles of National Guidelines on Responsible Business Conduct (NGRBC / BRSR)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 2",
    "question": "Enumerate the Nine Principles of the National Guidelines on Responsible Business Conduct (NGRBC) upon which the BRSR framework is structured. Briefly describe the core mandate of each principle.",
    "keyConcepts": [
      {
        "keyword": "Nine Principles of NGRBC",
        "category": "Standard",
        "description": "National Guidelines on Responsible Business Conduct issued by Ministry of Corporate Affairs."
      },
      {
        "keyword": "Principle 1: Ethics & Integrity",
        "category": "Keyword",
        "description": "Businesses should conduct and govern themselves with integrity in an ethical, transparent, and accountable manner."
      },
      {
        "keyword": "Principle 2: Sustainable Goods/Services",
        "category": "Keyword",
        "description": "Provide goods and services in a manner that is safe and contributes to sustainability throughout life cycle."
      },
      {
        "keyword": "Principle 3: Employee Well-being",
        "category": "Keyword",
        "description": "Promote well-being of all employees, including those in value chains."
      },
      {
        "keyword": "Principle 4: Stakeholder Responsiveness",
        "category": "Keyword",
        "description": "Respect interests of and be responsive to all stakeholders."
      },
      {
        "keyword": "Principle 5: Human Rights",
        "category": "Keyword",
        "description": "Respect and promote human rights across operations."
      },
      {
        "keyword": "Principle 6: Environment Protection",
        "category": "Keyword",
        "description": "Protect and make efforts to restore the environment."
      },
      {
        "keyword": "Principle 7: Responsible Public Policy",
        "category": "Keyword",
        "description": "Responsible and transparent engagement when influencing public policy."
      },
      {
        "keyword": "Principle 8: Inclusive Growth",
        "category": "Keyword",
        "description": "Promote inclusive growth and equitable development."
      },
      {
        "keyword": "Principle 9: Consumer Value",
        "category": "Keyword",
        "description": "Engage with and provide value to consumers in a responsible manner."
      }
    ],
    "shortSuggestedAnswer": "\u2022 The Nine Principles of NGRBC / BRSR Framework:\n\n  1. Principle 1 (Ethics, Transparency & Accountability):\n     - Businesses should conduct and govern themselves with integrity in a manner that is ethical, transparent, and accountable.\n  2. Principle 2 (Product Life Cycle Sustainability):\n     - Businesses should provide goods and services in a manner that is safe and contributes to sustainability throughout their entire life cycle.\n  3. Principle 3 (Employee Well-being & Safety):\n     - Businesses should respect and promote the well-being of all employees, including those in their value chains (fair wages, occupational health).\n  4. Principle 4 (Stakeholder Responsiveness):\n     - Businesses should respect the interests of, and be responsive to, all stakeholders (especially disadvantaged and vulnerable groups).\n  5. Principle 5 (Human Rights):\n     - Businesses should respect and promote human rights (anti-child labour, non-discrimination, safe working conditions).\n  6. Principle 6 (Environment Protection & Restoration):\n     - Businesses should respect, protect, and make continuous efforts to restore the environment (GHG reduction, water stewardship, waste circularity).\n  7. Principle 7 (Responsible Public & Regulatory Policy):\n     - Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is responsible and transparent.\n  8. Principle 8 (Inclusive Growth & Social Development):\n     - Businesses should promote inclusive growth and equitable development through CSR and community empowerment.\n  9. Principle 9 (Customer Value & Data Privacy):\n     - Businesses should engage with and provide value to their consumers in a responsible manner (fair labeling, data privacy, prompt grievance redressal).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on listing all 9 NGRBC principles with their exact thematic titles and statutory intents.",
      "criticalMisses": [
        "Omitting any of the 9 principles.",
        "Conflating Principle 3 (Employees) with Principle 5 (Human Rights)."
      ],
      "suggestions": [
        "Present in strict numerical order 1 to 9."
      ]
    }
  },
  {
    "id": "aud_th_18_q3",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Global Trends in Sustainability Reporting Frameworks (GRI, CDP, TCFD, ISSB)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 3",
    "question": "Outline the prominent global trends in sustainability reporting. Briefly describe key international bodies and frameworks: GRI, CDP, TCFD, and ISSB (IFRS S1 and S2).",
    "keyConcepts": [
      {
        "keyword": "Global Sustainability Convergence",
        "category": "Keyword",
        "description": "Consolidation of voluntary reporting standards into unified global baseline frameworks."
      },
      {
        "keyword": "Global Reporting Initiative (GRI)",
        "category": "Standard",
        "description": "Pioneer multi-stakeholder framework focusing on outward impact on economy, environment, and society."
      },
      {
        "keyword": "CDP (Carbon Disclosure Project)",
        "category": "Standard",
        "description": "Global environmental disclosure system for carbon, water, and forests."
      },
      {
        "keyword": "Task Force on Climate-related Financial Disclosures (TCFD)",
        "category": "Standard",
        "description": "Four pillars: Governance, Strategy, Risk Management, and Metrics & Targets."
      },
      {
        "keyword": "International Sustainability Standards Board (ISSB)",
        "category": "Standard",
        "description": "IFRS Foundation body issuing IFRS S1 (General Requirements) and IFRS S2 (Climate-related Disclosures)."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Global Trends in Sustainability Reporting:\n  - Shift from fragmented, voluntary disclosures to mandatory, standardized, and assured global statutory reporting.\n  - Convergence towards \"Double Materiality\" (impact materiality on the planet + financial materiality on enterprise value).\n\n\u2022 Key Global Bodies & Frameworks:\n  1. Global Reporting Initiative (GRI):\n     - The most widely used global multi-stakeholder sustainability reporting standard. Focuses on an organization's outward impacts on the economy, environment, and society.\n  2. CDP (formerly Carbon Disclosure Project):\n     - Global environmental reporting system where corporations disclose standardized metrics on greenhouse gas emissions, water security, and deforestation risks to global institutional investors.\n  3. Task Force on Climate-related Financial Disclosures (TCFD):\n     - Framework designed by the Financial Stability Board (FSB) to disclose financial risks of climate change across four core pillars: (1) Governance, (2) Strategy, (3) Risk Management, and (4) Metrics & Targets.\n  4. International Sustainability Standards Board (ISSB):\n     - Established by the IFRS Foundation to create a comprehensive global baseline of sustainability disclosures for capital markets:\n       \u2022 IFRS S1: General Requirements for Disclosure of Sustainability-related Financial Information.\n       \u2022 IFRS S2: Climate-related Disclosures (incorporating TCFD recommendations).",
    "defaultRemarks": {
      "efficiencyReasoning": "Must explain global convergence and describe GRI (impact materiality), CDP, TCFD (4 pillars), and ISSB (IFRS S1 & S2).",
      "criticalMisses": [
        "Failing to mention ISSB or IFRS S1/S2.",
        "Omitting the 4 pillars of TCFD."
      ],
      "suggestions": [
        "Contrast GRI outward impact with ISSB enterprise value creation focus."
      ]
    }
  },
  {
    "id": "aud_th_18_q4",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "The Six Capitals of the International Integrated Reporting <IR> Framework",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 4",
    "question": "Enumerate and explain the \u201cSix Capitals\u201d recognized under the International Integrated Reporting <IR> Framework.",
    "keyConcepts": [
      {
        "keyword": "International <IR> Framework",
        "category": "Standard",
        "description": "Value creation model based on the interplay of Six Capitals over short, medium, and long term."
      },
      {
        "keyword": "Financial Capital",
        "category": "Keyword",
        "description": "Pool of funds available: debt, equity, cash generated from operations."
      },
      {
        "keyword": "Manufactured Capital",
        "category": "Keyword",
        "description": "Physical objects created by man: buildings, plant, equipment, infrastructure."
      },
      {
        "keyword": "Intellectual Capital",
        "category": "Keyword",
        "description": "Knowledge-based intangibles: patents, software, systems, brand value."
      },
      {
        "keyword": "Human Capital",
        "category": "Keyword",
        "description": "People\u2019s competencies, capabilities, experience, motivation, health and safety."
      },
      {
        "keyword": "Social and Relationship Capital",
        "category": "Keyword",
        "description": "Institutions and relationships with communities, customer trust, shared values."
      },
      {
        "keyword": "Natural Capital",
        "category": "Keyword",
        "description": "Renewable and non-renewable environmental resources: clean air, water, land, minerals."
      }
    ],
    "shortSuggestedAnswer": "\u2022 The Six Capitals of Integrated Reporting <IR>:\n\n  1. Financial Capital:\n     - Pool of monetary funds available to an organization for use in production or service delivery, obtained through debt, equity, or generated through operational cash flows.\n\n  2. Manufactured Capital:\n     - Physical objects (as distinct from natural physical objects) created by humans and used in operations, including factories, plant machinery, logistics infrastructure, and office buildings.\n\n  3. Intellectual Capital:\n     - Organizational, knowledge-based intangibles, including intellectual property (patents, copyrights, software code, licenses), institutional tacit knowledge, and proprietary procedures.\n\n  4. Human Capital:\n     - The workforce\u2019s individual and collective competencies, technical capabilities, leadership skills, experience, innovation drive, and health and safety.\n\n  5. Social and Relationship Capital:\n     - The relationships within and between communities, customers, suppliers, and regulatory bodies; public brand trust, social license to operate, and collaborative goodwill.\n\n  6. Natural Capital:\n     - All renewable and non-renewable environmental stocks and ecosystems that provide goods and services supporting past, current, or future prosperity (e.g. water, atmosphere, fossil fuels, biodiversity, fertile land).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on accurately listing and defining all six capitals: Financial, Manufactured, Intellectual, Human, Social & Relationship, and Natural.",
      "criticalMisses": [
        "Omitting any of the six capitals.",
        "Confusing Manufactured Capital with Natural Capital."
      ],
      "suggestions": [
        "Explain that capitals increase, decrease, or transform through the organization's business activities."
      ]
    }
  },
  {
    "id": "aud_th_18_q5",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Methodology of Providing Assurance on BRSR (6-Stage Assurance Process)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 5",
    "question": "Describe the systematic methodology and stages involved when a professional accountant undertakes an engagement to provide assurance on a company's BRSR / ESG disclosures.",
    "keyConcepts": [
      {
        "keyword": "SSAE 3000 / SAE 3000",
        "category": "Standard",
        "description": "Assurance Engagements Other Than Audits or Reviews of Historical Financial Information."
      },
      {
        "keyword": "6 Stages of Assurance",
        "category": "Provision",
        "description": "Pre-engagement -> Planning & Risk Assessment -> Evaluating Internal Controls -> Evidence Gathering -> Evaluating Findings -> Reporting."
      },
      {
        "keyword": "Reasonable vs Limited Assurance",
        "category": "Provision",
        "description": "Level of assurance agreed upon with the entity."
      },
      {
        "keyword": "Criteria & Subject Matter",
        "category": "Keyword",
        "description": "BRSR Core attributes and specific quantitative KPIs."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Systematic 6-Stage Methodology for BRSR Assurance:\n\n  1. Stage 1: Pre-engagement & Acceptance:\n     - Determine competence, independence, and ethical standing under ICAI Code of Ethics.\n     - Evaluate suitability of criteria (BRSR Core / SEBI guidelines) and agree terms of engagement under SSAE 3000 / SAE 3000.\n     - Clarify level of assurance: Limited Assurance (negative conclusion) or Reasonable Assurance (positive opinion).\n\n  2. Stage 2: Planning & Risk Assessment:\n     - Obtain understanding of entity\u2019s ESG governance, materiality determination process, and boundaries.\n     - Assess risks of material misstatement in ESG KPIs (e.g. GHG emissions, water consumption, injury rates) arising from fraud or measurement uncertainty.\n\n  3. Stage 3: Evaluating ESG Internal Controls:\n     - Evaluate design and operating effectiveness of controls over ESG data capture, automated metering systems, manual spreadsheets, and approval workflows.\n\n  4. Stage 4: Substantive Evidence Gathering & Testing:\n     - Perform analytical procedures, recalculations (emission conversion factors), site visits to manufacturing plants, calibration testings of utility meters, and interviews with operational managers.\n\n  5. Stage 5: Evaluating Evidence & Misstatements:\n     - Quantify identified unadjusted ESG misstatements against materiality thresholds.\n     - Obtain written management representations regarding completeness and accuracy of sustainability metrics.\n\n  6. Stage 6: Formulating Conclusion & Issuing Assurance Report:\n     - Draft the independent assurance report in accordance with SSAE 3000.\n     - Express conclusion clearly: \"Nothing has come to our attention...\" (Limited) or \"In our opinion...\" (Reasonable).",
    "defaultRemarks": {
      "efficiencyReasoning": "Must present the 6 structured stages of assurance under SSAE 3000 / SAE 3000, detailing pre-engagement through reporting.",
      "criticalMisses": [
        "Failing to cite SSAE 3000 / SAE 3000.",
        "Omitting testing of emission conversion factors and meter calibrations."
      ],
      "suggestions": [
        "Contrast limited assurance wording with reasonable assurance wording."
      ]
    }
  },
  {
    "id": "aud_th_18_q6",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Auditor\u2019s Role Regarding ESG & Climate-Related Aspects in Financial Statement Audit",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 6",
    "question": "Even when not engaged for separate sustainability assurance, how must an independent auditor consider ESG and climate-related risks during the statutory audit of financial statements? Discuss with reference to SA 315, SA 250, SA 540, SA 570, and SA 720.",
    "keyConcepts": [
      {
        "keyword": "ESG in Financial Audit",
        "category": "Keyword",
        "description": "ESG risks impacting financial statement line items, provisions, and valuations."
      },
      {
        "keyword": "SA 315 (Revised)",
        "category": "Standard",
        "description": "Identifying climate change and carbon transition risks as business risks that may cause material misstatement."
      },
      {
        "keyword": "SA 540 (Revised)",
        "category": "Standard",
        "description": "Accounting estimates: asset impairment, accelerated depreciation, decommission/restoration liabilities."
      },
      {
        "keyword": "SA 250",
        "category": "Standard",
        "description": "Compliance with environmental laws and emissions caps."
      },
      {
        "keyword": "SA 570 (Revised)",
        "category": "Standard",
        "description": "Stranded assets, loss of regulatory licenses, and carbon penalties threatening going concern."
      },
      {
        "keyword": "SA 720 (Revised)",
        "category": "Standard",
        "description": "Auditor responsibility to read ESG reports included in Annual Report for material inconsistency with audited financial statements."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Statutory Auditor's Duties Regarding ESG under Standards on Auditing (SAs):\n\n  1. Risk Assessment under SA 315 (Revised):\n     - Auditor must identify whether physical climate risks (floods, cyclones) or transition risks (carbon taxes, phase-out of fossil fuels) represent business risks that result in material misstatements in financial statement assertions.\n\n  2. Auditing Accounting Estimates under SA 540 (Revised):\n     - Climate risks directly impact complex accounting estimates:\n       \u2022 Impairment of carbon-intensive plant & machinery (Ind AS 36);\n       \u2022 Shortened useful economic lives accelerating depreciation (Ind AS 16);\n       \u2022 Decommissioning, site restoration, and environmental cleanup provisions (Ind AS 37).\n\n  3. Consideration of Laws & Regulations under SA 250:\n     - Scrutinize compliance with mandatory environmental legislations, pollution emission caps, and carbon trading regulations. Unresolved violations require provisions or contingent liability disclosures.\n\n  4. Going Concern Assessment under SA 570 (Revised):\n     - Evaluate whether bans on single-use plastics, cancellation of mining permits, or stranded carbon assets cast significant doubt on the entity's ability to continue as a going concern.\n\n  5. Reading Other Information under SA 720 (Revised):\n     - The statutory auditor must read the BRSR and sustainability reports included in the Annual Report to identify whether there are any MATERIAL INCONSISTENCIES between ESG narrative claims and the audited financial statements (e.g. claiming massive green capex when no PPE additions appear in balance sheet).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on linking ESG to specific Standards on Auditing: SA 315 (risk assessment), SA 540 (impairment/estimates), SA 250 (environmental laws), SA 570 (going concern), and SA 720 (other information consistency).",
      "criticalMisses": [
        "Generic essay lacking specific SA citations.",
        "Omitting SA 720 material inconsistency scrutiny."
      ],
      "suggestions": [
        "Give specific examples: stranded asset impairment under Ind AS 36 and cleanup provisions under Ind AS 37."
      ]
    }
  },
  {
    "id": "aud_th_18_q7",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Public Policy Advocacy under Principle 7 of BRSR (CTO Limited Scenario)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 7",
    "question": "CTO Limited, a leading fintech and payment gateway company, is finalizing its BRSR under Principle 7 (Responsible Public & Regulatory Policy). The company actively participates in industrial chambers (FICCI/CII) and submitted white papers to the Ministry of Finance regarding the Digital Personal Data Protection (DPDP) Act and Digital Public Infrastructure (DPI).\\nAdvise CTO Limited on the reporting requirements under Principle 7, categorizing disclosures into Essential and Leadership indicators.",
    "keyConcepts": [
      {
        "keyword": "Principle 7: Public Policy",
        "category": "Keyword",
        "description": "Responsible and transparent engagement in influencing public and regulatory policy."
      },
      {
        "keyword": "Essential Indicator 1",
        "category": "Keyword",
        "description": "Affiliations with trade and industry chambers/associations."
      },
      {
        "keyword": "Essential Indicator 2",
        "category": "Keyword",
        "description": "Corrective actions taken for anticompetitive conduct."
      },
      {
        "keyword": "Leadership Indicator 1",
        "category": "Keyword",
        "description": "Details of public policy positions advocated, platforms used, and public availability."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Core Mandate of Principle 7:\n  - Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is responsible and transparent.\n\n\u2022 Specific Disclosures Required for CTO Limited:\n\n  1. Essential Indicators (Mandatory Disclosures):\n     - (a) Trade & Industry Chamber Affiliations:\n       \u2022 Number of trade and industry chambers/associations the company is a member of.\n       \u2022 Top 5 trade and industry associations/chambers the company is affiliated with (e.g. FICCI, CII, NASSCOM, Payments Council of India).\n     - (b) Anti-Competitive Conduct Disclosures:\n       \u2022 Details of any corrective actions taken on issues related to anti-competitive conduct by the entity, pursuant to orders from regulatory authorities (Competition Commission of India - CCI).\n\n  2. Leadership Indicators (Aspirational / Advanced Disclosures):\n     - Details of Public Policy Positions Advocated:\n       \u2022 Specific public policy topics on which white papers or representations were submitted (e.g. DPDP Act, Digital Public Infrastructure, UPI settlement frameworks).\n       \u2022 Method and platforms relied upon for advocacy (direct ministry delegations, industry chamber committees).\n       \u2022 Whether information is in the public domain and web links to the published white papers.\n       \u2022 Frequency of review of policy advocacy positions by the Board of Directors.",
    "defaultRemarks": {
      "efficiencyReasoning": "Candidate must divide Principle 7 into Essential (chamber affiliations, anti-competitive orders) and Leadership (details of policy submissions, public availability, board oversight).",
      "criticalMisses": [
        "Confusing Essential with Leadership indicators.",
        "Failing to mention anti-competitive conduct reporting under Essential."
      ],
      "suggestions": [
        "Apply specifically to the fintech scenario (DPDP Act, DPI)."
      ]
    }
  },
  {
    "id": "aud_th_18_q8",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Quantitative KPIs vs Qualitative Policies in ESG Reporting & Corporate Contribution to SDGs",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 8",
    "question": "Explain the symbiotic balance between \u201cQuantitative KPIs\u201d and \u201cQualitative Policies\u201d in ESG reporting. How does corporate ESG reporting drive measurable progress towards the United Nations Sustainable Development Goals (SDGs)?",
    "keyConcepts": [
      {
        "keyword": "Quantitative KPIs",
        "category": "Keyword",
        "description": "Auditable numerical metrics: metric tonnes CO2e, kilolitres water, gender ratio, accident frequency rates."
      },
      {
        "keyword": "Qualitative Policies",
        "category": "Keyword",
        "description": "Governance frameworks: whistle-blower policies, human rights codes, supplier codes of conduct, climate transition roadmaps."
      },
      {
        "keyword": "Symbiotic Balance",
        "category": "Provision",
        "description": "Policies define organizational commitment; quantitative KPIs provide auditable proof of performance."
      },
      {
        "keyword": "Linkage to UN SDGs",
        "category": "Keyword",
        "description": "SDG 6 (Clean Water), SDG 7 (Clean Energy), SDG 8 (Decent Work), SDG 12 (Responsible Consumption), SDG 13 (Climate Action)."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Symbiotic Balance: Quantitative KPIs vs Qualitative Policies:\n  1. Qualitative Policies (The \"Commitment & Governance\" Layer):\n     - Articulates board-approved values, operational boundaries, and ethical commitments (e.g. Anti-Bribery Policy, Human Rights Charter, Zero-Deforestation Policy, Net-Zero Transition Roadmap).\n     - Without qualitative policies, numbers lack strategic intent and ethical foundation.\n  2. Quantitative KPIs (The \"Auditable Proof\" Layer):\n     - Standardized numerical metrics providing measurable, year-on-year verifiable evidence of performance (e.g. Scope 1/2 GHG emissions in MT CO2e, megawatt-hours of renewable energy, female workforce percentage, Lost Time Injury Frequency Rate).\n     - Without quantitative KPIs, policies remain mere marketing rhetoric (\"greenwashing\").\n  3. The Symbiosis:\n     - Policies establish governance architecture; quantitative metrics hold management accountable through independent assurance.\n\n\u2022 Driving Corporate Progress towards UN SDGs:\n  - Alignment of BRSR with 17 Global Goals:\n    \u2022 Energy & Emission KPIs directly advance SDG 7 (Affordable & Clean Energy) and SDG 13 (Climate Action).\n    \u2022 Water conservation & ZLD metrics advance SDG 6 (Clean Water & Sanitation).\n    \u2022 Fair wage and diversity KPIs advance SDG 5 (Gender Equality) and SDG 8 (Decent Work & Economic Growth).\n    \u2022 Waste recycling and circular packaging metrics advance SDG 12 (Responsible Consumption & Production).",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on explaining the complementary interplay between qualitative governance policies and quantitative auditable KPIs, linked with specific UN SDGs.",
      "criticalMisses": [
        "Discussing only quantitative or only qualitative aspects.",
        "Failing to cite specific numbered SDGs (e.g. SDG 6, 7, 8, 12, 13)."
      ],
      "suggestions": [
        "Warn against greenwashing when policies lack quantitative backing."
      ]
    }
  },
  {
    "id": "aud_th_18_q9",
    "subjectId": "Audit",
    "chapterName": "Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance",
    "title": "Principle 1 of BRSR - Ethics, Transparency & Accountability at SU Limited",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 18 / Theoretical Question 9",
    "question": "SU Limited is preparing its first BRSR report. The Managing Director wants to understand the core elements required to be disclosed under Principle 1: \u201cBusinesses should conduct and govern themselves with integrity, and in a manner that is Ethical, Transparent and Accountable.\u201d Enumerate the mandatory Essential Indicators under Principle 1.",
    "keyConcepts": [
      {
        "keyword": "Principle 1 Essential Indicators",
        "category": "Keyword",
        "description": "Fines/penalties from regulatory authorities, anti-corruption training, conflict of interest, disciplinary actions."
      },
      {
        "keyword": "Anti-Corruption & Anti-Bribery Training",
        "category": "Keyword",
        "description": "Coverage of Board, Key Managerial Personnel (KMPs), employees, and value chain partners."
      },
      {
        "keyword": "Regulatory Penalties & Punishments",
        "category": "Keyword",
        "description": "Monetary and non-monetary actions by regulators/courts for corruption or unethical conduct."
      },
      {
        "keyword": "Conflict of Interest Complaints",
        "category": "Keyword",
        "description": "Number of complaints received regarding conflicts of interest of directors and KMPs."
      }
    ],
    "shortSuggestedAnswer": "\u2022 Core Mandatory Essential Indicators under Principle 1 for SU Limited:\n\n  1. Anti-Corruption & Anti-Bribery Training Coverage:\n     - Percentage of Board of Directors, Key Managerial Personnel (KMPs), employees, and workers covered by awareness programs on ethics, anti-corruption, and anti-bribery policies.\n     - Frequency and mode of conducting training programs during the financial year.\n\n  2. Details of Disciplinary Actions & Fines by Regulatory Authorities:\n     - Comprehensive details of fines, penalties, settlements, and punishments imposed on the entity, directors, or KMPs by regulators or courts for non-compliance with ethical laws or corruption.\n     - Brief description of the case, name of the regulatory agency (e.g. SEBI, MCA, CCI, ED, CBI), and corrective measures undertaken.\n\n  3. Conflict of Interest Complaints:\n     - Number of complaints received regarding conflicts of interest involving Directors and KMPs during the financial year, along with resolution status.\n\n  4. Corrective Actions for Misconduct:\n     - Disclosures regarding any disciplinary action taken against employees or business partners for bribery, fraud, or violations of the company's code of conduct.",
    "defaultRemarks": {
      "efficiencyReasoning": "Requires specific enumeration of Principle 1 essential indicators: anti-corruption training coverage, regulatory fines/prosecutions, conflict of interest complaints, and disciplinary actions.",
      "criticalMisses": [
        "Generic ethical statements instead of BRSR format indicators.",
        "Omitting regulatory fines and prosecutions."
      ],
      "suggestions": [
        "Emphasize that coverage metrics require exact percentages across Directors, KMPs, and workers."
      ]
    }
  }
];
