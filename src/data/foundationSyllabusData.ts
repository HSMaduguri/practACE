/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChapterSummary,
  FormulaItem,
  FoundationSubjectId,
  LimitRateItem,
  StatutorySection,
  SubjectInfo,
} from '../types';

export const FOUNDATION_SUBJECTS_METADATA: Record<FoundationSubjectId, SubjectInfo> = {
  Accounts: {
    id: 'Accounts',
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
      'Company Accounts (Issue of Shares, Debentures, Forfeiture)',
    ],
    hasSections: false,
    hasLimits: false,
    hasFormulas: true,
    hasStandards: false,
    group: 'Unified',
    paperNumber: 'Paper 1',
    level: 'foundation',
  },
  Law: {
    id: 'Law',
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
      'The Negotiable Instruments Act 1881',
    ],
    hasSections: true,
    hasLimits: true,
    hasFormulas: false,
    hasStandards: false,
    group: 'Unified',
    paperNumber: 'Paper 2',
    level: 'foundation',
  },
  MathStats: {
    id: 'MathStats',
    name: 'Quantitative Aptitude',
    fullName: 'Quantitative Aptitude — Maths, LR & Stats (Paper 3)',
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
      'Index Numbers',
    ],
    hasSections: false,
    hasLimits: false,
    hasFormulas: true,
    hasStandards: false,
    group: 'Unified',
    paperNumber: 'Paper 3',
    level: 'foundation',
  },
  Econ: {
    id: 'Econ',
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
      'Indian Economy: Pre & Post Liberalisation',
    ],
    hasSections: false,
    hasLimits: false,
    hasFormulas: true,
    hasStandards: false,
    group: 'Unified',
    paperNumber: 'Paper 4',
    level: 'foundation',
  },
};

