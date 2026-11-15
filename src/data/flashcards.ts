/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubjectId } from '../types';
import { AUDIT_ALL_CHAPTER_FLASHCARDS } from './audit/auditFlashcards';
import { OTHER_SUBJECTS_FLASHCARDS } from './otherSubjectsFlashcards';
import { FOUNDATION_INTER_FLASHCARDS } from './foundationAndInterPracticeData';

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  category: string;
  statutoryRef: string;
  examImportance: 'High' | 'Critical' | 'Medium';
  question: string;
  answerHtml: string; // Rich styled static review material optimized for quick reading
  summaryClean: string; // A concise 1-sentence recap for quick reference
}

export const HIGH_YIELD_FLASHCARDS: Flashcard[] = [
  // --- DIRECT TAX (DT) ---
  {
    id: 'dt_01',
    subjectId: 'DT',
    category: 'PGBP',
    statutoryRef: 'Section 43B(h) of Income-tax Act',
    examImportance: 'Critical',
    question: 'How does Section 43B(h) govern deduction of dues payable to Micro and Small Enterprises?',
    answerHtml: `
      <div class="space-y-3 font-sans text-xs">
        <p class="font-bold text-amber-500">Core Statutory Mandate:</p>
        <ul class="list-disc list-inside space-y-1 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
          <li>Applies to outstandings due to <span class="font-bold">Micro</span> (<1cr Investment; <5cr Turnover) or <span class="font-bold">Small</span> (<10cr Investment; <50cr Turnover) Enterprises.</li>
          <li>Does <span class="text-rose-450 font-bold">NOT</span> apply to Medium Enterprises or trading concerns.</li>
          <li>Payments must be settled within the time limit prescribed u/s 15 of MSMED Act, 2006:
            <ul class="pl-4 list-circle space-y-0.5 mt-1">
              <li><span class="font-bold">With Agreement:</span> Maximum 45 days.</li>
              <li><span class="font-bold">No Agreement (Deemed):</span> Within 15 days.</li>
            </ul>
          </li>
        </ul>
        <div class="border-t border-slate-800 pt-2">
          <p class="font-bold text-emerald-400">Tax Treatment on Default:</p>
          <p class="mt-0.5">If paid beyond MSMED timelines, deduction is allowed <span class="underline font-bold">only on actual payment basis</span> in the year of payment. Standard 43B option to pay before ITR filing u/s 139(1) is <span class="text-rose-400 font-bold">strictly unavailable</span> for this clause.</p>
        </div>
      </div>
    `,
    summaryClean: "Deductions for Micro/Small payments are allowed only on payment basis if made beyond 15/45 days; 139(1) extended deadline is inapplicable."
  },
  {
    id: 'dt_02',
    subjectId: 'DT',
    category: 'Undisclosed Income',
    statutoryRef: 'Section 115BBE of Income-tax Act',
    examImportance: 'Critical',
    question: 'What are the flat tax rates and restriction rules for undisclosed assets or cash credits u/s 115BBE?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Flat 78% Tax Rate Breakdown:</p>
        <div class="font-mono text-[11px] grid grid-cols-2 gap-1.5 bg-slate-900/50 p-2.5 rounded border border-slate-800">
          <div>• Base Income Tax:</div><div class="text-right font-bold text-white">60%</div>
          <div>• Surcharge (25% on Tax):</div><div class="text-right font-bold text-white">15%</div>
          <div>• Health & Cess (4% on aggregate):</div><div class="text-right font-bold text-white">2.8%</div>
          <div class="border-t border-slate-800 pt-1 font-bold text-rose-400">• Effective Tax Rate:</div>
          <div class="border-t border-slate-800 pt-1 text-right font-black text-rose-400">77.8% (78%)</div>
        </div>
        <p class="font-bold text-amber-500 mt-2">Zero Set-off Disallowance Clauses:</p>
        <ul class="list-disc list-inside space-y-1">
          <li>No Basic Exemption Limit set-off is permissible.</li>
          <li>No business expenditure or allowance is allowed under any head of income.</li>
          <li>No loss carry-forward or current-year set-off is permitted against this assessed sum.</li>
        </ul>
      </div>
    `,
    summaryClean: "Undisclosed credits are taxed at effective flat rate of 78% with complete disallowance of basic exemption, expenses, or loss set-offs."
  },
  {
    id: 'dt_03',
    subjectId: 'DT',
    category: 'Capital Gains',
    statutoryRef: 'Section 50B - Slump Sale',
    examImportance: 'High',
    question: 'How is "Net Worth" computed for a Slump Sale u/s 50B where an undertaking is transferred?',
    answerHtml: `
      <div class="space-y-3 font-sans text-xs">
        <p class="font-bold text-indigo-400">Statutory Net Worth Formula:</p>
        <p class="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-emerald-450 border border-slate-850">
          Net Worth = Aggregate Book Value of Tangible & Intangible Assets (ignoring asset revaluations) MINUS Book Liabilities of the undertaking.
        </p>
        <div class="space-y-1 px-1">
          <p class="font-black text-slate-350 select-none">How individual assets are valued in the formula:</p>
          <ul class="list-disc list-inside space-y-1">
            <li><span class="font-bold text-white">Depreciable Assets:</span> Written Down Value (WDV) computed u/s 43(6).</li>
            <li><span class="font-bold text-white">Admissible Capital Assets u/s 35AD:</span> Assigned Nil Book value.</li>
            <li><span class="font-bold text-white">Other Assets:</span> Normal Book Value.</li>
            <li><span class="font-bold text-rose-400">Asset Revaluation:</span> Must be strictly ignored.</li>
          </ul>
        </div>
      </div>
    `,
    summaryClean: "Net worth for lump-sum transfers takes depreciable asset WDV and other book values minus liabilities, with asset revaluations strictly ignored."
  },

  // --- INDIRECT TAX (IDT) ---
  {
    id: 'idt_01',
    subjectId: 'IDT',
    category: 'Input Tax Credit',
    statutoryRef: 'Section 17(5) of CGST Act - Blocked Credit',
    examImportance: 'Critical',
    question: 'What are the main categories of Blocked Input Tax Credits under Section 17(5)?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-pink-400">Key Blocks & Exceptions Matrix:</p>
        <div class="space-y-2">
          <div class="p-2 border border-slate-800 bg-slate-900/40 rounded-lg">
            <strong class="text-white block mb-0.5">Motor Vehicles (≤ 13 seating capacity):</strong>
            Blocked, <span class="text-emerald-400 font-bold">except</span> when used for (a) further supply, (b) passenger transportation, or (c) driving training.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/40 rounded-lg">
            <strong class="text-white block mb-0.5">Catering, Pools, Life Insurance, Health Care:</strong>
            Blocked, <span class="text-emerald-400 font-bold">except</span> where statutory obligatory for employers under prevailing labor rules, or for outward composite/mixed supplies.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/40 rounded-lg">
            <strong class="text-white block mb-0.5">Works Contract for Immovable Construction:</strong>
            Blocked when capitalized on own balance sheet, <span class="text-emerald-400 font-bold">except</span> for plant & machinery fabrication.
          </div>
        </div>
      </div>
    `,
    summaryClean: "ITC is blocked on motor vehicles (≤13 passengers), food, catering & beauty treatment unless used in outward supply or statutory obligatory."
  },
  {
    id: 'idt_02',
    subjectId: 'IDT',
    category: 'Time of Supply',
    statutoryRef: 'Section 12 & 13 of CGST Act',
    examImportance: 'High',
    question: 'How is the Time of Supply (ToS) determined for Goods vs Services under normal charge?',
    answerHtml: `
      <div class="space-y-3 font-sans text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div class="p-2.5 rounded border border-slate-800 bg-slate-900/30">
            <strong class="text-pink-450 block mb-1">📦 For Goods (Sec 12):</strong>
            Earlier of:
            <ul class="list-disc pl-3 mt-1 space-y-0.5 text-slate-350">
              <li>Date of issue of actual invoice.</li>
              <li>Due date of invoice u/s 31.</li>
            </ul>
            <span class="text-[10px] text-amber-500 font-bold block mt-1">Note: GST on advance payments for goods is fully exempt (Notification 66/2017).</span>
          </div>
          <div class="p-2.5 rounded border border-slate-800 bg-slate-900/30">
            <strong class="text-indigo-400 block mb-1">⚙️ For Services (Sec 13):</strong>
            Dependent on invoice timeline:
            <ul class="list-decimal pl-3 mt-1 space-y-0.5 text-slate-350">
              <li><span class="font-bold underline">If Invoice within 30 days:</span> Earlier of invoice date or payment date.</li>
              <li><span class="font-bold underline">If Invoice delay:</span> Earlier of service completion date or payment date.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    summaryClean: "ToS for goods is invoice date or limit date (advances exempt); for services, it depends on invoice timely issuance within 30 days."
  },

  // --- FINANCIAL REPORTING (FR) ---
  {
    id: 'fr_01',
    subjectId: 'FR',
    category: 'Revenue Recognition',
    statutoryRef: 'Ind AS 115 - Revenue from Contracts with Customers',
    examImportance: 'Critical',
    question: 'What are the five steps of the Revenue Recognition Model under Ind AS 115?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-violet-400">The 5-Step Core Framework:</p>
        <div class="space-y-1.5 font-mono text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div class="flex gap-2"><span class="font-black text-violet-400">Step 1:</span><span>Identify the legitimate contract with customer.</span></div>
          <div class="flex gap-2"><span class="font-black text-violet-400">Step 2:</span><span>Identify distinct Performance Obligations (POs) in contract.</span></div>
          <div class="flex gap-2"><span class="font-black text-violet-400">Step 3:</span><span>Determine Transaction Price (excludes third-party collections).</span></div>
          <div class="flex gap-2"><span class="font-black text-violet-400">Step 4:</span><span>Allocate Transaction Price to POs on stand-alone selling prices.</span></div>
          <div class="flex gap-2"><span class="font-black text-violet-400">Step 5:</span><span>Recognize revenue when/as each PO is satisfied (over time vs point).</span></div>
        </div>
      </div>
    `,
    summaryClean: "Ind AS 115 dictates a 5-step model: Identify Contract, Performance Obligations, Transaction Price, Apportionment, and Revenue Recognition."
  },
  {
    id: 'fr_105',
    subjectId: 'FR',
    category: 'Non-Current Assets Held for Sale & Discontinued Operations',
    statutoryRef: 'Ind AS 105 - Held for Sale & Discontinued Operations',
    examImportance: 'High',
    question: 'What are the two classification gates and measurement rules under Ind AS 105 for assets held for sale?',
    answerHtml: `
      <div class="space-y-3 font-sans text-xs">
        <p class="font-bold text-amber-400">Ind AS 105 Classification & Measurement Framework:</p>
        <div class="space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div>
            <strong class="text-indigo-300 block mb-1">Gate 1 — Available for Immediate Sale:</strong>
            <span class="text-slate-300">Available in present condition on usual/customary terms. Not mid-refurbishment or vital to ongoing ops.</span>
          </div>
          <div>
            <strong class="text-purple-300 block mb-1">Gate 2 — Sale Highly Probable (5 Conditions):</strong>
            <span class="text-slate-300">Management committed, active buyer search initiated, actively marketed at reasonable price vs FV, completion expected within 1 year, and plan withdrawal unlikely.</span>
          </div>
          <div class="border-t border-slate-800 pt-2 text-emerald-400 font-bold">
            ⚡ Measurement: Lower of Carrying Value & Fair Value Less Costs to Sell. Depreciation strictly STOPS immediately upon classification!
          </div>
        </div>
      </div>
    `,
    summaryClean: "Ind AS 105 requires immediate sale availability + highly probable sale (within 1 year). Measured at lower of carrying amount & FVLCTS with mandatory depreciation freeze."
  },
  {
    id: 'fr_02',
    subjectId: 'FR',
    category: 'Leases',
    statutoryRef: 'Ind AS 116 - Leases Recognition',
    examImportance: 'High',
    question: 'When is an arrangement classified as a lease in books, and what are short-term exceptions?',
    answerHtml: `
      <div class="space-y-3 font-sans text-xs">
        <p class="font-bold text-emerald-400">Lease Definition Criteria (Three Pillars):</p>
        <ul class="list-disc list-inside space-y-1 text-slate-300">
          <li>Must involve an <span class="font-bold text-white">Identified Asset</span> (explicitly or implicitly specified).</li>
          <li>The customer gains the right to obtain <span class="font-bold text-white">substantially all economic benefits</span> from use throughout the period.</li>
          <li>The customer has the right to <span class="font-bold text-white">direct the use</span> of the identified asset.</li>
        </ul>
        <div class="border-t border-slate-800 pt-2 bg-slate-900/40 p-2 rounded-lg">
          <strong class="text-amber-500 block">Lessee Recognition Exemptions (Optional):</strong>
          <ul class="list-disc pl-4 space-y-0.5 mt-1">
            <li><span class="font-bold">Short-term Leases:</span> Term of 12 months or less with NO purchase option.</li>
            <li><span class="font-bold">Low-value Leases:</span> Underlying asset of low value when new (e.g. personal computers).</li>
          </ul>
        </div>
      </div>
    `,
    summaryClean: "Lease requires an identified asset, benefit rights and control; Optional exceptions are short-term (<12m) or low value assets."
  },

  // --- ADVANCED FINANCIAL MANAGEMENT (AFM) ---
  {
    id: 'afm_01',
    subjectId: 'AFM',
    category: 'Derivatives',
    statutoryRef: 'Black-Scholes Options Pricing Model (BSM)',
    examImportance: 'Critical',
    question: 'What are the five core inputs of the Black-Scholes Formula used to prize stock options?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-cyan-400">BSM Pricing Variables Matrix:</p>
        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div class="p-2 border border-slate-800 bg-slate-900/30 rounded">
            <span class="text-cyan-400 block">1. S₀: Stock Price</span>
            Current spot cash market price of underlying instrument.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/30 rounded">
            <span class="text-cyan-400 block">2. K: Strike Price</span>
            Pre-determined exercise purchase option price.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/30 rounded">
            <span class="text-cyan-400 block">3. r: Risk-free rate</span>
            Continuously compounded annual interest rate.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/30 rounded">
            <span class="text-cyan-400 block">4. t: Time expiration</span>
            A fractional year rating to option expiration date.
          </div>
          <div class="p-2 border border-slate-800 bg-slate-900/30 rounded col-span-2 text-center text-amber-500">
            <span class="block text-amber-400">5. σ: Volatility (Standard Deviation)</span>
            Annualized standard deviation of daily logarithmic stock returns (Critical Option Price driver).
          </div>
        </div>
      </div>
    `,
    summaryClean: "Inputs to BSM option pricing are Spot price (S), Strike price (K), Risk-free rate (r), Time to maturity (t), and Volatility (sigma)."
  },
  {
    id: 'afm_02',
    subjectId: 'AFM',
    category: 'Portfolio Management',
    statutoryRef: 'Security Market Line (SML) vs Capital Market Line (CML)',
    examImportance: 'High',
    question: 'State the distinction of SML and CML in Capital Asset Pricing Model (CAPM) analysis.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs text-slate-300">
        <p class="font-bold text-cyan-400">Comparison Mechanics:</p>
        <table class="w-full text-left text-[11px] border-collapse border border-slate-800">
          <thead>
            <tr class="bg-slate-900">
              <th className="p-1.5 border border-slate-800 font-bold">Feature</th>
              <th className="p-1.5 border border-slate-800 font-bold">CML Matrix</th>
              <th className="p-1.5 border border-slate-800 font-bold">SML Matrix</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Risk Metric</td>
              <td class="p-1.5 border border-slate-800">Total Risk (Std Dev / &sigma;)</td>
              <td class="p-1.5 border border-slate-800 font-bold text-emerald-400">Systematic Risk (&beta;)</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Applies To</td>
              <td class="p-1.5 border border-slate-800 text-amber-400">Only Efficient Portfolios</td>
              <td class="p-1.5 border border-slate-800">All Assets & Portfolios</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "CML uses Standard Deviation of total risk applying only to efficient combinations; SML uses Beta (systematic risk) for any individual stock."
  },

  // --- AUDITING (Audit) - Comprehensive Flashcards across All 19 Chapters ---
  ...AUDIT_ALL_CHAPTER_FLASHCARDS,

  // --- ADDITIONAL SYLLABUS HIGH-YIELD FLASHCARDS (DT, IDT, FR, AFM, IBS) ---
  ...OTHER_SUBJECTS_FLASHCARDS,

  // --- INTEGRATED BUSINESS SOLUTIONS (IBS) ---
  {
    id: 'ibs_01',
    subjectId: 'IBS',
    category: 'Cross-functional Integration',
    statutoryRef: 'Case Study Framework Integration',
    examImportance: 'High',
    question: 'Explain the cross-functional synthesis between GST, Income Tax (PGBP) & FEMA on foreign remittances.',
    answerHtml: `
      <div class="space-y-3 font-sans text-xs">
        <div class="p-3 border border-slate-800 bg-slate-900/30 rounded-lg space-y-2">
          <p class="font-bold text-yellow-400">Multi-Act Concurrency Matrix:</p>
          <ul class="list-decimal list-inside space-y-1 text-slate-300">
            <li><span class="font-bold text-white">FEMA, 1999:</span> Remittance of technology royalties to parent abroad must comply under Current Account transaction limits.</li>
            <li><span class="font-bold text-white">CGST Act, 2017:</span> Importing services from associated foreign enterprises is a deemed supply u/s 7, attracting RCM @ 18% regardless of transactional consideration.</li>
            <li><span class="font-bold text-white">Income-tax Act:</span> Royalty expense claims must satisfy Section 92 ALP transfer pricing AND withstand 40(a)(i) TDS withholding checks.</li>
          </ul>
        </div>
      </div>
    `,
    summaryClean: "Cross-functional analysis links foreign parent royalties under FEMA remits, GST reverse charges, and Income Tax transfer pricing (ALP)."
  },
  ...FOUNDATION_INTER_FLASHCARDS
];
