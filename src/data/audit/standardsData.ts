/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL ADVANCED AUDITING: COMPREHENSIVE REPOSITORY OF STANDARDS ON AUDITING (SAs)
 * AND PROFESSIONAL ETHICS STATUTORY SCHEDULES (THE CHARTERED ACCOUNTANTS ACT, 1949)
 * Grounded directly in ICAI Saransh and Official Study Materials.
 */

export interface StandardOnAuditing {
  code: string;
  category: string;
  series: string;
  title: string;
  scope: string;
  keyProvisions: string[];
  examFocus: string;
}

export interface EthicsClause {
  clauseNumber: number;
  part: string;
  schedule: "First Schedule" | "Second Schedule";
  targetGroup: string;
  title: string;
  statutoryRule: string;
  permittedExceptions: string[];
  prohibitedActs: string[];
  icaiExamFocus: string;
}

export interface DisciplinaryAuthority {
  forum: string;
  constitution: string;
  mattersDealtWith: string;
  penalPowers: string[];
  appealProvision: string;
}

export interface CouncilGuidelineItem {
  subject: string;
  statutoryLimitOrCondition: string;
  icaiReference: string;
  keyTakeaway: string;
}

export interface CaroClauseItem {
  clauseNo: string;
  title: string;
  keyAuditVerification: string;
}

