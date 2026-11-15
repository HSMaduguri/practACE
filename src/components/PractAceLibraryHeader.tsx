import React, { useState } from 'react';
import { BrainCircuit, Youtube, Target, FileText, Library, Layers, Zap, Trash2 } from 'lucide-react';
import { SubjectId } from '../types';
import { StudyVaultTabId } from './StudyVaultInterconnectBar';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';

interface PractAceLibraryHeaderProps {
  activePillar: StudyVaultTabId;
  selectedSubjectId: SubjectId | null;
  onSelectPillar: (pillar: StudyVaultTabId) => void;
  onSelectSubject: (subjectId: SubjectId | null) => void;
  hubQuickReviewActive?: boolean;
  onToggleQuickReview?: () => void;
  practiceAttemptsCount?: number;
  onClearPracticeHistory?: () => void;
}

const PILLARS: {
  id: StudyVaultTabId;
  label: string;
  shortDesc: string;
  icon: React.FC<{ className?: string }>;
  activeClass: string;
  inactiveIconClass: string;
  badgeClass: string;
}[] = [
  {
    id: 'subjects',
    label: 'Knowledge Hub',
    shortDesc: 'Statutory Blueprint, ICAI Summaries & Amendments',
    icon: BrainCircuit,
    activeClass: 'bg-violet-500 text-slate-950 border-violet-400 shadow-[0_0_14px_rgba(139,92,246,0.3)] font-black',
    inactiveIconClass: 'text-violet-400',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-500/35',
  },
  {
    id: 'references',
    label: 'Revision Studio',
    shortDesc: 'Curated Faculty Marathon Lectures & Fast-Track Capsules',
    icon: Youtube,
    activeClass: 'bg-red-500 text-white border-red-400 shadow-[0_0_14px_rgba(239,68,68,0.3)] font-black',
    inactiveIconClass: 'text-red-400',
    badgeClass: 'bg-red-500/15 text-red-300 border-red-500/35',
  },
  {
    id: 'practice',
    label: 'Practice Arena',
    shortDesc: 'ICAI Case Scenarios, MCQs, Theory Auditor & Flashcards',
    icon: Target,
    activeClass: 'bg-teal-500 text-slate-950 border-teal-400 shadow-[0_0_14px_rgba(20,184,166,0.3)] font-black',
    inactiveIconClass: 'text-teal-400',
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/35',
  },
  {
    id: 'pastpapers',
    label: 'Question Bank',
    shortDesc: 'Chapter-Tagged Past Papers, RTPs, MTPs & Official PDFs',
    icon: FileText,
    activeClass: 'bg-pink-500 text-slate-950 border-pink-400 shadow-[0_0_14px_rgba(236,72,153,0.3)] font-black',
    inactiveIconClass: 'text-pink-400',
    badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/35',
  },
];

const PAPER_ACCENTS = [
  {
    activeAccent: 'bg-gradient-to-r from-violet-500 to-purple-500 text-slate-950 border-violet-300 shadow-[0_0_14px_rgba(139,92,246,0.35)]',
    idleAccent: 'bg-violet-500/12 hover:bg-violet-500/24 text-violet-100 border-violet-400/40 hover:border-violet-300/75',
    paperBadgeIdle: 'text-violet-300',
  },
  {
    activeAccent: 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 border-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.35)]',
    idleAccent: 'bg-cyan-500/12 hover:bg-cyan-500/24 text-cyan-100 border-cyan-400/40 hover:border-cyan-300/75',
    paperBadgeIdle: 'text-cyan-300',
  },
  {
    activeAccent: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.35)]',
    idleAccent: 'bg-emerald-500/12 hover:bg-emerald-500/24 text-emerald-100 border-emerald-400/40 hover:border-emerald-300/75',
    paperBadgeIdle: 'text-emerald-300',
  },
  {
    activeAccent: 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950 border-orange-200 shadow-[0_0_14px_rgba(249,115,22,0.35)]',
    idleAccent: 'bg-orange-500/12 hover:bg-orange-500/24 text-orange-100 border-orange-400/40 hover:border-orange-300/75',
    paperBadgeIdle: 'text-orange-300',
  },
  {
    activeAccent: 'bg-gradient-to-r from-pink-500 to-rose-400 text-slate-950 border-pink-200 shadow-[0_0_14px_rgba(236,72,153,0.35)]',
    idleAccent: 'bg-pink-500/12 hover:bg-pink-500/24 text-pink-100 border-pink-400/40 hover:border-pink-300/75',
    paperBadgeIdle: 'text-pink-300',
  },
  {
    activeAccent: 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.38)]',
    idleAccent: 'bg-amber-500/12 hover:bg-amber-500/24 text-amber-100 border-amber-400/40 hover:border-amber-300/75',
    paperBadgeIdle: 'text-amber-300',
  },
];

