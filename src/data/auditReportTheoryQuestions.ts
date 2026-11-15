/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AUDIT REPORT, SAs (700, 701, 705, 706, 570, 710, 720, 299, 610, 620) & CARO 2020
 * Curated from Comprehensive Question Bank (CA Ram Harsha 2024 Edition)
 * Zero duplicate questions; adhering strictly to CA Final Educator guidelines.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_REPORT_THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    "id": "aud_rep_sa570_01",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Material Uncertainty Related to Going Concern - Drafting Note Disclosures & Unmodified Report (SA 570 / Tram Fram Ltd)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / Illustration 1 (SA 570)",
    "question": "CA Sameer is the statutory auditor of Tram Fram Ltd. for FY 2020-21. While concluding the audit, CA Sameer decided to issue an unmodified opinion, though he also concluded that a material uncertainty exists with respect to the company's ability to continue as a going concern on account of a pending litigation related to labour laws. He is of the view that the company has made appropriate disclosures with respect to such pending litigation in the notes to accounts annexed to the financial statements of Tram Fram Ltd. for the FY 2020-21. Explain how CA Sameer will deal with the above situation in his auditor's report (draft the relevant portion of the auditor's report).",
    "keyConcepts": [
      {
        "keyword": "SA 570 Going Concern",
        "category": "Standard",
        "description": "Standard on Auditing governing auditor responsibilities relating to going concern."
      },
      {
        "keyword": "Material Uncertainty Related to Going Concern Section",
        "category": "Provision",
        "description": "Mandatory separate section included in the auditor's report when adequate disclosure is made in the financial statements."
      },
      {
        "keyword": "Reference to Note in Financial Statements",
        "category": "Keyword",
        "description": "Explicit draw of attention to the specific note disclosing the events casting significant doubt."
      },
      {
        "keyword": "Explicit Statement of Non-Modification",
        "category": "Keyword",
        "description": "Clear statement that the auditor's opinion is not modified in respect of this matter."
      }
    ],
    "shortSuggestedAnswer": "| Statutory Element | Practical Audit Compliance (SA 570) |\n| :--- | :--- |\n| **Audit Condition** | Material uncertainty exists but adequate disclosures made in Note 10 & Note 11 |\n| **Opinion Type** | **Unmodified Opinion** (True and fair view maintained) |\n| **Report Section** | Separate dedicated section titled **\"Material Uncertainty Related to Going Concern\"** |\n| **Position in Report** | Placed immediately after the *Basis for Opinion* section |\n\n```\n[Auditor's Report Structure Flowchart]\nBasis for Opinion (Unmodified)\n       \u2502\n       \u25bc\nMaterial Uncertainty Related to Going Concern\n   \u251c\u2500\u2500 1. Draw attention to Note 10 (Labour law litigation)\n   \u251c\u2500\u2500 2. State existence of material uncertainty casting significant doubt (Note 11)\n   \u2514\u2500\u2500 3. Explicit declaration: \"Our opinion is not modified in respect of this matter\"\n       \u2502\n       \u25bc\nKey Audit Matters (SA 701)\n```\n\n\u2022 **Draft Extract for Auditor's Report**:\n  **\"Material Uncertainty Related to Going Concern:**\n  We draw attention to Note 10 in the financial statements, which indicates that the outcome of a litigation on account of labour laws is pending in case of the company during the year ended 31 March, 2021. As stated in Note 11, this event or condition indicates that a material uncertainty exists that may cast significant doubt on the Company\u2019s ability to continue as a going concern. **Our opinion is not modified in respect of this matter.**\" ",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on the requirement under SA 570 to draft a dedicated 'Material Uncertainty Related to Going Concern' paragraph with specific note referencing and the non-modification clause.",
      "criticalMisses": [
        "Failing to draft the exact statutory wording for Material Uncertainty Related to Going Concern.",
        "Omission of the explicit non-modification sentence ('Our opinion is not modified in respect of this matter')."
      ],
      "suggestions": [
        "Ensure note references (Note 10 and Note 11) are specifically cited in the draft report text."
      ]
    }
  },
  {
    "id": "aud_rep_sa705_02",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Expiry of Financing Facilities & Inadequate Going Concern Disclosure - Qualified Opinion Drafting (XYZ Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / Illustration 3 (SA 705 read with SA 570)",
    "question": "XYZ Ltd. is a crane manufacturing company. CA Sudhir is statutory auditor for FY 2020-21. The company has taken long-term funding for fixed capital and short-term funding for working capital. During the audit, CA Sudhir found that financing arrangements are about to expire and the company is unable to renegotiate or obtain replacement financing. Consequently, the company may be unable to realize assets and discharge liabilities in normal course. Notes to accounts discuss magnitude of financing arrangements, expiration and total arrangements; however, financial statements do not include discussion on the impact or availability of refinancing. Thus, financial statements do not fully disclose this fact. What kind of opinion should CA Sudhir issue? Draft the relevant extract of the Qualified Opinion and Basis for Qualified Opinion paragraphs.",
    "keyConcepts": [
      {
        "keyword": "SA 705 Modification of Opinion",
        "category": "Standard",
        "description": "Standard on Auditing governing qualified, adverse, and disclaimer of opinion."
      },
      {
        "keyword": "Material but Not Pervasive",
        "category": "Keyword",
        "description": "Criteria for issuing a Qualified Opinion when financial statements are materially misstated."
      },
      {
        "keyword": "Inadequate Disclosure of Material Uncertainty",
        "category": "Provision",
        "description": "Omission of impact or availability of refinancing in notes to accounts."
      },
      {
        "keyword": "Basis for Qualified Opinion Drafting",
        "category": "Provision",
        "description": "Specific articulation of expired financing arrangements and failure to disclose."
      }
    ],
    "shortSuggestedAnswer": "| Parameter | Audit Evaluation (SA 705 read with SA 570) |\n| :--- | :--- |\n| **Factual Situation** | Financing arrangements expiring; replacement financing unavailable; going concern in doubt |\n| **Deficiency** | Disclosures incomplete \u2014 omitted impact of non-availability of refinancing |\n| **Materiality & Pervasiveness** | Material misstatement, but **not pervasive** to the financial statements |\n| **Appropriate Opinion** | **Qualified Opinion** |\n\n\u2022 **Relevant Extract of Auditor's Report**:\n\n  1. **Qualified Opinion Paragraph**:\n     \"In our opinion and to the best of our information and according to the explanations given to us, **except for the incomplete disclosure of the information referred to in the Basis for Qualified Opinion section of our report**, the aforesaid standalone financial statements give the information required by the Act in the manner so required and give a true and fair view in conformity with the accounting principles generally accepted in India, of the state of affairs of XYZ Ltd. as at March 31, 2021, and its profit/loss for the year ended on that date.\"\n\n  2. **Basis for Qualified Opinion Paragraph**:\n     \"As discussed in Note 6, the Company\u2019s financing arrangements are about to expire and the Company has been unable to conclude renegotiations or obtain replacement financing. This situation indicates that a material uncertainty exists that may cast significant doubt on the Company\u2019s ability to continue as a going concern. **The financial statements do not adequately disclose this matter.**\" ",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on justifying why a Qualified Opinion is required (material but not pervasive inadequate disclosure) and correctly drafting both the Qualified Opinion and Basis for Qualified Opinion paragraphs.",
      "criticalMisses": [
        "Suggesting an adverse opinion or disclaimer instead of a Qualified Opinion.",
        "Omitting the 'except for the incomplete disclosure...' qualifying clause in the opinion paragraph."
      ],
      "suggestions": [
        "Differentiate clearly between incomplete disclosure (material but not pervasive -> Qualified) versus total omission of impending bankruptcy (pervasive -> Adverse)."
      ]
    }
  },
  {
    "id": "aud_rep_sa705_03",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Expired Credit Facilities, Impending Bankruptcy & Complete Disclosure Omission - Adverse Opinion Drafting (ABC Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / Illustration 4 (SA 705 read with SA 570)",
    "question": "ABC Ltd. manufactures iron and steel bars. PP & Associates are statutory auditors for FY 2020-21. During audit, CA Prakash found that the company's financing arrangements had expired and the outstanding amount was payable on March 31, 2021. The company has been unable to renegotiate or obtain replacement financing and is considering filing for bankruptcy. These events indicate a material uncertainty casting significant doubt on the company's ability to continue as a going concern. The financial statements and notes thereto completely omit this fact. What opinion should CA Prakash express? Draft the Adverse Opinion and Basis for Adverse Opinion paragraphs.",
    "keyConcepts": [
      {
        "keyword": "Adverse Opinion under SA 705",
        "category": "Standard",
        "description": "Opinion issued when misstatements, individually or in aggregate, are both material and pervasive."
      },
      {
        "keyword": "Material and Pervasive Omission",
        "category": "Provision",
        "description": "Complete omission of going concern uncertainty and bankruptcy consideration."
      },
      {
        "keyword": "Inability to Continue as Going Concern",
        "category": "Keyword",
        "description": "Financing expired, outstanding payable immediately, bankruptcy filing contemplated."
      },
      {
        "keyword": "Drafting 'Do not present fairly'",
        "category": "Provision",
        "description": "Statutory phrase required in adverse opinion under AS / Ind AS framework."
      }
    ],
    "shortSuggestedAnswer": "| Legal Matrix | Audit Evaluation (SA 705 & SA 570) |\n| :--- | :--- |\n| **Financial Distress Indicator** | Facilities expired on 31-03-2021; default; company contemplating bankruptcy |\n| **Disclosure Status** | Financial statements and notes completely omit this material uncertainty |\n| **Impact Assessment** | The omission is **both material and pervasive** to the financial statements |\n| **Required Opinion** | **Adverse Opinion** |\n\n```\n[Distinction: Qualified vs Adverse Opinion on Going Concern Disclosure]\nInadequate/Incomplete Disclosure \u2500\u2500\u25ba Material but Not Pervasive \u2500\u2500\u25ba Qualified Opinion\nComplete Omission + Bankruptcy  \u2500\u2500\u25ba Material and Pervasive     \u2500\u2500\u25ba Adverse Opinion\n```\n\n\u2022 **Draft Extract for Auditor's Report**:\n\n  1. **Adverse Opinion Paragraph**:\n     \"In our opinion, **because of the omission of the information mentioned in the Basis for Adverse Opinion section of our report, the accompanying financial statements do not present fairly (or do not give a true and fair view of)** the financial position of the entity as at March 31, 2021, and of its financial performance and its cash flows for the year then ended in accordance with the Accounting Standards issued by the Institute of Chartered Accountants of India.\"\n\n  2. **Basis for Adverse Opinion Paragraph**:\n     \"The financing arrangements of ABC Ltd. have expired and the amount outstanding was payable on March 31, 2021. The entity has been unable to conclude renegotiations or obtain replacement financing and is considering filing for bankruptcy. This situation indicates that a material uncertainty exists that may cast significant doubt on the Company\u2019s ability to continue as a going concern. **The financial statements do not adequately disclose this fact.**\" ",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying both material and pervasive misstatement from omitting bankruptcy risk, necessitating an Adverse Opinion, and accurate statutory drafting.",
      "criticalMisses": [
        "Prescribing a Disclaimer of Opinion (disclaimer is for inability to obtain evidence, not for known material misstatement).",
        "Omitting the phrase 'do not present fairly' or 'do not give a true and fair view'."
      ],
      "suggestions": [
        "State clearly that where the auditor has obtained sufficient appropriate audit evidence of an undisclosed going concern crisis, the modification is Adverse, not Disclaimer."
      ]
    }
  },
  {
    "id": "aud_rep_sa705_04",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Inability to Obtain SAAE for Joint Venture Comprising >90% Net Assets - Disclaimer of Opinion Drafting (MNO Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / Illustration 5 (SA 705)",
    "question": "MNO Ltd. is a power generating company. For FY 2020-21, M/s PRT & Associates are statutory auditors. During audit, the audit team was unable to obtain sufficient appropriate audit evidence about a single element of the consolidated financial statements: the auditor was unable to obtain audit evidence about the financial information of a joint venture investment (in XYZ Ltd.) carried at \u20b995 crores that represents over 90% of the entity's net assets. What kind of opinion should the statutory auditor issue? Draft the relevant extracts of the Disclaimer of Opinion and Basis for Disclaimer of Opinion paragraphs.",
    "keyConcepts": [
      {
        "keyword": "Disclaimer of Opinion under SA 705",
        "category": "Standard",
        "description": "Opinion issued when the auditor is unable to obtain SAAE and the possible effects are both material and pervasive."
      },
      {
        "keyword": "Material and Pervasive Limitation",
        "category": "Provision",
        "description": "Inability to audit an asset representing >90% of net assets pervades the entire balance sheet."
      },
      {
        "keyword": "We do not express an opinion",
        "category": "Keyword",
        "description": "Mandatory phrase under SA 705 when disclaiming an opinion on financial statements."
      },
      {
        "keyword": "Denial of Access to Component Auditor",
        "category": "Provision",
        "description": "Auditor denied access to management and audit documentation of the joint venture."
      }
    ],
    "shortSuggestedAnswer": "| Audit Coordinate | Analysis (SA 705 Modification) |\n| :--- | :--- |\n| **Audit Limitation** | Inability to obtain SAAE regarding JV investment (XYZ Ltd) carried at \u20b995 Crores |\n| **Quantitative Impact** | JV represents **over 90% of the entity's net assets** |\n| **Pervasiveness** | Pervades the balance sheet, equity changes, profits, and cash flows |\n| **Mandatory Opinion** | **Disclaimer of Opinion** |\n\n\u2022 **Draft Extract for Auditor's Report**:\n\n  1. **Disclaimer of Opinion Paragraph**:\n     \"**We do not express an opinion on the accompanying financial statements of MNO Ltd.** Because of the significance of the matters described in the Basis for Disclaimer of Opinion section of our report, we have not been able to obtain sufficient appropriate audit evidence to provide a basis for an audit opinion on these financial statements.\"\n\n  2. **Basis for Disclaimer of Opinion Paragraph**:\n     \"The Group\u2019s investment in its joint venture XYZ Company is carried at \u20b995 crores on the Group\u2019s consolidated balance sheet, which represents over 90% of the Group\u2019s net assets as at March 31, 2021. **We were not allowed access to the management and the auditors of XYZ Company, including XYZ Company\u2019s auditors\u2019 audit documentation.** As a result, we were unable to determine whether any adjustments were necessary in respect of the Group\u2019s proportional share of XYZ Company\u2019s assets that it controls jointly, its proportional share of XYZ Company\u2019s liabilities for which it is jointly responsible, its proportional share of XYZ\u2019s income and expenses for the year, the consolidated statement of changes in equity, and the consolidated cash flow statement.\" ",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on identifying that a scope limitation affecting >90% of net assets is pervasive, requiring a Disclaimer of Opinion, and correctly drafting the disclaimer clauses.",
      "criticalMisses": [
        "Confusing Adverse Opinion with Disclaimer of Opinion.",
        "Failing to state 'We do not express an opinion on the accompanying financial statements'."
      ],
      "suggestions": [
        "Explain that when management restricts access to documentation of a 90% net asset component, SAAE cannot be gathered, leading to Disclaimer under SA 705."
      ]
    }
  },
  {
    "id": "aud_rep_sa706_05",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Drafting Emphasis of Matter & Other Matter Paragraphs - Resumed Power Project & Branch Audit Reliance (BDS Ltd)",
    "difficulty": "Moderate",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / Illustration 9 (SA 706)",
    "question": "In the audit of BDS Ltd. for FY 2020-21, the statutory auditor noticed two matters where he wants to draw users' attention without modifying his audit opinion: (a) The company plans to resume construction activities of a thermal power project suspended in FY 2018-19, comprising plant & equipment of \u20b95.95 crore and CWIP of \u20b9147.50 crore. (b) The financial statements include 5 branches reflecting total assets of \u20b990 crores and revenue of \u20b940 crores audited by branch auditors. Draft the relevant reporting paragraphs.",
    "keyConcepts": [
      {
        "keyword": "SA 706 EOM & OM Paragraphs",
        "category": "Standard",
        "description": "Standard governing Emphasis of Matter and Other Matter paragraphs in the auditor's report."
      },
      {
        "keyword": "Emphasis of Matter (EOM)",
        "category": "Provision",
        "description": "Used for matters appropriately presented or disclosed in F/S fundamental to users' understanding."
      },
      {
        "keyword": "Other Matter (OM)",
        "category": "Provision",
        "description": "Used for matters other than those presented/disclosed in F/S relevant to users' understanding of audit, responsibilities, or report."
      },
      {
        "keyword": "Branch Audit Reliance Disclosure",
        "category": "Provision",
        "description": "Disclosing magnitude of branch assets and revenue audited by branch auditors under OM."
      }
    ],
    "shortSuggestedAnswer": "| Item | Reporting Heading | Rationale under SA 706 |\n| :--- | :--- | :--- |\n| **(a) Thermal Project Resumption** (CWIP \u20b9147.5 Cr) | **Emphasis of Matter** | Disclosed in Note 27 of F/S; fundamental to users' understanding of future viability. |\n| **(b) 5 Branches Audited by Branch Auditors** | **Other Matter** | Refers to division of audit responsibility and reliance on branch auditors (not in F/S). |\n\n\u2022 **Draft Extracts for Auditor's Report**:\n\n  1. **Emphasis of Matter Paragraph**:\n     \"We draw attention to Note 27 of the standalone financial statements regarding the plans of the Company to resume construction/developmental activities of its thermal power project. The carrying amounts related to the project as at 31st March, 2021 comprise plant and equipment of \u20b95.95 crore and capital work-in-progress of \u20b9147.50 crore. **Our opinion is not modified in respect of this matter.**\"\n\n  2. **Other Matter Paragraph**:\n     \"We did not audit the financial statements of 5 branches included in the Standalone Financial Statements of the company whose financial statements reflect total assets of \u20b990 crores as at 31.03.2021 and total revenue from operations of \u20b940 crores for the year ended on that date. The financial statements of these branches have been audited by the branch auditors whose reports have been furnished to us, and our opinion in so far as it relates to the amounts and disclosures included in respect of these branches, is based solely on the report of the branch auditors. **Our opinion is not modified in respect of this matter.**\" ",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing between Emphasis of Matter (matter disclosed in F/S) and Other Matter (matter regarding audit division not in F/S), including standard non-modification declarations.",
      "criticalMisses": [
        "Inverting EOM and OM designations.",
        "Omitting the non-modification clause in both paragraphs."
      ],
      "suggestions": [
        "Remember: EOM = in the financial statements; OM = about the audit / auditors / reports."
      ]
    }
  },
  {
    "id": "aud_rep_sa700_06",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Dual Auditing Standards Compliance - Joint Reporting under ICAI SAs and International Standards on Auditing (ISAs)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / PYQ SA 700 Q.2",
    "question": "An auditor is required to conduct an audit in accordance with both Standards on Auditing issued by ICAI and International Standards on Auditing (ISAs) or auditing standards of another jurisdiction. State the conditions under SA 700 subject to which the auditor may refer to both sets of auditing standards in the auditor's report.",
    "keyConcepts": [
      {
        "keyword": "SA 700 Auditor's Report",
        "category": "Standard",
        "description": "Standard on Auditing governing forming an opinion and reporting on financial statements."
      },
      {
        "keyword": "No Conflict Between Standards",
        "category": "Provision",
        "description": "No conflict that would lead to a different opinion or omission of required EOM/OM."
      },
      {
        "keyword": "Minimum Prescribed Elements",
        "category": "Provision",
        "description": "Report includes all minimum elements specified by law or regulation/SAs."
      },
      {
        "keyword": "Clear Identification of Jurisdictions",
        "category": "Keyword",
        "description": "Explicit identification of the specific jurisdiction of origin of the other auditing standards."
      }
    ],
    "shortSuggestedAnswer": "An auditor may refer to both Standards on Auditing (SAs) issued by ICAI and ISAs / foreign auditing standards **only if all 3 conditions under SA 700 are met**:\n\n```\n[Conditions for Dual Standard Reference in Audit Report]\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u2502 Condition 1: Absence of Conflicting Requirements        \u2502\n       \u2502  \u2022 No conflict leading to different audit opinion      \u2502\n       \u2502  \u2022 No conflict causing omission of required EOM / OM   \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                                  \u25bc\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u2502 Condition 2: Minimum Elements Included                 \u2502\n       \u2502  \u2022 Contains at least each minimum element of SA 700    \u2502\n       \u2502  \u2022 Identifies SAs as governing layout/wording          \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                                  \u25bc\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u2502 Condition 3: Explicit Jurisdiction Identification      \u2502\n       \u2502  \u2022 Clearly names the country/jurisdiction of ISAs/standards\u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n```\n\n1. **No Conflict of Opinion or Reporting**:\n   - There must be no conflict between requirements in ISAs/foreign standards and ICAI SAs that would lead the auditor:\n     - To form a different opinion; or\n     - Not to include an Emphasis of Matter (EOM) or Other Matter (OM) paragraph required by SAs.\n2. **Minimum Layout Elements**:\n   - The report includes, at a minimum, each of the elements set out in SA 700 layout/wording.\n3. **Identification of Jurisdiction**:\n   - The report shall clearly identify both sets of standards, including the specific jurisdiction of origin of the other auditing standards.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on all three statutory conditions under SA 700 for dual referencing of auditing standards.",
      "criticalMisses": [
        "Failing to mention the condition regarding no conflict leading to omission of EOM/OM.",
        "Omitting the requirement to identify the jurisdiction of origin."
      ],
      "suggestions": [
        "Structure into 3 distinct numbered conditions for clarity."
      ]
    }
  },
  {
    "id": "aud_rep_sa701_07",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "ERP System Implementation Impacting Audit Strategy - Reporting as Key Audit Matter (Kshetra Lap Ltd)",
    "difficulty": "Advanced",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / RTP Nov 2021 (SA 701)",
    "question": "Mr. Hemant was engagement partner for audit of Kshetra Lap Ltd. for FY 2020-21. Mr. Vishay was appointed EQCR reviewer. During the year, an ERP system was implemented in a phased manner, automating business processes and significantly affecting the overall audit strategy. Mr. Hemant discussed this with Mr. Vishay and noted it may be a Key Audit Matter (KAM). Mr. Vishay contended that the ERP system did not link with any disclosures in financial statements and therefore could not be reported as a KAM. Evaluate whether Mr. Vishay's contention is proper under SA 701.",
    "keyConcepts": [
      {
        "keyword": "SA 701 Key Audit Matters",
        "category": "Standard",
        "description": "Communicating Key Audit Matters in the Independent Auditor's Report."
      },
      {
        "keyword": "Matters Communicated to TCWG",
        "category": "Provision",
        "description": "KAM are selected from matters communicated with those charged with governance."
      },
      {
        "keyword": "Matters Related to Other Than F/S",
        "category": "Provision",
        "description": "Matters having significant effect on audit strategy may be KAM even if not disclosed in F/S."
      },
      {
        "keyword": "IT System Implementation as KAM",
        "category": "Keyword",
        "description": "Implementation of new IT system requiring significant auditor attention and audit strategy redesign."
      }
    ],
    "shortSuggestedAnswer": "| Aspect | Analysis under SA 701 |\n| :--- | :--- |\n| **Vishay's Contention** | Contended that a matter cannot be a KAM if not linked to disclosures in F/S. |\n| **Legal Validity** | **Incorrect / Improper.** |\n| **Governing Rule** | SA 701 explicitly permits matters relevant to the audit performed that may not require F/S disclosure to be KAM. |\n\n\u2022 **Key Provisions of SA 701**:\n  - The auditor determines KAM from matters communicated with TCWG, considering:\n    1. Areas of higher assessed risk of material misstatement (SA 315).\n    2. Areas involving significant management judgment / estimation uncertainty.\n    3. Effect on the audit of significant events or transactions during the period.\n  - **Matters Not Disclosed in Financial Statements**:\n    - SA 701 clarifies that matters requiring significant auditor attention may include matters relevant to the audit that are not required to be disclosed in the financial statements.\n    - *Direct Example in SA 701*: The implementation of a new IT/ERP system during the period that significantly affects the auditor's overall audit strategy is an area of significant auditor attention and can validly be determined as a Key Audit Matter.\n\n\u2022 **Conclusion**:\n  - Mr. Vishay's contention is **not proper**. If the ERP rollout required significant attention and redirected the audit strategy, Mr. Hemant is justified in reporting it as a KAM under SA 701.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on clarifying that financial statement disclosure is NOT a prerequisite for a matter to be designated as a Key Audit Matter under SA 701.",
      "criticalMisses": [
        "Agreeing with Mr. Vishay's incorrect contention.",
        "Failing to cite the SA 701 principle regarding matters relating to audit strategy rather than F/S line items."
      ],
      "suggestions": [
        "Highlight that KAM enhances communicative transparency regarding significant audit effort, not just balance sheet line items."
      ]
    }
  },
  {
    "id": "aud_rep_sa705_08",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Management-Imposed Scope Limitation After Engagement Acceptance - Required Auditor Actions (All in One Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / QP May 2019 (SA 705)",
    "question": "After accepting the statutory audit of M/s All in One Ltd., a departmental store, you became aware that the management has imposed certain limitations on the scope of your assurance function which may adversely affect and result in your inability to obtain sufficient appropriate audit evidence. Indicate the sequential consequences and your professional response to the limitations imposed by management under SA 705.",
    "keyConcepts": [
      {
        "keyword": "SA 705 Scope Limitation",
        "category": "Standard",
        "description": "Auditor response to management-imposed limitations after accepting engagement."
      },
      {
        "keyword": "Request for Removal of Limitation",
        "category": "Provision",
        "description": "First procedural step: request management to remove the imposed restriction."
      },
      {
        "keyword": "Alternative Procedures & TCWG Communication",
        "category": "Provision",
        "description": "Communicate refusal to TCWG and attempt alternative audit procedures."
      },
      {
        "keyword": "Withdrawal vs Disclaimer of Opinion",
        "category": "Rule",
        "description": "If limitation is material and pervasive: withdraw if practicable, else disclaim opinion."
      }
    ],
    "shortSuggestedAnswer": "```\n[Sequential Steps upon Management-Imposed Scope Limitation (SA 705)]\nStep 1: Request Management to Remove Limitation\n                 \u2502\n                 \u251c\u2500\u2500 If Management Agrees \u2500\u2500\u25ba Perform normal procedures\n                 \u2502\n                 \u2514\u2500\u2500 If Management Refuses\n                           \u2502\n                           \u25bc\nStep 2: Communicate with TCWG & Attempt Alternative Procedures\n                 \u2502\n                 \u251c\u2500\u2500 If Alternative Procedures succeed \u2500\u2500\u25ba Form Unmodified Opinion\n                 \u2502\n                 \u2514\u2500\u2500 If Unable to Obtain SAAE\n                           \u2502\n                           \u25bc\nStep 3: Evaluate Pervasiveness & Report\n        \u251c\u2500\u2500 Material but NOT Pervasive \u2500\u2500\u25ba QUALIFY Opinion\n        \u2514\u2500\u2500 Material AND Pervasive:\n              \u251c\u2500\u2500 Primary Action: WITHDRAW from audit (if practicable/legal)\n              \u2514\u2500\u2500 If Withdrawal Not Possible \u2500\u2500\u25ba DISCLAIM Opinion\n```\n\n\u2022 **Detailed Procedural Requirements (SA 705)**:\n  1. **Request Removal**: The auditor shall first formally request management to remove the limitation.\n  2. **Communication & Alternative Procedures**: If refused, communicate to TCWG (unless all TCWG manage the entity) and attempt alternative procedures to obtain SAAE.\n  3. **Reporting & Legal Consequence**:\n     - *Material but Not Pervasive*: Qualify opinion.\n     - *Material and Pervasive*:\n       - **Withdraw** from the audit where practicable and permissible under applicable law/regulation.\n       - If withdrawal before issuing report is not practicable/possible, **Disclaim an opinion**.\n  4. **Pre-Withdrawal Duty**: Before withdrawing, communicate to TCWG any misstatements identified that would have given rise to a modified opinion.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on the exact 3-step hierarchy under SA 705: (1) Request removal, (2) TCWG & alternative procedures, (3) Qualify / Withdraw / Disclaim.",
      "criticalMisses": [
        "Jumping directly to disclaimer without explaining request for removal and alternative procedures.",
        "Omitting the withdrawal option when limitations are material and pervasive."
      ],
      "suggestions": [
        "Always mention the mandatory pre-withdrawal communication to TCWG regarding identified misstatements."
      ]
    }
  },
  {
    "id": "aud_rep_sa570_09",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Severe Financial Ratio Deterioration & Inappropriate Going Concern - Mandatory Adverse Opinion (CA Sooraj)",
    "difficulty": "Advanced",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / PYQ SA 570 Q.6",
    "question": "CA Sooraj finds that key financial ratios of a company (current ratio, DSCR, inventory turnover, debtors turnover) are in red and have deteriorated considerably. The company cannot pay creditors or salaries on time, products are sold below cost, and bankers refuse additional credit. CA Sooraj concludes that the use of going concern is inappropriate. When informed, the CFO agrees to include disclosures in notes stating that the going concern assumption is inappropriate. What is the reporting duty of CA Sooraj? Will management's disclosure change the auditor's opinion?",
    "keyConcepts": [
      {
        "keyword": "SA 570 Going Concern",
        "category": "Standard",
        "description": "Evaluation of appropriateness of going concern basis of accounting."
      },
      {
        "keyword": "Inappropriate Going Concern Assumption",
        "category": "Provision",
        "description": "Financial statements prepared on going concern basis when basis is invalid."
      },
      {
        "keyword": "Mandatory Adverse Opinion",
        "category": "Rule",
        "description": "Auditor SHALL express an adverse opinion if going concern basis is inappropriate."
      },
      {
        "keyword": "Disclosure Irrelevance on Adverse Opinion",
        "category": "Rule",
        "description": "Management's disclosure of inappropriateness does NOT prevent an adverse opinion."
      }
    ],
    "shortSuggestedAnswer": "| Condition | Statutory Mandate (SA 570) |\n| :--- | :--- |\n| **Financial State** | Operating losses, below-cost sales, salary defaults, credit cutoff |\n| **Auditor's Conclusion** | Use of going concern basis of accounting is **inappropriate** |\n| **Management Proposal** | Disclose the inappropriateness in the notes to accounts |\n| **Impact on Opinion** | **Zero impact \u2014 Adverse Opinion remains mandatory** |\n\n\u2022 **Statutory Principles under SA 570 (Revised)**:\n  - If financial statements are prepared using the going concern basis of accounting but, in the auditor\u2019s judgment, management\u2019s use of that basis is **inappropriate**, the auditor **SHALL express an ADVERSE OPINION**.\n  - **Irrelevance of Disclosure**:\n    - The requirement to express an adverse opinion applies **regardless of whether or not the financial statements include disclosure of the inappropriateness of management\u2019s use of the going concern basis of accounting**.\n    - A company cannot prepare accounts on a going concern basis and simply 'cure' it by disclosing in a note that it is not a going concern.\n\n\u2022 **Conclusion**:\n  - Even if management discloses the inappropriateness in the notes, CA Sooraj **must express an Adverse Opinion** under SA 705 read with SA 570.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on the strict SA 570 rule: an inappropriate going concern basis requires an Adverse Opinion regardless of note disclosures.",
      "criticalMisses": [
        "Incorrectly stating that management disclosure allows an unmodified report with EOM or MURGC.",
        "Confusing material uncertainty (unmodified + MURGC) with inappropriate going concern basis (Adverse opinion)."
      ],
      "suggestions": [
        "Emphasize the sharp boundary: Material Uncertainty = MURGC; Inappropriate Basis = Adverse Opinion."
      ]
    }
  },
  {
    "id": "aud_rep_sa299_10",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Joint Audit - Disagreement Among Joint Auditors & Non-Applicability of Majority Rule (A, B and C)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / PYQ SA 299 Q.5",
    "question": "A, B, and C are joint auditors of a company. B is of the opinion that there are material misstatements in the financial statements which, if accounted for, would turn the reported profit of \u20b925 crore into a loss of \u20b95 crore. B insists on expressing an adverse opinion. However, A and C disagree with B and accept management's version. Is B required to follow the 2:1 majority opinion? Explain the reporting procedure under SA 299 and SA 706.",
    "keyConcepts": [
      {
        "keyword": "SA 299 Joint Audit",
        "category": "Standard",
        "description": "Standard on Auditing governing Joint Audit of Financial Statements."
      },
      {
        "keyword": "No Majority Rule in Joint Audit",
        "category": "Rule",
        "description": "Joint auditors are not bound by the majority opinion in case of disagreement."
      },
      {
        "keyword": "Separate Audit Report",
        "category": "Provision",
        "description": "Dissenting joint auditor shall issue a separate independent audit report."
      },
      {
        "keyword": "Cross-Referencing in Other Matter Paragraph",
        "category": "Rule",
        "description": "Each report must cross-reference the other report under Other Matter (SA 706)."
      }
    ],
    "shortSuggestedAnswer": "| Dimension | Legal Provision under SA 299 |\n| :--- | :--- |\n| **Majority Decision Rule** | **Does NOT apply.** A joint auditor is never bound by the majority. |\n| **B's Obligation** | B is **not required** to go by the 2:1 majority opinion. |\n| **Reporting Procedure** | B shall express his opinion in a **separate audit report**. |\n| **Cross-Referencing** | Both reports must refer to each other under **Other Matter Paragraph (SA 706)**. |\n\n```\n[Joint Audit Disagreement Resolution under SA 299]\n                Audit Disagreement\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                 \u25bc\nMajority Auditors (A & C)         Dissenting Auditor (B)\nIssue Majority Audit Report       Issues Separate Audit Report\n(Unmodified / Management view)    (Adverse Opinion)\n       \u2502                                 \u2502\n       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n                      \u25bc\n       Mutual Cross-Referencing under\n       \"Other Matter Paragraph\" (SA 706)\n```\n\n\u2022 **Detailed Reporting Protocol**:\n  1. **Independence of Judgment**: Where joint auditors disagree on the audit opinion or matters to be reported, each is entitled to express his opinion independently.\n  2. **Separate Reports**: The majority (A & C) will issue their report, while B will issue a separate adverse audit report.\n  3. **Other Matter Paragraph**: Both reports shall contain an **Other Matter (OM) Paragraph** stating that another joint auditor has issued a separate audit report on the same financial statements.",
    "defaultRemarks": {
      "efficiencyReasoning": "Evaluated on affirming that majority rule does not bind a joint auditor, requiring separate reports with cross-referencing under Other Matter paragraph.",
      "criticalMisses": [
        "Asserting that 2:1 majority prevails in auditing (confusing company board meetings with joint audit responsibilities).",
        "Omitting the cross-reference under Other Matter Paragraph as per SA 706."
      ],
      "suggestions": [
        "State explicitly that independent professional judgment cannot be overridden by majority vote."
      ]
    }
  },
  {
    "id": "aud_rep_caro_11",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "CARO 2020 Clause 3(ix) - Bank Loan Default & Restructuring Approved Post Balance Sheet Date (Gautam Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / RTP Nov 2022 (CARO 2020)",
    "question": "Gautam Limited borrowed \u20b91,000 crore from XYZ Bank (principal repayable after 5 years, annual interest). The company defaulted on the 5th instalment of interest (\u20b9100 crore) and principal (\u20b91,000 crore) due on June 30, 2021. On March 31, 2021, the company approached banks to restructure the debt into a new loan of \u20b91,100 crore. The restructuring agreement was approved and signed on April 8, 2022. The management did not disclose the default on March 31, 2022, claiming the old loan ceased to exist upon restructuring. Guide the statutory auditors regarding reporting under CARO 2020 and SA 705.",
    "keyConcepts": [
      {
        "keyword": "CARO 2020 Clause 3(ix)",
        "category": "Rule",
        "description": "Reporting on default in repayment of loans or other borrowings or interest thereon to any lender."
      },
      {
        "keyword": "Status as on Balance Sheet Date",
        "category": "Provision",
        "description": "Restructuring agreement signed on April 8, 2022 means default continued as on March 31, 2022."
      },
      {
        "keyword": "Lender-wise Default Table Format",
        "category": "Rule",
        "description": "Mandatory tabular reporting: Nature of borrowing, Name of lender, Amount unpaid, Principal/Interest, Days delay."
      },
      {
        "keyword": "Impact on Audit Opinion under SA 705",
        "category": "Standard",
        "description": "Non-disclosure of \u20b91,100 crore default in financial statements requires Qualified or Adverse opinion."
      }
    ],
    "shortSuggestedAnswer": "| Legal Parameter | Audit Position (CARO 2020 & SA 705) |\n| :--- | :--- |\n| **Default Event** | \u20b91,000 Cr principal + \u20b9100 Cr interest defaulted on 30-06-2021 |\n| **Restructuring Date** | Approved and signed on **April 8, 2022** (after balance sheet date 31-03-2022) |\n| **Position as at 31-03-2022** | Restructuring was **not approved** as on year-end; default continued |\n| **Management Claim** | Old loan ceased to exist \u2014 **Invalid / Tenable** |\n\n\u2022 **Reporting under CARO 2020 Clause 3(ix)(a)**:\n  - The auditor is required to report defaults to any lender in the prescribed format:\n\n| Nature of Borrowing | Name of Lender | Amount Not Paid on Due Date | Whether Principal or Interest | No. of Days Delay / Unpaid | Remarks |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| Term Loan | XYZ Bank | \u20b91,000 Crores | Principal | 274 Days (as on 31-03-2022) | Restructuring signed on 08-04-2022 |\n| Interest | XYZ Bank | \u20b9100 Crores | Interest | 274 Days (as on 31-03-2022) | Restructuring signed on 08-04-2022 |\n\n\u2022 **Impact on Main Audit Report (SA 705 / Schedule III)**:\n  - Schedule III mandates disclosure of continuing defaults on the balance sheet date.\n  - Complete non-disclosure of \u20b91,100 crore default violates the financial reporting framework.\n  - Due to the magnitude (\u20b91,100 crore), the auditor must evaluate pervasiveness and express either a **Qualified Opinion or Adverse Opinion** under SA 705.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on recognizing that restructuring signed post year-end does not erase default as on 31-03-2022, requiring tabular disclosure under CARO Clause 3(ix) and modification under SA 705.",
      "criticalMisses": [
        "Accepting management's contention that restructuring eliminates default reporting.",
        "Omitting the impact on main financial statements under Schedule III and SA 705."
      ],
      "suggestions": [
        "Include the mandatory CARO table columns: Nature, Lender, Amount, Principal/Interest, Days Delay, Remarks."
      ]
    }
  },
  {
    "id": "aud_rep_caro_12",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Schedule III & CARO 2020 Clause 3(ii)(b) - Discrepancy in Stock Statements Submitted to Banks (Jam Pvt Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / QP May 2022 (CARO 2020)",
    "question": "Jam Pvt. Ltd. obtained working capital facilities of \u20b910 crore from ABC Bank hypothecating stock. The quarterly stock statements submitted to the bank showed: Q1: Books \u20b911.50 Cr vs Bank \u20b914.00 Cr; Q2: Books \u20b914.75 Cr vs Bank \u20b917.00 Cr; Q3: Books \u20b911.50 Cr vs Bank \u20b914.00 Cr; Q4: Books \u20b915.25 Cr vs Bank \u20b915.25 Cr. Management did not disclose variations, stating stock statements to banks are an arbitrary formality for higher drawing power and no variation existed on March 31. Evaluate management's contention and outline reporting duties under Schedule III and CARO 2020.",
    "keyConcepts": [
      {
        "keyword": "Schedule III Point Y Disclosure",
        "category": "Provision",
        "description": "Mandatory reconciliation and disclosure of material discrepancies between quarterly returns and books."
      },
      {
        "keyword": "CARO 2020 Clause 3(ii)(b)",
        "category": "Rule",
        "description": "Sanctioned working capital limits > \u20b95 crore on security of current assets: quarterly returns agreement with books."
      },
      {
        "keyword": "Working Capital Limit Threshold \u20b95 Crore",
        "category": "Rule",
        "description": "Clause 3(ii)(b) applies as sanctioned limit is \u20b910 crore, exceeding the \u20b95 crore threshold."
      },
      {
        "keyword": "Quarter-end vs Year-end Position",
        "category": "Provision",
        "description": "Reporting required for any quarter during the year, not merely the year-end quarter."
      }
    ],
    "shortSuggestedAnswer": "| Provision | Statutory Requirement | Applicability to Jam Pvt Ltd |\n| :--- | :--- | :--- |\n| **Sanctioned Limit Threshold** | Working capital limits in excess of **\u20b95 crore** | Sanctioned \u20b910 crore (Threshold exceeded) |\n| **Timing Criterion** | At **any point of time** during the year | Variations existed in Q1, Q2, and Q3 |\n| **Management Defense** | Stock statements are a formality; Q4 has no variation | **Invalid / Rejected** by law |\n\n\u2022 **Reporting Requirements**:\n\n  1. **Schedule III to Companies Act, 2013 (Division I / Point Y)**:\n     - Companies having borrowings on security of current assets must disclose whether quarterly returns/statements filed with banks agree with books.\n     - If not, a summary of reconciliation and reasons for material discrepancies must be disclosed in notes. Management's non-disclosure is a statutory non-compliance.\n\n  2. **CARO 2020 Clause 3(ii)(b) Reporting**:\n     - The auditor must report the exact quarterly variances:\n\n| Quarter | Stock Value as per Books (\u20b9 Cr) | Stock Value as per Bank Return (\u20b9 Cr) | Discrepancy / Variation (\u20b9 Cr) | Reason / Auditor Remark |\n| :--- | :---: | :---: | :---: | :--- |\n| **Q1** | 11.50 | 14.00 | + \u20b92.50 Cr | Excess stock reported to Bank |\n| **Q2** | 14.75 | 17.00 | + \u20b92.25 Cr | Excess stock reported to Bank |\n| **Q3** | 11.50 | 14.00 | + \u20b92.50 Cr | Excess stock reported to Bank |\n| **Q4** | 15.25 | 15.25 | Nil | In agreement with books |\n\n\u2022 **Conclusion**:\n  - Contention of management is **not valid**. The auditor must report the quarterly differences in the CARO report and ensure appropriate disclosure in notes under Schedule III.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying the \u20b95 crore threshold under CARO 2020 Clause 3(ii)(b), rejecting management's 'mere formality' defense, and tabulating the exact quarterly discrepancies.",
      "criticalMisses": [
        "Agreeing with management that Q4 parity excuses earlier quarterly discrepancies.",
        "Omitting Schedule III mandatory disclosure requirements."
      ],
      "suggestions": [
        "Highlight that Clause 3(ii)(b) specifically uses the phrase 'at any point of time of the year'."
      ]
    }
  },
  {
    "id": "aud_rep_caro_13",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "CARO 2020 Clause 3(viii) & 3(xviii) - IT Survey Unrecorded Transactions & Outgoing Auditor Resignation Concerns (XMP Pvt Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / QP Nov 2022 (CARO 2020)",
    "question": "You are appointed auditor of XMP Pvt. Ltd. for FY 2021-22 after resignation of RS & Co., Chartered Accountants, who had certain concerns on accounting matters. During audit, you discover an Income Tax Department survey on Dec 7, 2021, unearthing unrecorded sales of \u20b95 lakhs and unrecorded gold purchase. The company surrendered these transactions before the Assessing Officer and paid taxes, but has still not recorded them in the books of account. Management requests you not to report these in CARO. Evaluate management's request and state the reporting duties under CARO 2020.",
    "keyConcepts": [
      {
        "keyword": "CARO 2020 Clause 3(viii)",
        "category": "Rule",
        "description": "Reporting on surrendered/disclosed income in tax assessments not recorded in books of account."
      },
      {
        "keyword": "CARO 2020 Clause 3(xviii)",
        "category": "Rule",
        "description": "Reporting on resignation of statutory auditors and consideration of issues raised by outgoing auditors."
      },
      {
        "keyword": "Statutory Reporting Obligation",
        "category": "Provision",
        "description": "Auditor is legally bound to report under CARO; client requests cannot override statutory duty."
      },
      {
        "keyword": "Recording of Previously Unrecorded Income",
        "category": "Keyword",
        "description": "Duty to verify whether previously unrecorded income surrendered has been recorded in books."
      }
    ],
    "shortSuggestedAnswer": "| Matter | Governing CARO 2020 Clause | Reporting Requirement |\n| :--- | :--- | :--- |\n| **Resignation of RS & Co.** | **Clause 3(xviii)** | Report auditor resignation and state whether incoming auditor considered issues/concerns of outgoing auditor. |\n| **Income Tax Survey Surrender** | **Clause 3(viii)** | Report whether surrendered transactions are recorded in books of account during the year. |\n| **Management Request to Omit** | **Ultra Vires / Invalid** | Reporting is a statutory duty to shareholders; request **must be rejected**. |\n\n\u2022 **Detailed Evaluation of Reporting Duties**:\n\n  1. **Clause 3(xviii) - Auditor Resignation**:\n     - The auditor must state that RS & Co. resigned during the year due to accounting concerns.\n     - The incoming auditor must report whether he has taken into consideration the issues, objections, or concerns raised by the outgoing auditor.\n\n  2. **Clause 3(viii) - Unrecorded Income Surrendered in Tax Assessments**:\n     - Mandates reporting whether any transactions not recorded in books have been surrendered/disclosed as income during the year in tax assessments under the Income Tax Act, 1961.\n     - If so, whether the previously unrecorded income has been properly recorded in the books during the year.\n     - *In this case*: \u20b95 lakhs unrecorded sales and gold purchases were surrendered to the AO and taxes paid, but **not recorded in books**. The auditor **must report this failure** under Clause 3(viii).\n\n  3. **Management Request**:\n     - Management's request is **not tenable**. CARO reporting is a statutory obligation owed to shareholders and the public.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on identifying both relevant CARO clauses (Clause 3(viii) for unrecorded tax surrender and Clause 3(xviii) for auditor resignation) and rejecting management's request.",
      "criticalMisses": [
        "Omitting Clause 3(xviii) regarding outgoing auditor resignation.",
        "Yielding to management's request not to disclose."
      ],
      "suggestions": [
        "Mention that paying taxes does not exempt the company from recording transactions in its books of accounts."
      ]
    }
  },
  {
    "id": "aud_rep_sec143_14",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Section 143(1) Mandatory Propriety Inquiries - Unsecured Loans, Book Entries & Personal Expenses (DP Ltd / Rare Airlines)",
    "difficulty": "Moderate",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / QP Nov 2019 & QP May 2018 (Section 143(1))",
    "question": "CA. G was appointed Statutory Auditor of DP Ltd. While conducting the audit, CA. G observed that: (a) Certain loans and advances were made without proper security and the terms were prejudicial to the interests of the company; (b) Trade receivables and trade payables were adjusted inter se merely by book entries; and (c) Certain personal expenses not covered by contractual obligations were charged to the revenue account. Comment on the reporting responsibilities of CA. G under Section 143(1) of the Companies Act, 2013.",
    "keyConcepts": [
      {
        "keyword": "Section 143(1) Duty to Inquire",
        "category": "Section",
        "description": "Duty of company auditor to make specific propriety inquiries during the audit."
      },
      {
        "keyword": "Clause (a) Loans and Advances",
        "category": "Provision",
        "description": "Inquire whether loans/advances made on basis of security are properly secured and terms not prejudicial."
      },
      {
        "keyword": "Clause (b) Book Entries",
        "category": "Provision",
        "description": "Inquire whether transactions represented merely by book entries are prejudicial to company interests."
      },
      {
        "keyword": "Clause (e) Personal Expenses",
        "category": "Provision",
        "description": "Inquire whether personal expenses have been charged to revenue account without business justification."
      },
      {
        "keyword": "Reporting Only on Adverse Findings",
        "category": "Rule",
        "description": "Auditor is not required to report unless he has special adverse comments; if satisfied, no reporting needed."
      }
    ],
    "shortSuggestedAnswer": "| Statutory Clause (Sec 143(1)) | Core Legal Requirement | Auditor's Specific Duty in Case of DP Ltd |\n| :--- | :--- | :--- |\n| **Section 143(1)(a)** | Inquire into terms of loans/advances (security & prejudicial nature) | If loans are unsecured and prejudicial, **enter an adverse comment/qualify report**. |\n| **Section 143(1)(b)** | Transactions represented merely by book entries | Inter-se set-off of debtors/creditors without commercial basis is a book entry; **report if prejudicial**. |\n| **Section 143(1)(e)** | Personal expenses charged to revenue | Personal expenses not justified by contract or business practice **must be reported & qualified if material**. |\n\n```\n[Section 143(1) Reporting Principle]\nAuditor Inquires into 6 Propriety Matters (a) to (f)\n               \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                \u25bc\nSatisfied / In Order   Adverse / Dubious Findings\n       \u2502                \u2502\nNo Reporting Required   Must Report in Audit Report\n                        (Qualify if Material)\n```\n\n\u2022 **Statutory Principles under Companies Act, 2013**:\n  1. **Nature of Duty**: Section 143(1) is a duty to *inquire*, not necessarily to *report*. As clarified by ICAI's Research Committee: *The auditor is not required to report on the matters specified unless he has special comments to make. If satisfied, he has no further duty to report.*\n  2. **Analysis for DP Ltd**:\n     - **Loans & Advances (Clause a)**: Terms entered into are prejudicial to the company; CA G **must qualify or report** this finding.\n     - **Book Entries (Clause b)**: Adjusting trade receivables and payables inter se without transaction backing is purely a book entry. CA G must evaluate legitimate business interest and report.\n     - **Personal Expenses (Clause e)**: Charging non-contractual personal expenses to revenue distorts profitability. CA G must report the fact, and if amounts are material, **qualify the audit report**.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on explaining the statutory principle of Section 143(1) (reporting by exception) and applying Clauses (a), (b), and (e) to the given facts.",
      "criticalMisses": [
        "Thinking that Section 143(1) requires a positive statement in every audit report even when satisfied.",
        "Omitting the specific qualification requirement when personal expenses are material."
      ],
      "suggestions": [
        "State clearly the distinction between Section 143(1) (reporting by exception) and Section 143(3) (mandatory affirmative reporting)."
      ]
    }
  },
  {
    "id": "aud_rep_caro_15",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "CARO 2020 Clause 3(i)(d) & 3(ii)(b) - ROU Asset Revaluation >= 10% & Bank Working Capital Limits (Sinwar Ltd)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / RTP May 2022 (CARO 2020)",
    "question": "In the statutory audit of Sinwar Ltd. (an unlisted public company), the audit team made two observations: (a) One Plant & Equipment taken on lease (Right of Use asset) was revalued by a registered valuer, changing the aggregate net carrying value of Plant & Equipment from \u20b94.00 crore to \u20b94.45 crore (an increase of \u20b945 lakhs / 11.25%). (b) Sinwar Ltd. was sanctioned a cash credit limit of \u20b95.5 crore by DMC Bank against security of current assets, and quarterly returns filed agreed with books. Examine the reporting obligations under CARO 2020.",
    "keyConcepts": [
      {
        "keyword": "CARO 2020 Clause 3(i)(d)",
        "category": "Rule",
        "description": "Revaluation of PPE (including Right of Use assets) or intangible assets: Registered valuer & change >= 10%."
      },
      {
        "keyword": "10% Materiality Threshold in Aggregate",
        "category": "Rule",
        "description": "Reporting required if change is 10% or more in aggregate of net carrying value of each class of PPE/ROU."
      },
      {
        "keyword": "CARO 2020 Clause 3(ii)(b)",
        "category": "Rule",
        "description": "Sanctioned working capital limits > \u20b95 crore on security of current assets: quarterly returns agreement."
      },
      {
        "keyword": "Right of Use (ROU) Asset Coverage",
        "category": "Provision",
        "description": "Explicit inclusion of Right of Use assets in Clause 3(i)(d) introduced in CARO 2020."
      }
    ],
    "shortSuggestedAnswer": "| Observation | Governing CARO 2020 Clause | Threshold / Condition | Reporting Mandate |\n| :--- | :--- | :--- | :--- |\n| **(a) ROU Asset Revaluation** | **Clause 3(i)(d)** | Change of \u20b945 Lakhs on \u20b94.00 Cr = **11.25% (>= 10%)** | **Must Report**: State revaluation by Registered Valuer & specify amount of change (\u20b945 Lakhs). |\n| **(b) Working Capital Facility** | **Clause 3(ii)(b)** | Sanctioned \u20b95.5 Cr **(> \u20b95.00 Cr)** | **Must Report**: State limits > \u20b95 Cr sanctioned, and confirm quarterly statements agree with books. |\n\n\u2022 **Statutory Analysis**:\n\n  1. **Clause 3(i)(d) - PPE / ROU Revaluation**:\n     - Under Clause 3(i)(d), the auditor must state whether the company has revalued its PPE (including Right of Use assets) or intangible assets during the year.\n     - Sub-clause requirements:\n       - (i) Whether revaluation is based on valuation by a **Registered Valuer**.\n       - (ii) Specify the amount of change if change is **10% or more** in aggregate of net carrying value.\n     - *Application*: Plant & Equipment (including ROU) changed from \u20b94.00 Cr to \u20b94.45 Cr (11.25% change). The auditor must explicitly report the valuation by registered valuer and the \u20b945 lakh increase.\n\n  2. **Clause 3(ii)(b) - Working Capital Limits**:\n     - Under Clause 3(ii)(b), if sanctioned working capital limits exceed **\u20b95 crore** in aggregate from banks/FIs on security of current assets, report whether quarterly statements agree with books.\n     - *Application*: Sanctioned limit is \u20b95.5 crore (> \u20b95 Cr). As statements agree with books, the auditor must affirmatively confirm agreement in the CARO report.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying the 10% threshold under Clause 3(i)(d) to ROU assets and the \u20b95 crore threshold under Clause 3(ii)(b).",
      "criticalMisses": [
        "Failing to compute the 11.25% change (\u20b945L / \u20b94Cr) to check the 10% threshold.",
        "Overlooking that CARO 2020 explicitly covers Right of Use (ROU) assets."
      ],
      "suggestions": [
        "Always state the percentage computation clearly in the answer: (4.45 - 4.00) / 4.00 = 11.25% >= 10%."
      ]
    }
  },
  {
    "id": "aud_rep_caro_16",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "CARO 2020 Clause 3(ix) - Diversion of Term Loan Funds for Administrative Office Renovation (LM Pvt Ltd)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / QP Nov 2018 (CARO 2020 Clause 3(ix))",
    "question": "During FY 2017-18, LM Private Limited borrowed a term loan of \u20b9120 lakhs from a nationalized bank (\u20b9100 lakhs for plant machinery and \u20b920 lakhs for erection expenses). The bank disbursed \u20b9100 lakhs directly to the machinery vendor. The machinery was kept as capital stock under construction. On 28-02-2018, the company drew the balance of \u20b920 lakhs into its current account and utilized the entire sum for renovating its administrative office building. Comment on the reporting concerns of the auditor under CARO 2020.",
    "keyConcepts": [
      {
        "keyword": "CARO 2020 Clause 3(ix)(c)",
        "category": "Rule",
        "description": "Reporting whether term loans were applied for the purpose for which the loans were obtained."
      },
      {
        "keyword": "Diversion of Term Loan Funds",
        "category": "Provision",
        "description": "Using loan sanctioned for machinery erection towards administrative building renovation."
      },
      {
        "keyword": "End-Use Verification Procedures",
        "category": "Provision",
        "description": "Comparing sanctioned terms in bank sanction letter with actual end-use vouchers and capitalization."
      },
      {
        "keyword": "Temporary Diversion Reporting",
        "category": "Keyword",
        "description": "Auditor's report must state that pending utilization, funds were diverted for another purpose."
      }
    ],
    "shortSuggestedAnswer": "| Term Loan Tranche | Sanctioned Purpose | Actual Utilization | CARO 2020 Audit Finding |\n| :--- | :--- | :--- | :--- |\n| **Tranche 1 (\u20b9100 Lakhs)** | Machinery Purchase | Directly paid to vendor | In order (Proper end-use verified) |\n| **Tranche 2 (\u20b920 Lakhs)** | Erection Expenses | Renovating administrative office building | **Diversion of Term Loan Funds** |\n\n```\n[Auditor's Verification of Loan End-Use (CARO 2020 Clause 3(ix)(c))]\nExamine Bank Sanction Letter \u2500\u2500\u25ba Purpose: \u20b920 Lakhs for Erection\n               \u2502\n               \u25bc\nTrace Bank Disbursement \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba Drawn into Current Account\n               \u2502\n               \u25bc\nExamine Actual Expenditure \u2500\u2500\u2500\u2500\u2500\u25ba Renovated Administrative Office\n               \u2502\n               \u25bc\nStatutory Conclusion \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25ba Report under Clause 3(ix)(c)\n```\n\n\u2022 **Statutory Reporting under CARO 2020 Clause 3(ix)(c)**:\n  1. **Auditor's Duty**:\n     - The auditor must verify whether term loans obtained were applied for the purpose for which they were sanctioned.\n     - The auditor examines sanction letters, loan proposals, and actual expenditure vouchers.\n  2. **Application to LM Pvt. Ltd.**:\n     - The sum of \u20b920 lakhs sanctioned specifically for erection expenses was utilized for office renovation.\n     - Even if the management treats this as a temporary utilization pending installation, the auditor **must state the fact in the audit report** that funds were not used for the sanctioned purpose and were diverted to administrative office renovation.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on correctly applying CARO Clause 3(ix)(c) regarding end-use verification of term loans and reporting fund diversion.",
      "criticalMisses": [
        "Failing to cite Clause 3(ix)(c) of CARO 2020.",
        "Accepting the defense that temporary diversion before erection does not require reporting."
      ],
      "suggestions": [
        "Contrast short-term borrowings used for long-term purposes (Clause 3(ix)(d)) with term loans not used for purpose (Clause 3(ix)(c))."
      ]
    }
  },
  {
    "id": "aud_rep_sa720_17",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Material Inconsistency in Other Information - Commodity Price Trends vs Reported Profit Margins (MAP Ltd / Suchi Ltd)",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / QP Nov 2020 & May 2024 RTP Q.13 (SA 720)",
    "question": "GS & Co., Statutory Auditors of MAP Ltd. for FY 2019-20, are reviewing the draft Annual Report. The audit in-charge observed that the company included an item in its Annual Report indicating a downward trend in market prices of key commodities/raw materials as compared to the previous year. However, the actual profit margin of the company reported in the audited financial statements moved in the reverse direction (declined). The audit manager discussed this with the partner, who replied that auditors are not concerned with management disclosures in the annual report as it is management's sole responsibility. Evaluate the partner's approach and explain the auditor's reporting duties under SA 720.",
    "keyConcepts": [
      {
        "keyword": "SA 720 Other Information",
        "category": "Standard",
        "description": "Auditor's responsibilities relating to other information in documents containing audited financial statements."
      },
      {
        "keyword": "Material Inconsistency",
        "category": "Provision",
        "description": "A material contradiction between other information and the audited financial statements."
      },
      {
        "keyword": "Descriptions of Commodity Price Trends",
        "category": "Keyword",
        "description": "Explicitly recognized in SA 720 as an example of 'Other Items' included in other information."
      },
      {
        "keyword": "Sequential Remedial Protocol",
        "category": "Rule",
        "description": "Request management correction -> If refused, communicate to TCWG -> Report under Other Information section."
      }
    ],
    "shortSuggestedAnswer": "| Attribute | Evaluation under SA 720 (Revised) |\n| :--- | :--- |\n| **Partner's View** | Contended auditors are not concerned with annual report disclosures. |\n| **Legal Validity** | **Completely Incorrect & Defective.** |\n| **Scope of Other Info** | Descriptions of trends in market prices of raw materials is an express example of Other Information under SA 720. |\n\n```\n[Auditor's Action Plan for Material Inconsistency under SA 720]\nIdentify Inconsistency between Annual Report & Financials\n               \u2502\n               \u25bc\nStep 1: Discuss with Management & Request Correction\n       \u251c\u2500\u2500 If Management Corrects \u2500\u2500\u25ba Verify Correction in Final Print\n       \u2502\n       \u2514\u2500\u2500 If Management Refuses\n                 \u2502\n                 \u25bc\nStep 2: Communicate with Those Charged with Governance (TCWG)\n                 \u2502\n                 \u251c\u2500\u2500 If TCWG Refuses to Correct\n                 \u2502         \u2502\n                 \u2502         \u25bc\nStep 3: Action in Auditor's Report (Other Information Section)\n        \u251c\u2500\u2500 Describe the uncorrected material misstatement of other info\n        \u251c\u2500\u2500 Withhold issuance / Seek legal advice / Withdraw (if feasible)\n```\n\n\u2022 **Conclusion**:\n  - The partner\u2019s view that auditors have no concern with annual report disclosures is **incorrect**.\n  - If management refuses to correct the contradiction, the auditor must inform TCWG and include a statement describing the material misstatement under the **\"Other Information\"** section in the audit report.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on rejecting the partner's view and setting out the procedural steps under SA 720 for resolving material inconsistencies in other information.",
      "criticalMisses": [
        "Agreeing with the partner that the annual report is beyond the auditor's purview.",
        "Omitting the communication to TCWG and reporting under the 'Other Information' section."
      ],
      "suggestions": [
        "Highlight that an uncorrected inconsistency in other information does NOT modify the audit opinion on the financial statements, but is reported in the Other Information section."
      ]
    }
  },
  {
    "id": "aud_rep_sa299_18",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Joint Audit - Common IT General Controls & Lapses in Testing Batch Processing Controls (KNB Bank / DES & Associates)",
    "difficulty": "Advanced",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / TYK SA 299 Q.3",
    "question": "Four audit firms\u2014GPR & Co., MKS & Co., CY & Associates, and DES & Associates\u2014were appointed statutory joint auditors of KNB Bank, a public sector bank. The professional work was divided on the basis of bank zones. However, work relating to 'IT Systems and controls' was not allocated due to its common nature. While planning for this common area, it was jointly decided to test IT general controls, including batch-processing and data center security. The actual audit procedures for testing controls over batch processing were performed by the team of DES & Associates. In case the work is not performed professionally by DES & Associates, where does liability for such lapses lie under SA 299?",
    "keyConcepts": [
      {
        "keyword": "SA 299 Joint Audit",
        "category": "Standard",
        "description": "Joint Audit of Financial Statements."
      },
      {
        "keyword": "Common Audit Areas Responsibility",
        "category": "Provision",
        "description": "All joint auditors jointly responsible for appropriateness of nature, timing and extent of planned procedures."
      },
      {
        "keyword": "Individual Execution Responsibility",
        "category": "Rule",
        "description": "Responsibility for individual execution of agreed procedures lies solely with the executing joint auditor."
      },
      {
        "keyword": "Liability for Lapses of DES & Associates",
        "category": "Keyword",
        "description": "DES & Associates is exclusively liable for defective execution of batch processing audit procedures."
      }
    ],
    "shortSuggestedAnswer": "| Dimension of Audit Work | Responsible Party under SA 299 | Allocation in KNB Bank Audit |\n| :--- | :--- | :--- |\n| **1. Planning & Audit Design** (Nature, Timing & Extent) | **All Joint Auditors Jointly & Severally** | GPR & Co., MKS & Co., CY & Associates, and DES & Associates jointly |\n| **2. Actual Execution of Procedures** (Batch Processing Testing) | **Individual Joint Auditor Executing the Work** | **DES & Associates Exclusively** |\n\n```\n[SA 299 Division of Responsibility in Common Audit Areas]\n          Common Audit Area (IT Systems & Controls)\n                        \u2502\n       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n       \u25bc                                 \u25bc\nPlanning of Common Procedures    Individual Execution of Tests\n\u2022 Nature, timing & extent        \u2022 Testing batch processing controls\n\u2022 Agreed by all 4 firms          \u2022 Undertaken by DES & Associates\n       \u2502                                 \u2502\n       \u25bc                                 \u25bc\nJoint & Several Responsibility   Sole & Individual Responsibility\n(GPR, MKS, CY & DES)             (DES & Associates Only)\n```\n\n\u2022 **Statutory Principles under SA 299**:\n  - In respect of common audit areas, the joint auditors are **jointly responsible only for the appropriateness of the nature, timing, and extent** of planned audit procedures agreed among them.\n  - **Execution of Work**: The responsibility for the *individual execution* of audit procedures lies exclusively with the concerned joint auditor performing them.\n\n\u2022 **Conclusion**:\n  - Since the planning was done jointly, all four firms are responsible for the audit program design.\n  - However, for the lapses in actual execution and testing of batch-processing controls, **DES & Associates alone would be responsible**.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing joint responsibility for planning common areas versus individual responsibility for actual execution under SA 299.",
      "criticalMisses": [
        "Holding all four joint audit firms liable for the execution failure of DES & Associates.",
        "Failing to explain the bifurcation between planning responsibility and execution responsibility."
      ],
      "suggestions": [
        "Cite the exact SA 299 principle: 'Proper execution of audit procedures is the individual responsibility of the joint auditor concerned.'"
      ]
    }
  },
  {
    "id": "aud_rep_sa620_19",
    "subjectId": "Audit",
    "chapterName": "Reporting",
    "title": "Conflicting Actuary Valuation Reports Consulted by Joint Auditors - Evaluative Duties & Liability (KRP Ltd)",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Chapter 2 / RTP Nov 2018 (SA 620)",
    "question": "KRP Ltd. appointed Mr. X, Mr. Y, and Mr. Z as joint auditors for FY 2017-18. For valuation of the company's gratuity scheme, each consulted their own known actuaries. Major differences emerged in the actuarial reports. Mr. X agreed with Mr. Y's actuary report, while Mr. Z disagreed and submitted a separate audit report. Mr. X contends Mr. Y's report should prevail due to majority vote. Later, the report of Mr. Y's actuary was found faulty. Explain the liability of each auditor under SA 620, SA 299, and the Chartered Accountants Act, 1949.",
    "keyConcepts": [
      {
        "keyword": "SA 620 Auditor's Expert",
        "category": "Standard",
        "description": "Auditor has sole responsibility for audit opinion; responsibility not reduced by use of expert."
      },
      {
        "keyword": "Evaluating Adequacy of Expert Work",
        "category": "Provision",
        "description": "Auditor must evaluate relevance, reasonableness of assumptions/methods, and source data accuracy."
      },
      {
        "keyword": "Gross Negligence under Second Schedule",
        "category": "Provision",
        "description": "Relying blindly on faulty expert report without evaluating adequacy constitutes gross negligence (Clause 7 Part I)."
      },
      {
        "keyword": "Non-Liability of Dissenting Auditor",
        "category": "Rule",
        "description": "Mr. Z issued a separate audit report dissenting from the valuation and is not liable."
      }
    ],
    "shortSuggestedAnswer": "| Auditor | Action Taken | Legal Status & Liability (SA 620 / SA 299 / CA Act, 1949) |\n| :--- | :--- | :--- |\n| **Mr. X & Mr. Y** | Accepted faulty actuary report relying on 'majority vote' without verifying source data/assumptions | **Guilty of Gross Negligence** under Clause (7) Part I of Second Schedule to CA Act, 1949. Failed SA 620 evaluative duties. |\n| **Mr. Z** | Disagreed with faulty report and issued a separate independent audit report | **Not Liable.** Exercised professional skepticism and complied with SA 299 right to separate report. |\n\n```\n[Evaluation of Expert's Work under SA 620]\nAuditor Engages Actuary (Auditor's Expert)\n                  \u2502\n                  \u25bc\nAuditor's Non-Delegable Evaluation:\n  \u251c\u2500\u2500 1. Relevance & reasonableness of findings/conclusions (SA 500)\n  \u251c\u2500\u2500 2. Reasonableness of significant assumptions & methods\n  \u2514\u2500\u2500 3. Relevance, completeness & accuracy of SOURCE DATA used\n                  \u2502\n                  \u25bc\nMr. X & Mr. Y failed this evaluation \u2500\u2500\u25ba Held Guilty of Gross Negligence\n```\n\n\u2022 **Statutory Principles under SA 620**:\n  1. **Auditor's Sole Responsibility**: The auditor has sole responsibility for the audit opinion expressed. That responsibility is **not reduced** by the auditor's use of the work of an auditor's expert.\n  2. **Mandatory Due Diligence**: Before relying on an actuary's valuation, auditors must verify the relevance and reasonableness of assumptions and examine the completeness and accuracy of source data.\n  3. **No Majority Rule for Faulty Evidence**: Mr. X's contention that majority rule justifies accepting the report is legally flawed. Relying blindly on an expert without evaluating adequacy amounts to gross negligence.\n  4. **Liability Allocation**: Mr. X and Mr. Y are liable for professional misconduct, whereas Mr. Z is absolved as he dissented and submitted a separate audit report.",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on evaluating the non-delegable duty under SA 620 to test expert source data and assumptions, resulting in gross negligence for X and Y, and exoneration for Z.",
      "criticalMisses": [
        "Holding Mr. Z equally liable despite his separate report.",
        "Believing that an auditor can transfer responsibility to an expert under SA 620."
      ],
      "suggestions": [
        "Cite the key SA 620 provision: 'The auditor has sole responsibility for the audit opinion expressed, and that responsibility is not reduced by the auditor\u2019s use of the work of an auditor\u2019s expert.'"
      ]
    }
  }
];
