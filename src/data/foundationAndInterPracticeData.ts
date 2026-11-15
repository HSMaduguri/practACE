/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  FoundationSubjectId,
  IntermediateSubjectId,
  QuizQuestionItem,
  RevisionVideoReference,
} from '../types.ts';
import type { Flashcard } from './flashcards.ts';
import type { TheoryQuestion } from './theoryAuditorQuestions.ts';
import type { AttemptCode, ExtractedPastPaperQuestion } from './pastPapersQuestionBank.ts';

export type NonFinalSubjectId = FoundationSubjectId | IntermediateSubjectId;

export const FOUNDATION_INTER_QUIZ_QUESTIONS: Record<NonFinalSubjectId, QuizQuestionItem[]> = {
  // ---------------- CA FOUNDATION ----------------
  Accounts: [
    {
      type: 'general',
      data: {
        id: 'ACC_G_01',
        subjectId: 'Accounts',
        chapterName: 'Bank Reconciliation Statement (BRS)',
        questionText: 'A trader’s Cash Book shows an overdraft of ₹24,000 on 31 March. Cheques deposited into bank ₹9,500 were not yet credited, and bank charges of ₹450 were omitted from the Cash Book. What is the balance as per Pass Book?',
        options: [
          '₹33,950 Overdraft',
          '₹14,050 Overdraft',
          '₹33,050 Favourable',
          '₹14,950 Overdraft'
        ],
        correctOptionIndex: 0,
        explanation: 'Starting with Overdraft in Cash Book (-₹24,000): Cheques deposited not cleared reduce bank credit (more overdraft: -₹9,500); Omitted bank charges further increase overdraft (-₹450). Pass Book Overdraft = ₹24,000 + ₹9,500 + ₹450 = ₹33,950 Overdraft.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'ACC_G_02',
        subjectId: 'Accounts',
        chapterName: 'Company Accounts (Issue of Shares, Debentures, Forfeiture)',
        questionText: 'Z Ltd. forfeited 600 shares of ₹10 each (₹8 called up) on which the shareholder paid ₹5 per share including ₹2 Securities Premium. Out of these, 400 shares were reissued at ₹7 paid-up for ₹6 per share. What amount transfers to Capital Reserve?',
        options: [
          '₹1,200',
          '₹800',
          '₹1,600',
          '₹2,000'
        ],
        correctOptionIndex: 1,
        explanation: 'Securities Premium once received (₹2/sh) CANNOT be credited to Share Forfeiture A/c. Forfeited capital received per share = ₹5 - ₹2 = ₹3 per share. For 400 reissued shares: Forfeited amount = 400 × ₹3 = ₹1,200. Discount on reissue = 400 × (₹7 - ₹6) = ₹400. Transfer to Capital Reserve = ₹1,200 - ₹400 = ₹800.'
      }
    },
    {
      type: 'case',
      data: {
        id: 'ACC_C_01',
        subjectId: 'Accounts',
        chapterName: 'Inventories Valuation',
        scenarioTitle: 'Year-End Inventory Valuation & Stock Taking Adjustments (AS 2)',
        scenarioText: 'M/s Bharat Traders closes its financial year on 31 March. Physical stock taking could only be conducted on 7 April, resulting in physical stock valued at cost of ₹3,60,000. Between 1 April and 7 April: (i) Credit sales were ₹1,20,000 (uniform Gross Profit margin 25% on sales); (ii) Purchases received and physically included in 7 April stock totalled ₹55,000; (iii) Goods costing ₹18,000 sent on Sale-or-Return basis to a customer on 28 March (approval window 15 days, still pending) were excluded from 7 April count.',
        subQuestions: [
          {
            id: 'ACC_CS_1_1',
            subjectId: 'Accounts',
            chapterName: 'Inventories Valuation',
            questionText: 'What is the Cost of Goods Sold during the interim period 1 April to 7 April that must be added back?',
            options: ['₹90,000', '₹96,000', '₹30,000', '₹1,20,000'],
            correctOptionIndex: 0,
            explanation: 'Gross profit is 25% on Sales (₹1,20,000 × 25% = ₹30,000). Cost of Goods Sold = ₹1,20,000 - ₹30,000 = ₹90,000.'
          },
          {
            id: 'ACC_CS_1_2',
            subjectId: 'Accounts',
            chapterName: 'Inventories Valuation',
            questionText: 'What is the adjusted closing inventory valuation as on 31 March?',
            options: ['₹3,95,000', '₹4,13,000', '₹3,77,000', '₹4,25,000'],
            correctOptionIndex: 1,
            explanation: 'Physical stock on 7 April (₹3,60,000) + Cost of goods sold during 1–7 April (₹90,000) - Purchases received 1–7 April (₹55,000) + Unapproved goods lying with customer at cost (₹18,000) = ₹4,13,000.'
          }
        ]
      }
    }
  ],
  Law: [
    {
      type: 'general',
      data: {
        id: 'LAW_G_01',
        subjectId: 'Law',
        chapterName: 'The Indian Contract Act 1872: Consideration & Capacity',
        questionText: 'A minor fraudulently misrepresents his age to borrow ₹1,50,000 from a moneylender and executes a mortgage deed over his property. Under Section 11 of the Indian Contract Act, 1872:',
        options: [
          'The mortgage is valid because minor committed fraud.',
          'The contract is voidable at the option of the moneylender.',
          'The mortgage is void ab initio; no specific performance lies though equitable restitution of identifiable property may apply.',
          'The minor must repay with 12% interest upon attaining 18 years.'
        ],
        correctOptionIndex: 2,
        explanation: 'Following Mohori Bibee v. Dharmodas Ghose, an agreement by a minor is void ab initio. Estoppel does not operate against a minor, nor can a void agreement be ratified upon majority.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'LAW_G_02',
        subjectId: 'Law',
        chapterName: 'The Sale of Goods Act 1930: Transfer of Ownership & Unpaid Seller',
        questionText: 'Which of the following causes an unpaid seller to LOSE the Right of Lien over goods u/s 49 of the Sale of Goods Act, 1930?',
        options: [
          'Delivery to carrier without reserving right of disposal',
          'Buyer obtains lawful possession through seller’s consent',
          'Explicit waiver of lien by the unpaid seller',
          'All of the above'
        ],
        correctOptionIndex: 3,
        explanation: 'Under Sec 49, lien depends strictly on possession and terminates upon unconditional delivery to carrier, lawful possession obtained by buyer/agent, or waiver.'
      }
    },
    {
      type: 'case',
      data: {
        id: 'LAW_C_01',
        subjectId: 'Law',
        chapterName: 'The Companies Act 2013 (Basics & Incorporation)',
        scenarioTitle: 'Turquand Rule (Doctrine of Indoor Management) vs Constructive Notice',
        scenarioText: 'Articles of Association of Apex Infra Pvt. Ltd. authorise directors to borrow money up to ₹50 Lakhs without resolution, and beyond ₹50 Lakhs only with an Ordinary Resolution of shareholders in General Meeting. Two directors borrow ₹80 Lakhs from Horizon Bank against a company debenture without passing any shareholder resolution. The bank relied bona fide on the directors’ signature without inspecting internal minute books.',
        subQuestions: [
          {
            id: 'LAW_CS_1_1',
            subjectId: 'Law',
            chapterName: 'The Companies Act 2013 (Basics & Incorporation)',
            questionText: 'Is Apex Infra Pvt. Ltd. bound by the ₹80 Lakh loan to Horizon Bank?',
            options: [
              'No, because Horizon Bank had constructive notice of lack of resolution',
              'Yes, protected by the Doctrine of Indoor Management (Royal British Bank v. Turquand)',
              'No, the transaction is ultra vires the Memorandum',
              'Bound only up to ₹50 Lakhs'
            ],
            correctOptionIndex: 1,
            explanation: 'Outsiders dealing in good faith are entitled to assume internal procedural compliances (like passing an Ordinary Resolution) required by the Articles have been duly observed.'
          }
        ]
      }
    }
  ],
  MathStats: [
    {
      type: 'general',
      data: {
        id: 'MATH_G_01',
        subjectId: 'MathStats',
        chapterName: 'Mathematics of Finance (Simple & Compound Interest, Annuities)',
        questionText: 'What is the Effective Annual Rate (EAR) equivalent to a nominal rate of 12% per annum compounded quarterly?',
        options: ['12.36%', '12.55%', '12.68%', '12.00%'],
        correctOptionIndex: 1,
        explanation: 'E = (1 + i/k)^k - 1 = (1 + 0.12/4)^4 - 1 = (1.03)^4 - 1 = 1.12550881 - 1 = 12.55%.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'MATH_G_02',
        subjectId: 'MathStats',
        chapterName: 'Correlation and Regression',
        questionText: 'If the two regression coefficients are b_yx = -0.8 and b_xy = -0.45, what is the Karl Pearson Correlation Coefficient (r)?',
        options: ['+0.60', '-0.60', '-0.36', '+0.36'],
        correctOptionIndex: 1,
        explanation: 'r = ± sqrt(b_yx × b_xy) = - sqrt((-0.8) × (-0.45)) = - sqrt(0.36) = -0.60. Sign of r must match the negative signs of both regression slopes.'
      }
    },
    {
      type: 'case',
      data: {
        id: 'MATH_C_01',
        subjectId: 'MathStats',
        chapterName: 'Theoretical Distributions (Binomial, Poisson, Normal)',
        scenarioTitle: 'Statistical Quality Sampling & Distribution Parameters',
        scenarioText: 'An audit quality control test follows a Binomial distribution B(n, p) with Mean = 12 and Variance = 8.',
        subQuestions: [
          {
            id: 'MATH_CS_1_1',
            subjectId: 'MathStats',
            chapterName: 'Theoretical Distributions (Binomial, Poisson, Normal)',
            questionText: 'What is the number of independent trials (n) in this distribution?',
            options: ['18', '24', '36', '16'],
            correctOptionIndex: 2,
            explanation: 'Mean = np = 12 and Variance = npq = 8. Dividing Variance by Mean gives q = 8/12 = 2/3, so p = 1 - q = 1/3. Therefore n = 12 / (1/3) = 36 trials.'
          }
        ]
      }
    }
  ],
  Econ: [
    {
      type: 'general',
      data: {
        id: 'ECON_G_01',
        subjectId: 'Econ',
        chapterName: 'Theory of Demand and Supply',
        questionText: 'When the price of coffee rises by 10%, the quantity demanded of tea increases by 15%. What is the Cross Elasticity of Demand between coffee and tea?',
        options: ['+1.5 (Substitutes)', '-1.5 (Complements)', '+0.67 (Substitutes)', '-0.67 (Complements)'],
        correctOptionIndex: 0,
        explanation: 'Cross Elasticity E_c = % change in Qty of Tea / % change in Price of Coffee = (+15%) / (+10%) = +1.5. Positive cross elasticity confirms goods are Substitutes.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'ECON_G_02',
        subjectId: 'Econ',
        chapterName: 'Determination of National Income',
        questionText: 'In a two-sector Keynesian economy where Marginal Propensity to Save (MPS) is 0.25, an autonomous investment boost of ₹400 Crore increases equilibrium National Income by:',
        options: ['₹1,000 Crore', '₹1,600 Crore', '₹533 Crore', '₹1,200 Crore'],
        correctOptionIndex: 1,
        explanation: 'Investment Multiplier k = 1 / MPS = 1 / 0.25 = 4. Total increase in Income dY = k × dI = 4 × ₹400 Cr = ₹1,600 Crore.'
      }
    },
    {
      type: 'case',
      data: {
        id: 'ECON_C_01',
        subjectId: 'Econ',
        chapterName: 'Price Determination in Different Markets',
        scenarioTitle: 'Short-Run Shut-Down Decision & Oligopoly Price Rigidity',
        scenarioText: 'Alpha Textiles operates in a perfectly competitive market where prevailing price is ₹42 per unit. At the profit-maximising output of 1,000 units where MC = MR = ₹42, Average Total Cost is ₹50 and Average Variable Cost is ₹38.',
        subQuestions: [
          {
            id: 'ECON_CS_1_1',
            subjectId: 'Econ',
            chapterName: 'Price Determination in Different Markets',
            questionText: 'Should Alpha Textiles continue producing in the short run?',
            options: [
              'Shut down immediately because Price (₹42) < ATC (₹50)',
              'Continue operating because Price (₹42) exceeds AVC (₹38), contributing ₹4/unit towards fixed costs',
              'Raise its price unilaterally to ₹50 to break even',
              'Expand output indefinitely'
            ],
            correctOptionIndex: 1,
            explanation: 'In the short run, since Price ₹42 >= AVC ₹38, continuing operations loses ₹8,000 overall whereas shutting down would lose the entire ₹12,000 Fixed Cost.'
          }
        ]
      }
    }
  ],

  // ---------------- CA INTERMEDIATE ----------------
  AdvAcc: [
    {
      type: 'general',
      data: {
        id: 'ADVACC_G_01',
        subjectId: 'AdvAcc',
        chapterName: 'Presentation & Disclosure Based AS (AS 1, AS 3, AS 17, AS 18, AS 20, AS 24, AS 25)',
        questionText: 'Under AS 20, X Ltd. had 2,00,000 equity shares at year start and issued a 1:2 Bonus Issue on 1 October. Net profit for the year is ₹9,00,000. What is Basic EPS for the year?',
        options: ['₹3.60', '₹3.00', '₹4.50', '₹3.33'],
        correctOptionIndex: 1,
        explanation: 'Under AS 20, bonus shares do not bring new resources and are treated as issued from the earliest period reported. Total weighted shares = 2,00,000 + 1,00,000 = 3,00,000. Basic EPS = ₹9,00,000 / 3,00,000 = ₹3.00.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'ADVACC_G_02',
        subjectId: 'AdvAcc',
        chapterName: 'Amalgamation of Companies (AS 14)',
        questionText: 'Under AS 14 (Amalgamation in the nature of Purchase), how should an unutilised statutory reserve (e.g., Export Profit Reserve) of the Transferor Company be recorded in the Transferee’s books?',
        options: [
          'Credited to General Reserve directly',
          'Dr Amalgamation Adjustment Reserve / Cr Statutory Reserve',
          'Dr Goodwill A/c / Cr Statutory Reserve',
          'Ignored completely under Purchase Method'
        ],
        correctOptionIndex: 1,
        explanation: 'AS 14 mandates keeping statutory reserves alive for the legally required tenure via Dr Amalgamation Adjustment Reserve A/c / Cr Statutory Reserve A/c.'
      }
    },
    {
      type: 'case',
      data: {
        id: 'ADVACC_C_01',
        subjectId: 'AdvAcc',
        chapterName: 'Buy Back of Securities',
        scenarioTitle: 'Statutory Three-Test Ceiling for Buy-Back of Equity Shares (Sec 68)',
        scenarioText: 'Omega Ltd. presents its Balance Sheet data prior to share buy-back: Equity Share Capital (₹10 fully paid) = ₹100 Lakhs; Free Reserves = ₹140 Lakhs; Securities Premium = ₹60 Lakhs; Total Debt = ₹420 Lakhs. The Board proposes buy-back at ₹30 per share.',
        subQuestions: [
          {
            id: 'ADVACC_CS_1_1',
            subjectId: 'AdvAcc',
            chapterName: 'Buy Back of Securities',
            questionText: 'Comparing Resources Test, 25% Shares Test, and Post Debt-Equity (2:1) Test, what is the maximum number of shares Omega Ltd. can buy back?',
            options: [
              '2,50,000 shares',
              '2,25,000 shares',
              '2,00,000 shares',
              '3,00,000 shares'
            ],
            correctOptionIndex: 1,
            explanation: '1) Resources Test = 25% of ₹300L / ₹30 = 2,50,000 shares. 2) Shares Test = 25% of 10L = 2,50,000 shares. 3) Debt-Equity Test: Debt ₹420L requires Post-Buy-Back Equity >= ₹210L -> Max reduction = ₹300L − ₹210L = ₹90L. Each share bought back at ₹30 plus ₹10 CRR transfer reduces Free Reserves + Equity by ₹40 -> ₹90L / ₹40 = 2,25,000 shares. Lowest of the three tests = 2,25,000 shares.'
          }
        ]
      }
    }
  ],
  CorpLaw: [
    {
      type: 'general',
      data: {
        id: 'CLAW_G_01',
        subjectId: 'CorpLaw',
        chapterName: 'Management and Administration',
        questionText: 'A public company has 4,200 members on the date of its Annual General Meeting. How many members must be personally present to constitute a valid Quorum u/s 103 of Companies Act, 2013?',
        options: ['5 members', '15 members', '30 members', '2 members'],
        correctOptionIndex: 1,
        explanation: 'Under Sec 103(1)(a), Public Company Quorum is: 5 (<=1,000 members), 15 (1,001 to 5,000 members), and 30 (>5,000 members). Proxies are excluded.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'CLAW_G_02',
        subjectId: 'CorpLaw',
        chapterName: 'The Foreign Exchange Management Act, 1999',
        questionText: 'Under the Liberalised Remittance Scheme (LRS) read with Schedule III of the FEM (Current Account Transactions) Rules, 2000, what is the maximum aggregate foreign exchange a resident individual can remit per financial year without prior RBI approval?',
        options: ['USD 1,00,000', 'USD 2,50,000', 'USD 5,00,000', 'USD 50,000'],
        correctOptionIndex: 1,
        explanation: 'Under Schedule III of FEM (Current Account Transactions) Rules, 2000, resident individuals can avail foreign exchange facility up to an aggregate limit of USD 2,50,000 per Financial Year under LRS before requiring prior RBI approval.'
      }
    }
  ],
  Tax: [
    {
      type: 'general',
      data: {
        id: 'TAX_G_01',
        subjectId: 'Tax',
        chapterName: 'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
        questionText: 'Under Default Regime Section 115BAC(1A) for AY 2026-27 / FY 2025-26, what is the Standard Deduction available to a salaried individual under Section 16(ia)?',
        options: ['₹50,000', '₹75,000', '₹1,00,000', 'Nil'],
        correctOptionIndex: 1,
        explanation: 'Finance (No. 2) Act 2024 enhanced Standard Deduction u/s 16(ia) to ₹75,000 exclusively for taxpayers assessed under default regime Sec 115BAC(1A).'
      }
    },
    {
      type: 'general',
      data: {
        id: 'TAX_G_02',
        subjectId: 'Tax',
        chapterName: 'Input Tax Credit (ITC) & Computation of GST Liability',
        questionText: 'Under Section 17(5) of CGST Act, 2017, Input Tax Credit is ALLOWED on:',
        options: [
          'Passenger motor vehicle with seating capacity of 7 persons used for staff commute',
          'Outdoor catering services purchased for employee annual party',
          'Motor vehicle with seating capacity of 16 persons used for transporting employees',
          'Goods distributed as free promotional samples'
        ],
        correctOptionIndex: 2,
        explanation: 'Sec 17(5)(a) blocks ITC strictly on motor vehicles for transportation of persons having approved seating capacity of NOT more than 13 persons (incl. driver). Vehicles seating >13 persons enjoy full ITC.'
      }
    }
  ],
  Cost: [
    {
      type: 'general',
      data: {
        id: 'COST_G_01',
        subjectId: 'Cost',
        chapterName: 'Material Cost (Procurement, GeM/ERP Digital Costing, EOQ, Inventory Control & Losses)',
        questionText: 'Annual requirement is 3,200 units, ordering cost is ₹150 per order, unit price is ₹60, and annual carrying cost is 10% of purchase price. What is the Economic Order Quantity (EOQ)?',
        options: ['400 units', '300 units', '500 units', '250 units'],
        correctOptionIndex: 0,
        explanation: 'Carrying cost C = 10% of ₹60 = ₹6/unit/year. EOQ = sqrt((2 × 3,200 × 150) / 6) = sqrt(1,60,000) = 400 units.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'COST_G_02',
        subjectId: 'Cost',
        chapterName: 'Marginal Costing (CVP Analysis, BEP, Margin of Safety & Short-Term Decisions)',
        questionText: 'If Fixed Costs are ₹2,40,000, Selling Price is ₹50 per unit, and Variable Cost is ₹30 per unit, what is the Break-Even Sales in Rupees?',
        options: ['₹4,00,000', '₹6,00,000', '₹5,00,000', '₹3,60,000'],
        correctOptionIndex: 1,
        explanation: 'Contribution per unit = ₹50 - ₹30 = ₹20. P/V Ratio = 20/50 = 40%. BEP Sales = ₹2,40,000 / 0.40 = ₹6,00,000 (12,000 units).'
      }
    }
  ],
  AuditInter: [
    {
      type: 'general',
      data: {
        id: 'AUDI_G_01',
        subjectId: 'AuditInter',
        chapterName: 'Audit Report (SA 700, SA 701, SA 705, SA 706, SA 710, Branch/Joint Audit & CARO 2020)',
        questionText: 'When the auditor is UNABLE to obtain sufficient appropriate audit evidence regarding inventory comprising 65% of total assets, and the possible effects are both material and pervasive, the auditor MUST express:',
        options: [
          'Qualified Opinion u/s SA 705',
          'Adverse Opinion u/s SA 705',
          'Disclaimer of Opinion u/s SA 705',
          'Unmodified Opinion with Emphasis of Matter u/s SA 706'
        ],
        correctOptionIndex: 2,
        explanation: 'Under SA 705, inability to obtain sufficient appropriate evidence with Material AND Pervasive possible effects mandates Disclaimer of Opinion (Adverse applies when misstatements are actually obtained & proven pervasive).'
      }
    },
    {
      type: 'general',
      data: {
        id: 'AUDI_G_02',
        subjectId: 'AuditInter',
        chapterName: 'Audit Documentation (SA 230)',
        questionText: 'As per SA 230 read with SQC 1, what is the maximum time limit for completing the administrative assembly of the final audit file and the minimum retention period from the date of the auditor’s report?',
        options: [
          '30 days assembly; 5 years retention',
          '60 days assembly; 7 years retention',
          '90 days assembly; 8 years retention',
          '45 days assembly; 10 years retention'
        ],
        correctOptionIndex: 1,
        explanation: 'SA 230 & SQC 1 specify an administrative assembly window of not more than 60 days after the date of the auditor’s report, and a minimum retention period of 7 years.'
      }
    }
  ],
  FMSM: [
    {
      type: 'general',
      data: {
        id: 'FMSM_G_01',
        subjectId: 'FMSM',
        chapterName: 'Leverages (Operating, Financial and Combined Leverages)',
        questionText: 'A company reports Sales ₹20 Lakhs, Variable Cost 60% of sales, Fixed Operating Cost ₹3 Lakhs, and Debt Interest ₹1 Lakh. Calculate Degree of Combined Leverage (DCL).',
        options: ['1.60', '2.00', '1.25', '2.50'],
        correctOptionIndex: 1,
        explanation: 'Contribution = 40% of ₹20L = ₹8L. EBIT = ₹8L - ₹3L = ₹5L. EBT = ₹5L - ₹1L = ₹4L. DCL = Contribution / EBT = ₹8L / ₹4L = 2.00.'
      }
    },
    {
      type: 'general',
      data: {
        id: 'FMSM_G_02',
        subjectId: 'FMSM',
        chapterName: 'Strategic Analysis: Internal Environment (Mendelow’s Model, Strategic Drivers, SWOT & Porter’s Generic Strategies)',
        questionText: 'Under Mendelow’s Stakeholder Power-Interest Matrix, how should management handle a stakeholder group possessing HIGH Power but LOW Interest (e.g., institutional lenders or tax authorities)?',
        options: [
          'Key Players — Manage Closely',
          'Keep Satisfied',
          'Keep Informed',
          'Low Priority — Monitor Only'
        ],
        correctOptionIndex: 1,
        explanation: 'Under Mendelow’s Grid: High Power + High Interest = Key Players (Manage Closely); High Power + Low Interest = Keep Satisfied (so they do not gain interest and oppose strategy); Low Power + High Interest = Keep Informed.'
      }
    }
  ]
};