export const STANDARDS_ON_AUDITING: StandardOnAuditing[] = [
  {
    "code": "SQC 1",
    "category": "Quality Control",
    "series": "SQC",
    "title": "Quality Control for Firms that Perform Audits and Reviews of Historical Financial Information, and Other Assurance and Related Services Engagements",
    "scope": "Applies to all CA firms for all engagements (audits, reviews, assurance, related services). Establishes firm-level responsibilities for a robust system of quality control.",
    "keyProvisions": [
      "Leadership Responsibilities: CEO/Managing Partner assumes ultimate responsibility; quality culture prioritized over commercial profitability.",
      "Ethical Requirements: Integrity, Objectivity, Professional Competence & Due Care, Confidentiality, Professional Behaviour; mandatory annual written independence confirmations.",
      "Acceptance & Continuance: Integrity of client management, firm competence/time/resources, compliance with ethical requirements, prior auditor communication.",
      "Human Resources: Recruitment, CPD, performance appraisal, capabilities, and assignment of engagement teams.",
      "Engagement Performance: Supervision, review, consultation on contentious matters, resolving differences of opinion.",
      "Engagement Quality Control Review (EQCR): Mandatory for all listed entity audits; review must be completed BEFORE the audit report is issued.",
      "Assembly & Retention: Final file assembly within 60 days of audit report date; minimum retention period of 7 years from report date."
    ],
    "examFocus": "EQCR sign-off timing, working paper retention (7 years), 60-day assembly, annual independence confirmations, and partner rotation."
  },
  {
    "code": "SA 200",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Overall Objectives of the Independent Auditor and the Conduct of an Audit in Accordance with Standards on Auditing",
    "scope": "Sets overarching objectives, reasonable assurance concept, professional skepticism, and professional judgment for financial statement audits.",
    "keyProvisions": [
      "Overall Objectives: Obtain reasonable assurance that financial statements as a whole are free from material misstatement (fraud/error); express an opinion and report in accordance with SAs.",
      "Reasonable Assurance: High, but not absolute, level of assurance due to inherent limitations of an audit.",
      "Inherent Limitations: Nature of financial reporting (estimates), nature of audit procedures (collusion, non-disclosure), balance between benefit and cost (timeliness/practical constraints).",
      "Professional Skepticism: Questioning mind, alert to conditions indicating possible misstatement, critical assessment of audit evidence.",
      "Professional Judgment: Application of training, knowledge and experience in making informed decisions about audit procedures and evidence."
    ],
    "examFocus": "Reasonable assurance vs absolute assurance, inherent limitations of audit, distinction between skepticism and judgment."
  },
  {
    "code": "SA 210",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Agreeing the Terms of Audit Engagements",
    "scope": "Preconditions for an audit, audit engagement letter contents, recurring audits, and acceptance of changes in engagement terms.",
    "keyProvisions": [
      "Preconditions for Audit: Determine acceptability of financial reporting framework (FRF); obtain management agreement acknowledging premise of audit (preparation of FS, internal control, unrestricted access/information).",
      "Engagement Letter Contents: Objective and scope, responsibilities of auditor, responsibilities of management, identification of applicable FRF, expected form and content of reports.",
      "Recurring Audits: Auditor evaluates whether circumstances require revision in terms or reminding entity of existing terms.",
      "Change in Terms: Auditor shall not agree to change terms where there is no reasonable justification. If unable to agree and prohibited from continuing, withdraw and determine reporting duties."
    ],
    "examFocus": "Preconditions verification, reasons to revise engagement letter in recurring audits, management requests for lower assurance (audit to review)."
  },
  {
    "code": "SA 220",
    "category": "Quality Control",
    "series": "200 Series",
    "title": "Quality Control for an Audit of Financial Statements",
    "scope": "Specific responsibilities of the engagement partner regarding quality control procedures at the individual audit engagement level.",
    "keyProvisions": [
      "Leadership: Engagement partner takes responsibility for overall quality on each audit engagement.",
      "Relevant Ethical Requirements: Partner remains alert to non-compliance by engagement team members; takes appropriate action regarding independence.",
      "Acceptance/Continuance: Partner satisfies that appropriate procedures have been followed and conclusions are appropriate.",
      "Assignment of Teams: Partner ensures team possesses appropriate competence, capabilities, and time.",
      "Direction, Supervision & Performance: Review work of team members; ensure consultations on difficult or contentious matters.",
      "EQCR: Partner must not issue report until EQCR is completed; discuss significant findings with EQCR reviewer."
    ],
    "examFocus": "Responsibilities of engagement partner vs firm, EQCR duties before report issuance, difference of opinion resolution."
  },
  {
    "code": "SA 230",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Audit Documentation",
    "scope": "Auditor's responsibility to prepare documentation for an audit of financial statements ('working papers').",
    "keyProvisions": [
      "Form, Content & Extent: Sufficient to enable an experienced auditor, having no previous connection, to understand NTE of procedures, results/evidence, and significant matters.",
      "Assembly of Final File: Administrative process not involving new procedures; completed within 60 days after the date of the auditor's report.",
      "Retention Period: Firm shall retain audit documentation for at least 7 years from the date of the auditor's report.",
      "Ownership & Confidentiality: Working papers are the property of the auditor (SQC 1); confidential under Clause 1 Part I First Schedule, subject to legal/regulatory production.",
      "Documentation of Departure: If departing from a relevant requirement in an SA, document reason and alternative procedures."
    ],
    "examFocus": "Assembly within 60 days, retention for 7 years, ownership of working papers, experienced auditor test, departure documentation."
  },
  {
    "code": "SA 240",
    "category": "General Principles",
    "series": "200 Series",
    "title": "The Auditor's Responsibilities Relating to Fraud in an Audit of Financial Statements",
    "scope": "Responsibilities relating to fraud, fraud risk factors, management override of controls, and statutory fraud reporting.",
    "keyProvisions": [
      "Two Types of Intentional Misstatement: Fraudulent financial reporting (falsification, misrepresentation, intentional misapplication) and Misappropriation of assets (theft, embezzlement).",
      "Fraud Risk Triangle: Incentive/Pressure, Opportunity, and Rationalization/Attitude.",
      "Mandatory Procedures for Management Override: Test journal entries across period-end, review accounting estimates for bias (retrospective review), evaluate business rationale of significant unusual transactions.",
      "Reporting to TCWG & Regulators: Report all identified/suspected frauds to management/TCWG; statutory duty under Section 143(12) of Companies Act to report fraud >= \u20b91 Crore to Central Govt in Form ADT-4 within 60 days."
    ],
    "examFocus": "Three mandatory management override tests, Section 143(12) 2-day/45-day/15-day reporting sequence, fraud risk indicators."
  },
  {
    "code": "SA 250",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Consideration of Laws and Regulations in an Audit of Financial Statements",
    "scope": "Auditor's responsibility to consider laws and regulations in an audit of financial statements.",
    "keyProvisions": [
      "Two Categories of Laws: (1) Direct effect on FS amounts and disclosures (tax laws, pension laws); (2) Indirect effect fundamental to operating aspects (licensing, environmental, pollution control, safety).",
      "Auditor's Procedures: Direct laws: obtain sufficient appropriate audit evidence. Indirect laws: inquire of management and inspect correspondence with licensing authorities.",
      "Non-Compliance Identified: Understand nature of act, evaluate financial statement implications, discuss with management/TCWG.",
      "Reporting: Report to TCWG; modify opinion if material effect not reflected; evaluate disclosure to regulatory authorities (NOCLAR framework for listed entities)."
    ],
    "examFocus": "Direct vs indirect laws, auditor duties when non-compliance suspected, NOCLAR escalation hierarchy."
  },
  {
    "code": "SA 260 (Revised)",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Communication with Those Charged with Governance",
    "scope": "Auditor's responsibility to communicate with those charged with governance (TCWG) in an audit.",
    "keyProvisions": [
      "Matters to Communicate: Auditor's responsibilities under SAs, planned scope and timing of audit, significant findings (accounting policies, estimates, disclosures), auditor independence (for listed entities).",
      "Communication Process: Establish clear communication channels; oral or written form (significant findings must be in writing if oral deemed inappropriate).",
      "Adequacy Evaluation: Auditor evaluates whether two-way communication between auditor and TCWG has been adequate; if inadequate, consider implications for opinion."
    ],
    "examFocus": "Mandatory written communication on independence for listed entities, communication of significant audit difficulties."
  },
  {
    "code": "SA 265",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Communicating Deficiencies in Internal Control to Those Charged with Governance and Management",
    "scope": "Auditor's responsibility to communicate appropriately to TCWG and management deficiencies in internal control identified in the audit.",
    "keyProvisions": [
      "Significant Deficiency: Deficiency or combination that, in auditor's professional judgment, is of sufficient importance to merit attention of TCWG.",
      "Communication Mandate: Communicate significant deficiencies in writing to TCWG on a timely basis; communicate other deficiencies of sufficient importance to management.",
      "Written Communication Content: Description of deficiencies, explanation of potential effects, contextual disclaimer that audit was not designed to express opinion on internal control."
    ],
    "examFocus": "Mandatory written communication of significant deficiencies to TCWG, indicator examples of significant deficiencies."
  },
  {
    "code": "SA 299 (Revised)",
    "category": "General Principles",
    "series": "200 Series",
    "title": "Joint Audit of Financial Statements",
    "scope": "Division of work, joint and several liability, coordination, and reporting by joint auditors.",
    "keyProvisions": [
      "Division of Work: Joint auditors allocate audit work based on mutual agreement (by business units, functions, assets/liabilities); documented in work allocation plan.",
      "Individual Responsibility: Each joint auditor is solely responsible for audit procedures performed on work allocated to them.",
      "Joint and Several Liability: Work not divided; decisions taken jointly; compliance with disclosure requirements of FRF; compliance with statutory reporting formats; ensuring audit report complies with SAs.",
      "Reporting & Disagreement: Joint auditors usually issue a joint report. If disagreement on opinion, each joint auditor expresses own opinion through separate report; no majority rule; cross-refer other report in Other Matter paragraph."
    ],
    "examFocus": "Five grounds of joint & several liability, procedure when joint auditors disagree on opinion (separate reports, OM paragraph)."
  },
  {
    "code": "SA 300",
    "category": "Planning & Risk",
    "series": "300 Series",
    "title": "Planning an Audit of Financial Statements",
    "scope": "Auditor's responsibility to plan an audit of financial statements; overall audit strategy and audit plan.",
    "keyProvisions": [
      "Overall Audit Strategy: Sets scope, timing, and direction of audit; guides development of more detailed audit plan; resources allocation.",
      "Audit Plan: Detailed procedures; covers NTE of risk assessment procedures (SA 315), NTE of further audit procedures (SA 330), and other planned procedures.",
      "Continuous & Dynamic Process: Planning is not a discrete phase; updated and changed as necessary during audit upon new information.",
      "Direction & Supervision: Plan the NTE of direction and supervision of engagement team members and review of their work."
    ],
    "examFocus": "Strategy vs Plan distinction, contents of detailed audit plan, reasons to update audit strategy dynamically."
  },
  {
    "code": "SA 315",
    "category": "Planning & Risk",
    "series": "300 Series",
    "title": "Identifying and Assessing the Risks of Material Misstatement Through Understanding the Entity and Its Environment",
    "scope": "Auditor's responsibility to identify and assess risks of material misstatement at financial statement and assertion levels.",
    "keyProvisions": [
      "Five Components of Internal Control: (1) Control Environment, (2) Entity's Risk Assessment Process, (3) Information System & Business Processes, (4) Control Activities, (5) Monitoring of Controls.",
      "Risk Assessment Procedures: Inquiries, analytical procedures, observation, and inspection.",
      "Significant Risks: Identified and assessed risks that require special audit consideration (fraud risk, complex transactions, related party transactions, significant estimation subjectivity).",
      "IT Environment Understanding: General IT Controls (GITCs) and Automated Application Controls."
    ],
    "examFocus": "5 components of internal control, evaluation of control environment, criteria designating a significant risk."
  },
  {
    "code": "SA 320",
    "category": "Planning & Risk",
    "series": "300 Series",
    "title": "Materiality in Planning and Performing an Audit",
    "scope": "Concept of materiality in planning and performing audit, performance materiality, and revision during audit.",
    "keyProvisions": [
      "Materiality: Misstatements, including omissions, considered material if they, individually or in aggregate, could reasonably influence economic decisions of users.",
      "Determining Materiality: Benchmark selection (PBT, total revenue, gross profit, total equity, net assets) applied with percentage.",
      "Performance Materiality: Amount set below materiality for FS as a whole to reduce to appropriately low level the probability that aggregate uncorrected/undetected misstatements exceed FS materiality.",
      "Revision as Audit Progresses: Materiality must be revised if auditor becomes aware of information that would have caused determining different amount initially."
    ],
    "examFocus": "Performance materiality purpose and computation, benchmark criteria, downward revision of materiality implications."
  },
  {
    "code": "SA 330",
    "category": "Planning & Risk",
    "series": "300 Series",
    "title": "The Auditor's Responses to Assessed Risks",
    "scope": "Designing and implementing responses to assessed risks of material misstatement at financial statement and assertion levels.",
    "keyProvisions": [
      "Overall Responses: Emphasizing professional skepticism, assigning more experienced staff/experts, providing more supervision, incorporating unpredictability.",
      "Tests of Controls (ToC): Mandatory when risk assessment anticipates operating effectiveness, or when substantive procedures alone cannot provide sufficient appropriate evidence (highly automated systems).",
      "Rotational Testing of Controls: Must test controls once every 3 years; must test in current year if significant risk or if control has changed.",
      "Substantive Procedures: Irrespective of assessed risks, auditor must perform substantive procedures for each material class of transactions, account balance, and disclosure."
    ],
    "examFocus": "Mandatory ToC situations, 3-year rotational testing rules and exceptions, dual-purpose tests."
  },
  {
    "code": "SA 402",
    "category": "Planning & Risk",
    "series": "400 Series",
    "title": "Audit Considerations Relating to an Entity Using a Service Organisation",
    "scope": "User auditor's responsibilities when an entity uses the services of one or more service organisations.",
    "keyProvisions": [
      "Understanding Services: Understand nature of services provided, terms of contract, interaction between user entity and service org controls.",
      "Type 1 Report: Report on description and design of controls at a service organization at a specific date.",
      "Type 2 Report: Report on description, design AND operating effectiveness of controls throughout a specified period (minimum 6 months).",
      "Auditor's Report: User auditor shall NOT refer to service auditor's report in an unmodified audit report. Reference allowed only if required by law or to explain modification."
    ],
    "examFocus": "Type 1 vs Type 2 report differences, use of Type 2 report as audit evidence, prohibition of reference in unmodified report."
  },
  {
    "code": "SA 450",
    "category": "Planning & Risk",
    "series": "400 Series",
    "title": "Evaluation of Misstatements Identified During the Audit",
    "scope": "Evaluating the effect of identified misstatements on the audit and of uncorrected misstatements on financial statements.",
    "keyProvisions": [
      "Accumulation of Misstatements: Accumulate all misstatements other than those clearly trivial.",
      "Communication to Management: Timely communicate all accumulated misstatements to appropriate level; request management to correct them.",
      "Uncorrected Misstatements: Reassess materiality; determine whether uncorrected misstatements are material, individually or in aggregate.",
      "Written Representations: Obtain representation from management/TCWG that uncorrected misstatements are immaterial, both individually and in aggregate."
    ],
    "examFocus": "Clearly trivial threshold vs materiality, management refusal to correct misstatements, written representation requirements."
  },
  {
    "code": "SA 500",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Audit Evidence",
    "scope": "What constitutes audit evidence, sufficiency and appropriateness, and procedures to obtain evidence.",
    "keyProvisions": [
      "Sufficiency & Appropriateness: Sufficiency measures quantity (affected by RMM and quality); Appropriateness measures quality (relevance and reliability).",
      "Reliability Hierarchy: External > Internal; Direct auditor observation > Indirect/Inquiry; Documentary > Oral; Original documents > Photocopies/faxes.",
      "Methods to Obtain Evidence: Inspection, Observation, External Confirmation, Recalculation, Reperformance, Analytical Procedures, Inquiry.",
      "Information Produced by Entity (IPE): Test accuracy and completeness of system-generated data."
    ],
    "examFocus": "Reliability hierarchy rules, testing of management expert information, verification of IPE."
  },
  {
    "code": "SA 501",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Audit Evidence - Specific Considerations for Selected Items",
    "scope": "Specific considerations regarding inventory existence and condition, litigation and claims, and segment information.",
    "keyProvisions": [
      "Inventory Physical Count: If material, auditor must attend physical inventory counting unless impracticable.",
      "Impracticability: General difficulty/time/expense is NOT valid excuse; must perform alternative procedures (inspect subsequent sales).",
      "Inventory with Third Party: Request confirmation from third party or perform inspection/attend count.",
      "Litigation & Claims: Direct communication with entity's external legal counsel via inquiry letter prepared by management and sent by auditor.",
      "Management Refusal / Lawyer Non-response: Modify audit report (qualified or disclaimer) due to scope limitation."
    ],
    "examFocus": "Impracticability vs inconvenience in count attendance, procedures for third-party inventory, direct lawyer inquiry letter."
  },
  {
    "code": "SA 505",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "External Confirmations",
    "scope": "Auditor's use of external confirmation procedures to obtain audit evidence in accordance with SA 330 and SA 500.",
    "keyProvisions": [
      "Positive vs Negative Confirmation: Positive requests response in all cases; Negative requests response ONLY if disagreeing (less persuasive).",
      "Conditions for Negative Confirmation: (1) Low RMM, (2) Large population of small balances, (3) Very low exception rate expected, (4) No reason to believe recipients will disregard.",
      "Management Refusal to Allow Confirmation: Inquire reasons; evaluate validity; evaluate implications on RMM and fraud risk; perform alternative procedures.",
      "Refusal Unreasonable or No Alternative Evidence: Communicate to TCWG and determine implications for audit opinion (Scope limitation)."
    ],
    "examFocus": "Management refusal handling sequence, four strict criteria for negative confirmations, electronic confirmation verification."
  },
  {
    "code": "SA 510",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Initial Audit Engagements - Opening Balances",
    "scope": "Auditor's responsibilities relating to opening balances in an initial audit engagement (prior year unaudited or audited by predecessor).",
    "keyProvisions": [
      "Objective: Obtain evidence that opening balances do not contain misstatements materially affecting current period, and accounting policies consistently applied.",
      "Procedures: Read most recent FS and predecessor auditor's report; evaluate whether prior closing balances correctly brought forward; review predecessor working papers (if permitted).",
      "Audit Report Implications: If unable to obtain sufficient appropriate evidence regarding opening balances -> Qualified or Disclaimer of Opinion.",
      "Misstatement in Opening Balances: If misstatement exists and not corrected/disclosed -> Qualified or Adverse Opinion."
    ],
    "examFocus": "Reporting options for unverified opening balances, consistency of accounting policies, predecessor auditor coordination."
  },
  {
    "code": "SA 520",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Analytical Procedures",
    "scope": "Auditor's use of analytical procedures as substantive procedures ('substantive analytical procedures') and at overall review stage.",
    "keyProvisions": [
      "Substantive Analytical Procedures: Evaluations of financial information through analysis of plausible relationships among financial and non-financial data.",
      "Four Factors for Reliance: (1) Suitability of analytical procedures for assertions, (2) Reliability of data, (3) Precision of expectation developed, (4) Acceptable difference threshold.",
      "Investigation of Differences: Inquire of management and obtain corroborative audit evidence; perform other audit procedures.",
      "Mandatory Stage: Analytical procedures are MANDATORY near the end of the audit to form an overall conclusion on consistency of FS."
    ],
    "examFocus": "Substantive analytical testing factors, investigation of unusual fluctuations, mandatory end-of-audit analytical review."
  },
  {
    "code": "SA 530",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Audit Sampling",
    "scope": "Auditor's use of statistical and non-statistical sampling when designing and selecting the audit sample, and evaluating results.",
    "keyProvisions": [
      "Sampling Risk: Risk that auditor's conclusion based on a sample may differ from conclusion if entire population were tested.",
      "Two Types of Sampling Risk: Risk of under-reliance/incorrect rejection (affects efficiency); Risk of over-reliance/incorrect acceptance (affects effectiveness - leads to wrong opinion).",
      "Sample Selection Methods: Random sampling, Systematic selection, Monetary Unit Sampling (MUS), Haphazard selection, Block selection (rarely appropriate).",
      "Projecting Misstatements: Auditor must project monetary misstatements found in sample to the population."
    ],
    "examFocus": "Sampling risk vs non-sampling risk, evaluation of sample deviation rates, projection of misstatement."
  },
  {
    "code": "SA 540 (Revised)",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Auditing Accounting Estimates and Related Disclosures",
    "scope": "Auditor's responsibilities relating to accounting estimates, including fair value estimates and related disclosures in an audit.",
    "keyProvisions": [
      "Estimation Uncertainty: Susceptibility of an accounting estimate to an inherent lack of precision in its measurement.",
      "Retrospective Review: Review outcome of previous period estimates to evaluate effectiveness of management's estimation process and identify management bias.",
      "Auditor's Responses: Test how management made estimate and data used; test operating effectiveness of controls; develop independent point estimate or range.",
      "Indicators of Management Bias: Subjective changes in estimation methodology, selecting favorable assumptions within range."
    ],
    "examFocus": "Retrospective review of prior year estimates, indicators of management bias, testing assumptions and models."
  },
  {
    "code": "SA 550",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Related Parties",
    "scope": "Auditor's responsibilities regarding related party relationships and transactions in an audit of financial statements.",
    "keyProvisions": [
      "Inherent Risk: Related parties operate through complex structures; controls may be ineffective or bypassed; transactions may lack business rationale.",
      "Procedures: Inquire of management regarding identity, changes, nature of relationships, and transactions; inspect bank/legal confirmations, shareholder minutes, contracts.",
      "Undisclosed Related Parties Identified: Promptly communicate to engagement team; request management to identify all transactions; inquire why controls failed; perform substantive procedures; reconsider fraud risk.",
      "Arm's Length Claims: If management asserts transactions were at arm's length, auditor must obtain sufficient evidence supporting the assertion."
    ],
    "examFocus": "Action protocol on discovering undisclosed related party, arm's length claim verification, significant transactions outside normal course."
  },
  {
    "code": "SA 560",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Subsequent Events",
    "scope": "Auditor's responsibilities relating to subsequent events (events between date of FS and date of auditor's report, and facts discovered after report).",
    "keyProvisions": [
      "Two Types of Events (Ind AS 10 / AS 4): Adjusting events (conditions existed at balance sheet date); Non-adjusting events (conditions arose subsequent to balance sheet date - disclose only).",
      "Procedures up to Report Date: Inquire management, inspect latest interim statements, inspect minutes of meetings, read subsequent budgets/forecasts.",
      "Facts Known After Report Date but Before Issue: Discuss with management; determine whether FS need amendment. If amended, issue new report or dual date. If management refuses, notify TCWG and take steps to prevent reliance.",
      "Facts Known After Financial Statements Issued: Inquire management; if amended, review management steps to inform recipients; issue new report with EoM/OM."
    ],
    "examFocus": "Adjusting vs non-adjusting classification, auditor action when management refuses amendment before and after issuance, dual dating."
  },
  {
    "code": "SA 570 (Revised)",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Going Concern",
    "scope": "Auditor's responsibilities regarding going concern assumption and disclosures in the audit of financial statements.",
    "keyProvisions": [
      "Management Assessment Period: Management must assess going concern for at least 12 months from the balance sheet date.",
      "Events/Conditions: Financial (negative net worth, debt default), Operating (loss of key management/market/license), Other (litigation, statutory changes).",
      "Appropriate but Material Uncertainty Exists & Adequately Disclosed: Unmodified opinion with a separate 'Material Uncertainty Related to Going Concern' (MURGC) paragraph.",
      "Material Uncertainty Exists but Inadequately Disclosed: Qualified or Adverse Opinion (stating clearly in Basis paragraph that material uncertainty exists and is not disclosed).",
      "Inappropriate Going Concern Assumption: Adverse Opinion (even if fully disclosed in financial statement notes)."
    ],
    "examFocus": "Decision matrix: Adequate disclosure = MURGC paragraph; Inadequate disclosure = Qualified/Adverse; Inappropriate basis = Adverse opinion."
  },
  {
    "code": "SA 580",
    "category": "Audit Evidence",
    "series": "500 Series",
    "title": "Written Representations",
    "scope": "Auditor's responsibility to obtain written representations from management and TCWG in an audit.",
    "keyProvisions": [
      "Nature of Written Representations: Necessary audit evidence, but do NOT provide sufficient appropriate evidence on their own about any matter.",
      "Date and Period: Date shall be as near as practicable to, but NOT after, the date of the auditor's report.",
      "Mandatory Representations: Preparation of FS according to FRF, all information and access provided, all transactions recorded, uncorrected misstatements immaterial.",
      "Refusal to Provide: If management refuses to provide representation on basic responsibilities -> Disclaimer of Opinion. On specific assertion -> evaluate effect and consider Qualified or Disclaimer."
    ],
    "examFocus": "Written representation is corroborative not primary, date matching report date, consequence of refusal (disclaimer of opinion)."
  },
  {
    "code": "SA 600",
    "category": "Using Work of Others",
    "series": "600 Series",
    "title": "Using the Work of Another Auditor",
    "scope": "Principal auditor's responsibilities when using work of another auditor regarding financial information of components (branches, subsidiaries, JVs).",
    "keyProvisions": [
      "Principal Auditor Rights: Visit component, examine books if necessary, require other auditor to answer questionnaires.",
      "Division of Responsibility: Principal auditor is entitled to rely on other auditor's work; not responsible for component auditor's work unless reasons for suspicion.",
      "Documentation: Document components audited by others, names of auditors, materiality of components, procedures performed.",
      "Reporting & Disclosure: Expressly disclose in Other Matter (OM) paragraph the division of responsibility, stating extent of assets/revenues audited by component auditors."
    ],
    "examFocus": "Division of responsibility disclosure in Other Matter paragraph, questionnaire review, right to visit components."
  },
  {
    "code": "SA 610 (Revised)",
    "category": "Using Work of Others",
    "series": "600 Series",
    "title": "Using the Work of Internal Auditors",
    "scope": "External auditor's evaluation and use of internal audit function's work, and direct assistance from internal auditors.",
    "keyProvisions": [
      "Three Criteria to Use Work: (1) Objectivity of internal audit function (reporting line), (2) Level of competence, (3) Systematic and disciplined approach (quality control).",
      "Prohibition on Direct Assistance in India: Under ICAI Council decision, statutory auditors in India are PROHIBITED from using internal auditors to provide direct assistance.",
      "Areas where Internal Work CANNOT be Used: Involving significant judgment, high assessed RMM/fraud risk, decisions on materiality, reporting."
    ],
    "examFocus": "3 evaluation criteria, absolute prohibition of direct assistance in India, areas requiring external auditor's exclusive judgment."
  },
  {
    "code": "SA 620",
    "category": "Using Work of Others",
    "series": "600 Series",
    "title": "Using the Work of an Auditor's Expert",
    "scope": "Using work of an individual or organization possessing expertise in a field other than accounting or auditing.",
    "keyProvisions": [
      "Auditor's Expert vs Management's Expert: Auditor's expert is engaged by auditor to assist auditor (governed by SA 620). Management's expert is used by management to prepare FS (governed by SA 500).",
      "Evaluating Competence & Objectivity: Evaluate competence, capabilities, and objectivity (inquire about financial interests, relationships).",
      "Agreement: Scope of work, roles and responsibilities, confidentiality, communication.",
      "Reference in Report: Auditor shall NOT refer to auditor's expert in an unmodified report. Permitted only in modified report if relevant to explain modification, with consent."
    ],
    "examFocus": "SA 620 vs SA 500 distinction, objectivity evaluation, strict prohibition of reference in unmodified report."
  },
  {
    "code": "SA 700 (Revised)",
    "category": "Reporting",
    "series": "700 Series",
    "title": "Forming an Opinion and Reporting on Financial Statements",
    "scope": "Forming an opinion on financial statements, form and content of auditor's report issued as a result of an audit.",
    "keyProvisions": [
      "Standard Report Structure: (1) Title ('Independent Auditor's Report'), (2) Addressee, (3) Opinion Section, (4) Basis for Opinion, (5) Going Concern / MURGC (if applicable), (6) Key Audit Matters (listed entities), (7) Responsibilities of Management & TCWG, (8) Auditor's Responsibilities, (9) Other Reporting Responsibilities (e.g., 143(3), CARO), (10) Signature, Place, Date, UDIN.",
      "Opinion First: Under Revised SA 700, Opinion paragraph appears FIRST, immediately followed by Basis for Opinion.",
      "True and Fair View: Conclude whether FS are prepared, in all material respects, in accordance with applicable FRF."
    ],
    "examFocus": "Order of report sections under Revised SA 700, contents of Basis for Opinion, UDIN mandate."
  },
  {
    "code": "SA 701",
    "category": "Reporting",
    "series": "700 Series",
    "title": "Communicating Key Audit Matters in the Independent Auditor's Report",
    "scope": "Auditor's responsibility to communicate key audit matters (KAM) in the auditor's report for audits of listed entities.",
    "keyProvisions": [
      "Definition of KAM: Those matters that, in the auditor's professional judgment, were of most significance in the audit of financial statements of the current period.",
      "Selection Funnel: Matters communicated with TCWG -> Matters that required significant auditor attention -> Key Audit Matters.",
      "Core Determination Factors: Areas of higher assessed RMM or significant risks (SA 315); Significant auditor judgments relating to accounting estimates (SA 540); Effect of significant events or transactions.",
      "Prohibitions: KAM is NOT a substitute for: (1) Financial statement disclosures, (2) Modified opinion under SA 705, (3) Going concern reporting under SA 570, or (4) A separate opinion on individual matters.",
      "Disclaimer of Opinion: Communicating KAM is PROHIBITED when the auditor disclaims an opinion on the financial statements."
    ],
    "examFocus": "3-stage determination funnel, 4 prohibitions/substitute bans, KAM prohibited in Disclaimer of Opinion."
  },
  {
    "code": "SA 705 (Revised)",
    "category": "Reporting",
    "series": "700 Series",
    "title": "Modifications to the Opinion in the Independent Auditor's Report",
    "scope": "Types of modified opinions: Qualified Opinion, Adverse Opinion, and Disclaimer of Opinion.",
    "keyProvisions": [
      "Two Driving Factors: Nature of matter (Material Misstatement vs Inability to Obtain Evidence) and Pervasiveness (Material but Not Pervasive vs Material and Pervasive).",
      "Decision Matrix: Misstatement + Not Pervasive = QUALIFIED; Misstatement + Pervasive = ADVERSE; Scope Limitation + Not Pervasive = QUALIFIED; Scope Limitation + Pervasive = DISCLAIMER.",
      "Definition of Pervasive: Not confined to specific elements; represents substantial proportion of FS; or fundamental to users' understanding.",
      "Basis for Modification: Amend heading to 'Basis for Qualified/Adverse/Disclaimer of Opinion'; state specific reasons and quantified financial effect."
    ],
    "examFocus": "2x2 decision matrix, definition of pervasive, drafting Basis for Modification section."
  },
  {
    "code": "SA 706 (Revised)",
    "category": "Reporting",
    "series": "700 Series",
    "title": "Emphasis of Matter Paragraphs and Other Matter Paragraphs in the Independent Auditor's Report",
    "scope": "Additional communication in auditor's report when deemed necessary: Emphasis of Matter (EoM) and Other Matter (OM).",
    "keyProvisions": [
      "Emphasis of Matter (EoM): Refers to a matter appropriately presented or disclosed in FS that, in auditor's judgment, is fundamental to users' understanding (e.g., exceptional litigation, early adoption of new standard, major catastrophe).",
      "EoM Rules: Clear reference to specific note in FS; explicitly state opinion is NOT modified in respect of the matter; must NOT be a substitute for KAM or modified opinion.",
      "Other Matter (OM): Refers to a matter other than those presented or disclosed in FS that is relevant to users' understanding of audit, auditor's responsibilities, or report (e.g., prior period audited by predecessor, joint audit division of responsibility)."
    ],
    "examFocus": "EoM vs OM distinction, mandatory inclusion rules, EoM cannot substitute for KAM or qualification."
  },
  {
    "code": "SA 710",
    "category": "Reporting",
    "series": "700 Series",
    "title": "Comparative Information - Corresponding Figures and Comparative Financial Statements",
    "scope": "Auditor's responsibilities relating to comparative information in an audit of financial statements.",
    "keyProvisions": [
      "Corresponding Figures: Integral part of current period FS, read only in relation to current period amounts. Auditor's opinion refers only to current period (standard Indian framework).",
      "Comparative Financial Statements: Prior period amounts included for comparison; auditor's opinion refers to EACH period presented.",
      "Reporting on Corresponding Figures: Opinion does not mention corresponding figures except if: prior period report was modified and unresolved; prior period unaudited; prior period audited by predecessor auditor (OM paragraph)."
    ],
    "examFocus": "Corresponding Figures vs Comparative FS, reporting when prior year auditor was different or unaudited."
  },
  {
    "code": "SA 720 (Revised)",
    "category": "Reporting",
    "series": "700 Series",
    "title": "The Auditor's Responsibilities Relating to Other Information",
    "scope": "Auditor's responsibilities relating to other information (financial and non-financial) included in an entity's annual report.",
    "keyProvisions": [
      "Other Information: Financial or non-financial information (other than FS and auditor's report) included in entity's annual report (e.g., Board's Report, MD&A).",
      "Auditor's Duty: Read other information to identify material inconsistencies between other information and FS, or between other information and auditor's knowledge.",
      "Material Inconsistency Identified: If other information contains uncorrected misstatement -> request management; if uncorrected, communicate to TCWG and include in Other Information section of report.",
      "Separate Section: Dedicated 'Other Information' section mandatory in all audit reports of listed entities."
    ],
    "examFocus": "Scope of other information, auditor's reading and consistency duty, mandatory Other Information section."
  },
  {
    "code": "SA 800",
    "category": "Specialised Standards",
    "series": "800 Series",
    "title": "Special Considerations - Audits of Financial Statements Prepared in Accordance with Special Purpose Frameworks",
    "scope": "Audits of financial statements prepared in accordance with special purpose frameworks (cash basis, tax basis, regulatory basis).",
    "keyProvisions": [
      "Special Purpose Framework: Financial reporting framework designed to meet financial information needs of specific users.",
      "Acceptability: Understand purpose of FS, intended users, and steps taken by management to determine framework is acceptable.",
      "Auditor's Report: Include Emphasis of Matter paragraph alerting users that FS are prepared in accordance with a special purpose framework and may not be suitable for another purpose."
    ],
    "examFocus": "EoM paragraph alerting special purpose restriction, determining acceptability of framework."
  },
  {
    "code": "SA 805",
    "category": "Specialised Standards",
    "series": "800 Series",
    "title": "Special Considerations - Audits of Single Financial Statements and Specific Elements, Accounts or Items of a Financial Statement",
    "scope": "Audits of a single financial statement (e.g., Balance Sheet only) or a specific element, account, or item (e.g., accounts receivable, inventory).",
    "keyProvisions": [
      "Applicability: All SAs apply with modifications as necessary in the circumstances of the engagement.",
      "Form of Opinion: Auditor expresses a separate opinion on each single financial statement or specific element audited.",
      "Interrelation with Complete Set of FS: If auditor issues adverse/disclaimer on complete FS, cannot issue unmodified opinion on single financial statement/element if it constitutes a major portion.",
      "Materiality: Materiality determined for single statement/element is typically lower than materiality for complete FS."
    ],
    "examFocus": "Adverse/disclaimer interaction on complete FS vs single element audit, lower materiality threshold."
  },
  {
    "code": "SA 810",
    "category": "Specialised Standards",
    "series": "800 Series",
    "title": "Engagements to Report on Summary Financial Statements",
    "scope": "Auditor's responsibilities relating to an engagement to report on summary financial statements derived from financial statements audited by that same auditor.",
    "keyProvisions": [
      "Preconditions: Auditor shall accept only when appointed to audit the financial statements from which summary financial statements are derived.",
      "Applied Criteria: Evaluate whether applied criteria are acceptable and summary financial statements adequately disclose their summarized nature.",
      "Form of Opinion: Express opinion whether summary financial statements are consistent, in all material respects, with audited financial statements in accordance with applied criteria.",
      "Modified Opinion Cross-Reference: If audited FS had qualified/adverse/disclaimer opinion, summary FS report must state that and describe the basis."
    ],
    "examFocus": "Preconditions for acceptance (must be auditor of full FS), consistency opinion, modified opinion cross-reference."
  },
  {
    "code": "SRE 2400 (Revised)",
    "category": "Review Engagements",
    "series": "SRE Series",
    "title": "Engagements to Review Historical Financial Statements",
    "scope": "Reviews of historical financial statements performed by a practitioner who is NOT the statutory auditor of the entity.",
    "keyProvisions": [
      "Level of Assurance: Limited assurance (negative assurance conclusion: 'Nothing has come to our attention...').",
      "Primary Procedures: Inquiries of management and Analytical procedures. No requirement to test controls or perform physical observation/external confirmations unless doubt arises.",
      "Additional Procedures Protocol: If practitioner becomes aware of matter causing doubt, perform additional procedures to either: conclude not likely misstated, or determine it causes material misstatement.",
      "Reporting: Express conclusion (unmodified, qualified, adverse, or disclaimer)."
    ],
    "examFocus": "Limited assurance wording, inquiry and analytical procedures primacy, SRE 2400 vs audit scope."
  },
  {
    "code": "SRE 2410",
    "category": "Review Engagements",
    "series": "SRE Series",
    "title": "Review of Interim Financial Information Performed by the Independent Auditor of the Entity",
    "scope": "Review of interim financial information performed by the entity's appointed statutory auditor (e.g., SEBI LODR Regulation 33 quarterly results).",
    "keyProvisions": [
      "Applicability: Performed ONLY by the entity's independent statutory auditor who possesses existing understanding of internal control from annual audit.",
      "Procedures: Inquiries, analytical procedures, reading minutes, obtaining written representations. Substantially less in scope than an audit under SAs.",
      "Going Concern: Inquire regarding management's plans; auditor does NOT need to corroborate feasibility of plans to the depth of an audit.",
      "Reporting Under Reg 33: Addressed to Board of Directors, expresses negative conclusion, disclaimer of audit opinion."
    ],
    "examFocus": "SRE 2410 vs SRE 2400, SEBI LODR Regulation 33 quarterly review format, auditor options on uncorrected misstatement."
  },
  {
    "code": "SAE 3400",
    "category": "Assurance Engagements",
    "series": "SAE Series",
    "title": "The Examination of Prospective Financial Information",
    "scope": "Examination and reporting on prospective financial information (PFI) including forecasts and projections.",
    "keyProvisions": [
      "Forecast vs Projection: Forecast = PFI based on assumptions of expected events (best-estimate). Projection = PFI based on hypothetical assumptions (what-if scenarios) or mixture.",
      "Auditor's Examination: Practitioner does NOT express opinion on whether results will be achieved. Opinion is limited to: assumptions provide reasonable basis; properly prepared; consistent with historical FS.",
      "Mandatory Report Disclosures: Statement that actual results are likely to be different from prospective results because events do not occur as expected.",
      "Prohibition: Practitioner shall not examine PFI when assumptions are unrealistic or hypothetical assumptions lack justification."
    ],
    "examFocus": "Forecast vs Projection distinction, best-estimate vs hypothetical assumptions, mandatory disclaimer on actual results."
  },
  {
    "code": "SAE 3402",
    "category": "Assurance Engagements",
    "series": "SAE Series",
    "title": "Assurance Reports on Controls at a Service Organisation",
    "scope": "Service auditor's reporting on controls at a service organization providing services to user entities relevant to ICFR.",
    "keyProvisions": [
      "Type 1 Report: Covers description and design of controls as of a specific date. Assesses whether controls are suitably designed to achieve control objectives.",
      "Type 2 Report: Covers description, design AND operating effectiveness of controls throughout a specified period (minimum 6 months). Includes detailed tests of controls and results.",
      "Written Assertion: Management of service organisation must provide written assertion accompanying description."
    ],
    "examFocus": "Type 1 vs Type 2 report criteria, 6-month minimum testing period for Type 2, use by user auditor under SA 402."
  },
  {
    "code": "SAE 3420",
    "category": "Assurance Engagements",
    "series": "SAE Series",
    "title": "Assurance Engagements to Report on the Compilation of Pro Forma Financial Information Included in a Prospectus",
    "scope": "Assurance engagements to report on the compilation by management of pro forma financial information (PFFI) included in a prospectus (e.g. IPO / FPO filings).",
    "keyProvisions": [
      "Objective: Obtain reasonable assurance whether PFFI has been compiled, in all material respects, by management on the basis of applicable criteria.",
      "Auditor's Evaluation: Determine whether management used appropriate source information, applied proper pro forma adjustments, and presented calculations accurately.",
      "No Ongoing Assurance: Engagement does NOT involve updating or reissuing any previously issued audit or review reports on source information.",
      "Report Disclosures: Identification of applicable criteria, statement that purpose is solely to illustrate unadjusted financial information impact."
    ],
    "examFocus": "Reasonable assurance on compilation criteria, pro forma adjustment validation, no audit of underlying source data."
  },
  {
    "code": "SRS 4400",
    "category": "Related Services",
    "series": "SRS Series",
    "title": "Engagements to Perform Agreed-Upon Procedures Regarding Financial Information",
    "scope": "Engagements where practitioner performs procedures agreed between practitioner, entity, and relevant third parties.",
    "keyProvisions": [
      "No Assurance: Practitioner does NOT express any assurance (neither reasonable nor limited). Report is a Report of Factual Findings.",
      "Users Draw Own Conclusions: Users of the report assess for themselves the procedures and findings and draw their own conclusions.",
      "Restricted Distribution: Report is strictly restricted to parties who have agreed to procedures, as others unaware of reasons might misinterpret findings.",
      "Independence: Ethical principles apply; Code of Ethics independence not mandatory unless specifically required by engagement terms."
    ],
    "examFocus": "No assurance expressed, report of factual findings, restricted distribution mandate."
  },
  {
    "code": "SRS 4410 (Revised)",
    "category": "Related Services",
    "series": "SRS Series",
    "title": "Compilation Engagements",
    "scope": "Engagements where practitioner applies accounting and financial reporting expertise to assist management in preparing and presenting financial information.",
    "keyProvisions": [
      "No Assurance: Practitioner does NOT verify accuracy or completeness of information provided; no audit or review opinion expressed.",
      "Management Responsibility: Management retains responsibility for financial information and the basis on which it is prepared.",
      "Practitioner's Duty: Read compiled information in light of understanding of entity; if information provided is incorrect, incomplete, or unsatisfactory, request management to rectify.",
      "Report Contents: Description of responsibilities, identification of applicable FRF, explicit statement that no audit or review assurance is expressed."
    ],
    "examFocus": "No verification or assurance, practitioner duty when information appears misleading, compilation report wording."
  }
];

