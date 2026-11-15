/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeneralQuestion } from '../../types';

export const PART4_INTERNAL_ETHICS_ESG_MCQS: GeneralQuestion[] = [
  // =========================================================================================
  // CHAPTER 16: INTERNAL AUDIT (Section 138, Rule 13, SIAs, SA 610)
  // Target: 10 new MCQs (Total: 12)
  // =========================================================================================
  {
    id: 'AUD_CH16_01',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under Section 138 of the Companies Act, 2013 read with Rule 13 of Companies (Accounts) Rules, 2014, an UNLISTED PUBLIC COMPANY must mandatorily appoint an internal auditor if during the preceding financial year it satisfies ANY of which four statutory thresholds?',
    options: [
      'Deposits ≥ ₹50 Cr, Capital ≥ ₹100 Cr, Loans ≥ ₹200 Cr, Turnover ≥ ₹500 Cr',
      'Deposits ≥ ₹25 Cr, Paid-up Share Capital ≥ ₹50 Cr, Outstanding Loans/Borrowings from Banks/PFIs ≥ ₹100 Cr (at any point), or Turnover ≥ ₹200 Cr',
      'Capital ≥ ₹10 Cr, Turnover ≥ ₹50 Cr, Loans ≥ ₹25 Cr, Net Profit ≥ ₹5 Cr',
      'Turnover ≥ ₹100 Cr and Net Worth ≥ ₹500 Cr'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Rule 13(1)(a), an unlisted public company must appoint an internal auditor if in the preceding financial year: (1) Turnover ≥ ₹200 Crores; or (2) Paid-up share capital ≥ ₹50 Crores; or (3) Outstanding loans or borrowings from banks/PFIs exceeding ₹100 Crores at any point of time; or (4) Outstanding deposits ≥ ₹25 Crores at any point of time. (Mnemonic: 25 - 50 - 100 - 200).'
  },
  {
    id: 'AUD_CH16_02',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under Rule 13 of the Companies (Accounts) Rules, 2014, when is a PRIVATE LIMITED COMPANY required to appoint an Internal Auditor?',
    options: [
      'Private companies are completely exempt from internal audit under all circumstances.',
      'If during the preceding financial year, turnover is ₹200 Crores or more, OR outstanding loans or borrowings from banks or public financial institutions exceed ₹100 Crores at any point of time.',
      'If it has paid-up share capital of ₹50 Crores or more.',
      'If it has accepted deposits of ₹25 Crores or more.'
    ],
    correctOptionIndex: 1,
    explanation: 'Rule 13(1)(b) provides that every private company shall be required to appoint an internal auditor if during the preceding financial year it has: (i) turnover of ₹200 Crores or more; OR (ii) outstanding loans or borrowings from banks or public financial institutions exceeding ₹100 Crores at any point of time during the financial year.'
  },
  {
    id: 'AUD_CH16_03',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under Section 138 of the Companies Act, 2013, WHO can be appointed as an Internal Auditor of a company?',
    options: [
      'Only an external Chartered Accountant firm in active practice.',
      'A Chartered Accountant, a Cost Accountant, or such other professional as may be decided by the Board, and the internal auditor may or may not be an employee of the company.',
      'Only the Company Secretary of the reporting entity.',
      'Only an Indian Administrative Service (IAS) officer on deputation.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 138(1) provides that an internal auditor shall either be a chartered accountant or a cost accountant (whether engaged in practice or not), or such other professional as may be decided by the Board to conduct internal audit of the functions and activities of the company. The internal auditor may or may not be an employee of the company.'
  },
  {
    id: 'AUD_CH16_04',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Can the STATUTORY AUDITOR of a company also be appointed as its INTERNAL AUDITOR under the Companies Act, 2013?',
    options: [
      'Yes, provided separate engagement teams are used.',
      'No, it is strictly PROHIBITED under Section 144 of the Companies Act, 2013.',
      'Yes, if approved by a 100% unanimous vote of the Audit Committee.',
      'Yes, for private companies with turnover below ₹100 Crores.'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 144(a) of the Companies Act, 2013 explicitly lists "internal audit" as a prohibited service that a statutory auditor cannot provide directly or indirectly to the company, its holding company, or its subsidiary company.'
  },
  {
    id: 'AUD_CH16_05',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under SA 610 (Revised) "Using the Work of Internal Auditors", in which of the following areas is the external statutory auditor STRICTLY PROHIBITED from using the internal auditor to provide Direct Assistance?',
    options: [
      'Testing the mathematical accuracy of petty cash sheets.',
      'Procedures that involve making significant judgments in the audit, higher assessed risks of material misstatement where judgment is required, or areas where the internal auditor was involved.',
      'Tracing physical goods to purchase orders.',
      'Verifying attendance registers of factory workers.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 610 (Revised) paragraph 30 explicitly prohibits the external auditor from using internal auditors to provide direct assistance to perform procedures that: (a) involve making significant judgments in the audit; (b) relate to higher assessed risks of material misstatement; (c) relate to work with which the internal auditors have been involved; or (d) relate to decisions which the external auditor makes in accordance with this SA.'
  },
  {
    id: 'AUD_CH16_06',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Before using the work of the internal audit function under SA 610 (Revised), what three foundational aspects must the external statutory auditor evaluate?',
    options: [
      'The salary package, college degrees, and personal wealth of the internal audit head.',
      'The extent to which the internal audit function’s organizational status and relevant policies support the OBJECTIVITY of the internal auditors; the level of COMPETENCE of the function; and whether the function applies a systematic and disciplined approach (including quality control).',
      'Whether the internal auditor uses the same brand of laptop as the statutory auditor.',
      'Whether the internal audit reports were approved by the Registrar of Companies.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 610 (Revised) paragraph 15 mandates that the external auditor shall evaluate: (a) The extent to which the internal audit function’s organizational status and relevant policies and procedures support the objectivity of the internal auditors; (b) The level of competence of the internal audit function; and (c) Whether the internal audit function applies a systematic and disciplined approach, including quality control.'
  },
  {
    id: 'AUD_CH16_07',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under SIA 210 (Managing the Internal Audit Function) issued by ICAI, to whom should the Internal Auditor functionally report to ensure maximum independence and objectivity?',
    options: [
      'The Chief Financial Officer (CFO)',
      'The Audit Committee of the Board of Directors (or the Board where no Audit Committee exists)',
      'The Head of Marketing',
      'The Company’s external statutory tax consultant'
    ],
    correctOptionIndex: 1,
    explanation: 'Standards on Internal Audit (SIAs) issued by the Internal Audit Standards Board of ICAI recommend that the Chief Internal Auditor / Internal Auditor should report functionally to the highest level of governance (the Audit Committee / Board of Directors) and administratively to the Managing Director or Chief Executive Officer, ensuring complete operational independence from finance management.'
  },
  {
    id: 'AUD_CH16_08',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under CARO 2020 Clause (xiv), what specific reporting is required from the statutory auditor regarding internal audit?',
    options: [
      'Reporting the names of all internal audit junior associates.',
      'Whether the company has an internal audit system commensurate with the size and nature of its business; and whether the reports of the Internal Auditors for the period under audit were considered by the statutory auditor.',
      'Certifying that the internal audit team discovered all frauds.',
      'Reporting whether internal audit fees exceeded statutory audit fees.'
    ],
    correctOptionIndex: 1,
    explanation: 'CARO 2020 Clause (xiv) requires the statutory auditor to report: (a) whether the company has an internal audit system commensurate with the size and nature of its business; and (b) whether the reports of the Internal Auditors for the period under audit were considered by the statutory auditor.'
  },
  {
    id: 'AUD_CH16_09',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'Under SIA 320 (Internal Control Evaluation), what is the focus of an internal auditor’s evaluation of internal controls compared to the statutory auditor?',
    options: [
      'The internal auditor is focused only on historical balance sheet disclosures.',
      'The internal auditor evaluates internal controls across all organizational objectives (Operations, Compliance, and Financial Reporting), whereas the statutory auditor is focused primarily on Internal Financial Controls over Financial Reporting (IFCoFR).',
      'The internal auditor tests controls only once every five years.',
      'The internal auditor has no role in internal control evaluation.'
    ],
    correctOptionIndex: 1,
    explanation: 'SIA 320 highlights that the scope of internal audit covers all internal controls of the enterprise—operational efficiency, safeguarding of assets, compliance with policies and statutes, and financial reporting. In contrast, the statutory auditor’s focus under SA 315 and Section 143(3)(i) is primarily restricted to controls relevant to the preparation and fair presentation of financial statements (IFCoFR).'
  },
  {
    id: 'AUD_CH16_10',
    subjectId: 'Audit',
    chapterName: 'Internal Audit',
    questionText: 'When an external statutory auditor uses the internal auditor for direct assistance under SA 610 (Revised), who retains sole and undivided responsibility for the audit opinion expressed?',
    options: [
      'The internal auditor is 50% responsible for the opinion.',
      'The external statutory auditor retains sole responsibility for the audit opinion expressed, and that responsibility is not reduced by using the internal auditors for direct assistance.',
      'The Audit Committee takes full legal responsibility.',
      'The internal audit firm must sign a co-indemnity bond.'
    ],
    correctOptionIndex: 1,
    explanation: 'SA 610 (Revised) paragraph 11 clearly reinforces: "The external auditor has sole responsibility for the audit opinion expressed, and that responsibility is not reduced by the external auditor’s use of the work of the internal audit function or internal auditors to provide direct assistance on the engagement."'
  },

  // =========================================================================================
  // CHAPTER 17: DUE DILIGENCE, INVESTIGATION & FORENSIC AUDIT
  // Target: 10 new MCQs (Total: 12)
  // ==========================================
  {
    id: 'AUD_CH17_01',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'What is the fundamental difference in purpose and approach between a Statutory Financial Audit and a Due Diligence review?',
    options: [
      'A statutory audit is conducted for an acquirer, whereas due diligence is conducted for tax authorities.',
      'A statutory audit provides reasonable assurance on whether historical financial statements give a true and fair view using sampling and materiality; whereas due diligence is a comprehensive risk and commercial evaluation of a target entity conducted on behalf of an investor/acquirer to assess business viability, hidden liabilities, and quality of earnings (normalized EBITDA) with no predetermined materiality limit.',
      'Due diligence is governed by SA 700; statutory audit is governed by FAIS.',
      'There is no difference; both produce the same audit report.'
    ],
    correctOptionIndex: 1,
    explanation: 'A statutory audit is an independent examination to express an opinion on historical financial statements based on auditing standards, sampling, and materiality. Due diligence is an intensive investigation tailored to an acquirer/investor to uncover hidden commercial/legal/financial risks, adjust EBITDA for non-operating items, evaluate synergies, and assist in price negotiation.'
  },
  {
    id: 'AUD_CH17_02',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'What is "Benford’s Law" and how is it utilized by forensic auditors during fraud investigations?',
    options: [
      'A law that limits corporate borrowing to three times net worth.',
      'A mathematical law of anomalous numbers stating that in naturally occurring numerical datasets, the number 1 will appear as the leading first digit approximately 30.1% of the time, followed by decreasing frequencies for digits 2 to 9; significant deviation indicates potential human fabrication or fictitious transaction amounts.',
      'A psychological rule used to interrogate corporate executives.',
      'A legal doctrine governing the appointment of court liquidators.'
    ],
    correctOptionIndex: 1,
    explanation: 'Benford’s Law (the First-Digit Law) states that in multi-digit naturally occurring financial sets, the digit 1 appears as the leading first digit ~30.1% of the time, digit 2 ~17.6%, down to digit 9 ~4.6%. When fraudsters invent fabricated invoices or journal entries, they tend to distribute digits uniformly; forensic auditors apply Benford’s Law analytics to isolate unnatural frequency spikes.'
  },
  {
    id: 'AUD_CH17_03',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'What is "Teeming and Lading" (also known as "Lapping") in cash misappropriation schemes?',
    options: [
      'Investing company cash in short-term speculative derivatives.',
      'Concealing cash shortages from customer receivables by using subsequent cash receipts from another customer to cover the earlier shortfall, creating a continuous rolling delay in recording receipts.',
      'Writing off damaged inventory at scrap value.',
      'Transferring funds between overseas bank accounts to benefit from exchange rate movements.'
    ],
    correctOptionIndex: 1,
    explanation: 'Teeming and Lading (Lapping) is an embezzlement technique where cash received from Customer A is misappropriated by the cashier; when Customer B pays, their remittance is credited to Customer A’s account to hide the theft; subsequent receipts from Customer C are credited to Customer B, and so forth, perpetuating a continuous rolling cover-up.'
  },
  {
    id: 'AUD_CH17_04',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'Under Forensic Accounting and Investigation Standards (FAIS) issued by ICAI, what is the standard of evidence required in a Forensic Audit that distinguishes it from a conventional statutory audit?',
    options: [
      'Oral estimates from employees are acceptable.',
      'Evidence must meet the high standard of legal admissibility and evidential reliability capable of standing scrutiny in a court of law or judicial/disciplinary proceedings.',
      'Evidence must be verified exclusively through internet news sources.',
      'Evidence is restricted to standard management representation letters.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under ICAI FAIS standards, forensic investigation findings frequently end up before courts (e.g., NCLT, CBI courts, High Courts) or law enforcement agencies. Consequently, forensic evidence must maintain a strict chain of custody, be gathered objectively without bias, and satisfy legal admissibility standards (Section 65B of Indian Evidence Act for digital records).'
  },
  {
    id: 'AUD_CH17_05',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'What is a "Bit-Stream Image" (Clone Copy) in Digital Forensics and why is it mandatory before analyzing suspect computer hard drives?',
    options: [
      'Taking a screenshot of the computer desktop.',
      'An exact sector-by-sector, bit-by-bit physical copy of the original digital media, accompanied by verification hash values (MD5 or SHA-256), ensuring the original evidence remains pristine and untouched during forensic analysis.',
      'A software backup created through standard Windows backup tools.',
      'Copy-pasting files into an external Google Drive folder.'
    ],
    correctOptionIndex: 1,
    explanation: 'In digital forensics, analysts NEVER examine the original suspect media directly. They use hardware write-blockers to create a Bit-Stream Image (exact physical duplicate bit-by-bit, including deleted sectors and unallocated space). Cryptographic hash values (MD5/SHA-256) are matched before and after to prove in court that evidence was not altered.'
  },
  {
    id: 'AUD_CH17_06',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'In Financial Due Diligence, what are "Quality of Earnings" adjustments?',
    options: [
      'Adjusting statutory tax rates to minimize future tax liabilities.',
      'Normalizing historical reported EBITDA by eliminating non-recurring, one-off, extraordinary gains/losses, owner-related discretionary expenses, and aggressive accounting estimates to reflect sustainable recurring operating earnings.',
      'Recalculating employee provident fund contributions.',
      'Converting historical profits into US Dollars.'
    ],
    correctOptionIndex: 1,
    explanation: 'Quality of Earnings (QoE) analysis is a cornerstone of due diligence. Acquirers normalize reported EBITDA by stripping out non-operating income, non-recurring litigation payouts, owner perquisites, unsupportable revenue spikes before sale, and inventory valuation distortions to establish true baseline sustainable cash flows.'
  },
  {
    id: 'AUD_CH17_07',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'Which of the following behavioral red flags is considered a strong indicator of potential occupational fraud under ACFE studies and forensic audit practice?',
    options: [
      'An employee taking mandatory 15 days of annual leave every year.',
      'An employee in a finance/procurement role living lavishly beyond their known financial means, refusing to delegate duties, and never taking mandatory annual leaves.',
      'An employee actively pursuing professional qualifications in their spare time.',
      'An employee requesting a company laptop upgrade.'
    ],
    correctOptionIndex: 1,
    explanation: 'Leading behavioral red flags identified in fraud examinations include: living beyond financial means, financial difficulties, unusually close association with vendors/customers, control freak tendencies/refusal to delegate, and refusal to take mandatory leaves (often because taking leave allows a substitute to discover unauthorized entries or lapping schemes).'
  },
  {
    id: 'AUD_CH17_08',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'What is a "Carousel Fraud" (Missing Trader Intra-Community Fraud)?',
    options: [
      'Operating amusement park rides without safety licenses.',
      'A fraudulent network where goods/services are passed through a series of shell companies (conduit companies and missing traders) to claim illicit input tax credit (ITC) or GST refunds without depositing the corresponding tax into the government treasury.',
      'Borrowing funds from multiple banks simultaneously on different days of the week.',
      'Selling expired inventory to related parties.'
    ],
    correctOptionIndex: 1,
    explanation: 'Carousel fraud is a sophisticated tax evasion scheme involving circular trading of goods/invoices through a chain of entities (buffers, missing traders, and exporters). The missing trader collects tax and disappears without remitting it to the government, while another entity in the loop claims input tax credit or refund, cycling invoices repeatedly like a carousel.'
  },
  {
    id: 'AUD_CH17_09',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'Under Section 212 of the Companies Act, 2013, which specialized agency is empowered by the Central Government to investigate serious corporate frauds?',
    options: [
      'The Institute of Chartered Accountants of India (ICAI)',
      'The Serious Fraud Investigation Office (SFIO)',
      'The Telecom Regulatory Authority of India (TRAI)',
      'The National Company Law Appellate Tribunal (NCLAT)'
    ],
    correctOptionIndex: 1,
    explanation: 'Section 212 of the Companies Act, 2013 establishes the Serious Fraud Investigation Office (SFIO) as a multi-disciplinary organization comprising experts in corporate law, forensic audit, information technology, banking, and capital markets to investigate complex corporate frauds assigned by the Central Government.'
  },
  {
    id: 'AUD_CH17_10',
    subjectId: 'Audit',
    chapterName: 'Due Diligence, Investigation & Forensic Audit',
    questionText: 'In conducting an Investigation into alleged embezzlement of cash, can the investigator rely on sampling techniques under SA 530?',
    options: [
      'Yes, sampling of 5% of vouchers is always sufficient.',
      'No, an investigation into alleged fraud requires exhaustive 100% examination of suspect records, accounts, and transactions for the period in question; statistical sampling is inappropriate because fraud does not distribute randomly.',
      'Sampling can be used if approved by the bank manager.',
      'Sampling is permitted only if software-based random sampling is used.'
    ],
    correctOptionIndex: 1,
    explanation: 'Unlike a general statutory audit where sampling is standard under SA 530, an investigation into a specific alleged fraud requires an in-depth, 100% comprehensive examination of all transactions, vouchers, and communications within the suspect scope, as fraudsters actively camouflage fraudulent entries among ordinary transactions.'
  },

  // =========================================================================================
  // CHAPTER 18: SUSTAINABLE DEVELOPMENT GOALS (SDG) & ENVIRONMENT, SOCIAL AND GOVERNANCE (ESG) ASSURANCE
  // Target: 10 new MCQs (Total: 11)
  // ==========================================
  {
    id: 'AUD_CH18_01',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Under Regulation 34(2)(f) of the SEBI (LODR) Regulations, 2015, which listed entities are mandatorily required to submit a Business Responsibility and Sustainability Report (BRSR) as part of their Annual Report?',
    options: [
      'Top 100 listed entities by market capitalization.',
      'Top 1,000 listed entities by market capitalization.',
      'All companies listed on any Indian stock exchange.',
      'Only public sector government enterprises.'
    ],
    correctOptionIndex: 1,
    explanation: 'SEBI mandated that the Business Responsibility and Sustainability Report (BRSR) is compulsory for the top 1,000 listed entities by market capitalization (calculated as on 31st March of every financial year) in their annual reports, replacing the erstwhile Business Responsibility Report (BRR).'
  },
  {
    id: 'AUD_CH18_02',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'What is "BRSR Core" introduced by SEBI for assurance and supply chain disclosures?',
    options: [
      'A software database developed by SEBI for uploading corporate annual returns.',
      'A sub-set of the wider BRSR consisting of specified Key Performance Indicators (KPIs) across 9 ESG attributes for which listed companies must obtain reasonable/limited assurance in a phased manner.',
      'A certification granted only to companies operating in renewable energy.',
      'An environmental tax levied on heavy manufacturing industries.'
    ],
    correctOptionIndex: 1,
    explanation: 'BRSR Core is a targeted subset of the BRSR framework formulated by SEBI, containing specified, quantifiable Key Performance Indicators (KPIs) across environmental (GHG emissions, water, waste), social (gender diversity, fair wages, safety), and governance metrics designed to facilitate objective third-party assurance.'
  },
  {
    id: 'AUD_CH18_03',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Under the GHG (Greenhouse Gas) Protocol, what are SCOPE 1, SCOPE 2, and SCOPE 3 emissions?',
    options: [
      'Scope 1 is factory emissions; Scope 2 is car emissions; Scope 3 is home emissions.',
      'Scope 1: Direct emissions from owned or controlled sources; Scope 2: Indirect emissions from generation of purchased electricity, steam, heating/cooling; Scope 3: All other indirect emissions occurring across the upstream and downstream value chain.',
      'Scope 1 is within India; Scope 2 is within Asia; Scope 3 is global.',
      'Scope 1 is CO2; Scope 2 is Methane; Scope 3 is Nitrous Oxide.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under the GHG Protocol: Scope 1 = Direct emissions from sources owned or controlled by the company (combustion in boilers, furnaces, vehicles); Scope 2 = Indirect emissions from the generation of purchased electricity, steam, heating and cooling consumed by the entity; Scope 3 = All other indirect emissions in the value chain (supply chain manufacturing, business travel, product use, waste disposal).'
  },
  {
    id: 'AUD_CH18_04',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Which Standard on Sustainability Assurance Engagements issued by the ICAI governs Assurance Engagements on GREENHOUSE GAS STATEMENTS?',
    options: [
      'SA 700',
      'SSAE 3000',
      'SSAE 3410',
      'SRS 4400'
    ],
    correctOptionIndex: 2,
    explanation: 'The ICAI Sustainability Reporting Standards Board issued Standard on Sustainability Assurance Engagements (SSAE) 3410 "Assurance Engagements on Greenhouse Gas Statements", which provides explicit guidance for practitioners performing reasonable or limited assurance engagements on an entity’s GHG statement.'
  },
  {
    id: 'AUD_CH18_05',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'What is the phenomenon known as "Greenwashing" in corporate sustainability disclosures?',
    options: [
      'Washing corporate offices with eco-friendly cleaning detergents.',
      'The practice of making unsubstantiated, exaggerated, or misleading claims about the environmental benefits, sustainability performance, or eco-credentials of a company’s products or business operations.',
      'Investing surplus funds in organic agricultural farmland.',
      'Planting trees around a thermal power plant.'
    ],
    correctOptionIndex: 1,
    explanation: 'Greenwashing is the deceptive or misleading practice of conveying a false impression or providing misleading information about how a company’s products or policies are environmentally sound, hiding negative impacts and highlighting token green initiatives to attract ESG capital.'
  },
  {
    id: 'AUD_CH18_06',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Under SSAE 3000 (Assurance Engagements Other than Audits or Reviews of Historical Financial Information), what is the difference between Reasonable Assurance and Limited Assurance regarding ESG reports?',
    options: [
      'Reasonable assurance is only given for listed companies; limited assurance is for startups.',
      'In a reasonable assurance engagement, the practitioner reduces engagement risk to an acceptably low level and expresses a positive opinion; in a limited assurance engagement, the practitioner reduces risk to a moderate level and expresses a negative conclusion.',
      'Reasonable assurance requires 100% testing; limited assurance requires 50% testing.',
      'Reasonable assurance is given by engineers; limited assurance is given by accountants.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under SSAE 3000: Reasonable assurance requires extensive evidence gathering (inquiry, inspection, observation, re-performance) and yields a positive conclusion ("in our opinion, the subject matter conforms in all material respects with applied criteria"). Limited assurance involves primarily inquiry and analytical procedures, yielding a negative conclusion ("nothing has come to our attention...").'
  },
  {
    id: 'AUD_CH18_07',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Which international standard-setting body under the IFRS Foundation released IFRS S1 (General Requirements for Disclosure of Sustainability-related Financial Information) and IFRS S2 (Climate-related Disclosures)?',
    options: [
      'International Auditing and Assurance Standards Board (IAASB)',
      'International Sustainability Standards Board (ISSB)',
      'Global Reporting Initiative (GRI)',
      'United Nations Environment Programme (UNEP)'
    ],
    correctOptionIndex: 1,
    explanation: 'The International Sustainability Standards Board (ISSB), established by the IFRS Foundation at COP26, issued its inaugural standards in June 2023: IFRS S1 (General Sustainability Disclosures) and IFRS S2 (Climate-related Disclosures), creating a comprehensive global baseline for capital markets.'
  },
  {
    id: 'AUD_CH18_08',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'In verifying Water Consumption disclosures under BRSR Core, which audit procedure provides the MOST reliable substantive evidence for an assurance practitioner?',
    options: [
      'Accepting an oral estimate from the factory canteen supervisor.',
      'Inspecting calibrated third-party water meter logs, municipal water utility bills, groundwater extraction permits (CGWA approvals), and mass-balance flow calculations.',
      'Reviewing stock market analyst estimates of water usage.',
      'Checking the company’s Instagram posts on World Water Day.'
    ],
    correctOptionIndex: 1,
    explanation: 'Reliable assurance evidence on water consumption entails corroborating reported extraction and discharge data against physical calibrated meter logs, utility billing records, Central Ground Water Authority (CGWA) extraction limits, effluent treatment plant (ETP) logs, and input-output mass-balance reconciliations.'
  },
  {
    id: 'AUD_CH18_09',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Under BRSR Principle 8 (Businesses should promote inclusive growth and equitable development), what statutory corporate expenditure under the Companies Act, 2013 is primarily audited and disclosed?',
    options: [
      'Political campaign advertisements.',
      'Corporate Social Responsibility (CSR) expenditure under Section 135 read with Schedule VII.',
      'Export promotion council membership fees.',
      'Director sitting fees and commission.'
    ],
    correctOptionIndex: 1,
    explanation: 'Principle 8 of the National Voluntary Guidelines (and BRSR) aligns with corporate community engagement and socio-economic development, centering on compliance with Section 135 (Corporate Social Responsibility) of the Companies Act, 2013, including CSR spending of 2% of average net profits, project implementation, and impact assessments.'
  },
  {
    id: 'AUD_CH18_10',
    subjectId: 'Audit',
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    questionText: 'Under the ICAI Social Audit Standards (SAS), what is the primary role of a certified Social Auditor?',
    options: [
      'To audit the company’s social media marketing accounts.',
      'To independently assess, evaluate, and verify the social impact achieved by Social Enterprises registered on the Social Stock Exchange (SSE) against their stated social objectives under the Social Audit Framework.',
      'To conduct labor strikes in factory premises.',
      'To audit personal friendships among board members.'
    ],
    correctOptionIndex: 1,
    explanation: 'A certified Social Auditor conducts social audit of Social Enterprises (For-Profit or Not-For-Profit) registered or listed on the Social Stock Exchange (SSE) in accordance with the Social Audit Standards (SAS) issued by ICAI, evaluating social impact metrics, stakeholder benefits, and fund deployment.'
  },

  // =========================================================================================
  // CHAPTER 19: PROFESSIONAL ETHICS & LIABILITIES OF AUDITORS
  // Target: 6 new MCQs (Total: 15)
  // ==========================================
  {
    id: 'AUD_CH19_01',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    questionText: 'Under Clause (8) of Part I of the First Schedule to the Chartered Accountants Act, 1949, a CA in practice is guilty of professional misconduct if they accept a position as auditor previously held by another CA without first communicating with them in writing. What constitutes VALID written communication under Council Guidelines?',
    options: [
      'A WhatsApp message sent 5 minutes before accepting the appointment.',
      'Communication by registered post acknowledgement due (RPAD), hand delivery with written acknowledgement, or a secure email address registered with ICAI before accepting the appointment.',
      'An oral phone call made to the predecessor auditor’s office clerk.',
      'Publishing a notice in a local regional newspaper.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Council Guidelines and numerous Disciplinary rulings, communication must be in writing before acceptance and must be by Registered Post with Acknowledgement Due, by hand delivery against a signed and stamped receipt, or through verified email to the registered email address of the member with ICAI. Oral communication or post-acceptance notice is invalid.'
  },
  {
    id: 'AUD_CH19_02',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    questionText: 'Under Clause (10) of Part I of the First Schedule to the CA Act, 1949, charging professional fees based on a percentage of profits or contingent upon results is misconduct. Under Regulation 192, which of the following is a PERMITTED EXCEPTION?',
    options: [
      'Statutory audit fees determined as 1% of net profit.',
      'Acting as a liquidator, receiver, valuer, or arbitrator; or services where fees are fixed by a court or statutory authority.',
      'Tax audit fees fixed at 10% of tax saved by the client.',
      'Internal audit fees determined as 5% of cost reduction achieved.'
    ],
    correctOptionIndex: 1,
    explanation: 'Regulation 192 of the Chartered Accountants Regulations, 1988 provides specific exceptions where fees can be percentage-based/contingent: (a) receiver or liquidator where fees are percentage of realization; (b) auditor of a co-operative society; (c) valuer for direct taxes; (d) certain debt recovery cases; (e) services where fees are fixed by a court or government authority.'
  },
  {
    id: 'AUD_CH19_03',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    questionText: 'Under Clause (4) of Part I of the Second Schedule to the CA Act, 1949, when does a CA in practice commit misconduct regarding substantial interest in an audit client?',
    options: [
      'If the CA holds even 1 share in a listed client through an open market mutual fund.',
      'If the CA expresses an opinion on financial statements of any business or enterprise in which the CA, their firm, or a partner in their firm has a SUBSTANTIAL INTEREST (holding 20% or more voting power/beneficial interest with relatives under Council Guidelines).',
      'If the CA opens a savings account with a public sector bank branch.',
      'If the CA’s brother works as an unpromoted junior factory worker.'
    ],
    correctOptionIndex: 1,
    explanation: 'Clause (4) Part I Second Schedule provides that a CA in practice is guilty of misconduct if they express an opinion on financial statements of any business/enterprise in which they, their firm, or a partner has a substantial interest. Council Guidelines define substantial interest as holding, individually or along with relatives, 20% or more of the voting power or beneficial interest in profits.'
  },
  {
    id: 'AUD_CH19_04',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    questionText: 'Under the ICAI Code of Ethics, what is NOCLAR (Responding to Non-Compliance with Laws and Regulations)?',
    options: [
      'A tax amnesty scheme launched by the Central Board of Direct Taxes.',
      'An ethical framework setting out the auditor’s professional responsibility to act when they encounter known or suspected illegal acts committed by a client (e.g., fraud, money laundering, corruption), including steps to discuss with TCWG and determine whether disclosure to appropriate public authorities is required.',
      'A software encryption protocol for audit working papers.',
      'A disciplinary penalty that suspends a CA’s membership for non-payment of annual fees.'
    ],
    correctOptionIndex: 1,
    explanation: 'NOCLAR (Responding to Non-Compliance with Laws and Regulations) is incorporated in the ICAI Code of Ethics (Sections 260 and 360). It guides auditors in evaluating the implications of non-compliance, discussing with management/TCWG, taking steps to deter or rectify, and determining whether further action, such as disclosing the matter to external regulatory authorities, is required in the public interest.'
  },
  {
    id: 'AUD_CH19_05',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    questionText: 'Under Section 132 of the Companies Act, 2013, what is the jurisdiction of the National Financial Reporting Authority (NFRA) regarding auditor misconduct?',
    options: [
      'NFRA has jurisdiction only over private companies with turnover below ₹50 Crores.',
      'NFRA has exclusive jurisdiction to investigate matters of professional misconduct committed by statutory auditors of listed companies and large unlisted public companies (paid-up capital ≥ ₹500 Cr, turnover ≥ ₹1000 Cr, or borrowings ≥ ₹500 Cr), banks, insurance, and electricity companies.',
      'NFRA can only mediate civil disputes between partners of an audit firm.',
      'NFRA reports directly to the local police commissioner.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Section 132(4) of the Companies Act, 2013 and NFRA Rules, 2018, NFRA has exclusive power to investigate professional misconduct of auditors of: (a) all listed companies; (b) unlisted public companies with paid-up capital ≥ ₹500 Cr, turnover ≥ ₹1000 Cr, or aggregate loans/borrowings/deposits ≥ ₹500 Cr; (c) banking, insurance, and electricity companies; and (d) foreign subsidiaries/associates whose income/net worth exceeds 20% of the parent company.'
  },
  {
    id: 'AUD_CH19_06',
    subjectId: 'Audit',
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    questionText: 'Under Clause (11) of Part I of the First Schedule to the CA Act, 1949, a CA in practice cannot engage in any business or occupation other than the profession of chartered accountancy without permission. Which of the following is covered under GENERAL PERMISSION of the Council?',
    options: [
      'Acting as a Full-time Managing Director of a commercial public company.',
      'Acting as a Non-Executive Director (Independent Director) in a company, or authoring books and articles on professional subjects.',
      'Operating a retail grocery supermarket.',
      'Working as a full-time real estate broker.'
    ],
    correctOptionIndex: 1,
    explanation: 'Under Council Regulation 190A and Appendix (9), General Permission is granted for certain activities: (1) Directorship in a company (provided the member/firm is not interested as auditor and does not hold executive powers); (2) Authoring books/articles; (3) Private tutoring; (4) Honorary editorship of journals; (5) Acting as an arbitrator. Full-time Managing Directorship requires prior SPECIFIC permission.'
  }
];
