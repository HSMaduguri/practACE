import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Coins, 
  Clock, 
  Calendar,
  Percent,
  Scale,
  Layers,
  Award,
  HeartPulse,
  Info,
  HelpCircle,
  CheckCircle2,
  Gift,
  BookOpen,
  Globe,
  Building2,
  TrendingUp,
  Briefcase,
  FileText,
  RotateCcw,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export function TimeOfSupplyHighFidelityView() {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'calculator'>('matrix');
  
  // Calculator state
  const [calcModel, setCalcModel] = useState<'goods_fwd' | 'goods_rcm' | 'services_fwd' | 'services_rcm'>('goods_fwd');
  const [invoiceDate, setInvoiceDate] = useState<string>('2026-10-01');
  const [paymentDate, setPaymentDate] = useState<string>('2026-10-05');
  const [removalCompletionDate, setRemovalCompletionDate] = useState<string>('2026-09-30');
  const [receiptGoodsDate, setReceiptGoodsDate] = useState<string>('2026-10-02');

  const calculateTOS = () => {
    const inv = new Date(invoiceDate);
    const pay = new Date(paymentDate);
    const remComp = new Date(removalCompletionDate);
    const recG = new Date(receiptGoodsDate);

    if (isNaN(inv.getTime()) || isNaN(pay.getTime()) || isNaN(remComp.getTime())) {
      return { error: 'Please enter valid dates.' };
    }

    switch (calcModel) {
      case 'goods_fwd': {
        const earliest = inv < remComp ? inv : remComp;
        const formatted = earliest.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const isInvoiceLate = inv > remComp;
        return {
          tos: formatted,
          reason: `Section 12(2) Forward Charge of Goods:\n• Earliest of: Date of Invoice (${invoiceDate}) or Due Date of Invoice (Removal Date: ${removalCompletionDate}).\n• PAYMENT DATE IS IGNORED completely under Notification No. 66/2017-CT.`,
          rule: isInvoiceLate 
            ? `⚠️ Since invoice was issued LATE (${invoiceDate} is after removal ${removalCompletionDate}), the due date u/s 31(1) of ${removalCompletionDate} governs the TOS.`
            : `✅ Invoice was issued timely on/before removal. TOS is the Invoice Date: ${invoiceDate}.`
        };
      }
      case 'services_fwd': {
        const diffTime = inv.getTime() - remComp.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isWithin30Days = diffDays <= 30;

        if (isWithin30Days && diffDays >= 0) {
          const earliest = inv < pay ? inv : pay;
          const formatted = earliest.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          return {
            tos: formatted,
            reason: `Section 13(2) Forward Charge of Services (TIMELY INVOICE):\n• Invoice was issued on ${invoiceDate}, which is within 30 days of completion (${removalCompletionDate}).\n• TOS is earliest of: Invoice Date (${invoiceDate}) or Payment Date (${paymentDate}).`,
            rule: inv < pay
              ? `✅ Invoice Date (${invoiceDate}) is earlier than Payment Date (${paymentDate}).`
              : `✅ Payment Date (${paymentDate}) is earlier than Invoice Date (${invoiceDate}) (Advance tax applies).`
          };
        } else {
          const earliest = remComp < pay ? remComp : pay;
          const formatted = earliest.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          return {
            tos: formatted,
            reason: `Section 13(2) Forward Charge of Services (DELAYED INVOICE):\n• Invoice (${invoiceDate}) was issued more than 30 days after completion (${removalCompletionDate}).\n• TOS falls back to earliest of: Completion Date (${removalCompletionDate}) or Payment Date (${paymentDate}).`,
            rule: remComp < pay
              ? `⚠️ Since invoice was late, Completion Date (${removalCompletionDate}) governs because it is earlier than payment.`
              : `✅ Payment Date (${paymentDate}) is earlier than Completion Date (${removalCompletionDate}) (Advance tax code triggers).`
          };
        }
      }
      case 'goods_rcm': {
        const invoice31st = new Date(inv);
        invoice31st.setDate(invoice31st.getDate() + 31);
        
        const dates = [
          { name: 'Receipt of Goods Date', date: recG },
          { name: 'Payment Date', date: pay },
          { name: '31st Day from Invoice', date: invoice31st }
        ];
        
        dates.sort((a,b) => a.date.getTime() - b.date.getTime());
        const earliest = dates[0];
        const formatted = earliest.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        
        return {
          tos: formatted,
          reason: `Section 12(3) Reverse Charge on Goods:\n• TOS is earliest of: Receipt of Goods (${receiptGoodsDate}), Payment Date (${paymentDate}), or the day immediately following 30 days from Invoice Date (${invoice31st.toISOString().split('T')[0]}).`,
          rule: `🏆 Earliest trigger is: **${earliest.name}** (${earliest.date.toISOString().split('T')[0]})`
        };
      }
      case 'services_rcm': {
        const invoice61st = new Date(inv);
        invoice61st.setDate(invoice61st.getDate() + 61);
        
        const dates = [
          { name: 'Payment Date', date: pay },
          { name: '61st Day from Invoice', date: invoice61st }
        ];
        
        dates.sort((a,b) => a.date.getTime() - b.date.getTime());
        const earliest = dates[0];
        const formatted = earliest.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        
        return {
          tos: formatted,
          reason: `Section 13(3) Reverse Charge on Services:\n• TOS is earliest of: Payment Date (${paymentDate}) or the day immediately following 60 days from Invoice Date (${invoice61st.toISOString().split('T')[0]}).`,
          rule: `🏆 Earliest trigger is: **${earliest.name}** (${earliest.date.toISOString().split('T')[0]})`
        };
      }
      default:
        return { error: 'Unknown configuration' };
    }
  };

  const calcResult = calculateTOS();

  return (
    <div className="space-y-6 font-sans w-full text-white text-white animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-indigo-600">
        <div>
          <span className="text-[10px] font-mono font-black text-white text-white uppercase tracking-widest block font-extrabold">
            Statutory Timeline Framework
          </span>
          <h3 className="text-[15px] font-black text-white text-white uppercase tracking-tight mt-0.5">
            Chapter VII: Time of Supply (TOS) u/s 12 & 13
          </h3>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border dark:border-slate-800 border-slate-200 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-white text-white hover:text-white dark:hover:text-white'
            }`}
          >
            Statutory Rules
          </button>
          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-white text-white hover:text-white dark:hover:text-white'
            }`}
          >
            Interactive Evaluator 🧮
          </button>
        </div>
      </div>

      {activeSubTab === 'matrix' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs">
              <span className="text-[10px] font-mono font-black text-white bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-wider font-extrabold">
                Section 12: Goods TOS
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-white text-white">
                Forward Charge vs Reverse Charge
              </h4>
              <div className="space-y-2.5 text-xs text-white text-white leading-relaxed font-semibold">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-150 dark:border-slate-800 space-y-1">
                  <strong className="text-white text-white block font-black text-[10px] uppercase">
                    1. Forward Charge (Section 12(2)):
                  </strong>
                  <p>
                    Earliest of Invoice Date or Invoice Due Date u/s 31(1) (removal date).
                  </p>
                  <span className="text-[9px] font-bold text-white text-white bg-emerald-500/10 px-1.5 py-0.5 rounded block mt-1.5 border border-emerald-500/10">
                    💡 Notif 66/2017-CT Exemption: Advance payments are completely IGNORED for Goods Forward Charge.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-150 dark:border-slate-800 space-y-1">
                  <strong className="text-white text-white block font-black text-[10px] uppercase">
                    2. Reverse Charge (Section 12(3)):
                  </strong>
                  <p>Earliest of:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Date of physical receipt of goods</li>
                    <li>Date of payment (book entry or bank debit, earlier)</li>
                    <li>The day immediately following 30 days from date of supplier invoice</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 space-y-3 shadow-2xs">
              <span className="text-[10px] font-mono font-black text-white bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10 uppercase tracking-wider font-extrabold">
                Section 13: Services TOS
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-white text-white">
                Forward Charge vs Reverse Charge
              </h4>
              <div className="space-y-2.5 text-xs text-white text-white leading-relaxed font-semibold">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-150 dark:border-slate-800 space-y-1">
                  <strong className="text-white text-white block font-black text-[10px] uppercase">
                    1. Forward Charge (Section 13(2)):
                  </strong>
                  <p>Check if invoice was issued within 30 days of service execution:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li><strong className="text-white">Yes (Timely):</strong> Earliest of Invoice Date or Payment Date.</li>
                    <li><strong className="text-white">No (Delayed):</strong> Earliest of Completion Date or Payment Date.</li>
                  </ul>
                  <span className="text-[9px] font-bold text-white text-white bg-rose-500/5 px-1.5 py-0.5 rounded block mt-1.5 border border-rose-500/10">
                    ⚠️ NO exemption for services: Advance payments attract GST immediately on receipt date.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-150 dark:border-slate-800 space-y-1">
                  <strong className="text-white text-white block font-black text-[10px] uppercase">
                    2. Reverse Charge (Section 13(3)):
                  </strong>
                  <p>Earliest of:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    <li>Date of payment (book entry or bank debit)</li>
                    <li>The day immediately following 60 days from date of supplier invoice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 animate-pulse">
              <Zap className="h-4 w-4 text-white shrink-0" />
              <strong className="text-xs uppercase tracking-wider text-white text-white font-black">
                Section 12(4) & 13(4): Voucher Instrument Timeline
              </strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-semibold">
              If an entity issues commercial vouchers, the Time of Supply depends on whether the underlying supply is completely known at the time of issue:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white dark:bg-slate-950 rounded border dark:border-slate-800 border-slate-200">
                <span className="text-[9px] font-mono font-black text-white uppercase block mb-1">Identifiable at Issuance</span>
                <p className="text-xs text-white text-white font-semibold leading-relaxed">
                  TOS is the <strong className="text-white">date of issue of vouchers</strong> (e.g., a voucher restricted solely for purchasing HP laptops).
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-950 rounded border dark:border-slate-800 border-slate-200">
                <span className="text-[9px] font-mono font-black text-white uppercase block mb-1">General / Mixed Option</span>
                <p className="text-xs text-white text-white font-semibold leading-relaxed">
                  TOS is the <strong className="text-white">date of physical redemption</strong> (e.g., a general ₹2,000 Amazon shopping gift card redeemable for anything).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-1 space-y-4 font-semibold text-xs text-white text-white">
              <div>
                <label className="block text-white text-white font-black uppercase mb-1.5">1. Supply Pattern Flow</label>
                <select
                  value={calcModel}
                  onChange={(e) => setCalcModel(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-lg outline-hidden font-bold text-[#00f3ff]"
                >
                  <option value="goods_fwd" className="text-[#00f3ff] bg-[#07090f]" style={{ color: '#00f3ff', backgroundColor: '#07090f' }}>Goods - Normal Forward Charge</option>
                  <option value="services_fwd" className="text-[#00f3ff] bg-[#07090f]" style={{ color: '#00f3ff', backgroundColor: '#07090f' }}>Services - Normal Forward Charge</option>
                  <option value="goods_rcm" className="text-[#00f3ff] bg-[#07090f]" style={{ color: '#00f3ff', backgroundColor: '#07090f' }}>Goods - Reverse Charge (RCM)</option>
                  <option value="services_rcm" className="text-[#00f3ff] bg-[#07090f]" style={{ color: '#00f3ff', backgroundColor: '#07090f' }}>Services - Reverse Charge (RCM)</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-white font-black uppercase mb-1.5">2. Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-lg outline-hidden font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-white text-white font-black uppercase mb-1.5 font-extrabold">
                  {calcModel.includes('goods') ? '3. Removal of Goods / Delivery' : '3. Completion of Services'}
                </label>
                <input
                  type="date"
                  value={removalCompletionDate}
                  onChange={(e) => setRemovalCompletionDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-lg outline-hidden font-bold font-mono"
                />
              </div>

              {calcModel === 'goods_rcm' && (
                <div>
                  <label className="block text-white text-white font-black uppercase mb-1.5">4. Date of Receipt of Goods</label>
                  <input
                    type="date"
                    value={receiptGoodsDate}
                    onChange={(e) => setReceiptGoodsDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-lg outline-hidden font-bold font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-white text-white font-black uppercase mb-1.5 font-extrabold">
                  {calcModel.includes('fwd') ? '4. Payment Received Date' : '5. Payment Entry/Debit Date'}
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-lg outline-hidden font-bold font-mono"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col justify-start space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20 rounded-xl space-y-3 animate-in fade-in">
                <span className="text-[10px] font-mono text-white text-white uppercase tracking-widest font-black block">
                  Interactive Evaluation Output
                </span>
                
                {calcResult.error ? (
                  <span className="text-white text-xs font-bold block">{calcResult.error}</span>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-baseline gap-2">
                      <span className="text-xs text-white font-bold">Determined Time of Supply (TOS):</span>
                      <span className="text-sm font-black text-white text-white underline decoration-indigo-500/30">
                        {calcResult.tos}
                      </span>
                    </div>
                    
                    <div className="border-t dark:border-slate-805 border-slate-200 pt-3 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-white block uppercase tracking-wider">Statutory Breakdown:</span>
                      <p className="text-xs font-semibold text-white text-white leading-normal whitespace-pre-line font-medium">
                        {calcResult.reason}
                      </p>
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-white text-white font-bold mt-1">
                        {calcResult.rule}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-500/[0.01] text-xs font-semibold space-y-1.5 leading-relaxed text-white">
                <strong className="text-[10px] font-mono tracking-widest font-black text-white uppercase block mb-1">
                  📚 STUDY TIP FOR MULTIPLE CHOICE QUESTIONS
                </strong>
                <p>
                  Remember, for <strong>Services forward charge</strong>, if invoice is delayed beyond 30 days, completion date serves as the alternative anchor. If invoice is within 30 days, we compare invoice vs. payment directly. For <strong>Goods</strong>, payment date has zero value.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export function ValueOfSupplyHighFidelityView() {
  const [basePrice, setBasePrice] = useState<number>(100000);
  
  // Exclusions / Inclusions flags
  const [packingCharges, setPackingCharges] = useState(true);
  const [municipalTax, setMunicipalTax] = useState(true);
  const [interestReceived, setInterestReceived] = useState(false);
  const [ngoSubsidyIncl, setNgoSubsidyIncl] = useState(true);
  const [preInvoiceDiscount, setPreInvoiceDiscount] = useState(true);
  const [postInvoiceDiscount, setPostInvoiceDiscount] = useState(false);

  // Compute values
  const packingVal = packingCharges ? 2500 : 0;
  const municipalTaxVal = municipalTax ? 4000 : 0;
  const interestVal = interestReceived ? 1000 : 0; 
  const ngoSubsidyVal = ngoSubsidyIncl ? 7500 : 0;
  const preDiscountVal = preInvoiceDiscount ? 5000 : 0;
  const postDiscountVal = postInvoiceDiscount ? 3000 : 0;

  const totalTaxableValue = basePrice + packingVal + municipalTaxVal + interestVal + ngoSubsidyVal - preDiscountVal - postDiscountVal;

  return (
    <div className="space-y-6 font-sans w-full text-white text-white animate-in fade-in duration-200">
      <div className="pb-3 border-b-2 border-indigo-600">
        <span className="text-[10px] font-mono font-black text-white text-white tracking-widest block uppercase font-extrabold">
          Section 15 Transaction Base
        </span>
        <h3 className="text-[15px] font-black text-white text-white uppercase tracking-tight mt-0.5">
          Chapter VIII: Value of Supply u/s 15
        </h3>
        <p className="text-xs text-white font-semibold mt-0.5">
          Step-by-step statutory valuation matching inclusions u/s 15(2) and exclusions u/s 15(3)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b dark:border-slate-800 border-slate-100">
            <Coins className="h-4 w-4 text-white text-white shrink-0 animate-spin-slow" />
            <strong className="text-xs uppercase tracking-wider text-white text-white font-black">
              Interactive Valuation Formula Builder
            </strong>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-3.5 font-semibold text-xs">
              <div>
                <label className="block text-white text-white font-extrabold mb-1 uppercase text-[10px]">CONTRACT BASE PRICE u/s 15(1)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white font-bold">₹</span>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-6 p-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-lg outline-hidden font-bold"
                  />
                </div>
                <p className="text-[10px] text-white font-medium pt-1">Condition: Unrelated buyer & price is sole consideration.</p>
              </div>

              <div className="space-y-2 border-t dark:border-slate-800 border-slate-100 pt-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-black block">Inclusions u/s 15(2)</span>
                
                <label className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={packingCharges}
                    onChange={(e) => setPackingCharges(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-white focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="block font-black text-white text-white text-[11px]">Packing / Commission (+ ₹2,500)</span>
                    <span className="text-[10px] text-white block font-semibold">Sec 15(2)(c) Incidental Charges</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={municipalTax}
                    onChange={(e) => setMunicipalTax(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-white focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="block font-black text-white text-white text-[11px]">Municipal Tax (+ ₹4,000)</span>
                    <span className="text-[10px] text-white block font-semibold">Sec 15(2)(a) Non-GST levies</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={interestReceived}
                    onChange={(e) => setInterestReceived(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-white focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="block font-black text-white text-white text-[11px]">Late Payment Penalty (+ ₹1,180 recd)</span>
                    <span className="text-[10px] text-white block font-bold">Sec 15(2)(d) - Backcalculate 18% GST (adds ₹1,000)</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded transition-all">
                  <input
                    type="checkbox"
                    checked={ngoSubsidyIncl}
                    onChange={(e) => setNgoSubsidyIncl(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-white focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <span className="block font-black text-white text-white text-[11px]">NGO / Private Subsidy (+ ₹7,500)</span>
                    <span className="text-[10px] text-white block font-semibold">Sec 15(2)(e) Price-linked private funds</span>
                  </div>
                </label>
              </div>

            </div>

            <div className="space-y-3.5 border-t md:border-t-0 md:border-l dark:border-slate-800 border-slate-100 pt-3 md:pt-0 md:pl-4 font-semibold text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white font-black block">Discounts & Exempts u/s 15(3)</span>
              
              <label className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded transition-all">
                <input
                  type="checkbox"
                  checked={preInvoiceDiscount}
                  onChange={(e) => setPreInvoiceDiscount(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-white focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="block font-black text-white text-white text-[11px]">Invoice Discount Deducted (- ₹5,000)</span>
                  <span className="text-[10px] text-white block font-semibold">Sec 15(3)(a) Pre-supply regular discount</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-1 rounded transition-all">
                <input
                  type="checkbox"
                  checked={postInvoiceDiscount}
                  onChange={(e) => setPostInvoiceDiscount(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-white focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="block font-black text-white text-white text-[11px]">Post-Supply Volume Discount (- ₹3,000)</span>
                  <span className="text-[10px] text-white block font-bold">Sec 15(3)(b) Linked to invoice & Buyer reverses ITC</span>
                </div>
              </label>

              <div className="space-y-2 border-t dark:border-slate-800 border-slate-100 pt-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white font-black block">Legislative Exempts Checklist</span>
                
                <div className="flex items-start gap-2.5 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-[11px] text-white text-white leading-relaxed font-semibold">
                  <span className="mt-0.5 block shrink-0 text-white">✔</span>
                  <p>
                    <strong>Government Subsidies (Excluded):</strong> Subsidies provided by Central Government or State Government are unconditionally excluded from taxable value under Sec 15(2)(e).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[9px] font-mono tracking-widest text-white uppercase font-black">Statutory Receipt Mockup</span>
              <h4 className="text-xs font-extrabold uppercase mt-0.5 text-white tracking-wider">GST Valuation Registry</h4>
            </div>

            <div className="space-y-2 text-xs font-mono text-white">
              <div className="flex justify-between">
                <span>Base Transaction Price:</span>
                <span className="text-white font-bold">₹{basePrice.toLocaleString()}</span>
              </div>
              {packingCharges && (
                <div className="flex justify-between text-white">
                  <span>+ Packing Incidental Charges:</span>
                  <span>+₹2,500</span>
                </div>
              )}
              {municipalTax && (
                <div className="flex justify-between text-white">
                  <span>+ Municipal levies:</span>
                  <span>+₹4,000</span>
                </div>
              )}
              {interestReceived && (
                <div className="flex justify-between text-white font-bold">
                  <span>+ Delayed Interest Base (Excl GST):</span>
                  <span>+₹1,000</span>
                </div>
              )}
              {ngoSubsidyIncl && (
                <div className="flex justify-between text-white">
                  <span>+ NGO Price-linked Subsidy:</span>
                  <span>+₹7,500</span>
                </div>
              )}
              {preInvoiceDiscount && (
                <div className="flex justify-between text-rose-450">
                  <span>- Regular Face Discount:</span>
                  <span>-₹5,000</span>
                </div>
              )}
              {postInvoiceDiscount && (
                <div className="flex justify-between text-emerald-400">
                  <span>- Post-Supply Discount:</span>
                  <span>-₹3,000</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-800 pt-4 mt-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-black uppercase text-white tracking-wider">Taxable Value:</span>
              <span className="text-base font-black text-white underline decoration-indigo-400/30">
                ₹{totalTaxableValue.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-white/5 rounded-lg text-[10px] text-white leading-normal font-semibold font-medium">
              <strong className="text-white block font-black uppercase tracking-wider text-[8px] mb-0.5 font-bold">MCQ Hotspot: Late fee Interest</strong>
              Interest u/s 15(2)(d) is always loaded on a CASH/receipt basis. Real exam sheets always supply the gross penalty. E.g. If client pays ₹1,180 gross, you must divide by 1.18 to extract the taxable base value of ₹1,000.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function ExemptionsHighFidelityView() {
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'agri' | 'health' | 'edu' | 'rent'>('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen_1');

  const scenarios = [
    {
      id: 'scen_1',
      domain: 'Agri',
      title: 'Milling paddy into Rice',
      description: 'A miller charges ₹50,000 for custom milling of raw paddy into rice for a local farmer.',
      isExempt: false,
      reason: 'Rule: Custom milling of paddy is fully TAXABLE (18% GST). Reason: Paddy is agricultural produce, but rice is NOT. Processing paddy into rice changes its core micro-character, making it a post-harvest manufacturing process.'
    },
    {
      id: 'scen_2',
      domain: 'Health',
      title: 'Hospital Room renting at ₹7,500/day',
      description: 'A patient is admitted to an ICU room costing ₹7,500 per day for normal recovery treatment.',
      isExempt: false,
      reason: 'Rule: Taxable at 5% GST (without ITC). Reason: Although clinical healthcare is exempt, renting a hospital room exceeding ₹5,000 per day is carved out of exemptions by statutory notification.'
    },
    {
      id: 'scen_3',
      domain: 'Edu',
      title: 'College security guarding sub-contract',
      description: 'A professional security agency provides housekeeping & gate guard services to a recognized higher education MBA college.',
      isExempt: false,
      reason: 'Rule: TAXABLE at 18% GST. Reason: Services provided TO an educational institution representing security, catering, or housekeeping are ONLY exempt if provided to a preschool or secondary school (up to Grade 12).'
    },
    {
      id: 'scen_4',
      domain: 'Rent',
      title: 'Renting home to unregistered family',
      description: 'An individual rents out a residential 3BHK flat in Mumbai to an unregistered family solely for use as their residence.',
      isExempt: true,
      reason: 'Rule: EXEMPT. Reason: Renting of residential dwelling for use as residence remains unconditionally exempt, provided the tenant is not registered under GST (if registered, the tenant pays GST u/s 9(3) under RCM).'
    },
    {
      id: 'scen_5',
      domain: 'Agri',
      title: 'Storage of food grains inside APMC yard',
      description: 'Renting out a warehouse for storing wheat grains and commission agent fees paid under APMC marketplace rules.',
      isExempt: true,
      reason: 'Rule: EXEMPT. Reason: Warehousing or storing of core agricultural produce (wheat, paddy, pulses, vegetables) is fully exempt to protect farming interests.'
    }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  return (
    <div className="space-y-6 font-sans w-full text-white text-white animate-in fade-in duration-200">
      <div className="pb-3 border-b-2 border-indigo-600">
        <span className="text-[10px] font-mono font-black text-white text-white tracking-widest block uppercase font-extrabold">
          Section 11 Statutory Shield
        </span>
        <h3 className="text-[15px] font-black text-white text-white uppercase tracking-tight mt-0.5">
          Chapter VI: Exemptions from GST u/s 11
        </h3>
        <p className="text-xs text-white font-semibold mt-0.5">
          Comprehensive review of social welfare exemptions and high-tax litigation boundaries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border dark:border-slate-800 border-slate-200 flex-wrap gap-1">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedDomain === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-white hover:text-white text-white'
              }`}
            >
              All Domains
            </button>
            <button
              onClick={() => setSelectedDomain('agri')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedDomain === 'agri' ? 'bg-indigo-600 text-white shadow-xs' : 'text-white hover:text-white text-white'
              }`}
            >
              Agriculture
            </button>
            <button
              onClick={() => setSelectedDomain('health')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedDomain === 'health' ? 'bg-indigo-600 text-white shadow-xs' : 'text-white hover:text-white text-white'
              }`}
            >
              Healthcare
            </button>
            <button
              onClick={() => setSelectedDomain('edu')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedDomain === 'edu' ? 'bg-indigo-600 text-white shadow-xs' : 'text-white hover:text-white text-white'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setSelectedDomain('rent')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                selectedDomain === 'rent' ? 'bg-indigo-600 text-white shadow-xs' : 'text-white hover:text-white text-white'
              }`}
            >
              Renting/Finance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {(selectedDomain === 'all' || selectedDomain === 'agri') && (
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5 shadow-2xs">
                <span className="text-[9px] font-mono font-black text-white bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest font-extrabold">
                  Agriculture Sector
                </span>
                <strong className="block text-xs text-white text-white uppercase font-black tracking-wider">Agro Exceptions Matrix</strong>
                <ul className="text-xs font-semibold text-white text-white space-y-1.5 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-white font-bold shrink-0">✔ Exempt:</span>
                    <span>Culturing, farm labor supply, warehouse loading/storage of fruits & vegetables, agricultural extension.</span>
                  </li>
                  <li className="flex items-start gap-1.5 pb-1 border-b dark:border-slate-800 border-slate-100">
                    <span className="text-white font-bold shrink-0 block">✖ Taxable:</span>
                    <span>Custom milling of paddy into rice, tea roasting, processes altering basic farm properties.</span>
                  </li>
                </ul>
              </div>
            )}

            {(selectedDomain === 'all' || selectedDomain === 'health') && (
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl space-y-2.5 shadow-2xs">
                <span className="text-[9px] font-mono font-black text-white bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest font-extrabold">
                  Human Healthcare
                </span>
                <strong className="block text-xs text-white text-white uppercase font-black tracking-wider">Clinical Exempt limits</strong>
                <ul className="text-xs font-semibold text-white text-white space-y-1.5 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-white font-bold shrink-0">✔ Exempt:</span>
                    <span>Diagnostics, surgery, patient care inside licensed clinics, ambulances, AYUSH systems.</span>
                  </li>
                  <li className="flex items-start gap-1.5 pb-1 border-b dark:border-slate-800 border-slate-100">
                    <span className="text-white font-bold shrink-0 font-extrabold">✖ Taxable:</span>
                    <span>Cosmetic/hair transplants (unless traumatic restore), hospital suite renting exceeding <strong>₹5,000 per day</strong>.</span>
                  </li>
                </ul>
              </div>
            )}

            {(selectedDomain === 'all' || selectedDomain === 'edu') && (
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl space-y-2.5 shadow-2xs">
                <span className="text-[9px] font-mono font-black text-white bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10 uppercase tracking-widest font-extrabold">
                  Education Services
                </span>
                <strong className="block text-xs text-white text-white uppercase font-black tracking-wider">To & By Institution Bounds</strong>
                <ul className="text-xs font-semibold text-white text-white space-y-1.5 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-white font-bold shrink-0">✔ Exempt BY:</span>
                    <span>Any services by tuition/preschools, recognized graduation colleges to students/staff.</span>
                  </li>
                  <li className="flex items-start gap-1.5 pb-1 border-b dark:border-slate-805 border-slate-105">
                    <span className="text-white font-bold shrink-0 font-extrabold">✖ Taxable TO:</span>
                    <span>Housekeeping / Catering supplied to Engineering or Medical colleges. (Exempt solely for schools &le; Grade 12).</span>
                  </li>
                </ul>
              </div>
            )}

            {(selectedDomain === 'all' || selectedDomain === 'rent') && (
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl space-y-2.5 shadow-2xs">
                <span className="text-[9px] font-mono font-black text-white bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10 uppercase tracking-widest font-extrabold">
                  Renting & Finance
                </span>
                <strong className="block text-xs text-white text-white uppercase font-black tracking-wider">Interest vs Ledger Fees</strong>
                <ul className="text-xs font-semibold text-white text-white space-y-1.5 leading-relaxed font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-white font-bold shrink-0">✔ Exempt:</span>
                    <span>Saving deposits or bank loan interest charges, renting home to unregistered tenant.</span>
                  </li>
                  <li className="flex items-start gap-1.5 pb-1 border-b dark:border-slate-805 border-slate-105">
                    <span className="text-white font-bold shrink-0 font-extrabold">✖ Taxable:</span>
                    <span>Credit card overdue interest, loan ledger processing charges, renting to registered businesses.</span>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 border-slate-200 rounded-2xl flex flex-col justify-between font-semibold text-xs space-y-4 shadow-3xs">
          <div className="space-y-4">
            <div className="pb-2 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
              <strong className="text-xs font-black uppercase text-white text-white tracking-wider">
                Exemption Scenario Validator
              </strong>
              <span className="text-[8px] font-mono text-white font-bold tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-extrabold">
                Interactive Test Bed
              </span>
            </div>

            <div className="space-y-3 font-semibold text-xs">
              <label className="block text-[10px] text-white uppercase tracking-wider font-bold">Select Active Scenario:</label>
              <div className="flex flex-col gap-2">
                {scenarios.map((scen) => (
                  <button
                    key={scen.id}
                    onClick={() => setSelectedScenarioId(scen.id)}
                    className={`p-2.5 text-left rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      selectedScenarioId === scen.id
                        ? 'bg-indigo-650 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-950 text-white text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    🚀 {scen.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 space-y-2 shadow-3xs animate-in fade-in">
              <span className="text-[9px] font-mono text-white font-bold uppercase tracking-widest block">Scenario description:</span>
              <p className="text-xs font-semibold text-white text-white leading-relaxed font-medium">
                {currentScenario.description}
              </p>
              
              <div className="pt-2 border-t dark:border-slate-800 border-slate-100 flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Statutory Status:</span>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                  currentScenario.isExempt
                    ? 'bg-emerald-500/10 text-white text-white border border-emerald-500/10'
                    : 'bg-rose-500/10 text-white text-white border border-rose-500/10'
                }`}>
                  {currentScenario.isExempt ? '✔ EXEMPT' : '✖ TAXABLE'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/[0.04] rounded-lg border border-indigo-500/10 text-[11px] text-white text-white leading-relaxed font-medium">
            {currentScenario.reason}
          </div>
        </div>

      </div>
    </div>
  );
}

export function IfosHighFidelityView() {
  return (
    <div className="space-y-8 font-sans w-full text-white text-white">
      
      {/* SECTION 1: CORE HEAD STRUCTURE & CHARGEABILITY u/s 56 & 145 */}
      <div className="p-5 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Scale className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 1: Residuary Charging Framework & Accounting Controls
              </h4>
              <p className="text-[11px] text-white font-medium">Statutory conditions for chargeability under the residuary head of income</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10 uppercase">
              SEC 56 & SEC 145
            </span>
          </div>
        </div>

        {/* High-Yield Leaflet Content */}
        <div className="space-y-3.5 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg">
            <span className="font-extrabold text-white text-white block uppercase tracking-tight text-[10px] mb-1.5 font-mono">
              Core Dual-Conditions for Charging:
            </span>
            <ul className="list-decimal pl-4 space-y-1.5 text-white text-white list-inside font-medium leading-relaxed">
              <li>
                <strong className="text-white text-white">Includibility Factor:</strong> The income must be legally includible in the total gross income of the assessee.
              </li>
              <li>
                <strong className="text-white text-white">Residuary Factor:</strong> The incoming gain cannot be appropriately or legally classified under any of the preceding four specific heads of income:
                <div className="pl-4 mt-1 font-mono text-[10px] text-white text-white">
                  ↪ [Salaries] ⎯⎯ [House Property] ⎯⎯ [Profits & Gains of Business/Profession] ⎯⎯ [Capital Gains]
                </div>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-amber-500/[0.03] border border-amber-500/10 rounded-lg">
            <span className="font-extrabold text-white text-white block uppercase tracking-tight text-[10px] mb-1 font-mono flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Method of Accounting & ICDS Enforcement [Section 145]
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-white text-white font-medium list-inside leading-relaxed mt-1">
              <li>
                <span className="font-bold">Accounting Dual Match:</span> Income is taxable according to whichever system of accounting (Cash or Mercantile) is regularly employed by the assessee.
              </li>
              <li>
                <span className="font-bold">ICDS Mandate:</span> If the <strong className="text-white text-white">mercantile system</strong> is followed, the assessee MUST adhere to the ten notified <strong className="text-white text-white">Income Computation and Disclosure Standards (ICDSs)</strong>.
              </li>
              <li>
                <span className="font-bold">Auditable Exemption:</span> Individuals and Hindu Undivided Families (HUFs) who are not required to get their books audited u/s 44AB are completely exempt from mandatory ICDS compliance.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEEMED DIVIDEND STATUTORY ENGINE [SECTION 2(22)(a) to (e)] */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-white text-white border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Coins className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 2: The Deemed Dividend Engine [Section 2(22)(a) to (e)]
              </h4>
              <p className="text-[11px] text-white font-medium">Detailed statutory classifications and conditions for treating corporate payouts as dividends</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-white text-white border border-emerald-500/10 uppercase">
              DEEMED DIVIDEND TREE
            </span>
          </div>
        </div>

        {/* Structured Table for Deemed Dividends */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-800">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-black text-white text-white uppercase text-[10px] tracking-wider w-1/5">Sub-section</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-black text-white text-white uppercase text-[10px] tracking-wider w-2/5">Nature of Payment / Distribution</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-black text-white text-white uppercase text-[10px] tracking-wider w-2/5">Deeming Extent & Key Specifics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-medium">
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono font-bold text-white text-white bg-indigo-50/10">Section 2(22)(a)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  <span className="font-bold">Distribution of Accumulated Profits</span> entailing release of company's assets.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable up to <strong className="text-white text-white">accumulated profits</strong> (capitalised or not).<br />
                  • If distributed in kind (e.g., shares of other companies), the market value on date of distribution is deemed taxable.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono font-bold text-white text-white bg-indigo-50/10">Section 2(22)(b)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  <span className="font-bold">Debentures, Debenture Stock, or Deposit Certificates</span> to any shareholders; or <span className="font-bold">Bonus Shares to Preference Shareholders</span>.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable to preference owners up to the accumulated profits.<br />
                  • Debentures valued at market rate.<br />
                  • <strong className="text-white text-white">⚠️ BONUS shares given to equity shareholders are strictly excluded.</strong>
                </td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono font-bold text-white text-white bg-indigo-50/10">Section 2(22)(c)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  <span className="font-bold">Distribution on Company Liquidation</span>.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Deemed dividend to the extent attributable to accumulated profits immediately before liquidation (capitalised or not).<br />
                  • Distributions from profits earned <strong className="font-bold">after</strong> the date of liquidation are capital repayments, not taxable as dividends.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono font-bold text-white text-white bg-indigo-50/10">Section 2(22)(d)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  <span className="font-bold">Distribution on Capital Reduction</span>.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable up to accumulated profits possessed by the company.
                </td>
              </tr>
              <tr className="bg-emerald-500/[0.01]">
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono font-bold text-white text-white bg-emerald-50/15">Section 2(22)(e)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white col-span-1">
                  <span className="font-bold">Advance or Loan by a Closely Held Company</span> to:<br />
                  1. Beneficial owner of <strong className="text-white">≥10% voting power</strong> (equity shares); or<br />
                  2. A <span className="font-bold">specified concern</span> in which such owner is member/partner with <strong className="text-white">≥10% equity</strong> and has <span className="font-bold">substantial interest (≥20% share of income)</span>; or<br />
                  3. Any payment on behalf of, or for individual benefit of, such shareholder.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable strictly up to accumulated profits (repayment doesn't cancel tax liability).<br />
                  • <strong className="text-white text-white font-bold">Subsequent loan repayment or interest payment at market rates does NOT reduce applicability.</strong><br />
                  • Limited strictly to un-capitalised accumulated profits (excludes capitalised reserves).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Trade Advances Exception Box */}
        <div className="p-3.5 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-xl space-y-2">
          <span className="font-extrabold text-[10.5px] text-white text-white block uppercase font-mono">
            💡 CORE STATUTORY EXCEPTIONS TO SECTION 2(22)(e) - TRADE ADVANCES
          </span>
          <p className="text-white text-white text-xs font-medium leading-relaxed">
            Per <strong className="text-white text-white">Circular No. 19/2017</strong> and supreme judicial rulings:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-white text-white text-[11px] font-medium leading-relaxed">
            <li>
              <strong className="text-white text-white">Ordinary Lending:</strong> Loans granted in the ordinary course of business whose primary substantial activity is money lending.
            </li>
            <li>
              <strong className="text-white text-white">Trade Advances / Commercial Contracts:</strong> Advanced amounts made towards standard business transactions, job work, or business expediency (e.g., advancing to a sister job-worker concern or installing plants for exports). These are NOT deemed dividends.
            </li>
            <li>
              <strong className="text-white text-white">Dividends Set-off:</strong> If a loan is already taxed u/s 2(22)(e) and subsequently the company distributes physical dividends to this share-owner, such dividend amount is set-off against the taxed loan and not taxed again.
            </li>
          </ul>
        </div>
      </div>

      {/* SECTION 3: GIFTS & VALUE TRANSFERS FOR INADEQUATE CONSIDERATIONS [SEC 56(2)(x)] */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-white text-white border border-amber-500/20 flex items-center justify-center shrink-0">
              <Gift className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 3: Gift & Under-Value Transfer Framework [Section 56(2)(x)]
              </h4>
              <p className="text-[11px] text-white font-medium">Exhaustive statutory boundaries, valuation rules, and relationship exclusions for received property</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-amber-500/10 text-white text-white border border-amber-500/10 uppercase">
              SEC 56(2)(x) GATEWAY
            </span>
          </div>
        </div>

        {/* Text Flowchart representation of Section 56(2)(x) Gateway */}
        <div className="p-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-1 bg-slate-50 dark:bg-slate-950">
          <span className="text-[9px] font-mono font-black text-white text-white uppercase block">Gateway Logic flowchart:</span>
          <div className="text-[10px] space-y-1 flex flex-col font-medium font-mono text-white text-white">
            <div>[Incoming Receipt of Money or Property]</div>
            <div>&nbsp;&nbsp;↓</div>
            <div>&nbsp;&nbsp;↳ [Check: From defined Relative / Exempt Occasion (e.g., Marriage)?]</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ YES ➔ Fully Exempt / Outside 56(2)(x) Scope</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ NO  ➔ Check Thresholds & Specific Rules below:</div>
          </div>
        </div>

        {/* Grounding Matrix Table for Gifts */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-800">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-black text-white text-white uppercase text-[10px]">Asset Category</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-black text-white text-white uppercase text-[10px]">Without Consideration (Gift)</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-black text-white text-white uppercase text-[10px]">Inadequate Consideration (Undervalued)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-medium">
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold bg-slate-50 dark:bg-slate-950/20 text-white text-white">1. Sum of Money</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable if the <strong className="text-white text-white uppercase tracking-tight">aggregate</strong> received during the Previous Year <strong className="text-white text-white">exceeds ₹50,000</strong>.<br />
                  • Taxed on the <strong className="text-white text-white">whole</strong> of such aggregate value.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white font-mono text-[10px] bg-slate-100/30 dark:bg-slate-950/30">
                  [Not Applicable to cash currency]
                </td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold bg-slate-50 dark:bg-slate-950/20 text-white text-white text-[11px]">
                  2. Immovable Property<br />
                  <span className="text-[9px] font-mono font-medium text-white">[Land/Building/Both]</span>
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable if stamp duty value (SDV) <strong className="text-white text-white">exceeds ₹50,000</strong>.<br />
                  • Evaluated <strong className="text-white text-white font-bold underline">separately for each individual property</strong>.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable if Difference between SDV and Consideration is <strong className="text-white text-white font-extrabold text-[12px]">MORE THAN THE HIGHER OF:</strong><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;1. <strong className="text-white text-white">₹50,000</strong>, AND<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;2. <strong className="text-white text-white">10% of total Consideration</strong> paid.<br />
                  • Difference represents taxable income.
                </td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold bg-slate-50 dark:bg-slate-950/20 text-white text-white text-[11px]">
                  3. Movable Property<br />
                  <span className="text-[9px] font-mono font-medium text-white">[Shares, Jewelry, Art, etc.]</span>
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable if the <strong className="text-white text-white">aggregate Fair Market Value (FMV)</strong> of such property <strong className="text-white text-white">exceeds ₹50,000</strong>.
                </td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 text-white text-white">
                  • Taxable if the difference between aggregate FMV and consideration received <strong className="text-white text-white">exceeds ₹50,000</strong>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Structural Text Details for Property & Relatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Defined property */}
          <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-850 text-[11px] space-y-1.5">
            <span className="font-extrabold text-[10px] text-white text-white uppercase font-mono block">
              ✦ "PROPERTY" BOUNDARY DEFENCE : STRICT EXCLUSIONS
            </span>
            <p className="text-white text-white font-medium leading-relaxed">
              Section 56(2)(x) strictly applies only to specified capital assets of the receiver. It covers:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-white text-white font-medium">
              <li>Immovable property (Land/building/both)</li>
              <li>Shares and securities</li>
              <li>Jewellery, archaeological collections, drawings</li>
              <li>Paintings, sculptures, any works of art, or bullion</li>
              <li>Virtual Digital Assets (VDAs)</li>
            </ul>
            <p className="text-white text-white font-extrabold text-[10px] bg-rose-500/[0.03] p-1.5 rounded border border-rose-500/10">
              ⚠️ CARS, standard electronic items, and consumer durables are NOT included in the statutory definition of "property". A gifted luxury car has zero tax implications under Section 56(2)(x).
            </p>
          </div>

          {/* Relatives list */}
          <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-850 text-[11px] space-y-1.5">
            <span className="font-extrabold text-[10px] text-white text-white uppercase font-mono block">
              ✦ STATUTORY "RELATIVE" DEFINITION GATEWAY
            </span>
            <p className="text-white text-white font-medium leading-relaxed">
              Gifts from <strong className="text-white text-white">Relatives</strong> are completely exempt. Relatives are strictly defined as:
            </p>
            <ol className="list-decimal pl-4 space-y-0.5 text-white text-white font-medium">
              <li>Spouse of the individual.</li>
              <li>Brother or sister of the individual.</li>
              <li>Brother or sister of the spouse of the individual.</li>
              <li>Brother or sister of either of the parents of the individual.</li>
              <li>Any lineal ascendant or descendant of the individual.</li>
              <li>Any lineal ascendant or descendant of the spouse.</li>
              <li>Spouse of any of the persons mentioned in points 2 to 6.</li>
              <li>In case of a HUF, <strong className="text-white text-white">any member thereof</strong>.</li>
            </ol>
            <span className="text-[10px] font-mono text-white block leading-tight">
              ⚠️ Nieces, nephews, cousins, or sister's children do NOT fit the statutory definition of "relative". Gifts from them are fully taxable if above ₹50,000.
            </span>
          </div>
        </div>

        {/* Specialized Exemptions u/s 56(2)(x) & COVID Relief */}
        <div className="p-3.5 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-xl text-xs space-y-2">
          <span className="font-extrabold text-[10.5px] text-white text-white block uppercase font-mono">
            💡 ADDITIONAL STATUTORY EXEMPTIONS & SPECIAL ENCLAVES
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-white text-white font-medium">
            <div className="space-y-1">
              <strong className="text-white text-white block font-bold text-[11px]">General Exempt Occasions:</strong>
              <p className="text-[11px] text-white leading-relaxed">
                • Received on the occasion of the individual's <span className="underline">marriage</span>.<br />
                • Received under a <span className="underline">will or by inheritance</span>.<br />
                • In contemplation of death of the payer or donor.<br />
                • From any local authority, registered university/hospital or trusts u/s 12A/12AB.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white text-white block font-bold text-[11px]">COVID-19 Statutory Enclaves:</strong>
              <p className="text-[11px] text-white leading-relaxed">
                • Received for medical costs incurred for self/family treatment (Form No. 1 within 9 months).<br />
                • Decendent's family receiving money from employer is exempt (no ceiling limit); or from other parties up to ₹10 Lakhs, if received within 12 months from death (Form A within 9 months).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CASUAL INCOME, INTEREST ON COMPENSATION, & LIF matured u/s 56(2) */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Percent className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 4: Casual Incomes, enhanced compensation interest, & LIP controls
              </h4>
              <p className="text-[11px] text-white font-medium">Special tax rates and statutory rules for lotteries, online winnings, and oversized life insurance policies</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10 uppercase">
              HIGH RATE & LIP CORES
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
          
          {/* Card 1: Casual Income */}
          <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-850 space-y-2">
            <span className="font-extrabold text-[10px] text-white bg-rose-500/5 px-2 py-0.5 rounded font-mono uppercase block w-max">
              Sec 115BB & 115BBJ
            </span>
            <strong className="text-white text-white block font-bold">Winnings & Online Games</strong>
            <ul className="list-disc pl-3.5 space-y-1 text-white text-white text-[11px] list-outside">
              <li>
                <strong className="text-white text-white font-bold">Flat 30% Tax:</strong> Flat tax rate applies to winnings from lotteries, races, betting, etc. plus 4% education cess.
              </li>
              <li>
                <strong className="text-white text-white font-bold">Zero Deductions:</strong> No basic exemption limit adjustment, no expenditure u/s 57, and no Chapter VI-A deductions are allowed.
              </li>
              <li>
                <strong className="text-white text-white font-bold">Online Games (115BBJ):</strong> Net winnings from online games are taxed similarly at flat 30%.
              </li>
            </ul>
          </div>

          {/* Card 2: Interest on Compensation */}
          <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-850 space-y-2">
            <span className="font-extrabold text-[10px] text-white bg-indigo-500/5 px-2 py-0.5 rounded font-mono uppercase block w-max">
              Sec 56(2)(viii) & 57(iv)
            </span>
            <strong className="text-white text-white block font-bold">Compensation Interest Engine</strong>
            <ul className="list-disc pl-3.5 space-y-1 text-white text-white text-[11px] list-outside">
              <li>
                <strong className="text-white text-white font-bold">Year of Receipt:</strong> Taxable entirely in the Previous Year in which it is received, irrespective of when it accrued or the accounting system followed.
              </li>
              <li>
                <strong className="text-white text-white font-bold">Flat 50% Deduction:</strong> Section 57(iv) allows a statutory <strong className="text-white text-white text-[12px]">flat deduction of 50%</strong>. No other expenditures are permissible.
              </li>
            </ul>
          </div>

          {/* Card 3: LIP Not Exempt */}
          <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-850 space-y-2">
            <span className="font-extrabold text-[10px] text-white bg-amber-500/5 px-2 py-0.5 rounded font-mono uppercase block w-max">
              Sec 56(2)(xiii) & Rule 11UACA
            </span>
            <strong className="text-white text-white block font-bold">LIP Maturity & Premium Cap</strong>
            <ul className="list-disc pl-3.5 space-y-1 text-white text-white text-[11.5px] list-outside">
              <li>
                <strong className="text-white text-white font-bold">₹5,00,000 threshold:</strong> Multi-policy premium sum exceeds ₹5,00,000 for policies issued on/after 1.4.2023.
              </li>
              <li>
                <strong className="text-white text-white font-bold">Rule 11UACA Taxable sum:</strong>
                <div className="bg-slate-500/5 p-1 rounded font-mono text-[9px] mt-1 space-y-0.5">
                  • 1st receipt = A - B<br />
                  • Subs receipts = C - D<br />
                  (A/C = Net receipts; B/D = Total premiums paid which haven't been claimed as deduction u/s 80C etc.)
                </div>
              </li>
              <li>
                <strong className="text-white text-white">Nominee Exception:</strong> Death benefits received by a nominee are 100% exempt. Term life insurance is fully exempt u/s 10(10D).
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 5: ALLOWABLE VS DISALLOWABLE DEDUCTIONS SIDE-BY-SIDE */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-white text-white border border-rose-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 5: Allowable vs Disallowable Deductions [Section 57 & 58]
              </h4>
              <p className="text-[11px] text-white font-medium">Clear comparative matrix of permissible expenditures and statutory business disallowances under IFOS</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-rose-500/10 text-white text-white border border-rose-500/10 uppercase">
              DEDUCTIONS CHECKS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          
          {/* Allowable Section 57 */}
          <div className="p-3.5 bg-emerald-500/[0.01] border border-emerald-500/10 rounded-xl space-y-2.5">
            <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-white text-white px-2.5 py-0.5 rounded font-black tracking-wider block w-max">
              Allowable Deductions [Section 57]
            </span>
            
            <ul className="space-y-2 text-white text-white list-inside text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✔</span>
                <div>
                  <strong className="text-white text-white">Dividend / Mutual Fund Interest Expense:</strong> Interest cost to earn dividend is allowable, but strictly <strong className="text-white text-white">capped at a maximum of 20%</strong> of the dividend/income sum. No other deductions.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✔</span>
                <div>
                  <strong className="text-white text-white">Bank realized charges:</strong> Any reasonable bank commission/remuneration paid u/s 57(i) to realize dividend or securities interest.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✔</span>
                <div>
                  <strong className="text-white text-white">Letting active repair & costs:</strong> Repairs, fire insurance premuim, and depreciation u/s 57(ii) for letting out machinery, plant, or furniture (with or without inseparable factory building).
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✔</span>
                <div>
                  <strong className="text-white text-white">Family Pension:</strong> Deduction is strictly allowed to the extent of <strong className="text-white text-white text-[12px]">33-1/3% of pension or:</strong>
                  <div className="pl-3 mt-1 text-[10px] text-white font-mono">
                    • ₹15,000 u/s 57(iia) [under Optional/Old Tax Regime]<br />
                    • ₹25,000 u/s 57(iia) [under Default Tax Regime u/s 115BAC]
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Disallowable Section 58 */}
          <div className="p-3.5 bg-rose-500/[0.01] border border-rose-500/10 rounded-xl space-y-2.5">
            <span className="text-[10px] font-mono uppercase bg-rose-500/15 text-white text-white px-2.5 py-0.5 rounded font-black tracking-wider block w-max">
              Disallowable Deductions [Section 58]
            </span>

            <ul className="space-y-2 text-white text-white list-inside text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✖</span>
                <div>
                  <strong className="text-white text-white">Personal Expenditures:</strong> Any personal or private expenses of the assessee.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✖</span>
                <div>
                  <strong className="text-white text-white">Overseas transactions without TDS:</strong> Interest or salaries payable outside India on which taxes have not been paid or deducted at source.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✖</span>
                <div>
                  <strong className="text-white text-white">Excessive relative payments & cash u/s 58(2):</strong> Payments made to related parties u/s 40A(2) to the extent they are excessive compared to FMV; or day payments of cash <strong className="text-white inline font-mono">exceeding ₹10,000</strong>.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✖</span>
                <div>
                  <strong className="text-white text-white">30% resident payments:</strong> Disallowance of 30% of payables to a resident if tax is deductible at source and not deducted or not paid before return filing date.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-white font-bold mt-0.5">✖</span>
                <div>
                  <strong className="text-white text-white">Expenses against Casual winnings:</strong> Absolutely no deductions or allowances whatsoever u/s 58(4) in computing casual prize/winning incomes.
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}

export function BasicConceptsHighFidelityView() {
  const [unexplainedCredit, setUnexplainedCredit] = useState<number>(100000);

  // Sec 115BBE Computations
  const baseTax = unexplainedCredit * 0.60;
  const surcharge = baseTax * 0.25;
  const cess = (baseTax + surcharge) * 0.04;
  const netTaxableTax = baseTax + surcharge + cess;
  const effectivePercentage = unexplainedCredit > 0 ? (netTaxableTax / unexplainedCredit) * 100 : 78;

  return (
    <div className="space-y-8 font-sans w-full text-white text-white">
      
      {/* SECTION 1: CONSTITUTIONAL AUTHORITY & PILLARS */}
      <div className="p-5 rounded-2xl border border-indigo-650/20 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Scale className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 1: Constitutional Source & Pillars of Direct Tax
              </h4>
              <p className="text-[11px] text-white font-medium font-sans">Legislative bounds and five core pillars establishing the Income-tax regime</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10 uppercase">
              ART 265 & ENTRY 82
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          {/* Legislative jurisdiction Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-black text-white text-white uppercase tracking-wider block">Constitutional Limits</span>
            <ul className="space-y-2 text-white text-white list-inside list-disc">
              <li>
                <strong className="text-white text-white">Article 265:</strong> Strict bar on taxes. No tax shall be levied or collected except by direct authority of parliament/legislative law.
              </li>
              <li>
                <strong className="text-white text-white">Entry 82 of List I (Seven Sch):</strong> Authorizes Parliament to tax "Income other than agricultural income" (which belongs to State List Entry 46).
              </li>
            </ul>
          </div>

          {/* Pillars List Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-black text-white text-white uppercase tracking-wider block">The 5 Pillars of direct tax</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-1 px-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">1. IT Act, 1961</div>
              <div className="p-1 px-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">2. Income Tax Rules, 1962</div>
              <div className="p-1 px-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">3. Annual Finance Acts</div>
              <div className="p-1 px-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900">4. CBDT Circulars & Rules</div>
              <div className="p-1 px-2 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900 col-span-2 text-center text-white text-white">5. Supreme Court & HC Judicial Precedents</div>
            </div>
          </div>
        </div>

        {/* Rules of Interpretation matrix */}
        <div className="overflow-x-auto text-xs bg-slate-50 dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-white text-white tracking-wider font-mono block mb-2">Rules of Statutory Interpretation</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px] leading-relaxed">
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/60">
              <strong className="text-white text-white block mb-1">1. Literal Interpretation</strong>
              Apply plain, natural and grammatical meaning. If unambiguous, do not lookup secondary intent.
            </div>
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/60">
              <strong className="text-white text-white block mb-1">2. Heydon's / Mischief Rule</strong>
              Look at position before law/amendment, identify the "mischief" and parse how the statute cures it.
            </div>
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/60">
              <strong className="text-white text-white block mb-1">3. Golden Rule</strong>
              Departure from literal meaning is valid only if literal interpretation leads to absolute absurdity.
            </div>
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/60">
              <strong className="text-white text-white block mb-1">4. Strict Penal & Exempt</strong>
              Penal provisions is interpreted strictly. Ambiguities benefit the taxpayer. Exemptions benefit Revenue.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STATUTORY EXCEPTIONS - PY TAXED IN ITSELF */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-white text-white border border-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 2: Symmetric Temporal Matching & Exceptions
              </h4>
              <p className="text-[11px] text-white font-medium">Under Section 3, PY income is taxed in AY. Five critical anti-evasion statutory exceptions exist:</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-amber-500/10 text-white text-white border border-amber-500/10 uppercase">
              PY Taxed in PY itself
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="font-mono text-[10px] font-bold text-white bg-amber-500/5 px-2 py-0.5 rounded uppercase font-bold">Sec 172</span>
            <strong className="block text-white text-white mt-1">Non-Resident Shipping</strong>
            <p className="text-[11px] text-white text-white leading-relaxed font-sans">Must offer tax @ 7.5% of freight earned before departing Indian port waters.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="font-mono text-[10px] font-bold text-white bg-amber-500/5 px-2 py-0.5 rounded uppercase font-bold">Sec 174</span>
            <strong className="block text-white text-white mt-1">Leaving India</strong>
            <p className="text-[11px] text-white text-white leading-relaxed font-sans">Individuals departing with zero intent to return; assessed immediately up to departure date.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="font-mono text-[10px] font-bold text-white bg-amber-500/5 px-2 py-0.5 rounded uppercase font-bold">Sec 174A</span>
            <strong className="block text-white text-white mt-1">Short Duration Body</strong>
            <p className="text-[11px] text-white text-white leading-relaxed font-sans">AOP, BOI or artificial bodies formed for brief events or single ventures.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="font-mono text-[10px] font-bold text-white bg-amber-500/5 px-2 py-0.5 rounded uppercase font-bold">Sec 175</span>
            <strong className="block text-white text-white mt-1">Asset Transfer</strong>
            <p className="text-[11px] text-white text-white leading-relaxed font-sans">Transferring assets with deliberate objective of tax avoidance or evasion.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="font-mono text-[10px] font-bold text-white bg-amber-500/5 px-2 py-0.5 rounded uppercase font-bold">Sec 176</span>
            <strong className="block text-white text-white mt-1">Discontinued Biz</strong>
            <p className="text-[11px] text-white text-white leading-relaxed font-sans">Discontinued commercial undertakings are assessed immediately in current calendar period.</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE EXPENSES DISALLOW ENGINE U/S 115BBE */}
      <div className="p-5 rounded-2xl border-2 border-rose-500/30 bg-rose-50/10 dark:bg-rose-950/5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-rose-900 border-rose-200">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-white text-white border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 3: Undisclosed Income & 115BBE Flat 78% Surcharge tax calculator
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold font-sans">Unexplained cash credits/investments u/s 68, 69, 69A-D draw zero exemptions or logic credits</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-rose-500/15 text-white text-white border border-rose-500/20 uppercase">
              SEC 115BBE ENGINE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Interactive slider control */}
          <div className="space-y-4 border dark:border-rose-900/50 border-rose-100 p-4 rounded-xl bg-white dark:bg-slate-900/50">
            <span className="text-[10px] font-mono tracking-wider font-bold text-white text-white uppercase block">Interactive Scenario Modeler</span>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-white text-white flex justify-between">
                <span>Unexplained Uncovered Item sum (₹):</span>
                <span className="font-mono text-xs text-white text-white">₹ {unexplainedCredit.toLocaleString('en-IN')}</span>
              </label>
              <input 
                type="range" 
                min="10000" 
                max="2000000" 
                step="5000" 
                value={unexplainedCredit} 
                onChange={(e) => setUnexplainedCredit(Number(e.target.value))}
                className="w-full accent-rose-600 dark:accent-rose-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-white font-mono">
                <span>₹10K</span>
                <span>₹10L</span>
                <span>₹20L</span>
              </div>
            </div>

            <div className="p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 text-[11px] leading-relaxed text-white text-white font-medium">
              <span className="font-black text-white text-white block mb-0.5">⚠️ ABSOLUTE DISALLOWANCE CLAUSE:</span>
              No basic exemption limit can be set off. No expenditure or allowance is permissible u/s 115BBE(2). No losses (either business or capital) can be set off against this unexplained addition.
            </div>
          </div>

          {/* Interactive Formula Outcome Block */}
          <div className="p-4 rounded-xl border dark:border-rose-900/50 border-rose-100 bg-white dark:bg-slate-900/50 space-y-3 font-mono text-xs">
            <span className="text-[10px] tracking-wider font-extrabold text-white text-white uppercase block">Statutory Tax Breakdowns</span>
            <div className="divide-y dark:divide-slate-800 divide-slate-100">
              <div className="py-2 flex justify-between font-bold">
                <span className="text-white text-white">Base Tax (60%):</span>
                <span className="text-white text-white">₹ {baseTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between font-bold">
                <span className="text-white text-white">Surcharge (25% of Tax):</span>
                <span className="text-white text-white">₹ {surcharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between font-bold">
                <span className="text-white text-white">Health & Education Cess (4%):</span>
                <span className="text-white text-white">₹ {cess.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2.5 flex justify-between text-white text-white font-black text-sm border-t border-dashed border-rose-550/30">
                <span>Total Statutory Tax:</span>
                <span>₹ {netTaxableTax.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="pt-1 text-center bg-rose-500/10 text-white text-white/90 rounded p-1.5 text-[10px] font-black uppercase tracking-wider">
              Actual Effective Tax Burden Rate = {effectivePercentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExemptIncomesHighFidelityView() {
  const [compositeType, setCompositeType] = useState<'tea' | 'rubber' | 'coffee_cured' | 'coffee_roasted'>('tea');
  const [compositeIncome, setCompositeIncome] = useState<number>(500000);

  // Allocations parameters based on Rule 7A, 7B, 8
  const allocation = {
    tea: { agriPercent: 60, bizPercent: 40, rule: 'Rule 8' },
    rubber: { agriPercent: 65, bizPercent: 35, rule: 'Rule 7A' },
    coffee_cured: { agriPercent: 75, bizPercent: 25, rule: 'Rule 7B(1)' },
    coffee_roasted: { agriPercent: 60, bizPercent: 40, rule: 'Rule 7B(2)' }
  }[compositeType];

  const agriIncomes = (compositeIncome * allocation.agriPercent) / 100;
  const bizIncomes = (compositeIncome * allocation.bizPercent) / 100;

  return (
    <div className="space-y-8 font-sans w-full text-white text-white">
      
      {/* SECTION 1: AGRICULTURAL INCOME AMBIT & Composite split */}
      <div className="p-5 rounded-2xl border border-emerald-600/30 bg-white dark:bg-slate-900/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-white text-white border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Coins className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 1: Agricultural Income Ambit & Composite Allocation
              </h4>
              <p className="text-[11px] text-white font-medium">Under Sec 10(1) Agricultural income is exempt. Rules 7/8 govern composite dual splits.</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-white text-white border border-emerald-500/10 uppercase">
              SEC 10(1) & RULES 7/8
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Interactive Calculator */}
          <div className="p-4 rounded-xl border dark:border-slate-800 border-slate-200 bg-slate-50 dark:bg-slate-950/40 space-y-3.5">
            <span className="text-[10px] font-mono font-black text-white text-white uppercase block tracking-wider">Composite Income Apportionment Modeler</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => setCompositeType('tea')}
                className={`p-2 rounded-lg border font-bold text-center cursor-pointer transition-all ${compositeType === 'tea' ? 'bg-emerald-500/15 border-emerald-500 text-white text-white' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}
              >
                Tea Grown & Mfg (Rule 8)
              </button>
              <button 
                onClick={() => setCompositeType('rubber')}
                className={`p-2 rounded-lg border font-bold text-center cursor-pointer transition-all ${compositeType === 'rubber' ? 'bg-emerald-500/15 border-emerald-500 text-white text-white' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}
              >
                Rubber Mfg (Rule 7A)
              </button>
              <button 
                onClick={() => setCompositeType('coffee_cured')}
                className={`p-2 rounded-lg border font-bold text-center cursor-pointer transition-all ${compositeType === 'coffee_cured' ? 'bg-emerald-500/15 border-emerald-500 text-white text-white' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}
              >
                Coffee Cured (Rule 7B(1))
              </button>
              <button 
                onClick={() => setCompositeType('coffee_roasted')}
                className={`p-2 rounded-lg border font-bold text-center cursor-pointer transition-all ${compositeType === 'coffee_roasted' ? 'bg-emerald-500/15 border-emerald-500 text-white text-white' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'}`}
              >
                Coffee Roasted (Rule 7B(2))
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-white text-white flex justify-between">
                <span>Enter Net Agro-Biz Profits (₹):</span>
                <span className="font-mono font-bold text-white">₹ {compositeIncome.toLocaleString('en-IN')}</span>
              </label>
              <input 
                type="number" 
                step="10000"
                value={compositeIncome} 
                onChange={(e) => setCompositeIncome(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border dark:border-slate-800 dark:bg-slate-900 border-slate-200 bg-white font-mono focus:outline-emerald-500" 
              />
            </div>

            {/* Compute Results Display */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.02]">
                <span className="text-[9px] text-white text-white block">AGRICULTURAL PART (EXEMPT)</span>
                <strong className="text-white block text-sm mt-0.5">{allocation.agriPercent}%</strong>
                <span className="text-white text-white font-black text-xs">₹ {agriIncomes.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.02]">
                <span className="text-[9px] text-white text-white block">BUSINESS PGBP (TAXABLE)</span>
                <strong className="text-white text-white block text-sm mt-0.5">{allocation.bizPercent}%</strong>
                <span className="text-white text-white font-black text-xs">₹ {bizIncomes.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Core Ambit & Rules details card */}
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono tracking-wider font-extrabold text-white uppercase block">Agricultural Income Ambit Conditions</span>
              <p className="font-medium text-white text-white leading-relaxed font-sans text-[11px]">
                Must be land situated in India used specifically for agricultural events. Fully exempt u/s 10(1). Foreign agricultural profits are 100% Taxable.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] leading-relaxed pt-1 font-sans">
                <div className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                  <strong className="block text-white">Basic Operations:</strong>
                  Sowing, tilling, planting, and seedling nurturing. Mandatory for stamp status.
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                  <strong className="block text-white">Subsequent Operations:</strong>
                  Weeding, harvesting, crop drying, pruning, etc. Secondary actions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: EXEMPT INCOME DEDUCTION DISALLOWANCE RULES */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-white text-white border border-orange-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 2: Disallowance of Expenses on Exempt Income
              </h4>
              <p className="text-[11px] text-white font-medium font-sans">Mandatory checks under Section 14A read with Rule 8D for investment expenditure disallowance</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-orange-500/10 text-white text-white border border-orange-500/10 uppercase">
              SEC 14A & RULE 8D
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          {/* Rule 8D aggregate checklist card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-black text-white uppercase tracking-wider block">Rule 8D statutory adjustments formula</span>
            <ul className="space-y-1.5 text-white text-white list-inside list-disc text-[11px] font-sans">
              <li>
                <span className="font-bold text-white text-white">Aggregate Disallowance</span> is equal to: <strong className="text-white text-white">Direct Expenditure</strong> plus <strong className="text-white text-white">1% of average investment values</strong>.
              </li>
              <li>
                <strong className="text-white text-white">Average Value base:</strong> Computed on the monthly average of cost coordinates for exempt investment instruments held at beginning and end of each calendar month.
              </li>
              <li>
                <strong className="text-white">The Hard Limit Exception:</strong> The total disallowance computed under Rule 8D cannot exceed the total actual expense claimed by the assessee in their Profit & Loss record.
              </li>
            </ul>
          </div>

          {/* Partner & scheduled tribals exemptions card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-2">
            <span className="text-[9px] font-mono font-black text-white text-white uppercase tracking-wider block">Special Category Exemptions</span>
            <div className="space-y-2 text-[11px] leading-relaxed">
              <div>
                <span className="bg-indigo-500/10 text-white text-white font-mono font-extrabold p-1 uppercase rounded text-[9px]">Sec 10(2A)</span>
                <span className="font-bold text-white text-white block mt-0.5">Partner Share of Firm Profit:</span>
                100% exempt from tax. However, working salary and interest received from the firm are taxed under PGBP (subject to Sec 40(b) limits).
              </div>
              <div>
                <span className="bg-amber-500/10 text-white text-white font-mono font-extrabold p-1 uppercase rounded text-[9px]">Sec 10(26AAA)</span>
                <span className="font-bold text-white text-white block mt-0.5">Sikkimese Individuals Exemption:</span>
                Personal incomes generated inside Sikkim state, or securities/dividends earned anywhere outside Sikkim are fully tax-exempt u/s 10(26AAA).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CapitalGainsHighFidelityView() {
  const [depreciableWDV, setDepreciableWDV] = useState<number>(500000);
  const [revaluedLand, setRevaluedLand] = useState<number>(1200000);
  const [otherAssets, setOtherAssets] = useState<number>(300000);
  const [liabilities, setLiabilities] = useState<number>(200000);
  const [lumpSumConsideration, setLumpSumConsideration] = useState<number>(1500000);

  // Slump sale net worth computation u/s 50B (revaluation must be strictly ignored!)
  // If revaluation is included, let's say the original cost of land is 40% of the revalued land
  const originalLandBookValue = revaluedLand * 0.50; // Treat 50% as original book value (exclude revaluation surplus!)
  const netWorthComputed = depreciableWDV + originalLandBookValue + otherAssets - liabilities;
  const slumpCapitalGains = lumpSumConsideration - netWorthComputed;

  return (
    <div className="space-y-8 font-sans w-full text-white text-white">
      
      {/* SECTION 1: ASSET SCOPE, POP LIMITS & SOH TEST MATRIX */}
      <div className="p-5 rounded-2xl border border-indigo-600/30 bg-white dark:bg-slate-900/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-505/10 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 1: Capital Asset Scope & Holding Period Test
              </h4>
              <p className="text-[11px] text-white font-medium">Statutory category and holding period thresholds to separate STCG vs LTCG u/s 2(42A)</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10 uppercase">
              SEC 2(14) & 2(42A)
            </span>
          </div>
        </div>

        {/* 36 / 24 / 12 Matrix table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-205 dark:border-slate-800">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/4">Period (STCG if ≤)</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/2">Covered Capital Instrument Asset Class</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/4">LTCG Tax Rate u/s 112/112A</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 divide-slate-150 leading-relaxed font-sans font-medium text-white text-white">
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-extrabold text-white text-white font-mono">12 Months</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">Listed equity shares, listed zero coupon bonds, units of equity oriented mutual funds.</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono">10% / 12.5% (exceeding ₹1,25,000)</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-extrabold text-white text-white font-mono">24 Months</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">Unlisted shares of corporate companies, Immovable properties (Land or Building or both).</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono">12.5% (indexation abolished)</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-extrabold text-white text-white font-mono">36 Months</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">All other general movable capital assets (jewellery, gold, drawings, scrap paintings, sculptures).</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono">12.5% (normal rate)</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-[10px] text-white text-white font-bold font-sans">
            ⚠️ TAX REFORM WARNING (u/s 50AA): market linked debentures (MLDs), unlisted debt securities, and debt mutual funds (with &lt;35% equity) are ALWAY taxed as Short Term Capital Assets (STCA) regardless of actual period of holding!
          </p>
        </div>
      </div>

      {/* SECTION 2: SLUMP SALE NET WORTH WORKBENCH */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-white text-white border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 2: Slump Sale Net Worth Engine [Section 50B]
              </h4>
              <p className="text-[11px] text-white font-medium">Revaluation of any asset class in the undertaking must be strictly ignored for net worth compilation!</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-white text-white border border-emerald-500/10 uppercase">
              SEC 50B CALCULATOR
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Inputs Panel for Net worth calculation */}
          <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider block">Slump Sale Input Variables</span>
            
            <div className="grid grid-cols-2 gap-3 leading-relaxed">
              <div className="space-y-1">
                <label className="font-bold text-white text-white block">Depreciable Assets WDV (₹):</label>
                <input 
                  type="number" 
                  value={depreciableWDV} 
                  onChange={(e) => setDepreciableWDV(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-white text-white block">Revalued Land Book (₹):</label>
                <input 
                  type="number" 
                  value={revaluedLand} 
                  onChange={(e) => setRevaluedLand(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
                <span className="text-[9px] text-white block">(Treating 50% as original cost u/s 50B)</span>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-white text-white block">Other Assets book (₹):</label>
                <input 
                  type="number" 
                  value={otherAssets} 
                  onChange={(e) => setOtherAssets(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-white text-white block">Book Liabilities (₹):</label>
                <input 
                  type="number" 
                  value={liabilities} 
                  onChange={(e) => setLiabilities(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="font-bold text-white text-white block">Total Lump-Sum consideration (₹):</label>
                <input 
                  type="number" 
                  value={lumpSumConsideration} 
                  onChange={(e) => setLumpSumConsideration(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-emerald-800 dark:bg-slate-900 font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Results Output Block u/s 50B */}
          <div className="p-4 rounded-xl border dark:border-slate-800 border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 font-mono text-xs space-y-3">
            <span className="text-[10px] tracking-wider font-extrabold text-white block uppercase">Net Worth & Slump gains result</span>
            <div className="divide-y dark:divide-slate-800 divide-slate-150">
              <div className="py-2 flex justify-between">
                <span className="text-white text-white">Total Asset Base (Original cost):</span>
                <span className="text-white text-white">₹ {(depreciableWDV + originalLandBookValue + otherAssets).toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-white text-white">(-) Less Liabilities:</span>
                <span className="font-bold text-white text-white">₹ {liabilities.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between font-bold text-white text-white border-t border-dashed border-slate-300 dark:border-slate-800">
                <span>Computed Net Worth u/s 50B:</span>
                <span>₹ {netWorthComputed.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2.5 flex justify-between text-white text-white font-black text-sm border-t border-slate-300 dark:border-slate-800">
                <span>Statutory Capital gain u/s 50B:</span>
                <span>₹ {slumpCapitalGains.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="pt-1.5 text-center bg-indigo-500/10 text-white text-white font-black rounded p-1 text-[10px] uppercase block leading-relaxed font-sans">
              * Note: Indexation benefit is completely NIL for Slump Sale calculations. Revaluation is strictly removed.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: REINVESTMENT EXEMPTIONS CLUSTER */}
      <div className="p-5 rounded-2xl border border-slate-250 dark:border-slate-805 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <span className="text-xs font-black text-white text-white uppercase tracking-wider block">Section 3: Capital Gains Reinvestment Statutory Slabs</span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs leading-relaxed">
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-indigo-550/5 px-2 py-0.5 rounded uppercase">Section 54</span>
            <strong className="block text-white text-white mt-1">Residential Sale to House</strong>
            <p className="text-[11px] text-white text-white mt-1">Available to Individuals/HUFs. Must invest in up to 2 residential houses in India. Exemption capped at maximum of ₹10 Crore.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-emerald-555/5 px-2 py-0.5 rounded uppercase">Section 54B</span>
            <strong className="block text-white text-white mt-1">Agricultural Land</strong>
            <p className="text-[11px] text-white text-white mt-1">Urban agricultural land sold. Reinvest in urban or rural agricultural land inside India within a 2-year period.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-amber-555/5 px-2 py-0.5 rounded uppercase">Section 54EC</span>
            <strong className="block text-white text-white mt-1">Specific Infrastructure Bonds</strong>
            <p className="text-[11px] text-white text-white mt-1">Long-term land/building sold. Reinvest in NHAI, RECL, PFC or IRFC bonds within 6 months. Exemption strictly capped at ₹50 Lakh.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-rose-555/5 px-2 py-0.5 rounded uppercase">Section 54F</span>
            <strong className="block text-white text-white mt-1">Movable Assets to House</strong>
            <p className="text-[11px] text-white text-white mt-1">Any asset sold except house. Reinvest net consideration in one residential house. Exemption is proportional. Limit capped at ₹10 Crore.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssessmentOfCompaniesHighFidelityView() {
  const [normalProfit, setNormalProfit] = useState<number>(1500000);
  const [provisionTax, setProvisionTax] = useState<number>(300000);
  const [reserveTransfer, setReserveTransfer] = useState<number>(150000);
  const [exemptIncomeIn, setExemptIncomeIn] = useState<number>(100000);

  // MAT Section 115JB Book Profit computations
  const adjustedBookProfit = normalProfit + provisionTax + reserveTransfer - exemptIncomeIn;
  const matTaxBase = adjustedBookProfit * 0.15;

  return (
    <div className="space-y-8 font-sans w-full text-white text-white">
      
      {/* SECTION 1: CORPORATE TAX rates AND CONCESSIONAL REGIMES */}
      <div className="p-5 rounded-2xl border border-indigo-600/30 bg-white dark:bg-slate-900/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-505/10 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 1: Corporate Tax Rates & Concessional regimes
              </h4>
              <p className="text-[11px] text-white font-medium">Comparative matrix of direct commercial taxation regimes of corporate business entities</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10 uppercase">
              115BAA & 115BAB
            </span>
          </div>
        </div>

        {/* Corporate Regime Compare Table */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse border border-slate-205 dark:border-slate-800">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/4">Regime Feature</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/4">Normal Regime</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/4">Section 115BAA</th>
                <th className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white uppercase text-[10px] tracking-wider w-1/4">Section 115BAB</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 divide-slate-150 leading-relaxed font-sans font-medium text-white text-white text-[11px]">
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-black">Base Tax Rate</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">25% (turnover ≤ ₹400cr) / 30%</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white font-mono">22%</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-bold text-white text-white font-mono">15%</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-black">Surcharge Rates</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">7% (income &gt; ₹1cr) | 12% (&gt; ₹10cr)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono">Flat 10% (always)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono">Flat 10% (always)</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-black">Effective Rate (inc. Cess)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">Up to 34.94%</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono text-white text-white font-bold">25.17%</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono text-white text-white font-bold">17.16%</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-black">MAT Applicability u/s 115JB</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800">Yes (15% rate)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono text-white font-extrabold">✖ EXEMPT (No MAT)</td>
                <td className="p-2.5 border border-slate-200 dark:border-slate-800 font-mono text-white font-extrabold">✖ EXEMPT (No MAT)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE MAT BP ADJUSTMENT CALCULATOR */}
      <div className="p-5 rounded-2xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-505/10 text-white text-white border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Coins className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 2: Minimum Alternate Tax (MAT) Book Profit Adjustments
              </h4>
              <p className="text-[11px] text-white font-medium">Under Section 115JB, companies pay 15% MAT on Adjusted Book Profits. Experience the tricky adjustments:</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-white text-white border border-emerald-500/10 uppercase">
              MAT WORKBENCH
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center text-xs">
          {/* MAT inputs card layout */}
          <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950/40 p-4 border dark:border-slate-800 border-slate-200 rounded-xl font-sans">
            <span className="text-[10px] font-mono tracking-wider font-black text-white uppercase block">MAT adjustment parameters</span>
            
            <div className="space-y-2.5">
              <div className="flex justify-between items-center gap-2">
                <span className="font-medium text-white text-white">Initial Book Profit (S.III Net profit) (₹):</span>
                <input 
                  type="number" 
                  value={normalProfit} 
                  step="5000"
                  onChange={(e) => setNormalProfit(Number(e.target.value))}
                  className="p-1 px-1.5 border dark:border-slate-855 rounded bg-white dark:bg-slate-900 font-mono text-center w-28 focus:outline-emerald-500 text-xs" 
                />
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="font-semibold text-white text-white flex items-center gap-1">
                  <span>(+) Add:</span> Provision for Income Tax (₹):
                </span>
                <input 
                  type="number" 
                  value={provisionTax} 
                  step="5000"
                  onChange={(e) => setProvisionTax(Number(e.target.value))}
                  className="p-1 px-1.5 border dark:border-slate-855 rounded bg-white dark:bg-slate-900 font-mono text-center w-28 focus:outline-emerald-500 text-xs" 
                />
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="font-semibold text-white text-white flex items-center gap-1">
                  <span>(+) Add:</span> Transfer to Reserve values (₹):
                </span>
                <input 
                  type="number" 
                  value={reserveTransfer} 
                  step="5000"
                  onChange={(e) => setReserveTransfer(Number(e.target.value))}
                  className="p-1 px-1.5 border dark:border-slate-855 rounded bg-white dark:bg-slate-900 font-mono text-center w-28 focus:outline-emerald-500 text-xs" 
                />
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="font-semibold text-white text-white flex items-center gap-1">
                  <span>(-) Less:</span> Tax-Exempt Incomes u/s 10 (₹):
                </span>
                <input 
                  type="number" 
                  value={exemptIncomeIn} 
                  step="5000"
                  onChange={(e) => setExemptIncomeIn(Number(e.target.value))}
                  className="p-1 px-1.5 border dark:border-slate-855 rounded bg-white dark:bg-slate-900 font-mono text-center w-28 focus:outline-rose-500 text-xs" 
                />
              </div>
            </div>
          </div>

          {/* MAT outcome formula display */}
          <div className="p-4 rounded-xl border dark:border-slate-800 border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 font-mono text-xs space-y-3">
            <span className="text-[10px] tracking-wider font-extrabold text-white block uppercase">MAT Formula details report</span>
            <div className="divide-y dark:divide-slate-800 divide-slate-150">
              <div className="py-2 flex justify-between">
                <span className="text-white text-white">Net Profit base:</span>
                <span className="text-white text-white">₹ {normalProfit.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between text-white">
                <span>(+) Add: Unrecovered statutory writes:</span>
                <span>₹ {(provisionTax + reserveTransfer).toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between text-white">
                <span className="text-white text-white">(-) Less: Exempt amounts:</span>
                <span className="font-bold text-white text-white">₹ {exemptIncomeIn.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2.5 flex justify-between text-white text-white font-black text-sm border-t border-dashed border-slate-350 dark:border-slate-800">
                <span>Adjusted Book Profit u/s 115JB:</span>
                <span>₹ {adjustedBookProfit.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2.5 flex justify-between text-white text-white font-black text-sm border-t border-slate-300 dark:border-slate-800">
                <span>Base MAT Levy @ 15%:</span>
                <span>₹ {matTaxBase.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[10px] bg-indigo-500/10 text-white text-white p-1.5 rounded leading-relaxed text-center font-sans font-medium">
              Carry forward MAT Credit u/s 115JAA for up to 15 assessment years. Set-off is allowed when Normal Tax exceeds MAT in a subsequent PY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InternationalTaxationHighFidelityView() {
  const [indianIncome, setIndianIncome] = useState<number>(1000000);
  const [foreignIncome, setForeignIncome] = useState<number>(400000);
  const [foreignTaxPaid, setForeignTaxPaid] = useState<number>(60000);

  // Computations for Section 91 double tax credit relief
  const totalTaxableIncome = indianIncome + foreignIncome;
  // Estimate average Indian Tax Rate
  let computedBaseIndianTax = 0;
  if (totalTaxableIncome <= 400000) {
    computedBaseIndianTax = 0;
  } else if (totalTaxableIncome <= 800000) {
    computedBaseIndianTax = (totalTaxableIncome - 400000) * 0.05;
  } else if (totalTaxableIncome <= 1200000) {
    computedBaseIndianTax = 20000 + (totalTaxableIncome - 800000) * 0.10;
  } else {
    computedBaseIndianTax = 60000 + (totalTaxableIncome - 1200000) * 0.15;
  }
  const indianTaxIncludingCess = computedBaseIndianTax * 1.04;
  const averageIndianTaxRate = totalTaxableIncome > 0 ? (indianTaxIncludingCess / totalTaxableIncome) * 100 : 10;
  const foreignTaxRate = foreignIncome > 0 ? (foreignTaxPaid / foreignIncome) * 100 : 15;

  const creditReliefRate = Math.min(averageIndianTaxRate, foreignTaxRate);
  const doubleTaxReliefUnilateral = (foreignIncome * creditReliefRate) / 100;
  const remainingIndianTax = Math.max(0, indianTaxIncludingCess - doubleTaxReliefUnilateral);

  return (
    <div className="space-y-8 font-sans w-full text-white text-white">
      
      {/* SECTION 1: UNILATERAL DOUBLE TAX RELIEF WORKBENCH */}
      <div className="p-5 rounded-2xl border border-indigo-600/30 bg-white dark:bg-slate-900/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-505/10 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white text-white uppercase tracking-wider">
                Section 1: Unilateral Double Taxation Relief [Section 91]
              </h4>
              <p className="text-[11px] text-white font-medium">Applicable when no bilateral DTAA treaty exists. Relieves doubly taxed income at the lower average rate:</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10 uppercase">
              SEC 91 CREDIT ENGINE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center text-xs">
          {/* Section 91 Inputs block */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 border dark:border-slate-800 border-slate-200 rounded-xl">
            <span className="text-[10px] font-mono font-black text-white uppercase block">Foreign Tax coordinates card</span>
            <div className="space-y-3 font-medium">
              <div className="space-y-1">
                <label className="text-white text-white block">Indian Domestically Sourced Income (₹):</label>
                <input 
                  type="number" 
                  step="10000"
                  value={indianIncome} 
                  onChange={(e) => setIndianIncome(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-white text-white block">Foreign doubly taxed Income (Accrued outside) (₹):</label>
                <input 
                  type="number" 
                  step="10000"
                  value={foreignIncome} 
                  onChange={(e) => setForeignIncome(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-white text-white block">Actual Tax paid in Foreign country (₹):</label>
                <input 
                  type="number" 
                  step="2000"
                  value={foreignTaxPaid} 
                  onChange={(e) => setForeignTaxPaid(Number(e.target.value))}
                  className="w-full text-xs p-1.5 rounded border dark:border-slate-800 dark:bg-slate-900 font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Section 91 computes report panel */}
          <div className="p-4 rounded-xl border dark:border-slate-800 border-slate-200 bg-slate-50/50 dark:bg-slate-950/20 font-mono text-xs space-y-3">
            <span className="text-[10px] tracking-wider font-extrabold text-white block">Section 91 tax credit calculation</span>
            <div className="divide-y dark:divide-slate-800 divide-slate-150">
              <div className="py-1.5 flex justify-between">
                <span className="text-white text-white">Total Global Income:</span>
                <span>₹ {totalTaxableIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span className="text-white text-white">Indian Tax with Cess:</span>
                <span>₹ {indianTaxIncludingCess.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-1.5 flex justify-between text-white">
                <span>Average Indian Tax Rate:</span>
                <span>{averageIndianTaxRate.toFixed(2)} %</span>
              </div>
              <div className="py-1.5 flex justify-between text-white">
                <span>Foreign Tax Paid Rate:</span>
                <span>{foreignTaxRate.toFixed(2)} %</span>
              </div>
              <div className="py-2 flex justify-between text-white font-bold border-t border-dashed border-slate-300 dark:border-slate-800">
                <span>(-) Unilateral Credit u/s 91:</span>
                <span>₹ {doubleTaxReliefUnilateral.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between font-black text-sm border-t border-slate-300 dark:border-slate-800 text-white text-white">
                <span>Net Indian tax payable:</span>
                <span>₹ {remainingIndianTax.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="pt-1.5 text-center bg-indigo-500/10 text-white text-white font-black rounded p-1 text-[9px] uppercase leading-relaxed block font-sans">
              * Condition: Relief u/s 91 is strictly granted ONLY to residents in India. Non-residents are completely excluded!
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEEMED ASSOCIATED ENTERPRISES BENCHMARKS */}
      <div className="p-5 rounded-2xl border border-slate-250 dark:border-slate-805 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <span className="text-xs font-black text-white text-white uppercase tracking-wider block">Section 2: Deemed Associated Enterprises Parameters [Section 92A]</span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs leading-relaxed font-sans font-medium">
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-indigo-550/5 px-2 py-0.5 rounded uppercase">Voting power</span>
            <strong className="block text-white text-white mt-1">Direct / Indirect vote</strong>
            <p className="text-[11px] text-white text-white mt-1">One enterprise holds, directly or indirectly, shares carrying <strong className="text-white">&ge; 26% of voting power</strong> in the other enterprise.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-emerald-555/5 px-2 py-0.5 rounded uppercase">Asset Debt ratios</span>
            <strong className="block text-white text-white mt-1">Book Value of Loan</strong>
            <p className="text-[11px] text-white text-white mt-1">One enterprise loans a sum to the other representing <strong className="text-white">&ge; 51% of total book assets</strong> of the recipient enterprise.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-amber-555/5 px-2 py-0.5 rounded uppercase">Guarantees threshold</span>
            <strong className="block text-white text-white mt-1">Aggregated Debt Cover</strong>
            <p className="text-[11px] text-white text-white mt-1">Alpha Corp guarantees <strong className="text-white">&ge; 10% of total borrowings</strong> of Beta Ltd, establishing statutory Association.</p>
          </div>
          <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40">
            <span className="font-mono text-[9px] font-bold text-white bg-rose-555/5 px-2 py-0.5 rounded uppercase">Governing Board control</span>
            <strong className="block text-white text-white mt-1">Board Appointers count</strong>
            <p className="text-[11px] text-white text-white mt-1">Governing control where one appoints <strong className="text-white">&gt; half the Board of Directors</strong> or executive members of the other corporate body.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export function AfmInterestRateRiskHighFidelityView() {
  return (
    <div className="space-y-8 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
              <Award className="h-3.5 w-3.5 text-indigo-400" /> CA Final AFM Masterclass Notes • High-Yield Revision
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Chapter 12: Interest Rate Risk Management
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Complete Exam-Oriented Master Notes • Statutory Theorems, Hedging Mechanics, Derivatives & Formulas
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-200 shrink-0">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>ICAI Weightage: 8 - 14 Marks</span>
          </div>
        </div>
      </div>

      {/* TOPIC 1 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            01
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Macro-Economic Drivers & Fundamentals of Interest Rates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Economic foundations, interest rate components & yield curve dynamics
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Definition & Nature:</strong> Interest rate is the time-value compensation paid by borrowers to lenders for credit risk, inflation loss, liquidity sacrifice, and administrative cost.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Core Determinants (Macro Drivers):</strong>
              <ul className="mt-2 space-y-2 pl-4 border-l-2 border-indigo-500/20 text-xs">
                <li>• <strong>Money Supply & Demand:</strong> High economic growth expands credit demand, driving nominal rates upward.</li>
                <li>• <strong>Inflationary Expectations (Fisher Effect):</strong> Nominal Rate = Real Rate + Expected Inflation Premium.</li>
                <li>• <strong>Monetary Policy Operations (RBI):</strong> Repo Rate, Reverse Repo Rate, Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR), and Open Market Operations (OMO).</li>
                <li>• <strong>Fiscal Deficit & Government Borrowings:</strong> Heavy sovereign debt issuance crowds out private capital, pushing yields higher.</li>
              </ul>
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA PRESENTATION CARD 1 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                📐 Statutory Fisher Effect & Yield Curve Slope Equations
              </span>
            </div>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              Fisher Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Fisher Nominal Interest Rate Equation</span>
              <div className="py-3 font-mono text-base font-extrabold text-white tracking-wide">
                R<sub>Nominal</sub> = R<sub>Real</sub> + π<sup>e</sup>
              </div>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Yield Curve Slope Metric</span>
              <div className="py-3 font-mono text-base font-extrabold text-white tracking-wide">
                Slope<sub>Yield</sub> = Y<sub>10Y</sub> - Y<sub>91D</sub>
              </div>
            </div>
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">R<sub>Nominal</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Observed gross market borrowing rate charged by financial institutions.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">R<sub>Real</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Inflation-adjusted risk-free fundamental return required by capital providers.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">π<sup>e</sup></span>
              <p className="text-[11px] text-slate-300 font-sans">Annual expected macroeconomic inflation premium compensation.</p>
            </div>
          </div>
        </div>

        {/* STATIC DIAGRAM: YIELD CURVE DYNAMICS */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            📊 Static Visual Diagram: Yield Curve Shapes & Economic Signals
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">📈 Upward Sloping</div>
              <div className="text-[10px] text-slate-500">Long Yield &gt; Short Yield</div>
              <div className="text-[10px] font-sans text-slate-600 dark:text-slate-400 mt-1">Normal Expansion Phase</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-rose-600 dark:text-rose-400 mb-1">📉 Inverted Curve</div>
              <div className="text-[10px] text-slate-500">Short Yield &gt; Long Yield</div>
              <div className="text-[10px] font-sans text-slate-600 dark:text-slate-400 mt-1">Recession & Policy Tightening</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">➡️ Flat / Humped</div>
              <div className="text-[10px] text-slate-500">Uniform Yield Across Tenors</div>
              <div className="text-[10px] font-sans text-slate-600 dark:text-slate-400 mt-1">Macro Uncertainty / Shift</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 2 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            02
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Benchmark Reference Rates & Global ARRs vs. LIBOR
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Interbank reference benchmarks, LIBOR cessation & Alternative Reference Rates (ARRs)
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Concept of Reference Rates:</strong> Financial contracts (loans, bonds, swaps, FRAs) are floatingly priced relative to an underlying benchmark index plus a credit spread (e.g., SOFR + 120 bps).
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">The LIBOR Transition Imperative:</strong>
              <ul className="mt-2 space-y-1.5 pl-4 border-l-2 border-indigo-500/20 text-xs">
                <li>• <strong>Historical Flaw:</strong> LIBOR was based on expert judgment quotes submitted by panel banks (subject to manipulation, as exposed in 2012).</li>
                <li>• <strong>Cessation:</strong> LIBOR publication permanently ceased on <strong>January 1, 2022</strong> (with synthetic USD tenors ending June 2023).</li>
                <li>• <strong>Core Paradigm Shift:</strong> LIBOR was a forward-looking term rate with embedded bank credit risk, whereas modern ARRs are <strong>overnight, transaction-backed, near risk-free rates (RFRs)</strong>.</li>
              </ul>
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 2 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Floating Rate Coupon & Spread Pricing Equation
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              ARR Benchmark Model
            </span>
          </div>

          <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner text-center font-mono text-sm md:text-base font-extrabold text-white tracking-wide">
            Coupon Rate<sub>t</sub> = ARR<sub>t</sub> + Spread<sub>Credit</sub>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">ARR<sub>t</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Overnight Alternative Reference Rate benchmark reset for period <sub>t</sub> (e.g. SOFR, €STER, MIBOR).</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">Spread<sub>Credit</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Contractual credit risk margin fixed in basis points (1 bps = 0.01% = 0.0001).</p>
            </div>
          </div>
        </div>

        {/* STATIC TABLE: GLOBAL ARRs MATRIX */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Currency / Jurisdiction</th>
                <th className="py-2.5 px-3">ARR Benchmark</th>
                <th className="py-2.5 px-3">Administering Authority</th>
                <th className="py-2.5 px-3">Collateral Backing</th>
                <th className="py-2.5 px-3">Key Technical Property</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-sans">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">USD (United States)</td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">SOFR</td>
                <td className="py-2.5 px-3">Federal Reserve Bank of NY</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Secured (Treasury Repo)</td>
                <td className="py-2.5 px-3">Overnight Treasury repo transaction volume (~$1 Trillion/day)</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">GBP (United Kingdom)</td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">SONIA</td>
                <td className="py-2.5 px-3">Bank of England</td>
                <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">Unsecured</td>
                <td className="py-2.5 px-3">Sterling overnight deposit transactions</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">EUR (Eurozone)</td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">€STER</td>
                <td className="py-2.5 px-3">European Central Bank (ECB)</td>
                <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">Unsecured</td>
                <td className="py-2.5 px-3">Wholesale overnight borrowing costs across Euro area</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">INR (India Benchmark)</td>
                <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">MIBOR / MIBID</td>
                <td className="py-2.5 px-3">FIMMDA / CCIL / NSE</td>
                <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">Unsecured Call Money</td>
                <td className="py-2.5 px-3">Mumbai Interbank Offered Rate (Lending) & Bid Rate (Borrowing)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 3 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            03
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Taxonomy of Interest Rate Risk Exposures & Gap Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Price risk, reinvestment risk, gap exposure & Earnings at Risk (EaR)
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Dual Fundamental Risks:</strong>
              <ul className="mt-2 space-y-1.5 pl-4 border-l-2 border-indigo-500/20 text-xs">
                <li>• <strong>Price Risk:</strong> Adverse shift in market value of fixed-income instruments due to rate changes (Bond prices move inversely to interest rates).</li>
                <li>• <strong>Reinvestment Risk:</strong> Risk that future coupon inflows or maturing principal will be reinvested at lower prevailing yields.</li>
              </ul>
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 3 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Rate Sensitivity Gap & Earnings at Risk (EaR) Formulas
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              EaR Sensitivity Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Rate Sensitivity Gap</span>
              <div className="py-3 font-mono text-base font-extrabold text-white tracking-wide">
                Gap = RSA - RSL
              </div>
            </div>

            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Earnings at Risk (Net Interest Income Shift)</span>
              <div className="py-3 font-mono text-base font-extrabold text-indigo-300 tracking-wide">
                ΔNII<sub>EaR</sub> = Gap × Δr
              </div>
            </div>
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">RSA</span>
              <p className="text-[11px] text-slate-300 font-sans">Rate-Sensitive Assets repricing or maturing in time bucket.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">RSL</span>
              <p className="text-[11px] text-slate-300 font-sans">Rate-Sensitive Liabilities repricing or maturing in time bucket.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">ΔNII<sub>EaR</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Sensitivity change in Net Interest Income (Earnings at Risk).</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">Δr</span>
              <p className="text-[11px] text-slate-300 font-sans">Assumed parallel movement shift in interest rate benchmark.</p>
            </div>
          </div>

          {/* WORKED NUMERICAL EXAMPLE */}
          <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-sans space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">💡 Step-by-Step Worked Exam Proof:</span>
              <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-extrabold">Positive Gap Sensitivity</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              Bank holds <strong>RSA = ₹1,200 Crores</strong> and <strong>RSL = ₹800 Crores</strong> in the 90-day bucket. Market rates increase by <strong>Δr = +1.25%</strong> (+125 bps).
            </p>
            <div className="p-3.5 bg-slate-950 rounded-lg border border-emerald-500/20 font-mono text-xs space-y-1.5 text-slate-200">
              <div>1. Gap = ₹1,200 Cr - ₹800 Cr = <strong className="text-white">+₹400 Crores (Positive Gap)</strong></div>
              <div>2. ΔNII<sub>EaR</sub> = +₹400 Cr × 0.0125 = <strong className="text-emerald-400">+₹5.00 Crores</strong></div>
              <div className="text-emerald-400 font-extrabold pt-1 border-t border-slate-800">
                ✅ Outcome: A 125 bps rate hike expands Net Interest Income (NII) by ₹5.00 Crores p.a.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 4 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            04
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Forward Rate Agreements (FRAs) & Settlement Discounting
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              OTC off-balance sheet forward rate lock-ins & period-start cash discounting
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">FRA Definition & Terminology:</strong>
              An OTC agreement between two parties to fix the interest rate for a future borrowing or lending period on a specified Notional Principal (N). Notation e.g., <strong>1 × 4 FRA</strong> means a 3-month borrowing period commencing in 1 month's time and ending in 4 months.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">CRITICAL EXAM RULE — Cash Settlement Discounting:</strong>
              Because cash settlement occurs at the <strong>commencement (start) of the borrowing period</strong> rather than at maturity, the interest differential must be discounted back using the actual reference benchmark rate (RR) prevailing on the reset date.
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 4 (FRA DISCOUNTING WITH VERTICAL FRACTION) */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              🧮 FRA Cash Settlement Discounting Equation (Period Commencement)
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              ICAI Standard Model
            </span>
          </div>

          {/* VERTICAL FRACTION PRESENTATION */}
          <div className="p-6 md:p-8 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner flex flex-col md:flex-row items-center justify-center gap-4 text-center my-4 font-mono text-sm md:text-base font-extrabold text-white">
            <span className="text-white">Settlement Amount<sub>FRA</sub> = </span>
            <div className="inline-flex flex-col items-center justify-center">
              <div className="pb-2 px-4 border-b-2 border-indigo-400 text-white tracking-wide">
                N × (RR - FR) × <span className="text-white">(dt / DY)</span>
              </div>
              <div className="pt-2 px-4 text-white tracking-wide">
                1 + RR × <span className="text-white">(dt / DY)</span>
              </div>
            </div>
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-white">N</span>
              <p className="text-[11px] text-slate-300 font-sans">Notional Principal amount of agreement.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-white">RR</span>
              <p className="text-[11px] text-slate-300 font-sans">Actual Reference Rate at settlement date.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-white">FR</span>
              <p className="text-[11px] text-slate-300 font-sans">Agreed FRA contractual forward rate.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-white">dt</span>
              <p className="text-[11px] text-slate-300 font-sans">Days in underlying borrowing period.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-white">DY</span>
              <p className="text-[11px] text-slate-300 font-sans">Year base convention (360 or 365 days).</p>
            </div>
          </div>

          {/* WORKED NUMERICAL EXAM EXAMPLE */}
          <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-sans space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">💡 Step-by-Step Worked Exam Application:</span>
              <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-extrabold">3 × 6 FRA Example</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              Corporate buys a <strong>3 × 6 FRA</strong> at <strong>FR = 5.50%</strong> for Notional <strong>N = $10,000,000</strong>. On settlement date, actual 90-day SOFR <strong>RR = 6.50%</strong>. (dt = 90, DY = 360).
            </p>
            <div className="p-3.5 bg-slate-950 rounded-lg border border-emerald-500/20 font-mono text-xs space-y-2 text-slate-200">
              <div>1. Interest Differential (Numerator) = $10M × (0.065 - 0.055) × (90/360) = <strong>$25,000.00</strong></div>
              <div>2. Discount Factor (Denominator) = 1 + [0.065 × (90/360)] = <strong>1.01625</strong></div>
              <div className="text-emerald-400 font-extrabold pt-1.5 border-t border-slate-800">
                ✅ Final Net Cash Paid to FRA Buyer = $25,000 / 1.01625 = $24,600.25
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 5 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            05
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Interest Rate Futures (IRF) & Conversion Factor (CF) Mechanics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Exchange-traded bond futures, Conversion Factor (CF) & Cheapest to Deliver (CTD) bond
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Exchange-Traded IRFs:</strong> Standardized contracts traded on exchanges (e.g., NSE GoI 10-Yr Bond Futures). To hedge against <strong>rising interest rates</strong>, borrowers <strong>SELL futures</strong> today (because bond prices fall as rates rise).
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Conversion Factor (CF) Standardization:</strong> Since multiple deliverable bonds with varying coupon rates and maturities exist, exchanges calculate a Conversion Factor (CF) for each bond to equalize delivery values.
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 5 (IRF CTD & OPTIMAL CONTRACT COUNT) */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              🎯 CTD Criterion & Duration Hedging Contract Count Equations
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              IRF Hedging Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Cheapest to Deliver (CTD) Seller Profit</span>
              <div className="py-4 font-mono text-sm md:text-base font-extrabold text-white tracking-wide">
                Profit<sub>CTD, i</sub> = (P<sub>Futures</sub> × CF<sub>i</sub>) - P<sub>Spot, i</sub>
              </div>
            </div>

            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">Optimal Contract Count (N<sup>*</sup>)</span>
              <div className="inline-flex items-center justify-center gap-2 font-mono text-sm md:text-base font-extrabold text-white">
                <span>N<sup>*</sup> = </span>
                <div className="inline-flex flex-col items-center justify-center">
                  <div className="pb-1 px-3 border-b-2 border-indigo-400 text-indigo-200">
                    D<sub>p</sub> × V<sub>p</sub>
                  </div>
                  <div className="pt-1 px-3 text-emerald-300">
                    D<sub>f</sub> × P<sub>f</sub> × S<sub>Contract</sub>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">D<sub>p</sub> & V<sub>p</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Modified Duration & total Market Value of underlying cash bond portfolio.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">D<sub>f</sub> & P<sub>f</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Modified Duration & Quoted Market Price of Interest Rate Futures contract.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-emerald-400">S<sub>Contract</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Exchange-specified Contract Lot Size multiplier (e.g. ₹2,00,000).</p>
            </div>
          </div>

          {/* WORKED NUMERICAL EXAM EXAMPLE */}
          <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-sans space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">💡 Step-by-Step Worked Duration Hedging Example:</span>
              <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-extrabold">Duration Immunization</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              Fund Manager holds <strong>V<sub>p</sub> = ₹100 Crores</strong> bond portfolio with <strong>D<sub>p</sub> = 6.50 years</strong>. Futures price <strong>P<sub>f</sub> = ₹98,000</strong>, <strong>D<sub>f</sub> = 7.20 years</strong>, Lot Size <strong>S<sub>Contract</sub> = 2,000 bonds</strong>.
            </p>
            <div className="p-3.5 bg-slate-950 rounded-lg border border-emerald-500/20 font-mono text-xs space-y-2 text-slate-200">
              <div>1. Numerator = 6.50 × ₹1,000,000,000 = <strong>₹6,500,000,000</strong></div>
              <div>2. Denominator = 7.20 × ₹98,000 × 2,000 = <strong>₹1,411,200,000</strong></div>
              <div className="text-emerald-400 font-extrabold pt-1.5 border-t border-slate-800">
                ✅ N<sup>*</sup> = 6,500,000,000 / 1,411,200,000 = 4.606 × 100 = 461 Futures Contracts (SELL 461 IRF Contracts)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 6 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            06
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Interest Rate Options: Cap, Floor, and Collar Strategies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Asymmetric interest rate guarantees, caps, floors & zero-cost collar corridors
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Interest Rate Cap (Call Option on Interest Rate):</strong>
              Buyer pays upfront premium to establish an upper borrowing ceiling (r<sub>c</sub>). If reference rate r &gt; r<sub>c</sub>, seller pays difference: Payoff<sub>Cap</sub> = N × max(0, r - r<sub>c</sub>) × (dt/DY).
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Interest Rate Floor (Put Option on Interest Rate):</strong>
              Lender/investor buys floor to protect minimum return (r<sub>f</sub>). If reference rate r &lt; r<sub>f</sub>, seller pays difference: Payoff<sub>Floor</sub> = N × max(0, r<sub>f</sub> - r) × (dt/DY).
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 6 (CAP & FLOOR PAYOFFS) */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              🛡️ Interest Rate Cap & Floor Payoff Equations
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              Option Asymmetry Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">Cap Payoff (Call Option on Rate)</span>
              <div className="py-3 font-mono text-sm md:text-base font-extrabold text-white tracking-wide">
                Payoff<sub>Cap</sub> = N × max(0, r - r<sub>c</sub>) × <span className="text-amber-300">(dt / DY)</span>
              </div>
            </div>

            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">Floor Payoff (Put Option on Rate)</span>
              <div className="py-3 font-mono text-sm md:text-base font-extrabold text-white tracking-wide">
                Payoff<sub>Floor</sub> = N × max(0, r<sub>f</sub> - r) × <span className="text-amber-300">(dt / DY)</span>
              </div>
            </div>
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">r</span>
              <p className="text-[11px] text-slate-300 font-sans">Observed Reference Benchmark Spot Rate at reset date.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-emerald-400">r<sub>c</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Agreed Interest Rate Cap ceiling strike rate.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-amber-400">r<sub>f</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Agreed Interest Rate Floor minimum strike rate.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-slate-300">dt / DY</span>
              <p className="text-[11px] text-slate-300 font-sans">Actual reset period days divided by year base (360/365).</p>
            </div>
          </div>
        </div>

        {/* STATIC COMPARATIVE MATRIX TABLE FOR CAP, FLOOR, COLLAR */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Option Strategy</th>
                <th className="py-2.5 px-3">User Profile / Target</th>
                <th className="py-2.5 px-3">Payoff Trigger Condition</th>
                <th className="py-2.5 px-3">Effective Cost / Yield Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-sans">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">Interest Rate Cap</td>
                <td className="py-2.5 px-3">Floating Rate Borrower</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">Spot Rate (r) &gt; Cap Rate (r<sub>c</sub>)</td>
                <td className="py-2.5 px-3">Max Borrowing Cost = Cap Rate + Premium Amortization</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">Interest Rate Floor</td>
                <td className="py-2.5 px-3">Floating Rate Lender / Investor</td>
                <td className="py-2.5 px-3 font-semibold text-amber-600 dark:text-amber-400">Spot Rate (r) &lt; Floor Rate (r<sub>f</sub>)</td>
                <td className="py-2.5 px-3">Min Yield Guaranteed = Floor Rate - Premium Cost</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 font-mono">Zero-Cost Collar</td>
                <td className="py-2.5 px-3">Cost-Conscious Borrower</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">r &gt; r<sub>c</sub> OR r &lt; r<sub>f</sub></td>
                <td className="py-2.5 px-3">Effective Rate strictly bounded inside [r<sub>f</sub>, r<sub>c</sub>] with zero net premium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPIC 7 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            07
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Interest Rate Swaps (IRS): Plain Vanilla, Basis & Asset Swaps
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              OTC contractual cash flow exchanges, netting rules & pricing calculations
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Plain Vanilla Coupon Swap:</strong> Party A pays Fixed Rate (All-In-Cost AIC) and receives Floating Rate (SOFR/MIBOR) on Notional Principal N. Zero principal transfer.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Basis Swap & Asset Swap:</strong> Basis Swap exchanges two floating benchmarks (e.g. 1M SOFR vs 3M SOFR). Asset Swap transforms fixed bond yields into floating income.
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 7 (SWAP NET PAYMENT) */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📊 Plain Vanilla Swap Net Cash Flow Equation
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              IRS Netting Model
            </span>
          </div>

          <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner text-center font-mono text-sm md:text-base font-extrabold text-white tracking-wide">
            Net Cash Flow<sub>Fixed Payer</sub> = N × [ r<sub>fixed</sub> × (dt<sub>fixed</sub> / DY) - r<sub>floating</sub> × (dt<sub>floating</sub> / DY) ]
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">N</span>
              <p className="text-[11px] text-slate-300 font-sans">Swap Notional Principal contract amount.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">r<sub>fixed</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Agreed All-In-Cost (AIC) fixed coupon rate.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">r<sub>floating</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Reset floating benchmark rate (e.g. 6-month SOFR).</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-amber-400">dt<sub>fixed</sub> / dt<sub>floating</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Actual days in fixed and floating leg coupon periods.</p>
            </div>
          </div>

          {/* WORKED IRS NUMERICAL BOX */}
          <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-sans space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">💡 Worked Exam Proof: IRS Net Payment Calculation</span>
              <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-extrabold">Semi-Annual Swap</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              Swap Notional <strong>N = $1,000,000</strong>. Fixed Rate = <strong>8.00% p.a.</strong> (180 days). Reset Floating SOFR = <strong>6.00% p.a.</strong> (181 days). (DY = 360).
            </p>
            <div className="p-3.5 bg-slate-950 rounded-lg border border-emerald-500/20 font-mono text-xs space-y-1.5 text-slate-200">
              <div>1. Fixed Payment Outflow = $1,000,000 × 0.0800 × (180/360) = <strong>$40,000.00</strong></div>
              <div>2. Floating Receipt Inflow = $1,000,000 × 0.0600 × (181/360) = <strong>$30,166.67</strong></div>
              <div className="text-rose-400 font-extrabold pt-1.5 border-t border-slate-800">
                ✅ Net Cash Outflow for Fixed Rate Payer = $40,000.00 - $30,166.67 = $9,833.33
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 8 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            08
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Swaptions: Payer vs. Receiver Swaptions & Pricing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Options on Interest Rate Swaps, exercise conditions & forward swap rate benchmarks
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Payer Swaption (Call Option on Swap Rate):</strong>
              Grants holder the right to <strong>pay fixed rate and receive floating rate</strong> at expiry. Exercised if prevailing forward swap rate &gt; strike swaption rate.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Receiver Swaption (Put Option on Swap Rate):</strong>
              Grants holder the right to <strong>receive fixed rate and pay floating rate</strong> at expiry. Exercised if prevailing forward swap rate &lt; strike swaption rate.
            </div>
          </li>
        </ul>

        {/* HIGH-LEVEL FORMULA CARD 8 (SWAPTION PAYOFFS) */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              🌿 Swaption Expiration Payoff & Terminal Valuation Equations
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              Swaption Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">Payer Swaption Terminal Payoff</span>
              <div className="py-3 font-mono text-xs md:text-sm font-extrabold text-white tracking-wide">
                Payoff<sub>Payer</sub> = N × max(0, SR<sub>Market</sub> - SR<sub>Strike</sub>) × A<sub>n</sub>(r)
              </div>
            </div>

            <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">Receiver Swaption Terminal Payoff</span>
              <div className="py-3 font-mono text-xs md:text-sm font-extrabold text-white tracking-wide">
                Payoff<sub>Receiver</sub> = N × max(0, SR<sub>Strike</sub> - SR<sub>Market</sub>) × A<sub>n</sub>(r)
              </div>
            </div>
          </div>

          {/* VARIABLE LEGEND MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">SR<sub>Market</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Prevailing Forward Swap Rate benchmark at expiration date.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">SR<sub>Strike</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Agreed Swaption Strike Swap Rate in contract.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-emerald-400">A<sub>n</sub>(r)</span>
              <p className="text-[11px] text-slate-300 font-sans">Annuity Factor (Sum of PV discount factors for swap tenor n).</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">N</span>
              <p className="text-[11px] text-slate-300 font-sans">Swaption Notional Principal amount.</p>
            </div>
          </div>
        </div>

        {/* STATIC DECISION TREE: SWAPTION EXERCISE */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            🌿 Static Decision Tree: Swaption Exercise & Settlement Matrix
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Payer Swaption Decision</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Exercise IF Market Swap Rate &gt; Strike Rate
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Hedges future debt issuance by capping fixed borrowing rate.
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Receiver Swaption Decision</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Exercise IF Market Swap Rate &lt; Strike Rate
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Hedges future bond investment yields against falling yields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* ==========================================
    AFM CHAPTER: SECURITY VALUATION HIGH FIDELITY VIEW
   ========================================== */}
export function AfmSecurityValuationHighFidelityView() {
  return (
    <div className="space-y-8 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
              <Award className="h-3.5 w-3.5 text-indigo-400" /> CA Final AFM Masterclass Notes • High-Yield Revision
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Security Valuation (Equity, Fixed Income & Enterprise Valuation)
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Complete Exam-Oriented Master Notes • Statutory Valuation Models, Bond Theorems, DDM, FCFF/FCFE & RV Rules 2017
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-200 shrink-0">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>ICAI Weightage: 12 - 18 Marks</span>
          </div>
        </div>
      </div>

      {/* TOPIC 1 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            01
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Conceptual Foundations of Security Valuation & Required Return
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Intrinsic value estimation, required rate of return ($K_e$), and market price efficiency
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Intrinsic Value ($V_0$) vs. Market Price ($P_0$):</strong> Security valuation estimates the present value of expected future economic benefits. An investor compares $V_0$ to current market price $P_0$ to identify mispriced securities.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Required Rate of Return ($K_e$):</strong> Represents the minimum rate of return necessary to compensate investors for committing capital and bearing systematic risk ($K_e = R_f + \textRisk Premium$).
            </div>
          </li>
        </ul>

        {/* FORMULA CARD 1 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Intrinsic Value Decision Matrix & Required Return Equation
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              Valuation Rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">P_0 &lt; V_0 (Undervalued)</span>
              <div className="text-xs font-bold text-white">Action: BUY Share</div>
              <p className="text-[10px] text-slate-300">Expected return &gt; Required return</p>
            </div>
            <div className="p-4 bg-rose-950/40 rounded-xl border border-rose-500/30 space-y-1">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">P_0 &gt; V_0 (Overvalued)</span>
              <div className="text-xs font-bold text-white">Action: SELL / SHORT</div>
              <p className="text-[10px] text-slate-300">Expected return &lt; Required return</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">P_0 = V_0 (Fairly Priced)</span>
              <div className="text-xs font-bold text-white">Action: HOLD</div>
              <p className="text-[10px] text-slate-300">Market is in equilibrium</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 2 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            02
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Capital Asset Pricing Model (CAPM) & Equity Risk Premium
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Systematic risk ($\beta$), Security Market Line (SML), and market risk premium
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Systematic vs Unsystematic Risk:</strong> Diversification eliminates firm-specific (unsystematic) risk. CAPM asserts investors are compensated strictly for systematic risk ($\beta$), which measures sensitivity to broader market movements.
            </div>
          </li>
        </ul>

        {/* FORMULA CARD 2 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 CAPM Required Return on Equity Equation
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              SML Model
            </span>
          </div>

          <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner text-center space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Security Market Line Formula</span>
            <div className="py-3 font-mono text-base font-extrabold text-white tracking-wide">
              K<sub>e</sub> = R<sub>f</sub> + β<sub>i</sub> × (R<sub>m</sub> - R<sub>f</sub>)
            </div>
          </div>

          {/* VARIABLE LEGEND */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">R<sub>f</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Risk-Free Rate (Yield on 91-Day Treasury Bills / Sovereign Bonds).</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">β<sub>i</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Covariance of asset $i$ return with market return divided by Variance of market.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400">R<sub>m</sub> - R<sub>f</sub></span>
              <p className="text-[11px] text-slate-300 font-sans">Equity Market Risk Premium (EMRP) required for market index risk.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 3 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            03
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Dividend Discount Models (DDM): Constant Growth & H-Model
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Gordon Constant Growth ($P_0 = D_1 / (K_e - g)$), retention growth ($g = b \times r$), and H-Model linear decay
            </p>
          </div>
        </div>

        {/* FORMULA CARD 3 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Gordon Model & H-Model Equations
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              DDM Suite
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">Gordon Constant Growth DDM</span>
              <div className="py-2 font-mono text-sm font-extrabold text-white">
                P<sub>0</sub> = D<sub>1</sub> / (K<sub>e</sub> - g) = [D<sub>0</sub>(1 + g)] / (K<sub>e</sub> - g)
              </div>
              <p className="text-[10px] text-slate-400">Where growth $g = b \times r$ ($b$ = retention, $r$ = ROE)</p>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">H-Model Transition DDM</span>
              <div className="py-2 font-mono text-xs font-extrabold text-white">
                P<sub>0</sub> = [D<sub>0</sub>(1 + g<sub>n</sub>)] / (r - g<sub>n</sub>) + [D<sub>0</sub> × H × (g<sub>c</sub> - g<sub>n</sub>)] / (r - g<sub>n</sub>)
              </div>
              <p className="text-[10px] text-slate-400">Half-life $H = \textTransition Years / 2$</p>
            </div>
          </div>
        </div>

        {/* WORKED EXAMPLE */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider block">
            Meticulous H-Model Worked Example:
          </span>
          <p className="font-semibold text-emerald-200">
            A firm pays current dividend D0 = ₹2.00. Extraordinary growth gc = 12% declines linearly over 6 years (H = 3) to normal stable growth gn = 7%. Cost of equity r = 15%.
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-white border border-slate-800 overflow-x-auto">
            P0 = [2 × 1.07] / (0.15 - 0.07) + [2 × 3 × (0.12 - 0.07)] / (0.15 - 0.07)<br/>
            P0 = 2.14 / 0.08 + 0.30 / 0.08 = 26.75 + 3.75 = ₹30.50
          </div>
          <p className="text-emerald-300 font-bold">Intrinsic Value per share = ₹30.50 (Normal Value ₹26.75 + Abnormal Growth Premium ₹3.75)</p>
        </div>
      </div>

      {/* TOPIC 4 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            04
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Earning-Based Valuation: Gordon & Walter Models
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Capitalization of earnings, retention policy impact, and internal return ($r$) vs cost of capital ($K_e$)
            </p>
          </div>
        </div>

        {/* FORMULA CARD 4 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Walter Model Share Price Equation
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              Walter Valuation
            </span>
          </div>

          <div className="p-6 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner text-center space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Walter Model Formula</span>
            <div className="py-2 font-mono text-sm md:text-base font-extrabold text-white tracking-wide">
              P<sub>0</sub> = [ D + (r / K<sub>e</sub>) × (E - D) ] / K<sub>e</sub>
            </div>
          </div>

          {/* POLICY MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="font-extrabold text-emerald-400 uppercase font-mono text-[10px]">Growth Firm (r &gt; K_e)</span>
              <p className="text-[11px] text-slate-300">Optimal Dividend Payout = 0% (Retention = 100%). Share price is maximized by retaining all earnings for reinvestment.</p>
            </div>
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 space-y-1">
              <span className="font-extrabold text-rose-400 uppercase font-mono text-[10px]">Declining Firm (r &lt; K_e)</span>
              <p className="text-[11px] text-slate-300">Optimal Dividend Payout = 100% (Retention = 0%). Firm earns less than investor opportunity cost; distribute all cash.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 space-y-1">
              <span className="font-extrabold text-indigo-400 uppercase font-mono text-[10px]">Normal Firm (r = K_e)</span>
              <p className="text-[11px] text-slate-300">Dividend policy is neutral. Share price remains constant across all payout ratios.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 5 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            05
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Free Cash Flow Models (FCFF & FCFE)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Free Cash Flow to Firm (FCFF @ WACC) vs. Free Cash Flow to Equity (FCFE @ $K_e$)
            </p>
          </div>
        </div>

        {/* FORMULA CARD 5 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Free Cash Flow Computation Equations
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              FCFF & FCFE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">FCFF (All Stakeholders)</span>
              <div className="py-2 font-mono text-xs font-extrabold text-white">
                FCFF = EBIT(1 - t) + Depr - CAPEX - ΔNWC
              </div>
              <p className="text-[10px] text-slate-400">Discount Rate: WACC ($K_o$). Yields Firm Enterprise Value.</p>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">FCFE (Equity Shareholders)</span>
              <div className="py-2 font-mono text-xs font-extrabold text-white">
                FCFE = Net Income + Depr - CAPEX - ΔNWC + Net Debt Issuance
              </div>
              <p className="text-[10px] text-slate-400">Discount Rate: Cost of Equity ($K_e$). Yields Equity Value.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 6 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            06
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Enterprise Value & Valuation of Rights Issues
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Value (EV) components, Theoretical Ex-Rights Price (TERP), and value of a right
            </p>
          </div>
        </div>

        {/* FORMULA CARD 6 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Enterprise Value & Rights Equations
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              EV & Rights
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Enterprise Value Formula</span>
              <div className="py-2 font-mono text-xs font-extrabold text-white">
                EV = Market Cap + Total Debt + Minority Interest - Cash & Liquid Investments
              </div>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">Theoretical Ex-Right Price (TERP)</span>
              <div className="py-2 font-mono text-xs font-extrabold text-white">
                TERP = (n × P<sub>0</sub> + S) / (n + n<sub>1</sub>)
              </div>
              <p className="text-[10px] text-slate-400">Value of Right $R = TERP - P_{"sub"}$</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 7 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            07
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Fixed Income Valuation & Core Bond Theorems
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Bond pricing equation ($V_b = I \cdot PVIFA + F \cdot PVIF$) and fundamental bond pricing theorems
            </p>
          </div>
        </div>

        {/* STATIC TABLE: BOND THEOREMS */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
            📊 Core Bond Value Theorems Matrix
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">YTM = Coupon Rate</div>
              <div className="text-[11px] text-indigo-400 font-bold">Bond Price = Par Value</div>
              <div className="text-[10px] text-slate-500 font-sans mt-1">Sells at nominal face value</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-rose-600 dark:text-rose-400 mb-1">YTM &gt; Coupon Rate</div>
              <div className="text-[11px] text-rose-400 font-bold">Bond Price &lt; Par Value</div>
              <div className="text-[10px] text-slate-500 font-sans mt-1">Sells at Discount</div>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">YTM &lt; Coupon Rate</div>
              <div className="text-[11px] text-emerald-400 font-bold">Bond Price &gt; Par Value</div>
              <div className="text-[10px] text-slate-500 font-sans mt-1">Sells at Premium</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 8 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            08
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Bond Duration, Modified Duration & Price Sensitivity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Macaulay Duration, Modified Duration ($D_{"mod"} = D_{"mac"} / (1 + YTM/m)$), and interest rate volatility
            </p>
          </div>
        </div>

        {/* FORMULA CARD 8 */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-indigo-500/30 text-slate-100 shadow-xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
              📐 Macaulay & Modified Duration Volatility Formula
            </span>
            <span className="text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
              Duration Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">Modified Duration Equation</span>
              <div className="py-2 font-mono text-sm font-extrabold text-white">
                D<sub>mod</sub> = D<sub>mac</sub> / [1 + (YTM / m)]
              </div>
            </div>

            <div className="p-5 bg-slate-950/90 rounded-xl border border-indigo-400/20 shadow-inner space-y-2 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">Bond Price Volatility Estimate</span>
              <div className="py-2 font-mono text-sm font-extrabold text-white">
                % Δ Price ≈ - D<sub>mod</sub> × Δ YTM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 9 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            09
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Bond Immunization & Term Structure Theories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Portfolio immunization condition ($D_p = H$), offsetting price and reinvestment risk, and term structure hypotheses
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Immunization Rule:</strong> Achieved when Portfolio Duration equals the investor's target holding period horizon ($D_p = H$). At this point, capital gain/loss from price risk exactly offsets reinvestment income gain/loss from interest rate changes.
            </div>
          </li>
        </ul>
      </div>

      {/* TOPIC 10 */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs">
            10
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Registered Valuers Rules 2017 & Professional Ethics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Rule 12(e) Companies (Registered Valuers and Valuation) Rules 2017 Model Code of Conduct & Statutory Compliance
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Integrity & Fairness:</strong> Valuers must refrain from misrepresentation or bias in valuation reports under Rule 12(e).
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Prohibition on Contingent / Success Fees:</strong> Valuers are strictly prohibited from charging success-based fees contingent on a specific valuation result.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Preservation of Working Papers:</strong> Registered valuers must retain all working papers, financial models, and research documents for a minimum of <strong>3 years</strong> from report issue date.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function AfmSecuritizationHighFidelityView() {
  return (
    <div className="space-y-8 font-sans">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
              <Award className="h-3.5 w-3.5 text-sky-400" /> CA Final AFM Revision Notes • ICAI Study Material
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Chapter 7: Securitization
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              High-Yield Revision Masterclass • Pool Mechanics, Participants, PTC vs PTS, Stripped Securities, SARFAESI & Tokenization
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-200 shrink-0">
            <BookOpen className="h-4 w-4 text-sky-400" />
            <span>ICAI Weightage: 6 - 10 Marks</span>
          </div>
        </div>
      </div>

      {/* TOPIC 1: CONCEPT & CORE FEATURES */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            01
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Concept, RBI Definition & Architectural Features
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Repackaging illiquid receivables into liquid marketable securities
            </p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Definition & Concept:</strong> Securitization is the process of converting illiquid financial assets (housing loans, auto loans, credit card receivables, commercial loans) into liquid, tradable financial instruments backed by collaterals.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0 mt-2"></span>
            <div>
              <strong className="font-extrabold text-slate-900 dark:text-white">Statutory RBI Definition:</strong> Transactions where credit risks in assets are redistributed by repackaging them into tradable securities.
            </div>
          </li>
        </ul>

        {/* 6 CORE FEATURES GRID */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Six Core Features of Securitization
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono font-extrabold text-sky-600 dark:text-sky-400 uppercase">Feature #1</span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Creation of Financial Instruments</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">Generates new collateral-backed financial products for capital markets.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono font-extrabold text-sky-600 dark:text-sky-400 uppercase">Feature #2</span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Bundling and Unbundling</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">Combines assets into a single pool (bundling) and breaks into fixed denominations (unbundling).</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono font-extrabold text-sky-600 dark:text-sky-400 uppercase">Feature #3</span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Tool of Risk Management</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">On non-recourse basis, transfers default risk from originator to investors.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono font-extrabold text-sky-600 dark:text-sky-400 uppercase">Feature #4</span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Structured Finance</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">Instruments tailor-structured to match distinct investor risk-return appetites.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono font-extrabold text-sky-600 dark:text-sky-400 uppercase">Feature #5</span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Tranching</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">Splits asset pool into different risk-return slices (Senior, Mezzanine, Equity).</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono font-extrabold text-sky-600 dark:text-sky-400 uppercase">Feature #6</span>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Homogeneity</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">Securities issued within each tranche carry identical rate, maturity, and risk profile.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 2: BENEFITS MATRIX */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            02
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Benefits Matrix: Originator vs. Investor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dual-perspective strategic advantages of securitization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ORIGINATOR BENEFITS */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Building2 className="h-4 w-4" /> Benefits to Originator
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li>• <strong>Off-Balance Sheet Financing:</strong> Unlocks capital tied up in long-term loans, improving liquidity without increasing leverage or altering Debt-Equity ratio.</li>
              <li>• <strong>Focus on Core Business:</strong> Transfers loan administration and servicing to SPV, allowing concentration on primary operations.</li>
              <li>• <strong>Financial Ratio Management:</strong> Effectively manages Capital-to-Risk Weighted Asset Ratio (CRAR/CAR) for banks and financial institutions.</li>
              <li>• <strong>Reduced Borrowing Cost:</strong> Credit enhancement raises paper credit ratings, enabling lower interest payouts and generating spread income.</li>
            </ul>
          </div>

          {/* INVESTOR BENEFITS */}
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Briefcase className="h-4 w-4" /> Benefits to Investor
            </div>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li>• <strong>Risk Diversification:</strong> Portfolio backed by pooled diversified assets reduces single-borrower default concentration risk.</li>
              <li>• <strong>Regulatory Compliance:</strong> Allows commercial banks to acquire assets in specific industries to meet RBI Priority Sector Lending (PSL) mandates.</li>
              <li>• <strong>Protection Against Default:</strong> Recourse arrangements mandate originator compensation for losses; credit enhancement & insurance provide additional safeguards.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* TOPIC 3: PARTICIPANTS IN SECURITIZATION */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            03
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Participants Ecosystem: Primary vs. Secondary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Roles and duties of key stakeholders in securitization deals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* PRIMARY PARTICIPANTS */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
            <h4 className="text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Primary Participants (Main Deal Parties)
            </h4>
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">1. Originator (Securitizer):</strong> Entity that owns and sells illiquid assets from its balance sheet to SPV, receiving immediate cash funds.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">2. Special Purpose Vehicle (SPV):</strong> Independent bankruptcy-remote entity (company, trust, society) created exclusively to hold legal title to assets, ring-fence them from the originator, and issue ABS/MBS to investors.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">3. Investors:</strong> Buyers of securitized debt (MFs, Insurance Cos, PFs, Banks, FIs) receiving principal and interest returns from pool cash flows.
              </div>
            </div>
          </div>

          {/* SECONDARY PARTICIPANTS */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
            <h4 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Secondary Participants (Support Service Roles)
            </h4>
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div>• <strong>Obligors:</strong> Original borrowers who owe money; their credit standing forms the root of cash flows.</div>
              <div>• <strong>Rating Agency:</strong> Assesses cash flow strength, timely interest/principal mechanisms, liquidity support, and legal framework.</div>
              <div>• <strong>Servicer / RPA (Receiving & Paying Agent):</strong> Collects dues from obligors, remits to SPV, and pursues defaulting borrowers for a fee.</div>
              <div>• <strong>Trustee:</strong> Oversees deal performance and protects investor interests.</div>
              <div>• <strong>Credit Enhancer:</strong> Provides internal (over-collateralization) or external (Letter of Credit, surety bonds) credit support.</div>
              <div>• <strong>Structurer / Arranger:</strong> Investment bankers who structure the deal to meet legal, accounting, tax, and regulatory compliance.</div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 4: MECHANISM FLOWCHART */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            04
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Seven-Step Operational Mechanism & Cash Flow Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              End-to-end procedural execution flow in securitization
            </p>
          </div>
        </div>

        {/* SEQUENTIAL FLOWCHART DIAGRAM */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3 overflow-x-auto border border-slate-800">
          <div className="text-sky-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2">
            [Text-Based Process Flowchart: Securitization Lifecycle]
          </div>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 1: Pool Creation</strong> ➔ Segregate homogenous illiquid loans (by rate, risk, maturity, collateral).
            </div>
            <div className="text-center text-sky-400 font-black">↓ Transfer Legal Title & Receivables</div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 2: Transfer to SPV</strong> ➔ Originator sells pool to bankruptcy-remote SPV for upfront cash.
            </div>
            <div className="text-center text-sky-400 font-black">↓ Issue ABS / MBS / PTCs</div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 3: Sale of Securitized Papers</strong> ➔ SPV sells PTCs / PTS to investors; receives funds.
            </div>
            <div className="text-center text-sky-400 font-black">↓ Sub-contract Servicing</div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 4: Asset Administration</strong> ➔ Servicer/Originator collects monthly EMIs from obligors ➔ Passes to SPV.
            </div>
            <div className="text-center text-sky-400 font-black">↓ Evaluate Default / Recourse Terms</div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 5: Recourse to Originator</strong> ➔ If recourse exists, defaulted receivables return to originator.
            </div>
            <div className="text-center text-sky-400 font-black">↓ Repay Principal & Interest</div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 6: Repayment of Funds</strong> ➔ SPV distributes cash flows to investors as agreed.
            </div>
            <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
              <strong>STEP 7: Credit Rating</strong> ➔ Ongoing credit rating monitoring by rating agencies.
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 5: INSTRUMENTS TAXONOMY (PTC vs PTS vs STRIPPED) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            05
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Taxonomy of Securitization Instruments: PTC vs. PTS vs. Stripped
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Structural classification based on maturity and cash flow distribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PTC */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[10px] font-bold uppercase">Format A</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pass Through Certificates (PTCs)</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Originator transfers entire receipt of interest and principal directly to investors. Investors hold direct proportional beneficial claim on trust assets.
            </p>
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
              <strong>Key Trait:</strong> Early loan prepayments are immediately passed to holders, causing cash flow skewness and simultaneous termination of all certificates.
            </div>
          </div>

          {/* PTS */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase">Format B</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pay Through Securities (PTS)</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              SPV issues its own debt securities backed by assets. Desynchronizes asset collections from investor payouts, allowing multi-tranche issue with varying maturities.
            </p>
            <div className="p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-800 dark:text-indigo-300 font-medium">
              <strong>Key Trait:</strong> Early prepayment surplus cash can be reinvested in short-term yield instruments before paying investors.
            </div>
          </div>

          {/* STRIPPED */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold uppercase">Format C</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Stripped Securities (IO & PO)</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Divided into Interest Only (IO) and Principal Only (PO) securities. Highly volatile; prices dictated by interest rate expectations & prepayment speeds.
            </p>
            <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-800 dark:text-purple-300 font-medium">
              <strong>IO vs PO:</strong> Rates Rise ➔ IO Value ↑, PO Price ↓. Rates Fall ➔ Prepayments ↑ ➔ PO Price ↑, IO Value ↓.
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 6: PRICING & RISK TAXONOMY */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            06
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Pricing Mechanics & Risk Taxonomy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Valuation perspectives and risk management exposures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* PRICING */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Pricing Perspectives
            </h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <strong>• Originator's Angle:</strong> Priced at rate of cash outflow incurred, amortized over time by investing proceeds raised from securitization into core business assets.
              </div>
              <div>
                <strong>• Investor's Angle:</strong> Security price determined by discounting expected future cash flows using YTM of comparable quality & average life securities off the yield curve, plus credit enhancement spread adjustments.
              </div>
            </div>
          </div>

          {/* RISKS */}
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 space-y-3">
            <h4 className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Risks in Securitization
            </h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div><strong>1. Credit / Counterparty Risk:</strong> Servicer bankruptcy or non-performance risk.</div>
              <div><strong>2. Legal Risk:</strong> Ownership disputes over pool cash flows due to lack of explicit statutory precedents.</div>
              <div><strong>3. Market Risk:</strong>
                <ul className="pl-3 mt-1 space-y-1 text-[11px]">
                  <li>- <em>Macroeconomic Risk:</em> Industry downturns (e.g. CV operator defaults).</li>
                  <li>- <em>Prepayment Risk:</em> Falling interest rates cause early retail loan payoffs & reinvestment risk.</li>
                  <li>- <em>Interest Rate Risk:</em> Floating pool inflow vs fixed investor payout mismatch (hedged via Swaps).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOPIC 7: TOKENIZATION vs SECURITIZATION & INDIAN CONTEXT */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="h-8 w-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-black text-xs">
            07
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              Tokenization vs Securitization & Indian Statutory Framework
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Blockchain tokenization comparison & SARFAESI Act, 2002 provisions
            </p>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-900 dark:text-white font-bold">
                <th className="p-2.5">Dimension</th>
                <th className="p-2.5">Traditional Securitization</th>
                <th className="p-2.5">Blockchain Tokenization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">Core Technology</td>
                <td className="p-2.5">Paper/demat SPV trust structure</td>
                <td className="p-2.5">Distributed Ledger Technology (DLT) & Smart Contracts</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">Liquidity Injection</td>
                <td className="p-2.5">Converts illiquid loans into ABS/MBS</td>
                <td className="p-2.5">Converts tangible/intangible assets into digital tokens</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">Intermediaries</td>
                <td className="p-2.5">Requires SPV, Trustee, Servicer, Rating Agency</td>
                <td className="p-2.5">Peer-to-peer automated smart contract protocol</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 dark:text-white">Trading & Fee Income</td>
                <td className="p-2.5">Secondary market debt trading; fee to FIs</td>
                <td className="p-2.5">Fractional digital trading 24/7; fee to platforms</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* INDIAN CONTEXT & SARFAESI */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 space-y-3">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Securitization in India & Legal Facilitation
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li>• <strong>Indian Pioneers:</strong> Citibank pioneered auto loan securitization; expanded to sales tax deferrals, aircraft receivables, microfinance, and CMBS.</li>
            <li>• <strong>Indian Obstacles:</strong> High Stamp Duty u/s Transfer of Property Act 1882 (up to 12% in some states; PTCs given exemptions), Income Tax Act ambiguity (representative trustee vs investor tax), and slow foreclosure laws.</li>
            <li>• <strong>SARFAESI Act, 2002:</strong> Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act passed to tackle NPAs without court intervention. Enables Asset Reconstruction Companies (ARCs) to acquire bad debt and issue Security Receipts (SRs).</li>
            <li>• <strong>SEBI & FPI Guidelines:</strong> SEBI permits Foreign Portfolio Investors (FPIs) to invest in securitized debt of unlisted companies up to prescribed limits. Market volume touched ~₹1.9 trillion (FY19/FY20).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function IndAS105HighFidelityView() {
  return (
    <div className="space-y-12 text-left font-sans text-slate-100">
      
      {/* PAGE 1 CONTAINER */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* TOP HEADER BANNER */}
        <div className="bg-[#121a2d] border border-slate-700/80 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-amber-400 text-xs tracking-widest uppercase bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
                PRACTACE — RE-WISE
              </span>
            </div>
            <span className="font-mono font-bold text-[10px] text-slate-300 bg-indigo-950/80 border border-indigo-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
              NOV 2026 · AY 2026-27
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Ind AS 105
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-300 tracking-wide mt-0.5">
              Non-Current Assets Held for Sale &amp; Discontinued Operations
            </p>
          </div>
        </div>

        {/* ONE-LINE OBJECTIVE */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed">
          <span className="font-black text-amber-400 uppercase font-mono tracking-wider block mb-1">
            One-line objective:
          </span>
          Assets recovered through <strong className="text-white">sale, not continued use</strong>, are separated out and <strong className="text-amber-300">stop depreciating</strong>; discontinued operations are shown as <strong className="text-white">one line, net of tax</strong>, so readers can see what's actually continuing.
        </div>

        {/* SECTION 1: CLASSIFICATION — THE TWO-TEST GATE */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              CLASSIFICATION — THE TWO-TEST GATE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* TEST A */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="font-mono font-bold text-slate-100 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <span className="text-amber-400">TEST A</span> — Available for immediate sale
              </h4>
              <ul className="space-y-2 text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span><strong>Sellable in present condition</strong> — only usual/customary terms allowed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Not vital to ongoing ops, not mid-refurbishment for value-add</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Vacating for a buyer = OK; vacating for a replacement = fails test</span>
                </li>
              </ul>
            </div>

            {/* TEST B */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h4 className="font-mono font-bold text-slate-100 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <span className="text-amber-400">TEST B</span> — Sale "highly probable" (5 conditions, all must hold)
              </h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Management committed to the plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Active programme to find a buyer initiated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Actively marketed at reasonable price vs FV</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Completion expected within 1 year (exceptions below)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">☑</span>
                  <span>Significant changes/withdrawal unlikely</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 1-YEAR EXCEPTION CALLOUT BANNER */}
          <div className="p-3.5 rounded-xl bg-[#121c2e] border border-indigo-500/40 text-xs space-y-1">
            <span className="font-mono font-black text-amber-300 text-[11px] uppercase tracking-wider block">
              1-year exception:
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              still qualifies if delay is caused by events <strong>beyond entity's control</strong> AND entity remains <strong>demonstrably committed</strong> (e.g. regulatory approval pending, buyer-mandated remediation, price cut in response to market fall).
            </p>
          </div>
        </div>

        {/* SECTION 2: KEY DEFINITIONS — RECALL TRIGGERS */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              KEY DEFINITIONS — RECALL TRIGGERS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 font-mono block uppercase">Disposal group</span>
              <p className="text-slate-300 leading-relaxed">
                Assets + directly associated liabilities disposed of together in ONE transaction. Includes goodwill if it's a CGU or part of one.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 font-mono block uppercase">Discontinued operation</span>
              <p className="text-slate-300 leading-relaxed">
                Component that is disposed/held-for-sale AND is (a) separate major line/geo area, (b) part of single coordinated disposal plan, or (c) subsidiary acquired solely to resell.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 font-mono block uppercase">Component of entity</span>
              <p className="text-slate-300 leading-relaxed">
                Ops + cash flows clearly distinguishable, operationally &amp; for reporting — i.e. a CGU or group of CGUs.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 font-mono block uppercase">Recoverable amount</span>
              <p className="text-slate-300 leading-relaxed">
                Higher of (FV − cost of disposal) and Value in Use.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: MEASUREMENT — THE SEQUENCE */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              MEASUREMENT — THE SEQUENCE
            </h3>
          </div>

          <div className="space-y-2 text-xs font-medium">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p className="text-slate-200">
                Immediately before classification: remeasure carrying amount under the normal applicable Ind AS (16, 2, 109 etc.)
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p className="text-slate-200">
                Then measure at lower of carrying amount and FV − cost to sell. Any write-down = impairment loss to P&amp;L.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p className="text-slate-200">
                Depreciation/amortisation <strong className="text-amber-400 uppercase">STOPS</strong> from date of classification — even if not yet sold.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
              <p className="text-slate-200">
                Subsequent gains allowed, but capped at cumulative impairment recognised (never write back above original carrying amount, and never reverse goodwill impairment).
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</span>
              <p className="text-slate-200">
                Impairment allocation order in a disposal group: <strong className="text-amber-300">Goodwill first</strong>, then pro-rata to other in-scope non-current assets by carrying value.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: WHAT'S SCOPED OUT OF IND AS 105 MEASUREMENT */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              WHAT'S SCOPED OUT OF IND AS 105 MEASUREMENT
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-amber-400 font-mono font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">ASSET</th>
                  <th className="py-2.5 px-4">GOVERNING STANDARD</th>
                  <th className="py-2.5 px-4">ASSET</th>
                  <th className="py-2.5 px-4">GOVERNING STANDARD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="py-2 px-4 font-medium">Deferred tax assets</td>
                  <td className="py-2 px-4 font-mono font-bold text-indigo-400">Ind AS 12</td>
                  <td className="py-2 px-4 font-medium">Financial assets</td>
                  <td className="py-2 px-4 font-mono font-bold text-indigo-400">Ind AS 109</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Employee benefit assets</td>
                  <td className="py-2 px-4 font-mono font-bold text-indigo-400">Ind AS 19</td>
                  <td className="py-2 px-4 font-medium">Agriculture assets (FV less cost)</td>
                  <td className="py-2 px-4 font-mono font-bold text-indigo-400">Ind AS 41</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Insurance contract groups</td>
                  <td className="py-2 px-4 font-mono font-bold text-indigo-400">Ind AS 117</td>
                  <td className="py-2 px-4 font-medium">Contractual rights (Ind AS 104)</td>
                  <td className="py-2 px-4 font-mono font-bold text-indigo-400">Ind AS 104</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            These are remeasured under their own standard FIRST, then the disposal group's FV-less-cost-to-sell is assessed as a whole.
          </p>
        </div>

        {/* SECTION 5: NOT HELD-FOR-SALE (COMMON CONFUSIONS) — TRAP 1 */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              5
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              NOT HELD-FOR-SALE (COMMON CONFUSIONS)
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[#2a1215] border border-rose-500/40 space-y-1.5 text-xs">
            <span className="font-mono font-black text-rose-300 uppercase tracking-wider block">
              TRAP 1 — ABANDONMENT ≠ HELD FOR SALE
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              Assets to be abandoned/closed (not sold) are <strong>never classified as held for sale</strong> — carrying amount is recovered through continuing use, not sale. But if abandonment meets the discontinued-operation definition, disclose as discontinued anyway.
            </p>
          </div>
        </div>

        {/* PAGE 1 FOOTER */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>practACE · Re-Wise · Ind AS 105</span>
          <span className="text-amber-400 font-bold">Page 1 of 2</span>
        </div>

      </div>

      {/* PAGE 2 CONTAINER */}
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* TRAPS 2, 3, 4 CONTINUED */}
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-[#2a1215] border border-rose-500/40 space-y-1.5">
            <span className="font-mono font-black text-rose-300 uppercase tracking-wider block">
              TRAP 2 — TEMPORARILY IDLE ≠ ABANDONED
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              A plant idled due to low demand but kept workable for future use is <strong>neither abandoned nor held for sale</strong> — keep depreciating normally.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#2a1215] border border-rose-500/40 space-y-1.5">
            <span className="font-mono font-black text-rose-300 uppercase tracking-wider block">
              TRAP 3 — ONE OUTLET ≠ DISCONTINUED OPERATION
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              Selling one branch/outlet out of 200 is a disposal group, <strong>NOT a discontinued operation</strong> — it isn't a separate major line of business or geographical area (classic Sun Ltd-style question).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#2a1215] border border-rose-500/40 space-y-1.5">
            <span className="font-mono font-black text-rose-300 uppercase tracking-wider block">
              TRAP 4 — WINDING DOWN ≠ DISCONTINUED YET
            </span>
            <p className="text-slate-200 leading-relaxed font-medium">
              While existing contracts are still being completed (even if no new ones are taken), the operation is still <strong>"in use"</strong> — it becomes discontinued only once the last contract completes.
            </p>
          </div>
        </div>

        {/* SECTION 6: DISCONTINUED OPERATIONS — P&L PRESENTATION */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              6
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              DISCONTINUED OPERATIONS — P&amp;L PRESENTATION
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-3">
            <p>
              <strong className="text-amber-300">Single line item on face of P&amp;L</strong> = post-tax profit/loss of discontinued ops + post-tax gain/loss on remeasurement or disposal. Breakup (revenue/expenses/pre-tax/tax) goes in notes or a separate P&amp;L section. Comparatives are <strong>re-presented</strong> (unlike held-for-sale balance sheet items, which are never restated comparatively).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono font-bold text-slate-100 text-[11px] block">Also disclose separately:</span>
                <p className="text-slate-300 text-[11px]">
                  Net cash flows (operating/investing/financing) of discontinued ops; basic &amp; diluted EPS for discontinued ops (Ind AS 33).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-mono font-bold text-slate-100 text-[11px] block">If entity reverses the plan:</span>
                <p className="text-slate-300 text-[11px]">
                  Reclassify discontinued-ops results back into continuing operations for ALL periods presented — restated, not just current year.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: IND AS 105 VS AS 24 — HIGH-YIELD DIFFERENCES */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              7
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              IND AS 105 VS AS 24 — HIGH-YIELD DIFFERENCES
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-amber-400 font-mono font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">ASPECT</th>
                  <th className="py-2.5 px-4">IND AS 105</th>
                  <th className="py-2.5 px-4">AS 24</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-100">Core concept</td>
                  <td className="py-2.5 px-4">Discontinued operations + held-for-sale assets</td>
                  <td className="py-2.5 px-4 text-slate-400">Only "discontinuing" operations — no held-for-sale concept</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-100">Timeframe</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-amber-300">Sale expected within 1 year</td>
                  <td className="py-2.5 px-4 text-slate-400">No time limit specified</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-100">Abandonment</td>
                  <td className="py-2.5 px-4">Explicitly excluded from held-for-sale</td>
                  <td className="py-2.5 px-4 text-slate-400">Treated as a discontinuing operation</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-100">Measurement</td>
                  <td className="py-2.5 px-4">Lower of carrying amount &amp; FV − cost to sell</td>
                  <td className="py-2.5 px-4 text-slate-400">Falls back on other AS (e.g. AS 10 for PPE)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-100">Change-of-plan guidance</td>
                  <td className="py-2.5 px-4">Detailed remeasurement guidance given</td>
                  <td className="py-2.5 px-4 text-slate-400">Not addressed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 8: NUMERIC PATTERN RECALL (FROM ILLUSTRATIONS) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
            <span className="h-6 w-6 rounded bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center shrink-0">
              8
            </span>
            <h3 className="text-sm font-black text-amber-300 uppercase font-mono tracking-wider">
              NUMERIC PATTERN RECALL (FROM ILLUSTRATIONS)
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <span className="font-mono font-bold text-amber-300 block uppercase">
              Standard exam flow for a disposal group question
            </span>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <p className="text-slate-200">Remeasure each asset under its own Ind AS right before classification.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <p className="text-slate-200">Sum the carrying values.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <p className="text-slate-200">Compare the total to FV − cost to sell.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">4</span>
                <p className="text-slate-200">
                  Impairment, if any, hits <strong className="text-amber-300">goodwill first</strong>, then pro-rata to remaining in-scope non-current assets by carrying value.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">5</span>
                <p className="text-slate-200">
                  Inventory, financial assets and DTA are <strong>excluded</strong> from this pro-rata allocation.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
              This 5-step pattern repeats across nearly every numerical illustration in this unit (Ex. 15, 16, Q3, Q4) — memorise the sequence, not the numbers.
            </p>
          </div>
        </div>

        {/* PAGE 2 FOOTER */}
        <div className="border-t border-slate-800 pt-4 space-y-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          <p>practACE · Re-Wise Series — sourced exclusively from ICAI BoS Study Material · Not a substitute for the full module · For CA Final Nov 2026 attempt</p>
          <div className="flex justify-between items-center pt-1 text-slate-400 font-bold">
            <span>practACE · Re-Wise · Ind AS 105</span>
            <span className="text-amber-400">Page 2 of 2</span>
          </div>
        </div>

      </div>

    </div>
  );
}