export const FOUNDATION_INTER_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_fnd_acc_1',
    subjectId: 'Accounts',
    category: 'Company Accounts (Issue of Shares, Debentures, Forfeiture)',
    statutoryRef: 'AS & Ind AS Capital Reserve Rule',
    examImportance: 'Critical',
    question: 'When forfeited shares are partially reissued, how much transfers to Capital Reserve?',
    answerHtml: `<div class="space-y-2 text-xs"><p class="font-bold text-amber-400">Proportionate Rule:</p><p>Only profit on <span class="underline">reissued shares</span> moves to Capital Reserve = [(Total Forfeited Credit × Reissued Shares) / Total Forfeited Shares] − Reissue Discount.</p><p class="text-slate-400">Balance on un-reissued shares remains in Share Forfeiture A/c on Balance Sheet.</p></div>`,
    summaryClean: 'Transfer forfeited profit strictly in proportion to shares actually reissued minus reissue discount.'
  },
  {
    id: 'fc_fnd_law_1',
    subjectId: 'Law',
    category: 'The Indian Contract Act 1872: Consideration & Capacity',
    statutoryRef: 'Sec 25 Indian Contract Act, 1872',
    examImportance: 'Critical',
    question: 'What are the core statutory exceptions where an agreement WITHOUT consideration is valid?',
    answerHtml: `<div class="space-y-2 text-xs"><ul class="list-disc list-inside space-y-1"><li>Natural Love & Affection (written + registered + near relation)</li><li>Compensation for past voluntary service rendered</li><li>Written & signed promise to pay time-barred debt</li><li>Completed gift & Contract of Agency (Sec 185)</li></ul></div>`,
    summaryClean: 'Written/registered near-relation love, past voluntary service, time-barred debt promise, gift, and agency need no consideration.'
  },
  {
    id: 'fc_fnd_math_1',
    subjectId: 'MathStats',
    category: 'Index Numbers',
    statutoryRef: 'Fisher Ideal Index Properties',
    examImportance: 'High',
    question: 'Which ideal index satisfies BOTH Time Reversal Test and Factor Reversal Test?',
    answerHtml: `<div class="space-y-2 text-xs"><p class="font-bold text-emerald-400">Fisher Ideal Index = sqrt(Laspeyres × Paasche)</p><p>Satisfies Time Reversal (P01 × P10 = 1) and Factor Reversal (P01 × Q01 = V01), but fails Circular Test.</p></div>`,
    summaryClean: 'Fisher Ideal Index satisfies both Time Reversal and Factor Reversal Tests, but NOT the Circular Test.'
  },
  {
    id: 'fc_fnd_econ_1',
    subjectId: 'Econ',
    category: 'Theory of Production and Cost',
    statutoryRef: 'Short-Run Cost Geometry',
    examImportance: 'High',
    question: 'Why does Marginal Cost (MC) always intersect AVC and ATC at their minimum points?',
    answerHtml: `<div class="space-y-2 text-xs"><p>Whenever marginal unit cost is below current average (MC < AC), adding one unit pulls average downward; once MC > AC, it pulls average upward—forcing exact intersection at the minimum.</p></div>`,
    summaryClean: 'MC pulls averages down when MC < AC and up when MC > AC, cutting AVC & ATC strictly at their minima.'
  },
  {
    id: 'fc_int_adv_1',
    subjectId: 'AdvAcc',
    category: 'Accounting Standards Impacting P&L (AS 4, AS 5, AS 7, AS 9, AS 11, AS 12, AS 22)',
    statutoryRef: 'AS 22 Accounting for Taxes on Income',
    examImportance: 'Critical',
    question: 'Distinguish Virtual Certainty vs Reasonable Certainty for Deferred Tax Asset (DTA) recognition under AS 22.',
    answerHtml: `<div class="space-y-2 text-xs"><p><span class="font-bold text-amber-400">Unabsorbed Depreciation / Carry-Forward Business Loss:</span> Requires <span class="font-bold">Virtual Certainty</span> backed by convincing evidence.</p><p><span class="font-bold text-sky-400">Other Timing Differences:</span> Requires <span class="font-bold">Reasonable Certainty</span> of sufficient future taxable income.</p></div>`,
    summaryClean: 'Losses/unabsorbed depreciation require Virtual Certainty for DTA; other timing differences require Reasonable Certainty.'
  },
  {
    id: 'fc_int_claw_1',
    subjectId: 'CorpLaw',
    category: 'Audit and Auditors',
    statutoryRef: 'Sec 139(2) Companies Act, 2013',
    examImportance: 'Critical',
    question: 'State the maximum consecutive auditor tenure and mandatory cooling-off period u/s 139(2).',
    answerHtml: `<div class="space-y-2 text-xs"><p><span class="font-bold text-emerald-400">Individual Auditor:</span> 1 term of 5 consecutive years.</p><p><span class="font-bold text-sky-400">Audit Firm:</span> 2 terms of 5 consecutive years.</p><p><span class="text-amber-400 font-bold">Cooling-off:</span> 5 years (same network restriction applies).</p></div>`,
    summaryClean: 'Max 5 yrs for individual or 10 yrs for audit firm, followed by a strict 5-year cooling-off period.'
  },
  {
    id: 'fc_int_claw_2',
    subjectId: 'CorpLaw',
    category: 'The Foreign Exchange Management Act, 1999',
    statutoryRef: 'Sec 5 FEMA 1999 — Schedules I, II & III',
    examImportance: 'Critical',
    question: 'Distinguish Schedule I, Schedule II, and Schedule III of the FEM (Current Account Transactions) Rules, 2000.',
    answerHtml: `<div class="space-y-2 text-xs"><p><span class="font-bold text-rose-400">Schedule I:</span> Prohibited transactions (Lottery, racing, callback services).</p><p><span class="font-bold text-amber-400">Schedule II:</span> Requires prior Central Government Ministry approval (Cultural tours, PSU charter freight).</p><p><span class="font-bold text-emerald-400">Schedule III:</span> Requires prior RBI approval beyond LRS limit of USD 2,50,000 per FY.</p></div>`,
    summaryClean: 'Schedule I = Prohibited; Schedule II = Prior Central Govt Approval; Schedule III = Prior RBI Approval (> USD 2,50,000 LRS).'
  },
  {
    id: 'fc_int_tax_1',
    subjectId: 'Tax',
    category: 'Input Tax Credit (ITC) & Computation of GST Liability',
    statutoryRef: 'Sec 16(2) CGST Act 180-Day Rule',
    examImportance: 'Critical',
    question: 'What happens if a recipient fails to pay vendor value + tax within 180 days from invoice date?',
    answerHtml: `<div class="space-y-2 text-xs"><p>Recipient must reverse proportionate ITC availed along with interest u/s 50 (@ 18% p.a.) from date of availing ITC till reversal date. Re-availment is allowed without time limit u/s 16(4) upon eventual payment.</p></div>`,
    summaryClean: 'Failure to pay supplier within 180 days forces ITC reversal + 18% interest; re-availment allowed anytime upon payment.'
  },
  {
    id: 'fc_int_cost_1',
    subjectId: 'Cost',
    category: 'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
    statutoryRef: 'Labour Idle Time Rule',
    examImportance: 'High',
    question: 'How is Labour Idle Time Variance classified and isolated from Efficiency Variance?',
    answerHtml: `<div class="space-y-2 text-xs"><p>Abnormal Idle Time Variance = Abnormal Idle Hours × Standard Rate per Hour (ALWAYS Adverse). Efficiency Variance is computed strictly on <span class="font-bold">Net Productive Hours</span> (SH − Actual Productive Hours) × SR.</p></div>`,
    summaryClean: 'Abnormal Idle Time Variance is always Adverse; Efficiency Variance compares SH strictly against Net Productive Hours.'
  },
  {
    id: 'fc_int_aud_1',
    subjectId: 'AuditInter',
    category: 'Risk Assessment and Internal Control (SA 315, SA 320, SA 330 & Digital Audit)',
    statutoryRef: 'SA 315 & SA 320 Risk Formula',
    examImportance: 'Critical',
    question: 'Explain the inverse relationship between Materiality, Risk of Material Misstatement, and Detection Risk.',
    answerHtml: `<div class="space-y-2 text-xs"><p>Audit Risk = (IR × CR) × DR. When RMM (IR × CR) is HIGH, acceptable Detection Risk must be LOW (requiring more extensive substantive testing). Materiality and Audit Risk always move inversely.</p></div>`,
    summaryClean: 'Higher assessed RMM requires lower acceptable Detection Risk and lower materiality to collect more persuasive audit evidence.'
  },
  {
    id: 'fc_int_fmsm_1',
    subjectId: 'FMSM',
    category: 'Capital Investment Decisions (Payback, ARR, NPV, IRR, MIRR, PI, Capital Rationing & EAC)',
    statutoryRef: 'NPV, IRR & MIRR Reinvestment Assumption',
    examImportance: 'Critical',
    question: 'How does Modified Internal Rate of Return (MIRR) overcome the core limitation of IRR?',
    answerHtml: `<div class="space-y-2 text-xs"><p>IRR unrealistically assumes intermediate cash inflows are reinvested at the project’s own IRR. <span class="font-bold text-amber-400">MIRR</span> compounds all intermediate cash inflows to the terminal year at the firm’s <span class="font-bold">Cost of Capital (WACC)</span> and eliminates the multiple-IRR problem.</p></div>`,
    summaryClean: 'MIRR compounds intermediate inflows at Cost of Capital (WACC) rather than IRR, resolving reinvestment bias and multiple IRRs.'
  }
];

