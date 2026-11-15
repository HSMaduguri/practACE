/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubjectInfo, ChapterSummary, FormulaItem, StatutorySection, LimitRateItem, SubjectId } from '../types';
import { AUDIT_CHAPTER_SUMMARIES, AUDIT_STATUTORY_SECTIONS, AUDIT_LIMITS_RATES } from './auditSyllabusData';
import {
  FOUNDATION_SUBJECTS_METADATA,
  FOUNDATION_CHAPTER_SUMMARIES,
  FOUNDATION_FORM_ITEMS,
  FOUNDATION_STATUTORY_SECTIONS,
  FOUNDATION_LIMITS_RATES,
} from './foundationSyllabusData';
import {
  INTERMEDIATE_SUBJECTS_METADATA,
  INTERMEDIATE_CHAPTER_SUMMARIES,
  INTERMEDIATE_FORM_ITEMS,
  INTERMEDIATE_STATUTORY_SECTIONS,
  INTERMEDIATE_LIMITS_RATES,
} from './intermediateSyllabusData';
import {
  CMA_SUBJECTS_METADATA,
  CMA_CHAPTER_SUMMARIES,
  CMA_FORM_ITEMS,
  CMA_STATUTORY_SECTIONS,
  CMA_LIMITS_RATES,
} from './cmaSyllabusData';

export const SUBJECTS_METADATA: Record<SubjectId, SubjectInfo> = {
  AFM: {
    id: 'AFM',
    name: 'AFM',
    fullName: 'advanced financial management (AFM)',
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
    hasSections: false,
    hasLimits: false
  },
  FR: {
    id: 'FR',
    name: 'FR',
    fullName: 'Financial reporting (FR)',
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
    hasSections: false,
    hasLimits: false
  },
  Audit: {
    id: 'Audit',
    name: 'Audit',
    fullName: 'Advanced Auditing, Assurance and professional ethics (Audit)',
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
      'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
      'Professional Ethics & Liabilities of Auditors'
    ],
    hasSections: true,
    hasLimits: true
  },
  DT: {
    id: 'DT',
    name: 'DT',
    fullName: 'Direct Tax laws and international taxation (DT)',
    chapters: [
      'Basic Concepts',
      'Incomes which do not form part of Total Income',
      'Profits and Gains of Business or Profession',
      'Capital Gains',
      'Income from Other Sources',
      'Income of Other Persons included in Assessee\'s Total Income',
      'Aggregation of Income, Set Off or Carry Forward of Losses',
      'Deductions from Gross Total Income',
      'Assessment of Various Entities',
      'Assessment of Trusts and Institutions, Political Parties and Other Special Entities',
      'Tax Planning, Tax Avoidance and Tax Evasion',
      'Taxation of Digital Transactions',
      'Deduction, Collection and Recovery of Tax',
      'Income Tax Authorities',
      'Assessment Procedure',
      'Appeals and Revision',
      'Dispute Resolution',
      'Miscellaneous Provisions',
      'Provisions to Counteract Unethical Tax Practices',
      'Tax Audit and Ethical Compliances',
      'Non Resident Taxation',
      'Double Taxation Relief',
      'Advance Rulings',
      'Transfer Pricing',
      'Fundamentals Of Beps',
      'Application And Interpretation Of Tax Treaties',
      'Overview Of Model Tax Conventions',
      'Latest Developments In International Taxation'
    ],
    hasSections: true,
    hasLimits: true
  },
  IDT: {
    id: 'IDT',
    name: 'IDT',
    fullName: 'Indirect tax laws (IDT)',
    chapters: [
      'Supply under GST',
      'Charge of GST',
      'Place of Supply',
      'Exemptions from GST',
      'Time of Supply',
      'Value of Supply',
      'Input Tax Credit',
      'Registration',
      'Tax Invoice, Credit & Debit Notes',
      'Accounts and Records; E-way Bill',
      'Payment of Tax',
      'Electronic Commerce Transactions',
      'Returns',
      'Import and Export under GST',
      'Refunds',
      'Job Work',
      'Assessment and Audit',
      'Inspection, Search, Seizure and Arrest',
      'Demands and Recovery',
      'Liability to Pay in Certain Cases',
      'Offences and Penalties',
      'Appeals and Revision',
      'Advance Ruling',
      'Miscellaneous Provisions',
      'Levy of and Exemptions from Customs Duty',
      'Types of Duty',
      'Classification of Imported and Export Goods',
      'Valuation under the Customs Act, 1962',
      'Importation and Exportation of Goods',
      'Warehousing',
      'Customs Refunds',
      'Foreign Trade Policy'
    ],
    hasSections: true,
    hasLimits: true
  },
  IBS: {
    id: 'IBS',
    name: 'IBS',
    fullName: 'Integrated Business Solutions (Case Study Based)',
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
    hasSections: false,
    hasLimits: false
  },
  ...INTERMEDIATE_SUBJECTS_METADATA,
  ...FOUNDATION_SUBJECTS_METADATA,
  ...CMA_SUBJECTS_METADATA
};

export const CHAPTER_SUMMARIES: Record<SubjectId, ChapterSummary[]> = {
  AFM: [
    {
      chapterName: 'Security Valuation',
      keyPrinciples: [
        {
          title: 'Conceptual Foundations of Security Valuation & Required Return',
          description: 'Security valuation is the process of estimating the intrinsic value of an investment to assess whether its market price is undervalued, overvalued, or fairly priced. The required rate of return is the minimum rate of return that an investor must earn to justify committing funds to an asset over a specified period. It serves as the opportunity cost of capital—representing the highest expected return forgone from similar-risk alternative investments.',
          exception: 'While required rate of return and expected return are often used interchangeably in practice, expected return can deviate from the required return if the market is inefficient and the security is mispriced.',
          example: 'If a risk-free government security yield is 7.00% and an equity share carries an expected risk premium of 8.00%, the required rate of return (Ke) is 15.00%.'
        },
        {
          title: 'Capital Asset Pricing Model (CAPM) & Equity Risk Premium',
          description: 'The Capital Asset Pricing Model (CAPM) estimates the required return on equity by evaluating an asset’s contribution to the systematic risk (measured by Beta, β) of the total portfolio, which cannot be eliminated through diversification. The Equity Risk Premium (ERP) is the excess return that investing in equity shares provides over the risk-free rate (Rf) to compensate for this market risk: ERP = β * (Rm - Rf).',
          exception: 'Beta (β) measures systematic risk relative to the market index. If a stock is identical to the market index, its beta is 1, and its equity risk premium is equal to the market risk premium (Rm - Rf).',
          example: 'With risk-free rate Rf = 5.00%, β = 1.5, and market risk premium (Rm - Rf) = 4.50%, the required rate of return is: Ke = 0.05 + 1.5 * 0.045 = 11.75%.'
        },
        {
          title: 'Cash Flow & Discount Rate Alignment (Nominal vs. Real)',
          description: 'Symmetric temporal and monetary matching must be maintained: nominal cash flows (unadjusted for inflation) must be discounted using a nominal discount rate, whereas real cash flows (adjusted for inflation) must be discounted using a real discount rate. When cash flows are available strictly to equity shareholders, the appropriate discount rate is the cost of equity (Ke). When cash flows are available to meet the claims of all capital providers (stakeholders), the appropriate discount rate is the weighted average cost of capital (WACC or Ko).',
          exception: 'In conditions of low inflation or short-term horizons, nominal and real cash flows are approximately equal. However, in high-inflation environments, nominal cash flows will be significantly higher than real cash flows, making proper discount rate matching critical.',
          example: 'In equity valuation, nominal cash flows and nominal discount rates are legally preferred because corporate taxes and statutory financial statements are reported in nominal currency terms.'
        },
        {
          title: 'Dividend Discount Models (DDM)',
          description: 'Valuation of equity shares via dividends assumes: (a) dividends are paid annually, (b) the first dividend is paid at the end of Year 1, and (c) sales occur at ex-dividend prices. Models include: Zero-Growth (P0 = D / Ke), Constant Growth/Gordon Model (P0 = D1 / (Ke - g) where g = b * r), and Multi-stage/Variable Growth models where growth rates vary before stabilizing to infinity.',
          exception: 'The constant growth model is strictly invalid if the growth rate (g) is equal to or greater than the required rate of return (Ke), as the formula would yield an undefined or negative share price.',
          example: 'A share of X Ltd. is expected to sell at ₹36 with a dividend of ₹6 after one year. With a required rate of return of 20%, the intrinsic value is: P0 = (6 + 36) / (1 + 0.20) = ₹35.'
        },
        {
          title: 'Three-Stage Dividend Discount Models & H-Model',
          description: 'The Three-Stage DDM models extraordinary growth, transition (linear decline in growth rate), and stable long-run growth. The H-Model simplifies this by assuming that before the extraordinary growth rate (gc) reaches the long-run normal growth rate (gn), it declines linearly over a transition period of 2H years. The price is computed as the sum of normal growth value and the abnormal growth premium: P0 = [D0 * (1 + gn)] / (r - gn) + [D0 * H * (gc - gn)] / (r - gn).',
          exception: 'The H-Model assumes a strict linear decline in the growth rate over the transition period. If the growth rate declines non-linearly, multi-stage discounting must be used instead.',
          example: 'If a company has D0 = ₹2.00, gn = 7%, gc = 12%, required return r = 15%, and transition period of 6 years (2H = 6, H = 3), the share price is: P0 = [2 * (1.07)] / 0.08 + [2 * 3 * (0.12 - 0.07)] / 0.08 = 26.75 + 3.75 = ₹30.50.'
        },
        {
          title: 'Earning-Based Valuation: Gordon & Walter Models',
          description: 'Earning-based models capitalize earnings rather than dividends, appealing to investors willing to forgo current dividends for higher retained earnings and future growth. (1) Gordon’s Earning Model assumes constant return on retained earnings (r) and retention ratio (b): P0 = [EPS1 * (1 - b)] / (Ke - br). (2) Walter’s Approach models price as the capitalized value of dividends plus the capitalized value of retained earnings scaled by the internal investment return: P0 = [D + (r / Ke) * (E - D)] / Ke.',
          exception: 'Walter’s approach implies that if internal rate of return (r) exceeds the cost of equity (Ke), the optimum retention ratio is 100% (growth company), and if r < Ke, the optimum payout ratio is 100% (declining company).',
          example: 'With EPS1 = ₹20.67, retention ratio b = 60%, opportunity cost Ke = 18%, and return on equity r = 15%, Gordon’s value is: P0 = (20.67 * 0.40) / (0.18 - (0.60 * 0.15)) = ₹91.89. Under Walter’s approach, if D = ₹8.27, E = ₹20.67, r = 15%, and Ke = 18%: P0 = [8.27 + (0.15 / 0.18) * (20.67 - 8.27)] / 0.18 = ₹103.35.'
        },
        {
          title: 'Free Cash Flow Models (FCFF & FCFE)',
          description: 'Free Cash Flow represents cash actually available for distribution after all reinvestment needs of capital expenditure (CAPEX) and incremental non-cash working capital (ΔNWC) are met. FCFF is the cash flow available to all capital providers (debt and equity) and is discounted at Ko. FCFE is the cash flow available strictly to equity shareholders (after debt service and net borrowings) and is discounted at Ke.',
          exception: 'Unlike dividends, which are subject to discretionary management decisions, free cash flows reflect the actual economic cash generation of the business, preventing the undervaluation of companies that retain large cash balances.',
          example: 'Net Income is ₹8.923 Crores, CAPEX is ₹47 per share, Depreciation is ₹39 per share, and ΔNWC is ₹3.45 per share with 27% debt ratio. FCFE = 8.923 - [0.73 * (47 - 39) + 0.73 * 3.45] = 8.923 - [5.84 + 2.5185] = 0.5645 per share. With Ke = 8.86% and growth 8%, P0 = [0.5645 * (1 + 0.08)] / (0.0886 - 0.08) = ₹70.89.'
        },
        {
          title: 'Enterprise Value & Valuation of Rights',
          description: 'Enterprise Value (EV) represents the true economic value of a company: EV = Market Capitalization + Net Debt + Minority Interests + Debt-deemed provisions - Non-core assets. Rights issues require calculating the Theoretical Ex-Right Price (TERP): TERP = (n * P0 + S) / (n + n1) where S is the total subscription amount. The value of a right is the difference between the ex-right price and subscription price: R = TERP - Psub.',
          exception: 'Enterprise multiples (e.g. EV/EBITDA) are more reliable than equity multiples (e.g. P/E) for capital-intensive companies because they are unaffected by depreciation policies and capital structure leverage.',
          example: 'A company offers 1 right share for every 2 held (n = 2, n1 = 1), pre-right share price is ₹13, and subscription price is ₹4. TERP = (2 * 13 + 4) / (2 + 1) = ₹10. Value of a right = 10 - 4 = ₹6. Value of right on a per-share basis = (10 - 4) / 2 = ₹3.'
        },
        {
          title: 'Fixed Income Valuation & Bond Theorems',
          description: 'The value of a bond (Vb) is the present value of coupon payments (I) and par/redemption value (F): Vb = I * PVIFA(kd, n) + F * PVIF(kd, n). Core bond theorems dictate: (a) If YTM = coupon rate, bond sells at par; (b) If YTM > coupon rate, bond sells at a discount; (c) If YTM < coupon rate, bond sells at a premium.',
          exception: 'The longer the maturity of a bond, the greater the bond price change with a given change in the required rate of return (YTM).',
          example: 'A 3-year bond with face value ₹100, coupon rate 11%, and YTM 13% is priced as: Vb = 11 * PVIFA(13%, 3) + 100 * PVIF(13%, 3) = 11 * 2.361 + 100 * 0.693 = 25.97 + 69.30 = ₹95.27.'
        },
        {
          title: 'Bond Duration & Modified Duration',
          description: 'Macaulay Duration is the weighted average time required for an investor to recover the bond’s cash flows, where the weights are the present values of cash flows relative to the price. Modified Duration measures interest rate sensitivity/volatility: Modified Duration = Macaulay Duration in years / [1 + (YTM / m)] where m is the compounding frequency per year.',
          exception: 'A zero-coupon bond has no coupon payments, meaning its Macaulay duration is exactly equal to its maturity. For all coupon-bearing bonds, duration is strictly less than time to maturity.',
          example: 'For a 6-year bond with coupon rate 16% and YTM 17%, if Macaulay duration is 4.247 years, the Modified Duration is: Dmod = 4.247 / 1.17 = 3.630 years. If YTM increases by 75 basis points (0.75%), the expected price decrease is: 3.630 * 0.75% = 2.7225%, reducing price from ₹964.24 to approximately ₹938.14.'
        },
        {
          title: 'Bond Immunization & Yield Curve',
          description: 'Immunization is the strategic selection of bonds to offset Price Risk and Reinvestment Risk, which move in opposite directions when interest rates fluctuate. Complete immunization is achieved when the portfolio duration matches the investor’s holding period. The Yield Curve (term structure of interest rates) plots the relationship between spot rates (for zero-coupon bonds) and maturities, which can be upward sloping, downward sloping, flat, or humped.',
          exception: 'Under Term Structure Theories: (a) Expectation Theory assumes long-term rates forecast future short-term rates; (b) Liquidity Preference Theory asserts long-term bonds require a premium to compensate for liquidity sacrifice and interest risk, predicting an upward-sloping curve; (c) Preferred Habitat Theory states rates depend on demand/supply in different maturity segments.',
          example: 'To immunize a ₹1,0,000 liability due in 2 years, an investor splits funds between Bond X (maturity/duration = 1 year, price = ₹972.73) and Bond Y (duration = 3.563 years, price = ₹936.52). Matching portfolio duration: 2 = x1 * 1 + (1 - x1) * 3.563, giving x1 = 0.61. Allocate 61% to Bond X and 39% to Bond Y.'
        },
        {
          title: 'Professional Ethics, Code of Conduct & Valuer Precautions',
          description: 'Under Rule 12(e) of the Companies (Registered Valuers and Valuation) Rules, 2017, valuers must adhere to high standards of Integrity and Fairness, Professional Competence and Due Care, and Independence. Statutory valuations are mandated for mergers/takeovers (Income Tax Act, 1961), slump/asset sales (Insolvency & Bankruptcy Code, 2016), debt conversions (RBI), capital reductions (SEBI), and strategic restructuring.',
          exception: 'A valuer must maintain complete independence and is strictly prohibited from charging success-based fees or disclaiming liability for assumptions unless they are statements of fact provided directly by the company and not generated by the valuer.',
          example: 'A registered valuer must refuse success-fee compensation on a merger assignment to comply with statutory rules of conduct, ensuring the valuation is objective and free from conflict of interest.'
        }
      ],
      visualBreakdown: {
        title: 'Statutory Valuer Conduct & Bond Value Theorems',
        type: 'table',
        headers: ['Area of Focus', 'Statutory / Mathematical Rule', 'Valuation & Conduct Application'],
        rows: [
          ['YTM = Coupon', 'Bond Price = Par Value', 'Bond sells exactly at its nominal face value.'],
          ['YTM > Coupon', 'Bond Price < Par Value', 'Bond sells at a discount; investor required return exceeds coupon yield.'],
          ['YTM < Coupon', 'Bond Price > Par Value', 'Bond sells at a premium; coupon yield exceeds investor required return.'],
          ['Enterprise Value', 'EV = Market Cap + Net Debt + Minority Interests', 'Represents the true economic acquisition price of the entire enterprise.'],
          ['Valuer Integrity', 'Rule 12(e) RV Rules 2017 - Model Code of Conduct', 'Strictly forbids success fees, mandate snatching, and unapproved fees.'],
          ['Working Papers', 'RV Rules 2017 Working Papers preservation', 'Must maintain all working papers and valuation models for a minimum of 3 years.'],
          ['H-Model Price', 'P0 = [D0*(1+gn) + D0*H*(gc-gn)] / (r-gn)', 'Incorporates transition growth decay linearly over a period of 2H years.']
        ]
      }
    },
    {
      chapterName: 'Interest Rate Risk Management',
      keyPrinciples: [
        {
          title: 'Macro-Economic Drivers & Benchmark Interest Rates (Reference Rates)',
          description: 'Interest rates represent the cost of borrowing and compensation for lending risk, inflation, and administrative costs. Macro drivers include: (a) Money demand/supply (growth drives rates up), (b) Inflation expectations, and (c) Government borrowings & RBI Monetary Operations (OMO, CRR, SLR, Bank Rate). Reference/Benchmark rates form the foundational pricing basis for bank loans, floating-rate debentures, and derivatives.',
          exception: 'LIBOR ceased to exist on January 1, 2022, following interbank rate manipulation news in 2012. It was replaced globally by Alternative Reference Rates (ARRs). In India, MIBOR (offered rate for lending) and MIBID (bid rate for borrowing) serve as primary domestic reference benchmarks.',
          example: 'A borrower with floating debt priced at MIBOR + 150 bps pays an effective interest rate of 8.25% p.a. when MIBOR stands at 6.75%.'
        },
        {
          title: 'Global Alternative Reference Rates (ARRs) vs. LIBOR',
          description: 'ARRs differ fundamentally from LIBOR: (1) ARRs are based on actual overnight transaction volumes rather than panel bank quotes/judgments, (2) ARRs represent near risk-free rates with zero term premium. Global ARRs comprise: USA (SOFR - Secured), UK (SONIA - Unsecured), Europe (€STER - Unsecured), Japan (TONAR - Unsecured), and Switzerland (SARON - Secured).',
          exception: 'SOFR and SARON are backed by government repo collaterals (Secured), whereas SONIA, €STER, and TONAR are unsecured overnight interbank benchmarks.',
          example: 'A USD $10M international loan post-2022 uses 6-month SOFR instead of 6-month LIBOR as its benchmark index.'
        },
        {
          title: 'Taxonomy of Interest Rate Risk Exposures',
          description: 'Interest rate risk encompasses price risk (bond value sensitivity) and reinvestment risk (yield on future cash flows). Core risk categories: (1) Gap Exposure (Mismatch in RSA vs RSL), (2) Basis Risk (Differential magnitude changes in asset vs liability benchmarks), (3) Embedded Option Risk (Prepayments, call/put options, premature withdrawals), (4) Yield Curve Risk (Non-parallel shifts across maturities), (5) Price Risk (Inverse relationship between yields and bond prices in trading books), and (6) Reinvestment Risk.',
          exception: 'A Positive Gap (RSA > RSL) expands Net Interest Income (NII) when market interest rates rise. A Negative Gap (RSL > RSA) expands NII when market interest rates fall.',
          example: 'Earnings at Risk (EaR) = Gap Amount * Assumed Interest Rate Shift. For a positive gap of ₹50 Crores and an interest rate increase of 1.50%, EaR = ₹50 Cr * 1.50% = ₹75 Lakhs increase in NII.'
        },
        {
          title: 'Forward Rate Agreements (FRAs) & Settlement Discounting Mechanics',
          description: 'An FRA is an OTC off-balance sheet agreement where parties fix the interest cost on an anticipated future deposit or loan indexed to a benchmark (e.g., SOFR, MIBOR). It involves zero principal transfer (notional principal N). Settlement occurs in cash at contract maturity/settlement date.',
          exception: 'Because FRA cash settlement occurs at the commencement (beginning) of the period rather than at the end, the net interest differential is discounted back using the actual prevailing market reference rate (RR).',
          example: 'In a 1x4 FRA at FR = 5% with N = $1M, if actual 90-day SOFR RR = 6% on settlement date, seller pays buyer: Settlement = [$1M * (0.06 - 0.05) * (90/360)] / [1 + 0.06 * (90/360)] = $2,500 / 1.015 = $2,463.05.'
        },
        {
          title: 'Interest Rate Futures (IRF) & Cheapest to Deliver (CTD) Bond',
          description: 'IRFs are exchange-traded contracts linked to interest-bearing bonds (e.g., NSE GoI 6-yr, 10-yr, 13-yr securities & 91DTB). To hedge rising interest rates, borrowers sell futures today because bond prices drop as interest rates rise. RBI introduced Conversion Factors (CF) to standardize deliverable bonds: Actual Delivery Price = CF * Futures Price.',
          exception: 'The Cheapest to Deliver (CTD) bond minimizes the seller’s loss or maximizes profit when delivering physical bonds: Seller Profit = (Futures Settlement Price * CF) - Quoted Spot Price of Deliverable Bond.',
          example: 'A seller delivers a bond with Spot Price = ₹102, Futures Settlement = ₹98, CF = 1.05. Profit = (98 * 1.05) - 102 = 102.90 - 102.00 = ₹0.90 per bond.'
        },
        {
          title: 'Interest Rate Options: Cap, Floor, and Collar Strategies',
          description: 'Interest Rate Options (IRO / IRG) act as insurance against adverse rate movements: (1) Cap Option (Call on rate): Buyer receives payoff if spot rate r > Cap rate rc: Payoff = N * max(0, r - rc) * (dt/DY). (2) Floor Option (Put on rate): Buyer receives payoff if spot rate r < Floor rate rf: Payoff = N * max(0, rf - r) * (dt/DY). (3) Collar: Buyer purchases a Cap and sells a Floor, locking floating rates into a defined corridor [rf, rc].',
          exception: 'In a Zero-Cost Collar, the premium earned from selling the floor option exactly offsets the premium paid for purchasing the cap option, requiring zero net upfront cash outflow.',
          example: 'A borrower with $1M debt buys a 5% SOFR cap covering 184 days. If reset SOFR = 5.50%, seller pays buyer: $1M * (0.055 - 0.050) * (184/360) = $2,555.56.'
        },
        {
          title: 'Interest Rate Swaps (IRS): Plain Vanilla, Basis, & Asset Swaps',
          description: 'In an IRS, counterparties exchange interest streams based on a notional principal without principal exchange. Types: (a) Plain Vanilla (Coupon) Swap: Exchange fixed rate (AIC) for floating rate (SOFR/MIBOR). Semi-annual Fixed Payment = N * AIC * (180/360); Floating Receipt = N * R * (dt/360). (b) Basis Swap: Exchange two floating rates (e.g. 1M SOFR vs 3M SOFR). (c) Asset Swap: Exchange fixed coupon bond returns for floating rate returns.',
          exception: 'Swaps trade on trade date and settle two business days later (T+2). Quoted fixed rate is the All-In-Cost (AIC) relative to a flat floating index.',
          example: 'For a US $500,000 swap at AIC = 8% fixed vs 6% SOFR floating (181 days): Semi-annual Fixed = $500k * 0.08 * 0.5 = $20,000. Floating = $500k * 0.06 * (181/360) = $15,083. Net Fixed Payer payment = $4,917.'
        },
        {
          title: 'Swaptions: Fixed Rate Payer vs. Fixed Rate Receiver Swaptions',
          description: 'A Swaption is an option granting the holder the right (not obligation) to enter into an Interest Rate Swap at a predetermined fixed rate and tenure at a future date: (1) Payer Swaption (Call Swaption): Right to pay fixed and receive floating (hedges against rising rates). (2) Receiver Swaption (Put Swaption): Right to receive fixed and pay floating (hedges against falling yields). Premiums are quoted in basis points.',
          exception: 'Swaptions can be physically settled (entering forward-start IRS) or cash-settled by marking to market off the prevailing forward swap yield curve at expiry.',
          example: 'A corporate treasurer expecting to issue 5-year debt in 3 months buys a 3-month into 5-year Payer Swaption at 7.50% to cap borrowing costs.'
        }
      ],
      visualBreakdown: {
        title: 'Global ARRs & Interest Rate Derivative Payoff Summary',
        type: 'table',
        headers: ['Instrument / Benchmark', 'Regulator / Formula', 'Core Risk Management Application'],
        rows: [
          ['SOFR (USA)', 'Federal Reserve Bank of NY', 'Secured overnight ARR replacing USD LIBOR.'],
          ['SONIA (UK)', 'Bank of England', 'Unsecured sterling overnight index average.'],
          ['MIBOR / MIBID (India)', 'FIMMDA / NSE', 'Domestic interbank lending (MIBOR) & borrowing (MIBID) benchmarks.'],
          ['FRA Settlement', '[$N(RR - FR)(dtm/DY)] / [1 + RR(dtm/DY)]', 'OTC lock-in for future borrowing/lending; cash settled at period start.'],
          ['IRF Delivery Price', '(Futures Price) * (Conversion Factor)', 'Exchange-traded bond futures; borrowers sell IRF to hedge rate hikes.'],
          ['Cap Option Payoff', 'N * max(0, r - rc) * (dt / DY)', 'Upper bound ceiling on floating borrowing costs.'],
          ['Floor Option Payoff', 'N * max(0, rf - r) * (dt / DY)', 'Lower bound floor protecting lender/investor yield.'],
          ['Collar Corridor', 'Cap Buy (rc) + Floor Sell (rf)', 'Bounded floating rate corridor; zero-cost if premiums offset.'],
          ['Payer Swaption', 'Right to Pay Fixed & Receive Floating', 'Option to lock maximum swap borrowing rate for future debt issuance.']
        ]
      }
    },
    {
      chapterName: 'Securitization',
      keyPrinciples: [
        {
          title: 'Conceptual Foundations & RBI Definition of Securitization',
          description: 'Securitization is the process of pooling and repackaging illiquid financial assets (e.g. residential mortgages, automobile loans, credit card receivables, commercial receivables) into liquid, tradable financial securities (Asset-Backed Securities - ABS, or Mortgage-Backed Securities - MBS). The Reserve Bank of India (RBI) defines securitization as transactions where credit risks in assets are redistributed by repackaging them into tradable securities backed by underlying cash flows.',
          exception: 'Unlike conventional debt financing which alters the company\'s debt-equity ratio and swells the balance sheet, securitization operates as off-balance sheet financing by transferring receivables to a Special Purpose Vehicle (SPV).',
          example: 'A commercial bank holding ₹500 Crores of home loans sells the loan portfolio to an SPV, which issues Pass Through Certificates (PTCs) to institutional investors to immediately recover cash.'
        },
        {
          title: 'Six Core Architectural Features of Securitization',
          description: 'Securitization rests on six core pillars: (1) Creation of Financial Instruments: Generates collateral-backed marketable debt products. (2) Bundling & Unbundling: Combines illiquid receivables into a single master asset pool (bundling) and breaks them into fixed denomination tradable units (unbundling). (3) Risk Management Tool: On a non-recourse basis, transfers credit default risk from originator to investors. (4) Structured Finance: Tailors securities to match specific investor risk-return appetites. (5) Tranching: Segregates asset portfolios into distinct risk/return slices (senior, mezzanine, equity/first-loss tranches). (6) Homogeneity: Ensures securities within a specific tranche carry uniform interest, maturity, and risk profiles suitable for retail/institutional buyers.',
          exception: 'In recourse securitization arrangements, default risk is retained by the originator instead of being transferred to the investor.',
          example: 'An SPV splits a ₹100 Crore mortgage pool into Senior Tranche (80% allocation, AA rated, 8% return) and First-Loss Equity Tranche (20% allocation, Unrated, 14% return).'
        },
        {
          title: 'Dual Perspective Benefits: Originator vs. Investor',
          description: 'Securitization delivers distinct strategic advantages across counterparties: (A) Originator Benefits: (i) Off-Balance Sheet Financing: Unlocks tied-up capital, enhancing liquidity without altering debt-equity ratios or borrowing capacity; (ii) Core Business Specialization: Transfers loan servicing/collections to SPV; (iii) Capital Adequacy Optimization: Improves Capital-to-Risk Weighted Asset Ratio (CRAR/CAR) for banks/FIs; (iv) Reduced Borrowing Cost: Credit enhancements boost paper ratings, allowing lower coupon payouts and earning spread margins. (B) Investor Benefits: (i) Risk Diversification: Multi-asset backing reduces portfolio concentration risk; (ii) Regulatory Compliance: Helps banks fulfill RBI Priority Sector Lending (PSL) requirements (e.g. micro-enterprise exposure); (iii) Default Protection: Over-collateralization, cash reserves, or recourse/insurance safeguards investor principal.',
          exception: 'If an originator securitizes assets with full recourse, off-balance sheet treatment under accounting standards (Ind AS 109) may be denied due to retained substantial risks and rewards.',
          example: 'A NBFC securitizes ₹200 Crores of micro-finance loans to a commercial bank, enabling the bank to instantly satisfy its statutory RBI Priority Sector Lending (PSL) quota.'
        },
        {
          title: 'Primary & Secondary Participants in the Securitization Ecosystem',
          description: 'Securitization involves two operational tiers: (1) Primary Participants: (a) Originator: Initiator/securitizer selling receivables from its books for upfront cash; (b) Special Purpose Vehicle (SPV): Independent legal entity (trust, company, or society) that holds legal title to assets, ring-fences them from originator bankruptcy, and issues ABS/MBS; (c) Investors: Buyers of securitized debt (MFs, PFs, Insurance Cos, Banks). (2) Secondary Participants: (a) Obligors: Original debtors owing principal/interest; (b) Rating Agencies: Assess cash flow strength, credit support, legal framework, and obligor quality; (c) Servicer / Receiving & Paying Agent (RPA): Collects obligor repayments and remits to SPV for a fee; (d) Trustee: Protects investor rights; (e) Credit Enhancer: Provides internal (over-collateralization/cash collateral) or external (Letter of Credit/Surety Bond) credit support; (f) Structurer / Arranger: Investment bankers designing deal architecture to ensure legal, tax, and accounting compliance.',
          exception: 'The SPV must be completely bankruptcy-remote from the originator so that any insolvency of the originator does not affect the cash flows allocated to SPV investors.',
          example: 'In a housing loan securitization, a public sector bank acts as the Originator and Servicer, a SEBI-registered Trust acts as the SPV, and a nationalized bank acts as the Credit Enhancer issuing a Letter of Credit.'
        },
        {
          title: 'Seven-Step Operational Mechanism of Securitization',
          description: 'The securitization lifecycle executes across seven sequential phases: Step 1: Pool Creation: Segregates homogenous loans (by rate, risk, maturity, collateral) into a master asset pool. Step 2: Transfer to SPV: Originator transfers legal & beneficial title to SPV for upfront cash. Step 3: Sale of Securitized Papers: SPV issues PTCs or PTS to investors. Step 4: Asset Administration: Originator/Servicer collects monthly EMIs from obligors and passes them to SPV for a servicing fee. Step 5: Recourse Evaluation: Defaulted receivables are returned to the originator if recourse applies. Step 6: Repayment of Funds: SPV distributes principal and interest to investors. Step 7: Credit Rating: Rating agencies evaluate and assign credit grades to issued tranches.',
          exception: 'In direct pass-through structures, any prepayment by obligors is passed through immediately to investors without SPV reinvestment intervention.',
          example: 'An SPV receives ₹5 Crores in monthly loan repayments from the servicer, deducts a 0.25% servicing fee, and remits the net ₹4.9875 Crores to PTC holders.'
        },
        {
          title: 'Taxonomy of Securitization Instruments: PTC vs. PTS vs. Stripped Securities',
          description: 'Securitized debt is classified into three structural formats: (1) Pass Through Certificates (PTCs): Direct beneficial claim on underlying trust assets. All cash flows (principal + interest) are passed through immediately to investors proportionately. Early prepayments cause cash flow skewness and early simultaneous termination of all certificates. (2) Pay Through Securities (PTS): SPV issues its own debt securities backed by underlying assets, desynchronizing asset cash flows from investor payouts. Enables multi-tranche structures with varying maturities and permits SPV to reinvest early surplus cash at short-term yields. (3) Stripped Securities: Cash flows are unbundled into two specialized instruments: (i) Interest Only (IO) Securities: Holder receives interest only; price rises when market interest rates rise (higher interest on debt), but drops when falling rates trigger loan prepayments; (ii) Principal Only (PO) Securities: Holder receives principal only; price falls when market yields rise (borrowers hold cheap debt), and surges when interest rates drop (borrowers prepay/refinance).',
          exception: 'While PTCs carry a single uniform maturity for all holders, PTS structures feature staggered maturities across different tranches (e.g. Tranche A: 2 yrs, Tranche B: 5 yrs).',
          example: 'When market interest rates drop from 10% to 7%, borrowers prepay home loans rapidly: PO Security prices surge due to accelerated principal recovery, whereas IO Security prices crash.'
        },
        {
          title: 'Pricing Mechanics & Valuation Considerations',
          description: 'Pricing of securitized instruments requires dual-perspective valuation: (1) Originator Angle: Priced at a rate reflecting the originator\'s cash outflow cost, amortized over time by investing securitization proceeds into higher-yielding core business assets. (2) Investor Angle: Security price is determined by discounting expected future cash flows using the Yield to Maturity (YTM) of comparable-risk, similar-average-life marketable securities derived from the yield curve, with adjustments (spread points) for credit enhancement quality and prepayment risks.',
          exception: 'A higher credit enhancement level reduces required yield spread points over benchmark government securities, lowering the yield required by investors and increasing issue price.',
          example: 'A AAA-rated PTC backed by auto loans with a 3-year average life is priced at a spread of 120 bps over 3-year GoI Benchmark yield of 7.10%, yielding a required discount rate of 8.30%.'
        },
        {
          title: 'Risk Taxonomy & Tokenization in Securitization',
          description: 'Securitization involves three core risk categories: (1) Credit / Counterparty Risk: Servicer default or bankruptcy risk. (2) Legal Risk: Absence of explicit judicial precedents or statutory provisions creating ownership disputes over pool cash flows. (3) Market Risk: Comprises (a) Macroeconomic Risk (industry downturns impacting obligors like commercial vehicle operators), (b) Prepayment Risk (falling interest rates cause early retail loan payoffs and reinvestment risk at lower yields), and (c) Interest Rate Risk (mismatch between floating-rate pool inflows and fixed-rate investor payouts, hedged using Interest Rate Swaps). Tokenization & Blockchain: Converts real/financial assets into digital blockchain tokens on Distributed Ledger Technology (DLT). Tokenization mirrors securitization by injecting liquidity into illiquid assets, enabling portfolio diversification, facilitating trading, and generating fee income for institutions.',
          exception: 'Unlike traditional securitization requiring intermediaries (SPV, Trustee, Servicer), blockchain tokenization utilizes smart contracts for automated trade execution and peer-to-peer settlement.',
          example: 'A commercial real estate building worth ₹50 Crores is tokenized into 1,00,000 digital tokens on a public blockchain, allowing fractional ownership and instant 24/7 liquidity.'
        },
        {
          title: 'Indian Market Context, Legal Impediments & SARFAESI Act, 2002',
          description: 'Pioneered in India by Citibank (auto loan securitization), securitization expanded to sales tax deferrals, aircraft receivables, microfinance, and Commercial Mortgage-Backed Securities (CMBS). Key Indian Market Obstacles: (i) High Stamp Duty: Transfer of Property Act 1882 mortgage debt assignment attracted stamp duty up to 12% in several states (mitigated by state concessions & PTC exemptions); (ii) Taxation Ambiguity: Lack of specific Income Tax Act provisions created uncertainty over representative trustee taxation vs investor-level taxation; (iii) Accounting & Foreclosure Bottlenecks: Off-balance sheet derecognition issues and sluggish property foreclosure laws. Statutory Facilitation: The Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest (SARFAESI) Act, 2002 was enacted to empower banks/FIs to enforce security interests and recover NPAs without court intervention. SEBI permits Foreign Portfolio Investors (FPIs) to invest in securitized debt of unlisted companies up to specified limits.',
          exception: 'Under SARFAESI Act 2002, Asset Reconstruction Companies (ARCs) acquire non-performing assets (NPAs) from banks by issuing Security Receipts (SRs) to qualified buyers.',
          example: 'A commercial bank transfers ₹100 Crores of bad corporate debt to an ARC under SARFAESI Act 2002, receiving 15% cash upfront and 85% in Security Receipts (SRs).'
        }
      ],
      visualBreakdown: {
        title: 'Securitization Structural Framework & Instrument Taxonomy',
        type: 'table',
        headers: ['Structural Dimension', 'Statutory / Operational Mechanics', 'Core Financial Impact'],
        rows: [
          ['Pass Through Certificates (PTC)', 'Direct claim on underlying trust assets; all cash flows passed immediately.', 'Uniform maturity; early prepayments cause cash flow skewness & early termination.'],
          ['Pay Through Securities (PTS)', 'SPV issues debt backed by pool; desynchronizes asset receipts & payouts.', 'Multi-tranche structure; permits reinvestment of short-term surplus cash.'],
          ['Interest Only (IO) Strips', 'Holder receives interest component only.', 'Price rises when market interest rates rise; drops on rapid loan prepayments.'],
          ['Principal Only (PO) Strips', 'Holder receives principal component only.', 'Price drops when market rates rise; surges when falling rates trigger prepayments.'],
          ['Special Purpose Vehicle (SPV)', 'Bankruptcy-remote independent trust/company holding legal title.', 'Ring-fences assets from originator balance sheet; enables off-balance sheet status.'],
          ['Credit Enhancement', 'Internal (over-collateralization, cash reserves) or External (LOC, surety).', 'Upgrades credit rating, reduces borrowing cost, and enhances paper marketability.'],
          ['SARFAESI Act, 2002', 'Statutory framework for NPA enforcement without court intervention.', 'Empowers banks/FIs & ARCs to acquire bad loans & issue Security Receipts (SRs).'],
          ['Stamp Duty Obstacle', 'Transfer of Property Act 1882 mortgage transfer duty up to 12%.', 'Exempted/reduced for PTCs in key states to promote secondary debt markets.']
        ]
      }
    }
  ],
  FR: [
    {
      chapterName: 'Applicability of IND AS',
      keyPrinciples: [
        {
          title: 'Roadmap & Statutory Applicability Thresholds',
          description: 'Ind AS implementation follows a phase-wise mandatory roadmap for Companies and NBFCs based on net worth and listing status: Phase I (FY 2016-17): Listed or unlisted companies with net worth ≥ ₹500 Crores; Phase II (FY 2017-18): All listed companies and unlisted companies with net worth ≥ ₹250 Crores; NBFC Roadmap (Phase I FY 2018-19: ≥ ₹500 Cr; Phase II FY 2019-20: Listed or unlisted ≥ ₹250 Cr). Applicable to holding, subsidiary, joint venture, and associate companies of covered entities.',
          exception: 'Banking companies and Insurance companies were deferred from mandatory Ind AS adoption by RBI and IRDAI respectively. Standalone & consolidated financial statements must both be Ind AS compliant once triggered.',
          example: 'If an unlisted company achieves a net worth of ₹260 Crores as on 31st March 2024, Ind AS becomes mandatorily applicable from FY 2024-25 onwards along with its holding and subsidiary companies.'
        },
        {
          title: 'Irreversibility Principle & Voluntary Adoption',
          description: 'Once a company starts applying Ind AS (either voluntarily or mandatorily), it must continue to apply Ind AS for all subsequent financial years, even if its net worth falls below the specified threshold ("Once Ind AS, Always Ind AS"). Companies can adopt Ind AS voluntarily for FY ending 31 March 2016 or later.',
          exception: 'Voluntary adoption once chosen cannot be revoked. An entity cannot revert to Companies (Accounting Standards) Rules.',
          example: 'A company with net worth of ₹300 Crores in FY 2017-18 adopted Ind AS. If its net worth drops to ₹150 Crores in FY 2025-26, it must still prepare financial statements under Ind AS.'
        }
      ],
      visualBreakdown: {
        title: 'Ind AS Applicability Thresholds & Roadmap Summary',
        type: 'table',
        headers: ['Entity Category', 'Net Worth Threshold', 'Mandatory Implementation Date'],
        rows: [
          ['Phase I Corporate', 'Listed / Unlisted Net Worth ≥ ₹500 Cr', '1st April 2016 (FY 2016-17)'],
          ['Phase II Corporate', 'All Listed or Unlisted Net Worth ≥ ₹250 Cr', '1st April 2017 (FY 2017-18)'],
          ['Phase I NBFC', 'Listed / Unlisted Net Worth ≥ ₹500 Cr', '1st April 2018 (FY 2018-19)'],
          ['Phase II NBFC', 'All Listed or Unlisted Net Worth ≥ ₹250 Cr', '1st April 2019 (FY 2019-20)'],
          ['Group Companies', 'Holding, Subsidiary, JV, Associate of above', 'Same date as parent / applicable entity']
        ]
      }
    },
    {
      chapterName: 'Ind AS 16 Property Plant & Equipment',
      keyPrinciples: [
        {
          title: 'Initial Recognition Criteria & Cost Components',
          description: 'An item of PPE is recognized if probable future economic benefits will flow to the entity and cost can be measured reliably. Cost comprises: (a) Purchase price (less trade discounts/rebates, plus import duties/non-refundable taxes), (b) Directly attributable costs to bring asset to location and condition for intended operation, and (c) Initial estimate of dismantling, removing, and site restoration costs (Ind AS 37 provision discounted to present value).',
          exception: 'Administration and general overheads, startup costs, initial operating losses, and relocation costs are strictly excluded from PPE carrying value and expensed immediately.',
          example: 'Machine purchase price ₹10 Lakhs, non-refundable import duty ₹1 Lakh, site preparation ₹50,000, present value of decommissioning liability ₹30,000. Total initial cost = ₹11.80 Lakhs.'
        },
        {
          title: 'Subsequent Measurement: Cost Model vs. Revaluation Model',
          description: 'Entity chooses either Cost Model (Cost - Accumulated Depreciation - Accumulated Impairment) or Revaluation Model (Fair Value at revaluation date - Subsequent Accumulated Depreciation). Revaluations must be applied across the entire class of PPE to avoid selective accounting.',
          exception: 'Revaluation surplus increases OCI and accumulates in Equity under "Revaluation Reserve". If revaluation reduces carrying value, decrease is charged to P&L (unless reversing prior surplus in OCI).',
          example: 'Building carried at ₹50 Lakhs is revalued to ₹65 Lakhs. Revaluation gain of ₹15 Lakhs is credited to Other Comprehensive Income (OCI).'
        },
        {
          title: 'Component Accounting & Depreciation Mechanics',
          description: 'Each part of an item of PPE with a cost that is significant in relation to total item cost must be depreciated separately (Component Accounting). Depreciation method, residual value, and useful life must be reviewed at least at each financial year-end.',
          exception: 'Changes in depreciation method, residual value, or useful life are accounting estimate changes under Ind AS 8, applied prospectively.',
          example: 'An aircraft costing ₹100 Crores has an engine component costing ₹30 Crores (useful life 10 years) and body frame costing ₹70 Crores (useful life 20 years). Engine and body must be depreciated separately.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 40 Investment Property',
      keyPrinciples: [
        {
          title: 'Definition & Scope of Investment Property',
          description: 'Property (land or building or part of building) held by owner or lessee as right-of-use asset to earn rentals or for capital appreciation or both, rather than for use in production/supply of goods or administrative purposes or sale in ordinary course.',
          exception: 'Owner-occupied property is accounted under Ind AS 16. Property held for sale in ordinary course of business (e.g. real estate developer inventory) is accounted under Ind AS 2.',
          example: 'Land held for long-term capital appreciation where future use is currently undetermined is classified as Investment Property.'
        },
        {
          title: 'Measurement Model & Fair Value Disclosure Mandate',
          description: 'Ind AS 40 permits ONLY the Cost Model for measurement after initial recognition (Cost less Accumulated Depreciation and Impairment). However, entities MUST disclose the Fair Value of investment property in the notes to financial statements.',
          exception: 'Unlike IFRS (IAS 40) which allows a Fair Value accounting option, Ind AS 40 strictly mandates the Cost Model on balance sheet face.',
          example: 'Investment building purchased for ₹5 Crores with Fair Value ₹8 Crores. Balance sheet carries building at ₹5 Crores less depreciation, with ₹8 Crores disclosed in disclosures.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 38 Intangible Assets',
      keyPrinciples: [
        {
          title: 'Identifiability & Research vs. Development Phase',
          description: 'An intangible asset is an identifiable non-monetary asset without physical substance. Identifiable if separable or arising from contractual/legal rights. Internal generation rules: Research Phase expenditure is strictly expensed to P&L. Development Phase expenditure is capitalized ONLY IF all 6 PIRATE criteria are met (Probable future benefits, Intention to complete, Resources available, Ability to use/sell, Technical feasibility, Expenditure reliably measurable).',
          exception: 'Internally generated brands, mastheads, publishing titles, customer lists, and goodwill cannot be recognized as intangible assets.',
          example: 'Software project spends ₹20 Lakhs on research (expensed) and ₹50 Lakhs on development after technical feasibility is proven (capitalized as Intangible Asset).'
        },
        {
          title: 'Useful Life & Amortization Mechanics',
          description: 'Intangible assets with finite useful lives are amortized over estimated useful life. Intangible assets with indefinite useful lives are NOT amortized, but tested for impairment annually under Ind AS 36.',
          exception: 'Indefinite useful life does not mean infinite; it means no foreseeable limit to the period over which asset is expected to generate net cash inflows.',
          example: 'A broadcasting license granted for 10 years renewable at nominal cost with proven history of renewal is treated as having an indefinite useful life and tested for impairment annually.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 36 Impairment of Assets',
      keyPrinciples: [
        {
          title: 'Recoverable Amount & Impairment Loss Calculation',
          description: 'An asset is impaired when carrying amount exceeds Recoverable Amount. Recoverable Amount = Higher of Fair Value Less Costs of Disposal (FVLCD) and Value in Use (VIU - present value of estimated future cash flows). Impairment Loss = Carrying Amount - Recoverable Amount, recognized immediately in P&L.',
          exception: 'If asset was previously revalued under Ind AS 16, impairment loss is treated as revaluation decrease in OCI up to revaluation surplus amount.',
          example: 'Asset carrying amount ₹120 Lakhs. FVLCD = ₹95 Lakhs, VIU = ₹105 Lakhs. Recoverable amount = ₹105 Lakhs. Impairment loss = ₹15 Lakhs recognized in P&L.'
        },
        {
          title: 'Cash Generating Units (CGUs) & Goodwill Allocation',
          description: 'If individual asset does not generate independent cash inflows, impairment testing is done for Cash Generating Unit (CGU). Impairment loss for CGU is allocated: First to reduce carrying amount of Goodwill allocated to CGU, then to other assets pro-rata based on carrying amounts.',
          exception: 'Carrying amount of an individual asset shall not be reduced below the highest of its FVLCD, VIU, and zero. Reversal of impairment loss is allowed for assets, but strictly prohibited for Goodwill.',
          example: 'CGU with Goodwill ₹10 Lakhs and Plant ₹40 Lakhs suffers CGU impairment loss of ₹15 Lakhs. Goodwill reduced by ₹10 Lakhs to Nil; Plant reduced by remaining ₹5 Lakhs to ₹35 Lakhs.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 105 Non Current Assets Held For Sale',
      keyPrinciples: [
        {
          title: 'Core Objective & Scope',
          description: 'Ind AS 105 sets out the accounting for assets held for sale and the presentation/disclosure of discontinued operations. Key rule: Non-current assets (or disposal groups) classified as held for sale are measured at the lower of carrying amount and fair value less costs to sell, and depreciation/amortization on such assets strictly ceases immediately. Discontinued operations are shown as a single post-tax amount on the face of the Statement of Profit and Loss.',
          exception: 'Measurement provisions of Ind AS 105 do NOT apply to: Deferred tax assets (Ind AS 12), Employee benefit assets (Ind AS 19), Financial assets (Ind AS 109), Biological assets at FVLCTS (Ind AS 41), Contractual rights under Insurance Contracts (Ind AS 117/104). These scoped-out assets are remeasured under their respective standard FIRST before assessing the disposal group as a whole.',
          example: 'An entity classifies a manufacturing line as held for sale. Carrying value is ₹100 Lakhs; Fair Value Less Costs to Sell is ₹85 Lakhs. Write-down of ₹15 Lakhs is charged to P&L as impairment, and depreciation of ₹10 Lakhs p.a. stops from classification date.'
        },
        {
          title: 'Classification Gate 1: Available for Immediate Sale (Test A)',
          description: 'The asset (or disposal group) must be available for immediate sale in its present condition subject only to terms that are usual and customary for sales of such assets. It must not be vital to ongoing operations, nor undergoing mid-refurbishment/renovation for value addition prior to sale. Vacating a property for a buyer is acceptable; vacating to move to a replacement property fails the immediate sale test.',
          exception: 'Usual and customary terms (e.g., standard 30-60 day conveyancing or customary regulatory clearance period) do not prevent immediate sale classification.',
          example: 'Company A decides to sell its corporate head office after constructing a new HQ. The old office cannot be classified as held for sale until operations are transferred and the building is vacated for the buyer.'
        },
        {
          title: 'Classification Gate 2: Sale "Highly Probable" (Test B - 5 Mandatory Conditions)',
          description: 'All 5 conditions must hold concurrently:\n1. Management Commitment: Management at appropriate level is committed to a plan to sell.\n2. Active Buyer Search: An active programme to locate a buyer and complete the plan has been initiated.\n3. Active Marketing: The asset is actively marketed for sale at a price that is reasonable in relation to its current fair value.\n4. 1-Year Completion: The sale is expected to qualify for recognition as a completed sale within 1 year from classification date.\n5. Unlikely to Change: Actions required to complete the plan indicate that significant changes or plan withdrawal are unlikely.',
          exception: '1-Year Rule Exception: Extension beyond 1 year is allowed IF delay is caused by events/circumstances beyond the entity\'s control AND the entity remains demonstrably committed to the plan (e.g., regulatory approval pending, buyer-mandated environmental remediation, or price cuts in response to unexpected market fall).',
          example: 'A plant is listed at ₹500 Cr when market FV is ₹300 Cr. Active marketing condition fails because listing price is unreasonable relative to FV.'
        },
        {
          title: 'Key Concepts: Disposal Group vs Component of Entity',
          description: '• Disposal Group: A group of assets to be disposed of together as a group in a single transaction, along with directly associated liabilities transferred in that transaction. Includes goodwill if the group is a CGU or part of a CGU.\n• Component of an Entity: Operations and cash flows that can be clearly distinguished, operationally and for financial reporting purposes (e.g., a CGU or group of CGUs).\n• Discontinued Operation: A component of an entity that either has been disposed of or is classified as held for sale AND represents: (a) a separate major line of business or geographical area, (b) part of a single coordinated plan to dispose of a separate major line/geo area, or (c) a subsidiary acquired exclusively with a view to resale.',
          exception: 'Selling 1 branch out of 200 retail outlets is a disposal group, but NOT a discontinued operation unless it constitutes a separate major line of business or geographic region.',
          example: 'A bank sells its entire credit card operations segment in South Asia. This represents a separate major line of business in a geographic area, qualifying as a Discontinued Operation.'
        },
        {
          title: 'Measurement & Impairment Allocation Sequence',
          description: 'Step-by-step measurement sequence:\n1. Remeasurement Immediately Prior: Remeasure carrying value of each asset under its governing Ind AS (Ind AS 16, Ind AS 38, Ind AS 2, Ind AS 109, etc.).\n2. Lower of Carrying Value & FVLCTS: Measure the classified asset or disposal group at Lower of Carrying Value and Fair Value Less Costs to Sell.\n3. Stop Depreciation: Depreciation/Amortization strictly ceases immediately upon classification.\n4. Impairment Allocation Order in Disposal Group: (a) First, write off Goodwill allocated to the group; (b) Then allocate balance impairment loss pro-rata to other in-scope non-current assets based on carrying values.\n5. Subsequent Reversal of Impairment: Reversals allowed up to cumulative impairment loss previously recognized under Ind AS 105 and Ind AS 36. Goodwill impairment reversal is strictly prohibited.',
          exception: 'Inventory, Financial Assets (Ind AS 109), and Deferred Tax Assets (Ind AS 12) inside a disposal group are excluded from receiving pro-rata impairment allocation under Ind AS 105.',
          example: 'Disposal group carrying value: Goodwill ₹20 Cr, PPE ₹80 Cr, Inventory ₹30 Cr (Total ₹130 Cr). FVLCTS = ₹90 Cr. Total impairment = ₹40 Cr. Allocated: Goodwill ₹20 Cr written off to Nil; PPE reduced by ₹20 Cr to ₹60 Cr; Inventory remains untouched under Ind AS 105.'
        },
        {
          title: 'Common Traps & Non-Held-For-Sale Scenarios',
          description: '• Trap 1 - Abandonment ≠ Held for Sale: Assets/operations to be abandoned or closed (not sold) are NEVER classified as held for sale because carrying value is recovered through continuing use, not sale. However, if abandonment meets discontinued ops definition, disclose as discontinued ops on closure.\n• Trap 2 - Temporarily Idle ≠ Abandoned: A plant idled due to low demand but maintained for future restart is neither abandoned nor held for sale — continue depreciating normally.\n• Trap 3 - One Outlet ≠ Discontinued Operation: Selling 1 outlet out of 200 is a disposal group, not a discontinued operation (does not meet major line/area criteria).\n• Trap 4 - Winding Down ≠ Discontinued Yet: While existing contracts are being completed (even if no new orders taken), the operation is in use — becomes discontinued only when last contract completes.',
          exception: 'If an entity reverses its plan to sell, reclassify the asset/group out of held for sale. Measure at lower of: (a) carrying value before classification adjusted for depreciation that would have been recognized, and (b) recoverable amount at decision date.',
          example: 'Entity decides to abandon a factory line in 6 months. Factory line continues to be depreciated over 6 months; cannot be written down to FVLCTS under Ind AS 105 upon decision date.'
        },
        {
          title: 'Discontinued Operations: Presentation & Disclosures',
          description: '• Statement of Profit & Loss: Show a single line item on the face of P&L comprising post-tax profit/loss of discontinued operations PLUS post-tax gain/loss on remeasurement or disposal.\n• Detailed Breakdown: Disclose breakdown of revenue, expenses, pre-tax profit, and tax expense in notes or separate P&L section.\n• Balance Sheet: Assets held for sale and liabilities directly associated must be presented separately on face of Balance Sheet under Current Assets & Current Liabilities. Do NOT offset assets and liabilities.\n• Comparative Re-presentation: Prior period P&L statements are re-presented to show discontinued operations separately for all comparative periods. Balance Sheet prior periods are NOT re-presented.',
          exception: 'If an entity reverses a plan to sell a discontinued operation, comparative P&L for ALL periods presented must be reclassified/restated back into continuing operations.',
          example: 'FY 2025-26 P&L displays Discontinued Ops single line item ₹45 Lakhs. Comparative FY 2024-25 P&L column is re-presented to move that segment\'s results from continuing ops into discontinued ops.'
        },
        {
          title: 'High-Yield Differences: Ind AS 105 vs AS 24',
          description: '• Core Concept: Ind AS 105 covers both Discontinued Operations AND Held-for-Sale Assets. AS 24 covers only Discontinuing Operations (no held-for-sale asset concept).\n• Timeframe: Ind AS 105 requires sale within 1 year; AS 24 has no explicit 1-year time limit.\n• Abandonment: Ind AS 105 explicitly excludes abandoned assets from held-for-sale classification; AS 24 treats abandonment as a discontinuing operation.\n• Measurement Basis: Ind AS 105 measures at lower of carrying value and FVLCTS with mandatory depreciation freeze; AS 24 falls back on AS 10 (PPE) / AS 28 (Impairment) with no automatic depreciation freeze.\n• Reversal Guidance: Ind AS 105 provides detailed remeasurement guidance for changes to a plan of sale; AS 24 does not provide specific change-of-plan guidance.',
          exception: 'Under AS 24, initial disclosure event is triggered by binding sale agreement OR board approval + public announcement, whichever is earlier.',
          example: 'Under AS 24, a decision to discontinue via abandonment triggers discontinuing operation disclosure at announcement; under Ind AS 105, held-for-sale is not triggered until actual closure occurs.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 23 Borrowing Costs',
      keyPrinciples: [
        {
          title: 'Qualifying Asset & Capitalization Rules',
          description: 'Borrowing costs directly attributable to acquisition, construction, or production of a Qualifying Asset (asset taking substantial period of time to get ready for intended use or sale) are capitalized as part of asset cost. Specific Borrowing: Actual borrowing costs incurred less investment income on temporary investment of borrowings. General Borrowing: Weighted average capitalization rate applied to expenditure on asset.',
          exception: 'Capitalization commences when expenditure is incurred, borrowing costs are incurred, and activities to prepare asset are in progress. Capitalization suspends during extended periods of active development interruption, and ceases when substantially all activities are complete.',
          example: 'Loan of ₹10 Crores at 10% p.a. taken for building construction. Interest earned on idle funds for 3 months = ₹15 Lakhs. Capitalized borrowing cost = ₹1 Crore - ₹15 Lakhs = ₹85 Lakhs.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 2 Inventories',
      keyPrinciples: [
        {
          title: 'Valuation & Net Realizable Value (NRV)',
          description: 'Inventories measured at Lower of Cost and Net Realizable Value (NRV). NRV = Estimated selling price in ordinary course of business less estimated costs of completion and estimated costs necessary to make sale. Cost formulas permitted: FIFO or Weighted Average Cost.',
          exception: 'Materials and supplies held for use in production are not written down below cost if finished products in which they will be incorporated are expected to be sold at or above cost.',
          example: 'Finished goods cost ₹500, estimated selling price ₹480, selling expense ₹20. NRV = ₹460. Inventory written down from ₹500 to ₹460.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 41 Agriculture',
      keyPrinciples: [
        {
          title: 'Biological Assets & Bearer Plants',
          description: 'Biological assets (living animals or plants) measured on initial recognition and at each reporting date at Fair Value Less Costs to Sell (FVLCTS). Gain/loss recognized in P&L. Agricultural produce harvested from biological assets measured at FVLCTS at point of harvest.',
          exception: 'Bearer Plants (e.g. tea bushes, rubber trees used solely to grow produce over multiple periods) are excluded from Ind AS 41 and accounted as PPE under Ind AS 16 at cost/revaluation.',
          example: 'Dairy cattle herd fair value ₹50 Lakhs, estimated selling costs ₹2 Lakhs. Biological asset carrying value = ₹48 Lakhs. Changes in FVLCTS reported in P&L.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 20 Accounting for Govt Grants',
      keyPrinciples: [
        {
          title: 'Recognition & Presentation Methods',
          description: 'Recognized only when reasonable assurance exists that entity will comply with conditions and grant will be received. Capital Grants (related to assets) presented either: (a) Deferred Income recognized in P&L over useful life of asset, or (b) Deducted from carrying amount of asset. Revenue Grants recognized in P&L over periods necessary to match them with related costs.',
          exception: 'Non-monetary grants (e.g. land at concessional rate) accounted at fair value or nominal amount.',
          example: 'Government grants ₹20 Lakhs for plant costing ₹1 Crore (useful life 5 yrs). Under deferred income: Plant carried at ₹1 Crore, ₹4 Lakhs grant recognized in P&L annually.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 113 Fair Value Measurement',
      keyPrinciples: [
        {
          title: 'Exit Price & Fair Value Hierarchy',
          description: 'Fair value is the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at measurement date (Exit Price in principal or most advantageous market). Fair Value Hierarchy: Level 1: Quoted prices in active markets for identical assets/liabilities; Level 2: Directly/indirectly observable market inputs other than Level 1; Level 3: Unobservable inputs based on best available entity information.',
          exception: 'Highest and Best Use (HBU) concept applies to non-financial assets (e.g. land), evaluating physical possibility, legal permissibility, and financial feasibility.',
          example: 'Equity share traded on NSE is measured using Level 1 quoted market price. Custom unlisted OTC derivative is valued using Level 3 discounted cash flow model.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 102 Share Based Payment',
      keyPrinciples: [
        {
          title: 'Classification & Vesting Conditions',
          description: 'SBT transactions categorized into: (1) Equity-Settled: Measured at Grant Date Fair Value of equity instruments granted, recognized over vesting period as expense with credit to Equity Reserve (no re-measurement for equity market changes). (2) Cash-Settled (SARs): Measured at Fair Value at each reporting date until settlement, expense recognized with credit to Liability. Vesting conditions divided into Service vs Performance (Market vs Non-Market) conditions.',
          exception: 'Market performance conditions (e.g. target share price) are reflected in grant date fair value estimation; non-market conditions (e.g. profit target) affect expected number of options that vest.',
          example: '1,000 ESOPs granted at Fair Value ₹50 each with 3-year service condition. Total expense = ₹50,000 recognized at ₹16,667 per year in P&L with credit to Share Options Outstanding Account.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 116 Leases',
      keyPrinciples: [
        {
          title: 'Lessee Single Accounting Model & ROU Asset',
          description: 'Lessees recognize a Right-of-Use (ROU) Asset and Lease Liability at lease commencement. Initial Lease Liability = Present value of lease payments discounted at incremental borrowing rate or implicit rate. Initial ROU Asset = Initial Lease Liability + Initial direct costs + Restoration provision - Lease incentives received. Subsequent accounting: ROU asset depreciated over lease term; Lease liability amortized with interest expense in P&L.',
          exception: 'Optional recognition exemptions: Short-term leases (<= 12 months) and Leases of low-value assets (e.g. laptops, office furniture) can be expensed linearly in P&L.',
          example: '10-year office lease with annual rent ₹10 Lakhs. PV of payments at 8% discount rate = ₹67.10 Lakhs. ROU Asset recognized at ₹67.10 Lakhs, depreciated at ₹6.71 Lakhs/year; Lease liability incurs 8% interest.'
        },
        {
          title: 'Lessor Accounting: Finance vs. Operating Lease',
          description: 'Lessors classify leases as either Finance Lease (transfers substantially all risks and rewards incidental to ownership) or Operating Lease. Finance Lease: Derecognize underlying asset and recognize Net Investment in Lease. Operating Lease: Retain underlying asset on balance sheet and recognize rental income on straight-line basis.',
          exception: 'Manufacturer or dealer lessors recognize selling profit/loss at lease commencement date under finance leases equal to fair value of asset less cost.',
          example: 'Lessor transfers equipment under 5-year lease covering 95% of asset life. Classified as Finance Lease; Net Investment in Lease recognized on balance sheet.'
        }
      ]
    },
    {
      chapterName: 'IND AS 37 Provisions, Contingent',
      keyPrinciples: [
        {
          title: 'Provision Tri-Criteria & Contingent Liability',
          description: 'A Provision is recognized when: (1) Present obligation exists as a result of past event, (2) Probable outflow of resources embodying economic benefits (>50% likelihood), and (3) Reliable estimate can be made. If outflow is not probable or estimate unreliable, disclosed as Contingent Liability (unless outflow is remote). Contingent Asset disclosed when inflow is probable; recognized as Asset when inflow is virtually certain.',
          exception: 'Onerous Contracts (unavoidable costs of fulfilling contract exceed expected economic benefits) require immediate provision equal to lower of cost of fulfilling and penalty for non-performance.',
          example: 'Company faces pending legal lawsuit with 70% probability of ₹50 Lakh payout. Provision of ₹50 Lakhs recognized in financial statements.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 108 Operating Segments',
      keyPrinciples: [
        {
          title: 'CODM Approach & 10% / 75% Reportable Rules',
          description: 'Operating segment identified based on internal management reporting reviewed by Chief Operating Decision Maker (CODM). Quantitative thresholds for separate reporting: Segment meets ANY of 10% criteria (Reported Revenue ≥ 10% total internal+external revenue, OR Segment Profit/Loss ≥ 10% of greater of combined profit/loss, OR Segment Assets ≥ 10% total assets).',
          exception: '75% Aggregate External Revenue Rule: If total external revenue reported by operating segments constitutes < 75% of total entity external revenue, additional operating segments must be identified until 75% target is met.',
          example: 'Company has 5 segments. Segments A, B, C individually contribute 15%, 20%, 45% of total revenue. Segments A, B, C are reportable segments under 10% threshold.'
        }
      ]
    },
    {
      chapterName: 'Analysis of FS',
      keyPrinciples: [
        {
          title: 'Financial Analysis Framework & Ratios',
          description: 'Comprehensive analysis of financial health using Ind AS ratios: Liquidity (Current, Quick), Profitability (ROCE, ROE, GP/NP margins), Solvency (Debt-Equity, Interest Coverage), Turnover (Inventory, Debtors), and Market Valuation (P/E, Price-to-Book). Schedule III Division II balance sheet presentation disclosures and non-GAAP performance metrics reconciliation.',
          exception: 'Ratios must account for Ind AS adjustments such as ROU assets in lease capital, ECL allowances in receivables, and fair value adjustments in investments.',
          example: 'Ind AS 116 capitalization of leases increases EBITDA and Debt-Equity ratio while lowering asset turnover.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 19 Employee Benefits',
      keyPrinciples: [
        {
          title: 'Defined Benefit Plans & Actuarial Gains/Losses OCI Treatment',
          description: 'Defined Benefit Plans (e.g. Gratuity, Pension) require actuarial valuation using Projected Unit Credit Method. Components of Defined Benefit Cost: (1) Service Cost (Current & Past service cost) -> P&L, (2) Net Interest on Net Defined Benefit Liability/Asset -> P&L, (3) Remeasurements (Actuarial gains/losses & return on plan assets excluding interest) -> OCI (Other Comprehensive Income).',
          exception: 'Remeasurements recognized in OCI are credited/debited directly to Retained Earnings and are NEVER recycled/reclassified to P&L in subsequent periods.',
          example: 'Actuarial valuation reveals ₹5 Lakhs actuarial loss due to discount rate reduction. Loss recognized in OCI, reducing Equity Reserve without hitting P&L.'
        }
      ]
    },
    {
      chapterName: 'Financial Instruments',
      keyPrinciples: [
        {
          title: 'Classification & Measurement under Ind AS 109',
          description: 'Financial Assets classified into 3 categories based on Business Model Test and SPPI Test (Solely Payments of Principal & Interest): (1) Amortized Cost: Held to collect contractual cash flows fulfilling SPPI. (2) FVTOCI: Held to collect cash flows AND sell, fulfilling SPPI (recycling to P&L for debt, non-recycling for designated equity). (3) FVTPL: Default category or designated fair value (derivative assets, equity investments). Financial Liabilities classified at Amortized Cost or FVTPL.',
          exception: 'Expected Credit Loss (ECL) Model: Forward-looking impairment model for financial assets at amortized cost/FVTOCI: Stage 1 (12-month ECL), Stage 2 & 3 (Lifetime ECL on significant credit risk increase).',
          example: 'Investment in corporate bonds held for maturity yielding principal and fixed interest measured at Amortized Cost using Effective Interest Rate (EIR) method.'
        },
        {
          title: 'Ind AS 32 Presentation: Financial Liability vs. Equity',
          description: 'Substance over form dictates presentation. A financial instrument is a Financial Liability if entity has a contractual obligation to deliver cash or another financial asset. Equity Instrument if no contractual obligation exists and settled in fixed number of own equity instruments (Fixed-for-Fixed rule). Compound Financial Instruments (e.g. Convertible Debentures) split into liability component (PV of contractual cash flows) and equity component (residual balance).',
          exception: 'Mandatory redeemable preference shares are presented as Financial Liabilities, and preference dividends paid are reported as Interest Expense in P&L.',
          example: '₹100 Lakhs 8% Convertible Bonds issued. PV of interest and principal at market interest rate for plain debt = ₹85 Lakhs (Liability). Remaining ₹15 Lakhs = Equity Component.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 33 Earnings Per Share',
      keyPrinciples: [
        {
          title: 'Basic EPS & Diluted EPS Mechanics',
          description: 'Basic EPS = Net Profit or Loss attributable to Equity Shareholders / Weighted Average Number of Equity Shares outstanding during period. Diluted EPS adjusts net profit and share count for potential dilutive equity shares (convertible bonds, options, convertible preference shares). Treasury Stock Method used for share options.',
          exception: 'Anti-dilutive options (potential shares that increase EPS or reduce loss per share) are strictly excluded from Diluted EPS calculations.',
          example: 'Net Profit ₹100 Lakhs, Weighted shares 10 Lakhs. Basic EPS = ₹10. Options outstanding for 2 Lakh shares at exercise price below market value add 0.5 Lakh net dilutive shares, giving Diluted EPS = ₹100L / 10.5L = ₹9.52.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 34 Interim Financial Reporting',
      keyPrinciples: [
        {
          title: 'Discrete vs. Integral View & Measurement Policies',
          description: 'Ind AS 34 mandates the Discrete View: Each interim period is treated as a distinct reporting period. Accounting policies in interim reports must match annual financial statements. Revenue received seasonally, cyclically, or occasionally is NOT anticipated or deferred; recognized when it occurs.',
          exception: 'Income tax expense for interim period is calculated using the estimated Weighted Average Annual Effective Tax Rate applied to interim pre-tax earnings.',
          example: 'Company earns 80% of annual revenue in Q3 due to festive season. Revenue recognized entirely in Q3 without spreading across Q1-Q4.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 1 Presentation of FS',
      keyPrinciples: [
        {
          title: 'Complete Set of Financial Statements & Core Rules',
          description: 'Complete set under Ind AS: Balance Sheet, Statement of Profit and Loss (including OCI), Statement of Changes in Equity (SOCIE), Statement of Cash Flows, and Notes. Key principles: Going concern, Accrual basis, Materiality and aggregation, No offsetting (unless required/permitted by Ind AS), Current vs Non-Current classification rules (12-month or operating cycle rule).',
          exception: 'Refinancing of debt after reporting date does not change classification as current liability as on reporting date unless enforceable agreement existed before reporting date.',
          example: 'Long-term loan maturing in 8 months classified as Current Liability on balance sheet face.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 10 Events After the Reporting',
      keyPrinciples: [
        {
          title: 'Adjusting vs. Non-Adjusting Events',
          description: 'Adjusting Events: Provide evidence of conditions that existed at the reporting date -> Financial statements MUST be adjusted (e.g. customer bankruptcy confirming year-end bad debt, court settlement confirming year-end obligation). Non-Adjusting Events: Conditions arising after reporting date -> No adjustment to financial statements, but material items disclosed in notes (e.g. fire destroying warehouse in April).',
          exception: 'Dividends declared after reporting date are strictly Non-Adjusting Events; recognized as liability only in period when approved by shareholders.',
          example: 'Court delivers judgment on 15 April 2025 requiring company to pay ₹20 Lakhs for breach of contract occurring in December 2024. Treated as Adjusting Event for FY 2024-25.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 8 Acc Policies Errors',
      keyPrinciples: [
        {
          title: 'Accounting Policy Changes vs. Estimate Changes',
          description: 'Changes in Accounting Policies: Applied Retrospective Application (restating comparative periods as if new policy had always applied). Changes in Accounting Estimates (e.g. useful life, provision estimates): Applied Prospective Application (in current and future periods). Prior Period Errors: Corrected by Retrospective Restatement in first set of financial statements issued after discovery.',
          exception: 'If retrospective application of policy change is impracticable, entity applies new policy from earliest date practicable.',
          example: 'Changing inventory formula from Weighted Average to FIFO is a policy change applied retrospectively. Revising machine useful life from 10 to 8 years is an estimate change applied prospectively.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 7 Statement of Cash Flows',
      keyPrinciples: [
        {
          title: 'Operating, Investing & Financing Cash Flow Presentation',
          description: 'Cash flows classified into: Operating Activities (main revenue-producing activities, presented via Direct or Indirect method), Investing Activities (acquisition/disposal of long-term assets and investments), Financing Activities (changes in size/composition of equity and borrowings). Cash and Cash Equivalents include short-term highly liquid investments readily convertible to known cash amounts (<3 months maturity).',
          exception: 'Interest paid and received and dividends paid and received can be classified as operating, investing, or financing provided consistency is maintained across periods.',
          example: 'For a commercial manufacturing company: Dividends paid = Financing Cash Outflow; Dividends received = Investing Cash Inflow; Interest paid = Operating or Financing Cash Outflow.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 12 Income Taxes',
      keyPrinciples: [
        {
          title: 'Balance Sheet Approach: DTA & DTL Determination',
          description: 'Deferred tax is calculated on Temporary Differences between Carrying Amount of asset/liability on Balance Sheet and its Tax Base (Balance Sheet liability approach). Taxable Temporary Difference -> Deferred Tax Liability (DTL). Deductible Temporary Difference -> Deferred Tax Asset (DTA). Measured using tax rates enacted or substantively enacted at reporting date.',
          exception: 'DTA recognized ONLY to the extent it is probable that future taxable profits will be available against which deductible temporary difference can be utilized.',
          example: 'Machine carrying amount = ₹100 Lakhs, Tax WDV = ₹70 Lakhs. Taxable temporary difference = ₹30 Lakhs. At 30% tax rate, DTL of ₹9 Lakhs recognized.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 103 Business Combination',
      keyPrinciples: [
        {
          title: 'Acquisition Method & Goodwill / Gain on Bargain Purchase',
          description: 'Business combinations accounted using Acquisition Method: Step 1: Identify acquirer; Step 2: Determine acquisition date; Step 3: Recognize & measure identifiable net assets acquired at Fair Value; Step 4: Measure Goodwill or Gain on Bargain Purchase. Goodwill = Consideration Transferred + NCI Amount + Previous Equity Interest Fair Value - Fair Value of Identifiable Net Assets Acquired.',
          exception: 'Non-Controlling Interest (NCI) measured at either: (a) Fair Value (Full Goodwill method), or (b) NCI\'s proportionate share of identifiable net assets (Partial Goodwill method). Gain on Bargain Purchase (Negative Goodwill) recognized in OCI and accumulated in Capital Reserve.',
          example: 'Acquirer pays ₹800 Crores for 80% stake. Fair Value of Net Assets acquired = ₹900 Crores. Under proportionate NCI (20% * 900 = ₹180 Crores), Goodwill = 800 + 180 - 900 = ₹80 Crores.'
        }
      ]
    },
    {
      chapterName: 'Consolidation',
      keyPrinciples: [
        {
          title: 'Ind AS 110 Control Model & Elimination Entries',
          description: 'Parent consolidates subsidiary when it controls the entity. Control elements: (1) Power over investee, (2) Exposure/rights to variable returns, and (3) Ability to use power to affect returns. Consolidation mechanics: Combine like items of assets, liabilities, income, expenses; eliminate carrying amount of parent\'s investment and parent\'s portion of equity; eliminate intra-group balances, transactions, and unrealized profits.',
          exception: 'Investment Entities (e.g. venture capital funds meeting specific criteria) are exempt from consolidating subsidiaries; measure investments at FVTPL under Ind AS 109.',
          example: 'Parent sells inventory to subsidiary at cost ₹40 Lakhs plus ₹10 Lakhs profit. Inventory remains unsold at year-end. In consolidation, inventory reduced by ₹10 Lakhs unrealized profit.'
        }
      ]
    },
    {
      chapterName: 'JV & Associates',
      keyPrinciples: [
        {
          title: 'Equity Method (Ind AS 28) & Joint Arrangements (Ind AS 111)',
          description: 'Associates (Significant Influence, 20%-50% voting power) and Joint Ventures (joint control with rights to net assets) accounted using Equity Method u/s Ind AS 28: Investment initially recognized at cost, subsequently adjusted for post-acquisition share of investee profit/loss (recognized in P&L) and OCI. Joint Operations (rights to assets & obligations for liabilities) accounted by recognizing operator\'s share of assets, liabilities, revenues, expenses.',
          exception: 'Discontinue equity accounting when carrying amount of investment reaches zero unless investor has legal/constructive obligations to make payments on behalf of associate.',
          example: 'Parent holds 30% associate. Associate earns ₹100 Lakhs net profit. Parent increases investment carrying value by ₹30 Lakhs with credit to P&L.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 24 Related Party Disclosures',
      keyPrinciples: [
        {
          title: 'Related Party Relationships & Disclosure Mandate',
          description: 'Requires disclosure of related party relationships, transactions, and outstanding balances. Related parties include: Holding, subsidiaries, associates, JVs, Key Management Personnel (KMP) and their close family members, entities controlled by KMP. Disclosures required regardless of whether price was charged.',
          exception: 'Government-related entities receive partial disclosure exemptions for transactions with government and other government-related entities.',
          example: 'Company pays ₹50 Lakhs salary and ₹10 Lakhs sitting fee to Managing Director (KMP). Full breakdown of KMP compensation disclosed in notes.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 21 Forex',
      keyPrinciples: [
        {
          title: 'Functional Currency & Translation Mechanics',
          description: 'Functional Currency = Currency of primary economic environment in which entity operates (primary indicators: currency influencing sales prices and labor/material costs). Foreign currency transactions initially recorded at spot exchange rate. Monetary items translated at closing rate at reporting date (gains/losses to P&L). Non-monetary items measured at historical cost remain at transaction date rate.',
          exception: 'Integral vs Non-integral classification is ELIMINATED in Ind AS 21. Foreign operations translated: Assets/Liabilities at closing rate, Income/Expenses at average rates; translation differences accumulated in Foreign Currency Translation Reserve (FCTR) in OCI.',
          example: 'USD $100,000 receivable recorded at ₹82/$. Year-end closing rate = ₹84/$. Exchange gain of ₹2,00,000 recognized in P&L.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 115 Revenue',
      keyPrinciples: [
        {
          title: '5-Step Revenue Recognition Model',
          description: 'Revenue recognized when entity satisfies performance obligation by transferring promised good/service to customer (control transfer). 5 Steps: Step 1: Identify contract; Step 2: Identify performance obligations (distinct goods/services); Step 3: Determine transaction price (adjust for variable consideration, financing component, non-cash consideration); Step 4: Allocate transaction price to performance obligations based on relative Standalone Selling Prices; Step 5: Recognize revenue when/as performance obligation is satisfied (over time vs point in time).',
          exception: 'Variable Consideration (discounts, rebates, bonuses) included in transaction price ONLY IF highly probable that significant revenue reversal will not occur when uncertainty resolves.',
          example: 'Software sold with 1-year free maintenance for ₹120 Lakhs. Standalone prices: Software ₹100L, Maintenance ₹20L. Revenue: ₹100L recognized on delivery; ₹20L recognized over 12 months.'
        }
      ]
    },
    {
      chapterName: 'Ind AS 101 First Time Adoption',
      keyPrinciples: [
        {
          title: 'Transition Date & Mandatory Exceptions / Optional Exemptions',
          description: 'First-time adopter prepares Opening Ind AS Balance Sheet at Date of Transition (beginning of earliest comparative period presented). Principles: Recognize all assets/liabilities required by Ind AS, derecognize non-qualifying items, reclassify items, and measure under Ind AS. Adjustments recognized directly in Retained Earnings at transition date.',
          exception: 'Mandatory Exceptions (retrospective application prohibited): De-recognition of financial assets/liabilities, Hedge accounting, Estimates, NCI. Optional Exemptions: Deemed Cost option for PPE/Investment Property (carrying value or fair value at transition date), Business Combinations retrospective exemption.',
          example: 'First Ind AS financial statements for FY 2024-25 (with FY 2023-24 comparative). Transition Date = 1st April 2023. Opening Ind AS Balance Sheet prepared as on 1st April 2023.'
        }
      ]
    },
    {
      chapterName: 'Conceptual Framework',
      keyPrinciples: [
        {
          title: 'Framework Elements & Measurement Bases',
          description: 'Sets out concepts underpinning Ind AS financial reporting: Objective of financial reporting (useful information for decision making), Qualitative characteristics (Relevance, Faithful Representation, Comparability, Verifiability, Timeliness, Understandability). Definitions of Asset, Liability, Equity, Income, Expense. Measurement bases: Historical Cost vs Current Value (Fair Value, Value in Use, Current Cost).',
          exception: 'Conceptual Framework is not an Ind AS standard itself; if a specific Ind AS overrides the Framework, the specific Ind AS prevails.',
          example: 'Asset defined as present economic resource controlled by entity as a result of past events.'
        }
      ]
    },
    {
      chapterName: 'Professional and Ethical Duty of CA',
      keyPrinciples: [
        {
          title: 'Code of Ethics & Statutory Financial Reporting Integrity',
          description: 'Fundamental ethical principles for CAs: Integrity, Objectivity, Professional Competence and Due Care, Confidentiality, Professional Behavior. Independence requirements, non-audit service prohibitions, statutory responsibilities under Companies Act 2013 (Section 143 auditor reporting on Ind AS compliance, internal financial controls, fraud reporting u/s 143(12)).',
          exception: 'Confidentiality duty yields when disclosure is required by statutory law or judicial summons.',
          example: 'CA must decline audit engagement if fee is contingent on outcome or if providing valuation services impacting financial statement numbers.'
        }
      ]
    },
    {
      chapterName: 'Accounting & Tech',
      keyPrinciples: [
        {
          title: 'Digital Reporting, XBRL & Automated Controls',
          description: 'Modern technology integration in Ind AS financial reporting: eXtensible Business Reporting Language (XBRL and Inline XBRL/iXBRL) taxonomies mandated by MCA for digital filing, automated ERP accounting controls, audit trail requirements u/s Rule 3(1) of Companies (Accounts) Rules, cloud accounting security, and AI-driven predictive financial analysis.',
          exception: 'Software used for maintaining books of account must feature an un-alterable audit trail edit log facility for every transaction logged.',
          example: 'Company installs Ind AS compliant SAP S/4HANA ERP with automated iXBRL tagging for MCA reporting and mandatory audit trail logging.'
        }
      ]
    }
  ],
  Audit: AUDIT_CHAPTER_SUMMARIES,
  DT: [
    {
      chapterName: 'Basic Concepts [Chapter 1]',
      keyPrinciples: [
        {
          title: 'Constitutional Taxation Authority [Entry 82 & Article 265]',
          description: 'No tax can be levied or collected except u/a 265. Entry 82 of the Union List (List I in Seventh Schedule) empowers Parliament to make laws on taxes on income other than agricultural income.',
          exception: 'Agricultural income is strictly outside the central government\'s taxing power. Only State list Entry 46 holds legislative jurisdiction over agricultural income taxes.',
          example: 'A central legislative proposal to tax direct wheat harvest income is invalid due to Entry 82 exclusions.'
        },
        {
          title: 'Statutory Pillars of Direct Tax Law',
          description: 'Direct Tax Law consists of five fundamental pillars: (1) Income-tax Act, 1961 (primary legal code u/s 1 to 298), (2) Annual Finance Acts passed by Parliament (prescribing dynamic tax slabs/rates), (3) Income-tax Rules, 1962 (machinery guidelines), (4) CBDT Circulars and Notifications (issued u/s 119 to clarify doubts), and (5) Legal Decisions of Supreme Court and High Courts.',
          exception: 'CBDT circulars are strictly binding on income-tax authorities but not on taxpayers, who can choose to challenge adverse circulars or take advantage of beneficial ones.',
          example: 'A taxpayers company relies on a beneficial CBDT circular clarifying the allowance of dynamic computer accessories as 40% depreciable plant.'
        },
        {
          title: 'Statutory Rules of Interpretation & Aids',
          description: 'Courts interpret fiscal laws using specific principles: (1) Rule of Literal Interpretation (natural/plain grammatical meaning), (2) Mischief Rule / Heydon\'s Rule (looks at the position before amendment to find the mischief sought to be remedied), (3) Golden Rule (allows departure from literal meaning if it leads to absurdity), and (4) Harmonious Construction (the whole statute must be read as a whole to avoid inconsistency).',
          exception: 'Penal provisions must always be interpreted strictly. In case of unresolved ambiguity, the benefit of doubt is given to the taxpayer, whereas exemptive provisions are interpreted in favour of revenue.',
          example: 'A tax tribunal reads section 43B harmoniously with MSME payment deadlines to avoid the absolute disallowance of standard trading payables.'
        },
        {
          title: 'Symmetric Temporal Matching [Section 3 & Assessment Year u/s 2(9)]',
          description: 'Income earned during the Previous Year (PY) [Sec 3] is assessed and taxed in the immediately following Assessment Year (AY) [Sec 2(9)]. Newly set-up business has its first Previous Year commencing from date of setup to 31st March.',
          exception: 'Exceptions where previous year income is taxed in itself to prevent tax evasion: (1) Shipping business of non-residents u/s 172, (2) Persons leaving India permanently u/s 174, (3) AOP/BOI/AJP formed for a short-duration event u/s 174A, (4) Persons transferring assets to avoid tax u/s 175, and (5) Discontinued business u/s 176.',
          example: 'A ship chartered by a non-resident carries cargo in foreign waters from an Indian port in Nov 2025. It cannot leave the port until 7.5% of freight is offered to tax in PY 2025-26 u/s 172.'
        },
        {
          title: 'Undisclosed Asset and Cash Credits [Sec 68-69D & 115BBE]',
          description: 'Anti-avoidance provisions deem unexplained items as tax: Cash Credits u/s 68, Unexplained Investments u/s 69, Unexplained Money u/s 69A, Understated Investments u/s 69B, Unexplained Expenditure u/s 69C, or Hundi loan borrowings u/s 69D. Taxable under Section 115BBE at an effective rate of 78% (60% base tax + 25% surcharge + 4% cess).',
          exception: 'Venture Capital Funds (VCFs) registered with SEBI are exempt from proving the source of source of funds for share application money received.',
          example: 'An auditor finds unexplained credit of ₹10,00,000 in books. The assessee fails to identify source. Tax is levied flat at 78% u/s 115BBE with absolutely no deductions or basic exemptions.'
        }
      ],
      visualBreakdown: {
        title: 'DT - Chapter 1: Undisclosed Income & 115BBE 78% Tax Flow',
        type: 'flow'
      }
    },
    {
      chapterName: 'Exempt Incomes [Chapter 2]',
      keyPrinciples: [
        {
          title: 'Agricultural Income Ambit [Section 10(1) & 2(1A)]',
          description: 'Under Section 10(1), agricultural income is completely excluded from total income. It includes: (1) Rent/revenue derived from land in India used for agricultural purposes, (2) Income from basic (tilling, sowing) and subsequent (weeding, harvesting) operations on such land, and (3) Income from farm buildings within vicinity used as dwellings/storehouses.',
          exception: 'Income from foreign agricultural land is 100% taxable in India. Rearing of livestock, breeding, dairy farming, and poultry farming are non-agricultural activities.',
          example: 'A nursery owner sells saplings in plastic pots. This is agricultural income holding 100% exemption u/s 10(1) as ratified by Explanation 3 to Section 2(1A).'
        },
        {
          title: 'Agri-Business Composite Allocation Slabs',
          description: 'Rules 7A, 7B & 8 govern apportionment of dual-character composite income: (1) Rubber Mfg (Rule 7A): 65% Agri (Exempt) | 35% Business (PGBP), (2) Coffee Grown & Cured (Rule 7B(1)): 75% Agri (Exempt) | 25% Business (PGBP), (3) Coffee Grown, Cured, Roasted & Ground (Rule 7B(2)): 60% Agri (Exempt) | 40% Business (PGBP), and (4) Tea Grown & Mfg (Rule 8): 60% Agri (Exempt) | 40% Business (PGBP).',
          exception: 'If rubber, tea, or coffee is imported as raw material from foreign land and processed in India, the entire profit is taxable as business income.',
          example: 'A tea company in Assam gets net profit of ₹20,00,000. Applying Rule 8, ₹12,00,000 is classified as exempt agricultural income, while ₹8,00,000 is taxed as PGBP.'
        },
        {
          title: 'Partial Integration Tax Engine',
          description: 'A statutory mechanism to apply higher marginal tax brackets indirectly to non-agricultural income. Triggered only if: (1) Net agricultural income exceeds ₹5,000 p.a., and (2) Non-agricultural taxable income exceeds the basic exemption limit (e.g. ₹4,00,000 u/s 115BAC).',
          exception: 'Partial integration does not apply to firms, LLPs, companies, cooperative societies, or local authorities.',
          example: 'Tax computation: (1) Tax on aggregated (Agri + Non-Agri) income. (2) Tax on (Agri + Basic Exemption Limit). (3) Step 1 tax minus Step 2 tax is the actual tax weight.'
        },
        {
          title: 'Disallowance of Exempt Income Expenses [Section 14A & Rule 8D]',
          description: 'No deduction is permissible in respect of expenditure incurred in relation to income which does NOT form part of total income. Under Rule 8D, the disallowance is the aggregate of: (1) Direct expenditure, and (2) 1% of the annual average of monthly averages of the value of exempt investments.',
          exception: 'The disallowance determined under Rule 8D cannot exceed the total expenditure actually claimed by the assessee in their books for the financial year.',
          example: 'An investor holds average tax-exempt mutual fund units worth ₹50,050,000. Applying Rule 8D, ₹5,00,500 represents a mandatory disallowance added back to taxable profits.'
        },
        {
          title: 'Exemptions for Partnerships, Tribals and Sikkimese',
          description: 'Exempts specific categories of income: (1) Partner\'s share of profits in the firm total income is completely exempt u/s 10(2A), (2) Payment received by a member of HUF u/s 10(2), (3) Member of scheduled tribe residing in specified local areas u/s 10(26), and (4) Income of Sikkimese individuals u/s 10(26AAA).',
          exception: 'Salary or interest received by a partner from the firm is NOT exempt u/s 10(2A) and is taxed under PGBP up to allowable thresholds u/s 40(b).',
          example: 'A Sikkimese resident earns ₹10,00,000 from securities/bonds outside the state. The income is 100% exempt from tax u/s 10(26AAA).'
        }
      ],
      visualBreakdown: {
        title: 'DT - Chapter 2: Agricultural Apportionment & Integration Slabs',
        type: 'flow'
      }
    },
    {
      chapterName: 'PGBP [Chapter 3]',
      keyPrinciples: [
        {
          title: 'Charging Section [Section 28]',
          description: 'Income is chargeable under PGBP for profits/gains of any business/profession carried on by an assessee anytime in the previous year. Includes compensations for termination or change in management u/s 28(ii), specific services rendered to members by a trade/professional association u/s 28(iii), export incentives (such as sale of import entitlements, duty drawback, cash assistance), value of any benefit/perquisite u/s 28(iv), remuneration/interest received by a partner from the firm u/s 28(v), non-compete agreements sums u/s 28(va), conversion of inventory into capital assets based on FMV u/s 28(vi), and demolition or transfer sums of 35AD assets u/s 28(via).',
          exception: 'Income from letting out a residential house property (by an owner) is strictly chargeable under the head "Income from House Property" and NOT under current legislation u/s 28, even if the primary business of the entity is property renting.',
          example: 'An exporter sells their duty credit scrips for a premium of ₹3,00,000. Under Sec 28(iiid), this profit is taxable business income under the PGBP head.'
        },
        {
          title: 'Admissible Business Deductions [Sections 30 & 31]',
          description: 'Section 30 enables deductions for rent, rates, taxes, repairs, and insurance of buildings used for business. Section 31 specifies the identical treatment of repairs and insurance of machinery, plant, and furniture.',
          exception: 'Any expenditure on repairs that is of a capital nature (i.e. increases standard performance or adds a new asset) is strictly disallowed as current repairs u/s 30 or 31, and must be capitalized to the block.',
          example: 'A tenant incurs current repairs of ₹55,000 on a factory premises which they are bound to maintain u/s 30. The entire amount is fully deductible under PGBP.'
        },
        {
          title: 'Mandatory Depreciation Engine [Section 32]',
          description: 'Depreciation under the Income-tax Act is calculated on the Written Down Value (WDV) of a "Block of Assets" (group of assets of same class with same depreciation rate). Suffix explanation 5 mandates that the deduction of depreciation must be claimed compulsorily, regardless of whether or not the assessee has claimed it in their return.',
          exception: 'No depreciation is allowable on the cost of land because land is non-depreciable. Similarly, under Finance Act 2021, goodwill of a business or profession is completely excluded from the block of intangible assets and carries a 0% rate.',
          example: 'A company buys a laptop on 15-12-2025 for ₹50,000. Since it was put to use for less than 180 days (acquired and used after Oct 4th), the normal depreciation rate of 40% is restricted to half, yielding an allowable deduction of ₹10,000 (i.e., 20%).'
        },
        {
          title: 'Additional Depreciation [Section 32(1)(iia)]',
          description: 'Allows an extra 20% deduction in the first year of acquisition and installation on new plant & machinery (other than ships, aircraft, office appliances, road vehicles, or guest house items) for manufacturing entities, or entities engaged in power generation/distribution.',
          exception: 'If the new machinery is used for less than 180 days in the initial year, additional depreciation is restricted to 10%. However, the remaining 10% is fully allowed as carry-forward deduction in the immediately succeeding previous year.',
          example: 'A printing press installs a new offset machine for ₹20,00,000 on 15-12-2025. In AY 2026-27, they claim normal depreciation of 7.5% (limited to half of 15%) and additional depreciation of 10% (limited to half of 20%), yielding total deduction of ₹3,50,000.'
        },
        {
          title: 'Investment-Linked Incentives [Section 35AD]',
          description: 'Provides a 100% immediate deduction of capital expenditure (excluding land, goodwill, and financial instruments) incurred wholly and exclusively for specified businesses (such as cold chain facility, warehouse for raw agricultural produce, 2+ star hotels, 100+ bed hospitals, slurry pipelines, inland container depots, etc.).',
          exception: 'The asset must be used for the specified business for a continuous period of 8 years u/s 35AD(7A). If the asset is converted or transferred for other business purposes, the deduction previously claimed is clawed back as business income.',
          example: 'A company invests ₹25,00,000 in constructing a rural cold storage facility. If they opt for 35AD, the entire ₹25,00,000 capital asset represents a deduction from their current year PGBP income.'
        },
        {
          title: 'Inadmissible Statutory Deductions [Section 40]',
          description: 'Imposes strict disallowances: (1) payments outside India or to a non-resident u/s 40(a)(i) on which tax has not been deducted or paid, (2) payments to a resident u/s 40(a)(ia) where non-deduction of TDS results in 30% disallowance, and (3) partnership firm payments u/s 40(b) where interest on capital exceeds 12% p.a., or working partner remuneration exceeds the prescribed book profits slabs.',
          exception: 'If the TDS is subsequently deducted or paid in a later previous year, the disallowed 30% of the resident expenditure is allowed as a deduction in the previous year of actual tax payment.',
          example: 'A company pays ₹5,00,000 as professional fee to a resident consultant u/s 194J but fails to deduct tax. Under Sec 40(a)(ia), 30% of the expenditure (₹1,50,000) is added back to their taxable profits.'
        },
        {
          title: 'Anti-Avoidance Cash Limit Violations [Section 40A(3)]',
          description: 'To curb tax evasion and black money transactions, any expenditure in respect of which a single payment or aggregate of payments made to a person in a single day, otherwise than through prescribed electronic modes (account payee cheque/draft, UPI, RTGS, etc.), exceeds ₹10,000 is strictly disallowed in full.',
          exception: 'The monetary payment limit is raised to ₹35,000 per day u/s 40A(3) when payments are made specifically to transport operators for plying, hiring, or leasing goods carriages, or is covered under Rule 6DD exemptions.',
          example: 'An engineering firm pays ₹15,000 in physical cash to a vendor for spares in a single day. Since this exceeds ₹10,000 and does not fall under Rule 6DD, the entire ₹15,000 is disallowed u/s 40A(3).'
        },
        {
          title: 'Speculation Business Separation [Section 73]',
          description: 'Where an assessee carries on speculative transactions (contracts for purchase/sale of commodities/stocks settled otherwise than by actual delivery u/s 43(5)), they must be considered a distinct speculation business. Speculative losses can only be set off against speculative profits.',
          exception: 'Hedging contracts in respect of raw materials to guard against price fluctuations, or trading in derivatives inside recognized stock exchanges are NOT treated as speculative transactions.',
          example: 'An export house enters into a currency derivative inside a stock exchange to hedge their overseas dollar receivables. This is classified as a non-speculative hedging contract.'
        }
      ],
      visualBreakdown: {
        title: 'Rule 5(1) Statutory PGBP Depreciation Block Slabs',
        type: 'table',
        headers: ['Asset Class & Block Identifier', 'Standard Rate', 'Key Conditions & Remarks'],
        rows: [
          ['Block 1: Residential Buildings (other than hotels/boarding)', '5%', 'Used purely for residential dwellings of employees'],
          ['Block 2: General Commercial Buildings', '10%', 'Offices, factories, commercial godowns, and tourist hotels'],
          ['Block 3: Purely Temporary Erections', '40%', 'Temporary wooden structures or slide-ins built on leaseholds'],
          ['Block 4: Furniture & Fittings', '10%', 'Includes office furniture, electrical fittings, fans, wiring'],
          ['Block 5: Plant & Machinery (General)', '15%', 'All machinery, general motors, tools, and office appliances'],
          ['Block 6: Computers & Specialized Software', '40%', 'Includes system units, laptops, printers, scanners, servers'],
          ['Block 7: Air & Water Pollution Control Equipments', '40%', 'Environmental safety units, recycling plants, smoke-absorb'],
          ['Block 8: Intangible Assets (Patents, IP, Licenses, Know-how)', '25%', 'Acquired after 1st April 1998; strictly excludes Goodwill']
        ]
      }
    },
    {
      chapterName: 'Capital Gains [Chapter 4]',
      keyPrinciples: [
        {
          title: 'Capital Asset Scope & Exclusions [Section 2(14)]',
          description: 'Under Section 2(14), a capital asset means property of any kind held by an assessee (connected/not connected with business). Exclusions: stock-in-trade, personal movable effects, rural agricultural land, and specified Gold Bonds.',
          exception: 'Jewellery, archaeological collections, drawings, paintings, sculptures, and any work of art are strictly deemed capital assets even if held for personal use.',
          example: 'A taxpayer sells their personal computer for ₹20,000. It is a personal effect and exempt. Selling diamond earrings for ₹4,00,000 is taxable as capital gains.'
        },
        {
          title: 'Period of Holding & Asset Classification [Section 2(42A)]',
          description: 'Classifies asset as short-term u/s 2(42A) vs long-term: (1) 12 Months: listed securities, unit of equity-oriented mutual fund, zero coupon bond. (2) 24 Months: unlisted shares, land or building. (3) 36 Months: other general assets.',
          exception: 'Under Section 50AA, Market Linked Debentures (MLDs), unlisted bonds, and specified debt mutual funds (acquired on/after 1.4.2023) are always deemed Short Term Capital Assets.',
          example: 'Assessee sells unlisted shares of ABC Pvt Ltd held for 15 months. Since it is below 24 months, it is taxable as short-term capital gains at normal slabs.'
        },
        {
          title: 'Scope of Transfer & Conversions [Section 2(47) & Section 45(2)]',
          description: 'Transfer comprises sale, exchange, relinquishment of asset, compulsory acquisition, possession u/s 53A, or conversion into stock-in-trade. Under Section 45(2), conversion of capital asset to stock-in-trade is a deemed transfer on date of conversion but taxable ONLY when the stock is sold.',
          exception: 'Indexation benefit is only available up to the year of conversion of the capital asset, not up to the actual year of subsequent sale.',
          example: 'A trader converts personal gold into stock-in-trade (FMV ₹15,00,000) in Nov 2024. Stock is sold for ₹18,00,000 in July 2025. Both capital gains and business profits are taxed in AY 2026-27.'
        },
        {
          title: 'Slump Sale Net Worth Engine [Section 50B]',
          description: 'Transfer of one or more undertakings for a lump sum consideration without individual asset values assigned. Deemed cost of acquisition is the Net Worth of the undertaking (aggregate book value of assets - book liabilities).',
          exception: 'Depreciable assets are taken at their WDV u/s 43(6)(c); self-generated goodwill and 35AD capital write-off assets are valued at Nil.',
          example: 'An entire software unit is sold as is for ₹3.85 Crore. Book value of assets (excluding land revaluation) is ₹2.75 Crore, current liabilities are ₹90 Lakh, so Net Worth is ₹1.85 Crore. LTCG is ₹2.00 Crore (3.85C - 1.85C).'
        },
        {
          title: 'Statutory Capital Gains Reinvestment Reliefs',
          description: 'Exemptions represent reinvestment reliefs: (1) Sec 54: Residential house sold -> Invest in another residential house (limit ₹10 Crore), (2) Sec 54B: Urban agricultural land -> Invest in new agricultural land, (3) Sec 54EC: LTCG on land/building -> Invest in NHAI/RECL/PFC bonds (limit ₹50 Lakh), (4) Sec 54F: LTCG on any asset (except house) -> Invest in residential house (limit ₹10 Crore).',
          exception: 'If newly acquired asset is transferred within 3 years, the cost of acquisition is reduced by the exempted capital gains, triggering STCG.',
          example: 'Individual sells a house property with LTCG of ₹3.5 Crore, and reinvests ₹3 Crore in NHAI bonds within 6 months. Exemption u/s 54EC is capped at ₹50 Lakh. Rest of ₹3 Crore is reinvested in another house to claim Sec 54.'
        }
      ],
      visualBreakdown: {
        title: 'DT - Chapter 4: Capital Asset Exclusion & SOH Period Test',
        type: 'flow'
      }
    },
    {
      chapterName: 'Income from Other Sources [Chapter 5]',
      keyPrinciples: [
        {
          title: 'Residuary Head & Chargeability [Section 56 & Section 145]',
          description: 'Any taxable income that cannot be legally classified under any of the preceding four heads (Salaries, House Property, PGBP, Capital Gains) is assessed here under Section 56. Section 145 specifies that income is computed in accordance with either cash or mercantile system of accounting regularly employed by the assessee.',
          exception: 'Notified Income Computation and Disclosure Standards (ICDSs) must be followed if mercantile accounting is employed, except for individuals/HUFs whose books are not auditable u/s 44AB.',
          example: 'A taxpayer employs the mercantile method. Interest of ₹12,000 on general bank deposits, though not received in cash, is taxable on accrual under IFOS.'
        },
        {
          title: 'Deemed Dividend statutory Engine [Section 2(22)(a) to (e)]',
          description: 'Includes payments representing deemed dividends: (a) Distribution of accumulated profits entailing release of company assets; (b) Distribution of debentures, deposit certificates, or preference bonus shares; (c) Liquidation distributions attributable to accumulated profits; (d) Reduction of capital; (e) Advance or loan by a closely held company to a owner of >=10% voting power, or to a concern (HUF/Firm/AOP/BOI/Co) where such owner has substantial interest (>=20% income/share), to the extent of accumulated profits.',
          exception: 'Loans in the ordinary course of lending business, and set-off of subsequently declared dividends against previously taxed loans u/s 2(22)(e) are strictly excluded. Bonus shares to equity shareholders do NOT constitute dividend.',
          example: 'A closely held company with ₹10,00,000 accumulated profits lends ₹1,50,000 to Mr. K (holder of 15% equity, not business-connected). Repayment of loan during PY does not alter taxability. ₹1,00,000 is deemed dividend and taxed u/s 2(22)(e).'
        },
        {
          title: 'Taxability of Gifts & Inadequate Considerations [Section 56(2)(x)]',
          description: 'Sum of money or property received without or for inadequate consideration is taxed if it exceeds thresholds: (1) Money: aggregate received without consideration > ₹50,000 is fully taxed. (2) Immovable Property: without consideration: stamp duty value (SDV) exceeds ₹50,000; for inadequate consideration: (SDV - Consideration) > ₹50,000 AND (SDV - Consideration) > 10% of Consideration. (3) Movable Property: aggregate without consideration: aggregate FMV > ₹50,000; aggregate inadequate: (aggregate FMV - Consideration) > ₹50,000.',
          exception: 'No tax is attracted if gifts are received: (1) from any relative (defined u/s 56(2)(x)), (2) on occasion of marriage, (3) under a will/inheritance, (4) in contemplation of death of donor, (5) from local authorities or registered trusts (12A/12AB), (6) for COVID-19 medical costs or on employee\'s death from employer.',
          example: 'Mr. A receives a plot of land with stamp value ₹5,00,000 from a friend. Since SDV exceeds ₹50,000, the entire ₹5,00,000 is taxable u/s 56(2)(x) as IFOS. If he subsequently sells it for ₹7,00,000, his cost of acquisition is deemed u/s 49(4) to be the ₹5,00,000 already taxed.'
        },
        {
          title: 'Special Receipts: Casual, Interest on Compensation & LIP [Section 56(2)(ib), (viii), (xiii)]',
          description: 'Covers other high-yield receipts: (1) Casual Income u/s 56(2)(ib) (winnings from lotteries, crossword puzzles, races, betting) taxed flat u/s 115BB at 30%; (2) Interest on compensation/enhanced compensation u/s 56(2)(viii) is taxable in year of receipt; (3) LIP receipts not exempt u/s 10(10D) (policies with premium > ₹5,00,000 issued on/after 1.4.2023) taxed u/s 56(2)(xiii) read with Rule 11UACA.',
          exception: 'Interest on compensation has a flat statutory deduction of 50% u/s 57(iv), and no other deduction is allowed. Term life insurance premium is excluded from checking the ₹5,00,000 premium cap.',
          example: 'Mr. G receives ₹5,00,000 as interest on enhanced compensation (with ₹1,50,000 relating to past years). The entire ₹5,00,000 is taxable in the receipt year, and a flat 50% deduction (₹2,50,000) is allowed u/s 57(iv).'
        },
        {
          title: 'Allowed vs Non-Allowable Deductions [Section 57 & Section 58]',
          description: 'Section 57 outlines deductions: (1) banker commission for realising dividend/interest; (2) letting expense of plant/machinery/furniture (repairs, insurance, depreciation); (3) Family Pension: 33-1/3% of pension or ₹15,000 (optional regime) / ₹25,000 (default regime u/s 115BAC), whichever is less. Section 58 disallows: personal expense, interest/salary paid outside India without TDS, related person excessive payments, cash expenses exceeding ₹10,000 u/s 58(2), and all expenses against casual incomes.',
          exception: 'Deduction of interest expense incurred to earn dividend or mutual fund units income is allowed, but strictly capped at a maximum of 20% of such dividend income.',
          example: 'A beneficiary of family pension under the default tax regime u/s 115BAC receives ₹90,000. Allowable deduction is min of 33-1/3% (₹30,000) or ₹25,000. So ₹25,000 is deducted.'
        }
      ],
      visualBreakdown: {
        title: 'DT - Chapter 5: Gift & Deemed Dividend Taxability Flow',
        type: 'flow'
      }
    }
  ],
  IDT: [
    {
      chapterName: 'Supply under GST',
      keyPrinciples: [
        {
          title: 'Scope of Supply [Section 7]',
          description: 'A transaction qualifies as a supply under GST u/s 7(1) if it involves any form of supply of goods or services or both (such as sale, transfer, barter, exchange, license, rental, lease, or disposal) made or agreed to be made for a consideration by a person in the course or furtherance of business. It also encompasses activities between a person other than an individual and its members [Sec 7(1)(aa)], importation of services with consideration [Sec 7(1)(b)], and deemed supplies without consideration under Schedule I [Sec 7(1)(c)].',
          exception: 'Import of services for a consideration is a taxable supply whether or not it is in the course or furtherance of business. This is the only exception to the business furtherance condition.',
          example: 'Owner of a house receives architect services for his private residence from a US architect for $5,000. This is a supply u/s 7(1)(b) even though it is not for business furtherance.'
        },
        {
          title: 'Deemed Supply Without Consideration [Schedule I]',
          description: 'The following four transactions constitute a supply even if made without consideration: (1) Permanent transfer or disposal of business assets on which Input Tax Credit (ITC) has been availed. (2) Supply of goods or services between related persons or distinct persons (under common PAN, u/s 25) when made in course/furtherance of business. (3) Supply of goods between a principal and their agent (decided by whether the agent issues invoices in their own name). (4) Import of services by a taxable person from a related person or establishment outside India, in the course/furtherance of business.',
          exception: 'Gifts up to ₹50,000 in value in a financial year by an employer to an employee are excluded from being treated as supply. Disposal of business assets on which ITC was blocked or not availed is not a supply.',
          example: 'Mohan (Chartered Accountant) transfers office supplies from his Delhi head office to a branch office in Kolkata. Since they reside under the same PAN, they are distinct persons, and the stock transfer is a deemed supply under Schedule I Para 2.'
        },
        {
          title: 'Classification of Supply as Goods vs. Services [Schedule II]',
          description: 'Sec 7(1A) references Schedule II to classify activities: (1) Supply of Goods: Any transfer of title in goods; transfer of title under an agreement passing title at a future date (e.g., Hire Purchase); transfer of business assets. (2) Supply of Services: Transfer of right or undivided interest in goods without transferring title; lease, tenancy, easement, or license to occupy land; letting of commercial/residential building for business; any job work process applied to another person\'s goods; private/non-business use of business assets; renting of immovable property; construction of a complex, building, civil structure (completely or partially) for sale; temporary/permanent transfer of IP rights; IT software development, design, and customization; agreeing to refrain from/tolerate/do an act (non-compete); works contract; and restaurant services.',
          exception: 'Construction is classified as a service unless the entire consideration is received after the competent authority issues a completion certificate or after its first occupation (making it a non-supply of land/building u/s Schedule III).',
          example: 'Selling ready-made garments is a Supply of Goods. Giving machinery on rent is the transfer of right in goods without transfer of title, which constitutes a Supply of Services.'
        },
        {
          title: 'Negative List — Non-Supplies [Schedule III & Notifications]',
          description: 'The following are treated as neither a supply of goods nor services: (1) Services by an employee to the employer in the course of/relation to employment. (2) Services by any court or tribunal (includes Consumer Disputes Redressal Commissions). (3) Duties of MPs, MLAs, and constitutional posts (President, PM, Chief Justice, etc.). (4) Funeral, burial, crematorium, or mortuary services including dead body transport. (5) Sale of land, and sale of building (where entire consideration is received after completion certificate/first occupation). (6) Actionable claims (EXCLUDING specified actionable claims: betting, casinos, gambling, horse racing, lottery, online money gaming). (7) Merchant trading / Out-and-Out supplies (selling goods from a non-taxable territory to another non-taxable territory without entering India u/Schedule III Para 7). (8) High Sea Sales (supply of goods by the consignee to any other person by endorsement of documents after dispatch from origin outside India but before home clearance u/Schedule III Para 8(b)). (9) Bond to Bond Transfer of goods (supply of warehoused goods to any person before clearance for home consumption u/Schedule III Para 8(a)). (10) SEZ and Free Trade Zone (FTZ) entries, or custom-bonded warehousing movements made before clearing goods for home consumption. (11) Allocations of Co-insurance premium share or payment of Ceding Commission u/r transactions between lead insurer and co-insurers or reinsurer (clarified as non-supplies via CBIC Circulars).',
          exception: 'Only specified actionable claims (betting, lottery, gambling, casinos, horse racing, and online money gaming) are treated as supply of goods. General actionable claims (insurance receivables, unsecured loans, book debts) are non-supplies.',
          example: 'A trader winds up his business and transfers warehoused goods (bond to bond transfer) to another dealer before home consumption, or executes a high sea sale by transferring endorsement documents while the cargo is in transit over international waters. These are non-supplies u/Schedule III Para 8, attracting zero GST.'
        },
        {
          title: 'Composite and Mixed Supplies [Section 8]',
          description: 'Under Section 8, the tax liability on a bundled supply is determined as follows: (1) Section 8(a) [Composite Supply]: A composite supply (defined u/s 2(30) as containing two or more taxable supplies of goods or services, naturally bundled and supplied in conjunction in the ordinary course of business, with one predominant principal supply) shall be treated as a supply of such principal supply, attracting its specific rate of tax. (2) Section 8(b) [Mixed Supply]: A mixed supply (defined u/s 2(74) as comprising two or more individual supplies of goods or services made in conjunction with each other for a single price, not naturally bundled) shall be treated as a supply of that particular supply which attracts the highest rate of tax.',
          exception: 'If individual prices are separately charged for each item in a kit, menu, or package, they are not treated as a single bundled supply. They constitute independent supplies taxed at their respective individual rates.',
          example: 'Rati Computers supplies a laptop (predefined as the principal supply taxable at 18% u/s 2(30)) along with a laptop bag (taxable at 28%) for a single price of ₹55,000. Under Section 8(a), since this is naturally bundled, the transaction is treated solely as a supply of the principal item (laptop) and taxed entirely at 18%.'
        },
        {
          title: 'Key Shorthand Circulars & Clarifications [Chapter 1]',
          description: 'High-yield CBIC circulars clarifying boundaries of supply under GST: (1) Circular No. 34/8/2018: Printing of content/manuscripts owned by customer is a services supply (principal supply is printing service); if printer supplies custom goods using his own paper and design, it is a goods supply. (2) Circular No. 92/11/2019: Free samples or gifts given without consideration are not supply under Schedule I (unless made between distinct/related persons). For "Buy One Get One Free" offers, it is not a free supply, but is treated as supplying two items for a single price, taxed as composite/mixed supply u/s 8. (3) Circular No. 177/09/2022: Liquidated damages or late payment fees for breach of contract represent compensation/penalties, not an active agreement to tolerate an act, hence they are non-supplies (no GST). (4) Circular No. 196/08/2023: Director services paid as salary u/s 192 TDS are active employment contracts (Schedule III non-supply; no GST); director professional fees paid u/s 194J are non-employment services subject to compulsory RCM u/s 9(3). (5) Circular No. 205/17/2023: Joint-insurance co-insurance premium share allocation and ceding commissions/premium share from reinsurers do not represent independent supplies and attract zero GST.',
          exception: 'If free samples, brand gifts, or stock transfers are distributed to related persons or distinct persons (e.g. branch-to-branch u/s 25 or employer-to-employee exceeding ₹50,000), they remain taxable u/s 7(1)(c) under Schedule I regardless of consideration.',
          example: 'An FMCG company distributes free chocolate samples worth ₹1,20,000 to their registered wholesale branches. Since the branches are distinct persons under one PAN, it is a taxable deemed supply u/Schedule I Para 2, valued at open market value.'
        }
      ],
      visualBreakdown: {
        title: 'GST Supply Determination Flow',
        type: 'flow',
        content: `
                 Is there Transaction of Goods/Services?
                                   |
                     +-------------+-------------+
                     |                           |
                    YES                          NO (e.g. money/securities)
                     |                           |
                     v                           v
          Is there Consideration?          [Outside GST]
            /             \\
          YES              NO
          /                 \\
  [Sec 7(1)(a)/(b)/(aa)]     Is it u/Schedule I?
         |                    /             \\
         v                  YES              NO
  Is it in Course of        /                 \\
  Business? (or 7(1)(b)    v                   v
     Importation)    [Deemed Supply]     [Outside GST]
         |
         v
  Is it u/Schedule III or
  Government Notification?
      /         \\
    YES          NO
    /             \\
   v               v
 [Negative List] [TAXABLE GST SUPPLY!]
        `
      }
    },
    {
      chapterName: 'Charge of GST',
      keyPrinciples: [
        {
          title: 'Levy and Collection of CGST & IGST [Sec 9 of CGST Act / Sec 5 of IGST Act]',
          description: 'GST is levied on all intra-State supplies of goods/services (CGST u/s 9(1)) and inter-State supplies (IGST u/s 5(1)). Tax is payable by the taxable person based on the transaction value determined u/s 15. The maximum rate of CGST is legally capped at 20% (SGST/UTGST also 20%, bringing dual GST cap to 40%), while IGST is legally capped at 40%. Alcohol for human consumption is completely excluded from the scope of GST by constitutional definition. Similarly, extra neutral alcohol/rectified spirit used for manufacturing alcoholic liquor is outside the scope of GST.',
          exception: 'GST levy on five petroleum products (petroleum crude, high speed diesel, motor spirit/petrol, natural gas, aviation turbine fuel) is deferred. It will be levied from a future date to be notified by the Government on the recommendations of the GST Council.',
          example: 'Vardhman Synthetics sells industrial lubricants to a client. This is a standard intra-state supply, taxable under Section 9(1) at the notified rate (e.g. 18%) on the transaction value.'
        },
        {
          title: 'Reverse Charge Mechanism (RCM) — Goods [Section 9(3) / 5(3)]',
          description: 'RCM shifts the tax liability from the supplier to the recipient. Under Sec 9(3) of CGST / Sec 5(3) of IGST, specified goods are notified for RCM when sourced by registered persons: (1) Cashew nuts (not shelled or peeled), Bidi wrapper leaves (tendu), and Tobacco leaves supplied by an **Agriculturist** to **Any registered person**. (2) Raw cotton supplied by an **Agriculturist** to **Any registered person**. (3) Silk yarn supplied by **Any manufacturer of silk yarn** to **Any registered person**. (4) Used vehicles, seized/confiscated goods, or scrap/waste supplied by **Govt/local authority** (excluding Ministry of Railways) to **Any registered person**. (5) Priority Sector Lending Certificates (PSLC) supplied by **Any registered person** to **Any registered person**. (6) Essential oils of mint (peppermint, spearmint, water mint, horsemint, bergamot etc.) supplied by **Any unregistered person** to **Any registered person**.',
          exception: 'If an agriculturist sells raw tobacco leaves to an unregistered end-consumer, RCM does not trigger because the recipient must be a registered person. Instead, the transaction may be exempt or taxable under normal provisions depending on registration thresholds.',
          example: 'A registered tobacco manufacturer purchases tobacco leaves of value ₹15,00,000 from an agriculturist. Under RCM u/s 9(3), the manufacturer (recipient) must pay the applicable GST directly to the Government.'
        },
        {
          title: 'Reverse Charge Mechanism (RCM) — Services [Section 9(3) / 5(3)]',
          description: 'Key services notified under RCM u/s 9(3) include: (1) GTA services: Taxable @ 5% with no ITC (or GTA forward charge @ 5% with no ITC, or @ 12% with ITC). Non-taxable departments/governmental bodies registered solely for TDS are exempt from GTA RCM. (2) Legal Services: Provided by individual/senior advocate or firm of advocates to any business entity. (3) Sponsorship Services: Provided by any person to any body corporate or partnership firm. (4) Government Services: Provided by CG, SG, UT, or LA to a business entity (excluding renting of immovable property, posts, railways, transport of passengers/goods). (5) Renting of Immovable Property by Govt/LA: Provided to any registered person. (6) Renting of Residential Dwelling: Provided to any registered person for residential purpose. (7) Director Services: Provided by a director (non-employee) to a company/body corporate. (8) Insurance Agent Services: Provided to an insurer. (9) Recovery Agent Services: Provided to banking, FI, or NBFC. (10) Security Services (personnel): Provided by a non-body corporate to any registered person. (11) Renting of passenger motor vehicle (fuel included): Provided by a non-body corporate who does not charge 12% GST to any body corporate.',
          exception: 'Renting of residential dwelling for residential use to an unregistered person is exempt. Director remuneration declared as Salary (TDS u/s 192) represents an employer-employee contract, which is a non-supply under Schedule III (no GST, RCM does not apply). Raw advocate services provided to non-business entities are exempt.',
          example: 'XYZ Ltd (body corporate) hires a car rental service from an individual transporter (non-body corporate) who includes fuel in his price and issues a bill without 12% GST. XYZ Ltd is liable to pay GST @ 5% under RCM.'
        },
        {
          title: 'Composition Levy — Eligibility & Limits [Section 10(1) & 10(2)]',
          description: 'An optional, simplified concessional scheme to bring simplicity and reduce compliance for small taxpayers: (1) Aggregate Turnover in preceding FY must not exceed **₹1.5 Crore** (General States) or **₹75 Lakh** (for 8 Special Category States: Arunachal Pradesh, Uttarakhand, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura). Note that for Assam, Himachal Pradesh, Jammu & Kashmir, the limit remains ₹1.5 Crore. (2) Standard Tax Rates u/s 10(1): Manufacturers pay **1%** of Turnover in State/UT (0.5% CGST + 0.5% SGST/UTGST); Restaurant service providers pay **5%** of Turnover in State/UT (2.5% CGST + 2.5% SGST/UTGST); Other suppliers (Traders) pay **1%** of **taxable** supplies of goods/services in State/UT.',
          exception: 'A goods composition supplier is permitted a marginal supply of services up to 10% of the State/UT turnover in the preceding FY or ₹5 Lakh, whichever is higher. Interest income on extending deposits/loans/advances must be completely excluded from computing the marginal services limit and State/UT turnover.',
          example: 'Ramsewak (trader in Maharashtra) has preceding FY turnover of ₹60 Lakh. He can opt for composition in the current year. Apart from goods, he can supply other services up to ₹6 Lakh (10% of ₹60L) or ₹5L (whichever is higher), i.e. ₹6 Lakh. If services exceed ₹6L, his option lapses.'
        },
        {
          title: 'Composition Levy — Restrictions & Services Scheme [Section 10(2) & 10(2A)]',
          description: 'The scheme has strict statutory restrictions: (1) Taxpayers cannot collect tax on outward supplies, nor can they claim any Input Tax Credit (ITC). They must issue a **Bill of Supply** instead of a Tax Invoice with the words "composition taxable person, not eligible to collect tax on supplies" printed at the top. (2) Who are NOT eligible: Suppliers of non-taxable goods/services; persons engaged in any inter-State outward supplies; suppliers via ECO who collects TCS u/s 52; manufacturers/suppliers of notified items (Ice cream, Pan Masala, Tobacco, Aerated waters, Bricks, Tiles); CTP or NRTP. (3) Service Composition u/s 10(2A): Intended for small service providers whose preceding FY aggregate turnover does not exceed **₹50 Lakh**. Tax rate is **6%** flat of State/UT turnover (3% CGST + 3% SGST/UTGST).',
          exception: 'If an aggregate PAN has multiple registrations across different States, all branches must uniformly adopt the composition scheme. If any one branch registers under the normal scheme or becomes ineligible, the option automatically lapses for ALL locations under that PAN.',
          example: 'Billoo Barber operates a salon in Delhi and Haryana under the same PAN. Preceding FY turnover was ₹34 Lakh. He can opt for composition u/s 10(2A) for both salons. He pays 6% GST on his monthly bills and cannot collect GST from customers.'
        }
      ],
      visualBreakdown: {
        title: 'GST Composition Levy & RCM Logic Flow',
        type: 'flow',
        content: `
               Is Preceding FY Aggregate Turnover eligible?
                     /                           \\
          Goods/Restaurant <= ₹1.5Cr*          Services u/s 10(2A) <= ₹50L
         (*₹75L in 8 Special States)                    |
                     |                             Opt for 6% rate u/s 10(2A)
                     v                                  |
         Standard Rates u/s 10(1):                      v
         - Manufacturers: 1% of Turnover           Issue Bill of Supply
         - Restaurant Services: 5% of Turnover       (No GST Collection, No ITC)
         - Traders: 1% of Taxable Supplies
                     |
                     v
         Are there marginal services?
         - Allowed up to 10% of Preceding FY
           Turnover or ₹5 Lakh (whichever is higher)
         - *Exclude interest income from calculations
        `
      }
    },
    {
      chapterName: 'Place of Supply',
      keyPrinciples: [
        {
          title: 'Place of Supply of Goods (Domestic) [Section 10 of IGST Act]',
          description: 'Governs where domestic transactions are deemed to occur: (1) Sec 10(1)(a) (Involves movement): Place where the movement of goods terminates for delivery to the recipient. (2) Sec 10(1)(b) (Bill-to-Ship-to): Supplier delivers goods to recipient on directions of a third person. Deemed that the third person has received the goods; Place of supply is the principal place of business of that third person. (3) Sec 10(1)(c) (No movement): Location of goods at the time of delivery to the recipient. (4) Sec 10(1)(ca) (Supply to unregistered person): Address recorded on the invoice; if no address on record, the location of the supplier. (5) Sec 10(1)(d) (Assembly/Installation): Place of such assembly or installation.',
          exception: 'Sec 10(1)(e) (Supplied on board a conveyance): Place of supply is the location where the goods are taken on board the conveyance (aircraft, train, vessel, motor vehicle).',
          example: 'Mr. X boards a New Delhi-Kota train in New Delhi and sells goods (taken on board at Delhi) to a passenger at Jaipur. The place of supply of these goods is New Delhi (where taken on board), not Jaipur.'
        },
        {
          title: 'Place of Supply of Goods (Cross-Border) [Section 11 of IGST Act]',
          description: 'Governs cross-border imports and exports: (1) Sec 11(a) (Imports into India): Place of supply is the location of the importer. (2) Sec 11(b) (Exports from India): Place of supply is the destination outside India.',
          exception: 'All imports are deemed inter-state supplies and attract IGST. For specified intangible/digital assets or online money gaming crossing no physical boundaries, the location of the importer/recipient dictates tax placement directly.',
          example: 'MC Pvt Ltd imports kitchenware from China for its retail store in Noida, UP. The place of supply of these goods is Noida (location of the importer), and IGST is levied.'
        },
        {
          title: 'Place of Supply of Services (Domestic) [Section 12 of IGST Act]',
          description: 'In domestic transactions where both supplier and recipient are in India, Section 12 applies: (1) Sec 12(2) (Default): B2B is the location of the registered recipient. B2C is the location of the recipient where address exists on record; otherwise, the location of the supplier. (2) Sec 12(3) (Immovable Property related): Location where the property/vessel is situated (or intended). If situated outside India, it is the location of the recipient. (3) Sec 12(4) (Performance-based - catering, fitness, beauty): Location where actually performed. (4) Sec 12(5) (Training): B2B is the location of the registered recipient. B2C is where performed. (5) Sec 12(6) (Admission to event/park): Location where event is held or park is located. (6) Sec 12(7) (Organizing event): B2B is the location of the registered recipient. B2C is where event is held (if held outside India, place of supply is location of the recipient). (7) Sec 12(8) (Goods Transport): B2B is location of recipient. B2C is where handed over.',
          exception: 'For passenger transportation under Sec 12(9), B2B is the location of the registered recipient. B2C is where the passenger embarks for a continuous journey. Sometime return journey is bought together; but it is statutorily treated as a completely separate journey.',
          example: 'A registered company in Mumbai hires an event planner from Delhi to host an international symposium in Bangalore. Since the recipient is registered B2B, the place of supply of the service is Mumbai (registered recipient location), not Bangalore.'
        },
        {
          title: 'Place of Supply of Services (Cross-Border) [Section 13 of IGST Act]',
          description: 'Applies when either supplier or recipient is outside India: (1) Sec 13(2) (Default): Location of the recipient of services. If not available, location of the supplier. (2) Sec 13(3)(a) (Services on goods): Location where services are performed. (3) Sec 13(3)(b) (Services to physical presence of individual): Location where performed. (4) Sec 13(4) (Immovable property): Location of the property. (5) Sec 13(5) (Event admission/org): Location where held. (6) Sec 13(8) (Supplier location): Services supplied by a bank to account holders; Intermediary services; and hiring of transport means (excluding aircrafts/vessels) up to 1 month.',
          exception: 'Sec 13(3)(a) contains an exception: If goods are temporarily imported into India solely for repairs, testing, or other treatment/process, and are subsequently exported without being put to any domestic use in India, the place of supply is determined by the default Sec 13(2) rule (location of the overseas recipient), making it a tax-free export.',
          example: 'XYZ Ltd in Chennai ships a defective drilling machine to Singapore for calibration. This falls u/s 13(3)(a). If the calibration is instead done in India on temporarily imported parts which are shipped back to Singapore, the place of supply is Singapore u/s 13(2), escaping legislation.'
        },
        {
          title: 'Special OIDAR Services and Notified Rules [Section 13(12) & 13(13)]',
          description: 'Special provisions: (1) Sec 13(12) (OIDAR): Place of supply is the location of the recipient. A recipient is deemed in taxable territory (India) if any 2 of key conditions are met: Indian billing address, Indian IP address, Indian bank account, Indian credit/debit card, Indian SIM country code, or fixed land line. (2) Sec 13(13) (Effective Use): Governs notified services to prevent multi-taxation (e.g. B2B R&D in pharma, B2B MRO services of aircrafts, engines, and vessels). The place of supply is deemed to be the location of the recipient of services.',
          exception: 'Under GSTR-1/1A guidelines, the supplier of online digital services, OIDAR services, or online money gaming to unregistered recipients in India must mandatorily record the recipient State on tax invoices to determine the Place of Supply u/s 12(2)(b) / 13(12).',
          example: 'A student in Chennai buys a monthly subscription to an American cloud-based e-learning system. Payment is settled using an Indian credit card with a Chennai billing address. Since 2 conditions are met, the recipient is in India u/s 13(12), and the POS is Chennai.'
        }
      ],
      visualBreakdown: {
        title: 'GST Place of Supply Proxy Rules Map',
        type: 'table',
        headers: ['Proxy Code & Section', 'Type of Transaction', 'B2B GST Treatment (Registered)', 'B2C GST Treatment (Unregistered)'],
        rows: [
          ['Sec 10(1)(a) IGST', 'Goods involving movement', 'Where movement terminates', 'Where movement terminates'],
          ['Sec 10(1)(b) IGST', 'Goods via Bill-to-Ship-to', 'Principal Place of Business of 3rd person', 'Principal Place of Business of 3rd person'],
          ['Sec 12(2) IGST', 'Default Services (Both in India)', 'Location of Registered Recipient', 'Address on record exists? Recipient location : Supplier location'],
          ['Sec 12(3) IGST', 'Immovable Property (Both in India)', 'Where property is situated / intended', 'Where property is situated / intended'],
          ['Sec 12(4) IGST', 'Performance services (catering, etc.)', 'Where actually performed', 'Where actually performed'],
          ['Sec 12(8) IGST', 'Goods Transport / Courier', 'Location of Registered Recipient', 'Location where goods are handed over'],
          ['Sec 13(2) IGST', 'Default Services (Cross-border)', 'Location of Recipient', 'Location of Recipient (Default u/s 13)'],
          ['Sec 13(3)(a) IGST', 'Services on Goods (Cross-border)', 'Where performed (or Recipient u/s 13(2) if temp repairs export)', 'Where performed'],
          ['Sec 13(8)(b) IGST', 'Intermediary Services', 'Location of Intermediary (Supplier)', 'Location of Intermediary (Supplier)']
        ]
      }
    },
    {
      chapterName: 'Exemptions from GST',
      keyPrinciples: [
        {
          title: 'Power to Grant Exemption [Section 11 of CGST Act / Section 6 of IGST Act]',
          description: 'The Government is empowered, on the recommendations of the GST Council, to grant exemptions from tax. Under Sec 11(1), exemptions can be granted on goods and/or services of any specified description. They can be absolute (unconditional and applicable to all) or subject to conditions. Under Sec 11(2), special exemptions can be granted by special order in public interest under exceptional circumstances. If an absolute exemption is granted, the taxpayer is prohibited from paying tax at their own choice.',
          exception: 'Under Sec 11(3), the Government may insert an explanation in any notification within 1 year of issue, which will have retrospective effect from when the main notification was first issued.',
          example: 'If a notification absolutely exempts fruit sorting services, a sorting service provider cannot elect to charge 18% GST and pass down ITC. They must comply with the exemption.'
        },
        {
          title: 'Exemptions of Agriculture Services',
          description: 'Services directly related to agricultural operations are exempt to support the primary sector: (1) All culturing, harvesting, picking, packing, and sorting services at agricultural lands. (2) Supply of farm labor. (3) Renting or leasing or hiring of agro machinery, vacant land for rearing of animals or crops. (4) Agricultural extension services. (5) Core warehousing, loading, unloading, storage, or packing of agricultural produce (such as food grains, pulses, paddy, fruits, and vegetables). (6) Services by an agricultural produce marketing committee (APMC) or commission agent fees for purchase/sale of produce.',
          exception: 'Processing of agricultural produce (like milling paddy into rice, roasting tea leaves, manufacturing potato chips) that alters its essential micro-character is NOT agricultural produce, and such services are fully taxable.',
          example: 'Custom milling of paddy into rice by a rice mill is NOT agricultural produce, as milling is carried out post-harvest, changing the character; hence, milling fees attract 18% GST.'
        },
        {
          title: 'Exemptions of Health Care Services',
          description: 'Exemptions are granted to essential human health services: (1) Diagnostics, treatment, or care for illness, injury, deformity, or pregnancy by a clinical establishment, an authorized medical practitioner (licensed doctors, modern or traditional systems like AYUSH), or paramedics. (2) Services by a veterinary clinic for treatment of animals or birds. (3) Transportation of patients in an ambulance.',
          exception: 'Hair transplants, cosmetic or plastic surgery are taxable, unless undertaken to restore or reconstruct anatomy damaged by congenital defects, developmental abnormalities, or trauma. Renting of hospital rooms exceeding ₹5,000 per day is taxable (no ITC).',
          example: 'A patient undergoes a reconstructive nose surgery after a car accident. This is exempt from GST as it restores damaged anatomy. If the person has cosmetic rhinoplasty to change nose shape entirely for aesthetic reasons, it is taxable.'
        },
        {
          title: 'Exemptions of Educational Services',
          description: 'Exemptions of services provided: (A) BY an educational institution (preschool, school, recognized qualification, approved vocational course) to its students, faculty, and staff. (B) TO an educational institution: (1) Transportation of students/faculty. (2) Catering/mid-day meals. (3) Security, cleaning, housekeeping. (4) Admission or conduct of examination (applicable to ALL educational institutions).',
          exception: 'Services in items (1), (2), and (3) are ONLY exempt if provided to a preschool or secondary school (up to Grade 12). If provided to higher colleges or vocational institutes, they are fully taxable.',
          example: 'ABC Rent-a-Bus provides daily student transportation services to a recognized boarding school and also to a postgraduate engineering college. The transportation to school is exempt, whereas transportation to the college attracts 18% GST.'
        },
        {
          title: 'Renting & Financial Services Exemptions',
          description: 'Key public sector exemptions: (1) Renting of residential dwelling for use as residence for an unregistered tenant (taxable under RCM if tenant is registered u/s 9(3)). (2) Services by RBI. (3) Services of extending deposits, loans or advances where the consideration is represented by way of interest or discount. (4) Inter-bank foreign currency purchase/sale. (5) Services of public transport (buses, metro, local trains, tolls, tolls annuity).',
          exception: 'Exemption for hotel or club lodging with room rent <= ₹1,000 per day has been officially WITHDRAWN. All commercial lodging room charges are now taxable under standard GST tiers. Salary-advances processing charges or credit card interest are fully taxable.',
          example: 'A bank charges short-term interest of ₹50,000 on a loan, and processing fees of ₹2,500. The interest is exempt from GST, but the processing fees are subject to 18% GST.'
        }
      ],
      visualBreakdown: {
        title: 'GST Exemptions Verification Path',
        type: 'flow',
        content: `
               Determine Category of Supply of Service
                                |
             +------------------+------------------+
             |                                     |
         Agriculture                        Human Healthcare
             |                                     |
    Is it raw agricultural produce?        Is it clinical diagnostics/care?
         |                                     |
    +----+----+                             +----+----+
    |         |                             |         |
   YES        NO                           YES        NO (e.g. cosmetic surgery,
    |         |                             |             room rent > ₹5,000/day)
  [EXEMPT] [TAXABLE]                     [EXEMPT]         |
                                                          v
                                                      [TAXABLE]
        `
      }
    },
    {
      chapterName: 'Time of Supply',
      keyPrinciples: [
        {
          title: 'Time of Supply of Goods under Forward Charge [Section 12(2)]',
          description: 'Under Sec 12(2) under normal charge, TOS is the EARLIEST of: (1) Date of issue of invoice by the supplier, or the last date on which invoice is required to be issued u/s 31(1). (Section 31(1) requires invoice to be issued before or at the time of removal of goods for supply.) (2) Date on which the supplier receives the payment u/s 12(2)(b).',
          exception: 'Notification No. 66/2017-CT exempts ALL registered suppliers of goods (except composition) from paying GST on advances. So, payment date is ignored for goods under forward charge, and TOS is strictly the invoice date/due date.',
          example: 'An order for widgets is made on Oct 10, advance received Oct 15, goods removed and invoice issued Oct 22. By virtue of Notif 66/2017, the payment of Oct 15 is ignored. TOS is Oct 22.'
        },
        {
          title: 'Time of Supply of Services under Forward Charge [Section 13(2)]',
          description: 'Under Sec 13(2) under normal charge, TOS is the EARLIEST of: (1) If invoice is issued within 30 days of supply completion (45 days for banks/FIs): (a) Date of invoice, or (b) Date of payment. (2) If invoice is NOT issued within 30/45 days of completion: (a) Date of completion of service, or (b) Date of payment. (3) If both (1) and (2) do not apply: Date on which recipient shows receipt of services in books.',
          exception: 'Unlike goods, there is NO exemption on service advances. Tax on advance payments received for services must be accounted for on the exact date of physical or electronic receipt.',
          example: 'Consultancy completed Oct 10. Invoice of ₹5,00,000 issued Nov 15 (beyond 30 days). Payment received Nov 20. Since invoice is late, TOS is completion date (Oct 10), not invoice date.'
        },
        {
          title: 'Time of Supply under Reverse Charge Mechanism [Section 12(3) & 13(3)]',
          description: 'When tax is paid by recipient under RCM: (A) For Goods u/s 12(3), TOS is earliest of: (1) Date of receipt of goods. (2) Date of payment (debited from bank or recorded in books, whichever is earlier). (3) The day immediately following 30 days from the invoice issue date. (B) For Services u/s 13(3), TOS is earliest of: (1) Date of payment. (2) The day immediately following 60 days from the invoice issue date.',
          exception: 'For import of services from associated enterprises outside India, TOS is the date of entry of service in the books of the recipient, or the date of payment, whichever is earlier.',
          example: 'A registered company receives legal services from an advocate who invoices them on Oct 1. Payment is made on Dec 10. Since 60 days from invoice is Nov 30, the TOS under RCM is Nov 30 (earliest of payment Dec 10 or 61st day Nov 30).'
        },
        {
          title: 'Time of Supply of Vouchers [Section 12(4) & 13(4)]',
          description: 'If vouchers are issued for goods/services, TOS is: (1) Date of issue of voucher, if the supply of goods or services is completely identifiable at that exact point. (2) Date of redemption of voucher, in all other cases of mixed options.',
          exception: 'Vouchers u/s 12(4)/13(4) exclude custom commercial loyalty points earned directly on past purchase checkouts, which represent a discount rather than a voucher instrument.',
          example: 'A store issues a coupon specifically for "Brand X Jeans". Since the supply is identifiable at issue, TOS is voucher issue date. If the voucher is for "any clothing item", TOS is the redemption date.'
        }
      ],
      visualBreakdown: {
        title: 'GST Time of Supply Rules Comparison',
        type: 'table',
        headers: ['Method of Supply', 'Invoice Issued timely?', 'TOS of Goods (Forward Charge)', 'TOS of Services (Forward Charge)'],
        rows: [
          ['Forward Charge', 'YES (u/s 31 limits)', 'Invoice Date (Advance is exempt)', 'Earliest of: Invoice Date OR Payment Date'],
          ['Forward Charge', 'NO (Delayed u/s 31)', 'Due Date of Invoice', 'Earliest of: Completion Date OR Payment Date'],
          ['Reverse Charge', 'Not Applicable', 'Earliest of: Receipt of Goods, Payment, or 31st day from Invoice', 'Earliest of: Payment OR 61st day from Invoice'],
          ['Specific Voucher', 'Not Applicable', 'Voucher Issue Date', 'Voucher Issue Date'],
          ['General Voucher', 'Not Applicable', 'Voucher Redemption Date', 'Voucher Redemption Date']
        ]
      }
    },
    {
      chapterName: 'Value of Supply',
      keyPrinciples: [
        {
          title: 'Transaction Value as Base [Section 15(1)]',
          description: 'The value of supply of goods or services is the transaction value, which is the price actually paid or payable for said supply. This base value applies only if two criteria are met: (1) The supplier and recipient are not related persons (u/s 15 explanations). (2) Price is the sole consideration for the transaction.',
          exception: 'If parties are related, or price is not sole consideration, transaction value u/s 15(1) is rejected, and Value is determined using GST Valuation Rules (Rules 27 to 35).',
          example: 'A manufacturer sells tools to an unrelated wholesale dealer for ₹1,20,000. Price is the sole consideration. The taxable value of supply is ₹1,20,000.'
        },
        {
          title: 'Inclusions in Value of Supply [Section 15(2)]',
          description: 'The statutory inclusions that must be added to the price if not already included: (a) Any taxes, duties, cesses, fees, or charges levied under any law other than GST and TCS u/s Income Tax. (b) Any amount that the supplier is liable to pay but has been paid by the recipient on behalf of the supplier. (c) Incidental expenses charged by the supplier (packing, commission, designer charges, inspection fee, weighing). (d) Interest, late fee, or penalty for delayed payment of consideration. (e) Subsidies directly linked to the price, EXCEPT subsidies provided by the Central and State Governments.',
          exception: 'Interest, late fee, or penalty u/s 15(2)(d) is only taxable when actually received by the supplier. Such receipt is deemed to be inclusive of GST, so it must be back-calculated.',
          example: 'A supplier sells goods for ₹1,00,000, and packs them with custom boxes charging ₹5,00, and municipal tax of ₹2,000 is charged on invoice. Total taxable value u/s 15(2) is ₹1,07,000.'
        },
        {
          title: 'Exclusions of Discounts [Section 15(3)]',
          description: 'Discounts are excluded from the value of supply if they fall u/s 15(3): (a) Discount given BEFORE or AT the time of supply, provided it is duly recorded in the invoice. (b) Discount given AFTER the supply (post-supply discounts) if: (i) such discount is established in an agreement entered into at or before the time of such supply, (ii) it is linked to specific invoices, and (iii) proportionate ITC is reversed by the recipient.',
          exception: 'Secondary discounts (surprise discounts given after sale, not established in any pre-sale agreement) or discounts where recipient fails to reverse ITC cannot be excluded from the Value of Supply.',
          example: 'A manufacturer grants a year-end volume discount of ₹10,000 to a dealer as per a pre-sale agreement. Once the dealer reverses the matching ITC, the manufacturer gets a refund of GST on that discount.'
        }
      ],
      visualBreakdown: {
        title: 'GST Value of Supply Formula',
        type: 'table',
        headers: ['Inclusions / Exclusions', 'Category Section', 'Included in Taxable Value?'],
        rows: [
          ['Price paid or payable u/s 15(1)', 'Sole Consideration Base', 'YES (Starting Base Line)'],
          ['Non-GST Taxes, Duties, Cesses, Fees', 'Sec 15(2)(a)', 'YES (Must be added if not included)'],
          ['Receipt-paid Supplier Liabilities', 'Sec 15(2)(b)', 'YES (Must be added)'],
          ['Incidental Charges (Packing, Commission)', 'Sec 15(2)(c)', 'YES (Must be added)'],
          ['Delayed Payment Interest / Penalty', 'Sec 15(2)(d)', 'YES (Taxable only on actual receipt; inclusive of tax)'],
          ['Private Subsidies linked to price', 'Sec 15(2)(e)', 'YES (Must be added)'],
          ['Central / State Govt Subsidies', 'Sec 15(2)(e) Excl', 'NO (Deducted if included initially)'],
          ['Pre-Supply Discount in Invoice', 'Sec 15(3)(a)', 'NO (Exclude or deduct from base)'],
          ['Post-Supply Discount with agreement/ITC reversal', 'Sec 15(3)(b)', 'NO (Exclude or deduct via credit notes)']
        ]
      }
    },
    {
      chapterName: 'Input Tax Credit',
      keyPrinciples: [
        {
          title: 'Eligibility & Basic Conditions for Availing ITC [Section 16]',
          description: 'Registered persons can take credit of input tax charged on supplies used or intended to be used in the course or furtherance of business u/s 16(1). Section 16(2) mandates four absolute conditions for availing ITC: (a) Possession of a valid tax invoice, debit note, or bill of entry. (b) Requisites u/s 16(2)(aa): invoice/debit note is uploaded by the supplier in GSTR-1 and appears in GSTR-2B of the recipient. (c) Actual receipt of the goods or services (or deemed receipt under Bill-to-Ship-to model). (d) Actual payment of matching tax to the Government by the supplier. (e) The recipient has filed the return u/s 39 (Form GSTR-3B).',
          exception: 'Under Section 16(2)(ba), ITC won\'t be available if matching supplier details are restricted under Section 38. First proviso: If goods are received in lots or installments, the recipient can only take credit upon receipt of the last lot. Second proviso: Recipient must pay the supplier the value of supply plus tax within 180 days from invoice date. Otherwise, they must reverse the ITC with interest u/s 50, which can be re-availed subsequently upon actual payment without any time limit.',
          example: 'ABC Ltd purchases raw materials on 10-May. The material is delivered in 3 separate monthly lots (Lot 1 in June, Lot 2 in July, Lot 3 in August). Even if ABC Ltd received the invoice and paid the tax in May, it can only claim the entire ITC in August (upon receipt of Lot 3).'
        },
        {
          title: 'Restrictions on Claiming Depreciation vs. ITC & Time Limit [Section 16(3) & 16(4)]',
          description: 'Dual tax benefits are strictly barred u/s 16(3): if a registered person claims depreciation on the tax component of capital goods under the Income-tax Act, 1961, Input Tax Credit on that tax component is disallowed under GST. Section 16(4) prescribes a strict time limit to claim ITC: no credit can be taken for any invoice or debit note after the 30th of November following the end of the financial year to which the invoice/debit note pertains, or the date of filing the relevant annual return, whichever is earlier.',
          exception: 'The statutory time limit u/s 16(4) does NOT apply to cases of re-availing credit that was previously reversed due to non-payment within 180 days.',
          example: 'Alpha Co buys a computer for ₹59,000 (including ₹9,000 GST). If Alpha Co capitalizes the full ₹59,000 in its books and claims tax depreciation on it, it cannot claim ₹9,000 as ITC. It must capitalize ₹50,000 and claim ITC of ₹9,000 to get both benefits.'
        },
        {
          title: 'Apportionment of Credit & Blocked Credits [Section 17]',
          description: 'Under Section 17, when inputs, input services, or capital goods are used partly for business and partly for other purposes, or partly for taxable (including zero-rated) and partly for exempt supplies, credit is restricted proportionately u/s 17(1) & 17(2). Under Section 17(5), ITC is specifically BLOCKED (regardless of business usage) on: (a) Motor vehicles (seating capacity <= 13), vessels, and aircraft (exempt if used for further supply, passenger transport, or driving training). (b) Food, beverages, outdoor catering, beauty treatment, health services, life/health insurance (exempt if obligatory for employer under any law, or used for matching outbound supplies). (c) Works contract services for construction of immovable property (except plant & machinery, or further works contracts). (d) Self-constructed immovable property (goods/services for own-use construction). (e) Goods lost, stolen, destroyed, written off, or given as gift/free samples.',
          exception: 'Section 17(4) grants banking companies/FIs/NBFCs a simplified option: either comply with standard dual apportionment (Rule 42/43) monthly, or choose to avail 50% eligible ITC monthly and lapse the remaining 50% (option, once exercised, cannot be altered during the FY).',
          example: 'A pharmaceutical company purchases a luxury passenger car (5-seater) for the official travel of its CEO. Under Section 17(5)(a), since the seating capacity is <= 13 and it is not used for any of the exempted purposes, the entire input tax credit on the car is strictly blocked.'
        }
      ],
      visualBreakdown: {
        title: 'GST Input Tax Credit Rules Pathway',
        type: 'flow',
        content: `
                 Are the goods/services used for Business?
                                   |
                     +-------------+-------------+
                     |                           |
                    YES                          NO
                     |                           |
                     v                           v
          Are they on Blocked List u/s 17(5)? [No ITC Allowed]
            /             \\
          YES              NO
          /                 \\
    [No ITC Allowed]    Do you hold valid Tax Invoice/debit note?
                           /             \\
                         YES              NO
                         /                 \\
                        v                   v
            Is tax paid to Govt &           [No ITC Allowed]
            return filed by matching recipient?
                     /         \\
                   YES          NO
                   /             \\
                  v               v
            [ELIGIBLE ITC!]  [No ITC Allowed]
        `
      }
    },
    {
      chapterName: 'Registration',
      keyPrinciples: [
        {
          title: 'Liability and Thresholds for Registration [Section 22]',
          description: 'Every supplier must register in the State/UT from where they make taxable supplies, if their aggregate turnover in a FY exceeds specified thresholds u/s 22(1). The thresholds are: (1) ₹10 Lakh for Special Category States of Mizoram, Tripura, Manipur, and Nagaland. (2) ₹20 Lakh for States of Arunachal Pradesh, Meghalaya, Sikkim, Uttarakhand, Puducherry, and Telangana. (3) ₹40 Lakh for suppliers engaged exclusively in the intra-State supply of goods in J&K, Assam, Himachal Pradesh, and all other remaining States (limit is reduced to ₹20L if they supply any services or are engaged in making taxable supplies of pan masala, tobacco, aerated waters, or coercive items like bricks/tiles).',
          exception: 'Under Section 22(3) & 22(4), when a business is transferred as a going concern, or transferred pursuant to a court-approved amalgamation/demerger, the transferee/successor becomes mandatorily liable to register from the date of such transfer or certificate of incorporation.',
          example: 'Rajesh of Assam is exclusively engaged in the intra-State sale of garments. His aggregate turnover is ₹35 Lakh. Since Assam is a general state with a ₹40 Lakh threshold for exclusive goods suppliers, Rajesh is not liable to register. If he starts providing tailoring services worth ₹1 Lakh, his threshold drops to ₹20 Lakh, and since ₹36 Lakh > ₹20 Lakh, he is immediately liable to register.'
        },
        {
          title: 'Persons Not Liable for Registration [Section 23]',
          description: 'Section 23 lists specific categories who are completely freed from GST registration obligations regardless of external turnover limits: (1) Exclusive Exempt Supplies - Persons engaged exclusively in the business of supplying goods or services or both that are not liable to tax or wholly exempt under GST. (2) Agriculturists - An individual agriculturist, to the extent of supply of produce out of cultivation of land. (3) Outward RCM Suppliers - Persons who are only engaged in making supplies of taxable goods or services, the entire tax on which is liable to be paid on reverse charge basis u/s 9(3) by the recipient.',
          exception: 'Under Section 23(2), the Government has explicitly exempted inter-State service providers and handicraft goods suppliers whose aggregate turnover is within ₹20 Lakh (₹10 Lakh in Special Category States).',
          example: 'An agriculturist from Bihar sells agricultural raw farm sugarcane of ₹80 Lakh cultivated on his own land. Simultaneously, he makes a local taxable machinery transport service which has a value of ₹5,000. Because he is no longer EXCLUSIVELY engaged in agricultural supplies, Section 23 exemption is withdrawn, and he must evaluate Section 22 thresholds.'
        },
        {
          title: 'Compulsory Registration in Certain Cases [Section 24]',
          description: 'Section 24 overrides Section 22(1) and mandates registration regardless of the threshold limit (i.e. starting from ₹1 of taxable supply) for: (1) Inter-State Taxable Suppliers of goods (inter-state service providers are exempt up to ₹20L/₹10L). (2) Casual Taxable Persons (CTPs) making taxable supplies. (3) Reverse Charge Liabilities - Persons who are required to pay tax under Reverse Charge (RCM) u/s 9(3) or 9(4). (4) Non-Resident Taxable Persons (NRTPs). (5) TDS Deductors - Persons required to deduct tax under Section 51, whether or not separately registered under this Act. (6) Agents - Persons who make taxable supplies of goods or services or both on behalf of other taxable persons whether as an agent u/s 24(vii) or otherwise. (7) Input Service Distributors (ISDs). (8) TCS Collectors - Every Electronic Commerce Operator (ECO) who is required to collect tax at source under Section 52. (9) ECO suppliers - Persons supplying goods or services or both through an ECO who is required to collect TCS u/s 52 (except suppliers of services up to ₹20L/₹10L). (10) OIDAR Suppliers - Persons supplying online information and database access or retrieval services from a place outside India to a non-taxable online recipient u/s 24(xi). (11) Online Money Gaming Suppliers - Foreign suppliers supplying online money gaming from a place outside India to a recipient in India.',
          exception: 'Suppliers making inter-State taxable supplies of specified handicraft goods up to ₹20 Lakh are exempted from compulsory registration u/s 24, provided they hold a PAN and generate e-way bills for their transits.',
          example: 'A partnership hub in Karnataka buys consultant services worth ₹1,20,000 from a supplier in the US, which represents an import of services. Under Reverse Charge Mechanism, the tax is payable by the recipient. Thus, the firm must take compulsory registration u/s 24(3) with zero turnover limitations.'
        },
        {
          title: 'Procedural Pipeline of Registration [Section 25]',
          description: 'Every person liable to register must submit their application in each State/UT where they are liable, within 30 days of becoming liable u/s 25(1). Casual taxables and NRTPs must file at least 5 days prior to commencing business. The step-by-step workflow is: (1) Part-A Registry - Submit PAN, Email, and Mobile No in Form GST REG-01 Part-A on the GST Common Portal, verified via OTP. (2) TRN Generation - Portal validates credentials against CBDT database and issues a Temporary Reference Number. (3) Part-B Registry - Submit business details, principal/additional place of business, and constitution, and opt-in/opt-out for Aadhaar. (4) Aadhaar Authentication - Complete authentication via Aadhaar biometric/OTP link. (5) Scrutiny & Order - Proper Officer inspects the documents. If complete and Aadhaar succeeds, registration is approved in Form GST REG-06 within 7 working days. If Aadhaar fails or not opted, approval is extended to 30 working days. (6) Show Cause Notice - If deficient, officer issues SCN in Form GST REG-03. (7) Applicant Reply - Replied in Form GST REG-04 within 7 working days u/r 9(2). (8) Final Decision - Proper Officer approves REG-06 or rejects in Form GST REG-05 within 7 working days.',
          exception: 'Voluntary registration is fully permitted under Section 25(3). Once registered, the taxpayer becomes liable to comply with all GST filings and output tax rates regardless of turnover size.',
          example: 'An IT company starts business on 1-August. Its aggregate turnover exceeds ₹20 Lakh on 15-September (becoming liable). It must apply for registration u/s 25(1) on or before 15-October (30 days) to ensure registration is effective from the liability date (15-September).'
        },
        {
          title: 'Aadhaar Authentication & Mandate Protocols [Rule 10B]',
          description: 'Every applicant for registration must undergo Aadhaar authentication to assert physical KYC identity: (1) Failure to opt or authenticate results in mandatory physical biometric-based Aadhaar verification with photographs at a notified GST Suvidha Kendra (GSK). (2) The timeline for automated grant is extended from 7 working days to 30 calendar days when Aadhaar verification is failed, not done, or not opted. (3) Under Rule 10B, Aadhaar authentication is a strict mandatory prerequisite for: filing revocation of cancelled registrations u/r 23; claiming refunds in Form GST RFD-01 u/s 54; or seeking refund of IGST on exports u/r 96.',
          exception: 'Section 25(6D) exempts non-citizens of India, central or state government departments, local authorities, statutory bodies, public sector undertakings, and custom exempted groups from mandatory Aadhaar.',
          example: 'An applicant registers for GST but opts out of Aadhaar authentication. Their application is automatically diverted to the 30-day extended verification path. They must complete biometric verification with photographs at their nearest GSK before the Proper Officer grants the registration.'
        },
        {
          title: 'Physical Verification of Business Premises [Rule 25]',
          description: 'Rule 25 empowers the Proper Officer to conduct physical site inspections of declared premises under specific risk triggers: (1) Trigger Scenarios - Physical verification is ordered if the applicant has failed or not opted for Aadhaar authentication, or is flagged as a high-risk entity based on automated data analytics. (2) Presence of Applicant - Physical check is carried out in the presence of the applicant (or even without their presence in high-risk profiling/fraud prevention cases). (3) Reporting Timelines - After inspecting the warehouse/premises, the proper officer must draft a verification report, upload GPS-tagged photographs, and file the report on the portal in Form GST REG-30 within 15 working days following the date of verification.',
          exception: 'Where a physical verification of place of business has been conducted, the Proper Officer can skip onsite visits if they obtain satisfactory alternative digital KYC documents and verified digital proof uploads.',
          example: 'A Proper Officer receives a high-risk flag on a newly applied metallic scrap trader who has failed Aadhaar verification. The officer visits the yard, takes photos of the office board with latitude/longitude GPS stamps, and uploads the inspection file REG-30 in 10 working days, confirming the business exists.'
        },
        {
          title: 'Furnishing Bank Account Details [Rule 10A]',
          description: 'Rule 10A mandates physical proof of a registered bank account under the PAN of the GSTIN to check dummy registrations: (1) Filing Window - The registered person must submit active bank details on the GST portal within 30 days from the date of grant of registration, or before filing GSTR-1/IFF, whichever is earlier. (2) Automated Enforcement - Failure to upload details results in immediate suspension of registration u/r 21A, blocks GSTR-1/IFF filing, and auto-generates a show cause notice in Form GST REG-31.',
          exception: 'This rule does not apply to TDS deductors (Section 51), TCS collectors (Section 52), or persons registered under Section 51/52 who do not make taxable supplies.',
          example: 'A designer gets his GSTIN certificate on 5-May. He wants to file his GSTR-1 on 11-June. He must upload his commercial bank details on the portal on or before 11-June, else the portal will freeze his invoices dashboard.'
        },
        {
          title: 'Deemed Registration under GST [Section 26]',
          description: 'Section 26 highlights federal-state harmonization for single-window registrations: (1) Deemed Approval u/s 26(1) - The grant of registration or a Unique Identity Number (UIN) under the State GST (SGST) Act or Union Territory GST (UTGST) Act is automatically deemed to be a concurrent grant under the CGST Act. (2) Deemed Rejection u/s 26(2) - Any rejection of an application for registration or UIN under SGST / UTGST Act is deemed to be a concurrent rejection of the application under the CGST Act.',
          exception: 'UIN is granted only to specialized entities like UN bodies, consulates, and embassies, acting as a tax refund identifier, which is also covered under deemed provisions.',
          example: 'A shop in Puducherry is approved for UTGST registration by Puducherry local tax authorities. By virtue of Section 26(1), the firm is deemed central CGST registered instantly, without needing a separate union application.'
        },
        {
          title: 'Special Rules for Casual Taxable Persons (CTPs) and NRTPs [Section 27]',
          description: 'Section 27 outlines unique statutory constraints for Casual Taxable Persons (CTPs) and Non-Resident Taxable Persons (NRTPs) who make temporary supplies without a fixed place of business in India/State: (1) Prior Application - Must apply for registration at least 5 days prior to the commencement of business. (2) Temporary Validity - Registration is valid for the period specified in the registration application, or 90 days from the effective date of registration, whichever is earlier. (3) Valid Extensions - The proper officer may extend the period of validity by an additional period not exceeding 90 days on sufficient cause. (4) Advance Tax Deposit - Must make an advance deposit of tax of an amount equivalent to the estimated tax liability for the period for which registration is sought before the certificate is granted.',
          exception: 'CTPs are exempt from compulsory registration u/s 24 if they make inter-State taxable supplies of notified handicraft goods with aggregate turnover up to ₹20 Lakh (₹10 Lakh in Special States).',
          example: 'A foreign diamonds dealer from Antwerp has no office in India but organizes an exhibition in Mumbai for 10 days. They must register as an NRTP 5 days before, estimate their outward GST liability, pay that estimated sum as an advance tax deposit, and secure a temporary GSTIN.'
        },
        {
          title: 'Amendment of Registration Protocols [Section 28]',
          description: 'Section 28 regulates changes to registration parameters, dividing updates into Core and Non-Core classes: (1) Core Fields - Changes in Legal Name, Principal or Additional Place of Business, and constitution of partners/directors/trustees. These require approval by the Proper Officer, who must approve or reject within 15 working days. (2) Non-Core Fields - All other fields like contact numbers, website URLs, and minor details. These are auto-approved instantly on the GST common portal without officer intervention.',
          exception: 'If there is a change in the Permanent Account Number (PAN), the registration cannot be amended u/s 28. The taxpayer must apply for a fresh registration u/s 25 to obtain a new GSTIN.',
          example: 'A medical trust changes its principal place of business. It submits a Core Field amendment along with its new registered rent files. The proper officer must process, scrutinize, and issue an order of approval or rejection within 15 working days.'
        },
        {
          title: 'Cancellation and Suspension of Registration [Section 29]',
          description: 'Section 29 handles the legal termination of a active registration: (1) Cancellation reasons - Applied by the taxpayer in cases of business closure, transfer of business (merger/demerger), change in constitution (proprietorship to company), or falling below liability thresholds. (2) Suo-Motu Cancellation - Decreed by Proper Officer if: composition dealer defaults on returns for 3 consecutive tax periods; regular taxpayer defaults on GSTR filings for 6 continuous months (or specified periods); registration was taken by fraud/misstatement; or business was not started within 6 months of voluntary registration. (3) Suspensions u/r 21A - Registration is suspended during the pendency of cancellation proceedings. A suspended firm cannot issue tax invoices, collect tax, file returns, or claim refunds.',
          exception: 'The cancellation of registration does not release any taxpayer from their liabilities or outstanding tax/interest/penalty obligations accrued prior to the date of cancellation.',
          example: 'A taxpayer closes down his store on 31-December and files for cancellation. His registration status is updated to "Suspended" u/r 21A on the portal immediately. This exempts him from filing standard monthly returns while the officer reviews outstanding liabilities.'
        },
        {
          title: 'Revocation of Cancellation of Registration [Section 30 / Rule 23]',
          description: 'Section 30 provides a pathway for taxpayers to restore their cancelled registration u/r 23: (1) Filing Window - Taxpayers may apply for revocation of cancellation within 90 days from the date of service of the cancellation order. Commissioner (or Proper Officer) may extend this by up to a further 90 days on showing sufficient cause, making the overall window up to 180 days. (2) Procedure & Form - Application is submitted electronically u/r 23 in Form GST REG-21. (3) Non-Filing Defaults Compliance - If registration was cancelled suo-motu due to failure to file returns, no revocation application is permitted unless all outstanding returns are filed, and along with full payment of due tax, interest, and penalties. (4) Aadhaar Authentication - The applicant MUST successfully undergo mandatory Aadhaar authentication u/r 10B before filing the application for revocation.',
          exception: 'No application for revocation u/s 30 shall be filed if the registration has been cancelled voluntarily by the taxpayer, unless there is a material error in processing the cancellation.',
          example: 'A regular retailer’s GSTIN was cancelled suo-motu on 10-August due to 6 months of filing inactivity. He files all pending returns on 5-September, pays 18% interest on delayed output tax plus late fees, completes Aadhaar u/r 10B, and submits Form GST REG-21 on 8-September. The proper officer must revoke the cancellation in Form REG-22 within 30 days.'
        },
        {
          title: 'Simplified Foreign Online Money Gaming Registration [Rule 14A]',
          description: 'Rule 14A is a recent, crucial amendment dealing with foreign suppliers of online money gaming: (1) Registration Mandate - Every person supplying online money gaming from a place outside India to a recipient in India is compulsorily registrable. (2) Simplified Application - The supplier must submit an application electronically using Form GST REG-10 on the common portal. (3) Local Representative - The non-resident supplier must appoint a single authorized representative or agent in India to file returns and pay the applicable tax on their behalf.',
          exception: 'If the foreign provider fails to obtain registration or pay the applicable GST u/r 14A, public access to their gaming application can be blocked by the government under Section 69A of the IT Act.',
          example: 'A premium gaming app based in Malta offers virtual sports cash betting in India. Under Rule 14A, they must file Form GST REG-10 on the GST portal and appoint a legal tax representative in Noida to file monthly returns and settle IGST.'
        }
      ],
      visualBreakdown: {
        title: 'GST Aadhaar Authentication & Verification pathways',
        type: 'flow'
      }
    },
    {
      chapterName: 'Tax Invoice, Credit & Debit Notes',
      keyPrinciples: [
        {
          title: 'Statutory Invoicing Timelines (Goods vs. Services) [Section 31]',
          description: 'Section 31 regulates the mandatory issuance of invoices: (A) For taxable goods u/s 31(1): must be issued before or at the time of: (a) removal of goods (where supply involves movement), or (b) delivery/making available to the recipient (in other cases). (B) For taxable services u/s 31(2): must be issued before or after the provision of service, but within a mandatory timeline of 30 days (45 days for banking/FIs/ NBFCs/ insurance agencies). (C) In case of continuous supply: (a) for Goods u/s 31(4): before or at each statement issuance or payment receipt; (b) for Services u/s 31(5): on/before the due date (if ascertainable from contract), or before/at receipt of payment (if not ascertainable).',
          exception: 'Under Section 31(7), if goods are sent or taken on approval for sale or return, the invoice must be issued before or at the time of supply, or within 6 months from the date of removal, whichever is earlier.',
          example: 'ABC Ltd provides high-value management consultancy to a client, which is completed on 20-June. Under Section 31(2), the tax invoice must be issued on or before 20-July (30 days limit). If the supplier is a banking company, the deadline is extended to 4-August (45 days limit).'
        },
        {
          title: 'Special Invoicing Instruments — Bill of Supply, Vouchers & Payment Vouchers [Section 31(3)]',
          description: 'Section 31(3) prescribes auxiliary accounting formats: (1) Revised Tax Invoice u/s 31(3)(a): Issued within 1 month from the date of grant of registration, covering taxable supplies made during the period between the effective date of registration and issuance of certificate. (2) Bill of Supply u/s 31(3)(c): Issued for exempt supplies or by composition dealers (cannot charge tax or claim ITC). (3) Receipt Voucher u/s 31(3)(d): Issued upon receipt of advance payment for services. (4) Refund Voucher u/s 31(3)(e): Issued if advance is received but no supply or invoice is subsequently made. (5) Inward RCM Invoice and Payment Voucher u/s 31(3)(f) & (g): Recipient liable to pay RCM u/s 9(3)/(4) must issue an inward invoice (on receipt of supplies from an unregistered person) and a Payment Voucher (at the time of making payment).',
          exception: 'Under Section 31(3)(b), a registered person is not required to issue a tax invoice if the value of goods/services supplied is < ₹200, provided the recipient is unregistered and does not explicitly demand an invoice. They must instead issue a single consolidated tax invoice at the close of each day.',
          example: 'An unregistered lawyer provides senior counsel advice to a corporate entity, which pays him ₹1,00,000 on 5-July. Since the advice is under RCM u/s 9(3), the corporate recipient must issue a RCM Invoice to itself u/s 31(3)(f) and a Payment Voucher to the lawyer u/s 31(3)(g) on 5-July.'
        },
        {
          title: 'Credit and Debit Notes [Section 34]',
          description: 'Section 34 covers post-sale commercial downward/upward adjustments: (1) Credit Note u/s 34(1): Issued by the supplier to the recipient when: (a) taxable value or tax charged in invoice exceeds actual liability, (b) goods are returned by the recipient (sales return), or (c) goods/services supplied are found to be deficient. (2) Debit Note u/s 34(3) (Supplementary Invoice): Issued by the supplier when: (a) taxable value or tax charged in invoice is less than actual liability, or (b) rate of tax charged is lower than matches.',
          exception: 'Under Section 34(2), credit notes must be declared in the return for the month of issue, but not later than the 30th of November following the end of the financial year in which the supply was made, or date of filing the annual return, whichever is earlier. Under Finance Act 2025, a credit note can only reduce output tax liability if the corresponding ITC is reversed by the recipient.',
          example: 'A supplier sells 100 industrial valves to a buyer for ₹10,00,000 + 18% GST. On delivery, 10 valves are found to be defective and are returned. The supplier issues a Credit Note for ₹1,00,000 + 18% GST u/s 34(1). The buyer must reverse the ₹18,000 ITC, enabling the supplier to reduce its output tax u/s 34(2).'
        }
      ],
      visualBreakdown: {
        title: 'Mandatory GST Invoicing Timeline Reference',
        type: 'table',
        headers: ['Type of Supply', 'Standard Timeline Window', 'Auxiliary Instrument u/s 31(3)'],
        rows: [
          ['Taxable Supply of Goods', 'On or before removal/delivery of goods', 'Tax Invoice u/s 31(1)'],
          ['Taxable Supply of Services', 'Within 30 days of completion (45 days for banks/FIs)', 'Tax Invoice u/s 31(2)'],
          ['Renting of Carriage (Approval Sale/Return)', 'Before u/at supply or 6 months from removal', 'Tax Invoice u/s 31(7)'],
          ['Services with Advance consideration', 'Immediately upon receipt of payment', 'Receipt Voucher u/s 31(3)(d)']
        ]
      }
    },
    {
      chapterName: 'Accounts and Records; E-way Bill',
      keyPrinciples: [
        {
          title: 'Accounts and Records to be Maintained u/s 35',
          description: 'Section 35(1) mandates that every registered person must keep and maintain a true and correct record of (a) production or manufacture of goods, (b) inward and outward supplies of goods/services, (c) stock of goods, (d) input tax credit availed, and (e) output tax payable and paid, at their principal place of business. If they operate from multiple registered locations, the accounts relating to each place must be kept there. Accounts can be maintained manually (serially numbered volumes) or electronically with biometric/digital signatures and secure daily backups. Rule 56 specifies additional records (imports, exports, advances).',
          exception: 'Composition dealers registered under Section 10 are exempted from maintaining accounts of stock of goods (Rule 56(2)) and details of tax (Rule 56(4)), including tax payable, collected, or credit claimed.',
          example: 'A manufacturer registered under the regular scheme must maintain monthly quantitative records of raw materials consumed, finished goods produced, and scrap/wastage generated, whereas a composition retailer does not need to maintain these stock registers.'
        },
        {
          title: 'Custodian, Transporter and Warehouse Records u/s 35(2)',
          description: 'Under Section 35(2) and Rule 58, every owner or operator of a warehouse, godown, or any other storage facility, and every transporter (regardless of whether they are registered under GST or not) must maintain records of the consigner, consignee, and other details of goods. Unregistered warehouse owners/transporters must apply for a unique common enrollment number on the GST portal (Form GST ENR-01) to act as a custodian under the system.',
          exception: 'Enrolled unregistered transporters/warehouse keepers do not obtain a GSTIN and cannot collect tax or claim input tax credit.',
          example: 'An unregistered local logistics operator must enroll on the common portal to get a 15-digit TRANSIN ID, which they can then share with clients to generate e-way bills for assigned vehicles.'
        },
        {
          title: 'Period of retention of Accounts u/s 36',
          description: 'Under Section 36, all books of accounts and matching invoices, credit/debit notes, and bills must be retained until the expiry of 72 months (6 years) from the due date of furnishing the annual return for the financial year. If a taxpayer is a party to an appeal, revision, or investigation, they must retain relevant records for 1 year after final disposal of the proceeding, or 72 months from the annual return, whichever is later.',
          exception: 'Normal retention is checked from the annual return due date, not the end of the financial year.',
          example: 'For FY 2025-26, the annual return is due Dec 31, 2026. The retaining period of 72 months starts on Dec 31, 2026, meaning books must be preserved until Dec 31, 2032.'
        },
        {
          title: 'E-way Bill Requirement, Generation & Validity [Section 68, Rule 138]',
          description: 'Under Section 68 and Rule 138, an electronic way bill (E-way Bill) is mandatory prior to the movement of goods in a conveyance of value exceeding ₹50,000. Consignment value includes all taxes (CGST/SGST/IGST/cess) u/s 15 but excludes exempt supplies. If a defaulting supplier has not filed GSTR-1 for 2 consecutive tax periods or is suspended under Rule 21A, their GSTIN is blocked from generating E-way bills (Rule 138E).',
          exception: 'E-way bill is compulsorily required regardless of the ₹50,000 threshold in two specific situations: (1) Inter-State transfer of goods from a principal to a job-worker u/s Rule 138(1) proviso 3; (2) Inter-State transfer of handicraft goods by an artisan exempted from registration under Section 24 u/s Rule 138(1) proviso 4.',
          example: 'A registered dealer in Rajasthan sends a consignment of taxable goods worth ₹45,000 (plus ₹8,100 GST) to a buyer in Delhi. Since the consignment value of ₹53,100 exceeds ₹50,000, an E-way bill must be generated before dispatch.'
        }
      ],
      visualBreakdown: {
        title: 'Validity Period of E-way Bills by Distance',
        type: 'table',
        headers: ['Cargo Type', 'Distance within Country', 'Validity Period'],
        rows: [
          ['Normal Cargo', 'Up to 200 km', '1 Day'],
          ['Normal Cargo', 'Every additional 200 km or part thereof', '1 Additional Day'],
          ['Over Dimensional Cargo / Multimodal (with ship)', 'Up to 20 km', '1 Day'],
          ['Over Dimensional Cargo / Multimodal (with ship)', 'Every additional 20 km or part thereof', '1 Additional Day']
        ]
      }
    },
    {
      chapterName: 'Payment of Tax',
      keyPrinciples: [
        {
          title: 'The Three Electronic Ledgers [Section 49]',
          description: 'Under Section 49, three electronic registers are automatically maintained on the portal: (1) Electronic Tax Liability Register (Form GST PMT-01): Recalls all tax, interest, penalty, and late fee liabilities. (2) Electronic Credit Ledger (Form GST PMT-02): Self-assessed ITC is credited here. It can ONLY be debited for paying Output Tax. (3) Electronic Cash Ledger (Form GST PMT-05): Records all cash payments, deposits, TDS, and TCS. Deposits can be made online or Over-The-Counter (limited to ₹10,000 per challan per tax period, with exceptions for government departments, authorized recovery, etc.).',
          exception: 'Taxes payable under Reverse Charge (RCM) cannot be discharged using the Electronic Credit Ledger. They must be paid entirely in cash via the Electronic Cash Ledger.',
          example: 'A company has ₹15,000 IGST output liability on forward charges, ₹5,000 liability on reverse charge purchases, and ₹20,000 balance in its Electronic Credit Ledger. It can pay the ₹15,000 forward liability via Credit Ledger, but it must deposit and pay ₹5,000 in cash for the RCM portion.'
        },
        {
          title: 'Order of Discharge of Liabilities u/s 49(8)',
          description: 'Taxpayers must pay outstanding tax in a strict chronological sequence u/s 49(8): (1) Self-assessed tax and other dues (interest, penalty, late fees) relating to returns of PREVIOUS tax periods. (2) Self-assessed tax and other dues relating to the return of the CURRENT tax period. (3) Any other outstanding amount payable, including demands arose from proceedings under Section 73, 74, or 72/74A.',
          exception: 'The common portal will not allow a taxpayer to file returns of the current month until all previous Months\' liabilities are paid in full.',
          example: 'A dealer has an unpaid tax liability of ₹2,00,000 from March and ₹1,50,000 for April. If they make a deposit of ₹2,00,000 in May, it must first be set off fully against the March liability before they can file the return or discharge the tax for April.'
        },
        {
          title: 'Manner of Input Tax Credit Utilization [Section 49(5) & Rule 88A]',
          description: 'Section 49A/49B and Rule 88A regulate the strict sequence of ITC offset: IGST credit must be fully utilized and exhausted first before any CGST or SGST credit can be touched. IGST credit first offsets IGST output, and the remaining can offset CGST and SGST outputs in any order or proportion. Next, CGST credit offsets CGST output first, and then IGST output (if any). Finally, SGST credit offsets SGST output first, and then IGST output (only when CGST credit is exhausted).',
          exception: 'Cross-utilization of CGST credit to offset SGST liability, or SGST credit to offset CGST liability, is strictly prohibited.',
          example: 'A dealer has output liabilities of CGST ₹5,000, SGST ₹5,000, and ITC balances of CGST ₹7,000, SGST ₹4,000. They easily offset CGST ₹5,000 using CGST ITC (leaving ₹2,000 CGST ITC). They pay SGST ₹4,000 with SGST ITC, but they MUST pay the remaining ₹1,000 SGST in cash as CGST ITC cannot be utilized for SGST.'
        },
        {
          title: 'Interest on Delayed Payment of Tax [Section 50 & Rule 88B]',
          description: 'Section 50 imposes compensatory interest on delayed payments. The regular interest rate is 18% per annum u/s 50(1) for unpaid tax. Under Section 50(3), interest is 18% per annum for wrongful availment and utilization of ITC. Under Rule 88B(3), no interest is charged on wrongly availed ITC if it is merely blocked/lying in the Electronic Credit Ledger without being utilized (i.e. if the sum total of IGST, CGST, and SGST ITC balances never falls below the wrongly availed amount).',
          exception: 'Net Cash Basis Proviso: Under Section 50(1) proviso, if a return is filed belatedly but voluntarily (before any Section 73/74/74A proceedings start), interest is computed only on the portion of tax paid in CASH via the Electronic Cash Ledger, not on the portion paid with ITC.',
          example: 'A company files its March return 30 days late, declaring ₹1,00,000 output tax, paying ₹80,000 with ITC and ₹20,000 in cash. Interest is computed only on ₹20,000 at 18% for 30 days (₹20,000 * 18% * 30/365 = ₹296), not on the full ₹1,00,000.'
        },
        {
          title: 'Tax Deduction at Source (TDS) [Section 51]',
          description: 'Section 51 mandates specified deductors (government departments, local authorities, governmental agencies, and entities with >=51% government control) to deduct tax at source at the rate of 1% CGST + 1% SGST (total 2% for intra-State) or 2% IGST (inter-State) on payments made to suppliers of taxable supplies, if the total contract value exceeds ₹2,50,000 (excluding GST). TDS must be remitted within 10 days of the next month (Form GSTR-7), auto-populating the supplier\'s Electronic Cash Ledger.',
          exception: 'No TDS is deducted when the location of the supplier and the place of supply are in State A, but the recipient is registered in State B.',
          example: 'A municipal corporation enters into a contract for taxable services of ₹3,00,000. It pays the vendor. Since the contract is > ₹2,50,000, the corporation must deduct ₹6,000 (2% of ₹3 Lakh) as TDS, remit it, and pay the remaining ₹2,94,000 to the vendor.'
        }
      ],
      visualBreakdown: {
        title: 'ITC Cross-Utilization Matrix',
        type: 'table',
        headers: ['ITC Source Head', 'Offset 1st', 'Offset 2nd / Subsequent', 'Prohibited Offset'],
        rows: [
          ['IGST Credit', 'IGST Output', 'CGST / SGST in any order & proportion', 'None (Fully versatile once used 1st)'],
          ['CGST Credit', 'CGST Output', 'IGST Output (only after IGST ITC is NIL)', 'SGST / UTGST Output'],
          ['SGST / UTGST Credit', 'SGST / UTGST Output', 'IGST Output (only after IGST & CGST ITC are NIL)', 'CGST Output']
        ]
      }
    },
    {
      chapterName: 'Electronic Commerce Transactions',
      keyPrinciples: [
        {
          title: 'Definition and Liability of Electronic Commerce Operators (ECOs) [Section 9(5)]',
          description: 'Electronic commerce is the supply of goods, services, or digital products over electronic networks u/s 2(44). An ECO is any person owning, operating, or managing such digital platforms u/s 2(45). Under Section 9(5), the Government mandates that on specified services supplied through an ECO, the ECO is liable to pay all GST as if they were the supplier. Specified services include: (a) passenger transport (by radio-taxi, motorcycle, etc.), (b) accommodation in hotels (unless the supplier is registered u/s 22), (c) housekeeping/plumbing u/s 17, and (d) restaurant services.',
          exception: 'Under Section 9(5), the ECO must pay the entire tax liability in cash only (Form GSTR-3B). They CANNOT utilize their own Input Tax Credit to offset Section 9(5) liabilities. However, they are NOT required to reverse any input credits under Section 17(1)/(2) for aiding these supplies.',
          example: 'A customer orders food worth ₹500 from an unregistered local restaurant via a popular food delivery app (ECO). The ECO must collect the ₹500, bill the customer, and pay 5% GST in cash directly to the Government. The restaurant pays no GST on this supply.'
        },
        {
          title: 'Tax Collection at Source (TCS) by ECOs [Section 52]',
          description: 'Under Section 52, every ECO (not being an agent) who collects the cash/consideration on behalf of independent third-party suppliers for supplies made through its portal must collect TCS on the net value of taxable supplies. The standard TCS collection rate is 0.25% CGST + 0.25% SGST (total 0.5% for intra-State) or 0.5% IGST (inter-State). ECO must deposit TCS within 10 days of the next month (Form GSTR-8).',
          exception: 'TCS does not apply to: (1) exempt or zero-tax supplies, (2) reverse charge (RCM) supplies, (3) imports of goods/services, or (4) suppliers selling on their own direct websites under own billing.',
          example: 'An independent seller lists a laptop on an e-commerce platform and sells it for ₹50,000 (excluding 18% GST). The buyer pays the ECO. The ECO deducts ₹250 (0.5% of ₹50,000) as TCS and remits ₹49,750 (less platform commission) to the seller, who can claim ₹250 credit in their cash ledger.'
        },
        {
          title: 'ONDC & Multiple ECOs TCS Liability [Section 52]',
          description: 'In advanced e-commerce networks like ONDC, multiple ECOs are involved: one buyer-side ECO (providing buyer interface) and one seller-side ECO (providing interface to the actual seller). Under Circular No. 194/06/2023, the responsibility to deduct u/s Section 52 / collect TCS and file Form GSTR-8 lies with the seller-side ECO who finally releases the payment and settles with the actual seller.',
          exception: 'If the seller-side ECO is himself the supplier of the goods or services (inventory model), the buyer-side ECO is liable to collect the TCS u/s 52 when settling with them.',
          example: 'Customer buys a shirt on a buyer app (ECO-1) manufactured by a vendor listed on a merchant app (ECO-2). ECO-1 collects from the customer, deducts commission, and passes the balance to ECO-2. ECO-2 deducts TCS u/s 52 on the net supply and settles with the vendor. ECO-2 must collect TCS and file GSTR-8.'
        },
        {
          title: 'Registration Mandates u/s 24 for ECO and Suppliers',
          description: 'Compulsory registration u/s Section 24 applies to: (1) Every ECO who is liable to collect TCS u/s 52 or pay tax u/s 9(5) (no threshold applies, registered u/s REG-07 on common portal in 3 working days). (2) Suppliers of goods through an ECO u/s 24(ix).',
          exception: 'Under Section 148, unregistered suppliers of goods can make intra-State supplies through an ECO, provided they have a PAN, obtain a portal enrolment number, do not make any inter-State goods supplies, and do not list in multiple States. Suppliers of services through an ECO are also exempted from compulsory registration u/s 24 up to the ₹20L/₹10L threshold u/s Section 22.',
          example: 'An unregistered home weaver in Punjab makes shawls. Under the special pan-India Section 148 procedure, she obtains a portal Enrolment Number and can list her goods on e-commerce platforms to sell to consumers in Punjab without obtaining compulsory GST registration.'
        }
      ],
      visualBreakdown: {
        title: 'Summary of E-Commerce GST Roles',
        type: 'table',
        headers: ['E-Commerce Supply Category', 'Who Pays / Collects Tax?', 'TCS Collection / Levy Rate', 'Paid using Credit Ledger?'],
        rows: [
          ['Section 9(5) Services (e.g. Passenger Cab / Restaurant)', 'E-Commerce Operator (ECO) u/s 9(5)', 'Levied as Output GST (e.g. 5%)', 'No, CASH payment only!'],
          ['Normal Third-Party Goods u/s 52', 'ECO collects TCS, Supplier pays GST', 'TCS of 0.5% (intra) or 0.5% (inter)', 'Yes (for supplier output GST)'],
          ['Normal Third-Party Services u/s 52', 'ECO collects TCS, Supplier pays GST', 'TCS of 0.5% (intra) or 0.5% (inter)', 'Yes (for supplier output GST)'],
          ['Direct Sales by own brand website (e.g. Brand Store)', 'Actual Brand Supplier u/s 9(1)', 'No TCS applicable', 'Yes (for actual supply GST)']
        ]
      }
    },
    {
      chapterName: 'Returns',
      keyPrinciples: [
        {
          title: 'Statutory Return Filing Schema [Section 39]',
          description: 'Under Section 39, every registered regular taxpayer (monthly) must file Form GSTR-3B by the 20th of the succeeding month to declare their summary liabilities and utilize Input Tax Credit. QRMP (Quarterly Return Monthly Payment) taxpayers are permitted to file Form GSTR-3B quarterly on a staggered basis (22nd or 24th of the month following the quarter based on State). Non-Resident Taxable Persons (NRTPs) file Form GSTR-5. Input Service Distributors (ISDs) file Form GSTR-6. Tax Deductors u/s 51 file Form GSTR-7. Tax Collectors (ECOs) u/s 52 file GSTR-8.',
          exception: 'All return filings are mandatory even if there are no taxable activities or transactions in a tax period (Nil GSTR-3B, GSTR-1, or CMP-08), which can be completed instantly on the portal or via SMS-based OTP validation.',
          example: 'A regular supplier in Delhi with nil transactions for the month of May 2026 must still file a Nil Form GSTR-3B by June 20, 2026, to remain compliant and avoid late fees.'
        },
        {
          title: 'Furnishing Details of Outward Supplies & IFF [Section 37]',
          description: 'Section 37 requires taxpayers to submit outward supply invoices through Form GSTR-1 by the 11th of the succeeding month (others) or 13th of the month succeeding the quarter (for QRMP). QRMP taxpayers can optionally use the Invoice Furnishing Facility (IFF) to upload B2B invoices in the first 2 months of the quarter to pass on ITC to their recipients, up to an invoice value limit of ₹50 Lakh per month.',
          exception: 'A taxpayer is strictly debarred from filing Form GSTR-1 or using IFF if they have not filed GSTR-3B for the preceding month, or if outstanding Rule 88C (GSTR-1 vs 3B difference) or Rule 88D (GSTR-3B vs 2B ITC difference) tax demands or explanations remain unsubmitted beyond 7 days.',
          example: 'A quarterly QRMP supplier wants to pass on credit of an invoice of ₹15 Lakh to a customer in the 1st month of the quarter. They can upload the B2B invoice details in IFF on or before the 13th of the succeeding month, allowing the customer to claim ITC immediately inside their GSTR-2B.'
        },
        {
          title: 'Form GSTR-1A Current Period Amendments & GSTR-2B ITC Statement [Rule 59 & Section 38]',
          description: 'Form GSTR-1A is an optional electronic facility introduced to allow suppliers to add missed records or amend filed GSTR-1 invoices for the current tax period before filing their matching GSTR-3B summary return. All modifications made in GSTR-1A automatically update the corresponding tax liabilities in the GSTR-3B return. Regarding inward supplies, Section 38 specifies GSTR-2B as a static monthly auto-drafted statement detailing eligible and ineligible ITC.',
          exception: 'Under the Finance Act 2025, Section 38 is amended to replace the phrase "auto-generated statement" with "statement", expanding statutory pathways. GSTR-2B classifies ITC as ineligible if the supplier is a new registrant, has defaulted in paying taxes, or has an GSTR-1 outer limit exceeding GSTR-3B tax paid.',
          example: 'After filing their GSTR-1 for May on June 11, a supplier realizes they missed a B2B invoice of ₹10,000. Before filing their GSTR-3B on June 20, they file GSTR-1A on June 15 to integrate the invoice, which immediately updates their GSTR-3B output liability.'
        },
        {
          title: 'Annual & Final Returns and GST Practitioners [Section 44 & 45]',
          description: 'Section 44 mandates filing an Annual Return in Form GSTR-9 (or GSTR-9A for composition) on or before December 31st following the end of the financial year. Taxpayers with aggregate turnover exceeding ₹5 Crore must file a self-certified reconciliation statement in Form GSTR-9C to reconcile GSTR-9 with audited financials. Section 45 requires cancelled taxpayers to file a Final Return in Form GSTR-10 within 3 months of the date of cancellation or cancellation order, whichever is later.',
          exception: 'Casual Taxable Persons, Non-Resident Taxable Persons, ISDs, and OIDAR suppliers are completely exempted from the requirement of filing both Annual Returns (GSTR-9) and GSTR-9C reconciliation statements.',
          example: 'A manufacturing firm with a turnover of ₹8 Crore for FY 2025-26 must file GSTR-9 and GSTR-9C on or before December 31, 2026. A retailer whose GST registration was cancelled w.e.f May 10, 2026, must file GSTR-10 by August 10, 2026.'
        }
      ],
      visualBreakdown: {
        title: 'GST Mandatory Return Types & Filing Timelines',
        type: 'table',
        headers: ['Form Type', 'Description / Covered Taxpayers', 'Standard Filing Deadline', 'Late Fee on delay u/s Sec 47'],
        rows: [
          ['GSTR-1', 'Details of outbound supplies (invoice-level)', '11th of succeeding month (13th of quarter for QRMP)', '₹200/day (₹20/day for Nil), capped at ₹10,000'],
          ['GSTR-3B', 'Summary return of supplies, ITC & net tax payment', '20th of succeeding month (22nd/24th of quarter for QRMP)', '₹200/day (₹20/day for Nil), capped at ₹10,000'],
          ['GSTR-4', 'Annual Return for Composition suppliers u/s Sec 10', '30th of June following the end of the financial year', '₹200/day (₹20/day for Nil), capped at ₹2,000'],
          ['CMP-08', 'Quarterly tax payment statement (Composition u/s 10)', '18th of the month succeeding each quarter', 'Late fee not applicable; only interest u/s 50 applies'],
          ['GSTR-5', 'Monthly return for Non-Resident Taxable Persons (NRTP)', '13th of next month or 7 days after registration expiry', '₹200/day (₹20/day for Nil), capped at ₹10,000'],
          ['GSTR-6', 'Monthly return for Input Service Distributors (ISD)', '13th of the month succeeding the calendar month', '₹200/day, capped at ₹10,000'],
          ['GSTR-7', 'Monthly return for TDS deductors u/s Section 51', '10th of the month succeeding the calendar month', '₹50/day (₹25 each under CGST/SGST), capped at ₹1,000'],
          ['GSTR-9', 'Annual Return for register taxpayers (turnover-based)', '31st of December following the end of the financial year', '₹200/day, capped at 0.50% of state/UT turnover']
        ]
      }
    },
    {
      chapterName: 'Import and Export under GST',
      keyPrinciples: [
        {
          title: 'GST Importation Paradigm & Levy of IGST [Section 7(2)]',
          description: 'Under Section 7(2) and 7(4) of the IGST Act, 2017, all imports of goods and services into India are treated as inter-State supplies and are subject to the levy of Integrated GST (IGST). For goods, under Section 5(1) proviso, IGST is levied and collected in accordance with Section 3 of the Customs Tariff Act, 1975, when customs duties are levied u/s 12 of the Customs Act, 1962 (at the time when the bill of entry for home consumption is filed). The importer must pay IGST and can subsequently claim it as Input Tax Credit.',
          exception: 'Under Section 14A of the IGST Act, import of specified actionable claims of online money gaming by persons in the taxable territory is subject to IGST under Section 5(1) directly, without the applicability of general customs duty procedures.',
          example: 'Alpha Ltd imports raw materials worth ₹10,00,000 from Germany. At the port of entry, when filing the bill of entry, Alpha Ltd must pay Basic Customs Duty plus the corresponding IGST, which they can take as credit in their credit ledger.'
        },
        {
          title: 'Customs Valuation, Bonded Warehousing & High Seas Sales',
          description: 'Under Customs Tariff Act Section 3(8), the value of imported goods for levying IGST is the Assessable Value determined under Section 14 of the Customs Act, 1962 plus Basic Customs Duty and all other statutory duties (excluding IGST and Compensation Cess). Under CTA Section 3(8A), if goods are sold while being deposited in a customs bonded warehouse before home consumption clearance, GST is NOT payable at the time of transfer. IGST is collected only when the ex-bond bill of entry is filed for clearing the goods, on a value equal to the original CTA u/s 3(8) value or the final Transaction Sale Value, whichever is HIGHER. For High Sea Sales, no GST is levied on the transaction itself (Para 8(b) of Schedule III); IGST is paid only on customs clearance based on the price paid by the last high seas buyer.',
          exception: 'Third Country Shipments (triangular trade moving goods from one non-taxable country to another without touching India) are neither treated as a supply of goods nor services (Para 7 of Schedule III), hence exempt from GST.',
          example: 'A trader imports steel from Korea, deposits it in a bonded warehouse, and sells it to a buyer for ₹12,00,000 (its original import value + duty was ₹10,50,000). No GST is paid at the time of sale. When the buyer files the ex-bond bill of entry, IGST is calculated on the transaction value of ₹12,00,000 (higher of the two values).'
        },
        {
          title: 'Import of Services & OIDAR Specialties [Section 2(11) & Section 14]',
          description: 'An import of service u/s 2(11) of the IGST Act requires: (1) Supplier located outside India, (2) Recipient in India, and (3) Place of supply in India. Under Section 7(1)(b) of the CGST Act, import of service for a consideration is a "supply" whether or not it is in the course or furtherance of business. If imported without consideration, it is a supply only u/s Schedule I Para 4 (when received from a related person or other business establishment overseas). The tax is paid by the recipient under RCM. However, for OIDAR services (Online Information Database Access and Retrieval) provided by an overseas supplier to a Non-Taxable Online Recipient (NTOR - unregistered consumers), RCM does not apply; the overseas supplier is liable to pay IGST directly.',
          exception: 'Following Mohit Minerals, no separate RCM IGST is levied on the ocean freight wrapper paid by an overseas exporter to a foreign shipping line under a CIF import contract, to prevent double taxation (the entry has been omitted w.e.f 01.10.2023).',
          example: 'An individual in Delhi purchases a cloud storage subscription for personal use from a US-based cloud service provider (OIDAR). Since the user is an NTOR, the US service provider must register under the Simplified Registration Scheme (SRS), file Form GSTR-5A, and pay the IGST under forward charge.'
        },
        {
          title: 'Zero-Rated Supplies & Deemed Exports [Section 16, CGST Section 147]',
          description: 'Under Section 16 of the IGST Act, "Zero-rated supplies" mean (a) export of goods or services, or (b) supplies of goods or services to an SEZ developer or SEZ unit for authorised operations. The entire chain is relieved of tax by allowing the exporter to avail full ITC and claim a refund. Alternatively, under Section 147 of the CGST Act, "Deemed Exports" cover notified supplies of goods manufactured in India that do not leave the country (such as supplies to EOUs, or against Advance Authorisation) where tax is paid first and refund is claimed afterwards.',
          exception: 'Merchant exports (supplies of goods from a manufacturer to a registered merchant exporter) are subject to a concessional tax rate of 0.1% (total CGST + SGST or IGST) under Notification 40/2017 & 41/2017, provided the goods are exported within 90 days from the invoice date.',
          example: 'A manufacturer sells garments to a merchant exporter on a tax invoice charging 0.1% GST. The merchant exporter moves the goods directly to the port and exports them within 75 days. The exporter files refund of the tax under LUT/bond, and the manufacturer gets an ITC refund due to the inverted duty structure.'
        }
      ],
      visualBreakdown: {
        title: 'GST Rules for Cross-Border Transactions',
        type: 'table',
        headers: ['Transaction Category', 'Basic GST Treatment', 'Responsibility of Tax Payment', 'Are Input Credits (ITC) Allowed?'],
        rows: [
          ['Import of Goods (Standard)', 'Taxable inter-State supply (Subject to IGST)', 'Paid by Importer at Customs during clearance', 'Yes, fully eligible as ITC'],
          ['Import of Services (Business Recipient)', 'Taxable inter-State supply (Subject to IGST)', 'Paid by Importer under RCM u/s 5(3)', 'Yes, fully eligible as ITC'],
          ['Import of OIDAR Services (to NTOR)', 'Taxable inter-State supply (Subject to IGST)', 'Paid by Overseas Supplier under Forward Charge', 'No (NTOR is an unregistered final consumer)'],
          ['High Seas Sales / Triangular Trade', 'Excluded from "Supply" u/s Schedule III', 'No immediate GST (Paid on final custom clearance)', 'Reversal of common ITC under Rule 42/43 is not required'],
          ['Deemed Exports (e.g. to EOU)', 'Taxable first (not zero-rated by default)', 'Paid by Supplier; Refund filed by supplier/recipient', 'Yes, ITC is available first to the recipient'],
          ['Standard Exports (under LUT/Bond)', 'Zero-rated supply (No output GST paid)', 'No tax payment; Refund of accumulated ITC u/s 54', 'Yes, full ITC allowed on inputs/input services']
        ]
      }
    },
    {
      chapterName: 'Refunds',
      keyPrinciples: [
        {
          title: 'Statutory Refund Claims & 2-Year Limitation [Section 54]',
          description: 'Under Section 54(1) of the CGST Act, any person claiming a refund of tax, interest, or any other amount paid must file Form GST RFD-01 electronically before the expiry of 2 years from the "Relevant Date". The Relevant Date is defined strictly based on the transaction type: (1) Export of goods by sea/air: Date when the vessel/aircraft leaves India. (2) Export of goods by land: Date when goods pass the state frontier. (3) Export of services: Date of receipt of payment in convertible foreign exchange (or date of tax invoice if payment was received in advance). (4) Refund of unutilized ITC (inverted structure): Due date of GSTR-3B return for the tax period.',
          exception: 'The strict 2-year statutory limit is completely inapplicable to the case of claiming a refund of any unutilized excess balance lying in the Electronic Cash Ledger.',
          example: 'An exporter of goods by post dispatches a parcel to Canada on 15-May-2026. The 2-year limitation clock starts on 15-May-2026, meaning they must file Form GST RFD-01 on or before 15-May-2028.'
        },
        {
          title: 'Provisional Refunding & Deficiency Memo [Section 54(6), Rule 90 & 91]',
          description: 'To protect exporter working capital, Section 54(6) and Rule 91 authorize the Proper Officer to grant a "Provisional Refund" of 90% of the total amount claimed on account of zero-rated supplies (exports/SEZ), within 7 days from the issuance of receipt acknowledgment. The remaining 10% is processed later after a full audit. If any documentation errors are caught upon initial receipt, the PO issues a "Deficiency Memo" u/s Rule 90(3), which requires the exporter to submit a completely fresh refund application.',
          exception: 'No provisional refund shall be granted to any applicant who has been prosecuted for tax evasion or fraud exceeding ₹2.5 Crore anytime in the preceding 5 years. The time elapsed between the original filing and the Deficiency Memo is excluded from the 2-year limitation period.',
          example: 'An IT company files an ITC refund claim of ₹10,00,000 on June 1, 2026, on its services exported under LUT. The application gets acknowledged on June 15. The PO must issue a provisional refund order of ₹9,00,000 on or before June 22.'
        },
        {
          title: 'Doctrine of Unjust Enrichment & Direct Payout Exceptions [Section 54(8) & 57]',
          description: 'By default, all sanctioned refunds are credited to the Consumer Welfare Fund u/s 57 under the presumption of "Unjust Enrichment" — assuming that indirect business taxes are always shifted to the final consumer. However, u/s 54(8), the refund is directly paid out and credited to the applicant\'s bank account in 6 explicit exceptions, including: (a) Tax paid on export of goods/services or on input tax credit used in exports, (b) Refund of unutilized ITC due to zero-rated supplies or inverted duty structure, (c) Refund of tax wrongly collected and deposited u/s Section 77. For other cases, if the refund is <= ₹2 Lakh, a self-declaration of non-passage of tax suffices. If > ₹2 Lakh, a certificate from a Chartered or Cost Accountant is mandatory.',
          exception: 'Specialized international agencies (UN bodies, foreign embassies) u/s Section 55 and Canteens (CSD) u/s Rule 95B are exempted from unjust enrichment and get direct quarterly refund payouts on their inward supplies.',
          example: 'A shipper paid ₹50,000 IGST on a transaction that they later realized was an intra-state supply. They pay CGST+SGST instead and apply for a refund of the wrongly paid IGST u/s Section 77. Since it is u/s 54(8)(d), the ₹50,000 is directly credited to their bank account (bypassing the Consumer Welfare Fund).'
        },
        {
          title: 'Formulas for refunding unutilized ITC [Rule 89(4) & 89(5)]',
          description: 'Rule 89(4) regulates the maximum refund for unutilized ITC on zero-rated supplies: "Refund Amount = (Turnover of zero-rated supply of goods + Turnover of zero-rated supply of services) * Net ITC / Adjusted Total Turnover". Here, Net ITC only includes ITC on inputs and input services (excludes capital goods). Turnover of zero-rated supply of goods is capped at 1.5 times the domestic value of like goods. Rule 89(5) regulates inverted duty structure refunds using a formula that proportionately reduces Net ITC (on inputs only) by the tax payable on the inverted supplies to filter out input services and capital goods.',
          exception: 'No refund of unutilized ITC is permitted if: (1) the exported goods are subjected to export duty, or (2) the supplier claims export drawback in respect of CGST, or claims refund of IGST paid on such supplies.',
          example: 'An exporter has Net ITC of ₹3,00,000 on inputs and zero-rated turnover of ₹10,00,000. However, the domestic value of like goods is ₹6,00,000. Under Rule 89(4), their zero-rated turnover is capped at ₹9,00,000 (1.5 * ₹6,00,000), which is used in the numerator to compute the proportional refund.'
        }
      ],
      visualBreakdown: {
        title: 'GST Interest on Delayed Refunds [Section 56 & Rule 94]',
        type: 'table',
        headers: ['Trigger Circumstance u/s Section 56', 'Timing of Interest Commencement', 'Statutory Rate of Interest'],
        rows: [
          ['PO fails to refund u/s 54(5) within 60 days of complete application', 'Starts from the 61st day from date of receipt of application till actual refund', '6% per annum'],
          ['Refund arises from a judicial order/court decree that attained finality', 'Starts from the 61st day from date of receipt of application filed post-decision', '9% per annum'],
          ['Standard PO refund order u/s 54(5) issued on time', 'No interest is payable if disbursed within the initial 60 days', '0%']
        ]
      }
    },
    {
      chapterName: 'Job Work',
      keyPrinciples: [
        {
          title: 'Scope and Definition of Job Work [Section 2(68) & Schedule II]',
          description: 'Under Section 2(68) of the CGST Act, "job work" is defined as any treatment or process undertaken by a person on goods belonging to another registered person (referred to as the "principal"). The ownership of such goods remains strictly with the principal throughout the transaction. Schedule II, Paragraph 3 further clarifies that any treatment or process applied to another person\'s goods is a supply of services, not goods.',
          exception: 'If the person who owns the goods and sends them for processing is unregistered, the treatment or process does not qualify as "job work" under Section 2(68) and is instead treated as a standard, independent supply of services.',
          example: 'A registered apparel manufacturer sends bulk fabric to an independent embroidery business to stitch company logos. This is job work under Section 2(68) and is taxed as a supply of services.'
        },
        {
          title: 'Special Concessions & Use of Own Materials',
          description: 'Under Circular No. 38/12/2018-GST, a job worker is permitted to use their own inputs or supplementary materials in addition to the principal goods received for carrying out the assigned task.',
          exception: 'A job worker is independently liable to pay GST on their job work service charges if they are registered or liable to be registered.',
          example: 'A metal canning job worker receives sheets from a food brand. In addition to folding and cutting, they use their own food-grade interior coating materials and outer paint to seal the tin. This supplementary use of materials does not change the classification from job work to a supply of goods.'
        },
        {
          title: 'Procedural Scheme for Removal of Goods u/s 143',
          description: 'Section 143 enables a registered principal to send inputs or capital goods to a job worker without payment of tax under the cover of a delivery challan. The principal can also send goods directly from their supplier to the job worker without first bringing them to their own premises, and still claim full Input Tax Credit (ITC) u/s 19.',
          exception: 'Failure to return inputs within 1 year (or capital goods within 3 years) of being sent out deems them a supply by the principal to the job worker, retrospectively on the date of departure, attracting GST with interest at 18% p.a.',
          example: 'On 28th January 2026, a brand sends thread to a weaver. If the woven fabric is not received back within 1 year (by 28th January 2027), the thread is treated as sold to the weaver on 28th January 2026, with 18% interest due.'
        },
        {
          title: 'Time Limit Exemptions & Direct Supply from Job Worker Premises',
          description: 'The strict 1-year and 3-year return timelines for inputs and capital goods do not apply to moulds and dies, jigs and fixtures, or tools sent out for job work u/s 19(7) / 143; these can remain with the job worker indefinitely.',
          exception: 'The principal can supply the finished processed goods directly from the job worker\'s premises on payment of tax, provided they declare the job worker\'s premises as an additional place of business u/s 25, unless the job worker is registered under Section 25, or the principal is supplying notified goods.',
          example: 'A manufacturer of plastic toys delivers high-value forming moulds to a registered job worker. The moulds stay at the job worker’s location for 5 years. This is fully compliant as moulds are exempt from the 3-year return limit.'
        },
        {
          title: 'Form GST ITC-04 and E-Way Bill Responsibilities',
          description: 'The principal must declare the details of all delivery challans for goods dispatched to or returned from a job worker in Form GST ITC-04. If the principal\'s aggregate preceding FY turnover exceeds ₹5 Crore, ITC-04 is filed half-yearly (by 25th October and 25th April); otherwise, it is filed annually (by 25th April). Additionally, any inter-State movement of goods to a job worker requires an E-way bill, which must be generated by the principal or registered job worker, irrespective of consignment value.',
          exception: 'The standard ₹50,000 consignment value threshold for E-way bills does not apply to inter-State job work movement (Rule 138).',
          example: 'A chemical firm in Gujarat sends product samples valued at ₹15,000 to an analytical lab in Maharashtra. Since it is an inter-State job work transfer, an E-way bill is compulsorily required despite being under ₹50,000.'
        }
      ],
      visualBreakdown: {
        title: 'GST Job Work Goods Timelines & Exemption Summary',
        type: 'table',
        headers: ['Goods Category', 'Return / Supply Deadline', 'Extension Period (by Commissioner)', 'Failure to Return Consequences'],
        rows: [
          ['Inputs / Semi-finished goods', '1 Year from date of sending / receipt', 'Up to 1 additional Year', 'Retrospective taxable supply by Principal with 18% p.a. interest'],
          ['Capital Goods', '3 Years from date of sending / receipt', 'Up to 2 additional Years', 'Retrospective taxable supply by Principal with 18% p.a. interest'],
          ['Moulds, dies, jigs, fixtures, or tools', 'No deadline (Indefinite retention)', 'Not applicable', 'No tax or interest implications'],
          ['Waste & scrap generated in job work', 'No deadline (Supplied directly from job premises)', 'Not applicable', 'Tax paid by job worker (if registered) or principal (if unregistered)']
        ]
      }
    },
    {
      chapterName: 'Assessment and Audit',
      keyPrinciples: [
        {
          title: 'Types of Assessment & Self-Assessment u/s 59',
          description: 'Assessment under Section 2(11) of the CGST Act means the determination of tax liability and includes self-assessment, re-assessment, provisional assessment, summary assessment, and best judgment assessment. Section 59 establishes a trust-based self-assessment model where every registered person must themselves assess their tax payable for each tax period and file their returns u/s 39 without any prior department intervention.',
          exception: 'Self-assessment can be scrutinized by the Proper Officer u/s 61, or selected for departmental audit u/s 65, leading to re-assessment if discrepancies are confirmed or un-remedied.',
          example: 'A department store calculates its monthly output GST, deducts input tax credits, determines a net tax payable of ₹5,00,000, and files Form GSTR-3B on the portal under self-assessment.'
        },
        {
          title: 'Provisional Assessment Procedure & Bond Execution u/s 60',
          description: 'Under Section 60, if a taxpayer is unable to determine the value of taxable goods/services, or the applicable rate of tax, they can apply electronically in Form GST ASMT-01 to pay tax on a provisional basis. The Proper Officer (PO) must issue a provisional order within 90 days of application, enabling provisional payments upon the execution of a bond in Form GST ASMT-05, backed by a bank guarantee security not exceeding 25% of the bond amount.',
          exception: 'The final assessment order must be passed by the PO within 6 months from the date of the provisional order, extendable by Joint/Additional Commissioner for up to 6 months and by the Commissioner for up to 4 years.',
          example: 'A developer supplying specialized diagnostic software to hospitals is unsure whether to charge 12% or 18% GST. They apply u/s 60, execute a bond, and provisionally deposit tax at 18% while awaiting final classification.'
        },
        {
          title: 'Finalization of Provisional Assessment & Interest Outlays u/s 60(4) & 60(5)',
          description: 'Upon finalization of provisional assessment, if the final assessed tax liability is higher than the provisional payment, the taxpayer must pay the differential tax along with interest u/s 50(1) at 18% p.a., calculated from the original due date till the date of actual payment. If the final assessed tax is lower, the excess is refundable with interest u/s 56 at 6% p.a. for delays exceeding 60 days from the refund application.',
          exception: 'If the tax refund is disbursed within 60 days of submitting the refund application, no interest is payable by the Government.',
          example: 'A supplier provisionally pays GST at 12% for supplies made in January (due on Feb 20). The final assessment in April determines the correct rate is 18%. The supplier must pay the 6% difference with interest at 18% p.a. starting from Feb 20.'
        },
        {
          title: 'Best Judgment Assessment for Non-Filers & Unregistered Persons u/s 62 & 63',
          description: 'Under Section 62, if a registered person fails to file GSTR-3B u/s 39 or final GSTR-10 u/s 45 despite being served a notice u/s 46 (which grants a 15-day filing window), the PO can assess their tax liability u/s 62 to the best of their judgment using GSTR-1, e-way bills, or other gathered data, and issue an order within 5 years from the GSTR-9 due date. Under Section 63, if a taxable person fails to obtain registration despite being liable, or whose registration was cancelled u/s 29(2), the PO can carry out best judgment assessment for the relevant periods within the same 5-year timeline.',
          exception: 'Under Section 62(2), if the non-filer submits a valid return within 60 days of the service of the best judgment order, the assessment order is deemed automatically withdrawn, though they remain liable for interest u/s 50(1) and late fees u/s 47.',
          example: 'A trader neglects to file GSTR-3B for three months. The PO serves a 15-day notice u/s 46, and upon continued default, issues a Best Judgment order. The taxpayer files the outstanding returns 40 days later; the best judgment order is withdrawn, but they must pay the interest and standard late fees.'
        },
        {
          title: 'Departmental Audit u/s 65 & Special Audit u/s 66',
          description: 'Section 65 authorizes the Commissioner or any authorized officer to conduct a Departmental Audit of any registered person at their place of business or office for a financial year or part thereof, by serving a notice at least 15 working days prior. It must be completed within 3 months of commencement (commencement is the date when records are made available or the actual start at the premises), extendable by the Commissioner for up to 6 months. Under Section 66, if an Assistant Commissioner (or above) during scrutiny or investigation finds the value not correctly declared or credit not within normal limits, they can, with the prior approval of the Commissioner, direct a Special Audit to be conducted by a CA or Cost Accountant nominated by the Commissioner.',
          exception: 'A Special Audit u/s 66 can be ordered even if the logs and books of accounts of the taxpayer have already been audited under any other law (like the Companies Act or Income Tax Act). All expenses and auditors\' remuneration are borne entirely by the Commissioner.',
          example: 'During an investigation, an officer suspects a steel manufacturer of claiming excessive ITC. They get the Commissioner\'s approval and order a Special Audit. The manufacturer must submit all records to the nominated Cost Accountant, who must submit a signed report within 90 days (extendable by another 90 days).'
        }
      ],
      visualBreakdown: {
        title: 'GST Assessment & Audit Formats, Timelines and Authority limits',
        type: 'table',
        headers: ['Assessment / Audit Type', 'Governing Section', 'Key Timelines & Deadlines', 'Authority or Officer Level'],
        rows: [
          ['Self-Assessment', 'Section 59', 'Filed monthly or quarterly via returns', 'Registered Person (Self-Declared)'],
          ['Provisional Assessment', 'Section 60', 'Order issued within 90 days of application; final order within 6 months (extendable up to 4 years)', 'Proper Officer (Assistant/Deputy Commissioner)'],
          ['Scrutiny of Returns', 'Section 61', '30-day window for taxpayer to reply to discrepancies served in ASMT-10', 'Proper Officer (Superintendent/AC)'],
          ['Best Judgment (Non-Filers)', 'Section 62', 'Order issued within 5 years of GSTR-9 due date; withdrawn if valid return filed within 60 days', 'Proper Officer (Superintendent/AC)'],
          ['Departmental Audit', 'Section 65', '15 working days notice; Completed within 3 months of commencement (extendable by 6 months)', 'Commissioner or authorized officers'],
          ['Special Audit', 'Section 66', 'Report submitted within 90 days (extendable by another 90 days); expenses borne by Commissioner', 'Chartered / Cost Accountant nominated by Commissioner']
        ]
      }
    },
    {
      chapterName: 'Inspection, Search, Seizure and Arrest',
      keyPrinciples: [
        {
          title: 'Power of Inspection u/s 67(1)',
          description: 'Under Section 67(1), any officer of CGST/SGST not below the rank of Joint Commissioner can authorize a Proper Officer in writing (Form GST INS-01) to carry out an "Inspection" of any place of business of a taxable person, raw material transporter, or operator of a warehousing facility. The Joint Commissioner must have "reason to believe" that the taxpayer has suppressed transactions, suppressed stock in hand, claimed excess ITC, or contravened any provision to evade tax.',
          exception: '"Reason to believe" must be based on objective facts of tax evasion, not mere suspicion. It cannot be used as a roving inquiry.',
          example: 'The department gets a tip-off with concrete invoices showing that a plywood dealer is maintaining a parallel set of books and suppressing physical stock in their warehouse. The Joint Commissioner issues an INS-01 authorization to inspect the warehouse.'
        },
        {
          title: 'Power of Search & Seizure u/s 67(2)',
          description: 'Under Section 67(2), if the Joint Commissioner has reason to believe that any goods liable to confiscation (u/s 130) or any documents, books, or physical things useful for proceedings are secreted anywhere, they can authorize (via a search warrant) an officer to search and seize them. The searching officer has the explicit power to break open the doors of the premises, almirahs, or boxes if access is denied. All search operations must comply with Section 100 of the Code of Criminal Procedure, 1973, requiring the presence of at least two independent local witnesses and preparation of a Panchnama/Mahazar on the spot.',
          exception: 'Under Section 67(2) proviso, if it is not practicable to seize the goods physically, the officer can issue a detention order (Form GST INS-02), instructing the owner/custodian not to remove or deal with the goods without prior permission.',
          example: 'During a search at a dealer\'s office, the owner refuses to open a locked safe. The officer breaks it open, retrieves hidden cash ledgers, and seizes them after listing them in a Panchnama signed by two independent neighborhood witnesses.'
        },
        {
          title: 'Safeguards, Release & Return of Seized Goods/Documents u/s 67',
          description: 'Seized goods and documents cannot be retained indefinitely. Seized documents/books not relied upon for the tax demand must be returned within 30 days from the issuance of the Show Cause Notice (SCN). Taxpayers have a legal right to take photocopies or extracts of seized records in the presence of the officer. Seized goods can be released provisionally upon execution of a bond and furnishing of bank security (INS-04) or payment of tax, interest, and penalty.',
          exception: 'Under Section 67(7), if no SCN is issued within 6 months of the seizure of goods, the goods must be returned back to the person from whose possession they were seized. This 6-month period can be extended by the PO for a maximum of another 6 months on justified grounds.',
          example: 'Goods are seized from a logistics hub on 10th January 2026. If the department fails to issue an SCN to the owner by 10th July 2026, they must legally return the goods, unless the timeline is formally extended by the proper officer.'
        },
        {
          title: 'Power to Arrest u/s 69 & Cognizable vs Non-Cognizable Offences u/s 132',
          description: 'Under Section 69, if the Commissioner has reason to believe that a person has committed specified serious offences (such as supplying without invoice, issuing fake invoices to pass ITC, collecting tax but not paying it for over 3 months, etc.) where the tax amount evaded/fake ITC exceeded ₹2 Crore, they can authorize in writing any officer to carry out an "Arrest". Arrested persons must be presented before a Magistrate within 24 hours. Under Section 132, if the tax amount involved exceeds ₹5 Crore, the offence is cognizable and non-bailable, requiring a Judicial Magistrate to hear bail. Below ₹5 Crore, it is non-cognizable and bailable, allowing the Deputy/Assistant Commissioner to grant bail.',
          exception: 'The monetary limit of ₹2 Crore for arrest does not apply to repeat offenders who have been previously convicted of specified offences under Section 132.',
          example: 'A person runs a network of shell companies that passed fake ITC of ₹6 Crore to clients without any actual movement of goods. Since the amount exceeds ₹5 Crore, the Commissioner authorizes their arrest and they are forwarded to custody as a cognizable, non-bailable offence.'
        },
        {
          title: 'Power to Summon & Access Premises [Sections 70 & 71]',
          description: 'Section 70 empowers the proper officer to "Summon" any person to appear and give evidence or produce documents in an inquiry. The summons proceedings are deemed judicial proceedings within the meaning of the Indian Penal Code, and non-attendance is punishable with a penalty up to ₹25,000 u/s 122(3)(d). Section 71 grants any authorized officer access to any business premises to inspect books, trials, annual financial accounts, or audit reports to safeguard revenue.',
          exception: 'Summons should be used as a last resort where taxpayers are not co-operating, and cbic guidelines state they must not be used to harass top management (like CEOs/CFOs) without indications of direct involvement.',
          example: 'During an audit, a supplier refuses to provide their trial balance. The officer issues a summons u/s 70, requiring the accountant to appear at the state office with the trail balance on a specified date.'
        }
      ],
      visualBreakdown: {
        title: 'GST Inspection, Search, Seizure, and Arrest Standards',
        type: 'table',
        headers: ['Activity / Action', 'Governing Section', 'Key Conditions & Safeguards', 'Monetary / Procedural Thresholds'],
        rows: [
          ['Power of Inspection', 'Section 67(1)', 'INS-01 written authorization; requires JC "Reason to Believe"', 'No monetary limit (Applies to suppressed stock/transactions)'],
          ['Search & Seizure', 'Section 67(2)', 'Search warrant required; breaking open doors/almirahs permitted; 2 independent local witnesses required; Panchnama prepared on spot', 'No monetary limit (Applies to secreted goods/records)'],
          ['Return of Seized Goods', 'Section 67(7)', 'Must be returned if no SCN is served within 6 months of seizure (extendable for 6 more months)', 'No monetary limit'],
          ['Disposal of Seized Goods', 'Section 67(8)', 'Perishable or hazardous goods (camphor, menthol, batteries, paper) can be disposed of immediately u/s 130', 'Not applicable'],
          ['Power to Summon', 'Section 70', 'Judicial proceeding; non-appearance attracts ₹25,000 penalty u/s 122(3)(d); should not be used repeatedly', 'Not applicable'],
          ['Access to Business Premises', 'Section 71', 'Access to inspect audited books, trial balance, cost/income-tax audit reports; duty of person-in-charge to provide within 15 working days', 'Not applicable'],
          ['Power to Arrest', 'Section 69 & 132', 'Commissioner authorization required; presented before Magistrate within 24 hours; bailable by AC if <= ₹5Cr; bail by Magistrate if > ₹5Cr', 'Tax evasion/fake ITC > ₹2 Crore (monetary limit exempt for repeat offenders); Cognizable & non-bailable if > ₹5 Crore']
        ]
      }
    },
    {
      chapterName: 'Demands and Recovery',
      keyPrinciples: [
        {
          title: 'Tax Determination under Section 74A',
          description: 'Section 74A introduced a unified procedure for determining tax not paid, short paid, erroneously refunded, or ITC wrongly availed or utilised for any reason (encompassing both fraud and non-fraud categories) starting from FY 2024-25. The Show Cause Notice (SCN) can be issued by the Proper Officer within a uniform limitation period of 42 months (3.5 years) from the due date of furnishing the annual return for the relevant financial year, or from the date of erroneous refund.',
          exception: 'If the disputed tax amount under Section 74A is less than ₹1,000 in a financial year, the Proper Officer is strictly barred from issuing a Show Cause Notice.',
          example: 'An audit of FY 2024-25 (reconciliation of GSTR-1 vs 3B) reveals a short payment of ₹2,50,000. Under Section 74A, the PO can issue a single general SCN within 3.5 years from the annual return filing due date.'
        },
        {
          title: 'Standard Adjudication Timelines, Extensions & Concessions u/s 74A',
          description: 'The Proper Officer must determine the tax, interest, and penalty due from the taxpayer and issue an adjudication order u/s 74A within 12 months (1 year) from the date of SCN. This period is extendable by the Commissioner or an officer senior to PO (not below the rank of Joint Commissioner) for a maximum of 6 months for reasons recorded in writing before its expiry.',
          exception: 'If the tax and interest are paid before the SCN, or within 60 days of SCN service in non-fraud cases, the penalty is completely waived (NIL penalty). In fraud cases, the penalty stands reduced to 15% (if paid before SCN), 25% (if paid within 60 days of SCN), or 50% (if paid within 60 days of order communication), concluding all proceedings.',
          example: 'A developer receives an SCN u/s 74A for a fraud-based short-payment of ₹10,000,000 on June 1, 2026. If they pay the entire tax, interest u/s 50, and a reduced penalty of ₹2,50,000 (25% of tax) on June 20, 2026 (within 60 days), all proceedings stand closed.'
        },
        {
          title: 'Penalty for Delayed Self-Assessed Tax and Tax Collection Defaults',
          description: 'Under Section 74A(11) / 74A(5), any self-assessed tax or any amount collected as tax which is declared but remains unpaid beyond 30 days of its original due date attracts a mandatory, non-waivable penalty equal to 10% of the tax due or ₹10,000, whichever is higher (each under CGST and SGST/UTGST, i.e., ₹10,000 each or ₹20,000 under IGST). Section 76 requires any person who has collected any amount representing tax to deposit it forthwith with the Central Government, irrespective of whether the underlying supplies are taxable or not.',
          exception: 'The option of paying tax within 60 days of SCN to claim penalty waiver is completely unavailable for unpaid self-assessed tax or tax collection defaults u/s 74A(11).',
          example: 'A trader files their GSTR-3B for March 2026 showing tax payable of ₹60,000, but fails to execute payment. On June 1, 2026 (exceeding 30 days after the due date), the department raises a demand. The trader must pay the tax and interest with a mandatory penalty of ₹10,000 u/s 74A(11), with no option for concession.'
        },
        {
          title: 'Tax Wrongfully Deposited & Civil Recovery Proceedings [Sections 77 & 78/79]',
          description: 'Section 77 establishes that a taxpayer who pays CGST+SGST/UTGST on a transaction thought to be intra-state, which is subsequently held to be inter-state (or vice versa), shall be granted a full refund of such wrongfully paid taxes without being required to pay any interest on the correct head of tax. Regarding recovery, Section 78 requires any amount payable under an adjudication order to be paid within 3 months of service, failing which the recovery officer initiates recovery proceedings u/s 79 through various modes.',
          exception: 'If the Proper Officer considers it expedient in the interest of revenue, they can, for reasons in writing, require the taxpayer to pay within a shorter window (less than 3 months).',
          example: 'A firm realizes they paid ₹15,000 CGST+SGST on an inter-state supply. They pay ₹15,000 IGST on the correct head. No interest is payable on this IGST head, and they can claim a direct refund of CGST+SGST u/s Section 77.'
        },
        {
          title: 'Recovery Modes, Instalment Powers & Provisional Attachment [Sections 79, 80 & 83]',
          description: 'Section 79 empowers recovery through: (1) Deduction from department-controlled funds, (2) Detaining and selling taxpayer goods, (3) Garnishee proceedings reaching third parties (e.g., bank accounts or debtors), (4) Distress and sale of any movable/immovable assets, (5) Recovery as arrears of land revenue u/s 79(1)(e). Under Section 80, the Commissioner can permit a taxpayer to pay interest, penalties, and tax dues (other than self-assessed liabilities u/s returns) in up to 24 monthly instalments, subject to interest u/s 50. Under Section 83, the Commissioner can order the provisional attachment of any property or bank account for up to 1 year during the pendency of any assessment (Chapter XII), search (Chapter XIV), or recovery (Chapter XV) proceedings.',
          exception: 'If any single instalment allowed u/s 80 is defaulted on its due date, the entire outstanding balance becomes immediately due and payable without any further notice.',
          example: 'A manufacturing company is facing a confirmed demand of ₹6,00,000 u/s 74A. It applies for instalments. The Commissioner, after checking financial status, can allow 24 monthly payments of ₹25,000 each with interest. If they miss the 5th payment, the PO has the power to provisionally attach their bank account u/s 83.'
        }
      ],
      visualBreakdown: {
        title: 'GST Demands, Penalties and Recovery Timelines',
        type: 'table',
        headers: ['Compliance Event / Action', 'Governing Provision', 'Concession / Requirement details', 'Statutory Limitation / Grace Period'],
        rows: [
          ['Show Cause Notice (SCN) issuance', 'Section 74A(2)', 'Uniform SCN for both fraud and non-fraud cases', '42 Months (3.5 years) from GSTR-9 due date'],
          ['Adjudication Order issuance', 'Section 74A(7)', 'Uniform limit; extendable by JC/AC for up to 6 months', '12 Months (1 year) from SCN service date'],
          ['Unpaid Self-Assessed Tax', 'Section 74A(11)', 'Non-payment u/s 39 beyond 30 days of due date', 'Penalty: Higher of 10% of tax or ₹10,000 (No waiver)'],
          ['Instalment Option Request', 'Section 80', 'Requires written application; excludes self-assessed tax', 'Max 24 monthly instalments (Min amount ₹25,000)'],
          ['Provisional Bank Attachment', 'Section 83(1)', 'Ordered by Commissioner to safeguard revenue u/s 122(1A)', 'Ceases to have effect 1 Year from order date'],
          ['Recovery Initiation Order', 'Section 78', 'Compulsory period before initiating recovery u/s 79', '3 Months from service of adjudication order']
        ]
      }
    },
    {
      chapterName: 'Liability to Pay in Certain Cases',
      keyPrinciples: [
        {
          title: 'Liability on Transfer of Business & Proprietor Death [Section 85]',
          description: 'Section 85 dictates that when a taxable person liable to pay tax under the GST Act transfers their business in whole or in part by sale, gift, lease, leave and license, hire, or in any other manner, the transferor and the transferee shall, jointly and severally, be liable to pay the tax, interest, or penalty due from the taxable person up to the time of such transfer, whether determined before or after the transfer.',
          exception: 'Under Circular No. 96/15/2019-GST, when the change in ownership/transfer is due to the death of a sole proprietor, the transferee (legal successor) shall still be liable to pay any tax, interest, or penalty outstanding from the transferor.',
          example: 'Mr. X sells his chemical retail business to Mr. Y. After the transfer, the department unearths a short payment of ₹4,00,000 pertaining to X\'s tenure. Both Mr. X and Mr. Y are jointly and severally liable to pay the ₹4,00,000 with interest.'
        },
        {
          title: 'Amalgamation, Merger of Companies & Agent Liability [Sections 86 & 87]',
          description: 'Section 86 states that where an agent supplies or receives any taxable goods on behalf of their principal, both the agent and principal shall, jointly and severally, be liable to pay the tax. Under Section 87, when two or more companies are amalgamated or merged in pursuance of a court/tribunal order, they are treated as distinct companies for the period up to the date of the order. Inter-se supplies made between them during the retrospective period (from the order date of effect till actual physical order date) must be included in their respective turnovers and are fully taxable.',
          exception: 'The registration certificates of the amalgamated companies shall only be cancelled with effect from the physical date of the amalgamation/merger order.',
          example: 'Company A and B amalgamate with effect from April 1, but the High Court order is passed on October 1. Supplies made between A and B during this period are subject to GST, as both companies are treated as distinct up to October 1.'
        },
        {
          title: 'Winding Up, Company in Liquidation & Director Liability [Sections 88 & 89]',
          description: 'Section 88 mandates that any person appointed as a liquidator of a company must intimate their appointment to the Commissioner within 30 days of appointment. The Commissioner must notify the liquidator within 3 months of the estimated tax, interest, or penalty liability. If a private company is wound up and the outstanding tax remains unrecovered, every person who was a director during the default period is jointly and severally liable for its payment u/s 88(3) and 89(1).',
          exception: 'A director can escape this joint and several liability only if they prove to the satisfaction of the Commissioner that such non-recovery cannot be attributed to any gross neglect, misfeasance, or breach of duty on their part.',
          example: 'A private firm goes into liquidation with an outstanding GST liability of ₹5,00,000. If the amount cannot be recovered, the department will recover the dues from the personal assets of the directors jointly and severally, unless they prove they exercised complete due diligence.'
        },
        {
          title: 'Liability of Partners of Firm & Retirement Rules u/s 90 & 94',
          description: 'Section 90 of the CGST Act establishes that a firm and each of its partners are jointly and severally liable to pay any tax, interest, or penalty of the firm. When a partner retires, they or the firm must intimate the date of retirement in writing to the Commissioner. The retiring partner is only liable to pay tax, interest, or penalty due up to the date of retirement (whether determined before or after retirement).',
          exception: 'If no written intimation is given to the Commissioner within 1 month from the date of retirement, the liability of the retiring partner continues until the date on which the intimation is physically received u/s 90(2) / 94(2).',
          example: 'A partner retires on June 1 but the retirement notice is served on the Commissioner on August 15. The partner remains jointly and severally liable for any tax defaults committed by the firm up to August 15, even though they physically retired on June 1.'
        },
        {
          title: 'Taxpayer Death, HUF Partition & Legal Representatives u/s 93',
          description: 'Under Section 93(1), on the death of a person liable to pay tax: (a) If the business is continued by their legal representative (LR) or successor, the successor is liable to pay all tax/interest/penalty. (b) If the business is discontinued, the LR is liable to pay the dues out of the estate of the deceased. Under Section 93(2), if a Hindu Undivided Family (HUF) or AOP is partitioned, each member/group is jointly and severally liable for the tax due up to the time of partition.',
          exception: 'Where the business is discontinued after death, the legal representative is liable only to the extent to which the estate of the deceased is capable of meeting the tax charge, protecting personal assets.',
          example: 'A sole proprietor dies with unpaid GST of ₹3,00,000. The family decides to shut down the business. The legal heir is liable to pay the ₹3,00,000 only up to the total value of the assets inherited from the deceased proprietor\'s estate.'
        }
      ],
      visualBreakdown: {
        title: 'GST Liability Delegation & Corporate Restructuring Rules',
        type: 'table',
        headers: ['Restructuring / Entity Change', 'Governing Section', 'Primary Liable Person / Successor', 'Liability Scope & Limitations'],
        rows: [
          ['Transfer of Business (Sale, Lease, Gift)', 'Section 85(1)', 'Transferor & Transferee (Jointly & Severally)', 'Wholly or to the extent of such transfer for outstanding dues'],
          ['Corporate Amalgamation / Merger', 'Section 87(1)', 'Individual companies as distinct u/s 87(2)', 'Supplies between entities remain taxable until the physical court order date'],
          ['Winding Up of Private Company', 'Section 88(3) & 89(1)', 'Directors of the private firm (Jointly & Severally)', 'Liable u/s 89(1) unless gross neglect, misfeasance or breach is disproved'],
          ['Partner Retirement from Firm / LLP', 'Section 90 & 94', 'Retiring Partner (Jointly & Severally with firm)', 'Limited to retirement date if notice given within 1 month, else till notice receipt'],
          ['Death of Taxpayer (Business Continued)', 'Section 93(1)(a)', 'Legal Representative or Successor u/s 93', 'Fully liable for the deceased taxpayer’s outstanding GST dues'],
          ['Death of Taxpayer (Business Discontinued)', 'Section 93(1)(b)', 'Legal Representative u/s 93(1)(b)', 'Liable to pay tax solely to the extent of inherited estate value'],
          ['Partition of a HUF or AOP', 'Section 93(2)', 'Each Member / Group of Members (Jointly & Severally)', 'Liable for tax, interest or penalty due up to the time of partition']
        ]
      }
    },
    {
      chapterName: 'Offences and Penalties',
      keyPrinciples: [
        {
          title: 'Statutory Penalties under Section 122 & General Disciplines u/s 126',
          description: 'Section 122(1) prescribes an administrative penalty for 21 designated offences (including supplying without invoice, issuing invoice without supply, fraudulent ITC, fake records, failing to register, etc.). The penalty is ₹10,000 or an amount equal to tax evaded / tax not deducted / short deducted / tax not collected / ITC wrongly availed / refund fraudulently obtained, whichever is HIGHER (IGST is double, i.e., ₹20,000 or tax). For registered persons, Section 122(2) specifies that short-payment of tax or wrong ITC due to non-fraud has a penalty of ₹10,000 or 10% of tax, whichever is higher, whereas fraud has a penalty of ₹10,000 or 100% of tax, whichever is higher.',
          exception: 'Under Section 126, no penalty shall be imposed for minor breaches (where tax involved is less than ₹5,000) or easily rectifiable mistakes in documentation made without fraudulent intent. A written opportunity of being heard is mandatory u/s 126(3) before imposing any penalty.',
          example: 'A registered supplier overlooks GSTR-3B matching and short pays ₹2,00,000 CGST+SGST. In the absence of fraud, the penalty u/s 122(2)(a) is ₹20,000 (10% of tax), as it is higher than the base limit of ₹10,000.'
        },
        {
          title: 'Penalty u/s 122(1A) on Beneficiaries & Transit Detention u/s 129',
          description: 'Section 122(1A) levies a mandatory penalty on any person who retains the benefit of select major offences (supply without invoice, fake invoice, or fraudulent ITC) and at whose instance such transaction is conducted; the penalty is equivalent to the tax evaded or ITC availed. Under Section 129, when goods are transported or stored in transit in contravention of GST rules, all such goods, documents, and the conveying vehicle are subject to detention or seizure.',
          exception: 'Where an order of detention is issued u/s 129, the proper officer must issue a notice specifying the penalty payable within 7 days of detention, and pass a final order within 7 days of notice service, after an opportunity of being heard.',
          example: 'An unregistered investor sets up a dummy firm, utilizes ₹15 Lakh fake ITC, and runs. The developer at whose instance this was done (the beneficiary) is caught. Under Section 122(1A), they are penalized ₹15 Lakh (100% of ITC) personally.'
        },
        {
          title: 'Physical Release of Seized Goods, Conveyances & E-way Bill Errors u/s 129',
          description: 'Seized goods u/s 129 shall be released on payment of penalty: (a) If owner comes forward: 200% of tax payable on taxable goods, or for exempt goods, the lower of 2% of goods value or ₹25,000. (b) If owner does not come forward: 50% of goods value or 200% of tax payable, whichever is higher on taxable goods. Conveyance is released on payment of penalty or ₹1,00,000, whichever is less. Further, under Circular No. 64/38/2018-GST, minor errors on documents (e.g., spelling errors, Pin-code digit errors, address locality mismatch, HSN first 2 digits correct, 1-2 digits vehicle number error) do NOT warrant transit detention u/s 129.',
          exception: 'A nominal penalty of ₹500 each under Section 125 and SGST (total ₹1,000) must be imposed on a delivery challan in case of minor e-way bill errors, without initiating detention u/s 129.',
          example: 'A truck carrying goods worth ₹5,00,000 (having ₹90,000 tax) is intercepted with no e-way bill. If the owner comes forward u/s 129(1)(a), the penalty for releasing the goods is ₹1,80,000 (200% of tax).'
        },
        {
          title: 'Confiscation of Goods u/s 130 and Prosecution Thresholds u/s 132',
          description: 'Section 130 authorises confiscation of goods or conveyances used for tax evasion and provides an option to pay a redemption fine in lieu of confiscation u/s 130(2); the fine cannot exceed the market value of goods less tax, and fine + penalty must not be less than 100% of the tax payable. Regarding prosecution u/s 132, committing specified offences (supplying without invoice, issuing invoices without supply, fraudulent ITC, failing to deposit tax beyond 3 months) is punishable with imprisonment: (1) Tax evaded > ₹5 Crore: up to 5 years (cognizable and non-bailable). (2) Tax evaded ₹2 Crore - ₹5 Crore: up to 3 years (non-cognizable and bailable). (3) Fake invoices ₹1 Crore - ₹2 Crore (u/s 132(1)(b)): up to 1 year.',
          exception: 'Under Section 132(6), a person cannot be prosecuted in a criminal court except with the prior written sanction of the Commissioner.',
          example: 'A firm evades tax worth ₹6 Crore. Since the amount exceeds ₹5 Crore, the offence is cognizable and non-bailable u/s 132(5), and the arrest can be made without a warrant on the Commissioner’s written authorization.'
        },
        {
          title: 'Compounding of Offences u/s 138 & Mandatory CA Certifications',
          description: 'Section 138 permits the Commissioner to compound any prosecution before or after institution, on payment of a compounding fee between 25% (minimum) and 100% (maximum) of the tax involved. Regarding ethics, CA/CWA certification is statutorily required under GST: (1) Form GST ITC-01 u/s 18(1) (stock claims exceeding ₹2,00,000), (2) Form GST ITC-02 u/s 18(3) (unutilized ITC transfer showing specific transfer of liabilities on demerger/merger), (3) Form GST RFD-01 Annexure 2 non-unjust enrichment u/s 54 (refunds exceeding ₹2,00,000), (4) Reversal of ITC u/s Rule 44(5) on composition/cancellation where tax invoices are unavailable.',
          exception: 'Compounding u/s 138 is strictly barred for any person who has been allowed to compound once for serious offences, or who has been convicted by a court, or who is accused of fake invoicing as specified u/s 132(1)(b).',
          example: 'A pharmaceutical company wants to claim a refund of unutilized ITC of ₹3,50,000. It must obtain a certificate in Annexure 2 from a practicing Chartered Accountant or Cost Accountant certifying that the tax burden has not been passed on to customers.'
        }
      ],
      visualBreakdown: {
        title: 'GST Offences, Detention & Prosecution Penalties',
        type: 'table',
        headers: ['Action / Infraction Type', 'Governing Section', 'Financial Penalty / Imprisonment Limits', 'Bailability & Legal Treatment Standards'],
        rows: [
          ['Transit Seizure (Owner comes forward)', 'Section 129(1)(a)', 'Penalty equal to 200% of the tax payable on goods', 'Release on payment or u/s INS-04 bond security'],
          ['Transit Seizure (Owner absent / silent)', 'Section 129(1)(b)', 'Penalty: Higher of 50% of goods value or 200% of tax', 'Release on payment or u/s INS-04 bond security'],
          ['Minor e-way bill / document errors', 'Section 125 & Cir 64', 'Fixed nominal penalty of ₹1,000 (combined CGST+SGST)', 'Transit detention u/s 129 cannot be initiated'],
          ['Major Offence Beneficiary / Mastermind', 'Section 122(1A)', 'Penalty equal to 100% of the tax evaded or ITC passed', 'Civil administrative penalty u/s 122(1A)'],
          ['General Tax Law Contraventions', 'Section 125', 'General residual penalty up to ₹25,000', 'Discretionary, based on gravity of breach'],
          ['Evasion / Fake Credit > ₹5 Crore', 'Section 132(1)(i)', 'Imprisonment up to 5 years, plus mandatory fine u/s 132', 'Cognizable and non-bailable u/s 132(5)'],
          ['Evasion / Fake Credit ₹2 Crore - ₹5 Crore', 'Section 132(1)(ii)', 'Imprisonment up to 3 years, plus mandatory fine u/s 132', 'Non-cognizable and bailable u/s 132(4)'],
          ['Fake Invoices ₹1 Crore - ₹2 Crore', 'Section 132(1)(b)', 'Imprisonment up to 1 year, plus mandatory fine u/s 132', 'Non-cognizable and bailable u/s 132(4)'],
          ['Refusal to answer Summons u/s 70', 'Section 122(3)(d)', 'Penalty which may extend up to ₹25,000', 'Administrative penalty on non-appearance']
        ]
      }
    },
    {
      chapterName: 'Appeals and Revision',
      keyPrinciples: [
        {
          title: 'Statutory Right & Pre-deposit to Taxpayer Appeals u/s 107',
          description: 'A taxpayer aggrieved by any decision/order passed by an Adjudicating Authority can appeal u/s 107(1) in Form GST APL-01 within 3 months from its communication date. AA can condone up to 1 month of delay. Under Section 107(6), the appeal is inadmissible unless the appellant pays the full admitted tax, interest, fine, fee, and penalty, plus a mandatory pre-deposit of 10% of the disputed tax (capped at ₹20 Crore CGST + ₹20 Crore SGST, i.e., ₹40 Crore IGST).',
          exception: 'Finance Act, 2025 amends Section 107(6) to introduce a mandatory pre-deposit of 10% of the penalty in dispute for appeals involving only penalty disputes without any tax demand.',
          example: 'An assessment order demands ₹12,00,000 tax plus penalty of ₹1,20,000. The taxpayer admits ₹2,00,000 tax, and wishes to dispute the remaining ₹10,00,000 tax. Pre-deposit required is: Admitted tax (₹2,00,000) + 10% of disputed tax (10% of ₹10,00,000 = ₹1,00,000), totaling ₹3,00,000. Balance disputed amount (₹9,00,000 plus penalty) receives a deemed stay.'
        },
        {
          title: 'Departmental Appeals (Review Applications) u/s 107(2)',
          description: 'If the Commissioner does not agree with the legality or propriety of any adjudication order, they can direct a subordinate officer u/s 107(2) to file an appeal/review application before AA in Form GST APL-03. This must be filed within 6 months from the date of communication of the order (extendable up to 1 month by AA). Departmental appeals are treated exactly as taxpayer appeals but have specific exemptions.',
          exception: 'The Department is completely exempt from making any pre-deposit before filing a review application u/s 107(2).',
          example: 'A Joint Commissioner drops a demand of ₹50,000,000. The Commissioner, on scrutiny, finds the order improper and directs an Assistant Commissioner to file a review petition with the Appellate Authority within 6 months. No pre-deposit is submitted.'
        },
        {
          title: 'Revisional Powers of Revisional Authority u/s 108',
          description: 'Revisional Authority (Principal Commissioner/Commissioner) can call for records and modify, enhance, or annul any order passed by subordinate officers if it is erroneous, illegal, improper, or prejudicial to the interest of revenue u/s 108. The RA can stay the subordinate order.',
          exception: 'RA cannot revise an order if: (a) it has already been appealed before AA/GSTAT/HC/SC; (b) the period of 6 months has not expired or 3 years have expired from communication; (c) it is already taken for revision; (d) the order is itself a revisional order. However, RA can revise any non-appealed points within 1 year of the appeal order or 3 years of the initial order, whichever is later.',
          example: 'An adjudication order is communicated on May 25, 2025. The RA can suo moto call for records and initiate revision proceedings only between November 26, 2025 (after 6 months) and May 25, 2028 (within 3 years).'
        },
        {
          title: 'GSTAT Hierarchy, Benches, and Single Member Threshold u/s 109-111',
          description: 'GSTAT comprises a Principal Bench (New Delhi) which exclusively hears cases involving place of supply or anti-profiteering, and State Benches. GSTAT has the powers of a civil court. To expedite cases, a single GSTAT Member can hear appeals with the President\'s approval.',
          exception: 'GSTAT appeals can be heard by a Single Member only if the tax, ITC, fine, fee, or penalty in dispute does not exceed ₹50,00,000 (₹50 Lakh) and the dispute involves no substantial question of law.',
          example: 'A taxpayer files a GSTAT appeal regarding a dispute of ₹15,00,000 CGST on registration cancellation. Since it does not exceed ₹50 Lakh and has no question of law, it can be heard by a single Member.'
        },
        {
          title: 'GSTAT Appeals, Pre-deposits, and Rectifications u/s 112 & 113',
          description: 'Aggrieved persons can appeal an AA/RA order before GSTAT in Form GST APL-05 within 3 months of communication (6 months for Department), with delay condonable up to 3 months. Cross-objections can be filed in APL-06 within 45 days. GSTAT can rectify apparent mistakes u/s 113(3) within 3 months of the order date. GSTAT pre-deposit is 10% of the disputed tax in addition to the 10% paid before AA (making it cumulative 20%), capped at ₹20 Crore CGST/SGST (₹40 Crore IGST).',
          exception: 'GSTAT has absolute discretion to refuse to admit an appeal if the tax, ITC, fine, fee, or penalty in dispute does not exceed ₹50,000.',
          example: 'GSTAT receives an appeal where the disputed penalty is ₹35,000. GSTAT reserves the right to reject/dismiss the appeal as the dispute amount falls below the ₹50,000 portal admission threshold.'
        },
        {
          title: 'Higher Judiciary Appeals & Monetary Limits u/s 117, 118 & 120',
          description: 'Appeals from State Benches of GSTAT lie to the High Court u/s 117 within 180 days if involving a substantial question of law. Appeals from Principal Bench of GSTAT (POS/anti-profiteering cases) lie DIRECTLY to the Supreme Court u/s 118, bypassing the High Court. To limit litigation, Section 120 prescribes department-only filing monetary limits: GSTAT (₹20 Lakh), High Court (₹1 Crore), Supreme Court (₹2 Crore).',
          exception: 'Department monetary limits do not apply if a statutory provision, rule, or circular is held ultra vires, or if the case involves classification, valuation, refunds, or place of supply.',
          example: 'The Department wishes to appeal a GSTAT order on place of supply to the Supreme Court. Although the tax involved is only ₹15 Lakh (which is below the ₹2 Crore limit), the department can file the appeal because place of supply and classification cases are completely excluded from the monetary limit restriction.'
        }
      ],
      visualBreakdown: {
        title: 'Appellate Timelines, Pre-deposit Ratios & Monetary Caps',
        type: 'table',
        headers: ['Appellate Forum / Stage', 'Filing Timeline', 'Admissibility Pre-deposit Requirements', 'Maximum Monetary Cap / Limitation Rules'],
        rows: [
          ['Appellate Authority (AA) - Taxpayer Appeal', '3 Months u/s Sec 107(1)', 'Admitted dues in full + 10% of disputed tax', 'Disputed tax cap: ₹20 Crore CGST + SGST (₹40 Crore IGST)'],
          ['Appellate Authority (AA) - Department Appeal', '6 Months u/s Sec 107(2)', 'Exempt (No pre-deposit required)', 'Delay condonable by 1 month if sufficient cause shown'],
          ['Revisional Authority (RA) - Revision Order', 'Between 6 months & 3 years', 'Exempt (Suo-moto revision u/s Sec 108)', 'No revision if order is subject to appeal or is revisional'],
          ['Appellate Tribunal (GSTAT) - Taxpayer Appeal', '3 Months u/s Sec 112(1)', 'Admitted dues + 20% of disputed tax cumulative', 'Disputed tax cap: ₹20 Crore CGST + SGST (₹40 Crore IGST)'],
          ['GSTAT Single Member Bench Option', 'Discretionary u/s Sec 109', 'Disputed tax/ITC/penalty must not exceed ₹50 Lakh', 'Must not involve any substantial question of law'],
          ['Appellate GSTAT Rectification of Mistakes', '3 Months u/s Sec 113(3)', 'Exempt (No fee u/s rectification appeals)', 'Apparent mistakes only; GSTAT possesses no review power'],
          ['Appeal to High Court (State Benches)', '180 Days u/s Sec 117(1)', 'Deposit of all adjudged tax dues is required', 'Requires high court satisfaction of substantial question of law'],
          ['Appeal to Supreme Court (POS / Principal Bench)', 'Direct appeal u/s Sec 118', 'Deposit of all adjudged tax dues is required', 'Bypasses High Court directly for place of supply cases'],
          ['Department Monetary Limits (GSTAT / HC / SC)', 'Pre-filing threshold cap', 'No Department appeal below limit u/s Sec 120', 'Limits: GSTAT (₹20L), High Court (₹1Cr), Supreme Court (₹2Cr)']
        ]
      }
    },
    {
      chapterName: 'Advance Ruling',
      keyPrinciples: [
        {
          title: 'Statutory Scope, Eligibility & Place of Supply Block u/s 95 & 97',
          description: 'An Advance Ruling is a binding decision provided by AAR, AAAR, or NAAR u/s 95(a) to an applicant (registered or desirous of being registered) on questions specified under Section 97(2) regarding supply of goods/services. Under Section 97(2), rulings can be sought for classification, notifications, time/value, ITC eligibility, liability to pay tax, and registration obligations.',
          exception: 'AAR/AAAR are strictly barred from answering any questions relating to the determination of Place of Supply, since they are state-level bodies and lack inter-state jurisdiction.',
          example: 'Ranjan wants to supply goods from Delhi to US and wants an advance ruling on: (1) classification of goods, and (2) place of supply u/s US export. Ranjan can seek ruling for classification u/s 97(2)(a), but the AAR will reject the place of supply question as outside its statutory jurisdiction.'
        },
        {
          title: 'AAR Admissibility, Fees & Strict 90-day Pronouncement u/s 98',
          description: 'An application u/s 97 must be filed on the common portal with a fee of ₹5,000 CGST + ₹5,000 SGST (total ₹10,000). AAR will send a copy to the officer, call for records, and must either admit or reject the application. Once admitted, AAR must pronounce its ruling in writing within 90 days of receiving the application, after hearing both parties.',
          exception: 'An application for advance ruling shall NOT be admitted u/s 98(2) if the question raised is already pending or decided in any proceedings in the case of the applicant under any provisions of the Act.',
          example: 'An audit is underway for a company in Rajasthan, and the proper officer has raised a discrepancy on ITC on motor vehicles. The company cannot file an AAR application on this same vehicle ITC question, as the matter is already active under audit proceedings.'
        },
        {
          title: 'AAAR Appeals, Timelines, Fees & Difference of Opinion u/s 100 & 101',
          description: 'If the applicant or Department is aggrieved by an AAR ruling, they can appeal to AAAR u/s 100 within 30 days of communication (extendable by 30 days). The appeal carries a fee of ₹10,000 CGST + ₹10,000 SGST (total ₹20,000) for taxpayers, and NIL for Department. AAAR must pass a final order within 90 days.',
          exception: 'If the two members of AAR differ in opinion, they refer the matter to AAAR. If the members of AAAR also differ, it is deemed that no advance ruling can be issued for that question.',
          example: 'The Rajasthan AAR has two members. They differ on a product\'s taxability. They refer to the Rajasthan AAAR. If the AAAR members also differ, they must issue an order stating no advance ruling can be passed, leaving the taxpayer to pursue standard paths.'
        },
        {
          title: 'Personal Binding Validity, Rectification & Fraud Nullification u/s 102, 103 & 104',
          description: 'Under Section 103, an advance ruling is binding in personam (only on the applicant and their jurisdictional tax officer), not in rem (does not apply to the world). It remains binding unless there is a change in the underlying law, facts, or circumstances. Under Section 102, AAR/AAAR can rectify apparent errors within 6 months of the order date. Under Section 104, if a ruling was obtained by fraud, suppression of material facts, or misrepresentation, it can be declared void ab-initio.',
          exception: 'Under Section 103(1A), a ruling pronounced by the National Appellate Authority for Advance Ruling (NAAR) u/s conflicting state rulings is binding across the country on all applicants/registered persons sharing the same PAN.',
          example: 'Supplier A gets a favorable classification advance ruling. Supplier B (a competitor in the same market) cannot legally claim rights or protection under Supplier A\'s ruling, as it is binding only on Supplier A and their respective officer.'
        }
      ],
      visualBreakdown: {
        title: 'Advance Ruling Forums, Timelines & Appeal Rules',
        type: 'table',
        headers: ['Advance Ruling Stage / Forum', 'Filing / Order Timelines', 'Statutory Fees Required', 'Binding Validity & Condonation Limits'],
        rows: [
          ['AAR Application (Goods or Services)', '90 Days u/s Sec 98(6)', '₹5,000 CGST + ₹5,000 SGST (₹10,000)', 'Binding only on the applicant and their respective proper officer'],
          ['AAR Place of Supply Question', 'Strictly prohibited u/s Sec 97', 'Not applicable (AAR lacks POS jurisdiction)', 'Questions are rejected; POS lies exclusively with GSTAT Principal Bench'],
          ['Appeal to AAAR (Taxpayer / Department)', '30 Days u/s Sec 100(1)', '₹10,000 CGST + SGST each (Department: NIL)', 'Condonation delay up to 30 days maximum, order in 90 days'],
          ['AAR / AAAR Rectification of Mistakes', '6 Months u/s Sec 102', 'Exempt (Suo-moto or on reference)', 'Corrects errors apparent; must hear applicant if tax increases'],
          ['National Appellate Authority (NAAR)', '90 Days u/s Sec 101C', 'As prescribed under CGST Rules', 'Nationwide binding across all applicants sharing the same PAN'],
          ['Advance Ruling Void ab-initio Order', 'Ex-post facto u/s Sec 104', 'Exempt (AAR/AAAR order after hearing)', 'Voided due to fraud or suppression; period excluded from Sec 74A limit']
        ]
      }
    },
    {
      chapterName: 'Miscellaneous Provisions',
      keyPrinciples: [
        {
          title: 'Presumptions as to Documents & Deemed Electronic Evidence u/s 144 & 145',
          description: 'Under Section 144, if any doc is produced, seized, or received from outside India and tendered by the prosecution as evidence, the court must presume: (a) truth of its contents, (b) handwriting/signature belongs to the specified person, (c) it was duly executed/attested. Section 145 establishes that microfilms, facsimile copies, and computer printouts/information stored electronically in ERP systems shall be deemed as "documents" and admissible in evidence without further proof or production of the original.',
          exception: 'Admissible documents u/s 144 do not require to be stamped, overriding the general inadmissibility of unstamped documents under the Stamp Act, 1899.',
          example: 'During a search u/s 67, an excel printout of parallel sales records is seized. Under Section 145, this printed sheet is fully admissible as documentary evidence before the court. The taxpayer cannot object that the original server has not been produced.'
        },
        {
          title: 'Public Servant Obligations, Confidences & Consent Sharing u/s 152, 158 & 158A',
          description: 'Section 158 mandates that all details, statements, or returns furnished by a taxpayer are highly confidential, and public servants are barred from disclosing them. To facilitate credit and compliance ranking, Section 158A permits the common portal to share registration, GSTR-1, and GSTR-3B filings with other authorized systems (e.g., Account Aggregators, Public Tech Platform for Frictionless Credit) with the explicit consent of the supplier/recipient.',
          exception: 'Disclosure of taxpayer information is permitted u/s 158(3) for specified purposes (e.g., prosecutions under Indian Penal Code, audits of tax receipts, or inquiries into professional misconduct of CAs).',
          example: 'An overseas OIDAR supplier Doodle LLC is being investigated. The Enforcement Directorate requests their transaction tables. The jurisdictional officer can share their GST records, as Section 158(3) permits sharing for inquiries/prosecutions under any other law.'
        },
        {
          title: 'Section 160 Proceedings Validity & Apparent Error Rectification u/s 161',
          description: 'Section 160 saves tax proceedings from minor legal challenges. No assessment, notice, adjudication, review, revision, or summons shall be held invalid merely due to a clerical mistake, defect, or omission, if they are in substance and effect in conformity with the intent and requirements of the Act. Under Section 161, any authority can rectify an error apparent on the face of record in any decision, order, notice, or certificate within 6 months of its date of issue.',
          exception: 'The 6-month limitation u/s 161 does NOT apply to rectifying errors which are purely in the nature of clerical or arithmetical mistakes arising from accidental slips or omissions.',
          example: 'A final demand order of ₹4,50,000 has a typo reading ₹45,00,000 in one paragraph due to a typing slide. The taxpayer brings this to the officer\'s notice 9 months after the order. Since this is an arithmetical mistake from an accidental slip, the officer can rectify it u/s 161 even though the 6-month limit has expired.'
        },
        {
          title: 'Rounding Off, Anti-Profiteering & Sunset u/s 170 & 171',
          description: 'Under Section 170, the final consolidated amount of GST, interest, penalty, fine, or refund must be rounded off to the nearest rupee (paise >= 50 rounded up to ₹1, paise < 50 ignored). Under Section 171, any reduction in tax rates or benefit of ITC must be passed on to consumers via a commensurate reduction in prices. Principal Bench of GSTAT is empowered to examine and handle anti-profiteering.',
          exception: 'The rounding-off rule u/s 170 does NOT apply to individual tax invoices issued to customers; it only governs the final consolidated tax liability paid to the Government. Further, anti-profiteering u/s 171 has a sunset date of 01.04.2025.',
          example: 'A builder receives input tax credit benefits worth ₹20,00,000 because of new GST rates u/s construction. They fail to reduce unit sizes or flat prices for buyers. Under Section 171, they are guilty of profiteering and can be ordered to refund the commensurate amount with 18% interest, or face a 10% penalty if default exceeds 30 days of the order.'
        }
      ],
      visualBreakdown: {
        title: 'Miscellaneous Compliance Rules & Special Procedures',
        type: 'table',
        headers: ['Miscellaneous Subject', 'Governing Provision', 'Compliance Mandate / Requirement', 'Statutory Limitation / Validity Limits'],
        rows: [
          ['Corporate Debtor Special Procedure (CIRP)', 'Section 148', 'Treat corporate debtor as a distinct person', 'New registration within 30 days of IRP/RP appointment'],
          ['Track and Trace Unique Marking u/s Goods', 'Section 148A', 'Affix non-removable secure unique mark on goods', 'Mandated for specified commodities to curb evasion (Finance Act 2025)'],
          ['GST Compliance Rating Score', 'Section 149', 'Revises and places taxpayer rating in public domain', 'Determined on a scale of 10 on returns and match records'],
          ['Mandatory Tax Rounding-off', 'Section 170', 'Consolidated tax, interest, penalty, refund', 'Nearest Rupee (Paise >= 50 raised; Paise < 50 ignored/dropped)'],
          ['Anti-Profiteering Commensurate Price Reduction', 'Section 171', 'Direct pass-on of rate cuts & credit gains', 'Sunset Date: 01.04.2025; 10% penalty if default > 30 days of order'],
          ['Adjudged Dues Mistake Rectification', 'Section 161', 'AAR/PO rectifies errors apparent from record', '6 Months from order date (clerical typo mistakes have no limit)'],
          ['Consent Based Taxpayer Details Sharing', 'Section 158A', 'Portal shares data with approved platforms', 'Explicit consent from supplier and recipient (Rule 163)'],
          ['Taking Expert Assistance During Inquiry', 'Section 153', 'Officer takes expert assistance (e.g. IT specialists)', 'Admissible at any stage of scrutiny, audit, or investigation']
        ]
      }
    },
    {
      chapterName: 'Levy of and Exemptions from Customs Duty',
      keyPrinciples: [
        {
          title: 'Constitutional Provisions & Territorial Boundaries (Unit-I)',
          description: 'Under Article 265, no tax can be levied or collected except by authority of law. The power to levy customs duty on imports and exports is derived from Article 246 read with Entry 83 of List I (Union List) of the Seventh Schedule to the Constitution of India. India’s territorial boundaries for customs extend through the Baseline (lower water mark along coast). The Territorial Waters of India (TWI) extend up to 12 nautical miles (nm) into the sea which includes the seabed below and airspace above. Indian Customs Waters (ICW) extend up to the outer limit of the Exclusive Economic Zone (EEZ), which is 200 nautical miles from the baseline. Powers of customs officers (to stop, arrest, and search vessels/persons) extend throughout the entire 200 nm Indian Customs Waters.',
          exception: 'The High Seas represent marine areas beyond the 200 nm line of the Exclusive Economic Zone (EEZ) and are beyond domestic customs jurisdiction.',
          example: 'A vessel carrying foreign cargo enters the 12 nm territorial waters. It is deemed as import. If a vessel is suspected of smuggling and is located 150 nm away from the baseline (within the EEZ), customs officers can still intercept and search the vessel as it is within the 200 nm Indian Customs Waters.'
        },
        {
          title: 'Customs Stations, Area, and Key Definitions (Unit-I)',
          description: 'Section 2 contains essential statutory definitions: (a) "Beneficial Owner" [Sec 2(3A)] is any person on whose behalf goods are imported/exported or who exercises effective control. (b) "Customs Station" [Sec 2(13)] is any customs port, customs airport, international courier terminal, foreign post office, or land customs station. (c) "Customs Area" [Sec 2(11)] is the area of a customs station or warehouse where imported/export goods are ordinarily kept before clearance. (d) "Warehouse" [Sec 2(43)] means a public warehouse (licensed u/s 57), private warehouse (licensed u/s 58), or special warehouse (licensed u/s 58A) for storing dutiable goods under bond.',
          exception: 'Customs area does not cover the high seas. Also, special warehouses u/s 58A store specifically notified sensitive goods (e.g., gold, silver, arms) and require continuous physical control by proper officers, unlike public/private warehouses.',
          example: 'A consignment of printed circuits arrives at Mumbai international airport (Customs Station). Before customs clearance, the goods are stored in a neighboring cargo terminal. This terminal is part of the "Customs Area" u/s 2(11), and its custodian is responsible for safe custody.'
        },
        {
          title: 'Charging Section 12 & Taxable Event (Unit-II)',
          description: 'Section 12 is the central charging provision of the Customs Act, 1962, which levies customs duties at the rates specified in the Customs Tariff Act, 1975, or other applicable laws, on goods imported into or exported from India. Sub-section (2) specifies that duties apply equally to goods belonging to the Government, meaning there is no general sovereign exemption. The taxable event for imports commences when goods cross the 12 nm territorial waters but is completed only when they cross customs barriers. For clearance for home consumption, the taxable event is reached when the goods reach customs barriers and the Bill of Entry for home consumption is filed (Garden Silk Mills v. UOI). For clearance for warehousing, the taxable event occurs when goods are eventually cleared from the warehouse for home consumption (UOI v. Apar Ltd. & Kiran Spinning Mills). For exports, the taxable event is completed when the vessel/conveyance carrying goods crosses the 12 nm territorial waters boundary of India.',
          exception: 'Imports by the Indian Navy, specific police and military equipment, or Coastal Guard are fully exempt from customs duty by virtue of specific notifications (though not generally exempt u/s Section 12).',
          example: 'A ship containing machinery from Japan enters Indian territorial waters (12 nm) on May 10, but the Bill of Entry is presented and goods are cleared at the customs dock on May 15. The taxable event is completed on May 15 when the import process is finalized at the customs barrier.'
        },
        {
          title: 'Re-Importation of Goods & Concessions u/s 20 (Unit-II)',
          description: 'Under Section 20, if goods produced or manufactured in India are exported and subsequently re-imported, they are generally treated on par with standard foreign imports and are liable to full duties. However, concessions are provided by CBIC: (a) Notification No. 45/2017-Cus provides that if goods are exported for repairs abroad and re-imported, duty is restricted to the basic customs duty, IGST, and cess calculated ONLY on: Fair Cost of Repairs + Cost of Materials used + Insurance & Freight charges BOTH ways (to and from). Conditions: re-import must happen within 5 years (extendable by 2 years, or 7 years for Bhutan), the goods must remain the same (no re-manufacturing/melting), and ownership must not have changed. (b) Notification No. 158/95-Cus exempts goods manufactured in India and re-imported for repairs/reconditioning from basic customs duty and IGST, subject to: re-import within 3 years (10 years for Nepal/Bhutan), executing a continuity bond, and re-exporting within 6 months (extendable to 1 year).',
          exception: 'These re-import concessions do not apply if the goods were originally exported by a 100% Export Oriented Undertaking (EOU) or a unit in a Free Trade Zone (FTZ), or from a public/private bond warehouse, or consist of tobacco/petroleum products under the Fourth Schedule of Central Excise.',
          example: 'An Indian manufacturer exports a machine worth ₹50,00,000 for repairs abroad. Repairs cost ₹5,00,000, and freight/insurance both ways is ₹3,00,000. Upon re-import, instead of paying duty on ₹50,00,000, the manufacturer pays duty only on the repair value of ₹8,00,000 u/s Notification 45/2017-Cus.'
        },
        {
          title: 'Goods Derelict, Wreck, Jetsam & Flotsam u/s 21 (Unit-II)',
          description: 'Section 21 mandates that all goods derelict, jetsam, flotsam and wreck brought or coming into India must be dealt with as if they were imported goods, and are liable to standard customs duty. "Derelict" refers to cargo or vessels abandoned in the sea with no hope of recovery. "Jetsam" refers to parts of cargo thrown overboard (jettisoned) to reduce weight and prevent a sinking ship, which subsequently sink. "Flotsam" refers to jettisoned goods that float on the water surface. "Wreck" refers to cargo, vessels, or property cast ashore by tides after a shipwreck.',
          exception: 'No duty is payable if it is proved to the satisfaction of the proper officer that the goods are entitled to be admitted duty-free under the Act.',
          example: 'Following a storm, 100 drums of oil floating in the sea (Flotsam) are washed onto the coast of Gujarat. Even though these were not intentionally imported, under Section 21 they are treated as imported goods, and any claimant must pay customs duty to clear them.'
        },
        {
          title: 'Customs Concessional Rate & Specified End-Use Rules, 2022 (Unit-II)',
          description: 'The Customs (Import of Goods at Concessional Rate of Duty or for Specified End Use) Rules, 2022 (IGCR) apply when an importer avails an exemption contingent on using imported inputs for a specific manufacture or end-use. The importer must submit one-time prior information on the common portal to generate an IGCR Identification Number (IIN), execute a continuity bond, and mention the IIN and bond number on the Bill of Entry to secure automatic credit. The importer must maintain a detailed account of imports, consumption, job work, and unit transfers, and file a compulsory Quarterly Statement on the portal by the 10th day of the following quarter. Unutilised or defective goods can be re-exported or cleared for home consumption within 1 year. For capital goods cleared after use, duty is payable on the depreciated value calculated using the straight-line method: 1st Year: @ 4% per quarter; 2nd Year: @ 3% per quarter; 3rd Year: @ 3% per quarter; 4th & 5th Year: @ 2.5% per quarter; thereafter: @ 2% per quarter.',
          exception: 'Unlike normal rules, in computing depreciation under IGCR, any part of a quarter is counted as a full quarter, and the depreciation period runs from the date of use to the date of clearance.',
          example: 'An importer purchases capital goods under IGCR on April 15 and clears them for home consumption on Oct 20 of the same year (spanning 3 quarters: Apr-Jun, Jul-Sep, Oct). The total depreciation is calculated for 3 full quarters at 4% per quarter, i.e., 12% total depreciation, and duty is paid on the remaining 88% value.'
        },
        {
          title: 'Pilferage, Remission & Abatement u/s 13, 22 & 23 (Unit-II)',
          description: 'Sections 13, 22, and 23 govern reliefs for lost, damaged, or stolen goods. (a) Section 13 (Pilferage): If imported goods are pilfered (stolen in small quantities) after unloading but before the proper officer makes an order for clearance (for home consumption or warehousing), the importer is NOT liable for duty. The port custodian is liable to pay the duty instead. (b) Section 23 (Remission): If goods are lost (other than pilferage, e.g., fire, flood, leakage) or destroyed naturally at any time before clearance for home consumption, the proper officer shall remit the duty. Section 23(2) also allows the owner to relinquish title (abandon goods) before the clearance order (u/s 47 or 60) to avoid paying duty, provided no offence has been committed. (c) Section 22 (Abatement): If goods are damaged or deteriorated before/during unloading, or due to an accident before examination, or in a warehouse before clearance, duty is charged proportionately on the reduced value: `Admitted Duty = Original Duty * (Damaged Value / Original Value)`.',
          exception: 'Section 13 (pilferage) does NOT apply to warehoused goods; if goods are stolen inside a warehouse, Section 23 (remission) applies, and the importer must prove the loss to get relief.',
          example: 'Cases of electronic chips are unloaded. During storage in the customs area, a fire destroys half the drums, and thieves steal 5 cases. For the 5 stolen cases (Pilferage u/s 13), the importer pays no duty and has no burden of proof. For the fire-destroyed drums (Loss u/s 23), the importer must prove the loss to obtain a duty remission from the Assistant Commissioner.'
        },
        {
          title: 'Denaturing, Mutilation & Exemption Powers u/s 24 & 25 (Unit-II)',
          description: 'Section 24 empowers the Central Government to make rules permitting denaturing or mutilation of imported goods that can be used for more than one purpose, making them unfit for other purposes (e.g., adding denaturants to imported Ethyl Alcohol to make it unfit for human consumption, thereby attracting a lower industrial tariff). Section 25 gives the Central Government the power to grant exemptions: (a) General Exemptions u/s 25(1) via notification in the Official Gazette (valid for 2 years till March 31 of the year immediately following the 2-year mark, subject to exceptions like trade agreements, FTP schemes, baggage, etc.). (b) Special/Ad-hoc Exemptions u/s 25(2) by a special order in exceptional public interest (order does not need Gazette publication). Under Section 25(2), no duty is collected if the leviable amount is ₹100 or less.',
          exception: 'A general exemption notification under Section 25 comes into effect on the date of its issue for publication in the Gazette (Ruchi Soya Industries v. UOI / Pankaj Jain Agencies). Specialized orders are communicated to the beneficiary directly.',
          example: 'An importer brings in un-denatured alcohol at a 150% duty scale. They request customs to denature it u/s 24. Denaturants are added. The spirit is now classified as industrial denatured spirit, and the importer pays a concessional 5% duty rate.'
        }
      ],
      visualBreakdown: {
        title: 'Customs Reliefs, Concessions, and Timelines Comparison',
        type: 'table',
        headers: ['Section / Provision', 'Nature of Relief / Concession', 'Triggering Conditions & Criteria', 'Key Statutory Limits & Timelines'],
        rows: [
          ['Section 13 (Pilferage)', 'Importer exempt from duty; Port Custodian pays', 'Stealing / Petty theft after unloading but before entry/clearance order', 'No time limit; relief ceases if goods are restored; does not apply to warehoused goods'],
          ['Section 22 (Abatement)', 'Duty reduced in proportion to value reduction', 'Goods damaged or deteriorated: (1) before/during unloading, (2) before examination, (3) in warehouse', 'Proportional formula: Original Duty * (Damaged Value / Original Value)'],
          ['Section 23(1) (Remission)', 'Full remission of duty on lost/destroyed goods', 'Total loss of goods (fire, flood, leakage, act of God) before clearance', 'No time limit; applies to both customs area and bonded warehouses'],
          ['Section 23(2) (Abandonment)', 'No duty liability on relinquishing title to goods', 'Importer unconditionally relinquishes title before clearance u/s 47/60', 'Prohibited if any offense has been committed under the Customs Act or other laws'],
          ['Section 24 (Mutilation)', 'Lower duty rate based on altered final form', 'Goods can be used for multiple purposes; made unfit for other purposes', 'Applies on request of owner; subject to Denaturing of Spirit Rules, 1972'],
          ['Section 25(2) (Special Order)', 'Specific ad-hoc exemption for exceptional cases', 'Granted in exceptional public interest by special order', 'Mandatory: No duty is collected if total duty is ₹100 or less; no Gazette publication required'],
          ['Notification 45/2017-Cus', 'Duty only on repair cost + materials + freight/insurance', 'Goods exported for repairs and subsequently re-imported', 'Re-import within 5 years (extendable by 2 years); same goods; ownership must not change'],
          ['Notification 158/95-Cus', 'Full exemption from basic customs duty & IGST', 'Goods manufactured in India and re-imported for repairs/reconditioning', 'Re-import within 3 years (10 years for Nepal/Bhutan); re-export within 6 months (extendable to 1 year)'],
          ['Section 25A (Inward Processing)', 'Full or partial duty exemption on imports', 'Inputs/goods imported for repairs, further processing, or manufacture', 'Must be re-exported within 1 year from the date of clearance order'],
          ['Section 25B (Outward Processing)', 'Full or partial duty exemption on re-imports', 'Goods exported for repairs, further processing, or manufacture', 'Must be re-imported within 1 year from the date of export clearance order'],
          ['IGCR Rules, 2022 (Depreciation)', 'Straight-line depreciation for capital goods', 'Capital goods imported at concession and subsequently cleared', 'Depreciation: 1st yr 4%/qtr, 2nd & 3rd yr 3%/qtr, 4th & 5th yr 2.5%/qtr, thereafter 2%/qtr (part qtr counted as full)']
        ]
      }
    },
    {
      chapterName: 'Types of Duty',
      keyPrinciples: [
        {
          title: 'Classification of Customs Duties (BCD & SWS)',
          description: 'Basic Customs Duty (BCD) is the standard ad valorem or specific duty levied under Section 12 of the Customs Act and Section 2 of the Customs Tariff Act (CTA). The standard non-agricultural import rate is generally 10%. Social Welfare Surcharge (SWS) is levied under Section 110 of the Finance Act 2018 @ 10% on the aggregate of all customs duties u/s 12 (essentially 10% of BCD). SWS is calculated by excluding safeguard duty u/s 8B, countervailing duty u/s 9, anti-dumping duty u/s 9A, and SWS itself.',
          exception: 'Lower preferential rates of BCD apply to goods imported from notified "preferential areas" provided the importer files a specific claim and satisfies rules of origin u/s Section 4 of the CTA.',
          example: 'An import consignment has an Assessable Value of ₹10,00,000 and is subject to 10% BCD. BCD = ₹1,00,000. Social Welfare Surcharge (SWS) @ 10% is levied on BCD, i.e., ₹10,00,000 * 10% * 10% = ₹10,00,000 * 1% = ₹10,000.'
        },
        {
          title: 'Integrated Tax & GST Compensation Cess (Section 3)',
          description: 'All imported articles are subject to Integrated GST (IGST) under Section 3(7) of the CTA and GST Compensation Cess under Section 3(9) of the CTA. IGST matches domestic rates (maximum limit u/s CTA is 40%, standard rate is 18%). Under Section 3(8), the value for levying IGST is the aggregate of: Assessable Value determined u/s Section 14 + BCD + all other duties/cesses (except IGST and Compensation Cess themselves). SWS is exempt on IGST and Compensation Cess. For bonded warehoused goods sold under bond before clearance, IGST is, by virtue of Section 3(8A) or 3(10A), levied on the original Section 3(8) value or the final Transaction (sales) Value, whichever is HIGHER.',
          exception: 'Goods imported by SEZ units or developers for authorized operations are fully exempt u/s Section 3(7) and 3(9) of the CTA.',
          example: 'Alpha Ltd imports goods (AV = ₹1,00,000, BCD = 10%, SWS = 10% on BCD, IGST = 18%). Value for IGST computation u/s 3(8) is ₹1,00,000 + ₹10,000 (BCD) + ₹1,000 (SWS) = ₹1,11,000. IGST @ 18% is ₹19,980. Total customs duty and tax payable is ₹10,00,0 + ₹1,000 + ₹19,980 = ₹30,980.'
        },
        {
          title: 'Agriculture Infrastructure and Development Cess (AIDC)',
          description: 'AIDC is a custom cess levied on specified imported goods (such as gold, silver, coal, apples, urea) at notified rates u/s 124 of the Finance Act 2021 to finance agricultural development. For calculating AIDC, the value of the goods is determined in the same manner as the assessable value u/s Section 14 of the Customs Act, 1962.',
          exception: 'SWS is generally exempt on the portion of AIDC itself unless a specific notification requires its inclusion.',
          example: 'A consignment of silver is imported. AIDC is calculated directly @ specified rate on the Assessable Value determined u/s Section 14, in addition to standard BCD, SWS, and IGST.'
        },
        {
          title: 'Safeguard Measures u/s Section 8B (CTA)',
          description: 'The Central Government can impose safeguard measures (safeguard duty or tariff-rate quotas) u/s 8B of the CTA if it finds that an article is being imported into India in increased quantities, causing or threatening serious injury to the domestic industry. Standard safeguard duty is valid for 4 years, extendable by CBIC up to a maximum limit of 10 years in total. A provisional safeguard measures can be imposed on preliminary findings for a maximum period of 200 days.',
          exception: 'Exemptions: (a) No safeguard duty applies to imports from a single developing country as long as its share of imports <= 3% of total imports to India; or if multiple developing countries each have <= 3% share, and their aggregate share <= 9%. (b) Imports by 100% EOUs or SEZ units are exempt unless specifically made applicable on them, or unless the imported goods are subsequently cleared into the Domestic Tariff Area (DTA).',
          example: 'An import of Sodium Nitrite from a developing country constitutes 4% of total imports. Since its share exceeds 3%, safeguard duty u/s 8B is fully imposable. If its share were 2% and no other developing countries imports exceeded 3% (aggregate <= 9%), it would be exempt.'
        },
        {
          title: 'Countervailing Duty on Subsidized Articles u/s Section 9 (CTA)',
          description: 'Levied u/s 9 of the CTA if the exporting country directly or indirectly subsidizes the manufacture, production, or transport of imported goods. The CVD cannot exceed the verified amount of subsidy paid by the exporting nation. The duty remains in force for 5 years, extendable up to 5 more years on review. If review is not completed before the 5 years elapse, the duty may continue u/s an extension for up to 1 year pending the outcome. Circumvention and absorption investigations also apply.',
          exception: 'CVD does not apply to EOUs or SEZs unless cleared as such to the DTA, or specifically requested in the notification.',
          example: 'If country A grants an export subsidy of $50 per ton on steel, the Central Government can levy a countervailing duty of up to $50 per ton on steel imports from Country A to prevent injury to Indian domestic steel manufacturers.'
        },
        {
          title: 'Anti-Dumping Duty (ADD) u/s Section 9A (CTA)',
          description: 'Levied u/s 9A of the CTA on dumped imports (where the export price of an article imported into India is less than its Normal Value in the domestic market of the exporter). To comply with GATT, CBIC applies the "Lesser Duty Rule", restricting ADD to the lower of: (i) Margin of Dumping (Normal Value - Export Price), and (ii) Injury Margin (Fair Selling Price / Non-Injurious Price u/s domestic industry - Landed Value of dumped imports). Landed Value = Assessable Value + BCD (excluding CVD, ADD, or SWS). ADD is valid for 5 years, extendable u/s review for 5 years (extendable up to 1 year if review is pending). Retrospective ADD can be levied u/s Section 9A(3) up to 90 days before provisional duty in cases of massive, short-term dumping.',
          exception: 'Exemptions: No ADD applies to 100% EOUs/SEZs unless cleared into the DTA, or specifically notified. Also, under Section 9B, no article shall be subjected to both CVD and ADD to compensate for the same situation of dumping or export subsidization.',
          example: 'Importer brings in goods with Normal Value = $300, Export Price = $200 (Dumping Margin = $100). The Non-Injurious Price of domestic manufacturers is $280 and Landed Value is $210 (Injury Margin = $70). The Anti-Dumping Duty is restricted to the lower of the two, which is the $70 Injury Margin.'
        },
        {
          title: 'No Double Taxation & CESTAT Appeals u/s Section 9C (CTA)',
          description: 'Under Section 9B, no article shall be subjected to both countervailing duty u/s Section 9 and anti-dumping duty u/s Section 9A to compensate for the same situation. Any appeal against orders of determination or review of safeguard duty u/s 8B, countervailing duty u/s 9, or anti-dumping duty u/s 9A must be filed with the CESTAT u/s Section 9C within 90 days of the date of the order.',
          exception: 'CESTAT can condone delays beyond 90 days if sufficient cause is shown. Departmental appeals do not pay fees, but taxpayer appeals require a substantive filing fee of ₹15,000 (and ₹500 for stay/mutilation/restoration).',
          example: 'A foreign exporter challenges an anti-dumping order passed by the CBIC. They must file a formal appeal in the prescribed form before CESTAT, accompanied by a fee of ₹15,000, within 90 days of the Gazette notification date.'
        }
      ],
      visualBreakdown: {
        title: 'Customs Duties, Protective Measures, and Appeal Criteria Comparison',
        type: 'table',
        headers: ['Customs Duty / Measure', 'Imposition Authority & Valuation Base', 'Triggering Criteria / Exemptions', 'Statutory Limits & Major Timelines'],
        rows: [
          ['Basic Customs Duty (BCD)', 'Section 12 Customs Act & Section 2 CTA', 'Ad-valorem or specific; general rate is 10%; preferential rates apply with formal origin claim u/s Sec 4', 'Admissible as long as the CTA First (Import) or Second (Export) Schedules remain in force'],
          ['Integrated Tax (IGST)', 'Section 3(7) of Customs Tariff Act', 'Value u/s 3(8) = AV + BCD + other cesses (excludes IGST and Compensation Cess)', 'Capped u/s CTA at maximum 40% (general rate is 18%); exempt from SWS; exempt for SEZ'],
          ['GST Compensation Cess', 'Section 3(9) of Customs Tariff Act', 'Value u/s 3(8) / 3(10); levied on notified sin / luxury goods (liquor, tobacco)', 'Extended u/s statute till March 31, 2026; exempt for SEZ unit developers'],
          ['Social Welfare Surcharge (SWS)', 'Section 110 of Finance Act 2018', 'Aggregate of customs duties u/s 12; excludes CVD u/s 9, ADD u/s 9A, Safeguard u/s 8B, and SWS itself', 'Capped @ 10% of BCD; exempt on IGST and GST Compensation Cess'],
          ['Safeguard measures u/s Sec 8B', 'Section 8B of Customs Tariff Act', 'Imports surge causing or threatening serious injury to domestic producers', 'Duration: 4 years, max 10 years on extension; provisional safeguard measures max 200 days. Single dev country <=3%, aggregate <=9% exempt'],
          ['CVD on Subsidized Goods u/s Sec 9', 'Section 9 of Customs Tariff Act', 'Subsidy paid in exporter country on manufacture, production, or transport of imported cargo', 'Capped: cannot exceed verified subsidy paid; 5 years, review extension 5 years (review pending max 1 year)'],
          ['Anti-Dumping Duty u/s Sec 9A', 'Section 9A of Customs Tariff Act', 'Export price < Normal Value in exporter domestic market, causing material injury to local industry', 'Lesser Duty Rule: Lower of Dumping Margin and Injury Margin; 5-year duration, review extension 5 years, retrospective max 90 days'],
          ['CESTAT Appeals u/s Sec 9C', 'Section 9C of Customs Tariff Act', 'Determination or review orders u/s 8B, 9, or 9A filed before CESTAT', 'Timeline: 90 days of order; fee: ₹15,000 for main appeal, ₹500 for stay or miscellaneous applications']
        ]
      }
    },
    {
      chapterName: 'Classification of Imported and Export Goods',
      keyPrinciples: [
        {
          title: 'Tariff Structure, Schedules, and HSN Coding (CTA 1975)',
          description: 'The First Schedule of the CTA, 1975 enlists goods liable to import duty, aligned to the 8-digit Harmonised Commodity Description and Coding System (HSN) at the 6-digit level (arranged in 21 Sections and 98 Chapters). In India, it classifies items at the 8-digit level: 4 digits represent the Heading, 6 digits represent the Sub-heading, and 8 digits represent the Tariff Item. Correct classification determines the applicable standard and preferential rates of customs.',
          exception: 'The Second Schedule of the CTA enlists goods u/s which export duty is leviable. Generally, as a political and economic policy to encourage trade, export duties are kept at NIL for the vast majority of goods.',
          example: 'Desiccated coconuts are identified under the 8-digit Tariff Item "0801 11 00" (where 0801 is the 4-digit heading). Rate of BCD is printed against this 8-digit item in the First Schedule column.'
        },
        {
          title: 'General Explanatory Notes & Dashes Definition',
          description: 'The First Schedule contains three General Explanatory Notes of statutory force: Note (a) Relevance of dashes: a single dash (-) denotes primary sub-classification of a heading, a double dash (--) denotes sub-classification of the preceding single-dash line, and a triple dash (---) or quadruple dash (----) denotes sub-sub-classification. Note (b) "%" means standard ad valorem rate on valuation u/s Section 14. Note (c) Standard rate of duty is automatically applicable in any entry unless a preferential rate is specifically notified.',
          exception: 'If a preferential rate is printed but the importer fails to prove origin or satisfy Section 4 conditions, the standard rate of duty is applied instead.',
          example: 'Under heading 0801, "- Coconuts:" is the primary directory. Then, "-- Desiccated" (0801 11 00) is the sub-directory, followed by "--- Fresh" under specific branches.'
        },
        {
          title: 'Rule 1: Terms of Headings and Section/Chapter Notes',
          description: 'Rule 1 of the General Rules of Interpretation dictates that for legal purposes, classification is determined strictly by the terms of the headings and relative Section or Chapter Notes. Titles of Sections, Chapters, and Sub-chapters are provided for ease of reference only and have no legal force. Rules 2 to 6 are applied sequentially in seriatim only when a product cannot be classified purely u/s Rule 1 (Saurashtra Chemicals v. CC - Section/Chapter notes are part of the statute and have an overriding effect over headings).',
          exception: 'A relative section or chapter note cannot override a heading if the heading explicitly and clearly names an item without ambiguity, or if notes u/s another chapter are misapplied.',
          example: 'An importer brings in a letter closing and sealing machine. It could fall under 8422 (sealing machine) or 8472 (office machinery). Chapter note 2 to chapter 84 specifies that heading 8422 does not cover office machinery of heading 8472. Thus, applying Rule 1, it must be classified under 847230 00.'
        },
        {
          title: 'Rule 2: Incomplete, Unassembled & Mixture General Rules',
          description: 'Rule 2(a) (Incomplete/Unfinished Articles) classifies an incomplete, unfinished, or disassembled article under its completed heading, provided the incomplete article as presented has the essential character of the complete or finished article (e.g. railway coaches or cars imported without seats). Rule 2(b) (Mixtures/Combinations) states that any reference to a material includes mixtures of that material with other substances. If an item is composed of more than one material and prima facie classifiable under two or more headings, classification proceeds under Rule 3.',
          exception: 'An incomplete article requiring major industrial processing (like grinding, turning, heat treatment) does NOT possess the essential character of finished goods and cannot be classified u/s Rule 2(a).',
          example: 'A complete car imported in a completely knocked down (CKD) or disassembled kit form is classified as a fully finished car under Rule 2(a) rather than separate parts.'
        },
        {
          title: 'Rule 3: Composite Goods & Conflict Resolution Rules',
          description: 'When goods are prima facie classifiable under two or more headings (due to mixtures, composite components, or retail sets), Rule 3 governs sequentially: (a) Specific over General: Prefer the heading providing the most specific description (e.g. shavers u/s 8510 over domestic appliances u/s 8509). (b) Essential Character: Classify composite mixtures, sets, and goods on the material/component that grants its essential character. (c) Latter the Better: If 3(a) and 3(b) fail, classify under the heading that occurs last in numerical order (Mahindra & Mahindra v. CCE: vehicle equally classifiable under 8703 and 8704 was classified u/s 8704).',
          exception: 'If two headings are equally specific (each referring to part only of materials in composite goods), they must be regarded as equally specific, and the user must jump to Rule 3(b).',
          example: 'A lead pencil with an eraser at the back (composite good) is classified as a pencil u/s Rule 3(b) since the pencil provides the essential character, and the eraser is a mere convenience.'
        },
        {
          title: 'Rules 4, 5, and 6: Akin, Cases, and Same-level Sub-headings',
          description: 'Rule 4 (Akin Rule) is a rule of last resort, classifying unlisted items under the heading appropriate to goods to which they are most akin. Rule 5(a) classifies custom cases (camera, gun, necklace, musical instrument cases) specially shaped to contain the article and intended for long-term use with the main article. Rule 5(b) classifies packaging materials/containers with the goods, except durable packaging units. Rule 6 dictates that only sub-headings at the same level (e.g., single dash to single dash) are legally comparable.',
          exception: 'Rule 5(a) does not apply to containers that give the whole package its essential character (e.g., a hand-carved silver box containing cheap tea is classified as a silver article). Rule 5(b) does not apply to reusable containers suitable for repetitive use (like steel gas cylinders, which must be classified separately).',
          example: 'Sun-filtering plastic films pasted on car windows are not listed in the tariff. They are classified u/s heading 3925 (Builder’s wares/shutters/blinds of plastic) as they are most akin u/s Rule 4.'
        },
        {
          title: 'Project Imports u/s Heading 9801 (CTA)',
          description: 'The Indian Customs Tariff incorporates Chapter 98, which is a unique domestic addition. Under Heading 9801, project imports are imports of machinery, instruments, and apparatus required for the initial setup or substantial expansion of an industrial plant, power, mining, or irrigation project. It simplifies assessment by applying one consolidated rate of customs duty on all project goods in bulk, overriding individual tariff entries. Spare parts, raw materials, and consumables are restricted to a maximum limit of 10% of the value of imported project goods.',
          exception: 'Individual exemption notifications still apply to items grouped and assessed u/s Heading 9801. Preloaded operating software on laptops is assessed with the laptop as one unit (CC v. Hewlett Packard).',
          example: 'A major Power plant imports turbine parts, tubes, generators, and software. Instead of classifying 100 separate items under Chapters 84, 85, and 90, are all assessed collectively under Heading 9801 at a unified project import BCD rate.'
        }
      ],
      visualBreakdown: {
        title: 'Rules of Interpretation and Customs Classification Hierarchy',
        type: 'table',
        headers: ['Rule / Concept', 'Description & Scope of Rule', 'Triggering Conditions & Key Exceptions', 'Aesthetic & Practical Case Examples'],
        rows: [
          ['Rule 1: Heading/Notes', 'Primary legal guide; Section/Chapter notes dictate legal classification over heading terms', 'Titles of chapters are purely for reference; Saurashtra Chemicals: notes have overriding legal status', 'Electric letters sealer classified under office machinery 8472 instead of packing 8422 due to chapter notes'],
          ['Rule 2(a): Unfinished', 'Unfinished or disassembled articles follow finished goods heading', 'Goods must possess the essential character of finished product; excludes raw castings', 'Motor vehicle imported in a knocked-down kit form or passenger railway coach without seats is classified as complete vehicle'],
          ['Rule 2(b): Mixtures', 'Reference to any material extends to mixtures and combinations', 'Used when goods are mixed with other materials; if multiple entries apply, jump to Rule 3', 'Pure natural rubber mixed with synthetic rubber portions remains classified under natural rubber category'],
          ['Rule 3(a): Specific', 'Most specific heading is preferred over general category entries', 'Ignore if headings each refer to part only of composite retail sets', 'An electric hair remover/shaver with built-in motor is classified under 8510 rather than domestic appliances 8509'],
          ['Rule 3(b): Essential', 'Classify composite/mixed sets based on component giving essential character', 'Used when Rule 3(a) fails to resolve composite or complete retail sets', 'A lead pencil with a small eraser attached at the stub is classified as a pencil because writing is its essential profile'],
          ['Rule 3(c): Latter heading', 'Classify under the highest numerical heading among equally meritorious entries', 'Applied as a tie-breaker when both 3(a) and 3(b) fail to yield a search result', 'Mahindra v. CCE: vehicle equally classifiable under 8703 (passengers) and 8704 (goods) is classified u/s 8704'],
          ['Rule 4: Akin Rule', 'Classify completely new/unlisted items under entry to which they are most similar', 'Used as an absolute rule of last resort for innovative/unregistered goods', 'Sunlight antiglare filtering plastic films pasted on car windows are classified as most akin to plastic blinds u/s 3925'],
          ['Rule 5(a): Cases', 'Custom fitted cases/containers are classified with the main product in bulk', 'Must be custom-shaped, suitable for long-term protection, normally sold with item. Exclude if case gives essential character', 'Leather camera cases, violin cases, and fitted gold jewelry boxes are assessed at the rates of camera, violin, or jewelry'],
          ['Rule 5(b): Packaging', 'Packing materials and wraps follow the classification of the goods packed', 'Does not apply to durable packing containers clearly suitable for repetitive use', 'Standard cardboard cartons, paper wraps, and plastic layers follow goods; reusable steel Gas Cylinders do not'],
          ['Rule 6: Same level', 'Only sub-headings at the same indentation/dash level are comparable', 'Explanatory Section/Chapter notes apply mutatis mutandis to comparable sub-categories', 'A single-dash sub-heading can only be compared directly with another single-dash sub-heading in that heading'],
          ['Project Imports 9801', 'Single consolidated rate for entire project u/s Heading 9801 CTA', 'Applies to machinery/apparatus for initial setup or substantial expansion of plants / power / mining', 'Spares/consumables capped at 10% of total project invoice value; preloaded laptop software follows laptop (Hewlett Packard)']
        ]
      }
    },
    {
      chapterName: 'Valuation under the Customs Act, 1962',
      keyPrinciples: [
        {
          title: 'Assessable Value Basis u/s Section 14 (TV vs. Tariff)',
          description: 'All values for ad valorem customs are determined u/s Section 14: (a) Section 14(1) transaction value (TV) is the price actually paid or payable for goods when sold for export, where buyer and seller are not related and price is the sole consideration. (b) Section 14(2) tariff value allows the CBIC to notify fixed statutory values for sensitive bulk goods (like palm oil) in the Gazette, which completely overrides transaction values u/s 14(1).',
          exception: 'If buyer and seller are related u/s Rule 2(2) CVR, TV is accepted only if the importer demonstrates u/s Rule 3(3) that the relationship did not influence the price, or that the price closely approximates identical/similar test values.',
          example: 'Silver Dore is imported. The transaction value is rejected, and instead, CBIC Gazette-notified tariff values on the date of import are applied directly to compute duties.'
        },
        {
          title: 'Currency Conversion and Exchange Rate Dates',
          description: 'For imports, currency conversion must use the exchange rates notified by the CBIC (not RBI or banker) prevalent on the date the Bill of Entry is presented u/s Section 46 of the Customs Act. For exports, the conversion uses the CBIC rate on the date the Shipping Bill is filed u/s Section 50 of the Customs Act.',
          exception: 'While valuation conversion uses the shipping bill date exchange rate, export rate of duty is determined u/s Section 16 based strictly on the date the proper officer passes the "let export" order under Section 51.',
          example: 'A shipping bill for export is presented on April 26 (CBIC rate: $1 = ₹70, duty = 10%). The let-export order is passed on May 4 (CBIC rate: $1 = ₹72, duty = 8%). The export duty is computed u/s rate of 8% (let-export date duty) on the assessable value translated at ₹70 (shipping bill date exchange rate).'
        },
        {
          title: 'Doubts on Declared Value & Rejection (Rule 12 CVR)',
          description: 'The Proper Officer can reject the declared transaction value u/s Rule 12 of the CVR if they have reasonable grounds to doubt its accuracy (e.g., significantly higher value of identical imports, abnormal discounts, or misdeclarations). The officer must provide findings in writing and grant a reasonable opportunity of being heard (Rules of Natural Justice) before finalizing assessment sequentially under Rules 4 to 9.',
          exception: 'Under Rule 12(ii), if the importer clarifies the doubts in consultation with the officer, the declared transaction value must be accepted without sequential resort to other rules.',
          example: 'An importer purchases luxury goods u/s bulk discount of 50%. The proper officer proves identical imports have no such discount. The officer issues a query memo, hears the importer, and rejects the value, re-assessing u/s Rule 4 identical imports.'
        },
        {
          title: 'Rule 10(1) Pre-Importation Additions',
          description: 'To calculate the Customs FOB value, the following elements must be added to the invoice price to the extent they are paid by the buyer but not already included in the price: (a) brokerage and commissions (except buying commissions), (b) cost of containers treated as one with the goods, (c) cost of packing, (d) "assists" (the value, apportioned, of materials, moulds, dies, or design/engineering work completed OUTSIDE India supplied free), (e) royalties/license fees paid as a condition of sale, and (f) any subsequent resale proceeds accruing to the seller.',
          exception: 'Buying commissions (fees paid by the importer to their own agent abroad for representing them in the purchase) are strictly EXCLUDED. Design, engineering, and development work undertaken INSIDE India is also strictly EXCLUDED.',
          example: 'Importer buys a machine for ₹10,00,000. They paid a local buying commission of ₹50,000, design charges in UK of ₹1,00,000, and tooling assists of ₹20,000. The customs FOB value u/s Rule 10(1) matches ₹10,00,000 + ₹1,00,000 + ₹20,000 = ₹11,20,000 (excluding buying commission).'
        },
        {
          title: 'Rule 10(2) Maritime & Air Transport and Insurance',
          description: 'The transaction value must include: (a) The cost of transport, loading, unloading, and handling charges to the place of importation. If not ascertainable, it is taken as 20% of FOB. For air imports, transport cost is restricted to actual or maximum 20% of FOB, whichever is lower. (b) Cost of insurance to the place of importation. If not ascertainable, it is taken as 1.125% of FOB. (c) Demurrage charges on chartered vessels, lighterage, and barge charges are fully INCLUDED.',
          exception: 'Transshipment costs within India (e.g., from first landing port Mumbai to inland ICD Delhi) are strictly EXCLUDED from the assessable value u/s the 6th proviso to Rule 10(2). Unloading and handling charges paid at the final place of importation are also EXCLUDED.',
          example: 'Goods arrive by air (FOB = $10,000, actual air freight = $3,000, insurance = $200). Since air freight is capped u/s 20% of FOB, we add only $2,000 transport cost. CIF/Assessable Value = $10,000 + $2,000 + $200 = $12,200.'
        },
        {
          title: 'Set of Articles Apportionment u/s Section 19 (Customs)',
          description: 'Under Section 19, if an import consignment consists of an assortment or "set of articles" packed together liable to different rates of duty, the entire set is charged to duty at the HIGHEST rate applicable to any article in that set, unless the importer presents satisfactory evidence (individual invoices/values) to assess them separately.',
          exception: 'Accessories, spare parts, or maintenance tools imported with a main machine are NOT subject to this highest-rate penalty. Under the Accessories (Conditions) Rules 1963, they are charged at the same rate as the main machine, provided they are compulsorily supplied in trade and no separate price is charged.',
          example: 'An educational kit is imported containing a microscope (10% BCD), glass slides (15% BCD), and plastic covers (7.5% BCD). If imported as a single set without individual values, the entire kit is charged u/s 15% BCD. If separate values are shown, the slides are charged @ 15%, the microscope @ 10%, and the plastic covers @ 7.5%.'
        }
      ],
      visualBreakdown: {
        title: 'Customs Valuation Rules, Adjustments, and Apportionments',
        type: 'table',
        headers: ['Valuation Rule / Section', 'Admissibility & Adjustments', 'Key Statutory Thresholds & Prescriptions', 'Practical Illustration & Notes'],
        rows: [
          ['Section 14(1) - TV', 'Primary basis for customs valuation of imports/exports', 'Price paid/payable when sold for export, between unrelated parties, sole consideration', 'Uses CBIC rate of exchange on B/E date (imports) or Shipping Bill date (exports)'],
          ['Section 14(2) - Tariff Value', 'Overriding value fixed by CBIC for specified goods', 'Gazette notified rates; updated twice a month based on international market trends', 'Applied strictly to bulk assets like crude palm oil, overriding actual transaction value u/s 14(1)'],
          ['Rule 10(1) Additions', 'Pre-importation additions to actual price', 'Includes commissions (except buying), packing, moulds/assists outside India, royalties', 'No design/development work completed INSIDE India can be added to TV; buying commission is NIL'],
          ['Rule 10(2) Transport', 'Includible cost of transport to port of import', 'Includes maritime/air freight, ship demurrage on chartered vessels, lighterage, and barge charges', 'If transport not ascertainable, use 20% of FOB; air freight capped at maximum 20% of FOB'],
          ['Rule 10(2) Insurance', 'Includible cost of insurance to port of import', 'Includes war risk and marine insurance premiums paid to foreign/local underwriters', 'If insurance not ascertainable, use 1.125% of FOB value u/s statutory rule'],
          ['Transshipment Cost (Transit)', 'Excluded from customs valuation u/s 6th proviso', 'Cost of transport and insurance from first landing port in India to inland ICD/CFS', 'Fully excluded to provide uniform valuation regardless of inner-India transit distance'],
          ['Section 19 (Sets)', 'Highest rate of duty applied to entire composite set', 'Saves the department from grading complex assortments; applies highest rate of the set', 'Importer can avoid this u/s proving individual component values to the officer u/s separate invoices'],
          ['Accessories Rules 1963', 'Unified duty rate matching main article u/s Accessories Rules', 'Applies if accessories are compulsorily supplied u/s trade custom and no separate price is charged', 'Toolkits and standard power cords follow the custom rate of the main machine, avoiding Section 19 penalty']
        ]
      }
    },
    {
      chapterName: 'Importation and Exportation of Goods',
      keyPrinciples: [
        {
          title: 'Entry Inwards Mandatory u/s Section 31',
          description: 'No master of a vessel shall permit the unloading of any imported goods until an order has been given by the proper officer granting Entry Inwards. Entry inwards is granted upon presentation and verification of the Arrival Manifest / Import General Manifest (IGM). The date of grant of Entry Inwards is crucial because it determines the rate of duty and tariff valuation for standard goods imported by a vessel, especially when the Bill of Entry has been filed in advance.',
          exception: 'Entry Inwards is strictly required for vessels only; it does not apply to aircrafts or land vehicles. Additionally, loading and unloading of baggage, mail bags, animals, perishable cargo, and hazardous goods are exempted from this entry inwards restriction.',
          example: 'A vessel carrying industrial chemicals arrives on May 20, but the Bill of Entry was filed in advance on May 15. The entry inwards is granted to the vessel on May 22. The rate of customs duty applicable to the chemicals will be determined based on the date of Entry Inwards, i.e., May 22, rather than May 15.'
        },
        {
          title: 'Approved Stations, Supervision, and Boat Notes u/s Sec 11, 33-35',
          description: 'All loading and unloading of import and export goods must be conducted only at places approved by customs u/s 8(a) and must be performed under the direct supervision of customs officers u/s Section 34. Under Section 35, no goods shall be water-borne for landing from or loading to a vessel unless accompanied by a Boat Note in the prescribed form, issued by a proper officer of customs.',
          exception: 'Customs Board (CBIC) may issue general notifications, or proper officers may grant special permissions in writing, allowing loading or unloading of specific goods without the physical supervision of customs officers, or water-borne transit without a boat note.',
          example: 'A larger container vessel is anchored mid-sea because it cannot berth at the shallow docks. Cargo is ferried to the docks in smaller boats (lighters). Every boat-load must be accompanied by a formal Boat Note u/s Section 35 to prevent smuggling during maritime transit.'
        },
        {
          title: 'Safe Custody & Custodian Pilferage Liability u/s Section 45',
          description: 'Once imported goods enter a customs area, they must remain in the custody of an approved custodian (such as Port Trust, CONCOR for CFS, Airport Authority of India) until cleared for home consumption, warehoused, or transshipped. Under Section 45(3), if any imported goods are pilfered (stolen in small quantities) after unloading while in the custody of the custodian, the custodian is strictly liable to pay customs duty on such goods. The duty rate is applied on the date the import manifest was delivered.',
          exception: 'Under Board of Trustees v. UOI (Supreme Court), major ports and airports governed by the Major Port Trust Act, 1963 who do not require custom commissioner approval u/s 45(1) are not covered by the liability under Section 45(3). The department cannot demand duty from public port trusts for pilferage, though they remain liable as bailees of the goods.',
          example: 'A private container depot stores electronic microprocessors under approval u/s 45. During warehouse audit, 50 microprocessors are found missing due to petty theft (pilferage). The private custodian must pay full customs duty on those 50 chips to the department u/s Section 45(3).'
        },
        {
          title: 'Filing Bill of Entry, Advance Rules & Public Warehousing u/s Sec 46 & 49',
          description: 'The importer must present an electronic integrated declaration (Bill of Entry) on the CBIC computer system (ICEGATE/eSanchit) for assessment: Form I (White) for home consumption, Form II (Yellow) for warehousing, and Form III (Green) for ex-bond clearance. Under Section 46(3), a Bill of Entry must be presented before the end of the day preceding the arrival of the conveyance, and can be filed up to 30 days in advance. Under Section 49, if goods cannot be cleared within a reasonable time, the importer can secure permission to deposit them in a public warehouse u/s 57 – a process called "warehousing without warehousing" to bypass full assessment and save demurrage.',
          exception: 'Goods intended for transit or transshipment are fully exempted from filing a Bill of Entry at the port of arrival.',
          example: 'An importer expects a cargo of heavy machinery on July 20. To expedite customs clearance, they file an advance Bill of Entry on June 25 (within the 30-day advance window), allowing customs to verify documents before the vessel docks.'
        },
        {
          title: 'Self-Assessment, Verification & Provisional Assessment u/s Sec 17-18',
          description: 'Importers must self-assess their customs duties u/s 17(1). The proper officer can verify entries and re-assess u/s 17(4) if self-assessment is incorrect. If the importer is unable to self-assess due to missing information, or if the officer deems testing or further inquiry necessary, provisional assessment is adopted u/s Section 18. Upon finalization (which must undergo sequential resolution within 2 years), any differential duty short-paid is recovered with interest @ 15% p.a. from the first day of the month of provisional assessment, while excess duty is refunded subject to the doctrine of unjust enrichment.',
          exception: 'Under Section 18(4), if a refund is not paid back to the importer within 3 months from the date of final assessment, interest @ 6% p.a. is payable to the importer on the delayed refund.',
          example: 'A chemical shipment requires complex laboratory testing to determine correct tariff classification. It is provisionally assessed, and the importer executes a bond with cash security. The test report is finalized 10 months later, confirming additional duty of ₹1,00,000. Importer must pay ₹1,00,000 plus interest @ 15% p.a. starting from the month the chemical was provisionally assessed.'
        },
        {
          title: 'Transit of Goods vs. Transshipment u/s Section 53 to 56',
          description: 'Under Section 53, transit refers to cargo on a conveyance that enters India but continues to its final destination (domestic or foreign) on the SAME conveyance. It is treated as "same bottom cargo" with continuous manifest tracking, and requires no duty payment. Under Section 54, transshipment involves unloading cargo from the importing conveyance in a customs station and loading it into another conveyance for onward carriage. It requires filing a Bill/Declaration of Transshipment. No duty is paid at the intermediate transshipment port.',
          exception: 'Under Section 55, transit/transshipment cargo eventually becomes liable to full import duties upon its final arrival at the destination customs station in India. Section 56 allows the safe transit of imported goods through foreign territories (like transit of cargo destined for landlocked Nepal across Indian roads).',
          example: 'A freight ship from London docks at Mumbai carrying cargo for Mumbai and Chennai. The Mumbai cargo is unloaded. The Chennai cargo remains on board the same ship and sails to Chennai. This is a Transit of Goods u/s Section 53, and no customs duty is collected in Mumbai on the Chennai cargo.'
        }
      ],
      visualBreakdown: {
        title: 'Import Clearance and Unloading Procedure',
        type: 'table',
        headers: ['Procedural Step', 'Statutory Section', 'Key Timelines & Limits', 'Legal Consequence / Penalty'],
        rows: [
          ['Filing IGM / Import Manifest', 'Section 30', 'Electronically prior to vessel/aircraft arrival; within 12 hours for vehicle', 'Delay without cause attracts a penalty up to ₹50,000 u/s 30(2)'],
          ['Grant of Entry Inwards', 'Section 31', 'Granted after IGM verification; required only for vessels', 'Prohibits any unloading of goods before formal grant; sets rate of duty rate date'],
          ['Unloading & Storage', 'Sections 32-34, 45', 'Done only at approved docks/CFS during working hours under customs officer eye', 'Custodian holds goods in customs area; private custodian fully liable for pilfered cargo u/s 45(3)'],
          ['Filing Bill of Entry', 'Section 46', 'Before end of day preceding arrival; can be filed up to 30 days in advance', 'Charges apply for late filing; Form I (White), Form II (Yellow), Form III (Green) are used'],
          ['Self-Assessment & Verification', 'Section 17', 'Conducted by importer; verified by proper officer based on risk parameters', 'Reassessment u/s 17(4) if self-assessment is found incorrect; speaking order within 15 days'],
          ['Provisional Assessment', 'Section 18', 'Triggered by testing delays or request; finalized within 2 years (extension 1 year)', 'Importer posts bond/security; short-pay duty attracts interest u/s 18(3) @ 15% p.a. from start month'],
          ['Disposal of Uncleared Goods', 'Section 48', 'Custodian can auction goods if not cleared within 30 days of unloading', 'Requires 30 days notice; sensitive goods can be sold earlier; arms/ammo strictly customs regulated'],
          ['Storage Pending Clearance', 'Section 49', 'Allowed in public warehouse for up to 30 days (extendable by 30 days at a time)', 'Bypasses full assessment; known as "warehousing without warehousing" to save demurrage']
        ]
      }
    },
    {
      chapterName: 'Warehousing',
      keyPrinciples: [
        {
          title: 'Licensing of Public, Private, and Special Warehouses',
          description: 'Customs bonded warehouses are licensed by the Principal Commissioner or Commissioner: (a) Public Warehouses u/s 57 can store under-bond dutiable goods of any importer under record-based controls, without physical customs locks. (b) Private Warehouses u/s 58 store under-bond goods belonging selectively to the licensee under record-based controls. (c) Special Warehouses u/s 58A operate under strict physical control of a customs officer (with physical custom locks) and store specifically notified sensitive goods (such as gold, silver, other precious metals, weapons, duty-free shop inventories, ship stores).',
          exception: 'Public and private warehouses are record-controlled and do not require the continuous presence or locking by a customs officer, granting the licensee key custody, unlike special warehouses.',
          example: 'A Duty-Free operator imports expensive wristwatches and perfumes to sell at the airport. These goods must be deposited only in a Special Warehouse licensed u/s 58A under customs physical lock and key.'
        },
        {
          title: 'Warehousing Bond Execution u/s Section 59',
          description: 'To deposit imported goods in a customs bonded warehouse without paying duty, the importer must present an "into-bond" Bill of Entry (Form II) and execute a statutory Warehousing Bond u/s 59. The bond binds the importer to pay the government a sum equal to thrice (300%) the amount of customs duty assessed on the imported goods. Importer must also furnish a prescribed amount of bank guarantee or cash security.',
          exception: 'If the warehoused goods are fully sold and transferred to another person u/s 68 or 69, the original importer is relieved of their liability only after the transferee executes a fresh Section 59 bond.',
          example: 'An importer brings in goods with ₹15,00,000 assessed basic customs duty. To store them under bond, they must execute a Section 59 bond for ₹45,00,000 (3x of ₹15,00,000) and furnish the required bank security.'
        },
        {
          title: 'Warehousing Permissible Periods & Interest u/s Section 61',
          description: 'Under Section 61, the duration for keeping goods under bond varies: (1) Manufacturing/operations u/s 65: Capital goods remain until ex-bonded, and raw materials remain until consumed or ex-bonded. NO INTEREST is payable. (2) General cases: Goods can be stored for 1 year from the Section 60 order date. Interest @ 15% p.a. is charged on the deferred duty amount starting from the expiry of a 90-day interest-free window till actual payment.',
          exception: 'Under Pratibha Processors v. UOI (Supreme Court), interest is a mere accessory to the principal customs duty. If the warehoused goods are eventually re-exported without payment of duty, or are fully exempted, interest liability becomes NIL as no principal duty is paid.',
          example: 'Cargo is deposited in a warehouse (duty = ₹1,00,000). Importer clears them after 120 days. Since they crossed the 90-day free window by 30 days, they must pay ₹1,00,000 duty plus 15% p.a. interest calculated on ₹1,00,000 for 30 days: ₹1,00,000 * 15% * 30/365 = ₹1,233 interest.'
        },
        {
          title: 'Deemed Improper Removal & Assessment Date u/s Section 72',
          description: 'If bonded goods are not cleared from the warehouse upon expiry of the permitted 1-year warehousing period (or extended period), they are treated as "improperly removed" u/s 72. Under Kesoram Rayon v. CC, the rate of customs duty applicable to such deemed cleared goods is the rate in force on the exact date of expirry of the permitted warehousing period, and NOT on the date of actual manual removal, filing of ex-bond bill of entry, or payment.',
          exception: 'The standard charging provision Section 15(1)(b) (which applies the rate on the date of presenting an ex-Bond Bill of Entry) has no application when goods remain in the warehouse beyond the permitted statutory period.',
          example: 'An importer leaves goods in a warehouse beyond the permitted 1-year period that expired on July 10, when the duty rate was 10%. The importer finally cleared them on August 15, when the rate had hiked to 15%. The duty payable is assessed at the rate of 10% (the rate on the July 10 expiration date) u/s Section 72.'
        },
        {
          title: 'In-Bond Manufacture (MOOWR Scheme) u/s Section 65 & 65A',
          description: 'Under Section 65, an importer can set up a manufacturing or service unit inside a private or special bonded warehouse (MOOWR Scheme 2019/2020) with custom commissioner approval. Duty is fully deferred on imported raw materials. If finished products are exported, import duties on inputs are remitted. Duty is paid on inputs only when finished products are cleared for home consumption. Section 65A (Finance Act 2023) mandates that operators must pay IGST and Compensation Cess on raw material inputs at deposit, deferring only BCD, unless specifically exempted.',
          exception: 'Waste/refuse generated during manufacturing are exempt from duty if exported or destroyed. If finished products are cleared for home consumption, duty is payable on the raw materials contained in the waste generated.',
          example: 'A smartphone manufacturer imports chipsets worth ₹10,00,000 into a MOOWR bonded unit. They assemble smartphones and export them to Germany. Since the final smartphones are exported, no customs duty is paid on the imported chipsets.'
        },
        {
          title: 'Natural Volatile Loss Remission Allowance u/s Section 70',
          description: 'Where any imported warehoused goods are notified u/s 70 by the CBIC (such as aviation fuel, motor spirit, raw naphtha, crude oil, spirits, wine, and beer stored in wooden casks) and are found deficient in quantity due to natural causes like evaporation, leakage, or shrinkage at the time of delivery from the warehouse, the Assistant/Deputy Commissioner of Customs may fully remit the duty on such deficient quantity.',
          exception: 'No volatile loss remission is allowed for general goods or if the deficiency is caused due to pilferage, theft, or negligent storage by the warehouse license holder.',
          example: 'A petroleum refinery stores imported aviation spirit in warehouse tanks. At ex-bonding, there is a physical deficiency of 200 liters due to continuous atmospheric evaporation. If verified as natural loss, customs duty on these 200 liters is fully remitted u/s Section 70(1).'
        }
      ],
      visualBreakdown: {
        title: 'Customs Warehousing and Under-Bond Storage Comparison',
        type: 'table',
        headers: ['Concept / Rule', 'Public Warehouse (Sec 57)', 'Private Warehouse (Sec 58)', 'Special Warehouse (Sec 58A)'],
        rows: [
          ['Licensing Authority', 'Principal Commissioner / Commissioner of Customs', 'Principal Commissioner / Commissioner of Customs', 'Principal Commissioner / Commissioner of Customs'],
          ['Storage Rights', 'Any importer can deposit dutiable goods under bond', 'Only the licensee can deposit their imported dutiable goods', 'Specifically notified sensitive cargo can be stored under bond'],
          ['Physical Lock & Control', 'Record-based controls; no physical custom locks', 'Record-based controls; no physical custom locks', 'Strict physical lock and key in custody of customs bond officer'],
          ['Example Commodities', 'Standard machinery, chemicals, bulk raw materials', 'Licensee’s component parts, steel, electronic inputs', 'Gold, silver, armaments, DFS duty-free shop goods, ship stores'],
          ['Warehousing Bond', 'Executing Sec 59 bond for 3x assessed customs duty', 'Executing Sec 59 bond for 3x assessed customs duty', 'Executing Sec 59 bond for 3x assessed customs duty'],
          ['Standard Storage Limit', '1 Year (extendable u/s Commissioner by 1 year)', '1 Year (extendable u/s Commissioner by 1 year)', '1 Year (extendable u/s Commissioner by 1 year)'],
          ['Interest-Free Window', '90 Days free period from Section 60 order date', '90 Days free period from Section 60 order date', '90 Days free period from Section 60 order date'],
          ['Deferred Interest Rate', '15% p.a. charged beyond 90 days on deferred duty', '15% p.a. charged beyond 90 days on deferred duty', '15% p.a. charged beyond 90 days on deferred duty']
        ]
      }
    },
    {
      chapterName: 'Customs Refunds',
      keyPrinciples: [
        {
          title: 'Claim for Refund of Duty or Interest u/s Section 27',
          description: 'Under Section 27, any person who paid customs duty or interest in excess, or who personally bore the tax incidence, can file an application for refund to the Assistant/Deputy Commissioner of Customs. The application must be presented electronically before the expiry of 1 year from the date of payment of duty or interest.',
          exception: 'The 1-year limitation period is not applicable in cases where duty or interest has been paid under protest. Additionally, under Section 27(1) third proviso, no refund of duty or interest will be granted if the claimed amount is less than ₹100.',
          example: 'An importer pays ₹2,50,000 customs duty on June 15, 2024. On June 10, 2025, they discover a clerical error in valuation that led to an overpayment of ₹15,000. Since they filed the refund application within 1 year (before June 15, 2025), the application is legally admissible u/s Section 27.'
        },
        {
          title: 'Doctrine of Unjust Enrichment & Consumer Welfare Fund exceptions',
          description: 'Under Section 28D, there is a statutory presumption that the importer has passed on the incidence of paid customs duty to the buyer of the goods. To secure a direct refund, the applicant must produce documentary evidence to refute this presumption, proving they absorbed the cost personally. Otherwise, any refund found admissible is credited directly to the Consumer Welfare Fund to prevent the claimant from double enrichment (Mafatlal Industries v. UOI).',
          exception: 'Admissible refunds are paid directly to the applicant instead of the Consumer Welfare Fund (CWF) if the refund is relatable to: (a) Importers who did not pass on the tax burden; (b) Individual imports compiled for personal use; (c) Export duty paid u/s Section 26; (d) Duty drawback paid u/s Section 74/75; (e) Excess duty paid before home clearance if evident on face of Bill of Entry.',
          example: 'An individual imports an electronic wheelchair for personal use and overpays ₹12,000 customs duty due to classification error. Upon filing a refund claim, the ₹12,000 is paid directly to the individual instead of being credited to the CWF u/s Section 27(2) proviso, as it was for personal use.'
        },
        {
          title: 'Interest on Delayed duty Refunds u/s Section 27A',
          description: 'The customs department has a statutory obligation to process and pay admitted refunds without delay. Under Section 27A, if any customs duty ordered to be refunded to an applicant is not refunded within 3 months from the date of receipt of a complete application, interest @ 6% p.a. ( statutory range is 5% to 30% p.a.) must be paid to the applicant.',
          exception: 'The interest is calculated only on delayed refunds of customs duty. No interest is payable on delayed refunds in respect of pre-deposits, deposits for project imports, or security cash deposits for provisional release.',
          example: 'An importer files a complete refund application which is acknowledged on January 10. The refund is finally paid on July 25. Since the 3-month interest-free window expired on April 10, the department must pay 6% p.a. interest calculated on the refund amount from April 11 to July 25 (106 days) u/s Section 27A.'
        },
        {
          title: 'Refund of Export Duty on Rejected Goods u/s Section 26',
          description: 'Where export duty has been paid on the exportation of any goods, such duty shall be fully refunded to the exporter if: (a) the exported goods are returned to such person otherwise than by way of re-sale, (b) the goods are physically re-imported into India within 1 year from the date of exportation, and (c) the application for refund is made within 6 months from the date of clearance of the returned goods by customs.',
          exception: 'Export duty is not refunded if the goods were sold abroad and returned after usage, or if the re-import occurs after the expiry of 1 year from the date of export.',
          example: 'An Indian merchant exports silk garments and pays ₹80,000 export duty. The foreign buyer rejects the batch due to color non-conformity. The garments are re-imported back to India 8 months later and returned to the seller. The seller can claim a full refund of the ₹80,000 export duty.'
        },
        {
          title: 'Refund of Import Duty on Defective foreign Goods u/s Section 26A',
          description: 'Under Section 26A, duty paid on clearance of defctive or non-conformance imported goods is refunded if: (a) goods are found defective or non-compliant with specs; (b) they have not been worked/used (except to detect defect); (c) they are identified as the imported goods; (d) no drawback has been claimed; and (e) the goods are either re-exported, relinquished, or destroyed in presence of custom officers within 30 days of clearance. The application must be filed within 6 months of the relevant date.',
          exception: 'No refund of import duty u/s Section 26A shall be allowed for perishable goods or goods which have exceeded their recommended storage before-use period or shelf-life u/s 26A(3).',
          example: 'An engineering firm imports high-precision drill bits, clears them for home consumption, but discovers they are fractured on first opening. The firm relinquishes title to customs and destroys the bits under officer supervision within 25 days. The firm is entitled to a full refund of its import duty u/s Section 26A.'
        },
        {
          title: 'Refund Claim is NOT a backdoor Substitute for Appeal',
          description: 'Under Priya Blue Industries v. CC (Supreme Court), an importer cannot challenge an assessment order indirectly by filing a refund application u/s Section 27. The assessment order stands unless reviewed or modified in appeal proceedings before the Commissioner (Appeals) or CESTAT. A refund claim cannot be used as an appeal against an adjudication or self-assessment order (ITC Ltd. v. CCE).',
          exception: 'If the assessment order is modified or set aside in appeal, a refund claim is fully admissible, and the 1-year timeline runs from the date of such favorable appellate judgment.',
          example: 'An importer disagrees with a customs officer’s valuation and pays duty under protest but fails to file an appeal within the 60-day appellate window. After the appeal is time-barred, they file a direct refund claim challenging the valuation. Under the Priya Blue ruling, the refund claim is liable for summary rejection.'
        }
      ],
      visualBreakdown: {
        title: 'Customs Duty Refund Criteria and Timelines',
        type: 'table',
        headers: ['Tax Refund Category', 'Governing Section', 'Filing Time Limit', 'Exceptions & Key Statutory Prescriptions'],
        rows: [
          ['Standard Refund (Importers)', 'Section 27(1)', 'Within 1 year from date of payment of duty/interest', '1-year limit is waived if paid under protest; ₹100 minimum threshold applies'],
          ['Standard Refund (Buyers)', 'Section 27(1)', 'Within 1 year from date of purchase of goods', 'Requires proof that buy-tax incidence was not passed on u/s Section 28D'],
          ['Exemptions/Court orders', 'Section 27(1B)', 'Within 1 year of issue date of exemption or court order', 'Saves taxpayer from time-baring while dispute is litigated in court'],
          ['Refund of Export Duty', 'Section 26', 'Within 6 months of clearance of re-imported goods', 'Requires re-import within 1 year of export; goods can not be resold abroad'],
          ['Refund of Import Duty (Defective)', 'Section 26A', 'Within 6 months from the date of export/destruction', 'Defective goods must be exported, relinquished, or destroyed within 30 days'],
          ['Interest on Delayed Refund', 'Section 27A', 'No separate application; paid automatically on delay', 'Admissible if refund is delayed beyond 3 months; interest paid u/s 6% p.a.'],
          ['Consumer Welfare Fund', 'Section 27(2)', 'Admitted unless falling in proviso exceptions', 'Reflects doctrine of Unjust Enrichment on passing tax to third party']
        ]
      }
    },
    {
      chapterName: 'Foreign Trade Policy',
      keyPrinciples: [
        {
          title: 'Legislation, Administration and IEC Mandate',
          description: 'The Foreign Trade Policy (FTP) is notified by the Central Government under Section 5 of the Foreign Trade (Development & Regulation) Act, 1992, to develop export potential, improve performance, and coordinate foreign trade. The policy is administered and supervised by the Director General of Foreign Trade (DGFT), whose decisions on interpretation of the FTP are final and binding. Under the policy, any person undertaking import or export must mandatorily hold an electronic Importer-Exporter Code (IEC) issued by the DGFT. The IEC is a 10-character, PAN-based alphanumeric code that must be updated electronically every single year, failing which it is automatically deactivated.',
          exception: 'Select notified categories of importers or exporters (such as government ministries, passenger baggage, or personal imports) are explicitly exempted from the requirement of obtaining or updating an IEC.',
          example: 'An Indian apparel dealer wants to import fabric rolls from Bangladesh. Before placing the purchase order, they must file an online application on the DGFT portal (dgft.gov.in) to secure and activate an IEC. They must update this registration electronically every year even if no changes occur.'
        },
        {
          title: 'Mandatory Import/Export Documentation Requirements',
          description: 'For smooth customs clearance and compliance under tax laws and the FTP, specific documents are statutorily prescribed as mandatory. For Exports, the required list includes: (1) Bill of Lading, Airway Bill, Lorry Receipt, Railway Receipt, or Postal Receipt; (2) Commercial Invoice cum Packing List (or individual documents); and (3) Shipping Bill, Bill of Export, or Postal Bill of Export. For Imports, the list includes: (1) Bill of Lading, Airway Bill, Lorry/Railway/Postal Receipt; (2) Commercial Invoice cum Packing List; and (3) Bill of Entry. These forms are mostly routed electronically via single-point gateways like ICEGATE, SWIFT, and eSanchit.',
          exception: 'For import or export of specific regulated commodities, additional statutory certificates, permits, or laboratory clearance reports may be notified and demanded under separate laws.',
          example: 'An exporter shipping leather boots must generate a Shipping Bill on the customs portal and present it along with the freight carrier\'s Bill of Lading and a Commercial Invoice. Missing any of these mandatory papers blocks the shipment and loading.'
        },
        {
          title: 'Status Holder Classification & Cumulative Privileges',
          description: 'The FTP categorizes exporter firms as "Status Holders" (business leaders) based on achieving aggregate export performance thresholds in USD Millions during the current and preceding three financial years: One Star ($3M), Two Star ($15M), Three Star ($50M), Four Star ($200M), and Five Star ($800M). To support specific prioritized categories (such as MSMEs, units with ISO/BIS certifications, units located in North Eastern States, and exporters of fruits and vegetables) towards achieving One Star status, double weightage is granted once in any of these categories for calculating cumulative performance.',
          exception: 'Exports made purely on a re-export basis (without value addition) are strictly excluded from calculating export performance for the grant of any Status Category.',
          example: 'A handloom manufacturer achieves a cumulative export performance of USD 1.5 Million over the eligible four-year period. Since they are registered as a Micro and Small Enterprise (MSE), they receive double weightage, taking their calculable performance to USD 3.0 Million, qualifying them as a One-Star Export House.'
        },
        {
          title: 'Status Holder Privileges & Self-Certification of Origin',
          description: 'Status Holders enjoy unique privileges designed to reduce transaction costs and delays: (a) Clearance of import/export consignments on self-declaration basis, (b) Priority fixation of SION norms within 60 days by the Norms Committee, (c) Exemption from furnishing bank guarantees under FTP schemes, and (d) Two Star and above status houses are permitted to establish export warehouses. Most notably, manufacturers who are Three, Four, or Five-Star Export Houses are recognized under the "Approved Exporters" scheme and are enabled to self-certify their manufactured goods as originating in India to qualify for preferential treatment under PTAs, FTAs, CECA, and CEPA.',
          exception: 'The self-certification of origin privilege is limited only to goods that are manufactured as per the Industrial Entrepreneurs Memorandum (IEM), Industrial License (IL), or Letter of Intent (LOI) issued to the manufacturer.',
          example: 'A Three-Star electronic hardware manufacturer exports micro-controllers to Japan. Under the bilateral Comprehensive Economic Partnership Agreement (CEPA), they can print a self-certified Certificate of Origin on their invoice instead of spending time applying for a manual certificate from a government agency.'
        },
        {
          title: 'Advance Authorization Scheme (Duty Exemption & 15% VA Check)',
          description: 'The Advance Authorization Scheme allows duty-free import of raw material inputs, fuels, catalysts, and auxiliary spares (up to 10% of CIF value) physically incorporated into export products. The scheme requires achieving a strict minimum of 15% Value Addition (VA), calculated as: VA = [(FOB - CIF) / CIF] * 100. Imports are exempt from Basic Customs Duty (BCD), Additional Customs Duty, Safeguard Duty, Anti-Dumping Duty, and the whole of Integrated Tax (IGST) and Compensation Cess.',
          exception: 'Inputs imported under Advance Authorization are subject to "Actual User" condition. The raw materials used are strictly non-transferable even after the export obligation has been completed and redeemed.',
          example: 'An exporter imports raw chemical inputs valued at ₹10,00,000 under Advance Authorization. They must manufacture a resultant medicine product and export it with a minimum FOB value of ₹11,50,000 (15% value addition) within the prescribed export obligation period.'
        },
        {
          title: 'Duty Free Import Authorization (DFIA Post-Export & 20% VA Check)',
          description: 'The Duty Free Import Authorization (DFIA) Scheme is a post-export duty-free replenishment scheme issued only for products where Standard Input-Output Norms (SION) are pre-notified. It requires achieving a minimum Value Addition of 20%. Applications must be filed with the Regional Authority before starting exports to track material usage. Unlike Advance Authorization, DFIA is exempt ONLY from Basic Customs Duty (BCD); other customs duties, cess, and IGST must be paid at importing.',
          exception: 'DFIA authorizations are fully TRANSFERABLE to other importers after the export obligation is fulfilled. Since they are transferable, DFIA cannot be issued for inputs subject to "Actual User" conditions under the SION.',
          example: 'An engineering manufacturer exports a batch of steel shafts using domestic materials, having filed a DFIA application beforehand. After verifying exports, they are issued a DFIA script allowing duty-free import of raw alloy steel. Since they have spare inventory, they sell this DFIA script to another importer at a premium, which is permissible.'
        },
        {
          title: 'Remission of Duties and Taxes on Exported Products (RoDTEP)',
          description: 'The RoDTEP Scheme aims to ensure that "taxes and duties should not be exported." It refunds currently unrefunded taxes, duties, and local levies at central, state, and local levels incurred on the exported product (and its distribution/production stages). The rebate is granted as a notified % of the FOB value of exports, subject to a value cap per unit. It is issued in the form of transferable electronic duty credit scrips (e-scrips) maintained in an electronic ledger by customs. Importers can use these e-scrips exclusively to pay Basic Customs Duty (BCD) on imported cargo.',
          exception: 'Deemed exports, exports of imported goods in same form, transshipment goods, items subject to minimum export price, and goods manufactured under Section 65 (MOOWR) in warehouses are strictly ineligible for RoDTEP rebates.',
          example: 'A textile mill exports cotton yarn. Under RoDTEP, they receive an electronic scrip equal to 2% of the FOB value of the shipment. They use this scrip to fully discharge the Basic Customs Duty on a subsequent import of advanced foreign looms, saving cash flow.'
        },
        {
          title: 'Export Promotion Capital Goods (EPCG Zero-Duty Purchase)',
          description: 'The EPCG Scheme facilitates the import of capital goods (machinery, computer software, moulds, spares) at zero customs duty (exempting BCD, IGST, and Cess) to enhance Indian manufacturing competitiveness. In return, the importer must fulfill a "specific" export obligation equivalent to 6 times of actual duties, taxes, and cess saved, within a maximum of 6 years from the date of license issue. The importer must also maintain an "average" export obligation (AEO) equal to the average level of exports for same/similar products in the preceding three licensing years.',
          exception: 'If the capital goods are sourced indigenously rather than imported, the specific export obligation is reduced by 25% (making the EO 4.5 times of duty saved instead of 6 times). Furthermore, if 75% or more of specific EO and 100% of average EO are met in half or less of the original 6-year period, the remaining EO is condoned.',
          example: 'A plastics manufacturer imports an injection molding machine saving ₹20,00,000 in import duties under EPCG. They must generate physical exports of plastic products worth ₹1,20,00,000 (6x of ₹20 Lakh) over 6 years, while ensuring their annual exports do not fall below their historical three-year average.'
        },
        {
          title: 'Export Oriented Units (EOU, EHTP, STP & BTP under-bond Schemes)',
          description: 'The EOU, EHTP (Electronics), STP (Software), and BTP (Biotech) schemes are designed for units undertaking to export their entire production of goods or services (except permitted sales in the domestic market). Units are allowed to import and procure inputs, components, and capital goods completely free of BCD, additional customs duties, IGST, and compensation cess. To establish an EOU, projects must meet a minimum investment of ₹1 Crore in plant and machinery, and must achieve positive Net Foreign Exchange (NFE) earnings cumulatively over blocks of 5 years.',
          exception: 'Trading units are strictly excluded and cannot be established under any of these under-bond schemes. The ₹1 Crore minimum investment criterion is waived for service units, handicrafts, agriculture, and park projects.',
          example: 'A software company sets up an STP unit in Bangalore. They import high-end servers worth ₹50,00,000. No customs duty or IGST is paid at import. Over the next 5 years, their cumulative software export earnings (e.g., $5M) must exceed their foreign expenditures (import cost, royalty, travel) to remain positive NFE compliant.'
        },
        {
          title: 'Deemed Exports under FTP & Incentives to Domestic Industry',
          description: 'Deemed Exports refer to specified transactions where goods supplied do not leave India, payment is received in INR or free Forex, and the goods are manufactured in India. The scheme ensures domestic suppliers are not placed at a disadvantage compared to foreign suppliers who enjoy duty-free advantages. Eligible categories include supplies of goods against Advance Authorizations, supplies of capital goods to EPCG houses, supplies to EOUs/STPs, and supplies to turnkey projects funded by multilateral funds under International Competitive Bidding.',
          exception: 'Supplies must be made directly to the recipient entities; third-party supplies are strictly ineligible for any deemed export benefits or exemptions.',
          example: 'An Indian steel manufacturer sells steel beams to an EOU located in Chennai. Since the steel is manufactured in India and supplied to an under-bond export-oriented unit, the sale is treated as a Deemed Export. The steel mill can claim Deemed Export Drawback or Advance Authorization for their raw materials.'
        }
      ],
      visualBreakdown: {
        title: 'Comparison of Key Foreign Trade Policy Schemes',
        type: 'table',
        headers: ['FTP Scheme', 'Main Objective', 'Value Addition / Export Obligation', 'Duties Exempted / Benefits', 'Transferability & Core Conditions'],
        rows: [
          ['Advance Authorization', 'Duty-free import of physically incorporated manufacturing inputs', 'Minimum 15% Value Addition; Export obligation based on SION and finished goods export', 'Exempts BCD, Anti-Dumping, Safeguard, CVD, plus whole of IGST and Cess', 'Subject to Actual User condition; NOT transferable even after obligation is completed'],
          ['DFIA Scheme', 'Post-export duty-free replenishment for notified SION raw inputs', 'Minimum 20% Value Addition; SION must be pre-notified', 'Exempts ONLY Basic Customs Duty (BCD); other customs taxes and IGST must be paid', 'Fully TRANSFERABLE or saleable to other importers after obligation completion'],
          ['RoDTEP Scheme', 'Refund unrefunded central, state, local taxes on export logistics', 'Granted as a specified % of FOB export value, subject to a value cap per unit', 'Admitted as electronic credit scrips (e-scrips) to pay Basic Customs Duty', 'e-scrips are freely TRANSFERABLE; excludes warehouse clearance and deemed exports'],
          ['EPCG Scheme', 'Zero-duty import of capital goods to boost manufacture capabilities', 'Fulfill specific EO of 6x of duty saved within 6 years, plus meet historical Average EO', 'Exempts BCD, IGST, and Cess on imported capital goods/machinery', 'Subject to Actual User condition; Specific EO is 25% lower if sourced indigenously'],
          ['EOU / STP / EHTP', 'Complete under-bond facility for units exporting entire production', 'Achieve cumulative positive Net Foreign Exchange (NFE) over a block of 5 years', 'Exempts BCD, additional customs duties, IGST, and Cess on all imports', 'Includes actual user condition; minimum investment of ₹1 Crore (except services/gardens)'],
          ['Deemed Exports', 'Level-playing field by treating local supplies as actual exports', 'Goods must be manufactured locally and supplied to specified under-bond buyers', 'Eligible for Advance Authorization, Deemed Export Drawback, and Excise refunds', 'Supplies must be made directly to eligible projects; third-party sales are excluded']
        ]
      }
    }
  ],
  IBS: [
    {
      chapterName: 'Case Scenarios',
      keyPrinciples: [
        {
          title: '1. Financial Reporting (FR) — Ind AS 103 Acquisition, Ind AS 12 Deferred Tax & Ind AS 115 Bundle Allocation',
          description: '• Aetherion Mobility Ltd. acquires 80% equity in VoltCore Battery Systems Ltd. on 01.04.2025 for ₹640 Crore.\n• Identifiable Net Assets Carrying Amount = ₹500 Crore; Fair Value = ₹600 Crore (upward fair value adjustment of ₹100 Crore on patented solid-state cell technology with 5-year remaining life; tax base remains ₹500 Crore).\n• Under Ind AS 12, taxable temporary difference of ₹100 Crore × 25.168% (Sec 115BAA rate) = ₹25.168 Crore Deferred Tax Liability (DTL) is recognized at acquisition, reducing Fair Value of Identifiable Net Assets to ₹574.832 Crore.\n• With NCI measured at Fair Value of ₹155 Crore, Goodwill u/s Ind AS 103 = (₹640 Cr + ₹155 Cr) − ₹574.832 Cr = ₹220.168 Crore.',
          exception: 'Under Section 32 of the Income-tax Act, 1961, goodwill of a business or profession is explicitly excluded from depreciable intangible assets (post Finance Act 2021), and under Ind AS 12 Para 15(a), no DTL is recognized on the initial recognition of Goodwill.',
          example: 'Goodwill = Consideration (₹640 Cr) + Fair Value of 20% NCI (₹155 Cr) − Tax-Adjusted Identifiable Net Assets (₹600 Cr − ₹25.168 Cr DTL = ₹574.832 Cr) = ₹220.168 Crore.'
        },
        {
          title: '2. Advanced Financial Management (AFM) — WACC, EVA & Cross-Border ECB Hedging',
          description: '• Aetherion’s post-acquisition Invested Capital = ₹1,200 Crore; Equity Weight = 60% (Rf = 6.80%, Beta = 1.25, Market Risk Premium = 6.56% ⇒ Ke = 15.00%); Debt Weight = 40% (Pre-tax Kd = 10.00%, Tax Rate u/s 115BAA = 25.168% ⇒ Post-tax Kd = 7.4832%).\n• WACC = (0.60 × 15.00%) + (0.40 × 7.4832%) = 9.00% + 2.9933% ≈ 12.00%.\n• With Operating EBIT = ₹240 Crore, NOPAT = ₹240 Cr × (1 − 0.25168) = ₹179.60 Crore; Capital Charge = ₹1,200 Cr × 12.00% = ₹144.00 Crore; Economic Value Added (EVA) = ₹179.60 Cr − ₹144.00 Cr = +₹35.60 Crore.\n• For a 6-month USD 5 Million import of lithium cathode equipment (Spot = ₹84.00/USD, 6-month Forward = ₹85.60/USD, US 6M investment rate = 4% p.a., India 6M borrowing rate = 9% p.a.), Forward Outflow = ₹42.80 Crore vs. Money Market Hedge Outflow = [USD 5M / 1.02] × 84.00 × 1.045 = ₹43.029 Crore ⇒ Forward Hedge saves ₹22.94 Lakhs.',
          exception: 'Interest Rate Parity (IRP) deviations create arbitrage or hedging advantage; when domestic borrowing rates exceed the implied forward premium, the Forward Market Hedge dominates the Money Market Hedge for import payables.',
          example: 'Forward Hedge Cost = USD 5,000,000 × ₹85.60 = ₹42,80,00,000. Money Market Hedge = Borrow USD 4,901,960.78 in INR (₹41,17,64,706) @ 4.5% for 6 months = ₹43,02,94,118.'
        },
        {
          title: '3. Direct Tax Laws & International Taxation (DT) — Sec 50B Slump Sale, Sec 115BAA & Sec 92CE Secondary Adjustment',
          description: '• Aetherion transfers its legacy Internal Combustion (IC) Engine Unit via Slump Sale u/s 50B on 01.10.2025 for lump-sum cash consideration of ₹210 Crore (held > 36 months).\n• Net Worth u/s 50B = Depreciated WDV of Block of Assets u/s 43(6)(c) (₹115 Cr) + Book Value of Non-Depreciable Assets (₹45 Cr, excluding ₹20 Cr upward land revaluation) − Liabilities (₹35 Cr) = ₹125 Crore.\n• Under Rule 11UAE, FMV1 (book/stamp/market value of transferred assets) = ₹228 Crore and FMV2 (monetary consideration) = ₹210 Crore ⇒ Full Value of Consideration = Higher of FMV1 or FMV2 = ₹228 Crore; LTCG u/s 50B = ₹228 Cr − ₹125 Cr = ₹103 Crore.\n• Primary Transfer Pricing adjustment on royalty paid to German AE (Aetherion GmbH) = ₹18 Crore (exceeding ₹1 Crore threshold u/s 92CE). If not repatriated within 90 days from due date of return u/s 139(1), it is deemed an advance carrying imputed interest at SBI 1-year MCLR + 325 bps (or Option to pay 18% additional income-tax + 12% surcharge + 4% cess = 20.9664% u/s 92CE(2A)).',
          exception: 'Upward revaluation of assets (₹20 Crore on factory land) is mandatorily ignored under Explanation 2 to Section 50B while computing Net Worth, and no indexation benefit is permissible in a Slump Sale.',
          example: 'LTCG u/s 50B = ₹228 Crore (Rule 11UAE higher FMV) − ₹125 Crore (Net Worth) = ₹103 Crore taxable @ 12.5% u/s 112 (plus 10% surcharge and 4% cess).'
        },
        {
          title: '4. Indirect Tax Laws (IDT) — GST Going Concern Exemption, Rule 42/43 Reversal & Customs Rule 10(1)(c) Royalty',
          description: '• Transfer of the IC Engine Unit as a going concern as a whole is an EXEMPT supply of service under Entry 2 of Notification No. 12/2017-CT (Rate); unutilized ITC in the Electronic Credit Ledger is transferred to the transferee via Form GST ITC-02 u/s 18(3) read with Rule 41.\n• However, since an exempt supply of service takes place, common input services (legal/valuation advisory ITC of ₹1.80 Crore) attract proportionate reversal under Section 17(2) read with Rule 42.\n• Under Section 14 of the Customs Act, 1962 read with Rule 10(1)(c) of the Customs Valuation Rules, 2007, compulsory patent royalty of USD 250,000 payable to Aetherion GmbH as a pre-condition of sale of imported lithium cathode machinery (CIF Value = USD 5,000,000) is includible in Assessable Value = USD 5,250,000.',
          exception: 'Post-importation technical training or assembly charges distinguishable from the price actually paid or payable for imported goods are excluded under Rule 10, whereas condition-of-sale patent royalties are mandatorily added under Rule 10(1)(c).',
          example: 'Customs Assessable Value = (USD 5,000,000 CIF + USD 250,000 Royalty) × ₹84.10 CBIC Notified Exchange Rate = ₹44,15,25,000.'
        },
        {
          title: '5. Advanced Auditing & Professional Ethics (Audit) — Sec 143(12) Fraud Reporting, CARO 2020 & SA 600',
          description: '• Forensic review of the IC Engine Unit revealed that the Plant Head had colluded with scrap dealers to siphon off ₹1.45 Crore of copper windings during FY 2025-26.\n• Since the fraud committed by an officer/employee individually involves ₹1 Crore or more (₹1.45 Crore), the Statutory Auditor MUST report the fraud to the Central Government under Section 143(12) read with Rule 13 of Companies (Audit and Auditors) Rules, 2014: forward report to Board/Audit Committee within 2 days → wait 45 days for reply → file Form ADT-4 with Secretary, MCA within 15 days.\n• Under CARO 2020, report under Clause (xi)(a) (fraud by/on company), Clause (xi)(b) (filing of Form ADT-4), and Clause (ii)(b) (working capital limit > ₹5 Crore from banks where quarterly stock/book-debt statements show ₹6.50 Crore variance).',
          exception: 'If a fraud involves an amount of less than ₹1 Crore, the auditor reports within 2 days to the Audit Committee/Board u/s 143(12) read with Rule 13(3) and discloses the nature/amount in the Board’s Report (no Form ADT-4 to Central Government).',
          example: 'Fraud Amount = ₹1.45 Crore (≥ ₹1 Crore) ⇒ Mandatory Central Government reporting in Form ADT-4 + CARO 2020 Clause (xi)(a) & (b) disclosure.'
        },
        {
          title: '6. Corporate & Economic Laws (SPOM Set A) — Sec 185 Loan to Director-Interested Entity, Sec 186 & SEBI LODR Reg 23',
          description: '• Aetherion proposes to advance a corporate loan of ₹45 Crore at 9.20% p.a. (above 10-year G-Sec yield of 7.10%) to Helios Auto Components Pvt. Ltd., in which Aetherion’s Managing Director holds 28% voting power.\n• Under Section 185(2) of the Companies Act, 2013, a company may advance a loan to a private company in which a director is a member/director (attracting ≥ 25% voting power / accustomed to act) ONLY IF: (a) a Special Resolution is passed in a general meeting with full explanatory statement disclosure, AND (b) the borrowing company utilizes the loan exclusively for its principal business activities.\n• Under SEBI (LODR) Regulations, 2015 Regulation 23, since the aggregate transaction with the related party exceeds the materiality threshold (lower of ₹1,000 Crore or 10% of annual consolidated turnover), prior approval of shareholders (where all related parties abstain from voting irrespective of whether they are party to the specific transaction) is mandatory.',
          exception: 'Under Section 185(1), advancing a loan directly to a Director or to a firm in which a Director/relative is a partner is strictly prohibited; Section 185(2) conditional exemption applies only to entities specified in the Explanation to Section 185(2).',
          example: '28% voting power held by MD in Helios Pvt. Ltd. triggers Section 185(2) → Requires Special Resolution + Principal Business Utilization.'
        },
        {
          title: '7. Strategic Cost Management & Performance Evaluation (SCMPE — SPOM Set B) — Transfer Pricing & Target Costing',
          description: '• VoltCore Battery Division produces 1,00,000 battery packs/year (100% capacity): Variable Manufacturing Cost = ₹42,000/pack, External Selling Price = ₹60,000/pack (including ₹3,000/pack variable selling & distribution cost).\n• External demand is 75,000 packs/year; Aetherion’s EV Assembly Division requires 40,000 packs/year, and ₹3,000/pack variable selling expense is completely saved on internal transfers.\n• Spare capacity = 25,000 packs (Minimum Transfer Price = ₹42,000/pack); Remaining 15,000 packs displace external sales (Contribution foregone = ₹60,000 − ₹42,000 − ₹3,000 = ₹15,000/pack ⇒ Minimum Transfer Price = ₹42,000 + ₹15,000 = ₹57,000/pack).\n• Weighted Minimum Transfer Price across 40,000 packs = [(25,000 × ₹42,000) + (15,000 × ₹57,000)] / 40,000 = ₹47,625 per pack.',
          exception: 'When variable selling expenses (₹3,000/pack) are avoidable on internal transfers, the opportunity cost of lost external sales is reduced by the saved selling expense (₹18,000 gross contribution − ₹3,000 saved selling cost = ₹15,000 net opportunity cost).',
          example: 'Minimum Transfer Price Range: ₹42,000/pack (for first 25,000 units using idle capacity) and ₹57,000/pack (for next 15,000 units displacing external sales), averaging ₹47,625/pack.'
        }
      ],
      visualBreakdown: {
        title: '7-Subject Integrated Business Solutions (IBS) Statutory & Quantitative Synthesis Matrix',
        type: 'table',
        headers: ['CA Final Subject Pillar', 'Governing Provision / Standard', 'Case Fact Trigger', 'Quantitative Computation / Legal Threshold', 'Final Exam Conclusion'],
        rows: [
          ['1. Financial Reporting (FR)', 'Ind AS 103 & Ind AS 12', '80% acquisition of VoltCore (₹640 Cr); ₹100 Cr fair value uplift on patent', 'DTL = ₹100 Cr × 25.168% = ₹25.168 Cr; Net Assets = ₹574.832 Cr; NCI = ₹155 Cr', 'Goodwill = ₹220.168 Crore; No DTL on Goodwill recognition u/s Ind AS 12 Para 15(a)'],
          ['2. Adv. Financial Mgmt (AFM)', 'WACC, EVA & Forex Hedging', 'Invested Capital ₹1,200 Cr; EBIT ₹240 Cr; USD 5M 6M payable', 'WACC = 12.00%; NOPAT = ₹179.60 Cr; EVA = +₹35.60 Cr; Forward = ₹42.80 Cr vs MMH = ₹43.03 Cr', 'Positive EVA (+₹35.60 Cr); Select 6-Month Forward Cover (saves ₹22.94 Lakhs)'],
          ['3. Direct Tax Laws (DT)', 'Sec 50B, Rule 11UAE & Sec 92CE', 'Slump sale for ₹210 Cr (FMV1 ₹228 Cr); TP royalty adjustment ₹18 Cr', 'Net Worth = ₹125 Cr (ignoring ₹20 Cr revaluation); LTCG = ₹228 Cr − ₹125 Cr = ₹103 Cr', 'LTCG ₹103 Cr taxable @ 12.5%; Repatriate ₹18 Cr within 90 days or pay 20.9664% tax u/s 92CE(2A)'],
          ['4. Indirect Tax Laws (IDT)', 'Notif. 12/2017, Sec 18(3) & Customs Rule 10(1)(c)', 'Going concern transfer; USD 250k patent royalty on USD 5M machinery import', 'Going concern = Exempt; Common ITC reversal u/r 42; Customs AV = USD 5.25M × ₹84.10 = ₹44.1525 Cr', 'File Form GST ITC-02 for ITC transfer; Add USD 250k royalty to Customs Assessable Value'],
          ['5. Auditing & Ethics (Audit)', 'Sec 143(12), Rule 13 & CARO 2020 Cl (ii)/(xi)', '₹1.45 Cr copper scrap fraud by Plant Head; ₹6.50 Cr bank stock statement variance', 'Fraud ≥ ₹1 Crore threshold; Sanctioned WC limit > ₹5 Crore threshold', 'Report to Board in 2 days → Wait 45 days → File Form ADT-4 with MCA in 15 days + CARO Cl (ii)(b) & (xi)'],
          ['6. Corp & Econ Laws (SPOM A)', 'Companies Act Sec 185(2), Sec 186 & SEBI LODR Reg 23', '₹45 Cr loan to Helios Pvt Ltd where MD holds 28% voting power', '≥ 25% voting power triggers Sec 185(2); Rate 9.20% ≥ G-Sec 7.10% u/s 186(7)', 'Valid only via Special Resolution + Principal Business utilization + SEBI Reg 23 RPT approval'],
          ['7. SCMPE (SPOM Set B)', 'Internal Transfer Pricing & Opportunity Cost', '40,000 battery packs internal transfer (25k idle capacity + 15k lost external sales)', 'Idle 25k @ ₹42,000 + Displaced 15k @ ₹57,000 (₹42k VC + ₹15k net lost contribution)', 'Minimum Transfer Price = ₹47,625/pack; Maximum = ₹60,000/pack market price']
        ]
      }
    }
  ],
  ...INTERMEDIATE_CHAPTER_SUMMARIES,
  ...FOUNDATION_CHAPTER_SUMMARIES,
  ...CMA_CHAPTER_SUMMARIES
};

export const FORM_ITEMS: Record<SubjectId, FormulaItem[]> = {
  AFM: [
    {
      chapterName: 'Security Valuation',
      formulaName: 'Required Return on Equity (CAPM Model)',
      equation: 'K<sub>e</sub> = R<sub>f</sub> + β × (R<sub>m</sub> − R<sub>f</sub>)',
      context: 'Calculates the minimum rate of return expected by equity investors based on systematic risk (Beta).',
      variables: [
        { name: 'K<sub>e</sub>', desc: 'Required Rate of Return on Equity' },
        { name: 'R<sub>f</sub>', desc: 'Risk-free rate of return (e.g. Government bond yield)' },
        { name: 'β', desc: 'Beta coefficient of the security (measure of systematic risk)' },
        { name: 'R<sub>m</sub>', desc: 'Expected return on the market portfolio' },
        { name: 'R<sub>m</sub> − R<sub>f</sub>', desc: 'Market Risk Premium (or Equity Risk Premium)' }
      ],
      workedExample: {
        scenario: 'Calculate required return on share A if risk-free rate is 5.00%, beta is 1.5, and market risk premium is 4.50%.',
        calculation: 'K<sub>e</sub> = R<sub>f</sub> + β × (R<sub>m</sub> − R<sub>f</sub>)\nK<sub>e</sub> = 5.00% + 1.5 × 4.50%\nK<sub>e</sub> = 5.00% + 6.75%\nK<sub>e</sub> = 11.75%',
        output: '11.75%'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Gordon Constant Growth Model (Share Price)',
      equation: 'P<sub>0</sub> = D<sub>1</sub> / (K<sub>e</sub> − g) = [ D<sub>0</sub> × (1 + g) ] / (K<sub>e</sub> − g)',
      context: 'Values equity shares based on dividends growing at a constant rate into infinity.',
      variables: [
        { name: 'P<sub>0</sub>', desc: 'Current intrinsic value of the share today' },
        { name: 'D<sub>1</sub>', desc: 'Expected dividend at the end of Year 1' },
        { name: 'D<sub>0</sub>', desc: 'Dividend just paid' },
        { name: 'K<sub>e</sub>', desc: 'Required rate of return (cost of equity)' },
        { name: 'g', desc: 'Constant growth rate of dividends (g = b × r)' }
      ],
      workedExample: {
        scenario: 'A company paid ₹3.00 dividend, growing at 10% forever. Required rate of return is 15%.',
        calculation: 'D<sub>1</sub> = D<sub>0</sub> × (1 + g) = 3.00 × (1 + 0.10) = 3.30\nP<sub>0</sub> = D<sub>1</sub> / (K<sub>e</sub> − g)\nP<sub>0</sub> = 3.30 / (0.15 − 0.10)\nP<sub>0</sub> = 3.30 / 0.05 = ₹66.00',
        output: '₹66.00'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'H-Model for Two-Stage Variable Growth',
      equation: 'P<sub>0</sub> = [ D<sub>0</sub> × (1 + g<sub>n</sub>) / (r − g<sub>n</sub>) ] + [ D<sub>0</sub> × H × (g<sub>c</sub> − g<sub>n</sub>) / (r − g<sub>n</sub>) ]',
      context: 'Values shares assuming high initial growth declines linearly to a stable long-run rate over a transition period.',
      variables: [
        { name: 'P<sub>0</sub>', desc: 'Intrinsic value of the share today' },
        { name: 'D<sub>0</sub>', desc: 'Dividend just paid' },
        { name: 'g<sub>n</sub>', desc: 'Long-run stable normal growth rate' },
        { name: 'g<sub>c</sub>', desc: 'Current short-term initial growth rate' },
        { name: 'r', desc: 'Required return of equity investors (K<sub>e</sub>)' },
        { name: 'H', desc: 'Half of the transition period duration in years (Transition period = 2H)' }
      ],
      workedExample: {
        scenario: 'Dividend just paid is ₹2.00, growing at 12% initially, declining linearly over 6 years to 7% stable. Required rate is 15%.',
        calculation: 'H = 6 / 2 = 3 years\nNormal Growth Value = [ D<sub>0</sub> × (1 + g<sub>n</sub>) ] / (r − g<sub>n</sub>)\n                    = [ 2.00 × 1.07 ] / (0.15 − 0.07) = 26.75\nAbnormal Growth Premium = [ D<sub>0</sub> × H × (g<sub>c</sub> − g<sub>n</sub>) ] / (r − g<sub>n</sub>)\n                        = [ 2.00 × 3 × (0.12 − 0.07) ] / (0.15 − 0.07) = 3.75\nP<sub>0</sub> = 26.75 + 3.75 = ₹30.50',
        output: '₹30.50'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Walter\'s Valuation Approach',
      equation: 'P<sub>0</sub> = [ D + (r / K<sub>e</sub>) × (E − D) ] / K<sub>e</sub>',
      context: 'Models share price as a function of dividend payout and the premium/discount on internal reinvestments.',
      variables: [
        { name: 'P<sub>0</sub>', desc: 'Market price of the ordinary share' },
        { name: 'D', desc: 'Dividend per share (DPS)' },
        { name: 'E', desc: 'Earnings per share (EPS)' },
        { name: 'r', desc: 'Return on internal retention (internal rate of return on reinvestments)' },
        { name: 'K<sub>e</sub>', desc: 'Capitalization rate / required return of investors (cost of equity)' }
      ],
      workedExample: {
        scenario: 'Book value per share is ₹137.80. EPS is ₹20.67, DPS is ₹8.27, r is 15%, Ke is 18%.',
        calculation: 'P<sub>0</sub> = [ D + (r / K<sub>e</sub>) × (E − D) ] / K<sub>e</sub>\nP<sub>0</sub> = [ 8.27 + (0.15 / 0.18) × (20.67 − 8.27) ] / 0.18\nP<sub>0</sub> = [ 8.27 + 0.8333 × 12.40 ] / 0.18\nP<sub>0</sub> = [ 8.27 + 10.333 ] / 0.18 = 18.603 / 0.18 = ₹103.35',
        output: '₹103.35'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Theoretical Ex-Right Price (TERP)',
      equation: 'P<sub>ex</sub> = (n × P<sub>0</sub> + S) / (n + n<sub>1</sub>)',
      context: 'Calculates the theoretical market price of a share immediately after a rights issue.',
      variables: [
        { name: 'P<sub>ex</sub>', desc: 'Ex-right share price (Theoretical Ex-Right Price / TERP)' },
        { name: 'n', desc: 'Number of existing shares held (or ratio of existing shares)' },
        { name: 'P<sub>0</sub>', desc: 'Price of share pre-right issue' },
        { name: 'S', desc: 'Subscription amount raised from right issue under new share offering (n<sub>1</sub> × Subscription Price)' },
        { name: 'n<sub>1</sub>', desc: 'Number of new shares offered (or ratio of new shares)' }
      ],
      workedExample: {
        scenario: 'ABC Ltd. shares sell at ₹13. Offers 1 right share for every 2 held. Subscription price is ₹4.',
        calculation: 'n = 2, n<sub>1</sub> = 1, P<sub>0</sub> = 13, Subscription Price = 4\nS = n<sub>1</sub> × Subscription Price = 1 × 4 = 4\nP<sub>ex</sub> = (n × P<sub>0</sub> + S) / (n + n<sub>1</sub>)\nP<sub>ex</sub> = (2 × 13 + 4) / (2 + 1)\nP<sub>ex</sub> = (26 + 4) / 3 = ₹10.00',
        output: '₹10.00'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Free Cash Flow to Firm (FCFF) - Net Income Based',
      equation: 'FCFF = Net Income + [ Interest × (1 − t) ] + Depreciation − CAPEX − ΔNWC',
      context: 'Calculates actual cash flows generated by operating activities available to all capital providers.',
      variables: [
        { name: 'Net Income', desc: 'Profit after taxes but before dividends' },
        { name: 'Interest', desc: 'Interest expense paid to lenders' },
        { name: 't', desc: 'Marginal corporate tax rate' },
        { name: 'Depreciation', desc: 'Non-cash depreciation & amortization expenses' },
        { name: 'CAPEX', desc: 'Capital expenditure on purchasing fixed assets' },
        { name: 'ΔNWC', desc: 'Increase (+) or decrease (−) in non-cash net working capital' }
      ],
      workedExample: {
        scenario: 'EBITDA: ₹120 Lakhs, Tax rate: 30%, CAPEX: ₹40 Lakhs, Working Capital increase: ₹5 Lakhs, Depreciation: ₹15 Lakhs.',
        calculation: 'FCFF = EBIT × (1 − t) + Depreciation − CAPEX − ΔNWC\nIf EBIT = EBITDA − Depreciation = 120 − 15 = 105 Lakhs:\nFCFF = 105 × (1 − 0.30) + 15 − 40 − 5\nFCFF = 105 × 0.70 + 15 − 45\nFCFF = 73.5 + 15 − 45 = 43.50 Lakhs',
        output: '₹43.50 Lakhs'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Free Cash Flow to Equity (FCFE)',
      equation: 'FCFE = Net Income + Depreciation − CAPEX − ΔNWC + New Debt Issued − Debt Repayments',
      context: 'Calculates actual cash available for equity shareholders after meeting all reinvestment and net debt service obligations.',
      variables: [
        { name: 'Net Income', desc: 'Profit after taxes, interest, and preference dividends' },
        { name: 'Depreciation', desc: 'Non-cash depreciation & amortization expenses' },
        { name: 'CAPEX', desc: 'Capital expenditure on fixed assets' },
        { name: 'ΔNWC', desc: 'Change in non-cash net working capital' },
        { name: 'New Debt Issued', desc: 'Fresh borrowings raised during the period' },
        { name: 'Debt Repayments', desc: 'Principal repayment of existing debt' }
      ],
      workedExample: {
        scenario: 'Profit after tax is ₹8.923 per share. CAPEX is ₹47, Depreciation is ₹39, Working Capital change is ₹3.45. Debt ratio is 27%. FCFE is calculated by scaling the net investment by (1 - debt ratio).',
        calculation: 'FCFE = Net Income − (1 − Debt Ratio) × (CAPEX − Depreciation) − (1 − Debt Ratio) × ΔNWC\nFCFE = 8.923 − (1 − 0.27) × (47 − 39) − (1 − 0.27) × 3.45\nFCFE = 8.923 − 5.84 − 2.5185 = ₹0.5645',
        output: '₹0.5645 per share'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Macaulay Duration',
      equation: 'Duration (D) = [ ∑<sub>t=1</sub><sup>n</sup> (t × C) / (1 + i)<sup>t</sup> + (n × M) / (1 + i)<sup>n</sup> ] / P',
      context: 'Measures the weighted average time required to recover the bond’s cash flows.',
      variables: [
        { name: 't', desc: 'Time period of cash flow' },
        { name: 'C', desc: 'Annual coupon payment amount' },
        { name: 'i', desc: 'Required yield / Yield to Maturity (YTM)' },
        { name: 'M', desc: 'Maturity / par value of the bond' },
        { name: 'P', desc: 'Current market price of the bond' }
      ],
      workedExample: {
        scenario: 'Calculate duration of 6-year bond, coupon rate 16%, YTM 17%, Price ₹964.24.',
        calculation: 'Duration (D) = [ ∑<sub>t=1</sub><sup>n</sup> [ t × C / (1 + i)<sup>t</sup> ] + n × M / (1 + i)<sup>n</sup> ] / P\nSum of present value of time-weighted cash flows = 4091.20\nPrice of the bond (P) = 964.40\nMacaulay Duration = 4091.20 / 964.40 = 4.242 years',
        output: '4.242 years'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Bond Convexity Coefficient (C*)',
      equation: 'C<sup>*</sup> = (V<sub>+</sub> + V<sub>−</sub> − 2 × V<sub>0</sub>) / [ 2 × V<sub>0</sub> × (Δy)<sup>2</sup> ]',
      context: 'Calculates the curvature of the bond price-yield relationship to adjust duration for large interest rate shifts.',
      variables: [
        { name: 'V<sub>0</sub>', desc: 'Initial market price of the bond' },
        { name: 'V<sub>+</sub>', desc: 'Price of bond if yield increases by Δy' },
        { name: 'V<sub>−</sub>', desc: 'Price of bond if yield decreases by Δy' },
        { name: 'Δy', desc: 'Change in yield (expressed as a decimal, e.g. 0.01)' }
      ],
      workedExample: {
        scenario: 'Initial price of bond V0 = 964.40, V_plus = 938.14, V_minus = 991.10 for yield change Δy = 0.01 (1%).',
        calculation: 'C<sup>*</sup> = (V<sub>+</sub> + V<sub>−</sub> − 2 × V<sub>0</sub>) / [ 2 × V<sub>0</sub> × (Δy)<sup>2</sup> ]\nC<sup>*</sup> = (938.14 + 991.10 − 2 × 964.40) / [ 2 × 964.40 × (0.01)<sup>2</sup> ]\nC<sup>*</sup> = (1929.24 − 1928.80) / [ 1928.80 × 0.0001 ]\nC<sup>*</sup> = 0.44 / 0.19288 = 2.28',
        output: '2.28'
      }
    },
    {
      chapterName: 'Security Valuation',
      formulaName: 'Treasury Bill (T-Bill) Yield',
      equation: 'Y = [ (F − P) / P ] × (365 / M) × 100',
      context: 'Calculates the annualized yield on short-term government zero-coupon treasury bills.',
      variables: [
        { name: 'Y', desc: 'Annualized T-Bill Yield' },
        { name: 'F', desc: 'Face value / redemption value' },
        { name: 'P', desc: 'Issue price / purchase price' },
        { name: 'M', desc: 'Actual days to maturity' }
      ],
      workedExample: {
        scenario: 'RBI sells a 91-day T-bill with face value ₹100 at yield of 6.00%. Calculate purchase price.',
        calculation: 'Y = [ (F − P) / P ] × (365 / M) × 100\n0.06 = [ (100 − P) / P ] × (365 / 91)\n0.06 = [ (100 − P) / P ] × 4.011\n0.01496 × P = 100 − P\n1.01496 × P = 100\nP = 100 / 1.01496 = ₹98.53',
        output: '₹98.53'
      }
    }
  ],
  FR: [],
  Audit: [],
  DT: [],
  IDT: [],
  IBS: [],
  AdvAcc: INTERMEDIATE_FORM_ITEMS.AdvAcc || [],
  CorpLaw: [],
  Tax: INTERMEDIATE_FORM_ITEMS.Tax || [],
  Cost: INTERMEDIATE_FORM_ITEMS.Cost || [],
  AuditInter: [],
  FMSM: INTERMEDIATE_FORM_ITEMS.FMSM || [],
  Accounts: FOUNDATION_FORM_ITEMS.Accounts || [],
  Law: [],
  MathStats: FOUNDATION_FORM_ITEMS.MathStats || [],
  Econ: FOUNDATION_FORM_ITEMS.Econ || [],
  ...CMA_FORM_ITEMS
};

export const STATUTORY_SECTIONS: Record<string, StatutorySection[]> = {
  Audit: AUDIT_STATUTORY_SECTIONS,
  DT: [
    {
      number: 'Sec 28 (IT)',
      heading: 'Profits & Gains of Business or Profession — Charged to Income Tax',
      purpose: 'The primary charging section for income under the head PGBP, listing out specific receipts that are taxable.',
      subsections: [
        { number: 'Sec 28(i)', heading: 'Active Profits of Business or Profession', purpose: 'Taxability of profits and gains of any business or profession carried on by the assessee at any time during the previous year.' },
        { number: 'Sec 28(ii)', heading: 'Specified Business Compensations', purpose: 'Any compensation or other payment due to or received by any person managing the agency or affairs of any Indian or foreign entity.' },
        { number: 'Sec 28(va)', heading: 'Non-Compete or Non-Sharing Agreements Sums', purpose: 'Any sum received or receivable under an agreement for not carrying out any activity in relation to any business or profession, or not sharing any patent, copyright, trademark, etc.' },
        { number: 'Sec 28(vi)', heading: 'FMV of Converted Inventory to Capital Asset', purpose: 'The fair market value of inventory on the date on which it is converted into, or treated as, a capital asset, which is taxed as business profit.' },
        { number: 'Sec 28(via)', heading: 'Specified Asset Demolition or Transfer Sums', purpose: 'Any sum received or receivable in connection with the demolition, destruction, or transfer of a capital asset whose cost is fully allowed as a deduction u/s 35AD.' }
      ]
    },
    {
      number: 'Sec 37 (IT)',
      heading: 'General Business Deductions — Residuary Section',
      purpose: 'Enables deduction of business expenditures not covered under Sections 30 to 36, subject to strict statutory explanations.',
      subsections: [
        { number: 'Sec 37(1)', heading: 'General Deduction Eligibility Criteria', purpose: 'Any expenditure (not personal or capital) laid out wholly and exclusively for the purpose of the business or profession is fully allowable.' },
        { number: 'Sec 37(1) Expl 1', heading: 'Disallowance of Illegal Expenditures / Offences', purpose: 'Any expenditure incurred by an assessee for any purpose which is an offence or which is prohibited by law (like bribes, penalties) is strictly disallowed.' },
        { number: 'Sec 37(1) Expl 2', heading: 'Disallowance of CSR Spendings', purpose: 'Expenditure incurred by an assessee on activities relating to Corporate Social Responsibility u/s 135 of the Companies Act, 2013 is not deemed business spend and is disallowed.' },
        { number: 'Sec 37(1) Expl 3', heading: 'Disallowance of Unauthorised Benefits/Perquisites', purpose: 'Disallows any expenditure on providing a benefit or perquisite to a person where acceptance constitutes a violation of any law, regulation, or medical council/professional guidelines.' }
      ]
    },
    {
      number: 'Sec 43B (IT)',
      heading: 'Deductions Allowable exclusively on Actual Payment Basis',
      purpose: 'Overrides other accounting methods, allowing specific tax deductions only if paid u/s 139(1) return filing dates, with a special exception for MSMEs.',
      subsections: [
        { number: 'Sec 43B(a)', heading: 'Taxes, Duties, Cess, or Fees Deductibility', purpose: 'Any sum payable by way of statutory tax, duty, cess, or fee under any law for the time being in force is deductible only on actual payment.' },
        { number: 'Sec 43B(b)', heading: 'Employer Contribution to Welfare Funds', purpose: 'Any sum payable by the assessee as an employer by way of contribution to any provident fund, superannuation fund, gratuity fund, or employee welfare fund.' },
        { number: 'Sec 43B(g)', heading: 'Payments due to Indian Railways', purpose: 'Any sum payable by the assessee to the Indian Railways for the use of railway assets, deductible on actual payment.' },
        { number: 'Sec 43B(h)', heading: 'Vendor Payments to Micro & Small Enterprises (MSMED)', purpose: 'Any sum payable by the assessee to a Micro or Small Enterprise beyond the time limit specified in section 15 of the MSME Development Act, 2006. Deductible ONLY in the year of actual payment.' }
      ]
    },
    {
      number: 'Sec 115BAA (IT)',
      heading: 'Concessional Tax Regime for Domestic Corporate Entities',
      purpose: 'Provides domestic companies an option of paying base income tax at a flat 22%, plus flat 10% surcharge, provided they relinquish specified exemptions.',
      subsections: [
        { number: 'Sec 115BAA(1)', heading: 'Application and Concessional Tax Option', purpose: 'Taxpayer domestic companies can pay tax at 22% (effective 25.17% with SC & Cess) for Assessment Years onward, upon exercise of a one-time irrevocable option.' },
        { number: 'Sec 115BAA(2)', heading: 'Withheld Deductions & Allowances Conditions', purpose: 'Mandates the relinquishment of standard incentives u/s 10AA (SEZ), 32(1)(iia) (additional depreciation), 33AB, 33ABA, 35 (scientific research), 35AD, 35CCC, etc.' },
        { number: 'Sec 115BAA(2)(b)', heading: 'Exclusion of Chapter VI-A Deductions', purpose: 'Blocks all standard Chapter VI-A deductions except Section 80JJAA (new employments) and Section 80M (deduction on inter-corporate dividends).' },
        { number: 'Sec 115BAA(3)', heading: 'Disallowance of Carried-Forward Losses Set-Off', purpose: 'Assessee cannot set-off any carry-forward loss or unabsorbed depreciation from earlier assessment years if such loss/depreciation is attributable to any of the disallowed tax incentives.' }
      ]
    },
    {
      number: 'Sec 56 (IT)',
      heading: 'Income from Other Sources — Residuary Charging Section',
      purpose: 'Charges any taxable income to tax that cannot be categorized under the other 4 heads of income.',
      subsections: [
        { number: 'Sec 56(1)', heading: 'General residuary chargeability', purpose: 'Income of every kind which is not to be excluded from total income under this Act shall be chargeable to income-tax under the head "Income from other sources", if it is not chargeable under any other head.' },
        { number: 'Sec 56(2)(i)', heading: 'Dividend Income taxability', purpose: 'Deems all dividend income received from any domestic or foreign company as strictly taxable under IFOS.' },
        { number: 'Sec 56(2)(ib)', heading: 'Casual Income wins chargeability', purpose: 'Taxability of winnings from lotteries, crossword puzzles, races, card games, or any form of betting or gambling.' },
        { number: 'Sec 56(2)(viii)', heading: 'Interest on Compensations', purpose: 'Brings interest received on compensation or enhanced compensation to tax in the year of receipt.' },
        { number: 'Sec 56(2)(ix)', heading: 'Forfeited Negotiation Advances', purpose: 'Taxability of advance money received and forfeited in the course of transfer negotiations of a capital asset if transfer fails.' },
        { number: 'Sec 56(2)(x)', heading: 'Gifts and Deemed Under-Value Transfers', purpose: 'Imposes tax on money or specific property received without or for inadequate consideration above prescribed margins.' },
        { number: 'Sec 56(2)(xiii)', heading: 'Non-Exempt LIP maturity receipts', purpose: 'Taxability of sums received under any life insurance policy (other than ULIP/Keyman) issued on/after 1.4.2023 with annual premiums crossing ₹5,00,000.' }
      ]
    },
    {
      number: 'Sec 57 (IT)',
      heading: 'Deductions Allowable in computing Income from Other Sources',
      purpose: 'Specifies expenses that may be deducted from gross receipts when calculating taxable income under IFOS.',
      subsections: [
        { number: 'Sec 57(i)', heading: 'Dividend and Securities Interest expenses', purpose: 'Allows any reasonable sum paid by way of commission or remuneration to a banker for realizing such dividend or interest.' },
        { number: 'Sec 57(ii)', heading: 'Letting repairs, insurance & depreciation', purpose: 'Allows repairs, insurance premium, and depreciation for letting of machinery, plant, or furniture (with/without building).' },
        { number: 'Sec 57(iia)', heading: 'Family Pension standard deduction', purpose: 'Allows a deduction of 1/3rd of family pension, capped at ₹15,000 (old regime) or ₹25,000 (default regime u/s 115BAC).' },
        { number: 'Sec 57(iv)', heading: 'Enhanced compensation interest deduction', purpose: 'Allows a flat statutory deduction of 50% of interest received on compensation/enhanced compensation. No other deductions are permitted.' }
      ]
    }
  ],
  IDT: [
    {
      number: 'Sec 7 (CGST)',
      heading: 'Scope of Supply',
      purpose: 'The central gateway charging provision under GST, outlining what qualifies as a supply of goods or services.',
      subsections: [
        { number: 'Sec 7(1)(a)', heading: 'Active Forms of Supply with Consideration', purpose: 'Includes all forms of supply of goods or services or both such as sale, transfer, barter, exchange, license, rental, lease or disposal made or agreed to be made for a consideration in the course or furtherance of business.' },
        { number: 'Sec 7(1)(aa)', heading: 'Mutual Transactions between Entities and Members', purpose: 'Covers activities by a person, other than an individual, to its members or constituents or vice-versa, for cash, deferred payment or other valuable consideration.' },
        { number: 'Sec 7(1)(b)', heading: 'Importation of Services with Consideration', purpose: 'Covers service imports for a consideration, regardless of whether or not it is in the course or furtherance of business (crucial commercial exception).' },
        { number: 'Sec 7(1)(c)', heading: 'Deemed Supply without Consideration', purpose: 'Deems transactions specified in Schedule I to be a taxable supply under GST, even if they are carried out without any consideration.' },
        { number: 'Sec 7(1A)', heading: 'Classification via Schedule II', purpose: 'Directs that when activities qualify as a supply as per sub-section (1), they must be classified as either a supply of goods or a supply of services per Schedule II.' },
        { number: 'Sec 7(2)(a)', heading: 'Negative List — Schedule III Applicability', purpose: 'Exempts activities specified in Schedule III, treating them as neither supply of goods nor services.' },
        { number: 'Sec 7(2)(b)', heading: 'Public Authority Government Notifications', purpose: 'Treated as neither supply of goods nor services: notified public authority undertakings by Central Government, State Government, or any local authority.' }
      ]
    },
    {
      number: 'Sec 8 (CGST)',
      heading: 'Taxability of Composite and Mixed Supplies',
      purpose: 'Prescribes the definitive rule for bundling multiple products or services together in a single transaction.',
      subsections: [
        { number: 'Sec 8(a)', heading: 'Composite Supplies (Naturally Bundled)', purpose: 'A composite supply consisting of two or more taxable supplies which are naturally bundled, is treated as a supply of the predominant "principal supply".' },
        { number: 'Sec 8(b)', heading: 'Mixed Supplies (Independently Bundled)', purpose: 'A mixed supply consisting of two or more individual supplies supplied for a single price, is treated as a supply of the component which attracts the highest tax rate.' }
      ]
    },
    {
      number: 'Sec 9 (CGST)',
      heading: 'Levy and Collection of GST',
      purpose: 'The jurisdictional charging section enabling statutory levy, reverse charge application, and e-commerce liability.',
      subsections: [
        { number: 'Sec 9(1)', heading: 'Statutory CGST Levy and Rate Cap', purpose: 'Levies Central Goods and Services Tax (CGST) on all intra-state supplies of goods or services or both, at rates capped at 20%, excluding alcoholic liquor for human consumption.' },
        { number: 'Sec 9(2)', heading: 'Deferred Petroleum Levy', purpose: 'POSTPONES levy of GST on five petroleum items (crude, high speed diesel, motor spirit, natural gas, ATF) to a date notified on recommendations of the GST Council.' },
        { number: 'Sec 9(3)', heading: 'Recipient-Paid Reverse Charge (RCM)', purpose: 'Empowers the Government to specify categories of supplies of goods/services where tax is payable on a reverse charge basis by the matching recipient.' },
        { number: 'Sec 9(4)', heading: 'Reverse Charge on Unregistered Sourcing', purpose: 'Applies Reverse Charge on notified supplies from unregistered suppliers to specified classes of registered business recipients.' },
        { number: 'Sec 9(5)', heading: 'E-Commerce Operator (ECO) Liability', purpose: 'Notifies select services (e.g., cab aggregators, hotels, housekeeping) where taxable liability is completely shifted to the facilitating E-Commerce Operator.' }
      ]
    },
    {
      number: 'Sec 10 (CGST)',
      heading: 'Composition Levy',
      purpose: 'Enables registered small taxpayers to pay a flat concessional tax rate on turnover in lieu of normal GST, with reduced compliance.',
      subsections: [
        { number: 'Sec 10(1)', heading: 'Concessional Tax Eligibility & Turnover Thresholds', purpose: 'Prescribes eligibility (preceding FY turnover limits of ₹1.5 Crore or ₹75 Lakh in 8 Special States) and concessional tax rates (Manufacturers 1%, Restaurants 5%, others 1%).' },
        { number: 'Sec 10(1) Pro 2', heading: 'Marginal Supply of Services', purpose: 'Permits a goods supplier to supply marginal services up to 10% of State/UT turnover in preceding FY or ₹5 Lakh, whichever is higher.' },
        { number: 'Sec 10(2)', heading: 'Standard Eligibility Restriction Checklist', purpose: 'Bars composition if engaged in supplying non-taxable items, inter-State outward supplies, or supplies through an ECO.' },
        { number: 'Sec 10(2A)', heading: 'Composition Scheme for Services', purpose: 'Provides a flat 6% concessional rate (3% CGST + 3% SGST) for service providers with preceding FY turnover up to ₹50 Lakh.' },
        { number: 'Sec 10(3)', heading: 'Lapsing of Composition Option', purpose: 'Mandates that the composition option lapses automatically on the exact day aggregate turnover exceeds the specified statutory limits during the current FY.' },
        { number: 'Sec 10(4)', heading: 'ITC Claim & Tax Collection Prohibition', purpose: 'Prohibits composition suppliers from collecting GST from recipients or claiming any Input Tax Credit (ITC).' },
        { number: 'Sec 10(5)', heading: 'Penalty & Recovery for Irregular Option', purpose: 'Imposes heavy penalties and recovery rules if found opting for composition despite being ineligible.' }
      ]
    },
    {
      number: 'Schedule I (CGST)',
      heading: 'Activities to be Treated as Supply Even if Made Without Consideration [Read with Sec 7(1)(c)]',
      purpose: 'Exhaustive statutory list of 4 activities where GST is levied even in the complete absence of monetary or non-monetary consideration.',
      subsections: [
        { number: 'Sch I Para 1', heading: 'Permanent Transfer or Disposal of Business Assets Where ITC Was Availed', purpose: 'Any permanent transfer or disposal of business assets where Input Tax Credit (ITC) has been availed on such assets (e.g., free donation of laptops/machinery on which ITC was claimed).' },
        { number: 'Sch I Para 2', heading: 'Supply Between Related Persons or Distinct Persons (Sec 25) in Course of Business', purpose: 'Supply of goods or services or both between related persons (Explanation to Sec 15) or between distinct persons as specified in Section 25(4)/(5), when made in the course or furtherance of business (e.g., inter-state branch stock transfers).' },
        { number: 'Sch I Para 2 Proviso', heading: 'Employer-to-Employee Gift Exemption up to ₹50,000 in a Financial Year', purpose: 'Provided that gifts not exceeding ₹50,000 in value in a financial year by an employer to an employee shall NOT be treated as supply of goods or services or both (if > ₹50,000, tax applies).' },
        { number: 'Sch I Para 3(a)', heading: 'Supply of Goods by Principal to Agent (Invoice in Agent Name)', purpose: 'Supply of goods by a principal to his agent where the agent undertakes to supply such goods on behalf of the principal and issues the tax invoice to the customer in his own name (CBIC Circular 57/31/2018).' },
        { number: 'Sch I Para 3(b)', heading: 'Supply of Goods by Agent to Principal (Procurement in Agent Name)', purpose: 'Supply of goods by an agent to his principal where the agent undertakes to receive such goods on behalf of the principal and procures them on an invoice issued in his own name.' },
        { number: 'Sch I Para 4', heading: 'Import of Services by Taxable Person from Related Person / Foreign Establishment', purpose: 'Import of services by a person from a related person or from any of his other establishments outside India, in the course or furtherance of business (even without consideration; e.g., head office to Indian branch).' }
      ]
    },
    {
      number: 'Schedule II (CGST)',
      heading: 'Activities or Transactions to be Treated as Supply of Goods or Supply of Services [Read with Sec 7(1A)]',
      purpose: 'Statutory classification matrix (Paras 1 to 7) resolving whether an activity (that already constitutes a supply u/s 7(1)) is a Supply of Goods or a Supply of Services.',
      subsections: [
        { number: 'Sch II Para 1(a)', heading: 'Transfer of Title in Goods → Supply of Goods', purpose: 'Any transfer of the title in goods is classified strictly as a Supply of Goods.' },
        { number: 'Sch II Para 1(b)', heading: 'Transfer of Right or Undivided Share in Goods Without Title → Supply of Services', purpose: 'Any transfer of right in goods or of undivided share in goods without the transfer of title thereof (e.g., operating lease or hiring of machinery) is a Supply of Services.' },
        { number: 'Sch II Para 1(c)', heading: 'Transfer of Title Under Future Date / Hire-Purchase Agreement → Supply of Goods', purpose: 'Any transfer of title in goods under an agreement which stipulates that property in goods shall pass at a future date upon payment of full consideration as agreed, is a Supply of Goods.' },
        { number: 'Sch II Para 2(a)', heading: 'Lease, Tenancy, Easement or Licence to Occupy Land → Supply of Services', purpose: 'Any lease, tenancy, easement, licence to occupy land is classified as a Supply of Services.' },
        { number: 'Sch II Para 2(b)', heading: 'Lease or Letting Out of Building (Commercial / Industrial / Residential for Business) → Supply of Services', purpose: 'Any lease or letting out of the building including a commercial, industrial or residential complex for business or commerce, either wholly or partly, is a Supply of Services.' },
        { number: 'Sch II Para 3', heading: 'Treatment or Process Applied to Another Person’s Goods (Job Work) → Supply of Services', purpose: 'Any treatment or process which is applied to another person\'s goods (such as job work, dyeing, electroplating, or testing) is a Supply of Services.' },
        { number: 'Sch II Para 4(a)', heading: 'Permanent Transfer or Disposal of Business Assets → Supply of Goods', purpose: 'Where goods forming part of the assets of a business are transferred or disposed of by or under the directions of the person carrying on the business so as no longer to form part of those assets (whether or not for consideration), such transfer/disposal is a Supply of Goods.' },
        { number: 'Sch II Para 4(b)', heading: 'Private or Non-Business Use of Business Goods → Supply of Services', purpose: 'Where goods held or used for the purposes of business are put to any private use or made available to any person for use for any non-business purpose (whether or not for consideration), such usage is a Supply of Services.' },
        { number: 'Sch II Para 4(c)', heading: 'Deemed Supply of Goods on Ceasing to be a Taxable Person (With 2 Exceptions)', purpose: 'Where any person ceases to be a taxable person, any goods forming part of his business assets shall be deemed to be supplied by him (Supply of Goods) immediately before ceasing to be a taxable person — EXCEPT: (i) where business is transferred as a going concern; or (ii) where business is carried on by a personal representative deemed to be a taxable person.' },
        { number: 'Sch II Para 5(a)', heading: 'Renting of Immovable Property → Supply of Services', purpose: 'Renting of any immovable property is classified as a Supply of Services.' },
        { number: 'Sch II Para 5(b)', heading: 'Under-Construction Complex / Building / Civil Structure Before Completion Certificate → Supply of Services', purpose: 'Construction of a complex, building, civil structure or part thereof intended for sale to a buyer is a Supply of Services, EXCEPT where the entire consideration has been received AFTER issuance of completion certificate by the competent authority or after its first occupation, whichever is earlier.' },
        { number: 'Sch II Para 5(c)', heading: 'Temporary Transfer or Permitting Use/Enjoyment of IPR → Supply of Services', purpose: 'Temporary transfer or permitting the use or enjoyment of any intellectual property right (patent, copyright, trademark, design) is a Supply of Services.' },
        { number: 'Sch II Para 5(d)', heading: 'Development, Design, Programming & Customisation of IT Software → Supply of Services', purpose: 'Development, design, programming, customisation, adaptation, upgradation, enhancement, or implementation of information technology software is a Supply of Services.' },
        { number: 'Sch II Para 5(e)', heading: 'Agreeing to Refrain from an Act, Tolerate an Act, or Do an Act → Supply of Services', purpose: 'Agreeing to the obligation to refrain from an act (non-compete), or to tolerate an act or a situation, or to do an act (for separate consideration; excluding liquidated damages for breach of contract per CBIC Circular 178/10/2022) is a Supply of Services.' },
        { number: 'Sch II Para 5(f)', heading: 'Transfer of Right to Use Any Goods for Any Purpose → Supply of Services', purpose: 'Transfer of the right to use any goods for any purpose (whether or not for a specified period) for cash, deferred payment or other valuable consideration is a Supply of Services.' },
        { number: 'Sch II Para 6(a)', heading: 'Composite Supply: Works Contract [Sec 2(119)] → Supply of Services', purpose: 'Works contract (building, construction, fabrication, completion, erection, installation, fitting out, improvement, modification, repair, maintenance, renovation, alteration or commissioning of any immovable property involving transfer of property in goods) is a Supply of Services.' },
        { number: 'Sch II Para 6(b)', heading: 'Composite Supply: Restaurant & Outdoor Catering Food/Drinks → Supply of Services', purpose: 'Supply, by way of or as part of any service or in any other manner whatsoever, of goods, being food or any other article for human consumption or any drink (other than alcoholic liquor for human consumption) is a Supply of Services.' },
        { number: 'Sch II Para 7', heading: 'Supply of Goods by Unincorporated Associations / Clubs to Members [Omitted w.e.f. 01.07.2017]', purpose: 'Omitted retrospectively w.e.f. 01.07.2017 by Finance Act, 2021 consequent to insertion of Section 7(1)(aa), which covers both goods and services supplied between an entity and its members.' }
      ]
    },
    {
      number: 'Schedule III (CGST)',
      heading: 'Activities or Transactions Which Shall be Treated Neither as a Supply of Goods Nor a Supply of Services [Read with Sec 7(2)(a)]',
      purpose: 'Statutory Negative List (Paras 1 to 10 & Explanations 1–2) completely excluded from the scope of GST.',
      subsections: [
        { number: 'Sch III Para 1', heading: 'Services by an Employee to the Employer in the Course of Employment', purpose: 'Services by an employee to the employer in the course of or in relation to his employment (includes perquisites under employment contract and Whole-Time/Executive Director salary u/s 192).' },
        { number: 'Sch III Para 2', heading: 'Services by Any Court or Tribunal Established Under Any Law', purpose: 'Services by any court or Tribunal established under any law for the time being in force (per Explanation 1, "court" includes District Court, High Court, and Supreme Court).' },
        { number: 'Sch III Para 3(a)', heading: 'Functions Performed by MPs, MLAs, Members of Panchayats & Municipalities', purpose: 'The functions performed by the Members of Parliament, Members of State Legislature, Members of Panchayats, Members of Municipalities and Members of other local authorities.' },
        { number: 'Sch III Para 3(b)', heading: 'Duties Performed by Constitutional Post Holders', purpose: 'The duties performed by any person who holds any post in pursuance of the provisions of the Constitution in that capacity (e.g., President, Governor, CAG, Election Commissioners).' },
        { number: 'Sch III Para 3(c)', heading: 'Duties of Chairperson / Member / Director in Statutory Government Body', purpose: 'The duties performed by any person as a Chairperson or a Member or a Director in a body established by the Central Government or a State Government or local authority and who is not deemed as an employee before the commencement of this clause.' },
        { number: 'Sch III Para 4', heading: 'Funeral, Burial, Crematorium, Mortuary & Transportation of the Deceased', purpose: 'Services of funeral, burial, crematorium or mortuary including transportation of the deceased by any mode.' },
        { number: 'Sch III Para 5', heading: 'Sale of Land and Sale of Completed Building', purpose: 'Sale of land and, subject to clause (b) of Paragraph 5 of Schedule II, sale of building (where entire consideration is received after issuance of completion certificate by competent authority or after first occupation, whichever is earlier).' },
        { number: 'Sch III Para 6', heading: 'Actionable Claims Other Than Specified Actionable Claims', purpose: 'Actionable claims (such as unsecured debts, insurance claims, arrears of rent) OTHER THAN specified actionable claims [i.e., lottery, betting, gambling, horse racing, casinos, and online money gaming remain taxable @ 28%].' },
        { number: 'Sch III Para 7', heading: 'Third-Country Merchanting Trade (Non-Taxable Territory to Non-Taxable Territory)', purpose: 'Supply of goods from a place in the non-taxable territory to another place in the non-taxable territory without such goods entering into India (no ITC reversal required per Sec 17(3)).' },
        { number: 'Sch III Para 8(a)', heading: 'In-Bond Sale of Warehoused Goods Before Clearance for Home Consumption', purpose: 'Supply of warehoused goods (as defined in the Customs Act, 1962 per Explanation 2) to any person before clearance for home consumption by filing ex-bond Bill of Entry.' },
        { number: 'Sch III Para 8(b)', heading: 'High Seas Sales (Endorsement of Documents of Title Before Clearance)', purpose: 'Supply of goods by the consignee to any other person, by endorsement of documents of title to the goods, after the goods have been dispatched from the port of origin located outside India but before clearance for home consumption.' },
        { number: 'Sch III Para 9', heading: 'Co-Insurance Premium Apportionment by Lead Insurer to Co-Insurer [FA 2024]', purpose: 'Activity of apportionment of co-insurance premium by lead insurer to the co-insurer for the insurance services jointly supplied by the lead insurer and the co-insurer to the insured in co-insurance agreements, provided the lead insurer pays GST on the entire amount of premium paid by the insured.' },
        { number: 'Sch III Para 10', heading: 'Re-Insurance Ceding Commission Deducted from Gross Reinsurance Premium [FA 2024]', purpose: 'Services by insurer to the reinsurer for which ceding commission or the reinsurance commission is deducted from reinsurance premium paid by the insurer to the reinsurer, provided the reinsurer pays GST on the gross reinsurance premium payable by the insurer (inclusive of such ceding/reinsurance commission).' },
        { number: 'Sch III Expl. 1 & 2', heading: 'Statutory Explanations to Schedule III (Court & Warehoused Goods)', purpose: 'Explanation 1 clarifies that "court" includes District Court, High Court, and Supreme Court. Explanation 2 clarifies that "warehoused goods" has the same meaning as assigned to it in the Customs Act, 1962.' }
      ]
    },
    {
      number: 'Sec 5 (IGST)',
      heading: 'Levy and Collection of Integrated GST',
      purpose: 'The primary charging section for inter-State supplies and imports under the IGST Act, capped at 40%.',
      subsections: [
        { number: 'Sec 5(1)', heading: 'Levy of IGST on Inter-State Supplies', purpose: 'Levies IGST on all inter-State supplies of goods or services or both, except on alcoholic liquor for human consumption.' },
        { number: 'Sec 5(3)', heading: 'Notification of RCM on inter-State Supplies', purpose: 'Empowers the Government to specify categories of goods and services where whole of the IGST is payable on RCM by the matching recipient.' },
        { number: 'Sec 5(4)', heading: 'RCM on Unregistered Sourcing (Inter-state)', purpose: 'Applies IGST under RCM on notified supplies received from unregistered suppliers by specified registered recipients.' }
      ]
    },
    {
      number: 'Sec 10 (IGST)',
      heading: 'Place of Supply of Goods (Domestic)',
      purpose: 'Prescribes rules for determining place of supply of goods where supplier and recipient are in India, other than imports/exports.',
      subsections: [
        { number: 'Sec 10(1)(a)', heading: 'POS involving Physical Movement of Goods', purpose: 'If supply involves movement of goods, POS is the location of goods at the time where movement terminates for delivery to the recipient.' },
        { number: 'Sec 10(1)(b)', heading: 'POS u/s Bill-to-Ship-to Tripartite Model', purpose: 'If goods are delivered to a recipient on direction of a third person, POS is the principal place of business of such third person.' },
        { number: 'Sec 10(1)(c)', heading: 'POS where Supply does NOT involve Movement', purpose: 'If no movement is involved, POS is the location of the goods at the time of delivery to the recipient.' },
        { number: 'Sec 10(1)(ca)', heading: 'POS on Supplies to Unregistered Persons', purpose: 'The consumer address recorded in the invoice; otherwise, the location of the supplier.' },
        { number: 'Sec 10(1)(d)', heading: 'Assembly and Installation of Goods at Site', purpose: 'If goods are assembled or installed at site, POS is the place of such installation or assembly.' },
        { number: 'Sec 10(1)(e)', heading: 'POS of Goods Supplied On Board a Conveyance', purpose: 'If sold during a journey on board vessel, aircraft, train, or vehicle, POS is where goods are taken on board.' }
      ]
    },
    {
      number: 'Sec 11 (IGST)',
      heading: 'Place of Supply of Imports and Exports of Goods',
      purpose: 'Determines the tax jurisdiction placement for cross-border movement of Goods.',
      subsections: [
        { number: 'Sec 11(a)', heading: 'POS of Imported Goods', purpose: 'The place of supply of goods imported into India shall be the location of the importer.' },
        { number: 'Sec 11(b)', heading: 'POS of Exported Goods', purpose: 'The place of supply of goods exported from India shall be the location outside India (the destination).' }
      ]
    },
    {
      number: 'Sec 12 (IGST)',
      heading: 'Place of Supply of Services (Both Parties in India)',
      purpose: 'Comprehensive rules to place service transactions when both supplier and recipient are in the taxable territory.',
      subsections: [
        { number: 'Sec 12(2)', heading: 'Default Service POS Rule', purpose: 'B2B: Location of registered person. B2C: Recipient address on record exists? Recipient location : Supplier location.' },
        { number: 'Sec 12(3)', heading: 'Immovable Property, Hotel Lodging, Boat/Vessel services', purpose: 'POS is where the property, hotel, or boat is situated or intended to be situated. Recipient location if located outside India.' },
        { number: 'Sec 12(4)', heading: 'Performance-based Physical Services', purpose: 'Restaurant, catering, physical grooming, beauty treatment, and health care POS is where actually performed.' },
        { number: 'Sec 12(5)', heading: 'Training and Performance Appraisal', purpose: 'B2B: Location of the registered recipient. B2C: Location where the services are actually performed.' },
        { number: 'Sec 12(6)', heading: 'Admission to Cultural, Artistic, or Sporting Events', purpose: 'The place of supply of admission services is the location where the event is actually held or park is located.' },
        { number: 'Sec 12(7)', heading: 'Organisation of Events and Conferences', purpose: 'B2B: Location of registered person. B2C: Where event is held. If held outside India, POS is location of recipient.' },
        { number: 'Sec 12(8)', heading: 'Transportation of Goods / Mail / Courier', purpose: 'B2B: Location of registered person. B2C: Location where goods are handed over for their transportation.' },
        { number: 'Sec 12(9)', heading: 'Passenger Transportation Services', purpose: 'B2B: Location of registered person. B2C: Location where passenger embarks for continuous journey.' },
        { number: 'Sec 12(11)', heading: 'Telecommunication and Internet Services', purpose: 'Fixed line: installation; Post-paid: billing address; Pre-paid: selling point (internet recharges use recipient records).' },
        { number: 'Sec 12(12)', heading: 'Banking, Financial, and Stock Broking', purpose: 'Location of recipient on records of supplier; if not available, location of the supplier.' }
      ]
    },
    {
      number: 'Sec 13 (IGST)',
      heading: 'Place of Supply of Services (One Party OUTSIDE India)',
      purpose: 'Determines place of supply for international/cross-border services, identifying if they count as export/import.',
      subsections: [
        { number: 'Sec 13(2)', heading: 'Default International Service POS Rule', purpose: 'Location of the recipient of services; if not available, location of the supplier.' },
        { number: 'Sec 13(3)(a)', heading: 'Performance-based Services on Goods', purpose: 'Location where services are physically performed on goods. If temporary imports for repairs only and exported: Recipient location u/s 13(2).' },
        { number: 'Sec 13(3)(b)', heading: 'Performance-based Services to Individuals', purpose: 'Location where services are performed, requiring physical presence of the recipient.' },
        { number: 'Sec 13(4)', heading: 'Immovable Property related Services (International)', purpose: 'Location where the immovable property is located or intended to be located.' },
        { number: 'Sec 13(5)', heading: 'Admission or Organisation of Events (International)', purpose: 'Location where the cultural, artistic, or sporting event is actually held.' },
        { number: 'Sec 13(8)', heading: 'POS located at Supplier Location', purpose: 'Applies to bank service to account holders, Intermediary (broker/agent) services, and hiring of transport up to 1 month.' },
        { number: 'Sec 13(12)', heading: 'POS of OIDAR Digital Services', purpose: 'The location of the recipient of services (triggered if any 2 of the 7 Indian address/bank/device conditions are met).' }
      ]
    },
    {
      number: 'Sec 11 (CGST)',
      heading: 'Power to Grant Exemption from Tax',
      purpose: 'Statutory authority to notify absolute or conditional exemptions from GST in the public interest.',
      subsections: [
        { number: 'Sec 11(1)', heading: 'General Exemption by Notification', purpose: 'Empowers the Government to exempt generally, either absolutely or conditionally, goods or services of any specified description from the whole or any part of the tax.' },
        { number: 'Sec 11(2)', heading: 'Special Exemption by Special Order', purpose: 'Empowers the Government to exempt from payment of tax, under exceptional circumstances in public interest, by a special order in each case.' },
        { number: 'Sec 11(3)', heading: 'Retrospective Clarificatory Explanations', purpose: 'Enables inserting clarificatory explanations u/s 11 notifications within 1 year, which will apply with retrospective effect from date of introduction.' }
      ]
    },
    {
      number: 'Sec 12 (CGST)',
      heading: 'Time of Supply of Goods',
      purpose: 'Rules to determine the exact point of time when the liability to pay GST on goods arises.',
      subsections: [
        { number: 'Sec 12(1)', heading: 'Liability trigger on Goods', purpose: 'The liability to pay tax on goods shall arise at the time of supply, as determined in accordance with the provisions of this section.' },
        { number: 'Sec 12(2)', heading: 'TOS under Forward Charge (Goods)', purpose: 'Earliest of: (a) Date of issue of invoice or last due date u/s 31(1); (b) Date of payment recorded or debited; (Note: Advances are exempt u/Notif 66/2017).' },
        { number: 'Sec 12(3)', heading: 'TOS under Reverse Charge (Goods)', purpose: 'Earliest of: (a) Date of receipt of goods; (b) Date of payment recorded/debited; (c) Day immediately following 30 days from invoice date of supplier.' },
        { number: 'Sec 12(4)', heading: 'TOS of Vouchers for Goods', purpose: 'If supply is identifiable at voucher issuance: Date of issue of voucher; otherwise: Date of redemption of voucher.' }
      ]
    },
    {
      number: 'Sec 13 (CGST)',
      heading: 'Time of Supply of Services',
      purpose: 'Rules to determine the exact point of time when the liability to pay GST on services arises.',
      subsections: [
        { number: 'Sec 13(1)', heading: 'Liability trigger on Services', purpose: 'The liability to pay tax on services shall arise at the time of supply, as determined in accordance with the provisions of this section.' },
        { number: 'Sec 13(2)', heading: 'TOS under Forward Charge (Services)', purpose: 'Earliest of: (a) Date of invoice, if issued within 30 days of completion; (b) Date of completion, if invoice is late; (c) Date of payment.' },
        { number: 'Sec 13(3)', heading: 'TOS under Reverse Charge (Services)', purpose: 'Earliest of: (a) Date of payment recorded/debited; (b) Day immediately following 60 days from invoice date of supplier.' },
        { number: 'Sec 13(4)', heading: 'TOS of Vouchers for Services', purpose: 'If supply is identifiable at voucher issuance: Date of issue of voucher; otherwise: Date of redemption of voucher.' }
      ]
    },
    {
      number: 'Sec 15 (CGST)',
      heading: 'Value of Taxable Supply',
      purpose: 'Prescribes transaction value as the standard basis for computing the levy of GST, along with specific additions and exclusions.',
      subsections: [
        { number: 'Sec 15(1)', heading: 'Transaction Value as Base Price', purpose: 'Value of supply is transaction value (price paid/payable), provided parties are not related and price is the sole consideration.' },
        { number: 'Sec 15(2)', heading: 'Compulsory Inclusions in Value', purpose: 'Includes other taxes/fees (not GST); supplier liabilities paid by recipient; incidental charges (packing); delayed payment interest; public/private subsidies.' },
        { number: 'Sec 15(3)', heading: 'Statutory Exclusion of Discounts', purpose: 'Excludes discount if: given at/prior to supply on invoice; or post-supply if established in pre-supply agreement, invoice-linked, and recipient reverses ITC.' }
      ]
    },
    {
      number: 'Sec 16 (CGST)',
      heading: 'Eligibility and Conditions for Claiming ITC',
      purpose: 'Outlines the strict requirements, lot receipts, 180 days payment rules, and statutory deadlines for taking Input Tax Credit.',
      subsections: [
        { number: 'Sec 16(1)', heading: 'Business course and furtherance eligibility', purpose: 'Entitles every registered person to take credit of input tax charged on supplies used or intended to be used in the course/furtherance of his business.' },
        { number: 'Sec 16(2)(a)', heading: 'Possession of tax paying documents', purpose: 'Recipient must possess a tax invoice, debit note, or other valid tax-paying document issued by the registered supplier.' },
        { number: 'Sec 16(2)(aa)', heading: 'Supplier filing and GSTR-2B compliance', purpose: 'Requires supplier to furnish invoice/debit note details in GSTR-1, which must appear in the recipient\'s auto-generated GSTR-2B statement.' },
        { number: 'Sec 16(2)(b)', heading: 'Physical or deemed receipt of supplies', purpose: 'Recipient must have received the goods or services. Deems receipt under Bill-to-Ship-to model when delivered to a third party on recipient\'s direction.' },
        { number: 'Sec 16(2)(ba)', heading: 'Favorable Section 38 communication status', purpose: 'Mandates that details of the input tax credit communicated to the registered recipient under Section 38 must not have been restricted.' },
        { number: 'Sec 16(2)(c)', heading: 'Actual payment of matching tax to Govt', purpose: 'Tax charged on supply must be actually paid to the Government (either in cash or through utilization of eligible ITC) by the matching supplier.' },
        { number: 'Sec 16(2)(d)', heading: 'Filing of matching Section 39 return', purpose: 'The registered recipient must have furnished the regular monthly return under Section 39 (Form GSTR-3B) to declare the slot.' },
        { number: 'Sec 16(2) Proviso 1', heading: 'Lot / Installment delivery credit deferral', purpose: 'Where goods are received in lots or installments, the recipient is entitled to claim ITC only upon receipt of the final lot or installment.' },
        { number: 'Sec 16(2) Proviso 2', heading: 'One hundred and eighty days repayment rule', purpose: 'If recipient fails to pay values plus tax to matching supplier within 180 days from invoice date, u/s Rule 37 they must reverse credit with interest, re-availing upon actual payment.' },
        { number: 'Sec 16(3)', heading: 'Double tax benefit disallowance (Depreciation)', purpose: 'No ITC is allowed on the tax component of the cost of capital goods if the recipient has claimed depreciation on that tax portion under the Income-tax Act, 1961.' },
        { number: 'Sec 16(4)', heading: 'Statutory deadline to claim credits', purpose: 'Bar claims after the 30th of November following the end of the financial year to which the invoice pertains, or date of filing the annual return, whichever is earlier.' }
      ]
    },
    {
      number: 'Sec 17 (CGST)',
      heading: 'Apportionment of Credit & Blocked Credits list',
      purpose: 'Prescribes proportional credit apportionment and contains the exhaustive negative list of completely blocked business credits.',
      subsections: [
        { number: 'Sec 17(1)', heading: 'Part-Business / Part-Private apportionment', purpose: 'Restricts ITC solely to the part of input tax attributable to the purposes of the registered business when used commonly.' },
        { number: 'Sec 17(2)', heading: 'Part-Taxable / Part-Exempt apportionment', purpose: 'Restricts ITC to the part of input tax attributable to taxable supplies (which includes zero-rated supplies u/s 16 of IGST Act).' },
        { number: 'Sec 17(3)', heading: 'Value of Exempt Supplies inclusions', purpose: 'Exempt supply value includes transactions under RCM, sale of land, and sale of building (subject to Paragraph 5 of Schedule II), and transactions in securities (valued at 1%).' },
        { number: 'Sec 17(4)', heading: 'Special option for Banking company/FIs', purpose: 'Grants banks/NBFCs a choice to comply with normal apportionment, or to claim a flat 50% of eligible ITC monthly, lapsing the remainder.' },
        { number: 'Sec 17(5)(a)', heading: 'Blocked Credits: Motor Vehicles & Conveyances', purpose: 'Blocks ITC on passenger motor vehicles with seating capacity <= 13, except when used for further supply, passenger transport, or training.' },
        { number: 'Sec 17(5)(b)', heading: 'Blocked Credits: Personal consumption services', purpose: 'Blocks food, catering, cosmetic surgery, health insurance, club memberships, except when obligatory under law or used as matching sub-contracting.' },
        { number: 'Sec 17(5)(c)', heading: 'Blocked Credits: Immovable Works Contract', purpose: 'Blocks works contract services for construction of immovable property, except for plant and machinery or as inputs for further works contract services.' },
        { number: 'Sec 17(5)(d)', heading: 'Blocked Credits: Self-construction of buildings', purpose: 'Blocks ITC on goods/services used for construction of immovable property on own account (other than plant/machinery), even if for business furtherance.' },
        { number: 'Sec 17(5)(h)', heading: 'Blocked Credits: Destroyed or Gifted stocks', purpose: 'Blocks ITC on goods lost, stolen, destroyed, written off, or disposed of by way of gift or free samples (no matching outbound taxable supply).' }
      ]
    },
    {
      number: 'Sec 18 (CGST)',
      heading: 'Availability of Credit in Special Circumstances',
      purpose: 'Grants and reverses credits upon changing business registration, taxability, and capital goods discards.',
      subsections: [
        { number: 'Sec 18(1)(a)', heading: 'Applied within 30 days mandatory register', purpose: 'Entitles person applying within 30 days to claim ITC on inputs in stock (raw/semi-finished/finished) on the day preceding their register liability.' },
        { number: 'Sec 18(1)(b)', heading: 'Voluntary registration credit grant', purpose: 'Entitles voluntary registrants to claim ITC on inputs in stock (raw/semi-finished/finished) on the day preceding their registration grant.' },
        { number: 'Sec 18(1)(c)', heading: 'Option switch from Composition to Regular', purpose: 'Entitles regular-entrants starting regular taxation to claim ITC on inputs in stock and capital goods (reduced by 5% per quarter or part thereof) on day preceding exit.' },
        { number: 'Sec 18(1)(d)', heading: 'Exempt supply becoming taxable supply', purpose: 'Entitles person to take credit of inputs in stock and capital goods exclusively used for such exempt supply (reduced by 5% per quarter) on day preceding taxability.' },
        { number: 'Sec 18(2)', heading: 'One year window limit on stock invoices', purpose: 'Disallows claiming ITC on inputs/capital goods under Section 18(1) after the expiry of one year from the date of issue of tax invoice.' },
        { number: 'Sec 18(4)', heading: 'Credit reversal on exiting standard regular scheme', purpose: 'Requires reversing credit on stocks/capital goods on day preceding switch-over when opting for composition or when supplies become wholly exempt.' },
        { number: 'Sec 18(6)', heading: 'Supply of used capital goods discards tax', purpose: 'On supplying outward capital goods, must pay higher of: (a) ITC claimed reduced by 5% per quarter, or (b) tax on transaction value.' }
      ]
    },
    {
      number: 'Sec 22 (CGST)',
      heading: 'Persons Liable for Registration threshold rules',
      purpose: 'The primary gateway section defining liability to obtain GST registration based on state-wise aggregate turnover thresholds.',
      subsections: [
        { number: 'Sec 22(1)', heading: 'Aggregate Turnover limits state-wise', purpose: 'Supplier must register in state/UT from where he makes taxable supplies if his aggregate turnover exceeds ₹20 Lakh (₹10 Lakh in Mizoram/Tripura/Manipur/Nagaland).' },
        { number: 'Sec 22(1) Proviso', heading: 'Statutory Goods Exclusive ₹40 Lakh Limit', purpose: 'Grants power to enhance goods-only threshold to ₹40 Lakh for intra-State dealers in specified general States (excluding special states & services).' },
        { number: 'Sec 22(3)', heading: 'Business transfer as a going concern liability', purpose: 'Where registered business is transferred on account of succession or other reason, transferee must register with effect from date of transfer.' },
        { number: 'Sec 22(4)', heading: 'Amalgamation and Demerger scheme liability', purpose: 'Transferee must register from date registrar of companies issues certificate of incorporation giving effect to High Court/Tribunal order.' }
      ]
    },
    {
      number: 'Sec 23 (CGST)',
      heading: 'Persons Not Liable for Registration',
      purpose: 'Identifies categories of persons completely exempt from seeking registration under GST.',
      subsections: [
        { number: 'Sec 23(1)(a)', heading: 'Wholly exempt or Non-taxable suppliers', purpose: 'Any person engaged exclusively in the business of supplying goods/services not liable to tax or wholly exempt under GST.' },
        { number: 'Sec 23(1)(b)', heading: 'Cultivating Agriculturist produce exemption', purpose: 'An agriculturist, to the extent of supply of produce out of cultivation of land (protects primary farmers).' },
        { number: 'Sec 23(2)', heading: 'Government powers to exempt classes', purpose: 'Empowers the Government, on recommendations of the Council, to specify categories of persons who may be exempted from registration (e.g. exclusive RCM suppliers).' }
      ]
    },
    {
      number: 'Sec 24 (CGST)',
      heading: 'Compulsory Registration in Certain Cases',
      purpose: 'Outlines the strict list of taxpayers mandated to register regardless of their total aggregate turnover volume.',
      subsections: [
        { number: 'Sec 24(i)', heading: 'Inter-State taxable goods suppliers', purpose: 'Mandates registration for every person making any inter-State outward taxable supply of goods (no threshold allowance).' },
        { number: 'Sec 24(ii)', heading: 'Casual Taxable Persons (CTP)', purpose: 'Mandates registration for persons occasionally supplying in a state without a fixed place of business.' },
        { number: 'Sec 24(iii)', heading: 'Recipient-paid RCM purchasers', purpose: 'Mandates registration for recipients liable to pay tax under Reverse Charge Mechanism u/s 9(3) or 9(4).' },
        { number: 'Sec 24(viii)', heading: 'Input Service Distributors (ISD)', purpose: 'Mandates separate compulsory registration for offices receiving bills on behalf of regional branches to distribute credit.' },
        { number: 'Sec 24(x)', heading: 'E-commerce Operator (ECO) TCS collectors', purpose: 'Mandates registration for every E-Commerce Operator who is required to collect tax at source under Section 52.' }
      ]
    },
    {
      number: 'Sec 25 (CGST)',
      heading: 'Procedure for Registration',
      purpose: 'Defines the application windows, distinct person realities, and biometric Aadhaar conditions of GST registration.',
      subsections: [
        { number: 'Sec 25(1)', heading: 'Thirty days application window requirement', purpose: 'Must apply in every State/UT where liable within 30 days of becoming liable (CTPs and NRTPs must apply 5 days prior to start).' },
        { number: 'Sec 25(3)', heading: 'Voluntary registration option', purpose: 'Allows persons not liable to register to obtain registration voluntarily, subject to all regular compliance obligations.' },
        { number: 'Sec 25(4)', heading: 'Establishments as Deemed Distinct Persons', purpose: 'A person having multiple registered places of business under a single PAN is treated as separate distinct persons for all purposes.' },
        { number: 'Sec 25(6A)', heading: 'Aadhaar authentication mandatory KYC', purpose: 'Requires every registered person or applicant to undergo biometric Aadhaar authentication to be eligible for grant of registration.' },
        { number: 'Sec 25(6D)', heading: 'Statutory Aadhaar exemption classes', purpose: 'Exempts notified categories of persons (such as non-citizens, public sector undertakings, and governmental bodies) from authentication.' }
      ]
    },
    {
      number: 'Sec 29 (CGST)',
      heading: 'Cancellation or Suspension of Registration',
      purpose: 'Governs voluntary surrender and department suo-motu actions for cancellation and temporary suspensions.',
      subsections: [
        { number: 'Sec 29(1)', heading: 'Surrender or Voluntary cancellation grounds', purpose: 'Allows cancellation if business is discontinued, transferred, constitution is changed, or the person is no longer liable u/s 22/24.' },
        { number: 'Sec 29(2)', heading: 'PO Suo-motu cancellation for defaults', purpose: 'Proper officer can cancel if taxpayer violates rules, fails to file returns (6 months for monthly, 2 periods for QRMP), or commits fraud.' },
        { number: 'Sec 29(2) Proviso', heading: 'Pending proceedings suspension buffer', purpose: 'Empowers PO to suspend registration during pendency of cancellation proceedings, barring returns and tax collections.' }
      ]
    },
    {
      number: 'Sec 31 (CGST)',
      heading: 'Tax Invoice deadlines and formats',
      purpose: 'Provides the statutory timeline limits for issuing billing documents on supplying goods and services.',
      subsections: [
        { number: 'Sec 31(1)', heading: 'Goods supply invoice removal timeline', purpose: 'Invoice must be raised before or at the time of: (a) removal (if movement involves), or (b) delivery/making available to recipient.' },
        { number: 'Sec 31(2)', heading: 'Services supply invoice completion timeline', purpose: 'Invoice must be raised within a default maximum buffer of 30 days (45 days for banks and insurances) from service completion.' },
        { number: 'Sec 31(3)(a)', heading: 'Revised Tax Invoice transitional buffer', purpose: 'Enables issuing Revised Invoices within 1 month from registration grant, covering the period from effective date to certificate issue.' },
        { number: 'Sec 31(3)(c)', heading: 'Bill of Supply for Composition / Exempts', purpose: 'Composition dealers and exempt suppliers must issue a Bill of Supply indicating no tax collection u/s 31(3)(c).' },
        { number: 'Sec 31(3)(d)', heading: 'Receipt Voucher on advance payments', purpose: 'Requires raising unique Receipt Vouchers instantly upon matching or taking advance payments on services.' },
        { number: 'Sec 31(7)', heading: 'Approval basis sale removal timeline buffer', purpose: 'Where goods are sent on approval, invoice must be issued before/at supply, or within 6 months from removal, whichever is earlier.' }
      ]
    },
    {
      number: 'Sec 34 (CGST)',
      heading: 'Credit and Debit Notes adjustments',
      purpose: 'Regulates commercial adjustments, matching reductions, supplementary billings, and post-sale discounts.',
      subsections: [
        { number: 'Sec 34(1)', heading: 'Issuance of Credit Notes by Supplier', purpose: 'Issued when invoice value/tax exceeds actuals, or on sales returns, or if goods are found to be legally deficient.' },
        { number: 'Sec 34(2)', heading: 'Filing Credit Note deadline and ITC matching', purpose: 'Credit Note must be declared before 30th November of next FY. Requires the recipient to reverse matching ITC to reduce output tax.' },
        { number: 'Sec 34(3)', heading: 'Issuance of Debit Notes (Supplementary Invoice)', purpose: 'Supplier must issue a Debit Note when tax/value charged in invoice is found less than actual, serving as a supplementary invoice.' }
      ]
    },
    {
      number: 'Sec 35 (CGST)',
      heading: 'Accounts and Other Records',
      purpose: 'Mandates the types of business records to be kept and maintained at each registered place of business.',
      subsections: [
        { number: 'Sec 35(1)', heading: 'True and correct account registers', purpose: 'Requires keeping records of production, inward/outward supplies, stock of goods, ITC availed, and output tax paid u/s 35(1).' },
        { number: 'Sec 35(2)', heading: 'Transporter and Warehouse records', purpose: 'Mandates transporters and warehouse operators to maintain records of consigner, consignee, and stock details of goods.' }
      ]
    },
    {
      number: 'Sec 36 (CGST)',
      heading: 'Period of Retention of Accounts',
      purpose: 'Prescribes the compulsory duration for preserving books of accounts and records.',
      subsections: [
        { number: 'Sec 36(1)', heading: 'Standard 72-months retention period', purpose: 'Retain books of accounts for 72 months from the due date of furnishing the annual return for the relevant financial year.' },
        { number: 'Sec 36 Proviso', heading: 'Pending proceedings retention buffer', purpose: 'Requires retaining records concerned with an appeal, revision, or investigation for 1 year after final disposal, or 72 months, whichever is later.' }
      ]
    },
    {
      number: 'Sec 49 (CGST)',
      heading: 'Payment of tax, interest, penalty and other amounts',
      purpose: 'Statutory basis for the three electronic registers (Cash, Credit, and Liability ledgers), deposits and payments.',
      subsections: [
        { number: 'Sec 49(1)', heading: 'Electronic Cash Ledger deposits', purpose: 'All cash deposits via internet banking, cards, NEFT/RTGS are credited to the player\'s electronic cash ledger u/s 49(1).' },
        { number: 'Sec 49(2)', heading: 'Electronic Credit Ledger entries', purpose: 'Input tax credit claimed in self-assessed returns is credited to the electronic credit ledger.' },
        { number: 'Sec 49(3)', heading: 'Electronic Cash Ledger utilization', purpose: 'Allows utilizing cash ledger balances for paying tax, interest, penalty, late fee, or other dues u/s 49(3).' },
        { number: 'Sec 49(4)', heading: 'Electronic Credit Ledger utilization', purpose: 'Restricts the utilization of credit ledger balances solely for the payment of output tax u/s 49(4).' },
        { number: 'Sec 49(8)', heading: 'Strict chronological order of payment', purpose: 'Discharge dues in order: (a) prev tax periods, (b) current tax period, (c) demand u/s 73/74/74A.' },
        { number: 'Sec 49(10)', heading: 'Major / Minor Head Cash transfers', purpose: 'Enables transferring cash ledger balances among major/minor heads or to distinct persons using Form GST PMT-09.' }
      ]
    },
    {
      number: 'Sec 49A (CGST)',
      heading: 'Utilization of credit subject to certain conditions',
      purpose: 'Enforces complete exhaustion of IGST credit before any other ledger balance can be utilized.',
      subsections: [
        { number: 'Sec 49A(1)', heading: 'IGST credit prior exhaustion rule', purpose: 'Prohibits utilizing CGST or SGST credits unless the input tax credit on account of integrated tax (IGST) is first fully utilized.' }
      ]
    },
    {
      number: 'Sec 49B (CGST)',
      heading: 'Order of utilization of input tax credit',
      purpose: 'Enables government to prescribe the manner and proportion of credit utilization under Rule 88A.',
      subsections: [
        { number: 'Sec 49B(1)', heading: 'Statutory power to prescribe sequence', purpose: 'Empowers the Government, on Council recommendations, to specify the sequence and manner of utilizing IGST, CGST, and SGST credits.' }
      ]
    },
    {
      number: 'Sec 50 (CGST)',
      heading: 'Interest on delayed payment of tax',
      purpose: 'Imposes automatic compensatory interest for default in payment of tax or wrongful utilization of credit.',
      subsections: [
        { number: 'Sec 50(1)', heading: 'Interest on belated tax payments', purpose: 'Mandates paying interest (notified @ 18% p.a.) on tax dues not remitted within the prescribed timeline.' },
        { number: 'Sec 50(1) Proviso', heading: 'Belated returns Net Cash interest limit', purpose: 'Limits interest computation solely to the net cash tax paid via Cash Ledger if return is belated but voluntary.' },
        { number: 'Sec 50(3)', heading: 'Wrongful credit utilization interest levy', purpose: 'Levies interest (notified @ 18% p.a.) u/s 50(3) only when input tax credit has been both wrongly availed and actually utilized.' }
      ]
    },
    {
      number: 'Sec 51 (CGST)',
      heading: 'Tax Deduction at Source (TDS)',
      purpose: 'Outlines the mandatory tax deduction at source on government contracts exceeding ₹2,50,000.',
      subsections: [
        { number: 'Sec 51(1)', heading: 'TDS deductor scope and rate', purpose: 'Mandates government departments/agencies to deduct GST @ 1% (CGST) and 1% (SGST) on payments under contracts exceeding ₹2.5 Lakh.' },
        { number: 'Sec 51(1) Proviso', heading: 'No TDS geographical exception rule', purpose: 'Bars TDS deduction when the Location of Supplier and Place of Supply are in a State different from the Recipient\'s State.' },
        { number: 'Sec 51(2)', heading: 'Timeline to deposit TDS collections', purpose: 'Deductors must deposit all TDS collected within 10 days of the succeeding month u/s 51(2).' }
      ]
    },
    {
      number: 'Sec 52 (CGST)',
      heading: 'Tax Collection at Source (TCS) by ECOs',
      purpose: 'Governs the collection of tax by electronic commerce operators on third-party marketplace transactions.',
      subsections: [
        { number: 'Sec 52(1)', heading: 'TCS collection obligation and rate', purpose: 'Mandates ECOs to collect TCS at a rate not exceeding 1% (actual notified: 0.5% total) on net taxable supplies made through them.' },
        { number: 'Sec 52(3)', heading: 'TCS deposit timeline to Government', purpose: 'Requires deposited TCS amount to be paid to the Government within 10 days of the succeeding month.' },
        { number: 'Sec 52(4)', heading: 'Form GSTR-8 monthly statement', purpose: 'ECO must furnish GSTR-8 electronically within 10 days of the next month, detailing outward supplies and returns.' },
        { number: 'Sec 52(6)', heading: 'Omission and error rectification window', purpose: 'Limits correcting GSTR-8 statements up to 30th November following the end of the financial year or annual filing.' }
      ]
    },
    {
      number: 'Sec 53 (CGST)',
      heading: 'Transfer of input tax credit',
      purpose: 'Directs funds transfer from central tax account to integrated tax account when CGST credit is used for IGST output.',
      subsections: [
        { number: 'Sec 53(1)', heading: 'Inter-account fund reduction and credit', purpose: 'Reduces the amount collected as central tax and transfers an equivalent amount to the integrated tax account on credit utilization.' }
      ]
    },
    {
      number: 'Sec 53A (CGST)',
      heading: 'Transfer of certain cash ledger amounts',
      purpose: 'Enables transfer of electronic cash ledger deposits between central tax and state tax ledgers.',
      subsections: [
        { number: 'Sec 53A(1)', heading: 'Inter-state cash ledger transfer settlement', purpose: 'Requires the Government to transfer equivalent funds from central tax to state tax when cash ledger balances are transitioned u/s 49(10).' }
      ]
    },
    {
      number: 'Sec 68 (CGST)',
      heading: 'Inspection of goods in movement',
      purpose: 'Statutory authority to mandate e-way bills and inspect conveyances carrying consignments in transit.',
      subsections: [
        { number: 'Sec 68(1)', heading: 'Documents and devices requirement u/s 68', purpose: 'Empowers the Government to require the person-in-charge of a conveyance to carry specified documents (e-way bill, invoice) and RFID devices.' }
      ]
    },
    {
      number: 'Sec 37 (CGST)',
      heading: 'Furnishing details of outward supplies',
      purpose: 'Legal basis for GSTR-1, GSTR-1A, and IFF filing structures and their respective deadlines.',
      subsections: [
        { number: 'Sec 37(1)', heading: 'Form GSTR-1 & deadlines', purpose: 'Mandates submitting details of outward supplies in GSTR-1 by the 11th (others) or 13th (QRMP).' },
        { number: 'Sec 37(3)', heading: 'Prior period invoice adjustments', purpose: 'Allows correcting errors in GSTR-1 until November 30th of the next financial year or actual filing of annual return, whichever is earlier.' },
        { number: 'Sec 37(4)', heading: 'Sequencing restriction on GSTR-1/IFF filings', purpose: 'Blocks GSTR-1 filing if preceding GSTR-3B return is outstanding, protecting compliance flows.' }
      ]
    },
    {
      number: 'Sec 38 (CGST)',
      heading: 'Communication of details of inward supplies and input tax credit',
      purpose: 'Legal basis for auto-drafted static ITC statements like Form GSTR-2B.',
      subsections: [
        { number: 'Sec 38(1)', heading: 'ITC Statement to Recipients', purpose: 'Prescribes communicating inward supply details and eligible/ineligible credits dynamically to recipients.' },
        { number: 'Sec 38(2)', heading: 'Ineligible ITC restrictions', purpose: 'Filters and flags credits as ineligible on the portal where suppliers defaulted or are new registrants.' }
      ]
    },
    {
      number: 'Sec 39 (CGST)',
      heading: 'Furnishing of returns',
      purpose: 'Governs GSTR-3B, GSTR-4, GSTR-5, GSTR-6, and GSTR-7 returns and the payment of liabilities.',
      subsections: [
        { number: 'Sec 39(1)', heading: 'Form GSTR-3B regular summary returns', purpose: 'Requires standard regular taxpayers to file monthly summaries of values, liabilities, and ITC credits by the 20th.' },
        { number: 'Sec 39(2)', heading: 'Form GSTR-4 annual composition returns', purpose: 'Requires composition suppliers to file GSTR-4 annually by June 30th while making quarterly tax deposits.' },
        { number: 'Sec 39(7)', heading: 'Due date of tax payment linkage', purpose: 'Specifies that tax must be paid on or before the due date for filing the GSTR-3B return, creating unified compliance.' }
      ]
    },
    {
      number: 'Sec 44 (CGST)',
      heading: 'Annual Return',
      purpose: 'Governs GSTR-9, GSTR-9A, and audited GSTR-9C self-certified reconciliations.',
      subsections: [
        { number: 'Sec 44(1)', heading: 'Form GSTR-9 Annual Return obligation', purpose: 'Requires every registered person, other than exempted ones, to submit an annual return on or before December 31st.' },
        { number: 'Sec 44(2)', heading: 'Form GSTR-9C Reconciliation Statement', purpose: 'Mandates uploading a self-certified reconciliation statement matching audited statements for turnovers exceeding ₹5 Crore.' }
      ]
    },
    {
      number: 'Sec 45 (CGST)',
      heading: 'Final Return',
      purpose: 'Filing obligation for cancelled GST registrations.',
      subsections: [
        { number: 'Sec 45(1)', heading: 'Form GSTR-10 Final Return', purpose: 'Requires cancelled taxpayers to file a final return in Form GSTR-10 within 3 months of cancellation or order date, whichever is later.' }
      ]
    },
    {
      number: 'Sec 48 (CGST)',
      heading: 'Goods and services tax practitioners',
      purpose: 'Governs approval, functions, and responsibilities of GST Practitioners (GSTPs).',
      subsections: [
        { number: 'Sec 48(2)', heading: 'Authorized activities by GSTP', purpose: 'Permits authorized GSTPs to submit GSTR-1, GSTR-3B, GSTR-4, file cash ledger deposits, and submit refund claims.' }
      ]
    },
    {
      number: 'Sec 54 (CGST)',
      heading: 'Refund of tax',
      purpose: 'Standard procedure, 2-year limitation, and direct payout exceptions u/s RFD-01.',
      subsections: [
        { number: 'Sec 54(1)', heading: 'Two-year limitation and RFD-01 filings', purpose: 'Enables any person to claim a refund within 2 years from the relevant date matching their specific transaction class.' },
        { number: 'Sec 54(6)', heading: 'Provisional refund on exports (90%)', purpose: 'Mandates granting 90% provisional refund on zero-rated exports within 7 days of complete application.' },
        { number: 'Sec 54(8)', heading: 'Unjust Enrichment exceptions / Direct payout', purpose: 'Lists explicit cases (like exports, inverted ITC, and Sec 77) where refunds are paid directly rather than credited to CWF.' },
        { number: 'Sec 54(14)', heading: 'Minimum refund cap of ₹1,000 u/s 54', purpose: 'Bars processing any refund under ₹1,000 per head (not applicable to excess balance in Cash Ledger).' }
      ]
    },
    {
      number: 'Sec 55 (CGST)',
      heading: 'Refund in certain cases',
      purpose: 'Special refund provisions for international diplomatic missions and agencies.',
      subsections: [
        { number: 'Sec 55(1)', heading: 'Embassy & UN Body direct payouts', purpose: 'Entitles specialized UN organizations and foreign embassies to receive 100% refunds of tax paid on inward supplies.' }
      ]
    },
    {
      number: 'Sec 56 (CGST)',
      heading: 'Interest on delayed refunds',
      purpose: 'Establishes automatic interest payouts for delays exceeding 60 days.',
      subsections: [
        { number: 'Sec 56(1)', heading: 'Interest @ 6% for standard delays', purpose: 'Imposes interest of 6% p.a. starting from the 61st day from application receipt till physical payout date.' },
        { number: 'Sec 56 Proviso', heading: 'Interest @ 9% for judicial appeal victories', purpose: 'Imposes interest of 9% p.a. starting from the 61st day following application filed post-decision till actual refund.' }
      ]
    },
    {
      number: 'Sec 57 (CGST)',
      heading: 'Consumer Welfare Fund',
      purpose: 'Establishment of the Consumer Welfare Fund (CWF).',
      subsections: [
        { number: 'Sec 57(1)', heading: 'Crediting unclaimed refunds to CWF', purpose: 'All refunds failing the test of unjust enrichment are legally credited to the Consumer Welfare Fund.' }
      ]
    },
    {
      number: 'Sec 14A (IGST)',
      heading: 'Actionable claims of online money gaming outside India',
      purpose: 'Direct IGST levy on overseas online money gaming suppliers.',
      subsections: [
        { number: 'Sec 14A(1)', heading: 'Levy of direct IGST on overseas suppliers', purpose: 'Binds overseas online money gaming suppliers to pay IGST under forward charge on transactions with Indian consumers.' }
      ]
    },
    {
      number: 'Sec 15 (IGST)',
      heading: 'Refund of integrated tax on supply of goods to tourist leaving India',
      purpose: 'Enables tax refunds to international tourists upon departure from India.',
      subsections: [
        { number: 'Sec 15(1)', heading: 'Tourist passenger baggage refunds', purpose: 'Authorizes refunding IGST paid on goods taken out of India by departing international tourists.' }
      ]
    },
    {
      number: 'Sec 16 (IGST)',
      heading: 'Zero rated supply',
      purpose: 'Governs exports and supplies to SEZ developers/units.',
      subsections: [
        { number: 'Sec 16(1)', heading: 'Scope of zero-rated supplies', purpose: 'Defines zero-rated supplies to encompass standard exports and supplies of goods/services to SEZ for authorised operations.' },
        { number: 'Sec 16(3)', heading: 'Options for zero-rated supplies (LUT/Bond)', purpose: 'Provides option to supply under LUT without paying tax and claim credit refund, or pay IGST and claim tax refund.' }
      ]
    },
    {
      number: 'Sec 19 (CGST)',
      heading: 'Taking input tax credit in respect of inputs and capital goods sent for job work',
      purpose: 'Statutory basis for claiming input tax credit on job work goods and return timelines.',
      subsections: [
        { number: 'Sec 19(2)', heading: 'Taking ITC on direct job-work inputs', purpose: 'Allows claiming input tax credit on inputs even if sent directly to a job worker without being first brought to their own premises.' },
        { number: 'Sec 19(3)', heading: 'One-year inputs return timeline', purpose: 'Mandates returning inputs sent for job work within 1 year, otherwise deemed as supply by principal to job worker retrospectively.' },
        { number: 'Sec 19(5)', heading: 'Taking ITC on direct job-work capital goods', purpose: 'Allows claiming input tax credit on capital goods even if sent directly to a job worker without being first brought to their premises.' },
        { number: 'Sec 19(6)', heading: 'Three-year capital goods return timeline', purpose: 'Mandates returning capital goods sent for job work within 3 years, otherwise deemed as supply by principal to job worker retrospectively.' },
        { number: 'Sec 19(7)', heading: 'Exemptions for moulds, dies, jigs, fixtures, and tools u/s 19(7)', purpose: 'Exempts high-precision moulds, dies, jigs, fixtures, and tools from the 1-year and 3-year return timelines.' }
      ]
    },
    {
      number: 'Sec 143 (CGST)',
      heading: 'Job work procedure',
      purpose: 'Statutory workflow for sending and receiving goods, direct supply, and waste handling.',
      subsections: [
        { number: 'Sec 143(1)', heading: 'Removal of goods for job work u/s 143', purpose: 'Enables registered principal to send inputs or capital goods with delivery challans without paying tax.' },
        { number: 'Sec 143(1)(a)', heading: 'Return of goods under job work', purpose: 'Binds the principal to return inputs (1 year) or capital goods (3 years) to their registered place of business.' },
        { number: 'Sec 143(1)(b)', heading: 'Direct supply from job worker\'s premises', purpose: 'Permits supplies directly to ultimate clients if job worker is registered or declared as additional place of business.' },
        { number: 'Sec 143(5)', heading: 'Supply of waste and scrap u/s 143(5)', purpose: 'Authorizes direct disposal of job work waste on tax payment by registered job worker or principal.' }
      ]
    },
    {
      number: 'Sec 59 (CGST)',
      heading: 'Self-assessment',
      purpose: 'Statutory basis of GST trust-based tax compliance system.',
      subsections: [
        { number: 'Sec 59(1)', heading: 'Filing self-assessed tax returns', purpose: 'Requires every registered taxpayer to self-determine liabilities and file returns for each tax period.' }
      ]
    },
    {
      number: 'Sec 60 (CGST)',
      heading: 'Provisional assessment',
      purpose: 'Enables tax payment on provisional basis upon valuation or tax rate uncertainty.',
      subsections: [
        { number: 'Sec 60(1)', heading: 'Application for provisional assessment', purpose: 'Enables registered taxpayers to apply in Form ASMT-01 when unable to determine value or rate.' },
        { number: 'Sec 60(3)', heading: 'Execution of ASMT-05 bond with bank guarantee', purpose: 'Taxpayer must execute a bond with security up to 25% of the bond amount for paying differential final tax.' },
        { number: 'Sec 60(4)', heading: 'Finalization higher tax liability interest u/s 60(4)', purpose: 'Differential tax on finalization must be paid with interest at 18% p.a. from the original due date till payment.' },
        { number: 'Sec 60(5)', heading: 'Finalization tax refunds interest u/s 60(5)', purpose: 'Lower final liability tax excess attracts interest at 6% p.a. for delays exceeding 60 days from refund application.' }
      ]
    },
    {
      number: 'Sec 61 (CGST)',
      heading: 'Scrutiny of returns',
      purpose: 'Empowers PO to scrutinize returns against available records and send discrepancies in ASMT-10.',
      subsections: [
        { number: 'Sec 61(3)', heading: 'Failing to remedy discrepancy notice consequences', purpose: 'Empowers PO to initiate departmental audit u/s 65, special audit u/s 66, search u/s 67, or tax demand u/s 73/74/74A.' }
      ]
    },
    {
      number: 'Sec 62 (CGST)',
      heading: 'Assessment of non-filers of returns',
      purpose: 'Enables best judgment assessment of regular return defaulters.',
      subsections: [
        { number: 'Sec 62(1)', heading: 'Best judgment assessment u/s 62(1)', purpose: 'Proper officer can assess tax of return defaulters using e-way bills and portal data if notice u/s 46 is ignored.' },
        { number: 'Sec 62(2)', heading: 'Best judgment order automatic withdrawal', purpose: 'Deems best judgment order withdrawn if taxpayer files valid returns within 60 days of the order service.' }
      ]
    },
    {
      number: 'Sec 63 (CGST)',
      heading: 'Assessment of unregistered persons',
      purpose: 'Enables best judgment assessment of taxpayers who failed to register or whose registration is cancelled.',
      subsections: [
        { number: 'Sec 63(1)', heading: 'PO best judgment u/s 63', purpose: 'Proper officer can assess tax for unregistered/cancelled persons within 5 years from GSTR-9 due date.' }
      ]
    },
    {
      number: 'Sec 64 (CGST)',
      heading: 'Summary assessment in certain special cases',
      purpose: 'Summary assessment powers to protect revenue under imminent threat.',
      subsections: [
        { number: 'Sec 64(1)', heading: 'Summary order with JC/ADC permission', purpose: 'Authorizes PO to issue summary assessment orders if delays would adversely affect revenue.' }
      ]
    },
    {
      number: 'Sec 65 (CGST)',
      heading: 'Audit by tax authorities',
      purpose: 'Enables Commissioner to carry out audit of registered taxpayers at place of business.',
      subsections: [
        { number: 'Sec 65(1)', heading: 'Scope of departmental audit', purpose: 'Commissioner can initiate departmental audit for a financial year or part/multiples thereof.' },
        { number: 'Sec 65(3)', heading: 'Notice of departmental audit (15 days)', purpose: 'Taxpayer must be served a notice at least 15 working days prior to audit commencement.' },
        { number: 'Sec 65(4)', heading: 'Completion timeline of departmental audit', purpose: 'Audit must be completed within 3 months of commencement, with possible Commissioner extension of 6 months.' }
      ]
    },
    {
      number: 'Sec 66 (CGST)',
      heading: 'Special audit',
      purpose: 'Auditing complex records by nominated Chartered or Cost Accountants u/s 66.',
      subsections: [
        { number: 'Sec 66(1)', heading: 'Directing special audit u/s 66(1)', purpose: 'Assistant Commissioner with Commissioner permission can order audit by nominated CA/CWA on complex or incorrect values/credits.' }
      ]
    },
    {
      number: 'Sec 67 (CGST)',
      heading: 'Power of inspection, search and seizure',
      purpose: 'Empowers officers to access records/conveyances and freeze secreted goods/documents.',
      subsections: [
        { number: 'Sec 67(1)', heading: 'Form GST INS-01 written authorization for inspection', purpose: 'Empowers proper officers to inspect business if suppressing stock/transactions or claiming excess credit.' },
        { number: 'Sec 67(2)', heading: 'Search warrant and physical seizure u/s 67(2)', purpose: 'PO can break open doors, almirahs, or boxes to search and seize secreted goods or records.' },
        { number: 'Sec 67(5)', heading: 'Taxpayer extracts and copies u/s 67(5)', purpose: 'Taxpayer is entitled to make copies or take extracts of seized records in the presence of the officer.' },
        { number: 'Sec 67(7)', heading: 'Six-month return window on SCN default', purpose: 'Seized goods must be returned if no Show Cause Notice is issued within 6 months of seizure (extendable for 6 more months).' }
      ]
    },
    {
      number: 'Sec 69 (CGST)',
      heading: 'Power to arrest',
      purpose: 'Authorizes arresting tax evaders and fake invoicing masterminds.',
      subsections: [
        { number: 'Sec 69(1)', heading: 'Arrest warrant u/s 69', purpose: 'Commissioner can authorize any officer to arrest a person committing specified serious offences exceeding ₹2 Crore.' }
      ]
    },
    {
      number: 'Sec 70 (CGST)',
      heading: 'Power to summon persons to give evidence and produce documents',
      purpose: 'Enables proper officers to summon any individual for investigation/testimony.',
      subsections: [
        { number: 'Sec 70(1)', heading: 'Summons judicial proceeding u/s 70', purpose: 'Binds individuals to attend and state the truth u/s 193/228 of IPC, carrying up to a ₹25,000 penalty u/s 122(3)(d) on non-attendance.' }
      ]
    },
    {
      number: 'Sec 71 (CGST)',
      heading: 'Access to business premises',
      purpose: 'Enables auditing officers to enter business premises to verify accounts/programs.',
      subsections: [
        { number: 'Sec 71(1)', heading: 'Providing trials/financials u/s 71(1)', purpose: 'Taxpayer must provide audit reports, trials, and financials within 15 working days of request.' }
      ]
    },
    {
      number: 'Sec 72 (CGST)',
      heading: 'Officers to assist proper officers',
      purpose: 'Empowers other government branches to aid GST enforcement.',
      subsections: [
        { number: 'Sec 72(1)', heading: 'Inter-departmental assistance', purpose: 'Police, customs, railways, and land revenue officers must assist GST officers in executing the Act.' }
      ]
    },
    {
      number: 'Sec 74A (CGST)',
      heading: 'Determination of tax not paid / short paid / erroneously refunded / wrong ITC',
      purpose: 'Unified statutory framework for both fraud and non-fraud tax determination starting FY 2024-25.',
      subsections: [
        { number: 'Sec 74A(1)', heading: 'Issuance of SCN u/s 74A', purpose: 'Enables proper officers to issue Show Cause Notice specifying short-paid tax, interest, and penalty.' },
        { number: 'Sec 74A(2)', heading: 'Limitation period for SCN', purpose: 'SCN must be issued within a uniform 42 months (3.5 years) from the due date of furnishing the annual return, or from date of erroneous refund.' },
        { number: 'Sec 74A(5)', heading: 'Quantum of penalty u/s 74A', purpose: 'Penalty for non-fraud is higher of 10% of tax or ₹10,000, and for fraud is equal to 100% of the tax due.' },
        { number: 'Sec 74A(7)', heading: 'Limitation period for Order', purpose: 'PO must issue the final order within 12 months (1 year) of SCN (extendable by senior officers u/s JC rank for up to 6 months).' },
        { number: 'Sec 74A(8)(i)', heading: 'Pre-SCN Non-Fraud concessions', purpose: 'Concludes all proceedings with full NIL penalty waiver if tax and Section 50 interest are paid prior to SCN service.' },
        { number: 'Sec 74A(8)(ii)', heading: 'Post-SCN Non-Fraud concessions', purpose: 'Concludes all proceedings with full NIL penalty waiver if tax and interest are paid within 60 days of SCN service.' },
        { number: 'Sec 74A(9)(i)', heading: 'Pre-SCN Fraud concessions', purpose: 'SCN is not served if tax, interest, and a reduced penalty equal to 15% of tax are paid voluntarily.' },
        { number: 'Sec 74A(9)(ii)', heading: 'Post-SCN Fraud concessions', purpose: 'Concludes all proceedings with a reduced penalty of 25% of tax if paid within 60 days of SCN service.' },
        { number: 'Sec 74A(9)(iii)', heading: 'Post-Order Fraud concessions', purpose: 'Concludes all proceedings with a reduced penalty of 50% of tax if paid with interest within 60 days of order communication.' },
        { number: 'Sec 74A(11)', heading: 'Mandatory penalty on self-assessed defaults', purpose: 'Requires mandatory penalty of 10% of tax or ₹10,000 (whichever is higher) if self-assessed tax or collected tax is unpaid beyond 30 days of due date (no waiver option).' }
      ]
    },
    {
      number: 'Sec 76 (CGST)',
      heading: 'Tax collected but not paid to Government',
      purpose: 'Statutory mandate to deposit any collected amounts representing tax.',
      subsections: [
        { number: 'Sec 76(1)', heading: 'Compulsory deposit of collected tax', purpose: 'Binds any person who has collected representing tax from clients to pay it to the Government regardless of taxability.' },
        { number: 'Sec 76(2)', heading: 'Issuance of SCN u/s 76', purpose: 'Empowers PO to issue recovery notice and penalty equivalent to the collected but unpaid tax.' },
        { number: 'Sec 76(6)', heading: 'Limitation for u/s 76 order', purpose: 'PO must issue a determination order within 1 year from the date of issuance of the notice.' }
      ]
    },
    {
      number: 'Sec 77 (CGST)',
      heading: 'Tax wrongfully collected and paid to Central Government or State Government',
      purpose: 'Enables refunds of tax and zero interest liabilities upon incorrect head misclassification.',
      subsections: [
        { number: 'Sec 77(1)', heading: 'Intra-State treated as Inter-State (or vice versa)', purpose: 'Requires full refund of CGST/SGST paid u/s wrong intra-state belief, with zero interest on correct IGST head subsequently deposited.' }
      ]
    },
    {
      number: 'Sec 78 (CGST)',
      heading: 'Initiation of recovery proceedings',
      purpose: 'Enforces voluntary compliance period prior to initiating coercive recovery.',
      subsections: [
        { number: 'Sec 78(1)', heading: 'Three-month compliance window', purpose: 'Requires any amount under an order to be paid within 3 months of order service before initiating recovery (can be reduced if expedient).' }
      ]
    },
    {
      number: 'Sec 79 (CGST)',
      heading: 'Recovery of tax',
      purpose: 'Empowers recovery officers to use specific modes to retrieve unpaid government dues.',
      subsections: [
        { number: 'Sec 79(1)(a)', heading: 'Recovery by deduction', purpose: 'Authorizes PO to deduct outstanding dues from any refund or funds owed to the taxpayer by the department.' },
        { number: 'Sec 79(1)(b)', heading: 'Recovery by sale of goods', purpose: 'Allows detaining and selling (through public/e-auction) any goods under the control of returning officers.' },
        { number: 'Sec 79(1)(c)', heading: 'Garnishee proceedings', purpose: 'Enables serving notices to third parties (banks, post-offices, debtors) holding money for/concerning the defaulter to pay the treasury directly.' },
        { number: 'Sec 79(1)(d)', heading: 'Recovery by distress and sale of assets', purpose: 'Authorizes distraining and selling regular movable/immovable properties of the defaulter.' }
      ]
    },
    {
      number: 'Sec 80 (CGST)',
      heading: 'Payment of tax and other amount in instalments',
      purpose: 'Empowers Commissioner to grant deferred payment facility.',
      subsections: [
        { number: 'Sec 80(1)', heading: 'Discretion to grant up to 24 instalments', purpose: 'Commissioner can allow paying tax (excluding self-assessed returns tax), interest, or penalty in maximum 24 monthly instalments (minimum ₹25,000 threshold).' }
      ]
    },
    {
      number: 'Sec 83 (CGST)',
      heading: 'Provisional attachment to protect revenue',
      purpose: 'Authorizes freezing assets to prevent revenue leakage during pending investigations.',
      subsections: [
        { number: 'Sec 83(1)', heading: 'Provisional asset freezing', purpose: 'Commissioner can provisionally attach bank accounts or property for up to 1 year u/s pendency of assessment, audit, or recovery.' }
      ]
    },
    {
      number: 'Sec 85 (CGST)',
      heading: 'Liability in case of transfer of business',
      purpose: 'Ensures successor liability on business transfers.',
      subsections: [
        { number: 'Sec 85(1)', heading: 'Joint and several liability', purpose: 'Binds transferor and transferee jointly and severally for any tax, interest, or penalty due up to the time of transfer.' }
      ]
    },
    {
      number: 'Sec 87 (CGST)',
      heading: 'Liability in case of amalgamation or merger of companies',
      purpose: 'Regulates taxation of corporate entities during restructurings.',
      subsections: [
        { number: 'Sec 87(1)', heading: 'Distinct company treatment', purpose: 'Treats merging companies as distinct entities up to the physical order date; all inter-se transactions in the retrospective window remain taxable.' }
      ]
    },
    {
      number: 'Sec 88 (CGST)',
      heading: 'Liability in case of company in liquidation',
      purpose: 'Establishes taxation and receiver liabilities during corporate insolvencies.',
      subsections: [
        { number: 'Sec 88(1)', heading: 'Liquidator notice requirement (30 days)', purpose: 'Receiver must notify Commissioner of their appointment within 30 days.' },
        { number: 'Sec 88(3)', heading: 'Private directors joint/several liability', purpose: 'Binds directors of private companies jointly and severally for unpaid taxes unless gross neglect is disproved.' }
      ]
    },
    {
      number: 'Sec 89 (CGST)',
      heading: 'Liability of directors of private company',
      purpose: 'Ensures tax collection from private company management.',
      subsections: [
        { number: 'Sec 89(1)', heading: 'Joint and several director tax liability', purpose: 'Makes private company directors personally liable for tax, interest, or penalty unless proving no gross neglect took place.' }
      ]
    },
    {
      number: 'Sec 90 (CGST)',
      heading: 'Liability of partners of firm to pay tax',
      purpose: 'Partner liability rules for firms and LLPs.',
      subsections: [
        { number: 'Sec 90(1)', heading: 'Joint and several partner liability', purpose: 'Partners of firm or LLP remain jointly and severally liable for any dues of the firm.' },
        { number: 'Sec 90(2)', heading: 'Retirement notice obligation (1 month)', purpose: 'Retiring partner must intimate date of retirement in writing within 1 month, failing which liability continues until notice receipt.' }
      ]
    },
    {
      number: 'Sec 93 (CGST)',
      heading: 'Special provisions regarding liability in certain cases',
      purpose: 'Taxation of estates, HUFs, and partitioned partnerships.',
      subsections: [
        { number: 'Sec 93(1)', heading: 'Liability u/s death of taxable person', purpose: 'Successor/legal representative (LR) is liable for dues (unlimited if continued; limited to estate if discontinued).' },
        { number: 'Sec 93(2)', heading: 'Liability u/s HUF or AOP partition', purpose: 'Members jointly and severally liable for dues up to the partition date.' },
        { number: 'Sec 93(3)', heading: 'Liability u/s firm dissolution', purpose: 'Partners jointly and severally liable for dues up to the dissolution date.' }
      ]
    },
    {
      number: 'Sec 122 (CGST)',
      heading: 'Penalty for certain offences',
      purpose: 'Core penalty framework for administrative infractions.',
      subsections: [
        { number: 'Sec 122(1)', heading: 'Penalty for 21 designated offences', purpose: 'Levies higher of ₹10,000 or tax evaded / wrong credit / refund taken u/s infraction.' },
        { number: 'Sec 122(1A)', heading: 'Penalty on transaction beneficiaries', purpose: 'Imposes 100% tax penalty on any mastermind/beneficiary retaining benefits of major fraud offences.' },
        { number: 'Sec 122(2)', heading: 'Penalty on standard registered taxpayers', purpose: 'Imposes penalty for short-payment (10% or ₹10,000 for non-fraud; 100% of tax for fraud).' },
        { number: 'Sec 122(3)', heading: 'Penalty on abettors/non-appearance', purpose: 'Imposes penalty up to ₹25,000 for aiding fraud, possessing seized goods, or ignoring summons.' }
      ]
    },
    {
      number: 'Sec 126 (CGST)',
      heading: 'General disciplines related to penalty',
      purpose: 'Jurisprudential boundaries protecting taxpayers from minor/arbitrary penalties.',
      subsections: [
        { number: 'Sec 126(1)', heading: 'Exemption for minor breaches (< ₹5,000)', purpose: 'Bars imposing penalties for minor, easily rectifiable errors of document or tax under ₹5,000.' }
      ]
    },
    {
      number: 'Sec 129 (CGST)',
      heading: 'Detention, seizure and release of goods and conveyances in transit',
      purpose: 'Enforcement and penalty rules for non-compliant transport of goods.',
      subsections: [
        { number: 'Sec 129(1)(a)', heading: 'Seizure release when owner comes forward', purpose: 'Release on payment of 200% tax penalty on taxable goods (or 2% value / ₹25,000 for exempt).' },
        { number: 'Sec 129(1)(b)', heading: 'Seizure release when owner absent', purpose: 'Release on payment of higher of 50% goods value or 200% of tax on taxable goods (or 5% value / ₹25,000 for exempt).' },
        { number: 'Sec 129(3)', heading: 'Provisions for 7-day SCN/Order timeline', purpose: 'Requires PO to issue penalty notice within 7 days of seizure and final order within another 7 days.' }
      ]
    },
    {
      number: 'Sec 130 (CGST)',
      heading: 'Confiscation of goods or conveyances and levy of penalty',
      purpose: 'Harshest administrative step involving title forfeiture to the State.',
      subsections: [
        { number: 'Sec 130(1)', heading: 'Scenarios for confiscation u/s 130', purpose: 'Authorises confiscation of goods/conveyances for specified tax evasion activities with intent.' },
        { number: 'Sec 130(2)', heading: 'Option for redemption fine u/s 130(2)', purpose: 'Allows owner to pay a redemption fine in lieu of confiscation (capped at market value less tax; fine + penalty >= 100% tax).' }
      ]
    },
    {
      number: 'Sec 132 (CGST)',
      heading: 'Punishments for certain offences',
      purpose: 'Statutory criminal framework, imprisonment levels, and bailability rules.',
      subsections: [
        { number: 'Sec 132(1)', heading: 'Prosecution imprisonment thresholds', purpose: 'Up to 5 years if evasion/ITC exceeds ₹5 Crore; up to 3 years if between ₹2-5 Crore; up to 1 year if fake invoices between ₹1-2 Crore.' },
        { number: 'Sec 132(5)', heading: 'Cognizable and non-bailable threshold', purpose: 'Deems offences cognizable and non-bailable solely where tax evasion/fake ITC exceeds ₹5 Crore (bailable in all other cases).' }
      ]
    },
    {
      number: 'Sec 138 (CGST)',
      heading: 'Compounding of offences',
      purpose: 'Enables compounding of criminal charges to avoid physical trial.',
      subsections: [
        { number: 'Sec 138(1)', heading: 'Power to compound charges', purpose: 'Enables Commissioner to compound criminal charges on pay of compounding fee (between 25% and 100% of tax involved) with specified exemptions.' }
      ]
    },
    {
      number: 'Sec 107 (CGST)',
      heading: 'Appeals to Appellate Authority',
      purpose: 'Taxpayer and Departmental appeals with timeline and pre-deposit rules.',
      subsections: [
        { number: 'Sec 107(1)', heading: 'Taxpayer Appeal Timeline', purpose: 'Aggrieved taxpayers can appeal within 3 months of communication of any decision or order (AA can condone 1 month delay).' },
        { number: 'Sec 107(2)', heading: 'Departmental Review Application', purpose: 'Commissioner can review any order and direct subordinate officers to apply within 6 months of communication (condonable by 1 month).' },
        { number: 'Sec 107(6)', heading: 'Mandatory Appeals Pre-deposit', purpose: 'Taxpayer must pay full admitted dues, plus 10% of remaining disputed tax (capped at ₹20 Crore CGST, i.e., ₹40 Crore IGST) to stay recovery.' },
        { number: 'Sec 107(6) Proviso', heading: 'Inter-transit Seizure Pre-deposit', purpose: 'Requires a mandatory 25% pre-deposit of transit seizure penalty u/s 129(3) before filing an appeal.' }
      ]
    },
    {
      number: 'Sec 108 (CGST)',
      heading: 'Powers of Revisional Authority',
      purpose: 'Suo moto review and revision of improper subordinate decisions.',
      subsections: [
        { number: 'Sec 108(1)', heading: 'Revision of prejudicial orders', purpose: 'RA can examine and revise orders of subordinate officers that are erroneous, illegal, improper, or prejudicial to revenue.' },
        { number: 'Sec 108(2)', heading: 'Fetters on Revisional Powers', purpose: 'Prohibits revision if order is appealed, or less than 6 months or more than 3 years have lapsed since communication, or if already revised.' }
      ]
    },
    {
      number: 'Sec 109 (CGST)',
      heading: 'Constitution of Appellate Tribunal',
      purpose: 'Establishes GSTAT hierarchy with Principal and State Benches.',
      subsections: [
        { number: 'Sec 109(3)', heading: 'Principal Bench GSTAT', purpose: 'Principal Bench at New Delhi exclusively hears appeals involving place of supply and anti-profiteering disputes.' },
        { number: 'Sec 109(9)', heading: 'Single Member Bench threshold', purpose: 'Allows GSTAT appeals to be heard by a Single Member if the dispute does not exceed ₹50,00,000 and involves no question of law.' }
      ]
    },
    {
      number: 'Sec 112 (CGST)',
      heading: 'Appeals to Appellate Tribunal',
      purpose: 'GSTAT appeals process, timelines, pre-deposits, and cross-objections.',
      subsections: [
        { number: 'Sec 112(1)', heading: 'GSTAT Taxpayer Appeal Timeline', purpose: 'Taxpayers can appeal within 3 months of communication of the order (GSTAT can condone up to 3 months of delay u/s Sec 112(3)).' },
        { number: 'Sec 112(5)', heading: 'Memorandum of Cross-Objections', purpose: 'Respondent must file cross-objections in Form APL-06 within 45 days of receipt of notice (delay condonable by 45 days).' },
        { number: 'Sec 112(8)', heading: 'GSTAT Appeals Pre-deposit', purpose: 'Taxpayer must pay full admitted dues, plus an additional 10% of disputed tax (capped at ₹20 Crore CGST / ₹40 Crore IGST).' }
      ]
    },
    {
      number: 'Sec 113 (CGST)',
      heading: 'Orders of Appellate Tribunal',
      purpose: 'GSTAT final decisions, adjournments, and error rectifications.',
      subsections: [
        { number: 'Sec 113(3)', heading: 'GSTAT Rectification of Mistakes', purpose: 'GSTAT can rectify any mistake apparent on face of record within 3 months of order date (suo moto or on pointer); no power of review.' }
      ]
    },
    {
      number: 'Sec 117 (CGST)',
      heading: 'Appeal to High Court',
      purpose: 'Appeals against State Bench orders involving questions of law.',
      subsections: [
        { number: 'Sec 117(1)', heading: 'HC Filing window & substantial law', purpose: 'Appeals lie from State Benches of GSTAT to the High Court within 180 days, provided the case involves a substantial question of law.' }
      ]
    },
    {
      number: 'Sec 118 (CGST)',
      heading: 'Appeal to Supreme Court',
      purpose: 'Direct GSTAT appeals and High Court fitness certifications.',
      subsections: [
        { number: 'Sec 118(1)', heading: 'Direct Appeal u/s Place of Supply', purpose: 'Appeals lie directly to the Supreme Court from orders of the Principal Bench of GSTAT (POS and anti-profiteering cases), or fit HC judgments.' }
      ]
    },
    {
      number: 'Sec 120 (CGST)',
      heading: 'Appeal not to be filed in certain cases',
      purpose: 'Prescribes monetary thresholds for department-only appeals.',
      subsections: [
        { number: 'Sec 120(1)', heading: 'Tax Department Monetary Caps', purpose: 'Restricts the Department from filing appeals below the Board thresholds: GSTAT (₹20 Lakh), High Court (₹1 Crore), Supreme Court (₹2 Crore).' }
      ]
    },
    {
      number: 'Sec 121 (CGST)',
      heading: 'Non-appealable decisions and orders',
      purpose: 'Specified administrative decisions against which no appeal whatsoever can be filed.',
      subsections: [
        { number: 'Sec 121(a)', heading: 'Transfer of proceedings order', purpose: 'No appeal lies against any order of the Commissioner directing transfer of proceedings u/s one officer to another.' },
        { number: 'Sec 121(b)', heading: 'Seizure of books and register order', purpose: 'No appeal lies against any order pertaining to the seizure or retention of books of accounts, registers, or files.' },
        { number: 'Sec 121(c)', heading: 'Order sanctioning prosecution', purpose: 'No appeal lies against any order passed by the Commissioner sanctioning prosecution under the Act.' },
        { number: 'Sec 121(d)', heading: 'Instalment payment order', purpose: 'No appeal lies against any order permitting/directing payment of tax, interest, or penalty in monthly instalments u/s Section 80.' }
      ]
    },
    {
      number: 'Sec 95 (CGST)',
      heading: 'Definitions in Advance Ruling',
      purpose: 'Defines Advance Ruling, applicant, and governing authorities.',
      subsections: [
        { number: 'Sec 95(a)', heading: 'Scope of Advance Ruling', purpose: 'A decision by AAR, AAAR, or NAAR on questions u/s 97(2) regarding supplies being undertaken or proposed to be undertaken.' }
      ]
    },
    {
      number: 'Sec 97 (CGST)',
      heading: 'Questions for which advance ruling can be sought',
      purpose: 'Statutory list of admissible questions and place of supply exclusion.',
      subsections: [
        { number: 'Sec 97(2)', heading: 'Admissible advance ruling queries', purpose: 'Rulings can be sought for classification, notification applicability, time/value of supply, ITC, liability, and registration.' },
        { number: 'Sec 97(2) Block', heading: 'Place of Supply absolute bar', purpose: 'Prohibits AAR/AAAR from answering any questions relating to the determination of Place of Supply.' }
      ]
    },
    {
      number: 'Sec 98 (CGST)',
      heading: 'Procedure for obtaining advance ruling',
      purpose: 'Application process, fees, admissibility, and order timelines.',
      subsections: [
        { number: 'Sec 98(2)', heading: 'Admissibility checking u/s pending cases', purpose: 'Rejects application if the question is already pending or decided in any proceedings in the applicant’s own case.' },
        { number: 'Sec 98(6)', heading: 'AAR 90-day final pronouncement', purpose: 'AAR must pronounce its final advance ruling in writing within 90 days of admission of the application.' }
      ]
    },
    {
      number: 'Sec 100 (CGST)',
      heading: 'Appeal to Appellate Authority u/s Advance Ruling',
      purpose: 'Process, timelines, and fees for taxpayer and Department appeals.',
      subsections: [
        { number: 'Sec 100(1)', heading: 'Appeal window & taxpayer filing fee', purpose: 'Applicant or department can appeal to AAAR in 30 days (extendable by 30) with ₹20,000 fee for taxpayers (NIL for department).' }
      ]
    },
    {
      number: 'Sec 102 (CGST)',
      heading: 'Rectification of Advance Ruling orders',
      purpose: 'Allows correcting patent errors on the face of record within 6 months.',
      subsections: [
        { number: 'Sec 102(1)', heading: 'Six-month rectification window', purpose: 'AAR or AAAR can rectify errors apparent from record within 6 months of order date (suo moto or on pointer; must hear if tax increases).' }
      ]
    },
    {
      number: 'Sec 103 (CGST)',
      heading: 'Applicability of advance ruling',
      purpose: 'Defines personal-only binding validity and national exceptions.',
      subsections: [
        { number: 'Sec 103(1)', heading: 'In-personam binding validity', purpose: 'Binding solely on the applicant and their respective proper officers (not applicable as precedent to other taxpayers).' },
        { number: 'Sec 103(1A)', heading: 'National Advance Ruling binding', purpose: 'Rulings issued by the National Appellate Authority (NAAR) bind all distinct persons sharing the same PAN across all States.' }
      ]
    },
    {
      number: 'Sec 104 (CGST)',
      heading: 'Advance ruling to be void in certain circumstances',
      purpose: 'Invalidates rulings obtained by fraudulent means.',
      subsections: [
        { number: 'Sec 104(1)', heading: 'Declaration of void ab-initio', purpose: 'Declares advance ruling void ab-initio if obtained by fraud, suppression of material facts, or misrepresentation (after hearing applicant).' }
      ]
    },
    {
      number: 'Sec 144 (CGST)',
      heading: 'Presumption as to documents',
      purpose: 'Enables Court to presume validity and truth of documents tendered as evidence.',
      subsections: [
        { number: 'Sec 144(1)', heading: 'Shifting the burden of proof', purpose: 'Presumes the truth of contents, signatures, and execution of seized/produced/imported documents tendered as prosecution evidence.' }
      ]
    },
    {
      number: 'Sec 145 (CGST)',
      heading: 'Deemed documents and electronic evidence',
      purpose: 'Admissibility of digital and secondary print records.',
      subsections: [
        { number: 'Sec 145(1)', heading: 'Microfilms and printouts admissibility', purpose: 'Microfilms, facsimile copies, and computer printouts/ERP data are deemed as documents and fully admissible without original proof.' }
      ]
    },
    {
      number: 'Sec 148 (CGST)',
      heading: 'Special procedure for certain processes',
      purpose: 'Allows notifying special procedures for corporate debtors under CIRP and real estate.',
      subsections: [
        { number: 'Sec 148(1)', heading: 'CIRP corporate debtor status', purpose: 'Insolvency debtors under CIRP must register as a distinct person within 30 days and comply with special return/returns filings.' }
      ]
    },
    {
      number: 'Sec 148A (CGST)',
      heading: 'Track and trace mechanism',
      purpose: 'Enforces unique marking on goods to deter evasion.',
      subsections: [
        { number: 'Sec 148A(1)', heading: 'Unique identification marking', purpose: 'Enforces affixing secure, non-removable unique digital stamps or tracking marks on specified commodities.' }
      ]
    },
    {
      number: 'Sec 149 (CGST)',
      heading: 'Goods and services tax compliance rating',
      purpose: 'Assigns public-facing compliance scores.',
      subsections: [
        { number: 'Sec 149(1)', heading: 'Public ranking score', purpose: 'Assigns a compliance rating score out of 10 to every registered person based on their returns filing and matching records.' }
      ]
    },
    {
      number: 'Sec 153 (CGST)',
      heading: 'Taking assistance from an expert',
      purpose: 'Allows proper officers to consult specialists.',
      subsections: [
        { number: 'Sec 153(1)', heading: 'Consulting IT or technical experts', purpose: 'Assistant Commissioner and above can seek assistance from technical/IT experts at any stage of scrutiny, audit, or inquiry.' }
      ]
    },
    {
      number: 'Sec 158 (CGST)',
      heading: 'Disclosure of information by a public servant',
      purpose: 'Enforces strict confidentiality on taxpayer files.',
      subsections: [
        { number: 'Sec 158(1)', heading: 'Confidentiality of records & returns', purpose: 'Binds public servants to keep all statements, returns, accounts, documents, and evidence complete and confidential.' },
        { number: 'Sec 158(3)', heading: 'Permitted exceptions for disclosures', purpose: 'Allows sharing details for prosecutions, implementation audits of receipts, or professional misconduct hearings of CAs.' }
      ]
    },
    {
      number: 'Sec 158A (CGST)',
      heading: 'Consent based sharing of information',
      purpose: 'Enables portal to share filing data on a consent-basis.',
      subsections: [
        { number: 'Sec 158A(1)', heading: 'Authorized sharing platforms', purpose: 'Allows sharing registration and return details with notified platforms like Account Aggregators/Frictionless Credit upon explicit consent.' }
      ]
    },
    {
      number: 'Sec 159 (CGST)',
      heading: 'Publication of information of persons',
      purpose: 'Allows publishing names/particulars of offenders in public interest.',
      subsections: [
        { number: 'Sec 159(1)', heading: 'Publishing names u/s prosecutions', purpose: 'Empowers Commissioner to publish name and offences in public interest once the 107 taxpayer appeal window on penalties has expired.' }
      ]
    },
    {
      number: 'Sec 160 (CGST)',
      heading: 'Assessment proceedings, etc. not to be invalid',
      purpose: 'Protects proceedings from invalidation due to minor technical errors.',
      subsections: [
        { number: 'Sec 160(1)', heading: 'Protection from mistake or defect', purpose: 'Saves assessments, notices, summons, and orders from invalidation if they are in substance and effect in conformity with the Act.' }
      ]
    },
    {
      number: 'Sec 161 (CGST)',
      heading: 'Rectification of errors apparent on face of record',
      purpose: 'Allows authorities to correct obvious clerical or arithmetical mistakes.',
      subsections: [
        { number: 'Sec 161(1)', heading: 'Six-month rectification deadline', purpose: 'Allows rectifying any error apparent on face of record within 6 months of issue (no limit for clerical/accidental slips).' }
      ]
    },
    {
      number: 'Sec 162 (CGST)',
      heading: 'Bar on jurisdiction of civil courts',
      purpose: 'Excludes civil courts from handling civil tax disputes.',
      subsections: [
        { number: 'Sec 162(1)', heading: 'Exclusion of civil dispute cases', purpose: 'Bars civil courts from dealing with or deciding any question arising under the Act, reserving appellate powers strictly to the High Court/Supreme Court.' }
      ]
    },
    {
      number: 'Sec 170 (CGST)',
      heading: 'Rounding off of tax, etc.',
      purpose: 'Requires rounding off final consolidated liabilities to the nearest rupee.',
      subsections: [
        { number: 'Sec 170(1)', heading: 'Nearest rupee rounding rule', purpose: 'Final tax, interest, penalty, fine, or refund claims are rounded off (paise >= 50 raised; paise < 50 ignored; not applicable to individual invoices).' }
      ]
    },
    {
      number: 'Sec 171 (CGST)',
      heading: 'Anti-profiteering measure',
      purpose: 'Enforces passing tax rate reductions and ITC benefits to customers.',
      subsections: [
        { number: 'Sec 171(1)', heading: 'Commensurate price reduction', purpose: 'Requires passing tax and credit reductions directly to customers in the form of lower prices (sunset date 01.04.2025; 10% penalty for defaults).' }
      ]
    },
    {
      number: 'Sec 173 (CGST)',
      heading: 'Omission of Service Tax u/s Finance Act',
      purpose: 'Omit provisions of Service Tax u/s Finance Act 1994.',
      subsections: [
        { number: 'Sec 173(1)', heading: 'Omission of Act 32 of 1994', purpose: 'Removes service tax framework which is fully subsumed under the GST regime.' }
      ]
    },
    {
      number: 'Sec 174 (CGST)',
      heading: 'Repeal and saving',
      purpose: 'Repeals earlier central indirect tax laws with standard savings clauses.',
      subsections: [
        { number: 'Sec 174(1)', heading: 'Repeal of prior legislations', purpose: 'Repeals Central Excise, Medicinal Preparations, and other earlier Acts while preserving accrued rights, investigations, and liabilities.' }
      ]
    },
    {
      number: 'Sec 12 (Customs)',
      heading: 'Levy and collection of Customs Duty',
      purpose: 'Charging section for the levy of customs duties on imports and exports.',
      subsections: [
        { number: 'Sec 12(1)', heading: 'Sovereign Levy of Customs', purpose: 'Authorizes the levy of import or export duties on any goods entering or leaving India at rates specified in the Customs Tariff Act, 1975.' },
        { number: 'Sec 12(2)', heading: 'Levy on Government Cargo', purpose: 'Declares that customs duty is leviable equally on all goods belonging to the Government, treating them on par with private entities.' }
      ]
    },
    {
      number: 'Sec 13 (Customs)',
      heading: 'Duty on pilfered goods',
      purpose: 'Relieves the importer of paying duty on goods stolen after unloading.',
      subsections: [
        { number: 'Sec 13(1)', heading: 'Duty relief for pilfered cargo', purpose: 'Exempts the importer from paying duty on imported goods pilfered after unloading but before the order for home consumption or warehousing clearance.' }
      ]
    },
    {
      number: 'Sec 20 (Customs)',
      heading: 'Re-importation of goods',
      purpose: 'Governs import duty liability on previously exported Indian goods.',
      subsections: [
        { number: 'Sec 20(1)', heading: 'Standard re-importation duty', purpose: 'Restores default duty liabilities on previously exported Indian origin goods when they are re-imported back to India, subject to notification concessions.' }
      ]
    },
    {
      number: 'Sec 21 (Customs)',
      heading: 'Goods derelict, wreck, jetsam & flotsam',
      purpose: 'Taxes sea-salvaged or shipwrecked cargo washed onto Indian soil.',
      subsections: [
        { number: 'Sec 21(1)', heading: 'Deemed import status u/s salvage', purpose: 'Deems all derelict, wreck, jetsam, and flotsam goods coming or brought into India to be imported goods liable to regular duty.' }
      ]
    },
    {
      number: 'Sec 22 (Customs)',
      heading: 'Abatement of duty on damaged or deteriorated goods',
      purpose: 'Proportionately reduces duty based on physical damage or quality reduction.',
      subsections: [
        { number: 'Sec 22(1)', heading: 'Abatement triggering grounds', purpose: 'Allows duty abatement if goods are damaged/deteriorated before/during unloading, or during transport u/s accident before examination, or in a warehouse.' },
        { number: 'Sec 22(2)', heading: 'Proportionate duty reduction rules', purpose: 'Matches the final duty rate to the percentage of residual value left in the damaged/deteriorated goods.' }
      ]
    },
    {
      number: 'Sec 23 (Customs)',
      heading: 'Remission of duty on lost, destroyed or abandoned goods',
      purpose: 'Full duty relief for total natural destruction or relinquishment of title.',
      subsections: [
        { number: 'Sec 23(1)', heading: 'Remission of total loss', purpose: 'Empowers the proper officer to remit full duty if goods are lost (other than pilferage) or destroyed before clearance for home consumption.' },
        { number: 'Sec 23(2)', heading: 'Relinquishing title u/s Abandonment', purpose: 'Allows an importer to unconditionally relinquish title to goods before checkout to escape duty, provided no offense has been committed.' }
      ]
    },
    {
      number: 'Sec 24 (Customs)',
      heading: 'Denaturing or mutilation of goods',
      purpose: 'Makes multi-use goods unfit for other purposes to claim a lower tariff.',
      subsections: [
        { number: 'Sec 24(1)', heading: 'Industrial denaturing authorization', purpose: 'Allows adding denaturants or mutilating goods (like Ethyl Alcohol) to render them unfit for premium purposes and secure a lower duty bracket.' }
      ]
    },
    {
      number: 'Sec 25 (Customs)',
      heading: 'Power to grant exemption from duty',
      purpose: 'Empowers the Central Government to grant custom duty exemptions in public interest.',
      subsections: [
        { number: 'Sec 25(1)', heading: 'General Exemption Notifications', purpose: 'Allows notifying general (absolute or conditional) exemptions in the Official Gazette (valid for 2 years from March 31 of year after issue).' },
        { number: 'Sec 25(2)', heading: 'Special Exemption ad-hoc orders', purpose: 'Allows issuing ad-hoc special orders exempting specific cargo in exceptional situations without Gazette publication; no duty is collected if amount <= ₹100.' }
      ]
    },
    {
      number: 'Sec 25A (Customs)',
      heading: 'Inward processing exemption',
      purpose: 'Exempts imported goods used for repair or manufacturing if re-exported.',
      subsections: [
        { number: 'Sec 25A(1)', heading: 'Inward processing re-export rule', purpose: 'Exempts imported goods raw materials for repairs/mfg under condition that the goods are re-exported within 1 year of clearance.' }
      ]
    },
    {
      number: 'Sec 25B (Customs)',
      heading: 'Outward processing exemption',
      purpose: 'Exempts re-imported goods previously sent abroad for repairs or processing.',
      subsections: [
        { number: 'Sec 25B(1)', heading: 'Outward processing re-import rule', purpose: 'Exempts re-imported goods that were sent out for repair/mfg on condition that they are re-imported back to India within 1 year.' }
      ]
    },
    {
      number: 'Sec 2 (CTA)',
      heading: 'Rates of duties in Schedules',
      purpose: 'Binds import/export levies to the schedules of the Customs Tariff Act 1975.',
      subsections: [
        { number: 'Sec 2(1)', heading: 'First Schedule import tariff', purpose: 'Applies HSN-based 8-digit classification and rates of duty to imported goods.' }
      ]
    },
    {
      number: 'Sec 3 (CTA)',
      heading: 'Levy of additional duty (IGST & Cess)',
      purpose: 'Levies anti-competitive and revenue-matching taxes on imported articles.',
      subsections: [
        { number: 'Sec 3(7)', heading: 'Levy of IGST on Imports', purpose: 'Levies Integrated Tax on imported articles at rates matching domestic GST (max 40%).' },
        { number: 'Sec 3(8)', heading: 'Valuation base for IGST', purpose: 'Defines base for IGST as Assessable Value plus BCD and other custom cesses (excluding IGST and Cess).' },
        { number: 'Sec 3(9)', heading: 'Levy of GST Compensation Cess', purpose: 'Levies Compensation Cess on specified imported luxury or sin goods u/s Section 3 valuation rules.' }
      ]
    },
    {
      number: 'Sec 8B (CTA)',
      heading: 'Safeguard measures u/s import surge',
      purpose: 'Imposes temporary protective tariffs or quotas if import volume surges threaten domestic manufacturers.',
      subsections: [
        { number: 'Sec 8B(1)', heading: 'Triggering Safeguard Imposition', purpose: 'Imposes safeguard duty upon findings of sudden imported volume surge causing serious local industrial injury.' },
        { number: 'Sec 8B(2)', heading: 'Provisional Safeguard Measures', purpose: 'Enforces provisional safeguard measures u/s preliminary findings for up to 200 days.' }
      ]
    },
    {
      number: 'Sec 9 (CTA)',
      heading: 'Countervailing duty on subsidized articles',
      purpose: 'Imposes custom tariffs to counteract export or manufacturing subsidies given by foreign governments.',
      subsections: [
        { number: 'Sec 9(1)', heading: 'Capping Countervailing Duty', purpose: 'Limits countervailing duty up to the verified amount of subsidy granted on foreign exporter.' }
      ]
    },
    {
      number: 'Sec 9A (CTA)',
      heading: 'Anti-dumping duty on dumped articles',
      purpose: 'Imposes compensatory tariffs when imported items are priced lower than their domestic normal value.',
      subsections: [
        { number: 'Sec 9A(1)', heading: 'Dumping & Injury margins', purpose: 'Limits anti-dumping duty to the lower of the Dumping Margin and the Injury Margin (Lesser Duty Rule).' },
        { number: 'Sec 9A(3)', heading: 'Retrospective ADD levy', purpose: 'Allows levying ADD retrospectively up to 90 days prior to provisional duty if dumping is massive and short-term.' }
      ]
    },
    {
      number: 'Sec 9C (CTA)',
      heading: 'Appeal to Appellate Tribunal u/s protective tariffs',
      purpose: 'Grants right to appeal tariff determinations to CESTAT.',
      subsections: [
        { number: 'Sec 9C(1)', heading: 'CESTAT Appeal Window', purpose: 'Aggrieved parties can appeal customs determinations of protective duty u/s 8B, 9, or 9A to CESTAT within 90 days.' }
      ]
    },
    {
      number: 'Sec 14 (Customs)',
      heading: 'Valuation of goods',
      purpose: 'Prescribes the legal methods for valuing import or export items for ad valorem duty.',
      subsections: [
        { number: 'Sec 14(1)', heading: 'Transaction Value Basis', purpose: 'Defines assessable value as the transaction value (price paid, unrelated parties, sole consideration, adjusted u/s Rule 10).' },
        { number: 'Sec 14(2)', heading: 'Gazette Tariff Values', purpose: 'Allows CBIC to fix and publish mandatory tariff values for specific goods, overriding actual transaction values.' }
      ]
    },
    {
      number: 'Sec 19 (Customs)',
      heading: 'Duty on goods consisting of articles liable to different rates',
      purpose: 'Applies unified duty on unseparated sets of items.',
      subsections: [
        { number: 'Sec 19(1)', heading: 'Highest rate set penalty', purpose: 'Charges duty on an entire composite set at the highest rate applicable to any component, unless individual values are proven.' }
      ]
    },
    {
      number: 'Sec 30 (Customs)',
      heading: 'Delivery of import manifest or import report',
      purpose: 'Requires person-in-charge of conveyance to deliver details of cargo, passengers, and stores prior to unloading.',
      subsections: [
        { number: 'Sec 30(1)', heading: 'Electronic Filing', purpose: 'Mandates presenting arrival manifest electronically prior to arrival of vessel or aircraft (within 12 hours for land vehicle).' },
        { number: 'Sec 30(2)', heading: 'Late-filing Penalty', purpose: 'Imposes a penalty not exceeding ₹50,000 for delayed delivery without sufficient cause.' }
      ]
    },
    {
      number: 'Sec 31 (Customs)',
      heading: 'Entry Inwards requirement for unloading cargo',
      purpose: 'Prohibits master of vessel from permitting unloading of goods until entry inwards is granted by customs.',
      subsections: [
        { number: 'Sec 31(1)', heading: 'Entry Inwards Grant', purpose: 'Proper officer grants Entry Inwards on verifying import manifest, marking readiness of customs team to oversee discharge.' },
        { number: 'Sec 31(3)', heading: 'Exempted Items', purpose: 'Exempts baggage, mail bags, animals, perishable, and hazardous goods from entry inwards restrictions.' }
      ]
    },
    {
      number: 'Sec 45 (Customs)',
      heading: 'Restrictions on custody and removal of imported goods',
      purpose: 'Entrusts imported cargo to an approved custodian and defines their statutory liabilities.',
      subsections: [
        { number: 'Sec 45(1)', heading: 'Approved Custodian Store', purpose: 'Mandates that and until clearance, goods must remain in custody of customs-approved persons (Port Trust, CONCOR, Airport Authority).' },
        { number: 'Sec 45(3)', heading: 'Custodian Pilferage Liability', purpose: 'Holds approved private custodians liable to pay customs duty on any goods pilfered (stolen) while in their safe custody.' }
      ]
    },
    {
      number: 'Sec 46 (Customs)',
      heading: 'Entry of goods on importation',
      purpose: 'Requires importer to submit an electronic declaration (Bill of Entry) for assessment and clearance.',
      subsections: [
        { number: 'Sec 46(1)', heading: 'Bill of Entry Filing', purpose: 'Importer files electronic Bill of Entry: Form I (White) for home consumption, Form II (Yellow) for warehousing (into bond).' },
        { number: 'Sec 46(3)', heading: 'Filing Timeline', purpose: 'Requires presentation before the end of the day preceding arrival, allowing advance filing up to 30 days prior to arrival.' }
      ]
    },
    {
      number: 'Sec 47 (Customs)',
      heading: 'Clearance of goods for home consumption',
      purpose: 'Permits clearance of cargo after assessment, payment of duties, or approval of deferred payment.',
      subsections: [
        { number: 'Sec 47(1)', heading: 'Clearance Order', purpose: 'Proper officer passes "Pass out of Customs Charge" order once satisfied that goods are non-prohibited and duties are paid.' },
        { number: 'Sec 47(2)', heading: 'Regular Payment and Interest', purpose: 'Duty must be paid on presentation date (self-assessment) or within 1 day of return. Interest @ 15% p.a. applies on delay.' }
      ]
    },
    {
      number: 'Sec 48 (Customs)',
      heading: 'Procedure in case of goods not cleared or warehoused within 30 days',
      purpose: 'Authorizes custodian to auction unclaimed cargo to recover duties and expenses after giving notice.',
      subsections: [
        { number: 'Sec 48(1)', heading: 'Custodian Auction Right', purpose: 'Permits selling goods not cleared/warehoused within 30 days of unloading (special timeline applies to animals/foodstuffs).' }
      ]
    },
    {
      number: 'Sec 49 (Customs)',
      heading: 'Storage of imported goods in warehouse pending clearance',
      purpose: 'Allows temporary storage of cargo in public warehouses without full warehousing assessment ("warehousing without warehousing").',
      subsections: [
        { number: 'Sec 49(1)', heading: 'Non-warehoused public storage', purpose: 'AC/DC allows storing goods in public warehouse up to 30 days (extendable by further 30 days) if they cannot be cleared promptly.' }
      ]
    },
    {
      number: 'Sec 53 (Customs)',
      heading: 'Transit of goods in same vessel or aircraft',
      purpose: 'Allows cargo to remain on board the same conveyance for onward transit to other domestic/foreign ports without duty.',
      subsections: [
        { number: 'Sec 53(1)', heading: 'Same Bottom Cargo Transit', purpose: 'Permits transit without payment of duty subject to entry of goods as transit cargo in the import manifest.' }
      ]
    },
    {
      number: 'Sec 54 (Customs)',
      heading: 'Transshipment of goods without payment of duty',
      purpose: 'Permits unloading cargo and transferring it to another conveyance for onward transport without duty.',
      subsections: [
        { number: 'Sec 54(1)', heading: 'Bill of Transshipment', purpose: 'Requires presenting a Bill of Transshipment or transshipment declaration for approval by the proper officer.' }
      ]
    },
    {
      number: 'Sec 57 (Customs)',
      heading: 'Licensing of public warehouses',
      purpose: 'Empowers Principal Commissioner or Commissioner of Customs to license public warehouses for storing under-bond goods.',
      subsections: [
        { number: 'Sec 57(1)', heading: 'Public Warehouse Provision', purpose: 'Allows any importer to deposit under-bond dutiable goods under record-based controls without customs physical lock.' }
      ]
    },
    {
      number: 'Sec 58 (Customs)',
      heading: 'Licensing of private warehouses',
      purpose: 'Empowers licensing of private warehouses for exclusive storage of goods imported by the licensee.',
      subsections: [
        { number: 'Sec 58(1)', heading: 'Licensee Exclusive Storage', purpose: 'Allows only the licensee to deposit under-bond dutiable imports under record-based controls.' }
      ]
    },
    {
      number: 'Sec 58A (Customs)',
      heading: 'Licensing of special warehouses',
      purpose: 'Empowers licensing of special warehouses subject to strict physical and locking control of customs officers.',
      subsections: [
        { number: 'Sec 58A(1)', heading: 'Physical Locking Control', purpose: 'For storing notified sensitive commodities (gold, silver, weapons, DFS goods, ship stores) under strict lock and key of customs.' }
      ]
    },
    {
      number: 'Sec 59 (Customs)',
      heading: 'Executing Warehousing Bond',
      purpose: 'Forces importer to post a security bond prior to depositing imported items in any customs bonded warehouse.',
      subsections: [
        { number: 'Sec 59(1)', heading: 'Thrice-Duty Security Bond', purpose: 'Binds the importer to pay a sum equal to thrice (3x) the amount of assessed duty, with required security/guarantees.' }
      ]
    },
    {
      number: 'Sec 61 (Customs)',
      heading: 'Period for which goods may remain warehoused',
      purpose: 'Establishes time limits and interest criteria for storing items under customs bond.',
      subsections: [
        { number: 'Sec 61(1)', heading: 'Storage Time ceiling', purpose: 'Specifies 1 year maximum for general under-bond goods (extendable by 1 year). Manufacturing inputs remain till consumption.' },
        { number: 'Sec 61(2)', heading: 'Interest beyond 90 Days', purpose: 'Imposes interest @ 15% p.a. on the deferred duty amount if goods remain in warehouse beyond a free window of 90 days.' }
      ]
    },
    {
      number: 'Sec 64 (Customs)',
      heading: 'Owner’s right to deal with warehoused goods',
      purpose: 'Guarantees the importer access and titular control over warehoused items in custody.',
      subsections: [
        { number: 'Sec 64(1)', heading: 'Inspection, Sorting, Showing', purpose: 'Grants rights to inspect, sort, pack, take samples, and show the goods for sale to prospective buyers.' }
      ]
    },
    {
      number: 'Sec 65 (Customs)',
      heading: 'Manufacture and other operations in warehouse',
      purpose: 'Governs processing, in-bond manufacturing, assembly, and service operations inside private or special warehouses.',
      subsections: [
        { number: 'Sec 65(1)', heading: 'MOOWR scheme activation', purpose: 'Permits manufacturing with the approval of Principal Commissioner / Commissioner, fully remitting import duties on exported finished products.' }
      ]
    },
    {
      number: 'Sec 70 (Customs)',
      heading: 'Allowance in case of volatile goods',
      purpose: 'Authorizes proper officers to remit duty on natural storage loss of evaporative and volatile products.',
      subsections: [
        { number: 'Sec 70(1)', heading: 'Evaporation Remission', purpose: 'Remits customs duty on natural deficit (evaporation/shrinkage) of notified goods (fuels, spirits, lubricants) at delivery.' }
      ]
    },
    {
      number: 'Sec 72 (Customs)',
      heading: 'Deemed improper removal of goods from a warehouse',
      purpose: 'Lists circumstances where under-bond goods are deemed improperly cleared, triggering immediate recovery.',
      subsections: [
        { number: 'Sec 72(1)(b)', heading: 'Warehousing Period Expiration Deemed Removal', purpose: 'Deems goods improperly removed if they remain past 1 year (or extension), applying duty rates in force on the expiration date (Kesoram Rayon).' }
      ]
    },
    {
      number: 'Sec 26 (Customs)',
      heading: 'Refund of export duty in certain cases',
      purpose: 'Allows refund of paid export duty if transacted goods are rejected and re-imported into India.',
      subsections: [
        { number: 'Sec 26(1)', heading: 'Re-importation within 1 year', purpose: 'Refunds export duty if goods return to exporter within 1 year (without resale) and application is submitted within 6 months.' }
      ]
    },
    {
      number: 'Sec 26A (Customs)',
      heading: 'Refund of import duty in certain cases',
      purpose: 'Allows refund of basic duties if imported finished goods are defective or do not match contract specs.',
      subsections: [
        { number: 'Sec 26A(1)', heading: 'Defective Import Refund', purpose: 'Importer receives refund if goods are defective, not used (except to detect defect), and are exported/destroyed within 30 days.' },
        { number: 'Sec 26A(3)', heading: 'Perishable goods exclusion', purpose: 'Strictly bars duty refunds u/s Section 26A for perishable goods and goods past their shelf-life.' }
      ]
    },
    {
      number: 'Sec 27 (Customs)',
      heading: 'Claim for refund of duty or interest',
      purpose: 'Specifies the process, floor limits, and time periods for seeking excess duty and interest refunds.',
      subsections: [
        { number: 'Sec 27(1)', heading: 'One-year Limitation period', purpose: 'Statutory 1-year time limit to file refund claim from date of payment (not applicable if paid under protest).' },
        { number: 'Sec 27(1) Proviso', heading: 'Minimum Refund Floor', purpose: 'Prohibits any refund of duty or interest if the total claimed amount is less than ₹100.' },
        { number: 'Sec 27(2)', heading: 'Unjust Enrichment & Consumer Welfare Fund', purpose: 'Requires crediting refunds to Consumer Welfare Fund unless the claimant proves they personally bore the burden u/s Sec 28D.' }
      ]
    },
    {
      number: 'Sec 27A (Customs)',
      heading: 'Interest on delayed refunds',
      purpose: 'Guarantees the taxpayer statutory interest if a refund order is not executed within 3 months.',
      subsections: [
        { number: 'Sec 27A(1)', heading: 'Refund Interest Rate @ 6%', purpose: 'Requires CBIC to pay interest @ 6% p.a. starting from the day immediately following the 3-month expiry till actual payment.' }
      ]
    },
    {
      number: 'Sec 5 (FTDR)',
      heading: 'Power of Central Government to notify Foreign Trade Policy',
      purpose: 'Empowers the Central Government to formulate, notify, and amend the Foreign Trade Policy u/s the Official Gazette.',
      subsections: [
        { number: 'Sec 5(1)', heading: 'Notification and Formulation', purpose: 'Central Government may formulate and announce, by notification in the Official Gazette, the foreign trade policy, and can amend it.' }
      ]
    },
    {
      number: 'Sec 7 (FTDR)',
      heading: 'Importer-Exporter Code Number requirement',
      purpose: 'Prohibits any person from undertaking import or export transactions without securing a valid code number.',
      subsections: [
        { number: 'Sec 7(1)', heading: 'IEC Obligation and Annual Updation', purpose: 'Requires obtaining a ten-character alphanumeric, PAN-based Importer-Exporter Code (IEC) from the DGFT, which must be updated electronically every year.' }
      ]
    },
    {
      number: 'Sec 11 (FTDR)',
      heading: 'Contravention of Act, Rules, and Orders',
      purpose: 'Prescribes severe penal consequences and regulatory restrictions for violations of FTP rules.',
      subsections: [
        { number: 'Sec 11(1)', heading: 'Denied Entity List (DEL) and Penalities', purpose: 'Exporters violating license/authorization conditions or failing export obligations are subject to monetary penalties and can be blacklisted on the Denied Entity List.' }
      ]
    },
    {
      number: 'Rule 3 (CGST Rules)',
      heading: 'Intimation for Composition Levy',
      purpose: 'Outlines the procedures and declarations required to opt for the Section 10 Composition Scheme.',
      subsections: [
        { number: 'Rule 3(1)', heading: 'Filing Form GST CMP-01', purpose: 'Requires migrated/pre-existing registrants to submit CMP-01 prior to or within 30 days of the appointed day.' },
        { number: 'Rule 3(3)', heading: 'Filing Form GST CMP-02', purpose: 'Registered persons opting for compostion must file CMP-02 prior to the start of the relevant financial year.' }
      ]
    },
    {
      number: 'Rule 5 (CGST Rules)',
      heading: 'Composition Conditions and Restrictions',
      purpose: 'Prescribes the specific checklists of conditions and bans for taxpayers opting into the composition levy.',
      subsections: [
        { number: 'Rule 5(1)(a)', heading: 'Causal and NRTP Prohibition', purpose: 'Strictly debars Casual Taxable Persons (CTPs) and Non-Resident Taxable Persons (NRTPs) from opting for composition.' },
        { number: 'Rule 5(1)(b)', heading: 'Inputs stock sourcing check', purpose: 'Taxpayer stock on the option date must not comprise goods imported, inter-state sourced, or from unregistered suppliers where RCM has not been paid.' },
        { number: 'Rule 5(1)(g)', heading: 'Mandatory invoice declaration', purpose: 'Composition dealers must mention "composition taxable person, not eligible to collect tax on supplies" at the top of bill of supplies.' }
      ]
    },
    {
      number: 'Rule 28 (CGST Rules)',
      heading: 'Value of Supply between Distinct or Related Persons',
      purpose: 'Prescribes the valuation sequence when a transaction occurs between related or distinct persons u/s Section 25, without an agent.',
      subsections: [
        { number: 'Rule 28(1)(a)', heading: 'Open Market Value', purpose: 'The primary valuation is the Open Market Value (OMV) of the supply on the date of transaction.' },
        { number: 'Rule 28(1)(b)', heading: 'Value of Like Kind and Quality', purpose: 'If OMV is unavailable, valuation is the value of supply of goods/services of like kind and quality.' },
        { number: 'Rule 28(2)', heading: 'Full ITC recipient invoice valuation', purpose: 'Where the matching recipient is eligible for full input tax credit, the value declared in the invoice is legally deemed to be the open market value.' }
      ]
    },
    {
      number: 'Rule 29 (CGST Rules)',
      heading: 'Value of Supply of Goods through an Agent',
      purpose: 'Prescribes valuation for transactions between a principal and their agent.',
      subsections: [
        { number: 'Rule 29(a)', heading: 'Open Market Value or 90% Customer Price', purpose: 'Value is the Open Market Value, or at the option of the supplier, 90% of the price charged by the recipient agent to their unrelated customer.' },
        { number: 'Rule 29(b)', heading: 'Rule 30/31 application', purpose: 'If value cannot be determined under clause (a), it must be computed applying Rule 30 or Rule 31 sequentially.' }
      ]
    },
    {
      number: 'Rule 30 (CGST Rules)',
      heading: 'Value of Supply based on Cost',
      purpose: 'A valuation method when a transaction cannot be assessed u/s open market or comparative values.',
      subsections: [
        { number: 'Rule 30(1)', heading: 'One hundred and ten percent of cost', purpose: 'Valuation is flatly fixed at 110% of the cost of production, manufacture, or acquisition of such goods, or cost of provision of services.' }
      ]
    },
    {
      number: 'Rule 31 (CGST Rules)',
      heading: 'Residual Valuation Method',
      purpose: 'The ultimate fallback method mapping value using reasonable means consistent with Section 15 and Rules.',
      subsections: [
        { number: 'Rule 31(1)', heading: 'Reasonable Principles Fallback', purpose: 'Allows proper officer/taxpayer to determine value based on fair and logical principles of tax valuation.' },
        { number: 'Rule 31 Proviso', heading: 'Direct Rule 31 for Services', purpose: 'Grants suppliers of services the option to apply Rule 31 directly, completely bypassing the cost-based Rule 30.' }
      ]
    },
    {
      number: 'Rule 31A (CGST Rules)',
      heading: 'Value of Supply in Case of Lottery, Betting, Gambling, and Horse Racing',
      purpose: 'Establishes valuation for specified actionable claims.',
      subsections: [
        { number: 'Rule 31A(2)', heading: 'Actionable Claims Valuation', purpose: 'Deems the value of supply of lottery, betting, gambling, or horse racing to be 100% of the face value of the ticket or bet amount.' }
      ]
    },
    {
      number: 'Rule 32 (CGST Rules)',
      heading: 'Determination of Value for Specific Supplies',
      purpose: 'Gives custom rate percentages and flat rates in lieu of normal transactional valuation for select sectors.',
      subsections: [
        { number: 'Rule 32(2)', heading: 'Foreign Currency Exchange', purpose: 'Provides step-wise margin rates based on RBI reference rate, or flat % slabs (0.1% to 1% of gross currency value) for exchange bureaus.' },
        { number: 'Rule 32(3)', heading: 'Air Travel Reservation Agents', purpose: 'Value of service is 5% of basic fare for domestic bookings and 10% of basic fare for international bookings.' },
        { number: 'Rule 32(4)', heading: 'Life Insurance Business', purpose: 'Value is gross premium less investment deposits (if allocated), or 25% of premium in 1st year and 12.5% in subsequent years, or 10% on single premium.' },
        { number: 'Rule 32(5)', heading: 'Second-Hand Goods Margin Scheme', purpose: 'Value is the margin (Selling Price - Buying Price). No GST applies if the difference/margin is negative, provided no ITC was taken.' }
      ]
    },
    {
      number: 'Rule 33 (CGST Rules)',
      heading: 'Value of Supply of Services for Pure Agent',
      purpose: 'Enables excluding disbursements from the value of supply if the taxpayer acts solely as an authorized pure agent.',
      subsections: [
        { number: 'Rule 33(1)', heading: 'Pure Agent Exclusion Criteria', purpose: 'Exempts outlays if: (1) payment is made on recipient instruction; (2) invoice separately details pure agent charges; (3) goods/services are additional to own services.' }
      ]
    },
    {
      number: 'Rule 34 (CGST Rules)',
      heading: 'Rate of Exchange of Currency of Valuation',
      purpose: 'Prescribes which exchange rates to use when billing in foreign currency.',
      subsections: [
        { number: 'Rule 34(1)', heading: 'Customs rate for imported goods', purpose: 'Exchange rate notified by CBIC on the date of Bill of Entry filing must be used for goods import valuation.' },
        { number: 'Rule 34(2)', heading: 'GAAP/RBI rate for services', purpose: 'Exchange rate in accordance with GAAP/RBI reference rate on the date of supply is used for service valuation.' }
      ]
    },
    {
      number: 'Rule 36 (CGST Rules)',
      heading: 'Documentary Requirements & ITC Eligibility',
      purpose: 'Lists the core documents required to claim Input Tax Credit.',
      subsections: [
        { number: 'Rule 36(1)', heading: 'Eligible Tax-Paying Documents', purpose: 'ITC can only be claimed on: (1) Tax Invoice; (2) Debit Note; (3) ISD Invoice; (4) Bill of Entry for imports; (5) Self-Invoice under RCM.' },
        { number: 'Rule 36(4)', heading: 'GSTR-2B Communications restriction', purpose: 'Restricts recipient from claiming ITC unless matching details have been filed by the supplier in GSTR-1 and communicated in GSTR-2B.' }
      ]
    },
    {
      number: 'Rule 37 (CGST Rules)',
      heading: 'Reversal of ITC for Non-Payment in 180 Days',
      purpose: 'Implements Section 16(2) repayment mandate, specifying reversal computations.',
      subsections: [
        { number: 'Rule 37(1)', heading: 'Reversal and Interest on unpaid bills', purpose: 'Recipient must reverse input tax credit proportional to unpaid portion if failing to pay supplier within 180 days of invoice, along with 18% statutory interest.' }
      ]
    },
    {
      number: 'Rule 37A (CGST Rules)',
      heading: 'Reversal of ITC on Supplier GSTR-3B Filing Failure',
      purpose: 'Implements tracking and reversal for non-payment of tax by the supplier.',
      subsections: [
        { number: 'Rule 37A(1)', heading: 'Reversal on Supplier default', purpose: 'Requires reversing ITC before 30th November of next FY if the supplier has not filed GSTR-3B and paid tax, allowing re-availment later u/s actual filing.' }
      ]
    },
    {
      number: 'Rule 39 (CGST Rules)',
      heading: 'Procedure for Input Service Distribution (ISD)',
      purpose: 'Prescribes separate registration and common credits distribution workflows.',
      subsections: [
        { number: 'Rule 39(1)(e)', heading: 'Proportionate Turnover Allocation', purpose: 'Distributes common input service credits amongst beneficiary branches in ratio of their preceding year state turnovers.' }
      ]
    },
    {
      number: 'Rule 42 (CGST Rules)',
      heading: 'Apportionment & Reversal of Input/Service ITC',
      purpose: 'Calculates eligible credit fractions when commonly sourcing inputs for both taxable/exempt and business/private supplies.',
      subsections: [
        { number: 'Rule 42(1)(i)', heading: 'Non-business credit reversal (D1)', purpose: 'Requires reversing 5% of common input credit as attributable to private/non-business uses.' },
        { number: 'Rule 42(1)(j)', heading: 'Exempt supply credit reversal (D2)', purpose: 'Apportions and reverses credit in ratio of exempt turnover divided by total state turnover.' }
      ]
    },
    {
      number: 'Rule 43 (CGST Rules)',
      heading: 'Apportionment & Reversal of Capital Goods ITC',
      purpose: 'Calculates credit apportionment on capital goods commonly used for mixed supplies.',
      subsections: [
        { number: 'Rule 43(1)', heading: 'Useful Life Allocation', purpose: 'Common capital goods are assigned a statutory useful life of 60 months (5 years), reversing common credit monthly u/s exempt turnover ratios.' }
      ]
    },
    {
      number: 'Rule 48(4) (CGST Rules)',
      heading: 'e-Invoicing Mandatory Class',
      purpose: 'Mandates direct reporting of taxable B2B invoices on the National portal.',
      subsections: [
        { number: 'Rule 48(4)', heading: 'IRN Generation Requirement', purpose: 'Assessees past specified turnover limits (₹5 Crore) must generate Invoice Reference Numbers (IRNs) using Json schemas on the IRP portal.' }
      ]
    },
    {
      number: 'Rule 86A (CGST Rules)',
      heading: 'Electronic Credit Ledger Blocking',
      purpose: 'Empowers proper officers to freeze credit ledger balances in cases of suspected fraud.',
      subsections: [
        { number: 'Rule 86A(1)', heading: 'Grounds of credit freezing', purpose: 'Allows blocking credit for up to 1 year during investigations if PO has reasons to believe ITC was claimed on fake invoices or from non-existent dealers.' }
      ]
    },
    {
      number: 'Rule 86B (CGST Rules)',
      heading: '99% Credit Utilization Cash Pay Cap',
      purpose: 'Forces pre-reconciliations and prevents completely wiping out liabilities using ITC.',
      subsections: [
        { number: 'Rule 86B(1)', heading: 'One percent cash pay mandate', purpose: 'Taxpayer with monthly taxable values exceeding ₹50 Lakh cannot utilize Credit Ledger to discharge more than 99% of output tax, necessitating 1% cash payment.' }
      ]
    },
    {
      number: 'Rule 88A (CGST Rules)',
      heading: 'Order of Credit Utilization',
      purpose: 'Optimizes tax pay sequences u/s Section 49.',
      subsections: [
        { number: 'Rule 88A(1)', heading: 'Complete IGST Exhaustion First', purpose: 'Taxpayer is legally restricted from using CGST or SGST/UTGST credits unless the ledger of Integrated Tax (IGST) is completely utilized.' }
      ]
    },
    {
      number: 'Rule 89 (CGST Rules)',
      heading: 'Refund of Tax on Zero-Rated Supplies',
      purpose: 'Outlines the strict formulas for compiling export refund claims.',
      subsections: [
        { number: 'Rule 89(4)', heading: 'LUT / Bond Export Refund Formula', purpose: 'Refund = (Turnover of Zero-Rated Goods + Turn of Zero-Rated Services) * Net ITC / Adjusted Total Turnover.' }
      ]
    },
    {
      number: 'Rule 96 (CGST Rules)',
      heading: 'Refund of IGST Paid on Exported Goods',
      purpose: 'Automates export refunds on tax payment route.',
      subsections: [
        { number: 'Rule 96(1)', heading: 'Shipping Bill Deemed Application', purpose: 'Filing of Shipping Bill is deemed refund application when: (1) exporter files GSTR-1 and GSTR-3B; (2) export manifest details are verified.' }
      ]
    },
    {
      number: 'Rule 138 (CGST Rules)',
      heading: 'E-Way Bill Generation & Information',
      purpose: 'Enforces compliance prior to transporting goods.',
      subsections: [
        { number: 'Rule 138(1)', heading: 'Fifty thousand consignment threshold', purpose: 'Requires generating an e-way bill in Form GST EWB-01 prior to dispatching goods exceeding ₹50,000 consignment value.' }
      ]
    },
    {
      number: 'Rule 138(10) (CGST Rules)',
      heading: 'Validity and Distance of E-Way Bills',
      purpose: 'Controls transport transit time rules.',
      subsections: [
        { number: 'Rule 138(10)', heading: 'Custom validity day limits', purpose: '1 day validity for first 200 km (normal cargo) / 20 km (over-dimensional cargo), plus 1 additional day for every matching part thereof.' }
      ]
    },
    {
      number: 'Rule 1 (Customs GRI)',
      heading: 'Section and Chapter Notes',
      purpose: 'The primary rule of customs tariff interpretation.',
      subsections: [
        { number: 'GRI Rule 1', heading: 'Legal Classification primacy', purpose: 'Mandates that classification is legally determined strictly by the terms of the Headings and relative Section or Chapter Notes.' }
      ]
    },
    {
      number: 'Rule 3 (Customs Valuation Rules)',
      heading: 'Transaction Value and Valuation Methods',
      purpose: 'Prescribes the primacy of transaction value (CVR 2007) and sequential fallback routes.',
      subsections: [
        { number: 'CVR Rule 3(1)', heading: 'Acceptance of transaction value', purpose: 'Assessable value is transaction value under Section 14, adjusted according to the additions specified in Rule 10.' },
        { number: 'CVR Rule 3(1) Pro', heading: 'Sequential Methods fallback', purpose: 'If value cannot be determined under Rule 3(1), sequential methods apply: Identical goods (Rule 4), Similar goods (Rule 5), Deductive (Rule 7), Computed (Rule 8), Residual (Rule 9).' }
      ]
    },
    {
      number: 'Rule 10(1) (Customs Valuation Rules)',
      heading: 'Custom Valuation Pre-Import Additions',
      purpose: 'Prescribes adjustments to FOB invoice values to arrive at actual cost at port of load.',
      subsections: [
        { number: 'CVR Rule 10(1)(a)', heading: 'Commissions and packaging', purpose: 'Adds commissions and brokerage (except buying commissions) and matching packing/container charges.' },
        { number: 'CVR Rule 10(1)(b)', heading: 'Engineering assists and materials', purpose: 'Adds value of tools/dies, materials, and design or engineering work executed outside India and supplied free of charge.' }
      ]
    },
    {
      number: 'Rule 10(2) (Customs Valuation Rules)',
      heading: 'Custom Freight and Insurance Adjustment',
      purpose: 'Governs maritime/air transport freight and premium inclusions to calculate CIF value.',
      subsections: [
        { number: 'CVR Rule 10(2)(a)', heading: 'Maritime/Air transport freight rates', purpose: 'Included cost of transport to port of import (capped at 20% of FOB for air imports; fixed at 20% if non-ascertainable).' },
        { number: 'CVR Rule 10(2)(b)', heading: 'Insurance Premium rates', purpose: 'Included cost of insurance to port of import (fixed at 1.125% of FOB if actual premium is non-ascertainable).' }
      ]
    },
    {
      number: 'Rule 12 (Customs Valuation Rules)',
      heading: 'Proper Officer Power of Declared Value Rejection',
      purpose: 'Outlines procedures when proper officers doubt the accuracy of declared transaction values.',
      subsections: [
        { number: 'CVR Rule 12(1)', heading: 'Query memo and natural justice', purpose: 'PO must notify importer of grounds of doubt, hear their explanations, and pass a speaking order in writing if rejecting declared values.' }
      ]
    },
    {
      number: 'Sec 11A (CGST)',
      heading: 'Power Not to Recover GST Not Levied or Short-Levied Due to General Practice',
      purpose: 'Empowers the Government (on Council recommendation) to regularize non-levy or short-levy of GST resulting from prevalent trade practice.',
      subsections: [
        { number: 'Sec 11A', heading: 'Trade Practice Regularization (As is / Where is)', purpose: 'By notification, Govt may direct that whole or excess tax payable on supplies shall not be required to be paid where non-levy/short-levy occurred due to general trade practice.' }
      ]
    },
    {
      number: 'Sec 122A (CGST)',
      heading: 'Penalty for Failure to Register Certain Machines Used in Manufacture of Specified Goods',
      purpose: 'Enforces special Track and Trace compliance for pan masala, tobacco, and notified evasion-prone commodities.',
      subsections: [
        { number: 'Sec 122A(1)', heading: '₹1,00,000 Per Unregistered Machine Penalty', purpose: 'Levies ₹1,00,000 penalty for every machine not registered as per special procedure u/s 148A, in addition to other penalties under Chapter XV.' },
        { number: 'Sec 122A(2)', heading: 'Confiscation & Exemption Condition', purpose: 'Unregistered machines are liable to seizure and confiscation unless penalty is paid AND machine is registered within 3 days of receipt of penalty order.' }
      ]
    },
    {
      number: 'Sec 128A (CGST)',
      heading: 'Amnesty Waiver of Interest or Penalty for FY 2017-18, 2018-19 & 2019-20 (Sec 73 Cases)',
      purpose: 'Grants conditional full waiver of interest and penalty for initial GST implementation years where full tax demand is discharged.',
      subsections: [
        { number: 'Sec 128A(1)', heading: 'Full Interest & Penalty Waiver on Tax Payment', purpose: 'Where SCN/Order issued u/s 73 (non-fraud) for FY 2017-18 to 2019-20 and full tax is paid on or before notified date (31.03.2025), interest and penalty stand completely waived.' },
        { number: 'Sec 128A(1) Proviso', heading: 'No Refund of Already Paid Interest/Penalty & Erroneous Refund Exclusion', purpose: 'Does not apply to erroneous refunds; any interest or penalty already paid prior to waiver cannot be refunded.' }
      ]
    },
    {
      number: 'Schedule I & II (Customs Tariff Act, 1975)',
      heading: 'First Schedule (Import Tariff) & Second Schedule (Export Tariff)',
      purpose: 'Prescribes tariff classification headings, Section/Chapter Notes, and Standard/Preferential duty rates for imports and exports under Section 2 of the Customs Tariff Act, 1975.',
      subsections: [
        { number: 'First Sch (Import Tariff)', heading: '21 Sections & 98 Chapters of Import Tariff + Special Chapter 98 Headings', purpose: 'Covers all imported goods with 8-digit HSN tariff items; Chapter 98 covers Project Imports (9801), Laboratory Chemicals (9802), All Dutiable Passenger Baggage (9803 @ 35% BCD + 10% SWS = 38.5%), and Personal Imports by Post/Air/Courier (9804).' },
        { number: 'Second Sch (Export Tariff)', heading: 'Notified Export Duty Goods Schedule', purpose: 'Enumerates specific commodities (such as hides/skins, iron ore, chrome ore, and specified steel/mineral products) liable to Export Duty upon exportation from India.' }
      ]
    },
    {
      number: 'Schedule / Annexures I, II & III (Baggage Rules, 2016)',
      heading: 'Statutory Annexures to Baggage Rules, 2016 [Read with Sec 79 (Customs)]',
      purpose: 'Lists prohibited/restricted articles excluded from General Free Allowance (Annexure I) and household/personal effects eligible under Transfer of Residence (Annexures II & III).',
      subsections: [
        { number: 'Baggage Annexure I', heading: '6 Articles Excluded from ₹50,000 / ₹15,000 General Free Allowance (GFA)', purpose: '(1) Firearms; (2) Cartridges of firearms exceeding 50; (3) Cigarettes exceeding 100 sticks or cigars exceeding 25 or tobacco exceeding 125 gms; (4) Alcoholic liquor or wine in excess of 2 litres; (5) Gold or silver in any form other than ornaments; (6) Flat panel (LCD/LED/Plasma) television.' },
        { number: 'Baggage Annexure II', heading: 'Specified Appliances & Equipment Under Transfer of Residence (Rule 6)', purpose: 'Covers Colour TV, Video Home Theatre System, Dish Washer, Domestic Refrigerator (>=300L), Deep Freezer, Video Camera, Cinematographic Films (35mm+), and Gold/Silver ornaments.' },
        { number: 'Baggage Annexure III', heading: 'Personal & Household Articles Eligible for Concessional Transfer of Residence Allowance', purpose: 'Covers VCR/VCD, Digital Video Disc Player, Music System, Air-Conditioner, Microwave Oven, Word Processing Machine, Fax Machine, Portable Photocopier, Washing Machine, Electrical/LPG Cooking Range, Personal Computer/Laptop, and Domestic Refrigerator (<300L) — duty-free up to ₹1L (3–6m stay), ₹2L (6–12m stay), and ₹5L (>2 yrs stay).' }
      ]
    },
    // ==========================================
    // MODULE 1: SUPPLY, LEVY & COMPOSITION SCHEME [LEVY]
    // ==========================================
    {
      number: 'Notification No. 02/2019 - CT (Rate)',
      heading: 'Composition Scheme for Intra-State Service Suppliers u/s 10(2A) [Levy]',
      purpose: 'Prescribes 6% effective GST rate (3% CGST + 3% SGST) for eligible small service providers with aggregate turnover up to ₹50 Lakh in preceding financial year.'
    },
    {
      number: 'Notification No. 14/2019 - Central Tax',
      heading: 'Composition Scheme Turnover Limits & Debarred Goods List [Levy]',
      purpose: 'Notifies ₹1.5 Crore turnover limit (₹75 Lakh for 8 Special Category States) and debars manufacturers of ice cream, pan masala, tobacco, aerated water, bricks, and tiles from composition levy.'
    },
    {
      number: 'Circular No. 34/8/2018-GST',
      heading: 'Printing of Books, Pamphlets, Annual Reports & Customer Content [Levy]',
      purpose: 'Clarifies that printing customer-owned manuscripts, logos, or content is a supply of service where printing dominates, but a supply of goods if printer supplies standard custom envelopes/stationery using own design.'
    },
    {
      number: 'Circular No. 92/11/2019-GST',
      heading: 'Sales Promotion Schemes, Free Samples & Buy-One-Get-One Offers [Levy]',
      purpose: 'Clarifies that free samples given without consideration are non-supplies (ITC blocked u/s 17(5)(h)); "Buy One Get One Free" offers are not free supplies, but two goods supplied for a single price, taxed as composite/mixed supply u/s 8.'
    },
    {
      number: 'Circular No. 177/09/2022-GST',
      heading: 'Liquidated Damages, Cheque Bounce Penalties & Notice Pay Forfeiture [Levy]',
      purpose: 'Clarifies that liquidated damages, breach penalties, late payment charges, cheque bounce charges, and employee notice pay forfeiture are compensatory recoveries, not an agreement to tolerate an act, hence outside GST (no tax).'
    },
    {
      number: 'Circular No. 178/10/2022-GST',
      heading: 'Taxability of Agreeing to Tolerate an Act & Non-Compete Agreements [Levy]',
      purpose: 'Establishes principles distinguishing genuine contracts for agreeing to tolerate an act (taxable u/Sch II Para 5(e)) from statutory fines, ticket cancellation penalties, and accidental contractual breaches (outside GST).'
    },
    {
      number: 'Circular No. 196/08/2023-GST',
      heading: 'Taxability of Director Remuneration & Services [Levy / RCM]',
      purpose: 'Clarifies that director salary subjected to TDS u/s 192 represents employer-employee relationship (Schedule III non-supply; no GST); director professional fees subjected to TDS u/s 194J are non-employment services liable to RCM u/s 9(3).'
    },
    {
      number: 'Circular No. 205/17/2023-GST',
      heading: 'Co-Insurance Premium Sharing & Ceding Commission Between Insurers [Levy]',
      purpose: 'Clarifies that sharing of premium among lead and coinsurers in a consortium arrangement, as well as ceding commission received from reinsurers, does not represent independent taxable supplies.'
    },
    {
      number: 'Circular No. 206/18/2023-GST',
      heading: 'Director Personal Guarantee to Bank for Company Loan [Levy / Valuation]',
      purpose: 'Clarifies that personal guarantees furnished by a director without consideration to a bank for company borrowing is a deemed supply u/Schedule I, but open market value is NIL if no fee is paid to the director.'
    },

    // ==========================================
    // MODULE 2: REVERSE CHARGE MECHANISM (RCM) [REVERSE CHARGE]
    // ==========================================
    {
      number: 'N/N 13/2017 - CT (Rate)',
      heading: 'Master Notification for Services Under Reverse Charge Mechanism (RCM) u/s 9(3) [RCM]',
      purpose: 'Mandates recipient of specified intra-State services to pay 100% GST directly in cash via Electronic Cash Ledger with itemized entries.',
      subsections: [
        { number: 'N/N 13/2017 Entry 1', heading: 'Goods Transport Agency (GTA) Services [RCM]', purpose: 'Recipient (factory, registered society, co-op, body corporate, partnership firm, registered person, CTP) pays 100% GST under RCM, unless GTA files declaration opting for Forward Charge (5% without ITC or 12% with ITC).' },
        { number: 'N/N 13/2017 Entry 2', heading: 'Legal Services by Advocates / Senior Advocates / Firms [RCM]', purpose: 'Business entity located in taxable territory pays 100% GST under RCM if its aggregate turnover in preceding FY exceeds registration threshold (exempt if within threshold).' },
        { number: 'N/N 13/2017 Entry 3', heading: 'Arbitral Tribunal Services [RCM]', purpose: 'Business entity located in taxable territory pays 100% GST under RCM if its aggregate turnover in preceding FY exceeds registration threshold.' },
        { number: 'N/N 13/2017 Entry 4', heading: 'Sponsorship Services [RCM]', purpose: 'Body corporate or partnership firm located in taxable territory pays 100% GST under RCM on sponsorship services received from any person.' },
        { number: 'N/N 13/2017 Entry 5 & 5A', heading: 'Government Services & Immovable Property Renting [RCM]', purpose: 'Business entity pays RCM on sovereign Government services; Registered person pays RCM on renting of immovable property by Central/State Govt/Local Authority.' },
        { number: 'N/N 13/2017 Entry 5AA', heading: 'Renting of Residential Dwelling to Registered Person [RCM]', purpose: 'Registered person recipient pays 100% GST under RCM on residential dwelling rented for any purpose, unless rented to proprietor in personal capacity for own residence.' },
        { number: 'N/N 13/2017 Entry 5AB', heading: 'Renting of Commercial Immovable Property by Unregistered Person [RCM]', purpose: 'Registered person recipient pays 100% GST under RCM on commercial immovable property rented from any unregistered supplier.' },
        { number: 'N/N 13/2017 Entry 6', heading: 'Director Services to Company / Body Corporate [RCM]', purpose: 'Company or Body Corporate pays 100% GST under RCM on services provided by independent or non-executive director (remuneration subjected to TDS u/s 194J).' },
        { number: 'N/N 13/2017 Entry 7 & 8', heading: 'Insurance Agent & Recovery Agent Services [RCM]', purpose: 'Insurance company pays 100% GST under RCM for insurance agent services; Bank/NBFC/FI pays 100% GST under RCM for recovery agent services.' },
        { number: 'N/N 13/2017 Entry 9 & 9A', heading: 'Copyright of Music/Art & Author Services [RCM]', purpose: 'Publisher, music company, or producer pays RCM on copyright assignment (author may opt for Forward Charge by filing declaration and issuing GST invoice).' },
        { number: 'N/N 13/2017 Entry 14', heading: 'Security Services (Supply of Security Personnel) [RCM]', purpose: 'Registered person pays 100% GST under RCM when security personnel are supplied by any non-body corporate (excludes composition dealers and TDS-only deductors).' },
        { number: 'N/N 13/2017 Entry 15', heading: 'Renting of Passenger Motor Vehicle with Fuel [RCM]', purpose: 'Body corporate pays 100% GST under RCM when passenger motor vehicle is rented by non-body corporate paying 5% GST without input tax credit.' },
        { number: 'N/N 13/2017 Entry 16', heading: 'Lending of Securities under SLB Scheme of SEBI [RCM]', purpose: 'Borrower of securities pays 100% GST under RCM on lending fees charged by lender through an approved intermediary.' }
      ]
    },
    {
      number: 'Notification No. 04/2017 - CT (Rate)',
      heading: 'Notified Goods Under Reverse Charge Mechanism u/s 9(3) [RCM]',
      purpose: 'Mandates registered recipient to pay 100% GST under RCM on: cashew nuts (not shelled/peeled), bidi wrapper leaves (tendu), tobacco leaves, raw cotton (from agriculturist), lottery tickets, silk yarn, used vehicles/seized goods from Govt, and Priority Sector Lending Certificates (PSLC).'
    },
    {
      number: 'N/N 10/2017 - IT (Rate)',
      heading: 'IGST Inter-State & Cross-Border Reverse Charge Services u/s 5(3) [RCM]',
      purpose: 'Specifies cross-border and inter-State reverse charge services payable by Indian recipient via Electronic Cash Ledger.',
      subsections: [
        { number: 'N/N 10/2017 Entry 1', heading: 'Import of Services into India [RCM]', purpose: 'Indian recipient (other than non-taxable online recipient) pays 100% IGST under RCM on any service supplied by a person located in non-taxable territory.' },
        { number: 'N/N 10/2017 Entry 2', heading: 'Transfer of Development Rights (TDR) / Floor Space Index (FSI) [RCM]', purpose: 'Promoter/builder pays 100% IGST under RCM on transfer of development rights or FSI supplied by landowner for construction of real estate projects.' }
      ]
    },

    // ==========================================
    // MODULE 3: EXEMPTIONS FROM TAX [MEGA EXEMPTIONS]
    // ==========================================
    {
      number: 'N/N 12/2017 - CT (Rate)',
      heading: 'Master Exemption Notification for Intra-State Services u/s 11(1) [Exemptions]',
      purpose: 'Statutory exemption register covering 80+ essential services in public interest, healthcare, education, agriculture, and governance.',
      subsections: [
        { number: 'N/N 12/2017 Entry 1', heading: 'Charitable Activities by Sec 12AA/12AB Entities [Exemptions]', purpose: 'Exempts charitable activities: public health (terminally ill, disability), advancement of religion/yoga, education for orphans/poor, and environment/wildlife preservation.' },
        { number: 'N/N 12/2017 Entry 4 & 5', heading: 'Pure Services & Composite Supply to Local Authorities [Exemptions]', purpose: 'Exempts pure services and composite supply of goods and services (goods value <= 25%) provided to Govt/Local Authority for Article 243W municipal or Article 243G panchayat functions.' },
        { number: 'N/N 12/2017 Entry 6, 7 & 9', heading: 'Government Sovereign Services & Commercial Carve-Outs [Exemptions]', purpose: 'Exempts sovereign Government services EXCEPT (a) Dept of Posts speed post/parcel/agency services, (b) Port/Airport services, (c) Transport of goods/passengers, and (d) Business services where consideration > ₹5,000.' },
        { number: 'N/N 12/2017 Entry 12', heading: 'Renting of Residential Dwelling for Residence [Exemptions]', purpose: 'Exempts renting of residential dwelling for use as residence to unregistered individuals; renting to registered persons is taxable under RCM (exempt if rented to proprietor for personal residence).' },
        { number: 'N/N 12/2017 Entry 15 & 17', heading: 'Passenger Transport Services [Exemptions]', purpose: 'Exempts non-AC stage carriage, metered cabs, auto-rickshaws (unless supplied through ECO), metro, monorail, tramway, inland waterways, and non-AC railway travel.' },
        { number: 'N/N 12/2017 Entry 18 & 21', heading: 'Goods Transport by Road (Non-GTA) & Specified GTA Cargo [Exemptions]', purpose: 'Exempts non-GTA road transport; exempts GTA transport of agricultural produce, milk/salt/foodgrains, organic manure, relief materials, and defence equipment.' },
        { number: 'N/N 12/2017 Entry 27', heading: 'Banking Services: Loans, Deposits & Inter-Bank Forex [Exemptions]', purpose: 'Exempts extending deposits, loans or advances where consideration is interest or discount (excluding credit card interest); exempts inter-bank foreign currency transactions.' },
        { number: 'N/N 12/2017 Entry 45', heading: 'Legal Services by Advocates & Arbitral Tribunals [Exemptions]', purpose: 'Exempts legal services provided to non-business entities, small business entities with turnover within registration threshold, or Government departments.' },
        { number: 'N/N 12/2017 Entry 66', heading: 'Educational Institutions Services & Inbound Supplies [Exemptions]', purpose: 'Exempts services by educational institution to students, faculty, and staff; inbound catering, security, cleaning, and transport services exempt up to Higher Secondary school level.' },
        { number: 'N/N 12/2017 Entry 74', heading: 'Healthcare & Clinical Establishments [Exemptions]', purpose: 'Exempts medical diagnosis, treatment, and patient transport; hospital room rent exempt up to ₹5,000/day (ICU/CCU/NICU fully exempt without monetary ceiling).' }
      ]
    },
    {
      number: 'Notification No. 09/2017 - IT (Rate)',
      heading: 'Master Exemption Notification for Inter-State Services u/s 6(1) IGST [Exemptions]',
      purpose: 'Extends service exemptions to inter-State commerce, including cross-border import concessions and ticket admissions to circus, award functions, and cultural events up to ₹500 per person.'
    },
    {
      number: 'Notification No. 02/2017 - CT (Rate)',
      heading: 'Master Exemption Notification for Goods u/s 11(1) [Exemptions]',
      purpose: 'Exempts basic unbranded agricultural produce, fresh fruits and vegetables, live animals, unbranded milk/curd/paneer, grains, and unprocessed food items from GST.'
    },

    // ==========================================
    // MODULE 4: TIME AND VALUE OF SUPPLY [TIME & VALUE]
    // ==========================================
    {
      number: 'Notification No. 66/2017 - Central Tax',
      heading: 'Exemption from GST on Advance Received for Supply of Goods [Time of Supply]',
      purpose: 'Relieves all registered suppliers of goods (other than composition taxpayers) from paying GST on advances; Time of Supply of goods u/s 12(2) is exclusively the date of invoice issuance or last date u/s 31(1).'
    },
    {
      number: 'Circular No. 186/18/2022-GST',
      heading: 'Taxability of No Claim Bonus (NCB) in Motor Insurance [Valuation]',
      purpose: 'Clarifies that No Claim Bonus (NCB) offered by insurance companies is an allowable discount u/s 15(3)(a); GST is leviable only on the net premium billed to the policyholder.'
    },
    {
      number: 'Circular No. 212/06/2024-GST',
      heading: 'Valuation of Corporate Guarantees Between Related Entities [Valuation]',
      purpose: 'Clarifies the application of Valuation Rule 28(2): corporate guarantee provided to bank/FI on behalf of related entity is valued at 1% p.a. of guaranteed amount or actual consideration, whichever is higher.'
    },

    // ==========================================
    // MODULE 5: INPUT TAX CREDIT (ITC) [ITC]
    // ==========================================
    {
      number: 'Notification No. 39/2018-CT & 49/2019-CT',
      heading: 'Sub-rule (4) of Rule 36 Restrictions on Unmatched Invoices [ITC]',
      purpose: 'Introduced progressive statutory caps on availing ITC on invoices not uploaded by suppliers, culminating in mandatory 100% GSTR-2B matching requirement u/s 16(2)(aa).'
    },
    {
      number: 'Notification No. 27/2022 - Central Tax',
      heading: 'Mandatory Reversal of ITC for Supplier Tax Default u/r 37A [ITC]',
      purpose: 'Prescribes Rule 37A: recipient must reverse availed ITC on or before 30th November following financial year if supplier fails to furnish GSTR-3B by 30th September; re-claimable upon subsequent tax payment.'
    },
    {
      number: 'Circular No. 170/02/2022-GST',
      heading: 'Mandatory Reporting of Ineligible & Blocked ITC in GSTR-3B Table 4 [ITC]',
      purpose: 'Mandates explicit reporting of blocked credits u/s 17(5) and non-business reversals u/r 42/43 in Table 4 of Form GSTR-3B to prevent unauthorized credit carryovers.'
    },
    {
      number: 'Circular No. 172/04/2022-GST',
      heading: 'Clarification on Blocked ITC u/s 17(5)(b) for Statutory Obligations [ITC]',
      purpose: 'Clarifies that ITC is available on food, health insurance, and motor transport services if the employer is legally obligated under any law for the time being in force (e.g. Factories Act) to provide them to employees.'
    },
    {
      number: 'Circular No. 183/15/2022-GST & 193/05/2023-GST',
      heading: 'Verification Procedure for ITC Differences in GSTR-3B vs GSTR-2A [ITC]',
      purpose: 'Prescribes standard verification procedure for FY 2017-18 to 2019-20: CA certificate required for differential ITC exceeding ₹5 Lakh, and supplier self-certificate for differences up to ₹5 Lakh.'
    },
    {
      number: 'Circular No. 211/05/2024-GST',
      heading: 'Time Limit for Availing ITC on RCM Supplies by Unregistered Persons [ITC]',
      purpose: 'Clarifies that for reverse charge supplies received from unregistered suppliers, relevant financial year for Section 16(4) time limit is the FY in which recipient issues self-invoice u/s 31(3)(f).'
    },

    // ==========================================
    // MODULE 6: PLACE OF SUPPLY & CROSS-BORDER [PLACE OF SUPPLY]
    // ==========================================
    {
      number: 'Notification No. 04/2019 - IT (Rate)',
      heading: 'Place of Supply for Specified Research & R&D Services [Place of Supply]',
      purpose: 'Notifies pharmaceutical and clinical trial R&D services provided to foreign entities as having Place of Supply outside India (recipient location u/s 13(2)), qualifying them as export of services.'
    },
    {
      number: 'Circular No. 161/17/2021-GST',
      heading: 'Export of Services & Establishments of Distinct Persons [Cross-Border]',
      purpose: 'Clarifies that a subsidiary company incorporated in India is a distinct legal person from its foreign parent company, satisfying condition (v) of Section 2(6) for export of services.'
    },
    {
      number: 'Circular No. 202/14/2023-GST',
      heading: 'Place of Supply for Transportation of Goods Outside India [Place of Supply]',
      purpose: 'Clarifies the legal effect of omitting Section 13(9) of the IGST Act: Place of supply of transportation of goods to destination outside India is now determined by default rule u/s 13(2) (location of recipient).'
    },
    {
      number: 'Circular No. 209/03/2024-GST',
      heading: 'Place of Supply for Custodial Services to Foreign Portfolio Investors [Place of Supply]',
      purpose: 'Clarifies that custodial services provided by Indian custodian banks to FPIs are performance/financial services governed by Section 13(2) (location of recipient outside India), eligible as export of services.'
    },

    // ==========================================
    // MODULE 7: TAX INVOICE, E-INVOICING & E-WAY BILL [TAX INVOICE & E-WAY BILL]
    // ==========================================
    {
      number: 'Notification No. 13/2020 - Central Tax',
      heading: 'Mandatory e-Invoicing Threshold & Exempted Classes u/r 48(4) [Tax Invoice]',
      purpose: 'Prescribes mandatory generation of Invoice Reference Number (IRN) for taxpayers with aggregate turnover exceeding ₹5 Crore in any preceding FY; exempts SEZ units, insurers, banks, GTA, passenger transport, and cinema.'
    },
    {
      number: 'Notification No. 14/2020 - Central Tax',
      heading: 'Dynamic QR Code on B2C Invoices for Turnover > ₹500 Crore [Tax Invoice]',
      purpose: 'Mandates displaying digital Dynamic Quick Response (QR) Code on B2C tax invoices for taxpayers having aggregate PAN turnover exceeding ₹500 Crore to promote digital retail payments.'
    },
    {
      number: 'Circular No. 64/38/2018-GST',
      heading: 'Relief from Transit Detention u/s 129 for Minor E-Way Bill Errors [E-Way Bill]',
      purpose: 'Restricts coercive detention u/s 129 for minor typographical errors (e.g. 1-2 digits vehicle number error, pin-code typing error, minor address mismatch); mandates nominal ₹1,000 penalty in challan instead.'
    },
    {
      number: 'Circular No. 180/12/2022-GST',
      heading: 'Refund Procedure for Unregistered Real Estate Buyers [Refunds]',
      purpose: 'Provides specialized refund procedure for home buyers who paid GST to developers on advance booking where agreement was subsequently cancelled and developer did not adjust credit note.'
    },

    // ==========================================
    // MODULE 8: REGISTRATION, RETURNS & JOB WORK [REGISTRATION & RETURNS]
    // ==========================================
    {
      number: 'Notification No. 10/2019 - Central Tax',
      heading: '₹40 Lakh Threshold Exemption from Registration for Exclusive Goods Suppliers [Registration]',
      purpose: 'Exempts exclusive intra-State suppliers of goods in standard States from obtaining GST registration u/s 23(2) if aggregate turnover does not exceed ₹40 Lakh (does not apply to ice cream/pan masala/tobacco makers or compulsory registrants u/s 24).'
    },
    {
      number: 'Notification No. 06/2019 - Central Tax',
      heading: 'Quarterly Return Monthly Payment (QRMP) Scheme Framework [Returns]',
      purpose: 'Prescribes quarterly filing of GSTR-1 and GSTR-3B for taxpayers with aggregate turnover up to ₹5 Crore, with monthly tax deposits in PMT-06 using Fixed Sum (35%) or Self-Assessment method.'
    },
    {
      number: 'Notification No. 38/2023 - Central Tax',
      heading: 'Biometric-based Aadhaar Authentication for Registration [Registration]',
      purpose: 'Empowers proper officers to subject high-risk registration applicants to biometric-based Aadhaar verification and photograph capture under Rule 8(4A).'
    },
    {
      number: 'Circular No. 38/12/2018-GST',
      heading: 'Scope of Job Work & Permitted Use of Own Material [Job Work]',
      purpose: 'Clarifies that job workers can use their own supplementary raw materials or minor inputs while carrying out processing on principal goods without altering the nature of job work services.'
    },
    {
      number: 'Circular No. 96/15/2019-GST',
      heading: 'Transfer of Business & Successor Liability on Sole Proprietor Death [Liability]',
      purpose: 'Clarifies procedures for transferring unutilized ITC in Form GST ITC-02 to legal heir upon death of sole proprietor and enforces joint and several tax liability on successor u/s 85 / 93.'
    },
    {
      number: 'Circular No. 194/06/2023-GST',
      heading: 'TCS Liability in Multi-ECO Networks (ONDC Architecture) [E-Commerce / TCS]',
      purpose: 'Clarifies that in multiple e-commerce operator networks, seller-side ECO who settles the final payment with the actual supplier is responsible for deducting TCS u/s 52 and filing GSTR-8.'
    },

    // ==========================================
    // MODULE 9: DEMANDS, PENALTIES, RECOVERY & AMNESTY [DEMANDS & AMNESTY]
    // ==========================================
    {
      number: 'Notification No. 09/2023-CT & 56/2023-CT',
      heading: 'Extension of Limitation Period for Section 73 Demands [Demands]',
      purpose: 'Extended statutory time limits under Section 73(10) for issuing adjudication orders for FY 2017-18, 2018-19, and 2019-20 up to specified staggered deadlines.'
    },
    {
      number: 'Notification No. 21/2024 - Central Tax',
      heading: 'Section 128A Amnesty Date Notification for Interest & Penalty Waiver [Amnesty]',
      purpose: 'Notifies 31st March 2025 as the sunset date for payment of full tax demand u/s 73 for FY 2017-18, 2018-19, and 2019-20 to obtain unconditional 100% waiver of interest and penalties.'
    },
    {
      number: 'Circular No. 185/17/2022-GST',
      heading: 'Clarification on Detention, Seizure & Bank Guarantees u/s 129 [Penalties]',
      purpose: 'Clarifies procedures for executing bank guarantees in Form GST MOV-08 for provisional release of goods in transit and computation of 200% penalty on taxable value.'
    },

    // ==========================================
    // MODULE 10: CUSTOMS, BAGGAGE & FTP [CUSTOMS & FTP]
    // ==========================================
    {
      number: 'Notification No. 50/2017 - Customs',
      heading: 'Master Exemption Notification for Basic Customs Duty (BCD) Rates [Customs]',
      purpose: 'Consolidates hundreds of effective tariff concessions, conditional duty rates, and industry-specific import exemptions under Section 25(1) of the Customs Act.'
    },
    {
      number: 'Notification No. 45/2017 - Customs',
      heading: 'Concession on Re-importation of Goods Exported for Repairs Abroad [Customs]',
      purpose: 'Restricts customs duty on re-import to repair cost, materials, and freight/insurance both ways, provided re-import is within 5 years (extendable to 7 years) and ownership has not changed.'
    },
    {
      number: 'Notification No. 158/95 - Customs',
      heading: 'Full Exemption on Indian Manufactured Goods Re-imported for Repairs [Customs]',
      purpose: 'Exempts re-import of Indian manufactured goods for repairs or reconditioning from BCD and IGST, subject to continuity bond and re-export within 6 months (extendable to 1 year).'
    },
    {
      number: 'Notification No. 26/2023 - Customs',
      heading: 'Project Imports Scheme Regulations u/s Heading 9801 [Customs]',
      purpose: 'Governs registration of industrial project import contracts and application of unified concessional customs tariff on complete plant machinery and apparatus.'
    },
    {
      number: 'Notification No. 40/2017 - CT (Rate) & 41/2017 - IT (Rate)',
      heading: 'Concessional 0.1% GST Rate for Supplies to Merchant Exporters [Exports]',
      purpose: 'Prescribes concessional 0.05% CGST + 0.05% SGST (or 0.1% IGST) on taxable goods supplied to registered merchant exporters for export within 90 days from invoice date.'
    },
    {
      number: 'Circular No. 03/2023 - Customs',
      heading: 'Standard Operating Procedure for Verification of Origin Under CAROTAR 2020 [Customs]',
      purpose: 'Prescribes rigorous SOP and proper officer verification checks for duty exemption claims under Free Trade Agreements (FTAs) ensuring compliance with 35% local value addition.'
    },
    {
      number: 'Circular No. 08/2023 - Customs',
      heading: 'Electronic Cash Ledger (ECL) Implementation Guidelines u/s 51A [Customs]',
      purpose: 'Lays down procedural operationalization of electronic cash ledger payments for customs duties, interest, penalties, and automated refund of unutilized ledger cash balances.'
    },
    {
      number: 'FTP 2023 (Chapters 1 to 7)',
      heading: 'Foreign Trade Policy 2023 Key Duty Remission & Export Schemes [FTP]',
      purpose: 'Governs India export promotion schemes, duty remission, EPCG capital goods imports, and EOU/SEZ deemed exports.',
      subsections: [
        { number: 'FTP Ch 1 & 2', heading: 'IEC, SCOMET & Status Holder Star Thresholds [FTP]', purpose: 'Status Holders (FOB/FOR export in current + last 3 FYs): 1-Star ($3M), 2-Star ($15M), 3-Star ($50M), 4-Star ($200M), 5-Star ($800M). Double weightage for MSME/ISO/Northeastern units (for 1-Star only).' },
        { number: 'FTP Ch 4', heading: 'Advance Authorization, DFIA & RoDTEP [FTP]', purpose: 'Advance Authorization: Exempts BCD, Addl Duty, EC, ADD, Safeguard, and IGST (actual user condition, min 15% Value Addition; 18m EO). DFIA: Transferable, post-export, BCD exempt ONLY (min 20% Value Addition). RoDTEP: Rebate of embedded unrefunded duties via electronic scrip.' },
        { number: 'FTP Ch 5', heading: 'Export Promotion Capital Goods (EPCG) Scheme [FTP]', purpose: 'Zero Customs Duty & IGST exemption on import of capital goods (including spares/moulds; excludes second-hand CG). Specific EO = 6 times duty saved in 6 years (2 blocks: 4 yrs 50% + 2 yrs 50%) over and above Average EO.' },
        { number: 'FTP Ch 6 & 7', heading: 'EOUs/EHTP/STP/BTP & Deemed Exports [FTP]', purpose: 'EOUs must achieve positive Net Foreign Exchange (NFE = A - B > 0) over 5 years. Deemed Exports: Goods manufactured in India supplied to AA/DFIA/EPCG/EOU/UN projects without leaving India (eligible for TED refund / Deemed Export Drawback).' }
      ]
    }
  ],
  ...INTERMEDIATE_STATUTORY_SECTIONS,
  ...FOUNDATION_STATUTORY_SECTIONS,
  ...CMA_STATUTORY_SECTIONS
};

export const LIMITS_RATES: Record<string, LimitRateItem[]> = {
  Audit: AUDIT_LIMITS_RATES,
  DT: [
    { item: 'Section 43(1) Actual Cost Cash Outlay Limit', limitRate: '₹10,000 / day', remarks: 'Any expenditure for acquiring an asset where payment/aggregate of payments to a person in a day exceeds ₹10,000 in cash is completely excluded from the "Actual Cost" for depreciation.' },
    { item: 'Section 40A(3) General Business Expense Cash Limit', limitRate: '₹10,000 / day', remarks: 'Any payment made for an expense exceeding ₹10,000 in cash to a person in a single day is fully disallowed from deductions under PGBP.' },
    { item: 'Section 40A(3) Transport Operator Cash Limit', limitRate: '₹35,000 / day', remarks: 'For payments made specifically to transport operators for plying, hiring, or leasing goods carriages, the cash limit is relaxed to ₹35,000.' },
    { item: 'Section 40(a)(ia) Non-Deduction Disallowance on Resident Payments', limitRate: '30% of expenditure', remarks: 'Failure to deduct TDS on payments made to residents (e.g. fees, commission, interest) attracts a flat disallowance of 30% of the entire transaction value.' },
    { item: 'Section 40(b)(iv) Partnership Capital Interest Limit', limitRate: '12% p.a. simple interest', remarks: 'Any interest payment made to partners on their capital contribution is allowed as a deduction only up to a maximum statutory rate of 12% p.a.' },
    { item: 'Section 40(b)(v) Partner Remuneration Limit (Up to first ₹6 Lakh book profits)', limitRate: '90% of profits or ₹3,00,000', remarks: 'For working partners salary deduction, u/s 40(b)(v), on the first ₹6 Lakh of book profits (or in case of loss), the limit is ₹3,00,000 or 90% of book profits, whichever is higher.' },
    { item: 'Section 40(b)(v) Partner Remuneration Limit (On balance book profits)', limitRate: '60% of book profits', remarks: 'On any balance book profits exceeding ₹6 Lakh, working partner salary deduction is restricted to 60% of such excess.' },
    { item: 'Section 32 Asset Put to Use < 180 Days rule', limitRate: '50% of depreciation rate', remarks: 'Where an asset acquired during the previous year is put to use for business for less than 180 days, the allowable depreciation (normal and additional) is strictly restricted to 50% of the standard rate.' },
    { item: 'Section 32(1)(iia) Additional Depreciation Rate', limitRate: '20% of actual cost', remarks: 'Allowed as a one-time deduction on new plant & machinery acquired & installed by manufacturing or power concerns. Recovers remaining 50% in next year if used < 180 days.' },
    { item: 'Section 35AD specified hospital bed limit', limitRate: 'Minimum 100 beds', remarks: 'For eligibility of investment-linked deduction of 100% u/s 35AD, hospitals constructed anywhere in India must have at least 100 beds for patients.' },
    { item: 'Section 44AD Presumptive Taxation general rate', limitRate: '8% of turnover', remarks: 'For eligible assessees (turnover within ₹2Cr / ₹3Cr u/s 44AD), business income is presumed at 8% of total gross receipts/turnover.' },
    { item: 'Section 44AD Presumptive Taxation digital payment rate', limitRate: '6% of turnover', remarks: 'For turnover received through bank accounts, credit cards, any other electronic clearing modes before the return filing due date, presumptive rate is reduced to 6%.' },
    { item: 'Section 44ADA Presumptive Taxation professional rate', limitRate: '50% of gross receipts', remarks: 'For notified professionals u/s 44AA(1) with receipts within ₹50L / ₹75L, business income is presumed at 50% of gross receipts.' },
    { item: 'Section 44AE Heavy Goods Carriages presumptive duty rate', limitRate: '₹1,000 / ton / month', remarks: 'For goods vehicles exceeding 12,000 kg gross weight, presumptive income is deemed at ₹1,000 per ton of gross vehicle weight for every month or part of month.' },
    { item: 'Section 44AE Other Goods Carriages presumptive duty rate', limitRate: '₹7,500 / vehicle / month', remarks: 'For goods vehicles not exceeding 12,000 kg, presumptive income is deemed flat at ₹7,500 per month or part of month.' },
    { item: 'Section 56(2)(x) Gifts & Undervalue Limit', limitRate: '₹50,000', remarks: 'Any sum of money or property received without consideration is taxable if aggregate value exceeds ₹50,000. For inadequate consideration of immovable property, the difference between SDV and consideration must exceed both ₹50,000 and 10% of the consideration.' },
    { item: 'Section 115BB Casual Income Tax Rate', limitRate: '30% flat + SC + Cess', remarks: 'Taxed at 30% plus surcharge, if applicable, plus 4% education cess. No deductions u/s 57, no basic exemption limits, and no Chapter VI-A are allowable against winning income.' },
    { item: 'Section 115BBJ Online Games Winnings Rate', limitRate: '30% flat + SC + Cess', remarks: 'Net winnings from online games are taxed at flat 30% u/s 115BBJ.' },
    { item: 'Section 10(15) Post Office Savings Account Exemption Limit', limitRate: 'Indiv: ₹3,500 / Joint: ₹7,000', remarks: 'Post office savings bank account interest is exempt from tax up to ₹3,500 in an individual account and ₹7,000 in a joint account u/s 10(15).' },
    { item: 'Section 57(iia) Family Pension Deduction Cap', limitRate: 'Optional: ₹15,000 / Default: ₹25,000', remarks: 'Family pension deduction is restricted to 33-1/3% of the pension or the respective regime cap, whichever is lower.' },
    { item: 'Section 57(i) Dividend Interest Expense Limit', limitRate: '20% of dividend income', remarks: 'Interest expenditure incurred to earn such dividend / mutual fund income is allowed up to a maximum of 20% of the dividend sum.' }
  ],
  IDT: [
    { item: 'Schedule I Employer-Employee Gift Exemption Limit', limitRate: '₹50,000 / FY', remarks: 'Gifts up to ₹50,000 in a financial year by an employer to an employee are exempt from being treated as supply under Schedule I. Any amount exceeding this is fully taxable.' },
    { item: 'Doctrine of Mutuality Override', limitRate: 'No Limit', remarks: 'Under Section 7(1)(aa), any transaction or activity between a club, association, or cooperative society and its members for consideration is fully taxable as supply, ruling out any mutuality exemption.' },
    { item: 'Composition Option Preceding FY Turnover Limit (Goods - General)', limitRate: '₹1.5 Crore', remarks: 'For eligibility of composition under Sec 10(1) in general States, preceding FY aggregate turnover must not exceed ₹1.5 Crore.' },
    { item: 'Composition Option Preceding FY Turnover Limit (Goods - Specified)', limitRate: '₹75 Lakh', remarks: 'For eligibility of composition u/s 10(1) in 8 Special Category States (Arunachal Pradesh, Uttarakhand, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura), preceding FY aggregate turnover must not exceed ₹75 Lakh.' },
    { item: 'Composition Option Preceding FY Turnover Limit (Services)', limitRate: '₹50 Lakh', remarks: 'For service composition under Sec 10(2A), preceding FY aggregate turnover must not exceed ₹50 Lakh.' },
    { item: 'Composition Scheme tax rates u/s 10(1) (Manufacturers)', limitRate: '1% of Turnover', remarks: '0.5% CGST + 0.5% SGST/UTGST calculated on total turnover in the State or Union Territory.' },
    { item: 'Composition Scheme tax rates u/s 10(1) (Restaurants)', limitRate: '5% of Turnover', remarks: '2.5% CGST + 2.5% SGST/UTGST calculated on total turnover in the State or Union Territory.' },
    { item: 'Composition Scheme tax rates u/s 10(1) (Traders)', limitRate: '1% of Taxable Supplies', remarks: '0.5% CGST + 0.5% SGST/UTGST calculated on the turnover of TAXABLE supplies in the State or Union Territory.' },
    { item: 'Services Composition tax rate u/s 10(2A)', limitRate: '6% of Turnover', remarks: '3% CGST + 3% SGST/UTGST calculated on total turnover in the State or Union Territory.' },
    { item: 'Marginal Supply of Services limit for Goods Composition', limitRate: '10% of Turnover or ₹5 Lakh', remarks: 'Second proviso to Sec 10(1) permits supplying other services up to 10% of State/UT turnover in preceding FY or ₹5 Lakh, whichever is higher.' },
    { item: 'CGST statutory maximum tax rate cap u/s 9(1)', limitRate: '20%', remarks: 'The maximum tax rate CGST is legally capped at 20%. The SGST/UTGST rate is similarly capped at 20%, ensuring the combined GST rate cannot exceed 40%.' },
    { item: 'IGST statutory maximum tax rate cap u/s 5(1)', limitRate: '40%', remarks: 'The maximum rate of IGST on inter-State supplies is legally capped at 40% u/s 5(1) of the IGST Act.' },
    { item: 'Event Admission Tax-Free Ticket Limit', limitRate: '₹500 per person', remarks: 'Right to admission to musical, theatrical, award or circus events is exempt from GST under Notification No. 9/2017 IT (R) if the ticket consideration does not exceed ₹500.' },
    { item: 'Hospital Room Rent Exemption Ceiling', limitRate: '₹5,000 per day', remarks: 'Healthcare services room renting by a clinical establishment is exempt only if the room rent does not exceed ₹5,000 per day. If it exceeds ₹5,000, 5% GST (without ITC) is charged.' },
    { item: 'Service Invoice Issuance Deadline', limitRate: '30 Days', remarks: 'Under Section 31(2), invoice for supply of services must be issued within a compulsory window of 30 days from the date of completion of service.' },
    { item: 'Banking/Insurance Service Invoice Issuance Deadline', limitRate: '45 Days', remarks: 'For banking companies, financial institutions, NBFCs, and insurance agencies, invoice must be issued within a relaxed timeline of 45 days from completion.' },
    { item: 'RCM Goods TOS Timeline Limit', limitRate: '30 Days u/s 12(3)', remarks: 'Under reverse charge for goods, if other factors do not trigger earlier, TOS is the day immediately following 30 days from the invoice date of the supplier.' },
    { item: 'RCM Services TOS Timeline Limit', limitRate: '60 Days u/s 13(3)', remarks: 'Under reverse charge for services, if other factors do not trigger earlier, TOS is the day immediately following 60 days from the invoice date of the supplier.' },
    { item: '180 Days Rule Match Payment rule', limitRate: '180 Days u/s 16(2)', remarks: 'Recipient must pay the supplier the value of supply plus tax within 180 days of the invoice date, otherwise they must reverse the ITC with interest.' },
    { item: 'Re-claiming previously reversed ITC deadline', limitRate: 'No Limit u/s 16(2)', remarks: 'The standard Section 16(4) time limit does not apply to re-claiming ITC which was previously reversed due to non-payment within 180 days.' },
    { item: 'Registration Threshold (Exclusive Goods)', limitRate: '₹40 Lakh u/s 22(1)', remarks: 'Exclusive intra-State suppliers of goods in major general States (e.g. Maharashtra, Gujarat, Karnataka, Rajasthan) are exempt from registration if aggregate turnover is within ₹40 Lakh.' },
    { item: 'Registration Threshold (Services/Mixed supplies)', limitRate: '₹20 Lakh u/s 22(1)', remarks: 'Standard registration threshold for service providers or mixed goods & services suppliers in general States is ₹20 Lakh.' },
    { item: 'Registration Threshold (4 Special Category States)', limitRate: '₹10 Lakh u/s 22(1)', remarks: 'For Mizoram, Tripura, Manipur, and Nagaland u/s 22, both goods and services suppliers must register if aggregate turnover exceeds ₹10 Lakh.' },
    { item: 'Registration Threshold (6 specified states/UTs)', limitRate: '₹20 Lakh u/s 22(1)', remarks: 'Arunachal Pradesh, Uttarakhand, Meghalaya, Sikkim, Puducherry, and Telangana retain a ₹20 Lakh threshold for both goods and services u/s 22.' },
    { item: 'Compulsory Registration Application timeline', limitRate: '30 Days u/s 25(1)', remarks: 'Any person liable to register must submit the registration application within 30 days from the date they became liable.' },
    { item: 'CTP and NRTP Prior registration application window', limitRate: '5 Days u/s 25(1)', remarks: 'Casual Taxable Persons (CTP) and Non-Resident Taxable Persons (NRTP) must apply for registration at least 5 days prior to commencing business.' },
    { item: 'CTP and NRTP registration validity period', limitRate: '90 Days u/s 27(1)', remarks: 'The certificate of registration issued to a CTP or NRTP is valid for the period specified or 90 days, extendable by PO for progressive 90 days.' },
    { item: 'Small invoice ceiling exemption', limitRate: '₹200 u/s 31(3)(b)', remarks: 'A registered person is exempt from issuing a tax invoice if the value of supply is less than ₹200, provided the recipient is unregistered and doesn\'t require one.' },
    { item: 'Mandatory e-Invoicing Turn over threshold', limitRate: '₹5 Crore u/s Rule 48(4)', remarks: 'Mandatorily applicable for registered businesses with aggregate PAN turnover in any preceding FY from 2017-18 onwards exceeding ₹5 Crore (B2B/exports).' },
    { item: 'E-way bill mandatory value threshold', limitRate: '₹50,000 u/s Rule 138', remarks: 'Required prior to the movement of goods in a conveyance when the consignment value exceeds ₹50,000. Compulsory even if <= ₹50,000 for inter-State principal-to-jobber and inter-state handicraft goods.' },
    { item: 'Books of accounts retention mandatory timeline', limitRate: '72 Months u/s Sec 36', remarks: 'Registered persons must preserve books of accounts and records for 72 months from the due date of filing the annual return of the relevant FY.' },
    { item: 'E-way bill validity standard distance limit', limitRate: '200 km u/s Rule 138(10)', remarks: 'For normal cargo, 1 day validity is granted for first 200 km, and 1 additional day for every remaining 200 km or part thereof.' },
    { item: 'E-way bill validity (Over Dimensional Cargo/Multimodal)', limitRate: '20 km u/s Rule 138(10)', remarks: 'For Over-Dimensional Cargo or multimodal shipment involving a ship leg, 1 day validity for first 20 km and +1 day for every 20 km or part thereof thereafter.' },
    { item: 'E-way bill cancellation window', limitRate: '24 Hours u/s Rule 138(9)', remarks: 'An e-way bill can be cancelled within 24 hours of generation if goods are not transported or not as per details (unless intercepted/verified in transit).' },
    { item: 'E-way bill validity (Part B updation validity)', limitRate: '15 Days u/s Rule 138(9)', remarks: 'Unique E-way bill number remains valid for 15 days from generation to update Part B transport details.' },
    { item: 'TDS mandatory deduction contract threshold', limitRate: '₹2,50,000 u/s Sec 51(1)', remarks: 'Tax is deducted u/s 51 if the total value of taxable supply under a single contract exceeds ₹2,50,000 (excluding GST).' },
    { item: 'TDS statutory deduction CGST/SGST rate', limitRate: '1% CGST + 1% SGST', remarks: 'Government departments must deduct GST at 1% CGST and 1% SGST/UTGST (total 2% intra-state) from payments made to suppliers under taxable contracts exceeding ₹2.5 Lakh u/s 51.' },
    { item: 'TDS statutory deduction IGST rate', limitRate: '2% IGST', remarks: 'For inter-State supplies attracting TDS u/s 51, the deductor must deduct 2% IGST.' },
    { item: 'TDS / TCS Government deposit deadline', limitRate: '10th of Next Month', remarks: 'TDS (u/s 51) and TCS (u/s 52) collected during a month must be paid to the Government within 10 days after the end of that month.' },
    { item: 'TCS statutory collection rate (intra-state)', limitRate: '0.25% CGST + 0.25% SGST', remarks: 'Electronic Commerce Operators (ECOs) must collect TCS u/s 52(1) at 0.25% CGST and 0.25% SGST/UTGST (total 0.5%) on net value of intra-state supplies.' },
    { item: 'TCS statutory collection rate (inter-state)', limitRate: '0.5% IGST', remarks: 'For inter-State e-commerce transactions, the ECO must collect TCS u/s 52 at the rate of 0.5% IGST on net value of supplies.' },
    { item: 'Over-The-Counter payment ledger cap', limitRate: '₹10,000 per Challan', remarks: 'Over the counter cash/cheque/DD deposits to the Electronic Cash Ledger u/s Rule 87(3) are limited to ₹10,000 per challan per tax period (exempt for government, recovery, and investigations).' },
    { item: 'GSTR-8 Late filing fee', limitRate: '₹200 / Day', remarks: 'Late fee u/s Section 47 for GSTR-8 is ₹200 per day (₹100 under CGST + ₹100 under SGST/UTGST) during which failure continues, capped at ₹10,000 (₹5,000 each).' },
    { item: 'QRMP Monthly tax payment deadline', limitRate: '25th of Next Month', remarks: 'Under QRMP, the monthly tax deposit in form GST PMT-06 must be completed by the 25th day of the succeeding month.' },
    { item: 'Invoice Furnishing Facility (IFF) Monthly Invoice Cap', limitRate: '₹50 Lakh', remarks: 'A registered person opting for QRMP scheme can upload optional B2B invoices in IFF up to a cumulative value of ₹50 Lakh in each of the first 2 months of the quarter.' },
    { item: 'Invoice Furnishing Facility (IFF) Uploading Window', limitRate: '13 Days u/s Rule 59', remarks: 'Details in IFF can only be uploaded from the 1st day of the succeeding month till the 13th day of that month.' },
    { item: 'Form GSTR-5A (OIDAR) Monthly filing deadline', limitRate: '20th of Next Month', remarks: 'Registered overseas suppliers providing OIDAR services to unregistered NTORs in India must file GSTR-5A by the 20th of the succeeding month.' },
    { item: 'Refund application submission deadline u/s 54(1)', limitRate: '2 Years from Relevant Date', remarks: 'Standard refund claims in RFD-01 must be submitted before 2 years elapse from the specific transaction block Relevant Date.' },
    { item: 'Standard Interest rate on delayed refund u/s 56', limitRate: '6% Per Annum', remarks: 'Applicable automatically if a sanctioned refund is not issued within 60 days from the date of receipt of the complete application.' },
    { item: 'Enhanced Interest rate on delayed refund (Appeal/Decree)', limitRate: '9% Per Annum', remarks: 'Applicable starting from the 61st day following receipt of a post-appeal refund application until actual physical payment.' },
    { item: 'Section 96A interest on failure to export within 3 months', limitRate: '18% Per Annum', remarks: 'Levied u/s Rule 96A if goods are not exported within 15 days after 3 months, or services payment is not received within 15 days after 1 year.' },
    { item: 'Minimum Refund processing cap u/s 54(14)', limitRate: '₹1,000 per Tax Head', remarks: 'No refund is paid under Section 54 if the amount to be disbursed is less than ₹1,000. This is checked per tax head separately (not applicable to excess cash ledger balances).' },
    { item: 'Provisional Refund payout ratio u/s 54(6)', limitRate: '90% of Total Claim', remarks: 'PO can grant a quick provisional refund of up to 90% of the export/SEZ ITC claim amount within 7 days from acknowledgment (requires no prosecution > ₹2.5Cr).' },
    { item: 'Job Work - Input returning timeline limit', limitRate: '1 Year u/s Sec 143(1)', remarks: 'Inputs must be returned or supplied from the job worker\'s premises within 1 year of sending (extendable by the Commissioner for 1 year).' },
    { item: 'Job Work - Capital goods returning timeline limit', limitRate: '3 Years u/s Sec 143(1)', remarks: 'Capital goods (except moulds/dies/tools) must be returned within 3 years of sending (extendable by the Commissioner for 2 years).' },
    { item: 'Job Work - Form GST ITC-04 filing frequency (Major)', limitRate: 'Half-Yearly', remarks: 'Filing required twice a year (by 25th October and 25th April) if the principal\'s preceding aggregate turnover exceeds ₹5 Crore.' },
    { item: 'Job Work - Form GST ITC-04 filing frequency (Standard)', limitRate: 'Annually', remarks: 'Filing required once a year (by 25th April) if the principal\'s preceding aggregate turnover is within ₹5 Crore.' },
    { item: 'Job Work - Inter-state E-way Bill compulsory threshold', limitRate: 'Any Value (₹0 threshold)', remarks: 'E-way bill is compulsorily required for any inter-State movement from a registered principal to a job worker u/s Rule 138.' },
    { item: 'Provisional Assessment - final order timeline limit', limitRate: '6 Months u/s Sec 60(1)', remarks: 'PO must issue the final order within 6 months of provisional payment approval (extendable by JC/ADC for 6 months and by Commissioner for 4 years).' },
    { item: 'Best Judgment (Non-Filers) - return filing window for order withdrawal', limitRate: '60 Days u/s Sec 62(2)', remarks: 'Best judgment order stands automatically withdrawn if the non-filer submits valid GSTR-3B/GSTR-10 returns within 60 days of order service.' },
    { item: 'Best Judgment / Assessment - statutory order issue deadline', limitRate: '5 Years u/s Sec 62(1) / 63', remarks: 'PO best judgment assessment orders u/s 62 or 63 must be issued within 5 years from the GSTR-9 annual return due date.' },
    { item: 'Departmental Audit - pre-commencement notice timeline', limitRate: '15 Working Days u/s Sec 65(1)', remarks: 'PO must serve a written audit notice to the registered taxpayer at least 15 working days prior to audit commencement.' },
    { item: 'Departmental Audit - statutory completion timeline limit', limitRate: '3 Months u/s Sec 65(4)', remarks: 'The audit must be completed within 3 months of commencement, with potential Commissioner extension up to 6 months.' },
    { item: 'Special Audit - statutory completion timeline limit', limitRate: '90 Days u/s Sec 66(2)', remarks: 'CA/Cost Accountant must submit the signed audit report within 90 days, with potential PO extension up to another 90 days.' },
    { item: 'Search & Seizure - return of seized goods on notice failure', limitRate: '6 Months u/s Sec 67(7)', remarks: 'All seized goods must be returned if the department fails to serve a Show Cause Notice within 6 months of seizure (extendable for 6 more months).' },
    { item: 'Statutory Arrest - monetary evasion threshold u/s Sec 69', limitRate: '₹2 Crore', remarks: 'Commissioner can authorize arrest of any person committing specified serious offences where tax evasion/fake ITC exceeds ₹2 Crore (not applicable to repeat offenders).' },
    { item: 'Arrest - bailable vs non-bailable threshold u/s Sec 132', limitRate: '₹5 Crore', remarks: 'Offences are cognizable and non-bailable where evasion/fake ITC exceeds ₹5 Crore. Below ₹5 Crore, they are non-cognizable and bailable.' },
    { item: 'Arrested Person - Magistrate presentation window limit', limitRate: '24 Hours u/s Sec 57 CrPC', remarks: 'Arrested individuals must be presented u/s 56/57 of CrPC before a Judicial Magistrate within 24 hours of arrest (excluding journey time).' },
    { item: 'Summons / Non-appearance - statutory fine cap u/s Sec 122(3)(d)', limitRate: '₹25,000', remarks: 'Failure to attend or provide true statements in response to a summons carries an administrative penalty up to ₹25,000.' },
    { item: 'Access to Premises - record submission timeline limit', limitRate: '15 Working Days u/s Sec 71(1)', remarks: 'Audited financial accounts, trial balances, and cost/tax audit reports must be provided by the person-in-charge within 15 working days.' },
    { item: 'Demands - SCN minimum threshold exclusion', limitRate: '₹1,000 u/s Sec 74A', remarks: 'No Show Cause Notice can be issued by the Proper Officer if the short-payment or wrongfully availed ITC is under ₹1,000 in a financial year.' },
    { item: 'Demands - SCN limitation deadline u/s Sec 74A(2)', limitRate: '42 Months', remarks: 'SCN under Section 74A for both fraud and non-fraud cases must be issued within 42 months (3.5 years) from GSTR-9 due date.' },
    { item: 'Demands - final order timeline u/s Sec 74A(7)', limitRate: '12 Months', remarks: 'Proper Officer must issue the final adjudication order within 12 months (1 year) of SCN (extendable by senior officers u/s JC rank for up to 6 months).' },
    { item: 'Demands - voluntary payment SCN waiver grace period', limitRate: '60 Days u/s Sec 74A', remarks: 'Full penalty waiver is granted in non-fraud cases if unpaid tax and interest are paid within 60 days of the SCN service.' },
    { item: 'Voluntary Fraud Penalty (Pre-SCN)', limitRate: '15% of Tax Due', remarks: 'Penalty is reduced to 15% u/s 74A(9)(i) if tax, interest, and penalty are paid voluntarily prior to SCN service.' },
    { item: 'Voluntary Fraud Penalty (Post-SCN / Pre-Order)', limitRate: '25% of Tax Due', remarks: 'Penalty is reduced to 25% u/s 74A(9)(ii) if paid with interest within 60 days of the SCN service.' },
    { item: 'Voluntary Fraud Penalty (Post-Order)', limitRate: '50% of Tax Due', remarks: 'Penalty is reduced to 50% u/s 74A(9)(iii) if paid with interest within 60 days of receiving the order.' },
    { item: 'Demands - default self-assessed penalty u/s Sec 74A(11)', limitRate: '10% of Tax or ₹10,000', remarks: 'Mandatorily imposed if self-assessed tax or tax collected is unpaid beyond 30 days of due date (whichever is higher, no option of waiver).' },
    { item: 'Recovery - voluntary payment grace period u/s Sec 78', limitRate: '3 Months', remarks: 'Adjudged dues must be paid within 3 months of order service before coercive recovery modes under Section 79 are commenced.' },
    { item: 'Recovery - instalment period limit u/s Sec 80', limitRate: '24 Months', remarks: 'Commissioner can permit paying adjudged tax, interest, and penalty u/s 80 in up to 24 monthly instalments.' },
    { item: 'Recovery - instalment minimum default u/s Sec 80', limitRate: '₹25,000', remarks: 'Payment in instalments can only be requested if the outstanding tax liability is at least ₹25,000.' },
    { item: 'Provisional Attachment - statutory validity u/s Sec 83(2)', limitRate: '1 Year', remarks: 'Provisional freezing of properties and bank accounts to safeguard revenue automatically ceases after 1 year from order date.' },
    { item: 'Corporate - Liquidator notice obligation u/s Sec 88(1)', limitRate: '30 Days', remarks: 'Winding-up receiver/liquidator is legally required to notify the Commissioner of their appointment within 30 days.' },
    { item: 'Corporate - Commissioner liquidation estimation timeline u/s Sec 88(2)', limitRate: '3 Months', remarks: 'Commissioner must notify the liquidator of the estimated tax liabilities of the company within 3 months of receiving notice u/s 88(1).' },
    { item: 'Partnership - Retiring Partner notice timeline u/s Sec 90(2)', limitRate: '1 Month', remarks: 'Retiring partner must intimate date of retirement to Commissioner within 1 month. If delayed, joint and several liability persists till date of notice receipt.' },
    { item: 'Offences - General Penalty standard limit u/s Sec 125', limitRate: '₹25,000', remarks: 'Maximum residual penalty that can be levied u/s 125 for any contravention of the Act or Rules with no specific penalty.' },
    { item: 'Offences - Minor Breaches threshold u/s Sec 126(1)', limitRate: '₹5,000', remarks: 'No penalty u/s 126 can be imposed for minor breaches with tax involved under ₹5,000, or easily rectifiable documentation mistakes.' },
    { item: 'Transit - detention notice & order timeline limits u/s Sec 129(3)', limitRate: '7 Days Each', remarks: 'Proper Officer must issue detention notice within 7 days of seizure and final adjudication order within another 7 days of service.' },
    { item: 'Transit - post-seizure penalty non-payment sale window u/s Sec 129(6)', limitRate: '15 Days', remarks: 'Detained goods or vehicle can be sold/liquidated u/s 129(6) if adjudged penalty is unpaid for 15 days (period can be reduced by PO for perishables).' },
    { item: 'Transit - transporter conveyance release cap u/s Sec 129(6)', limitRate: '₹1,00,000', remarks: 'Transporter can secure release of conveying vehicle alone upon payment of adjudged transit penalty or ₹1,00,000 CGST+SGST, whichever is less.' },
    { item: 'Compounding - statutory fee limits u/s Sec 138(2)', limitRate: '25% to 100% of Tax', remarks: 'Compounding of criminal charges is subject to payment of a compounding amount u/s 138 between 25% (minimum) and 100% (maximum) of tax involved.' },
    { item: 'Ethics - stock claims certification threshold u/s Sec 18(1)', limitRate: '₹2,00,000', remarks: 'ITC declarations on inputs in stock (Form GST ITC-01) must be certified by a practicing CA/Cost Accountant if the claim exceeds ₹2,00,000.' },
    { item: 'Ethics - unjust enrichment refund certificate ceiling u/s Sec 54', limitRate: '₹2,00,000', remarks: 'Refund applications exceeding ₹2,00,000 must include a certificate in Annexure 2 from a practicing CA/Cost Accountant proving no unjust enrichment.' },
    { item: 'Appeals - Taxpayer filing timeline u/s Sec 107(1)', limitRate: '3 Months', remarks: 'Appeal must be filed in form GST APL-01 within 3 months of the date of communication of the order (AA can condone 1 month delay).' },
    { item: 'Appeals - Departmental review application window u/s Sec 107(2)', limitRate: '6 Months', remarks: 'Commissioner can review subordinate orders and direct filing of an appeal within 6 months of communication (condonable by 1 month).' },
    { item: 'Appeals - Taxpayer mandatory pre-deposit ratio u/s Sec 107(6)', limitRate: '10% of Disputed Tax', remarks: 'Taxpayer must pay the fully admitted liability, plus 10% of the disputed tax amount to stay recovery of the remaining 90% balance.' },
    { item: 'Appeals - Pre-deposit maximum cap u/s Sec 107(6)', limitRate: '₹20 Crore', remarks: 'The 10% disputed tax pre-deposit is subject to a maximum cap of ₹20 Crore CGST and ₹20 Crore SGST (combined ₹40 Crore IGST).' },
    { item: 'Appeals - Transit detention appeal pre-deposit ratio u/s Sec 107(6) Proviso', limitRate: '25% of Penalty u/s 129(3)', remarks: 'No appeal can be filed against a transit detention order u/s 129(3) unless the taxpayer pre-deposits 25% of the adjudged penalty.' },
    { item: 'Appeals - Revisional Authority revision window u/s Sec 108(2)', limitRate: '6 Months to 3 Years', remarks: 'RA can examine records and revise orders only after 6 months of communication, but before 3 years elapse.' },
    { item: 'Appeals - GSTAT taxpayer appeal filing timeline u/s Sec 112(1)', limitRate: '3 Months', remarks: 'Taxpayers can file GSTAT appeals in Form APL-05 within 3 months of order communication (GSTAT can condone up to 3 months of delay).' },
    { item: 'Appeals - GSTAT taxpayer pre-deposit ratio u/s Sec 112(8)', limitRate: '10% of Disputed Tax', remarks: 'Paid in addition to the 10% deposited before AA (making it cumulative 20% tax pre-deposit).' },
    { item: 'Appeals - GSTAT pre-deposit maximum cap u/s Sec 112(8)', limitRate: '₹20 Crore', remarks: 'The GSTAT 10% disputed tax pre-deposit is subject to a maximum cap of ₹20 Crore CGST and ₹20 Crore SGST (combined ₹40 Crore IGST).' },
    { item: 'Appeals - GSTAT cross-objections filing window u/s Sec 112(6)', limitRate: '45 Days', remarks: 'Respondent must submit memorandum of cross-objections in Form APL-06 within 45 days (extendable by 45 days).' },
    { item: 'Appeals - GSTAT discretionary admission minimum threshold u/s Sec 112(1)', limitRate: '₹50,000', remarks: 'GSTAT has absolute discretion to refuse admitting an appeal if the tax, ITC, fine, fee, or penalty in dispute does not exceed ₹50,000.' },
    { item: 'Appeals - GSTAT single Member bench threshold u/s Sec 109(9)', limitRate: '₹50 Lakh', remarks: 'GSTAT appeals can be heard by a single Member if the tax, ITC, or penalty involved does not exceed ₹50 Lakh and has no question of law.' },
    { item: 'Appeals - GSTAT mistake rectification timeline u/s Sec 113(3)', limitRate: '3 Months', remarks: 'GSTAT can rectify mistakes apparent on face of record within 3 months of the order date.' },
    { item: 'Appeals - High Court appeal filing window u/s Sec 117(1)', limitRate: '180 Days', remarks: 'Appeals against State Bench orders involving a substantial question of law must be filed within 180 days of order receipt.' },
    { item: 'Appeals - Department GSTAT appeal monetary limit u/s Sec 120', limitRate: '₹20 Lakh', remarks: 'Department cannot appeal GSTAT if the disputed tax/penalty is under ₹20 Lakh (unless excluded on merits).' },
    { item: 'Appeals - Department High Court appeal monetary limit u/s Sec 120', limitRate: '₹1 Crore', remarks: 'Department cannot appeal High Court if the disputed tax/penalty is under ₹1 Crore (unless excluded on merits).' },
    { item: 'Appeals - Department Supreme Court appeal monetary limit u/s Sec 120', limitRate: '₹2 Crore', remarks: 'Department cannot appeal Supreme Court if the disputed tax/penalty is under ₹2 Crore (unless excluded on merits).' },
    { item: 'Advance Ruling - AAR pronouncement timeline u/s Sec 98(6)', limitRate: '90 Days', remarks: 'AAR must pronounce its final advance ruling in writing within 90 days of admission of the application.' },
    { item: 'Advance Ruling - AAAR appeal filing window u/s Sec 100(1)', limitRate: '30 Days', remarks: 'Aggrieved taxpayer or department can appeal to AAAR within 30 days of communicating AAR order (condonable by 30 days).' },
    { item: 'Advance Ruling - AAAR order pass timeline u/s Sec 101(2)', limitRate: '90 Days', remarks: 'AAAR must pronounce its final appeal order within 90 days of filing of appeal.' },
    { item: 'Advance Ruling - Mistake rectification timeline u/s Sec 102', limitRate: '6 Months', remarks: 'AAR or AAAR can rectify errors apparent from record within 6 months of order date.' },
    { item: 'Advance Ruling - AAR application filing fee u/s Sec 97(1)', limitRate: '₹10,000', remarks: '₹5,000 CGST + ₹5,000 SGST must be paid electronically on the common portal.' },
    { item: 'Advance Ruling - AAAR appeal filing fee u/s Sec 100', limitRate: '₹20,000', remarks: '₹10,000 CGST + ₹10,000 SGST must be paid electronically by the taxpayer. No fee is payable by the Department.' },
    { item: 'Miscellaneous - Corporate Debtor new registration timeline u/s Sec 148', limitRate: '30 Days', remarks: 'Insolvency debtors under CIRP must register as a distinct person within 30 days of IRP/RP appointment.' },
    { item: 'Miscellaneous - General mistake rectification limit u/s Sec 161', limitRate: '6 Months', remarks: 'Any tax authority can rectify an error apparent on face of record within 6 months of issue.' },
    { item: 'Miscellaneous - Error notification filing window u/s Sec 161', limitRate: '3 Months', remarks: 'Affected taxpayer can bring mistake to officer notice within 3 months of order date.' },
    { item: 'Miscellaneous - Anti-profiteering default penalty window u/s Sec 171', limitRate: '30 Days', remarks: '10% penalty of the profiteered amount is levied if not deposited within 30 days of the GSTAT order.' },
    { item: 'Miscellaneous - Anti-profiteering sunset timeline u/s Sec 171', limitRate: '01.04.2025', remarks: 'No new applications/requests for examining anti-profiteering are accepted on or after April 1, 2025.' },
    { item: 'Miscellaneous - Rounding off consolidation rule u/s Sec 170', limitRate: 'Nearest Rupee', remarks: 'All tax, interest, penalty, fine, or refund calculations must be rounded off to the nearest rupee (paise >= 50 raised, paise < 50 ignored).' },
    { item: 'Customs - Ad-hoc special order exemption statutory limit u/s Sec 25(2)', limitRate: '₹100', remarks: 'Under Section 25(2), no duty is collected by the Central Government on exceptional ad-hoc order exemptions if the duty does not exceed ₹100.' },
    { item: 'Customs - Notif 45/2017 exported goods repair & re-import window', limitRate: '5 Years', remarks: 'Goods exported for repairs must be re-imported within 5 years (extendable by further 2 years) to pay duty on repair value only.' },
    { item: 'Customs - Notif 45/2017 re-import repair window (Bhutan)', limitRate: '7 Years', remarks: 'Goods exported to Bhutan for repairs must be re-imported within 7 years (extendable by further 3 years) for machinery and equipment.' },
    { item: 'Customs - Notif 158/95 India goods re-import for repairs timeline', limitRate: '3 Years', remarks: 'Indian manufactured goods re-imported for repairs must be brought back within 3 years of export (10 years for Nepal/Bhutan) and re-exported.' },
    { item: 'Customs - Notif 158/95 specified goods re-import for repairs timeline', limitRate: '7 Years', remarks: 'Specifically notified Indian goods re-imported for repairs must be brought back within 7 years of export (10 years for Nepal/Bhutan).' },
    { item: 'Customs - Notif 158/95 re-imported goods re-export deadline', limitRate: '6 Months', remarks: 'Re-imported goods under Notif 158/95 must be re-exported within 6 months of re-import (extendable by customs up to 1 year).' },
    { item: 'Customs - IGCR 2022 job work maximum processing period', limitRate: '1 Year', remarks: 'Imported inputs sent to job workers under IGCR rules must be processed and returned or cleared within 1 year of invoice date.' },
    { item: 'Customs - IGCR 2022 Quarterly Statement filing deadline', limitRate: '10th of Next Quarter', remarks: 'Compulsory electronic submission of the quarterly consumption and use statement on the common portal by the 10th day of the following quarter.' },
    { item: 'Customs - IGCR 2022 unutilised or defective goods disposal window', limitRate: '1 Year', remarks: 'Importer has an option to either re-export or clear unutilised/defective goods for home consumption within 1 year of import (extendable by 3 months).' },
    { item: 'Customs - IGCR 2022 capital goods depreciation rate (1st Year)', limitRate: '4% / Quarter', remarks: 'Straight-line depreciation of capital goods allowed for every quarter or part thereof in the first year.' },
    { item: 'Customs - IGCR 2022 capital goods depreciation rate (2nd & 3rd Year)', limitRate: '3% / Quarter', remarks: 'Straight-line depreciation of capital goods allowed for every quarter or part thereof in the second and third years.' },
    { item: 'Customs - IGCR 2022 capital goods depreciation rate (4th & 5th Year)', limitRate: '2.5% / Quarter', remarks: 'Straight-line depreciation of capital goods allowed for every quarter or part thereof in the fourth and fifth years.' },
    { item: 'Customs - IGCR 2022 capital goods depreciation rate (Thereafter)', limitRate: '2% / Quarter', remarks: 'Straight-line depreciation of capital goods allowed for every quarter or part thereof after 5 years.' },
    { item: 'Customs - Safeguard measures initial duration limit u/s Sec 8B CTA', limitRate: '4 Years', remarks: 'Safeguard duty or tariff quotas remain in force for an initial period of 4 years unless extended.' },
    { item: 'Customs - Safeguard measures total duration ceiling u/s Sec 8B CTA', limitRate: '10 Years', remarks: 'Maximum cumulative period for safeguard measures (including initial + extension + any provisional days) cannot exceed 10 years.' },
    { item: 'Customs - Provisional safeguard measures maximum window u/s Sec 8B CTA', limitRate: '200 Days', remarks: 'Central Government can impose provisional safeguard duty on preliminary findings for a maximum of 200 days.' },
    { item: 'Customs - Single developing country safeguard exemption cap u/s Sec 8B', limitRate: '<= 3% of imports', remarks: 'Safeguard measures are not imposed on imports of an article originating in a developing country if its share is <= 3% of total imports to India.' },
    { item: 'Customs - Aggregate developing countries safeguard exemption cap u/s Sec 8B', limitRate: '<= 9% of imports', remarks: 'Developing country safeguard exemption is inapplicable if imports of that article from all developing countries with < 3% individual share collectively exceed 9% of total imports.' },
    { item: 'Customs - Anti-Dumping / CVD retrospective levy window u/s Sec 9A(3)', limitRate: '90 Days', remarks: 'Anti-Dumping Duty (ADD) or CVD can be applied retrospectively up to 90 days before provisional duty in cases of massive short-term dumping.' },
    { item: 'Customs - CESTAT Protective Tariff Appeal filing deadline u/s Sec 9C CTA', limitRate: '90 Days', remarks: 'Appeal against safeguard, CVD, or anti-dumping duty determinations must be submitted to CESTAT within 90 days of order.' },
    { item: 'Customs - CESTAT protective tariff substantive appeal fee u/s Sec 9C CTA', limitRate: '₹15,000', remarks: 'Requires a statutory filing fee of ₹15,000 for taxpayer appeals against protective tariff determinations.' },
    { item: 'Customs - CESTAT protective tariff miscellaneous application fee u/s Sec 9C', limitRate: '₹500', remarks: 'Filing fee for stay, restoration, or mistake rectification application u/s safeguard/ADD appeals is ₹500.' },
    { item: 'Customs - Project Imports spares & raw materials value cap u/s Heading 9801', limitRate: '10% of project goods', remarks: 'Heading 9801 CTA limits auxiliary equipment, spares, raw materials, and consumables to 10% of total imported project machinery value.' },
    { item: 'Customs - Air import transport cost statutory maximum limit u/s Rule 10(2)(a)', limitRate: '20% of FOB', remarks: 'When goods are imported by air, the cost of transport, loading, and handling must not exceed 20% of the FOB value of goods.' },
    { item: 'Customs - Non-ascertainable transport cost statutory rate u/s Rule 10(2)(a)', limitRate: '20% of FOB', remarks: 'If actual freight, loading, and handling charges are not ascertainable, they are fixed at 20% of the adjusted FOB value.' },
    { item: 'Customs - Non-ascertainable insurance cost statutory rate u/s Rule 10(2)(b)', limitRate: '1.125% of FOB', remarks: 'If actual marine, war, or transit insurance premium is not ascertainable, it is fixed at 1.125% of the adjusted FOB value.' },
    { item: 'Customs - Unrelated voting shares threshold u/s Rule 2(2) CVR', limitRate: '< 5%', remarks: 'To escape being deemed related persons u/s valuation rules, neither person must hold or control 5% or more of the other’s voting stock.' },
    { item: 'Customs - Import manifest electronic presentation time limit u/s Sec 30', limitRate: 'Prior to arrival', remarks: 'Arrival manifest must be presented electronically prior to the arrival of the vessel or aircraft.' },
    { item: 'Customs - Import report (land vehicle) filing window u/s Sec 30', limitRate: 'Within 12 Hours', remarks: 'Must be delivered to proper customs officer within twelve hours of the vehicle’s arrival in land customs station.' },
    { item: 'Customs - Arrival manifest / report non-delivery penalty limit u/s Sec 30', limitRate: 'Up to ₹50,000', remarks: 'Penalty limit if arrival manifest or import report is not filed within specified time without sufficient cause.' },
    { item: 'Customs - Passenger/crew arrival manifest delayed filing penalty u/s Sec 30A', limitRate: 'Up to ₹50,000', remarks: 'Penalty for delay in presenting passenger and crew arrival manifest or passenger name record (PNR).' },
    { item: 'Customs - Passenger/crew departure manifest delayed filing penalty u/s Sec 41A', limitRate: 'Up to ₹50,000', remarks: 'Penalty for delay in delivering passenger and crew departure manifest or passenger name record (PNR).' },
    { item: 'Customs - Advance Bill of Entry presentation window u/s Sec 46(3)', limitRate: 'Max 30 Days', remarks: 'A Bill of Entry can be presented at any time not exceeding thirty days prior to expected arrival of vessel or aircraft.' },
    { item: 'Customs - Payment interest rate on delayed duty u/s Sec 47(2)', limitRate: '15% p.a.', remarks: 'Imposed if duty is not paid within one day of return of Bill of Entry for payment (min rate: 10%, max rate: 36% p.a.).' },
    { item: 'Customs - Deferred payment due date (1st - 15th BE return)', limitRate: '16th of that month', remarks: 'For eligible AEO (Tier-2/3) importers and public undertakings where Bill of Entry is returned during the first half of a month.' },
    { item: 'Customs - Deferred payment due date (16th - end, other than March)', limitRate: '1st of next month', remarks: 'For eligible importers where Bill of Entry is returned during the second half of any month except March.' },
    { item: 'Customs - Deferred payment due date (16th - 31st March)', limitRate: '31st March', remarks: 'For eligible importers where Bill of Entry is returned during the second half of March, aligning with financial year closing.' },
    { item: 'Customs - Public warehouse non-warehousing storage time limit u/s Sec 49', limitRate: '30 Days', remarks: 'Imported goods pending clearance can be temporarily stored in public warehouse for up to 30 days.' },
    { item: 'Customs - Public warehouse storage extension window u/s Sec 49', limitRate: '30 Days at a time', remarks: 'Principal Commissioner/Commissioner of Customs can extend storage period by 30 days at a time.' },
    { item: 'Customs - Uncleared cargo disposal (auction) threshold u/s Sec 48', limitRate: '30 Days', remarks: 'Custodian can auction imported goods if they are not cleared or warehoused within 30 days of unloading.' },
    { item: 'Customs - Auctioned goods final assessment window u/s Sec 48', limitRate: '15 Days', remarks: 'Proper officer of customs must assess the auctioned goods to duty within 15 days of filing of Bill of Entry.' },
    { item: 'Customs - Provisional assessment finalization statutory deadline u/s Sec 18', limitRate: '2 Years', remarks: 'The proper officer must finalize the duty provisionally assessed within 2 years from the date of the assessment.' },
    { item: 'Customs - Provisional assessment finalization extension ceiling u/s Sec 18', limitRate: '1 Year', remarks: 'Principal Commissioner/Commissioner may extend the finalization deadline by up to 1 year on sufficient cause.' },
    { item: 'Customs - Provisional assessment delayed payment interest u/s Sec 18(3)', limitRate: '15% p.a.', remarks: 'Interest on differential duty from consecutive finalization is payable from the first day of the month of provisional assessment.' },
    { item: 'Customs - Warehousing bond multiple of assessed duty u/s Sec 59', limitRate: '3x (Thrice) duty', remarks: 'Binds the importer to pay three times (300%) the amount of total customs duty assessed on the imported goods.' },
    { item: 'Customs - General under-bond cargo storing period u/s Sec 61', limitRate: '1 Year', remarks: 'Other than manufacturing inputs, warehoused goods are permitted to remain for up to 1 year (extension 1 year at a time).' },
    { item: 'Customs - Warehoused goods interest-free deferred payment window u/s Sec 61(2)', limitRate: '90 Days', remarks: 'Interest begins to accrue only after goods remain warehoused beyond a free period of 90 days.' },
    { item: 'Customs - Warehoused goods deferred duty interest rate u/s Sec 61(2)', limitRate: '15% p.a.', remarks: 'Charged on the duty deferred beyond 90 days till the actual date of clearance for home consumption.' },
    { item: 'Customs - Private warehouse record preservation period u/s Sec 73A', limitRate: '5 Years', remarks: 'Licensee must maintain and preserve paper/digital records of receipts and removals for at least 5 years.' },
    { item: 'Customs - Return of goods on license cancellation time limit u/s Sec 58B', limitRate: '7 Days', remarks: 'On cancellation of warehousing license, goods must be removed to another warehouse or cleared within 7 days.' },
    { item: 'Customs - Refund claim statutory filing deadline u/s Sec 27(1)', limitRate: '1 Year', remarks: 'Application for refund of customs duty or interest must be filed within 1 year from the date of payment.' },
    { item: 'Customs - Special exemption refund claim timeline u/s Sec 27(1B)', limitRate: '1 Year', remarks: 'Refund of duty arising from special exemptions u/s 25(2) or court judgments must be filed within 1 year of its issue.' },
    { item: 'Customs - Refund claim minimum monetary floor limit u/s Sec 27', limitRate: '₹100', remarks: 'No refund of customs duty or interest shall be granted if the claimed amount is less than ₹100.' },
    { item: 'Customs - Delayed refund interest-free processing limit u/s Sec 27A', limitRate: '3 Months', remarks: 'No interest is payable if the refund is processed and paid within three months from the date of a complete application.' },
    { item: 'Customs - Delayed refund interest payable rate u/s Sec 27A', limitRate: '6% p.a.', remarks: 'Triggered from day following three months from refund application date till actual date of refund (not below 5%, max 30% p.a.).' },
    { item: 'Customs - Re-imported rejected goods export duty refund window u/s Sec 26', limitRate: '1 Year', remarks: 'Goods exported on duty must be re-imported within 1 year from date of export without resale for a refund.' },
    { item: 'Customs - Defective/non-conforming goods export or destruction window u/s Sec 26A', limitRate: '30 Days', remarks: 'Defective goods must be exported, relinquished to customs, or destroyed within 30 days of home clearance.' },
    { item: 'Customs - Defective goods export/destruction extension limit u/s Sec 26A', limitRate: '3 Months', remarks: 'Principal Commissioner/Commissioner of Customs can extend the 30-day export/destruction window by up to 3 months.' },
    { item: 'Customs - Defective goods import duty refund application window u/s Sec 26A', limitRate: '6 Months', remarks: 'Claim for refund of import duty on defective goods must be submitted before the expiry of 6 months from the relevant date.' }
  ],
  ...INTERMEDIATE_LIMITS_RATES,
  ...FOUNDATION_LIMITS_RATES,
  ...CMA_LIMITS_RATES
};
