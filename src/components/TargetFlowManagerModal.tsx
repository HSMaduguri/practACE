import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Target, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ListOrdered, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { FlowTargetItem, SubjectId } from '../types';
import { ModalPortal } from './ModalPortal';
import { getActiveCALevel, getLevelSubjectIds } from '../data/curriculumLevels';

interface TargetFlowManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTasks: any[]; // tasks for selected date
  currentFlow: FlowTargetItem[];
  onSaveAndStartFlow: (flow: FlowTargetItem[], startImmediately: boolean) => void;
  onClearFlow: () => void;
  selectedDate: string;
}

const SUBJECT_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  // Foundation
  Accounts: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  Law: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  MathStats: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  Econ: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  // Intermediate
  AdvAcc: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  CorpLaw: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  Tax: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  Cost: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  AuditInter: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  FMSM: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  // Final
  AFM: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  FR: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  Audit: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  DT: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  IDT: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  IBS: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' }
};

export default function TargetFlowManagerModal({
  isOpen,
  onClose,
  availableTasks,
  currentFlow,
  onSaveAndStartFlow,
  onClearFlow,
  selectedDate
}: TargetFlowManagerModalProps) {
  const defaultSub = getLevelSubjectIds(getActiveCALevel())[0] || 'FR';
  const [flowItems, setFlowItems] = useState<FlowTargetItem[]>(() => {
    if (currentFlow.length > 0) {
      return [...currentFlow];
    }
    return [];
  });

  useEffect(() => {
    if (isOpen) {
      if (currentFlow.length > 0) {
        setFlowItems([...currentFlow]);
      } else {
        setFlowItems([]);
      }
    }
  }, [isOpen, currentFlow]);

  if (!isOpen) return null;

  const handleAddTaskToFlow = (task: any) => {
    // Prevent duplicate tasks in flow
    if (flowItems.some(item => item.taskId === task.id)) return;

    const sub = (task.subjectCode || defaultSub) as SubjectId;
    const newItem: FlowTargetItem = {
      id: `flow_${task.id}_${Date.now()}`,
      taskId: task.id,
      title: task.cleanTitle || task.title,
      cleanTitle: task.cleanTitle || task.title,
      subjectCode: sub,
      chapterName: task.chapterName,
      relevance: task.relevance || 'Revision',
      revKey: task.revKey,
      dueDate: task.due,
      status: task.status === 'completed' ? 'completed' : 'pending'
    };

    setFlowItems(prev => [...prev, newItem]);
  };

  const handleAddAllUncompleted = () => {
    const existingTaskIds = new Set(flowItems.map(f => f.taskId));
    const toAdd: FlowTargetItem[] = [];

    availableTasks.forEach(task => {
      if (task.status !== 'completed' && !existingTaskIds.has(task.id)) {
        const sub = (task.subjectCode || defaultSub) as SubjectId;
        toAdd.push({
          id: `flow_${task.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          taskId: task.id,
          title: task.cleanTitle || task.title,
          cleanTitle: task.cleanTitle || task.title,
          subjectCode: sub,
          chapterName: task.chapterName,
          relevance: task.relevance || 'Revision',
          revKey: task.revKey,
          dueDate: task.due,
          status: 'pending'
        });
      }
    });

    if (toAdd.length > 0) {
      setFlowItems(prev => [...prev, ...toAdd]);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFlowItems(prev => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === flowItems.length - 1) return;
    setFlowItems(prev => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleRemove = (id: string) => {
    setFlowItems(prev => prev.filter(f => f.id !== id));
  };

  const handleToggleItemStatus = (index: number) => {
    setFlowItems(prev => prev.map((item, i) => {
      if (i === index) {
        const isDone = item.status === 'completed';
        return {
          ...item,
          status: isDone ? ('pending' as const) : ('completed' as const),
          completedAt: isDone ? undefined : new Date().toISOString(),
          allocatedMinutes: isDone ? undefined : item.allocatedMinutes
        };
      }
      return item;
    }));
  };

  const handleSave = (startImmediately: boolean) => {
    onSaveAndStartFlow(flowItems, startImmediately);
    onClose();
  };

  const inFlowTaskIds = new Set(flowItems.map(f => f.taskId));
  const unselectedTasks = availableTasks.filter(t => !inFlowTaskIds.has(t.id));

  return (
    <ModalPortal>
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden my-auto space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 rounded-2xl text-amber-400">
              <ListOrdered className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white font-mono uppercase tracking-wider">
                  Target Flow Sequence Planner
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
                  {flowItems.length} in flow
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content: Two-column layout on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-h-[62vh] overflow-y-auto pr-1">
          {/* Left Column: Arranged Flow List (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-amber-400" />
                Arranged Flow Queue (What to do after the other)
              </span>
              {flowItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFlowItems([])}
                  className="text-[10px] font-mono text-rose-400 hover:text-rose-300 font-bold cursor-pointer hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Queue
                </button>
              )}
            </div>

            {flowItems.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-2 bg-slate-950/40">
                <ListOrdered className="h-7 w-7 text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-slate-300">No targets in flow queue yet</p>
                {unselectedTasks.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddAllUncompleted}
                    className="mt-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Auto-Add All Today's Targets</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {flowItems.map((item, index) => {
                  const subStyle = SUBJECT_BADGE_STYLES[item.subjectCode] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
                  const isFirst = index === 0;
                  const isLast = index === flowItems.length - 1;
                  const isCompleted = item.status === 'completed';

                  return (
                    <div
                      key={`${item.id || item.taskId || 'flow'}_${index}`}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-slate-950/30 border-slate-850 opacity-60'
                          : isFirst
                          ? 'bg-amber-500/10 border-amber-500/30 shadow-md shadow-amber-500/5'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Order Step Number */}
                        <button
                          type="button"
                          onClick={() => isCompleted && handleToggleItemStatus(index)}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-black shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 cursor-pointer'
                              : isFirst
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                          title={isCompleted ? "Click to undo completion" : undefined}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[8.5px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${subStyle.bg} ${subStyle.text} ${subStyle.border}`}>
                              {item.subjectCode}
                            </span>
                            {item.chapterName && (
                              <span className="text-[9px] text-slate-400 truncate max-w-[140px]">
                                {item.chapterName}
                              </span>
                            )}
                            {isFirst && !isCompleted && (
                              <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                                Starts First
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-bold truncate mt-0.5 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {item.title}
                          </p>
                        </div>
                      </div>

                      {/* Reorder, Undo, and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleToggleItemStatus(index)}
                            className="px-2 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-[9.5px] font-mono font-bold transition flex items-center gap-1 cursor-pointer mr-1"
                            title="Undo completion mark (protect against accidental clicks)"
                          >
                            <RotateCcw className="h-3 w-3 text-amber-400" />
                            <span>Undo</span>
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveUp(index)}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                          title="Move earlier in flow"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveDown(index)}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                          title="Move later in flow"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition cursor-pointer ml-1"
                          title="Remove from flow"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Available Tasks to add (5 cols) */}
          <div className="md:col-span-5 space-y-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-black tracking-wider text-slate-400">
                Today's Targets ({unselectedTasks.length})
              </span>
              {unselectedTasks.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddAllUncompleted}
                  className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer hover:underline"
                >
                  + Add All
                </button>
              )}
            </div>

            {unselectedTasks.length === 0 ? (
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/30 text-center text-slate-500 text-[11px]">
                {availableTasks.length === 0 ? (
                  <p>No planned targets for this date in Study Planner.</p>
                ) : (
                  <p className="text-emerald-400 font-medium">All today's targets are already in your flow!</p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
                {unselectedTasks.map((task, uIdx) => {
                  const sub = (task.subjectCode || 'AFM') as SubjectId;
                  const subStyle = SUBJECT_BADGE_STYLES[sub] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
                  const isCompleted = task.status === 'completed';

                  return (
                    <button
                      key={`${task.id || task.title || 'unselected'}_${uIdx}`}
                      type="button"
                      onClick={() => handleAddTaskToFlow(task)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700 transition flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded border ${subStyle.bg} ${subStyle.text} ${subStyle.border}`}>
                            {sub}
                          </span>
                          {isCompleted && (
                            <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Done
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] font-bold truncate mt-1 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                          {task.cleanTitle || task.title}
                        </p>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 transition shrink-0">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>Date: <strong>{selectedDate}</strong></span>
            <span>•</span>
            <span>Total Targets: <strong>{flowItems.length}</strong></span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {currentFlow.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClearFlow();
                  onClose();
                }}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Clear Existing Flow
              </button>
            )}

            <button
              type="button"
              disabled={flowItems.length === 0}
              onClick={() => handleSave(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Save Queue
            </button>

            <button
              type="button"
              disabled={flowItems.length === 0}
              onClick={() => handleSave(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase font-mono tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>Start Flow Now</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    </ModalPortal>
  );
}