export const FOUNDATION_INTER_THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'th_fnd_acc_1',
    subjectId: 'Accounts',
    chapterName: 'Theoretical Framework & Accounting Standards',
    title: 'Capital vs Revenue Treatment on Pre-Ready Asset Expenses',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'CA Foundation RTP May 2026',
    question: 'Explain the distinction between Capital Expenditure and Revenue Expenditure, specifying the treatment of overhauling expenses incurred immediately on purchasing a second-hand machine before putting it to use.',
    keyConcepts: [
      { keyword: 'earning capacity', category: 'Provision', description: 'Increases or acquires future earning potential beyond one year.' },
      { keyword: 'ready for use', category: 'Standard', description: 'Costs bringing second-hand asset to working condition are capitalised.' },
      { keyword: 'AS 10', category: 'Standard', description: 'PPE directly attributable acquisition & initial overhaul costs capitalised.' }
    ],
    shortSuggestedAnswer: 'Capital expenditure creates future economic benefit beyond the current accounting period or enhances earning capacity, whereas revenue expenditure merely maintains current efficiency. Initial overhauling charges incurred to make a newly purchased second-hand machine ready for intended use under AS 10 must be capitalised into asset cost.',
    defaultRemarks: {
      efficiencyReasoning: 'Verified capital vs revenue criterion plus AS 10 pre-ready capitalisation exception.',
      criticalMisses: ['Omitting AS 10 distinction between initial overhaul vs routine future repairs'],
      suggestions: ['State clear rule: Benefit > 12 months + Asset readiness test']
    }
  },
  {
    id: 'th_fnd_law_1',
    subjectId: 'Law',
    chapterName: 'The Indian Contract Act 1872: Nature and Offer-Acceptance',
    title: 'Offer vs Invitation to Offer & Counter Offer Rule',
    difficulty: 'Moderate',
    marks: 6,
    icaiExamRef: 'CA Foundation Nov 2024',
    question: 'Mr. X wrote a letter offering to sell his vintage car for ₹8,00,000. Mr. Y replied offering ₹7,20,000. When X declined, Y wrote again accepting the original ₹8,00,000 price. Advise whether X is legally bound to sell.',
    keyConcepts: [
      { keyword: 'counter offer', category: 'Provision', description: 'Modifying original terms destroys the original offer.' },
      { keyword: 'Hyde v. Wrench', category: 'Rule', description: 'Original offer cannot be revived once rejected by counter-offer.' },
      { keyword: 'Section 7', category: 'Section', description: 'Acceptance must be absolute and unqualified.' }
    ],
    shortSuggestedAnswer: 'No, X is not bound. Under Section 7 of the Indian Contract Act 1872, acceptance must be absolute and unqualified. Y’s reply of ₹7,20,000 operated as a Counter-Offer which legally terminated X’s original ₹8,00,000 offer (Hyde v. Wrench). Y’s subsequent assent acts as a fresh offer which X is free to reject.',
    defaultRemarks: {
      efficiencyReasoning: 'Requires citing Sec 7 absolute acceptance and Counter-Offer termination rule.',
      criticalMisses: ['Missing Hyde v. Wrench case principle or Sec 7'],
      suggestions: ['Highlight clearly that a rejected offer cannot be unilaterally revived']
    }
  },
  {
    id: 'th_fnd_math_1',
    subjectId: 'MathStats',
    chapterName: 'Measures of Central Tendency and Dispersion',
    title: 'Origin vs Scale Invariance of Dispersion vs Central Tendency',
    difficulty: 'Moderate',
    marks: 4,
    icaiExamRef: 'CA Foundation Concept Audit',
    question: 'If variable Y = 3X − 20 and Mean(X) = 15, Standard Deviation(X) = 4, determine Mean(Y) and Standard Deviation(Y) explaining the origin and scale rules.',
    keyConcepts: [
      { keyword: 'origin and scale', category: 'Rule', description: 'Mean depends on both origin shift and scale factor.' },
      { keyword: 'independent of origin', category: 'Provision', description: 'SD ignores constant subtraction -20 and scales strictly by |3|.' }
    ],
    shortSuggestedAnswer: 'Mean depends on both origin and scale: Mean(Y) = 3(15) - 20 = 25. Standard Deviation is independent of shift of origin (-20) and affected solely by absolute magnitude of scale (|3|): SD(Y) = |3| × 4 = 12.',
    defaultRemarks: {
      efficiencyReasoning: 'Tests algebraic invariance rules for AM vs SD.',
      criticalMisses: ['Applying origin shift -20 mistakenly to Standard Deviation'],
      suggestions: ['Always emphasize absolute scale |b| for SD']
    }
  },
  {
    id: 'th_fnd_econ_1',
    subjectId: 'Econ',
    chapterName: 'Price Determination in Different Markets',
    title: 'Kinked Demand Curve & Price Rigidity in Oligopoly',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'CA Foundation May 2025',
    question: 'Explain why prices tend to remain rigid under Paul Sweezy’s Kinked Demand Curve model in an oligopoly market.',
    keyConcepts: [
      { keyword: 'kink', category: 'Rule', description: 'Upper segment elastic; lower segment inelastic at ruling price.' },
      { keyword: 'discontinuous MR', category: 'Provision', description: 'Vertical gap in MR allows MC shifts without altering equilibrium price.' }
    ],
    shortSuggestedAnswer: 'In Sweezy’s oligopoly model, rivals match price cuts (making lower demand inelastic) but ignore price hikes (making upper demand elastic). This creates a kink at prevailing price and a discontinuous vertical gap in the MR curve, allowing Marginal Cost to fluctuate within the gap while leaving profit-maximising price and output unchanged.',
    defaultRemarks: {
      efficiencyReasoning: 'Assesses asymmetric rival reaction and discontinuous MR gap.',
      criticalMisses: ['Missing discontinuous vertical gap in Marginal Revenue curve'],
      suggestions: ['Mention elasticity contrast above vs below kink']
    }
  },
  {
    id: 'th_int_adv_1',
    subjectId: 'AdvAcc',
    chapterName: 'Asset Based Accounting Standards (AS 2, AS 10, AS 13, AS 16, AS 19, AS 26, AS 28)',
    title: 'AS 16 Borrowing Costs — Suspension & Cessation of Capitalisation',
    difficulty: 'Advanced',
    marks: 5,
    icaiExamRef: 'CA Inter May 2025',
    question: 'State the circumstances under AS 16 where capitalisation of borrowing costs on a qualifying asset must be suspended versus permanently ceased.',
    keyConcepts: [
      { keyword: 'interrupted', category: 'Standard', description: 'Extended interruption of active development suspends capitalisation.' },
      { keyword: 'substantially complete', category: 'Standard', description: 'Cessation triggers once physical construction is substantially ready for use.' },
      { keyword: 'temporary delay', category: 'Provision', description: 'Normal technical/administrative hold does NOT suspend capitalisation.' }
    ],
    shortSuggestedAnswer: 'Under AS 16, capitalisation is suspended during extended periods of active development interruption (e.g., prolonged labour strike or financing halt), unless the delay is a necessary technical part of getting the asset ready (e.g., high water bridge waiting period). Capitalisation ceases permanently once substantially all activities necessary to prepare the qualifying asset for its intended use or sale are complete.',
    defaultRemarks: {
      efficiencyReasoning: 'Checks AS 16 timing distinction between suspension and cessation.',
      criticalMisses: ['Confusing normal technical delays with abnormal prolonged suspension'],
      suggestions: ['Include standard AS 16 phrase: substantially all activities complete']
    }
  },
  {
    id: 'th_int_claw_1',
    subjectId: 'CorpLaw',
    chapterName: 'Declaration and Payment of Dividend',
    title: 'Dividend Out of Accumulated Free Reserves (Rule 3 Restrictions)',
    difficulty: 'Advanced',
    marks: 5,
    icaiExamRef: 'CA Inter Jan 2026',
    question: 'In case of inadequacy or absence of profits in a financial year, state the four conditions under Section 123(1) read with Rule 3 for declaring dividend out of free reserves.',
    keyConcepts: [
      { keyword: 'average rate', category: 'Rule', description: 'Dividend rate <= average of rates in 3 immediately preceding years.' },
      { keyword: '1/10th', category: 'Rule', description: 'Withdrawal <= 1/10th of Paid-up Capital + Free Reserves.' },
      { keyword: '15%', category: 'Rule', description: 'Balance of reserves post withdrawal >= 15% of Paid-up Share Capital.' }
    ],
    shortSuggestedAnswer: 'Under Rule 3 of Companies (Declaration & Payment of Dividend) Rules 2014: (1) Rate <= average of 3 preceding years (inapplicable if zero dividend in all 3 years); (2) Total amount drawn <= 1/10th of Paid-up Share Capital + Free Reserves; (3) Drawn amount must first set off current-year losses; (4) Reserve balance post-withdrawal >= 15% of Paid-up Share Capital.',
    defaultRemarks: {
      efficiencyReasoning: 'Verifies all 4 Rule 3 numerical caps accurately.',
      criticalMisses: ['Omitting step to first set off current-year losses or 15% residual floor'],
      suggestions: ['Cite Sec 123(1) second proviso + Rule 3 explicitly']
    }
  },
  {
    id: 'th_int_tax_1',
    subjectId: 'Tax',
    chapterName: 'Input Tax Credit (ITC) & Computation of GST Liability',
    title: 'Blocked Credits u/s 17(5) — Works Contract vs Plant & Machinery',
    difficulty: 'Advanced',
    marks: 6,
    icaiExamRef: 'CA Inter Sep 2025',
    question: 'Discuss ITC eligibility under Section 17(5) on works contract services availed for constructing (a) a corporate office building, and (b) foundation concrete exclusively supporting heavy factory machinery.',
    keyConcepts: [
      { keyword: '17(5)(c)', category: 'Section', description: 'Blocks works contract for immovable property except Plant & Machinery.' },
      { keyword: 'foundation', category: 'Provision', description: 'Structural support for Plant & Machinery qualifies as Plant & Machinery.' }
    ],
    shortSuggestedAnswer: '(a) Under Sec 17(5)(c) of CGST Act, ITC is strictly blocked on works contract services for construction of immovable property (corporate office) when capitalised. (b) However, the statutory Explanation to Sec 17 explicitly includes foundation and structural supports used to fix machinery to earth within "Plant and Machinery", making ITC fully admissible on factory machine foundations.',
    defaultRemarks: {
      efficiencyReasoning: 'Tests exact Sec 17(5)(c) exception for Plant & Machinery foundation.',
      criticalMisses: ['Omitting Explanation distinguishing general building from P&M structural foundation'],
      suggestions: ['Also note routine repairs charged to P&L (not capitalised) retain ITC']
    }
  },
  {
    id: 'th_int_cost_1',
    subjectId: 'Cost',
    chapterName: 'Concepts of Activity Based Costing (ABC)',
    title: 'Traditional Absorption vs Activity Based Costing Cost Drivers',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'CA Inter Nov 2024',
    question: 'Why does Activity Based Costing (ABC) overcome cost distortion compared to Traditional Absorption Costing when overhead proportions are high?',
    keyConcepts: [
      { keyword: 'cost pools', category: 'Provision', description: 'Homogeneous activity cost pools replace single department pools.' },
      { keyword: 'cost drivers', category: 'Rule', description: 'Transaction/batch/product-sustaining drivers eliminate volume bias.' }
    ],
    shortSuggestedAnswer: 'Traditional absorption relies on broad volume-based bases (labour/machine hours), over-costing high-volume simple products and under-costing low-volume complex batches. ABC links indirect overheads to homogeneous Activity Cost Pools consumed via cause-and-effect Cost Drivers (setups, inspections, purchase orders), reflecting true resource consumption.',
    defaultRemarks: {
      efficiencyReasoning: 'Assesses volume distortion vs cause-effect cost drivers.',
      criticalMisses: ['Not contrasting high-volume simple vs low-volume complex batch bias'],
      suggestions: ['Mention Cooper & Kaplan 4 hierarchy levels: Unit, Batch, Product, Facility']
    }
  },
  {
    id: 'th_int_aud_1',
    subjectId: 'AuditInter',
    chapterName: 'Ethics and Terms of Audit Engagements (Professional Ethics, SA 210, SQC 1 & SA 220)',
    title: 'SA 210 Preconditions for an Audit & Scope Limitations Prior to Acceptance',
    difficulty: 'Advanced',
    marks: 5,
    icaiExamRef: 'CA Inter May 2025',
    question: 'What are the preconditions for an audit under SA 210, and how must the auditor respond if management imposes a prior scope limitation likely to result in Disclaimer of Opinion?',
    keyConcepts: [
      { keyword: 'acceptable FRF', category: 'Standard', description: 'Determine acceptability of applicable Financial Reporting Framework.' },
      { keyword: 'management responsibilities', category: 'Standard', description: 'Premise acknowledgement for FS prep, internal control & unrestricted access.' },
      { keyword: 'not accept', category: 'Provision', description: 'Decline engagement unless required by law.' }
    ],
    shortSuggestedAnswer: 'Under SA 210, preconditions require: (1) Acceptable applicable Financial Reporting Framework (FRF), and (2) Management acknowledgement of responsibilities for preparing FS, maintaining internal control, and granting unrestricted access/information. If management imposes a scope limitation beforehand likely leading to Disclaimer of Opinion, the auditor SHALL NOT accept the engagement unless compelled by statute.',
    defaultRemarks: {
      efficiencyReasoning: 'Checks dual SA 210 preconditions and mandatory refusal gate.',
      criticalMisses: ['Failing to state statutory mandate override exception'],
      suggestions: ['Detail all three management responsibility elements explicitly']
    }
  },
  {
    id: 'th_int_fmsm_1',
    subjectId: 'FMSM',
    chapterName: 'Management of Working Capital (Operating Cycle, Debtors/Factoring, Cash/Treasury & Payables)',
    title: 'Aggressive vs Conservative Working Capital Financing & Operating Cycle',
    difficulty: 'Moderate',
    marks: 5,
    icaiExamRef: 'CA Inter Jan 2026',
    question: 'Contrast Aggressive vs Conservative working capital financing policies in terms of liquidity risk, profitability, and reliance on short-term vs long-term funds.',
    keyConcepts: [
      { keyword: 'permanent working capital', category: 'Provision', description: 'Minimum continuous core level needed year-round.' },
      { keyword: 'short-term', category: 'Rule', description: 'Aggressive finances even part of permanent WC with short-term debt.' }
    ],
    shortSuggestedAnswer: 'A Conservative policy finances all permanent and part of seasonal working capital via long-term funds—yielding higher safety/liquidity at lower profitability due to higher interest cost. An Aggressive policy uses cheaper short-term debt to fund fluctuating plus part of permanent working capital—maximising ROE while exposing the firm to sharp refinancing and interest-rate risk.',
    defaultRemarks: {
      efficiencyReasoning: 'Evaluates Risk-Return trade-off across Permanent vs Fluctuating WC.',
      criticalMisses: ['Omitting permanent vs fluctuating WC hedging middle ground'],
      suggestions: ['Include Matching/Hedging approach as balanced benchmark']
    }
  }
];

