import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Target, ExternalLink, Play, Pause, Check, 
  AlertTriangle, CheckCircle2, X, GripVertical, PictureInPicture2, Coffee, Flame, Zap
} from 'lucide-react';
import { normalizeKey, syncTargetDurationAcrossSystem } from '../utils/taskCompletionSync';
import { playNotificationChime } from '../utils/audioAlarm';

const PIP_POSITION_STORAGE_KEY = 'practca_study_pip_position';
const PIP_CARD_WIDTH = 350;
const PIP_CARD_HEIGHT = 215;
const VIEWPORT_MARGIN = 12;

interface PipPosition {
  x: number;
  y: number;
}

const clampPositionToViewport = (pos: PipPosition): PipPosition => {
  if (typeof window === 'undefined') return pos;
  const maxX = Math.max(VIEWPORT_MARGIN, window.innerWidth - PIP_CARD_WIDTH - VIEWPORT_MARGIN);
  const maxY = Math.max(VIEWPORT_MARGIN, window.innerHeight - PIP_CARD_HEIGHT - VIEWPORT_MARGIN);
  const nx = Math.min(Math.max(VIEWPORT_MARGIN, pos.x), maxX);
  const ny = Math.min(Math.max(VIEWPORT_MARGIN, pos.y), maxY);
  if (pos.x === nx && pos.y === ny) return pos;
  return {
    x: nx,
    y: ny,
  };
};

const loadSavedPipPosition = (): PipPosition | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PIP_POSITION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number' && !Number.isNaN(parsed.x) && !Number.isNaN(parsed.y)) {
      return clampPositionToViewport({ x: parsed.x, y: parsed.y });
    }
  } catch (e) {}
  return null;
};

export const formatHoursAndMins = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const SUBJECT_COLORS: Record<string, { text: string; bg: string; border: string; colorCode: string }> = {
  AFM: { text: 'text-[#FF3366]', bg: 'bg-[#FF3366]/15', border: 'border-[#FF3366]/40', colorCode: '#FF3366' },
  FR: { text: 'text-[#00D2FF]', bg: 'bg-[#00D2FF]/15', border: 'border-[#00D2FF]/40', colorCode: '#00D2FF' },
  Audit: { text: 'text-[#00FF66]', bg: 'bg-[#00FF66]/15', border: 'border-[#00FF66]/40', colorCode: '#00FF66' },
  AUDIT: { text: 'text-[#00FF66]', bg: 'bg-[#00FF66]/15', border: 'border-[#00FF66]/40', colorCode: '#00FF66' },
  DT: { text: 'text-[#FF9900]', bg: 'bg-[#FF9900]/15', border: 'border-[#FF9900]/40', colorCode: '#FF9900' },
  IDT: { text: 'text-[#9933FF]', bg: 'bg-[#9933FF]/15', border: 'border-[#9933FF]/40', colorCode: '#9933FF' },
  IBS: { text: 'text-[#FFCC00]', bg: 'bg-[#FFCC00]/15', border: 'border-[#FFCC00]/40', colorCode: '#FFCC00' },
};

export interface MatchingClockSlotInfo {
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  title: string;
  subjectCode: string;
}

export interface StudyPictureInPictureProps {
  isStudyActive: boolean;
  studySeconds: number;
  activeMode?: 'idle' | 'study' | 'break' | 'routine' | 'sleep' | string;
  activeRoutineName?: string;
  breakTargetMinutes?: number;
  isPowerNapping?: boolean;
  powerNapTimeLeftSeconds?: number;
  powerNapTargetMins?: number;
  activeFocusTask?: any | null;
  activeFocusTaskElapsedInfo?: any | null;
  matchingClockSlot?: MatchingClockSlotInfo | null;
  isTimerPaused?: boolean;
  onTogglePauseResume?: () => void;
  onCompleteTarget?: () => void;
  onReturnToPomodoro?: () => void;
  isCurrentViewPomodoro?: boolean;
}

