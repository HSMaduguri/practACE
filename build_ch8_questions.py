# Chapter 8 Questions data
import json

CH8_QUESTIONS = [
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
      { "keyword": "Loan to Value (LTV) Ratio", "category": "Rule", "description": "Maximum LTV ratio of 75% for loans against pledge of gold jewellery." },
      { "keyword": "Bullet Repayment Scheme Limit", "category": "Rule", "description": "Permitted up to ₹4.00 Lakhs (revised threshold) with maximum tenor of 12 months." },
      { "keyword": "Interest Servicing & Valuation", "category": "Provision", "description": "Interest charged at monthly rests but serviced along with principal at maturity in bullet repayment." },
      { "keyword": "NPA Classification on Default", "category": "Standard", "description": "Account treated as NPA if not repaid within 90 days from the due date of 12-month maturity." }
    ],
    "shortSuggestedAnswer": """• RBI Prudential Guidelines on Gold Loans (Non-Agricultural Purposes):

  1. Loan to Value (LTV) Ratio:
     - The LTV ratio shall not exceed 75% of the value of gold ornaments and jewellery pledged.
     - Value is determined based on the average closing price of 22-carat gold for the preceding 30 days quoted by IBJA (India Bullion and Jewellers Association).

  2. Bullet Repayment Scheme:
     - Permissible ceiling: Banks are permitted to grant loans against gold jewellery under bullet repayment up to ₹4.00 Lakhs.
     - Tenor: The maximum period of the loan shall not exceed 12 months from the date of sanction.

  3. Interest Servicing & Accrual:
     - Interest is calculated at monthly rests, but both principal and interest are repayable in a single bullet payment at maturity.
     - For LTV calculation, accrued interest throughout the tenor must be factored in so that Total Exposure (Principal + Accrued Interest) does not breach 75% LTV at any point.

  4. Asset Classification / NPA Trigger:
     - Under bullet repayment, the account will be classified as Non-Performing Asset (NPA) if not fully repaid within 90 days from the scheduled due date (i.e. 12 months + 90 days).""",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on exact RBI regulatory limits: 75% LTV, ₹4.00 lakh ceiling for bullet repayment, 12-month maximum tenor, and 90-day overdue NPA trigger.",
      "criticalMisses": [
        "Stating incorrect LTV (e.g. 50% or 60%).",
        "Omitting the ₹4 lakh bullet repayment ceiling.",
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
      { "keyword": "Restructuring Definition", "category": "Provision", "description": "Modifying terms of an advance due to financial difficulty of the borrower involving economic sacrifice." },
      { "keyword": "Immediate Downgrade Rule", "category": "Rule", "description": "Upon restructuring, a standard advance is immediately downgraded to Sub-standard asset." },
      { "keyword": "Specified Period", "category": "Rule", "description": "Period from implementation date until 10% of total dues are paid and at least 1 year from commencement of first payment." },
      { "keyword": "Satisfactory Performance", "category": "Provision", "description": "No overdue payment exceeding 30 days during the specified period." },
      { "keyword": "Upgrade Preconditions", "category": "Standard", "description": "Satisfactory performance during the entire specified period + minimum investment grade rating." }
    ],
    "shortSuggestedAnswer": """• Prudential Classification upon Restructuring:
  1. Immediate Downgrade:
     - Upon restructuring, any Standard asset is IMMEDIATELY DOWNGRADED to Sub-Standard asset.
     - An NPA account retains its existing classification (Sub-standard, Doubtful) and may deteriorate further if aging criteria are met.

• Strict Conditions for Upgrade to 'Standard' Category:
  1. Completion of 'Specified Period':
     - The account must demonstrate \"Satisfactory Performance\" throughout the entire \"Specified Period\".
     - Specified Period means: The period from implementation of Resolution Plan up to the date by which at least 10% of the sum of outstanding principal debt as per RP is repaid, subject to a minimum of 1 year from the commencement of the first payment of interest or principal (whichever is later).
  2. Satisfactory Performance Benchmark:
     - The borrower must not have any overdue in payment of interest and/or principal exceeding 30 days at any time during the specified period.
  3. Credit Rating Requirement (for large exposures >= ₹100 crore):
     - The borrower’s debt must achieve an investment grade credit rating (BBB- or better) from at least one recognized External Credit Assessment Institution (ECAI).""",
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
    "question": "Star Bank restructured a term loan of ₹50 Crore on October 1, 2023. The repayment schedule provided a moratorium of 6 months, with the first quarterly installment of ₹2.5 Crore falling due on June 30, 2024. The borrower paid all quarterly installments on their due dates.\\n(a) What is the 'Specified Period' for this restructured advance?\\n(b) Can the branch upgrade this account to 'Standard' on October 1, 2024 (one year from restructuring date)?",
    "keyConcepts": [
      { "keyword": "Specified Period Dual Condition", "category": "Rule", "description": "1 year from commencement of first payment AND repayment of at least 10% of total debt dues." },
      { "keyword": "Moratorium Impact", "category": "Provision", "description": "1-year clock starts from first payment due date (June 30, 2024), NOT from date of restructuring." },
      { "keyword": "10% Repayment Computation", "category": "Rule", "description": "10% of ₹50 Crore = ₹5 Crore required to be repaid." },
      { "keyword": "Upgrade Eligibility Date", "category": "Standard", "description": "Account cannot be upgraded on October 1, 2024; earliest upgrade date is June 30, 2025." }
    ],
    "shortSuggestedAnswer": """• (a) Determination of 'Specified Period':
  1. Statutory Definition:
     - Under RBI Prudential Framework for Resolution of Stressed Assets, Specified Period means the period from date of implementation until BOTH conditions are met:
       • Condition 1: At least 10% of the sum of outstanding principal debt (as per restructured package) is paid. Here, 10% of ₹50 Crore = ₹5 Crore.
       • Condition 2: A minimum of one year has elapsed from the commencement of the FIRST payment of interest or principal (whichever is later) on the restructured advance.
  2. Application to Star Bank:
     - First installment fell due on: June 30, 2024.
     - 10% debt repayment (₹5 Crore): Satisfied upon payment of 2nd installment of ₹2.5 Crore on September 30, 2024.
     - One-year minimum clock: Runs from June 30, 2024 to JUNE 30, 2025.
     - Therefore, the Specified Period ends on JUNE 30, 2025 (when both conditions are fulfilled).

• (b) Evaluation of Proposed Upgrade on October 1, 2024:
  - NO, the branch CANNOT upgrade the account to 'Standard' on October 1, 2024.
  - Reason: Although 1 year has elapsed since the restructuring date (Oct 1, 2023), the 1-year clock from the commencement of the FIRST payment (June 30, 2024) has NOT elapsed.
  - The account must remain Sub-standard until June 30, 2025, provided performance continues to be satisfactory (no payment overdue > 30 days).""",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on calculating the exact Specified Period (clock starts from 1st payment, not restructuring date) and concluding that upgrade on Oct 1, 2024 is strictly impermissible.",
      "criticalMisses": [
        "Starting the 1-year clock from Oct 1, 2023 instead of June 30, 2024.",
        "Permitting upgrade on Oct 1, 2024."
      ],
      "suggestions": [
        "Explicitly state both prongs: 10% repayment (₹5 Cr) AND 1 full year from 1st payment date."
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
      { "keyword": "DCCO Deferment Norms", "category": "Rule", "description": "Deferment of DCCO allowed without treating loan as restructured/NPA if within prescribed time caps." },
      { "keyword": "Infrastructure Projects DCCO", "category": "Rule", "description": "Up to 2 years beyond original DCCO for reasons beyond promoter control; additional 1 year for court/arbitration." },
      { "keyword": "Non-Infrastructure Projects DCCO", "category": "Rule", "description": "Up to 1 year beyond original DCCO for reasons beyond promoter control." },
      { "keyword": "Promoter Sacrifice & Viability", "category": "Provision", "description": "Project must remain viable and interest during construction must be serviced." }
    ],
    "shortSuggestedAnswer": """• RBI Prudential Norms on DCCO Deferment:

  1. Infrastructure Sector Projects (Highway Toll Project):
     - Reasons Beyond Control of Promoters: Deferment of DCCO is permitted up to a MAXIMUM OF 2 YEARS beyond the original DCCO without downgrade to NPA.
     - Court Cases / Arbitration Delays: An ADDITIONAL deferment of up to 1 YEAR (total 3 years) is permissible if delay is caused by litigation or arbitration.
     - Other Business Reasons: Up to 1 year beyond original DCCO.

  2. Non-Infrastructure Sector Projects (Cement Manufacturing Plant):
     - Reasons Beyond Control of Promoters: Deferment of DCCO is permitted up to a MAXIMUM OF 1 YEAR beyond the original DCCO without downgrade to NPA.
     - Other Business Reasons: Maximum up to 6 months beyond original DCCO.

  3. Mandatory Conditions for Retaining Standard Asset Classification:
     - The project viability must be reassessed and found economically viable.
     - Debt-Equity ratio and Debt Service Coverage Ratio (DSCR) must be acceptable.
     - The restructuring application must be formally approved before the original DCCO expires.
     - Additional provisioning of 5% is required on the standard exposure during the extended DCCO period.""",
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
    "question": "During the audit of a branch of a commercial bank, the auditor noticed the following in a Cash Credit (CC) account having a sanctioned limit of ₹10 Crore:\\n• Latest stock statement available on record was 4 months old.\\n• Stock audit report was 15 months old.\\n• Outstanding balance has been continuously ₹9.8 Crore for the past 120 days.\\nAnalyze whether the account should be classified as NPA and state the duties of the auditor.",
    "keyConcepts": [
      { "keyword": "Stale Stock Statement (3 Months)", "category": "Rule", "description": "Stock statements older than 3 months are deemed invalid and Drawing Power becomes NIL." },
      { "keyword": "Stock Audit Frequency (Annual)", "category": "Provision", "description": "Stock audit required annually for large limits (usually >= ₹5 Crore); 15 months indicates internal control lapse." },
      { "keyword": "Drawing Power Nil Implication", "category": "Rule", "description": "When DP becomes NIL, the entire outstanding balance becomes an excess/irregularity." },
      { "keyword": "NPA Classification (90 Days Out of Order)", "category": "Standard", "description": "Outstanding exceeding DP continuously for more than 90 days causes the account to become NPA." }
    ],
    "shortSuggestedAnswer": """• Technical & Regulatory Analysis under RBI Master Circular on IRAC Norms:

  1. Validity of Stock Statement (3-Month Rule):
     - RBI guidelines mandate that stock statements should not be older than 3 months.
     - Stock statements older than 3 months (here 4 months old) are STALE and deemed invalid.
     - Consequence: The Drawing Power (DP) of the borrower is deemed to be NIL.

  2. Annual Stock Audit Non-Compliance:
     - For large working capital limits (exceeding ₹5 Crore), stock audit by an external CA/cost accountant is mandatory annually.
     - Stock audit being 15 months old represents a severe internal control failure and breach of sanction terms.

  3. Asset Classification (NPA Trigger):
     - Since DP is deemed NIL due to stale stock statement, the entire outstanding balance of ₹9.8 Crore represents an excess over DP.
     - Under RBI norms, an account is classified as NPA if the outstanding balance remains continuously in excess of the sanctioned limit/Drawing Power for MORE THAN 90 DAYS.
     - Here, the account has been continuously irregular for 120 days (> 90 days).
     - CONCLUSION: The account MUST BE CLASSIFIED AS NON-PERFORMING ASSET (NPA - Sub-Standard).

  4. Auditor's Action & Reporting:
     - Issue a Memorandum of Changes (MOC) downgrading the account to Sub-Standard.
     - Ensure required provisioning (minimum 15% on total secured exposure).
     - Report the breakdown in stock monitoring in the Long Form Audit Report (LFAR).""",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying the 3-month stale stock rule leading to NIL DP, applying the 90-day continuous irregularity test, and issuing an MOC for NPA classification.",
      "criticalMisses": [
        "Failing to recognize that stock statements > 3 months make DP NIL.",
        "Concluding the account is Standard because it is within sanctioned limit of ₹10 Cr."
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
      { "keyword": "Agricultural Advances NPA Norms", "category": "Rule", "description": "NPA classification linked to crop seasons rather than the standard 90-day rule." },
      { "keyword": "Short Duration Crops", "category": "Rule", "description": "Crop season up to 1 year; NPA if installment/interest unpaid for TWO crop seasons beyond due date." },
      { "keyword": "Long Duration Crops", "category": "Rule", "description": "Crop season longer than 1 year; NPA if installment/interest unpaid for ONE crop season beyond due date." },
      { "keyword": "SLBC Determination", "category": "Provision", "description": "State Level Bankers’ Committee (SLBC) determines crop season length for each crop in the State." },
      { "keyword": "Natural Calamities Restructuring", "category": "Provision", "description": "Restructuring of agricultural loans due to drought/floods without immediate downgrade to NPA." }
    ],
    "shortSuggestedAnswer": """• Prudential Norms for Agricultural Advances:
  - Normal 90-day NPA rule does NOT apply to agricultural advances. Classification is determined based on CROP SEASONS.

• Classification Criteria:
  1. Short Duration Crops:
     - Definition: Crops with a crop season up to 1 year (e.g. paddy, wheat, pulses, sugarcane in certain regions).
     - NPA Trigger: The loan installment or interest remains unpaid for TWO CROP SEASONS beyond the due date.

  2. Long Duration Crops:
     - Definition: Crops with a crop season longer than 1 year (e.g. tea, coffee, rubber, sugarcane in certain regions).
     - NPA Trigger: The loan installment or interest remains unpaid for ONE CROP SEASON beyond the due date.

• Key Regulatory Guidelines:
  - Determination of Crop Season: The duration of the crop season for each crop is determined by the State Level Bankers’ Committee (SLBC) in each State.
  - Natural Calamities Relief: When agricultural loans are restructured due to natural calamities (drought, flood), banks may convert short-term loans into term loans or reschedule repayments without automatically downgrading the accounts to NPA, subject to RBI Master Directions.""",
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
      { "keyword": "Three Stages of Audit of Advances", "category": "Keyword", "description": "Evaluation of Internal Controls, Substantive Testing of Sanctions/Disbursements, and Review of Operations/Asset Classification." },
      { "keyword": "Stage 1: Internal Control Evaluation", "category": "Provision", "description": "Assessing credit appraisal mechanisms, delegation of powers, margin adequacy, and collateral verification." },
      { "keyword": "Stage 2: Substantive Verification", "category": "Provision", "description": "Checking loan agreements, mortgage deeds, charge registration with CERSAI/ROC, and end-use of funds." },
      { "keyword": "Stage 3: Review of Operations & IRAC", "category": "Standard", "description": "Monitoring account turnover, drawing power calculations, stock statements, and applying IRAC NPA norms." }
    ],
    "shortSuggestedAnswer": """• Three Distinct Stages in Audit of Bank Advances:

  1. Stage 1: Evaluation of Internal Controls over Advances:
     - Examine credit policy, credit appraisal standards, and credit rating mechanisms.
     - Verify that sanctioning authorities acted within their delegated lending powers.
     - Review post-disbursement supervision controls: stock statement submission, periodic inspection of units, and insurance coverage.

  2. Stage 2: Substantive Testing of Sanction, Documentation & Disbursement:
     - Verify compliance with sanction terms (margin, interest rate, repayment schedule).
     - Inspect legal validity and enforceability of loan documentation (demand promissory notes, hypothecation deeds, mortgages).
     - Verify registration of charges with the Registrar of Companies (ROC - Form CHG-1) and CERSAI.
     - Ensure disbursement was made directly to suppliers/vendors to prevent fund diversion.

  3. Stage 3: Review of Operations & Asset Classification (IRAC Compliance):
     - Examine account activity to ensure credits match business turnover.
     - Verify calculation of Drawing Power based on valid stock statements (< 3 months old).
     - Apply RBI Income Recognition and Asset Classification (IRAC) norms to identify Non-Performing Assets (NPAs).
     - Verify calculation of required provisioning on standard, sub-standard, doubtful, and loss assets.""",
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
      { "keyword": "Consortium Advances", "category": "Keyword", "description": "Joint financing of a large borrower by multiple banks under a single consortium agreement." },
      { "keyword": "Individual Bank Recovery Rule", "category": "Rule", "description": "Asset classification is determined based on the record of recovery of EACH individual bank." },
      { "keyword": "Discrepancy in Classification", "category": "Provision", "description": "An account can be Standard in Bank A and NPA in Bank B depending on individual servicing." },
      { "keyword": "Lead Bank Remittance Rule", "category": "Rule", "description": "If borrower remits funds to Lead Bank but Lead Bank delays transmission, member bank cannot classify as NPA if funds are with Lead Bank." },
      { "keyword": "Information Sharing Mandate", "category": "Rule", "description": "Mandatory sharing of quarterly credit information among all consortium/multiple banking lenders." }
    ],
    "shortSuggestedAnswer": """• Prudential Rules in Consortium & Multiple Banking Arrangements:

  1. Individual Bank Record of Recovery Governs Classification:
     - Asset classification of advances granted under consortium or multiple banking arrangements is determined SOLELY based on the record of recovery of the INDIVIDUAL member bank.
     - Therefore, YES: It is legally possible for an advance to be classified as 'Standard' by one bank, while another consortium member has classified it as 'NPA'.

  2. Exception Regarding Lead Bank Remittances:
     - Where the borrower has deposited required interest and installments with the Lead Bank in time, but the Lead Bank has failed to remit the member bank's share, the member bank SHALL NOT treat the account as NPA.
     - The member bank can treat the debt as serviced, provided confirmed evidence of deposit with Lead Bank is verified.

  3. Mandatory Information Sharing (RBI Mandate):
     - Banks participating in consortium or multiple banking arrangements must exchange quarterly credit information, stock audit reports, and borrower conduct reports.
     - If a member bank learns that an account has become NPA in another bank due to fraud or diversion of funds, it must review the account critically and re-evaluate classification.""",
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
      { "keyword": "Non-Fund Based Facilities", "category": "Keyword", "description": "Contingent commitments (LCs and BGs) that convert into fund-based liabilities upon default." },
      { "keyword": "Appraisal & Sanction Verification", "category": "Provision", "description": "Verifying sanction within delegated authority, financial viability, and underlying business transaction." },
      { "keyword": "Cash Margin & Collateral", "category": "Rule", "description": "Verifying stipulated cash margin maintained in term deposits and lien marked in system." },
      { "keyword": "Devolvement & Invocation Procedures", "category": "Rule", "description": "Devolved LCs and invoked BGs must be immediately debited to forced loans and subjected to 90-day NPA test." },
      { "keyword": "Contingent Liability Disclosures", "category": "Standard", "description": "Verification of outstanding guarantee/LC register against general ledger and Schedule 12 disclosures." }
    ],
    "shortSuggestedAnswer": """• Substantive Audit Procedures for Non-Fund Based Facilities:

  1. Verification of Sanction & Underlying Contract:
     - Verify that non-fund limits (LCs/BGs) are sanctioned by authorities within their delegated lending powers.
     - Ensure LCs are opened only for genuine trade transactions of the borrower and not for financing accommodation bills.
     - Verify that financial guarantees are issued strictly within RBI exposure caps.

  2. Margin & Collateral Security Verification:
     - Check that stipulated cash margins (e.g. 10% to 25%) are collected and held in fixed deposits with an explicit lien marked in the core banking system.
     - Ensure counter-guarantees from borrowers and personal guarantees of promoters are executed.

  3. Verification of Registers & Expired Guarantees:
     - Reconcile the subsidiary LC and Guarantee registers with the General Ledger contingent liability balances (Schedule 12).
     - Verify whether expired guarantees have been formally reversed or claim periods have lapsed.

  4. Audit of Devolved LCs & Invoked Guarantees:
     - Scrutinize whether any LC devolved or BG was invoked during the year.
     - Check that payment was immediately made to the beneficiary by creating a \"Forced Loan / Advance Against Devolved LC\".
     - Ensure such devolved accounts are tested for recovery; if unpaid after 90 days, the entire customer exposure must be classified as NPA.""",
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
    "question": "Explain the statutory provisions and auditor’s verification procedures for Cash Reserve Ratio (CRR) under Section 42 of RBI Act, 1934, and Statutory Liquidity Ratio (SLR) under Section 24 of Banking Regulation Act, 1949.",
    "keyConcepts": [
      { "keyword": "CRR under Section 42, RBI Act", "category": "Section", "description": "Maintenance of minimum cash balances with RBI as a percentage of Net Demand and Time Liabilities (NDTL)." },
      { "keyword": "SLR under Section 24, BR Act", "category": "Section", "description": "Maintenance of specified percentage of NDTL in approved securities, gold, or unencumbered cash balances." },
      { "keyword": "Net Demand and Time Liabilities (NDTL)", "category": "Keyword", "description": "Computation of demand and time liabilities with reference to alternate Friday reporting dates." },
      { "keyword": "Penal Interest for Default", "category": "Rule", "description": "Penal interest charged by RBI for shortfall in daily or fortnightly CRR/SLR maintenance." },
      { "keyword": "Auditor Certification", "category": "Standard", "description": "Central Statutory Auditor certification of 12 reporting alternate Fridays during the year." }
    ],
    "shortSuggestedAnswer": """• Statutory Provisions & Auditor Verification:

  1. Cash Reserve Ratio (CRR - Section 42 of RBI Act, 1934):
     - Every scheduled commercial bank must maintain a minimum percentage of its Net Demand and Time Liabilities (NDTL) as cash balance with the RBI.
     - Maintenance is on an average fortnightly basis, with a daily minimum maintenance requirement (presently 90% of required CRR).
     - Shortfall attracts penal interest from RBI under Section 42(3) of the RBI Act.

  2. Statutory Liquidity Ratio (SLR - Section 24 of BR Act, 1949):
     - Banks must maintain a specified percentage (e.g. 18%) of their NDTL in the form of liquid assets: cash, gold, or unencumbered approved securities (Treasury bills, Central/State government securities).
     - Must be maintained on a daily basis at the close of business.

  3. Verification Procedures by Central Statutory Auditors:
     - Verify the accuracy of NDTL computations prepared by the bank with reference to branch returns and treasury data for reporting alternate Fridays.
     - Ensure proper exclusions (e.g. inter-bank deposits, capital funds) and inclusions (margin deposits, cash certificates) in NDTL.
     - Verify valuation of SLR securities in accordance with RBI prudential norms (HTM, AFS, HFT portfolios).
     - Test whether daily SLR/CRR was maintained on all days during the audit period, especially 12 sample alternate Fridays selected for detailed certification.
     - Inquire whether any shortfall occurred and examine penal interest payments or notices from the RBI.""",
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
      { "keyword": "Sub-standard Asset Provisioning", "category": "Rule", "description": "15% on secured exposure; 25% on unsecured exposure (20% for infrastructure loans)." },
      { "keyword": "Doubtful Category 1 (D1 - Up to 1 year)", "category": "Rule", "description": "25% on secured portion + 100% on unsecured portion." },
      { "keyword": "Doubtful Category 2 (D2 - 1 to 3 years)", "category": "Rule", "description": "40% on secured portion + 100% on unsecured portion." },
      { "keyword": "Doubtful Category 3 (D3 - More than 3 years)", "category": "Rule", "description": "100% on both secured and unsecured portions." },
      { "keyword": "Loss Asset Provisioning", "category": "Rule", "description": "100% provision or complete write-off in books." }
    ],
    "shortSuggestedAnswer": """• RBI Mandatory Provisioning Rates on NPAs:

  1. Sub-Standard Assets (NPA <= 12 Months):
     - Secured Exposure: 15% on total outstanding balance.
     - Unsecured 'Ab-initio' Exposure: 25% on total outstanding balance (20% in case of infrastructure loan accounts).

  2. Doubtful Assets (Remained Sub-standard for > 12 Months):
     - Unsecured Portion: 100% provision on the unsecured portion across all doubtful categories.
     - Secured Portion:
       • Category D1 (Doubtful up to 1 year): 25% on the secured portion.
       • Category D2 (Doubtful > 1 year and up to 3 years): 40% on the secured portion.
       • Category D3 (Doubtful > 3 years): 100% on the secured portion.

  3. Loss Assets:
     - Definition: Asset identified as loss by bank, internal/external auditor, or RBI inspectors, but not written off.
     - Provision: 100% of the entire outstanding balance must be provided for, or the asset written off completely.

• Note on Realizable Value of Security:
  - Security must be valued by approved valuers at least once every 3 years. If security erosion exceeds 50%, account moves straight to Doubtful; if erosion > 90%, account moves straight to Loss asset.""",
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
      { "keyword": "Long Form Audit Report (LFAR)", "category": "Keyword", "description": "Detailed structured questionnaire prescribed by RBI to identify internal control deficiencies and risks." },
      { "keyword": "Branch Statutory Auditor Responsibility", "category": "Provision", "description": "Complete LFAR questionnaire for the branch covering cash, advances, deposits, housekeeping, and fraud." },
      { "keyword": "Central Statutory Auditor Responsibility", "category": "Provision", "description": "Synthesize branch LFARs, complete Head Office LFAR, and submit consolidated report to Board/RBI." },
      { "keyword": "Submission Deadlines", "category": "Rule", "description": "Mandatory submission to bank management and RBI within prescribed regulatory timelines." }
    ],
    "shortSuggestedAnswer": """• Purpose & Nature of LFAR:
  - LFAR is a comprehensive, structured questionnaire designed by the Reserve Bank of India (RBI).
  - Unlike the statutory audit report which expresses an audit opinion on true and fair view, the LFAR is a management report that provides granular diagnostic feedback on internal controls, credit monitoring, compliance, and operational deficiencies.

• Respective Responsibilities:
  1. Branch Statutory Auditor (SBA):
     - The SBA must answer every question in the Branch LFAR questionnaire objectively, supported by instances and specific account numbers.
     - Key focus areas: Cash and physical security, verification of advances, classification of NPAs, adequacy of stock statements, housekeeping (suspense and clearing accounts), and internal control lapses.
     - SBA must submit the completed LFAR along with the statutory audit report to the Head Office and Central Statutory Auditors.

  2. Central Statutory Auditor (CSA):
     - Complete the Head Office LFAR covering treasury operations, investments, capital adequacy, macro credit governance, and IT systems.
     - Review, analyze, and synthesize significant observations reported in all Branch LFARs.
     - Prepare and issue an Executive Summary / Consolidated LFAR for the bank as a whole, submitted to the Audit Committee of the Board (ACB) and the RBI.""",
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
      { "keyword": "Capital to Risk-Weighted Assets Ratio (CRAR)", "category": "Rule", "description": "Minimum 9% total capital ratio for commercial banks in India (higher than Basel 8% baseline)." },
      { "keyword": "Common Equity Tier 1 (CET1)", "category": "Provision", "description": "Paid-up equity capital, share premium, statutory reserves, free reserves, minus regulatory deductions." },
      { "keyword": "Additional Tier 1 (AT1)", "category": "Provision", "description": "Perpetual non-cumulative preference shares (PNCPS) and perpetual debt instruments (PDI)." },
      { "keyword": "Tier 2 Capital (Gone-Concern Capital)", "category": "Provision", "description": "General provisions, revaluation reserves (at discount), hybrid debt instruments, subordinated term debt." },
      { "keyword": "Capital Conservation Buffer (CCB)", "category": "Rule", "description": "2.5% composed of CET1, making total minimum capital requirement 11.5%." }
    ],
    "shortSuggestedAnswer": """• Basel III Capital Adequacy Framework in India (RBI Master Circular):

  1. Minimum Regulatory Capital Ratio (CRAR):
     - Minimum Total CRAR: 9.0% of total risk-weighted assets (RWA) (vs 8% Basel minimum).
     - Minimum Common Equity Tier 1 (CET1): 5.5% of RWA.
     - Minimum Tier 1 Capital: 7.0% of RWA.

  2. Components of Tier 1 Capital (Going-Concern Capital):
     - Common Equity Tier 1 (CET1):
       • Paid-up common equity shares;
       • Share premium resulting from equity issuance;
       • Statutory reserves and free reserves;
       • Less: Regulatory deductions (goodwill, deferred tax assets, intangible assets, cumulative losses).
     - Additional Tier 1 (AT1):
       • Perpetual Non-Cumulative Preference Shares (PNCPS);
       • Perpetual Debt Instruments (PDI) with loss-absorption write-down/conversion features.

  3. Components of Tier 2 Capital (Gone-Concern Capital):
     - General Provisions and Loss Reserves (capped at 1.25% of credit risk-weighted assets);
     - Revaluation Reserves (discounted by 55%);
     - Subordinated Debt instruments with a minimum original maturity of 5 years.
     - Cap: Tier 2 capital is limited to a maximum of 100% of Tier 1 capital.

  4. Capital Conservation Buffer (CCB):
     - Mandatory additional buffer of 2.5% comprised exclusively of CET1 capital.
     - Total Capital Requirement = 9% (Base CRAR) + 2.5% (CCB) = 11.50% of Risk-Weighted Assets.""",
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
    "question": "An Inland Letter of Credit (ILC) of ₹2 Crore issued by a branch devolved during the financial year. The borrower was unable to fund the payment, and the branch met the payment by creating a forced debit. Discuss the accounting, provisioning, and reporting obligations of the auditor.",
    "keyConcepts": [
      { "keyword": "LC Devolvement", "category": "Keyword", "description": "When the applicant fails to pay the bill drawn under LC on due date and the issuing bank honors commitment." },
      { "keyword": "Accounting Treatment", "category": "Provision", "description": "Contingent liability extinguished; forced advance / overdraft created immediately in borrower's name." },
      { "keyword": "Asset Classification & 90-Day Rule", "category": "Rule", "description": "If devolved amount remains unpaid after 90 days, the entire customer credit facility becomes NPA." },
      { "keyword": "LFAR & MOC Reporting", "category": "Standard", "description": "Report devolvement in LFAR; issue MOC if account was incorrectly maintained as standard." }
    ],
    "shortSuggestedAnswer": """• Audit Analysis of Devolved Inland Letter of Credit:

  1. Immediate Accounting Treatment:
     - Upon devolvement, the bank must immediately honor its commitment to the negotiating/beneficiary bank.
     - The contingent liability recorded under Schedule 12 is extinguished.
     - The payment must be debited to the customer’s account by creating a funded advance: \"Advances Against Devolved LCs\" or \"Forced Debit / Overdraft\".
     - The bank MUST NOT park the payment in suspense or sundry clearing accounts.

  2. Asset Classification (IRAC Norms):
     - Under RBI norms, if a devolved LC balance is not reimbursed by the borrower within 90 days from the date of payment/devolvement, the account becomes an NPA.
     - Borrower-Wise Classification Principle: Under RBI norms, asset classification is borrower-wise and not facility-wise.
     - Therefore, if the devolved LC account becomes NPA, ALL OTHER credit facilities (CC, Term Loans, Export Credit) granted to the borrower will also automatically become NPA.

  3. Auditor's Action & Reporting:
     - Check the age of the forced debit. If > 90 days, verify that the branch has downgraded all accounts of the borrower to NPA.
     - Verify calculation of required provisioning (minimum 15%).
     - If not downgraded by the branch, issue a Memorandum of Changes (MOC).
     - Report details of devolved LCs and recovery status in the Branch LFAR.""",
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
      { "keyword": "RBI Master Directions on Frauds", "category": "Rule", "description": "Mandatory classification, investigation, and reporting of frauds to RBI and law enforcement." },
      { "keyword": "Classification Categories", "category": "Keyword", "description": "Misappropriation, fraudulent encashment, unauthorized credit facilities, fraudulent forex transactions, cyber fraud." },
      { "keyword": "Form FMR-1 Reporting", "category": "Rule", "description": "Fraud Monitoring Return (FMR-1) submitted to RBI Central Fraud Registry within 3 weeks of detection." },
      { "keyword": "100% Provisioning Requirement", "category": "Rule", "description": "Full 100% provision required over 4 quarters for fraud accounts, or upfront 100% in same quarter." },
      { "keyword": "Reporting to Police / CBI", "category": "Rule", "description": "Mandatory filing of complaints with State Police (State CID) or CBI (Anti-Corruption Branch / BS&FC)." }
    ],
    "shortSuggestedAnswer": """• RBI Master Directions on Classification & Reporting of Frauds:

  1. Classification of Frauds (7 Prescribed Categories):
     - (a) Misappropriation and criminal breach of trust;
     - (b) Fraudulent encashment through forged instruments / manipulation of books;
     - (c) Unauthorized credit facilities extended for reward or illegal gratification;
     - (d) Negligence and cash shortages;
     - (e) Cheating and forgery;
     - (f) Fraudulent foreign exchange transactions;
     - (g) Any other type of fraud not coming under the above heads (including cyber frauds).

  2. Reporting Mechanism to RBI (Form FMR-1):
     - Banks must report all fraud cases involving ₹1 Lakh and above through the online Central Fraud Monitoring Cell (CFMC) portal in Form FMR-1.
     - Reporting Timeline: Within 3 WEEKS from the date of detection of fraud.
     - For large value frauds (₹1 Crore and above), flash reports must be sent within 48 hours to RBI.

  3. Mandatory Provisioning Norms for Fraud Accounts:
     - The entire amount involved in the fraud must be provided for 100% immediately.
     - Banks are permitted to spread the provisioning over a period not exceeding FOUR QUARTERS, commencing from the quarter in which fraud occurred, provided 25% minimum is provided each quarter.

  4. Reporting to Law Enforcement Agencies:
     - Fraud up to ₹3 Crore: State Police / State CID.
     - Fraud from ₹3 Crore to ₹50 Crore: Central Bureau of Investigation (CBI) - Anti-Corruption Branch.
     - Fraud above ₹50 Crore: CBI - Banking Security & Fraud Cell (BS&FC).""",
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
  }
]

with open("ch8_questions.json", "w") as f:
    json.dump(CH8_QUESTIONS, f, indent=2)
print("Saved ch8_questions.json")