export const FOUNDATION_INTER_CHAPTERS_MAP: Record<NonFinalSubjectId, string[]> = {
  Accounts: ['Theoretical Framework & Accounting Standards', 'Bank Reconciliation Statement (BRS)', 'Inventories Valuation', 'Partnership Accounts (Admission, Retirement, Death, Dissolution)', 'Company Accounts (Issue of Shares, Debentures, Forfeiture)'],
  Law: ['The Indian Contract Act 1872: Consideration & Capacity', 'The Sale of Goods Act 1930: Transfer of Ownership & Unpaid Seller', 'The Indian Partnership Act 1932', 'The Companies Act 2013 (Basics & Incorporation)'],
  MathStats: ['Mathematics of Finance (Simple & Compound Interest, Annuities)', 'Permutations and Combinations', 'Theoretical Distributions (Binomial, Poisson, Normal)', 'Correlation and Regression'],
  Econ: ['Theory of Demand and Supply', 'Theory of Production and Cost', 'Price Determination in Different Markets', 'Determination of National Income'],
  AdvAcc: [
    'Presentation & Disclosure Based AS (AS 1, AS 3, AS 17, AS 18, AS 20, AS 24, AS 25)',
    'Asset Based Accounting Standards (AS 2, AS 10, AS 13, AS 16, AS 19, AS 26, AS 28)',
    'Accounting Standards Impacting P&L (AS 4, AS 5, AS 7, AS 9, AS 11, AS 12, AS 22)',
    'Buy Back of Securities',
    'Amalgamation of Companies (AS 14)',
    'Consolidated Financial Statements (AS 21, AS 23 & AS 27)'
  ],
  CorpLaw: [
    'Acceptance of Deposits by Companies',
    'Management and Administration',
    'Declaration and Payment of Dividend',
    'Audit and Auditors',
    'The Foreign Exchange Management Act, 1999'
  ],
  Tax: [
    'Residential Status and Scope of Total Income',
    'Heads of Income: Profits and Gains of Business or Profession (PGBP)',
    'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
    'Input Tax Credit (ITC) & Computation of GST Liability'
  ],
  Cost: [
    'Material Cost (Procurement, GeM/ERP Digital Costing, EOQ, Inventory Control & Losses)',
    'Concepts of Activity Based Costing (ABC)',
    'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
    'Marginal Costing (CVP Analysis, BEP, Margin of Safety & Short-Term Decisions)'
  ],
  AuditInter: [
    'Risk Assessment and Internal Control (SA 315, SA 320, SA 330 & Digital Audit)',
    'Audit Documentation (SA 230)',
    'Audit Report (SA 700, SA 701, SA 705, SA 706, SA 710, Branch/Joint Audit & CARO 2020)',
    'Ethics and Terms of Audit Engagements (Professional Ethics, SA 210, SQC 1 & SA 220)'
  ],
  FMSM: [
    'Cost of Capital (Kd, Kp, Ke, WACC & Marginal Cost of Capital)',
    'Leverages (Operating, Financial and Combined Leverages)',
    'Capital Investment Decisions (Payback, ARR, NPV, IRR, MIRR, PI, Capital Rationing & EAC)',
    'Management of Working Capital (Operating Cycle, Debtors/Factoring, Cash/Treasury & Payables)',
    'Strategic Analysis: Internal Environment (Mendelow’s Model, Strategic Drivers, SWOT & Porter’s Generic Strategies)'
  ]
};