export const FOUNDATION_CHAPTER_SUMMARIES: Record<FoundationSubjectId, ChapterSummary[]> = {
  Accounts: [
    {
      chapterName: 'Theoretical Framework & Accounting Standards',
      keyPrinciples: [
        {
          title: 'Fundamental Accounting Assumptions (GCA)',
          description: 'Three baseline assumptions govern financial statements: Going Concern (enterprise continues for foreseeable future), Consistency (uniform accounting policies across periods), and Accrual (transactions recorded when earned/incurred, not when cash moves).',
          exception: 'If any fundamental assumption is NOT followed, explicit disclosure in financial statement notes is mandatory; otherwise disclosure is unnecessary.',
          example: 'Recognising December rent unpaid until January under P&L reflects Accrual assumption.'
        },
        {
          title: 'Capital vs Revenue Expenditure & Receipts',
          description: 'Capital expenditure creates or enhances earning capacity or yields enduring benefit (>1 accounting year) and appears on the Balance Sheet. Revenue expenditure maintains existing earning capacity within one period and is debited to P&L.',
          exception: 'Preliminary expenses or heavy trial-run repairs before an asset is ready for intended use are capitalised under AS 10; subsequent routine repairs are revenue.',
          example: 'Import duty and installation wages on a new CNC machine are Capital; annual oiling charges are Revenue.'
        }
      ],
      visualBreakdown: {
        title: 'Qualitative Characteristics & Conventions Matrix',
        type: 'table',
        headers: ['Concept', 'Core Mandate', 'Exam Application'],
        rows: [
          ['Conservatism / Prudence', 'Provide all probable losses; ignore unrealised gains', 'Inventory valued at Lower of Cost or NRV'],
          ['Materiality', 'Disclose items capable of altering user decisions', 'Small calculators written off immediately'],
          ['Substance Over Form', 'Economic reality overrides legal form', 'Finance lease assets capitalised in lessee books'],
          ['Matching Principle', 'Match period revenues against corresponding costs', 'Prepaid insurance excluded from current P&L']
        ]
      }
    },
    {
      chapterName: 'Accounting Process (Journals, Ledgers, Trial Balance)',
      keyPrinciples: [
        {
          title: 'Rectification of Errors (Before vs After Trial Balance)',
          description: 'Two-sided errors (omission, commission, principle, compensating) do not affect Trial Balance agreement and are fixed via direct journal entry. One-sided errors uncovered after Trial Balance require the Suspense Account.',
          exception: 'Errors discovered in the next accounting year affecting nominal accounts (Income/Expense) must be routed through Profit & Loss Adjustment Account instead of individual nominal heads.',
          example: 'Purchase of Machinery ₹50,000 debited to Purchases A/c is an Error of Principle: rectified by Dr Machinery A/c / Cr Purchases A/c (same year) or Cr P&L Adjustment A/c (subsequent year).'
        }
      ]
    },
    {
      chapterName: 'Bank Reconciliation Statement (BRS)',
      keyPrinciples: [
        {
          title: 'Timing & Error Reconciliation Logic',
          description: 'Reconciles Cash Book (Bank Column) balance with Pass Book (Bank Statement) balance caused by cheques issued but not presented, cheques deposited but not cleared, direct bank debits/credits, and casting errors.',
          exception: 'Overdraft (Cr balance in Cash Book / Dr balance in Pass Book) reverses the sign of every addition/subtraction rule relative to favourable balances.',
          example: 'Adjusted Cash Book first absorbs omitted bank charges, dishonoured cheques, and direct customer deposits before preparing final BRS solely for unpresented and uncollected cheques.'
        }
      ]
    },
    {
      chapterName: 'Inventories Valuation',
      keyPrinciples: [
        {
          title: 'AS 2 Valuation Rule & Inventory Taking Adjustments',
          description: 'Inventories are valued at lower of Historical Cost and Net Realisable Value (NRV) on an item-by-item basis. Stock reconciliation backward/forward adjusts physical count at an earlier/later date by deducting/adding gross margin on interim sales and purchases.',
          exception: 'Goods sent on consignment or sale-or-return basis (lying unsold with customer before approval expiry) must be added back to closing stock at cost.',
          example: 'Closing stock taken on 7 April ₹2,40,000 requires adding back Cost of Goods Sold during 1–7 April and deducting purchases received during 1–7 April.'
        }
      ]
    },
    {
      chapterName: 'Depreciation and Amortisation',
      keyPrinciples: [
        {
          title: 'SLM, WDV, Units of Production & Change in Method (AS 10)',
          description: 'Depreciation allocates depreciable amount (Cost minus Residual Value) systematically over useful life. Change in depreciation method, useful life, or residual value is treated prospectively as a change in accounting estimate.',
          exception: 'Land generally has unlimited useful life and is NOT depreciated, whereas buildings situated on land are depreciated separately.',
          example: 'Under WDV when Provision for Depreciation A/c is maintained, Asset A/c stays at original cost until disposal; accumulated depreciation moves out only upon sale.'
        }
      ]
    },
    {
      chapterName: 'Bills of Exchange and Promissory Notes',
      keyPrinciples: [
        {
          title: 'Due Date, Grace Days & Dishonour Accounting',
          description: 'Under Negotiable Instruments Act 1881, term bills earn 3 statutory days of grace. When maturity falls on a public holiday, due date shifts to the preceding business day; emergency holiday shifts to the succeeding business day.',
          exception: 'Accommodation bills involve mutual fund-raising without underlying trade consideration; discounting charges are shared strictly in the ratio of funds actually utilised.',
          example: 'If an endorsed bill is dishonoured on due date, Drawer debits Acceptor and credits Endorsee for Bill Amount plus Noting Charges.'
        }
      ]
    },
    {
      chapterName: 'Preparation of Final Accounts of Sole Proprietors',
      keyPrinciples: [
        {
          title: 'Trading, Profit & Loss & Marshalling of Balance Sheet',
          description: 'Trading Account captures direct manufacturing/trading costs to determine Gross Profit; P&L Account reflects indirect admin/selling/finance expenses. Year-end adjustments always receive dual effect (Income Statement + Balance Sheet).',
          exception: 'Managerial commission payable at X% on net profit AFTER charging such commission uses formula: Profit Before Commission × X / (100 + X).',
          example: 'Further Bad Debts written off in adjustment are first deducted from Sundry Debtors before computing New Provision for Doubtful Debts.'
        }
      ]
    },
    {
      chapterName: 'Financial Statements of Not-for-Profit Organisations (NPO)',
      keyPrinciples: [
        {
          title: 'Receipts & Payments vs Income & Expenditure & Fund Accounting',
          description: 'Receipts & Payments is a cash summary regardless of period or nature. Income & Expenditure is accrual-based for the current year only. Specific funds (e.g., Prize Fund, Building Fund) take direct additions and deductions on the Balance Sheet.',
          exception: 'If specific fund expenses exceed the fund balance + fund income, the net deficit transfers to the debit side of Income & Expenditure A/c.',
          example: 'Subscription Income = Cash Received + Closing Outstanding − Opening Outstanding + Opening Advance − Closing Advance.'
        }
      ]
    },
    {
      chapterName: 'Accounts from Incomplete Records (Single Entry)',
      keyPrinciples: [
        {
          title: 'Statement of Affairs & Conversion Method',
          description: 'Net Worth Method computes profit as Closing Capital + Drawings − Additional Capital − Opening Capital. Conversion Method reconstructs Total Debtors, Total Creditors, Bills Receivable, Bills Payable, and Cash Book to derive Credit Sales & Credit Purchases.',
          exception: 'Bad debts recovered or discount disallowed do not reduce Debtors directly unless routed properly through memorandum accounts.',
          example: 'Closing Capital ₹4,80,000 + Drawings ₹60,000 − Fresh Capital ₹50,000 − Opening Capital ₹3,50,000 = Profit ₹1,40,000.'
        }
      ]
    },
    {
      chapterName: 'Partnership Accounts (Admission, Retirement, Death, Dissolution)',
      keyPrinciples: [
        {
          title: 'Sacrificing vs Gaining Ratio & Goodwill Adjustments',
          description: 'Upon admission, incoming partner brings Goodwill premium distributed to sacrificing partners (Old − New Ratio). Upon retirement/death, continuing partners compensate outgoing partner in Gaining Ratio (New − Old Ratio) without raising permanent Goodwill in books per AS 26.',
          exception: 'Joint Life Policy (JLP) surrender value enters Balance Sheet under Reserve Method; full sum assured accrues on death in PSR.',
          example: 'Revaluation profit/loss always distributes among ALL existing partners in their Old Profit-Sharing Ratio prior to reconstruction.'
        }
      ]
    },
    {
      chapterName: 'Company Accounts (Issue of Shares, Debentures, Forfeiture)',
      keyPrinciples: [
        {
          title: 'Forfeiture, Reissue & Capital Reserve Transfer',
          description: 'On forfeiture, Share Capital is debited strictly with Called-Up Amount (excluding unpaid Securities Premium). Securities Premium already received cannot be reversed upon forfeiture. Maximum permissible discount on reissue equals forfeited amount received on those shares.',
          exception: 'Capital Reserve receives profit on reissue strictly proportional to the number of forfeited shares ACTUALLY reissued: [(Total Forfeited / Shares Forfeited) × Shares Reissued] − Reissue Discount.',
          example: 'Forfeiting 1,000 ₹10 shares (₹7 called, ₹5 paid) Debits Share Capital ₹7,000, Credits Share Forfeiture ₹5,000, Calls-in-Arrears ₹2,000.'
        }
      ]
    }
  ],
  Law: [
    {
      chapterName: 'The Indian Regulatory Framework',
      keyPrinciples: [
        {
          title: 'Law-Making Structure, Regulatory Bodies & Judicial Hierarchy',
          description: 'Explains Primary Legislation (Parliament/State Assemblies) vs Delegated Legislation (Rules/Notifications), Ministries (MCA, MoF), regulators (RBI, SEBI, IBBI), and hierarchy from District/High Courts up to Supreme Court.',
          exception: 'SEBI regulates capital markets while RBI oversees commercial banking, NBFCs, and foreign exchange (FEMA).',
          example: 'Ministry of Corporate Affairs (MCA) administers Companies Act 2013 and LLP Act 2008 through ROCs.'
        }
      ]
    },
    {
      chapterName: 'The Indian Contract Act 1872: Nature and Offer-Acceptance',
      keyPrinciples: [
        {
          title: 'Offer vs Invitation to Offer & Communication Rules (Sec 2–9)',
          description: 'An offer shows final willingness to be bound upon acceptance, whereas an Invitation to Offer (price tags, prospectuses, menus, auction catalogues) invites others to make an offer. Acceptance is complete against offeror when put in course of transmission, and against acceptor when received by offeror.',
          exception: 'Cross-offers made independently in ignorance of each other do NOT create a binding contract (Tinn v. Hoffman); a counter-offer terminates the original offer (Hyde v. Wrench).',
          example: 'Display of goods with price tag in a self-service store is an Invitation to Offer; customer picking it to cash counter makes the offer (Pharmaceutical Society v. Boots).'
        }
      ],
      visualBreakdown: {
        title: 'Essentials of Valid Contract (Sec 10)',
        type: 'flow',
        content: 'Offer + Acceptance (Sec 2) -> Lawful Consideration (Sec 2(d)) -> Competent Parties (Sec 11-12) -> Free Consent (Sec 13-22) -> Lawful Object (Sec 23) -> Not Expressly Declared Void (Sec 24-30)'
      }
    },
    {
      chapterName: 'The Indian Contract Act 1872: Consideration & Capacity',
      keyPrinciples: [
        {
          title: 'Privity, Past Consideration Exceptions (Sec 25) & Minor Rules (Sec 11)',
          description: 'Agreement without consideration is void unless covered by Sec 25 exceptions: Natural love & affection (written + registered + near relation), past voluntary services, time-barred debt promise, completed gift, agency, or charity promise acted upon.',
          exception: 'Agreement with a minor is void-ab-initio (Mohori Bibee v. Dharmodas Ghose); cannot be ratified on majority, though minor’s ESTATE is liable for necessaries supplied u/s 68.',
          example: 'A minor can be a beneficiary or payee under a promissory note or admitted to benefits of partnership u/s 30, without personal liability.'
        }
      ]
    },
    {
      chapterName: 'The Indian Contract Act 1872: Free Consent & Void Agreements',
      keyPrinciples: [
        {
          title: 'Coercion, Undue Influence, Fraud, Misrepresentation & Mistake',
          description: 'Consent vitiated by Coercion (Sec 15), Undue Influence (Sec 16), Fraud (Sec 17), or Misrepresentation (Sec 18) renders contract Voidable at the aggrieved party’s option. Bilateral mistake of essential fact (Sec 20) makes it Void.',
          exception: 'Mere silence is NOT fraud unless there is a legal duty to speak (fiduciary relationship, contracts uberrimae fidei like insurance) or silence itself equals speech.',
          example: 'Mistake as to Indian law is NOT an excuse (Ignorantia juris non excusat), whereas mistake of Foreign law equates to Mistake of Fact.'
        }
      ]
    },
    {
      chapterName: 'The Indian Contract Act 1872: Performance & Breach',
      keyPrinciples: [
        {
          title: 'Discharge, Supervening Impossibility (Sec 56) & Remedies (Sec 73–75)',
          description: 'Anticipatory breach allows promisee either to sue immediately or keep contract alive till due date. Hadley v. Baxendale limits damages to ordinary/contemplated losses—excluding remote losses. Sec 74 caps liquidated damages/penalty to reasonable compensation within named ceiling.',
          exception: 'Commercial difficulty, price surge, or strikes by employees do NOT discharge a contract under Sec 56 doctrine of frustration.',
          example: 'Contract to rent a concert hall becomes void u/s 56 if hall burns down accidentally prior to event date.'
        }
      ]
    },
    {
      chapterName: 'The Sale of Goods Act 1930: Formation & Conditions-Warranties',
      keyPrinciples: [
        {
          title: 'Conditions vs Warranties (Sec 12–17) & Caveat Emptor',
          description: 'Condition is an essential stipulation going to root (breach gives repudiation + damages); Warranty is collateral (breach yields damages only). Caveat Emptor ("let the buyer beware") reverses when buyer relies on seller’s skill & judgment for fitness/merchantable quality.',
          exception: 'In sale by sample AND description, bulk must match BOTH sample and description (Sec 15).',
          example: 'Selling adulterated milk makes seller liable under implied condition as to wholesomeness even without express guarantee.'
        }
      ]
    },
    {
      chapterName: 'The Sale of Goods Act 1930: Transfer of Ownership & Unpaid Seller',
      keyPrinciples: [
        {
          title: 'Nemo Dat Quod Non Habet & Unpaid Seller Rights (Sec 45–54)',
          description: 'Risk prima facie passes with property (ownership), not delivery. An unpaid seller retains Right of Lien (while in possession), Stoppage in Transit (when buyer becomes insolvent during transit), and Right of Resale (perishable goods or after due notice).',
          exception: 'Nemo dat exceptions protect bona fide buyers purchasing from mercantile agent, joint owner in possession, seller continuing in possession post-sale, or buyer in possession.',
          example: 'Goods delivered on "Sale or Approval" pass ownership upon buyer acceptance, expiry of agreed time, or implied adoption (e.g., pledging goods).'
        }
      ]
    },
    {
      chapterName: 'The Indian Partnership Act 1932',
      keyPrinciples: [
        {
          title: 'True Test of Partnership (Sec 6) & Non-Registration Consequences (Sec 69)',
          description: 'Mutual Agency (each partner acts as both principal and agent for co-partners) is the conclusive test of partnership—sharing profits alone is insufficient. Registration is optional, yet Sec 69 bars an unregistered firm from suing third parties or partners.',
          exception: 'Even an unregistered firm faces NO bar against suing for dissolution, accounts of dissolved firm, realisation of dissolved firm property, or third-party claims up to ₹100.',
          example: 'Partner by Holding Out (Sec 28) is liable to third parties who give credit trusting their representation, though they hold zero share in firm profits.'
        }
      ]
    },
    {
      chapterName: 'The Limited Liability Partnership Act 2008',
      keyPrinciples: [
        {
          title: 'Body Corporate Hybrid, Designated Partners & Partner Liability',
          description: 'LLP enjoys separate legal entity, perpetual succession, and partner liability limited to agreed contribution without upper limit on maximum partners. Minimum 2 partners & 2 Designated Partners (at least 1 resident in India for >=120 days).',
          exception: 'Unlimited liability pierces protection if LLP is carried on with intent to defraud creditors (Sec 30).',
          example: 'Annual compliance mandates Form 11 (Annual Return within 60 days of FY end) and Form 8 (Statement of Account & Solvency within 30 days from expiry of 6 months).'
        }
      ]
    },
    {
      chapterName: 'The Companies Act 2013 (Basics & Incorporation)',
      keyPrinciples: [
        {
          title: 'Corporate Veil (Salomon Rule), Classification & Doctrines',
          description: 'Company is an artificial legal person distinct from members. Ultra Vires renders acts beyond Object Clause void; Constructive Notice protects company against outsiders failing to read MOA/AOA; Indoor Management (Turquand Rule) protects bona fide outsiders regarding internal irregularities.',
          exception: 'Indoor Management fails when outsider had actual notice, suspicion prompting inquiry, or relies on forgery (Ruben v. Great Fingall).',
          example: 'Small Company (Sec 2(85)): other than public co, Paid-up Capital <= ₹4 Cr AND Turnover <= ₹40 Cr (excluding holding/subsidiary/Sec 8 co).'
        }
      ]
    },
    {
      chapterName: 'The Negotiable Instruments Act 1881',
      keyPrinciples: [
        {
          title: 'Promissory Note, Bill of Exchange, Cheque & Sec 138 Dishonour',
          description: 'Covers Holder vs Holder in Due Course (HDC — acquires for value, before maturity, in good faith, obtaining defect-free title) and crossing rules (General, Special, Not Negotiable). Sec 138 criminalizes cheque bounce for insufficiency of funds if unpaid within 15 days of demand notice.',
          exception: 'Post-dated cheque bounces attract Sec 138 if presented within 3 months validity from date written on cheque.',
          example: 'Sec 138 timeline: Dishonour -> Notice within 30 days -> Drawer fails to pay within 15 days -> Complaint within 1 month thereafter.'
        }
      ]
    }
  ],
  MathStats: [
    {
      chapterName: 'Mathematics of Finance (Simple & Compound Interest, Annuities)',
      keyPrinciples: [
        {
          title: 'Time Value of Money, Effective Rate & Annuity Valuation',
          description: 'Distinguishes Simple Interest, Compound Interest, Effective Annual Rate [E = (1 + i/k)^k − 1], Annuity Regular (end-of-period payments), Annuity Due (beginning-of-period), Perpetuity (A/i), Sinking Fund, and Net Present Value.',
          exception: 'For Annuity Due, multiply Ordinary Annuity PV/FV factor directly by (1 + i).',
          example: 'Continuous or semi-annual compounding increases effective annual yield above nominal stated interest rate.'
        }
      ]
    },
    {
      chapterName: 'Permutations and Combinations',
      keyPrinciples: [
        {
          title: 'Arrangement (nPr) vs Selection (nCr) & Circular Permutations',
          description: 'Permutation counts ordered arrangements; Combination counts unordered selections. Identical object repetitions divide total by p!q!r!. Circular arrangements fix one position yielding (n−1)! (halved to (n−1)!/2 when clockwise/anticlockwise indistinguishable like beads/garlands).',
          exception: 'Restriction problems ("never together") use Gap Method or Total Minus Always-Together; 0! is always equal to 1.',
          example: 'Handshakes among n persons = nC2; diagonals of an n-sided polygon = nC2 − n.'
        }
      ]
    },
    {
      chapterName: 'Measures of Central Tendency and Dispersion',
      keyPrinciples: [
        {
          title: 'AM, GM, HM Relationships & Shift of Origin / Scale Properties',
          description: 'For positive distinct observations, AM > GM > HM and GM² = AM × HM (two observations). Central tendency measures change with BOTH change of origin (+/−) and scale (×/÷), whereas Dispersion (Range, SD, QD, MD) is independent of origin and scales strictly by |b|.',
          exception: 'Coefficient of Variation (CV = SD/Mean × 100) is unit-free and tests consistency (lower CV = greater consistency).',
          example: 'Empirical relationship for moderately skewed distributions: Mean − Mode = 3(Mean − Median).'
        }
      ]
    },
    {
      chapterName: 'Probability and Expected Value',
      keyPrinciples: [
        {
          title: 'Addition, Conditional Probability & Bayes Theorem',
          description: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Independent events satisfy P(A ∩ B) = P(A)·P(B), whereas mutually exclusive events satisfy P(A ∩ B) = 0. Conditional probability restricts sample space: P(A|B) = P(A ∩ B)/P(B).',
          exception: 'Two non-zero probability events CANNOT be both mutually exclusive and statistically independent simultaneously.',
          example: 'Expected Value E(X) = Σ x·P(x); Variance Var(X) = E(X²) − [E(X)]².'
        }
      ]
    },
    {
      chapterName: 'Theoretical Distributions (Binomial, Poisson, Normal)',
      keyPrinciples: [
        {
          title: 'Discrete (Binomial, Poisson) vs Continuous (Normal) Distributions',
          description: 'Binomial models fixed n independent Bernoulli trials (Mean = np, Var = npq, always Mean > Var). Poisson models rare events with constant average rate m (Mean = Var = m). Normal is symmetric bell-shaped continuous curve where Mean = Median = Mode and ±1σ, ±2σ, ±3σ capture 68.27%, 95.45%, 99.73% area.',
          exception: 'Binomial can have two modes if (n+1)p is an integer; Normal distribution points of inflexion lie at μ ± σ.',
          example: 'Standard Normal variate Z = (X − μ)/σ enables universal area lookup via cumulative tables.'
        }
      ]
    },
    {
      chapterName: 'Correlation and Regression',
      keyPrinciples: [
        {
          title: 'Karl Pearson r, Spearman Rank Correlation & Regression Lines',
          description: 'Correlation coefficient r lies strictly in [−1, +1] and is invariant to origin and scale (except sign flip if opposite signs). r is the geometric mean of regression coefficients b_yx and b_xy, sharing the same algebraic sign.',
          exception: 'Since r² = b_yx · b_xy <= 1, if one regression slope exceeds 1, the other MUST be less than 1.',
          example: 'Both regression lines intersect strictly at the coordinate (x̄, ȳ).'
        }
      ]
    },
    {
      chapterName: 'Index Numbers',
      keyPrinciples: [
        {
          title: 'Laspeyres, Paasche, Fisher & Time/Factor Reversal Tests',
          description: 'Laspeyres uses base-year quantities (upward bias); Paasche uses current-year quantities (downward bias); Fisher Ideal Index is GM of Laspeyres & Paasche. Fisher alone satisfies BOTH Time Reversal Test (P01 × P10 = 1) and Factor Reversal Test (P01 × Q01 = V01).',
          exception: 'Circular Test is satisfied only by simple geometric mean of price relatives or fixed-weight aggregates, NOT by Fisher Index.',
          example: 'Deflated Income = (Current Money Income / Current Price Index) × 100.'
        }
      ]
    }
  ],
  Econ: [
    {
      chapterName: 'Theory of Demand and Supply',
      keyPrinciples: [
        {
          title: 'Law of Demand, Price Elasticity & Consumer Surplus',
          description: 'Ceteris paribus inverse relationship between price and quantity demanded arises from substitution and income effects. Total Outlay Method links price direction to expenditure: when Ep > 1 price and outlay move inversely; when Ep < 1 they move together.',
          exception: 'Exceptions to Law of Demand: Giffen goods (strongly inferior staple goods), Veblen / conspicuous goods, necessities, and speculative bubbles.',
          example: 'Point Elasticity on a straight demand curve = Lower Segment / Upper Segment = −(dQ/dP)·(P/Q).'
        }
      ]
    },
    {
      chapterName: 'Theory of Production and Cost',
      keyPrinciples: [
        {
          title: 'Law of Variable Proportions & Envelope Cost Curve',
          description: 'Short run alters one variable factor (Labour) across 3 stages: Increasing Returns, Diminishing Returns (rational producer Stage II), and Negative Returns. Long-run AC (LAC / Planning Curve) is an envelope tangent to SACs driven by economies/diseconomies of scale.',
          exception: 'MC always intersects BOTH AVC and ATC strictly at their respective minimum points; AFC is a rectangular hyperbola never touching axes.',
          example: 'When AC falls, MC < AC; when AC rises, MC > AC; when AC is minimum, MC = AC.'
        }
      ]
    },
    {
      chapterName: 'Price Determination in Different Markets',
      keyPrinciples: [
        {
          title: 'Perfect Competition, Monopoly, Monopolistic & Oligopoly',
          description: 'All firms maximise profit where MC = MR (with MC cutting MR from below). Perfect competition features horizontal demand (P = AR = MR) and zero economic profit in long run. Oligopoly features Kinked Demand Curve (Sweezy model) explaining price rigidity.',
          exception: 'In short run, a competitive firm shuts down only if Price < AVC; if AVC <= Price < ATC, it continues producing to minimize fixed-cost loss.',
          example: 'Price discrimination under monopoly requires market separation, differing elasticities, and zero arbitrage.'
        }
      ]
    },
    {
      chapterName: 'Determination of National Income',
      keyPrinciples: [
        {
          title: 'GDP/GNP Conversions, Three Methods & Keynesian Multiplier',
          description: 'Gross vs Net subtracts Depreciation; Domestic vs National adds Net Factor Income from Abroad (NFIA); Market Price vs Factor Cost subtracts Net Indirect Taxes (NIT). Keynesian Investment Multiplier k = 1 / (1 − MPC) = 1 / MPS.',
          exception: 'Transfer payments, second-hand asset sales, and illegal activities are strictly excluded from National Income aggregates.',
          example: 'NNP_FC (National Income) = GDP_MP − Depreciation + NFIA − Net Indirect Taxes.'
        }
      ]
    },
    {
      chapterName: 'Public Finance & Fiscal Policy',
      keyPrinciples: [
        {
          title: 'Market Failure, Public Goods & Budget Deficits',
          description: 'Public goods are non-rival and non-excludable, triggering Free-Rider problem. Fiscal policy adjusts government expenditure and taxation to counter inflationary gaps (contractionary) or recessionary gaps (expansionary).',
          exception: 'Primary Deficit = Fiscal Deficit − Interest Payments (isolates current year’s borrowing excl. legacy debt service).',
          example: 'Externalities (pollution = negative; vaccination = positive) justify Pigouvian taxes or subsidies.'
        }
      ]
    },
    {
      chapterName: 'Money Market & Monetary Policy',
      keyPrinciples: [
        {
          title: 'Money Aggregates (M1–M4), Credit Multiplier & RBI Tools',
          description: 'M1 = Currency + Demand Deposits + Other RBI Deposits (Narrow Money); M3 = M1 + Time Deposits (Broad Money). RBI regulates liquidity via Quantitative tools (Repo, Reverse Repo, SDF, CRR, SLR, OMO) and Qualitative tools.',
          exception: 'Money Multiplier = 1 / Reserve Ratio (falls when public holds more currency or banks hold excess reserves).',
          example: 'Lowering CRR and Repo Rate injects liquidity into banks to stimulate aggregate credit demand.'
        }
      ]
    },
    {
      chapterName: 'International Trade & Balance of Payments',
      keyPrinciples: [
        {
          title: 'Comparative Advantage, Tariffs, Quotas & Exchange Rate',
          description: 'Ricardo’s Comparative Cost theory proves mutually beneficial trade arises from lower opportunity cost even without absolute advantage. BoP balances Current Account (goods, services, transfers) + Capital/Financial Account + Official Reserves.',
          exception: 'Nominal appreciation lowers import prices and hurts export competitiveness, whereas Real Exchange Rate adjusts for relative price inflation.',
          example: 'Import quotas restrict physical import quantity directly without raising tariff revenue for the importing government unless auctioned.'
        }
      ]
    }
  ]
};

