import json

questions = [
  {
    "id": "aud_std_full_01",
    "subjectId": "Audit",
    "chapterName": "Quality Control",
    "title": "SQC 1 & SA 220 - Complaints and Allegations Management & Annual Independence Confirmations",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 1 / Nov 2023 Exam & May 2024 RTP",
    "question": "M/s R & Co., a firm of Chartered Accountants, received an anonymous written complaint alleging that the audit team assigned to the statutory audit of Zen Ltd. (a listed entity) received expensive international holiday packages from the company's CFO. Furthermore, the engagement partner failed to obtain annual written independence confirmations from the audit team members. What policies and procedures must the firm establish under SQC 1 and SA 220 to handle complaints, allegations, and independence monitoring?",
    "keyConcepts": [
      { "keyword": "SQC 1 Complaints and Allegations", "category": "Standard", "description": "Firm policies for handling complaints/allegations of non-compliance with professional standards." },
      { "keyword": "SA 220 Ethical Requirements & Independence", "category": "Standard", "description": "Engagement partner duty to form a conclusion on compliance with independence requirements." },
      { "keyword": "Annual Written Independence Confirmation", "category": "Rule", "description": "SQC 1 mandate to obtain annual written confirmations of compliance with independence from all personnel." },
      { "keyword": "Investigation by Independent Partner", "category": "Provision", "description": "Complaints must be investigated by partners not involved in the engagement." }
    ],
    "shortSuggestedAnswer": """| Compliance Element | SQC 1 / SA 220 Statutory Requirement | Case Application (M/s R & Co.) |
| :--- | :--- | :--- |
| **Annual Independence Confirmation** | Firm must obtain annual written confirmation of independence from all personnel required to be independent. | **Defective**: Engagement Partner failed to obtain written independence declarations from audit team members. |
| **Receipt of Allegation (Gifts/Hospitality)** | Acceptance of expensive international holiday packages breaches fundamental ethical principles (objectivity, integrity). | Immediate investigation required; high threat to independence created by hospitality/gifts. |
| **Investigation Protocol** | Must be investigated by an independent partner possessing necessary experience and authority, not involved with Zen Ltd. | The complaint must be documented, investigated objectively, and reported to the firm's leadership. |
| **Remedial Action** | Disciplinary actions, removal of personnel from team, external consultation, or withdrawal from engagement. | Audit team members involved must be immediately replaced; re-evaluate audit work performed. |

```
[SQC 1 Complaints & Independence Enforcement Workflow]
                 Anonymous Complaint Received
           (Allegation of Gifts / Foreign Holiday)
                             │
                             ▼
     Assign Independent Investigator (Unrelated Partner)
                             │
       ┌─────────────────────┴─────────────────────┐
       ▼                                           ▼
Verify Compliance with Independence         Investigate Factual Veracity
• Check written declarations               • Examine travel sponsorship
• Audit team relationships                 • Financial dealings with CFO
       │                                           │
       └─────────────────────┬─────────────────────┘
                             ▼
                  DETERMINE REMEDIAL ACTION
   • Disciplinary action against compromised staff
   • Replace entire engagement team
   • Perform independent re-audit of sensitive areas
   • Report breach to Firm Managing Partner
```

• **Statutory Principles under SQC 1 & SA 220**:
  1. **Independence Monitoring**:
     - SQC 1 requires the firm to obtain written confirmation of compliance with its policies on independence from all firm personnel required to be independent at least annually.
     - Failure to obtain written confirmations constitutes a direct failure of the firm's system of quality control.
  2. **Gifts and Hospitality Threat**:
     - Gifts or hospitality of more than token value create severe self-interest and familiarity threats to objectivity.
     - International holiday packages represent substantial financial value, completely extinguishing audit independence.
  3. **Handling of Complaints and Allegations**:
     - The firm must establish channels for reporting complaints and allegations confidentially.
     - Investigations must be supervised by a partner not involved in the engagement.
     - If verified, the firm must take disciplinary action, consider withdrawing from the engagement, or assign a completely fresh team to re-perform critical audit procedures.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SQC 1 mandates on annual written independence confirmations and independent investigation protocols for ethical breaches and hospitality gifts.",
      "criticalMisses": [
        "Failing to mention the mandatory annual written confirmation under SQC 1.",
        "Allowing the engagement partner to investigate their own team's allegation."
      ],
      "suggestions": [
        "Cite SQC 1 paragraph on 'Complaints and Allegations' and emphasize that gifts of non-trivial value create insurmountable familiarity/self-interest threats."
      ]
    }
  },
  {
    "id": "aud_std_full_02",
    "subjectId": "Audit",
    "chapterName": "Quality Control",
    "title": "NFRA Powers u/s 132(4) & QRB vs PRB Jurisdictional Matrix",
    "difficulty": "Mastery",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 1 / May 2024 MTP S1 Q.3 & Companies Act 2013",
    "question": "The National Financial Reporting Authority (NFRA) initiated suo motu disciplinary proceedings against CA K, the statutory auditor of a listed commercial bank, alleging gross negligence in monitoring NPA divergence of ₹1,400 crores. CA K argued that only the Quality Review Board (QRB) and the Disciplinary Committee of the ICAI possess statutory authority to investigate individual members, and NFRA's retrospective scrutiny violates constitutional rights. Analyze the jurisdictional boundaries between NFRA, QRB, and PRB under Section 132 of Companies Act, 2013.",
    "keyConcepts": [
      { "keyword": "Section 132(4) of Companies Act, 2013", "category": "Section", "description": "NFRA exclusive power to investigate professional misconduct of auditors of specified entities." },
      { "keyword": "NFRA Exclusive Jurisdiction Bar", "category": "Provision", "description": "No other institute or body shall initiate or continue any proceedings in matters where NFRA has initiated an investigation." },
      { "keyword": "Class of Companies Governed by NFRA", "category": "Rule", "description": "All listed companies, unlisted public companies with paid-up capital ≥ ₹500 Cr, turnover ≥ ₹1,000 Cr, or loans ≥ ₹500 Cr." },
      { "keyword": "QRB vs PRB Roles", "category": "Provision", "description": "PRB is ICAI internal peer review; QRB inspects non-NFRA public interest entities u/s 28A of CA Act." }
    ],
    "shortSuggestedAnswer": """| Authority | Statutory Foundation | Primary Jurisdiction / Class of Entities | Penal & Disciplinary Powers |
| :--- | :--- | :--- | :--- |
| **NFRA** | Section 132(1) & 132(4) of Companies Act, 2013 | Listed entities, large unlisted public companies, banking, insurance, and electricity companies | Powers of Civil Court; impose fines (indiv: min ₹1L to 5x fees; firm: min ₹5L to 10x fees) and debarment (6 months to 10 years). |
| **QRB** | Section 28A of Chartered Accountants Act, 1949 | Unlisted public companies below NFRA thresholds, and entities referred by Central Govt / ICAI | Recommend disciplinary action to ICAI Council; cannot directly debar or penalize. |
| **PRB** | Council of ICAI Regulations | Practice units auditing private, SME, and peer-review-mandated entities | Issues Peer Review Certificates; can recommend training/monitoring, cannot impose fines. |

```
[Jurisdictional Hierarchy for Auditor Investigation]
             Audit of Entity Involving Alleged Misconduct
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
Class of Companies Governed by NFRA               Entities Outside NFRA Scope
• Listed Companies                                • Unlisted below thresholds
• Banks, Insurance, Power Co.                     • Private Limited Entities
• Large Unlisted (Paid-up ≥ ₹500 Cr,              • Small Audit Firms
  Turnover ≥ ₹1,000 Cr, Loans ≥ ₹500 Cr)                      │
       │                                                       ▼
       ▼                                         ICAI Disciplinary Mechanism
NFRA Has EXCLUSIVE Jurisdiction                          & QRB Recommendations
(Section 132(4) Companies Act)                   (Section 21 & 28A of CA Act)
(Bar on ICAI / any other body from proceeding)
```

• **Statutory Principles under Section 132(4)**:
  1. **Exclusive Jurisdiction**: Under Section 132(4), NFRA has the power to investigate into matters of professional or other misconduct committed by any member or firm of Chartered Accountants for specified classes of companies.
  2. **Statutory Bar on Other Bodies**: When NFRA has initiated an investigation under this section, **no other institute or body shall initiate or continue any proceedings** in such matter of misconduct.
  3. **Specified Companies**: Banking companies are explicitly specified under Rule 3 of NFRA Rules, 2018. Therefore, NFRA has undisputed jurisdiction over CA K.
  4. **Conclusion**: CA K's defense is legally untenable; NFRA possesses paramount jurisdiction, superseding ICAI and QRB for banking and listed audits.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on citing Section 132(4) Companies Act 2013, the non-obstante jurisdictional bar on ICAI/QRB, NFRA Rule 3 applicability to banks, and distinct scopes of NFRA, QRB, and PRB.",
      "criticalMisses": [
        "Failing to mention the statutory bar in Section 132(4) preventing ICAI from acting once NFRA initiates investigation.",
        "Missing Rule 3 entity thresholds (Listed companies, Banks, Insurance, ₹500 Cr capital / ₹1,000 Cr turnover)."
      ],
      "suggestions": [
        "Highlight NFRA's penal powers: fines up to 5x/10x fees and debarment from 6 months up to 10 years."
      ]
    }
  },
  {
    "id": "aud_std_full_03",
    "subjectId": "Audit",
    "chapterName": "General Auditing Principles and Auditors Responsibilities",
    "title": "SA 210 - Preconditions for Audit & Limitation on Scope Imposed Prior to Acceptance",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Ch 2 / Nov 2022 Exam (SA 210)",
    "question": "M/s Alpha & Associates received an offer to act as statutory auditors of Delta Ltd. During preliminary discussions, management stated that due to extreme confidentiality surrounding a new defense contract, the auditors would not be permitted to inspect the defense subsidiary's books or confirm receivables from government ministries. If management's restriction is such that the auditors believe it will lead to a disclaimer of opinion, what are the auditor's obligations under SA 210?",
    "keyConcepts": [
      { "keyword": "SA 210 Agreeing the Terms of Audit Engagements", "category": "Standard", "description": "Standard governing agreement of terms and preconditions for audit." },
      { "keyword": "Preconditions for an Audit", "category": "Provision", "description": "Acceptable FRF and management acknowledgment of responsibilities including unrestricted access." },
      { "keyword": "Limitation on Scope Prior to Acceptance (Para 7)", "category": "Rule", "description": "If management imposes a limitation resulting in a disclaimer of opinion, auditor shall NOT accept unless required by law." },
      { "keyword": "Unrestricted Access to Persons and Records", "category": "Provision", "description": "Mandatory management agreement to provide unrestricted access to all information and personnel." }
    ],
    "shortSuggestedAnswer": """| Operational Aspect | Statutory Mandate under SA 210 | Application to Delta Ltd. |
| :--- | :--- | :--- |
| **Verification of Preconditions** | Management must acknowledge responsibility to provide unrestricted access to all records, documentation, and personnel. | Management explicitly denies access to the defense subsidiary books and government receivable confirmations. |
| **Evaluation of Scope Limitation** | If limitation will result in auditor disclaiming an opinion on the financial statements. | Denial of access to significant subsidiary and government debtor ledger leads to a **Disclaimer of Opinion**. |
| **Acceptance Decision** | The auditor **shall not accept** such a limited engagement as an audit engagement unless required by law. | M/s Alpha & Associates **must decline / reject** the audit appointment. |

```
[SA 210 Engagement Acceptance Decision Tree]
         Proposed Audit Appointment Received
                          │
                          ▼
            Are Preconditions for Audit Met?
        (Acceptable FRF + Unrestricted Access)
                          │
       ┌──────────────────┴──────────────────┐
       ▼                                     ▼
      YES                                   NO
Accept Engagement               Has Management Imposed Scope Limitation
                                Resulting in Disclaimer of Opinion?
                                             │
                                ┌────────────┴────────────┐
                                ▼                         ▼
                               YES                        NO
                         DECLINE AUDIT            Evaluate Impact on
                          ENGAGEMENT              Acceptance Terms
                   (Mandatory under SA 210)
```

• **Statutory Principles under SA 210**:
  1. **Preconditions Duty**: The auditor shall determine whether the financial reporting framework is acceptable and obtain the agreement of management that it acknowledges and understands its responsibility.
  2. **Unrestricted Access**: Management must acknowledge its duty to provide the auditor with unrestricted access to persons within the entity from whom the auditor determines it necessary to obtain audit evidence.
  3. **Mandatory Rejection**: If management imposes a limitation on the scope of the auditor's work such that the auditor believes the limitation will result in the auditor disclaiming an opinion on the financial statements, **the auditor shall not accept such a limited engagement** as an audit engagement, unless required by law to do so.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 210 paragraph 7 rule prohibiting acceptance of an audit engagement where management imposes a scope restriction resulting in a disclaimer.",
      "criticalMisses": [
        "Suggesting that the auditor can accept and issue a disclaimer later.",
        "Failing to mention that unrestricted access is an essential precondition under SA 210."
      ],
      "suggestions": [
        "Distinguish between a restriction imposed prior to acceptance (SA 210 - must decline) vs restriction arising after acceptance (SA 705 - modify opinion or withdraw)."
      ]
    }
  },
  {
    "id": "aud_std_full_04",
    "subjectId": "Audit",
    "chapterName": "General Auditing Principles and Auditors Responsibilities",
    "title": "SA 250 - Non-Compliance with Laws and Regulations: Environmental Penalty vs Direct Tax Provisions",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 2 / May 2023 Exam (SA 250)",
    "question": "EcoChemicals Ltd. operates a heavy dye-manufacturing plant. During FY 2022-23, the State Pollution Control Board issued a closure notice and levied an exemplary environmental restoration penalty of ₹45 crores for discharging untreated chemical effluents into a public river. Management omitted this penalty and closure notice from the financial statements, claiming the matter is under legal challenge and does not directly relate to financial statement line items. (a) Distinguish between the auditor's responsibilities for the two categories of laws under SA 250; (b) What are the reporting duties of the statutory auditor regarding this environmental non-compliance?",
    "keyConcepts": [
      { "keyword": "SA 250 Consideration of Laws and Regulations", "category": "Standard", "description": "Standard governing auditor responsibilities regarding compliance with laws and regulations." },
      { "keyword": "Category 1 Laws (Direct Financial Effect)", "category": "Rule", "description": "Laws with direct effect on determination of material amounts and disclosures (e.g. Tax, Pension laws)." },
      { "keyword": "Category 2 Laws (Operating & Fundamental Laws)", "category": "Rule", "description": "Laws fundamental to operating aspects, ability to continue business, or to avoid material penalties." },
      { "keyword": "Reporting Material Non-Compliance (SA 705)", "category": "Provision", "description": "Express qualified or adverse opinion if non-compliance is not adequately disclosed or provided for." }
    ],
    "shortSuggestedAnswer": """| Legal Category (SA 250) | Scope & Nature of Legislation | Auditor's Statutory Responsibility | Case Application (EcoChemicals Ltd.) |
| :--- | :--- | :--- | :--- |
| **Category 1 Laws** | Laws that have a **direct effect** on the determination of material amounts and disclosures in FS (e.g. Income-tax Act, GST, Companies Act). | Obtain **Sufficient Appropriate Audit Evidence** regarding compliance with the provisions of these laws. | Direct tax provisions, TDS, GST liabilities. |
| **Category 2 Laws** | Other laws that do not have a direct effect, but compliance is **fundamental to operating aspects**, entity's ability to continue business, or avoid material penalties (e.g. Environmental, Pollution, Safety laws). | Undertake **specified audit procedures** to identify non-compliance: inquire of management, inspect regulatory correspondence. | **Pollution Control Board Closure Notice & ₹45 Cr Penalty**: Threatened license cancellation and massive fine. |

```
[SA 250 Two-Tier Legal Framework]
                     Applicable Laws & Regulations
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
CATEGORY 1: Direct Effect on FS Amounts           CATEGORY 2: Fundamental to Operating Licences
(Taxation, Pension, Corporate Reporting)          (Pollution Control, Factory Safety, Drug Licences)
       │                                                       │
       ▼                                                       ▼
Obtain SAAE Regarding Full Compliance             Perform Specified Procedures to Help Identify
(Vouch tax calculations, provisions)              (Inquire of TCWG, inspect regulatory notices)
       │                                                       │
       └───────────────────────────┬───────────────────────────┘
                                   ▼
        Material Non-Compliance Identified & Concealed by Management
       (₹45 Cr Environmental Penalty & Plant Closure Notice Omitted)
                                   │
                                   ▼
                       REPORTING UNDER SA 705
                    QUALIFIED OR ADVERSE OPINION
            (Material Misstatement due to Non-Disclosure)
```

• **Statutory Principles & Reporting Consequences**:
  1. **Two Categories under SA 250**:
     - *Category 1*: Direct effect on financial statements. Auditor must obtain SAAE regarding compliance.
     - *Category 2*: Fundamental to operations. Auditor must perform procedures to help identify non-compliance that may have a material effect on financial statements.
  2. **Analysis of Penalty and Closure Notice**:
     - The ₹45 Cr penalty is material. Non-provision or non-disclosure breaches Ind AS 37.
     - The closure notice threatens the entity's operating viability, directly impacting **Going Concern under SA 570**.
  3. **Reporting Duty**:
     - Management's refusal to disclose or provide for this material non-compliance results in a material misstatement.
     - The auditor must express a **Qualified or Adverse Opinion** under SA 705, and communicate the non-compliance to Those Charged with Governance (TCWG) under SA 260.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on distinguishing Category 1 (direct effect) from Category 2 (operating/license effect) laws under SA 250 and concluding on Qualified/Adverse opinion for omitted environmental penalties.",
      "criticalMisses": [
        "Failing to classify environmental laws as Category 2 (fundamental to operating viability).",
        "Overlooking the going concern threat triggered by the plant closure notice."
      ],
      "suggestions": [
        "Highlight that failure to disclose a material penalty of ₹45 Cr violates Ind AS 37 and warrants an Adverse/Qualified opinion under SA 705."
      ]
    }
  },
  {
    "id": "aud_std_full_05",
    "subjectId": "Audit",
    "chapterName": "General Auditing Principles and Auditors Responsibilities",
    "title": "SA 260 & SA 265 - Communicating Significant Deficiencies in Internal Control to TCWG",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Ch 2 / Nov 2020 Exam & May 2024 MTP S2 (SA 265)",
    "question": "During the statutory audit of Omega Ltd., the auditor discovered that user access rights in the enterprise ERP software allowed accounting clerks to create fictitious vendors and approve payment disbursements up to ₹50 lakhs without secondary supervisory authorization. The CFO requested the auditor not to issue a formal written letter on internal control, assuring that the software will be updated next quarter. What are the auditor's statutory responsibilities under SA 265 and SA 260 regarding communication of significant deficiencies?",
    "keyConcepts": [
      { "keyword": "SA 265 Communicating Deficiencies in Internal Control", "category": "Standard", "description": "Auditor's responsibility to communicate deficiencies in internal control in writing to TCWG and management." },
      { "keyword": "Significant Deficiency in Internal Control", "category": "Provision", "description": "A deficiency or combination of deficiencies that, in the auditor's professional judgment, is of sufficient importance." },
      { "keyword": "Mandatory Written Communication to TCWG", "category": "Rule", "description": "Auditor SHALL communicate in writing significant deficiencies in internal control identified during audit." },
      { "keyword": "Content of Written Communication", "category": "Rule", "description": "Description of deficiencies, explanation of potential effects, and contextual statements on audit scope." }
    ],
    "shortSuggestedAnswer": """| Operational Parameter | SA 265 Statutory Requirement | Case Application (Omega Ltd.) |
| :--- | :--- | :--- |
| **Deficiency Assessment** | Inadequate segregation of duties allowing unilateral vendor creation and disbursement approval up to ₹50 Lakhs. | Assessed as a **Significant Deficiency in Internal Control** (high vulnerability to fraud and material misstatement). |
| **Form of Communication** | The auditor **shall communicate in writing** significant deficiencies to TCWG on a timely basis. | CFO's verbal assurance cannot override the mandatory statutory requirement for **written communication**. |
| **Mandatory Contents of Letter** | • Detailed description of deficiencies.<br>• Explanation of potential effects (fraudulent cash outflow).<br>• Sufficient information to understand the context of the audit. | The auditor must issue a formal **Written Significant Deficiency Letter** to the Audit Committee / Board. |

```
[SA 265 Deficiency Evaluation & Communication Protocol]
                 Internal Control Deficiency Identified
          (Clerks can create vendors & approve ₹50L payouts)
                                   │
                                   ▼
        Is it a 'SIGNIFICANT DEFICIENCY' in Auditor's Judgment?
       (Risk of fraudulent payments, control override, no oversight)
                                   │
                                  YES
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
MANDATORY WRITTEN COMMUNICATION                    COMMUNICATE TO MANAGEMENT
   TO TCWG (Audit Committee / Board)                  (Appropriate level with
• Description of control flaw                          authority to remediate)
• Potential financial impact / fraud
• Context: Audit not designed for control opinion
       │
       ▼
Reject CFO's verbal request to suppress written letter
```

• **Statutory Principles under SA 265**:
  1. **Mandatory Written Form**: Under SA 265, the auditor shall communicate in writing significant deficiencies in internal control identified during the audit to Those Charged with Governance on a timely basis.
  2. **Professional Skepticism**: The auditor cannot waive this statutory duty based on verbal assurances or promises of future ERP updates.
  3. **Required Statements in Communication**:
     - The purpose of the audit was for the auditor to express an opinion on the financial statements.
     - The audit included consideration of internal control relevant to the preparation of financial statements in order to design audit procedures that are appropriate in the circumstances, but not for the purpose of expressing an opinion on the effectiveness of internal control.
     - The matters being reported are limited to those deficiencies that the auditor has identified during the audit and concluded are of sufficient importance to merit being reported.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 265 requirements: assessing unilateral disbursement approval as a significant deficiency and issuing a mandatory written communication to TCWG regardless of CFO verbal requests.",
      "criticalMisses": [
        "Accepting the CFO's verbal assurance without issuing a written communication.",
        "Failing to mention the required contextual disclaimers in the SA 265 letter."
      ],
      "suggestions": [
        "Emphasize that SA 265 mandates written communication for significant deficiencies, whereas non-significant deficiencies may be communicated verbally to management."
      ]
    }
  },
  {
    "id": "aud_std_full_06",
    "subjectId": "Audit",
    "chapterName": "Audit Planning, Strategy and Execution",
    "title": "SA 300 - Planning an Audit: Overall Audit Strategy vs Detailed Audit Plan & Preliminary Engagement Activities",
    "difficulty": "Moderate",
    "marks": 5,
    "icaiExamRef": "ICAI Study Material - Ch 3 / Nov 2021 Exam & May 2024 RTP (SA 300)",
    "question": "A newly qualified audit senior remarked that since the firm has already prepared an 'Overall Audit Strategy' outlining engagement scope and timelines, drafting a separate 'Detailed Audit Plan' is redundant administrative overhead. Furthermore, for an initial audit engagement, the team can omit preliminary engagement activities. Explain the interrelationship between the Audit Strategy and Audit Plan under SA 300, and state the mandatory preliminary engagement activities for initial audits.",
    "keyConcepts": [
      { "keyword": "SA 300 Planning an Audit of Financial Statements", "category": "Standard", "description": "Standard governing planning activities, overall strategy, and detailed audit plan." },
      { "keyword": "Overall Audit Strategy", "category": "Provision", "description": "Sets the scope, timing, and direction of the audit, and guides the development of the audit plan." },
      { "keyword": "Detailed Audit Plan", "category": "Provision", "description": "More detailed than strategy; covers NTE of risk assessment procedures and further audit procedures." },
      { "keyword": "Preliminary Engagement Activities for Initial Audits", "category": "Rule", "description": "Performing SA 220 client continuance and communicating with predecessor auditor under SA 300 / Code of Ethics." }
    ],
    "shortSuggestedAnswer": """| Dimension | Overall Audit Strategy (SA 300) | Detailed Audit Plan (SA 300) |
| :--- | :--- | :--- |
| **Focus & Purpose** | Sets the **scope, timing, and direction** of the audit; guides development of audit plan. | Translates strategy into operational execution; detailed instructions for team. |
| **Key Contents** | • Characteristics of engagement (FRF, reporting segments).<br>• Reporting objectives & communication timing.<br>• Significant factors directing team efforts.<br>• Resource deployment (who, when, where). | • Nature, Timing, and Extent (NTE) of **Risk Assessment Procedures (RAP u/s SA 315)**.<br>• NTE of **Further Audit Procedures (FAP u/s SA 330)** at assertion level.<br>• Other planned audit procedures required by SAs. |
| **Inter-relationship** | Strategy and Plan are **inter-dependent**; changes in strategy trigger changes in plan, and vice versa. | Cannot be omitted; detailed plan is mandatory. |

```
[SA 300 Audit Planning Framework]
          PRELIMINARY ENGAGEMENT ACTIVITIES
• Client continuance procedures (SA 220)
• Evaluating ethical requirements & independence (SQC 1)
• Establishing understanding of engagement terms (SA 210)
• Communication with predecessor auditor (Initial Audits)
                          │
                          ▼
              OVERALL AUDIT STRATEGY
  (Scope, Direction, Timing, Resource Allocation)
                          │
                          ▼
               DETAILED AUDIT PLAN
• Risk Assessment Procedures (RAP u/s SA 315)
• Further Audit Procedures (Tests of Controls & Substantive u/s SA 330)
• Other mandatory SA procedures
```

• **Preliminary Engagement Activities for Initial Audits**:
  1. Performing procedures regarding the acceptance of the client relationship and the specific audit engagement (SA 220).
  2. Evaluating compliance with ethical requirements, including independence (SQC 1).
  3. Establishing an understanding of the terms of engagement (SA 210).
  4. For an initial audit engagement, the auditor shall **communicate with the predecessor auditor** in compliance with relevant ethical requirements (Clause 8 of Part I of First Schedule to CA Act, 1949).""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on clearly differentiating Overall Audit Strategy from Detailed Audit Plan under SA 300 and listing mandatory preliminary engagement activities for initial audits.",
      "criticalMisses": [
        "Asserting that an audit plan can be dispensed with if strategy is prepared.",
        "Omitting communication with the predecessor auditor in an initial audit engagement."
      ],
      "suggestions": [
        "Remember: Strategy = High-level scope, direction, timing, and resources; Plan = Operational NTE of RAP and FAP."
      ]
    }
  },
  {
    "id": "aud_std_full_07",
    "subjectId": "Audit",
    "chapterName": "Audit Planning, Strategy and Execution",
    "title": "SA 600 - Principal Auditor vs Component Auditor: Division of Responsibility & Access to Working Papers",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 3 / May 2024 MTP S1 Q.2 (SA 600 & SA 230)",
    "question": "CA P is the Principal Auditor of Global Holdings Ltd., which has 12 domestic operating branches and subsidiaries audited by various component auditors. CA P demanded that all component auditors hand over their complete set of original audit working papers to him for re-examination, arguing that the principal auditor assumes 100% legal responsibility for the consolidated group opinion. One component auditor refused, citing ownership of working papers under SA 230 and SQC 1. Resolve this conflict in light of SA 600, SA 230, and the ICAI Code of Ethics.",
    "keyConcepts": [
      { "keyword": "SA 600 Using the Work of Another Auditor", "category": "Standard", "description": "Guidelines for principal auditor using the work of another auditor reporting on a component." },
      { "keyword": "Ownership of Working Papers (SA 230 / SQC 1)", "category": "Rule", "description": "Working papers are the property of the auditor who prepares them; component auditor has legal ownership." },
      { "keyword": "Division of Responsibility under SA 600", "category": "Provision", "description": "Principal auditor is entitled to rely on component auditor and does not assume vicarious liability." },
      { "keyword": "Other Matter Paragraph Disclosure (SA 706)", "category": "Provision", "description": "Principal auditor discloses division of responsibility stating assets/revenues audited by component auditors." }
    ],
    "shortSuggestedAnswer": """| Legal Parameter | Statutory Rule (SA 600, SA 230, SQC 1) | Application to Global Holdings Ltd. |
| :--- | :--- | :--- |
| **Ownership of Working Papers** | Working papers are the **property of the auditor** who created them (SA 230, SQC 1). No other auditor or client has a right to demand them. | The component auditor is **legally justified in refusing** to hand over original working papers to CA P. |
| **Principal Auditor's Access Right** | Principal auditor may require component auditor to answer questionnaires and provide summaries, but **cannot demand complete working papers**. | CA P can request written checklists, questionnaires, and significant audit findings summaries, but not workpaper files. |
| **Division of Responsibility** | Principal auditor **does not assume vicarious liability** for component auditors' work; entitled to rely on their professional competence. | CA P is not legally responsible for component auditor errors if proper SA 600 procedures were followed. |
| **Reporting Disclosure** | Mandated disclosure in **Other Matter Paragraph (SA 706)** stating division of responsibility and magnitude of components. | CA P must disclose the total assets, revenues, and net cash flows audited by other auditors in the audit report. |

```
[SA 600 Principal vs Component Auditor Inter-Relationship]
             Principal Auditor (Auditing Group Financials)
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
RIGHTS OF PRINCIPAL AUDITOR                       LIMITATIONS ON PRINCIPAL AUDITOR
• Advise component auditor of requirements       • CANNOT demand custody of workpapers
• Obtain written questionnaires & summaries      • Working papers remain property of
• Discuss significant audit findings               component auditor (SA 230 / SQC 1)
• Review component auditor's report              • Entitled to rely on component auditor
       │                                                       │
       └───────────────────────────┬───────────────────────────┘
                                   ▼
                 REPORTING: OTHER MATTER PARAGRAPH
      (Express clear division of responsibility under SA 706)
```

• **Statutory Principles under SA 600 & SA 230**:
  1. **Working Paper Property**: Under SA 230 and SQC 1, audit documentation is the exclusive property of the auditor. The principal auditor has no statutory right to inspect or seize the working papers of a component auditor.
  2. **Coordination Mechanism**: Under SA 600, the principal auditor may require the other auditor to answer a detailed questionnaire regarding audit procedures and obtain written representations.
  3. **No Joint Liability**: The principal auditor is not responsible for the work of the other auditor. When the principal auditor bases their opinion on the financial statements of components audited by other auditors, their report shall state clearly the division of responsibility by indicating the extent to which the financial information of components has been audited by others.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on affirming that working papers are the property of the component auditor under SA 230/SQC 1 and articulating the division of responsibility mechanism under SA 600 without vicarious liability.",
      "criticalMisses": [
        "Concluding that the principal auditor has the right to demand component auditor working papers.",
        "Failing to mention the mandatory Other Matter paragraph disclosure under SA 706."
      ],
      "suggestions": [
        "Cite the landmark Supreme Court / ICAI ruling confirming that an auditor cannot be compelled to share workpapers with another practitioner."
      ]
    }
  },
  {
    "id": "aud_std_full_08",
    "subjectId": "Audit",
    "chapterName": "Audit Planning, Strategy and Execution",
    "title": "SA 610 - Using the Work of Internal Auditors: Direct Assistance Restrictions & Objectivity Evaluation",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 3 / May 2024 MTP S2 Q.5 (SA 610)",
    "question": "During the statutory audit of Titan Steel Ltd., the external audit partner decided to utilize internal audit staff for 'Direct Assistance' in the following areas: (1) Physical verification of scrap inventory involving high valuation disputes; (2) Testing the design and operating effectiveness of automated IT general controls; (3) Evaluating complex actuarial assumptions for post-employment defined benefit gratuity plans. The internal audit head reports directly to the Chief Financial Officer (CFO). Examine the propriety of the external auditor's plan under SA 610 (Revised).",
    "keyConcepts": [
      { "keyword": "SA 610 (Revised) Using the Work of Internal Auditors", "category": "Standard", "description": "Guidelines for using internal audit work and using internal auditors for direct assistance." },
      { "keyword": "Evaluation of Internal Audit Function", "category": "Provision", "description": "Assessing organizational status (reporting line), objectivity, level of competence, and disciplined approach." },
      { "keyword": "Prohibited Areas for Direct Assistance", "category": "Rule", "description": "Prohibited for significant judgment areas, higher assessed risks of material misstatement, or fraud." },
      { "keyword": "Written Agreement from Entity and Internal Auditors", "category": "Rule", "description": "Mandatory written acknowledgment that internal auditors will follow instructions without intervention." }
    ],
    "shortSuggestedAnswer": """| Proposed Task for Direct Assistance | Statutory Evaluation under SA 610 (Revised) | Permissibility & Legality |
| :--- | :--- | :--- |
| **(1) Scrap Inventory with Valuation Dispute** | Involves **higher assessed risk of material misstatement** and significant judgment regarding net realizable value. | **PROHIBITED**: SA 610 explicitly prohibits direct assistance on matters with higher assessed RMM. |
| **(2) Testing Automated IT General Controls** | Routine testing of control operating effectiveness may be assigned if internal auditors possess technical IT competence. | **PERMISSIBLE**, provided internal auditors have specialized IT competence and work is supervised. |
| **(3) Actuarial Gratuity Assumptions** | Involves **significant professional judgment and estimates** (discount rates, mortality, salary escalation). | **PROHIBITED**: Direct assistance is prohibited for areas involving significant accounting judgments. |
| **Internal Audit Reporting Line to CFO** | Internal audit reports to CFO instead of Audit Committee, severely impairing organizational **objectivity**. | **DEFICIENT**: Lack of organizational independence restricts the overall extent of reliance. |

```
[SA 610 Direct Assistance Decision Protocol]
            Request for Direct Assistance from Internal Auditors
                                   │
                                   ▼
        Evaluate Organizational Objectivity & Competence
     (Reporting to CFO creates severe impairment to objectivity)
                                   │
                                   ▼
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
PERMISSIBLE ASSISTANCE                           STRICTLY PROHIBITED ASSISTANCE
• Routine compliance testing                     • Matters involving SIGNIFICANT JUDGMENT
• Tracing sample documentation                     (Actuarial assumptions, valuations)
• Testing lower-risk controls                    • Areas with HIGHER ASSESSED RMM (Fraud risks)
  (IT general controls)                          • Decisions auditor is required to make
                                                 • Work internal auditor was already involved in
```

• **Statutory Principles under SA 610 (Revised)**:
  1. **Objectivity Impairment**: If the internal audit function reports to the CFO rather than Those Charged with Governance, its objectivity is significantly compromised, limiting the external auditor's ability to use direct assistance.
  2. **Strictly Prohibited Areas**: Under paragraph 29 of SA 610, the external auditor shall NOT use internal auditors to provide direct assistance to perform procedures that:
     - Involve making significant judgments in the audit (Actuarial gratuity assumptions).
     - Relate to higher assessed risks of material misstatement where the judgment required in performing relevant audit procedures or evaluating evidence is more than limited (Scrap inventory valuation disputes).
  3. **Mandatory Documentation**: Prior to using direct assistance, the external auditor must obtain written agreement from the entity that internal auditors will be allowed to follow instructions and the entity will not intervene.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 610 prohibitions on direct assistance (higher RMM areas and significant judgments) and highlighting that reporting to the CFO impairs organizational objectivity.",
      "criticalMisses": [
        "Permitting direct assistance in actuarial gratuity estimates or disputed inventory valuations.",
        "Failing to critique the reporting line to the CFO under the objectivity criteria."
      ],
      "suggestions": [
        "Remember the 3 pillars of internal audit evaluation: (1) Objectivity (reporting line), (2) Competence, and (3) Systematic & Disciplined Approach."
      ]
    }
  },
  {
    "id": "aud_std_full_09",
    "subjectId": "Audit",
    "chapterName": "Materiality, Risk Assessment and Internal Control",
    "title": "SA 315 & SA 330 - Identifying and Assessing RMM: Automated Tools & Controls Testing",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 4 / May 2024 RTP Q.4 & SA 315 (Revised)",
    "question": "Fintech Pay Ltd. processes 15 million digital micro-transactions daily through an automated cloud transaction engine. The statutory auditor plans to omit tests of operating effectiveness of internal controls and rely exclusively on substantive analytical procedures at year-end, arguing that substantive testing provides higher assurance than control testing. Evaluate the auditor's planned audit approach in light of SA 315 (Revised) and SA 330.",
    "keyConcepts": [
      { "keyword": "SA 315 (Revised) Identifying and Assessing RMM", "category": "Standard", "description": "Understanding entity, environment, IT environment, and assessing risk of material misstatement." },
      { "keyword": "Risks for Which Substantive Procedures Alone Do Not Provide SAAE", "category": "Rule", "description": "Mandatory testing of controls when routine automated processing allows no manual intervention." },
      { "keyword": "SA 330 Responses to Assessed Risks", "category": "Standard", "description": "Designing and performing tests of controls and substantive procedures matching assessed risks." },
      { "keyword": "Automated IT Processing Environment", "category": "Provision", "description": "High volume, routine transactions where evidence exists only in electronic format require control testing." }
    ],
    "shortSuggestedAnswer": """| Audit Parameter | Auditor's Proposal | Statutory Rule (SA 315 / SA 330) | Evaluation & Legality |
| :--- | :--- | :--- | :--- |
| **Omission of Control Testing** | Omit tests of controls entirely; rely only on substantive analytical testing. | In high-volume, automated environments, substantive procedures alone **cannot provide SAAE**. | **STRICTLY DEFECTIVE / FLAWED**: Violates mandatory requirement of SA 315 and SA 330. |
| **Nature of Audit Evidence** | 15 million daily micro-transactions recorded electronically with minimal manual intervention. | The auditor **must perform tests of controls** over automated transaction logic and IT general controls. | Tests of operating effectiveness of automated controls and ITGC are **statutorily mandatory**. |

```
[SA 315 & SA 330 Audit Approach for Highly Automated Entities]
         Entity Environment: Highly Automated Cloud FinTech Engine
                   (15 Million Micro-Transactions Daily)
                                   │
                                   ▼
        Can SAAE be Obtained Through Substantive Testing Alone?
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
      YES                                                     NO
Substantive Approach Possible               MANDATORY TEST OF CONTROLS
(Manual / Low volume entities)              (SA 315.30 & SA 330.8)
                                            • Test Automated Application Controls
                                            • Test IT General Controls (ITGC)
                                            • Test System Interfaces & Integrity
                                                       │
                                                       ▼
                                            Substantive Procedures Alone
                                            Are INSUFFICIENT to Provide SAAE
```

• **Statutory Principles under SA 315 & SA 330**:
  1. **Risks Requiring Tests of Controls**: Under SA 315, in respect of some risks, the auditor may judge that it is **not possible or practicable to obtain SAAE only from substantive procedures**. Such risks may relate to the inaccurate or incomplete recording of routine and significant classes of transactions, where the characteristics of the business involve highly automated processing with little or no manual intervention.
  2. **Mandatory Control Testing under SA 330**: When the auditor has determined that an assessed risk of material misstatement at the assertion level is a risk for which substantive procedures alone do not provide sufficient appropriate audit evidence, the auditor **shall perform tests of relevant controls** over that risk.
  3. **Conclusion**: The auditor's proposal to omit control testing violates SA 315 and SA 330 and represents professional negligence.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on applying SA 315 paragraph 30 and SA 330 paragraph 8: mandatory testing of controls when substantive procedures alone cannot provide SAAE in highly automated environments.",
      "criticalMisses": [
        "Agreeing with the auditor's plan to rely solely on substantive procedures for 15 million automated transactions.",
        "Failing to cite SA 315/330 provisions on automated IT processing risks."
      ],
      "suggestions": [
        "Explicitly state that where records exist only in electronic form without audit trails, control testing is not optional—it is mandatory."
      ]
    }
  },
  {
    "id": "aud_std_full_10",
    "subjectId": "Audit",
    "chapterName": "Materiality, Risk Assessment and Internal Control",
    "title": "SA 320 & SA 450 - Determining Materiality, Performance Materiality, and Evaluating Accumulated Misstatements",
    "difficulty": "Advanced",
    "marks": 6,
    "icaiExamRef": "ICAI Study Material - Ch 4 / May 2023 Exam & Nov 2023 RTP (SA 320/450)",
    "question": "During the statutory audit of Apex Retail Ltd. for FY 2022-23 (Profit Before Tax: ₹50 crores), overall materiality was determined at ₹2.5 crores (5% of PBT) and performance materiality at ₹1.5 crores. The audit team accumulated three uncorrected misstatements: (1) Overstatement of sales rebates by ₹90 lakhs; (2) Understatement of depreciation due to wrong useful life by ₹80 lakhs; (3) Capitalization of routine repair expenses of ₹95 lakhs. Management argues that because none of the individual misstatements exceed performance materiality (₹1.5 Cr) or overall materiality (₹2.5 Cr), no adjustment or reporting is required. Evaluate management's contention under SA 320 and SA 450.",
    "keyConcepts": [
      { "keyword": "SA 320 Materiality in Planning and Performing an Audit", "category": "Standard", "description": "Determining materiality for financial statements as a whole and performance materiality." },
      { "keyword": "Performance Materiality Purpose", "category": "Provision", "description": "Set to reduce to an appropriately low level the probability that aggregate uncorrected misstatements exceed materiality." },
      { "keyword": "SA 450 Evaluation of Misstatements Identified", "category": "Standard", "description": "Accumulating misstatements and evaluating aggregate impact on financial statements." },
      { "keyword": "Aggregate Impact Evaluation", "category": "Rule", "description": "Auditor must evaluate misstatements individually AND in the aggregate against overall materiality." }
    ],
    "shortSuggestedAnswer": """| Identified Uncorrected Misstatement | Amount | Individual < Overall Materiality (₹2.5 Cr)? | Cumulative PBT Impact |
| :--- | :--- | :--- | :--- |
| **(1) Overstatement of Sales Rebates** | ₹90 Lakhs | Yes (Below ₹2.5 Cr) | Overstates Profit by ₹90 Lakhs |
| **(2) Understatement of Depreciation** | ₹80 Lakhs | Yes (Below ₹2.5 Cr) | Overstates Profit by ₹80 Lakhs |
| **(3) Improper Capitalization of Repairs** | ₹95 Lakhs | Yes (Below ₹2.5 Cr) | Overstates Profit by ₹95 Lakhs |
| **AGGREGATE UNCORRECTED MISSTATEMENT** | **₹2.65 CRORES** | **EXCEEDS Overall Materiality (₹2.50 Cr)** | **PBT artificially inflated by ₹2.65 Cr (5.3%)** |

```
[SA 320 & SA 450 Misstatement Evaluation Framework]
         Accumulate All Misstatements (Other than Clearly Trivial)
                                   │
                                   ▼
          Test Individually: Are Any Singly Material?
        (Misstatement 1: ₹90L, Misstatement 2: ₹80L, Misstatement 3: ₹95L)
                                   │
                                  NO
                                   │
                                   ▼
        AGGREGATE ALL MISSTATEMENTS: Total = ₹2.65 Crores
                                   │
                                   ▼
         Compare Aggregate against Overall Materiality (₹2.50 Cr)
                                   │
                                   ▼
        AGGREGATE (₹2.65 Cr) > OVERALL MATERIALITY (₹2.50 Cr)
                                   │
                                   ▼
              FINANCIAL STATEMENTS ARE MATERIALLY MISSTATED
     • Request Management & TCWG to correct all misstatements
     • If refused: ISSUE QUALIFIED OR ADVERSE OPINION (SA 705)
```

• **Statutory Principles under SA 320 & SA 450**:
  1. **Fallacy of Management's Argument**:
     - Management wrongly looked only at individual amounts.
     - Under SA 450, the auditor shall determine whether uncorrected misstatements are material, **individually or in aggregate**.
  2. **Aggregate Materiality Breach**:
     - The aggregate uncorrected misstatement is **₹2.65 crores** (₹0.90 Cr + ₹0.80 Cr + ₹0.95 Cr), which **exceeds the overall materiality threshold of ₹2.50 crores**.
     - All three misstatements bias the profit in the same direction (overstating earnings).
  3. **Auditor's Action**:
     - The auditor must request management and TCWG to correct the misstatements.
     - If management refuses to adjust the accounts, the auditor **must modify the audit opinion (Qualified or Adverse)** under SA 705.""",
    "defaultRemarks": {
      "efficiencyReasoning": "Assessed on aggregating uncorrected misstatements (₹2.65 Cr) and comparing against overall materiality (₹2.5 Cr) under SA 450, refuting management's individual-only test.",
      "criticalMisses": [
        "Accepting management's argument that individual items below performance materiality need no adjustment.",
        "Failing to calculate the cumulative aggregate of ₹2.65 Cr exceeding ₹2.5 Cr."
      ],
      "suggestions": [
        "Explain that performance materiality is designed precisely to provide a buffer for this aggregation risk."
      ]
    }
  }
]

with open('src/data/auditStandardsFullQuestions.ts', 'w') as f:
    f.write('''/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STANDARDS ON AUDITING MASTER COMPENDIUM (CHAPTERS 1-6)
 * SAs 200 to 620, SQC 1, Risk Assessment, and Materiality
 * Adheres strictly to CA Final Educator rules with zero duplicates.
 */

import { TheoryQuestion } from './theoryAuditorQuestions';

export const AUDIT_STANDARDS_FULL_QUESTIONS: TheoryQuestion[] = ''')
    f.write(json.dumps(questions, indent=2))
    f.write(';\n')

print(f"Generated auditStandardsFullQuestions.ts with {len(questions)} high-yield questions!")
