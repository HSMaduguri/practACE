import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  PlusCircle, 
  RotateCw, 
  X, 
  CheckCircle2, 
  Sparkles,
  Timer,
  Coffee,
  Square,
  ListTodo,
  Volume2,
  ChevronRight,
  Play
} from 'lucide-react';
import { SubjectId } from '../types';
import { ModalPortal } from './ModalPortal';
import { playNotificationChime } from '../utils/audioAlarm';

interface TargetApproachingModalProps {
  isOpen: boolean;
  taskTitle: string;
  subjectCode: SubjectId | string;
  chapterName?: string;
  currentTaskId?: string;
  currentTargetMinutes: number;
  secondsRemaining: number;
  availableTasks?: any[];
  flowTargets?: any[];
  onExtend: (additionalMinutes: number) => void;
  onGoAsScheduled: () => void;
  onMarkCompleteAndNextTask?: (nextTask: any, markCurrentAsCompleted?: boolean) => void;
  onGoToBreak?: () => void;
  onGoToIdle?: (markCurrentAsCompleted?: boolean) => void;
  onClose: () => void;
}

const SUBJECT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  AFM: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  FR: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  Audit: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  DT: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  IDT: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  IBS: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' }
};

export default function TargetApproachingModal({
  isOpen,
  taskTitle,
  subjectCode,
  chapterName,
  currentTaskId,
  currentTargetMinutes,
  secondsRemaining,
  availableTasks = [],
  flowTargets = [],
  onExtend,
  onGoAsScheduled,
  onMarkCompleteAndNextTask,
  onGoToBreak,
  onGoToIdle,
  onClose
}: TargetApproachingModalProps) {
  const [selectedExtension, setSelectedExtension] = useState<number>(15);
  const [customExtensionInput, setCustomExtensionInput] = useState<string>('');
  const [selectedNextTaskId, setSelectedNextTaskId] = useState<string>('');
  const [markCurrentCompleteOnTransition, setMarkCurrentCompleteOnTransition] = useState<boolean>(true);

  // Play crisp chime sound on notification appearance (strictly no voice/speech notes)
  useEffect(() => {
    if (isOpen) {
      playNotificationChime('approaching');
    }
  }, [isOpen]);

  // Resolve pending candidate next tasks
  const nextCandidates = useMemo(() => {
    // 1. Check flow targets first
    const flowPending = (flowTargets || []).filter(f => {
      if (!f) return false;
      if (f.status === 'completed') return false;
      const isCurrent = (f.taskId && currentTaskId && f.taskId === currentTaskId) ||
        (f.cleanTitle || f.title) === taskTitle;
      return !isCurrent;
    });

    if (flowPending.length > 0) {
      return flowPending.map(f => ({
        id: f.taskId || f.id,
        title: f.title,
        cleanTitle: f.cleanTitle || f.title,
        subjectCode: f.subjectCode,
        chapterName: f.chapterName,
        relevance: f.relevance || 'Revision',
        targetDurationMinutes: f.duration || f.targetDurationMinutes || 45,
        isFlow: true
      }));
    }

    // 2. Otherwise check available tasks list
    return (availableTasks || []).filter(t => {
      if (!t) return false;
      const isCompleted = t.status === 'completed' || t.completed;
      if (isCompleted) return false;
      const isCurrent = (t.id && currentTaskId && t.id === currentTaskId) ||
        (t.cleanTitle || t.title) === taskTitle;
      return !isCurrent;
    });
  }, [flowTargets, availableTasks, currentTaskId, taskTitle]);

  const activeNextTask = useMemo(() => {
    if (selectedNextTaskId) {
      return nextCandidates.find(t => (t.id || t.title) === selectedNextTaskId) || nextCandidates[0];
    }
    return nextCandidates[0] || null;
  }, [selectedNextTaskId, nextCandidates]);

  if (!isOpen) return null;

  const subStyle = SUBJECT_STYLES[subjectCode] || { 
    bg: 'bg-indigo-500/15', 
    text: 'text-indigo-300', 
    border: 'border-indigo-500/30' 
  };

  const minsLeft = Math.floor(Math.max(0, secondsRemaining) / 60);
  const secsLeft = Math.max(0, secondsRemaining) % 60;
  const timeFormatted = `${minsLeft}:${secsLeft.toString().padStart(2, '0')}`;

  const effectiveExtension = customExtensionInput.trim() !== '' && !isNaN(Number(customExtensionInput)) && Number(customExtensionInput) > 0
    ? Number(customExtensionInput)
    : selectedExtension;

  const newTotalDuration = currentTargetMinutes + effectiveExtension;

  const handleConfirmExtend = () => {
    onExtend(effectiveExtension);
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden my-auto space-y-4 text-left flex flex-col max-h-[92vh]"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 h-44 w-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-400 shrink-0 animate-pulse">
                <Timer className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
                    Task Reminder
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 animate-pulse">
                    <Clock className="h-3 w-3" />
                    {timeFormatted} Left
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => playNotificationChime('approaching')}
                className="p-1.5 text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition cursor-pointer"
                title="Replay notification chime"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onGoAsScheduled}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                title="Proceed as planned until 0:00"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Prominent Live Running Timer Alert Banner + Proceed as Planned CTA */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-slate-950/90 to-amber-500/10 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-md">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>Task Reminder • Planned Time ({currentTargetMinutes}m)</span>
              </div>
              <p className="text-xs sm:text-sm font-black text-white font-sans mt-0.5">
                Only <span className="text-amber-300 font-mono underline decoration-amber-500/50">{timeFormatted}</span> remaining on this running target!
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${subStyle.bg} ${subStyle.text} ${subStyle.border}`}>
                  {subjectCode}
                </span>
                <p className="text-[11px] text-slate-200 font-bold truncate">
                  {taskTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/60 text-amber-400 font-mono text-lg font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] tabular-nums">
                <Clock className="h-4 w-4 animate-spin text-amber-400" />
                <span>{timeFormatted}</span>
              </div>
              <button
                type="button"
                onClick={onGoAsScheduled}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1 cursor-pointer shadow-md shadow-amber-500/20"
                title="Continue Focus Timer as scheduled until 0:00"
              >
                <span>Proceed as Planned</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Scrollable Next Move Selection Options */}
          <div className="space-y-3 overflow-y-auto pr-1">
            {/* OPTION 1: INCREASE / EXTEND PLANNED SESSION */}
            <div className="p-3.5 bg-slate-950/70 border border-indigo-500/35 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="h-3.5 w-3.5 text-indigo-400" />
                  1. Increase Planned Time (Extend Target)
                </span>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                  24H Clock + Planner Sync
                </span>
              </div>

              {/* Quick Chips */}
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((mins) => {
                  const isSelected = selectedExtension === mins && customExtensionInput.trim() === '';
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setSelectedExtension(mins);
                        setCustomExtensionInput('');
                      }}
                      className={`py-1.5 px-1 rounded-xl font-mono text-xs font-bold border transition text-center cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      +{mins}m
                    </button>
                  );
                })}
              </div>

              {/* Custom Input + Confirm Extend Button */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="number"
                    min="1"
                    max="240"
                    placeholder="Custom mins..."
                    value={customExtensionInput}
                    onChange={(e) => setCustomExtensionInput(e.target.value)}
                    className="w-full bg-[#060810] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs font-mono text-slate-500">m</span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmExtend}
                  className="py-2 px-3.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Increase to {newTotalDuration}m (+{effectiveExtension}m)</span>
                </button>
              </div>
            </div>

            {/* OPTION 2: WHAT'S THE NEXT ACTION — SWITCH TO NEXT TASK */}
            {onMarkCompleteAndNextTask && activeNextTask && (
              <div className="p-3.5 bg-slate-950/70 border border-emerald-500/30 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    2. What&apos;s Next: Transition to Next Target
                  </span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setMarkCurrentCompleteOnTransition(true)}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold transition cursor-pointer ${
                        markCurrentCompleteOnTransition
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Mark Done
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkCurrentCompleteOnTransition(false)}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold transition cursor-pointer ${
                        !markCurrentCompleteOnTransition
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Keep Pending
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
                      Next Scheduled Target:
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      [{activeNextTask.subjectCode}] {activeNextTask.cleanTitle || activeNextTask.title}
                    </span>
                  </div>
                  {nextCandidates.length > 1 && (
                    <select
                      value={activeNextTask.id || activeNextTask.title}
                      onChange={(e) => setSelectedNextTaskId(e.target.value)}
                      className="bg-slate-950 border border-slate-750 text-[10px] font-mono text-slate-300 rounded-lg px-2 py-1 max-w-[155px] truncate focus:outline-none cursor-pointer"
                    >
                      {nextCandidates.map((c, cIdx) => (
                        <option key={cIdx} value={c.id || c.title}>
                          [{c.subjectCode}] {c.cleanTitle || c.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onMarkCompleteAndNextTask(activeNextTask, markCurrentCompleteOnTransition)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>
                    {markCurrentCompleteOnTransition ? 'Mark Done & Start Next Target' : 'Save Progress & Switch to Next Target'}
                  </span>
                </button>
              </div>
            )}

            {/* OPTION 3 & 4: GO TO BREAK OR IDLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {onGoToBreak && (
                <button
                  type="button"
                  onClick={onGoToBreak}
                  className="p-3 bg-slate-950/80 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-left transition cursor-pointer flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500/20 shrink-0">
                    <Coffee className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block font-mono">
                      3. Take a Desk Break
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Save elapsed time &amp; rest
                    </span>
                  </div>
                </button>
              )}

              {onGoToIdle && (
                <button
                  type="button"
                  onClick={() => onGoToIdle(markCurrentCompleteOnTransition)}
                  className="p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl text-left transition cursor-pointer flex items-center gap-3 group"
                >
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 group-hover:bg-slate-700 shrink-0">
                    <Square className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block font-mono">
                      4. Finish &amp; Go to Idle
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {markCurrentCompleteOnTransition ? 'Mark complete & stop clock' : 'Keep pending & stop clock'}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Option 5 Keep Grinding as Scheduled */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Continue without changes until planned time reaches 0:00?
            </p>
            <button
              type="button"
              onClick={onGoAsScheduled}
              className="w-full sm:w-auto py-2 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 hover:text-white font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Proceed as Planned (Until 0:00)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </ModalPortal>
  );
}

