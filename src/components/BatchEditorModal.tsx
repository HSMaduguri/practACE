import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Clock, X, Plus, Minus, ChevronUp, ChevronDown, Trash2, Zap, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { ModalPortal } from './ModalPortal';
import { formatMinutes } from '../utils/timeFormat';
import { SUBJECT_COLORS, SubjectId } from '../types';

export interface BatchEditorItem {
  id: string; // taskId or chapter configKey
  title: string;
  chapterName?: string;
  subjectCode: string;
  relevance?: string;
  allocatedMinutes: number;
  isCompleted?: boolean;
}

export interface BatchEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: number;
  clubGroupId: string;
  subjectCode: string;
  totalMinutes: number;
  items: BatchEditorItem[];
  availableChaptersToAdd?: { id: string; title: string; chapterName?: string; subjectCode: string }[];
  onUpdateTotalMinutes: (newTotal: number) => void;
  onUpdateItemMinutes: (itemId: string, newMins: number) => void;
  onResetEqualSplit?: () => void;
  onRemoveItemFromBatch?: (itemId: string) => void;
  onAddItemToBatch?: (item: { id: string; title: string; chapterName?: string; subjectCode: string }) => void;
  onUnbatchAll?: () => void;
  onStartBatchFlow?: () => void;
}

export const BatchNumberInput: React.FC<{
  value: number;
  min: number;
  max: number;
  step?: number;
  className?: string;
  title?: string;
  onChange: (val: number) => void;
}> = ({ value, min, max, step = 1, className, title, onChange }) => {
  const [localText, setLocalText] = React.useState(String(value));

  React.useEffect(() => {
    setLocalText(String(value));
  }, [value]);

  const commit = (txt: string) => {
    const val = parseInt(txt, 10);
    if (!isNaN(val) && val >= min) {
      const clamped = Math.max(min, Math.min(max, val));
      onChange(clamped);
      setLocalText(String(clamped));
    } else {
      setLocalText(String(value));
    }
  };

  return (
    <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={value <= min}
        onClick={() => {
          const next = Math.max(min, value - step);
          onChange(next);
          setLocalText(String(next));
        }}
        className="w-5 h-5 rounded-lg bg-slate-950/90 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:border-slate-900 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shrink-0"
        title={`Decrease by ${step}`}
      >
        <ChevronDown className="h-3 w-3 stroke-[2.5]" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={localText}
        onChange={(e) => {
          setLocalText(e.target.value);
          const parsed = parseInt(e.target.value, 10);
          if (!isNaN(parsed) && parsed >= min && parsed <= max) {
            onChange(parsed);
          }
        }}
        onBlur={() => commit(localText)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit(localText);
            e.currentTarget.blur();
          }
        }}
        className={className}
        title={title}
      />
      <button
        type="button"
        disabled={value >= max}
        onClick={() => {
          const next = Math.min(max, value + step);
          onChange(next);
          setLocalText(String(next));
        }}
        className="w-5 h-5 rounded-lg bg-slate-950/90 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:border-slate-900 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shrink-0"
        title={`Increase by ${step}`}
      >
        <ChevronUp className="h-3 w-3 stroke-[2.5]" />
      </button>
    </div>
  );
};

export interface InlineDurationFieldProps {
  valueMinutes: number;
  min?: number;
  max?: number;
  onCommit: (newMinutes: number) => void;
  className?: string;
  title?: string;
}