export const FIRST_SCHEDULE_CLAUSES: EthicsClause[] = [
  // PART I: Professional Misconduct in relation to Chartered Accountants in Practice
  {
    clauseNumber: 1,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Sharing Fees or Profits",
    statutoryRule: "A CA in practice shall not share or agree to share fees, profits, or commissions with any non-member.",
    permittedExceptions: [
        "Member of ICAI or partner in the firm.",
        "Retired partner or legal representative of a deceased partner.",
        "Members of recognized foreign professional bodies having reciprocity with ICAI.",
        "Members of specified Indian professional bodies (ICSI, ICWAI, Bar Council, Indian Institute of Architects) under Regulation 53A."
    ],
    prohibitedActs: [
        "Paying commissions to bank managers, loan brokers, or tax consultants for client referrals.",
        "Sharing audit fees with non-CA corporate consultants."
    ],
    icaiExamFocus: "Sharing fees with unqualified persons, payment to widow/legal heirs of deceased partner (permitted only if partnership deed provides)."
  },
  {
    clauseNumber: 2,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Accepting Referral Commissions or Brokerage",
    statutoryRule: "A CA in practice shall not accept or agree to accept any part of the profits of professional work of another person without member status.",
    permittedExceptions: [
        "Sharing with members of ICAI or recognized bodies permitted under Clause 1."
    ],
    prohibitedActs: [
        "Receiving brokerage or commissions from mutual funds, insurance brokers, or software vendors for referring audit clients."
    ],
    icaiExamFocus: "Acceptance of commissions from financial product issuers while acting as financial adviser or auditor."
  },
  {
    clauseNumber: 3,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Partnership with Non-Members",
    statutoryRule: "A CA in practice shall not enter into partnership with any person other than a CA in practice or recognized professionals.",
    permittedExceptions: [
        "Partnership with members of ICSI, ICWAI, Advocates, Architects under Regulation 53B (Multi-Disciplinary Practices)."
    ],
    prohibitedActs: [
        "Entering into partnership with unregistered accountants, real estate agents, or IT consultants."
    ],
    icaiExamFocus: "Multi-disciplinary partnership conditions and unauthorized profit sharing with non-recognized bodies."
  },
  {
    clauseNumber: 4,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Securing Professional Work through Unauthorized Agencies",
    statutoryRule: "A CA in practice shall not secure professional work through services of a person who is not his employee or partner.",
    permittedExceptions: [
        "Employing bonafide salaried staff or articles who perform work under firm supervision."
    ],
    prohibitedActs: [
        "Hiring independent touts, marketing agencies, or intermediaries to pitch statutory audits."
    ],
    icaiExamFocus: "Engagement of marketing consultants or lead-generation agencies for audit assignments."
  },
  {
    clauseNumber: 5,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Securing Work by Canvassing, Advertising, or Soliciting Clients",
    statutoryRule: "A CA in practice shall not solicit clients or professional work by advertisement, circular, personal communication, or other means.",
    permittedExceptions: [
        "Applying for empanelment or tenders where minimum fee is specified or areas of practice open.",
        "Maintaining a firm website in accordance with Council Website Guidelines (pull mode only, no push advertisements).",
        "Publishing professional achievements or books without promotional self-laudatory claims."
    ],
    prohibitedActs: [
        "Mass sending cold emails, circulars, or brochures to prospective corporate clients.",
        "Sponsoring events with firm name and logo flashing on public hoardings.",
        "Issuing public press interviews bragging about client base or fees."
    ],
    icaiExamFocus: "Firm website guidelines (pull mode), responding to tenders without minimum fee quotes, hoardings/nameplates."
  },
  {
    clauseNumber: 6,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Self-Laudatory Advertisements & Unapproved Designations",
    statutoryRule: "A CA in practice shall not advertise his professional attainments or services, nor use designations other than 'Chartered Accountant'.",
    permittedExceptions: [
        "Use of 'Chartered Accountant' and letters F.C.A. / A.C.A.",
        "Degrees of recognized universities or title conferred by Central/State Government (e.g., 'Padma Shri')."
    ],
    prohibitedActs: [
        "Using designations like 'Income Tax Expert', 'GST Specialist', 'Cost Consultant', or 'Corporate Law Guru' on visiting cards/letterheads."
    ],
    icaiExamFocus: "Use of unauthorized descriptive titles, firm profile brochures with exaggerated claims."
  },
  {
    clauseNumber: 7,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Restrictions on Firm Names & Greeting Cards / Invitations",
    statutoryRule: "A CA in practice shall not use any firm name other than approved by ICAI, nor send greeting cards/invitations to non-clients.",
    permittedExceptions: [
        "Sending greeting cards or invitations for inauguration of office to clients, close friends, and relatives only."
    ],
    prohibitedActs: [
        "Printing religious symbols or services offered on greeting cards.",
        "Distributing office opening circulars to general business associations."
    ],
    icaiExamFocus: "Distribution of office opening invitations to non-clients and use of unapproved firm styles."
  },
  {
    clauseNumber: 8,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Mandatory Prior Communication with Retiring / Previous Auditor",
    statutoryRule: "A CA in practice shall not accept a position as auditor previously held by another chartered accountant without first communicating with him in writing.",
    permittedExceptions: [
        "Communication must be in writing via Registered Post AD, Speed Post, or acknowledgment-secured email to registered address."
    ],
    prohibitedActs: [
        "Accepting audit and commencing work before posting communication to previous auditor.",
        "Hand delivery without positive written acknowledgement."
    ],
    icaiExamFocus: "Conditional acceptance pending reply, meaning of 'prior communication', undisputed audit fees default."
  },
  {
    clauseNumber: 9,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Ascertaining Compliance with Companies Act Provisions on Appointment",
    statutoryRule: "A CA in practice shall not accept appointment as company auditor without first ascertaining that Sections 139 and 140 of Companies Act have been complied with.",
    permittedExceptions: [
        "Obtaining certified copy of Board Resolution (first auditor) or AGM/EGM resolution with special notice (removal of auditor)."
    ],
    prohibitedActs: [
        "Accepting appointment in casual vacancy caused by resignation without general meeting approval.",
        "Accepting appointment when retiring auditor was removed without Central Government approval."
    ],
    icaiExamFocus: "Section 139/140 procedural verification, appointment in place of auditor removed before term expiry."
  },
  {
    clauseNumber: 10,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Charging Contingent Fees / Percentage of Profits",
    statutoryRule: "A CA in practice shall not charge or offer to charge fees based on a percentage of profits or contingent upon findings.",
    permittedExceptions: [
        "Receiver/Liquidator fees based on percentage of asset realization.",
        "Valuer in direct taxes based on percentage of valuation.",
        "Debt recovery agent based on percentage of debt recovered.",
        "Management consultancy services where fees are determined by government/court guidelines."
    ],
    prohibitedActs: [
        "Charging income tax representation fees as 10% of tax refund obtained.",
        "Charging loan syndication fees contingent upon loan sanction."
    ],
    icaiExamFocus: "Exceptions to contingent fees under Regulation 192; fee quotes based on refund or assessment reduction."
  },
  {
    clauseNumber: 11,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Engaging in Unapproved Business or Occupation",
    statutoryRule: "A CA in practice shall not engage in any business or occupation other than the profession of chartered accountancy, without Council permission.",
    permittedExceptions: [
        "General Permission: Directorship (Simple), Teaching (up to 25 hours per week), Authorship of books, Holding agricultural land.",
        "Specific Prior Permission: Managing Director / Whole-time Director, active trading in stock/commodities, full-time business."
    ],
    prohibitedActs: [
        "Acting as Managing Director of a commercial company without prior ICAI Council permission.",
        "Carrying on proprietary trading/retail shop while holding Certificate of Practice."
    ],
    icaiExamFocus: "General vs Specific permission categories; teaching hour ceiling (25 hrs/week); sleeping partner vs active partner in family business."
  },
  {
    clauseNumber: 12,
    schedule: "First Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Prohibition on Permitting Non-Members to Sign Documents on His Behalf",
    statutoryRule: "A CA in practice shall not allow a person not being a member of the Institute or not a partner to sign on his behalf or on behalf of his firm any audit report or statutory certificate.",
    permittedExceptions: [
        "Routine administrative letters may be signed by senior office manager.",
        "Audit report and statutory certificates must be signed personally by the member/partner."
    ],
    prohibitedActs: [
        "Authorizing an article clerk or power-of-attorney holder to sign tax audit reports or balance sheets."
    ],
    icaiExamFocus: "Use of power of attorney to sign balance sheets/audit reports is strictly prohibited."
  },

  // PART II: Professional Misconduct in relation to Members in Service
  {
    clauseNumber: 1,
    schedule: "First Schedule",
    part: "Part II",
    targetGroup: "Members of the Institute in Service",
    title: "Prohibition on Sharing Emoluments or Remuneration",
    statutoryRule: "A member in service shall not pay or allow any share in the emoluments of employment to any person.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Sharing monthly salary with recruitment agency or third-party mentor as commission for securing employment."
    ],
    icaiExamFocus: "Paying kickbacks to HR placement agencies from employment remuneration."
  },
  {
    clauseNumber: 2,
    schedule: "First Schedule",
    part: "Part II",
    targetGroup: "Members of the Institute in Service",
    title: "Prohibition on Accepting Secret Profits, Kickbacks or Commissions",
    statutoryRule: "A member in service shall not accept or agree to accept any part of fees, profits, or gains from a lawyer, CA, broker, or vendor engaged by his employer.",
    permittedExceptions: ["Legitimate perks and bonuses authorized directly by employer."],
    prohibitedActs: [
        "Taking kickback from statutory auditor or software vendor engaged by the company."
    ],
    icaiExamFocus: "Secret commissions accepted by Finance Manager from corporate suppliers or consultants."
  },

  // PART III: Professional Misconduct in relation to Members Generally
  {
    clauseNumber: 1,
    schedule: "First Schedule",
    part: "Part III",
    targetGroup: "Members of the Institute Generally",
    title: "Misleading Fellow Status Claims",
    statutoryRule: "A member shall not claim to be a Fellow of the Institute (FCA) when he is not entitled to be so.",
    permittedExceptions: ["Holding 5 years continuous Certificate of Practice and approved as FCA."],
    prohibitedActs: ["Using FCA designation before completion of mandatory 5-year practice requirement."],
    icaiExamFocus: "Misrepresenting ACA as FCA."
  },
  {
    clauseNumber: 2,
    schedule: "First Schedule",
    part: "Part III",
    targetGroup: "Members of the Institute Generally",
    title: "Failure to Supply Required Information to Institute Authorities",
    statutoryRule: "A member shall not fail to supply such information called for, or comply with requirements asked by the Council, Committees, or Disciplinary Directorate.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Ignoring letters from Disciplinary Directorate regarding professional complaints.",
        "Refusing to furnish CPD attendance records or Peer Review workpapers."
    ],
    icaiExamFocus: "Non-response to show-cause notices issued by ICAI Director (Discipline)."
  },
  {
    clauseNumber: 3,
    schedule: "First Schedule",
    part: "Part III",
    targetGroup: "Members of the Institute Generally",
    title: "Furnishing False Information to Council or Committees",
    statutoryRule: "A member shall not knowingly give false information in response to any notice, tender, or query from the Institute.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Submitting fake article training completion certificates.",
        "Providing inflated employee headcounts in empanelment applications."
    ],
    icaiExamFocus: "Falsification of empanelment details, fake stipend receipts."
  },

  // PART IV: Other Misconduct in relation to Members Generally
  {
    clauseNumber: 1,
    schedule: "First Schedule",
    part: "Part IV",
    targetGroup: "Members of the Institute Generally",
    title: "Criminal Convictions with Imprisonment up to 6 Months",
    statutoryRule: "A member is guilty of other misconduct if held guilty by any civil or criminal court for an offence punishable with imprisonment for a term not exceeding 6 months.",
    permittedExceptions: ["None."],
    prohibitedActs: ["Conviction for public disorder, bounced cheques (NI Act), minor criminal offences."],
    icaiExamFocus: "Threshold: Imprisonment <= 6 months falls under First Schedule Part IV; Imprisonment > 6 months falls under Second Schedule Part III."
  },
  {
    clauseNumber: 2,
    schedule: "First Schedule",
    part: "Part IV",
    targetGroup: "Members of the Institute Generally",
    title: "Acts Bringing Disrepute to the Profession",
    statutoryRule: "A member is guilty of other misconduct if in the opinion of the Council he brings disrepute to the profession or the Institute as a result of his action whether or not related to his professional work.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Misappropriating public money in a personal capacity (e.g. society treasurer).",
        "Public drunken brawl, domestic violence, issuing bounced personal cheques habitually."
    ],
    icaiExamFocus: "Disrepute brought in non-professional/personal capacity; misuse of trust funds."
  }
];

