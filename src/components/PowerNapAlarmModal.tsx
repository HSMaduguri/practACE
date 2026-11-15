import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, Sun, RotateCcw, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface PowerNapAlarmModalProps {
  isOpen: boolean;
  powerNapTargetMins: number;
  onWakeUpAndLog: (feeling?: string) => void;
  onSnooze: (snoozeMins?: number) => void;
}

export const PowerNapAlarmModal: React.FC<PowerNapAlarmModalProps> = ({
  isOpen,
  powerNapTargetMins,
  onWakeUpAndLog,
  onSnooze
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Refreshed & Energized');

  if (!isOpen) return null;

  const feelings = [
    'Refreshed & Energized',
    'Clear Mind & Alert',
    'Rested, ready to study',
    'Slightly groggy',
    'Quick power nap'
  ];

  const handleQuickWakeUp = (feelingText?: string) => {
    onWakeUpAndLog(feelingText || selectedFeeling || 'Refreshed & Energized');
  };

  return (
    <ModalPortal priorityOffset={5000}>
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100000] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: [0.95, 1.02, 1], opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="bg-gradient-to-br from-[#0e1222] via-[#090c18] to-[#13102b] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_90px_rgba(245,158,11,0.4)] text-center relative overflow-hidden space-y-6"
        >
          {/* Animated Alarm Ring Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Alarm Icon Header */}
          <div className="space-y-3 relative z-10">
            <motion.div
              animate={{ rotate: [-12, 12, -12, 12, 0], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20"
            >
              <BellRing className="h-9 w-9 fill-amber-400" />
            </motion.div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 animate-bounce" />
                POWER NAP ALARM RINGING
              </span>
              <h2 className="text-2xl font-black text-white font-mono tracking-tight pt-1">
                ⏰ WAKE UP & RECHARGE!
              </h2>
              <p className="text-xs font-semibold text-slate-300">
                Your <span className="text-amber-400 font-bold">{powerNapTargetMins}-minute</span> power nap is complete.
              </p>
            </div>
          </div>

          {/* 1-Step Wake Up Button */}
          <div className="space-y-2.5 relative z-10">
            <button
              onClick={() => handleQuickWakeUp()}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-2xl text-sm font-black uppercase tracking-wider transition duration-200 shadow-xl shadow-amber-500/30 cursor-pointer flex items-center justify-center gap-2.5 scale-[1.02] hover:scale-[1.04] active:scale-[0.98]"
            >
              <Sun className="h-5 w-5 fill-slate-950" />
              <span>🌅 WAKE UP NOW (Stop Alarm)</span>
            </button>

            <button
              onClick={() => onSnooze(5)}
              className="w-full py-2.5 bg-slate-900/90 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
              <span>Snooze Alarm for 5 Minutes</span>
            </button>
          </div>

          {/* Optional Instant Sentiment Selection (Each pill triggers 1-step wake up with tag) */}
          <div className="space-y-2 text-left bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850 relative z-10">
            <label className="text-[9.5px] text-slate-400 font-mono font-black uppercase tracking-wider block">
              Or tap feeling for 1-click log & wake up:
            </label>

            <div className="flex flex-wrap gap-1.5">
              {feelings.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleQuickWakeUp(f)}
                  className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-800 transition cursor-pointer"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
    </ModalPortal>
  );
};
