/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChapterSummary,
  FormulaItem,
  IntermediateSubjectId,
  LimitRateItem,
  StatutorySection,
  SubjectInfo,
} from '../types';

export interface ProspectusPdfRef {
  label: string;
  url: string;
  marks: string;
  pages: string;
}

export const INTERMEDIATE_PROSPECTUS_PDFS: Record<IntermediateSubjectId, ProspectusPdfRef[]> = {
  AdvAcc: [
    {
      label: 'Paper 1: Advanced Accounting Syllabus',
      url: '/assets/aistudio/advacc_0927dcf5.pdf',
      marks: '100 Marks',
      pages: 'ICAI Prospectus Page 34',
    },
  ],
  CorpLaw: [
    {
      label: 'Paper 2: Corporate & Other Laws (Part I: 70M | Part II: 30M)',
      url: '/assets/aistudio/corplaw_2a6face8.pdf',
      marks: '100 Marks',
      pages: 'ICAI Prospectus Page 35',
    },
  ],
  Tax: [
    {
      label: 'Section A: Income-Tax Law Syllabus',
      url: '/assets/aistudio/Incometax_99b46ec2.pdf',
      marks: '50 Marks',
      pages: 'ICAI Prospectus Page 36',
    },
    {
      label: 'Section B: Goods and Services Tax (GST) Syllabus',
      url: '/assets/aistudio/GST_8a57a08d.pdf',
      marks: '50 Marks',
      pages: 'ICAI Prospectus Page 37',
    },
  ],
  Cost: [
    {
      label: 'Paper 4: Cost and Management Accounting Syllabus',
      url: '/assets/aistudio/cost_58cbc151.pdf',
      marks: '100 Marks',
      pages: 'ICAI Prospectus Pages 38–40',
    },
  ],
  AuditInter: [
    {
      label: 'Paper 5: Auditing and Ethics Syllabus',
      url: '/assets/aistudio/Auditinter_f44e4a16.pdf',
      marks: '100 Marks',
      pages: 'ICAI Prospectus Pages 41–43',
    },
  ],
  FMSM: [
    {
      label: 'Section A: Financial Management Syllabus',
      url: '/assets/aistudio/FM_a0703799.pdf',
      marks: '50 Marks',
      pages: 'ICAI Prospectus Pages 44–45',
    },
    {
      label: 'Section B: Strategic Management Syllabus',
      url: '/assets/aistudio/SM_4ee4b6f6.pdf',
      marks: '50 Marks',
      pages: 'ICAI Prospectus Page 46',
    },
  ],
};

export const INTERMEDIATE_SUBJECTS_METADATA: Record<IntermediateSubjectId, SubjectInfo> = {
  AdvAcc: {
    id: 'AdvAcc',
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
      'Consolidated Financial Statements (AS 21, AS 23 & AS 27)',
    ],
    hasSections: true,
    hasLimits: true,
    hasFormulas: true,
    hasStandards: false,
    group: 'Group I',
    paperNumber: 'Paper 1',
    level: 'intermediate',
  },
  CorpLaw: {
    id: 'CorpLaw',
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
      'The Foreign Exchange Management Act, 1999',
    ],
    hasSections: true,
    hasLimits: true,
    hasFormulas: false,
    hasStandards: false,
    group: 'Group I',
    paperNumber: 'Paper 2',
    level: 'intermediate',
  },
  Tax: {
    id: 'Tax',
    name: 'Taxation (DT & GST)',
    fullName: 'Taxation — Income-Tax Law & GST (Paper 3)',
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
      'Returns and Payment of Tax under GST',
    ],
    hasSections: true,
    hasLimits: true,
    hasFormulas: true,
    hasStandards: false,
    group: 'Group I',
    paperNumber: 'Paper 3',
    level: 'intermediate',
  },
  Cost: {
    id: 'Cost',
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
      'Budget and Budgetary Control (Flexible, Functional, Cash/Master, ZBB & Performance Budgets)',
    ],
    hasSections: false,
    hasLimits: false,
    hasFormulas: true,
    hasStandards: false,
    group: 'Group II',
    paperNumber: 'Paper 4',
    level: 'intermediate',
  },
  AuditInter: {
    id: 'AuditInter',
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
      'Ethics and Terms of Audit Engagements (Professional Ethics, SA 210, SQC 1 & SA 220)',
    ],
    hasSections: true,
    hasLimits: true,
    hasFormulas: false,
    hasStandards: true,
    group: 'Group II',
    paperNumber: 'Paper 5',
    level: 'intermediate',
  },
  FMSM: {
    id: 'FMSM',
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
      'Strategy Implementation and Evaluation (Formulation-Implementation Matrix, Digital Transformation, Structure/Culture, Leadership & Control)',
    ],
    hasSections: false,
    hasLimits: false,
    hasFormulas: true,
    hasStandards: false,
    group: 'Group II',
    paperNumber: 'Paper 6',
    level: 'intermediate',
  },
};

