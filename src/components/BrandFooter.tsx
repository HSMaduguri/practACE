/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import BrandMark from './BrandMark';
import { SubjectId } from '../types';
import {
  ArrowUp,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  BrainCircuit,
  Target,
  Heart,
  Users,
  ShieldCheck,
  Scale,
  Lock,
  FileCheck,
  Sparkles,
  X
} from 'lucide-react';

export type AppViewKey =
  | 'home'
  | 'dashboard'
  | 'subjects'
  | 'tasks'
  | 'revision'
  | 'pastpapers'
  | 'practice'
  | 'wellbeing'
  | 'profile'
  | 'peers'
  | 'pomodora'
  | 'references';

interface BrandFooterProps {
  currentView: AppViewKey;
  onNavigate: (view: AppViewKey) => void;
  onSelectSubject?: (subjectId: SubjectId) => void;
  onScrollTop?: () => void;
  examDate?: string;
}

type LegalDocKey = 'privacy' | 'terms' | 'disclaimer' | 'cookies';

const LEGAL_DOCUMENTS: Record<
  LegalDocKey,
  { title: string; updated: string; summary: string; points: string[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Effective 2026',
    summary:
      'practACE respects your privacy and protects your personal study records, schedules, and account information.',
    points: [
      'Study schedules, revision logs, and timer sessions are stored solely to power your personal preparation dashboard.',
      'We do not sell, rent, or share your personal data or study analytics with third-party advertisers.',
      'You may export or clear your study schedule and account records at any time from your workspace settings.'
    ]
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Effective 2026',
    summary:
      'By accessing practACE, you agree to use the platform and its curated revision materials for personal academic preparation.',
    points: [
      'Platform tools, study planners, and revision trackers are provided for individual exam preparation.',
      'Users are responsible for verifying exam dates and statutory applicability against official institute notifications.',
      'Automated scraping, redistribution, or commercial resale of platform resources is prohibited.'
    ]
  },
  disclaimer: {
    title: 'Academic & Statutory Disclaimer',
    updated: 'Effective 2026',
    summary:
      'practACE is an independent study planning and revision platform and is not affiliated with ICAI or ICMAI.',
    points: [
      'Statutory summaries, accounting standards, auditing standards, and tax provisions are curated strictly as revision aids.',
      'For authoritative text, amendments, and exam notifications, always refer to official ICAI / ICMAI publications.',
      'Automated study plans and 1.5-day sprint schedules are customizable recommendations adaptable to your pace.'
    ]
  },
  cookies: {
    title: 'Data & Local Storage Policy',
    updated: 'Effective 2026',
    summary:
      'practACE uses essential browser storage and secure authentication tokens to keep your study progress synchronized.',
    points: [
      'Local storage preserves your active timer state, daily task checklist, and custom ABC matrix preferences offline.',
      'Cloud sync is used only when you sign in to back up your preparation across devices.',
      'No third-party behavioural tracking cookies are used inside the study workspace.'
    ]
  }
};

export const BrandFooter: React.FC<BrandFooterProps> = ({
  currentView,
  onNavigate,
  onScrollTop,
  examDate
}) => {
  const currentYear = new Date().getFullYear();
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocKey | null>(null);

  const handleNavClick = (view: AppViewKey) => {
    onNavigate(view);
    onScrollTop?.();
  };

  const isFullBrandingFooter = currentView === 'home' || currentView === 'dashboard';

  if (!isFullBrandingFooter) {
    return (
      <footer
        id="global-brand-footer"
        className="w-full mt-8 border-t border-cav-border/70 bg-[#07111e] text-slate-400 font-sans select-none print:hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-center text-xs tabular-nums">
          <span>© {currentYear} practACE. All rights reserved.</span>
        </div>
      </footer>
    );
  }

  const currentDoc = activeLegalDoc ? LEGAL_DOCUMENTS[activeLegalDoc] : null;

  return (
    <footer
      id="global-brand-footer"
      className="w-full mt-10 border-t border-cav-border bg-[#07111e] text-slate-300 font-sans select-none print:hidden"
    >
      {/* Top Gold Accent Hairline */}
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d6a836]/60 to-transparent" />

      <div className="w-full max-w-7xl mx-auto px-6 pt-10 pb-8 space-y-8">
        {/* Primary 4-Column Professional Website Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-800/80">
          {/* Column 1 (4 cols): Brand Identity & Mission */}
          <div className="lg:col-span-4 space-y-3.5">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none inline-block"
              title="Return to practACE Home"
            >
              <BrandMark size="md" showIcon={true} showTagline={true} />
            </button>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Structured study planning, multi-cycle revision tracking, and past-paper practice built for CA and CMA aspirants across Foundation, Intermediate, and Final levels.
            </p>
          </div>

          {/* Column 2 (2 cols): Core Planning & Execution Suite */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-wide text-cav-accent">
              Prep &amp; Focus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'dashboard' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('tasks')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'tasks' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Study Planner</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('pomodora')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'pomodora' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Focus Timer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('revision')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'revision' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BrainCircuit className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Revision Report</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 (3 cols): practACE Library */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-wide text-cav-accent">
              practACE Library
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('subjects')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'subjects' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Knowledge Hub</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('pastpapers')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'pastpapers' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Question Bank</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('practice')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'practice' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Target className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Practice Arena</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('references')}
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${
                    currentView === 'references' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Revision Studio</span>
                </button>
              </li>
              <li className="pt-1 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('wellbeing')}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    currentView === 'wellbeing' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="h-3.5 w-3.5 shrink-0 text-rose-400/80" />
                  <span>Mind Space</span>
                </button>
                <span className="text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('peers')}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    currentView === 'peers' ? 'text-cav-accent font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="h-3.5 w-3.5 shrink-0 text-cyan-400/80" />
                  <span>Peer Lounge</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 (3 cols): Legal, Privacy & Website Launch Compliance */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-wide text-cav-accent">
              Legal &amp; Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('privacy')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('terms')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <FileCheck className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Terms of Use</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('disclaimer')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Scale className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Academic Disclaimer</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc('cookies')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span>Data &amp; Storage Policy</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal, Copyright & Back-to-Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 tabular-nums">
              <span className="font-bold text-slate-200">
                © {currentYear} practACE. All rights reserved.
              </span>
              <span className="text-slate-700">·</span>
              <span className="text-cav-accent font-semibold">
                Plan · Revise · Analyse · Correct · Track
              </span>
              {examDate && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="text-slate-400">
                    Target Exam: <strong className="text-slate-200">{examDate}</strong>
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Independent exam preparation workspace. Statutory provisions, standards, and revision references are organized for academic use.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleNavClick('profile')}
              className="px-3.5 py-1.5 rounded-lg bg-[#0d1c2d] hover:bg-[#13263d] border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              My Profile
            </button>
            <button
              type="button"
              onClick={() => onScrollTop?.()}
              className="px-3.5 py-1.5 rounded-lg bg-[#0d1c2d] hover:bg-[#16293f] border border-cav-accent/40 hover:border-cav-accent text-cav-accent hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              title="Scroll to top of page"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Compliance Modal */}
      {currentDoc && (
        <div
          onClick={() => setActiveLegalDoc(null)}
          className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#0b1829] border border-white/10 p-6 text-slate-200 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{currentDoc.title}</h3>
                <span className="text-xs text-amber-300 font-medium">{currentDoc.updated}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegalDoc(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentDoc.summary}
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              {currentDoc.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalDoc(null)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default BrandFooter;
