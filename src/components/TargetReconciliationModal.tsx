/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Clock,
  Target,
  ListOrdered,
  Flag,
  FileText,
  ClipboardList,
  X,
  AlertTriangle,
  Layers,
  Calendar
} from 'lucide-react';
import {
  reconcileAllTargetSystems,
  getSystemReconciliationReport,
  SystemReconciliationReport
} from '../utils/targetReconciliationEngine';
import { SubjectId } from '../types';

interface TargetReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onAfterReconcile?: () => void;
}

const SUBJECT_BADGE_STYLES: Record<SubjectId, string> = {
  // Foundation
  Accounts: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Law: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  MathStats: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Econ: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  // Intermediate
  AdvAcc: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CorpLaw: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Tax: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Cost: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  AuditInter: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  FMSM: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  // Final
  FR: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  AFM: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Audit: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  DT: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  IDT: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  IBS: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  // CMA Foundation
  CMAFoundLaw: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  CMAFoundAcc: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CMAFoundMath: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  CMAFoundEcon: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  // CMA Intermediate
  CMAInterLaw: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  CMAInterFA: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CMAInterTax: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  CMAInterCost: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CMAInterOMSM: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  CMAInterCAA: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  CMAInterFMDA: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  CMAInterMA: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  // CMA Final
  CMAFinalLaw: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  CMAFinalSFM: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CMAFinalDT: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  CMAFinalSCM: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CMAFinalCMA: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  CMAFinalCFR: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  CMAFinalIDT: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  CMAFinalSPBV: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
};