export const SECOND_SCHEDULE_CLAUSES: EthicsClause[] = [
  // PART I: Professional Misconduct in relation to Chartered Accountants in Practice
  {
    clauseNumber: 1,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Disclosing Confidential Information without Client Consent",
    statutoryRule: "A CA in practice shall not disclose information acquired in the course of his professional engagement to any person other than his client, without consent of client or unless required by law.",
    permittedExceptions: [
        "Written consent of client.",
        "Legal duty: Section 143(12) fraud reporting, summon u/s 131 Income Tax, court order, NOCLAR escalation in listed entities."
    ],
    prohibitedActs: [
        "Leaking client's unpublished pricing or acquisition plans to competitors.",
        "Voluntary disclosure of client financial irregularities to tax department without legal summon."
    ],
    icaiExamFocus: "Confidentiality vs duty to disclose under law; voluntary disclosure to police/IT department without statutory notice constitutes misconduct."
  },
  {
    clauseNumber: 2,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Certifying Reports without Verification of Financial Data",
    statutoryRule: "A CA in practice shall not certify or submit in his name a report of an examination of financial statements unless the examination was made by him, his partner, or his employee.",
    permittedExceptions: ["Examination performed under firm's supervision."],
    prohibitedActs: [
        "Signing blank audit certificates or reports prepared entirely by third-party non-CA brokers."
    ],
    icaiExamFocus: "Signing loan utilization certificates based purely on client representations without examination of bank books."
  },
  {
    clauseNumber: 3,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Vouching for Accuracy of Prospective Earnings / Forecasts",
    statutoryRule: "A CA in practice shall not permit his name or the name of his firm to be used in connection with an estimate of earnings contingent upon future transactions in a manner which may lead to the belief that he vouches for the accuracy of the forecast.",
    permittedExceptions: [
        "Reviewing and reporting on Prospective Financial Information in accordance with SAE 3400 (clearly stating that auditor does not vouch for accuracy)."
    ],
    prohibitedActs: [
        "Certifying in a project report: 'We certify that company will achieve ₹50 Crore turnover in FY 2026-27'."
    ],
    icaiExamFocus: "Compliance with SAE 3400; explicit disclaimer on achieveability of future results."
  },
  {
    clauseNumber: 4,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Expressing Opinion when Substantially Interested",
    statutoryRule: "A CA in practice shall not express his opinion on financial statements of any business or enterprise in which he, his partner, or his relative has a substantial interest.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Auditing a private limited company where spouse holds 25% voting power (substantial interest = >= 20% voting power).",
        "Auditing a partnership firm where brother is managing partner."
    ],
    icaiExamFocus: "Substantial interest threshold (20% voting power/equity); definition of 'relative' under Council guidelines."
  },
  {
    clauseNumber: 5,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Failure to Disclose a Known Material Fact",
    statutoryRule: "A CA in practice shall not fail to disclose a material fact known to him which is not disclosed in a financial statement, but disclosure of which is necessary in making such financial statement not misleading.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Concealing major fire accident destroying 50% plant subsequent to year-end.",
        "Ignoring undisclosed revenue recognition non-compliance."
    ],
    icaiExamFocus: "Duty to qualify audit report when client conceals material financial facts."
  },
  {
    clauseNumber: 6,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Failure to Report a Known Material Misstatement",
    statutoryRule: "A CA in practice shall not fail to report a material misstatement known to him to appear in a financial statement with which he is concerned in a professional capacity.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Issuing clean report despite knowing accounts receivable are fictitious.",
        "Signing clean report where company recognized premature bogus sales."
    ],
    icaiExamFocus: "Deliberate issuance of clean audit report when accounts contain known bogus entries."
  },
  {
    clauseNumber: 7,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Gross Negligence in the Conduct of Professional Duties",
    statutoryRule: "A CA in practice shall not fail to exercise due diligence, or be grossly negligent in the conduct of his professional duties.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Certifying stock audit without visiting godowns or reviewing stock records.",
        "Issuing tax audit report without reconciling Form 26AS with audited ledger.",
        "Relying entirely on management representation without performing basic substantive tests."
    ],
    icaiExamFocus: "Difference between minor oversight and gross negligence; failure to comply with mandatory Standards on Auditing (SAs) constitutes gross negligence."
  },
  {
    clauseNumber: 8,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Failure to Obtain Sufficient Information to Warrant Expression of Opinion",
    statutoryRule: "A CA in practice shall not fail to obtain sufficient information which is necessary for expression of an opinion or its exceptions are sufficiently material to negate the expression of an opinion.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Expressing unqualified opinion when books of accounts were seized by tax authorities and unexamined.",
        "Issuing clean audit report when bank statements were not verified."
    ],
    icaiExamFocus: "Scope limitation resulting in disclaimer of opinion; expressing clean opinion without books constitutes violation of Clause 8."
  },
  {
    clauseNumber: 9,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Failure to Invite Attention to Material Departure from Accepted Procedures",
    statutoryRule: "A CA in practice shall not fail to invite attention to any material departure from the generally accepted procedure of audit applicable to the circumstances.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Omitting physical inventory observation without alternative procedures (SA 501).",
        "Omitting direct external confirmations without documented justification (SA 505)."
    ],
    icaiExamFocus: "Failure to adhere to Accounting Standards (AS/Ind AS) and Standards on Auditing (SAs) without report modification."
  },
  {
    clauseNumber: 10,
    schedule: "Second Schedule",
    part: "Part I",
    targetGroup: "Chartered Accountants in Practice",
    title: "Failure to Keep Client Monies in a Separate Bank Account",
    statutoryRule: "A CA in practice shall not fail to keep moneys of his client other than fees or remuneration in a separate banking account or to use such moneys for purposes other than client intended.",
    permittedExceptions: ["Advance audit fees may be kept in regular firm account."],
    prohibitedActs: [
        "Depositing advance tax or GST payments received from clients into firm's personal current account.",
        "Using client's stamp duty deposits for paying office rent temporarily."
    ],
    icaiExamFocus: "Moneys received for statutory payments must be held strictly in dedicated 'Clients Account' and reconciled."
  },

  // PART II: Professional Misconduct in relation to Members Generally
  {
    clauseNumber: 1,
    schedule: "Second Schedule",
    part: "Part II",
    targetGroup: "Members of the Institute Generally",
    title: "Contravention of the Act, Regulations or Guidelines",
    statutoryRule: "A member shall not contravene any of the provisions of this Act or the regulations made thereunder or any guidelines issued by the Council.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Violating Council General Guidelines on statutory audit ceilings (30 company audits).",
        "Violating Unique Document Identification Number (UDIN) guidelines.",
        "Violating Peer Review or Quality Review mandates."
    ],
    icaiExamFocus: "Breach of Council General Guidelines 2008 (UDIN, audit ceilings, internal audit appointments)."
  },
  {
    clauseNumber: 2,
    schedule: "Second Schedule",
    part: "Part II",
    targetGroup: "Members of the Institute Generally",
    title: "Employee Disclosing Confidential Employer Information",
    statutoryRule: "A member, being an employee of any company, firm, or person, shall not disclose confidential information acquired in the course of his employment except as required by law.",
    permittedExceptions: ["Statutory duty, whistle-blowing under legal protection."],
    prohibitedActs: [
        "Corporate CFO leaking upcoming quarterly profit figures to stock market operators."
    ],
    icaiExamFocus: "Breach of corporate insider confidentiality by CA in service."
  },
  {
    clauseNumber: 3,
    schedule: "Second Schedule",
    part: "Part II",
    targetGroup: "Members of the Institute Generally",
    title: "Furnishing False or Misleading Information to Regulators / Courts",
    statutoryRule: "A member shall not include in any statement, return or form submitted to the Council or its committees any particulars knowing them to be false.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Providing fabricated financial data to RBI, SEBI, or Disciplinary Directorate."
    ],
    icaiExamFocus: "Filing false declarations with Ministry of Corporate Affairs or ICAI."
  },
  {
    clauseNumber: 4,
    schedule: "Second Schedule",
    part: "Part II",
    targetGroup: "Members of the Institute Generally",
    title: "Defalcation or Embezzlement of Moneys in Professional or Employment Capacity",
    statutoryRule: "A member shall not defalcate or embezzle moneys received in his professional or employment capacity.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Siphoning client funds or company cash for personal enrichment."
    ],
    icaiExamFocus: "Direct misappropriation of funds in fiduciary capacity."
  },

  // PART III: Other Misconduct in relation to Members Generally
  {
    clauseNumber: 1,
    schedule: "Second Schedule",
    part: "Part III",
    targetGroup: "Members of the Institute Generally",
    title: "Criminal Conviction with Imprisonment Exceeding 6 Months",
    statutoryRule: "A member is guilty of other misconduct if held guilty by any civil or criminal court for an offence punishable with imprisonment for a term exceeding 6 months.",
    permittedExceptions: ["None."],
    prohibitedActs: [
        "Conviction for moral turpitude, financial frauds, IPC crimes with sentence > 6 months."
    ],
    icaiExamFocus: "Term of imprisonment > 6 months directly activates Second Schedule Part III."
  }
];

