/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Eye,
  X,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { ScheduledPracticeSessionRecord } from '../types';
import {
  formatDurationMMSS,
  upsertScheduledPracticeLog
} from '../utils/scheduledPracticeWorkflow';
import { ModalPortal } from './ModalPortal';

interface ScheduledPracticeQuestionModalProps {
  session: ScheduledPracticeSessionRecord;
  onClose: () => void;
  onSessionUpdated?: (updated: ScheduledPracticeSessionRecord) => void;
  onStartNextQuestion?: () => void;
}

export default function ScheduledPracticeQuestionModal({
  session,
  onClose,
  onSessionUpdated,
  onStartNextQuestion
}: ScheduledPracticeQuestionModalProps) {
  const isAlreadyCompleted = session.status === 'completed';

  const [allocatedSeconds, setAllocatedSeconds] = useState<number>(session.allocatedSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(session.elapsedSeconds || 0);
  const [isRunning, setIsRunning] = useState<boolean>(!isAlreadyCompleted);
  const [answerRevealed, setAnswerRevealed] = useState<boolean>(isAlreadyCompleted);
  const [draftAnswer, setDraftAnswer] = useState<string>(session.draftAnswer || '');
  const [status, setStatus] = useState<'active' | 'completed' | 'dismissed' | 'snoozed'>(session.status);
  const [selfAssessedMastered, setSelfAssessedMastered] = useState<boolean | undefined>(
    session.selfAssessedMastered
  );

  // Sync local state whenever a new session is loaded
  useEffect(() => {
    const done = session.status === 'completed';
    setAllocatedSeconds(session.allocatedSeconds);
    setElapsedSeconds(session.elapsedSeconds || 0);
    setIsRunning(!done);
    setAnswerRevealed(done);
    setDraftAnswer(session.draftAnswer || '');
    setStatus(session.status);
    setSelfAssessedMastered(session.selfAssessedMastered);
  }, [session.id]);

  // Live 1-second timer tick
  useEffect(() => {
    if (!isRunning || status === 'completed') return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, status]);

  const remainingSeconds = allocatedSeconds - elapsedSeconds;
  const isOvertime = remainingSeconds < 0;
  const overtimeSeconds = isOvertime ? Math.abs(remainingSeconds) : 0;
  const progressPct = Math.min(100, Math.round((elapsedSeconds / Math.max(1, allocatedSeconds)) * 100));
  const isLowTimeWarning = !isOvertime && remainingSeconds <= Math.max(60, Math.round(allocatedSeconds * 0.2));

  const persistProgress = (
    overrides: Partial<ScheduledPracticeSessionRecord>
  ): ScheduledPracticeSessionRecord => {
    const updated: ScheduledPracticeSessionRecord = {
      ...session,
      allocatedSeconds,
      elapsedSeconds,
      draftAnswer,
      status,
      selfAssessedMastered,
      ...overrides
    };
    upsertScheduledPracticeLog(updated);
    onSessionUpdated?.(updated);
    return updated;
  };

  const handleSetDurationMinutes = (mins: number) => {
    const nextSec = mins * 60;
    setAllocatedSeconds(nextSec);
    persistProgress({ allocatedSeconds: nextSec });
  };

  const handleResetTimer = () => {
    setElapsedSeconds(0);
    setIsRunning(true);
    persistProgress({ elapsedSeconds: 0 });
  };

  const handleRevealModelAnswer = () => {
    setIsRunning(false);
    setAnswerRevealed(true);
    persistProgress({ elapsedSeconds, draftAnswer });
  };

  const handleCompleteSession = (mastered: boolean) => {
    setIsRunning(false);
    setAnswerRevealed(true);
    setStatus('completed');
    setSelfAssessedMastered(mastered);
    persistProgress({
      status: 'completed',
      completedAt: new Date().toISOString(),
      elapsedSeconds,
      draftAnswer,
      selfAssessedMastered: mastered
    });
  };

  const handleDismissModal = () => {
    if (status === 'active') {
      persistProgress({
        elapsedSeconds,
        draftAnswer,
        status: answerRevealed ? 'completed' : 'dismissed',
        completedAt: answerRevealed ? new Date().toISOString() : undefined
      });
    }
    onClose();
  };

  const icaiStandardSeconds = Math.max(8, Math.round((session.question.marks || 5) * 1.8)) * 60;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[240] flex items-center justify-center p-3 sm:p-5">
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
          onClick={handleDismissModal}
        />

        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-[#0b0f19] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden select-text">
          {/* Top Accent Hairline */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shrink-0" />

          {/* Unified Header + Countdown Bar */}
          <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 shrink-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Question Identity */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 text-amber-300 font-extrabold">
                    {session.question.subjectId}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {session.question.marks} Marks
                  </span>
                  {answerRevealed && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 truncate">
                        {session.question.chapterName}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-black text-white truncate">
                  {answerRevealed ? session.question.title : 'Timed Practice Assessment'}
                </h3>
              </div>

              {/* Right: Live Timer & Compact Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono ${
                    isOvertime
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                      : isLowTimeWarning
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                >
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-base sm:text-lg font-black tabular-nums">
                    {isOvertime ? `+${formatDurationMMSS(overtimeSeconds)}` : formatDurationMMSS(remainingSeconds)}
                  </span>
                </div>

                {status !== 'completed' && (
                  <>
                    <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => handleSetDurationMinutes(5)}
                        className={`px-2 py-1 rounded transition cursor-pointer ${
                          allocatedSeconds === 300
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        5m
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetDurationMinutes(Math.round(icaiStandardSeconds / 60))}
                        className={`px-2 py-1 rounded transition cursor-pointer ${
                          allocatedSeconds === icaiStandardSeconds
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ICAI
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetDurationMinutes(15)}
                        className={`px-2 py-1 rounded transition cursor-pointer ${
                          allocatedSeconds === 900
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        15m
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsRunning((r) => !r)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 transition cursor-pointer"
                      title={isRunning ? 'Pause timer' : 'Resume timer'}
                    >
                      {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetTimer}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Reset timer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleDismissModal}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Slim Progress Line */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isOvertime
                    ? 'bg-rose-500'
                    : isLowTimeWarning
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Scrollable Question & Answer Workspace */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
            {/* Question Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-[10.5px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="uppercase font-extrabold text-amber-400">Question</span>
                {answerRevealed && <span>{session.question.icaiExamRef}</span>}
              </div>
              <div className="text-sm text-slate-100 leading-relaxed whitespace-pre-line">
                {session.question.question}
              </div>
            </div>

            {/* Compact Working Notes */}
            <textarea
              rows={3}
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              disabled={status === 'completed'}
              placeholder="Jot down key sections, calculations, or conclusion points here..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl p-3.5 text-xs text-slate-100 leading-relaxed placeholder:text-slate-600 focus:outline-none resize-y"
            />

            {/* 1-Click Reveal Button OR Suggested Answer Card */}
            {!answerRevealed ? (
              <button
                type="button"
                onClick={handleRevealModelAnswer}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Eye className="h-4 w-4" />
                Reveal Suggested Answer
              </button>
            ) : (
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
                    Suggested Answer & Key Statutory Points
                  </span>
                  {status === 'completed' && (
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-300">
                      {selfAssessedMastered ? '✓ Mastered' : 'Needs Revision'}
                    </span>
                  )}
                </div>

                {/* Key Concepts List */}
                <ul className="space-y-2 text-xs">
                  {session.question.keyConcepts.map((kc, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 bg-slate-900/70 border border-slate-800/80 rounded-lg px-3 py-2"
                    >
                      <span className="font-mono font-bold text-amber-400 shrink-0">
                        {idx + 1}. {kc.keyword}:
                      </span>
                      <span className="text-slate-300 leading-snug">{kc.description}</span>
                    </li>
                  ))}
                </ul>

                {/* Executive Answer Synopsis */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Conclusion / Answer Synopsis
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {session.question.shortSuggestedAnswer}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              Elapsed: {formatDurationMMSS(elapsedSeconds)}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {answerRevealed && status !== 'completed' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleCompleteSession(false)}
                    className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Needs Revision
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCompleteSession(true)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Mastered
                  </button>
                </>
              )}

              {status === 'completed' && onStartNextQuestion && (
                <button
                  type="button"
                  onClick={onStartNextQuestion}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  Next Question
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleDismissModal}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
