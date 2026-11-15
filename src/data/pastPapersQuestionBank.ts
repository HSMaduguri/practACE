import type { SubjectId } from '../types.ts';
import {
  FOUNDATION_INTER_CHAPTERS_MAP,
  FOUNDATION_INTER_PAST_PAPERS,
} from './foundationAndInterPracticeData.ts';
import { CMA_CHAPTERS_MAP } from './cmaSyllabusData.ts';

export type AttemptCode = 'May-26' | 'Jan-26' | 'Sep-25' | 'May-25' | 'Nov-24' | 'May-24';
export type SubjectShortCode = SubjectId;

export interface PastPaperPdfEntry {
  attempt: AttemptCode;
  attemptLabel: string;
  subject: SubjectShortCode;
  qpUrl: string;
  saUrl: string;
}

export interface ExtractedPastPaperQuestion {
  id: string;
  subjectCode: SubjectShortCode;
  attempt: AttemptCode;
  attemptLabel: string;
  questionNumber: string;
  marks: number;
  chapterName: string;
  topicTag: string;
  questionText: string[];
  questionTable?: {
    headers: string[];
    rows: string[][];
  };
  suggestedAnswer: {
    provisionOrStandard: string[];
    analysisAndWorkings: string[];
    computationTable?: {
      headers: string[];
      rows: string[][];
    };
    conclusion: string;
  };
}

export const ATTEMPT_LIST: { code: AttemptCode; label: string }[] = [
  { code: 'May-26', label: 'May 2026' },
  { code: 'Jan-26', label: 'January 2026' },
  { code: 'Sep-25', label: 'September 2025' },
  { code: 'May-25', label: 'May 2025' },
  { code: 'Nov-24', label: 'November 2024' },
  { code: 'May-24', label: 'May 2024' },
];

export const SUBJECT_CHAPTERS_MAP: Record<SubjectShortCode, string[]> = {
  FR: [
    'Ind AS 115 Revenue',
    'Ind AS 103 Business Combination',
    'Consolidation',
    'Financial Instruments',
    'Ind AS 116 Leases',
    'Ind AS 102 Share Based Payment',
    'Ind AS 36 Impairment of Assets',
    'Ind AS 12 Income Taxes',
    'Ind AS 19 Employee Benefits',
    'Ind AS 16 Property Plant & Equipment',
    'Ind AS 38 Intangible Assets',
    'Ind AS 21 Forex',
    'Ind AS 33 Earnings Per Share',
    'Ind AS 105 Non Current Assets Held For Sale',
    'IND AS 37 Provisions, Contingent',
    'Ind AS 20 Accounting for Govt Grants',
    'Ind AS 23 Borrowing Costs',
    'Ind AS 108 Operating Segments',
    'Ind AS 101 First Time Adoption',
    'Analysis of FS',
    'Professional and Ethical Duty of CA',
    'Accounting & Tech',
  ],
  AFM: [
    'Advanced Capital Budgeting Decisions',
    'Security Valuation',
    'Portfolio Management',
    'Derivatives Analysis and Valuation',
    'Foreign Exchange Exposure and Risk Management',
    'Interest Rate Risk Management',
    'Mutual Funds',
    'Mergers, Acquisitions and Corporate Restructuring',
    'Business Valuation',
    'International Financial Management',
    'Securitization',
    'Startup Finance',
    'Financial Policy and Corporate Strategy',
    'Risk Management',
  ],
  Audit: [
    'Quality Control',
    'General Auditing Principles and Auditors Responsibilities',
    'Audit Planning, Strategy and Execution',
    'Materiality, Risk Assessment and Internal Control',
    'Audit Evidence',
    'Completion and Review',
    'Reporting',
    'Specialised Areas',
    'Related Services',
    'Review of Financial Information',
    'Prospective Financial Information and Other Assurance Services',
    'Digital Auditing & Assurance',
    'Group Audits',
    'Special Features of Audit of Banks & Non-Banking Financial Companies',
    'Overview of Audit of Public Sector Undertakings',
    'Internal Audit',
    'Due Diligence, Investigation & Forensic Audit',
    'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    'Professional Ethics & Liabilities of Auditors',
  ],
  DT: [
    'Profits and Gains of Business or Profession',
    'Capital Gains',
    'Assessment of Various Entities',
    'Assessment of Trusts and Institutions, Political Parties and Other Special Entities',
    'Deduction, Collection and Recovery of Tax',
    'Transfer Pricing',
    'Non Resident Taxation',
    'Double Taxation Relief',
    'Assessment Procedure',
    'Appeals and Revision',
    'Dispute Resolution',
    'Deductions from Gross Total Income',
    'Aggregation of Income, Set Off or Carry Forward of Losses',
    'Tax Planning, Tax Avoidance and Tax Evasion',
    'Taxation of Digital Transactions',
    'Provisions to Counteract Unethical Tax Practices',
    'Tax Audit and Ethical Compliances',
    'Application And Interpretation Of Tax Treaties',
    'Fundamentals Of Beps',
  ],
  IDT: [
    'Supply under GST',
    'Charge of GST',
    'Place of Supply',
    'Exemptions from GST',
    'Time of Supply',
    'Value of Supply',
    'Input Tax Credit',
    'Registration',
    'Tax Invoice, Credit & Debit Notes',
    'Payment of Tax',
    'Refunds',
    'Assessment and Audit',
    'Inspection, Search, Seizure and Arrest',
    'Demands and Recovery',
    'Offences and Penalties',
    'Appeals and Revision',
    'Advance Ruling',
    'Levy of and Exemptions from Customs Duty',
    'Valuation under the Customs Act, 1962',
    'Importation and Exportation of Goods',
    'Warehousing',
    'Foreign Trade Policy',
  ],
  IBS: [
    'Case Study: Ind AS & Financial Reporting Integration',
    'Case Study: Corporate Valuation, Forex & Treasury (AFM)',
    'Case Study: Statutory Audit, Group Audit & Professional Ethics',
    'Case Study: Direct Tax Restructuring & Cross-Border Taxation',
    'Case Study: GST Supply, ITC & Customs Valuation',
    'Case Study: FEMA, IBC & Corporate Governance',
  ],
  ...FOUNDATION_INTER_CHAPTERS_MAP,
  ...CMA_CHAPTERS_MAP,
};

export const PAST_PAPERS_PDF_MANIFEST: PastPaperPdfEntry[] = [
  // May-24
  { attempt: 'May-24', attemptLabel: 'May 2024', subject: 'FR', qpUrl: 'https://resource.cdn.icai.org/80128bos64233.pdf', saUrl: 'https://resource.cdn.icai.org/81680bos65858-p1.pdf' },
  { attempt: 'May-24', attemptLabel: 'May 2024', subject: 'AFM', qpUrl: 'https://resource.cdn.icai.org/80144bos64256.pdf', saUrl: 'https://resource.cdn.icai.org/81681bos65858-p2.pdf' },
  { attempt: 'May-24', attemptLabel: 'May 2024', subject: 'Audit', qpUrl: 'https://resource.cdn.icai.org/80192bos64339.pdf', saUrl: 'https://resource.cdn.icai.org/81682bos65858-p3.pdf' },
  { attempt: 'May-24', attemptLabel: 'May 2024', subject: 'DT', qpUrl: 'https://resource.cdn.icai.org/80261bos64418.pdf', saUrl: 'https://resource.cdn.icai.org/81683bos65858-p4.pdf' },
  { attempt: 'May-24', attemptLabel: 'May 2024', subject: 'IDT', qpUrl: 'https://resource.cdn.icai.org/80531bos64714-p5.pdf', saUrl: 'https://resource.cdn.icai.org/81684bos65858-p5.pdf' },
  { attempt: 'May-24', attemptLabel: 'May 2024', subject: 'IBS', qpUrl: 'https://resource.cdn.icai.org/80532bos64714-p6.pdf', saUrl: 'https://resource.cdn.icai.org/81685bos65858-p6.pdf' },
  // Nov-24
  { attempt: 'Nov-24', attemptLabel: 'November 2024', subject: 'FR', qpUrl: 'https://resource.cdn.icai.org/82721bos66806.pdf', saUrl: 'https://resource.cdn.icai.org/84423bos68027-p1.pdf' },
  { attempt: 'Nov-24', attemptLabel: 'November 2024', subject: 'AFM', qpUrl: 'https://resource.cdn.icai.org/82720bos66805.pdf', saUrl: 'https://resource.cdn.icai.org/84424bos68027-p2.pdf' },
  { attempt: 'Nov-24', attemptLabel: 'November 2024', subject: 'Audit', qpUrl: 'https://resource.cdn.icai.org/82760bos66833.pdf', saUrl: 'https://resource.cdn.icai.org/84425bos68027-p3.pdf' },
  { attempt: 'Nov-24', attemptLabel: 'November 2024', subject: 'DT', qpUrl: 'https://resource.cdn.icai.org/82790bos66863.pdf', saUrl: 'https://resource.cdn.icai.org/84426bos68027-p4.pdf' },
  { attempt: 'Nov-24', attemptLabel: 'November 2024', subject: 'IDT', qpUrl: 'https://resource.cdn.icai.org/82884bos66971p5.pdf', saUrl: 'https://resource.cdn.icai.org/84427bos68027-p5.pdf' },
  { attempt: 'Nov-24', attemptLabel: 'November 2024', subject: 'IBS', qpUrl: 'https://resource.cdn.icai.org/82885bos66971p6.pdf', saUrl: 'https://resource.cdn.icai.org/84428bos68027-p6.pdf' },
  // May-25
  { attempt: 'May-25', attemptLabel: 'May 2025', subject: 'FR', qpUrl: 'https://resource.cdn.icai.org/85768bos-aps471-final-p1.pdf', saUrl: 'https://resource.cdn.icai.org/86857bos-sa-final-may2025-g1-p1.pdf' },
  { attempt: 'May-25', attemptLabel: 'May 2025', subject: 'AFM', qpUrl: 'https://resource.cdn.icai.org/85769bos-aps471-final-p2.pdf', saUrl: 'https://resource.cdn.icai.org/86858bos-sa-final-may2025-g1-p2.pdf' },
  { attempt: 'May-25', attemptLabel: 'May 2025', subject: 'Audit', qpUrl: 'https://resource.cdn.icai.org/85945bos-aps471-final-p3.pdf', saUrl: 'https://resource.cdn.icai.org/86859bos-sa-final-may2025-g1-p3.pdf' },
  { attempt: 'May-25', attemptLabel: 'May 2025', subject: 'DT', qpUrl: 'https://resource.cdn.icai.org/85946bos-aps471-final-p4.pdf', saUrl: 'https://resource.cdn.icai.org/86860bos-sa-final-may2025-g2-p4.pdf' },
  { attempt: 'May-25', attemptLabel: 'May 2025', subject: 'IDT', qpUrl: 'https://resource.cdn.icai.org/85947bos-aps471-final-p5.pdf', saUrl: 'https://resource.cdn.icai.org/86861bos-sa-final-may2025-g2-p5.pdf' },
  { attempt: 'May-25', attemptLabel: 'May 2025', subject: 'IBS', qpUrl: 'https://resource.cdn.icai.org/85948bos-aps471-final-p6.pdf', saUrl: 'https://resource.cdn.icai.org/86862bos-sa-final-may2025-g2-p6.pdf' },
  // Sep-25
  { attempt: 'Sep-25', attemptLabel: 'September 2025', subject: 'FR', qpUrl: 'https://resource.cdn.icai.org/88181bos-aps2265-final-p1.pdf', saUrl: 'https://resource.cdn.icai.org/89276bos-aps3012-final-p1.pdf' },
  { attempt: 'Sep-25', attemptLabel: 'September 2025', subject: 'AFM', qpUrl: 'https://resource.cdn.icai.org/88182bos-aps2265-final-p2.pdf', saUrl: 'https://resource.cdn.icai.org/89277bos-aps3012-final-p2.pdf' },
  { attempt: 'Sep-25', attemptLabel: 'September 2025', subject: 'Audit', qpUrl: 'https://resource.cdn.icai.org/88298bos-final160925-p3.pdf', saUrl: 'https://resource.cdn.icai.org/89278bos-aps3012-final-p3.pdf' },
  { attempt: 'Sep-25', attemptLabel: 'September 2025', subject: 'DT', qpUrl: 'https://resource.cdn.icai.org/88299bos-final160925-p4.pdf', saUrl: 'https://resource.cdn.icai.org/89279bos-aps3012-final-p4.pdf' },
  { attempt: 'Sep-25', attemptLabel: 'September 2025', subject: 'IDT', qpUrl: 'https://resource.cdn.icai.org/88300bos-final160925-p5.pdf', saUrl: 'https://resource.cdn.icai.org/89280bos-aps3012-final-p5.pdf' },
  { attempt: 'Sep-25', attemptLabel: 'September 2025', subject: 'IBS', qpUrl: 'https://resource.cdn.icai.org/88274bos-aps2265-final-p6.pdf', saUrl: 'https://resource.cdn.icai.org/89281bos-aps3012-final-p6.pdf' },
  // Jan-26
  { attempt: 'Jan-26', attemptLabel: 'January 2026', subject: 'FR', qpUrl: 'https://resource.cdn.icai.org/90237bos-aps3809-final-p1.pdf', saUrl: 'https://resource.cdn.icai.org/91141bos-aps4314-sa-jan2026-p1.pdf' },
  { attempt: 'Jan-26', attemptLabel: 'January 2026', subject: 'AFM', qpUrl: 'https://resource.cdn.icai.org/90270bos-aps3809-final-p2.pdf', saUrl: 'https://resource.cdn.icai.org/91147bos-aps4314-sa-jan2026-p2.pdf' },
  { attempt: 'Jan-26', attemptLabel: 'January 2026', subject: 'Audit', qpUrl: 'https://resource.cdn.icai.org/90287bos-aps3809-final-p3.pdf', saUrl: 'https://resource.cdn.icai.org/91143bos-aps4314-sa-jan2026-p3.pdf' },
  { attempt: 'Jan-26', attemptLabel: 'January 2026', subject: 'DT', qpUrl: 'https://resource.cdn.icai.org/90293bos-aps3809-final-p4.pdf', saUrl: 'https://resource.cdn.icai.org/91144bos-aps4314-sa-jan2026-p4.pdf' },
  { attempt: 'Jan-26', attemptLabel: 'January 2026', subject: 'IDT', qpUrl: 'https://resource.cdn.icai.org/90320bos-aps3809-final-p5.pdf', saUrl: 'https://resource.cdn.icai.org/91145bos-aps4314-sa-jan2026-p5.pdf' },
  { attempt: 'Jan-26', attemptLabel: 'January 2026', subject: 'IBS', qpUrl: 'https://resource.cdn.icai.org/90368bos-aps3809-final-p6.pdf', saUrl: 'https://resource.cdn.icai.org/91146bos-aps4314-sa-jan2026-p6.pdf' },
  // May-26
  { attempt: 'May-26', attemptLabel: 'May 2026', subject: 'FR', qpUrl: 'https://resource.cdn.icai.org/92055bos-aps4903-final-may2026-p1.pdf', saUrl: 'https://resource.cdn.icai.org/92765bos-sa-final-may2026-p1.pdf' },
  { attempt: 'May-26', attemptLabel: 'May 2026', subject: 'AFM', qpUrl: 'https://resource.cdn.icai.org/92056bos-aps4903-final-may2026-p2.pdf', saUrl: 'https://resource.cdn.icai.org/92766bos-sa-final-may2026-p2.pdf' },
  { attempt: 'May-26', attemptLabel: 'May 2026', subject: 'Audit', qpUrl: 'https://resource.cdn.icai.org/92098bos-aps4903-final-may2026-p3.pdf', saUrl: 'https://resource.cdn.icai.org/92767bos-sa-final-may2026-p3.pdf' },
  { attempt: 'May-26', attemptLabel: 'May 2026', subject: 'DT', qpUrl: 'https://resource.cdn.icai.org/92141bos-aps4903-final-may2026-p4.pdf', saUrl: 'https://resource.cdn.icai.org/92768bos-sa-final-may2026-p4.pdf' },
  { attempt: 'May-26', attemptLabel: 'May 2026', subject: 'IDT', qpUrl: 'https://resource.cdn.icai.org/92142bos-aps4903-final-may2026-p5.pdf', saUrl: 'https://resource.cdn.icai.org/92769bos-sa-final-may2026-p5.pdf' },
  { attempt: 'May-26', attemptLabel: 'May 2026', subject: 'IBS', qpUrl: 'https://resource.cdn.icai.org/92220bos-aps4903-final-may2026-p6.pdf', saUrl: 'https://resource.cdn.icai.org/92770bos-sa-final-may2026-p6.pdf' },
];

/**
 * Automatic background chapter-tagging classifier for extracted PDF text blocks.
 */
