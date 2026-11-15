/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import type { SubjectId } from '../types.ts';

export type CALevel = 'final' | 'intermediate' | 'foundation' | 'cma_final' | 'cma_intermediate' | 'cma_foundation';
export type CourseStream = 'CA' | 'CMA';
export type BaseLevelStage = 'foundation' | 'intermediate' | 'final';

export interface SpomModuleSpec {
  setCode: 'Set A' | 'Set B' | 'Set C' | 'Set D';
  title: string;
  mandatoryStatus: string;
}

export interface CALevelSubjectSpec {
  code: SubjectId;
  paper: string;
  paperNumber: string;
  group: 'Group I' | 'Group II' | 'Unified';
  name: string;
  fullName: string;
  chapters: string[];
  colorCode: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export interface CALevelInfo {
  id: CALevel;
  courseStream: CourseStream;
  baseStage: BaseLevelStage;
  name: string;
  shortName: string;
  badge: string;
  paperStructureSummary: string;
  description: string;
  hasGroups: boolean;
  spomModules?: SpomModuleSpec[];
  subjects: CALevelSubjectSpec[];
}

export const CA_CURRICULUM_LEVELS: Record<CALevel, CALevelInfo> = {
  final: {
    id: 'final',
    courseStream: 'CA',
    baseStage: 'final',
    name: 'CA Final (New Scheme)',
    shortName: 'CA Final',
    badge: '3 + 3 Papers + SPOM',
    paperStructureSummary: '3 + 3 Papers + SPOM (Group I: P1–P3 · Group II: P4–P6 · SPOM Sets A–D)',
    description: 'Advanced strategic, reporting, audit, and tax mastery for Chartered Accountants (3+3 Papers + SPOM Sets A–D).',
    hasGroups: true,
    spomModules: [
      {
        setCode: 'Set A',
        title: 'Corporate and Economic Laws',
        mandatoryStatus: 'Mandatory Self-Paced Online Module (100 Marks)',
      },
      {
        setCode: 'Set B',
        title: 'Strategic Cost & Performance Management (SCPM)',
        mandatoryStatus: 'Mandatory Self-Paced Online Module (100 Marks)',
      },
      {
        setCode: 'Set C',
        title: 'Multidisciplinary Elective (Risk Mgmt / Sustainable Dev / Valuation / Capital Markets / Forex / Intl Tax / Insolvency)',
        mandatoryStatus: 'Elective Self-Paced Online Module (Choose 1 of 10)',
      },
      {
        setCode: 'Set D',
        title: 'Multidisciplinary Constitution of India / Psychology & Philosophy / Entrepreneurship / Advocacy',
        mandatoryStatus: 'Elective Self-Paced Online Module (Choose 1 of 4)',
      },
    ],
    subjects: [
      {
        code: 'FR',
        paper: 'P1',
        paperNumber: 'Paper 1',
        group: 'Group I',
        name: 'Financial Reporting',
        fullName: 'Financial Reporting (FR)',
        chapters: [
          'Applicability of IND AS',
          'Ind AS 16 Property Plant & Equipment',
          'Ind AS 40 Investment Property',
          'Ind AS 38 Intangible Assets',
          'Ind AS 36 Impairment of Assets',
          'Ind AS 105 Non Current Assets Held For Sale',
          'Ind AS 23 Borrowing Costs',
          'Ind AS 2 Inventories',
          'Ind AS 41 Agriculture',
          'Ind AS 20 Accounting for Govt Grants',
          'Ind AS 113 Fair Value Measurement',
          'Ind AS 102 Share Based Payment',
          'Ind AS 116 Leases',
          'IND AS 37 Provisions, Contingent',
          'Ind AS 108 Operating Segments',
          'Analysis of FS',
          'Ind AS 19 Employee Benefits',
          'Financial Instruments',
          'Ind AS 33 Earnings Per Share',
          'Ind AS 34 Interim Financial Reporting',
          'Ind AS 1 Presentation of FS',
          'Ind AS 10 Events After the Reporting',
          'Ind AS 8 Acc Policies Errors',
          'Ind AS 7 Statement of Cash Flows',
          'Ind AS 12 Income Taxes',
          'Ind AS 103 Business Combination',
          'Consolidation',
          'JV & Associates',
          'Ind AS 24 Related Party Disclosures',
          'Ind AS 21 Forex',
          'Ind AS 115 Revenue',
          'Ind AS 101 First Time Adoption',
          'Conceptual Framework',
          'Professional and Ethical Duty of CA',
          'Accounting & Tech'
        ],
        colorCode: '#00D2FF',
        textClass: 'text-[#00D2FF]',
        bgClass: 'bg-[#00D2FF]/10',
        borderClass: 'border-[#00D2FF]/20'
      },
      {
        code: 'AFM',
        paper: 'P2',
        paperNumber: 'Paper 2',
        group: 'Group I',
        name: 'Adv Financial Mgmt',
        fullName: 'Advanced Financial Management (AFM)',
        chapters: [
          'Financial Policy and Corporate Strategy',
          'Risk Management',
          'Advanced Capital Budgeting Decisions',
          'Security Analysis',
          'Security Valuation',
          'Portfolio Management',
          'Securitization',
          'Mutual Funds',
          'Derivatives Analysis and Valuation',
          'Foreign Exchange Exposure and Risk Management',
          'International Financial Management',
          'Interest Rate Risk Management',
          'Business Valuation',
          'Mergers, Acquisitions and Corporate Restructuring',
          'Startup Finance'
        ],
        colorCode: '#FF3366',
        textClass: 'text-[#FF3366]',
        bgClass: 'bg-[#FF3366]/10',
        borderClass: 'border-[#FF3366]/20'
      },
      {
        code: 'Audit',
        paper: 'P3',
        paperNumber: 'Paper 3',
        group: 'Group I',
        name: 'Auditing & Ethics',
        fullName: 'Advanced Auditing, Assurance & Professional Ethics (Audit)',
        chapters: [
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
          'Sustainable Development Goals (SDG) & ESG Assurance',
          'Professional Ethics & Code of Ethics'
        ],
        colorCode: '#9D4EDD',
        textClass: 'text-[#9D4EDD]',
        bgClass: 'bg-[#9D4EDD]/10',
        borderClass: 'border-[#9D4EDD]/20'
      },
      {
        code: 'DT',
        paper: 'P4',
        paperNumber: 'Paper 4',
        group: 'Group II',
        name: 'Direct Tax Laws',
        fullName: 'Direct Tax Laws and International Taxation (DT)',
        chapters: [
          'Basic Concepts & Tax Rates',
          'Incomes which do not form part of Total Income',
          'Profits and Gains of Business or Profession (PGBP)',
          'Capital Gains',
          'Income from Other Sources',
          'Income of Other Persons included in Assessees Total Income',
          'Aggregation of Income, Set-Off and Carry Forward of Losses',
          'Deductions from Gross Total Income (Chapter VI-A)',
          'Assessment of Various Entities (Trusts, AOP/BOI, Firms, LLPs)',
          'Tax Deduction at Source, Tax Collection at Source and Advance Tax',
          'Provisions for Filing Return of Income and Self-Assessment',
          'Appeals and Revision',
          'Assessment, Reassessment and Search Procedures',
          'Penalties and Prosecutions',
          'Transfer Pricing and Other Anti-Avoidance Measures',
          'Non-Resident Taxation & Double Taxation Relief (DTAA)',
          'Equalisation Levy & Model Tax Conventions'
        ],
        colorCode: '#FF9F1C',
        textClass: 'text-[#FF9F1C]',
        bgClass: 'bg-[#FF9F1C]/10',
        borderClass: 'border-[#FF9F1C]/20'
      },
      {
        code: 'IDT',
        paper: 'P5',
        paperNumber: 'Paper 5',
        group: 'Group II',
        name: 'Indirect Tax Laws',
        fullName: 'Indirect Tax Laws (IDT - GST & Customs)',
        chapters: [
          'Supply under GST',
          'Charge of GST & Reverse Charge Mechanism (RCM)',
          'Place of Supply',
          'Exemptions from GST',
          'Time of Supply',
          'Value of Supply',
          'Input Tax Credit (ITC)',
          'Registration',
          'Tax Invoice, Credit and Debit Notes & E-Way Bill',
          'Accounts and Records',
          'Payment of Tax',
          'Refunds',
          'Returns',
          'Job Work & Electronic Commerce',
          'Assessment and Audit',
          'Inspection, Search, Seizure and Arrest',
          'Demands and Recovery',
          'Liability to Pay in Certain Cases',
          'Offences and Penalties',
          'Appeals and Revision',
          'Advance Ruling',
          'Customs Levy & Exemptions',
          'Types of Duty & Classification',
          'Valuation under Customs',
          'Importation, Exportation & Transportation of Goods',
          'Warehousing & Duty Drawback',
          'Foreign Trade Policy (FTP)'
        ],
        colorCode: '#10B981',
        textClass: 'text-[#10B981]',
        bgClass: 'bg-[#10B981]/10',
        borderClass: 'border-[#10B981]/20'
      },
      {
        code: 'IBS',
        paper: 'P6',
        paperNumber: 'Paper 6',
        group: 'Group II',
        name: 'Integrated Business Sol.',
        fullName: 'Integrated Business Solutions (IBS - Multi-Disciplinary)',
        chapters: [
          'Financial Reporting',
          'Advanced Financial Management',
          'Auditing',
          'Direct Taxes',
          'Indirect Taxes',
          'Corporate & Economic Laws',
          'SCMPE',
          'Case Scenarios'
        ],
        colorCode: '#FFD166',
        textClass: 'text-[#FFD166]',
        bgClass: 'bg-[#FFD166]/10',
        borderClass: 'border-[#FFD166]/20'
      }
    ]
  },
  intermediate: {
    id: 'intermediate',
    courseStream: 'CA',
    baseStage: 'intermediate',
    name: 'CA Intermediate (New Scheme)',
    shortName: 'CA Inter',
    badge: '3 + 3 Papers (Group I & II)',
    paperStructureSummary: '3 + 3 Papers (Group I: P1–P3 · Group II: P4–P6)',
    description: 'Official ICAI New Scheme curriculum across 3 + 3 papers: Group I (P1–P3) & Group II (P4–P6).',
    hasGroups: true,
    subjects: [
      {
        code: 'AdvAcc',
        paper: 'P1',
        paperNumber: 'Paper 1',
        group: 'Group I',
        name: 'Advanced Accounting',
        fullName: 'Advanced Accounting (Paper 1)',
        chapters: [
          'Introduction to Accounting Standards (Formulation, Ind AS/IFRS Convergence & Carve-Outs)',
          'Framework for Preparation and Presentation of Financial Statements',
          'Applicability of Accounting Standards to Various Entities',
          'Presentation & Disclosure Based AS (AS 1, AS 3, AS 17, AS 18, AS 20, AS 24, AS 25)',
          'Asset Based Accounting Standards (AS 2, AS 10, AS 13, AS 16, AS 19, AS 26, AS 28)',
          'Liability & Provision Based Accounting Standards (AS 15, AS 29)',
          'Accounting Standards Impacting P&L (AS 4, AS 5, AS 7, AS 9, AS 11, AS 12, AS 22)',
          'Financial Statements of Companies (Schedule III Division I)',
          'Buy Back of Securities',
          'Amalgamation of Companies (AS 14)',
          'Accounting for Reconstruction of Companies (Internal Reconstruction)',
          'Accounting for Branches Including Foreign Branches',
          'Consolidated Financial Statements (AS 21, AS 23 & AS 27)'
        ],
        colorCode: '#00D2FF',
        textClass: 'text-[#00D2FF]',
        bgClass: 'bg-[#00D2FF]/10',
        borderClass: 'border-[#00D2FF]/20'
      },
      {
        code: 'CorpLaw',
        paper: 'P2',
        paperNumber: 'Paper 2',
        group: 'Group I',
        name: 'Corporate & Other Laws',
        fullName: 'Corporate and Other Laws (Paper 2)',
        chapters: [
          'Preliminary (The Companies Act, 2013)',
          'Incorporation of Company and Matters Incidental Thereto',
          'Prospectus and Allotment of Securities',
          'Share Capital and Debentures',
          'Acceptance of Deposits by Companies',
          'Registration of Charges',
          'Management and Administration',
          'Declaration and Payment of Dividend',
          'Accounts of Companies',
          'Audit and Auditors',
          'Companies Incorporated Outside India',
          'The Limited Liability Partnership Act, 2008',
          'The General Clauses Act, 1897',
          'Interpretation of Statutes',
          'The Foreign Exchange Management Act, 1999'
        ],
        colorCode: '#9D4EDD',
        textClass: 'text-[#9D4EDD]',
        bgClass: 'bg-[#9D4EDD]/10',
        borderClass: 'border-[#9D4EDD]/20'
      },
      {
        code: 'Tax',
        paper: 'P3',
        paperNumber: 'Paper 3',
        group: 'Group I',
        name: 'Taxation (DT & GST)',
        fullName: 'Taxation (Income-Tax Law & GST - Paper 3)',
        chapters: [
          'Basic Concepts (Income-Tax Law, Person, Assessee, PY/AY, Agricultural Income & Basis of Charge)',
          'Residential Status and Scope of Total Income',
          'Heads of Income: Salaries',
          'Heads of Income: Income from House Property',
          'Heads of Income: Profits and Gains of Business or Profession (PGBP)',
          'Heads of Income: Capital Gains',
          'Heads of Income: Income from Other Sources',
          'Clubbing of Income, Set-Off and Carry Forward of Losses',
          'Deductions from Gross Total Income',
          'Advance Tax, Tax Deduction at Source (TDS) and Tax Collection at Source (TCS)',
          'Provisions for Filing Return of Income and Self-Assessment',
          'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
          'GST Laws: An Introduction including Constitutional Aspects',
          'Levy and Collection of CGST and IGST (Supply, Composite/Mixed, RCM, Exemptions & Composition)',
          'Basic Concepts: Classification, Place of Supply, Time of Supply & Value of Supply',
          'Input Tax Credit (ITC) & Computation of GST Liability',
          'Registration under GST',
          'Tax Invoice, Credit and Debit Notes, and Electronic Way Bill',
          'Accounts and Records under GST',
          'Returns and Payment of Tax under GST'
        ],
        colorCode: '#FF9F1C',
        textClass: 'text-[#FF9F1C]',
        bgClass: 'bg-[#FF9F1C]/10',
        borderClass: 'border-[#FF9F1C]/20'
      },
      {
        code: 'Cost',
        paper: 'P4',
        paperNumber: 'Paper 4',
        group: 'Group II',
        name: 'Cost & Mgmt Accounting',
        fullName: 'Cost and Management Accounting (Paper 4)',
        chapters: [
          'Introduction to Cost and Management Accounting (Objectives, Cost Behaviour & Digital Costing)',
          'Elements of Cost and Preparation of Cost Sheets (Manufacturing & Service Sectors)',
          'Material Cost (Procurement, GeM/ERP Digital Costing, EOQ, Inventory Control & Losses)',
          'Employee Cost (Attendance/Payroll, Turnover & Halsey/Rowan Incentive Schemes)',
          'Direct Expenses (Identification & Accounting Treatment)',
          'Overheads (Absorption Costing, Primary/Secondary Distribution, Admin, S&D & R&D Cost)',
          'Concepts of Activity Based Costing (ABC)',
          'Integration of Cost and Financial Data (Non-Integrated/Integrated Systems & Reconciliation)',
          'Single Output/Unit Costing, Job Costing and Batch Costing',
          'Process and Operation Costing (Equivalent Units, Joint Products & By-Products)',
          'Costing of Service Sectors',
          'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
          'Marginal Costing (CVP Analysis, BEP, Margin of Safety & Short-Term Decisions)',
          'Budget and Budgetary Control (Flexible, Functional, Cash/Master, ZBB & Performance Budgets)'
        ],
        colorCode: '#FF3366',
        textClass: 'text-[#FF3366]',
        bgClass: 'bg-[#FF3366]/10',
        borderClass: 'border-[#FF3366]/20'
      },
      {
        code: 'AuditInter',
        paper: 'P5',
        paperNumber: 'Paper 5',
        group: 'Group II',
        name: 'Auditing and Ethics',
        fullName: 'Auditing and Ethics (Paper 5)',
        chapters: [
          'Nature, Objective and Scope of Audit (SA 200)',
          'Audit Strategy, Audit Planning and Audit Program (SA 300)',
          'Risk Assessment and Internal Control (SA 315, SA 320, SA 330 & Digital Audit)',
          'Audit Evidence (SA 500, 501, 505, 510, 520, 530, 550, 610 & Internal Financial Control)',
          'Audit of Items of Financial Statements',
          'Audit Documentation (SA 230)',
          'Completion and Review (SA 450, SA 560, SA 570, SA 580, SA 260 & SA 265)',
          'Audit Report (SA 700, SA 701, SA 705, SA 706, SA 710, Branch/Joint Audit & CARO 2020)',
          'Special Features of Audit of Different Type of Entities',
          'Audit of Banks',
          'Ethics and Terms of Audit Engagements (Professional Ethics, SA 210, SQC 1 & SA 220)'
        ],
        colorCode: '#10B981',
        textClass: 'text-[#10B981]',
        bgClass: 'bg-[#10B981]/10',
        borderClass: 'border-[#10B981]/20'
      },
      {
        code: 'FMSM',
        paper: 'P6',
        paperNumber: 'Paper 6',
        group: 'Group II',
        name: 'Financial Mgmt & SM',
        fullName: 'Financial Management and Strategic Management (Paper 6)',
        chapters: [
          'Financial Management Function & Financial Analysis through Ratios',
          'Sources of Finance (Long-Term, Short-Term, Contemporary P2P/Crowdfunding, Lease & VC)',
          'Cost of Capital (Kd, Kp, Ke, WACC & Marginal Cost of Capital)',
          'Capital Structure Decisions (Theories, EBIT-EPS Analysis & Over/Under Capitalisation)',
          'Leverages (Operating, Financial and Combined Leverages)',
          'Capital Investment Decisions (Payback, ARR, NPV, IRR, MIRR, PI, Capital Rationing & EAC)',
          'Dividend Decisions (Cash/Bonus/Split/Buyback, Walter, Gordon & MM Models)',
          'Management of Working Capital (Operating Cycle, Debtors/Factoring, Cash/Treasury & Payables)',
          'Introduction to Strategic Management (Strategic Intent & Network/Corporate/Business/Functional Levels)',
          'Strategic Analysis: External Environment (PESTLE, Value Chain, PLC & Porter’s Five Forces)',
          'Strategic Analysis: Internal Environment (Mendelow’s Model, Strategic Drivers, SWOT & Porter’s Generic Strategies)',
          'Strategic Choices (Concentric/Conglomerate, Integration, Turnaround & Ansoff/ADL/BCG/GE Matrices)',
          'Strategy Implementation and Evaluation (Formulation-Implementation Matrix, Digital Transformation, Structure/Culture, Leadership & Control)'
        ],
        colorCode: '#FFD166',
        textClass: 'text-[#FFD166]',
        bgClass: 'bg-[#FFD166]/10',
        borderClass: 'border-[#FFD166]/20'
      }
    ]
  },
  foundation: {
    id: 'foundation',
    courseStream: 'CA',
    baseStage: 'foundation',
    name: 'CA Foundation (New Scheme)',
    shortName: 'CA Foundation',
    badge: '4 Papers (P1–P4)',
    paperStructureSummary: '4 Papers (Papers 1–4)',
    description: 'Entry-level CA mastery across 4 core papers: Accounting, Business Laws, Quantitative Aptitude, and Business Economics.',
    hasGroups: false,
    subjects: [
      {
        code: 'Accounts',
        paper: 'P1',
        paperNumber: 'Paper 1',
        group: 'Unified',
        name: 'Accounting',
        fullName: 'Accounting (Paper 1)',
        chapters: [
          'Theoretical Framework & Accounting Standards',
          'Accounting Process (Journals, Ledgers, Trial Balance)',
          'Bank Reconciliation Statement (BRS)',
          'Inventories Valuation',
          'Depreciation and Amortisation',
          'Bills of Exchange and Promissory Notes',
          'Preparation of Final Accounts of Sole Proprietors',
          'Financial Statements of Not-for-Profit Organisations (NPO)',
          'Accounts from Incomplete Records (Single Entry)',
          'Partnership Accounts (Admission, Retirement, Death, Dissolution)',
          'Company Accounts (Issue of Shares, Debentures, Forfeiture)'
        ],
        colorCode: '#00D2FF',
        textClass: 'text-[#00D2FF]',
        bgClass: 'bg-[#00D2FF]/10',
        borderClass: 'border-[#00D2FF]/20'
      },
      {
        code: 'Law',
        paper: 'P2',
        paperNumber: 'Paper 2',
        group: 'Unified',
        name: 'Business Laws',
        fullName: 'Business Laws (Paper 2)',
        chapters: [
          'The Indian Regulatory Framework',
          'The Indian Contract Act 1872: Nature and Offer-Acceptance',
          'The Indian Contract Act 1872: Consideration & Capacity',
          'The Indian Contract Act 1872: Free Consent & Void Agreements',
          'The Indian Contract Act 1872: Performance & Breach',
          'The Sale of Goods Act 1930: Formation & Conditions-Warranties',
          'The Sale of Goods Act 1930: Transfer of Ownership & Unpaid Seller',
          'The Indian Partnership Act 1932',
          'The Limited Liability Partnership Act 2008',
          'The Companies Act 2013 (Basics & Incorporation)',
          'The Negotiable Instruments Act 1881'
        ],
        colorCode: '#9D4EDD',
        textClass: 'text-[#9D4EDD]',
        bgClass: 'bg-[#9D4EDD]/10',
        borderClass: 'border-[#9D4EDD]/20'
      },
      {
        code: 'MathStats',
        paper: 'P3',
        paperNumber: 'Paper 3',
        group: 'Unified',
        name: 'Quantitative Aptitude',
        fullName: 'Quantitative Aptitude - Math, LR & Stats (Paper 3)',
        chapters: [
          'Ratio, Proportion, Indices and Logarithms',
          'Equations and Matrices',
          'Linear Inequalities',
          'Mathematics of Finance (Simple & Compound Interest, Annuities)',
          'Permutations and Combinations',
          'Sequence and Series (AP and GP)',
          'Sets, Relations and Functions',
          'Basic Calculus (Differential & Integral)',
          'Number Series, Coding and Decoding',
          'Direction Tests and Seating Arrangements',
          'Blood Relations and Syllogism',
          'Statistical Representation of Data',
          'Measures of Central Tendency and Dispersion',
          'Probability and Expected Value',
          'Theoretical Distributions (Binomial, Poisson, Normal)',
          'Correlation and Regression',
          'Index Numbers'
        ],
        colorCode: '#FF9F1C',
        textClass: 'text-[#FF9F1C]',
        bgClass: 'bg-[#FF9F1C]/10',
        borderClass: 'border-[#FF9F1C]/20'
      },
      {
        code: 'Econ',
        paper: 'P4',
        paperNumber: 'Paper 4',
        group: 'Unified',
        name: 'Business Economics',
        fullName: 'Business Economics (Paper 4)',
        chapters: [
          'Introduction to Business Economics',
          'Theory of Demand and Supply',
          'Theory of Consumer Behaviour',
          'Theory of Production and Cost',
          'Price Determination in Different Markets',
          'Determination of National Income',
          'Public Finance & Fiscal Policy',
          'Money Market & Monetary Policy',
          'International Trade & Balance of Payments',
          'Indian Economy: Pre & Post Liberalisation'
        ],
        colorCode: '#10B981',
        textClass: 'text-[#10B981]',
        bgClass: 'bg-[#10B981]/10',
        borderClass: 'border-[#10B981]/20'
      }
    ]
  },
  cma_foundation: {
    id: 'cma_foundation',
    courseStream: 'CMA',
    baseStage: 'foundation',
    name: 'CMA Foundation (ICMAI Syllabus 2022)',
    shortName: 'CMA Foundation',
    badge: '4 Papers (P1–P4)',
    paperStructureSummary: '4 Papers (Papers 1–4)',
    description: 'Entry-level ICMAI curriculum across 4 core papers: Business Laws & Communication, Financial & Cost Accounting, Business Maths & Stats, and Business Economics & Management.',
    hasGroups: false,
    subjects: [
      {
        code: 'CMAFoundLaw',
        paper: 'P1',
        paperNumber: 'Paper 1',
        group: 'Unified',
        name: 'Laws & Communication',
        fullName: 'Fundamentals of Business Laws and Business Communication (Paper 1)',
        chapters: [
          'Introduction to Legal System in India & Sources of Law',
          'Indian Contract Act, 1872',
          'Sale of Goods Act, 1930',
          'Negotiable Instruments Act, 1881',
          'Business Communication Principles, Channels & Digital Etiquette'
        ],
        colorCode: '#9D4EDD',
        textClass: 'text-[#9D4EDD]',
        bgClass: 'bg-[#9D4EDD]/10',
        borderClass: 'border-[#9D4EDD]/20'
      },
      {
        code: 'CMAFoundAcc',
        paper: 'P2',
        paperNumber: 'Paper 2',
        group: 'Unified',
        name: 'Financial & Cost Acc.',
        fullName: 'Fundamentals of Financial and Cost Accounting (Paper 2)',
        chapters: [
          'Accounting Fundamentals, Concepts, Conventions & Capital vs Revenue',
          'Accounting for Special Transactions (Bills of Exchange, Consignment, Joint Venture)',
          'Preparation of Final Accounts of Profit & Non-Profit Organisations',
          'Fundamentals of Cost Accounting, Cost Classification & Cost Sheets'
        ],
        colorCode: '#00D2FF',
        textClass: 'text-[#00D2FF]',
        bgClass: 'bg-[#00D2FF]/10',
        borderClass: 'border-[#00D2FF]/20'
      },
      {
        code: 'CMAFoundMath',
        paper: 'P3',
        paperNumber: 'Paper 3',
        group: 'Unified',
        name: 'Business Maths & Stats',
        fullName: 'Fundamentals of Business Mathematics and Statistics (Paper 3)',
        chapters: [
          'Arithmetic (Ratios, Variations, Simple & Compound Interest, Annuities)',
          'Algebra (Set Theory, Indices, Logarithms, Permutations, Combinations & Quadratic Equations)',
          'Calculus Applications in Business',
          'Statistical Representation of Data, Measures of Central Tendency & Dispersion',
          'Correlation, Regression, Probability & Index Numbers'
        ],
        colorCode: '#FF9F1C',
        textClass: 'text-[#FF9F1C]',
        bgClass: 'bg-[#FF9F1C]/10',
        borderClass: 'border-[#FF9F1C]/20'
      },
      {
        code: 'CMAFoundEcon',
        paper: 'P4',
        paperNumber: 'Paper 4',
        group: 'Unified',
        name: 'Economics & Mgmt',
        fullName: 'Fundamentals of Business Economics and Management (Paper 4)',
        chapters: [
          'Basic Concepts of Economics, Theory of Demand & Supply',
          'Theory of Production, Cost & Market Structures',
          'Money, Banking & Indian Financial Environment',
          'Evolution of Management Thought, Planning, Organising, Staffing & Leading',
          'Decision Making, Authority, Responsibility & Control Systems'
        ],
        colorCode: '#10B981',
        textClass: 'text-[#10B981]',
        bgClass: 'bg-[#10B981]/10',
        borderClass: 'border-[#10B981]/20'
      }
    ]
  },
  cma_intermediate: {
    id: 'cma_intermediate',
    courseStream: 'CMA',
    baseStage: 'intermediate',
    name: 'CMA Intermediate (ICMAI Syllabus 2022)',
    shortName: 'CMA Inter',
    badge: '4 + 4 Papers (Group I & II)',
    paperStructureSummary: '4 + 4 Papers (Group I: P5–P8 · Group II: P9–P12)',
    description: 'Official ICMAI Intermediate curriculum structured across 4 + 4 papers: Group I (Papers 5–8) & Group II (Papers 9–12).',
    hasGroups: true,
    subjects: [
      {
        code: 'CMAInterLaw',
        paper: 'P5',
        paperNumber: 'Paper 5',
        group: 'Group I',
        name: 'Business Laws & Ethics',
        fullName: 'Business Laws and Ethics (Paper 5)',
        chapters: [
          'Commercial Laws (Contract Act, Sale of Goods, Negotiable Instruments, Partnership & LLP)',
          'Industrial Laws (Factories Act, Gratuity, EPF, ESI, Code on Wages)',
          'Corporate Laws — Companies Act, 2013 (Incorporation, Capital, Directors & Meetings)',
          'Business Ethics, Emotional Intelligence & Moral Principles for Professionals'
        ],
        colorCode: '#9D4EDD',
        textClass: 'text-[#9D4EDD]',
        bgClass: 'bg-[#9D4EDD]/10',
        borderClass: 'border-[#9D4EDD]/20'
      },
      {
        code: 'CMAInterFA',
        paper: 'P6',
        paperNumber: 'Paper 6',
        group: 'Group I',
        name: 'Financial Accounting',
        fullName: 'Financial Accounting (Paper 6)',
        chapters: [
          'Accounting Fundamentals, Bills, Consignment, Joint Venture & Insurance Claims',
          'Preparation of Financial Statements (Commercial & Non-Profit Entities, Single Entry)',
          'Partnership Accounting (Admission, Retirement, Death, Dissolution & Amalgamation)',
          'Lease, Branch, Departmental Accounts & Accounting Standards (AS)'
        ],
        colorCode: '#00D2FF',
        textClass: 'text-[#00D2FF]',
        bgClass: 'bg-[#00D2FF]/10',
        borderClass: 'border-[#00D2FF]/20'
      },
      {
        code: 'CMAInterTax',
        paper: 'P7',
        paperNumber: 'Paper 7',
        group: 'Group I',
        name: 'Direct & Indirect Tax',
        fullName: 'Direct and Indirect Taxation (Paper 7)',
        chapters: [
          'Basics of Income Tax Act, Residential Status & Exempt Incomes',
          'Heads of Income (Salaries, House Property, PGBP, Capital Gains, Other Sources)',
          'Clubbing, Set-Off, Chapter VI-A Deductions, TDS/TCS & Return Filing',
          'GST Law: Supply, Levy, Exemptions, Time & Value of Supply, Input Tax Credit & Returns',
          'Customs Law: Basic Concepts, Types of Duties & Valuation under Customs Act'
        ],
        colorCode: '#FF9F1C',
        textClass: 'text-[#FF9F1C]',
        bgClass: 'bg-[#FF9F1C]/10',
        borderClass: 'border-[#FF9F1C]/20'
      },
      {
        code: 'CMAInterCost',
        paper: 'P8',
        paperNumber: 'Paper 8',
        group: 'Group I',
        name: 'Cost Accounting',
        fullName: 'Cost Accounting (Paper 8)',
        chapters: [
          'Introduction to Cost Accounting, Cost Ascertainment & Elements of Cost (Material, Employee, Direct Expenses)',
          'Overheads Absorption, Allocation, Apportionment & Cost Accounting Standards (CAS 1 to CAS 24)',
          'Cost Book Keeping, Reconciliation, Job, Batch, Contract, Process & Operating Costing',
          'Marginal Costing, Standard Costing &Variance Analysis, Budget and Budgetary Control'
        ],
        colorCode: '#FF3366',
        textClass: 'text-[#FF3366]',
        bgClass: 'bg-[#FF3366]/10',
        borderClass: 'border-[#FF3366]/20'
      },
      {
        code: 'CMAInterOMSM',
        paper: 'P9',
        paperNumber: 'Paper 9',
        group: 'Group II',
        name: 'Operations & Strat. Mgmt',
        fullName: 'Operations Management and Strategic Management (Paper 9)',
        chapters: [
          'Operations Management Introduction, Capacity Planning & Forecasting',
          'Designing Operational Systems, Production Planning & Control, Lean & JIT',
          'Productivity Management, Quality Management (TQM), Project Management (PERT/CPM) & Economics of Maintenance',
          'Strategic Management: Environmental Analysis, Strategic Formulation, Implementation & Digital Strategy'
        ],
        colorCode: '#38BDF8',
        textClass: 'text-[#38BDF8]',
        bgClass: 'bg-[#38BDF8]/10',
        borderClass: 'border-[#38BDF8]/20'
      },
      {
        code: 'CMAInterCAA',
        paper: 'P10',
        paperNumber: 'Paper 10',
        group: 'Group II',
        name: 'Corporate Acc. & Audit',
        fullName: 'Corporate Accounting and Auditing (Paper 10)',
        chapters: [
          'Accounting for Shares and Debentures (Issue, Forfeiture, Buyback, Redemption & Underwriting)',
          'Preparation of Schedule III Financial Statements, Cash Flow Statement & Banking/Insurance/Electricity Accounts',
          'Accounting Standards (Ind AS / AS Overview) & Corporate Restructuring Fundamentals',
          'Auditing Concepts, Audit Risk, Internal Control, Vouching & Verification',
          'Company Audit (Appointment, Rights, Duties, CARO, Cost Audit & Secretarial Audit)'
        ],
        colorCode: '#10B981',
        textClass: 'text-[#10B981]',
        bgClass: 'bg-[#10B981]/10',
        borderClass: 'border-[#10B981]/20'
      },
      {
        code: 'CMAInterFMDA',
        paper: 'P11',
        paperNumber: 'Paper 11',
        group: 'Group II',
        name: 'FM & Data Analytics',
        fullName: 'Financial Management and Business Data Analytics (Paper 11)',
        chapters: [
          'Fundamentals of Financial Management, Institutions & Ratio/Fund/Cash Flow Analysis',
          'Cost of Capital, Capital Structure Theories, Leverages & Dividend Decisions',
          'Capital Budgeting Decisions & Working Capital Management',
          'Introduction to Business Data Analytics, Data Science, Data Mining, Visualization & Cloud Analytics'
        ],
        colorCode: '#FFD166',
        textClass: 'text-[#FFD166]',
        bgClass: 'bg-[#FFD166]/10',
        borderClass: 'border-[#FFD166]/20'
      },
      {
        code: 'CMAInterMA',
        paper: 'P12',
        paperNumber: 'Paper 12',
        group: 'Group II',
        name: 'Management Accounting',
        fullName: 'Management Accounting (Paper 12)',
        chapters: [
          'Introduction to Management Accounting & Activity Based Costing (ABC)',
          'Decision Making Tools: Marginal Costing, CVP Analysis & Tactical Decisions',
          'Transfer Pricing, Standard Costing & Variance Investigation in Management Control',
          'Forecasting, Budgeting, Responsibility Accounting, Balanced Scorecard & Divisional Performance'
        ],
        colorCode: '#F472B6',
        textClass: 'text-[#F472B6]',
        bgClass: 'bg-[#F472B6]/10',
        borderClass: 'border-[#F472B6]/20'
      }
    ]
  },
  cma_final: {
    id: 'cma_final',
    courseStream: 'CMA',
    baseStage: 'final',
    name: 'CMA Final (ICMAI Syllabus 2022)',
    shortName: 'CMA Final',
    badge: '4 + 4 Papers (Group III & IV)',
    paperStructureSummary: '4 + 4 Papers (Group III: P13–P16 · Group IV: P17–P20)',
    description: 'Advanced ICMAI Final curriculum structured across 4 + 4 papers: Group III / Group I (Papers 13–16) & Group IV / Group II (Papers 17–20).',
    hasGroups: true,
    subjects: [
      {
        code: 'CMAFinalLaw',
        paper: 'P13',
        paperNumber: 'Paper 13',
        group: 'Group I',
        name: 'Corp. & Economic Laws',
        fullName: 'Corporate and Economic Laws (Paper 13)',
        chapters: [
          'Companies Act, 2013: Company Formation, Board of Directors, Meetings, Inspection, Inquiry & Investigation',
          'Compromises, Arrangements, Amalgamations, Prevention of Oppression & Mismanagement, Winding Up',
          'Insolvency and Bankruptcy Code (IBC), 2016 & Corporate Governance',
          'SEBI Laws & Regulations, Competition Act, FEMA 1999, PMLA 2002, Banking & Insurance Laws, MSME & Cyber Security Laws'
        ],
        colorCode: '#9D4EDD',
        textClass: 'text-[#9D4EDD]',
        bgClass: 'bg-[#9D4EDD]/10',
        borderClass: 'border-[#9D4EDD]/20'
      },
      {
        code: 'CMAFinalSFM',
        paper: 'P14',
        paperNumber: 'Paper 14',
        group: 'Group I',
        name: 'Strategic Financial Mgmt',
        fullName: 'Strategic Financial Management (Paper 14)',
        chapters: [
          'Investment Decisions, Project Planning, Risk Analysis in Capital Budgeting & Leasing',
          'Evaluation of Risky Proposals, Securitization, Equity & Bond Valuation',
          'Mutual Funds, Portfolio Management (CAPM, APT, Sharpe/Treynor/Jensen) & Behavioral Finance',
          'Financial Derivatives (Forwards, Futures, Options, Swaps) & International Financial Management / Forex Risk'
        ],
        colorCode: '#FF3366',
        textClass: 'text-[#FF3366]',
        bgClass: 'bg-[#FF3366]/10',
        borderClass: 'border-[#FF3366]/20'
      },
      {
        code: 'CMAFinalDT',
        paper: 'P15',
        paperNumber: 'Paper 15',
        group: 'Group I',
        name: 'Direct Tax & Intl. Tax',
        fullName: 'Direct Tax Laws and International Taxation (Paper 15)',
        chapters: [
          'Assessment of Various Entities (Companies, MAT/AMT, Trusts, Firms, LLPs, Business Restructuring)',
          'Tax Administration, Assessment Procedure, Search & Seizure, Appeals, Revision, Dispute Resolution & Penalties',
          'Tax Planning, Tax Evasion, Tax Management & GAAR',
          'International Taxation: Non-Resident Taxation, DTAA, Transfer Pricing, Advance Pricing Agreements & BEPS'
        ],
        colorCode: '#FF9F1C',
        textClass: 'text-[#FF9F1C]',
        bgClass: 'bg-[#FF9F1C]/10',
        borderClass: 'border-[#FF9F1C]/20'
      },
      {
        code: 'CMAFinalSCM',
        paper: 'P16',
        paperNumber: 'Paper 16',
        group: 'Group I',
        name: 'Strategic Cost Mgmt',
        fullName: 'Strategic Cost Management (Paper 16)',
        chapters: [
          'Introduction to Strategic Cost Management, Quality Cost Management, Value Chain & Life Cycle Costing',
          'Decision Making Techniques: Target Costing, Kaizen Costing, Throughput Accounting, Lean & Activity Based Management',
          'Variance Analysis, Transfer Pricing & Performance Evaluation under Strategic Costing',
          'Quantitative Techniques in Decision Making: Linear Programming, Assignment, Transportation, Game Theory, Simulation, Learning Curve & Network Analysis'
        ],
        colorCode: '#38BDF8',
        textClass: 'text-[#38BDF8]',
        bgClass: 'bg-[#38BDF8]/10',
        borderClass: 'border-[#38BDF8]/20'
      },
      {
        code: 'CMAFinalCMA',
        paper: 'P17',
        paperNumber: 'Paper 17',
        group: 'Group II',
        name: 'Cost & Mgmt Audit',
        fullName: 'Cost and Management Audit (Paper 17)',
        chapters: [
          'Basics of Cost Audit, Nature, Scope & Companies (Cost Records and Audit) Rules, 2014',
          'Cost Auditor Appointment, Eligibility, Rights, Duties & Cost Audit Report (CRA-1 to CRA-4) / XBRL Filing',
          'Cost Accounting Standards (CAS 1–24), GACAP & Professional Ethics for Cost Accountants',
          'Management Audit, Internal Control, Operational Audit, Audit of Service Organisations, Forensic Audit & Anti-Money Laundering'
        ],
        colorCode: '#F472B6',
        textClass: 'text-[#F472B6]',
        bgClass: 'bg-[#F472B6]/10',
        borderClass: 'border-[#F472B6]/20'
      },
      {
        code: 'CMAFinalCFR',
        paper: 'P18',
        paperNumber: 'Paper 18',
        group: 'Group II',
        name: 'Corp. Financial Reporting',
        fullName: 'Corporate Financial Reporting (Paper 18)',
        chapters: [
          'Specific Accounting Standards & Ind AS (Assets, Liabilities, Revenue Ind AS 115, Leases Ind AS 116, Financial Instruments Ind AS 109)',
          'Valuation of Shares, Accounting for Business Combinations (Ind AS 103) & Corporate Restructuring',
          'Consolidated and Separate Financial Statements (Ind AS 110, 111, 28)',
          'Recent Developments in Financial Reporting: 4P Bottom Line, Integrated Reporting, ESG, Value Added, Human Resource & Government Accounting (GASAB/IGAS)'
        ],
        colorCode: '#00D2FF',
        textClass: 'text-[#00D2FF]',
        bgClass: 'bg-[#00D2FF]/10',
        borderClass: 'border-[#00D2FF]/20'
      },
      {
        code: 'CMAFinalIDT',
        paper: 'P19',
        paperNumber: 'Paper 19',
        group: 'Group II',
        name: 'Indirect Tax Laws & Prac.',
        fullName: 'Indirect Tax Laws and Practice (Paper 19)',
        chapters: [
          'Advanced GST: Supply, Place of Supply, Valuation, Input Tax Credit, Job Work, E-Way Bills & Returns',
          'GST Refunds, Zero-Rated Supplies, Assessment, Audit, Inspection, Search, Seizure, Demand, Recovery, Appeals & Advance Ruling',
          'Customs Act, 1962: Levy, Classification, Valuation Rules, Warehousing, Duty Drawback, Baggage, Adjudication & Appeals',
          'Foreign Trade Policy (FTP): Export Promotion Schemes (Advance Authorisation, EPCG, RoDTEP, SEZ & EOU)'
        ],
        colorCode: '#10B981',
        textClass: 'text-[#10B981]',
        bgClass: 'bg-[#10B981]/10',
        borderClass: 'border-[#10B981]/20'
      },
      {
        code: 'CMAFinalSPBV',
        paper: 'P20',
        paperNumber: 'Paper 20',
        group: 'Group II',
        name: 'SPM & Business Valuation',
        fullName: 'Strategic Performance Management and Business Valuation (Paper 20)',
        chapters: [
          'Conceptual Framework of Performance Management, Economic Value Added (EVA), Balanced Scorecard & Benchmarking',
          'Economic Efficiency of the Firm, Supply Chain Performance, Customer Profitability & Enterprise Risk Management (ERM) / Corporate Failure Prediction (Altman Z-Score, NCAER)',
          'Business Valuation Fundamentals, Valuation Models (Asset-Based, Earnings-Based, DCF, Relative Valuation)',
          'Valuation of Intangibles, Brands, Human Resources, Valuation in Mergers & Acquisitions, Slump Sale & Distressed Companies'
        ],
        colorCode: '#FFD166',
        textClass: 'text-[#FFD166]',
        bgClass: 'bg-[#FFD166]/10',
        borderClass: 'border-[#FFD166]/20'
      }
    ]
  }
};

export const LEVEL_STORAGE_KEY = 'practca_selected_ca_level';

export const ALL_CA_LEVELS: CALevel[] = [
  'foundation',
  'intermediate',
  'final',
  'cma_foundation',
  'cma_intermediate',
  'cma_final',
];

export function isValidCALevelValue(val: unknown): val is CALevel {
  return (
    val === 'foundation' ||
    val === 'intermediate' ||
    val === 'final' ||
    val === 'cma_foundation' ||
    val === 'cma_intermediate' ||
    val === 'cma_final'
  );
}

export function isFoundationLevel(level: CALevel = getSelectedCALevel()): boolean {
  return level === 'foundation' || level === 'cma_foundation';
}

export function isIntermediateLevel(level: CALevel = getSelectedCALevel()): boolean {
  return level === 'intermediate' || level === 'cma_intermediate';
}

export function isFinalLevel(level: CALevel = getSelectedCALevel()): boolean {
  return level === 'final' || level === 'cma_final';
}

export function getCourseFromCALevel(level: CALevel = getSelectedCALevel()): CourseStream {
  return level.startsWith('cma_') ? 'CMA' : 'CA';
}

export function getBaseStageFromCALevel(level: CALevel = getSelectedCALevel()): BaseLevelStage {
  if (level === 'foundation' || level === 'cma_foundation') return 'foundation';
  if (level === 'intermediate' || level === 'cma_intermediate') return 'intermediate';
  return 'final';
}

export function resolveCALevel(course: CourseStream, stage: BaseLevelStage): CALevel {
  if (course === 'CMA') {
    if (stage === 'foundation') return 'cma_foundation';
    if (stage === 'intermediate') return 'cma_intermediate';
    return 'cma_final';
  }
  return stage;
}

export function getSelectedCALevel(): CALevel {
  try {
    const saved = localStorage.getItem(LEVEL_STORAGE_KEY);
    if (isValidCALevelValue(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'final';
}

export const getActiveCALevel = getSelectedCALevel;

export function setSelectedCALevel(level: CALevel): void {
  try {
    localStorage.setItem(LEVEL_STORAGE_KEY, level);
    window.dispatchEvent(new CustomEvent('practca_level_changed', { detail: { level } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
}

export function getLevelForSubject(subjectId: string | undefined | null): CALevel {
  if (!subjectId) return getSelectedCALevel();
  for (const lvl of ALL_CA_LEVELS) {
    if (CA_CURRICULUM_LEVELS[lvl].subjects.some((s) => s.code === subjectId)) {
      return lvl;
    }
  }
  return 'final';
}

export const getSubjectLevel = getLevelForSubject;

export function getLevelConfig(level: CALevel = getSelectedCALevel()) {
  const base = CA_CURRICULUM_LEVELS[level] || CA_CURRICULUM_LEVELS.final;
  return {
    ...base,
    subjects: base.subjects.map((s) => ({
      ...s,
      id: s.code,
      paperCode: s.paperNumber,
    })),
  };
}

export function getLevelSubjects(level: CALevel = getSelectedCALevel()) {
  return getLevelConfig(level).subjects;
}

export function getLevelSubjectIds(level: CALevel = getSelectedCALevel()): SubjectId[] {
  const base = CA_CURRICULUM_LEVELS[level] || CA_CURRICULUM_LEVELS.final;
  return base.subjects.map((s) => s.code);
}

export function getDefaultSubjectForLevel(level: CALevel = getSelectedCALevel()): SubjectId {
  if (level === 'foundation') return 'Accounts';
  if (level === 'intermediate') return 'AdvAcc';
  if (level === 'cma_foundation') return 'CMAFoundLaw';
  if (level === 'cma_intermediate') return 'CMAInterLaw';
  if (level === 'cma_final') return 'CMAFinalLaw';
  return 'FR';
}

export function useCALevel(): CALevel {
  const [level, setLevel] = useState<CALevel>(() => getSelectedCALevel());

  useEffect(() => {
    const sync = (e?: any) => {
      if (e?.detail?.level) {
        setLevel(e.detail.level);
      } else {
        setLevel(getSelectedCALevel());
      }
    };
    window.addEventListener('practca_level_changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('practca_level_changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return level;
}


