/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BellRing, Clock, Play, AlarmClock, X, Lock } from 'lucide-react';
import { ScheduledPracticeSessionRecord } from '../types';
import {
  SNOOZE_INTERVAL_OPTIONS_MINUTES,
  formatDurationMMSS
} from '../utils/scheduledPracticeWorkflow';
import { ModalPortal } from './ModalPortal';

interface TimedPracticeNotificationModalProps {
  session: ScheduledPracticeSessionRecord;
  defaultSnoozeMinutes?: number;
  isSnoozeResume?: boolean;
  onStartTimedPractice: () => void;
  onSnooze: (minutes: number) => void;
  onDismiss: () => void;
}

export default function TimedPracticeNotificationModal({
  session,
  defaultSnoozeMinutes = 15,
  isSnoozeResume = false,
  onStartTimedPractice,
  onSnooze,
  onDismiss
}: TimedPracticeNotificationModalProps) {
  const [selectedSnoozeMins, setSelectedSnoozeMins] = useState<number>(defaultSnoozeMinutes || 15);

  const slotLabel =
    session.slotId === 'slot_1'
      ? `Slot 1 (${session.preferredTime})`
      : session.slotId === 'slot_2'
      ? `Slot 2 (${session.preferredTime})`
      : `Scheduled (${session.preferredTime})`;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[235] flex items-center justify-center p-3 sm:p-5">
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onDismiss}
        />

        <div className="relative z-10 w-full max-w-md bg-[#0b1120] border border-amber-400/50 rounded-2xl shadow-2xl overflow-hidden text-left">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400" />

          {/* Header */}
          <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 shrink-0">
                <BellRing className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                    {isSnoozeResume ? 'Snoozed Reminder' : 'Timed Practice'}
                  </span>
                  <span className="text-slate-400">{slotLabel}</span>
                </div>
                <h3 className="text-base font-black text-white leading-tight">
                  Ready for Timed Practice?
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body (Concept Tested Kept Secret) */}
          <div className="p-5 space-y-4">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold">
                  {session.question.subjectId}
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {session.question.marks}M · {formatDurationMMSS(session.allocatedSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 leading-relaxed pt-1">
                <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>
                  Chapter & concept tested are kept confidential until you reveal the suggested answer.
                </span>
              </div>
            </div>

            {/* Snooze Interval Picker */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5">
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <AlarmClock className="h-3.5 w-3.5 text-amber-400" />
                Snooze For
              </span>
              <div className="flex items-center gap-1">
                {SNOOZE_INTERVAL_OPTIONS_MINUTES.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedSnoozeMins(mins)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition cursor-pointer ${
                      selectedSnoozeMins === mins
                        ? 'bg-amber-500 text-slate-950 font-extrabold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Actions: Start Timed Practice / Snooze */}
          <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onSnooze(selectedSnoozeMins)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
            >
              <AlarmClock className="h-4 w-4 text-amber-400" />
              Snooze ({selectedSnoozeMins}m)
            </button>

            <button
              type="button"
              onClick={onStartTimedPractice}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="h-4 w-4" />
              Start Timed Practice
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
