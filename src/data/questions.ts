/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubjectId, QuizQuestionItem, GeneralQuestion, CaseScenario } from '../types';
import { CASE_SCENARIOS_FR } from './caseScenariosFR';
import { AUDIT_QUIZ_QUESTIONS } from './auditQuestions';
import { FOUNDATION_INTER_QUIZ_QUESTIONS } from './foundationAndInterPracticeData';
import { CMA_QUIZ_QUESTIONS } from './cmaSyllabusData';

const FR_CASE_ITEMS: QuizQuestionItem[] = CASE_SCENARIOS_FR.map(cs => ({
  type: 'case',
  data: cs
}));

export const QUIZ_QUESTIONS: Record<SubjectId, QuizQuestionItem[]> = {
  AFM: [
    {
      type: 'general',
      data: {
        id: 'AFM_G_01',
        subjectId: 'AFM',
        chapterName: 'Foreign Exchange Risk Management',
        questionText: 'An Indian exporter has a receivable of USD 500,000 due in 3 months. The spot USD/INR rate is 83.40 / 83.45. The 3-month forward premium is 15 / 20 paise. The exporter wishes to hedge using a Forward Contract. At what rate will the forward contract be booked?',
        options: [
          '₹83.40 (Current Spot Bid)',
          '₹83.55 (Spot Bid + Forward Bid Premium of 15 paise)',
          '₹83.65 (Spot Ask + Forward Ask Premium of 20 paise)',
          '₹83.58 (Spot Average + Forward Average)'
        ],
        correctOptionIndex: 1,
        explanation: 'For receivables, the exporter will sell USD, which means the bank buys USD. The bank applies the Bid rate. Spot Bid = 83.40. Add 3-month Forward Bid premium = 0.15. Direct Bid Forward Rate = 83.40 + 0.15 = 83.55. (Always buy low/sell high from the bank perspective).'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'AFM_G_02',
        subjectId: 'AFM',
        chapterName: 'Security Analysis & Portfolio Management',
        questionText: 'Given the risk-free rate of return (Rf) of 6%, expected market return (Rm) of 13%, and a portfolio beta of 1.4. The actual expected return of the portfolio is calculated to be 15.5%. What is the alpha (α) of this portfolio, and does it outperform the CAPM requirement?',
        options: [
          'Alpha is -0.3%; the portfolio underperforms.',
          'Alpha is +0.3%; the portfolio outperforms.',
          'Alpha is -0.8%; the portfolio underperforms.',
          'Alpha is +1.5%; the portfolio outperforms.'
        ],
        correctOptionIndex: 0,
        explanation: 'According to CAPM, Required Return = Rf + Beta * (Rm - Rf) = 6% + 1.4 * (13% - 6%) = 6% + 1.4 * 7% = 6% + 9.8% = 15.8%. Alpha = Actual Return - Required Return = 15.5% - 15.8% = -0.3%. Since alpha is negative, it underperforms.'
      } as GeneralQuestion
    },
    {
      type: 'case',
      data: {
        id: 'AFM_C_01',
        subjectId: 'AFM',
        chapterName: 'Mergers & Acquisitions',
        scenarioTitle: 'Corporate Restructuring, Valuation & Synergy Allocation of Vayu Winds & Akash Power',
        scenarioText: 'Vayu Winds Ltd. (Acquirer) is evaluating a strategic takeover of Akash Power Ltd. (Target) to consolidate its renewable turbine grid. Financial data prior to the announcement is as follows:\n\n• Earnings After Tax (EAT): Vayu Winds = ₹400 Lakhs, Akash Power = ₹120 Lakhs.\n• Number of Equity Shares: Vayu Winds = 20 Lakhs, Akash Power = 10 Lakhs.\n• Market Price per Share (MPS): Vayu Winds = ₹240, Akash Power = ₹90.\n• Free Cash Flow to Firm (FCFF) of combined entity is projected to increase by ₹45 Lakhs per annum perpetually due to operational synergies, discounted at a post-merger WACC of 11.25%.\n\nVayu Winds proposes a share swap ratio based on the prevailing market price of both companies.',
        subQuestions: [
          {
            id: 'AFM_CS_1_1',
            subjectId: 'AFM',
            chapterName: 'Mergers & Acquisitions',
            questionText: 'What is the Share Swap Ratio offered based on current market prices?',
            options: [
              '0.375 shares of Vayu Winds for every 1 share of Akash Power',
              '2.67 shares of Vayu Winds for every 1 share of Akash Power',
              '0.500 shares of Vayu Winds for every 1 share of Akash Power',
              '0.750 shares of Vayu Winds for every 1 share of Akash Power'
            ],
            correctOptionIndex: 0,
            explanation: 'Swap Ratio based on Market Price = Target MPS / Acquirer MPS = ₹90 / ₹240 = 0.375. Vayu Winds issues 0.375 shares for every 1 share held in Akash Power (total 3.75 Lakh new shares).'
          },
          {
            id: 'AFM_CS_1_2',
            subjectId: 'AFM',
            chapterName: 'Mergers & Acquisitions',
            questionText: 'What will be the post-merger EPS of Vayu Winds Ltd. immediately upon amalgamation before considering operational synergies?',
            options: [
              '₹21.89',
              '₹26.00',
              '₹21.33',
              '₹17.33'
            ],
            correctOptionIndex: 0,
            explanation: 'Combined EAT (pre-synergy) = ₹400L + ₹120L = ₹520 Lakhs. Shares issued to Akash = 10L × 0.375 = 3.75 Lakhs. Total post-merger shares = 20L + 3.75L = 23.75 Lakhs. Post-merger EPS = ₹520L / 23.75L = ₹21.89.'
          },
          {
            id: 'AFM_CS_1_3',
            subjectId: 'AFM',
            chapterName: 'Mergers & Acquisitions',
            questionText: 'What is the equivalent post-merger EPS for a former shareholder of Akash Power Ltd. (pre-synergy), and what is the EPS accretion/dilution impact?',
            options: [
              '₹12.00; Zero EPS impact',
              '₹21.89; EPS gain of ₹9.89 per share',
              '₹8.21; EPS dilution of ₹3.79 per share',
              '₹5.48; EPS dilution of ₹6.52 per share'
            ],
            correctOptionIndex: 2,
            explanation: 'Equivalent post-merger EPS = Post-merger EPS × Swap Ratio = ₹21.895 × 0.375 = ₹8.21. Since Akash Power’s pre-merger EPS was ₹120L / 10L = ₹12.00, target shareholders experience an EPS dilution of ₹3.79 per share because Acquirer had a higher P/E ratio (12x) than Target (7.5x).'
          },
          {
            id: 'AFM_CS_1_4',
            subjectId: 'AFM',
            chapterName: 'Mergers & Acquisitions',
            questionText: 'What is the maximum Exchange Ratio Vayu Winds Ltd. can offer without diluting its own pre-merger EPS of ₹20.00 (ignoring synergy)?',
            options: [
              '0.60 shares of Vayu for 1 share of Akash',
              '0.375 shares of Vayu for 1 share of Akash',
              '0.50 shares of Vayu for 1 share of Akash',
              '0.80 shares of Vayu for 1 share of Akash'
            ],
            correctOptionIndex: 0,
            explanation: 'To maintain Acquirer pre-merger EPS (₹400L / 20L = ₹20), the maximum exchange ratio equals Target EPS / Acquirer EPS = ₹12 / ₹20 = 0.60:1.'
          },
          {
            id: 'AFM_CS_1_5',
            subjectId: 'AFM',
            chapterName: 'Corporate Valuation',
            questionText: 'Incorporating the capitalized value of perpetual FCFF operational synergies (₹45 Lakhs p.a. at 11.25% WACC), what is the theoretical post-merger Market Price per Share of the combined company under the 0.375:1 swap ratio?',
            options: [
              '₹240.00',
              '₹256.84',
              '₹238.50',
              '₹272.10'
            ],
            correctOptionIndex: 1,
            explanation: 'Pre-merger Market Cap: Vayu = 20L × ₹240 = ₹4,800L; Akash = 10L × ₹90 = ₹900L. Present Value of perpetual synergy = ₹45L / 0.1125 = ₹400 Lakhs. Total Combined Market Value = 4,800 + 900 + 400 = ₹6,100 Lakhs. Post-merger MPS = ₹6,100L / 23.75L shares = ₹256.84.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'AFM_C_02',
        subjectId: 'AFM',
        chapterName: 'Foreign Exchange Risk Management',
        scenarioTitle: 'Multi-Concept Treasury Hedging & Cross-Border Capital Budgeting of Zenith Global Exports',
        scenarioText: 'Zenith Global Exports Ltd. (an Indian MNC) has an export receivable of USD 1,200,000 due in 6 months from a US customer and simultaneously evaluates a US subsidiary expansion project. Market treasury quotes are:\n\n• Spot USD/INR Rate: ₹83.20 / ₹83.30\n• 6-Month Forward Swap Points: 65 / 55 paise\n• 6-Month Interest Rates (p.a.):\n  - USD Deposit Rate: 4.00% p.a. | USD Borrowing Rate: 5.00% p.a.\n  - INR Deposit Rate: 6.50% p.a. | INR Borrowing Rate: 8.00% p.a.\n• Currency Futures on NSE (Contract size USD 1,000): 6-Month Futures trading at ₹82.70.\n• The US subsidiary project requires USD 2,000,000 initial outlay today and generates guaranteed after-tax cash inflow of USD 2,300,000 at the end of 1 year (Risk-adjusted USD discount rate = 10% p.a.).',
        subQuestions: [
          {
            id: 'AFM_CS_2_1',
            subjectId: 'AFM',
            chapterName: 'Foreign Exchange Risk Management',
            questionText: 'Determine the 6-month outright Forward Bid Rate available to Zenith Global for hedging its USD 1,200,000 export receivable and the expected INR realization.',
            options: [
              'Forward Bid Rate ₹83.85; Realization ₹10,06,20,000',
              'Forward Bid Rate ₹82.55; Realization ₹9,90,60,000',
              'Forward Ask Rate ₹82.75; Realization ₹9,93,00,000',
              'Forward Bid Rate ₹82.65; Realization ₹9,91,80,000'
            ],
            correctOptionIndex: 1,
            explanation: 'Since swap points are in descending order (65 / 55 paise), USD is at a forward discount. Subtract 65 paise from Spot Bid (₹83.20): Outright 6M Forward Bid = 83.20 - 0.65 = ₹82.55. Expected realization = USD 1,200,000 × ₹82.55 = ₹9,90,60,000.'
          },
          {
            id: 'AFM_CS_2_2',
            subjectId: 'AFM',
            chapterName: 'Foreign Exchange Risk Management',
            questionText: 'If Zenith Global executes a Money Market Hedge (MMH) for the USD 1,200,000 export receivable and invests the converted INR proceeds in a 6-month INR deposit (assuming funds are not needed for working capital over the 6 months), what is the terminal INR proceeds at 6 months?',
            options: [
              '₹9,90,60,000',
              '₹10,05,73,659',
              '₹9,74,04,878',
              '₹10,12,48,000'
            ],
            correctOptionIndex: 1,
            explanation: 'Step 1: Borrow PV of USD 1,200,000 at 6-month USD borrowing rate (5% / 2 = 2.5%): Borrowed USD = 1,200,000 / 1.025 = USD 1,170,731.71. Step 2: Convert at Spot Bid (₹83.20) = ₹9,74,04,878. Step 3: Invest at 6-month INR deposit rate (6.5% / 2 = 3.25%): Maturity value = 9,74,04,878 × 1.0325 = ₹10,05,70,537 (approx ₹10,05,73,659).'
          },
          {
            id: 'AFM_CS_2_3',
            subjectId: 'AFM',
            chapterName: 'Foreign Exchange Risk Management',
            questionText: 'Comparing the Forward Hedge and the Money Market Hedge (invested at deposit rate or used to pay off 8% INR working capital borrowings), which strategy is financially superior for the exporter?',
            options: [
              'Forward Contract Hedge is superior by ₹15.10 Lakhs.',
              'Money Market Hedge is superior because USD is trading at an excessive forward discount relative to interest rate differentials.',
              'Unhedged position is mandatory under FEMA guidelines.',
              'Both yield identical INR cash flows.'
            ],
            correctOptionIndex: 1,
            explanation: 'Money Market Hedge yields ₹10,05.71 Lakhs (at 6.5% deposit rate) or ₹10,13.01 Lakhs (saving 8% INR borrowing cost), both significantly outperforming the Forward Market realization of ₹9,90.60 Lakhs due to the steep 65 paise forward discount.'
          },
          {
            id: 'AFM_CS_2_4',
            subjectId: 'AFM',
            chapterName: 'International Financial Management',
            questionText: 'For the US subsidiary project (Outlay USD 2.0M today, Inflow USD 2.3M at Year 1, USD discount rate 10%), what is the Net Present Value (NPV) in USD and its spot INR equivalent (converted at middle spot rate ₹83.25)?',
            options: [
              'USD +90,909; INR +75,68,182',
              'USD +300,000; INR +2,49,75,000',
              'USD -45,455; INR -37,84,129',
              'USD +125,000; INR +1,04,06,250'
            ],
            correctOptionIndex: 0,
            explanation: 'PV of Inflow in USD = 2,300,000 / 1.10 = USD 2,090,909.09. NPV in USD = 2,090,909.09 - 2,000,000 = +USD 90,909.09. Converted at Spot Middle Rate (₹83.25) = ₹75,68,182.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'AFM_C_03',
        subjectId: 'AFM',
        chapterName: 'Security Analysis & Portfolio Management',
        scenarioTitle: 'Portfolio Risk Optimization, CAPM Alpha & Index Futures Beta Hedging at Alpha-Veda Fund',
        scenarioText: 'Alpha-Veda Asset Management oversees an Equity Growth Portfolio valued at ₹50 Crores with the following composition and market benchmarks:\n\n• Portfolio Composition:\n  - Stock X: Weight 40%, Beta = 1.60, Expected Return = 19.0%\n  - Stock Y: Weight 35%, Beta = 1.20, Expected Return = 15.2%\n  - Stock Z: Weight 25%, Beta = 0.80, Expected Return = 11.4%\n• Market Benchmarks:\n  - Risk-Free Rate (Rf) = 6.50% p.a.\n  - Expected Market Return (Rm) = 14.50% p.a.\n  - Portfolio Standard Deviation (σp) = 18.0% | Market Standard Deviation (σm) = 12.0%\n• Derivatives Desk:\n  - NIFTY Index Futures are currently trading at 22,500 (Lot size = 50 units per contract).\n  - Fund Manager wishes to reduce the overall Portfolio Beta to 0.75 for the next 3 months ahead of macroeconomic policy announcements.',
        subQuestions: [
          {
            id: 'AFM_CS_3_1',
            subjectId: 'AFM',
            chapterName: 'Security Analysis & Portfolio Management',
            questionText: 'What is the weighted average Beta (βp) and actual expected return of the ₹50 Crore portfolio?',
            options: [
              'Portfolio Beta = 1.26; Expected Return = 15.77%',
              'Portfolio Beta = 1.20; Expected Return = 15.20%',
              'Portfolio Beta = 1.35; Expected Return = 16.40%',
              'Portfolio Beta = 1.15; Expected Return = 14.85%'
            ],
            correctOptionIndex: 0,
            explanation: 'Portfolio Beta = (0.40 × 1.60) + (0.35 × 1.20) + (0.25 × 0.80) = 0.64 + 0.42 + 0.20 = 1.26. Actual Expected Return = (0.40 × 19.0%) + (0.35 × 15.2%) + (0.25 × 11.4%) = 7.60% + 5.32% + 2.85% = 15.77%.'
          },
          {
            id: 'AFM_CS_3_2',
            subjectId: 'AFM',
            chapterName: 'Security Analysis & Portfolio Management',
            questionText: 'Compute the CAPM Equilibrium Required Return and Jensen\'s Alpha (α) of the portfolio.',
            options: [
              'CAPM Required Return = 16.58%; Jensen\'s Alpha = -0.81% (Underperforming)',
              'CAPM Required Return = 14.50%; Jensen\'s Alpha = +1.27% (Outperforming)',
              'CAPM Required Return = 15.77%; Jensen\'s Alpha = 0.00% (Fairly Priced)',
              'CAPM Required Return = 17.30%; Jensen\'s Alpha = -1.53% (Underperforming)'
            ],
            correctOptionIndex: 0,
            explanation: 'CAPM Required Return = Rf + βp × (Rm - Rf) = 6.50% + 1.26 × (14.50% - 6.50%) = 6.50% + (1.26 × 8.0%) = 6.50% + 10.08% = 16.58%. Jensen’s Alpha = Actual Return (15.77%) - CAPM Required (16.58%) = -0.81%.'
          },
          {
            id: 'AFM_CS_3_3',
            subjectId: 'AFM',
            chapterName: 'Security Analysis & Portfolio Management',
            questionText: 'What are the Sharpe Ratio and Treynor Ratio of the Alpha-Veda Portfolio?',
            options: [
              'Sharpe Ratio = 0.515; Treynor Ratio = 7.36%',
              'Sharpe Ratio = 0.667; Treynor Ratio = 8.00%',
              'Sharpe Ratio = 0.420; Treynor Ratio = 6.50%',
              'Sharpe Ratio = 0.876; Treynor Ratio = 12.51%'
            ],
            correctOptionIndex: 0,
            explanation: 'Excess Return (Rp - Rf) = 15.77% - 6.50% = 9.27%. Sharpe Ratio = (Rp - Rf) / σp = 9.27% / 18.0% = 0.515. Treynor Ratio = (Rp - Rf) / βp = 9.27% / 1.26 = 7.357% (approx 7.36%).'
          },
          {
            id: 'AFM_CS_3_4',
            subjectId: 'AFM',
            chapterName: 'Derivatives Analysis & Valuation',
            questionText: 'How many NIFTY Index Futures contracts (Index = 22,500, Lot size = 50) must the Fund Manager go SHORT or LONG to reduce the Portfolio Beta from 1.26 to 0.75?',
            options: [
              'Short 227 NIFTY Futures contracts',
              'Long 227 NIFTY Futures contracts',
              'Short 560 NIFTY Futures contracts',
              'Short 114 NIFTY Futures contracts'
            ],
            correctOptionIndex: 0,
            explanation: 'Value of 1 NIFTY Futures Contract = 22,500 × 50 = ₹11,25,000 (₹0.1125 Crore). To reduce Beta from 1.26 to 0.75, Short Contracts Required = [Portfolio Value × (β_current - β_target)] / Futures Contract Value = [₹50,00,00,000 × (1.26 - 0.75)] / ₹11,25,000 = ₹25,50,00,000 / ₹11,25,000 = 226.67 ≈ 227 contracts SHORT.'
          }
        ]
      } as CaseScenario
    }
  ],
  FR: [
    {
      type: 'general',
      data: {
        id: 'FR_G_01',
        subjectId: 'FR',
        chapterName: 'Leases (Ind AS 116)',
        questionText: 'Under Ind AS 116, which of the following is NOT of required inclusion in the initial measurement of the Lease Liability?',
        options: [
          'Fixed lease payments minus any lease incentives receivable',
          'Variable lease payments that depend on an index or a rate',
          'Residual value guarantees expected to be payable by the lessee',
          'Variable lease payments based strictly on future sales throughput'
        ],
        correctOptionIndex: 3,
        explanation: 'Variable lease payments based on future sales or usage (non-index/rate dependent) are not included in lease liability; they are recognized directly in profit or loss in the period the triggering event occurs.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'FR_G_02',
        subjectId: 'FR',
        chapterName: 'Revenue (Ind AS 115)',
        questionText: 'Under Ind AS 115, when is revenue from a contract containing significant financing component recognized?',
        options: [
          'At the cash collection date, incorporating interest income concurrently',
          'At the promised transaction price adjusted to reflect the time value of money, with the financing component shown as separate interest income/expense',
          'By deferring the entire cash value until the final performance obligation is closed, without discounting',
          'Revenue can only be recognized in equal linear monthly installments'
        ],
        correctOptionIndex: 1,
        explanation: 'If a contract has a significant financing component, the transaction price is adjusted to reflect the cash selling price at the date of transfer of goods. The difference is recognized as interest expense/income over the financing term.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'FR_G_03',
        subjectId: 'FR',
        chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
        questionText: 'Under Ind AS 105, which of the following non-current assets is EXCLUDED from the measurement provisions (lower of carrying value and FVLCTS) of Ind AS 105, requiring it to be remeasured under its own governing standard first before evaluating the disposal group as a whole?',
        options: [
          'Property, Plant and Equipment (Ind AS 16)',
          'Investment Property measured under Cost Model (Ind AS 40)',
          'Deferred Tax Assets (Ind AS 12)',
          'Intangible Assets with indefinite useful lives (Ind AS 38)'
        ],
        correctOptionIndex: 2,
        explanation: 'Ind AS 105 explicitly scopes out Deferred Tax Assets (Ind AS 12), Financial Assets (Ind AS 109), Employee Benefit Assets (Ind AS 19), Biological Assets at FVLCTS (Ind AS 41), and Insurance Contractual Rights from its measurement principles. These assets are remeasured under their specific governing standards prior to assessing the disposal group\'s FVLCTS as a whole.'
      } as GeneralQuestion
    },
    {
      type: 'case',
      data: {
        id: 'FR_C_02',
        subjectId: 'FR',
        chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
        scenarioTitle: 'Restructuring and Disposal Group Accounting of Zenith Consumer Goods',
        scenarioText: 'On 1 October 2025, Zenith Consumer Goods Ltd approved a plan to sell its entire Packaging Division (a separate major line of business). The division meets all criteria for classification as a Disposal Group Held for Sale under Ind AS 105. Carrying amounts of assets on 1 October 2025 immediately prior to classification (after remeasurement under respective Ind AS) were:\n\n• Goodwill: ₹20 Crore\n• Property, Plant & Equipment (Ind AS 16): ₹80 Crore\n• Inventory (Ind AS 2): ₹30 Crore\n• Financial Assets (Ind AS 109): ₹20 Crore\nTotal Carrying Amount = ₹150 Crore.\n\nFair Value Less Costs to Sell (FVLCTS) of the entire Packaging Division on 1 October 2025 is determined to be ₹110 Crore. On 31 March 2026, the division remains unsold, and due to improved buyer bids, the FVLCTS of the Disposal Group on 31 March 2026 rises to ₹145 Crore.',
        subQuestions: [
          {
            id: 'FR_CS_2_1',
            subjectId: 'FR',
            chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
            questionText: 'What is the total impairment loss to be recognized under Ind AS 105 on 1 October 2025, and how is it allocated among Goodwill, PPE, Inventory, and Financial Assets?',
            options: [
              'Impairment ₹40 Crore: Allocated ₹20 Cr to Goodwill and ₹20 Cr pro-rata to PPE; Inventory & Financial Assets receive Nil allocation.',
              'Impairment ₹40 Crore: Allocated pro-rata across all assets including Inventory and Financial Assets based on their carrying amounts.',
              'Impairment ₹40 Crore: Allocated entirely to Goodwill, reducing Goodwill to negative ₹20 Cr.',
              'No impairment is recognized because the assets are held for sale and not yet actually sold.'
            ],
            correctOptionIndex: 0,
            explanation: 'Total impairment loss = ₹150 Cr - ₹110 Cr = ₹40 Cr. Under Ind AS 105, impairment is allocated first to Goodwill (writing off ₹20 Cr to Nil). The remaining ₹20 Cr loss is allocated pro-rata to remaining IN-SCOPE non-current assets (PPE). Inventory (Ind AS 2) and Financial Assets (Ind AS 109) are scoped out from Ind AS 105 pro-rata impairment allocation.'
          },
          {
            id: 'FR_CS_2_2',
            subjectId: 'FR',
            chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
            questionText: 'How should depreciation on the PPE (₹80 Crore carrying value prior to impairment) be treated in the Statement of Profit and Loss for the 6-month period from 1 October 2025 to 31 March 2026?',
            options: [
              'Depreciation continues normally at half-year rates based on original useful life.',
              'Depreciation strictly STOPS on 1 October 2025 upon classification as Held for Sale.',
              'Depreciation continues on the reduced post-impairment value of ₹60 Crore.',
              'Depreciation is charged directly to OCI instead of P&L.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 105, once a non-current asset or disposal group is classified as held for sale, depreciation and amortization strictly cease immediately from the date of classification (1 October 2025), even if the sale is completed later.'
          },
          {
            id: 'FR_CS_2_3',
            subjectId: 'FR',
            chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
            questionText: 'On 31 March 2026, when FVLCTS of the Disposal Group increases from ₹110 Crore to ₹145 Crore, what is the maximum impairment reversal permitted under Ind AS 105 and Ind AS 36?',
            options: [
              'Full ₹35 Crore reversal is recognized in P&L, restoring Goodwill by ₹15 Crore and PPE by ₹20 Crore.',
              'Only ₹20 Crore reversal is recognized (allocated to PPE); impairment loss allocated to Goodwill (₹20 Crore) can NEVER be reversed.',
              'Zero reversal is permitted once an asset is classified as Held for Sale.',
              '₹35 Crore is credited to Revaluation Surplus in OCI.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 105 Para 22 read with Ind AS 36, any subsequent increase in FVLCTS of a disposal group is recognized as a gain only to the extent of cumulative impairment losses previously recognized on non-current assets other than Goodwill. Goodwill impairment (₹20 Cr) is strictly prohibited from reversal. Hence, reversal is capped at ₹20 Crore (restoring PPE from ₹60 Cr to ₹80 Cr).'
          },
          {
            id: 'FR_CS_2_4',
            subjectId: 'FR',
            chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
            questionText: 'How must the results and cash flows of the Packaging Division (a separate major line of business) be presented in the Statement of Profit and Loss for FY 2025-26?',
            options: [
              'Merged line-by-line with continuing operations with a footnote disclosure.',
              'Presented as a single post-tax amount on the face of the Statement of Profit and Loss under "Discontinued Operations", combining post-tax operating profit/loss and post-tax impairment loss/reversal.',
              'Transferred directly to Retained Earnings without routing through P&L.',
              'Deferred as a regulatory asset on the Balance Sheet.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 105 Para 32-33, a component of an entity that represents a separate major line of business classified as held for sale qualifies as a Discontinued Operation. A single amount comprising the post-tax profit/loss of discontinued operations and post-tax gain/loss on measurement to FVLCTS must be presented on the face of the Statement of Profit and Loss.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'FR_C_01',
        subjectId: 'FR',
        chapterName: 'Business Combinations (Ind AS 103)',
        scenarioTitle: 'Valuation, Deferred Tax & Consolidated Accounting of StarTech Acquisition',
        scenarioText: 'On 1 April 2025, Earth Infra Ltd acquired 80% equity interest in StarTech Solutions for a cash consideration of ₹300 Crore. Additionally, Earth Infra agreed to pay a contingent consideration of ₹33 Crore on 31 March 2026 if StarTech achieves 15% revenue growth (acquisition-date fair value of this contingent obligation is reliably measured at ₹20 Crore). At acquisition date:\n\n• Carrying Book Value of StarTech’s identifiable Net Assets = ₹220 Crore.\n• Fair Value of StarTech’s identifiable Net Assets = ₹250 Crore (the ₹30 Crore uplift relates entirely to a patented technology with a remaining useful life of 5 years; tax base remains at book value, corporate tax rate = 25%).\n• Non-Controlling Interest (NCI) is measured at its proportionate share of StarTech\'s identifiable net assets (after deferred tax adjustment).',
        subQuestions: [
          {
            id: 'FR_CS_1_1',
            subjectId: 'FR',
            chapterName: 'Business Combinations (Ind AS 103)',
            questionText: 'Under Ind AS 12 and Ind AS 103, what is the Deferred Tax Liability (DTL) arising on the ₹30 Crore fair value uplift of patented technology, and what is the revised Acquisition-Date Net Identifiable Assets?',
            options: [
              'DTL = ₹7.50 Crore; Net Identifiable Assets = ₹242.50 Crore',
              'DTL = Nil; Net Identifiable Assets = ₹250.00 Crore',
              'DTL = ₹7.50 Crore; Net Identifiable Assets = ₹257.50 Crore',
              'DTA = ₹7.50 Crore; Net Identifiable Assets = ₹250.00 Crore'
            ],
            correctOptionIndex: 0,
            explanation: 'Fair value uplift of ₹30 Crore creates a taxable temporary difference (Carrying Value in CFS > Tax Base in standalone). Under Ind AS 12 & Ind AS 103, DTL = 25% of ₹30 Cr = ₹7.50 Crore. Net Identifiable Assets at acquisition = ₹250 Cr - ₹7.50 Cr DTL = ₹242.50 Crore.'
          },
          {
            id: 'FR_CS_1_2',
            subjectId: 'FR',
            chapterName: 'Business Combinations (Ind AS 103)',
            questionText: 'What is the value of Non-Controlling Interest (NCI) recognized on 1 April 2025 using the proportionate share of net identifiable assets method?',
            options: [
              '₹44.00 Crore (20% of Book Value ₹220 Cr)',
              '₹50.00 Crore (20% of ₹250 Cr)',
              '₹48.50 Crore (20% of post-DTL Net Identifiable Assets ₹242.50 Cr)',
              '₹64.00 Crore (20% of Purchase Consideration)'
            ],
            correctOptionIndex: 2,
            explanation: 'Under the proportionate net asset method, NCI = 20% of StarTech’s acquisition-date net identifiable assets after deferred tax = 20% × ₹242.50 Crore = ₹48.50 Crore.'
          },
          {
            id: 'FR_CS_1_3',
            subjectId: 'FR',
            chapterName: 'Business Combinations (Ind AS 103)',
            questionText: 'What is the Goodwill recognized on 1 April 2025 including the acquisition-date fair value of contingent consideration?',
            options: [
              '₹126.00 Crore',
              '₹100.00 Crore',
              '₹106.00 Crore',
              '₹118.50 Crore'
            ],
            correctOptionIndex: 0,
            explanation: 'Total Consideration Transferred = Cash (₹300 Cr) + Fair Value of Contingent Consideration (₹20 Cr) = ₹320 Crore. Add Proportionate NCI (₹48.50 Cr) = ₹368.50 Crore. Less Net Identifiable Assets (₹242.50 Cr) = Goodwill of ₹126.00 Crore.'
          },
          {
            id: 'FR_CS_1_4',
            subjectId: 'FR',
            chapterName: 'Business Combinations (Ind AS 103)',
            questionText: 'On 31 March 2026, StarTech exceeds the revenue target and the cash-settled contingent consideration liability increases from ₹20 Crore to ₹33 Crore. How is the ₹13 Crore increase accounted for under Ind AS 103?',
            options: [
              'Adjusted retrospectively against Goodwill as a measurement period adjustment.',
              'Recognized in the Consolidated Statement of Profit and Loss as a fair value remeasurement loss (since post-acquisition performance target achievement is not a measurement period adjustment).',
              'Debited directly to Other Equity (Capital Reserve).',
              'Allocated 80:20 between Parent Retained Earnings and NCI.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 103 Para 58, changes in the fair value of contingent consideration classified as a financial liability resulting from post-acquisition events (such as meeting an earnings/revenue target) are not measurement period adjustments; the liability is measured at fair value at each reporting date with changes recognized in Profit or Loss.'
          }
        ]
      } as CaseScenario
    },
    ...FR_CASE_ITEMS
  ],
  Audit: AUDIT_QUIZ_QUESTIONS,
  DT: [
    {
      type: 'general',
      data: {
        id: 'DT_G_01',
        subjectId: 'DT',
        chapterName: 'PGBP [Chapter 3]',
        questionText: 'Under Section 43B(h) (introduced to protect MSME vendors), any sum payable by the assessee to a Micro or Small Enterprise beyond the time limit specified in section 15 of the MSMED Act, 2006, shall be allowed as a deduction in which year?',
        options: [
          'In the year in which the liability is incurred, provided it is paid before filing the return u/s 139(1).',
          'Only in the previous year in which such sum is actually paid, regardless of when the liability was accrued.',
          'Deduction is completely disallowed forever; no allowance in subsequent years is legally possible.',
          'In equal linear installments over 5 consecutive previous years starting from the default year.'
        ],
        correctOptionIndex: 1,
        explanation: 'Section 43B(h) restricts deductions for delayed payments to Micro and Small Enterprises. Unlike other items u/s 43B, if payment is delayed beyond the MSMED Act limit (15/45 days), it is allowed ONLY in the previous year of actual payment. Payment before the 139(1) due date does not salvage deduction in the accrual year if the MSMED limit is breached.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'DT_G_02',
        subjectId: 'DT',
        chapterName: 'Basic Concepts',
        questionText: 'What is the effective rate of tax on unexplained cash credits and undisclosed investments under Section 115BBE of the Income-tax Act, 1961?',
        options: [
          '78% (comprising 60% base tax, 25% surcharge on tax, and 4% health & education cess on total of tax + surcharge)',
          '60% (with zero surcharge or health & education cess applicable)',
          '115% (including a flat 50% non-compliance penalty charge on base value)',
          '31.2% (taxed parallel to capital gain bracket additions)'
        ],
        correctOptionIndex: 0,
        explanation: 'Under Section 115BBE, unexplained cash credits u/s 68, unexplained investments u/s 69, or unexplained expenditure u/s 69C are taxed at 60% base rate, plus a 25% surcharge on such tax (15%), plus a 4% health & education cess on the total tax+surcharge (2.4%), which matches to an effective rate of 78%.'
      } as GeneralQuestion
    },
    {
      type: 'case',
      data: {
        id: 'DT_C_01',
        subjectId: 'DT',
        chapterName: 'Assessment of Various Entities',
        scenarioTitle: 'Corporate Tax Regime (Sec 115BAA), Chapter VI-A Deductions & Capital Gains of Omega Tech Pvt Ltd',
        scenarioText: 'Omega Tech Solutions Pvt. Ltd., a domestic company, has opted for the concessional corporate tax regime under Section 115BAA for Assessment Year 2026-27. Its statement of income reveals:\n\n• Computed Business Profits (PGBP before Additional Depreciation): ₹1,20,00,000 (Company installed new plant & machinery worth ₹50,00,000 in November 2025).\n• Short-Term Capital Gains u/s 111A (STT paid on equity shares transferred in Oct 2025): ₹30,00,000.\n• Dividend received from a domestic subsidiary company in August 2025: ₹25,00,000. Omega Tech distributed ₹18,00,000 as dividend to its own shareholders on 15 September 2025 (one month before the due date of filing return u/s 139(1)).\n• Emoluments paid to 40 newly recruited regular employees eligible under Section 80JJAA (30% deduction): ₹10,00,000.\n• Brought forward MAT credit u/s 115JAA from earlier years: ₹8,50,000.',
        subQuestions: [
          {
            id: 'DT_CS_1_1',
            subjectId: 'DT',
            chapterName: 'Assessment of Various Entities',
            questionText: 'Under Section 115BAA, what is the base corporate tax rate applicable to Omega Tech Solutions\' business profits, and can it claim Additional Depreciation u/s 32(1)(iia) on the new plant & machinery?',
            options: [
              'Base rate 22%; Additional depreciation u/s 32(1)(iia) is strictly disallowed.',
              'Base rate 15%; Additional depreciation of 20% is fully allowable.',
              'Base rate 25%; Additional depreciation of 10% (half rate) is allowable.',
              'Base rate 22%; Additional depreciation is allowed against STCG.'
            ],
            correctOptionIndex: 0,
            explanation: 'Section 115BAA taxes domestic companies at a flat base rate of 22% (effective rate 25.168% including 10% surcharge and 4% cess) on normal income, subject to the condition that total income is computed without claiming Additional Depreciation u/s 32(1)(iia).'
          },
          {
            id: 'DT_CS_1_2',
            subjectId: 'DT',
            chapterName: 'Deductions from Gross Total Income',
            questionText: 'Which Chapter VI-A deductions are allowable to Omega Tech Solutions Pvt. Ltd. under the Section 115BAA regime, and what is their total quantum?',
            options: [
              'Nil; Section 115BAA prohibits all Chapter VI-A deductions without exception.',
              '₹28,00,000 (comprising ₹10,00,000 u/s 80JJAA and ₹18,00,000 u/s 80M).',
              '₹10,00,000 (only u/s 80JJAA is allowed; Section 80M is barred).',
              '₹35,00,000 (₹10,00,000 u/s 80JJAA and full ₹25,00,000 dividend received u/s 80M).'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 115BAA(2), deductions under Chapter VI-A are disallowed EXCEPT Section 80JJAA, Section 80M, and Section 80LA (for IFSC units). Under Sec 80M, deduction is restricted to the dividend distributed on or before the due date (1 month prior to 139(1) due date) = ₹18,00,000. Total Chapter VI-A deduction = ₹10L (80JJAA) + ₹18L (80M) = ₹28,00,000.'
          },
          {
            id: 'DT_CS_1_3',
            subjectId: 'DT',
            chapterName: 'Assessment of Various Entities',
            questionText: 'What is the mandatory Surcharge rate applicable to a company opting for Section 115BAA, and how is the brought forward MAT credit of ₹8,50,000 u/s 115JAA treated?',
            options: [
              '7% surcharge; MAT credit of ₹8,50,000 can be set off against normal tax.',
              '10% flat surcharge irrespective of income level; MAT credit of ₹8,50,000 lapses permanently and cannot be set off.',
              '12% surcharge; MAT credit is refunded in cash.',
              'Zero surcharge since total income is below ₹10 Crores.'
            ],
            correctOptionIndex: 1,
            explanation: 'Companies opting for Section 115BAA are subject to a mandatory flat Surcharge of 10% regardless of total income quantum. Furthermore, Section 115JB (MAT) does not apply to a Sec 115BAA company, and any brought forward MAT credit u/s 115JAA lapses upon transitioning to Sec 115BAA.'
          },
          {
            id: 'DT_CS_1_4',
            subjectId: 'DT',
            chapterName: 'Capital Gains',
            questionText: 'At what base tax rate is the Short-Term Capital Gain of ₹30,00,000 u/s 111A (transferred in October 2025) taxed in the hands of Omega Tech Solutions Pvt. Ltd.?',
            options: [
              'Taxed at the special rate prescribed under Section 111A (20% post July 2024 amendment), plus 10% surcharge and 4% cess.',
              'Taxed at the flat 22% rate of Section 115BAA because Sec 115BAA overrides all Chapter XII special rate provisions.',
              'Taxed at 15% flat without surcharge.',
              'Exempt up to ₹1,25,000 and balance at 12.5%.'
            ],
            correctOptionIndex: 0,
            explanation: 'Section 115BAA(1) explicitly states that the 22% rate applies to income "other than income covered under other provisions of Chapter XII" (such as Sec 111A, 112, 112A). Therefore, STCG u/s 111A is taxed at the special rate u/s 111A (20%), increased by the mandatory 10% surcharge and 4% cess.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'DT_C_02',
        subjectId: 'DT',
        chapterName: 'Profits and Gains of Business or Profession',
        scenarioTitle: 'PGBP Disallowances (Sec 43B(h)), Slump Sale (Sec 50B) & TDS/TCS of Bharat Heavy Precision Ltd',
        scenarioText: 'Bharat Heavy Precision Ltd. (a manufacturing company following the normal tax regime) provides the following particulars for FY 2025-26 (AY 2026-27):\n\n1. MSME Vendor Payables as on 31 March 2026:\n   • Invoice A (₹14 Lakhs) to M/s Surya Micro Tools (registered Micro Enterprise): Goods supplied on 10 February 2026 under a written agreement specifying a 30-day credit period. Payment was made on 20 April 2026.\n   • Invoice B (₹9 Lakhs) to M/s Kiran Engineering (registered Small Enterprise): Goods supplied on 18 March 2026 under a 30-day written agreement. Payment was made on 12 April 2026.\n2. On 1 October 2025, the company executed a Slump Sale of its "Forging Unit" (held since April 2018) for a lump-sum cash consideration of ₹450 Lakhs. Fair Market Value (FMV 1 - Book Assets Rule 11UAE) = ₹480 Lakhs; FMV 2 (Monetary Consideration) = ₹450 Lakhs. Carrying values of the Forging Unit on 1 Oct 2025:\n   • Depreciable Plant & Machinery (WDV as per Sec 43(6)): ₹180 Lakhs\n   • Land (Book Value ₹120 Lakhs, which includes an upward revaluation reserve of ₹40 Lakhs created in 2022)\n   • Current Assets: ₹60 Lakhs | Current Liabilities: ₹50 Lakhs.',
        subQuestions: [
          {
            id: 'DT_CS_2_1',
            subjectId: 'DT',
            chapterName: 'Profits and Gains of Business or Profession',
            questionText: 'Evaluate the allowability of Invoice A (₹14 Lakhs) and Invoice B (₹9 Lakhs) under Section 43B(h) read with Section 15 of the MSMED Act, 2006 for AY 2026-27.',
            options: [
              'Both ₹14 Lakhs and ₹9 Lakhs are allowed in AY 2026-27 since both were paid before the return filing due date u/s 139(1).',
              'Invoice A (₹14 Lakhs) is disallowed in AY 2026-27 (allowed in AY 2027-28 on payment) as it exceeded the 30-day agreed limit (paid after 69 days); Invoice B (₹9 Lakhs) is allowed in AY 2026-27 as it was paid within the 30-day limit.',
              'Both Invoice A and Invoice B are disallowed in AY 2026-27 because they were outstanding on 31 March 2026.',
              '30% of both invoices is disallowed under Section 40(a)(ia).'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 43B(h), the proviso to Sec 43B (allowing deduction if paid before 139(1) due date) DOES NOT apply. However, if a sum payable on 31 March is paid within the time limit permitted under Sec 15 of the MSMED Act (agreed period up to 45 days), no violation occurs and accrual deduction is allowed. Invoice A (10 Feb to 20 Apr = 69 days > 30 days) breached Sec 15 and is allowed only in AY 2027-28. Invoice B (18 Mar to 12 Apr = 25 days <= 30 days) was paid within the MSMED limit, so ₹9 Lakhs is allowable in AY 2026-27.'
          },
          {
            id: 'DT_CS_2_2',
            subjectId: 'DT',
            chapterName: 'Capital Gains',
            questionText: 'What is the "Net Worth" of the Forging Unit under Section 50B for computing Slump Sale capital gains?',
            options: [
              '₹310 Lakhs (180 + 120 + 60 - 50)',
              '₹270 Lakhs (180 + 80 [Land excluding ₹40L revaluation] + 60 - 50)',
              '₹360 Lakhs (ignoring current liabilities)',
              '₹230 Lakhs'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Explanation 1 & 2 to Section 50B, Net Worth = Aggregate value of total assets minus liabilities. Depreciable assets are taken at Tax WDV (₹180L), and any change in value on account of revaluation of assets (₹40L on Land) must be ignored (Land = 120 - 40 = ₹80L). Net Worth = 180 + 80 + 60 - 50 = ₹270 Lakhs.'
          },
          {
            id: 'DT_CS_2_3',
            subjectId: 'DT',
            chapterName: 'Capital Gains',
            questionText: 'Under Section 50B(2)(ii) read with Rule 11UAE, what is the Deemed Full Value of Consideration and the resulting Long-Term Capital Gain on the Slump Sale?',
            options: [
              'Full Value of Consideration = ₹450 Lakhs; LTCG = ₹180 Lakhs',
              'Full Value of Consideration = ₹480 Lakhs (higher of FMV 1 and FMV 2); LTCG = ₹210 Lakhs (480 - 270, with zero indexation)',
              'Full Value of Consideration = ₹480 Lakhs; STCG = ₹170 Lakhs',
              'Exempt under Section 47 since the unit was held for more than 36 months.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Rule 11UAE, Full Value of Consideration for Slump Sale is the higher of FMV 1 (₹480L) or FMV 2 (₹450L) = ₹480 Lakhs. Since the undertaking was held for more than 36 months (since April 2018), the gain is Long-Term Capital Gain (no indexation allowed u/s 50B) = ₹480L - ₹270L = ₹210 Lakhs.'
          },
          {
            id: 'DT_CS_2_4',
            subjectId: 'DT',
            chapterName: 'Deduction, Collection and Recovery of Tax',
            questionText: 'During FY 2025-26, Bharat Heavy Precision Ltd. (preceding FY turnover ₹85 Crores) purchased raw steel worth ₹90 Lakhs from a single resident supplier M/s Tata Metals. What is the TDS obligation under Section 194Q?',
            options: [
              'Deduct TDS @ 0.1% on ₹40 Lakhs (amount exceeding ₹50 Lakhs threshold) = ₹4,000.',
              'Deduct TDS @ 0.1% on the entire ₹90 Lakhs = ₹9,000.',
              'No TDS applies; only TCS u/s 206C(1H) applies.',
              'Deduct TDS @ 2% under Section 194C.'
            ],
            correctOptionIndex: 0,
            explanation: 'Under Section 194Q, a buyer whose preceding FY turnover exceeds ₹10 Crores must deduct TDS @ 0.1% on purchase of goods from a resident seller exceeding ₹50 Lakhs in a financial year. TDS applies on the excess over ₹50 Lakhs = 0.1% of (₹90L - ₹50L) = ₹4,000.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'DT_C_03',
        subjectId: 'DT',
        chapterName: 'Transfer Pricing',
        scenarioTitle: 'Transfer Pricing (Sec 92C/92CE), Thin Capitalisation (Sec 94B) & DTAA Royalty of Helios India',
        scenarioText: 'Helios India Pvt. Ltd. is a wholly-owned Indian subsidiary of Helios AG (a German resident corporation). During FY 2025-26 (AY 2026-27), the following cross-border transactions took place:\n\n1. Helios India exported precision sensors to Helios AG at a declared transfer price of ₹140 Crores. The TPO determined 7 comparable uncontrolled prices resulting in an Arm\'s Length Price (ALP) dataset (35th to 65th percentile median ALP determined at ₹165 Crores). The primary upward TP adjustment of ₹25 Crores was finalized on 10 November 2026, and Helios AG did not repatriate the ₹25 Crores within the prescribed 90-day window (SBI 1-year MCLR on 1 April 2026 = 8.75%).\n2. Helios India paid ₹18 Crores as interest on an External Commercial Borrowing (ECB) guaranteed by Helios AG. Helios India\'s EBITDA for FY 2025-26 is ₹40 Crores.\n3. Helios India paid ₹5 Crores as industrial design Royalty to Helios AG (Assume India-Germany DTAA caps royalty tax at 10% gross; Helios AG holds valid TRC and Form 10F and has no PE in India).',
        subQuestions: [
          {
            id: 'DT_CS_3_1',
            subjectId: 'DT',
            chapterName: 'Transfer Pricing',
            questionText: 'Since the primary Transfer Pricing adjustment of ₹25 Crores exceeds ₹1 Crore and was not repatriated within 90 days, what options are available to Helios India under Section 92CE (Secondary Adjustment)?',
            options: [
              'No action is required since Secondary Adjustment only applies to transactions above ₹100 Crores.',
              'Either compute imputed interest on the un-repatriated ₹25 Crores at SBI MCLR + 3.25% (8.75% + 3.25% = 12% p.a.) as deemed advance, OR pay a one-time additional income-tax @ 18% (plus 12% surcharge and 4% cess = 20.9664%) u/s 92CE(2A).',
              'Claim the ₹25 Crores as a bad debt write-off u/s 36(1)(vii).',
              'Adjust the ₹25 Crores against Domestic GST Input Tax Credit.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 92CE read with Rule 10CB, if excess money (> ₹1 Crore) is not repatriated within 90 days, it is treated as a deemed advance attracting imputed interest at SBI 1-year MCLR + 3.25% (for INR transactions). Alternatively, u/s 92CE(2A), the assessee can pay a one-time additional tax of 18% + 12% surcharge + 4% cess (20.9664%) on the un-repatriated amount to extinguish further imputed interest.'
          },
          {
            id: 'DT_CS_3_2',
            subjectId: 'DT',
            chapterName: 'Transfer Pricing',
            questionText: 'Under Section 94B (Thin Capitalisation / Interest Limitation), how much of the ₹18 Crore interest paid on debt guaranteed by Helios AG is allowable in AY 2026-27, and for how long can excess interest be carried forward?',
            options: [
              'Full ₹18 Crores is allowable since loan was from a bank and only guaranteed by the AE.',
              'Allowable interest is capped at 30% of EBITDA (30% of ₹40 Cr = ₹12 Crores); excess interest of ₹6 Crores is disallowed in AY 2026-27 and carried forward for up to 8 assessment years.',
              'Allowable interest is 50% of EBITDA (₹20 Crores).',
              'Excess interest of ₹6 Crores lapses permanently.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 94B, debt issued by a lender which is implicitly or explicitly guaranteed by an Associated Enterprise (AE) is deemed to be debt issued by an AE (except where the lender is a PE of a foreign bank in India). Since interest exceeds ₹1 Crore, allowable interest is restricted to 30% of EBITDA = 30% of ₹40 Cr = ₹12 Crores. Disallowed excess interest of ₹6 Crores can be carried forward for 8 subsequent assessment years.'
          },
          {
            id: 'DT_CS_3_3',
            subjectId: 'DT',
            chapterName: 'Non Resident Taxation',
            questionText: 'Regarding the ₹5 Crore Royalty paid to Helios AG (with valid TRC & Form 10F, no PE in India), compare the domestic tax rate u/s 115A vs. the India-Germany DTAA rate u/s 90(2).',
            options: [
              'Taxable at 10% gross (₹50 Lakhs) under the India-Germany DTAA (without surcharge or cess) since DTAA is more beneficial than Section 115A (20% + Surcharge + 4% Cess).',
              'Taxable at 20% + Surcharge + Cess because Section 115A overrides all DTAAs.',
              'Completely exempt from tax in India under Section 10.',
              'Subject to Equalisation Levy @ 2%.'
            ],
            correctOptionIndex: 0,
            explanation: 'Under Section 115A (post Finance Act amendment), the domestic tax rate on Royalty/FTS paid to a non-resident is 20% plus applicable Surcharge and 4% Cess. However, under Section 90(2), the assessee can opt for the India-Germany DTAA rate of 10% (inclusive of surcharge and cess) since it is more beneficial.'
          },
          {
            id: 'DT_CS_3_4',
            subjectId: 'DT',
            chapterName: 'Transfer Pricing',
            questionText: 'Can Helios India claim any deduction under Chapter VI-A or Section 10AA in respect of the ₹25 Crore income enhanced by the Transfer Pricing Officer under Section 92C(4)?',
            options: [
              'Yes, full deduction under Section 80JJAA and 10AA is available on the enhanced ₹25 Crores.',
              'No, under the first proviso to Section 92C(4), no deduction under Section 10AA or Chapter VI-A shall be allowed in respect of the amount of income by which total income is enhanced via Transfer Pricing computation.',
              '50% deduction is allowed if an APA application is pending.',
              'Allowed only if the assessee waives the right to appeal to DRP.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under the first proviso to Section 92C(4), no deduction under Section 10A/10AA or under Chapter VI-A is allowed in respect of the income enhanced by the Assessing Officer/TPO pursuant to an arm’s length price computation.'
          }
        ]
      } as CaseScenario
    }
  ],
  IDT: [
    {
      type: 'general',
      data: {
        id: 'IDT_G_01',
        subjectId: 'IDT',
        chapterName: 'Input Tax Credit',
        questionText: 'A taxable software consulting firm, registered under GST, acquired a motor vehicle for conveying its executive directors. The seating capacity is 5 persons, and its purchase price is ₹12 Lakhs (plus 18% GST). What is the quantum of Input Tax Credit (ITC) allowable to the company on this acquisition?',
        options: [
          '₹2,16,000 (100% of GST paid on the motor vehicle)',
          '₹1,08,000 (50% partial credit due to business conveyance)',
          'Nil (the credit is blocked u/s 17(5) of the CGST Act)',
          '₹2,40,000 (computed as per depreciation guidelines)'
        ],
        correctOptionIndex: 2,
        explanation: 'Under Section 17(5)(a) of the CGST Act, ITC on motor vehicles for transport of persons with a seating capacity of not more than 13 persons (including driver) is blocked, unless used for supply of other vehicles, passenger transport, or training.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_02',
        subjectId: 'IDT',
        chapterName: 'Supply',
        questionText: 'Under Schedule I of the CGST Act, which of the following transactions is deemed as a "Supply" even if executed without consideration?',
        options: [
          'Gift up to ₹60,000 by an employer to an employee in a financial year',
          'Transfer of business assets where no input tax credit has been claimed on such assets',
          'Supply of goods/services between related persons or distinct persons u/s 25, when made in the course or furtherance of business',
          'Import of services u/s Sec 7(1)(b) by an individual from a relative for personal use'
        ],
        correctOptionIndex: 2,
        explanation: 'Deemed supply u/s Schedule I includes: 1) Permanent transfer of business assets where ITC has been claimed. 2) Supply of goods or services between related or distinct persons when made in furtherance of business. Gifts by employer to employee up to ₹50,000 are exempt.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_03',
        subjectId: 'IDT',
        chapterName: 'Supply',
        questionText: 'Under Section 8 of the CGST Act, a registered supplier distributes promotional gift kits containing 1 face cream (GSTR 18%), 1 face tissue packet (GSTR 28%), and 1 nail paint (GSTR 12%) as a package for a single price of ₹500. How will this supply be taxed, and what is the classification of such transaction?',
        options: [
          'It is a composite supply; taxed at the rate of the principal supply (18% for the face cream).',
          'It is a mixed supply; taxed at the highest rate among the components (28% for the face tissue packet).',
          'Each item will be taxed at its respective rate (18%, 28%, and 12%) by splitting the single price.',
          'It is completely exempt from GST because it represents a promotional gift.'
        ],
        correctOptionIndex: 1,
        explanation: 'Under Section 8(b), a mixed supply comprising two or more individual supplies made in conjunction with each other for a single price is treated as a supply of that particular item that attracts the highest rate of tax. Since these items can be sold independently and are not naturally bundled, it is a mixed supply, taxed at the highest rate (28% belonging to the face tissue).'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_04',
        subjectId: 'IDT',
        chapterName: 'Supply',
        questionText: 'Which of the following transactions is NOT treated as a supply of goods or service as per the negative list of Schedule III under GST?',
        options: [
          'Permanent transfer of business assets where input tax credit has been availed on such assets.',
          'Supply of goods from a place in a non-taxable territory to another place in a non-taxable territory without such goods entering into India (Merchant Trading).',
          'Actionable claims u/s 2(52) by way of betting, casinos, and lottery.',
          'Import of services from a related person outside India for business purposes without consideration.'
        ],
        correctOptionIndex: 1,
        explanation: 'Under Schedule III Para 7, supply of goods from a place in the non-taxable territory to another place in the non-taxable territory without such goods entering into India (Merchant Trading) is a non-supply under GST. Contrastingly, betting, casinos, and lottery are specified actionable claims which are taxable supplies of goods. Permanent transfer of business assets with ITC is deemed supply u/s Schedule I. Service import from related person u/s Schedule I is also deemed supply.'
      } as GeneralQuestion
    },
    {
      type: 'case',
      data: {
        id: 'IDT_C_01',
        subjectId: 'IDT',
        chapterName: 'Value of Supply',
        scenarioTitle: 'Valuation (Sec 15), ITC Reversal (Rule 37) & Interest (Sec 50) of Vardhman Synthetics',
        scenarioText: 'Vardhman Synthetics Ltd (manufacturer registered in Maharashtra) sells a batch of specialized polymers to an unrelated client, Apex Labs, for ₹10,00,000 (excluding GST @ 18%). The following aspects are logged during the tax period:\n\n• Vardhman pays a logistics sub-vendor ₹30,000 for transport. The contract mandates Apex Labs to bear this freight, but Apex requests Vardhman to pay initially and recover it.\n• Testing and sorting charges incurred by Vardhman before delivery: ₹15,000 (billed separately).\n• Apex Labs gets a prompt payment discount of 2% on the base price outlined in the original agreement and shown on the tax invoice.\n• Subsidy received from a private trade association (ChemTrade Forum) directly linked to the price of polymers: ₹40,000.\n• On the inward side, Vardhman availed ITC of ₹90,000 on raw chemicals purchased on 10 May 2025, but failed to pay the supplier’s invoice within 180 days from the date of issue of invoice.',
        subQuestions: [
          {
            id: 'IDT_CS_1_1',
            subjectId: 'IDT',
            chapterName: 'Value of Supply',
            questionText: 'How is the transit logistics charge of ₹30,000 treated u/s 15(2)(b) of the CGST Act?',
            options: [
              'Excluded, because Apex Labs is contractually liable to pay it.',
              'Included in the value of supply, as it represents a liability of the supplier/recipient met in relation to the supply and recovered from the recipient.',
              'Treated as a separate supply of services exempt from GST.',
              'Subject to reverse charge (RCM) exclusively.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 15(2)(b) & (c), any amount that the supplier is liable to pay in relation to such supply or incidental expenses charged by the supplier is mandatory of inclusion in the taxable value.'
          },
          {
            id: 'IDT_CS_1_2',
            subjectId: 'IDT',
            chapterName: 'Value of Supply',
            questionText: 'How is the ₹40,000 price-linked subsidy received from the private trade association (ChemTrade Forum) treated under Section 15(2)(e), and what is the final net taxable Value of Supply?',
            options: [
              'Subsidy is excluded; Net Taxable Value = ₹10,25,000',
              'Non-government subsidy is included in Value of Supply; Net Taxable Value = ₹10,65,000 (10,00,000 + 30,000 + 15,000 + 40,000 - 20,000)',
              'Subsidy is deducted twice; Net Taxable Value = ₹9,85,000',
              'Net Taxable Value = ₹10,45,000'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 15(2)(e), subsidies directly linked to the price are included in the Value of Supply EXCEPT subsidies provided by the Central Government or a State Government. Since ChemTrade Forum is a private trade association, the ₹40,000 subsidy is included. Total Taxable Value = 10,00,000 (Base) + 30,000 (Freight) + 15,000 (Testing) + 40,000 (Subsidy) - 20,000 (2% invoice discount u/s 15(3)(a)) = ₹10,65,000.'
          },
          {
            id: 'IDT_CS_1_3',
            subjectId: 'IDT',
            chapterName: 'Input Tax Credit',
            questionText: 'Regarding the ₹90,000 ITC availed on raw chemicals where the supplier was not paid within 180 days from the invoice date, what is the statutory consequence under the second proviso to Section 16(2) read with Rule 37?',
            options: [
              'The ₹90,000 ITC lapses forever and can never be re-availed even if paid later.',
              'Vardhman must reverse/pay ₹90,000 along with applicable interest u/s 50 while filing GSTR-3B immediately following the expiry of 180 days, and can re-avail the ₹90,000 ITC (without any time limit u/s 16(4)) once actual payment is made to the supplier.',
              'Only 50% of the ITC (₹45,000) is required to be reversed.',
              'The supplier’s GST registration is automatically cancelled.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under the second and third provisos to Section 16(2) read with Rule 37, if a recipient fails to pay the supplier within 180 days from the invoice date, the availed ITC must be reversed/paid along with interest u/s 50. Once payment is subsequently made, the recipient is entitled to re-avail the ITC without the time bar of Section 16(4).'
          },
          {
            id: 'IDT_CS_1_4',
            subjectId: 'IDT',
            chapterName: 'Payment of Tax',
            questionText: 'If Vardhman Synthetics files its GSTR-3B return for the month with a delay of 30 days, having a Gross Output Tax Liability of ₹1,91,700 and ₹1,41,700 available in its Electronic Credit Ledger (balance ₹50,000 paid via Electronic Cash Ledger), on what amount is 18% p.a. interest levied under the proviso to Section 50(1)?',
            options: [
              'On the Gross Output Tax Liability of ₹1,91,700.',
              'Only on the Net Cash Tax Liability of ₹50,000 debited from the Electronic Cash Ledger (since return was filed belatedly before any Section 73/74 proceedings).',
              'On the Electronic Credit Ledger balance of ₹1,41,700 at 24% p.a.',
              'Zero interest is payable if delayed by less than 45 days.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under the proviso to Section 50(1) of the CGST Act read with Rule 88B, interest @ 18% p.a. on delayed filing of return (other than post-Section 73/74 proceedings) is levied ONLY on that portion of tax which is paid by debiting the Electronic Cash Ledger (Net Cash Liability of ₹50,000).'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_05',
        subjectId: 'IDT',
        chapterName: 'Charge of GST',
        questionText: 'An active director of ABC Ltd., who is also an employee under a regular contract of service, receives a monthly Salary of ₹2,50,000 (subject to TDS u/s 192 of the Income Tax Act). Additionally, he receives commission on profit of ₹5,00,000 during the year as an independent director (subject to TDS u/s 194J). Determine the taxability and RCM applicability of these payments under GST.',
        options: [
          'No GST is applicable on salary, but ₹5,00,000 profit commission is subject to GST under Reverse Charge Mechanism (RCM) where recipient ABC Ltd is liable to pay tax.',
          'Entire ₹8,00,000 is subject to GST under forward charge since the director represents a single associated supplier.',
          'Entire ₹8,00,000 is exempt from GST under Schedule III of the CGST Act.',
          'ABC Ltd must pay GST under forward charge on salary, and the director pays GST under reverse charge on profit commission.'
        ],
        correctOptionIndex: 0,
        explanation: 'Under Schedule III Para 1, services of employee to employer under contract of service are non-supplies (no GST, salary exempt). However, compensation paid to an independent director or any director non-employee is outside Schedule III. For director fees, the service of director to company is covered under RCM notification u/s 9(3) where the company ABC Ltd (recipient) is liable to pay 100% of GST under reverse charge.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_06',
        subjectId: 'IDT',
        chapterName: 'Charge of GST',
        questionText: 'M/s Swadeshi Garments, a registered trader in Punjab, opted for the Composition Scheme u/s 10(1) in the current financial year. Its preceding FY aggregate turnover was ₹1.2 Crore. In the current year, its turnover of garments is ₹80 Lakh. To expand, it additionally provides tailor-stitching services earning ₹12 Lakh, and earns passive interest on fixed deposits of ₹5 Lakh. Determine the validity of its composition option, and calculate its tax liability (CGST + SGST) u/s 10(1) of the CGST Act.',
        options: [
          'The composition option is invalid because service turnover exceeds standard limits.',
          'Option is valid; tax liability u/s 10(1) is ₹92,000 (1% of total turnover including garments and tailoring). FD interest is excluded.',
          'Option is valid; tax is ₹80,000 (1% of garments turnover) as traders only pay on taxable goods.',
          'Option is valid; tax liability is ₹41,000 (0.5% CGST + 0.5% SGST on ₹80 Lakh garments turnover, plus 2.5% CGST + 2.5% SGST on ₹12 Lakh services turnover).'
        ],
        correctOptionIndex: 1,
        explanation: '1) Eligibility: Preceding FY turnover (₹1.2Cr) is within ₹1.5Cr limit. 2) Service limit: Trader can supply services up to 10% of preceding FY turnover (₹12 Lakh) or ₹5 Lakh, whichever is higher, so ₹12 Lakh tailoring is perfectly valid. 3) Turnover calculations: FD interest is excluded from turnover in State u/s 10 Proviso. 4) Tax Liability of Trader u/s 10(1): 1% of turnover of taxable supplies of goods & services in State. Garments (80L) + Tailoring (12L) = ₹92 Lakhs. Tax = 1% of ₹92 Lakhs = ₹92,000 (split into ₹46,000 CGST + ₹46,000 SGST).'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_07',
        subjectId: 'IDT',
        chapterName: 'Place of Supply',
        questionText: 'A Delhi-based computer hardware trader boards a flight from Mumbai to Kolkata. During the flight, he sells a premium tablet device (which he took on board at Mumbai airport terminal) to a passenger residing in Kolkata. What is the Place of Supply of the tablet under Section 10(1)(e) of the IGST Act, and what tax must be charged?',
        options: [
          'Place of Supply is Delhi (Supplier Registration); Intra-state CGST+SGST of Delhi applies.',
          'Place of Supply is Kolkata (Destination of Passenger); Inter-state IGST applies.',
          'Place of Supply is Mumbai (Location where goods taken on board); Inter-state IGST of Maharashtra applies.',
          'No GST is applicable since the supply was executed in the air space above Indian boundaries.'
        ],
        correctOptionIndex: 2,
        explanation: 'Under Section 10(1)(e) of the IGST Act, where goods are supplied on board a conveyance such as a vessel, aircraft, train, or motor vehicle, the place of supply shall be the location where such goods are taken on board. Since the tablet was loaded on board at Mumbai, the Place of Supply is Mumbai (Maharashtra). The supplier is registered in Delhi, so Delhi (Supplier) to Mumbai (POS) makes it an inter-state supply attracting IGST.'
      } as GeneralQuestion
    },
    {
      type: 'general',
      data: {
        id: 'IDT_G_08',
        subjectId: 'IDT',
        chapterName: 'Place of Supply',
        questionText: 'A Singapore-based oil exploration corporation ships an underwater drilling camera to an engineering testing laboratory in Chennai for urgent repairs and software calibration. The camera is temporarily imported into India solely for this repair work and subsequently shipped back to Singapore without being put to any other use in India. What is the Place of Supply of this testing/repair service u/s Section 13 of the IGST Act?',
        options: [
          'Chennai (Location of testing lab) under Sec 13(3)(a) since services are physically performed on goods.',
          'Singapore (Location of recipient) under default Sec 13(2) rule by virtue of the repair export exception.',
          'Delhi (Central statutory registry).',
          'Export from India is exempt, so no Place of Supply is defined.'
        ],
        correctOptionIndex: 1,
        explanation: 'Under Section 13(3)(a) of the IGST Act, services supplied in respect of goods that are required to be made physically available are generally placed where performed. However, the proviso to Sec 13(3)(a) exempts goods temporarily imported into India for repairs, calibration, or treatment/process and exported back after treatment without being used in India. For such cases, the default Place of Supply rule under Section 13(2) applies, which is the location of the recipient of services (Singapore). Because POS is outside India and the supplier is in India, it qualifies as an export of service if other conditions of Section 2(6) are met.'
      } as GeneralQuestion
    },
    {
      type: 'case',
      data: {
        id: 'IDT_C_02',
        subjectId: 'IDT',
        chapterName: 'Place of Supply',
        scenarioTitle: 'Cross-Border Logistics, Place of Supply & RCM Operations of Bharat Logistics',
        scenarioText: 'Bharat Logistics Ltd, registered under GST in Chennai (Tamil Nadu), provides premium transport, event management, and business advisory services. The company conducts the following transactions during a quarterly cycle:\n\n1. It organises an international medical conference in Dubai (UAE) for Appasamy Medicare Ltd (registered B2B in Chennai, Tamil Nadu).\n2. It rents out a high-tech warehouse facility located in Bangalore (Karnataka) to a B2B client registered in Hyderabad (Telangana).\n3. It imports specialized consultancy services from a software firm in Germany. The Chennai office uses this consultancy for designing routing charts. The transaction involves no monetary consideration since the German firm is a related company.\n4. It books high-speed rail passenger tickets for individual employees of a registered IT firm from Delhi to Jaipur (journey starting Delhi). The IT firm is registered in Noida (Uttar Pradesh).',
        subQuestions: [
          {
            id: 'IDT_CS_2_1',
            subjectId: 'IDT',
            chapterName: 'Place of Supply',
            questionText: 'What is the Place of Supply of the event organisation service in Dubai provided to Appasamy Medicare Ltd under Section 12(7) of the IGST Act?',
            options: [
              'Dubai (Location outside India where event is held).',
              'Chennai (Location of the registered recipient B2B).',
              'Chennai (Location of the supplier).',
              'Hyderabad (Central statutory office).'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 12(7)(a)(i) of the IGST Act, when services are provided to a registered person (B2B) for organizing an event, the Place of Supply is the location of such registered person. Since Appasamy Medicare is registered in Chennai, the POS is Chennai, even though the physical event is held in Dubai.'
          },
          {
            id: 'IDT_CS_2_2',
            subjectId: 'IDT',
            chapterName: 'Place of Supply',
            questionText: 'What is the Place of Supply for renting the warehouse located in Bangalore u/s Section 12(3) of the IGST Act?',
            options: [
              'Chennai (Supplier location).',
              'Hyderabad (Recipient registration location).',
              'Bangalore (Location where the immovable property is situated).',
              'Shared equally between Tamil Nadu, Karnataka and Telangana.'
            ],
            correctOptionIndex: 2,
            explanation: 'Under Section 12(3)(a) of the IGST Act, any service provided in direct relation to immovable property (including lodging, renting, construction, etc.) has its Place of Supply placed at the location where the immovable property is situated. Since the warehouse is situated in Bangalore, the POS is Bangalore (Karnataka).'
          },
          {
            id: 'IDT_CS_2_3',
            subjectId: 'IDT',
            chapterName: 'Charge of GST',
            questionText: 'Analyze the taxability of the free software consultancy imported from the German related company under Schedule I and Section 7(1)(c) of the CGST Act.',
            options: [
              'It does not attract GST because there is no consideration.',
              'Deemed supply u/s Schedule I Para 4; Bharat Logistics Chennai must pay IGST under RCM as it is between related persons for business furtherance without consideration.',
              'The German company must register in India and charge forward CGST.',
              'It is exempt because it involves software and routing diagrams.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Schedule I Para 4, import of services by a taxable person from a related person or from any of his other establishments outside India, in the course or furtherance of business, is deemed to be a supply even if made without consideration. Since the supplier is in Germany and recipient is in Chennai, it is an inter-state supply of service, and Chennai Bharat Logistics is liable to pay IGST on a reverse charge basis (RCM).'
          },
          {
            id: 'IDT_CS_2_4',
            subjectId: 'IDT',
            chapterName: 'Place of Supply',
            questionText: 'What is the Place of Supply for the passenger transportation service (Delhi to Jaipur) billed to the B2B IT firm registered in Noida (Uttar Pradesh) under Section 12(9) of the IGST Act?',
            options: [
              'Delhi (Location where the passenger embarks on the conveyance for the continuous journey).',
              'Noida, Uttar Pradesh (Location of the registered B2B recipient).',
              'Jaipur, Rajasthan (Destination of the journey).',
              'Chennai, Tamil Nadu (Location of the supplier).'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 12(9)(a) of the IGST Act, the Place of Supply of a passenger transportation service provided to a registered person (B2B) is the location of such registered person (Noida, Uttar Pradesh). The embarkation location (Delhi) applies only when supplied to an unregistered recipient u/s 12(9)(b).'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'IDT_C_03',
        subjectId: 'IDT',
        chapterName: 'Refunds',
        scenarioTitle: 'Zero-Rated Export Refunds (Rule 89(4)) & Customs Valuation (Rule 10) of Orion Global Exports',
        scenarioText: 'Orion Global Exports Ltd. (registered in Gujarat) manufactures and exports technical textiles under Bond/Letter of Undertaking (LUT) without payment of IGST, and also makes domestic taxable supplies. For the quarter ended December 2025, the following figures are recorded:\n\n• Export of Goods under LUT (FOB Value = ₹240 Lakhs; Invoice Value = ₹250 Lakhs; Payment realized within FEMA timelines): Zero-rated turnover.\n• Domestic Taxable Turnover (excluding GST): ₹160 Lakhs.\n• Net ITC availed during the quarter on Inputs & Input Services (excluding Capital Goods): ₹36 Lakhs.\n• ITC availed on Capital Goods during the quarter: ₹12 Lakhs.\n\nAdditionally, Orion Global imported a high-speed German weaving machine:\n• FOB Price in Germany: EUR 50,000 | Air Freight to Mumbai Port: EUR 12,000 | Transit Insurance: EUR 1,500.\n• Orion paid Buying Commission of EUR 1,000 to its own buying agent in Frankfurt, and a mandatory Patent License Fee of EUR 4,000 as a condition of sale of the machine.\n• CBIC Notified Exchange Rate = ₹90/EUR; RBI Rate = ₹89/EUR. Basic Customs Duty (BCD) = 10%, Social Welfare Surcharge (SWS) = 10%, IGST u/s 3(7) = 18%.',
        subQuestions: [
          {
            id: 'IDT_CS_3_1',
            subjectId: 'IDT',
            chapterName: 'Refunds',
            questionText: 'Under Explanation to Rule 89(4)(C) of the CGST Rules, what is the "Turnover of Zero-Rated Supply of Goods" for the LUT refund calculation?',
            options: [
              '₹250 Lakhs (Invoice Value)',
              '₹240 Lakhs (Lower of Invoice Value ₹250 Lakhs or FOB Value declared in Shipping Bill ₹240 Lakhs)',
              '₹360 Lakhs (1.5 times domestic turnover)',
              '₹245 Lakhs (Average of FOB and Invoice Value)'
            ],
            correctOptionIndex: 1,
            explanation: 'As per the amended Explanation to Rule 89(4)(C), the value of zero-rated supply of goods to be included while calculating "Turnover of zero-rated supply of goods" is the value declared in the tax invoice OR the value declared in the shipping bill (FOB value), whichever is LESS. Hence, lower of ₹250L and ₹240L = ₹240 Lakhs.'
          },
          {
            id: 'IDT_CS_3_2',
            subjectId: 'IDT',
            chapterName: 'Refunds',
            questionText: 'Compute the Maximum Refund of Unutilized ITC admissible to Orion Global Exports Ltd. under Section 54(3) read with Rule 89(4).',
            options: [
              '₹21.60 Lakhs',
              '₹28.80 Lakhs',
              '₹22.05 Lakhs',
              '₹36.00 Lakhs'
            ],
            correctOptionIndex: 0,
            explanation: 'Under Rule 89(4), Refund Amount = (Turnover of Zero-Rated Supply of Goods ₹240L / Adjusted Total Turnover [₹240L + ₹160L = ₹400L]) × Net ITC on Inputs & Input Services (₹36L). Note: ITC on Capital Goods (₹12L) is excluded from Net ITC under Rule 89(4). Refund = (240 / 400) × ₹36 Lakhs = 0.60 × 36L = ₹21.60 Lakhs.'
          },
          {
            id: 'IDT_CS_3_3',
            subjectId: 'IDT',
            chapterName: 'Valuation under the Customs Act, 1962',
            questionText: 'Determine the Assessable Value (CIF) in EUR and INR of the imported German weaving machine under Section 14 of the Customs Act, 1962 read with Rule 10(1) and Rule 10(2).',
            options: [
              'EUR 66,300; Assessable Value in INR = ₹59,67,000',
              'EUR 68,500; Assessable Value in INR = ₹61,65,000',
              'EUR 65,500; Assessable Value in INR = ₹58,95,000',
              'EUR 66,300; Assessable Value in INR = ₹59,00,700'
            ],
            correctOptionIndex: 0,
            explanation: 'Step 1: Under Rule 10(1), Buying Commission (EUR 1,000) is excluded, while Patent License Fee paid as a condition of sale (EUR 4,000) is included. Adjusted FOB = 50,000 + 4,000 = EUR 54,000. Step 2: Under Rule 10(2) proviso, Air Freight is capped at 20% of Adjusted FOB = 20% of EUR 54,000 = EUR 10,800 (since actual air freight EUR 12,000 > 20%). Add Insurance = EUR 1,500. Total CIF = 54,000 + 10,800 + 1,500 = EUR 66,300. Step 3: Convert using CBIC Notified Exchange Rate (₹90/EUR) = 66,300 × 90 = ₹59,67,000.'
          },
          {
            id: 'IDT_CS_3_4',
            subjectId: 'IDT',
            chapterName: 'Types of Duty',
            questionText: 'Based on the Assessable Value of ₹59,67,000 (BCD 10%, SWS 10% on BCD, IGST 18%), what is the total Customs Duty payable (BCD + SWS + IGST) and how much of it is eligible as GST Input Tax Credit?',
            options: [
              'Total Duty = ₹18,48,577; Eligible GST ITC = ₹11,92,207 (only IGST component)',
              'Total Duty = ₹18,48,577; Eligible GST ITC = ₹18,48,577 (entire duty including BCD & SWS)',
              'Total Duty = ₹16,70,760; Eligible GST ITC = ₹10,74,060',
              'Total Duty = ₹18,00,000; Eligible GST ITC = Nil'
            ],
            correctOptionIndex: 0,
            explanation: 'BCD @ 10% = ₹5,96,700. SWS @ 10% of BCD = ₹59,670. Subtotal for IGST = 59,67,000 + 5,96,700 + 59,670 = ₹66,23,370. IGST u/s 3(7) @ 18% = ₹11,92,207. Total Customs Duty = 5,96,700 + 59,670 + 11,92,207 = ₹18,48,577. Only the IGST paid u/s 3(7) is eligible as Input Tax Credit under GST; BCD and SWS are non-creditable cost components.'
          }
        ]
      } as CaseScenario
    }
  ],
  IBS: [
    {
      type: 'case',
      data: {
        id: 'IBS_C_00',
        subjectId: 'IBS',
        chapterName: 'Case Scenarios',
        scenarioTitle: 'Aetherion Mobility Ltd. — 7-Subject Master Case Study (FR, AFM, DT, IDT, Audit, SPOM Set A Law & Set B SCMPE)',
        scenarioText: 'Aetherion Mobility Ltd. (a listed Indian EV & clean-tech conglomerate opting for the Section 115BAA 25.168% corporate tax regime) executed the following strategic transactions during FY 2025-26 (A.Y. 2026-27):\n\n1. Financial Reporting (Ind AS 103 & Ind AS 12): On 1 April 2025, Aetherion acquired 80% equity in VoltCore Battery Systems Ltd. for ₹640 Crore. Carrying amount of VoltCore\'s identifiable net assets = ₹500 Crore; Fair Value = ₹600 Crore (due to ₹100 Crore fair value uplift on a patented solid-state battery design whose tax base remains ₹500 Crore). Fair Value of 20% Non-Controlling Interest (NCI) on acquisition date = ₹155 Crore.\n2. Advanced Financial Management (AFM — WACC, EVA & Forex Hedging): Post-acquisition Invested Capital = ₹1,200 Crore (60% Equity with Rf = 6.80%, Beta = 1.25, Market Risk Premium = 6.56%; 40% Debt with Pre-tax Kd = 10.00% and tax rate = 25.168%). Operating EBIT = ₹240 Crore. Additionally, Aetherion imported lithium cathode machinery for USD 5,000,000 payable in 6 months (Spot = ₹84.00/USD; 6-Month Forward = ₹85.60/USD; 6M US Deposit Rate = 4.00% p.a.; 6M India Borrowing Rate = 9.00% p.a.).\n3. Direct Tax (Sec 50B Slump Sale & Sec 92CE Secondary Adjustment): On 1 October 2025, Aetherion transferred its legacy IC Engine Division (held for 9 years) via slump sale for ₹210 Crore lump-sum cash. Tax WDV of depreciable block u/s 43(6)(c) = ₹115 Crore; Book value of non-depreciable assets = ₹65 Crore (which includes ₹20 Crore upward revaluation of factory land done in 2022); Liabilities = ₹35 Crore. Rule 11UAE FMV1 = ₹228 Crore. Separately, a primary Transfer Pricing adjustment of ₹18 Crore was made in respect of royalty paid to its German Associated Enterprise, Aetherion GmbH.\n4. Indirect Tax (GST Going Concern & Customs Rule 10(1)(c)): The IC Engine Division was transferred as a going concern as a whole. For the USD 5,000,000 CIF imported cathode machinery, Aetherion was contractually required to pay a one-time patent licence fee of USD 250,000 to the foreign supplier as a condition of sale (CBIC notified exchange rate = ₹84.10/USD).\n5. Auditing (Sec 143(12) & CARO 2020): Statutory audit revealed a ₹1.45 Crore copper scrap embezzlement by the IC Engine Plant Head, and a ₹6.50 Crore receivable overstatement in quarterly working capital statements submitted to a consortium of banks (sanctioned working capital limit = ₹35 Crore).\n6. Corporate & Economic Laws (SPOM Set A — Sec 185 & SEBI LODR Reg 23): Aetherion proposed a ₹45 Crore corporate loan at 9.20% p.a. to Helios Auto Components Pvt. Ltd. (in which Aetherion\'s Managing Director holds 28% voting power) for expansion of Helios\'s principal manufacturing plant.\n7. SCMPE (SPOM Set B — Divisional Transfer Pricing): VoltCore Division has a capacity of 1,00,000 battery packs/year (Variable Manufacturing Cost = ₹42,000/pack; Variable Selling Cost = ₹3,000/pack; External Market Price = ₹60,000/pack; External Demand = 75,000 packs/year). Aetherion\'s EV Assembly Division requires 40,000 packs/year internally (on which the ₹3,000/pack variable selling cost is completely saved).',
        subQuestions: [
          {
            id: 'IBS_CS_0_1',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[1. Financial Reporting — Ind AS 103 & Ind AS 12] Compute the Deferred Tax Liability (DTL) on the fair value uplift and the Goodwill to be recognized on the acquisition of VoltCore Battery Systems Ltd. on 1 April 2025.',
            options: [
              'DTL = Nil; Goodwill = ₹195.00 Crore',
              'DTL = ₹25.168 Crore; Goodwill = ₹220.168 Crore (and no further DTL is recognized on initial recognition of Goodwill under Ind AS 12 Para 15(a))',
              'DTL = ₹25.168 Crore; Goodwill = ₹169.832 Crore',
              'DTL = ₹30.00 Crore; Goodwill = ₹225.00 Crore'
            ],
            correctOptionIndex: 1,
            explanation: 'Taxable Temporary Difference on patented technology = Fair Value Uplift ₹100 Cr. DTL @ 25.168% (Sec 115BAA) = ₹25.168 Crore. Tax-adjusted Fair Value of Identifiable Net Assets = ₹600 Cr − ₹25.168 Cr = ₹574.832 Crore. Goodwill u/s Ind AS 103 = Consideration (₹640 Cr) + Fair Value of 20% NCI (₹155 Cr) − Net Assets (₹574.832 Cr) = ₹220.168 Crore.'
          },
          {
            id: 'IBS_CS_0_2',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[2. Advanced Financial Management — EVA & Forex Hedging] Compute Aetherion\'s Economic Value Added (EVA) and determine the optimal hedging strategy for the 6-month USD 5,000,000 import payable.',
            options: [
              'WACC = 12.00%, EVA = +₹35.60 Crore; Choose 6-Month Forward Cover (Outflow ₹42.80 Crore vs. Money Market Hedge Outflow ₹43.029 Crore, saving ₹22.94 Lakhs)',
              'WACC = 13.00%, EVA = +₹23.60 Crore; Choose Money Market Hedge (Outflow ₹41.18 Crore)',
              'WACC = 12.00%, EVA = +₹96.00 Crore; Remain unhedged',
              'WACC = 11.00%, EVA = +₹47.60 Crore; Choose Money Market Hedge'
            ],
            correctOptionIndex: 0,
            explanation: 'Ke = 6.80% + 1.25 × 6.56% = 15.00%; Post-tax Kd = 10% × (1 − 0.25168) = 7.4832%; WACC = (0.60 × 15%) + (0.40 × 7.4832%) ≈ 12.00%. NOPAT = ₹240 Cr × (1 − 0.25168) = ₹179.60 Cr; Capital Charge = ₹1,200 Cr × 12% = ₹144.00 Cr ⇒ EVA = +₹35.60 Crore. For USD 5M import: Forward Outflow = 5M × 85.60 = ₹42.80 Crore; Money Market Hedge Outflow = (5M / 1.02) × 84.00 × 1.045 = ₹43.0294 Crore. Forward Cover is cheaper by ₹22.94 Lakhs.'
          },
          {
            id: 'IBS_CS_0_3',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[3. Direct Tax Laws — Sec 50B Slump Sale & Sec 92CE] Compute the Long-Term Capital Gain u/s 50B on the slump sale of the IC Engine Division and state the consequence of the ₹18 Crore primary TP adjustment u/s 92CE.',
            options: [
              'Net Worth = ₹145 Crore; LTCG = ₹65 Crore; No secondary adjustment applies below ₹25 Crore.',
              'Net Worth = ₹125 Crore (ignoring ₹20 Crore land revaluation); Full Value of Consideration u/r 11UAE = ₹228 Crore (higher of FMV1 ₹228 Cr or FMV2 ₹210 Cr); LTCG u/s 50B = ₹103 Crore; and ₹18 Crore excess royalty must be repatriated within 90 days or attract imputed interest / 20.9664% one-time additional tax u/s 92CE(2A).',
              'Net Worth = ₹125 Crore; LTCG = ₹85 Crore; Sec 92CE applies only to domestic transactions.',
              'Exempt under Section 47(vib).'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Explanation 2 to Sec 50B, upward revaluation of ₹20 Cr is ignored, so Non-Depreciable Assets = ₹45 Cr. Net Worth = ₹115 Cr (Tax WDV) + ₹45 Cr − ₹35 Cr (Liabilities) = ₹125 Crore. Deemed Consideration u/r 11UAE = max(FMV1 ₹228 Cr, FMV2 ₹210 Cr) = ₹228 Crore. LTCG u/s 50B = ₹228 Cr − ₹125 Cr = ₹103 Crore. Since primary TP adjustment (₹18 Cr) exceeds ₹1 Crore, Sec 92CE mandates repatriation within 90 days or payment of 18% additional tax (+ 12% SC + 4% Cess = 20.9664%) u/s 92CE(2A).'
          },
          {
            id: 'IBS_CS_0_4',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[4. Indirect Tax Laws — GST Going Concern & Customs Rule 10(1)(c)] Determine the GST treatment on the slump sale of the IC Engine Division and the Customs Assessable Value of the imported cathode machinery.',
            options: [
              'Slump sale is taxable @ 18% GST; Customs Assessable Value = USD 5,000,000 × ₹84.10 = ₹42,05,00,000.',
              'Transfer of going concern is exempt under Entry 2 of Notification No. 12/2017-CT(R) (unutilized ITC transferred via Form GST ITC-02 u/s 18(3)); and compulsory patent licence fee of USD 250,000 is added under Rule 10(1)(c), giving Customs Assessable Value = USD 5,250,000 × ₹84.10 = ₹44,15,25,000.',
              'Slump sale is zero-rated under Section 16 IGST Act; Customs Assessable Value excludes patent licence fees.',
              'Slump sale attracts 12% GST; Customs Assessable Value uses RBI reference rate.'
            ],
            correctOptionIndex: 1,
            explanation: 'Transfer of a going concern as a whole or an independent part thereof is exempt under Notification No. 12/2017-CT(R) Entry 2, with unutilized ITC transferable via Form GST ITC-02 u/s 18(3) read with Rule 41. Under Customs Valuation Rule 10(1)(c), royalty/licence fees related to imported goods that the buyer is required to pay as a condition of sale (USD 250,000) are includible, resulting in Assessable Value = USD 5,250,000 × ₹84.10 (CBIC notified rate) = ₹44,15,25,000.'
          },
          {
            id: 'IBS_CS_0_5',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[5. Auditing — Sec 143(12) & CARO 2020] What are the statutory auditor\'s reporting obligations regarding the ₹1.45 Crore copper scrap embezzlement and the ₹6.50 Crore working capital statement discrepancy?',
            options: [
              'Report fraud only to Audit Committee since it is below ₹5 Crore; ignore working capital variance.',
              'Since fraud is ≥ ₹1 Crore (₹1.45 Cr), report to Board/Audit Committee within 2 days, wait 45 days for reply, and forward Form ADT-4 to Central Government (MCA) within 15 days u/s 143(12) read with Rule 13; and report under CARO 2020 Clauses (xi)(a), (xi)(b), and Clause (ii)(b) (since sanctioned working capital limit > ₹5 Crore).',
              'File Form ADT-4 directly within 3 days without informing the Board.',
              'Report only in Key Audit Matters under SA 701.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 143(12) read with Rule 13, any fraud by an officer or employee involving ₹1 Crore or more requires reporting to the Board/Audit Committee within 2 days, waiting 45 days for their reply, and filing Form ADT-4 with the Secretary, MCA within 15 days. Additionally, CARO 2020 mandates reporting under Clause (xi)(a)/(b) for fraud and Clause (ii)(b) because sanctioned working capital limits exceed ₹5 Crore (₹35 Cr) and quarterly statements do not agree with the books.'
          },
          {
            id: 'IBS_CS_0_6',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[6. Corporate & Economic Laws (SPOM Set A) — Companies Act Sec 185] Can Aetherion Mobility Ltd. legally advance the ₹45 Crore loan to Helios Auto Components Pvt. Ltd. (in which Aetherion\'s MD holds 28% voting power)?',
            options: [
              'No, it is an absolute prohibition under Section 185(1) of the Companies Act, 2013.',
              'Yes, permissible with simple Board resolution under Section 179.',
              'Yes, permissible under Section 185(2) (since Helios is a private company in which a director exercises ≥ 25% voting power / is a member) ONLY IF a Special Resolution is passed by Aetherion in General Meeting AND the loan is utilized by Helios exclusively for its principal business activities.',
              'Yes, requires only Central Government approval.'
            ],
            correctOptionIndex: 2,
            explanation: 'Under Section 185(2) of the Companies Act, 2013, a company may advance a loan to any person in whom any of the director of the company is interested (including a private company in which such director is a director or member, or a body corporate where ≥ 25% voting power is exercised) subject to two mandatory conditions: (a) a Special Resolution is passed in general meeting with full disclosures in the explanatory statement, and (b) the borrowing company utilizes the loan for its principal business activities.'
          },
          {
            id: 'IBS_CS_0_7',
            subjectId: 'IBS',
            chapterName: 'Case Scenarios',
            questionText: '[7. SCMPE (SPOM Set B) — Divisional Transfer Pricing] What is the Minimum Transfer Price per battery pack that VoltCore Division should charge the EV Assembly Division for the 40,000 internal units to preserve goal congruence?',
            options: [
              '₹42,000 per pack for all 40,000 units',
              '₹60,000 per pack for all 40,000 units',
              '₹42,000/pack for the first 25,000 units (spare capacity) and ₹57,000/pack for the next 15,000 units (₹42,000 VC + ₹15,000 net lost contribution after saving ₹3,000 selling cost) ⇒ Weighted Minimum Transfer Price = ₹47,625 per pack',
              '₹48,750 per pack (ignoring saved variable selling expenses)'
            ],
            correctOptionIndex: 2,
            explanation: 'Spare capacity = 1,00,000 − 75,000 = 25,000 packs (Opportunity Cost = ₹0 ⇒ Min TP = ₹42,000/pack). For the remaining 15,000 packs, external sales are foregone: External Contribution = ₹60,000 − (₹42,000 + ₹3,000) = ₹15,000/pack ⇒ Min TP = ₹42,000 + ₹15,000 = ₹57,000/pack. Weighted Minimum Transfer Price across 40,000 packs = [(25,000 × ₹42,000) + (15,000 × ₹57,000)] / 40,000 = ₹47,625 per pack.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'general',
      data: {
        id: 'IBS_G_01',
        subjectId: 'IBS',
        chapterName: 'Cross-functional Integration',
        questionText: 'A manufacturing listed company is undergoing restructures. To optimize AFM cost of capital, it demerges its real-estate segment. In accounting, it adopts Ind AS 103 (Appendix C) book-value entries. For Direct Tax, it satisfies Section 2(19AA) demerger criteria. On the date of demerger, how should the demerged entity value the transfer of assets in its statutory accounts under Ind AS, and how does that impact the capital gains tax liability under Section 47 u/s Income Tax?',
        options: [
          'Assets must be recorded at Fair valuation under Ind AS; which triggers an immediate 30% capital gains tax on the difference.',
          'Assets are transferred at Book value in accounting (representing common control under App. C); and the transfer is completely exempt from Capital Gains u/s 47(vib) of the Income Tax Act.',
          'Assets are written off completely; triggering 20% MAT under section 115JB.',
          'The transfer must be recorded at fair value, but taxes are deferred for 15 years.'
        ],
        correctOptionIndex: 1,
        explanation: 'For corporate spin-offs/demergers under common control, Ind AS 103 Appendix C mandates pooling of interest method (book value transfers). In Direct Tax, Section 47(vib) exempts any transfer of capital assets in a demerger by a demerged company to a resulting Indian company from capital gains, provided the demerger fits the criteria of Sec 2(19AA) (all assets/liabilities transfer at book value).'
      } as GeneralQuestion
    },
    {
      type: 'case',
      data: {
        id: 'IBS_C_01',
        subjectId: 'IBS',
        chapterName: 'Cross-functional Integration',
        scenarioTitle: 'Vanguard Infrastructure Multi-Disciplinary Case Study (FR, DT, IDT, Audit & AFM)',
        scenarioText: 'Vanguard Infrastructure Ltd. (a listed conglomerate) is executing a corporate demerger of its Renewable Power Division into a newly incorporated resulting company, Vanguard Green Energy Ltd., on 1 October 2025. The CFO and Statutory Auditors review the following cross-functional parameters:\n\n1. Ind AS & Direct Tax Valuation: Fair Value of the Power Division\'s identifiable net assets = ₹750 Crore; Carrying Book Value = ₹350 Crore. Vanguard Green Energy issues equity shares to existing shareholders of Vanguard Infrastructure on a proportionate basis.\n2. Accumulated Tax Losses: The Power Division has directly attributable accumulated business losses of ₹90 Crore and unabsorbed depreciation u/s 32 of ₹120 Crore.\n3. GST Implications: The entire Renewable Power Division (with all assets, liabilities, and ongoing power purchase contracts) is transferred as a going concern without any separate item-wise invoice consideration.\n4. Statutory Audit & CARO 2020: Physical verification of solar module inventory at the Gujarat plant revealed a 14% aggregate discrepancy against stock records, and quarterly working capital statements filed with SBI (sanctioned limit ₹40 Crore) overstated receivables by ₹9 Crore.',
        subQuestions: [
          {
            id: 'IBS_CS_1_1',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'To qualify as a tax-neutral demerger under Section 2(19AA) and Section 47(vib) of the Income-tax Act, 1961, at what value must the assets and liabilities be transferred, and what is the minimum shareholder continuity requirement?',
            options: [
              'At Fair Value of ₹750 Crore; shareholders holding at least 51% value must become shareholders of resulting company.',
              'At Book Value of ₹350 Crore (ignoring revaluation); shareholders holding not less than three-fourths (75%) in value of shares in the demerged company must become shareholders of the resulting company.',
              'At average value of ₹550 Crore; 90% shareholder continuity.',
              'At zero value; 100% shareholder continuity.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 2(19AA) of the Income-tax Act, 1961, assets and liabilities of the undertaking must be transferred at values appearing in the books of account immediately before the demerger (ignoring revaluation), and shareholders holding at least 75% (three-fourths) in value of shares in the demerged company must become shareholders of the resulting company.'
          },
          {
            id: 'IBS_CS_1_2',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Section 72A(4) of the Income-tax Act, 1961, how are the directly attributable business loss (₹90 Crore) and unabsorbed depreciation (₹120 Crore) treated in the hands of Vanguard Green Energy Ltd.?',
            options: [
              'Both lapse permanently upon demerger.',
              'Both ₹90 Crore business loss (for the unexpired period of 8 years) and ₹120 Crore unabsorbed depreciation are carried forward and set off by the resulting company Vanguard Green Energy Ltd.',
              'Only ₹120 Crore unabsorbed depreciation transfers; business loss stays with the demerged company.',
              'A fresh period of 8 years starts for the ₹90 Crore business loss.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Section 72A(4), where accumulated loss and unabsorbed depreciation are directly relatable to the undertakings transferred in a demerger, they are allowed to be carried forward and set off in the hands of the resulting company (business loss for the remaining balance of the 8-year period).'
          },
          {
            id: 'IBS_CS_1_3',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'What is the GST treatment of transferring the entire Renewable Power Division as a going concern, and how is the unutilized Electronic Credit Ledger ITC of Vanguard Infrastructure transferred?',
            options: [
              'Taxable @ 18% IGST on ₹350 Crore; ITC lapses.',
              'Service by way of transfer of a going concern as a whole or an independent part thereof is EXEMPT under Notification No. 12/2017-CT (Rate), and unutilized ITC is transferred to Vanguard Green Energy in the ratio of value of assets via Form GST ITC-02 u/s 18(3) read with Rule 41.',
              'Exempt from GST, but requires 50% ITC reversal under Rule 42.',
              'Taxable at 12% composite rate.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Entry 2 of Notification No. 12/2017-CT(R), transfer of a going concern as a whole or an independent part thereof is an exempt supply of service. Under Section 18(3) and Rule 41, in case of demerger, unutilized ITC is apportioned in the ratio of the value of assets of the new units as specified in the demerger scheme by filing Form GST ITC-02.'
          },
          {
            id: 'IBS_CS_1_4',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'How must the statutory auditor of Vanguard Infrastructure Ltd. report the 14% solar module inventory discrepancy and the ₹9 Crore receivable variance in quarterly bank statements under CARO 2020?',
            options: [
              'Neither requires reporting since the division is being demerged.',
              'Both require mandatory reporting under CARO 2020: the 14% inventory discrepancy (being >= 10%) under Clause (ii)(a), and the ₹9 Crore quarterly return discrepancy (working capital limit > ₹5 Crore) under Clause (ii)(b).',
              'Only the bank variance is reported under Clause (ix); inventory discrepancy below 20% is ignored.',
              'Reported only in Form ADT-4 to the Central Government.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under CARO 2020 Clause (ii)(a), inventory discrepancies of 10% or more in aggregate for each class of inventory must be reported. Under Clause (ii)(b), since sanctioned working capital limits exceed ₹5 Crores (₹40 Cr) on security of current assets, the ₹9 Crore discrepancy between quarterly bank statements and books of account must be reported.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'IBS_C_02',
        subjectId: 'IBS',
        chapterName: 'Cross-functional Integration',
        scenarioTitle: 'NovaTech Multinational Integrated Case Study (Ind AS 109/21, AFM Forex, DT Sec 92B/195 & Audit SA 540)',
        scenarioText: 'NovaTech India Ltd. (a listed technology hardware manufacturer in Bengaluru) entered into a multi-layered cross-border expansion during FY 2025-26:\n\n1. Foreign Currency Convertible Bonds (FCCBs) & Ind AS 32/109: On 1 April 2025, NovaTech issued 5-year 4% Bonds worth ₹200 Crore where each bond is mandatorily convertible into a fixed number of equity shares at maturity, while annual 4% interest coupons are payable in cash (Market yield on comparable non-convertible debt = 9% p.a.; PV factor of 5-year annuity at 9% = 3.890).\n2. AFM & Ind AS 21 Forex Exposure: NovaTech imported semiconductor wafer fabs worth USD 2,000,000 on 1 January 2026 (Spot rate = ₹83.00/USD) settled on 31 May 2026. On 31 March 2026 (Balance Sheet date), Spot USD/INR = ₹84.20/USD.\n3. Direct Tax & International Tax: NovaTech paid ₹12 Crore to a US Cloud Server provider (having no physical presence or servers in India, but earning ₹35 Crore aggregate revenue from 4,50,000 Indian users during FY 2025-26).\n4. Statutory Audit (SA 540 & SA 701): Management recognized a ₹45 Crore Deferred Tax Asset (DTA) on carry-forward losses assuming 40% annual compound revenue growth over the next 5 years, despite three consecutive years of operating losses.',
        subQuestions: [
          {
            id: 'IBS_CS_2_1',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Ind AS 32 ("Financial Instruments: Presentation"), how should the ₹200 Crore 4% mandatorily convertible bonds (with mandatory cash interest coupons for 5 years) be classified on 1 April 2025?',
            options: [
              'Entire ₹200 Crore is classified as Financial Liability.',
              'Entire ₹200 Crore is classified as Equity.',
              'Compound Financial Instrument: Financial Liability component = ₹31.12 Crore (PV of 5 annual ₹8 Cr cash interest payments discounted at 9% = 8 × 3.890); Equity component = ₹168.88 Crore (residual 200 - 31.12).',
              'Derivative Liability measured at FVTPL.'
            ],
            correctOptionIndex: 2,
            explanation: 'Under Ind AS 32, a mandatorily convertible bond (fixed-for-fixed principal conversion) with contractual cash interest payments is a Compound Financial Instrument. The contractual obligation to pay ₹8 Crore (4% of ₹200 Cr) annually for 5 years is a Financial Liability measured at PV = ₹8 Cr × 3.890 = ₹31.12 Crore. The residual ₹168.88 Crore (200 - 31.12) represents the Equity conversion component.'
          },
          {
            id: 'IBS_CS_2_2',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Ind AS 21 ("The Effects of Changes in Foreign Exchange Rates"), how must the USD 2,000,000 trade payable be remeasured on 31 March 2026 (Spot rate ₹84.20 vs initial ₹83.00)?',
            options: [
              'Carried at historical rate ₹83.00/USD since settlement is in May 2026.',
              'Remeasured at closing spot rate ₹84.20/USD (since trade payable is a foreign currency monetary item), recognizing a foreign exchange loss of ₹24,00,000 in Profit or Loss for FY 2025-26.',
              'Exchange loss of ₹24,00,000 is capitalized into the cost of semiconductor inventory under Ind AS 2.',
              'Exchange loss is deferred in Foreign Currency Translation Reserve (OCI).'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 21 Para 23 & 28, foreign currency monetary items (such as trade payables) shall be translated using the closing rate at the end of each reporting period, and resulting exchange differences (USD 2,000,000 × [84.20 - 83.00] = ₹24,00,000 loss) shall be recognized in Profit or Loss.'
          },
          {
            id: 'IBS_CS_2_3',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Explanation 2A to Section 9(1)(i) of the Income-tax Act, 1961 read with Rule 11UD, does the US Cloud Server provider trigger "Significant Economic Presence" (SEP) in India under domestic law, and what overrides it if a valid US TRC is furnished?',
            options: [
              'No SEP is triggered because thresholds are ₹100 Crore revenue and 10 Lakh users.',
              'SEP is triggered under domestic law (since revenue exceeds ₹2 Crore AND users exceed 3,00,000), constituting a Business Connection u/s 9(1)(i); however, under Section 90(2), if there is no Permanent Establishment (PE) under Article 5 of the India-USA DTAA, business profits remain non-taxable in India.',
              'SEP automatically overrides all DTAAs under Section 90.',
              'NovaTech must deduct 60% tax under Section 115BBE.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Explanation 2A to Sec 9(1)(i) read with Rule 11UD, Significant Economic Presence (SEP) is triggered if aggregate payments exceed ₹2 Crore OR systematic interaction exceeds 3,00,000 users in India. Here both thresholds (₹35 Cr and 4.5 Lakh users) are exceeded. However, SEP is a domestic "Business Connection" rule; under Sec 90(2), if the non-resident holds a valid TRC and has no PE under the applicable DTAA, the narrower DTAA PE definition prevails.'
          },
          {
            id: 'IBS_CS_2_4',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Regarding the ₹45 Crore Deferred Tax Asset (DTA) recognized on unused tax losses despite 3 consecutive years of losses, what are the statutory requirements under Ind AS 12 Para 35 and SA 540 ("Auditing Accounting Estimates")?',
            options: [
              'DTA must be automatically accepted if approved by the CFO.',
              'Under Ind AS 12 Para 35, a history of recent losses is strong evidence that future taxable profit may not be available, requiring convincing other evidence; under SA 540, the auditor must test management\'s 40% growth assumptions for management bias, perform sensitivity analysis, and consider communicating the matter as a Key Audit Matter (SA 701) or modifying the opinion (SA 705) if unsubstantiated.',
              'DTA on tax losses is completely prohibited under Ind AS 12.',
              'The auditor only needs a simple written representation under SA 580 without testing projections.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 12 Para 34-36, when an entity has a history of recent losses, it recognizes a DTA arising from unused tax losses only to the extent that it has sufficient taxable temporary differences or there is convincing other evidence that sufficient taxable profit will be available. Under SA 540, the auditor must rigorously challenge the reasonableness of the 40% growth assumptions, evaluate indicators of possible management bias, and assess reporting impact under SA 701/SA 705.'
          }
        ]
      } as CaseScenario
    },
    {
      type: 'case',
      data: {
        id: 'IBS_C_03',
        subjectId: 'IBS',
        chapterName: 'Cross-functional Integration',
        scenarioTitle: 'KartIndia E-Commerce Marketplace Case Study (Ind AS 115, GST Sec 9(5)/52, DT Sec 194-O & AFM EVA)',
        scenarioText: 'KartIndia Marketplace Ltd. operates an electronic commerce platform in India connecting third-party merchants and cloud kitchens with retail consumers. During FY 2025-26, the following operational and financial events occurred:\n\n1. Revenue Model & Ind AS 115: For electronics sold by third-party sellers on the platform (Gross Merchandise Value = ₹500 Crore), KartIndia does not take physical title or inventory risk, does not set final retail prices, and earns a 12% platform facilitation commission (₹60 Crore).\n2. GST Sec 9(5) & Sec 52 TCS: KartIndia facilitated restaurant food delivery supplies worth ₹80 Crore on behalf of local restaurants (none of which are located in specified 7,500+ tariff hotel premises), and facilitated ₹500 Crore of taxable electronics sold by registered merchants.\n3. Income Tax Sec 194-O: An individual resident merchant, Mr. Rajesh (having furnished PAN), sold handicrafts aggregating ₹4,80,000 during the entire FY 2025-26 through KartIndia.\n4. AFM Economic Value Added (EVA): KartIndia’s NOPAT for FY 2025-26 is ₹42 Crore, Invested Capital is ₹250 Crore, Equity Weight = 60% (Cost of Equity = 15%), and Pre-tax Cost of Debt = 10% (Weight = 40%, Effective Tax Rate = 25%).',
        subQuestions: [
          {
            id: 'IBS_CS_3_1',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Ind AS 115 ("Revenue from Contracts with Customers" — Principal vs. Agent considerations), how much revenue must KartIndia Marketplace Ltd. recognize from the ₹500 Crore electronics GMV?',
            options: [
              '₹500 Crore gross revenue and ₹440 Crore cost of goods sold.',
              '₹60 Crore net commission revenue (since KartIndia acts as an Agent and does not control the specified goods before transfer to the customer).',
              '₹250 Crore (50% proportionate consolidation).',
              'Defer entire ₹60 Crore over 3 years.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under Ind AS 115 Appendix B (Para B34-B38), an entity is an agent if its performance obligation is to arrange for the provision of goods/services by another party (no inventory risk, no primary responsibility for fulfillment, no pricing discretion). An agent recognizes revenue only for the net fee or commission (₹60 Crore).'
          },
          {
            id: 'IBS_CS_3_2',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Section 9(5) and Section 52 of the CGST Act, 2017, what is KartIndia’s GST obligation on the ₹80 Crore restaurant services vs. the ₹500 Crore electronics supplies?',
            options: [
              'Collect 0.5% TCS u/s 52 on both ₹80 Crore restaurant services and ₹500 Crore electronics.',
              'Pay full output GST @ 5% (without ITC) as deemed supplier u/s 9(5) on the ₹80 Crore restaurant services; and collect GST TCS @ 0.5% (0.25% CGST + 0.25% SGST / 0.5% IGST) u/s 52 on net taxable supplies of ₹500 Crore electronics.',
              'Pay 18% GST u/s 9(5) on both categories.',
              'Exempt from both Sec 9(5) and Sec 52.'
            ],
            correctOptionIndex: 1,
            explanation: 'Restaurant services supplied through an ECO (other than restaurants in hotels with declared tariff > ₹7,500) are notified under Section 9(5) of the CGST Act, making the ECO liable to pay full GST @ 5% in cash as if it were the supplier (no TCS u/s 52 applies on Sec 9(5) supplies). For the ₹500 Crore electronics sold by third-party suppliers, KartIndia must collect GST TCS @ 0.5% total (0.25% CGST + 0.25% SGST or 0.5% IGST) under Section 52.'
          },
          {
            id: 'IBS_CS_3_3',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Under Section 194-O of the Income-tax Act, 1961, is KartIndia required to deduct TDS on the ₹4,80,000 gross sales of Mr. Rajesh (an individual who furnished PAN)?',
            options: [
              'Yes, deduct TDS @ 0.1% on ₹4,80,000.',
              'No TDS is deductible because for an Individual or HUF e-commerce participant who furnishes PAN/Aadhaar, no deduction u/s 194-O is made if gross sales through the ECO during the financial year do not exceed ₹5,00,000.',
              'Yes, deduct TDS @ 5% under Section 194H.',
              'Yes, deduct TDS @ 1% under Section 194C.'
            ],
            correctOptionIndex: 1,
            explanation: 'Under the proviso to Section 194-O(2), no tax is required to be deducted u/s 194-O if the e-commerce participant is an Individual or HUF, has furnished PAN or Aadhaar to the ECO, and the gross amount of sales during the previous year does not exceed ₹5,00,000.'
          },
          {
            id: 'IBS_CS_3_4',
            subjectId: 'IBS',
            chapterName: 'Cross-functional Integration',
            questionText: 'Compute the Weighted Average Cost of Capital (WACC) and Economic Value Added (EVA) of KartIndia Marketplace Ltd. for FY 2025-26.',
            options: [
              'WACC = 12.00%; EVA = +₹12.00 Crore',
              'WACC = 13.00%; EVA = +₹9.50 Crore',
              'WACC = 12.50%; EVA = +₹10.75 Crore',
              'WACC = 11.25%; EVA = +₹13.88 Crore'
            ],
            correctOptionIndex: 0,
            explanation: 'Post-tax Cost of Debt (Kd) = 10% × (1 - 0.25) = 7.50%. WACC = (0.60 × 15%) + (0.40 × 7.50%) = 9.00% + 3.00% = 12.00%. Capital Charge = Invested Capital (₹250 Cr) × WACC (12%) = ₹30.00 Crore. Economic Value Added (EVA) = NOPAT (₹42.00 Cr) - Capital Charge (₹30.00 Cr) = +₹12.00 Crore.'
          }
        ]
      } as CaseScenario
    }
  ],
  ...FOUNDATION_INTER_QUIZ_QUESTIONS,
  ...CMA_QUIZ_QUESTIONS
};

