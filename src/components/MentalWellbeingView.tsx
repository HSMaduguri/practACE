/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Moon, 
  Sun, 
  Activity, 
  Trash2, 
  Heart, 
  Smile, 
  Battery, 
  Coffee, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  AlertCircle,
  HelpCircle,
  Droplet,
  Bell,
  Clock,
  Filter,
  Zap,
  Volume2,
  BellRing,
  Utensils,
  Flame,
  ShieldCheck,
  Wind
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ComposedChart,
  Line,
  Bar,
  BarChart,
  Cell,
  ReferenceLine
} from 'recharts';
import { motion } from 'motion/react';
import { formatRunningTime, formatStaticDuration } from '../utils/timeFormat';
import { CalmBreathStudio } from './CalmBreathStudio';

interface SleepSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  feeling?: string;
}

interface FocusSession {
  id: string;
  timestamp: string;
  duration: number; // in minutes
  type: 'work' | 'break';
  subjectCode?: string | null;
  taskTitle?: string | null;
}

interface MentalWellbeingViewProps {
  sleepSessions: SleepSession[];
  isSleeping: boolean;
  sleepStartTime: string | null;
  onStartSleep: () => void;
  onStopSleep: (feeling?: string) => void;
  onDeleteSleepSession: (id: string) => void;
  focusSessions: FocusSession[];
  dailyGoalMinutes: number;

  hydrationReminderEnabled: boolean;
  onToggleHydrationReminder: (val: boolean) => void;
  hydrationInterval: number;
  onUpdateHydrationInterval: (val: number) => void;
  dailyHydrationCount: number;
  onLogHydration: () => void;
  onResetHydration: () => void;
  dailyHydrationTarget: number;
  onUpdateHydrationTarget: (val: number) => void;
  hydrationTimeLeftSeconds: number;
  hydrationSnoozeEndTime: number | null;
  hydrationHistory: string[];
  hydrationSoundEnabled?: boolean;
  onToggleHydrationSound?: (val: boolean) => void;

  // Power Nap Props
  isPowerNapping?: boolean;
  powerNapTimeLeftSeconds?: number;
  powerNapTargetMins?: number;
  onStartPowerNap?: (durationMins: number) => void;
  onStopPowerNap?: (feeling?: string) => void;
  onSnoozePowerNap?: (snoozeMins?: number) => void;
  onRequestRestMode?: () => void;
  onTestPowerNapAlarm?: () => void;
}

const formatMinsToHoursMins = (minutes: number) => {
  return formatStaticDuration(minutes, 'minutes');
};

const formatSecondsToMinsSecs = (totalSeconds: number) => {
  return formatRunningTime(totalSeconds);
};

const SleepTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = Number(data.hours) || 0;
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    const durationFormatted = hrs > 0 
      ? (mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`)
      : `${mins} mins`;

    return (
      <div className="p-3.5 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl space-y-2 text-xs text-slate-300 font-sans z-50 min-w-[210px]">
        <div className="border-b border-slate-900 pb-1.5 flex items-center justify-between gap-2">
          <p className="font-extrabold text-white font-mono text-[11px]">{data.fullDate || data.name}</p>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
            hours >= 7 && hours <= 9
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : hours >= 6
              ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
              : hours > 0
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-slate-900 text-slate-500 border border-slate-800'
          }`}>
            {hours >= 7 && hours <= 9 ? 'Optimal (7-9h)' : hours >= 6 ? 'Adequate (6-7h)' : hours > 0 ? 'Rest Deficit' : 'No Rest'}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-violet-400 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Moon className="h-3.5 w-3.5 text-violet-400" /> Sleep Duration:</span>
            <span className="font-black text-white font-mono">{durationFormatted} ({hours} hrs)</span>
          </p>
          <p className="text-slate-400 text-[10.5px] font-mono flex items-center justify-between">
            <span>Sessions Recorded:</span>
            <span className="text-slate-200 font-bold">{data.sessionsCount || 0}</span>
          </p>
          {data.feelingsText && (
            <p className="text-emerald-400 text-[10.5px] border-t border-slate-900 pt-1.5 mt-1.5 leading-relaxed font-sans">
              😊 Wake-up feeling: <span className="font-medium text-slate-200 italic">"{data.feelingsText}"</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const TrendTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3.5 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl space-y-1.5 text-xs text-slate-300 font-sans z-50">
        <p className="font-extrabold text-white font-mono">{data.fullDate}</p>
        <p className="text-violet-400 font-semibold flex items-center gap-1.5">
          <Moon className="h-3.5 w-3.5 text-violet-400" /> Sleep Duration: <span className="font-bold text-white font-mono">{data.hours} hrs</span>
        </p>
        <p className="text-cyan-400 font-semibold flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-cyan-400" /> Trendline Value: <span className="font-bold text-white font-mono">{data.trend} hrs</span>
        </p>
        <p className="text-slate-500 text-[10px] font-mono">Sessions logged: {data.sessionsCount}</p>
        {data.feelingsText && (
          <p className="text-emerald-400 text-[10.5px] border-t border-slate-900 pt-1.5 mt-1.5 leading-relaxed font-sans">
            😊 Wake-up feeling: <span className="font-medium text-slate-200 italic">"{data.feelingsText}"</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function MentalWellbeingView({
  sleepSessions = [],
  isSleeping,
  sleepStartTime,
  onStartSleep,
  onStopSleep,
  onDeleteSleepSession,
  focusSessions = [],
  dailyGoalMinutes = 120,

  hydrationReminderEnabled = true,
  onToggleHydrationReminder,
  hydrationInterval = 45,
  onUpdateHydrationInterval,
  dailyHydrationCount = 0,
  onLogHydration,
  onResetHydration,
  dailyHydrationTarget = 8,
  onUpdateHydrationTarget,
  hydrationTimeLeftSeconds = 0,
  hydrationSnoozeEndTime = null,
  hydrationHistory = [],
  hydrationSoundEnabled = true,
  onToggleHydrationSound,

  // Power Nap Props
  isPowerNapping = false,
  powerNapTimeLeftSeconds = 0,
  powerNapTargetMins = 20,
  onStartPowerNap,
  onStopPowerNap,
  onSnoozePowerNap,
  onRequestRestMode,
  onTestPowerNapAlarm
}: MentalWellbeingViewProps) {
  const [selectedNapPreset, setSelectedNapPreset] = useState<number>(20);
  const [customNapInput, setCustomNapInput] = useState<string>('');
  const [localFeeling, setLocalFeeling] = useState('');
  const [timeframeFilter, setTimeframeFilter] = useState<'current_week' | 'last_7_days' | 'last_15_days' | 'last_30_days' | 'current_month' | 'custom'>('last_7_days');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const currentPomoMode = localStorage.getItem('practca_pomo_mode') || 'idle';
  const isStudyOrBreak = currentPomoMode === 'study' || currentPomoMode === 'break';

  // Local state to track sleep elapsed seconds
  const [elapsedSleepSeconds, setElapsedSleepSeconds] = useState(0);

  React.useEffect(() => {
    if (!isSleeping || !sleepStartTime) {
      setElapsedSleepSeconds(0);
      return;
    }
    const update = () => {
      const diffSecs = Math.max(0, Math.floor((Date.now() - new Date(sleepStartTime).getTime()) / 1000));
      setElapsedSleepSeconds(diffSecs);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isSleeping, sleepStartTime]);

  const elapsedSleepText = useMemo(() => {
    const hours = Math.floor(elapsedSleepSeconds / 3600);
    const mins = Math.floor((elapsedSleepSeconds % 3600) / 60);
    const secs = elapsedSleepSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [elapsedSleepSeconds]);

  // Helper date bounds calculator for timeframe filter
  const getFilterBounds = (filter: string, startDateStr: string, endDateStr: string) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    end.setHours(23, 59, 59, 999);

    switch (filter) {
      case 'current_week': {
        const current = new Date();
        const day = current.getDay();
        const diff = current.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(current.setDate(diff));
        start.setHours(0, 0, 0, 0);
        break;
      }
      case 'last_7_days': {
        start = new Date();
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case 'last_15_days': {
        start = new Date();
        start.setDate(now.getDate() - 14);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case 'last_30_days': {
        start = new Date();
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case 'current_month': {
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;
      }
      case 'custom': {
        if (startDateStr) {
          start = new Date(startDateStr + 'T00:00:00');
        } else {
          start = new Date();
          start.setDate(now.getDate() - 7);
          start.setHours(0, 0, 0, 0);
        }
        if (endDateStr) {
          end = new Date(endDateStr + 'T23:59:59');
        }
        break;
      }
    }

    return { start, end };
  };

  // Filter sleep sessions matching the selected timeframe
  const filteredSleepSessions = useMemo(() => {
    const { start, end } = getFilterBounds(timeframeFilter, customStartDate, customEndDate);
    return (sleepSessions || []).filter(s => {
      if (!s.startTime) return false;
      const sTime = new Date(s.startTime).getTime();
      return sTime >= start.getTime() && sTime <= end.getTime();
    });
  }, [sleepSessions, timeframeFilter, customStartDate, customEndDate]);

  // Compute historic metrics (Average sleep start time, wake up time, average sleep time, quality) for timeframe filter
  const filteredSleepMetrics = useMemo(() => {
    const sessions = filteredSleepSessions;
    const bounds = getFilterBounds(timeframeFilter, customStartDate, customEndDate);

    if (sessions.length === 0) {
      return {
        hasData: false,
        count: 0,
        daysCount: 0,
        totalDurationMins: 0,
        avgDurationHrs: '0.0',
        avgDurationText: '0 hrs',
        avgBedtime: 'N/A',
        avgWaketime: 'N/A',
        qualityScore: 0,
        qualityLabel: 'No Data',
        consistencyScore: 0,
        consistencyLabel: 'No Data',
        achievementRate: 0,
        feelingAnalysis: { positive: 0, neutral: 0, negative: 0, total: 0 },
        recommendation: `No sleep sessions logged between ${bounds.start.toLocaleDateString([], { month: 'short', day: 'numeric' })} and ${bounds.end.toLocaleDateString([], { month: 'short', day: 'numeric' })}. Select another timeframe filter or log rest sessions.`
      };
    }

    // Total minutes across all sessions in this timeframe (capped at 24h per session for safety)
    const totalMins = sessions.reduce((sum, s) => sum + Math.min(1440, s.duration || 0), 0);

    // Group sessions by calendar date (based on start date) to compute daily totals accurately
    const dailyMap = new Map<string, number>();
    sessions.forEach(s => {
      if (s.startTime) {
        const d = new Date(s.startTime);
        if (!isNaN(d.getTime())) {
          const key = d.toDateString();
          dailyMap.set(key, (dailyMap.get(key) || 0) + Math.min(1440, s.duration || 0));
        }
      }
    });
    const uniqueDaysCount = Math.max(1, dailyMap.size);

    // Average sleep per active sleep day
    const avgDailyMins = Math.round(totalMins / uniqueDaysCount);
    const avgHrsVal = Number(Math.min(24.0, avgDailyMins / 60).toFixed(1));
    const avgDurationHrs = avgHrsVal.toFixed(1);
    const avgDurationText = formatMinsToHoursMins(avgDailyMins);

    // For Bedtime and Wake Up Time:
    // Focus on primary/overnight rest sessions (duration >= 90 mins) if any exist,
    // otherwise fallback to all sessions so short naps don't skew night bedtime/wake calculations.
    const primarySessions = sessions.filter(s => (s.duration || 0) >= 90);
    const targetSessions = primarySessions.length > 0 ? primarySessions : sessions;

    // Robust Circular (Trigonometric Vector) Averaging for Bedtime and Wake Up Time
    // On a 24-hour clock (1440 minutes), time maps to an angle theta = (minutes / 1440) * 2 * PI
    const computeCircularTime = (getDate: (s: SleepSession) => Date | null) => {
      let sumSin = 0;
      let sumCos = 0;
      let count = 0;

      targetSessions.forEach(s => {
        const d = getDate(s);
        if (d && !isNaN(d.getTime())) {
          const mins = d.getHours() * 60 + d.getMinutes() + (d.getSeconds() || 0) / 60;
          const angle = (mins / 1440) * 2 * Math.PI;
          sumSin += Math.sin(angle);
          sumCos += Math.cos(angle);
          count++;
        }
      });

      if (count === 0) return 'N/A';

      let meanAngle = Math.atan2(sumSin, sumCos);
      if (meanAngle < 0) {
        meanAngle += 2 * Math.PI;
      }
      const meanMins = Math.round((meanAngle / (2 * Math.PI)) * 1440) % 1440;
      const h = Math.floor(meanMins / 60);
      const m = meanMins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const avgBedtime = computeCircularTime(s => {
      if (s.startTime) {
        const d = new Date(s.startTime);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    });

    const avgWaketime = computeCircularTime(s => {
      if (s.endTime) {
        const d = new Date(s.endTime);
        if (!isNaN(d.getTime())) return d;
      }
      if (s.startTime) {
        const start = new Date(s.startTime);
        if (!isNaN(start.getTime())) {
          return new Date(start.getTime() + (s.duration || 0) * 60000);
        }
      }
      return null;
    });

    // Target Achievement Rate (% of active days meeting 6.0 - 8.5 hours target)
    let compliantDays = 0;
    dailyMap.forEach(mins => {
      const hrs = mins / 60;
      if (hrs >= 6.0 && hrs <= 8.5) {
        compliantDays++;
      }
    });
    const achievementRate = Math.round((compliantDays / uniqueDaysCount) * 100);

    // Consistency Score (based on standard deviation of daily sleep durations)
    let stdDevHrs = 0;
    if (uniqueDaysCount > 1) {
      const dailyHours = Array.from(dailyMap.values()).map(m => m / 60);
      const mean = dailyHours.reduce((a, b) => a + b, 0) / dailyHours.length;
      const sumSq = dailyHours.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
      stdDevHrs = Math.sqrt(sumSq / dailyHours.length);
    }
    const consistencyScore = Math.round(Math.max(0, Math.min(100, 100 - stdDevHrs * 15)));

    let consistencyLabel = 'Highly Consistent';
    if (uniqueDaysCount <= 1) {
      consistencyLabel = 'Establishing Baseline';
    } else if (consistencyScore >= 85) {
      consistencyLabel = 'Highly Consistent';
    } else if (consistencyScore >= 70) {
      consistencyLabel = 'Moderately Consistent';
    } else {
      consistencyLabel = 'Highly Variable';
    }

    // Wake Sentiment Analysis
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let totalFeelings = 0;

    const posKeywords = ['refreshed', 'energetic', 'good', 'great', 'rested', 'happy', 'optimal', 'stable', 'motivated', 'fresh', 'fine', 'ready'];
    const negKeywords = ['tired', 'headache', 'groggy', 'exhausted', 'sleepy', 'fatigued', 'bad', 'poor', 'heavy', 'migraine', 'restless'];

    sessions.forEach(s => {
      if (s.feeling) {
        totalFeelings++;
        const fLower = s.feeling.toLowerCase();
        let matched = false;
        for (const k of posKeywords) {
          if (fLower.includes(k)) {
            positive++;
            matched = true;
            break;
          }
        }
        if (!matched) {
          for (const k of negKeywords) {
            if (fLower.includes(k)) {
              negative++;
              matched = true;
              break;
            }
          }
        }
        if (!matched) {
          neutral++;
        }
      }
    });

    // Quality Score
    const durationDev = Math.abs(avgHrsVal - 7.5);
    const durationScore = Math.max(0, 100 - durationDev * 25);
    const feelingScore = totalFeelings > 0 ? (positive / totalFeelings) * 100 : 75;

    const qualityScore = Math.round(
      (durationScore * 0.40) +
      (consistencyScore * 0.45) +
      (feelingScore * 0.15)
    );

    let qualityLabel = 'Excellent Rest';
    if (qualityScore >= 85) {
      qualityLabel = 'Excellent Rest';
    } else if (qualityScore >= 70) {
      qualityLabel = 'Restorative Rest';
    } else if (qualityScore >= 50) {
      qualityLabel = 'Moderate Rest';
    } else {
      qualityLabel = 'Sub-optimal Sleep';
    }

    let recommendation = '';
    if (qualityScore >= 85) {
      recommendation = `Optimal rest profile across ${uniqueDaysCount} active days (${sessions.length} logs). Average bedtime is ${avgBedtime} and average wake time is ${avgWaketime}. Cognitive restorative cycles are optimal for CA Final statutory revisions.`;
    } else if (qualityScore >= 70) {
      recommendation = `Restorative rest pattern across ${uniqueDaysCount} active days (${sessions.length} logs). Average bedtime: ${avgBedtime}, Average wake time: ${avgWaketime}. Schedule stabilization will enhance focus stamina.`;
    } else if (avgHrsVal < 6) {
      recommendation = `CRITICAL ALERT: Average daily sleep (${avgDurationHrs} hrs/day, Bedtime: ${avgBedtime}, Wake: ${avgWaketime}) is below the 6-hour minimum. Increase sleep duration immediately to prevent memory decay.`;
    } else if (consistencyScore < 60) {
      recommendation = `VARIABLE SCHEDULE: Moderate total rest but irregular sleep timing (Avg Bedtime: ${avgBedtime}, Avg Wake: ${avgWaketime}). Sync sleep-wake cycles with daily study blocks.`;
    } else {
      recommendation = `Sufficient rest level (${avgDurationHrs} hrs/day average). Bedtime: ${avgBedtime}, Wake: ${avgWaketime}. Maintain consistent sleep hours.`;
    }

    return {
      hasData: true,
      count: sessions.length,
      daysCount: uniqueDaysCount,
      totalDurationMins: totalMins,
      avgDurationHrs,
      avgDurationText,
      avgBedtime,
      avgWaketime,
      achievementRate,
      qualityScore,
      qualityLabel,
      consistencyScore,
      consistencyLabel,
      feelingAnalysis: { positive, neutral, negative, total: totalFeelings },
      recommendation
    };
  }, [filteredSleepSessions, timeframeFilter, customStartDate, customEndDate]);

  // 1. Calculate Last 7 Days Sleep Data dynamically
  const last7DaysSleepData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    return days.map(date => {
      const dateStr = date.toDateString();
      const label = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
      const fullDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      
      const daySessions = (sleepSessions || []).filter(s => {
        if (!s.startTime) return false;
        return new Date(s.startTime).toDateString() === dateStr;
      });
      
      // Sum session minutes and strictly cap daily total sleep at 1440 mins (24 hours per day)
      const rawMinutes = daySessions.reduce((sum, s) => sum + Math.min(1440, s.duration || 0), 0);
      const totalMinutes = Math.min(1440, rawMinutes);
      const totalHours = Number(Math.min(24.0, totalMinutes / 60).toFixed(2));
      const feelings = daySessions
        .map(s => s.feeling)
        .filter(Boolean);

      return {
        name: label,
        fullDate,
        hours: totalHours,
        feelingsText: feelings.join(', ') || undefined,
        sessionsCount: daySessions.length
      };
    });
  }, [sleepSessions]);

  // Calculate Last 30 Days Sleep Data with linear trendline
  const last30DaysSleepResult = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    const rawData = days.map((date, idx) => {
      const dateStr = date.toDateString();
      const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const fullDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      
      const daySessions = (sleepSessions || []).filter(s => {
        if (!s.startTime) return false;
        return new Date(s.startTime).toDateString() === dateStr;
      });
      
      const rawMinutes = daySessions.reduce((sum, s) => sum + Math.min(1440, s.duration || 0), 0);
      const totalMinutes = Math.min(1440, rawMinutes);
      const totalHours = Number(Math.min(24.0, totalMinutes / 60).toFixed(2));
      const feelings = daySessions
        .map(s => s.feeling)
        .filter(Boolean);

      return {
        x: idx,
        name: label,
        fullDate,
        hours: totalHours,
        feelingsText: feelings.join(', ') || undefined,
        sessionsCount: daySessions.length
      };
    });

    // Simple Linear Regression: y = m * x + c
    const n = rawData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      const x = rawData[i].x;
      const y = rawData[i].hours;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const denominator = (n * sumXX - sumX * sumX);
    const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const intercept = denominator === 0 ? (sumY / n) : (sumY - slope * sumX) / n;

    const dataWithTrend = rawData.map(item => {
      const trendValue = slope * item.x + intercept;
      return {
        ...item,
        // Bound trendline strictly between 0 and 24 hours
        trend: Number(Math.max(0, Math.min(24.0, trendValue)).toFixed(2))
      };
    });

    let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (slope > 0.01) {
      direction = 'increasing';
    } else if (slope < -0.01) {
      direction = 'decreasing';
    }

    return {
      data: dataWithTrend,
      slope: Number(slope.toFixed(4)),
      direction
    };
  }, [sleepSessions]);

  // --- HABITS: ROUTINE MEAL CONSUMPTION & CIRCADIAN HEATMAP ENGINE ---
  const [pomoLogsVersion, setPomoLogsVersion] = useState<number>(0);

  React.useEffect(() => {
    const handleUpdate = () => {
      setPomoLogsVersion(v => v + 1);
    };
    window.addEventListener('practca_pomo_logs_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('practca_pomo_logs_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Helper date formatter: YYYY-MM-DD
  const formatLocalDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper time parser: extracts minutes from midnight (0..1439)
  const parseMinutesFromTimeStr = (timeStr?: string): number => {
    if (!timeStr) return -1;
    if (timeStr.includes('T')) {
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        return d.getHours() * 60 + d.getMinutes();
      }
    }
    const isPM = /pm/i.test(timeStr);
    const isAM = /am/i.test(timeStr);
    const cleaned = timeStr.replace(/[^0-9:]/g, '');
    const parts = cleaned.split(':').map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      let h = parts[0];
      const m = parts[1];
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      return (h % 24) * 60 + (m % 60);
    }
    return -1;
  };

  // Helper time formatter: minutes from midnight -> 12-hour AM/PM string
  const formatMinsToAmPm = (mins: number): string => {
    if (mins < 0 || isNaN(mins)) return 'N/A';
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Compact formatter: e.g. "8:15A", "1:30P"
  const formatMinsToCompact = (mins: number): string => {
    if (mins < 0 || isNaN(mins)) return '—';
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const ampm = h >= 12 ? 'P' : 'A';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')}${ampm}`;
  };

  // Circular trigonometric vector mean & standard deviation calculation for circular 24h timeline
  const computeCircularMeanTime = (minutesList: number[]): { avgTimeStr: string; avgMins: number; stdDevMins: number } => {
    if (minutesList.length === 0) {
      return { avgTimeStr: 'N/A', avgMins: -1, stdDevMins: 0 };
    }
    let sumSin = 0;
    let sumCos = 0;
    minutesList.forEach(m => {
      const angle = (m / 1440) * 2 * Math.PI;
      sumSin += Math.sin(angle);
      sumCos += Math.cos(angle);
    });
    let meanAngle = Math.atan2(sumSin, sumCos);
    if (meanAngle < 0) meanAngle += 2 * Math.PI;
    const avgMins = Math.round((meanAngle / (2 * Math.PI)) * 1440) % 1440;

    let sumDiffSq = 0;
    minutesList.forEach(m => {
      let diff = Math.abs(m - avgMins);
      if (diff > 720) diff = 1440 - diff;
      sumDiffSq += diff * diff;
    });
    const stdDevMins = Math.round(Math.sqrt(sumDiffSq / minutesList.length));

    return {
      avgTimeStr: formatMinsToAmPm(avgMins),
      avgMins,
      stdDevMins
    };
  };

  // Meal window classification
  const classifyMealStatus = (mealType: 'breakfast' | 'lunch' | 'dinner', mins: number): {
    status: 'optimal' | 'permissible' | 'late';
    statusLabel: string;
  } => {
    if (mealType === 'breakfast') {
      // Golden Window: 7:00 AM – 9:00 AM (420 to 540)
      if (mins >= 420 && mins <= 540) {
        return { status: 'optimal', statusLabel: 'Golden Window (7:00–9:00 AM)' };
      }
      // Permissible: 5:30 AM – 7:00 AM or 9:00 AM – 10:30 AM
      if ((mins >= 330 && mins < 420) || (mins > 540 && mins <= 630)) {
        return { status: 'permissible', statusLabel: 'Permissible Slot' };
      }
      return { status: 'late', statusLabel: 'Delayed / Edge Window' };
    } else if (mealType === 'lunch') {
      // Golden Window: 12:30 PM – 1:45 PM (750 to 825) - Concludes before 2-5 PM ICAI exam slot
      if (mins >= 750 && mins <= 825) {
        return { status: 'optimal', statusLabel: 'Optimal Pre-Exam Slot (12:30–1:45 PM)' };
      }
      // Permissible: 12:00 PM – 12:30 PM or 1:45 PM – 2:30 PM
      if ((mins >= 720 && mins < 750) || (mins > 825 && mins <= 870)) {
        return { status: 'permissible', statusLabel: 'Permissible Slot' };
      }
      return { status: 'late', statusLabel: 'Late / Overlaps 2–5 PM Exam Slot' };
    } else {
      // Dinner: Golden Window 7:30 PM – 9:00 PM (1170 to 1260)
      if (mins >= 1170 && mins <= 1260) {
        return { status: 'optimal', statusLabel: 'Optimal Restorative Slot (7:30–9:00 PM)' };
      }
      // Permissible: 6:30 PM – 7:30 PM or 9:00 PM – 10:15 PM
      if ((mins >= 1110 && mins < 1170) || (mins > 1260 && mins <= 1335)) {
        return { status: 'permissible', statusLabel: 'Permissible Slot' };
      }
      return { status: 'late', statusLabel: 'Late / Delays Deep Sleep Onset' };
    }
  };

  // Process routine meal records and build rolling 14-day heatmap and 24h distribution
  const habitsAnalysisData = useMemo(() => {
    // 1. Gather all logs from localStorage
    let allLogs: any[] = [];
    try {
      const pRaw = localStorage.getItem('practca_pomo_logs');
      const sRaw = localStorage.getItem('practca_session_logs');
      const pList = pRaw ? JSON.parse(pRaw) : [];
      const sList = sRaw ? JSON.parse(sRaw) : [];
      allLogs = [
        ...(Array.isArray(pList) ? pList : []),
        ...(Array.isArray(sList) ? sList : [])
      ];
    } catch (e) {
      console.error('Error reading meal routine logs from localStorage', e);
    }

    // 2. Identify and filter breakfast, lunch, and dinner routine logs
    interface ParsedMeal {
      id: string;
      dateStr: string;
      mealType: 'breakfast' | 'lunch' | 'dinner';
      startMins: number;
      durationMins: number;
      startTimeStr: string;
      notes?: string;
      isRealLog: boolean;
      status: 'optimal' | 'permissible' | 'late';
      statusLabel: string;
    }

    const realMealLogs: ParsedMeal[] = [];

    allLogs.forEach((log: any) => {
      if (!log) return;
      const combined = `${log.notes || ''} ${log.taskTitle || ''} ${log.title || ''} ${log.subMode || ''} ${log.routineType || ''}`.toLowerCase();
      const isRoutine = log.mode === 'routine' || combined.includes('routine') || combined.includes('meal');
      if (!isRoutine) return;

      let mealType: 'breakfast' | 'lunch' | 'dinner' | null = null;
      if (combined.includes('breakfast')) mealType = 'breakfast';
      else if (combined.includes('lunch')) mealType = 'lunch';
      else if (combined.includes('dinner')) mealType = 'dinner';
      if (!mealType) return;

      const dateStr = log.date || (log.startTime && log.startTime.includes('T') ? log.startTime.split('T')[0] : formatLocalDate(new Date()));
      const startMins = parseMinutesFromTimeStr(log.startTime);
      if (startMins < 0) return;

      const durMins = log.durationSeconds ? Math.round(Number(log.durationSeconds) / 60) : (log.duration || 25);
      const classification = classifyMealStatus(mealType, startMins);

      realMealLogs.push({
        id: log.id || `meal_${Date.now()}_${Math.random()}`,
        dateStr,
        mealType,
        startMins,
        durationMins: Math.min(120, Math.max(5, durMins)),
        startTimeStr: formatMinsToAmPm(startMins),
        notes: log.notes || undefined,
        isRealLog: true,
        status: classification.status,
        statusLabel: classification.statusLabel
      });
    });

    // 3. Build rolling 14-day calendar matrix (Days: today - 13 down to today)
    const rollingDays: {
      dateObj: Date;
      dateStr: string;
      dayLabel: string;
      fullDateLabel: string;
      isToday: boolean;
      meals: {
        breakfast: ParsedMeal | null;
        lunch: ParsedMeal | null;
        dinner: ParsedMeal | null;
      };
    }[] = [];

    const now = new Date();
    // Baseline sample generation if user has fewer than 3 total recorded meals
    const hasSparseData = realMealLogs.length < 3;

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dStr = formatLocalDate(d);
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
      const fullDateLabel = d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
      const isToday = i === 0;

      // Find real logs for this day
      const dayRealMeals = realMealLogs.filter(m => m.dateStr === dStr);
      let bFast = dayRealMeals.find(m => m.mealType === 'breakfast') || null;
      let lunch = dayRealMeals.find(m => m.mealType === 'lunch') || null;
      let dinner = dayRealMeals.find(m => m.mealType === 'dinner') || null;

      // If sparse data, provide realistic baseline sample logs so the heatmap is visually demonstrative
      if (hasSparseData) {
        const seed = (d.getDate() * 17 + i * 31) % 100;
        if (!bFast && i <= 10) {
          const bMins = 475 + (seed % 35); // ~7:55 AM – 8:30 AM
          const c = classifyMealStatus('breakfast', bMins);
          bFast = {
            id: `sample_b_${dStr}`,
            dateStr: dStr,
            mealType: 'breakfast',
            startMins: bMins,
            durationMins: 25,
            startTimeStr: formatMinsToAmPm(bMins),
            notes: 'Baseline Breakfast (Routine Mode)',
            isRealLog: false,
            status: c.status,
            statusLabel: c.statusLabel
          };
        }
        if (!lunch && i <= 10) {
          const lMins = 780 + (seed % 40); // ~1:00 PM – 1:40 PM
          const c = classifyMealStatus('lunch', lMins);
          lunch = {
            id: `sample_l_${dStr}`,
            dateStr: dStr,
            mealType: 'lunch',
            startMins: lMins,
            durationMins: 30,
            startTimeStr: formatMinsToAmPm(lMins),
            notes: 'Baseline Lunch (Routine Mode)',
            isRealLog: false,
            status: c.status,
            statusLabel: c.statusLabel
          };
        }
        if (!dinner && i <= 10) {
          const dMins = 1215 + (seed % 45); // ~8:15 PM – 9:00 PM
          const c = classifyMealStatus('dinner', dMins);
          dinner = {
            id: `sample_d_${dStr}`,
            dateStr: dStr,
            mealType: 'dinner',
            startMins: dMins,
            durationMins: 30,
            startTimeStr: formatMinsToAmPm(dMins),
            notes: 'Baseline Dinner (Routine Mode)',
            isRealLog: false,
            status: c.status,
            statusLabel: c.statusLabel
          };
        }
      }

      rollingDays.push({
        dateObj: d,
        dateStr: dStr,
        dayLabel,
        fullDateLabel,
        isToday,
        meals: {
          breakfast: bFast,
          lunch,
          dinner
        }
      });
    }

    // 4. Compute Habit Statistics for each meal across active records
    const allEffectiveMeals: ParsedMeal[] = [];
    rollingDays.forEach(day => {
      if (day.meals.breakfast) allEffectiveMeals.push(day.meals.breakfast);
      if (day.meals.lunch) allEffectiveMeals.push(day.meals.lunch);
      if (day.meals.dinner) allEffectiveMeals.push(day.meals.dinner);
    });

    const getStatsForMeal = (type: 'breakfast' | 'lunch' | 'dinner') => {
      const list = allEffectiveMeals.filter(m => m.mealType === type);
      const minutesList = list.map(m => m.startMins);
      const circ = computeCircularMeanTime(minutesList);
      const optimalCount = list.filter(m => m.status === 'optimal').length;
      const compliancePct = list.length > 0 ? Math.round((optimalCount / list.length) * 100) : 0;
      return {
        ...circ,
        count: list.length,
        optimalCount,
        compliancePct
      };
    };

    const breakfastStats = getStatsForMeal('breakfast');
    const lunchStats = getStatsForMeal('lunch');
    const dinnerStats = getStatsForMeal('dinner');

    // Overall Circadian Regularity Score (0-100%)
    const avgStdDev = (breakfastStats.stdDevMins + lunchStats.stdDevMins + dinnerStats.stdDevMins) / 3;
    const regularityScore = Math.max(30, Math.min(100, Math.round(100 - (avgStdDev - 12) * 1.6)));

    // 5. Build 24-Hour Circadian Distribution Matrix (Hours 04:00 to 24:00)
    const distributionHours = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const hourClusters: Record<string, Record<number, number>> = {
      breakfast: {},
      lunch: {},
      dinner: {}
    };

    distributionHours.forEach(h => {
      hourClusters.breakfast[h] = 0;
      hourClusters.lunch[h] = 0;
      hourClusters.dinner[h] = 0;
    });

    allEffectiveMeals.forEach(m => {
      const h = Math.floor(m.startMins / 60);
      if (hourClusters[m.mealType] && hourClusters[m.mealType][h] !== undefined) {
        hourClusters[m.mealType][h]++;
      }
    });

    return {
      rollingDays,
      realLogsCount: realMealLogs.length,
      hasSparseData,
      breakfastStats,
      lunchStats,
      dinnerStats,
      regularityScore,
      distributionHours,
      hourClusters
    };
  }, [pomoLogsVersion]);

  const handleLoggedWakeUp = () => {
    onStopSleep(localFeeling.trim() || undefined);
    setLocalFeeling('');
  };

  return (
    <div className="space-y-4 w-full max-w-full pb-12 animate-fadeIn text-left">
      {/* Dynamic Upper Header Section (Locked & Scroll-Diminished) */}
      <div className="locked-internal-header">
        <div className="locked-internal-header-card relative overflow-hidden bg-gradient-to-r from-[#131f3b] via-[#1c264b] to-[#172844] border border-violet-400/55 ring-1 ring-white/[0.06] rounded-2xl px-5 py-5 sm:px-7 sm:py-6">
          {/* Top Luminous Violet-Rose-Emerald Hairline */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-400 via-rose-400 to-emerald-400 opacity-90 pointer-events-none" />
          <div className="absolute top-0 right-12 h-32 w-48 bg-violet-500/12 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-400/30 to-rose-500/15 border border-violet-300/60 shadow-[0_0_14px_rgba(139,92,246,0.3)] flex items-center justify-center shrink-0">
                  <Moon className="h-5 w-5 text-violet-200" />
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mr-1 drop-shadow-xs">
                  Mind Space
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-200 text-[10.5px] font-mono font-extrabold uppercase tracking-widest border border-violet-400/45 shadow-2xs">
                  Mental Equilibrium
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-mono font-extrabold uppercase tracking-widest border border-emerald-400/45 shadow-2xs">
                  Syllabus Stamina
                </span>
                <a 
                  href="#calm-breath-studio" 
                  className="px-2.5 py-0.5 rounded-full bg-teal-500/20 hover:bg-teal-400 text-teal-200 hover:text-slate-950 text-[10px] font-mono font-extrabold uppercase tracking-widest border border-teal-400/50 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Jump to Guided Breathing & Calm Reset Studio"
                >
                  <Wind className="h-3 w-3" />
                  <span>Calm Breath Studio</span>
                </a>
                <a 
                  href="#habits-section" 
                  className="px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-400 text-amber-200 hover:text-slate-950 text-[10px] font-mono font-extrabold uppercase tracking-widest border border-amber-400/50 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Jump directly to Routine Meal Habits & Heatmap"
                >
                  <Utensils className="h-3 w-3" />
                  <span>Habits Heatmap</span>
                </a>
              </div>
            </div>
            
            <div className="bg-[#061322]/90 border border-violet-400/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 shadow-inner shrink-0">
              <div className="p-1.5 bg-violet-500/20 rounded-lg border border-violet-400/40">
                <Activity className="h-4 w-4 text-violet-300" />
              </div>
              <div>
                <p className="header-diminish-hide text-[9px] text-violet-200/80 font-mono font-extrabold uppercase tracking-wider">Current Mental Index</p>
                <p className="text-xs sm:text-sm font-black text-emerald-300 font-sans tracking-wide">STABLE STAMINA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Breathing & Calm Reset Studio (Dedicated Card + Optional Zen Fullscreen Sanctuary) */}
      <CalmBreathStudio />

      {/* Grid: 1. Live Sleep Monitor, 2. Statistics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Control Console (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Live Monitor Card */}
          <div className="bg-cav-card border border-cav-border rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3">
              <div className="flex items-center gap-2">
                <Moon className="h-4.5 w-4.5 text-violet-400" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">🛌 Live Rest Control Panel</h2>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-mono font-black uppercase tracking-wider ${
                isPowerNapping
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                  : isSleeping 
                    ? 'bg-violet-500/15 text-violet-400 border border-violet-500/25 animate-pulse' 
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
              }`}>
                {isPowerNapping ? '⚡ Power Nap Active' : isSleeping ? '🌙 Full Rest Mode' : 'State: Awake & Focused'}
              </span>
            </div>

            {isPowerNapping ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
                    <p className="text-xs text-amber-400 uppercase tracking-widest font-mono font-black">
                      Power Nap Countdown Timer
                    </p>
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-amber-400 font-mono tracking-wider tabular-nums">
                    {formatSecondsToMinsSecs(powerNapTimeLeftSeconds)}
                  </p>
                  <p className="text-[10.5px] text-slate-300 font-mono">
                    Target: <span className="text-amber-400 font-bold">{powerNapTargetMins} mins</span> • Loud Audio Alarm set when timer hits 00:00
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onStopPowerNap) {
                        onStopPowerNap(localFeeling || 'Refreshed & Energized');
                      } else {
                        onStopSleep(localFeeling || 'Refreshed & Energized');
                      }
                      setLocalFeeling('');
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    🌅 STOP POWER NAP & WAKE UP NOW (1-CLICK)
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Optional feeling note (e.g. Clear mind, refreshed)..."
                      value={localFeeling}
                      onChange={(e) => setLocalFeeling(e.target.value)}
                      className="flex-1 bg-cav-bg border border-cav-border focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-slate-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => onSnoozePowerNap?.(5)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl text-xs font-bold font-mono transition cursor-pointer shrink-0"
                    >
                      ⏰ Snooze 5m
                    </button>
                  </div>
                </div>
              </div>
            ) : isSleeping ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-cav-bg/70 border border-cav-border p-5 rounded-2xl text-center space-y-3">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">Elapsed Sleep Duration</p>
                  <p className="text-3xl md:text-4xl font-black text-violet-400 font-mono tracking-wider tabular-nums">
                    {elapsedSleepText}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                    How refreshed do you feel? (Self-Assessment)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Very refreshed, light headache, tired, energetic..."
                    value={localFeeling}
                    onChange={(e) => setLocalFeeling(e.target.value)}
                    className="w-full bg-cav-bg border border-cav-border focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none placeholder-slate-500 transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleLoggedWakeUp}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition duration-150 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  🌅 Log Wake Up & Store Session
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {/* Dual Station Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Power Nap Station */}
                  <div className="bg-cav-bg/80 border border-amber-500/20 p-4 rounded-xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 fill-amber-400" />
                        Power Nap (Alarm)
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-400">Max 30 Mins</span>
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {[5, 10, 15, 20, 25, 30].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedNapPreset(m);
                            setCustomNapInput('');
                          }}
                          className={`h-7 rounded-lg text-[10px] font-mono font-bold transition border cursor-pointer flex items-center justify-center ${
                            selectedNapPreset === m && !customNapInput
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                              : 'bg-cav-card text-slate-400 border-cav-border hover:text-white'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>

                    {/* Manual Custom Time Set */}
                    <div className="space-y-1 pt-0.5">
                      <label className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        Manual Time Set (1–30 Mins):
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        placeholder="E.g. 25 (Max 30)"
                        value={customNapInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomNapInput(val);
                          if (val) {
                            const parsed = parseInt(val, 10);
                            if (!isNaN(parsed)) {
                              const capped = Math.min(30, Math.max(1, parsed));
                              setSelectedNapPreset(capped);
                            }
                          }
                        }}
                        className="w-full h-9 bg-cav-card border border-cav-border focus:border-amber-500 rounded-lg px-3 text-xs text-white outline-none font-mono font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        let mins = selectedNapPreset;
                        if (customNapInput) {
                          const parsed = parseInt(customNapInput, 10);
                          if (!isNaN(parsed) && parsed > 0) {
                            mins = Math.min(30, Math.max(1, parsed));
                          }
                        }
                        onStartPowerNap?.(mins);
                      }}
                      className="w-full h-10 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="h-3.5 w-3.5 fill-slate-950" />
                      <span>Start {customNapInput || selectedNapPreset}-Min Nap</span>
                    </button>
                  </div>

                  {/* Full Night Sleep Station */}
                  <div className="bg-cav-bg/80 border border-indigo-500/20 p-4 rounded-xl space-y-3 text-left flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] font-mono font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Moon className="h-3.5 w-3.5 fill-indigo-400" />
                        Full Overnight Sleep
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onStartSleep}
                      className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-md shadow-indigo-600/15 flex items-center justify-center gap-1.5"
                    >
                      <Moon className="h-3.5 w-3.5 fill-white" />
                      <span>Start Overnight Sleep</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRequestRestMode ? onRequestRestMode() : onStartSleep()}
                  className="w-full h-10 bg-cav-bg hover:bg-cav-sidebar text-slate-300 border border-cav-border rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>😴 Choose Rest Channel (Modal Console)</span>
                </button>
              </div>
            )}
          </div>

          {/* 💧 Hydration Tracker Card */}
          <div className="bg-cav-card border border-cav-border rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">💧 Daily Hydration Stamina Planner</h2>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-mono font-black uppercase tracking-wider ${
                hydrationReminderEnabled 
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                Reminders: {hydrationReminderEnabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              
              {/* Left Sub-Section: Live Logging & Current Progress */}
              <div className="bg-cav-bg/80 border border-cav-border p-4 rounded-xl flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Today's Intake Progress</span>
                    <span className="text-[10px] text-cyan-400 font-mono font-black">
                      {Math.round((dailyHydrationCount / dailyHydrationTarget) * 100)}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (dailyHydrationCount / dailyHydrationTarget) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-black text-white font-mono">{dailyHydrationCount} / {dailyHydrationTarget} Glasses</span>
                    <span className="text-[10px] text-slate-500 font-sans">1 Glass = 250ml</span>
                  </div>
                </div>

                {/* Glass representation bubbles */}
                <div className="flex flex-wrap gap-1.5 justify-center py-1">
                  {Array.from({ length: dailyHydrationTarget }).map((_, i) => {
                    const isHydrated = i < dailyHydrationCount;
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        disabled={isHydrated}
                        onClick={onLogHydration}
                        whileHover={isHydrated ? {} : { scale: 1.15, y: -2 }}
                        whileTap={isHydrated ? {} : { scale: 0.9 }}
                        initial={isHydrated ? { scale: 1.05 } : { scale: 1 }}
                        animate={isHydrated ? { scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className={`w-7 h-9 rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isHydrated
                            ? 'bg-gradient-to-b from-cyan-500/30 to-blue-500/20 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/5 cursor-default'
                            : 'bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-600 hover:text-slate-400 cursor-pointer'
                        }`}
                        title={isHydrated ? "Hydrated!" : "Click to log glass"}
                      >
                        <motion.div
                          animate={isHydrated ? { y: [0, -3, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <Droplet className={`h-4.5 w-4.5 ${isHydrated ? 'fill-cyan-400 text-cyan-300' : ''}`} />
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onLogHydration}
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider transition duration-150 active:scale-[0.98] cursor-pointer"
                  >
                    ➕ Log 1 Glass
                  </button>
                  <button
                    type="button"
                    onClick={onResetHydration}
                    className="px-2.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold transition cursor-pointer"
                    title="Reset Intake Today"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Right Sub-Section: Reminder & Alert Settings */}
              <div className="bg-[#0b0f18] border border-slate-900 p-4 rounded-xl flex flex-col justify-between gap-4 text-left">
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">Reminder Control Desk</span>
                  
                  {/* Toggle Reminders */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hydrationReminderEnabled}
                      onChange={(e) => onToggleHydrationReminder(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/40 w-4 h-4 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-slate-200">Enable Hydration Reminders</p>
                    </div>
                  </label>

                  {/* Toggle Hydration Sound */}
                  <label className={`flex items-center gap-2.5 cursor-pointer select-none transition-opacity duration-200 ${!hydrationReminderEnabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={hydrationSoundEnabled}
                      onChange={(e) => onToggleHydrationSound?.(e.target.checked)}
                      disabled={!hydrationReminderEnabled}
                      className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/40 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-bold text-slate-200">Play Reminder Sound</p>
                    </div>
                  </label>

                  {/* Interval setting */}
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                      Reminder Interval:
                    </label>
                    <select
                      value={hydrationInterval}
                      onChange={(e) => onUpdateHydrationInterval(parseInt(e.target.value, 10))}
                      disabled={!hydrationReminderEnabled}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500 disabled:opacity-40"
                    >
                      <option value={15}>Every 15 Minutes (High Alert)</option>
                      <option value={30}>Every 30 Minutes</option>
                      <option value={45}>Every 45 Minutes (Recommended)</option>
                      <option value={60}>Every 60 Minutes</option>
                      <option value={90}>Every 90 Minutes</option>
                    </select>
                  </div>

                  {/* Target Glasses Setting */}
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                      Daily Target (Glasses):
                    </label>
                    <select
                      value={dailyHydrationTarget}
                      onChange={(e) => onUpdateHydrationTarget(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500"
                    >
                      {[4, 6, 8, 10, 12, 14, 16].map(num => (
                        <option key={num} value={num}>{num} Glasses (~{num * 250}ml)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Countdown display */}
                <div className="border-t border-slate-900 pt-3">
                  {hydrationReminderEnabled ? (
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Status:</span>
                      {!isStudyOrBreak ? (
                        <span className="text-amber-500/85 font-medium flex items-center gap-1">
                          <span>⏸️ Paused (Idle/Sleep Mode)</span>
                        </span>
                      ) : hydrationSnoozeEndTime !== null ? (
                        <span className="text-amber-400 font-bold animate-pulse flex items-center gap-1">
                          <span>⏰ Snoozed</span>
                        </span>
                      ) : (
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                          <span>T-minus {formatSecondsToMinsSecs(hydrationTimeLeftSeconds)}</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-600 font-mono italic text-center">
                      Reminders are currently asleep.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Today's Hydration Log history */}
            {hydrationHistory.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-900 text-left">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider font-mono">Today's Hydration Record Logs</span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-thin">
                  {hydrationHistory.map((timestamp, index) => {
                    const time = new Date(timestamp);
                    return (
                      <span 
                        key={index}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 rounded-lg text-[9px] font-mono flex items-center gap-1"
                      >
                        💧 Glass {hydrationHistory.length - index} at {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sleep History Ledger */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>📝 Rest Ledger & Logs</span>
              </h3>
              <span className="text-[9.5px] font-mono text-slate-500">
                {filteredSleepSessions.length} of {sleepSessions.length} logs
              </span>
            </div>
            
            {filteredSleepSessions.length === 0 ? (
              <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-850 rounded-xl">
                No sleep sessions logged within the active timeframe. Select another timeframe filter or enter rest mode above.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {filteredSleepSessions.map((session) => {
                  const sDate = new Date(session.startTime);
                  const eDate = new Date(session.endTime);
                  return (
                    <div 
                      key={session.id} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/30 p-3 rounded-xl border border-slate-900 hover:border-slate-800 transition text-slate-400 gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10.5px] text-slate-200 font-bold font-mono">
                            {sDate.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
                          </span>
                          <span className="text-[9.5px] text-slate-500 font-mono">
                            ({sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        </div>
                        {session.feeling && (
                          <div className="text-[9.5px] text-violet-400 italic font-sans flex items-center gap-1">
                            <Smile className="h-3 w-3 inline" /> Feeling: "{session.feeling}"
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3.5 self-end sm:self-center shrink-0">
                        <span className="text-white font-mono font-black text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
                          {formatMinsToHoursMins(session.duration)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteSleepSession(session.id)}
                          className="p-1 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          title="Delete rest log"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Statistics Charts & Analytics (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Wellbeing Stats Cards Grid (3-card high yield summary) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Avg Bedtime & Wake</p>
                <Clock className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              </div>
              <div className="flex flex-col pt-0.5 space-y-0.5">
                <div className="text-[11px] font-mono font-bold text-slate-200 flex items-center justify-between">
                  <span className="text-violet-400 text-[10px]">Bed:</span> <span>{filteredSleepMetrics.avgBedtime}</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-200 flex items-center justify-between">
                  <span className="text-amber-400 text-[10px]">Wake:</span> <span>{filteredSleepMetrics.avgWaketime}</span>
                </div>
              </div>
              <p className="text-[8px] font-mono text-slate-500 uppercase pt-0.5 truncate">
                {filteredSleepMetrics.count} logs in filter
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl space-y-1">
              <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Average Sleep Duration</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white font-mono">{filteredSleepMetrics.avgDurationHrs}</span>
                <span className="text-[10px] text-slate-500 font-bold font-sans">hrs / night</span>
              </div>
              <div className="mt-1 text-[8px] font-mono text-slate-400 uppercase flex items-center gap-1">
                <Coffee className="h-3 w-3 text-amber-500 shrink-0" /> Goal: 7.0 - 8.0 hrs
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl space-y-1">
              <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Target Compliance</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-violet-400 font-mono">{filteredSleepMetrics.achievementRate}%</span>
                <span className="text-[10px] text-slate-500 font-bold font-sans">6-8.5h</span>
              </div>
              <div className="mt-1 text-[8px] font-mono text-slate-400 uppercase flex items-center gap-1 truncate">
                <Award className="h-3 w-3 text-violet-400 shrink-0" /> {filteredSleepMetrics.qualityLabel}
              </div>
            </div>
          </div>

          {/* 🛌 7-Day sleep duration tracking (Recharts BarChart) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
              <div>
                <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Moon className="h-4.5 w-4.5 text-violet-400" />
                  7-Day Rest Duration Analysis
                </h3>
              </div>

              {/* Badges / Average indicator */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 font-mono text-[10px] font-bold">
                  Avg: {(last7DaysSleepData.reduce((sum, d) => sum + d.hours, 0) / 7).toFixed(1)} hrs/day
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px]">
                  Target: 7.0h
                </span>
              </div>
            </div>

            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysSleepData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="sleepBarGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="sleepBarGradientOptimal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="sleepBarGradientWarning" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="sleepBarGradientDeficit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#be123c" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={9} 
                    fontFamily="JetBrains Mono, monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={9} 
                    fontFamily="JetBrains Mono, monospace"
                    tickLine={false}
                    domain={[0, 12]}
                    ticks={[0, 3, 6, 9, 12]}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <Tooltip content={<SleepTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                  <ReferenceLine 
                    y={7.0} 
                    stroke="#10b981" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.2}
                    label={{
                      value: '7h Target',
                      position: 'right',
                      fill: '#10b981',
                      fontSize: 8,
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                  <Bar 
                    dataKey="hours" 
                    name="Sleep Time" 
                    radius={[5, 5, 0, 0]}
                    maxBarSize={40}
                  >
                    {last7DaysSleepData.map((entry, index) => {
                      const fillColor = entry.hours >= 7 && entry.hours <= 9
                        ? 'url(#sleepBarGradientOptimal)'
                        : entry.hours >= 6
                        ? 'url(#sleepBarGradientPrimary)'
                        : entry.hours > 0
                        ? 'url(#sleepBarGradientDeficit)'
                        : '#1e293b';
                      const strokeColor = entry.hours >= 7 && entry.hours <= 9
                        ? '#10b981'
                        : entry.hours >= 6
                        ? '#8b5cf6'
                        : entry.hours > 0
                        ? '#f43f5e'
                        : '#334155';
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={fillColor} 
                          stroke={strokeColor}
                          strokeWidth={1}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Chart Color Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[9.5px] font-mono text-slate-400 pt-1 border-t border-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                <span>Optimal (7–9 hrs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />
                <span>Adequate (6–7 hrs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                <span>Deficit (&lt;6 hrs)</span>
              </div>
            </div>
          </div>

          {/* 💤 Sleep Quality & Consistency Report Card with Timeframe Dropdown Filter */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 shadow-xl space-y-4">
            <div className="border-b border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="font-mono font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
                  Sleep Quality & Recovery Report
                </h3>
              </div>

              {/* Dynamic Timeframe Dropdown Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                <Filter className="h-3.5 w-3.5 text-violet-400 ml-1 shrink-0" />
                <select
                  value={timeframeFilter}
                  onChange={(e) => setTimeframeFilter(e.target.value as any)}
                  className="bg-transparent text-slate-200 text-xs font-mono font-bold outline-none cursor-pointer pr-1"
                >
                  <option value="current_week" className="bg-slate-950 text-white">🗓️ Current Week</option>
                  <option value="last_7_days" className="bg-slate-950 text-white">📅 Last 1 Week (7 Days)</option>
                  <option value="last_15_days" className="bg-slate-950 text-white">⏳ Last 15 Days</option>
                  <option value="last_30_days" className="bg-slate-950 text-white">📆 Last 1 Month (30 Days)</option>
                  <option value="current_month" className="bg-slate-950 text-white">📌 Current Month</option>
                  <option value="custom" className="bg-slate-950 text-white">🛠️ Custom Range</option>
                </select>
              </div>
            </div>

            {/* Custom Date Pickers when 'custom' is selected */}
            {timeframeFilter === 'custom' && (
              <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-xs">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-cyan-400" /> Custom Filter Range:
                </span>
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] text-slate-500 font-mono">From:</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 font-mono text-xs outline-none focus:border-violet-500"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-[10px] text-slate-500 font-mono">To:</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 font-mono text-xs outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            )}

            {!filteredSleepMetrics.hasData ? (
              <div className="p-6 text-center text-slate-600 text-xs border border-dashed border-slate-850 rounded-xl space-y-1">
                <p>No sleep sessions recorded within this timeframe.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score Indicators Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0b0f19] border border-slate-900 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Sleep Quality Index</span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-black text-white font-mono">{filteredSleepMetrics.qualityScore}</span>
                      <span className="text-[10px] text-slate-550 font-sans">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-850/55">
                      <div 
                        className={`h-full rounded-full ${
                          filteredSleepMetrics.qualityScore >= 80 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                            : filteredSleepMetrics.qualityScore >= 60 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                            : 'bg-gradient-to-r from-rose-500 to-red-500'
                        }`}
                        style={{ width: `${filteredSleepMetrics.qualityScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-[#0b0f19] border border-slate-900 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Consistency Index</span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-black text-violet-400 font-mono">{filteredSleepMetrics.consistencyScore}%</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 font-mono mt-2 flex items-center gap-1">
                      <Activity className="h-3 w-3 text-violet-400" /> {filteredSleepMetrics.consistencyLabel}
                    </p>
                  </div>
                </div>

                {/* Structured Diagnostics Parameters Table */}
                <div className="overflow-hidden rounded-xl border border-slate-900 bg-[#0b0f19]">
                  <table className="w-full text-left border-collapse text-[11px] text-slate-300">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-900 text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                        <th className="p-2.5">Diagnostic Parameter</th>
                        <th className="p-2.5 text-right">Computed Historic Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr>
                        <td className="p-2.5 font-sans flex items-center gap-1.5">
                          <Moon className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                          Average Sleep Duration
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-white">
                          {filteredSleepMetrics.avgDurationHrs} hrs/night <span className="text-[9.5px] text-slate-500 font-normal">({filteredSleepMetrics.avgDurationText})</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-sans flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          Average Sleep Start Time (Bedtime)
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-indigo-300">
                          {filteredSleepMetrics.avgBedtime}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-sans flex items-center gap-1.5">
                          <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          Average Wake Up Time
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-amber-300">
                          {filteredSleepMetrics.avgWaketime}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-sans flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          6-8.5 Hr Target Compliance
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                          {filteredSleepMetrics.achievementRate}%
                        </td>
                      </tr>
                      {filteredSleepMetrics.feelingAnalysis.total > 0 && (
                        <tr>
                          <td className="p-2.5 font-sans flex items-center gap-1.5">
                            <Smile className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            Wake Sentiment Ratio
                          </td>
                          <td className="p-2.5 text-right font-mono text-cyan-400 font-bold">
                            {filteredSleepMetrics.feelingAnalysis.positive} Pos / {filteredSleepMetrics.feelingAnalysis.negative} Neg
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="p-2.5 font-sans flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          Timeframe Sample Size
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-400">
                          {filteredSleepMetrics.count} sessions logged
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* High Yield Diagnostic Insight Block */}
                <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-xl text-left space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider">
                      Educator Cognitive Recovery Assessment
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {filteredSleepMetrics.recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📊 30-DAY SLEEP DURATION TREND & REGRESSION ANALYSIS */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
          <div>
            <h3 className="font-mono font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              30-Day Sleep Duration Trend & Regression Analysis
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {last30DaysSleepResult.direction === 'increasing' ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                📈 POSITIVE ACCLIMATION
              </span>
            ) : last30DaysSleepResult.direction === 'decreasing' ? (
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
                📉 ACCUMULATIVE BURNOUT ALERT
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                ⚖️ STABLE RECOVERY
              </span>
            )}
          </div>
        </div>

        {/* Highlight Insights */}
        <div className="bg-[#0b0f19] border border-slate-900 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-300">
          <span className="text-base text-cyan-400">💡</span>
          <div className="space-y-1 text-left">
            <h5 className="font-black text-slate-200 uppercase tracking-wide font-mono text-[10px]">
              Professional Educator Sleep Metric Insight:
            </h5>
            <p className="leading-relaxed">
              {last30DaysSleepResult.direction === 'increasing' ? (
                "Your trendline indicates a progressive acclimation to regular rest cycles. This positive trend primes the neural cortex for complex problem-solving and rapid formula retrieval during active revision of SFM Forex and Direct Tax topics."
              ) : last30DaysSleepResult.direction === 'decreasing' ? (
                "CRITICAL WARNING: Your 30-day rest slope is dropping. This linear decline signals an unsustainable cognitive deficit. Restoring at least 6.5 hours of sleep is urgent to prevent memory decay during Companies Act and Ind AS standard revisions."
              ) : (
                "Your rest pattern remains stable. Ensure sleep duration is kept above 6.5 hours daily. Maintaining this steady equilibrium prevents cognitive burnout and secures sustained focus across all eight CA Final exam subjects."
              )}
            </p>
          </div>
        </div>

        {/* 30-Day Composed Chart */}
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={last30DaysSleepResult.data} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="sleepBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={8.5} 
                fontFamily="JetBrains Mono, monospace"
                tickLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={8.5} 
                fontFamily="JetBrains Mono, monospace"
                tickLine={false}
                domain={[0, 12]}
                ticks={[0, 3, 6, 9, 12]}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip content={<TrendTooltip />} />
              
              {/* Daily Sleep Bars */}
              <Bar 
                dataKey="hours" 
                name="Sleep Time" 
                fill="url(#sleepBarGrad)" 
                stroke="#8b5cf6" 
                strokeWidth={1}
                radius={[4, 4, 0, 0]} 
              />
              
              {/* Regression Trendline */}
              <Line 
                type="monotone" 
                dataKey="trend" 
                name="Regression Trendline" 
                stroke="#06b6d4" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed stats sub-block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-900 text-center">
            <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Computed Slope (Δ Sleep/Day)</p>
            <p className="text-sm font-bold text-slate-200 mt-1 font-mono">
              {last30DaysSleepResult.slope > 0 ? '+' : ''}{last30DaysSleepResult.slope} hrs / day
            </p>
          </div>
          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-900 text-center">
            <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">30-Day Data Quality</p>
            <p className="text-sm font-bold text-slate-200 mt-1 font-mono">
              {last30DaysSleepResult.data.filter(d => d.hours > 0).length} / 30 Days Active
            </p>
          </div>
          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-900 text-center">
            <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">Sustained Rest Level</p>
            <p className="text-sm font-bold text-slate-200 mt-1 font-mono">
              {(last30DaysSleepResult.data.reduce((sum, d) => sum + d.hours, 0) / 30).toFixed(2)} hrs Average
            </p>
          </div>
        </div>
      </div>

      {/* 🥗 HABITS & ROUTINE MEAL CONSUMPTION: CIRCADIAN HEATMAP SECTION */}
      <div id="habits-section" className="bg-slate-950 border border-slate-850 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 text-left">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 px-2.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-widest border border-emerald-500/20">
                Circadian Rhythm & Metabolic Hygiene
              </span>
              <span className="text-slate-500 text-xs font-mono">• Routine Mode Logs</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white font-sans tracking-tight mt-1.5 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-emerald-400 shrink-0" />
              Habits: Routine Meal Consumption & Consistency Heatmap
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              habitsAnalysisData.regularityScore >= 80
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : habitsAnalysisData.regularityScore >= 65
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <ShieldCheck className="h-4 w-4" />
              <span>Regularity Index: {habitsAnalysisData.regularityScore}%</span>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              {habitsAnalysisData.realLogsCount} Live Meal Logs Recorded
            </span>
          </div>
        </div>

        {/* 3 Metric Cards: Breakfast, Lunch, Dinner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Breakfast Card */}
          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5" /> 🍳 Breakfast Habit
              </span>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                4:00 AM – 12:00 PM
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-2xl font-black font-mono text-white">
                  {habitsAnalysisData.breakfastStats.avgTimeStr}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Mean Time (±{habitsAnalysisData.breakfastStats.stdDevMins}m variance)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {habitsAnalysisData.breakfastStats.compliancePct}%
                </span>
                <p className="text-[9px] text-slate-500 font-mono">Golden Window</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-850/80 text-[10.5px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="text-slate-400">Target Slot:</span>
                <span className="text-amber-300 font-bold">7:00 AM – 9:00 AM</span>
              </div>
            </div>
          </div>

          {/* Lunch Card */}
          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5" /> 🍲 Lunch Habit
              </span>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                12:00 PM – 6:00 PM
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-2xl font-black font-mono text-white">
                  {habitsAnalysisData.lunchStats.avgTimeStr}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Mean Time (±{habitsAnalysisData.lunchStats.stdDevMins}m variance)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {habitsAnalysisData.lunchStats.compliancePct}%
                </span>
                <p className="text-[9px] text-slate-500 font-mono">Pre-Exam Slot</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-850/80 text-[10.5px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="text-slate-400">Target Slot:</span>
                <span className="text-emerald-300 font-bold">12:30 PM – 1:45 PM</span>
              </div>
            </div>
          </div>

          {/* Dinner Card */}
          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                <Moon className="h-3.5 w-3.5" /> 🍽️ Dinner Habit
              </span>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                6:00 PM – 4:00 AM
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <p className="text-2xl font-black font-mono text-white">
                  {habitsAnalysisData.dinnerStats.avgTimeStr}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Mean Time (±{habitsAnalysisData.dinnerStats.stdDevMins}m variance)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-violet-400">
                  {habitsAnalysisData.dinnerStats.compliancePct}%
                </span>
                <p className="text-[9px] text-slate-500 font-mono">Restorative Slot</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-850/80 text-[10.5px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between font-mono text-[9.5px]">
                <span className="text-slate-400">Target Slot:</span>
                <span className="text-violet-300 font-bold">7:30 PM – 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 14-Day Calendar Matrix Heatmap */}
        <div className="bg-[#060810] border border-slate-800 rounded-xl p-4 md:p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <span>🗓️ 14-Day Routine Meal Consumption Matrix (Consistency Heatmap)</span>
              </h4>
            </div>
            {habitsAnalysisData.hasSparseData && (
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                Demonstration Baseline & Active Logs
              </span>
            )}
          </div>

          <div className="overflow-x-auto pb-1 scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-2 text-[10px] font-mono uppercase font-bold text-slate-400 bg-slate-950/80 sticky left-0 z-10 w-28 min-w-[110px] border-r border-slate-850">
                    Meal Track
                  </th>
                  {habitsAnalysisData.rollingDays.map((day) => (
                    <th 
                      key={day.dateStr} 
                      className={`p-2 text-center min-w-[58px] ${
                        day.isToday 
                          ? 'bg-indigo-950/40 text-indigo-300 border-x border-indigo-500/30' 
                          : 'text-slate-400'
                      }`}
                    >
                      <div className="font-mono text-[9px] uppercase font-semibold">
                        {day.dayLabel.split(' ')[0]}
                      </div>
                      <div className="font-mono text-[11px] font-extrabold text-white">
                        {day.dayLabel.split(' ')[1]}
                      </div>
                      {day.isToday && (
                        <div className="text-[7.5px] font-mono text-cyan-400 uppercase tracking-widest mt-0.5">
                          TODAY
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60">
                {/* Breakfast Row */}
                <tr className="hover:bg-slate-900/20 transition">
                  <td className="p-2 text-[10.5px] font-mono font-bold text-amber-300 bg-slate-950/90 sticky left-0 z-10 border-r border-slate-850 flex items-center gap-1.5">
                    <span>🍳</span>
                    <span>Breakfast</span>
                  </td>
                  {habitsAnalysisData.rollingDays.map((day) => {
                    const meal = day.meals.breakfast;
                    if (!meal) {
                      return (
                        <td key={day.dateStr} className="p-1.5 text-center">
                          <div 
                            title={`${day.fullDateLabel}: Breakfast not logged in routine mode`}
                            className="h-10 rounded-lg bg-slate-900/30 border border-dashed border-slate-800/80 flex items-center justify-center text-[10px] font-mono text-slate-600"
                          >
                            —
                          </div>
                        </td>
                      );
                    }
                    const cellStyle = meal.status === 'optimal'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                      : meal.status === 'permissible'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.1)]';

                    return (
                      <td key={day.dateStr} className="p-1.5 text-center">
                        <div 
                          title={`${day.fullDateLabel}: Breakfast consumed at ${meal.startTimeStr} (${meal.durationMins}m) • ${meal.statusLabel}${meal.notes ? ` • "${meal.notes}"` : ''}`}
                          className={`h-10 rounded-lg border p-1 flex flex-col items-center justify-center transition hover:scale-105 cursor-pointer ${cellStyle}`}
                        >
                          <span className="font-mono text-[10.5px] font-black tracking-tight leading-none">
                            {formatMinsToCompact(meal.startMins)}
                          </span>
                          <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5 opacity-80">
                            {meal.durationMins}m
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Lunch Row */}
                <tr className="hover:bg-slate-900/20 transition">
                  <td className="p-2 text-[10.5px] font-mono font-bold text-emerald-300 bg-slate-950/90 sticky left-0 z-10 border-r border-slate-850 flex items-center gap-1.5">
                    <span>🍲</span>
                    <span>Lunch</span>
                  </td>
                  {habitsAnalysisData.rollingDays.map((day) => {
                    const meal = day.meals.lunch;
                    if (!meal) {
                      return (
                        <td key={day.dateStr} className="p-1.5 text-center">
                          <div 
                            title={`${day.fullDateLabel}: Lunch not logged in routine mode`}
                            className="h-10 rounded-lg bg-slate-900/30 border border-dashed border-slate-800/80 flex items-center justify-center text-[10px] font-mono text-slate-600"
                          >
                            —
                          </div>
                        </td>
                      );
                    }
                    const cellStyle = meal.status === 'optimal'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                      : meal.status === 'permissible'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.1)]';

                    return (
                      <td key={day.dateStr} className="p-1.5 text-center">
                        <div 
                          title={`${day.fullDateLabel}: Lunch consumed at ${meal.startTimeStr} (${meal.durationMins}m) • ${meal.statusLabel}${meal.notes ? ` • "${meal.notes}"` : ''}`}
                          className={`h-10 rounded-lg border p-1 flex flex-col items-center justify-center transition hover:scale-105 cursor-pointer ${cellStyle}`}
                        >
                          <span className="font-mono text-[10.5px] font-black tracking-tight leading-none">
                            {formatMinsToCompact(meal.startMins)}
                          </span>
                          <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5 opacity-80">
                            {meal.durationMins}m
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Dinner Row */}
                <tr className="hover:bg-slate-900/20 transition">
                  <td className="p-2 text-[10.5px] font-mono font-bold text-violet-300 bg-slate-950/90 sticky left-0 z-10 border-r border-slate-850 flex items-center gap-1.5">
                    <span>🍽️</span>
                    <span>Dinner</span>
                  </td>
                  {habitsAnalysisData.rollingDays.map((day) => {
                    const meal = day.meals.dinner;
                    if (!meal) {
                      return (
                        <td key={day.dateStr} className="p-1.5 text-center">
                          <div 
                            title={`${day.fullDateLabel}: Dinner not logged in routine mode`}
                            className="h-10 rounded-lg bg-slate-900/30 border border-dashed border-slate-800/80 flex items-center justify-center text-[10px] font-mono text-slate-600"
                          >
                            —
                          </div>
                        </td>
                      );
                    }
                    const cellStyle = meal.status === 'optimal'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                      : meal.status === 'permissible'
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.1)]';

                    return (
                      <td key={day.dateStr} className="p-1.5 text-center">
                        <div 
                          title={`${day.fullDateLabel}: Dinner consumed at ${meal.startTimeStr} (${meal.durationMins}m) • ${meal.statusLabel}${meal.notes ? ` • "${meal.notes}"` : ''}`}
                          className={`h-10 rounded-lg border p-1 flex flex-col items-center justify-center transition hover:scale-105 cursor-pointer ${cellStyle}`}
                        >
                          <span className="font-mono text-[10.5px] font-black tracking-tight leading-none">
                            {formatMinsToCompact(meal.startMins)}
                          </span>
                          <span className="text-[7.5px] font-mono font-bold uppercase mt-0.5 opacity-80">
                            {meal.durationMins}m
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-400 inline-block" />
                <span className="text-slate-300">Golden Window (Optimal Cognitive Slot)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-400 inline-block" />
                <span className="text-slate-300">Permissible Window</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 border border-rose-400 inline-block" />
                <span className="text-slate-300">Late / Overlaps Study Session</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-dashed border-slate-700 inline-block" />
                <span className="text-slate-500">Unlogged / Inactive</span>
              </div>
            </div>
            <span className="text-slate-500 italic">
              Hover over any cell for full timestamp details
            </span>
          </div>
        </div>

        {/* 24-Hour Circadian Time-of-Day Distribution Heatmap Spectrum */}
        <div className="bg-[#060810] border border-slate-800 rounded-xl p-4 md:p-5 space-y-3.5">
          <div className="border-b border-slate-850 pb-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Circadian Time-of-Day Distribution Spectrum (04:00 AM – 12:00 AM)</span>
            </h4>
          </div>

          <div className="overflow-x-auto pb-1 scrollbar-thin">
            <div className="min-w-[680px] space-y-2">
              {/* Hour Header with ICAI Exam Shading */}
              <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 text-center font-mono text-[9px] text-slate-400 pb-1 border-b border-slate-800">
                {habitsAnalysisData.distributionHours.map((h) => {
                  const isExamHour = h >= 14 && h < 17; // 2 PM to 5 PM
                  const displayH = h % 12 === 0 ? 12 : h % 12;
                  const ampm = h >= 12 ? 'P' : 'A';
                  return (
                    <div 
                      key={h} 
                      className={`p-1 rounded ${
                        isExamHour 
                          ? 'bg-rose-950/40 text-rose-300 border border-rose-500/30 font-bold' 
                          : 'text-slate-400'
                      }`}
                    >
                      {displayH}{ampm}
                    </div>
                  );
                })}
              </div>

              {/* ICAI Exam Advisory Ribbon */}
              <div className="flex items-center justify-between text-[9px] font-mono px-2 py-1 rounded bg-slate-900/60 border border-slate-850">
                <span className="text-amber-400">🌅 Morning Window (4 AM - 12 PM)</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <span>⚠️ ICAI Exam Block (2:00 PM – 5:00 PM)</span>
                  <span className="text-slate-500 font-normal">• Strictly 0 Meal Collisions</span>
                </span>
                <span className="text-violet-400">🌙 Evening Rest Recovery (6 PM - 4 AM)</span>
              </div>

              {/* Breakfast Hourly Cluster Row */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-[10.5px] font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🍳 Breakfast</span>
                </div>
                <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 flex-1">
                  {habitsAnalysisData.distributionHours.map((h) => {
                    const count = habitsAnalysisData.hourClusters.breakfast[h] || 0;
                    const inSystemWindow = h >= 4 && h < 12;
                    let bg = 'bg-slate-900/20 text-slate-700';
                    if (count > 0) {
                      bg = count >= 5
                        ? 'bg-amber-400 text-black font-black shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : count >= 3
                        ? 'bg-amber-500/80 text-white font-bold'
                        : 'bg-amber-500/40 text-amber-200 font-bold';
                    } else if (inSystemWindow) {
                      bg = 'bg-slate-900/40 text-slate-600 border border-slate-850/50';
                    }
                    return (
                      <div 
                        key={h} 
                        title={`Breakfast at ${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'PM' : 'AM'}: ${count} logs recorded`}
                        className={`h-7 rounded flex items-center justify-center font-mono text-[9.5px] transition ${bg}`}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lunch Hourly Cluster Row */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-[10.5px] font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                  <span>🍲 Lunch</span>
                </div>
                <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 flex-1">
                  {habitsAnalysisData.distributionHours.map((h) => {
                    const count = habitsAnalysisData.hourClusters.lunch[h] || 0;
                    const inSystemWindow = h >= 12 && h < 18;
                    let bg = 'bg-slate-900/20 text-slate-700';
                    if (count > 0) {
                      bg = count >= 5
                        ? 'bg-emerald-400 text-black font-black shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                        : count >= 3
                        ? 'bg-emerald-500/80 text-white font-bold'
                        : 'bg-emerald-500/40 text-emerald-200 font-bold';
                    } else if (inSystemWindow) {
                      bg = 'bg-slate-900/40 text-slate-600 border border-slate-850/50';
                    }
                    return (
                      <div 
                        key={h} 
                        title={`Lunch at ${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'PM' : 'AM'}: ${count} logs recorded`}
                        className={`h-7 rounded flex items-center justify-center font-mono text-[9.5px] transition ${bg}`}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dinner Hourly Cluster Row */}
              <div className="flex items-center gap-2">
                <div className="w-24 shrink-0 text-[10.5px] font-mono font-bold text-violet-300 flex items-center gap-1.5">
                  <span>🍽️ Dinner</span>
                </div>
                <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 flex-1">
                  {habitsAnalysisData.distributionHours.map((h) => {
                    const count = habitsAnalysisData.hourClusters.dinner[h] || 0;
                    const inSystemWindow = h >= 18 || h < 4;
                    let bg = 'bg-slate-900/20 text-slate-700';
                    if (count > 0) {
                      bg = count >= 5
                        ? 'bg-violet-400 text-black font-black shadow-[0_0_10px_rgba(167,139,250,0.3)]'
                        : count >= 3
                        ? 'bg-violet-500/80 text-white font-bold'
                        : 'bg-violet-500/40 text-violet-200 font-bold';
                    } else if (inSystemWindow) {
                      bg = 'bg-slate-900/40 text-slate-600 border border-slate-850/50';
                    }
                    return (
                      <div 
                        key={h} 
                        title={`Dinner at ${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'PM' : 'AM'}: ${count} logs recorded`}
                        className={`h-7 rounded flex items-center justify-center font-mono text-[9.5px] transition ${bg}`}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDUCATOR MANUAL: CIRCADIAN NUTRITION & COGNITIVE STAMINA PROTOCOL (100% STATIC DEEP READING) */}
        <div className="bg-[#0b0f19] border border-slate-850 rounded-xl p-5 md:p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Table 2.1: Circadian Nutritional Protocols & Cognitive Stamina in CA Final Prep</span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-1">
              Statutory analysis and numerical mastery require sustained cerebral glucose delivery without post-prandial insulin surges.
            </p>
          </div>

          {/* Structured Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs border border-slate-800">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono uppercase text-[9.5px] border-b border-slate-800">
                  <th className="p-2.5 border-r border-slate-800">Routine Meal</th>
                  <th className="p-2.5 border-r border-slate-800">System Window</th>
                  <th className="p-2.5 border-r border-slate-800">Optimal Golden Slot</th>
                  <th className="p-2.5 border-r border-slate-800">Physiological & Cognitive Function</th>
                  <th className="p-2.5">CA Final Syllabus Retention Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                <tr className="hover:bg-slate-900/30">
                  <td className="p-2.5 font-bold font-mono text-amber-300 border-r border-slate-800">🍳 Breakfast</td>
                  <td className="p-2.5 font-mono text-slate-400 border-r border-slate-800">04:00 AM – 12:00 PM</td>
                  <td className="p-2.5 font-mono text-emerald-400 font-bold border-r border-slate-800">07:00 AM – 08:30 AM</td>
                  <td className="p-2.5 border-r border-slate-800">Breaks overnight glycogen fast; stabilizes morning neurotransmitter acetylcholine synthesis.</td>
                  <td className="p-2.5">Critical for Ind AS 115 Revenue & SFM Forex derivatives multi-step calculations.</td>
                </tr>
                <tr className="hover:bg-slate-900/30">
                  <td className="p-2.5 font-bold font-mono text-emerald-300 border-r border-slate-800">🍲 Lunch</td>
                  <td className="p-2.5 font-mono text-slate-400 border-r border-slate-800">12:00 PM – 06:00 PM</td>
                  <td className="p-2.5 font-mono text-emerald-400 font-bold border-r border-slate-800">12:30 PM – 01:30 PM</td>
                  <td className="p-2.5 border-r border-slate-800">Must conclude &gt;30 mins prior to 2:00 PM exam simulation to prevent cerebral blood pooling in gut.</td>
                  <td className="p-2.5">Defends 2:00–5:00 PM exam alertness against parasympathetic food-coma fatigue.</td>
                </tr>
                <tr className="hover:bg-slate-900/30">
                  <td className="p-2.5 font-bold font-mono text-violet-300 border-r border-slate-800">🍽️ Dinner</td>
                  <td className="p-2.5 font-mono text-slate-400 border-r border-slate-800">06:00 PM – 04:00 AM</td>
                  <td className="p-2.5 font-mono text-emerald-400 font-bold border-r border-slate-800">07:30 PM – 08:45 PM</td>
                  <td className="p-2.5 border-r border-slate-800">Guarantees 2.5-hour gastric clearance buffer prior to nocturnal sleep onset.</td>
                  <td className="p-2.5">Permits undisturbed slow-wave NREM rest for permanent memory encoding of Audit clauses.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Structured Text Flowchart */}
          <div className="space-y-2">
            <h5 className="text-[10.5px] font-bold text-slate-300 uppercase tracking-widest font-mono">
              Figure 2.2: Metabolic Synchronization Protocol for 12+ Hour Daily Study Schedules (Flowchart)
            </h5>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-slate-300 font-mono text-[10px] leading-relaxed space-y-1">
              <p className="text-amber-400 font-bold">[07:30 AM] Breakfast &amp; Hydration  ──►  Cortisol / Glycogen replenishment for Study Slot 1</p>
              <p className="pl-4 text-slate-500">│</p>
              <p className="text-emerald-400 font-bold">├──► [01:00 PM] Light Lunch  ──►  Splanchnic blood stabilization before 02:00 PM</p>
              <p className="pl-4 text-slate-500">│</p>
              <p className="text-rose-400 font-bold">├──► [02:00 PM – 05:00 PM] ICAI Exam Simulation  ──►  Max alertness; ZERO digestion drag</p>
              <p className="pl-4 text-slate-500">│</p>
              <p className="text-violet-400 font-bold">├──► [08:00 PM] Dinner  ──►  2.5-hour digestive gap established before bed</p>
              <p className="pl-4 text-slate-500">│</p>
              <p className="text-indigo-400 font-bold">└──► [11:00 PM] Sleep Mode  ──►  Uninterrupted delta sleep consolidates revision records</p>
            </div>
          </div>

          {/* High-Impact Tactical Bullet Points */}
          <div className="space-y-2">
            <h5 className="text-[10.5px] font-bold text-slate-300 uppercase tracking-widest font-mono">
              🎯 Educator Tactical Directives for Sustained Revision Focus:
            </h5>
            <ul className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed pl-1">
              <li>
                <strong className="text-white">The Post-Prandial Somnolence Defense:</strong> Never consume heavy simple carbohydrates at 1:30 PM. A rapid insulin spike triggers systemic tryptophan uptake, producing severe brain fog during the critical 2:00 PM – 5:00 PM slot when your actual ICAI examinations occur.
              </li>
              <li>
                <strong className="text-white">Strict System Window Compliance:</strong> Routine mode locks Breakfast (4 AM–12 PM), Lunch (12 PM–6 PM), and Dinner (6 PM–4 AM). Respect these boundaries to train your body’s peripheral circadian oscillators.
              </li>
              <li>
                <strong className="text-white">The 2.5-Hour Pre-Sleep Buffer:</strong> Eating dinner after 10:30 PM forces active gastric motility during sleep, elevating core body temperature and severely suppressing deep slow-wave NREM sleep necessary for statutory recall.
              </li>
              <li>
                <strong className="text-white">Coupled Hydration Discipline:</strong> Always pair each completed routine meal with 250ml of water to hit your daily hydration target and sustain optimal neuronal firing speed.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* EDUCATOR'S HIGH-YIELD COGNITIVE RECOVERY MANUAL (100% STATIC DEEP STUDY GUIDE) */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-violet-400" />
            <h2 className="text-base font-black text-white uppercase tracking-wider font-mono">
              📚 Professional Educator Manual: Cognitive Equilibrium in CA Final Prep
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ICAI syllabus complexity (FR, SFM, Audit, Direct Tax) requires maximum cognitive retention. Rest is not "wasted study time" — it is the precise neurological phase when information shifts from short-term hippocampus buffers into long-term cerebral storage.
          </p>
        </div>

        {/* Structured Table: Rest Phase and Memory Impact */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
            Table 1.1: Rest Phases & Impact on Complex CA Case Laws & Standards
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs border border-slate-800">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <th className="p-3 border-r border-slate-800">Sleep Phase</th>
                  <th className="p-3 border-r border-slate-800">Neurological Function</th>
                  <th className="p-3">Direct CA Final Syllabus Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold font-mono text-violet-400 border-r border-slate-800">Deep Sleep (NREM)</td>
                  <td className="p-3 border-r border-slate-800">Somatic physical repair, clearing of metabolic wastes, and synaptic pruning of irrelevant daily visual noise.</td>
                  <td className="p-3">Consolidates dry, highly technical statutory thresholds (e.g. Audit CARO clauses, Companies Act section numbers, and DT tax rate slabs).</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold font-mono text-violet-400 border-r border-slate-800">REM Sleep</td>
                  <td className="p-3 border-r border-slate-800">Memory integration, creative linkage of diverse schemas, and emotional resilience regulation.</td>
                  <td className="p-3">Optimizes complex cross-module synthesis questions (e.g. multi-step Business Combination scenarios under Ind AS or complex FX hedging formulas in SFM).</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold font-mono text-violet-400 border-r border-slate-800">Power Nap (20 Min)</td>
                  <td className="p-3 border-r border-slate-800">Resets neural alertness levels, lowers sympathetic nervous system spikes, and restores baseline attention.</td>
                  <td className="p-3">Crucial mid-day intervention between heavy study slots (e.g. restoring focus after a brutal 4-hour practice test of past ICAI papers).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Structured Text Flowchart */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
            Figure 1.2: The Ideal 24-Hour Cognitive Restoration Cycle (Flowchart)
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-slate-300 font-mono text-[10.5px] leading-relaxed space-y-1">
            <p className="text-violet-400 font-bold">[07:00 AM] Wake Up & Hydrate  ──►  [08:00 AM] Study Slot 1 (Fresh brain, heavy concepts, e.g. Ind AS/SFM)</p>
            <p className="pl-4 text-slate-500">│</p>
            <p className="text-violet-400 font-bold">├──► [01:00 PM] Lunch & 20-min Power Nap  ──►  Restores vigilance, clears sensory buffers</p>
            <p className="pl-4 text-slate-500">│</p>
            <p className="text-violet-400 font-bold">├──► [02:00 PM] Study Slot 2 (Analytical Practice, quizzes & AI auditing)</p>
            <p className="pl-4 text-slate-500">│</p>
            <p className="text-violet-400 font-bold">└──► [11:00 PM] Enter Rest Mode (Deep Sleep)  ──► Synaptic consolidation of study records into long-term storage</p>
          </div>
        </div>

        {/* High Yield Bullet Points */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
            🎯 Strategic Guidelines for High-Efficiency CA Final Revision:
          </h3>
          <ul className="list-decimal list-inside text-xs text-slate-300 space-y-2.5 leading-relaxed pl-2">
            <li>
              <strong className="text-white">Strictly avoid the 4-Hour Sleep Myth:</strong> Many aspirants cut rest down to 4 hours in the last fortnight, resulting in severe attention lapses during the actual 3-hour exam. Commit to a minimum of <strong className="text-violet-400">6.5 hours of solid sleep</strong> per day.
            </li>
            <li>
              <strong className="text-white">The 20-20-20 Rule for Desk Ergonomics:</strong> Prevent severe eye fatigue during digital revision or reading dense ICAI text modules. Every <strong className="font-mono text-cyan-400">20 minutes</strong>, look away from your book or screen at an object <strong className="font-mono text-cyan-400">20 feet away</strong> for at least <strong className="font-mono text-cyan-400">20 seconds</strong>.
            </li>
            <li>
              <strong className="text-white">Mitigating Exam-Week Insomnia:</strong> When your mind is racing with Company Audit clauses or tax deductions, use tactical <strong className="text-violet-400">Box Breathing</strong>: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds. Repeat for 5 cycles to lower your cortisol level instantly.
            </li>
            <li>
              <strong className="text-white">Blue Light Defense:</strong> Shut down mock paper practice screens at least <strong className="font-mono text-amber-400">30 minutes prior to bedtime</strong>. Blue light inhibits melatonin production, keeping your brain in an artificial hyper-vigilant state that delays sleep onset.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