export const FOUNDATION_INTER_PAST_PAPERS: ExtractedPastPaperQuestion[] = [
  {
    id: 'qb-fnd-acc-1',
    subjectCode: 'Accounts',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Q1(a)',
    marks: 12,
    chapterName: 'Company Accounts (Issue of Shares, Debentures, Forfeiture)',
    topicTag: 'Pro-Rata Allotment, Forfeiture & Partial Reissue',
    questionText: [
      'Aryan Industries Ltd. invited applications for 50,000 equity shares of ₹10 each at a premium of ₹2 per share payable as: ₹3 on Application, ₹5 on Allotment (including premium), and ₹4 on Final Call.',
      'Applications were received for 75,000 shares and pro-rata allotment was made. Mr. Rao holding 1,000 shares failed to pay Allotment and Final Call; his shares were forfeited and 700 shares were later reissued at ₹9 fully paid-up.'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['AS / Schedule III Share Capital & Securities Premium u/s 52 of Companies Act 2013'],
      analysisAndWorkings: [
        'Pro-rata ratio = 75,000 : 50,000 = 3 : 2. Shares applied by Mr. Rao = 1,000 × 3/2 = 1,500 shares.',
        'Application excess adjusted on Allotment = 500 × ₹3 = ₹1,500. Net unpaid on Allotment (₹5,000 − ₹1,500) = ₹3,500 (including ₹2,000 Securities Premium unpaid).',
        'Total actual cash received from Rao on Application capital = 1,500 × ₹3 = ₹4,500 (strictly towards Share Capital).'
      ],
      conclusion: 'Credit Share Forfeiture A/c with ₹4,500. Proportionate transfer to Capital Reserve on 700 reissued shares = (4,500 × 700 / 1,000) − (700 × ₹1 discount) = ₹3,150 − ₹700 = ₹2,450.'
    }
  },
  {
    id: 'qb-fnd-law-1',
    subjectCode: 'Law',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Q2(b)',
    marks: 6,
    chapterName: 'The Indian Partnership Act 1932',
    topicTag: 'Partner by Holding Out & Minor Admitted to Benefits (Sec 28 / 30)',
    questionText: [
      'Master Aarav (aged 16) was admitted to the benefits of M/s Vertex Associates with consent of all partners. Upon attaining 18 years, he failed to issue public notice electing or declining partnership within 6 months.'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['Section 30(5) & 30(7) of the Indian Partnership Act, 1932'],
      analysisAndWorkings: [
        'Under Sec 30(5), a minor must give public notice within 6 months of attaining majority or obtaining knowledge of admission (whichever is later).',
        'Failure to give public notice automatically deems him a full partner on expiry of the 6-month window.'
      ],
      conclusion: 'Aarav becomes personally liable to third parties for all acts of the firm done SINCE the original date of his admission to benefits u/s 30(7)(a).'
    }
  },
  {
    id: 'qb-int-advacc-1',
    subjectCode: 'AdvAcc',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Q2(a)',
    marks: 14,
    chapterName: 'Amalgamation of Companies (AS 14)',
    topicTag: 'Purchase Consideration (Net Payment vs Net Assets) — AS 14',
    questionText: [
      'Sigma Ltd. takes over Beta Ltd. agreeing to discharge 10% Preference Shareholders at 10% premium by issuing 12% Preference Shares in Sigma Ltd., and pay ₹15 cash plus 2 Equity Shares of ₹10 (Market Value ₹25) for every 3 Equity Shares held in Beta Ltd. (60,000 Equity Shares).'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['AS 14 Accounting for Amalgamations (Purchase Method)'],
      analysisAndWorkings: [
        'Equity Shares issued = (60,000 / 3) × 2 = 40,000 shares @ ₹25 = ₹10,00,000.',
        'Cash to Equity Holders = (60,000 / 3) × ₹15 = ₹3,00,000.'
      ],
      conclusion: 'Under AS 14, only payments flowing directly to Preference and Equity Shareholders constitute Purchase Consideration; debenture settlements are NOT part of PC.'
    }
  },
  {
    id: 'qb-int-tax-1',
    subjectCode: 'Tax',
    attempt: 'May-26',
    attemptLabel: 'May 2026',
    questionNumber: 'Q1',
    marks: 14,
    chapterName: 'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
    topicTag: 'Total Income Computation under Sec 115BAC(1A) Default Regime',
    questionText: [
      'Mr. Vikram (resident, aged 42) earned Net Taxable Salary of ₹11,80,000 (before ₹75,000 Standard Deduction), Self-Occupied House Property interest paid ₹2,00,000, Bank Savings Interest ₹18,000, and invested ₹1,50,000 in PPF.'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['Section 115BAC(1A) Income-tax Act, 1961 (Default Regime)'],
      analysisAndWorkings: [
        'Salary after ₹75,000 Standard Deduction u/s 16(ia) = ₹11,05,000.',
        'Self-occupied House Property loss u/s 24(b) (₹2,00,000) is NOT allowed under 115BAC(1A).',
        'Bank Savings Interest ₹18,000 added to Income from Other Sources (80TTA & 80C PPF disallowed under 115BAC).'
      ],
      conclusion: 'Total Income = ₹11,23,000; Slab tax computed under Sec 115BAC(1A) rates plus 4% Health & Education Cess.'
    }
  },
  {
    id: 'qb-int-cost-1',
    subjectCode: 'Cost',
    attempt: 'Sep-25',
    attemptLabel: 'September 2025',
    questionNumber: 'Q3(a)',
    marks: 10,
    chapterName: 'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
    topicTag: 'Material Cost, Price, Usage, Mix & Yield Variances',
    questionText: [
      'Standard mix for 100 kg output requires 60 kg Material A @ ₹20/kg and 60 kg Material B @ ₹10/kg. Actual output of 900 kg consumed 550 kg of A @ ₹22/kg and 650 kg of B @ ₹9/kg.'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['Standard Costing — Variance Decomposition Framework'],
      analysisAndWorkings: [
        'Total Actual Input = 550 + 650 = 1,200 kg. Standard Input for 900 kg actual output = (120/100) × 900 = 1,080 kg (540 kg A + 540 kg B).',
        'Revised Standard Quantity (RSQ for 1,200 kg actual input) = 600 kg A + 600 kg B.'
      ],
      conclusion: 'Material Price Variance = ₹450(A); Material Mix Variance = ₹500(F); Material Yield Variance = ₹1,800(A).'
    }
  },
  {
    id: 'qb-int-aud-1',
    subjectCode: 'AuditInter',
    attempt: 'Jan-26',
    attemptLabel: 'January 2026',
    questionNumber: 'Q4(a)',
    marks: 5,
    chapterName: 'Audit Report (SA 700, SA 701, SA 705, SA 706, SA 710, Branch/Joint Audit & CARO 2020)',
    topicTag: 'CARO 2020 Applicability & Exemption Criteria',
    questionText: [
      'A Private Limited Company has Paid-up Share Capital + Reserves of ₹95 Lakhs, borrowings from bank of ₹1.20 Crore, and Turnover of ₹9.50 Crore during the financial year. Examine whether CARO 2020 applies.'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['CARO 2020 Para 1(2) — Private Company Exemption Thresholds'],
      analysisAndWorkings: [
        'Private company (not subsidiary/holding of public co) is exempt if ALL THREE hold: (i) PUC + Reserves <= ₹1 Cr; (ii) Total borrowings <= ₹1 Cr at any point; (iii) Total revenue <= ₹10 Cr.',
        'Here bank borrowing is ₹1.20 Crore (> ₹1 Crore limit).'
      ],
      conclusion: 'Even one breach removes exemption: CARO 2020 IS MANDATORILY APPLICABLE to the company.'
    }
  },
  {
    id: 'qb-int-fmsm-1',
    subjectCode: 'FMSM',
    attempt: 'May-25',
    attemptLabel: 'May 2025',
    questionNumber: 'Q5(b)',
    marks: 10,
    chapterName: 'Capital Investment Decisions (Payback, ARR, NPV, IRR, MIRR, PI, Capital Rationing & EAC)',
    topicTag: 'Replacement Capital Budgeting Incremental Cash Flows',
    questionText: [
      'Evaluate replacing a 3-year-old machine (WDV ₹4,00,000, current salvage ₹2,50,000) with a new CNC machine costing ₹10,00,000 generating annual operating cost savings of ₹2,80,000 (WACC 12%, Tax Rate 30%, Block Depreciation 15%).'
    ],
    suggestedAnswer: {
      provisionOrStandard: ['Capital Budgeting Incremental Cash Flow Principle'],
      analysisAndWorkings: [
        'Net Incremental Outflow at t=0 = New Capex ₹10,00,000 − Old Machine Salvage ₹2,50,000 = ₹7,50,000.',
        'Depreciation base increments by ₹7,50,000 (yielding tax shield @ 30% on incremental depreciation).'
      ],
      conclusion: 'Compare PV of incremental after-tax operating savings + incremental depreciation tax shield against ₹7,50,000.'
    }
  }
];

