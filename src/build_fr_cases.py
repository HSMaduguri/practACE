import os

cases = [
    # Case 1
    {
        "id": "FR_CS_01",
        "subjectId": "FR",
        "chapterName": "Business Combinations (Ind AS 103)",
        "scenarioTitle": "Case Scenario 1: ABC Ltd. - Indemnification Assets & Contingent Liabilities",
        "scenarioText": """ABC Ltd. acquired PQR Ltd. and RST Ltd. during the year:
(i) PQR Ltd. is defendant in a lawsuit where customers alleged pesticides in beverage products (claim ₹2 crores). XYZ Ltd. indemnified ABC Ltd. up to ₹1 crore. Fair value of contingent liability is ₹0.70 crore.
(ii) RST Ltd. manufactured products containing fiber glass with 10 class action lawsuits. MN Ltd. indemnified up to ₹10 crores. Contingent liability cannot be measured reliably, so no amount was recognised.""",
        "subQuestions": [
            {
                "id": "FR_CS_01_1",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "1. At what amount would ABC Ltd. account for the identified liability and indemnification asset for PQR Ltd.?",
                "options": ["₹ 2 crores; ₹ 1 crore", "₹ 1 crore; ₹ 1 crore", "₹ 0.70 crore; ₹ 1 crore", "₹ 0.70 crore; ₹ 0.70 crore"],
                "correctOptionIndex": 3,
                "explanation": "Identified liability is measured at fair value ₹ 0.70 crore, and indemnification asset is measured on the same basis at ₹ 0.70 crore."
            },
            {
                "id": "FR_CS_01_2",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "2. What will be the impact on goodwill due to recognition of such liability and indemnified asset?",
                "options": ["The net impact on goodwill will be Nil", "Decrease by ₹ 0.30 crore", "Increase by ₹ 0.30 crore", "Increase by ₹ 1 crore"],
                "correctOptionIndex": 0,
                "explanation": "Equal liability and asset recognition leads to net Nil impact on goodwill."
            },
            {
                "id": "FR_CS_01_3",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "3. If fair value of liability is ₹ 1.20 crores, what will be the value of liability and indemnification asset?",
                "options": ["₹ 2 crores; ₹ 1 crore", "₹ 1.20 crore; ₹ 1 crore", "₹ 1 crore; ₹ 1 crore", "₹ 1.20 crores; ₹ 1.20 crores"],
                "correctOptionIndex": 1,
                "explanation": "Liability is ₹ 1.20 crore, asset is capped at the contract indemnity limit of ₹ 1 crore."
            },
            {
                "id": "FR_CS_01_4",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "4. What will be the impact on goodwill if liability fair value is ₹ 1.20 crores and asset is ₹ 1 crore?",
                "options": ["Increase by ₹ 1 crores", "Decrease by ₹ 0.20 crore", "Increase by ₹ 0.20 crore", "Nil"],
                "correctOptionIndex": 2,
                "explanation": "Unindemnified excess liability of ₹ 0.20 crore increases goodwill."
            },
            {
                "id": "FR_CS_01_5",
                "subjectId": "FR",
                "chapterName": "Business Combinations (Ind AS 103)",
                "type": "case_sub",
                "questionText": "5. On acquisition of RST Ltd., at what amount should indemnification asset be accounted for?",
                "options": ["₹ 10 crores", "₹ 1 crore", "Nil", "₹ 9 crores"],
                "correctOptionIndex": 2,
                "explanation": "Since no liability is recognised, no indemnification asset is recognised (Nil)."
            }
        ]
    }
]

print("Script template ready.")
