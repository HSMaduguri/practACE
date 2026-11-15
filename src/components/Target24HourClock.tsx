import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Plus, Trash2, Edit3, 
  X, Maximize2,
  AlertTriangle, Layers,
  BarChart3,
  GitCompare, Activity, Zap, Check,
  ArrowUp, ArrowDown, ArrowUpDown, GripVertical, ListOrdered, Play
} from 'lucide-react';
import { SubjectId, FlowTargetItem } from '../types';
import { 
  getCompletedTaskKeysSet, 
  isTaskCompletedInStorage, 
  syncTaskCompletionAcrossAllLinks, 
  normalizeKey,
  useTargetSystemSync,
  isMockTestTask,
  reconcileTargetMetricsAndClockForDate,
  repackPendingClockSlotsIntoFreedTime,
  getProspectiveRestrictionMark,
  ensureProspectiveSchedule,
  smartSplitSlotAroundBlockades,
  applySmartSlotSplitter
} from '../utils/taskCompletionSync';
import { auth, db } from '../lib/firebase';
import { doc as firestoreDoc, setDoc } from 'firebase/firestore';
import { SUBJECT_CHAPTERS, getCanonicalChapterKey } from './RevisionPlanner';
import { ModalPortal } from './ModalPortal';
import { AttractiveTimePicker } from './AttractiveDateTimePickers';
import { formatStaticDuration } from '../utils/timeFormat';
import {
  analyzeUserSleepPattern,
  analyzeUserDayRationale,
  buildProtectedBlockedIntervals,
  findRealisticGapOnClock,
  fitOrderedItemsToRationaleTimeline,
  minutesToAmPmStr
} from '../utils/sleepPatternAnalysis';
import { useCALevel, getLevelSubjectIds } from '../data/curriculumLevels';
import {
  getLevelScopedKey,
  getClockSlotsStorageKey,
  getFirestoreTasksCollectionName
} from '../utils/levelStorage';

export interface TargetClockSlot {
  id: string;
  targetId: string;
  title: string;
  chapterName?: string;
  subjectCode: SubjectId;
  relevance: 'General' | 'Revision' | 'Final Revision';
  isMockTest?: boolean;
  mockScheduledTime?: string;
  mockSeries?: string;
  startTime: string; // "12:00"
  endTime: string;   // "14:00"
  startMinutes: number; // 0 - 1440
  endMinutes: number;   // 0 - 1440
  durationMinutes: number;
  totalTargetMinutes?: number;
  slotNumber?: number;
  totalSlots?: number;
  status: 'pending' | 'active' | 'completed';
  originalStartMinutes?: number;
  originalEndMinutes?: number;
  originalDurationMinutes?: number;
  originalStartTime?: string;
  originalEndTime?: string;
  earlySavedMinutes?: number;
}

export interface BalanceClockSegment {
  key: string;
  startMins: number;
  length: number;
  color: string;
  type: string;
  displayRange: string;
}

export interface BalanceClockSummary {
  study: number;
  break: number;
  routine: number;
  sleep: number;
  idle: number;
  totalElapsedMins: number;
}

export interface BalanceClockData {
  clockSegments: BalanceClockSegment[];
  dayMinutesSummary: BalanceClockSummary;
  totalStudyMinutes: number;
  displayTime?: Date;
  sessionLogs?: any[];
  onOpenSessionHistory?: () => void;
  onOpenLogModal?: () => void;
  onOpenLogMockTestModal?: () => void;
}

export interface Target24HourClockProps {
  selectedDate: string; // YYYY-MM-DD
  availableTasks: any[]; // dateTasks
  flowTargets: FlowTargetItem[];
  onUpdateFlow: (newFlow: FlowTargetItem[], startImmediately?: boolean) => void;
  onStartFocusForTask?: (
    subjectCode: string, 
    title: string, 
    durationMinutes?: number, 
    chapterName?: string, 
    relevance?: 'General' | 'Revision' | 'Final Revision', 
    dueDate?: string, 
    revKey?: 'rev1' | 'rev2' | 'rev3' | 'rev1.5'
  ) => void;
  onUpdateTaskTargetDuration?: (taskKey: string, minutes: number, silent?: boolean) => void;
  activeMode?: string;
  activeFocusTask?: { title: string; subjectCode?: string; chapterName?: string } | null;
  onToggleTaskStatus?: (taskId: string, forceExecute?: boolean) => void;
  balanceData?: BalanceClockData;
  defaultExpanded?: boolean;
  defaultExpandedTab?: 'compare' | 'plan' | 'actuals';
  onClose?: () => void;
}

const SUBJECT_COLORS: Record<SubjectId, { bg: string; text: string; border: string; hex: string; altHex: string }> = {
  // Foundation
  Accounts: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', hex: '#2563eb', altHex: '#60a5fa' },
  Law: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', hex: '#9333ea', altHex: '#c084fc' },
  MathStats: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  Econ: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', hex: '#f59e0b', altHex: '#fbbf24' },
  // Intermediate
  AdvAcc: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', hex: '#2563eb', altHex: '#60a5fa' },
  CorpLaw: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/40', hex: '#4f46e5', altHex: '#818cf8' },
  Tax: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', hex: '#f59e0b', altHex: '#fbbf24' },
  Cost: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  AuditInter: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', hex: '#9333ea', altHex: '#c084fc' },
  FMSM: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40', hex: '#f43f5e', altHex: '#fb7185' },
  // Final
  AFM: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  FR: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', hex: '#2563eb', altHex: '#60a5fa' },
  Audit: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', hex: '#9333ea', altHex: '#c084fc' },
  DT: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', hex: '#f59e0b', altHex: '#fbbf24' },
  IDT: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/40', hex: '#06b6d4', altHex: '#22d3ee' },
  IBS: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40', hex: '#f43f5e', altHex: '#fb7185' },
  // CMA Foundation
  CMAFoundLaw: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', hex: '#9333ea', altHex: '#c084fc' },
  CMAFoundAcc: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', hex: '#2563eb', altHex: '#60a5fa' },
  CMAFoundMath: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', hex: '#f59e0b', altHex: '#fbbf24' },
  CMAFoundEcon: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  // CMA Intermediate
  CMAInterLaw: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/40', hex: '#4f46e5', altHex: '#818cf8' },
  CMAInterFA: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', hex: '#2563eb', altHex: '#60a5fa' },
  CMAInterTax: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', hex: '#f59e0b', altHex: '#fbbf24' },
  CMAInterCost: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  CMAInterOMSM: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40', hex: '#f43f5e', altHex: '#fb7185' },
  CMAInterCAA: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', hex: '#9333ea', altHex: '#c084fc' },
  CMAInterFMDA: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/40', hex: '#06b6d4', altHex: '#22d3ee' },
  CMAInterMA: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  // CMA Final
  CMAFinalLaw: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/40', hex: '#4f46e5', altHex: '#818cf8' },
  CMAFinalSFM: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', hex: '#2563eb', altHex: '#60a5fa' },
  CMAFinalDT: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', hex: '#f59e0b', altHex: '#fbbf24' },
  CMAFinalSCM: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' },
  CMAFinalCMA: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', hex: '#9333ea', altHex: '#c084fc' },
  CMAFinalCFR: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/40', hex: '#06b6d4', altHex: '#22d3ee' },
  CMAFinalIDT: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40', hex: '#f43f5e', altHex: '#fb7185' },
  CMAFinalSPBV: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', hex: '#10b981', altHex: '#34d399' }
};

export const formatClockTime = (minutes: number) => {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  return Math.min(1440, Math.max(0, h * 60 + m));
};