export function inferChapterForQuestion(subjectCode: SubjectShortCode, rawText: string): string {
  const t = rawText.toLowerCase();
  if (subjectCode === 'FR') {
    if (t.includes('ind as 115') || t.includes('performance obligation') || t.includes('transaction price') || t.includes('contract asset')) return 'Ind AS 115 Revenue';
    if (t.includes('ind as 103') || t.includes('business combination') || t.includes('goodwill') || t.includes('bargain purchase')) return 'Ind AS 103 Business Combination';
    if (t.includes('ind as 110') || t.includes('consolidated') || t.includes('non-controlling interest') || t.includes('subsidiary')) return 'Consolidation';
    if (t.includes('ind as 109') || t.includes('ind as 32') || t.includes('amortised cost') || t.includes('fvtoci') || t.includes('fvtpl') || t.includes('compound financial')) return 'Financial Instruments';
    if (t.includes('ind as 116') || t.includes('right-of-use') || t.includes('lease liability') || t.includes('lessor')) return 'Ind AS 116 Leases';
    if (t.includes('ind as 102') || t.includes('share-based') || t.includes('esop') || t.includes('sar') || t.includes('vesting')) return 'Ind AS 102 Share Based Payment';
    if (t.includes('ind as 36') || t.includes('recoverable amount') || t.includes('value in use') || t.includes('cash generating unit') || t.includes('cgu')) return 'Ind AS 36 Impairment of Assets';
    if (t.includes('ind as 12') || t.includes('deferred tax') || t.includes('tax base') || t.includes('temporary difference')) return 'Ind AS 12 Income Taxes';
    if (t.includes('ind as 19') || t.includes('defined benefit') || t.includes('actuarial') || t.includes('plan assets')) return 'Ind AS 19 Employee Benefits';
    if (t.includes('ind as 16') || t.includes('revaluation') || t.includes('decommissioning') || t.includes('property, plant')) return 'Ind AS 16 Property Plant & Equipment';
    if (t.includes('ind as 38') || t.includes('intangible') || t.includes('research and development')) return 'Ind AS 38 Intangible Assets';
    if (t.includes('ind as 21') || t.includes('functional currency') || t.includes('exchange difference')) return 'Ind AS 21 Forex';
    if (t.includes('ind as 33') || t.includes('diluted eps') || t.includes('basic eps') || t.includes('earnings per share')) return 'Ind AS 33 Earnings Per Share';
    if (t.includes('ind as 105') || t.includes('held for sale') || t.includes('discontinued operation')) return 'Ind AS 105 Non Current Assets Held For Sale';
    if (t.includes('ind as 37') || t.includes('restructuring provision') || t.includes('onerous contract') || t.includes('contingent')) return 'IND AS 37 Provisions, Contingent';
    if (t.includes('ind as 20') || t.includes('government grant')) return 'Ind AS 20 Accounting for Govt Grants';
    if (t.includes('ind as 23') || t.includes('qualifying asset') || t.includes('capitalisation rate')) return 'Ind AS 23 Borrowing Costs';
    if (t.includes('ind as 108') || t.includes('operating segment')) return 'Ind AS 108 Operating Segments';
    if (t.includes('ind as 101') || t.includes('first-time adoption')) return 'Ind AS 101 First Time Adoption';
    if (t.includes('ethical') || t.includes('chartered accountants act')) return 'Professional and Ethical Duty of CA';
    return 'Ind AS 115 Revenue';
  }
  if (subjectCode === 'AFM') {
    if (t.includes('npv') || t.includes('replacement') || t.includes('sensitivity') || t.includes('certainty equivalent') || t.includes('capital budgeting')) return 'Advanced Capital Budgeting Decisions';
    if (t.includes('bond') || t.includes('ytm') || t.includes('duration') || t.includes('gordon') || t.includes('fcfe') || t.includes('fcff')) return 'Security Valuation';
    if (t.includes('capm') || t.includes('beta') || t.includes('sharpe') || t.includes('treynor') || t.includes('jensen') || t.includes('portfolio')) return 'Portfolio Management';
    if (t.includes('futures') || t.includes('option') || t.includes('black-scholes') || t.includes('binomial') || t.includes('hedging')) return 'Derivatives Analysis and Valuation';
    if (t.includes('forward') || t.includes('money market hedge') || t.includes('nostro') || t.includes('exchange rate') || t.includes('cancellation of forward')) return 'Foreign Exchange Exposure and Risk Management';
    if (t.includes('fra') || t.includes('interest rate swap') || t.includes('cap') || t.includes('floor') || t.includes('collar')) return 'Interest Rate Risk Management';
    if (t.includes('nav') || t.includes('mutual fund') || t.includes('expense ratio')) return 'Mutual Funds';
    if (t.includes('swap ratio') || t.includes('merger') || t.includes('acquisition') || t.includes('takeover')) return 'Mergers, Acquisitions and Corporate Restructuring';
    if (t.includes('eva') || t.includes('mva') || t.includes('enterprise value') || t.includes('business valuation')) return 'Business Valuation';
    if (t.includes('gdr') || t.includes('adr') || t.includes('adjusted present value') || t.includes('apv')) return 'International Financial Management';
    if (t.includes('spv') || t.includes('pass through certificate') || t.includes('securitization')) return 'Securitization';
    if (t.includes('venture capital') || t.includes('angel') || t.includes('startup') || t.includes('unicorn')) return 'Startup Finance';
    if (t.includes('value at risk') || t.includes('var')) return 'Risk Management';
    return 'Security Valuation';
  }
  if (subjectCode === 'Audit') {
    if (t.includes('sqc 1') || t.includes('sa 220') || t.includes('eqcr') || t.includes('quality control')) return 'Quality Control';
    if (t.includes('sa 240') || t.includes('sa 250') || t.includes('sa 260') || t.includes('fraud')) return 'General Auditing Principles and Auditors Responsibilities';
    if (t.includes('sa 300') || t.includes('sa 600') || t.includes('sa 610') || t.includes('sa 620')) return 'Audit Planning, Strategy and Execution';
    if (t.includes('sa 315') || t.includes('sa 320') || t.includes('sa 330') || t.includes('materiality') || t.includes('internal control')) return 'Materiality, Risk Assessment and Internal Control';
    if (t.includes('sa 500') || t.includes('sa 501') || t.includes('sa 505') || t.includes('sa 530') || t.includes('sa 550')) return 'Audit Evidence';
    if (t.includes('sa 560') || t.includes('sa 570') || t.includes('sa 580') || t.includes('going concern') || t.includes('subsequent event')) return 'Completion and Review';
    if (t.includes('sa 700') || t.includes('sa 701') || t.includes('sa 705') || t.includes('sa 706') || t.includes('caro') || t.includes('key audit matter')) return 'Reporting';
    if (t.includes('sa 800') || t.includes('sa 805') || t.includes('sa 810')) return 'Specialised Areas';
    if (t.includes('srs 4400') || t.includes('srs 4410') || t.includes('compilation')) return 'Related Services';
    if (t.includes('sre 2400') || t.includes('sre 2410')) return 'Review of Financial Information';
    if (t.includes('sae 3400') || t.includes('sae 3402') || t.includes('sae 3420')) return 'Prospective Financial Information and Other Assurance Services';
    if (t.includes('cyber') || t.includes('rpa') || t.includes('blockchain') || t.includes('digital audit') || t.includes('automated')) return 'Digital Auditing & Assurance';
    if (t.includes('cfs') || t.includes('component auditor') || t.includes('group audit')) return 'Group Audits';
    if (t.includes('npa') || t.includes('nbfc') || t.includes('crar') || t.includes('drawing power') || t.includes('bank audit')) return 'Special Features of Audit of Banks & Non-Banking Financial Companies';
    if (t.includes('c&ag') || t.includes('performance audit') || t.includes('propriety audit') || t.includes('psu')) return 'Overview of Audit of Public Sector Undertakings';
    if (t.includes('section 138') || t.includes('internal audit')) return 'Internal Audit';
    if (t.includes('due diligence') || t.includes('forensic') || t.includes('investigation')) return 'Due Diligence, Investigation & Forensic Audit';
    if (t.includes('brsr') || t.includes('esg') || t.includes('sustainability')) return 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance';
    if (t.includes('first schedule') || t.includes('second schedule') || t.includes('misconduct') || t.includes('clause')) return 'Professional Ethics & Liabilities of Auditors';
    return 'Reporting';
  }
  if (subjectCode === 'DT') {
    if (t.includes('section 28') || t.includes('section 32') || t.includes('section 43b') || t.includes('40(a)(ia)') || t.includes('115baa') || t.includes('115bab') || t.includes('pgbp')) return 'Profits and Gains of Business or Profession';
    if (t.includes('50b') || t.includes('slump sale') || t.includes('45(4)') || t.includes('9b') || t.includes('112a') || t.includes('54') || t.includes('capital gain')) return 'Capital Gains';
    if (t.includes('115jb') || t.includes('mat') || t.includes('amt') || t.includes('reit') || t.includes('invit') || t.includes('securitisation trust') || t.includes('buy-back') || t.includes('tonnage')) return 'Assessment of Various Entities';
    if (t.includes('section 11') || t.includes('section 12ab') || t.includes('115bbi') || t.includes('115td') || t.includes('exit tax') || t.includes('charitable trust')) return 'Assessment of Trusts and Institutions, Political Parties and Other Special Entities';
    if (t.includes('194r') || t.includes('194q') || t.includes('194ba') || t.includes('195') || t.includes('206c') || t.includes('tds') || t.includes('tcs')) return 'Deduction, Collection and Recovery of Tax';
    if (t.includes('92c') || t.includes('92ce') || t.includes('94b') || t.includes('arm\'s length') || t.includes('secondary adjustment') || t.includes('apa') || t.includes('transfer pricing')) return 'Transfer Pricing';
    if (t.includes('section 9(') || t.includes('business connection') || t.includes('royalty') || t.includes('fts') || t.includes('115a') || t.includes('44b') || t.includes('non-resident')) return 'Non Resident Taxation';
    if (t.includes('section 91') || t.includes('section 90') || t.includes('dtaa') || t.includes('foreign tax credit') || t.includes('rule 128')) return 'Double Taxation Relief';
    if (t.includes('148') || t.includes('148a') || t.includes('143(3)') || t.includes('144b') || t.includes('153') || t.includes('reassessment')) return 'Assessment Procedure';
    if (t.includes('263') || t.includes('264') || t.includes('254') || t.includes('itat') || t.includes('cit(appeals)')) return 'Appeals and Revision';
    if (t.includes('245ma') || t.includes('dispute resolution committee') || t.includes('245q') || t.includes('board for advance rulings')) return 'Dispute Resolution';
    if (t.includes('80jjjaa') || t.includes('80m') || t.includes('80-iac') || t.includes('10aa')) return 'Deductions from Gross Total Income';
    if (t.includes('section 79') || t.includes('72a') || t.includes('set off')) return 'Aggregation of Income, Set Off or Carry Forward of Losses';
    if (t.includes('gaar') || t.includes('section 96') || t.includes('impermissible avoidance')) return 'Tax Planning, Tax Avoidance and Tax Evasion';
    if (t.includes('115bbh') || t.includes('virtual digital asset') || t.includes('194s') || t.includes('equalisation levy')) return 'Taxation of Digital Transactions';
    if (t.includes('269ss') || t.includes('269st') || t.includes('269t') || t.includes('270a') || t.includes('black money')) return 'Provisions to Counteract Unethical Tax Practices';
    if (t.includes('beps') || t.includes('pillar two') || t.includes('mli') || t.includes('principal purpose test')) return 'Fundamentals Of Beps';
    return 'Profits and Gains of Business or Profession';
  }
  if (subjectCode === 'IDT') {
    if (t.includes('section 7') || t.includes('schedule i') || t.includes('schedule ii') || t.includes('schedule iii') || t.includes('composite supply') || t.includes('mixed supply')) return 'Supply under GST';
    if (t.includes('9(3)') || t.includes('reverse charge') || t.includes('rcm') || t.includes('section 10') || t.includes('composition') || t.includes('eco') || t.includes('9(5)')) return 'Charge of GST';
    if (t.includes('section 10 of igst') || t.includes('section 12 of igst') || t.includes('section 13 of igst') || t.includes('intermediary') || t.includes('place of supply')) return 'Place of Supply';
    if (t.includes('12/2017') || t.includes('healthcare') || t.includes('education') || t.includes('renting of residential') || t.includes('exemption')) return 'Exemptions from GST';
    if (t.includes('section 12') || t.includes('section 13') || t.includes('time of supply') || t.includes('voucher')) return 'Time of Supply';
    if (t.includes('section 15') || t.includes('rule 27') || t.includes('rule 28') || t.includes('rule 32') || t.includes('pure agent') || t.includes('subsidy') || t.includes('corporate guarantee')) return 'Value of Supply';
    if (t.includes('section 16') || t.includes('section 17(5)') || t.includes('rule 42') || t.includes('rule 43') || t.includes('rule 86b') || t.includes('blocked credit') || t.includes('itc')) return 'Input Tax Credit';
    if (t.includes('section 22') || t.includes('section 24') || t.includes('section 29') || t.includes('cancellation of registration')) return 'Registration';
    if (t.includes('e-invoicing') || t.includes('credit note') || t.includes('section 34') || t.includes('e-way bill') || t.includes('rule 138')) return 'Tax Invoice, Credit & Debit Notes';
    if (t.includes('section 49') || t.includes('section 50') || t.includes('rule 88b') || t.includes('electronic cash ledger') || t.includes('interest on delayed')) return 'Payment of Tax';
    if (t.includes('section 54') || t.includes('rule 89') || t.includes('inverted duty') || t.includes('zero-rated') || t.includes('refund')) return 'Refunds';
    if (t.includes('section 67') || t.includes('section 69') || t.includes('section 129') || t.includes('section 130') || t.includes('inspection') || t.includes('seizure')) return 'Inspection, Search, Seizure and Arrest';
    if (t.includes('section 73') || t.includes('section 74') || t.includes('section 74a') || t.includes('section 79') || t.includes('section 83') || t.includes('provisional attachment')) return 'Demands and Recovery';
    if (t.includes('section 122') || t.includes('section 132') || t.includes('penalty')) return 'Offences and Penalties';
    if (t.includes('section 107') || t.includes('section 112') || t.includes('pre-deposit') || t.includes('appellate tribunal')) return 'Appeals and Revision';
    if (t.includes('customs') || t.includes('rule 10') || t.includes('section 14 of customs') || t.includes('baggage') || t.includes('warehousing') || t.includes('section 61') || t.includes('duty drawback')) return 'Valuation under the Customs Act, 1962';
    if (t.includes('rodtep') || t.includes('epcg') || t.includes('advance authorisation') || t.includes('foreign trade policy')) return 'Foreign Trade Policy';
    return 'Input Tax Credit';
  }
  return 'Case Study: Ind AS & Financial Reporting Integration';
}

/**
 * Comprehensive Pre-Extracted CA Final Past Paper Question & Suggested Answer Bank
 * Covers FR, AFM, Audit, DT, IDT, IBS across May-26, Jan-26, Sep-25, May-25, Nov-24, May-24.
 */
