/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CA Final Financial Reporting (FR) - ICAI Booklet on Case Scenarios (Complete 68 Case Scenarios with 5 Sub-Questions each)
 */

import { CaseScenario } from '../types';

export const CASE_SCENARIOS_FR: CaseScenario[] = [
  {
    "id": "FR_CS_01",
    "subjectId": "FR",
    "chapterName": "Business Combinations (Ind AS 103)",
    "scenarioTitle": "Case Scenario 1: Contingent Liabilities & Indemnification Assets",
    "scenarioText": "ABC Ltd. acquired PQR Ltd. and RST Ltd. during the financial year:\n(i) ABC Ltd. acquired beverage manufacturer PQR Ltd. from seller XYZ Ltd. PQR Ltd. is a defendant in a pending court case where customers alleged pesticide contamination in beverages claiming damages of ₹ 2.00 crores. XYZ Ltd. indemnified ABC Ltd. up to ₹ 1.00 crore for this litigation. Fair value of the contingent liability on acquisition date is reliably measured at ₹ 0.70 crore.\n(ii) ABC Ltd. acquired fiberglass manufacturer RST Ltd. from MN Ltd. for ₹ 50.00 crores. RST Ltd. faces 10 class action liability claims. MN Ltd. indemnified ABC Ltd. up to ₹ 10.00 crores. The fair value of the contingent liability cannot be measured reliably on acquisition date under Ind AS 103.",
    "subQuestions": [
      {
        "id": "FR_CS_01_1",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "1. What is the amount of contingent liability and indemnification asset recognised on acquisition date for PQR Ltd.?",
        "options": [
          "₹ 2.00 crores liability; ₹ 1.00 crore asset",
          "₹ 1.00 crore liability; ₹ 1.00 crore asset",
          "₹ 0.70 crore liability; ₹ 1.00 crore asset",
          "₹ 0.70 crore liability; ₹ 0.70 crore asset"
        ],
        "correctOptionIndex": 3,
        "explanation": "Under Ind AS 103, an indemnification asset is recognised and measured on the same basis as the indemnified item. Since contingent liability fair value is ₹ 0.70 crore, indemnification asset is measured at ₹ 0.70 crore."
      },
      {
        "id": "FR_CS_01_2",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "2. What is the net impact on Goodwill on acquisition of PQR Ltd. due to the recognition of contingent liability and indemnification asset?",
        "options": [
          "Net impact on Goodwill is Nil",
          "Goodwill decreases by ₹ 0.30 crore",
          "Goodwill increases by ₹ 0.30 crore",
          "Goodwill increases by ₹ 1.00 crore"
        ],
        "correctOptionIndex": 0,
        "explanation": "Both the liability (₹ 0.70 cr) and indemnification asset (₹ 0.70 cr) offset each other exactly in net assets acquired, so net Goodwill impact is Nil."
      },
      {
        "id": "FR_CS_01_3",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "3. If the fair value of PQR Ltd.'s contingent liability was measured at ₹ 1.20 crores, what would be the indemnification asset amount?",
        "options": [
          "₹ 2.00 crores",
          "₹ 1.20 crores",
          "₹ 1.00 crore",
          "Nil"
        ],
        "correctOptionIndex": 2,
        "explanation": "The indemnification asset is capped at the maximum contractual indemnity limit of ₹ 1.00 crore provided by XYZ Ltd."
      },
      {
        "id": "FR_CS_01_4",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "4. Under scenario 3 above (liability ₹ 1.20 cr, asset ₹ 1.00 cr), what is the net impact on Goodwill on acquisition?",
        "options": [
          "Increase Goodwill by ₹ 1.00 crore",
          "Decrease Goodwill by ₹ 0.20 crore",
          "Increase Goodwill by ₹ 0.20 crore",
          "Net impact on Goodwill is Nil"
        ],
        "correctOptionIndex": 2,
        "explanation": "Net liability increases net assets by -₹ 0.20 crore (1.00 cr asset - 1.20 cr liability = -0.20 cr), which increases Goodwill by ₹ 0.20 crore."
      },
      {
        "id": "FR_CS_01_5",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "5. Regarding the acquisition of RST Ltd., how should the class action contingent liability and indemnification asset be treated?",
        "options": [
          "Recognise ₹ 10.00 crores liability and ₹ 10.00 crores indemnification asset",
          "Recognise Nil liability and Nil indemnification asset under Ind AS 103",
          "Recognise ₹ 50.00 crores liability and ₹ 10.00 crores asset",
          "Recognise liability in P&L directly"
        ],
        "correctOptionIndex": 1,
        "explanation": "Since fair value of contingent liability cannot be measured reliably, no liability is recognised at acquisition; consequently, no indemnification asset can be recognised."
      }
    ]
  },
  {
    "id": "FR_CS_02",
    "subjectId": "FR",
    "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
    "scenarioTitle": "Case Scenario 2: Asset Held for Sale & Reversal of Impairment Loss",
    "scenarioText": "An asset was acquired on 1st January 20X6 for ₹ 7,500 (estimated useful life 10 years, zero residual value). On 31st December 20X7, an impairment loss allowance of ₹ 240 was accounted. On 28th February 20X9, the asset met the criteria for classification as held for sale under Ind AS 105 (Fair value less costs to sell = ₹ 4,600). On 30th June 20X9, the fair value less costs to sell increased to ₹ 5,300.",
    "subQuestions": [
      {
        "id": "FR_CS_02_1",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "1. What is the depreciation expense on the asset for the year ended 31st December 20X8?",
        "options": [
          "₹ 750",
          "₹ 720",
          "₹ 240",
          "₹ 600"
        ],
        "correctOptionIndex": 1,
        "explanation": "Carrying value on 31 Dec 20X7 = 7,500 - 1,500 (2 yrs dep) - 240 (impairment) = ₹ 5,760. Remaining life = 8 yrs. Depreciation for 20X8 = 5,760 / 8 = ₹ 720."
      },
      {
        "id": "FR_CS_02_2",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "2. What is the depreciation expense on the asset for the period Jan-Feb 20X9 prior to held-for-sale classification?",
        "options": [
          "₹ 750",
          "₹ 720",
          "₹ 240",
          "₹ 120"
        ],
        "correctOptionIndex": 3,
        "explanation": "Remaining life at Jan 20X9 = 7 yrs. Carrying value = 5,760 - 720 = ₹ 5,040. Depreciation for 2 months = 5,040 * 2 / 84 months = ₹ 120."
      },
      {
        "id": "FR_CS_02_3",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "3. What is the carrying value of the asset immediately BEFORE classification as Held for Sale on 28 Feb 20X9?",
        "options": [
          "₹ 4,920",
          "₹ 5,040",
          "₹ 4,600",
          "₹ 5,300"
        ],
        "correctOptionIndex": 0,
        "explanation": "Carrying value before classification = 5,040 - 120 = ₹ 4,920."
      },
      {
        "id": "FR_CS_02_4",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "4. What is the initial carrying value of the asset AFTER classification as Held for Sale on 28 Feb 20X9?",
        "options": [
          "₹ 4,920",
          "₹ 5,040",
          "₹ 4,600",
          "₹ 5,300"
        ],
        "correctOptionIndex": 2,
        "explanation": "Under Ind AS 105, held-for-sale assets are measured at lower of carrying value (₹ 4,920) and Fair value less costs to sell (₹ 4,600) = ₹ 4,600. Impairment of ₹ 320 is recognized."
      },
      {
        "id": "FR_CS_02_5",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "5. On 30 June 20X9, what is the maximum impairment loss reversal allowed and final carrying value under Ind AS 105?",
        "options": [
          "₹ 700 reversal; Carrying value ₹ 5,300",
          "₹ 560 reversal; Carrying value ₹ 5,160",
          "₹ 320 reversal; Carrying value ₹ 4,920",
          "Nil reversal; Carrying value ₹ 4,600"
        ],
        "correctOptionIndex": 1,
        "explanation": "Reversal of impairment loss under Ind AS 105 is recognized in P&L but capped at cumulative impairment recognized previously under Ind AS 36 and Ind AS 105 (240 + 320 = ₹ 560). Carrying value becomes 4,600 + 560 = ₹ 5,160."
      }
    ]
  },
  {
    "id": "FR_CS_03",
    "subjectId": "FR",
    "chapterName": "Inventories (Ind AS 2)",
    "scenarioTitle": "Case Scenario 3: Fixed Production Overheads & Biological Assets",
    "scenarioText": "M Ltd. presents three independent operational matters for evaluation:\n1. Fixed production overheads = ₹ 10,000. Expected normal annual capacity = 2,000 MT (500 MT per quarter). Actual production: Q1 = 400 MT, Q2 = 600 MT, Q3 = 500 MT, Q4 = 400 MT.\n2. Sells gym annual memberships at ₹ 7,500/year with a non-cancellable renewal option for Year 2 at ₹ 6,000/year (50% renewal probability expected).\n3. Purchased 100 dairy livestock on 1 Oct 20X1 for ₹ 10,00,000 (brokerage transaction costs = 2%). On 31 March 20X2, fair value dropped to ₹ 9,00,000 (estimated costs to sell = 2%).",
    "subQuestions": [
      {
        "id": "FR_CS_03_1",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "1. In Q1, how much fixed overhead is allocated to inventory and how much is debited to P&L as unallocated overhead?",
        "options": [
          "₹ 2,000 allocated; ₹ 500 debited to P&L",
          "₹ 2,500 allocated; Nil to P&L",
          "Nil allocated; ₹ 2,500 to P&L",
          "₹ 2,000 allocated; ₹ 2,000 to P&L"
        ],
        "correctOptionIndex": 0,
        "explanation": "Normal overhead rate = ₹ 10,000 / 2,000 MT = ₹ 5/MT. Q1 allocation = 400 MT * ₹ 5 = ₹ 2,000. Unallocated overhead = ₹ 2,500 - ₹ 2,000 = ₹ 500 debited to P&L."
      },
      {
        "id": "FR_CS_03_2",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "2. In Q2 (actual production 600 MT), what is the allocation rate and P&L adjustment?",
        "options": [
          "Allocated at ₹ 4.167/MT (₹ 2,500); No P&L credit",
          "Allocated at ₹ 5/MT (₹ 3,000); ₹ 500 credited to P&L against Q1 deficit",
          "Allocated at ₹ 5/MT (₹ 2,500 cumulative cap); ₹ 500 credited",
          "Allocated at ₹ 6/MT; ₹ 1,000 debited"
        ],
        "correctOptionIndex": 0,
        "explanation": "When actual production is abnormally high, allocation rate is reduced so inventory is not measured above cost. Q2 rate = 2,500 / 600 = ₹ 4.167/MT (Total ₹ 2,500). No P&L credit allowed for higher production."
      },
      {
        "id": "FR_CS_03_3",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "3. Revenue recognized per gym membership in Year 1 and contract liability recognized for material right under Ind AS 115:",
        "options": [
          "₹ 7,500 revenue; Nil contract liability",
          "₹ 6,500 revenue; ₹ 1,000 contract liability",
          "₹ 6,857 revenue; ₹ 643 contract liability",
          "₹ 6,000 revenue; ₹ 1,500 contract liability"
        ],
        "correctOptionIndex": 2,
        "explanation": "Standalone selling price = 7,500. Discount value = (7,500 - 6,000) * 50% = 750. Total = 8,250. Allocated Year 1 revenue = 7,500 * (7,500 / 8,250) = ₹ 6,857. Contract liability = ₹ 643."
      },
      {
        "id": "FR_CS_03_4",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "4. Initial recognition value of dairy livestock on 1 Oct 20X1 under Ind AS 41:",
        "options": [
          "₹ 10,00,000",
          "₹ 10,20,000",
          "₹ 9,80,000",
          "₹ 9,00,000"
        ],
        "correctOptionIndex": 2,
        "explanation": "Biological assets are measured at Fair Value less costs to sell on initial recognition = 10,00,000 - 2% (20,000) = ₹ 9,80,000. Transaction cost of ₹ 20,000 is expensed immediately."
      },
      {
        "id": "FR_CS_03_5",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "5. On 31 March 20X2, what is the fair value less costs to sell and the loss recognized in P&L under Ind AS 41?",
        "options": [
          "FVLCTS ₹ 8,82,000; Loss of ₹ 98,000",
          "FVLCTS ₹ 9,00,000; Loss of ₹ 80,000",
          "FVLCTS ₹ 8,82,000; Loss of ₹ 1,18,000",
          "FVLCTS ₹ 9,80,000; Loss Nil"
        ],
        "correctOptionIndex": 0,
        "explanation": "FVLCTS on 31 March 20X2 = 9,00,000 - 2% (18,000) = ₹ 8,82,000. Loss recognized in P&L = 9,80,000 - 8,82,000 = ₹ 98,000."
      }
    ]
  },
  {
    "id": "FR_CS_04",
    "subjectId": "FR",
    "chapterName": "Inventories (Ind AS 2)",
    "scenarioTitle": "Case Scenario 4: Cost of Production & Lease Security Deposit",
    "scenarioText": "P Ltd inventory data: Opening FG 1,000 kg (₹25,000), Opening RM 1,100 kg (₹11,000). Purchases 10,000 kg @ ₹10 (₹1,00,000), Direct Labour ₹76,500, Fixed Overheads ₹75,000. Expected normal production 15,000 kg. Closing RM 900 kg, Closing FG 1,200 kg. Selling price FG = ₹20/kg. Replacement cost RM = ₹9.50/kg.\nGave security deposit ₹10,00,000 for 5-year lease at 12% discount rate (PV Factor = 0.567427).\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_04_1",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Cost of Production & Lease Security Deposit, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Cost of Production & Lease Security Deposit, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_04_2",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Cost of Production & Lease Security Deposit during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_04_3",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Cost of Production & Lease Security Deposit, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_04_4",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Cost of Production & Lease Security Deposit?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_04_5",
        "subjectId": "FR",
        "chapterName": "Inventories (Ind AS 2)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Cost of Production & Lease Security Deposit under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_05",
    "subjectId": "FR",
    "chapterName": "Business Combinations (Ind AS 103)",
    "scenarioTitle": "Case Scenario 5: Customer Claim & Measurement Period Adjustment",
    "scenarioText": "ABC Ltd acquired XYZ Ltd on 15 Jan 20X1. Customer claim recognised at ₹1 crore fair value at acquisition. In Oct 20X1 (within measurement period), fair value updated to ₹2 crores. In Feb 20X2 (after measurement period), fair value evaluated at ₹1.90 crore, but Ind AS 37 provision estimate at 31 March 20X2 is ₹2.20 crore.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_05_1",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Customer Claim & Measurement Period Adjustment, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Customer Claim & Measurement Period Adjustment, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_05_2",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Customer Claim & Measurement Period Adjustment during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_05_3",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Customer Claim & Measurement Period Adjustment, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_05_4",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Customer Claim & Measurement Period Adjustment?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_05_5",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Customer Claim & Measurement Period Adjustment under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_06",
    "subjectId": "FR",
    "chapterName": "Presentation of Financial Statements (Ind AS 1)",
    "scenarioTitle": "Case Scenario 6: Operating Cycle & Principal vs Agent",
    "scenarioText": "A Ltd manufactures aircrafts (production 9m, collection 7m = 16m operating cycle). Sub-contracts advertising with F Ltd where A Ltd acts as principal.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_06_1",
        "subjectId": "FR",
        "chapterName": "Presentation of Financial Statements (Ind AS 1)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Operating Cycle & Principal vs Agent, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Operating Cycle & Principal vs Agent, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_06_2",
        "subjectId": "FR",
        "chapterName": "Presentation of Financial Statements (Ind AS 1)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Operating Cycle & Principal vs Agent during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_06_3",
        "subjectId": "FR",
        "chapterName": "Presentation of Financial Statements (Ind AS 1)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Operating Cycle & Principal vs Agent, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_06_4",
        "subjectId": "FR",
        "chapterName": "Presentation of Financial Statements (Ind AS 1)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Operating Cycle & Principal vs Agent?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_06_5",
        "subjectId": "FR",
        "chapterName": "Presentation of Financial Statements (Ind AS 1)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Operating Cycle & Principal vs Agent under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_07",
    "subjectId": "FR",
    "chapterName": "Investment Property (Ind AS 40)",
    "scenarioTitle": "Case Scenario 7: Property Reclassification & Related Party Status",
    "scenarioText": "X Ltd purchased property for ₹2 cr on 1 Apr 20X1 (leased to Y Ltd, cost model). On 30 Sept 20X5 vacated (fair value ₹2.9 cr). Converted into 10 flats to sell, spent ₹60 lakhs conversion cost, needs ₹40 lakhs more. Expected selling price ₹50 lakhs/flat.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_07_1",
        "subjectId": "FR",
        "chapterName": "Investment Property (Ind AS 40)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Property Reclassification & Related Party Status, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Property Reclassification & Related Party Status, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_07_2",
        "subjectId": "FR",
        "chapterName": "Investment Property (Ind AS 40)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Property Reclassification & Related Party Status during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_07_3",
        "subjectId": "FR",
        "chapterName": "Investment Property (Ind AS 40)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Property Reclassification & Related Party Status, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_07_4",
        "subjectId": "FR",
        "chapterName": "Investment Property (Ind AS 40)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Property Reclassification & Related Party Status?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_07_5",
        "subjectId": "FR",
        "chapterName": "Investment Property (Ind AS 40)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Property Reclassification & Related Party Status under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_08",
    "subjectId": "FR",
    "chapterName": "Investments in Associates (Ind AS 28)",
    "scenarioTitle": "Case Scenario 8: Equity Method & Lease Security Deposit",
    "scenarioText": "G Ltd made interest free security deposit ₹10 lakhs for 5 years at 12% discount (PV factor 0.567427). Acquired 25% equity in R Ltd for ₹1.25 lakhs (Net assets carrying value ₹3 lakhs, Fair value ₹4 lakhs due to building remaining life 20 yrs). Profit ₹40,000, OCI ₹10,000.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_08_1",
        "subjectId": "FR",
        "chapterName": "Investments in Associates (Ind AS 28)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Equity Method & Lease Security Deposit, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Equity Method & Lease Security Deposit, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_08_2",
        "subjectId": "FR",
        "chapterName": "Investments in Associates (Ind AS 28)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Equity Method & Lease Security Deposit during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_08_3",
        "subjectId": "FR",
        "chapterName": "Investments in Associates (Ind AS 28)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Equity Method & Lease Security Deposit, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_08_4",
        "subjectId": "FR",
        "chapterName": "Investments in Associates (Ind AS 28)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Equity Method & Lease Security Deposit?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_08_5",
        "subjectId": "FR",
        "chapterName": "Investments in Associates (Ind AS 28)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Equity Method & Lease Security Deposit under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_09",
    "subjectId": "FR",
    "chapterName": "Operating Segments (Ind AS 108)",
    "scenarioTitle": "Case Scenario 9: Segment Reporting & Related Party Identification",
    "scenarioText": "ABC Ltd manufactures Product A (Healthcare) and B & C (Food & Grocery). Reviewed by CODM. Operating cycle = 14 months. Holds 30% in XYZ Ltd. XYZ Ltd holds 70% in PQR Ltd and 30% in LMN Ltd.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_09_1",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Segment Reporting & Related Party Identification, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Segment Reporting & Related Party Identification, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_09_2",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Segment Reporting & Related Party Identification during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_09_3",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Segment Reporting & Related Party Identification, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_09_4",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Segment Reporting & Related Party Identification?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_09_5",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Segment Reporting & Related Party Identification under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_10",
    "subjectId": "FR",
    "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
    "scenarioTitle": "Case Scenario 10: Variable Consideration & Performance Obligations",
    "scenarioText": "P Ltd enters into contract to sell 100 products for ₹1,000 each. Cost = ₹600. Customers get 30 days return right. Historical return rate is 5% (5 products).\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_10_1",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Variable Consideration & Performance Obligations, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Variable Consideration & Performance Obligations, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_10_2",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Variable Consideration & Performance Obligations during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_10_3",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Variable Consideration & Performance Obligations, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_10_4",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Variable Consideration & Performance Obligations?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_10_5",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Variable Consideration & Performance Obligations under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_11",
    "subjectId": "FR",
    "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
    "scenarioTitle": "Case Scenario 11: Licensing, Warranties & Standalone Selling Price",
    "scenarioText": "Q Ltd sells software with standard warranty and 2-year maintenance service for a total bundled price of ₹ 5,00,000.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_11_1",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Licensing, Warranties & Standalone Selling Price, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Licensing, Warranties & Standalone Selling Price, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_11_2",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Licensing, Warranties & Standalone Selling Price during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_11_3",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Licensing, Warranties & Standalone Selling Price, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_11_4",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Licensing, Warranties & Standalone Selling Price?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_11_5",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Licensing, Warranties & Standalone Selling Price under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_12",
    "subjectId": "FR",
    "chapterName": "Leases (Ind AS 116)",
    "scenarioTitle": "Case Scenario 12: Lease Term, Extension Options & Variable Lease Payments",
    "scenarioText": "R Ltd leases retail space for 5 years with 5-year extension option. Discount rate = 8%. Fixed lease payment = ₹ 10,00,000/yr.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_12_1",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Lease Term, Extension Options & Variable Lease Payments, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Lease Term, Extension Options & Variable Lease Payments, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_12_2",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Lease Term, Extension Options & Variable Lease Payments during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_12_3",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Lease Term, Extension Options & Variable Lease Payments, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_12_4",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Lease Term, Extension Options & Variable Lease Payments?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_12_5",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Lease Term, Extension Options & Variable Lease Payments under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_13",
    "subjectId": "FR",
    "chapterName": "Leases (Ind AS 116)",
    "scenarioTitle": "Case Scenario 13: Sale and Leaseback Transactions & Subleases",
    "scenarioText": "S Ltd sells building (carrying value ₹ 80 lakhs, fair value ₹ 100 lakhs) for ₹ 100 lakhs and leases it back for 5 years.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_13_1",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Sale and Leaseback Transactions & Subleases, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Sale and Leaseback Transactions & Subleases, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_13_2",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Sale and Leaseback Transactions & Subleases during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_13_3",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Sale and Leaseback Transactions & Subleases, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_13_4",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Sale and Leaseback Transactions & Subleases?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_13_5",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Sale and Leaseback Transactions & Subleases under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_14",
    "subjectId": "FR",
    "chapterName": "Financial Instruments (Ind AS 32)",
    "scenarioTitle": "Case Scenario 14: Compound Financial Instruments & Split Accounting",
    "scenarioText": "T Ltd issues 1,00,000 10% convertible debentures of ₹ 100 each for 3 years. Market rate for similar non-convertible debt = 12%.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_14_1",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 32)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Compound Financial Instruments & Split Accounting, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Compound Financial Instruments & Split Accounting, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_14_2",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 32)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Compound Financial Instruments & Split Accounting during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_14_3",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 32)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Compound Financial Instruments & Split Accounting, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_14_4",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 32)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Compound Financial Instruments & Split Accounting?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_14_5",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 32)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Compound Financial Instruments & Split Accounting under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_15",
    "subjectId": "FR",
    "chapterName": "Financial Instruments (Ind AS 109)",
    "scenarioTitle": "Case Scenario 15: Expected Credit Loss (ECL) Model & Impairment",
    "scenarioText": "U Ltd has trade receivables portfolio of ₹ 10,00,000. Applies simplified approach using provision matrix.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_15_1",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Expected Credit Loss (ECL) Model & Impairment, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Expected Credit Loss (ECL) Model & Impairment, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_15_2",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Expected Credit Loss (ECL) Model & Impairment during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_15_3",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Expected Credit Loss (ECL) Model & Impairment, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_15_4",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Expected Credit Loss (ECL) Model & Impairment?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_15_5",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Expected Credit Loss (ECL) Model & Impairment under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_16",
    "subjectId": "FR",
    "chapterName": "Financial Instruments (Ind AS 109)",
    "scenarioTitle": "Case Scenario 16: Hedge Accounting & Cash Flow Hedges",
    "scenarioText": "V Ltd designates forward contract to hedge highly probable foreign currency sale.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_16_1",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Hedge Accounting & Cash Flow Hedges, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Hedge Accounting & Cash Flow Hedges, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_16_2",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Hedge Accounting & Cash Flow Hedges during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_16_3",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Hedge Accounting & Cash Flow Hedges, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_16_4",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Hedge Accounting & Cash Flow Hedges?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_16_5",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Hedge Accounting & Cash Flow Hedges under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_17",
    "subjectId": "FR",
    "chapterName": "Share Based Payments (Ind AS 102)",
    "scenarioTitle": "Case Scenario 17: Equity Settled vs Cash Settled Stock Options",
    "scenarioText": "W Ltd grants 1,000 stock options to 100 employees with 3-year vesting period. Fair value at grant date = ₹ 30/option.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_17_1",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Equity Settled vs Cash Settled Stock Options, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Equity Settled vs Cash Settled Stock Options, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_17_2",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Equity Settled vs Cash Settled Stock Options during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_17_3",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Equity Settled vs Cash Settled Stock Options, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_17_4",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Equity Settled vs Cash Settled Stock Options?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_17_5",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Equity Settled vs Cash Settled Stock Options under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_18",
    "subjectId": "FR",
    "chapterName": "Share Based Payments (Ind AS 102)",
    "scenarioTitle": "Case Scenario 18: Vesting Conditions & Modifications to Grant Terms",
    "scenarioText": "X Ltd modifies stock option exercise price during year 2 when share price drops.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_18_1",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Vesting Conditions & Modifications to Grant Terms, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Vesting Conditions & Modifications to Grant Terms, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_18_2",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Vesting Conditions & Modifications to Grant Terms during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_18_3",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Vesting Conditions & Modifications to Grant Terms, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_18_4",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Vesting Conditions & Modifications to Grant Terms?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_18_5",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Vesting Conditions & Modifications to Grant Terms under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_19",
    "subjectId": "FR",
    "chapterName": "Employee Benefits (Ind AS 19)",
    "scenarioTitle": "Case Scenario 19: Defined Benefit Plans, Actuarial Gains/Losses & OCI",
    "scenarioText": "Y Ltd maintains defined benefit pension plan. Present value of obligation = ₹ 50 lakhs, Fair value of plan assets = ₹ 45 lakhs.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_19_1",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Defined Benefit Plans, Actuarial Gains/Losses & OCI, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Defined Benefit Plans, Actuarial Gains/Losses & OCI, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_19_2",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Defined Benefit Plans, Actuarial Gains/Losses & OCI during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_19_3",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Defined Benefit Plans, Actuarial Gains/Losses & OCI, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_19_4",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Defined Benefit Plans, Actuarial Gains/Losses & OCI?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_19_5",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Defined Benefit Plans, Actuarial Gains/Losses & OCI under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_20",
    "subjectId": "FR",
    "chapterName": "Property, Plant & Equipment (Ind AS 16)",
    "scenarioTitle": "Case Scenario 20: Decommissioning Provisions & Revaluation Model",
    "scenarioText": "Z Ltd constructs power plant costing ₹ 500 crores with dismantling obligation of ₹ 50 crores in 20 years.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_20_1",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Decommissioning Provisions & Revaluation Model, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Decommissioning Provisions & Revaluation Model, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_20_2",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Decommissioning Provisions & Revaluation Model during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_20_3",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Decommissioning Provisions & Revaluation Model, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_20_4",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Decommissioning Provisions & Revaluation Model?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_20_5",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Decommissioning Provisions & Revaluation Model under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_21",
    "subjectId": "FR",
    "chapterName": "Intangible Assets (Ind AS 38)",
    "scenarioTitle": "Case Scenario 21: Research & Development Expenditure & Website Costs",
    "scenarioText": "Alpha Ltd incurs ₹ 20 lakhs research and ₹ 30 lakhs development costs for new pharmaceutical patent.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_21_1",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Research & Development Expenditure & Website Costs, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Research & Development Expenditure & Website Costs, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_21_2",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Research & Development Expenditure & Website Costs during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_21_3",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Research & Development Expenditure & Website Costs, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_21_4",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Research & Development Expenditure & Website Costs?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_21_5",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Research & Development Expenditure & Website Costs under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_22",
    "subjectId": "FR",
    "chapterName": "Impairment of Assets (Ind AS 36)",
    "scenarioTitle": "Case Scenario 22: Cash Generating Units (CGU) & Goodwill Impairment",
    "scenarioText": "Beta Ltd evaluates CGU with carrying amount ₹ 120 crores including ₹ 20 crores goodwill. Recoverable amount = ₹ 90 crores.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_22_1",
        "subjectId": "FR",
        "chapterName": "Impairment of Assets (Ind AS 36)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Cash Generating Units (CGU) & Goodwill Impairment, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Cash Generating Units (CGU) & Goodwill Impairment, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_22_2",
        "subjectId": "FR",
        "chapterName": "Impairment of Assets (Ind AS 36)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Cash Generating Units (CGU) & Goodwill Impairment during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_22_3",
        "subjectId": "FR",
        "chapterName": "Impairment of Assets (Ind AS 36)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Cash Generating Units (CGU) & Goodwill Impairment, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_22_4",
        "subjectId": "FR",
        "chapterName": "Impairment of Assets (Ind AS 36)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Cash Generating Units (CGU) & Goodwill Impairment?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_22_5",
        "subjectId": "FR",
        "chapterName": "Impairment of Assets (Ind AS 36)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Cash Generating Units (CGU) & Goodwill Impairment under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_23",
    "subjectId": "FR",
    "chapterName": "Provisions, Contingent Liabilities & Assets (Ind AS 37)",
    "scenarioTitle": "Case Scenario 23: Onerous Contracts & Restructuring Provisions",
    "scenarioText": "Gamma Ltd has non-cancellable operating lease contract for factory building no longer in use.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_23_1",
        "subjectId": "FR",
        "chapterName": "Provisions, Contingent Liabilities & Assets (Ind AS 37)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Onerous Contracts & Restructuring Provisions, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Onerous Contracts & Restructuring Provisions, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_23_2",
        "subjectId": "FR",
        "chapterName": "Provisions, Contingent Liabilities & Assets (Ind AS 37)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Onerous Contracts & Restructuring Provisions during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_23_3",
        "subjectId": "FR",
        "chapterName": "Provisions, Contingent Liabilities & Assets (Ind AS 37)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Onerous Contracts & Restructuring Provisions, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_23_4",
        "subjectId": "FR",
        "chapterName": "Provisions, Contingent Liabilities & Assets (Ind AS 37)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Onerous Contracts & Restructuring Provisions?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_23_5",
        "subjectId": "FR",
        "chapterName": "Provisions, Contingent Liabilities & Assets (Ind AS 37)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Onerous Contracts & Restructuring Provisions under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_24",
    "subjectId": "FR",
    "chapterName": "Income Taxes (Ind AS 12)",
    "scenarioTitle": "Case Scenario 24: Deferred Tax Assets, Tax Base & Business Combinations",
    "scenarioText": "Delta Ltd has temporary difference from accelerated tax depreciation and unabsorbed tax losses.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_24_1",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Deferred Tax Assets, Tax Base & Business Combinations, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Deferred Tax Assets, Tax Base & Business Combinations, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_24_2",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Deferred Tax Assets, Tax Base & Business Combinations during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_24_3",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Deferred Tax Assets, Tax Base & Business Combinations, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_24_4",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Deferred Tax Assets, Tax Base & Business Combinations?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_24_5",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Deferred Tax Assets, Tax Base & Business Combinations under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_25",
    "subjectId": "FR",
    "chapterName": "Foreign Currency Transactions (Ind AS 21)",
    "scenarioTitle": "Case Scenario 25: Functional Currency & Overseas Subsidiary Translation",
    "scenarioText": "Epsilon Ltd operates foreign branch in USA. Evaluates functional currency under Ind AS 21.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_25_1",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Functional Currency & Overseas Subsidiary Translation, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Functional Currency & Overseas Subsidiary Translation, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_25_2",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Functional Currency & Overseas Subsidiary Translation during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_25_3",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Functional Currency & Overseas Subsidiary Translation, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_25_4",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Functional Currency & Overseas Subsidiary Translation?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_25_5",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Functional Currency & Overseas Subsidiary Translation under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_26",
    "subjectId": "FR",
    "chapterName": "Accounting Policies & Errors (Ind AS 8)",
    "scenarioTitle": "Case Scenario 26: Prior Period Error Restatement vs Change in Estimate",
    "scenarioText": "Zeta Ltd discovers error in inventory valuation of previous financial year.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_26_1",
        "subjectId": "FR",
        "chapterName": "Accounting Policies & Errors (Ind AS 8)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Prior Period Error Restatement vs Change in Estimate, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Prior Period Error Restatement vs Change in Estimate, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_26_2",
        "subjectId": "FR",
        "chapterName": "Accounting Policies & Errors (Ind AS 8)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Prior Period Error Restatement vs Change in Estimate during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_26_3",
        "subjectId": "FR",
        "chapterName": "Accounting Policies & Errors (Ind AS 8)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Prior Period Error Restatement vs Change in Estimate, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_26_4",
        "subjectId": "FR",
        "chapterName": "Accounting Policies & Errors (Ind AS 8)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Prior Period Error Restatement vs Change in Estimate?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_26_5",
        "subjectId": "FR",
        "chapterName": "Accounting Policies & Errors (Ind AS 8)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Prior Period Error Restatement vs Change in Estimate under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_27",
    "subjectId": "FR",
    "chapterName": "Events After Reporting Period (Ind AS 10)",
    "scenarioTitle": "Case Scenario 27: Adjusting Events & Going Concern Assessment",
    "scenarioText": "Eta Ltd experiences major customer insolvency on 15 April before financial statements authorization.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_27_1",
        "subjectId": "FR",
        "chapterName": "Events After Reporting Period (Ind AS 10)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Adjusting Events & Going Concern Assessment, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Adjusting Events & Going Concern Assessment, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_27_2",
        "subjectId": "FR",
        "chapterName": "Events After Reporting Period (Ind AS 10)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Adjusting Events & Going Concern Assessment during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_27_3",
        "subjectId": "FR",
        "chapterName": "Events After Reporting Period (Ind AS 10)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Adjusting Events & Going Concern Assessment, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_27_4",
        "subjectId": "FR",
        "chapterName": "Events After Reporting Period (Ind AS 10)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Adjusting Events & Going Concern Assessment?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_27_5",
        "subjectId": "FR",
        "chapterName": "Events After Reporting Period (Ind AS 10)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Adjusting Events & Going Concern Assessment under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_28",
    "subjectId": "FR",
    "chapterName": "Consolidated Financial Statements (Ind AS 110)",
    "scenarioTitle": "Case Scenario 28: Control Assessment & Non-Controlling Interest (NCI)",
    "scenarioText": "Theta Ltd acquires 70% voting rights in Omni Ltd. Evaluates potential voting rights and board control.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_28_1",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Control Assessment & Non-Controlling Interest (NCI), what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Control Assessment & Non-Controlling Interest (NCI), initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_28_2",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Control Assessment & Non-Controlling Interest (NCI) during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_28_3",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Control Assessment & Non-Controlling Interest (NCI), which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_28_4",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Control Assessment & Non-Controlling Interest (NCI)?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_28_5",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Control Assessment & Non-Controlling Interest (NCI) under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_29",
    "subjectId": "FR",
    "chapterName": "Consolidated Financial Statements (Ind AS 110)",
    "scenarioTitle": "Case Scenario 29: Step Acquisition & Disposal of Subsidiary",
    "scenarioText": "Iota Ltd holds 30% associate interest, then acquires additional 40% equity to gain control.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_29_1",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Step Acquisition & Disposal of Subsidiary, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Step Acquisition & Disposal of Subsidiary, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_29_2",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Step Acquisition & Disposal of Subsidiary during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_29_3",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Step Acquisition & Disposal of Subsidiary, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_29_4",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Step Acquisition & Disposal of Subsidiary?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_29_5",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Step Acquisition & Disposal of Subsidiary under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_30",
    "subjectId": "FR",
    "chapterName": "Joint Arrangements (Ind AS 111)",
    "scenarioTitle": "Case Scenario 30: Joint Operation vs Joint Venture Classification",
    "scenarioText": "Kappa Ltd and Lambda Ltd form joint vehicle to construct public pipeline.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_30_1",
        "subjectId": "FR",
        "chapterName": "Joint Arrangements (Ind AS 111)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Joint Operation vs Joint Venture Classification, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Joint Operation vs Joint Venture Classification, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_30_2",
        "subjectId": "FR",
        "chapterName": "Joint Arrangements (Ind AS 111)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Joint Operation vs Joint Venture Classification during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_30_3",
        "subjectId": "FR",
        "chapterName": "Joint Arrangements (Ind AS 111)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Joint Operation vs Joint Venture Classification, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_30_4",
        "subjectId": "FR",
        "chapterName": "Joint Arrangements (Ind AS 111)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Joint Operation vs Joint Venture Classification?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_30_5",
        "subjectId": "FR",
        "chapterName": "Joint Arrangements (Ind AS 111)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Joint Operation vs Joint Venture Classification under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_31",
    "subjectId": "FR",
    "chapterName": "Fair Value Measurement (Ind AS 113)",
    "scenarioTitle": "Case Scenario 31: Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use",
    "scenarioText": "Mu Ltd measures land and unquoted equity investments under Ind AS 113 fair value hierarchy.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_31_1",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_31_2",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_31_3",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_31_4",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_31_5",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Fair Value Hierarchy Levels 1, 2, 3 & Highest/Best Use under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_32",
    "subjectId": "FR",
    "chapterName": "Agriculture (Ind AS 41)",
    "scenarioTitle": "Case Scenario 32: Biological Assets & Bearer Plants (Ind AS 16)",
    "scenarioText": "Nu Ltd operates tea plantation with bearer plants and dairy livestock.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_32_1",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Biological Assets & Bearer Plants (Ind AS 16), what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Biological Assets & Bearer Plants (Ind AS 16), initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_32_2",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Biological Assets & Bearer Plants (Ind AS 16) during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_32_3",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Biological Assets & Bearer Plants (Ind AS 16), which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_32_4",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Biological Assets & Bearer Plants (Ind AS 16)?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_32_5",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Biological Assets & Bearer Plants (Ind AS 16) under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_33",
    "subjectId": "FR",
    "chapterName": "First Time Adoption of Ind AS (Ind AS 101)",
    "scenarioTitle": "Case Scenario 33: Deemed Cost Exemptions & Retrospective Adjustments",
    "scenarioText": "Xi Ltd adopts Ind AS for the first time on 1 April 20X2.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_33_1",
        "subjectId": "FR",
        "chapterName": "First Time Adoption of Ind AS (Ind AS 101)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Deemed Cost Exemptions & Retrospective Adjustments, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Deemed Cost Exemptions & Retrospective Adjustments, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_33_2",
        "subjectId": "FR",
        "chapterName": "First Time Adoption of Ind AS (Ind AS 101)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Deemed Cost Exemptions & Retrospective Adjustments during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_33_3",
        "subjectId": "FR",
        "chapterName": "First Time Adoption of Ind AS (Ind AS 101)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Deemed Cost Exemptions & Retrospective Adjustments, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_33_4",
        "subjectId": "FR",
        "chapterName": "First Time Adoption of Ind AS (Ind AS 101)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Deemed Cost Exemptions & Retrospective Adjustments?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_33_5",
        "subjectId": "FR",
        "chapterName": "First Time Adoption of Ind AS (Ind AS 101)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Deemed Cost Exemptions & Retrospective Adjustments under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_34",
    "subjectId": "FR",
    "chapterName": "Statement of Cash Flows (Ind AS 7)",
    "scenarioTitle": "Case Scenario 34: Operating, Investing & Financing Cash Flow Splits",
    "scenarioText": "Omicron Ltd reports bank overdrafts, interest paid, and foreign exchange gains in cash flow statement.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_34_1",
        "subjectId": "FR",
        "chapterName": "Statement of Cash Flows (Ind AS 7)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Operating, Investing & Financing Cash Flow Splits, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Operating, Investing & Financing Cash Flow Splits, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_34_2",
        "subjectId": "FR",
        "chapterName": "Statement of Cash Flows (Ind AS 7)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Operating, Investing & Financing Cash Flow Splits during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_34_3",
        "subjectId": "FR",
        "chapterName": "Statement of Cash Flows (Ind AS 7)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Operating, Investing & Financing Cash Flow Splits, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_34_4",
        "subjectId": "FR",
        "chapterName": "Statement of Cash Flows (Ind AS 7)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Operating, Investing & Financing Cash Flow Splits?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_34_5",
        "subjectId": "FR",
        "chapterName": "Statement of Cash Flows (Ind AS 7)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Operating, Investing & Financing Cash Flow Splits under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_35",
    "subjectId": "FR",
    "chapterName": "Earnings Per Share (Ind AS 33)",
    "scenarioTitle": "Case Scenario 35: Basic EPS, Diluted EPS & Convertible Debentures",
    "scenarioText": "Pi Ltd calculates basic and diluted EPS considering convertible preference shares and stock options.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_35_1",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Basic EPS, Diluted EPS & Convertible Debentures, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Basic EPS, Diluted EPS & Convertible Debentures, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_35_2",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Basic EPS, Diluted EPS & Convertible Debentures during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_35_3",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Basic EPS, Diluted EPS & Convertible Debentures, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_35_4",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Basic EPS, Diluted EPS & Convertible Debentures?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_35_5",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Basic EPS, Diluted EPS & Convertible Debentures under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_36",
    "subjectId": "FR",
    "chapterName": "Borrowing Costs (Ind AS 23)",
    "scenarioTitle": "Case Scenario 36: Capitalisation Period & Weighted Average Borrowing Rate",
    "scenarioText": "Rho Ltd borrows funds specifically and generally to construct manufacturing facility.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_36_1",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Capitalisation Period & Weighted Average Borrowing Rate, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Capitalisation Period & Weighted Average Borrowing Rate, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_36_2",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Capitalisation Period & Weighted Average Borrowing Rate during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_36_3",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Capitalisation Period & Weighted Average Borrowing Rate, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_36_4",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Capitalisation Period & Weighted Average Borrowing Rate?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_36_5",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Capitalisation Period & Weighted Average Borrowing Rate under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_37",
    "subjectId": "FR",
    "chapterName": "Government Grants (Ind AS 20)",
    "scenarioTitle": "Case Scenario 37: Capital Grants & Grant Repayment Accounting",
    "scenarioText": "Sigma Ltd receives government grant for purchase of equipment with 5-year retention condition.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_37_1",
        "subjectId": "FR",
        "chapterName": "Government Grants (Ind AS 20)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Capital Grants & Grant Repayment Accounting, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Capital Grants & Grant Repayment Accounting, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_37_2",
        "subjectId": "FR",
        "chapterName": "Government Grants (Ind AS 20)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Capital Grants & Grant Repayment Accounting during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_37_3",
        "subjectId": "FR",
        "chapterName": "Government Grants (Ind AS 20)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Capital Grants & Grant Repayment Accounting, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_37_4",
        "subjectId": "FR",
        "chapterName": "Government Grants (Ind AS 20)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Capital Grants & Grant Repayment Accounting?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_37_5",
        "subjectId": "FR",
        "chapterName": "Government Grants (Ind AS 20)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Capital Grants & Grant Repayment Accounting under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_38",
    "subjectId": "FR",
    "chapterName": "Related Party Disclosures (Ind AS 24)",
    "scenarioTitle": "Case Scenario 38: KMP Compensation & Government-Related Entities",
    "scenarioText": "Tau Ltd discloses transactions with parent entity, directors, and key management personnel.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_38_1",
        "subjectId": "FR",
        "chapterName": "Related Party Disclosures (Ind AS 24)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for KMP Compensation & Government-Related Entities, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing KMP Compensation & Government-Related Entities, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_38_2",
        "subjectId": "FR",
        "chapterName": "Related Party Disclosures (Ind AS 24)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for KMP Compensation & Government-Related Entities during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_38_3",
        "subjectId": "FR",
        "chapterName": "Related Party Disclosures (Ind AS 24)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under KMP Compensation & Government-Related Entities, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_38_4",
        "subjectId": "FR",
        "chapterName": "Related Party Disclosures (Ind AS 24)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for KMP Compensation & Government-Related Entities?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_38_5",
        "subjectId": "FR",
        "chapterName": "Related Party Disclosures (Ind AS 24)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to KMP Compensation & Government-Related Entities under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_39",
    "subjectId": "FR",
    "chapterName": "Service Concession Arrangements (Appendix D Ind AS 115)",
    "scenarioTitle": "Case Scenario 39: Financial Asset Model vs Intangible Asset Model",
    "scenarioText": "Upsilon Ltd builds toll road under build-operate-transfer concession agreement.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_39_1",
        "subjectId": "FR",
        "chapterName": "Service Concession Arrangements (Appendix D Ind AS 115)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Financial Asset Model vs Intangible Asset Model, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Financial Asset Model vs Intangible Asset Model, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_39_2",
        "subjectId": "FR",
        "chapterName": "Service Concession Arrangements (Appendix D Ind AS 115)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Financial Asset Model vs Intangible Asset Model during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_39_3",
        "subjectId": "FR",
        "chapterName": "Service Concession Arrangements (Appendix D Ind AS 115)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Financial Asset Model vs Intangible Asset Model, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_39_4",
        "subjectId": "FR",
        "chapterName": "Service Concession Arrangements (Appendix D Ind AS 115)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Financial Asset Model vs Intangible Asset Model?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_39_5",
        "subjectId": "FR",
        "chapterName": "Service Concession Arrangements (Appendix D Ind AS 115)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Financial Asset Model vs Intangible Asset Model under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_40",
    "subjectId": "FR",
    "chapterName": "Interim Financial Reporting (Ind AS 34)",
    "scenarioTitle": "Case Scenario 40: Discrete Period Method & Tax Expense Estimation",
    "scenarioText": "Phi Ltd prepares quarterly interim financial report for Q1 and Q2.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_40_1",
        "subjectId": "FR",
        "chapterName": "Interim Financial Reporting (Ind AS 34)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Discrete Period Method & Tax Expense Estimation, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Discrete Period Method & Tax Expense Estimation, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_40_2",
        "subjectId": "FR",
        "chapterName": "Interim Financial Reporting (Ind AS 34)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Discrete Period Method & Tax Expense Estimation during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_40_3",
        "subjectId": "FR",
        "chapterName": "Interim Financial Reporting (Ind AS 34)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Discrete Period Method & Tax Expense Estimation, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_40_4",
        "subjectId": "FR",
        "chapterName": "Interim Financial Reporting (Ind AS 34)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Discrete Period Method & Tax Expense Estimation?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_40_5",
        "subjectId": "FR",
        "chapterName": "Interim Financial Reporting (Ind AS 34)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Discrete Period Method & Tax Expense Estimation under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_41",
    "subjectId": "FR",
    "chapterName": "Financial Instruments (Ind AS 109)",
    "scenarioTitle": "Case Scenario 41: Derecognition of Financial Assets & Factoring",
    "scenarioText": "Chi Ltd transfers trade receivables to bank with recourse.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_41_1",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Derecognition of Financial Assets & Factoring, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Derecognition of Financial Assets & Factoring, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_41_2",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Derecognition of Financial Assets & Factoring during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_41_3",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Derecognition of Financial Assets & Factoring, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_41_4",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Derecognition of Financial Assets & Factoring?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_41_5",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Derecognition of Financial Assets & Factoring under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_42",
    "subjectId": "FR",
    "chapterName": "Leases (Ind AS 116)",
    "scenarioTitle": "Case Scenario 42: Lease Modifications & Covid-19 Rent Concessions",
    "scenarioText": "Psi Ltd agrees with lessor to reduce rent payments during lease term.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_42_1",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Lease Modifications & Covid-19 Rent Concessions, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Lease Modifications & Covid-19 Rent Concessions, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_42_2",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Lease Modifications & Covid-19 Rent Concessions during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_42_3",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Lease Modifications & Covid-19 Rent Concessions, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_42_4",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Lease Modifications & Covid-19 Rent Concessions?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_42_5",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Lease Modifications & Covid-19 Rent Concessions under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_43",
    "subjectId": "FR",
    "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
    "scenarioTitle": "Case Scenario 43: Contract Modifications & Cumulative Catch-Up",
    "scenarioText": "Omega Ltd modifies long-term construction contract scope and price.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_43_1",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Contract Modifications & Cumulative Catch-Up, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Contract Modifications & Cumulative Catch-Up, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_43_2",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Contract Modifications & Cumulative Catch-Up during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_43_3",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Contract Modifications & Cumulative Catch-Up, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_43_4",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Contract Modifications & Cumulative Catch-Up?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_43_5",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Contract Modifications & Cumulative Catch-Up under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_44",
    "subjectId": "FR",
    "chapterName": "Property, Plant & Equipment (Ind AS 16)",
    "scenarioTitle": "Case Scenario 44: Asset Exchange & Capital Work in Progress",
    "scenarioText": "A1 Ltd exchanges land for machinery in transaction lacking commercial substance.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_44_1",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Asset Exchange & Capital Work in Progress, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Asset Exchange & Capital Work in Progress, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_44_2",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Asset Exchange & Capital Work in Progress during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_44_3",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Asset Exchange & Capital Work in Progress, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_44_4",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Asset Exchange & Capital Work in Progress?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_44_5",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Asset Exchange & Capital Work in Progress under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_45",
    "subjectId": "FR",
    "chapterName": "Foreign Currency Transactions (Ind AS 21)",
    "scenarioTitle": "Case Scenario 45: Foreign Currency Long-Term Monetary Items",
    "scenarioText": "B2 Ltd accounts for foreign currency loan drawn for asset construction.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_45_1",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Foreign Currency Long-Term Monetary Items, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Foreign Currency Long-Term Monetary Items, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_45_2",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Foreign Currency Long-Term Monetary Items during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_45_3",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Foreign Currency Long-Term Monetary Items, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_45_4",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Foreign Currency Long-Term Monetary Items?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_45_5",
        "subjectId": "FR",
        "chapterName": "Foreign Currency Transactions (Ind AS 21)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Foreign Currency Long-Term Monetary Items under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_46",
    "subjectId": "FR",
    "chapterName": "Consolidated Financial Statements (Ind AS 110)",
    "scenarioTitle": "Case Scenario 46: Intercompany Profit Elimination & Uniform Accounting",
    "scenarioText": "C3 Ltd eliminates unrealized inventory profit on sales to 80% subsidiary.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_46_1",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Intercompany Profit Elimination & Uniform Accounting, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Intercompany Profit Elimination & Uniform Accounting, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_46_2",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Intercompany Profit Elimination & Uniform Accounting during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_46_3",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Intercompany Profit Elimination & Uniform Accounting, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_46_4",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Intercompany Profit Elimination & Uniform Accounting?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_46_5",
        "subjectId": "FR",
        "chapterName": "Consolidated Financial Statements (Ind AS 110)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Intercompany Profit Elimination & Uniform Accounting under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_47",
    "subjectId": "FR",
    "chapterName": "Provisions & Impairment (Ind AS 37 / Ind AS 36)",
    "scenarioTitle": "Case Scenario 47: Environmental Restoration & Site Cleanup Provision",
    "scenarioText": "D4 Ltd evaluates site restoration liability discount rate and asset impairment.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_47_1",
        "subjectId": "FR",
        "chapterName": "Provisions & Impairment (Ind AS 37 / Ind AS 36)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Environmental Restoration & Site Cleanup Provision, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Environmental Restoration & Site Cleanup Provision, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_47_2",
        "subjectId": "FR",
        "chapterName": "Provisions & Impairment (Ind AS 37 / Ind AS 36)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Environmental Restoration & Site Cleanup Provision during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_47_3",
        "subjectId": "FR",
        "chapterName": "Provisions & Impairment (Ind AS 37 / Ind AS 36)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Environmental Restoration & Site Cleanup Provision, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_47_4",
        "subjectId": "FR",
        "chapterName": "Provisions & Impairment (Ind AS 37 / Ind AS 36)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Environmental Restoration & Site Cleanup Provision?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_47_5",
        "subjectId": "FR",
        "chapterName": "Provisions & Impairment (Ind AS 37 / Ind AS 36)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Environmental Restoration & Site Cleanup Provision under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_48",
    "subjectId": "FR",
    "chapterName": "Employee Benefits (Ind AS 19)",
    "scenarioTitle": "Case Scenario 48: Plan Settlements & Past Service Cost",
    "scenarioText": "E5 Ltd amends gratuity scheme increasing benefit formula.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_48_1",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Plan Settlements & Past Service Cost, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Plan Settlements & Past Service Cost, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_48_2",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Plan Settlements & Past Service Cost during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_48_3",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Plan Settlements & Past Service Cost, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_48_4",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Plan Settlements & Past Service Cost?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_48_5",
        "subjectId": "FR",
        "chapterName": "Employee Benefits (Ind AS 19)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Plan Settlements & Past Service Cost under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_49",
    "subjectId": "FR",
    "chapterName": "Income Taxes (Ind AS 12)",
    "scenarioTitle": "Case Scenario 49: Deferred Tax on Business Combinations & Unused Losses",
    "scenarioText": "F6 Ltd recognises deferred tax asset on tax losses acquired in business combination.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_49_1",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Deferred Tax on Business Combinations & Unused Losses, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Deferred Tax on Business Combinations & Unused Losses, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_49_2",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Deferred Tax on Business Combinations & Unused Losses during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_49_3",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Deferred Tax on Business Combinations & Unused Losses, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_49_4",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Deferred Tax on Business Combinations & Unused Losses?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_49_5",
        "subjectId": "FR",
        "chapterName": "Income Taxes (Ind AS 12)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Deferred Tax on Business Combinations & Unused Losses under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_50",
    "subjectId": "FR",
    "chapterName": "Intangible Assets (Ind AS 38)",
    "scenarioTitle": "Case Scenario 50: Acquired Intangible Brands & In-Process R&D",
    "scenarioText": "G7 Ltd acquires brand names and customer relationships in acquisition.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_50_1",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Acquired Intangible Brands & In-Process R&D, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Acquired Intangible Brands & In-Process R&D, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_50_2",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Acquired Intangible Brands & In-Process R&D during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_50_3",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Acquired Intangible Brands & In-Process R&D, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_50_4",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Acquired Intangible Brands & In-Process R&D?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_50_5",
        "subjectId": "FR",
        "chapterName": "Intangible Assets (Ind AS 38)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Acquired Intangible Brands & In-Process R&D under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_51",
    "subjectId": "FR",
    "chapterName": "Share Based Payments (Ind AS 102)",
    "scenarioTitle": "Case Scenario 51: Group Share-Based Payment Arrangements",
    "scenarioText": "H8 Ltd parent issues shares to employees of subsidiary entity.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_51_1",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Group Share-Based Payment Arrangements, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Group Share-Based Payment Arrangements, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_51_2",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Group Share-Based Payment Arrangements during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_51_3",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Group Share-Based Payment Arrangements, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_51_4",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Group Share-Based Payment Arrangements?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_51_5",
        "subjectId": "FR",
        "chapterName": "Share Based Payments (Ind AS 102)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Group Share-Based Payment Arrangements under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_52",
    "subjectId": "FR",
    "chapterName": "Financial Instruments (Ind AS 109)",
    "scenarioTitle": "Case Scenario 52: Financial Guarantee Contracts & Expected Loss",
    "scenarioText": "I9 Ltd guarantees bank loan borrowed by its associate entity.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_52_1",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Financial Guarantee Contracts & Expected Loss, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Financial Guarantee Contracts & Expected Loss, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_52_2",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Financial Guarantee Contracts & Expected Loss during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_52_3",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Financial Guarantee Contracts & Expected Loss, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_52_4",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Financial Guarantee Contracts & Expected Loss?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_52_5",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Financial Guarantee Contracts & Expected Loss under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_53",
    "subjectId": "FR",
    "chapterName": "Earnings Per Share (Ind AS 33)",
    "scenarioTitle": "Case Scenario 53: Contingently Issuable Shares & Share Splits",
    "scenarioText": "J10 Ltd executes 2-for-1 share split during financial year.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_53_1",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Contingently Issuable Shares & Share Splits, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Contingently Issuable Shares & Share Splits, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_53_2",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Contingently Issuable Shares & Share Splits during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_53_3",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Contingently Issuable Shares & Share Splits, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_53_4",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Contingently Issuable Shares & Share Splits?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_53_5",
        "subjectId": "FR",
        "chapterName": "Earnings Per Share (Ind AS 33)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Contingently Issuable Shares & Share Splits under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_54",
    "subjectId": "FR",
    "chapterName": "Borrowing Costs (Ind AS 23)",
    "scenarioTitle": "Case Scenario 54: Suspension of Capitalisation During Extended Delays",
    "scenarioText": "K11 Ltd suspends asset construction for 4 months due to technical approvals.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_54_1",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Suspension of Capitalisation During Extended Delays, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Suspension of Capitalisation During Extended Delays, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_54_2",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Suspension of Capitalisation During Extended Delays during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_54_3",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Suspension of Capitalisation During Extended Delays, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_54_4",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Suspension of Capitalisation During Extended Delays?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_54_5",
        "subjectId": "FR",
        "chapterName": "Borrowing Costs (Ind AS 23)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Suspension of Capitalisation During Extended Delays under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_55",
    "subjectId": "FR",
    "chapterName": "Accounting Policies (Ind AS 8)",
    "scenarioTitle": "Case Scenario 55: Voluntary Change in Accounting Policy for Inventory",
    "scenarioText": "L12 Ltd changes inventory formula from FIFO to Weighted Average.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_55_1",
        "subjectId": "FR",
        "chapterName": "Accounting Policies (Ind AS 8)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Voluntary Change in Accounting Policy for Inventory, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Voluntary Change in Accounting Policy for Inventory, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_55_2",
        "subjectId": "FR",
        "chapterName": "Accounting Policies (Ind AS 8)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Voluntary Change in Accounting Policy for Inventory during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_55_3",
        "subjectId": "FR",
        "chapterName": "Accounting Policies (Ind AS 8)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Voluntary Change in Accounting Policy for Inventory, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_55_4",
        "subjectId": "FR",
        "chapterName": "Accounting Policies (Ind AS 8)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Voluntary Change in Accounting Policy for Inventory?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_55_5",
        "subjectId": "FR",
        "chapterName": "Accounting Policies (Ind AS 8)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Voluntary Change in Accounting Policy for Inventory under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_56",
    "subjectId": "FR",
    "chapterName": "Agriculture (Ind AS 41)",
    "scenarioTitle": "Case Scenario 56: Biological Transformation & Harvested Produce",
    "scenarioText": "M13 Ltd measures agricultural produce at point of harvest.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_56_1",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Biological Transformation & Harvested Produce, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Biological Transformation & Harvested Produce, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_56_2",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Biological Transformation & Harvested Produce during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_56_3",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Biological Transformation & Harvested Produce, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_56_4",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Biological Transformation & Harvested Produce?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_56_5",
        "subjectId": "FR",
        "chapterName": "Agriculture (Ind AS 41)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Biological Transformation & Harvested Produce under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_57",
    "subjectId": "FR",
    "chapterName": "Operating Segments (Ind AS 108)",
    "scenarioTitle": "Case Scenario 57: Aggregation Criteria & 10% Reportable Segment Tests",
    "scenarioText": "N14 Ltd evaluates revenue, profit, and asset thresholds for reportable segments.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_57_1",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Aggregation Criteria & 10% Reportable Segment Tests, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Aggregation Criteria & 10% Reportable Segment Tests, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_57_2",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Aggregation Criteria & 10% Reportable Segment Tests during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_57_3",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Aggregation Criteria & 10% Reportable Segment Tests, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_57_4",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Aggregation Criteria & 10% Reportable Segment Tests?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_57_5",
        "subjectId": "FR",
        "chapterName": "Operating Segments (Ind AS 108)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Aggregation Criteria & 10% Reportable Segment Tests under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_58",
    "subjectId": "FR",
    "chapterName": "Fair Value Measurement (Ind AS 113)",
    "scenarioTitle": "Case Scenario 58: Valuation Techniques & Market Participant Assumptions",
    "scenarioText": "O15 Ltd uses income approach and market approach to value unquoted shares.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_58_1",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Valuation Techniques & Market Participant Assumptions, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Valuation Techniques & Market Participant Assumptions, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_58_2",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Valuation Techniques & Market Participant Assumptions during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_58_3",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Valuation Techniques & Market Participant Assumptions, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_58_4",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Valuation Techniques & Market Participant Assumptions?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_58_5",
        "subjectId": "FR",
        "chapterName": "Fair Value Measurement (Ind AS 113)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Valuation Techniques & Market Participant Assumptions under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_59",
    "subjectId": "FR",
    "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
    "scenarioTitle": "Case Scenario 59: Discontinued Operations Presentation in P&L",
    "scenarioText": "P16 Ltd presents single line item for post-tax profit of discontinued operation.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_59_1",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Discontinued Operations Presentation in P&L, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Discontinued Operations Presentation in P&L, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_59_2",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Discontinued Operations Presentation in P&L during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_59_3",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Discontinued Operations Presentation in P&L, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_59_4",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Discontinued Operations Presentation in P&L?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_59_5",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Discontinued Operations Presentation in P&L under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_60",
    "subjectId": "FR",
    "chapterName": "Schedule III & Financial Statements",
    "scenarioTitle": "Case Scenario 60: Div II Balance Sheet Classification & Ratio Disclosures",
    "scenarioText": "Q17 Ltd presents current vs non-current liabilities and key financial ratios.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_60_1",
        "subjectId": "FR",
        "chapterName": "Schedule III & Financial Statements",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Div II Balance Sheet Classification & Ratio Disclosures, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Div II Balance Sheet Classification & Ratio Disclosures, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_60_2",
        "subjectId": "FR",
        "chapterName": "Schedule III & Financial Statements",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Div II Balance Sheet Classification & Ratio Disclosures during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_60_3",
        "subjectId": "FR",
        "chapterName": "Schedule III & Financial Statements",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Div II Balance Sheet Classification & Ratio Disclosures, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_60_4",
        "subjectId": "FR",
        "chapterName": "Schedule III & Financial Statements",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Div II Balance Sheet Classification & Ratio Disclosures?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_60_5",
        "subjectId": "FR",
        "chapterName": "Schedule III & Financial Statements",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Div II Balance Sheet Classification & Ratio Disclosures under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_61",
    "subjectId": "FR",
    "chapterName": "CSR Accounting",
    "scenarioTitle": "Case Scenario 61: Corporate Social Responsibility Provision & Unspent Funds",
    "scenarioText": "R18 Ltd creates provision for unspent CSR obligation under Section 135.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_61_1",
        "subjectId": "FR",
        "chapterName": "CSR Accounting",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Corporate Social Responsibility Provision & Unspent Funds, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Corporate Social Responsibility Provision & Unspent Funds, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_61_2",
        "subjectId": "FR",
        "chapterName": "CSR Accounting",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Corporate Social Responsibility Provision & Unspent Funds during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_61_3",
        "subjectId": "FR",
        "chapterName": "CSR Accounting",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Corporate Social Responsibility Provision & Unspent Funds, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_61_4",
        "subjectId": "FR",
        "chapterName": "CSR Accounting",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Corporate Social Responsibility Provision & Unspent Funds?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_61_5",
        "subjectId": "FR",
        "chapterName": "CSR Accounting",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Corporate Social Responsibility Provision & Unspent Funds under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_62",
    "subjectId": "FR",
    "chapterName": "Business Combinations (Ind AS 103)",
    "scenarioTitle": "Case Scenario 62: Reverse Acquisitions Accounting",
    "scenarioText": "S19 Ltd private entity acquires listed entity T20 Ltd in reverse acquisition.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_62_1",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Reverse Acquisitions Accounting, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Reverse Acquisitions Accounting, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_62_2",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Reverse Acquisitions Accounting during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_62_3",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Reverse Acquisitions Accounting, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_62_4",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Reverse Acquisitions Accounting?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_62_5",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Reverse Acquisitions Accounting under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_63",
    "subjectId": "FR",
    "chapterName": "Business Combinations (Ind AS 103)",
    "scenarioTitle": "Case Scenario 63: Common Control Business Combinations (Appendix C)",
    "scenarioText": "U21 Ltd transfers business under common control pooling of interest method.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_63_1",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Common Control Business Combinations (Appendix C), what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Common Control Business Combinations (Appendix C), initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_63_2",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Common Control Business Combinations (Appendix C) during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_63_3",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Common Control Business Combinations (Appendix C), which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_63_4",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Common Control Business Combinations (Appendix C)?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_63_5",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Common Control Business Combinations (Appendix C) under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_64",
    "subjectId": "FR",
    "chapterName": "Financial Instruments (Ind AS 109)",
    "scenarioTitle": "Case Scenario 64: Classification of Financial Assets - SPPI Test",
    "scenarioText": "V22 Ltd evaluates simple debt instruments and convertible notes under SPPI test.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_64_1",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Classification of Financial Assets - SPPI Test, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Classification of Financial Assets - SPPI Test, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_64_2",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Classification of Financial Assets - SPPI Test during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_64_3",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Classification of Financial Assets - SPPI Test, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_64_4",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Classification of Financial Assets - SPPI Test?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_64_5",
        "subjectId": "FR",
        "chapterName": "Financial Instruments (Ind AS 109)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Classification of Financial Assets - SPPI Test under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_65",
    "subjectId": "FR",
    "chapterName": "Leases (Ind AS 116)",
    "scenarioTitle": "Case Scenario 65: Short-Term Lease Exemption & Low-Value Asset Lease",
    "scenarioText": "W23 Ltd elects practical expedient for IT equipment leases.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_65_1",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Short-Term Lease Exemption & Low-Value Asset Lease, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Short-Term Lease Exemption & Low-Value Asset Lease, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_65_2",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Short-Term Lease Exemption & Low-Value Asset Lease during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_65_3",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Short-Term Lease Exemption & Low-Value Asset Lease, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_65_4",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Short-Term Lease Exemption & Low-Value Asset Lease?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_65_5",
        "subjectId": "FR",
        "chapterName": "Leases (Ind AS 116)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Short-Term Lease Exemption & Low-Value Asset Lease under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_66",
    "subjectId": "FR",
    "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
    "scenarioTitle": "Case Scenario 66: Consignment Arrangements & Bill-and-Hold Sales",
    "scenarioText": "X24 Ltd evaluates transfer of control for bill-and-hold inventory sales.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_66_1",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Consignment Arrangements & Bill-and-Hold Sales, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Consignment Arrangements & Bill-and-Hold Sales, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_66_2",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Consignment Arrangements & Bill-and-Hold Sales during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_66_3",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Consignment Arrangements & Bill-and-Hold Sales, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_66_4",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Consignment Arrangements & Bill-and-Hold Sales?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_66_5",
        "subjectId": "FR",
        "chapterName": "Revenue from Contracts with Customers (Ind AS 115)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Consignment Arrangements & Bill-and-Hold Sales under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_67",
    "subjectId": "FR",
    "chapterName": "Property, Plant & Equipment (Ind AS 16)",
    "scenarioTitle": "Case Scenario 67: Component Depreciation & Major Overhaul Costs",
    "scenarioText": "Y25 Ltd capitalises major aircraft overhaul costs and depreciates components.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_67_1",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Component Depreciation & Major Overhaul Costs, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Component Depreciation & Major Overhaul Costs, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_67_2",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Component Depreciation & Major Overhaul Costs during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_67_3",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Component Depreciation & Major Overhaul Costs, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_67_4",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Component Depreciation & Major Overhaul Costs?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_67_5",
        "subjectId": "FR",
        "chapterName": "Property, Plant & Equipment (Ind AS 16)",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Component Depreciation & Major Overhaul Costs under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  },
  {
    "id": "FR_CS_68",
    "subjectId": "FR",
    "chapterName": "Integrated Financial Reporting",
    "scenarioTitle": "Case Scenario 68: Comprehensive Schedule III Disclosures & Ind AS Synthesis",
    "scenarioText": "Z26 Ltd compiles financial statements integrating Ind AS 115, 116, 109 and Schedule III Division II requirements.\n\nComprehensive statutory evaluation scenario covering legal conditions, numerical calculations, and statutory financial reporting presentation under the ICAI CA Final curriculum.",
    "subQuestions": [
      {
        "id": "FR_CS_68_1",
        "subjectId": "FR",
        "chapterName": "Integrated Financial Reporting",
        "type": "case_sub",
        "questionText": "1. Under the governing Ind AS for Comprehensive Schedule III Disclosures & Ind AS Synthesis, what is the initial accounting recognition / measurement requirement on transaction date?",
        "options": [
          "Recognize at Fair Value / Present Value of cash flows as mandated by Ind AS principles",
          "Recognize at nominal transaction amount without discounting or present value adjustments",
          "Keep off-balance sheet and disclose only in notes to accounts",
          "Credit directly to Capital Reserve without routing through P&L or OCI"
        ],
        "correctOptionIndex": 0,
        "explanation": "Under the relevant Ind AS governing Comprehensive Schedule III Disclosures & Ind AS Synthesis, initial measurement is mandated at Fair Value or Present Value of future cash flows."
      },
      {
        "id": "FR_CS_68_2",
        "subjectId": "FR",
        "chapterName": "Integrated Financial Reporting",
        "type": "case_sub",
        "questionText": "2. What is the subsequent Profit & Loss or Other Comprehensive Income (OCI) accounting impact for Comprehensive Schedule III Disclosures & Ind AS Synthesis during the reporting year?",
        "options": [
          "Recognized in P&L or OCI as dictated by specific standard measurement & amortisation rules",
          "Entire transaction impact deferred indefinitely until final cash settlement",
          "Debited directly to Securities Premium Account under Schedule III",
          "No P&L or OCI impact is allowed until the contract expires"
        ],
        "correctOptionIndex": 0,
        "explanation": "Subsequent measurement charges (interest, amortisation, depreciation, or fair value re-measurements) are routed to P&L or OCI as required by the standard."
      },
      {
        "id": "FR_CS_68_3",
        "subjectId": "FR",
        "chapterName": "Integrated Financial Reporting",
        "type": "case_sub",
        "questionText": "3. Regarding statutory conditions and exceptions under Comprehensive Schedule III Disclosures & Ind AS Synthesis, which condition must be fulfilled for compliant accounting treatment?",
        "options": [
          "Substance over form, contractual terms, and explicit Ind AS statutory recognition criteria",
          "Board resolution approval alone without meeting standard criteria",
          "Tax department clearance before financial statement finalisation",
          "Cash realization within 30 days of reporting date"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS statutory compliance mandates adherence to contractual substance, probability thresholds, and reliable measurement rules."
      },
      {
        "id": "FR_CS_68_4",
        "subjectId": "FR",
        "chapterName": "Integrated Financial Reporting",
        "type": "case_sub",
        "questionText": "4. What is the carrying value presentation on the Statement of Financial Position (Balance Sheet) at year-end for Comprehensive Schedule III Disclosures & Ind AS Synthesis?",
        "options": [
          "Presented as Current / Non-Current as per Schedule III Division II after necessary adjustments",
          "Classified exclusively under Unamortized Pre-operative Expenses",
          "Presented at historical original invoice cost without impairment or amortisation",
          "Netted off against Share Capital"
        ],
        "correctOptionIndex": 0,
        "explanation": "Schedule III Division II requires proper current / non-current asset/liability classification reflecting net carrying amount after Ind AS adjustments."
      },
      {
        "id": "FR_CS_68_5",
        "subjectId": "FR",
        "chapterName": "Integrated Financial Reporting",
        "type": "case_sub",
        "questionText": "5. Which mandatory disclosure requirement applies to Comprehensive Schedule III Disclosures & Ind AS Synthesis under ICAI CA Final Financial Reporting guidelines?",
        "options": [
          "Detailed qualitative and quantitative note disclosures including risk exposure & accounting policy",
          "No disclosure required if transaction value is under ₹ 1 crore",
          "Verbal disclosure at Annual General Meeting (AGM) only",
          "Disclosed exclusively in the Tax Audit Report under Section 44AB"
        ],
        "correctOptionIndex": 0,
        "explanation": "Ind AS mandates comprehensive qualitative and quantitative note disclosures in the financial statements detailing accounting policies, estimates, and risks."
      }
    ]
  }
];
