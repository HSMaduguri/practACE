import React, { useState, useMemo, useEffect } from 'react';
import { ClipboardList, Clock } from 'lucide-react';
import { isLmrModeCurrentlyOn, isTaskEligibleInActiveLmrSprint } from './LmrSprintBoard';
import { useCALevel, getLevelSubjectIds } from '../data/curriculumLevels';
import { getLevelScopedKey } from '../utils/levelStorage';

interface TaskItem {
  id?: string;
  due?: string;
  created?: string;
  taskDate?: string;
  scheduledDate?: string;
  date?: string;
  notes?: string;
  status?: string; // 'needsAction' | 'completed' | 'unachieved' | 'rescheduled'
  subjectCode?: string;
  targetDurationMinutes?: number;
  duration?: number;
  [key: string]: any;
}

interface TasksSummaryBoardProps {
  tasks: TaskItem[];
  defaultTimeframe?: 'today' | 'week' | 'month';
  className?: string;
  onViewPending?: () => void;
  onViewMissed?: () => void;
}

const SUBJECT_BAR_META: Record<string, { barClass: string; badgeClass: string; textClass: string }> = {
  // Foundation
  Accounts: {
    barClass: 'bg-sky-500',
    badgeClass: 'bg-sky-500/15 border-sky-500/35 text-sky-300',
    textClass: 'text-sky-400',
  },
  Law: {
    barClass: 'bg-purple-500',
    badgeClass: 'bg-purple-500/15 border-purple-500/35 text-purple-300',
    textClass: 'text-purple-400',
  },
  MathStats: {
    barClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
    textClass: 'text-emerald-400',
  },
  Econ: {
    barClass: 'bg-amber-500',
    badgeClass: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
    textClass: 'text-amber-400',
  },
  // Intermediate
  AdvAcc: {
    barClass: 'bg-sky-500',
    badgeClass: 'bg-sky-500/15 border-sky-500/35 text-sky-300',
    textClass: 'text-sky-400',
  },
  CorpLaw: {
    barClass: 'bg-indigo-500',
    badgeClass: 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300',
    textClass: 'text-indigo-400',
  },
  Tax: {
    barClass: 'bg-amber-500',
    badgeClass: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
    textClass: 'text-amber-400',
  },
  Cost: {
    barClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
    textClass: 'text-emerald-400',
  },
  AuditInter: {
    barClass: 'bg-purple-500',
    badgeClass: 'bg-purple-500/15 border-purple-500/35 text-purple-300',
    textClass: 'text-purple-400',
  },
  FMSM: {
    barClass: 'bg-rose-500',
    badgeClass: 'bg-rose-500/15 border-rose-500/35 text-rose-300',
    textClass: 'text-rose-400',
  },
  // Final
  FR: {
    barClass: 'bg-sky-500',
    badgeClass: 'bg-sky-500/15 border-sky-500/35 text-sky-300',
    textClass: 'text-sky-400',
  },
  AFM: {
    barClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
    textClass: 'text-emerald-400',
  },
  Audit: {
    barClass: 'bg-amber-500',
    badgeClass: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
    textClass: 'text-amber-400',
  },
  DT: {
    barClass: 'bg-rose-500',
    badgeClass: 'bg-rose-500/15 border-rose-500/35 text-rose-300',
    textClass: 'text-rose-400',
  },
  IDT: {
    barClass: 'bg-indigo-500',
    badgeClass: 'bg-indigo-500/15 border-indigo-500/35 text-indigo-300',
    textClass: 'text-indigo-400',
  },
  IBS: {
    barClass: 'bg-cyan-500',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300',
    textClass: 'text-cyan-400',
  },
};

function resolveNormalizedTaskDate(t: TaskItem, fallbackDateStr: string): string {
  if (!t) return '';
  const raw =
    t.taskDate ||
    t.scheduledDate ||
    t.date ||
    (t.due ? String(t.due).split('T')[0] : '') ||
    (t.created ? String(t.created).split('T')[0] : '') ||
    fallbackDateStr;
  const sliced = String(raw || '').trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(sliced) ? sliced : '';
}

const CANONICAL_SUBJECT_LOOKUP: Record<string, string> = Object.keys(SUBJECT_BAR_META).reduce((acc, k) => {
  acc[k.toUpperCase()] = k;
  return acc;
}, {} as Record<string, string>);

