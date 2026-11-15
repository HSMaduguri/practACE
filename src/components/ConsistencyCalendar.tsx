import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  Calendar as CalendarIcon, 
  Trophy, 
  Award, 
  Target, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Clock, 
  Settings2, 
  CheckCircle2, 
  Zap, 
  Info,
  Layers,
  CalendarDays,
  EyeOff,
  Minimize2
} from 'lucide-react';
import { FocusSession, SubjectId } from '../types';
import { ModalPortal } from './ModalPortal';

export interface ConsistencyCalendarProps {
  focusSessions: FocusSession[];
  dailyGoalMinutes: number;
  onUpdateDailyGoal?: (minutes: number) => void;
  className?: string;
  defaultExpanded?: boolean;
}

interface DayStudyData {
  dateStr: string; // YYYY-MM-DD
  date: Date;
  minutes: number;
  hours: number;
  goalMinutes: number;
  isGoalMet: boolean;
  isGoalExceeded: boolean; // >= 150%
  percentageOfGoal: number;
  isInCurrentStreak: boolean;
  streakDayIndex?: number;
  subjectsStudied: { subjectId: string; minutes: number }[];
  sessionsCount: number;
}

export default function ConsistencyCalendar({
  focusSessions,
  dailyGoalMinutes,
  onUpdateDailyGoal,
  className = '',
  defaultExpanded
}: ConsistencyCalendarProps) {
  const [viewMode, setViewMode] = useState<'heatmap' | 'month'>('heatmap');
  const [heatmapRange, setHeatmapRange] = useState<'90d' | '180d' | '365d'>('90d');
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => new Date());
  const [hoveredDay, setHoveredDay] = useState<DayStudyData | null>(null);
  const [activeSelectedDay, setActiveSelectedDay] = useState<DayStudyData | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoalMinutes, setTempGoalMinutes] = useState(dailyGoalMinutes);

  // Expand / collapse state for Daily Study Habit Heatmap (persisted in localStorage)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('practca_heatmap_expanded') : null;
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {
      // ignore
    }
    return defaultExpanded ?? false;
  });

  const toggleExpanded = (val?: boolean) => {
    setIsExpanded(prev => {
      const nextVal = typeof val === 'boolean' ? val : !prev;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('practca_heatmap_expanded', String(nextVal));
        }
      } catch (e) {
        // ignore
      }
      return nextVal;
    });
  };

  // Sync tempGoalMinutes when dailyGoalMinutes changes
  useEffect(() => {
    setTempGoalMinutes(dailyGoalMinutes);
  }, [dailyGoalMinutes]);

  const getLocalDateStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = useMemo(() => getLocalDateStr(new Date()), []);

  // 1. Aggregate daily study totals combining BOTH localStorage practca_pomo_logs and focusSessions props
  const dailyTotals: Record<string, { minutes: number; sessionsCount: number; subjects: Record<string, number> }> = useMemo(() => {
    const totals: Record<string, { minutes: number; sessionsCount: number; subjects: Record<string, number> }> = {};
    const processedSessionIds = new Set<string>();

    const addTime = (dateStr: string, minutes: number, subjectId?: string, sessionId?: string) => {
      if (!dateStr || minutes <= 0) return;
      if (sessionId && processedSessionIds.has(sessionId)) return;
      if (sessionId) processedSessionIds.add(sessionId);

      if (!totals[dateStr]) {
        totals[dateStr] = { minutes: 0, sessionsCount: 0, subjects: {} };
      }
      totals[dateStr].minutes += minutes;
      totals[dateStr].sessionsCount += 1;
      if (subjectId) {
        totals[dateStr].subjects[subjectId] = (totals[dateStr].subjects[subjectId] || 0) + minutes;
      }
    };

    // Process practca_pomo_logs from localStorage (synchronous live sessions)
    try {
      const cached = typeof window !== 'undefined' ? localStorage.getItem('practca_pomo_logs') : null;
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          parsed.forEach((log: any) => {
            if (log.mode !== 'study' && log.mode !== 'work') return;
            const durationSecs = log.durationSeconds || (log.duration ? log.duration * 60 : 0);
            if (!durationSecs || durationSecs <= 0) return;

            let dateStr = log.date;
            if (!dateStr && log.startTime) {
              const d = new Date(log.startTime);
              if (!isNaN(d.getTime())) {
                dateStr = getLocalDateStr(d);
              }
            }
            if (dateStr) {
              const mins = Math.max(1, Math.round(durationSecs / 60));
              const subId = log.subjectId || log.subjectCode || log.subject || 'Study';
              addTime(dateStr, mins, subId, log.id);
            }
          });
        }
      }
    } catch (e) {
      console.error('Error reading pomo logs for ConsistencyCalendar', e);
    }

    // Process focusSessions from props
    (focusSessions || []).forEach(s => {
      if (!s.timestamp || s.sessionType === 'break' || s.sessionType === 'routine') return;
      const d = new Date(s.timestamp);
      if (isNaN(d.getTime())) return;
      const dateStr = getLocalDateStr(d);
      addTime(dateStr, s.duration || 0, s.subjectId, s.id);
    });

    return totals;
  }, [focusSessions]);

  // 2. Fetch goal history or fallback to current daily goal
  const getGoalForDate = (dStr: string) => {
    let history: Record<string, number> = {};
    try {
      const historyStr = typeof window !== 'undefined' ? localStorage.getItem('practca_daily_goals_history') : null;
      if (historyStr) history = JSON.parse(historyStr);
    } catch (e) {
      // ignore
    }
    const dates = Object.keys(history).sort();
    if (dates.length === 0) return dailyGoalMinutes;
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i] <= dStr) return history[dates[i]];
    }
    return dailyGoalMinutes;
  };

  // 3. Compute Streak Statistics & Active Streak Dates
  const streakData = useMemo(() => {
    const metGoalDates = new Set<string>();
    Object.entries(dailyTotals).forEach(([dateStr, data]: [string, { minutes: number; sessionsCount: number; subjects: Record<string, number> }]) => {
      const goal = getGoalForDate(dateStr);
      if (data.minutes >= goal && goal > 0) {
        metGoalDates.add(dateStr);
      }
    });

    // Current active streak calculation
    let currentStreak = 0;
    const currentStreakDates = new Set<string>();
    const tempDate = new Date();
    const today = getLocalDateStr(tempDate);

    // If today is met, streak starts today
    if (metGoalDates.has(today)) {
      currentStreak = 1;
      currentStreakDates.add(today);
      while (true) {
        tempDate.setDate(tempDate.getDate() - 1);
        const prevStr = getLocalDateStr(tempDate);
        if (metGoalDates.has(prevStr)) {
          currentStreak++;
          currentStreakDates.add(prevStr);
        } else {
          break;
        }
      }
    } else {
      // If today is not met yet, streak is active if yesterday was met
      tempDate.setDate(tempDate.getDate() - 1);
      const yesterdayStr = getLocalDateStr(tempDate);
      if (metGoalDates.has(yesterdayStr)) {
        currentStreak = 1;
        currentStreakDates.add(yesterdayStr);
        while (true) {
          tempDate.setDate(tempDate.getDate() - 1);
          const prevStr = getLocalDateStr(tempDate);
          if (metGoalDates.has(prevStr)) {
            currentStreak++;
            currentStreakDates.add(prevStr);
          } else {
            break;
          }
        }
      }
    }

    // Longest streak calculation
    let longestStreak = 0;
    let tempRun = 0;
    const allLoggedDates = Object.keys(dailyTotals).sort();
    if (allLoggedDates.length > 0) {
      const minDate = new Date(allLoggedDates[0]);
      minDate.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      const scanner = new Date(minDate);
      while (scanner <= now) {
        const sStr = getLocalDateStr(scanner);
        if (metGoalDates.has(sStr)) {
          tempRun++;
          if (tempRun > longestStreak) longestStreak = tempRun;
        } else {
          tempRun = 0;
        }
        scanner.setDate(scanner.getDate() + 1);
      }
    }
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    return {
      currentStreak,
      longestStreak,
      metGoalDates,
      currentStreakDates
    };
  }, [dailyTotals, dailyGoalMinutes]);

  // Helper to build DayStudyData
  const getDayData = (date: Date): DayStudyData => {
    const dateStr = getLocalDateStr(date);
    const dayInfo = dailyTotals[dateStr];
    const minutes = dayInfo ? dayInfo.minutes : 0;
    const hours = +(minutes / 60).toFixed(1);
    const goalMinutes = getGoalForDate(dateStr);
    const isGoalMet = minutes >= goalMinutes && goalMinutes > 0;
    const isGoalExceeded = minutes >= Math.round(goalMinutes * 1.5) && goalMinutes > 0;
    const percentageOfGoal = goalMinutes > 0 ? Math.round((minutes / goalMinutes) * 100) : 0;
    const isInCurrentStreak = streakData.currentStreakDates.has(dateStr);

    const subjectsStudied = dayInfo?.subjects
      ? Object.entries(dayInfo.subjects).map(([subjectId, mins]) => ({ subjectId, minutes: Number(mins) || 0 }))
      : [];

    return {
      dateStr,
      date,
      minutes,
      hours,
      goalMinutes,
      isGoalMet,
      isGoalExceeded,
      percentageOfGoal,
      isInCurrentStreak,
      subjectsStudied,
      sessionsCount: dayInfo ? dayInfo.sessionsCount : 0
    };
  };

  // 4. Generate Rolling Heatmap Matrix
  const heatmapData = useMemo(() => {
    const daysCount = heatmapRange === '90d' ? 91 : heatmapRange === '180d' ? 182 : 364;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Calculate start date
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (daysCount - 1));
    // Align start date to previous Monday (0 = Sun, 1 = Mon ... 6 = Sat)
    const dayOfWeek = startDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7; // 0 for Mon, 6 for Sun
    startDate.setDate(startDate.getDate() - diffToMonday);
    startDate.setHours(0, 0, 0, 0);

    const weeks: DayStudyData[][] = [];
    let currentWeek: DayStudyData[] = [];
    const walker = new Date(startDate);

    // End on upcoming Sunday or today's week end
    const todayDiffToSun = (7 - today.getDay()) % 7;
    const endCalendarDate = new Date(today);
    endCalendarDate.setDate(endCalendarDate.getDate() + todayDiffToSun);
    endCalendarDate.setHours(23, 59, 59, 999);

    while (walker <= endCalendarDate) {
      const cellDate = new Date(walker);
      currentWeek.push(getDayData(cellDate));

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      walker.setDate(walker.getDate() + 1);
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Determine month labels across week columns
    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      // Look at the middle day of the week to place month label
      const midDay = week[Math.min(3, week.length - 1)].date;
      const m = midDay.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          label: midDay.toLocaleDateString(undefined, { month: 'short' }),
          weekIndex: wIdx
        });
        lastMonth = m;
      }
    });

    // Summary stats for heatmap range
    let totalMins = 0;
    let metDays = 0;
    let activeDays = 0;
    weeks.forEach(w => {
      w.forEach(d => {
        if (d.date <= today) {
          totalMins += d.minutes;
          if (d.minutes > 0) activeDays++;
          if (d.isGoalMet) metDays++;
        }
      });
    });

    const consistencyRate = activeDays > 0 ? Math.round((metDays / activeDays) * 100) : 0;

    return {
      weeks,
      monthLabels,
      totalHours: +(totalMins / 60).toFixed(1),
      metDays,
      activeDays,
      consistencyRate
    };
  }, [heatmapRange, dailyTotals, streakData, dailyGoalMinutes]);

  // 5. Generate Monthly Calendar View Grid
  const monthlyData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Mon = 0
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const calendarCells: (DayStudyData | null)[] = [];

    // Leading blanks for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarCells.push(null);
    }

    // Actual month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      calendarCells.push(getDayData(new Date(year, month, day)));
    }

    // Trailing blanks to complete the final row
    const remainder = calendarCells.length % 7;
    if (remainder > 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        calendarCells.push(null);
      }
    }

    // Monthly summary stats
    let monthTotalMins = 0;
    let monthMetDays = 0;
    let monthActiveDays = 0;

    calendarCells.forEach(cell => {
      if (cell) {
        monthTotalMins += cell.minutes;
        if (cell.minutes > 0) monthActiveDays++;
        if (cell.isGoalMet) monthMetDays++;
      }
    });

    return {
      cells: calendarCells,
      totalHours: +(monthTotalMins / 60).toFixed(1),
      metDays: monthMetDays,
      activeDays: monthActiveDays,
      totalDays: totalDaysInMonth,
      monthName: selectedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    };
  }, [selectedMonth, dailyTotals, streakData, dailyGoalMinutes]);

  const handlePrevMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const handleSaveGoal = () => {
    if (onUpdateDailyGoal && tempGoalMinutes > 0) {
      onUpdateDailyGoal(tempGoalMinutes);
      // Persist in history
      try {
        const historyStr = localStorage.getItem('practca_daily_goals_history');
        const history = historyStr ? JSON.parse(historyStr) : {};
        history[todayStr] = tempGoalMinutes;
        localStorage.setItem('practca_daily_goals_history', JSON.stringify(history));
      } catch (e) {
        // ignore
      }
    }
    setShowGoalModal(false);
  };

  const formatMins = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Streak Milestone progression calculation
  const nextMilestone = useMemo(() => {
    const streak = streakData.currentStreak;
    const tiers = [3, 7, 14, 21, 30, 60, 90, 100];
    const targetTier = tiers.find(t => t > streak) || (streak + 10);
    const daysNeeded = targetTier - streak;
    return {
      targetTier,
      daysNeeded,
      percentage: Math.min(100, Math.round((streak / targetTier) * 100))
    };
  }, [streakData.currentStreak]);

  const renderGoalModal = () => (
    showGoalModal ? (
      <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn font-sans">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-5 shadow-2xl text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-400" />
              <h3 className="font-display font-bold text-white text-base">
                Set Daily Study Target Goal
              </h3>
            </div>
            <button 
              type="button" 
              onClick={() => setShowGoalModal(false)}
              className="text-slate-400 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xs text-slate-300">Planned Time:</span>
              <span className="text-base font-extrabold text-amber-400 font-sans">
                {tempGoalMinutes} mins ({formatMins(tempGoalMinutes)})
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="30"
              max="480"
              step="15"
              value={tempGoalMinutes}
              onChange={(e) => setTempGoalMinutes(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>30m (Quick)</span>
              <span>2h (Standard)</span>
              <span>4h (CA Finals)</span>
              <span>8h (Intensive)</span>
            </div>

            {/* Preset buttons */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[60, 120, 180, 240].map(mins => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTempGoalMinutes(mins)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                    tempGoalMinutes === mins 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {formatMins(mins)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowGoalModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveGoal}
              className="px-5 py-2 rounded-xl bg-cav-accent text-slate-950 font-black text-xs font-sans hover:brightness-110 transition cursor-pointer shadow-md"
            >
              Save Target
            </button>
          </div>
        </div>
      </div>
      </ModalPortal>
    ) : null
  );

  // Compact collapsed view to avoid taking up too much screen space
  if (!isExpanded) {
    return (
      <div 
        id="consistency-calendar-compact" 
        className={`bg-slate-900/90 dark:bg-[#111827] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl text-left font-sans relative overflow-hidden transition-all duration-300 ${className}`}
      >
        {/* Decorative ambient background blur */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  Consistency Calendar & Study Streak
                </h2>
                {streakData.currentStreak > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                    <Flame className="h-3.5 w-3.5 fill-amber-400 animate-pulse" />
                    {streakData.currentStreak} Day{streakData.currentStreak === 1 ? '' : 's'} Active Streak
                  </span>
                ) : (
                  <span className="text-[10.5px] font-mono uppercase text-slate-400 bg-slate-800/70 border border-slate-750 px-2 py-0.5 rounded-full">
                    Start Streak Today
                  </span>
                )}
              </div>

              {/* Compact Key Streak Stats summary pills */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Streak:</span>
                  <strong className="text-amber-400 font-sans">{streakData.currentStreak}d</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                  <Trophy className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Record:</span>
                  <strong className="text-indigo-400 font-sans">{streakData.longestStreak}d</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Goal Met:</span>
                  <strong className="text-emerald-400 font-sans">{streakData.metGoalDates.size} days</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Logged:</span>
                  <strong className="text-cyan-400 font-sans">{heatmapData.totalHours} hrs</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                  <Target className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-slate-500 uppercase text-[10px] font-bold">Daily Goal:</span>
                  <strong className="text-white font-sans">{dailyGoalMinutes}m ({formatMins(dailyGoalMinutes)})</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            {onUpdateDailyGoal && (
              <button
                type="button"
                onClick={() => setShowGoalModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-750 text-slate-300 hover:text-white text-xs font-mono font-bold transition hover:border-amber-500/40 cursor-pointer shadow-xs"
                title="Adjust Daily Study Goal"
              >
                <Settings2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Target: {dailyGoalMinutes}m</span>
              </button>
            )}

            <button
              type="button"
              id="expand-heatmap-btn"
              onClick={() => toggleExpanded(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cav-accent text-slate-950 font-black text-xs hover:brightness-110 transition cursor-pointer shadow-[0_0_15px_rgba(214,168,54,0.3)]"
              title="Expand full Daily Study Habit Heatmap & Calendar"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-950" />
              <span>Expand Heatmap</span>
              <ChevronDown className="h-4 w-4 text-slate-950" />
            </button>
          </div>
        </div>

        {onUpdateDailyGoal && renderGoalModal()}
      </div>
    );
  }

  return (
    <div 
      id="consistency-calendar" 
      className={`bg-slate-900/90 dark:bg-[#111827] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6 text-left font-sans relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/80 pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Consistency Calendar & Study Streak
              </h2>
              {streakData.currentStreak > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                  <Flame className="h-3.5 w-3.5 fill-amber-400 animate-pulse" />
                  {streakData.currentStreak} Day{streakData.currentStreak === 1 ? '' : 's'} Active Streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {/* Daily Target Setting Button (only when editable) */}
          {onUpdateDailyGoal && (
            <button
              type="button"
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-750 text-slate-300 hover:text-white text-xs font-mono font-bold transition hover:border-amber-500/40 cursor-pointer shadow-xs"
            >
              <Settings2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Target: {dailyGoalMinutes}m</span>
            </button>
          )}

          {/* Heatmap Range Toggle (if in heatmap view) */}
          {viewMode === 'heatmap' && (
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setHeatmapRange('90d')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  heatmapRange === '90d' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                90 Days
              </button>
              <button
                type="button"
                onClick={() => setHeatmapRange('180d')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  heatmapRange === '180d' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                180 Days
              </button>
              <button
                type="button"
                onClick={() => setHeatmapRange('365d')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  heatmapRange === '365d' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1 Year
              </button>
            </div>
          )}

          {/* Mode Switcher: Heatmap vs Month */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('heatmap')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'heatmap' 
                  ? 'bg-cav-accent text-slate-950 font-black shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Heatmap</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                viewMode === 'month' 
                  ? 'bg-cav-accent text-slate-950 font-black shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Hide / Collapse Heatmap Button */}
          <button
            type="button"
            id="hide-heatmap-btn"
            onClick={() => toggleExpanded(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-750 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-mono font-bold transition cursor-pointer shadow-xs"
            title="Hide / Collapse Daily Study Habit Heatmap to save screen space"
          >
            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
            <span>Hide Heatmap</span>
            <ChevronUp className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* QUICK STREAK STATS BENTO ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 font-mono">
        {/* 1. CURRENT STREAK */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            streakData.currentStreak > 0 
              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]' 
              : 'bg-slate-900 border border-slate-800 text-slate-500'
          }`}>
            <Flame className={`h-5 w-5 ${streakData.currentStreak > 0 ? 'fill-amber-400/20 animate-pulse' : ''}`} />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">CURRENT STREAK</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white font-sans">
                {streakData.currentStreak}
              </span>
              <span className="text-xs text-slate-400 font-sans">
                {streakData.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <span className="text-[9.5px] text-amber-400/90 truncate block">
              {streakData.currentStreak > 0 ? '🔥 Active streak' : 'Start streak today'}
            </span>
          </div>
        </div>

        {/* 2. LONGEST RUN */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            streakData.longestStreak > 0 ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border border-slate-800 text-slate-500'
          }`}>
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">RECORD STREAK</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white font-sans">
                {streakData.longestStreak}
              </span>
              <span className="text-xs text-slate-400 font-sans">
                {streakData.longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <span className="text-[9.5px] text-slate-400 block">Personal Best</span>
          </div>
        </div>

        {/* 3. GOAL COMPLIANCE */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">DAYS GOAL MET</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white font-sans">
                {streakData.metGoalDates.size}
              </span>
              <span className="text-xs text-slate-400 font-sans">days</span>
            </div>
            <span className="text-[9.5px] text-emerald-400 block">
              {viewMode === 'heatmap' ? `${heatmapData.consistencyRate}% rate` : 'All-time verified'}
            </span>
          </div>
        </div>

        {/* 4. TOTAL STUDY HOURS IN PERIOD */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">HOURS LOGGED</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white font-sans">
                {viewMode === 'heatmap' ? heatmapData.totalHours : monthlyData.totalHours}
              </span>
              <span className="text-xs text-slate-400 font-sans">hrs</span>
            </div>
            <span className="text-[9.5px] text-slate-400 truncate block">
              {viewMode === 'heatmap' ? `${heatmapRange} window` : monthlyData.monthName}
            </span>
          </div>
        </div>
      </div>

      {/* STREAK MILESTONE PROGRESS BAR BANNER */}
      {streakData.currentStreak > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="font-bold text-slate-200">
                Next Milestone: {nextMilestone.targetTier}-Day Streak!
              </span>
              <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
                ({nextMilestone.daysNeeded} more consecutive {nextMilestone.daysNeeded === 1 ? 'day' : 'days'} to unlock)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-56 shrink-0">
            <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                style={{ width: `${nextMilestone.percentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400 shrink-0">
              {nextMilestone.percentage}%
            </span>
          </div>
        </div>
      )}

      {/* MAIN VIEW: HEATMAP GRID OR MONTHLY CALENDAR */}
      {viewMode === 'heatmap' ? (
        /* ======================== 1. ROLLING HEATMAP COMPONENT ======================== */
        <div className="space-y-3 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-cav-accent" />
              Daily Study Habit Heatmap
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400 font-mono text-[11px] hidden md:inline">
                Hover or tap any date block to view session breakdown
              </span>
              <button
                type="button"
                onClick={() => toggleExpanded(false)}
                className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-amber-400 transition cursor-pointer px-2.5 py-1 rounded-lg hover:bg-slate-900 border border-slate-800/80 shadow-xs"
                title="Hide Daily Study Habit Heatmap to save screen space"
              >
                <Minimize2 className="h-3 w-3" />
                <span>Hide Heatmap</span>
              </button>
            </div>
          </div>

          {/* Heatmap Grid Wrapper with horizontal scroll on small viewports */}
          <div className="overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="min-w-fit flex flex-col gap-1.5 select-none">
              
              {/* Month Labels Header Row */}
              <div className="flex text-[10px] font-mono font-bold text-slate-400 pl-8">
                {heatmapData.weeks.map((_, wIdx) => {
                  const labelItem = heatmapData.monthLabels.find(m => m.weekIndex === wIdx);
                  return (
                    <div key={`m-col-${wIdx}`} className="w-[15px] sm:w-[17px] mr-1 shrink-0 text-left">
                      {labelItem ? labelItem.label : ''}
                    </div>
                  );
                })}
              </div>

              {/* Day-of-week rows (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
              <div className="flex items-start">
                {/* Day Labels Column */}
                <div className="flex flex-col gap-1 pr-2 pt-0.5 text-[9px] font-mono text-slate-500 font-bold shrink-0">
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px]">Mon</span>
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px] opacity-0">Tue</span>
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px]">Wed</span>
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px] opacity-0">Thu</span>
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px]">Fri</span>
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px] opacity-0">Sat</span>
                  <span className="h-[15px] sm:h-[17px] leading-[15px] sm:leading-[17px]">Sun</span>
                </div>

                {/* Week Columns of Heatmap Cells */}
                <div className="flex gap-1">
                  {heatmapData.weeks.map((week, wIdx) => (
                    <div key={`week-${wIdx}`} className="flex flex-col gap-1">
                      {week.map(day => {
                        const isToday = day.dateStr === todayStr;
                        const isHovered = hoveredDay?.dateStr === day.dateStr;
                        const isSelected = activeSelectedDay?.dateStr === day.dateStr;
                        const isFuture = day.date > new Date();

                        // Heatmap cell color styling
                        let cellClass = 'bg-slate-900/60 border border-slate-800/80'; // 0 min
                        if (isFuture) {
                          cellClass = 'bg-slate-950/30 border border-slate-900/40 opacity-40 cursor-not-allowed';
                        } else if (day.isGoalExceeded) {
                          cellClass = 'bg-emerald-400 border border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.6)] cursor-pointer';
                        } else if (day.isGoalMet) {
                          cellClass = 'bg-emerald-500 border border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)] cursor-pointer';
                        } else if (day.percentageOfGoal >= 50) {
                          cellClass = 'bg-emerald-700/80 border border-emerald-600/60 cursor-pointer';
                        } else if (day.minutes > 0) {
                          cellClass = 'bg-emerald-950/80 border border-emerald-900/50 cursor-pointer';
                        }

                        // Current active streak highlighting
                        const streakRingClass = day.isInCurrentStreak 
                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950' 
                          : '';

                        const todayBorder = isToday ? 'border-amber-400 font-bold' : '';

                        return (
                          <div
                            key={day.dateStr}
                            onMouseEnter={() => !isFuture && setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => !isFuture && setActiveSelectedDay(day)}
                            className={`w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] rounded-[3.5px] transition-all duration-150 relative ${cellClass} ${streakRingClass} ${todayBorder} ${
                              isHovered || isSelected ? 'scale-125 z-20 ring-2 ring-white/80' : ''
                            }`}
                            title={`${day.dateStr}: ${day.minutes} mins (${day.isGoalMet ? 'Goal Met' : 'Under Goal'})`}
                          >
                            {/* Tiny flame marker if in current streak */}
                            {day.isInCurrentStreak && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75 pointer-events-none" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-[2.5px] bg-slate-900 border border-slate-800" title="0 mins" />
                <span className="w-3 h-3 rounded-[2.5px] bg-emerald-950 border border-emerald-900" title="1-49% of target" />
                <span className="w-3 h-3 rounded-[2.5px] bg-emerald-700 border border-emerald-600" title="50-99% of target" />
                <span className="w-3 h-3 rounded-[2.5px] bg-emerald-500 border border-emerald-400" title="100%+ Daily Target Met 🎯" />
                <span className="w-3 h-3 rounded-[2.5px] bg-emerald-400 border border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.6)]" title="150%+ Super Focus Day 🚀" />
              </div>
              <span>More</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2.5px] bg-emerald-500 border border-emerald-400" />
                <span className="text-emerald-400 font-bold">🎯 Target Met ({dailyGoalMinutes}m+)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2.5px] bg-emerald-500 ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950" />
                <span className="text-amber-400 font-bold">🔥 Current Streak Day</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ======================== 2. MONTHLY CALENDAR GRID VIEW ======================== */
        <div className="space-y-4 bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
          {/* Month Navigation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-bold text-white text-base">
                {monthlyData.monthName}
              </h3>
              <button
                type="button"
                onClick={handleCurrentMonth}
                className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleExpanded(false)}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-amber-400 transition cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 mr-1"
                title="Hide Calendar to save screen space"
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Hide</span>
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer hover:border-slate-700"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer hover:border-slate-700"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 7-Day Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {/* Day Header */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
              <div key={dayName} className="text-[11px] font-mono font-bold text-slate-500 uppercase pb-1">
                {dayName}
              </div>
            ))}

            {/* Cells */}
            {monthlyData.cells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div 
                    key={`empty-${idx}`} 
                    className="h-16 sm:h-20 rounded-xl bg-slate-950/30 border border-slate-900/40 opacity-20"
                  />
                );
              }

              const isToday = cell.dateStr === todayStr;
              const isSelected = activeSelectedDay?.dateStr === cell.dateStr;
              const isFuture = cell.date > new Date();

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => !isFuture && setActiveSelectedDay(cell)}
                  onMouseEnter={() => !isFuture && setHoveredDay(cell)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    cell.isGoalExceeded
                      ? 'bg-emerald-950/50 border-emerald-500/50 hover:border-emerald-400'
                      : cell.isGoalMet
                      ? 'bg-emerald-950/30 border-emerald-600/40 hover:border-emerald-400'
                      : cell.minutes > 0
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
                  } ${
                    cell.isInCurrentStreak 
                      ? 'ring-2 ring-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.25)]' 
                      : ''
                  } ${
                    isToday ? 'border-amber-400/80 bg-slate-900' : ''
                  } ${
                    isSelected ? 'ring-2 ring-white z-10' : ''
                  } ${
                    isFuture ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      isToday ? 'text-amber-400 font-black underline' : 'text-slate-300'
                    }`}>
                      {cell.date.getDate()}
                    </span>

                    {cell.isGoalMet && (
                      <span className="text-[10px] text-emerald-400 font-bold" title="Daily Goal Met!">
                        🎯
                      </span>
                    )}

                    {cell.isInCurrentStreak && !cell.isGoalMet && (
                      <span className="text-[10px] text-amber-400" title="Active Streak Day">
                        🔥
                      </span>
                    )}
                  </div>

                  <div>
                    {cell.minutes > 0 ? (
                      <div className="space-y-0.5">
                        <span className={`text-[11px] sm:text-xs font-mono font-black block truncate ${
                          cell.isGoalMet ? 'text-emerald-300' : 'text-slate-300'
                        }`}>
                          {cell.hours}h
                        </span>
                        <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${cell.isGoalMet ? 'bg-emerald-400' : 'bg-slate-600'}`}
                            style={{ width: `${Math.min(100, cell.percentageOfGoal)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[9.5px] font-mono text-slate-600 block">Rest</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INSPECTION TOOLTIP / CARD FOR SELECTED OR HOVERED DAY */}
      {(hoveredDay || activeSelectedDay) && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 animate-fadeIn space-y-3 font-mono">
          {(() => {
            const displayDay = hoveredDay || activeSelectedDay!;
            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-sans">
                      {displayDay.date.toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                    {displayDay.dateStr === todayStr && (
                      <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                      displayDay.isGoalExceeded
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : displayDay.isGoalMet
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : displayDay.minutes > 0
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {displayDay.isGoalExceeded 
                        ? '🚀 Super Goal Exceeded' 
                        : displayDay.isGoalMet 
                        ? '🎯 Daily Target Met' 
                        : displayDay.minutes > 0 
                        ? '⚡ In Progress' 
                        : '😴 Rest Day'}
                    </span>

                    {displayDay.isInCurrentStreak && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                        <Flame className="h-3 w-3 fill-amber-400" />
                        Active Streak
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Focus Time</span>
                    <span className="text-sm font-bold text-white font-sans">
                      {formatMins(displayDay.minutes)} ({displayDay.hours}h)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Daily Target</span>
                    <span className="text-sm font-bold text-slate-300 font-sans">
                      {formatMins(displayDay.goalMinutes)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Goal Progress</span>
                    <span className={`text-sm font-bold font-sans ${displayDay.isGoalMet ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {displayDay.percentageOfGoal}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Sessions Count</span>
                    <span className="text-sm font-bold text-slate-300 font-sans">
                      {displayDay.sessionsCount} session{displayDay.sessionsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Subjects breakdown on that day if available */}
                {displayDay.subjectsStudied.length > 0 && (
                  <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Subjects:</span>
                    {displayDay.subjectsStudied.map(sub => (
                      <span 
                        key={sub.subjectId}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10.5px] text-slate-300"
                      >
                        <strong className="text-white font-bold">{sub.subjectId}</strong>: {formatMins(sub.minutes)}
                      </span>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ADJUST DAILY GOAL MODAL */}
      {renderGoalModal()}

    </div>
  );
}
