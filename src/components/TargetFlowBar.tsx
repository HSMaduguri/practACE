import React from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ListOrdered, 
  FastForward, 
  X,
  Target,
  Sparkles,
  Coffee,
  Check,
  RotateCcw
} from 'lucide-react';
import { FlowTargetItem, SubjectId } from '../types';

interface TargetFlowBarProps {
  flowTargets: FlowTargetItem[];
  activeFlowIndex: number;
  isTimerRunning: boolean;
  activeMode: string;
  isFlowActive?: boolean;
  onStartFlow: () => void;
  onOpenFlowManager: () => void;
  onMarkCurrentComplete: () => void;
  onSkipCurrent: () => void;
  onClearFlow: () => void;
  onUndoComplete?: (targetId?: string) => void;
}

const SUBJECT_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  AFM: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  FR: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  Audit: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  DT: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  IDT: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  IBS: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' }
};

export default function TargetFlowBar({
  flowTargets,
  activeFlowIndex,
  isTimerRunning,
  activeMode,
  isFlowActive = true,
  onStartFlow,
  onOpenFlowManager,
  onMarkCurrentComplete,
  onSkipCurrent,
  onClearFlow,
  onUndoComplete
}: TargetFlowBarProps) {
  if (flowTargets.length === 0) return null;

  const completedCount = flowTargets.filter(f => f.status === 'completed').length;
  const totalCount = flowTargets.length;
  const isEntireFlowDone = totalCount > 0 && completedCount === totalCount;

  // Once the whole flow is completed, show a safe completion state with Undo to protect against accidental clicks!
  if (isEntireFlowDone) {
    return (
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border-2 border-emerald-500/35 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
                Target Flow Completed ({totalCount}/{totalCount})
              </span>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                All Targets Achieved
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onUndoComplete && (
            <button
              type="button"
              onClick={() => onUndoComplete()}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-500/60 rounded-xl text-xs font-mono font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Undo completion mark of the last target"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Undo Completion</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClearFlow}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-mono transition cursor-pointer"
            title="Finish and close flow"
          >
            Close Flow
          </button>
        </div>
      </div>
    );
  }

  const currentTarget = flowTargets[activeFlowIndex];

  // Find the index of the most recently completed task in the flow
  const lastCompletedIndex = React.useMemo(() => {
    for (let i = flowTargets.length - 1; i >= 0; i--) {
      if (flowTargets[i].status === 'completed') {
        return i;
      }
    }
    return -1;
  }, [flowTargets]);

  // State to optionally expand and inspect earlier completed tasks
  const [showAllCompleted, setShowAllCompleted] = React.useState(false);

  // Number of completed tasks before the last completed task
  const hiddenEarlierCount = lastCompletedIndex > 0 ? lastCompletedIndex : 0;

  // Determine the slice of flow targets to display:
  // "once the task in the flow is done hide it only show from the last completed task"
  const visibleTargets = React.useMemo(() => {
    if (showAllCompleted || lastCompletedIndex <= 0) {
      return flowTargets.map((item, originalIdx) => ({ item, originalIdx }));
    }
    // Start display directly from the last completed task
    return flowTargets.slice(lastCompletedIndex).map((item, relIdx) => ({
      item,
      originalIdx: lastCompletedIndex + relIdx
    }));
  }, [flowTargets, lastCompletedIndex, showAllCompleted]);

  const activeClubBatchMinutes = currentTarget?.clubTotalMinutes || flowTargets.find(f => f.clubGroupId && f.clubTotalMinutes)?.clubTotalMinutes;
  const isClubbedBatchFlow = Boolean(currentTarget?.clubGroupId || flowTargets.some(f => Boolean(f.clubGroupId)));
  const formatClubMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
  };

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/30 shadow-xl space-y-3">
      {/* Top row: Flow Title, Progress Pill, and Manage Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <ListOrdered className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-black uppercase text-white tracking-wider">
                {isClubbedBatchFlow ? 'Clubbed Batch Target Flow' : 'Target Flow'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
                {completedCount}/{totalCount} Completed
              </span>
              {isClubbedBatchFlow && activeClubBatchMinutes && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  Batch Target: {formatClubMins(activeClubBatchMinutes)}
                </span>
              )}
              {isEntireFlowDone && (
                <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> All Done!
                </span>
              )}
            </div>
            {!isEntireFlowDone && currentTarget && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Current: <strong className="text-amber-300">[{currentTarget.subjectCode}] {currentTarget.title}</strong>
                {activeMode === 'study' && !isFlowActive && (
                  <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                    Paused (Manual Study Active)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!isEntireFlowDone && (!isFlowActive || activeMode !== 'study') && (
            <button
              type="button"
              onClick={onStartFlow}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono font-black text-[10px] uppercase rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="h-3 w-3 fill-slate-950" />
              <span>{activeMode === 'study' ? 'Switch to Flow' : 'Start / Resume Flow'}</span>
            </button>
          )}

          {!isEntireFlowDone && activeMode === 'study' && isFlowActive && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onMarkCurrentComplete}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-[10px] uppercase rounded-xl transition shadow-md flex items-center gap-1 cursor-pointer"
                title="Mark target done and trigger revision allocation"
              >
                <Check className="h-3 w-3 stroke-[3]" />
                <span>Mark Target Done</span>
              </button>

              <button
                type="button"
                onClick={onSkipCurrent}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-mono transition flex items-center gap-1 cursor-pointer"
                title="Skip to next target in flow"
              >
                <FastForward className="h-3 w-3" />
                <span>Skip</span>
              </button>
            </div>
          )}

          {completedCount > 0 && onUndoComplete && (
            <button
              type="button"
              onClick={() => onUndoComplete()}
              className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Undo completion mark of last completed target (protect against accidental clicks)"
            >
              <RotateCcw className="h-3 w-3 text-amber-400" />
              <span>Undo Done</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFlowManager}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10.5px] font-mono rounded-xl transition cursor-pointer"
          >
            Reorder
          </button>

          <button
            type="button"
            onClick={onClearFlow}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
            title="Clear Flow"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Pipeline Steps Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        {/* If earlier completed tasks exist before the last completed task, show an expandable pill */}
        {hiddenEarlierCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllCompleted(prev => !prev)}
            className={`px-2.5 py-2 rounded-xl border text-[10px] font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer select-none ${
              showAllCompleted
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30 shadow-xs'
            }`}
            title={showAllCompleted ? "Collapse earlier completed tasks" : `Show ${hiddenEarlierCount} earlier completed tasks`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{showAllCompleted ? `Collapse Earlier (${hiddenEarlierCount})` : `+${hiddenEarlierCount} Earlier Done`}</span>
          </button>
        )}

        {/* Separator arrow if earlier completed tasks are collapsed and items follow */}
        {hiddenEarlierCount > 0 && !showAllCompleted && visibleTargets.length > 0 && (
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-emerald-500/60" />
        )}

        {visibleTargets.map(({ item, originalIdx }, displayIdx) => {
          const subStyle = SUBJECT_BADGE_STYLES[item.subjectCode] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
          const isDone = item.status === 'completed';
          const isLastCompleted = isDone && originalIdx === lastCompletedIndex;
          const isActive = originalIdx === activeFlowIndex && !isDone;

          return (
            <React.Fragment key={`${item.id || item.taskId || 'item'}_${originalIdx}_${displayIdx}`}>
              {displayIdx > 0 && (
                <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${isDone ? 'text-emerald-500/60' : isActive ? 'text-amber-400' : 'text-slate-700'}`} />
              )}
              <div
                className={`px-3 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 max-w-[220px] sm:max-w-[260px] ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                    : isLastCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100 shadow-sm'
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-slate-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className={`h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-mono font-black shrink-0 ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : isActive
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isDone ? '✓' : originalIdx + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded border ${subStyle.bg} ${subStyle.text} ${subStyle.border}`}>
                      {item.subjectCode}
                    </span>
                    {isActive && (
                      <span className="text-[7.5px] font-mono font-black uppercase px-1 py-0.2 bg-amber-400 text-slate-950 rounded">
                        Active
                      </span>
                    )}
                    {isLastCompleted && (
                      <span className="text-[7.5px] font-mono font-black uppercase px-1 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                        Last Done
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] font-bold truncate mt-0.5 ${isDone ? 'line-through text-slate-400' : isActive ? 'text-amber-200' : 'text-slate-400'}`}>
                    {item.title}
                  </p>
                </div>

                {isDone && onUndoComplete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUndoComplete(item.id);
                    }}
                    className="px-1.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30 transition flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                    title="Undo completion mark for this target"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    <span>Undo</span>
                  </button>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
