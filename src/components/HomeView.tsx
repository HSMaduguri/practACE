/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FocusSession, PracticeAttempt } from '../types';
import { CALevel } from '../data/curriculumLevels';

import BrandMark from './BrandMark';

export type AppViewId =
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

interface HomeViewProps {
  onNavigate: (view: AppViewId) => void;
  examDate?: string;
  attemptLabel?: string;
  daysLeft?: number | null;
  caLevel?: CALevel;
  focusSessions?: FocusSession[];
  practiceAttempts?: PracticeAttempt[];
  userName?: string | null;
  onOpenSearch?: () => void;
  onTriggerSignIn?: () => void;
}

const SESSION_KEY_WELCOME_PLAYED = 'practca_welcome_intro_played_v1';
let hasPlayedWelcomeIntroInMemory = false;

function hasWelcomeIntroAlreadyPlayed(): boolean {
  if (hasPlayedWelcomeIntroInMemory) return true;
  try {
    if (sessionStorage.getItem(SESSION_KEY_WELCOME_PLAYED) === '1') {
      hasPlayedWelcomeIntroInMemory = true;
      return true;
    }
  } catch {}
  return false;
}

function markWelcomeIntroPlayed(): void {
  hasPlayedWelcomeIntroInMemory = true;
  try {
    sessionStorage.setItem(SESSION_KEY_WELCOME_PLAYED, '1');
  } catch {}
}

