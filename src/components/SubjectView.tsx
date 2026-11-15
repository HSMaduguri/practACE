/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SubjectId, BookmarkedSection } from '../types';
import { SUBJECTS_METADATA, FORM_ITEMS } from '../data/syllabus';
import BlueprintView from './BlueprintView';
import QuickReviewQuiz, { computeLeastRevisedChapters } from './QuickReviewQuiz';
import {
  BookOpen,
  Scale,
  Percent,
  ChevronRight,
  ChevronDown,
  Lock,
  ArrowLeft,
  Calculator,
  ShieldCheck,
  BrainCircuit,
  Zap,
  TrendingDown,
  Clock,
  FileText,
  X
} from 'lucide-react';
import { isSubjectLockedAfterFinalExam } from '../utils/taskCompletionSync';
import { StudyVaultTabId } from './StudyVaultInterconnectBar';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';
import { INTERMEDIATE_PROSPECTUS_PDFS } from '../data/intermediateSyllabusData';

export type SubjectViewTab =
  | 'blueprint'
  | 'sections'
  | 'limits'
  | 'formulas'
  | 'standards'
  | 'quick_review'
  | 'references';

interface SubjectViewProps {
  selectedSubjectId: SubjectId | null;
  setSelectedSubjectId: (id: SubjectId | null) => void;
  bookmarkedSections: BookmarkedSection[];
  onToggleBookmark: (section: BookmarkedSection) => void;
  activeTab?: SubjectViewTab;
  setActiveTab?: (tab: SubjectViewTab) => void;
  onNavigateStudyVault?: (targetTab: StudyVaultTabId, subjectId: SubjectId) => void;
  hubQuickReviewActive?: boolean;
  setHubQuickReviewActive?: (active: boolean) => void;
}

