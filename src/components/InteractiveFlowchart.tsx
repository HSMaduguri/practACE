import React, { useState } from 'react';
import { 
  Network, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  ArrowDown,
  GitBranch,
  FileText,
  Settings,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

interface InteractiveFlowchartProps {
  title: string;
}

export default function InteractiveFlowchart({ title }: InteractiveFlowchartProps) {
  const [activeRegisterTab, setActiveRegisterTab] = useState<'aadhaar' | 'amendment'>('aadhaar');

  // 1. GST Supply Determination Flow Chart (IDT Ch 1)
  const renderGstSupplyFlow = () => {
    return (
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Step 1: Core Ambit Screening</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Supply of "Goods" u/s 2(52) or "Services" u/s 2(102)?</h5>
            <p className="text-[10px] text-white mt-1">Must represent transferable movable property or activities related to money conversion/use.</p>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-white dark:bg-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Step 2: Consideration & Deeming Test</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Is a contractual Consideration charged?</h5>
            
            <div className="grid grid-cols-2 gap-3 mt-3 pt-2.5 border-t dark:border-slate-800 border-slate-100">
              <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block">YES</span>
                <span className="text-[9px] text-white">Taxable u/s 7(1)(a) or 7(1)(b)</span>
              </div>
              <div className="bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 block">NO</span>
                <span className="text-[9px] text-white">Only if covered by Schedule I</span>
              </div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-white dark:bg-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Step 3: Commercial Intent</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">In Course or Furtherance of Business?</h5>
            <p className="text-[10px] text-white mt-1">Exception: Importation of services for consideration u/s 7(1)(b) is Always Taxable.</p>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* Step 4 & Final Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15"
          >
            <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-450">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <h6 className="text-xs font-bold uppercase tracking-wider">Schedule III Negative List</h6>
            </div>
            <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans">
              If the transaction is listed under Schedule III (e.g. employee duty, sale of land, funeral services), it is treated as a <strong>Non-Supply</strong>. No GST levy ever.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15"
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <h6 className="text-xs font-bold uppercase tracking-wider">Fully Taxable Supply</h6>
            </div>
            <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans">
              Fulfills all criteria of Section 7(1), falls outside negative limits. Subject to CGST + SGST (Intra-state) or IGST (Inter-state) u/s 9.
            </p>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderCompositionFlow = () => {
    return (
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Step 1: Preceding FY Aggregate Turnover Limit</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Does aggregate domestic turnover u/s 10(1) exceed threshold?</h5>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t dark:border-slate-800 border-slate-200 text-[10px]">
              <div className="text-left font-semibold text-white dark:text-white">
                <span className="font-extrabold text-white text-white block">General States:</span>
                Limit: ≤ ₹1.5 Crore
              </div>
              <div className="text-left font-semibold text-white dark:text-white">
                <span className="font-extrabold text-white text-white block">8 Special States*:</span>
                Limit: ≤ ₹75 Lakh
              </div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-white dark:bg-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Step 2: Scheme and Rate selection u/s 10</span>
            <div className="grid grid-cols-1 divide-y dark:divide-slate-800 divide-slate-200 text-[10px] font-semibold text-white dark:text-white mt-2 text-left">
              <div className="py-1.5 flex justify-between">
                <span>Manufacturers u/s 10(1):</span>
                <span className="text-white text-white font-extrabold">1% of State Turnover</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Restaurant Service:</span>
                <span className="text-white text-white font-extrabold">5% of State Turnover</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Traders (taxable supply only):</span>
                <span className="text-white text-white font-extrabold">1% of Taxable Supplies</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Services Composition u/s 10(2A):</span>
                <span className="text-white text-white font-extrabold">6% (Limit ≤ ₹50L Preceding FY)</span>
              </div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* Step 3 & Restrictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15"
          >
            <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-450">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <h6 className="text-xs font-bold uppercase tracking-wider">Marginal Services Proviso</h6>
            </div>
            <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans font-semibold">
              Goods composition supplier can provide services up to <strong>10% of state turnover in preceding FY</strong> or <strong>₹5 Lakh</strong> (whichever is higher). Passive interest from bank FD must be completely excluded from calculating this threshold.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/15"
          >
            <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-455">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <h6 className="text-xs font-bold uppercase tracking-wider">Strict Restrictions Checklist</h6>
            </div>
            <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans font-semibold">
              <strong>Forbidden:</strong> Cannot collect tax from customers, cannot claim any Input Tax Credit (ITC), cannot perform Inter-State outward supplies, and cannot list on ECOs unless exempt u/s 52.
            </p>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderAadhaarFlow = () => {
    return (
      <div className="space-y-6">
        {/* Step 1: Decision Point */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-lg w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Aadhaar Authentication Pathways [Section 25]</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Does the applicant undergo Aadhaar Verification?</h5>
            <p className="text-[10px] text-white mt-1">Required for GST registration u/s 25(6A)/(6B)/(6C). Rule 10B applies this to refunds/revocations.</p>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* The 3 Parallel Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Path A: Opted & Succeeded */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <h6 className="text-[11px] font-extrabold uppercase tracking-wider">Path A: Succeeded</h6>
              </div>
              <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans">
                Applicant successfully authenticates using Aadhaar (OTP verification on portal is completed inside Part B).
              </p>
              <div className="mt-3 space-y-1.5 text-[10px] text-white font-mono">
                <div className="flex justify-between border-b dark:border-slate-900 border-slate-100 pb-1">
                  <span>SCN Inspection:</span>
                  <span className="font-bold text-white">Not Done</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Physical verification:</span>
                  <span className="font-bold text-white">Exempted</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-slate-900 border-slate-100 bg-emerald-500/5 -mx-4 -mb-4 p-3 rounded-b-2xl">
              <span className="text-[10px] font-bold text-emerald-600 block">⚡ Statutory Timeline:</span>
              <span className="text-[11px] font-extrabold text-white dark:text-white">Approval within 30 days</span>
            </div>
          </motion.div>

          {/* Path B: Fails or Not Opted */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <h6 className="text-[11px] font-extrabold uppercase tracking-wider">Path B: Failed / Not Opted</h6>
              </div>
              <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans">
                Applicant explicitly opts out, fails Aadhaar validation, or is determined as "High-risk profile" globally.
              </p>
              <div className="mt-3 space-y-1.5 text-[10px] text-white font-mono">
                <div className="flex justify-between border-b dark:border-slate-900 border-slate-100 pb-1">
                  <span>Biometric:</span>
                  <span className="font-bold text-rose-600">Mandatory with Photo</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>GST Center:</span>
                  <span className="font-bold text-white">GSK / Desk audit</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-slate-900 border-slate-100 bg-rose-500/5 -mx-4 -mb-4 p-3 rounded-b-2xl">
              <span className="text-[10px] font-bold text-rose-600 block">⏳ Statutory Timeline:</span>
              <span className="text-[11px] font-extrabold text-white dark:text-white">Approval within 30 days</span>
            </div>
          </motion.div>

          {/* Path C: Physical Verification (Rule 25) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <h6 className="text-[11px] font-extrabold uppercase tracking-wider">Path C: Rule 25 Audit</h6>
              </div>
              <p className="text-[11px] text-white dark:text-white leading-relaxed font-sans">
                If physical check of site is deemed necessary due to failed Aadhaar or zero authentication, officer conducts inspections.
              </p>
              <div className="mt-3 space-y-1.5 text-[10px] text-white font-mono">
                <div className="flex justify-between border-b dark:border-slate-900 border-slate-100 pb-1">
                  <span>REG-30 Report:</span>
                  <span className="font-bold text-amber-600">Within 15 days</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Condition:</span>
                  <span className="font-bold text-white">GPS Photos + Site verified</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-slate-900 border-slate-100 bg-amber-500/5 -mx-4 -mb-4 p-3 rounded-b-2xl">
              <span className="text-[10px] font-bold text-amber-605 block">📸 Verification Mandate:</span>
              <span className="text-[11px] font-extrabold text-white dark:text-white">Upload REG-30 form with photos</span>
            </div>
          </motion.div>

        </div>
      </div>
    );
  };

  const renderAmendmentFlow = () => {
    return (
      <div className="space-y-6">
        {/* Title Node */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-lg w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold">Section 28 / Rule 19</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Amendment of Registration Block Diagram</h5>
            <p className="text-[10px] text-white mt-1">Regulates modifications to existing GSTIN details. Classifies updates into three pathways.</p>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* 3 Columns/Branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Core Fields */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-white text-white font-extrabold text-xs">
                <Settings className="h-4 w-4 shrink-0" />
                <span>1. Core Fields Amendment</span>
              </div>
              <p className="text-[11px] text-white dark:text-white leading-relaxed mt-1">
                Updates to high-stakes legal information that require Proper Officer verification and approval.
              </p>
              
              <div className="mt-3 p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 space-y-1.5">
                <span className="text-[9px] font-bold text-white text-white uppercase tracking-wider block">Fields Covered:</span>
                <ul className="text-[10.5px] text-white dark:text-white space-y-1 pl-3 list-disc">
                  <li>Legal name of business</li>
                  <li>Principal place of business address</li>
                  <li>Additional place of business address</li>
                  <li>Constitution (Partners/Directors scale)</li>
                </ul>
              </div>

              <div className="mt-3 space-y-1.5 text-[10px] font-mono text-white">
                <div className="flex justify-between border-b border-indigo-500/10 pb-1">
                  <span>Approval Window:</span>
                  <span className="font-bold text-white dark:text-white">15 Working days</span>
                </div>
                <div className="flex justify-between border-b border-indigo-500/10 pb-1">
                  <span>Form Issued:</span>
                  <span className="font-bold text-white dark:text-indigo-450">GST REG-15</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Deficiencies (SCN):</span>
                  <span className="font-bold text-rose-500">REG-03 (15 days)</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Taxpayer Response:</span>
                  <span className="font-bold text-amber-500">REG-04 (7 days)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-slate-900 border-slate-100 bg-indigo-500/5 -mx-4 -mb-4 p-3 rounded-b-2xl">
              <span className="text-[10px] font-bold text-white block">📊 Verification Pipeline:</span>
              <span className="text-[10px] text-white dark:text-white">Requires officer approval; rejected u/s REG-05 if unsatisfied.</span>
            </div>
          </motion.div>

          {/* Column 2: Non-Core Fields */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>2. Non-Core Fields</span>
              </div>
              <p className="text-[11px] text-white dark:text-white leading-relaxed mt-1">
                Updates to contact and minor information that does not impact the fundamental tax framework.
              </p>
              
              <div className="mt-3 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 space-y-1.5">
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Fields Covered:</span>
                <ul className="text-[10.5px] text-white dark:text-white space-y-1 pl-3 list-disc">
                  <li>Authorized email IDs</li>
                  <li>Primary mobile numbers</li>
                  <li>Website URLs / branding names</li>
                  <li>Minor business description details</li>
                </ul>
              </div>

              <div className="mt-4 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg text-[10px] text-white leading-normal">
                <span className="font-extrabold text-white text-white block pb-1">⚡ Instant Execution:</span>
                No physical evaluation or Proper Officer approval required. Auto-applied on the portal instantly.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-slate-900 border-slate-100 bg-emerald-500/5 -mx-4 -mb-4 p-3 rounded-b-2xl animate-pulse">
              <span className="text-[10px] font-bold text-emerald-600 block">⚡ Statutory Timeline:</span>
              <span className="text-[11px] font-extrabold text-white dark:text-white">Approved instantly on portal</span>
            </div>
          </motion.div>

          {/* Column 3: PAN Modification */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>3. Change of PAN (Strict Exception)</span>
              </div>
              <p className="text-[11px] text-white dark:text-white leading-relaxed mt-1">
                If the fundamental permanent account number (PAN) of the tax entity changes due to constitutional shifts.
              </p>
              
              <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1.5 text-center">
                <AlertTriangle className="h-5 w-5 text-rose-550 mx-auto" />
                <span className="text-[10px] font-bold text-rose-600 block uppercase tracking-wider">No Amendment Permitted u/s 28</span>
                <p className="text-[10px] text-white dark:text-white leading-relaxed">
                  A change in PAN represents a completely distinct legal entity. You cannot amend u/s 28.
                </p>
              </div>

              <div className="mt-3 text-[10px] text-center font-bold text-white bg-slate-500/5 p-2 rounded-lg border border-slate-500/10 font-mono">
                Mandatory: Apply for a Fresh Registration u/s 25
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-slate-900 border-slate-100 bg-rose-500/5 -mx-4 -mb-4 p-3 rounded-b-2xl">
              <span className="text-[10px] font-bold text-rose-600 block">🛑 Critical Directives:</span>
              <span className="text-[11.5px] font-extrabold text-white dark:text-white">Surrender old / Apply fresh GSTN</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderUndisclosedIncomeFlow = () => {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold font-semibold">Unexplained Transactions Found?</span>
            <div className="grid grid-cols-2 gap-2 mt-3 text-left text-[10px] font-semibold text-white dark:text-white">
              <div className="p-1 px-2 bg-slate-150/40 dark:bg-slate-950 rounded"><strong>Sec 68:</strong> Cash Credits</div>
              <div className="p-1 px-2 bg-slate-150/40 dark:bg-slate-950 rounded"><strong>Sec 69:</strong> Unexplained Invest.</div>
              <div className="p-1 px-2 bg-slate-150/40 dark:bg-slate-950 rounded"><strong>Sec 69A:</strong> Unexplained Money</div>
              <div className="p-1 px-2 bg-slate-150/40 dark:bg-slate-950 rounded"><strong>Sec 69B:</strong> Understated Invest.</div>
              <div className="p-1 px-2 bg-slate-150/40 dark:bg-slate-950 rounded"><strong>Sec 69C:</strong> Unexplained Exps</div>
              <div className="p-1 px-2 bg-slate-150/45 dark:bg-slate-950 rounded"><strong>Sec 69D:</strong> Hundi Loan</div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/10 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-bold font-semibold">Section 115BBE Statutory Tax Engine</span>
            <h5 className="text-xs font-black mt-2 text-white dark:text-white uppercase tracking-wider">Deemed Income Flat Tax Slabs</h5>
            
            <div className="space-y-1.5 mt-3 text-left text-[11px] font-semibold text-white dark:text-white">
              <div className="flex justify-between py-1 border-b border-dashed dark:border-slate-800 border-slate-200">
                <span>Base Income Tax:</span>
                <span className="text-white text-white font-extrabold">60% flat Rate</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed dark:border-slate-800 border-slate-200">
                <span>Statutory Surcharge (25% on Tax):</span>
                <span className="text-white text-white font-extrabold">15% flat (25% of 60%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed dark:border-slate-800 border-slate-200">
                <span>Health & Education Cess (4% on Tax+SC):</span>
                <span className="text-white text-white font-extrabold">3% flat (4% of 75%)</span>
              </div>
              <div className="flex justify-between py-2 text-xs font-black uppercase text-rose-600 dark:text-rose-450 bg-rose-500/5 px-2 rounded mt-2 border border-rose-500/15">
                <span>Total Effective Tax Rate:</span>
                <span className="font-extrabold underline decoration-rose-500 decoration-2">78% flat rate</span>
              </div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center max-w-md w-full shadow-xs space-y-2"
          >
            <span className="text-[10px] font-mono uppercase bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-450 px-2 py-0.5 rounded font-extrabold">🚫 STRICT DISALLOWANCE CLAWBACK</span>
            <h5 className="text-xs font-extrabold text-white dark:text-white">Zero Exemptions or Deductions Allowed</h5>
            <p className="text-[10.5px] text-white dark:text-white leading-relaxed font-sans">
              No basic exemption limit u/s 115BBE. No standard book deductions or expenditures allowed. No loss set-offs from other business heads are permitted.
            </p>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderAgriculturalApportionmentFlow = () => {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold font-semibold">Rule 7, 7A, 7B & 8 Assessment Slabs</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Composite Income Apportionment Ratios</h5>
            
            <div className="space-y-2 mt-3 text-[11px] text-left">
              <div className="p-2 bg-slate-100/50 dark:bg-slate-950 rounded border border-slate-200/50 dark:border-slate-800/80 flex justify-between items-center">
                <div>
                  <span className="font-extrabold block text-white dark:text-white">Tea Cultivation & Mfg (Rule 8)</span>
                  <span className="text-[10px] text-white">Grown & manufactured in India</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block text-[10.5px]">60% Agricultural</span>
                  <span className="text-white text-white font-extrabold block text-[10.5px]">40% Business</span>
                </div>
              </div>

              <div className="p-2 bg-slate-100/50 dark:bg-slate-950 rounded border border-slate-200/50 dark:border-slate-800/80 flex justify-between items-center">
                <div>
                  <span className="font-extrabold block text-white dark:text-white">Rubber Mfg (Rule 7A)</span>
                  <span className="text-[10px] text-white">From field latex grown by seller</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block text-[10.5px]">65% Agricultural</span>
                  <span className="text-white text-white font-extrabold block text-[10.5px]">35% Business</span>
                </div>
              </div>

              <div className="p-2 bg-slate-100/50 dark:bg-slate-950 rounded border border-slate-200/50 dark:border-slate-800/80 flex justify-between items-center">
                <div>
                  <span className="font-extrabold block text-white dark:text-white">Coffee Grown & Cured (Rule 7B(1))</span>
                  <span className="text-[10px] text-white">Cured but not further processed</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block text-[10.5px]">75% Agricultural</span>
                  <span className="text-white text-white font-extrabold block text-[10.5px]">25% Business</span>
                </div>
              </div>

              <div className="p-2 bg-slate-100/50 dark:bg-slate-950 rounded border border-slate-200/50 dark:border-slate-800/80 flex justify-between items-center">
                <div>
                  <span className="font-extrabold block text-white dark:text-white">Coffee Roasted & Ground (Rule 7B(2))</span>
                  <span className="text-[9.5px] text-white leading-tight block">Grown, cured, roasted & grounded with/without chicory</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block text-[10.5px]">60% Agricultural</span>
                  <span className="text-white text-white font-extrabold block text-[10.5px]">40% Business</span>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-white dark:bg-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-bold font-semibold">Partial Integration Screening</span>
            <h5 className="text-xs font-black mt-2 text-white dark:text-white">Are Both Incorporation Conditions satisfied?</h5>
            
            <div className="grid grid-cols-2 gap-3 mt-3 pt-2.5 border-t dark:border-slate-800 border-slate-150">
              <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-left space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">Condition 1: Net Agri</span>
                <span className="text-[10px] text-white dark:text-white font-black block">EXCEED ₹5,000 p.a.</span>
              </div>
              <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-left space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">Condition 2: Non-Agri</span>
                <span className="text-[9.5px] text-white dark:text-white font-black block">EXCEED Exemption limit</span>
              </div>
            </div>
            
            <div className="mt-3 p-2.5 bg-blue-500/5 border border-blue-500/15 rounded-lg text-left text-[10px] text-white dark:text-white">
              <span className="font-extrabold text-white text-white block pb-0.5">⚡ Tax Computation Sequence:</span>
              <strong>Step 1:</strong> Tax on Aggregate (Net Agri + Non-Agri Income)<br />
              <strong>Step 2:</strong> Tax on (Net Agri + Basic Exemption Limit)<br />
              <strong>Step 3:</strong> Final Tax = Step 1 - Step 2 (plus Cess & Surcharge)
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderCapitalAssetPeriodTest = () => {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold font-semibold">Exclusions u/s 2(14)</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Exempt from Capital Asset definition:</h5>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t dark:border-slate-800 border-slate-200 text-left text-[10px]">
              <div className="bg-rose-500/5 p-1 px-2 rounded text-white dark:text-white">
                <span className="font-extrabold block text-rose-600 dark:text-rose-450">Stock-in-trade</span>
                Discharge under Business PGBP u/s 28
              </div>
              <div className="bg-rose-500/5 p-1 px-2 rounded text-white dark:text-white">
                <span className="font-extrabold block text-rose-600 dark:text-rose-450">Personal Effects</span>
                Except jewelry, drawings, paint, art
              </div>
              <div className="bg-rose-500/5 p-1 px-2 rounded text-white dark:text-white">
                <span className="font-extrabold block text-rose-600 dark:text-rose-450">Rural Agri Land</span>
                Outside Municipal bounds (<a href="#" className="underline">shortest aerial distance</a>)
              </div>
              <div className="bg-rose-500/5 p-1 px-2 rounded text-white dark:text-white">
                <span className="font-extrabold block text-rose-600 dark:text-rose-450">Gold Bonds</span>
                Exempt u/s 2(14)(iv)/(v)/(vi)
              </div>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-white dark:bg-slate-900 text-center max-w-md w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-bold font-semibold">Period of Holding Test u/s 2(42A)</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Classification as Short Term vs. Long Term Asset</h5>
            
            <div className="space-y-2 mt-3 text-left">
              <div className="p-2 rounded bg-slate-100/55 dark:bg-slate-950 flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-bold block text-white dark:text-white">12 Months Threshold SGL list:</span>
                  <span className="text-[10px] text-white">Listed equity, UTI, Zero Coupon Bonds, Equity MFs</span>
                </div>
                <div className="text-right font-black text-white text-white whitespace-nowrap text-[10.5px]">
                  <span>≤ 12m: STCA</span><br /><span>&gt; 12m: LTCA</span>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-100/55 dark:bg-slate-950 flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-bold block text-white dark:text-white">24 Months Threshold General list:</span>
                  <span className="text-[10px] text-white">Immovable property (Land/Bldg), unlisted shares</span>
                </div>
                <div className="text-right font-black text-indigo-655 text-white whitespace-nowrap text-[10.5px]">
                  <span>≤ 24m: STCA</span><br /><span>&gt; 24m: LTCA</span>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-100/55 dark:bg-slate-950 flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-bold block text-white dark:text-white">Strictly Short-Term (Section 50AA):</span>
                  <span className="text-[10px] text-white">MLDs, Debt MFs (on/after 1.4.2023), unlisted bonds</span>
                </div>
                <div className="text-right font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-tighter whitespace-nowrap text-[10.5px]">
                  Deemed STCA
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderGiftDeemedDividendFlow = () => {
    return (
      <div className="space-y-6 font-sans">
        {/* Section 2(22) Deemed Dividend Path */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900 text-center max-w-xl w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-white text-white px-2 py-0.5 rounded font-bold font-semibold">Deemed Dividend Engine u/s 2(22)</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Section 2(22)(a) to (e) Statutory Flow</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3 pt-2.5 border-t dark:border-slate-800 border-slate-200 text-left text-[11px]">
              <div className="bg-slate-500/5 p-2 rounded">
                <span className="font-extrabold block text-white text-white">Sec 2(22)(a) to (d) Distributions</span>
                <p className="text-[10px] text-white mt-0.5">Asset releases, bonus shares to preference owners, liquidation payouts, capital reductions up to accumulated profits.</p>
                <span className="text-[9px] font-mono block text-amber-600 dark:text-amber-400 mt-1 font-bold">⚠️ Equity Bonus Shares Exempt</span>
              </div>
              <div className="bg-slate-500/5 p-2 rounded">
                <span className="font-extrabold block text-white text-white">Sec 2(22)(e) Closely Held Co Loans</span>
                <p className="text-[10px] text-white mt-0.5">Loans/Advances given to beneficial owner of ≥10% equity, or any concern (HUF/Firm/AOP/BOI/Co) where owner holds ≥20% interest.</p>
                <span className="text-[9px] font-mono block text-rose-600 dark:text-rose-450 mt-1 font-bold">⚠️ Repayment during PY won't reduce taxability</span>
              </div>
            </div>
            <div className="p-2 rounded bg-indigo-500/5 text-left text-[10.5px] mt-2 border border-indigo-500/10">
              <span className="font-bold text-white dark:text-white block">Accumulated Profits Ceiling:</span>
              <p className="text-[10px] stroke-tighter text-white">Deemed dividends under all sub-clauses are strictly capped in value up to the company's possessed accumulated profits on date of payment/distribution.</p>
            </div>
          </motion.div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 my-1"></div>
        </div>

        {/* Section 56(2)(x) Gifts & Undervalue Path */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl border border-indigo-500/20 bg-white dark:bg-slate-900 text-center max-w-xl w-full shadow-xs"
          >
            <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-bold font-semibold">Gifts & Under-Value Transfer u/s 56(2)(x)</span>
            <h5 className="text-xs font-bold mt-2 text-white dark:text-white">Taxability Gateway & Threshold Matrix</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pt-2 border-t dark:border-slate-800 border-slate-200 text-left text-[10.5px]">
              <div className="p-2 rounded bg-slate-100/55 dark:bg-slate-950">
                <span className="font-bold text-white dark:text-white block">1. Sum of Money</span>
                <span className="text-[10px] text-white">Aggregate without consideration in previous year.</span>
                <div className="text-rose-600 dark:text-rose-400 font-extrabold text-[10.5px] mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-900">
                  Taxable if total &gt; ₹50,000
                </div>
              </div>
              <div className="p-2 rounded bg-slate-100/55 dark:bg-slate-950">
                <span className="font-bold text-white dark:text-white block">2. Immovable Property</span>
                <span className="text-[10px] text-white">Separately calculated for each property.</span>
                <div className="text-rose-600 dark:text-rose-400 font-extrabold text-[10.5px] mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-900">
                  Taxable u/s 56(2)(x) if:<br />
                  • SDV - P &gt; ₹50,000 AND<br />
                  • SDV - P &gt; 10% of Consideration
                </div>
              </div>
              <div className="p-2 rounded bg-slate-100/55 dark:bg-slate-950">
                <span className="font-bold text-white dark:text-white block">3. Movable Property</span>
                <span className="text-[10px] text-white">Aggregate FMV of jewelry, shares, art, etc.</span>
                <div className="text-rose-600 dark:text-rose-400 font-extrabold text-[10.5px] mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-900">
                  Taxable if difference &gt; ₹50,000
                </div>
              </div>
            </div>

            <div className="p-2 rounded bg-emerald-500/5 dark:bg-emerald-950/10 text-left text-[10px] mt-3 border border-emerald-500/10 list-none">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight block">💡 Relative & Special Event Exemptions (Strictly Non-Taxable)</span>
              <p className="text-[9.5px] text-white leading-normal mt-0.5">
                • Received from <strong className="text-white dark:text-white">Relatives</strong> (Spouse, siblings of self/spouse, siblings of parents, lineal ascendant/descendant of self/spouse + spouses of any of these)<br />
                • On occasion of <strong className="text-white dark:text-white">marriage</strong> of the individual<br />
                • Under a <strong className="text-white dark:text-white">will or by way of inheritance / contemplation of death</strong> u/s 56(2)(x)<br />
                • Registered <strong className="text-white dark:text-white">Trusts (u/s 12A/12AB) or local authorities</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const chooseRenderer = () => {
    switch (title) {
      case 'DT - Chapter 1: Undisclosed Income & 115BBE 78% Tax Flow':
        return renderUndisclosedIncomeFlow();
      case 'DT - Chapter 2: Agricultural Apportionment & Integration Slabs':
        return renderAgriculturalApportionmentFlow();
      case 'DT - Chapter 4: Capital Asset Exclusion & SOH Period Test':
        return renderCapitalAssetPeriodTest();
      case 'DT - Chapter 5: Gift & Deemed Dividend Taxability Flow':
        return renderGiftDeemedDividendFlow();
      case 'GST Supply Determination Flow':
        return renderGstSupplyFlow();
      case 'GST Composition Levy & RCM Logic Flow':
        return renderCompositionFlow();
      case 'GST Aadhaar Authentication & Verification pathways':
        return (
          <div className="space-y-4">
            {/* Tab Swapper */}
            <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-xl max-w-sm border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveRegisterTab('aadhaar')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeRegisterTab === 'aadhaar'
                    ? 'bg-white dark:bg-slate-900 text-white text-white shadow-xs border border-indigo-500/10'
                    : 'text-white dark:text-white hover:text-white'
                }`}
              >
                <GitBranch className="h-3.5 w-3.5" />
                Aadhaar Pathways (Rule 10B/25)
              </button>
              <button
                type="button"
                onClick={() => setActiveRegisterTab('amendment')}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeRegisterTab === 'amendment'
                    ? 'bg-white dark:bg-slate-900 text-white text-white shadow-xs border border-indigo-500/10'
                    : 'text-white dark:text-white hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Amendment Diagram (Sec 28)
              </button>
            </div>

            {/* Render the selected flowchart */}
            {activeRegisterTab === 'aadhaar' ? renderAadhaarFlow() : renderAmendmentFlow()}
          </div>
        );
      default:
        return (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-center text-xs text-white border dark:border-slate-805 border-slate-200">
            Awaiting syllabus schematic data for this chapter.
          </div>
        );
    }
  };

  return (
    <div id="diagram-static-root" className="space-y-4 pt-1">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border dark:border-slate-805 border-slate-200 p-3 rounded-xl shadow-xs">
        <span className="text-[11px] font-sans font-extrabold text-white dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Network className="h-4 w-4 text-white" /> Statutory flow chart
        </span>
        <span className="text-[10px] font-mono text-white font-bold bg-indigo-500/5 px-2 py-0.5 rounded-full">
          Static Guide
        </span>
      </div>

      {chooseRenderer()}
    </div>
  );
}