export default function HomeView({
  onNavigate,
  onOpenSearch
}: HomeViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'syllabus'>('all');
  const [introPhase, setIntroPhase] = useState<'center' | 'docking' | 'reveal'>(() =>
    hasWelcomeIntroAlreadyPlayed() ? 'reveal' : 'center'
  );
  const [founderImgLoaded, setFounderImgLoaded] = useState(false);

  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'auto' });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (hasWelcomeIntroAlreadyPlayed()) {
      setIntroPhase('reveal');
      return;
    }

    markWelcomeIntroPlayed();
    setIntroPhase('center');

    const dockTimer = window.setTimeout(() => {
      setIntroPhase('docking');
    }, 7800);

    const revealTimer = window.setTimeout(() => {
      setIntroPhase('reveal');
    }, 8450);

    return () => {
      window.clearTimeout(dockTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    if (introPhase !== 'docking') return;
    const timer = window.setTimeout(() => {
      setIntroPhase('reveal');
    }, 650);
    return () => window.clearTimeout(timer);
  }, [introPhase]);

  const handleSkipIntro = () => {
    markWelcomeIntroPlayed();
    if (introPhase === 'center') {
      setIntroPhase('docking');
    } else if (introPhase === 'docking') {
      setIntroPhase('reveal');
    }
  };

  const getCardOpacity = (category: 'core' | 'syllabus') => {
    if (activeFilter === 'all') return 'opacity-100';
    return activeFilter === category ? 'opacity-100' : 'opacity-40';
  };

  const isCenterPhase = introPhase === 'center';
  const isRevealPhase = introPhase === 'reveal';

  const featureOfferings: {
    title: string;
    badge: string;
    description: string;
    footerLabel: string;
    icon: string;
    accentText: string;
    accentBg: string;
    category: 'core' | 'syllabus';
    onClick: () => void;
  }[] = [
    {
      title: 'Focus Timer & Study Overlay',
      badge: 'Real-Time Sync',
      description:
        'Track study hours alongside lectures with an always-on timer that auto-logs your revision progress.',
      footerLabel: 'Open Focus Timer',
      icon: 'timelapse',
      accentText: 'text-[#f59e0b]',
      accentBg: 'bg-[#f59e0b]/15',
      category: 'core',
      onClick: () => onNavigate('pomodora')
    },
    {
      title: 'Adaptive Study Planner',
      badge: 'Auto Roadmap',
      description:
        'Schedule daily targets and auto-generate your 1.5-day pre-exam revision plan from your exam dates.',
      footerLabel: 'Open Study Planner',
      icon: 'calendar_today',
      accentText: 'text-[#ffc174]',
      accentBg: 'bg-[#ffc174]/15',
      category: 'core',
      onClick: () => onNavigate('tasks')
    },
    {
      title: 'Multi-Stage Revision Tracker',
      badge: 'Baseline to R3',
      description:
        'Track chapter completion across initial study and three revision cycles for every paper.',
      footerLabel: 'Open Revision Report',
      icon: 'insights',
      accentText: 'text-[#56e5a9]',
      accentBg: 'bg-[#56e5a9]/15',
      category: 'syllabus',
      onClick: () => onNavigate('revision')
    },
    {
      title: 'Statutory Notes & Video Vault',
      badge: 'Curated Library',
      description:
        'Review concise statutory summaries paired with chapter-wise faculty revision lectures.',
      footerLabel: 'Open Revision Studio',
      icon: 'menu_book',
      accentText: 'text-[#ffc174]',
      accentBg: 'bg-[#ffc174]/15',
      category: 'syllabus',
      onClick: () => onNavigate('references')
    },
    {
      title: 'Past Paper & RTP Archive',
      badge: 'Chapter-Indexed',
      description:
        'Practice Past Papers, RTPs, and MTPs with priority bookmarking for exam-eve review.',
      footerLabel: 'Browse Question Bank',
      icon: 'library_books',
      accentText: 'text-[#7bd0ff]',
      accentBg: 'bg-[#7bd0ff]/15',
      category: 'syllabus',
      onClick: () => onNavigate('pastpapers')
    },
    {
      title: 'Timed Practice Arena',
      badge: 'Exam Simulation',
      description:
        'Build exam speed with timed MCQs, case scenarios, and daily answer-writing drills.',
      footerLabel: 'Open Practice Arena',
      icon: 'history_edu',
      accentText: 'text-[#7bd0ff]',
      accentBg: 'bg-[#7bd0ff]/15',
      category: 'syllabus',
      onClick: () => onNavigate('practice')
    },
    {
      title: 'Instant Syllabus Search',
      badge: 'Quick Lookup',
      description:
        'Jump directly to any Accounting or Auditing Standard, tax section, or chapter across your syllabus.',
      footerLabel: 'Search Syllabus',
      icon: 'search',
      accentText: 'text-[#7bd0ff]',
      accentBg: 'bg-[#7bd0ff]/15',
      category: 'core',
      onClick: () => (onOpenSearch ? onOpenSearch() : onNavigate('subjects'))
    },
    {
      title: 'Rest & Peer Network',
      badge: 'Balanced Pace',
      description:
        'Sustain daily momentum with guided rest timers, sleep logs, and an accountability peer group.',
      footerLabel: 'Open Mind Space',
      icon: 'self_improvement',
      accentText: 'text-[#56e5a9]',
      accentBg: 'bg-[#56e5a9]/15',
      category: 'core',
      onClick: () => onNavigate('wellbeing')
    }
  ];

  return (
    <div
      className={`relative flex flex-col w-full font-sans bg-[#051424] text-[#d4e4fa] antialiased selection:bg-[#f59e0b] selection:text-[#472a00] overflow-x-hidden ${
        !isRevealPhase ? 'min-h-screen max-h-screen overflow-y-hidden' : 'min-h-screen'
      }`}
    >
      {/* Full-Screen Intro Curtain (Shown Only on First Visit) */}
      <div
        onClick={handleSkipIntro}
        className={`fixed inset-0 z-[90] bg-[#051424] transition-opacity duration-700 ease-out ${
          isRevealPhase ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'
        }`}
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-[#EAC15A]/[0.06] blur-3xl pointer-events-none" />
        {!isRevealPhase && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipIntro();
            }}
            className="absolute bottom-8 right-8 px-4 py-2 text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] bg-[#0d1c2d]/90 hover:bg-[#122131] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Skip Intro
          </button>
        )}
      </div>

      {/* Top BrandMark Showcase + Single "Enter Platform" Button */}
      <div
        onClick={!isRevealPhase ? handleSkipIntro : undefined}
        className={`relative z-[100] w-full pt-8 pb-4 px-6 flex flex-col items-center justify-center transition-colors duration-500 ${
          isRevealPhase ? 'bg-transparent' : 'bg-transparent cursor-pointer'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto relative flex flex-col sm:flex-row items-center justify-center gap-4">
          <div
            className={`flex flex-col items-center justify-center transition-transform duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isCenterPhase ? 'translate-y-[26vh]' : 'translate-y-0'
            }`}
          >
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center ${
                isCenterPhase
                  ? 'max-h-16 opacity-100 mb-2 sm:mb-3'
                  : 'max-h-0 opacity-0 mb-0 pointer-events-none'
              }`}
            >
              <span className="text-base sm:text-lg md:text-xl font-medium tracking-[0.04em] text-[#e2e8f0] antialiased">
                Welcome to
              </span>
            </div>

            <BrandMark
              showIcon
              showTagline
              animated={isCenterPhase}
              align="center"
              onClick={!isRevealPhase ? handleSkipIntro : undefined}
              svgClassName={`transition-[height] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isCenterPhase
                  ? 'h-24 sm:h-32 md:h-40 lg:h-48'
                  : 'h-14 sm:h-16 md:h-20'
              }`}
            />
          </div>

          <div
            className={`sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 transition-all duration-500 ${
              isRevealPhase
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('dashboard');
              }}
              animate={{ backgroundColor: '#f59e0b', color: '#451a03' }}
              whileHover={{ scale: 1.03, backgroundColor: '#fbbf24', color: '#451a03' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="h-11 px-5 rounded-xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_-4px_rgba(245,158,11,0.45)] group cursor-pointer whitespace-nowrap"
            >
              <span>Enter Platform</span>
              <span className="material-symbols-outlined text-[17px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col w-full transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isRevealPhase
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8 pointer-events-none select-none'
        }`}
      >
        {/* SECTION 1: Hero Proposition & Closed-Loop Workflow */}
        <section className="relative w-full px-6 pt-6 pb-12 overflow-hidden">
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-[#7bd0ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-[#ffc174]">
                  <span>Open for All CA Students</span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-[#56e5a9]">CMA Students (Coming Soon)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl xl:text-[42px] xl:leading-[50px] font-extrabold text-[#F8FAFC] leading-tight tracking-[-0.025em] [text-wrap:balance]">
                  Structured execution for your entire professional exam preparation.
                  <span className="block text-[#f59e0b] mt-1.5">
                    Built from firsthand exam experience.
                  </span>
                </h1>

                <p className="text-[15px] sm:text-[16px] leading-[25px] text-[#d8c3ad] max-w-2xl">
                  <strong className="text-[#F8FAFC] font-semibold">practACE</strong> unifies study planning, focus tracking, multi-cycle revision, and past-paper practice into one workspace—from Day 1 through your final 1.5-day exam sprint.
                </p>

                {/* Primary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-xl">
                  <motion.button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    animate={{ backgroundColor: '#f59e0b', color: '#451a03' }}
                    whileHover={{ scale: 1.02, backgroundColor: '#fbbf24', color: '#451a03' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="h-12 px-5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)] group cursor-pointer whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[19px]">space_dashboard</span>
                    <span>Enter Dashboard</span>
                    <span className="material-symbols-outlined text-[17px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => onNavigate('subjects')}
                    animate={{ backgroundColor: '#0d1c2d', color: '#d4e4fa' }}
                    whileHover={{ scale: 1.02, backgroundColor: '#122131', color: '#ffc174' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="h-12 px-5 rounded-xl text-[13px] font-semibold border border-white/[0.06] flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[19px] text-[#7bd0ff]">menu_book</span>
                    <span>Explore Knowledge Hub</span>
                    <span className="material-symbols-outlined text-[17px] text-[#7bd0ff] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* 3 Aligned Key Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-[#0d1c2d] border border-white/[0.06] flex flex-col justify-center">
                  <span className="text-base font-bold text-[#F8FAFC] tabular-nums">
                    Full-Cycle Roadmap
                  </span>
                  <span className="text-xs text-[#94a3b8] mt-1">
                    Day 1 to Final Exam
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0d1c2d] border border-white/[0.06] flex flex-col justify-center">
                  <span className="text-base font-bold text-[#56e5a9] tabular-nums">
                    Auto-Synced Logs
                  </span>
                  <span className="text-xs text-[#94a3b8] mt-1">
                    Timer Linked to Revisions
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#0d1c2d] border border-white/[0.06] flex flex-col justify-center">
                  <span className="text-base font-bold text-[#7bd0ff] tabular-nums">
                    1.5-Day Sprint
                  </span>
                  <span className="text-xs text-[#94a3b8] mt-1">
                    Automated Pre-Exam Plans
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Closed-Loop System Summary */}
            <div className="lg:col-span-5 flex">
              <div className="w-full rounded-2xl bg-[#0d1c2d] border border-white/[0.06] p-6 flex flex-col justify-between gap-5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#f59e0b]/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#7bd0ff]/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
                  <span className="text-xs font-bold text-[#F8FAFC] tracking-wide">
                    Preparation Workflow
                  </span>
                  <span className="text-[#ffc174] text-xs font-semibold">
                    Closed-Loop System
                  </span>
                </div>

                <div className="relative z-10 grid grid-cols-1 gap-3 my-auto">
                  <div
                    onClick={() => onNavigate('subjects')}
                    className="p-3.5 rounded-xl bg-[#122131] hover:bg-[#172a3e] border border-white/[0.04] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-[#F8FAFC] truncate">
                          01. Learn Concepts
                        </div>
                        <div className="text-xs text-[#94a3b8] truncate">
                          Statutory summaries, standards &amp; tax laws
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#ffc174] shrink-0">
                      All Levels
                    </span>
                  </div>

                  <div
                    onClick={() => onNavigate('pomodora')}
                    className="p-3.5 rounded-xl bg-[#122131] hover:bg-[#172a3e] border border-white/[0.04] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#7bd0ff]/15 text-[#7bd0ff] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">timelapse</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-[#F8FAFC] truncate">
                          02. Track Revisions
                        </div>
                        <div className="text-xs text-[#94a3b8] truncate">
                          Focus timer synced to R1–R3 logs
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#56e5a9] shrink-0">Auto-Log</span>
                  </div>

                  <div
                    onClick={() => onNavigate('pastpapers')}
                    className="p-3.5 rounded-xl bg-[#122131] hover:bg-[#172a3e] border border-white/[0.04] transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#56e5a9]/15 text-[#56e5a9] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">history_edu</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-[#F8FAFC] truncate">
                          03. Practice Papers
                        </div>
                        <div className="text-xs text-[#94a3b8] truncate">
                          Past Papers, RTPs, MTPs &amp; Timed Drills
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#7bd0ff] shrink-0">Exam-Ready</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-[#051424]/80 border border-white/[0.05] rounded-xl gap-3">
                  <BrandMark size="sm" showIcon />
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-[#f59e0b] font-bold block">
                      CA All Levels · CMA Soon
                    </span>
                    <span className="text-xs text-[#d8c3ad] font-medium block">
                      Foundation · Intermediate · Final
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Supported Professional Streams (3 Blocks: CA/CMA Foundation, CA/CMA Inter, CA/CMA Final) */}
        <section className="w-full px-6 py-6 bg-transparent">
          <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-2.5">
              <span className="text-xs font-bold text-[#ffc174] tracking-wide">
                Supported Professional Streams
              </span>
              <span className="text-xs text-[#94a3b8]">
                Open for All CA Students · CMA Launching Soon
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
              {[
                {
                  title: 'CA / CMA Foundation',
                  meta: 'CA: 4 · CMA: 4 Papers',
                  detail: '4 core papers in both CA (P1–P4) & CMA (P1–P4) covering accounting, laws, maths & economics.'
                },
                {
                  title: 'CA / CMA Inter',
                  meta: 'CA: 3+3 · CMA: 4+4 Papers',
                  detail: 'CA Inter 3+3 papers (P1–P6) and CMA Inter 4+4 papers (P5–P12) across Group I & Group II.'
                },
                {
                  title: 'CA / CMA Final',
                  meta: 'CA: 3+3+SPOM · CMA: 4+4',
                  detail: 'CA Final 3+3 papers + SPOM (Sets A–D) and CMA Final 4+4 papers (P13–P20) across both groups.'
                }
              ].map((stream) => (
                <motion.button
                  key={stream.title}
                  type="button"
                  onClick={() => onNavigate('subjects')}
                  animate={{ backgroundColor: '#0d1c2d' }}
                  whileHover={{ scale: 1.015, backgroundColor: '#122131' }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="h-full p-4 rounded-xl border border-white/[0.06] flex flex-col items-start justify-between text-left cursor-pointer"
                >
                  <div className="w-full flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#F8FAFC]">
                      {stream.title}
                    </span>
                    <span className="text-xs font-semibold text-[#ffc174]">
                      {stream.meta}
                    </span>
                  </div>
                  <span className="text-xs text-[#94a3b8] mt-1.5 line-clamp-2 w-full">
                    {stream.detail}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: Core Modules (4x2 Aligned Grid) */}
        <section className="w-full px-6 py-10 bg-transparent" id="features-grid">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-7 gap-5">
              <div>
                <div className="text-[#ffc174] text-xs font-bold tracking-wide mb-1">
                  Platform Capabilities
                </div>
                <h2 className="text-2xl sm:text-[28px] leading-tight font-bold text-[#F8FAFC] tracking-[-0.02em]">
                  Core Preparation Modules
                </h2>
                <p className="text-[14px] leading-[22px] text-[#94a3b8] mt-1 max-w-xl">
                  Eight focused tools built to replace manual spreadsheets and keep daily study on track.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0d1c2d] border border-white/[0.06] shrink-0 self-start lg:self-end">
                {[
                  { id: 'all' as const, label: 'All Modules' },
                  { id: 'core' as const, label: 'Planning & Focus' },
                  { id: 'syllabus' as const, label: 'Revision & Practice' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    animate={{
                      backgroundColor: activeFilter === tab.id ? '#f59e0b' : 'rgba(18, 33, 49, 0)',
                      color: activeFilter === tab.id ? '#451a03' : '#d4e4fa'
                    }}
                    whileHover={{
                      backgroundColor: activeFilter === tab.id ? '#fbbf24' : '#122131',
                      color: activeFilter === tab.id ? '#451a03' : '#ffc174'
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="px-3.5 py-2 text-xs rounded-lg font-semibold cursor-pointer whitespace-nowrap text-center"
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {featureOfferings.map((item) => (
                <motion.div
                  key={item.title}
                  onClick={item.onClick}
                  animate={{ backgroundColor: '#0d1c2d' }}
                  whileHover={{ scale: 1.015, backgroundColor: '#122131' }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                  className={`h-full p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between group cursor-pointer transition-opacity ${getCardOpacity(
                    item.category
                  )}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.accentBg} ${item.accentText} flex items-center justify-center shrink-0`}
                      >
                        <span className="material-symbols-outlined text-[21px]">{item.icon}</span>
                      </div>
                      <span className={`text-xs font-semibold ${item.accentText}`}>
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-[15px] leading-[21px] font-bold text-[#F8FAFC] group-hover:text-[#ffc174] transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-[20px] text-[#d8c3ad]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#7bd0ff] group-hover:text-[#ffc174] transition-colors">
                    <span>{item.footerLabel}</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: 3-Phase Preparation Lifecycle */}
        <section className="w-full px-6 py-10 bg-transparent" id="preparation-phases">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-4">
              <div>
                <div className="text-xs text-[#f59e0b] font-bold tracking-wide mb-1">
                  Preparation Roadmap
                </div>
                <h2 className="text-2xl sm:text-[28px] leading-tight font-bold text-[#F8FAFC] tracking-[-0.02em]">
                  Three-Phase Study Structure
                </h2>
                <p className="text-[14px] leading-[22px] text-[#94a3b8] mt-1 max-w-xl">
                  A clear progression from initial syllabus coverage to your final 1.5-day exam sprint.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              <div className="h-full p-6 rounded-2xl bg-[#0d1c2d] border border-white/[0.06] flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f59e0b] tabular-nums">
                      01. First Read
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#f59e0b]">desktop_windows</span>
                  </div>
                  <h3 className="text-[17px] leading-[24px] font-bold text-[#F8FAFC]">
                    Foundation &amp; Syllabus Completion
                  </h3>
                  <p className="text-[13px] leading-[20px] text-[#d8c3ad]">
                    Complete lectures and core concepts with daily chapter targets and centralized notes.
                  </p>
                </div>
                <ul className="mt-5 pt-4 border-t border-white/[0.06] space-y-2 text-xs text-[#d4e4fa]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#56e5a9] shrink-0">check_circle</span>
                    <span>Always-on focus timer for lectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#56e5a9] shrink-0">check_circle</span>
                    <span>Chapter-wise notes &amp; video links</span>
                  </li>
                </ul>
              </div>

              <div className="h-full p-6 rounded-2xl bg-[#0d1c2d] border border-white/[0.06] flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7bd0ff] tabular-nums">
                      02. R1–R3 Cycles
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#7bd0ff]">military_tech</span>
                  </div>
                  <h3 className="text-[17px] leading-[24px] font-bold text-[#F8FAFC]">
                    Revision Cycles &amp; Practice
                  </h3>
                  <p className="text-[13px] leading-[20px] text-[#d8c3ad]">
                    Strengthen recall through R1–R3 revision cycles, past papers, and timed writing.
                  </p>
                </div>
                <ul className="mt-5 pt-4 border-t border-white/[0.06] space-y-2 text-xs text-[#d4e4fa]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#56e5a9] shrink-0">check_circle</span>
                    <span>Auto-synced R1–R3 revision logs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#56e5a9] shrink-0">check_circle</span>
                    <span>Bookmarked high-priority questions</span>
                  </li>
                </ul>
              </div>

              <div className="h-full p-6 rounded-2xl bg-[#0d1c2d] border border-white/[0.06] flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#56e5a9] tabular-nums">
                      03. Exam Window
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#56e5a9]">bolt</span>
                  </div>
                  <h3 className="text-[17px] leading-[24px] font-bold text-[#F8FAFC]">
                    1.5-Day Final Sprint
                  </h3>
                  <p className="text-[13px] leading-[20px] text-[#d8c3ad]">
                    Execute the final 36 hours before each exam with pre-planned chapter time blocks.
                  </p>
                </div>
                <ul className="mt-5 pt-4 border-t border-white/[0.06] space-y-2 text-xs text-[#d4e4fa]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#56e5a9] shrink-0">check_circle</span>
                    <span>Auto-allocated 1.5-day schedules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#56e5a9] shrink-0">check_circle</span>
                    <span>Built-in rest and recovery timers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: About the Founder & Dedicated Founder Portrait Space */}
        <section className="w-full px-6 pt-8 pb-20 bg-transparent" id="founder-story">
          <div className="max-w-7xl mx-auto rounded-2xl bg-[#0d1c2d] border border-white/[0.06] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Static Dedicated Portrait Frame for the Founder */}
              <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
                <div className="relative w-44 h-56 sm:w-48 sm:h-60 rounded-2xl bg-gradient-to-b from-[#122131] to-[#071320] border border-[#f59e0b]/35 overflow-hidden flex flex-col items-center justify-center shadow-xl shrink-0">
                  <img
                    src="/founder-photo.jpg"
                    alt="Founder of practACE"
                    referrerPolicy="no-referrer"
                    onLoad={() => setFounderImgLoaded(true)}
                    onError={() => setFounderImgLoaded(false)}
                    className={`w-full h-full object-cover ${founderImgLoaded ? 'block' : 'hidden'}`}
                  />
                  {!founderImgLoaded && (
                    <div className="p-5 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#f59e0b] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">person</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#F8FAFC] block">
                          Founder Portrait
                        </span>
                        <span className="text-[11px] text-[#94a3b8] block">
                          Creator, practACE
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* About the Founder Note */}
              <div className="lg:col-span-6 flex flex-col space-y-3.5 text-center lg:text-left">
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#f59e0b] tracking-wide">
                  <span>About the Founder</span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-[#ffc174]">Founder&apos;s Note</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-[-0.02em] [text-wrap:balance]">
                  Built from firsthand experience of the professional exam preparation grind.
                </h3>

                <p className="text-[14px] leading-[22px] text-[#d8c3ad]">
                  &ldquo;During my own exam preparation, I experienced how much time and mental energy gets lost managing disconnected spreadsheets, scattered revision videos, and last-minute 1.5-day exam plans. I built <strong className="text-[#F8FAFC] font-semibold">practACE</strong> so fellow aspirants can focus entirely on conceptual clarity, disciplined revisions, and past-paper practice within one calm workspace.&rdquo;
                </p>

                <div className="pt-1 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-1 sm:gap-3 text-xs">
                  <span className="font-bold text-[#F8FAFC]">
                    Founder &amp; Creator, practACE
                  </span>
                  <span className="hidden sm:inline text-slate-600" aria-hidden="true">·</span>
                  <span className="text-[#94a3b8]">
                    For All CA Students &amp; CMA Students (Coming Soon)
                  </span>
                </div>
              </div>

              {/* Aligned Primary Actions */}
              <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <motion.button
                  type="button"
                  onClick={() => onNavigate('subjects')}
                  animate={{ backgroundColor: '#f59e0b', color: '#451a03' }}
                  whileHover={{ scale: 1.02, backgroundColor: '#fbbf24', color: '#451a03' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="h-12 px-5 rounded-xl font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)] cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>Open Knowledge Hub</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => onNavigate('tasks')}
                  animate={{ backgroundColor: '#122131', color: '#d4e4fa' }}
                  whileHover={{ scale: 1.02, backgroundColor: '#172a3e', color: '#ffc174' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="h-12 px-5 rounded-xl font-semibold text-xs sm:text-[13px] border border-white/[0.06] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#7bd0ff]">calendar_today</span>
                  <span>Open Study Planner</span>
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