export default function SubjectView({
  selectedSubjectId,
  setSelectedSubjectId,
  bookmarkedSections,
  onToggleBookmark,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  hubQuickReviewActive: propQuickReviewActive,
  setHubQuickReviewActive: propSetQuickReviewActive,
}: SubjectViewProps) {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const [internalActiveTab, setInternalActiveTab] = useState<SubjectViewTab>('blueprint');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;
  const setActiveTab = propSetActiveTab !== undefined ? propSetActiveTab : setInternalActiveTab;

  const [internalQuickReviewActive, setInternalQuickReviewActive] = useState(false);
  const hubQuickReviewActive =
    propQuickReviewActive !== undefined ? propQuickReviewActive : internalQuickReviewActive;
  const setHubQuickReviewActive =
    propSetQuickReviewActive !== undefined ? propSetQuickReviewActive : setInternalQuickReviewActive;
  const [activeProspectusPdf, setActiveProspectusPdf] = useState<{ label: string; url: string } | null>(null);

  const subject = selectedSubjectId && !isSubjectLockedAfterFinalExam(selectedSubjectId) ? SUBJECTS_METADATA[selectedSubjectId] : null;
  const subjectProspectusPdfs =
    selectedSubjectId && selectedSubjectId in INTERMEDIATE_PROSPECTUS_PDFS
      ? INTERMEDIATE_PROSPECTUS_PDFS[selectedSubjectId as keyof typeof INTERMEDIATE_PROSPECTUS_PDFS]
      : [];

  useEffect(() => {
    if (selectedSubjectId && isSubjectLockedAfterFinalExam(selectedSubjectId)) {
      setSelectedSubjectId(null);
    }
  }, [selectedSubjectId, setSelectedSubjectId]);

  // Compute least-revised chapters summary for badges in SubjectView
  const leastRevisedPreview = useMemo(() => {
    return computeLeastRevisedChapters(selectedSubjectId).filter(m => !isSubjectLockedAfterFinalExam(m.subjectId));
  }, [selectedSubjectId, activeTab, hubQuickReviewActive, caLevel]);

  const unrevisedCount = useMemo(() => {
    return leastRevisedPreview.filter((m) => m.completedCycles === 0).length;
  }, [leastRevisedPreview]);

  // Clean full subject name helper
  const getCleanFullSubjectName = (fullName: string): string => {
    const clean = fullName.replace(/\s*\([^)]*\)\s*$/gi, '').trim();
    return clean
      .split(' ')
      .map((word) => {
        if (!word) return '';
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (['idt', 'dt', 'gst', 'huf', 'sebi', 'ibs', 'afm', 'fr', 'fmsm'].includes(cleanWord)) {
          return word.toUpperCase();
        }
        if (cleanWord === 'and') {
          return 'and';
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  // Auto-correct tab if switching subjects where tab doesn't apply
  useEffect(() => {
    if (!selectedSubjectId) return;
    const targetMetadata = SUBJECTS_METADATA[selectedSubjectId];
    if (!targetMetadata) return;
    if (activeTab === 'sections' && !targetMetadata.hasSections) {
      setActiveTab('blueprint');
    } else if (activeTab === 'limits' && !targetMetadata.hasLimits) {
      setActiveTab('blueprint');
    } else if (activeTab === 'formulas' && !(FORM_ITEMS[selectedSubjectId]?.length > 0)) {
      setActiveTab('blueprint');
    } else if (activeTab === 'standards' && selectedSubjectId !== 'Audit' && selectedSubjectId !== 'AuditInter') {
      setActiveTab('blueprint');
    }
  }, [selectedSubjectId, activeTab]);

  const handleSubjectChange = (id: SubjectId | null) => {
    if (id && isSubjectLockedAfterFinalExam(id)) return;
    setSelectedSubjectId(id);
  };

  if (selectedSubjectId === null || !subject) {
    if (hubQuickReviewActive) {
      return (
        <div className="space-y-6 animate-fadeIn pb-16 text-left">
          <div className="flex items-center justify-between max-w-fit">
            <button
              onClick={() => setHubQuickReviewActive(false)}
              className="h-9 px-4 bg-cav-card hover:bg-cav-card2 hover:border-cav-accent/40 border border-cav-border text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="h-4 w-4 text-cav-accent" />
              <span>Back to Knowledge Hub</span>
            </button>
          </div>

          <QuickReviewQuiz
            subjectId={null}
            onSelectSubjectAndBlueprint={(subId) => {
              setHubQuickReviewActive(false);
              setSelectedSubjectId(subId);
              setActiveTab('blueprint');
            }}
            onClose={() => setHubQuickReviewActive(false)}
          />
        </div>
      );
    }

    const CARD_THEMES = [
      { darkColor: 'text-violet-400', border: 'hover:border-violet-500/40 hover:bg-violet-500/5', icon: '📋' },
      { darkColor: 'text-cyan-400', border: 'hover:border-cyan-500/40 hover:bg-cyan-500/5', icon: '📊' },
      { darkColor: 'text-emerald-400', border: 'hover:border-emerald-500/40 hover:bg-emerald-500/5', icon: '🔍' },
      { darkColor: 'text-orange-400', border: 'hover:border-orange-500/40 hover:bg-orange-500/5', icon: '⚖️' },
      { darkColor: 'text-pink-400', border: 'hover:border-pink-500/40 hover:bg-pink-500/5', icon: '🏛️' },
      { darkColor: 'text-yellow-400', border: 'hover:border-yellow-500/40 hover:bg-yellow-500/5', icon: '💡' },
    ];

    const renderSubjectCard = (sub: typeof levelInfo.subjects[number], idx: number) => {
      const theme = CARD_THEMES[idx % CARD_THEMES.length];
      const isLocked = isSubjectLockedAfterFinalExam(sub.code);
      return (
        <button
          key={sub.code}
          type="button"
          disabled={isLocked}
          onClick={() => {
            if (isLocked) return;
            setSelectedSubjectId(sub.code);
            setActiveTab('blueprint');
          }}
          className={`w-full text-left p-4 rounded-xl bg-cav-card border border-cav-border transition-all flex flex-col justify-between h-[120px] group ${
            isLocked
              ? 'opacity-60 cursor-not-allowed'
              : `cursor-pointer hover:scale-[1.01] hover:shadow-md ${theme.border}`
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 h-6">
              <div className="flex items-center gap-2">
                <span className="text-lg shrink-0">{theme.icon}</span>
                <span className={`text-base font-black font-display uppercase ${theme.darkColor}`}>
                  {sub.code}
                </span>
              </div>
              {isLocked ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono font-bold text-[10px]">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {sub.paperNumber} · Blueprint
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-white leading-tight truncate">
              {sub.name}
            </h4>
          </div>

          <div className="flex items-center justify-end pt-2.5 border-t border-cav-border/50">
            {isLocked ? (
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-400" /> Exam Completed
              </span>
            ) : (
              <span className="text-[11px] font-extrabold text-violet-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Explore Syllabus <ChevronRight className="h-3 w-3" />
              </span>
            )}
          </div>
        </button>
      );
    };

    if (levelInfo.id === 'foundation' || levelInfo.id === 'cma_foundation') {
      return (
        <div className="space-y-6 animate-fadeIn pb-16 text-left">
          <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h3 className="font-display font-bold text-white text-sm tracking-tight">
                  {levelInfo.name}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                4 Papers (Papers 1 – 4)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {levelInfo.subjects.map((sub, idx) => renderSubjectCard(sub, idx))}
            </div>
          </div>
        </div>
      );
    }

    const group1Subjects = levelInfo.subjects.filter((s) => s.group === 'Group I');
    const group2Subjects = levelInfo.subjects.filter((s) => s.group === 'Group II');
    const g1Label =
      group1Subjects.length > 0
        ? `${group1Subjects[0].paperNumber} – ${group1Subjects[group1Subjects.length - 1].paperNumber.replace('Paper ', '')}`
        : 'Group I';
    const g2Label =
      group2Subjects.length > 0
        ? `${group2Subjects[0].paperNumber} – ${group2Subjects[group2Subjects.length - 1].paperNumber.replace('Paper ', '')}`
        : 'Group II';

    return (
      <div className="space-y-6 animate-fadeIn pb-16 text-left">
        {/* 2 Column Group-wise Layout (3+3 for CA Inter/Final, 4+4 for CMA Inter/Final) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group 1 Column */}
          <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h3 className="font-display font-bold text-white text-sm tracking-tight">
                  {levelInfo.id === 'cma_final' ? 'Group III (Group 1)' : 'Group 1'} ({group1Subjects.length} Papers)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {g1Label}
              </span>
            </div>
            <div className="space-y-3">
              {group1Subjects.map((sub, idx) => renderSubjectCard(sub, idx))}
            </div>
          </div>

          {/* Group 2 Column */}
          <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏛️</span>
                <h3 className="font-display font-bold text-white text-sm tracking-tight">
                  {levelInfo.id === 'cma_final' ? 'Group IV (Group 2)' : 'Group 2'} ({group2Subjects.length} Papers)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                {g2Label}
              </span>
            </div>
            <div className="space-y-3">
              {group2Subjects.map((sub, idx) => renderSubjectCard(sub, idx + group1Subjects.length))}
            </div>
          </div>
        </div>

        {/* CA Final SPOM (Self-Paced Online Modules: Sets A, B, C & D) */}
        {levelInfo.spomModules && levelInfo.spomModules.length > 0 && (
          <div className="bg-cav-card2 border border-amber-400/35 p-5 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cav-border/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📜</span>
                <h3 className="font-display font-bold text-white text-sm tracking-tight">
                  SPOM — Self-Paced Online Modules (CA Final Mandatory Requirement)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-400/30">
                Sets A, B, C &amp; D
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {levelInfo.spomModules.map((mod) => (
                <div
                  key={mod.setCode}
                  className="p-3.5 rounded-xl bg-cav-card border border-cav-border/80 flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30">
                      SPOM {mod.setCode}
                    </span>
                    <div className="text-xs font-bold text-white leading-snug">{mod.title}</div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 pt-1.5 border-t border-cav-border/50">
                    {mod.mandatoryStatus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id="subject-selector-single-column"
      className="concept-focus-container space-y-6 animate-fadeIn pb-16"
    >
      {/* Main Panel Content - fully wide list */}
      <div id="subject-main-content" className="space-y-6">
        {/* Subject Detail Header Card */}
        <div
          id="subject-header-card"
          className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-cav-accent/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-cav-accent/15 text-cav-accent font-display font-black flex items-center justify-center text-lg border border-cav-accent/25 shadow-sm">
              {selectedSubjectId}
            </div>
            <div>
              <h1 className="font-display font-black text-white text-lg sm:text-xl tracking-tight">
                {getCleanFullSubjectName(subject.fullName)}
              </h1>
              <p className="text-[10.5px] uppercase font-mono font-bold text-slate-400 mt-1">
                New Syllabus — {subject.chapters.length} Intensive Chapters Mapped
                {unrevisedCount > 0 ? ` · ${unrevisedCount} Unrevised` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10 self-start sm:self-auto">
            {subjectProspectusPdfs.map((pdfItem) => (
              <button
                key={pdfItem.url}
                type="button"
                onClick={() => setActiveProspectusPdf(pdfItem)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/45 text-amber-200 text-xs font-mono font-bold rounded-xl whitespace-nowrap shadow-xs transition cursor-pointer"
                title={`View Official ICAI Prospectus Syllabus PDF — ${pdfItem.label}`}
              >
                <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{subjectProspectusPdfs.length > 1 ? pdfItem.label.split('—')[0].trim() + ' Syllabus PDF' : 'Official ICAI Syllabus PDF'}</span>
              </button>
            ))}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-cav-card2 border border-amber-500/35 text-amber-300 text-xs font-mono font-bold rounded-xl whitespace-nowrap shadow-xs">
              <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>PDF Mode</span>
            </div>
          </div>
        </div>

        {activeProspectusPdf && (
          <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <div className="w-full max-w-5xl h-[88vh] bg-slate-900 border border-amber-400/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-mono font-extrabold text-white truncate">
                    Official ICAI Syllabus Prospectus — {activeProspectusPdf.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProspectusPdf(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Close</span>
                </button>
              </div>
              <iframe
                src={activeProspectusPdf.url}
                title={activeProspectusPdf.label}
                className="w-full flex-1 bg-white"
              />
            </div>
          </div>
        )}

        {/* Tab selector bar */}
        <div
          id="subject-tab-bar"
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-cav-card border border-cav-border w-full max-w-full overflow-hidden shadow-xs"
        >
          <button
            id="tab-btn-blueprint"
            onClick={() => setActiveTab('blueprint')}
            className={`flex-1 min-w-[140px] sm:flex-initial sm:min-w-0 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-3 sm:px-4 font-sans font-extrabold text-[11px] sm:text-xs rounded-xl uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'blueprint'
                ? 'bg-cav-accent text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-cav-card2'
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">Concept Blueprint</span>
          </button>

          {subject.hasSections && (
            <button
              id="tab-btn-sections"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 min-w-[140px] sm:flex-initial sm:min-w-0 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-3 sm:px-4 font-sans font-extrabold text-[11px] sm:text-xs rounded-xl uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'sections'
                  ? 'bg-cav-accent text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-cav-card2'
              }`}
            >
              <Scale className="h-4 w-4 shrink-0" />
              <span className="truncate">Sections &amp; Rules</span>
            </button>
          )}

          {subject.hasLimits && (
            <button
              id="tab-btn-limits"
              onClick={() => setActiveTab('limits')}
              className={`flex-1 min-w-[140px] sm:flex-initial sm:min-w-0 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-3 sm:px-4 font-sans font-extrabold text-[11px] sm:text-xs rounded-xl uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'limits'
                  ? 'bg-cav-accent text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-cav-card2'
              }`}
            >
              <Percent className="h-4 w-4 shrink-0" />
              <span className="truncate">Limits &amp; Rates</span>
            </button>
          )}

          {FORM_ITEMS[selectedSubjectId]?.length > 0 &&
            selectedSubjectId !== 'FR' && (
              <button
                id="tab-btn-formulas"
                onClick={() => setActiveTab('formulas')}
                className={`flex-1 min-w-[140px] sm:flex-initial sm:min-w-0 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-3 sm:px-4 font-sans font-extrabold text-[11px] sm:text-xs rounded-xl uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === 'formulas'
                    ? 'bg-cav-accent text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-cav-card2'
                }`}
              >
                <Calculator className="h-4 w-4 shrink-0" />
                <span className="truncate">Formula Chart</span>
              </button>
            )}

          {(selectedSubjectId === 'Audit' || selectedSubjectId === 'AuditInter') && (
            <button
              id="tab-btn-standards"
              onClick={() => setActiveTab('standards')}
              className={`flex-1 min-w-[140px] sm:flex-initial sm:min-w-0 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-3 sm:px-4 font-sans font-extrabold text-[11px] sm:text-xs rounded-xl uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'standards'
                  ? 'bg-cav-accent text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-cav-card2'
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="truncate">Standards on Auditing</span>
            </button>
          )}
        </div>

        {/* Unified panels router */}
        <div id="subject-active-panels" className="space-y-6">
          {activeTab === 'quick_review' ? (
            <QuickReviewQuiz
              subjectId={selectedSubjectId}
              onSelectSubjectAndBlueprint={(subId) => {
                setSelectedSubjectId(subId);
                setActiveTab('blueprint');
              }}
              onClose={() => setActiveTab('blueprint')}
            />
          ) : (
            <BlueprintView
              subjectId={selectedSubjectId}
              activeTab={activeTab}
              bookmarkedSections={bookmarkedSections}
              onToggleBookmark={onToggleBookmark}
            />
          )}
        </div>
      </div>
    </div>
  );
}