export const FOUNDATION_INTER_REVISION_VIDEOS: RevisionVideoReference[] = [
  {
    id: 'vid-fnd-acc-1',
    subjectId: 'Accounts',
    chapterName: 'Company Accounts (Issue of Shares, Debentures, Forfeiture)',
    facultyName: 'ICAI BOS Academic Wing',
    videoTitle: 'CA Foundation Paper 1: Share Forfeiture & Pro-Rata Allotment Marathon',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '55 mins',
    tags: ['CA Foundation', 'Share Capital', 'Forfeiture'],
    description: 'Step-by-step pro-rata excess allotment adjustment and proportionate Capital Reserve calculation.'
  },
  {
    id: 'vid-fnd-law-1',
    subjectId: 'Law',
    chapterName: 'The Indian Contract Act 1872: Consideration & Capacity',
    facultyName: 'ICAI Legal Faculty',
    videoTitle: 'Indian Contract Act 1872 — Consideration & Sec 25 Exceptions Fast-Track',
    youtubeUrl: 'https://www.youtube.com/watch?v=N2tOhF0bpTo',
    youtubeVideoId: 'N2tOhF0bpTo',
    duration: '45 mins',
    tags: ['Contract Act', 'Consideration', 'Minor Capacity'],
    description: 'High-yield case laws including Mohori Bibee, Chinnaya v. Ramayya, and Sec 25 exceptions.'
  },
  {
    id: 'vid-fnd-math-1',
    subjectId: 'MathStats',
    chapterName: 'Mathematics of Finance (Simple & Compound Interest, Annuities)',
    facultyName: 'CA Quant Revision',
    videoTitle: 'Time Value of Money & Annuity Calculator Tricks',
    youtubeUrl: 'https://www.youtube.com/watch?v=BBERU5rybeA',
    youtubeVideoId: 'BBERU5rybeA',
    duration: '40 mins',
    tags: ['TVM', 'Annuities', 'Calculator Tricks'],
    description: 'Rapid 12-button calculator techniques for Compound Interest, Annuity Due, and Effective Interest Rate.'
  },
  {
    id: 'vid-fnd-econ-1',
    subjectId: 'Econ',
    chapterName: 'Determination of National Income',
    facultyName: 'CA Economics Desk',
    videoTitle: 'Keynesian National Income Determination & Multiplier',
    youtubeUrl: 'https://www.youtube.com/watch?v=cbwmM4hEBEk',
    youtubeVideoId: 'cbwmM4hEBEk',
    duration: '50 mins',
    tags: ['National Income', 'Multiplier', 'Macroeconomics'],
    description: 'Complete GDP-MP to NNP-FC conversions and three-sector Keynesian equilibrium.'
  },
  {
    id: 'vid-int-advacc-1',
    subjectId: 'AdvAcc',
    chapterName: 'Amalgamation of Companies (AS 14)',
    facultyName: 'CA Inter Accounts Desk',
    videoTitle: 'AS 14 Amalgamation Merger vs Purchase & Internal Reconstruction',
    youtubeUrl: 'https://www.youtube.com/watch?v=0CEGr5R6fBY',
    youtubeVideoId: '0CEGr5R6fBY',
    duration: '60 mins',
    tags: ['AS 14', 'Purchase Consideration', 'Internal Reconstruction'],
    description: 'Purchase consideration methods, Statutory Reserve adjustments, and Reconstruction Capital Reduction A/c.'
  },
  {
    id: 'vid-int-claw-1',
    subjectId: 'CorpLaw',
    chapterName: 'Audit and Auditors',
    facultyName: 'CA Inter Corporate Law',
    videoTitle: 'CSR Sec 135, Auditor Rotation Sec 139, Disqualifications Sec 141 & FEMA 1999',
    youtubeUrl: 'https://www.youtube.com/watch?v=N2tOhF0bpTo',
    youtubeVideoId: 'N2tOhF0bpTo',
    duration: '50 mins',
    tags: ['Companies Act 2013', 'Sec 139', 'FEMA 1999'],
    description: 'Master all numerical limits under Accounts, Audit of Companies, and FEMA Current/Capital Account transactions.'
  },
  {
    id: 'vid-int-tax-1',
    subjectId: 'Tax',
    chapterName: 'Computation of Total Income and Tax Payable under Alternative Tax Regimes',
    facultyName: 'CA Inter Tax Marathon',
    videoTitle: 'Section 115BAC(1A) Default Regime vs Old Regime Complete Revision',
    youtubeUrl: 'https://www.youtube.com/watch?v=BBERU5rybeA',
    youtubeVideoId: 'BBERU5rybeA',
    duration: '65 mins',
    tags: ['115BAC', 'Direct Tax', 'Rebate 87A'],
    description: 'Latest slab rates, Marginal Relief, and GST ITC Sec 16/17(5) integration.'
  },
  {
    id: 'vid-int-cost-1',
    subjectId: 'Cost',
    chapterName: 'Standard Costing (Material, Labour, Variable & Fixed Overhead Variances)',
    facultyName: 'CA Costing Capsule',
    videoTitle: 'Standard Costing — Material, Labour & Overhead Variance Formulas',
    youtubeUrl: 'https://www.youtube.com/watch?v=cbwmM4hEBEk',
    youtubeVideoId: 'cbwmM4hEBEk',
    duration: '55 mins',
    tags: ['Standard Costing', 'Variances', 'EOQ'],
    description: 'Error-proof columnar table method for Mix, Yield, Idle Time, and Fixed OH Volume variances.'
  },
  {
    id: 'vid-int-aud-1',
    subjectId: 'AuditInter',
    chapterName: 'Audit Report (SA 700, SA 701, SA 705, SA 706, SA 710, Branch/Joint Audit & CARO 2020)',
    facultyName: 'CA Inter Audit',
    videoTitle: 'SA 700, 705, 706 & CARO 2020 Summary Revision',
    youtubeUrl: 'https://www.youtube.com/watch?v=0CEGr5R6fBY',
    youtubeVideoId: '0CEGr5R6fBY',
    duration: '45 mins',
    tags: ['SA 705', 'CARO 2020', 'Audit Report'],
    description: 'Decision tree for Qualified vs Adverse vs Disclaimer of Opinion plus CARO applicability clauses.'
  },
  {
    id: 'vid-int-fmsm-1',
    subjectId: 'FMSM',
    chapterName: 'Cost of Capital (Kd, Kp, Ke, WACC & Marginal Cost of Capital)',
    facultyName: 'CA FM & SM Revision',
    videoTitle: 'WACC, Leverages & Porter/Mendelow/ADL/GE Strategic Frameworks Capsule',
    youtubeUrl: 'https://www.youtube.com/watch?v=N2tOhF0bpTo',
    youtubeVideoId: 'N2tOhF0bpTo',
    duration: '50 mins',
    tags: ['WACC', 'Leverage', 'Strategic Management'],
    description: 'Post-tax cost of debt, CAPM, DOL/DFL/DCL sensitivity, and BCG/Ansoff/ADL/GE/Mendelow frameworks.'
  }
];

