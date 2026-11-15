/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { exportToPdfEngine } from '../utils/pdfExporter';
import MathFormula, { parseToLatex } from './MathFormula';
import { ModalPortal } from './ModalPortal';
import { SubjectId, SubjectTabId, BookmarkedSection } from '../types';
import { CA_CURRICULUM_LEVELS, getLevelForSubject } from '../data/curriculumLevels';
import { 
  SUBJECTS_METADATA,
  CHAPTER_SUMMARIES, 
  FORM_ITEMS, 
  STATUTORY_SECTIONS, 
  LIMITS_RATES 
} from '../data/syllabus';
import { INITIAL_REVISION_VIDEOS } from '../data/revisionVideos';
import { 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Milestone, 
  HelpCircle, 
  FileText, 
  Star,
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Flame,
  ArrowRight,
  Anchor,
  Zap,
  Printer,
  Download,
  Search,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  Building,
  Plane,
  Scale,
  Clock,
  Coins,
  Calendar,
  Calculator,
  Copy,
  Check,
  Code,
  PenTool,
  PanelRight,
  PanelRightOpen,
  Plus,
  Trash2,
  Filter,
  FileCode,
  Lock,
  Eye,
  EyeOff,
  Youtube,
  Play,
  Video,
  ExternalLink,
  User,
  Tag
} from 'lucide-react';
import ProtectedPdfReader from './ProtectedPdfReader';
import InteractiveFlowchart from './InteractiveFlowchart';
import { 
  TimeOfSupplyHighFidelityView, 
  ValueOfSupplyHighFidelityView, 
  ExemptionsHighFidelityView,
  IfosHighFidelityView,
  BasicConceptsHighFidelityView,
  ExemptIncomesHighFidelityView,
  CapitalGainsHighFidelityView,
  AssessmentOfCompaniesHighFidelityView,
  InternationalTaxationHighFidelityView,
  AfmInterestRateRiskHighFidelityView,
  AfmSecurityValuationHighFidelityView,
  AfmSecuritizationHighFidelityView,
  IndAS105HighFidelityView
} from './ChapterHighFidelityViews';
import StandardsOnAuditingView from './StandardsOnAuditingView';

interface ScannableTextProps {
  text: string;
  chapterName?: string;
}

function parseSectionHighlights(str: string): React.ReactNode {
  const sectionRegex = /\b(Sec(?:tion)?\s+\d+(?:\(\d+\))*(?:\([a-zA-Z0-9]\))?|u\/s\s+\d+(?:\(\d+\))*(?:\([a-zA-Z0-9]\))?|(?:Schedule\s+[I|V|X\d]+(?:\s+Para\s+\d+)?))\b/gi;
  if (!str) return '';
  const parts = str.split(sectionRegex);
  
  const handleRefClick = (refName: string) => {
    window.dispatchEvent(new CustomEvent('statutory-reference-clicked', { 
      detail: { reference: refName } 
    }));
  };
  
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <button
              key={index}
              onClick={() => handleRefClick(part)}
              type="button"
              title={`Click to explore interactive reference for ${part}`}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/15 text-white text-white font-mono font-extrabold text-[10.5px] border border-indigo-500/10 inline-flex items-center align-middle cursor-pointer hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all duration-150 leading-none shadow-2xs hover:scale-[1.03] active:scale-95"
            >
              {part}
            </button>
          );
        }
        return part;
      })}
    </>
  );
}

function parseRichText(str: string): React.ReactNode {
  if (!str) return '';
  const parts = str.split(/\*\*([^*]+)\*\*/g);
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <strong key={index} className="font-extrabold text-white text-white bg-slate-100 dark:bg-slate-800/40 px-1 py-0.5 rounded text-[11px]">
              {parseSectionHighlights(part)}
            </strong>
          );
        }
        return <React.Fragment key={index}>{parseSectionHighlights(part)}</React.Fragment>;
      })}
    </>
  );
}

function getValidListItems(text: string) {
  const regex = /\(([a-zA-Z0-9]+)\)/g;
  const matches = Array.from(text.matchAll(regex));
  
  const validMatches: { index: number; marker: string; value: string }[] = [];
  
  for (const match of matches) {
    const val = match[1];
    const index = match.index ?? 0;
    
    // Pure number or single letter
    const isNum = /^\d+$/.test(val);
    const isSingleLetter = /^[a-zA-Z]$/.test(val);
    if (!isNum && !isSingleLetter) {
      continue;
    }
    
    // Ensure not preceded by word character/alphanumeric (like 9(3), etc.)
    if (index > 0) {
      const precedingChar = text[index - 1];
      if (/[a-zA-Z0-9]/.test(precedingChar)) {
        continue;
      }
    }
    
    validMatches.push({
      index,
      marker: match[0],
      value: val
    });
  }
  
  return validMatches;
}

