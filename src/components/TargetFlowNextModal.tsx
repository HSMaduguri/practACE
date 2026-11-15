import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Coffee, 
  Square, 
  Target, 
  Sparkles,
  Clock,
  RotateCcw
} from 'lucide-react';
import { FlowTargetItem, SubjectId } from '../types';
import { ModalPortal } from './ModalPortal';

interface TargetFlowNextModalProps {
  isOpen: boolean;
  completedTarget: {
    taskId?: string;
    title: string;
    subjectCode: SubjectId;
    chapterName?: string;
    allocatedMinutes: number;
  };
  nextTarget: FlowTargetItem;
  nextTargetIndex: number;
  totalFlowCount: number;
  onContinueNext: () => void;
  onTakeBreak: () => void;
  onStopToIdle: () => void;
  onUndoCompletion?: () => void;
}

const SUBJECT_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  AFM: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  FR: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  Audit: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  DT: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  IDT: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  IBS: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' }
};

export default function TargetFlowNextModal({
  isOpen,
  completedTarget,
  nextTarget,
  nextTargetIndex,
  totalFlowCount,
  onContinueNext,
  onTakeBreak,
  onStopToIdle,
  onUndoCompletion
}: TargetFlowNextModalProps) {
  if (!isOpen) return null;

  const compStyle = SUBJECT_BADGE_STYLES[completedTarget.subjectCode] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  const nextStyle = SUBJECT_BADGE_STYLES[nextTarget.subjectCode] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };

  return (
    <ModalPortal>
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden my-auto space-y-5"
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
                  Target Completed!
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                  Step {nextTargetIndex} of {totalFlowCount} Done
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Time allocated to revision. Continue with your scheduled flow?
              </p>
            </div>
          </div>
        </div>

        {/* Completed Target Summary Card */}
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              Allocated to Revision
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {completedTarget.allocatedMinutes} min logged
              </span>
              {onUndoCompletion && (
                <button
                  type="button"
                  onClick={onUndoCompletion}
                  className="text-[9px] font-mono font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer"
                  title="Accidental click? Undo completion mark"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  <span>Undo Mark</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${compStyle.bg} ${compStyle.text} ${compStyle.border}`}>
              {completedTarget.subjectCode}
            </span>
            <p className="text-xs font-bold text-slate-200 truncate">
              {completedTarget.title}
            </p>
          </div>
        </div>

        {/* Transition Visual Divider */}
        <div className="flex items-center justify-center gap-2 text-slate-600 font-mono text-[11px]">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-amber-400 font-bold flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            <ArrowRight className="h-3.5 w-3.5" /> Next in Flow Queue
          </span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Next Target Preview Card */}
        <div className="p-4 bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-500/10 border-2 border-amber-500/30 rounded-2xl space-y-2.5 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] font-mono flex items-center justify-center">
                {nextTargetIndex + 1}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                Target {nextTargetIndex + 1} of {totalFlowCount}
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">
              {totalFlowCount - nextTargetIndex} targets remaining today
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${nextStyle.bg} ${nextStyle.text} ${nextStyle.border}`}>
                {nextTarget.subjectCode}
              </span>
              {nextTarget.chapterName && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {nextTarget.chapterName}
                </span>
              )}
            </div>
            <h4 className="text-sm font-extrabold text-white">
              {nextTarget.title}
            </h4>
          </div>
        </div>

        {/* The Core Question */}
        <p className="text-xs text-center text-slate-300 font-medium">
          Do you want to continue the study timer with <strong className="text-amber-300">Target {nextTargetIndex + 1}</strong>?
        </p>

        {/* Action Buttons: Yes / Break / No */}
        <div className="space-y-2.5 pt-1">
          {/* 1. YES - Continue Timer for Next Target (Primary) */}
          <button
            type="button"
            onClick={onContinueNext}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase font-mono tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>Yes, Continue Timer for Target {nextTargetIndex + 1}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 2. Move to Break during Flow */}
            <button
              type="button"
              onClick={onTakeBreak}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Coffee className="h-3.5 w-3.5 text-cyan-400" />
              <span>Take Break First</span>
            </button>

            {/* 3. NO - Stop timer & move to idle */}
            <button
              type="button"
              onClick={onStopToIdle}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 hover:border-slate-600 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Square className="h-3.5 w-3.5 text-rose-400" />
              <span>No, Stop to Idle</span>
            </button>
          </div>

          {/* Accidental click protection - Undo Option */}
          {onUndoCompletion && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onUndoCompletion}
                className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="Accidentally marked as done? Click here to undo completion and return to studying this target"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                <span>Accidental click? Undo Completion & Return to Target</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
    </ModalPortal>
  );
}
