/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CA FINAL FLASHCARDS: DIRECT TAX (DT), INDIRECT TAX (IDT), FINANCIAL REPORTING (FR),
 * ADVANCED FINANCIAL MANAGEMENT (AFM), AND INTEGRATED BUSINESS SOLUTIONS (IBS)
 * Sourced directly from syllabus data, statutory sections, and rate thresholds.
 */

import { Flashcard } from './flashcards';

export const OTHER_SUBJECTS_FLASHCARDS: Flashcard[] = [
  // =========================================================================
  // DIRECT TAX (DT)
  // =========================================================================
  {
    id: 'dt_fc_03',
    subjectId: 'DT',
    category: 'Transfer Pricing',
    statutoryRef: 'Section 92CE of Income-tax Act - Secondary Adjustments',
    examImportance: 'Critical',
    question: 'What are the conditions and repatriation timelines for Secondary Adjustment under Section 92CE?',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <p class="font-bold text-amber-400">Section 92CE Statutory Thresholds &amp; Timelines:</p>
        <div class="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-[11px] text-slate-300">
          <p><strong class="text-white">Applicability:</strong> Mandatory if primary adjustment to transfer price exceeds <span class="text-rose-400 font-bold">₹1 Crore</span> made by AO (and accepted by assessee), suo motu by assessee, under APA, safe harbour, or MAP.</p>
          <p><strong class="text-white">Repatriation Deadline:</strong> Excess money must be repatriated to India within <span class="text-emerald-400 font-bold">90 days</span> from the relevant date (e.g. date of filing return, date of APA, date of AO order).</p>
          <p><strong class="text-white">Deemed Advance Interest:</strong> If not repatriated within 90 days, the excess money is treated as an advance and imputed interest is computed (SBI 1-year MCLR + 3.25% if transaction in INR; 6-month LIBOR/SOFR + 3% if in foreign currency).</p>
          <p><strong class="text-white">Optional Additional Tax:</strong> Assessee may pay one-time additional tax @ <span class="text-sky-400 font-bold">20.9664%</span> (18% tax + 12% surcharge + 4% cess) on un-repatriated excess money in lieu of perpetual interest calculation.</p>
        </div>
      </div>
    `,
    summaryClean: "Secondary adjustment applies if primary adjustment > ₹1 Cr; excess money must be repatriated within 90 days or pay 20.9664% additional tax or imputed interest."
  },
  {
    id: 'dt_fc_04',
    subjectId: 'DT',
    category: 'Corporate Taxation',
    statutoryRef: 'Section 115JB - Minimum Alternate Tax (MAT) on Book Profits',
    examImportance: 'Critical',
    question: 'How are Book Profits computed under Section 115JB, and what is the rule regarding brought forward loss and unabsorbed depreciation?',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <p class="font-bold text-amber-400">MAT Computation Framework u/s 115JB:</p>
        <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">
          <li><strong class="text-white">Base Tax Rate:</strong> <span class="text-emerald-400 font-bold">15%</span> of Book Profit (plus applicable surcharge &amp; 4% cess); 9% for units in IFSC.</li>
          <li><strong class="text-white">Brought Forward Loss vs Depreciation:</strong> Lower of brought forward business loss (excluding depreciation) OR unabsorbed depreciation as per books of account is deductible.</li>
          <li><strong class="text-white">Insolvency / CIRP Exception:</strong> For companies admitted under CIRP under IBC 2016, aggregate of BOTH brought forward loss AND unabsorbed depreciation is deducted.</li>
          <li><strong class="text-white">MAT Credit (Section 115JAA):</strong> Excess of MAT over regular tax can be carried forward for set-off up to <span class="text-amber-400 font-bold">15 Assessment Years</span>.</li>
        </ul>
      </div>
    `,
    summaryClean: "MAT rate is 15% on book profit; deduct lower of book loss or unabsorbed depreciation (both deducted if under CIRP/IBC); MAT credit carries forward for 15 AYs."
  },
  {
    id: 'dt_fc_05',
    subjectId: 'DT',
    category: 'TDS & TCS',
    statutoryRef: 'Section 194Q vs Section 206C(1H) - Sale & Purchase of Goods',
    examImportance: 'Critical',
    question: 'Explain the priority hierarchy and thresholds between TDS on Purchase u/s 194Q and TCS on Sale u/s 206C(1H).',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th class="p-1.5 border border-slate-800">Parameter</th>
              <th class="p-1.5 border border-slate-800">Section 194Q (Buyer TDS)</th>
              <th class="p-1.5 border border-slate-800">Section 206C(1H) (Seller TCS)</th>
            </tr>
          </thead>
          <tbody class="text-slate-300">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Trigger Entity Turnover</td>
              <td class="p-1.5 border border-slate-800">Buyer turnover <span class="text-amber-400 font-bold">&gt; ₹10 Cr</span> in preceding FY</td>
              <td class="p-1.5 border border-slate-800">Seller turnover <span class="text-amber-400 font-bold">&gt; ₹10 Cr</span> in preceding FY</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Transaction Threshold</td>
              <td class="p-1.5 border border-slate-800">Purchase &gt; ₹50 Lakhs from seller</td>
              <td class="p-1.5 border border-slate-800">Receipt &gt; ₹50 Lakhs from buyer</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Rate</td>
              <td class="p-1.5 border border-slate-800 text-emerald-400 font-bold">0.1% of value &gt; ₹50L (5% if no PAN)</td>
              <td class="p-1.5 border border-slate-800 text-emerald-400 font-bold">0.1% of receipt &gt; ₹50L (1% if no PAN)</td>
            </tr>
          </tbody>
        </table>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px] text-rose-300">
          <strong>Priority Hierarchy Rule:</strong> If Section 194Q applies and buyer is liable to deduct TDS, <span class="underline font-bold text-white">Section 194Q prevails</span> and seller shall NOT collect TCS u/s 206C(1H).
        </div>
      </div>
    `,
    summaryClean: "194Q (buyer turnover > ₹10 Cr, purchase > ₹50L, 0.1% TDS) takes absolute precedence over 206C(1H) (seller TCS); if buyer deducts TDS, seller does not collect TCS."
  },
  {
    id: 'dt_fc_06',
    subjectId: 'DT',
    category: 'Assessment & Reassessment',
    statutoryRef: 'Section 148 & 148A - Reassessment Timelines and Escaped Income',
    examImportance: 'Critical',
    question: 'What are the statutory time limits and monetary thresholds for issuing notice under Section 148 post-Finance Act amendments?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Section 148 &amp; 148A Statutory Framework:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">General Time Limit: 3 Years</strong>
            Notice u/s 148 can be issued up to <span class="text-emerald-400 font-bold">3 years</span> from the end of the relevant assessment year for any amount of escaped income.
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Extended Limit: Up to 5 Years</strong>
            Notice can be issued beyond 3 years up to <span class="text-rose-400 font-bold">5 years</span> only if AO has in possession books/documents showing income escaping assessment represented in the form of an asset, expenditure, or entry is <span class="text-rose-400 font-bold">&ge; ₹50 Lakhs</span>.
          </div>
        </div>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300">
          <strong class="text-sky-400">Section 148A Inquiry:</strong> Mandatory to conduct inquiry, provide show cause opportunity (minimum 7 days, maximum 30 days to respond), and pass speaking order before issuing Section 148 notice.
        </div>
      </div>
    `,
    summaryClean: "Reassessment notice: 3 years ordinarily; extended to 5 years only if escaped income in form of asset/entry is ≥ ₹50 Lakhs; mandatory 148A pre-notice order."
  },
  {
    id: 'dt_fc_07',
    subjectId: 'DT',
    category: 'Charitable Trusts',
    statutoryRef: 'Section 115BBI & Section 12AB of Income-tax Act',
    examImportance: 'High',
    question: 'What is the flat 30% tax regime under Section 115BBI for specified violations by Charitable Trusts?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Specified Violations Taxed @ Flat 30% u/s 115BBI:</p>
        <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">
          <li>Income accumulated in excess of 15% where Form 10/9A not filed or not utilized within 5 years.</li>
          <li>Income applied directly or indirectly for the benefit of prohibited persons u/s 13(3) (trustees, founders, relatives).</li>
          <li>Income applied outside India without prior CBDT approval.</li>
          <li>Income derived from activities not in accordance with charitable objects.</li>
          <li>Anonymous donations taxed u/s 115BBC in excess of higher of ₹1 Lakh or 5% of total donations.</li>
        </ul>
        <p class="text-[10px] text-slate-400 font-mono">No deduction for any expenditure, allowance, or set-off of loss is permitted against Section 115BBI income.</p>
      </div>
    `,
    summaryClean: "Section 115BBI levies flat 30% tax on trust violations (13(3) private benefits, unutilized accumulations, unauthorized foreign applications) with zero deductions."
  },

  // =========================================================================
  // INDIRECT TAX (IDT / GST & CUSTOMS)
  // =========================================================================
  {
    id: 'idt_fc_03',
    subjectId: 'IDT',
    category: 'Input Tax Credit',
    statutoryRef: 'Section 17(5) of CGST Act, 2017 - Blocked Input Tax Credit',
    examImportance: 'Critical',
    question: 'Enumerate the primary blocked ITC categories under Section 17(5) of CGST Act.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-rose-400">Section 17(5) Ineligible Input Tax Credit Categories:</p>
        <div class="space-y-1 text-[11px] text-slate-300">
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white">Clause (a) Motor Vehicles:</strong> Seating capacity &le; 13 persons (including driver). Exception: Allowed if used for further supply of vehicles, passenger transport business, or driving training.
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white">Clause (b) Food, Beverages, Club, Life/Health Insurance:</strong> Blocked unless employer is statutorily obligated under law to provide it, or used for making outward taxable supply of same category.
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white">Clause (c) &amp; (d) Works Contract &amp; Construction:</strong> Goods/services for construction of immovable property capitalized to PPE. Exception: Plant and Machinery construction is eligible.
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white">Clause (fa) CSR Expenditure:</strong> Goods or services used or intended to be used for activities relating to obligations under Section 135 of Companies Act, 2013 (CSR) are strictly blocked.
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white">Clause (h) Lost, Stolen, Written Off, or Free Samples:</strong> Goods lost, stolen, destroyed, written off, or disposed of by way of gift or free samples.
          </div>
        </div>
      </div>
    `,
    summaryClean: "Section 17(5) blocks ITC on motor vehicles (≤13 seats), personal food/catering, construction capitalized to immovable property, CSR expenses, and lost/gifted goods."
  },
  {
    id: 'idt_fc_04',
    subjectId: 'IDT',
    category: 'Supply & Procedural Rules',
    statutoryRef: 'Rule 86B of CGST Rules, 2017 - Restriction on Output Liability Settlement',
    examImportance: 'High',
    question: 'What are the restrictions on using Electronic Credit Ledger under Rule 86B and who is exempt?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Rule 86B (1% Mandatory Cash Settlement Rule):</p>
        <div class="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-[11px] text-slate-300">
          <p><strong class="text-white">Mandate:</strong> Registered person cannot use ITC to discharge output tax in excess of <span class="text-rose-400 font-bold">99%</span> of tax liability if taxable supply value in a month (other than exempt &amp; zero-rated) exceeds <span class="text-emerald-400 font-bold">₹50 Lakhs</span>.</p>
          <p><strong class="text-white">Cash Outflow:</strong> At least 1% of total output tax liability must be discharged via Electronic Cash Ledger.</p>
          <p class="font-bold text-sky-400 mt-1">Exemptions from Rule 86B:</p>
          <ul class="list-disc list-inside space-y-0.5 pl-1">
            <li>Proprietor/partner/MD has paid &gt; ₹1 Lakh income tax in each of preceding 2 FYs.</li>
            <li>Received refund &gt; ₹1 Lakh on account of unutilized ITC (export or inverted duty).</li>
            <li>Cumulative cash discharge in current FY &gt; 1% of total output tax.</li>
            <li>Government departments, PSUs, local authorities, statutory bodies.</li>
          </ul>
        </div>
      </div>
    `,
    summaryClean: "Rule 86B caps ITC utilization at 99% of tax liability (forcing 1% cash payment) if monthly taxable supplies > ₹50L, unless taxpayer has paid > ₹1L income tax or received refunds."
  },
  {
    id: 'idt_fc_05',
    subjectId: 'IDT',
    category: 'E-Way Bill & E-Invoicing',
    statutoryRef: 'Rule 138 of CGST Rules - E-Way Bill Generation Thresholds & Validity',
    examImportance: 'Critical',
    question: 'What are the mandatory thresholds, distance validity rules, and exceptions for E-Way Bills under Rule 138?',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <p class="font-bold text-amber-400">Rule 138 E-Way Bill Parameters:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Mandatory Threshold</strong>
            Consignment value of goods exceeds <span class="text-emerald-400 font-bold">₹50,000</span> (includes CGST, SGST, IGST, Cess, excludes exempt goods value).
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Distance Validity</strong>
            • General cargo: 1 day per <span class="text-sky-400 font-bold">200 km</span> (or part thereof).<br/>
            • Over Dimensional Cargo (ODC) / Multimodal involving ship: 1 day per <span class="text-sky-400 font-bold">20 km</span>.
          </div>
        </div>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300">
          <strong class="text-rose-400">Mandatory E-Way Bill even if value &le; ₹50,000:</strong>
          (1) Inter-state movement of goods by principal to job-worker; (2) Inter-state transport of handicraft goods by dealer exempt from registration.
        </div>
      </div>
    `,
    summaryClean: "E-Way Bill mandatory for consignment value > ₹50,000; validity is 200 km/day for normal cargo, 20 km/day for ODC; mandatory regardless of value for job-work/handicrafts."
  },
  {
    id: 'idt_fc_06',
    subjectId: 'IDT',
    category: 'Customs Law',
    statutoryRef: 'Section 14 of Customs Act, 1962 & Customs Valuation Rules',
    examImportance: 'Critical',
    question: 'How is Assessable Value for Customs Duty determined under Section 14 and Rule 10 additions?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Customs Assessable Value (CIF) Architecture:</p>
        <div class="p-2 bg-slate-900 border border-slate-800 rounded text-[11px] space-y-1 text-slate-300">
          <p><strong class="text-white">FOB Value:</strong> Price actually paid or payable for goods when sold for export to India.</p>
          <p><strong class="text-emerald-400">Rule 10(1) Mandatory Additions to FOB:</strong> Commissions/brokerage (except buying commission), packing cost, engineering/design supplied free/reduced cost (assists), royalties &amp; license fees related to imported goods.</p>
          <p><strong class="text-sky-400">Rule 10(2) Freight &amp; Insurance:</strong></p>
          <ul class="list-disc list-inside space-y-0.5 pl-1">
            <li><strong>Transport Freight:</strong> Actual cost. If by air, capped at <span class="text-rose-400 font-bold">20% of FOB value</span>. If unascertainable, take 20% of FOB.</li>
            <li><strong>Insurance:</strong> Actual cost. If unascertainable, take <span class="text-rose-400 font-bold">1.125% of FOB value</span>.</li>
          </ul>
        </div>
        <p class="text-[10px] text-slate-400 font-mono">Note: Landing charges (formerly 1%) are NO LONGER added to CIF value.</p>
      </div>
    `,
    summaryClean: "CIF = FOB + Rule 10(1) additions + Freight (air freight capped at 20% FOB) + Insurance (1.125% if not ascertainable). No landing charges added."
  },

  // =========================================================================
  // FINANCIAL REPORTING (FR / IND AS)
  // =========================================================================
  {
    id: 'fr_fc_04',
    subjectId: 'FR',
    category: 'Ind AS 115 Revenue',
    statutoryRef: 'Ind AS 115 - Five-Step Revenue Recognition Framework',
    examImportance: 'Critical',
    question: 'Enumerate the 5 sequential steps of revenue recognition under Ind AS 115 and the Principal vs Agent test.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Ind AS 115 Five-Step Sequential Model:</p>
        <ol class="list-decimal list-inside space-y-1 text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">
          <li><strong class="text-white">Identify the contract(s) with customer:</strong> Approved, enforceable rights, commercial substance, collection probable.</li>
          <li><strong class="text-white">Identify separate performance obligations (PO):</strong> Distinct goods or services promised.</li>
          <li><strong class="text-white">Determine the transaction price:</strong> Fixed consideration adjusted for variable consideration (constraint applies), significant financing component, non-cash consideration.</li>
          <li><strong class="text-white">Allocate transaction price to performance obligations:</strong> Based on relative stand-alone selling prices (SSP).</li>
          <li><strong class="text-white">Recognize revenue:</strong> When (or as) the entity satisfies a performance obligation by transferring control (over time or at a point in time).</li>
        </ol>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
          <strong class="text-emerald-400">Principal vs Agent:</strong> Principal controls specified good/service before transfer (recognizes gross revenue); Agent arranges supply (recognizes net commission).
        </div>
      </div>
    `,
    summaryClean: "Ind AS 115 5 steps: Contract identification, PO identification, Transaction price determination, Allocation by relative SSP, and Recognition upon transfer of control."
  },
  {
    id: 'fr_fc_05',
    subjectId: 'FR',
    category: 'Ind AS 116 Leases',
    statutoryRef: 'Ind AS 116 - Lessee Accounting Model and Recognition Exemptions',
    examImportance: 'Critical',
    question: 'Explain the single lessee accounting model, initial measurement of ROU Asset & Lease Liability, and optional exemptions under Ind AS 116.',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <div class="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-[11px] text-slate-300">
          <p><strong class="text-white">Single Lessee Model:</strong> Eliminates classification into operating and finance lease for lessees. All leases recognized on Balance Sheet.</p>
          <p><strong class="text-emerald-400">Lease Liability:</strong> Present value of lease payments not paid at commencement date, discounted using Interest Rate Implicit in Lease (or Incremental Borrowing Rate).</p>
          <p><strong class="text-sky-400">Right-of-Use (ROU) Asset:</strong> Initial measurement of Lease Liability + Initial direct costs + Lease payments made at/before commencement + Estimated dismantling/restoration costs - Lease incentives received.</p>
          <p class="font-bold text-amber-400 mt-1">Two Optional Lessee Exemptions (P&amp;L charge on straight-line basis):</p>
          <ul class="list-disc list-inside space-y-0.5 pl-1">
            <li><strong class="text-white">Short-term Leases:</strong> Leases with lease term of <span class="text-rose-400 font-bold">&le; 12 months</span> (containing no purchase option).</li>
            <li><strong class="text-white">Leases of Low-value Assets:</strong> Underlying asset value when brand new is low (indicative threshold approx $5,000 e.g. tablets, personal computers, office furniture).</li>
          </ul>
        </div>
      </div>
    `,
    summaryClean: "Ind AS 116 lessee model: PV of payments recognized as Lease Liability; ROU Asset includes liability, direct costs, dismantling. Exemptions: short-term (≤12 mo) & low-value assets."
  },
  {
    id: 'fr_fc_06',
    subjectId: 'FR',
    category: 'Ind AS 109 Financial Instruments',
    statutoryRef: 'Ind AS 109 - Classification of Financial Assets & Expected Credit Loss (ECL)',
    examImportance: 'Critical',
    question: 'How are Financial Assets classified into Amortised Cost, FVTOCI, and FVTPL using the Business Model and SPPI tests?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Two-Tier Classification Test (Debt Instruments):</p>
        <table class="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th class="p-1.5 border border-slate-800">Business Model Test</th>
              <th class="p-1.5 border border-slate-800">SPPI Test (Solely Principal &amp; Interest)</th>
              <th class="p-1.5 border border-slate-800">Classification</th>
            </tr>
          </thead>
          <tbody class="text-slate-300">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Hold to Collect contractual cash flows</td>
              <td class="p-1.5 border border-slate-800">Passes SPPI test</td>
              <td class="p-1.5 border border-slate-800 text-emerald-400 font-bold">Amortised Cost</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Hold to Collect &amp; Selling</td>
              <td class="p-1.5 border border-slate-800">Passes SPPI test</td>
              <td class="p-1.5 border border-slate-800 text-sky-400 font-bold">FVTOCI (Recycled to P&amp;L)</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Other business models / Held for trading</td>
              <td class="p-1.5 border border-slate-800">Passes or Fails SPPI</td>
              <td class="p-1.5 border border-slate-800 text-rose-400 font-bold">FVTPL (Residual)</td>
            </tr>
          </tbody>
        </table>
        <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300">
          <strong class="text-amber-300">Equity Investments:</strong> Default is FVTPL; irrevocable option at initial recognition to classify non-trading equities at FVTOCI (accumulated gains/losses transferred to retained earnings, NEVER recycled to P&amp;L).
        </div>
      </div>
    `,
    summaryClean: "Debt classified based on Business Model and SPPI: Hold to Collect = Amortised Cost; Hold & Sell = FVTOCI; Others = FVTPL. Non-trading equity has irrevocable FVTOCI option (no recycling)."
  },
  {
    id: 'fr_fc_07',
    subjectId: 'FR',
    category: 'Ind AS 103 Business Combinations',
    statutoryRef: 'Ind AS 103 - Acquisition Method, Goodwill, and Bargain Purchase',
    examImportance: 'Critical',
    question: 'How is Goodwill or Bargain Purchase Gain calculated on acquisition date, and what is the OCI vs Capital Reserve rule for Bargain Purchase?',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <p class="font-bold text-amber-400">Ind AS 103 Acquisition Method Formula:</p>
        <div class="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-200 font-mono">
          Purchase Consideration (at Fair Value)<br/>
          + Non-Controlling Interest (NCI at FV or proportionate net assets)<br/>
          + Fair Value of previously held equity interest in acquiree<br/>
          - Identifiable Net Assets acquired (at Fair Value)<br/>
          = <strong class="text-amber-400">Goodwill</strong> (if positive) OR <strong class="text-emerald-400">Bargain Purchase Gain</strong> (if negative)
        </div>
        <div class="p-2.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 space-y-1">
          <strong class="text-rose-400">Bargain Purchase Recognition Rule:</strong>
          <p>Before recognizing bargain purchase gain, acquirer must reassess whether all assets acquired and liabilities assumed are correctly identified and measured.</p>
          <p>If clear evidence of bargain exists: Recognize in <span class="font-bold text-emerald-400">Other Comprehensive Income (OCI)</span> on acquisition date and accumulate directly in <span class="font-bold text-white">Capital Reserve</span>. If no clear evidence: Recognize directly in Capital Reserve.</p>
        </div>
      </div>
    `,
    summaryClean: "Goodwill = Consideration + NCI + Prior Interest - Fair Value of Net Assets. Bargain Purchase requires mandatory reassessment, recognized in OCI and accumulated in Capital Reserve."
  },
  {
    id: 'fr_fc_08',
    subjectId: 'FR',
    category: 'Ind AS 36 Impairment',
    statutoryRef: 'Ind AS 36 - Recoverable Amount, Value in Use, and CGU Impairment Order',
    examImportance: 'High',
    question: 'How is Recoverable Amount determined under Ind AS 36, and what is the allocation sequence for Cash-Generating Unit (CGU) impairment?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Recoverable Amount Definition:</p>
        <p class="p-2 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-300">
          Recoverable Amount is the <span class="text-emerald-400 font-bold">HIGHER</span> of:
          <br/>1. <strong class="text-white">Fair Value less Costs of Disposal (FVLCOD)</strong>; and
          <br/>2. <strong class="text-white">Value in Use (VIU)</strong>: PV of estimated future cash flows expected to arise from continuing use and ultimate disposal, discounted at pre-tax discount rate.
        </p>
        <p class="font-bold text-rose-400 mt-1">CGU Impairment Loss Allocation Sequence:</p>
        <ol class="list-decimal list-inside space-y-0.5 text-[11px] text-slate-300 pl-1">
          <li><strong class="text-white">Step 1:</strong> First, reduce the carrying amount of any <span class="font-bold text-amber-400">Goodwill</span> allocated to the CGU.</li>
          <li><strong class="text-white">Step 2:</strong> Next, allocate pro-rata to other assets of the CGU based on relative carrying amounts.</li>
        </ol>
        <p class="text-[10px] text-slate-400 font-mono">Floor rule: Carrying amount of an individual asset shall not be reduced below the highest of its FVLCOD, VIU, or zero.</p>
      </div>
    `,
    summaryClean: "Recoverable amount is higher of Fair Value less costs of disposal and Value in Use; CGU impairment loss is written off first against Goodwill, then pro-rata across other assets."
  },

  // =========================================================================
  // ADVANCED FINANCIAL MANAGEMENT (AFM)
  // =========================================================================
  {
    id: 'afm_fc_03',
    subjectId: 'AFM',
    category: 'Derivatives Analysis and Valuation',
    statutoryRef: 'Put-Call Parity Theory & Black-Scholes Formula Components',
    examImportance: 'Critical',
    question: 'State the Put-Call Parity equation, arbitrage conditions, and the 5 variables of the Black-Scholes Model.',
    answerHtml: `
      <div class="space-y-2.5 font-sans text-xs">
        <div class="p-2.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
          <span class="font-bold text-amber-400 block text-xs">Put-Call Parity Equation (European Options):</span>
          <div class="text-center py-1 font-mono text-sm text-emerald-400 font-bold bg-slate-950 rounded border border-slate-850">
            C + PV(X) = P + S
          </div>
          <p class="text-[11px] text-slate-300">
            Where: <strong class="text-white">C</strong> = Call price, <strong class="text-white">PV(X)</strong> = Present Value of Strike Price [X &times; e<sup>-rt</sup>], <strong class="text-white">P</strong> = Put price, <strong class="text-white">S</strong> = Current Spot Price of underlying stock.
          </p>
        </div>
        <div class="p-2 bg-slate-900/60 border border-slate-800 rounded text-[11px] space-y-1">
          <span class="font-bold text-sky-400 block">5 Inputs to Black-Scholes Option Pricing Model:</span>
          <p class="text-slate-300">1. Current Stock Price (S); 2. Strike Price (X); 3. Time to Expiration (t); 4. Risk-Free Interest Rate (r); 5. Volatility of Stock Returns (&sigma; / Standard Deviation).</p>
        </div>
      </div>
    `,
    summaryClean: "Put-Call Parity: C + PV(X) = P + S; links European call, put, spot price, and present value of strike. Black-Scholes uses Spot, Strike, Time, Risk-free rate, and Volatility."
  },
  {
    id: 'afm_fc_04',
    subjectId: 'AFM',
    category: 'Foreign Exchange Exposure and Risk Management',
    statutoryRef: 'Interest Rate Parity (IRP) & Purchasing Power Parity (PPP)',
    examImportance: 'Critical',
    question: 'How do Covered Interest Arbitrage and Interest Rate Parity (IRP) determine forward exchange rates?',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Interest Rate Parity (IRP) Formula:</p>
        <div class="text-center py-1.5 font-mono text-sm text-sky-400 font-bold bg-slate-900 rounded border border-slate-800">
          Forward / Spot = (1 + r<sub>domestic</sub>) / (1 + r<sub>foreign</sub>)
        </div>
        <div class="p-2.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 space-y-1">
          <strong class="text-emerald-400">Forward Premium / Discount Principle:</strong>
          <p>The currency with the <span class="font-bold text-rose-400">higher interest rate</span> always trades at a <span class="underline font-bold">Forward Discount</span>. The currency with the <span class="font-bold text-emerald-400">lower interest rate</span> trades at a <span class="underline font-bold">Forward Premium</span>.</p>
          <strong class="text-amber-300">Covered Interest Arbitrage:</strong>
          <p>If actual Forward rate &ne; Theoretical IRP rate, arbitrage exists without currency risk: borrow in low interest currency, convert at spot, invest in high interest currency, lock in forward contract.</p>
        </div>
      </div>
    `,
    summaryClean: "IRP states Forward/Spot = (1 + r_domestic) / (1 + r_foreign); higher interest rate currency trades at forward discount, lower interest rate currency at premium."
  },
  {
    id: 'afm_fc_05',
    subjectId: 'AFM',
    category: 'Portfolio Management',
    statutoryRef: 'Sharpe vs Treynor vs Jensen Alpha Portfolio Performance Metrics',
    examImportance: 'High',
    question: 'Compare Sharpe Ratio, Treynor Ratio, and Jensen’s Alpha in evaluating portfolio performance.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <table class="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th class="p-1.5 border border-slate-800">Ratio</th>
              <th class="p-1.5 border border-slate-800">Formula</th>
              <th class="p-1.5 border border-slate-800">Risk Measure</th>
              <th class="p-1.5 border border-slate-800">Best Application</th>
            </tr>
          </thead>
          <tbody class="text-slate-300">
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Sharpe Ratio</td>
              <td class="p-1.5 border border-slate-800 font-mono">(R<sub>p</sub> - R<sub>f</sub>) / &sigma;<sub>p</sub></td>
              <td class="p-1.5 border border-slate-800 text-amber-400">Total Risk (&sigma;)</td>
              <td class="p-1.5 border border-slate-800">When evaluating entire un-diversified portfolio wealth.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Treynor Ratio</td>
              <td class="p-1.5 border border-slate-800 font-mono">(R<sub>p</sub> - R<sub>f</sub>) / &beta;<sub>p</sub></td>
              <td class="p-1.5 border border-slate-800 text-emerald-400">Systematic Risk (&beta;)</td>
              <td class="p-1.5 border border-slate-800">When evaluating a fund to be added to a well-diversified portfolio.</td>
            </tr>
            <tr>
              <td class="p-1.5 border border-slate-800 font-bold text-white">Jensen’s Alpha (&alpha;)</td>
              <td class="p-1.5 border border-slate-800 font-mono">R<sub>p</sub> - [R<sub>f</sub> + &beta;(R<sub>m</sub> - R<sub>f</sub>)]</td>
              <td class="p-1.5 border border-slate-800 text-sky-400">CAPM Expected Return</td>
              <td class="p-1.5 border border-slate-800">Measures manager’s superior stock-picking capability (&alpha; &gt; 0).</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    summaryClean: "Sharpe divides excess return by total risk (std dev); Treynor divides by systematic risk (beta); Jensen's Alpha measures excess return above CAPM benchmark."
  },

  // =========================================================================
  // INTEGRATED BUSINESS SOLUTIONS (IBS)
  // =========================================================================
  {
    id: 'ibs_fc_02',
    subjectId: 'IBS',
    category: 'Corporate Restructuring & Tax Synthesis',
    statutoryRef: 'Section 47 of Income-tax Act & Section 232 of Companies Act & GST Schedule II',
    examImportance: 'Critical',
    question: 'Synthesize the multi-disciplinary requirements for a tax-neutral Slump Sale vs Demerger.',
    answerHtml: `
      <div class="space-y-2 font-sans text-xs">
        <p class="font-bold text-amber-400">Slump Sale (Section 50B) vs Demerger (Section 2(19AA)):</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Slump Sale (Section 50B)</strong>
            • Transfer of undertaking for lump sum consideration without values assigned to individual assets.<br/>
            • Capital Gain = Consideration (Rule 11UAE FMV) - Net Worth.<br/>
            • <strong class="text-emerald-400">GST:</strong> Transfer of a going concern as a whole is <span class="underline font-bold">exempt from GST</span> (Notification 12/2017).
          </div>
          <div class="p-2 bg-slate-900 border border-slate-800 rounded">
            <strong class="text-white block">Demerger (Section 2(19AA))</strong>
            • Undertaking transferred on going-concern basis to resulting company; consideration discharged by issue of shares to shareholders.<br/>
            • <strong class="text-emerald-400">Tax Neutrality u/s 47(vib):</strong> No capital gains tax on demerged company or shareholders.<br/>
            • Must comply with NCLT scheme u/s 230-232 of Companies Act.
          </div>
        </div>
      </div>
    `,
    summaryClean: "Slump sale taxes capital gains u/s 50B (exempt under GST as going concern); demerger u/s 2(19AA) is tax-neutral u/s 47 with shares issued directly to shareholders."
  }
];