export const FOUNDATION_FORM_ITEMS: Partial<Record<FoundationSubjectId, FormulaItem[]>> = {
  Accounts: [
    {
      chapterName: 'Depreciation and Amortisation',
      formulaName: 'Straight Line Depreciation (SLM)',
      equation: 'Annual Depreciation = (Original Cost - Scrap Value) / Useful Life',
      context: 'Uniform annual charge allocated across estimated useful life under AS 10.',
      variables: [
        { name: 'Original Cost', desc: 'Purchase price + non-refundable taxes + installation costs' },
        { name: 'Scrap Value', desc: 'Estimated residual realisable value at end of life' }
      ],
      workedExample: {
        scenario: 'Machine cost ₹5,40,000, freight ₹10,000, residual value ₹50,000, life 10 years.',
        calculation: '(5,50,000 - 50,000) / 10',
        output: '₹50,000 p.a.'
      }
    },
    {
      chapterName: 'Financial Statements of Not-for-Profit Organisations (NPO)',
      formulaName: 'Subscription Revenue Recon Formula',
      equation: 'Subscription = Received + Closing O/S - Opening O/S + Opening Adv - Closing Adv',
      context: 'Converts cash subscription received to accrual income for Income & Expenditure A/c.',
      variables: [
        { name: 'Closing O/S', desc: 'Subscription accrued due at year end' },
        { name: 'Closing Adv', desc: 'Received in advance for next financial year' }
      ]
    },
    {
      chapterName: 'Preparation of Final Accounts of Sole Proprietors',
      formulaName: 'Manager Commission (After Charging Commission)',
      equation: 'Commission = Net Profit Before Commission * (Rate / (100 + Rate))',
      context: 'Computes managerial profit share calculated on net distributable profit post-commission.',
      variables: [
        { name: 'Rate', desc: 'Contractual percentage rate' }
      ]
    }
  ],
  MathStats: [
    {
      chapterName: 'Mathematics of Finance (Simple & Compound Interest, Annuities)',
      formulaName: 'Future Value of Ordinary Annuity',
      equation: 'FV = A * [((1 + i)^n - 1) / i]',
      context: 'Accumulated future amount of equal end-of-period instalments.',
      variables: [
        { name: 'A', desc: 'Periodic instalment amount' },
        { name: 'i', desc: 'Effective interest rate per compounding period' },
        { name: 'n', desc: 'Total number of periods' }
      ],
      workedExample: {
        scenario: 'Deposit ₹10,000 annually for 3 years at 10% p.a.',
        calculation: '10,000 * [(1.1^3 - 1) / 0.1] = 10,000 * 3.31',
        output: '₹33,100'
      }
    },
    {
      chapterName: 'Measures of Central Tendency and Dispersion',
      formulaName: 'Coefficient of Variation (CV)',
      equation: 'CV = (Standard Deviation / Arithmetic Mean) * 100',
      context: 'Relative dimensionless measure comparing variability/consistency across datasets.',
      variables: [
        { name: 'SD', desc: 'Standard deviation of distribution' },
        { name: 'Mean', desc: 'Arithmetic mean (x-bar)' }
      ]
    },
    {
      chapterName: 'Correlation and Regression',
      formulaName: 'Karl Pearson Correlation Coefficient from Covariance',
      equation: 'r = Cov(X, Y) / (SD_X * SD_Y)',
      context: 'Measures linear strength and direction bounded strictly within [-1, +1].',
      variables: [
        { name: 'Cov(X, Y)', desc: 'Covariance between series X and Y' }
      ]
    }
  ],
  Econ: [
    {
      chapterName: 'Theory of Demand and Supply',
      formulaName: 'Arc Price Elasticity of Demand',
      equation: 'Ep = [(Q2 - Q1) / (Q2 + Q1)] * [(P2 + P1) / (P2 - P1)]',
      context: 'Measures price elasticity accurately across finite non-infinitesimal price changes.',
      variables: [
        { name: 'P1, P2', desc: 'Initial and new prices' },
        { name: 'Q1, Q2', desc: 'Initial and new quantities' }
      ]
    },
    {
      chapterName: 'Determination of National Income',
      formulaName: 'Keynesian Investment Multiplier (k)',
      equation: 'k = 1 / (1 - MPC) = 1 / MPS',
      context: 'Quantifies multiple expansion in national income per unit autonomous investment.',
      variables: [
        { name: 'MPC', desc: 'Marginal Propensity to Consume (dC/dY)' },
        { name: 'MPS', desc: 'Marginal Propensity to Save (1 - MPC)' }
      ]
    }
  ]
};