export const INITIAL_PAST_PAPER_QUESTION_BANK: ExtractedPastPaperQuestion[] = [
  // ==========================================================================
  // PAPER 1: FINANCIAL REPORTING (FR)
  // ==========================================================================
  {
    id: 'fr-may26-q1a',
    subjectCode: 'FR',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Question 1(a)',
    marks: 14,
    chapterName: 'Consolidation',
    topicTag: 'Ind AS 110 & Ind AS 103 — Step Acquisition, Fair Value Differential & Goodwill Impairment',
    questionText: [
      'Apex Global Ltd. held a 25% equity interest in Zenith Tech Ltd. (classified at FVTOCI) carrying at ₹420 Lakhs as on 31st March 2025. On 1st April 2025, Apex Global Ltd. acquired an additional 45% equity stake in Zenith Tech Ltd. for a cash consideration of ₹990 Lakhs, thereby obtaining control (total holding 70%).',
      'As on 1st April 2025, the identifiable net assets of Zenith Tech Ltd. had a carrying amount of ₹1,500 Lakhs (Equity Share Capital ₹600 Lakhs; Other Equity ₹900 Lakhs). Fair valuation on acquisition date revealed:',
      '• A patented software with a remaining useful life of 5 years was unrecognized in Zenith’s books; its fair value on 1st April 2025 was ₹200 Lakhs.',
      '• Land had a fair value ₹150 Lakhs above its carrying amount.',
      '• Contingent liability disclosed in notes of Zenith Tech Ltd. (present obligation from a pending patent suit) had a reliable fair value of ₹50 Lakhs.',
      'Apex Global Ltd. elects to measure Non-Controlling Interest (NCI) at its proportionate share of identifiable net assets. Fair value of the previously held 25% equity stake on 1st April 2025 was ₹525 Lakhs.',
      'During FY 2025-26, Zenith Tech Ltd. earned a post-acquisition profit of ₹320 Lakhs and sold goods worth ₹120 Lakhs to Apex Global Ltd. at a mark-up of 25% on cost, of which 40% remained unsold in Apex’s closing inventory as on 31st March 2026.',
      'Compute: (i) Goodwill on acquisition as on 1st April 2025, (ii) Non-Controlling Interest as on 1st April 2025 and 31st March 2026, and (iii) Consolidated Post-Acquisition Reserves adjustment as on 31st March 2026.'
    ],
    questionTable: {
      headers: ['Particulars (As on 1st April 2025)', 'Amount (₹ in Lakhs)'],
      rows: [
        ['Carrying Amount of Identifiable Net Assets of Zenith Tech Ltd.', '1,500.00'],
        ['Fair Value of Unrecognized Patented Software (5-year life)', '200.00'],
        ['Fair Value Appreciation on Land (Non-depreciable)', '150.00'],
        ['Fair Value of Assumed Contingent Liability (Present Obligation)', '(50.00)'],
        ['Cash Consideration for Additional 45% Stake', '990.00'],
        ['Fair Value of Previously Held 25% Stake on Acquisition Date', '525.00']
      ]
    },
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Ind AS 103 (Business Combinations), in a business combination achieved in stages (step acquisition), the acquirer remeasures its previously held equity interest in the acquiree at its acquisition-date fair value. Since the 25% stake was classified at FVTOCI, theremeasurement gain of ₹105 Lakhs (₹525L − ₹420L) is recognized in Other Comprehensive Income and may be transferred directly to Retained Earnings.',
        'Under Ind AS 103, the acquirer recognizes at the acquisition date: (a) identifiable intangible assets (₹200L software) even if not previously recognized by the acquiree, and (b) contingent liabilities assumed if there is a present obligation from past events and its fair value can be measured reliably (₹50L), even if outflow is not probable.',
        'Upstream unrealized profit on inventory (Subsidiary to Parent) is eliminated in full against the Subsidiary’s post-acquisition profits, and shared between the Parent (70%) and Non-Controlling Interest (30%).'
      ],
      analysisAndWorkings: [
        '1. Fair Value of Identifiable Net Assets on 1st April 2025 = ₹1,500L (Book Value) + ₹200L (Software) + ₹150L (Land) − ₹50L (Contingent Liability) = ₹1,800 Lakhs.',
        '2. Non-Controlling Interest (30%) on 1st April 2025 (PSNA Method) = 30% × ₹1,800 Lakhs = ₹540 Lakhs.',
        '3. Goodwill on 1st April 2025 = Cash Consideration (₹990L) + Fair Value of 25% Stake (₹525L) + NCI (₹540L) − Identifiable Net Assets (₹1,800L) = ₹2,055L − ₹1,800L = ₹255 Lakhs.',
        '4. Post-Acquisition Adjusted Profit of Zenith Tech Ltd. for FY 2025-26: Reported Profit ₹320L − Additional Amortization on Patented Software (₹200L / 5 = ₹40L) − Upstream Unrealized Profit on Inventory (₹120L × 25/125 × 40% = ₹9.60L) = ₹270.40 Lakhs.',
        '5. Allocation of Adjusted Post-Acquisition Profit (₹270.40L): Parent’s Share (70%) = ₹189.28 Lakhs; NCI’s Share (30%) = ₹81.12 Lakhs.'
      ],
      computationTable: {
        headers: ['Component', 'Working Formula', 'Amount (₹ in Lakhs)'],
        rows: [
          ['Identifiable Net Assets on Acquisition Date', '1,500 + 200 + 150 − 50', '1,800.00'],
          ['NCI on 01.04.2025 (30% of Net Assets)', '30% × 1,800.00', '540.00'],
          ['Goodwill on Acquisition (01.04.2025)', '(990 + 525 + 540) − 1,800', '255.00'],
          ['Adjusted Post-Acquisition Profit (FY 25-26)', '320.00 − 40.00 − 9.60', '270.40'],
          ['Closing NCI as on 31.03.2026', '540.00 + (30% × 270.40)', '621.12'],
          ['Parent Share of Post-Acq Profit + OCI Gain', '189.28 + (525 − 420)', '294.28']
        ]
      },
      conclusion: 'Goodwill on acquisition is ₹255.00 Lakhs; Closing Non-Controlling Interest as on 31st March 2026 is ₹621.12 Lakhs; Parent’s share of post-acquisition profit is ₹189.28 Lakhs plus ₹105.00 Lakhs FVTOCI remeasurement gain.'
    }
  },
  {
    id: 'fr-may26-q2a',
    subjectCode: 'FR',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Question 2(a)',
    marks: 8,
    chapterName: 'Ind AS 115 Revenue',
    topicTag: 'Contract Modification, Variable Consideration & Stand-Alone Selling Price Allocation',
    questionText: [
      'Orion Infra Ltd. enters into a contract with a customer on 1st April 2025 to supply and install 100 specialized solar turbines at a promised consideration of ₹50,000 per turbine (Total ₹50,00,000). Control of each turbine transfers upon delivery and installation.',
      'By 30th September 2025, Orion Infra Ltd. had delivered and installed 60 turbines. On 1st October 2025, the contract is modified to deliver an additional 40 turbines at a negotiated price of ₹38,000 per turbine.',
      'The stand-alone selling price (SASP) of each turbine on 1st October 2025 is ₹45,000. The additional 40 turbines are distinct from the original 100 turbines, bug the price of ₹38,000 does not reflect the stand-alone selling price.',
      'In addition, if all 140 turbines are installed by 15th March 2026, Orion Infra Ltd. is entitled to a performance bonus of ₹2,80,000. On 1st October 2025, management estimates an 85% probability of completing installation by 15th March 2026 (highly probable that significant reversal will not occur).',
      'Determine the accounting treatment of the contract modification and calculate the revenue to be recognized per turbine for the remaining 80 turbines in FY 2025-26.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Para 20 & 21(a) of Ind AS 115, when a contract modification adds distinct goods/services at a price that does NOT reflect their stand-alone selling price, and the remaining goods/services are distinct from those already transferred, the entity accounts for the modification prospectively as a termination of the existing contract and the creation of a new contract.',
        'Under Para 53 & 56 of Ind AS 115, variable consideration (performance bonus with two binary outcomes) is estimated using the "Most Likely Amount" method and included in the transaction price only to the extent it is highly probable that a significant reversal of cumulative revenue will not occur.'
      ],
      analysisAndWorkings: [
        '1. Revenue already recognized up to 30th September 2025 (60 turbines × ₹50,000) = ₹30,00,000 (not adjusted retrospectively).',
        '2. Unrecognized consideration from original contract (40 remaining turbines × ₹50,000) = ₹20,00,000.',
        '3. Consideration for additional 40 turbines under modification (40 × ₹38,000) = ₹15,20,000.',
        '4. Variable Consideration (Performance Bonus): Since 85% probability satisfies the "highly probable" constraint under Most Likely Amount method, include ₹2,80,000.',
        '5. Total Blended Transaction Price for remaining 80 turbines (40 original + 40 new) = ₹20,00,000 + ₹15,20,000 + ₹2,80,000 = ₹38,00,000.',
        '6. Revenue to be recognized per turbine for each of the remaining 80 turbines = ₹38,00,000 / 80 = ₹47,500 per turbine.'
      ],
      conclusion: 'The modification is accounted for prospectively as a termination of the old contract and creation of a new contract. Orion Infra Ltd. will recognize ₹30,00,000 for the first 60 turbines and ₹47,500 per turbine (total ₹38,00,000) across the remaining 80 turbines.'
    }
  },
  {
    id: 'fr-jan26-q1b',
    subjectCode: 'FR',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Question 1(b)',
    marks: 10,
    chapterName: 'Financial Instruments',
    topicTag: 'Ind AS 32 & Ind AS 109 — Compound Financial Instrument with Early Conversion Modification',
    questionText: [
      'On 1st April 2023, Vega Corp Ltd. issued 50,000, 6% Convertible Debentures of ₹100 each (Total ₹50,00,000) redeemable at par after 4 years, or convertible into 2 equity shares of ₹10 each per debenture at the option of the holder at maturity.',
      'The prevailing market interest rate for similar non-convertible debt on 1st April 2023 was 10% p.a. (PV factors at 10%: Year 1 = 0.9091, Year 2 = 0.8264, Year 3 = 0.7513, Year 4 = 0.6830; Cumulative PVAF(10%, 4 yrs) = 3.1698).',
      'On 31st March 2025 (after paying Year 2 interest), to induce early conversion and reduce leverage, Vega Corp Ltd. offered an revised conversion ratio of 2.5 equity shares per debenture if holders convert immediately on 31st March 2025. The market price of one equity share on 31st March 2025 was ₹64. All debenture holders accepted the induced early conversion.',
      'Show the initial split of the compound instrument on 1st April 2023 and the accounting entry for induced conversion on 31st March 2025.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Ind AS 32, a convertible debenture with a fixed-for-fixed conversion option is a compound financial instrument. The liability component is measured first at the present value of contractual cash flows discounted at the market rate for non-convertible debt (10%), and the residual is allocated to Other Equity (Equity Component).',
        'When an issuer amends conversion terms to induce early conversion, the fair value of the additional consideration (additional equity shares issued) measured at the date of amendment is recognized immediately as a loss in the Statement of Profit and Loss.'
      ],
      analysisAndWorkings: [
        '1. Annual Interest Outflow = ₹50,00,000 × 6% = ₹3,00,000.',
        '2. Initial Financial Liability on 01.04.2023 = (₹3,00,000 × 3.1698) + (₹50,00,000 × 0.6830) = ₹9,50,940 + ₹34,15,000 = ₹43,65,940.',
        '3. Equity Component on 01.04.2023 = ₹50,00,000 − ₹43,65,940 = ₹6,34,060.',
        '4. Amortised Cost of Liability as on 31.03.2025: Opening (01.04.23) = ₹43,65,940; Closing Y1 (31.03.24) = 43,65,940 + 4,36,594 − 3,00,000 = ₹45,02,534; Closing Y2 (31.03.25) = 45,02,534 + 4,50,253 − 3,00,000 = ₹46,52,787.',
        '5. Additional Shares Issued to Induce Conversion = 50,000 debentures × (2.5 − 2.0) = 25,000 incremental equity shares.',
        '6. Induced Conversion Expense (P&L Loss) = 25,000 shares × ₹64 (Fair Value per share) = ₹16,00,000.'
      ],
      computationTable: {
        headers: ['Year Ended', 'Opening Liability (₹)', 'Finance Cost @ 10% (₹)', 'Cash Coupon @ 6% (₹)', 'Closing Liability (₹)'],
        rows: [
          ['31.03.2024', '43,65,940', '4,36,594', '3,00,000', '45,02,534'],
          ['31.03.2025', '45,02,534', '4,50,253', '3,00,000', '46,52,787']
        ]
      },
      conclusion: 'On 31st March 2025, Vega Corp Ltd. derecognizes Financial Liability of ₹46,52,787, recognizes Induced Conversion Loss of ₹16,00,000 in P&L, transfers Equity Component ₹6,34,060, and credits Equity Share Capital (1,25,000 shares × ₹10 = ₹12,50,000) and Securities Premium (₹56,36,847).'
    }
  },
  {
    id: 'fr-sep25-q3a',
    subjectCode: 'FR',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Question 3(a)',
    marks: 8,
    chapterName: 'Ind AS 116 Leases',
    topicTag: 'Lease Modification Decreasing Scope & Term',
    questionText: [
      'Metro Retail Ltd. entered into a 6-year lease for 10,000 sq. ft. of commercial space on 1st April 2022 at an annual lease payment of ₹12,00,000 payable at the end of each year. The incremental borrowing rate on 1st April 2022 was 8% p.a. (PVAF(8%, 6 yrs) = 4.6229; PVAF(8%, 3 yrs) = 2.5771).',
      'On 1st April 2025 (beginning of Year 4), Metro Retail Ltd. and the lessor agreed to reduce the leased space from 10,000 sq. ft. to 6,000 sq. ft. (a 40% reduction in scope) for the remaining 3 years at a revised annual rental of ₹7,80,000 payable at year-end.',
      'The lessee’s revised incremental borrowing rate on 1st April 2025 is 9% p.a. (PVAF(9%, 3 yrs) = 2.5313).',
      'Calculate the gain/loss on partial termination and the revised Right-of-Use (ROU) Asset and Lease Liability as on 1st April 2025.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Para 44–46 of Ind AS 116, for a lease modification that is not accounted for as a separate lease and decreases the scope of the lease (40% reduction in floor space):',
        'Step 1 (Partial Termination): Decrease the carrying amount of the ROU Asset and Lease Liability in proportion to the reduction in scope (40%) and recognize any resulting gain or loss in Profit or Loss.',
        'Step 2 (Remeasurement of Remaining 60%): Remeasure the remaining Lease Liability by discounting the revised lease payments at the revised discount rate (9%), with a corresponding adjustment to the remaining ROU Asset.'
      ],
      analysisAndWorkings: [
        '1. Initial Lease Liability & ROU Asset on 01.04.2022 = ₹12,00,000 × 4.6229 = ₹55,47,480.',
        '2. Carrying Amount as on 01.04.2025 (after 3 years):',
        '   • ROU Asset (3 years remaining out of 6) = ₹55,47,480 × (3 / 6) = ₹27,73,740.',
        '   • Lease Liability (PV of 3 remaining payments of ₹12,00,000 @ 8%) = ₹12,00,000 × 2.5771 = ₹30,92,520.',
        '3. Step 1 — 40% Scope Reduction on 01.04.2025:',
        '   • Derecognize 40% of ROU Asset = 40% × ₹27,73,740 = ₹11,09,496 (Remaining 60% ROU = ₹16,64,244).',
        '   • Derecognize 40% of Lease Liability = 40% × ₹30,92,520 = ₹12,37,008 (Remaining 60% Liability = ₹18,55,512).',
        '   • Gain on Partial Termination recognized in P&L = ₹12,37,008 − ₹11,09,496 = ₹1,27,512.',
        '4. Step 2 — Remeasurement for Revised Rental (₹7,80,000 @ 9% for 3 years):',
        '   • Revised Lease Liability = ₹7,80,000 × 2.5313 = ₹19,74,414.',
        '   • Upward Remeasurement Adjustment = ₹19,74,414 − ₹18,55,512 = ₹1,18,902 (added to both ROU Asset and Lease Liability).'
      ],
      conclusion: 'Gain on partial lease termination recognized in P&L is ₹1,27,512. Post-modification on 1st April 2025, Revised Lease Liability is ₹19,74,414 and Revised ROU Asset is ₹17,83,146 (₹16,64,244 + ₹1,18,902).'
    }
  },
  {
    id: 'fr-may25-q4a',
    subjectCode: 'FR',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Question 4(a)',
    marks: 8,
    chapterName: 'Ind AS 102 Share Based Payment',
    topicTag: 'ESOP with Market vs Non-Market Vesting Conditions & Modification',
    questionText: [
      'On 1st April 2022, Nova Biotech Ltd. granted 500 share options to each of its 200 senior scientists, conditional upon the employee remaining in service for 3 years AND the company’s earnings growing by an average of at least 15% p.a. over the 3-year period.',
      'Fair value per option on grant date (1st April 2022) was ₹120. Each option vests into 1 equity share of ₹10.',
      '• As on 31st March 2023 (Year 1): 12 scientists left; management estimated another 18 would leave over Years 2 and 3. Earnings grew by 18% in Year 1 and the 15% average target was expected to be achieved.',
      '• As on 31st March 2024 (Year 2): 10 more scientists left; management estimated another 8 would leave in Year 3. Earnings grew by 10% in Year 2, so the 2-year average was 14%, and management expected the 3-year average to fall short at 13.5%.',
      '• As on 31st March 2025 (Year 3): 6 scientists left in Year 3. Actual 3-year average earnings growth achieved was 15.4% due to a strong Q4.',
      'Compute the Employee Benefit Expense to be recognized in Years 1, 2, and 3.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Ind AS 102, an earnings growth target is a Non-Market Performance Vesting Condition. It is NOT factored into the grant-date fair value of the option; instead, it is taken into account by adjusting the number of options expected to vest at each reporting date based on the best available estimate.',
        'At the end of the vesting period, cumulative expense must equal the actual number of options that satisfied both the service and non-market performance conditions multiplied by the grant-date fair value.'
      ],
      analysisAndWorkings: [
        '1. Year 1 (31.03.2023): Expected vesting employees = 200 − 12 − 18 = 170; Performance condition expected to be met (Yes). Cumulative Expense = 170 × 500 × ₹120 × (1/3) = ₹34,00,000.',
        '2. Year 2 (31.03.2024): Since the non-market earnings growth target is NOT expected to be achieved as on 31.03.2024, expected options vesting = NIL. Cumulative Expense = ₹0. Reversal in Year 2 P&L = (₹34,00,000).',
        '3. Year 3 (31.03.2025): Actual scientists remaining = 200 − 12 − 10 − 6 = 172; Actual 3-year average earnings growth = 15.4% (≥ 15%, condition met). Cumulative Expense = 172 × 500 × ₹120 × (3/3) = ₹1,03,20,000. Expense recognized in Year 3 = ₹1,03,20,000 − ₹0 = ₹1,03,20,000.'
      ],
      computationTable: {
        headers: ['Reporting Date', 'Expected Vesting Employees', 'Performance Met?', 'Cumulative Expense (₹)', 'Annual P&L Charge / (Credit) (₹)'],
        rows: [
          ['31.03.2023 (Year 1)', '170', 'Yes (Expected)', '34,00,000', '34,00,000'],
          ['31.03.2024 (Year 2)', '170', 'No (Not Expected)', 'Nil', '(34,00,000)'],
          ['31.03.2025 (Year 3)', '172 (Actual)', 'Yes (Achieved 15.4%)', '1,03,20,000', '1,03,20,000']
        ]
      },
      conclusion: 'Employee Benefit Expense recognized is ₹34,00,000 in Year 1, a reversal credit of ₹34,00,000 in Year 2, and an expense of ₹1,03,20,000 in Year 3.'
    }
  },
  {
    id: 'fr-nov24-q2b',
    subjectCode: 'FR',
    attempt: 'Nov-24',
    attemptLabel: 'November 2024',
    questionNumber: 'Question 2(b)',
    marks: 8,
    chapterName: 'Ind AS 36 Impairment of Assets',
    topicTag: 'CGU Impairment with Goodwill & Corporate Assets Allocation',
    questionText: [
      'A Cash Generating Unit (CGU) of Titan Manufacturing Ltd. comprises the following assets as on 31st March 2024: Goodwill ₹140 Lakhs, Identifiable Intangible Assets ₹400 Lakhs, Property, Plant & Equipment ₹800 Lakhs, and Net Working Capital ₹260 Lakhs (Total Carrying Amount = ₹1,600 Lakhs).',
      'Due to technological obsolescence, an impairment test was conducted on 31st March 2024. The Value in Use of the CGU was determined at ₹1,180 Lakhs, and Fair Value less Costs of Disposal of the CGU as a whole was ₹1,120 Lakhs.',
      'However, the Fair Value less Costs of Disposal of the Identifiable Intangible Assets individually was ₹340 Lakhs, and Net Working Capital is realizable in full at ₹260 Lakhs.',
      'Allocate the impairment loss across the assets of the CGU and determine their revised carrying amounts as per Ind AS 36.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Para 104 & 105 of Ind AS 36, an impairment loss for a CGU is allocated first to reduce the carrying amount of any Goodwill allocated to the CGU, and then to the other non-current assets of the CGU pro-rata on the basis of the carrying amount of each asset.',
        'However, in allocating an impairment loss, an entity shall NOT reduce the carrying amount of an individual asset below the highest of: (a) its Fair Value less Costs of Disposal (if measurable), (b) its Value in Use (if determinable), and (c) Zero.'
      ],
      analysisAndWorkings: [
        '1. Recoverable Amount of CGU = Higher of Value in Use (₹1,180L) and FVLCD (₹1,120L) = ₹1,180 Lakhs.',
        '2. Total Impairment Loss of CGU = Carrying Amount (₹1,600L) − Recoverable Amount (₹1,180L) = ₹420 Lakhs.',
        '3. First Allocation to Goodwill = ₹140 Lakhs (Goodwill reduced to Nil). Remaining Impairment Loss = ₹420L − ₹140L = ₹280 Lakhs.',
        '4. Pro-rata Allocation of ₹280 Lakhs between Intangible Assets (₹400L) and PPE (₹800L) in 1:2 ratio:',
        '   • Provisional Share of Intangible Assets = ₹280L × (400 / 1,200) = ₹93.33 Lakhs.',
        '   • Floor Check under Para 105: Carrying amount of Intangible Assets (₹400L) cannot be reduced below its FVLCD (₹340L). Maximum impairment allocable to Intangible Assets = ₹400L − ₹340L = ₹60 Lakhs.',
        '   • Balance Impairment Loss allocated to PPE = ₹280L − ₹60L = ₹220 Lakhs.'
      ],
      computationTable: {
        headers: ['Asset Class', 'Carrying Amount (₹ L)', 'Impairment Allocated (₹ L)', 'Revised Carrying Amount (₹ L)'],
        rows: [
          ['Goodwill', '140.00', '140.00', 'Nil'],
          ['Identifiable Intangible Assets (Floor ₹340L)', '400.00', '60.00', '340.00'],
          ['Property, Plant & Equipment (PPE)', '800.00', '220.00', '580.00'],
          ['Net Working Capital', '260.00', 'Nil', '260.00'],
          ['Total CGU', '1,600.00', '420.00', '1,180.00']
        ]
      },
      conclusion: 'Total impairment loss of ₹420 Lakhs is allocated ₹140 Lakhs to Goodwill, ₹60 Lakhs to Identifiable Intangible Assets (capped by its ₹340L FVLCD floor), and ₹220 Lakhs to PPE.'
    }
  },
  {
    id: 'fr-may24-q5a',
    subjectCode: 'FR',
    attempt: 'May-24',
    attemptLabel: 'May 2024',
    questionNumber: 'Question 5(a)',
    marks: 8,
    chapterName: 'Ind AS 12 Income Taxes',
    topicTag: 'Deferred Tax on Revaluation, Share-Based Payments & Unabsorbed Losses',
    questionText: [
      'Kaveri Heavy Engineering Ltd. pays corporate income tax at an enacted rate of 25.168% (including surcharge and cess). As on 31st March 2024, examine the following items and compute the Deferred Tax Asset / Liability to be recognized in P&L and OCI:',
      '(i) Factory Building was revalued upward on 31st March 2024 from a carrying amount of ₹500 Lakhs to ₹750 Lakhs. Tax WDV of the building is ₹380 Lakhs. The company intends to use the building over its remaining life and not sell it immediately.',
      '(ii) Provision for Post-Retirement Medical Benefits recognized in books is ₹90 Lakhs, which is deductible under Section 43B of the Income-tax Act only on actual payment.',
      '(iii) Preliminary expenses of ₹40 Lakhs were fully written off to P&L in FY 2023-24, whereas under Section 35D of the Income-tax Act, 1/5th (₹8 Lakhs) is allowed in FY 2023-24 and the remaining 4/5ths (₹32 Lakhs) over the next 4 years.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Ind AS 12, Deferred Tax is recognized on temporary differences between the carrying amount of an asset/liability in the Balance Sheet and its Tax Base.',
        'Under Para 61A of Ind AS 12, current and deferred tax shall be recognized outside profit or loss (in OCI) if the tax relates to items that are recognized in the same or a different period in OCI (such as PPE revaluation surplus under Ind AS 16).'
      ],
      analysisAndWorkings: [
        '1. Item (i) — Factory Building: Carrying Amount = ₹750L; Tax Base = ₹380L; Total Taxable Temporary Difference = ₹370 Lakhs.',
        '   • Of this ₹370L difference: ₹250L (₹750L − ₹500L) relates to Revaluation Surplus → DTL of ₹62.92L (25.168% × ₹250L) recognized in OCI; ₹120L (₹500L − ₹380L) relates to normal depreciation difference → DTL of ₹30.20L recognized in P&L.',
        '2. Item (ii) — Post-Retirement Medical Benefits: Carrying Amount of Liability = ₹90L; Tax Base = Nil (deductible on cash basis). Deductible Temporary Difference = ₹90L → DTA of ₹22.65L (25.168% × ₹90L) recognized in P&L.',
        '3. Item (iii) — Preliminary Expenses (Sec 35D): Carrying Amount in Balance Sheet = Nil; Tax Base (future deductible amount) = ₹32L. Deductible Temporary Difference = ₹32L → DTA of ₹8.05L (25.168% × ₹32L) recognized in P&L.'
      ],
      conclusion: 'Net Deferred Tax Liability is ₹62.42 Lakhs (comprising DTL of ₹62.92 Lakhs charged to OCI on revaluation and a net DTA credit of ₹0.50 Lakhs in Profit & Loss).'
    }
  },

  // ==========================================================================
  // PAPER 2: ADVANCED FINANCIAL MANAGEMENT (AFM)
  // ==========================================================================
  {
    id: 'afm-may26-q1a',
    subjectCode: 'AFM',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Question 1(a)',
    marks: 10,
    chapterName: 'Mergers, Acquisitions and Corporate Restructuring',
    topicTag: 'Free Cash Flow to Firm (FCFF) Valuation, Synergy Gain & Swap Ratio',
    questionText: [
      'Acquirer Ltd. is considering the acquisition of Target Ltd. through a 100% share swap. The following financial data is available for the year ended 31st March 2026:',
      '• Acquirer Ltd.: PAT = ₹1,200 Lakhs, Number of Equity Shares = 200 Lakhs, Current Market Price (MPS) = ₹120, P/E Ratio = 20.',
      '• Target Ltd.: PAT = ₹300 Lakhs, Number of Equity Shares = 75 Lakhs, Current Market Price (MPS) = ₹56, P/E Ratio = 14.',
      'Post-merger operational synergies are expected to increase combined PAT by ₹150 Lakhs per annum permanently, and the market is expected to value the merged entity at a P/E multiple of 19.',
      'Calculate: (i) Maximum Exchange Ratio that Acquirer Ltd. can offer without diluting its pre-merger EPS, (ii) Minimum Exchange Ratio that Target Ltd. shareholders will accept to protect their pre-merger Market Value per share, and (iii) If the agreed swap ratio is 0.45 shares of Acquirer Ltd. for every 1 share of Target Ltd., compute the Net Present Value (Gain) to Acquirer’s and Target’s shareholders.'
    ],
    questionTable: {
      headers: ['Metric', 'Acquirer Ltd.', 'Target Ltd.'],
      rows: [
        ['Profit After Tax (PAT)', '₹1,200 Lakhs', '₹300 Lakhs'],
        ['No. of Equity Shares', '200 Lakhs', '75 Lakhs'],
        ['Earnings Per Share (EPS)', '₹6.00', '₹4.00'],
        ['Market Price Per Share (MPS)', '₹120.00', '₹56.00'],
        ['Market Capitalization', '₹24,000 Lakhs', '₹4,200 Lakhs']
      ]
    },
    suggestedAnswer: {
      provisionOrStandard: [
        'Maximum Acceptable Exchange Ratio (from Acquirer’s EPS perspective): Post-Merger EPS must be at least equal to Acquirer’s Pre-Merger EPS (₹6.00).',
        'Minimum Acceptable Exchange Ratio (from Target’s Market Value perspective): Post-Merger Market Value of shares received must be at least equal to Target’s Pre-Merger Market Capitalization (₹4,200 Lakhs).'
      ],
      analysisAndWorkings: [
        '1. Combined Post-Merger PAT (including synergy) = ₹1,200L + ₹300L + ₹150L = ₹1,650 Lakhs.',
        '2. Combined Post-Merger Market Value @ P/E 19 = ₹1,650 Lakhs × 19 = ₹31,350 Lakhs (Total Synergy Gain in Market Value = ₹31,350L − ₹28,200L = ₹3,150 Lakhs).',
        '3. (i) Maximum Exchange Ratio (No EPS Dilution): Total Post-Merger Shares = ₹1,650L / ₹6.00 = 275 Lakhs. Max shares to issue to Target = 275L − 200L = 75 Lakhs. Max Swap Ratio = 75L / 75L = 1 : 1 (1.00 share of Acquirer per share of Target).',
        '4. (ii) Minimum Exchange Ratio (No Market Value Loss to Target): Let N be shares issued to Target. [N / (200 + N)] × 31,350 = 4,200 ⇒ 31,350N = 8,40,000 + 4,200N ⇒ 27,150N = 8,40,000 ⇒ N = 30.9392 Lakhs shares. Minimum Swap Ratio = 30.9392L / 75L = 0.4125 : 1.',
        '5. (iii) At Agreed Swap Ratio of 0.45 : 1: Shares issued to Target = 75L × 0.45 = 33.75 Lakhs. Total Post-Merger Shares = 233.75 Lakhs. Post-Merger EPS = ₹1,650L / 233.75L = ₹7.0588. Post-Merger MPS = ₹7.0588 × 19 = ₹134.12.'
      ],
      computationTable: {
        headers: ['Particulars (At 0.45 : 1 Swap Ratio)', 'Acquirer Shareholders', 'Target Shareholders'],
        rows: [
          ['Post-Merger Shares Held', '200.00 Lakhs', '33.75 Lakhs'],
          ['Post-Merger Market Value (@ ₹134.1176)', '₹26,823.53 Lakhs', '₹4,526.47 Lakhs'],
          ['Less: Pre-Merger Market Capitalization', '₹24,000.00 Lakhs', '₹4,200.00 Lakhs'],
          ['Net Gain from Merger', '+ ₹2,823.53 Lakhs', '+ ₹326.47 Lakhs']
        ]
      },
      conclusion: 'Maximum swap ratio is 1.00:1, minimum swap ratio is 0.4125:1, and at the agreed 0.45:1 ratio, Acquirer shareholders gain ₹2,823.53 Lakhs and Target shareholders gain ₹326.47 Lakhs.'
    }
  },
  {
    id: 'afm-jan26-q2a',
    subjectCode: 'AFM',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Question 2(a)',
    marks: 8,
    chapterName: 'Foreign Exchange Exposure and Risk Management',
    topicTag: 'Early Delivery & Extension of Forward Contract with Nostro Interest',
    questionText: [
      'An Indian exporter booked a 3-month forward sale contract with its authorized dealer bank on 1st January 2026 for USD 2,00,000 at a forward rate of ₹84.40/USD, due for delivery on 31st March 2026.',
      'The bank covered itself in the interbank market on 1st January 2026 at ₹84.50/USD.',
      'On 1st March 2026 (one month prior to maturity), the exporter received the export remittance and requested the bank to accept early delivery of USD 2,00,000.',
      'Interbank exchange rates on 1st March 2026 were: Spot USD 1 = ₹83.80 / 83.90; 1-Month Forward (31st March) = ₹84.05 / 84.15.',
      'The bank charges an exchange margin of 0.10% on spot/forward rates and a flat early delivery fee of ₹1,000. Outlay/Inflow of funds carries interest at 12% p.a.',
      'Compute the net amount payable to the exporter on 1st March 2026.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per FEDAI Guidelines on Early Delivery of Forward Contracts, the bank settles the export bill at the originally contracted rate (₹84.40) and additionally recovers/passes on: (a) Swap Difference (difference between interbank spot sale/purchase and 1-month forward cover), (b) Interest on Outlay/Inflow of funds between the original cover rate and the interbank spot rate for the early period (1 month), and (c) Flat early delivery charges.'
      ],
      analysisAndWorkings: [
        '1. Amount at Contracted Rate (USD 2,00,000 × ₹84.40) = ₹1,68,80,000.',
        '2. Swap Difference on 1st March 2026: Since the customer delivers USD early on 01.03.2026, the bank sells USD 2,00,000 in the interbank spot market at the Spot Bid rate (₹83.80) and buys USD 2,00,000 1-Month Forward at the Forward Ask rate (₹84.15) to honor its original interbank commitment on 31.03.2026.',
        '   • Swap Loss to be recovered from Exporter = USD 2,00,000 × (₹84.15 − ₹83.80) = USD 2,00,000 × ₹0.35 = ₹70,000.',
        '3. Interest on Outlay/Inflow of Funds: On 01.03.2026, bank pays Exporter at ₹84.40 and receives from interbank spot sale at ₹83.80. Net Outlay of Funds = USD 2,00,000 × (₹84.40 − ₹83.80) = ₹1,20,000.',
        '   • Interest on Outlay for 1 Month @ 12% p.a. = ₹1,20,000 × 12% × (1/12) = ₹1,200.',
        '4. Flat Early Delivery Charge = ₹1,000.',
        '5. Net Proceeds Credited to Exporter = ₹1,68,80,000 − ₹70,000 (Swap Loss) − ₹1,200 (Interest) − ₹1,000 (Charges) = ₹1,68,07,800.'
      ],
      conclusion: 'The net amount credited to the exporter’s account on 1st March 2026 upon early delivery is ₹1,68,07,800.'
    }
  },
  {
    id: 'afm-sep25-q3b',
    subjectCode: 'AFM',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Question 3(b)',
    marks: 8,
    chapterName: 'Derivatives Analysis and Valuation',
    topicTag: 'Two-Period Binomial Option Pricing & Risk-Neutral Valuation',
    questionText: [
      'The current market price of a non-dividend paying stock of Quantum Systems Ltd. is ₹500. Over each of the next two 6-month periods, the stock price is expected to either go up by 20% (u = 1.20) or go down by 15% (d = 0.85).',
      'The continuously compounded risk-free interest rate is 8% p.a. (Given: e^0.04 = 1.0408).',
      'Using the Two-Period Binomial Model, calculate the theoretical fair value of a 1-year European Put Option with a strike price (X) of ₹510, and verify whether Put-Call Parity holds if the corresponding 1-year European Call Option trades at ₹57.42.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Under the Cox-Ross-Rubinstein (CRR) Binomial Model, the risk-neutral probability of an upward movement per period is p = (e^(r·Δt) − d) / (u − d).',
        'Put-Call Parity for a non-dividend paying European option states: C + X·e^(−rT) = P + S0.'
      ],
      analysisAndWorkings: [
        '1. Risk-Neutral Probability (p): Here e^(r·Δt) = e^(0.08 × 0.5) = e^0.04 = 1.0408; u = 1.20; d = 0.85.',
        '   • p = (1.0408 − 0.85) / (1.20 − 0.85) = 0.1908 / 0.35 = 0.5451; (1 − p) = 0.4549.',
        '2. Terminal Stock Prices at Year 1 (Node 2):',
        '   • S_uu = 500 × 1.20 × 1.20 = ₹720.00 ⇒ Put Payoff (P_uu) = Max(510 − 720, 0) = ₹0.',
        '   • S_ud = 500 × 1.20 × 0.85 = ₹510.00 ⇒ Put Payoff (P_ud) = Max(510 − 510, 0) = ₹0.',
        '   • S_dd = 500 × 0.85 × 0.85 = ₹361.25 ⇒ Put Payoff (P_dd) = Max(510 − 361.25, 0) = ₹148.75.',
        '3. Present Value of Put Option at t = 0:',
        '   • Expected Payoff at T = 1 = [(0.5451)² × 0] + [2 × 0.5451 × 0.4549 × 0] + [(0.4549)² × 148.75] = 0.20693 × 148.75 = ₹30.78.',
        '   • Fair Value of Put Option (P0) = ₹30.78 / (1.0408)² = ₹30.78 / 1.08326 = ₹28.41.'
      ],
      conclusion: 'Theoretical value of the 1-year European Put Option is ₹28.41. Checking Put-Call Parity: P0 + S0 = 28.41 + 500 = ₹528.41, and C0 + X·e^(−0.08) = 57.42 + (510 / 1.08326) = 57.42 + 470.80 = ₹528.22 (holds within rounding).'
    }
  },
  {
    id: 'afm-may25-q4a',
    subjectCode: 'AFM',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Question 4(a)',
    marks: 8,
    chapterName: 'Advanced Capital Budgeting Decisions',
    topicTag: 'Optimum Replacement Cycle using Equivalent Annual Cost (EAC)',
    questionText: [
      'A precision manufacturing company is operating an automated CNC turbine whose initial cost is ₹36,00,000. The company’s post-tax cost of capital (discount rate) is 12% p.a.',
      'Operating & Maintenance (O&M) costs (year-end) and salvage values at the end of Years 1, 2, 3, and 4 are as follows (ignore taxation for simplicity):',
      '• Year 1: O&M Cost = ₹6,00,000; Year-End Salvage Value = ₹24,00,000.',
      '• Year 2: O&M Cost = ₹9,00,000; Year-End Salvage Value = ₹16,00,000.',
      '• Year 3: O&M Cost = ₹13,50,000; Year-End Salvage Value = ₹10,00,000.',
      '• Year 4: O&M Cost = ₹19,00,000; Year-End Salvage Value = ₹4,00,000.',
      'Given PV factors at 12%: Y1 = 0.8929, Y2 = 0.7972, Y3 = 0.7118, Y4 = 0.6355. Determine the optimal replacement cycle of the CNC turbine.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'When choosing the optimal replacement interval for a recurring capital asset, the decision is made by minimizing the Equivalent Annual Cost (EAC) = [Initial Outlay + PV of Cumulative O&M Costs − PV of Salvage Value] / PVAF(r, n).'
      ],
      analysisAndWorkings: [
        '1. Cumulative PVAF @ 12%: 1 Yr = 0.8929; 2 Yrs = 1.6901; 3 Yrs = 2.4019; 4 Yrs = 3.0374.',
        '2. 1-Year Replacement Cycle: PV of Net Cost = 36,00,000 + (6,00,000 × 0.8929) − (24,00,000 × 0.8929) = 36,00,000 − 16,07,220 = ₹19,92,780. EAC(1) = 19,92,780 / 0.8929 = ₹22,31,806.',
        '3. 2-Year Replacement Cycle: PV of O&M = 5,35,740 + (9,00,000 × 0.7972) = ₹12,53,220. PV of Salvage = 16,00,000 × 0.7972 = ₹12,75,520. Net PV Cost = 36,00,000 + 12,53,220 − 12,75,520 = ₹35,77,700. EAC(2) = 35,77,700 / 1.6901 = ₹21,16,857.',
        '4. 3-Year Replacement Cycle: PV of O&M = 12,53,220 + (13,50,000 × 0.7118) = ₹22,14,150. PV of Salvage = 10,00,000 × 0.7118 = ₹7,11,800. Net PV Cost = 36,00,000 + 22,14,150 − 7,11,800 = ₹51,02,350. EAC(3) = 51,02,350 / 2.4019 = ₹21,24,297.',
        '5. 4-Year Replacement Cycle: PV of O&M = 22,14,150 + (19,00,000 × 0.6355) = ₹34,21,600. PV of Salvage = 4,00,000 × 0.6355 = ₹2,54,200. Net PV Cost = 36,00,000 + 34,21,600 − 2,54,200 = ₹67,67,400. EAC(4) = 67,67,400 / 3.0374 = ₹22,28,024.'
      ],
      computationTable: {
        headers: ['Replacement Horizon', 'PV of Net Cost (₹)', 'PVAF @ 12%', 'Equivalent Annual Cost (EAC) (₹)'],
        rows: [
          ['Replace Every 1 Year', '19,92,780', '0.8929', '22,31,806'],
          ['Replace Every 2 Years (Optimal)', '35,77,700', '1.6901', '21,16,857'],
          ['Replace Every 3 Years', '51,02,350', '2.4019', '21,24,297'],
          ['Replace Every 4 Years', '67,67,400', '3.0374', '22,28,024']
        ]
      },
      conclusion: 'The Equivalent Annual Cost is lowest at ₹21,16,857 when the CNC turbine is replaced at the end of every 2 years. Hence, the optimal replacement cycle is 2 years.'
    }
  },
  {
    id: 'afm-nov24-q5a',
    subjectCode: 'AFM',
    attempt: 'Nov-24',
    attemptLabel: 'November 2024',
    questionNumber: 'Question 5(a)',
    marks: 8,
    chapterName: 'Portfolio Management',
    topicTag: 'Sharpe Single Index Model — Optimal Portfolio Cut-Off Point (C*)',
    questionText: [
      'A portfolio manager is evaluating 4 equity stocks using William Sharpe’s Single Index Model. The risk-free rate of return (Rf) is 7% p.a. and the variance of the market index (σ_m²) is 20%.',
      'Details of the 4 stocks are:',
      '• Stock A: Expected Return (Ri) = 21%, Beta (βi) = 1.4, Unsystematic Variance (σ_ei²) = 28%.',
      '• Stock B: Expected Return (Ri) = 17%, Beta (βi) = 1.0, Unsystematic Variance (σ_ei²) = 20%.',
      '• Stock C: Expected Return (Ri) = 15%, Beta (βi) = 0.8, Unsystematic Variance (σ_ei²) = 32%.',
      '• Stock D: Expected Return (Ri) = 13%, Beta (βi) = 1.2, Unsystematic Variance (σ_ei²) = 24%.',
      'Determine the Sharpe Cut-off rate (C*) and the exact percentage weights of stocks included in the Optimum Portfolio (short sales are not permitted).'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Under Sharpe’s Single Index Optimal Portfolio Model, securities are ranked in descending order of their Excess Return-to-Beta ratio: (Ri − Rf) / βi.',
        'The Cut-off rate C_i for a subset of i ranked stocks is: C_i = [σ_m² × Σ((Ri − Rf)·βi / σ_ei²)] / [1 + σ_m² × Σ(βi² / σ_ei²)]. The highest C_i where all included stocks have (Ri − Rf)/βi > C_i is the Optimum Cut-off Rate (C*).'
      ],
      analysisAndWorkings: [
        '1. Ranking by (Ri − Rf) / βi: Stock A = (21 − 7)/1.4 = 10.00 (Rank 1); Stock B = (17 − 7)/1.0 = 10.00 (Rank 2); Stock C = (15 − 7)/0.8 = 10.00 (Rank 3); Stock D = (13 − 7)/1.2 = 5.00 (Rank 4).',
        '2. Computation of (Ri − Rf)·βi / σ_ei² and βi² / σ_ei²:',
        '   • Stock A: (14 × 1.4)/28 = 0.700; β²/σ_ei² = 1.96/28 = 0.070.',
        '   • Stock B: (10 × 1.0)/20 = 0.500; β²/σ_ei² = 1.00/20 = 0.050.',
        '   • Stock C: (8 × 0.8)/32 = 0.200; β²/σ_ei² = 0.64/32 = 0.020.',
        '   • Stock D: (6 × 1.2)/24 = 0.300; β²/σ_ei² = 1.44/24 = 0.060.',
        '3. Cut-off Point C_3 (Stocks A, B, C): Numerator = 20 × (0.70 + 0.50 + 0.20) = 28.00; Denominator = 1 + 20 × (0.07 + 0.05 + 0.02) = 1 + 2.80 = 3.80 ⇒ C_3 = 28.00 / 3.80 = 7.368%.',
        '4. Since Stock D has (Ri − Rf)/βi = 5.00 < 7.368%, Stock D is excluded. Thus C* = 7.368%.',
        '5. Z_i = (βi / σ_ei²) × [((Ri − Rf)/βi) − C*]: Z_A = (1.4/28) × (10 − 7.368) = 0.1316; Z_B = (1.0/20) × (10 − 7.368) = 0.1316; Z_C = (0.8/32) × (10 − 7.368) = 0.0658. Sum(Z_i) = 0.3290.'
      ],
      conclusion: 'Optimum Cut-off Rate C* is 7.368%. Stocks A, B, and C are selected with optimal portfolio weights: Stock A = 40.00%, Stock B = 40.00%, and Stock C = 20.00%.'
    }
  },
  {
    id: 'afm-may24-q6a',
    subjectCode: 'AFM',
    attempt: 'May-24',
    attemptLabel: 'May 2024',
    questionNumber: 'Question 6(a)',
    marks: 8,
    chapterName: 'Interest Rate Risk Management',
    topicTag: 'Forward Rate Agreement (FRA) Settlement & Effective Borrowing Cost',
    questionText: [
      'A corporate treasurer needs to borrow ₹50 Crores after 3 months for a period of 6 months (a 3×9 horizon). Currently, 6-month MIBOR is 7.20% p.a., but the treasurer fears interest rates will rise.',
      'A bank quotes a 3×9 Forward Rate Agreement (FRA) at 7.50% / 7.65% p.a.',
      'Calculate the FRA settlement cash flow on the settlement date (at the end of Month 3) and verify the net effective annual borrowing cost if actual 6-month MIBOR after 3 months turns out to be: (i) 8.40% p.a., or (ii) 6.90% p.a. (Assume 6 months = 0.50 year).'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'To hedge against rising borrowing rates over a 3×9 horizon, the borrower buys a 3×9 FRA at the bank’s Offer/Ask rate (7.65% p.a.).',
        'FRA Settlement at Month 3 (discounted from Month 9 to Month 3 at reference MIBOR R_m): Settlement Amount = [Notional × (R_m − R_FRA) × (n/12)] / [1 + R_m × (n/12)].'
      ],
      analysisAndWorkings: [
        '1. Applicable 3×9 FRA Rate (Offer Rate for Borrower) = 7.65% p.a.; Period = 0.50 year; Notional = ₹50,00,00,000.',
        '2. Case (i) — Actual 6-Month MIBOR (R_m) = 8.40% p.a.:',
        '   • Since R_m (8.40%) > R_FRA (7.65%), Bank pays the Corporate Treasurer at Month 3:',
        '   • Settlement Received at M3 = [₹50 Cr × (0.0840 − 0.0765) × 0.50] / [1 + (0.0840 × 0.50)] = ₹18,75,000 / 1.042 = ₹17,99,424.',
        '   • If invested/reduced from borrowing @ 8.40% for 6 months, value at Month 9 = ₹17,99,424 × 1.042 = ₹18,75,000.',
        '   • Net Interest Outflow at Month 9 = Actual Loan Interest (₹50 Cr × 8.40% × 0.5 = ₹2,10,00,000) − FRA Gain at M9 (₹18,75,000) = ₹1,91,25,000 ⇒ Effective Cost = 7.65% p.a.',
        '3. Case (ii) — Actual 6-Month MIBOR (R_m) = 6.90% p.a.:',
        '   • Since R_m (6.90%) < R_FRA (7.65%), Corporate Treasurer pays the Bank at Month 3:',
        '   • Settlement Paid at M3 = [₹50 Cr × (0.0765 − 0.0690) × 0.50] / [1 + (0.0690 × 0.50)] = ₹18,75,000 / 1.0345 = ₹18,12,470.',
        '   • Effective Cost at Month 9 = Actual Loan Interest (₹1,72,50,000) + FRA Payment Compounded (₹18,75,000) = ₹1,91,25,000 ⇒ Effective Cost locked at 7.65% p.a.'
      ],
      conclusion: 'Under Case (i), the company receives ₹17,99,424 on the settlement date; under Case (ii), the company pays ₹18,12,470. In both scenarios, the effective borrowing rate is locked at 7.65% p.a.'
    }
  },

  // ==========================================================================
  // PAPER 3: ADVANCED AUDITING, ASSURANCE & PROFESSIONAL ETHICS (AUDIT)
  // ==========================================================================
  {
    id: 'aud-may26-q1a',
    subjectCode: 'Audit',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Question 1(a)',
    marks: 5,
    chapterName: 'Reporting',
    topicTag: 'SA 701, SA 705 & SA 570 — Interplay of Material Uncertainty on Going Concern and Key Audit Matters',
    questionText: [
      'CA Vikram is the statutory auditor of Solaris Power Ltd., a listed company, for FY 2025-26. During the audit, he observed that the company defaulted on term loan repayments aggregating ₹450 Crores and its power purchase agreements with two state utilities were terminated.',
      'Management prepared the financial statements on a going concern basis and made exhaustive disclosures in Note 38 regarding the debt restructuring proposal submitted to the consortium of banks.',
      'CA Vikram concluded that use of the going concern assumption is appropriate, but a material uncertainty exists which has been adequately disclosed. He now wishes to include this matter under the "Key Audit Matters" (KAM) section of his Independent Auditor’s Report instead of adding a separate section.',
      'Evaluate the validity of CA Vikram’s proposed reporting treatment in light of SA 570 (Revised) and SA 701.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per SA 570 (Revised) "Going Concern", when the auditor concludes that use of the going concern basis of accounting is appropriate in the circumstances but a material uncertainty exists, and adequate disclosure of such material uncertainty is made in the financial statements, the auditor shall express an unmodified opinion and the auditor’s report shall include a separate section under the heading "Material Uncertainty Related to Going Concern".',
        'As per Para 15 of SA 701 "Communicating Key Audit Matters in the Independent Auditor’s Report", a matter giving rise to a modified opinion under SA 705, or a material uncertainty related to events or conditions that may cast significant doubt on the entity’s ability to continue as a going concern under SA 570, are by their nature Key Audit Matters. However, they shall NOT be described in the Key Audit Matters section of the auditor’s report.'
      ],
      analysisAndWorkings: [
        '1. Mandatory Separate Section under SA 570: CA Vikram must report the material uncertainty in a dedicated section titled "Material Uncertainty Related to Going Concern", drawing attention to Note 38 and stating that these events indicate a material uncertainty exists and that the auditor’s opinion is not modified in respect of the matter.',
        '2. Cross-Reference in KAM Section under SA 701: In the "Key Audit Matters" section, CA Vikram shall include a reference to the "Material Uncertainty Related to Going Concern" section rather than describing the matter inside the KAM table.'
      ],
      conclusion: 'CA Vikram’s proposal to report the matter inside the Key Audit Matters section instead of a separate section is incorrect and violates SA 570 (Revised) and SA 701.'
    }
  },
  {
    id: 'aud-jan26-q2b',
    subjectCode: 'Audit',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Question 2(b)',
    marks: 5,
    chapterName: 'Professional Ethics & Liabilities of Auditors',
    topicTag: 'First Schedule Part I Clause (6) & (7) — Solicitation via QR Code & Tax Consultancy Designation',
    questionText: [
      'CARohan, a practicing Chartered Accountant, printed new visiting cards and firm letterheads describing himself as "CA Rohan, Chartered Accountant & Insolvency Professional — Specialist in GST Litigation & Forensic Audits".',
      'Additionally, he printed a QR code on the visiting card which, when scanned, directs the user to a landing page containing a downloadable PDF brochure highlighting past GST refund orders successfully secured by his firm for various corporate clients.',
      'Examine whether CA Rohan is guilty of professional misconduct under the Chartered Accountants Act, 1949 and Council Guidelines.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Clause (6) of Part I of the First Schedule to the Chartered Accountants Act, 1949 prohibits a member in practice from soliciting clients or professional work either directly or indirectly by circular, advertisement, personal communication, or interview, or by any other means.',
        'Clause (7) of Part I of the First Schedule prohibits advertising professional attainments or services, or using any designation or expressions other than "Chartered Accountant" on professional documents, visiting cards, letterheads, or signboards, unless it is a degree of a University or title recognized by the Central Government or Council.'
      ],
      analysisAndWorkings: [
        '1. Use of "Insolvency Professional" vs "Specialist in GST Litigation & Forensic Audits": While "Insolvency Professional" is a statutory registration recognized by the Council, the expression "Specialist in GST Litigation & Forensic Audits" advertises professional attainments and is strictly prohibited under Clause (7) of Part I of the First Schedule.',
        '2. QR Code Linking to Promotional Brochure of Past Successes: Under Council Guidelines on Website/QR Codes, a QR code on a visiting card may only contain contact details or link to the firm’s website complying with the pull-model guidelines. Hosting a promotional brochure showcasing past client refund orders amounts to advertising professional attainments and indirect solicitation of work.'
      ],
      conclusion: 'CA Rohan is guilty of professional misconduct under both Clause (6) and Clause (7) of Part I of the First Schedule to the Chartered Accountants Act, 1949.'
    }
  },
  {
    id: 'aud-sep25-q3a',
    subjectCode: 'Audit',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Question 3(a)',
    marks: 5,
    chapterName: 'Group Audits',
    topicTag: 'SA 600 & CARO 2020 Clause (xxi) — Consolidated Financial Statements Reporting',
    questionText: [
      'Parent Infra Ltd. has 4 subsidiaries (S1, S2, S3, and S4) and 1 associate (A1) included in its Consolidated Financial Statements (CFS) for FY 2024-25.',
      '• The statutory auditor of S1 Ltd. issued an adverse remark under Clause (vii)(a) of CARO 2020 regarding undisputed GST dues outstanding for more than 6 months.',
      '• The financial statements of S2 Ltd. (a foreign subsidiary located in Singapore) do not require a CARO report under Singapore law.',
      '• The audit of S3 Ltd. was not yet completed by the date the principal auditor signed the CFS audit report of Parent Infra Ltd.',
      'Explain how the principal auditor of Parent Infra Ltd. should report each of these three situations under Clause (xxi) of Paragraph 3 of CARO 2020.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Clause (xxi) of Paragraph 3 of CARO 2020, the principal auditor of Consolidated Financial Statements is required to state whether there have been any qualifications or adverse remarks by the respective auditors in the CARO reports of the companies included in the consolidated financial statements, and if yes, indicate the details of the companies and the paragraph numbers of the respective CARO reports containing the qualifications or adverse remarks.'
      ],
      analysisAndWorkings: [
        '1. S1 Ltd. (Adverse Remark in Clause (vii)(a)): The principal auditor must report the name of S1 Ltd., its CIN, relationship (Subsidiary), and specify Clause (vii)(a) in the table under Clause (xxi) of the CFS CARO report. However, reproducing the verbatim text of S1’s adverse remark is not required.',
        '2. S2 Ltd. (Foreign Subsidiary): CARO 2020 applies only to companies incorporated under the Indian Companies Act, 2013. Therefore, S2 Ltd. is outside the scope of Clause (xxi).',
        '3. S3 Ltd. (CARO Report Not Yet Issued): Where the statutory audit / CARO report of a component Indian company has not been issued until the date of the principal auditor’s report on CFS, the principal auditor must explicitly state the name and CIN of S3 Ltd. and disclose that its CARO report has not yet been issued by its auditor.'
      ],
      conclusion: 'The principal auditor will report S1 Ltd. (citing Clause (vii)(a)) and disclose S3 Ltd. (stating CARO report not yet issued up to the date of the CFS report), while excluding foreign subsidiary S2 Ltd.'
    }
  },
  {
    id: 'aud-may25-q4b',
    subjectCode: 'Audit',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Question 4(b)',
    marks: 5,
    chapterName: 'Special Features of Audit of Banks & Non-Banking Financial Companies',
    topicTag: 'RBI IRAC Norms — Drawing Power Calculation, Consortium Advances & Government Guaranteed Accounts',
    questionText: [
      'While conducting the statutory branch audit of National Commercial Bank for the year ended 31st March 2025, examine the classification and provisioning of the following three credit facilities:',
      '(i) M/s Alpha Textiles enjoys a Cash Credit limit of ₹500 Lakhs against hypothecation of inventory (margin 25%) and book debts up to 90 days (margin 40%). As per the latest stock statement dated 28th February 2025: Total Inventory = ₹480 Lakhs (which includes unpaid sundry creditors for goods of ₹120 Lakhs), and Total Book Debts = ₹300 Lakhs (of which ₹100 Lakhs are older than 90 days). Outstanding balance on 31.03.2025 is ₹410 Lakhs.',
      '(ii) A State Government-guaranteed advance of ₹180 Lakhs where the guarantee has been invoked, and interest has remained overdue for 120 days as on 31st March 2025.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Drawing Power (DP) for Cash Credit against Inventory must be calculated on "Paid Stock" only (Total Stock minus Unpaid Creditors for goods), since unpaid stock represents double financing.',
        'As per RBI Master Circular on Prudential Norms on Income Recognition, Asset Classification and Provisioning (IRAC), Central Government-guaranteed advances are treated as Standard Assets unless the Central Government repudiates its guarantee when invoked (though income is not recognized on accrual basis). However, State Government-guaranteed advances DO NOT enjoy this exemption and must be classified as NPA if overdue for more than 90 days.'
      ],
      analysisAndWorkings: [
        '1. Calculation of Drawing Power for M/s Alpha Textiles:',
        '   • Paid Inventory = ₹480 Lakhs − ₹120 Lakhs (Unpaid Creditors) = ₹360 Lakhs. DP on Inventory (after 25% margin) = 75% × ₹360 Lakhs = ₹270 Lakhs.',
        '   • Eligible Book Debts (up to 90 days) = ₹300 Lakhs − ₹100 Lakhs = ₹200 Lakhs. DP on Book Debts (after 40% margin) = 60% × ₹200 Lakhs = ₹120 Lakhs.',
        '   • Total Drawing Power = ₹270L + ₹120L = ₹390 Lakhs (lower than Sanctioned Limit of ₹500L).',
        '   • Since Outstanding Balance (₹410L) exceeds Drawing Power (₹390L) by ₹20 Lakhs, the account is "Out of Order" if it remains continuously in excess of DP for more than 90 days.',
        '2. State Government-Guaranteed Advance (₹180 Lakhs): Since it is guaranteed by a State Government (not Central Government) and interest is overdue for 120 days (> 90 days), it must be classified as a Non-Performing Asset (Sub-Standard Asset).'
      ],
      conclusion: 'Drawing Power for M/s Alpha Textiles is ₹390 Lakhs (making the ₹410 Lakhs balance irregular by ₹20 Lakhs), and the State Government-guaranteed advance of ₹180 Lakhs must be classified as NPA.'
    }
  },
  {
    id: 'aud-nov24-q5a',
    subjectCode: 'Audit',
    attempt: 'Nov-24',
    attemptLabel: 'November 2024',
    questionNumber: 'Question 5(a)',
    marks: 5,
    chapterName: 'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
    topicTag: 'BRSR Core — Nine ESG Attributes & Reasonable Assurance Mandate',
    questionText: [
      'Greenfield Cement Ltd. is ranked 185th by market capitalization on the National Stock Exchange as on 31st March 2024. The Board of Directors seeks your advice on:',
      '(a) Whether Business Responsibility and Sustainability Reporting (BRSR) and BRSR Core assurance are mandatory for the company, and',
      '(b) What are the key Key Performance Indicators (KPIs) covered under the 9 ESG attributes of BRSR Core introduced by SEBI?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Under Regulation 34(2)(f) of SEBI (LODR) Regulations, 2015, filing of the Business Responsibility and Sustainability Report (BRSR) is mandatory for the top 1,000 listed entities by market capitalization.',
        'Furthermore, SEBI mandated "Reasonable Assurance" on "BRSR Core" (a subset of 9 key ESG attributes) in a glide path starting from FY 2023-24 for the top 150 listed entities, expanding to the top 250 listed entities in FY 2024-25.'
      ],
      analysisAndWorkings: [
        '1. Applicability to Greenfield Cement Ltd. (Rank 185): Since it falls within the top 250 listed entities, both full BRSR reporting and Reasonable Assurance on BRSR Core KPIs are mandatory.',
        '2. The 9 ESG Attributes under BRSR Core:',
        '   • (1) Greenhouse Gas (GHG) Footprint (Scope 1 & Scope 2 emissions intensity).',
        '   • (2) Water Footprint (Water consumption, discharge, and intensity).',
        '   • (3) Energy Footprint (Total energy consumed and % from renewable sources).',
        '   • (4) Embracing Circularity (Plastic, e-waste, hazardous waste, and recycled waste).',
        '   • (5) Enhancing Employee Wellbeing and Safety (Spending on wellbeing, safety incidents, LTIFR).',
        '   • (6) Enabling Gender Diversity in Business (Gross wages paid to females as % of total wages, POSH complaints).',
        '   • (7) Enabling Inclusive Development (Input material sourced from MSMEs and small producers, job creation in smaller towns).',
        '   • (8) Fairness in Engaging with Customers and Suppliers (Instances of data breaches and MSME payable days).',
        '   • (9) Open-ness of Business (Concentration of purchases/sales with trading houses and related party transactions).'
      ],
      conclusion: 'Greenfield Cement Ltd. (ranked 185th) must mandatorily annex the BRSR and obtain Reasonable Assurance on the 9 BRSR Core ESG attributes.'
    }
  },
  {
    id: 'aud-may24-q6b',
    subjectCode: 'Audit',
    attempt: 'May-24',
    attemptLabel: 'May 2024',
    questionNumber: 'Question 6(b)',
    marks: 4,
    chapterName: 'Quality Control',
    topicTag: 'SQC 1 & SA 220 — Engagement Quality Control Review (EQCR) vs Engagement Partner Responsibility',
    questionText: [
      'CA Meera was appointed as the Engagement Partner for the statutory audit of Zenith Pharma Ltd., a listed entity. An independent Engagement Quality Control Reviewer (EQCR), CA Rajesh, was also appointed by the audit firm.',
      'A difference of opinion arose between CA Meera and CA Rajesh regarding the adequacy of impairment provision on a foreign subsidiary investment. Due to the tight SEBI filing deadline, CA Meera signed and issued the unmodified audit report on 28th May 2024 while the EQCR review note remained unresolved.',
      'Comment on the professional propriety of CA Meera’s action under SA 220 and SQC 1.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per SA 220 "Quality Control for an Audit of Financial Statements" and SQC 1, for audits of financial statements of listed entities, the Engagement Partner shall determine that an Engagement Quality Control Reviewer (EQCR) has been appointed, discuss significant matters with the EQCR, and SHALL NOT date the auditor’s report until the completion of the engagement quality control review.',
        'Furthermore, if differences of opinion arise between the Engagement Partner and the EQCR, the engagement team shall follow the firm’s policies and procedures for dealing with and resolving differences of opinion, and the auditor’s report shall not be dated until the matter is resolved.'
      ],
      analysisAndWorkings: [
        '1. Violation of Dating Prohibition: Signing and dating the audit report of a listed entity on 28th May 2024 prior to resolving the difference of opinion and completing the EQCR is a direct violation of Para 19 & 22 of SA 220.',
        '2. Unresolved Significant Matter: An impairment assessment of a foreign subsidiary is a significant judgment area that must be resolved through the firm’s consultation/dispute resolution mechanism before the report is issued.'
      ],
      conclusion: 'CA Meera failed to comply with SA 220 and SQC 1 by dating and issuing the listed company’s audit report before resolving the difference of opinion and completing the EQCR.'
    }
  },

  // ==========================================================================
  // PAPER 4: DIRECT TAX LAWS & INTERNATIONAL TAXATION (DT)
  // ==========================================================================
  {
    id: 'dt-may26-q1a',
    subjectCode: 'DT',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Question 1(a)',
    marks: 14,
    chapterName: 'Profits and Gains of Business or Profession',
    topicTag: 'Total Income Computation under Sec 115BAA — Sec 43B(h) MSME, Sec 32, Sec 14A & Sec 80M',
    questionText: [
      'Aurobindo Precision Ltd., a domestic manufacturing company opting for the concessional tax regime under Section 115BAA, reports a Net Profit of ₹4,85,00,000 in its Statement of Profit and Loss for the year ended 31st March 2026 after debiting/crediting the following items:',
      '1. Depreciation debited to P&L is ₹62,00,000. Normal depreciation allowable as per Section 32(1)(ii) is ₹54,00,000 (excluding additional depreciation of ₹11,00,000 on new plant and machinery installed in October 2025).',
      '2. ₹18,00,000 payable to M/s Micro Springs (a registered Micro Enterprise manufacturer under the MSMED Act, 2006) for goods supplied on 10th February 2026. The written agreement stipulated a credit period of 60 days, and payment was made on 8th April 2026 (before the due date of filing the return under Section 139(1)).',
      '3. Interest of ₹9,50,000 paid to a NBFC on a term loan was paid on 15th November 2026 (after the due date of filing return on 31st October 2026).',
      '4. CSR expenditure of ₹14,00,000 debited to P&L, which includes ₹5,00,000 contributed to the Swachh Bharat Kosh set up by the Central Government.',
      '5. Dividend income credited to P&L: ₹30,00,000 received from a domestic subsidiary company on 12th August 2025. Aurobindo Precision Ltd. distributed a dividend of ₹22,00,000 to its own shareholders on 20th September 2026 (1 month prior to the due date under Section 139(1)).',
      'Compute the Total Income and Tax Liability of Aurobindo Precision Ltd. for A.Y. 2026-27 under Section 115BAA.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Under Section 115BAA, a domestic company is taxed at 22% (+ 10% surcharge + 4% cess = 25.168%), subject to forgoing specified deductions including Additional Depreciation under Section 32(1)(iia) and Chapter VI-A deductions EXCEPT Section 80JJAA, Section 80M, and Section 80LA.',
        'Under Section 43B(h), any sum payable to a Micro or Small Enterprise beyond the time limit specified in Section 15 of the MSMED Act, 2006 (maximum 45 days where there is a written agreement, even if the agreement stipulates 60 days) is allowed ONLY in the year of actual payment. The proviso to Section 43B (allowing payment up to the Section 139(1) due date) DOES NOT apply to clause (h).'
      ],
      analysisAndWorkings: [
        '1. Net Profit as per P&L = ₹4,85,00,000; Less: Dividend from domestic company (considered under IFOS) = (₹30,00,000) ⇒ ₹4,55,00,000.',
        '2. Depreciation Adjustment: Add back book depreciation (+₹62,00,000) and deduct normal IT depreciation (−₹54,00,000). Additional depreciation of ₹11,00,000 under Sec 32(1)(iia) is NOT allowable under Sec 115BAA. Net Addition = +₹8,00,000.',
        '3. Section 43B(h) — Payment to Micro Enterprise: Since the supply was on 10.02.2026, the statutory 45-day cap under Sec 15 of MSMED Act expired on 27.03.2026. As payment was made on 08.04.2026 (in FY 2026-27) and the proviso to Sec 43B does not apply to Sec 43B(h), ₹18,00,000 is disallowed in A.Y. 2026-27 (+₹18,00,000).',
        '4. Section 43B(da) — Interest to NBFC paid after Sec 139(1) due date: Disallowed (+₹9,50,000).',
        '5. CSR Expenditure (Explanation 2 to Sec 37(1)): Entire ₹14,00,000 is disallowed (+₹14,00,000). Deduction under Sec 80G for Swachh Bharat Kosh (₹5,00,000) is NOT available under Sec 115BAA.',
        '6. PGBP = ₹4,55,00,000 + 8,00,000 + 18,00,000 + 9,50,000 + 14,00,000 = ₹5,04,50,000.',
        '7. Income from Other Sources (Dividend) = ₹30,00,000 ⇒ Gross Total Income = ₹5,34,50,000.',
        '8. Less: Deduction under Section 80M (allowable under Sec 115BAA): Lower of dividend received (₹30,00,000) or dividend distributed up to 1 month prior to Sec 139(1) due date (₹22,00,000) = (₹22,00,000).'
      ],
      computationTable: {
        headers: ['Particulars', 'Amount (₹)'],
        rows: [
          ['Net Profit as per P&L (excluding Dividend ₹30,00,000)', '4,55,00,000'],
          ['Add: Excess Book Depreciation (62L − 54L; Addl Dep not allowed)', '8,00,000'],
          ['Add: Disallowance u/s 43B(h) — Micro Enterprise paid after 31.03.2026', '18,00,000'],
          ['Add: Disallowance u/s 43B(da) — NBFC Interest paid after 139(1) due date', '9,50,000'],
          ['Add: CSR Expenditure disallowed u/s 37(1)', '14,00,000'],
          ['Profits and Gains of Business or Profession (PGBP)', '5,04,50,000'],
          ['Add: Income from Other Sources (Dividend)', '30,00,000'],
          ['Gross Total Income (GTI)', '5,34,50,000'],
          ['Less: Deduction under Section 80M', '(22,00,000)'],
          ['Total Income', '5,12,50,000'],
          ['Tax Liability @ 25.168% (22% + 10% Surcharge + 4% Cess)', '1,28,98,600']
        ]
      },
      conclusion: 'Total Income of Aurobindo Precision Ltd. under Section 115BAA is ₹5,12,50,000 and total tax liability (including surcharge and cess) is ₹1,28,98,600.'
    }
  },
  {
    id: 'dt-jan26-q2a',
    subjectCode: 'DT',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Question 2(a)',
    marks: 8,
    chapterName: 'Transfer Pricing',
    topicTag: 'Sec 92CE Secondary Adjustment & Sec 94B Limitation on Interest Deduction (Thin Capitalisation)',
    questionText: [
      'Indus Auto Components Ltd. (an Indian company) is a wholly owned subsidiary of Munich Motors GmbH (Germany). During P.Y. 2025-26, Indus Auto Components Ltd. had an EBITDA of ₹120 Crores.',
      'It paid the following interest expenses during P.Y. 2025-26:',
      '• ₹28 Crores to Munich Motors GmbH on an External Commercial Borrowing (ECB).',
      '• ₹14 Crores to Deutsche Bank (Frankfurt Branch) on a term loan for which Munich Motors GmbH provided an explicit corporate guarantee.',
      '• ₹10 Crores to State Bank of India, Mumbai on a working capital facility (no guarantee from AE).',
      'Separately, for A.Y. 2025-26, the Assessing Officer made a Primary Transfer Pricing Adjustment of ₹15 Crores on royalty paid to Munich Motors GmbH, which was accepted by Indus Auto Components Ltd. on 1st June 2025. However, Munich Motors GmbH did not repatriate the excess money of ₹15 Crores within 90 days.',
      'Compute: (i) Disallowance of interest under Section 94B for A.Y. 2026-27, and (ii) Optional Additional Income-tax payable to absolve Secondary Adjustment consequences under Section 92CE(2A).'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Section 94B, where an Indian company incurs expenditure by way of interest in respect of any debt issued by a non-resident Associated Enterprise (AE) — including debt issued by a lender for which an AE provides an implicit or explicit guarantee — exceeding ₹1 Crore, the "Excess Interest" shall be disallowed.',
        'Excess Interest = Lower of: (a) Total interest paid in respect of debt issued/guaranteed by AE − 30% of EBITDA, OR (b) Total interest paid in respect of debt issued/guaranteed by AE.',
        'As per Section 92CE(2A), where the excess money exceeding ₹1 Crore is not repatriated within 90 days, the assessee may opt to pay Additional Income-tax at 18% plus 12% surcharge plus 4% cess (= 20.9664%) on such excess money, upon which imputed interest stops accruing.'
      ],
      analysisAndWorkings: [
        '1. Section 94B Computation for A.Y. 2026-27:',
        '   • Debt issued/guaranteed by AE = ₹28 Cr (ECB from Munich Motors) + ₹14 Cr (Deutsche Bank loan explicitly guaranteed by AE) = ₹42 Crores (exceeds ₹1 Cr threshold). Interest to SBI Mumbai (₹10 Cr) is neither to an AE nor guaranteed by an AE.',
        '   • 30% of EBITDA = 30% × ₹120 Crores = ₹36 Crores.',
        '   • Excess Interest Disallowed u/s 94B = Lower of (₹42 Cr − ₹36 Cr = ₹6 Crores) or ₹42 Crores = ₹6 Crores (eligible for carry forward for 8 assessment years u/s 94B(4)).',
        '2. Section 92CE(2A) Additional Income-Tax on ₹15 Crores Primary Adjustment:',
        '   • Effective Rate = 18% × 1.12 × 1.04 = 20.9664%.',
        '   • Additional Income-Tax Payable = ₹15,00,00,000 × 20.9664% = ₹3,14,49,600.'
      ],
      conclusion: 'Interest disallowed under Section 94B is ₹6 Crores (carried forward for 8 A.Y.s), and Additional Income-tax under Section 92CE(2A) on the un-repatriated ₹15 Crores is ₹3,14,49,600.'
    }
  },
  {
    id: 'dt-sep25-q3a',
    subjectCode: 'DT',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Question 3(a)',
    marks: 8,
    chapterName: 'Assessment of Trusts and Institutions, Political Parties and Other Special Entities',
    topicTag: 'Section 11, Sec 115BBI & Corpus/Loan Application Rules for Charitable Trusts',
    questionText: [
      'Seva Bharati Foundation, a charitable trust registered under Section 12AB, provides the following receipts and payments for P.Y. 2024-25:',
      '• Gross Receipts from properties held under trust: ₹2,00,00,000.',
      '• Voluntary Contributions with a specific direction that they shall form part of the Corpus: ₹60,00,000 (out of which ₹50,00,000 was invested in modes specified under Section 11(5) and ₹10,00,000 was kept in a current account with a private non-scheduled co-operative bank).',
      '• Revenue expenditure incurred on charitable objects during the year: ₹1,30,00,000 (which includes ₹15,00,000 paid in cash on a single day to a catering contractor and ₹20,00,000 donated as a corpus donation to another trust registered under Section 12AB).',
      '• In addition, the trust constructed a medical clinic building costing ₹40,00,000 by utilizing ₹25,00,000 out of a bank loan taken during P.Y. 2024-25 and ₹15,00,000 out of regular trust income.',
      'Compute the Taxable Income and Tax Liability of Seva Bharati Foundation for A.Y. 2025-26.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Section 11(1)(d), corpus donations are exempt ONLY if invested or deposited in one or more of the forms or modes specified in Section 11(5). Any portion not invested in Section 11(5) modes violates Section 13(1)(d) / is taxed at 30% under Section 115BBI.',
        'Under Explanation 3 to Section 11(1), cash payments exceeding ₹10,000 in a day (attracting Section 40A(3)) are NOT treated as valid application of income.',
        'Under Explanation 2 to Section 11(1), any donation credited/paid to another registered trust with a specific direction that it shall form part of the corpus is NOT treated as application of income.',
        'Under Explanation 4(ii) to Section 11(1), application out of borrowed funds (₹25,00,000 loan) is NOT treated as application in the year of expenditure, but will be treated as application in the year of repayment of the loan (within 5 years).'
      ],
      analysisAndWorkings: [
        '1. Gross Income from Property held under Trust = ₹2,00,00,000; Less: 15% unconditional accumulation u/s 11(1)(a) = (₹30,00,000) ⇒ Income required to be applied = ₹1,70,00,000.',
        '2. Valid Application of Income:',
        '   • Revenue Expenditure ₹1,30,00,000 − Cash payment > ₹10,000 disallowed u/s 40A(3) (₹15,00,000) − Corpus donation to another trust disallowed under Expl. 2 (₹20,00,000) = ₹95,00,000.',
        '   • Clinic Building constructed out of regular income (excluding ₹25L loan) = ₹15,00,000.',
        '   • Total Valid Application = ₹95,00,000 + ₹15,00,000 = ₹1,10,00,000.',
        '3. Unapplied Regular Income = ₹1,70,00,000 − ₹1,10,00,000 = ₹60,00,000 (taxable at normal slab rates).',
        '4. Specified Income u/s 115BBI (taxable @ flat 30%): Corpus donation of ₹10,00,000 not invested in Section 11(5) modes = ₹10,00,000.'
      ],
      conclusion: 'Total Taxable Income is ₹70,00,000 (comprising ₹10,00,000 Specified Income taxed at 30% u/s 115BBI and ₹60,00,000 unapplied regular income taxed at normal AOP slab rates).'
    }
  },
  {
    id: 'dt-may25-q4b',
    subjectCode: 'DT',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Question 4(b)',
    marks: 6,
    chapterName: 'Capital Gains',
    topicTag: 'Section 50B Slump Sale — Fair Market Value Rule 11UA (FMV1 vs FMV2)',
    questionText: [
      'On 1st October 2024, Horizon Pharma Ltd. transferred its API Manufacturing Division (held for 7 years) on a going concern basis under a slump sale agreement for a lump-sum cash consideration of ₹650 Lakhs plus allotment of 1,00,000 equity shares in the buyer company (fair market value ₹180 per share).',
      'As on 1st October 2024, the assets and liabilities of the API Manufacturing Division were:',
      '• Depreciable Plant & Machinery: Book Value ₹220 Lakhs; Income-tax WDV u/s 43(6) ₹160 Lakhs.',
      '• Factory Land & Building: Book Value ₹180 Lakhs; Stamp Duty Value ₹340 Lakhs.',
      '• Listed Equity Shares (Investments): Book Value ₹50 Lakhs; Stock Exchange Quoted Price ₹90 Lakhs.',
      '• Current Assets (Debtors & Inventory): Book Value ₹150 Lakhs.',
      '• Trade Liabilities & Bank Term Loan of the Division: ₹210 Lakhs.',
      'Compute the Capital Gain chargeable to tax under Section 50B for A.Y. 2025-26.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Section 50B(2) read with Rule 11UAE, the Full Value of Consideration (FVC) in a slump sale is the higher of FMV1 (Fair Market Value of the capital assets transferred) or FMV2 (Fair Market Value of the consideration received).',
        'The Cost of Acquisition and Cost of Improvement is the "Net Worth" of the undertaking (Aggregate value of total assets using IT WDV for depreciable assets and book value for other assets, minus external liabilities), without indexation.'
      ],
      analysisAndWorkings: [
        '1. Computation of FMV1 (Fair Market Value of Capital Assets of the Undertaking):',
        '   • Book Value of all assets (excluding immovable property & shares) = ₹220L (P&M Book Value) + ₹150L (Current Assets) = ₹370 Lakhs.',
        '   • Add: Stamp Duty Value of Immovable Property (Land & Building) = ₹340 Lakhs.',
        '   • Add: Quoted Market Value of Listed Shares = ₹90 Lakhs.',
        '   • Less: Book Value of Liabilities = (₹210 Lakhs) ⇒ FMV1 = ₹370L + ₹340L + ₹90L − ₹210L = ₹590 Lakhs.',
        '2. Computation of FMV2 (Fair Market Value of Monetary + Non-Monetary Consideration Received):',
        '   • Cash Consideration (₹650 Lakhs) + Fair Value of 1,00,000 shares @ ₹180 (₹180 Lakhs) = ₹830 Lakhs.',
        '3. Full Value of Consideration = Higher of FMV1 (₹590L) or FMV2 (₹830L) = ₹830 Lakhs.',
        '4. Net Worth (Cost of Acquisition u/s 50B):',
        '   • Depreciable P&M (Tax WDV) = ₹160L + Land & Building (Book Value) = ₹180L + Listed Shares (Book Value) = ₹50L + Current Assets (Book Value) = ₹150L − Liabilities (₹210L) = ₹540L − ₹210L = ₹330 Lakhs.',
        '5. Long-Term Capital Gain (LTCG) u/s 50B = ₹830 Lakhs − ₹330 Lakhs = ₹500 Lakhs.'
      ],
      conclusion: 'Full Value of Consideration is ₹830 Lakhs (FMV2 being higher than FMV1 of ₹590 Lakhs), Net Worth is ₹330 Lakhs, and taxable Long-Term Capital Gain under Section 50B is ₹500 Lakhs.'
    }
  },
  {
    id: 'dt-nov24-q5b',
    subjectCode: 'DT',
    attempt: 'Nov-24',
    attemptLabel: 'November 2024',
    questionNumber: 'Question 5(b)',
    marks: 6,
    chapterName: 'Double Taxation Relief',
    topicTag: 'Section 91 Unilateral Relief & Rule 128 Foreign Tax Credit',
    questionText: [
      'Mr. Arjun, an Indian resident individual aged 44 years, opted for the default tax regime under Section 115BAC(1A) for A.Y. 2025-26. During P.Y. 2024-25, he earned:',
      '• Business & Professional Income in India: ₹24,00,000.',
      '• Professional Consultancy Income from Country X (with which India has NO Double Taxation Avoidance Agreement): ₹8,00,000 (in equivalent INR), on which Country X deducted withholding tax at 18% (₹1,44,000).',
      '• Share of Profit from a Partnership Firm in Country X: ₹3,00,000 (exempt in India under Section 10(2A) if Indian firm, examine taxability for foreign firm) on which tax of ₹45,000 was paid in Country X.',
      'Compute Mr. Arjun’s net tax payable in India after allowing relief under Section 91.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Note on Foreign Partnership Firm: Exemption under Section 10(2A) applies only to a firm assessed as such under the Indian Income-tax Act, 1961. Share of profit from a foreign partnership firm not assessed in India is fully taxable in the hands of a Resident and Ordinarily Resident (ROR) partner.',
        'Under Section 91, a resident is entitled to unilateral relief on doubly taxed foreign income equal to the Doubly Taxed Income multiplied by the LOWER of the Indian Rate of Tax or the Rate of Tax of the Foreign Country.'
      ],
      analysisAndWorkings: [
        '1. Total Income in India: Indian Income (₹24,00,000) + Country X Consultancy (₹8,00,000) + Country X Firm Share (₹3,00,000) = ₹35,00,000.',
        '2. Tax under Section 115BAC(1A) on ₹35,00,000: Up to ₹15,00,000 = ₹1,40,000; Balance ₹20,00,000 @ 30% = ₹6,00,000 ⇒ Base Tax = ₹7,40,000. Add 4% Health & Education Cess = ₹29,600 ⇒ Total Indian Tax = ₹7,69,600.',
        '3. Average Indian Rate of Tax = (₹7,69,600 / ₹35,00,000) × 100 = 21.9886%.',
        '4. Doubly Taxed Income in Country X = ₹8,00,000 + ₹3,00,000 = ₹11,00,000; Total Tax paid in Country X = ₹1,44,000 + ₹45,000 = ₹1,89,000.',
        '5. Foreign Rate of Tax in Country X = (₹1,89,000 / ₹11,00,000) × 100 = 17.1818%.',
        '6. Relief under Section 91 = ₹11,00,000 × Lower of (21.9886% or 17.1818%) = ₹1,89,000.',
        '7. Net Tax Payable in India = ₹7,69,600 − ₹1,89,000 = ₹5,80,600.'
      ],
      conclusion: 'Total Income is ₹35,00,000, Section 91 unilateral relief is ₹1,89,000, and net tax payable in India is ₹5,80,600.'
    }
  },
  {
    id: 'dt-may24-q6a',
    subjectCode: 'DT',
    attempt: 'May-24',
    attemptLabel: 'May 2024',
    questionNumber: 'Question 6(a)',
    marks: 8,
    chapterName: 'Deduction, Collection and Recovery of Tax',
    topicTag: 'Interplay of Sec 194Q, Sec 194O, Sec 194R & Sec 206C(1H)',
    questionText: [
      'Examine the TDS / TCS applicability and compute the exact tax to be deducted or collected in each of the following independent cases for P.Y. 2024-25:',
      '(i) Zenith Retail Ltd. (turnover in P.Y. 2023-24: ₹45 Crores) purchased raw materials totaling ₹82,00,000 (excluding GST @ 18%) from M/s Apex Traders (turnover in P.Y. 2023-24: ₹18 Crores). Zenith Retail Ltd. credited ₹50,00,000 (plus ₹9,00,000 GST) on 15th July 2024 and paid the remaining ₹32,00,000 (plus ₹5,76,000 GST) as an advance on 20th September 2024.',
      '(ii) CureWell Pharma Ltd. provided free foreign travel packages costing ₹6,50,000 to 10 independent medical practitioners who attended a product launch conference, and free drug samples worth ₹35,000 to Dr. Mehta during P.Y. 2024-25.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Under Section 194Q, a buyer (whose preceding year turnover exceeds ₹10 Crores) purchasing goods of aggregate value exceeding ₹50 Lakhs from a resident seller must deduct TDS at 0.1% on the sum exceeding ₹50 Lakhs at the time of credit or payment, whichever is earlier. Where both Sec 194Q and Sec 206C(1H) apply, Section 194Q prevails.',
        'As per CBDT Circular No. 13/2021, when TDS under Sec 194Q is deducted on credit of invoice, GST is excluded if indicated separately; however, when TDS is deducted on an advance payment prior to invoicing, TDS is deducted on the whole advance amount (including GST component).',
        'Under Section 194R, any person providing a benefit or perquisite exceeding ₹20,000 in aggregate during the financial year to a resident arising from business or profession must deduct/ensure payment of tax at 10%.'
      ],
      analysisAndWorkings: [
        '1. Case (i) — Section 194Q by Zenith Retail Ltd.:',
        '   • On 15th July 2024 (Credit of ₹50,00,000 + ₹9,00,000 GST): Since GST is excluded on credit of invoice, the qualifying purchase value is ₹50,00,000, which does not exceed the ₹50,00,000 threshold. TDS on 15.07.2024 = Nil.',
        '   • On 20th September 2024 (Advance Payment of ₹37,76,000 inclusive of GST): Since TDS on advance applies on the gross advance amount (inclusive of GST), TDS u/s 194Q @ 0.1% on ₹37,76,000 = ₹3,776.',
        '2. Case (ii) — Section 194R by CureWell Pharma Ltd.:',
        '   • Free travel packages to 10 doctors (₹65,000 per doctor > ₹20,000 threshold): TDS u/s 194R @ 10% on ₹6,50,000 = ₹65,000.',
        '   • Free drug samples to Dr. Mehta (₹35,000 > ₹20,000 threshold): Free medicine samples are squarely covered under Section 194R per CBDT Circular No. 12/2022. TDS u/s 194R @ 10% on ₹35,000 = ₹3,500.'
      ],
      conclusion: 'In Case (i), Zenith Retail Ltd. deducts ₹3,776 under Section 194Q on 20th September 2024 (and M/s Apex Traders does not collect TCS u/s 206C(1H)). In Case (ii), CureWell Pharma Ltd. must deduct/pay ₹65,000 and ₹3,500 under Section 194R.'
    }
  },

  // ==========================================================================
  // PAPER 5: INDIRECT TAX LAWS (IDT)
  // ==========================================================================
  {
    id: 'idt-may26-q1a',
    subjectCode: 'IDT',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Question 1(a)',
    marks: 14,
    chapterName: 'Input Tax Credit',
    topicTag: 'Comprehensive GST Liability, Rule 42/43 ITC Reversal, Sec 17(5) Blocked Credits & RCM',
    questionText: [
      'Vanguard Electronics Ltd., registered in Maharashtra, is engaged in manufacturing both taxable electronic appliances (18% GST) and exempt agricultural solar pumps. For the month of February 2026, it furnishes the following details (all amounts exclusive of GST):',
      '• Outward Supplies: (a) Intra-state taxable supply of appliances = ₹1,60,00,000; (b) Exempt supply of solar pumps = ₹40,00,000; (c) Export of appliances under LUT without payment of IGST = ₹50,00,000.',
      '• Inward Supplies & Expenses during February 2026 (GST @ 18% unless stated):',
      '  1. Raw materials used exclusively for taxable & export supplies: ₹90,00,000.',
      '  2. Common inputs and input services used for both taxable and exempt supplies: ₹25,00,000.',
      '  3. New Plant & Machinery (Capital Asset "A") purchased on 5th February 2026 for common use in both taxable and exempt manufacturing: ₹30,00,000 (GST ₹5,40,000).',
      '  4. Corporate Guarantee of ₹20,00,000,000 (₹20 Crores) provided by Vanguard’s Holding Company (located in Gujarat) to a bank on behalf of Vanguard Electronics Ltd. for zero consideration.',
      '  5. Membership fee of ₹2,00,000 paid to a fitness and health club for executive directors (non-statutory).',
      'Compute the Net Eligible Input Tax Credit and Net GST Payable in Cash for February 2026.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Rule 28(2) of the CGST Rules, 2017, the value of supply of corporate guarantee provided to a banking company by a holding/related company on behalf of a related recipient is deemed to be 1% of the amount of such guarantee per annum (or actual consideration, whichever is higher). Since Vanguard can avail full/proportionate ITC, examine the common input service impact.',
        'Under Rule 42 & Rule 43, zero-rated exports under LUT are treated as taxable supplies (included in Total Turnover F, excluded from Exempt Turnover E).',
        'Under Rule 43, the entire ITC on common capital goods (₹5,40,000) is credited to the Electronic Credit Ledger in the month of purchase (T_c), and monthly common credit T_m = T_c / 60 is subjected to reversal in the ratio of E / F.'
      ],
      analysisAndWorkings: [
        '1. Turnover Ratio (E / F): Exempt Turnover (E) = ₹40,00,000; Total Turnover (F) = ₹1,60,00,000 + ₹40,00,000 + ₹50,00,000 (Zero-rated export) = ₹2,50,00,000 ⇒ E / F = 40 / 250 = 16%.',
        '2. Exclusive Taxable Inputs (₹90,00,000 × 18%) = ₹16,20,000 (100% eligible).',
        '3. Common Inputs & Services (Rule 42):',
        '   • Common Inputs/Services = ₹25,00,000 × 18% = ₹4,50,000.',
        '   • Corporate Guarantee from Holding Co. (Rule 28(2)): Value = 1% of ₹20,00,00,000 = ₹20,00,000; IGST @ 18% = ₹3,60,000 (common input service).',
        '   • Total Common Input Credit (C2) = ₹4,50,000 + ₹3,60,000 = ₹8,10,000.',
        '   • Rule 42 Reversal (D1) = ₹8,10,000 × (40 / 250) = ₹1,29,600.',
        '4. Common Capital Asset "A" (Rule 43):',
        '   • Full ITC credited initially = ₹30,00,000 × 18% = ₹5,40,000.',
        '   • Monthly Credit T_m = ₹5,40,000 / 60 = ₹9,000. Rule 43 Reversal (T_e) = ₹9,000 × (40 / 250) = ₹1,440.',
        '5. Health Club Membership (₹2,00,000 × 18% = ₹36,000): Blocked credit under Section 17(5)(b)(ii) (Nil ITC).',
        '6. Net Available ITC = ₹16,20,000 + ₹8,10,000 + ₹5,40,000 − ₹1,29,600 − ₹1,440 = ₹28,38,960.',
        '7. Output GST on Intra-state Taxable Supply = ₹1,60,00,000 × 18% = ₹28,80,000. Net GST Payable in Cash = ₹28,80,000 − ₹28,38,960 = ₹41,040.'
      ],
      computationTable: {
        headers: ['Particulars', 'Total GST (₹)', 'Eligible / Reversal (₹)'],
        rows: [
          ['Raw Materials exclusively for Taxable + Export', '16,20,000', '+ 16,20,000'],
          ['Common Inputs & Corporate Guarantee IGST (C2)', '8,10,000', '+ 8,10,000'],
          ['Common Capital Goods "A" Credited in Month 1', '5,40,000', '+ 5,40,000'],
          ['Less: Rule 42 Reversal (16% of ₹8,10,000)', '—', '(1,29,600)'],
          ['Less: Rule 43 Monthly Reversal (16% of ₹9,000)', '—', '(1,440)'],
          ['Net Eligible ITC for February 2026', '—', '28,38,960'],
          ['Output GST Liability (18% on ₹1,60,00,000)', '—', '28,80,000'],
          ['Net Cash Ledger Payment Required', '—', '41,040']
        ]
      },
      conclusion: 'Net Eligible ITC after Rule 42 & Rule 43 reversals is ₹28,38,960, and Net GST Payable through the Electronic Cash Ledger is ₹41,040.'
    }
  },
  {
    id: 'idt-jan26-q2a',
    subjectCode: 'IDT',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Question 2(a)',
    marks: 8,
    chapterName: 'Valuation under the Customs Act, 1962',
    topicTag: 'Customs Rule 10(1) & Rule 10(2) — Buying Commission, Royalty, Demurrage & Air Freight Cap',
    questionText: [
      ' Precision MedTech Ltd. imported a high-resolution MRI scanner from Germany by air. The following particulars are furnished:',
      '• FOB Price of the MRI Scanner: EUR 1,20,000.',
      '• Packing charges incurred by the exporter before shipment (billed separately): EUR 3,000.',
      '• Design and engineering work undertaken in Munich, Germany necessary for customizing the scanner: EUR 7,000.',
      '• Buying commission paid by Precision MedTech Ltd. to its own buying agent in Frankfurt: EUR 2,500.',
      '• Post-importation installation and training charges to be incurred in India (separately distinguished in the contract, not a condition of sale): EUR 5,000.',
      '• Actual Air Freight from Frankfurt to Mumbai Airport: EUR 32,000 (which includes ship/aircraft demurrage charges at foreign port of EUR 2,000).',
      '• Insurance charges: Not ascertainable.',
      '• CBIC Notified Exchange Rate: 1 EUR = ₹90.00 (on date of filing Bill of Entry under Sec 14); Basic Customs Duty (BCD) = 10%, SWS = 10%, IGST = 12%.',
      'Compute the Assessable Value (CIF) and Total Customs Duty Payable.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Under Rule 10(1) of the Customs Valuation (Determination of Value of Imported Goods) Rules, 2007: Packing charges (EUR 3,000) and foreign design/engineering charges (EUR 7,000) are includible to arrive at the Adjusted FOB Value. Buying commission (EUR 2,500) and post-importation installation charges in India (EUR 5,000) are EXCLUDED.',
        'Under Rule 10(2), where goods are imported by air, the cost of transport (including foreign port demurrage) is restricted to 20% of the Adjusted FOB Value. Where insurance is not ascertainable, it is taken at 1.125% of the Adjusted FOB Value.'
      ],
      analysisAndWorkings: [
        '1. Adjusted FOB Value under Rule 10(1): Base FOB (EUR 1,20,000) + Packing (EUR 3,000) + Foreign Design & Engineering (EUR 7,000) = EUR 1,30,000. (Buying commission EUR 2,500 and post-import Indian installation EUR 5,000 are excluded).',
        '2. Add: Air Freight under Rule 10(2) = Lower of Actual Air Freight (EUR 32,000) or 20% of Adjusted FOB (20% × EUR 1,30,000 = EUR 26,000) = EUR 26,000.',
        '3. Add: Insurance under Rule 10(2) (Unascertainable @ 1.125% of Adjusted FOB) = 1.125% × EUR 1,30,000 = EUR 1,462.50.',
        '4. Total CIF / Assessable Value in EUR = 1,30,000 + 26,000 + 1,462.50 = EUR 1,57,462.50.',
        '5. Assessable Value in INR (@ CBIC rate ₹90.00) = 1,57,462.50 × 90 = ₹1,41,71,625.',
        '6. Customs Duty Computation: BCD @ 10% = ₹14,17,163; SWS @ 10% of BCD = ₹1,41,716; Subtotal for IGST = ₹1,57,30,504; IGST @ 12% = ₹18,87,660; Total Customs Duty = ₹34,46,539.'
      ],
      computationTable: {
        headers: ['Particulars', 'Amount (EUR)', 'Amount (₹ @ 90)'],
        rows: [
          ['Adjusted FOB Value (1,20,000 + 3,000 + 7,000)', '1,30,000.00', '1,17,00,000'],
          ['Add: Air Freight (Capped at 20% of Adjusted FOB)', '26,000.00', '23,40,000'],
          ['Add: Insurance @ 1.125% of Adjusted FOB', '1,462.50', '1,31,625'],
          ['Assessable Value (CIF)', '1,57,462.50', '1,41,71,625'],
          ['Basic Customs Duty (BCD @ 10%)', '—', '14,17,163'],
          ['Social Welfare Surcharge (SWS @ 10% of BCD)', '—', '1,41,716'],
          ['IGST u/s 3(7) @ 12% on ₹1,57,30,504', '—', '18,87,660'],
          ['Total Customs Duty Payable', '—', '34,46,539']
        ]
      },
      conclusion: 'Assessable Value is ₹1,41,71,625 and Total Customs Duty (BCD + SWS + IGST) payable is ₹34,46,539.'
    }
  },
  {
    id: 'idt-sep25-q3a',
    subjectCode: 'IDT',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Question 3(a)',
    marks: 8,
    chapterName: 'Refunds',
    topicTag: 'Section 54(3) & Rule 89(4) vs Rule 89(5) — Zero-Rated Export & Inverted Duty Structure Refund',
    questionText: [
      'Aether Chemicals Ltd. manufactures Specialty Polymer (taxable at 5% GST) using bulk petrochemical inputs (taxable at 18% GST) and input services (taxable at 18% GST). For the quarter ended September 2025, furnish the maximum refund admissible under Rule 89(5) (Inverted Duty Structure):',
      '• Turnover of Inverted Rated Supply of Specialty Polymer (domestic): ₹3,00,00,000.',
      '• Turnover of Other Domestic Supplies (taxable at 18%): ₹1,00,00,000.',
      '• Total Adjusted Total Turnover for the quarter: ₹4,00,00,000.',
      '• Net ITC availed during the quarter on Inputs (Raw Materials @ 18%): ₹48,00,000.',
      '• ITC availed during the quarter on Input Services (@ 18%): ₹12,00,000.',
      '• ITC availed during the quarter on Capital Goods (@ 18%): ₹8,00,000.',
      'Compute the Maximum Refund Amount under the amended Rule 89(5) formula.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Section 54(3)(ii) of the CGST Act, 2017 read with Rule 89(5) of the CGST Rules, 2017 (as amended vide Notification No. 14/2022-CT), "Net ITC" for Inverted Duty Structure refund means input tax credit availed ONLY on "Inputs" (excluding Input Services and Capital Goods).',
        'Amended Rule 89(5) Formula: Maximum Refund = [(Turnover of Inverted Rated Supply of Goods & Services × Net ITC on Inputs) / Adjusted Total Turnover] − [Tax Payable on such Inverted Rated Supply of Goods & Services × (Net ITC on Inputs / Total ITC on Inputs and Input Services)].'
      ],
      analysisAndWorkings: [
        '1. Net ITC on Inputs only = ₹48,00,000 (ITC on Input Services ₹12,00,000 and Capital Goods ₹8,00,000 are excluded from "Net ITC").',
        '2. Total ITC on Inputs and Input Services (for proportionate deduction of output tax) = ₹48,00,000 + ₹12,00,000 = ₹60,00,000.',
        '3. Output Tax Payable on Inverted Rated Supply (5% on ₹3,00,00,000) = ₹15,00,000.',
        '4. First Limb of Rule 89(5) = (₹3,00,00,000 × ₹48,00,000) / ₹4,00,00,000 = ₹36,00,000.',
        '5. Second Limb (Proportionate Output Tax Deducted) = ₹15,00,000 × (₹48,00,000 / ₹60,00,000) = ₹15,00,000 × 0.80 = ₹12,00,000.',
        '6. Maximum Admissible Refund under Rule 89(5) = ₹36,00,000 − ₹12,00,000 = ₹24,00,000.'
      ],
      conclusion: 'Applying the amended Rule 89(5) formula (which prorates output tax deduction across inputs and input services), the maximum refund admissible to Aether Chemicals Ltd. is ₹24,00,000.'
    }
  },
  {
    id: 'idt-may25-q4a',
    subjectCode: 'IDT',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Question 4(a)',
    marks: 6,
    chapterName: 'Place of Supply',
    topicTag: 'Sections 10, 12 & 13 of IGST Act — Cross-Border Services, Intermediary & Immovable Property',
    questionText: [
      'Determine the Place of Supply and whether the supply qualifies as an Export of Service / Intra-State or Inter-State supply in the following independent cases:',
      '(i) M/s Global Architects (registered in Bengaluru, Karnataka) is appointed by Mr. Vikram (a resident of Mumbai, Maharashtra) to prepare architectural interior blueprints for a luxury villa owned by Mr. Vikram in Dubai, UAE.',
      '(ii) TechVerify India Pvt. Ltd. (registered in Pune, Maharashtra) enters into an agreement with Precision Watches AG (Switzerland) to perform warranty repair services on watches purchased by Indian customers in India, for which Precision Watches AG pays TechVerify in convertible foreign exchange.',
      '(iii) FinConnect Pvt. Ltd. (registered in Gurugram, Haryana) acts as a commission agent arranging machinery export contracts between a German manufacturer and buyers in Vietnam, without taking title to the goods.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'Case (i) — Section 12(3) of the IGST Act, 2017: Where both supplier and recipient are located in India, the place of supply of services directly in relation to an immovable property (architectural services) is the location of the immovable property. However, per the proviso to Section 12(3), if the immovable property is located outside India (Dubai), the place of supply shall be the location of the recipient (Mumbai, Maharashtra).',
        'Case (ii) — Section 13(3)(a) of the IGST Act, 2017: For services supplied in respect of goods that are required to be made physically available by the recipient (or customers on its behalf) to the supplier, the place of supply is the location where the services are actually performed (Pune, India).',
        'Case (iii) — Section 13(2) of the IGST Act, 2017 (post deletion of Section 13(8)(b)): For intermediary services where one party is outside India, the place of supply is determined under the default rule of Section 13(2), i.e., the location of the recipient of services (Germany).'
      ],
      analysisAndWorkings: [
        '1. Case (i): Supplier in Karnataka, Recipient in Maharashtra, Property in Dubai ⇒ Proviso to Sec 12(3) applies ⇒ Place of Supply is Mumbai (Maharashtra). It is an Inter-State supply chargeable to IGST (NOT an export of service because recipient is in India).',
        '2. Case (ii): Goods are physically repaired in Pune, Maharashtra ⇒ Sec 13(3)(a) applies ⇒ Place of Supply is Pune (Maharashtra). Even though consideration is received in foreign exchange from Switzerland, it does not qualify as Export of Service because Place of Supply is in India. Intra-State supply (CGST + SGST).',
        '3. Case (iii): Supplier in Haryana, Recipient in Germany ⇒ Place of Supply under Sec 13(2) is Germany (outside India). Qualifies as Zero-Rated Export of Service under Section 2(6).'
      ],
      conclusion: 'Place of Supply is: (i) Mumbai, Maharashtra (Inter-State IGST); (ii) Pune, Maharashtra (Intra-State CGST+SGST); and (iii) Germany (Zero-Rated Export of Service).'
    }
  },
  {
    id: 'idt-nov24-q5a',
    subjectCode: 'IDT',
    attempt: 'Nov-24',
    attemptLabel: 'November 2024',
    questionNumber: 'Question 5(a)',
    marks: 6,
    chapterName: 'Payment of Tax',
    topicTag: 'Section 50(1), Section 50(3) & Rule 88B — Interest on Delayed Filing vs Wrongly Availed & Utilized ITC',
    questionText: [
      'Aashirwad Steels Ltd. failed to file its GSTR-3B return for the month of October 2024 by the due date of 20th November 2024, and finally filed it on 19th January 2025 (a delay of 60 days).',
      '• Gross Output Tax Liability for October 2024 was ₹18,00,000.',
      '• Balance available in the Electronic Credit Ledger on 20th November 2024 was ₹11,00,000.',
      '• Furthermore, on 10th November 2024 (prior to the due date of 20th November 2024), the company had already deposited ₹3,00,000 into its Electronic Cash Ledger, which remained there until debited upon filing GSTR-3B on 19th January 2025. The remaining ₹4,00,000 was deposited and debited on 19th January 2025.',
      'Calculate the exact interest payable under Section 50(1) read with Rule 88B of the CGST Rules, 2017.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per the proviso to Section 50(1) of the CGST Act, 2017 read with Rule 88B(1) of the CGST Rules, 2017, where a return is furnished after the due date (and before initiation of Section 73/74/74A proceedings), interest at 18% p.a. is payable ONLY on that portion of tax which is paid by debiting the Electronic Cash Ledger.',
        'Furthermore, as per the proviso to Rule 88B(1), any amount credited in the Electronic Cash Ledger on or before the due date of filing the return (and subsequently debited while filing the belated return) shall NOT be taken into account while calculating interest if the balance did not fall below such amount.'
      ],
      analysisAndWorkings: [
        '1. Gross Output Tax Liability = ₹18,00,000.',
        '2. Less: Paid by debiting Electronic Credit Ledger (No interest u/s 50(1)) = (₹11,00,000) ⇒ Total Cash Liability = ₹7,00,000.',
        '3. Less: Amount already lying in Electronic Cash Ledger on or before the due date of 20.11.2024 (Proviso to Rule 88B(1)) = (₹3,00,000).',
        '4. Net Delayed Cash Tax subject to Interest = ₹7,00,000 − ₹3,00,000 = ₹4,00,000.',
        '5. Interest @ 18% p.a. for 60 days = ₹4,00,000 × 18% × (60 / 365) = ₹11,836.'
      ],
      conclusion: 'Interest under Section 50(1) read with the amended proviso to Rule 88B(1) is payable only on ₹4,00,000 (excluding both ₹11,00,000 ITC and ₹3,00,000 pre-due-date Electronic Cash Ledger deposit), amounting to ₹11,836.'
    }
  },
  {
    id: 'idt-may24-q6a',
    subjectCode: 'IDT',
    attempt: 'May-24',
    attemptLabel: 'May 2024',
    questionNumber: 'Question 6(a)',
    marks: 5,
    chapterName: 'Appeals and Revision',
    topicTag: 'Sections 107 & 112 of CGST Act — Mandatory Pre-Deposit for Appellate Authority & GSTAT',
    questionText: [
      'The Additional Commissioner of Central Tax passed an adjudication order against M/s Trident Engineering demanding:',
      '• Disputed CGST of ₹80,00,000 and SGST of ₹80,00,000 (out of which M/s Trident Engineering admits ₹10,00,000 CGST and ₹10,00,000 SGST).',
      '• Interest of ₹24,00,000 (CGST) and ₹24,00,000 (SGST) on the total demand.',
      '• Penalty of ₹80,00,000 (CGST) and ₹80,00,000 (SGST) under Section 74.',
      'Calculate the mandatory pre-deposit required under Section 107(6) to file an appeal before the Appellate Authority, and also state what would be the pre-deposit if the order had imposed ONLY a penalty of ₹50,00,000 under Section 129(3) (detention of goods in transit) without any tax demand.'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        'As per Section 107(6) of the CGST Act, 2017, to file an appeal before the Appellate Authority, the appellant must pay:',
        '(a) 100% of the admitted tax, interest, fine, fee, and penalty arising from the impugned order, AND',
        '(b) A sum equal to 10% of the remaining amount of "tax in dispute" (subject to a maximum cap of ₹20 Crores CGST + ₹20 Crores SGST). No pre-deposit is required on disputed interest or disputed penalty where tax is also in dispute.',
        'However, per the proviso to Section 107(6), for an appeal against an order under Section 129(3) (detention/seizure of goods in transit), a pre-deposit of 25% of the penalty is mandatory.'
      ],
      analysisAndWorkings: [
        '1. Admitted Liability (100%): Admitted CGST ₹10,00,000 + Admitted SGST ₹10,00,000 + Proportionate Admitted Interest (₹3,00,000 CGST + ₹3,00,000 SGST) + Admitted Penalty = ₹26,00,000 (plus admitted penalty if any).',
        '2. Disputed Tax (excluding admitted ₹10L each): Disputed CGST = ₹70,00,000; Disputed SGST = ₹70,00,000.',
        '3. 10% of Disputed Tax u/s 107(6)(b): 10% of ₹70,00,000 = ₹7,00,000 (CGST) and ₹7,00,000 (SGST) = ₹14,00,000.',
        '4. Section 129(3) Transit Detention Order (Penalty ₹50,00,000): Mandatory Pre-Deposit = 25% of ₹50,00,000 = ₹12,50,000.'
      ],
      conclusion: 'Under Section 107(6), M/s Trident Engineering must pay 100% of the admitted tax/interest/penalty plus ₹14,00,000 (₹7L CGST + ₹7L SGST, being 10% of disputed tax). For a Section 129(3) order, 25% of the penalty (₹12,50,000) is required.'
    }
  },

  // ==========================================================================
  // PAPER 6: INTEGRATED BUSINESS SOLUTIONS (IBS)
  // ==========================================================================
  {
    id: 'ibs-nov26-master-7sub',
    subjectCode: 'IBS',
    attempt: 'May-26',
    attemptLabel: 'May 2026 (Master Case Study — 7 Subjects)',
    questionNumber: 'Case Study 1 (25 Marks — All 7 Subjects)',
    marks: 25,
    chapterName: 'Case Scenarios',
    topicTag: 'Cross-Disciplinary: Ind AS 103/115 + AFM APV/IRP + DT Sec 50B/194Q + IDT Sec 18(3)/17(5)/8(a) + Audit SA 600/CARO + Law Sec 185/188 + SCMPE Transfer Pricing',
    questionText: [
      'Aetherion Mobility Ltd. (AML), a listed EV manufacturer in Pune, executes five interlinked strategic initiatives during FY 2025-26:',
      '• Initiative I (FR & DT — Demerger/Slump Sale): On 01.04.2025, AML transfers its Legacy ICE Drivetrain Division to VoltEdge Ltd. (74% subsidiary) for lump-sum consideration of ₹480 Cr. Book Carrying Value of net assets = ₹310 Cr (Depreciable Block = ₹200 Cr, Land = ₹80 Cr, Net Working Capital = ₹30 Cr); Tax WDV of depreciable block = ₹140 Cr; Fair Value of identifiable net assets = ₹435 Cr (Stamp Duty Value of Land = ₹115 Cr). Both entities are controlled by the Apex Promoter Trust before and after.',
      '• Initiative II (IDT & DT — Bundled EV Fleet Contract): AML supplies 500 electric buses to Maharashtra State Road Transport Corp. (MSRTC) under a single bundled contract for ₹600 Cr (EV Buses [5% GST]: ₹500 Cr; 3-Year AMC [18% GST]: ₹60 Cr; High-Speed Chargers [18% GST]: ₹40 Cr). Additionally, AML constructs concrete EV charging foundations at its Chakan plant (Civil Works: ₹18 Cr + GST; Charging Equipment: ₹32 Cr + GST).',
      '• Initiative III (AFM & Law — Cross-Border Acquisition & Director Loan): AML evaluates a EUR 50 Million acquisition in Munich (Base Unlevered Cost of Equity Ku = 12%; EUR 20M green perpetual bond at 5% interest; German Tax Rate = 30%; Spot EUR/INR = ₹90.00; 1-Yr Risk-Free Rates: India = 7.10%, Eurozone = 3.00%). Separately, AML proposes a ₹45 Cr loan at 6.2% p.a. (10-Yr G-Sec = 7.15% p.a.) to KryoCells Pvt. Ltd., in which AML’s MD holds 28% equity voting power.',
      '• Initiative IV (SCMPE & Auditing — Internal Battery Transfer & Group Audit): AML’s Battery Cell Division (Capacity: 1,00,000 packs; Variable Cost: ₹1,10,000/pack; External Price: ₹1,65,000/pack; External Demand: 75,000 packs; Selling expense saved on internal transfer: ₹5,000/pack) receives an order for 40,000 packs from the EV Bus Division. Meanwhile, Statutory Auditor M/s R.K. Singhania & Co. notes that German subsidiary audited by Munich CPA firm accounts for 28% of consolidated revenue, and AML had a ₹14 Cr peak working capital sanction discrepancy over unaudited quarterly stock statements.',
      'Answer the following 7 interlinked requirements across all CA Final subjects:',
      '(1) [Financial Reporting — Ind AS 103 Appendix C & Ind AS 115]: Determine the accounting treatment of the ICE Division acquisition in VoltEdge Ltd.’s books and allocation of the ₹600 Cr MSRTC contract.',
      '(2) [Direct Tax Laws — Sec 47(iv), Sec 50B, Rule 11UAE & Sec 194Q/206C(1H)]: Compute LTCG on the transfer of the ICE Division and explain TDS/TCS obligations on the ₹600 Cr MSRTC contract.',
      '(3) [Indirect Tax Laws — Notif. 12/2017, Sec 18(3), Sec 8(a) & Sec 17(5)]: Examine GST on the going-concern transfer, unutilized ITC transfer, composite supply tax rate on MSRTC contract, and blocked ITC on charging foundations.',
      '(4) [Advanced Financial Management — International APV & IRP]: Calculate the 1-Year Forward EUR/INR rate under IRP and compute the Present Value of Interest Tax Shield (PVTS) on the EUR 20M debt.',
      '(5) [Corporate & Economic Laws (SPOM Set A) — Sec 185 & Sec 188]: Evaluate the validity of the ₹45 Cr loan to KryoCells Pvt. Ltd. under the Companies Act, 2013.',
      '(6) [SCMPE (SPOM Set B) — Minimum Transfer Price]: Compute the Minimum Transfer Price per battery pack for all 40,000 packs.',
      '(7) [Advanced Auditing — SA 600, SA 705 & CARO 2020]: Advise the Principal Auditor on division of responsibility for the German subsidiary and reporting under CARO 2020 Clause 3(ii)(b) & Clause 3(xiii).'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '1. FR (Ind AS 103 Appendix C & Ind AS 115): Common control business combinations require Pooling of Interest (assets/liabilities at carrying values; difference in Capital Reserve). Ind AS 115 requires unbundling distinct performance obligations (EV buses, Chargers, and 3-Year AMC) based on standalone selling prices.',
        '2. DT (Sec 47(iv), Sec 50B & Rule 11UAE): Sec 47(iv) exemption requires a 100% wholly-owned subsidiary; since VoltEdge is a 74% subsidiary, transfer is a taxable Slump Sale u/s 50B. FVC = Higher of FMV1 (₹465 Cr) or FMV2 (₹480 Cr).',
        '3. IDT (Entry 2 Notif. 12/2017-CT(R), Sec 18(3), Sec 8(a) & Sec 17(5)(c)/(d)): Going concern transfer is exempt; ITC transferred via GST ITC-02. Bundled supply with EV buses as principal supply is Composite Supply u/s 8(a) @ 5%. Civil foundation works for plant and machinery are excluded from blocked credit u/s 17(5) Explanation.',
        '4. AFM (Interest Rate Parity & APV): Forward Rate F = S × (1 + Rh)/(1 + Rf). Under APV, PV of Interest Tax Shield on perpetual debt = Debt × Tax Rate.',
        '5. Corporate Law (Sec 185(1), 185(2), 185(3) & Sec 188): Sec 185(2) prohibits loans to a private company where a director holds ≥ 25% voting power unless 3 cumulative conditions (Special Resolution, Principal Business use, and Interest Rate ≥ G-Sec Rate) are met.',
        '6. SCMPE (Goal-Congruent Transfer Pricing): Minimum TP = Variable Cost (less selling savings) + Opportunity Cost of lost contribution on diverted units.',
        '7. Auditing (SA 600, SA 705 & CARO 2020): Under SA 600, Principal Auditor can state division of responsibility in Other Matter Paragraph. CARO Clause 3(ii)(b) triggers on working capital limits > ₹5 Cr from banks/FIs against current assets.'
      ],
      analysisAndWorkings: [
        '• FR Working: VoltEdge records net assets at ₹310 Cr (Carrying Value); excess consideration ₹170 Cr (₹480 Cr − ₹310 Cr) is debited to Capital Reserve in Equity. Under Ind AS 115, ₹540 Cr (Buses + Chargers) recognized on delivery; ₹60 Cr (AMC) deferred over 36 months (₹20 Cr/yr).',
        '• DT Working (Sec 50B): Tax Net Worth = ₹140 Cr (Tax WDV) + ₹80 Cr (Land Book Cost) + ₹30 Cr (NWC) = ₹250 Cr. FMV1 (Rule 11UAE) = ₹200 Cr + ₹115 Cr (SDV of Land) + ₹30 Cr + ₹120 Cr = ₹465 Cr. FMV2 = ₹480 Cr. FVC = ₹480 Cr. Taxable LTCG = ₹480 Cr − ₹250 Cr = ₹230 Cr. Under Sec 194Q, MSRTC deducts TDS @ 0.1% on (₹600 Cr − ₹50 Lakhs); Sec 206C(1H) TCS does not apply.',
        '• IDT Working: Entire ₹600 Cr Composite Supply taxed @ 5% (Principal supply = EV Buses). Full ITC on ₹32 Cr Charging Equipment AND ₹18 Cr concrete foundation is eligible because Explanation to Sec 17(5) excludes structural support/foundation for plant and machinery from "immovable property".',
        '• AFM Working: 1-Yr Forward EUR/INR = 90.00 × (1.0710 / 1.0300) = ₹93.5825/EUR. PV of Tax Shield = EUR 20M × 30% = EUR 6.00 Million (₹54.00 Cr at spot).',
        '• Law Working (Sec 185): MD holds 28% (≥ 25% threshold under Sec 185(2) Explanation (b)). Proposed interest rate (6.2% p.a.) is lower than 10-Yr G-Sec rate (7.15% p.a.), violating Sec 185(3)(b). Thus, the ₹45 Cr loan is void/illegal unless interest is raised to ≥ 7.15% p.a. and Special Resolution is passed.',
        '• SCMPE Working: Net VC for internal transfer = ₹1,10,000 − ₹5,000 = ₹1,05,000/pack. Spare capacity = 25,000 packs (Zero opportunity cost). Diverted capacity = 15,000 packs (Contribution lost = ₹1,65,000 − ₹1,10,000 = ₹55,000/pack). Total Opportunity Cost = 15,000 × ₹55,000 = ₹82.50 Cr. Average Opportunity Cost across 40,000 packs = ₹20,625/pack. Minimum Transfer Price = ₹1,05,000 + ₹20,625 = ₹1,25,625/pack.',
        '• Audit Working: Cite Component Auditor in Other Matter Para (SA 600). Report ₹14 Cr quarterly stock statement discrepancy under CARO Clause 3(ii)(b) (Sanctioned WC limit > ₹5 Cr). If Sec 185 loan is disbursed at 6.2%, qualify opinion under SA 705 and report violation under Sec 143(3)(f)/(h).'
      ],
      conclusion: 'VoltEdge records ₹310 Cr net assets with ₹170 Cr Capital Reserve debit (Ind AS 103 App C); AML pays LTCG on ₹230 Cr u/s 50B; MSRTC contract is taxed at 5% GST u/s 8(a) with full foundation ITC u/s 17(5); Forward rate is ₹93.5825/EUR with EUR 6M APV tax shield; Loan @ 6.2% violates Sec 185(2)/(3); Minimum Battery TP is ₹1,25,625/pack; and Auditor reports under SA 600 & CARO Clause 3(ii)(b).'
    }
  },
  {
    id: 'ibs-may26-q1',
    subjectCode: 'IBS',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Case Study 2 (Descriptive)',
    marks: 15,
    chapterName: 'Case Study: Ind AS & Financial Reporting Integration',
    topicTag: 'Cross-Disciplinary: Ind AS 103 Demerger/Acquisition + Sec 2(19AA) Income Tax + GST Transfer of Going Concern',
    questionText: [
      ' Helios Renewables Ltd. transferred its Solar EPC Division on a going concern basis to its 80% subsidiary, Surya Grid Ltd., on 1st April 2025 for a lump-sum consideration of ₹420 Crores.',
      '• Carrying amount of identifiable net assets of the Solar EPC Division in Helios’s standalone books was ₹310 Crores, while its Fair Value on 1st April 2025 was ₹380 Crores.',
      '• Both companies are controlled by the same promoter group before and after the transaction for more than 3 years.',
      'Advise the Board of Directors across all three domains:',
      '(a) Financial Reporting (Ind AS 103 Appendix C): How should Surya Grid Ltd. account for the acquisition of the Solar EPC Division?',
      '(b) Direct Tax (Section 47(iv) & Section 50B): Does the transfer enjoy capital gains exemption under Section 47(iv), and what is the cost of assets in the hands of Surya Grid Ltd.?',
      '(c) Indirect Tax (Notification No. 12/2017-CT (Rate) & Section 18(3)): What is the GST implication on the transfer of a going concern and transfer of unutilized ITC?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '(a) Financial Reporting — Appendix C to Ind AS 103 (Business Combinations of Entities under Common Control): Since both Helios Renewables Ltd. (Parent) and Surya Grid Ltd. (80% Subsidiary) are ultimately controlled by the same party before and after the transfer, Appendix C mandates the "Pooling of Interest Method".',
        '(b) Direct Tax — Section 47(iv) of the Income-tax Act, 1961: Any transfer of a capital asset by a parent company to its Indian subsidiary company is exempt from Capital Gains ONLY IF the parent company holds 100% of the whole of the share capital of the subsidiary. Since Helios holds only 80%, Section 47(iv) exemption is NOT available and it is taxable as a Slump Sale under Section 50B.',
        '(c) Indirect Tax — Entry 2 of Notification No. 12/2017-CT (Rate) & Section 18(3) read with Rule 41: Services by way of transfer of a going concern, as a whole or an independent part thereof, is wholly EXEMPT from GST. Unutilized ITC in the Electronic Credit Ledger can be transferred via Form GST ITC-02.'
      ],
      analysisAndWorkings: [
        '1. Ind AS 103 Appendix C Accounting in Surya Grid Ltd.: Assets and liabilities of the Solar EPC Division must be recorded at their existing carrying amounts (₹310 Crores), NOT at fair value (₹380 Crores). No new goodwill is recognized. The excess consideration paid (₹420 Cr − ₹310 Cr = ₹110 Crores) is debited to Capital Reserve in Equity.',
        '2. Income Tax Impact: Because Surya Grid Ltd. is an 80% subsidiary (not a 100% wholly owned subsidiary), Helios Renewables Ltd. is liable to pay Long-Term Capital Gains tax under Section 50B (Full Value of Consideration = Higher of FMV1 ₹380 Cr or FMV2 ₹420 Cr = ₹420 Crores minus Net Worth).',
        '3. GST Impact: Transfer of an independent division as a going concern is an exempt supply of service (Serial No. 2 of Notification 12/2017), and unutilized ITC is transferred via Form GST ITC-02.'
      ],
      conclusion: 'Surya Grid Ltd. must apply Pooling of Interest under Ind AS 103 Appendix C (carrying value ₹310 Cr, debiting ₹110 Cr to Capital Reserve); Helios is taxable under Section 50B (as 80% holding fails Sec 47(iv)); and the transfer is exempt from GST with ITC transferable via GST ITC-02.'
    }
  },
  {
    id: 'ibs-jan26-q2',
    subjectCode: 'IBS',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Case Study 2 (Descriptive)',
    marks: 15,
    chapterName: 'Case Study: Corporate Valuation, Forex & Treasury (AFM)',
    topicTag: 'Cross-Disciplinary: Foreign Currency ECB Hedging + Ind AS 21/23 + Sec 194LC/195 Withholding Tax',
    questionText: [
      'Navbharat Semiconductors Ltd. availed an External Commercial Borrowing (ECB) of USD 10 Million on 1st April 2025 at an interest rate of SOFR + 200 bps (= 6% p.a. payable annually on 31st March) to finance a qualifying semiconductor fab plant under construction.',
      '• Exchange rates: 1st April 2025 = ₹83.00/USD; 31st March 2026 = ₹85.50/USD.',
      '• Equivalents rupee borrowing rate for the company in India on 1st April 2025 was 9.50% p.a.',
      'Analyze and compute:',
      '(a) Financial Reporting (Ind AS 21 & Ind AS 23 Para 6(e)): How much of the foreign exchange loss on the ECB principal and interest can be capitalized into the qualifying asset as borrowing cost for FY 2025-26?',
      '(b) Direct Tax (Section 43A & Section 115A/195): How is the exchange fluctuation treated under the Income-tax Act, and what is the withholding tax rate on the ECB interest?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '(a) Ind AS 23 (Para 6(e)): Exchange differences arising from foreign currency borrowings are treated as an adjustment to interest costs (and capitalized into the qualifying asset) to the extent they do not exceed the difference between the cost of borrowing in functional currency (INR @ 9.50%) and the cost of borrowing in foreign currency (USD @ 6%).',
        '(b) Section 43A of the Income-tax Act, 1961: Any increase or reduction in liability on account of exchange rate fluctuation on a foreign currency loan taken to acquire an asset from outside India (or domestic asset rules) is adjusted against the actual cost of the asset ONLY at the time of actual payment, not on year-end MTM restatement.'
      ],
      analysisAndWorkings: [
        '1. Foreign Currency Interest Expense (FY 25-26) = USD 10M × 6% × ₹85.50 = ₹5,13,00,000 (₹5.13 Crores).',
        '2. Exchange Loss on Principal Restatement on 31.03.2026 = USD 10M × (₹85.50 − ₹83.00) = ₹2,50,00,000 (₹2.50 Crores).',
        '3. Hypothetical Functional Currency (INR) Interest @ 9.50% = (USD 10M × ₹83.00) × 9.50% = ₹83,00,00,000 × 9.50% = ₹7,88,50,000 (₹7.885 Crores).',
        '4. Maximum Exchange Loss Capitalizable under Ind AS 23 Para 6(e) = ₹7,88,50,000 − ₹5,13,00,000 = ₹2,75,50,000 (₹2.755 Crores).',
        '5. Since actual exchange loss on principal is ₹2.50 Crores (which is within the ₹2.755 Crores cap), the ENTIRE ₹2.50 Crores exchange loss + ₹5.13 Crores interest = ₹7.63 Crores is capitalized into the semiconductor fab CWIP under Ind AS 23.'
      ],
      conclusion: 'Under Ind AS 23, the entire ₹2.50 Crores exchange loss plus ₹5.13 Crores interest (Total ₹7.63 Crores) is capitalized into the qualifying asset. For Income Tax under Section 43A, MTM exchange loss of ₹2.50 Crores is adjusted in actual cost only in the year of actual repayment of principal.'
    }
  },
  {
    id: 'ibs-sep25-q3',
    subjectCode: 'IBS',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Case Study 3 (Descriptive)',
    marks: 15,
    chapterName: 'Case Study: Statutory Audit, Group Audit & Professional Ethics',
    topicTag: 'Cross-Disciplinary: SA 240 Fraud Reporting u/s 143(12) + Ind AS 8 Prior Period Error + Sec 74 GST Demand',
    questionText: [
      'During the statutory audit of Apex Logistics Ltd. for FY 2024-25, the engagement partner discovered that the procurement head had colluded with two fictitious transport vendors and siphoned off ₹1.80 Crores during FY 2023-24 and FY 2024-25 using fake GST tax invoices.',
      '• The company had availed Input Tax Credit (ITC) of ₹32.40 Lakhs on these invoices without actual receipt of goods or services.',
      'Advise the company and the statutory auditor on:',
      '(a) Statutory Audit (Section 143(12) of the Companies Act, 2013 & Rule 13): To whom and within what timeline must the auditor report this fraud?',
      '(b) Financial Reporting (Ind AS 8): How should the fictitious expense of ₹1.20 Crores relating to FY 2023-24 be rectified in the financial statements of FY 2024-25?',
      '(c) Indirect Tax (Section 16(2)(b), Section 50(3) & Section 122(1)): What is the interest and penalty consequence under GST for availing and utilizing ITC on fake invoices?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '(a) Section 143(12) of the Companies Act, 2013 read with Rule 13: Since the fraud involves an amount of ₹1 Crore or more (₹1.80 Crores), the statutory auditor must report the matter to the Central Government (in Form ADT-4) after first forwarding the report to the Board/Audit Committee within 2 days of knowledge and waiting 45 days for their reply.',
        '(b) Ind AS 8 (Accounting Policies, Changes in Accounting Estimates and Errors): Fraudulent financial reporting from a prior period is a "Prior Period Error" and must be corrected by retrospective restatement of the comparative amounts for FY 2023-24.',
        '(c) Section 16(2)(b), Section 50(3) & Section 74/122(1) of the CGST Act, 2017: Receipt of goods/services is a mandatory pre-condition for ITC. ITC wrongly availed AND utilized attracts interest at 18% p.a. under Section 50(3) and penalty equal to 100% of tax under Section 74 / Section 122(1)(ii)/(vii).'
      ],
      analysisAndWorkings: [
        '1. Reporting Timeline u/s 143(12): Report to Board/Audit Committee within 2 days → Board has 45 days to reply → Auditor forwards report + Board’s reply (or note of no reply) to the Secretary, MCA in Form ADT-4 within 15 days of receipt/expiry of 45 days.',
        '2. Ind AS 8 Restatement: Comparative P&L for FY 2023-24 and Opening Retained Earnings as on 1st April 2024 are restated by reversing ₹1.20 Crores fictitious transport cost and recognizing any recoverable insurance/claim only if virtually certain.',
        '3. GST Reversal & Penalty: Reverse ₹32.40 Lakhs ITC along with 18% p.a. interest under Rule 88B(3) (from date of utilization till date of reversal) and 100% penalty (₹32.40 Lakhs).'
      ],
      conclusion: 'The auditor must report the ₹1.80 Crore fraud to the Central Government in Form ADT-4; prior year comparatives must be retrospectively restated under Ind AS 8; and ₹32.40 Lakhs ITC must be reversed with 18% interest and 100% penalty.'
    }
  },
  {
    id: 'ibs-may25-q4',
    subjectCode: 'IBS',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Case Study 4 (Descriptive)',
    marks: 15,
    chapterName: 'Case Study: Direct Tax Restructuring & Cross-Border Taxation',
    topicTag: 'Cross-Disciplinary: Share Buy-Back Tax Amendment (Deemed Dividend u/s 2(22)(f)) + Ind AS 32 Treasury Shares',
    questionText: [
      'On 15th November 2024, TechNova India Ltd. (a listed company) bought back 1,00,000 of its own equity shares (face value ₹10 each) at a buy-back price of ₹850 per share from its shareholders.',
      '• Mr. Kabir, a resident investor, had originally subscribed to 5,000 equity shares in the IPO in 2021 at ₹300 per share. Out of these, 2,000 shares were bought back by TechNova India Ltd. on 15th November 2024 at ₹850 per share (Total received = ₹17,00,000).',
      '• Later, on 10th February 2025, Mr. Kabir sold his remaining 3,000 equity shares on the stock exchange at ₹920 per share.',
      'Examine the accounting and tax implications:',
      '(a) Direct Tax (Section 2(22)(f), Section 46A & Section 194): How is the buy-back taxed in the hands of TechNova India Ltd. and Mr. Kabir for A.Y. 2025-26 (post 1st October 2024 amendment)?',
      '(b) Financial Reporting (Ind AS 32): How does TechNova India Ltd. account for the buy-back and transaction costs of ₹12 Lakhs in its financial statements?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '(a) Direct Tax Amendment (w.e.f. 1st October 2024): For any buy-back of shares taking place on or after 1st October 2024, the company is NO LONGER liable to pay buy-back tax under Section 115QA. Instead:',
        '  • The entire sum received by the shareholder on buy-back (₹17,00,000) is taxed as Deemed Dividend under Section 2(22)(f) under the head "Income from Other Sources" at applicable slab rates without any deduction for expenses (and subject to 10% TDS under Section 194).',
        '  • Under the proviso to Section 46A, the value of consideration received on buy-back is deemed to be NIL, and the original cost of acquisition of the bought-back shares (2,000 × ₹300 = ₹6,00,000) becomes a Long-Term Capital Loss, which can be set off against Long-Term Capital Gains!',
        '(b) Financial Reporting (Ind AS 32 Para 33 & 37): Consideration paid for buy-back of own equity instruments and incremental transaction costs are deducted directly from Equity. No gain or loss is recognized in Profit or Loss.'
      ],
      analysisAndWorkings: [
        '1. In the hands of Mr. Kabir on 15th November 2024 (Buy-back of 2,000 shares):',
        '   • Deemed Dividend u/s 2(22)(f) taxable under IFOS = 2,000 × ₹850 = ₹17,00,000 (TechNova deducts TDS @ 10% u/s 194 = ₹1,70,000).',
        '   • Capital Gain/Loss u/s 46A: Full Value of Consideration = Nil; Less: Cost of Acquisition (2,000 × ₹300) = ₹6,00,000 ⇒ Long-Term Capital Loss (LTCL) = (₹6,00,000).',
        '2. On Sale of Remaining 3,000 Shares on 10th February 2025:',
        '   • Gross LTCG u/s 112A = 3,000 × (₹920 − ₹300) = ₹18,60,000.',
        '   • Less: Set-off of LTCL generated on buy-back u/s 46A = (₹6,00,000) ⇒ Net LTCG u/s 112A = ₹12,60,000 (taxable @ 12.5% above ₹1,25,000 exemption).',
        '3. Ind AS 32 Accounting in TechNova India Ltd.: Share Capital debited by ₹10 Lakhs, Securities Premium/Retained Earnings debited by ₹840 Lakhs + ₹12 Lakhs transaction cost, and ₹10 Lakhs transferred to Capital Redemption Reserve u/s 69 of the Companies Act, 2013.'
      ],
      conclusion: 'Mr. Kabir is taxed on ₹17,00,000 as Deemed Dividend u/s 2(22)(f), and his ₹6,00,000 cost of bought-back shares becomes an allowable Long-Term Capital Loss u/s 46A reducing his LTCG on the February 2025 sale from ₹18,60,000 to ₹12,60,000.'
    }
  },
  {
    id: 'ibs-nov24-q5',
    subjectCode: 'IBS',
    attempt: 'Nov-24',
    attemptLabel: 'November 2024',
    questionNumber: 'Case Study 5 (Descriptive)',
    marks: 15,
    chapterName: 'Case Study: GST Supply, ITC & Customs Valuation',
    topicTag: 'Cross-Disciplinary: Ind AS 115 Warranty vs Extended Warranty + GST Composite/Separate Supply + Sec 37(1) Provision',
    questionText: [
      'ElectroCool Appliances Ltd. sells industrial chillers at ₹5,00,000 per unit (inclusive of a standard 1-year assurance warranty against manufacturing defects). Customers also have the option to purchase an Extended 2-Year Service Warranty at the time of sale for an additional ₹45,000.',
      '• Based on past technical data, expected warranty claim cost for the standard 1-year assurance warranty is 2% of sales (₹10,000 per unit).',
      'Advise ElectroCool Appliances Ltd. across all three laws:',
      '(a) Financial Reporting (Ind AS 115 & Ind AS 37): How should the standard 1-year warranty and the optional ₹45,000 extended warranty be accounted for?',
      '(b) Indirect Tax (Section 8 & Circular No. 195/07/2023-GST): What is the GST treatment on replacement of parts during the warranty period and on the extended warranty?',
      '(c) Direct Tax (Section 37(1) — Rotork Controls SC Ruling): Is the provision of ₹10,000 per unit for standard warranty deductible in computing PGBP?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '(a) Ind AS 115 (Appendix B28–B33): The standard 1-year warranty only provides assurance that the product complies with agreed specifications and is accounted for as a provision under Ind AS 37 (₹10,000 per unit). The optional 2-year extended warranty (₹45,000) provides a service in addition to assurance and is a separate Performance Obligation under Ind AS 115 (deferred as Contract Liability and recognized over Years 2 and 3).',
        '(b) GST Circular No. 195/07/2023-GST: Where the original supply of goods includes warranty, replacement of parts/repairs during the warranty period without separate consideration is NOT chargeable to GST, and no reversal of ITC is required by the manufacturer. Extended warranty sold at the time of original supply by the supplier itself forms part of a composite supply (principal supply being goods), whereas if sold after original supply or by a third party, it is a supply of service.',
        '(c) Income Tax — Supreme Court in Rotork Controls India (P) Ltd. v. CIT: Provision for warranty is allowable as a deduction under Section 37(1) if: (1) there is a present obligation arising from past events (sale of chillers), (2) outflow of resources is probable, and (3) a reliable estimate is made based on historical scientific data.'
      ],
      analysisAndWorkings: [
        '1. Ind AS Recognition on Sale of 1 Chiller + Extended Warranty (₹5,45,000): Recognize ₹5,00,000 immediately as Revenue on delivery of chiller + Create Warranty Provision of ₹10,000 under Ind AS 37; Defer ₹45,000 as Contract Liability (Unearned Revenue) to be recognized over Years 2 and 3.',
        '2. GST Compliance: Free replacement of defective compressor/parts under standard warranty attracts Nil GST and Zero ITC reversal.',
        '3. Income Tax Deduction: Scientific provision of ₹10,000 per unit is fully deductible under Section 37(1) in the year of sale.'
      ],
      conclusion: 'Standard warranty is accounted for under Ind AS 37 (and deductible u/s 37(1) per Rotork Controls), extended warranty is a separate performance obligation under Ind AS 115, and warranty replacements attract neither GST nor ITC reversal.'
    }
  },
  {
    id: 'ibs-may24-q6',
    subjectCode: 'IBS',
    attempt: 'May-24',
    attemptLabel: 'May 2024',
    questionNumber: 'Case Study 6 (Descriptive)',
    marks: 15,
    chapterName: 'Case Study: FEMA, IBC & Corporate Governance',
    topicTag: 'Cross-Disciplinary: Ind AS 109 Modification of Debt under Restructuring + Sec 41(1)/28(iv) Tax on Loan Waiver',
    questionText: [
      'Sterling Forgings Ltd. had an outstanding term loan of ₹100 Crores from a consortium of banks carrying interest at 10% p.a. with 4 years remaining maturity. Due to financial distress, on 1st April 2024, the consortium approved a debt restructuring package:',
      '• Principal of ₹30 Crores was waived off immediately.',
      '• The remaining principal of ₹70 Crores will carry a reduced interest rate of 6% p.a. for the remaining 4 years.',
      '• The loan was originally taken 5 years ago to acquire imported forging presses (capital assets).',
      'Analyze the implications:',
      '(a) Financial Reporting (Ind AS 109 Para 3.3.2): Does this restructuring pass the "10% Quantitative Test" for substantial modification, and how is the gain recognized?',
      '(b) Direct Tax (Section 41(1), Section 28(iv) & Mahindra and Mahindra SC Ruling): Is the principal waiver of ₹30 Crores on a term loan taken for acquiring capital assets taxable under the Income-tax Act, 1961?'
    ],
    suggestedAnswer: {
      provisionOrStandard: [
        '(a) Ind AS 109 (Derecognition of Financial Liabilities — Para 3.3.2 & B3.3.6): Terms are "substantially different" if the discounted present value of the cash flows under the new terms (discounted using the original effective interest rate of 10%) is at least 10% different from the discounted present value of the remaining cash flows of the original liability. If ≥ 10%, it is accounted for as an extinguishment of the original liability and recognition of a new financial liability at fair value.',
        '(b) Income Tax — Supreme Court in CIT v. Mahindra and Mahindra Ltd. & Section 28(iv) / 41(1): Waiver of a loan taken for acquiring capital assets is neither a non-monetary perquisite before/after amendment (or examine monetary waiver) nor a cessation of a trading liability under Section 41(1) because the principal loan was never claimed as a deduction in P&L.'
      ],
      analysisAndWorkings: [
        '1. Ind AS 109 10% Test (Discounted at Original EIR of 10% for 4 years; PVAF = 3.1699, PVF = 0.6830):',
        '   • Carrying Amount of Original Liability = ₹100.00 Crores.',
        '   • PV of Restructured Cash Flows @ 10% = (Annual Interest ₹70 Cr × 6% = ₹4.20 Cr × 3.1699) + (Principal ₹70 Cr × 0.6830) = ₹13.31 Cr + ₹47.81 Cr = ₹61.12 Crores.',
        '   • Percentage Difference = (100.00 − 61.12) / 100.00 = 38.88% (which is ≥ 10%).',
        '   • Therefore, it is a Substantial Modification (Extinguishment). Derecognize ₹100 Cr liability, recognize new liability at fair value, and credit Gain on Extinguishment of Debt to P&L.',
        '2. Direct Tax Treatment: Since the term loan was utilized for acquiring capital assets (not working capital/trading liability), Section 41(1) does not apply as no deduction was ever claimed for the principal. Under Section 28(iv) (as settled by Supreme Court in Mahindra and Mahindra Ltd.), waiver of cash loan for capital asset is a capital receipt not chargeable to tax (though if interest was earlier claimed u/s 36(1)(iii), interest waiver is taxable u/s 41(1)).'
      ],
      conclusion: 'Since the PV difference is 38.88% (≥ 10%), Sterling Forgings Ltd. accounts for the restructuring as a debt extinguishment under Ind AS 109. For Income Tax, the ₹30 Crore principal waiver of a capital asset loan is not taxable under Section 41(1) or Section 28(iv).'
    }
  },
  ...FOUNDATION_INTER_PAST_PAPERS
];

