import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Clock, 
  Pause, 
  X, 
  ListTodo,
  Check,
  PlusCircle,
  RotateCw,
  Coffee,
  Volume2
} from 'lucide-react';
import { SubjectId } from '../types';
import { ModalPortal } from './ModalPortal';
import { playNotificationChime } from '../utils/audioAlarm';

interface TargetCompletedTransitionModalProps {
  isOpen: boolean;
  completedTask: {
    id?: string;
    title: string;
    subjectCode: SubjectId | string;
    chapterName?: string;
    targetMinutes: number;
    elapsedSeconds: number;
  };
  availableTasks: any[];
  onExtend?: (additionalMinutes: number) => void;
  onProceedToTask: (nextTask: any, markCurrentAsCompleted: boolean) => void;
  onGoToBreak?: () => void;
  onMoveToIdle: (markCurrentAsCompleted: boolean) => void;
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

export default function TargetCompletedTransitionModal({
  isOpen,
  completedTask,
  availableTasks = [],
  onExtend,
  onProceedToTask,
  onGoToBreak,
  onMoveToIdle,
  onClose
}: TargetCompletedTransitionModalProps) {
  const [markCurrentComplete, setMarkCurrentComplete] = useState<boolean>(true);
  const [selectedExtension, setSelectedExtension] = useState<number>(15);
  const [customExtensionInput, setCustomExtensionInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      playNotificationChime('completed');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subStyle = SUBJECT_STYLES[completedTask.subjectCode] || { 
    bg: 'bg-indigo-500/15', 
    text: 'text-indigo-300', 
    border: 'border-indigo-500/30' 
  };

  const elapsedMins = Math.max(1, Math.round(completedTask.elapsedSeconds / 60));
  const effectiveExtension =
    customExtensionInput.trim() !== '' && !isNaN(Number(customExtensionInput)) && Number(customExtensionInput) > 0
      ? Number(customExtensionInput)
      : selectedExtension;
  const newTotalDuration = Math.max(completedTask.targetMinutes, elapsedMins) + effectiveExtension;

  // Filter tasks to show only pending ones, excluding the current completed task
  const nextCandidates = (availableTasks || []).filter(t => {
    if (!t) return false;
    const isCompleted = t.status === 'completed' || t.completed;
    if (isCompleted) return false;
    const isCurrent = (t.id && completedTask.id && t.id === completedTask.id) ||
      (t.cleanTitle || t.title) === completedTask.title;
    return !isCurrent;
  });

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          className="bg-slate-900 border border-emerald-500/35 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden my-auto space-y-4 text-left flex flex-col max-h-[92vh]"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 h-44 w-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
                    Total Planned Time Lapsed!
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {completedTask.targetMinutes}m Planned Reached
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => playNotificationChime('completed')}
                className="p-1.5 text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition cursor-pointer"
                title="Replay notification chime"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                title="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 min-h-0">
            {/* Current Task Review & Completion Status Toggle */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5 shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Active Target Status:</span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[9.5px] border ${subStyle.bg} ${subStyle.text} ${subStyle.border}`}>
                  {completedTask.subjectCode}
                </span>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white font-sans line-clamp-1">
                  {completedTask.title}
                </h4>
                {completedTask.chapterName && completedTask.chapterName !== completedTask.title && (
                  <p className="text-[11px] text-slate-400 truncate">
                    📖 {completedTask.chapterName}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-900">
                <span className="text-slate-400">
                  Planned Time: <strong className="text-white">{completedTask.targetMinutes}m</strong>
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-0.5 rounded-md">
                  ⏱️ {elapsedMins}m total elapsed
                </span>
              </div>

              {/* Completion Toggle: Mark Complete vs Keep Pending */}
              <div className="pt-2 border-t border-slate-850 flex items-center gap-2">
                <span className="text-[10.5px] font-mono text-slate-400 uppercase font-bold shrink-0">
                  Task Update:
                </span>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => setMarkCurrentComplete(true)}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      markCurrentComplete
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Mark Complete</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarkCurrentComplete(false)}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      !markCurrentComplete
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>Keep Pending</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Option A: Increase Planned Time & Keep Studying Current Task */}
            {onExtend && (
              <div className="p-3.5 bg-slate-950/70 border border-indigo-500/35 rounded-2xl space-y-2.5 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <PlusCircle className="h-3.5 w-3.5 text-indigo-400" />
                    Increase Planned Time (Keep Studying This Target)
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                    24H Clock + Planner Sync
                  </span>
                </div>
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
                <div className="flex items-center gap-2">
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
                    onClick={() => onExtend(effectiveExtension)}
                    className="py-2 px-3.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Increase to {newTotalDuration}m</span>
                  </button>
                </div>
              </div>
            )}

            {/* Option B: What's the Next Action — Proceed to Next Task */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <ListTodo className="h-3.5 w-3.5 text-emerald-400" />
                  What&apos;s the Next Action — Start Next Target:
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {nextCandidates.length} available
                </span>
              </div>

              {nextCandidates.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <p>No remaining scheduled tasks for today.</p>
                  <p className="text-[10.5px] text-slate-600 mt-1">
                    You can extend time above, take a break, or move to Idle.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {nextCandidates.map((task) => {
                    const taskSubStyle = SUBJECT_STYLES[task.subjectCode] || {
                      bg: 'bg-slate-800',
                      text: 'text-slate-300',
                      border: 'border-slate-700'
                    };
                    const taskTarget = task.targetDurationMinutes || task.duration || 45;

                    return (
                      <div
                        key={task.id || task.title}
                        className="p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between gap-3 text-left group"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${taskSubStyle.bg} ${taskSubStyle.text} ${taskSubStyle.border}`}>
                              {task.subjectCode}
                            </span>
                            <span className="text-xs font-bold text-white truncate font-sans">
                              {task.cleanTitle || task.title}
                            </span>
                          </div>
                          {task.chapterName && (
                            <p className="text-[10.5px] text-slate-400 truncate pl-0.5">
                              📖 {task.chapterName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                            {taskTarget}m
                          </span>
                          <button
                            type="button"
                            onClick={() => onProceedToTask(task, markCurrentComplete)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-[11px] font-bold transition flex items-center gap-1 shadow-sm shadow-emerald-600/30 cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>Start Next</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Footer with Desk Break & Move to Idle Buttons */}
          <div className="pt-3 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {onGoToBreak && (
              <button
                type="button"
                onClick={onGoToBreak}
                className="w-full sm:w-auto py-2.5 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coffee className="h-3.5 w-3.5 text-amber-400" />
                <span>Take a Desk Break</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onMoveToIdle(markCurrentComplete)}
              className="w-full sm:w-auto py-2.5 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ml-auto"
            >
              <Pause className="h-3.5 w-3.5 text-amber-400" />
              <span>{markCurrentComplete ? 'Mark Complete & Move to Idle' : 'Keep Pending & Move to Idle'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </ModalPortal>
  );
}