export const DISCIPLINARY_MECHANISM_DATA: DisciplinaryAuthority[] = [
  {
    forum: "Director (Discipline) - Section 21",
    constitution: "Appointed by ICAI Council to head the Disciplinary Directorate.",
    mattersDealtWith: "Initial receipt, examination, and prima facie opinion on all complaints/information received against members.",
    penalPowers: [
      "If prima facie opinion is guilty under First Schedule -> Places matter before Board of Discipline.",
      "If prima facie opinion is guilty under Second Schedule or BOTH Schedules -> Places matter before Disciplinary Committee.",
      "Can recommend closure if no prima facie case exists (subject to Board concurrence)."
    ],
    appealProvision: "No direct appeal against prima facie opinion; administrative reference."
  },
  {
    forum: "Board of Discipline (BOD) - Section 21A",
    constitution: "Presided over by a Council member, plus one Council member and one Central Government nominee.",
    mattersDealtWith: "Exclusively deals with complaints/information falling under FIRST SCHEDULE (or Part IV First Schedule).",
    penalPowers: [
      "Reprimand the member.",
      "Remove name of member from Register of Members for up to 3 MONTHS.",
      "Impose fine up to ₹1,00,000 (Rupees One Lakh)."
    ],
    appealProvision: "Appeal lies to Appellate Authority within 90 days under Section 22G."
  },
  {
    forum: "Disciplinary Committee (DC) - Section 21B",
    constitution: "Presided over by President or Vice-President of ICAI, two Council members, and two Central Government nominees.",
    mattersDealtWith: "Deals with complaints falling under SECOND SCHEDULE or BOTH First and Second Schedules.",
    penalPowers: [
      "Reprimand the member.",
      "Remove name of member from Register of Members PERMANENTLY or for ANY PERIOD deemed fit.",
      "Impose fine up to ₹5,00,000 (Rupees Five Lakhs)."
    ],
    appealProvision: "Appeal lies to Appellate Authority within 90 days under Section 22G."
  }
];