const parseFlexibleDurationMinutes = (raw: string, fallback: number): number => {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return fallback;

  // Match "1h 30m", "1h30", "2h", "45m"
  const hmMatch = trimmed.match(/^(?:(\d+(?:\.\d+)?)\s*h(?:ours?|rs?)?)?\s*(?:(\d+)\s*m(?:ins?|inutes?)?)?$/);
  if (hmMatch && (hmMatch[1] !== undefined || hmMatch[2] !== undefined)) {
    const h = hmMatch[1] ? parseFloat(hmMatch[1]) : 0;
    const m = hmMatch[2] ? parseInt(hmMatch[2], 10) : 0;
    const total = Math.round(h * 60 + m);
    if (!isNaN(total) && total > 0) return total;
  }

  // Match "1:30" (hours:minutes)
  const colonMatch = trimmed.match(/^(\d+):(\d{1,2})$/);
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10) || 0;
    const m = parseInt(colonMatch[2], 10) || 0;
    const total = h * 60 + m;
    if (total > 0) return total;
  }

  const numeric = parseInt(trimmed, 10);
  if (!isNaN(numeric) && numeric > 0) return numeric;
  return fallback;
};

export const formatHHMMDisplay = (totalMins: number): string => {
  const safe = Math.max(0, Math.round(Number(totalMins) || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
};

export const InlineDurationField: React.FC<InlineDurationFieldProps> = ({
  valueMinutes,
  min = 1,
  max = 1440,
  onCommit,
  className = 'h-7',
  title = 'Enter Hours (HH) and Minutes (MM)',
}) => {
  const safeTotal = Math.max(0, Math.round(Number(valueMinutes) || 0));
  const hoursVal = Math.floor(safeTotal / 60);
  const minsVal = safeTotal % 60;

  const [draftHours, setDraftHours] = React.useState<string>(String(hoursVal).padStart(2, '0'));
  const [draftMins, setDraftMins] = React.useState<string>(String(minsVal).padStart(2, '0'));
  const [focusedBlock, setFocusedBlock] = React.useState<'h' | 'm' | null>(null);

  React.useEffect(() => {
    if (!focusedBlock) {
      const h = Math.floor(Math.max(0, Math.round(Number(valueMinutes) || 0)) / 60);
      const m = Math.max(0, Math.round(Number(valueMinutes) || 0)) % 60;
      setDraftHours(String(h).padStart(2, '0'));
      setDraftMins(String(m).padStart(2, '0'));
    }
  }, [valueMinutes, focusedBlock]);

  const commitValues = (rawH: string, rawM: string) => {
    const parsedH = Math.max(0, Math.min(24, parseInt(rawH, 10) || 0));
    const parsedM = Math.max(0, Math.min(59, parseInt(rawM, 10) || 0));
    const total = parsedH * 60 + parsedM;
    const clamped = Math.max(min, Math.min(max, total >= min ? total : valueMinutes));
    const finalH = Math.floor(clamped / 60);
    const finalM = clamped % 60;
    setDraftHours(String(finalH).padStart(2, '0'));
    setDraftMins(String(finalM).padStart(2, '0'));
    if (clamped !== valueMinutes) {
      onCommit(clamped);
    }
  };

  const stepTotalMinutes = (deltaMins: number) => {
    const next = Math.max(min, Math.min(max, safeTotal + deltaMins));
    const finalH = Math.floor(next / 60);
    const finalM = next % 60;
    setDraftHours(String(finalH).padStart(2, '0'));
    setDraftMins(String(finalM).padStart(2, '0'));
    if (next !== valueMinutes) {
      onCommit(next);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`${className} inline-flex items-center gap-1 font-mono text-[10.5px] shrink-0`}
      title={title}
    >
      {/* Decrease 15m Stepper Button (1.5D Sprint Board Style) */}
      <button
        type="button"
        disabled={safeTotal <= min}
        onClick={() => stepTotalMinutes(-15)}
        className="w-5 h-5 rounded-lg bg-slate-950/90 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:border-slate-900 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shrink-0"
        title="Decrease by 15m"
      >
        <ChevronDown className="h-3 w-3 stroke-[2.5]" />
      </button>

      {/* Block 1: Hours (HH) */}
      <div className="h-full px-1.5 rounded-lg bg-slate-900/90 border border-slate-800 focus-within:border-amber-500/70 flex items-center justify-center gap-0.5 transition-all">
        <input
          type="text"
          inputMode="numeric"
          value={draftHours}
          onFocus={(e) => {
            setFocusedBlock('h');
            e.currentTarget.select();
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
            setDraftHours(digits);
          }}
          onBlur={() => {
            setFocusedBlock(null);
            commitValues(draftHours, draftMins);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              commitValues(draftHours, draftMins);
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setDraftHours(String(hoursVal).padStart(2, '0'));
              setDraftMins(String(minsVal).padStart(2, '0'));
              setFocusedBlock(null);
              e.currentTarget.blur();
            }
          }}
          className="w-5 bg-transparent text-center text-slate-100 focus:text-amber-300 font-bold text-[10.5px] focus:outline-none"
          aria-label="Hours"
        />
        <span className="text-[9px] text-slate-500 select-none">h</span>
      </div>

      {/* Block 2: Minutes (MM) */}
      <div className="h-full px-1.5 rounded-lg bg-slate-900/90 border border-slate-800 focus-within:border-amber-500/70 flex items-center justify-center gap-0.5 transition-all">
        <input
          type="text"
          inputMode="numeric"
          value={draftMins}
          onFocus={(e) => {
            setFocusedBlock('m');
            e.currentTarget.select();
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
            setDraftMins(digits);
          }}
          onBlur={() => {
            setFocusedBlock(null);
            commitValues(draftHours, draftMins);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              commitValues(draftHours, draftMins);
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setDraftHours(String(hoursVal).padStart(2, '0'));
              setDraftMins(String(minsVal).padStart(2, '0'));
              setFocusedBlock(null);
              e.currentTarget.blur();
            }
          }}
          className="w-5 bg-transparent text-center text-slate-100 focus:text-amber-300 font-bold text-[10.5px] focus:outline-none"
          aria-label="Minutes"
        />
        <span className="text-[9px] text-slate-500 select-none">m</span>
      </div>

      {/* Increase 15m Stepper Button (1.5D Sprint Board Style) */}
      <button
        type="button"
        disabled={safeTotal >= max}
        onClick={() => stepTotalMinutes(15)}
        className="w-5 h-5 rounded-lg bg-slate-950/90 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:border-slate-900 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer shrink-0"
        title="Increase by 15m"
      >
        <ChevronUp className="h-3 w-3 stroke-[2.5]" />
      </button>
    </div>
  );
};

