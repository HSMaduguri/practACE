import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Zap, Volume2, X, Clock, Sparkles, BellRing, Play } from 'lucide-react';
import { testPowerNapAlarmSound } from '../utils/audioAlarm';
import { ModalPortal } from './ModalPortal';

interface RestSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFullSleep: () => void;
  onStartPowerNap: (durationMins: number) => void;
  onTestAlarm?: () => void;
}

export const RestSelectionModal: React.FC<RestSelectionModalProps> = ({
  isOpen,
  onClose,
  onStartFullSleep,
  onStartPowerNap,
  onTestAlarm
}) => {
  const [selectedNapMins, setSelectedNapMins] = useState<number>(20);
  const [customMinsInput, setCustomMinsInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'power_nap' | 'full_sleep'>('power_nap');
  const [isTestingAudio, setIsTestingAudio] = useState<boolean>(false);

  if (!isOpen) return null;

  const napPresets = [5, 10, 15, 20, 25, 30];

  const handleTestAudio = () => {
    setIsTestingAudio(true);
    if (onTestAlarm) {
      onTestAlarm();
    } else {
      testPowerNapAlarmSound();
    }
    setTimeout(() => setIsTestingAudio(false), 2200);
  };

  const handleConfirmPowerNap = () => {
    let finalMins = selectedNapMins;
    if (customMinsInput) {
      const parsed = parseInt(customMinsInput, 10);
      if (!isNaN(parsed) && parsed > 0) {
        finalMins = Math.min(30, Math.max(1, parsed));
      }
    } else {
      finalMins = Math.min(30, Math.max(1, selectedNapMins));
    }
    onStartPowerNap(finalMins);
  };

  return (
    <ModalPortal>
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          className="bg-[#0b0e1a] border border-indigo-500/30 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-[0_0_60px_rgba(99,102,241,0.2)] text-left relative overflow-hidden space-y-6"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-2xl">
                <Moon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-mono tracking-wide uppercase">
                  Select Rest Channel
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition border border-slate-800 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Toggle Tab Row */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
            <button
              onClick={() => setActiveTab('power_nap')}
              className={`py-2.5 px-3 rounded-xl text-xs font-black font-mono tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'power_nap'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>Power Nap (Alarm)</span>
            </button>

            <button
              onClick={() => setActiveTab('full_sleep')}
              className={`py-2.5 px-3 rounded-xl text-xs font-black font-mono tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'full_sleep'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="h-4 w-4 fill-current" />
              <span>Full Night Sleep</span>
            </button>
          </div>

          {/* Tab 1: Power Nap Mode */}
          {activeTab === 'power_nap' && (
            <div className="space-y-5 animate-fadeIn">

              {/* Timer Duration Presets */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-wider block">
                  Select Power Nap Duration (Max 30 Mins):
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {napPresets.map((mins) => {
                    const isSelected = selectedNapMins === mins && !customMinsInput;
                    return (
                      <button
                        key={mins}
                        onClick={() => {
                          setSelectedNapMins(mins);
                          setCustomMinsInput('');
                        }}
                        className={`py-2 rounded-xl text-xs font-black font-mono transition border cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/15 scale-[1.03]'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {mins}m
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Duration Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                  Or Manual Duration (1–30 Minutes):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    placeholder="E.g. 20 (Max 30)"
                    value={customMinsInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomMinsInput(val);
                      if (val) {
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed)) {
                          const capped = Math.min(30, Math.max(1, parsed));
                          setSelectedNapMins(capped);
                        }
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleTestAudio}
                    className={`px-3 py-2 rounded-xl text-[10.5px] font-mono font-extrabold border transition cursor-pointer flex items-center gap-1.5 ${
                      isTestingAudio
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                    title="Test wake-up alarm sound"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>{isTestingAudio ? 'Ringing...' : 'Test Sound'}</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleConfirmPowerNap}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider transition duration-200 shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <BellRing className="h-4 w-4 fill-slate-950" />
                <span>Start {customMinsInput || selectedNapMins}-Min Power Nap</span>
              </button>
            </div>
          )}

          {/* Tab 2: Full Sleep Mode */}
          {activeTab === 'full_sleep' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850">
                <p className="text-[10.5px] text-slate-400 font-mono font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  Recommended Sleep Target: 7 to 8 Hours
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={onStartFullSleep}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition duration-200 shadow-lg shadow-indigo-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Moon className="h-4 w-4 fill-white" />
                <span>Enter Full Night Sleep Mode</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
    </ModalPortal>
  );
};