export const FOUNDATION_STATUTORY_SECTIONS: Record<string, StatutorySection[]> = {
  Law: [
    {
      number: 'Sec 2(h) & 10',
      heading: 'Contract & Essential Elements (Contract Act 1872)',
      purpose: 'An agreement enforceable by law is a contract; Sec 10 requires free consent, competent parties, lawful consideration, and lawful object.',
      subsections: [
        { number: 'Sec 2(a)–(b)', heading: 'Proposal & Acceptance', purpose: 'Signifying willingness with intention to obtain assent creates a promise once accepted.' },
        { number: 'Sec 11', heading: 'Competency to Contract', purpose: 'Excludes minors, persons of unsound mind, and persons disqualified by law.' }
      ]
    },
    {
      number: 'Sec 25',
      heading: 'Agreements Without Consideration (Exceptions)',
      purpose: 'Agreement made without consideration is void unless falling under written/registered natural love, past voluntary service, or time-barred debt.',
    },
    {
      number: 'Sec 56 & 73',
      heading: 'Supervening Impossibility & Breach Damages',
      purpose: 'Contract becomes void when act becomes impossible or unlawful subsequently (Sec 56); Sec 73 grants ordinary foreseeable damages excluding remote losses.',
    },
    {
      number: 'Sec 12–16 (SOGA)',
      heading: 'Conditions, Warranties & Implied Stipulations',
      purpose: 'Condition goes to main purpose giving right to repudiate; Warranty allows damages only. Implied conditions include title, sample, description, and wholesomeness.',
    },
    {
      number: 'Sec 45–54 (SOGA)',
      heading: 'Rights of Unpaid Seller Against Goods',
      purpose: 'Confers Right of Lien, Stoppage in Transit (upon buyer insolvency), and Limited Right of Resale.',
    },
    {
      number: 'Sec 6 & 69 (Partnership)',
      heading: 'Mutual Agency & Effect of Non-Registration',
      purpose: 'Mutual agency is conclusive proof of partnership; Sec 69 disables unregistered firms from filing civil suits against third parties exceeding ₹100.',
    },
    {
      number: 'Sec 2(68), 2(71), 2(85) (Co. Act)',
      heading: 'Private, Public & Small Company Definitions',
      purpose: 'Defines maximum 200 members & transfer restriction for Private Co, and thresholds for Small Company status.',
    },
    {
      number: 'Sec 138 (NI Act)',
      heading: 'Dishonour of Cheque for Insufficiency of Funds',
      purpose: 'Creates criminal liability (up to 2 years imprisonment or 2x cheque amount fine) if drawer fails to pay within 15 days of written demand notice.',
    }
  ]
};

