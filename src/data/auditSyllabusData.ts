import { ChapterSummary, StatutorySection, LimitRateItem } from '../types';

export const AUDIT_CHAPTER_SUMMARIES: ChapterSummary[] = [
  {
    chapterName: 'Quality Control',
    keyPrinciples: [
      {
        title: 'SQC 1 — Quality Control for Audit Firms',
        description: '• Applies to the entire firm and across all engagement types: audits, reviews of historical financial information, and other assurance and related services engagements.\n• Ultimate responsibility for the system of quality control is assumed by the firm’s CEO or Managing Partner.\n• Establishes six mandatory elements: (1) Leadership responsibilities for quality, (2) Ethical requirements, (3) Acceptance and continuance of client relationships, (4) Human resources, (5) Engagement performance, and (6) Monitoring.\n• Mandates Engagement Quality Control Review (EQCR) for all audits of financial statements of listed entities.',
        exception: 'SQC 1 is a sine qua non for SA 220; it sets firm-wide policies whereas SA 220 applies specifically to individual audit engagements.',
        example: 'A CA firm institutes annual written independence declarations from all partners and staff before assigning them to listed entity audits.'
      },
      {
        title: 'SA 220 — Quality Control for an Audit of Financial Statements',
        description: '• Focuses on the responsibilities of the Engagement Partner (EP) for quality control procedures on specific audit engagements.\n• The EP shall take responsibility for overall quality, ensure compliance with professional standards and regulatory requirements, and issue an appropriate audit report.\n• For listed entities, the EP must: (1) Ensure an EQCR reviewer has been appointed, (2) Discuss significant matters with the EQCR reviewer, and (3) Never date the auditor’s report until completion of the EQCR review.\n• Mandatory documentation: compliance with ethical & independence requirements, conclusions on client continuance, and consultation details.',
        exception: 'The auditor’s report cannot be dated before the completion of the Engagement Quality Control Review.',
        example: 'The engagement partner consults the firm’s national technical desk regarding complex revenue recognition under Ind AS 115 and documents the agreed treatment.'
      },
      {
        title: 'Peer Review Board (PRB) vs Quality Review Board (QRB) vs NFRA',
        description: '• Peer Review Board (PRB): Constituted by the Council of ICAI; reviews whether members in practice comply with technical, professional, and ethical standards and maintain proper documentation systems.\n• Quality Review Board (QRB): Set up by the Central Government u/s 28A of CA Act; makes recommendations to ICAI Council on service quality, reviews audit quality of entities not governed by NFRA, and guides members on adherence to statutory standards.\n• National Financial Reporting Authority (NFRA): Constituted u/s 132(1) of Companies Act, 2013; monitors and enforces compliance with accounting and auditing standards, and oversees quality of service for listed companies and large public unlisted entities.',
        exception: 'NFRA has exclusive statutory jurisdiction over listed entities and large unlisted public companies exceeding specified thresholds, superseding ICAI disciplinary mechanisms for those entities.',
        example: 'Statutory audit files of a listed enterprise are inspected directly by NFRA under Section 132(4).'
      }
    ],
    visualBreakdown: {
      title: 'SQC 1 vs SA 220 Regulatory Comparison',
      type: 'table',
      headers: ['Parameter', 'SQC 1', 'SA 220'],
      rows: [
        ['Scope & Level', 'Entire firm as a whole', 'Individual audit engagement'],
        ['Applicability', 'Audits, reviews, assurance & related services', 'Audit of financial statements only'],
        ['Ultimate Responsibility', 'Firm CEO / Managing Partners', 'Engagement Partner (EP)'],
        ['Inter-relationship', 'Firm-wide system of quality control (Sine qua non)', 'Implements quality control within firm’s SQC 1 framework']
      ]
    }
  },
  {
    chapterName: 'General Auditing Principles and Auditors Responsibilities',
    keyPrinciples: [
      {
        title: 'SA 200 & SA 210 — Overall Objectives & Terms of Audit Engagements',
        description: '• SA 200 mandates obtaining reasonable assurance (high, but not absolute assurance) that financial statements as a whole are free from material misstatement, enabling expression of an opinion.\n• Requires maintenance of professional skepticism, exercise of professional judgment, and compliance with all relevant SAs.\n• SA 210 establishes preconditions for audit: (1) Acceptable financial reporting framework (FRF), and (2) Agreement of management acknowledging responsibility for preparation of FS, internal controls, and unrestricted access to records and personnel.\n• If management imposes a scope limitation before acceptance such that the auditor would disclaim an opinion, the auditor shall NOT accept such engagement unless required by law.',
        exception: 'If preconditions for an audit are absent, the auditor shall not accept the proposed audit engagement unless mandated by statute.',
        example: 'Management refuses to grant access to board minutes; auditor declines the engagement citing failure of preconditions u/s SA 210.'
      },
      {
        title: 'SA 230 — Audit Documentation (Workpapers & Retention)',
        description: '• The auditor shall prepare documentation sufficient to enable an "experienced auditor" having no previous connection with the audit to understand the nature, timing, extent of procedures, evidence obtained, and significant matters/judgments.\n• Assembly of final audit file must be completed on a timely basis (ordinarily not more than 60 days after the date of the auditor’s report under SQC 1).\n• Mandatory retention period: Not less than 7 years from the date of the auditor’s report (or group auditor’s report).\n• After assembly, the auditor shall not delete or discard audit documentation of any nature before the expiry of the retention period.',
        exception: 'If modifications or additions are made after assembly, the auditor must document specific reasons and when/by whom they were made and reviewed.',
        example: 'Workpaper contains identifying sample transaction IDs, testing logs, preparer signature date, and partner sign-off date.'
      },
      {
        title: 'SA 240, SA 250 & SA 260 — Fraud, Laws & Governance Communication',
        description: '• SA 240: Presumption of fraud risk in revenue recognition is mandatory; requires testing of journal entries, reviewing accounting estimates for management bias, and incorporating an element of unpredictability in audit procedures.\n• SA 250: Distinguishes between direct-effect laws (tax, labor laws affecting amounts) and indirect-effect fundamental operating laws (licenses, environmental compliance).\n• SA 260: Mandates timely communication with Those Charged with Governance (TCWG) regarding auditor responsibilities, planned scope & timing, significant risks, qualitative accounting aspects, and written independence confirmations for listed entities.\n• SA 402: Governs entities using service organizations; requires obtaining Type 1 (design) or Type 2 (design & operating effectiveness) reports.',
        exception: 'Under SA 402, the user auditor shall not refer to the work of the service auditor in an unmodified audit report.',
        example: 'Auditor incorporates unpredictable testing by inspecting petty cash balances at remote branch depots without prior notice.'
      }
    ],
    visualBreakdown: {
      title: 'Audit Documentation & Reporting Guidelines',
      type: 'table',
      headers: ['Standard', 'Core Subject', 'Key Threshold / Requirement', 'Reporting Impact'],
      rows: [
        ['SA 210', 'Audit Engagement Terms', 'Preconditions verification before acceptance', 'Decline engagement if preconditions not met'],
        ['SA 230', 'Audit File Assembly', 'Assemble within 60 days; retain for minimum 7 years', 'No deletion or discarding allowed post-assembly'],
        ['SA 240', 'Fraud Responsibilities', 'Rebuttable presumption of fraud in revenue recognition', 'Evaluate impact on report & report u/s 143(12) if ≥ ₹1 Cr'],
        ['SA 250', 'Laws & Regulations', 'Direct effect vs Fundamental operating laws', 'Qualified/Adverse if material non-compliance not disclosed'],
        ['SA 402', 'Service Organisations', 'Type 1 (Design) vs Type 2 (Design + Operating effectiveness)', 'No reference to service auditor in unmodified report']
      ]
    }
  },
  {
    chapterName: 'Audit Planning, Strategy and Execution',
    keyPrinciples: [
      {
        title: 'SA 300 & Overall Audit Strategy',
        description: '• Planning is a continuous process that establishes the scope, timing, and direction of the audit and guides the development of the audit plan.\n• Overall Audit Strategy sets: (1) Characteristics of the engagement, (2) Reporting objectives and timing, (3) Significant factors directing team efforts, (4) Results of preliminary activities, and (5) Nature, timing, and extent (NTE) of resources.\n• Audit Plan is more detailed than Strategy and includes NTE of planned Risk Assessment Procedures (RAP u/s SA 315) and Further Audit Procedures (FAP u/s SA 330).\n• Strategy and Plan are interrelated; change in one triggers modification in the other.',
        exception: 'In initial audit engagements, SA 300 requires performing SA 220 procedures and communication with the predecessor auditor prior to commencing audit work.',
        example: 'Auditor decides to deploy senior forensic specialists to inventory testing after preliminary analytical review indicates unusual gross margin variations.'
      },
      {
        title: 'SA 600, SA 610 & SA 620 — Using the Work of Others',
        description: '• SA 600 (Using Work of Another Auditor): Principal Auditor (PA) reporting on entity financial statements may use component auditor work; must advise component auditor on coordination, review written summary of procedures, and clearly disclose division of responsibility in audit report.\n• SA 610 (Using Work of Internal Auditors): External Auditor (EA) evaluates internal audit function’s: (1) Objectivity, (2) Level of competence, and (3) Systematic & disciplined approach. EA shall NOT use internal auditors for direct assistance on matters involving significant judgment or higher assessed risks of material misstatement.\n• SA 620 (Using Work of Auditor’s Expert): Auditor has sole responsibility for the audit opinion expressed. Auditor shall evaluate expert’s competence, capabilities, objectivity, and adequacy of work. Unmodified reports shall NOT refer to the expert’s work.',
        exception: 'Direct assistance from internal auditors is prohibited for significant judgment areas, high assessed fraud risks, or decisions the external auditor makes under SAs.',
        example: 'The principal auditor includes an Other Matter paragraph under SA 706 stating total assets and revenue audited by component auditors.'
      },
      {
        title: 'SA 540, SA 520 & SA 450 — Estimates, Analytics & Misstatements',
        description: '• SA 540 (Accounting Estimates & Fair Values): Auditor evaluates degree of estimation uncertainty, tests management’s method and assumptions, develops an auditor’s point estimate or range, and reviews estimates for management bias.\n• SA 520 (Analytical Procedures): Used as substantive procedures and near the end of the audit when forming an overall conclusion on financial statements.\n• SA 450 (Evaluation of Misstatements): Auditor accumulates all misstatements other than clearly trivial amounts; requests management to correct them; evaluates whether uncorrected misstatements are material individually or in aggregate.',
        exception: 'Clearly trivial misstatements are not accumulated; however, triviality is not another word for "immaterial" and must be of a wholly different (negligible) order of magnitude.',
        example: 'Auditor creates an independent range for expected warranty provisions based on historical claim rates to evaluate management’s point estimate.'
      }
    ],
    visualBreakdown: {
      title: 'Using Work of Others — Standards Comparison',
      type: 'table',
      headers: ['Standard', 'Role / Specialist', 'Key Evaluation Criteria', 'Report Reference Rule'],
      rows: [
        ['SA 600', 'Component Auditor', 'Materiality of component, competence, coordination', 'Disclose division of responsibility in report'],
        ['SA 610', 'Internal Audit Function', 'Objectivity, technical competence, disciplined approach', 'No direct assistance in high judgment/high risk areas'],
        ['SA 620', 'Auditor’s Expert', 'Competence, capability, objectivity, adequacy of work', 'No reference in unmodified report; reference permitted in modified report']
      ]
    }
  },
  {
    chapterName: 'Materiality, Risk Assessment and Internal Control',
    keyPrinciples: [
      {
        title: 'Audit Risk Model & SA 315 Risk Assessment',
        description: '• Audit Risk = Risk of Material Misstatement (RMM) × Detection Risk.\n• RMM exists at two levels: (1) Financial Statement Level, and (2) Assertion Level (comprising Inherent Risk and Control Risk).\n• Inherent Risk: Susceptibility of an assertion to misstatement before considering controls.\n• Control Risk: Risk that a misstatement will not be prevented, or detected and corrected on a timely basis by internal controls.\n• Detection Risk: Risk that auditor’s procedures will not detect a misstatement; controlled by adjusting NTE of substantive procedures.',
        exception: 'Detection risk can only be reduced to an acceptably low level; it can never be reduced to zero due to inherent limitations of auditing.',
        example: 'Auditor discovers weak controls over warehouse dispatches, elevates control risk to maximum, and increases substantive sample size.'
      },
      {
        title: 'SA 320 & SA 330 — Materiality & Auditor’s Responses to Assessed Risks',
        description: '• SA 320: Auditor determines Overall Materiality for FS as a whole (often applying a percentage to a chosen benchmark like PBT, Revenue, or Total Assets).\n• Performance Materiality: Amount set below overall materiality to reduce probability that aggregate uncorrected & undetected misstatements exceed overall materiality.\n• SA 330: Auditor designs overall responses at FS level (e.g., assigning experienced staff, unpredictability) and Further Audit Procedures at assertion level (Tests of Controls and Substantive Procedures).\n• Test of Controls is mandatory when: (1) Auditor expects controls to operate effectively, or (2) Substantive procedures alone cannot provide sufficient appropriate audit evidence.',
        exception: 'Irrespective of assessed RMM, the auditor must always perform substantive procedures for each material class of transactions, account balance, and disclosure.',
        example: 'Overall materiality fixed at ₹2 Crores (5% of PBT); performance materiality fixed at ₹1.5 Crores (75% of overall materiality).'
      },
      {
        title: 'Internal Control Frameworks: COSO, CoCo, COBIT, Turnbull & SOX 404',
        description: '• COSO 1992 Framework: 5 Core Components (Control Environment, Risk Assessment, Control Activities, Information & Communication, Monitoring) covering 17 Principles across 3 Objectives (Operations, Reporting, Compliance).\n• CoCo (Canada): Criteria for effective control based on Purpose, Commitment, Capability, and Monitoring & Learning.\n• COBIT (ISACA): IT governance framework covering 34 high-level processes and 210 control objectives across 4 domains.\n• Turnbull Report (ICAEW): Guidance for directors to conduct at least annual review of group internal control effectiveness.\n• Sarbanes-Oxley Section 404: Mandates management to establish, test, and document internal controls over financial reporting (ICFR), regulated by PCAOB.\n• SA 265: Requires written communication of significant internal control deficiencies to TCWG and management on a timely basis.',
        exception: 'Under SA 265, communicating internal control deficiencies is not an opinion on the adequacy of the system as a whole, but a report on matters observed during the audit.',
        example: 'Auditor issues a formal Letter of Weakness (Management Letter) detailing lack of dual authorization for electronic wire transfers.'
      }
    ],
    visualBreakdown: {
      title: 'COSO 5 Components & 17 Principles Architecture',
      type: 'table',
      headers: ['Component', 'Core Focus', 'Number of Principles'],
      rows: [
        ['Control Environment', 'Tone at top, integrity, ethical values, board oversight, HR policies', '5 Principles (1 to 5)'],
        ['Risk Assessment', 'Specifying suitable objectives, identifying & analyzing risks, fraud assessment', '4 Principles (6 to 9)'],
        ['Control Activities', 'Selecting control activities, general IT controls, deployment via policies', '3 Principles (10 to 12)'],
        ['Information & Communication', 'Using relevant quality information, internal & external communications', '3 Principles (13 to 15)'],
        ['Monitoring Activities', 'Ongoing & separate evaluations, communicating control deficiencies', '2 Principles (16 to 17)']
      ]
    }
  },
  {
    chapterName: 'Audit Evidence',
    keyPrinciples: [
      {
        title: 'SA 500 & SA 501 — Audit Evidence & Specific Considerations',
        description: '• SA 500: Auditor must obtain Sufficient Appropriate Audit Evidence (SAAE) to draw reasonable conclusions. Sufficiency measures quantity; Appropriateness measures quality (relevance and reliability).\n• SA 501 Specific Items: (1) Inventory: Physical counting attendance is mandatory when material; involves inspecting condition, test counting, and testing cutoff. (2) Litigation & Claims: Inquire management, review legal expense ledgers, examine minutes; request direct communication with external legal counsel. (3) Segment Information: Evaluate methods and analytical procedures.',
        exception: 'If attendance at physical inventory counting is impracticable due to unforeseen circumstances, the auditor shall perform alternative procedures; if impossible, modify opinion under SA 705.',
        example: 'Physical inventory held at third-party premises: auditor requests direct confirmation under SA 501 or inspects warehouse receipts.'
      },
      {
        title: 'SA 505 — External Confirmations (Positive vs Negative)',
        description: '• Direct written response obtained by the auditor from a third party in paper, electronic, or other medium.\n• Positive Confirmation: Requesting confirming party to reply directly whether they agree or disagree with the stated balance.\n• Negative Confirmation: Requesting confirming party to reply ONLY if they disagree.\n• Negative confirmation can be used as sole substantive procedure ONLY if: (1) Assessed RMM is low and controls are effective, (2) Population comprises large number of small, homogeneous balances, (3) Very low exception rate is expected, and (4) Auditor is unaware of circumstances causing recipients to disregard requests.\n• If management refuses to allow confirmation: Inquire reasons, evaluate fraud risk, perform alternative procedures; if refusal unreasonable, communicate with TCWG and consider report modification.',
        exception: 'Negative confirmation provides less persuasive audit evidence than positive confirmation and cannot be used alone if any of the four strict conditions fail.',
        example: 'Trade receivables of retail bank audited using negative confirmations for small savings account holders meeting all 4 criteria.'
      },
      {
        title: 'SA 510, SA 530 & SA 550 — Opening Balances, Sampling & Related Parties',
        description: '• SA 510 (Initial Engagements): Verify whether prior period closing balances are correctly brought forward, reflect consistent accounting policies, and examine predecessor auditor report.\n• SA 530 (Audit Sampling): Determine sample size to reduce sampling risk to acceptably low level; ensure each sampling unit has a chance of selection. Project misstatements found in sample to the entire population in tests of details.\n• SA 550 (Related Parties): Understand RP relationships; inspect bank/legal confirmations, minutes of shareholders/TCWG; remain alert for undisclosed RP transactions. For significant transactions outside normal course: inspect contracts, evaluate business rationale, and verify authorization.',
        exception: 'An anomaly can be excluded from error projection only when the auditor obtains a high degree of certainty that the misstatement is not representative of the population.',
        example: 'Auditor identifies unlisted transaction with managing director’s brother-in-law entity, evaluates approval under Section 188 of Companies Act, 2013.'
      }
    ],
    visualBreakdown: {
      title: 'Confirmation Types & Decision Criteria',
      type: 'table',
      headers: ['Confirmation Type', 'Response Required', 'Reliability Level', 'Mandatory Pre-requisites for Sole Reliance'],
      rows: [
        ['Positive Confirmation', 'Must reply in all cases (agree or disagree)', 'High persuasive value', 'Standard procedure for trade debtors/creditors'],
        ['Negative Confirmation', 'Reply ONLY if disagreeing with balance', 'Moderate / Limited', 'Low RMM, small homogeneous items, low exception rate, no disregard expectation'],
        ['Non-Response to Positive', 'Follow up; perform alternative audit procedures', 'Unresolved until verified', 'Examine subsequent collections, shipping notes, cash book']
      ]
    }
  },
  {
    chapterName: 'Completion and Review',
    keyPrinciples: [
      {
        title: 'SA 560 — Subsequent Events (Three Time Horizons)',
        description: '• Horizon 1 (Between FS date and Auditor’s Report date): Auditor has active duty to perform procedures (read interim FS, read minutes, inquire management) to identify adjusting vs non-adjusting events.\n• Horizon 2 (Facts known after Report date but before FS issued): Auditor has no obligation to perform active procedures, but if informed of a fact that would have altered the report, must discuss with management, determine amendment need, and issue amended report with dual dating or EOM paragraph.\n• Horizon 3 (Facts known after FS issued): Discuss with management; if management amends FS, auditor carries out procedures on amendment and issues new report; if management refuses to take steps, auditor seeks legal advice to prevent reliance.',
        exception: 'If management refuses to amend FS in Horizon 2 after the report is released, the auditor notifies management and TCWG not to issue the FS to third parties.',
        example: 'Major customer declared insolvent 2 weeks after balance sheet date: qualifies as an adjusting event requiring bad debt provision under Ind AS 10.'
      },
      {
        title: 'SA 570 (Revised) — Going Concern Assessment & Reporting',
        description: '• Management is responsible for assessing entity’s ability to continue as a going concern (covering at least 12 months from FS date).\n• Auditor evaluates indicators: Financial (net liability, default in loans, dividend arrears), Operating (loss of key management, labor strikes, loss of major market), Other (statutory non-compliance, catastrophic uninsured damage).\n• Reporting Matrix:\n  - Going concern appropriate & no material uncertainty: Unmodified report.\n  - Going concern appropriate but material uncertainty exists AND adequately disclosed: Unmodified opinion with separate section "Material Uncertainty Related to Going Concern".\n  - Material uncertainty exists but NOT adequately disclosed: Qualified or Adverse opinion.\n  - Use of going concern basis is inappropriate: Adverse opinion.',
        exception: 'Adequate disclosure of material uncertainty about going concern does NOT lead to a modified opinion; it is reported under the dedicated "Material Uncertainty Related to Going Concern" section.',
        example: 'Company in debt restructuring discloses debt maturity risks; auditor includes Material Uncertainty Related to Going Concern paragraph without qualifying opinion.'
      },
      {
        title: 'SA 580 — Written Representations (Mandatory Requirements)',
        description: '• Written statement by management provided to auditor to confirm certain matters or support other audit evidence (does not include financial statements or records).\n• Mandatory representations: (1) Fulfillment of responsibility for preparation of FS in accordance with FRF, (2) Completeness of all information provided and access granted, and (3) Recording of all transactions.\n• Date of written representation shall be as near as practicable to, but NOT after, the date of the auditor’s report.\n• Evidential weight: Written representations do not provide sufficient appropriate audit evidence on their own.',
        exception: 'If management refuses to provide mandatory representations on preparation of FS and information access, the auditor must disclaim an opinion under SA 705.',
        example: 'Auditor secures written representation on March 31, 2026, confirming all unrecorded liabilities and pending litigations have been disclosed.'
      }
    ],
    visualBreakdown: {
      title: 'SA 570 Going Concern Reporting Decision Matrix',
      type: 'table',
      headers: ['Going Concern Assumption', 'Material Uncertainty Exists?', 'Disclosed in Notes?', 'Auditor Opinion & Report Section'],
      rows: [
        ['Appropriate', 'No', 'N/A', 'Unmodified Opinion (Standard Report)'],
        ['Appropriate', 'Yes', 'Yes (Adequate)', 'Unmodified Opinion + "Material Uncertainty Related to Going Concern" Section'],
        ['Appropriate', 'Yes', 'No (Inadequate)', 'Qualified or Adverse Opinion (SA 705) + Basis for Modification'],
        ['Inappropriate', 'Yes / Definite Failure', 'Management used GC', 'Adverse Opinion (Mandatory under SA 570)']
      ]
    }
  },
  {
    chapterName: 'Reporting',
    keyPrinciples: [
      {
        title: 'SA 700, SA 701, SA 705 & SA 706 — Audit Reporting Architecture',
        description: '• SA 700 (Revised): Defines standard report format: Title, Addressee, Opinion, Basis for Opinion, Going Concern, KAM, Other Information, Responsibilities of Management, Auditor Responsibilities, Signature, Place, Date.\n• SA 701 (Key Audit Matters): Mandatory for listed entities; covers matters of most significance requiring significant auditor attention (high RMM, significant estimates, major transactions). Communicating KAM is never a substitute for modified opinion or going concern reporting.\n• SA 705 (Modifications): Qualified Opinion (material but not pervasive), Adverse Opinion (material and pervasive misstatement), Disclaimer of Opinion (material and pervasive inability to obtain evidence).\n• SA 706 (EOM & OM): Emphasis of Matter draws attention to matter presented in FS fundamental to user understanding; Other Matter refers to matters outside FS relevant to user understanding.',
        exception: 'SA 705 prohibits communicating Key Audit Matters under SA 701 when the auditor disclaims an opinion on the financial statements.',
        example: 'Auditor emphasizes pending High Court outcome regarding environmental fine via an Emphasis of Matter paragraph under SA 706.'
      },
      {
        title: 'Companies Act, 2013 — Section 143(1), 143(3) & 143(12) Fraud Reporting',
        description: '• Section 143(1) Duty of Inquiry: (a) Loans & advances properly secured and terms not prejudicial, (b) Book entry transactions not prejudicial, (c) Shares/debentures sold at price less than purchase price, (d) Loans shown as deposits, (e) Personal expenses charged to revenue.\n• Section 143(3) Statutory Reporting: (a) Info/explanations obtained, (b) Books in agreement, (c) Compliance with AS, (d) Adverse observations, (e) Director disqualification u/s 164(2), (f) Internal Financial Controls (IFC) adequacy & operating effectiveness.\n• Section 143(12) & Rule 13: Fraud involving ≥ ₹1 Crore committed by officers/employees must be reported to Central Government: (1) Report to Board/Audit Committee within 2 days, (2) Seek reply within 45 days, (3) Forward Report + Reply + Comments to CG within 15 days in Form ADT-4.\n• Fraud < ₹1 Crore: Report to Audit Committee/Board within 2 days; details disclosed in Board’s Report.',
        exception: 'Reporting on Internal Financial Controls (IFC) u/s 143(3)(i) is exempt for One Person Companies, Small Companies, and Private Companies with turnover < ₹50 Cr and aggregate borrowings < ₹25 Cr.',
        example: 'Auditor detects ₹1.8 Crore procurement embezzlement by Chief Operating Officer; sends intimation to Audit Committee within 2 days and files Form ADT-4 to MCA.'
      },
      {
        title: 'CARO 2020 — Applicability & Key Reporting Clauses',
        description: '• Applicability: Applies to all companies including foreign companies, EXCEPT: (1) Banking companies, (2) Insurance companies, (3) Section 8 companies, (4) One Person Companies & Small Companies, and (5) Eligible Private Companies (Paid up capital + Reserves ≤ ₹1 Cr, Borrowings ≤ ₹1 Cr at any point, and Revenue ≤ ₹10 Cr).\n• Key Clauses:\n  - (i) PPE & Intangibles: Full records, physical verification, title deeds held in company name, revaluation by Registered Valuer, Benami proceedings.\n  - (ii) Inventory: Physical verification (discrepancy ≥ 10% in aggregate for each class), working capital limits > ₹5 Cr sanctioned on current assets agreement with books.\n  - (iii) Loans/Investments: Terms not prejudicial, regular recovery, overdue > 90 days, renewal of overdue loans, loans repayable on demand.\n  - (v) Public Deposits: Compliance with Sections 73-76 & RBI directives.\n  - (vii) Statutory Dues: Undisputed arrears > 6 months from due date; disputed dues with forum.\n  - (xi) Fraud: Fraud noticed/reported, Form ADT-4 filed, whistle-blower complaints considered.\n  - (xvii) Cash Losses: Incurred cash losses in current FY and immediately preceding FY.\n  - (xix) Material Uncertainty on Liability Realization: Opinion whether company can meet liabilities due within 1 year of balance sheet date.',
        exception: 'CARO 2020 does not apply to Consolidated Financial Statements (CFS), EXCEPT Clause (xxi) requiring details of qualifications/adverse remarks in component CARO reports.',
        example: 'Private company with paid up capital ₹80 Lakhs, borrowings ₹50 Lakhs, but turnover ₹12 Crores is subject to CARO 2020 because turnover exceeds ₹10 Crores.'
      }
    ],
    visualBreakdown: {
      title: 'CARO 2020 Key High-Yield Clauses Summary',
      type: 'table',
      headers: ['Clause', 'Subject Matter', 'Core Numerical Threshold / Test'],
      rows: [
        ['Clause (i)(d)', 'Revaluation of PPE / Intangibles', 'Revaluation based on Registered Valuer; specify change ≥ 10%'],
        ['Clause (ii)(a)', 'Inventory Physical Verification', 'Material discrepancy of 10% or more in aggregate for each class'],
        ['Clause (ii)(b)', 'Working Capital Bank Sanctions', 'Sanctioned limits in excess of ₹5 Crores on security of current assets'],
        ['Clause (iii)(d)', 'Overdue Loans Granted', 'Total amount overdue for more than 90 days and recovery steps taken'],
        ['Clause (vii)(a)', 'Undisputed Statutory Dues', 'Arrears outstanding for more than 6 months as on balance sheet date'],
        ['Clause (xi)(b)', 'Fraud Report to MCA', 'Filing of Form ADT-4 under Section 143(12) with Central Government'],
        ['Clause (xvii)', 'Cash Losses', 'Cash losses incurred in current FY and immediately preceding FY'],
        ['Clause (xix)', 'Financial Viability', 'Ability to meet liabilities falling due within 1 year from Balance Sheet date'],
        ['Clause (xxi)', 'Consolidated Financial Statements', 'Reporting qualifications or adverse remarks from component CARO reports']
      ]
    }
  },
  {
    chapterName: 'Specialised Areas',
    keyPrinciples: [
      {
        title: 'SA 800 (Revised) — Special Purpose Frameworks (SPFS)',
        description: '• Governs audits of financial statements prepared in accordance with Special Purpose Frameworks (e.g., cash receipts/disbursements basis, tax basis, provisions of a contract, or regulatory reporting).\n• Acceptance: Obtain understanding of purpose, intended users, and steps taken by management to determine acceptability.\n• Auditor’s Report: Must include an Emphasis of Matter paragraph alerting users that the FS are prepared in accordance with SPF and may not be suitable for other purposes.\n• SA 701 applies in its entirety if the auditor is communicating Key Audit Matters on SPFS.',
        exception: 'Special purpose financial statements are intended for specific users; the auditor must include an EOM paragraph alerting readers of this restriction.',
        example: 'Auditor audits financial statements prepared strictly on cash basis for an international grant contract and includes an SA 706 EOM alert.'
      },
      {
        title: 'SA 805 (Revised) — Single Financial Statements & Specific Elements',
        description: '• Applies to an audit of a single financial statement (e.g., Balance Sheet, Cash Flow Statement) or a specific element, account, or item (e.g., trade receivables, inventory, royalty calculation).\n• Materiality determined for a single FS or specific element is usually significantly lower than materiality for a complete set of FS.\n• If auditor expresses adverse/disclaimer on complete set of FS: SA 705 does not permit expressing an unmodified opinion on a single FS in the same report.\n• Separate report on specific element: Permitted only if the element does not constitute a major portion of the FS and the report is not published together with the adverse/disclaimer report.',
        exception: 'The auditor shall not express an unmodified opinion on a single financial statement of a complete set of financial statements if an adverse opinion or disclaimer has been expressed on the complete set.',
        example: 'Auditor issues an independent audit opinion on the schedule of net tangible assets for an asset-sale transaction.'
      },
      {
        title: 'SA 810 (Revised) — Summary Financial Statements (SFS)',
        description: '• Auditor shall ordinarily accept an engagement to report on summary financial statements only when engaged to audit the historical financial statements from which they are derived.\n• Procedures: Evaluate whether SFS adequately disclose their summarized nature, identify audited FS, and agree with or can be recalculated from audited FS.\n• Unmodified opinion phrasing: "The accompanying summary financial statements are consistent, in all material respects, with the audited financial statements, in accordance with [applied criteria]"\n• Adverse opinion on SFS: Issued if SFS are not consistent or not a fair summary and management refuses to make necessary changes.\n• If audited FS had Adverse or Disclaimer: Report on SFS must state this fact and state that it is inappropriate to express an opinion on the summary financial statements.',
        exception: 'The auditor cannot express an audit opinion on summary financial statements if the auditor expressed an adverse opinion or disclaimer on the underlying full financial statements.',
        example: 'Auditor confirms that the abridged financial summary in the annual report is consistent in all material respects with the audited standalone financial statements.'
      }
    ],
    visualBreakdown: {
      title: 'Specialised Engagements (800 Series) Framework',
      type: 'table',
      headers: ['Standard', 'Engagement Scope', 'Materiality Level', 'Mandatory Alert / Condition'],
      rows: [
        ['SA 800', 'Special Purpose Frameworks (SPFS)', 'Based on intended user context', 'Mandatory EOM paragraph alerting readers of SPF'],
        ['SA 805', 'Single FS or Specific Element', 'Lower materiality specific to element', 'No unmodified opinion if complete set has adverse/disclaimer'],
        ['SA 810', 'Summary Financial Statements', 'Derived from audited full FS', 'No opinion on SFS if full FS had adverse opinion or disclaimer']
      ]
    }
  },
  {
    chapterName: 'Related Services',
    keyPrinciples: [
      {
        title: 'SRS 4400 — Engagements to Perform Agreed-Upon Procedures (AUP)',
        description: '• Objective: To carry out procedures of an audit nature to which the auditor, entity, and appropriate third parties have agreed, and report on factual findings.\n• No assurance is expressed: The report is purely a report of factual findings. Users draw their own conclusions from the findings.\n• Independence is NOT a statutory requirement for an AUP engagement (unlike an audit or review), but a statement to this effect must be included in the report if independence is not maintained.\n• Distribution of report: Strictly restricted to the parties who have agreed to the procedures to be performed.',
        exception: 'No assurance is expressed under SRS 4400; the auditor merely states the factual observations resulting from specified steps.',
        example: 'Auditor performs agreed verification of debtors aging list for a factoring bank; report is addressed and restricted exclusively to the borrower and factoring bank.'
      },
      {
        title: 'SRS 4410 — Compilation Engagements',
        description: '• Practitioner applies accounting and financial reporting expertise to assist management in preparing and presenting historical financial information without obtaining any assurance.\n• Compliance with ethical principles (integrity, objectivity, competence, confidentiality) is required; independence is not applicable.\n• Quality control: SQC 1 applies to compilation engagements at the firm and engagement level.\n• Practitioner’s Report: Must state that the engagement is not an assurance engagement, no verification of completeness or accuracy was performed, and no audit opinion or review conclusion is expressed.',
        exception: 'Under Ethical Standards Board rulings, the statutory auditor of an entity is NOT permitted to engage in a compilation engagement of that same entity under SRS 4410.',
        example: 'Practitioner compiles trial balance and financial statements for an unlisted SME from client-provided ledgers without expressing assurance.'
      }
    ],
    visualBreakdown: {
      title: 'Audit vs Review vs Agreed-Upon Procedures vs Compilation',
      type: 'table',
      headers: ['Parameter', 'Audit (SA 100-700)', 'Review (SRE 2400/2410)', 'AUP (SRS 4400)', 'Compilation (SRS 4410)'],
      rows: [
        ['Assurance Level', 'Reasonable Assurance (High)', 'Limited Assurance (Moderate)', 'No Assurance', 'No Assurance'],
        ['Report Phrasing', 'Positive ("True and fair view")', 'Negative ("Nothing has come to attention")', 'Factual findings report', 'Compilation report (No opinion)'],
        ['Independence', 'Mandatory', 'Mandatory', 'Not required (disclose if not)', 'Not applicable'],
        ['Key Procedures', 'Tests of controls & substantive details', 'Inquiries and analytical procedures', 'Agreed specific procedures', 'Compiling data using accounting skills']
      ]
    }
  },
  {
    chapterName: 'Review of Financial Information',
    keyPrinciples: [
      {
        title: 'SRE 2400 — Review of Historical Financial Statements',
        description: '• Practitioner is NOT the auditor of the entity’s financial statements.\n• Objective: Obtain limited assurance primarily through inquiry and analytical procedures to express a negative assurance conclusion whether anything has come to attention that causes the practitioner to believe the FS are not prepared in accordance with the applicable FRF.\n• Substantially less in scope than an audit; does not evaluate internal control or perform tests of records through inspection/confirmation.\n• Reporting: Expresses unmodified negative conclusion, qualified conclusion, adverse conclusion, or disclaimer of conclusion.',
        exception: 'If management imposes a scope limitation that will result in disclaiming a conclusion, the practitioner shall not accept the review engagement unless required by law.',
        example: 'Prospective buyer engages an independent practitioner to review the target’s quarterly financials under SRE 2400 before finalizing transaction terms.'
      },
      {
        title: 'SRE 2410 — Review of Interim Financial Information by Independent Auditor',
        description: '• Performed exclusively by the entity’s appointed independent statutory auditor.\n• Involves updating understanding of entity & internal controls, performing inquiries of finance executives, applying analytical procedures, and reading minutes of meetings.\n• Review does not ordinarily require tests of accounting records through inspection, physical observation, or independent confirmation.\n• Unmodified conclusion wording: "Based on our review, nothing has come to our attention that causes us to believe that the accompanying interim financial information does not give a true and fair view..."',
        exception: 'If a matter comes to attention requiring material adjustment and management refuses, the auditor must issue a qualified or adverse conclusion.',
        example: 'Statutory auditor performs the SEBI-mandated quarterly limited review for a listed corporation in accordance with SRE 2410.'
      }
    ],
    visualBreakdown: {
      title: 'Audit vs Review Comparison',
      type: 'table',
      headers: ['Feature', 'Audit Engagement', 'Review Engagement (SRE 2400 / 2410)'],
      rows: [
        ['Level of Assurance', 'Reasonable assurance (high level)', 'Limited assurance (moderate level)'],
        ['Nature of Procedures', 'Extensive: tests of controls, substantive details, confirmations', 'Primarily inquiry and analytical procedures'],
        ['Basis of Conclusion', 'Sufficient appropriate audit evidence (reasonable basis)', 'Sufficient appropriate review evidence (limited basis)'],
        ['Language of Opinion', 'Positively worded opinion ("present fairly / true and fair")', 'Negatively worded conclusion ("nothing has come to our attention")']
      ]
    }
  },
  {
    chapterName: 'Prospective Financial Information and Other Assurance Services',
    keyPrinciples: [
      {
        title: 'SAE 3400 — Examination of Prospective Financial Information (PFI)',
        description: '• PFI is financial information based on assumptions about future events (can be a Forecast, Projection, or combination).\n• Forecast: Based on management’s best-estimate assumptions expected to occur.\n• Projection: Based on hypothetical assumptions (unrealistic or exploratory "what-if" scenarios).\n• Assurance Level: Auditor provides only MODERATE assurance on the reasonableness of management’s assumptions; provides negative assurance on whether assumptions provide a reasonable basis.\n• Caveats: The report must state that PFI is future-oriented, actual results are likely to be different, and the auditor does not vouch for the achievability of the results.',
        exception: 'Under Clause (3) of Part I of the Second Schedule to CA Act, a member is guilty of misconduct if he permits his name to be used in connection with an estimate of earnings in a manner which may lead to the belief that he vouches for the accuracy of the forecast.',
        example: 'Company prepares 5-year financial forecast for bank loan syndication; auditor examines underlying assumptions under SAE 3400 and issues a moderate assurance report.'
      },
      {
        title: 'SAE 3402 & SAE 3420 — Service Organisations & Pro Forma Information',
        description: '• SAE 3402: Assurance reports on controls at a service organization.\n  - Type 1 Report: Report on description and design of controls as of a specified date.\n  - Type 2 Report: Report on description, design, and operating effectiveness of controls throughout a specified period (includes test of controls and results).\n• SAE 3420: Reasonable assurance engagement to report on compilation of Pro Forma Financial Information (PFI) included in a prospectus (adjusting unadjusted historical financials for significant acquisitions/divestments).\n• Practitioner opinion under SAE 3420: "The pro forma financial information has been compiled, in all material respects, on the basis of the applicable criteria."',
        exception: 'Type 1 report does not test operating effectiveness and cannot be used by user auditors to reduce substantive testing of controls.',
        example: 'Cloud payroll SaaS provider obtains a Type 2 SOC report under SAE 3402 covering design and operating effectiveness of payroll processing controls for the full financial year.'
      }
    ],
    visualBreakdown: {
      title: 'PFI Forecast vs Projection & Service Reports',
      type: 'table',
      headers: ['Concept', 'Definition / Basis', 'Assurance Provided', 'Mandatory Reporting Requirement'],
      rows: [
        ['Forecast (SAE 3400)', 'Best-estimate assumptions expected to happen', 'Moderate level assurance', 'State that auditor does not vouch for achievability'],
        ['Projection (SAE 3400)', 'Hypothetical "what-if" assumptions', 'Moderate level assurance', 'Disclose purpose and hypothetical nature clearly'],
        ['Type 1 Report (SAE 3402)', 'Design & description of controls as at a date', 'Reasonable assurance on design', 'Covers specific point in time; no tests of operation'],
        ['Type 2 Report (SAE 3402)', 'Design + Operating effectiveness over a period', 'Reasonable assurance on operation', 'Includes test of controls performed and results thereof'],
        ['Pro Forma Info (SAE 3420)', 'Compilation of pro forma effects for prospectus', 'Reasonable assurance on compilation', 'Confirms compilation in accordance with applicable criteria']
      ]
    }
  },
  {
    chapterName: 'Digital Auditing & Assurance',
    keyPrinciples: [
      {
        title: 'Digital Audit vs Auditing Digitally & Five IT Dependencies',
        description: '• Digital Audit: Placing assurance on the effectiveness of IT systems, identifying technology-related control gaps, and ensuring regulatory IT compliance.\n• Auditing Digitally: Utilizing advanced tools (data analytics, RPA, AI) to execute audit procedures faster and examine 100% of transaction populations.\n• Five Types of IT Dependencies: (1) Automated Controls (format checks, approval gates), (2) Reports (system-generated aging/vendor reports), (3) Calculations (depreciation, foreign exchange revaluations), (4) Security (access rights, segregation of duties), and (5) Interfaces (programmed ETL logic between subsystems).\n• IT General Controls (ITGCs) must be tested across Access Security, Program Changes, and Data Centre/Network Operations.',
        exception: 'If ITGCs are ineffective, the auditor cannot place reliance on automated application controls or system-generated reports without extensive substantive testing.',
        example: 'Automated 3-way matching in SAP fails due to bypass rights granted to purchase officers; auditor tests 100% manual vouchers.'
      },
      {
        title: 'Cyber Risks, Phishing & Attack Vectors',
        description: '• Common Cyber Threats: Phishing, Spoofing (Domain vs Email), Malware (Ransomware, Fileless Malware), Identity-based attacks, Insider threats, DNS Tunneling, IoT-based attacks, and Denial of Service (DoS) attacks.\n• Phishing Variants: (1) Spear Phishing: Targeted attacks on specific employees; (2) Whaling: High-level spear phishing targeting C-suite executives; (3) Vishing: Voice call / phone impersonation; (4) Smishing: SMS / text message deception.\n• Cybersecurity Framework (CSF) 5 Functions: Identify, Protect, Detect, Respond, Recover.\n• Auditor evaluates controls around: Vendor master changes, electronic funds transfers (dual authorization, call-backs), and patch management.',
        exception: 'Ransomware encrypts operational data demanding ransom; fileless malware uses legitimate tools already on system without saving separate files.',
        example: 'Auditor tests whether finance team uses out-of-band phone callbacks to verify bank account number changes requested via vendor emails.'
      },
      {
        title: 'Computer Assisted Audit Techniques (CAATs) & Emerging Technologies',
        description: '• Data Analytics Tools: ACL (anomaly detection in massive datasets), Alteryx (workflow automation & fraud machine learning), Power BI (data visualization & outlier identification), CaseWare (integrated audit workpapers & analytics).\n• Artificial Intelligence (AI): Auditor must evaluate process logic, test for unintended algorithm bias, assess human-in-the-loop review, and evaluate shifting oversight.\n• Blockchain & Smart Contracts: Decentralized immutable ledger; auditor evaluates controls beyond cryptography (external oracle integration, key management, data privacy).\n• Non-Fungible Tokens (NFTs): Unique digital assets requiring code review of smart contracts, ownership validation, and valuation assessment.\n• Robotic Process Automation (RPA): Auditor assesses operational/execution risks, change management lifecycle testing, and bot credential security.',
        exception: 'While blockchain records cannot be altered retroactively, fraud can still occur at the input/interface stage where off-chain data is entered.',
        example: 'Auditor runs ACL automated test script against 2,000,000 sales transactions to flag duplicate invoice numbers or weekend manual entries.'
      }
    ],
    visualBreakdown: {
      title: 'ITGC Control Domains & Audit Objectives',
      type: 'table',
      headers: ['Domain', 'Primary Objective', 'Key Specific Controls Tested'],
      rows: [
        ['Access Security', 'Ensure authorized access to programs & data', 'Timely removal of terminated users, periodic access reviews, MFA, generic ID logging'],
        ['Program Change', 'Ensure modified systems meet reporting needs', 'Segregated dev/test/prod environments, formal approvals, pre-migration testing'],
        ['Data Centre Operations', 'Ensure production systems are backed up & available', 'Scheduled backup policies, periodic restoration testing, batch job error monitoring']
      ]
    }
  },
  {
    chapterName: 'Group Audits',
    keyPrinciples: [
      {
        title: 'Statutory Mandate for Consolidated Financial Statements (CFS)',
        description: '• Section 129(3) of Companies Act, 2013: Where a company has one or more subsidiaries, associates, or joint ventures, it MUST prepare a Consolidated Financial Statement (CFS) in the same form and manner as its own.\n• Form AOC-1: Mandatory separate statement containing salient features of financial statements of subsidiaries/associates/JVs attached to standalone FS.\n• CFS Exemptions (Rule 6 of Companies (Accounts) Rules): An unlisted subsidiary is exempt from preparing CFS if: (1) Its immediate or ultimate holding company files CFS with the ROC, and (2) All other members have been intimated in writing and do not object.\n• Investment Entity Exemption (Ind AS 110): An investment entity measures subsidiaries at fair value through profit or loss rather than consolidating them.',
        exception: 'A holding company is not exempt from preparing CFS merely because its subsidiaries are registered outside India or operate in different industries.',
        example: 'Indian parent attaches Form AOC-1 disclosing revenue, profit after tax, and net worth of its 3 overseas wholly-owned subsidiaries.'
      },
      {
        title: 'Permanent vs Current Period Consolidation Adjustments',
        description: '• Permanent Consolidation Adjustments: Made on the first occasion of acquisition or subsequent change in shareholding; includes: (1) Determination of Goodwill or Capital Reserve (gain on bargain purchase), (2) Determination of Non-Controlling Interest (NCI), and (3) Pre-acquisition reserves allocation.\n• Current Period Consolidation Adjustments: Made during each reporting period; includes: (1) Elimination of intra-group transactions and account balances, (2) Unrealized intercompany profits on unsold inventory/assets, (3) Recording deferred tax on unrealized profit u/s Ind AS 12, (4) Harmonizing accounting policies, and (5) Foreign currency translation differences.\n• Reporting Gap Limit: Gap between parent and component reporting dates cannot exceed 6 months under AS 21 and 3 months under Ind AS 110.',
        exception: 'Under Ind AS 110, the difference between the reporting date of a subsidiary and the parent shall not be more than three months.',
        example: 'Parent eliminates ₹50 Lakhs intra-group sales and records ₹3 Lakhs deferred tax asset on ₹12 Lakhs unrealized profit remaining in closing stock.'
      },
      {
        title: 'Audit Procedures & SA 600 in Group Audits',
        description: '• Principal Auditor (PA) must compute materiality for the group as a whole and use it to determine which components are scoped in.\n• PA obtains confirmations from component auditors regarding independence, ethics, and compliance with group instructions.\n• PA reviews written summary of component auditor’s work, considers significant findings, and evaluates whether additional procedures are needed.\n• Reporting on CFS: PA’s report must state the division of responsibility, clearly indicating the magnitude (percentage of total assets, revenue, and cash flows) audited by other auditors.\n• CARO 2020 Clause (xxi): PA must report details of any qualifications or adverse remarks included in the CARO reports of group companies.',
        exception: 'Reference to the work of other auditors under SA 706 / SA 600 in the group audit report does not constitute a qualification of the opinion, but an explicit statement of divided responsibility.',
        example: 'The principal auditor reports that 4 foreign subsidiaries representing 32% of group revenue were audited by overseas member firms.'
      }
    ],
    visualBreakdown: {
      title: 'Consolidation Adjustments Classification',
      type: 'table',
      headers: ['Adjustment Type', 'Timing / Occurrence', 'Key Components Handled by Auditor'],
      rows: [
        ['Permanent Consolidation', 'At date of acquisition & ownership changes', 'Goodwill / Capital Reserve calculation, NCI fair value, pre-acquisition reserves'],
        ['Current Period Consolidation', 'Every financial reporting period', 'Intra-group debtor/creditor elimination, unrealized stock profit, deferred tax Ind AS 12'],
        ['Harmonization Adjustments', 'Ongoing each period', 'Aligning depreciation methods, revenue policies, and foreign currency GAAP conversions']
      ]
    }
  },
  {
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    keyPrinciples: [
      {
        title: 'Bank Audit: CRR, SLR & Prudential Norms',
        description: '• Cash Reserve Ratio (CRR): Minimum percentage of Net Demand and Time Liabilities (NDTL) maintained with RBI in cash; verified via Form A return.\n• Statutory Liquidity Ratio (SLR): Minimum percentage of NDTL maintained in gold, unencumbered approved securities, and cash; verified via Form VIII return on reporting Fridays.\n• Drawing Power (DP): Must be calculated strictly as per board-approved guidelines based on stock/debtor statements not older than 3 months. If stock statement is > 3 months old, the account is deemed irregular.\n• Non-Performing Asset (NPA): Overdue for > 90 days for term loans; out of order for > 90 days for CC/OD; bills overdue > 90 days; short duration crops overdue for 2 crop seasons; long duration crops overdue for 1 crop season.\n• Government Guaranteed Advances: Central Govt guaranteed advances become NPA only when CG repudiates guarantee when invoked; State Govt guaranteed advances become NPA if overdue > 90 days.',
        exception: 'State Government guaranteed advances do NOT enjoy the Central Govt exemption; they become NPA if overdue for more than 90 days.',
        example: 'Borrower stock statement dated Nov 30, 2025; by March 31, 2026 it is > 3 months old, making drawing power invalid and account irregular.'
      },
      {
        title: 'Bank Audit: LFAR, Upgradation & Asset Provisioning',
        description: '• Long Form Audit Report (LFAR): Must be submitted by branch and central auditors; consolidated LFAR must be submitted to the Audit Committee of the Board (ACB) and forwarded to RBI within 60 days.\n• Upgradation of NPA: An NPA account can be upgraded to standard ONLY if all arrears of interest and principal are fully paid up by the borrower from genuine sources.\n• Provisioning on NPAs:\n  - Sub-standard (≤ 12 months): 15% on secured portion; 25% on unsecured (20% for infrastructure loans).\n  - Doubtful 1 (up to 1 year): 25% secured + 100% unsecured.\n  - Doubtful 2 (1 to 3 years): 40% secured + 100% unsecured.\n  - Doubtful 3 (> 3 years): 100% secured + 100% unsecured.\n  - Loss Asset: 100% written off or 100% provided.',
        exception: 'Restructured accounts cannot be upgraded immediately upon restructuring; they require a minimum 1 year of satisfactory performance under revised terms.',
        example: 'Doubtful-2 advance of ₹100 Lakhs with realizable security of ₹60 Lakhs: Provision = (40% of 60L = 24L) + (100% of 40L = 40L) = ₹64 Lakhs.'
      },
      {
        title: 'NBFC Audit: Scale Based Regulation (SBR), NOF & Prudential Norms',
        description: '• Section 45-I(f) Principal Business 50-50 Criteria: Financial assets > 50% of total assets (net of intangibles) AND income from financial assets > 50% of gross income.\n• Section 45-IA Certificate of Registration (CoR): Minimum Net Owned Fund (NOF) requirement is ₹10 Crores (glide path to March 31, 2027; Base ₹2 Cr for P2P/AA/no public funds; ₹300 Cr for IFC/IDF-NBFC).\n• SBR Four Layers: (1) Base Layer (Non-deposit < ₹1,000 Cr, P2P, AA), (2) Middle Layer (All deposit-taking, non-deposit ≥ ₹1,000 Cr, CICs, HFCs, IFCs), (3) Upper Layer (top NBFCs identified by RBI), and (4) Top Layer (ordinarily empty).\n• Capital Adequacy (CRAR): Minimum 15% (Tier 1 min 10%, or 12% for gold loan NBFCs). Bank CRAR is minimum 9%.\n• NPA Norm: Overdue for > 90 days (transitioned via glide path: >150 days by Mar 2024, >120 days by Mar 2025, >90 days by Mar 2026).\n• Exception Reporting to RBI: Auditor must report contraventions of Chapter IIIB of RBI Act, Public Deposits Directions, or SBR Directions directly to RBI Regional Office.',
        exception: 'Auditor’s exception report to RBI Regional Office must contain only contraventions and adverse remarks — not general compliance statements.',
        example: 'Non-deposit NBFC with total assets ₹800 Crores and no public funds is classified in Base Layer; minimum NOF requirement is ₹2 Crores.'
      }
    ],
    visualBreakdown: {
      title: 'NBFC Scale-Based Regulation (SBR) Four-Tier Architecture',
      type: 'table',
      headers: ['SBR Layer', 'Eligible NBFC Categories', 'Key Regulatory Norms'],
      rows: [
        ['Base Layer (NBFC-BL)', 'Non-deposit taking < ₹1,000 Cr, NBFC-P2P, NBFC-AA, NOFHC', 'NOF ₹2 Cr / ₹10 Cr glide path, standard asset provision 0.25%'],
        ['Middle Layer (NBFC-ML)', 'All deposit-taking (NBFC-D), non-deposit ≥ ₹1,000 Cr, HFCs, IFCs, CICs', 'Mandatory 15% CRAR, 90-day NPA norm, standard asset provision 0.40%'],
        ['Upper Layer (NBFC-UL)', 'Top 15 NBFCs specifically identified by RBI based on scoring methodology', 'Enhanced bank-like governance, board composition, and leverage caps'],
        ['Top Layer (NBFC-TL)', 'Ordinarily empty; populated if substantial systemic risk arises in Upper Layer', 'Ultra-stringent prudential restrictions directly imposed by RBI']
      ]
    }
  },
  {
    chapterName: 'Overview of Audit of Public Sector Undertakings',
    keyPrinciples: [
      {
        title: 'Constitutional Role of C&AG & Articles 148 to 151',
        description: '• Article 148: Appointment of C&AG by the President; removal only on ground of proven misbehavior or incapacity (similar to Supreme Court Judge).\n• Article 149: Defines duties and powers of C&AG regarding accounts of the Union and States under the C&AG Act, 1971.\n• Article 150: President prescribes form of accounts of Union and States on advice of C&AG.\n• Article 151: C&AG audit reports submitted to President / Governor to be laid before Parliament / State Legislatures.\n• Section 2(45) Government Company: Company in which ≥ 51% of paid-up share capital is held by Central Govt, State Govt(s), or partly by Central and State Govts (includes subsidiaries).\n• Role: C&AG acts as "friend, philosopher, and guide" to Parliamentary Financial Committees (PAC, COPU).',
        exception: 'C&AG conducts supplementary audit under Section 143(6) of Companies Act, 2013 within 60 days from the date of receipt of the audit report from the statutory auditor appointed by C&AG.',
        example: 'C&AG issues directions under Section 143(5) to statutory auditors of a Central PSU regarding valuation of abandoned exploration projects.'
      },
      {
        title: 'Financial, Compliance & Performance Audits in PSUs',
        description: '• Financial Audit: Attestation engagement to express opinion on truth and fairness of financial statements under applicable FRF.\n• Compliance Audit: Evaluates whether activities, financial transactions, and information comply with authorities governing the auditee. Focuses on: (1) Regularity (adherence to formal laws, rules, budgets), and (2) Propriety (observance of general principles of sound public financial management).\n• Performance Audit: Objective examination of programs/enterprises based on the 3Es:\n  1. Economy: Minimizing cost of resources with regard to appropriate quality.\n  2. Efficiency: Input-output ratio (maximizing outputs with minimum inputs).\n  3. Effectiveness: Extent to which program objectives are achieved and intended impact delivered.',
        exception: 'While financial audits are always attestation engagements, performance audits and compliance audits are generally direct reporting engagements.',
        example: 'Performance audit of national highway construction evaluates whether project cost per kilometer (Economy), completion timeline (Efficiency), and accident reduction targets (Effectiveness) were met.'
      },
      {
        title: 'Comprehensive & Propriety Audit Principles',
        description: '• Propriety Audit: Focuses on whether public funds were spent wisely, reasonably, and in public interest, even if formal vouchers exist. Defined by E.L. Kohler as meeting tests of public interest and sound conduct.\n• Four Core Principles of Propriety:\n  1. Expenditure is not prima facie more than the occasion demands; official exercises same vigilance as a person of ordinary prudence would exercise on his own money.\n  2. Sanctioning authority passes no order directly or indirectly accruing to its own advantage.\n  3. Public funds are not utilized for the benefit of a particular person or group of persons.\n  4. Apart from agreed remuneration, no other avenue is kept open to indirectly benefit management or employees.\n• Comprehensive Audit: Examines overall project planning, capital cost vs approved cost, capacity utilization, R&D progress, and return on capital employed.',
        exception: 'Executive departments are responsible for enforcing economy; audit’s function is to highlight wastefulness, extravagance, and infructuous expenditure.',
        example: 'Propriety audit exposes procurement of luxury vehicles for PSU directors under the guise of site-inspection equipment.'
      }
    ],
    visualBreakdown: {
      title: 'Public Sector Audit Framework & The 3Es',
      type: 'table',
      headers: ['Audit Type', 'Primary Objective', 'Core Benchmark / Focus'],
      rows: [
        ['Financial Audit', 'Express opinion on financial statements', 'Compliance with FRF & accounting standards (Attestation)'],
        ['Compliance Audit (Regularity)', 'Adherence to formal laws and regulations', 'Statutory enactments, rules, tender conditions, budgets'],
        ['Compliance Audit (Propriety)', 'Adherence to public interest and ethics', 'Prudence, no personal benefit, avoid wastefulness'],
        ['Performance Audit (Economy)', 'Minimizing resource costs', 'Best purchase price without compromising quality'],
        ['Performance Audit (Efficiency)', 'Optimizing input-output ratio', 'Maximizing physical deliverables per unit of expenditure'],
        ['Performance Audit (Effectiveness)', 'Achieving policy outcomes', 'Realization of planned socio-economic impact']
      ]
    }
  },
  {
    chapterName: 'Internal Audit',
    keyPrinciples: [
      {
        title: 'Section 138 Companies Act, 2013 Applicability Thresholds',
        description: '• Mandatory Internal Audit applies to:\n  1. Every Listed Company (all listed companies regardless of size).\n  2. Every Unlisted Public Company having during preceding financial year:\n     - Paid-up share capital ≥ ₹50 Crores; OR\n     - Turnover ≥ ₹200 Crores; OR\n     - Outstanding loans/borrowings from banks/PFIs > ₹100 Crores at any point; OR\n     - Outstanding deposits > ₹25 Crores at any point.\n  3. Every Private Company having during preceding financial year:\n     - Turnover ≥ ₹200 Crores; OR\n     - Outstanding loans/borrowings from banks/PFIs > ₹100 Crores at any point.\n• Eligibility: Chartered Accountant, Cost Accountant, or such other professional as decided by the Board. The internal auditor may or may not be an employee of the company.',
        exception: 'Statutory auditor of a company cannot be appointed as its internal auditor (prohibited u/s 144 of Companies Act, 2013).',
        example: 'Unlisted public company with paid up capital ₹30 Cr, turnover ₹150 Cr, but bank overdraft touched ₹105 Cr on one day: internal audit is mandatory.'
      },
      {
        title: 'Standards on Internal Audit (SIA) 210, 370, 380 & 390',
        description: '• SIA 210 (Managing Internal Audit Function): Define plan, methodology, allocate staff, maintain quality evaluation program.\n• SIA 370 (Reporting Results): Reporting occurs in two stages: (1) Assignment-specific Internal Audit Report issued to auditee & executive management, and (2) Periodic (Quarterly) comprehensive report submitted to Audit Committee / Board.\n• SIA 380 (Issuing Assurance Reports): Structure includes scope, period covered, executive summary, rating of issues (High/Medium/Low), root cause, business impact, recommendations, and management action plans with timelines.\n• SIA 390 (Monitoring & Reporting Prior Audit Issues): Continuous tracking of corrective actions via Action Taken Report (ATR). Role is to monitor and report—NOT implement.',
        exception: 'The internal auditor monitors and reports on implementation of recommendations; management is solely responsible for implementing corrective action.',
        example: 'Internal auditor compiles quarterly Action Taken Report (ATR) tracking 14 unresolved IT access control observations for the Audit Committee.'
      },
      {
        title: 'Mandatory Audit Trail / Edit Log (Rule 3(1) Companies Accounts Rules)',
        description: '• Companies using accounting software must use software with feature of recording audit trail (edit log) for each and every transaction.\n• Requirements: (1) Creating an edit log of every change with date & timestamp, (2) Ensuring audit trail cannot be disabled, and (3) Preserving audit trail for 8 years.\n• Statutory Auditor Reporting: Under Rule 11(g) of Companies (Audit & Auditors) Rules, auditor must state whether company used software with audit trail, whether it operated throughout the year without tampering, and whether log was preserved.',
        exception: 'Audit trail requirement applies to the entire financial year; temporary disabling of the audit trail feature at any point attracts adverse reporting.',
        example: 'Auditor checks database logs to confirm that the audit trail feature was active continuously from April 1 to March 31 without interruption.'
      }
    ],
    visualBreakdown: {
      title: 'Section 138 Internal Audit Mandatory Applicability Matrix',
      type: 'table',
      headers: ['Class of Company', 'Capital', 'Turnover', 'Loans / Borrowings (Banks/PFIs)', 'Public Deposits'],
      rows: [
        ['Listed Company', 'Any amount', 'Any amount', 'Any amount', 'Any amount'],
        ['Unlisted Public Company', '≥ ₹50 Crores', '≥ ₹200 Crores', '> ₹100 Crores (at any point)', '> ₹25 Crores (at any point)'],
        ['Private Company', 'N/A', '≥ ₹200 Crores', '> ₹100 Crores (at any point)', 'N/A']
      ]
    }
  },
  {
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    keyPrinciples: [
      {
        title: 'Due Diligence vs Audit vs Investigation',
        description: '• Due Diligence: Examination of a prospective business opportunity/investment to confirm all material facts, uncover "deal killer" defects, value assets, and negotiate warranties. Voluntary, future-focused.\n• Audit: Independent statutory examination to express opinion on true and fair view of financial statements. Mandatory, sample-based, prima facie evidence.\n• Investigation: Detailed examination aiming at establishing a specific fact or assessing a situation (e.g. fraud, tax evasion, loan sanctioning, share valuation). Conclusive evidence, non-sample in-depth checking, no rigid timeframe.\n• Key Steps in Investigation: Determine objectives, formulate program, examine records, analyze findings, prepare structured report with opinion in final paragraph.',
        exception: 'An investigator is not bound by accounting conventions or sample checking; he seeks conclusive evidence and may review records of several past years.',
        example: 'Bank appoints forensic investigator to trace diversion of working capital funds into shell real estate entities over past 4 years.'
      },
      {
        title: 'Hidden Liabilities & Overvalued Assets in Financial Due Diligence',
        description: '• Hidden Liabilities Check: (1) Unmatured show cause notices, (2) Letters of comfort given to banks, (3) Product liability & warranty claims, (4) Environmental claims, (5) Unfunded gratuity/leave encashment, (6) Long pending tax assessments, (7) Contingent liabilities of sold subsidiaries indemnified by company, (8) Agreements to buy back shares at fixed price.\n• Overvalued Assets Check: (1) Uncollectable receivables, (2) Obsolete/slow-moving inventory valued above NRV, (3) Underused/impaired plant & machinery, (4) Inappropriate capitalisation of revenue expenses, (5) Investments carrying sub-market returns, (6) Intangible assets of no commercial value.',
        exception: 'Letters of comfort are not formal guarantees and often omitted from balance sheet notes, creating major unrecorded financial commitments.',
        example: 'Due diligence team detects ₹15 Crore unrecorded gratuity liability because actuarial valuation had used outdated 4% discount rate.'
      },
      {
        title: 'The Fraud Diamond & Forensic Accounting Standards (FAIS)',
        description: '• Fraud Diamond: 4 Elements: (1) Incentive / Pressure, (2) Opportunity, (3) Rationalization, and (4) Capability (personal traits and abilities to execute and conceal fraud).\n• Asset Misappropriation Categories: (1) Cash Theft (Skimming vs Cash Larceny), (2) Fraudulent Disbursements (Billing schemes, Ghost employees, Expense reimbursement schemes, Check tampering, Register disbursement).\n• FAIS Architecture (ICAI): 100 Series (Key Concepts: FAIS 110-140), 200 Series (Engagement Management: FAIS 210-250), 300 Series (Executing: FAIS 310-360), 400 Series (Specialised: Data Analysis FAIS 410, Digital Domain FAIS 420, Loans FAIS 430), 500 Series (Reporting FAIS 510), 600 Series (Quality Control FAIS 610).\n• Red Flags: Warning signs classified into financial performance, accounting system, operational, and behavioral red flags.',
        exception: 'Unlike statutory audits where materiality dictates scope, forensic accountants investigate seemingly immaterial items if indicative of systemic fraud.',
        example: 'Forensic auditor applies FAIS 410 data analysis to detect ghost employees by matching employee bank account numbers against vendor records.'
      }
    ],
    visualBreakdown: {
      title: 'Audit vs Investigation vs Forensic Accounting Comparison',
      type: 'table',
      headers: ['Parameter', 'Statutory Audit', 'Investigation', 'Forensic Accounting'],
      rows: [
        ['Objective', 'Express true & fair opinion on FS', 'Establish a specific fact or situation', 'Gather evidence for legal prosecution / court'],
        ['Evidence Type', 'Persuasive (Prima facie evidence)', 'Conclusive evidence', 'Legal proof / Court admissible evidence'],
        ['Mindset', 'Professional Skepticism', 'Critical Investigative Mind', 'Investigative Mentality & Neutrality'],
        ['Period Covered', 'Single financial year / period', 'Multiple years as needed', 'Event-specific (no time limitations)'],
        ['Standards', 'ICAI Standards on Auditing (SAs)', 'Custom terms of assignment', 'Forensic Accounting & Investigation Standards (FAIS)']
      ]
    }
  },
  {
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    keyPrinciples: [
      {
        title: 'ESG Pillars, 17 SDGs & 6 Capitals of Integrated Reporting',
        description: '• Three Pillars of ESG: Environment (climate, emissions, water, waste, clean tech), Social (human capital, safety, diversity, product liability, human rights), Governance (board diversity, executive pay, ethics, tax transparency).\n• 17 UN SDGs: 1-No Poverty, 2-Zero Hunger, 3-Good Health, 4-Quality Education, 5-Gender Equality, 6-Clean Water, 7-Affordable Clean Energy, 8-Decent Work, 9-Industry Innovation, 10-Reduced Inequalities, 11-Sustainable Cities, 12-Responsible Consumption, 13-Climate Action, 14-Life Below Water, 15-Life On Land, 16-Peace & Justice, 17-Partnership for Goals.\n• Six Capitals of <IR> Framework (IIRC): (1) Financial Capital, (2) Manufactured Capital, (3) Intellectual Capital, (4) Human Capital, (5) Social & Relationship Capital, and (6) Natural Capital.',
        exception: 'Natural capital includes air, water, land, forests, and biodiversity that cannot be substituted entirely by financial or manufactured capital.',
        example: 'Automobile conglomerate reports financial return (Financial Capital) alongside EV carbon reduction (Natural Capital) and technician upskilling (Human Capital).'
      },
      {
        title: 'Evolution of ESG in India & BRSR Structure',
        description: '• Timeline: 2009 (NVGs by MCA) → 2012 (BRR for top 100 listed) → 2014 (Section 135 CSR mandated) → 2015 (BRR top 500) → 2017 (Voluntary Integrated Reporting) → 2019 (NGRBC released, top 1,000 BRR) → 2021 (BRSR introduced) → 2022-23 (Mandatory BRSR for top 1,000 listed entities).\n• BRSR Structure (3 Sections):\n  - Section A: General Disclosures (entity details, products, operations, employees, holding/subsidiary).\n  - Section B: Management Process & Disclosures (policy, governance, leadership, oversight).\n  - Section C: Principle-wise Performance Disclosures (Essential Indicators [Mandatory] + Leadership Indicators [Optional]) based on 9 NGRBC principles.',
        exception: 'BRSR Essential Indicators are strictly mandatory for top 1,000 listed entities, while Leadership Indicators provide aspirational disclosures.',
        example: 'Top 500 NSE-listed manufacturer discloses Scope 1 & Scope 2 greenhouse gas emissions under Section C Essential Indicators of BRSR.'
      },
      {
        title: 'Nine Principles of BRSR & Assurance Standards (SSAE 3000 & SAE 3410)',
        description: '• 9 Principles: P1-Ethics & Transparency, P2-Safe & Sustainable Goods, P3-Employee Well-being, P4-Stakeholder Interests, P5-Human Rights, P6-Environment Protection, P7-Public Policy Advocacy, P8-Inclusive Growth & CSR, P9-Consumer Value & Privacy.\n• Mapping: 2 in Environment (P2, P6), 3 in Social (P3, P5, P8), 4 in Governance (P1, P4, P7, P9).\n• SSAE 3000: Standard on Sustainability Assurance Engagements on Sustainability Information (Mandatory for assurance reports on or after March 31, 2024; voluntary for FY 2022-23).\n• SAE 3410: Assurance Engagements on Greenhouse Gas (GHG) Statements.\n• Social Audit Standards (SAS 100 to 1600): Issued by SRSB of ICAI for auditing social enterprises on Social Stock Exchange (SSE).',
        exception: 'Under SEBI circular, a statutory auditor is not permitted to prepare the BRSR study for an audit client, but IS permitted to be the "Assurance provider of BRSR Core".',
        example: 'Practitioner issues reasonable assurance on Scope 1 and Scope 2 GHG metrics in accordance with SAE 3410 and SSAE 3000.'
      }
    ],
    visualBreakdown: {
      title: 'BRSR Nine Principles & ESG Categorization',
      type: 'table',
      headers: ['Principle No.', 'Core Subject', 'ESG Domain', 'Mandatory Reporting Indicators'],
      rows: [
        ['Principle 1', 'Ethics, Transparency & Accountability', 'Governance', 'Anti-corruption training, fines/penalties, conflict of interest'],
        ['Principle 2', 'Safe & Sustainable Goods and Services', 'Environment', 'Resource intensity, R&D in sustainable tech, extended producer responsibility'],
        ['Principle 3', 'Well-being of Employees and Workers', 'Social', 'Health insurance, maternity/paternity, workplace accidents, wage equality'],
        ['Principle 4', 'Respect for Stakeholders’ Interests', 'Governance', 'Vulnerable group identification, consultation frequency, grievance mechanisms'],
        ['Principle 5', 'Respect and Promote Human Rights', 'Social', 'Minimum wages, child labor prevention, sexual harassment redressal'],
        ['Principle 6', 'Protection & Restoration of Environment', 'Environment', 'GHG emissions (Scope 1 & 2), water consumption, air emissions, zero liquid discharge'],
        ['Principle 7', 'Responsible Public & Regulatory Policy Advocacy', 'Governance', 'Trade chamber memberships, policy papers submitted, anti-competitive stance'],
        ['Principle 8', 'Promote Inclusive Growth & Equitable Development', 'Social', 'Social Impact Assessments (SIA), CSR projects, local procurement percentage'],
        ['Principle 9', 'Provide Value to Consumers Responsibly', 'Governance', 'Consumer data privacy breaches, cyber security incidents, product recall details']
      ]
    }
  },
  {
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    keyPrinciples: [
      {
        title: 'Fundamental Principles & Conceptual Framework (Threats & Safeguards)',
        description: '• Five Fundamental Principles: (1) Integrity (honest & straightforward), (2) Objectivity (no bias or conflict of interest), (3) Professional Competence and Due Care (attain & maintain knowledge), (4) Confidentiality (respect client information), and (5) Professional Behavior (comply with laws, avoid discrediting profession).\n• Five Threats to Independence:\n  - Self-Interest Threat: Financial interest in client or undue fee dependence.\n  - Self-Review Threat: Evaluating results of judgment made in previous non-audit service.\n  - Advocacy Threat: Promoting client position to point objectivity compromised.\n  - Familiarity Threat: Long association or close relationship with client.\n  - Intimidation Threat: Deterred from acting objectively by actual or perceived threats.\n• Safeguards: Eliminate circumstances, apply safeguards, or decline/withdraw from engagement.',
        exception: 'Confidentiality may be overridden when: (1) Disclosure required by law, (2) Authorized by client, (3) Compliance with Peer Review / Quality Review, or (4) Defending professional interest in legal proceedings.',
        example: 'Auditor’s fees from a single client constitute 45% of total gross firm receipts: poses severe self-interest and intimidation threats requiring safeguards.'
      },
      {
        title: 'NOCLAR vs SA 250 (Applicability & Reporting Framework)',
        description: '• Responding to Non-Compliance with Laws and Regulations (NOCLAR):\n  - In Public Practice (Section 360): Mandatory for audit of entities listed on recognized stock exchanges in India with net worth ≥ ₹250 Crores.\n  - In Service (Section 260): Applicable to Senior Professional Accountants in service of listed entities.\n• NOCLAR vs SA 250:\n  - Scope: SA 250 applies only to audit engagements; NOCLAR applies to all professional accountants.\n  - Public Interest: NOCLAR explicitly considers impact on investors, creditors, employees, and public, permitting disclosure to authorities without client consent to prevent imminent substantial harm.\n  - SA 250 does not permit disclosure to external authorities without entity consent unless required by statute.',
        exception: 'NOCLAR does not cover personal misconduct unrelated to business activities or matters that are clearly inconsequential.',
        example: 'Auditor uncovers deliberate dumping of toxic effluent in violation of environmental laws; discloses to State Pollution Board under NOCLAR to prevent imminent public harm.'
      },
      {
        title: 'The First & Second Schedules to Chartered Accountants Act, 1949',
        description: '• First Schedule (Minor Misconduct — Handled by Board of Discipline; max fine ₹1 Lakh, max suspension 3 months):\n  - Part I (In Practice): Cl 1 (Allowing non-CA to practice in his name), Cl 2 (Sharing fees/profits with non-members), Cl 3 (Accepting share of profits of non-members), Cl 4 (Partnership with non-prescribed persons), Cl 5 (Securing work through non-employees/non-partners), Cl 6 (Soliciting clients/work), Cl 7 (Advertising attainments/services), Cl 8 (Accepting audit without prior written communication with retiring auditor), Cl 9 (Non-compliance with Sec 139/140), Cl 10 (Charging contingent fees), Cl 11 (Engaging in other business without permission), Cl 12 (Allowing non-partner CA to sign report).\n  - Part II (In Service): Cl 1 (Sharing emoluments), Cl 2 (Accepting kickbacks/commissions).\n  - Part III (Members Generally): Cl 1 (Acting as Fellow when not), Cl 2 (Not supplying information to ICAI/DC/QRB), Cl 3 (Giving false information in tenders/write-ups).\n  - Part IV (Other Misconduct): Punishable with civil/criminal imprisonment ≤ 6 months; bringing disrepute to Institute.\n• Second Schedule (Major Misconduct — Handled by Disciplinary Committee; max fine ₹5 Lakhs, permanent removal):\n  - Part I (In Practice): Cl 1 (Disclosing confidential info without consent), Cl 2 (Certifying FS not examined by him/partner/employee/other CA), Cl 3 (Vouching accuracy of future earnings forecast), Cl 4 (Substantial interest in business audited), Cl 5 (Failing to disclose material fact), Cl 6 (Failing to report material misstatement), Cl 7 (Gross negligence / lack of due diligence), Cl 8 (Failing to obtain sufficient information), Cl 9 (Material departure from GAAP), Cl 10 (Failing to keep client money in separate bank account).\n  - Part II (Members Generally): Cl 1 (Contravention of Act/Regulations/Council Guidelines), Cl 2 (Disclosing confidential info by employee), Cl 3 (False info in returns to ICAI), Cl 4 (Embezzlement/defalcation), Cl 5 (Auditor in contravention of Companies Act).\n  - Part III (Other Misconduct): Imprisonment exceeding 6 months.',
        exception: 'Clause (8) Part I First Schedule: Under Council Guidelines, in case of urgent government/bank branch audits where there is no time to wait for reply, conditional acceptance is permitted after dispatching written communication.',
        example: 'A CA in practice advertises his taxation accomplishments on a highway billboard: guilty of professional misconduct under Clauses (6) and (7) of Part I, First Schedule.'
      },
      {
        title: 'Council General Guidelines, 2008 & Statutory Thresholds',
        description: '• Tax Audit Limit u/s 44AB: Maximum 60 tax audit assignments per partner/CA in practice per financial year (audits u/s 44AD, 44ADA, 44AE excluded).\n• Company Audit Limit u/s 141: Maximum 30 company audits per partner/CA (excluding OPCs and dormant companies).\n• Non-Audit Fees Ceiling: For statutory audits of PSUs, Govt companies, or listed companies with turnover ≥ ₹50 Crores, non-audit fees cannot exceed statutory audit fees (network firms combined fee limited to 3x statutory audit fee).\n• Indebtedness Limit: A member/firm/relative cannot accept audit if indebted to the concern or given guarantee exceeding ₹1,00,000 (or statutory limits).\n• Branch Office (Section 27): Each office must be under separate charge of a member; second office exemption permitted if located in same premises, same city, or within 50 km from municipal limits.\n• Unique Document Identification Number (UDIN): Mandatory on all corporate/non-corporate certificates, GST, Tax Audit, and assurance reports.',
        exception: 'Undisputed audit fees non-payment prohibition under Chapter VII does not apply in the case of a "sick unit" (accumulated losses ≥ net worth, registered ≥ 5 years).',
        example: 'CA firm partner holds 25 company audits in individual name and 15 in partnership firm: exceeds the individual ceiling of 30 audits.'
      },
      {
        title: 'Key Ethical Standards Board (ESB) Landmark Decisions',
        description: '• ESB 1: Statutory auditor cannot prepare BRSR study for audit clients, but CAN be the "Assurance provider of BRSR Core".\n• ESB 2: Statutory auditor cannot undertake compilation engagement under SRS 4410 for the same entity.\n• ESB 10: Statutory auditor of a bank cannot accept Agency for Specialized Monitoring (ASM) of a customer of the same bank simultaneously.\n• ESB 11: Member cannot be appointed as Internal Auditor and Procurement Officer simultaneously.\n• ESB 18: No prohibition for internal auditor of a company to acquire/purchase shares of that company (unlike statutory auditor).\n• ESB 29: CA holding bank credit card can be auditor if outstanding balance does not exceed ₹1,00,000 beyond prescribed credit period.\n• ESB 31: CA in practice is NOT permitted to accept bank audit if he has taken a loan against a Fixed Deposit held by him in that bank.\n• ESB 35: CA cannot exercise lien over client documents/records for non-payment of fees.\n• ESB 41: Statutory auditor of a bank branch cannot accept stock audit of the same branch or any other branch of the same bank for the same FY.',
        exception: 'A Chartered Accountant cannot exercise a right of lien over books of accounts and documents of a client for non-payment of professional fees.',
        example: 'CA holds ₹5 Lakh FD in Bank ABC and takes ₹4 Lakh loan against it; CA is disqualified from acting as statutory branch auditor of Bank ABC.'
      }
    ],
    visualBreakdown: {
      title: 'Discipline Mechanism & Punitive Powers Matrix',
      type: 'table',
      headers: ['Forum', 'Jurisdiction', 'Enquiry / Finding', 'Maximum Punitive Powers'],
      rows: [
        ['Board of Discipline', 'First Schedule (Minor Misconduct)', 'Guilty of professional / other misconduct in Schedule I', 'Reprimand; suspension up to 3 months; fine up to ₹1,00,000'],
        ['Disciplinary Committee', 'Second Schedule & Both Schedules (Major)', 'Guilty of professional / other misconduct in Schedule II', 'Reprimand; permanent or any period removal; fine up to ₹5,00,000'],
        ['Appellate Authority', 'Appeals against Board / DC orders', 'Filed within 90 days of order receipt', 'Confirm, modify, set aside, enhance penalty, or remit case back']
      ]
    }
  }
];