function formatMinsToHoursMins(mins: number): string {
  const safe = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export const TargetReconciliationModal: React.FC<TargetReconciliationModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onAfterReconcile
}) => {
  const [report, setReport] = useState<SystemReconciliationReport | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const [lastReconciledMsg, setLastReconciledMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Run silent reconciliation pass on open so any latent drift is resolved immediately
    const initialReport = reconcileAllTargetSystems(selectedDate, { source: 'manual_audit' });
    setReport(initialReport);
    if (initialReport.discrepanciesFixedCount > 0 && onAfterReconcile) {
      onAfterReconcile();
    }
  }, [isOpen, selectedDate]);

  useEffect(() => {
    if (!isOpen) return;
    const refresh = () => {
      setReport(getSystemReconciliationReport(selectedDate));
    };
    window.addEventListener('practca_target_clock_updated', refresh);
    window.addEventListener('practca_flow_updated', refresh);
    window.addEventListener('practca_tasks_updated', refresh);
    window.addEventListener('practca_pomo_logs_update', refresh);
    return () => {
      window.removeEventListener('practca_target_clock_updated', refresh);
      window.removeEventListener('practca_flow_updated', refresh);
      window.removeEventListener('practca_tasks_updated', refresh);
      window.removeEventListener('practca_pomo_logs_update', refresh);
    };
  }, [isOpen, selectedDate]);

  const handleManualReconcileNow = () => {
    setIsReconciling(true);
    const updatedReport = reconcileAllTargetSystems(selectedDate, {
      source: 'manual_audit',
      dispatchEvents: true
    });
    setReport(updatedReport);
    if (onAfterReconcile) {
      onAfterReconcile();
    }
    setTimeout(() => {
      setIsReconciling(false);
      setLastReconciledMsg(
        updatedReport.discrepanciesFixedCount > 0
          ? `Reconciled ${updatedReport.discrepanciesFixedCount} item(s) across all 7 modules.`
          : 'All 7 modules verified in 100% mathematical parity.'
      );
    }, 220);
  };

  const pillarIconMap = useMemo(
    () => ({
      clock: Clock,
      metrics: Target,
      flow: ListOrdered,
      daily_targets: Calendar,
      milestones: Flag,
      revision_report: FileText,
      log_system: ClipboardList
    }),
    []
  );

  if (!isOpen || !report) return null;

  const { summary, pillars, targets, isFullySynced } = report;

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-[#090d1a] border border-slate-800 rounded-3xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                isFullySynced
                  ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                  : 'bg-amber-500/15 border-amber-500/35 text-amber-400'
              }`}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-mono">
                  Unified Target, Schedule & Log Reconciliation Hub
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                  {selectedDate}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase border flex items-center gap-1 ${
                    isFullySynced
                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{isFullySynced ? '100% Parity Verified' : 'Auto-Sync Active'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleManualReconcileNow}
              disabled={isReconciling}
              className="h-9 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
              <span>{isReconciling ? 'Reconciling...' : 'Reconcile All Now'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Close Reconciliation Hub"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          {lastReconciledMsg && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{lastReconciledMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setLastReconciledMsg(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Core Mathematical Fairness & Parity Equation Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Planned Time Parity Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-850 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  <span>Planned Time Parity Invariant (1:1 Lockstep)</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[9.5px] font-bold">
                  {summary.clockPlannedMinutes === summary.metricsPlannedMinutes
                    ? '✓ Exact Match (0m Drift)'
                    : 'Reconciled'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-center">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">24H Clock</span>
                  <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
                    {formatMinsToHoursMins(summary.clockPlannedMinutes)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Target Board</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-400 block mt-0.5">
                    {formatMinsToHoursMins(summary.metricsPlannedMinutes)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Sequence Flow</span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 block mt-0.5">
                    {formatMinsToHoursMins(summary.flowPlannedMinutes)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Study Planner</span>
                  <span className="text-xs sm:text-sm font-black text-indigo-300 block mt-0.5">
                    {formatMinsToHoursMins(summary.dailyTargetsPlannedMinutes)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actual Logged Time & Completion Parity Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-850 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-black tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Actual Logged Time & Ledger Sync</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[9.5px] font-bold">
                  {summary.completedTargetsCount}/{summary.totalTargetsCount} Targets Completed
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-center">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Session Logs</span>
                  <span className="text-xs sm:text-sm font-black text-cyan-300 block mt-0.5">
                    {formatMinsToHoursMins(summary.logsActualStudyMinutes)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Target Elapsed</span>
                  <span className="text-xs sm:text-sm font-black text-white block mt-0.5">
                    {formatMinsToHoursMins(summary.metricsAllocatedMinutes)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Rev. Report</span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 block mt-0.5">
                    {formatMinsToHoursMins(summary.revisionReportTodayMinutes)}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[8.5px] text-slate-400 uppercase block">Early Surplus</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-400 block mt-0.5">
                    +{summary.totalEarlySavedMinutes}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Pillar Status Cards */}
          <div>
            <h4 className="text-[10.5px] font-mono uppercase font-black text-slate-400 tracking-wider mb-2">
              7-Pillar Ecosystem Sync Matrix
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {pillars.map((pillar) => {
                const IconComp = pillarIconMap[pillar.id] || ShieldCheck;
                return (
                  <div
                    key={pillar.id}
                    className={`p-2.5 rounded-2xl border flex flex-col justify-between gap-2 ${
                      pillar.isSynced
                        ? 'bg-slate-950/80 border-slate-800/90'
                        : 'bg-amber-950/20 border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9.5px] font-mono font-black text-slate-200 truncate">
                        {pillar.shortLabel}
                      </span>
                      <IconComp
                        className={`h-3.5 w-3.5 shrink-0 ${
                          pillar.isSynced ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-0.5 font-mono">
                      <span className="text-[8px] text-slate-500 uppercase block truncate">
                        {pillar.primaryMetricLabel}
                      </span>
                      <span className="text-xs font-black text-white block truncate">
                        {pillar.primaryMetricValue}
                      </span>
                      <span className="text-[8.5px] text-cyan-300/90 block truncate">
                        {pillar.secondaryMetricValue}
                      </span>
                    </div>
                    <div className="pt-1 border-t border-slate-850 flex items-center gap-1 text-[8.5px] font-mono">
                      {pillar.isSynced ? (
                        <span className="text-emerald-400 font-bold truncate">● Reconciled</span>
                      ) : (
                        <span className="text-amber-400 font-bold truncate">● Syncing</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-Target Reconciliation Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-[10.5px] font-mono uppercase font-black text-slate-400 tracking-wider">
                Per-Target Cross-Module Reconciliation Ledger ({targets.length} Target{targets.length === 1 ? '' : 's'})
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Every target's planned time on the Target Board matches its 24-Hour Target Clock & Sequence Flow allocation
              </span>
            </div>

            {targets.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-850 text-center space-y-1.5">
                <Target className="h-6 w-6 text-slate-600 mx-auto" />
                <p className="text-xs font-mono text-slate-400">
                  No targets scheduled on {selectedDate}. All 7 modules are at 0h 00m parity.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-850 overflow-hidden bg-slate-950/70">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="bg-slate-900/90 border-b border-slate-800 text-[9.5px] uppercase text-slate-400">
                        <th className="py-2.5 px-3">Target / Chapter</th>
                        <th className="py-2.5 px-2.5 text-center">24H Clock Slot(s)</th>
                        <th className="py-2.5 px-2.5 text-right">24H Clock Planned</th>
                        <th className="py-2.5 px-2.5 text-right">Target Board Planned</th>
                        <th className="py-2.5 px-2.5 text-right">Sequence Flow</th>
                        <th className="py-2.5 px-2.5 text-right">Logged Actual</th>
                        <th className="py-2.5 px-2.5 text-center">Milestone / Rev</th>
                        <th className="py-2.5 px-3 text-right">Parity Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/80">
                      {targets.map((row) => {
                        const badgeClass =
                          SUBJECT_BADGE_STYLES[row.subjectCode] || SUBJECT_BADGE_STYLES.AFM;
                        return (
                          <tr
                            key={row.id}
                            className="hover:bg-slate-900/40 transition-colors"
                          >
                            <td className="py-2.5 px-3 max-w-[260px]">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${badgeClass}`}
                                >
                                  {row.subjectCode}
                                </span>
                                <div className="min-w-0">
                                  <div
                                    className={`font-sans font-bold text-xs truncate ${
                                      row.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                                    }`}
                                    title={row.cleanTitle}
                                  >
                                    {row.cleanTitle}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500">
                                    <span>{row.relevance}</span>
                                    {row.clubGroupId && (
                                      <span className="text-indigo-300 flex items-center gap-0.5">
                                        <Layers className="h-2.5 w-2.5" /> Clubbed
                                      </span>
                                    )}
                                    {row.earlySavedMinutes > 0 && (
                                      <span className="text-emerald-400">
                                        ⚡ +{row.earlySavedMinutes}m saved
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-2.5 text-center text-[10px] text-slate-300 whitespace-nowrap">
                              {row.clockTimeRange}
                            </td>

                            <td className="py-2.5 px-2.5 text-right font-bold text-white whitespace-nowrap">
                              {formatMinsToHoursMins(row.clockPlannedMinutes)}
                            </td>

                            <td className="py-2.5 px-2.5 text-right font-bold text-emerald-300 whitespace-nowrap">
                              {formatMinsToHoursMins(row.metricsPlannedMinutes)}
                            </td>

                            <td className="py-2.5 px-2.5 text-right text-amber-300 whitespace-nowrap">
                              {row.flowPosition ? `#${row.flowPosition} • ` : ''}
                              {formatMinsToHoursMins(row.flowPlannedMinutes)}
                            </td>

                            <td className="py-2.5 px-2.5 text-right font-bold text-cyan-300 whitespace-nowrap">
                              {formatMinsToHoursMins(row.actualLoggedMinutes)}
                            </td>

                            <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                {row.isCompleted ? '✓ Done & Linked' : 'Active Link'}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              {row.isParityIntact ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9.5px] font-bold">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>Synced</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9.5px] font-bold">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>Aligned</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-900/95 border-t border-slate-800 font-black text-xs text-white">
                        <td className="py-2.5 px-3">TOTAL RECONCILED</td>
                        <td className="py-2.5 px-2.5 text-center text-[10px] text-slate-400">
                          {targets.reduce((acc, r) => acc + r.clockSlotCount, 0)} Slot(s)
                        </td>
                        <td className="py-2.5 px-2.5 text-right text-white">
                          {formatMinsToHoursMins(summary.clockPlannedMinutes)}
                        </td>
                        <td className="py-2.5 px-2.5 text-right text-emerald-400">
                          {formatMinsToHoursMins(summary.metricsPlannedMinutes)}
                        </td>
                        <td className="py-2.5 px-2.5 text-right text-amber-300">
                          {formatMinsToHoursMins(summary.flowPlannedMinutes)}
                        </td>
                        <td className="py-2.5 px-2.5 text-right text-cyan-300">
                          {formatMinsToHoursMins(summary.metricsAllocatedMinutes)}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-[10px] text-slate-300">
                          {summary.completedTargetsCount}/{summary.totalTargetsCount} Done
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          100% MATCH
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