export const PractAceLibraryHeader: React.FC<PractAceLibraryHeaderProps> = ({
  activePillar,
  selectedSubjectId,
  onSelectPillar,
  onSelectSubject,
  hubQuickReviewActive = false,
  onToggleQuickReview,
  practiceAttemptsCount = 0,
  onClearPracticeHistory,
}) => {
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const isFourPapers = levelInfo.subjects.length === 4;

  const subjectPapers = levelInfo.subjects.map((sub, idx) => {
    const accent = PAPER_ACCENTS[idx % PAPER_ACCENTS.length];
    return {
      id: sub.code,
      paper: sub.paper,
      fullName: sub.fullName,
      ...accent,
    };
  });

  return (
    <div className="locked-internal-header">
      <div className="locked-internal-header-card rounded-2xl bg-gradient-to-r from-[#0d2238] via-[#132b47] to-[#182942] border border-amber-400/55 ring-1 ring-white/[0.06] px-5 py-5 sm:px-7 sm:py-6 space-y-4 text-left overflow-hidden relative">
        {/* Top Luminous Tri-Tone Accent Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-400 via-violet-400 to-teal-400 opacity-90 pointer-events-none" />
        <div className="absolute -top-12 right-12 w-48 h-24 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Row 1: Title Heading + Contextual Quick Action */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 min-w-0">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/15 border border-amber-300/60 shadow-[0_0_14px_rgba(245,158,11,0.28)] flex items-center justify-center shrink-0">
                <Library className="h-5 w-5 text-amber-300" />
              </div>
              <h1 className="font-display font-black text-white text-xl sm:text-2xl tracking-tight truncate drop-shadow-xs">
                practACE Library
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/18 border border-amber-400/45 text-[11px] font-mono font-extrabold uppercase tracking-wider text-amber-300 shrink-0">
                {levelInfo.shortName} · {isFourPapers ? 'P1–P4 Unified Library' : 'P1–P6 Unified Library'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {activePillar === 'subjects' && onToggleQuickReview && (
              <button
                type="button"
                onClick={onToggleQuickReview}
                className={`header-diminish-btn w-full sm:w-auto min-h-[40px] sm:min-h-0 sm:h-10 px-4 rounded-lg text-xs font-mono font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                  hubQuickReviewActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-200 font-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/15 hover:from-amber-400 hover:to-yellow-400 text-amber-200 hover:text-slate-950 border-amber-400/50 shadow-xs'
                }`}
                title="Launch 5-Minute Active Recall Sprint across least-revised chapters"
              >
                <Zap className="h-3.5 w-3.5 shrink-0 fill-current" />
                <span className="truncate">5-Min Active Recall Sprint</span>
              </button>
            )}

            {activePillar === 'practice' && onClearPracticeHistory && practiceAttemptsCount > 0 && (
              confirmClearHistory ? (
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 bg-[#051424] border border-rose-500/40 min-h-[40px] sm:min-h-0 sm:h-10 px-3.5 rounded-lg text-xs font-mono">
                  <span className="text-rose-300 font-bold truncate">Clear {practiceAttemptsCount}?</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClearPracticeHistory();
                        setConfirmClearHistory(false);
                      }}
                      className="px-2 py-0.5 rounded bg-rose-500 hover:bg-rose-600 text-white font-bold cursor-pointer transition"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearHistory(false)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearHistory(true)}
                  className="header-diminish-btn w-full sm:w-auto flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-10 px-3.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/45 text-rose-200 text-xs font-bold cursor-pointer transition-colors whitespace-nowrap"
                  title="Reset MCQ Practice History"
                >
                  <Trash2 className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                  <span className="truncate">Reset Practice ({practiceAttemptsCount})</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Row 2: 4-Pillar Mode Switcher — Strictly 2x2 on Compact Screens, 1x4 Equal Columns on Desktop */}
        <div
          className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 rounded-xl bg-[#061322]/90 border border-slate-700/80 shadow-inner w-full min-w-0"
          role="tablist"
          aria-label="practACE Library Pillars"
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = pillar.id === activePillar;
            return (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectPillar(pillar.id)}
                className={`header-diminish-btn w-full min-h-[42px] lg:min-h-0 lg:h-10 px-3.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer min-w-0 border ${
                  isActive
                    ? pillar.activeClass
                    : 'bg-[#0c1f35]/90 border-slate-700/70 text-slate-100 hover:text-white hover:bg-[#152d49] hover:border-slate-500'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-current' : pillar.inactiveIconClass}`} />
                <span className="truncate">{pillar.label}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Structured Unified Subject Selector Bar (Symmetric Grid per Level) */}
        <div className="relative z-10 header-diminish-row pt-3 border-t border-slate-700/70 min-w-0">
          <div className={`grid gap-2 w-full min-w-0 ${isFourPapers ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-3 md:grid-cols-7'}`}>
            <button
              type="button"
              onClick={() => onSelectSubject(null)}
              className={`header-diminish-btn ${isFourPapers ? 'col-span-2 md:col-span-1' : 'col-span-3 md:col-span-1'} w-full min-h-[40px] md:min-h-0 md:h-9.5 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                selectedSubjectId === null
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-200 font-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                  : 'bg-[#08182b] hover:bg-[#122842] text-amber-200 hover:text-white border-amber-400/35'
              }`}
              title={`View All ${levelInfo.subjects.length} ${levelInfo.shortName} Papers Overview`}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">All Papers</span>
            </button>

            {subjectPapers.map((sub) => {
              const isActive = selectedSubjectId === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectSubject(sub.id)}
                  title={`Switch to ${sub.paper}: ${sub.id} — ${sub.fullName}`}
                  className={`header-diminish-btn w-full min-h-[38px] md:min-h-0 md:h-9.5 px-2.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 border cursor-pointer ${
                    isActive
                      ? `${sub.activeAccent} font-black`
                      : sub.idleAccent
                  }`}
                >
                  <span className={`text-[10px] font-extrabold shrink-0 ${isActive ? 'opacity-90' : sub.paperBadgeIdle}`}>
                    {sub.paper}
                  </span>
                  <span className="truncate">{sub.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractAceLibraryHeader;
