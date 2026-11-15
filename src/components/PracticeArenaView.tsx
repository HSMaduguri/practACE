/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SubjectId, PracticeAttempt, SUBJECT_COLORS } from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import QuizView, { CircularProgressRing } from './QuizView';
import TheoryTestingView from './TheoryTestingView';
import FlashcardsView from './FlashcardsView';
import { QUIZ_QUESTIONS } from '../data/questions';
import { 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  BrainCircuit, 
  Sparkles,
  Target,
  CheckCircle2,
  Layers,
  Award,
  Trash2,
  Lock
} from 'lucide-react';
import { isSubjectLockedAfterFinalExam } from '../utils/taskCompletionSync';
import { StudyVaultTabId } from './StudyVaultInterconnectBar';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';
import { getLevelScopedKey, getLevelSubjectIds } from '../utils/levelStorage';

interface PracticeArenaViewProps {
  selectedSubjectId: SubjectId | null;
  setSelectedSubjectId: (id: SubjectId | null) => void;
  onRecordPractice: (attempt: PracticeAttempt) => void;
  practiceAttemptsCount?: number;
  onClearHistory?: () => void;
  onNavigateStudyVault?: (targetTab: StudyVaultTabId, subjectId: SubjectId) => void;
}

export default function PracticeArenaView({ 
  selectedSubjectId, 
  setSelectedSubjectId,
  onRecordPractice,
  practiceAttemptsCount = 0,
  onClearHistory,
  onNavigateStudyVault
}: PracticeArenaViewProps) {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const [activeTab, setActiveTab] = useState<'quiz' | 'theory' | 'flashcards'>('quiz');
  const [caseProgressMap, setCaseProgressMap] = useState<Record<string, any>>({});
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getLevelScopedKey('ca_final_case_study_attempts_v2', caLevel));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCaseProgressMap(parsed);
          return;
        }
      }
      setCaseProgressMap({});
    } catch (e) {}
  }, [caLevel]);
  
  useEffect(() => {
    if (selectedSubjectId && isSubjectLockedAfterFinalExam(selectedSubjectId)) {
      setSelectedSubjectId(null);
    }
  }, [selectedSubjectId, setSelectedSubjectId]);

  const subject = selectedSubjectId && !isSubjectLockedAfterFinalExam(selectedSubjectId) ? SUBJECTS_METADATA[selectedSubjectId] : null;

  // Compute subject scenario completion stats
  const getSubjectStats = (subId: SubjectId) => {
    const rawItems = QUIZ_QUESTIONS[subId] || [];
    const caseScenarios = rawItems.filter(item => item.type === 'case');
    const totalScenarios = caseScenarios.length || 1;
    
    let completedScenarios = 0;
    let attemptedQuestions = 0;
    let totalQuestions = 0;

    caseScenarios.forEach(item => {
      const cs = item.data;
      const subQCount = cs.subQuestions ? cs.subQuestions.length : 5;
      totalQuestions += subQCount;

      const csState = caseProgressMap[cs.id];
      if (csState && csState.answers) {
        const ansCount = Object.keys(csState.answers).length;
        attemptedQuestions += ansCount;
        if (ansCount >= subQCount) {
          completedScenarios += 1;
        }
      }
    });

    return {
      completedScenarios,
      totalScenarios,
      attemptedQuestions,
      totalQuestions: totalQuestions || 5
    };
  };

  // Clean full subject name helper
  const getCleanFullSubjectName = (fullName: string): string => {
    let clean = fullName.replace(/\s*\([^)]*\)\s*$/gi, '').trim();
    return clean
      .split(' ')
      .map(word => {
        if (!word) return '';
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (['idt', 'dt', 'gst', 'huf', 'sebi', 'ibs', 'afm', 'fr'].includes(cleanWord)) {
          return word.toUpperCase();
        }
        if (cleanWord === 'and') {
          return 'and';
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const CARD_THEMES = [
    { darkColor: 'text-violet-400', border: 'hover:border-violet-500/40 hover:bg-violet-500/5', icon: '📋' },
    { darkColor: 'text-cyan-400', border: 'hover:border-cyan-500/40 hover:bg-cyan-500/5', icon: '📊' },
    { darkColor: 'text-emerald-400', border: 'hover:border-emerald-500/40 hover:bg-emerald-500/5', icon: '🔍' },
    { darkColor: 'text-orange-400', border: 'hover:border-orange-500/40 hover:bg-orange-500/5', icon: '⚖️' },
    { darkColor: 'text-pink-400', border: 'hover:border-pink-500/40 hover:bg-pink-500/5', icon: '🏛️' },
    { darkColor: 'text-yellow-400', border: 'hover:border-yellow-500/40 hover:bg-yellow-500/5', icon: '💡' },
  ];

  const renderArenaSubjectCard = (sub: typeof levelInfo.subjects[number], idx: number) => {
    const theme = CARD_THEMES[idx % CARD_THEMES.length];
    const isLocked = isSubjectLockedAfterFinalExam(sub.code);
    return (
      <button
        key={sub.code}
        type="button"
        disabled={isLocked}
        onClick={() => {
          if (!isLocked) setSelectedSubjectId(sub.code);
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
                <Lock className="w-3 h-3" /> Locked
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-slate-400">
                MCQs · Theory · Cards
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
            <span className="text-[11px] font-extrabold text-teal-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Enter Arena <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </button>
    );
  };

  // ─── 1. SUBJECT SELECTION HUB (When no subject is active) ───
  if (selectedSubjectId === null || !subject) {
    if (levelInfo.id === 'foundation' || levelInfo.id === 'cma_foundation') {
      return (
        <div className="space-y-6 animate-fadeIn pb-16 text-left">
          <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h3 className="font-display font-bold text-white text-sm tracking-tight">
                  {levelInfo.shortName} Practice Arena (Papers 1 – 4)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Papers 1 – 4
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {levelInfo.subjects.map((sub, idx) => renderArenaSubjectCard(sub, idx))}
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
        {/* 2 Column Group-wise Layout */}
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
              {group1Subjects.map((sub, idx) => renderArenaSubjectCard(sub, idx))}
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
              {group2Subjects.map((sub, idx) => renderArenaSubjectCard(sub, idx + group1Subjects.length))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. ACTIVE SUBJECT PRACTICE ARENA (When a subject is selected) ───
  return (
    <div className="space-y-3 animate-fadeIn pb-6 text-left">
      
      {/* Row 1: Sub-tabs (Exam Quizzes | AI Theory Auditor | Flashcards) */}
      <div className="flex flex-wrap items-center justify-end gap-3 min-w-0">
        {/* Sub-tabs: 1. Exam Quizzes, 2. AI Theory Auditor, 3. Flashcards */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-cav-card border border-cav-border w-full sm:w-auto shadow-inner overflow-hidden">
          <button
            id="tab-btn-practice-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 min-w-[115px] sm:flex-initial flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-2.5 sm:px-3.5 font-sans font-extrabold text-[11px] sm:text-xs rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_12px_rgba(20,184,166,0.3)] border border-teal-400/40 font-black'
                : 'text-slate-300 hover:text-teal-300 hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Exam Quizzes</span>
          </button>

          <button
            id="tab-btn-practice-theory"
            onClick={() => setActiveTab('theory')}
            className={`flex-1 min-w-[130px] sm:flex-initial flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-2.5 sm:px-3.5 font-sans font-extrabold text-[11px] sm:text-xs rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_12px_rgba(20,184,166,0.3)] border border-teal-400/40 font-black'
                : 'text-slate-300 hover:text-teal-300 hover:bg-slate-900'
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">AI Theory Auditor</span>
          </button>

          <button
            id="tab-btn-practice-flashcards"
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 min-w-[110px] sm:flex-initial flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-0 sm:h-9 px-2.5 sm:px-3.5 font-sans font-extrabold text-[11px] sm:text-xs rounded-lg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-teal-500 text-slate-950 shadow-[0_0_12px_rgba(20,184,166,0.3)] border border-teal-400/40 font-black'
                : 'text-slate-300 hover:text-teal-300 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Flashcards</span>
          </button>
        </div>
      </div>

      {/* Row 2: Compact Subject Header + 6 Paper Quick Selector */}
      <div className="p-3 sm:px-4 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-2.5 relative z-10 min-w-0">
          <span className={`shrink-0 uppercase font-black px-2.5 py-1 rounded-lg text-xs font-mono leading-none border ${SUBJECT_COLORS[subject.id]?.bg || 'bg-teal-500/10'} ${SUBJECT_COLORS[subject.id]?.text || 'text-teal-400'} ${SUBJECT_COLORS[subject.id]?.border || 'border-teal-500/20'}`}>
            {subject.id}
          </span>
          <h2 className="font-display font-black text-white text-base sm:text-lg truncate">
            {getCleanFullSubjectName(subject.fullName)}
          </h2>
        </div>

        {/* Active Level Paper Quick Selector */}
        <div className={`grid ${levelInfo.subjects.length === 4 ? 'grid-cols-4' : 'grid-cols-6'} sm:flex sm:flex-wrap items-center gap-1 bg-cav-bg p-1 rounded-xl border border-cav-border w-full sm:w-auto shrink-0 relative z-10`}>
          {getLevelSubjectIds(caLevel).map(subId => {
            const isLocked = isSubjectLockedAfterFinalExam(subId);
            return (
              <button
                key={subId}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) setSelectedSubjectId(subId);
                }}
                title={isLocked ? `${subId} Exam Completed (Locked)` : subId}
                className={`min-h-[38px] sm:min-h-0 sm:h-8 px-1.5 sm:px-2.5 rounded-lg text-xs font-mono font-black transition flex items-center justify-center gap-1 min-w-0 ${
                  isLocked
                    ? 'text-slate-600 cursor-not-allowed opacity-60'
                    : selectedSubjectId === subId
                      ? 'bg-teal-500 text-slate-950 shadow-xs cursor-pointer'
                      : 'text-slate-300 hover:text-white hover:bg-cav-card cursor-pointer'
                }`}
              >
                {isLocked && <Lock className="h-3 w-3 text-emerald-400 shrink-0" />}
                <span className="truncate">{subId}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Practice Panel Rendering */}
      <div>
        {activeTab === 'quiz' ? (
          <QuizView 
            subjectId={selectedSubjectId} 
            subjectName={subject.fullName}
            onRecordPractice={onRecordPractice} 
          />
        ) : activeTab === 'theory' ? (
          <TheoryTestingView
            subjectId={selectedSubjectId}
            subjectName={subject.fullName}
          />
        ) : (
          <FlashcardsView
            subjectId={selectedSubjectId}
            subjectName={subject.fullName}
          />
        )}
      </div>

    </div>
  );
}
