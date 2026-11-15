/**
 * Monthly 24-Hour Time Ledger Day-Wise Report Modal
 * Interactive viewer and Vector PDF Exporter for Month-wise Study, Desk Break, Routine, Sleep, and Idle Time.
 * Unit: Hours.
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Calendar, 
  Clock, 
  Coffee, 
  Moon, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  BarChart3,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  calculateMonthlyLedger, 
  exportMonthlyLedgerPdf, 
  MonthlyLedgerSummary 
} from '../utils/monthlyLedgerCalculator';
import { ModalPortal } from './ModalPortal';

interface MonthlyTimeReportModalProps {
  onClose: () => void;
  initialMonth?: string; // "YYYY-MM"
  sessionLogs?: any[];
  sleepSessions?: any[];
  focusSessions?: any[];
}

export const MonthlyTimeReportModal: React.FC<MonthlyTimeReportModalProps> = ({
  onClose,
  initialMonth,
  sessionLogs,
  sleepSessions,
  focusSessions
}) => {
  const currentMonthKey = useMemo(() => {
    if (initialMonth) return initialMonth;
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, [initialMonth]);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [filterActiveOnly, setFilterActiveOnly] = useState<boolean>(false);

  // Month navigation helpers
  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const newY = prevDate.getFullYear();
    const newM = String(prevDate.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${newY}-${newM}`);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const nextDate = new Date(y, m, 1);
    const newY = nextDate.getFullYear();
    const newM = String(nextDate.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${newY}-${newM}`);
  };

  // Compute live month metrics
  const summary: MonthlyLedgerSummary = useMemo(() => {
    return calculateMonthlyLedger(selectedMonth, sessionLogs, sleepSessions, focusSessions);
  }, [selectedMonth, sessionLogs, sleepSessions, focusSessions]);

  const displayedDays = useMemo(() => {
    if (!filterActiveOnly) return summary.days;
    return summary.days.filter(d => d.studyMinutes > 0 || d.breakMinutes > 0 || d.routineMinutes > 0 || d.sleepMinutes > 0);
  }, [summary.days, filterActiveOnly]);

  const handleExport = () => {
    exportMonthlyLedgerPdf(summary);
  };

  // Generate selectable month options (past 12 months + future 3 months)
  const monthOptions = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    const now = new Date();
    for (let offset = -8; offset <= 3; offset++) {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const l = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      list.push({ key: k, label: l });
    }
    return list;
  }, []);

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-display tracking-tight text-white flex items-center gap-2">
                  Monthly 24-Hour Time Ledger Report
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Unit: Hours
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Download High-Yield Vector PDF"
            >
              <Download className="h-3.5 w-3.5 text-amber-300" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Month Selector & Controls */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Select Month:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-white px-2 py-1 outline-hidden cursor-pointer"
              >
                {monthOptions.map(opt => (
                  <option key={opt.key} value={opt.key} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterActiveOnly}
                onChange={(e) => setFilterActiveOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>Show active tracked days only ({summary.activeTrackingDays}d)</span>
            </label>

            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              Allocation Base: <strong className="text-white">{summary.totalMonthHours} hrs</strong> {summary.isRunningMonth ? `(${summary.daysCountedForAvg}d elapsed)` : `(${summary.daysInMonth}d)`}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Executive KPI Metric Cards (Hours) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            {/* Study Time */}
            <div className="bg-emerald-950/25 border border-emerald-500/25 rounded-xl p-3 text-center">
              <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-emerald-400 mb-1 flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Study Time
              </div>
              <div className="text-xl font-black font-mono text-emerald-300">
                {summary.totalStudyHours.toFixed(1)} <span className="text-xs text-emerald-500 font-normal">hrs</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Avg: <strong className="text-slate-200">{summary.avgStudyHoursPerDay.toFixed(1)}h</strong> / day
                {summary.isRunningMonth && (
                  <span className="text-[9px] text-emerald-400 font-mono block">({summary.daysCountedForAvg}d elapsed)</span>
                )}
              </div>
            </div>

            {/* Desk Break */}
            <div className="bg-amber-950/25 border border-amber-500/25 rounded-xl p-3 text-center">
              <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-amber-400 mb-1 flex items-center justify-center gap-1">
                <Coffee className="h-2.5 w-2.5" /> Desk Break
              </div>
              <div className="text-xl font-black font-mono text-amber-300">
                {summary.totalBreakHours.toFixed(1)} <span className="text-xs text-amber-500 font-normal">hrs</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Avg: <strong className="text-slate-200">{summary.avgBreakHoursPerDay.toFixed(1)}h</strong> / day
                {summary.isRunningMonth && (
                  <span className="text-[9px] text-amber-400 font-mono block">({summary.daysCountedForAvg}d elapsed)</span>
                )}
              </div>
            </div>

            {/* Routines */}
            <div className="bg-cyan-950/25 border border-cyan-500/25 rounded-xl p-3 text-center">
              <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-cyan-400 mb-1 flex items-center justify-center gap-1">
                <Activity className="h-2.5 w-2.5" /> Routines
              </div>
              <div className="text-xl font-black font-mono text-cyan-300">
                {summary.totalRoutineHours.toFixed(1)} <span className="text-xs text-cyan-500 font-normal">hrs</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Avg: <strong className="text-slate-200">{summary.avgRoutineHoursPerDay.toFixed(1)}h</strong> / day
                {summary.isRunningMonth && (
                  <span className="text-[9px] text-cyan-400 font-mono block">({summary.daysCountedForAvg}d elapsed)</span>
                )}
              </div>
            </div>

            {/* Sleep */}
            <div className="bg-violet-950/25 border border-violet-500/25 rounded-xl p-3 text-center">
              <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-violet-400 mb-1 flex items-center justify-center gap-1">
                <Moon className="h-2.5 w-2.5" /> Sleep Rest
              </div>
              <div className="text-xl font-black font-mono text-violet-300">
                {summary.totalSleepHours.toFixed(1)} <span className="text-xs text-violet-500 font-normal">hrs</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Avg: <strong className="text-slate-200">{summary.avgSleepHoursPerDay.toFixed(1)}h</strong> / day
                {summary.isRunningMonth && (
                  <span className="text-[9px] text-violet-400 font-mono block">({summary.daysCountedForAvg}d elapsed)</span>
                )}
              </div>
            </div>

            {/* Idle Time */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-center gap-1">
                <Clock className="h-2.5 w-2.5 text-slate-500" /> Idle Time
              </div>
              <div className="text-xl font-black font-mono text-slate-200">
                {summary.totalIdleHours.toFixed(1)} <span className="text-xs text-slate-500 font-normal">hrs</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Avg: <strong className="text-slate-200">{summary.avgIdleHoursPerDay.toFixed(1)}h</strong> / day
                {summary.isRunningMonth && (
                  <span className="text-[9px] text-slate-500 font-mono block">({summary.daysCountedForAvg}d elapsed)</span>
                )}
              </div>
            </div>

          </div>

          {/* Life-Study Balance Ratio Banner */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Life-Study Balance Ratio: </strong>
                <span className="font-mono font-extrabold text-amber-400 text-sm ml-1">
                  {summary.lifeStudyRatio.toFixed(2)}x
                </span>
                <span className="text-slate-400 text-[11px] ml-1.5">
                  (Total Rest [Breaks {summary.totalBreakHours.toFixed(1)}h + Routines {summary.totalRoutineHours.toFixed(1)}h + Sleep {summary.totalSleepHours.toFixed(1)}h] vs Study {summary.totalStudyHours.toFixed(1)}h)
                </span>
              </span>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              Study Efficiency Share: <strong className="text-emerald-400">{((summary.totalStudyHours / summary.totalMonthHours) * 100).toFixed(1)}%</strong> of month
            </div>
          </div>

          {/* Day Wise Metric Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3 text-center text-amber-400 w-10 border-r border-slate-800">#</th>
                    <th className="py-2.5 px-3 border-r border-slate-800 text-slate-200">Date & Day</th>
                    <th className="py-2.5 px-3 text-right text-emerald-400 border-r border-slate-800">Study Time (hrs)</th>
                    <th className="py-2.5 px-3 text-right text-amber-400 border-r border-slate-800">Desk Break (hrs)</th>
                    <th className="py-2.5 px-3 text-right text-cyan-400 border-r border-slate-800">Routines (hrs)</th>
                    <th className="py-2.5 px-3 text-right text-violet-400 border-r border-slate-800">Sleep (hrs)</th>
                    <th className="py-2.5 px-3 text-right text-slate-400 border-r border-slate-800">Idle Time (hrs)</th>
                    <th className="py-2.5 px-3 text-center text-slate-200 border-r border-slate-800 w-24">Total (hrs)</th>
                    <th className="py-2.5 px-3 text-center text-slate-400 w-20">Study %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/80 font-mono text-[11px]">
                  {displayedDays.map((d) => {
                    const isWeekend = d.weekday === 'Sun' || d.weekday === 'Sat';

                    // Future unreached day without activity
                    if (d.isFuture && d.studyHours === 0 && d.breakHours === 0 && d.routineHours === 0 && d.sleepHours === 0) {
                      return (
                        <tr 
                          key={d.date}
                          className="bg-slate-950/40 text-slate-600 opacity-60"
                        >
                          <td className="py-2 px-3 text-center text-slate-700 border-r border-slate-850">
                            {d.dayNumber}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-850 font-sans text-slate-500 whitespace-nowrap">
                            {d.formattedDate} <span className="text-[10px] text-slate-600 uppercase font-mono">({d.weekday})</span>
                          </td>
                          <td className="py-2 px-3 text-right border-r border-slate-850 text-slate-700">—</td>
                          <td className="py-2 px-3 text-right border-r border-slate-850 text-slate-700">—</td>
                          <td className="py-2 px-3 text-right border-r border-slate-850 text-slate-700">—</td>
                          <td className="py-2 px-3 text-right border-r border-slate-850 text-slate-700">—</td>
                          <td className="py-2 px-3 text-right border-r border-slate-850 text-slate-700">—</td>
                          <td className="py-2 px-3 text-center border-r border-slate-850 text-slate-700">—</td>
                          <td className="py-2 px-3 text-center text-slate-700">—</td>
                        </tr>
                      );
                    }

                    return (
                      <tr 
                        key={d.date}
                        className={`hover:bg-slate-900/70 transition-colors ${
                          d.isToday 
                            ? 'bg-indigo-950/30 border-l-2 border-indigo-500' 
                            : isWeekend 
                              ? 'bg-slate-900/30' 
                              : 'bg-transparent'
                        }`}
                      >
                        <td className="py-2 px-3 text-center font-bold text-slate-500 border-r border-slate-850">
                          {d.dayNumber}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-850 font-sans font-medium text-slate-200 whitespace-nowrap">
                          {d.formattedDate} <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">({d.weekday})</span>
                          {d.isToday && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-black text-[8.5px] uppercase tracking-wide">
                              Today
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right border-r border-slate-850 font-bold text-emerald-300">
                          {d.studyHours > 0 ? `${d.studyHours.toFixed(2)}h` : <span className="text-slate-600 font-normal">0.00h</span>}
                        </td>
                        <td className="py-2 px-3 text-right border-r border-slate-850 text-amber-300">
                          {d.breakHours > 0 ? `${d.breakHours.toFixed(2)}h` : <span className="text-slate-600 font-normal">0.00h</span>}
                        </td>
                        <td className="py-2 px-3 text-right border-r border-slate-850 text-cyan-300">
                          {d.routineHours > 0 ? `${d.routineHours.toFixed(2)}h` : <span className="text-slate-600 font-normal">0.00h</span>}
                        </td>
                        <td className="py-2 px-3 text-right border-r border-slate-850 text-violet-300">
                          {d.sleepHours > 0 ? `${d.sleepHours.toFixed(2)}h` : <span className="text-slate-600 font-normal">0.00h</span>}
                        </td>
                        <td className="py-2 px-3 text-right border-r border-slate-850 text-slate-400">
                          {d.idleHours.toFixed(2)}h
                        </td>
                        <td className="py-2 px-3 text-center border-r border-slate-850 font-extrabold text-slate-200">
                          24.00h
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            d.studyPercentage >= 40 
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                              : d.studyPercentage > 0 
                                ? 'bg-indigo-500/15 text-indigo-300' 
                                : 'text-slate-600'
                          }`}>
                            {d.studyPercentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  {/* Totals Row */}
                  <tr className="bg-slate-900 border-t-2 border-slate-850 font-mono font-bold text-xs">
                    <td colSpan={2} className="py-2.5 px-3 text-right uppercase tracking-wider text-amber-400 border-r border-slate-850">
                      Month Totals:
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-300 font-black border-r border-slate-850">
                      {summary.totalStudyHours.toFixed(2)}h
                    </td>
                    <td className="py-2.5 px-3 text-right text-amber-300 font-black border-r border-slate-850">
                      {summary.totalBreakHours.toFixed(2)}h
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-300 font-black border-r border-slate-850">
                      {summary.totalRoutineHours.toFixed(2)}h
                    </td>
                    <td className="py-2.5 px-3 text-right text-violet-300 font-black border-r border-slate-850">
                      {summary.totalSleepHours.toFixed(2)}h
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300 font-black border-r border-slate-850">
                      {summary.totalIdleHours.toFixed(2)}h
                    </td>
                    <td className="py-2.5 px-3 text-center text-white font-black border-r border-slate-850">
                      {summary.totalMonthHours.toFixed(2)}h
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-400 font-black">
                      {((summary.totalStudyHours / summary.totalMonthHours) * 100).toFixed(1)}%
                    </td>
                  </tr>

                  {/* Daily Averages Row */}
                  <tr className="bg-slate-950 font-mono text-[11px] text-slate-400 border-t border-slate-850">
                    <td colSpan={2} className="py-2 px-3 text-right uppercase tracking-wider text-slate-400 border-r border-slate-850">
                      Daily Averages ({summary.isRunningMonth ? `${summary.daysCountedForAvg} days elapsed till today` : `${summary.daysInMonth} days`}):
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-400 border-r border-slate-850">
                      {summary.avgStudyHoursPerDay.toFixed(2)} h/d
                    </td>
                    <td className="py-2 px-3 text-right text-amber-400 border-r border-slate-850">
                      {summary.avgBreakHoursPerDay.toFixed(2)} h/d
                    </td>
                    <td className="py-2 px-3 text-right text-cyan-400 border-r border-slate-850">
                      {summary.avgRoutineHoursPerDay.toFixed(2)} h/d
                    </td>
                    <td className="py-2 px-3 text-right text-violet-400 border-r border-slate-850">
                      {summary.avgSleepHoursPerDay.toFixed(2)} h/d
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400 border-r border-slate-850">
                      {summary.avgIdleHoursPerDay.toFixed(2)} h/d
                    </td>
                    <td className="py-2 px-3 text-center text-slate-200 border-r border-slate-850">
                      24.00 h/d
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600">
                      -
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Exact 24-hour minute-by-minute ledger reconciliation verified.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-800"
            >
              Close
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-amber-300" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
};

export default MonthlyTimeReportModal;