export const AUDIT_STATUTORY_SECTIONS: StatutorySection[] = [
  {
    number: 'Section 138 (Companies Act)',
    heading: 'Internal Audit — Mandatory Applicability & Qualifications',
    purpose: 'Mandates internal audit for prescribed classes of listed, unlisted public, and private companies to evaluate internal controls and governance.',
    subsections: [
      { number: 'Sec 138(1) Class 1', heading: 'Listed Companies', purpose: 'Every listed company must mandatorily appoint an internal auditor.' },
      { number: 'Sec 138(1) Class 2', heading: 'Unlisted Public Companies', purpose: 'Applicable if preceding year: Capital ≥ ₹50 Cr, Turnover ≥ ₹200 Cr, Loans > ₹100 Cr, or Deposits > ₹25 Cr.' },
      { number: 'Sec 138(1) Class 3', heading: 'Private Companies', purpose: 'Applicable if preceding year: Turnover ≥ ₹200 Cr, or Loans/Borrowings > ₹100 Cr at any point.' },
      { number: 'Sec 138 Qualifications', heading: 'Eligible Professionals', purpose: 'Chartered Accountant, Cost Accountant, or such other professional as decided by the Board; may or may not be employee.' }
    ]
  },
  {
    number: 'Section 143 (Companies Act)',
    heading: 'Powers and Duties of Auditors and Auditing Standards',
    purpose: 'Core statutory operational provisions defining auditor inquiry, reporting requirements, and mandatory fraud disclosure.',
    subsections: [
      { number: 'Sec 143(1)', heading: 'Statutory Duty of Inquiries', purpose: 'Specific inquiries on loans/advances security, book entry transactions, sale of securities below cost, deposits, personal expenses.' },
      { number: 'Sec 143(3)', heading: 'Mandatory Reporting Items', purpose: 'Reporting on accounting records, AS compliance, adverse remarks, Section 164(2) disqualifications, and IFC adequacy.' },
      { number: 'Sec 143(12)', heading: 'Reporting of Fraud to Central Govt', purpose: 'Auditor must report fraud involving ≥ ₹1 Crore by officers/employees to Central Govt within prescribed timelines in Form ADT-4.' },
      { number: 'Rule 13 CAAR', heading: 'Fraud Reporting Timelines', purpose: 'Report to Board/Audit Committee within 2 days, seek reply in 45 days, forward to CG within 15 days.' }
    ]
  },
  {
    number: 'Section 144 (Companies Act)',
    heading: 'Auditor Not to Render Certain Services',
    purpose: 'Prohibits statutory auditor from providing 8 specified services directly or indirectly to the company, holding, or subsidiary.',
    subsections: [
      { number: 'Sec 144(a)-(c)', heading: 'Accounting & Internal Audit', purpose: 'Prohibits accounting/bookkeeping, internal audit, and design/implementation of financial information systems.' },
      { number: 'Sec 144(d)-(h)', heading: 'Actuarial, Investment & Management', purpose: 'Prohibits actuarial services, investment advisory/banking services, outsourced financial services, and management services.' }
    ]
  },
  {
    number: 'Section 2(2) & 7 (CA Act, 1949)',
    heading: 'Member in Practice & Prohibition on Non-CA Designations',
    purpose: 'Defines when a Chartered Accountant is deemed to be in practice and regulates professional designations.',
    subsections: [
      { number: 'Sec 2(2)', heading: 'Member Deemed to be in Practice', purpose: 'Member rendering accountancy, auditing, verification, or certified services for remuneration.' },
      { number: 'Sec 7', heading: 'Designation as Chartered Accountant', purpose: 'No designation other than CA permitted on professional documents; letters like ACMA/FCS permitted as suffixes.' }
    ]
  },
  {
    number: 'Section 21, 21A & 21B (CA Act, 1949)',
    heading: 'Disciplinary Directorate, Board of Discipline & Disciplinary Committee',
    purpose: 'Statutory judicial mechanism governing professional and other misconduct of ICAI members.',
    subsections: [
      { number: 'Sec 21', heading: 'Disciplinary Directorate', purpose: 'Receives complaints, investigates, and forms prima facie opinion on Schedule I vs Schedule II misconduct.' },
      { number: 'Sec 21A', heading: 'Board of Discipline', purpose: 'Adjudicates First Schedule matters; reprimand, suspension up to 3 months, fine up to ₹1,00,000.' },
      { number: 'Sec 21B', heading: 'Disciplinary Committee', purpose: 'Adjudicates Second Schedule & Both Schedules matters; reprimand, permanent removal, fine up to ₹5,00,000.' }
    ]
  },
  {
    number: 'Section 27 (CA Act, 1949)',
    heading: 'Maintenance of Branch Offices by Chartered Accountants',
    purpose: 'Requires separate charge of a member for each office, with designated exceptions for proximity.',
    subsections: [
      { number: 'Sec 27(1)', heading: 'Separate Charge of Member', purpose: 'Every branch office in India must be in separate charge of a member of the Institute.' },
      { number: 'Sec 27 Exemption', heading: 'Second Office Proximity Exemption', purpose: 'Exempt from separate charge if second office is in same premises, same city, or within 50 km from municipal limits.' }
    ]
  },
  {
    number: 'Articles 148 to 151 (Constitution)',
    heading: 'Comptroller and Auditor General of India (C&AG)',
    purpose: 'Constitutional basis for Supreme Audit Institution of India and legislative reporting.',
    subsections: [
      { number: 'Article 148', heading: 'Appointment & Independence', purpose: 'Appointment by President; removal identical to Supreme Court Judge; service conditions fixed by Parliament.' },
      { number: 'Article 149', heading: 'Duties and Powers', purpose: 'Prescribes duties and powers in relation to accounts of Union and States under C&AG Act, 1971.' },
      { number: 'Article 151', heading: 'Audit Reports to Parliament', purpose: 'C&AG reports submitted to President / Governor to be laid before Parliament / State Legislatures.' }
    ]
  },
  {
    number: 'Section 45-IA (RBI Act, 1934)',
    heading: 'Registration and Net Owned Funds for NBFCs',
    purpose: 'Mandates Certificate of Registration (CoR) and minimum Net Owned Funds to carry on NBFC business.',
    subsections: [
      { number: 'Sec 45-IA(1)', heading: 'Mandatory CoR & NOF', purpose: 'No NBFC can commence business without CoR from RBI and minimum Net Owned Fund of ₹25 Lakhs to ₹100 Crores.' },
      { number: 'SBR Notification', heading: 'Enhanced NOF of ₹10 Crores', purpose: 'RBI revised minimum NOF to ₹10 Crores with phased glide path ending March 31, 2027.' }
    ]
  }
];