export const FOUNDATION_LIMITS_RATES: Record<string, LimitRateItem[]> = {
  Law: [
    { item: 'Negotiable Instruments Act - Days of Grace on Term Bills', limitRate: '3 Days', remarks: 'Payable on 3rd day after maturity date (excluding At Sight / On Demand bills).' },
    { item: 'NI Act Sec 138 - Cheque Dishonour Notice Period by Payee', limitRate: '30 Days', remarks: 'Notice must be sent within 30 days of receiving bank return memo.' },
    { item: 'NI Act Sec 138 - Payment Cure Window for Drawer', limitRate: '15 Days', remarks: 'Offence crystalises only if drawer defaults for 15 days post receipt of demand notice.' },
    { item: 'Companies Act Sec 2(68) - Private Company Member Ceiling', limitRate: '200 Members', remarks: 'Excludes current & past employees; joint holders count as one single member.' },
    { item: 'Companies Act Sec 2(85) - Small Company Capital & Turnover Cap', limitRate: 'Paid-up <= ₹4 Cr & Turnover <= ₹40 Cr', remarks: 'Both limits apply simultaneously; inapplicable to public, Sec 8, or holding/subsidiary cos.' },
    { item: 'LLP Act 2008 - Resident Designated Partner Residency Rule', limitRate: '120 Days', remarks: 'At least one Designated Partner must stay in India >= 120 days during the financial year.' },
    { item: 'Partnership Act Sec 464 (Co. Act) - Max Partners Ceiling', limitRate: '50 Partners', remarks: 'Central Government rule ceiling (Section 464 statutory ceiling is 100); HUF/LLP exceptions apply.' },
    { item: 'Partnership Act Sec 69 - Unregistered Firm Suit Exception', limitRate: '<= ₹100', remarks: 'Suits/set-off claims not exceeding ₹100 remain maintainable despite non-registration.' }
  ]
};