export const COUNCIL_GUIDELINES_SUMMARY: CouncilGuidelineItem[] = [
  {
    subject: "Specified Number of Company Audits",
    statutoryLimitOrCondition: "Maximum 30 company audits per partner (One-person companies and small companies excluded).",
    icaiReference: "Council General Guidelines, 2008 / Section 141(3)(g) Companies Act",
    keyTakeaway: "Joint audits count as full 1 audit against the individual partner's cap."
  },
  {
    subject: "Indebtedness to Audit Client",
    statutoryLimitOrCondition: "A member in practice or partner shall not accept audit if indebted to company for an amount exceeding ₹1,00,000 (ICAI Code) / ₹5,00,000 (Companies Act).",
    icaiReference: "Chapter X, Council General Guidelines, 2008 & Sec 141(3)(d)",
    keyTakeaway: "Includes indebtedness through credit card outstandings exceeding limits beyond normal billing cycle."
  },
  {
    subject: "Maintenance of Books of Accounts by CAs",
    statutoryLimitOrCondition: "Mandatory for CA in practice if gross receipts exceed ₹1,20,000 in all of the 3 preceding years or first year expected.",
    icaiReference: "Chapter V, Council General Guidelines, 2008",
    keyTakeaway: "Must maintain cash book, ledger, and clients' register with record of fee bills issued."
  },
  {
    subject: "Internal Auditor cannot be Statutory Auditor",
    statutoryLimitOrCondition: "Statutory auditor cannot accept appointment as internal auditor of the SAME entity, its holding, or subsidiary companies.",
    icaiReference: "Section 144 of Companies Act & Council Guidelines",
    keyTakeaway: "Self-review threat; extends to network firms and associated entities."
  },
  {
    subject: "Internal Auditor cannot be Tax Auditor",
    statutoryLimitOrCondition: "A CA conducting internal audit cannot be appointed as Tax Auditor u/s 44AB of the same entity.",
    icaiReference: "Council Resolution on Section 44AB Independence",
    keyTakeaway: "Maintains independence of tax certification."
  },
  {
    subject: "NOCLAR (Non-Compliance with Laws and Regulations)",
    statutoryLimitOrCondition: "Mandatory for audits of listed entities; duty to address serious illegal acts affecting public interest.",
    icaiReference: "Code of Ethics Revised Framework (Sections 260 & 360)",
    keyTakeaway: "Escalation ladder: Management -> TCWG -> External Regulators (overriding confidentiality if substantial harm)."
  }
];

