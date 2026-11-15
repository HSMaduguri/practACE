import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Heart,
  Clock,
  ShieldCheck
} from 'lucide-react';

export type BreathingPatternId = 'box-4444' | 'calm-478' | 'coherent-55';

export type BreathPhaseType = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BreathPhaseStep {
  type: BreathPhaseType;
  label: string;
  subLabel: string;
  durationSec: number;
}

interface BreathingProtocol {
  id: BreathingPatternId;
  name: string;
  shortBadge: string;
  cadenceLabel: string;
  purpose: string;
  caUseCase: string;
  accentColor: 'teal' | 'violet' | 'sky';
  steps: BreathPhaseStep[];
}

const BREATHING_PROTOCOLS: BreathingProtocol[] = [
  {
    id: 'box-4444',
    name: 'Box Breathing (4-4-4-4)',
    shortBadge: 'Focus & Composure',
    cadenceLabel: '4s In • 4s Hold • 4s Out • 4s Hold',
    purpose: 'Balances autonomic arousal and stabilizes pre-frontal cortical focus.',
    caUseCase: 'Best before starting a 3-hour Mock Test or heavy FR / Direct Tax computation block.',
    accentColor: 'teal',
    steps: [
      { type: 'inhale', label: 'Inhale Slowly', subLabel: 'Draw calm air deep into your diaphragm', durationSec: 4 },
      { type: 'holdIn', label: 'Hold Gently', subLabel: 'Keep shoulders relaxed and chest soft', durationSec: 4 },
      { type: 'exhale', label: 'Exhale Smoothly', subLabel: 'Release tension steadily through the mouth', durationSec: 4 },
      { type: 'holdOut', label: 'Rest Empty', subLabel: 'Observe the quiet pause before the next breath', durationSec: 4 },
    ],
  },
  {
    id: 'calm-478',
    name: '4-7-8 Calm Breath',
    shortBadge: 'Anxiety & Panic Reset',
    cadenceLabel: '4s In • 7s Hold • 8s Out',
    purpose: 'Activates the parasympathetic vagus nerve brake to rapidly lower heart rate.',
    caUseCase: 'Best when feeling overwhelmed by syllabus backlog or before a Power Nap / Overnight Sleep.',
    accentColor: 'violet',
    steps: [
      { type: 'inhale', label: 'Inhale Quietly', subLabel: 'Breathe in gently through your nose for 4s', durationSec: 4 },
      { type: 'holdIn', label: 'Hold & Settle', subLabel: 'Allow oxygen to circulate while softening your jaw', durationSec: 7 },
      { type: 'exhale', label: 'Long Exhale', subLabel: 'Exhale completely with a gentle whoosh for 8s', durationSec: 8 },
    ],
  },
  {
    id: 'coherent-55',
    name: '5-5 Coherent Breath',
    shortBadge: 'HRV Equilibrium',
    cadenceLabel: '5s In • 5s Out (6 Breaths/Min)',
    purpose: 'Synchronizes heart-rate variability (HRV) into a smooth, resonant sine wave.',
    caUseCase: 'Best for a quick 2-minute mental reset between back-to-back study sprints.',
    accentColor: 'sky',
    steps: [
      { type: 'inhale', label: 'Expand & Inhale', subLabel: 'Smooth, continuous inhalation for 5 seconds', durationSec: 5 },
      { type: 'exhale', label: 'Release & Exhale', subLabel: 'Smooth, unhurried exhalation for 5 seconds', durationSec: 5 },
    ],
  },
];

const DURATION_PRESETS = [
  { label: '1 Min', seconds: 60 },
  { label: '2 Min', seconds: 120 },
  { label: '3 Min', seconds: 180 },
  { label: '5 Min', seconds: 300 },
];

const POSTURE_CUES = [
  'Drop your shoulders away from your ears • Unclench your jaw',
  'Rest your eyes softly • Let syllabus thoughts pass like clouds',
  'Sit upright with a relaxed spine • Soften your forehead',
  'Each slow exhale signals safety and calm to your nervous system',
];

interface CalmStatsStorage {
  dateKey: string;
  sessionsToday: number;
  minutesToday: number;
  totalSessions: number;
  totalMinutes: number;
}