function ScannableText({ text, chapterName }: ScannableTextProps) {
  if (!text) return null;

  const validMatches = getValidListItems(text);

  if (validMatches.length === 0) {
    // If no numbered lists, check if we have semicolon-separated lists
    if (text.includes(';') && (text.includes(':') || text.toLowerCase().includes('include') || text.toLowerCase().includes('such as'))) {
      const sentences = text.split(/;/g).map(s => s.trim()).filter(Boolean); // Only split on semicolons, NOT on dots!
      return (
        <div className="space-y-2 mt-1.5 pl-1.5 border-l-2 border-indigo-500/20">
          {sentences.map((sentence, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-white text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5 shadow-xs"></span>
              <span className="font-semibold leading-relaxed flex-1">{parseRichText(sentence)}</span>
            </div>
          ))}
        </div>
      );
    }
    return <span className="font-semibold leading-relaxed">{parseRichText(text)}</span>;
  }

  const intro = text.substring(0, validMatches[0].index).trim();
  const items: { num: string; content: string }[] = [];
  for (let i = 0; i < validMatches.length; i++) {
    const currentMatch = validMatches[i];
    const startIndex = currentMatch.index + currentMatch.marker.length;
    const endIndex = i + 1 < validMatches.length 
      ? validMatches[i + 1].index 
      : text.length;
    
    items.push({
      num: currentMatch.value,
      content: text.substring(startIndex, endIndex).trim()
    });
  }

  return (
    <div className="space-y-4 font-sans w-full">
      {/* Intro section */}
      {intro && (
        <p className="text-xs font-bold text-white text-white leading-relaxed pb-2 border-b dark:border-slate-800 border-slate-150">
          {parseRichText(intro)}
        </p>
      )}

      {/* List container */}
      <div className="grid grid-cols-1 gap-3 w-full">
        {items.map((item, idx) => {
          // Check if item contains a colon defining a sub-list (e.g., "Supply of Goods: any transfer...")
          const colonIdx = item.content.indexOf(':');
          let title = '';
          let rest = item.content;

          if (colonIdx > 0 && colonIdx < 50) { 
            title = item.content.substring(0, colonIdx).trim();
            rest = item.content.substring(colonIdx + 1).trim();
          }

          // Check if the rest has sub-items separated by semicolons (do NOT split by dot!)
          const subItems = rest.split(';').map(s => s.trim()).filter(s => s.length > 2);

          const isLetter = /^[a-zA-Z]$/.test(item.num);
          const isExceptedChapter = ['Supply under GST', 'Charge of GST', 'Registration'].includes(chapterName || '');
          const useBullet = isLetter && !isExceptedChapter;

          return (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs hover:bg-white dark:hover:bg-slate-900/60 hover:shadow-xs transition-all duration-150 w-full"
            >
              {useBullet ? (
                <div className="h-6 w-6 rounded-lg bg-indigo-500/5 dark:bg-indigo-950/40 text-white text-white flex items-center justify-center shrink-0 border border-indigo-500/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                </div>
              ) : (
                <div className="h-6 w-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white flex items-center justify-center text-[11px] font-white font-mono shrink-0 shadow-xs border border-indigo-500/10 dark:border-indigo-500/20">
                  {item.num}
                </div>
              )}
              <div className="space-y-2 flex-1 w-full min-w-0">
                {title && (
                  <h5 className="text-[11px] font-extrabold tracking-wider uppercase text-white text-white flex items-center gap-1.5 leading-none">
                    <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full shrink-0 animate-pulse"></span>
                    {parseRichText(title)}
                  </h5>
                )}
                {subItems.length > 1 ? (
                  <ul className="space-y-2 list-none pl-0 w-full">
                    {subItems.map((sub, sIdx) => {
                      const capitalizedSub = sub.charAt(0).toUpperCase() + sub.slice(1);
                      return (
                        <li key={sIdx} className="flex items-start gap-2.5 text-xs text-white text-white w-full min-w-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500/60 shrink-0 mt-1.5"></span>
                          <span className="font-semibold leading-relaxed flex-1 break-words">{parseRichText(capitalizedSub)}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-xs text-white text-white leading-relaxed font-semibold">
                    {parseRichText(rest)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GstSupplyHighFidelityView() {
  return (
    <div className="space-y-8 font-sans w-full">
      {/* 1. Section 7: Scope of Supply */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Anchor className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 7: Scope of Supply
              </h4>
              <p className="text-[10px] text-white font-medium">The Primary Charging Catalyst of GST u/s 7(1)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-white text-white border border-emerald-500/10">Sec 7(1)(a) → COMMERCIAL</span>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-sky-500/10 text-sky-600 text-white border border-sky-500/10">Sec 7(1)(b) → IMPORTATION</span>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-purple-500/10 text-white text-white border border-purple-500/10">Sec 7(1)(aa) → MEMBERS</span>
          </div>
        </div>

        {/* The Three Core Branches of Section 7(1) */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">The Statutory Clauses: Line-wise Parameters</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sec 7(1)(a) Card */}
            <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-150 space-y-2.5 shadow-2xs hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-white text-white text-white uppercase tracking-wider">Section 7(1)(a)</span>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-white text-white">COMMERCIAL</span>
                </div>
                <strong className="text-xs font-bold text-white text-white block">General Scope of Supply</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">
                  Covers all forms of stock supply such as <span className="font-bold underline decoration-indigo-500/30 text-white text-white">sale, transfer, barter, exchange, license, rental, lease, or disposal</span>.
                </p>
                <div className="p-2 rounded bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/10">
                  <p className="text-[10px] text-white text-white leading-normal font-semibold">
                    <span className="text-white text-white font-bold">Conditions:</span> Requires both <span className="font-bold text-white text-white">Consideration</span> AND execution in the <span className="font-bold text-white text-white">Course or Furtherance of Business</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Sec 7(1)(aa) Card */}
            <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-150 space-y-2.5 shadow-2xs hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-white text-white text-white uppercase tracking-wider">Section 7(1)(aa)</span>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-white text-white">MEMBERS</span>
                </div>
                <strong className="text-xs font-bold text-white text-white block">Clubs, Associations & Members</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">
                  Activities or transactions by a person <span className="font-bold text-white text-white">(other than an individual)</span> to its members or constituents or vice-versa.
                </p>
                <div className="p-2 rounded bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/10">
                  <p className="text-[10px] text-white text-white leading-normal font-semibold">
                    <span className="text-white text-white font-bold">Key Test:</span> Made for cash, deferred payment, or other valuable consideration. <span className="text-white text-white font-extrabold text-[9.5px]">Overrides Doctrine of Mutuality!</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Sec 7(1)(b) Card */}
            <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-150 space-y-2.5 shadow-2xs hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-white text-sky-600 text-white uppercase tracking-wider">Section 7(1)(b)</span>
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 text-white">IMPORTATION</span>
                </div>
                <strong className="text-xs font-bold text-white text-white block">Import of Services</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">
                  Importation of cross-border services from any global service provider, executed in exchange for solid financial consideration.
                </p>
                <div className="p-2 rounded bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/10">
                  <p className="text-[10px] text-white text-white leading-normal font-semibold">
                    <span className="text-white text-white font-white">Critical Condition:</span> Taxable <span className="font-extrabold underline decoration-amber-500">whether or not</span> in course or furtherance of business!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Golden Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ The Exam Trap: Business Connection Rule u/s 7(1)(b) vs Schedule I</span>
          </div>
          <p className="text-xs font-semibold text-white text-white leading-relaxed">
            While <span className="text-white text-white font-extrabold">Section 7(1)(b)</span> requires consideration but doesn't care about business purpose, <span className="text-white text-white font-extrabold">Schedule I Para 4</span> says import of services <span className="font-bold underline">WITHOUT consideration</span> is taxable only if it's from a related person <strong className="text-white text-white">AND</strong> in course/furtherance of business.
          </p>
        </div>

        {/* Case Application */}
        <div className="p-4 rounded-xl bg-violet-500/5 dark:bg-violet-500/5 border border-violet-500/10 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <Lightbulb className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">💡 Exam Case Application: Personal & Commercial Import</span>
          </div>
          <div className="space-y-1.5 text-xs italic font-semibold text-white text-white leading-relaxed pl-1">
            <p>
              • <strong className="text-white text-white">Scenario A:</strong> A doctor pays a London-based designer ₹5,00,050 to draft construction maps for his personal residence. This is a taxable supply under <strong className="text-white text-white font-mono text-[11px]">7(1)(b)</strong> (consideration present).
            </p>
            <p>
              • <strong className="text-white text-white">Scenario B:</strong> A doctor imports a layout blueprint for his residential villa for free from his brother living in New York. Since there is no consideration and it is personal/private, it is <strong className="text-white font-bold">NOT a supply</strong> (fails both u/s 7(1)(b) and Schedule I Para 4).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Schedule I: Deemed Supply Without Consideration */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Schedule I: Deemed Supply
              </h4>
              <p className="text-[10px] text-white font-medium">Four specific items taxable without any consideration</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-amber-500/10 text-white text-white border border-amber-500/10">Schedule I → NO CONSIDERATION</span>
          </div>
        </div>

        {/* Core Parameters list */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">The Rule: Four Deemed Supplies</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-200 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs">
              <div className="h-6 w-6 rounded bg-indigo-500/10 text-white text-white flex items-center justify-center text-[10.5px] font-white font-mono shrink-0 border border-indigo-500/10">1</div>
              <div>
                <strong className="text-xs font-bold text-white text-white block uppercase font-mono tracking-wider text-white text-white mb-0.5">Permanent Asset Disposal</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">Disposal of business assets where <span className="text-white font-bold">Input Tax Credit (ITC)</span> has been availed under GST.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-200 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs">
              <div className="h-6 w-6 rounded bg-indigo-500/10 text-white text-white flex items-center justify-center text-[10.5px] font-white font-mono shrink-0 border border-indigo-500/10">2</div>
              <div>
                <strong className="text-xs font-bold text-white text-white block uppercase font-mono tracking-wider text-white text-white mb-0.5">Distinct / Related Persons</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">Supply of goods/services between related entities or distinct offices <span className="text-white text-white font-bold">(same PAN, u/s 25)</span> in course of business.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-200 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs">
              <div className="h-6 w-6 rounded bg-indigo-500/10 text-white text-white flex items-center justify-center text-[10.5px] font-white font-mono shrink-0 border border-indigo-500/10">3</div>
              <div>
                <strong className="text-xs font-bold text-white text-white block uppercase font-mono tracking-wider text-white text-white mb-0.5">Principal and Agent</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">Goods supplied by or received by an agent. Classified by whether the agent issues tax invoices <span className="text-white font-bold">in their own name</span>.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-200 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs">
              <div className="h-6 w-6 rounded bg-indigo-500/10 text-white text-white flex items-center justify-center text-[10.5px] font-white font-mono shrink-0 border border-indigo-500/10">4</div>
              <div>
                <strong className="text-xs font-bold text-white text-white block uppercase font-mono tracking-wider text-white text-white mb-0.5">Import of Service</strong>
                <p className="text-xs text-white text-white leading-relaxed font-semibold">Services imported by a business from a related overseas agency/establishment, executed <span className="text-white text-white font-bold">in furtherance of business</span>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ The Critical Thresholds</span>
          </div>
          <ul className="space-y-1.5 text-xs text-white text-white font-semibold pl-1">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
              <span><span className="text-white text-white font-extrabold">Employer to Employee Gifts:</span> Out of scope only if the aggregate value does not exceed <span className="underline decoration-amber-500 decorative-2 font-white text-white text-white">₹50,000</span> in a financial year.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
              <span><span className="text-white text-white font-extrabold">Assets with No ITC:</span> If ITC was blocked or not availed upon purchase of business assets, their subsequent transfer with no consideration is NOT a supply.</span>
            </li>
          </ul>
        </div>

        {/* Case Application */}
        <div className="p-4 rounded-xl bg-violet-500/5 dark:bg-violet-500/5 border border-violet-500/10 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <Lightbulb className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">💡 Exam Case Application</span>
          </div>
          <p className="text-xs italic font-semibold text-white text-white leading-relaxed">
            CA Mohan transfers extra laptops from his certified head office in Delhi to his branch office in Noida. Since Noida and Delhi offices reside under a single centralized corporate PAN, they represent distinct persons. This transfer is statistically a deemed supply under Schedule I Para 2.
          </p>
        </div>
      </div>

      {/* 3. Schedule II: Quick Classifier (Goods vs. Services) */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <FileText className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Schedule II: Quick Classifier
              </h4>
              <p className="text-[10px] text-white font-medium">Definitive classification parameters u/s 7(1A)</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">Schedule II → CLASSIFIER</span>
          </div>
        </div>

        {/* Split Columns Grid for Goods vs Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Goods column */}
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-200 space-y-3.5 shadow-2xs">
            <span className="text-xs font-white text-white text-sky-700 flex items-center gap-2 uppercase font-mono tracking-wider">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              📦 Supply of Goods
            </span>
            <ul className="space-y-2.5 text-xs text-white text-white font-semibold pl-1">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                <span>Transfer of absolute title <span className="text-white text-white font-normal">(Ownership is completely handed over)</span></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                <span>Future transfer agreement <span className="text-white text-white font-normal">(e.g., Hire-Purchase agreement)</span></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                <span>Permanent disposal / transfer of business assets</span>
              </li>
            </ul>
          </div>

          {/* Services column */}
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border dark:border-slate-800 border-slate-200 space-y-3.5 shadow-2xs">
            <span className="text-xs font-white text-white text-white flex items-center gap-2 uppercase font-mono tracking-wider">
              <span className="h-2 w-2 rounded-full bg-purple-500 font-white animate-pulse"></span>
              🛠️ Supply of Services
            </span>
            <ul className="space-y-2.5 text-xs text-white text-white font-semibold pl-1">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                <span>Transfer of right to use <span className="text-white text-white font-normal">(Ownership title remains with owner)</span></span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                <span>Land/Building lease, industrial tenancy, or licensing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                <span>Job work processes applied to another person's goods</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                <span>Renting/leasing of commercial or residential immovable property</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5"></span>
                <span>Active Works Contracts & Restaurant catering services</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ The Critical Exception</span>
          </div>
          <p className="text-xs font-semibold text-white text-white leading-relaxed">
            <span className="text-white text-white font-extrabold">Real Estate Construction:</span> Classified as a service unless 100% of the financial consideration is received <span className="underline decoration-amber-500 decoration-2 font-white text-white text-white">after</span> receiving a partial or full lock completion certificate, or post its first occupancy.
          </p>
        </div>

        {/* Case Application */}
        <div className="p-4 rounded-xl bg-violet-500/5 dark:bg-violet-500/5 border border-violet-500/10 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <Lightbulb className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">💡 Exam Case Application</span>
          </div>
          <p className="text-xs italic font-semibold text-white text-white leading-relaxed">
            Selling packaged ready-to-wear shirts is a Supply of Goods. Giving core industrial machinery on hire-lease without passing final title constitutes a Supply of Services.
          </p>
        </div>
      </div>

      {/* 4. Schedule III: Negative List (Non-Supplies) */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Star className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Schedule III: The Negative List
              </h4>
              <p className="text-[10px] text-white font-medium">Out-of-scope non-supplies (neither goods nor services)</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-rose-500/10 text-white text-white border border-rose-500/10">Schedule III → NON-SUPPLIES</span>
          </div>
        </div>

        {/* Micro-Bullet list of non-supplies */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">Line-wise Non-Supplies Exclusion List</span>
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Employment:</span>
                Services rendered by an employee to an employer during the course of or in relation to employment.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Judiciary:</span>
                Services by any Court or statutory Tribunal (including Consumer Disputes Redressal Commissions under consumer laws).
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Constitutional:</span>
                Statutory duties carried out by MPs, MLAs, municipal members, and individuals holding constitutional positions (President, PM, Chief Justice).
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Funerary:</span>
                Funeral, burial, crematorium, or mortuary services, including the transportation of deceased individuals.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Immovable Property:</span>
                Sale of Land, and sale of building (provided 100% of purchase consideration is received post completion certificate).
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Actionable Claims:</span>
                All general actionable claims (e.g. debt books, insurance payouts) are excluded EXCEPT 6 specified lottery/gambling claims.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Merchant Trading:</span>
                Supply of goods from a place in a non-taxable territory to another place in a non-taxable territory without such goods entering India [Schedule III Para 7].
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">High Sea Sales:</span>
                Supply of goods by the consignee to any other person, by endorsement of documents of title, after dispatch from port outside India but before clearance for home consumption [Schedule III Para 8(b)].
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">In-Bond / Bond Transfer:</span>
                Supply of warehoused goods to any person before clearance for home consumption [Schedule III Para 8(a)].
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">SEZ & FTZ Transits:</span>
                Goods entries or warehouse transfers within Special Economic Zones (SEZ) or Free Trade Zones (FTZ) prior to home consumption filing.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/55 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
              <div className="text-xs font-semibold text-white text-white">
                <span className="text-white text-white font-extrabold uppercase font-mono tracking-wider text-[10px] mr-2">Co-Insurance & Ceding Comm:</span>
                Allocation of co-insurance premium share between lead insurer and co-insurers, or reinsurance ceding commissions (clarified as non-supplies via CBIC Circulars).
              </div>
            </div>
          </div>
        </div>

        {/* The Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ Actionable Claims Exception (Taxable)</span>
          </div>
          <p className="text-xs font-semibold text-white text-white leading-relaxed">
            Only the <span className="text-white text-white font-extrabold">6 specified actionable claims</span> (betting, lottery, gambling, casinos, horse racing, and online money gaming) are treated as taxable Supply of Goods. All other actionable claims are out of GST's net completely.
          </p>
        </div>

        {/* Case Application */}
        <div className="p-4 rounded-xl bg-violet-500/5 dark:bg-violet-500/5 border border-violet-500/10 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <Lightbulb className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">💡 Exam Case Application</span>
          </div>
          <p className="text-xs italic font-semibold text-white text-white leading-relaxed">
            A corporate director sells a plot of raw land to a real estate group. Under Schedule III Para 5, the transaction remains outside of GST as it is treatable as neither supply of goods nor services.
          </p>
        </div>
      </div>

      {/* 5. Section 8: Composite and Mixed Supplies */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 8: Composite & Mixed Supplies
              </h4>
              <p className="text-[10px] text-white font-medium">Bespoke tax rates on bundled transactions</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-white text-white border border-emerald-500/10">Sec 8(a) → COMPOSITE</span>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-amber-500/10 text-white text-white border border-amber-500/10">Sec 8(b) → MIXED</span>
          </div>
        </div>

        {/* Dynamic Side-by-Side Card grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/15 space-y-2.5 shadow-2xs hover:bg-emerald-500/10 transition-all duration-150">
            <div className="flex items-center gap-2 text-white text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
              <strong className="text-xs font-white uppercase font-mono tracking-wider">Composite Supply u/s 8(a) [defined u/s 2(30)]</strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-semibold">
              Two or more individual taxable supplies which are <span className="text-white text-white font-extrabold font-mono text-[11px] uppercase bg-emerald-500/10 px-1 py-0.5 rounded">naturally bundled</span> and supplied in conjunction with each other in the ordinary course of trade. One predominant item acts as the **Principal Supply**.
            </p>
            <div className="pt-2 border-t border-emerald-500/10 text-[10.5px] font-extrabold text-white text-white font-mono tracking-tight">
              ⚡ GST LIABILITY u/s 8(a): Taxed at the exact rate of the PRINCIPAL SUPPLY.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/15 space-y-2.5 shadow-2xs hover:bg-amber-500/10 transition-all duration-150">
            <div className="flex items-center gap-2 text-white text-white">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
              <strong className="text-xs font-white uppercase font-mono tracking-wider">Mixed Supply u/s 8(b) [defined u/s 2(74)]</strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-semibold">
              Two or more individual items packaged together for a <span className="text-white text-white font-extrabold font-mono text-[11px] uppercase bg-amber-500/10 px-1 py-0.5 rounded">single blanket price</span>, which are not naturally bundled in typical business practices.
            </p>
            <div className="pt-2 border-t border-amber-500/10 text-[10.5px] font-extrabold text-white text-white font-mono tracking-tight">
              ⚡ GST LIABILITY u/s 8(b): Taxed at the HIGHEST TAX RATE amongst all components.
            </div>
          </div>
        </div>

        {/* The Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ The Separate Bills Rule</span>
          </div>
          <p className="text-xs font-semibold text-white text-white leading-relaxed">
            If individual prices are detailed and billed separately on a single invoice, they are taxed respectively at their own component rates instead of triggering a Mixed Supply calculation.
          </p>
        </div>

        {/* Case Application */}
        <div className="p-4 rounded-xl bg-violet-500/5 dark:bg-violet-500/5 border border-violet-500/10 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <Lightbulb className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">💡 Exam Case Application</span>
          </div>
          <p className="text-xs italic font-semibold text-white text-white leading-relaxed">
            Selling a modern laptop (taxable at 18%) bundled with a diagnostic carrying bag (taxable at 28%) for a single packaged price of ₹48,000. Since they are naturally bundled, laptop acts as principal, taxing the complete package at 18%.
          </p>
        </div>
      </div>
    </div>
  );
}

function PgbpHighFidelityView() {
  return (
    <div className="space-y-8 font-sans w-full">
      {/* 1. SECTION 28: CORE CHARGING TREE CHART */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Anchor className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 1: Section 28 - Core PGBP Charging Tree
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold">The Statutory Catalyst that brings receipts under the PGBP Head</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SEC 28 → CORE ENGINE</span>
          </div>
        </div>

        {/* Tree Chart representation of Section 28 */}
        <div className="space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">Visual Tree Structure: Scope of Taxable Sums</span>
          
          <div className="relative border-l-2 border-dashed border-slate-200 dark:border-slate-850 pl-5 ml-2.5 space-y-3">
            {/* Branch 1 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-[7px] h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-slate-950"></span>
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Sec 28(i)</span>
                <strong className="text-xs text-white text-white block mt-1">Core Profits & Gains</strong>
                <p className="text-xs text-white text-white font-bold leading-relaxed mt-0.5">
                  Profits derived from any business or profession carried on by the assessee at any time during the fiscal year.
                </p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-white text-white pl-3 list-none">
                  <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span className="text-white text-white">Realized either in cash or in kind; taxability is unaffected by legality of the business.</span></li>
                </ul>
              </div>
            </div>

            {/* Branch 2 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-[7px] h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-slate-950"></span>
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Sec 28(ii)</span>
                <strong className="text-xs text-white text-white block mt-1">Management Compensation</strong>
                <p className="text-xs text-white text-white font-bold leading-relaxed mt-0.5">
                  Any compensation received upon termination, modification, or vesting in government of managerial roles.
                </p>
              </div>
            </div>

            {/* Branch 3 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-[7px] h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-slate-950"></span>
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Sec 28(iiia)-(iiie)</span>
                <strong className="text-xs text-white text-white block mt-1">Export Trade Incentives</strong>
                <p className="text-xs text-white text-white font-bold leading-relaxed mt-0.5">
                  Special incentives granted to motivate overseas commerce.
                </p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-white text-white pl-3 list-none">
                  <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span className="text-white text-white">Includes premium on sale of import licenses / entitlements u/s 28(iiib) & (iiid).</span></li>
                  <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span className="text-white text-white">Includes cash assistance u/s 28(iiic) and duty drawback repayments u/s 28(iiie).</span></li>
                </ul>
              </div>
            </div>

            {/* Branch 4 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-[7px] h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-slate-950"></span>
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Sec 28(v)</span>
                <strong className="text-xs text-white text-white block mt-1">Partner Remuneration</strong>
                <p className="text-xs text-white text-white font-bold leading-relaxed mt-0.5">
                  Any interest, salary, bonus, commission, or remuneration received by a partner from their partnership firm.
                </p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-white text-white pl-3 list-none">
                  <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span className="text-white text-white">Allowed as deduction in firm computation; taxed as PGBP in partner individual return up to 40(b) limits.</span></li>
                </ul>
              </div>
            </div>

            {/* Branch 5 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-[7px] h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-slate-950"></span>
              <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Sec 28(vi)</span>
                <strong className="text-xs text-white text-white block mt-1">Stock to Capital Asset conversion</strong>
                <p className="text-xs text-white text-white font-bold leading-relaxed mt-0.5">
                  Fair Market Value (FMV) of inventory on its conversion or treatment as a capital asset.
                </p>
                <ul className="mt-1.5 space-y-1 text-[11px] text-white text-white pl-3 list-none">
                  <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span className="text-white text-white">Taxable as business income on the exact date of conversion based on the FMV u/r 11UAB.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ CRITICAL EXCLUSION: Letting of Residential Estates</span>
          </div>
          <p className="text-xs font-bold text-white text-white leading-relaxed">
            Income from letting out a residential house property (by an owner) is strictly chargeable under the head <span className="font-bold underline decoration-amber-500">"Income from House Property"</span> and NOT u/s 28 as PGBP, even if the primary business objective of the entity is property renting. (Clarified by Explanation 3 to Section 28).
          </p>
        </div>
      </div>

      {/* 2. SECTION 30 & 31: RENT & REPAIRS */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 2: Section 30 & 31 - Rent, Rates, Repairs of Assets
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold">Allowability of operational maintenance outlays of business estates</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SEC 30 & 31 → REPAIRS</span>
          </div>
        </div>

        {/* Rent & Repairs Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-800 border-slate-200 space-y-2.5 flex flex-col justify-between hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs">
            <div className="space-y-2">
              <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Section 30</span>
              <strong className="text-xs text-white text-white block uppercase font-mono tracking-wider mt-1">Tenant & Owned Buildings</strong>
              <p className="text-xs text-white text-white leading-relaxed font-bold">
                Deductions allowed for rent, municipal rates, taxes, insurance, and current repairs of business buildings.
              </p>
              <ul className="space-y-1.5 text-[11px] text-white text-white pl-1 list-none mt-2 font-semibold">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                  <span><strong className="text-white text-white">Tenant Context:</strong> Fully deducts rent and current repairs if agreed u/r lease to bear repairs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                  <span><strong className="text-white text-white">Owned context:</strong> Deducts municipal taxes, rates, insurance, and current repairs. No "notional" rent deduction is allowed.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-800 border-slate-200 space-y-2.5 flex flex-col justify-between hover:bg-white dark:hover:bg-slate-900 transition-all shadow-2xs">
            <div className="space-y-2">
              <span className="text-[9px] font-bold font-mono tracking-wider text-white text-white uppercase bg-indigo-500/5 px-2 py-0.5 rounded">Section 31</span>
              <strong className="text-xs text-white text-white block uppercase font-mono tracking-wider mt-1">Machinery, Plant & Furniture</strong>
              <p className="text-xs text-white text-white leading-relaxed font-bold">
                Deductions allowed in respect of current repairs and insurance premiums paid on machinery, plant, and furniture used for business.
              </p>
              <ul className="space-y-1.5 text-[11px] text-white text-white pl-1 list-none mt-2 font-semibold">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                  <span><strong className="text-white text-white">Active & Passive Use:</strong> Allowed if the assets are owned and used (either active or ready/standby passive use) in business.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section Exception */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ EXCEPTION: Capital Repairs Capitalization</span>
          </div>
          <p className="text-xs font-bold text-white text-white leading-relaxed">
            Any expenditures incurred on premises/machinery repairs that are of a <span className="font-bold underline text-white text-white">capital nature</span> are strictly disallowed as direct current repairs u/s 30/31. They must be added back to the actual cost of the asset block, eligible solely for Section 32 depreciation.
          </p>
        </div>
      </div>

      {/* 3. SECTION 32: MANDATORY DEPRECIATION BLOCK ENGINE */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 3: Section 32 - Mandatory Depreciation Block Engine
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold">Calculating the written down value and statutory block depreciation allowances</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SECTION 32 → BLOCK DEPRECIATION</span>
          </div>
        </div>

        {/* WDV Calculation Flow Sequence block */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">Written Down Value (WDV) Flowchart</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/15">
              <span className="text-[10px] block font-mono font-bold text-white text-white">STEP 1</span>
              <strong className="text-xs text-white text-white block mt-0.5">Opening WDV</strong>
              <span className="text-[10px] text-white text-white block font-semibold">Value as on 1st April of PY</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
              <span className="text-[10px] block font-mono font-bold text-white">STEP 2 (ADD)</span>
              <strong className="text-xs text-white text-white block mt-0.5">Asset Purchases</strong>
              <span className="text-[10px] text-white text-white block font-semibold">Actual Cost of additions u/s 43(1)</span>
            </div>
            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/15">
              <span className="text-[10px] block font-mono font-bold text-white">STEP 3 (REDUCE)</span>
              <strong className="text-xs text-white text-white block mt-0.5">Money Receivable</strong>
              <span className="text-[10px] text-white text-white block font-semibold">Proceeds u/s 43(6) on sale/scrap</span>
            </div>
            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/15">
              <span className="text-[10px] block font-mono font-bold text-white text-white text-white">STEP 4 (RESULT)</span>
              <strong className="text-xs text-white text-white block mt-0.5">Closing WDV</strong>
              <span className="text-[10px] text-white text-white block font-white">Depreciation Rate is applied here</span>
            </div>
          </div>
        </div>

        {/* Slabs list */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">Statutory Slabs & Depreciation Rates</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Residential buildings</strong>
              <span className="text-lg font-white text-white text-white">5%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Commercial buildings</strong>
              <span className="text-lg font-white text-white text-white">10%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Furniture & Fittings</strong>
              <span className="text-lg font-white text-white text-white">10%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">General Machinery</strong>
              <span className="text-lg font-white text-white text-white">15%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Computers / Software</strong>
              <span className="text-lg font-white text-white text-white">40%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Pollion Control units</strong>
              <span className="text-lg font-white text-white text-white">40%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Intangible Assets</strong>
              <span className="text-lg font-white text-white text-white">25%</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
              <strong className="text-xs text-white text-white uppercase font-mono font-bold block">Commercial Goodwill</strong>
              <span className="text-lg font-white text-white">0%</span>
            </div>
          </div>
        </div>

        {/* Restricted use less than 180 days box */}
        <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 space-y-2">
          <strong className="text-xs font-bold text-white text-white block uppercase font-mono tracking-wider">The Put-to-Use 180 Days rule u/s 32(1)(ii)</strong>
          <ul className="space-y-1.5 text-xs text-white text-white pl-1 list-none font-semibold">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5"></span>
              <span><strong className="text-white text-white">Acquired & Used &lt; 180 Days:</strong> Standard depreciation rate is restricted to <span className="font-extrabold underline text-white text-white">50% of standard rate</span>. (Apply this to newly acquired assets during the previous year used after Oct 4th).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5"></span>
              <span><strong className="text-white text-white">Acquired & Used &gt;= 180 Days:</strong> Full 100% of the prescribed depreciation rate is allowable.</span>
            </li>
          </ul>
        </div>

        {/* Section Notes */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">⚠️ Statutory Mandates: Mandatory Claim u/s Explanation 5</span>
          </div>
          <p className="text-xs font-bold text-white text-white leading-relaxed">
            Depreciation claim is strictly <span className="font-bold text-white text-white">mandatory</span>. Even if the assessee fails to claim section 32 in their computational sheet, the Assessing Officer must automatically deduct depreciation to compute net business profits. Cost of Land is strictly non-depreciable. Goodwill carries 0% rate since Finance Act 2021.
          </p>
        </div>
      </div>

      {/* 4. SECTION 32(1)(iia): ADDITIONAL DEPRECIATION */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 4: Section 32(1)(iia) - Additional Depreciation on Plant & Machinery
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold">Generous first-year depreciation incentive on eligible power and manufacturing assets</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SEC 32(1)(iia) → ADDITIONAL DEPRECIATION</span>
          </div>
        </div>

        {/* Splitted Box parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200">
            <strong className="text-xs text-white text-white block uppercase font-mono tracking-wider mb-2">Eligible Conditions</strong>
            <ul className="space-y-2 text-xs text-white text-white pl-1 list-none font-semibold">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 shrink-0 mt-1.5"></span>
                <span>Assessee must be engaged either in the <span className="font-extrabold underline decoration-indigo-500/30">Manufacture / Production</span> of any raw article or thing (includes printing/publishing u/c 15/2016), or in <span className="font-extrabold pb-0.5">Power Generation, transmission or distribution</span>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 shrink-0 mt-1.5"></span>
                <span>The asset must represent a <strong className="text-white text-white font-mono text-[10.5px]">NEW</strong> Plant & Machinery acquired & installed after March 31, 2005.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200">
            <strong className="text-xs text-white text-white block uppercase font-mono tracking-wider mb-2 font-white">Incentive Rates Structure</strong>
            <ul className="space-y-2 text-xs text-white text-white pl-1 list-none font-semibold">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 shrink-0 mt-1.5"></span>
                <span><strong className="text-white text-white">Put to use &gt;= 180 Days in first year:</strong> Allowed standard rate of <strong className="text-white text-white text-sm font-white">20% of actual cost</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 shrink-0 mt-1.5"></span>
                <span><strong className="text-white text-white">Put to use &lt; 180 Days in first year:</strong> Allowed restricted rate of <strong className="text-white text-white text-sm font-white">10% of actual cost</strong>.</span>
              </li>
              <li className="flex items-start gap-2 bg-indigo-500/5 dark:bg-indigo-950/20 p-2 rounded border border-indigo-500/10">
                <span className="text-white text-white font-extrabold text-[10.5px]">💡 Carry-Forward Balance:</span>
                <span className="text-[10.5px] text-white text-white ml-1.5 block">The remaining balance of 10% is <span className="font-white underline">fully allowed as deduction</span> in the immediately succeeding previous year!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section Notes for Excluded items */}
        <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/20 space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">🚫 EXCLUDED ASSETS (STRICTLY NO ADDITIONAL DEPRECIATION)</span>
          </div>
          <p className="text-xs font-bold text-white text-white leading-relaxed">
            The 20% additional depreciation rate is completely unavailable on: (i) Second-hand machinery (domestic or imported), (ii) Machinery installed in offices or residential guest houses, (iii) Office appliances or road transport vehicles/lorries, or (iv) any machinery on which 100% deduction is claimed u/s other provisions.
          </p>
        </div>
      </div>

      {/* 5. SECTION 35AD: INVESTMENT LINKED TAX INCENTIVES */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 5: Section 35AD - Specified Investment-Linked Incentives (100% deduction)
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold">Allowing immediate writeoff of all capital outlay on specified rural infrastructure</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SEC 35AD → SPECIFIED BUSINESS</span>
          </div>
        </div>

        {/* Specified businesses block layout */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">The Specified Businesses & Conditions List</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-white text-white">
              <strong className="text-white text-white block font-mono text-[10.5px] mb-0.5 uppercase tracking-wide">Cold Chain Facilities u/s 35AD</strong>
              For agricultural produce, fish, meat or poultry under strict scientific temperature controls.
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-white text-white">
              <strong className="text-white text-white block font-mono text-[10.5px] mb-0.5 uppercase tracking-wide">Agricultural Warehouses</strong>
              Warehousing units engaged principally in storing raw agricultural harvests / inputs.
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-white text-white">
              <strong className="text-white text-white block font-mono text-[10.5px] mb-0.5 uppercase tracking-wide">Hospitals anywhere u/s 35AD</strong>
              Build and operate hospital inside India carrying a <span className="text-white text-white font-extrabold underline">minimum of 100 patient beds</span>.
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-white text-white">
              <strong className="text-white text-white block font-mono text-[10.5px] mb-0.5 uppercase tracking-wide">Hotels u/s 115BAC exclusion</strong>
              Building and operating a hotel carrying a <span className="text-white text-white font-extrabold underline">minimum 2-star category or above</span>.
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-white text-white">
              <strong className="text-white text-white block font-mono text-[10.5px] mb-0.5 uppercase tracking-wide">Slurry & Gas Pipelines</strong>
              Laying cross-country gas pipelines or slurry pipe networks for transporting iron ore or petrol.
            </div>
            <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs font-bold text-white text-white">
              <strong className="text-white text-white block font-mono text-[10.5px] mb-0.5 uppercase tracking-wide">Fertilizer production</strong>
              Setting up manufacturing facilities in India for fertilizer output.
            </div>
          </div>
        </div>

        {/* Section Notes & exclusions */}
        <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/20 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-white text-white">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-white" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold">🚫 NO DEDUCTIONS ON LAND, GOODWILL & FINANCIAL ASSETS</span>
          </div>
          <p className="text-xs font-bold text-white text-white leading-relaxed">
            While Section 35AD allows a <span className="font-extrabold underline text-white text-white">100% writeoff</span> of all capital expenditures incurred prior to or during the year, it completely excludes and disallows outlays on <span className="font-white underline text-white">Land, Goodwill, or Financial Instruments</span>.
          </p>
          <ul className="space-y-1.5 text-[11.5px] text-white text-white pl-1 list-none font-bold">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
              <span><strong className="text-white text-white uppercase font-mono text-[9.5px] tracking-wider font-extrabold">lock-in u/s 35AD(7A):</strong> The asset must be used exclusively for the specified business for <strong className="text-white font-extrabold underline">8 consecutive years</strong>. If converted or used for other business, previously claimed deduction (less normal depreciation) is clawed back as taxable PGBP income!</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 6. SECTION 40: INADMISSIBLE STATUTORY EXPENSES */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 6: Section 40 - Inadmissible Deductions & Slabs u/s 40(a) & 40(b)
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold font-semibold">Flat statutory penalty disallowances on TDS defaults and partnerships salary slabs</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SECTION 40 → DISALLOWANCES & SLABS</span>
          </div>
        </div>

        {/* Comparative left right block layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200">
            <strong className="text-xs text-white text-white block uppercase font-mono tracking-wider mb-2 font-extrabold">TDS failure u/s 40(a) Slabs</strong>
            <ul className="space-y-2 text-xs text-white text-white pl-1 list-none font-semibold">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span><strong className="text-white text-white">Resident Payments [Sec 40(a)(ia)]:</strong> If payments (interest, commission, fee) are made to a resident with NO TDS deduction ➔ <strong className="text-white text-white font-white">30% Flat Disallowance</strong>. (Allowed in the subsequent previous year of actual cash tax payment).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5"></span>
                <span><strong className="text-white text-white">Non-Resident Payments [Sec 40(a)(i)]:</strong> If payments are made outside India to non-residents with NO TDS deduction ➔ <strong className="text-white text-white font-white">100% Full Disallowance</strong>.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200">
            <strong className="text-xs text-white text-white block uppercase font-mono tracking-wider mb-2 font-extrabold">Partnership limits u/s 40(b) Slabs</strong>
            <ul className="space-y-2 text-xs text-white text-white pl-1 list-none font-semibold">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 shrink-0 mt-1.5"></span>
                <span><strong className="text-white text-white">Capital Interest limit u/s 40(b)(iv):</strong> Allowed deduction to firm up to max <strong className="text-white text-white font-white underline decoration-indigo-500/30">12% p.a. simple interest</strong>. Any excess interest is added back.</span>
              </li>
              <li className="flex items-start gap-2 bg-indigo-500/5 dark:bg-indigo-950/20 p-2.5 rounded border border-indigo-500/10">
                <div className="space-y-1 w-full text-white text-white">
                  <span className="text-white text-white font-extrabold text-[10.5px] tracking-wider uppercase block">Working Partner salary limits slabs u/s 40(b)(v):</span>
                  <p className="text-[10.5px] font-bold">• On first <strong className="text-white text-white">₹6,00,000</strong> book profits (or loss): <strong className="text-white text-white font-white">₹3,00,000 or 90% of book profits</strong>, whichever is higher.</p>
                  <p className="text-[10.5px] font-bold">• On balance book profits: Restricted to max <strong className="text-white text-white font-white">60% of profits</strong>.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. SECTION 40A(3): CASH TRANSACTION LIMITS */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 7: Section 40A(3) - Cash Transaction Limits & Rule 6DD
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold font-semibold">To curb tax evasion and motivate digital banking channels in business</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SEC 40A(3) → CASH LIMITS</span>
          </div>
        </div>

        {/* Cash limit flow sequence diagrams */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">The cash flow parameters</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-slate-950 border border-rose-500/15 text-xs font-semibold hover:bg-rose-500/10 transition-colors flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-wider font-extrabold text-white text-white block uppercase">LIMIT A → GENERAL BUSINESS PAYMENT</span>
                <strong className="text-white text-white block text-xs mt-0.5 font-bold">Disallowed if Cash payment u/s 40A(3) exceeds:</strong>
                <span className="text-xl font-white text-white">₹10,000 / day</span>
              </div>
              <p className="text-[11px] text-white text-white block mt-2 leading-relaxed font-semibold">Paid to a single person in a single fiscal day u/s 40A(3), otherwise than through prescribed bank clearances.</p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/5 dark:bg-slate-950 border border-indigo-500/15 text-xs font-semibold hover:bg-indigo-500/10 transition-colors flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-wider font-extrabold text-white text-white block uppercase">LIMIT B → GOODS TRANSPORT OPERATORS</span>
                <strong className="text-white text-white block text-xs mt-0.5 font-bold">Relaxed cash payment limit u/s 40A(3):</strong>
                <span className="text-xl font-white text-white text-white">₹35,000 / day</span>
              </div>
              <p className="text-[11px] text-white text-white block mt-2 leading-relaxed font-semibold">For plying, hiring, or leasing goods carriages u/s 40A(3) to support small truck proprietors.</p>
            </div>
          </div>
        </div>

        {/* Rule 6DD exemptions */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 border-slate-200 space-y-2">
          <strong className="text-xs font-bold text-white text-white block uppercase font-mono tracking-wider">Critical Rule 6DD Exemptions (Allowed Cash u/s limits)</strong>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white text-white pl-1 list-none font-bold">
            <li className="flex items-start gap-1.5">
              <span className="text-white shrink-0 mt-0.5">•</span>
              <span className="text-white text-white">Payments made directly to RBI, State Bank of India, co-operative banks, or LIC.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-white shrink-0 mt-0.5">•</span>
              <span className="text-white text-white">Payments made to the Government as taxes in legal cash tender.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-white shrink-0 mt-0.5">•</span>
              <span className="text-white text-white">Purchase of agricultural or forest produce/cultivations directly from producers.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-white shrink-0 mt-0.5">•</span>
              <span className="text-white text-white">Payments made in a village or town not served by any banking financial company.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 8. SECTION 73: SPECULATION BUSINESS SPLIT */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 8: Section 73 - Speculation Business Slabs Split
              </h4>
              <p className="text-[11px] text-white text-white font-extrabold font-semibold">Isolating speculative transactions to prevent general offset evasion u/s 73</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SECTION 73 → SPECULATION LIMITS</span>
          </div>
        </div>

        {/* Speculative vs non speculative cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-orange-500/5 dark:bg-slate-950 border border-orange-500/15 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-white text-white">
              <span className="h-2 w-2 rounded-full bg-orange-600 shrink-0"></span>
              <strong className="text-xs font-white uppercase font-mono tracking-wider">Speculative Transactions u/s 43(5)</strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-bold">
              Any contract for purchase/sale of commodities/scrips settled completely <span className="font-extrabold underline text-white">otherwise than by actual physical delivery</span>.
            </p>
            <div className="pt-2 border-t border-orange-500/10 text-[10.5px] font-white text-white text-white font-mono tracking-tight">
              ⚠️ LOSS OFFSET: Speculative losses can ONLY be set off against speculative profits. Carry-forward is limited to 4 years.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-slate-950 border border-emerald-500/15 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-white text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0"></span>
              <strong className="text-xs font-white uppercase font-mono tracking-wider">Explicit Non-Speculative Slabs</strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-bold">
              Statutory exceptions that are excluded from being treated as speculation:
            </p>
            <ul className="space-y-1 text-[11px] text-white text-white pl-1 list-none font-bold">
              <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span>Hedging contracts inside raw materials to guard against core commodity price fluctuations.</span></li>
              <li className="flex items-start gap-1.5"><span className="text-white shrink-0 mt-0.5">•</span> <span>Trading in derivatives u/s 43(5)(d) on a recognized stock exchange (e.g. F&O).</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaxInvoiceHighFidelityView() {
  return (
    <div className="space-y-8 font-sans w-full animate-in fade-in duration-200">
      {/* 1. Section 31: Tax Invoice Tree Framework */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 31: Statutory Invoicing Tree Matrix
              </h4>
              <p className="text-[10px] text-white font-medium pb-0.5">Dual-pathway hierarchy mapping timelines u/s 31(1) & 31(2)</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SECTION 31 → TAX INVOICE GUIDE</span>
          </div>
        </div>

        {/* Tree Diagram for Section 31 */}
        <div className="relative p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          {/* Main Root node */}
          <div className="flex justify-center mb-8">
            <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md uppercase tracking-wider text-center border border-indigo-500 flex flex-col items-center">
              <span className="text-[9px] font-mono text-white font-white tracking-widest uppercase">Statutory Command</span>
              <span className="text-sm font-white">Section 31 Tax Invoice</span>
              {/* Downward branch point indicators */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white"></div>
            </div>
          </div>

          {/* Connection Lines & Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative mt-4">
            
            {/* Visual branching connectors for web-screens */}
            <div className="hidden md:block absolute top-[ -32px ] left-[15%] right-[15%] h-[32px] border-t-2 border-dashed border-indigo-400 dark:border-indigo-800"></div>
            <div className="hidden md:block absolute top-[ -32px ] left-[15%] w-[2px] h-[32px] bg-indigo-400 dark:bg-indigo-800"></div>
            <div className="hidden md:block absolute top-[ -32px ] right-[15%] w-[2px] h-[32px] bg-indigo-400 dark:bg-indigo-800"></div>

            {/* Left Branch: Taxable Goods [Section 31(1)] */}
            <div className="relative bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-500/20 transition-all">
              <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-[9px] font-mono font-white uppercase px-2 py-0.5 rounded shadow-xs">
                Sec 31(1)
              </div>
              
              <div className="pb-2.5 border-b dark:border-slate-800/60 border-slate-100 flex items-center justify-between">
                <strong className="text-xs text-white text-white uppercase tracking-wider font-sans font-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0"></span>
                  Supply of Taxable Goods
                </strong>
                <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-white text-white px-2 py-0.5 rounded">Goods Channel</span>
              </div>

              {/* Sub-branches for Goods */}
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">A. Supply Involves Movement</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Must issue the invoice <span className="underline decoration-indigo-500/40 font-white text-white text-white">on or before removal</span> of goods for supply to recipient.
                  </p>
                </div>

                <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">B. Supply Involves No Movement</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Must issue the invoice <span className="underline decoration-indigo-500/40 font-white text-white text-white">on or before delivery</span> or making goods available to the recipient.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Branch: Taxable Services [Section 31(2)] */}
            <div className="relative bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-500/20 transition-all">
              <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[9px] font-mono font-white uppercase px-2 py-0.5 rounded shadow-xs">
                Sec 31(2)
              </div>
              
              <div className="pb-2.5 border-b dark:border-slate-800/60 border-slate-100 flex items-center justify-between">
                <strong className="text-xs text-white text-white uppercase tracking-wider font-sans font-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-550 shrink-0"></span>
                  Supply of Taxable Services
                </strong>
                <span className="text-[9px] font-mono font-bold bg-purple-500/10 text-white text-white px-2 py-0.5 rounded">Services Channel</span>
              </div>

              {/* Sub-branches for Services */}
              <div className="space-y-3">
                <div className="p-3 bg-purple-50/30 dark:bg-purple-950/20 border border-purple-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">A. General Service Provision</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Must issue the invoice <span className="underline decoration-purple-500/40 font-white text-white text-white">within 30 days</span> from the date of completion of service.
                  </p>
                </div>

                <div className="p-3 bg-purple-50/30 dark:bg-purple-950/20 border border-purple-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">B. Telecom, Banking, NBFC, Insurer</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Timeline window is relaxed, must issue invoice <span className="underline decoration-purple-500/40 font-white text-white text-white">within 45 days</span> of the completion.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section Notes: Continuous Supplies Sub-Branches */}
        <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white text-white block p-0.5">Continuous Supplies Timelines [Sec 31(4) & Sec 31(5)]</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-white text-white space-y-2">
              <strong className="text-white text-white uppercase text-[10px] font-mono tracking-wide block">Goods Continuous Supply u/s 31(4)</strong>
              <p className="font-semibold text-xs leading-relaxed text-white text-white">
                Where successive statements of accounts or successive payments are contractually involved:
              </p>
              <ul className="space-y-1.5 pr-1.5 pl-0.5 list-none">
                <li className="flex items-start gap-1.5 text-xs text-white text-white">
                  <span className="text-white shrink-0 mt-1 font-white">•</span>
                  <span>Invoice must be issued <strong className="text-white text-white underline">before or at the time</strong> of each successive statement or payment receipt.</span>
                </li>
              </ul>
            </div>
            
            <div className="p-3 rounded-lg border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-white text-white space-y-2">
              <strong className="text-white text-white uppercase text-[10px] font-mono tracking-wide block">Services Continuous Supply u/s 31(5)</strong>
              <p className="font-semibold text-[11px] leading-relaxed text-white text-white">
                Depending on how payments are structured in the contract:
              </p>
              <ul className="space-y-1 pl-0.5 list-none">
                <li className="flex items-start gap-1.5 text-[11px] text-white text-white">
                  <span className="text-white font-bold shrink-0 mt-0.5">•</span>
                  <span><strong className="text-white text-white">Due Date Ascertainable:</strong> On or before the scheduled payment due date.</span>
                </li>
                <li className="flex items-start gap-1.5 text-[11px] text-white text-white">
                  <span className="text-white font-bold shrink-0 mt-0.5">•</span>
                  <span><strong className="text-white text-white">Due Date Not Ascertainable:</strong> On or before date of receiving cash payment.</span>
                </li>
                <li className="flex items-start gap-1.5 text-[11px] text-white text-white">
                  <span className="text-white font-bold shrink-0 mt-0.5">•</span>
                  <span><strong className="text-white text-white">Payment Linked to Milestone:</strong> On or before completion of that specific milestone.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section 34: Credit & Debit Notes Tree Diagram */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b dark:border-slate-800 border-slate-150">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Layers className="h-4.5 w-4.5 text-white text-white" />
            </div>
            <div>
              <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
                Section 34: Credit & Debit Notes Tree Matrix
              </h4>
              <p className="text-[10px] text-white font-medium">Visual branches defining statutory corrective modifications u/s 34</p>
            </div>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/10">SECTION 34 → RECONCILIATIONS</span>
          </div>
        </div>

        {/* Tree Diagram for Section 34 */}
        <div className="relative p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-205 dark:border-slate-800/80 shadow-2xs">
          {/* Main Root node */}
          <div className="flex justify-center mb-8">
            <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md uppercase tracking-wider text-center border border-indigo-505 flex flex-col items-center">
              <span className="text-[9px] font-mono text-white font-white tracking-widest uppercase">Root Provision</span>
              <span className="text-sm font-white">Section 34 Post-Sale Adjustments</span>
              {/* Downward branch point indicators */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white"></div>
            </div>
          </div>

          {/* Connection Lines & Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative mt-4">
            
            {/* Visual branching connectors for web-screens */}
            <div className="hidden md:block absolute top-[ -32px ] left-[15%] right-[15%] h-[32px] border-t-2 border-dashed border-indigo-400 dark:border-indigo-800"></div>
            <div className="hidden md:block absolute top-[ -32px ] left-[15%] w-[2px] h-[32px] bg-indigo-400 dark:bg-indigo-800"></div>
            <div className="hidden md:block absolute top-[ -32px ] right-[15%] w-[2px] h-[32px] bg-indigo-400 dark:bg-indigo-800"></div>

            {/* Left Node: Credit Note u/s 34(1) */}
            <div className="relative bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-rose-200 dark:border-rose-950/60 shadow-2xs space-y-4 hover:border-rose-405/20 transition-all">
              <div className="absolute -top-3 left-4 bg-rose-600 text-white text-[9px] font-mono font-white uppercase px-2 py-0.5 rounded shadow-xs">
                Sec 34(1)
              </div>
              
              <div className="pb-2.5 border-b dark:border-slate-800/60 border-slate-100 flex items-center justify-between">
                <strong className="text-xs text-white text-white uppercase tracking-wider font-sans font-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
                  Credit Note (Downward Adjustment)
                </strong>
                <span className="text-[9px] font-mono font-bold bg-rose-500/10 text-white text-white px-2 py-0.5 rounded">Credit Node</span>
              </div>

              {/* Three triggers of Credit Note represented visually as a mini vertical sub-tree */}
              <div className="space-y-3">
                <div className="p-3 bg-rose-50/45 dark:bg-rose-950/15 border border-rose-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-rose-550"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">Trig 1: Taxable Value/Tax Exceeds Actuals</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Where the tax charged or taxable value shown in the invoice is higher than actual liability.
                  </p>
                </div>

                <div className="p-3 bg-rose-50/45 dark:bg-rose-950/15 border border-rose-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-rose-550"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">Trig 2: Sales Return</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Where the recipient physically returns the supplied goods to the supplier.
                  </p>
                </div>

                <div className="p-3 bg-rose-50/45 dark:bg-rose-950/15 border border-rose-500/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-rose-550"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">Trig 3: deficient supply</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Where goods or services supplied are found to be deficient in quality/specifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Node: Debit Note u/s 34(3) */}
            <div className="relative bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 shadow-2xs space-y-4 hover:border-emerald-405/20 transition-all">
              <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[9px] font-mono font-white uppercase px-2 py-0.5 rounded shadow-xs">
                Sec 34(3)
              </div>
              
              <div className="pb-2.5 border-b dark:border-slate-800/60 border-slate-100 flex items-center justify-between">
                <strong className="text-xs text-white text-white uppercase tracking-wider font-sans font-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-550 shrink-0"></span>
                  Debit Note (Upward Adjustment)
                </strong>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-white text-white px-2 py-0.5 rounded">Debit Node</span>
              </div>

              {/* Two triggers of Debit Note represented visually as a mini vertical sub-tree */}
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/45 dark:bg-emerald-950/15 border border-emerald-505/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-emerald-555"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">Trig 1: Taxable Value/Tax represents less</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Where the tax charged or taxable value shown in the invoice is lower than actual liability.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/45 dark:bg-emerald-950/15 border border-emerald-505/10 rounded-xl relative pl-6 leading-relaxed">
                  <span className="absolute left-2.5 top-4 h-1.5 w-1.5 rounded-full bg-emerald-555"></span>
                  <div className="text-[10px] uppercase font-bold text-white text-white tracking-wide font-mono mb-0.5">Trig 2: Price Escalation Contract</div>
                  <p className="text-xs text-white text-white font-bold leading-normal">
                    Triggered to raise additional tax charges pursuant to post-supply price increase agreements.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Section 31(3) Special Invoicing Instruments with highlighted Subheadings and bullets */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Milestone className="h-4.5 w-4.5 text-white text-white" />
          </div>
          <div>
            <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
              Section 31(3): Special Invoicing Instruments
            </h4>
            <p className="text-[10px] text-white font-medium">Bespoke statutory instruments matching diverse supply scenarios</p>
          </div>
        </div>

        {/* Instead of boxes, clean border-left highlighted subheadings with bulleted points under each */}
        <div className="space-y-6">
          
          <div className="border-l-4 border-indigo-500 pl-4 py-0.5 space-y-2">
            <h5 className="text-[13px] font-white uppercase text-white text-white tracking-wide font-sans flex items-center gap-1.5 leading-none">
              Revised Tax Invoice u/s 31(3)(a)
            </h5>
            <div className="text-xs text-white text-white leading-relaxed font-semibold">
              <ul className="space-y-1.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Allows a newly registered person to issue <strong className="text-white text-white">Revised Tax Invoices</strong> against the invoices already raised during the transitional period.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Covers the period between the <strong className="text-white text-white">effective date of registration</strong> and the <strong className="text-white text-white">date of grant of registration certificate</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Must be issued within a strict statutory timeline of <strong className="text-white text-white font-white">1 month</strong> from the date of grant of registration.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4 py-0.5 space-y-2">
            <h5 className="text-[13px] font-white uppercase text-white text-white tracking-wide font-sans flex items-center gap-1.5 leading-none">
              Bill of Supply u/s 31(3)(c)
            </h5>
            <div className="text-xs text-white text-white leading-relaxed font-semibold">
              <ul className="space-y-1.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Issued by registered taxpayers engaged in making supplies of <strong className="text-white text-white">exempt goods or services</strong>, or by small traders operating under the <strong className="text-white text-white">Composition Levy Scheme u/s 10</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>These suppliers are <strong className="text-white text-white font-white">strictly prohibited</strong> from collecting output GST from their recipients or claiming any ITC on input channels.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4 py-0.5 space-y-2">
            <h5 className="text-[13px] font-white uppercase text-white text-white tracking-wide font-sans flex items-center gap-1.5 leading-none">
              Receipt Voucher u/s 31(3)(d)
            </h5>
            <div className="text-xs text-white text-white leading-relaxed font-semibold">
              <ul className="space-y-1.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Mandatorily issued by a registered supplier immediately upon receiving an <strong className="text-white text-white">advance payment</strong> with respect to the supply of taxable services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span><strong className="text-white text-white">Statutory logical defaults:</strong> If the rate of tax or the Place of Supply (POS) is not determinable at the advance receipt stage, tax must be provisionally computed at a flat rate of <strong className="text-white font-white">18%</strong>, and the supply is deemed to be an <strong className="text-white font-white">inter-State supply</strong>.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4 py-0.5 space-y-2">
            <h5 className="text-[13px] font-white uppercase text-white text-white tracking-wide font-sans flex items-center gap-1.5 leading-none">
              Refund Voucher u/s 31(3)(e)
            </h5>
            <div className="text-xs text-white text-white leading-relaxed font-semibold">
              <ul className="space-y-1.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Issued when an advance payment is collected, but the underlying supply does not materialize subsequently, and <strong className="text-white text-white">no tax invoice is raised</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span>Enables the supplier to return the advance funds and reverse the tax liability provisionally accounted u/s 31(3)(d).</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4 py-0.5 space-y-2">
            <h5 className="text-[13px] font-white uppercase text-white text-white tracking-wide font-sans flex items-center gap-1.5 leading-none">
              Inward RCM Invoice and Payment Voucher u/s 31(3)(f) & (g)
            </h5>
            <div className="text-xs text-white text-white leading-relaxed font-semibold">
              <ul className="space-y-1.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span><strong className="text-white text-white">Inward invoice [u/s 31(3)(f)]:</strong> Must be issued by a recipient who is liable to pay tax under Reverse Charge Mechanism (RCM) u/s 9(3) or 9(4), on receipt of goods/services from an <strong className="text-white text-white">unregistered supplier</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-1 font-mono text-[10px]">•</span>
                  <span><strong className="text-white text-white">Payment Voucher [u/s 31(3)(g)]:</strong> Mandatorily issued by the RCM recipient at the exact moment of making the actual payment to the unregistered supplier.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Critical Exceptions Grid of 3 Conditions - Spaced, tidy, visually pleasing */}
      <div className="p-6 rounded-2xl border-2 border-indigo-600/30 bg-white dark:bg-slate-900/10 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b dark:border-slate-800 border-slate-150">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-white text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4.5 w-4.5 text-white text-white" />
          </div>
          <div>
            <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider">
              Statutory Critical Exceptions u/s 31 & 34
            </h4>
            <p className="text-[10px] text-white font-medium">Clear structured layouts for low-value limits and input-reversal matching timelines</p>
          </div>
        </div>

        {/* Section 1: Exemption u/s 31(3)(b) - Tree/Col listing of 3 conditions */}
        <div className="space-y-3">
          <span className="text-[10.5px] font-mono uppercase tracking-wider font-extrabold text-white text-white block px-1">
            🚫 Low-Value Exemption from Invoicing u/s 31(3)(b) - 3 Absolute Conditions
          </span>
          <p className="text-xs text-white text-white font-semibold leading-relaxed px-1">
            A registered person is exempt from issuing individual tax invoices at the point of supply if the value of goods or services supplied is <strong className="text-white text-white underline">less than ₹200</strong>, provided ALL of the following 3 conditions are satisfied:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1.5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-1.5 font-sans">
              <span className="h-6 w-6 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-white text-white flex items-center justify-center text-xs font-white font-mono shadow-2xs">1</span>
              <strong className="text-xs text-white text-white block font-bold">Unregistered Recipient</strong>
              <p className="text-[11px] text-white text-white leading-normal font-semibold">
                The recipient of the low-value supply must be a completely unregistered entity/person.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-1.5 font-sans">
              <span className="h-6 w-6 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-white text-white flex items-center justify-center text-xs font-white font-mono shadow-2xs">2</span>
              <strong className="text-xs text-white text-white block font-bold">No Demand Raised</strong>
              <p className="text-[11px] text-white text-white leading-normal font-semibold">
                The recipient does not explicitly demand or request the issuance of any tax invoice at purchase point.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-1.5 font-sans">
              <span className="h-6 w-6 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-white text-white flex items-center justify-center text-xs font-white font-mono shadow-2xs">3</span>
              <strong className="text-xs text-white text-white block font-white">Consolidated Invoice</strong>
              <p className="text-[11px] text-white text-white leading-normal font-semibold">
                The supplier must issue a single consolidated tax invoice representing all such low-value supplies at the close of each working day.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Credit Note restrictions u/s 34(2) - 3 Absolute Conditions */}
        <div className="space-y-3 pt-4 border-t dark:border-slate-800 border-slate-150">
          <span className="text-[10.5px] font-mono uppercase tracking-wider font-extrabold text-white text-white block px-1">
            ⚠️ Reducing Output Tax Liability via Credit Notes u/s 34(2) - 3 Strict Rules
          </span>
          <p className="text-xs text-white text-white font-semibold leading-relaxed px-1">
            To prevent tax adjustments without tracking, the supplier can only reduce their output tax liability via an issued Credit Note if three strict statutory conditions are met:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1.5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-1.5 font-sans">
              <span className="h-6 w-6 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 text-white text-white flex items-center justify-center text-xs font-white font-mono shadow-2xs">1</span>
              <strong className="text-xs text-white text-white block font-bold">Filing Deadline</strong>
              <p className="text-[11px] text-white text-white leading-normal font-semibold">
                Must register the Credit Note in GSTR-1 latest by <strong className="text-white text-white">30th November</strong> following the end of the FY, or date of filing the annual return, whichever is earlier.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-1.5 font-sans">
              <span className="h-6 w-6 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 text-white text-white flex items-center justify-center text-xs font-white font-mono shadow-2xs">2</span>
              <strong className="text-xs text-white text-white block font-bold">Recipient ITC Reversal</strong>
              <p className="text-[11px] text-white text-white leading-normal font-semibold">
                The corresponding Input Tax Credit (ITC) must be reversed by the recipient inside their GSTR-3B return (reversal is matched u/s GSTR-2B).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-1.5 font-sans">
              <span className="h-6 w-6 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 text-white text-white flex items-center justify-center text-xs font-white font-mono shadow-2xs">3</span>
              <strong className="text-xs text-white text-white block font-white">Online Declaration</strong>
              <p className="text-[11px] text-white text-white leading-normal font-semibold">
                The details of the credit note must be explicitly matched and declared online in the regular return (Form GSTR-1) for the respective month.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Clean Exam Case Worked Application without clumsy a b c d letters */}
      <div className="ml-0 p-5 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/5 border border-indigo-500/10 text-xs text-white text-white flex items-start gap-3.5 shadow-2xs">
        <Lightbulb className="h-5 w-5 shrink-0 mt-0.5 text-white" />
        <div className="space-y-3 flex-1 min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-white text-white block leading-none">Prominent Faculty Exam Application Case Study</span>
          
          <div className="space-y-2">
            <strong className="text-white text-white block text-sm font-extrabold">Illustrative Problem: Post-Supply Sales Return & Defect Adjustment</strong>
            <p className="font-semibold text-xs leading-relaxed text-white text-white">
              A registered Indian manufacturer sells customized industrial machinery components to a domestic distributor:
            </p>
            
            {/* Using bullets instead of clumsy sequential listing or non-sequential letters */}
            <ul className="space-y-2 text-xs font-semibold pl-0 list-none mt-1">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                <span>The manufacturer raises a statutory tax invoice on <strong className="text-white text-white">10-August</strong> for a transaction value of <strong className="text-white text-white">₹15,00,000 + 18% GST</strong> (₹2,70,000).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                <span>Upon delivery on 15-August, the distributor reports severe manufacturing defects in 20% of the machinery parts and returns them promptly to the supplier.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></span>
                <span>The supplier exercises statutory Section 34(1) rights and issues a credit note on <strong className="text-white text-white">20-August</strong> for <strong className="text-white text-white">₹3,00,000 + 18% GST</strong> (₹54,000).</span>
              </li>
              <li className="flex items-start gap-2.5 bg-emerald-550/5 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-500/10 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wide text-white text-white font-white">Statutory Faculty Verdict:</div>
                <span className="text-xs text-white text-white block font-bold leading-relaxed">
                  The supplier can only reduce their output tax liability of ₹54,000 in August GSTR-1/3B if the recipient distributor reverses the ₹54,000 Input Tax Credit in their return. This ensures no double benefit is taken and governments audit trails match perfectly!
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

function PlaceOfSupplyHighFidelityView() {
  return (
    <div className="space-y-8 font-sans w-full text-white text-white animate-in fade-in duration-200">
      
      {/* Editorial Chapter Header */}
      <div className="border-b-2 border-indigo-600 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-white text-white text-white uppercase tracking-widest block font-extrabold">
              IGST Statutory Cheat-Sheet Series
            </span>
            <h3 className="text-xl font-white text-white text-white uppercase tracking-tight mt-1">
              Chapter V: Place of Supply (POS) of Goods or Services
            </h3>
            <p className="text-xs text-white font-semibold mt-0.5">
              Statutory analysis & interpretation of Sections 10, 11, 12, & 13 of the Integrated GST Act, 2017
            </p>
          </div>
          <div className="text-left md:text-right font-semibold">
            <span className="inline-block text-[9px] font-mono tracking-wider font-extrabold px-2.5 py-1 rounded bg-indigo-500/10 text-white text-white border border-indigo-500/15 uppercase">
              REVISION PARADIGM: CRITICAL EXAM FOCUS
            </span>
          </div>
        </div>
      </div>

      {/* Core Principle Summary Banner */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-205 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-2">
          <h4 className="text-xs font-white text-white text-white uppercase tracking-wider flex items-center gap-1.5 matches">
            <Scale className="h-4 w-4 text-white text-white" />
            The Destination-Based Consumption Tax Paradigm
          </h4>
          <p className="text-xs text-white text-white leading-relaxed font-semibold">
            GST is a destination-based consumption tax. Tax is routed to the State where the goods or services are actually <span className="underline decoration-indigo-500/30 text-white text-white font-white">consumed</span>, rather than where they originate. Determining the exact <span className="text-white text-white font-extrabold">Place of Supply (POS)</span> is mandatory because comparing it to the <span className="font-bold">Location of the Supplier (LOS)</span> classifies the transaction:
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-bold pt-1">
            <span className="flex items-center gap-1 text-white text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              LOS ≠ POS ──➔ Inter-State Supply (IGST Charged u/s 7)
            </span>
            <span className="flex items-center gap-1 text-white text-white">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              LOS = POS ──➔ Intra-State Supply (CGST + SGST Charged u/s 8)
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 p-3.5 rounded-lg border border-slate-205 dark:border-slate-800 flex flex-col justify-center space-y-1 font-semibold">
          <span className="text-[9px] font-mono text-white text-white block font-white uppercase leading-none">
            STATUTORY MATRIX
          </span>
          <div className="space-y-1.5 pt-1.5 text-[11px] font-bold text-white text-white">
            <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span className="text-white">Sec 10</span>
              <span>Domestic Goods</span>
            </p>
            <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span className="text-white">Sec 11</span>
              <span>Imports/Exports</span>
            </p>
            <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span className="text-white">Sec 12</span>
              <span>Services (Domestic)</span>
            </p>
            <p className="flex justify-between">
              <span className="text-white">Sec 13</span>
              <span>Services (Cross-Border)</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 10: DOMESTIC GOODS SUPPLY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
          <div className="h-5.5 w-5.5 rounded-md bg-indigo-500/10 text-white text-white flex items-center justify-center shrink-0 font-mono text-xs font-white">
            10
          </div>
          <div>
            <h4 className="text-xs font-white uppercase text-white text-white tracking-wider">
              Section 10: Place of Supply of Goods (Other than Import/Export)
            </h4>
            <p className="text-[10px] text-white font-semibold text-white">Governing provisions where movement, assembly, or aboard delivery takes place</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Sec 10(1)(a) */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Sec 10(1)(a)
                </span>
                <span className="text-[8px] font-mono text-white font-extrabold uppercase">Physical Movement</span>
              </div>
              <strong className="text-xs font-bold text-white text-white block">Supply Involves Movement of Goods</strong>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Where the supply involves movement of goods (by supplier, recipient, or any other person), the POS is the <span className="font-bold underline decoration-indigo-500/35 text-white text-white">location of the goods at the time where the movement terminates</span> for delivery to the recipient.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-[8px] font-mono uppercase text-white text-white block font-white">EXAM EXAMPLE & TEST POINT:</span>
              <p className="text-[10px] text-white text-white leading-normal font-semibold">
                Supplier in Ranchi (Jharkhand) dispatches items to Buyer in Patna (Bihar). Movement terminates in Patna. <span className="font-bold text-white text-white">POS is Patna</span>. IGST applies.
              </p>
            </div>
          </div>

          {/* Sec 10(1)(b) */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800 /80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Sec 10(1)(b)
                </span>
                <span className="text-[8px] font-mono text-white text-white font-extrabold uppercase">Bill-to-Ship-to</span>
              </div>
              <strong className="text-xs font-bold text-white text-white block">Deemed Delivery / Third Party Directions</strong>
              <p className="text-xs text-white text-white leading-relaxed font-semibold font-semibold">
                Where goods are delivered to a recipient on direction of a third person (whether acting as agent or otherwise), it is deemed that such third person has received the goods. POS is the <span className="font-bold underline decoration-emerald-500/30 text-white text-white">principal place of business of that third person</span>.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">
              <span className="text-[8px] font-mono uppercase text-white text-white block font-white">EXAM EXAMPLE & TEST POINT:</span>
              <p className="text-[10px] text-white text-white font-semibold leading-normal">
                A in Haryana instructs B in Delhi to ship tyres to C in Tamil Nadu. First leg POS is <span className="font-bold text-white text-white">Haryana (A's office)</span>. Leg 2 POS is Tamil Nadu.
              </p>
            </div>
          </div>

          {/* Sec 10(1)(c) */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Sec 10(1)(c)
                </span>
                <span className="text-[8px] font-mono text-white font-extrabold uppercase">No Movement</span>
              </div>
              <strong className="text-xs font-bold text-white text-white block">Supply Involving No Movement of Goods</strong>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Where the supply does not involve movement of goods (whether by supplier or recipient), the POS is the <span className="font-bold underline decoration-indigo-500/30 text-white text-white">location of the goods at the time of delivery</span> to the recipient.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">
              <span className="text-[8px] font-mono uppercase text-white text-white block font-white">EXAM EXAMPLE & TEST POINT:</span>
              <p className="text-[10px] text-white text-white font-semibold leading-normal">
                Sub-leasing/sale of physical heavy generators already operating on-site at a factory floor in Pune. <span className="font-bold text-white text-white">POS is Pune (Maharashtra)</span>.
              </p>
            </div>
          </div>

          {/* Sec 10(1)(ca) */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Sec 10(1)(ca)
                </span>
                <span className="text-[8px] font-mono text-white font-extrabold uppercase">Unregistered Person</span>
              </div>
              <strong className="text-xs font-bold text-white text-white block">Supply to Unregistered Person</strong>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Where goods are supplied to an unregistered person, the POS is the <span className="font-bold text-white text-white">address on invoice record</span>; if no address is recorded on the bill, POS Reverts u/s 10 to the <span className="font-bold">location of the supplier</span>.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold font-semibold">
              <span className="text-[8px] font-mono uppercase text-white text-white block font-white">EXAM EXAMPLE & TEST POINT:</span>
              <p className="text-[10px] text-white text-white font-semibold leading-normal">
                Over-the-counter retail checkout of luxury watches in Mumbai to a traveler, with his home address in Goa recorded. <span className="font-bold text-white text-white">POS is Goa</span>.
              </p>
            </div>
          </div>

          {/* Sec 10(1)(d) */}
          <div className="bg-white dark:bg-slate-955 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Sec 10(1)(d)
                </span>
                <span className="text-[8px] font-mono text-white font-extrabold uppercase">Assembly / Installation</span>
              </div>
              <strong className="text-xs font-bold text-white text-white block">Assembly or Installation on Site</strong>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Where the goods are assembled or installed at site, the POS is the <span className="font-bold underline decoration-indigo-500/35 text-white text-white">place of such assembly or installation</span>.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">
              <span className="text-[8px] font-mono uppercase text-white text-white block font-white">EXAM EXAMPLE & TEST POINT:</span>
              <p className="text-[10px] text-white text-white font-semibold leading-normal">
                Centralized AC plant engineered in Delhi but set up on site in Noida (UP) office. <span className="font-bold text-white text-white">POS is Noida, UP</span>. CGST+SGST UP applies.
              </p>
            </div>
          </div>

          {/* Sec 10(1)(e) */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-205 dark:border-slate-800/80 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  Sec 10(1)(e)
                </span>
                <span className="text-[8px] font-mono text-white font-extrabold uppercase">On-Board Conveyance</span>
              </div>
              <strong className="text-xs font-bold text-white text-white block">Goods Supplied on Board a Conveyance</strong>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Where goods are supplied on board a conveyance (train, airplane, vessel, or motor vehicle), POS is the <span className="font-bold underline decoration-indigo-500/35 text-white text-white">location where goods are taken on board</span>.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-semibold">
              <span className="text-[8px] font-mono uppercase text-white text-white block font-white">EXAM EXAMPLE & TEST POINT:</span>
              <p className="text-[10px] text-white text-white font-semibold leading-normal">
                Meal packages loaded at Kolkata onto a flight returning from Delhi. A passenger buys a food tray mid-air over Lucknow. <span className="font-bold text-white text-white">POS is Kolkata</span>.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 11: CROSS-BORDER GOODS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-205 dark:border-slate-800">
          <div className="h-5.5 w-5.5 rounded-md bg-indigo-500/10 text-white text-white flex items-center justify-center shrink-0 font-mono text-xs font-white">
            11
          </div>
          <div>
            <h4 className="text-xs font-white uppercase text-white text-white tracking-wider">
              Section 11: Place of Supply of Goods Imported into or Exported from India
            </h4>
            <p className="text-[10px] text-white font-medium">Determining geographic status under international custom lines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Imported goods u/s 11(a) */}
          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-205 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                Sec 11(a)
              </span>
              <strong className="text-xs font-bold text-white text-white uppercase tracking-wider">Goods Imported into India</strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-semibold">
              The Place of Supply of goods imported into India shall be the <span className="font-white text-white text-white underline decoration-indigo-500/30">location of the importer</span>.
            </p>
            <div className="p-3 bg-indigo-500/5 rounded border border-indigo-500/10 text-[11px] font-semibold">
              <span className="text-white text-white block font-white uppercase tracking-wider text-[9px] mb-0.5">Practical Corollary</span>
              If an enterprise in Bangalore imports high-capacity machinery from Hamburg, Germany through the Chennai port, the <span className="text-white text-white underline font-extrabold">POS is Bangalore (Karnataka)</span>, not Chennai port.
            </div>
          </div>

          {/* Exported goods u/s 11(b) */}
          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-205 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                Sec 11(b)
              </span>
              <strong className="text-xs font-bold text-white text-white uppercase tracking-wider">Goods Exported from India</strong>
            </div>
            <p className="text-xs text-white text-white leading-relaxed font-semibold">
              The Place of Supply of goods exported from India shall be the <span className="font-white text-white text-white underline decoration-indigo-500/30">location outside India</span> (Ultimate Destination).
            </p>
            <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/10 text-[11px] font-semibold">
              <span className="text-white text-white block font-white uppercase tracking-wider text-[9px] mb-0.5 font-bold">Taxability Impact</span>
              Since the POS is outside India, this matches the zero-rated supply rules of IGST. The supplier qualifies for export benefits (refund of ITC or bond/LUT).
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 12: DOMESTIC SERVICES SUPPLY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-slate-800">
          <div className="h-5.5 w-5.5 rounded-md bg-indigo-500/10 text-white text-white flex items-center justify-center shrink-0 font-mono text-xs font-white">
            12
          </div>
          <div>
            <h4 className="text-xs font-white uppercase text-white text-white tracking-wider">
              Section 12: POS of Services (Where Supplier and Recipient are both in India)
            </h4>
            <p className="text-[10px] text-white font-semibold">B2B registered person privileges vs specific physical performance overrides</p>
          </div>
        </div>

        {/* 12(2) Default General Provision */}
        <div className="p-4 bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-550/20 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/20">
              Section 12(2) - THE GENERAL PROXY
            </span>
            <span className="text-[8px] font-mono text-white text-white font-extrabold uppercase tracking-widest">
              Fallback Default Rule
            </span>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-white text-white">
            For all services where no specific rules (3) to (14) are attracted, the default Place of Supply is determined as:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-semibold">
            <div className="p-3 bg-white dark:bg-slate-950 border border-indigo-500/15 rounded-lg space-y-1">
              <span className="text-[9px] font-mono font-white text-white text-white block uppercase tracking-wider font-extrabold pb-0.5">
                B2B: Supply to Registered Recipient
              </span>
              <p className="text-xs font-bold leading-normal text-white text-white">
                POS is the <span className="underline decoration-emerald-500 text-emerald-605 text-white font-bold">Location of such Registered Recipient</span>.
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 border border-indigo-500/15 rounded-lg space-y-1 font-bold">
              <span className="text-[9px] font-mono font-white text-white text-white block uppercase tracking-wider font-extrabold pb-0.5 animate-pulse">
                B2C: Supply to Unregistered Consumer
              </span>
              <p className="text-xs leading-normal text-white text-white">
                (a) POS is the <span className="underline decoration-indigo-500 text-white text-white font-white">recipient's address on record</span>. <br />
                (b) Reverts to the <span className="font-bold">location of the supplier</span> if no address is recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Specific Proxies 12(3) to 12(12) */}
        <div className="space-y-3 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white block p-0.5">Specific Rule Mapping: Sections 12(3) to 12(12)</span>
          
          <div className="overflow-x-auto rounded-xl border border-slate-205 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b dark:border-slate-850 border-slate-200 bg-slate-50 dark:bg-slate-905/60 text-[9px] font-mono uppercase text-white text-white font-white">
                  <th className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">Provision</th>
                  <th className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">Service Categories Included</th>
                  <th className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">Tax Treatment - Business to Business (B2B)</th>
                  <th className="py-2.5 px-3">Tax Treatment - Business to Consumer (B2C)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 font-semibold text-white text-white">
                
                {/* 12(3) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(3)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Immovable Property Linked</span>
                    Architects, surveyors, lodging/hotel, venue bookings for parties.
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-250 bg-slate-500/5">
                    <span className="text-white text-white">Where property is situated</span>. If property is located outside India, POS is recipient's registered location.
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-white text-white">Where property is situated</span>. If property is located outside India, POS is recipient's recorded address.
                  </td>
                </tr>

                {/* 12(4) */}
                <tr className="hover:bg-slate-500/5 bg-slate-50 dark:bg-slate-905/20 font-bold">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(4)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Personal Performance Services</span>
                    Restaurant, catering, personal grooming, fitness, cosmetic/plane surgeries.
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 font-extrabold text-white text-white">
                    Place of ACTUAL PHYSICAL PERFORMANCE (No B2B concessions. Always where cooked/cut/treated!)
                  </td>
                </tr>

                {/* 12(5) */}
                <tr className="hover:bg-slate-505/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(5)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Training & Appraisal</span>
                    Professional courses, employee reviews, competency training.
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    Location of such <span className="text-white text-white font-bold font-extrabold pb-0.5">Registered Recipient</span>.
                  </td>
                  <td className="py-2.5 px-3 text-white text-white">
                    Location where training is physically performed.
                  </td>
                </tr>

                {/* 12(6) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(6)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Admission of Event Entry</span>
                    Amusement parks, museums, sports, educational, or entertainment entry fees.
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 font-bold text-white text-white">
                    Where the event is physically held OR where structure is located.
                  </td>
                </tr>

                {/* 12(7) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(7)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Organization of Events</span>
                    Exhibition setups, conference management, wedding planning.
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    Location of such <span className="text-white text-white font-extrabold">Registered Recipient</span>.
                  </td>
                  <td className="py-2.5 px-3">
                    Where the event is physically held. (If held outside India, POS becomes recipient's address).
                  </td>
                </tr>

                {/* 12(8) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(8)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Transportation of Goods</span>
                    Freight services, courier, speed-post.
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    Location of such <span className="text-white text-white font-bold">Registered Recipient</span>.
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white text-white">
                    Where the goods are handed over for transportation.
                  </td>
                </tr>

                {/* 12(9) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(9)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Passenger Cargo / Carriage</span>
                    Airline tickets, train pass, bus logistics.
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    Location of such <span className="text-white text-white font-bold font-semibold">Registered Recipient</span>.
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    Where the passenger embarks on the continuous journey. <br />
                    <span className="text-[10px] text-white text-white font-white">Exam Proviso: Return leg is treated as a separate journey u/s 12(9).</span>
                  </td>
                </tr>

                {/* 12(11) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(11)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Telecommunications</span>
                    Broadband, postpaid/prepaid mobile SIMs, leased internet lines.
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-white text-white">
                    <ol className="list-decimal pl-4 text-[11px] space-y-0.5 font-semibold">
                      <li><strong>Fixed lines/DTH:</strong> Where device/dish is physically installed.</li>
                      <li><strong>Postpaid:</strong> Billing address of recipient.</li>
                      <li><strong>Prepaid:</strong> Agent sales point, or internet digital recharge page.</li>
                    </ol>
                  </td>
                </tr>

                {/* 12(12) */}
                <tr className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px]">
                    Sec 12(12)
                  </td>
                  <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                    <span className="font-extrabold block text-white text-white">Banking & Brokerage</span>
                    Processing fees, ATM convenience charge, trading transactions.
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-white text-white">
                    Location of the Recipient of service on supplier records. <br />
                    <span className="text-[10px] text-white text-white italic font-white">If not on record, falls back to the static Location of the Bank/Supplier.</span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 13: INTERNATIONAL SERVICES SUPPLY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1.5 border-b border-slate-205 dark:border-slate-850">
          <div className="h-5.5 w-5.5 rounded-md bg-indigo-500/10 text-white text-white flex items-center justify-center shrink-0 font-mono text-xs font-white">
            13
          </div>
          <div>
            <h4 className="text-xs font-white uppercase text-white text-white tracking-wider">
              Section 13: POS of Services (Where Supplier OR Recipient is Outside India)
            </h4>
            <p className="text-[10px] text-white font-medium">Critical cross-border parameters matching digital indicators and physical repair exceptions</p>
          </div>
        </div>

        {/* Section 13(2) Default rule */}
        <div className="p-4 bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/25 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-white text-white text-white uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/15">
              Section 13(2) - THE CROSS-BORDER FALLBACK
            </span>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-white text-white leading-relaxed">
            For general international service models, the default Place of Supply is the <span className="font-bold underline text-white text-white">Location of the Recipient of Service</span>. If the location of the recipient is not available in the ordinary course of business, the POS reverts directly to the <span className="font-white text-white text-white">Location of the Supplier</span>.
          </p>
        </div>

        {/* The Crucial Section 13 High-Yield Cases */}
        <div className="space-y-4">
          
          {/* Performance Services - Sec 13(3) */}
          <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-205 dark:border-slate-800 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b dark:border-slate-800 border-slate-105">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-white text-white text-white uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-505/15">
                  Section 13(3)
                </span>
                <strong className="text-xs font-white uppercase text-white text-white tracking-wider">
                  Performance-Linked Services Option
                </strong>
              </div>
              <span className="text-[8px] font-mono text-white text-white font-extrabold uppercase tracking-wider bg-rose-500/10 px-1.5 py-0.5 rounded">
                Physical Performance Matrix
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5 font-semibold text-xs leading-relaxed">
                <p className="text-white text-white">
                  <strong className="text-white text-white block pb-0.5 font-bold uppercase tracking-wider text-[9px]">
                    (a) Services in Respect of Physical Goods
                  </strong>
                  Goods must be made physically available by the recipient to the supplier key. POS is where the services are <span className="underline decoration-indigo-500/30 text-white text-white font-white">actually performed</span>.
                </p>
                
                {/* Proviso repair exemption */}
                <div className="p-3 bg-emerald-500/5 rounded border border-emerald-500/15 font-semibold mt-1">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-white text-white block font-white mb-1">
                    💡 TEMPORARY IMPORT REPAIR EXEMPTION (HIGH-YIELD MCQ)
                  </span>
                  <p className="text-[10px] text-white text-white font-bold leading-normal">
                    If goods are imported solely for repairs, treatment, or process and subsequently exported back without any local use in India (except what is indispensable for repairs), the physical performance test u/s 13(3)(a) is <span className="font-extrabold uppercase text-white text-white bg-emerald-500/10 px-1.2 py-0.2 rounded text-[9px]">BYPASSED</span>. POS reverts u/s 13(2) to the <span className="font-bold text-white text-white">Location of the Recipient (Outside India)</span>, rendering the work zero-rated.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 font-semibold text-xs leading-relaxed flex flex-col justify-between">
                <p className="text-white text-white">
                  <strong className="text-white text-white block pb-0.5 font-bold uppercase tracking-wider text-[9px]">
                    (b) Personal Performance Services
                  </strong>
                  Services supplied to an individual which require the physical presence of the recipient (e.g. skin treatments, diagnostic checkups, medical surgeries). POS is <span className="font-white text-white text-white">where physically executed</span>.
                </p>
                <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-150 dark:border-slate-800 text-[10px] text-white">
                  <strong>General Note:</strong> If services are performed remotely using electronic means, the physical performance criteria still maps to the primary site of physical delivery.
                </div>
              </div>
            </div>
          </div>

          {/* Specific Proxies 13(4) to 13(12) */}
          <div className="space-y-3 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-white text-white block p-0.5 font-bold">
              Specific Cross-Border Rule Matrix: Sections 13(4) to 13(12)
            </span>
            
            <div className="overflow-x-auto rounded-xl border border-slate-205 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b dark:border-slate-850 border-slate-200 bg-slate-50 dark:bg-slate-905/60 text-[9px] font-mono uppercase text-white text-white font-white">
                    <th className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">Provision</th>
                    <th className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">Service Categories Included</th>
                    <th className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">Place of Supply (POS) Rule</th>
                    <th className="py-2.5 px-3">High-Yield Exam Checkpoint & Statutory Provisos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-800 font-semibold text-white text-white">
                  
                  {/* 13(4) */}
                  <tr className="hover:bg-slate-500/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(4)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Immovable Property Linked</span>
                      Accommodation by hotels or guest houses, construction-related professional services, experts, legal advice on land titles, estate agents, grant of rights to use property.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="text-white text-white font-bold">Where the immovable property is situated</span> or intended to be situated physically.
                    </td>
                    <td className="py-2.5 px-3 text-white text-white">
                      If the property is situated inside India (even if partially), the entire POS is deemed to be in India u/s 13(6).
                    </td>
                  </tr>

                  {/* 13(5) */}
                  <tr className="hover:bg-slate-500/5 bg-slate-500/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(5)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Event Admission / Organisation</span>
                      Admission to, or organisation of cultural, artistic, sporting, scientific, educational, entertainment events, amusement parks, or other places and ancillary services.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="text-white text-white font-bold">Where the event is physically held</span>.
                    </td>
                    <td className="py-2.5 px-3 text-white text-white">
                      Unlike Sec 12, there is no B2B recipient billing address exception. If held outside India, the transaction escapes Indian GST net.
                    </td>
                  </tr>

                  {/* 13(6) */}
                  <tr className="hover:bg-slate-505/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(6)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Multi-Location Performance Override</span>
                      Services referred to in sub-section (3), (4) or (5) supplied at more than one location.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 text-white text-white font-extrabold">
                      Taxable Territory (India) Override
                    </td>
                    <td className="py-2.5 px-3 text-white text-white">
                      If at least one of the locations of performance, event, or property is in India, <span className="font-bold underline text-white text-white">POS is u/s 13(6) deemed to be in India wholly</span>. Preventative provision against tax evasion.
                    </td>
                  </tr>

                  {/* 13(7) */}
                  <tr className="hover:bg-slate-505/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(7)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Multi-State / UT Allocation</span>
                      Services referred to in sub-section (3), (4) or (5) supplied in more than one State or UT in India.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-bold text-white text-white">Proportionately allocated across States/UTs</span>.
                    </td>
                    <td className="py-2.5 px-3 text-white text-white">
                      Apportioned based on the terms of the contracts/agreements, or in their absence, on a reasonable basis (pursuant to Rule 5 of Integrated GST Rules).
                    </td>
                  </tr>

                  {/* 13(8) */}
                  <tr className="hover:bg-slate-500/5 bg-rose-500/[0.02]">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(8)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Intermediary & Banking Override</span>
                      (a) Services supplied by a banking co / NBFC to account holders, (b) Intermediary services, (c) Hiring of means of transport (excluding aircraft/vessels) up to 1 month.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 text-white text-white font-extrabold">
                      Location of the Supplier (LOS) in India
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-rose-605 text-white text-[11px]">
                      <span className="font-extrabold block text-white mb-0.5">⚠️ INTERMEDIARY TRAP:</span>
                      An agency in India facilitating export sales for an overseas principal gets commission. POS is in India (LOS) under Sec 13(8)(b). Thus, it is <span className="underline font-bold decoration-rose-500/30">subject to 18% IGST</span> and does not qualify as export!
                    </td>
                  </tr>

                  {/* 13(9) */}
                  <tr className="hover:bg-slate-500/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(9)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Transportation of Goods</span>
                      Carriage services of cargo/freight (excluding mail or courier).
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 text-white text-white font-extrabold text-[11px]">
                      Location of Recipient (Post-Amendment Fallback u/s 13(2))
                    </td>
                    <td className="py-2.5 px-3 text-white text-white">
                      <strong className="text-white text-white block text-[9px] uppercase font-white tracking-wider mb-0.5 flex items-center gap-1 animate-pulse">
                        🔥 2023 STATUTORY OMISSION (HIGHLY CRITICAL FOR EXAMS)
                      </strong>
                      Sec 13(9) was <span className="underline decoration-amber-500 font-extrabold">Omitted</span> by the IGST (Amendment) Act, 2023 w.e.f. 1-10-2023. Previously, POS was the destination of goods. Now, it falls back to the general rule of <span className="font-extrabold text-white text-white">Section 13(2) (Location of Recipient)</span>.
                    </td>
                  </tr>

                  {/* 13(10) */}
                  <tr className="hover:bg-slate-500/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(10)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Passenger Transportation</span>
                      Airlines, cruise lines, luxury international bus links, continuous routes.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="text-white text-white font-bold">Where passenger embarks</span> on continuous journey.
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-white text-white">
                      If booking a return, the flight back operates as a separate continuous journey u/s 13(10) with its own embarking point (e.g. Frankfurt → Mumbai matches POS Frankfurt).
                    </td>
                  </tr>

                  {/* 13(11) */}
                  <tr className="hover:bg-slate-500/5">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(11)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">Services On Board Conveyance</span>
                      In-flight gourmet dining, onboard movie screening, Wi-Fi connections provided wholly on-board.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="text-white text-white font-extrabold">First scheduled point of departure</span> of that conveyance.
                    </td>
                    <td className="py-2.5 px-3 text-white text-white">
                      Does not use "place where taken on board" (which is used in Section 10(1)(e) for goods). The takeoff runway or departure harbor governs cross-border services wholly.
                    </td>
                  </tr>

                  {/* 13(12) */}
                  <tr className="hover:bg-slate-500/5 bg-indigo-500/[0.01]">
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 font-mono text-white text-white text-[11px] font-bold">
                      Sec 13(12)
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205">
                      <span className="font-extrabold block text-white text-white">OIDAR Cloud Services</span>
                      Software-as-a-Service (SaaS), movie/music streaming (Netflix, Spotify), automated web-hosting, digital server database retrievals.
                    </td>
                    <td className="py-2.5 px-3 border-r dark:border-slate-800 border-slate-205 text-white text-white font-extrabold">
                      Location of the Recipient of Services
                    </td>
                    <td className="py-2.5 px-3 text-white text-white text-[11px]">
                      Deemed in taxable territory if any <span className="font-white text-white text-white underline">two non-contradictory</span> physical signals match India: Billing address, IP, Credit Card bank, country SIM code, or fixed phone line location.
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Unified Exam Checkpoints / Traps Section */}
      <div className="p-4 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-2">
        <h5 className="text-[11px] font-mono font-white text-white text-white uppercase tracking-widest flex items-center gap-1">
          <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" />
          Senior Educator Notes: Unified Exam Checkpoints
        </h5>
        <ul className="list-disc pl-5 text-xs text-white/80 text-white/90 space-y-1.5 font-bold leading-normal">
          <li>
            <strong>Bill-to-Ship-to Dual Tax Trap u/s 10(1)(b):</strong> Remember that there are legally TWO distinct transactions. One is a deemed transaction mapped to the principal place of business of the directing third party (IGST/CGST depends on Third Party LOS vs Supplier LOS). One subsequent transaction applies from Third Party to the target.
          </li>
          <li>
            <strong>Return Journey continuous leg u/s 12(9):</strong> A return tour booked on a single consolidated carriage ticket does NOT shift both legs to the outbound origin. The return leg has its own discrete embarking location (e.g. Kolkata back to Patna has POS Kolkata).
          </li>
          <li>
            <strong>Intermediary services u/s 13(8):</strong> A marketing broker in Mumbai helps an American corporate secure sales in Delhi. Since the broker is located in India, the intermediary rule u/s 13(8) places POS in India (Mumbai). It is <span className="underline font-extrabold text-white text-white">not an export of service</span>, and full 18% IGST applies.
          </li>
        </ul>
      </div>

    </div>
  );
}

function PlaceOfSupplyHighFidelityViewObsolete() {
  const [subTab, setSubTab] = useState<'simulator' | 'matrix' | 'exceptions'>('simulator');
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const cases = [
    {
      id: "case-1",
      section: "Sec 10(1)(a) IGST",
      title: "Goods involving Physical Movement",
      type: "Goods (Domestic)",
      scenario: "Tata Steel in Jamshedpur (Jharkhand) dispatches customized steel girders to a B2B constructing client (L&T) registered in Patna (Bihar) for concrete railway bridge erection.",
      supplier: "Jamshedpur, Jharkhand",
      recipient: "Patna, Bihar (Registered)",
      deliveryTerm: "Goods are shipped via train cargo and terminate at Patna, Bihar",
      pos: "Patna (Bihar)",
      taxType: "Inter-State IGST (Jharkhand → Bihar)",
      explanation: "Place of Supply is the location of the goods at the time where the movement of goods terminates for delivery to the recipient. Since movement terminates in Patna, POS is Patna.",
      trap: "Billing address of L&T head office in Mumbai is irrelevant. Only the physical termination location u/s 10(1)(a) governs physical goods dispatch."
    },
    {
      id: "case-2",
      section: "Sec 10(1)(b) IGST",
      title: "'Bill-to-Ship-to' 3-Party Sales",
      type: "Goods (Domestic)",
      scenario: "Apollo Tyres (Gurgaon, Haryana) delivers truck tyres to a plant in Chennai (Tamil Nadu) on instructions of MRF Corp whose principal place of business is Jodhpur (Rajasthan).",
      supplier: "Gurgaon, Haryana",
      recipient: "Jodhpur, Rajasthan (Deemed Buyer)",
      deliveryTerm: "Delivered to Chennai (Tamil Nadu) plant on directions of Jodhpur entity",
      pos: "Jodhpur (Rajasthan)",
      taxType: "Inter-State IGST (Haryana → Rajasthan)",
      explanation: "Under Section 10(1)(b), where goods are delivered to a recipient on direction of a third person, it is deemed that such third person has received the goods. The place of supply is the principal place of business of that third person.",
      trap: "This is a dual-stage transaction. The first movement (Apollo to MRF) is Inter-State (IGST) mapped to Rajasthan. The subsequent virtual sale is from MRF (Jodhpur) to Chennai, which is also an inter-State transaction."
    },
    {
      id: "case-3",
      section: "Sec 12(2) IGST",
      title: "Default Services (Domestic)",
      type: "Services (Domestic)",
      scenario: "An IT advisory enterprise located in Mumbai provides advanced firewall optimization systems via remote cloud console to an automobile hub registered in Pune (Maharashtra).",
      supplier: "Mumbai, Maharashtra",
      recipient: "Pune, Maharashtra (Registered B2B)",
      deliveryTerm: "Remote services provided over centralized encrypted VPN tunnel",
      pos: "Pune (Maharashtra)",
      taxType: "Intra-State CGST + SGST (Maharashtra)",
      explanation: "For domestic supply of services, Section 12(2) provides the default proxy: (a) If made to a registered person (B2B), the Place of Supply is the location of such registered person.",
      trap: "If the recipient was unregistered (B2C) and had no billing address on record, the Place of Supply would revert to Mumbai (Supplier location), changing the tax nature to Intra-State."
    },
    {
      id: "case-4",
      section: "Sec 12(3) IGST",
      title: "Immovable Property Consultancy",
      type: "Services (Domestic)",
      scenario: "A star interior designer in Jaipur (Rajasthan) is commissioned by a Delhi promoter to decorate a seaside premium cottage located in Panaji (Goa).",
      supplier: "Jaipur, Rajasthan",
      recipient: "New Delhi (B2B Registered)",
      deliveryTerm: "Services directly related to the design and layout of physical real estate in Goa",
      pos: "Panaji (Goa)",
      taxType: "Inter-State IGST (Rajasthan → Goa)",
      explanation: "Place of Supply of services directly in relation to an immovable property (or lodging/accommodation) is the location where the property is situated or intended to be situated.",
      trap: "Even though both Supplier and Recipient are registered in Rajasthan/Delhi, since the immovable property resides in Goa, the tax collected is Goa IGST. It cannot be localized."
    },
    {
      id: "case-5",
      section: "Sec 12(4) IGST",
      title: "Personal Performance Services",
      type: "Services (Domestic)",
      scenario: "A registered five-star catering company from Noida (Uttar Pradesh) provides food and premium service at a corporate lounge in Mumbai (Maharashtra) for an overseas delegation dinner.",
      supplier: "Noida, Uttar Pradesh",
      recipient: "Noida, Uttar Pradesh (B2B Client)",
      deliveryTerm: "Catering services physically executed and consumed on-site in Mumbai",
      pos: "Mumbai (Maharashtra)",
      taxType: "Inter-State IGST (Uttar Pradesh → Maharashtra)",
      explanation: "Under Section 12(4), for restaurant, catering, personal grooming, fitness, and cosmetic surgery services, the Place of Supply is where the services are physically performed.",
      trap: "Performance-linked rules have NO B2B registry relief! Even though Noida client is registered in UP, the POS remains strictly in Mumbai where the catering actually occurred."
    },
    {
      id: "case-6",
      section: "Sec 12(9) IGST",
      title: "Passenger transportation return ticketing",
      type: "Services (Domestic)",
      scenario: "A student from Patna (Bihar) buys a round-trip air flight ticket from IndiGo Airlines (Delhi) to travel from Patna to Kolkata and return from Kolkata to Patna.",
      supplier: "New Delhi (Airline Registry)",
      recipient: "Patna, Bihar (Unregistered B2C)",
      deliveryTerm: "Inbound: Patna → Kolkata; Return: Kolkata → Patna",
      pos: "Inbound: Patna (Bihar) | Return: Kolkata (West Bengal)",
      taxType: "Patna Leg: IGST / CGST+SGST Bihar | Kolkata Leg: IGST / CGST+SGST WB",
      explanation: "For unregistered passenger carriage, POS is where passenger embarks for continuous journey. Proviso: A return journey is legally treated as a separate journey u/s 12(9) even if a consolidated round-trip ticket is booked.",
      trap: "Many students err by naming Patna as the singular POS for everything. For the return journey, the passenger embarks in Kolkata; thus, Kolkata is distinct POS."
    },
    {
      id: "case-7",
      section: "Sec 13(3)(a) Proviso",
      title: "Temporary Importation (Repair Exemption)",
      type: "Services (Cross-Border)",
      scenario: "A high-precision biomedical lab in Bangalore, Karnataka receives damaged pacemaker devices from a client in Zurich (Germany), recalibrates them, and ships them exporter parts back without domestic use.",
      supplier: "Bangalore, Karnataka",
      recipient: "Zurich, Germany (Overseas)",
      deliveryTerm: "Temporary imported units, repaired, tested, and returned to client",
      pos: "Zurich (Germany) - Outside India",
      taxType: "Export / Zero-Rated Supply (0% IGST)",
      explanation: "Section 13(3)(a) sets POS of services performed on physical goods at the performance site. However, the proviso grants a critical exception: if goods are temporarily imported solely for repair or treatment and subsequently exported without local use, POS is Recipient's location u/s 13(2).",
      trap: "If the pacemakers are tested or used on Indian patients even for one afternoon before export, repair exemption is lost! The POS becomes Bangalore u/s 13(3)(a) and regular GST applies."
    },
    {
      id: "case-8",
      section: "Sec 13(12) IGST",
      title: "OIDAR Cloud Subscription",
      type: "Services (Cross-Border)",
      scenario: "An independent tax analyst in Chennai subscribes to a tax database hosted in New York, USA, paying via his Indian debit card.",
      supplier: "New York, USA",
      recipient: "Chennai, Tamil Nadu (B2C NTOR)",
      deliveryTerm: "Online digital database retrieval and software-as-a-service stream",
      pos: "Chennai (Tamil Nadu)",
      taxType: "IGST paid directly (USA supplier registers in India and pays forward charge)",
      explanation: "For OIDAR digital services u/s 13(12), the Place of Supply is the location of the recipient. The recipient is deemed to be in taxable territory (India) since 2 conditions (Indian card, Chennai IP) are met.",
      trap: "Normally cross-border services to unregistered persons are tax-exempt (import exclusions), but OIDAR is a major exception. Because the recipient is an unregistered consumer (NTOR), reverse charge is impossible; the foreign entity must register globally in India to pay tax."
    }
  ];

  const current = cases[selectedCase];

  return (
    <div className="space-y-6 font-sans w-full animate-in fade-in duration-200">
      {/* Tab Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl dark:bg-slate-900/40 bg-slate-50 border dark:border-slate-800/80 border-slate-205">
        <div>
          <h4 className="text-[13px] font-white text-white text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="h-4 w-4 text-white" />
            Place of Supply (POS) Interactive Blueprint
          </h4>
          <p className="text-[10px] text-white font-semibold mt-0.5">Perfecting critical physical movement vs service destination rules (IGST Sec 10 - 13)</p>
        </div>

        <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-950 p-1 rounded-lg border dark:border-slate-800/60 border-slate-200">
          <button
            onClick={() => setSubTab('simulator')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'simulator' 
                ? 'bg-indigo-600 text-white shadow-xs font-white' 
                : 'text-white hover:text-white dark:hover:text-white'
            }`}
          >
            Case Simulator
          </button>
          <button
            onClick={() => setSubTab('matrix')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'matrix' 
                ? 'bg-indigo-600 text-white shadow-xs font-white' 
                : 'text-white hover:text-white dark:hover:text-white'
            }`}
          >
            Statutory Matrix
          </button>
          <button
            onClick={() => setSubTab('exceptions')}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'exceptions' 
                ? 'bg-indigo-600 text-white shadow-xs font-white' 
                : 'text-white hover:text-white dark:hover:text-white'
            }`}
          >
            Critical Exam traps
          </button>
        </div>
      </div>

      {subTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Simulator Case List (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="text-[9px] font-mono uppercase tracking-widest font-white text-white block px-1">Select A Real-World Test Scenario</span>
            <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
              {cases.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col gap-1 w-full ${
                    selectedCase === idx 
                      ? 'border-indigo-500/40 dark:bg-indigo-950/20 bg-indigo-50/40 shadow-xs' 
                      : 'dark:bg-slate-950 bg-white border-slate-205 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-705'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest leading-none bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      {c.section}
                    </span>
                    <span className="text-[8px] font-mono text-white text-white font-semibold">{c.type}</span>
                  </div>
                  <strong className="text-xs font-extrabold text-white text-white truncate mt-1">
                    {c.title}
                  </strong>
                  <p className="text-[10px] text-white text-white font-semibold truncate leading-normal">
                    {c.scenario}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Outcome Board (Right) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-5 rounded-2xl border dark:border-slate-800 border-slate-205 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-3 border-b dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <strong className="text-xs font-white uppercase text-white text-white tracking-wider">
                    Place of Supply Audit Report
                  </strong>
                </div>
                <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-white text-white uppercase border border-emerald-500/15">
                  Tax Determinant: Ready
                </span>
              </div>

              {/* Story */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border dark:border-slate-800 border-slate-100">
                <span className="text-[9px] font-mono uppercase tracking-wider text-white block mb-1">Interactive Scenario Storyboard</span>
                <p className="text-xs text-white text-white font-semibold leading-relaxed">
                  "{current.scenario}"
                </p>
              </div>

              {/* Physical Audit Trail Flow */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border dark:border-slate-800/60 border-slate-200/60 relative overflow-hidden">
                <span className="text-[9px] font-mono uppercase tracking-wider text-white block mb-3">Statutory Destination Tracing</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center relative z-10">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 text-center">
                    <span className="text-[8px] font-mono uppercase text-white text-white block">1. Supplier Location</span>
                    <strong className="text-xs text-white text-white block truncate mt-0.5">{current.supplier}</strong>
                  </div>

                  <div className="hidden sm:flex justify-center text-white text-center">
                    <span className="text-xs font-bold text-white font-mono">Mapped ➔</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 text-center">
                    <span className="text-[8px] font-mono uppercase text-white text-white block">2. Recipient Location / Hub</span>
                    <strong className="text-xs text-white text-white block truncate mt-0.5">{current.recipient}</strong>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t dark:border-slate-800/80 border-slate-200 select-none">
                  <div className="flex items-start gap-2 text-[10px] text-white">
                    <MapPin className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white text-white block">Physical Delivery Termination Condition:</span>
                      <span className="font-semibold italic text-white text-white">{current.deliveryTerm}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place of Supply Verdict */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
                  <span className="text-[8px] font-mono uppercase text-white text-white block tracking-widest font-extrabold pb-0.5">Calculated Place Of Supply</span>
                  <strong className="text-sm font-white text-white text-white">{current.pos}</strong>
                  <span className="text-[9px] font-semibold text-white text-white block mt-1 leading-none">{current.section}</span>
                </div>

                <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                  <span className="text-[8px] font-mono uppercase text-white text-white block tracking-widest font-extrabold pb-0.5">GST Tax Classification</span>
                  <strong className="text-sm font-white text-white text-white">{current.taxType}</strong>
                  <span className="text-[9px] font-semibold text-white text-white block mt-1 leading-none">Statutory Tariff Applied</span>
                </div>
              </div>

              {/* Explanation Text */}
              <div className="space-y-1 pl-1">
                <span className="text-[8px] font-mono text-white font-extrabold uppercase block tracking-wider">Statutory Case Analysis</span>
                <p className="text-xs text-white text-white font-bold leading-relaxed">
                  {current.explanation}
                </p>
              </div>
            </div>

            {/* Exam Trap */}
            <div className="p-4 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-3 mt-4">
              <AlertTriangle className="h-4.5 w-4.5 text-white shrink-0 mt-0.5" />
              <div className="space-y-1 select-none">
                <span className="text-[9px] font-mono font-white text-white text-white uppercase tracking-widest block leading-none">⚠️ Critical Exam Trap / Student Blind Spot</span>
                <p className="text-xs text-white/80 text-white/90 font-bold leading-normal">
                  {current.trap}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'matrix' && (
        <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border dark:border-slate-800 border-slate-205 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b dark:border-slate-800 border-slate-200">
            <div>
              <strong className="text-xs font-white uppercase text-white text-white tracking-wider block">Unified Place of Supply Statutory Reference Grid</strong>
              <span className="text-[10px] text-white font-semibold">Perfect academic reference summarizing goods vs services u/s 10, 11, 12, 13 of the IGST Act</span>
            </div>
            <span className="text-[9px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-white text-white border border-indigo-500/10 font-mono tracking-wider font-extrabold uppercase">8 Definitive Mappings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900/40 bg-slate-50 text-[10px] font-mono uppercase text-white font-bold">
                  <th className="py-2.5 px-3">Statutory Provision</th>
                  <th className="py-2.5 px-3">Supply Context</th>
                  <th className="py-2.5 px-3">B2B Registered Recipient Treatment</th>
                  <th className="py-2.5 px-3">B2C Unregistered Consumer Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800 divide-slate-100 font-semibold text-white text-white">
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 10(1)(a) IGST</td>
                  <td className="py-3 px-3">Goods involving physical movement</td>
                  <td className="py-3 px-3">Where movement terminates for delivery</td>
                  <td className="py-3 px-3">Where movement terminates for delivery</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 10(1)(b) IGST</td>
                  <td className="py-3 px-3">Goods (3-Party Bill-to-Ship-to)</td>
                  <td className="py-3 px-3 text-white text-white font-extrabold">Principal Place of Business of 3rd person</td>
                  <td className="py-3 px-3">Principal Place of Business of 3rd person</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 11(a)/11(b)</td>
                  <td className="py-3 px-3">Goods (Cross-Border Import/Export)</td>
                  <td className="py-3 px-3">Import: Importer Location | Export: Outside India</td>
                  <td className="py-3 px-3">Import: Importer Location | Export: Outside India</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 12(2) IGST</td>
                  <td className="py-3 px-3">Default Services (Both in India)</td>
                  <td className="py-3 px-3 text-white text-white">Registered Recipient Location</td>
                  <td className="py-3 px-3">Recipient Address on Record, else Supplier's location</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 12(3) IGST</td>
                  <td className="py-3 px-3">Immovable Property / Lodging</td>
                  <td className="py-3 px-3">Where property situated (if outside India, Recipient location)</td>
                  <td className="py-3 px-3">Where property situated (if outside India, Recipient location)</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 12(4) IGST</td>
                  <td className="py-3 px-3">Performance (Catering, Beauty, etc.)</td>
                  <td className="py-3 px-3 font-extrabold text-white text-white">Where physically performed</td>
                  <td className="py-3 px-3 font-extrabold text-white text-white">Where physically performed</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 13(3)(a) IGST</td>
                  <td className="py-3 px-3">Cross-Border Services on physical goods</td>
                  <td className="py-3 px-3">Where performed (Zurich / repair country if exempted export)</td>
                  <td className="py-3 px-3">Where physically performed</td>
                </tr>
                <tr className="hover:bg-slate-500/5">
                  <td className="py-3 px-3 font-mono text-white text-white text-[11px]">Sec 13(12) IGST</td>
                  <td className="py-3 px-3">Cross-Border OIDAR subscription</td>
                  <td className="py-3 px-3 text-white text-white">Location of recipient (India)</td>
                  <td className="py-3 px-3">Location of recipient (Verified via 2/6 digital markers)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'exceptions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Continuous Journey card */}
          <div className="p-5 dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-205 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plane className="h-4.5 w-4.5 text-white shrink-0" />
                <strong className="text-xs font-white uppercase text-white text-white tracking-wider">
                  Passenger Carriage Continuous Journeys
                </strong>
              </div>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Under Section 12(9) and the continuous passenger carriage definitions, return journeys are treated as distinct independent journeys.
              </p>
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 border-slate-150 leading-relaxed text-[11px] font-semibold text-white text-white">
                <span className="text-white font-mono text-[9px] uppercase font-white block mb-1">Key Examiner Test Case</span>
                If booking Patna ➔ Mumbai (Embark Patna) and Mumbai ➔ Patna (Embark Mumbai), the Place of Supply for outbound leg is Bihar, while return leg POS is Maharashtra.
              </div>
            </div>
          </div>

          {/* Bill-to-Ship-to Principal Place */}
          <div className="p-5 dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-205 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4.5 w-4.5 text-white shrink-0" />
                <strong className="text-xs font-white uppercase text-white text-white tracking-wider">
                  Bill-to-Ship-to Dual IGST Transaction
                </strong>
              </div>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                Under Section 10(1)(b), physical delivery to the third party terminates movement, but legally we tax the first leg on Bill-To buyer principal place of business.
              </p>
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 border-slate-150 leading-relaxed text-[11px] font-semibold text-white text-white">
                <span className="text-white font-mono text-[9px] uppercase font-white block mb-1">Dual Invoice Flow</span>
                First bill goes to Third Person's location (and charging IGST mapping). Second virtual bill goes from Third Person to Actual Consignee.
              </div>
            </div>
          </div>

          {/* OIDAR Tax Destination */}
          <div className="p-5 dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-205 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-white shrink-0" />
                <strong className="text-xs font-white uppercase text-white text-white tracking-wider">
                  OIDAR Digital Location Indicators
                </strong>
              </div>
              <p className="text-xs text-white text-white leading-relaxed font-semibold">
                An overseas digital supplier is taxed u/s 13(12) if the recipient is in India. How is a user legally proved to reside in India?
              </p>
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 border-slate-150 leading-relaxed text-[11px] font-semibold text-white text-white">
                <span className="text-white font-mono text-[9px] uppercase font-white block mb-1">Two-Condition Audit Marker</span>
                (1) Indian billing address, (2) Indian credit/debit card, (3) Indian IP address, (4) Indian bank account, (5) Indian country SIM code, or (6) Fixed line. Any 2 must match.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface BlueprintViewProps {
  subjectId: SubjectId;
  activeTab: SubjectTabId;

  bookmarkedSections: BookmarkedSection[];
  onToggleBookmark: (section: BookmarkedSection) => void;
}

export default function BlueprintView({ subjectId, activeTab, bookmarkedSections, onToggleBookmark }: BlueprintViewProps) {
  const [blueprintSubTab, setBlueprintSubTab] = useState<'summaries' | 'formulas' | 'references'>('summaries');
  const [showSectionsOnlyFavorites, setShowSectionsOnlyFavorites] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);

  // Revision Video References Filter States
  const [refSearchQuery, setRefSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedRefChapter, setSelectedRefChapter] = useState<string>('all');

  // Protected PDF Reader Modal State
  const [readerState, setReaderState] = useState<{
    isOpen: boolean;
    chapterName: string;
    chapterNumber: number;
    chapterContentNode: React.ReactNode;
  }>({
    isOpen: false,
    chapterName: '',
    chapterNumber: 1,
    chapterContentNode: null
  });

  const renderChapterContentNode = (summary: any) => {
    if (!summary) return null;
    const filteredPrinciples = summary.keyPrinciples || [];

    if (summary.chapterName === 'Supply under GST') return <GstSupplyHighFidelityView />;
    if (summary.chapterName.includes('PGBP') || summary.chapterName.includes('Profits and Gains of Business')) return <PgbpHighFidelityView />;
    if (summary.chapterName === 'Tax Invoice, Credit & Debit Notes') return <TaxInvoiceHighFidelityView />;
    if (summary.chapterName === 'Place of Supply') return <PlaceOfSupplyHighFidelityView />;
    if (summary.chapterName === 'Time of Supply') return <TimeOfSupplyHighFidelityView />;
    if (summary.chapterName === 'Value of Supply') return <ValueOfSupplyHighFidelityView />;
    if (summary.chapterName === 'Exemptions from GST') return <ExemptionsHighFidelityView />;
    if (summary.chapterName.includes('Income from Other Sources')) return <IfosHighFidelityView />;
    if (summary.chapterName.includes('Basic Concepts')) return <BasicConceptsHighFidelityView />;
    if (summary.chapterName.includes('Exempt Incomes') || summary.chapterName.includes('Incomes which do not form part')) return <ExemptIncomesHighFidelityView />;
    if (summary.chapterName.includes('Capital Gains')) return <CapitalGainsHighFidelityView />;
    if (summary.chapterName === 'Interest Rate Risk Management') return <AfmInterestRateRiskHighFidelityView />;
    if (summary.chapterName === 'Security Valuation') return <AfmSecurityValuationHighFidelityView />;
    if (summary.chapterName === 'Securitization') return <AfmSecuritizationHighFidelityView />;
    if (summary.chapterName.includes('Ind AS 105') || summary.chapterName.includes('Held For Sale')) return <IndAS105HighFidelityView />;

    return (
      <div className="space-y-5">
        {filteredPrinciples.map((principle: any, pIdx: number) => (
          <div key={pIdx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <h4 className="font-display font-black text-slate-100 text-sm tracking-tight">{principle.title}</h4>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <ScannableText text={principle.description} chapterName={summary.chapterName} />
            </div>
            {principle.exception && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1">
                <span className="font-mono font-bold text-amber-300 text-[10px] uppercase block">Statutory Exception / Exception Clause:</span>
                <p className="text-slate-300 font-medium leading-relaxed">
                  <ScannableText text={principle.exception} chapterName={summary.chapterName} />
                </p>
              </div>
            )}
            {principle.example && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs space-y-1">
                <span className="font-mono font-bold text-indigo-300 text-[10px] uppercase block">Practical Case Scenario:</span>
                <p className="text-slate-300 font-medium leading-relaxed">
                  <ScannableText text={principle.example} chapterName={summary.chapterName} />
                </p>
              </div>
            )}
          </div>
        ))}
        {summary.visualBreakdown && (
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Layers className="h-4 w-4" /> Visual Breakdown: {summary.visualBreakdown.title}
            </h4>
            {summary.visualBreakdown.type === 'flow' ? (
              <InteractiveFlowchart title={summary.visualBreakdown.title} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-amber-400 font-bold uppercase tracking-wider font-mono border-b border-slate-800">
                    <tr>
                      {summary.visualBreakdown.headers?.map((h: string, i: number) => (
                        <th key={i} className="py-2.5 px-3 text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {summary.visualBreakdown.rows?.map((row: string[], rI: number) => (
                      <tr key={rI} className="hover:bg-slate-900/40">
                        {row.map((cell: string, cI: number) => (
                          <td key={cI} className={`py-2.5 px-3 ${cI === 0 ? 'font-mono text-amber-300 font-bold' : 'text-slate-300'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Custom statutory sections internal subtabs and search querying
  const [sectionsSubTab, setSectionsSubTab] = useState<'all' | 'sections' | 'rules' | 'schedules' | 'notifications'>('all');
  const [notificationsTopicFilter, setNotificationsTopicFilter] = useState<string>('all');
  const [sectionsSearchQuery, setSectionsSearchQuery] = useState('');
  const [limitsSearchQuery, setLimitsSearchQuery] = useState('');
  const [activeGlossaryRef, setActiveGlossaryRef] = useState<string | null>(null);

  // Formula Library & Session Notes States
  const [formulaSearchQuery, setFormulaSearchQuery] = useState('');
  const [formulaChapterFilter, setFormulaChapterFilter] = useState<string>('all');
  const [sessionNotes, setSessionNotes] = useState<string>(
    '# Active Study Notes & LaTeX Formula Scratchpad\n\n- Click "Copy LaTeX" or "To Notes" on any formula in the library to paste LaTeX code directly into your study session notes.\n'
  );
  const [copiedFormulaIdx, setCopiedFormulaIdx] = useState<number | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [isFormulaSidebarOpen, setIsFormulaSidebarOpen] = useState(true);
  const [sidebarFormulaSearch, setSidebarFormulaSearch] = useState('');

  const handleCopyLatex = (latex: string, index: number) => {
    const parsed = parseToLatex(latex);
    navigator.clipboard.writeText(parsed);
    setCopiedFormulaIdx(index);
    setCopiedToast(`Copied LaTeX: ${parsed}`);
    setTimeout(() => {
      setCopiedFormulaIdx(null);
      setCopiedToast(null);
    }, 2500);
  };

  const handleInsertIntoNotes = (formulaName: string, latex: string) => {
    const parsed = parseToLatex(latex);
    const snippet = `\n### ${formulaName}\n$$${parsed}$$\n`;
    setSessionNotes(prev => prev + snippet);
    setCopiedToast(`Inserted "${formulaName}" into Active Session Notes!`);
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleCopyAllNotes = () => {
    navigator.clipboard.writeText(sessionNotes);
    setCopiedToast('Copied all session notes to clipboard!');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleDownloadNotes = () => {
    const blob = new Blob([sessionNotes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subjectId}_Session_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    const handleRefClicked = (e: Event) => {
      const reference = (e as CustomEvent).detail?.reference;
      if (reference) {
        setActiveGlossaryRef(reference);
      }
    };
    window.addEventListener('statutory-reference-clicked', handleRefClicked);
    return () => {
      window.removeEventListener('statutory-reference-clicked', handleRefClicked);
    };
  }, []);

  const getFilteredLimits = () => {
    return limits.filter(item => {
      return (
        item.item.toLowerCase().includes(limitsSearchQuery.toLowerCase()) ||
        item.remarks.toLowerCase().includes(limitsSearchQuery.toLowerCase()) ||
        item.limitRate.toLowerCase().includes(limitsSearchQuery.toLowerCase())
      );
    });
  };

  const classifyStatutoryItem = (sec: { number: string; heading: string }): 'sections' | 'schedules' | 'notifications' | 'rules' => {
    const numLower = sec.number.toLowerCase();
    const headLower = sec.heading.toLowerCase();
    const isSched = numLower.includes('schedule') || numLower.includes('sch ') || numLower.includes('sch.') || numLower.includes('para ');
    const isNotif = numLower.includes('n/n') || numLower.includes('notification') || headLower.includes('notification') || numLower.includes('circular') || headLower.includes('circular') || numLower.includes('ftp') || headLower.includes('foreign trade policy');
    const isRuleAttr = (numLower.includes('rule') || headLower.includes('rule')) && !numLower.includes('sec') && !isNotif;
    if (isSched) return 'schedules';
    if (isNotif) return 'notifications';
    if (isRuleAttr) return 'rules';
    return 'sections';
  };

  const getStatutoryCategoryCounts = () => {
    const counts = { sections: 0, schedules: 0, scheduleParas: 0, rules: 0, notifications: 0 };
    sections.forEach(sec => {
      const cat = classifyStatutoryItem(sec);
      counts[cat]++;
      if (cat === 'schedules' && sec.subsections) {
        counts.scheduleParas += sec.subsections.length;
      }
    });
    return counts;
  };

  const getFilteredSections = () => {
    // First apply sub-tab filter
    let subTabFiltered = sections.filter(sec => {
      if (sectionsSubTab === 'all') return true;
      return classifyStatutoryItem(sec) === sectionsSubTab;
    });

    // If on notifications sub-tab, apply topic filter
    if (sectionsSubTab === 'notifications' && notificationsTopicFilter !== 'all') {
      subTabFiltered = subTabFiltered.filter(sec => {
        const fullText = (sec.number + ' ' + sec.heading + ' ' + sec.purpose + ' ' + (sec.subsections?.map(s => s.number + ' ' + s.heading + ' ' + s.purpose).join(' ') || '')).toLowerCase();
        switch (notificationsTopicFilter) {
          case 'levy':
            return fullText.includes('levy') || fullText.includes('composition') || fullText.includes('tolerate');
          case 'rcm':
            return fullText.includes('rcm') || fullText.includes('reverse charge');
          case 'exemptions':
            return fullText.includes('exemption') || fullText.includes('exempt');
          case 'time_value':
            return fullText.includes('time of supply') || fullText.includes('valuation') || fullText.includes('advance');
          case 'itc':
            return fullText.includes('itc') || fullText.includes('input tax credit') || fullText.includes('gstr-2b');
          case 'place_of_supply':
            return fullText.includes('place of supply') || fullText.includes('cross-border') || fullText.includes('export');
          case 'invoicing_eway':
            return fullText.includes('invoice') || fullText.includes('e-way') || fullText.includes('qr code');
          case 'registration_returns':
            return fullText.includes('registration') || fullText.includes('return') || fullText.includes('job work') || fullText.includes('qrmp') || fullText.includes('tcs') || fullText.includes('ondc');
          case 'demands_amnesty':
            return fullText.includes('demand') || fullText.includes('amnesty') || fullText.includes('128a') || fullText.includes('73') || fullText.includes('penalty') || fullText.includes('detention');
          case 'customs_ftp':
            return fullText.includes('customs') || fullText.includes('ftp') || fullText.includes('export promotion') || fullText.includes('re-import') || fullText.includes('project import');
          default:
            return true;
        }
      });
    }
    
    // Then apply search query if any
    const query = sectionsSearchQuery.toLowerCase().trim();
    if (!query) {
      return showSectionsOnlyFavorites
        ? subTabFiltered.filter(sec => bookmarkedSections.some(b => b.subjectId === subjectId && b.number === sec.number))
        : subTabFiltered;
    }
    
    return subTabFiltered.filter(sec => {
      const matchesQuery = 
        sec.number.toLowerCase().includes(query) ||
        sec.heading.toLowerCase().includes(query) ||
        sec.purpose.toLowerCase().includes(query) ||
        (sec.subsections && sec.subsections.some(sub => 
          sub.number.toLowerCase().includes(query) ||
          sub.heading.toLowerCase().includes(query) ||
          sub.purpose.toLowerCase().includes(query)
        ));
        
      if (!matchesQuery) return false;
      
      return showSectionsOnlyFavorites
        ? bookmarkedSections.some(b => b.subjectId === subjectId && b.number === sec.number)
        : true;
    });
  };

  const isSectionAlreadyBookmarked = (refNum: string): boolean => {
    return bookmarkedSections.some(b => b.number.toLowerCase().replace(/\s+/g, '') === refNum.toLowerCase().replace(/\s+/g, ''));
  };

  const getGlossaryRefDetails = (refStr: string) => {
    const cleanRef = refStr.toLowerCase().replace(/\s+/g, '');
    
    // Search in STATUTORY_SECTIONS
    const allSections = STATUTORY_SECTIONS[subjectId] || [];
    for (const sec of allSections) {
      const cleanNum = sec.number.toLowerCase().replace(/\s+/g, '');
      if (cleanNum === cleanRef || cleanNum.includes(cleanRef) || cleanRef.includes(cleanNum)) {
        return {
          title: sec.number,
          heading: sec.heading,
          purpose: sec.purpose,
          subitems: sec.subsections?.map(s => ({ title: s.number, content: s.heading + ": " + s.purpose })) || [],
          originalSection: sec
        };
      }
      
      if (sec.subsections) {
        for (const sub of sec.subsections) {
          const cleanSubNum = sub.number.toLowerCase().replace(/\s+/g, '');
          if (cleanSubNum === cleanRef || cleanSubNum.includes(cleanRef) || cleanRef.includes(cleanSubNum)) {
            return {
              title: sub.number,
              heading: sub.heading,
              purpose: sub.purpose,
              parentSection: sec.number + " - " + sec.heading,
              originalSection: {
                subjectId,
                number: sub.number,
                heading: sub.heading,
                purpose: sub.purpose
              }
            };
          }
        }
      }
    }
    
    // Search in LIMITS_RATES
    const allLimits = LIMITS_RATES[subjectId] || [];
    for (const lim of allLimits) {
      const cleanItem = lim.item.toLowerCase().replace(/\s+/g, '');
      if (cleanItem.includes(cleanRef) || cleanRef.includes(cleanItem)) {
        return {
          title: lim.item,
          heading: "Statutory Threshold / Limit Rate",
          purpose: lim.remarks,
          meta: lim.limitRate
        };
      }
    }
    
    return {
      title: refStr,
      heading: "Statutory Cross-Reference",
      purpose: `Referenced provision under ${subjectId} syllabus guidelines.`
    };
  };

  const refDetails = activeGlossaryRef ? getGlossaryRefDetails(activeGlossaryRef) : null;

  const renderGlossaryModal = () => {
    if (!activeGlossaryRef || !refDetails) return null;
    
    const isBookmarked = refDetails.originalSection 
      ? isSectionAlreadyBookmarked(refDetails.title)
      : false;
      
    return (
      <ModalPortal triggerKey={activeGlossaryRef}>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        onClick={() => setActiveGlossaryRef(null)}
      >
        <div 
          className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative flex flex-col max-h-[85vh] overflow-hidden animate-zoomIn text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-white border border-indigo-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-white block">
                  Interactive Reference Glossary
                </span>
                <h4 className="text-sm font-white font-mono text-white leading-tight">
                  {refDetails.title}
                </h4>
              </div>
            </div>
            
            <button
              onClick={() => setActiveGlossaryRef(null)}
              className="p-1 px-2 text-xs font-semibold text-white hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Content Body */}
          <div className="py-6 overflow-y-auto space-y-5 flex-1 min-h-0 pr-1 text-left">
            {refDetails.parentSection && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850/60 space-y-1">
                <span className="text-[9px] uppercase font-mono font-bold text-white block">
                  Parent Context
                </span>
                <div className="text-xs font-extrabold text-white">
                  {refDetails.parentSection}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-mono font-bold text-white block">
                Official Headnote & Concept
              </span>
              <h5 className="text-base font-white text-white leading-snug">
                {parseRichText(refDetails.heading)}
              </h5>
            </div>
            
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-mono font-bold text-white block">
                Statutory Summary / Remarks
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-white leading-relaxed font-semibold">
                {parseRichText(refDetails.purpose)}
              </div>
            </div>
            
            {refDetails.meta && (
              <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Applicable Rate / Limit:</span>
                <span className="text-sm font-white font-mono text-white">{refDetails.meta}</span>
              </div>
            )}
            
            {refDetails.subitems && refDetails.subitems.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-mono font-bold text-white block">
                  Associated Clauses & sub-sections
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {refDetails.subitems.map((sub: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 text-xs text-white">
                      <span className="font-bold text-white font-mono text-[10.5px] block mb-1">
                        {sub.title}
                      </span>
                      <p className="leading-relaxed font-semibold">{parseRichText(sub.content)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {refDetails.originalSection ? (
              <button
                type="button"
                onClick={() => {
                  onToggleBookmark(refDetails.originalSection as BookmarkedSection);
                }}
                className={`flex items-center gap-2 px-4 py-2 font-extrabold text-xs rounded-lg border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/15'
                    : 'bg-slate-950 border-slate-850 text-white hover:bg-slate-800'
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-rose-455 text-rose-455' : 'text-white'}`} />
                <span>{isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}</span>
              </button>
            ) : (
              <div />
            )}
            
            <button
              onClick={() => setActiveGlossaryRef(null)}
              className="px-5 py-2 font-white text-xs text-white bg-indigo-400 hover:bg-indigo-300 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              Dismiss Reference
            </button>
          </div>
        </div>
      </div>
      </ModalPortal>
    );
  };

  const summaries = CHAPTER_SUMMARIES[subjectId] || [];
  const formulas = FORM_ITEMS[subjectId] || [];
  const sections = STATUTORY_SECTIONS[subjectId] || [];
  const limits = LIMITS_RATES[subjectId] || [];

  const getCurrentChapterIndex = (chapterName: string): number => {
    return summaries.findIndex(s => s.chapterName === chapterName);
  };

  const handlePrevChapter = () => {
    if (summaries.length <= 1) return;
    if (selectedChapter === 'all') {
      setSelectedChapter(summaries[summaries.length - 1].chapterName);
    } else {
      const currentIdx = getCurrentChapterIndex(selectedChapter);
      if (currentIdx === 0) {
        setSelectedChapter('all');
      } else {
        setSelectedChapter(summaries[currentIdx - 1].chapterName);
      }
    }
  };

  const handleNextChapter = () => {
    if (summaries.length <= 1) return;
    if (selectedChapter === 'all') {
      setSelectedChapter(summaries[0].chapterName);
    } else {
      const currentIdx = getCurrentChapterIndex(selectedChapter);
      if (currentIdx === summaries.length - 1) {
        setSelectedChapter('all');
      } else {
        setSelectedChapter(summaries[currentIdx + 1].chapterName);
      }
    }
  };

  const filteredDropdownChapters = summaries.filter(s =>
    s.chapterName.toLowerCase().includes(chapterSearchQuery.toLowerCase())
  );

  const filteredSummaries = selectedChapter === 'all'
    ? summaries
    : summaries.filter(s => s.chapterName === selectedChapter);

  const convertOklToRgb = (colorStr: string): string => {
    if (!colorStr) return colorStr;
    const lower = colorStr.toLowerCase();
    if (!lower.includes('oklch') && !lower.includes('oklab') && !lower.includes('lab(') && !lower.includes('color-mix')) {
      return colorStr;
    }

    const parsePercentOrFloat = (valStr: string, maxVal: number = 1): number => {
      if (!valStr) return 0;
      const val = valStr.trim();
      if (val.endsWith('%')) {
        return (parseFloat(val) / 100) * maxVal;
      }
      return parseFloat(val) || 0;
    };

    const oklabToRgbString = (L: number, a: number, b: number, alpha: number = 1): string => {
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855414 * b;

      const l = l_ * l_ * l_;
      const m = m_ * m_ * m_;
      const s = s_ * s_ * s_;

      let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      let b_rgb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      r = Math.max(0, Math.min(1, r));
      g = Math.max(0, Math.min(1, g));
      b_rgb = Math.max(0, Math.min(1, b_rgb));

      const gamma = (x: number) => {
        return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
      };

      const R = Math.round(gamma(r) * 255);
      const G = Math.round(gamma(g) * 255);
      const B = Math.round(gamma(b_rgb) * 255);

      if (isNaN(R) || isNaN(G) || isNaN(B)) {
        return alpha < 1 ? `rgba(120, 120, 120, ${alpha})` : 'rgb(120, 120, 120)';
      }

      if (alpha === 1) {
        return `rgb(${R}, ${G}, ${B})`;
      } else {
        return `rgba(${R}, ${G}, ${B}, ${alpha})`;
      }
    };

    try {
      let replaced = colorStr;

      // Replace color-mix
      replaced = replaced.replace(/color-mix\([^)]+\)/gi, 'rgb(200, 200, 200)');

      // Replace oklch
      replaced = replaced.replace(/oklch\(([^)]+)\)/gi, (match, content) => {
        const parts = content.trim().split(/[\s,+/]+/);
        if (parts.length >= 3) {
          const L = parsePercentOrFloat(parts[0], 1);
          const c = parsePercentOrFloat(parts[1], 1);
          const hVal = parts[2];
          let h = 0;
          if (hVal.endsWith('rad')) {
            h = parseFloat(hVal) * 180 / Math.PI;
          } else if (hVal.endsWith('turn')) {
            h = parseFloat(hVal) * 360;
          } else if (hVal.endsWith('grad')) {
            h = parseFloat(hVal) * 360 / 400;
          } else {
            h = parseFloat(hVal) || 0;
          }
          const alpha = parts[3] ? parsePercentOrFloat(parts[3], 1) : 1;
          const rad = h * Math.PI / 180;
          const a = c * Math.cos(rad);
          const b = c * Math.sin(rad);
          return oklabToRgbString(L, a, b, alpha);
        }
        return 'rgb(120, 120, 120)';
      });

      // Replace oklab
      replaced = replaced.replace(/oklab\(([^)]+)\)/gi, (match, content) => {
        const parts = content.trim().split(/[\s,+/]+/);
        if (parts.length >= 3) {
          const L = parsePercentOrFloat(parts[0], 1);
          const a = parsePercentOrFloat(parts[1], 1);
          const b = parsePercentOrFloat(parts[2], 1);
          const alpha = parts[3] ? parsePercentOrFloat(parts[3], 1) : 1;
          return oklabToRgbString(L, a, b, alpha);
        }
        return 'rgb(120, 120, 120)';
      });

      // Replace lab
      replaced = replaced.replace(/lab\(([^)]+)\)/gi, 'rgb(120, 120, 120)');

      return replaced;
    } catch (e) {
      return 'rgb(120, 120, 120)';
    }
  };

  const exportElementToPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found.`);
      return;
    }

    const clone = element.cloneNode(true) as HTMLElement;

    // Remove buttons, inputs, select controls, and print-excluded elements from the clone
    const selectorsToExclude = ['button', 'input', 'select', '.no-print', '[title*="Save"]', '[title*="Export"]'];
    selectorsToExclude.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    const elementHtml = clone.outerHTML;
    printDirectlyAsPdf(filename, elementHtml);
  };

  const printDirectlyAsPdf = (filenamePart: string, bodyContent: string) => {
    exportToPdfEngine(filenamePart, bodyContent);
  };

  const handleExportChapterPDF = (summary: any, sIdx?: number) => {
    const subjectFullName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;
    const subjectCode = SUBJECTS_METADATA[subjectId]?.name || subjectId;
    const chapterNum = sIdx !== undefined ? sIdx + 1 : (getCurrentChapterIndex(summary.chapterName) + 1);
    const cleanChapterTitle = summary.chapterName.replace(/^(DT|IDT|AFM|FR|AUDIT|IBS)\s*-\s*/i, '');

    const targetId = sIdx !== undefined ? `chap-card-${sIdx}` : null;
    const liveCard = targetId ? document.getElementById(targetId) : null;

    let bodyHtml = '';

    if (liveCard) {
      const clone = liveCard.cloneNode(true) as HTMLElement;
      // Remove interactive buttons (Export PDF, tooltips, etc.)
      clone.querySelectorAll('button, .no-print, [title*="Export"], [id^="export-chap-"]').forEach(el => el.remove());

      bodyHtml = `
        <!-- TOP BRAND HEADER (DARK NAVY WITH GOLD BAR) -->
        <div class="pdf-top-header">
          <div class="pdf-header-left">
            <div class="pdf-brand-title">practACE</div>
            <div class="pdf-brand-sub">CA Final · ${subjectFullName}</div>
          </div>
          <div class="pdf-header-right">
            <div class="pdf-doc-title">CONCEPT FOCUS</div>
            <div class="pdf-doc-sub">Ch.${chapterNum} · ${cleanChapterTitle}</div>
          </div>
        </div>
        <div class="pdf-header-gold-bar"></div>

        <!-- LIVE CONCEPT FOCUS MIRROR CONTENT -->
        <div class="live-concept-focus-container space-y-6">
          ${clone.outerHTML}
        </div>
      `;
      printDirectlyAsPdf(cleanChapterTitle.replace(/\s+/g, '_') + '_Concept_Focus', bodyHtml);
      return;
    }

    const currentTimestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'long',
      timeStyle: 'medium'
    });

    const getFlowchartHtmlForPrint = (title: string): string => {
      switch (title) {
        case 'DT - Chapter 1: Undisclosed Income & 115BBE 78% Tax Flow':
          return `
            <div class="print-flowchart">
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Unexplained Transactions Detected u/s 68-69D</span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; margin-top: 8px; font-size: 8.5px; font-family: 'Inter', sans-serif;">
                  <div><strong>Sec 68:</strong> Cash Credits</div>
                  <div><strong>Sec 69:</strong> Unexplained Invest.</div>
                  <div><strong>Sec 69A:</strong> Unexplained Money</div>
                  <div><strong>Sec 69B:</strong> Understated Invest.</div>
                  <div><strong>Sec 69C:</strong> Unexplained Exps</div>
                  <div><strong>Sec 69D:</strong> Hundi Loan</div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #6366f1; background-color: #f5f3ff;">
                <span class="print-flowchart-badge" style="background-color: #ddd6fe; color: #5b21b6;">2. Section 115BBE statutory flat tax engine</span>
                <div style="text-align: left; margin-top: 8px; font-size: 9px; line-height: 1.4; font-family: 'Inter', sans-serif;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px;">
                    <span>Base Income Tax Rate:</span><span>60% Flat Rate</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px; margin-top: 3px;">
                    <span>Surcharge (25% on Tax):</span><span>15% Flat Rate</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px; margin-top: 3px;">
                    <span>Health & Education Cess (4% on Tax+SC):</span><span>3% Flat Rate</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-weight: 800; color: #b91c1c; margin-top: 6px; padding: 4px; background-color: #fee2e2; border-radius: 4px;">
                    <span>TOTAL EFFECTIVE TAX RATE:</span><span>78% FLAT RATE</span>
                  </div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #ef4444; background-color: #fef2f2;">
                <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">3. Strict statutory disallowance clawbacks</span>
                <p style="text-align: center; margin: 4px 0 0 0; font-size: 8.5px; line-height: 1.4; font-weight: 600; font-family: 'Inter', sans-serif;">
                  No basic exemption limit offset allowed u/s 115BBE. No standard trade deductions, expenses, or business loss offsets are set off under current legislation.
                </p>
              </div>
            </div>
          `;
        case 'DT - Chapter 2: Agricultural Apportionment & Integration Slabs':
          return `
            <div class="print-flowchart">
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Composite Agri-Business Income Allocation u/s Rules 7, 7A, 7B, 8</span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; margin-top: 8px; font-size: 8.5px; font-family: 'Inter', sans-serif;">
                  <div><strong>Tea Rule 8:</strong> 60% Agri / 40% Bus</div>
                  <div><strong>Rubber Rule 7A:</strong> 65% Agri / 35% Bus</div>
                  <div><strong>Coffee Grown Rule 7B(1):</strong> 75% Agri / 25% Bus</div>
                  <div><strong>Coffee Roasted Rule 7B(2):</strong> 60% Agri / 40% Bus</div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffbeb;">
                <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">2. Partial Integration Applicability Checklist</span>
                <div style="text-align: left; margin-top: 8px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
                  <div>✔ Net Agricultural Income u/s 2(1A) <strong>exceeds ₹5,000 p.a.</strong></div>
                  <div style="margin-top: 2px;">✔ Non-Agri Income <strong>exceeds Basic Exemption Limit</strong> (e.g. ₹4,00,000)</div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5;">
                <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">3. Step-by-Step Integration Tax Engine math</span>
                <div style="text-align: left; margin-top: 8px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
                  <div><strong>Step A:</strong> Calculate tax on standard sum: [Agri Income + Non-Agri Income]</div>
                  <div><strong>Step B:</strong> Calculate tax on exempt sum: [Agri Income + Basic Exemption Limit]</div>
                  <div style="font-weight: 800; color: #047857; margin-top: 4px; padding: 4px; background-color: #d1fae5; border-radius: 4px;">
                    NET PAYABLE TAX = [Step A Tax] - [Step B Tax]
                  </div>
                </div>
              </div>
            </div>
          `;
        case 'DT - Chapter 4: Capital Asset Exclusion & SOH Period Test':
          return `
            <div class="print-flowchart">
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Capital Asset Scope Test u/s 2(14)</span>
                <div style="text-align: left; margin-top: 4px; font-size: 8.5px; line-height: 1.35; font-family: 'Inter', sans-serif;">
                  <div><strong>Included:</strong> Mobiles, immovable property, corporate securities, jewelry, artwork, archaeological drawings.</div>
                  <div style="margin-top: 3px;"><strong>Excluded:</strong> Stock-in-trade, personal effects, gold deposit certificates, rural agricultural land.</div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5;">
                <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">2. Period of Holding (SOH) Slabs</span>
                <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.45; font-family: 'Inter', sans-serif;">
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">
                    <strong>12 Months Threshold:</strong> Listed equity shares, units of equity mutual funds, Zero Coupon Bonds.
                  </div>
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 3px;">
                    <strong>24 Months Threshold:</strong> Land or building (Immovable property), unlisted shares.
                  </div>
                  <div style="margin-top: 3px;">
                    <strong>36 Months Threshold:</strong> Debt mutual funds (prior to 1.4.23), gold, other assets.
                  </div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #ef4444; background-color: #fef2f2;">
                <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">3. Deemed Short Term Capital Asset (STCA) Exception</span>
                <p style="text-align: center; margin: 4px 0 0 0; font-size: 8.5px; line-height: 1.4; font-weight: 600; font-family: 'Inter', sans-serif;">
                  Debt Mutual Funds (acquired on/after 1.4.2023), Market Linked Debentures (MLDs), and unlisted bonds are statutorily deemed STCA regardless of holding period.
                </p>
              </div>
            </div>
          `;
        case 'DT - Chapter 5: Gift & Deemed Dividend Taxability Flow':
          return `
            <div class="print-flowchart">
              <div class="print-flowchart-card" style="border-color: #6366f1; background-color: #f5f3ff;">
                <span class="print-flowchart-badge" style="background-color: #ddd6fe; color: #5b21b6;">1. Deemed Dividend u/s 2(22)</span>
                <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">
                    <strong>Type (a) to (d):</strong> Asset distributions, preference bonus shares, capital reductions, liquidation.
                  </div>
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 3px;">
                    <strong>Type (e):</strong> Closely held company lending money to beneficial owner (≥10% voting seats) or substantial interest concern.
                  </div>
                  <div style="margin-top: 3px; font-weight: 600; color: #b91c1c;">
                    Capped up to accumulated profits balance. Repayment during PY cannot reduce taxability.
                  </div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffff7;">
                <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">2. Gifts & Transfers u/s 56(2)(x)</span>
                <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.45; font-family: 'Inter', sans-serif;">
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">
                    <strong>Sum of Money:</strong> Taxable if aggregate PY sum without consideration exceeds ₹50,000.
                  </div>
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 3px;">
                    <strong>Immovable Property:</strong> Without consideration if SDV exceeds ₹50,000. Inadequate: difference (SDV - Price) &gt; ₹50,000 AND &gt; 10% of Consideration.
                  </div>
                  <div style="margin-top: 3px;">
                    <strong>Movable Property (jewelry, shares, art):</strong> Taxable if aggregate under-price difference exceeds ₹50,000.
                  </div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5;">
                <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">3. Statutory Gift Exemptions</span>
                <p style="text-align: left; margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; font-family: 'Inter', sans-serif;">
                  Fully exempt u/s 56(2)(x) if received: from specified <strong>Relatives</strong> (spouse, siblings of self/spouse, parent siblings, lineal ascendants/descendants + spouses); on the occasion of <strong>Marriage</strong>; under <strong>Will or inheritance</strong>; or from registered <strong>Trusts u/s 12A/12AB</strong>.
                </p>
              </div>
            </div>
          `;
        case 'GST Supply Determination Flow':
          return `
            <div class="print-flowchart">
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 1: Core Ambit Screening Sec 2(52)/2(102)</span>
                <h5 style="margin: 4px 0; font-size: 9.5px; font-weight: 800; font-family: 'Inter', sans-serif;">Supply of Goods u/s 2(52) or Services u/s 2(102)?</h5>
                <p style="margin: 0; font-size: 8.5px; color: #ffffff; font-family: 'Inter', sans-serif;">Must represent movable property or conversion/use of money.</p>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 2: Consideration & Deeming Test Sec 7(1)(a)/(c)</span>
                <h5 style="margin: 4px 0; font-size: 9.5px; font-weight: 800; font-family: 'Inter', sans-serif;">Is a contractual Consideration charged?</h5>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px; font-family: 'Inter', sans-serif;">
                  <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; padding: 4px; font-size: 8px;">
                    <strong>YES:</strong> Taxable u/s 7(1)(a) / 7(1)(b)
                  </div>
                  <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; padding: 4px; font-size: 8px;">
                    <strong>NO:</strong> Only if covered under Schedule I
                  </div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 3: Commercial Intent Sec 7(1)(a)</span>
                <h5 style="margin: 4px 0; font-size: 9.5px; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif;">In Course or Furtherance of Business?</h5>
                <p style="margin: 0; font-size: 8.5px; color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;">Exception: Importation of services for consideration u/s 7(1)(b) is always taxable.</p>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
                <div class="print-flowchart-card" style="border-color: #f87171; background-color: #fef2f2; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">Schedule III Negative List</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;">
                    If listed under Schedule III (employee duties, funeral, sale of land, actionable claims other than lottery/betting), it's a non-supply.
                  </p>
                </div>
                <div class="print-flowchart-card" style="border-color: #34d399; background-color: #ecfdf5; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">Fully Taxable Supply</span>
                  <p style="margin: 4px 0 0 0; font-size: 8.5px; line-height: 1.35; text-align: left; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;">
                    Transaction meets all elements u/s 7(1). Subject to GST levy, credit ledger flow, and tax invoice compliance.
                  </p>
                </div>
              </div>
            </div>
          `;
        case 'GST Composition Levy & RCM Logic Flow':
          return `
            <div class="print-flowchart">
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 1: Preceding FY Aggregate Turnover Limit u/s 10(1)</span>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; margin-top: 6px; font-size: 8.5px; font-family: 'Plus Jakarta Sans', sans-serif;">
                  <div><strong>General States:</strong> Limit ≤ ₹1.5 Crore</div>
                  <div><strong>8 Special States:</strong> Limit ≤ ₹75 Lakh</div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div class="print-flowchart-card">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 2: Composition Levy Slabs & Rates u/s 10</span>
                <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.4; font-family: 'Plus Jakarta Sans', sans-serif;">
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;"> Manufacturers: 1% of State Turnover</div>
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 2px;"> Restaurant Services: 5% of State Turnover</div>
                  <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 2px;"> Traders: 1% of Taxable Supplies</div>
                  <div style="margin-top: 2px;"> Services Composition u/s 10(2A): 6% (Limit ≤ ₹50L preceding FY)</div>
                </div>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
                <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffbeb; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">Marginal Services Proviso</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;">
                    Goods composition supplier can provide services up to 10% of State Turnover in preceding FY or ₹5 Lakh (whichever is higher). Bank FD interest excluded.
                  </p>
                </div>
                <div class="print-flowchart-card" style="border-color: #ef4444; background-color: #fef2f2; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">Strict Restrictions Checklist</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <strong>Forbidden:</strong> Cannot collect tax from customers, cannot claim any ITC, cannot make inter-state outward supplies, cannot sell through ECO.
                  </p>
                </div>
              </div>
            </div>
          `;
        case 'GST Aadhaar Authentication & Verification pathways':
          return `
            <div class="print-flowchart">
              <div style="text-align: left; width: 100%; font-weight: bold; font-size: 10px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;">PATHWAY A: Aadhaar Authentication (Rule 10B/25)</div>
              <div class="print-flowchart-card" style="margin-top: 4px;">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Registration Opt-in</span>
                <p style="margin: 3px 0 0 0; font-size: 8.5px; font-family: 'Plus Jakarta Sans', sans-serif;">Applicant opts-in for Aadhaar Authentication during online registration u/s 25.</p>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
                <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">Authentication Success u/s 10B</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;">
                    Deemed Approved. Registration is granted within 7 working days. Physical verification of place of business can be completely waived unless high risk is flagged.
                  </p>
                </div>
                <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffbeb; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">Failure / Opt-out Rule 25</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;">
                    Physical verification of business premises is compulsory under Rule 25 before registration. Aadhaar biometric photo matching is required. Approval timeline is 30 days.
                  </p>
                </div>
              </div>
              
              <div style="text-align: left; width: 100%; font-weight: bold; font-size: 10px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; color: #374151; font-family: 'Plus Jakarta Sans', sans-serif;">PATHWAY B: Amendment Categories (Sec 28)</div>
              <div class="print-flowchart-card" style="margin-top: 4px;">
                <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. proper officer initial action u/s 28</span>
                <p style="margin: 3px 0 0 0; font-size: 8.5px; font-family: 'Plus Jakarta Sans', sans-serif;">Officer reviews registration details or requested amendments. SCN can be issued u/s 28.</p>
              </div>
              <div class="print-flowchart-arrow"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
                <div class="print-flowchart-card" style="border-color: #3b82f6; background-color: #eff6ff; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #dbeafe; color: #1e40af;">Core Fields Amendment</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                    Required fields like legal name, business address, directors. Requires proper officer approval in 15 working days.
                  </p>
                </div>
                <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5; max-width: 100%;">
                  <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">Non-Core Fields Amendment</span>
                  <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                    Contacts, other secondary info. Automatic direct system update, no physical officer action required.
                  </p>
                </div>
              </div>
            </div>
          `;
        default:
          return `<div class="diagram-container">${title} Flowchart Summary Information</div>`;
      }
    };

    bodyHtml = '';

    if (summary.chapterName === 'Supply under GST__DISABLED_FOR_LIVE_FLOW__') {
      // Elegant, complete, and live high-fidelity layout for the primary charging catalyst Supply under GST
      bodyHtml = `
        <div class="brand-header">
          <div>
            <h1 class="brand-title">Supply under GST - Revision Blueprint</h1>
            <p class="brand-sub">Subject Course: IDT | High-Fidelity Statutory Study Dossier</p>
          </div>
          <div class="export-meta">
            <div>Exported: ${currentTimestamp}</div>
            <div>Subject ID: IDT</div>
            <div>Status: VERIFIED | AY 2026-27</div>
          </div>
        </div>

        <div class="consolidation-container">
          <h3 class="consolidation-title">📊 Syllabus Highlights & Consolidation Info</h3>
          <table class="consolidation-table">
            <tr>
              <td class="consolidation-label" style="width: 35%;">Subject Course:</td>
              <td class="consolidation-val">${SUBJECTS_METADATA[subjectId]?.fullName || 'Indirect Tax Laws'}</td>
            </tr>
            <tr>
              <td class="consolidation-label">Syllabus Topic:</td>
              <td class="consolidation-val" style="color: #ffffff;">Supply under GST (Section 7, 8 & Schedules I, II, III)</td>
            </tr>
            <tr>
              <td class="consolidation-label">Key Schedules Mapped:</td>
              <td class="consolidation-val">4 Statutory Schedules + Section 8 Composite Rules</td>
            </tr>
            <tr>
              <td class="consolidation-label">Compliance Validation:</td>
              <td class="consolidation-val">Assessment Year 2026-27 (Syllabus Core Stand)</td>
            </tr>
          </table>
        </div>

        <!-- 1. Scope of Supply Section 7 -->
        <div class="chapter-block">
          <div class="chapter-header" style="background-color: #ffffff !important;">
            <h3 class="chapter-title" style="color: white !important;">Section 7: Scope of Supply</h3>
            <p class="chapter-sub" style="color: #e0e7ff !important;">The Primary Charging Catalyst of GST u/s 7(1)</p>
          </div>
          <div class="chapter-body">
            <div class="section-grid-3">
              <div class="sub-card">
                <div class="sub-card-title">
                  <span>Section 7(1)(a)</span>
                  <span class="accent-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">COMMERCIAL</span>
                </div>
                <div class="sub-card-text">
                  Covers all forms of stock supply such as <strong>sale, transfer, barter, exchange, license, rental, lease, or disposal</strong>.<br/>
                  <span style="color: #ffffff; font-size: 9.5px; display: block; margin-top: 5px;"><strong>Conditions:</strong> Requires consideration AND execution in course or furtherance of business.</span>
                </div>
              </div>
              
              <div class="sub-card">
                <div class="sub-card-title">
                  <span>Section 7(1)(aa)</span>
                  <span class="accent-badge" style="background: rgba(255, 255, 255, 0.15); color: #ffffff;">MEMBERS</span>
                </div>
                <div class="sub-card-text">
                  Activities or transactions by a person (other than an individual) to its members/constituents or vice-versa.<br/>
                  <span style="color: #ffffff; font-size: 9.5px; display: block; margin-top: 5px;"><strong>Key Rule:</strong> Overrides the Doctrine of Mutuality! Taxable for cash, deferred payment or consideration.</span>
                </div>
              </div>

              <div class="sub-card">
                <div class="sub-card-title">
                  <span>Section 7(1)(b)</span>
                  <span class="accent-badge" style="background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">IMPORTATION</span>
                </div>
                <div class="sub-card-text">
                  Importation of cross-border services from any global service provider, executed in exchange for consideration.<br/>
                  <span style="color: #d97706; font-size: 9.5px; display: block; margin-top: 5px;"><strong>Crucial Exception:</strong> Taxable <u>whether or not</u> in the course or furtherance of business!</span>
                </div>
              </div>
            </div>

            <div class="alert-box">
              <div class="alert-title">⚠️ The Exam Trap: Business Connection Rule u/s 7(1)(b) vs Schedule I</div>
              <div>While Section 7(1)(b) requires consideration but doesn't care about business purpose, Schedule I Para 4 says import of services WITHOUT consideration is taxable only if it's from a related person AND in course/furtherance of business.</div>
            </div>

            <div class="example-box">
              <div class="example-title">💡 Worked Case Application Example: Personal vs Commercial Import</div>
              <div>
                • <strong>Scenario A:</strong> A doctor pays a New York-based architect ₹5,00,050 to draft construction maps for his personal residence. This is a taxable supply under 7(1)(b) (consideration is present).<br/>
                • <strong>Scenario B:</strong> A doctor imports a layout blueprint for his residential villa for free from his brother living in New York. Since there is no consideration and it is personal, it is NOT a supply (fails both u/s 7(1)(b) and Schedule I Para 4).
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Schedule I Section -->
        <div class="chapter-block">
          <div class="chapter-header">
            <h3 class="chapter-title" style="color: white !important;">Schedule I: Deemed Supply Without Consideration</h3>
            <p class="chapter-sub" style="color: #94a3b8 !important;">Four specific items taxable u/s 7(1)(c) with NO consideration</p>
          </div>
          <div class="chapter-body">
            <div class="section-grid-2">
              <div class="sub-card">
                <div class="sub-card-title">1. Permanent Asset Disposal</div>
                <div class="sub-card-text">Disposal or transfer of business assets where Input Tax Credit (ITC) has been availed under GST.</div>
              </div>
              <div class="sub-card">
                <div class="sub-card-title">2. Distinct or Related Persons</div>
                <div class="sub-card-text">Supply of goods or services between related entities or distinct offices (same PAN u/s 25) in course or furtherance of business.</div>
              </div>
              <div class="sub-card">
                <div class="sub-card-title">3. Principal & Agent Connection</div>
                <div class="sub-card-text">Goods supplied by a principal to their agent (or vice versa) where the agent undertakes to supply such goods on behalf of principal, decided by whether agent issues invoices in their own name.</div>
              </div>
              <div class="sub-card">
                <div class="sub-card-title">4. Importation from Related Overseas Agent</div>
                <div class="sub-card-text">Import of services by a taxable person in India from a related overseas establishment or relative, in course/furtherance of business.</div>
              </div>
            </div>

            <div class="alert-box" style="border-left-color: #ef4444; background-color: #fef2f2; color: #991b1b !important;">
              <div class="alert-title" style="color: #991b1b;">⚠️ The Critical Exemptions & Thresholds</div>
              <div>
                • <strong>Employer to Employee Gifts:</strong> Excluded from supply only if the aggregate value does not exceed ₹50,000 in a financial year. If it exceeds ₹50,000, it is fully taxable.<br/>
                • <strong>Assets with No ITC:</strong> If ITC was blocked or not availed upon purchase of business assets, subsequent transfer without consideration is NOT a supply.
              </div>
            </div>

            <div class="example-box">
              <div class="example-title">💡 Worked Case Application Example</div>
              <div style="font-style: italic;">
                CA Mohan transfers surplus office laptops from his registered head office in Delhi to his branch office in Noida. Since the Noida and Delhi offices reside under a single centralized corporate PAN, they represent distinct persons. This transfer is statistically a deemed supply under Schedule I Para 2.
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Schedule II Section -->
        <div class="chapter-block">
          <div class="chapter-header">
            <h3 class="chapter-title" style="color: white !important;">Schedule II: Quick Classifier (Goods vs. Services)</h3>
            <p class="chapter-sub" style="color: #94a3b8 !important;">Definitive classification parameters u/s 7(1A)</p>
          </div>
          <div class="chapter-body">
            <div class="section-grid-2">
              <div class="sub-card" style="border-left: 3px solid #0ea5e9;">
                <div class="sub-card-title" style="color: #0369a1;">📦 Supply of Goods</div>
                <div class="sub-card-text" style="font-size: 10px; line-height: 1.5;">
                  • Transfer of absolute title (Ownership is completely handed over)<br/>
                  • Future transfer agreement (e.g. Hire-Purchase agreements)<br/>
                  • Permanent disposal or transfer of business assets
                </div>
              </div>
              <div class="sub-card" style="border-left: 3px solid #8b5cf6;">
                <div class="sub-card-title" style="color: #6d28d9;">🛠️ Supply of Services</div>
                <div class="sub-card-text" style="font-size: 10px; line-height: 1.5;">
                  • Transfer of right to use (Ownership title remains with lessor)<br/>
                  • Land / Building lease, industrial tenancy, or licensing<br/>
                  • Job work process applied to another person's goods<br/>
                  • Renting or leasing of commercial/residential properties<br/>
                  • Works contracts & restaurant catering services
                </div>
              </div>
            </div>

            <div class="alert-box">
              <div class="alert-title">⚠️ The Critical Exception: Real Estate Construction</div>
              <div>Classified as a service unless 100% of the financial consideration is received after receiving a partial or full completion certificate, or post its first occupation, making it land/building sale u/Schedule III instead.</div>
            </div>

            <div class="example-box">
              <div class="example-title">💡 Worked Case Application Example</div>
              <div style="font-style: italic;">
                Selling packaged ready-to-wear shirts is a Supply of Goods. Giving core industrial machinery on hire-lease without passing final title constitutes a Supply of Services.
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Schedule III Section -->
        <div class="chapter-block">
          <div class="chapter-header">
            <h3 class="chapter-title" style="color: white !important;">Schedule III: The Negative List (Non-Supplies)</h3>
            <p class="chapter-sub" style="color: #94a3b8 !important;">Out-of-scope non-supplies (neither goods nor services)</p>
          </div>
          <div class="chapter-body">
            <div style="font-size: 11px; line-height: 1.6; color: '#ffffff'; margin-bottom: 12px; padding-left: 5px;">
              • <strong>Employment:</strong> Services rendered by an employee to an employer during the course of or in relation to employment.<br/>
              • <strong>Judiciary:</strong> Services by any Court or statutory Tribunal (including Consumer Disputes Redressal Commissions).<br/>
              • <strong>Constitutional Role:</strong> Duties carried out by MPs, MLAs, and individuals holding constitutional positions (President, PM, Chief Justice).<br/>
              • <strong>Funerary:</strong> Funeral, burial, crematorium, or mortuary services, including the transportation of deceased.<br/>
              • <strong>Immovable Property:</strong> Sale of Land, and sale of building (provided 100% of purchase consideration is received post completion certificate).<br/>
              • <strong>Actionable Claims:</strong> All general actionable claims (debt journals, insurance cards) are excluded.<br/>
              • <strong>Merchant Trading:</strong> Direct supply of goods from a place in non-taxable territory to another place in non-taxable territory without entering India [Schedule III Para 7].<br/>
              • <strong>High Sea Sales:</strong> Supply of goods by the consignee to any other person by endorsement of title deeds after dispatch from port outside India but before home clearance [Schedule III Para 8(b)].<br/>
              • <strong>In-Bond Sales (Bond to Bond):</strong> Supply of warehoused goods to any person before clearance for home consumption [Schedule III Para 8(a)].<br/>
              • <strong>SEZ & FTZs:</strong> Document entries and movements of goods within Special Economic Zones (SEZ) or Free Trade Zones (FTZ) prior to clearing goods for home consumption.<br/>
              • <strong>Co-Insurance & Ceding Commission:</strong> Allocation of co-insurance premium share between lead insurer and co-insurers, or reinsurance ceding commissions, clarified as non-supplies under CBIC Circulars.
            </div>

            <div class="alert-box">
              <div class="alert-title">⚠️ Actionable Claims Exception (Taxable Goods)</div>
              <div>Only the 6 specified actionable claims (betting, lottery, gambling, casinos, horse racing, and online money gaming) are treated as taxable Supply of Goods under current legislation.</div>
            </div>

            <div class="example-box">
              <div class="example-title">💡 Worked Case Application Example</div>
              <div style="font-style: italic;">
                A corporate director sells a plot of raw land to a real estate group. Under Schedule III Para 5, the transaction remains outside of GST as it is treatable as neither supply of goods nor services.
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Section 8 Section -->
        <div class="chapter-block">
          <div class="chapter-header">
            <h3 class="chapter-title" style="color: white !important;">Section 8: Composite and Mixed Supplies</h3>
            <p class="chapter-sub" style="color: #94a3b8 !important;">Bespoke tax rates on bundled transactions u/s 8(a) and 8(b)</p>
          </div>
          <div class="chapter-body">
            <div class="section-grid-2">
              <div class="sub-card">
                <div class="sub-card-title" style="color: #10b981;">Composite Supply u/s 8(a) [defined u/s 2(30)]</div>
                <div class="sub-card-text">
                  Two or more taxable supplies naturally bundled and supplied together in general course of trade. One predominant item acts as Principal Supply.<br/>
                  <span style="color: #10b981; font-weight: bold; font-size: 9.5px; display: block; margin-top: 5px;">⚡ LIABILITY u/s 8(a): Treated as supply of the principal supply, taxed at its exact rate.</span>
                </div>
              </div>
              <div class="sub-card">
                <div class="sub-card-title" style="color: #d97706;">Mixed Supply u/s 8(b) [defined u/s 2(74)]</div>
                <div class="sub-card-text">
                  Two or more individual items packaged together for a single blanket price, which are NOT naturally bundled.<br/>
                  <span style="color: #d97706; font-weight: bold; font-size: 9.5px; display: block; margin-top: 5px;">⚡ LIABILITY u/s 8(b): Treated as supply of the item attracting the highest rate of tax.</span>
                </div>
              </div>
            </div>

            <div class="alert-box">
              <div class="alert-title">⚠️ The Separate Bills Rule</div>
              <div>If individual prices are detailed and billed separately on a single invoice, they are taxed respectively at their own component rates instead of triggering a Mixed Supply calculation.</div>
            </div>

            <div class="example-box">
              <div class="example-title">💡 Worked Case Application Example</div>
              <div style="font-style: italic;">
                Selling a modern laptop (taxable at 18%) bundled with a diagnostic carrying bag (taxable at 28%) for a single packaged price of ₹48,000. Since they are naturally bundled, laptop acts as principal, taxing the complete package at 18%.
              </div>
            </div>
          </div>
        </div>

        <h4 style="font-size: 11px; text-transform: uppercase; color: #ffffff; letter-spacing: 0.05em; margin-top: 20px; margin-bottom: 6px;">Diagrammatic Logic Blueprint</h4>
        <div class="diagram-container">${summary.visualBreakdown ? summary.visualBreakdown.content : ''}</div>
      `;
    } else {
      const subjectFullName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;
      const subjectCode = SUBJECTS_METADATA[subjectId]?.name || subjectId;
      const chapterNum = sIdx !== undefined ? sIdx + 1 : (getCurrentChapterIndex(summary.chapterName) + 1);
      const cleanChapterTitle = summary.chapterName.replace(/^(DT|IDT|AFM|FR|AUDIT|IBS)\s*-\s*/i, '');

      bodyHtml = `
        <!-- TOP BRAND HEADER (DARK NAVY WITH GOLD BAR) -->
        <div class="pdf-top-header">
          <div class="pdf-header-left">
            <div class="pdf-brand-title">practACE</div>
            <div class="pdf-brand-sub">CA Final · ${subjectFullName}</div>
          </div>
          <div class="pdf-header-right">
            <div class="pdf-doc-title">KNOWLEDGE HUB</div>
            <div class="pdf-doc-sub">Ch.${chapterNum} · ${cleanChapterTitle}</div>
          </div>
        </div>
        <div class="pdf-header-gold-bar"></div>

        <!-- PAGE 1: COVER / TITLE PAGE -->
        <div class="pdf-cover-page">
          <div style="height: 100px;"></div>
          <h1 class="pdf-cover-title">${cleanChapterTitle.toUpperCase()}</h1>
          <div class="pdf-cover-subtitle">Knowledge Hub · CA Final ${subjectCode}, Chapter ${chapterNum}</div>
          <div class="pdf-cover-divider"></div>
          <div class="pdf-cover-source">
            Source: ICAI BoS Study Material (${subjectCode}), Chapter ${chapterNum} — ${cleanChapterTitle}<br/>
            <span style="font-weight: 600;">Applicable for CA Final November 2026 attempt</span>
          </div>
        </div>
        <div class="page-break"></div>

        <!-- PAGES 2+: CONCEPT & FORMULA CARDS -->
        ${summary.keyPrinciples.map((principle: any, idx: number) => {
          const rawDesc = principle.description || '';
          const lines = rawDesc.split('\n').map((l: string) => l.trim()).filter(Boolean);
          
          let formulaLines: string[] = [];
          let footnoteLines: string[] = [];

          lines.forEach((line: string) => {
            if (line.includes('=') || line.includes('−') || line.includes('×') || line.includes('Max [') || line.includes('Payoff') || line.includes('Margin') || line.includes('Basis') || line.includes('Delta') || line.includes('C =')) {
              formulaLines.push(line);
            } else {
              footnoteLines.push(line);
            }
          });

          if (formulaLines.length === 0 && lines.length > 0) {
            formulaLines.push(lines[0]);
            footnoteLines = lines.slice(1);
          }

          return `
            <div class="pdf-concept-card avoid-break">
              <div class="pdf-concept-header">
                <div class="pdf-concept-num-box">${idx + 1}</div>
                <div class="pdf-concept-title">${principle.title}</div>
              </div>
              <div class="pdf-formula-box">
                <div class="pdf-formula-content">${formulaLines.join('\n')}</div>
              </div>
              ${footnoteLines.length > 0 ? `
                <div class="pdf-concept-footnote">${footnoteLines.join(' ')}</div>
              ` : ''}

              ${principle.exception ? `
                <div class="alert-box" style="margin: 8px 12px 12px 12px;">
                  <div class="alert-title">⚠️ Statutory Exception / Exam Trap</div>
                  <div>${principle.exception}</div>
                </div>
              ` : ''}

              ${principle.example ? `
                <div class="example-box" style="margin: 8px 12px 12px 12px;">
                  <div class="example-title">💡 Worked Case Application Example</div>
                  <div style="font-style: italic;">${principle.example}</div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}

        ${summary.visualBreakdown && summary.visualBreakdown.type === 'flow' ? `
          <h4 style="font-size: 11px; text-transform: uppercase; color: #0b1528; letter-spacing: 0.05em; margin-top: 24px; margin-bottom: 8px; font-weight: 800; font-family: 'JetBrains Mono', monospace;">Diagrammatic Logic Blueprint: ${summary.visualBreakdown.title}</h4>
          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-top: 10px; page-break-inside: avoid;">
            ${getFlowchartHtmlForPrint(summary.visualBreakdown.title)}
          </div>
        ` : ''}

        ${summary.visualBreakdown && summary.visualBreakdown.content ? `
          <h4 style="font-size: 11px; text-transform: uppercase; color: #0b1528; letter-spacing: 0.05em; margin-top: 24px; margin-bottom: 8px; font-weight: 800; font-family: 'JetBrains Mono', monospace;">Diagrammatic Logic Blueprint</h4>
          <div class="diagram-container">${summary.visualBreakdown.content}</div>
        ` : ''}

        ${summary.visualBreakdown && summary.visualBreakdown.type !== 'flow' && summary.visualBreakdown.headers && summary.visualBreakdown.rows ? `
          <h4 style="font-size: 11px; text-transform: uppercase; color: #0b1528; letter-spacing: 0.05em; margin-top: 24px; margin-bottom: 8px; font-weight: 800; font-family: 'JetBrains Mono', monospace;">Visual Table Summary: ${summary.visualBreakdown.title}</h4>
          <table class="avoid-break">
            <thead>
              <tr>
                ${summary.visualBreakdown.headers.map((h: any) => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${summary.visualBreakdown.rows.map((row: any) => `
                <tr>
                  ${row.map((cell: any, cIdx: number) => `<td style="${cIdx === 0 ? 'font-weight: 700; color: #0b1528;' : ''}">${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      `;
    }

    printDirectlyAsPdf(cleanChapterTitle.replace(/\s+/g, '_') + '_Concept_Focus', bodyHtml);
  };

  const handleExportSectionsPDF = () => {
    const activeSections = getFilteredSections();
    const subjectFullName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;
    const catCounts = getStatutoryCategoryCounts();
    const subTabLabels: Record<string, string> = {
      all: 'All References (Sections · Schedules · Rules · Notifications & Circulars)',
      sections: 'Statutory Sections',
      schedules: 'Schedules & Paras',
      notifications: 'Statutory Notifications & CBIC Circulars',
      rules: 'Rules & Valuation Procedures'
    };
    const activeSubTabLabel = showSectionsOnlyFavorites
      ? `Favorites Only · ${subTabLabels[sectionsSubTab] || 'All References'}`
      : (subTabLabels[sectionsSubTab] || 'All References');


    const flatRows: Array<{
      citation: string;
      categoryLabel: string;
      itemCategory: string;
      heading: string;
      provision: string;
      isSub: boolean;
    }> = [];

    activeSections.forEach(sec => {
      const itemCategory = classifyStatutoryItem(sec);
      const isCircular = sec.number.toLowerCase().includes('circular') || sec.heading.toLowerCase().includes('circular');
      const isFtp = sec.number.toLowerCase().includes('ftp') || sec.heading.toLowerCase().includes('foreign trade policy');
      const categoryLabel =
        itemCategory === 'schedules'
          ? 'SCHEDULE / PARA'
          : itemCategory === 'notifications'
          ? (isCircular ? 'CBIC CIRCULAR' : isFtp ? 'FOREIGN TRADE POLICY' : 'NOTIFICATION')
          : itemCategory === 'rules'
          ? 'STATUTORY RULE'
          : 'SECTION';

      // Main parent section/schedule/rule/notification row
      flatRows.push({
        citation: sec.number,
        categoryLabel,
        itemCategory,
        heading: sec.heading,
        provision: sec.purpose,
        isSub: false
      });

      // Individual sub-section / sub-clause / schedule paragraph rows
      if (sec.subsections && sec.subsections.length > 0) {
        sec.subsections.forEach(sub => {
          flatRows.push({
            citation: sub.number,
            categoryLabel: '',
            itemCategory,
            heading: sub.heading,
            provision: sub.purpose,
            isSub: true
          });
        });
      }
    });

    const tabularRowsHtml = flatRows.map((row, idx) => `
      <tr style="page-break-inside: auto; background-color: ${idx % 2 === 1 ? '#f8fafc' : '#ffffff'};">
        <td style="width: 25%; vertical-align: top; padding: 4px 7px; border: 1px solid #cbd5e1; font-family: 'JetBrains Mono', monospace;">
          <div style="font-weight: 800; font-size: 8.5pt; color: ${row.isSub ? '#3730a3' : '#1e3a8a'}; line-height: 1.2;">
            ${row.citation}
          </div>
          ${!row.isSub && row.categoryLabel ? `
            <div style="font-size: 6.5pt; font-weight: 700; text-transform: uppercase; color: #64748b; margin-top: 1px; letter-spacing: 0.02em;">
              ${row.categoryLabel}
            </div>
          ` : ''}
        </td>
        <td style="width: 75%; vertical-align: top; padding: 4px 8px; border: 1px solid #cbd5e1; color: #0f172a; font-size: 8pt; line-height: 1.35;">
          <strong style="color: #0f172a; font-weight: 700;">${row.heading}</strong>: 
          <span style="color: #334155;">${row.provision}</span>
        </td>
      </tr>
    `).join('');

    const mirroredContentHtml = `
      <table class="statutory-matrix-table" style="width: 100% !important; border-collapse: collapse !important; margin: 0 !important; padding: 0 !important; border: 1px solid #cbd5e1 !important;">
        <thead>
          <tr style="background-color: #0d1526 !important;">
            <th style="width: 25%; text-align: left; padding: 5px 7px; background-color: #0d1526 !important; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; font-size: 8pt; font-weight: 800; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.03em;">
              Section
            </th>
            <th style="width: 75%; text-align: left; padding: 5px 8px; background-color: #0d1526 !important; color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; font-size: 8pt; font-weight: 800; border: 1px solid #cbd5e1; text-transform: uppercase; letter-spacing: 0.03em;">
              Legal Provision
            </th>
          </tr>
        </thead>
        <tbody>
          ${tabularRowsHtml}
        </tbody>
      </table>
    `;

    const bodyHtml = `
      <div style="text-align: center; margin: 0 0 5px 0; padding: 0;">
        <span style="font-size: 11pt !important; font-weight: 800 !important; color: #0f172a !important; -webkit-text-fill-color: #0f172a !important;">
          ${subjectFullName}: Statutory Coverage Register
        </span>
        <span style="font-size: 8pt !important; color: #475569 !important; -webkit-text-fill-color: #475569 !important; font-weight: 600 !important; margin-left: 8px;">
          (${flatRows.length} Clauses Mapped · Nov 2026 Exam Compliant)
        </span>
      </div>

      ${mirroredContentHtml}
    `;

    printDirectlyAsPdf(`${subjectId}_Statutory_Coverage_${sectionsSubTab.toUpperCase()}`, bodyHtml);
  };

  const handleExportLimitsPDF = () => {
    const activeLimits = getFilteredLimits();
    const subjectFullName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;

    const bodyHtml = `
      <div style="text-align: center; margin: 4px 0 18px 0;">
        <h1 style="font-size: 16pt !important; font-weight: 800 !important; color: #0f172a !important; -webkit-text-fill-color: #0f172a !important; border: none !important; margin: 0 0 4px 0 !important; padding: 0 !important;">
          ${subjectFullName}: Statutory Limits & Rates
        </h1>
        <div style="font-size: 9.5pt !important; color: #334155 !important; -webkit-text-fill-color: #334155 !important; font-weight: 500 !important;">
          Statutory Thresholds, Rates & Exemptions — Nov 2026 Exam Applicability (${activeLimits.length} of ${limits.length} Thresholds Mapped)
        </div>
      </div>

      <div class="consolidation-container">
        <h3 class="consolidation-title">📊 Statutory rate & limit matrix highlights</h3>
        <table class="consolidation-table">
          <tr>
            <td class="consolidation-label" style="width: 35%;">Subject Course:</td>
            <td class="consolidation-val">${SUBJECTS_METADATA[subjectId]?.fullName || subjectId}</td>
          </tr>
          <tr>
            <td class="consolidation-label">Limits Catalog:</td>
            <td class="consolidation-val" style="color: #0f172a;">Statutory Thresholds, Rates & Exemptions</td>
          </tr>
          <tr>
            <td class="consolidation-label">Active Filter:</td>
            <td class="consolidation-val" style="text-transform: uppercase; font-weight: bold; color: #4f46e5;">ALL RATE MATRICES</td>
          </tr>
          <tr>
            <td class="consolidation-label">Total Clauses Mapped:</td>
            <td class="consolidation-val">${activeLimits.length} of ${limits.length} Statutory Rates Mapped</td>
          </tr>
          <tr>
            <td class="consolidation-label">Tax Assessment Year:</td>
            <td class="consolidation-val">AY 2026-27 (Exam Compliant)</td>
          </tr>
        </table>
      </div>

      <div class="chapter-block" style="border: none; box-shadow: none; margin-bottom: 0;">
        <div class="chapter-header" style="border-radius: 8px 8px 0 0;">
          <h3 class="chapter-title">Statutory Limits & Rates Reference Table</h3>
          <p class="chapter-sub">Validated with strict statutory guidelines for CA Final examinations</p>
        </div>

        <table style="border-top: none; border-radius: 0 0 8px 8px; margin-bottom: 0;">
          <thead>
            <tr>
              <th style="width: 40%;">TAX PROVISION / DEDUCTIONS</th>
              <th style="width: 25%;">THRESHOLD LIMIT / RATE</th>
              <th style="width: 35%;">LEGISLATIVE COMPLIANCE REMARKS</th>
            </tr>
          </thead>
          <tbody>
            ${activeLimits.length === 0 ? `
              <tr>
                <td colspan="3" style="text-align: center; padding: 30px; color: #64748b; font-style: italic;">No limits or rates found matching the active selection.</td>
              </tr>
            ` : activeLimits.map(item => `
              <tr>
                <td style="font-weight: 700; color: #0f172a;">${item.item}</td>
                <td class="text-mono" style="font-weight: 800; color: #059669;">${item.limitRate}</td>
                <td style="color: #334155; line-height: 1.5;">${item.remarks}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    printDirectlyAsPdf(subjectId + '_Statutory_Limits_AY_2026-27', bodyHtml);
  };

  const handleExportFormulasPDF = () => {

    const activeFormulas = formulas.filter(form => {
      const matchChapter = formulaChapterFilter === 'all' || form.chapterName === formulaChapterFilter;
      const matchQuery = formulaSearchQuery === '' || 
        form.formulaName.toLowerCase().includes(formulaSearchQuery.toLowerCase()) ||
        form.equation.toLowerCase().includes(formulaSearchQuery.toLowerCase()) ||
        form.context.toLowerCase().includes(formulaSearchQuery.toLowerCase());
      return matchChapter && matchQuery;
    });

    const bodyHtml = `
      <div class="brand-header">
        <div>
          <h1 class="brand-title">practACE</h1>
          <p class="brand-sub">${subjectId} • Comprehensive Formula Chart</p>
        </div>
        <div class="export-meta">
          <div>Report Type: FORMULA STUDY SHEET</div>
          <div>Status: EXAM READY</div>
          <div>Strictly Private Study Use Only</div>
        </div>
      </div>

      <div class="consolidation-container" style="background: rgba(15, 23, 42, 0.02); border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 25px;">
        <h4 class="consolidation-title" style="margin-top: 0; font-size: 11px; text-transform: uppercase; color: #0f172a !important; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; font-weight: 800; display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
          Formula Chart Metadata
        </h4>
        <table class="consolidation-table" style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 0 !important; border: none; border-radius: 0; box-shadow: none;">
          <tr>
            <td class="consolidation-label" style="padding: 4px 0; border: none; color: #334155; font-weight: 600; text-align: left;">Subject ID</td>
            <td class="consolidation-val" style="padding: 4px 0; border: none; font-weight: 800; text-align: right; color: #0f172a;">${subjectId}</td>
            <td class="consolidation-label" style="padding: 4px 0; border: none; color: #334155; font-weight: 600; text-align: left; padding-left: 20px;">Document Class</td>
            <td class="consolidation-val" style="padding: 4px 0; border: none; font-weight: 800; text-align: right; color: #0f172a;">High-Yield Formula Chart</td>
          </tr>
          <tr>
            <td class="consolidation-label" style="padding: 4px 0; border: none; color: #334155; font-weight: 600; text-align: left;">Coverage</td>
            <td class="consolidation-val" style="padding: 4px 0; border: none; font-weight: 800; text-align: right; color: #0f172a;">${selectedChapter === 'all' ? 'All Active Chapters' : selectedChapter}</td>
            <td class="consolidation-label" style="padding: 4px 0; border: none; color: #334155; font-weight: 600; text-align: left; padding-left: 20px;">Revision Cycle</td>
            <td class="consolidation-val" style="padding: 4px 0; border: none; font-weight: 800; text-align: right; color: #0f172a;">Last-Minute Exam Ready</td>
          </tr>
        </table>
      </div>

      <div class="chapter-block" style="border: none; box-shadow: none; margin-bottom: 0; background: transparent;">
        <div class="chapter-header" style="border-radius: 8px; margin-bottom: 20px; background-color: #f1f5f9 !important; border: 1px solid #cbd5e1; padding: 14px 18px;">
          <h3 class="chapter-title" style="color: #0f172a !important; font-size: 13px; font-weight: 800; margin: 0; text-transform: uppercase;">${subjectId} - Formula Index</h3>
          <p class="chapter-sub" style="color: #475569 !important; font-size: 10px; margin-top: 4px;">Extracted high-impact mathematical models and financial theorems</p>
        </div>

        ${activeFormulas.length === 0 ? `
          <div style="text-align: center; padding: 40px; font-style: italic; color: #4b5563; background: #f9fafb; border: 1px dashed #e5e7eb; border-radius: 8px;">
            No formulas found matching the current filters.
          </div>
        ` : activeFormulas.map(form => `
          <div class="page-break-avoid" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 20px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 10px;">
              <div>
                <span style="font-size: 8pt; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #4f46e5; text-transform: uppercase;">${form.chapterName}</span>
                <h4 style="font-size: 11pt; font-weight: 700; color: #0f172a; margin: 4px 0 0 0;">${form.formulaName}</h4>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10pt; font-weight: 700; color: #0f172a; text-align: center; margin: 10px 0; line-height: 2.2 !important; letter-spacing: 0.03em;">
              ${form.equation}
            </div>

            <p style="font-size: 9pt; color: #334155; margin: 8px 0 12px 0; line-height: 1.4;">${form.context}</p>

            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
              <span style="font-size: 8pt; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #334155; display: block; margin-bottom: 6px; text-transform: uppercase;">Variables Identified:</span>
              <table style="width: 100%; border: none; margin: 0; padding: 0; border-collapse: collapse; border-radius: 0; box-shadow: none;">
                ${form.variables.map(v => `
                  <tr style="border-bottom: 1px solid #cbd5e1;">
                    <td style="width: 25%; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; font-weight: 700; padding: 6px 0; color: #0f172a; border: none;">${v.name}</td>
                    <td style="width: 75%; font-size: 8.5pt; padding: 6px 0; color: #334155; border: none;">${v.desc}</td>
                  </tr>
                `).join('')}
              </table>
            </div>

            ${form.workedExample ? `
              <div style="border-left: 3px solid #10b981; background: #f0fdf4; padding: 12px; border-radius: 0 6px 6px 0; border-top: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">
                <span style="font-size: 8pt; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #047857; display: block; margin-bottom: 4px; text-transform: uppercase;">Worked Proof:</span>
                <p style="font-size: 8.5pt; font-weight: 600; color: #065f46; margin: 0 0 6px 0;">${form.workedExample.scenario}</p>
                <pre style="background: #ffffff; border: 1px solid #d1fae5; font-family: 'JetBrains Mono', monospace; font-size: 8pt; padding: 8px; margin: 4px 0; overflow-x: auto; border-radius: 4px; line-height: 2.2 !important; letter-spacing: 0.02em; color: #0f172a; white-space: pre-wrap !important;">${form.workedExample.calculation}</pre>
                <p style="font-size: 8.5pt; font-weight: 700; color: #065f46; margin: 6px 0 0 0;">Final Return: ${form.workedExample.output}</p>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    printDirectlyAsPdf(subjectId + '_Formula_Chart_Study_Pack', bodyHtml);
  };

  if (activeTab === 'blueprint' || activeTab === 'references') {
    const currentSubTab = blueprintSubTab === 'references' ? 'summaries' : blueprintSubTab;

    return (
      <div id="blueprint-panel" className="blueprint-view concept-focus-container space-y-6 animate-fadeIn">
        {/* Sub-selector for Concept Blueprint */}
        <div id="blueprint-sub-tab-selector" className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200">
          <div className="flex gap-2">
            <button
              id="subtab-btn-summaries"
              onClick={() => setBlueprintSubTab('summaries')}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px cursor-pointer ${
                currentSubTab === 'summaries'
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Syllabus Summaries & Diagrams
            </button>
            {formulas.length > 0 && subjectId !== 'FR' && (
              <button
                id="subtab-btn-formulas"
                onClick={() => setBlueprintSubTab('formulas')}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all -mb-px cursor-pointer ${
                  currentSubTab === 'formulas'
                    ? 'border-indigo-500 text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Statutory Formulas ({formulas.length})
              </button>
            )}
          </div>
        </div>

        {/* Chapter Selection Search cum Dropdown Tool */}
        {currentSubTab === 'summaries' && summaries.length > 0 && (
          <div id="blueprint-chapter-index" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border dark:border-slate-800 border-slate-200 shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-white" />
                <span className="text-[10px] font-bold text-white text-white uppercase tracking-widest font-mono">Syllabus Index Navigator</span>
              </div>
              <span className="text-[10px] font-bold text-white text-white font-mono bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-md">
                {selectedChapter === 'all' ? 'Showing All' : `Active: Ch ${getCurrentChapterIndex(selectedChapter) + 1}`}
              </span>
            </div>

            {/* Transparent Backdrop to close dropdown on click outside */}
            {isChapterDropdownOpen && (
              <div 
                className="fixed inset-0 z-30 cursor-default bg-transparent" 
                onClick={() => setIsChapterDropdownOpen(false)} 
              />
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full relative z-40">
              {/* Dropdown ComboBox */}
              <div className="relative flex-1 w-full">
                <div 
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-950 border dark:border-slate-800 border-slate-200 rounded-lg shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all cursor-text"
                  onClick={() => setIsChapterDropdownOpen(true)}
                >
                  <Search className="h-4 w-4 text-white shrink-0" />
                  <input
                    type="text"
                    value={chapterSearchQuery}
                    onChange={(e) => {
                      setChapterSearchQuery(e.target.value);
                      setIsChapterDropdownOpen(true);
                    }}
                    placeholder={selectedChapter === 'all' ? "Search or select a chapter..." : `Ch ${getCurrentChapterIndex(selectedChapter) + 1}: ${selectedChapter}`}
                    className="w-full text-xs font-semibold text-white bg-transparent border-0 outline-none focus:ring-0 p-0 placeholder-white dark:placeholder-white placeholder:text-white dark:placeholder:text-white placeholder:opacity-100"
                  />
                  {(chapterSearchQuery || selectedChapter !== 'all') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setChapterSearchQuery('');
                        setSelectedChapter('all');
                      }}
                      className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-white hover:text-white dark:hover:text-white transition-all cursor-pointer"
                      title="Clear Selection"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsChapterDropdownOpen(!isChapterDropdownOpen);
                    }}
                    className="p-0.5 text-white hover:text-white transition-all cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Dropdown Panel */}
                {isChapterDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-lg shadow-lg max-h-64 overflow-y-auto p-1 space-y-0.5 animate-slideUp">
                    {/* Reset Option */}
                    <button
                      onClick={() => {
                        setSelectedChapter('all');
                        setChapterSearchQuery('');
                        setIsChapterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedChapter === 'all'
                          ? 'bg-indigo-950/40 text-white'
                          : 'text-white/80 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="text-white">Show All Chapters</span>
                      <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-white font-mono">{summaries.length}</span>
                    </button>

                    <div className="border-t border-slate-900 my-1"></div>

                    {/* Filtered Chapter List */}
                    {filteredDropdownChapters.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-white/50 italic">No chapters matching your search.</div>
                    ) : (
                      filteredDropdownChapters.map((s) => {
                        const originalIdx = summaries.findIndex(sum => sum.chapterName === s.chapterName);
                        const isSelected = selectedChapter === s.chapterName;
                        return (
                          <button
                            key={originalIdx}
                            onClick={() => {
                              setSelectedChapter(s.chapterName);
                              setChapterSearchQuery('');
                              setIsChapterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-950/40 text-white font-bold border border-white/25'
                                : 'text-white/80 hover:text-white hover:bg-slate-900/60'
                            }`}
                          >
                            <span className={`font-mono text-[9px] font-bold shrink-0 border rounded px-1 py-0.2 select-none ${
                              isSelected 
                                ? 'border-white/40 bg-indigo-950/40 text-white' 
                                : 'border-slate-800 bg-slate-900 text-white/75'
                            }`}>
                              CH {originalIdx + 1}
                            </span>
                            <span className="truncate text-white">{s.chapterName}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Prev / Next Cycle Controls */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 border dark:border-slate-800 border-slate-200 rounded-lg p-1 shrink-0 select-none shadow-xs w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={handlePrevChapter}
                  disabled={summaries.length <= 1}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-white hover:text-white text-white dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Previous Chapter"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-[10px] font-bold text-white text-white uppercase tracking-widest px-3 font-mono">
                  {selectedChapter === 'all' 
                    ? `ALL / ${summaries.length}` 
                    : `${getCurrentChapterIndex(selectedChapter) + 1} / ${summaries.length}`
                  }
                </div>
                <button
                  onClick={handleNextChapter}
                  disabled={summaries.length <= 1}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-white hover:text-white text-white dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Next Chapter"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentSubTab === 'formulas' && formulas.length > 0 && subjectId !== 'FR' ? (
          /* High-Yield Formula Chart & Formula Library Sidebar */
          <div id="formulas-section" className="space-y-6">
            {/* Top Control Header */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-display font-extrabold text-white text-base sm:text-lg tracking-tight">
                      {subjectId} Formula Chart & Interactive LaTeX Library
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    onClick={() => setIsFormulaSidebarOpen(!isFormulaSidebarOpen)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isFormulaSidebarOpen
                        ? 'bg-indigo-600/30 text-white border-indigo-500/40 shadow-xs'
                        : 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-800'
                    }`}
                    title="Toggle Formula Library & Session Notes Sidebar"
                  >
                    {isFormulaSidebarOpen ? <PanelRightOpen className="h-4 w-4 text-indigo-400" /> : <PanelRight className="h-4 w-4 text-white" />}
                    <span>{isFormulaSidebarOpen ? 'Hide Library Sidebar' : 'Show Library Sidebar'}</span>
                  </button>

                  <button
                    onClick={handleExportFormulasPDF}
                    className="flex items-center gap-2 px-3.5 py-2 font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs border border-transparent transition-all cursor-pointer uppercase tracking-wider"
                    title="Export Formula Chart as Print-Ready PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar: Search + Chapter selector */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-7 relative">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={formulaSearchQuery}
                      onChange={(e) => setFormulaSearchQuery(e.target.value)}
                      placeholder="Search formulas, LaTeX symbols, variables or concepts..."
                      className="w-full text-xs font-semibold text-white bg-transparent border-none outline-none placeholder-slate-500 p-0"
                    />
                    {formulaSearchQuery && (
                      <button
                        onClick={() => setFormulaSearchQuery('')}
                        className="p-0.5 text-slate-400 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-5 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                  <select
                    value={formulaChapterFilter}
                    onChange={(e) => setFormulaChapterFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-xs font-semibold text-white rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">All Chapters ({formulas.length} Formulas)</option>
                    {Array.from(new Set(formulas.map(f => f.chapterName))).map((chap, idx) => (
                      <option key={idx} value={chap}>{chap}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toast Feedback Banner */}
              {copiedToast && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{copiedToast}</span>
                </div>
              )}
            </div>

            {/* Content Layout Grid */}
            <div className={`grid grid-cols-1 ${isFormulaSidebarOpen ? 'lg:grid-cols-12' : ''} gap-6`}>
              {/* PRIMARY COLUMN: FORMULA CHART */}
              <div id="formulas-list-container" className={`${isFormulaSidebarOpen ? 'lg:col-span-7 xl:col-span-8' : ''} space-y-6`}>
                {/* Stats Header */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-3 font-mono font-bold">
                    <span className="text-white">Chart Index:</span>
                    <span className="bg-indigo-950 px-2 py-0.5 rounded text-indigo-300 border border-indigo-800/50">
                      Showing {formulas.filter(f => {
                        const matchChap = formulaChapterFilter === 'all' || f.chapterName === formulaChapterFilter;
                        const q = formulaSearchQuery.toLowerCase().trim();
                        if (!q) return matchChap;
                        return matchChap && (
                          f.formulaName.toLowerCase().includes(q) ||
                          f.equation.toLowerCase().includes(q) ||
                          f.context.toLowerCase().includes(q) ||
                          f.chapterName.toLowerCase().includes(q)
                        );
                      }).length} of {formulas.length} Formulas
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">KaTeX TeX Validated</span>
                </div>

                {/* Formula Chart Matrix / List */}
                {formulas.filter(f => {
                  const matchChap = formulaChapterFilter === 'all' || f.chapterName === formulaChapterFilter;
                  const q = formulaSearchQuery.toLowerCase().trim();
                  if (!q) return matchChap;
                  return matchChap && (
                    f.formulaName.toLowerCase().includes(q) ||
                    f.equation.toLowerCase().includes(q) ||
                    f.context.toLowerCase().includes(q) ||
                    f.chapterName.toLowerCase().includes(q)
                  );
                }).length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <HelpCircle className="h-8 w-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-white">No formulas match your current search query.</p>
                    <button
                      onClick={() => { setFormulaSearchQuery(''); setFormulaChapterFilter('all'); }}
                      className="text-xs text-indigo-400 font-bold hover:underline"
                    >
                      Reset Formula Filters
                    </button>
                  </div>
                ) : (
                  formulas.filter(f => {
                    const matchChap = formulaChapterFilter === 'all' || f.chapterName === formulaChapterFilter;
                    const q = formulaSearchQuery.toLowerCase().trim();
                    if (!q) return matchChap;
                    return matchChap && (
                      f.formulaName.toLowerCase().includes(q) ||
                      f.equation.toLowerCase().includes(q) ||
                      f.context.toLowerCase().includes(q) ||
                      f.chapterName.toLowerCase().includes(q)
                    );
                  }).map((form, fIdx) => {
                    const latexCode = parseToLatex(form.equation);
                    const isCopied = copiedFormulaIdx === fIdx;

                    return (
                      <div 
                        key={fIdx} 
                        className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-4 hover:border-slate-700/80 transition-all"
                      >
                        {/* Formula Header & Copy Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-800/80">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50">
                              {form.chapterName}
                            </span>
                            <h4 className="font-display font-extrabold text-white text-base mt-1.5">
                              {form.formulaName}
                            </h4>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleCopyLatex(form.equation, fIdx)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer border ${
                                isCopied
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800 hover:text-white'
                              }`}
                              title="Copy LaTeX formula syntax to clipboard"
                            >
                              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-indigo-400" />}
                              <span>{isCopied ? 'Copied LaTeX!' : 'Copy LaTeX'}</span>
                            </button>

                            <button
                              onClick={() => handleInsertIntoNotes(form.formulaName, form.equation)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900 hover:text-white transition-all cursor-pointer"
                              title="Insert this formula directly into Session Notes"
                            >
                              <Plus className="h-3.5 w-3.5 text-indigo-400" />
                              <span>To Notes</span>
                            </button>
                          </div>
                        </div>

                        {/* Equation Display Box */}
                        <div className="py-4 px-4 my-2 text-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner overflow-x-auto text-white flex flex-col items-center justify-center min-h-[70px]">
                          <MathFormula math={form.equation} block={true} />
                          <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 max-w-full overflow-x-auto select-all">
                            LaTeX: <code className="text-indigo-300">{latexCode}</code>
                          </div>
                        </div>

                        {/* Context */}
                        <p className="text-xs text-slate-300 leading-relaxed">{form.context}</p>

                        {/* Variables List */}
                        <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] uppercase font-mono text-indigo-400 font-extrabold block">Variables Legend:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {form.variables.map((v, vIdx) => (
                              <div key={vIdx} className="flex items-start gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                                <span className="shrink-0 font-mono text-indigo-300 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                  <MathFormula math={v.name} />
                                </span>
                                <span className="text-slate-300 text-[11px] leading-tight mt-0.5">{v.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Worked Example */}
                        {form.workedExample && (
                          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
                            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider block">
                              Meticulous Worked Proof:
                            </span>
                            <p className="text-xs font-semibold text-emerald-200">{form.workedExample.scenario}</p>
                            <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-white border border-slate-800 overflow-x-auto">
                              <MathFormula math={form.workedExample.calculation} block={true} />
                            </div>
                            <p className="text-xs text-emerald-300 font-bold">Final Return: {form.workedExample.output}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* SECONDARY COLUMN: FORMULA LIBRARY SIDEBAR & ACTIVE NOTES */}
              {isFormulaSidebarOpen && (
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                  {/* SIDEBAR PANEL: FORMULA LIBRARY */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4 sticky top-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4.5 w-4.5 text-indigo-400" />
                        <h4 className="font-display font-extrabold text-white text-sm">Formula Library Sidebar</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/50">
                        {formulas.length} Formulas
                      </span>
                    </div>

                    {/* Sidebar Search */}
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={sidebarFormulaSearch}
                        onChange={(e) => setSidebarFormulaSearch(e.target.value)}
                        placeholder="Filter LaTeX formulas..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 text-xs font-medium text-white rounded-lg outline-none focus:border-indigo-500 placeholder-slate-500"
                      />
                    </div>

                    {/* Formula Library List */}
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {formulas
                        .filter(f => !sidebarFormulaSearch || f.formulaName.toLowerCase().includes(sidebarFormulaSearch.toLowerCase()) || f.equation.toLowerCase().includes(sidebarFormulaSearch.toLowerCase()))
                        .map((fItem, fIdx) => (
                          <div 
                            key={fIdx}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] uppercase font-mono font-bold text-indigo-400 block truncate">
                                {fItem.chapterName}
                              </span>
                              <div className="text-xs font-bold text-white truncate">
                                {fItem.formulaName}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleCopyLatex(fItem.equation, fIdx)}
                                className="p-1.5 bg-slate-900 hover:bg-indigo-950 text-indigo-300 rounded-lg border border-slate-800 transition-all cursor-pointer"
                                title="Copy LaTeX code"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleInsertIntoNotes(fItem.formulaName, fItem.equation)}
                                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all cursor-pointer"
                                title="Insert into Session Notes"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* ACTIVE SESSION NOTES */}
                    <div className="border-t border-slate-800 pt-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PenTool className="h-4 w-4 text-emerald-400" />
                          <h4 className="font-display font-extrabold text-white text-xs">Active Session Notes</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleCopyAllNotes}
                            className="p-1 text-[10px] font-mono font-bold text-indigo-300 hover:text-white bg-slate-950 border border-slate-800 px-2 rounded cursor-pointer"
                            title="Copy all notes text"
                          >
                            Copy
                          </button>
                          <button
                            onClick={handleDownloadNotes}
                            className="p-1 text-[10px] font-mono font-bold text-emerald-300 hover:text-white bg-slate-950 border border-slate-800 px-2 rounded cursor-pointer"
                            title="Download notes file"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setSessionNotes('# Active Study Notes\n')}
                            className="p-1 text-[10px] font-mono font-bold text-rose-400 hover:text-rose-300 bg-slate-950 border border-slate-800 px-1.5 rounded cursor-pointer"
                            title="Clear notes"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        rows={9}
                        className="w-full p-3 rounded-xl font-mono text-xs text-slate-100 bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none resize-y"
                        placeholder="Write study notes or click 'To Notes' on formulas above to paste LaTeX code..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {subjectId === 'IBS' && (
              <div id="ibs-master-case-study-static-dossier" className="p-6 rounded-2xl bg-slate-900/95 border-2 border-amber-500/40 shadow-xl space-y-6 text-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
                      ICAI PAPER 6 • STATIC MASTER CASE STUDY DOSSIER (25 MARKS)
                    </span>
                    <h2 className="font-display text-lg sm:text-xl font-black text-white mt-2">
                      Case Study: Aetherion Mobility Ltd. (AML) — 7-Subject Multi-Disciplinary Integration
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Covers: Paper 1 (FR) • Paper 2 (AFM) • Paper 3 (Audit) • Paper 4 (DT) • Paper 5 (IDT) • SPOM Set A (Corporate & Economic Laws) • SPOM Set B (SCMPE)
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-amber-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
                    <div>5 MCQs × 2M = 10 Marks</div>
                    <div>3 Descriptive = 15 Marks</div>
                  </div>
                </div>

                {/* Fact Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="font-mono font-black text-amber-400 uppercase tracking-wider">I. Slump Sale & Common Control (FR + DT + IDT)</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li><strong>Transferor / Transferee:</strong> AML transfers Legacy ICE Drivetrain Division on 01.04.2025 to <strong>VoltEdge Ltd. (74% Subsidiary)</strong> as a going concern for lump-sum consideration of <strong>₹480 Cr</strong>.</li>
                      <li><strong>Control Profile:</strong> Both entities controlled by Apex Promoter Trust before & after.</li>
                      <li><strong>Asset Profile:</strong> Book Carrying Value = <strong>₹310 Cr</strong> (Depreciable Block ₹200 Cr; Land ₹80 Cr; Net Working Capital ₹30 Cr). Tax WDV of Block = <strong>₹140 Cr</strong>. Stamp Duty Value of Land = <strong>₹115 Cr</strong>. Rule 11UAE FMV1 = <strong>₹465 Cr</strong>; FMV2 = <strong>₹480 Cr</strong>.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="font-mono font-black text-amber-400 uppercase tracking-wider">II. MSRTC Fleet Contract & Plant Capex (FR + IDT + DT)</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li><strong>Single Bundled Contract (₹600 Cr):</strong> 500 EV Buses (5% GST; SSP ₹500 Cr) + High-Speed Chargers (18% GST; SSP ₹40 Cr) + 3-Year Comprehensive AMC (18% GST; SSP ₹60 Cr).</li>
                      <li><strong>Chakan Plant Capex:</strong> High-Capacity Charging Equipment (₹32 Cr + 18% GST) anchored on Reinforced Concrete Structural Foundations (Civil Works ₹18 Cr + 18% GST) capitalized to Plant & Machinery.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="font-mono font-black text-amber-400 uppercase tracking-wider">III. Cross-Border M&A & Director Loan (AFM + SPOM Set A Law)</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li><strong>Munich Target (EUR 50M):</strong> Unlevered Ku = 12%; EUR 20M perpetual 5% green bond; German corporate tax = 30%; Spot EUR/INR = <strong>₹90.00</strong>; 1-Yr Risk-Free Rates: India = <strong>7.10%</strong>, Eurozone = <strong>3.00%</strong>.</li>
                      <li><strong>Director-Interested Loan:</strong> AML proposes <strong>₹45 Cr loan @ 6.20% p.a.</strong> (10-Yr G-Sec = <strong>7.15% p.a.</strong>) to <strong>KryoCells Pvt. Ltd.</strong>, where AML’s MD holds <strong>28% voting equity</strong>.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="font-mono font-black text-amber-400 uppercase tracking-wider">IV. Divisional TP & Group Audit (SPOM Set B SCMPE + Audit)</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300">
                      <li><strong>Battery Cell Division:</strong> Capacity = 1,00,000 packs; VC = ₹1,10,000/pack; External Selling Price = ₹1,65,000/pack; External Demand = 75,000 packs; Selling cost saved on internal transfer = ₹5,000/pack; Internal Order = <strong>40,000 packs</strong>.</li>
                      <li><strong>Audit Findings:</strong> German subsidiary (28% group revenue) audited by Munich CPA; AML had <strong>₹14 Cr</strong> excess quarterly stock statement discrepancy on ₹85 Cr sanctioned working capital limit.</li>
                    </ul>
                  </div>
                </div>

                {/* 7-Subject Synthesis Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-amber-400 font-mono uppercase border-b border-slate-800">
                        <th className="p-3 border-r border-slate-800">Subject Domain</th>
                        <th className="p-3 border-r border-slate-800">Statutory Provision / Standard</th>
                        <th className="p-3">Core Numerical / Legal Conclusion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">1. FR (Paper 1)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">Ind AS 103 App C & Ind AS 115</td>
                        <td className="p-3">Pooling of Interest in VoltEdge: Net Assets recorded at ₹310 Cr; ₹170 Cr debited to Capital Reserve. MSRTC: ₹540 Cr recognized on delivery, ₹60 Cr AMC deferred over 36 months.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">2. AFM (Paper 2)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">IRP & International APV</td>
                        <td className="p-3">1-Yr Forward EUR/INR = 90 × (1.071/1.030) = <strong>₹93.5825/EUR</strong>. Perpetual Debt PVTS = EUR 20M × 30% = <strong>EUR 6.00M (₹54 Cr)</strong>.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">3. Audit (Paper 3)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">SA 600, SA 705 & CARO 2020</td>
                        <td className="p-3">Other Matter Para u/s SA 600 for 28% foreign component; mandatory reporting under <strong>CARO Clause 3(ii)(b)</strong> for ₹14 Cr WC stock statement discrepancy (Sanction &gt; ₹5 Cr).</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">4. DT (Paper 4)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">Sec 47(iv), 50B, 11UAE & 194Q</td>
                        <td className="p-3">74% holding fails Sec 47(iv) (needs 100%). Slump Sale LTCG = FVC ₹480 Cr − Tax Net Worth ₹250 Cr = <strong>₹230 Cr</strong>. MSRTC deducts 0.1% TDS u/s 194Q.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">5. IDT (Paper 5)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">Notif 12/2017, Sec 18(3), 8(a), 17(5)</td>
                        <td className="p-3">Going concern exempt (ITC via GST ITC-02); MSRTC Composite Supply taxed @ <strong>5%</strong>; Full ITC eligible on ₹18 Cr P&amp;M concrete foundation u/s 17(5) Explanation.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">6. Law (SPOM Set A)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">Sec 185(2), 185(3)(b) & Sec 188</td>
                        <td className="p-3">MD holds 28% (≥ 25% threshold u/s 185(2)). Loan @ 6.20% p.a. &lt; 10-Yr G-Sec 7.15% p.a. violates Sec 185(3)(b) — <strong>Void/Prohibited</strong> unless interest ≥ 7.15% + SR passed.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white border-r border-slate-800">7. SCMPE (SPOM Set B)</td>
                        <td className="p-3 font-mono text-amber-300 border-r border-slate-800">Goal-Congruent Transfer Pricing</td>
                        <td className="p-3">Net VC = ₹1,05,000 + Avg Opportunity Cost on 15,000 diverted packs (₹82.50 Cr / 40,000 = ₹20,625) = <strong>₹1,25,625 per pack</strong>.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Chapter Blocks Grid (Display chapter names as blocks for Protected PDF Reader access) */}
            <div id="summaries-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSummaries.length === 0 ? (
                <div className="col-span-full p-10 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 italic text-xs">
                  No chapters matching your search query.
                </div>
              ) : (
              filteredSummaries.map((summary) => {
                const sIdx = summaries.findIndex(s => s.chapterName === summary.chapterName);
                const principleCount = summary.keyPrinciples?.length || 0;
                const hasDiagram = !!summary.visualBreakdown;

                return (
                  <div 
                    key={sIdx} 
                    id={`chap-card-${sIdx}`}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden group"
                  >
                    {/* Corner Accent Decorator */}
                    <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

                    {/* Chapter Info */}
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                          CH {(sIdx + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono font-extrabold text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Lock className="h-3 w-3 text-amber-400" /> Read-Only PDF
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-extrabold text-slate-100 text-base group-hover:text-amber-300 transition-colors leading-snug">
                          {summary.chapterName}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          {CA_CURRICULUM_LEVELS[getLevelForSubject(subjectId)].shortName} {subjectId} Statutory Study Pack
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-[10px] font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-semibold">
                          {principleCount} Key Clauses
                        </span>
                        {hasDiagram && (
                          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50 font-semibold flex items-center gap-1">
                            <Layers className="h-2.5 w-2.5" /> Diagram Included
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-3 border-t border-slate-800/80 relative z-10">
                      <button
                        id={`open-pdf-reader-${sIdx}`}
                        onClick={() => {
                          setReaderState({
                            isOpen: true,
                            chapterName: summary.chapterName,
                            chapterNumber: sIdx + 1,
                            chapterContentNode: renderChapterContentNode(summary)
                          });
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Read Chapter PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
        )}

        {renderGlossaryModal()}
        <ProtectedPdfReader
          isOpen={readerState.isOpen}
          onClose={() => setReaderState(prev => ({ ...prev, isOpen: false }))}
          subjectId={subjectId}
          chapterName={readerState.chapterName}
          chapterNumber={readerState.chapterNumber}
          chapterContentNode={readerState.chapterContentNode}
        />
      </div>
    );
  }

  if (activeTab === 'sections') {
    const activeSections = getFilteredSections();
    const catCounts = getStatutoryCategoryCounts();
    const subTabDisplayNames: Record<string, string> = {
      all: 'All References',
      sections: 'Sections',
      schedules: 'Schedules & Paras',
      notifications: 'Notifications & Circulars',
      rules: 'Rules'
    };

    return (
      <div id="sections-panel" className="blueprint-view concept-focus-container space-y-6 animate-fadeIn">
        <div className="statutory-intro-banner flex items-center gap-3 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-100">
          <BookOpen className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-xs font-medium leading-relaxed">
            Ordered register of statutory provisions (Sections, Sub-Sections, Schedules &amp; Paras, Rules, and Notifications &amp; Circulars). Presented in strict legislative sequence for rapid {CA_CURRICULUM_LEVELS[getLevelForSubject(subjectId)].shortName} revision.
          </p>
        </div>

        {/* Favorites and counts controller */}
        <div id="sections-filter-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[1.25rem] bg-slate-900/60 border border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="statutory-coverage-title text-xs font-extrabold uppercase font-mono tracking-wider">
                Syllabus Coverage: {activeSections.length} of {sections.length} Mapped References
              </span>
              <span className="statutory-coverage-view text-[11px] font-mono font-bold">
                · View: {subTabDisplayNames[sectionsSubTab]}{showSectionsOnlyFavorites ? ' (Favorites Only)' : ''}
              </span>
            </div>
            <div className="statutory-counts-row text-[11px] font-mono flex items-center gap-2 flex-wrap">
              <span className="statutory-pill-sections px-2.5 py-0.5 rounded-md border font-bold">
                Sections: {catCounts.sections}
              </span>
              <span className="statutory-pill-schedules px-2.5 py-0.5 rounded-md border font-bold">
                Schedules: {catCounts.schedules} ({catCounts.scheduleParas} Paras)
              </span>
              <span className="statutory-pill-rules px-2.5 py-0.5 rounded-md border font-bold">
                Rules: {catCounts.rules}
              </span>
              <span className="statutory-pill-notifications px-2.5 py-0.5 rounded-md border font-bold">
                Notifications & Circulars: {catCounts.notifications}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap no-print">
            <button
              id="toggle-sections-favorites-only"
              onClick={() => setShowSectionsOnlyFavorites(!showSectionsOnlyFavorites)}
              className={`flex items-center gap-2 px-4 py-2 font-semibold text-xs rounded-lg border uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                showSectionsOnlyFavorites
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 font-bold shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${showSectionsOnlyFavorites ? 'fill-current text-amber-400' : ''}`} />
              Favorites Only ({bookmarkedSections.filter(b => b.subjectId === subjectId).length})
            </button>
            <button
              id="export-sections-pdf"
              onClick={handleExportSectionsPDF}
              className="flex items-center gap-2 px-4 py-2 font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm border border-indigo-400/30 transition-all cursor-pointer uppercase tracking-wider"
              title="Export Sections, Schedules, Rules & Notifications exactly as displayed with practACE branding"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Dynamic Categorization Selector & Search Bar */}
        <div id="sections-controls-bar" className="no-print space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full lg:w-auto">
              {[
                { id: 'all', label: `All References (${sections.length})` },
                { id: 'sections', label: `Sections (${catCounts.sections})` },
                { id: 'schedules', label: `Schedules & Paras (${catCounts.schedules} · ${catCounts.scheduleParas} Paras)` },
                { id: 'notifications', label: `Notifications & Circulars (${catCounts.notifications})` },
                { id: 'rules', label: `Rules (${catCounts.rules})` }
              ].map(tab => {
                const isActive = sectionsSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSectionsSubTab(tab.id as any);
                      if (tab.id !== 'notifications') setNotificationsTopicFilter('all');
                    }}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900 bg-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={sectionsSubTab === 'notifications' ? "Search notification/circular number, topic, relevance..." : "Query sections, schedules, paras, notifications, or rules..."}
                value={sectionsSearchQuery}
                onChange={(e) => setSectionsSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-8 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500/60 focus:outline-hidden text-white placeholder:text-slate-400"
              />
              {sectionsSearchQuery && (
                <button
                  onClick={() => setSectionsSearchQuery('')}
                  className="absolute right-3 top-2.5 hover:text-white text-slate-400 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Topic Quick Filter for Notifications & Circulars */}
          {sectionsSubTab === 'notifications' && (
            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1.5 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-purple-400" />
                Topic Filter:
              </span>
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'levy', label: 'Levy & Composition' },
                { id: 'rcm', label: 'Reverse Charge (RCM)' },
                { id: 'exemptions', label: 'Mega Exemptions' },
                { id: 'time_value', label: 'Time & Value of Supply' },
                { id: 'itc', label: 'Input Tax Credit (ITC)' },
                { id: 'place_of_supply', label: 'Place of Supply & Exports' },
                { id: 'invoicing_eway', label: 'Tax Invoice & E-Way Bill' },
                { id: 'registration_returns', label: 'Registration & Returns' },
                { id: 'demands_amnesty', label: 'Demands & Amnesty' },
                { id: 'customs_ftp', label: 'Customs & FTP' }
              ].map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setNotificationsTopicFilter(topic.id)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    notificationsTopicFilter === topic.id
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div id="sections-list-container" className="border rounded-2xl border-slate-800 overflow-hidden bg-slate-950 shadow-sm">
          {activeSections.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-300 italic">
              {showSectionsOnlyFavorites 
                ? "No sections added to your Favorites for this subject yet. Click the star icon to save specific sections."
                : (sectionsSearchQuery || sectionsSubTab !== 'all' || notificationsTopicFilter !== 'all'
                    ? "No statutory provisions match the selected sub-tab and filter criteria."
                    : "Sections database not required for this subject.")
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="statutory-matrix-table w-full text-left">
                <thead>
                  <tr>
                    <th className="statutory-matrix-col-citation" style={{ width: '25%' }}>
                      {sectionsSubTab === 'notifications' ? 'Notification / Circular Number' : 'Citation'}
                    </th>
                    <th className="statutory-matrix-col-content" style={{ width: '75%' }}>
                      {sectionsSubTab === 'notifications' ? 'Subject & Relevance (Simple Terms)' : 'Legal Provision'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {(() => {
                    const flatDesktopRows: Array<{
                      citation: string;
                      categoryLabel: string;
                      itemCategory: string;
                      heading: string;
                      purpose: string;
                      isSub: boolean;
                      parentNumber: string;
                    }> = [];

                    activeSections.forEach(sec => {
                      const itemCategory = classifyStatutoryItem(sec);
                      const isCircular = sec.number.toLowerCase().includes('circular') || sec.heading.toLowerCase().includes('circular');
                      const isFtp = sec.number.toLowerCase().includes('ftp') || sec.heading.toLowerCase().includes('foreign trade policy');
                      const categoryLabel =
                        itemCategory === 'schedules'
                          ? 'SCHEDULE / PARA'
                          : itemCategory === 'notifications'
                          ? (isCircular ? 'CBIC CIRCULAR' : isFtp ? 'FOREIGN TRADE POLICY' : 'NOTIFICATION')
                          : itemCategory === 'rules'
                          ? 'STATUTORY RULE'
                          : 'SECTION';

                      flatDesktopRows.push({
                        citation: sec.number,
                        categoryLabel,
                        itemCategory,
                        heading: sec.heading,
                        purpose: sec.purpose,
                        isSub: false,
                        parentNumber: sec.number
                      });

                      if (sec.subsections && sec.subsections.length > 0) {
                        sec.subsections.forEach(sub => {
                          flatDesktopRows.push({
                            citation: sub.number,
                            categoryLabel: '',
                            itemCategory,
                            heading: sub.heading,
                            purpose: sub.purpose,
                            isSub: true,
                            parentNumber: sec.number
                          });
                        });
                      }
                    });

                    return flatDesktopRows.map((row, rIdx) => {
                      const isBookmarked = bookmarkedSections.some(b => b.subjectId === subjectId && b.number === row.parentNumber);
                      const isRowCircular = row.citation.toLowerCase().includes('circular') || row.heading.toLowerCase().includes('circular');
                      const isRowFtp = row.citation.toLowerCase().includes('ftp') || row.heading.toLowerCase().includes('foreign trade policy');
                      const badgeClass =
                        row.itemCategory === 'notifications'
                          ? (isRowCircular ? 'statutory-badge-circular' : isRowFtp ? 'statutory-badge-ftp' : 'statutory-badge-notifications')
                          : `statutory-badge-${row.itemCategory}`;
                      const pillClass =
                        row.itemCategory === 'notifications'
                          ? (isRowCircular ? 'statutory-pill-circular' : isRowFtp ? 'statutory-pill-ftp' : 'statutory-pill-notifications')
                          : `statutory-pill-${row.itemCategory}`;

                      return (
                        <tr 
                          key={`${row.citation}-${rIdx}`} 
                          id={`sec-item-${row.citation.replace(/\s+/g, '-')}`}
                          className={`transition-colors ${
                            row.isSub 
                              ? 'bg-slate-950/70 hover:bg-slate-900/60' 
                              : isBookmarked 
                              ? 'bg-amber-500/10 border-l-4 border-l-amber-400 hover:bg-amber-500/15'
                              : 'bg-slate-900/30 hover:bg-slate-900/60'
                          }`}
                        >
                          <td className="statutory-matrix-col-citation" style={{ width: '25%' }}>
                            <div className="flex items-start justify-between gap-1.5">
                              <span className={`statutory-code-badge ${badgeClass} px-2 py-0.5 rounded text-xs font-mono font-extrabold tracking-tight shrink-0 ${row.isSub ? 'border-indigo-500/30 text-indigo-300' : ''}`}>
                                {row.citation}
                              </span>
                              {!row.isSub && (
                                <button
                                  id={`fav-btn-${row.citation}`}
                                  onClick={() => onToggleBookmark({
                                    subjectId,
                                    number: row.citation,
                                    heading: row.heading,
                                    purpose: row.purpose
                                  })}
                                  className={`no-print p-1 rounded-md border transition-all cursor-pointer ${
                                    isBookmarked 
                                      ? 'bg-amber-500 border-transparent text-slate-950 shadow-md shadow-amber-500/15 hover:bg-amber-400'
                                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                                  }`}
                                  title={isBookmarked ? "Remove from Favorites" : "Add to Favorites"}
                                >
                                  <Star className={`h-3 w-3 ${isBookmarked ? 'fill-current text-slate-950' : ''}`} />
                                </button>
                              )}
                            </div>
                            {!row.isSub && row.categoryLabel && (
                              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                <span className={`statutory-category-tag ${pillClass} text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider font-bold`}>
                                  {row.categoryLabel}
                                </span>
                                {isBookmarked && (
                                  <span className="inline-flex items-center rounded bg-amber-950/60 border border-amber-500/40 px-1 py-0.2 text-[8px] font-bold text-amber-300">
                                    FAVORITE
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="statutory-matrix-col-content" style={{ width: '75%' }}>
                            <h4 className="statutory-heading font-display font-bold text-xs text-white">
                              {row.heading}
                            </h4>
                            <p className="statutory-purpose text-xs text-slate-300 tracking-normal font-sans leading-relaxed mt-0.5">
                              {row.purpose}
                            </p>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {renderGlossaryModal()}
      </div>
    );
  }

  if (activeTab === 'limits') {
    const activeLimits = getFilteredLimits();

    return (
      <div id="limits-panel" className="blueprint-view concept-focus-container space-y-6 animate-fadeIn text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 bg-emerald-50 dark:bg-emerald-950/20 text-white text-white">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/10">
              <Milestone className="h-5 w-5 text-white text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-relaxed">
                Statutory thresholds, TDS rates, exemptions, and statutory time limits. Valid for <strong className="text-white text-white">Assessment Year 2026-27 (FY 2025-26)</strong> under current legislation. All non-concessional rates are subject to surcharge and cess.
              </p>
            </div>
          </div>
          {limits.length > 0 && (
            <button
              id="export-limits-pdf"
              onClick={handleExportLimitsPDF}
              className="flex items-center gap-2 px-4 py-2.5 font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs border border-transparent transition-all cursor-pointer uppercase tracking-wider self-start sm:self-center shrink-0"
              title="Export standard rates & limits as a print-ready PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          )}
        </div>

        {/* Simple Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800">
          <div className="text-xs font-bold font-mono text-white text-white uppercase tracking-widest">
            📊 Rate Matrice Lookup ({activeLimits.length} keys loaded)
          </div>

          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-white text-white" />
            <input
              type="text"
              placeholder="Search thresholds, rates, or exemptions..."
              value={limitsSearchQuery}
              onChange={(e) => setLimitsSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-8 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500/50 focus:outline-hidden text-white text-white placeholder:text-white dark:placeholder:text-white"
            />
            {limitsSearchQuery && (
              <button
                onClick={() => setLimitsSearchQuery('')}
                className="absolute right-3 top-2.5 hover:text-white dark:hover:text-white text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Limits rates table listing */}
        <div id="limits-list-container" className="overflow-x-auto rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="dark:bg-slate-900/60 bg-slate-50 text-white text-white uppercase font-mono tracking-wider font-extrabold border-b dark:border-slate-850 border-slate-200">
                <th className="py-4 px-5" style={{ width: '40%' }}>Tax Provision / Deductions</th>
                <th className="py-4 px-5" style={{ width: '22%' }}>Threshold rate / Limit</th>
                <th className="py-4 px-5" style={{ width: '38%' }}>Statutory Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-850 divide-slate-150">
              {activeLimits.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-xs text-white italic font-bold">No active rate reference or limits match the chosen categories and search criteria.</td>
                </tr>
              ) : (
                activeLimits.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-5 font-bold text-white text-white leading-relaxed">
                      {parseRichText(item.item)}
                    </td>
                    <td className="py-4 px-5 font-mono font-white text-white text-white shrink-0">
                      {item.limitRate}
                    </td>
                    <td className="py-4 px-5 text-white text-white font-semibold leading-relaxed">
                      {parseRichText(item.remarks)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {renderGlossaryModal()}
      </div>
    );
  }

  if (activeTab === 'formulas') {
    const activeFormulas = formulas.filter(form => {
      const matchChapter = selectedChapter === 'all' || form.chapterName === selectedChapter;
      const matchQuery = chapterSearchQuery === '' || 
        form.formulaName.toLowerCase().includes(chapterSearchQuery.toLowerCase()) ||
        form.equation.toLowerCase().includes(chapterSearchQuery.toLowerCase()) ||
        form.context.toLowerCase().includes(chapterSearchQuery.toLowerCase());
      return matchChapter && matchQuery;
    });

    const chapterNames = Array.from(new Set(formulas.map(f => f.chapterName)));

    return (
      <div id="formulas-panel" className="blueprint-view concept-focus-container space-y-6 animate-fadeIn text-left">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/10 bg-indigo-50 dark:bg-indigo-950/20 text-white">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/15 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/10">
              <Calculator className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold leading-relaxed">
                Comprehensive chapter-wise formula chart for <strong className="text-white">{subjectId}</strong>. Features mathematical proofs, variable indices, and step-by-step calculations.
              </p>
            </div>
          </div>
          {formulas.length > 0 && (
            <button
              id="export-formulas-pdf"
              onClick={handleExportFormulasPDF}
              className="flex items-center gap-2 px-4 py-2.5 font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs border border-transparent transition-all cursor-pointer uppercase tracking-wider self-start sm:self-center shrink-0"
              title="Export formula chart as a print-ready PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          )}
        </div>

        {/* Index filter and search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800 relative">
          
          {/* Chapter selector dropdown */}
          <div className="relative">
            <button
              id="chapter-filter-dropdown-btn"
              onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
              className="flex items-center justify-between gap-2 px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 min-w-[200px]"
            >
              <span className="truncate">{selectedChapter === 'all' ? 'All Chapters' : selectedChapter}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>

            {isChapterDropdownOpen && (
              <>
                <div className="fixed inset-0 z-35 bg-transparent" onClick={() => setIsChapterDropdownOpen(false)} />
                <div className="absolute left-0 mt-1.5 w-72 max-h-60 overflow-y-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-40 p-1.5 divide-y divide-slate-100 dark:divide-slate-900">
                  <button
                    onClick={() => {
                      setSelectedChapter('all');
                      setIsChapterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs rounded-lg transition font-medium ${
                      selectedChapter === 'all'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 font-bold'
                        : 'text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    All Chapters ({formulas.length})
                  </button>
                  {chapterNames.map((cName, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => {
                        setSelectedChapter(cName);
                        setIsChapterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs rounded-lg transition font-medium ${
                        selectedChapter === cName
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 font-bold'
                          : 'text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {cName} ({formulas.filter(f => f.chapterName === cName).length})
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search formulas, variables, or equations..."
              value={chapterSearchQuery}
              onChange={(e) => setChapterSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-8 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500/50 focus:outline-hidden text-white placeholder:text-slate-400"
            />
            {chapterSearchQuery && (
              <button
                onClick={() => setChapterSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Formulas list rendering */}
        <div id="formulas-list" className="space-y-6">
          {activeFormulas.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 italic font-bold border border-dashed border-slate-700/55 rounded-2xl bg-slate-950/20">
              No formulas found matching the chosen chapter or search criteria.
            </div>
          ) : (
            activeFormulas.map((form, fIdx) => (
              <div 
                key={fIdx} 
                className="p-6 rounded-2xl dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-200 shadow-sm animate-fadeIn"
              >
                <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800 border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-400">{form.chapterName}</span>
                    <h4 className="font-display font-bold text-slate-900 dark:text-white text-base mt-0.5">{form.formulaName}</h4>
                  </div>
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </div>

                <div className="py-5 my-4 text-center rounded-xl bg-slate-50 dark:bg-indigo-950/20 border dark:border-indigo-900/30 border-slate-200 font-mono text-sm sm:text-base font-extrabold text-slate-950 dark:text-indigo-200 p-4 shadow-inner overflow-x-auto textbook-formula-display">
                  <span dangerouslySetInnerHTML={{ __html: form.equation }} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 font-medium leading-relaxed">{form.context}</p>

                {/* Variables list */}
                <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border dark:border-slate-900 border-slate-100">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-extrabold block mb-3 tracking-wider">Variables Identified:</span>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {form.variables.map((v, vIdx) => (
                      <div key={vIdx} className="grid grid-cols-1 sm:grid-cols-4 gap-1 text-xs py-2 first:pt-0 last:pb-0">
                        <span className="font-mono font-extrabold text-indigo-400" dangerouslySetInnerHTML={{ __html: v.name }} />
                        <span className="sm:col-span-3 text-slate-700 dark:text-slate-300 font-semibold">{v.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Worked example */}
                {form.workedExample && (
                  <div className="mt-4 p-4 rounded-xl border border-emerald-500/10 dark:bg-emerald-950/5 bg-emerald-50/30 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">Meticulous Worked Proof:</span>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-relaxed">{form.workedExample.scenario}</p>
                    <pre className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-indigo-200 border dark:border-slate-800 border-slate-200 overflow-x-auto textbook-calculation-block" dangerouslySetInnerHTML={{ __html: form.workedExample.calculation }} />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">Final Return: {form.workedExample.output}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {renderGlossaryModal()}
        <ProtectedPdfReader
          isOpen={readerState.isOpen}
          onClose={() => setReaderState(prev => ({ ...prev, isOpen: false }))}
          subjectId={subjectId}
          chapterName={readerState.chapterName}
          chapterNumber={readerState.chapterNumber}
          chapterContentNode={readerState.chapterContentNode}
        />
      </div>
    );
  }

  if (activeTab === 'standards') {
    return (
      <StandardsOnAuditingView />
    );
  }

  return null;
}