export const CARO_2020_CLAUSES: CaroClauseItem[] = [
  { clauseNo: "3(i)", title: "Property, Plant & Equipment (PPE) and Intangible Assets", keyAuditVerification: "Proper records, physical verification by management at reasonable intervals, title deeds held in company name (if not, disclose details), revaluation by registered valuer, benami proceedings pending." },
  { clauseNo: "3(ii)", title: "Inventories & Working Capital Limits", keyAuditVerification: "Physical verification of inventory (coverage >= 10% each class, discrepancies >= 10% reported); sanction of working capital limits > ₹5 Cr on security of current assets, quarterly returns agree with books." },
  { clauseNo: "3(iii)", title: "Investments, Guarantees, Securities & Loans Granted", keyAuditVerification: "Terms not prejudicial to company's interest; schedule of repayment stipulated and regular; overdue > 90 days steps taken; loans renewed/extended or fresh loans to settle overdues; loans repayable on demand or without terms." },
  { clauseNo: "3(iv)", title: "Compliance with Sections 185 and 186", keyAuditVerification: "Loans to directors (Sec 185) and loans/investments/guarantees (Sec 186) complied with." },
  { clauseNo: "3(v)", title: "Deposits from Public", keyAuditVerification: "Compliance with directives of RBI, Sections 73 to 76 of Companies Act, and orders of CLB/NCLT/Court." },
  { clauseNo: "3(vi)", title: "Cost Records", keyAuditVerification: "Maintenance of cost accounts and records prescribed under Section 148(1)." },
  { clauseNo: "3(vii)", title: "Statutory Dues", keyAuditVerification: "(a) Regularity in depositing undisputed dues (PF, ESI, GST, IT, Customs, Cess); arrears > 6 months from due date; (b) Disputed dues pending before forums with amounts and forums." },
  { clauseNo: "3(viii)", title: "Unrecorded Income Surrendered in Tax Assessments", keyAuditVerification: "Transactions not recorded in books surrendered or disclosed as income during year in income tax search/survey assessments recorded in books." },
  { clauseNo: "3(ix)", title: "Default in Repayment of Borrowings", keyAuditVerification: "Default in repayment of loans/interest to lenders (period & amount); declared wilful defaulter; term loans applied for purpose; short term funds used for long term; funds borrowed for subsidiaries/JVs." },
  { clauseNo: "3(x)", title: "IPO/FPO Proceeds & Preferential Allotments", keyAuditVerification: "Moneys raised by IPO/FPO applied for purpose; preferential allotment/private placement complied with Sec 42 and 62." },
  { clauseNo: "3(xi)", title: "Fraud Reporting", keyAuditVerification: "Any fraud by or on the company noticed/reported; report filed in Form ADT-4 under Sec 143(12); whistle-blower complaints considered." },
  { clauseNo: "3(xii)", title: "Nidhi Companies", keyAuditVerification: "Net Owned Funds to Deposits ratio 1:20; 10% unencumbered term deposits; default in interest payment." },
  { clauseNo: "3(xiii)", title: "Related Party Transactions (Sections 177 & 188)", keyAuditVerification: "Compliance with Sections 177 and 188, disclosures in financial statements as per applicable accounting standards." },
  { clauseNo: "3(xiv)", title: "Internal Audit System", keyAuditVerification: "Internal audit system commensurate with size and nature; internal audit reports considered by statutory auditor." },
  { clauseNo: "3(xv)", title: "Non-Cash Transactions with Directors (Section 192)", keyAuditVerification: "Non-cash transactions entered into with directors or connected persons compliant with Section 192." },
  { clauseNo: "3(xvi)", title: "Registration u/s 45-IA of RBI Act, 1934", keyAuditVerification: "Entity required to register as NBFC registered; conducting NBFC/HFC activities with valid Certificate of Registration; Core Investment Company (CIC) criteria." },
  { clauseNo: "3(xvii)", title: "Cash Losses", keyAuditVerification: "Whether company has incurred cash losses in the financial year and in the immediately preceding financial year, and the quantum." },
  { clauseNo: "3(xviii)", title: "Resignation of Statutory Auditors", keyAuditVerification: "Whether there has been any resignation of the statutory auditors; whether incoming auditor took into consideration issues raised by outgoing auditor." },
  { clauseNo: "3(xix)", title: "Financial Viability / Capability to Meet Liabilities (SA 570)", keyAuditVerification: "On basis of ratios, ageing, expected dates of realization and payment, board plans: whether material uncertainty exists that company cannot meet liabilities within 1 year from balance sheet date." },
  { clauseNo: "3(xx)", title: "Corporate Social Responsibility (CSR) - Section 135", keyAuditVerification: "Unspent amount transferred to Fund specified in Schedule VII within 6 months, or transferred to special account for ongoing projects within 30 days." },
  { clauseNo: "3(xxi)", title: "Qualifications/Adverse Remarks in Consolidated Reports", keyAuditVerification: "Qualifications or adverse remarks by respective auditors in CARO reports of companies included in consolidated financial statements." }
];