const STORAGE_KEY = 'practca_calm_breath_stats_v1';

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const loadCalmStats = (): CalmStatsStorage => {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CalmStatsStorage;
      if (parsed.dateKey === today) {
        return parsed;
      }
      return {
        dateKey: today,
        sessionsToday: 0,
        minutesToday: 0,
        totalSessions: Number(parsed.totalSessions) || 0,
        totalMinutes: Number(parsed.totalMinutes) || 0,
      };
    }
  } catch {
    // ignore storage errors
  }
  return {
    dateKey: today,
    sessionsToday: 0,
    minutesToday: 0,
    totalSessions: 0,
    totalMinutes: 0,
  };
};

interface CalmBreathStudioProps {
  isExternalZenOpen?: boolean;
  onExternalZenClose?: () => void;
}

export const CalmBreathStudio: React.FC<CalmBreathStudioProps> = ({
  isExternalZenOpen,
  onExternalZenClose,
}) => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<BreathingPatternId>('box-4444');
  const [sessionDurationSec, setSessionDurationSec] = useState<number>(120); // default 2 mins
  const [timeLeftSec, setTimeLeftSec] = useState<number>(120);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isZenFullscreen, setIsZenFullscreen] = useState<boolean>(false);

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [stepTimeLeft, setStepTimeLeft] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  const [chimesEnabled, setChimesEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('practca_calm_chimes_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [calmStats, setCalmStats] = useState<CalmStatsStorage>(loadCalmStats);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const activeProtocol =
    BREATHING_PROTOCOLS.find((p) => p.id === selectedProtocolId) || BREATHING_PROTOCOLS[0];
  const currentStep = activeProtocol.steps[stepIndex] || activeProtocol.steps[0];

  useEffect(() => {
    if (isExternalZenOpen) {
      setIsZenFullscreen(true);
    }
  }, [isExternalZenOpen]);

  const closeZenFullscreen = useCallback(() => {
    setIsZenFullscreen(false);
    if (onExternalZenClose) {
      onExternalZenClose();
    }
  }, [onExternalZenClose]);

  // Escape key to exit Zen Fullscreen
  useEffect(() => {
    if (!isZenFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeZenFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenFullscreen, closeZenFullscreen]);

  // Synthesize gentle singing-bowl harmonic chimes via Web Audio API
  const playBreathChime = useCallback(
    (cue: BreathPhaseType | 'complete', forcePlay = false) => {
      if (!chimesEnabled && !forcePlay) return;
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;

        if (cue === 'complete') {
          // Warm three-note singing bowl completion chord
          const freqs = [396, 528, 639];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.14);
            gain.gain.setValueAtTime(0.001, now + idx * 0.14);
            gain.gain.exponentialRampToValueAtTime(0.11, now + idx * 0.14 + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.14 + 1.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.14);
            osc.stop(now + idx * 0.14 + 1.85);
          });
          return;
        }

        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        subOsc.type = 'triangle';

        if (cue === 'inhale') {
          // Gentle ascending harmonic (432 Hz -> 528 Hz)
          osc.frequency.setValueAtTime(432, now);
          osc.frequency.exponentialRampToValueAtTime(528, now + 0.45);
          subOsc.frequency.setValueAtTime(216, now);
          subOsc.frequency.exponentialRampToValueAtTime(264, now + 0.45);
        } else if (cue === 'exhale') {
          // Grounding descending harmonic (528 Hz -> 396 Hz)
          osc.frequency.setValueAtTime(528, now);
          osc.frequency.exponentialRampToValueAtTime(396, now + 0.55);
          subOsc.frequency.setValueAtTime(264, now);
          subOsc.frequency.exponentialRampToValueAtTime(198, now + 0.55);
        } else {
          // Soft crystalline bell tap for hold phases (639 Hz)
          osc.frequency.setValueAtTime(639, now);
          subOsc.frequency.setValueAtTime(319.5, now);
        }

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(cue === 'holdIn' || cue === 'holdOut' ? 0.065 : 0.095, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.95);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.25, now);

        osc.connect(gain);
        subOsc.connect(subGain);
        subGain.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 1.0);
        subOsc.stop(now + 1.0);
      } catch {
        // Ignore audio context autoplay errors
      }
    },
    [chimesEnabled]
  );

  const recordCompletedSession = useCallback((durationSec: number) => {
    const minsEarned = Math.max(1, Math.round(durationSec / 60));
    const today = getTodayKey();
    setCalmStats((prev) => {
      const base = prev.dateKey === today ? prev : { ...prev, dateKey: today, sessionsToday: 0, minutesToday: 0 };
      const updated: CalmStatsStorage = {
        dateKey: today,
        sessionsToday: base.sessionsToday + 1,
        minutesToday: base.minutesToday + minsEarned,
        totalSessions: base.totalSessions + 1,
        totalMinutes: base.totalMinutes + minsEarned,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  // Main 1-second breathing & session timer tick
  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setTimeLeftSec((prevTotal) => {
        if (prevTotal <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          playBreathChime('complete');
          recordCompletedSession(sessionDurationSec);
          return 0;
        }
        return prevTotal - 1;
      });

      setStepTimeLeft((prevStep) => {
        if (prevStep <= 1) {
          const nextIdx = (stepIndex + 1) % activeProtocol.steps.length;
          const nextStep = activeProtocol.steps[nextIdx];
          setStepIndex(nextIdx);
          if (nextIdx === 0) {
            setCompletedCycles((c) => c + 1);
          }
          playBreathChime(nextStep.type);
          return nextStep.durationSec;
        }
        return prevStep - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    isRunning,
    stepIndex,
    activeProtocol.steps,
    playBreathChime,
    recordCompletedSession,
    sessionDurationSec,
  ]);

  const handleSelectProtocol = (protocolId: BreathingPatternId) => {
    const proto = BREATHING_PROTOCOLS.find((p) => p.id === protocolId) || BREATHING_PROTOCOLS[0];
    setSelectedProtocolId(protocolId);
    setIsRunning(false);
    setIsCompleted(false);
    setStepIndex(0);
    setStepTimeLeft(proto.steps[0].durationSec);
    setCompletedCycles(0);
    setTimeLeftSec(sessionDurationSec);
  };

  const handleSelectDuration = (seconds: number) => {
    setSessionDurationSec(seconds);
    setTimeLeftSec(seconds);
    setIsRunning(false);
    setIsCompleted(false);
    setStepIndex(0);
    setStepTimeLeft(activeProtocol.steps[0].durationSec);
    setCompletedCycles(0);
  };

  const handleToggleStartPause = () => {
    if (isCompleted || timeLeftSec <= 0) {
      // Restart fresh
      setTimeLeftSec(sessionDurationSec);
      setStepIndex(0);
      setStepTimeLeft(activeProtocol.steps[0].durationSec);
      setCompletedCycles(0);
      setIsCompleted(false);
      setIsRunning(true);
      playBreathChime(activeProtocol.steps[0].type);
      return;
    }

    if (!isRunning) {
      setIsRunning(true);
      playBreathChime(currentStep.type);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeftSec(sessionDurationSec);
    setStepIndex(0);
    setStepTimeLeft(activeProtocol.steps[0].durationSec);
    setCompletedCycles(0);
  };

  const handleToggleChimes = () => {
    const next = !chimesEnabled;
    setChimesEnabled(next);
    try {
      localStorage.setItem('practca_calm_chimes_enabled', String(next));
    } catch {
      // ignore
    }
    if (next) {
      playBreathChime('inhale', true);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Compute visual scale and ring glow based on current breathing phase
  const getOrbVisualState = () => {
    if (!isRunning) {
      return {
        scale: 1,
        outerScale: 1.06,
        transitionSec: 0.8,
        phaseBadge: isCompleted ? 'SESSION COMPLETE' : 'READY TO RELAX',
        ringColor: 'border-teal-400/50 shadow-[0_0_40px_rgba(45,212,191,0.22)]',
        coreGradient: 'from-teal-500/25 via-cyan-500/15 to-violet-500/20',
      };
    }

    switch (currentStep.type) {
      case 'inhale':
        return {
          scale: 1.34,
          outerScale: 1.48,
          transitionSec: currentStep.durationSec,
          phaseBadge: 'INHALE • EXPAND',
          ringColor: 'border-teal-300/80 shadow-[0_0_65px_rgba(45,212,191,0.45)]',
          coreGradient: 'from-teal-400/40 via-emerald-500/25 to-cyan-500/30',
        };
      case 'holdIn':
        return {
          scale: 1.34,
          outerScale: 1.52,
          transitionSec: 0.6,
          phaseBadge: 'HOLD • STILLNESS',
          ringColor: 'border-violet-300/85 shadow-[0_0_70px_rgba(167,139,250,0.48)]',
          coreGradient: 'from-violet-400/40 via-indigo-500/30 to-teal-400/25',
        };
      case 'exhale':
        return {
          scale: 0.88,
          outerScale: 0.96,
          transitionSec: currentStep.durationSec,
          phaseBadge: 'EXHALE • RELEASE',
          ringColor: 'border-sky-400/60 shadow-[0_0_35px_rgba(56,189,248,0.28)]',
          coreGradient: 'from-sky-500/25 via-indigo-500/20 to-slate-800/40',
        };
      case 'holdOut':
      default:
        return {
          scale: 0.88,
          outerScale: 0.94,
          transitionSec: 0.6,
          phaseBadge: 'REST • EMPTY',
          ringColor: 'border-slate-400/45 shadow-[0_0_25px_rgba(148,163,184,0.2)]',
          coreGradient: 'from-slate-600/25 via-indigo-900/30 to-slate-900/50',
        };
    }
  };

  const orbState = getOrbVisualState();
  const progressPercent = Math.min(
    100,
    Math.max(0, ((sessionDurationSec - timeLeftSec) / sessionDurationSec) * 100)
  );
  const activeCueText = POSTURE_CUES[completedCycles % POSTURE_CUES.length];

  const renderVisualizerOrb = (isLargeZen: boolean) => {
    const sizeClasses = isLargeZen
      ? 'w-60 h-60 sm:w-72 sm:h-72'
      : 'w-44 h-44 sm:w-52 sm:h-52';

    return (
      <div className="relative flex items-center justify-center my-4 sm:my-6 select-none">
        {/* Outer Ambient Halo */}
        <div
          style={{
            transform: `scale(${orbState.outerScale})`,
            transition: `transform ${orbState.transitionSec}s ease-in-out`,
          }}
          className={`${sizeClasses} rounded-full border border-dashed border-teal-400/25 bg-gradient-to-br from-teal-500/5 via-violet-500/5 to-sky-500/5 pointer-events-none absolute`}
        />

        {/* Secondary Breathing Ripple */}
        <div
          style={{
            transform: `scale(${(orbState.scale + orbState.outerScale) / 2})`,
            transition: `transform ${orbState.transitionSec}s ease-in-out`,
          }}
          className={`${sizeClasses} rounded-full border border-violet-400/20 bg-teal-400/5 pointer-events-none absolute`}
        />

        {/* Main Expanding / Contracting Breathing Sphere */}
        <div
          style={{
            transform: `scale(${orbState.scale})`,
            transition: `transform ${orbState.transitionSec}s ease-in-out, box-shadow 0.6s ease, border-color 0.6s ease`,
          }}
          className={`${sizeClasses} rounded-full border-2 ${orbState.ringColor} bg-gradient-to-br ${orbState.coreGradient} backdrop-blur-md flex flex-col items-center justify-center text-center p-4 relative z-10`}
        >
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950/60 border border-white/15 text-[9px] font-mono font-extrabold uppercase tracking-widest text-teal-200 mb-1.5">
            {orbState.phaseBadge}
          </span>

          {isCompleted ? (
            <div className="space-y-1">
              <CheckCircle2 className="h-8 w-8 text-emerald-300 mx-auto animate-bounce" />
              <p className="text-sm sm:text-base font-black text-white font-display">
                Mind Reset Complete
              </p>
              <p className="text-[10px] text-emerald-200 font-mono">
                +{Math.max(1, Math.round(sessionDurationSec / 60))}m Calm Logged
              </p>
            </div>
          ) : (
            <>
              <p
                className={`${
                  isLargeZen ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                } font-display font-black text-white tracking-tight leading-tight`}
              >
                {isRunning ? currentStep.label : 'Sit Back & Breathe'}
              </p>

              <p
                className={`${
                  isLargeZen ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'
                } font-mono font-black text-teal-200 tabular-nums my-1 drop-shadow`}
              >
                {isRunning ? `${stepTimeLeft}s` : formatTimer(timeLeftSec)}
              </p>

              {isRunning && (
                <p className="text-[10px] sm:text-[11px] text-slate-200/90 max-w-[175px] leading-snug">
                  {currentStep.subLabel}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Dedicated Mind Space Calm Breath Studio Card */}
      <div
        id="calm-breath-studio"
        className="relative overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#132238] to-[#171d36] border border-teal-400/35 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5"
      >
        {/* Subtle Top Luminous Hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 opacity-90 pointer-events-none" />
        <div className="absolute -top-16 right-8 h-44 w-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-8 h-44 w-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-700/60 pb-3.5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/20 border border-teal-400/40 text-teal-300">
                <Wind className="h-4 w-4" />
              </div>
              <h2 className="text-sm sm:text-base font-display font-black text-white uppercase tracking-wider">
                Guided Breathing & Calm Reset Studio
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-200 border border-teal-400/35 text-[10px] font-mono font-extrabold uppercase tracking-wider">
                Autonomic Reset
              </span>
            </div>
          </div>

          {/* Right Controls: Daily Calm Counter, Audio Chime Toggle, Zen Mode */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-emerald-400" />
              <div className="text-left">
                <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                  Today&apos;s Calm
                </p>
                <p className="text-xs font-mono font-black text-emerald-300">
                  {calmStats.sessionsToday} {calmStats.sessionsToday === 1 ? 'Session' : 'Sessions'} ({calmStats.minutesToday}m)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleChimes}
              className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                chimesEnabled
                  ? 'bg-teal-500/15 border-teal-400/45 text-teal-200 hover:bg-teal-500/25'
                  : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle soft harmonic singing-bowl chimes on breath transitions"
            >
              {chimesEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-teal-300" />
                  <span>Chimes On</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                  <span>Muted</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsZenFullscreen(true)}
              className="px-3 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/45 text-violet-200 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Open distraction-free Zen Fullscreen Sanctuary"
            >
              <Maximize2 className="h-3.5 w-3.5 text-violet-300" />
              <span>Zen Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Main Studio Body: Left Protocol Selector & Clinical Guide, Right Interactive Breathing Visualizer */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Column (7 cols): Protocol Cards + Duration Presets + Clinical Context */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Select Breathing Technique */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400">
                  1. Select Breathing Cadence Protocol
                </span>
                <span className="text-[10px] font-mono text-teal-300 font-bold">
                  {activeProtocol.cadenceLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {BREATHING_PROTOCOLS.map((proto) => {
                  const isSelected = proto.id === selectedProtocolId;
                  return (
                    <button
                      key={proto.id}
                      type="button"
                      onClick={() => handleSelectProtocol(proto.id)}
                      className={`text-left p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-br from-teal-500/20 via-slate-900/90 to-violet-500/15 border-teal-400/70 shadow-[0_0_20px_rgba(45,212,191,0.18)]'
                          : 'bg-slate-900/65 hover:bg-slate-900/90 border-slate-700/70 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold font-display ${
                            isSelected ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {proto.name}
                        </span>
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                        )}
                      </div>
                      <p className="text-[10px] font-mono font-bold text-teal-300/90">
                        {proto.cadenceLabel}
                      </p>
                      <span className="inline-block w-fit px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-700/80 text-[9px] font-mono text-slate-300">
                        {proto.shortBadge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Protocol Clinical Breakdown */}
            <div className="bg-slate-950/65 border border-slate-800/90 rounded-xl p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                  <span className="text-xs font-bold text-white">
                    {activeProtocol.name} — Physiological Effect
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeProtocol.steps.map((s, idx) => {
                    const isCurrent = isRunning && idx === stepIndex;
                    return (
                      <span
                        key={`${s.type}-${idx}`}
                        className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold transition ${
                          isCurrent
                            ? 'bg-teal-400 text-slate-950 font-black shadow-xs'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {s.label.split(' ')[0]} {s.durationSec}s
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Session Duration & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-400 block">
                  2. Session Duration
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {DURATION_PRESETS.map((preset) => {
                    const active = sessionDurationSec === preset.seconds;
                    return (
                      <button
                        key={preset.seconds}
                        type="button"
                        onClick={() => handleSelectDuration(preset.seconds)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                          active
                            ? 'bg-teal-400 text-slate-950 border-teal-300 font-black shadow-xs'
                            : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-slate-500'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start / Pause / Reset Controls */}
              <div className="flex items-center gap-2 sm:self-end">
                <button
                  type="button"
                  onClick={handleToggleStartPause}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isRunning
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4 fill-slate-950" />
                      <span>Pause Breath</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-slate-950" />
                      <span>{isCompleted ? 'Breathe Again' : 'Start Calm Session'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Reset breathing timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Breathing Visualizer Card */}
          <div className="lg:col-span-5 bg-slate-950/75 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between relative overflow-hidden">
            {/* Top Status Pill */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-teal-300 font-bold">
                <Clock className="h-3 w-3" />
                Remaining: {formatTimer(timeLeftSec)}
              </span>
              <span>
                Cycles Completed: <strong className="text-white">{completedCycles}</strong>
              </span>
            </div>

            {/* Expanding / Contracting Orb */}
            {renderVisualizerOrb(false)}

            {/* Mindful Posture Cue + Session Progress Bar */}
            <div className="w-full space-y-2.5 text-center">
              <p className="text-[11px] font-medium text-teal-200/90 italic px-2">
                &ldquo;{activeCueText}&rdquo;
              </p>

              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Distraction-Free Zen Fullscreen Sanctuary Modal */}
      {isZenFullscreen && (
        <div className="fixed inset-0 z-[130] bg-[#050b14]/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 overflow-y-auto animate-fadeIn">
          {/* Ambient Background Glows */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-teal-500/10 rounded-full blur-[130px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[380px] h-[380px] bg-violet-500/10 rounded-full blur-[120px]" />
          </div>

          {/* Zen Top Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 max-w-5xl w-full mx-auto border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300">
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-display font-black text-white tracking-tight">
                  Mind Space • Zen Breathing Sanctuary
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {activeProtocol.name} ({activeProtocol.cadenceLabel})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleChimes}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  chimesEnabled
                    ? 'bg-teal-500/20 border-teal-400/50 text-teal-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {chimesEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>{chimesEnabled ? 'Harmonic Chimes On' : 'Chimes Muted'}</span>
              </button>

              <button
                type="button"
                onClick={closeZenFullscreen}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Exit Zen Mode (Esc)</span>
              </button>
            </div>
          </div>

          {/* Zen Centerpiece */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6 max-w-2xl w-full mx-auto text-center space-y-6">
            {/* Protocol Quick Switcher Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {BREATHING_PROTOCOLS.map((proto) => {
                const active = proto.id === selectedProtocolId;
                return (
                  <button
                    key={proto.id}
                    type="button"
                    onClick={() => handleSelectProtocol(proto.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition cursor-pointer border ${
                      active
                        ? 'bg-teal-400 text-slate-950 border-teal-300 font-black shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {proto.name}
                  </button>
                );
              })}
            </div>

            {/* Large Breathing Orb */}
            {renderVisualizerOrb(true)}

            {/* Posture Affirmation & Telemetry */}
            <div className="space-y-3 max-w-md mx-auto w-full">
              <p className="text-xs sm:text-sm text-teal-200/90 italic font-medium">
                &ldquo;{activeCueText}&rdquo;
              </p>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span>Session Timer: {formatTimer(timeLeftSec)}</span>
                <span>Completed Cycles: {completedCycles}</span>
              </div>

              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-violet-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Controls & Duration Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                {DURATION_PRESETS.map((preset) => (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => handleSelectDuration(preset.seconds)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      sessionDurationSec === preset.seconds
                        ? 'bg-teal-400 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleToggleStartPause}
                className={`px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg ${
                  isRunning
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    : 'bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 fill-slate-950" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-slate-950" />
                    <span>{isCompleted ? 'Start New Session' : 'Begin Breathing'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Reset session"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Zen Footer */}
          <div className="relative z-10 max-w-4xl w-full mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Today&apos;s Restorative Calm: {calmStats.sessionsToday} Sessions ({calmStats.minutesToday} mins)
            </span>
            <span>All-Time Calm Ledger: {calmStats.totalMinutes} mins</span>
          </div>
        </div>
      )}
    </>
  );
};