function resolveTaskSubjectCode(t: TaskItem, fallbackSub: string): string {
  if (t.subjectCode && SUBJECT_BAR_META[t.subjectCode]) return t.subjectCode;
  const notesStr = String(t.notes || '');
  const subMatch = notesStr.match(/Subject:\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)/i);
  if (subMatch) {
    const found = subMatch[1].toUpperCase();
    return CANONICAL_SUBJECT_LOOKUP[found] || fallbackSub;
  }
  const titleMatch = String(t.title || '').match(/\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS)\s*\]/i);
  if (titleMatch) {
    const found = titleMatch[1].toUpperCase();
    return CANONICAL_SUBJECT_LOOKUP[found] || fallbackSub;
  }
  return fallbackSub;
}

function resolveTaskMinutes(t: TaskItem): number {
  const direct = Number(t.targetDurationMinutes) || Number(t.duration);
  if (direct > 0) return direct;
  const notesStr = String(t.notes || '');
  const match = notesStr.match(/TargetDurationMinutes:\s*(\d+)/i);
  if (match && Number(match[1]) > 0) return Number(match[1]);
  return 45;
}

function formatHrsMinsCompact(mins: number): string {
  const rounded = Math.max(0, Math.round(mins));
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function TasksSummaryBoard({
  tasks,
  defaultTimeframe = 'today',
  className = '',
  onViewPending,
  onViewMissed
}: TasksSummaryBoardProps) {
  const caLevel = useCALevel();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>(defaultTimeframe);
  const [syncTick, setSyncTick] = useState<number>(0);

  useEffect(() => {
    const handleSync = () => setSyncTick((prev) => prev + 1);
    window.addEventListener('storage', handleSync);
    window.addEventListener('practca_tasks_updated', handleSync);
    window.addEventListener('practca_target_system_synced', handleSync);
    window.addEventListener('practca_revision_update', handleSync);
    window.addEventListener('practca_lmr_preference_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('practca_tasks_updated', handleSync);
      window.removeEventListener('practca_target_system_synced', handleSync);
      window.removeEventListener('practca_revision_update', handleSync);
      window.removeEventListener('practca_lmr_preference_updated', handleSync);
    };
  }, []);

  const stats = useMemo(() => {
    const levelSubjectIds = getLevelSubjectIds(caLevel);
    const defaultFallbackSub = levelSubjectIds[levelSubjectIds.length - 1] || 'IDT';
    const d = new Date();
    const yr = d.getFullYear();
    const mn = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const todayStr = `${yr}-${mn}-${dy}`;

    // Current Week range (Monday to Sunday of the current week)
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const diffToMon = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const mon = new Date(d.getFullYear(), d.getMonth(), diffToMon);
    mon.setHours(0, 0, 0, 0);

    const sun = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);

    const monStr = `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, '0')}-${String(mon.getDate()).padStart(2, '0')}`;
    const sunStr = `${sun.getFullYear()}-${String(sun.getMonth() + 1).padStart(2, '0')}-${String(sun.getDate()).padStart(2, '0')}`;
    const monthPrefix = `${yr}-${mn}`;

    const lmrActive = isLmrModeCurrentlyOn();

    // Deduplicate tasks and exclude deleted or lapsed non-1.5-day tasks when LMR mode is active
    const seenKeys = new Set<string>();
    const normalizedTasks = (Array.isArray(tasks) ? tasks : []).filter((t) => {
      if (!t || (!t.title && !t.cleanTitle)) return false;
      const tDate = resolveNormalizedTaskDate(t, todayStr);
      if (!tDate) return false;

      if (lmrActive && !isTaskEligibleInActiveLmrSprint(t)) {
        return false;
      }

      // Check if deleted for this date on Grind Clock
      try {
        const rawDel = localStorage.getItem(getLevelScopedKey(`practca_deleted_targets_${tDate}`, caLevel));
        if (rawDel) {
          const delArr = JSON.parse(rawDel);
          if (Array.isArray(delArr)) {
            const delSet = new Set(delArr.map((k: any) => String(k || '').toLowerCase()));
            const idLower = String(t.id || '').trim().toLowerCase();
            const titleLower = String(t.cleanTitle || t.title || '').trim().toLowerCase();
            if ((idLower && delSet.has(idLower)) || (titleLower && delSet.has(titleLower))) {
              return false;
            }
          }
        }
      } catch {}

      const dedupeKey = t.id
        ? String(t.id).trim().toLowerCase()
        : `${tDate}_${String(t.cleanTitle || t.title || '').trim().toLowerCase()}`;
      if (seenKeys.has(dedupeKey)) return false;
      seenKeys.add(dedupeKey);
      return true;
    });

    const filtered = normalizedTasks.filter((t) => {
      const tDate = resolveNormalizedTaskDate(t, todayStr);
      if (!tDate) return false;

      if (timeframe === 'today') {
        return tDate === todayStr;
      } else if (timeframe === 'week') {
        return tDate >= monStr && tDate <= sunStr;
      } else if (timeframe === 'month') {
        return tDate.startsWith(monthPrefix);
      }
      return false;
    });

    let totalCompleted = 0;
    let totalMissedRescheduled = 0;
    let totalPending = 0;
    let totalPlannedMins = 0;
    let totalCompletedMins = 0;

    const subjectStatsMap: Record<string, { subjectCode: string; plannedMins: number; completedMins: number; count: number; doneCount: number }> = {};

    filtered.forEach((t) => {
      const isCompleted = t.status === 'completed' || Boolean(t.completed);
      const mins = resolveTaskMinutes(t);
      const sub = resolveTaskSubjectCode(t, defaultFallbackSub);

      if (!subjectStatsMap[sub]) {
        subjectStatsMap[sub] = { subjectCode: sub, plannedMins: 0, completedMins: 0, count: 0, doneCount: 0 };
      }
      subjectStatsMap[sub].plannedMins += mins;
      subjectStatsMap[sub].count += 1;
      totalPlannedMins += mins;

      if (isCompleted) {
        totalCompleted++;
        totalCompletedMins += mins;
        subjectStatsMap[sub].completedMins += mins;
        subjectStatsMap[sub].doneCount += 1;
        return;
      }

      const notesStr = String(t.notes || '');
      const isExplicitlyMissed =
        t.status === 'unachieved' ||
        t.status === 'rescheduled' ||
        /STATUS:\s*UNACHIEVED/i.test(notesStr);

      if (isExplicitlyMissed) {
        totalMissedRescheduled++;
      } else {
        totalPending++;
      }
    });

    const totalAdded = filtered.length;
    const completionRate = totalAdded > 0 ? Math.round((totalCompleted / totalAdded) * 100) : 0;

    const allOrderedCandidates = Array.from(new Set([...levelSubjectIds, ...Object.keys(subjectStatsMap)]));
    const orderedSubjects = allOrderedCandidates
      .filter((s) => subjectStatsMap[s] && subjectStatsMap[s].plannedMins > 0)
      .map((s) => {
        const entry = subjectStatsMap[s];
        const sharePct = totalPlannedMins > 0 ? Math.max(4, Math.round((entry.plannedMins / totalPlannedMins) * 100)) : 0;
        const subDonePct = entry.count > 0 ? Math.round((entry.doneCount / entry.count) * 100) : 0;
        return {
          ...entry,
          sharePct,
          subDonePct,
          meta: SUBJECT_BAR_META[s] || SUBJECT_BAR_META.IDT,
        };
      });

    return {
      totalAdded,
      totalCompleted,
      totalPending,
      totalMissedRescheduled,
      completionRate,
      totalPlannedMins,
      totalCompletedMins,
      orderedSubjects,
      todayStr,
      monStr,
      sunStr,
      monthPrefix,
      lmrActive
    };
  }, [tasks, timeframe, syncTick, caLevel]);

  // SVG Ring geometry (r = 14, circumference = 2 * PI * 14 ≈ 87.96)
  const ringRadius = 14;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = ringCircumference - (stats.completionRate / 100) * ringCircumference;

  return (
    <div className={`bg-slate-900/80 border border-slate-800/90 rounded-xl px-3.5 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 font-sans shadow-xs ${className}`}>
      {/* Left: Circular Progress Ring, Scope Selector & Planned Hours */}
      <div className="flex items-center gap-3 flex-wrap shrink-0">
        {/* SVG Circular Progress Ring */}
        <div className="flex items-center gap-2.5 pr-2 border-r border-slate-800">
          <div className="relative h-9 w-9 flex items-center justify-center shrink-0">
            <svg className="h-9 w-9 -rotate-90 transform" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r={ringRadius}
                fill="none"
                stroke="#0f172a"
                strokeWidth="3.5"
              />
              <circle
                cx="18"
                cy="18"
                r={ringRadius}
                fill="none"
                stroke={stats.completionRate >= 100 ? '#10b981' : stats.completionRate >= 50 ? '#34d399' : '#f59e0b'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringDashOffset}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-[9.5px] font-mono font-black tabular-nums text-emerald-400">
              {stats.completionRate}%
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1" title="Study Target & Execution Pulse">
              <ClipboardList className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-200 tracking-tight uppercase font-mono">
                Target Pulse
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 tabular-nums">
              <Clock className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-emerald-400">{formatHrsMinsCompact(stats.totalCompletedMins)}</strong>
                {' / '}
                <strong className="text-slate-200">{formatHrsMinsCompact(stats.totalPlannedMins)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 font-mono text-[10px]">
          {(['today', 'week', 'month'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded-md font-bold capitalize transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={
                tf === 'today'
                  ? `Showing tasks for Today (${stats.todayStr})`
                  : tf === 'week'
                  ? `Showing tasks for Current Week (${stats.monStr} to ${stats.sunStr})`
                  : `Showing tasks for Current Month (${stats.monthPrefix})`
              }
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Subject Time Allocation Bar & Inline Subject Chips */}
      <div className="flex-1 min-w-[200px] max-w-2xl flex flex-col gap-1.5">
        {stats.orderedSubjects.length > 0 ? (
          <>
            {/* Proportional Multi-Segment Subject Time Bar */}
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/90 flex p-0.5 gap-0.5">
              {stats.orderedSubjects.map((s) => (
                <div
                  key={s.subjectCode}
                  style={{ width: `${s.sharePct}%` }}
                  className={`h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 ${s.meta.barClass}`}
                  title={`${s.subjectCode}: ${formatHrsMinsCompact(s.completedMins)} done / ${formatHrsMinsCompact(s.plannedMins)} planned (${s.doneCount}/${s.count} targets)`}
                />
              ))}
            </div>
            {/* Compact Subject Breakdown Badges */}
            <div className="flex items-center gap-1.5 flex-wrap font-mono text-[9.5px] tabular-nums">
              {stats.orderedSubjects.map((s) => (
                <span
                  key={s.subjectCode}
                  className={`px-1.5 py-0.5 rounded border font-bold flex items-center gap-1 ${s.meta.badgeClass}`}
                  title={`${s.subjectCode}: ${s.doneCount}/${s.count} targets completed (${s.subDonePct}%)`}
                >
                  <span className="font-black">{s.subjectCode}</span>
                  <span className="opacity-85">{formatHrsMinsCompact(s.plannedMins)}</span>
                  <span className="text-[8.5px] opacity-75">({s.doneCount}/{s.count})</span>
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="text-[10.5px] font-mono text-slate-500 flex items-center gap-1.5">
            <span>No subject hours scheduled in this {timeframe} window yet.</span>
          </div>
        )}
      </div>

      {/* Right: Aligned Tabular Metrics */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap font-mono text-xs tabular-nums shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase">Scheduled:</span>
          <span className="font-bold text-slate-200">{stats.totalAdded}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/20 border border-emerald-500/25">
          <span className="text-[10px] text-slate-400 uppercase">Done:</span>
          <span className="font-bold text-emerald-400">{stats.totalCompleted}</span>
        </div>

        {!stats.lmrActive && (
          <>
            <button
              type="button"
              onClick={onViewPending}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 transition-colors ${
                onViewPending ? 'hover:border-amber-500/40 cursor-pointer' : ''
              }`}
              title={onViewPending ? 'Click to open Backlog (Pending targets)' : undefined}
            >
              <span className="text-[10px] text-slate-400 uppercase">Pending:</span>
              <span className="font-bold text-amber-400">{stats.totalPending}</span>
            </button>

            <button
              type="button"
              onClick={onViewMissed}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 transition-colors ${
                onViewMissed ? 'hover:border-rose-500/40 cursor-pointer' : ''
              }`}
              title={onViewMissed ? 'Click to open Backlog (Missed targets)' : undefined}
            >
              <span className="text-[10px] text-slate-400 uppercase">Missed:</span>
              <span className="font-bold text-rose-400">{stats.totalMissedRescheduled}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TasksSummaryBoard;