export interface IndividualTaskTimeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  chapterName?: string;
  subjectCode: string;
  relevance?: string;
  currentMinutes: number;
  allocatedMinutes?: number;
  hasClockSlots?: boolean;
  clockSlotCount?: number;
  onSaveMinutes: (newMinutes: number) => void;
}

export const IndividualTaskTimeEditorModal: React.FC<IndividualTaskTimeEditorModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  chapterName,
  subjectCode,
  relevance,
  currentMinutes,
  allocatedMinutes = 0,
  hasClockSlots = false,
  clockSlotCount = 0,
  onSaveMinutes,
}) => {
  const [draftMinutes, setDraftMinutes] = React.useState<number>(Math.max(1, currentMinutes || 45));

  React.useEffect(() => {
    if (isOpen) {
      setDraftMinutes(Math.max(1, currentMinutes || 45));
    }
  }, [isOpen, currentMinutes]);

  if (!isOpen) return null;

  const subColors = (SUBJECT_COLORS as any)[subjectCode as SubjectId] || {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  };

  const hoursPart = Math.floor(draftMinutes / 60);
  const minsPart = draftMinutes % 60;

  const setClampedMinutes = (nextVal: number) => {
    setDraftMinutes(Math.max(1, Math.min(1440, Math.round(nextVal || 1))));
  };

  return (
    <ModalPortal priorityOffset={160}>
      <div
        className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 6 }}
          transition={{ duration: 0.14 }}
          className="relative w-full max-w-md bg-[#0c0f1c] border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-mono flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Simple Header */}
          <div className="px-4 py-3 border-b border-slate-850 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${subColors.bg} ${subColors.text} ${subColors.border}`}>
                {subjectCode}
              </span>
              <span className="text-xs font-bold text-white truncate font-sans">
                {taskTitle}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Simple Body: 2 Blocks (Hours & Minutes) displaying in HH MM */}
          <div className="p-4 space-y-3.5 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Planned Time</span>
              <span className="text-sm font-bold text-white font-mono">
                {formatHHMMDisplay(draftMinutes)}
              </span>
            </div>

            {/* 2 Blocks: Hours (HH) & Minutes (MM) with 1.5D Sprint Board Steppers */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-950 border border-slate-800 focus-within:border-amber-500/60 rounded-xl px-2.5 py-2 flex items-center justify-between gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Hours</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={hoursPart <= 0}
                    onClick={() => setClampedMinutes(Math.max(0, hoursPart - 1) * 60 + minsPart)}
                    className="w-5 h-5 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                    title="Decrease Hours"
                  >
                    <ChevronDown className="h-3 w-3 stroke-[2.5]" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={String(hoursPart).padStart(2, '0')}
                    onChange={(e) => {
                      const h = Math.max(0, Math.min(24, parseInt(e.target.value, 10) || 0));
                      setClampedMinutes(h * 60 + minsPart);
                    }}
                    className="w-8 bg-transparent text-center text-white font-bold text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={hoursPart >= 24}
                    onClick={() => setClampedMinutes(Math.min(24, hoursPart + 1) * 60 + minsPart)}
                    className="w-5 h-5 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                    title="Increase Hours"
                  >
                    <ChevronUp className="h-3 w-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 focus-within:border-amber-500/60 rounded-xl px-2.5 py-2 flex items-center justify-between gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Mins</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={draftMinutes <= 5}
                    onClick={() => setClampedMinutes(draftMinutes - 5)}
                    className="w-5 h-5 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                    title="Decrease by 5m"
                  >
                    <ChevronDown className="h-3 w-3 stroke-[2.5]" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    step={1}
                    value={String(minsPart).padStart(2, '0')}
                    onChange={(e) => {
                      const m = Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0));
                      setClampedMinutes(hoursPart * 60 + m);
                    }}
                    className="w-8 bg-transparent text-center text-white font-bold text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={draftMinutes >= 1440}
                    onClick={() => setClampedMinutes(draftMinutes + 5)}
                    className="w-5 h-5 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/45 text-amber-300 hover:text-amber-200 disabled:text-slate-700 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                    title="Increase by 5m"
                  >
                    <ChevronUp className="h-3 w-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1">
              <span>Elapsed: {formatHHMMDisplay(allocatedMinutes)}</span>
              {hasClockSlots && (
                <span>{clockSlotCount} clock slot{clockSlotCount === 1 ? '' : 's'} synced</span>
              )}
            </div>
          </div>

          {/* Simple Footer */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-850 flex items-center justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveMinutes(draftMinutes);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>
    </ModalPortal>
  );
};