export const INTERMEDIATE_CHAPTER_SUMMARIES: Record<IntermediateSubjectId, ChapterSummary[]> = {
  // =========================================================================
  // PAPER 1: ADVANCED ACCOUNTING (100 MARKS)
  // =========================================================================
  AdvAcc: [
    {
      chapterName: 'Introduction to Accounting Standards (Formulation, Ind AS/IFRS Convergence & Carve-Outs)',
      keyPrinciples: [
        {
          title: 'AS Formulation Process, Convergence vs Adoption & Ind AS Carve-Outs',
          description: 'Accounting Standards Board (ASB) of ICAI formulates draft Accounting Standards through study groups, exposure drafts, and Council approval, notified for companies by MCA in consultation with NFRA u/s 133 of Companies Act, 2013. India chose CONVERGENCE (Ind AS) rather than verbatim adoption of IFRS to accommodate Indian economic and legal realities.',
          exception: 'Carve-outs modify specific IFRS treatments (resulting in differences from IFRS), whereas Carve-ins add guidance not present in IFRS (e.g., common control business combinations in Ind AS 103).',
          example: 'Ind AS 101 permits carrying previous GAAP PPE book values as deemed cost on transition date.'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'Convergence vs Adoption & Statutory Notification Mechanism',
        headers: ['Dimension', 'Accounting Standards (AS 1–29)', 'Ind AS (IFRS-Converged)'],
        rows: [
          ['Formulating Body', 'ASB of ICAI → NFRA Consultation → Central Govt (MCA) u/s 133', 'ASB of ICAI → NFRA → MCA Notification under Companies (Ind AS) Rules, 2015'],
          ['Core Approach', 'Historical Cost & Prudence-driven Indian GAAP', 'Fair Value, Substance over Form & Time Value of Money'],
          ['Deviations from IFRS', 'Not directly aligned to latest IFRS', 'Contains targeted Carve-Outs & Carve-Ins for Indian legal context']
        ]
      }
    },
    {
      chapterName: 'Framework for Preparation and Presentation of Financial Statements',
      keyPrinciples: [
        {
          title: 'Fundamental Accounting Assumptions, Qualitative Characteristics & Capital Maintenance',
          description: 'Three Fundamental Accounting Assumptions (Going Concern, Consistency, Accrual) are presumed present without disclosure unless breached. Four primary Qualitative Characteristics are Understandability, Relevance, Reliability, and Comparability. Elements of FS comprise Assets, Liabilities, Equity (Financial Position) and Income, Expenses (Performance).',
          exception: 'If Going Concern is NOT valid, financial statements must be prepared on a Liquidation / Net Realisable Value basis with explicit fact & basis disclosure.',
          example: 'Financial Capital Maintenance measures profit in nominal/purchasing power money units; Physical Capital Maintenance requires exceeding physical operating capacity.'
        }
      ]
    },
    {
      chapterName: 'Applicability of Accounting Standards to Various Entities',
      keyPrinciples: [
        {
          title: 'Corporate (SMC vs Non-SMC) & Non-Corporate (Level I, II, III, IV) Classification',
          description: 'Under Companies (Accounting Standards) Rules, 2021, a Small and Medium-Sized Company (SMC) is an unlisted, non-bank/FI/insurance company with Turnover <= ₹250 Cr AND Borrowings <= ₹50 Cr in immediately preceding FY (and not holding/subsidiary of Non-SMC). Non-corporate entities (ICAI criteria effective 1.4.2024) are classified into Level I (>₹250 Cr T/O or >₹50 Cr borrowings), Level II (>₹50–250 Cr T/O or >₹10–50 Cr borrowings), Level III (>₹10–50 Cr T/O or >₹2–10 Cr borrowings), and Level IV (others).',
          exception: 'Two-year continuity rule: An existing SMC or Lower-Level Non-Corporate entity loses exemptions immediately upon crossing thresholds, but a Non-SMC / Higher-Level entity can step down ONLY after satisfying lower criteria for TWO consecutive accounting periods.',
          example: 'SMCs are fully exempt from AS 3 (if OPC/Small/Dormant) and AS 17 (Segment Reporting), and enjoy partial relaxations in AS 15, AS 19, AS 20, AS 28, and AS 29.'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'ICAI Non-Corporate Entities & Corporate SMC Threshold Matrix',
        headers: ['Entity Category', 'Turnover Criterion (Preceding FY)', 'Borrowings Criterion', 'AS Applicability Scope'],
        rows: [
          ['Non-SMC / Level I Non-Corporate', '> ₹250 Crore (or Listed / Bank / FI / Insurance)', '> ₹50 Crore', 'All 27 Accounting Standards apply in full'],
          ['SMC (Corporate Rules, 2021)', '<= ₹250 Crore (Excl. Other Income)', '<= ₹50 Crore', 'Exempt from AS 17; Partial relaxations in AS 15, 19, 20, 28, 29'],
          ['Level II Non-Corporate', '> ₹50 Crore up to ₹250 Crore', '> ₹10 Crore up to ₹50 Crore', 'Exempt from AS 3, 17, 20, 21, 23, 25, 27; Partial relaxations in 15, 19, 28, 29'],
          ['Level III Non-Corporate', '> ₹10 Crore up to ₹50 Crore', '> ₹2 Crore up to ₹10 Crore', 'Addl exemptions: AS 18 & AS 24 exempt; Disclosure relaxations in AS 10, 11, 19, 29'],
          ['Level IV Micro Non-Corporate', '<= ₹10 Crore', '<= ₹2 Crore', 'Addl exemptions: AS 13, 14, 22 (DTA/DTL), 26 (part), 28 exempt']
        ]
      }
    },
    {
      chapterName: 'Presentation & Disclosure Based AS (AS 1, AS 3, AS 17, AS 18, AS 20, AS 24, AS 25)',
      keyPrinciples: [
        {
          title: 'AS 1 Policies, AS 3 Cash Flows, AS 17 Segments & AS 18 Related Parties',
          description: 'AS 1 mandates disclosing all significant accounting policies in one place; Prudence, Substance over Form, and Materiality govern policy selection. AS 3 classifies cash flows into Operating, Investing, and Financing; for non-financial entities, Interest/Dividend Paid is Financing and Interest/Dividend Received is Investing. AS 17 defines a Reportable Segment where Revenue, Result, or Assets >= 10% of combined totals (and external reportable revenue must reach >= 75% of enterprise revenue). AS 18 covers Control (>50% voting, Board control, or control of composition) and Significant Influence (>=20% voting power).',
          exception: 'Under AS 18, remuneration paid to Key Management Personnel (KMP) is a mandatory Related Party transaction disclosure; however, state-controlled enterprises need not disclose transactions with other state-controlled enterprises.',
          example: 'AS 20 Basic EPS = Net Profit attributable to Equity Shareholders / Weighted Average Equity Shares; Bonus issue is adjusted retrospectively from earliest reported period, while Rights Issue uses TERP bonus-element factor.'
        },
        {
          title: 'AS 24 Discontinuing Operations & AS 25 Interim Financial Reporting',
          description: 'AS 24 triggers on the earlier of binding sale agreement OR Board approval + formal announcement of detailed discontinuance plan of a major business/geographical component. AS 25 applies a discrete-with-integral tax approach: interim income tax expense is accrued using the estimated Weighted Average Annual Effective Income Tax Rate applied to interim pre-tax earnings.',
          exception: 'Under AS 25, inventory write-downs to NRV in Q1 can be reversed in Q3 up to original cost if NRV recovers within the SAME financial year.',
          example: 'Under AS 20, anti-dilutive potential equity shares (where incremental EPS exceeds Basic EPS from continuing operations) are strictly ignored in Diluted EPS.'
        }
      ]
    },
    {
      chapterName: 'Asset Based Accounting Standards (AS 2, AS 10, AS 13, AS 16, AS 19, AS 26, AS 28)',
      keyPrinciples: [
        {
          title: 'AS 2 Inventories, AS 10 PPE, AS 13 Investments & AS 16 Borrowing Costs',
          description: 'AS 2 values finished goods at Lower of Cost (FIFO or Weighted Average) and NRV; raw materials are written down to replacement cost ONLY if finished goods are expected to sell below cost. AS 10 capitalises initial purchase, non-refundable taxes, site prep, installation, and PV of decommissioning obligation; subsequent revaluation surplus goes to Revaluation Reserve. AS 13 carries Current Investments at lower of Cost & Fair Value (individual/category basis) and Long-Term Investments at Cost (written down only for non-temporary decline). AS 16 capitalises borrowing costs on Qualifying Assets (substantial period, ordinarily >=12 months).',
          exception: 'Under AS 16, specific borrowing temporary investment income is deducted from capitalisable borrowing cost; general borrowing uses Weighted Average Capitalisation Rate capped at actual borrowing cost incurred.',
          example: 'Under AS 10, if an item of PPE is revalued, the ENTIRE class of PPE to which that asset belongs must be revalued.'
        },
        {
          title: 'AS 19 Leases, AS 26 Intangible Assets & AS 28 Impairment of Assets',
          description: 'AS 19 classifies a lease as Finance Lease if it transfers substantially all risks and rewards; lessee records asset & liability at Lower of Fair Value or PV of Minimum Lease Payments (discounted at implicit rate, else incremental borrowing rate). AS 26 mandates charging all Research phase costs to P&L and capitalising Development phase costs only after technical/commercial feasibility criteria are met (presumed useful life <= 10 years for amortisation). AS 28 recognises Impairment Loss when Carrying Amount exceeds Recoverable Amount [Higher of Net Selling Price and Value in Use].',
          exception: 'Under AS 26, internally generated Goodwill, brands, mastheads, publishing titles, and customer lists can NEVER be recognised as intangible assets.',
          example: 'Under AS 28, Goodwill impairment loss in a Cash Generating Unit (CGU) is allocated first to Goodwill and then pro-rata to other CGU assets (never reducing any asset below Higher of NSP, VIU, or Zero).'
        }
      ]
    },
    {
      chapterName: 'Liability & Provision Based Accounting Standards (AS 15, AS 29)',
      keyPrinciples: [
        {
          title: 'AS 15 Employee Benefits & AS 29 Provisions, Contingent Liabilities and Contingent Assets',
          description: 'AS 15 categorises benefits into Short-Term (undiscounted), Post-Employment (Defined Contribution vs Defined Benefit using Projected Unit Credit Method), Other Long-Term, and Termination Benefits. Actuarial gains/losses under AS 15 are recognised immediately in Profit & Loss (never deferred). AS 29 recognises a Provision only when: (1) Present obligation from past event, (2) Probable (>50%) outflow of resources, and (3) Reliable estimate (without discounting, except decommissioning under AS 10).',
          exception: 'Under AS 29, Provisions are NOT discounted to Present Value (except asset retirement obligations), and Contingent Assets are NEVER recognised or disclosed in Financial Statements (disclosed only in Board’s Report if inflow is probable; recognised as asset only when realisation is virtually certain).',
          example: 'Restructuring provision under AS 29 requires a binding sale agreement or formal detailed plan + valid expectation raised before Balance Sheet date.'
        }
      ]
    },
    {
      chapterName: 'Accounting Standards Impacting P&L (AS 4, AS 5, AS 7, AS 9, AS 11, AS 12, AS 22)',
      keyPrinciples: [
        {
          title: 'AS 4 Events After BS Date, AS 5 Prior Period/Policy Change, AS 7 Construction & AS 9 Revenue',
          description: 'AS 4 adjusts assets/liabilities for events occurring between Balance Sheet date and Board approval date that provide evidence of conditions existing at BS date (plus Going Concern destruction); proposed dividends are disclosed in Notes (not adjusted). AS 5 requires separate disclosure of Exceptional Items, Extraordinary Items, Prior Period Items, and Changes in Accounting Policies. AS 7 recognises contract revenue/costs by Percentage of Completion Method, but expected total contract loss must be provided 100% immediately. AS 9 recognises revenue when risks/rewards transfer and no significant uncertainty exists regarding consideration or collection.',
          exception: 'Under AS 9, if uncertainty of collection arises AT THE TIME of sale, postpone revenue recognition; if uncertainty arises SUBSEQUENT to sale, do not reverse revenue—create a bad debt provision.',
          example: 'Under AS 7, Stage of Completion = Cost incurred to date / (Cost incurred to date + Estimated further cost to complete).'
        },
        {
          title: 'AS 11 Foreign Exchange, AS 12 Government Grants & AS 22 Taxes on Income',
          description: 'AS 11 translates Foreign Currency Monetary Items at closing rate (exchange difference to P&L, or Para 46/46A option for long-term monetary items). Integral Foreign Operations translate monetary items at closing rate and non-monetary at historical/valuation date rate (diff to P&L); Non-Integral Foreign Operations translate all Assets & Liabilities at closing rate and Income/Expenses at transaction rate (diff to Foreign Currency Translation Reserve - FCTR). AS 12 accounts for Depreciable Asset Grants via Asset Deduction or Deferred Income; Refund of grant reverses Deferred Income or increases Asset Carrying Amount. AS 22 recognises Deferred Tax on Timing Differences using enacted/substantively enacted tax rates.',
          exception: 'Under AS 22, Deferred Tax Asset (DTA) on unabsorbed depreciation or carry-forward losses can be recognised ONLY when supported by Virtual Certainty with convincing evidence.',
          example: 'Under AS 12, Promoter’s Contribution grants are credited directly to Capital Reserve (Shareholders’ Funds).'
        }
      ]
    },
    {
      chapterName: 'Financial Statements of Companies (Schedule III Division I)',
      keyPrinciples: [
        {
          title: 'Schedule III Division I Balance Sheet, Statement of P&L & Current/Non-Current Classification',
          description: 'Schedule III Division I (applicable to AS-compliant companies) mandates vertical format for Balance Sheet (Equity & Liabilities vs Assets) and Statement of Profit & Loss. An asset/liability is classified as Current if settled within the company’s normal Operating Cycle (default 12 months if indeterminate) or within 12 months from reporting date. Managerial Remuneration ceilings are governed by Section 197 (overall 11% of Net Profits computed u/s 198) read with Schedule V.',
          exception: 'Deferred Tax Assets (Net) and Deferred Tax Liabilities (Net) are ALWAYS classified as Non-Current on the face of Schedule III Balance Sheet.',
          example: 'Trade Receivables ageing schedule splits billed/unbilled undisputed and disputed dues across <6 months, 6m–1yr, 1–2 yrs, 2–3 yrs, and >3 yrs.'
        }
      ]
    },
    {
      chapterName: 'Buy Back of Securities',
      keyPrinciples: [
        {
          title: 'Section 68 Three-Test Maximum Buy-Back Ceiling & Section 69 CRR Transfer',
          description: 'Under Sec 68, maximum permissible Equity Buy-Back is the LOWEST of: (1) Shares Outstanding Test (25% of total paid-up equity shares in FY), (2) Resources Test (25% of Paid-up Capital + Free Reserves incl. Securities Premium), and (3) Debt-Equity Ratio Test (Post-buy-back Secured + Unsecured Debt <= 2 × Paid-up Capital + Free Reserves). Under Sec 69, where buy-back is funded out of Free Reserves or Securities Premium, a sum equal to the NOMINAL VALUE of shares bought back must be transferred to Capital Redemption Reserve (CRR).',
          exception: 'Board Resolution alone suffices if buy-back <= 10% of Paid-up Equity Capital + Free Reserves; >10% up to 25% requires Special Resolution in General Meeting.',
          example: 'Under Debt-Equity Test, each share bought back at Buy-Back Price (BBP) with Nominal Value (NV) funded from Free Reserves reduces Post-Buy-Back Equity + Free Reserves by (BBP + NV).'
        }
      ]
    },
    {
      chapterName: 'Amalgamation of Companies (AS 14)',
      keyPrinciples: [
        {
          title: 'AS 14 Merger (Pooling of Interests) vs Purchase Method & Purchase Consideration',
          description: 'Amalgamation in the nature of Merger requires satisfying ALL 5 conditions (all Assets & Liabilities taken over, >=90% equity shareholders continue, consideration discharged wholly in equity shares except cash for fractions, business intended to be carried on, book values retained) and uses Pooling of Interests (difference adjusted in Reserves). Failing any condition triggers Purchase Method (difference between Purchase Consideration and Net Assets at agreed values is Goodwill or Capital Reserve; Goodwill amortised over <=5 years).',
          exception: 'Purchase Consideration (PC) under AS 14 includes ONLY cash and securities issued to Equity and Preference Shareholders of Transferor Co. Payments to debentureholders, creditors, or liquidation expenses are NEVER included in PC.',
          example: 'Under Purchase Method, statutory reserves of Transferor Co are maintained via Dr Amalgamation Adjustment Reserve A/c / Cr Statutory Reserve A/c.'
        }
      ]
    },
    {
      chapterName: 'Accounting for Reconstruction of Companies (Internal Reconstruction)',
      keyPrinciples: [
        {
          title: 'Capital Reduction Account, Subdivision/Consolidation & Surrender of Shares',
          description: 'Internal Reconstruction reorganises a company’s capital structure u/s 61 (Alteration of Share Capital) and Sec 66 (Reduction of Share Capital with NCLT confirmation) without liquidating the company. Sacrifices by shareholders, debentureholders, and creditors, plus upward revaluation of assets, are credited to Capital Reduction (Reconstruction) Account. Accumulated P&L losses, preliminary expenses, goodwill, and asset write-downs are debited to Capital Reduction Account.',
          exception: 'Surrender of shares creates NO accounting entry at the moment of surrender; entry is passed only when surrendered shares are re-issued to creditors (transferring nominal value from Capital Reduction A/c to Share Capital) or cancelled.',
          example: 'Any net credit balance remaining in Capital Reduction Account after writing off all losses and overvalued assets is transferred mandatorily to Capital Reserve.'
        }
      ]
    },
    {
      chapterName: 'Accounting for Branches Including Foreign Branches',
      keyPrinciples: [
        {
          title: 'Dependent (Debtors, Stock & Debtors, Wholesale) vs Independent & Foreign Branches',
          description: 'Dependent branches are accounted via Debtors Method, Stock & Debtors Method (Branch Stock at Invoice Price, Branch Adjustment A/c isolating loading, Branch P&L A/c), or Wholesale Branch Method (HO creates Stock Reserve on unsold branch closing stock at Wholesale Price minus Cost). Independent branches maintain full trial balance reconciled via Goods-in-Transit, Cash-in-Transit, and Head Office Account. Foreign branches are classified under AS 11 into Integral Foreign Operations (IFO) and Non-Integral Foreign Operations (NFO).',
          exception: 'In Stock & Debtors Method, Normal Loss of stock at Invoice Price is debited in full to Branch Adjustment A/c (to eliminate both cost & loading from Branch Stock), whereas Abnormal Loss loading goes to Branch Adjustment A/c and cost goes to Branch P&L A/c.',
          example: 'Under AS 11, an Integral Foreign Branch translates Depreciation at the exchange rate of the historical acquisition date of the fixed asset.'
        }
      ]
    },
    {
      chapterName: 'Consolidated Financial Statements (AS 21, AS 23 & AS 27)',
      keyPrinciples: [
        {
          title: 'AS 21 Single Subsidiary Consolidation, AS 23 Associates (Equity Method) & AS 27 Joint Ventures',
          description: 'Under AS 21, a Parent consolidates its Subsidiary (>50% voting power or control over Board composition) line-by-line. Subsidiary reserves/profits are time-apportioned into Pre-Acquisition Profits (capital profits — Parent’s share reduces Cost of Control / Goodwill, rest to Minority Interest) and Post-Acquisition Profits (revenue profits — Parent’s share to Consolidated P&L, rest to Minority Interest). AS 23 applies Equity Method for Associates (>=20% voting power / significant influence). AS 27 applies Proportionate Consolidation in CFS for Jointly Controlled Entities.',
          exception: 'If Subsidiary declares bonus shares out of Pre-Acquisition Profits, there is NO effect on Cost of Control (Goodwill/Capital Reserve); if bonus shares are issued out of Post-Acquisition Profits, Parent’s share of Post-Acquisition Revenue Profits decreases and Capital Profits increase (reducing Goodwill / increasing Capital Reserve).',
          example: 'Unrealised profit on intra-group inventory or fixed asset transfers is eliminated in full in AS 21.'
        }
      ]
    },
  ],

  // =========================================================================
  // PAPER 2: CORPORATE AND OTHER LAWS (100 MARKS)
  // =========================================================================
  CorpLaw: [
    {
      chapterName: 'Preliminary (The Companies Act, 2013)',
      keyPrinciples: [
        {
          title: 'Key Statutory Definitions (Sec 2): Private, Public, Small, OPC, Holding/Subsidiary, Associate & Government Co',
          description: 'Sec 2(68) Private Co: restricts share transfer, limits members to 200 (joint holders = 1; present/past employees excluded), prohibits public invitation. Sec 2(85) Small Company: Private Co with Paid-up Capital <= ₹4 Crore AND Turnover <= ₹40 Crore (excludes holding/subsidiary, Sec 8, or special Act co). Sec 2(87) Subsidiary: >50% of total voting power OR control of Board composition (max 2 layers u/s 186/Rules). Sec 2(6) Associate: Significant influence (>=20% total voting power). Sec 2(45) Government Co: >=51% paid-up share capital (or voting power if DVR issued) held by CG/SG.',
          exception: 'A Private Company that is a subsidiary of a Public Company is DEEMED to be a Public Company under the proviso to Sec 2(71), even where its Articles retain private company restrictions.',
          example: 'Under Sec 2(41), Financial Year uniformly ends on 31st March (first FY ends on 31st March of following year if incorporated on or after 1st January).'
        }
      ]
    },
    {
      chapterName: 'Incorporation of Company and Matters Incidental Thereto',
      keyPrinciples: [
        {
          title: 'OPC (Sec 3), Section 8 Charitable Co, MOA/AOA Alteration (Sec 13/14) & Turquand Rule',
          description: 'An OPC can be formed only by a natural person who is an Indian Citizen (whether resident in India for >=120 days or non-resident) and no person can incorporate or be nominee in more than 1 OPC. Section 8 companies promote commerce, art, science, sports, education, charity without paying dividend to members (Central Govt license; can be firm-member; 14 clear days AGM notice). Doctrine of Ultra Vires makes acts beyond MOA void ab initio; Doctrine of Constructive Notice presumes outsiders read MOA/AOA; Doctrine of Indoor Management (Turquand Rule) protects bona fide outsiders against internal procedural irregularities.',
          exception: 'Turquand Rule does NOT protect an outsider who has actual/constructive knowledge of irregularity, acts negligently despite suspicious circumstances, or relies on a FORGED document (Ruben v. Great Fingall Consolidated).',
          example: 'Shifting Registered Office from one State to another u/s 13(4) requires Special Resolution + Regional Director (CG) approval within 60 days.'
        }
      ]
    },
    {
      chapterName: 'Prospectus and Allotment of Securities',
      keyPrinciples: [
        {
          title: 'Shelf Prospectus (Sec 31), Red Herring (Sec 32), Allotment (Sec 39) & Private Placement (Sec 42)',
          description: 'Prospectus is valid for 90 days from filing with ROC (Sec 26). Shelf Prospectus (Sec 31) has 1-year validity with Information Memorandum (PAS-2) filed prior to 2nd/subsequent offers. Red Herring Prospectus (Sec 32) omits price or quantum and must be filed at least 3 days before opening of subscription list. Under Sec 39, Minimum Subscription must be received within 30 days of issue (else refund within 15 days; 15% p.a. interest on delay), and minimum application money must be >= 5% of nominal value (25% of issue price under SEBI ICDR). Private Placement u/s 42 caps offers at 200 persons in aggregate in a FY (excluding QIBs and ESOPs).',
          exception: 'Under Sec 42, a company CANNOT make a fresh private placement offer unless allotments under any previous offer have been completed or withdrawn, and allotment must be made within 60 days of receiving application money (else refund within 15 days + 12% p.a. interest from 61st day).',
          example: 'Underwriting commission u/s 40(6) Rule 13 cannot exceed 5% of issue price for Shares or 2.5% for Debentures, and requires explicit authorisation in Articles.'
        }
      ]
    },
    {
      chapterName: 'Share Capital and Debentures',
      keyPrinciples: [
        {
          title: 'DVR Shares (Rule 4), Sweat Equity (Sec 54), Preference Redemption (Sec 55), Rights/Bonus (Sec 62/63) & Debentures (Sec 71)',
          description: 'Equity with Differential Voting Rights (DVR) capped at <=74% of total voting power. Issue at Discount (Sec 53) is void except Sweat Equity (Sec 54, locked-in for 3 years, capped at 15% of paid-up equity or ₹5 Cr p.a., max 25% of paid-up equity overall; 50% for Startups up to 10 yrs). Preference Shares (Sec 55) must be redeemed within 20 years (30 years for infrastructure projects with >=10% annual redemption from 21st year). Rights Issue (Sec 62) gives 15 to 30 days notice. Bonus Shares (Sec 63) are issued out of Free Reserves, Securities Premium, or CRR (never Revaluation Reserve or in lieu of dividend).',
          exception: 'Under Sec 71(4) Rule 18, Debenture Redemption Reserve (DRR) @ 10% of outstanding debentures is required ONLY for Unlisted non-NBFC/non-HFC companies; Listed companies, All-India FIs, Banks, and NBFCs/HFCs are exempt from DRR (though 15% Debenture Redemption Investment by 30th April applies to public issues and unlisted cos).',
          example: 'Share transfer instrument SH-4 u/s 56 must be delivered within 60 days of execution; share certificates issued within 2 months of incorporation/allotment and 1 month of transfer.'
        }
      ]
    },
    {
      chapterName: 'Acceptance of Deposits by Companies',
      keyPrinciples: [
        {
          title: 'Sec 73 Members’ Deposits, Sec 76 Eligible Public Company Deposits & Rule 2(1)(c) Exclusions',
          description: 'Deposit tenure ranges from 6 months to 36 months (short-term up to 10% of PUC + FR + SP allowed for >=3 months). Private Co / Non-Eligible Public Co can accept deposits from Members up to 35% of (PUC + FR + SP) [100% for Private Co IFSC/Startup up to 10 yrs or private co meeting 3 conditions]. Eligible Public Company (Net Worth >= ₹100 Cr OR Turnover >= ₹500 Cr) can accept deposits from Members up to 10% and Public up to 25% of (PUC + FR + SP). Mandatory 20% Deposit Repayment Reserve (DRR) in scheduled bank by 30th April of deposits maturing during the FY.',
          exception: 'Excluded from "Deposit" under Rule 2(1)(c): loan from director/relative of director of private co (with written declaration of non-borrowed funds), employee security deposit (non-interest bearing <= annual salary), and customer business advance appropriated within 365 days.',
          example: 'Return of Deposits in Form DPT-3 must be filed annually with ROC on or before 30th June regarding figures as of 31st March.'
        }
      ]
    },
    {
      chapterName: 'Registration of Charges',
      keyPrinciples: [
        {
          title: 'Sec 77–87 Registration Timelines (CHG-1 / CHG-9), Modification & Satisfaction (CHG-4)',
          description: 'Every company creating or modifying a charge (in India or outside) must register it with ROC in Form CHG-1 (CHG-9 for debentures) within 30 days of creation. For charges created on or after 02.11.2018, ROC may permit registration within 60 days (30 + 30) on payment of additional fees, and within a further 60 days (total 120 days from creation) on payment of ad-valorem fees. Satisfaction of charge must be intimated in Form CHG-4 within 30 days of payment/satisfaction (extendable by ROC up to 300 days on additional fee).',
          exception: 'If a charge is not registered within the maximum 120-day window, the charge is VOID against the liquidator and any other creditor, though the underlying contract/obligation to repay the money remains valid as an unsecured debt.',
          example: 'Upon receiving intimation of satisfaction, ROC sends a show-cause notice to the charge-holder (max 14 days) unless CHG-4 is signed by the charge-holder himself.'
        }
      ]
    },
    {
      chapterName: 'Management and Administration',
      keyPrinciples: [
        {
          title: 'Annual Return (Sec 92), AGM/EGM (Sec 96/100), Notice (Sec 101), Quorum (Sec 103) & Voting (Sec 105–114)',
          description: 'Annual Return (MGT-7 / MGT-7A for OPC & Small Co) filed within 60 days of AGM. First AGM held within 9 months from close of 1st FY (no ROC extension possible); subsequent AGMs within 6 months of FY close and <=15 months gap (ROC can extend by up to 3 months). EGM u/s 100 can be requisitioned by members holding >=1/10th of paid-up voting capital (Board must call within 21 days for a date within 45 days of requisition, else requisitionists hold within 3 months). Notice u/s 101 requires 21 clear days (shorter notice requires >=95% voting consent for AGM; majority in number + >=95% paid-up voting power for other GMs).',
          exception: 'Quorum u/s 103 (personally present): Private Co = 2; Public Co = 5 (<=1,000 members), 15 (1,001–5,000), 30 (>5,000). If quorum is absent within 30 minutes, a requisitioned EGM stands CANCELLED, whereas other GMs adjourn to same day next week.',
          example: 'Electronic voting u/s 108 is mandatory for listed companies and companies having >= 1,000 members. Special Resolution u/s 114(2) requires votes cast in favour >= 3 times votes cast against.'
        }
      ]
    },
    {
      chapterName: 'Declaration and Payment of Dividend',
      keyPrinciples: [
        {
          title: 'Sec 123 Dividend Sources, Rule 3 Reserve Withdrawal & Sec 124–127 Unpaid/IEPF Timelines',
          description: 'Dividend is declared out of current FY profit (after depreciation as per Schedule II and setting off carried-forward losses/depreciation) or accumulated Free Reserves. Under Rule 3 (inadequacy/absence of profit): (1) Rate <= average of 3 preceding years; (2) Withdrawal <= 10% of (Paid-up Capital + Free Reserves); (3) First set off current year loss; (4) Residual reserve balance >= 15% of Paid-up Capital. Dividend must be deposited in separate bank account within 5 days of declaration and paid within 30 days. Unpaid dividend transfers to Unpaid Dividend Account within 7 days of expiry of 30 days (Day 37).',
          exception: 'Under Sec 127, failure to pay dividend within 30 days attracts 18% p.a. interest for the company and imprisonment up to 2 years + fine >= ₹1,000/day for every director in default (exempt in 5 statutory cases: operation of law, shareholder directions unable to be complied with, dispute on right, lawful adjustment against call arrears, or non-default of company).',
          example: 'Money remaining unpaid in Unpaid Dividend Account for 7 years (along with underlying shares where dividend is unclaimed for 7 consecutive years) transfers to Investor Education and Protection Fund (IEPF) u/s 124(5)/(6).'
        }
      ]
    },
    {
      chapterName: 'Accounts of Companies',
      keyPrinciples: [
        {
          title: 'Books of Account (Sec 128), NFRA (Sec 132), CSR (Sec 135), Filing (Sec 137) & Internal Audit (Sec 138)',
          description: 'Books of account u/s 128 must be preserved for minimum 8 financial years and audit-trail (edit log) enabled accounting software is mandatory. CSR u/s 135 triggers if in immediately preceding FY: Net Worth >= ₹500 Cr OR Turnover >= ₹1,000 Cr OR Net Profit >= ₹5 Cr -> mandatory spend >= 2% of average Net Profits of 3 immediately preceding FYs. Unspent CSR on non-ongoing projects transfers to Schedule VII Fund within 6 months of FY end; unspent CSR on ongoing projects transfers within 30 days of FY end to Unspent CSR Account (to be spent within 3 FYs). Financial Statements (AOC-4) filed with ROC within 30 days of AGM.',
          exception: 'Internal Audit u/s 138 applies to: (1) Every Listed Co; (2) Unlisted Public Co with PUC >= ₹50 Cr, OR Turnover >= ₹200 Cr, OR Borrowings >= ₹100 Cr, OR Deposits >= ₹25 Cr; (3) Private Co with Turnover >= ₹200 Cr OR Borrowings >= ₹100 Cr.',
          example: 'CSR Committee is NOT required where the amount to be spent by a company u/s 135(5) does not exceed ₹50 Lakhs (Board discharges committee functions).'
        }
      ]
    },
    {
      chapterName: 'Audit and Auditors',
      keyPrinciples: [
        {
          title: 'Appointment (Sec 139), Removal (Sec 140), Disqualifications (Sec 141), Fraud Reporting (Sec 143(12)) & Cost Audit (Sec 148)',
          description: 'First Auditor: Non-Govt Co = Board within 30 days, else Members in 90 days; Govt Co = C&AG within 60 days, else Board in 30 days, else Members in 60 days. Subsequent Govt Auditor appointed by C&AG within 180 days from start of FY. Auditor Rotation u/s 139(2) (1 term of 5 yrs for Individual; 2 terms of 5 yrs for Firm; 5-yr cooling period) applies to Listed Cos, Unlisted Public Cos (PUC >= ₹10 Cr), Private Cos (PUC >= ₹50 Cr), and any Co with Public Borrowings/Deposits >= ₹50 Cr. Sec 141(3)(d) disqualifies if Auditor/Partner holds any security, or Relative holds security > ₹1,00,000 face value, or is indebted > ₹5,00,000, or gives guarantee > ₹1,00,000.',
          exception: 'Under Sec 143(12) Rule 13, if fraud involving >= ₹1 Crore is detected against the company by officers/employees, auditor reports to Board/Audit Committee within 2 days, waits 45 days for reply, and forwards report in Form ADT-4 to Central Government (MCA) within 15 days. If fraud < ₹1 Crore, report only to Board/Audit Committee and disclose in Board’s Report.',
          example: 'Auditor ceiling u/s 141(3)(g) is 20 company audits per partner (excluding OPC, Dormant Cos, Small Cos, and Private Cos with Paid-up Capital < ₹100 Crore).'
        }
      ]
    },
    {
      chapterName: 'Companies Incorporated Outside India',
      keyPrinciples: [
        {
          title: 'Foreign Company Definition (Sec 2(42) & Sec 379), FC-1 Registration (Sec 380) & Accounts (Sec 381)',
          description: 'Under Sec 2(42), a Foreign Company means any company/body corporate incorporated outside India which has a place of business in India (whether physically or through electronic mode) AND conducts any business activity in India. Under Sec 379(2), where >=50% of paid-up share capital of a foreign company is held by Indian citizens and/or Indian companies, it must comply with Chapter XXII as if it were incorporated in India. Form FC-1 must be delivered to ROC New Delhi within 30 days of establishing a place of business in India.',
          exception: 'Under Sec 381 Rule 4, a Foreign Company must prepare financial statements of its Indian business operations, have them audited by a practicing CA in India, and file Form FC-3 (along with list of all places of business in India) within 6 months of close of FY (ROC may extend by up to 3 months).',
          example: 'Annual Return of a Foreign Company in Form FC-4 must be filed within 60 days from the last day of its financial year.'
        }
      ]
    },
    {
      chapterName: 'The Limited Liability Partnership Act, 2008',
      keyPrinciples: [
        {
          title: 'Separate Legal Entity, Designated Partners (Sec 7), Small LLP (Sec 2(1)(ta)) & Annual Filings (Sec 34/35)',
          description: 'An LLP is a body corporate with perpetual succession where partners are agents of the LLP ONLY and NOT of other partners (Sec 26). Minimum 2 Partners and 2 Designated Partners (individuals, at least 1 Resident in India staying >=120 days during FY). Small LLP u/s 2(1)(ta): Contribution <= ₹25 Lakhs (extendable to ₹5 Cr) AND Turnover <= ₹40 Lakhs (extendable to ₹50 Cr) in immediately preceding FY. Unlimited Liability u/s 30 triggers if business is carried on with intent to defraud creditors.',
          exception: 'In an LLP, Audit of accounts is mandatory ONLY if Turnover exceeds ₹40 Lakhs OR Partner Contribution exceeds ₹25 Lakhs in any financial year.',
          example: 'LLP Annual Return (Form 11) is filed within 60 days of FY closure (by 30th May); Statement of Account & Solvency (Form 8) is filed within 30 days from end of 6 months of FY (by 30th October).'
        }
      ]
    },
    {
      chapterName: 'The General Clauses Act, 1897',
      keyPrinciples: [
        {
          title: 'Key Definitions (Sec 3), Coming into Operation (Sec 5), Repeal Effect (Sec 6), Time/Distance (Sec 9–11) & Service by Post (Sec 27)',
          description: 'Sec 3(22) Good Faith: anything done honestly, whether done negligently or not. Sec 3(26) Immovable Property: includes land, benefits arising out of land, and things attached to the earth (excludes standing timber, growing crops, grass). Sec 5: Central Act comes into operation on the day it receives Presidential Assent if no date is specified. Sec 6: Repeal does not revive dead enactments or extinguish accrued rights/liabilities unless a different intention appears. Sec 9: "From" excludes the first day; "To" includes the last day. Sec 10: If court/office is closed on the last prescribed day, act is valid on the next day it opens. Sec 11: Distance is measured in a straight horizontal line (as the crow flies).',
          exception: 'Under Sec 26 (Provision as to offences punishable under two or more enactments), an offender may be prosecuted under either or any enactment, but shall NOT be punished twice for the same offence.',
          example: 'Sec 27 Meaning of Service by Post: Where a document is sent by properly addressing, pre-paying, and posting by registered post, service is presumed effected at the time registration delivery would occur in the ordinary course of post.'
        }
      ]
    },
    {
      chapterName: 'Interpretation of Statutes',
      keyPrinciples: [
        {
          title: 'Primary Rules (Literal, Mischief/Heydon’s, Golden, Harmonious, Beneficial) & Secondary Rules (Ejusdem Generis, Noscitur a Sociis)',
          description: 'Primary Rules: (1) Literal/Grammatical Rule: plain natural meaning if unambiguous; (2) Reasonable/Golden Rule (ut res magis valeat quam pereat): modify absurd meaning to give effect; (3) Heydon’s Rule / Mischief Rule: examine 4 things (common law before Act, mischief not provided for, remedy appointed, true reason of remedy) to suppress mischief and advance remedy; (4) Harmonious Construction: reconcile conflicting provisions so neither is reduced to a dead letter. Secondary Rules: Ejusdem Generis (general words like "etc." following specific class take colour from that specific genus); Noscitur a Sociis (meaning of doubtful word ascertained from associated words); Contemporanea Expositio (interpret ancient statutes as understood when enacted).',
          exception: 'Ejusdem Generis DOES NOT apply if the preceding specific words do not form a distinct common genus/category, or if the specific words exhaust the whole genus.',
          example: 'Internal Aids include Preamble, Heading, Marginal Notes, Proviso, Explanation (clarifies, does not expand/restrict ambit), Schedules, and Definitions; External Aids include Parliamentary History, Dictionaries, Foreign Decisions, and Earlier/Later Acts.'
        }
      ]
    },
    {
      chapterName: 'The Foreign Exchange Management Act, 1999',
      keyPrinciples: [
        {
          title: 'Residential Status (Sec 2(v)), Current Account Transactions (Sec 5 & Rules) & Capital Account Transactions (Sec 6)',
          description: 'Under FEMA Sec 2(v), a Person Resident in India (PRI) requires residing in India for >182 days during the PRECEDING financial year, subject to 3 outbound purpose exceptions (leaving for employment, business/vocation, or uncertain stay intention -> becomes PROI immediately on departure) and 3 inbound purpose exceptions (coming for employment, business, or uncertain stay -> becomes PRI immediately on arrival). Current Account Transactions (Sec 5) are generally PERMITTED unless prohibited (Schedule I: lottery winnings, racing, prohibited magazines, commission on equity/JV exports, Rupee State Credit route >10% commission, callback services), requiring CG prior approval (Schedule II), or exceeding LRS USD 2,50,000 limit requiring RBI approval (Schedule III).',
          exception: 'Capital Account Transactions (Sec 6 — altering assets/liabilities including contingent liabilities outside India of a PRI, or in India of a PROI) are prohibited on 5 specified activities for PROIs: Chit Fund, Nidhi Company, Agricultural/Plantation activities, Real Estate business (except townships/roads/bridges), and Trading in Transferable Development Rights (TDRs).',
          example: 'Liberalised Remittance Scheme (LRS) allows resident individuals (including minors) to freely remit up to USD 2,50,000 per Financial Year for permissible current/capital account transactions (medical/education abroad allowed beyond USD 2,50,000 based on institution estimates without RBI approval).'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'FEMA 1999 Current Account Transactions (Sec 5) — Three-Schedule Control Architecture',
        headers: ['Schedule under FEM (CAT) Rules, 2000', 'Approval Authority', 'Key Covered Transactions & Thresholds'],
        rows: [
          ['Schedule I (Prohibited)', 'Strictly Banned (No Approval)', 'Lottery/sweepstakes winnings, racing/riding hobbies, banned magazines, commission on exports towards Indian overseas JV/WOS equity, callback services'],
          ['Schedule II (Prior CG Approval)', 'Relevant Ministry of Central Govt', 'Cultural tours (HRD), Advertisement in foreign print media by State Govt/PSU > USD 10,000, Freight of vessel chartered by PSU (Shipping Ministry), Multi-modal transport, Prize money/sponsorship abroad > USD 1,00,000'],
          ['Schedule III (Prior RBI Approval)', 'Reserve Bank of India (Beyond LRS)', 'Resident Individuals: Consolidated LRS limit of USD 2,50,000 per FY (private visits, gift/donation, emigration, maintenance, business travel, medical, studies). Non-Individuals: Donations >1% of forex earnings (3 yrs) or USD 5M; Consultancy > USD 10M (infra) / USD 1M (others); Pre-incorporation remittance >5% of investment or USD 1,00,000']
        ]
      }
    },
  ],

  // =========================================================================
  // PAPER 3: TAXATION (SECTION A: INCOME TAX 50M + SECTION B: GST 50M)
  // =========================================================================
  Tax: [
    {
      chapterName: 'Basic Concepts (Income-Tax Law, Person, Assessee, PY/AY, Agricultural Income & Basis of Charge)',
      keyPrinciples: [
        {
          title: 'Person u/s 2(31), Previous Year Exceptions, Agricultural Income (Sec 10(1) & Rule 7/7A/7B/8) & Surcharge/Marginal Relief',
          description: 'Sec 4 levies income-tax at rates of the Annual Finance Act on Total Income of the Previous Year in the Assessment Year. Five exceptions where PY income is taxed in the SAME PY: Shipping business of NR (Sec 172 — 7.5% of freight), Persons leaving India (Sec 174), AOP/BOI/AJP formed for particular event (Sec 174A), Transfer of property to avoid tax (Sec 175), and Discontinued business (Sec 176 — discretionary). Partial Integration of Agricultural Income applies to Individuals/HUF/AOP/BOI/AJP if Net Agricultural Income > ₹5,000 AND Non-Agricultural Income exceeds basic exemption limit (₹3L under 115BAC; ₹2.5L/₹3L/₹5L under Old Regime).',
          exception: 'Agro-business split rules: Tea (Rule 8) = 60% Agri / 40% Business; Rubber (Rule 7A) = 65% Agri / 35% Business; Coffee grown & cured (Rule 7B(1)) = 75% Agri / 25% Business; Coffee grown, cured, roasted & grounded (Rule 7B(1A)) = 60% Agri / 40% Business.',
          example: 'Under Default Regime Sec 115BAC(1A), maximum Surcharge rate is capped at 25% (even if Total Income > ₹5 Crore), whereas Old Regime levies 37% surcharge above ₹5 Crore on non-dividend/non-111A/112/112A income.'
        }
      ]
    },
    {
      chapterName: 'Residential Status and Scope of Total Income',
      keyPrinciples: [
        {
          title: 'Sec 6 Residential Status (Individual, HUF, Firm, Company) & Sec 5/9 Scope of Total Income',
          description: 'Individual Basic Conditions u/s 6(1): (a) >=182 days in PY, OR (b) >=60 days in PY AND >=365 days in 4 preceding PYs. Condition (b) is ignored (182 days required) for Indian citizen leaving India for employment/crew of Indian ship, or Indian citizen/PIO visiting India (120 days + 365 days applies if Indian-source income > ₹15 Lakhs, resulting in RNOR). Additional Conditions u/s 6(6) for ROR: Resident in >=2 out of 10 preceding PYs AND stay >=730 days in 7 preceding PYs. HUF/Firm is Resident unless control & management is situated WHOLLY outside India.',
          exception: 'Sec 6(1A) Deemed Resident: An Indian citizen having Total Income (other than foreign sources) > ₹15 Lakhs who is not liable to tax in any other country by reason of domicile/residence is deemed Resident but Not Ordinarily Resident (RNOR) regardless of zero days stay in India.',
          example: 'Foreign business income controlled from India is taxable for ROR and RNOR, but NOT taxable for a Non-Resident (Sec 5).'
        }
      ]
    },
    {
      chapterName: 'Heads of Income: Salaries',
      keyPrinciples: [
        {
          title: 'Allowances (HRA Sec 10(13A)), Retirement Benefits (Gratuity, Pension, Leave Encashment) & Perquisites (Sec 17(2))',
          description: 'Gratuity u/s 10(10): Govt = 100% exempt; Non-Govt covered by Gratuity Act = least of ₹20L, Actual, or (15/26 × Last Basic+DA × Completed yrs/part >6m); Not covered = least of ₹20L, Actual, or (1/2 × 10m Avg Salary × Completed yrs). Commuted Pension u/s 10(10A): Govt = 100% exempt; Non-Govt = 1/3rd of full commuted value exempt if gratuity received, 1/2 if no gratuity. Leave Encashment on retirement u/s 10(10AA): Govt = 100% exempt; Non-Govt ceiling enhanced to ₹25,00,000. Rent-Free Accommodation (Rule 3(1) revised): 10% of salary (>40L population), 7.5% (>15L–40L), 5% (<=15L).',
          exception: 'Under Default Regime Sec 115BAC(1A), Standard Deduction u/s 16(ia) is ₹75,000 (₹50,000 under Old Regime), while HRA, LTA, Entertainment Allowance, and Professional Tax u/s 16(iii) are NOT allowed (Transport allowance for disabled @ ₹3,200/m and Official Tour/Conveyance allowances remain exempt).',
          example: 'Employer contribution to RPF > 12% of salary is taxable; combined employer contribution to RPF + NPS + Superannuation > ₹7,50,000 is taxable as perquisite u/s 17(2)(vii).'
        }
      ]
    },
    {
      chapterName: 'Heads of Income: Income from House Property',
      keyPrinciples: [
        {
          title: 'GAV Determination (Sec 23), Municipal Taxes, Standard Deduction (30% of NAV) & Interest u/s 24(b)',
          description: 'Expected Rent = Higher of Municipal Value or Fair Rent, restricted to Standard Rent. GAV = Higher of Expected Rent or Actual Rent Received/Receivable (unless actual rent is lower solely due to Vacancy). Municipal Taxes paid by owner during PY are deducted from GAV to arrive at NAV. Sec 24(a) grants flat 30% Standard Deduction on NAV; Sec 24(b) deducts interest on borrowed capital (including 1/5th of pre-construction period interest for 5 years). Up to 2 Self-Occupied Properties (SOP) have Nil NAV.',
          exception: 'Under Default Regime Sec 115BAC(1A), Interest u/s 24(b) on Self-Occupied Property is NOT deductible (Nil loss), whereas for Let-Out Property interest u/s 24(b) is allowed without any ₹2,00,000 ceiling (though any resulting House Property loss cannot be set off against other heads under 115BAC).',
          example: 'Unrealised rent recovered or arrears of rent received u/s 25A are taxed in the year of receipt after a flat 30% deduction, even if the assessee no longer owns the property.'
        }
      ]
    },
    {
      chapterName: 'Heads of Income: Profits and Gains of Business or Profession (PGBP)',
      keyPrinciples: [
        {
          title: 'Depreciation (Sec 32), Scientific Research (Sec 35), Disallowances (Sec 40/40A/43B) & Presumptive Taxation (44AD/44ADA/44AE)',
          description: 'Depreciation u/s 32 is computed on WDV of Block of Assets (50% rate if acquired and put to use <180 days in PY). Additional Depreciation @ 20% (10% if <180 days, balance 10% next year) applies to new P&M for manufacturing/power under Old Regime ONLY (disallowed under 115BAC). Sec 40(a)(ia) disallows 30% of resident payments where TDS was not deducted or not deposited by Sec 139(1) due date. Sec 40A(3) disallows 100% of cash payment > ₹10,000/day/person (₹35,000 for goods transport). Sec 43B(h) mandates actual payment within 15 days (no written agreement) or max 45 days (written agreement) for sums payable to Micro and Small Enterprises (MSEs).',
          exception: 'Partner Remuneration ceiling u/s 40(b)(v) (amended by Finance (No. 2) Act, 2024): On first ₹6,00,000 of Book Profit (or loss) = ₹3,00,000 or 90% of Book Profit, whichever is higher; on balance Book Profit = 60%.',
          example: 'Presumptive Turnover limits u/s 44AD (₹2 Cr -> ₹3 Cr) and 44ADA (₹50L -> ₹75L) apply when aggregate cash receipts during the PY do not exceed 5% of total turnover/gross receipts.'
        }
      ]
    },
    {
      chapterName: 'Heads of Income: Capital Gains',
      keyPrinciples: [
        {
          title: 'Holding Period, Post-23.07.2024 Tax Rates (Sec 111A/112/112A), Slump Sale (Sec 50B), SDV (Sec 50C) & Exemptions (Sec 54–54F)',
          description: 'Effective 23.07.2024 (Finance (No. 2) Act, 2024), Holding Period is uniform two-tier: 12 months for all Listed Securities (Shares, Bonds, Units of Equity Oriented MF, Business Trust) and 24 months for all other Capital Assets (Unlisted Shares, Land & Building, Gold). Tax Rates from 23.07.2024: STCG u/s 111A = 20% (15% before 23.7.24); LTCG u/s 112A = 12.5% above ₹1,25,000 aggregate exemption; LTCG u/s 112 = 12.5% WITHOUT Indexation (Resident Individuals/HUFs receive grandfathering for Land/Building acquired before 23.07.2024 to pay lower of 12.5% without indexation or 20% with indexation for tax liability calculation).',
          exception: 'Sec 50C adopts Stamp Duty Value (SDV) as Full Value of Consideration for Land/Building ONLY if SDV > 110% of actual sale consideration. Sec 54 and Sec 54F cap the cost of new residential house eligible for exemption at ₹10 Crore.',
          example: 'Sec 54EC allows exemption up to ₹50 Lakhs on LTCG from Land or Building if invested within 6 months in NHAI/REC/PFC/IRFC bonds (5-year lock-in).'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'Capital Gains Tax Regime (Pre vs Post 23rd July 2024 — Finance (No. 2) Act, 2024)',
        headers: ['Capital Asset / Section', 'Transfer Before 23.07.2024', 'Transfer On or After 23.07.2024'],
        rows: [
          ['STCG u/s 111A (STT-Paid Equity / Equity MF)', '15% Flat Rate', '20% Flat Rate'],
          ['LTCG u/s 112A (STT-Paid Equity / Equity MF)', '10% above ₹1,00,000', '12.5% above ₹1,25,000 (Combined annual threshold ₹1.25L)'],
          ['LTCG u/s 112 (Land, Building & Other Assets)', '20% with Indexation', '12.5% without Indexation (Res. Ind/HUF Land/Bldg pre-23.7.24: Lower of 12.5% no-index or 20% with index)'],
          ['Buy-Back of Shares by Domestic Co', 'Exempt u/s 10(34A) for shareholder', 'From 01.10.2024: Gross payout taxed as Dividend u/s 2(22)(f); Cost of shares becomes Capital Loss u/s 46A']
        ]
      }
    },
    {
      chapterName: 'Heads of Income: Income from Other Sources',
      keyPrinciples: [
        {
          title: 'Dividends, Casual Income (Sec 115BB/115BBJ), Gifts/Inadequate Consideration (Sec 56(2)(x)) & Family Pension (Sec 57(iia))',
          description: 'Sec 56(2)(x) taxes: (1) Sum of money without consideration if aggregate > ₹50,000 (whole sum taxable); (2) Immovable property without consideration if SDV > ₹50,000 per property; (3) Immovable property for inadequate consideration if (SDV − Consideration) > Higher of ₹50,000 AND 10% of consideration; (4) Specified Movable Property (shares, jewellery, paintings, bullion, VDA) if aggregate FMV/discount > ₹50,000. Exempt gifts include receipts from Relatives, on Marriage, under Will/Inheritance, or from 10(23C)/12AB trusts.',
          exception: 'Family Pension deduction u/s 57(iia) is 1/3rd of pension or ₹25,000, whichever is less, under Default Regime Sec 115BAC(1A) (₹15,000 under Old Regime). Interest expense against Dividend income is capped at 20% of dividend u/s 57.',
          example: 'Effective 01.10.2024, any sum received on Buy-Back of shares from a domestic company is taxed as deemed dividend u/s 2(22)(f) in the hands of the shareholder without any deduction for expenses.'
        }
      ]
    },
    {
      chapterName: 'Clubbing of Income, Set-Off and Carry Forward of Losses',
      keyPrinciples: [
        {
          title: 'Sec 60–64 Clubbing (Spouse & Minor Child) & Sec 70–80 Set-Off / Carry Forward Matrix',
          description: 'Revocable transfer (Sec 61), Spouse’s substantial interest remuneration without technical qualification (Sec 64(1)(ii)), Assets transferred to spouse/son’s wife for inadequate consideration (Sec 64(1)(iv)/(vi)), and Minor Child’s income (Sec 64(1A) — clubbed with parent having higher income; ₹1,500/child exemption ONLY under Old Regime, NOT under 115BAC; manual work/skill/80U disabled minor not clubbed). Set-off Hierarchy: LTCG loss sets off ONLY against LTCG; Speculation loss (4 yrs) only against Speculation profit; Specified Business 35AD loss (unlimited yrs) only against 35AD profit; Owning/Maintaining Race Horses (4 yrs) only against same source; PGBP loss cannot set off against Salary.',
          exception: 'Under Old Regime, House Property loss can be set off against other heads up to ₹2,00,000 in the same year; under Default Regime Sec 115BAC(1A), House Property loss CANNOT be set off against any other head nor carried forward.',
          example: 'Unabsorbed Depreciation u/s 32(2) can be carried forward indefinitely, even if the return of income is filed belatedly beyond Sec 139(1) due date (unlike Business/Capital Losses which mandate timely filing u/s 80).'
        }
      ]
    },
    {
      chapterName: 'Deductions from Gross Total Income',
      keyPrinciples: [
        {
          title: 'Chapter VI-A Deductions: 80C/80CCC/80CCD, 80CCH, 80D, 80DD/80U, 80E, 80G, 80JJAA & 80TTA/80TTB',
          description: 'Combined limit u/s 80CCE (80C + 80CCC + 80CCD(1)) is ₹1,50,000 plus additional ₹50,000 employee NPS u/s 80CCD(1B). Employer NPS contribution u/s 80CCD(2) is allowed up to 14% of Salary (Basic + DA) under Default Regime Sec 115BAC(1A) for ALL employees (Govt & Non-Govt), and 10% for Non-Govt / 14% for Govt under Old Regime. Sec 80D Medical Insurance: ₹25,000 for Self/Family + ₹25,000 for Parents (₹50,000 if Senior Citizen >=60 yrs; includes ₹5,000 preventive health check-up). Sec 80JJAA grants 30% of additional employee cost for 3 years (emoluments <= ₹25,000/month, employed >=240 days or >=150 days for apparel/footwear/leather).',
          exception: 'Under Default Regime Sec 115BAC(1A), ONLY three Chapter VI-A deductions are permissible: Sec 80CCD(2) (Employer NPS up to 14%), Sec 80CCH(2) (Central Govt contribution to Agniveer Corpus Fund), and Sec 80JJAA (Additional Employee Cost). All other deductions (80C, 80D, 80G, 80TTA, 80TTB) are allowed ONLY if opting out of 115BAC.',
          example: 'Sec 80TTA grants up to ₹10,000 savings interest deduction to Non-Senior Individuals/HUF; Sec 80TTB grants up to ₹50,000 savings + FD interest deduction to Resident Senior Citizens (>=60 yrs) under Old Regime.'
        }
      ]
    },
    {
      chapterName: 'Advance Tax, Tax Deduction at Source (TDS) and Tax Collection at Source (TCS)',
      keyPrinciples: [
        {
          title: 'Key TDS Sections (192–194T), TCS (Sec 206C) & Advance Tax Instalments (Sec 208–211 & 234B/234C)',
          description: 'Effective 01.10.2024 (Finance (No. 2) Act, 2024): Sec 194D (Insurance Commission), 194G (Lottery), 194H (Commission/Brokerage >₹15k), 194-IB (Rent by Ind/HUF >₹50k/m), and 194M (Contract/Prof by Ind/HUF >₹50L) TDS rates reduced from 5% to 2%. Sec 194C (1% Ind/HUF, 2% others; >₹30k single / >₹1L aggregate), Sec 194I (2% P&M, 10% Land/Bldg >₹2.40L), Sec 194IA (1% on Higher of Consideration or SDV if >=₹50L aggregate across all transferors/transferees), Sec 194J (2% Technical/Call Centre/Royalty on films, 10% Professional >₹30k), Sec 194Q (0.1% on Goods Purchase >₹50L if buyer turnover >₹10 Cr).',
          exception: 'Advance Tax is payable if tax liability >= ₹10,000 (Resident Senior Citizens >=60 yrs having NO PGBP income are exempt u/s 207). Instalments: 15th June (15%), 15th Sep (45%), 15th Dec (75%), 15th March (100%); 44AD/44ADA pay 100% by 15th March. Under Sec 234C, no interest on June/Sep shortfall if >=12% / >=36% paid.',
          example: 'Sec 206C(1H) TCS (0.1% on sale of goods >₹50L) does NOT apply where Buyer is liable to deduct TDS u/s 194Q.'
        }
      ]
    },
    {
      chapterName: 'Provisions for Filing Return of Income and Self-Assessment',
      keyPrinciples: [
        {
          title: 'Mandatory Return Filing (Sec 139(1) & 7th Proviso), Belated/Revised/Updated Return (Sec 139(4)/(5)/(8A)) & Sec 140A',
          description: 'Due Dates u/s 139(1): 31st July (Non-Audit Assessees), 31st October (Audit cases, Partners of audited firms, Companies), 30th November (Transfer Pricing Sec 92E). Seventh Proviso + Rule 12AB mandates filing even if income < basic exemption when: Current A/c deposit > ₹1 Cr, Foreign travel > ₹2L, Electricity > ₹1L, Business Turnover > ₹60L, Profession Receipts > ₹10L, TDS/TCS >= ₹25,000 (₹50,000 Senior Citizen), or Savings A/c deposit >= ₹50L. Belated (139(4)) & Revised (139(5)) Returns can be filed up to 31st December of AY (or 3 months before end of AY).',
          exception: 'Updated Return u/s 139(8A) (ITR-U) can be filed within 24 months from the end of the relevant Assessment Year with 25% additional tax + interest (if filed within 12 months) or 50% additional tax + interest (if filed between 12 and 24 months), but CANNOT be a loss return or reduce tax liability/increase refund.',
          example: 'Under Sec 140A(1), if self-assessment payment falls short of aggregate Tax + Interest + Fee, the amount paid is first adjusted towards Fee (234F), then Interest (234A/B/C), and the balance towards Tax.'
        }
      ]
    },
    {
      chapterName: 'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
      keyPrinciples: [
        {
          title: 'Comparative Tax Optimization: Default Regime u/s 115BAC(1A) vs Optional Old Regime & AMT (Sec 115JC)',
          description: 'Sec 115BAC(1A) is the DEFAULT tax regime for Individuals/HUF/AOP/BOI/AJP: Slabs are 0–₹3L (Nil), ₹3L–₹7L (5%), ₹7L–₹10L (10%), ₹10L–₹12L (15%), ₹12L–₹15L (20%), >₹15L (30%). Rebate u/s 87A is up to ₹25,000 if Total Income <= ₹7,00,000 (with Marginal Relief above ₹7L where incremental tax exceeds incremental income over ₹7L), compared to ₹12,500 up to ₹5,00,000 under Old Regime. Assessees WITH PGBP income can switch out of 115BAC and back ONLY ONCE; Assessees WITHOUT PGBP income can choose every year.',
          exception: 'Alternate Minimum Tax (AMT) u/s 115JC (@ 18.5% of Adjusted Total Income when ATI > ₹20 Lakhs due to 10AA / 35AD / 80JJAA / 80QQB / 80RRB) DOES NOT APPLY to an assessee taxed under Default Regime Sec 115BAC(1A).',
          example: 'Rebate u/s 87A is NEVER allowed against LTCG u/s 112A (taxed @ 12.5% above ₹1.25L), though it IS allowed against STCG u/s 111A and LTCG u/s 112.'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'Sec 115BAC(1A) Default Regime vs Optional Old Tax Regime — Master Decision Matrix',
        headers: ['Parameter', 'Default Regime u/s 115BAC(1A)', 'Optional Old Tax Regime'],
        rows: [
          ['Basic Exemption Limit', 'Uniform ₹3,00,000 (Regardless of Age)', '₹2,50,000 (<60 yrs) | ₹3,00,000 (60 to <80 yrs) | ₹5,00,000 (>=80 yrs)'],
          ['Rebate u/s 87A (Res. Individual)', 'Up to ₹25,000 if Total Income <= ₹7,00,000 (+ Marginal Relief)', 'Up to ₹12,500 if Total Income <= ₹5,00,000 (No Marginal Relief)'],
          ['Salary Standard Deduction u/s 16(ia)', '₹75,000', '₹50,000'],
          ['House Property Interest u/s 24(b)', 'SOP = Not Allowed | LOP = Allowed (No HP loss set-off against other heads)', 'SOP = Allowed up to ₹2,00,000 | LOP = Allowed (Set-off against other heads capped at ₹2L)'],
          ['Permissible Chapter VI-A Deductions', 'ONLY 80CCD(2) (14% NPS), 80CCH(2) & 80JJAA', 'All eligible deductions: 80C, 80CCD(1B), 80D, 80E, 80G, 80TTA/80TTB, etc.']
        ]
      }
    },
    {
      chapterName: 'GST Laws: An Introduction including Constitutional Aspects',
      keyPrinciples: [
        {
          title: '101st Constitutional Amendment Act, Article 246A, Article 269A, Article 279A (GST Council) & Subsumed Taxes',
          description: 'Dual GST model in India levies CGST + SGST/UTGST simultaneously on intra-State supplies (Article 246A concurrent power) and IGST on inter-State supplies & imports (Article 269A exclusive Parliament power). GST Council (Article 279A) comprises Union Finance Minister (Chairperson), Union MoS (Revenue), and State Finance Ministers: Quorum = 50% of total members; Decision requires >= 3/4th (75%) weighted majority (Central Govt weight = 1/3rd; All States combined weight = 2/3rd).',
          exception: 'Alcoholic liquor for human consumption is constitutionally EXCLUDED from GST (Entry 54 State List). Five petroleum products (Petroleum Crude, High Speed Diesel, Motor Spirit/Petrol, Natural Gas, and Aviation Turbine Fuel) are temporarily outside GST until a date recommended by the GST Council.',
          example: 'Tobacco and tobacco products are subject to BOTH GST and Central Excise Duty.'
        }
      ]
    },
    {
      chapterName: 'Levy and Collection of CGST and IGST (Supply, Composite/Mixed, RCM, Exemptions & Composition)',
      keyPrinciples: [
        {
          title: 'Scope of Supply (Sec 7 & Schedules I/II/III), Composite vs Mixed (Sec 8), RCM (Sec 9(3)) & Composition Levy (Sec 10)',
          description: 'Sec 7(1)(a) requires Supply + Consideration + Course/Furtherance of Business. Schedule I taxes 4 supplies WITHOUT consideration: (1) Permanent transfer/disposal of business assets where ITC was availed; (2) Supply between Related/Distinct Persons (employer-employee gifts exempt up to ₹50,000/FY); (3) Principal-Agent goods; (4) Import of services by a person from a related person/foreign establishment in course of business. Sec 8: Composite Supply (naturally bundled in ordinary course) taxed at rate of Principal Supply; Mixed Supply (single price, not naturally bundled) taxed at Highest Rate.',
          exception: 'Composition Scheme u/s 10(1) applies if preceding FY aggregate turnover <= ₹1.5 Crore (₹75 Lakhs in 8 Special Category States): Manufacturers 1% of total turnover, Restaurants 5% of total turnover, Traders 1% of TAXABLE turnover (marginal services allowed up to Higher of 10% of State turnover or ₹5 Lakhs). Service Composition u/s 10(2A) allows turnover <= ₹50 Lakhs @ 6% (3% CGST + 3% SGST).',
          example: 'Effective 10.10.2024, renting of ANY commercial/immovable property (other than residential dwelling) by an UNREGISTERED person to a REGISTERED person is taxable under Reverse Charge Mechanism (RCM).'
        }
      ]
    },
    {
      chapterName: 'Basic Concepts: Classification, Place of Supply, Time of Supply & Value of Supply',
      keyPrinciples: [
        {
          title: 'Place of Supply (Sec 10 & 12 IGST), Time of Supply (Sec 12 & 13 CGST) & Transaction Value (Sec 15 CGST)',
          description: 'Place of Supply (IGST): Goods with movement (Sec 10(1)(a)) = location where movement terminates; Bill-to-Ship-to (10(1)(b)) = principal place of Third Person; Immovable Property services (12(3)) = location of property; Restaurant/Personal grooming (12(4)) = location of performance. Time of Supply: Forward Charge Goods (Sec 12(2)) = Date of Invoice or Last Due Date u/s 31(1) (Advances on goods are NOT taxable at receipt per Notif 66/2017); Forward Charge Services (Sec 13(2)) = Earliest of Invoice (if within 30/45 days) or Receipt of Payment; RCM Goods = Earliest of Receipt of Goods, Payment, or 31st day from supplier invoice; RCM Services = Earliest of Payment or 61st day from supplier invoice.',
          exception: 'Under Sec 15(2), Transaction Value includes non-GST taxes, supplier obligations paid by recipient, incidental expenses, interest/late fee for delayed payment (Time of Supply = actual receipt), and non-Govt subsidies directly linked to price. Post-supply discounts are excluded ONLY if established by prior agreement, linked to specific invoices, and recipient reverses proportionate ITC.',
          example: 'For Vouchers (Sec 12(4)/13(4)), if supply is identifiable at issue, Time of Supply = Date of Issue of Voucher; otherwise Date of Redemption.'
        }
      ]
    },
    {
      chapterName: 'Input Tax Credit (ITC) & Computation of GST Liability',
      keyPrinciples: [
        {
          title: 'Sec 16 Eligibility Conditions, Sec 17(5) Blocked Credits, Sec 18 Special Cases & Sec 49A/49B Rule 88A Set-Off Order',
          description: 'Sec 16(2) requires: (a) Tax Invoice/Debit Note, (aa) Reflection in GSTR-2B, (b) Receipt of goods/services (incl. Bill-to-Ship-to; last lot if received in lots), (ba) Not restricted in GSTR-2B, (c) Tax paid to Govt, and (d) Filing GSTR-3B. Recipient must pay supplier within 180 days from invoice date (else reverse ITC + 18% interest u/s 50; re-claim anytime on payment). Time limit to avail ITC u/s 16(4) is Earlier of 30th November following the end of the FY or filing of Annual Return (for Debit Notes, linked to FY in which the Debit Note itself was issued).',
          exception: 'ITC Utilisation Sequence (Sec 49(5), 49A, 49B & Rule 88A): (1) IGST ITC must be exhausted COMPLETELY first — first against IGST liability, and remaining IGST ITC against CGST and/or SGST in ANY order and in ANY proportion; (2) Only after IGST ITC = 0, use CGST ITC (for CGST -> IGST) and SGST ITC (for SGST -> IGST). Cross-utilisation between CGST and SGST is strictly prohibited.',
          example: 'Sec 17(5) blocks ITC on motor vehicles for persons seating <=13 (including driver) unless used for further supply, passenger transport, or driving training.'
        }
      ]
    },
    {
      chapterName: 'Registration under GST',
      keyPrinciples: [
        {
          title: 'Sec 22 Aggregate Turnover Thresholds, Sec 24 Compulsory Registration, Sec 25 Procedure & Sec 29/30 Cancellation',
          description: 'Aggregate Turnover u/s 2(6) is computed PAN-India (includes taxable, exempt, exports, and inter-State distinct person supplies; excludes inward RCM supplies and GST taxes). Threshold u/s 22: ₹10 Lakhs (Manipur, Mizoram, Nagaland, Tripura); ₹20 Lakhs (Arunachal Pradesh, Meghalaya, Puducherry, Sikkim, Telangana, Uttarakhand + exclusive/mixed service providers in all other States); ₹40 Lakhs (Exclusive suppliers of Goods in remaining States — inapplicable to Ice Cream, Pan Masala, Tobacco, and Fly Ash Bricks/Building Bricks/Earthen Tiles).',
          exception: 'Sec 24 Compulsory Registration (irrespective of turnover): Inter-State taxable supply of goods (except Handicrafts & Job-workers up to ₹20L/10L), Casual Taxable Person (CTP), Non-Resident Taxable Person (NRTP), persons liable under RCM, and E-Commerce Operators liable u/s 9(5). Persons supplying services or goods (up to ₹40L/20L intra-state with enrolment ID) through ECOs are exempt up to threshold.',
          example: 'Application for registration u/s 25(1) must be made within 30 days of becoming liable (effective from date of liability); CTP/NRTP apply at least 5 days before commencing business with advance tax deposit.'
        }
      ]
    },
    {
      chapterName: 'Tax Invoice, Credit and Debit Notes, and Electronic Way Bill',
      keyPrinciples: [
        {
          title: 'Sec 31 Tax Invoice Timelines, E-Invoicing (₹5 Cr Threshold), Sec 34 Credit/Debit Notes & Rule 138 E-Way Bill',
          description: 'Goods Invoice u/s 31(1): On or before removal (movement) or delivery (no movement); Continuous supply of goods = on/before successive statement or payment. Services Invoice u/s 31(2): Within 30 days of supply (45 days for Banks/FIs/NBFCs/Insurance). E-Invoicing (IRN on IRP portal) is mandatory for registered persons whose aggregate turnover in ANY preceding FY from 2017-18 onwards exceeds ₹5 Crore (applicable to B2B supplies and Exports; Banks/NBFCs/GTA/Cinema/SEZ units exempt).',
          exception: 'E-Way Bill (Rule 138) is mandatory before movement of goods where consignment value (incl. GST, excl. exempt goods) > ₹50,000; however, E-Way Bill is COMPULSORY even if <= ₹50,000 for Inter-State movement of goods by Principal to Job-Worker and Inter-State movement of Handicraft goods by unregistered exempt dealers.',
          example: 'E-Way Bill Validity: 1 day for every 200 km (or part) for normal cargo; 1 day for every 20 km (or part) for Over-Dimensional Cargo (ODC) or Multimodal shipment involving a ship leg.'
        }
      ]
    },
    {
      chapterName: 'Accounts and Records under GST',
      keyPrinciples: [
        {
          title: 'Sec 35 Mandatory Books of Accounts & Sec 36 72-Month Retention Period',
          description: 'Every registered person must maintain true and correct accounts at the Principal Place of Business (and additional places specified in Registration Certificate) covering production/manufacture, inward/outward supplies, stock of goods, ITC availed, and output tax payable/paid. Warehouse operators and transporters (even if unregistered) must maintain consignment records using a unique Enrolment Number.',
          exception: 'Under Sec 36, books of account and records must be retained for at least 72 MONTHS (6 years) from the due date of furnishing the Annual Return for the year pertaining to such accounts. If party to an appeal/revision/investigation, retain for 1 year after final disposal or 72 months, whichever is LATER.',
          example: 'Composition dealers u/s 10 are exempted from maintaining quantitative stock details of tax-rate-wise goods and ITC registers.'
        }
      ]
    },
    {
      chapterName: 'Returns and Payment of Tax under GST',
      keyPrinciples: [
        {
          title: 'GSTR-1/IFF, GSTR-3B, QRMP Scheme, GSTR-4/9 & Electronic Cash/Credit Ledgers (Sec 49, 50, Rule 86B)',
          description: 'GSTR-1 (Outward Supplies) due by 11th of next month (13th of month following quarter for QRMP; IFF optional for M1/M2 up to ₹50L/month by 13th). GSTR-3B due by 20th of next month (22nd/24th post-quarter for QRMP, with monthly tax payment in PMT-06 by 25th via Fixed Sum 35% or Self-Assessment). Composition dealers pay quarterly tax in CMP-08 by 18th following quarter and file annual GSTR-4 by 30th April following FY. Annual Return GSTR-9 due by 31st December following FY.',
          exception: 'Interest u/s 50(1) @ 18% p.a. on delayed filing of GSTR-3B is levied ONLY on the NET Cash Tax liability (debited to Electronic Cash Ledger), unless return is filed after initiation of proceedings u/s 73/74/74A. Wrongly availed AND utilised ITC attracts interest u/s 50(3) @ 18% p.a. Rule 86B mandates paying at least 1% of output tax via Cash Ledger if monthly taxable supply exceeds ₹50 Lakhs (subject to exceptions).',
          example: 'Under Sec 37/39, a registered person cannot furnish GSTR-1/GSTR-3B for a tax period after the expiry of 3 years from its due date.'
        }
      ]
    },
  ],

  // =========================================================================
  // PAPER 4: COST AND MANAGEMENT ACCOUNTING (100 MARKS)
  // =========================================================================
  Cost: [
    {
      chapterName: 'Introduction to Cost and Management Accounting (Objectives, Cost Behaviour & Digital Costing)',
      keyPrinciples: [
        {
          title: 'Cost Control vs Cost Reduction, Cost Behaviour Segregation & Digital Costing',
          description: 'Cost Control is corrective/preventive and aims to keep costs within pre-determined standards without challenging the standards themselves. Cost Reduction is a continuous, permanent, real saving in unit cost of manufacture/services WITHOUT impairing product quality/suitability. Semi-variable costs are segregated into Fixed and Variable components using High-Low Method [Variable Cost/unit = Change in Total Cost / Change in Activity Level], Analytical Method, or Least Squares Regression. Digital Costing integrates IoT, ERP, AI, and real-time production sensors to track granular product/batch resource consumption.',
          exception: 'Sunk Costs (historical costs already incurred) and Apportioned Common Fixed Overheads are IRRELEVANT for future managerial decision-making, whereas Opportunity Cost and Incremental/Differential Cost are relevant.',
          example: 'Cost Centres are classified into Personal/Impersonal and Production, Service, Process, or Responsibility Centres (Cost, Revenue, Profit, and Investment Centres).'
        }
      ]
    },
    {
      chapterName: 'Elements of Cost and Preparation of Cost Sheets (Manufacturing & Service Sectors)',
      keyPrinciples: [
        {
          title: 'Cost Sheet Hierarchy (Prime Cost -> Works Cost -> Cost of Production -> Cost of Goods Sold -> Cost of Sales)',
          description: 'Prime Cost = Direct Material Consumed + Direct Employees (Labour) Cost + Direct Expenses. Factory/Works Cost = Prime Cost + Factory Overheads + (Opening WIP − Closing WIP). Cost of Production = Factory Cost + Quality Control Cost + Research & Development Cost (process related) + Administrative Overheads (relating to production) − Credit for Scrap/By-Product + Primary Packing Cost. Cost of Goods Sold (COGS) = Cost of Production + Opening Finished Goods − Closing Finished Goods. Cost of Sales = COGS + General Admin Overheads + Marketing/Selling & Distribution Overheads + Secondary Packing.',
          exception: 'Items purely financial in nature (Income Tax, Cash Discount allowed, Dividend paid, Donations, Bad Debts, Interest on Debentures/Bank Loans unless specifically requested, Loss on sale of fixed assets, Goodwill written off) are EXCLUDED from the Cost Sheet.',
          example: 'Closing Finished Goods inventory in a Cost Sheet is valued on Cost of Production per unit (FIFO or Weighted Average).'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'ICAI Standard Cost Sheet Architecture (Manufacturing & Service Sectors)',
        headers: ['Cost Stage', 'Inclusions & Adjustments', 'Exclusions / Crucial Exam Traps'],
        rows: [
          ['1. Prime Cost', 'Direct Material Consumed (Op Stock + Purchases + Carriage Inward − Cl Stock − Scrap of RM) + Direct Wages + Direct Expenses (Royalty on production, Hire of special plant)', 'Exclude Abnormal Material Loss & Trade Discount'],
          ['2. Works / Factory Cost', 'Prime Cost + Factory Overheads + Opening WIP − Closing WIP', 'Exclude Abnormal Idle Time'],
          ['3. Cost of Production', 'Works Cost + Quality Control + R&D (production) + Admin OH (Production) + Primary Packing − Net Realisable Value of Process Scrap', 'General Corporate Admin OH goes below COGS'],
          ['4. Cost of Goods Sold & Cost of Sales', 'COGS = COP + Op FG − Cl FG; Cost of Sales = COGS + General Admin OH + Selling & Distribution OH + Secondary Packing', 'Exclude Income Tax, Interest/Finance Charges, Dividends & Penalties']
        ]
      }
    },
    {
      chapterName: 'Material Cost (Procurement, GeM/ERP Digital Costing, EOQ, Inventory Control & Losses)',
      keyPrinciples: [
        {
          title: 'EOQ, Stock Control Levels, ABC/FSN/VED/JIT Inventory Systems & Waste/Scrap/Spoilage/Defectives',
          description: 'Economic Order Quantity (EOQ) = sqrt((2 × Annual Demand A × Ordering Cost O) / Carrying Cost per unit p.a. C). Re-Order Level (ROL) = Max Usage × Max Lead Time [or Safety Stock + (Avg Usage × Avg Lead Time)]. Max Level = ROL + ROQ − (Min Usage × Min Lead Time). Min Level = ROL − (Avg Usage × Avg Lead Time). ABC Analysis classifies inventory by annual usage value (A: ~10% items = 70% value; B: ~20% items = 20% value; C: ~70% items = 10% value). GeM (Government e-Marketplace) and ERP automate digital e-procurement, tendering, and real-time bill of materials.',
          exception: 'Waste (no realisable value) and Scrap (small realisable value): Normal loss is absorbed by good units (inflating unit cost); Abnormal loss is transferred to Costing P&L A/c. Defectives (can be rectified by adding extra material/labour) have normal rectification cost charged to Factory Overheads (or specific job), whereas Spoilage cannot be rectified economically and is sold as seconds/scrap.',
          example: 'Inventory Turnover Ratio = Cost of Materials Consumed / Average Inventory Held; high turnover indicates fast-moving stock.'
        }
      ]
    },
    {
      chapterName: 'Employee Cost (Attendance/Payroll, Turnover & Halsey/Rowan Incentive Schemes)',
      keyPrinciples: [
        {
          title: 'Halsey vs Rowan Bonus Plans, Overtime Treatment (CAS-7) & Employee Turnover Ratios',
          description: 'Time Saved (TS) = Time Allowed (SH) − Time Taken (AH). Halsey Plan: Total Wages = (AH × R) + 50% × (TS × R). Rowan Plan: Total Wages = (AH × R) + [(TS / SH) × AH × R]. Employee Turnover measures workforce stability via: (1) Separation Method = Separations / Avg Workers × 100; (2) Replacement Method = Replacements / Avg Workers × 100 (excludes expansion recruits); (3) Flux Method = (Separations + Accessions [or Replacements]) / Avg Workers × 100.',
          exception: 'Overtime Premium Treatment: (1) At customer’s specific request = charge directly to that Job; (2) Due to regular capacity shortage/policy = inflate general Direct Wage Rate or Factory Overhead; (3) Due to abnormal events (machinery breakdown/power failure) = charge to Costing P&L A/c.',
          example: 'Bonus under Rowan Plan exceeds Halsey Plan when Time Saved is < 50% of Time Allowed; both give identical bonus when Time Saved = 50% of Time Allowed.'
        }
      ]
    },
    {
      chapterName: 'Direct Expenses (Identification & Accounting Treatment)',
      keyPrinciples: [
        {
          title: 'Identification, Measurement & Treatment of Direct Expenses (CAS-10 Principles)',
          description: 'Direct Expenses (Chargeable Expenses) are expenses other than Direct Material and Direct Employee Cost that are directly traceable to a specific product, job, batch, or service cost object. Examples include: Royalty payable based on units produced, Hire charges of special machinery/moulds for a specific job, Cost of product-specific designs/drawings/software, and Sub-contracting/job-work charges on main product.',
          exception: 'If a direct expense is of immaterial monetary value and tracing it to individual cost units is not economically feasible, it is treated as part of Factory Overheads. Finance costs and imputed costs are never included in Direct Expenses.',
          example: 'Royalty based on units PRODUCED is a Direct Expense (part of Prime Cost), whereas Royalty based on units SOLD is a Selling Overhead.'
        }
      ]
    },
    {
      chapterName: 'Overheads (Absorption Costing, Primary/Secondary Distribution, Admin, S&D & R&D Cost)',
      keyPrinciples: [
        {
          title: 'Primary & Secondary Distribution (Direct, Step-Down, Reciprocal) & Under/Over Absorption Treatment',
          description: 'Primary Distribution allocates/apportions overheads to all Production & Service Departments. Secondary Distribution re-apportions Service Department costs to Production Departments via Direct Redistribution, Step-Down (Non-Reciprocal) Method, or Reciprocal Service Methods (Simultaneous Equations, Repeated Distribution, or Trial & Error). Machine Hour Rate absorbs machine-related standing and running expenses. Under/Over Absorption = Overhead Absorbed (Actual Activity × Pre-determined Rate) − Actual Overhead Incurred.',
          exception: 'Treatment of Under/Over Absorbed Overheads: If caused by abnormal factors/defective planning -> write off to Costing P&L A/c; if caused by normal price/seasonal fluctuations -> apply a Supplementary Overhead Rate over COGS, Closing FG, and Closing WIP.',
          example: 'Idle Capacity Cost due to normal seasonal/maintenance downtime is absorbed via inflated normal overhead rate; Abnormal Idle Capacity Cost is charged to Costing P&L A/c.'
        }
      ]
    },
    {
      chapterName: 'Concepts of Activity Based Costing (ABC)',
      keyPrinciples: [
        {
          title: 'Cost Hierarchy (Unit, Batch, Product, Facility), Activity Cost Pools & Cost Driver Rates',
          description: 'ABC eliminates volume distortion of traditional absorption costing by grouping indirect overheads into homogeneous Activity Cost Pools and assigning them to products using cause-and-effect Cost Drivers. Cooper & Kaplan’s 4-level Cost Hierarchy: (1) Unit-Level Activities (machine power, direct inspection), (2) Batch-Level Activities (machine setups, purchase orders, material handling), (3) Product-Sustaining Activities (product design, engineering change notices), and (4) Facility-Sustaining Activities (plant security, factory rent).',
          exception: 'Traditional volume-based costing systematically OVER-COSTS high-volume simple products and UNDER-COSTS low-volume complex products.',
          example: 'Activity Cost Driver Rate = Total Cost of Activity Pool / Total Activity Driver Volume (e.g., ₹ per Setup or ₹ per Purchase Order).'
        }
      ]
    },
    {
      chapterName: 'Integration of Cost and Financial Data (Non-Integrated/Integrated Systems & Reconciliation)',
      keyPrinciples: [
        {
          title: 'Non-Integrated Control Accounts (CLC/GLAA) vs Integrated Accounts & Profit Reconciliation',
          description: 'In a Non-Integrated System, Cost Ledger maintains Stores Ledger Control A/c, Wages Control A/c,WIP Ledger Control A/c, Finished Goods Control A/c, Overheads Control A/c, and Cost Ledger Control (CLC / General Ledger Adjustment) A/c to make the Cost Ledger self-balancing (excluding personal and cash accounts). In an Integrated System, a single set of books records both financial and cost transactions without needing CLC or profit reconciliation.',
          exception: 'Reconciliation of Cost & Financial Profits arises from: (1) Purely Financial Charges (Donations, Income Tax, Fines) & Purely Financial Incomes (Rent/Dividend received), (2) Under/Over Absorption of Overheads not written off to Costing P&L, and (3) Different Inventory Valuation bases (Cost Sheet cost vs Lower of Cost/NRV in Financial Accounts).',
          example: 'Opening Stock overvalued in Cost Accounts reduces Cost Profit (add back when starting from Cost Profit); Closing Stock overvalued in Cost Accounts inflates Cost Profit (deduct when starting from Cost Profit).'
        }
      ]
    },
    {
      chapterName: 'Single Output/Unit Costing, Job Costing and Batch Costing',
      keyPrinciples: [
        {
          title: 'Unit Costing, Job Cost Cards & Economic Batch Quantity (EBQ)',
          description: 'Single/Output Costing applies to continuous manufacture of identical units (cement, bricks, coal mines). Job Costing tracks direct material, direct labour, and absorbed overheads on a distinct Job Cost Sheet/Card for each customized customer order. Batch Costing treats a batch of identical units (pharmaceuticals, garments, spare parts) as a cost unit and determines Optimum / Economic Batch Quantity (EBQ).',
          exception: 'Economic Batch Quantity (EBQ) = sqrt((2 × Annual Demand D × Setting-up Cost per Batch S) / Carrying Cost per unit per annum C).',
          example: 'At EBQ, Total Annual Set-up Cost equals Total Annual Inventory Carrying Cost.'
        }
      ]
    },
    {
      chapterName: 'Process and Operation Costing (Equivalent Units, Joint Products & By-Products)',
      keyPrinciples: [
        {
          title: 'Normal/Abnormal Process Loss, Equivalent Production (FIFO vs Weighted Avg), Inter-Process Profit & Joint/By-Products',
          description: 'Normal Process Loss is credited to the Process A/c at scrap value (absorbing net cost over good units). Abnormal Loss and Abnormal Gain are valued at the exact SAME cost per good unit [(Total Cost − Normal Loss Scrap Value) / (Input Units − Normal Loss Units)]. Abnormal Gain is debited to Process A/c and credited to Abnormal Gain A/c (adjusted for lost normal scrap). Equivalent Production converts incomplete Closing WIP using either FIFO Method (current period work only) or Weighted Average Method (merges Opening WIP cost with current cost). Joint Costs up to split-off point are apportioned over Joint Products using Physical Units, Sales Value at Split-Off, Net Realisable Value (NRV) at Split-Off, or Constant Gross Margin % NRV.',
          exception: 'Decision to process a Joint Product further beyond split-off point depends ONLY on whether Incremental Sales Revenue exceeds Incremental Further Processing Cost (apportioned joint costs are sunk and irrelevant).',
          example: 'In Inter-Process Profit accounts, Unrealised Profit included in Closing Stock of Process II/III and Finished Goods is eliminated via Provision for Unrealised Profit.'
        }
      ]
    },
    {
      chapterName: 'Costing of Service Sectors',
      keyPrinciples: [
        {
          title: 'Composite Cost Units (Absolute vs Commercial) & Standing/Running/Maintenance Classification',
          description: 'Service Costing (Operating Costing) applies to transport, hospitals, hotels, power houses, IT/BPO, educational institutions, and toll roads. Costs are classified into Standing/Fixed Charges (insurance, license, manager salary, garage rent), Running/Variable Charges (fuel, driver wages if trip-linked, consumables), and Semi-Variable/Maintenance Charges (repairs, tyres).',
          exception: 'Distinguish Absolute Tonne-Km [Sum of (Individual Distance × Weight for each leg)] from Commercial Tonne-Km [Total Distance travelled × Average Weight across all legs].',
          example: 'Composite Units: Transport = Passenger-Km or Tonne-Km; Hospital = Patient-Day; Hotel = Room-Day; Power House = Kilowatt-Hour (kWh).'
        }
      ]
    },
    {
      chapterName: 'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
      keyPrinciples: [
        {
          title: 'Complete Variance Decomposition Tree (Material, Labour, Variable OH & Fixed OH)',
          description: 'Standard Costing compares Standard Cost allowed for ACTUAL Output against Actual Cost incurred. Material Cost Variance [(SQ×SP) − (AQ×AP)] = Material Price Variance [(SP−AP)×AQ] + Material Usage Variance [(SQ−AQ)×SP]; Usage splits into Mix [(RSQ−AQ)×SP] + Yield [(SQ−RSQ)×SP]. Labour Cost Variance [(SH×SR) − (AH_paid×AR)] = Rate Variance [(SR−AR)×AH_paid] + Idle Time Variance [Idle Hrs × SR (Always Adverse)] + Efficiency Variance [(SH−AH_worked)×SR].',
          exception: 'Fixed Overhead Cost Variance [(Absorbed FO) − Actual FO] splits into Expenditure Variance [Budgeted FO − Actual FO] and Volume Variance [Absorbed FO − Budgeted FO]. Volume Variance splits further into Efficiency, Capacity, and Calendar Variances.',
          example: 'Variable Overhead Cost Variance = Expenditure Variance [(SR − AR) × AH_worked] + Efficiency Variance [(SH − AH_worked) × SR].'
        }
      ]
    },
    {
      chapterName: 'Marginal Costing (CVP Analysis, BEP, Margin of Safety & Short-Term Decisions)',
      keyPrinciples: [
        {
          title: 'P/V Ratio, Break-Even Point, Margin of Safety, Indifference Point, Shut-Down Point & Key Factor Ranking',
          description: 'Contribution (C) = Sales − Variable Cost = Fixed Cost + Profit. P/V Ratio = (C / Sales) × 100 = (Change in Profit / Change in Sales) × 100. Break-Even Point (Units) = Fixed Cost / Contribution per unit; BEP (₹) = Fixed Cost / P/V Ratio. Margin of Safety (MOS) = Actual Sales − BEP Sales = Profit / P/V Ratio. Cost Indifference Point = Difference in Fixed Costs / Difference in Variable Cost per unit. Shut-Down Point (Units) = (Total Fixed Cost − Unavoidable Shut-Down Costs) / Contribution per unit.',
          exception: 'In Reconciliation of Marginal Costing Profit vs Absorption Costing Profit, the difference arises SOLELY from Fixed Production Overheads deferred in Opening vs Closing Inventory: Absorption Profit − Marginal Profit = (Closing Stock Units − Opening Stock Units) × Fixed Production Overhead Rate per unit.',
          example: 'Under Limiting / Key Factor constraint (scarce raw material kg or machine hours), rank products by Contribution per unit of Key Factor.'
        }
      ]
    },
    {
      chapterName: 'Budget and Budgetary Control (Flexible, Functional, Cash/Master, ZBB & Performance Budgets)',
      keyPrinciples: [
        {
          title: 'Flexible vs Fixed Budgets, Functional Budgets, Budget Control Ratios, Zero Based Budgeting (ZBB) & Feed-Forward Control',
          description: 'Flexible Budget restates budgeted revenue and costs across multiple capacity levels by separating Fixed, Variable, and Semi-Variable costs. Functional Budgets (Sales, Production, Material Usage/Purchase, Labour, Cash Budget) culminate in the Master Budget. Zero Based Budgeting (ZBB — Peter Pyhrr) starts from a zero base every period requiring every Decision Package to be justified afresh and ranked by cost-benefit analysis. Feedback Control compares actual results after the event, whereas Feed-Forward Control forecasts future deviations in advance and takes preventive action.',
          exception: 'Three Budgetary Control Ratios: (1) Efficiency Ratio = (Standard Hours for Actual Output / Actual Hours Worked) × 100; (2) Activity / Volume Ratio = (Standard Hours for Actual Output / Budgeted Hours) × 100; (3) Capacity Ratio = (Actual Hours Worked / Budgeted Hours) × 100. Note: Activity Ratio = Efficiency Ratio × Capacity Ratio (and Calendar Ratio adjusts for working days).',
          example: 'In a Production & Material Purchase Budget: Production = Sales + Closing FG − Opening FG; Raw Material Purchases = RM Consumption + Closing RM − Opening RM.'
        }
      ]
    },
  ],

  // =========================================================================
  // PAPER 5: AUDITING AND ETHICS (100 MARKS)
  // =========================================================================
  AuditInter: [
    {
      chapterName: 'Nature, Objective and Scope of Audit (SA 200)',
      keyPrinciples: [
        {
          title: 'SA 200 Overall Objectives, Reasonable Assurance, Inherent Limitations & Interdisciplinary Links',
          description: 'Under SA 200, the overall objective of the independent auditor is to obtain Reasonable Assurance (high but not absolute assurance) about whether financial statements as a whole are free from material misstatement (whether due to fraud or error) and to report in accordance with SAs. Inherent Limitations of Audit arise from: (1) Nature of financial reporting (management judgment/estimates), (2) Nature of audit procedures (practical/legal limits, fraud concealment, audit evidence is persuasive rather than conclusive), and (3) Timeliness of financial reporting and balance between benefit and cost.',
          exception: 'Scope of Audit NEVER includes authenticating the genuineness of physical documents (auditor is not a handwriting/forgery expert) nor conducting an official investigation with legal search/subpoena powers.',
          example: 'Professional Skepticism requires a questioning mind and critical assessment of audit evidence throughout the engagement.'
        }
      ]
    },
    {
      chapterName: 'Audit Strategy, Audit Planning and Audit Program (SA 300)',
      keyPrinciples: [
        {
          title: 'SA 300 Overall Audit Strategy vs Detailed Audit Plan, Preliminary Engagement Activities & Audit Programme',
          description: 'Planning an audit (SA 300) is a continual and iterative process, not a discrete phase. Preliminary Engagement Activities performed BEFORE starting planning include: (1) Performing procedures regarding continuance of client relationship (SA 220), (2) Evaluating compliance with ethical requirements including independence, and (3) Establishing an understanding of terms of engagement (SA 210). Overall Audit Strategy sets the scope, timing, and direction of the audit and guides the development of the more detailed Audit Plan (which specifies Nature, Timing, and Extent of RAP, FAP, and other audit procedures).',
          exception: 'The Overall Audit Strategy and the Audit Plan are closely inter-related: changes in one may result in consequential changes to the other during the course of the audit.',
          example: 'An Audit Programme is a detailed list of verification steps and instructions for audit assistants, which should remain periodic/flexible rather than rigid/mechanical.'
        }
      ]
    },
    {
      chapterName: 'Risk Assessment and Internal Control (SA 315, SA 320, SA 330 & Digital Audit)',
      keyPrinciples: [
        {
          title: 'Audit Risk Model (AR = IR × CR × DR), SA 315 Five Internal Control Components, SA 320 Materiality & Digital Audit',
          description: 'Audit Risk = Risk of Material Misstatement (Inherent Risk × Control Risk) × Detection Risk. Detection Risk has an inverse relationship with assessed RMM. Under SA 315, Internal Control comprises 5 components: (1) Control Environment, (2) Entity’s Risk Assessment Process, (3) Information System & Communication, (4) Control Activities, and (5) Monitoring of Controls. Under SA 320, Performance Materiality is set LOWER than Overall Materiality to reduce aggregation risk of uncorrected/undetected misstatements. SA 330 covers Auditor’s Responses to Assessed Risks (Tests of Controls + Substantive Procedures).',
          exception: 'In a Digital Audit / Automated IT Environment, controls split into General IT Controls (GITCs — Data centre/network ops, Program change, Access security, Application acquisition/maintenance) and Application Controls (automated input/processing/output edits). Internal Financial Controls (IFC u/s 134(5)(e)) is broader (includes operational efficiency and fraud prevention) than Internal Financial Controls over Financial Reporting (IFC-FR u/s 143(3)(i) reported by statutory auditor).',
          example: 'Sampling Risk is the risk that the auditor’s conclusion based on a sample may differ from the conclusion reached if the entire population were subjected to the same audit procedure.'
        }
      ]
    },
    {
      chapterName: 'Audit Evidence (SA 500, 501, 505, 510, 520, 530, 550, 610 & Internal Financial Control)',
      keyPrinciples: [
        {
          title: 'SA 500 Evidence & Audit Trail, SA 501 Inventory/Litigation/Segments, SA 505 Confirmations & SA 510 Opening Balances',
          description: 'SA 500 requires Sufficient (quantity) and Appropriate (relevance + reliability) audit evidence using 7 procedures: Inspection, Observation, External Confirmation, Recalculation, Reperformance, Analytical Procedures, and Inquiry. Under Rule 11(g), auditor reports whether company used accounting software with Audit Trail (edit log) operated throughout the year and not tampered with. SA 501 mandates physical inventory attendance (if material and practicable), inquiry + direct communication with external legal counsel for litigation/claims, and presentation/disclosure methods for segment information. SA 505 governs Positive vs Negative External Confirmations (if management refuses confirmation request, evaluate validity, fraud risk, and modify opinion u/s SA 705 if unable to obtain alternative evidence).',
          exception: 'Under SA 520 (Analytical Procedures), analytical procedures are MANDATORY at the Risk Assessment stage (SA 315) and at the Overall Conclusion/Completion stage, whereas Substantive Analytical Procedures during execution are optional.',
          example: 'SA 530 covers Statistical vs Non-Statistical Sampling (Random, Systematic, Monetary Unit, Haphazard, Block selection); SA 550 covers Related Parties; SA 610 covers Using the Work of Internal Auditors (evaluating objectivity, competence, and systematic/disciplined approach; Direct Assistance prohibited where significant judgment is involved).'
        }
      ]
    },
    {
      chapterName: 'Audit of Items of Financial Statements',
      keyPrinciples: [
        {
          title: 'Financial Statement Assertions (Balance Sheet, P&L & Disclosures) & Item-Wise Verification',
          description: 'Account Balance Assertions (Balance Sheet): Existence, Rights & Obligations, Completeness, Valuation & Allocation. Class of Transactions Assertions (P&L): Occurrence, Completeness, Accuracy, Cut-off, Classification. Presentation & Disclosure Assertions: Occurrence & Rights/Obligations, Completeness, Classification & Understandability, Accuracy & Valuation. Key corporate items include Share Capital (Sweat Equity, Reduction u/s 66, Forfeiture), Reserves (Capital vs Revenue), Borrowings (Charge registration, Drawing Power vs Sanctioned Limit stock statements), PPE/Intangibles, Trade Receivables, Inventories, Cash, and Contingent Liabilities.',
          exception: 'When verifying quarterly returns/statements of current assets filed by the company with banks/FIs for working capital limits exceeding ₹5 Crore in aggregate, any discrepancy with books of account must be reported under CARO 2020 Clause 3(ii)(b) and Schedule III disclosures.',
          example: 'Cut-off procedures on Sales and Purchases test whether transactions near 31st March are recorded in the correct accounting period.'
        }
      ]
    },
    {
      chapterName: 'Audit Documentation (SA 230)',
      keyPrinciples: [
        {
          title: 'Nature, Form, Content, Completion Memorandum, 60-Day Assembly & 7-Year Retention (SA 230 & SQC 1)',
          description: 'Audit Documentation (working papers) provides the record of basis for auditor’s report and evidence that audit was planned and performed in accordance with SAs. It must enable an "Experienced Auditor" (having no previous connection with the audit) to understand NTE of procedures, results/evidence obtained, and significant matters/judgments. A Completion Memorandum is a summary describing significant matters identified during the audit and how they were addressed.',
          exception: 'Under SA 230 read with SQC 1: (1) Administrative Assembly of final audit file must be completed within not more than 60 DAYS after the date of the auditor’s report; (2) Retention period is minimum 7 YEARS from the date of auditor’s report; (3) Audit documentation is the exclusive PROPERTY of the Auditor (disclosed to third parties only at auditor’s discretion without violating confidentiality).',
          example: 'After assembly of final audit file, the auditor shall NOT delete or discard audit documentation of any nature before the end of its 7-year retention period.'
        }
      ]
    },
    {
      chapterName: 'Completion and Review (SA 450, SA 560, SA 570, SA 580, SA 260 & SA 265)',
      keyPrinciples: [
        {
          title: 'SA 450 Misstatements, SA 560 Subsequent Events, SA 570 Going Concern, SA 580 Written Representations & SA 260/265 TCWG',
          description: 'SA 450 requires accumulating misstatements (other than clearly trivial) and requesting management correction. SA 560 divides Subsequent Events into 3 phases: (1) Events occurring between BS date and Auditor’s Report date (active audit procedures required), (2) Facts becoming known AFTER Auditor’s Report date but BEFORE FS are issued, and (3) Facts becoming known AFTER FS are issued (no obligation, unless management amends FS). SA 570 Going Concern: If Going Concern is appropriate but a Material Uncertainty exists, check disclosure — if adequately disclosed, express Unmodified Opinion + separate "Material Uncertainty Related to Going Concern" section; if NOT adequately disclosed, express Qualified or Adverse Opinion.',
          exception: 'Under SA 580, Written Representations are necessary audit evidence, but they DO NOT provide sufficient appropriate audit evidence on their own about any of the matters with which they deal. If management refuses to provide mandatory written representations on responsibilities, the auditor MUST DISCLAIM an opinion.',
          example: 'SA 260 governs two-way communication with Those Charged with Governance (TCWG); SA 265 mandates communicating Significant Deficiencies in Internal Control in writing on a timely basis to TCWG.'
        }
      ]
    },
    {
      chapterName: 'Audit Report (SA 700, SA 701, SA 705, SA 706, SA 710, Branch/Joint Audit & CARO 2020)',
      keyPrinciples: [
        {
          title: 'SA 700 Elements, SA 701 KAM, SA 705 Modified Opinions, SA 706 EoM/OM, SA 710 Comparatives, SA 299 Joint Audit & CARO 2020',
          description: 'SA 700 places "Opinion" section FIRST, followed immediately by "Basis for Opinion". SA 701 (Key Audit Matters — matters of most significance communicated to TCWG) is mandatory for Listed Entities (prohibited when Disclaimer of Opinion is expressed). SA 705 Modification Matrix: Material & Not Pervasive = Qualified Opinion; Material & Pervasive Misstatement = Adverse Opinion; Material & Pervasive Scope Limitation = Disclaimer of Opinion. SA 706 distinguishes Emphasis of Matter (matter presented/disclosed in FS) from Other Matter (matter NOT in FS, relevant to understanding audit/responsibilities/report). SA 710 covers Corresponding Figures vs Comparative Financial Statements. SA 299 states Joint Auditors are jointly & severally responsible for undivided work and common decisions, and individually responsible for divided work.',
          exception: 'CARO 2020 (21 Clauses) applies to every company including Foreign Companies EXCEPT: (1) Banking Co, (2) Insurance Co, (3) Sec 8 Co, (4) One Person Company (OPC), (5) Small Company, and (6) Private Company (not holding/subsidiary of public co) having Paid-up Capital + Reserves <= ₹1 Cr on BS date AND Total Borrowings <= ₹1 Cr at any point during FY AND Total Revenue <= ₹10 Cr during FY.',
          example: 'Under CARO 2020 Clause 3(i)(c), title deeds of all immovable properties (other than leased properties) not held in the name of the company must be reported in tabular format.'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'SA 705 Modified Audit Opinion Decision Matrix',
        headers: ['Nature of Matter Giving Rise to Modification', 'Material but NOT Pervasive', 'Material AND Pervasive'],
        rows: [
          ['Financial Statements are Materially Misstated (Evidence Obtained)', 'Qualified Opinion ("Except for...")', 'Adverse Opinion ("Do not give a true and fair view...")'],
          ['Inability to Obtain Sufficient Appropriate Audit Evidence (Scope Limitation)', 'Qualified Opinion ("Except for possible effects...")', 'Disclaimer of Opinion ("We do not express an opinion...")']
        ]
      }
    },
    {
      chapterName: 'Special Features of Audit of Different Type of Entities',
      keyPrinciples: [
        {
          title: 'Government Audit (C&AG Articles 148–151), Local Bodies, NGOs/Trusts, Partnership Firms, LLPs, Co-operative Societies, Hospitals, Hotels & Educational Institutions',
          description: 'Government Audit by C&AG covers Audit against Rules & Orders, Audit of Sanctions, Audit against Provision of Funds, Propriety Audit (wisdom, faithfulness, and economy of expenditure), and Performance Audit (Efficiency, Economy, Effectiveness — 3Es). Co-operative Societies Audit (Multi-State Co-op Societies Act, 2002 / State Acts): Registrar appoints auditor; shareholding of an individual member is restricted (generally max 20% or ₹1,000); 25% of net profits transferred to Reserve Fund; overdue debts classified from 6 months to 5 years and >5 years; bad debts certified by auditor.',
          exception: 'In Audit of Hospitals, Hotels, Cinema Halls, Clubs, and Educational Institutions, special focus lies on internal controls over cash collections, room/bed occupancy registers, concession/scholarship authorisations, corpus donations vs revenue grants, and consumable stock pilferage.',
          example: 'In LLP Audit, books are audited if Turnover > ₹40 Lakhs OR Partner Contribution > ₹25 Lakhs; auditor is appointed by Designated Partners at least 30 days prior to end of FY.'
        }
      ]
    },
    {
      chapterName: 'Audit of Banks',
      keyPrinciples: [
        {
          title: 'Bank Audit Approach, LFAR, Advances Verification, Income Recognition & NPA Classification/Provisioning Norms',
          description: 'Statutory Central & Branch Auditors of Nationalised/Private Banks are appointed with prior RBI approval and submit Long Form Audit Report (LFAR) by 30th June. Advances constitute the largest asset and are verified for Area of Operation, Creditworthiness, Sanctioning Authority, Drawing Power (DP = [Stock − Unpaid Creditors] × [1 − Margin %] + [Eligible Book Debts <=90 days] × [1 − Margin %]), and Security Perfection. Non-Performing Asset (NPA) triggers when interest/instalment remains overdue for > 90 DAYS (Out of Order for CC/OD if balance continuously exceeds DP/Limit for 90 days OR no credits/credits insufficient to cover interest debited for 90 days).',
          exception: 'Agricultural Advances NPA Rule: Short-Duration Crops (maturing <=1 year) become NPA if overdue for TWO crop seasons; Long-Duration Crops (maturing >1 year) become NPA if overdue for ONE crop season. NPA classification is BORROWER-WISE (if 1 account of a borrower turns NPA, all other credit facilities of that borrower turn NPA), except Central Government Guaranteed Advances (which turn NPA for provisioning only if CG repudiates guarantee when invoked, though income recognition stops on 90-day overdue).',
          example: 'NPA Provisioning Categories: Sub-Standard (NPA <= 12 months: 15% secured / 25% unsecured), Doubtful D1 (up to 1 yr in Doubtful: 25% secured + 100% unsecured), D2 (1 to 3 yrs: 40% secured + 100% unsecured), D3 (>3 yrs: 100% secured & unsecured), and Loss Assets (100%).'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'RBI Prudential Norms on Bank Asset Classification & Provisioning',
        headers: ['Asset Category', 'Tenure / Overdue Definition', 'Provisioning Rate (Secured Portion)', 'Provisioning Rate (Unsecured Portion)'],
        rows: [
          ['Standard Asset', 'Regular (Overdue <= 90 days)', '0.40% General (0.25% SME/Agri; 1.00% Commercial Real Estate)', 'Included in General Standard Provision'],
          ['Sub-Standard Asset', 'Remained NPA for a period <= 12 months', '15% of Total Outstanding', '25% (20% for Infrastructure Escrow)'],
          ['Doubtful Asset — D1', 'Remained in Doubtful category up to 1 year', '25% of Secured Portion', '100% of Unsecured Portion'],
          ['Doubtful Asset — D2', 'Remained in Doubtful category for > 1 year up to 3 years', '40% of Secured Portion', '100% of Unsecured Portion'],
          ['Doubtful Asset — D3 & Loss Asset', 'Doubtful > 3 years OR Identified as Loss Asset', '100%', '100%']
        ]
      }
    },
    {
      chapterName: 'Ethics and Terms of Audit Engagements (Professional Ethics, SA 210, SQC 1 & SA 220)',
      keyPrinciples: [
        {
          title: 'Five Fundamental Ethical Principles, Five Threats to Independence, SA 210 Engagement Terms & SQC 1 / SA 220 Quality Control',
          description: 'ICAI Code of Ethics (Principles-based approach) rests on 5 Fundamental Principles: (1) Integrity, (2) Objectivity, (3) Professional Competence and Due Care, (4) Confidentiality, and (5) Professional Behaviour. Five Threats to Independence: (1) Self-Interest Threat (financial interest, fee dependency), (2) Self-Review Threat (auditing FS prepared by auditor), (3) Advocacy Threat (promoting client shares/litigation), (4) Familiarity Threat (long association/close relative), and (5) Intimidation Threat (threat of replacement/litigation). SA 210 requires establishing Preconditions for an Audit (acceptable FRF + management acknowledgment of premises) and recording terms in an Audit Engagement Letter.',
          exception: 'Under SA 210, if management requests a change in terms of engagement to a lower level of assurance BEFORE completion without reasonable justification, the auditor shall NOT agree and shall withdraw if not permitted to continue original audit. Under SQC 1 / SA 220, Engagement Quality Control Review (EQCR) is mandatory for audits of all Listed Entities and must be completed ON OR BEFORE the date of the auditor’s report.',
          example: 'SQC 1 mandates rotation of the Engagement Partner on audits of Listed Entities after a predefined period (ordinarily not more than 7 years).'
        }
      ]
    },
  ],

  // =========================================================================
  // PAPER 6: FINANCIAL MANAGEMENT & STRATEGIC MANAGEMENT (50M + 50M)
  // =========================================================================
  FMSM: [
    {
      chapterName: 'Financial Management Function & Financial Analysis through Ratios',
      keyPrinciples: [
        {
          title: 'Profit vs Wealth Maximisation, Three Core Finance Decisions & Comprehensive Ratio Analysis (Liquidity, Leverage, Activity, Profitability, DuPont)',
          description: 'Wealth Maximisation (maximising Net Present Value of shareholders’ equity by factoring Time Value of Money and Risk) supersedes Profit Maximisation. Three core decisions: Investment (Capital Budgeting), Financing (Capital Structure), and Dividend Decision. Ratio Analysis groups into: (1) Liquidity (Current Ratio, Quick/Acid-Test Ratio, Cash/Absolute Liquidity Ratio, Net Working Capital), (2) Capital Structure/Coverage (Debt-Equity, Proprietary Ratio, Capital Gearing Ratio, Interest Coverage = EBIT/Interest, DSCR = [PAT + Dep + Interest] / [Interest + Principal Instalment]), (3) Activity/Turnover (Inventory, Debtors, Creditors, Fixed/Total Assets Turnover), and (4) Profitability/Market Ratios (GP, Operating Ratio, ROI/ROCE = EBIT/Capital Employed, ROE, EPS, P/E, PEG).',
          exception: 'Three-Factor DuPont Identity decomposes Return on Equity (ROE) into: Net Profit Margin (PAT / Sales) × Asset Turnover (Sales / Total Assets) × Equity Multiplier (Total Assets / Shareholders’ Equity).',
          example: 'Capital Gearing Ratio = (Preference Share Capital + Fixed Interest Long-Term Debt) / Equity Shareholders’ Funds.'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'ICAI Financial Ratio Analysis — High-Yield Formula & Benchmark Matrix',
        headers: ['Ratio Category', 'Key Ratios & Equations', 'Decision / Analytical Interpretation'],
        rows: [
          ['Liquidity Ratios', 'Current = CA / CL (2:1 ideal) | Quick = Quick Assets / CL (1:1 ideal; Quick Assets = CA − Inventory − Prepaid)', 'Measures short-term solvency and ability to honour current obligations'],
          ['Solvency & Coverage', 'Debt-Equity = Long-Term Debt / Shareholders’ Equity | DSCR = Cash Profit for Debt Service / (Interest + Principal)', 'Evaluates financial leverage risk and debt servicing safety cushion'],
          ['Activity / Efficiency', 'Inventory T/O = COGS / Avg Inventory | Debtors T/O = Credit Sales / Avg Debtors | Creditors T/O = Credit Purchases / Avg Creditors', 'Measures velocity of working capital conversion'],
          ['Profitability & DuPont', 'ROCE = EBIT / Capital Employed | ROE = Net Margin × Asset Turnover × Equity Multiplier', 'Isolates operating efficiency, asset utilization, and financial leverage drivers']
        ]
      }
    },
    {
      chapterName: 'Sources of Finance (Long-Term, Short-Term, Contemporary P2P/Crowdfunding, Lease & VC)',
      keyPrinciples: [
        {
          title: 'Long-Term Debt/Equity, Short-Term Instruments, Lease/Sale-and-Leaseback, Venture Capital & Contemporary Funding (P2P, Crowdfunding, Start-up)',
          description: 'Long-term sources include Equity Shares, Preference Shares, Retained Earnings, Debentures/Bonds (Masala Bonds, Zero Coupon, Callable/Puttable, Foreign Bonds — Yankee/Samurai/Bulldog, Eurobonds, GDRs/ADRs). Short-term sources include Trade Credit, Commercial Paper (CP — unsecured promissory note, 7 days to 1 year, minimum ₹5 Lakhs multiples), Treasury Bills, Certificates of Deposit, and Bank WC facilities. Contemporary sources include Peer-to-Peer (P2P) Lending (RBI NBFC-P2P regulated), Crowdfunding (Reward, Donation, Equity, Debt), Angel/Seed/Series Venture Capital, Lease Financing (Operating vs Finance Lease, Leveraged Lease, Cross-Border Lease, Sale & Leaseback), and Packing Credit (Pre-shipment & Post-shipment).',
          exception: 'In a Leveraged Lease, three parties participate: Lessor (Equity participant contributing 20%–40%), Lender (Loan participant providing 60%–80% non-recourse debt), and Lessee.',
          example: 'Bridge Finance is a temporary short-term loan raised from commercial banks to bridge the time gap before long-term public issue / term loan proceeds are realised.'
        }
      ]
    },
    {
      chapterName: 'Cost of Capital (Kd, Kp, Ke, WACC & Marginal Cost of Capital)',
      keyPrinciples: [
        {
          title: 'Component Costs (Kd, Kp, Ke, Kr), Book vs Market Value WACC (Ko) & Marginal Cost of Capital (WMCC)',
          description: 'Cost of Irredeemable Debt (Kd) = I(1 − t) / NP; Redeemable Debt approximation = [I(1 − t) + (RV − NP)/n] / [(RV + NP)/2] (or exact YTM IRR method). Cost of Preference Shares (Kp) has NO tax shield: [PD + (RV − NP)/n] / [(RV + NP)/2]. Cost of Equity (Ke) via Dividend Growth = (D1 / NP) + g [where g = b × r] or CAPM = Rf + β(Rm − Rf). Cost of Retained Earnings (Kr) = (D1 / P0) + g (adjusted for personal tax tp and brokerage f if specified). Weighted Average Cost of Capital (WACC) uses Book Value weights or Market Value weights.',
          exception: 'Under Market Value WACC, total Market Value of Equity (Number of Shares × Market Price per Share) intrinsically embeds both Equity Share Capital and Retained Earnings; if separate Market Value weights are required for Equity Capital and Retained Earnings, apportion total Market Value of Equity in the ratio of their Book Values.',
          example: 'Marginal Cost of Capital (WMCC) is the composite cost of raising an additional rupee of new capital, where breaking points occur as cheaper Retained Earnings are exhausted and external Equity with flotation cost is issued.'
        }
      ]
    },
    {
      chapterName: 'Capital Structure Decisions (Theories, EBIT-EPS Analysis & Over/Under Capitalisation)',
      keyPrinciples: [
        {
          title: 'Capital Structure Theories (NI, NOI, Traditional, MM with & without Tax, Pecking Order) & EBIT-EPS Indifference Point',
          description: 'Net Income (NI — Durand) Approach: Debt is cheaper than Equity, so increasing leverage lowers WACC (Ko) and maximises Value of Firm (V) at 100% debt. Net Operating Income (NOI — Durand) & Modigliani-Miller (MM 1958 Without Tax): Capital structure is IRRELEVANT; WACC remains constant and Ke rises linearly with Debt/Equity [Ke = Ko + (Ko − Kd)(D/E)]. MM 1963 With Corporate Tax: Value of Levered Firm (VL) = Value of Unlevered Firm (VU) + (Debt × Tax Rate t). Trade-Off Theory balances Interest Tax Shield against Financial Distress/Bankruptcy Costs. Pecking Order Theory (Myers & Majluf) ranks financing: (1) Internal Retained Earnings -> (2) Debt -> (3) External Equity.',
          exception: 'EBIT-EPS Indifference Point [(EBIT − I1)(1 − t) − PD1] / E1 = [(EBIT − I2)(1 − t) − PD2] / E2: If expected EBIT > Indifference EBIT, select the Debt-heavy plan (higher financial leverage); if expected EBIT < Indifference EBIT, select the Equity-heavy plan.',
          example: 'Financial Break-Even Point (where EPS = 0) = Interest + [Preference Dividend / (1 − t)]. Over-Capitalisation occurs when actual rate of earnings < fair return on capital employed (Book Value > Real Value of shares).'
        }
      ]
    },
    {
      chapterName: 'Leverages (Operating, Financial and Combined Leverages)',
      keyPrinciples: [
        {
          title: 'Degree of Operating Leverage (DOL), Financial Leverage (DFL), Combined Leverage (DCL) & Trading on Equity',
          description: 'Operating Leverage (DOL) = Contribution / EBIT = (% Change in EBIT) / (% Change in Sales) = 1 / Margin of Safety Ratio; measures Business Risk driven by Fixed Operating Costs. Financial Leverage (DFL) = EBIT / [EBT − PD/(1 − t)] = (% Change in EPS) / (% Change in EBIT); measures Financial Risk driven by Fixed Interest and Preference Dividend. Combined Leverage (DCL) = DOL × DFL = Contribution / [EBT − PD/(1 − t)] = (% Change in EPS) / (% Change in Sales).',
          exception: 'Favourable Financial Leverage (Trading on Equity) exists ONLY when Return on Investment (ROI = EBIT / Capital Employed) exceeds the pre-tax Cost of Debt (Interest Rate). Ideal corporate risk profile combines High DOL with Low DFL (or Low DOL with High DFL), avoiding High DOL + High DFL.',
          example: 'If Margin of Safety is 25% (0.25), then Degree of Operating Leverage (DOL) = 1 / 0.25 = 4.00.'
        }
      ]
    },
    {
      chapterName: 'Capital Investment Decisions (Payback, ARR, NPV, IRR, MIRR, PI, Capital Rationing & EAC)',
      keyPrinciples: [
        {
          title: 'NPV, IRR, MIRR, Profitability Index, Capital Rationing (Divisible vs Indivisible) & Equivalent Annual Cost (EAC)',
          description: 'Non-Discounted Methods: Payback Period and Accounting Rate of Return (ARR = Avg PAT / Avg or Initial Investment). Discounted Cash Flow Methods: Net Present Value (NPV = PV of Inflows − PV of Outflows at Cost of Capital k), Profitability Index (PI = PV of Inflows / Initial Outflow), Internal Rate of Return (IRR where NPV = 0), and Modified Internal Rate of Return (MIRR). MIRR overcomes IRR’s unrealistic reinvestment assumption and multiple-IRR problem by compounding all positive intermediate cash inflows to Terminal Year n at Cost of Capital (k) and finding the discount rate that equates PV of Outflows to Terminal Value.',
          exception: 'Capital Rationing (fixed budget constraint): If projects are DIVISIBLE, rank strictly by Profitability Index (PI) and accept fractional last project; if projects are INDIVISIBLE, select the feasible combination of whole projects that maximises aggregate absolute NPV. When comparing unequal-life mutually exclusive machines, compute Equivalent Annual Cost / NPV [EAC = NPV / PVIFA(k, n)].',
          example: 'Working Capital introduced at t=0 (or incrementally during project life) is treated as Cash Outflow and recovered 100% as Cash Inflow in the terminal year.'
        }
      ]
    },
    {
      chapterName: 'Dividend Decisions (Cash/Bonus/Split/Buyback, Walter, Gordon & MM Models)',
      keyPrinciples: [
        {
          title: 'Walter’s Model, Gordon’s Model, Modigliani-Miller (MM) Dividend Irrelevance, Linter’s Model & Traditional Graham-Dodd',
          description: 'Walter’s Relevance Model: P = [D + (r / Ke)(E − D)] / Ke. Optimal Payout under Walter: Growth Firm (r > Ke) = 0% Payout (100% retention); Declining Firm (r < Ke) = 100% Payout; Normal Firm (r = Ke) = Indifferent. Gordon’s Growth Model (Bird-in-the-Hand): P0 = E(1 − b) / (Ke − br) [where Ke > br]. Modigliani & Miller (MM 1961 Irrelevance Hypothesis): In a perfect capital market without taxes/transaction costs, Market Value of firm depends solely on earning power/investment policy, not dividend split: P0 = (D1 + P1) / (1 + Ke); New shares issued Δn = [I − (E − nD1)] / P1.',
          exception: 'Graham & Dodd Traditional Model weights dividends 4× higher than retained earnings: P = m × [D + E/3]. Linter’s Target Payout Adjustment Model: D1 = D0 + [(EPS × Target Payout Ratio − D0) × Adjustment Factor (Af)].',
          example: 'Stock Split divides par value into smaller denominations (increasing share count without changing Paid-up Share Capital or Reserves), whereas Bonus Issue capitalises Reserves into Share Capital without changing par value per share.'
        }
      ]
    },
    {
      chapterName: 'Management of Working Capital (Operating Cycle, Debtors/Factoring, Cash/Treasury & Payables)',
      keyPrinciples: [
        {
          title: 'Operating Cycle, Working Capital Estimation (Total vs Cash Cost), Receivables/Factoring (Recourse vs Non-Recourse), Baumol/Miller-Orr Cash Models & Tandon Committee',
          description: 'Net Operating Cycle = R (Raw Material Storage Days) + W (WIP Conversion Days) + F (Finished Goods Storage Days) + D (Debtors Collection Days) − C (Creditors Payment Deferral Days). Number of Operating Cycles in a year = 365 / Net Operating Cycle Days. Receivables Credit Policy evaluation compares Incremental Profit against Incremental Opportunity Cost of Funds blocked in Debtors (at Cash Cost or Total Cost) + Bad Debts + Credit Admin Cost. Factoring can be Recourse (client bears bad debt risk) or Non-Recourse (factor bears bad debt risk); Forfaiting is 100% non-recourse discounting of medium/long-term export receivables backed by bank aval/LC.',
          exception: 'Cash Management Models: (1) William Baumol’s EOQ Model (certain cash flows): Optimum Cash Conversion Size C = sqrt((2 × Annual Cash Requirement U × Transaction Cost P) / Opportunity Interest Rate S); (2) Miller-Orr Stochastic Model (uncertain daily cash flows): operates between Upper Control Limit (H), Return Point (R), and Lower Limit (L), where H − R = 2 × (R − L).',
          example: 'Tandon Committee Maximum Permissible Bank Finance (MPBF): Method I = 75% of (CA − CL); Method II = (75% of CA) − CL; Method III = [75% of (CA − Hard Core CA)] − CL.'
        }
      ]
    },
    {
      chapterName: 'Introduction to Strategic Management (Strategic Intent & Network/Corporate/Business/Functional Levels)',
      keyPrinciples: [
        {
          title: 'Proactive + Reactive Strategy, Strategic Intent (Vision, Mission, Goals, Objectives, Values) & Four Organisational Levels (Network, Corporate, Business, Functional)',
          description: 'Strategy is partly Proactive (deliberate planned initiatives) and partly Reactive (adaptive responses to unanticipated environmental shifts). Limitations of Strategic Management: Environment is highly complex/turbulent, time-consuming, costly, and difficult to predict competitor reactions. Strategic Intent Hierarchy: Vision (future aspiration — "Where we want to be"), Mission (present business scope, customers, technology — "Who we are and what we do"), Goals (open-ended attributes), Objectives (SMART time-bound targets), and Values/Ethics. Four Strategic Levels in Organisations: Corporate Level (CEO/Board), Business/SBU Level (Divisional Heads), Functional Level (Finance, Marketing, HR, R&D), and Network Level (Strategic Alliances, Consortiums, Joint Ventures across firms).',
          exception: 'A Mission Statement should focus on present customer needs and capabilities (never merely "to make a profit") and be specific to the organisation, whereas a Vision Statement is future-oriented and inspirational.',
          example: 'Network Level Strategy involves collaborative inter-firm relationships (e.g., Star Alliance in airlines or supplier-OEM ecosystems) to achieve shared competitive advantage.'
        }
      ]
    },
    {
      chapterName: 'Strategic Analysis: External Environment (PESTLE, Value Chain, PLC & Porter’s Five Forces)',
      keyPrinciples: [
        {
          title: 'Macro Environment (PESTLE), Industry Analysis (Value Chain, Product Life Cycle - PLC), Porter’s Five Forces & Strategic Groups',
          description: 'PESTLE Analysis scans Political, Economic, Socio-Cultural, Technological, Legal, and Environmental macro factors. Product Life Cycle (PLC) tracks 4 stages: Introduction (low sales, high R&D/promo), Growth (rising sales/profits, market expansion), Maturity (peak sales, intense price competition), and Decline (falling sales, cost pruning/harvesting). Porter’s Value Chain splits into 5 Primary Activities (Inbound Logistics, Operations, Outbound Logistics, Marketing & Sales, Service) and 4 Support Activities (Firm Infrastructure, HR Management, Technology Development, Procurement). Porter’s Five Forces determine industry profitability: (1) Threat of New Entrants, (2) Bargaining Power of Buyers, (3) Bargaining Power of Suppliers, (4) Threat of Substitute Products, and (5) Rivalry among Existing Competitors.',
          exception: 'Strategic Group Mapping plots rival firms within the same industry that follow similar strategies along two non-correlated competitive variables (e.g., Price/Quality vs Geographic Coverage). Key Success Factors (KSFs) are the 3–5 industry-specific competitive elements that determine market survival and profit.',
          example: 'Customer Analysis distinguishes between a Customer (who purchases/pays for the product) and a Consumer (who actually uses/consumes the product).'
        }
      ]
    },
    {
      chapterName: 'Strategic Analysis: Internal Environment (Mendelow’s Model, Strategic Drivers, SWOT & Porter’s Generic Strategies)',
      keyPrinciples: [
        {
          title: 'Mendelow’s Stakeholder Matrix, Strategic Drivers, VRIO Resources/Capabilities, SWOT/TOWS & Michael Porter’s Generic Strategies',
          description: 'Mendelow’s Power-Interest Matrix classifies Stakeholders into 4 quadrants: (1) High Power + High Interest = Key Players (Manage Closely), (2) High Power + Low Interest = Keep Satisfied, (3) Low Power + High Interest = Keep Informed, and (4) Low Power + Low Interest = Low Priority (Monitor with Minimum Effort). Strategic Drivers include Industry & Markets, Customers, Channels, Products & Services, and Competitive Advantage. Core Competence (C.K. Prahalad & Gary Hamel) requires satisfying 3 tests: access to wide variety of markets, significant contribution to perceived customer benefits, and difficult for competitors to imitate (VRIO: Valuable, Rare, Inimitable, Organised).',
          exception: 'Michael Porter’s 3 Generic Strategies: (1) Cost Leadership (broad market, lowest cost), (2) Differentiation (broad market, unique perceived value commands price premium), and (3) Focus Strategy (Narrow Niche — either Focused Cost Leadership or Focused Differentiation). Best-Cost Provider Strategy is a hybrid delivering upscale attributes at a lower cost than rivals.',
          example: 'SWOT/TOWS Matrix combines Internal Strengths/Weaknesses with External Opportunities/Threats into SO (Maxi-Maxi Aggressive), WO (Mini-Maxi Turnaround), ST (Maxi-Mini Diversification), and WT (Mini-Mini Defensive).'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'Mendelow’s Stakeholder Power-Interest Grid & Michael Porter’s Generic Strategies',
        headers: ['Framework / Quadrant', 'Defining Dimensions', 'Prescribed Strategic Action'],
        rows: [
          ['Mendelow: Key Players', 'High Power + High Interest (e.g., Major Shareholders, Key Regulators, CEO)', 'Manage Closely — full engagement and active consultation in strategy formulation'],
          ['Mendelow: Keep Satisfied', 'High Power + Low Interest (e.g., Institutional Lenders, Tax Authorities)', 'Keep Satisfied — meet expectations so they do not turn into hostile Key Players'],
          ['Mendelow: Keep Informed', 'Low Power + High Interest (e.g., Employees, Community Groups, NGOs)', 'Keep Informed — regular communication as they can influence powerful allies'],
          ['Porter: Cost Leadership vs Differentiation', 'Broad Market Target (Cost Efficiency vs Unique Value Proposition)', 'Avoid getting "Stuck in the Middle"; Best-Cost Provider blends quality with cost efficiency'],
          ['Porter: Focus (Cost / Differentiation)', 'Narrow Market Niche (Geographic or Buyer Segment)', 'Serve niche segment more effectively or efficiently than broad-market rivals']
        ]
      }
    },
    {
      chapterName: 'Strategic Choices (Concentric/Conglomerate, Integration, Turnaround & Ansoff/ADL/BCG/GE Matrices)',
      keyPrinciples: [
        {
          title: 'Corporate Strategies (Stability, Expansion/Diversification, Retrenchment) & Portfolio Matrices (Ansoff, ADL, BCG, GE Nine-Cell)',
          description: 'Corporate Expansion Choices: Intensification (Ansoff’s Matrix: Market Penetration, Market Development, Product Development, Diversification), Integration (Vertical — Forward/Backward; Horizontal — merging with competitors), Diversification (Concentric/Related — shared technology/marketing synergy vs Conglomerate/Unrelated — zero operational linkage), and Strategic Alliances. Retrenchment Choices: Turnaround (internal operational recovery from sickness), Divestiture/Divestment (selling/spinning off a division/SBU), and Liquidation (closing down entire business and selling assets as last resort).',
          exception: 'Portfolio Matrices: (1) BCG Growth-Share Matrix (2×2: Market Growth Rate vs Relative Market Share) -> Stars (Build/Hold), Cash Cows (Harvest/Hold), Question Marks (Build or Divest), Dogs (Divest); (2) ADL Matrix (Arthur D. Little — 4×5 matrix: 4 Industry Life Cycle stages [Embryonic, Growth, Mature, Ageing] × 5 Competitive Positions [Dominant, Strong, Favourable, Tenable, Weak]); (3) GE / McKinsey Nine-Cell Matrix (3×3: Industry Attractiveness [High/Med/Low] vs Business Unit Strength [Strong/Avg/Weak] -> Invest/Grow, Selectivity/Earnings, Harvest/Divest).',
          example: 'A shoe manufacturer acquiring a leather tannery is Backward Vertical Integration; acquiring a chain of retail footwear showrooms is Forward Vertical Integration; acquiring a rival shoe brand is Horizontal Integration.'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'ICAI Strategic Portfolio Matrices Comparison (Ansoff, BCG, ADL & GE Nine-Cell)',
        headers: ['Portfolio Tool', 'Matrix Dimensions (X & Y Axes)', 'Strategic Classifications & Prescriptions'],
        rows: [
          ['Ansoff’s Product-Market Matrix (2×2)', 'Products (Existing / New) × Markets (Existing / New)', 'Market Penetration, Market Development, Product Development, Diversification'],
          ['BCG Growth-Share Matrix (2×2)', 'Relative Market Share (High / Low) × Market Growth Rate (High / Low)', 'Stars (Invest), Cash Cows (Milk cash), Question Marks (Build/Divest), Dogs (Liquidate/Divest)'],
          ['ADL Matrix (5×4)', 'Competitive Position (Dominant, Strong, Favourable, Tenable, Weak) × Industry Life Cycle (Embryonic, Growth, Mature, Ageing)', 'Matches natural strategic posture to life-cycle stage and competitive strength'],
          ['GE / McKinsey Nine-Cell Matrix (3×3)', 'Business Unit Strength (Strong/Avg/Weak) × Industry Attractiveness (High/Med/Low)', 'Green Zone (3 cells: Invest/Grow), Yellow Diagonal (3 cells: Hold/Selectivity), Red Zone (3 cells: Harvest/Divest)']
        ]
      }
    },
    {
      chapterName: 'Strategy Implementation and Evaluation (Formulation-Implementation Matrix, Digital Transformation, Structure/Culture, Leadership & Control)',
      keyPrinciples: [
        {
          title: 'Formulation vs Implementation Matrix, Digital Transformation, Hard Structure/Soft Culture (McKinsey 7S), Strategic Leadership, Strategic Control & Performance Measures',
          description: 'Formulation vs Implementation Matrix (2×2): Sound Formulation + Excellent Implementation = Success; Sound Formulation + Poor Implementation = Trouble; Flawed Formulation + Excellent Implementation = Roulette; Flawed Formulation + Poor Implementation = Failure. Forward Linkage (Strategy dictates Structure) vs Backward Linkage (existing Structure constrains Strategy). Organisation Structures include Simple, Functional, Divisional (SBU), Matrix (dual authority breaking unity of command), Network/Virtual, and Hourglass Structure. McKinsey 7S Framework splits into 3 Hard Elements (Strategy, Structure, Systems) and 4 Soft Elements (Shared Values, Style, Staff, Skills).',
          exception: 'Four Types of Strategic Control (Schreyogg & Steinmann): (1) Premise Control (verifies whether planning assumptions/premises remain valid), (2) Implementation Control (Monitoring Strategic Thrusts & Milestone Reviews), (3) Strategic Surveillance (broad unfocused environmental scanning for surprises), and (4) Special Alert Control (immediate crisis reconsideration upon sudden shock events).',
          example: 'Strategic Performance Measures (SPM) include Key Performance Indicators (KPIs), Balanced Scorecard (Financial, Customer, Internal Business Processes, Learning & Growth), EVA, and Triple Bottom Line (People, Planet, Profit).'
        }
      ],
      visualBreakdown: {
        type: 'table',
        title: 'Strategic Control Types & McKinsey 7S Hard vs Soft Elements',
        headers: ['Control / 7S Category', 'Core Focus & Mechanism', 'ICAI Exam Trigger Keyword'],
        rows: [
          ['1. Premise Control', 'Directed check on whether environmental & industry assumptions made during planning still hold true', 'Inflation rate, interest rate, regulatory or demographic assumptions'],
          ['2. Implementation Control', 'Assesses whether overall strategy should be changed in light of unfolding results of incremental actions', 'Monitoring Strategic Thrusts (early projects) & Milestone Reviews (time/cost gates)'],
          ['3. Strategic Surveillance', 'Unfocused, broad-based observation of internal and external environment for unanticipated threats', 'General industry journals, conferences, competitor intelligence'],
          ['4. Special Alert Control', 'Rapid, thorough reconsideration of firm’s basic strategy triggered by a sudden, unexpected crisis event', 'Natural disaster, geopolitical war, sudden regulatory ban, hostile takeover'],
          ['McKinsey 7S Framework', '3 Hard S: Strategy, Structure, Systems | 4 Soft S: Shared Values (Central), Style, Staff, Skills', 'Hard elements are easily identified/changed by management; Soft elements are culture-bound']
        ]
      }
    },
  ],
};

export const INTERMEDIATE_FORM_ITEMS: Partial<Record<IntermediateSubjectId, FormulaItem[]>> = {
  AdvAcc: [
    {
      chapterName: 'Presentation & Disclosure Based AS (AS 1, AS 3, AS 17, AS 18, AS 20, AS 24, AS 25)',
      formulaName: 'Basic & Rights-Adjusted Earnings Per Share (AS 20)',
      equation: 'Basic EPS = Net Profit Attributable to Equity Holders / WANES  |  TERP = [(N_0 × P_cum) + (N_r × P_right)] / (N_0 + N_r)',
      context: 'Computes Basic EPS and adjusts pre-rights share count using the Paid-Part + Bonus-Element factor (P_cum / TERP).',
      variables: [
        { name: 'Net Profit Attributable', desc: 'PAT minus preference dividend (including arrears on cumulative preference shares)' },
        { name: 'WANES', desc: 'Weighted Average Number of Equity Shares outstanding during the period' },
        { name: 'TERP', desc: 'Theoretical Ex-Rights Fair Value per share immediately after rights issue' }
      ],
      workedExample: {
        scenario: '1,00,000 shares outstanding; 1:4 Rights Issue on 1 Oct @ ₹30 when cum-rights market price is ₹40. Net profit = ₹4,50,000.',
        calculation: 'TERP = (4 × 40 + 1 × 30) / 5 = ₹38.00\nRights Adjustment Factor = 40 / 38 = 1.0526\nWANES = (1,00,000 × 40/38 × 6/12) + (1,25,000 × 6/12) = 52,632 + 62,500 = 1,15,132 shares\nBasic EPS = ₹4,50,000 / 1,15,132 = ₹3.91',
        output: '₹3.91 per share'
      }
    },
    {
      chapterName: 'Accounting Standards Impacting P&L (AS 4, AS 5, AS 7, AS 9, AS 11, AS 12, AS 22)',
      formulaName: 'Percentage of Completion & Expected Loss Provision (AS 7)',
      equation: 'Stage of Completion (%) = [Cost Incurred to Date / (Cost Incurred to Date + Estimated Future Cost)] × 100',
      context: 'Determines cumulative contract revenue to recognise under AS 7 Construction Contracts; any expected overall loss is provided 100% immediately.',
      variables: [
        { name: 'Cost Incurred to Date', desc: 'Actual cumulative construction costs incurred up to reporting date (excluding unused materials at site)' },
        { name: 'Estimated Future Cost', desc: 'Additional cost estimated to complete the contract' }
      ]
    },
    {
      chapterName: 'Buy Back of Securities',
      formulaName: 'Sec 68 Three-Test Maximum Equity Buy-Back & Sec 69 CRR Transfer',
      equation: 'Max Buy-Back = Min(25% Outstanding Shares, 25% of [PUC + FR + SP] / BBP, Excess Equity above 50% of Debt / [BBP + NV])',
      context: 'Determines the maximum permissible number of equity shares that can be bought back while keeping post-buy-back Debt-Equity Ratio <= 2:1.',
      variables: [
        { name: 'PUC + FR + SP', desc: 'Paid-up Capital + Free Reserves + Securities Premium' },
        { name: 'BBP', desc: 'Buy-Back Offer Price per share' },
        { name: 'NV', desc: 'Nominal (Face) Value per equity share transferred to CRR u/s 69' }
      ],
      workedExample: {
        scenario: 'Equity Capital (₹10) = ₹100L, Free Reserves + SP = ₹200L, Total Debt = ₹420L, Buy-Back Price = ₹30/share.',
        calculation: '1) Shares Test = 25% of 10L = 2,50,000 shares\n2) Resources Test = 25% of ₹300L / ₹30 = ₹75L / ₹30 = 2,50,000 shares\n3) Debt-Equity Test: Min Post-Buy-Back Equity = ₹420L / 2 = ₹210L -> Max Equity Reduction = ₹300L − ₹210L = ₹90L\nMax Shares (Debt-Equity) = ₹90,00,000 / (₹30 + ₹10 CRR) = 2,25,000 shares',
        output: '2,25,000 Shares (Lowest of the 3 Tests)'
      }
    },
    {
      chapterName: 'Consolidated Financial Statements (AS 21, AS 23 & AS 27)',
      formulaName: 'Cost of Control (Goodwill / Capital Reserve) & Minority Interest (AS 21)',
      equation: 'Goodwill / (Capital Reserve) = Cost of Investment − Parent% × [Sub Share Capital + Pre-Acquisition Reserves & Profits]',
      context: 'Computes Goodwill or Capital Reserve on acquisition of a single subsidiary under AS 21.',
      variables: [
        { name: 'Cost of Investment', desc: 'Purchase price paid by Holding Co (less any pre-acquisition dividend received)' },
        { name: 'Pre-Acquisition Reserves', desc: 'Subsidiary Reserves & P&L existing on the date of acquisition (adjusted for asset revaluation)' }
      ]
    }
  ],
  Tax: [
    {
      chapterName: 'Heads of Income: Profits and Gains of Business or Profession (PGBP)',
      formulaName: 'Working Partner Remuneration Ceiling u/s 40(b)(v) (Amended by Finance (No. 2) Act, 2024)',
      equation: 'Max Remuneration = [Higher of ₹3,00,000 or 90% of first ₹6,00,000 Book Profit] + [60% of Balance Book Profit > ₹6,00,000]',
      context: 'Computes maximum deductible remuneration to working partners authorized by the Partnership Deed.',
      variables: [
        { name: 'Book Profit', desc: 'Net PGBP profit before partner remuneration (after deducting allowable partner interest <= 12% p.a. and current depreciation)' }
      ],
      workedExample: {
        scenario: 'Partnership firm reports Book Profit of ₹10,00,000 for AY 2025-26 / 2026-27.',
        calculation: 'On first ₹6,00,000 @ 90% (or ₹3,00,000) = ₹5,40,000\nOn balance ₹4,00,000 @ 60% = ₹2,40,000\nTotal Permissible Remuneration = ₹5,40,000 + ₹2,40,000 = ₹7,80,000',
        output: '₹7,80,000'
      }
    },
    {
      chapterName: 'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
      formulaName: 'Sec 87A Marginal Relief under Default Regime Sec 115BAC(1A)',
      equation: 'Net Tax Payable (before 4% Cess) = Min(Computed Slab Tax, Total Income − ₹7,00,000)',
      context: 'Grants marginal relief to Resident Individuals under Sec 115BAC(1A) whose Total Income marginally exceeds ₹7,00,000 (up to ₹7,27,770).',
      variables: [
        { name: 'Computed Slab Tax', desc: 'Tax calculated at 115BAC(1A) slab rates (₹20,000 on first ₹7L + 10% on excess above ₹7L)' }
      ],
      workedExample: {
        scenario: 'Resident individual has Total Income of ₹7,15,000 under Sec 115BAC(1A).',
        calculation: 'Slab Tax = ₹20,000 (on ₹3L–₹7L @ 5%) + ₹1,500 (10% on ₹15,000) = ₹21,500\nExcess Income above ₹7,00,000 = ₹15,000\nMarginal Relief = ₹21,500 − ₹15,000 = ₹6,500\nTax + 4% Cess = ₹15,000 × 1.04 = ₹15,600',
        output: '₹15,600 (Marginal Relief ₹6,500)'
      }
    }
  ],
  Cost: [
    {
      chapterName: 'Material Cost (Procurement, GeM/ERP Digital Costing, EOQ, Inventory Control & Losses)',
      formulaName: 'Economic Order Quantity (EOQ) & Stock Control Levels',
      equation: 'EOQ = sqrt((2 × A × O) / C)  |  ROL = Max Usage × Max Lead Time  |  Max Level = ROL + ROQ − (Min Usage × Min Lead Time)',
      context: 'Optimises order lot size and sets inventory buffer boundaries to prevent stockouts and overstocking.',
      variables: [
        { name: 'A', desc: 'Annual consumption of raw material in units' },
        { name: 'O', desc: 'Cost of placing and receiving one purchase order' },
        { name: 'C', desc: 'Annual carrying/storage & interest cost per unit per annum' }
      ],
      workedExample: {
        scenario: 'A = 10,000 units, O = ₹200/order, C = ₹4/unit/yr.',
        calculation: 'EOQ = sqrt((2 × 10,000 × 200) / 4) = sqrt(1,000,000) = 1,000 Units',
        output: '1,000 Units'
      }
    },
    {
      chapterName: 'Employee Cost (Attendance/Payroll, Turnover & Halsey/Rowan Incentive Schemes)',
      formulaName: 'Halsey (50%) vs Rowan Incentive Bonus Plans',
      equation: 'Halsey Total Wages = (AH × R) + 0.50 × (SH − AH) × R  |  Rowan Total Wages = (AH × R) + [(SH − AH) / SH] × AH × R',
      context: 'Calculates total worker earnings and effective hourly rate based on time saved against standard time allowed.',
      variables: [
        { name: 'SH', desc: 'Standard Time Allowed for actual output' },
        { name: 'AH', desc: 'Actual Time Taken (Hours worked)' },
        { name: 'R', desc: 'Guaranteed Time Wage Rate per hour' }
      ]
    },
    {
      chapterName: 'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
      formulaName: 'Material, Labour & Fixed Overhead Variances',
      equation: 'MPV = (SP − AP) × AQ  |  MUV = (SQ − AQ) × SP  |  LEV = (SH − AH_worked) × SR  |  FO Volume = Absorbed FO − Budgeted FO',
      context: 'Decomposes cost deviations into price/rate, efficiency, mix, yield, and capacity/volume components.',
      variables: [
        { name: 'SQ, SH', desc: 'Standard Quantity / Standard Hours allowed for ACTUAL output produced' },
        { name: 'AQ, AH_worked', desc: 'Actual Quantity consumed / Actual Productive Hours worked (excluding abnormal idle time)' }
      ]
    },
    {
      chapterName: 'Marginal Costing (CVP Analysis, BEP, Margin of Safety & Short-Term Decisions)',
      formulaName: 'P/V Ratio, Break-Even Point (BEP) & Margin of Safety (MOS)',
      equation: 'P/V Ratio = (Contribution / Sales) × 100  |  BEP (₹) = Fixed Cost / P/V Ratio  |  MOS (₹) = Profit / P/V Ratio',
      context: 'Evaluates Cost-Volume-Profit sensitivity, zero-profit sales threshold, and operating revenue buffer.',
      variables: [
        { name: 'Contribution', desc: 'Sales − Variable Cost = Fixed Cost + Profit' }
      ]
    }
  ],
  FMSM: [
    {
      chapterName: 'Cost of Capital (Kd, Kp, Ke, WACC & Marginal Cost of Capital)',
      formulaName: 'Post-Tax Cost of Redeemable Debt (Kd) & CAPM Cost of Equity (Ke)',
      equation: 'Kd = [I(1 − t) + (RV − NP) / n] / [(RV + NP) / 2]  |  Ke = Rf + β × (Rm − Rf)',
      context: 'Computes component costs of debt and equity for Weighted Average Cost of Capital (WACC).',
      variables: [
        { name: 'I, t', desc: 'Annual coupon interest and corporate tax rate' },
        { name: 'RV, NP, n', desc: 'Redemption value, Net proceeds (Issue price − flotation cost), and years to maturity' },
        { name: 'Rf, β, Rm', desc: 'Risk-free rate, Systematic risk Beta, and Expected Market Return' }
      ]
    },
    {
      chapterName: 'Capital Structure Decisions (Theories, EBIT-EPS Analysis & Over/Under Capitalisation)',
      formulaName: 'EBIT-EPS Indifference Point & Financial Break-Even Point',
      equation: '[(EBIT − I_1)(1 − t) − PD_1] / E_1 = [(EBIT − I_2)(1 − t) − PD_2] / E_2  |  Financial BEP = I + [PD / (1 − t)]',
      context: 'Determines the exact EBIT level where two alternative financing plans yield identical Earnings Per Share (EPS).',
      variables: [
        { name: 'I_1, I_2', desc: 'Annual debt interest under Financing Plan 1 and Plan 2' },
        { name: 'PD_1, PD_2', desc: 'Preference dividend under Financing Plan 1 and Plan 2' },
        { name: 'E_1, E_2', desc: 'Number of outstanding equity shares under Plan 1 and Plan 2' }
      ]
    },
    {
      chapterName: 'Leverages (Operating, Financial and Combined Leverages)',
      formulaName: 'Operating (DOL), Financial (DFL) & Combined Leverage (DCL)',
      equation: 'DOL = Contribution / EBIT  |  DFL = EBIT / [EBT − PD / (1 − t)]  |  DCL = DOL × DFL = Contribution / [EBT − PD / (1 − t)]',
      context: 'Quantifies operating and financial risk multipliers linking Sales changes to EBIT and EPS changes.',
      variables: [
        { name: 'PD', desc: 'Annual Preference Dividend (grossed up by 1 − t because preference dividend is not tax-deductible)' }
      ]
    },
    {
      chapterName: 'Capital Investment Decisions (Payback, ARR, NPV, IRR, MIRR, PI, Capital Rationing & EAC)',
      formulaName: 'Modified Internal Rate of Return (MIRR) & Equivalent Annual Cost (EAC)',
      equation: 'PV of Outflows = Terminal Value of Inflows (compounded @ WACC) / (1 + MIRR)^n  |  EAC = NPV of Costs / PVIFA(k, n)',
      context: 'Evaluates capital projects assuming realistic reinvestment at WACC (MIRR) and compares unequal-life assets (EAC).',
      variables: [
        { name: 'Terminal Value', desc: 'Sum of each year’s cash inflow compounded forward to year n at Cost of Capital (WACC)' },
        { name: 'PVIFA(k, n)', desc: 'Present Value Interest Factor of Annuity at discount rate k for n years' }
      ]
    },
    {
      chapterName: 'Dividend Decisions (Cash/Bonus/Split/Buyback, Walter, Gordon & MM Models)',
      formulaName: 'Walter’s Model, Gordon’s Growth Model & MM Irrelevance Valuation',
      equation: 'Walter P = [D + (r / Ke)(E − D)] / Ke  |  Gordon P_0 = E(1 − b) / (Ke − br)  |  MM P_0 = (D_1 + P_1) / (1 + Ke)',
      context: 'Models equity share price under dividend relevance (Walter & Gordon) and dividend irrelevance (Modigliani-Miller).',
      variables: [
        { name: 'D, E, b', desc: 'Dividend per share, Earnings per share, and Retention ratio (b = 1 − Payout ratio)' },
        { name: 'r, Ke', desc: 'Internal return on equity reinvestment (r) and Cost of Equity / Capitalisation rate (Ke)' }
      ]
    },
    {
      chapterName: 'Management of Working Capital (Operating Cycle, Debtors/Factoring, Cash/Treasury & Payables)',
      formulaName: 'Net Operating Cash Cycle & Baumol Optimum Cash Balance',
      equation: 'Operating Cycle = R + W + F + D − C  |  Baumol Optimum Cash (C*) = sqrt((2 × U × P) / S)',
      context: 'Determines working capital cycle duration in days and optimal cash conversion lot size.',
      variables: [
        { name: 'R, W, F, D, C', desc: 'RM holding days, WIP days, FG days, Debtors collection days, and Creditors deferral days' },
        { name: 'U, P, S', desc: 'Annual cash disbursement demand (U), Fixed cost per securities transaction (P), and Interest rate p.a. (S)' }
      ]
    }
  ]
};

export const INTERMEDIATE_STATUTORY_SECTIONS: Record<string, StatutorySection[]> = {
  AdvAcc: [
    {
      number: 'AS 1, AS 2, AS 3, AS 4 & AS 5',
      heading: 'Foundational Presentation, Inventory, Cash Flow & Prior Period / Event Standards',
      purpose: 'AS 1 (Accounting Policies Disclosure), AS 2 (Valuation of Inventories at lower of Cost or NRV), AS 3 (Cash Flow Statements — Operating, Investing, Financing), AS 4 (Contingencies and Events Occurring After Balance Sheet Date), and AS 5 (Net Profit/Loss for the Period, Prior Period Items and Changes in Accounting Policies).'
    },
    {
      number: 'AS 7, AS 9, AS 10, AS 11 & AS 12',
      heading: 'Construction, Revenue, PPE, Foreign Exchange & Government Grants',
      purpose: 'AS 7 (Construction Contracts — Percentage of Completion), AS 9 (Revenue Recognition — Sale of Goods, Rendering Services, Interest/Royalty/Dividends), AS 10 (Property, Plant and Equipment), AS 11 (Effects of Changes in Foreign Exchange Rates — Monetary/Non-Monetary & Integral/Non-Integral Operations), and AS 12 (Accounting for Government Grants).'
    },
    {
      number: 'AS 13, AS 14, AS 15, AS 16, AS 17 & AS 18',
      heading: 'Investments, Amalgamations, Employee Benefits, Borrowing Costs, Segments & Related Parties',
      purpose: 'AS 13 (Accounting for Investments), AS 14 (Accounting for Amalgamations — Merger vs Purchase Method), AS 15 (Employee Benefits — Defined Contribution & Defined Benefit PUC), AS 16 (Borrowing Costs on Qualifying Assets), AS 17 (Segment Reporting — 10% threshold & 75% external revenue rule), and AS 18 (Related Party Disclosures).'
    },
    {
      number: 'AS 19, AS 20, AS 21, AS 22, AS 23 & AS 24',
      heading: 'Leases, EPS, Consolidated FS (Subsidiary/Associate), Deferred Tax & Discontinuing Operations',
      purpose: 'AS 19 (Leases — Finance vs Operating), AS 20 (Earnings Per Share — Basic & Diluted), AS 21 (Consolidated Financial Statements of Single Subsidiaries), AS 22 (Accounting for Taxes on Income — Timing vs Permanent Differences), AS 23 (Investment in Associates in CFS — Equity Method), and AS 24 (Discontinuing Operations).'
    },
    {
      number: 'AS 25, AS 26, AS 27, AS 28 & AS 29',
      heading: 'Interim Reporting, Intangibles, Joint Ventures, Impairment & Provisions',
      purpose: 'AS 25 (Interim Financial Reporting), AS 26 (Intangible Assets — Research expensed, Development capitalised, <=10 yr amortisation), AS 27 (Financial Reporting of Interests in Joint Ventures — Proportionate Consolidation), AS 28 (Impairment of Assets — Recoverable Amount = Higher of NSP or VIU), and AS 29 (Provisions, Contingent Liabilities & Contingent Assets).'
    },
    {
      number: 'Schedule III (Div I) & Sec 61–69 Companies Act, 2013',
      heading: 'Company Financial Statements, Buy-Back of Securities & Internal Reconstruction',
      purpose: 'Governs Division I Balance Sheet and Statement of Profit & Loss format, Sec 68 Buy-Back 3-test ceiling, Sec 69 CRR transfer, and Sec 61/66 Alteration & Reduction of Share Capital.'
    }
  ],
  CorpLaw: [
    {
      number: 'Sec 2, Sec 3, Sec 8, Sec 13 & Sec 14',
      heading: 'Preliminary Definitions, OPC, Charitable Companies & MOA/AOA Alteration',
      purpose: 'Defines Private (2(68)), Public (2(71)), Small (2(85) — PUC <=₹4Cr & T/O <=₹40Cr), Subsidiary (2(87)), Associate (2(6)), Foreign Co (2(42)); regulates OPC (120-day residency), Sec 8 License, and MOA/AOA alterations.'
    },
    {
      number: 'Sec 26, 31, 32, 34, 35, 39, 40 & 42',
      heading: 'Prospectus, Shelf/Red Herring Prospectus, Civil/Criminal Liability & Private Placement',
      purpose: 'Governs 90-day prospectus validity, 1-yr Shelf Prospectus, 3-day Red Herring filing, 30-day minimum subscription, underwriting commission (5% shares / 2.5% debentures), and 200-person Private Placement limit.'
    },
    {
      number: 'Sec 43, 52, 53, 54, 55, 62, 63, 68 & 71',
      heading: 'Share Capital (DVR, Sweat Equity, Preference, Rights, Bonus, Buy-Back) & Debentures',
      purpose: 'Regulates DVR (<=74%), Sweat Equity (15%/₹5Cr annual, 25% overall, 3-yr lock-in), 20/30-yr Preference Redemption, Rights/Bonus shares, Sec 68 Buy-Back, and Sec 71 Debentures (10% DRR for unlisted cos).'
    },
    {
      number: 'Sec 73–76 & Sec 77–87',
      heading: 'Acceptance of Deposits & Registration / Satisfaction of Charges',
      purpose: 'Regulates Member Deposits (35%) and Eligible Public Co Deposits (Net Worth >=₹100Cr or T/O >=₹500Cr; 20% DRR by 30th April), plus 30/60/120-day Charge Registration (CHG-1) and 30/300-day Satisfaction (CHG-4).'
    },
    {
      number: 'Sec 92, 96, 100–118 & Sec 123–127',
      heading: 'Management & Administration (AGM/EGM, Quorum, Proxy, Resolutions) & Dividend',
      purpose: 'Prescribes MGT-7 (60 days), AGM (6m/15m), 21 clear days notice, Quorum (2 Pvt; 5/15/30 Public), Proxy (MGT-11, max 50 members & 10% voting), Dividend out of Reserves (Rule 3), and 5/30/37-day Unpaid Dividend & 7-yr IEPF transfer.'
    },
    {
      number: 'Sec 128–138, Sec 139–148 & Sec 379–393',
      heading: 'Accounts of Companies (CSR, Internal Audit), Audit & Auditors, and Foreign Companies',
      purpose: 'Covers 8-yr Books + Audit Trail, Sec 135 CSR (NW >=₹500Cr / T/O >=₹1000Cr / NP >=₹5Cr -> 2% spend), Sec 138 Internal Audit, Sec 139 Auditor Rotation (5/10 yrs), Sec 141 Disqualifications, Sec 143(12) Fraud Reporting (>=₹1Cr ADT-4), and Foreign Companies (FC-1 to FC-4).'
    },
    {
      number: 'LLP Act 2008, General Clauses Act 1897, Interpretation & FEMA 1999',
      heading: 'Allied Corporate & Other Laws (Part I LLP + Part II 30 Marks)',
      purpose: 'LLP Act (Sec 7 Designated Partners, Sec 2(1)(ta) Small LLP, Form 8 & Form 11); General Clauses Act (Sec 3 Definitions, Sec 5–13, Sec 26 Double Jeopardy, Sec 27 Service by Post); Rules of Statutory Interpretation; and FEMA 1999 (Sec 2(v) Residency, Sec 5 Current Account Schedules I/II/III, LRS USD 2,50,000, Sec 6 Capital Account).'
    }
  ],
  Tax: [
    {
      number: 'Sec 4, 5, 6, 9 & 10(1) (Income-tax Act, 1961)',
      heading: 'Basis of Charge, Residential Status (ROR/RNOR/NR), Deemed Income & Agricultural Income',
      purpose: 'Establishes 182-day / 60+365 day residency tests, 120-day ₹15L visit rule, Sec 6(1A) Deemed Resident RNOR, global vs Indian scope of income u/s 5, and Rule 7/7A/7B/8 agro-business split.'
    },
    {
      number: 'Sec 15–17, Sec 22–27 & Sec 28–44ADA (Income-tax Act, 1961)',
      heading: 'Salaries, Income from House Property & Profits and Gains of Business or Profession (PGBP)',
      purpose: 'Covers Salary allowances/perquisites & ₹75k/₹50k Std Deduction; HP GAV/NAV, 30% Std Deduction & Sec 24(b) Interest; and PGBP Depreciation (Sec 32), Sec 40(a)(ia) 30% TDS disallowance, Sec 40A(3) ₹10k cash cap, Sec 40(b) revised ₹6L/90% partner remuneration, Sec 43B(h) MSE 15/45-day payment, and 44AD/44ADA/44AE presumptive schemes.'
    },
    {
      number: 'Sec 45–55A, Sec 56–59, Sec 60–64 & Sec 70–80 (Income-tax Act, 1961)',
      heading: 'Capital Gains (Post-23.07.2024 Regime), Other Sources, Clubbing & Set-Off of Losses',
      purpose: 'Governs 12m/24m holding periods, STCG 111A @ 20%, LTCG 112A @ 12.5% (>₹1.25L), LTCG 112 @ 12.5% without indexation, Sec 50C (110% SDV), Sec 54/54EC/54F exemptions, Sec 56(2)(x) ₹50k gift/SDV rules, Sec 64 Clubbing, and Sec 70–80 Set-Off & Carry Forward.'
    },
    {
      number: 'Sec 80C–80U, Sec 115BAC(1A), Sec 139 & Sec 192–206C (Income-tax Act, 1961)',
      heading: 'Chapter VI-A Deductions, Default Regime 115BAC(1A), Return Filing & TDS/TCS/Advance Tax',
      purpose: 'Covers Chapter VI-A (80CCD(2) 14% NPS, 80JJAA, 80C, 80D, etc.), Sec 115BAC(1A) slabs & Sec 87A ₹25k rebate up to ₹7L, ITR-U u/s 139(8A), Advance Tax instalments, and updated 2% TDS rates u/s 194D/194G/194H/194-IB/194M.'
    },
    {
      number: 'Sec 7, 8, 9, 10 & 11 (CGST Act) & Sec 5, 10, 12 (IGST Act)',
      heading: 'GST Scope of Supply, Composite/Mixed Supply, Reverse Charge, Composition & Place of Supply',
      purpose: 'Covers Sec 7 Supply + Schedules I/II/III, Sec 8 Composite/Mixed Supply, Sec 9(3) RCM (incl. unregistered commercial renting to registered person), Sec 10 Composition (₹1.5Cr/₹75L & ₹50L u/s 10(2A)), and IGST Place of Supply.'
    },
    {
      number: 'Sec 12–15, Sec 16–18, Sec 22–30, Sec 31–41 & Sec 49–50 (CGST Act)',
      heading: 'Time & Value of Supply, ITC & Blocked Credits, Registration, E-Invoice/E-Way Bill, Accounts, Returns & Payment',
      purpose: 'Covers TOS (Sec 12/13), Transaction Value (Sec 15), ITC 6 conditions + 180-day payment + Sec 17(5) Blocked Credits, Registration (₹10L/20L/40L & Sec 24), E-Invoicing (₹5Cr), E-Way Bill (₹50k & 200km/day), 72-month Books (Sec 36), GSTR-1/3B/QRMP, and Sec 49/50 ITC Set-Off & 18% Net Cash Interest.'
    }
  ],
  AuditInter: [
    {
      number: 'SA 200, SA 210, SA 220, SA 230 & SQC 1',
      heading: 'Overall Objectives, Engagement Terms, Quality Control & Audit Documentation',
      purpose: 'SA 200 (Reasonable Assurance, Professional Skepticism, Inherent Limitations), SA 210 (Agreeing Terms of Engagement & Preconditions), SQC 1 & SA 220 (Quality Control, EQCR, 7-yr Partner Rotation), and SA 230 (Audit Documentation — 60-day assembly & 7-yr retention).'
    },
    {
      number: 'SA 240, SA 250, SA 260, SA 265 & SA 299',
      heading: 'Fraud, Laws & Regulations, Communication with TCWG, Control Deficiencies & Joint Audit',
      purpose: 'SA 240 (Auditor Responsibilities Relating to Fraud), SA 250 (Consideration of Laws & Regulations), SA 260 (Communication with TCWG), SA 265 (Communicating Significant Deficiencies in Internal Control), and SA 299 (Joint Audit of Financial Statements).'
    },
    {
      number: 'SA 300, SA 315, SA 320, SA 330 & SA 450',
      heading: 'Audit Strategy & Planning, Risk Assessment (RMM), Materiality, Responses & Misstatements',
      purpose: 'SA 300 (Planning an Audit of FS), SA 315 (Identifying & Assessing RMM Through Understanding Entity & Its Environment incl. 5 Internal Control Components & IT Controls), SA 320 (Materiality & Performance Materiality), SA 330 (Auditor’s Responses to Assessed Risks), and SA 450 (Evaluation of Misstatements).'
    },
    {
      number: 'SA 500, SA 501, SA 505, SA 510, SA 520, SA 530, SA 550, SA 560, SA 570, SA 580 & SA 610',
      heading: 'Audit Evidence Series, Sampling, Subsequent Events, Going Concern, Written Representations & Internal Auditors',
      purpose: 'SA 500 (Audit Evidence), SA 501 (Inventory, Litigation/Claims, Segment Info), SA 505 (External Confirmations), SA 510 (Initial Audit Engagements — Opening Balances), SA 520 (Analytical Procedures), SA 530 (Audit Sampling), SA 550 (Related Parties), SA 560 (Subsequent Events), SA 570 (Going Concern), SA 580 (Written Representations), and SA 610 (Using Work of Internal Auditors).'
    },
    {
      number: 'SA 700, SA 701, SA 705, SA 706, SA 710 & CARO 2020',
      heading: 'Audit Report, Key Audit Matters, Modified Opinions, EoM/OM, Comparatives & CARO 2020',
      purpose: 'SA 700 (Forming an Opinion & Reporting), SA 701 (Key Audit Matters for Listed Entities), SA 705 (Modifications — Qualified, Adverse, Disclaimer), SA 706 (Emphasis of Matter & Other Matter Paragraphs), SA 710 (Comparative Information), and CARO 2020 (Applicability & 21 Reporting Clauses).'
    }
  ]
};

export const INTERMEDIATE_LIMITS_RATES: Record<string, LimitRateItem[]> = {
  AdvAcc: [
    { item: 'SMC Classification — Turnover & Borrowings Ceiling (Preceding FY)', limitRate: 'Turnover <= ₹250 Cr AND Borrowings <= ₹50 Cr', remarks: 'Must also be an unlisted company and not a bank, financial institution, insurance company, or holding/subsidiary of a Non-SMC.' },
    { item: 'Non-Corporate Entities Level I, II, III & IV Thresholds (w.e.f. 1.4.2024)', limitRate: 'L-I: >₹250Cr/50Cr | L-II: >₹50Cr/10Cr | L-III: >₹10Cr/2Cr', remarks: 'Stepping down to a lower level requires satisfying the lower turnover and borrowing thresholds for 2 consecutive accounting periods.' },
    { item: 'AS 17 Segment Reporting — Reportable Segment Quantitative Threshold', limitRate: '>= 10% of Revenue, Result, or Assets (75% External Rule)', remarks: 'Additional segments must be identified until external revenue of reportable segments reaches at least 75% of total enterprise revenue.' },
    { item: 'AS 26 Intangible Assets — Presumed Maximum Useful Life', limitRate: '10 Years (Rebuttable Presumption)', remarks: 'Internally generated goodwill, brands, mastheads, and publishing titles can never be recognised as intangible assets.' },
    { item: 'Sec 68 Buy-Back of Equity Shares — Three Statutory Ceilings', limitRate: '<= 25% Shares | <= 25% (PUC+FR+SP) | Post D/E <= 2:1', remarks: 'Up to 10% of Paid-up Equity + Free Reserves permitted via Board Resolution; >10% up to 25% requires Special Resolution.' }
  ],
  CorpLaw: [
    { item: 'Sec 2(85) Small Company — Paid-Up Capital & Turnover Ceiling', limitRate: 'Paid-Up Capital <= ₹4 Cr AND Turnover <= ₹40 Cr', remarks: 'Excludes Public Companies, Holding/Subsidiary Companies, Section 8 Companies, and Special Act Companies.' },
    { item: 'Sec 42 Private Placement — Maximum Offer Limit & Allotment Window', limitRate: 'Max 200 Persons / FY | Allot within 60 Days', remarks: 'Excludes QIBs and ESOPs. Failure to allot within 60 days requires refund within 15 days + 12% p.a. interest from 61st day.' },
    { item: 'Sec 54 Sweat Equity Shares — Annual & Overall Issuance Cap', limitRate: '<= 15% of PUC or ₹5 Cr p.a. | Max 25% Overall (50% Startup)', remarks: 'Mandatory lock-in period of 3 years from date of allotment.' },
    { item: 'Sec 73 & 76 Acceptance of Deposits — Ceiling & DRR Maintenance', limitRate: '35% Members (Pvt/Non-Elig.) | 10% + 25% (Eligible Public Co)', remarks: 'Eligible Public Co requires Net Worth >= ₹100 Cr OR Turnover >= ₹500 Cr. Mandatory 20% Deposit Repayment Reserve by 30th April.' },
    { item: 'Sec 77 Registration of Charge — Normal & Extended Timelines', limitRate: '30 Days + 30 Days (Addl Fee) + 60 Days (Ad-Valorem) = 120 Days', remarks: 'Satisfaction of charge intimated in CHG-4 within 30 days (extendable up to 300 days).' },
    { item: 'Sec 103 Quorum for General Meetings (Public vs Private Company)', limitRate: 'Pvt: 2 | Public: 5 (<=1k), 15 (1001–5k), 30 (>5k Members)', remarks: 'Members must be personally present; proxies are excluded from quorum.' },
    { item: 'Sec 123(1) Rule 3 Dividend out of Free Reserves — Four Limits', limitRate: 'Rate <= 3-Yr Avg | Draw <= 10% (PUC+FR) | Balance >= 15% PUC', remarks: 'Amount drawn must first be utilised to set off losses incurred in the current financial year.' },
    { item: 'Sec 135 Corporate Social Responsibility (CSR) — Applicability & Spend', limitRate: 'NW >= ₹500Cr OR T/O >= ₹1,000Cr OR NP >= ₹5Cr -> Spend >= 2%', remarks: 'Checked for immediately preceding FY. CSR Committee not required if annual obligation <= ₹50 Lakhs.' },
    { item: 'Sec 138 Internal Audit — Applicability Thresholds', limitRate: 'Listed | Unlisted Pub (PUC>=50Cr/TO>=200Cr/Loan>=100Cr/Dep>=25Cr) | Pvt (TO>=200Cr/Loan>=100Cr)', remarks: 'Checked based on preceding financial year figures.' },
    { item: 'Sec 139(2) Auditor Rotation & Sec 141(3)(d)/(g) Disqualification Caps', limitRate: '5 Yrs (Indiv.) / 10 Yrs (Firm) | Max 20 Audits | Debt > ₹5L', remarks: 'Relative holding security up to ₹1,00,000 face value is permitted; guarantee > ₹1,00,000 disqualifies.' },
    { item: 'LLP Act 2008 — Small LLP & Mandatory Audit Thresholds', limitRate: 'Small LLP: Contrib <=₹25L & T/O <=₹40L | Audit: T/O >₹40L OR Contrib >₹25L', remarks: 'Form 11 due by 30th May (60 days); Form 8 due by 30th October (30 days from 6 months).' },
    { item: 'FEMA 1999 Schedule III — Liberalised Remittance Scheme (LRS) Limit', limitRate: 'USD 2,50,000 per Financial Year (Resident Individuals)', remarks: 'Remittances beyond USD 2,50,000 require prior RBI approval (except bona fide medical/university estimates).' }
  ],
  Tax: [
    { item: 'Income Tax Sec 115BAC(1A) — Default Slabs, Std Deduction & Sec 87A Rebate', limitRate: '₹3L Basic | ₹75,000 Std Ded. | ₹25,000 Rebate up to ₹7,00,000', remarks: 'Max Surcharge capped at 25% under 115BAC(1A). Employer NPS u/s 80CCD(2) allowed up to 14% of Salary.' },
    { item: 'Income Tax Sec 40(b)(v) — Working Partner Remuneration Ceiling', limitRate: 'First ₹6L Book Profit: Higher of ₹3L or 90% | Balance: 60%', remarks: 'Amended by Finance (No. 2) Act, 2024. Partner capital interest u/s 40(b)(iv) capped at 12% p.a.' },
    { item: 'Income Tax Sec 40A(3), 43B(h) & 44AD/44ADA — PGBP Thresholds', limitRate: 'Cash: ₹10k (₹35k GTA) | MSE: 15/45 Days | 44AD: ₹2Cr/3Cr | 44ADA: ₹50L/75L', remarks: 'Enhanced ₹3Cr / ₹75L presumptive limit applies if aggregate cash receipts <= 5% of total turnover/receipts.' },
    { item: 'Income Tax Sec 111A, 112 & 112A — Post-23.07.2024 Capital Gains Rates', limitRate: 'STCG 111A: 20% | LTCG 112A: 12.5% (>₹1.25L) | LTCG 112: 12.5% (No Index)', remarks: 'Holding period: 12 months for all listed securities; 24 months for unlisted shares, land & building, and gold.' },
    { item: 'Income Tax TDS — Reduced 2% Rate Sections (w.e.f. 01.10.2024)', limitRate: '2% TDS on Sec 194D, 194G, 194H, 194-IB & 194M', remarks: 'Sec 194IA (1% on Immovable Property >= ₹50L) checks ₹50L threshold on aggregate consideration across all buyers/sellers.' },
    { item: 'GST Sec 22 & Sec 10 — Registration & Composition Turnover Thresholds', limitRate: 'Reg: ₹10L / ₹20L / ₹40L | Composition: ₹1.5 Cr (₹75L Spec.) & ₹50L (10(2A))', remarks: 'Composition rates: Manufacturers 1%, Restaurants 5%, Traders 1% of taxable supplies, Service providers u/s 10(2A) 6%.' },
    { item: 'GST Sec 16(2), 16(4), Rule 48(4) & Rule 138 — Operational Thresholds', limitRate: '180-Day Vendor Pay | 30th Nov ITC Cut-Off | ₹5Cr E-Invoice | ₹50k E-Way Bill', remarks: 'E-Way Bill validity: 1 day per 200 km (normal cargo) and 1 day per 20 km (Over-Dimensional Cargo).' }
  ],
  AuditInter: [
    { item: 'SA 230 & SQC 1 — Audit File Assembly & Minimum Retention Period', limitRate: 'Assembly <= 60 Days | Retention >= 7 Years from Report Date', remarks: 'EQCR is mandatory for all listed entity audits and must be completed on or before the audit report date.' },
    { item: 'CARO 2020 Para 1(2) — Private Company Exemption Thresholds', limitRate: 'PUC+Reserves <= ₹1Cr AND Borrowings <= ₹1Cr AND Revenue <= ₹10Cr', remarks: 'Must also not be a holding or subsidiary of a Public Company. Working capital stock statement reporting triggers if sanctioned limit > ₹5 Cr.' },
    { item: 'RBI Bank Audit Norms — NPA Overdue Trigger & Provisioning Rates', limitRate: '> 90 Days (Agri: 2 Short / 1 Long Crop Seasons) | Sub-Std: 15%/25% | D1/D2/D3: 25%/40%/100%', remarks: 'NPA classification is borrower-wise across all facilities, not facility-wise.' }
  ]
};
