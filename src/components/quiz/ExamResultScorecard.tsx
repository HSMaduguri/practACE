/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  RotateCcw, 
  ArrowLeft, 
  Filter, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { formatRunningTime } from '../../utils/timeFormat';

export interface EvaluatedQuestion {
  id: string;
  globalIndex: number;
  chapterName: string;
  questionText: string;
  options: string[];
  userAnswer?: number; // undefined if skipped
  correctAnswer: number;
  explanation: string;
  isCorrect: boolean;
  isSkipped: boolean;
  marks: number;
}

interface ExamResultScorecardProps {
  subjectName: string;
  totalQuestions: number;
  evaluatedQuestions: EvaluatedQuestion[];
  durationSeconds: number;
  onReturnToLobby: () => void;
  onRetakeExam: () => void;
}

export default function ExamResultScorecard({
  subjectName,
  totalQuestions,
  evaluatedQuestions,
  durationSeconds,
  onReturnToLobby,
  onRetakeExam
}: ExamResultScorecardProps) {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct' | 'skipped'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const correctCount = evaluatedQuestions.filter(q => q.isCorrect).length;
  const incorrectCount = evaluatedQuestions.filter(q => !q.isCorrect && !q.isSkipped).length;
  const skippedCount = evaluatedQuestions.filter(q => q.isSkipped).length;

  const totalScore = correctCount * 2;
  const maxScore = totalQuestions * 2;
  const percentage = Math.round((totalScore / (maxScore || 1)) * 100);
  const isPassed = percentage >= 50; // ICAI 50% benchmark

  const filteredQuestions = evaluatedQuestions.filter(q => {
    if (filter === 'all') return true;
    if (filter === 'correct') return q.isCorrect;
    if (filter === 'incorrect') return !q.isCorrect && !q.isSkipped;
    if (filter === 'skipped') return q.isSkipped;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner / Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isPassed ? 'bg-emerald-500/10' : 'bg-rose-500/10'
        }`} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${
                isPassed 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {isPassed ? 'ICAI Benchmark Met (>= 50%)' : 'Needs Reinforcement (< 50%)'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {subjectName}
              </span>
            </div>

            <h2 className="font-display font-black text-2xl text-white tracking-tight">
              Exam Evaluation & Scorecard
            </h2>
          </div>

          {/* Big Score Box */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                Final Score
              </span>
              <div className="text-2xl font-mono font-black text-white">
                <span className={isPassed ? 'text-emerald-400' : 'text-amber-400'}>
                  {totalScore}
                </span>
                <span className="text-slate-500 text-base"> / {maxScore}</span>
              </div>
            </div>

            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-mono font-black text-sm border ${
              isPassed 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Diagnostic Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Correct</span>
            <div className="text-lg font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              {correctCount}
              <span className="text-[11px] text-slate-500 font-normal">({Math.round((correctCount / (totalQuestions || 1)) * 100)}%)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Incorrect</span>
            <div className="text-lg font-mono font-bold text-rose-400 flex items-center gap-1.5 mt-0.5">
              <XCircle className="w-4 h-4" />
              {incorrectCount}
              <span className="text-[11px] text-slate-500 font-normal">({Math.round((incorrectCount / (totalQuestions || 1)) * 100)}%)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Unattempted</span>
            <div className="text-lg font-mono font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
              <AlertCircle className="w-4 h-4" />
              {skippedCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Time Taken</span>
            <div className="text-lg font-mono font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4" />
              {formatRunningTime(durationSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-4">
        {/* Review Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <h4 className="font-display font-bold text-xs uppercase text-slate-200">
              Question-by-Question Statutory Review
            </h4>
          </div>

          {/* Filters - Fluid Wrap with Zero Scrollbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: `All (${evaluatedQuestions.length})` },
              { id: 'incorrect', label: `Incorrect (${incorrectCount})` },
              { id: 'correct', label: `Correct (${correctCount})` },
              { id: 'skipped', label: `Skipped (${skippedCount})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Review Cards */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id || filter === 'incorrect';

            return (
              <div
                key={`eval-card-${q.id || 'q'}-${q.globalIndex}-${idx}`}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-sm transition-all"
              >
                {/* Header bar */}
                <div 
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 border ${
                      q.isCorrect 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : q.isSkipped
                        ? 'bg-slate-900 text-slate-400 border-slate-800'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {q.globalIndex + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {q.chapterName}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          q.isCorrect ? 'text-emerald-400' : q.isSkipped ? 'text-slate-400' : 'text-rose-400'
                        }`}>
                          {q.isCorrect ? '+2.0 Marks' : q.isSkipped ? '0.0 Marks (Skipped)' : '0.0 Marks (Incorrect)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium line-clamp-1 mt-1">
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[10px] font-mono hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'View Rationale'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 bg-slate-900/30 animate-fadeIn">
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isUserAnswer = q.userAnswer === oIdx;
                        const isCorrectAnswer = q.correctAnswer === oIdx;

                        let rowStyle = 'border-slate-800 text-slate-400 bg-slate-900/30';
                        if (isCorrectAnswer) {
                          rowStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold';
                        } else if (isUserAnswer) {
                          rowStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-300 font-semibold';
                        }

                        return (
                          <div
                            key={`eval-opt-${q.id || idx}-${oIdx}`}
                            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${rowStyle}`}
                          >
                            <span className="font-mono text-xs font-bold shrink-0">
                              [{String.fromCharCode(65 + oIdx)}]
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectAnswer && (
                              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                                <Check className="w-3 h-3 stroke-[3]" /> Official Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold shrink-0">
                                Your Selection
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Official Statutory Rationale */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase font-bold">
                        <BookOpen className="w-3.5 h-3.5" /> Statutory Analysis & ICAI Citation
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
        <button
          onClick={onReturnToLobby}
          className="px-5 py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Practice Lobby
        </button>

        <button
          onClick={onRetakeExam}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-display font-black uppercase tracking-wider transition shadow-md shadow-cyan-500/10 flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          Retake Examination
        </button>
      </div>
    </div>
  );
}
