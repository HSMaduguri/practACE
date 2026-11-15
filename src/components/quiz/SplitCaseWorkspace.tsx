/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CaseScenario, CaseSubQuestion } from '../../types';
import { 
  FileText, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  HelpCircle,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';

interface SplitCaseWorkspaceProps {
  scenario: CaseScenario;
  orderedSubQuestions: CaseSubQuestion[];
  currentSubIndex: number;
  onNavigateSubQuestion: (index: number) => void;
  selectedOptionIndex?: number; // active selected option for current sub-question
  onSelectOption: (optionIndex: number) => void;
  onClearResponse: () => void;
  onMarkForReview: () => void;
  isMarkedForReview: boolean;
  onSaveAndNext: () => void;
  onCompleteCase?: () => void;
  isPracticeMode?: boolean;
  isAnswerLocked?: boolean;
  correctOptionIndex?: number;
  explanation?: string;
  aiExplanation?: string;
  isLoadingAi?: boolean;
  onRequestAiExplanation?: () => void;
  answeredCount: number;
  totalSubQuestions: number;
}

export default function SplitCaseWorkspace({
  scenario,
  orderedSubQuestions,
  currentSubIndex,
  onNavigateSubQuestion,
  selectedOptionIndex,
  onSelectOption,
  onClearResponse,
  onMarkForReview,
  isMarkedForReview,
  onSaveAndNext,
  onCompleteCase,
  isPracticeMode = true,
  isAnswerLocked = false,
  correctOptionIndex,
  explanation,
  aiExplanation,
  isLoadingAi = false,
  onRequestAiExplanation,
  answeredCount,
  totalSubQuestions
}: SplitCaseWorkspaceProps) {
  // Local UI state
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [passageSearch, setPassageSearch] = useState('');
  const [mobileTab, setMobileTab] = useState<'passage' | 'question'>('question');
  const [showExplanation, setShowExplanation] = useState(isAnswerLocked);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const currentSubQ = orderedSubQuestions[currentSubIndex];

  // Font size classes
  const fontClass = fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  // Highlight search matches in passage with unique keys
  const highlightedPassage = useMemo(() => {
    if (!passageSearch.trim()) return scenario.scenarioText;
    const query = passageSearch.trim();
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return scenario.scenarioText.split(regex).map((part, i) => 
      regex.test(part) ? (
        <mark key={`mark-${i}`} className="bg-cyan-500/30 text-cyan-200 px-0.5 rounded font-bold">
          {part}
        </mark>
      ) : (
        <span key={`txt-${i}`}>{part}</span>
      )
    );
  }, [scenario.scenarioText, passageSearch]);

  const handleCopyPassage = () => {
    navigator.clipboard.writeText(scenario.scenarioText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const isLastQuestion = currentSubIndex === orderedSubQuestions.length - 1;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Mobile Tab Switcher (< 1024px) - Clean Grid with Zero Scrollbar */}
      <div className="lg:hidden grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full no-scrollbar">
        <button
          onClick={() => setMobileTab('passage')}
          className={`py-2 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'passage'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Case Passage
        </button>
        <button
          onClick={() => setMobileTab('question')}
          className={`py-2 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'question'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Question {currentSubIndex + 1}/{totalSubQuestions}
        </button>
      </div>

      {/* Main Split-Screen Workspace Grid - 50/50 Balanced Optimal View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full max-w-full">
        
        {/* LEFT COLUMN: Case Study Passage & Statutory Context */}
        <div className={`flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md w-full ${
          mobileTab === 'question' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Passage Header & Tools */}
          <div className="p-4 border-b border-slate-800/90 bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {scenario.chapterName}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {scenario.id}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {totalSubQuestions} Questions • {totalSubQuestions * 2} Marks
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-sm mt-1">
                {scenario.scenarioTitle}
              </h3>
            </div>

            {/* Font Zoom & Search Toolbar */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setFontSize(prev => prev === 'lg' ? 'base' : 'sm')}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white text-xs font-mono font-bold"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(prev => prev === 'sm' ? 'base' : 'lg')}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white text-xs font-mono font-bold"
                title="Increase font size"
              >
                A+
              </button>
              <button
                onClick={handleCopyPassage}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                title="Copy full passage"
              >
                {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Passage Search Filter */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/30 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Find statutory term or number in passage..."
              value={passageSearch}
              onChange={(e) => setPassageSearch(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full font-mono"
            />
            {passageSearch && (
              <button
                onClick={() => setPassageSearch('')}
                className="text-slate-500 hover:text-slate-300 text-[10px] font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Passage Scroll Area - No Scrollbar */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[620px] no-scrollbar">
            <div className={`text-slate-300 leading-relaxed font-sans whitespace-pre-wrap ${fontClass}`}>
              {highlightedPassage}
            </div>
          </div>

          {/* Passage Footer Hint */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/30 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Passage applies to all {totalSubQuestions} questions in this case scenario</span>
            <span className="text-cyan-400 font-bold">ICAI Case Study Reference</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Question & Exam Controls */}
        <div className={`flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-md w-full ${
          mobileTab === 'passage' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Sub-Question Selector Pills Bar - Zero Scrollbar */}
          <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center justify-between gap-2 no-scrollbar">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1">
                Sub-Q:
              </span>
              {orderedSubQuestions.map((sq, idx) => {
                const isActive = idx === currentSubIndex;
                return (
                  <button
                    key={`subq-tab-${sq.id || 'sq'}-${idx}`}
                    onClick={() => onNavigateSubQuestion(idx)}
                    className={`h-7 px-2.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 ring-1 ring-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] font-mono text-slate-400 shrink-0">
              <span className="text-emerald-400 font-bold">{answeredCount}</span> of {totalSubQuestions} answered
            </div>
          </div>

          {/* Question Area - No Scrollbar */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[620px] space-y-5 no-scrollbar">
            {currentSubQ ? (
              <>
                {/* Question Meta Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Question {currentSubIndex + 1} of {totalSubQuestions}
                    </span>
                    {isMarkedForReview && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 fill-purple-400" />
                        Marked For Review
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Marks: <strong className="text-emerald-400">+2.0</strong> / <span className="text-slate-500">-0.0</span>
                  </span>
                </div>

                {/* Question Statement */}
                <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed font-sans whitespace-pre-wrap">
                  {currentSubQ.questionText}
                </div>

                {/* Option Cards A, B, C, D */}
                <div className="space-y-2.5 pt-1">
                  {currentSubQ.options.map((optText, oIdx) => {
                    const isSelected = selectedOptionIndex === oIdx;
                    const isLocked = isAnswerLocked;
                    const isCorrect = correctOptionIndex !== undefined && oIdx === correctOptionIndex;

                    let cardStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-200';

                    if (isLocked && correctOptionIndex !== undefined) {
                      if (isCorrect) {
                        cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
                      } else if (isSelected) {
                        cardStyle = 'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold';
                      } else {
                        cardStyle = 'border-slate-900 opacity-40 text-slate-500';
                      }
                    } else if (isSelected) {
                      cardStyle = 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400 font-semibold shadow-sm';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => !isLocked && onSelectOption(oIdx)}
                        disabled={isLocked}
                        className={`w-full p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                      >
                        <span className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold border transition-colors ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-snug pt-0.5 flex-1">{optText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Statutory Solution & AI Auditor Drawer (Practice Mode) */}
                {isPracticeMode && (isAnswerLocked || showExplanation) && explanation && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 animate-slideIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Statutory Rationale & Provisions
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Ind AS / SA / IT Act
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {explanation}
                    </p>

                    {/* AI Auditor Reasoning */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          AI Statutory Auditor
                        </span>
                        {!aiExplanation && onRequestAiExplanation && !isLoadingAi && (
                          <button
                            onClick={onRequestAiExplanation}
                            className="text-[10px] font-mono text-indigo-400 hover:underline cursor-pointer"
                          >
                            Analyze Statutory Clause
                          </button>
                        )}
                      </div>

                      {isLoadingAi ? (
                        <p className="text-[11px] font-mono text-slate-400 animate-pulse">
                          Synthesizing legal reasoning & statutory exception check...
                        </p>
                      ) : aiExplanation ? (
                        <p className="text-[11px] text-slate-200 leading-relaxed italic bg-slate-950 p-2.5 rounded-lg border border-indigo-900/40">
                          {aiExplanation}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">
                Question not found
              </div>
            )}
          </div>

          {/* Exam Command Bar */}
          <div className="p-4 border-t border-slate-800/90 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
            {/* Left Controls: Previous & Clear */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateSubQuestion(Math.max(0, currentSubIndex - 1))}
                disabled={currentSubIndex === 0}
                className="px-3 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={onClearResponse}
                disabled={selectedOptionIndex === undefined || isAnswerLocked}
                className="px-3 py-2 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Response
              </button>
            </div>

            {/* Right Controls: Mark for Review & Save/Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkForReview}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  isMarkedForReview
                    ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isMarkedForReview ? 'fill-purple-400' : ''}`} />
                {isMarkedForReview ? 'Marked' : 'Mark For Review'}
              </button>

              {isLastQuestion ? (
                <button
                  onClick={onCompleteCase || onSaveAndNext}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition shadow-md shadow-emerald-500/10 flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Complete Scenario
                </button>
              ) : (
                <button
                  onClick={onSaveAndNext}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition shadow-md shadow-cyan-500/10 flex items-center gap-1 cursor-pointer"
                >
                  Save & Next
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