export const AUDIT_LIMITS_RATES: LimitRateItem[] = [
  { item: 'Section 143(12) Fraud Reporting Threshold to Central Government', limitRate: '₹1 Crore or above', remarks: 'Frauds involving ₹1 Crore or more must be reported to CG in Form ADT-4 within 15 days of receiving Board/Audit Committee reply.' },
  { item: 'Section 143(12) Fraud Reporting to Board / Audit Committee Timeline', limitRate: 'Within 2 days', remarks: 'Auditor must report matter to Board or Audit Committee within 2 days of knowledge of fraud.' },
  { item: 'Section 143(12) Board / Audit Committee Reply Timeline', limitRate: 'Within 45 days', remarks: 'Board or Audit Committee must provide their reply/observations to the auditor within 45 days.' },
  { item: 'CARO 2020 Private Company Exemption — Paid-up Capital & Reserves', limitRate: 'Not more than ₹1 Crore', remarks: 'Paid up capital and reserves/surplus must not exceed ₹1 Crore as on balance sheet date.' },
  { item: 'CARO 2020 Private Company Exemption — Total Bank/FI Borrowings', limitRate: 'Not exceeding ₹1 Crore', remarks: 'Total borrowings from banks/FIs must not exceed ₹1 Crore at any point of time during the financial year.' },
  { item: 'CARO 2020 Private Company Exemption — Total Revenue', limitRate: 'Not exceeding ₹10 Crores', remarks: 'Total revenue (including discontinuing operations) as per Schedule III must not exceed ₹10 Crores.' },
  { item: 'CARO 2020 Clause (i)(d) PPE Revaluation Disclosure Threshold', limitRate: '10% or more change', remarks: 'Must disclose if revaluation is based on Registered Valuer and change is 10% or more in aggregate net carrying value of each class.' },
  { item: 'CARO 2020 Clause (ii)(a) Inventory Discrepancy Reporting', limitRate: '10% or more in aggregate', remarks: 'Discrepancies of 10% or more in aggregate for each class of inventory noticed on physical verification must be reported.' },
  { item: 'CARO 2020 Clause (ii)(b) Working Capital Bank Limits Reporting', limitRate: 'In excess of ₹5 Crores', remarks: 'Sanctioned working capital limits in excess of ₹5 Crores from banks/FIs on security of current assets requires quarterly return reconciliation.' },
  { item: 'Internal Audit Section 138 — Unlisted Public Capital Threshold', limitRate: 'Paid-up Capital ≥ ₹50 Crores', remarks: 'Paid-up share capital of ₹50 Crores or more in the preceding financial year.' },
  { item: 'Internal Audit Section 138 — Unlisted Public / Private Turnover', limitRate: 'Turnover ≥ ₹200 Crores', remarks: 'Turnover of ₹200 Crores or more in the preceding financial year.' },
  { item: 'Internal Audit Section 138 — Outstanding Borrowings Threshold', limitRate: 'Loans > ₹100 Crores', remarks: 'Outstanding loans or borrowings from banks or public financial institutions exceeding ₹100 Crores at any point in preceding FY.' },
  { item: 'Internal Audit Section 138 — Unlisted Public Deposits Threshold', limitRate: 'Deposits > ₹25 Crores', remarks: 'Outstanding deposits exceeding ₹25 Crores at any point in preceding financial year.' },
  { item: 'NBFC Principal Business 50-50 Criteria', limitRate: '> 50% Assets & > 50% Income', remarks: 'Financial assets > 50% of total assets (net of intangibles) AND income from financial assets > 50% of gross income.' },
  { item: 'NBFC Minimum Net Owned Funds (NOF) Requirement', limitRate: '₹10 Crores (₹2 Cr Base)', remarks: '₹10 Crores by March 31, 2027; NBFC-P2P, NBFC-AA, and no-customer interface NBFCs continue at ₹2 Crores; IFC/IDF at ₹300 Crores.' },
  { item: 'NBFC Capital Risk Adequacy Ratio (CRAR)', limitRate: 'Minimum 15%', remarks: 'Minimum 15% of aggregate risk-weighted assets; Tier 1 minimum 10% (12% for gold loan NBFCs).' },
  { item: 'Commercial Bank Capital Adequacy Ratio (CRAR)', limitRate: 'Minimum 9%', remarks: 'Commercial banks must maintain a minimum CRAR of 9% on an ongoing basis under RBI norms.' },
  { item: 'Bank Audit — Reliance on Stock Statements for Drawing Power', limitRate: 'Not older than 3 months', remarks: 'Stock statements relied upon for determining Drawing Power should not be older than 3 months, else account deemed irregular.' },
  { item: 'Bank Audit — Ad-hoc Limit Review Deadline before NPA', limitRate: 'Within 180 days', remarks: 'Accounts where regular or ad-hoc limits are not reviewed within 180 days from due date of ad-hoc sanction must be classified as NPA.' },
  { item: 'Bank Audit — Submission of Consolidated LFAR', limitRate: 'Within 60 days', remarks: 'Consolidated LFAR submitted to Audit Committee of Board (ACB) and forwarded to RBI within 60 days.' },
  { item: 'Tax Audit Assignments Limit u/s 44AB (Council Guidelines)', limitRate: '60 audits / partner / FY', remarks: 'Maximum 60 tax audit assignments per partner in a FY; audits u/s 44AD, 44ADA, and 44AE are excluded from this limit.' },
  { item: 'Company Audit Assignments Limit u/s 141 (Council Guidelines)', limitRate: '30 company audits / partner', remarks: 'Maximum 30 company audit assignments per partner at any point; OPCs and dormant companies are excluded.' },
  { item: 'Auditor Indebtedness Limit (Council General Guidelines)', limitRate: 'Exceeding ₹1,00,000', remarks: 'Cannot accept audit if member, partner, firm, or relative is indebted or has given guarantee for amount exceeding ₹1,00,000.' },
  { item: 'Branch Office Proximity Exemption (Section 27)', limitRate: 'Within 50 km of municipal limits', remarks: 'Second office within 50 km of municipal limits does not require separate member in charge.' },
  { item: 'NOCLAR Mandatory Applicability Threshold in India', limitRate: 'Net Worth ≥ ₹250 Crores', remarks: 'Section 360 applies to audit of listed entities with net worth of ₹250 Crores or more.' },
  { item: 'SEBI Circular on Resignation of Auditor — Within 45 days', limitRate: 'Issue report for that quarter', remarks: 'If resignation proposed within 45 days from quarter end, auditor must issue audit/limited review for that quarter before resigning.' },
  { item: 'SEBI Circular on Resignation of Auditor — After 45 days', limitRate: 'Current + Next quarter reports', remarks: 'If resignation proposed after 45 days, auditor must issue reports for current quarter and the next quarter.' },
  { item: 'Disciplinary Penalties — Board of Discipline (First Schedule)', limitRate: 'Max ₹1 Lakh / 3 months suspension', remarks: 'Reprimand; remove member name up to 3 months; fine up to ₹1,00,000.' },
  { item: 'Disciplinary Penalties — Disciplinary Committee (Second Schedule)', limitRate: 'Max ₹5 Lakhs / Permanent removal', remarks: 'Reprimand; remove member name permanently or for any duration; fine up to ₹5,00,000.' }
];