export const BatchEditorModal: React.FC<BatchEditorModalProps> = ({
  isOpen,
  onClose,
  batchNumber,
  clubGroupId,
  subjectCode,
  totalMinutes,
  items,
  availableChaptersToAdd = [],
  onUpdateTotalMinutes,
  onUpdateItemMinutes,
  onResetEqualSplit,
  onRemoveItemFromBatch,
  onAddItemToBatch,
  onUnbatchAll,
  onStartBatchFlow,
}) => {
  const [selectedAddKey, setSelectedAddKey] = useState<string>('');

  if (!isOpen) return null;

  const subColors = (SUBJECT_COLORS as any)[subjectCode as SubjectId] || {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  };

  const calculatedSum = items.reduce((acc, it) => acc + (Number(it.allocatedMinutes) || 0), 0);
  const isSumMatching = calculatedSum === totalMinutes;

  return (
    <ModalPortal priorityOffset={150}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.16 }}
          className="relative w-full max-w-xl bg-slate-900 border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border-b border-cyan-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Layers className="h-4 w-4" />
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 text-xs font-black uppercase tracking-wider">
                Batch {batchNumber}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${subColors.bg} ${subColors.text} ${subColors.border}`}>
                {subjectCode}
              </span>
              <span className="text-xs font-bold text-slate-300">
                {items.length} {items.length === 1 ? 'Target' : 'Targets'}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Close Batch Editor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* 1. Total Batch Time Frame Editor */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/35 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="font-black text-amber-300 uppercase tracking-wide">
                    Total Batch Time Frame
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Current: <strong className="text-amber-300">{formatHHMMDisplay(totalMinutes)}</strong>
                  </span>
                  <InlineDurationField
                    valueMinutes={totalMinutes}
                    min={Math.max(1, items.length)}
                    max={1440}
                    onCommit={(val) => onUpdateTotalMinutes(val)}
                    className="h-7"
                    title="Enter Batch Total Hours (HH) and Minutes (MM)"
                  />
                </div>
              </div>
            </div>

            {/* 2. Individual Sub-Target Allocations inside the Batch */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-200">
                  Sub-Target Planned Time Allocations (Adjust Any Target &amp; The Rest Balance Automatically):
                </span>
                {onResetEqualSplit && (
                  <button
                    type="button"
                    onClick={onResetEqualSplit}
                    className="text-[10px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
                    title="Reset all targets in this batch to equal / proportionate share"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Split</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => {
                  const sharePct = totalMinutes > 0 ? Math.round((item.allocatedMinutes / totalMinutes) * 100) : 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      {/* Left Side: Order # + Title + Share info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-white truncate max-w-sm" title={item.title}>
                            {item.title}
                          </span>
                          {item.relevance && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                              {item.relevance === 'Final Revision' ? 'F' : item.relevance === 'General' ? 'G' : 'R'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>
                            Allocated: <strong className="text-amber-300">{formatHHMMDisplay(item.allocatedMinutes)}</strong>
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-cyan-400 font-bold">{sharePct}% of batch</span>
                        </div>
                      </div>

                      {/* Right Side: 2-Block HH MM Input + Remove */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <InlineDurationField
                          valueMinutes={item.allocatedMinutes}
                          min={1}
                          max={Math.max(1, totalMinutes - Math.max(0, items.length - 1))}
                          onCommit={(val) => onUpdateItemMinutes(item.id, val)}
                          className="h-7"
                          title="Enter Sub-Target Hours (HH) and Minutes (MM)"
                        />

                        {onRemoveItemFromBatch && items.length > 2 && (
                          <button
                            type="button"
                            onClick={() => onRemoveItemFromBatch(item.id)}
                            className="p-1 rounded bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-300 border border-slate-800 transition cursor-pointer"
                            title="Remove this chapter from the batch"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Add Another Chapter to this Batch */}
            {onAddItemToBatch && availableChaptersToAdd.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block">
                  Add Another Chapter to Batch {batchNumber}:
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedAddKey}
                    onChange={(e) => setSelectedAddKey(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="">Select chapter to add...</option>
                    {availableChaptersToAdd.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        [{ch.subjectCode}] {ch.chapterName || ch.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedAddKey}
                    onClick={() => {
                      const found = availableChaptersToAdd.find((c) => c.id === selectedAddKey);
                      if (found) {
                        onAddItemToBatch(found);
                        setSelectedAddKey('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {onUnbatchAll && (
                <button
                  type="button"
                  onClick={() => {
                    onUnbatchAll();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/35 font-bold transition cursor-pointer"
                  title="Dissolve this batch back into individual standalone targets"
                >
                  Unbatch All
                </button>
              )}
              {onStartBatchFlow && (
                <button
                  type="button"
                  onClick={() => {
                    onStartBatchFlow();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Start Batch Target Flow on the Focus Timer"
                >
                  <Zap className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Start Batch Flow</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </ModalPortal>
  );
};
