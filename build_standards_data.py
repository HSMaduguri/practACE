# Script to assemble src/data/audit/standardsData.ts
import json

with open('standards_data_export.json') as f:
    standards = json.load(f)

ts_content = """/**
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

export const STANDARDS_ON_AUDITING: StandardOnAuditing[] = """ + json.dumps(standards, indent=2) + """;

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
"""

with open('src/data/audit/standardsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Saved src/data/audit/standardsData.ts successfully!")
