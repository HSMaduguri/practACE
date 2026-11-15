/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, Bookmark, HelpCircle, AlertCircle, X, ChevronRight, Check } from 'lucide-react';

export type QuestionExamStatus = 
  | 'not_visited' 
  | 'not_answered' 
  | 'answered' 
  | 'marked_for_review' 
  | 'answered_and_marked';

export interface PaletteItem {
  id: string;
  globalIndex: number; // 0-based
  displayLabel: string; // e.g. "1", "Q1"
  status: QuestionExamStatus;
  groupTitle?: string; // e.g. "Case Study #1" or "Ind AS 115"
}

interface IcaExamPaletteProps {
  items: PaletteItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onSubmitExam?: () => void;
  isTestMode?: boolean;
  className?: string;
  onCloseMobile?: () => void;
}

export default function IcaExamPalette({
  items,
  currentIndex,
  onSelectIndex,
  onSubmitExam,
  isTestMode = false,
  className = '',
  onCloseMobile
}: IcaExamPaletteProps) {
  const [filter, setFilter] = useState<'all' | 'review' | 'unanswered' | 'answered'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Calculate live tallies
  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {
      answered: 0,
      marked_for_review: 0,
      answered_and_marked: 0,
      not_answered: 0,
      not_visited: 0
    } as Record<QuestionExamStatus, number>
  );

  const totalAnswered = counts.answered + counts.answered_and_marked;
  const totalReview = counts.marked_for_review + counts.answered_and_marked;
  const totalPending = counts.not_answered + counts.not_visited;

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'answered') return item.status === 'answered' || item.status === 'answered_and_marked';
    if (filter === 'review') return item.status === 'marked_for_review' || item.status === 'answered_and_marked';
    if (filter === 'unanswered') return item.status === 'not_answered' || item.status === 'not_visited';
    return true;
  });

  const getStatusStyle = (status: QuestionExamStatus, isSelected: boolean) => {
    let base = '';
    switch (status) {
      case 'answered':
        base = 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30';
        break;
      case 'marked_for_review':
        base = 'bg-purple-600/20 text-purple-300 border-purple-500/40 hover:bg-purple-600/30';
        break;
      case 'answered_and_marked':
        base = 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-600/30 font-bold';
        break;
      case 'not_answered':
        base = 'bg-rose-600/20 text-rose-300 border-rose-500/40 hover:bg-rose-600/30';
        break;
      case 'not_visited':
      default:
        base = 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200';
        break;
    }

    if (isSelected) {
      base += ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 font-black';
    }
    return base;
  };

  return (
    <aside className={`flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg ${className}`}>
      {/* Palette Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Question Palette
          </h3>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            ICAI CBT Standard Navigation
          </p>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            title="Close Palette"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ICAI Status Legend */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/90 grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-[8px] text-emerald-300 font-bold shrink-0">
            {counts.answered}
          </span>
          <span className="text-slate-300 text-[10px] truncate">Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-rose-500/30 border border-rose-500 flex items-center justify-center text-[8px] text-rose-300 font-bold shrink-0">
            {counts.not_answered}
          </span>
          <span className="text-slate-300 text-[10px] truncate">Not Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-purple-500/30 border border-purple-500 flex items-center justify-center text-[8px] text-purple-300 font-bold shrink-0">
            {counts.marked_for_review}
          </span>
          <span className="text-slate-300 text-[10px] truncate">Marked for Review</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-cyan-500/30 border border-cyan-500 flex items-center justify-center text-[8px] text-cyan-300 font-bold shrink-0">
            {counts.answered_and_marked}
          </span>
          <span className="text-slate-300 text-[10px] truncate">Ans & Marked</span>
        </div>

        <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-800/60">
          <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-[8px] text-slate-400 font-bold shrink-0">
            {counts.not_visited}
          </span>
          <span className="text-slate-400 text-[10px] truncate">Not Visited ({counts.not_visited})</span>
        </div>
      </div>

      {/* Filter Tabs - Clean 4-Column Grid with Zero Scrollbar */}
      <div className="p-2 border-b border-slate-800 grid grid-cols-4 gap-1 bg-slate-900/30 w-full no-scrollbar">
        {[
          { id: 'all', label: `All (${items.length})` },
          { id: 'answered', label: `Ans (${totalAnswered})` },
          { id: 'review', label: `Rev (${totalReview})` },
          { id: 'unanswered', label: `Pend (${totalPending})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`py-1.5 px-1 rounded text-[10px] font-mono uppercase text-center truncate transition-colors cursor-pointer ${
              filter === t.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid of Numbered Questions */}
      <div className="p-3 flex-1 overflow-y-auto max-h-[380px] no-scrollbar">
        <div className="grid grid-cols-5 gap-1.5">
          {filteredItems.map(item => {
            const isSelected = item.globalIndex === currentIndex;
            const style = getStatusStyle(item.status, isSelected);

            return (
              <button
                key={`pal-item-${item.id}-${item.globalIndex}`}
                onClick={() => {
                  onSelectIndex(item.globalIndex);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`h-9 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative group ${style}`}
                title={`Question ${item.globalIndex + 1}: ${item.status.replace(/_/g, ' ')}`}
              >
                <span>{item.globalIndex + 1}</span>
                {item.status === 'answered_and_marked' && (
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                )}
                {item.status === 'marked_for_review' && (
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs font-mono">
            No questions match filter
          </div>
        )}
      </div>

      {/* Palette Footer Actions */}
      {isTestMode && onSubmitExam && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/40">
          <button
            id="open-submit-modal-btn"
            onClick={() => setShowSubmitModal(true)}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            Submit Final Exam
          </button>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h4 className="font-display font-bold text-white text-base">
                  Submit Examination?
                </h4>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Please review your question attempt summary before submitting. Once submitted, your answers cannot be altered.
            </p>

            {/* ICAI Exam Summary Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 border-b border-slate-800">
                <span className="text-slate-400">Total Questions</span>
                <span className="text-white font-bold">{items.length}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 border-b border-slate-800 text-emerald-400">
                <span>Answered</span>
                <span className="font-bold">{counts.answered}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 border-b border-slate-800 text-cyan-400">
                <span>Answered & Marked for Review</span>
                <span className="font-bold">{counts.answered_and_marked}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 border-b border-slate-800 text-purple-400">
                <span>Marked for Review</span>
                <span className="font-bold">{counts.marked_for_review}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 border-b border-slate-800 text-rose-400">
                <span>Not Answered</span>
                <span className="font-bold">{counts.not_answered}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-slate-400">
                <span>Not Visited</span>
                <span className="font-bold">{counts.not_visited}</span>
              </div>
            </div>

            {totalPending > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  You have <strong>{totalPending}</strong> pending question(s) left unattempted.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Back to Exam
              </button>
              <button
                id="confirm-submit-exam-btn"
                onClick={() => {
                  setShowSubmitModal(false);
                  if (onSubmitExam) onSubmitExam();
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-emerald-500/20"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
