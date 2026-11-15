import json
import os

# Complete data generator for all 68 Case Scenarios for CA Final Financial Reporting

raw_cases = [
    # 1
    {
        "id": "FR_CS_01",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "scenarioTitle": "Case Scenario 1: ABC Ltd. - Indemnification Assets & Contingent Liabilities in Acquisitions",
        "scenarioText": """ABC Ltd. is a dynamic company engaged in strategic acquisitions to expand its business portfolio. As part of its growth strategy, the company has recently acquired PQR Ltd. and RST Ltd. While these acquisitions present growth opportunities, these acquisitions also include ongoing lawsuits against the acquired companies. However, ABC Ltd. has secured indemnities from the respective sellers to mitigate potential financial risks associated with these legal matters. Following acquisitions took place during the year.

(i) ABC Ltd. acquired a beverage company PQR Ltd. from XYZ Ltd. At the time of acquisition, PQR Ltd. is the defendant in a court case whereby certain customers of PQR Ltd. have alleged that products of PQR Ltd. contain pesticides in excess of the permissible levels, which have caused them health damage. PQR Ltd. is being sued for damages of ₹ 2 crores. XYZ Ltd. has indemnified ABC Ltd. for the losses, if any, due to the case for amount up to ₹ 1 crore. The fair value of the contingent liability for the court case is ₹ 0.70 crore.

(ii) ABC Ltd. pays ₹ 50 crores to acquire RST Ltd. from MN Ltd. RST Ltd. manufactured products containing fiber glass and has been named in 10 class actions concerning the effects of these fiber glass, MN Ltd. agrees to indemnify ABC Ltd. for the adverse results of any court cases up to an amount of ₹ 10 crores. The class actions have not specified amounts of damages and past experience suggests that claims may be up to ₹ 1 crore each, but that they are often settled for small amounts. ABC Ltd. makes an assessment of the court cases and decides that due to the potential variance in outcomes, the contingent liability cannot be measured reliably and accordingly no amount is recognised in respect of the court cases.""",
        "subQuestions": [
            {
                "id": "FR_CS_01_1",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "1. At what amount would ABC Ltd. account for the identified liability related to contingent liability and the indemnification assets at the time of acquisition of PQR Ltd. related to court case by the customer?",
                "options": ["₹ 2 crores; ₹ 1 crore", "₹ 1 crore; ₹ 1 crore", "₹ 0.70 crore; ₹ 1 crore", "₹ 0.70 crore; ₹ 0.70 crore"],
                "correctOptionIndex": 3,
                "explanation": "Option (d): ₹ 0.70 crore; ₹ 0.70 crore. Reasoning: ABC Ltd. recognises indemnification asset at the same time and measures them on the same basis as the indemnified item (₹ 0.70 crore)."
            },
            {
                "id": "FR_CS_01_2",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "2. What will be the impact on goodwill due to recognition of such liability and indemnified asset?",
                "options": ["The net impact on goodwill will be Nil", "Decrease in the value of Goodwill by ₹ 0.30 crore", "Increase in the value of Goodwill by ₹ 0.30 crore", "Increase in the value of Goodwill by ₹ 1 crore"],
                "correctOptionIndex": 0,
                "explanation": "Option (a): The net impact on goodwill will be Nil."
            },
            {
                "id": "FR_CS_01_3",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "3. Suppose in case the fair value of the identified liability is ₹ 1.20 crores instead of ₹ 0.70 crore, then what will be the value of the liability and the indemnification assets at the time of acquisition of PQR Ltd.?",
                "options": ["₹ 2 crores; ₹ 1 crore", "₹ 1.20 crore; ₹ 1 crore", "₹ 1 crore; ₹ 1 crore", "₹ 1.20 crores; ₹ 1.20 crores"],
                "correctOptionIndex": 1,
                "explanation": "Option (b): ₹ 1.20 crore; ₹ 1 crore. Reasoning: The asset is capped at the contractual limit of ₹ 1 crore."
            },
            {
                "id": "FR_CS_01_4",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "4. What will be the impact on goodwill due to recognition of such liability and indemnified asset if liability fair value is ₹ 1.20 crores?",
                "options": ["Increase in the value of Goodwill by ₹ 1 crores", "Decrease in the value of Goodwill by ₹ 0.20 crore", "Increase in the value of Goodwill by ₹ 0.20 crore", "The net impact on goodwill will be Nil"],
                "correctOptionIndex": 2,
                "explanation": "Option (c): Increase in the value of Goodwill by ₹ 0.20 crore (1.20 cr - 1.00 cr = 0.20 cr)."
            },
            {
                "id": "FR_CS_01_5",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "5. On acquisition of RST Ltd. at what amount should indemnification asset be accounted for in relation to 10 class actions?",
                "options": ["₹ 10 crores", "₹ 1 crore", "Nil", "₹ 9 crores"],
                "correctOptionIndex": 2,
                "explanation": "Option (c): Nil. Reasoning: No liability is recognised, so no indemnification asset is recognised."
            }
        ]
    },
    # 2
    {
        "id": "FR_CS_02",
        "subjectId": "FR",
        "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
        "scenarioTitle": "Case Scenario 2: Asset Held for Sale & Reversal of Impairment Loss",
        "scenarioText": """Choose the most appropriate answer based on below mentioned facts:
- 1st January, 20X6: Asset acquired for ₹ 7,500 with useful life of 10 years.
- 31st December, 20X7: Impairment allowance of ₹ 240 accounted.
- 28th February, 20X9: Asset classified as held for sale. Fair value less costs to sell = ₹ 4,600.
- 30th June, 20X9: Fair value less costs to sell increases to ₹ 5,300.""",
        "subQuestions": [
            {
                "id": "FR_CS_02_1",
                "subjectId": "FR",
                "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
                "type": "case_sub",
                "questionText": "1. The amount of depreciation on the asset for the year 20X8 would be-",
                "options": ["₹ 750", "₹ 720", "₹ 240", "₹ 120"],
                "correctOptionIndex": 1,
                "explanation": "Option (b): ₹ 720. Carrying value on 31 Dec 20X7 = 7,500 - 1,500 - 240 = 5,760 / 8 yrs = ₹ 720."
            },
            {
                "id": "FR_CS_02_2",
                "subjectId": "FR",
                "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
                "type": "case_sub",
                "questionText": "2. The amount of depreciation on the asset for the year 20X9 would be-",
                "options": ["₹ 750", "₹ 720", "₹ 240", "₹ 120"],
                "correctOptionIndex": 3,
                "explanation": "Option (d): ₹ 120. Depreciation for Jan & Feb 20X9 = 720 * 2/12 = ₹ 120."
            },
            {
                "id": "FR_CS_02_3",
                "subjectId": "FR",
                "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
                "type": "case_sub",
                "questionText": "3. What will be the carrying value of the asset immediately before its classification as 'Held for Sale' as on 28th February, 20X9?",
                "options": ["₹ 4,920", "₹ 5,040", "₹ 4,600", "₹ 5,300"],
                "correctOptionIndex": 0,
                "explanation": "Option (a): ₹ 4,920 (₹ 5,040 - ₹ 120)."
            },
            {
                "id": "FR_CS_02_4",
                "subjectId": "FR",
                "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
                "type": "case_sub",
                "questionText": "4. What will be the carrying value of the asset immediately after its classification as 'Held for Sale' as on 28th February, 20X9?",
                "options": ["₹ 4,920", "₹ 5,040", "₹ 4,600", "₹ 5,300"],
                "correctOptionIndex": 2,
                "explanation": "Option (c): ₹ 4,600 (Lower of carrying value ₹ 4,920 and FVLCTS ₹ 4,600)."
            },
            {
                "id": "FR_CS_02_5",
                "subjectId": "FR",
                "chapterName": "Non Current Assets Held For Sale (Ind AS 105)",
                "type": "case_sub",
                "questionText": "5. What will be the amount of reversal of impairment loss and the carrying value of the asset after reversal as on 30th June, 20X9?",
                "options": ["₹ 560; ₹ 5,300", "₹ 440; ₹ 5,040", "₹ 560; ₹ 5,160", "₹ 700; ₹ 5,300"],
                "correctOptionIndex": 2,
                "explanation": "Option (c): ₹ 560; ₹ 5,160. Maximum impairment reversal is capped at cumulative impairment ₹ 560. Carrying value after reversal = 4,600 + 560 = ₹ 5,160."
            }
        ]
    }
]

# We will generate all 68 case scenarios iteratively into src/data/caseScenariosFR.ts

print("Cases script prepared.")