export const formatClockTime = (minutes: number): string => {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mins = m % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

export const formatTimerSeconds = (totalSecs: number): string => {
  const safeSecs = Math.max(0, Math.floor(totalSecs));
  const h = Math.floor(safeSecs / 3600);
  const m = Math.floor((safeSecs % 3600) / 60);
  const s = safeSecs % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getTodayDateString = (): string => {
  const d = new Date();
  const yr = d.getFullYear();
  const mn = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mn}-${dy}`;
};

export default function StudyPictureInPicture({
  isStudyActive,
  studySeconds,
  activeMode = 'study',
  activeRoutineName = '',
  breakTargetMinutes = 15,
  isPowerNapping = false,
  powerNapTimeLeftSeconds = 0,
  powerNapTargetMins = 25,
  activeFocusTask,
  activeFocusTaskElapsedInfo,
  matchingClockSlot,
  isTimerPaused = false,
  onTogglePauseResume,
  onCompleteTarget,
  onReturnToPomodoro,
  isCurrentViewPomodoro = true,
}: StudyPictureInPictureProps) {
  // Native Document PiP Window instance
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isNativePiPActive, setIsNativePiPActive] = useState<boolean>(false);

  // Manual Dismiss State for the current timer session
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Local storage state fallback to ensure immediate responsiveness across tab switches
  const [localPomoState, setLocalPomoState] = useState<{ mode: string; isPaused: boolean }>(() => {
    if (typeof window === 'undefined') return { mode: 'idle', isPaused: false };
    const m = localStorage.getItem('practca_pomo_mode') || 'idle';
    const p = Boolean(localStorage.getItem('practca_pomo_paused_state'));
    return { mode: m, isPaused: p };
  });

  useEffect(() => {
    const handleSync = () => {
      const m = localStorage.getItem('practca_pomo_mode') || 'idle';
      const p = Boolean(localStorage.getItem('practca_pomo_paused_state'));
      setLocalPomoState((prev) => {
        if (prev.mode === m && prev.isPaused === p) return prev;
        return { mode: m, isPaused: p };
      });
      setSyncTick((t) => t + 1);
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('practca_pomo_mode_change', handleSync);
    window.addEventListener('practca_pomo_logs_update', handleSync);
    window.addEventListener('practca_active_task_elapsed_updated', handleSync);
    window.addEventListener('practca_clock_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('practca_pomo_mode_change', handleSync);
      window.removeEventListener('practca_pomo_logs_update', handleSync);
      window.removeEventListener('practca_active_task_elapsed_updated', handleSync);
      window.removeEventListener('practca_clock_updated', handleSync);
    };
  }, []);

  const [syncTick, setSyncTick] = useState(0);

  // Resolve the active linked task on the Grind Clock (from prop, practca_active_focus_task, or active target flow)
  const resolvedFocusTask = useMemo(() => {
    if (activeFocusTask) return activeFocusTask;
    try {
      const rawTask = localStorage.getItem('practca_active_focus_task');
      if (rawTask) {
        const parsed = JSON.parse(rawTask);
        if (parsed && (parsed.title || parsed.cleanTitle)) return parsed;
      }
      const rawFlow = localStorage.getItem('practca_target_flow');
      if (rawFlow) {
        const flow = JSON.parse(rawFlow);
        if (Array.isArray(flow)) {
          const activeItem = flow.find((item: any) => item.status === 'active');
          if (activeItem) {
            return {
              id: activeItem.id,
              title: activeItem.title,
              cleanTitle: activeItem.cleanTitle || activeItem.title,
              subjectCode: activeItem.subjectCode,
              chapterName: activeItem.chapterName,
              targetDurationMinutes: activeItem.targetDurationMinutes,
              dueDate: activeItem.dueDate,
            };
          }
        }
      }
    } catch (e) {}
    return null;
  }, [activeFocusTask, syncTick, studySeconds]);

  // Draggable Position State persisted in localStorage
  const [pipPosition, setPipPosition] = useState<PipPosition | null>(() => loadSavedPipPosition());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });
  const floatingDockRef = useRef<HTMLDivElement | null>(null);

  // Offscreen Canvas & Video elements for standard Picture-in-Picture stream & Chrome autoPictureInPicture
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const effectiveActive = Boolean(
    isStudyActive && activeMode === 'study' && localPomoState.mode === 'study'
  );

  // Reset manual dismiss state whenever timer session stops
  useEffect(() => {
    if (!effectiveActive) {
      setIsDismissed((prev) => (prev ? false : prev));
    }
  }, [effectiveActive]);

  // When user switches directly away from Grind Clock to any other tab inside the app,
  // immediately clear the dismissed state so the floating dock appears seamlessly!
  useEffect(() => {
    if (!isCurrentViewPomodoro && effectiveActive) {
      setIsDismissed((prev) => (prev ? false : prev));
    }
  }, [isCurrentViewPomodoro, effectiveActive]);

  // Keep saved position clamped inside viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      setPipPosition((prev) => {
        if (!prev) return null;
        const clamped = clampPositionToViewport(prev);
        return clamped.x === prev.x && clamped.y === prev.y ? prev : clamped;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle pointer dragging for the floating PiP window
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) return;

      const dockEl = floatingDockRef.current;
      if (!dockEl) return;

      const rect = dockEl.getBoundingClientRect();
      dragOffsetRef.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    },
    []
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const nextPos = clampPositionToViewport({
        x: e.clientX - dragOffsetRef.current.offsetX,
        y: e.clientY - dragOffsetRef.current.offsetY,
      });
      setPipPosition(nextPos);
      try {
        localStorage.setItem(PIP_POSITION_STORAGE_KEY, JSON.stringify(nextPos));
      } catch (err) {}
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    },
    [isDragging]
  );

  // Resolve matching clock slot from props or localStorage fallback
  const resolvedClockSlot = useMemo<MatchingClockSlotInfo | null>(() => {
    if (matchingClockSlot) return matchingClockSlot;
    if (!resolvedFocusTask) return null;
    try {
      const rawSyncedSlot = localStorage.getItem('practca_matching_clock_slot');
      if (rawSyncedSlot) {
        const parsedSlot = JSON.parse(rawSyncedSlot);
        if (parsedSlot && typeof parsedSlot.startMinutes === 'number') {
          return parsedSlot;
        }
      }
      const dateStr =
        localStorage.getItem('practca_selected_clock_date') ||
        resolvedFocusTask.dueDate ||
        getTodayDateString();
      const rawClock = localStorage.getItem(`practca_24h_target_clock_${dateStr}`);
      if (!rawClock) return null;
      const parsedClock = JSON.parse(rawClock);
      if (!Array.isArray(parsedClock) || parsedClock.length === 0) return null;
      const aftNorm = normalizeKey(resolvedFocusTask.title || '');
      const clean = (resolvedFocusTask.title || '').trim().toLowerCase();
      const id = (resolvedFocusTask as any).id;
      const found = parsedClock.find((slot: any) => {
        const sNorm = normalizeKey(slot.title || '');
        const sTitle = (slot.title || '').trim().toLowerCase();
        const sId = (slot.targetId || '').trim().toLowerCase();
        return Boolean(
          (id && sId && sId === id) ||
          (aftNorm && sNorm && sNorm === aftNorm) ||
          (clean && sTitle === clean) ||
          (clean && (sTitle.includes(clean) || clean.includes(sTitle)))
        );
      });
      if (found) {
        return {
          startMinutes: found.startMinutes,
          endMinutes: found.endMinutes,
          durationMinutes: found.durationMinutes,
          title: found.title,
          subjectCode: found.subjectCode,
        };
      }
    } catch (e) {}
    return null;
  }, [matchingClockSlot, resolvedFocusTask, syncTick]);

  // Resolve target elapsed info from props or compute exact Grind Clock accumulated time (priorLoggedSecs + live studySeconds)
  const resolvedElapsedInfo = useMemo(() => {
    if (activeFocusTaskElapsedInfo) return activeFocusTaskElapsedInfo;
    if (!resolvedFocusTask) return null;

    const clean = ((resolvedFocusTask as any).cleanTitle || resolvedFocusTask.title || '').trim().toLowerCase();
    const rawTitle = (resolvedFocusTask.title || '').trim().toLowerCase();
    const bareTitle = clean.replace(/^(afm|fr|audit|dt|idt|ibs)\s*[-:]\s*/i, '').trim();
    const chap = (resolvedFocusTask.chapterName || '').trim().toLowerCase();
    const id = (resolvedFocusTask as any).id;
    const stableId = `active_focus_task_${(resolvedFocusTask.title || '').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const clockDate =
      (typeof window !== 'undefined' ? localStorage.getItem('practca_selected_clock_date') : null) ||
      resolvedFocusTask.dueDate ||
      getTodayDateString();

    let loggedSecsFromStorage = 0;
    try {
      const rawLogs = localStorage.getItem('practca_pomo_logs');
      if (rawLogs) {
        const logs = JSON.parse(rawLogs);
        if (Array.isArray(logs)) {
          logs.forEach((log: any) => {
            if (log.mode !== 'study' || !log.durationSeconds) return;
            if (log.date && log.date !== clockDate) return;

            const note = (log.notes || '').toLowerCase();
            const logTaskId = log.taskId;
            const isMatch =
              (id && logTaskId && logTaskId === id) ||
              (clean && (note.includes(clean) || clean.includes(note))) ||
              (rawTitle && (note.includes(rawTitle) || rawTitle.includes(note))) ||
              (bareTitle.length > 3 && note.includes(bareTitle)) ||
              (chap && note.includes(chap)) ||
              (id && note.includes(String(id).toLowerCase()));
            if (isMatch) {
              loggedSecsFromStorage += Number(log.durationSeconds) || 0;
            }
          });
        }
      }
    } catch (e) {}

    // Also inspect synced Grind Clock elapsed snapshot (in case focusSessions or targetMinutes were resolved there)
    let syncedPriorLoggedSecs = 0;
    let syncedTargetMinutes: number | undefined = undefined;
    try {
      const rawSynced = localStorage.getItem('practca_active_task_elapsed_info');
      if (rawSynced) {
        const parsedSynced = JSON.parse(rawSynced);
        const sameTask =
          (id && parsedSynced.taskId && parsedSynced.taskId === id) ||
          (rawTitle && (parsedSynced.taskTitle || '').trim().toLowerCase() === rawTitle) ||
          (clean && (parsedSynced.cleanTitle || '').trim().toLowerCase() === clean);
        if (sameTask) {
          if (typeof parsedSynced.priorLoggedSecs === 'number') {
            syncedPriorLoggedSecs = parsedSynced.priorLoggedSecs;
          }
          if (typeof parsedSynced.targetMinutes === 'number' && parsedSynced.targetMinutes > 0) {
            syncedTargetMinutes = parsedSynced.targetMinutes;
          }
        }
      }
    } catch (e) {}

    const priorLoggedSecs = Math.max(loggedSecsFromStorage, syncedPriorLoggedSecs);
    const liveRunningSecs = activeMode === 'study' ? Math.max(0, studySeconds) : 0;
    const totalSecs = priorLoggedSecs + liveRunningSecs;

    // Consolidate planned minutes from 24-hour target clock slots for clockDate
    let clockTargetMinutes: number | undefined = undefined;
    try {
      const rawClock = localStorage.getItem(`practca_24h_target_clock_${clockDate}`);
      if (rawClock) {
        const parsedClock = JSON.parse(rawClock);
        if (Array.isArray(parsedClock) && parsedClock.length > 0) {
          const aftNorm = normalizeKey(resolvedFocusTask.title || '');
          const matchingSlots = parsedClock.filter((s: any) => {
            const sNorm = normalizeKey(s.title || '');
            const sTitle = (s.title || '').trim().toLowerCase();
            const sId = (s.targetId || '').trim().toLowerCase();
            const sChap = (s.chapterName || '').trim().toLowerCase();
            return Boolean(
              (id && sId && sId === id) ||
              (aftNorm && sNorm && sNorm === aftNorm) ||
              (clean && sTitle === clean) ||
              (clean && (sTitle.includes(clean) || clean.includes(sTitle))) ||
              (chap && sChap && sChap === chap)
            );
          });
          if (matchingSlots.length > 0) {
            clockTargetMinutes = matchingSlots.reduce(
              (sum: number, slot: any) => sum + (Number(slot.durationMinutes) || 0),
              0
            );
          }
        }
      }
    } catch (e) {}

    let customTargetMinutes: number | undefined = undefined;
    try {
      const rawDurations = localStorage.getItem('practca_task_target_durations');
      if (rawDurations) {
        const parsed = JSON.parse(rawDurations);
        const candidates = [id, resolvedFocusTask.title, (resolvedFocusTask as any).cleanTitle, stableId].filter(Boolean);
        for (const k of candidates) {
          if (k && parsed[k]) {
            customTargetMinutes = Number(parsed[k]);
            break;
          }
        }
      }
    } catch (e) {}

    const targetMinutes =
      customTargetMinutes ||
      syncedTargetMinutes ||
      resolvedFocusTask.targetDurationMinutes ||
      clockTargetMinutes ||
      resolvedClockSlot?.durationMinutes ||
      resolvedFocusTask.durationMinutes ||
      resolvedFocusTask.duration ||
      45;

    const targetSecs = targetMinutes * 60;
    const elapsedMinutes = Math.floor(totalSecs / 60);
    const remainingSecs = totalSecs % 60;
    const isExceeded = totalSecs > targetSecs;
    const diffSecs = Math.abs(totalSecs - targetSecs);
    const diffMinutes = Math.floor(diffSecs / 60);
    const percent = targetSecs > 0 ? Math.round((totalSecs / targetSecs) * 100) : 0;

    return {
      priorLoggedSecs,
      liveRunningSecs,
      totalSecs,
      elapsedMinutes,
      remainingSecs,
      targetMinutes,
      targetSecs,
      isExceeded,
      diffMinutes,
      percent,
    };
  }, [activeFocusTaskElapsedInfo, resolvedFocusTask, resolvedClockSlot, activeMode, studySeconds, syncTick]);

  // Subject color resolution
  const subCode = (
    resolvedFocusTask?.subjectCode ||
    resolvedClockSlot?.subjectCode ||
    (typeof window !== 'undefined' ? localStorage.getItem('practca_pomo_subject') : null) ||
    'AFM'
  ).toUpperCase();
  const subColors = SUBJECT_COLORS[subCode] || SUBJECT_COLORS.AFM;

  // Resolved slot times & target durations
  const slotWindowStr = useMemo(() => {
    if (resolvedClockSlot) {
      return `${formatClockTime(resolvedClockSlot.startMinutes)} – ${formatClockTime(resolvedClockSlot.endMinutes)}`;
    }
    return null;
  }, [resolvedClockSlot]);

  const targetDurationMinutes = useMemo(() => {
    if (activeMode === 'break') return breakTargetMinutes || 15;
    if (activeMode === 'sleep' && isPowerNapping) return powerNapTargetMins || 25;
    return (
      resolvedElapsedInfo?.targetMinutes ||
      resolvedClockSlot?.durationMinutes ||
      resolvedFocusTask?.targetDurationMinutes ||
      resolvedFocusTask?.durationMinutes ||
      45
    );
  }, [activeMode, breakTargetMinutes, isPowerNapping, powerNapTargetMins, resolvedElapsedInfo, resolvedClockSlot, resolvedFocusTask]);

  const targetProgressPercent = useMemo(() => {
    if (activeMode === 'break') {
      const targetSecs = Math.max(60, (breakTargetMinutes || 15) * 60);
      return Math.min(100, Math.round((studySeconds / targetSecs) * 100));
    }
    if (activeMode === 'sleep' && isPowerNapping) {
      const targetSecs = Math.max(60, (powerNapTargetMins || 25) * 60);
      const elapsed = Math.max(0, targetSecs - (powerNapTimeLeftSeconds || 0));
      return Math.min(100, Math.round((elapsed / targetSecs) * 100));
    }
    if (!resolvedElapsedInfo?.targetSecs || resolvedElapsedInfo.targetSecs <= 0) return 0;
    return Math.min(100, Math.round((resolvedElapsedInfo.totalSecs / resolvedElapsedInfo.targetSecs) * 100));
  }, [activeMode, breakTargetMinutes, studySeconds, isPowerNapping, powerNapTargetMins, powerNapTimeLeftSeconds, resolvedElapsedInfo]);

  // Planned time approaching (< 2m) and lapsed (0:00) tracking inside PiP (when user is away from Grind Clock or in floating PiP)
  const pipAlertStateRef = useRef<{
    taskKey: string;
    targetMinutes: number;
    approachingDismissed: boolean;
    approachingChimeFired: boolean;
    completedChimeFired: boolean;
  }>({
    taskKey: '',
    targetMinutes: 0,
    approachingDismissed: false,
    approachingChimeFired: false,
    completedChimeFired: false
  });
  const [pipAlertBanner, setPipAlertBanner] = useState<'none' | 'approaching' | 'completed'>('none');

  const pipSecondsRemaining = useMemo(() => {
    if (activeMode !== 'study' || !resolvedFocusTask || !resolvedElapsedInfo || resolvedElapsedInfo.targetSecs <= 0) {
      return null;
    }
    return resolvedElapsedInfo.targetSecs - resolvedElapsedInfo.totalSecs;
  }, [activeMode, resolvedFocusTask, resolvedElapsedInfo]);

  useEffect(() => {
    const isTaskAlreadyDone = Boolean(
      resolvedFocusTask &&
      (resolvedFocusTask.completed || (resolvedFocusTask as any).status === 'completed')
    );
    if (
      activeMode !== 'study' ||
      isTimerPaused ||
      !resolvedFocusTask ||
      isTaskAlreadyDone ||
      !resolvedElapsedInfo ||
      pipSecondsRemaining === null
    ) {
      if (pipAlertBanner !== 'none') setPipAlertBanner('none');
      return;
    }

    const taskKey = `${resolvedFocusTask.subjectCode || 'AFM'}_${resolvedFocusTask.title}_${resolvedFocusTask.chapterName || ''}`;
    const targetMins = resolvedElapsedInfo.targetMinutes || 45;

    if (
      pipAlertStateRef.current.taskKey !== taskKey ||
      pipAlertStateRef.current.targetMinutes !== targetMins
    ) {
      pipAlertStateRef.current = {
        taskKey,
        targetMinutes: targetMins,
        approachingDismissed: false,
        approachingChimeFired: false,
        completedChimeFired: false
      };
    }

    if (studySeconds >= 5 && pipSecondsRemaining <= 120 && pipSecondsRemaining > 0) {
      if (!pipAlertStateRef.current.approachingChimeFired) {
        pipAlertStateRef.current.approachingChimeFired = true;
        if (!isCurrentViewPomodoro) {
          playNotificationChime('approaching');
        }
      }
      if (!pipAlertStateRef.current.approachingDismissed && pipAlertBanner !== 'approaching') {
        setPipAlertBanner('approaching');
      }
    } else if (pipAlertBanner !== 'none' && (pipSecondsRemaining > 120 || pipSecondsRemaining <= 0)) {
      setPipAlertBanner('none');
    }
  }, [activeMode, isTimerPaused, resolvedFocusTask, resolvedElapsedInfo, pipSecondsRemaining, studySeconds, isCurrentViewPomodoro, pipAlertBanner]);

  const handleExtendFromPiP = useCallback((extraMins: number) => {
    if (!resolvedFocusTask || !resolvedElapsedInfo) return;
    const currentElapsedMins = Math.floor((resolvedElapsedInfo.totalSecs || 0) / 60);
    const baseTarget = Math.max(resolvedElapsedInfo.targetMinutes || 45, currentElapsedMins);
    const newTarget = baseTarget + extraMins;
    const taskId = (resolvedFocusTask as any).id || (resolvedFocusTask as any).taskId;
    const rawTitle = resolvedFocusTask.title || '';
    const cleanTitle = (resolvedFocusTask as any).cleanTitle || rawTitle;
    const normTitle = normalizeKey(cleanTitle || rawTitle);
    const stableId = `active_focus_task_${rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const clockDate =
      (typeof window !== 'undefined' ? localStorage.getItem('practca_selected_clock_date') : null) ||
      resolvedFocusTask.dueDate ||
      getTodayDateString();

    syncTargetDurationAcrossSystem({
      id: taskId,
      title: rawTitle,
      cleanTitle,
      chapterName: resolvedFocusTask.chapterName,
      subjectCode: resolvedFocusTask.subjectCode,
      targetDurationMinutes: newTarget,
      selectedDate: clockDate
    });

    try {
      const rawDurs = localStorage.getItem('practca_task_target_durations');
      const parsedDurs = rawDurs ? JSON.parse(rawDurs) : {};
      if (taskId) parsedDurs[taskId] = newTarget;
      if (rawTitle) parsedDurs[rawTitle] = newTarget;
      if (cleanTitle) parsedDurs[cleanTitle] = newTarget;
      if (normTitle) parsedDurs[normTitle] = newTarget;
      parsedDurs[stableId] = newTarget;
      localStorage.setItem('practca_task_target_durations', JSON.stringify(parsedDurs));

      const updatedAft = { ...resolvedFocusTask, targetDurationMinutes: newTarget };
      localStorage.setItem('practca_active_focus_task', JSON.stringify(updatedAft));
    } catch (e) {}

    window.dispatchEvent(
      new CustomEvent('practca_active_task_duration_adjusted', {
        detail: {
          newTotalMinutes: newTarget,
          deltaMinutes: extraMins
        }
      })
    );
    window.dispatchEvent(new Event('storage'));
    setPipAlertBanner('none');
    setSyncTick(t => t + 1);
  }, [resolvedFocusTask, resolvedElapsedInfo]);

  // Mode header metadata
  const modeHeaderMeta = useMemo(() => {
    const hasLinkedTask = activeMode === 'study' && Boolean(resolvedFocusTask);
    if (isTimerPaused) {
      return {
        label: `${activeMode === 'break' ? 'BREAK' : activeMode === 'routine' ? 'ROUTINE' : 'STUDY'} PAUSED`,
        dotClass: 'bg-amber-400',
        textClass: 'text-amber-300',
        borderHex: '#f59e0b',
        readoutLabel: hasLinkedTask ? 'Task Elapsed (Paused)' : 'Paused At',
      };
    }
    if (activeMode === 'break') {
      return {
        label: 'DESK BREAK LIVE',
        dotClass: 'bg-emerald-400 animate-ping',
        textClass: 'text-emerald-300',
        borderHex: '#10b981',
        readoutLabel: 'Break Time',
      };
    }
    if (activeMode === 'routine') {
      return {
        label: activeRoutineName ? `${activeRoutineName.toUpperCase()} LIVE` : 'ROUTINE LIVE',
        dotClass: 'bg-amber-400 animate-ping',
        textClass: 'text-amber-300',
        borderHex: '#f59e0b',
        readoutLabel: 'Routine Time',
      };
    }
    if (activeMode === 'sleep' && isPowerNapping) {
      return {
        label: 'POWER NAP LIVE',
        dotClass: 'bg-indigo-400 animate-ping',
        textClass: 'text-indigo-300',
        borderHex: '#818cf8',
        readoutLabel: 'Nap Remaining',
      };
    }
    return {
      label: 'STUDY FOCUS LIVE',
      dotClass: 'bg-cyan-400 animate-ping',
      textClass: 'text-cyan-300',
      borderHex: '#00f3ff',
      readoutLabel: hasLinkedTask ? 'Task Accumulated Time' : 'Study Mode Time',
    };
  }, [isTimerPaused, activeMode, activeRoutineName, isPowerNapping, resolvedFocusTask]);

  const displayedTimerSeconds = useMemo(() => {
    if (activeMode === 'sleep' && isPowerNapping && powerNapTimeLeftSeconds > 0) {
      return powerNapTimeLeftSeconds;
    }
    if (activeMode === 'study' && resolvedFocusTask && resolvedElapsedInfo) {
      return resolvedElapsedInfo.totalSecs;
    }
    return studySeconds;
  }, [activeMode, isPowerNapping, powerNapTimeLeftSeconds, resolvedFocusTask, resolvedElapsedInfo, studySeconds]);

  // Paint a single frame onto the offscreen canvas so stream has valid video metadata immediately
  const drawCanvasFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#060813';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = resolvedFocusTask && resolvedElapsedInfo?.isExceeded ? '#f43f5e' : modeHeaderMeta.borderHex;
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    ctx.fillStyle = '#0b1022';
    ctx.fillRect(6, 6, w - 12, 42);

    ctx.fillStyle = modeHeaderMeta.borderHex;
    ctx.beginPath();
    ctx.arc(24, 27, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(modeHeaderMeta.label, 38, 32);

    ctx.fillStyle = subColors.colorCode;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`[${activeMode === 'study' ? subCode : activeMode.toUpperCase()}]`, w - 20, 32);
    ctx.textAlign = 'start';

    ctx.fillStyle = modeHeaderMeta.borderHex;
    ctx.font = 'bold 50px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(formatTimerSeconds(displayedTimerSeconds), w / 2, 102);

    if (activeMode === 'study' && resolvedFocusTask && (resolvedElapsedInfo as any)?.priorLoggedSecs > 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Current Run: ${formatTimerSeconds(studySeconds)}`, w / 2, 120);
    }
    ctx.textAlign = 'start';

    ctx.fillStyle = '#0a0e1f';
    ctx.fillRect(18, 128, w - 36, 122);
    ctx.strokeStyle = resolvedFocusTask ? 'rgba(245, 158, 11, 0.45)' : 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(18, 128, w - 36, 122);

    if (activeMode === 'study' && resolvedFocusTask) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`TARGET SLOT • ${subCode}`, 30, 150);

      if (slotWindowStr) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(slotWindowStr, w - 30, 150);
        ctx.textAlign = 'start';
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      const cleanTitle = resolvedFocusTask.cleanTitle || resolvedFocusTask.title || 'Linked Target';
      const truncatedTitle = cleanTitle.length > 36 ? cleanTitle.slice(0, 34) + '...' : cleanTitle;
      ctx.fillText(truncatedTitle, 30, 176);

      const totalTaskSecs = resolvedElapsedInfo?.totalSecs ?? studySeconds;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 11.5px monospace';
      ctx.fillText(
        `Elapsed: ${formatTimerSeconds(totalTaskSecs)} / Planned: ${formatHoursAndMins(targetDurationMinutes)}`,
        30,
        202
      );

      ctx.fillStyle = resolvedElapsedInfo?.isExceeded ? '#f43f5e' : '#10b981';
      ctx.font = 'bold 11.5px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        resolvedElapsedInfo?.isExceeded
          ? `+${formatHoursAndMins(resolvedElapsedInfo.diffMinutes)} over`
          : `${formatHoursAndMins(resolvedElapsedInfo?.diffMinutes ?? 0)} left`,
        w - 30,
        202
      );
      ctx.textAlign = 'start';

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(30, 218, w - 60, 12);

      const fillW = Math.max(4, Math.round(((w - 60) * targetProgressPercent) / 100));
      ctx.fillStyle = resolvedElapsedInfo?.isExceeded ? '#f43f5e' : '#10b981';
      ctx.fillRect(30, 218, fillW, 12);
    } else if (activeMode === 'break') {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`DESK BREAK • TARGET ${breakTargetMinutes}M`, 30, 168);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Recharge & hydrate before resuming Study Focus', 30, 196);
    } else if (activeMode === 'routine') {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`DAILY ROUTINE • ${(activeRoutineName || 'General').toUpperCase()}`, 30, 168);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Logging routine block to 24-Hour Master Clock', 30, 196);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('TARGET SLOT: NO TARGET LINKED', 30, 170);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('Open Free Study Session • Logging to 24h Ledger', 30, 198);
    }
  }, [
    activeFocusTask,
    resolvedElapsedInfo,
    modeHeaderMeta,
    subColors,
    activeMode,
    subCode,
    displayedTimerSeconds,
    slotWindowStr,
    studySeconds,
    targetDurationMinutes,
    targetProgressPercent,
    breakTargetMinutes,
    activeRoutineName,
  ]);

  const closePiP = useCallback(() => {
    if (pipWindow) {
      try {
        pipWindow.close();
      } catch (e) {}
      setPipWindow(null);
    }
    if (typeof document !== 'undefined' && document.pictureInPictureElement) {
      try {
        document.exitPictureInPicture().catch(() => {});
      } catch (e) {}
    }
    setIsNativePiPActive((prev) => (prev ? false : prev));
  }, [pipWindow]);

  const handleDismissPiP = useCallback(() => {
    setIsDismissed(true);
    closePiP();
  }, [closePiP]);

  // Open Native PiP (Document PiP or Video PiP) on user click or automatic tab switch
  const openAutoPiP = useCallback(async (forceOpen = false): Promise<boolean> => {
    if (typeof window === 'undefined' || !effectiveActive) return false;
    if (isDismissed && !forceOpen) return false;
    if (forceOpen) {
      setIsDismissed((prev) => (prev ? false : prev));
    }

    // Ensure canvas has a fresh frame immediately
    drawCanvasFrame();

    // 1. Try Document Picture-in-Picture API (Google Meet / Chrome standard)
    if ('documentPictureInPicture' in window) {
      try {
        if ((window as any).documentPictureInPicture.window) {
          setPipWindow((window as any).documentPictureInPicture.window);
          setIsNativePiPActive((prev) => (!prev ? true : prev));
          return true;
        }
        const pipWin = await (window as any).documentPictureInPicture.requestWindow({
          width: 380,
          height: 230,
        });

        // Copy parent styles
        Array.from(document.styleSheets).forEach((styleSheet) => {
          try {
            const cssRules = Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join('');
            const style = document.createElement('style');
            style.textContent = cssRules;
            pipWin.document.head.appendChild(style);
          } catch (e) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = styleSheet.type;
            link.media = styleSheet.media.mediaText;
            if (styleSheet.href) link.href = styleSheet.href;
            pipWin.document.head.appendChild(link);
          }
        });

        // Inject essential fallback styles to prevent any unstyled flash
        const fallbackStyle = document.createElement('style');
        fallbackStyle.textContent = `
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: #060813 !important;
            color: #ffffff;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            overflow: hidden;
            display: flex;
            width: 100vw;
            height: 100vh;
          }
        `;
        pipWin.document.head.appendChild(fallbackStyle);

        pipWin.document.title = '⚡ CA Final Study Focus PiP';
        pipWin.document.body.style.margin = '0';
        pipWin.document.body.style.padding = '0';
        pipWin.document.body.style.backgroundColor = '#060813';
        pipWin.document.body.style.overflow = 'hidden';

        pipWin.addEventListener('pagehide', () => {
          setPipWindow(null);
          setIsNativePiPActive((prev) => (prev ? false : prev));
        });

        setPipWindow(pipWin);
        setIsNativePiPActive((prev) => (!prev ? true : prev));
        return true;
      } catch (err) {
        // Document PiP might fail if transient user gesture is required or not supported
      }
    }

    // 2. Fallback: Video Picture-in-Picture
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && document.pictureInPictureEnabled) {
      try {
        if (!streamRef.current) {
          streamRef.current = canvas.captureStream(12);
          video.srcObject = streamRef.current;
        }
        if (video.paused) {
          await video.play().catch(() => {});
        }
        if (document.pictureInPictureElement !== video) {
          await video.requestPictureInPicture();
          setIsNativePiPActive((prev) => (!prev ? true : prev));
          return true;
        }
      } catch (videoErr) {}
    }

    return false;
  }, [effectiveActive, isDismissed, drawCanvasFrame]);

  // Keep stable refs to avoid churning listeners on timer tick
  const drawCanvasFrameRef = useRef(drawCanvasFrame);
  drawCanvasFrameRef.current = drawCanvasFrame;

  const openAutoPiPRef = useRef(openAutoPiP);
  openAutoPiPRef.current = openAutoPiP;

  // Expose global synchronous trigger so button clicks have immediate transient user activation
  useEffect(() => {
    if (!effectiveActive) {
      delete (window as any).__practca_open_pip;
      return;
    }
    (window as any).__practca_open_pip = (force = true) => {
      setIsDismissed((prev) => (prev ? false : prev));
      return openAutoPiPRef.current(force);
    };
    return () => {
      delete (window as any).__practca_open_pip;
    };
  }, [effectiveActive]);

  // Listen for manual Pop-Out PiP requests from Grind Clock header or anywhere in app
  useEffect(() => {
    if (!effectiveActive) return;
    const handleTriggerPopout = () => {
      setIsDismissed((prev) => (prev ? false : prev));
      openAutoPiPRef.current(true);
    };
    window.addEventListener('practca_trigger_pip_popout', handleTriggerPopout);
    return () => window.removeEventListener('practca_trigger_pip_popout', handleTriggerPopout);
  }, [effectiveActive]);

  // Setup Video Stream from Canvas & Register Chrome MediaSession Auto-PiP Handler
  useEffect(() => {
    if (!effectiveActive) {
      closePiP();
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Draw initial frame before capturing stream
    drawCanvasFrameRef.current();

    try {
      video.setAttribute('autopictureinpicture', '');
      (video as any).autoPictureInPicture = true;
    } catch (e) {}

    if (!streamRef.current) {
      try {
        const stream = canvas.captureStream(12);
        streamRef.current = stream;
        video.srcObject = stream;
      } catch (e) {}
    }
    video.play().catch(() => {});

    const onEnterPiP = () => setIsNativePiPActive((prev) => (!prev ? true : prev));
    const onLeavePiP = () => setIsNativePiPActive((prev) => (prev ? false : prev));

    video.addEventListener('enterpictureinpicture', onEnterPiP);
    video.addEventListener('leavepictureinpicture', onLeavePiP);

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = isTimerPaused ? 'paused' : 'playing';
        if (typeof MediaMetadata !== 'undefined') {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: resolvedFocusTask?.title || modeHeaderMeta.label,
            artist: `CA Final • ${subCode}`,
            album: '24H Master Clock',
          });
        }
        (navigator.mediaSession as any).setActionHandler('enterpictureinpicture', () => {
          if (!isDismissed) {
            openAutoPiPRef.current(true);
          }
        });
      } catch (e) {}
    }

    return () => {
      video.removeEventListener('enterpictureinpicture', onEnterPiP);
      video.removeEventListener('leavepictureinpicture', onLeavePiP);
      if ('mediaSession' in navigator) {
        try {
          (navigator.mediaSession as any).setActionHandler('enterpictureinpicture', null);
        } catch (e) {}
      }
    };
  }, [effectiveActive, isDismissed, isTimerPaused, resolvedFocusTask?.title, modeHeaderMeta.label, subCode, closePiP]);

  // Automatically trigger PiP when switching away from browser tab (e.g. going to other web pages)
  useEffect(() => {
    if (!effectiveActive) {
      if (isNativePiPActive) closePiP();
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (!isNativePiPActive && !isDismissed) {
          openAutoPiPRef.current(false).catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [effectiveActive, isNativePiPActive, isDismissed, closePiP]);

  // Render Canvas frames continuously (every 250ms) so media stream is never frozen
  useEffect(() => {
    if (!effectiveActive) return;
    drawCanvasFrameRef.current();
    const interval = setInterval(() => {
      drawCanvasFrameRef.current();
    }, 250);
    return () => clearInterval(interval);
  }, [effectiveActive]);

  if (!effectiveActive) return null;

  // Render PiP Card Content (Shared between Document PiP Window and In-App Tab Switch PiP)
  const renderPiPContent = (isFloatingWindow: boolean) => {
    const totalTaskSecs = resolvedElapsedInfo?.totalSecs ?? studySeconds;
    const priorLoggedSecs = (resolvedElapsedInfo as any)?.priorLoggedSecs ?? 0;

    return (
      <div
        className={`font-mono text-left select-none flex flex-col justify-between ${
          isFloatingWindow
            ? 'w-full h-full bg-[#060813] text-white p-3.5 border border-cyan-500/40'
            : 'w-full bg-[#070a17]/95 text-white p-4 space-y-3 rounded-2xl border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl'
        }`}
      >
        {/* Row 1: Mode Status, Drag Handle & Actions */}
        <div
          onPointerDown={!isFloatingWindow ? handleDragStart : undefined}
          onPointerMove={!isFloatingWindow ? handleDragMove : undefined}
          onPointerUp={!isFloatingWindow ? handleDragEnd : undefined}
          onPointerCancel={!isFloatingWindow ? handleDragEnd : undefined}
          className={`flex items-center justify-between gap-2 border-b border-slate-800/90 pb-2 shrink-0 ${
            !isFloatingWindow ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
          }`}
          title={!isFloatingWindow ? 'Drag to reposition PiP window' : undefined}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {!isFloatingWindow && (
              <GripVertical className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            )}
            <span className={`w-2 h-2 rounded-full ${modeHeaderMeta.dotClass} shrink-0`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${modeHeaderMeta.textClass} truncate`}>
              {modeHeaderMeta.label}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onTogglePauseResume && (
              <button
                type="button"
                onClick={onTogglePauseResume}
                className={`h-6 px-2 rounded-md text-[9.5px] font-bold font-mono transition inline-flex items-center gap-1 cursor-pointer border ${
                  isTimerPaused
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/35 hover:bg-amber-500/25'
                }`}
                title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
              >
                {isTimerPaused ? (
                  <Play className="h-2.5 w-2.5 fill-current" />
                ) : (
                  <Pause className="h-2.5 w-2.5 fill-current" />
                )}
                <span>{isTimerPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            {!isFloatingWindow && (
              <button
                type="button"
                onClick={() => openAutoPiP(true)}
                className="h-6 px-2 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-[9.5px] font-bold text-indigo-300 hover:text-white transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
                title="Pop out Always-on-Top OS Window (stays pinned over external web pages, PDFs & applications)"
              >
                <PictureInPicture2 className="h-3 w-3 shrink-0" />
                <span>PiP OS</span>
              </button>
            )}

            {onReturnToPomodoro && (
              <button
                type="button"
                onClick={() => {
                  onReturnToPomodoro();
                  closePiP();
                }}
                className="h-6 px-2 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-[9.5px] font-bold text-cyan-300 hover:text-white transition cursor-pointer inline-flex items-center gap-1"
                title="Return to Focus Timer"
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span>Focus Timer</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDismissPiP}
              className="h-6 w-6 rounded-md bg-slate-800/80 hover:bg-rose-500/25 border border-slate-700/80 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition cursor-pointer inline-flex items-center justify-center shrink-0"
              title="Close floating PiP"
              aria-label="Close floating PiP"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Prominent Time Readout */}
        <div className="flex items-baseline justify-between gap-3 py-0.5 shrink-0">
          <div className="min-w-0">
            <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider block">
              {modeHeaderMeta.readoutLabel}
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white tabular-nums drop-shadow-[0_0_18px_rgba(0,243,255,0.25)]">
                {formatTimerSeconds(displayedTimerSeconds)}
              </span>
              {activeMode === 'study' && resolvedFocusTask && priorLoggedSecs > 0 && (
                <span
                  className="text-[9.5px] font-mono font-bold text-cyan-300/90 bg-cyan-950/50 border border-cyan-500/30 px-1.5 py-0.5 rounded tabular-nums"
                  title="Current Study Mode session timer"
                >
                  Run: {formatTimerSeconds(studySeconds)}
                </span>
              )}
            </div>
          </div>

          {activeMode === 'study' && resolvedFocusTask && onCompleteTarget && (
            <button
              type="button"
              onClick={() => {
                onCompleteTarget();
                if (isFloatingWindow) closePiP();
              }}
              className="h-7 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black font-mono transition inline-flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
              title="Mark linked target as completed"
            >
              <Check className="h-3 w-3 stroke-[3]" />
              <span>Done</span>
            </button>
          )}
        </div>

        {/* Row 3: Target Slot / Mode Details Card */}
        {activeMode === 'break' ? (
          <div className="p-2.5 rounded-xl border bg-[#080b18] border-emerald-500/35 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Coffee className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono font-black text-emerald-300 uppercase">
                  Desk Break • Planned {breakTargetMinutes}m
                </span>
              </div>
              <span className="text-[9.5px] font-mono font-bold text-emerald-300">
                {targetProgressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${Math.min(100, targetProgressPercent)}%` }}
              />
            </div>
          </div>
        ) : activeMode === 'routine' ? (
          <div className="p-2.5 rounded-xl border bg-[#080b18] border-amber-500/35 shrink-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-mono font-black text-amber-300 uppercase truncate">
                Routine: {activeRoutineName || 'Daily Habit Block'}
              </span>
            </div>
            <div className="text-[9.5px] text-slate-400 font-mono">
              Logging active routine to 24-Hour Master Clock
            </div>
          </div>
        ) : activeMode === 'sleep' && isPowerNapping ? (
          <div className="p-2.5 rounded-xl border bg-[#080b18] border-indigo-500/35 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="text-[10px] font-mono font-black text-indigo-300 uppercase">
                  Power Nap • {powerNapTargetMins}m Target
                </span>
              </div>
              <span className="text-[9.5px] font-mono font-bold text-indigo-300">
                {targetProgressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all duration-300"
                style={{ width: `${Math.min(100, targetProgressPercent)}%` }}
              />
            </div>
          </div>
        ) : (
          <div
            className={`p-2.5 rounded-xl border transition-colors shrink-0 space-y-1.5 ${
              resolvedFocusTask
                ? resolvedElapsedInfo?.isExceeded
                  ? 'bg-rose-950/25 border-rose-500/40'
                  : 'bg-[#080b18] border-amber-500/35'
                : 'bg-[#080b18] border-slate-800/80'
            }`}
          >
            {/* Target Slot Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <Target
                  className={`h-3.5 w-3.5 text-amber-400 shrink-0 ${
                    resolvedFocusTask ? 'animate-pulse' : ''
                  }`}
                />
                <span
                  className={`h-4.5 px-1.5 rounded text-[8.5px] font-mono font-black border inline-flex items-center shrink-0 uppercase ${subColors.bg} ${subColors.text} ${subColors.border}`}
                >
                  {subCode}
                </span>
                <span
                  className={`font-bold text-xs truncate block font-sans ${
                    resolvedFocusTask ? 'text-white' : 'text-slate-300 font-mono uppercase text-[10px]'
                  }`}
                  title={resolvedFocusTask ? resolvedFocusTask.cleanTitle || resolvedFocusTask.title : 'Free Study Session'}
                >
                  {resolvedFocusTask ? resolvedFocusTask.cleanTitle || resolvedFocusTask.title : 'Free Study Session'}
                </span>
              </div>

              {resolvedFocusTask && resolvedElapsedInfo && (
                resolvedElapsedInfo.isExceeded ? (
                  <span className="h-5 inline-flex items-center gap-1 px-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[9px] font-black shrink-0">
                    <AlertTriangle className="h-2.5 w-2.5 text-rose-400 shrink-0" />
                    <span>+{formatHoursAndMins(resolvedElapsedInfo.diffMinutes)} over</span>
                  </span>
                ) : (
                  <span className="h-5 inline-flex items-center gap-1 px-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[9px] font-bold shrink-0">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                    <span>{formatHoursAndMins(resolvedElapsedInfo.diffMinutes)} left</span>
                  </span>
                )
              )}
            </div>

            {resolvedFocusTask ? (
              <>
                <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-300 gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>
                      Elapsed: <strong className="text-cyan-300 tabular-nums">{formatTimerSeconds(totalTaskSecs)}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>
                      Planned: <strong className="text-amber-300">{formatHoursAndMins(targetDurationMinutes)}</strong>
                    </span>
                  </div>
                  {slotWindowStr && (
                    <span className="text-[9px] text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded shrink-0">
                      {slotWindowStr}
                    </span>
                  )}
                </div>

                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      resolvedElapsedInfo?.isExceeded
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, targetProgressPercent)}%` }}
                  />
                </div>

                {/* Planned Time Approaching (<2m) or Lapsed (0:00) Interactive Quick Actions inside PiP */}
                {pipAlertBanner !== 'none' && (
                  <div
                    className={`mt-2 p-2 rounded-lg border space-y-1.5 ${
                      pipAlertBanner === 'completed'
                        ? 'bg-emerald-950/50 border-emerald-500/50'
                        : 'bg-amber-950/50 border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[9.5px] font-mono font-black">
                      <span className={pipAlertBanner === 'completed' ? 'text-emerald-300' : 'text-amber-300'}>
                        {pipAlertBanner === 'completed'
                          ? '🎯 Planned Time Reached!'
                          : `⏰ Task Reminder: ${formatTimerSeconds(Math.max(0, pipSecondsRemaining || 0))} left`}
                      </span>
                      <span className="text-[8.5px] text-slate-300 font-normal">
                        Choose action:
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleExtendFromPiP(15)}
                        className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-mono font-bold transition cursor-pointer"
                        title="Increase planned time by 15 minutes"
                      >
                        +15m
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExtendFromPiP(30)}
                        className="px-2 py-1 rounded bg-indigo-600/80 hover:bg-indigo-500 text-white text-[9px] font-mono font-bold transition cursor-pointer"
                        title="Increase planned time by 30 minutes"
                      >
                        +30m
                      </button>
                      {pipAlertBanner === 'approaching' && (
                        <button
                          type="button"
                          onClick={() => {
                            pipAlertStateRef.current.approachingDismissed = true;
                            setPipAlertBanner('none');
                          }}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[9px] font-mono font-bold transition cursor-pointer"
                          title="Proceed as planned until 0:00"
                        >
                          Proceed
                        </button>
                      )}
                      {onReturnToPomodoro && (
                        <button
                          type="button"
                          onClick={() => {
                            onReturnToPomodoro();
                            closePiP();
                          }}
                          className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[9px] font-mono font-black transition cursor-pointer ml-auto"
                          title="Open Focus Timer for Next Action / Task Transition"
                        >
                          Next Action →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-[9.5px] text-slate-400 font-mono">
                Logging {subCode} study session to 24-Hour Master Clock
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Canvas & In-Viewport Micro Video (Required by Chromium Auto-PiP heuristics to have valid dimensions in viewport) */}
      <canvas
        ref={canvasRef}
        width={400}
        height={225}
        className="fixed bottom-0 right-0 w-[160px] h-[90px] opacity-[0.01] pointer-events-none z-[-1]"
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        // @ts-ignore
        autopictureinpicture="true"
        className="fixed bottom-0 right-0 w-[160px] h-[90px] opacity-[0.01] pointer-events-none z-[-1]"
        aria-hidden="true"
      />

      {/* 1. Native Document Picture-in-Picture Portal (When popped out or browser tab is switched) */}
      {pipWindow && !isDismissed && createPortal(renderPiPContent(true), pipWindow.document.body)}

      {/* 2. Automatic In-App Floating PiP via Portal to document.body: Shown whenever active view is NOT Grind Clock */}
      {!isCurrentViewPomodoro && !pipWindow && !isDismissed && typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={floatingDockRef}
            id="study-pip-in-app-dock"
            style={
              pipPosition
                ? { left: `${pipPosition.x}px`, top: `${pipPosition.y}px` }
                : undefined
            }
            className={`fixed z-[9990] w-[350px] max-w-[calc(100vw-1.5rem)] ${
              pipPosition ? '' : 'bottom-5 right-5'
            } ${isDragging ? 'transition-none' : 'transition-shadow duration-200'}`}
          >
            {renderPiPContent(false)}
          </div>,
          document.body
        )}
    </>
  );
}