export const minutesToTimeStr = (mins: number): string => {
  const norm = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Check if two time ranges overlap
export const checkSlotOverlap = (
  s1: { startMinutes: number; endMinutes: number },
  s2: { startMinutes: number; endMinutes: number }
): boolean => {
  return Math.max(s1.startMinutes, s2.startMinutes) < Math.min(s1.endMinutes, s2.endMinutes);
};

// Find earliest available non-overlapping gap of durationMinutes respecting Sleep, Breakfast, Lunch, Dinner & Routine windows
export const findNextAvailableGap = (
  existingSlots: TargetClockSlot[],
  durationMinutes: number,
  preferStartMinutes: number = 540, // 09:00 AM default
  minAllowedStartMinutes: number = 0,
  targetDateStr?: string
): { startMinutes: number; endMinutes: number } => {
  return findRealisticGapOnClock(
    existingSlots,
    durationMinutes,
    preferStartMinutes,
    minAllowedStartMinutes,
    targetDateStr
  );
};

// Cascade / Ripple adjust slots forward:
// - When prioritySlotId is provided (user manual edit/shift): locks prioritySlotId at user's chosen 24h time (even if completed or in the past),
//   freezes other completed/past slots, and prospectively cascades + smart-splits remaining tasks around routine blockades.
// - When prioritySlotId is omitted (system auto-cascade): freezes completed and past/running slots and prospectively cascades from current time.
export function cascadeSlotsNoOverlap(
  allSlots: TargetClockSlot[],
  prioritySlotId?: string,
  targetDateStr?: string
): { slots: TargetClockSlot[]; affectedSlotIds: string[]; exceedsMidnight: boolean } {
  if (allSlots.length <= 1) {
    return { slots: allSlots, affectedSlotIds: [], exceedsMidnight: false };
  }

  const rationale = analyzeUserDayRationale(targetDateStr);
  const protectedHabitBlocks = buildProtectedBlockedIntervals(rationale, [], true, true);
  const restrictionMark = targetDateStr ? getProspectiveRestrictionMark(allSlots, targetDateStr) : 0;

  // Freeze:
  // 1) The single manually adjusted slot (`prioritySlotId`) at the user's exact chosen time
  // 2) Completed slots and past/currently-running slots (`<= restrictionMark`) so system ripple only moves prospective tasks
  const frozenSlots = allSlots
    .filter(s => {
      if (prioritySlotId && s.id === prioritySlotId) return true;
      const sStart = Number(s.startMinutes) || 0;
      const sEnd = Number(s.endMinutes) || 0;
      return (
        s.status === 'completed' ||
        sEnd <= restrictionMark ||
        (sStart <= restrictionMark && sEnd > restrictionMark)
      );
    })
    .sort((a, b) => a.startMinutes - b.startMinutes);
  const frozenIds = new Set(frozenSlots.map(s => String(s.id || '')));

  // Remaining prospective uncompleted slots are adjustable when rippling
  const adjustableSlots = allSlots.filter(s => !frozenIds.has(String(s.id || '')) && s.status !== 'completed');
  if (adjustableSlots.length === 0) {
    return { slots: [...frozenSlots], affectedSlotIds: [], exceedsMidnight: false };
  }

  const sorted = [...adjustableSlots].sort((a, b) => a.startMinutes - b.startMinutes);

  const stepAroundFrozen = (desiredStart: number, duration: number): number => {
    let s = desiredStart;
    for (const f of frozenSlots) {
      const fStart = Number(f.startMinutes) || 0;
      const fEnd = Number(f.endMinutes) || 0;
      if (Math.max(s, fStart) < Math.min(s + duration, fEnd)) {
        s = Math.max(s, fEnd);
      }
    }
    return s;
  };

  let currentEndMinutes = restrictionMark;
  const affected: string[] = [];
  let exceedsMidnight = false;
  const resultAdjustable: TargetClockSlot[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const slot = { ...sorted[i] };
    let startM = Math.max(restrictionMark, slot.startMinutes);
    let dur = Math.max(1, slot.durationMinutes);
    let wasRippled = startM !== slot.startMinutes;

    if (startM < currentEndMinutes) {
      startM = currentEndMinutes;
      wasRippled = true;
    }

    const steppedStart = stepAroundFrozen(startM, dur);
    if (steppedStart !== startM) {
      startM = steppedStart;
      wasRippled = true;
    }

    if (slot.status !== 'completed' && !slot.isMockTest) {
      for (const blk of protectedHabitBlocks) {
        if (Math.max(startM, blk.start) < Math.min(startM + dur, blk.end) && blk.end <= 1440) {
          const spaceBefore = blk.start - startM;
          if (spaceBefore >= 20 && (dur - spaceBefore) >= 15) {
            const origDur = slot.totalTargetMinutes || slot.durationMinutes;
            const baseId = slot.id.replace(/_p\d+$/, '');
            const cleanTitle = (slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();

            const part1End = blk.start;
            resultAdjustable.push({
              ...slot,
              id: `${baseId}_p1`,
              title: `${cleanTitle} (Part 1/2)`,
              slotNumber: 1,
              totalSlots: 2,
              totalTargetMinutes: origDur,
              startMinutes: startM,
              endMinutes: part1End,
              startTime: minutesToTimeStr(startM),
              endTime: minutesToTimeStr(part1End),
              durationMinutes: spaceBefore
            });

            dur = dur - spaceBefore;
            startM = stepAroundFrozen(blk.end, dur);
            slot.id = `${baseId}_p2`;
            slot.title = `${cleanTitle} (Part 2/2)`;
            slot.slotNumber = 2;
            slot.totalSlots = 2;
            slot.totalTargetMinutes = origDur;
            wasRippled = true;
          } else {
            startM = stepAroundFrozen(blk.end, dur);
            wasRippled = true;
          }
        }
      }
    }

    if (wasRippled && startM !== sorted[i].startMinutes) {
      affected.push(slot.id);
    }

    let endM = startM + dur;
    if (endM > 1440) {
      exceedsMidnight = true;
      endM = 1440;
      dur = Math.max(1, endM - startM);
      affected.push(slot.id);
    }

    resultAdjustable.push({
      ...slot,
      startMinutes: startM,
      endMinutes: endM,
      startTime: minutesToTimeStr(startM),
      endTime: minutesToTimeStr(endM),
      durationMinutes: dur
    });

    currentEndMinutes = endM;
  }

  const combined = [...frozenSlots, ...resultAdjustable].sort((a, b) => a.startMinutes - b.startMinutes);
  const validated = ensureProspectiveSchedule(allSlots, combined, targetDateStr || '', {
    allowManualSlotId: prioritySlotId,
    autoRipple: true,
    isManualUserChange: Boolean(prioritySlotId)
  });
  return { slots: validated, affectedSlotIds: Array.from(new Set(affected)), exceedsMidnight };
}

export {
  ensureProspectiveSchedule,
  smartSplitSlotAroundBlockades,
  applySmartSlotSplitter
};

export default function Target24HourClock({
  selectedDate,
  availableTasks,
  flowTargets,
  onUpdateFlow,
  onStartFocusForTask,
  onUpdateTaskTargetDuration,
  activeMode = 'idle',
  activeFocusTask,
  onToggleTaskStatus,
  balanceData,
  defaultExpanded = false,
  defaultExpandedTab = 'plan',
  onClose
}: Target24HourClockProps) {
  const caLevel = useCALevel();
  const levelSubjectIds = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);
  const defaultLevelSub = levelSubjectIds[0] || 'AFM';
  const storageKey = getClockSlotsStorageKey(selectedDate, caLevel);
  const { syncVersion, syncTaskCompletion } = useTargetSystemSync({ selectedDate });

  const isStudyRunning = activeMode === 'study';

  const isSlotMatchingActiveFocusTask = useCallback((s: any): boolean => {
    if (!activeFocusTask || !activeFocusTask.title) return false;
    const aftTitle = (activeFocusTask.title || '').trim().toLowerCase();
    const aftClean = ((activeFocusTask as any).cleanTitle || activeFocusTask.title || '').trim().toLowerCase();
    const aftNorm = normalizeKey(activeFocusTask.title);
    const aftChap = (activeFocusTask.chapterName || '').trim().toLowerCase();
    const aftId = ((activeFocusTask as any).id || '').trim().toLowerCase();
    const aftSub = (activeFocusTask.subjectCode || '').trim().toUpperCase();

    const sTitle = (s.title || '').trim().toLowerCase();
    const sNorm = normalizeKey(s.title || '');
    const sChap = (s.chapterName || '').trim().toLowerCase();
    const sId = (s.targetId || '').trim().toLowerCase();
    const sSub = (s.subjectCode || '').trim().toUpperCase();

    if (aftId && sId && aftId === sId) return true;
    if (sNorm && aftNorm && sNorm === aftNorm) return true;
    if (sTitle && (sTitle === aftTitle || sTitle === aftClean)) return true;
    if (sTitle && (sTitle.includes(aftTitle) || aftTitle.includes(sTitle))) return true;
    if (sChap && aftChap && sChap === aftChap && (!aftSub || !sSub || aftSub === sSub)) return true;
    return false;
  }, [activeFocusTask]);

  const resolveSlotCompletionState = (s: any, completedKeys: Set<string>): boolean => {
    const sIdNorm = (s.targetId || '').trim().toLowerCase();
    const sCleanTitle = String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
    const sTitleNorm = normalizeKey(sCleanTitle);
    const sRawTitleNorm = normalizeKey(s.title);
    const sChapNorm = normalizeKey(s.chapterName);

    const tasksList = availableTasksRef.current ?? availableTasks;
    // Check authoritative availableTasks first if present
    if (Array.isArray(tasksList) && tasksList.length > 0) {
      const matchedTasks = tasksList.filter(t => {
        const tId = (t.id || '').trim().toLowerCase();
        const tTitle = normalizeKey(t.title);
        const tClean = normalizeKey(String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim());
        const tChap = normalizeKey(t.chapterName);
        return Boolean(
          (sIdNorm && tId && sIdNorm === tId) ||
          (sTitleNorm && tClean && sTitleNorm === tClean) ||
          (sRawTitleNorm && tClean && sRawTitleNorm === tClean) ||
          (sTitleNorm && tTitle && sTitleNorm === tTitle) ||
          (sChapNorm && tChap && sChapNorm === tChap && (!s.subjectCode || !t.subjectCode || s.subjectCode === t.subjectCode))
        );
      });
      if (matchedTasks.length > 0) {
        return matchedTasks.some(t => t.status === 'completed' || Boolean(t.completed) || Boolean(t.isCompleted));
      }
    }

    return Boolean(
      (sIdNorm && completedKeys.has(sIdNorm)) ||
      (sTitleNorm && completedKeys.has(sTitleNorm)) ||
      (sRawTitleNorm && completedKeys.has(sRawTitleNorm)) ||
      (sChapNorm && completedKeys.has(sChapNorm)) ||
      isTaskCompletedInStorage(s.targetId, sCleanTitle || s.title, sCleanTitle || s.title, s.chapterName, s.subjectCode)
    );
  };

  // Resolve Target Board status ('Completed' | 'In progress' | 'Not started') for any slot in the Target Sequence
  const resolveTargetBoardStatusForSlot = useCallback((slot: TargetClockSlot): 'Completed' | 'In progress' | 'Not started' => {
    const completedKeys = getCompletedTaskKeysSet();
    const sCleanTitle = String(slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
    const subCode = (slot.subjectCode || 'FR') as SubjectId;
    const canonicalKey =
      getCanonicalChapterKey(subCode, slot.chapterName || sCleanTitle) ||
      slot.chapterName ||
      sCleanTitle;
    const normTitle = normalizeKey(sCleanTitle);
    const normChap = normalizeKey(slot.chapterName || canonicalKey);

    const tasksList = availableTasksRef.current ?? availableTasks;
    const matchedTask = Array.isArray(tasksList)
      ? tasksList.find((t: any) => {
          const tId = (t.id || '').trim().toLowerCase();
          const sId = (slot.targetId || '').trim().toLowerCase();
          const tClean = normalizeKey(String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim());
          const tChap = normalizeKey(t.chapterName || '');
          return Boolean(
            (sId && tId && sId === tId) ||
            (normTitle && tClean && normTitle === tClean) ||
            (normChap && tChap && normChap === tChap)
          );
        })
      : undefined;

    if (
      matchedTask?.isCompleted ||
      matchedTask?.status === 'completed' ||
      slot.status === 'completed' ||
      resolveSlotCompletionState(slot, completedKeys)
    ) {
      return 'Completed';
    }

    if (
      matchedTask?.isCurrentGrind ||
      (isStudyRunning && isSlotMatchingActiveFocusTask(slot))
    ) {
      return 'In progress';
    }

    if (
      matchedTask &&
      (
        matchedTask.status === 'in_progress' ||
        Number(matchedTask.totalActualSeconds || 0) > 0 ||
        Number(matchedTask.allocatedMinutes || 0) > 0 ||
        Number(matchedTask.actualDurationMinutes || 0) > 0 ||
        Number(matchedTask.elapsedSeconds || 0) > 0
      )
    ) {
      return 'In progress';
    }

    if (Array.isArray(balanceData?.sessionLogs)) {
      const hasStudySession = balanceData!.sessionLogs.some((log: any) => {
        if (!log || log.mode !== 'study' || Number(log.durationSeconds) <= 0) return false;
        if (log.date && selectedDate && log.date !== selectedDate) return false;
        if (log.subjectId && String(log.subjectId).toUpperCase() !== subCode.toUpperCase()) return false;
        const notesNorm = normalizeKey(log.notes || log.chapter || log.chapterName || '');
        const sTargetId = String(slot.targetId || '').trim().toLowerCase();
        const lTaskId = String(log.taskId || '').trim().toLowerCase();
        return Boolean(
          (sTargetId && lTaskId && sTargetId === lTaskId) ||
          (normChap && notesNorm.includes(normChap)) ||
          (normTitle && notesNorm.includes(normTitle))
        );
      });
      if (hasStudySession) return 'In progress';
    }

    return 'Not started';
  }, [availableTasks, balanceData?.sessionLogs, isSlotMatchingActiveFocusTask, isStudyRunning, selectedDate]);

  const availableTasksRef = React.useRef(availableTasks);
  availableTasksRef.current = availableTasks;

  const isSlotMatchingActiveFocusTaskRef = React.useRef(isSlotMatchingActiveFocusTask);
  isSlotMatchingActiveFocusTaskRef.current = isSlotMatchingActiveFocusTask;

  const availableTasksSignature = useMemo(() => {
    if (!Array.isArray(availableTasks) || availableTasks.length === 0) return '';
    return availableTasks
      .map(t => {
        const id = t.id || '';
        const title = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const done = Boolean(t.isCompleted || t.status === 'completed' || t.completed);
        const dur = t.targetDuration ?? t.targetDurationMinutes ?? t.duration ?? 60;
        return `${id}|${title}|${done ? '1' : '0'}|${dur}`;
      })
      .join(';;');
  }, [availableTasks]);

  // Master Dial Tab in Main Screen ('plan' | 'actuals')
  const [activeDialTab, setActiveDialTab] = useState<'plan' | 'actuals'>('plan');
  // Sub-view inside Main Plan Viewport ('dial' | 'sequence')
  const [planViewportMode, setPlanViewportMode] = useState<'dial' | 'sequence'>('dial');
  // Drag-and-drop & feedback state for Sequential Slot Reordering
  const [draggedSlotIdx, setDraggedSlotIdx] = useState<number | null>(null);
  const [dragOverSlotIdx, setDragOverSlotIdx] = useState<number | null>(null);
  const [sequenceFeedback, setSequenceFeedback] = useState<string | null>(null);
  // Expanded View Modal Tab ('compare' | 'plan' | 'actuals')
  const [expandedModalTab, setExpandedModalTab] = useState<'compare' | 'plan' | 'actuals'>(defaultExpandedTab || 'plan');
  // Hover state for Balance Clock
  const [hoveredBalanceSegment, setHoveredBalanceSegment] = useState<{
    type: string;
    duration: number;
    timeRange: string;
    color: string;
    x: number;
    y: number;
  } | null>(null);
  // Mobile touch swipe tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX < -40) {
      setActiveDialTab('actuals');
    } else if (deltaX > 40) {
      setActiveDialTab('plan');
    }
    setTouchStartX(null);
  };

  // State: Clock Target Slots (Each slot has a unique key `id` on the 24h clock)
  const [slots, setSlots] = useState<TargetClockSlot[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const userOnlySlots = parsed.filter((s: any) => {
            const sid = String(s?.id || '').trim();
            return !sid.startsWith('slot_reconciled_') && !sid.startsWith('slot_autobatch_ms_');
          });
          if (userOnlySlots.length !== parsed.length) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(userOnlySlots));
            } catch (e) {}
          }
          const completedKeys = getCompletedTaskKeysSet();
          const seenIds = new Set<string>();
          return userOnlySlots.map((s: any, idx: number) => {
            const isDone = resolveSlotCompletionState(s, completedKeys);
            const isSlotRunning = isStudyRunning && isSlotMatchingActiveFocusTask(s);
            let slotId = String(s.id || `slot_${Date.now()}_${idx}`);
            if (seenIds.has(slotId)) {
              slotId = `${slotId}_${idx}`;
            }
            seenIds.add(slotId);
            return {
              ...s,
              id: slotId,
              status: isDone ? ('completed' as const) : isSlotRunning ? ('active' as const) : (s.status === 'active' ? 'active' : 'pending')
            };
          });
        }
      }
    } catch (e) {}
    return [];
  });

  const isSyncingFromClockRef = React.useRef(false);
  const lastReconciledTaskSigRef = React.useRef<string>('');

  // Reload and synchronize when selectedDate, availableTasksSignature, activeFocusTask, activeMode, or unified target sync version changes
  useEffect(() => {
    const areSlotArraysIdentical = (a: TargetClockSlot[], b: TargetClockSlot[]): boolean => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        const s1 = a[i];
        const s2 = b[i];
        if (
          s1.id !== s2.id ||
          s1.targetId !== s2.targetId ||
          s1.title !== s2.title ||
          s1.startMinutes !== s2.startMinutes ||
          s1.endMinutes !== s2.endMinutes ||
          s1.durationMinutes !== s2.durationMinutes ||
          s1.status !== s2.status ||
          s1.subjectCode !== s2.subjectCode ||
          s1.relevance !== s2.relevance
        ) {
          return false;
        }
      }
      return true;
    };

    const loadSlotsFromStorageOnly = () => {
      if (isSyncingFromClockRef.current) return;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const userOnlySlots = parsed.filter((s: any) => {
              const sid = String(s?.id || '').trim();
              return !sid.startsWith('slot_reconciled_') && !sid.startsWith('slot_autobatch_ms_');
            });
            if (userOnlySlots.length !== parsed.length) {
              try {
                localStorage.setItem(storageKey, JSON.stringify(userOnlySlots));
              } catch (e) {}
            }
            const completedKeys = getCompletedTaskKeysSet();
            const seenIds = new Set<string>();
            const synchronized: TargetClockSlot[] = userOnlySlots.map((s: any, idx: number) => {
              const isDone = resolveSlotCompletionState(s, completedKeys);
              const isSlotRunning = isStudyRunning && isSlotMatchingActiveFocusTaskRef.current(s);
              let slotId = String(s.id || `slot_${Date.now()}_${idx}`);
              if (seenIds.has(slotId)) {
                slotId = `${slotId}_${idx}`;
              }
              seenIds.add(slotId);
              return {
                ...s,
                id: slotId,
                status: isDone ? ('completed' as const) : isSlotRunning ? ('active' as const) : (s.status === 'active' ? 'active' : 'pending')
              };
            });
            setSlots(prev => (areSlotArraysIdentical(prev, synchronized) ? prev : synchronized));
            return;
          }
        }
      } catch (e) {}
      setSlots(prev => (prev.length === 0 ? prev : []));
    };

    const sigKey = `${selectedDate}::${availableTasksSignature}`;
    if (lastReconciledTaskSigRef.current !== sigKey) {
      lastReconciledTaskSigRef.current = sigKey;
      try {
        const currentTasks = availableTasksRef.current;
        const clockAutoTasks = Array.isArray(currentTasks)
          ? currentTasks.filter((t: any) => !String(t?.id || '').startsWith('lmr_'))
          : [];
        if (clockAutoTasks.length > 0) {
          reconcileTargetMetricsAndClockForDate(selectedDate, clockAutoTasks);
        }
      } catch (e) {}
    }

    loadSlotsFromStorageOnly();
    window.addEventListener('practca_target_clock_updated', loadSlotsFromStorageOnly);
    window.addEventListener('practca_tasks_updated', loadSlotsFromStorageOnly);
    window.addEventListener('practca_target_system_synced', loadSlotsFromStorageOnly);
    window.addEventListener('practca_flow_updated', loadSlotsFromStorageOnly);
    window.addEventListener('practca_active_task_duration_adjusted', loadSlotsFromStorageOnly);
    window.addEventListener('storage', loadSlotsFromStorageOnly);
    return () => {
      window.removeEventListener('practca_target_clock_updated', loadSlotsFromStorageOnly);
      window.removeEventListener('practca_tasks_updated', loadSlotsFromStorageOnly);
      window.removeEventListener('practca_target_system_synced', loadSlotsFromStorageOnly);
      window.removeEventListener('practca_flow_updated', loadSlotsFromStorageOnly);
      window.removeEventListener('practca_active_task_duration_adjusted', loadSlotsFromStorageOnly);
      window.removeEventListener('storage', loadSlotsFromStorageOnly);
    };
  }, [storageKey, selectedDate, availableTasksSignature, syncVersion, activeFocusTask?.title, activeMode, isStudyRunning]);

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState<boolean>(Boolean(defaultExpanded));
  const [isSequenceListModalOpen, setIsSequenceListModalOpen] = useState(false);

  const handleCloseExpandedModal = useCallback(() => {
    setIsExpandedModalOpen(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleTriggerAddLog = useCallback(() => {
    if (balanceData?.onOpenLogModal) {
      balanceData.onOpenLogModal();
    } else {
      window.dispatchEvent(new CustomEvent('practca_open_manual_log_modal'));
    }
  }, [balanceData]);

  const handleTriggerLogMockTest = useCallback(() => {
    if (balanceData?.onOpenLogMockTestModal) {
      balanceData.onOpenLogMockTestModal();
    } else {
      window.dispatchEvent(new CustomEvent('practca_open_log_mock_test_modal'));
    }
  }, [balanceData]);

  useEffect(() => {
    const handleOpenSequenceModal = () => {
      setIsSequenceListModalOpen(true);
    };
    window.addEventListener('practca_open_clock_sequence_modal', handleOpenSequenceModal);
    return () => {
      window.removeEventListener('practca_open_clock_sequence_modal', handleOpenSequenceModal);
    };
  }, []);

  // Single Distinct Slot Form State
  // If `editingSlotId` is null -> adding a brand new distinct slot
  // If `editingSlotId` is string -> editing that specific distinct slot on the 24h clock
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [customTargetTitle, setCustomTargetTitle] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<SubjectId>(defaultLevelSub);
  const [slotStartTime, setSlotStartTime] = useState<string>('09:00');
  const [slotEndTime, setSlotEndTime] = useState<string>('10:30');
  const [slotStartMinutes, setSlotStartMinutes] = useState<number>(540);
  const [slotEndMinutes, setSlotEndMinutes] = useState<number>(630);
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(90);
  const [autoRipple, setAutoRipple] = useState<boolean>(true);
  const [isMockSlotMode, setIsMockSlotMode] = useState<boolean>(false);

  // Hovered highlighted slot on the dial
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);
  const [autoBatchFeedback, setAutoBatchFeedback] = useState<string | null>(null);
  const [autoBatchAlertModal, setAutoBatchAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    scheduledCount: number;
    totalCount: number;
  } | null>(null);

  // Filter available targets to ONLY those that are NOT completed at this point in time (used by system auto-batching)
  const incompleteAvailableTasks = useMemo(() => {
    const completedKeys = getCompletedTaskKeysSet();
    const seenNames = new Set<string>();
    const list: any[] = [];

    (availableTasks || []).forEach(t => {
      const idKey = (t.id || '').toLowerCase();
      const cleanName = (t.cleanTitle || t.title || '').trim();
      const normName = normalizeKey(cleanName);
      const chapKey = normalizeKey(t.chapterName || '');

      const isDone =
        t.status === 'completed' ||
        Boolean(t.completed) ||
        (idKey && completedKeys.has(idKey)) ||
        (normName && completedKeys.has(normName)) ||
        (chapKey && completedKeys.has(chapKey)) ||
        isTaskCompletedInStorage(t.id, t.title, t.cleanTitle, t.chapterName);

      if (!isDone && normName && !seenNames.has(normName)) {
        seenNames.add(normName);
        list.push(t);
      }
    });

    return list;
  }, [availableTasks, slots, syncVersion]);

  // All selectable targets for manual user changes in the Add/Edit Modal (includes both pending and completed targets so the user can edit/schedule any target at free will)
  const selectableModalTasks = useMemo(() => {
    const completedKeys = getCompletedTaskKeysSet();
    const seenNames = new Set<string>();
    const pendingList: any[] = [];
    const completedList: any[] = [];

    (availableTasks || []).forEach(t => {
      const idKey = (t.id || '').toLowerCase();
      const cleanName = (t.cleanTitle || t.title || '').trim();
      const normName = normalizeKey(cleanName);
      const chapKey = normalizeKey(t.chapterName || '');
      if (!normName || seenNames.has(normName)) return;
      seenNames.add(normName);

      const isDone =
        t.status === 'completed' ||
        Boolean(t.completed) ||
        (idKey && completedKeys.has(idKey)) ||
        (normName && completedKeys.has(normName)) ||
        (chapKey && completedKeys.has(chapKey)) ||
        isTaskCompletedInStorage(t.id, t.title, t.cleanTitle, t.chapterName);

      if (isDone) {
        completedList.push({ ...t, _isCompletedTarget: true });
      } else {
        pendingList.push({ ...t, _isCompletedTarget: false });
      }
    });

    return [...pendingList, ...completedList];
  }, [availableTasks, slots, syncVersion]);

  // Listen for direct open request from Target Duration Meter or other components
  useEffect(() => {
    const handleOpenDirect = (e: any) => {
      const targetId = e?.detail?.targetId;
      const slotId = e?.detail?.slotId;
      if (slotId) {
        const foundSlot = slots.find(s => s.id === slotId);
        if (foundSlot) {
          handleOpenEditSlotModal(foundSlot);
          return;
        }
      }
      handleOpenAddSlotModal(targetId);
    };
    window.addEventListener('practca_open_assign_clock_slot', handleOpenDirect as EventListener);
    return () => window.removeEventListener('practca_open_assign_clock_slot', handleOpenDirect as EventListener);
  }, [slots, incompleteAvailableTasks]);

  // Close expanded or sequence list modal on Escape key
  useEffect(() => {
    if (!isExpandedModalOpen && !isSequenceListModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpandedModalOpen(false);
        setIsSequenceListModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpandedModalOpen, isSequenceListModalOpen]);

  // Currently selected task object in the modal
  const selectedTaskObj = useMemo(() => {
    if (!selectedTargetId || selectedTargetId === '__custom__') return null;
    return (
      incompleteAvailableTasks.find(t => (t.id || t.title) === selectedTargetId || normalizeKey(t.cleanTitle || t.title) === normalizeKey(selectedTargetId)) ||
      (availableTasks || []).find(t => (t.id || t.title) === selectedTargetId || normalizeKey(t.cleanTitle || t.title) === normalizeKey(selectedTargetId)) ||
      null
    );
  }, [selectedTargetId, incompleteAvailableTasks, availableTasks]);

  // Other slots on the clock (excluding ONLY the specific slot being edited, if any)
  const otherSlots = useMemo(() => {
    if (!editingSlotId) return slots;
    return slots.filter(s => s.id !== editingSlotId);
  }, [slots, editingSlotId]);

  // Detect any overlaps between this single slot and other slots on the 24h clock
  const conflictingSlots = useMemo(() => {
    if (!isAssignModalOpen) return [];
    const currentRange = { startMinutes: slotStartMinutes, endMinutes: Math.min(1440, slotEndMinutes) };
    return otherSlots.filter(other => checkSlotOverlap(currentRange, other));
  }, [slotStartMinutes, slotEndMinutes, otherSlots, isAssignModalOpen]);

  // Calculate how much total time this target will have consolidated across the 24h clock
  const consolidatedTargetMinutesPreview = useMemo(() => {
    const activeTitle = selectedTaskObj
      ? (selectedTaskObj.cleanTitle || selectedTaskObj.title)
      : customTargetTitle.trim();
    if (!activeTitle) return slotDurationMinutes;
    const normActive = normalizeKey(activeTitle);
    const otherSameTargetMinutes = otherSlots
      .filter(s => normalizeKey(s.title) === normActive)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    return otherSameTargetMinutes + slotDurationMinutes;
  }, [selectedTaskObj, customTargetTitle, otherSlots, slotDurationMinutes]);

  // Analyzed Weekday + Weekly Rationale for selectedDate (last <=7 same-weekdays + last 14d SMA, excluding empty/low days)
  const dayRationale = useMemo(() => {
    return analyzeUserDayRationale(selectedDate);
  }, [selectedDate, syncVersion]);

  // Open modal to ADD a brand new distinct slot
  const handleOpenAddSlotModal = (preferredTargetKey?: string, isMockTest?: boolean) => {
    setEditingSlotId(null);

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayStr;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const minTodayStart = isToday ? Math.min(1425, Math.ceil(nowMins / 5) * 5) : 0;

    if (isMockTest) {
      setIsMockSlotMode(true);
      setSelectedTargetId('__custom__');
      const isIBS = customSubject === 'IBS';
      const defaultDuration = isIBS ? 240 : 180;
      setCustomTargetTitle(isIBS ? 'ICAI Mock Test Paper (4-Hour IBS Simulation)' : 'ICAI Mock Test Paper (3-Hour Exam Simulation)');
      const mockStartM = isToday ? Math.max(840, minTodayStart) : 840;
      const mockEndM = Math.min(1440, mockStartM + defaultDuration);
      setSlotStartTime(minutesToTimeStr(mockStartM % 1440));
      setSlotEndTime(minutesToTimeStr(mockEndM % 1440));
      setSlotStartMinutes(mockStartM);
      setSlotEndMinutes(mockEndM);
      setSlotDurationMinutes(Math.max(15, mockEndM - mockStartM));
      setIsAssignModalOpen(true);
      return;
    }

    setIsMockSlotMode(false);
    let chosenTask: any = null;
    if (preferredTargetKey) {
      const normPref = normalizeKey(preferredTargetKey);
      chosenTask = incompleteAvailableTasks.find(
        t => (t.id || t.title) === preferredTargetKey || normalizeKey(t.cleanTitle || t.title) === normPref
      );
    }
    if (!chosenTask && incompleteAvailableTasks.length > 0) {
      chosenTask = incompleteAvailableTasks[0];
    }

    if (chosenTask) {
      setSelectedTargetId(chosenTask.id || chosenTask.title);
      setCustomTargetTitle('');
      setCustomSubject((chosenTask.subjectCode || defaultLevelSub) as SubjectId);
      setIsMockSlotMode(Boolean(chosenTask.isMockTest || isMockTestTask(chosenTask)));
    } else {
      setSelectedTargetId('__custom__');
      setCustomTargetTitle('');
      setCustomSubject(defaultLevelSub);
    }

    const defaultDur = 60;
    const lastSlot = slots.length > 0 ? slots[slots.length - 1] : null;
    const rawPreferStart = lastSlot
      ? Math.min(1380, lastSlot.endMinutes)
      : dayRationale.estimatedStudyStartMinutes; // Usual study start time analyzed for this weekday
    const preferStart = Math.max(minTodayStart, rawPreferStart);
    const gap = findNextAvailableGap(slots, defaultDur, preferStart, minTodayStart, selectedDate);

    setSlotStartMinutes(gap.startMinutes);
    setSlotEndMinutes(gap.endMinutes);
    setSlotStartTime(minutesToTimeStr(gap.startMinutes));
    setSlotEndTime(minutesToTimeStr(gap.endMinutes % 1440));
    setSlotDurationMinutes(gap.endMinutes - gap.startMinutes);
    setIsAssignModalOpen(true);
  };

  // Open modal to EDIT a single specific slot (`slot.id`) without clubbing other slots
  const handleOpenEditSlotModal = (slot: TargetClockSlot) => {
    setEditingSlotId(slot.id);
    setIsMockSlotMode(Boolean(slot.isMockTest || isMockTestTask(slot)));

    const matchingTask = incompleteAvailableTasks.find(
      t => (t.id || t.title) === slot.targetId || normalizeKey(t.cleanTitle || t.title) === normalizeKey(slot.title)
    ) || (availableTasks || []).find(
      t => (t.id || t.title) === slot.targetId || normalizeKey(t.cleanTitle || t.title) === normalizeKey(slot.title)
    );

    if (matchingTask) {
      setSelectedTargetId(matchingTask.id || matchingTask.title);
      setCustomTargetTitle('');
      setCustomSubject((matchingTask.subjectCode || slot.subjectCode || defaultLevelSub) as SubjectId);
    } else {
      setSelectedTargetId('__custom__');
      setCustomTargetTitle(slot.title);
      setCustomSubject(slot.subjectCode || defaultLevelSub);
    }

    setSlotStartMinutes(slot.startMinutes);
    setSlotEndMinutes(slot.endMinutes);
    setSlotStartTime(slot.startTime);
    setSlotEndTime(slot.endTime === '24:00' ? '00:00' : slot.endTime);
    setSlotDurationMinutes(slot.durationMinutes);
    setIsAssignModalOpen(true);
  };

  // Update the single slot's start or end time in the modal
  const handleUpdateSlotTime = (field: 'startTime' | 'endTime', value: string) => {
    if (!value || !value.includes(':')) return;
    if (field === 'startTime') {
      const sMins = parseTimeToMinutes(value);
      const rawEnd = parseTimeToMinutes(slotEndTime);
      let eMins = slotEndMinutes;
      let dur = slotDurationMinutes;

      if (slotEndMinutes > 1440) {
        const nextDayEndMinutes = slotEndMinutes - 1440;
        dur = (1440 - sMins) + nextDayEndMinutes;
      } else if (sMins >= 720 && rawEnd < sMins && rawEnd <= 720) {
        eMins = 1440 + rawEnd;
        dur = eMins - sMins;
      } else if (eMins <= sMins) {
        eMins = Math.min(1440, sMins + Math.max(15, dur));
        setSlotEndTime(minutesToTimeStr(eMins % 1440));
        dur = eMins - sMins;
      } else {
        dur = eMins - sMins;
      }

      setSlotStartTime(value);
      setSlotStartMinutes(sMins);
      setSlotEndMinutes(eMins);
      setSlotDurationMinutes(Math.max(15, dur));
    } else {
      const rawEnd = parseTimeToMinutes(value);
      let sMins = slotStartMinutes;
      let eMins = rawEnd;
      let dur = 30;

      if (sMins >= 720 && rawEnd < sMins && rawEnd <= 720) {
        eMins = 1440 + rawEnd;
        dur = eMins - sMins;
      } else if (rawEnd <= sMins) {
        sMins = Math.max(0, rawEnd - 30);
        setSlotStartTime(minutesToTimeStr(sMins));
        eMins = rawEnd;
        dur = Math.max(15, eMins - sMins);
      } else {
        eMins = rawEnd;
        dur = eMins - sMins;
      }

      setSlotEndTime(value);
      setSlotStartMinutes(sMins);
      setSlotEndMinutes(eMins);
      setSlotDurationMinutes(Math.max(15, dur));
    }
  };

  // Shift the single slot earlier or later
  const handleShiftModalSlot = (deltaMins: number) => {
    const currentDuration = Math.max(15, slotDurationMinutes);
    const newStart = Math.max(0, Math.min(1425, slotStartMinutes + deltaMins));
    const newEnd = newStart + currentDuration;

    setSlotStartMinutes(newStart);
    setSlotEndMinutes(newEnd);
    setSlotStartTime(minutesToTimeStr(newStart % 1440));
    setSlotEndTime(minutesToTimeStr(newEnd % 1440));
    setSlotDurationMinutes(currentDuration);
  };

  // Set duration directly for the single slot
  const handleSetModalSlotDuration = (mins: number) => {
    const newEnd = slotStartMinutes + mins;
    setSlotEndMinutes(newEnd);
    setSlotEndTime(minutesToTimeStr(newEnd % 1440));
    setSlotDurationMinutes(mins);
  };

  // Core Sync Function:
  // - In the 24-hour target clock: each slot is distinct with its own unique `slot.id`
  // - For the rest of the app (Target Duration Meter & Target Flow): unique key is clean target name (`normalizeKey(cleanBaseTitle)`),
  //   so split parts (`Part 1/2` and `Part 2/2`) always consolidate into a single unified Target Flow item!
  // - When `preserveFlowOrder` is true (during system auto-slotting / smart-splitting), existing Target Flow order is preserved
  //   so the flow of targets never changes unexpectedly unless modified by the user.
  const syncSlotsAndAutoGenerateFlow = (
    newSlots: TargetClockSlot[],
    startFlowImmediately: boolean = false,
    removedTargetNames: string[] = [],
    manualSlotId?: string,
    autoRipple: boolean = true,
    preserveFlowOrder: boolean = false
  ) => {
    const validatedSlots = ensureProspectiveSchedule(slots, newSlots, selectedDate, {
      activeFocusTaskId: activeFocusTask?.title || (activeFocusTask as any)?.id,
      autoSplitRoutineBlockades: true,
      allowManualSlotId: manualSlotId,
      autoRipple,
      isManualUserChange: Boolean(manualSlotId)
    });

    const completedKeys = getCompletedTaskKeysSet();
    const sortedSlots = [...validatedSlots]
      .sort((a, b) => a.startMinutes - b.startMinutes)
      .map((s): TargetClockSlot => {
        const isDone = resolveSlotCompletionState(s, completedKeys);
        const isSlotRunning = isStudyRunning && isSlotMatchingActiveFocusTask(s);
        return {
          ...s,
          status: isDone ? 'completed' : isSlotRunning ? 'active' : (s.status === 'active' ? 'active' : 'pending')
        };
      });
    setSlots(sortedSlots);

    // Consolidate total duration by target name (and targetId) for Target Duration Meter
    // Skip multi-chapter clubbed batch slots so a batch slot's combined duration never overwrites an individual sub-target's duration
    const consolidatedByNormTitle: Record<string, { totalMins: number; rawTitles: Set<string>; targetIds: Set<string>; isMatchActiveFocus: boolean }> = {};
    for (const slot of sortedSlots) {
      const isClubBatchSlot =
        String(slot.id || '').includes('_club_') ||
        Number((slot as any).batchSize) > 1 ||
        /^batch\s*\d*\s*\(/i.test(String(slot.title || '').trim());
      if (isClubBatchSlot) continue;

      const cleanBaseTitle = String(slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
      const normName = normalizeKey(cleanBaseTitle) || slot.targetId;
      if (!consolidatedByNormTitle[normName]) {
        consolidatedByNormTitle[normName] = {
          totalMins: 0,
          rawTitles: new Set<string>(),
          targetIds: new Set<string>(),
          isMatchActiveFocus: false
        };
      }
      consolidatedByNormTitle[normName].totalMins += slot.durationMinutes;
      if (slot.title) consolidatedByNormTitle[normName].rawTitles.add(slot.title);
      if (cleanBaseTitle) consolidatedByNormTitle[normName].rawTitles.add(cleanBaseTitle);
      if (slot.targetId) consolidatedByNormTitle[normName].targetIds.add(slot.targetId);
      if (isSlotMatchingActiveFocusTask(slot)) {
        consolidatedByNormTitle[normName].isMatchActiveFocus = true;
      }
    }

    const taskCalculatedDurations: Record<string, number> = {};
    let activeFocusTaskNewTotalMins: number | null = null;

    Object.entries(consolidatedByNormTitle).forEach(([normName, info]) => {
      taskCalculatedDurations[normName] = info.totalMins;
      info.rawTitles.forEach(t => { taskCalculatedDurations[t] = info.totalMins; });
      info.targetIds.forEach(id => { taskCalculatedDurations[id] = info.totalMins; });
      if (info.isMatchActiveFocus) {
        activeFocusTaskNewTotalMins = info.totalMins;
      }
    });

    isSyncingFromClockRef.current = true;
    try {
      try {
        localStorage.setItem(storageKey, JSON.stringify(sortedSlots));
        const durStorageKey = getLevelScopedKey('practca_task_target_durations', caLevel);
        const rawDur = localStorage.getItem(durStorageKey);
        const durMap = rawDur ? JSON.parse(rawDur) || {} : {};
        Object.entries(taskCalculatedDurations).forEach(([k, v]) => {
          durMap[k] = v;
        });
        localStorage.setItem(durStorageKey, JSON.stringify(durMap));

        // Also update targetDurationMinutes & duration directly in practca_local_tasks and practca_cached_cloud_tasks
        // so Daily Targets and Target Metrics match the 24H Clock to the exact minute!
        [
          getLevelScopedKey('practca_local_tasks', caLevel),
          getLevelScopedKey('practca_cached_cloud_tasks', caLevel)
        ].forEach(taskStoreKey => {
          try {
            const rawTasks = localStorage.getItem(taskStoreKey);
            if (!rawTasks) return;
            const parsedTasks = JSON.parse(rawTasks);
            if (!Array.isArray(parsedTasks)) return;
            let storeUpdated = false;
            const updatedTasks = parsedTasks.map((t: any) => {
              if (!t || t.status === 'unachieved' || t.clubGroupId) return t;
              const tDate = t.taskDate || (t.due ? String(t.due).split('T')[0] : '');
              if (tDate !== selectedDate) return t;
              const tClean = String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
              const tNorm = normalizeKey(tClean);
              const tId = String(t.id || '').trim();
              const newDur =
                (tId && taskCalculatedDurations[tId] !== undefined ? taskCalculatedDurations[tId] : undefined) ??
                (tClean && taskCalculatedDurations[tClean] !== undefined ? taskCalculatedDurations[tClean] : undefined) ??
                (tNorm && taskCalculatedDurations[tNorm] !== undefined ? taskCalculatedDurations[tNorm] : undefined);
              if (newDur !== undefined && (t.targetDurationMinutes !== newDur || t.duration !== newDur)) {
                storeUpdated = true;
                return {
                  ...t,
                  targetDurationMinutes: newDur,
                  duration: newDur
                };
              }
              return t;
            });
            if (storeUpdated) {
              localStorage.setItem(taskStoreKey, JSON.stringify(updatedTasks));
            }
          } catch (e) {}
        });
      } catch (e) {}

      if (onUpdateTaskTargetDuration) {
        Object.entries(taskCalculatedDurations).forEach(([taskKey, totalMins]) => {
          onUpdateTaskTargetDuration(taskKey, totalMins, true);
        });
        if (activeFocusTask && activeFocusTaskNewTotalMins !== null) {
          onUpdateTaskTargetDuration(activeFocusTask.title, activeFocusTaskNewTotalMins, true);
          if ((activeFocusTask as any).cleanTitle) {
            onUpdateTaskTargetDuration((activeFocusTask as any).cleanTitle, activeFocusTaskNewTotalMins, true);
          }
          if ((activeFocusTask as any).id) {
            onUpdateTaskTargetDuration((activeFocusTask as any).id, activeFocusTaskNewTotalMins, true);
          }
        }
      }

      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new CustomEvent('practca_target_clock_durations_updated', {
        detail: { date: selectedDate, taskDurations: taskCalculatedDurations, removedTargetNames }
      }));

      if (activeFocusTask && activeFocusTaskNewTotalMins !== null) {
        window.dispatchEvent(new CustomEvent('practca_active_task_duration_adjusted', {
          detail: {
            taskTitle: activeFocusTask.title,
            activeFocusTask,
            newTotalMinutes: activeFocusTaskNewTotalMins,
            date: selectedDate
          }
        }));
      }
    } finally {
      isSyncingFromClockRef.current = false;
    }

    // Auto-generate unified Target Flow sequence keyed by clean base title (`normalizeKey(cleanBaseTitle)`),
    // consolidating split segments (`Part 1/2`, `Part 2/2`) into a single flow target!
    const existingFlowOrderMap = new Map<string, number>();
    const existingFlowAllocatedMap = new Map<string, number>();
    if (Array.isArray(flowTargets)) {
      flowTargets.forEach((ft, idx) => {
        const cleanFtTitle = String(ft.cleanTitle || ft.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const k = normalizeKey(cleanFtTitle) || ft.taskId || ft.id;
        if (k && !existingFlowOrderMap.has(k)) {
          existingFlowOrderMap.set(k, idx);
        }
        if (ft.taskId && !existingFlowOrderMap.has(ft.taskId)) {
          existingFlowOrderMap.set(ft.taskId, idx);
        }
        if (Number(ft.allocatedMinutes) > 0) {
          if (k) existingFlowAllocatedMap.set(k, Number(ft.allocatedMinutes));
          if (ft.taskId) existingFlowAllocatedMap.set(ft.taskId, Number(ft.allocatedMinutes));
        }
      });
    }

    if (Array.isArray(availableTasks)) {
      availableTasks.forEach((at: any) => {
        if (!at) return;
        const cleanAt = String(at.cleanTitle || at.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const k = normalizeKey(cleanAt) || at.id;
        const alloc = Number(at.allocatedMinutes) || 0;
        if (alloc > 0) {
          if (k) existingFlowAllocatedMap.set(k, alloc);
          if (at.id) existingFlowAllocatedMap.set(at.id, alloc);
        }
      });
    }

    const taskGroupMap = new Map<string, {
      key: string;
      cleanTitle: string;
      firstSlot: TargetClockSlot;
      earliestStartMinutes: number;
      totalDurationMinutes: number;
      allSlots: TargetClockSlot[];
    }>();

    for (const slot of sortedSlots) {
      const cleanTitle = String(slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim() || slot.title;
      const key = normalizeKey(cleanTitle) || slot.targetId;
      if (!taskGroupMap.has(key)) {
        taskGroupMap.set(key, {
          key,
          cleanTitle,
          firstSlot: slot,
          earliestStartMinutes: slot.startMinutes,
          totalDurationMinutes: slot.durationMinutes,
          allSlots: [slot]
        });
      } else {
        const group = taskGroupMap.get(key)!;
        group.totalDurationMinutes += slot.durationMinutes;
        if (slot.startMinutes < group.earliestStartMinutes) {
          group.earliestStartMinutes = slot.startMinutes;
          group.firstSlot = slot;
        }
        group.allSlots.push(slot);
      }
    }

    const generatedFlow: FlowTargetItem[] = Array.from(taskGroupMap.values())
      .sort((a, b) => {
        if (preserveFlowOrder && existingFlowOrderMap.size > 0) {
          const idxA = existingFlowOrderMap.get(a.key) ?? existingFlowOrderMap.get(a.firstSlot.targetId);
          const idxB = existingFlowOrderMap.get(b.key) ?? existingFlowOrderMap.get(b.firstSlot.targetId);
          if (idxA !== undefined && idxB !== undefined && idxA !== idxB) {
            return idxA - idxB;
          }
        }
        return a.earliestStartMinutes - b.earliestStartMinutes;
      })
      .map((group, index) => {
        const slot = group.firstSlot;
        const cleanTitle = group.cleanTitle;
        const totalDuration = group.totalDurationMinutes;
        const isTaskDone = (slot.targetId && completedKeys.has(slot.targetId.toLowerCase())) ||
                           (cleanTitle && completedKeys.has(normalizeKey(cleanTitle))) ||
                           (slot.title && completedKeys.has(normalizeKey(slot.title))) ||
                           (slot.chapterName && completedKeys.has(normalizeKey(slot.chapterName))) ||
                           isTaskCompletedInStorage(slot.targetId, cleanTitle, cleanTitle, slot.chapterName) ||
                           group.allSlots.every(s => s.status === 'completed');
        const isCurrentlyActive = !isTaskDone && (group.allSlots.some(s => s.status === 'active') || (index === 0 && startFlowImmediately));
        const resolvedAlloc =
          existingFlowAllocatedMap.get(group.key) ??
          existingFlowAllocatedMap.get(slot.targetId) ??
          0;

        return {
          id: `flow_${normalizeKey(cleanTitle) || slot.targetId}`,
          taskId: slot.targetId,
          title: cleanTitle,
          cleanTitle: cleanTitle,
          chapterName: slot.chapterName,
          subjectCode: slot.subjectCode,
          duration: totalDuration,
          targetDurationMinutes: totalDuration,
          allocatedMinutes: resolvedAlloc,
          relevance: slot.relevance,
          dueDate: `${selectedDate}T${slot.startTime}:00.000Z`,
          status: isTaskDone ? 'completed' : isCurrentlyActive ? 'active' : 'pending'
        };
      });

    onUpdateFlow(generatedFlow, startFlowImmediately);
  };

  // Save the single distinct time slot (add new or update existing `editingSlotId`)
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();

    let targetId = '';
    let titleToUse = '';
    let chapterToUse: string | undefined = undefined;
    let subCode: SubjectId = defaultLevelSub;
    let rel: 'General' | 'Revision' | 'Final Revision' = 'Revision';

    const existingSlotBeingEdited = editingSlotId ? slots.find(s => s.id === editingSlotId) : null;

    if (selectedTaskObj) {
      targetId = selectedTaskObj.id || selectedTaskObj.cleanTitle || selectedTaskObj.title;
      titleToUse = selectedTaskObj.cleanTitle || selectedTaskObj.title;
      chapterToUse = selectedTaskObj.chapterName;
      subCode = (selectedTaskObj.subjectCode || defaultLevelSub) as SubjectId;
      rel = (selectedTaskObj.relevance || 'Revision') as any;
    } else {
      const trimmed = customTargetTitle.trim();
      if (!trimmed) return;
      targetId = existingSlotBeingEdited?.targetId || `target_${normalizeKey(trimmed)}`;
      titleToUse = trimmed;
      chapterToUse = trimmed;
      subCode = customSubject;
      rel = 'Revision';
    }

    const isSlotMockTest = Boolean(
      isMockSlotMode ||
      existingSlotBeingEdited?.isMockTest ||
      isMockTestTask({ title: titleToUse, isMockTest: selectedTaskObj?.isMockTest, id: targetId })
    );

    // Respect the user's manual slot time selection at free will
    let effectiveStartMinutes = slotStartMinutes;
    let effectiveEndMinutes = slotEndMinutes;
    let effectiveDurationMinutes = slotDurationMinutes;

    const effectiveStartTimeStr = minutesToTimeStr(effectiveStartMinutes % 1440);
    const effectiveEndTimeStr = effectiveEndMinutes >= 1440 ? '24:00' : minutesToTimeStr(effectiveEndMinutes % 1440);

    // Determine Exam Writing Start Time (HH:MM) for Mock Tests:
    // If slot duration is 195m (15m reading + 180m exam) or 255m (15m reading + 240m IBS exam), exam starts at startMinutes + 15; otherwise slotStartTime IS the exam start time X.
    const examStartMinutes = (effectiveDurationMinutes === 195 || effectiveDurationMinutes === 255) ? (effectiveStartMinutes + 15) % 1440 : effectiveStartMinutes;
    const examStartHHMM = minutesToTimeStr(examStartMinutes);
    const mockSeriesToUse = (selectedTaskObj as any)?.mockSeries || existingSlotBeingEdited?.mockSeries || 'ICAI MTP Series 1';

    if (isSlotMockTest) {
      rel = 'General';
      chapterToUse = undefined;
      if (!targetId || !String(targetId).startsWith('mock_task_')) {
        targetId = existingSlotBeingEdited?.targetId && String(existingSlotBeingEdited.targetId).startsWith('mock_task_')
          ? existingSlotBeingEdited.targetId
          : `mock_task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      }
      if (!new RegExp(`^\\[\\s*${subCode}\\s*\\]`, 'i').test(titleToUse)) {
        titleToUse = `[${subCode}] ${titleToUse.replace(/^\[\s*(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|AFM|FR|Audit|DT|IDT|IBS)\s*\]\s*/i, '')}`;
      }
    }

    const isTaskCompleted =
      selectedTaskObj?.status === 'completed' ||
      isTaskCompletedInStorage(targetId, titleToUse, titleToUse);

    const uniqueSlotId = editingSlotId || (isSlotMockTest ? `slot_mock_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` : `slot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);

    // Whenever a Mock Test slot is added or updated on the 24-Hour Target Clock,
    // automatically create/sync it as a Pending Task in `practca_local_tasks` & `practca_cached_cloud_tasks`
    // so it appears in Pending Tasks and Study Mode's "Link a Task" dropdown!
    if (isSlotMockTest) {
      const fullMockTitle = titleToUse.startsWith('🔵') ? titleToUse : `🔵 [General] ${titleToUse}`;
      const dueIso = `${selectedDate}T${examStartHHMM}:00.000Z`;
      const readingStartHHMM = minutesToTimeStr(Math.max(0, examStartMinutes - 15));
      const notesStr = `IS_MOCK_TEST: true\nMockScheduledTime: ${examStartHHMM}\nMockSeries: ${mockSeriesToUse}\nRelevance: General\nSubject: ${subCode}\nTargetDurationMinutes: ${effectiveDurationMinutes}\nReadingStart: ${readingStartHHMM}`;

      let targetListId = localStorage.getItem(getLevelScopedKey('practca_selected_list_id', caLevel)) || 'local-default';
      try {
        const storedLists = localStorage.getItem(getLevelScopedKey('practca_local_task_lists', caLevel));
        if (storedLists) {
          const parsedLists = JSON.parse(storedLists);
          if (Array.isArray(parsedLists) && parsedLists.length > 0 && parsedLists[0]?.id && (!targetListId || targetListId === 'local-default')) {
            targetListId = parsedLists[0].id;
          }
        }
      } catch (e) {}

      const syncedMockTaskObj: any = {
        id: targetId,
        title: fullMockTitle,
        cleanTitle: titleToUse,
        subjectCode: subCode,
        relevance: 'General' as const,
        due: dueIso,
        taskDate: selectedDate,
        status: isTaskCompleted ? ('completed' as const) : ('needsAction' as const),
        isMockTest: true,
        mockScheduledTime: examStartHHMM,
        mockSeries: mockSeriesToUse,
        targetDurationMinutes: effectiveDurationMinutes,
        durationMinutes: effectiveDurationMinutes,
        targetDuration: effectiveDurationMinutes,
        notes: notesStr,
        created: new Date().toISOString(),
        listId: targetListId
      };

      try {
        [
          getLevelScopedKey('practca_local_tasks', caLevel),
          getLevelScopedKey('practca_cached_cloud_tasks', caLevel)
        ].forEach(storageKeyName => {
          const raw = localStorage.getItem(storageKeyName) || '[]';
          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : [];
          const existingIndex = list.findIndex((t: any) =>
            t.id === targetId ||
            (t.taskDate === selectedDate && isMockTestTask(t) && normalizeKey(t.cleanTitle || t.title) === normalizeKey(titleToUse))
          );
          let updatedList: any[];
          if (existingIndex >= 0) {
            updatedList = [...list];
            updatedList[existingIndex] = { ...updatedList[existingIndex], ...syncedMockTaskObj };
          } else {
            updatedList = [syncedMockTaskObj, ...list];
          }
          localStorage.setItem(storageKeyName, JSON.stringify(updatedList));
        });
      } catch (err) {
        console.error('Error syncing 24h Clock Mock Test slot to Pending Tasks:', err);
      }

      try {
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
          const taskDocRef = firestoreDoc(db, 'users', auth.currentUser.uid, getFirestoreTasksCollectionName(caLevel), targetId);
          setDoc(taskDocRef, syncedMockTaskObj, { merge: true }).catch(() => {});
        }
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('practca_tasks_updated', { detail: { task: syncedMockTaskObj } }));
      window.dispatchEvent(new Event('storage'));
    }

    const nextDateObj = new Date(`${selectedDate}T12:00:00.000Z`);
    nextDateObj.setUTCDate(nextDateObj.getUTCDate() + 1);
    const nextDateStr = nextDateObj.toISOString().split('T')[0];

    const todayNewSlots: TargetClockSlot[] = [];
    const tomorrowNewSlots: TargetClockSlot[] = [];

    if (effectiveEndMinutes > 1440) {
      // Crosses midnight into next day
      const seg1Duration = Math.max(15, 1440 - effectiveStartMinutes);
      todayNewSlots.push({
        id: uniqueSlotId,
        targetId,
        title: titleToUse,
        chapterName: chapterToUse,
        subjectCode: subCode,
        relevance: rel,
        ...(isSlotMockTest ? {
          isMockTest: true,
          mockScheduledTime: examStartHHMM,
          mockSeries: mockSeriesToUse
        } : {}),
        startTime: effectiveStartTimeStr,
        endTime: '24:00',
        startMinutes: effectiveStartMinutes,
        endMinutes: 1440,
        durationMinutes: seg1Duration,
        status: isTaskCompleted ? 'completed' : 'pending'
      });

      const seg2Duration = Math.max(15, effectiveEndMinutes - 1440);
      tomorrowNewSlots.push({
        id: `${uniqueSlotId}_cont_next`,
        targetId,
        title: titleToUse,
        chapterName: chapterToUse,
        subjectCode: subCode,
        relevance: rel,
        ...(isSlotMockTest ? {
          isMockTest: true,
          mockScheduledTime: examStartHHMM,
          mockSeries: mockSeriesToUse
        } : {}),
        startTime: '00:00',
        endTime: minutesToTimeStr(seg2Duration),
        startMinutes: 0,
        endMinutes: seg2Duration,
        durationMinutes: seg2Duration,
        status: isTaskCompleted ? 'completed' : 'pending'
      });
    } else {
      todayNewSlots.push({
        id: uniqueSlotId,
        targetId,
        title: titleToUse,
        chapterName: chapterToUse,
        subjectCode: subCode,
        relevance: rel,
        ...(isSlotMockTest ? {
          isMockTest: true,
          mockScheduledTime: examStartHHMM,
          mockSeries: mockSeriesToUse
        } : {}),
        startTime: effectiveStartTimeStr,
        endTime: effectiveEndTimeStr,
        startMinutes: effectiveStartMinutes,
        endMinutes: effectiveEndMinutes,
        durationMinutes: effectiveDurationMinutes,
        status: isTaskCompleted ? 'completed' : 'pending'
      });
    }

    if (tomorrowNewSlots.length > 0) {
      try {
        const tomorrowKey = getClockSlotsStorageKey(nextDateStr, caLevel);
        const storedTomorrow = localStorage.getItem(tomorrowKey);
        const parsedTomorrow = storedTomorrow ? JSON.parse(storedTomorrow) : [];
        const filteredTomorrow = Array.isArray(parsedTomorrow)
          ? parsedTomorrow.filter((s: any) => s.id !== `${uniqueSlotId}_cont_next`)
          : [];
        const combinedTomorrow = [...tomorrowNewSlots, ...filteredTomorrow];
        const cascadedTomorrow = cascadeSlotsNoOverlap(combinedTomorrow, undefined, nextDateStr);
        localStorage.setItem(tomorrowKey, JSON.stringify(cascadedTomorrow.slots));
      } catch (e) {}
    }

    const combined = [...otherSlots, ...todayNewSlots];
    const cascadeResult = autoRipple
      ? cascadeSlotsNoOverlap(combined, uniqueSlotId, selectedDate)
      : { slots: combined.sort((a, b) => a.startMinutes - b.startMinutes) };

    syncSlotsAndAutoGenerateFlow(cascadeResult.slots, false, [], uniqueSlotId, autoRipple);
    setIsAssignModalOpen(false);
  };

  // Delete a single distinct slot by its unique `slot.id`
  const handleDeleteSingleSlot = (slotId: string) => {
    const slotToRemove = slots.find(s => s.id === slotId);
    const updated = slots.filter(s => s.id !== slotId);
    const removedNames = slotToRemove ? [slotToRemove.title] : [];

    // If this was a Mock Test slot and no other slot references the same target, remove it from Pending Tasks as well
    if (slotToRemove && (slotToRemove.isMockTest || isMockTestTask(slotToRemove))) {
      const stillReferenced = updated.some(s => s.targetId === slotToRemove.targetId || normalizeKey(s.title) === normalizeKey(slotToRemove.title));
      if (!stillReferenced) {
        try {
          [
            getLevelScopedKey('practca_local_tasks', caLevel),
            getLevelScopedKey('practca_cached_cloud_tasks', caLevel)
          ].forEach(storageKeyName => {
            const raw = localStorage.getItem(storageKeyName);
            if (!raw) return;
            const list = JSON.parse(raw);
            if (!Array.isArray(list)) return;
            const filtered = list.filter((t: any) =>
              t.id !== slotToRemove.targetId &&
              !(isMockTestTask(t) && normalizeKey(t.cleanTitle || t.title) === normalizeKey(slotToRemove.title))
            );
            localStorage.setItem(storageKeyName, JSON.stringify(filtered));
          });
          window.dispatchEvent(new Event('practca_tasks_updated'));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}
      }
    }

    syncSlotsAndAutoGenerateFlow(updated, false, removedNames);
  };

  // Quick shift a single distinct slot directly from the clock manager
  const handleQuickShiftSlot = (slotId: string, deltaMinutes: number) => {
    const slotToShift = slots.find(s => s.id === slotId);
    if (!slotToShift) return;

    const newStart = Math.max(0, Math.min(1440 - slotToShift.durationMinutes, slotToShift.startMinutes + deltaMinutes));
    const newEnd = newStart + slotToShift.durationMinutes;
    const isSlotMock = Boolean(slotToShift.isMockTest || isMockTestTask(slotToShift));
    const newExamStartHHMM = isSlotMock
      ? minutesToTimeStr((slotToShift.durationMinutes === 195 || slotToShift.durationMinutes === 255) ? (newStart + 15) % 1440 : newStart)
      : slotToShift.mockScheduledTime;

    const updatedSlot: TargetClockSlot = {
      ...slotToShift,
      startMinutes: newStart,
      endMinutes: newEnd,
      startTime: minutesToTimeStr(newStart),
      endTime: minutesToTimeStr(newEnd),
      ...(isSlotMock && newExamStartHHMM ? { mockScheduledTime: newExamStartHHMM } : {})
    };

    if (isSlotMock && newExamStartHHMM) {
      try {
        [
          getLevelScopedKey('practca_local_tasks', caLevel),
          getLevelScopedKey('practca_cached_cloud_tasks', caLevel)
        ].forEach(storageKeyName => {
          const raw = localStorage.getItem(storageKeyName);
          if (!raw) return;
          const list = JSON.parse(raw);
          if (!Array.isArray(list)) return;
          const updatedList = list.map((t: any) => {
            if (t.id === slotToShift.targetId || (isMockTestTask(t) && normalizeKey(t.cleanTitle || t.title) === normalizeKey(slotToShift.title))) {
              const updatedNotes = (t.notes || '').replace(/MockScheduledTime:\s*\d{2}:\d{2}/i, `MockScheduledTime: ${newExamStartHHMM}`);
              return {
                ...t,
                mockScheduledTime: newExamStartHHMM,
                due: `${selectedDate}T${newExamStartHHMM}:00.000Z`,
                notes: updatedNotes
              };
            }
            return t;
          });
          localStorage.setItem(storageKeyName, JSON.stringify(updatedList));
        });
        window.dispatchEvent(new Event('practca_tasks_updated'));
      } catch (e) {}
    }

    const remaining = slots.filter(s => s.id !== slotId);
    const combined = [...remaining, updatedSlot];

    const cascadeResult = cascadeSlotsNoOverlap(combined, slotId, selectedDate);
    syncSlotsAndAutoGenerateFlow(cascadeResult.slots, false, [], slotId);
  };

  // Recalculate 24-Hour Clock timings sequentially:
  // - When `isManualUserReorder` is true (user manually reordered slots): allows the user to reorder any slot across the 24h frame (including completed/past targets).
  // - When `isManualUserReorder` is false (system auto-slotting: Fit Rationale / Pack 0m Gap): checks current time, freezes completed and past/running slots, and auto-slots prospectively.
  const recalculateAndSyncSlotSequence = (
    orderedSlots: TargetClockSlot[],
    anchorStartMinutes: number,
    interSlotGaps: number[],
    feedbackMsg?: string,
    useRationaleTimelineEngine: boolean = true,
    isManualUserReorder: boolean = false
  ) => {
    if (orderedSlots.length === 0) return;

    const restrictionMark = getProspectiveRestrictionMark(
      orderedSlots,
      selectedDate,
      activeFocusTask?.title || (activeFocusTask as any)?.id
    );

    // During system auto-slotting (`!isManualUserReorder`), freeze completed and past/running slots;
    // during manual user reorder (`isManualUserReorder`), allow the user to move any slot at free will!
    const frozenSlots = isManualUserReorder
      ? []
      : orderedSlots.filter(s => {
          const sStart = Number(s.startMinutes) || 0;
          const sEnd = Number(s.endMinutes) || 0;
          return (
            s.status === 'completed' ||
            sEnd <= restrictionMark ||
            (sStart <= restrictionMark && sEnd > restrictionMark)
          );
        });
    const frozenIds = new Set(frozenSlots.map(s => String(s.id || '')));

    const prospectiveSlots = isManualUserReorder
      ? [...orderedSlots]
      : orderedSlots.filter(s => !frozenIds.has(String(s.id || '')) && s.status !== 'completed');

    if (prospectiveSlots.length === 0) {
      syncSlotsAndAutoGenerateFlow(orderedSlots, false, [], undefined, true, !isManualUserReorder);
      if (feedbackMsg) {
        setSequenceFeedback(feedbackMsg);
        setTimeout(() => setSequenceFeedback(null), 3000);
      }
      return;
    }

    const prospectiveAnchor = isManualUserReorder
      ? Math.max(0, anchorStartMinutes)
      : Math.max(restrictionMark, anchorStartMinutes);
    const fixedBusy = frozenSlots.map(s => ({
      start: Number(s.startMinutes) || 0,
      end: Number(s.endMinutes) || 0
    }));

    const rationale = analyzeUserDayRationale(selectedDate);
    const mockUpdates: { targetId: string; title: string; examStartHHMM: string }[] = [];
    let recalculatedProspective: TargetClockSlot[] = [];

    if (useRationaleTimelineEngine) {
      const fitted = fitOrderedItemsToRationaleTimeline(
        prospectiveSlots,
        rationale,
        prospectiveAnchor,
        fixedBusy,
        {
          enforceStudyBreakRule: true,
          minTransitionGap: 5,
          protectSleepWindow: true
        }
      );

      const placedList: TargetClockSlot[] = fitted.placedItems.map(({ item: slot, startMinutes: startM, endMinutes: endM, durationMinutes: actualDur, splitInfo }) => {
        const isSlotMock = Boolean(slot.isMockTest || isMockTestTask(slot));
        const newExamStartHHMM = isSlotMock
          ? minutesToTimeStr(actualDur === 195 ? (startM + 15) % 1440 : startM)
          : slot.mockScheduledTime;

        if (isSlotMock && newExamStartHHMM) {
          mockUpdates.push({
            targetId: slot.targetId,
            title: slot.title,
            examStartHHMM: newExamStartHHMM
          });
        }

        let slotId = slot.id;
        let slotTitle = slot.title;
        let slotNum = slot.slotNumber;
        let totalSlotsNum = slot.totalSlots;
        let totalTargetMins = slot.totalTargetMinutes || slot.durationMinutes;

        if (splitInfo) {
          const baseId = slot.id.replace(/_p\d+$/, '');
          slotId = `${baseId}_p${splitInfo.partNumber}`;
          const cleanTitle = (slot.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
          slotTitle = `${cleanTitle} (Part ${splitInfo.partNumber}/${splitInfo.totalParts})`;
          slotNum = splitInfo.partNumber;
          totalSlotsNum = splitInfo.totalParts;
          totalTargetMins = splitInfo.originalDurationMinutes;
        }

        return {
          ...slot,
          id: slotId,
          title: slotTitle,
          slotNumber: slotNum,
          totalSlots: totalSlotsNum,
          totalTargetMinutes: totalTargetMins,
          startMinutes: startM,
          endMinutes: endM,
          startTime: minutesToTimeStr(startM),
          endTime: minutesToTimeStr(endM),
          durationMinutes: actualDur,
          ...(isSlotMock && newExamStartHHMM ? { mockScheduledTime: newExamStartHHMM } : {})
        };
      });

      let overflowCursor = placedList.length > 0
        ? placedList[placedList.length - 1].endMinutes
        : prospectiveAnchor;
      fitted.unplacedItems.forEach(slot => {
        const gap = findRealisticGapOnClock(
          [...frozenSlots, ...placedList],
          Math.max(15, slot.durationMinutes),
          overflowCursor,
          prospectiveAnchor,
          selectedDate
        );
        const startM = gap.startMinutes;
        const endM = gap.endMinutes;
        const actualDur = Math.max(1, endM - startM);
        const isSlotMock = Boolean(slot.isMockTest || isMockTestTask(slot));
        const newExamStartHHMM = isSlotMock
          ? minutesToTimeStr(actualDur === 195 ? (startM + 15) % 1440 : startM)
          : slot.mockScheduledTime;

        if (isSlotMock && newExamStartHHMM) {
          mockUpdates.push({
            targetId: slot.targetId,
            title: slot.title,
            examStartHHMM: newExamStartHHMM
          });
        }

        placedList.push({
          ...slot,
          startMinutes: startM,
          endMinutes: endM,
          startTime: minutesToTimeStr(startM),
          endTime: minutesToTimeStr(endM),
          durationMinutes: actualDur,
          ...(isSlotMock && newExamStartHHMM ? { mockScheduledTime: newExamStartHHMM } : {})
        });
        overflowCursor = endM;
      });

      recalculatedProspective = placedList.sort((a, b) => a.startMinutes - b.startMinutes);
    }

    if (recalculatedProspective.length === 0) {
      let currentCursor = Math.max(0, Math.min(1425, prospectiveAnchor));
      recalculatedProspective = prospectiveSlots.map((slot, idx) => {
        let startM = Math.max(0, Math.min(1439, currentCursor));
        const requestedDur = Math.max(1, slot.durationMinutes);
        for (const f of frozenSlots) {
          if (Math.max(startM, f.startMinutes) < Math.min(startM + requestedDur, f.endMinutes)) {
            startM = Math.max(startM, f.endMinutes);
          }
        }
        const endM = Math.min(1440, startM + requestedDur);
        const actualDur = Math.max(1, endM - startM);

        const isSlotMock = Boolean(slot.isMockTest || isMockTestTask(slot));
        const newExamStartHHMM = isSlotMock
          ? minutesToTimeStr(actualDur === 195 ? (startM + 15) % 1440 : startM)
          : slot.mockScheduledTime;

        if (isSlotMock && newExamStartHHMM) {
          mockUpdates.push({
            targetId: slot.targetId,
            title: slot.title,
            examStartHHMM: newExamStartHHMM
          });
        }

        const gapAfter = interSlotGaps[idx] ?? 0;
        currentCursor = Math.min(1440, endM + Math.max(0, gapAfter));

        return {
          ...slot,
          startMinutes: startM,
          endMinutes: endM,
          startTime: minutesToTimeStr(startM),
          endTime: minutesToTimeStr(endM),
          durationMinutes: actualDur,
          ...(isSlotMock && newExamStartHHMM ? { mockScheduledTime: newExamStartHHMM } : {})
        };
      });
    }

    const finalSlots = [...frozenSlots, ...recalculatedProspective].sort(
      (a, b) => a.startMinutes - b.startMinutes
    );

    if (mockUpdates.length > 0) {
      try {
        [
          getLevelScopedKey('practca_local_tasks', caLevel),
          getLevelScopedKey('practca_cached_cloud_tasks', caLevel)
        ].forEach(storageKeyName => {
          const raw = localStorage.getItem(storageKeyName);
          if (!raw) return;
          const list = JSON.parse(raw);
          if (!Array.isArray(list)) return;
          const updatedList = list.map((t: any) => {
            const matchedMock = mockUpdates.find(
              m => t.id === m.targetId || (isMockTestTask(t) && normalizeKey(t.cleanTitle || t.title) === normalizeKey(m.title))
            );
            if (matchedMock) {
              const updatedNotes = (t.notes || '').replace(
                /MockScheduledTime:\s*\d{2}:\d{2}/i,
                `MockScheduledTime: ${matchedMock.examStartHHMM}`
              );
              return {
                ...t,
                mockScheduledTime: matchedMock.examStartHHMM,
                due: `${selectedDate}T${matchedMock.examStartHHMM}:00.000Z`,
                notes: updatedNotes
              };
            }
            return t;
          });
          localStorage.setItem(storageKeyName, JSON.stringify(updatedList));
        });
        window.dispatchEvent(new Event('practca_tasks_updated'));
      } catch (e) {}
    }

    syncSlotsAndAutoGenerateFlow(
      finalSlots,
      false,
      [],
      isManualUserReorder ? '__manual_reorder__' : undefined,
      true,
      !isManualUserReorder
    );

    if (feedbackMsg) {
      setSequenceFeedback(feedbackMsg);
      setTimeout(() => setSequenceFeedback(null), 3000);
    }
  };

  // Reorder slot from `fromIndex` to `toIndex` in the chronological list (User Manual Change -> allowed across full 24h frame including completed slots)
  const handleReorderSlotSequence = (fromIndex: number, toIndex: number) => {
    const sorted = [...slots].sort((a, b) => a.startMinutes - b.startMinutes);
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= sorted.length ||
      toIndex >= sorted.length
    ) {
      return;
    }

    const interSlotGaps = sorted
      .slice(0, -1)
      .map((s, idx) => Math.max(0, sorted[idx + 1].startMinutes - s.endMinutes));

    const earliestStart = sorted[0]?.startMinutes ?? 540;

    const reordered = [...sorted];
    const [movedSlot] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedSlot);

    recalculateAndSyncSlotSequence(
      reordered,
      earliestStart,
      interSlotGaps,
      `Switched #${fromIndex + 1} → #${toIndex + 1} • Schedule & Flow Synced`,
      false,
      true
    );
  };

  // Move a slot one step Up or Down in the sequence
  const handleSwapAdjacentSlot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    handleReorderSlotSequence(index, targetIndex);
  };

  // Fit all existing slots in their current sequence to the analyzed Weekday + Weekly Rationale Timeline (System Auto-Slotting -> prospective only)
  const handleFitSequenceToDayRationale = () => {
    const sorted = [...slots].sort((a, b) => a.startMinutes - b.startMinutes);
    if (sorted.length === 0) return;
    const rationale = analyzeUserDayRationale(selectedDate);
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayStr;

    const restrictionMark = getProspectiveRestrictionMark(sorted, selectedDate, activeFocusTask?.title || (activeFocusTask as any)?.id);
    const anchorStart = isToday
      ? Math.max(rationale.estimatedStudyStartMinutes, restrictionMark)
      : rationale.estimatedStudyStartMinutes;

    recalculateAndSyncSlotSequence(
      sorted,
      anchorStart,
      [],
      `Aligned to ${rationale.weekdayName.slice(0, 3)} Rationale (Start ${minutesToAmPmStr(anchorStart)} • 15m/2-3h Breaks)`,
      true,
      false
    );
  };

  // Pack all slots in their current list sequence with a uniform gap (System Auto-Slotting -> prospective only)
  const handlePackSlotSequence = (uniformGapMinutes: number = 0) => {
    const sorted = [...slots].sort((a, b) => a.startMinutes - b.startMinutes);
    if (sorted.length === 0) return;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayStr;

    const restrictionMark = getProspectiveRestrictionMark(sorted, selectedDate, activeFocusTask?.title || (activeFocusTask as any)?.id);
    const anchorStart = isToday ? restrictionMark : (sorted[0]?.startMinutes ?? 540);
    const uniformGaps = sorted.slice(0, -1).map(() => uniformGapMinutes);
    recalculateAndSyncSlotSequence(
      sorted,
      anchorStart,
      uniformGaps,
      uniformGapMinutes === 0
        ? 'Packed Back-to-Back (0m Gap) • Prospective Schedule Updated'
        : `Packed with ${uniformGapMinutes}m Breaks • Prospective Schedule Updated`,
      false,
      false
    );
  };

  // Smart Slot Splitter (System Auto-Slotting -> prospective only, preserves single Target Flow):
  // If a chapter block conflicts with a routine blockade (Meals/Sleep/Fresh Up),
  // automatically splits the chapter into two segments (Part 1 before, Part 2 after the blockade),
  // maintaining the original total study duration for the chapter and leaving past/completed slots untouched.
  const handleApplySmartSplitter = () => {
    const splitCandidate = applySmartSlotSplitter<TargetClockSlot>(slots, selectedDate, {
      activeFocusTaskId: activeFocusTask?.title || (activeFocusTask as any)?.id
    });
    const validated = ensureProspectiveSchedule<TargetClockSlot>(slots, splitCandidate, selectedDate, {
      activeFocusTaskId: activeFocusTask?.title || (activeFocusTask as any)?.id,
      autoSplitRoutineBlockades: true
    });
    syncSlotsAndAutoGenerateFlow(validated, false, [], undefined, true, true);
    setSequenceFeedback('Smart Slot Splitter: Conflicting chapters split around breaks • Single target flow preserved!');
    setTimeout(() => setSequenceFeedback(null), 3500);
  };

  // Auto-Batch feature (System Auto-Slotting -> prospective only from current time, follows existing Target Flow sequence):
  const handleAutoBatch90MinBlocks = () => {
    const restrictionMark = getProspectiveRestrictionMark(slots, selectedDate, activeFocusTask?.title || (activeFocusTask as any)?.id);

    // Freeze completed slots, past/running slots (<= restrictionMark), and manual slots during system auto-batch
    const preservedSlots = slots.filter(s => {
      const sStart = Number(s.startMinutes) || 0;
      const sEnd = Number(s.endMinutes) || 0;
      return (
        s.status === 'completed' ||
        sEnd <= restrictionMark ||
        (sStart <= restrictionMark && sEnd > restrictionMark) ||
        !String(s.id || '').startsWith('slot_autobatch_')
      );
    });
    const preservedTitles = new Set(
      preservedSlots.map(s => normalizeKey(String(s.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim()))
    );

    // Build flow order map so Auto-Batch strictly maintains the user's single flow of targets
    const flowIndexMap = new Map<string, number>();
    if (Array.isArray(flowTargets)) {
      flowTargets.forEach((ft, idx) => {
        const cleanFt = String(ft.cleanTitle || ft.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        const k = normalizeKey(cleanFt) || ft.taskId || ft.id;
        if (k && !flowIndexMap.has(k)) flowIndexMap.set(k, idx);
        if (ft.taskId && !flowIndexMap.has(ft.taskId)) flowIndexMap.set(ft.taskId, idx);
      });
    }

    const candidateTasks = [...incompleteAvailableTasks]
      .filter(t => !preservedTitles.has(normalizeKey(String(t.cleanTitle || t.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim())))
      .sort((a, b) => {
        const keyA = normalizeKey(String(a.cleanTitle || a.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim());
        const keyB = normalizeKey(String(b.cleanTitle || b.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim());
        const posA = flowIndexMap.get(keyA) ?? flowIndexMap.get(a.id) ?? 9999;
        const posB = flowIndexMap.get(keyB) ?? flowIndexMap.get(b.id) ?? 9999;
        return posA - posB;
      });

    if (candidateTasks.length === 0) {
      if (incompleteAvailableTasks.length === 0) {
        setAutoBatchFeedback('No active targets to batch');
      } else {
        setAutoBatchFeedback('All targets already slotted');
      }
      setTimeout(() => setAutoBatchFeedback(null), 2500);
      return;
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const isToday = selectedDate === todayStr;
    const isPast = selectedDate < todayStr;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (isPast) {
      setAutoBatchFeedback('Cannot auto-batch on past dates');
      setTimeout(() => setAutoBatchFeedback(null), 2500);
      return;
    }

    // Analyze historical Weekday Rationale (up to last 7 same-weekdays + recent 14d SMA, excluding empty/SMA-low days)
    const rationale = analyzeUserDayRationale(selectedDate);

    // Determine strict starting anchor:
    // - For future dates: start at the user's analyzed usual study start time on that weekday (`estimatedStudyStartMinutes`)
    // - For today: start at max(estimatedStudyStartMinutes, restrictionMark) so we never schedule in the past or over running tasks
    const currentFloorMinutes = isToday
      ? Math.max(rationale.estimatedStudyStartMinutes, restrictionMark)
      : rationale.estimatedStudyStartMinutes;

    const timeFloorStr = minutesToTimeStr(Math.min(1439, currentFloorMinutes));

    // If current time today is already past bedtime or inside night sleep window, protect sleep and alert
    if (isToday && nowMinutes >= rationale.sleepStartMinutes) {
      setAutoBatchAlertModal({
        isOpen: true,
        title: 'Sleep Time Protected: No Slots Added',
        message: `Current time (${minutesToTimeStr(nowMinutes)}) is within or past your analyzed ${rationale.weekdayName} bedtime (${rationale.sleepStartTimeStr}). Auto-batch protects your sleep window (${rationale.sleepStartTimeStr}–${rationale.sleepEndTimeStr}) and routine blocks. Please check and add targets manually if you wish to study tonight.`,
        scheduledCount: 0,
        totalCount: candidateTasks.length
      });
      setAutoBatchFeedback(`Sleep window (${rationale.sleepStartTimeStr}–${rationale.sleepEndTimeStr}) protected`);
      setTimeout(() => setAutoBatchFeedback(null), 3500);
      return;
    }

    if (currentFloorMinutes >= 1430) {
      setAutoBatchAlertModal({
        isOpen: true,
        title: 'Time Constraint: Day Complete',
        message: `No sufficient time remains today after current time (${timeFloorStr}) to add targets. Please check and add your targets manually.`,
        scheduledCount: 0,
        totalCount: candidateTasks.length
      });
      setAutoBatchFeedback('Insufficient time today');
      setTimeout(() => setAutoBatchFeedback(null), 3000);
      return;
    }

    // Group candidate tasks by clubGroupId if clubbed, or keep individual
    const clubGroups = new Map<string, any[]>();
    const unclubbedTasks: any[] = [];

    candidateTasks.forEach(task => {
      const cgId = task.clubGroupId || (task.notes || '').match(/ClubGroupId:\s*([^|\n\r]+)/i)?.[1]?.trim();
      if (cgId) {
        if (!clubGroups.has(cgId)) {
          clubGroups.set(cgId, []);
        }
        clubGroups.get(cgId)!.push(task);
      } else {
        unclubbedTasks.push(task);
      }
    });

    interface BatchSchedItem {
      id: string;
      targetId: string;
      title: string;
      chapterName: string;
      subjectCode: SubjectId;
      relevance: 'General' | 'Revision' | 'Final Revision';
      durationMinutes: number;
      tasks: any[];
    }

    const itemsToSchedule: BatchSchedItem[] = [];

    // Add clubbed batches
    let batchIdx = 1;
    clubGroups.forEach((group) => {
      const primary = group[0];
      const subCode = (primary.subjectCode || defaultLevelSub) as SubjectId;
      const rel = (primary.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision';
      const names = group.map(g => g.cleanTitle || g.title);
      const slotTitle = group.length === 1
        ? (primary.cleanTitle || primary.title)
        : `Batch ${batchIdx++} (${group.length} Ch): ${names.join(' + ')}`;
      const slotChapter = names.join(' + ');

      const parsedTotal = Number(primary.clubTotalMinutes) || 
        group.reduce((acc, g) => acc + (Number(g.targetDurationMinutes || g.targetDuration || g.duration) || 0), 0);
      const batchDuration = Math.max(15, Math.min(720, parsedTotal > 0 ? parsedTotal : 120));

      itemsToSchedule.push({
        id: `slot_autobatch_${Date.now()}_club_${primary.id || Math.random().toString(36).slice(2, 6)}`,
        targetId: primary.id || primary.title,
        title: slotTitle,
        chapterName: slotChapter,
        subjectCode: subCode,
        relevance: rel,
        durationMinutes: batchDuration,
        tasks: group
      });
    });

    // Add individual unclubbed tasks
    unclubbedTasks.forEach(task => {
      const subCode = (task.subjectCode || defaultLevelSub) as SubjectId;
      const rel = (task.relevance || 'Revision') as 'General' | 'Revision' | 'Final Revision';
      const targetDuration = Math.max(15, Math.min(480, Number(task.targetDurationMinutes || task.targetDuration || task.duration) || 90));

      itemsToSchedule.push({
        id: `slot_autobatch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        targetId: task.id || task.title,
        title: task.cleanTitle || task.title,
        chapterName: task.chapterName || task.cleanTitle || task.title,
        subjectCode: subCode,
        relevance: rel,
        durationMinutes: targetDuration,
        tasks: [task]
      });
    });

    // Collect fixed busy intervals from preserved manual/completed slots
    const fixedBusyIntervals = preservedSlots.map(s => ({
      start: s.startMinutes,
      end: s.endMinutes
    }));

    // Fit items into the Day Rationale Timeline (avoids Sleep + Routine blocks, inserts 15m break every 2-3h study)
    const { placedItems, unplacedItems } = fitOrderedItemsToRationaleTimeline(
      itemsToSchedule,
      rationale,
      currentFloorMinutes,
      fixedBusyIntervals,
      {
        enforceStudyBreakRule: true,
        minTransitionGap: 5,
        protectSleepWindow: true
      }
    );

    const newlyCreatedSlots: TargetClockSlot[] = placedItems.map(({ item, startMinutes: slotStart, endMinutes: slotEnd, durationMinutes: dur, splitInfo }) => {
      let slotId = item.id;
      let slotTitle = item.title;
      let slotNum = (item as any).slotNumber;
      let totalSlotsNum = (item as any).totalSlots;
      let totalTargetMins = (item as any).totalTargetMinutes || item.durationMinutes;

      if (splitInfo) {
        const baseId = item.id.replace(/_p\d+$/, '');
        slotId = `${baseId}_p${splitInfo.partNumber}`;
        const cleanTitle = (item.title || '').replace(/\s*\(Part\s*\d+\/\d+\)/gi, '').trim();
        slotTitle = `${cleanTitle} (Part ${splitInfo.partNumber}/${splitInfo.totalParts})`;
        slotNum = splitInfo.partNumber;
        totalSlotsNum = splitInfo.totalParts;
        totalTargetMins = splitInfo.originalDurationMinutes;
      }

      return {
        id: slotId,
        targetId: item.targetId,
        title: slotTitle,
        chapterName: item.chapterName,
        subjectCode: item.subjectCode,
        relevance: item.relevance,
        slotNumber: slotNum,
        totalSlots: totalSlotsNum,
        totalTargetMinutes: totalTargetMins,
        startTime: minutesToTimeStr(slotStart),
        endTime: minutesToTimeStr(slotEnd),
        startMinutes: slotStart,
        endMinutes: slotEnd,
        durationMinutes: dur,
        status: 'pending'
      };
    });

    const unplacedItemsCount = unplacedItems.length;

    // If no slots could be scheduled
    if (newlyCreatedSlots.length === 0) {
      setAutoBatchAlertModal({
        isOpen: true,
        title: 'Time Constraint: No Slots Added',
        message: `There is no sufficient waking time remaining on ${rationale.weekdayName} after ${timeFloorStr} to fit the targets before bedtime (${rationale.sleepStartTimeStr}). Your analyzed sleep schedule (${rationale.sleepStartTimeStr} – ${rationale.sleepEndTimeStr}) and routine blocks are preserved blank. Please check and add your targets manually.`,
        scheduledCount: 0,
        totalCount: itemsToSchedule.length
      });
      setAutoBatchFeedback('No slots fit before sleep time');
      setTimeout(() => setAutoBatchFeedback(null), 3000);
      return;
    }

    // Save scheduled slots: preserved manual/completed/past slots + newly generated batch slots (preserving single flow order)
    const finalSlots = [...preservedSlots, ...newlyCreatedSlots].sort((a, b) => a.startMinutes - b.startMinutes);
    syncSlotsAndAutoGenerateFlow(finalSlots, false, [], undefined, true, true);
    setActiveDialTab('plan');

    // Notify user of results
    if (unplacedItemsCount > 0) {
      setAutoBatchAlertModal({
        isOpen: true,
        title: 'Target Clock Time Constraint',
        message: `Added ${newlyCreatedSlots.length} of ${itemsToSchedule.length} targets starting from ${minutesToAmPmStr(newlyCreatedSlots[0].startMinutes)} based on your ${rationale.weekdayName} rationale (usual start ${minutesToAmPmStr(rationale.estimatedStudyStartMinutes)}, sleep ${rationale.sleepStartTimeStr}–${rationale.sleepEndTimeStr}, ${rationale.routineIntervals.length} routine block(s), and 15m break per 2–3h study). Please check and add remaining targets manually.`,
        scheduledCount: newlyCreatedSlots.length,
        totalCount: itemsToSchedule.length
      });
      setAutoBatchFeedback(`⚠️ ${newlyCreatedSlots.length}/${itemsToSchedule.length} slotted (${rationale.weekdayName.slice(0, 3)} rationale applied)`);
      setTimeout(() => setAutoBatchFeedback(null), 4000);
    } else {
      setAutoBatchFeedback(`✓ ${newlyCreatedSlots.length} slotted (${rationale.weekdayName.slice(0, 3)} Start ${minutesToAmPmStr(newlyCreatedSlots[0].startMinutes)} • 15m/2-3h breaks)`);
      setTimeout(() => setAutoBatchFeedback(null), 3500);
    }
  };

  // SVG Geometry Helpers
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  const totalAllocatedMinutes = useMemo(() => {
    return slots.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [slots]);
  const totalAllocatedHours = (totalAllocatedMinutes / 60).toFixed(1);
  const completedSlotsCount = useMemo(() => {
    return slots.filter(s => s.status === 'completed').length;
  }, [slots]);
  const totalEarlySavedMinutes = useMemo(() => {
    return slots.reduce((acc, s) => acc + (s.status === 'completed' && s.earlySavedMinutes ? Number(s.earlySavedMinutes) : 0), 0);
  }, [slots]);

  const handlePullUpPendingSlotsIntoFreedTime = () => {
    const res = repackPendingClockSlotsIntoFreedTime(selectedDate);
    if (res.repackedCount > 0) {
      setSequenceFeedback(`⚡ Pulled up ${res.repackedCount} pending slot(s) into freed time`);
      setTimeout(() => setSequenceFeedback(null), 3200);
    } else {
      setSequenceFeedback(`✓ Pending slots are already packed`);
      setTimeout(() => setSequenceFeedback(null), 2500);
    }
  };

  const handleToggleSlotCompletion = async (slot: TargetClockSlot) => {
    const nextCompleted = slot.status !== 'completed';
    if (onToggleTaskStatus) {
      onToggleTaskStatus(slot.targetId || slot.title);
    } else {
      await syncTaskCompletion(
        {
          id: slot.targetId,
          title: slot.title,
          cleanTitle: slot.title,
          chapterName: slot.chapterName,
          subjectCode: slot.subjectCode
        },
        nextCompleted,
        { selectedDate }
      );
    }
  };

  // Compute presentation layouts for compact or expanded viewport
  const buildSlotLayouts = (
    svgWidth: number,
    svgHeight: number,
    centerX: number,
    centerY: number,
    trackRadius: number,
    bandThickness: number,
    cardWidth: number,
    cardHeight: number,
    isModalView: boolean = false
  ) => {
    const innerRadius = trackRadius - bandThickness / 2;
    const outerRadius = trackRadius + bandThickness / 2;

    const rawItems = slots.map((s, idx) => {
      const sAngle = (s.startMinutes / 1440) * 360;
      let eAngle = (s.endMinutes / 1440) * 360;
      if (s.durationMinutes > 0 && eAngle <= sAngle) eAngle += 360;
      const midAngle = (sAngle + eAngle) / 2;
      const isRightSide = midAngle >= 0 && midAngle < 180;
      
      const arcPath = describeArc(centerX, centerY, trackRadius, sAngle, Math.max(sAngle + 1.2, eAngle));

      const startInner = polarToCartesian(centerX, centerY, innerRadius - 1, sAngle);
      const startOuter = polarToCartesian(centerX, centerY, outerRadius + 1, sAngle);
      const endInner = polarToCartesian(centerX, centerY, innerRadius - 1, eAngle);
      const endOuter = polarToCartesian(centerX, centerY, outerRadius + 1, eAngle);

      const leaderStart = polarToCartesian(centerX, centerY, outerRadius + 3, midAngle);
      const radialExtension = outerRadius + (isModalView ? 20 : 12) + (idx % 3) * (isModalView ? 12 : 8);
      const leaderBreak = polarToCartesian(centerX, centerY, radialExtension, midAngle);
      
      const elbowX = isRightSide 
        ? Math.min(svgWidth - cardWidth - 6, leaderBreak.x + (isModalView ? 16 : 10)) 
        : Math.max(cardWidth + 6, leaderBreak.x - (isModalView ? 16 : 10));
      const naturalCardY = Math.max(6, Math.min(svgHeight - cardHeight - 6, leaderBreak.y - cardHeight / 2));
      const elbowY = naturalCardY + cardHeight / 2;
      const cardX = isRightSide ? elbowX + 4 : elbowX - cardWidth - 4;

      const colorSet = SUBJECT_COLORS[s.subjectCode] || SUBJECT_COLORS.DT;
      const colorHex = idx % 2 === 1 ? colorSet.altHex : colorSet.hex;

      return {
        slot: s,
        sAngle,
        eAngle,
        midAngle,
        isRightSide,
        arcPath,
        startInner,
        startOuter,
        endInner,
        endOuter,
        leaderStart,
        leaderBreak,
        elbowX,
        elbowY,
        cardX,
        cardY: naturalCardY,
        colorHex
      };
    });

    const resolveCollisionsForSide = (items: typeof rawItems, isRight: boolean) => {
      if (items.length === 0) return;
      items.sort((a, b) => a.midAngle - b.midAngle);

      const minTopY = isModalView ? 10 : 6;
      const maxBottomY = svgHeight - cardHeight - (isModalView ? 10 : 6);
      const availableHeight = Math.max(1, maxBottomY - minTopY);
      const total = items.length;

      const defaultSpacing = cardHeight + (isModalView ? 8 : 5);

      if (total * defaultSpacing <= availableHeight) {
        for (let i = 0; i < total; i++) {
          const naturalY = items[i].leaderBreak.y - cardHeight / 2;
          items[i].cardY = Math.max(minTopY, Math.min(maxBottomY, naturalY));
        }
        for (let i = 1; i < total; i++) {
          if (items[i].cardY < items[i - 1].cardY + defaultSpacing) {
            items[i].cardY = items[i - 1].cardY + defaultSpacing;
          }
        }
        if (items[total - 1].cardY > maxBottomY) {
          items[total - 1].cardY = maxBottomY;
          for (let i = total - 2; i >= 0; i--) {
            if (items[i].cardY > items[i + 1].cardY - defaultSpacing) {
              items[i].cardY = items[i + 1].cardY - defaultSpacing;
            }
          }
        }
      } else {
        const dynamicSpacing = availableHeight / (total - 1 || 1);
        for (let i = 0; i < total; i++) {
          items[i].cardY = minTopY + i * dynamicSpacing;
        }
      }

      const fixedCardX = isRight 
        ? svgWidth - cardWidth - (isModalView ? 10 : 6)
        : (isModalView ? 10 : 6);
      const fixedElbowX = isRight ? fixedCardX - 4 : fixedCardX + cardWidth + 4;

      for (const item of items) {
        item.cardX = fixedCardX;
        item.elbowX = fixedElbowX;
        item.elbowY = item.cardY + cardHeight / 2;
        if (isRight && item.leaderBreak.x > fixedElbowX - 2) {
          item.leaderBreak.x = fixedElbowX - 2;
        } else if (!isRight && item.leaderBreak.x < fixedElbowX + 2) {
          item.leaderBreak.x = fixedElbowX + 2;
        }
      }
    };

    const rightSideItems = rawItems.filter(i => i.isRightSide);
    const leftSideItems = rawItems.filter(i => !i.isRightSide);
    resolveCollisionsForSide(rightSideItems, true);
    resolveCollisionsForSide(leftSideItems, false);

    return rawItems;
  };

  // Compact layout configuration (Main screen: 540 x 340 — matches Actuals 340px block & clock ring size)
  const compactWidth = 540;
  const compactHeight = 340;
  const compactCenterX = 270;
  const compactCenterY = 170;
  const compactTrackRadius = 105;
  const compactBandThickness = 32;
  const compactCardWidth = 132;
  const compactCardHeight = 46;

  const compactLayouts = useMemo(() => {
    return buildSlotLayouts(
      compactWidth, compactHeight, compactCenterX, compactCenterY, 
      compactTrackRadius, compactBandThickness, compactCardWidth, compactCardHeight, false
    );
  }, [slots]);

  // Expanded layout configuration (Modal: 780 x 420 — matches Expanded Actuals 420px block & clock ring size)
  const expandedWidth = 780;
  const expandedHeight = 420;
  const expandedCenterX = 390;
  const expandedCenterY = 210;
  const expandedTrackRadius = 136;
  const expandedBandThickness = 40;
  const expandedCardWidth = 205;
  const expandedCardHeight = 54;

  const expandedLayouts = useMemo(() => {
    return buildSlotLayouts(
      expandedWidth, expandedHeight, expandedCenterX, expandedCenterY, 
      expandedTrackRadius, expandedBandThickness, expandedCardWidth, expandedCardHeight, true
    );
  }, [slots]);

  // Side-by-Side Comparison layout configuration (540 x 340 — identical to Main & Actuals Compare)
  const compareWidth = 540;
  const compareHeight = 340;
  const compareCenterX = 270;
  const compareCenterY = 170;
  const compareTrackRadius = 105;
  const compareBandThickness = 32;
  const compareCardWidth = 132;
  const compareCardHeight = 46;

  const compareLayouts = useMemo(() => {
    return buildSlotLayouts(
      compareWidth, compareHeight, compareCenterX, compareCenterY,
      compareTrackRadius, compareBandThickness, compareCardWidth, compareCardHeight, false
    );
  }, [slots]);

  // Comparison metrics between Plan (Target Clock) and Actuals (Daily Balance Clock)
  const comparisonStats = useMemo(() => {
    const plannedMins = slots.reduce((acc, s) => acc + s.durationMinutes, 0);
    const actualStudyMins = balanceData?.totalStudyMinutes || 0;
    const varianceMins = actualStudyMins - plannedMins;
    const adherenceRate = plannedMins > 0 
      ? Math.round((actualStudyMins / plannedMins) * 100) 
      : (actualStudyMins > 0 ? 100 : 0);

    const validSubs: SubjectId[] = levelSubjectIds;
    const subjectBreakdown = validSubs.map(sub => {
      const subPlanned = slots
        .filter(s => s.subjectCode === sub)
        .reduce((acc, s) => acc + s.durationMinutes, 0);

      let subActual = 0;
      if (balanceData?.sessionLogs) {
        balanceData.sessionLogs.forEach(log => {
          if (log.mode === 'study' && log.subjectId === sub && log.durationSeconds) {
            subActual += Math.round(log.durationSeconds / 60);
          }
        });
      }

      const diff = subActual - subPlanned;
      const pct = subPlanned > 0 ? Math.min(100, Math.round((subActual / subPlanned) * 100)) : (subActual > 0 ? 100 : 0);

      return {
        sub,
        planned: subPlanned,
        actual: subActual,
        diff,
        pct,
        hasActivity: subPlanned > 0 || subActual > 0
      };
    }).filter(i => i.hasActivity);

    return {
      plannedMins,
      actualStudyMins,
      varianceMins,
      adherenceRate,
      subjectBreakdown
    };
  }, [slots, balanceData, levelSubjectIds]);

  // Balance Clock SVG Dial Renderer (Actuals)
  const renderBalanceDialSvg = (
    isModalView: boolean = false,
    isCompareView: boolean = false
  ) => {
    if (!balanceData) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center text-slate-500 font-mono text-xs space-y-2">
          <Clock className="h-8 w-8 text-slate-700" />
          <p>Daily Balance data is loading for this date...</p>
        </div>
      );
    }

    const C_CIRC = 238.761;
    const { clockSegments, totalStudyMinutes, displayTime: dTime } = balanceData;
    const now = dTime || new Date();
    const displayHours = now.getHours();
    const displayMinutes = now.getMinutes();
    const displaySeconds = now.getSeconds();
    const totalDisplayMinutes = displayHours * 60 + displayMinutes + displaySeconds / 60;
    const pointerAngle = (totalDisplayMinutes / 1440) * 2 * Math.PI - Math.PI / 2;
    const pointerLength = 32;
    const px2 = 50 + pointerLength * Math.cos(pointerAngle);
    const py2 = 50 + pointerLength * Math.sin(pointerAngle);

    const totalStudyHours = Math.floor(totalStudyMinutes / 60);
    const totalStudyRemainingMins = totalStudyMinutes % 60;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-between py-1">
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          <div className={`relative ${
            isCompareView 
              ? 'w-[260px] h-[260px] sm:w-[276px] sm:h-[276px]' 
              : isModalView 
                ? 'w-[300px] h-[300px] sm:w-[356px] sm:h-[356px]' 
                : 'w-[260px] h-[260px] sm:w-[276px] sm:h-[276px]'
          } flex items-center justify-center select-none shrink-0`}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Base Dial Track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#13192b"
                strokeWidth="12"
                fill="#060814"
              />
              {/* Guide circle borders */}
              <circle cx="50" cy="50" r="32" fill="none" stroke="#1e293b" strokeWidth="0.6" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#1e293b" strokeWidth="0.6" />

              {/* Hour tick marks */}
              {Array.from({ length: 24 }).map((_, hour) => {
                const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
                const isMajor = hour % 3 === 0;
                const isCardinal = hour % 6 === 0;
                const rTick = isCardinal ? 27.5 : isMajor ? 28.5 : 29.5;
                const x = 50 + rTick * Math.cos(angle);
                const y = 50 + rTick * Math.sin(angle);
                return (
                  <circle
                    key={`bal_tick_${hour}`}
                    cx={x}
                    cy={y}
                    r={isCardinal ? 0.9 : isMajor ? 0.6 : 0.4}
                    fill={isCardinal ? '#64748b' : isMajor ? '#475569' : '#334155'}
                  />
                );
              })}

              {/* Cardinal Hour Labels (12A, 6A, 12P, 6P) */}
              <text x="50" y="24" textAnchor="middle" dominantBaseline="central" className="text-[4.5px] font-mono font-bold fill-slate-400 select-none">12A</text>
              <text x="76" y="50" textAnchor="middle" dominantBaseline="central" className="text-[4.5px] font-mono font-bold fill-slate-400 select-none">6A</text>
              <text x="50" y="76" textAnchor="middle" dominantBaseline="central" className="text-[4.5px] font-mono font-bold fill-slate-400 select-none">12P</text>
              <text x="24" y="50" textAnchor="middle" dominantBaseline="central" className="text-[4.5px] font-mono font-bold fill-slate-400 select-none">6P</text>

              {/* Dynamic Arcs based on completed session segments */}
              {clockSegments.map((seg, segIdx) => {
                if (seg.length <= 0) return null;
                const arcLength = (seg.length / 1440) * C_CIRC;
                const startOffset = (seg.startMins / 1440) * C_CIRC;
                const isHovered = hoveredBalanceSegment?.type === seg.type && hoveredBalanceSegment?.timeRange === seg.displayRange;

                const handleMouseEnter = (e: React.MouseEvent) => {
                  const svgEl = e.currentTarget.closest('svg');
                  const container = svgEl?.parentElement;
                  if (container) {
                    const containerRect = container.getBoundingClientRect();
                    setHoveredBalanceSegment({
                      type: seg.type,
                      duration: seg.length,
                      timeRange: seg.displayRange,
                      color: seg.color,
                      x: e.clientX - containerRect.left,
                      y: e.clientY - containerRect.top - 15
                    });
                  }
                };

                return (
                  <motion.circle
                    key={`${seg.key}_${segIdx}`}
                    cx="50"
                    cy="50"
                    r="38"
                    stroke={seg.color}
                    strokeWidth={isHovered ? 14 : 12}
                    fill="transparent"
                    initial={{ strokeDasharray: `0 ${C_CIRC}`, opacity: 0 }}
                    animate={{ strokeDasharray: `${arcLength} ${C_CIRC}`, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    strokeDashoffset={-startOffset}
                    transform="rotate(-90 50 50)"
                    strokeLinecap="butt"
                    className="transition-all duration-150 cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseEnter}
                    onMouseLeave={() => setHoveredBalanceSegment(null)}
                  />
                );
              })}

              {/* Ticking Hand/Needle indicating current time of 24h cycle */}
              <line
                x1="50"
                y1="50"
                x2={px2}
                y2={py2}
                stroke="#00f3ff"
                strokeWidth="1.1"
                strokeLinecap="round"
                opacity="0.9"
                className="drop-shadow-[0_0_6px_rgba(0,243,255,0.8)]"
              />
              <circle
                cx={50 + 38 * Math.cos(pointerAngle)}
                cy={50 + 38 * Math.sin(pointerAngle)}
                r="1.8"
                fill="#00f3ff"
                className="drop-shadow-[0_0_6px_rgba(0,243,255,0.9)] animate-pulse"
              />
              <circle cx="50" cy="50" r="1.5" fill="#00f3ff" />
            </svg>

            {/* Clock Center Core Dial Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[7.5px] sm:text-[8.5px] font-mono font-black text-slate-400 uppercase tracking-widest">
                Actual Study
              </span>
              <p className="text-sm sm:text-base md:text-lg font-mono font-black text-white mt-0.5">
                {totalStudyHours > 0 ? `${totalStudyHours}h ${totalStudyRemainingMins}m` : `${totalStudyRemainingMins}m`}
              </p>
              <span className="text-[7.5px] text-amber-400 font-bold font-mono mt-0.5">
                {selectedDate}
              </span>
            </div>

            {/* Interactive Tooltip Overlay */}
            <AnimatePresence>
              {hoveredBalanceSegment && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ left: hoveredBalanceSegment.x, top: hoveredBalanceSegment.y }}
                  className="absolute z-50 bg-slate-950 border border-slate-800 p-2 rounded-none shadow-xl pointer-events-none text-left max-w-[160px] -translate-x-1/2 -translate-y-full font-mono"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hoveredBalanceSegment.color }} />
                    <span className="text-[9px] font-black text-white uppercase truncate">{hoveredBalanceSegment.type}</span>
                  </div>
                  <p className="text-[10px] text-slate-200 font-bold mt-0.5">{hoveredBalanceSegment.duration} mins</p>
                  <p className="text-[8.5px] text-slate-400 mt-0.5">{hoveredBalanceSegment.timeRange}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dial Category Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1.5 border-t border-slate-850/80 w-full text-[9px] font-mono shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
            <span className="text-slate-300">Study</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22d3ee] shrink-0" />
            <span className="text-slate-300">Break</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#6366f1] shrink-0" />
            <span className="text-slate-300">Sleep</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
            <span className="text-slate-300">Routine</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#475569] shrink-0" />
            <span className="text-slate-400">Idle</span>
          </div>
        </div>
      </div>
    );
  };

  // Generic SVG Dial Renderer (Plan / Target Clock)
  const renderDialSvg = (
    w: number, 
    h: number, 
    cx: number, 
    cy: number, 
    trackR: number, 
    bandW: number,
    cardW: number,
    cardH: number,
    layoutItems: ReturnType<typeof buildSlotLayouts>,
    isModalView: boolean
  ) => {
    const innerR = trackR - bandW / 2;
    const outerR = trackR + bandW / 2;

    return (
      <svg 
        viewBox={`0 0 ${w} ${h}`} 
        className="w-full h-full select-none max-h-full"
      >
        {/* Base Track */}
        <circle
          cx={cx}
          cy={cy}
          r={trackR}
          fill="none"
          stroke="#13192b"
          strokeWidth={bandW}
        />

        {/* Sharp Guide Borders */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.25"
        />
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="#1e293b"
          strokeWidth="1.25"
        />

        {/* Protected Sleep Window Arcs on 24h Ring */}
        {dayRationale.sleepIntervals.map((sInt, sIdx) => {
          if (sInt.end <= sInt.start) return null;
          const sAngle = (sInt.start / 1440) * 360;
          const eAngle = (sInt.end / 1440) * 360;
          const arcD = describeArc(cx, cy, trackR, sAngle, Math.max(sAngle + 1, eAngle));
          return (
            <path
              key={`sleep_prot_${sIdx}`}
              d={arcD}
              fill="none"
              stroke="#6366f1"
              strokeWidth={bandW - 4}
              strokeLinecap="butt"
              opacity={0.18}
            >
              <title>{`Protected Sleep Window: ${minutesToAmPmStr(sInt.start)} – ${minutesToAmPmStr(sInt.end)}`}</title>
            </path>
          );
        })}

        {/* Protected Meal (Breakfast, Lunch, Dinner) & Routine Arcs on 24h Ring */}
        {dayRationale.routineIntervals.map((rInt, rIdx) => {
          if (rInt.end <= rInt.start) return null;
          const sAngle = (rInt.start / 1440) * 360;
          const eAngle = (rInt.end / 1440) * 360;
          const arcD = describeArc(cx, cy, trackR, sAngle, Math.max(sAngle + 1, eAngle));
          const isMeal = rInt.category === 'breakfast' || rInt.category === 'lunch' || rInt.category === 'dinner';
          return (
            <path
              key={`routine_prot_${rIdx}`}
              d={arcD}
              fill="none"
              stroke={isMeal ? '#10b981' : '#14b8a6'}
              strokeWidth={bandW - 4}
              strokeDasharray="3 2"
              strokeLinecap="butt"
              opacity={0.28}
            >
              <title>{`Protected ${rInt.label}: ${minutesToAmPmStr(rInt.start)} – ${minutesToAmPmStr(rInt.end)} (${rInt.duration}m)`}</title>
            </path>
          );
        })}

        {/* 24-Hour Markers */}
        {[...Array(24)].map((_, hour) => {
          const angle = (hour / 24) * 360;
          const isMajor = hour % 3 === 0;
          const innerPt = polarToCartesian(cx, cy, isMajor ? innerR - 6 : innerR - 3, angle);
          const outerPt = polarToCartesian(cx, cy, innerR, angle);
          const labelPt = polarToCartesian(cx, cy, innerR - (isModalView ? 18 : 14), angle);

          let labelText = '';
          if (hour === 0) labelText = '12A';
          else if (hour === 3) labelText = '3A';
          else if (hour === 6) labelText = '6A';
          else if (hour === 9) labelText = '9A';
          else if (hour === 12) labelText = '12P';
          else if (hour === 15) labelText = '3P';
          else if (hour === 18) labelText = '6P';
          else if (hour === 21) labelText = '9P';

          return (
            <g key={`hour_tick_${hour}`}>
              <line
                x1={innerPt.x}
                y1={innerPt.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke={isMajor ? '#475569' : '#1e293b'}
                strokeWidth={isMajor ? 1.5 : 1}
              />
              {labelText && (
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isModalView ? "11" : "9.5"}
                  fontWeight="bold"
                  fontFamily="monospace"
                  fill="#94a3b8"
                  className="select-none"
                >
                  {labelText}
                </text>
              )}
            </g>
          );
        })}

        {/* Filled Target Slots with Distinct Colors & Sharp Radial Borders */}
        {layoutItems.map((item, itemIdx) => {
          const isHovered = hoveredSlotId === item.slot.id;
          const isLiveRunning = isStudyRunning && isSlotMatchingActiveFocusTask(item.slot);

          return (
            <g 
              key={`band_${item.slot.id}_${itemIdx}`} 
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredSlotId(item.slot.id)}
              onMouseLeave={() => setHoveredSlotId(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!isModalView) {
                  setExpandedModalTab('plan');
                  setIsExpandedModalOpen(true);
                } else {
                  handleOpenEditSlotModal(item.slot);
                }
              }}
            >
              <path
                d={item.arcPath}
                fill="none"
                stroke={isLiveRunning ? '#00f3ff' : item.colorHex}
                strokeWidth={isHovered || isLiveRunning ? bandW + 4 : bandW}
                strokeLinecap="butt"
                opacity={0.95}
                className={`transition-all duration-150 hover:brightness-125 ${isLiveRunning ? 'drop-shadow-[0_0_8px_rgba(0,243,255,0.7)] animate-pulse' : ''}`}
              />

              <line
                x1={item.startInner.x}
                y1={item.startInner.y}
                x2={item.startOuter.x}
                y2={item.startOuter.y}
                stroke="#070913"
                strokeWidth="2.5"
                strokeLinecap="butt"
              />

              <line
                x1={item.endInner.x}
                y1={item.endInner.y}
                x2={item.endOuter.x}
                y2={item.endOuter.y}
                stroke="#070913"
                strokeWidth="2.5"
                strokeLinecap="butt"
              />
            </g>
          );
        })}

        {/* Callout Cards with Full Clear Title (No Slot 1/2 Tags) */}
        {layoutItems.map((item, itemIdx) => {
          const isHovered = hoveredSlotId === item.slot.id;
          const isLiveRunning = isStudyRunning && isSlotMatchingActiveFocusTask(item.slot);

          return (
            <g 
              key={`callout_${item.slot.id}_${itemIdx}`}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredSlotId(item.slot.id)}
              onMouseLeave={() => setHoveredSlotId(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!isModalView) {
                  setExpandedModalTab('plan');
                  setIsExpandedModalOpen(true);
                } else {
                  handleOpenEditSlotModal(item.slot);
                }
              }}
            >
              <line
                x1={item.leaderStart.x}
                y1={item.leaderStart.y}
                x2={item.leaderBreak.x}
                y2={item.leaderBreak.y}
                stroke={isLiveRunning ? '#00f3ff' : item.colorHex}
                strokeWidth={isHovered || isLiveRunning ? 1.75 : 1}
                strokeDasharray={isHovered || isLiveRunning ? 'none' : '3 2'}
                opacity={isHovered || isLiveRunning ? 1 : 0.8}
              />

              <line
                x1={item.leaderBreak.x}
                y1={item.leaderBreak.y}
                x2={item.elbowX}
                y2={item.elbowY}
                stroke={isLiveRunning ? '#00f3ff' : item.colorHex}
                strokeWidth={isHovered || isLiveRunning ? 1.75 : 1}
                opacity={isHovered || isLiveRunning ? 1 : 0.8}
              />

              <circle
                cx={item.leaderStart.x}
                cy={item.leaderStart.y}
                r={isHovered || isLiveRunning ? 3 : 2}
                fill={isLiveRunning ? '#00f3ff' : item.colorHex}
                stroke="#070913"
                strokeWidth="1"
              />

              <g transform={`translate(${item.cardX}, ${item.cardY})`}>
                <rect
                  x="0"
                  y="0"
                  width={cardW}
                  height={cardH}
                  fill={isLiveRunning ? '#041724' : '#0b0f1e'}
                  stroke={isLiveRunning ? '#00f3ff' : item.colorHex}
                  strokeWidth={isHovered || isLiveRunning ? 1.75 : 1}
                  className={isLiveRunning ? 'filter drop-shadow-[0_0_6px_rgba(0,243,255,0.4)]' : ''}
                />

                <rect
                  x="0"
                  y="0"
                  width="3.5"
                  height={cardH}
                  fill={isLiveRunning ? '#00f3ff' : item.colorHex}
                />

                <foreignObject x="6" y="2.5" width={cardW - 9} height={cardH - 5}>
                  <div className="w-full h-full flex flex-col justify-between overflow-hidden text-left font-mono select-none">
                    <div
                      className={`font-extrabold text-white leading-tight break-words line-clamp-2 ${
                        isModalView ? 'text-[10.5px]' : 'text-[9px]'
                      }`}
                      title={`${item.slot.subjectCode}: ${item.slot.title}`}
                    >
                      {item.slot.status === 'completed' ? (
                        <span className="text-emerald-400 mr-1" title="Completed">✓</span>
                      ) : isLiveRunning ? (
                        <span className="text-cyan-300 mr-1 font-black animate-pulse" title="Currently Focusing Live">● LIVE</span>
                      ) : null}
                      <span style={{ color: isLiveRunning ? '#00f3ff' : item.colorHex }}>{item.slot.subjectCode}:</span> {item.slot.title}
                    </div>
                    <div
                      className={`font-bold leading-none truncate ${
                        isModalView ? 'text-[9.5px]' : 'text-[8.5px]'
                      }`}
                      style={{ color: isLiveRunning ? '#00f3ff' : item.colorHex }}
                    >
                      {formatClockTime(item.slot.startMinutes)}–{formatClockTime(item.slot.endMinutes)} ({formatStaticDuration(item.slot.durationMinutes, 'minutes')})
                    </div>
                  </div>
                </foreignObject>
              </g>
            </g>
          );
        })}

        {/* Center Hub */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={innerR - (isModalView ? 24 : 16)} 
          fill="#070a14" 
          stroke="#1e293b" 
          strokeWidth="1.5" 
          className="cursor-pointer hover:stroke-cyan-500/60 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            if (!isModalView) {
              setExpandedModalTab('plan');
              setIsExpandedModalOpen(true);
            } else {
              handleOpenAddSlotModal();
            }
          }}
        />

        <text
          x={cx}
          y={cy - (isModalView ? 14 : 10)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={isModalView ? "11" : "10"}
          fontWeight="bold"
          fontFamily="monospace"
          fill="#94a3b8"
          className="tracking-wider uppercase select-none cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!isModalView) {
              setExpandedModalTab('plan');
              setIsExpandedModalOpen(true);
            } else {
              handleOpenAddSlotModal();
            }
          }}
        >
          Daily Plan
        </text>

        <text
          x={cx}
          y={cy + (isModalView ? 10 : 8)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={isModalView ? "20" : "17"}
          fontWeight="900"
          fontFamily="monospace"
          fill="#ffffff"
          className="tracking-tight select-none cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!isModalView) {
              setExpandedModalTab('plan');
              setIsExpandedModalOpen(true);
            } else {
              handleOpenAddSlotModal();
            }
          }}
        >
          {totalAllocatedHours}h <tspan fontSize={isModalView ? "13" : "11"} fill="#64748b" fontWeight="normal">/ 24h</tspan>
        </text>
      </svg>
    );
  };

  // Hybrid 24-Hour Sequence Manager (Static Target Board status + Edit Time Frame & Delete Slot only)
  const renderSequentialSlotManager = (isCompactViewport: boolean = false, isModal: boolean = false) => {
    const orderedSlots = [...slots].sort((a, b) => a.startMinutes - b.startMinutes);

    if (orderedSlots.length === 0) {
      return (
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full flex flex-col items-center justify-center text-center p-6 font-mono rounded-2xl bg-[#070913] border border-slate-800/90"
        >
          <ListOrdered className="h-8 w-8 text-slate-600 mb-2" />
          <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">No Targets in Target Sequence</p>
        </div>
      );
    }

    const slotStatuses = orderedSlots.map((slot) => resolveTargetBoardStatusForSlot(slot));
    const completedCountInBoard = slotStatuses.filter((st) => st === 'Completed').length;

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full flex flex-col font-mono rounded-2xl overflow-hidden ${
          isModal
            ? 'bg-[#070913] border border-slate-800/80 p-4 space-y-3'
            : isCompactViewport
            ? 'h-full bg-[#070913] border border-slate-800/80 p-3'
            : 'bg-[#070913] border border-slate-800/90 p-4 space-y-3 shadow-lg'
        }`}
      >
        {/* Streamlined Target Sequence Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-800/90 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[10px] font-mono uppercase font-black text-amber-300 tracking-wider flex items-center gap-1.5 shrink-0">
              <ListOrdered className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Target Sequence ({completedCountInBoard}/{orderedSlots.length})</span>
            </span>
          </div>

          {isCompactViewport && !isModal && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setPlanViewportMode('dial')}
                className="h-7 px-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-[9.5px] font-bold text-cyan-300 transition flex items-center gap-1 cursor-pointer"
                title="Switch back to 24-Hour Target Clock Dial"
              >
                <Clock className="h-3 w-3 shrink-0" />
                <span>24h Dial</span>
              </button>
            </div>
          )}
        </div>

        {/* Ordered 1-Column Target Sequence List */}
        <div
          className={`flex-1 overflow-y-auto pr-1 space-y-2 ${
            isModal ? 'max-h-[60vh]' : isCompactViewport ? 'mt-1.5 max-h-[255px]' : 'max-h-[265px]'
          }`}
        >
          {orderedSlots.map((slot, index) => {
            const colors = SUBJECT_COLORS[slot.subjectCode] || SUBJECT_COLORS.DT;
            const boardStatus = slotStatuses[index] || 'Not started';

            return (
              <div
                key={`${slot.id || 'slot'}_${index}`}
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono border ${
                  boardStatus === 'Completed'
                    ? 'bg-slate-950/80 border-emerald-500/30'
                    : boardStatus === 'In progress'
                    ? 'bg-slate-950/90 border-amber-500/35'
                    : 'bg-slate-950/95 border-slate-800/90'
                }`}
              >
                {/* Left: Static Sequence Number Badge */}
                <div className="flex items-center shrink-0">
                  <span className="h-7 min-w-[30px] px-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-300 inline-flex items-center justify-center select-none tabular-nums">
                    #{index + 1}
                  </span>
                </div>

                {/* Middle: Subject Badge, Title & 24h Clock Window */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className={`w-11 text-center py-0.5 rounded-lg text-[9px] font-bold border shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}>
                    {slot.subjectCode}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`font-bold truncate leading-snug flex items-center gap-1.5 ${boardStatus === 'Completed' ? 'text-emerald-300' : 'text-white'}`}>
                      <span className="truncate">{slot.title}</span>
                      {slot.slotNumber && slot.totalSlots && slot.totalSlots > 1 && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/35 font-semibold shrink-0">
                          Part {slot.slotNumber}/{slot.totalSlots}
                        </span>
                      )}
                    </div>
                    <div className="text-[9.5px] text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-amber-300 font-bold tabular-nums">
                        {formatClockTime(slot.startMinutes)} – {formatClockTime(slot.endMinutes)}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300 font-semibold tabular-nums">
                        {formatStaticDuration(slot.durationMinutes, 'minutes')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Static Target Board Status Badge + Only Edit Time Frame & Delete Slot Buttons */}
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  <span
                    className={`h-7 px-2.5 rounded-xl text-[9.5px] font-bold inline-flex items-center justify-center border select-none whitespace-nowrap shrink-0 ${
                      boardStatus === 'Completed'
                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                        : boardStatus === 'In progress'
                        ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                        : 'bg-slate-900 border-slate-700/80 text-slate-400'
                    }`}
                  >
                    {boardStatus}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenEditSlotModal(slot)}
                    className="h-7 px-2.5 rounded-xl flex items-center justify-center gap-1 text-cyan-300 hover:text-white bg-slate-900 hover:bg-cyan-500/20 border border-cyan-500/35 text-[9.5px] font-bold transition cursor-pointer shrink-0"
                    title="Edit slot time frame"
                  >
                    <Edit3 className="h-3 w-3 shrink-0" />
                    <span className="hidden sm:inline">Edit Time</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSingleSlot(slot.id)}
                    className="h-7 w-7 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-300 bg-slate-900 hover:bg-rose-500/15 border border-slate-750 transition cursor-pointer shrink-0"
                    title="Delete slot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div 
      id="target-24h-clock-block" 
      className={defaultExpanded ? 'contents' : 'bg-[#0c0f1c] border border-slate-800 p-4 sm:p-5 shadow-2xl text-left relative overflow-hidden rounded-3xl h-full flex flex-col justify-between gap-5'}
    >
      {!defaultExpanded && (
        <>
          {/* Top Deck (Header + Action Buttons): Exactly 164px on lg (+ 20px top padding = 184px) to align with Target Slot bottom line */}
          <div className="flex flex-col justify-between gap-3 lg:h-[164px] lg:min-h-[164px] lg:max-h-[164px] shrink-0">
            {/* Row 1: Complete & Clearly Visible Header Title (Static Height Across Both Modes) */}
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2.5 lg:h-[52px] shrink-0">
              <div className={`w-7 h-7 rounded-lg ${activeDialTab === 'plan' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'} border flex items-center justify-center shrink-0`}>
                {activeDialTab === 'plan' ? <Clock className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-mono leading-snug truncate">
                  {activeDialTab === 'plan' ? '24-Hour Target Clock — Daily Plan' : '24-Hour Daily Balance Clock — Actuals'}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-normal truncate">
                  {activeDialTab === 'plan'
                    ? `${slots.length} scheduled slot${slots.length === 1 ? '' : 's'} (${completedSlotsCount} done) • ${totalAllocatedHours} hrs planned for ${selectedDate}`
                    : `${comparisonStats.actualStudyMins}m studied • ${balanceData?.clockSegments?.length || 0} active intervals for ${selectedDate}`}
                </p>
              </div>
            </div>

            {/* Row 2: Structured 2-Row Action & Mode Control Deck (Deterministic 96px height so buttons never misalign) */}
            <div className="bg-slate-950/90 border border-slate-850 rounded-2xl p-2.5 flex flex-col justify-between gap-2 lg:h-[96px] shrink-0">
              {/* Tier 1: Mode Switcher (Left) + Compare & Expand (Right) */}
              <div className="flex items-center justify-between gap-2 h-8">
                <div className="grid grid-cols-2 bg-slate-900 p-0.5 rounded-lg border border-slate-800 h-8">
                  <button
                    type="button"
                    onClick={() => setActiveDialTab('plan')}
                    className={`h-full px-3 text-[10px] font-mono font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      activeDialTab === 'plan' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>Plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDialTab('actuals')}
                    className={`h-full px-3 text-[10px] font-mono font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      activeDialTab === 'actuals' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Activity className="h-3 w-3 shrink-0" />
                    <span>Actuals</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 h-8">
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedModalTab('compare');
                      setIsExpandedModalOpen(true);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-[10px] font-mono transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <GitCompare className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span>Compare</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExpandedModalTab(activeDialTab === 'actuals' ? 'actuals' : 'plan');
                      setIsExpandedModalOpen(true);
                    }}
                    className="h-8 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 hover:text-white font-bold text-[10px] font-mono transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <Maximize2 className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span>Expand</span>
                  </button>
                </div>
              </div>

              {/* Tier 2: Primary Action Buttons (Plan vs Actuals) */}
              {activeDialTab === 'actuals' ? (
                <div className="grid grid-cols-2 gap-1.5 h-8">
                  <button
                    type="button"
                    onClick={handleTriggerAddLog}
                    className="h-8 px-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-black text-[10px] font-mono transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                    title="Record a study, break, sleep, or routine session log for the selected time frame"
                  >
                    <Plus className="h-3 w-3 stroke-[3] shrink-0" />
                    <span className="truncate">Add Log</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerLogMockTest}
                    className="h-8 px-2 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-[10px] font-mono transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                    title="Directly log a study session of mock exam based on the time frame selected by user"
                  >
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="truncate">Log Mock Test</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1 h-8">
                  <button
                    type="button"
                    onClick={handleAutoBatch90MinBlocks}
                    className="h-8 px-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[9.5px] font-mono transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    title="Auto-Batch active targets/batches into the 24-hour target clock strictly after current time"
                  >
                    <Zap className="h-3 w-3 shrink-0" />
                    <span className="truncate">{autoBatchFeedback || 'Auto-Batch'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplySmartSplitter}
                    className="h-8 px-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 hover:text-white font-black text-[9.5px] font-mono transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    title="Smart Slot Splitter: Automatically split chapters conflicting with routine blockades into Part 1 & Part 2 preserving total duration"
                  >
                    <Layers className="h-3 w-3 shrink-0 text-purple-400" />
                    <span className="truncate">Smart Split</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAddSlotModal()}
                    className="h-8 px-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[9.5px] font-mono transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                    title="Add a custom or planned target slot to the 24-hour clock"
                  >
                    <Plus className="h-3 w-3 stroke-[3] shrink-0" />
                    <span className="truncate">+ Slot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAddSlotModal(undefined, true)}
                    className="h-8 px-1.5 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-[9.5px] font-mono transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-xs"
                    title="Quick-add official ICAI Mock Test Slot (3h standard, 4h IBS)"
                  >
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="truncate">+ Mock</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Main Clock Dial Viewport — Fixed Static 340px Measurement Across Both Plan & Actuals */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
              setExpandedModalTab(activeDialTab === 'actuals' ? 'actuals' : 'plan');
              setIsExpandedModalOpen(true);
            }}
            className={`w-full h-[340px] min-h-[340px] max-h-[340px] relative flex items-center justify-center bg-[#070913] border ${
              activeDialTab === 'plan' ? 'border-slate-850/80 hover:border-cyan-500/40' : 'border-slate-850/80 hover:border-amber-500/40'
            } p-2 rounded-2xl overflow-hidden cursor-pointer transition-colors shrink-0`}
          >
            {activeDialTab === 'plan' ? (
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Floating Toggle Button to open the Target Sequence Modal */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSequenceListModalOpen(true);
                  }}
                  className="absolute top-1.5 right-1.5 z-20 h-7 px-2.5 rounded-lg bg-slate-900/95 hover:bg-amber-950/90 border border-amber-500/40 text-amber-300 hover:text-white text-[9.5px] font-mono font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  title="Open Target Sequence pop-up to view, reorder, and run scheduled targets"
                >
                  <ListOrdered className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Target Sequence ({slots.length})</span>
                </button>
                { sequenceFeedback && (
                  <div className="absolute top-1.5 left-1.5 z-20 px-2 py-1 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold shadow-md">
                    {sequenceFeedback}
                  </div>
                )}
                {renderDialSvg(
                  compactWidth, compactHeight, compactCenterX, compactCenterY,
                  compactTrackRadius, compactBandThickness, compactCardWidth, compactCardHeight,
                  compactLayouts, false
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                {renderBalanceDialSvg(false, false)}
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= EXPANDED VIEW MODAL (Side-by-Side Comparison / Plan / Actuals) ================= */}
      <AnimatePresence>
        {isExpandedModalOpen && (
          <ModalPortal triggerKey={expandedModalTab}>
          <div 
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseExpandedModal();
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-[#0c0f1c] border border-cyan-500/40 rounded-3xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl relative space-y-4 text-left my-auto max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header Row 1: Complete Title & Close Button */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-black text-white font-mono uppercase tracking-wider leading-snug break-words">
                      {expandedModalTab === 'compare'
                        ? '24-Hour Clock Hub — Side-by-Side Comparison'
                        : expandedModalTab === 'plan'
                          ? '24-Hour Target Clock — Expanded Daily Plan'
                          : '24-Hour Daily Balance Clock — Expanded Actuals'}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5">
                      {expandedModalTab === 'compare' 
                        ? `Comparing Plan (${slots.length} slots, ${totalAllocatedHours} hrs) vs Actuals (${comparisonStats.actualStudyMins}m studied) for ${selectedDate}`
                        : expandedModalTab === 'plan'
                          ? `${slots.length} distinct slots scheduled • ${totalAllocatedHours} hrs total for ${selectedDate}`
                          : `${comparisonStats.actualStudyMins}m studied • ${selectedDate}`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseExpandedModal}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer shrink-0"
                  title="Close 24-Hour Clock"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Header Row 2: Static Control Bar (Tabs + Mode-Specific Action Buttons) */}
              <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-950 border border-slate-850 p-1.5 rounded-2xl">
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setExpandedModalTab('compare')}
                    className={`h-8 px-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      expandedModalTab === 'compare'
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <GitCompare className="h-3.5 w-3.5 shrink-0" />
                    <span>Compare Side-by-Side</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedModalTab('plan')}
                    className={`h-8 px-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      expandedModalTab === 'plan'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>Plan (Target)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedModalTab('actuals')}
                    className={`h-8 px-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      expandedModalTab === 'actuals'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5 shrink-0" />
                    <span>Actuals (Balance)</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {expandedModalTab === 'actuals' ? (
                    <>
                      <button
                        type="button"
                        onClick={handleTriggerAddLog}
                        className="h-8 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs font-mono transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                        title="Record a study, break, sleep, or routine session log for the selected time frame"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[3] shrink-0" />
                        <span>Add Log</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerLogMockTest}
                        className="h-8 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs font-mono transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                        title="Directly log a study session of mock exam based on the time frame selected by user"
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>Log Mock Test</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleAutoBatch90MinBlocks}
                        className="h-8 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        title="Auto-Batch active targets/batches into the 24-hour target clock strictly after current time"
                      >
                        <Zap className="h-3.5 w-3.5 shrink-0" />
                        <span>{autoBatchFeedback || 'Auto-Batch'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAddSlotModal()}
                        className="h-8 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="h-3.5 w-3.5 stroke-[3] shrink-0" />
                        <span>+ Add Slot</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAddSlotModal(undefined, true)}
                        className="h-8 px-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-xs font-mono transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                        title="Quick-add official ICAI Mock Test Slot (3h standard, 4h IBS)"
                      >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>+ Mock Test</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ================= TAB 1: SIDE-BY-SIDE COMPARISON VIEW ================= */}
              {expandedModalTab === 'compare' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Column: Plan Dial */}
                    <div className="bg-[#070913] border border-cyan-500/30 p-3 sm:p-4 rounded-2xl space-y-2 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                          <h4 className="text-xs font-black text-cyan-300 uppercase font-mono tracking-wider">
                            Plan • 24-Hour Target Clock
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {slots.length} slots • {Math.floor(comparisonStats.plannedMins / 60)}h {comparisonStats.plannedMins % 60}m
                        </span>
                      </div>
                      <div className="w-full h-[340px] min-h-[340px] max-h-[340px] relative flex items-center justify-center">
                        {renderDialSvg(
                          compareWidth, compareHeight, compareCenterX, compareCenterY,
                          compareTrackRadius, compareBandThickness, compareCardWidth, compareCardHeight,
                          compareLayouts, false
                        )}
                      </div>
                    </div>

                    {/* Right Column: Actuals Dial */}
                    <div className="bg-[#070913] border border-amber-500/30 p-3 sm:p-4 rounded-2xl space-y-2 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                          <h4 className="text-xs font-black text-amber-300 uppercase font-mono tracking-wider">
                            Actuals • 24-Hour Daily Balance Clock
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {Math.floor(comparisonStats.actualStudyMins / 60)}h {comparisonStats.actualStudyMins % 60}m studied
                        </span>
                      </div>
                      <div className="w-full h-[340px] min-h-[340px] max-h-[340px] relative flex items-center justify-center">
                        {renderBalanceDialSvg(false, true)}
                      </div>
                    </div>
                  </div>

                  {/* Comparison Summary KPIs Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-left space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Planned Study</span>
                      <p className="text-lg font-mono font-black text-cyan-400">
                        {Math.floor(comparisonStats.plannedMins / 60)}h {comparisonStats.plannedMins % 60}m
                      </p>
                      <span className="text-[8.5px] font-mono text-slate-500 block">{comparisonStats.plannedMins} mins total</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-left space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Actual Study</span>
                      <p className="text-lg font-mono font-black text-amber-400">
                        {Math.floor(comparisonStats.actualStudyMins / 60)}h {comparisonStats.actualStudyMins % 60}m
                      </p>
                      <span className="text-[8.5px] font-mono text-slate-500 block">{comparisonStats.actualStudyMins} mins total</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-left space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Plan Variance</span>
                      <p className={`text-lg font-mono font-black ${comparisonStats.varianceMins >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {comparisonStats.varianceMins >= 0 ? `+${comparisonStats.varianceMins}m` : `${comparisonStats.varianceMins}m`}
                      </p>
                      <span className="text-[8.5px] font-mono text-slate-500 block">
                        {comparisonStats.varianceMins >= 0 ? 'Ahead / Target Met' : 'Behind Schedule'}
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl text-left space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Plan Adherence</span>
                      <p className="text-lg font-mono font-black text-indigo-400">
                        {comparisonStats.adherenceRate}%
                      </p>
                      <div className="w-full bg-slate-900 h-1.5 mt-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, comparisonStats.adherenceRate)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Breakdown: Planned vs Actuals */}
                  {comparisonStats.subjectBreakdown.length > 0 && (
                    <div className="bg-[#070913] border border-slate-850 p-3.5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-mono uppercase font-black text-slate-300 tracking-wider flex items-center gap-1.5">
                          <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                          Subject Breakdown • Plan vs Actuals Comparison
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {comparisonStats.subjectBreakdown.length} active subjects
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                        {comparisonStats.subjectBreakdown.map((item) => {
                          const colors = SUBJECT_COLORS[item.sub as SubjectId] || SUBJECT_COLORS.DT;
                          return (
                            <div 
                              key={item.sub}
                              className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl space-y-1.5 text-xs font-mono"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                                  {item.sub}
                                </span>
                                <span className={`text-[9.5px] font-bold ${item.diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {item.diff >= 0 ? `+${item.diff}m` : `${item.diff}m`} ({item.pct}%)
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>Plan: <strong className="text-slate-200">{item.planned}m</strong></span>
                                <span>Actual: <strong className="text-amber-300">{item.actual}m</strong></span>
                              </div>
                              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full transition-all duration-300"
                                  style={{ 
                                    width: `${Math.min(100, item.pct)}%`,
                                    backgroundColor: colors.hex 
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: EXPANDED PLAN (TARGET CLOCK) ================= */}
              {expandedModalTab === 'plan' && (
                <div className="space-y-4">
                  {/* Large Presentation Clock View — Static 420px Height Matching Expanded Actuals */}
                  <div className="w-full h-[420px] min-h-[420px] max-h-[420px] bg-[#070913] border border-slate-850 p-3 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {renderDialSvg(
                        expandedWidth, expandedHeight, expandedCenterX, expandedCenterY,
                        expandedTrackRadius, expandedBandThickness, expandedCardWidth, expandedCardHeight,
                        expandedLayouts, true
                      )}
                    </div>
                  </div>

                  {/* DAILY PLAN SEQUENTIAL TIMELINE */}
                  {renderSequentialSlotManager(false)}
                </div>
              )}

              {/* ================= TAB 3: EXPANDED ACTUALS (DAILY BALANCE CLOCK) ================= */}
              {expandedModalTab === 'actuals' && (
                <div className="space-y-4">
                  <div className="w-full h-[420px] min-h-[420px] max-h-[420px] bg-[#070913] border border-slate-850 p-3 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center relative">
                      {renderBalanceDialSvg(true, false)}
                    </div>
                  </div>

                  {balanceData && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      <div className="bg-slate-950 border border-amber-500/30 p-3 rounded-2xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Study Time</span>
                        <p className="text-base font-mono font-black text-amber-400">
                          {Math.floor(balanceData.dayMinutesSummary.study / 60)}h {balanceData.dayMinutesSummary.study % 60}m
                        </p>
                        <span className="text-[8.5px] font-mono text-slate-500 block">{balanceData.dayMinutesSummary.study}m</span>
                      </div>

                      <div className="bg-slate-950 border border-cyan-500/30 p-3 rounded-2xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Break Time</span>
                        <p className="text-base font-mono font-black text-cyan-400">
                          {Math.floor(balanceData.dayMinutesSummary.break / 60)}h {balanceData.dayMinutesSummary.break % 60}m
                        </p>
                        <span className="text-[8.5px] font-mono text-slate-500 block">{balanceData.dayMinutesSummary.break}m</span>
                      </div>

                      <div className="bg-slate-950 border border-emerald-500/30 p-3 rounded-2xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Routines</span>
                        <p className="text-base font-mono font-black text-emerald-400">
                          {Math.floor(balanceData.dayMinutesSummary.routine / 60)}h {balanceData.dayMinutesSummary.routine % 60}m
                        </p>
                        <span className="text-[8.5px] font-mono text-slate-500 block">{balanceData.dayMinutesSummary.routine}m</span>
                      </div>

                      <div className="bg-slate-950 border border-indigo-500/30 p-3 rounded-2xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Sleep Time</span>
                        <p className="text-base font-mono font-black text-indigo-400">
                          {Math.floor(balanceData.dayMinutesSummary.sleep / 60)}h {balanceData.dayMinutesSummary.sleep % 60}m
                        </p>
                        <span className="text-[8.5px] font-mono text-slate-500 block">{balanceData.dayMinutesSummary.sleep}m</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-700/40 p-3 rounded-2xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Idle Time</span>
                        <p className="text-base font-mono font-black text-slate-400">
                          {Math.floor(balanceData.dayMinutesSummary.idle / 60)}h {balanceData.dayMinutesSummary.idle % 60}m
                        </p>
                        <span className="text-[8.5px] font-mono text-slate-500 block">{balanceData.dayMinutesSummary.idle}m</span>
                      </div>
                    </div>
                  )}

                  {balanceData?.sessionLogs && balanceData.sessionLogs.length > 0 && (
                    <div className="bg-[#070913] border border-slate-850 p-3.5 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[10px] font-mono uppercase font-black text-slate-300 tracking-wider flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-amber-400" />
                          Logged Sessions for {selectedDate}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {balanceData.sessionLogs.length} session entries • Double-click to edit
                        </span>
                      </div>
                      <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
                        {balanceData.sessionLogs.map((log: any, idx: number) => (
                          <div 
                            key={`${log.id || 'log'}_${idx}`}
                            onDoubleClick={() => {
                              window.dispatchEvent(new CustomEvent('practca_open_edit_pomo_log', { detail: { log } }));
                            }}
                            title="Double-click to edit log timings or details"
                            className="bg-slate-950 hover:bg-slate-900/90 border border-slate-850 hover:border-amber-500/40 p-2 rounded-xl flex items-center justify-between text-xs font-mono gap-2 cursor-pointer transition-colors select-none"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                log.mode === 'study' ? 'bg-[#f59e0b]' :
                                log.mode === 'break' ? 'bg-[#22d3ee]' :
                                log.mode === 'sleep' ? 'bg-[#6366f1]' :
                                log.mode === 'routine' ? 'bg-[#10b981]' : 'bg-[#475569]'
                              }`} />
                              <span className="text-white font-bold break-words">
                                {log.notes || (log.mode ? log.mode.toUpperCase() : 'Focus Session')}
                              </span>
                              {log.subjectId && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 border border-slate-750 text-slate-300 shrink-0">
                                  {log.subjectId}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 shrink-0">
                              <span>{log.startTime || '--:--'} – {log.endTime || '--:--'}</span>
                              <span className="text-amber-300 font-bold">
                                {log.durationSeconds ? Math.round(log.durationSeconds / 60) : 0}m
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.dispatchEvent(new CustomEvent('practca_open_edit_pomo_log', { detail: { log } }));
                                }}
                                title="Edit Log"
                                className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-950/30 border border-transparent hover:border-amber-500/40 transition-colors cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.dispatchEvent(new CustomEvent('practca_delete_pomo_log', { detail: { log } }));
                                }}
                                title="Delete Log"
                                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-500/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-3 gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCloseExpandedModal}
                  className="h-8 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl border border-slate-700 font-bold transition cursor-pointer"
                >
                  Close 24-Hour Clock
                </button>
              </div>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ================= SEQUENCE LIST POP-UP MODAL ================= */}
      <AnimatePresence>
        {isSequenceListModalOpen && (
          <ModalPortal triggerKey="clock-sequence-list-modal">
            <div 
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsSequenceListModalOpen(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-[#0c0f1c] border border-cyan-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative space-y-4 text-left my-auto max-h-[92vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 shrink-0">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ListOrdered className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-white font-mono uppercase tracking-wider leading-snug">
                          Target Sequence
                        </h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5">
                        Scheduled target sequence for {selectedDate}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSequenceListModalOpen(false)}
                    className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                    title="Close Sequence List Pop-up"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Pop-up Body: Full Sequence List */}
                <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                  {renderSequentialSlotManager(false, true)}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end border-t border-slate-800/90 pt-3 text-[10px] font-mono shrink-0">
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsSequenceListModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 hover:text-white font-bold font-mono transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* ================= ADD / EDIT SINGLE DISTINCT TIME SLOT MODAL ================= */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <ModalPortal triggerKey={editingSlotId || 'new'}>
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[150] flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-[#0c0f1c] border border-cyan-500/40 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative space-y-4 text-left my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-white font-mono uppercase tracking-wider leading-snug break-words">
                      {editingSlotId ? 'Edit Slot Time Frame' : 'Add Time Slot — 24h Target Clock'}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSlot} className="space-y-4">
                {editingSlotId ? (
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between gap-2.5 text-xs font-mono">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold border shrink-0 ${(SUBJECT_COLORS[customSubject] || SUBJECT_COLORS.DT).bg} ${(SUBJECT_COLORS[customSubject] || SUBJECT_COLORS.DT).text} ${(SUBJECT_COLORS[customSubject] || SUBJECT_COLORS.DT).border}`}>
                        {selectedTaskObj?.subjectCode || customSubject}
                      </span>
                      <span className="font-bold text-white truncate">
                        {selectedTaskObj ? (selectedTaskObj.cleanTitle || selectedTaskObj.title) : customTargetTitle}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Select Incomplete Available Target (or Custom Target) when adding a new slot */
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-black text-slate-300 tracking-wider block">
                      Select Target (Pending or Completed)
                    </label>
                    {selectableModalTasks.length > 0 && (
                      <select
                        value={selectedTargetId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setSelectedTargetId(newId);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 cursor-pointer"
                      >
                        {selectableModalTasks.map((t, idx) => (
                          <option key={`${t.id || t.title || 'task'}_${idx}`} value={t.id || t.title} className="bg-slate-950 text-slate-200">
                            [{t.subjectCode || 'AFM'}] {t.cleanTitle || t.title}{t._isCompletedTarget ? ' [✓ Done]' : ''}
                          </option>
                        ))}
                        <option value="__custom__" className="bg-slate-950 text-cyan-300 font-bold">
                          + Enter Custom Target Name...
                        </option>
                      </select>
                    )}

                    {(selectableModalTasks.length === 0 || selectedTargetId === '__custom__') && (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          list="custom-target-chapters-list"
                          placeholder="Enter target / chapter name"
                          value={customTargetTitle}
                          onChange={(e) => setCustomTargetTitle(e.target.value)}
                          required
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                        />
                        <datalist id="custom-target-chapters-list">
                          {(SUBJECT_CHAPTERS[customSubject] || []).map((ch) => (
                            <option key={ch} value={ch} />
                          ))}
                        </datalist>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">Subject:</span>
                          <select
                            value={customSubject}
                            onChange={(e) => {
                              const newSub = e.target.value as SubjectId;
                              setCustomSubject(newSub);
                              if (isMockSlotMode || (selectedTargetId === '__custom__' && /mock\s*test/i.test(customTargetTitle))) {
                                const neededDuration = newSub === 'IBS' ? 240 : 180;
                                const newEndM = Math.min(1440, slotStartMinutes + neededDuration);
                                setSlotEndMinutes(newEndM);
                                setSlotEndTime(minutesToTimeStr(newEndM % 1440));
                                setSlotDurationMinutes(Math.max(15, newEndM - slotStartMinutes));
                                if (!customTargetTitle || /icai mock test paper/i.test(customTargetTitle)) {
                                  setCustomTargetTitle(newSub === 'IBS' ? 'ICAI Mock Test Paper (4-Hour IBS Simulation)' : 'ICAI Mock Test Paper (3-Hour Exam Simulation)');
                                }
                              }
                            }}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-mono text-slate-300"
                          >
                            {levelSubjectIds.map(sub => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Single Distinct Time Slot Configuration */}
                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-cyan-400 font-bold uppercase tracking-wider">
                      Slot Boundary & Duration
                    </span>
                    <span className="text-amber-300 font-bold">
                      {slotDurationMinutes}m ({Math.floor(slotDurationMinutes / 60)}h {slotDurationMinutes % 60}m)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] text-slate-400 block">Start Time</span>
                      <AttractiveTimePicker
                        value={slotStartTime}
                        onChange={(val) => handleUpdateSlotTime('startTime', val)}
                        accentColor="cyan"
                        size="sm"
                        className="w-full"
                      />
                    </div>
                    <span className="text-slate-500 text-xs mt-4">to</span>
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] text-slate-400 block">End Time</span>
                      <AttractiveTimePicker
                        value={slotEndTime}
                        onChange={(val) => handleUpdateSlotTime('endTime', val)}
                        accentColor="cyan"
                        size="sm"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Quick Duration & Shift Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 mr-1">Duration:</span>
                      {[30, 45, 60, 90, 120, 180].map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleSetModalSlotDuration(d)}
                          className={`px-1.5 py-0.5 border transition cursor-pointer ${
                            slotDurationMinutes === d
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800'
                          }`}
                        >
                          {d}m
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 mr-1">Shift:</span>
                      <button
                        type="button"
                        onClick={() => handleShiftModalSlot(-15)}
                        className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 cursor-pointer"
                      >
                        -15m
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShiftModalSlot(15)}
                        className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 cursor-pointer"
                      >
                        +15m
                      </button>
                    </div>
                  </div>

                  {/* Standard ICAI Exam Slot Preset (3h standard, 4h IBS) */}
                  <div className="flex items-center justify-between p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-[10px]">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>ICAI Exam Preset: 2:00 PM – {customSubject === 'IBS' ? '6:00 PM (4 Hours)' : '5:00 PM (3 Hours)'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMockSlotMode(true);
                        const isIBS = customSubject === 'IBS';
                        const dur = isIBS ? 240 : 180;
                        setSlotStartTime('14:00');
                        setSlotEndTime(isIBS ? '18:00' : '17:00');
                        setSlotStartMinutes(840);
                        setSlotEndMinutes(840 + dur);
                        setSlotDurationMinutes(dur);
                        if (!customTargetTitle || selectedTargetId === '__custom__') {
                          setCustomTargetTitle(isIBS ? 'ICAI Mock Test Paper (4-Hour IBS Simulation)' : 'ICAI Mock Test Paper (3-Hour Exam Simulation)');
                        }
                      }}
                      className="px-2 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded cursor-pointer transition text-[9px] uppercase tracking-wider"
                    >
                      Apply {customSubject === 'IBS' ? '2-6 PM' : '2-5 PM'}
                    </button>
                  </div>
                </div>

                {/* Overlap & Ripple Setting */}
                <div className="p-3 bg-slate-950/80 border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-bold">
                      <input
                        type="checkbox"
                        checked={autoRipple}
                        onChange={(e) => setAutoRipple(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 cursor-pointer"
                      />
                      <span>Auto-adjust subsequent slots to prevent overlap</span>
                    </label>
                  </div>

                  {conflictingSlots.length > 0 && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>Overlaps with {conflictingSlots.length} existing slot(s):</span>
                      </div>
                      <p className="text-[9.5px] text-amber-200/80 leading-relaxed">
                        {conflictingSlots.map(c => `[${c.subjectCode}] ${c.title} (${c.startTime}–${c.endTime})`).join(', ')}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const gap = findNextAvailableGap(otherSlots, slotDurationMinutes, slotStartMinutes);
                          setSlotStartMinutes(gap.startMinutes);
                          setSlotEndMinutes(gap.endMinutes);
                          setSlotStartTime(minutesToTimeStr(gap.startMinutes));
                          setSlotEndTime(minutesToTimeStr(gap.endMinutes));
                        }}
                        className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[9px] font-bold cursor-pointer"
                      >
                        Snap to Next Free Gap
                      </button>
                    </div>
                  )}
                </div>

                {/* Consolidated Target Duration Summary */}
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-[10px] font-mono text-cyan-300 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-400 block text-[9px]">THIS SLOT DURATION:</span>
                    <strong className="text-sm font-bold text-white">
                      {Math.floor(slotDurationMinutes / 60)}h {slotDurationMinutes % 60}m ({slotDurationMinutes}m)
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px]">CONSOLIDATED IN TARGET BOARD:</span>
                    <strong className="text-sm font-bold text-emerald-400">
                      {Math.floor(consolidatedTargetMinutesPreview / 60)}h {consolidatedTargetMinutesPreview % 60}m ({consolidatedTargetMinutesPreview}m)
                    </strong>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  {editingSlotId && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteSingleSlot(editingSlotId);
                        setIsAssignModalOpen(false);
                      }}
                      className="h-9 px-3 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1"
                      title="Delete this slot"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Slot</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="flex-1 h-9 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 h-9 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black font-mono transition cursor-pointer text-center"
                  >
                    {editingSlotId ? 'Update Time Frame' : 'Add Slot to 24h Clock'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
          </ModalPortal>
        )}
      </AnimatePresence>

      {/* Time Constraint Pop-up Notification Modal */}
      <AnimatePresence>
        {autoBatchAlertModal?.isOpen && (
          <ModalPortal triggerKey="autobatch_alert">
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[160] flex items-center justify-center p-4 select-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0c1020] border-2 border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative space-y-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-black text-white font-mono uppercase tracking-wider">
                      {autoBatchAlertModal.title}
                    </h3>
                    <p className="text-xs text-amber-300/90 font-mono mt-0.5">
                      24-Hour Target Clock Schedule Notice
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 font-sans leading-relaxed">
                  {autoBatchAlertModal.message}
                </div>

                {autoBatchAlertModal.scheduledCount > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-mono px-1 text-slate-400">
                    <span>Scheduled after current time:</span>
                    <span className="font-bold text-emerald-400">
                      {autoBatchAlertModal.scheduledCount} / {autoBatchAlertModal.totalCount} targets
                    </span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setAutoBatchAlertModal(null)}
                    className="h-9 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono rounded-lg transition cursor-pointer"
                  >
                    Understood
                  </button>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
}
